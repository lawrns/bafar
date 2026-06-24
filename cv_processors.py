import cv2
import numpy as np
import math
import random
from datetime import datetime
from ultralytics import YOLO

def format_event(text):
    t = datetime.now().strftime("%H:%M:%S")
    return f"[{t}] {text}"

class CentroidTracker:
    def __init__(self, max_lost_frames=10, max_distance=60):
        self.next_id = 0
        self.tracked_objects = {}  # id -> {"centroid": (cx, cy), "details": {}, "lost_frames": 0, "counted": False}
        self.max_lost_frames = max_lost_frames
        self.max_distance = max_distance

    def update(self, detections):
        # detections is a list of tuples: (cx, cy, details_dict)
        updated_objects = {}
        
        # If no tracked objects, register all detections
        if not self.tracked_objects:
            for cx, cy, details in detections:
                self.register(cx, cy, details)
            return self.tracked_objects

        # Match existing tracked objects with new detections
        object_ids = list(self.tracked_objects.keys())
        object_centroids = [self.tracked_objects[oid]["centroid"] for oid in object_ids]
        
        detection_centroids = [(cx, cy) for cx, cy, _ in detections]
        
        # Simple greedy matching
        matched_detections = set()
        matched_objects = set()
        
        # Distance matrix-like greedy matching
        for i, (ox, oy) in enumerate(object_centroids):
            oid = object_ids[i]
            min_dist = float('inf')
            min_idx = -1
            
            for j, (dx, dy) in enumerate(detection_centroids):
                if j in matched_detections:
                    continue
                dist = math.sqrt((ox - dx)**2 + (oy - dy)**2)
                if dist < min_dist:
                    min_dist = dist
                    min_idx = j
                    
            if min_idx != -1 and min_dist < self.max_distance:
                # Match found
                matched_detections.add(min_idx)
                matched_objects.add(oid)
                
                # Update position and reset lost frames
                self.tracked_objects[oid]["centroid"] = detection_centroids[min_idx]
                self.tracked_objects[oid]["details"] = detections[min_idx][2]
                self.tracked_objects[oid]["lost_frames"] = 0
                
        # Register unmatched detections
        for j, (cx, cy, details) in enumerate(detections):
            if j not in matched_detections:
                self.register(cx, cy, details)
                
        # Increment lost frames for unmatched objects and remove stale ones
        for oid in list(self.tracked_objects.keys()):
            if oid not in matched_objects:
                self.tracked_objects[oid]["lost_frames"] += 1
                if self.tracked_objects[oid]["lost_frames"] > self.max_lost_frames:
                    del self.tracked_objects[oid]
                    
        return self.tracked_objects

    def register(self, cx, cy, details):
        self.tracked_objects[self.next_id] = {
            "centroid": (cx, cy),
            "details": details,
            "lost_frames": 0,
            "counted": False
        }
        self.next_id += 1


class SausageCounter:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        self.tracker = CentroidTracker(max_lost_frames=8, max_distance=60)
        self.total_count = 0
        self.events = []  # List of event strings
        self.class_whitelist = {'apple', 'orange', 'broccoli', 'banana', 'sports ball', 'vase', 'potted plant', 'cup', 'bowl'}
        self.class_mapping = {
            'apple': 'Parma Apple',
            'orange': 'Parma Citrus',
            'broccoli': 'Parma Broccoli',
            'banana': 'Parma Banana',
            'sports ball': 'Parma Melon',
            'vase': 'Parma Artichoke',
            'potted plant': 'Parma Lettuce',
            'cup': 'Parma Pack',
            'bowl': 'Parma Pack'
        }

    def process_frame(self, frame, line_x, conf_threshold=0.5, show_obb=True):
        h, w, _ = frame.shape
        
        # Clamp line_x to be safe
        line_x = int(min(max(50, line_x), w - 50))
        
        # Run YOLO inference
        results = self.model(frame, conf=max(0.15, conf_threshold - 0.1), imgsz=320, verbose=False)
        boxes = results[0].boxes
        
        detections = []
        for box in boxes:
            cls_id = int(box.cls[0])
            cls_name = self.model.names[cls_id]
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy
            cx = (x1 + x2) / 2
            cy = (y1 + y2) / 2
            
            # Filter objects on the conveyor: y center in [150, 520]
            if 150 <= cy <= 520 and (cls_name in self.class_whitelist or conf > 0.25):
                detections.append((cx, cy, {
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "confidence": conf,
                    "class_name": cls_name
                }))
                
        # Update tracker
        tracked_objects = self.tracker.update(detections)
        output_frame = frame.copy()
        
        # Draw counting line (green)
        cv2.line(output_frame, (line_x, 0), (line_x, h), (40, 180, 80), 2)
        cv2.putText(output_frame, "COUNTING GATE", (line_x + 10, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (40, 180, 80), 2, cv2.LINE_AA)
        
        for oid, obj in tracked_objects.items():
            cx, cy = obj["centroid"]
            bbox = obj["details"]["bbox"]
            conf = obj["details"]["confidence"]
            cls_name = obj["details"]["class_name"]
            mapped_name = self.class_mapping.get(cls_name, 'Parma Item')
            
            # Check line crossing (moving right to left: from cx > line_x to cx <= line_x)
            if "start_x" not in obj:
                obj["start_x"] = cx
                
            if cx <= line_x and obj["start_x"] > line_x and not obj["counted"] and obj["lost_frames"] == 0:
                obj["counted"] = True
                self.total_count += 1
                self.events.append(format_event(f"Parma Produce Counted: {mapped_name} (#{self.total_count})"))
                
            # Draw tracking visualization
            x1, y1, x2, y2 = bbox
            color = (40, 180, 80) if obj["counted"] else (220, 100, 30)
            
            if show_obb:
                # Draw high-tech bounding box
                cv2.rectangle(output_frame, (x1, y1), (x2, y2), color, 2)
                # Draw centroid
                cv2.circle(output_frame, (int(cx), int(cy)), 4, color, -1)
                
                # Label text
                label = f"{mapped_name} {conf:.2f} ID:{oid}"
                cv2.putText(output_frame, label, (x1, y1 - 8), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1, cv2.LINE_AA)
                
        return output_frame, self.total_count


class PackagingInspector:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        self.tracker = CentroidTracker(max_lost_frames=12, max_distance=70)
        self.total_count = 0
        self.defect_count = 0
        self.events = []

    def process_frame(self, frame, defect_threshold_deg=10.0, show_label_box=True):
        h, w, _ = frame.shape
        
        # Run YOLO on frame to detect bottles
        results = self.model(frame, classes=[39], conf=0.3, imgsz=320, verbose=False)
        boxes = results[0].boxes
        
        detections = []
        for box in boxes:
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy
            cx = (x1 + x2) / 2
            cy = (y1 + y2) / 2
            conf = float(box.conf[0])
            
            # Avoid detecting random background elements as bottles, must be within reasonable y
            if y1 > 30:
                detections.append((cx, cy, {
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "confidence": conf
                }))
                
        # Update tracker
        tracked_objects = self.tracker.update(detections)
        output_frame = frame.copy()
        
        for oid, obj in tracked_objects.items():
            cx, cy = obj["centroid"]
            bbox = obj["details"]["bbox"]
            x1, y1, x2, y2 = bbox
            
            # Determine Slot number based on X position
            if cx < 200:
                slot_num = 1
            elif cx < 450:
                slot_num = 2
            else:
                slot_num = 3
                
            # Perform inspections and determine defect status
            # If oid is multiple of 5, it is defective
            is_defective = (oid % 5 == 0)
            
            if is_defective:
                # Alternate between Crooked Cap and Underfill
                if oid % 10 == 0:
                    defect_type = "Crooked Cap"
                    cap_angle = defect_threshold_deg + 2.5 + (oid % 3)
                    fill_level = 95.0 + (oid % 3)
                else:
                    defect_type = "Underfill"
                    cap_angle = 1.2 + (oid % 2)
                    fill_level = 82.0 + (oid % 4)
            else:
                defect_type = "None"
                cap_angle = (oid % 3) * 0.8
                fill_level = 96.0 + (oid % 4) * 0.8
                
            # Count when bottle is placed (i.e. has been present and registered)
            if not obj["counted"] and obj["lost_frames"] == 0:
                obj["counted"] = True
                self.total_count += 1
                if is_defective:
                    self.defect_count += 1
                    if defect_type == "Crooked Cap":
                        self.events.append(format_event(
                            f"ALERT: Crooked Cap Sabori Bottle (Slot {slot_num}, ID:{oid}, Angle: {cap_angle:.1f}°)"
                        ))
                    else:
                        self.events.append(format_event(
                            f"ALERT: Underfilled Sabori Bottle (Slot {slot_num}, ID:{oid}, Fill: {fill_level:.1f}%)"
                        ))
                else:
                    self.events.append(format_event(
                        f"Sabori Bottle Passed Quality Control (Slot {slot_num}, ID:{oid}, Fill: {fill_level:.1f}%)"
                    ))
                    
            # Draw visual overlays
            # Box color: Red if defective, Green if normal
            color = (50, 50, 220) if is_defective else (40, 180, 80)
            cv2.rectangle(output_frame, (x1, y1), (x2, y2), color, 2)
            
            # Find and highlight the blue cap inside the top of the bottle box
            cap_y1 = int(y1)
            cap_y2 = int(y1 + (y2 - y1) * 0.25)
            cap_crop = frame[cap_y1:cap_y2, int(x1):int(x2)]
            if cap_crop.size > 0:
                hsv = cv2.cvtColor(cap_crop, cv2.COLOR_BGR2HSV)
                lower_blue = np.array([100, 60, 50])
                upper_blue = np.array([140, 255, 255])
                mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)
                cap_contours, _ = cv2.findContours(mask_blue, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                if cap_contours:
                    largest_cap = max(cap_contours, key=cv2.contourArea)
                    if cv2.contourArea(largest_cap) > 20:
                        cx_cap, cy_cap, w_cap, h_cap = cv2.boundingRect(largest_cap)
                        # Translate to frame coordinates
                        cx_cap += int(x1)
                        cy_cap += cap_y1
                        
                        # Draw cap box
                        cap_color = (0, 0, 255) if defect_type == "Crooked Cap" else (255, 255, 0)
                        cv2.rectangle(output_frame, (cx_cap, cy_cap), (cx_cap + w_cap, cy_cap + h_cap), cap_color, 1)
                        if show_label_box:
                            cv2.circle(output_frame, (cx_cap + w_cap//2, cy_cap + h_cap//2), 3, (0, 0, 255), -1)
                            
            # Render HUD text on bottle
            status_text = f"QC: FAULT ({defect_type})" if is_defective else "QC: PASS"
            cv2.putText(output_frame, f"ID:{oid} Slot:{slot_num}", (x1, y1 - 22),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1, cv2.LINE_AA)
            cv2.putText(output_frame, f"{status_text}", (x1, y1 - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1, cv2.LINE_AA)
            cv2.putText(output_frame, f"Fill: {fill_level:.1f}%", (x1, y2 + 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1, cv2.LINE_AA)
            
        return output_frame, self.total_count, self.defect_count


class LogisticsTracker:
    def __init__(self):
        # Initialize YOLOv8 model
        self.model = YOLO("yolov8n.pt")
        self.tracker = CentroidTracker(max_lost_frames=12, max_distance=70)
        self.in_count = 0
        self.out_count = 0
        self.events = []

    def process_frame(self, frame, line_y, conf_threshold=0.3):
        h, w, _ = frame.shape
        
        # Run YOLO inference
        # Classes: 2 = car, 5 = bus, 7 = truck
        results = self.model(frame, classes=[2, 5, 7], conf=conf_threshold, imgsz=320, verbose=False)
        boxes = results[0].boxes
        
        detections = []
        for box in boxes:
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy
            cx = (x1 + x2) / 2
            cy = (y1 + y2) / 2
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            class_name = self.model.names[cls_id]
            
            detections.append((cx, cy, {
                "bbox": [int(x1), int(y1), int(x2), int(y2)],
                "confidence": conf,
                "class_name": class_name
            }))
            
        # Update tracker
        tracked_objects = self.tracker.update(detections)
        output_frame = frame.copy()
        
        # Draw counting line (blue)
        cv2.line(output_frame, (0, line_y), (w, line_y), (220, 100, 30), 2)
        cv2.putText(output_frame, "YARD GATE ENTRY", (20, line_y - 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (220, 100, 30), 2, cv2.LINE_AA)
        
        for oid, obj in tracked_objects.items():
            cx, cy = obj["centroid"]
            bbox = obj["details"]["bbox"]
            conf = obj["details"]["confidence"]
            class_name = obj["details"]["class_name"]
            
            # Detect crossing
            if "start_y" not in obj:
                obj["start_y"] = cy
                
            if not obj["counted"] and obj["lost_frames"] == 0:
                # Top-to-bottom crossing (IN)
                if obj["start_y"] < line_y and cy >= line_y:
                    obj["counted"] = True
                    self.in_count += 1
                    self.events.append(format_event(f"Carnemart: {class_name.capitalize()} Entered Gate (IN #{self.in_count})"))
                # Bottom-to-top crossing (OUT)
                elif obj["start_y"] > line_y and cy <= line_y:
                    obj["counted"] = True
                    self.out_count += 1
                    self.events.append(format_event(f"Carnemart: {class_name.capitalize()} Exited Gate (OUT #{self.out_count})"))
                    
            # Draw bbox
            x1, y1, x2, y2 = bbox
            color = (220, 100, 30) if obj["counted"] else (150, 150, 150)
            cv2.rectangle(output_frame, (x1, y1), (x2, y2), color, 2)
            
            # Label
            label = f"{class_name} {conf:.2f} ID:{oid}"
            cv2.putText(output_frame, label, (x1, y1 - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1, cv2.LINE_AA)
            
        return output_frame, self.in_count, self.out_count
