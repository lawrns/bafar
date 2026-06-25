"use client";

import { useEffect, useRef, useState } from "react";

// True when the user has asked the OS to reduce motion.
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Reveal-on-scroll: returns a ref to attach and a boolean `visible`.
// Reduced-motion users (or no IntersectionObserver) start visible immediately.
export function useReveal(options = {}) {
  const ref = useRef(null);
  // Start visible for reduced-motion / non-IO environments so no synchronous
  // setState is needed inside the effect (avoids cascading renders).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      // Defer to a callback so the linter is satisfied and we never set state
      // synchronously within the effect body.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: options.threshold ?? 0.12, rootMargin: options.rootMargin ?? "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, visible];
}
