"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";
import MagneticButton from "../ui/MagneticButton";

// Custom SVG animation concepts for each pillar with high contrast and legible font sizes
const VisionIAAnimation = () => (
  <div style={{ width: "100%", height: "140px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Grid Background */}
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", stroke: "rgba(15, 23, 42, 0.04)" }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Moving Laser line */}
    <motion.div
      animate={{ translateY: [0, 140, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
        boxShadow: "0 0 8px var(--accent)",
        zIndex: 2
      }}
    />

    {/* Bounding box animation */}
    <motion.div
      animate={{ opacity: [0.2, 0.95, 0.2] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        width: "60px",
        height: "60px",
        border: "2px solid var(--accent)",
        borderRadius: "4px",
        left: "35%",
        top: "25%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "3px",
        background: "rgba(225, 29, 72, 0.05)",
        boxShadow: "0 4px 12px rgba(225, 29, 72, 0.1)"
      }}
    >
      <span style={{ fontSize: "10.5px", fontWeight: 700, background: "var(--accent)", color: "#fff", padding: "2px 4px", borderRadius: "2px", lineHeight: 1 }}>PIEZA</span>
    </motion.div>
  </div>
);

const ColdChainAnimation = () => (
  <div style={{ width: "100%", height: "140px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Map dashed route */}
    <svg width="240" height="90" style={{ position: "relative", zIndex: 1 }}>
      <path
        d="M 20 55 C 60 25, 100 85, 140 35 C 180 5, 210 55, 220 55"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Animated route trace */}
      <motion.path
        d="M 20 55 C 60 25, 100 85, 140 35 C 180 5, 210 55, 220 55"
        fill="none"
        stroke="#2563eb"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="20, 100"
        animate={{ strokeDashoffset: [0, -120] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      {/* Start Point */}
      <circle cx="20" cy="55" r="6" fill="#2563eb" />
      {/* End Point */}
      <circle cx="220" cy="55" r="6" fill="var(--accent)" />
    </svg>

    {/* Floating temperature alert */}
    <div style={{
      position: "absolute",
      right: "14px",
      bottom: "14px",
      background: "#fff",
      border: "1px solid var(--border-color)",
      borderRadius: "6px",
      padding: "5px 10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)"
    }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
      <span style={{ fontSize: "12px", fontFamily: "var(--font-ibm-plex-mono)", fontWeight: 700, color: "var(--text-main)" }}>3.8 °C</span>
    </div>
  </div>
);

const QualitySealAnimation = () => (
  <div style={{ width: "100%", height: "140px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Rotating verification seals */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        border: "2px dashed #10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: "2px dashed rgba(16, 185, 129, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      />
    </motion.div>

    {/* Big Checkmark */}
    <motion.div
      animate={{ scale: [0.95, 1.1, 0.95] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "#10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </motion.div>
  </div>
);

const CommoditiesChartAnimation = () => (
  <div style={{ width: "100%", height: "140px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* SVG Line chart */}
    <svg width="220" height="90" style={{ position: "relative", zIndex: 1 }}>
      <path
        d="M 10 70 L 40 60 L 70 65 L 100 45 L 130 50 L 160 25 L 190 35 L 210 15"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Dynamic animated path */}
      <motion.path
        d="M 10 70 L 40 60 L 70 65 L 100 45 L 130 50 L 160 25 L 190 35 L 210 15"
        fill="none"
        stroke="#d97706"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      />
      {/* Target indicator line */}
      <line x1="10" y1="40" x2="210" y2="40" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="3,3" />
      {/* Sparkle at the tip */}
      <motion.circle
        animate={{ r: [3, 6, 3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        cx="210"
        cy="15"
        fill="#d97706"
      />
    </svg>
    
    <div style={{
      position: "absolute",
      left: "14px",
      top: "14px",
      background: "rgba(217, 119, 6, 0.08)",
      border: "1px solid rgba(217, 119, 6, 0.2)",
      borderRadius: "4px",
      padding: "3px 8px",
      fontSize: "11px",
      fontWeight: 700,
      color: "#d97706",
      letterSpacing: "0.05em"
    }}>
      FX SWAP COBERTURA
    </div>
  </div>
);

export default function Landing({ onEnterDashboard }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const featureRefs = useRef([]);

  const pillars = [
    {
      title: "Visión IA · Edge YOLOv8",
      desc: "Análisis inteligente en planta para embutidos Parma y Sabori. Conteo automático y rechazo de lotes defectuosos en tiempo real.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      badge: "Edge CV",
      anim: <VisionIAAnimation />,
      color: "var(--accent)"
    },
    {
      title: "Logística & Cadena de Frío",
      desc: "Trazabilidad térmica GPS para flota nacional y exportación. Protocolos automáticos de desvío ante incidentes térmicos críticos.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      badge: "GPS térmico",
      anim: <ColdChainAnimation />,
      color: "#2563eb"
    },
    {
      title: "Inocuidad & Normas TIF / USDA",
      desc: "Cola de aprobación digital humana. Ningún lote defectuoso de producción se libera sin firma y trazabilidad inmutable.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
      ),
      badge: "Inocuidad TIF",
      anim: <QualitySealAnimation />,
      color: "#10b981"
    },
    {
      title: "Compras & Commodities FX",
      desc: "Modelado predictivo de cerdo CME, maíz CBOT y tipo de cambio para ejecutar hedges de cobertura financiera autorizados.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      badge: "Smart Hedging",
      anim: <CommoditiesChartAnimation />,
      color: "#d97706"
    }
  ];

  const showcaseFeatures = [
    {
      id: "sc-vision",
      title: "Visión Edge en Operación Directa",
      description: "Nuestros sensores capturan feeds en Chihuahua y La Piedad. El modelo local YOLOv8 procesa 600 empaques por minuto identificando imperfecciones y actualizando métricas al instante.",
      screenContent: (
        <div style={{ padding: "20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>LIVE STREAM</span>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }} className="animate-pulse-custom" />
            </div>
            <div style={{ width: "100%", height: "135px", borderRadius: "8px", background: "#f8fafc", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ width: "75%", height: "75%", border: "2px solid var(--accent)", borderRadius: "4px", position: "relative" }} />
              <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: "11px", fontFamily: "var(--font-ibm-plex-mono)", fontWeight: 600, color: "var(--text-muted)", background: "rgba(255,255,255,0.9)", padding: "2px 6px", borderRadius: "3px", border: "1px solid var(--border-color)" }}>EMBUTIDOS PARMA</div>
            </div>
          </div>
          <div style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>OEE global de planta</div>
            <div style={{ fontSize: "30px", fontWeight: 800, fontFamily: "var(--font-ibm-plex-mono)", color: "#10b981", marginTop: "4px", lineHeight: 1 }}>87.4%</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#10b981", marginTop: "4px" }}>▲ +1.2% este turno</div>
          </div>
        </div>
      )
    },
    {
      id: "sc-cold",
      title: "Alertas Satelitales e Incidentes",
      description: "El sistema mantiene enlace GPS y sensor de temperatura para todas las cargas críticas refrigeradas. Si un tráiler supera el límite crítico de 4°C, el despachador recibe un protocolo dinámico de desvío automático.",
      screenContent: (
        <div style={{ padding: "20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em" }}>LOGÍSTICA FLOTA</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>12 UNIDADES</span>
            </div>
            <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid #fca5a5", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: 800, letterSpacing: "0.02em" }}>RERUTEO RECOMENDADO</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#7f1d1d", marginTop: "4px" }}>Tráiler TX-4471 · Chih</div>
              <div style={{ fontSize: "12px", color: "#b91c1c", marginTop: "2px", fontWeight: 500 }}>Temp. 6.8 °C (límite 4 °C)</div>
            </div>
          </div>
          <div style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>Envíos entregados a tiempo</div>
            <div style={{ fontSize: "30px", fontWeight: 800, fontFamily: "var(--font-ibm-plex-mono)", color: "var(--text-main)", marginTop: "4px", lineHeight: 1 }}>98.2%</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontWeight: 500 }}>OTIF óptimo (meta 95%)</div>
          </div>
        </div>
      )
    },
    {
      id: "sc-rules",
      title: "Mesa Digital de Autorización",
      description: "Cumplimiento operativo absoluto. Toda decisión de contención sugerida por la IA queda pausada hasta ser visada en la cola de firmas. El log operativo de la sesión registra inmutablemente la decisión y el despachador a cargo.",
      screenContent: (
        <div style={{ padding: "20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.05em" }}>AUTORIZACIONES</span>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#fff", background: "var(--accent)", padding: "3px 8px", borderRadius: "100px" }}>1 ALERTA</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "12px", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>CALIDAD</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>Bloquear lote L-22918</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Defectos en empaque Línea 3</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}>Declinar</button>
                <button style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", background: "#10b981", color: "#fff", fontSize: "11.5px", fontWeight: 700, cursor: "pointer" }}>Autorizar</button>
              </div>
            </div>
          </div>
          <div style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>Tiempo medio de respuesta</div>
            <div style={{ fontSize: "30px", fontWeight: 800, fontFamily: "var(--font-ibm-plex-mono)", color: "var(--text-main)", marginTop: "4px", lineHeight: 1 }}>2.4 min</div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      
      let currentActive = 0;
      featureRefs.current.forEach((el, index) => {
        if (el && el.offsetTop <= scrollPos) {
          currentActive = index;
        }
      });
      setActiveIndex(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      width: "100%",
      minHeight: "100dvh",
      background: "radial-gradient(circle at 50% -20%, rgba(225, 29, 72, 0.04), transparent 70%), var(--bg-primary)",
      color: "var(--text-main)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
      padding: "100px 24px 120px",
      position: "relative"
    }}>
      {/* Clean Grid Background pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.015) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        pointerEvents: "none",
        zIndex: 1
      }} />

      {/* Hero Container */}
      <div style={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
        
        {/* Micro Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(225, 29, 72, 0.04)",
            border: "1px solid rgba(225, 29, 72, 0.15)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "24px"
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} className="animate-pulse-custom" />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>
            BAFAR OS · TORRE DE CONTROL OPERATIVA
          </span>
        </motion.div>

        {/* Big H1 Header with Split-Text Effect */}
        <h1 style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(34px, 5.5vw, 60px)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          textAlign: "center",
          maxWidth: "880px",
          margin: "0 0 24px",
          color: "var(--text-main)"
        }}>
          Control Inteligente y <br />
          <span style={{ background: "linear-gradient(90deg, var(--accent), #9b1c31)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Detección Predictiva
          </span>
        </h1>

        {/* Subtitle description with high legibility */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: "clamp(16px, 2.5vw, 18px)",
            color: "var(--text-muted)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.6,
            margin: "0 0 48px"
          }}
        >
          El hub unificado para el monitoreo en tiempo real de Grupo BAFAR. 
          Supervisa el OEE en plantas, rastrea la cadena de frío nacional y ejecuta autorizaciones basadas en visión IA.
        </motion.p>

        {/* Primary conversion CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ marginBottom: "100px" }}
        >
          <MagneticButton
            onClick={onEnterDashboard}
            style={{
              background: "linear-gradient(135deg, var(--accent), #b91c1c)",
              color: "#fff",
              padding: "16px 30px 16px 34px",
              borderRadius: "100px",
              fontSize: "15.5px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(225, 29, 72, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              transition: "all 0.3s ease"
            }}
          >
            <span>ACCEDER A LA TORRE DE CONTROL</span>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "bold",
              lineHeight: 1
            }}>
              →
            </div>
          </MagneticButton>
        </motion.div>

        {/* Capacidades Grid Label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            MÓDULOS DE INTEGRACIÓN
          </span>
          <div style={{ width: "30px", height: "1px", background: "var(--border-color)" }} />
        </div>

        {/* Bento Grid Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "20px",
          width: "100%",
          marginBottom: "100px"
        }}>
          {pillars.map((pillar, idx) => {
            const isWide = idx === 0 || idx === 3;
            return (
              <div
                key={idx}
                style={{ gridColumn: isWide ? "span 7" : "span 5" }}
                className="bento-mobile-col"
              >
                <div style={{
                  padding: "5px",
                  borderRadius: "24px",
                  background: "rgba(15, 23, 42, 0.02)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                }}>
                  <SpotlightCard style={{
                    padding: "28px 30px",
                    borderRadius: "18px",
                    background: "var(--bg-card)",
                    border: "1px solid rgba(15, 23, 42, 0.05)",
                    boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.02)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "20px"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "11px",
                          background: `${pillar.color}15`,
                          color: pillar.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {pillar.icon}
                        </div>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "100px",
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-muted)"
                        }}>{pillar.badge}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "19px", fontWeight: 700, margin: "0 0 8px", color: "var(--text-main)" }}>
                        {pillar.title}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                        {pillar.desc}
                      </p>
                    </div>

                    {/* Vector/SVG animation zone */}
                    {pillar.anim}
                  </SpotlightCard>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section title for tour */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            DEMO DE RECORRIDO INTERACTIVO
          </span>
          <div style={{ width: "30px", height: "1px", background: "var(--border-color)" }} />
        </div>

        {/* Sticky Devices Showcase */}
        <div ref={containerRef} style={{ display: "flex", width: "100%", gap: "50px", position: "relative" }} className="bento-mobile-col flex-col">
          {/* Scrollable descriptions */}
          <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "28vh", paddingBottom: "20vh" }} className="w-full">
            {showcaseFeatures.map((f, idx) => (
              <div
                key={f.id}
                ref={(el) => (featureRefs.current[idx] = el)}
                style={{
                  paddingTop: "20px",
                  transition: "opacity 0.4s",
                  opacity: activeIndex === idx ? 1 : 0.25
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>0{idx + 1}</span>
                  <div style={{ width: "16px", height: "1px", background: "var(--border-color)" }} />
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Característica</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "26px", fontWeight: 800, color: "var(--text-main)", margin: "0 0 14px" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          {/* Sticky visual device container */}
          <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "flex-start" }} className="w-full">
            <div
              ref={pinRef}
              style={{
                position: "sticky",
                top: "120px",
                width: "290px",
                height: "550px",
                background: "#0f172a",
                borderRadius: "38px",
                border: "6px solid #334155",
                boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
                padding: "8px",
                overflow: "hidden"
              }}
            >
              {/* Inner Screen */}
              <div style={{ width: "100%", height: "100%", background: "#ffffff", borderRadius: "28px", overflow: "hidden", position: "relative" }}>
                <AnimatePresence mode="wait">
                  {showcaseFeatures.map((f, idx) => {
                    if (activeIndex !== idx) return null;
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                      >
                        {f.screenContent}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .bento-mobile-col {
            grid-column: span 12 !important;
            width: 100% !important;
          }
          .flex-col {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
