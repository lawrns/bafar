# BAFAR OS — Demo runbook

The AI Vision computer-vision app is woven into the **BAFAR OS** control tower as a
native **"Visión IA"** screen, backed by **Appwrite**. Live YOLOv8 detections stream
into the dashboard and critical QC defects become human-authorizable actions.

## Run the demo (laptop, live)

```bash
cd ~/Downloads/bafar
source venv/bin/activate

# 1. Start the CV + API backend (YOLOv8, MJPEG, JSON API, Appwrite sync)
python serve.py          # serves http://127.0.0.1:8502  (wait ~15s for model load)

# 2. In a second terminal, serve the dashboard (any free port)
python -m http.server 8137
```

Open **http://localhost:8137/BAFAR%20OS.dc.html** and click **Visión IA** in the sidebar.

## What to show

1. **Visión IA screen** — live processed video (YOLOv8 detection overlays), real-time
   metric cards, and the detection log ("Bitácora de Detección").
2. **Scenario chips** — switch between 🍊 Parma (conteo), 🧪 Sabori (calidad),
   🚛 Carnemart (patio). Play / Pausa / Reiniciar control the engine live.
3. **AI → human authorization** — let **Sabori** run; a detected crooked-cap / underfill
   defect auto-creates a **"Bloqueo de lote · defecto detectado por Visión IA"** action.
   The sidebar **Acciones Pendientes** badge bumps on every screen. Open it and
   **Autorizar** — the decision persists to Appwrite and lands in "Ejecutadas en esta sesión".

## Architecture

- `serve.py` — standalone launcher: provisions Appwrite schema, starts the server,
  runs the sync thread (CV events → `detection_events`; defects → `pending_actions`;
  periodic `production_runs` snapshots).
- `mjpeg_server.py` — CV engine + HTTP: `/video_feed` (MJPEG), `/api/state` (JSON),
  `/api/control` (POST). No Streamlit dependency.
- `cv_processors.py`, `videos/`, `yolov8n.pt` — reused unchanged.
- `appwrite_db.py` — fail-soft Appwrite REST wrapper (the only holder of the server key).
- `BAFAR OS.dc.html` — the dashboard; the Visión IA screen polls `/api/state` and posts
  controls. The HTML never talks to Appwrite directly.
- `app.py` — the original Streamlit view, left intact (not used by this demo).

## Notes

- Needs internet: `support.js` loads React from unpkg. The CV backend is local.
- The server API key lives in `serve.py` / `appwrite_db.py` (env-overridable). Do not
  commit it to a public repo.
- If the backend is off, the Visión IA screen shows a "Nodo edge desconectado" placeholder
  and the rest of the dashboard works normally.
