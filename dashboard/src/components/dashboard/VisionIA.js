"use client";

import React from "react";
import SpotlightCard from "../ui/SpotlightCard";
import MagneticButton from "../ui/MagneticButton";

export default function VisionIA({
  visionChips,
  visionOnline,
  visionOffline,
  visionStreamLabel,
  toggleVisionPlay,
  resetVision,
  visionPlayLabel,
  visionStateLabel,
  visionStateColor,
  visionLog,
  visionLogEmpty,
  visionPrimaryLabel,
  visionPrimaryVal,
  visionPrimaryDelta,
  visionSecLabel,
  visionSecVal,
  visionSecColor,
  visionSecDelta,
  visionEngine,
  visionActiveTargets,
  visionGateLabel,
  visionGateVal,
  camRows
}) {
  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
          Inspección Visual con IA
        </h1>
        <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px", maxWidth: "760px" }}>
          Detección, conteo y control de calidad en tiempo real sobre las líneas de proceso, con YOLOv8 corriendo en el nodo edge. Cada hallazgo crítico genera una acción que un humano autoriza.
        </p>
      </div>

      {/* Offline Warning Banner */}
      {visionOffline && (
        <div style={{ display: "flex", alignItems: "center", gap: "11px", padding: "13px 18px", borderRadius: "12px", background: "#FBF1DF", border: "1px solid #EAD6A8", marginBottom: "16px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#B9760F", flex: "none" }} />
          <span style={{ fontSize: "13px", color: "#7A5410", fontWeight: 500 }}>
            Nodo de Visión IA desconectado. Inicia <code style={{ background: "#F2E6C9", padding: "1px 6px", borderRadius: "5px", fontFamily: "'IBM Plex Mono'" }}>python serve.py</code> en la terminal para transmitir el análisis en vivo.
          </span>
        </div>
      )}

      {/* Scenario Chips Picker */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        {visionChips && visionChips.map((c, idx) => (
          <button
            key={idx}
            onClick={c.onClick}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "11px 16px",
              borderRadius: "11px",
              cursor: "pointer",
              fontFamily: "inherit",
              border: c.active ? "1px solid rgba(225, 29, 72, 0.3)" : "1px solid var(--border-color)",
              background: c.active ? "rgba(225, 29, 72, 0.08)" : "var(--bg-card)",
              minWidth: "150px",
              textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: c.active ? "var(--text-main)" : "var(--text-muted)" }}>
              {c.label}
            </div>
            <div style={{ fontSize: "10.5px", color: c.active ? "var(--accent)" : "#52525b", marginTop: "2px", fontWeight: 500 }}>
              {c.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Split grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px", alignItems: "start", marginBottom: "18px" }}>
        <div>
          {/* Live stream */}
          <SpotlightCard style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid var(--border-color)", position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
                {visionStreamLabel}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", fontWeight: 700, color: "#ef4444" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} className="animate-pulse-custom" />
                  EN VIVO
                </span>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.03em", padding: "3px 9px", borderRadius: "20px", color: "#2c6fb5", background: "rgba(44, 111, 181, 0.15)" }}>
                  1280×720 · YOLOv8
                </span>
              </div>
            </div>
            <div style={{ background: "var(--bg-primary)", minHeight: "300px", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>
              {visionOnline && (
                <img src="http://127.0.0.1:8502/video_feed" style={{ width: "100%", display: "block" }} alt="YOLOv8 Live feed" />
              )}
              {visionOffline && (
                <div style={{ padding: "60px 24px", textAlign: "center", color: "#7a828e" }}>
                  <div style={{ fontSize: "30px", marginBottom: "10px", opacity: 0.5 }}>📷</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>
                    Nodo edge desconectado
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "5px", color: "#52525b" }}>
                    Inicia el backend para ver el stream en vivo
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "13px 16px", borderTop: "1px solid var(--border-color)", position: "relative", zIndex: 2 }}>
              <button onClick={toggleVisionPlay} className="magnetic-btn" style={{ padding: "8px 16px", borderRadius: "9px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-main)", fontWeight: 600, fontSize: "12.5px" }}>
                {visionPlayLabel}
              </button>
              <button onClick={resetVision} className="magnetic-btn" style={{ padding: "8px 16px", borderRadius: "9px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-main)", fontWeight: 600, fontSize: "12.5px" }}>
                ↺ Reiniciar
              </button>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "7px", fontSize: "11.5px", fontWeight: 700, color: visionStateColor }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: visionStateColor }} />
                {visionStateLabel}
              </span>
            </div>
          </SpotlightCard>

          {/* Detection log */}
          <SpotlightCard style={{ padding: "16px 18px", borderRadius: "14px", marginTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "11px", position: "relative", zIndex: 2 }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", flex: "none" }} className="animate-pulse-custom" />
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
                BITÁCORA DE DETECCIÓN
              </span>
            </div>
            <div style={{ maxHeight: "220px", overflowY: "auto", position: "relative", zIndex: 2 }}>
              {visionLog && visionLog.map((l, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "7px 0", borderBottom: "1px solid var(--border-color)" }}>
                  <span style={{ fontFamily: "IBM Plex Mono", fontSize: "11px", color: "var(--text-muted)", flex: "none", width: "62px" }}>
                    {l.t}
                  </span>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: l.color, flex: "none" }} />
                  <span style={{ fontSize: "12px", color: "var(--text-main)", fontFamily: "IBM Plex Mono" }}>
                    {l.msg}
                  </span>
                </div>
              ))}
              {visionLogEmpty && (
                <div style={{ padding: "22px 4px", textAlign: "center", fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Esperando detecciones... (reproduce el stream para registrar eventos)
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* Metrics Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
          <SpotlightCard style={{ padding: "16px 18px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.03em", fontWeight: 600, position: "relative", zIndex: 2 }}>
              {visionPrimaryLabel}
            </div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "27px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>
              {visionPrimaryVal}
            </div>
            <div style={{ fontSize: "11px", marginTop: "2px", color: "#22c55e", fontWeight: 500, position: "relative", zIndex: 2 }}>
              {visionPrimaryDelta}
            </div>
          </SpotlightCard>

          <SpotlightCard style={{ padding: "16px 18px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.03em", fontWeight: 600, position: "relative", zIndex: 2 }}>
              {visionSecLabel}
            </div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "27px", color: visionSecColor, fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>
              {visionSecVal}
            </div>
            <div style={{ fontSize: "11px", marginTop: "2px", color: "var(--text-muted)", fontWeight: 500, position: "relative", zIndex: 2 }}>
              {visionSecDelta}
            </div>
          </SpotlightCard>

          <div style={{ padding: "16px 18px", borderRadius: "12px", background: "var(--bg-sidebar)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "9px" }}>
              MOTOR DE DETECCIÓN IA
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-main)" }}>
              {visionEngine}
            </div>
            <div style={{ height: "1px", background: "var(--border-color)", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "5px" }}>
              <span style={{ color: "var(--text-muted)" }}>Objetivos activos</span>
              <span style={{ fontFamily: "IBM Plex Mono", color: "var(--text-main)", fontWeight: 600 }}>{visionActiveTargets}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
              <span style={{ color: "var(--text-muted)" }}>{visionGateLabel}</span>
              <span style={{ fontFamily: "IBM Plex Mono", color: "var(--text-main)", fontWeight: 600 }}>{visionGateVal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edge Cameras Table */}
      <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>
          NODOS EDGE Y CÁMARAS INDUSTRIALES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 2fr 0.7fr 0.9fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
          <div>NODO CÁMARA</div>
          <div>IP / RTSP</div>
          <div>UBICACIÓN</div>
          <div>LATENCIA</div>
          <div>ESTADO</div>
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          {camRows && camRows.map((r, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 2fr 0.7fr 0.9fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center" }}>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", color: "var(--text-main)", fontWeight: 600 }}>
                {r.id}
              </div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: "11.5px", color: "var(--text-muted)" }}>
                {r.ip}
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                {r.zone}
              </div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", color: "var(--text-muted)" }}>
                {r.lat}
              </div>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>
                  {r.stLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
