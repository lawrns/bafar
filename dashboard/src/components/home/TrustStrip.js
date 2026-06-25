"use client";

const mono = "var(--font-ibm-plex-mono), monospace";
const display = "var(--font-archivo)";

const BRANDS = ["Parma", "Sabori", "Carnemart", "BURR", "Don Fernando", "Mr. Cerdo"];

export default function TrustStrip() {
  return (
    <section style={{ background: "#FBFAF7", borderBottom: "1px solid #E8E2D6" }}>
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "32px clamp(18px, 4vw, 34px)",
          display: "flex",
          alignItems: "center",
          gap: "46px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "10.5px", fontWeight: 500, letterSpacing: ".16em", color: "#A9A293", whiteSpace: "nowrap" }}>
          MARCAS DEL GRUPO BAFAR, UNA MISMA TORRE
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "38px", flexWrap: "wrap", justifyContent: "center", fontFamily: display, fontWeight: 800, fontSize: "19px", color: "#BBB3A2", letterSpacing: ".01em" }}>
          {BRANDS.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
