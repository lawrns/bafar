"""
appwrite_db.py — thin Appwrite REST wrapper for the BAFAR OS demo.

The Python CV backend is the ONLY holder of the server API key; the HTML
dashboard never talks to Appwrite directly. Every call is fail-soft: if
Appwrite is unreachable (e.g. venue wifi drops), persistence degrades but the
live vision demo keeps running.

Schema (database `bafar_os`):
  - detection_events  : every counted item / QC pass / defect / gate crossing
  - production_runs   : periodic aggregate snapshots (for analytics history)
  - pending_actions   : AI-generated actions awaiting human authorization
"""

import os
import time
import json

import requests

# --- Credentials (env first, then known demo defaults) ----------------------
ENDPOINT = os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1").rstrip("/")
PROJECT_ID = os.environ.get("APPWRITE_PROJECT_ID", "69fa0779002b02b00ec1")
API_KEY = os.environ.get(
    "APPWRITE_API_KEY",
    "standard_258415855e52f69c8f94c9fa7541976a0427d19e7663e0b7fb44a17f7fa0d118"
    "96702fc8d05c5a38b0717b1051cc6cdbad43a83d71f0a2eb1e70e9e3d4b0c5e8f1208d107"
    "ba140366c608332096e2d990ca28edbbf9e81075ae90eb5fa76173dd589bbed1c04d70d5b"
    "71165d703b01359724f885194553c568a959463669c113",
)

DB_ID = "bafar_os"
COL_EVENTS = "detection_events"
COL_RUNS = "production_runs"
COL_ACTIONS = "pending_actions"

_HEADERS = {
    "X-Appwrite-Project": PROJECT_ID,
    "X-Appwrite-Key": API_KEY,
    "Content-Type": "application/json",
}

# When Appwrite errors hard, back off so we don't hammer it every tick.
_disabled_until = 0.0


def available():
    return time.time() >= _disabled_until


def _req(method, path, body=None, params=None, timeout=8):
    """Single request helper. Returns (status_code, json_or_None). Fail-soft."""
    global _disabled_until
    if not available():
        return (0, None)
    url = ENDPOINT + path
    try:
        resp = requests.request(
            method, url, headers=_HEADERS,
            data=json.dumps(body) if body is not None else None,
            params=params, timeout=timeout,
        )
        try:
            data = resp.json()
        except ValueError:
            data = None
        return (resp.status_code, data)
    except requests.RequestException as e:
        print("[appwrite] request failed (%s %s): %s — pausing 30s" % (method, path, e))
        _disabled_until = time.time() + 30.0
        return (0, None)


def _ok(status):
    return 200 <= status < 300


def _exists(status):
    """An object that already exists (409) is success for idempotent setup."""
    return _ok(status) or status == 409


# --- Schema provisioning -----------------------------------------------------

_ATTRS = {
    COL_EVENTS: [
        ("string", "scenario", {"size": 64, "required": False}),
        ("string", "kind", {"size": 32, "required": False}),
        ("string", "label", {"size": 256, "required": False}),
        ("integer", "object_id", {"required": False}),
        ("integer", "slot", {"required": False}),
        ("float", "value", {"required": False}),
        ("string", "severity", {"size": 16, "required": False}),
        ("string", "site", {"size": 64, "required": False}),
        ("string", "ts", {"size": 32, "required": False}),
    ],
    COL_RUNS: [
        ("string", "scenario", {"size": 64, "required": False}),
        ("integer", "count", {"required": False}),
        ("integer", "defects", {"required": False}),
        ("float", "rate", {"required": False}),
        ("float", "quality_index", {"required": False}),
        ("integer", "in_yard", {"required": False}),
        ("string", "ts", {"size": 32, "required": False}),
    ],
    COL_ACTIONS: [
        ("string", "action_id", {"size": 64, "required": False}),
        ("string", "scenario", {"size": 64, "required": False}),
        ("string", "sev", {"size": 16, "required": False}),
        ("string", "cat", {"size": 64, "required": False}),
        ("string", "title", {"size": 256, "required": False}),
        ("string", "detail", {"size": 1024, "required": False}),
        ("string", "rec", {"size": 1024, "required": False}),
        ("string", "approver", {"size": 128, "required": False}),
        ("string", "status", {"size": 16, "required": False}),
        ("string", "source", {"size": 16, "required": False}),
        ("string", "created_at", {"size": 32, "required": False}),
        ("string", "resolved_at", {"size": 32, "required": False}),
    ],
}

_INDEXES = {
    COL_EVENTS: [("idx_scenario", "key", ["scenario"]), ("idx_ts", "key", ["ts"])],
    COL_ACTIONS: [("idx_status", "key", ["status"]), ("idx_action_id", "key", ["action_id"])],
    COL_RUNS: [("idx_run_scenario", "key", ["scenario"])],
}


def _create_attribute(col, atype, key, opts):
    body = {"key": key}
    body.update(opts)
    st, _ = _req("POST", "/databases/%s/collections/%s/attributes/%s" % (DB_ID, col, atype), body)
    return _exists(st)


def _wait_attributes_available(col, timeout=40):
    """Indexes can only be built once attributes finish processing."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        st, data = _req("GET", "/databases/%s/collections/%s/attributes" % (DB_ID, col))
        if not _ok(st) or not data:
            return False
        attrs = data.get("attributes", [])
        if attrs and all(a.get("status") == "available" for a in attrs):
            return True
        time.sleep(1.0)
    return False


def ensure_schema():
    """Idempotently create the database, collections, attributes and indexes."""
    if not available():
        print("[appwrite] disabled (cooldown) — skipping ensure_schema")
        return False

    st, _ = _req("POST", "/databases", {"databaseId": DB_ID, "name": "BAFAR OS"})
    if not _exists(st):
        print("[appwrite] could not create/confirm database (status %s) — running without persistence" % st)
        return False
    print("[appwrite] database '%s' ready" % DB_ID)

    for col in (COL_EVENTS, COL_RUNS, COL_ACTIONS):
        st, _ = _req("POST", "/databases/%s/collections" % DB_ID,
                     {"collectionId": col, "name": col, "documentSecurity": False, "permissions": []})
        if not _exists(st):
            print("[appwrite] collection '%s' failed (status %s)" % (col, st))
            continue
        for atype, key, opts in _ATTRS[col]:
            _create_attribute(col, atype, key, opts)
        _wait_attributes_available(col)
        for ikey, itype, iattrs in _INDEXES.get(col, []):
            _req("POST", "/databases/%s/collections/%s/indexes" % (DB_ID, col),
                 {"key": ikey, "type": itype, "attributes": iattrs})
        print("[appwrite] collection '%s' ready" % col)

    return True


# --- Writes / reads used at runtime -----------------------------------------

def _create_doc(col, data):
    st, doc = _req("POST", "/databases/%s/collections/%s/documents" % (DB_ID, col),
                   {"documentId": "unique()", "data": data})
    return doc if _ok(st) else None


def log_event(scenario, kind, label, **fields):
    data = {"scenario": scenario, "kind": kind, "label": label,
            "ts": fields.pop("ts", _now_iso())}
    for k in ("object_id", "slot", "value", "severity", "site"):
        if k in fields and fields[k] is not None:
            data[k] = fields[k]
    return _create_doc(COL_EVENTS, data)


def upsert_run_snapshot(scenario, count=0, defects=0, rate=0.0,
                        quality_index=0.0, in_yard=0):
    return _create_doc(COL_RUNS, {
        "scenario": scenario, "count": int(count), "defects": int(defects),
        "rate": float(rate), "quality_index": float(quality_index),
        "in_yard": int(in_yard), "ts": _now_iso(),
    })


def create_pending_action(action):
    """action: dict with action_id, scenario, sev, cat, title, detail, rec, approver."""
    data = {
        "action_id": action["action_id"],
        "scenario": action.get("scenario", ""),
        "sev": action.get("sev", "alto"),
        "cat": action.get("cat", "Calidad"),
        "title": action.get("title", ""),
        "detail": action.get("detail", ""),
        "rec": action.get("rec", ""),
        "approver": action.get("approver", "QA Inocuidad"),
        "status": "open",
        "source": "ai",
        "created_at": _now_iso(),
        "resolved_at": "",
    }
    return _create_doc(COL_ACTIONS, data)


def _find_action_docid(action_id):
    q = json.dumps({"method": "equal", "attribute": "action_id", "values": [action_id]})
    st, data = _req("GET", "/databases/%s/collections/%s/documents" % (DB_ID, COL_ACTIONS),
                    params={"queries[]": q})
    if _ok(st) and data and data.get("documents"):
        return data["documents"][0]["$id"]
    return None


def resolve_pending_action(action_id, ok):
    docid = _find_action_docid(action_id)
    if not docid:
        return None
    st, doc = _req("PATCH", "/databases/%s/collections/%s/documents/%s" % (DB_ID, COL_ACTIONS, docid),
                   {"data": {"status": "approved" if ok else "rejected", "resolved_at": _now_iso()}})
    return doc if _ok(st) else None


def list_open_actions():
    q = json.dumps({"method": "equal", "attribute": "status", "values": ["open"]})
    st, data = _req("GET", "/databases/%s/collections/%s/documents" % (DB_ID, COL_ACTIONS),
                    params={"queries[]": q})
    if _ok(st) and data:
        return data.get("documents", [])
    return []


def recent_events(n=25):
    q1 = json.dumps({"method": "orderDesc", "attribute": "$createdAt"})
    q2 = json.dumps({"method": "limit", "values": [n]})
    st, data = _req("GET", "/databases/%s/collections/%s/documents" % (DB_ID, COL_EVENTS),
                    params={"queries[]": [q1, q2]})
    if _ok(st) and data:
        return data.get("documents", [])
    return []


def _now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%S")


if __name__ == "__main__":
    print("Provisioning BAFAR OS Appwrite schema...")
    ensure_schema()
    print("Done.")
