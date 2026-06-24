#!/usr/bin/env python3
"""
serve.py — standalone launcher for the BAFAR OS "Visión IA" backend.

Replaces Streamlit as the entrypoint. It:
  1. provisions the Appwrite schema (idempotent),
  2. starts the CV + MJPEG + JSON-API server on port 8502,
  3. runs a sync thread that mirrors CV detections into Appwrite and turns
     critical QC defects into human-authorizable pending actions.

Run:  python serve.py   (then open BAFAR OS.dc.html)
"""

import os
import re
import time
import threading

# --- Appwrite credentials (the server key lives ONLY here / in env) ---------
os.environ.setdefault("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1")
os.environ.setdefault("APPWRITE_PROJECT_ID", "69fa0779002b02b00ec1")
os.environ.setdefault(
    "APPWRITE_API_KEY",
    "standard_258415855e52f69c8f94c9fa7541976a0427d19e7663e0b7fb44a17f7fa0d118"
    "96702fc8d05c5a38b0717b1051cc6cdbad43a83d71f0a2eb1e70e9e3d4b0c5e8f1208d107"
    "ba140366c608332096e2d990ca28edbbf9e81075ae90eb5fa76173dd589bbed1c04d70d5b"
    "71165d703b01359724f885194553c568a959463669c113",
)

import mjpeg_server
import appwrite_db

POLL_SEC = 1.0
SNAPSHOT_EVERY_SEC = 10.0

# Site each scenario maps to (for the dashboard's site colouring)
SCENARIO_SITE = {
    "Parma Produce": "piedad",
    "Sabori Bottling": "piedad",
    "Logistics": "chih",
}


def parse_event(scenario, text):
    """Turn a raw CV event string into (kind, label, fields-dict)."""
    # strip "[HH:MM:SS] " prefix
    body = re.sub(r"^\[\d{2}:\d{2}:\d{2}\]\s*", "", text).strip()
    fields = {"site": SCENARIO_SITE.get(scenario, "")}

    m = re.search(r"ID:(\d+)", body)
    if m:
        fields["object_id"] = int(m.group(1))
    m = re.search(r"Slot\s*(\d+)", body)
    if m:
        fields["slot"] = int(m.group(1))
    m = re.search(r"Angle:\s*([\d.]+)", body)
    if m:
        fields["value"] = float(m.group(1))
    else:
        m = re.search(r"Fill:\s*([\d.]+)", body)
        if m:
            fields["value"] = float(m.group(1))

    low = body.lower()
    if body.startswith("ALERT") or "alert" in low[:6]:
        fields["severity"] = "critico"
        return ("defect", body, fields)
    if "passed quality" in low:
        return ("pass", body, fields)
    if "entered gate" in low or "(in #" in low:
        return ("gate_in", body, fields)
    if "exited gate" in low or "(out #" in low:
        return ("gate_out", body, fields)
    if "counted" in low:
        return ("count", body, fields)
    return ("event", body, fields)


def _map_action_doc(doc):
    """Appwrite pending_actions doc -> clean dict for the frontend mirror."""
    return {
        "action_id": doc.get("action_id"),
        "scenario": doc.get("scenario"),
        "sev": doc.get("sev", "critico"),
        "cat": doc.get("cat", "Calidad"),
        "title": doc.get("title", ""),
        "detail": doc.get("detail", ""),
        "rec": doc.get("rec", ""),
        "approver": doc.get("approver", "QA Inocuidad"),
    }


def refresh_ai_mirror():
    """Pull open AI actions from Appwrite into the live state for /api/state."""
    open_docs = appwrite_db.list_open_actions()
    mirror = [_map_action_doc(d) for d in open_docs if d.get("source") == "ai"]
    with mjpeg_server._state_lock:
        mjpeg_server.state["ai_actions"] = mirror
    return mirror


def make_defect_action(scenario, label, fields):
    aid = "ai-%s-%d" % (scenario.split()[0].lower(), int(time.time() * 1000) % 100000000)
    slot = fields.get("slot")
    val = fields.get("value")
    low = label.lower()
    if "crooked" in low:
        desc = "Tapa torcida detectada en la Línea de Embotellado Sabori"
        if val is not None:
            desc += " (desviación %.1f°)" % val
    elif "underfill" in low:
        desc = "Botella con llenado insuficiente en la Línea de Embotellado Sabori"
        if val is not None:
            desc += " (nivel %.1f%%)" % val
    else:
        desc = "Defecto de calidad detectado por Visión IA en la Línea Sabori"
    if slot:
        desc += ", Slot %s" % slot
    detail = desc + "."
    return {
        "action_id": aid,
        "scenario": scenario,
        "sev": "critico",
        "cat": "Calidad",
        "title": "Bloqueo de lote · defecto detectado por Visión IA",
        "detail": detail,
        "rec": "Bloquear el lote afectado y ordenar reinspección 100% antes de liberar.",
        "approver": "QA Inocuidad",
    }


def sync_loop():
    last_count = 0
    last_snapshot = 0.0
    open_defect_actions = 0  # throttle: one open AI defect action at a time

    while True:
        try:
            with mjpeg_server._state_lock:
                scenario = mjpeg_server.state["scenario"]
                events = list(mjpeg_server.state["events"])

            # counters were reset (scenario switch or reset button) -> rewind
            if len(events) < last_count:
                last_count = 0

            new_events = events[last_count:]
            last_count = len(events)

            for raw in new_events:
                kind, label, fields = parse_event(scenario, raw)
                appwrite_db.log_event(scenario, kind, label, **fields)

                # AI -> human-authorization tie-in (Sabori defects only)
                if kind == "defect" and scenario == "Sabori Bottling":
                    if open_defect_actions < 1:
                        action = make_defect_action(scenario, label, fields)
                        if appwrite_db.create_pending_action(action):
                            open_defect_actions = 1

            # Refresh the mirror; recompute throttle from what's actually open
            mirror = refresh_ai_mirror()
            open_defect_actions = sum(
                1 for a in mirror if a.get("scenario") == "Sabori Bottling")

            # Periodic aggregate snapshot
            now = time.time()
            if now - last_snapshot >= SNAPSHOT_EVERY_SEC:
                snap = mjpeg_server.build_state_snapshot()
                appwrite_db.upsert_run_snapshot(
                    scenario,
                    count=snap.get("sausage_count") or snap.get("packaging_count")
                    or snap.get("logistics_in") or 0,
                    defects=snap.get("packaging_defects", 0),
                    rate=snap.get("rate", 0.0),
                    quality_index=snap.get("quality_index", 0.0),
                    in_yard=snap.get("in_yard", 0),
                )
                last_snapshot = now

        except Exception as e:
            print("[sync] error: %s" % e)

        time.sleep(POLL_SEC)


def main():
    print("=" * 60)
    print(" BAFAR OS — Visión IA backend")
    print("=" * 60)
    print("[appwrite] provisioning schema...")
    appwrite_db.ensure_schema()

    mjpeg_server.start_mjpeg_server()
    print("[server] MJPEG + API on http://127.0.0.1:8502")
    print("[server]   /video_feed   (live processed stream)")
    print("[server]   /api/state    (JSON telemetry)")
    print("[server]   /api/control  (POST controls)")

    t = threading.Thread(target=sync_loop, name="Appwrite_Sync_Thread", daemon=True)
    t.start()
    print("[sync] Appwrite sync thread started")
    print("\nReady. Open 'BAFAR OS.dc.html' and go to the Visión IA screen.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down.")


if __name__ == "__main__":
    main()
