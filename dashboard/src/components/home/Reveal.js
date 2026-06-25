"use client";

import { useReveal } from "./useReveal";

// Wraps children in a scroll-reveal container. Renders as a plain block; the
// CSS class `.bf-reveal` handles the fade/slide and reduced-motion short-circuit.
export default function Reveal({ as: Tag = "div", className = "", style, children, ...props }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`bf-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}
