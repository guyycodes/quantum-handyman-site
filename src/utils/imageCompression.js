/**
 * Image Compression Utility
 * Compresses and resizes images for efficient storage in Google Sheets
 */

/**
 * Compress a single image file with dynamic compression to reach target size
 * @param {File} file - The image file to compress
 * @param {number} scaleFactor - Scale factor (0.6 = 60% of original size)
 * @param {number} quality - JPEG quality (0.5 = 50% quality)
 * @param {number} targetSizeKB - Target size in KB (default 13KB)
 * @returns {Promise<string>} Base64 string without data URL prefix
 */
export const compressImage = async (file, scaleFactor = 0.6, quality = 0.5, targetSizeKB = 13) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate adaptive compression based on original file size
          const originalSizeKB = file.size / 1024;
          const compressionRatio = targetSizeKB / originalSizeKB;
          
          // Dynamic scaling calculation
          let adaptiveScale = scaleFactor;
          let adaptiveQuality = quality;
          if (originalSizeKB > 1000) { // > 1MB
            adaptiveScale = Math.min(0.2, Math.sqrt(compressionRatio * 2));
            adaptiveQuality = Math.min(0.2, compressionRatio * 5);
          } else if (originalSizeKB > 800) { // > 800KB
            // Very aggressive compression for large images
            adaptiveScale = Math.min(0.3, Math.sqrt(compressionRatio * 2));
            adaptiveQuality = Math.min(0.3, compressionRatio * 5);
          } else if (originalSizeKB > 500) { // 500KB - 800KB
            adaptiveScale = Math.min(0.4, Math.sqrt(compressionRatio * 3));
            adaptiveQuality = Math.min(0.4, compressionRatio * 8);
          } else if (originalSizeKB > 100) { // 100KB - 500KB
            adaptiveScale = Math.min(0.6, Math.sqrt(compressionRatio * 5));
            adaptiveQuality = Math.min(0.5, compressionRatio * 10);
          }
          
          // Ensure minimum dimensions (don't go below 400px on smallest side)
          const minDimension = 400;
          const smallestSide = Math.min(img.width, img.height);
          const minScale = minDimension / smallestSide;
          adaptiveScale = Math.max(adaptiveScale, minScale);
          
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions
          const newWidth = Math.round(img.width * adaptiveScale);
          const newHeight = Math.round(img.height * adaptiveScale);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Draw resized image with high quality smoothing
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Try different quality levels to get close to target size
          let compressedBase64 = '';
          let currentQuality = adaptiveQuality;
          let attempts = 0;
          const maxAttempts = 5;
          
          do {
            const dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            compressedBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
            const currentSizeKB = compressedBase64.length / 1024;
            
            if (currentSizeKB <= targetSizeKB || attempts >= maxAttempts) {
              break;
            }
            
            // Reduce quality further
            currentQuality *= 0.7;
            attempts++;
          } while (attempts < maxAttempts);
          
          const finalSizeKB = Math.round(compressedBase64.length / 1024);
          
          console.log(`Image compressed: ${img.width}x${img.height} → ${newWidth}x${newHeight}, ` +
                     `Original: ${Math.round(originalSizeKB)}KB → Final: ${finalSizeKB}KB, ` +
                     `Scale: ${adaptiveScale.toFixed(2)}, Quality: ${currentQuality.toFixed(2)}`);
          
          resolve(compressedBase64);
        } catch (error) {
          console.error('Error compressing image:', error);
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images and combine into a single string
 * @param {File[]} images - Array of image files
 * @param {Object} options - Compression options
 * @param {number} options.scaleFactor - Scale factor (default 0.6)
 * @param {number} options.quality - JPEG quality (default 0.5)
 * @param {number} options.maxTotalSize - Max total size in bytes (default 45000)
 * @param {number} options.targetPerImage - Target KB per image (default 13KB)
 * @returns {Promise<string>} Comma-separated base64 strings
 */
export const compressMultipleImages = async (images, options = {}) => {
  const {
    scaleFactor = 0.6,
    quality = 0.5,
    maxTotalSize = 45000, // Leave buffer for Google Sheets 50KB limit
    targetPerImage = 13   // Target 13KB per image
  } = options;
  
  if (!images || images.length === 0) {
    return '';
  }
  
  // Calculate target size per image based on total limit and number of images
  const targetSizePerImage = Math.min(
    targetPerImage,
    Math.floor(maxTotalSize / images.length / 1024) // KB per image
  );
  
  const base64Images = [];
  let totalSize = 0;
  
  for (const image of images) {
    if (image instanceof File) {
      try {
        // Use dynamic compression with target size
        const compressedBase64 = await compressImage(image, scaleFactor, quality, targetSizePerImage);
        
        // Check if adding this image would exceed our limit
        if (totalSize + compressedBase64.length < maxTotalSize) {
          base64Images.push(compressedBase64);
          totalSize += compressedBase64.length;
        } else {
          console.warn(`Image "${image.name}" skipped - would exceed total size limit`);
        }
      } catch (error) {
        console.error(`Failed to compress image "${image.name}":`, error);
        // Continue with other images if one fails
      }
    }
  }
  
  const result = base64Images.join(',');
  console.log(`Total compressed images: ${base64Images.length}/${images.length}, Total size: ~${Math.round(result.length / 1024)}KB`);
  
  return result;
};

/**
 * Test if a single image can be compressed successfully
 * @param {File} file - The image file to test
 * @returns {Promise<{success: boolean, error?: string, sizeKB?: number, compressionRatio?: number}>} Test result
 */
export const testImageCompression = async (file) => {
  try {
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Invalid file provided' };
    }
    
    const originalSizeKB = file.size / 1024;
    const targetSizeKB = 13; // Target 13KB per image
    
    // Test compression with dynamic target size
    const base64 = await compressImage(file, 0.6, 0.5, targetSizeKB);
    
    // Check if compression actually worked (not empty or too small)
    if (!base64 || base64.length < 100) {
      console.error('Compression resulted in empty or invalid output');
      return { 
        success: false, 
        error: 'Image could not be processed. Please try a different image.'
      };
    }
    
    const compressedSizeKB = base64.length / 1024;
    const compressionRatio = (originalSizeKB / compressedSizeKB).toFixed(2);
    
    // Check if we achieved reasonable compression
    if (compressedSizeKB <= targetSizeKB * 1.5) { // Allow 50% margin
      return { 
        success: true,
        sizeKB: Math.round(compressedSizeKB),
        compressionRatio: compressionRatio,
        message: `Successfully compressed from ${Math.round(originalSizeKB)}KB to ${Math.round(compressedSizeKB)}KB (${compressionRatio}x reduction)`
      };
    } else {
      return { 
        success: false, 
        error: `Could not compress image enough. Got ${Math.round(compressedSizeKB)}KB, target was ${targetSizeKB}KB. Try a smaller or simpler image.`,
        sizeKB: Math.round(compressedSizeKB),
        compressionRatio: compressionRatio
      };
    }
    
  } catch (error) {
    console.error('Image compression test failed:', error);
    // Provide more specific error message for debugging
    let errorMessage = 'Failed to process image. ';
    if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please try a different image or smaller file size.';
    }
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

/**
 * Check if images need compression based on total size
 * @param {File[]} images - Array of image files
 * @returns {Promise<boolean>} True if compression is needed
 */
export const needsCompression = async (images) => {
  if (!images || images.length === 0) {
    return false;
  }
  
  let totalSize = 0;
  for (const image of images) {
    if (image instanceof File) {
      totalSize += image.size;
    }
  }
  
  // If total size > 100KB, compression is definitely needed
  return totalSize > 100 * 1024;
};

/**
 * Get image dimensions from a File object
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export const getImageDimensions = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Export default object with all functions
export default {
  compressImage,
  compressMultipleImages,
  needsCompression,
  getImageDimensions
};
