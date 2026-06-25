"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import VisionPanel from "./VisionPanel";

const mono = "var(--font-ibm-plex-mono), monospace";
const display = "var(--font-archivo)";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        background:
          "radial-gradient(135% 130% at 88% -10%,#5C1810 0%,#3A0E08 46%,#2A0B07 100%)",
        color: "#F1E8DE",
        overflow: "hidden",
      }}
    >
      {/* decorative grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(80% 80% at 70% 20%,#000,transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 70% 20%,#000,transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        className="bf-hero-grid"
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "88px clamp(18px, 4vw, 34px) 96px",
          display: "grid",
          gridTemplateColumns: "1.02fr 0.98fr",
          gap: "56px",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "6px 13px",
              borderRadius: "999px",
              background: "rgba(241,232,222,.06)",
              border: "1px solid rgba(241,232,222,.14)",
              fontFamily: mono,
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: ".16em",
              color: "#D8AE9E",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5FD08A", animation: "bfpulse 1.8s infinite" }} aria-hidden="true" />
            TORRE DE CONTROL OPERATIVA
          </div>

          <h1
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: "clamp(38px,4.7vw,62px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: "24px 0 0",
              color: "#FBF5EC",
              textWrap: "balance",
            }}
          >
            Del corral al anaquel, gobernado en tiempo&nbsp;real.
          </h1>

          <p style={{ fontSize: "18px", lineHeight: 1.55, color: "#CFB7AC", margin: "26px 0 0", maxWidth: "466px", fontWeight: 450 }}>
            BAFAR OS unifica plantas, transporte refrigerado, calidad y visión por
            computadora en una sola torre. La IA detecta; una persona autoriza. Sin
            puntos ciegos entre las cuatro sedes.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "36px", flexWrap: "wrap" }}>
            <Link
              href="/os"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                background: "#F1E8DE",
                color: "#2A0B07",
                fontSize: "15px",
                fontWeight: 700,
                padding: "15px 26px",
                borderRadius: "11px",
                textDecoration: "none",
                transition: "transform .2s, box-shadow .2s",
                boxShadow: "0 10px 30px rgba(0,0,0,.32)",
              }}
            >
              Entrar
              <span aria-hidden="true" style={{ fontSize: "16px" }}>→</span>
            </Link>
            <a
              href="#vision"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                color: "#F1E8DE",
                fontSize: "15px",
                fontWeight: 600,
                padding: "15px 22px",
                borderRadius: "11px",
                textDecoration: "none",
                border: "1px solid rgba(241,232,222,.22)",
                transition: "background .2s, border-color .2s",
              }}
            >
              Ver demo
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "13px", marginTop: "34px", fontFamily: mono, fontSize: "11.5px", color: "#A98D83", letterSpacing: ".01em", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px", color: "#C9AEA3" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5FD08A", animation: "bfpulse 1.8s infinite" }} aria-hidden="true" />
              OPERANDO
            </span>
            <span aria-hidden="true" style={{ opacity: 0.35 }}>/</span>
            <span>CHIHUAHUA · LA&nbsp;PIEDAD · SABINAS · EL&nbsp;PASO</span>
          </div>
        </Reveal>

        <Reveal>
          <VisionPanel />
        </Reveal>
      </div>
    </section>
  );
}
