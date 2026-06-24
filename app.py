import streamlit as st
import time
import pandas as pd
import plotly.express as px
from datetime import datetime

# Import local CV processors, styles, and MJPEG server
import mjpeg_server
import utils

# Set page config first as required
st.set_page_config(
    page_title="Grupo Bafar - AI Vision Hub",
    page_icon="👁️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Start background MJPEG HTTP and CV processing server
mjpeg_server.start_mjpeg_server()

# Hide Streamlit loading indicator / running man in the corner and skeleton blink using CSS
st.markdown("""
<style>
    div[data-testid="stStatusWidget"] {
        visibility: hidden;
        height: 0%;
        position: fixed;
    }
    /* Hide skeleton elements completely during execution updates */
    div[data-testid="stSkeleton"] {
        display: none !important;
    }
</style>
""", unsafe_allow_html=True)

# 1. Theme Configuration
if "theme" not in st.session_state:
    st.session_state.theme = "dark"

def toggle_theme():
    st.session_state.theme = "light" if st.session_state.theme == "dark" else "dark"

IS_DARK = st.session_state.theme == "dark"
utils.apply_custom_css(IS_DARK)

# 2. State Initialization
if "prev_scenario" not in st.session_state:
    st.session_state.prev_scenario = ""

if "history_data" not in st.session_state:
    st.session_state.history_data = []

# Helper to sync reset
def trigger_reset():
    mjpeg_server.reset_all_counters()
    st.session_state.history_data = []
    st.toast("Counters reset successfully!", icon="🔄")

# 3. Sidebar Layout
with st.sidebar:
    st.markdown(f"""
    <div style='text-align: center; padding: 10px 0 20px 0; border-bottom: 1px solid var(--border); margin-bottom: 20px;'>
        <h2 style='margin: 0; color: var(--text); font-weight: 800; font-size: 1.3rem; letter-spacing: -0.03em;'>GRUPO BAFAR</h2>
        <span style='color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;'>AI Vision Hub</span>
    </div>
    """, unsafe_allow_html=True)
    
    # Theme toggle button
    theme_btn_label = "☀️ Switch to Light Mode" if IS_DARK else "🌙 Switch to Dark Mode"
    st.button(theme_btn_label, on_click=toggle_theme, use_container_width=True)
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Scenario Picker
    st.markdown("<h3 style='margin:0; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;'>Select Operation Line</h3>", unsafe_allow_html=True)
    scenario = st.selectbox(
        label="Select Operation Line",
        options=[
            "🍊 Parma Fruit & Produce Counting",
            "🧪 Sabori Beverage Bottling QC",
            "🚛 Carnemart Logistics Yard"
        ],
        label_visibility="collapsed"
    )
    
    # Map selection to MJPEG scenario names
    scenario_mapping = {
        "🍊 Parma Fruit & Produce Counting": "Parma Produce",
        "🧪 Sabori Beverage Bottling QC": "Sabori Bottling",
        "🚛 Carnemart Logistics Yard": "Logistics"
    }
    mjpeg_scenario = scenario_mapping[scenario]
    
    # Sync scenario switch to background processing
    if mjpeg_scenario != st.session_state.prev_scenario:
        mjpeg_server.reset_all_counters()
        st.session_state.history_data = []
        mjpeg_server.state["scenario"] = mjpeg_scenario
        st.session_state.prev_scenario = mjpeg_scenario
        
    st.markdown("<br><h3 style='margin:0; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;'>Playback Controls</h3>", unsafe_allow_html=True)
    
    # Play / Pause buttons directly update background process state
    col_play, col_pause = st.columns(2)
    with col_play:
        if st.button("▶ Play", use_container_width=True):
            mjpeg_server.state["playing"] = True
    with col_pause:
        if st.button("⏸ Pause", use_container_width=True):
            mjpeg_server.state["playing"] = False
            
    # Reset Button
    st.button("🔄 Reset All Counters", on_click=trigger_reset, use_container_width=True)
    st.markdown("<br>", unsafe_allow_html=True)
        
    # We display a visual indicator of state since we aren't rerunning parent script
    is_playing_status = mjpeg_server.state["playing"]
    status_label = "RUNNING" if is_playing_status else "PAUSED"
    status_color = "#22c55e" if is_playing_status else "#ef4444"
    st.markdown(f"""
    <div style='display: flex; align-items: center; gap: 8px; margin-bottom: 20px;'>
        <span style='width: 9px; height: 9px; background: {status_color}; border-radius: 50%; display: inline-block;'></span>
        <span style='font-size: 0.8rem; color: {status_color}; font-weight: 700;'>Processor State: {status_label}</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<h3 style='margin:0; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;'>Detection Parameters</h3>", unsafe_allow_html=True)
    
    # Sidebar parameter inputs immediately write to background server state dictionary
    if "Parma Fruit" in scenario:
        line_x = st.slider("Counting Gate Line (X-pos)", 100, 860, 480)
        conf_thresh = st.slider("Produce Detection Conf", 0.3, 0.9, 0.5)
        show_obb = st.toggle("Show Bounding Box", True)
        
        mjpeg_server.state["line_x"] = line_x
        mjpeg_server.state["conf_thresh"] = conf_thresh
        mjpeg_server.state["show_obb"] = show_obb
    elif "Sabori Beverage" in scenario:
        defect_threshold = st.slider("Max Cap Angle Deviation (Deg)", 3.0, 30.0, 10.0)
        show_labels = st.toggle("Show Cap Alignment Marker", True)
        
        mjpeg_server.state["defect_threshold"] = defect_threshold
        mjpeg_server.state["show_labels"] = show_labels
    else:
        line_y = st.slider("Logistics Gate Line (Y-pos)", 50, 380, 200)
        conf_thresh = st.slider("YOLOv8 Conf Threshold", 0.1, 0.9, 0.35)
        
        mjpeg_server.state["line_y"] = line_y
        mjpeg_server.state["conf_thresh"] = conf_thresh

    st.markdown("""
    <div style='margin-top: 30px; padding: 15px; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 8px;'>
        <span style='font-size: 0.72rem; color: var(--text-muted); font-weight: 500;'>CONNECTED EDGE NODE</span><br/>
        <span style='font-size: 0.8rem; font-family: monospace; color: var(--text); font-weight: 600;'>node-chihuahua-mx-03</span><br/>
        <div style='display: flex; align-items: center; gap: 6px; margin-top: 5px;'>
            <span style='width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block;'></span>
            <span style='font-size: 0.7rem; color: #22c55e; font-weight: 600;'>SAP Core Connected</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

# 4. Main Body Layout
# Custom Title Header
st.markdown(f"""
<div class="brand-wrap">
    <div>
        <div class="brand-title">Grupo Bafar AI Vision Hub</div>
        <div class="brand-subtitle">Real-time object tracking, counting, and quality control on edge processing lines</div>
    </div>
    <div style="font-size: 0.76rem; color: var(--text-muted); font-family: monospace;">
        DATE: {datetime.now().strftime('%Y-%m-%d')} | IP: 192.168.12.86
    </div>
</div>
""", unsafe_allow_html=True)

# Tabs
tab_live, tab_analytics, tab_config = st.tabs([
    "🖥️ Live Operations Stream", 
    "📊 Performance Analytics", 
    "⚙️ System Configuration"
])

# ----------------- Tab 1: Live Stream Content (NO RERUNS) -----------------
with tab_live:
    col_stream, col_metrics = st.columns([7, 3])
    
    with col_stream:
        st.markdown(f"""
        <div style='margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;'>
            <span style='font-size: 0.8rem; font-weight: 600; color: var(--text);'>{scenario.upper()} - LIVE STREAM</span>
            <span class="badge badge-blue">1280x720 @ Full FPS</span>
        </div>
        """, unsafe_allow_html=True)
        
        # Display Video Feed via standard HTML image connected to MJPEG port 8502
        # This streams directly inside browser, completely independent of Streamlit execution thread.
        # This guarantees 0% flickering and 100% video frame rate!
        st.markdown(
            '<img src="http://127.0.0.1:8502/video_feed" style="width:100%; border-radius:10px; border:1px solid var(--border); box-shadow: var(--shadow);">',
            unsafe_allow_html=True
        )
        
        st.markdown("<div style='margin-top: 15px; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;'>Operations Log Terminal</div>", unsafe_allow_html=True)
        
        # Fragment 1: Runs every 1 second in the background, updating only the logs container
        @st.fragment(run_every=1.0)
        def render_log_terminal():
            utils.render_log_viewer(mjpeg_server.state["events"])
            
        render_log_terminal()
        
    with col_metrics:
        st.markdown("<div style='font-size: 0.8rem; font-weight: 600; color: var(--text); margin-bottom: 8px;'>REAL-TIME METRICS</div>", unsafe_allow_html=True)
        
        # Fragment 2: Runs every 1 second in the background, updating metrics cards and AI stats
        @st.fragment(run_every=1.0)
        def render_metrics_and_stats(scenario_name):
            state = mjpeg_server.state
            elapsed = time.time() - state["start_time"]
            minutes = max(0.01, elapsed / 60.0)
            
            if scenario_name == "Parma Produce":
                count = state["sausage_count"]
                rate = count / minutes
                target_efficiency = min(100.0, (rate / 30.0) * 100.0)  # adjusted target rate for produce
                
                k_val = f"{count:,}"
                k_delta = f"{rate:.1f} / min"
                k2_val = f"{target_efficiency:.1f}%"
                k2_label = "Target Efficiency"
                k2_delta = "Target: 30/min"
                k2_dt = "up" if target_efficiency > 80 else "warn"
                
                # Append to local history for charts
                st.session_state.history_data.append({"timestamp": datetime.now().strftime('%H:%M:%S'), "rate": rate})
                
                active_targets = 0
                sausage_counter = mjpeg_server.get_sausage_counter()
                if sausage_counter is not None:
                    active_targets = len(sausage_counter.tracker.tracked_objects)
                
                engine_details = f"""
                <div style='background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 12px;'>
                    <div style='font-size:0.75rem; color:var(--text-muted);'>ACTIVE TRACKING TARGETS</div>
                    <div style='font-size:1.1rem; font-weight:700; color:var(--text);'>{active_targets} items</div>
                    <hr style='margin: 8px 0; border: none; border-top: 1px solid var(--border-subtle);'/>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>DETECTION ENGINE: <span style='color:var(--text); font-weight:600;'>YOLOv8 Produce Tracker</span></div>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>LINE GATE X: <span style='color:var(--text); font-weight:600;'>{state["line_x"]} px</span></div>
                </div>
                """
            elif scenario_name == "Sabori Bottling":
                count = state["packaging_count"]
                defects = state["packaging_defects"]
                rate = count / minutes
                defect_pct = (defects / max(1, count)) * 100.0
                q_index = 100.0 - defect_pct
                
                k_val = f"{count:,}"
                k_delta = f"{rate:.1f} / min"
                k2_val = f"{defect_pct:.1f}%"
                k2_label = "Defect Rate"
                k2_delta = f"{defects} defects"
                k2_dt = "down" if defect_pct > 8.0 else "up"
                
                st.session_state.history_data.append({"timestamp": datetime.now().strftime('%H:%M:%S'), "rate": rate})
                
                engine_details = f"""
                <div style='background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 12px;'>
                    <div style='font-size:0.75rem; color:var(--text-muted);'>QUALITY INDEX</div>
                    <div style='font-size:1.1rem; font-weight:700; color:{"#22c55e" if q_index > 92 else "#ef4444"};'>{q_index:.1f}%</div>
                    <hr style='margin: 8px 0; border: none; border-top: 1px solid var(--border-subtle);'/>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>DETECTION ENGINE: <span style='color:var(--text); font-weight:600;'>Bottling QC Inspector</span></div>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>MAX CAP ANGLE DEV: <span style='color:var(--text); font-weight:600;'>{state["defect_threshold"]}°</span></div>
                </div>
                """
            else:
                in_count = state["logistics_in"]
                out_count = state["logistics_out"]
                current_in_yard = max(0, in_count - out_count)
                rate = in_count / minutes
                
                k_val = f"{in_count}"
                k_delta = f"{out_count} Exits"
                k2_val = f"{current_in_yard}"
                k2_label = "Vehicles In Yard"
                k2_delta = "Cap: 15 bays"
                k2_dt = "warn" if current_in_yard > 10 else "up"
                
                st.session_state.history_data.append({"timestamp": datetime.now().strftime('%H:%M:%S'), "rate": rate})
                
                engine_details = f"""
                <div style='background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 12px;'>
                    <div style='font-size:0.75rem; color:var(--text-muted);'>GATE INFLOW RATE</div>
                    <div style='font-size:1.1rem; font-weight:700; color:var(--text);'>{rate:.1f} / min</div>
                    <hr style='margin: 8px 0; border: none; border-top: 1px solid var(--border-subtle);'/>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>DETECTION ENGINE: <span style='color:var(--text); font-weight:600;'>YOLOv8 Nano (COCO-classes)</span></div>
                    <div style='font-size:0.7rem; color:var(--text-muted);'>LINE GATE Y: <span style='color:var(--text); font-weight:600;'>{state["line_y"]} px</span></div>
                </div>
                """
                
            c1, c2 = st.columns(2)
            with c1:
                utils.metric_card("Total Processed", k_val, delta=k_delta, delta_type="up")
            with c2:
                utils.metric_card(k2_label, k2_val, delta=k2_delta, delta_type=k2_dt)
                
            st.markdown("<div style='font-size: 0.8rem; font-weight: 600; color: var(--text); margin-top: 20px; margin-bottom: 8px;'>AI DETECTOR STATS</div>", unsafe_allow_html=True)
            st.markdown(engine_details, unsafe_allow_html=True)
            
        render_metrics_and_stats(mjpeg_scenario)

# ----------------- Tab 2: Analytics Content -----------------
with tab_analytics:
    st.markdown("<div class='chart-title'>Production Rate and Efficiency</div><div class='chart-subtitle'>Historical telemetry synchronized with SAP ERP</div>", unsafe_allow_html=True)
    
    # Fragment 3: Runs every 2 seconds, drawing only the chart container
    @st.fragment(run_every=2.0)
    def render_analytics_chart():
        if len(st.session_state.history_data) > 2:
            df = pd.DataFrame(st.session_state.history_data[-60:])  # last 60 records
            
            fig = px.line(df, x="timestamp", y="rate", title="Throughput Speed (Items / Minute)")
            fig.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(family="DM Sans, sans-serif", color="#71717a" if not IS_DARK else "#a1a1aa", size=11),
                margin=dict(l=0, r=0, t=30, b=0),
                xaxis=dict(
                    gridcolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
                    zerolinecolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
                    tickfont=dict(size=9, color="#71717a"),
                    title=""
                ),
                yaxis=dict(
                    gridcolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
                    zerolinecolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
                    tickfont=dict(size=9, color="#71717a"),
                    title="Rate (Items/Min)"
                ),
            )
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
        else:
            st.info("Analytics will display once data points are logged (play video stream to collect data).")
            
    render_analytics_chart()

# ----------------- Tab 3: System Config Content -----------------
with tab_config:
    st.markdown("""
    <div class="chart-wrap" style="margin-bottom: 20px;">
        <div class="chart-title">Edge Device Configuration</div>
        <div class="chart-subtitle">Setup connection parameters for edge nodes and industrial cameras</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Camera Node</th>
                    <th>IP / RTSP Stream</th>
                    <th>Zone Placement</th>
                    <th>Latency</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>CAM_PARMA_01</td>
                    <td>rtsp://10.200.4.51:8554/stream1</td>
                    <td>Parma Fruit Conveyor Line 3 (Chihuahua Complex)</td>
                    <td>12ms</td>
                    <td><span class="badge badge-green">ACTIVE</span></td>
                </tr>
                <tr>
                    <td>CAM_SABORI_04</td>
                    <td>rtsp://10.200.4.54:8554/stream1</td>
                    <td>Sabori Beverage Bottling Line 1 (Chihuahua Complex)</td>
                    <td>14ms</td>
                    <td><span class="badge badge-green">ACTIVE</span></td>
                </tr>
                <tr>
                    <td>CAM_CARNEMART_GATE_IN</td>
                    <td>rtsp://10.205.10.12:8554/gate_in</td>
                    <td>Carnemart Distribution Center Gate 2</td>
                    <td>19ms</td>
                    <td><span class="badge badge-green">ACTIVE</span></td>
                </tr>
                <tr>
                    <td>CAM_CARNEMART_GATE_OUT</td>
                    <td>rtsp://10.205.10.13:8554/gate_out</td>
                    <td>Carnemart Distribution Center Gate 3</td>
                    <td>21ms</td>
                    <td><span class="badge badge-amber">STANDBY</span></td>
                </tr>
            </tbody>
        </table>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="chart-wrap">
        <div class="chart-title">Integration & Trigger Actions</div>
        <div class="chart-subtitle">Automated actions triggered on PLC and ERP systems</div>
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 6px; margin-bottom: 10px;">
            <strong>PLC Reject Arm Trigger (Sabori Bottling)</strong><br/>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Triggers a pneumatic reject arm on PLC Address <code>I:0/4</code> when bottle cap or fill-level defect is detected.</span><br/>
            <span class="badge badge-blue">Delay: 120ms</span> <span class="badge badge-green">Enabled</span>
        </div>
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 6px;">
            <strong>SAP Production Run Log</strong><br/>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Syncs counts directly to SAP PP (Production Planning) module. Logs output batch quantity every 1,000 counts.</span><br/>
            <span class="badge badge-blue">Frequency: Batch (1000 items)</span> <span class="badge badge-green">Enabled</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
