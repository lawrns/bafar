"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "./useReveal";

// Wraps any element and gives it a subtle magnetic pull toward the cursor.
// Pure transform on an inline-block wrapper, so it composes with links/buttons
// without changing their layout. Disabled for reduced motion.
export default function Magnetic({ children, strength = 0.28, max = 9, style }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    const cx = Math.max(-max, Math.min(max, x));
    const cy = Math.max(-max, Math.min(max, y));
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-flex",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
