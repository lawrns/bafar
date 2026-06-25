"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./useReveal";

const mono = "var(--font-ibm-plex-mono), monospace";

// A single box travelling along the conveyor. `delay` staggers the three units.
function ConveyorUnit({ delay, ok, label }) {
  const borderColor = ok ? "#5FD08A" : "#FF6B5A";
  return (
    <div
      style={{
        position: "absolute",
        bottom: "48px",
        left: 0,
        animation: "bfconvey 7.2s linear infinite",
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <div style={{ position: "relative", width: "62px", height: "40px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "5px",
            background: "linear-gradient(160deg,#E9DECB,#CDBFA5)",
            boxShadow: "inset 0 -6px 0 rgba(0,0,0,.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "13px",
            height: "11px",
            background: "#9A2B1E",
            transform: ok ? "none" : "skewX(-12deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-3px",
            border: `2px solid ${borderColor}`,
            borderRadius: "7px",
            animation: "bfbox 7.2s linear infinite",
            animationDelay: `${delay}s`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "-2px",
            fontFamily: mono,
            fontSize: "9px",
            fontWeight: 600,
            color: ok ? "#0C100E" : "#fff",
            background: ok ? "#5FD08A" : "#E03A29",
            padding: "1px 5px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            animation: "bfbox 7.2s linear infinite",
            animationDelay: `${delay}s`,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function Reticle(style) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", width: "18px", height: "18px", ...style }}
    />
  );
}

export default function VisionPanel() {
  // Live "inspeccionadas hoy" counter that ticks up (disabled for reduced motion).
  const [count, setCount] = useState(12481);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => {
      setCount((c) => c + 1 + Math.floor(Math.random() * 3));
    }, 760);
    return () => clearInterval(t);
  }, []);

  const green = "rgba(95,208,138,.5)";

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          borderRadius: "18px",
          background: "#0C100E",
          border: "1px solid rgba(241,232,222,.12)",
          boxShadow: "0 50px 90px -28px rgba(0,0,0,.7)",
          overflow: "hidden",
        }}
      >
        {/* panel header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 16px",
            borderBottom: "1px solid rgba(241,232,222,.08)",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: mono, fontSize: "10.5px", fontWeight: 600, letterSpacing: ".08em", color: "#FF6B5A" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF6B5A", animation: "bfblink 1.4s infinite" }} aria-hidden="true" />
              EN VIVO
            </span>
            <span style={{ fontFamily: mono, fontSize: "10.5px", color: "#6E7A74", letterSpacing: ".06em" }}>
              VISIÓN IA · LÍNEA SABORI&nbsp;03
            </span>
          </div>
          <span style={{ fontFamily: mono, fontSize: "10px", color: "#566159", letterSpacing: ".04em" }}>
            1280×720 · YOLOv8
          </span>
        </div>

        {/* camera viewport */}
        <div
          role="img"
          aria-label="Visualización en vivo de la línea Sabori 03: la IA inspecciona unidades en la banda transportadora, marcando piezas conformes y defectos."
          style={{
            position: "relative",
            height: "230px",
            overflow: "hidden",
            background: "radial-gradient(120% 100% at 50% 0%,#16201B 0%,#0B0F0D 80%)",
          }}
        >
          {/* floor grid */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg,rgba(95,208,138,.06) 1px,transparent 1px)", backgroundSize: "38px 100%" }} />
          {/* conveyor base */}
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: "46px", height: "3px", background: "linear-gradient(90deg,transparent,rgba(95,208,138,.35),transparent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: "40px", height: "1px", background: "rgba(241,232,222,.06)" }} />

          {/* HUD corner reticles */}
          {Reticle({ top: "14px", left: "14px", borderLeft: `2px solid ${green}`, borderTop: `2px solid ${green}` })}
          {Reticle({ top: "14px", right: "14px", borderRight: `2px solid ${green}`, borderTop: `2px solid ${green}` })}
          {Reticle({ bottom: "14px", left: "14px", borderLeft: `2px solid ${green}`, borderBottom: `2px solid ${green}` })}
          {Reticle({ bottom: "14px", right: "14px", borderRight: `2px solid ${green}`, borderBottom: `2px solid ${green}` })}

          {/* scanning line */}
          <div aria-hidden="true" style={{ position: "absolute", left: "10px", right: "10px", top: 0, height: "54px", background: "linear-gradient(180deg,rgba(95,208,138,.22),transparent)", borderBottom: "1px solid rgba(95,208,138,.55)", animation: "bfscan 3.4s cubic-bezier(.6,0,.4,1) infinite", pointerEvents: "none" }} />

          {/* center inspection bracket */}
          <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "36px", bottom: "54px", width: "108px", marginLeft: "-54px", borderLeft: "1px dashed rgba(95,208,138,.28)", borderRight: "1px dashed rgba(95,208,138,.28)" }} />

          {/* moving units */}
          <ConveyorUnit delay={0} ok label="OK · 0.98" />
          <ConveyorUnit delay={-2.4} ok={false} label="DEFECTO · 0.91" />
          <ConveyorUnit delay={-4.8} ok label="OK · 0.97" />
        </div>

        {/* live stats footer */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(241,232,222,.08)" }}>
          <div style={{ padding: "13px 16px", borderRight: "1px solid rgba(241,232,222,.07)" }}>
            <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: ".08em", color: "#5C665F" }}>INSPECCIONADAS · HOY</div>
            <div style={{ fontFamily: mono, fontSize: "18px", fontWeight: 600, color: "#EDE4D8", marginTop: "5px" }}>
              {count.toLocaleString("en-US")}
            </div>
          </div>
          <div style={{ padding: "13px 16px", borderRight: "1px solid rgba(241,232,222,.07)" }}>
            <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: ".08em", color: "#5C665F" }}>CONFORMIDAD</div>
            <div style={{ fontFamily: mono, fontSize: "18px", fontWeight: 600, color: "#5FD08A", marginTop: "5px" }}>99.3%</div>
          </div>
          <div style={{ padding: "13px 16px" }}>
            <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: ".08em", color: "#5C665F" }}>LATENCIA EDGE</div>
            <div style={{ fontFamily: mono, fontSize: "18px", fontWeight: 600, color: "#EDE4D8", marginTop: "5px" }}>38&thinsp;ms</div>
          </div>
        </div>
      </div>

      {/* floating authorization chip */}
      <div
        className="bf-float-chip"
        style={{
          position: "absolute",
          left: "-26px",
          bottom: "-26px",
          width: "268px",
          maxWidth: "calc(100% - 12px)",
          background: "#F1E8DE",
          borderRadius: "13px",
          padding: "13px 15px",
          boxShadow: "0 24px 50px -16px rgba(0,0,0,.55)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#FBEDEA", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" aria-hidden="true">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#1A1C1F" }}>Bloqueo de lote · SAB-2291</div>
          <div style={{ fontSize: "11px", color: "#7A746B", marginTop: "1px" }}>Detectado por IA · espera autorización</div>
        </div>
      </div>
    </div>
  );
}
