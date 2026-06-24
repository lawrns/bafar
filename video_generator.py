import os
import urllib.request

def create_videos_dir():
    os.makedirs("videos", exist_ok=True)

def download_video(url, filename):
    path = os.path.join("videos", filename)
    if os.path.exists(path):
        print(f"{filename} already exists.")
        return True
        
    print(f"Downloading {filename} from {url}...")
    try:
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded {filename} successfully.")
        return True
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
        return False

if __name__ == "__main__":
    create_videos_dir()
    
    # 1. Real Video for Sausage Counting (Mechanical bolts moving on a conveyor)
    url_sausage = "https://github.com/intel-iot-devkit/sample-videos/raw/master/bolt-multi-size-detection.mp4"
    download_video(url_sausage, "sausage_conveyor.mp4")
    
    # 2. Real Video for Packaging Quality Control (Conveyor line with defect tracking)
    url_packaging = "https://github.com/intel-iot-devkit/sample-videos/raw/master/bolt-detection.mp4"
    download_video(url_packaging, "ham_packaging.mp4")
    
    # 3. Real Video for Logistics Gate (Vehicles entering/exiting gate)
    url_logistics = "https://github.com/intel-iot-devkit/sample-videos/raw/master/car-detection.mp4"
    download_video(url_logistics, "car_detection.mp4")
    
    print("All real-world video assets processed.")
