import cv2
import os
import json
from PIL import Image

def process_video():
    video_path = 'Dimpuru.mp4'
    output_dir = 'public/assets/dimpuru'
    atlas_dir = os.path.join(output_dir, 'atlas')
    raw_frames_dir = 'extracted_frames'
    
    os.makedirs(atlas_dir, exist_ok=True)
    os.makedirs(raw_frames_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception(f"Failed to open {video_path}")
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Video Info: {total_frames} frames, {fps} fps, {width}x{height}")
    
    frames_rgb = []
    for i in range(total_frames):
        ret, frame = cap.read()
        if not ret:
            print(f"Warning: Reached EOF at frame {i}")
            break
        # OpenCV reads BGR, convert to RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frames_rgb.append(rgb)
        
        # Save individual raw frame WebP/PNG for verification
        im = Image.fromarray(rgb)
        im.save(os.path.join(raw_frames_dir, f"frame_{i:03d}.webp"), "WEBP", quality=90)
        
    cap.release()
    
    actual_count = len(frames_rgb)
    print(f"Extracted {actual_count} frames.")
    
    # Grid settings for sprite atlas
    cols = 3
    rows = 3
    frames_per_page = cols * rows
    total_pages = (actual_count + frames_per_page - 1) // frames_per_page
    
    print(f"Creating {total_pages} atlas pages ({cols}x{rows} grid, up to {frames_per_page} frames/page)...")
    
    frames_metadata = []
    pages_metadata = []
    
    for page_idx in range(total_pages):
        start_idx = page_idx * frames_per_page
        end_idx = min(start_idx + frames_per_page, actual_count)
        page_frames_count = end_idx - start_idx
        
        # Create atlas canvas
        atlas_img = Image.new("RGB", (cols * width, rows * height), (255, 255, 255))
        
        for local_idx in range(page_frames_count):
            global_frame_idx = start_idx + local_idx
            frame_arr = frames_rgb[global_frame_idx]
            im = Image.fromarray(frame_arr)
            
            c = local_idx % cols
            r = local_idx // cols
            x = c * width
            y = r * height
            
            atlas_img.paste(im, (x, y))
            
            frames_metadata.append({
                "index": global_frame_idx,
                "pageIndex": page_idx,
                "x": x,
                "y": y,
                "width": width,
                "height": height
            })
            
        page_filename = f"page_{page_idx:03d}.webp"
        page_filepath = os.path.join(atlas_dir, page_filename)
        atlas_img.save(page_filepath, "WEBP", quality=85, method=4)
        
        page_size_kb = os.path.getsize(page_filepath) / 1024
        print(f"Saved {page_filename} ({page_frames_count} frames, {page_size_kb:.1f} KB)")
        
        pages_metadata.append({
            "index": page_idx,
            "file": f"assets/dimpuru/atlas/{page_filename}",
            "frameCount": page_frames_count
        })

    # Save a poster / idle frame for instant first paint
    idle_im = Image.fromarray(frames_rgb[0])
    idle_im.save(os.path.join(output_dir, "poster.webp"), "WEBP", quality=90)
    
    # Save metadata JSON
    metadata = {
        "name": "dimpuru",
        "totalFrames": actual_count,
        "fps": fps,
        "frameWidth": width,
        "frameHeight": height,
        "aspectRatio": "16:9",
        "idleFrame": 0,
        "naturalCenterFrame": 72,
        "grid": {
            "columns": cols,
            "rows": rows,
            "framesPerPage": frames_per_page,
            "pageWidth": cols * width,
            "pageHeight": rows * height
        },
        "totalPages": total_pages,
        "pages": pages_metadata,
        "frames": frames_metadata
    }
    
    metadata_path = os.path.join(output_dir, "metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Saved metadata to {metadata_path}")
    print("All processing completed successfully!")

if __name__ == "__main__":
    process_video()
