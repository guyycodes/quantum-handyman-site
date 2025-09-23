/**
 * Image Compression Utility
 * Compresses and resizes images for efficient storage in Google Sheets
 */

/**
 * Compress a single image file
 * @param {File} file - The image file to compress
 * @param {number} scaleFactor - Scale factor (0.6 = 60% of original size)
 * @param {number} quality - JPEG quality (0.5 = 50% quality)
 * @returns {Promise<string>} Base64 string without data URL prefix
 */
export const compressImage = async (file, scaleFactor = 0.6, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions
          const newWidth = Math.round(img.width * scaleFactor);
          const newHeight = Math.round(img.height * scaleFactor);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Draw resized image with high quality smoothing
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Convert to JPEG with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // Strip data URL prefix to save space
          const base64Only = compressedBase64.replace(/^data:image\/\w+;base64,/, '');
          
          console.log(`Image compressed: ${img.width}x${img.height} → ${newWidth}x${newHeight}, ` +
                     `Size: ~${Math.round(base64Only.length / 1024)}KB`);
          
          resolve(base64Only);
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
 * @returns {Promise<string>} Comma-separated base64 strings
 */
export const compressMultipleImages = async (images, options = {}) => {
  const {
    scaleFactor = 0.6,
    quality = 0.5,
    maxTotalSize = 45000 // Leave buffer for Google Sheets 50KB limit
  } = options;
  
  if (!images || images.length === 0) {
    return '';
  }
  
  const base64Images = [];
  let totalSize = 0;
  
  for (const image of images) {
    if (image instanceof File) {
      try {
        const compressedBase64 = await compressImage(image, scaleFactor, quality);
        
        // Check if adding this image would exceed our limit
        if (totalSize + compressedBase64.length < maxTotalSize) {
          base64Images.push(compressedBase64);
          totalSize += compressedBase64.length;
        } else {
          console.warn(`Image "${image.name}" skipped - would exceed size limit`);
        }
      } catch (error) {
        console.error(`Failed to compress image "${image.name}":`, error);
        // Continue with other images if one fails
      }
    }
  }
  
  const result = base64Images.join(',');
  console.log(`Total compressed images size: ~${Math.round(result.length / 1024)}KB`);
  
  return result;
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
