"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Magnetic from "./Magnetic";
import { prefersReducedMotion } from "./useReveal";

const mono = "var(--font-ibm-plex-mono), monospace";
const display = "var(--font-archivo)";

// The headline, tokenised. Tokens flagged with `tag` get a detection box that
// locks onto them during the inspection sweep.
const HEAD = [
  { t: "Del" },
  { t: "corral", tag: { label: "CORRAL · 0.98", tone: "ok" } },
  { t: "al" },
  { t: "anaquel,", tag: { label: "ANAQUEL · 0.97", tone: "ok" } },
  { t: "gobernado", tag: { label: "GOBERNADO", tone: "key" } },
  { t: "en" },
  { t: "tiempo" },
  { t: "real.", tag: { label: "RASTREO · 1.00", tone: "ok" } },
];

const TONE = {
  ok: { stroke: "#5FD08A", chipBg: "#5FD08A", chipFg: "#08110C", glow: "bfboxglow" },
  key: { stroke: "#E8623F", chipBg: "#E8623F", chipFg: "#1A0A06", glow: "bfdefectglow" },
};

export default function Hero() {
  const stageRef = useRef(null); // coordinate origin for boxes (holds words + box layer)
  const camRef = useRef(null); // grid/scan layer that pans with cursor
  const boxLayerRef = useRef(null);
  const headRef = useRef(null);
  const wordRefs = useRef({});

  const [boxes, setBoxes] = useState([]);
  const [lockCount, setLockCount] = useState(0);
  const [chip, setChip] = useState(false);
  const [primed, setPrimed] = useState(false);
  const [count, setCount] = useState(12481);

  // Measure each tagged word's rect relative to the stage so boxes lock on
  // exactly, at any font size / wrap point.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const next = [];
    HEAD.forEach((w, i) => {
      if (!w.tag) return;
      const el = wordRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 7;
      next.push({
        key: i,
        tag: w.tag,
        x: r.left - sr.left - pad,
        y: r.top - sr.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
      });
    });
    setBoxes(next);
  }, []);

  // Layout + entrance choreography.
  useEffect(() => {
    measure();
    const raf = requestAnimationFrame(() => setPrimed(true));

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);

    const total = HEAD.filter((w) => w.tag).length;
    const timers = [];
    if (prefersReducedMotion()) {
      setLockCount(total);
      setChip(true);
    } else {
      // Sweep-synced lock-on: the scan line passes top→bottom over ~3.4s, so
      // the boxes lock in reading order, then the authorization chip arrives.
      for (let n = 1; n <= total; n++) {
        timers.push(setTimeout(() => setLockCount(n), 700 + n * 620));
      }
      timers.push(setTimeout(() => setChip(true), 700 + (total + 1) * 620));
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [measure]);

  // Live "inspeccionadas hoy" ticker.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => {
      setCount((c) => c + 1 + Math.floor(Math.random() * 3));
    }, 760);
    return () => clearInterval(t);
  }, []);

  // Cursor = camera. Pan the grid/scan deep, boxes mid, headline shallow.
  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    if (camRef.current)
      camRef.current.style.transform = `translate3d(${px * 14}px, ${py * 10}px, 0)`;
    if (boxLayerRef.current)
      boxLayerRef.current.style.transform = `translate3d(${px * 6}px, ${py * 4}px, 0)`;
    if (headRef.current)
      headRef.current.style.transform = `translate3d(${px * 3}px, ${py * 2}px, 0)`;
  };
  const onLeave = () => {
    [camRef, boxLayerRef, headRef].forEach((ref) => {
      if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
    });
  };

  return (
    <section
      className={primed ? "is-in" : ""}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        background:
          "radial-gradient(135% 130% at 86% -12%,#5C1810 0%,#350D07 48%,#1F0805 100%)",
        color: "#F1E8DE",
        overflow: "hidden",
      }}
    >
      {/* ── camera layer: floor grid + sweeping scan line (pans with cursor) ── */}
      <div ref={camRef} className="bf-cam" aria-hidden="true" style={{ position: "absolute", inset: "-24px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(95,208,138,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(95,208,138,.05) 1px,transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "radial-gradient(82% 80% at 62% 28%,#000,transparent)",
            WebkitMaskImage: "radial-gradient(82% 80% at 62% 28%,#000,transparent)",
          }}
        />
        {/* perspective floor lines toward a vanishing point */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "44%",
            backgroundImage:
              "repeating-linear-gradient(90deg,rgba(95,208,138,.07) 0 1px,transparent 1px 76px)",
            transform: "perspective(560px) rotateX(64deg)",
            transformOrigin: "bottom",
            maskImage: "linear-gradient(transparent,#000 70%)",
            WebkitMaskImage: "linear-gradient(transparent,#000 70%)",
            opacity: 0.6,
          }}
        />
        {!primed || prefersReducedMotion() ? null : (
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              height: "70px",
              background:
                "linear-gradient(180deg,rgba(95,208,138,.16),rgba(95,208,138,.02) 70%,transparent)",
              borderBottom: "1px solid rgba(95,208,138,.5)",
              animation: "bfscanhero 4.2s cubic-bezier(.55,0,.45,1) infinite",
            }}
          />
        )}
      </div>

      {/* corner reticles — frame the viewport like a real camera HUD */}
      {[
        { top: 18, left: 18, bL: 1, bT: 1 },
        { top: 18, right: 18, bR: 1, bT: 1 },
        { bottom: 18, left: 18, bL: 1, bB: 1 },
        { bottom: 18, right: 18, bR: 1, bB: 1 },
      ].map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            top: c.top,
            bottom: c.bottom,
            left: c.left,
            right: c.right,
            borderLeft: c.bL ? "2px solid rgba(95,208,138,.5)" : undefined,
            borderRight: c.bR ? "2px solid rgba(95,208,138,.5)" : undefined,
            borderTop: c.bT ? "2px solid rgba(95,208,138,.5)" : undefined,
            borderBottom: c.bB ? "2px solid rgba(95,208,138,.5)" : undefined,
          }}
        />
      ))}

      {/* ── content + measured detection overlay ── */}
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(28px,5vw,52px) clamp(18px,4vw,40px) clamp(40px,6vw,76px)",
          position: "relative",
          minHeight: "min(860px, 90vh)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* live HUD status bar */}
        <div
          className="bf-anim"
          style={{
            "--d": "0.05s",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: ".08em",
            color: "#7E8B82",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#FF6B5A", fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF6B5A", animation: "bfblink 1.4s infinite" }} />
            EN VIVO
          </span>
          <span>VISIÓN IA · LÍNEA SABORI&nbsp;03</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#5FD08A" }}>38&thinsp;ms</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span>YOLOv8 · EDGE</span>
        </div>

        {/* the inspected headline + its detection boxes share this stage */}
        <div ref={stageRef} style={{ position: "relative", marginTop: "clamp(28px,5vw,52px)", maxWidth: "920px" }}>
          <h1
            ref={headRef}
            className="bf-cam"
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: "clamp(40px,7vw,86px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              margin: 0,
              color: "#FBF5EC",
              textWrap: "balance",
            }}
          >
            <span aria-hidden="true">
              {HEAD.map((w, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) wordRefs.current[i] = el;
                  }}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  {w.t}
                  {i < HEAD.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Del corral al anaquel, gobernado en tiempo real.
            </span>
          </h1>

          {/* detection box overlay (pans at mid-depth) */}
          <div ref={boxLayerRef} className="bf-cam" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {boxes.map((b, idx) => {
              const tone = TONE[b.tag.tone] || TONE.ok;
              const locked = idx < lockCount;
              return (
                <div
                  key={b.key}
                  className={`bf-detbox ${locked ? "is-locked" : ""}`}
                  style={{
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    border: `1.5px solid ${tone.stroke}`,
                    animation: locked ? `${tone.glow} 2.6s ease-in-out infinite` : "none",
                  }}
                >
                  {/* corner ticks */}
                  {["tl", "tr", "bl", "br"].map((c) => (
                    <span
                      key={c}
                      style={{
                        position: "absolute",
                        width: 7,
                        height: 7,
                        borderColor: tone.stroke,
                        borderStyle: "solid",
                        borderWidth: 0,
                        ...(c[0] === "t" ? { top: -2, borderTopWidth: 2 } : { bottom: -2, borderBottomWidth: 2 }),
                        ...(c[1] === "l" ? { left: -2, borderLeftWidth: 2 } : { right: -2, borderRightWidth: 2 }),
                      }}
                    />
                  ))}
                  {/* confidence label */}
                  <span
                    style={{
                      position: "absolute",
                      top: -19,
                      left: -1.5,
                      fontFamily: mono,
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: ".04em",
                      color: tone.chipFg,
                      background: tone.chipBg,
                      padding: "1px 6px",
                      borderRadius: "3px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.tag.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="bf-anim" style={{ "--d": "0.5s", fontSize: "clamp(16px,1.7vw,19px)", lineHeight: 1.55, color: "#CFB7AC", margin: "clamp(24px,4vw,40px) 0 0", maxWidth: "520px", fontWeight: 450 }}>
          BAFAR OS unifica plantas, transporte refrigerado, calidad y visión por
          computadora en una sola torre. La IA detecta; una persona autoriza.
        </p>

        <div className="bf-anim" style={{ "--d": "0.6s", display: "flex", alignItems: "center", gap: "14px", marginTop: "clamp(26px,3vw,36px)", flexWrap: "wrap" }}>
          <Magnetic>
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
                padding: "15px 28px",
                borderRadius: "11px",
                textDecoration: "none",
                boxShadow: "0 14px 38px rgba(0,0,0,.4)",
              }}
            >
              Entrar a la torre
              <span aria-hidden="true" style={{ fontSize: "16px" }}>→</span>
            </Link>
          </Magnetic>
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
            Ver Visión IA
          </a>
        </div>

        {/* live telemetry footer row */}
        <div className="bf-anim" style={{ "--d": "0.72s", marginTop: "auto", paddingTop: "clamp(34px,5vw,56px)", display: "flex", alignItems: "center", gap: "clamp(20px,4vw,44px)", flexWrap: "wrap", fontFamily: mono }}>
          {[
            { k: "INSPECCIONADAS · HOY", v: count.toLocaleString("en-US"), c: "#EDE4D8" },
            { k: "CONFORMIDAD", v: "99.3%", c: "#5FD08A" },
            { k: "SEDES EN VIVO", v: "4", c: "#EDE4D8" },
          ].map((s) => (
            <div key={s.k}>
              <div style={{ fontSize: "9.5px", letterSpacing: ".1em", color: "#6E7A72" }}>{s.k}</div>
              <div style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 600, color: s.c, marginTop: "4px" }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* floating authorization chip — arrives when the defect is flagged */}
      {chip && (
        <div
          style={{
            position: "absolute",
            right: "clamp(18px,4vw,44px)",
            bottom: "clamp(20px,4vw,40px)",
            width: "292px",
            maxWidth: "calc(100% - 36px)",
            background: "#F1E8DE",
            borderRadius: "13px",
            padding: "13px 15px",
            boxShadow: "0 30px 60px -18px rgba(0,0,0,.62)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: prefersReducedMotion() ? "none" : "bfchipin .6s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: "9px", background: "#FBEDEA", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#1A1C1F" }}>Bloqueo de lote · SAB-2291</div>
            <div style={{ fontSize: "11px", color: "#7A746B", marginTop: "1px" }}>Detectado por IA · espera autorización</div>
          </div>
        </div>
      )}
    </section>
  );
}
