"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./useReveal";

// Animated count-up that fires when scrolled into view. Reduced-motion users
// (or environments without IntersectionObserver) see the final value instantly.
export default function CountUp({ to, decimals = 0, duration = 1500, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  const format = (n) =>
    n.toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (prefersReducedMotion()) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      let raf;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        setValue(to * ease(p));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setValue(to);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    let cleanup;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cleanup = run();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (cleanup) cleanup();
    };
  }, [to, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  );
}
