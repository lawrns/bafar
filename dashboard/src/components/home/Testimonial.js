"use client";

import Reveal from "./Reveal";

const display = "var(--font-archivo)";

export default function Testimonial() {
  return (
    <section style={{ background: "#FBFAF7", borderTop: "1px solid #E8E2D6" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "100px clamp(18px, 4vw, 34px)", textAlign: "center" }}>
        <Reveal>
          <div aria-hidden="true" style={{ fontFamily: display, fontWeight: 800, fontSize: "30px", color: "#E2DBCD", lineHeight: 1 }}>&ldquo;</div>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(24px,3.4vw,33px)", lineHeight: 1.28, letterSpacing: "-0.02em", color: "#1A1C1F", margin: "8px auto 0", maxWidth: "820px", textWrap: "balance" }}>
              Pasamos de reaccionar a reportes del día anterior, a autorizar decisiones mientras la línea sigue corriendo. La operación entera, por fin, cabe en una pantalla.
            </p>
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "34px" }}>
            <div aria-hidden="true" style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(150deg,var(--ac),var(--acd))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "15px", color: "#fff", fontFamily: display }}>
              RM
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#1A1C1F" }}>R. Mendoza</div>
              <div style={{ fontSize: "12.5px", color: "#8A8579" }}>Dirección de Operaciones · Grupo Bafar</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
