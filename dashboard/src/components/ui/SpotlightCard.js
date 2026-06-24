"use client";

import React, { useRef, useState } from "react";

export default function SpotlightCard({
  children,
  className = "",
  style = {},
  ...props
}) {
  const divRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`spotlight-card ${className}`}
      style={{
        ...style,
        "--mouse-x": `${coords.x}px`,
        "--mouse-y": `${coords.y}px`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
