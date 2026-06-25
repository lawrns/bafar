"use client";

import Reveal from "./Reveal";

const display = "var(--font-archivo)";
const mono = "var(--font-ibm-plex-mono), monospace";

const ICONS = {
  resumen: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  produccion: <path d="M3 21V8l6 4V8l6 4V4h6v17z" />,
  frio: (
    <>
      <path d="M1 6h13v11H1z" />
      <path d="M14 9h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  calidad: (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  vision: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  inventario: (
    <>
      <path d="M3 7l9-4 9 4-9 4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </>
  ),
};

const MODULES = [
  { n: "01", icon: "resumen", title: "Resumen Operativo", desc: "El estado de la operación, del corral al anaquel, en una sola vista en vivo." },
  { n: "02", icon: "produccion", title: "Plantas y Producción", desc: "OEE por línea, ritmo de salida y plan maestro de la próxima semana." },
  { n: "03", icon: "frio", title: "Transporte y Frío", desc: "Flota refrigerada en ruta con control térmico extremo a extremo." },
  { n: "04", icon: "calidad", title: "Calidad e Inocuidad", desc: "Trazabilidad de lotes bajo régimen TIF / USDA. La liberación la autoriza un humano." },
  { n: "05", icon: "vision", title: "Visión IA", desc: "Detección, conteo y control de calidad en vivo sobre la línea, con YOLOv8 en el edge." },
  { n: "06", icon: "inventario", title: "Inventario y CEDIS", desc: "Cumplimiento FEFO y capital de trabajo en los cuatro centros de distribución." },
];

function ModuleCard({ n, icon, title, desc }) {
  return (
    <div className="bf-module-card" style={{ background: "#fff", padding: "34px 30px 30px", transition: "background .25s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.6" aria-hidden="true">
          {ICONS[icon]}
        </svg>
        <span style={{ fontFamily: mono, fontSize: "11px", color: "#C3BBAA" }}>{n}</span>
      </div>
      <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: "19px", color: "#1A1C1F", margin: "46px 0 0" }}>{title}</h3>
      <p style={{ fontSize: "13.5px", lineHeight: 1.55, color: "#6B6B63", margin: "9px 0 0" }}>{desc}</p>
    </div>
  );
}

export default function Modules() {
  return (
    <section id="modulos" style={{ background: "#FBFAF7", borderTop: "1px solid #E8E2D6" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "96px clamp(18px, 4vw, 34px)" }}>
        <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "40px", flexWrap: "wrap", marginBottom: "54px" }}>
          <div style={{ maxWidth: "620px" }}>
            <div style={{ fontFamily: mono, fontSize: "11px", fontWeight: 500, letterSpacing: ".16em", color: "var(--ac)" }}>01 — LA PLATAFORMA</div>
            <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(30px,4vw,42px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#1A1C1F", margin: "16px 0 0", textWrap: "balance" }}>
              Toda la operación en módulos que comparten los mismos datos
            </h2>
          </div>
          <p style={{ fontSize: "15.5px", lineHeight: 1.6, color: "#6B6B63", maxWidth: "340px", fontWeight: 450 }}>
            Producción, frío, calidad y retail dejan de vivir en sistemas separados. Una sola fuente de verdad, en tiempo real.
          </p>
        </Reveal>

        <Reveal
          className="bf-modules-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid #E8E2D6", borderRadius: "18px", overflow: "hidden", background: "#E8E2D6", gap: "1px" }}
        >
          {MODULES.map((m) => (
            <ModuleCard key={m.n} {...m} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
