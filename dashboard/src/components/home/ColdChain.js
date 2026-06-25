"use client";

import Reveal from "./Reveal";

const display = "var(--font-archivo)";
const mono = "var(--font-ibm-plex-mono), monospace";

const LINE_POINTS = "M0,118 L65,112 L130,120 L195,104 L260,110 L325,98 L390,108 L455,92 L520,100";

export default function ColdChain() {
  return (
    <section id="frio" style={{ background: "#F3F0E9", borderTop: "1px solid #E8E2D6" }}>
      <div
        className="bf-frio-grid"
        style={{ maxWidth: "1220px", margin: "0 auto", padding: "96px clamp(18px, 4vw, 34px)", display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: "64px", alignItems: "center" }}
      >
        {/* temp chart mock */}
        <Reveal style={{ borderRadius: "18px", background: "#fff", border: "1px solid #E8E2D6", boxShadow: "0 30px 60px -30px rgba(42,11,7,.28)", overflow: "hidden", order: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #ECE8DF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1F8A5B", animation: "bfpulse 1.8s infinite" }} aria-hidden="true" />
              <span style={{ fontFamily: mono, fontSize: "11px", fontWeight: 600, letterSpacing: ".05em", color: "#3A4049" }}>TRK-118 · CADENA DE FRÍO</span>
            </div>
            <span style={{ fontFamily: mono, fontSize: "11px", color: "#1F8A5B", fontWeight: 600 }}>EN RANGO</span>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontSize: "30px", fontWeight: 600, color: "#1A1C1F" }}>2.1°C</span>
              <span style={{ fontSize: "12px", color: "#8A8579" }}>límite 4.0°C · La&nbsp;Piedad → CDMX</span>
            </div>
            <svg
              viewBox="0 0 520 150"
              style={{ width: "100%", height: "auto", display: "block" }}
              role="img"
              aria-label="Gráfica de temperatura del tráiler TRK-118: la lectura se mantiene cerca de 2.1°C, por debajo del límite de 4.0°C durante toda la ruta."
            >
              <line x1="0" y1="42" x2="520" y2="42" stroke="#F0CFC8" strokeWidth="1.5" strokeDasharray="5 5" />
              <text x="4" y="36" fontFamily="var(--font-ibm-plex-mono), monospace" fontSize="10" fill="#C0392B">límite 4.0°C</text>
              <path
                d="M0,118 L65,112 L130,120 L195,104 L260,110 L325,98 L390,108 L455,92 L520,100 L520,150 L0,150 Z"
                fill="url(#fg)"
                opacity="0.5"
              />
              <path
                data-bfdraw=""
                d={LINE_POINTS}
                fill="none"
                stroke="#1F8A5B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1100"
                strokeDashoffset="1100"
                style={{ animation: "bfdraw 2.2s ease-out forwards" }}
              />
              <circle cx="520" cy="100" r="4.5" fill="#1F8A5B" stroke="#fff" strokeWidth="2" />
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1F8A5B" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#1F8A5B" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "#ECE8DF", borderRadius: "11px", overflow: "hidden", marginTop: "16px" }}>
              <div style={{ background: "#FBFAF7", padding: "13px 14px" }}>
                <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".06em", color: "#8A8579" }}>DENTRO DE RANGO</div>
                <div style={{ fontFamily: mono, fontSize: "16px", fontWeight: 600, color: "#1A1C1F", marginTop: "4px" }}>99.96%</div>
              </div>
              <div style={{ background: "#FBFAF7", padding: "13px 14px" }}>
                <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".06em", color: "#8A8579" }}>UNIDADES EN RUTA</div>
                <div style={{ fontFamily: mono, fontSize: "16px", fontWeight: 600, color: "#1A1C1F", marginTop: "4px" }}>42</div>
              </div>
              <div style={{ background: "#FBFAF7", padding: "13px 14px" }}>
                <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".06em", color: "#8A8579" }}>EXCURSIONES HOY</div>
                <div style={{ fontFamily: mono, fontSize: "16px", fontWeight: 600, color: "#C0392B", marginTop: "4px" }}>1</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal style={{ order: 2 }}>
          <div style={{ fontFamily: mono, fontSize: "11px", fontWeight: 500, letterSpacing: ".16em", color: "var(--ac)" }}>03 — CADENA DE FRÍO</div>
          <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(30px,4vw,42px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#1A1C1F", margin: "16px 0 0", textWrap: "balance" }}>
            El frío no se rompe entre dos pantallas
          </h2>
          <p style={{ fontSize: "16.5px", lineHeight: 1.6, color: "#6B6B63", margin: "20px 0 0", maxWidth: "430px", fontWeight: 450 }}>
            Cada unidad refrigerada transmite temperatura en vivo. Una excursión térmica no es un correo a la mañana siguiente: es una alerta y una propuesta de reruteo, lista para autorizar.
          </p>
          <div style={{ display: "flex", gap: "38px", marginTop: "32px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: "34px", color: "#1A1C1F", letterSpacing: "-.03em" }}>
                −40<span style={{ fontSize: "20px", color: "#B7AF9E" }}> a </span>+4°C
              </div>
              <div style={{ fontSize: "13px", color: "#7A746B", marginTop: "6px" }}>rango monitoreado por unidad</div>
            </div>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: "34px", color: "#1A1C1F", letterSpacing: "-.03em" }}>
                &lt;&thinsp;90<span style={{ fontSize: "20px", color: "#B7AF9E" }}>s</span>
              </div>
              <div style={{ fontSize: "13px", color: "#7A746B", marginTop: "6px" }}>de excursión a propuesta de acción</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
