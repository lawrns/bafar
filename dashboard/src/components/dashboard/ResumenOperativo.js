"use client";

import React from "react";
import SpotlightCard from "../ui/SpotlightCard";

export default function ResumenOperativo({
  sites,
  flow,
  resumenKpis,
  pendingMini,
  feed,
  pendN,
  allClear,
  goAcc
}) {
  return (
    <div className="animate-fade-in">
      {/* Title block */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
          Resumen Operativo
        </h1>
        <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>
          Estado de la operación del corral al anaquel, en tiempo real, a través de las cuatro sedes.
        </p>
      </div>

      {/* Sites Grid */}
      <div className="bf-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "18px" }}>
        {sites && sites.map((s, idx) => (
          <SpotlightCard key={idx} style={{ padding: "17px 18px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "Archivo", fontWeight: 700, fontSize: "15px", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.name}
              </div>
              <span style={{
                flex: "none",
                fontSize: "9.5px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "3px 8px",
                borderRadius: "20px",
                color: s.stColor,
                background: s.stBg,
                whiteSpace: "nowrap"
              }}>
                {s.stLabel}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px", height: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", position: "relative", zIndex: 2 }}>
              {s.type}
            </div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "21px", color: "var(--text-main)", fontWeight: 600, marginTop: "14px", position: "relative", zIndex: 2 }}>
              {s.metric}
            </div>
            <div style={{ fontSize: "11.5px", color: s.alertColor, marginTop: "4px", fontWeight: 500, position: "relative", zIndex: 2 }}>
              {s.alertText}
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Process Flow pipeline */}
      <SpotlightCard style={{ padding: "20px 22px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", marginBottom: "18px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "16px", position: "relative", zIndex: 2 }}>
          FLUJO DE PROCESO COMPLETO (DESDE GANADERÍA HASTA RETAIL)
        </div>
        <div className="bf-flow" style={{ display: "flex", alignItems: "stretch", position: "relative", zIndex: 2 }}>
          {flow && flow.map((fl, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{
                flex: 1,
                minWidth: 0,
                padding: "13px 12px",
                borderRadius: "11px",
                background: fl.stColor === "#1F8A5B" ? "var(--bg-primary)" : fl.stBg || "rgba(225, 29, 72, 0.05)",
                border: `1px solid ${fl.stColor === "#1F8A5B" ? "var(--border-color)" : "rgba(225, 29, 72, 0.15)"}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: fl.stColor, flex: "none" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.15 }}>
                    {fl.k}
                  </span>
                </div>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: "14px", color: "var(--text-main)", marginTop: "9px", fontWeight: 600 }}>
                  {fl.v}
                </div>
                <div style={{ fontSize: "10px", color: fl.stColor, fontWeight: 600, marginTop: "3px" }}>
                  {fl.stLabel}
                </div>
              </div>
              {fl.arrow && <span className="pipeline-arrow">›</span>}
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* KPI Strip */}
      <div className="bf-kpis6" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {resumenKpis && resumenKpis.map((k, idx) => (
          <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.03em", fontWeight: 600, lineHeight: 1.25, height: "26px", position: "relative", zIndex: 2 }}>
              {k.k}
            </div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "21px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>
              {k.v}
            </div>
            <div style={{ fontSize: "10.5px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>
              {k.d}
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Split section */}
      <div className="bf-split2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
        {/* Actions Pending Mini list */}
        <SpotlightCard style={{ padding: "18px 20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "13px", position: "relative", zIndex: 2 }}>
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
              ACCIONES QUE REQUIEREN TU AUTORIZACIÓN
            </span>
            <span style={{ fontSize: "11.5px", color: "var(--accent)", fontWeight: 700 }}>
              {pendN}
            </span>
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            {pendingMini && pendingMini.map((p, idx) => (
              <div key={idx} onClick={goAcc} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.sevColor, flex: "none" }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "12.5px", color: "var(--text-main)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "1px" }}>
                    {p.cat} · {p.approver}
                  </div>
                </div>
                <span style={{ fontSize: "16px", color: "#52525b", flex: "none" }}>›</span>
              </div>
            ))}
            {allClear && (
              <div style={{ padding: "22px 8px", textAlign: "center", color: "var(--text-muted)", fontSize: "12.5px" }}>
                Sin acciones pendientes. La operación corre con normalidad.
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* Live log feed */}
        <SpotlightCard style={{ padding: "18px 20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "13px", position: "relative", zIndex: 2 }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", flex: "none" }} className="animate-pulse-custom" />
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
              BITÁCORA EN VIVO
            </span>
          </div>
          <div style={{ maxHeight: "210px", overflowY: "auto", position: "relative", zIndex: 2 }}>
            {feed && feed.map((f, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: "11px", color: "var(--text-muted)", flex: "none", width: "60px" }}>
                  {f.t}
                </span>
                <span style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.02em", flex: "none", width: "82px", color: f.c }}>
                  {f.a}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-main)" }}>
                  {f.m}
                </span>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
