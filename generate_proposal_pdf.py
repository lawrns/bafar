#!/usr/bin/env python3
"""
generate_proposal_pdf.py
Crea la propuesta comercial de BAFAR OS en PDF con la identidad visual del sistema.
Salida: /Users/lukatenbosch/Downloads/bafar/BAFAR_OS_Propuesta_Comercial.pdf
"""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    PageTemplate,
    Frame,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
    Image,
    NextPageTemplate,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# -----------------------------------------------------------------------------
# Brand Colors & Palette (Light default, warm elegant corporate tones)
# -----------------------------------------------------------------------------
BURGUNDY = colors.HexColor("#5C1810")      # Rich brand red
BURGUNDY_DARK = colors.HexColor("#2A0B07") # Very deep dark warm burgundy (for cover)
CREAM = colors.HexColor("#FBF9F4")         # Warm background cream
CREAM_LIGHT = colors.HexColor("#FDFDFB")
DARK_TEXT = colors.HexColor("#1A1C1F")     # Slate black
MUTED_TEXT = colors.HexColor("#5C5E61")    # Slate grey
BORDER_COLOR = colors.HexColor("#E2DBCD")  # Thin divider gold-grey
GOLD = colors.HexColor("#D8AE9E")          # Decorative bronze/gold for cover
WHITE = colors.white
LIGHT_BG = colors.HexColor("#FCFBF8")

OUT_PATH = "/Users/lukatenbosch/Downloads/bafar/BAFAR_OS_Propuesta_Comercial.pdf"


# -----------------------------------------------------------------------------
# Header / Footer Templates
# -----------------------------------------------------------------------------
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    width, height = A4

    # Header line
    canvas_obj.setStrokeColor(BURGUNDY)
    canvas_obj.setLineWidth(2.0)
    canvas_obj.line(36, height - 42, width - 36, height - 42)

    # Header text
    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.setFillColor(BURGUNDY)
    canvas_obj.drawString(36, height - 34, "BAFAR OS")
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(MUTED_TEXT)
    canvas_obj.drawRightString(width - 36, height - 34, "PROPUESTA COMERCIAL")

    # Footer line
    canvas_obj.setStrokeColor(BORDER_COLOR)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(36, 42, width - 36, 42)

    # Footer text
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(MUTED_TEXT)
    canvas_obj.drawString(36, 28, "BAFAR OS · Propuesta Comercial Confidencial")
    canvas_obj.drawRightString(width - 36, 28, f"Página {doc.page}")

    canvas_obj.restoreState()


def draw_cover_background(canvas_obj, doc):
    canvas_obj.saveState()
    width, height = A4

    # Deep premium dark burgundy cover page
    canvas_obj.setFillColor(BURGUNDY_DARK)
    canvas_obj.rect(0, 0, width, height, fill=1, stroke=0)

    # Decorative thin double border
    canvas_obj.setStrokeColor(colors.HexColor("#8C6E63"))
    canvas_obj.setLineWidth(1.0)
    canvas_obj.rect(36, 36, width - 72, height - 72, fill=0, stroke=1)

    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.rect(40, 40, width - 80, height - 80, fill=0, stroke=1)

    # Crosshairs on the corners (computer vision theme)
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(0.75)
    # Top-Left crosshair
    canvas_obj.line(52, 62, 72, 62)
    canvas_obj.line(62, 52, 62, 72)
    # Bottom-Right crosshair
    canvas_obj.line(width - 72, height - 62, width - 52, height - 62)
    canvas_obj.line(width - 62, height - 72, width - 62, height - 52)

    canvas_obj.restoreState()


# -----------------------------------------------------------------------------
# Style Helpers & Reusable Style Objects
# -----------------------------------------------------------------------------
def make_style(name, font, size, color=DARK_TEXT, align=TA_LEFT, leading=None,
               space_after=6, space_before=0, bold=False, leftIndent=0,
               rightIndent=0):
    if leading is None:
        leading = size * 1.3
    return ParagraphStyle(
        name,
        fontName=font + ("-Bold" if bold else ""),
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=space_after,
        spaceBefore=space_before,
        leftIndent=leftIndent,
        rightIndent=rightIndent,
    )


# Standard Typography styles
title = make_style("title", "Helvetica", 32, CREAM, leading=38, space_after=14, bold=True)
subtitle = make_style("subtitle", "Helvetica", 14, GOLD, leading=18, space_after=24)
h1 = make_style("h1", "Helvetica", 20, BURGUNDY, space_before=16, space_after=10, bold=True)
h2 = make_style("h2", "Helvetica", 14, DARK_TEXT, space_before=14, space_after=8, bold=True)
h3 = make_style("h3", "Helvetica", 11, BURGUNDY, space_before=10, space_after=6, bold=True)

body = make_style("body", "Helvetica", 10, MUTED_TEXT, leading=14.5, space_after=8)
body_dark = make_style("body_dark", "Helvetica", 10, DARK_TEXT, leading=14.5, space_after=8)
bullet = make_style("bullet", "Helvetica", 10, MUTED_TEXT, leading=14.5, space_after=6, leftIndent=14)
callout_text = make_style("callout_text", "Helvetica", 10.5, DARK_TEXT, leading=15, space_after=0)

# Table Typography (Leading kept matching text height with 0 spaceAfter for padding alignment)
table_header = make_style("table_header", "Helvetica", 9, WHITE, leading=12, space_after=0, bold=True)
table_cell = make_style("table_cell", "Helvetica", 8.5, MUTED_TEXT, leading=11.5, space_after=0)
table_cell_bold = make_style("table_cell_bold", "Helvetica", 8.5, DARK_TEXT, leading=11.5, space_after=0, bold=True)


def p(text, style):
    return Paragraph(text, style)


# -----------------------------------------------------------------------------
# Layout Elements & Tables
# -----------------------------------------------------------------------------
def get_onboarding_image(name, width=230, height=129.4):
    """Gets a styled image card wrapper for a given onboarding mockup screenshot (16:9)."""
    path = f"/Users/lukatenbosch/Downloads/bafar/dashboard/public/images/{name}.png"
    if not os.path.exists(path):
        # Return fallback spacer with placeholder box border
        t = Table([[p(f"Mockup: {name}", table_cell_bold)]], colWidths=[width + 12], rowHeights=[height + 12])
        t.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        return t
        
    img = Image(path, width=width, height=height)
    img.hAlign = 'CENTER'
    
    # Wrap in table for border and white card padding
    t = Table([[img]], colWidths=[width + 12])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    t.hAlign = 'CENTER'
    return t


def text_and_image_row(story_paragraph_list, img_card, reverse=False):
    """Aligns a text block on one side and a dashboard visual mockup on the other."""
    # Print width is 523pt total. Split into cols: 255pt text, 255pt image card, 13pt gap
    col1 = 255
    col2 = 255
    
    if reverse:
        cols = [col2, 268]
        cells = [[img_card, story_paragraph_list]]
    else:
        cols = [268, col2]
        cells = [[story_paragraph_list, img_card]]
        
    t = Table(cells, colWidths=cols)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def make_callout(text):
    """Creates a beautiful callout box with a thick left border to match GitHub-style alerts."""
    t = Table([[p(text, callout_text)]], colWidths=[523])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ("LINELEFT", (0, 0), (0, -1), 3.5, BURGUNDY),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#F0EBE0")),
    ]))
    t.hAlign = 'CENTER'
    return t


def build_table(data, col_widths, h_align="LEFT"):
    """Constructs a clean modern table with alternating row colors and minimal dividers."""
    t = Table(data, colWidths=col_widths, hAlign=h_align)
    style = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("BACKGROUND", (0, 0), (-1, 0), BURGUNDY),
    ]
    # Alternating row backgrounds
    for i in range(1, len(data)):
        bg = LIGHT_BG if i % 2 == 0 else colors.white
        style.append(("BACKGROUND", (0, i), (-1, i), bg))
        
    # Divider borders
    style.append(("LINEBELOW", (0, 0), (-1, 0), 1.5, BURGUNDY))
    style.append(("LINEBELOW", (0, 1), (-1, -1), 0.5, BORDER_COLOR))
    style.append(("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR))
    
    t.setStyle(TableStyle(style))
    return t


def two_col_table(items, col1_width=180, col2_width=343):
    """Helper to build standard two-column feature lists."""
    data = [[p("Componente / Entregable", table_header), p("Descripción / Alcance", table_header)]]
    for label, desc in items:
        data.append([p(f"<b>{label}</b>", table_cell_bold), p(desc, table_cell)])
    return build_table(data, [col1_width, col2_width])


# -----------------------------------------------------------------------------
# Main Proposal Flow Builder
# -----------------------------------------------------------------------------
def build_document():
    doc = BaseDocTemplate(
        OUT_PATH,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=60,
        bottomMargin=60,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    
    template_cover = PageTemplate(id="cover", frames=frame, onPage=draw_cover_background)
    template_normal = PageTemplate(id="normal", frames=frame, onPage=header_footer)
    doc.addPageTemplates([template_cover, template_normal])

    story = []

    # =====================================================================
    # PAGE 1: COVER PAGE
    # =====================================================================
    story.append(Spacer(1, 40))
    story.append(p("<font color='#D8AE9E' size=14>●</font>  <font color='#FBF5EC' size=14><b>BAFAR</b></font> <font color='#D8AE9E' size=14>OS</font>",
                   make_style("brand", "Helvetica", 14, CREAM, space_after=60)))
    story.append(p("Propuesta Comercial", subtitle))
    story.append(p("Visión por Inteligencia Artificial<br/>para Grupo Bafar", title))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=30))
    story.append(p("Software, implementación, instalación de cámaras e integración<br/>"
                   "con las divisiones operativas: Parma, Sabori y Carnemart.",
                   make_style("cover_sub", "Helvetica", 12.5, colors.HexColor("#CFB7AC"), leading=17, space_after=40)))

    cover_info = [
        ["Preparado para:", "Grupo Bafar"],
        ["Fecha:", "25 de junio de 2026"],
        ["Vigencia de cotización:", "30 días"],
        ["Contacto:", "Laurence ten Bosch (laurence@fyves.com)"],
    ]
    info_table = Table(cover_info, colWidths=[130, 250])
    info_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 0), (0, -1), GOLD),
        ("TEXTCOLOR", (1, 0), (1, -1), CREAM),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#3D1510")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#7A2E24")),
    ]))
    story.append(info_table)

    story.append(Spacer(1, 70))
    story.append(p("<font color='#D8AE9E'><b>La IA detecta. Una persona autoriza.</b></font>",
                   make_style("tagline", "Helvetica", 11.5, GOLD, bold=True)))
                   
    # Instruct layout manager to switch from cover template to normal header/footer template next
    story.append(NextPageTemplate("normal"))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 2: EXECUTIVE SUMMARY
    # =====================================================================
    story.append(p("Resumen Ejecutivo", h1))
    
    intro_txt = [
        p("<b>BAFAR OS</b> es una torre de control operativa que combina visión por computadora "
          "con inteligencia artificial para inspeccionar, contar y auditar procesos críticos "
          "en tiempo real. La plataforma ya demostrada en este prototipo integra detección "
          "YOLOv8, un dashboard ejecutivo en Next.js y un flujo de autorización humana que "
          "garantiza trazabilidad y cumplimiento.", body),
        p("Esta propuesta cubre la entrega completa: desarrollo de software a medida, "
          "instalación de cámaras y edge devices, calibración de modelos con productos reales "
          "de Bafar, capacitación de equipos locales e integración con sistemas corporativos.", body),
    ]
    # Fetch the high-fidelity Resumen onboarding mockup to show next to executive summary
    res_img = get_onboarding_image("onboarding_resumen", width=230, height=129.4)
    
    story.append(text_and_image_row(intro_txt, res_img))
    story.append(Spacer(1, 16))

    highlights = [
        [p("Menos defectos no detectados", table_cell_bold), p("Inspección automática en líneas de empaque y calidad.", table_cell)],
        [p("Conteo automatizado", table_cell_bold), p("Seguimiento de unidades en patios, cámaras y líneas de producción.", table_cell)],
        [p("Trazabilidad total", table_cell_bold), p("Bitácora digital de detecciones, defectos y acciones autorizadas.", table_cell)],
        [p("Decisiones en tiempo real", table_cell_bold), p("Dashboard unificado para operaciones, calidad y dirección.", table_cell)],
    ]
    hl_table = Table(highlights, colWidths=[150, 373])
    hl_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, colors.HexColor("#EAE5DB")),
    ]))
    story.append(hl_table)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 3: THE OPPORTUNITY
    # =====================================================================
    story.append(p("La Oportunidad", h1))
    
    opp_text = [
        p("Las operaciones de Grupo Bafar mueven miles de unidades diarias entre plantas, "
          "cámaras de refrigeración, centros de distribución y puntos de venta. En ese volumen, "
          "la inspección manual no escala: es lenta, inconsistente y difícil de auditar.", body),
        p("<b>Puntos de dolor actuales:</b>", h2),
        p("• Defectos de empaque (tapas torcidas, subllenado) que llegan al cliente.", bullet),
        p("• Conteo manual de unidades en patios y líneas con errores y retrabajos.", bullet),
        p("• Falta de evidencia fotográfica y datos estructurados para auditorías.", bullet),
        p("• Decisiones de calidad dispersas en papeles, radios o hojas de cálculo.", bullet),
        p("• Poca visibilidad ejecutiva del estado de cada planta en tiempo real.", bullet),
    ]
    # Fetch quality control mockup image
    calidad_img = get_onboarding_image("onboarding_calidad", width=230, height=129.4)
    
    story.append(text_and_image_row(opp_text, calidad_img))
    story.append(Spacer(1, 24))

    story.append(make_callout(
        "<font color='#5C1810'><b>El costo real</b></font> no es solo el de personal de inspección: "
        "son los reclamos, las devoluciones, las retenciones de lote y la pérdida de confianza "
        "de clientes clave."
    ))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 4: SOLUTIONS OVERVIEW
    # =====================================================================
    story.append(p("Nuestra Solución: BAFAR OS", h1))
    story.append(p(
        "BAFAR OS combina hardware de borde (edge), modelos de visión entrenados para los productos "
        "de Bafar y una interfaz ejecutiva que traduce detecciones en acciones operativas.",
        body
    ))

    story.append(p("Módulos por división", h2))
    modules = [
        [p("División", table_header), p("Módulo", table_header), p("Resultado clave", table_header)],
        [p("Parma Produce", table_cell_bold), p("Conteo y trazabilidad", table_cell), p("Unidades contadas automáticamente en línea y patio.", table_cell)],
        [p("Sabori Bottling", table_cell_bold), p("Control de calidad", table_cell), p("Detección de tapas torcidas, subllenado y sellado defectuoso.", table_cell)],
        [p("Carnemart / Logística", table_cell_bold), p("Entrada/salida de vehículos", table_cell), p("Registro automático de gates, tiempos de permanencia y alertas.", table_cell)],
    ]
    story.append(build_table(modules, [120, 130, 273]))
    story.append(Spacer(1, 24))
    
    # Beautiful side-by-side card mockups showing two BAFAR divisions
    img_plantas = get_onboarding_image("onboarding_plantas", width=240, height=135)
    img_retail = get_onboarding_image("onboarding_retail", width=240, height=135)
    
    cards_table = Table([[img_plantas, img_retail]], colWidths=[255, 268])
    cards_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(cards_table)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 5: OPERATIONAL WORKFLOW
    # =====================================================================
    story.append(p("Flujo de Trabajo Operativo", h1))
    story.append(p(
        "El ciclo operativo de BAFAR OS actúa de manera ininterrumpida y se asienta sobre la validación cruzada: "
        "los sensores automatizan la detección, pero el personal calificado retiene la decisión final.",
        body
    ))
    
    flow = [
        [p("<b>1</b>", table_cell_bold), p("Captura", table_cell_bold), p("Cámaras IP/industriales envían video al edge device.", table_cell)],
        [p("<b>2</b>", table_cell_bold), p("Detección", table_cell_bold), p("YOLOv8 analiza cada frame y clasifica objetos/defectos.", table_cell)],
        [p("<b>3</b>", table_cell_bold), p("Decisión", table_cell_bold), p("El sistema crea alertas o acciones pendientes de autorización.", table_cell)],
        [p("<b>4</b>", table_cell_bold), p("Autorización", table_cell_bold), p("Un supervisor aprueba, rechaza o escala la acción.", table_cell)],
        [p("<b>5</b>", table_cell_bold), p("Registro", table_cell_bold), p("Todo queda en bitácora digital con imagen, timestamp y usuario.", table_cell)],
    ]
    flow_table = Table(flow, colWidths=[28, 105, 390])
    flow_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, colors.HexColor("#EAE5DB")),
    ]))
    story.append(flow_table)
    story.append(Spacer(1, 24))
    
    # Large centered YOLOv8 vision inspection camera feed mockup
    vision_img = get_onboarding_image("onboarding_vision", width=360, height=202.5)
    story.append(vision_img)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 6: SOFTWARE INCLUDED
    # =====================================================================
    story.append(p("Software Incluido", h1))
    story.append(p(
        "El software se entrega como una plataforma web propia de Bafar, alojada en la "
        "infraestructura acordada (nube híbrida, on-premise o edge). Cada módulo "
        "incluye licencia de uso perpetuo para Bafar en el modelo llave en mano, o licencia "
        "de uso durante la vigencia del contrato en el modelo por suscripción.",
        body
    ))

    sw_items = [
        ("Dashboard ejecutivo BAFAR OS", "Interfaz web responsiva en Next.js con vistas por planta, división y rol. Incluye homepage ejecutiva, vista de Visión IA y panel de acciones pendientes."),
        ("Motor de visión YOLOv8", "Pipeline de inferencia en Python con detección de objetos, conteo, clasificación de defectos y seguimiento de vehículos. Optimizado para inferencia local en edge."),
        ("API REST en tiempo real", "Endpoints para estado en vivo (/api/state), control remoto (/api/control), video MJPEG (/video_feed) y sincronización con base de datos."),
        ("Módulo de acciones pendientes", "Creación, asignación, autorización y cierre de acciones correctivas. Incluye flujo de aprobación con firma digital de usuario y comentarios."),
        ("Bitácora de detección", "Registro inmutable de cada detección con imagen, timestamp, ubicación, operador y resultado. Exportable a Excel/PDF."),
        ("Panel de KPIs y reportes", "Métricas de producción, calidad, tiempos de ciclo, defectos por turno y tendencias. Reportes programados y bajo demanda."),
        ("Autenticación y roles", "Login con control de acceso basado en roles: operador, supervisor de calidad, gerente de planta y administrador corporativo."),
        ("Integración con sistemas Bafar", "Conectores para ERP/SAP/WMS vía APIs REST, archivos planos o base de datos. Sincronización de lotes, órdenes y catálogos."),
        ("Appwrite / backend de datos", "Base de datos, almacenamiento de imágenes y gestión de usuarios. Puede permanecer en Appwrite Cloud o migrarse localmente."),
        ("Alertas y notificaciones", "Notificaciones en pantalla, por correo o webhook ante defectos críticos o métricas fuera de rango."),
    ]
    story.append(two_col_table(sw_items, col1_width=175, col2_width=348))
    story.append(Spacer(1, 14))

    story.append(make_callout(
        "<font color='#5C1810'><b>Licenciamiento:</b></font> el software es desarrollado a la medida "
        "de Bafar. No hay costos ocultos por usuario adicional ni por volumen de transacciones."
    ))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 7: HARDWARE INCLUDED
    # =====================================================================
    story.append(p("Hardware Incluido por Punto de Inspección", h1))
    story.append(p(
        "Cada 'punto de inspección' es una estación completa lista para operar en ambiente "
        "industrial. El hardware se entrega instalado, configurado y calibrado. A continuación "
        "el detalle de lo incluido por punto:",
        body
    ))

    hw_items = [
        ("Cámara industrial", "Cámara IP de resolución mínima 2 MP, global shutter o rolling shutter según velocidad de línea, lente fijo o varifocal acorde al campo de visión requerido."),
        ("Edge computer", "Mini PC industrial con CPU i5/i7 o equivalente, 16 GB RAM, SSD 512 GB, GPU/TPU opcional para aceleración de inferencia. SO Linux o Windows IoT."),
        ("Iluminación controlada", "Barras o anillos de LEDs con difusor, alimentación estabilizada y controlador de intensidad para condiciones variables de planta."),
        ("Soporte mecánico", "Columna, brazo articulado o gabinete de montaje según punto. Material acero inoxidable o aluminio anodizado donde aplique normativa alimentaria."),
        ("Cableado estructurado", "Cable de red Cat 6A industrial, canalización, conectores blindados, etiquetado y organización de rack/patch panel por punto."),
        ("Protección eléctrica", "UPS de respaldo para edge y cámara (mínimo 15 minutos), supresor de picos y puesta a tierra verificada."),
        ("Redundancia de red (opcional)", "Router 4G/5G de respaldo con SIM activada para continuidad en falla de fibra principal."),
        ("Estación de calibración", "Por planta: patrón de referencia fotográfico, regla de calibración y kit de productos de referencia para validación periódica del modelo."),
    ]
    story.append(two_col_table(hw_items, col1_width=175, col2_width=348))
    
    story.append(Spacer(1, 16))
    story.append(p("Cantidad estimada por escenario", h2))
    qty_data = [
        [p("Escenario", table_header), p("Puntos típicos", table_header), p("Observaciones", table_header)],
        [p("Línea de empaque / control de calidad (Sabori)", table_cell_bold), p("1–2 puntos por línea", table_cell), p("Cámara sobre transportador, iluminación cenital.", table_cell)],
        [p("Conteo de unidades / patio (Parma)", table_cell_bold), p("1–2 puntos por área", table_cell), p("Cámara con vista cenital o lateral de flujo.", table_cell)],
        [p("Entrada/salida de vehículos (Carnemart)", table_cell_bold), p("2 puntos por gate", table_cell), p("Cámaras LPR/ángulo para placas y cabina.", table_cell)],
        [p("Sala de calibración por planta", table_cell_bold), p("1 estación", table_cell), p("Kit de referencia para validación mensual del modelo.", table_cell)],
    ]
    qty_table = build_table(qty_data, [195, 95, 233])
    story.append(qty_table)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 8: IMPLEMENTATION PHASES - PILOT
    # =====================================================================
    story.append(p("Fases de Implementación: Piloto", h1))
    
    phase_txt = [
        p("La implementación se divide en tres niveles de alcance para reducir riesgo y "
          "demostrar valor cuantitativo antes de escalar a toda la operación corporativa.", body),
        p("<b>Fase 1: Piloto de Validación</b>", h2),
        p("El piloto busca mitigar riesgos de hardware y luz en una sola línea de producción, "
          "obteniendo la precisión básica de detección calibrada antes de replicar el modelo.", body),
    ]
    # Show inventories/FEFO tracking mockup here
    inv_img = get_onboarding_image("onboarding_inventario", width=230, height=129.4)
    story.append(text_and_image_row(phase_txt, inv_img))
    story.append(Spacer(1, 16))

    pilot_items = [
        ("Levantamiento operativo", "Visita a planta, selección del punto de inspección, definición de defectos aceptables/rechazables y KPIs de éxito."),
        ("Software pilot", "Dashboard configurado para 1 división, 1 escenario y hasta 2 usuarios operadores + 1 supervisor."),
        ("Hardware pilot", "1 cámara industrial, 1 edge computer, iluminación, soporte mecánico, cableado y UPS."),
        ("Entrenamiento del modelo", "Calibración con mínimo 500–1,000 imágenes reales de producto Bafar; objetivo ≥ 95% de precisión."),
        ("Pruebas de aceptación", "Pruebas FAT/SAT, validación de exactitud, prueba de estrés de 8 horas y ajustes finales."),
        ("Soporte hipercare", "Soporte presencial/remoto durante 4 semanas post go-live."),
        ("Documentación", "Manual de operación, manual de mantenimiento y reporte de calibración del modelo."),
    ]
    story.append(two_col_table(pilot_items, col1_width=175, col2_width=348))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 9: CORPORATE ROLLOUT & CONTINUOUS OPERATIONS
    # =====================================================================
    story.append(p("Rollout y Operación Continua", h1))
    
    story.append(p("2. Rollout corporativo", h2))
    rollout_items = [
        ("Replicación del pilot", "Despliegue del software y hardware en plantas/división restantes según plan aprobado."),
        ("Personalización por división", "Configuración de reglas de defectos, umbrales, productos, turnos y reportes específicos por planta."),
        ("Integración corporativa", "Conexión con ERP/SAP/WMS de Bafar, sincronización de catálogos y flujo de lotes."),
        ("Capacitación masiva", "Entrenamiento presencial para operadores, supervisores de QA, mantenimiento y gerentes de planta."),
        ("Administración central", "Panel corporativo con visibilidad de todas las plantas, roles regionales y auditoría centralizada."),
        ("Soporte extendido", "Soporte remoto prioritario durante 3 meses adicionales post rollout."),
    ]
    story.append(two_col_table(rollout_items, col1_width=175, col2_width=348))
    
    story.append(Spacer(1, 14))
    story.append(p("3. Operación continua", h2))
    ongoing_items = [
        ("Soporte y mantenimiento", "Atención a incidentes, actualizaciones de seguridad y parches del sistema."),
        ("Mejoras de modelo", "Reentrenamiento periódico con nuevos productos, condiciones de iluminación o variaciones de empaque."),
        ("Nuevos escenarios", "Desarrollo de nuevos puntos de inspección o divisiones adicionales bajo orden de cambio."),
        ("Reportes avanzados", "Nuevos dashboards, alertas predictivas y análisis de tendencias."),
    ]
    story.append(two_col_table(ongoing_items, col1_width=175, col2_width=348))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 10: METHODOLOGY
    # =====================================================================
    story.append(p("Implementación y Cambio Organizacional", h1))
    story.append(p(
        "La propuesta es llave en mano: nos encargamos del software, el hardware, la "
        "instalación y la puesta en marcha. Bafar facilita acceso a plantas, muestras de "
        "producto y puntos de contacto por división.",
        body
    ))

    story.append(p("Metodología de implementación", h2))
    impl_items = [
        ("Levantamiento operativo por planta", "Mapeo de líneas, flujos, puntos de inspección actuales y definición de KPIs medibles."),
        ("Diseño de solución", "Arquitectura de red, ubicación de cámaras, especificación de hardware y plan de cableado."),
        ("Entrenamiento de modelos", "Captura de datos en planta, etiquetado, entrenamiento YOLOv8 y validación con QA de Bafar."),
        ("Instalación y puesta en marcha", "Montaje mecánico, cableado, configuración de red, instalación de software y calibración."),
        ("Pruebas de aceptación", "Validación de exactitud (objetivo ≥ 95%), pruebas de estrés, pruebas de falla y documentación."),
        ("Capacitación", "Talleres prácticos para operadores, supervisores, mantenimiento y dirección. Manuales y videos cortos."),
        ("Go-live y hipercare", "Acompañamiento durante las primeras semanas de producción para ajustes y resolución de incidentes."),
    ]
    story.append(two_col_table(impl_items, col1_width=175, col2_width=348))
    story.append(Spacer(1, 16))

    story.append(make_callout(
        "<font color='#5C1810'><b>Éxito garantizado:</b></font> cada fase tiene criterios de "
        "aceptación claros. No se avanza al siguiente nivel de alcance hasta que el anterior "
        "cumpla los KPIs de precisión definidos."
    ))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 11: INVESTMENT - HARDWARE & SOFTWARE
    # =====================================================================
    story.append(p("Inversión: Software & Hardware", h1))
    story.append(p(
        "Los montos siguientes son estimados en dólares estadounidenses y dependen de la "
        "cantidad final de puntos de inspección, plantas y profundidad de integración. "
        "Se ajustarán tras el levantamiento técnico.",
        body
    ))

    story.append(p("A. Software y desarrollo", h2))
    sw_data = [
        [p("Concepto", table_header), p("Rango estimado (USD)", table_header), p("Qué incluye", table_header)],
        [p("Desarrollo del core BAFAR OS", table_cell_bold), p("$80,000 – $120,000", table_cell), p("Dashboard, API, motor CV, autenticación, reportes y backend.", table_cell)],
        [p("Módulo adicional por división", table_cell_bold), p("$20,000 – $40,000 c/u", table_cell), p("Personalización de reglas, productos, reportes y flujos por división.", table_cell)],
        [p("Integración ERP/SAP/WMS", table_cell_bold), p("$15,000 – $35,000", table_cell), p("Conectores, sincronización de datos, pruebas de integración.", table_cell)],
        [p("Reportes, roles y administración", table_cell_bold), p("$15,000 – $25,000", table_cell), p("Panel corporativo, roles por planta, reportes avanzados.", table_cell)],
    ]
    story.append(build_table(sw_data, [155, 120, 248]))
    
    story.append(Spacer(1, 16))
    story.append(p("B. Hardware e instalación por punto", h2))
    hw_data = [
        [p("Concepto", table_header), p("Rango estimado (USD)", table_header), p("Qué incluye", table_header)],
        [p("Kit por punto de inspección", table_cell_bold), p("$3,000 – $8,000", table_cell), p("Cámara, edge, iluminación, soporte mecánico y cableado.", table_cell)],
        [p("Instalación y configuración", table_cell_bold), p("$2,000 – $5,000", table_cell), p("Montaje, cableado, configuración de red, puesta a tierra.", table_cell)],
        [p("Estación de calibración por planta", table_cell_bold), p("$5,000 – $12,000", table_cell), p("Patrones de referencia, kit de productos, documentación.", table_cell)],
        [p("Respaldo energético y red (opcional)", table_cell_bold), p("$4,000 – $10,000 por planta", table_cell), p("UPS extendido, router 4G/5G de respaldo.", table_cell)],
    ]
    story.append(build_table(hw_data, [155, 120, 248]))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 12: INVESTMENT - SERVICES & TOTAL
    # =====================================================================
    story.append(p("Servicios y Resumen de Inversión", h1))
    
    story.append(p("C. Implementación y servicios", h2))
    imp_data = [
        [p("Concepto", table_header), p("Rango estimado (USD)", table_header), p("Qué incluye", table_header)],
        [p("Levantamiento operativo por planta", table_cell_bold), p("$8,000 – $15,000", table_cell), p("Visita, mapeo de procesos, definición de KPIs y arquitectura.", table_cell)],
        [p("Entrenamiento/calibración por escenario", table_cell_bold), p("$10,000 – $20,000", table_cell), p("Captura de datos, etiquetado, entrenamiento YOLOv8, validación.", table_cell)],
        [p("Capacitación por planta", table_cell_bold), p("$5,000 – $10,000", table_cell), p("Talleres, manuales, videos y certificación de usuarios clave.", table_cell)],
        [p("Soporte hipercare (4 semanas)", table_cell_bold), p("$10,000 – $20,000", table_cell), p("Soporte remoto/presencial post go-live, ajustes y reporte final.", table_cell)],
    ]
    story.append(build_table(imp_data, [155, 120, 248]))
    story.append(Spacer(1, 24))

    # Styled total banner
    tot_text = (
        "<font size=11 color='#5C1810'><b>Inversión Total Estimada (3 divisiones con 4 puntos de inspección cada una):</b></font><br/>"
        "<font size=16 color='#1A1C1F'><b>$250,000 – $450,000 USD</b></font>"
    )
    t_banner = Table([[p(tot_text, callout_text)]], colWidths=[523])
    t_banner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FDFBF7")),
        ("BOX", (0, 0), (-1, -1), 1.0, BORDER_COLOR),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
    ]))
    t_banner.hAlign = 'CENTER'
    story.append(t_banner)
    story.append(Spacer(1, 24))
    
    # Financial hedging commodities / app stats visual
    comp_img = get_onboarding_image("onboarding_compras", width=320, height=180)
    story.append(comp_img)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 13: COMMERCIAL MODELS
    # =====================================================================
    story.append(p("Modelos Comerciales", h1))
    story.append(p(
        "Ofrecemos tres formas de estructurar la relación comercial. La recomendada para Bafar es la "
        "híbrida: reduce el riesgo inicial de inversión y alinea a ambas partes hacia resultados de OEE.",
        body
    ))

    models = [
        [p("Modelo", table_header), p("Estructura", table_header), p("Ideal si…", table_header)],
        [p("Llave en mano", table_cell_bold), p("Pago por hitos. Propiedad total del sistema para Bafar.", table_cell), p("Capex definido y equipo interno de TI.", table_cell)],
        [p("Setup + Suscripción", table_cell_bold), p("Setup fee menor + anualidad por soporte, mejoras y nube.", table_cell), p("Se prefiere opex predecible y evolución continua.", table_cell)],
        [p("Híbrido recomendado", table_cell_bold), p("Setup que cubre desarrollo + hardware; anualidad por soporte y mejoras.", table_cell), p("Quieren arrancar rápido sin sacrificar evolución.", table_cell)],
    ]
    story.append(build_table(models, [100, 225, 198]))

    story.append(Spacer(1, 16))
    story.append(p("Propuesta híbrida sugerida", h2))
    hybrid = [
        [p("Concepto", table_header), p("Monto estimado (USD)", table_header), p("Alcance incluido", table_header)],
        [p("Pilot en 1 línea", table_cell_bold), p("$35,000 – $55,000", table_cell), p("1 división, 1 punto, software, hardware, calibración y 3 meses soporte.", table_cell)],
        [p("Rollout a 3 plantas", table_cell_bold), p("$180,000 – $280,000", table_cell), p("Software, hardware, instalación, integración y capacitación.", table_cell)],
        [p("Soporte anual", table_cell_bold), p("$45,000 – $75,000 / año", table_cell), p("Soporte, mejoras de modelo, nuevos reportes y actualizaciones.", table_cell)],
    ]
    story.append(build_table(hybrid, [120, 130, 273]))
    story.append(Spacer(1, 20))
    
    # Onboarding transportation visual
    trans_img = get_onboarding_image("onboarding_transporte", width=320, height=180)
    story.append(trans_img)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 14: ROADMAP
    # =====================================================================
    story.append(p("Hoja de Ruta", h1))
    story.append(p(
        "La implementación se divide en fases para validar valor operativo de forma secuencial. "
        "Cada fase cuenta con entregables específicos y un gate de aprobación de calidad.",
        body
    ))

    roadmap = [
        [p("Fase", table_header), p("Duración", table_header), p("Entregable", table_header)],
        [p("1. Descubrimiento", table_cell_bold), p("2 semanas", table_cell), p("Levantamiento de 3 plantas, KPIs definidos y arquitectura aprobada.", table_cell)],
        [p("2. Pilot", table_cell_bold), p("6–8 semanas", table_cell), p("1 punto de inspección en 1 división funcionando en producción real.", table_cell)],
        [p("3. Entrenamiento", table_cell_bold), p("4–6 semanas", table_cell), p("Modelos calibrados con productos Bafar y ≥ 95% de precisión.", table_cell)],
        [p("4. Rollout", table_cell_bold), p("10–14 semanas", table_cell), p("Instalación y puesta en marcha en plantas restantes.", table_cell)],
        [p("5. Optimización", table_cell_bold), p("Continua", table_cell), p("Mejoras de modelo, nuevos escenarios y reportes avanzados.", table_cell)],
    ]
    story.append(build_table(roadmap, [110, 90, 323]))
    story.append(Spacer(1, 24))
    
    # Main dashboard center overview mockup
    main_img = get_onboarding_image("onboarding_resumen", width=320, height=180)
    story.append(main_img)
    story.append(PageBreak())

    # =====================================================================
    # PAGE 15: ROI
    # =====================================================================
    story.append(p("Por Qué Se Paga Solo (ROI)", h1))
    story.append(p(
        "El sistema no es un costo de TI o un gasto de infraestructura pasiva: representa una "
        "reducción directa e inmediata de pérdida operativa. Los retornos de inversión se basan en cuatro palancas:",
        body
    ))

    roi_data = [
        [p("Palanca", table_header), p("Impacto estimado", table_header)],
        [p("Reducción de reclamos y devoluciones", table_cell_bold), p("–15% a –30% en defectos no detectados.", table_cell)],
        [p("Menos retrabajo y detención de lotes", table_cell_bold), p("Detección en < 1 s vs. inspección manual periódica.", table_cell)],
        [p("Optimización de personal de inspección", table_cell_bold), p("Reasignación de 1–3 operarios por turno a tareas de mayor valor.", table_cell)],
        [p("Trazabilidad y auditoría", table_cell_bold), p("Reducción de tiempo de preparación de auditorías de días a minutos.", table_cell)],
        [p("Datos para dirección", table_cell_bold), p("Decisiones basadas en evidencia real, no en estimaciones visuales.", table_cell)],
    ]
    story.append(build_table(roi_data, [170, 353]))

    story.append(Spacer(1, 20))
    story.append(make_callout(
        "<font color='#5C1810'><b>Escenario conservador:</b></font> si Bafar evita solo un puñado "
        "de reclamos graves al mes y optimiza la inspección en un turno por planta, el retorno de "
        "inversión se alcanza en el primer año de operación."
    ))
    story.append(PageBreak())

    # =====================================================================
    # PAGE 16: ASSUMPTIONS & EXCLUSIONS
    # =====================================================================
    story.append(p("Supuestos y Alcance No Incluido", h1))
    story.append(p(
        "Para evitar malentendidos, estos son los supuestos bajo los cuales se preparó la "
        "cotización y los elementos que quedan fuera del alcance inicial.",
        body
    ))

    story.append(p("Supuestos", h2))
    assumptions = [
        "Bafar facilita acceso a plantas durante horario laboral para levantamiento, instalación y capacitación.",
        "Bafar proporciona muestras de producto, imágenes históricas de defectos y acceso a catálogos de ERP/SAP/WMS.",
        "La infraestructura de red existente (switches, patch panels, internet) está operativa en las ubicaciones de instalación.",
        "El personal asignado por Bafar para pruebas de aceptación estará disponible en las fechas acordadas.",
        "Los cambios de alcance posteriores a la aprobación se gestionarán mediante órdenes de cambio formales.",
    ]
    for a in assumptions:
        story.append(p(f"• {a}", bullet))

    story.append(Spacer(1, 12))
    story.append(p("No incluido (salvo acuerdo expreso)", h2))
    exclusions = [
        "Obras civiles mayores, remodelación de naves o construcción de infraestructura nueva.",
        "Adquisición de servidores corporativos dedicados (se puede cotizar por separado si se requiere local).",
        "Licencias de terceros no mencionadas explícitamente (ej. licencias ERP SAP, software adicional).",
        "Capacitación fuera de las plantas de Bafar o traslados internacionales del equipo de desarrollo.",
        "Soporte 24/7 permanente; el soporte estándar es en horario laboral con escalación a incidentes críticos.",
    ]
    for e in exclusions:
        story.append(p(f"• {e}", bullet))

    story.append(PageBreak())

    # =====================================================================
    # PAGE 17: NEXT STEPS
    # =====================================================================
    story.append(p("Siguientes Pasos", h1))
    story.append(p(
        "Para convertir esta propuesta comercial en un plan de trabajo ejecutivo conjunto, proponemos:",
        body
    ))

    steps = [
        "Reunión de validación técnica con los equipos de operaciones, calidad y TI de Grupo Bafar.",
        "Visita técnica a 1–2 plantas pre-seleccionadas para confirmar puntos de inspección viables.",
        "Definición exacta del alcance del pilot: división, línea, KPIs de éxito y duración del mismo.",
        "Ajuste final de la cotización de inversión y firma de la orden de inicio para el pilot.",
        "Reunión kick-off del proyecto y asignación formal de los equipos de trabajo de ambas partes.",
    ]
    for i, step in enumerate(steps, 1):
        story.append(p(f"<font color='#5C1810'><b>{i}.</b></font> {step}", bullet))

    story.append(Spacer(1, 80))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=20))
    story.append(p("<font color='#5C1810' size=12><b>BAFAR OS</b></font> · Del corral al anaquel, en tiempo real.",
                   make_style("closing", "Helvetica", 11, MUTED_TEXT, align=TA_CENTER)))
    story.append(p("Esta propuesta es confidencial y está preparada exclusivamente para Grupo Bafar.",
                   make_style("confidential", "Helvetica", 9, MUTED_TEXT, align=TA_CENTER, space_before=6)))

    doc.build(story)
    print(f"PDF generado exitosamente en: {OUT_PATH}")


if __name__ == "__main__":
    build_document()
