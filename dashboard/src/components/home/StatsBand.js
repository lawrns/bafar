"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import CountUp from "./CountUp";

const display = "var(--font-archivo)";
const mono = "var(--font-ibm-plex-mono), monospace";

// Static defaults mirror the API fail-soft fallback so the band renders
// instantly (before the fetch resolves) and during reduced data scenarios.
const DEFAULTS = {
  oee: 98.2,
  mermas: 31,
  inspeccion: 100,
  sedes: 4,
  detections: 933,
  productionRuns: 729,
  pendingActions: 3,
  latestRun: { qualityIndex: 99.3, rate: 30, inYard: 8 },
  source: "fallback",
};

function HeadlineCell({ children, caption, first, last }) {
  return (
    <div
      style={{
        padding: first ? "34px 28px 34px 0" : last ? "34px 0 34px 28px" : "34px 28px",
        borderRight: last ? "none" : "1px solid #E2DBCD",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", fontFamily: display, fontWeight: 800, fontSize: "clamp(34px,5vw,50px)", letterSpacing: "-0.035em", color: "#1A1C1F", lineHeight: 1 }}>
        {children}
      </div>
      <div style={{ fontSize: "13.5px", color: "#6B6B63", marginTop: "12px", lineHeight: 1.45 }}>{caption}</div>
    </div>
  );
}

function RealCell({ label, value, accent }) {
  return (
    <div style={{ padding: "16px 18px" }}>
      <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".08em", color: "#8A8579" }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: "20px", fontWeight: 600, color: accent || "#1A1C1F", marginTop: "5px" }}>{value}</div>
    </div>
  );
}

export default function StatsBand() {
  const [stats, setStats] = useState(DEFAULTS);

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data) setStats({ ...DEFAULTS, ...data, latestRun: { ...DEFAULTS.latestRun, ...(data.latestRun || {}) } });
      })
      .catch(() => {
        /* keep defaults — fail soft */
      });
    return () => {
      alive = false;
    };
  }, []);

  const live = stats.source === "appwrite";

  return (
    <section id="resultados" style={{ background: "#F3F0E9" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "74px clamp(18px, 4vw, 34px)" }}>
        <Reveal
          className="bf-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 0,
            borderTop: "1px solid #E2DBCD",
            borderBottom: "1px solid #E2DBCD",
          }}
        >
          <HeadlineCell first caption="OEE promedio de planta, en las cuatro sedes">
            <CountUp to={stats.oee} decimals={1} />
            <span style={{ color: "var(--ac)", marginLeft: "1px" }}>%</span>
          </HeadlineCell>

          <HeadlineCell caption="Mermas contra el año anterior">
            <span style={{ color: "var(--ac)" }}>−</span>
            <CountUp to={stats.mermas} decimals={0} />
            <span style={{ color: "var(--ac)" }}>%</span>
          </HeadlineCell>

          <HeadlineCell caption="Inspección de calidad en línea con Visión IA">
            <CountUp to={stats.inspeccion} decimals={0} />
            <span style={{ color: "var(--ac)" }}>%</span>
          </HeadlineCell>

          <HeadlineCell last caption="Coordinadas desde una sola torre de control">
            <CountUp to={stats.sedes} decimals={0} />
            <span style={{ fontSize: "26px", color: "#B7AF9E", marginLeft: "8px", fontWeight: 700 }}>sedes</span>
          </HeadlineCell>
        </Reveal>

        {/* Real-time operational data from the bafar_os Appwrite database. */}
        <Reveal
          className="bf-realstats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "#E2DBCD", border: "1px solid #E2DBCD", borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden", marginTop: "1px" }}
        >
          <div style={{ background: "#FBFAF7" }}>
            <RealCell label="EVENTOS DE DETECCIÓN" value={Number(stats.detections).toLocaleString("es-MX")} />
          </div>
          <div style={{ background: "#FBFAF7" }}>
            <RealCell label="CORRIDAS DE PRODUCCIÓN" value={Number(stats.productionRuns).toLocaleString("es-MX")} />
          </div>
          <div style={{ background: "#FBFAF7" }}>
            <RealCell label="ÍNDICE DE CALIDAD (ÚLTIMA)" value={`${Number(stats.latestRun.qualityIndex).toLocaleString("es-MX", { maximumFractionDigits: 1 })}%`} accent="#1F8A5B" />
          </div>
          <div style={{ background: "#FBFAF7" }}>
            <RealCell label="ACCIONES PENDIENTES" value={Number(stats.pendingActions).toLocaleString("es-MX")} accent={stats.pendingActions > 0 ? "#C0392B" : "#1F8A5B"} />
          </div>
        </Reveal>

        <div style={{ marginTop: "14px", fontFamily: mono, fontSize: "10.5px", letterSpacing: ".04em", color: "#A9A293", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: live ? "#1F8A5B" : "#B7AF9E", animation: live ? "bfpulse 1.8s infinite" : "none" }} aria-hidden="true" />
          {live ? "DATOS EN VIVO · APPWRITE bafar_os" : "DATOS DE REFERENCIA · APPWRITE NO DISPONIBLE"}
        </div>
      </div>
    </section>
  );
}
