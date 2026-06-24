"use client";

import React from "react";
import MagneticButton from "../ui/MagneticButton";

export default function OnboardingModal({
  isOpen,
  data,
  dontShowAgain,
  onToggleDontShow,
  onClose
}) {
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cover Image */}
        <div className="modal-image-container">
          <img className="modal-img" src={data.image} alt={data.title} />
          <div className="modal-image-overlay" />
        </div>

        {/* Content Body */}
        <div className="modal-body">
          <h2 className="modal-title">{data.title}</h2>
          <p className="modal-desc" style={{ color: "var(--text-muted)", fontSize: "13.5px", lineHeight: 1.5, margin: 0 }}>
            {data.desc}
          </p>

          <div className="modal-bullets">
            {data.bullets && data.bullets.map((bullet, idx) => (
              <div key={idx} className="modal-bullet-item">
                <span className="modal-bullet-bullet">✓</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <label className="modal-checkbox-label">
            <input
              type="checkbox"
              className="modal-checkbox"
              checked={dontShowAgain}
              onChange={onToggleDontShow}
            />
            <span>No volver a mostrar en esta vista</span>
          </label>
          <MagneticButton
            onClick={onClose}
            style={{
              padding: "10px 22px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              boxShadow: "0 0 10px rgba(225, 29, 72, 0.3)",
              position: "relative",
              zIndex: 10
            }}
          >
            Entendido
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
