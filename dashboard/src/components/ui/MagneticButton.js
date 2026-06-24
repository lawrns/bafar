"use client";

import React, { useRef, useState } from "react";

export default function MagneticButton({
  children,
  className = "",
  onClick,
  style = {},
  ...props
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Max pull offset (in pixels)
    const maxPull = 8; 
    const pullX = (clientX - centerX) * 0.25;
    const pullY = (clientY - centerY) * 0.25;

    setPosition({
      x: Math.max(-maxPull, Math.min(maxPull, pullX)),
      y: Math.max(-maxPull, Math.min(maxPull, pullY)),
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`magnetic-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
