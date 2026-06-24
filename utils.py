import streamlit as st

def apply_custom_css(is_dark=True):
    # CSS variables swapping based on theme
    if is_dark:
        bg = "#09090b"
        bg_subtle = "#0c0c0f"
        card = "#0c0c0f"
        card_hover = "#131316"
        border = "#1e1e24"
        border_subtle = "#16161a"
        text = "#fafafa"
        shadow = "none"
    else:
        bg = "#ffffff"
        bg_subtle = "#f9fafb"
        card = "#ffffff"
        card_hover = "#f4f4f5"
        border = "#e4e4e7"
        border_subtle = "#f0f0f2"
        text = "#09090b"
        shadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)"

    css = f"""
    <style>
    :root {{
        --bg: {bg};
        --bg-subtle: {bg_subtle};
        --card: {card};
        --card-hover: {card_hover};
        --border: {border};
        --border-subtle: {border_subtle};
        --text: {text};
        --text-muted: #71717a;
        --text-dim: #52525b;
        --accent: #2563eb;
        --accent-muted: #1d4ed8;
        --green: #22c55e;
        --green-muted: rgba(34,197,94,0.12);
        --red: #ef4444;
        --red-muted: rgba(239,68,68,0.12);
        --amber: #f59e0b;
        --amber-muted: rgba(245,158,11,0.12);
        --shadow: {shadow};
        --radius: 10px;
    }}

    /* Hide Streamlit chrome */
    header[data-testid="stHeader"], #MainMenu, footer, [data-testid="stToolbar"],
    [data-testid="stDecoration"], [data-testid="stStatusWidget"], .stDeployButton,
    div[data-testid="stSidebarCollapsedControl"] {{
        display: none !important;
    }}

    /* Global App Styling */
    html, body, [data-testid="stAppViewContainer"], [data-testid="stApp"], .main, .block-container, section[data-testid="stMain"] {{
        background-color: var(--bg) !important;
        color: var(--text) !important;
        font-family: 'DM Sans', -apple-system, sans-serif !important;
    }}
    .block-container {{
        padding: 1.5rem 2rem 2rem !important;
        max-width: 1360px !important;
    }}

    /* Sidebar background */
    section[data-testid="stSidebar"] {{
        background-color: var(--bg-subtle) !important;
        border-right: 1px solid var(--border) !important;
    }}

    /* Tabs styling (pill-style) */
    button[data-baseweb="tab"] {{
        background: transparent !important;
        color: var(--text-muted) !important;
        font-size: 0.85rem !important;
        font-weight: 500 !important;
        padding: 0.6rem 1.2rem !important;
        border: 1px solid transparent !important;
        border-radius: 7px !important;
        transition: all 0.2s ease !important;
    }}
    button[data-baseweb="tab"][aria-selected="true"] {{
        color: var(--text) !important;
        background: var(--card) !important;
        border-color: var(--border) !important;
        box-shadow: var(--shadow) !important;
    }}
    [data-baseweb="tab-highlight"], [data-baseweb="tab-border"] {{
        display: none !important;
    }}
    [data-baseweb="tab-list"] {{
        gap: 6px !important;
        background: var(--bg-subtle) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        padding: 4px !important;
        margin-bottom: 1.25rem !important;
    }}

    /* Metric card */
    .metric-card {{
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.1rem 1.25rem;
        box-shadow: var(--shadow);
        transition: border-color 0.2s ease, background-color 0.2s ease;
    }}
    .metric-card:hover {{
        border-color: var(--text-dim);
        background-color: var(--card-hover);
    }}
    .metric-label {{
        font-size: 0.76rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }}
    .metric-value {{
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text);
        letter-spacing: -0.03em;
        margin-top: 0.2rem;
    }}
    .metric-delta {{
        font-size: 0.72rem;
        font-weight: 500;
        margin-top: 0.4rem;
        padding: 2px 8px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
    }}
    .delta-up {{
        color: var(--green);
        background: var(--green-muted);
    }}
    .delta-down {{
        color: var(--red);
        background: var(--red-muted);
    }}
    .delta-warn {{
        color: var(--amber);
        background: var(--amber-muted);
    }}

    /* Chart wrap */
    .chart-wrap {{
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.1rem;
        box-shadow: var(--shadow);
        margin-top: 1rem;
    }}
    .chart-title {{
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text);
    }}
    .chart-subtitle {{
        font-size: 0.74rem;
        color: var(--text-muted);
        margin-bottom: 0.8rem;
    }}

    /* Event log */
    .log-container {{
        background: #09090b !important;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 0.8rem 1rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.76rem;
        height: 200px;
        overflow-y: auto;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }}
    .log-line {{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 6px;
        margin-bottom: 5px;
        border-radius: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.02);
    }}
    .log-timestamp {{
        color: #71717a;
        font-size: 0.72rem;
        min-width: 65px;
    }}
    .log-badge {{
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        min-width: 60px;
        text-align: center;
    }}
    .badge-alert {{
        color: #f43f5e;
        background: rgba(244, 63, 94, 0.1);
        border: 1px solid rgba(244, 63, 94, 0.2);
    }}
    .badge-success {{
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
    }}
    .badge-info {{
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
    }}
    .log-text {{
        color: #e4e4e7;
        line-height: 1.4;
    }}

    /* Horizontal layout gap */
    [data-testid="stHorizontalBlock"] {{
        gap: 1.25rem !important;
    }}

    /* Brand Header style */
    .brand-wrap {{
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.8rem;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }}
    .brand-title {{
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text);
        letter-spacing: -0.02em;
    }}
    .brand-subtitle {{
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-top: 0.1rem;
    }}
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

def metric_card(label, value, delta=None, delta_type="up"):
    cls = f"delta-{delta_type}"
    arrow = "↑" if delta_type == "up" else ("↓" if delta_type == "down" else "→")
    delta_html = f'<div class="metric-delta {cls}">{arrow} {delta}</div>' if delta else ""
    card_html = f"""
    <div class="metric-card">
        <div class="metric-label">{label}</div>
        <div class="metric-value">{value}</div>
        {delta_html}
    </div>
    """
    st.markdown(card_html, unsafe_allow_html=True)

def render_log_viewer(events):
    lines_html = ""
    # Display in reverse chronological order (latest first)
    for ev in reversed(events[-40:]):
        # Parse timestamp and message if formatted as "[HH:MM:SS] message"
        if ev.startswith("[") and "] " in ev:
            parts = ev.split("] ", 1)
            t_str = parts[0][1:]
            msg = parts[1]
        else:
            t_str = "LIVE"
            msg = ev
            
        # Determine badge type
        if "ALERT" in msg:
            badge_class = "badge-alert"
            badge_text = "ALERT"
        elif "Passed" in msg or "IN" in msg or "Entered" in msg or "QC: PASS" in msg:
            badge_class = "badge-success"
            badge_text = "PASS" if "Passed" in msg or "QC: PASS" in msg else "IN"
        elif "Exited" in msg or "OUT" in msg:
            badge_class = "badge-success"
            badge_text = "OUT"
        else:
            badge_class = "badge-info"
            badge_text = "INFO"
            
        # Build the HTML line without leading whitespace to prevent Markdown block conversion
        lines_html += f'<div class="log-line">' \
                     f'<span class="log-timestamp">[{t_str}]</span>' \
                     f'<span class="log-badge {badge_class}">{badge_text}</span>' \
                     f'<span class="log-text">{msg}</span>' \
                     f'</div>'
                     
    if not lines_html:
        log_html = '<div class="log-container"><div style="color: #71717a; font-family: monospace;">Awaiting conveyor startup... Logs will appear here in real-time.</div></div>'
    else:
        log_html = f'<div class="log-container">{lines_html}</div>'
        
    st.markdown(log_html, unsafe_allow_html=True)
