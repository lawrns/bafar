"use client";

import Reveal from "./Reveal";

const display = "var(--font-archivo)";
const mono = "var(--font-ibm-plex-mono), monospace";

const POINTS = [
  {
    title: "Detección en el edge, sin nube de por medio",
    desc: "Conteo, calidad y patio a 38 ms de latencia, aun sin enlace estable.",
  },
  {
    title: "Cada defecto crea una acción autorizable",
    desc: "El bloqueo de lote llega a la bandeja de quien tiene la facultad de aprobarlo.",
  },
  {
    title: "Toda decisión queda trazada en Appwrite",
    desc: "Quién, cuándo y por qué — auditable bajo régimen TIF / USDA.",
  },
];

function Check() {
  return (
    <span style={{ width: "24px", height: "24px", borderRadius: "7px", background: "rgba(95,208,138,.14)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: "1px" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5FD08A" strokeWidth="2.4" aria-hidden="true">
        <path d="M5 12l4 4L19 6" />
      </svg>
    </span>
  );
}

export default function VisionSpotlight() {
  return (
    <section id="vision" style={{ background: "#2A0B07", color: "#F1E8DE", position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(70% 90% at 20% 30%,#000,transparent)",
          WebkitMaskImage: "radial-gradient(70% 90% at 20% 30%,#000,transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        className="bf-vision-grid"
        style={{ maxWidth: "1220px", margin: "0 auto", padding: "100px clamp(18px, 4vw, 34px)", display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: "64px", alignItems: "center", position: "relative" }}
      >
        <Reveal>
          <div style={{ fontFamily: mono, fontSize: "11px", fontWeight: 500, letterSpacing: ".16em", color: "#E89A88" }}>02 — VISIÓN IA</div>
          <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(32px,4vw,44px)", lineHeight: 1.04, letterSpacing: "-0.03em", color: "#FBF5EC", margin: "16px 0 0", textWrap: "balance" }}>
            La IA detecta. Una persona autoriza.
          </h2>
          <p style={{ fontSize: "17px", lineHeight: 1.6, color: "#CFB7AC", margin: "22px 0 0", maxWidth: "440px", fontWeight: 450 }}>
            YOLOv8 corre en el nodo edge de cada línea: cuenta producto, mide calidad y marca defectos en milisegundos. Pero ninguna acción crítica se ejecuta sola.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "34px" }}>
            {POINTS.map((p) => (
              <div key={p.title} style={{ display: "flex", gap: "14px" }}>
                <Check />
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#F1E8DE" }}>{p.title}</div>
                  <div style={{ fontSize: "13.5px", color: "#B79A8F", marginTop: "3px", lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* authorization flow mock */}
        <Reveal style={{ borderRadius: "18px", background: "#0C100E", border: "1px solid rgba(241,232,222,.12)", boxShadow: "0 50px 90px -28px rgba(0,0,0,.7)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(241,232,222,.08)" }}>
            <span style={{ fontFamily: mono, fontSize: "11px", fontWeight: 600, letterSpacing: ".06em", color: "#9DA8A1" }}>ACCIONES PENDIENTES</span>
            <span style={{ fontFamily: mono, fontSize: "10.5px", fontWeight: 600, color: "#2A0B07", background: "#E7B84F", padding: "3px 8px", borderRadius: "6px" }}>3 ESPERAN</span>
          </div>
          <div style={{ padding: "8px 18px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "16px 0", borderBottom: "1px solid rgba(241,232,222,.07)" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#FF6B5A", flex: "none", animation: "bfpulse 1.8s infinite" }} aria-hidden="true" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#F1E8DE" }}>Bloqueo de lote · defecto Visión IA</div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: "#7E8983", marginTop: "3px" }}>SAB-2291 · Sabori 03 · sello defectuoso 0.91</div>
              </div>
              <div style={{ display: "flex", gap: "8px", flex: "none" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#B79A8F", padding: "7px 12px", border: "1px solid rgba(241,232,222,.16)", borderRadius: "8px" }}>Rechazar</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#0C100E", background: "#5FD08A", padding: "7px 13px", borderRadius: "8px" }}>Autorizar</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "16px 0", borderBottom: "1px solid rgba(241,232,222,.07)" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E7B84F", flex: "none" }} aria-hidden="true" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#F1E8DE" }}>Reruteo por excursión térmica</div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: "#7E8983", marginTop: "3px" }}>TRK-118 · La Piedad → CDMX · 6.2°C</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: "11px", color: "#7E8983", flex: "none" }}>Frío</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "16px 0" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E7B84F", flex: "none" }} aria-hidden="true" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#F1E8DE" }}>Ajuste de plan maestro</div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: "#7E8983", marginTop: "3px" }}>Chihuahua · +8% jamón · MAPE 4.1%</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: "11px", color: "#7E8983", flex: "none" }}>Plan</span>
            </div>
            <div style={{ marginTop: "6px", padding: "12px 14px", borderRadius: "11px", background: "rgba(95,208,138,.08)", border: "1px solid rgba(95,208,138,.16)", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5FD08A" strokeWidth="2" aria-hidden="true">
                <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
              </svg>
              <span style={{ fontSize: "11.5px", color: "#A7C9B5" }}>Cada autorización se firma y persiste — auditable extremo a extremo.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
