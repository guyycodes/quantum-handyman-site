const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// List of images to convert
const imagesToConvert = [
  'public/images/home-repair/custom_furniture.jpg',
  'public/images/home-repair/bathroom.jpg',
  'public/images/smart-home/smart_speaker.png',
  'public/images/landscaping/Backyard_b4.jpg',
  'public/images/web-dev/Ai.png',
  'public/images/web-dev/whealth_app.png',
  'public/images/home-repair/some_shed.jpg',
  'public/images/smart-home/many_cameras.png',
  'public/images/smart-home/smart_home_app.png',
  'public/images/landscaping/sprkinkler_head.jpg',
  'public/images/profile/Me-and-Pops.jpg'
];

async function convertToWebP() {
  for (const imagePath of imagesToConvert) {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  File not found: ${imagePath}`);
        continue;
      }

      // Generate output path
      const dir = path.dirname(imagePath);
      const filename = path.basename(imagePath, path.extname(imagePath));
      const outputPath = path.join(dir, `${filename}-optimized.webp`);

      // Convert to WebP with optimization
      await sharp(imagePath)
        .webp({ 
          quality: 85,  // Good quality with smaller file size
          effort: 6     // Higher effort = better compression
        })
        .toFile(outputPath);

      // Get file sizes for comparison
      const originalSize = fs.statSync(imagePath).size;
      const webpSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

      console.log(`✅ Converted: ${filename}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(0)}KB → WebP: ${(webpSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Failed to convert ${imagePath}:`, error.message);
    }
  }
  
  console.log('\n✨ WebP conversion complete!');
}

// Run the conversion
convertToWebP().catch(console.error);