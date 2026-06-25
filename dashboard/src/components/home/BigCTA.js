"use client";

import Link from "next/link";
import Reveal from "./Reveal";

const display = "var(--font-archivo)";

export default function BigCTA() {
  return (
    <section id="demo" style={{ background: "#F3F0E9" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "30px clamp(18px, 4vw, 34px) 96px" }}>
        <Reveal style={{ position: "relative", borderRadius: "24px", background: "radial-gradient(120% 140% at 85% 0%,#5C1810 0%,#3A0E08 50%,#2A0B07 100%)", color: "#F1E8DE", overflow: "hidden", padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px)" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(70% 100% at 90% 10%,#000,transparent)",
              WebkitMaskImage: "radial-gradient(70% 100% at 90% 10%,#000,transparent)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", maxWidth: "620px" }}>
            <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,46px)", lineHeight: 1.03, letterSpacing: "-0.03em", color: "#FBF5EC", margin: 0, textWrap: "balance" }}>
              Toma el control de tu operación, de punta a punta.
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.55, color: "#CFB7AC", margin: "20px 0 0", maxWidth: "480px", fontWeight: 450 }}>
              Una demo en vivo sobre tus propias líneas, en menos de 30 minutos. Te mostramos la torre operando con datos reales.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "34px", flexWrap: "wrap" }}>
              <Link
                href="/os"
                style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "#F1E8DE", color: "#2A0B07", fontSize: "15px", fontWeight: 700, padding: "15px 28px", borderRadius: "11px", textDecoration: "none", transition: "transform .2s, box-shadow .2s", boxShadow: "0 12px 32px rgba(0,0,0,.34)" }}
              >
                Abrir consola
                <span aria-hidden="true" style={{ fontSize: "16px" }}>→</span>
              </Link>
              <Link
                href="/os"
                style={{ display: "inline-flex", alignItems: "center", gap: "9px", color: "#F1E8DE", fontSize: "15px", fontWeight: 600, padding: "15px 22px", borderRadius: "11px", textDecoration: "none", border: "1px solid rgba(241,232,222,.24)", transition: "background .2s" }}
              >
                Ver demo
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
