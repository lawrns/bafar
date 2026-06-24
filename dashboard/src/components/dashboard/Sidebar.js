"use client";

import React from "react";

export default function Sidebar({ currentView, setView, pendN }) {
  const navItems = [
    { id: "resumen", label: "Resumen Operativo", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    )},
    { id: "plantas", label: "Plantas y Producción", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21V8l6 4V8l6 4V4h6v17z" />
      </svg>
    )},
    { id: "transp", label: "Transporte y Frío", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 6h13v11H1z" />
        <path d="M14 9h4l3 3v5h-7z" />
        <circle cx="5.5" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </svg>
    )},
    { id: "calidad", label: "Calidad e Inocuidad", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )},
    { id: "vision", label: "Visión IA", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ), showDot: true },
    { id: "inv", label: "Inventario y CEDIS", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7l9-4 9 4-9 4z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </svg>
    )},
    { id: "retail", label: "Retail y Puntos de Venta", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M4 9h16" />
        <path d="M9 20v-6h6v6" />
      </svg>
    )},
    { id: "compras", label: "Compras y Commodities", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M17 7h4v4" />
      </svg>
    )}
  ];

  return (
    <aside style={{ width: "248px", flex: "none", borderRight: "1px solid var(--border-color)", background: "var(--bg-sidebar)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border-color)" }}>
        <div onClick={() => setView("landing")} style={{ display: "flex", alignItems: "center", gap: "11px", cursor: "pointer" }} title="Volver a Inicio">
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(150deg, var(--accent), #8E261A)", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center", fontFamily: "Archivo", fontWeight: 800, fontSize: 16, color: "#fff", flex: "none" }}>B</div>
          <div>
            <div style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "15.5px", letterSpacing: "0.02em", color: "var(--text-main)", lineHeight: 1 }}>BAFAR <span style={{ color: "var(--accent)" }}>OS</span></div>
            <div style={{ fontSize: "9.5px", color: "var(--text-muted)", letterSpacing: "0.1em", marginTop: "3px", fontWeight: 600 }}>TORRE DE CONTROL OPERATIVA</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.13em", fontWeight: 700, padding: "0 8px 8px" }}>PANEL</div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "9px 12px",
                borderRadius: "9px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid transparent",
                width: "100%",
                background: isActive ? "rgba(225, 29, 72, 0.08)" : "transparent",
                color: isActive ? "var(--text-main)" : "var(--text-muted)",
                borderColor: isActive ? "rgba(225, 29, 72, 0.2)" : "transparent",
                fontFamily: "inherit",
                textAlign: "left",
                marginBottom: "2px",
                lineHeight: 1.15,
                transition: "all 0.2s"
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.showDot && (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", marginLeft: "auto" }} />
              )}
            </button>
          );
        })}

        <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.13em", fontWeight: 700, padding: "18px 8px 8px" }}>GESTIÓN</div>
        <button
          onClick={() => setView("acc")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "9px 12px",
            borderRadius: "9px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            border: "1px solid transparent",
            width: "100%",
            background: currentView === "acc" ? "rgba(225, 29, 72, 0.08)" : "transparent",
            color: currentView === "acc" ? "var(--text-main)" : "var(--text-muted)",
            borderColor: currentView === "acc" ? "rgba(225, 29, 72, 0.2)" : "transparent",
            fontFamily: "inherit",
            textAlign: "left",
            marginBottom: "2px",
            lineHeight: 1.15,
            transition: "all 0.2s"
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <span>Acciones Pendientes</span>
          {pendN > 0 && (
            <span style={{
              marginLeft: "auto",
              fontSize: "10.5px",
              fontWeight: 700,
              minWidth: "19px",
              height: "19px",
              padding: "0 6px",
              borderRadius: "20px",
              background: "var(--accent)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {pendN}
            </span>
          )}
        </button>
      </nav>

      {/* Footer Profile */}
      <div style={{ padding: "13px 15px", borderTop: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 11px", borderRadius: "10px", background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(225, 29, 72, 0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "var(--accent)", flex: "none" }}>RM</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>R. Mendoza</div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Dirección de Operaciones</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
