import cv2
import numpy as np
import time
import threading
import math
import sys
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn

# Import local CV processors
from cv_processors import SausageCounter, PackagingInspector, LogisticsTracker

# Global shared state (attached to sys to survive Streamlit module reloads)
if not hasattr(sys, "_mjpeg_initialized"):
    sys._mjpeg_state = {
        "scenario": "Parma Produce",  # "Parma Produce", "Sabori Bottling", "Logistics"
        "playing": True,
        "line_x": 640,
        "line_y": 200,
        "conf_thresh": 0.5,
        "show_obb": True,
        "defect_threshold": 10.0,
        "show_labels": True,
        
        # Telemetry outputs
        "sausage_count": 0,
        "packaging_count": 0,
        "packaging_defects": 0,
        "logistics_in": 0,
        "logistics_out": 0,
        
        "events": [],
        "last_jpg": None,
        "start_time": time.time(),

        # AI-generated pending actions mirrored from Appwrite by serve.py
        "ai_actions": []
    }
    sys._mjpeg_sausage_counter = None
    sys._mjpeg_packaging_inspector = None
    sys._mjpeg_logistics_tracker = None
    sys._mjpeg_server_started = False
    sys._mjpeg_state_lock = threading.Lock()
    sys._mjpeg_frame_event = threading.Event()
    sys._mjpeg_initialized = True

# Alias state, lock, and event locally for ease of use
state = sys._mjpeg_state
_state_lock = sys._mjpeg_state_lock
_frame_event = sys._mjpeg_frame_event

# Expose getter for Streamlit frontend reload compatibility
def get_sausage_counter():
    return sys._mjpeg_sausage_counter

def reset_all_counters():
    with _state_lock:
        if sys._mjpeg_sausage_counter is not None:
            sys._mjpeg_sausage_counter = SausageCounter()
        if sys._mjpeg_packaging_inspector is not None:
            sys._mjpeg_packaging_inspector = PackagingInspector()
        if sys._mjpeg_logistics_tracker is not None:
            sys._mjpeg_logistics_tracker = LogisticsTracker()
            
        state["sausage_count"] = 0
        state["packaging_count"] = 0
        state["packaging_defects"] = 0
        state["logistics_in"] = 0
        state["logistics_out"] = 0
        state["events"] = []
        state["start_time"] = time.time()

def processing_loop():
    video_paths = {
        "Parma Produce": "videos/sausage_conveyor.mp4",
        "Sabori Bottling": "videos/ham_packaging.mp4",
        "Logistics": "videos/car_detection.mp4"
    }
    
    current_scenario = ""
    cap = None
    fps = 25.0
    is_high_fps = False
    target_delay = 0.04
    
    while True:
        try:
            t_start = time.time()
            with _state_lock:
                target_scenario = state["scenario"]
                playing = state["playing"]
                line_x = state["line_x"]
                line_y = state["line_y"]
                conf_thresh = state["conf_thresh"]
                show_obb = state["show_obb"]
                defect_threshold = state["defect_threshold"]
                show_labels = state["show_labels"]
            
            # Switch scenario video if needed
            if target_scenario != current_scenario:
                if cap is not None:
                    cap.release()
                video_path = video_paths.get(target_scenario, "videos/sausage_conveyor.mp4")
                cap = cv2.VideoCapture(video_path)
                current_scenario = target_scenario
                if cap.isOpened():
                    fps = cap.get(cv2.CAP_PROP_FPS)
                    if fps <= 0:
                        fps = 25.0
                else:
                    fps = 25.0
                
                is_high_fps = (fps > 45)
                if is_high_fps:
                    target_delay = 2.0 / fps  # Downsample 60 FPS to 30 FPS
                else:
                    target_delay = 1.0 / fps  # 30 FPS or 12.5 FPS
                
            if not playing:
                # If paused, we still generate a frame preview occasionally, but don't advance the video
                time.sleep(0.1)
                continue
                
            if cap is None or not cap.isOpened():
                time.sleep(0.1)
                continue
                
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = cap.read()
                if not ret:
                    time.sleep(0.1)
                    continue
            
            if is_high_fps:
                cap.grab()  # Skip next frame
                    
            # Process frame based on current scenario
            if current_scenario == "Parma Produce":
                if sys._mjpeg_sausage_counter is None:
                    sys._mjpeg_sausage_counter = SausageCounter()
                processed, count = sys._mjpeg_sausage_counter.process_frame(
                    frame, line_x, conf_threshold=conf_thresh, show_obb=show_obb
                )
                with _state_lock:
                    state["sausage_count"] = count
                    state["events"] = list(sys._mjpeg_sausage_counter.events)
            elif current_scenario == "Sabori Bottling":
                if sys._mjpeg_packaging_inspector is None:
                    sys._mjpeg_packaging_inspector = PackagingInspector()
                processed, count, defects = sys._mjpeg_packaging_inspector.process_frame(
                    frame, defect_threshold_deg=defect_threshold, show_label_box=show_labels
                )
                with _state_lock:
                    state["packaging_count"] = count
                    state["packaging_defects"] = defects
                    state["events"] = list(sys._mjpeg_packaging_inspector.events)
            else:  # Logistics
                if sys._mjpeg_logistics_tracker is None:
                    print("Initializing and warming up YOLOv8...")
                    sys._mjpeg_logistics_tracker = LogisticsTracker()
                    # Warm up
                    sys._mjpeg_logistics_tracker.model(np.zeros((300, 300, 3), dtype=np.uint8), verbose=False)
                processed, in_c, out_c = sys._mjpeg_logistics_tracker.process_frame(
                    frame, line_y, conf_threshold=conf_thresh
                )
                with _state_lock:
                    state["logistics_in"] = in_c
                    state["logistics_out"] = out_c
                    state["events"] = list(sys._mjpeg_logistics_tracker.events)
                    
            # Encode frame as JPG
            ret_jpg, jpeg = cv2.imencode('.jpg', processed)
            if ret_jpg:
                with _state_lock:
                    state["last_jpg"] = jpeg.tobytes()
                _frame_event.set()
                _frame_event.clear()
                    
            t_elapsed = time.time() - t_start
            sleep_time = max(0.001, target_delay - t_elapsed)
            time.sleep(sleep_time)
            
        except Exception as e:
            print(f"Error in CV processing thread: {e}")
            time.sleep(0.1)

SCENARIOS = ("Parma Produce", "Sabori Bottling", "Logistics")

# Friendly aliases the frontend may send -> internal scenario keys
SCENARIO_ALIASES = {
    "parma": "Parma Produce",
    "sabori": "Sabori Bottling",
    "logistics": "Logistics",
    "carnemart": "Logistics",
}


def _resolve_scenario(value):
    if value in SCENARIOS:
        return value
    return SCENARIO_ALIASES.get(str(value).strip().lower())


def build_state_snapshot():
    """JSON-serializable snapshot of live telemetry + computed metrics."""
    with _state_lock:
        scenario = state["scenario"]
        playing = state["playing"]
        elapsed = max(0.001, time.time() - state["start_time"])
        minutes = max(0.01, elapsed / 60.0)
        snap = {
            "scenario": scenario,
            "playing": playing,
            "line_x": state["line_x"],
            "line_y": state["line_y"],
            "conf_thresh": state["conf_thresh"],
            "show_obb": state["show_obb"],
            "defect_threshold": state["defect_threshold"],
            "show_labels": state["show_labels"],
            "sausage_count": state["sausage_count"],
            "packaging_count": state["packaging_count"],
            "packaging_defects": state["packaging_defects"],
            "logistics_in": state["logistics_in"],
            "logistics_out": state["logistics_out"],
            "events": list(state["events"])[-25:],
            "ai_actions": list(state.get("ai_actions", [])),
            "uptime_seconds": round(elapsed, 1),
        }

    # Active tracking targets (Parma only — best effort)
    active_targets = 0
    sc = get_sausage_counter()
    if sc is not None:
        try:
            active_targets = len(sc.tracker.tracked_objects)
        except Exception:
            active_targets = 0
    snap["active_targets"] = active_targets

    # Per-scenario computed metrics
    if scenario == "Parma Produce":
        count = snap["sausage_count"]
        rate = count / minutes
        snap["rate"] = round(rate, 1)
        snap["efficiency"] = round(min(100.0, (rate / 30.0) * 100.0), 1)
    elif scenario == "Sabori Bottling":
        count = snap["packaging_count"]
        defects = snap["packaging_defects"]
        snap["rate"] = round(count / minutes, 1)
        defect_pct = (defects / max(1, count)) * 100.0
        snap["defect_pct"] = round(defect_pct, 1)
        snap["quality_index"] = round(100.0 - defect_pct, 1)
    else:  # Logistics
        in_c = snap["logistics_in"]
        out_c = snap["logistics_out"]
        snap["rate"] = round(in_c / minutes, 1)
        snap["in_yard"] = max(0, in_c - out_c)

    return snap


def apply_control(payload):
    """Apply a control action. Returns a small result dict."""
    action = (payload or {}).get("action")
    if action == "play":
        with _state_lock:
            state["playing"] = True
        return {"ok": True, "playing": True}
    if action == "pause":
        with _state_lock:
            state["playing"] = False
        return {"ok": True, "playing": False}
    if action == "reset":
        reset_all_counters()
        return {"ok": True}
    if action == "scenario":
        target = _resolve_scenario(payload.get("value"))
        if not target:
            return {"ok": False, "error": "unknown scenario"}
        reset_all_counters()
        with _state_lock:
            state["scenario"] = target
        return {"ok": True, "scenario": target}
    if action == "set_param":
        key = payload.get("key")
        if key not in ("line_x", "line_y", "conf_thresh", "show_obb",
                       "defect_threshold", "show_labels"):
            return {"ok": False, "error": "bad param"}
        with _state_lock:
            state[key] = payload.get("value")
        return {"ok": True, key: payload.get("value")}
    if action == "resolve_action":
        aid = payload.get("action_id")
        ok = bool(payload.get("ok", True))
        try:
            import appwrite_db
            appwrite_db.resolve_pending_action(aid, ok)
        except Exception as e:
            print("[control] resolve persistence failed: %s" % e)
        with _state_lock:
            state["ai_actions"] = [a for a in state.get("ai_actions", [])
                                   if a.get("action_id") != aid]
        return {"ok": True, "action_id": aid}
    return {"ok": False, "error": "unknown action"}


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

class MJPEGHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Disable logging HTTP requests to stderr
        return

    def _send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json(self, obj, status=200):
        body = json.dumps(obj).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Content-length', str(len(body)))
        self._send_cors()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/control':
            try:
                length = int(self.headers.get('Content-Length', 0))
                raw = self.rfile.read(length) if length else b'{}'
                payload = json.loads(raw.decode('utf-8') or '{}')
            except (ValueError, TypeError):
                self._send_json({"ok": False, "error": "bad json"}, status=400)
                return
            try:
                result = apply_control(payload)
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, status=500)
                return
            self._send_json(result)
            return
        self._send_json({"ok": False, "error": "not found"}, status=404)

    def do_GET(self):
        global state
        if self.path == '/api/state':
            try:
                self._send_json(build_state_snapshot())
            except Exception as e:
                self._send_json({"error": str(e)}, status=500)
            return
        if self.path == '/video_feed':
            self.send_response(200)
            self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=frame')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            last_sent_jpg = None
            while True:
                # Wait for the next frame to be ready (timeout after 50ms to check loop status)
                _frame_event.wait(timeout=0.05)
                
                with _state_lock:
                    jpg_data = state["last_jpg"]
                
                if jpg_data is not None and jpg_data != last_sent_jpg:
                    try:
                        self.wfile.write(b'--frame\r\n')
                        self.send_header('Content-type', 'image/jpeg')
                        self.send_header('Content-length', len(jpg_data))
                        self.end_headers()
                        self.wfile.write(jpg_data)
                        self.wfile.write(b'\r\n')
                        last_sent_jpg = jpg_data
                    except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
                        break

def start_mjpeg_server():
    if sys._mjpeg_server_started:
        return
        
    # Start background processing thread
    t_proc = threading.Thread(target=processing_loop, name="CV_Processor_Thread", daemon=True)
    t_proc.start()
    
    # Start HTTP server on port 8502
    try:
        server = ThreadedHTTPServer(('0.0.0.0', 8502), MJPEGHandler)
        t_srv = threading.Thread(target=server.serve_forever, name="MJPEG_HTTP_Thread", daemon=True)
        t_srv.start()
        sys._mjpeg_server_started = True
        print("MJPEG Server started successfully on port 8502.")
    except Exception as e:
        print(f"Failed to start MJPEG Server: {e}")
