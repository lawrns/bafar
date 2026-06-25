// Server-only route. Reads the real BAFAR OS Appwrite database and returns
// aggregates for the homepage STATS BAND. The Appwrite server API key is read
// exclusively from process.env here and is NEVER exposed to the client.
//
// FAIL-SOFT: if env is missing or Appwrite is unreachable/slow, we return a
// 200 with sensible static fallback numbers and `source: "fallback"`. We never
// throw a 500 — the marketing homepage must always render.

import { NextResponse } from "next/server";

// Always run this on the server at request time (never statically cached at build).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ENDPOINT = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "").replace(/\/+$/, "");
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const API_KEY = process.env.APPWRITE_API_KEY || "";
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "bafar_os";

const COL_EVENTS = "detection_events";
const COL_RUNS = "production_runs";
const COL_ACTIONS = "pending_actions";

// Static fallback numbers (kept in sync with the design's narrative).
const FALLBACK = {
  source: "fallback",
  detections: 933,
  productionRuns: 729,
  pendingActions: 3,
  latestRun: {
    qualityIndex: 99.3,
    rate: 30,
    inYard: 8,
  },
  // Marketing headline stats (not stored as raw counts in Appwrite).
  oee: 98.2,
  mermas: 31,
  inspeccion: 100,
  sedes: 4,
};

function configured() {
  return Boolean(ENDPOINT && PROJECT_ID && API_KEY);
}

async function appwriteGet(collectionId, queries, timeoutMs = 4000) {
  const url = new URL(
    `${ENDPOINT}/databases/${DB_ID}/collections/${collectionId}/documents`
  );
  for (const q of queries) {
    url.searchParams.append("queries[]", q);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Key": API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Network error, abort/timeout, DNS, etc. — fail soft.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// A limit:1 read returns the collection `total` cheaply (Appwrite reports the
// full count regardless of the page size), plus the documents we asked for.
const Q_COUNT = JSON.stringify({ method: "limit", values: [1] });
const Q_LATEST_BY_CREATED = JSON.stringify({ method: "orderDesc", attribute: "$createdAt" });
const Q_LATEST_BY_TS = JSON.stringify({ method: "orderDesc", attribute: "ts" });

function numOr(value, fallback) {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  if (!configured()) {
    return NextResponse.json(FALLBACK, { status: 200 });
  }

  try {
    const [eventsRes, runsCountRes, latestRunRes, actionsRes] = await Promise.all([
      appwriteGet(COL_EVENTS, [Q_COUNT]),
      appwriteGet(COL_RUNS, [Q_COUNT]),
      // Latest production run: order by ts desc, take 1. Fall back to $createdAt
      // ordering if the `ts` index/attribute is unavailable.
      appwriteGet(COL_RUNS, [Q_LATEST_BY_TS, Q_COUNT]).then(
        (r) => r || appwriteGet(COL_RUNS, [Q_LATEST_BY_CREATED, Q_COUNT])
      ),
      appwriteGet(COL_ACTIONS, [Q_COUNT]),
    ]);

    // If every probe failed, Appwrite is effectively unreachable -> fallback.
    if (!eventsRes && !runsCountRes && !latestRunRes && !actionsRes) {
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    const detections = eventsRes ? numOr(eventsRes.total, FALLBACK.detections) : FALLBACK.detections;
    const productionRuns = runsCountRes
      ? numOr(runsCountRes.total, FALLBACK.productionRuns)
      : FALLBACK.productionRuns;
    const pendingActions = actionsRes
      ? numOr(actionsRes.total, FALLBACK.pendingActions)
      : FALLBACK.pendingActions;

    const latestDoc =
      latestRunRes && Array.isArray(latestRunRes.documents) && latestRunRes.documents.length
        ? latestRunRes.documents[0]
        : null;

    const latestRun = latestDoc
      ? {
          qualityIndex: numOr(latestDoc.quality_index, FALLBACK.latestRun.qualityIndex),
          rate: numOr(latestDoc.rate, FALLBACK.latestRun.rate),
          inYard: numOr(latestDoc.in_yard, FALLBACK.latestRun.inYard),
        }
      : FALLBACK.latestRun;

    return NextResponse.json(
      {
        source: "appwrite",
        detections,
        productionRuns,
        pendingActions,
        latestRun,
        // Marketing headline stats are derived/static — Appwrite stores the raw
        // operational data, not these rolled-up percentages.
        oee: FALLBACK.oee,
        mermas: FALLBACK.mermas,
        inspeccion: FALLBACK.inspeccion,
        sedes: FALLBACK.sedes,
      },
      { status: 200 }
    );
  } catch {
    // Belt-and-suspenders: never 500 the marketing page.
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
