"use client";

// LIVE COMMODITIES TICKER — seamless marquee. Items are duplicated so the
// -50% keyframe translate loops without a visible jump.
const ITEMS = [
  { label: "CME LEAN HOGS", value: "84.25", delta: "+1.4%", up: true },
  { label: "CBOT MAÍZ", value: "4.62", delta: "−0.8%", up: false },
  { label: "USD/MXN", value: "18.2540", delta: "+0.12%", up: true },
  { label: "USDA PORK CUTOUT", value: "96.50", delta: "+0.7%", up: true },
  { label: "DIESEL ÍNDICE", value: "3.92", delta: "−0.3%", up: false },
  { label: "GANADO EN PIE", value: "178.40", delta: "+1.1%", up: true },
];

function Item({ label, value, delta, up }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: "11px",
        color: "#B89089",
        letterSpacing: ".02em",
      }}
    >
      {label}
      <b style={{ color: "#EFE6DC", fontWeight: 500 }}>{value}</b>
      <i style={{ color: up ? "#5FD08A" : "#E68A7E", fontStyle: "normal" }}>{delta}</i>
    </span>
  );
}

export default function CommoditiesTicker() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div
      role="marquee"
      aria-label="Cotizaciones de commodities en vivo"
      style={{
        background: "#2A0B07",
        height: "33px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          gap: "46px",
          paddingRight: "46px",
          animation: "bfmarquee 44s linear infinite",
          willChange: "transform",
        }}
      >
        {loop.map((it, i) => (
          <Item key={i} {...it} />
        ))}
      </div>
    </div>
  );
}
