from PIL import Image
import sys

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Get grayscale value
        gray = int(0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2])
        
        # We want white (255) to be fully opaque (255)
        # We want dark background (e.g., < 100) to be fully transparent (0)
        # Smooth transition for anti-aliasing
        threshold = 120
        if gray <= threshold:
            alpha = 0
        else:
            alpha = int(min(255, (gray - threshold) * 255 / (255 - threshold)))
            
        # The user wants a black logo, so RGB = 0,0,0
        new_data.append((0, 0, 0, alpha))
        
    img.putdata(new_data)
    
    # Crop transparent boundaries
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_logo.py <input> <output>")
        sys.exit(1)
    process_image(sys.argv[1], sys.argv[2])
