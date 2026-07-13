const sharp = require('sharp');
const path = require('path');

async function processLogo() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  
  if (!inputPath || !outputPath) {
    console.error("Usage: node process_logo.js <input> <output>");
    process.exit(1);
  }
  
  try {
    // 1. Convert to grayscale and get the raw pixel data
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      
      if (lum > 120) {
        data[i] = 0;     // R
        data[i+1] = 0;   // G
        data[i+2] = 0;   // B
        data[i+3] = 255; // Alpha
      } else {
        data[i+3] = 0;   // Alpha
      }
    }
    
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log("Logo successfully processed and saved to", outputPath);
  } catch (error) {
    console.error("Failed to process image:", error);
    process.exit(1);
  }
}

processLogo();
