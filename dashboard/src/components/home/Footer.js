"use client";

import Link from "next/link";

const display = "var(--font-archivo)";
const mono = "var(--font-ibm-plex-mono), monospace";

const PLATAFORMA = [
  { href: "#modulos", label: "Módulos" },
  { href: "#vision", label: "Visión IA" },
  { href: "#frio", label: "Cadena de frío" },
  { href: "#resultados", label: "Resultados" },
];
const SEDES = ["Chihuahua", "La Piedad", "Sabinas", "El Paso"];

function FooterLink({ href, children }) {
  const isHash = href.startsWith("#");
  const style = { color: "#C9AEA3", textDecoration: "none" };
  return isHash ? (
    <a href={href} style={style}>{children}</a>
  ) : (
    <Link href={href} style={style}>{children}</Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#2A0B07", color: "#C9AEA3" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "56px clamp(18px, 4vw, 34px) 30px" }}>
        <div className="bf-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div aria-hidden="true" style={{ width: "31px", height: "31px", borderRadius: "8px", background: "linear-gradient(150deg,var(--ac),var(--acd))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 900, fontSize: "15px", color: "#fff" }}>
                B
              </div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: "16px", color: "#F1E8DE" }}>
                BAFAR <span style={{ color: "#E89A88" }}>OS</span>
              </div>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#A98D83", margin: "16px 0 0", maxWidth: "280px" }}>
              La torre de control operativa del Grupo Bafar. Del corral al anaquel, en tiempo real.
            </p>
          </div>

          <div>
            <div style={{ fontFamily: mono, fontSize: "10.5px", letterSpacing: ".1em", color: "#8A6F66", marginBottom: "14px" }}>PLATAFORMA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
              {PLATAFORMA.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: mono, fontSize: "10.5px", letterSpacing: ".1em", color: "#8A6F66", marginBottom: "14px" }}>SEDES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px", color: "#C9AEA3" }}>
              {SEDES.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: mono, fontSize: "10.5px", letterSpacing: ".1em", color: "#8A6F66", marginBottom: "14px" }}>CONTACTO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
              <FooterLink href="#demo">Solicitar demo</FooterLink>
              <FooterLink href="/os">Abrir consola</FooterLink>
              <FooterLink href="/os">Soporte</FooterLink>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", marginTop: "48px", paddingTop: "22px", borderTop: "1px solid rgba(241,232,222,.1)", fontSize: "11.5px", color: "#8A6F66" }}>
          <span>© 2026 Grupo Bafar · BAFAR OS · Torre de Control Operativa</span>
          <span style={{ fontFamily: mono }}>Régimen TIF / USDA · datos en tiempo real</span>
        </div>
      </div>
    </footer>
  );
}
