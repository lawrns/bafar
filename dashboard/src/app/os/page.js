"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import ResumenOperativo from "@/components/dashboard/ResumenOperativo";
import VisionIA from "@/components/dashboard/VisionIA";
import Landing from "@/components/dashboard/Landing";
import SpotlightCard from "@/components/ui/SpotlightCard";
import MagneticButton from "@/components/ui/MagneticButton";

const ONBOARDING_DATA = {
  resumen: {
    image: "/images/onboarding_resumen.png",
    title: "Torre de Control · Ganadería & Corral",
    desc: "Vista global unificada de la cadena de suministro de Grupo BAFAR. Desde la recepción de ganado en corral hasta el embarque final.",
    bullets: [
      "Monitoreo del OEE consolidado de Chihuahua y La Piedad.",
      "Visualización del flujo volumétrico diario en tiempo real.",
      "Detección y alerta temprana de excursiones de frío o paros de línea."
    ]
  },
  plantas: {
    image: "/images/onboarding_plantas.png",
    title: "Plantas y Plan de Producción (OEE)",
    desc: "Supervisión de las 17 líneas de producción y el Plan Maestro de Demanda para SKU de embutidos, jamón Parma y empaque al vacío.",
    bullets: [
      "Control de OEE y ritmo de unidades procesadas por minuto.",
      "Ajuste dinámico frente a desviaciones de pronóstico (MAPE).",
      "Alertas TIF por sobre-producción o mermas fuera de tolerancia."
    ]
  },
  transp: {
    image: "/images/onboarding_transporte.png",
    title: "Logística & Cadena de Frío",
    desc: "Monitoreo satelital y térmico de la flota refrigerada en tránsito nacional y exportaciones hacia El Paso, Texas.",
    bullets: [
      "Monitoreo estricto de temperatura de caja (límite crítico ≤ 4°C).",
      "Protocolo de reruteo automático a CEDIS frío ante excursión térmica.",
      "Trazabilidad e indicador OTIF (On-Time In-Full) en ruta."
    ]
  },
  calidad: {
    image: "/images/onboarding_calidad.png",
    title: "Aseguramiento de Calidad & Inocuidad",
    desc: "Inspección de especificaciones físicas y microbiológicas bajo la norma TIF / USDA. Liberación y retención de lotes.",
    bullets: [
      "Revisión en línea de hermeticidad de sellado y etiquetado.",
      "Cola de retención humana: ningún lote con defectos sale al mercado.",
      "Registro histórico inmutable de trazabilidad y reinspecciones."
    ]
  },
  vision: {
    image: "/images/onboarding_vision.png",
    title: "Visión Artificial (Edge YOLOv8)",
    desc: "Monitoreo inteligente con cámaras industriales de alta velocidad y modelos YOLOv8 corriendo localmente en el nodo Edge.",
    bullets: [
      "Conteo automático de piezas por minuto en embutidos Parma.",
      "Detección automática de tapas torcidas o bajo llenado en Sabori.",
      "Integración con Appwrite para crear alertas de bloqueo automáticas."
    ]
  },
  inv: {
    image: "/images/onboarding_inventario.png",
    title: "CEDIS & Gestión de Inventarios (FEFO)",
    desc: "Control de inventario en los centros de distribución fríos de Chihuahua, La Piedad, Sabinas y El Paso.",
    bullets: [
      "Monitoreo estricto del cumplimiento del método de rotación FEFO.",
      "Control de días de inventario para evitar obsolescencia de producto.",
      "Alertas de sobre-stock de insumos y reubicación de empaque."
    ]
  },
  retail: {
    image: "/images/onboarding_retail.png",
    title: "Retail y Puntos de Venta (CarneMart)",
    desc: "Desempeño comercial y abasto de las tiendas CarneMart y BIF a nivel nacional.",
    bullets: [
      "Estrategia de markdowns dinámicos para productos con caducidad < 48h.",
      "Uso de etiquetas de precio electrónicas (ESL) sincronizadas.",
      "Control de quiebres de stock en tienda y reposición automática."
    ]
  },
  compras: {
    image: "/images/onboarding_compras.png",
    title: "Compras de Commodities & Cobertura FX",
    desc: "Estrategia de cobertura financiera de materias primas (cerdo CME, maíz CBOT) y tipo de cambio (USD/MXN).",
    bullets: [
      "Alertas de señales de compra forward o swaps ante tendencias de alza.",
      "Hedges dinámicos autorizados por el Comité de Compras.",
      "Control de exposición máxima a riesgo cambiario de importación."
    ]
  },
  acc: {
    image: "/images/onboarding_calidad.png",
    title: "Acciones & Autorización de Seguridad",
    desc: "Centro de firmas humanas para autorizar cambios y bloqueos en las líneas operativas en tiempo real.",
    bullets: [
      "Ningún bloqueo de lote o reruteo se aplica sin firma digital.",
      "Visualización del ETA de expiración para evitar cuellos de botella.",
      "Registro inmutable de decisiones con sello de tiempo operativo."
    ]
  }
};

const INITIAL_PENDING = [
  {id:'op1',mod:'frio',stage:'frio',site:'chih',sev:'critico',cat:'Cadena de Frío',title:'Reruteo · Tráiler TX-4471 (Chihuahua → El Paso)',detail:'Temperatura proyectada 6.8 °C en 38 min (límite 4 °C). Carga: 18.4 t de cárnico TIF.',rec:'Redirigir a CEDIS frío Sabinas (+22 min) y activar protocolo de cadena de frío.',approver:'Gerente de Logística + Inocuidad',etaSec:2280,action:'Reruteo a CEDIS Sabinas',impact:'18.4 t TIF',done:'TX-4471 reruteado a Sabinas · cadena de frío preservada'},
  {id:'op2',mod:'calidad',stage:'empaque',site:'piedad',sev:'critico',cat:'Calidad',title:'Bloqueo de lote · L-22918 (Línea 3, La Piedad)',detail:'Defecto de sellado al vacío +2.3σ — 14 de cada 600 empaques/min fuera de especificación.',rec:'Bloquear el lote L-22918 y ordenar reinspección 100%.',approver:'QA Inocuidad',etaSec:540,action:'Bloqueo del lote L-22918',impact:'Línea 3',done:'L-22918 bloqueado · reinspección 100% en curso'},
  {id:'op3',mod:'commodities',stage:'insumos',site:null,sev:'alto',cat:'Compras',title:'Cobertura · Cerdo magro (CME)',detail:'Señal de alza a 60 días (clima EUA + inventarios bajos). Exposición Q3 sin cubrir.',rec:'Ejecutar hedge forward sobre 35% del nocional Q3 (~USD 2.1M).',approver:'Comité de Compras + Tesorería',etaSec:0,action:'Hedge 35% nocional Q3',impact:'Cobertura +16 pts',done:'Hedge ejecutado · cobertura Q3 al 78%'},
  {id:'op4',mod:'retail',stage:'retail',site:null,sev:'alto',cat:'Retail',title:'Markdown dinámico · 142 SKU perecederos',detail:'28 tiendas CarneMart. Caducidad <48 h y stock alto. Etiquetas electrónicas (ESL) listas.',rec:'Aplicar −18% promedio escalonado en 3 ventanas del día.',approver:'Dirección Retail',etaSec:0,action:'Markdown −18% en 142 SKU',impact:'142 SKU',done:'Markdown activo · 142 SKU · 28 tiendas'},
  {id:'op5',mod:'demanda',stage:'produccion',site:'chih',sev:'medio',cat:'Producción',title:'Replan de producción · Chihuahua',detail:'Demanda de jamón de pavo +24% vs plan (promoción + clima). Capacidad disponible.',rec:'Añadir 1 turno L–V la próxima semana (+1,240 cajas).',approver:'Director de Operaciones',etaSec:0,action:'+1 turno de jamón de pavo',impact:'+1,240 cajas',done:'Turno añadido · +1,240 cajas planeadas'},
  {id:'op6',mod:'inventario',stage:'cedis',site:'chih',sev:'medio',cat:'Inventario',title:'Sobre-stock de empaque · CEDIS Chihuahua',detail:'Empaque flexible +38% sobre objetivo. Riesgo de obsolescencia.',rec:'Reubicar 1,400 cajas a La Piedad y pausar reorden 2 semanas.',approver:'Gerente de Inventario',etaSec:0,action:'Reubicación de empaque',impact:'1,400 cajas',done:'Empaque reubicado · reorden pausado'}
];

const INITIAL_FEED = [
  {t:'07:42:11',a:'CALIDAD',m:'Lote L-22910 liberado tras reinspección 100%',c:'#22c55e'},
  {t:'07:39:02',a:'PRODUCCIÓN',m:'Pronóstico actualizado · 1,240 SKU · MAPE 11.2%',c:'#3b82f6'},
  {t:'07:31:48',a:'RETAIL',m:'Markdown aplicado · 64 SKU · 12 tiendas CarneMart',c:'#e11d48'},
  {t:'07:18:20',a:'TRANSPORTE',m:'Ruta R-118 reoptimizada · −8% costo/kg',c:'#3b82f6'},
  {t:'07:05:33',a:'INVENTARIO',m:'Días de inventario −1.4 · liberación MXN 6.2M',c:'#22c55e'},
  {t:'06:52:09',a:'COMPRAS',m:'Señal de cobertura en cerdo magro · a revisión',c:'#f59e0b'}
];

export default function Home() {
  // App States — /os boots straight into the operational console;
  // the public landing page now lives at "/" (BAFAR OS Home).
  const [view, setView] = useState("resumen");
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [resolved, setResolved] = useState([]);
  const [clock, setClock] = useState("");
  const [feed, setFeed] = useState(INITIAL_FEED);

  // Onboarding States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingView, setOnboardingView] = useState("resumen");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Vision IA States
  const [visionScenario, setVisionScenario] = useState("parma");
  const [visionOnline, setVisionOnline] = useState(false);
  const [aiActions, setAiActions] = useState([]);
  const [visionData, setVisionData] = useState({
    scenario: "Parma Produce",
    playing: true,
    events: [],
    sausage_count: 0,
    packaging_count: 0,
    packaging_defects: 0,
    logistics_in: 0,
    logistics_out: 0,
    in_yard: 0,
    rate: 0,
    efficiency: 0,
    defect_pct: 0,
    quality_index: 0,
    active_targets: 0,
    line_x: 640,
    line_y: 200,
    defect_threshold: 10
  });

  const timerRef = useRef(null);
  const isPollingRef = useRef(false);

  // Update Clock
  const getMXTime = () => {
    return new Date().toLocaleTimeString("es-MX", { hour12: false });
  };

  useEffect(() => {
    setClock(getMXTime());
    
    // Check onboarding for initial view
    checkOnboarding("resumen");

    // Start Timer Loop
    timerRef.current = setInterval(() => {
      setClock(getMXTime());
      
      // Countdown pending actions timers
      setPending((prev) =>
        prev.map((p) => (p.etaSec > 0 ? { ...p, etaSec: p.etaSec - 1 } : p))
      );

      // Poll Vision Backend
      pollVision();
    }, 1000);

    // Spotlight card mouse tracking setup
    const handleGlobalMouseMove = (e) => {
      const cards = document.querySelectorAll(".spotlight-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  // Handle Body Scroll on Landing vs Dashboard
  useEffect(() => {
    if (view === "landing") {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [view]);

  // Poll CV state API
  const pollVision = async () => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    try {
      const res = await fetch("http://127.0.0.1:8502/api/state");
      if (res.ok) {
        const data = await res.json();
        setVisionData(data);
        setVisionOnline(true);
        if (data.ai_actions) {
          setAiActions(data.ai_actions);
        }
      } else {
        setVisionOnline(false);
      }
    } catch {
      setVisionOnline(false);
    } finally {
      isPollingRef.current = false;
    }
  };

  // POST backend control
  const postControl = async (body) => {
    try {
      await fetch("http://127.0.0.1:8502/api/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (e) {
      console.error("Backend control failed:", e);
    }
  };

  // Tab switching wrapper
  const handleSetView = (newView) => {
    setView(newView);
    if (newView !== "landing") {
      checkOnboarding(newView);
    }
  };

  // Onboarding Logic
  const checkOnboarding = (viewName) => {
    const key = `bafar_onboarding_seen_${viewName}`;
    const seen = localStorage.getItem(key);
    if (!seen) {
      setOnboardingView(viewName);
      setDontShowAgain(false);
      setShowOnboarding(true);
    }
  };

  const triggerOnboardingForView = (viewName) => {
    setOnboardingView(viewName);
    setDontShowAgain(false);
    setShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    if (dontShowAgain) {
      localStorage.setItem(`bafar_onboarding_seen_${onboardingView}`, "true");
    }
    setShowOnboarding(false);
  };

  const handleToggleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain);
  };

  // Scenario operations
  const handleSetVisionScenario = (k) => {
    const map = { parma: "Parma Produce", sabori: "Sabori Bottling", carnemart: "Logistics" };
    postControl({ action: "scenario", value: k });
    setVisionScenario(k);
    setVisionData((prev) => ({ ...prev, scenario: map[k] }));
  };

  const handleToggleVisionPlay = () => {
    const playing = !visionData.playing;
    postControl({ action: playing ? "play" : "pause" });
    setVisionData((prev) => ({ ...prev, playing }));
  };

  const handleResetVision = () => {
    postControl({ action: "reset" });
    setVisionData((prev) => ({
      ...prev,
      events: [],
      sausage_count: 0,
      packaging_count: 0,
      packaging_defects: 0,
      logistics_in: 0,
      logistics_out: 0
    }));
  };

  // Action authorizations
  const handleResolveAi = (a, ok) => {
    postControl({ action: "resolve_action", action_id: a.action_id, ok });
    const timeStr = getMXTime();
    setAiActions((prev) => prev.filter((x) => x.action_id !== a.action_id));
    setResolved((prev) => [
      { title: a.title, counted: ok, resolvedAt: timeStr },
      ...prev
    ]);
    setFeed((prev) => [
      {
        t: timeStr,
        a: (a.cat || "CALIDAD").toUpperCase(),
        m: ok ? `✓ Lote bloqueado · reinspección 100% (Visión IA)` : `✕ Descartado: ${a.title}`,
        c: ok ? "#22c55e" : "#71717a"
      },
      ...prev.slice(0, 39)
    ]);
  };

  const handleApproveOp = (id) => {
    resolveOp(id, true);
  };

  const handleRejectOp = (id) => {
    resolveOp(id, false);
  };

  const resolveOp = (id, ok) => {
    const op = pending.find((p) => p.id === id);
    if (!op) return;
    const timeStr = getMXTime();
    setPending((prev) => prev.filter((p) => p.id !== id));
    setResolved((prev) => [
      { ...op, counted: ok, resolvedAt: timeStr },
      ...prev
    ]);
    setFeed((prev) => [
      {
        t: timeStr,
        a: op.cat.toUpperCase(),
        m: ok ? `✓ ${op.done}` : `✕ Descartado: ${op.action}`,
        c: ok ? "#22c55e" : "#71717a"
      },
      ...prev.slice(0, 39)
    ]);
  };

  // --- Render helpers ---
  const STA = {
    ok: { c: "#22c55e", bg: "rgba(34, 197, 94, 0.15)", l: "En línea" },
    warn: { c: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", l: "Vigilancia" },
    critico: { c: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", l: "Crítico" },
    blue: { c: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)", l: "Vigilancia" }
  };
  
  const SEV = {
    critico: { c: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", l: "CRÍTICO" },
    alto: { c: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", l: "ALTO" },
    medio: { c: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)", l: "MEDIO" }
  };

  const dec = (id) => {
    if (pending.some((p) => p.id === id)) return "pending";
    const r = resolved.find((p) => p.id === id);
    if (!r) return "none";
    return r.counted ? "appr" : "rej";
  };

  const badge = (st) => {
    const m = STA[st] || STA.ok;
    return { stColor: m.c, stBg: m.bg, stLabel: m.l };
  };

  // Sites mapping
  const mappedSites = [
    { id: "chih", name: "Chihuahua", type: "Planta + CEDIS", metric: "OEE 82%" },
    { id: "piedad", name: "La Piedad", type: "Complejo · 15 plantas", metric: "OEE 79%" },
    { id: "sabinas", name: "CEDIS Sabinas", type: "Centro frío", metric: "Cap. 71%" },
    { id: "elpaso", name: "El Paso", type: "CEDIS exportación", metric: "OTIF 96%" }
  ].map((st) => {
    const ps = pending.filter((p) => p.site === st.id);
    const stt = ps.some((p) => p.sev === "critico") ? "critico" : ps.length ? "warn" : "ok";
    const m = STA[stt];
    return {
      ...st,
      stColor: m.c,
      stBg: m.bg,
      stLabel: m.l,
      alertText: ps.length ? `${ps.length} acción${ps.length > 1 ? "es" : ""} pendiente${ps.length > 1 ? "s" : ""}` : "Sin incidencias",
      alertColor: ps.length ? m.c : "var(--text-muted)"
    };
  });

  // Flow mapping
  const mappedFlow = [
    { k: "Ganadería", v: "1,840 cab", stage: null },
    { k: "Insumos", v: "Cob. 62%", stage: "insumos" },
    { k: "Producción", v: "412 t", stage: "produccion" },
    { k: "Empaque", v: "68k/h", stage: "empaque" },
    { k: "Cadena de Frío", v: "24 uds", stage: "frio" },
    { k: "CEDIS", v: "4 centros", stage: "cedis" },
    { k: "Retail / Export", v: "312 PV", stage: "retail" }
  ].map((f, i, arr) => {
    let stt = "ok";
    if (f.stage) {
      const p = pending.find((x) => x.stage === f.stage);
      if (p) stt = p.sev === "critico" ? "critico" : "warn";
    }
    const m = STA[stt];
    return {
      k: f.k,
      v: f.v,
      stColor: m.c,
      stLabel: m.l,
      stBg: m.bg,
      arrow: i < arr.length - 1
    };
  });

  // Resumen KPIs
  const frioAlerts = pending.filter((p) => p.mod === "frio").length;
  const resumenKpis = [
    { k: "OEE Planta", v: "81%", d: "+3 pts", dc: "#22c55e" },
    { k: "Alertas frío", v: String(frioAlerts), d: frioAlerts ? "acción" : "nominal", dc: frioAlerts ? "#ef4444" : "#22c55e" },
    { k: "Cumplimiento", v: "97.8%", d: "+2.1", dc: "#22c55e" },
    { k: "Días Inventario", v: "−6.1", d: "vs 2025", dc: "#22c55e" },
    { k: "Quiebres Retail", v: "−27%", d: "", dc: "#22c55e" },
    { k: "Cobertura Q3", v: "62%", d: "+14", dc: "#22c55e" }
  ];

  // Actions formatting
  const etaStr = (x) => (x > 0 ? `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}` : "inmediata");
  
  const formattedPending = pending.map((p) => {
    const m = SEV[p.sev] || SEV.medio;
    return {
      ...p,
      sevColor: m.c,
      sevBg: m.bg,
      sevLabel: m.l,
      etaStr: etaStr(p.etaSec),
      approve: () => handleApproveOp(p.id),
      reject: () => handleRejectOp(p.id)
    };
  });

  const aiMapped = aiActions.map((a) => {
    const m = SEV[a.sev] || SEV.critico;
    return {
      id: a.action_id,
      ai: true,
      sevColor: m.c,
      sevBg: m.bg,
      sevLabel: m.l,
      cat: a.cat,
      impact: "Visión IA",
      etaStr: "inmediata",
      title: a.title,
      detail: a.detail,
      rec: a.rec,
      approver: a.approver,
      approve: () => handleResolveAi(a, true),
      reject: () => handleResolveAi(a, false)
    };
  });

  const allPendingActions = [...aiMapped, ...formattedPending];
  const pendingMiniList = allPendingActions.slice(0, 5).map((p) => ({
    title: p.title,
    cat: p.cat,
    approver: p.approver,
    sevColor: p.sevColor
  }));

  // Vision Bindings
  const vsc = visionScenario;
  const chipDefs = [
    { id: "parma", label: "🍊 Parma", sub: "Conteo de producto" },
    { id: "sabori", label: "🧪 Sabori", sub: "Control de calidad" },
    { id: "carnemart", label: "🚛 Carnemart", sub: "Patio logístico" }
  ];
  const visionChips = chipDefs.map((c) => ({
    ...c,
    active: vsc === c.id,
    onClick: () => handleSetVisionScenario(c.id)
  }));

  const vScenarioLabel = {
    parma: "PARMA · CONTEO DE PRODUCTO",
    sabori: "SABORI · CONTROL DE CALIDAD",
    carnemart: "CARNEMART · PATIO LOGÍSTICO"
  }[vsc] || "";

  let vPrimaryLabel = "Total procesado",
    vPrimaryVal = "0",
    vPrimaryDelta = "",
    vSecLabel = "",
    vSecVal = "",
    vSecColor = "#f4f4f5",
    vSecDelta = "",
    vEngine = "",
    vGateLabel = "",
    vGateVal = "";

  if (vsc === "parma") {
    vPrimaryVal = String(visionData.sausage_count || 0);
    vPrimaryDelta = `${visionData.rate || 0} / min`;
    vSecLabel = "Eficiencia objetivo";
    vSecVal = `${visionData.efficiency || 0}%`;
    vSecColor = visionData.efficiency > 80 ? "#22c55e" : "#f59e0b";
    vSecDelta = "Meta: 30 / min";
    vEngine = "YOLOv8 · Rastreador de Producto Parma";
    vGateLabel = "Línea de conteo X";
    vGateVal = `${visionData.line_x || 0} px`;
  } else if (vsc === "sabori") {
    vPrimaryVal = String(visionData.packaging_count || 0);
    vPrimaryDelta = `${visionData.rate || 0} / min`;
    vSecLabel = "Tasa de defecto";
    vSecVal = `${visionData.defect_pct || 0}%`;
    vSecColor = visionData.defect_pct > 8 ? "#ef4444" : "#22c55e";
    vSecDelta = `${visionData.packaging_defects || 0} defectos`;
    vEngine = "Inspector de Calidad de Embotellado Sabori";
    vGateLabel = "Desviación máx. tapa";
    vGateVal = `${visionData.defect_threshold || 0}°`;
  } else {
    vPrimaryLabel = "Entradas al patio";
    vPrimaryVal = String(visionData.logistics_in || 0);
    vPrimaryDelta = `${visionData.logistics_out || 0} salidas`;
    vSecLabel = "Vehículos en patio";
    vSecVal = String(visionData.in_yard || 0);
    vSecColor = visionData.in_yard > 10 ? "#f59e0b" : "#22c55e";
    vSecDelta = "Cap.: 15 bahías";
    vEngine = "YOLOv8 Nano · Clases COCO (vehículos)";
    vGateLabel = "Línea de cruce Y";
    vGateVal = `${visionData.line_y || 0} px`;
  }

  const visionLogList = (visionData.events || [])
    .slice()
    .reverse()
    .slice(0, 12)
    .map((e) => {
      const m = String(e).match(/^\[(\d{2}:\d{2}:\d{2})\]\s*(.*)$/);
      const tt = m ? m[1] : "";
      let msg = m ? m[2] : String(e);
      const isAlert = /alert/i.test(msg);
      msg = msg.replace(/^ALERT:\s*/i, "⚠ ");
      return { t: tt, msg, color: isAlert ? "#ef4444" : "#22c55e" };
    });

  const camDef = [
    ["CAM_PARMA_01", "10.200.4.51", "Línea de Producto Parma 3 · Chihuahua", "12ms", "ok"],
    ["CAM_SABORI_04", "10.200.4.54", "Embotellado Sabori 1 · Chihuahua", "14ms", "ok"],
    ["CAM_CARNEMART_IN", "10.205.10.12", "CEDIS Carnemart · Puerta 2", "19ms", "ok"],
    ["CAM_CARNEMART_OUT", "10.205.10.13", "CEDIS Carnemart · Puerta 3", "21ms", "standby"]
  ];
  const camRows = camDef.map((c) => {
    const m = c[4] === "ok" ? STA.ok : STA.warn;
    return {
      id: c[0],
      ip: `rtsp://${c[1]}:8554/stream`,
      zone: c[2],
      lat: c[3],
      stColor: m.c,
      stBg: m.bg,
      stLabel: c[4] === "ok" ? "ACTIVA" : "EN ESPERA"
    };
  });

  const resolvedList = resolved.map((r) => ({
    title: r.title,
    resolvedAt: r.resolvedAt,
    statusLabel: r.counted ? "EJECUTADA" : "DESCARTADA",
    statusColor: r.counted ? "#22c55e" : "#71717a",
    statusBg: r.counted ? "rgba(34, 197, 94, 0.15)" : "rgba(113, 113, 122, 0.15)"
  }));

  // --- Sub-views data lists ---
  const lineRows = [
    { name: "Línea 1 · Embutidos", planta: "Chihuahua", oee: "84%", out: "1,240/h", st: "ok" },
    { name: "Línea 3 · Jamones", planta: "Chihuahua", oee: "80%", out: "980/h", st: "ok" },
    { name: "Línea 3 · Empaque vacío", planta: "La Piedad", oee: "71%", out: "600/min", tie: "op2" },
    { name: "Línea 5 · Salchicha", planta: "La Piedad", oee: "83%", out: "2,100/h", st: "ok" },
    { name: "Línea 2 · Tocino", planta: "La Piedad", oee: "77%", out: "820/h", st: "warn" }
  ].map((l) => {
    let st = l.st;
    if (l.tie) {
      const d = dec(l.tie);
      st = d === "pending" ? "critico" : d === "appr" ? "ok" : "warn";
    }
    return { ...l, ...badge(st) };
  });

  const demandaRows = [
    { sku: "Jamón de pavo 1kg", planta: "Chihuahua", fc: "8,240", plan: "7,000", adj: "+1,240", mape: "9.8%" },
    { sku: "Salchicha Viena", planta: "La Piedad", fc: "12,600", plan: "12,400", adj: "+200", mape: "7.2%" },
    { sku: "Tocino ahumado", planta: "La Piedad", fc: "4,180", plan: "4,500", adj: "−320", mape: "11.4%" },
    { sku: "Chorizo Sabori", planta: "Chihuahua", fc: "6,050", plan: "6,000", adj: "+50", mape: "8.1%" },
    { sku: "Jamón Parma", planta: "La Piedad", fc: "3,420", plan: "3,400", adj: "+20", mape: "12.9%" },
    { sku: "Pavo entero", planta: "Chihuahua", fc: "1,980", plan: "1,600", adj: "+380", mape: "15.2%" }
  ].map((r) => ({
    ...r,
    adjColor: r.adj.indexOf("−") >= 0 ? "#ef4444" : r.adj === "+20" || r.adj === "+50" || r.adj === "+200" ? "#a1a1aa" : "#22c55e"
  }));

  const trailerRows = [
    { id: "TX-4471", route: "Chihuahua → El Paso", temp: "6.8 °C ↑", setp: "≤4 °C", tie: "op1" },
    { id: "MX-2210", route: "La Piedad → CDMX", temp: "2.1 °C", setp: "≤4 °C", st: "ok", note: "Nominal" },
    { id: "MX-3380", route: "Chihuahua → Monterrey", temp: "3.4 °C", setp: "≤4 °C", st: "warn", note: "En vigilancia" },
    { id: "TX-4490", route: "El Paso → Dallas", temp: "1.8 °C", setp: "≤4 °C", st: "ok", note: "Nominal" },
    { id: "MX-5102", route: "La Piedad → Guadalajara", temp: "2.6 °C", setp: "≤4 °C", st: "ok", note: "Nominal" },
    { id: "MX-1175", route: "Chihuahua → Hermosillo", temp: "3.0 °C", setp: "≤4 °C", st: "ok", note: "Nominal" }
  ].map((t) => {
    let st = t.st, note = t.note, temp = t.temp;
    if (t.tie) {
      const d = dec(t.tie);
      if (d === "pending") { st = "critico"; note = "Excursión proyectada"; }
      else if (d === "appr") { st = "ok"; note = "Reruteado a Sabinas"; temp = "3.6 °C ↓"; }
      else { st = "warn"; note = "Reruteo descartado"; }
    }
    const m = STA[st];
    return {
      ...t,
      temp,
      note,
      stColor: m.c,
      stBg: m.bg,
      stLabel: m.l,
      tempColor: st === "critico" ? "#ef4444" : st === "warn" ? "#f59e0b" : "var(--text-main)",
      rowBg: st === "critico" ? "rgba(239, 68, 68, 0.08)" : "transparent",
      showResolve: t.tie && dec(t.tie) === "pending"
    };
  });

  const lotRows = [
    { id: "L-22918", line: "Línea 3 · La Piedad", defect: "Sellado +2.3σ", tie: "op2" },
    { id: "L-22910", line: "Línea 1 · La Piedad", defect: "—", st: "ok", note: "Liberado tras reinspección" },
    { id: "L-22922", line: "Línea 2 · Chihuahua", defect: "—", st: "ok", note: "En spec" },
    { id: "L-22925", line: "Línea 4 · La Piedad", defect: "Etiqueta 0.4%", st: "blue", note: "Dentro de tolerancia" },
    { id: "L-22931", line: "Línea 1 · Chihuahua", defect: "—", st: "ok", note: "En spec" }
  ].map((l) => {
    let st = l.st, note = l.note;
    if (l.tie) {
      const d = dec(l.tie);
      if (d === "pending") { st = "warn"; note = "Bloqueo pendiente"; }
      else if (d === "appr") { st = "critico"; note = "Bloqueado · reinspección 100%"; }
      else { st = "ok"; note = "Liberado por decisión humana"; }
    }
    const m = STA[st];
    return {
      ...l,
      note,
      stColor: m.c,
      stBg: m.bg,
      stLabel: st === "critico" && l.tie ? "Bloqueado" : st === "warn" && l.tie ? "Pendiente" : m.l,
      rowBg: l.tie && dec(l.tie) === "pending" ? "rgba(245, 158, 11, 0.08)" : l.tie && dec(l.tie) === "appr" ? "rgba(239, 68, 68, 0.08)" : "transparent"
    };
  });

  const cedisRows = [
    { id: "chih", name: "CEDIS Chihuahua", dias: "−6.1", fefo: "99.1%", tie: "op6" },
    { id: "piedad", name: "CEDIS La Piedad", dias: "−4.8", fefo: "99.4%", st: "ok", note: "Nominal" },
    { id: "sabinas", name: "CEDIS Sabinas", dias: "−3.2", fefo: "98.7%", st: "ok", note: "Capacidad fría disponible" },
    { id: "elpaso", name: "CEDIS El Paso", dias: "−2.1", fefo: "99.0%", st: "blue", note: "Nuevo · en ramp-up" }
  ].map((c) => {
    let st = c.st, note = c.note;
    if (c.tie) {
      const d = dec(c.tie);
      if (d === "pending") { st = "warn"; note = "Sobre-stock empaque +38%"; }
      else if (d === "appr") { st = "ok"; note = "Empaque reubicado · reorden pausado"; }
      else { st = "warn"; note = "Sobre-stock sin atender"; }
    }
    const m = STA[st];
    return {
      ...c,
      note,
      stColor: m.c,
      stBg: m.bg,
      stLabel: m.l,
      rowBg: c.tie && dec(c.tie) === "pending" ? "rgba(245, 158, 11, 0.08)" : "transparent"
    };
  });

  const retailRows = [
    { cluster: "Perecederos <48 h", tiendas: "28 tiendas", metric: "142 SKU", tie: "op4" },
    { cluster: "Clúster Urbano Premium", tiendas: "64 tiendas", metric: "+11.4%", st: "ok", note: "Surtido óptimo" },
    { cluster: "Clúster Frontera", tiendas: "38 tiendas", metric: "+8.1%", st: "ok", note: "Anti-quiebre activo" },
    { cluster: "Clúster Tradicional", tiendas: "182 tiendas", metric: "3 quiebres", st: "warn", note: "Reposición en curso" }
  ].map((r) => {
    let st = r.st, note = r.note;
    if (r.tie) {
      const d = dec(r.tie);
      if (d === "pending") { st = "warn"; note = "Markdown −18% propuesto"; }
      else if (d === "appr") { st = "ok"; note = "Markdown activo"; }
      else { st = "warn"; note = "Markdown descartado"; }
    }
    const m = STA[st];
    return {
      ...r,
      note,
      stColor: m.c,
      stBg: m.bg,
      stLabel: m.l,
      rowBg: r.tie && dec(r.tie) === "pending" ? "rgba(245, 158, 11, 0.08)" : "transparent"
    };
  });

  const posRows = [
    { name: "Cerdo magro (CME)", cov: "48%", signal: "Alza 60 d", tie: "op3" },
    { name: "Maíz amarillo (CBOT)", cov: "74%", signal: "Estable", st: "ok", note: "Cobertura objetivo" },
    { name: "Empaque flexible", cov: "66%", signal: "FX favorable", st: "ok", note: "Rebalanceado" },
    { name: "Exposición FX (USD)", cov: "En límite", signal: "Vol. media", st: "blue", note: "Monitoreo activo" }
  ].map((p) => {
    let st = p.st, note = p.note, cov = p.cov;
    if (p.tie) {
      const d = dec(p.tie);
      if (d === "pending") { st = "warn"; note = "Hedge 35% propuesto"; }
      else if (d === "appr") { st = "ok"; note = "Hedge ejecutado"; cov = "78%"; }
      else { st = "warn"; note = "Hedge descartado"; }
    }
    const m = STA[st];
    return {
      ...p,
      cov,
      note,
      stColor: m.c,
      stBg: m.bg,
      stLabel: m.l,
      rowBg: p.tie && dec(p.tie) === "pending" ? "rgba(245, 158, 11, 0.08)" : "transparent"
    };
  });

  // Banners for sub-views
  const ban = (mod) => {
    const p = pending.find((x) => x.mod === mod);
    return { show: !!p, title: p ? p.title : "" };
  };

  const banPlantas = ban("demanda");
  const banTransp = ban("frio");
  const banCalidad = ban("calidad");
  const banInv = ban("inventario");
  const banRetail = ban("retail");
  const banCompras = ban("commodities");

  // KPI helper list maps
  const plantasKpis = [
    { k: "OEE promedio", v: "81%", d: "+3 pts", dc: "#22c55e" },
    { k: "Producción hoy", v: "412 t", d: "en plan", dc: "#a1a1aa" },
    { k: "Cumpl. plan", v: "97.8%", d: "+2.1", dc: "#22c55e" },
    { k: "Merma sobreprod.", v: "−22%", d: "vs 2025", dc: "#22c55e" }
  ];

  const transpKpis = [
    { k: "Excursiones críticas", v: "0", d: "hoy", dc: "#a1a1aa" },
    { k: "OTIF", v: "97.4%", d: "+1.8", dc: "#22c55e" },
    { k: "Costo / kg", v: "−7%", d: "vs 2025", dc: "#22c55e" },
    { k: "Unidades en ruta", v: "24", d: "activas", dc: "#a1a1aa" }
  ];

  const calidadKpis = [
    { k: "Defecto escapado", v: "−71%", d: "vs 2025", dc: "#22c55e" },
    { k: "Reproceso", v: "−24%", d: "", dc: "#22c55e" },
    { k: "Inspección", v: "100%", d: "en línea", dc: "#a1a1aa" },
    { k: "Hallazgos TIF", v: "0", d: "este mes", dc: "#a1a1aa" }
  ];

  const invKpis = [
    { k: "Días de inventario", v: "−6.1", d: "vs 2025", dc: "#22c55e" },
    { k: "Capital liberado", v: "MXN 214M", d: "YTD", dc: "#22c55e" },
    { k: "FEFO", v: "99.1%", d: "", dc: "#a1a1aa" },
    { k: "Quiebres", v: "−18%", d: "", dc: "#22c55e" }
  ];

  const retailKpis = [
    { k: "Ventas / m²", v: "+9.2%", d: "", dc: "#22c55e" },
    { k: "Quiebres", v: "−27%", d: "", dc: "#22c55e" },
    { k: "Merma perecederos", v: "−31%", d: "", dc: "#22c55e" },
    { k: "Tiendas activas", v: "312", d: "", dc: "#a1a1aa" }
  ];

  const comprasKpis = [
    { k: "Cobertura Q3", v: "62%", d: "+14", dc: "#22c55e" },
    { k: "Ahorro vs spot", v: "MXN 41M", d: "YTD", dc: "#22c55e" },
    { k: "Exposición FX", v: "En límite", d: "", dc: "#a1a1aa" },
    { k: "Lead-time prov.", v: "−9%", d: "", dc: "#22c55e" }
  ];

  if (view === "landing") {
    return <Landing onEnterDashboard={() => handleSetView("resumen")} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: "var(--bg-primary)", color: "var(--text-main)", overflow: "hidden" }}>
      {/* Sidebar navigation */}
      <Sidebar currentView={view} setView={handleSetView} pendN={allPendingActions.length} />

      {/* Main panel container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Live Commodities Marquee Ticker */}
        <div className="ticker-wrap">
          <div className="ticker">
            <div className="ticker-item">🐖 CME LEAN HOGS: <span className="ticker-val">84.25 USD</span> <span className="ticker-up">▲ +1.4%</span></div>
            <div className="ticker-item">🌽 CBOT MAÍZ: <span className="ticker-val">4.62 USD/bu</span> <span className="ticker-down">▼ -0.8%</span></div>
            <div className="ticker-item">💵 USD/MXN: <span className="ticker-val">18.2540 MXN</span> <span className="ticker-up">▲ +0.12%</span></div>
            <div className="ticker-item">⛽ DIESEL ÍNDICE: <span className="ticker-val">3.92 USD/gal</span> <span className="ticker-down">▼ -0.3%</span></div>
            <div className="ticker-item">🥩 USDA PORK CUTOUT: <span className="ticker-val">96.50 USD</span> <span className="ticker-up">▲ +0.7%</span></div>
            <div className="ticker-item">🐂 GANADO EN PIE: <span className="ticker-val">178.40 USD/cwt</span> <span className="ticker-up">▲ +1.1%</span></div>
            <div className="ticker-item">🐖 CME LEAN HOGS: <span className="ticker-val">84.25 USD</span> <span className="ticker-up">▲ +1.4%</span></div>
            <div className="ticker-item">🌽 CBOT MAÍZ: <span className="ticker-val">4.62 USD/bu</span> <span className="ticker-down">▼ -0.8%</span></div>
            <div className="ticker-item">💵 USD/MXN: <span className="ticker-val">18.2540 MXN</span> <span className="ticker-up">▲ +0.12%</span></div>
            <div className="ticker-item">⛽ DIESEL ÍNDICE: <span className="ticker-val">3.92 USD/gal</span> <span className="ticker-down">▼ -0.3%</span></div>
          </div>
        </div>

        {/* Page Header */}
        <header style={{ height: "58px", flex: "none", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", background: "var(--bg-sidebar)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} className="animate-pulse-custom" />
              <span style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", color: "#22c55e" }}>OPERANDO</span>
            </div>
            <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Operación nacional · Turno A</span>
            <span style={{ fontSize: "12px", color: "#3f3f46" }}>·</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{clock}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)", textDecoration: "none" }} title="Volver a BAFAR OS Home">← Inicio</Link>
            <button onClick={() => triggerOnboardingForView(view)} className="magnetic-btn" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-main)", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }} title="Guía de Operación">?</button>
            <button onClick={() => handleSetView("acc")} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 13px", borderRadius: "20px", border: allPendingActions.length > 0 ? "1px solid #EBB6AC" : "1px solid #CFE3D6", background: allPendingActions.length > 0 ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)", color: allPendingActions.length > 0 ? "#ef4444" : "#22c55e", fontSize: "12px", fontWeight: 700 }}>
              {allPendingActions.length > 0 ? `${allPendingActions.length} acciones pendientes` : "Sin alertas"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Chihuahua · La Piedad · Sabinas · El Paso</span>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "26px 30px 46px" }}>
          
          {/* 1. Resumen Tab */}
          {view === "resumen" && (
            <ResumenOperativo
              sites={mappedSites}
              flow={mappedFlow}
              resumenKpis={resumenKpis}
              pendingMini={pendingMiniList}
              feed={feed}
              pendN={allPendingActions.length}
              allClear={allPendingActions.length === 0}
              goAcc={() => handleSetView("acc")}
            />
          )}

          {/* 2. Plantas Tab */}
          {view === "plantas" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Plantas y Producción</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Líneas activas en Chihuahua y el complejo de La Piedad, y el plan maestro de producción.</p>
              </div>
              {banPlantas.show && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid #EAD6A8", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: 500 }}>Acción pendiente: {banPlantas.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {plantasKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px", marginBottom: "18px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>LÍNEAS DE PRODUCCIÓN</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr 0.8fr 0.9fr 1fr", gap: "14px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>LÍNEA</div><div>SEDE</div><div>OEE</div><div>RITMO</div><div>ESTADO</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {lineRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr 0.8fr 0.9fr 1fr", gap: "14px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.planta}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "13px", color: "var(--text-main)" }}>{r.oee}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{r.out}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 3. Transporte Tab */}
          {view === "transp" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Transporte y Cadena de Frío</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Flota refrigerada en ruta entre sedes, con control térmico extremo a extremo.</p>
              </div>
              {banTransp.show && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EBB6AC", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>Acción pendiente: {banTransp.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {transpKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>UNIDADES EN RUTA</div>
                <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.8fr 0.9fr 0.8fr 1fr 1.2fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>UNIDAD</div><div>RUTA</div><div>TEMP.</div><div>LÍMITE</div><div>ESTADO</div><div>ACCIÓN</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {trailerRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "0.9fr 1.8fr 0.9fr 0.8fr 1fr 1.2fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center", background: r.rowBg }}>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-main)", fontWeight: 600 }}>{r.id}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.route}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "13px", color: r.tempColor, fontWeight: 600 }}>{r.temp}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", color: "var(--text-muted)" }}>{r.setp}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                      <div style={{ minWidth: 0 }}>
                        {r.showResolve && <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "6px 12px", borderRadius: "7px", border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", fontSize: "11.5px", fontWeight: 700 }}>Reruteo →</button>}
                        {!r.showResolve && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 4. Calidad Tab */}
          {view === "calidad" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Calidad e Inocuidad</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Inspección 100% en línea y trazabilidad de lotes bajo régimen TIF / USDA. La liberación o retiro de producto siempre la autoriza un humano.</p>
              </div>
              {banCalidad.show && (
                <div style={{ display: "flex", alignItems: "center", justifyCenter: "space-between", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EBB6AC", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>Acción pendiente: {banCalidad.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {calidadKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>LOTES EN PRODUCCIÓN</div>
                <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.6fr 1.2fr 1fr 1.3fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>LOTE</div><div>LÍNEA / SEDE</div><div>HALLAZGO</div><div>ESTADO</div><div>NOTA</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {lotRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "0.9fr 1.6fr 1.2fr 1fr 1.3fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center", background: r.rowBg }}>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-main)", fontWeight: 600 }}>{r.id}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.line}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.defect}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 5. Visión IA Tab */}
          {view === "vision" && (
            <VisionIA
              visionChips={visionChips}
              visionOnline={visionOnline}
              visionOffline={!visionOnline}
              visionStreamLabel={vScenarioLabel}
              toggleVisionPlay={handleToggleVisionPlay}
              resetVision={handleResetVision}
              visionPlayLabel={visionData.playing !== false ? "⏸ Pausar" : "▶ Reproducir"}
              visionStateLabel={visionData.playing !== false ? "PROCESANDO" : "EN PAUSA"}
              visionStateColor={visionData.playing !== false ? "#22c55e" : "#f59e0b"}
              visionLog={visionLogList}
              visionLogEmpty={visionLogList.length === 0}
              visionPrimaryLabel={vPrimaryLabel}
              visionPrimaryVal={vPrimaryVal}
              visionPrimaryDelta={vPrimaryDelta}
              visionSecLabel={vSecLabel}
              visionSecVal={vSecVal}
              visionSecColor={vSecColor}
              visionSecDelta={vSecDelta}
              visionEngine={vEngine}
              visionActiveTargets={String(visionData.active_targets || 0)}
              visionGateLabel={vGateLabel}
              visionGateVal={vGateVal}
              camRows={camRows}
            />
          )}

          {/* 6. Inventario Tab */}
          {view === "inv" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Inventario y CEDIS</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Niveles de inventario, cumplimiento FEFO y capital de trabajo a través de los cuatro centros de distribución.</p>
              </div>
              {banInv.show && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid #EAD6A8", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: 500 }}>Acción pendiente: {banInv.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {invKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>CENTROS DE DISTRIBUCIÓN</div>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.9fr 1fr 1.7fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>CEDIS</div><div>DÍAS INV.</div><div>FEFO</div><div>ESTADO</div><div>NOTA</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {cedisRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.9fr 1fr 1.7fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center", background: r.rowBg }}>
                      <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{r.dias}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{r.fefo}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 7. Retail Tab */}
          {view === "retail" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Retail y Puntos de Venta</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Desempeño de CarneMart y BIF por clúster de tiendas, frescura y markdowns dinámicos.</p>
              </div>
              {banRetail.show && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid #EAD6A8", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: 500 }}>Acción pendiente: {banRetail.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {retailKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>CLÚSTERES DE TIENDAS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.1fr 1fr 1.6fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>SEGMENTO</div><div>TIENDAS</div><div>INDICADOR</div><div>ESTADO</div><div>NOTA</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {retailRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.1fr 1fr 1.6fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center", background: r.rowBg }}>
                      <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 500 }}>{r.cluster}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.tiendas}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{r.metric}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 8. Compras Tab */}
          {view === "compras" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Compras y Commodities</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px" }}>Cobertura de cárnicos, granos y empaque, y exposición de tipo de cambio. La IA recomienda coberturas; el comité las autoriza.</p>
              </div>
              {banCompras.show && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 18px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid #EAD6A8", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: 500 }}>Acción pendiente: {banCompras.title}</span>
                  <button onClick={() => handleSetView("acc")} className="magnetic-btn" style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>Revisar →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                {comprasKpis.map((k, idx) => (
                  <SpotlightCard key={idx} style={{ padding: "15px 16px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, position: "relative", zIndex: 2 }}>{k.k}</div>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: "23px", color: "var(--text-main)", fontWeight: 600, marginTop: "6px", position: "relative", zIndex: 2 }}>{k.v}</div>
                    <div style={{ fontSize: "11px", marginTop: "2px", height: "14px", color: k.dc, fontWeight: 500, position: "relative", zIndex: 2 }}>{k.d}</div>
                  </SpotlightCard>
                ))}
              </div>
              <SpotlightCard style={{ padding: "8px 22px 14px", borderRadius: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", padding: "14px 0 6px", position: "relative", zIndex: 2 }}>POSICIONES Y COBERTURA</div>
                <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1.1fr 1fr 1.5fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border-color)", fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  <div>POSICIÓN</div><div>COBERTURA</div><div>SEÑAL</div><div>ESTADO</div><div>NOTA</div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  {posRows.map((r, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1.1fr 1fr 1.5fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border-color)", alignItems: "center", background: r.rowBg }}>
                      <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12.5px", color: "var(--text-muted)" }}>{r.cov}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{r.signal}</div>
                      <div><span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", color: r.stColor, background: r.stBg }}>{r.stLabel}</span></div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 9. Acciones Pendientes Tab */}
          {view === "acc" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: "18px" }}>
                <h1 style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: "25px", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>Acciones Pendientes</h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13.5px", maxWidth: "700px" }}>Decisiones operativas y de inocuidad que requieren tu autorización. Al ejecutar una acción, el cambio se aplica en toda la torre de control. Ningún proceso crítico se ejecuta sin firma humana.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "18px", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                  {allPendingActions.map((p) => (
                    <div key={p.id} style={{ position: "relative", padding: "18px 20px", borderRadius: "14px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderLeft: `3px solid ${p.sevColor}`, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          <span style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.05em", padding: "3px 9px", borderRadius: "20px", color: p.sevColor, background: p.sevBg }}>{p.sevLabel}</span>
                          <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.02em" }}>{p.cat}</span>
                          <span style={{ fontSize: "11px", color: "#52525b" }}>· {p.impact}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>expira en <span style={{ fontFamily: "IBM Plex Mono", color: "#f59e0b" }}>{p.etaStr}</span></span>
                      </div>
                      <div style={{ fontFamily: "Archivo", fontWeight: 700, fontSize: "16px", color: "var(--text-main)", margin: "11px 0 6px" }}>{p.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{p.detail}</div>
                      <div style={{ marginTop: "12px", padding: "11px 14px", borderRadius: "10px", background: "rgba(225, 29, 72, 0.08)", border: "1px solid rgba(225, 29, 72, 0.2)" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--accent)" }}>ACCIÓN RECOMENDADA</span>
                        <div style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px", lineHeight: 1.45 }}>{p.rec}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "13px", gap: "12px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Autoriza: <span style={{ color: "var(--text-main)" }}>{p.approver}</span></span>
                        <div style={{ display: "flex", gap: "9px" }}>
                          <button onClick={p.reject} className="magnetic-btn" style={{ padding: "9px 18px", borderRadius: "9px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-muted)", fontWeight: 600, fontSize: "12.5px" }}>Descartar</button>
                          <button onClick={p.approve} className="magnetic-btn" style={{ padding: "9px 20px", borderRadius: "9px", border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: "12.5px" }}>Autorizar y ejecutar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {allPendingActions.length === 0 && (
                    <div style={{ padding: "44px 24px", borderRadius: "14px", background: "var(--bg-card)", border: "1px dashed var(--border-color)", textAlign: "center" }}>
                      <div style={{ fontSize: "30px", color: "#22c55e", marginBottom: "8px" }}>✓</div>
                      <div style={{ fontFamily: "Archivo", fontWeight: 700, fontSize: "17px", color: "#22c55e" }}>Todo autorizado</div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>No hay acciones pendientes. La operación corre con normalidad en las cuatro sedes.</div>
                    </div>
                  )}
                </div>

                <SpotlightCard style={{ padding: "18px 20px", borderRadius: "14px", position: "sticky", top: 0 }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-muted)", marginBottom: "13px", position: "relative", zIndex: 2 }}>EJECUTADAS EN ESTA SESIÓN</div>
                  {resolvedList.length === 0 && (
                    <div style={{ padding: "18px 4px", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.5, position: "relative", zIndex: 2 }}>Aún no autorizas acciones. Cada decisión queda registrada aquí con sello de tiempo y trazabilidad.</div>
                  )}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    {resolvedList.map((r, idx) => (
                      <div key={idx} style={{ padding: "10px 0", borderBottom: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontFamily: "IBM Plex Mono", fontSize: "10.5px", color: "var(--text-muted)" }}>{r.resolvedAt}</span><span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "20px", color: r.statusColor, background: r.statusBg }}>{r.statusLabel}</span></div>
                        <div style={{ fontSize: "12px", color: "var(--text-main)", marginTop: "4px" }}>{r.title}</div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        data={ONBOARDING_DATA[onboardingView]}
        dontShowAgain={dontShowAgain}
        onToggleDontShow={handleToggleDontShowAgain}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
