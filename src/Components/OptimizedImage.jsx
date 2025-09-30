import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onError,
  preferThumb = false, // Use thumb version if available
  ...props 
}) => {
  // Generate optimized paths
  const pathWithoutExt = src.replace(/\.[^/.]+$/, '');
  const extension = src.match(/\.[^/.]+$/)?.[0] || '';
  
  // Check for different optimization patterns
  const webpSrc = `${pathWithoutExt}-optimized.webp`;
  const optimizedSrc = `${pathWithoutExt}-optimized${extension}`;
  const thumbSrc = `${pathWithoutExt}-thumb${extension}`;
  
  // Use thumb version for smaller images if preferred
  const fallbackSrc = preferThumb ? thumbSrc : optimizedSrc;
  
  return (
    <picture>
      {/* WebP version for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Optimized original format as fallback */}
      <img 
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={(e) => {
          // Try multiple fallbacks: optimized -> thumb -> original
          if (e.target.src === fallbackSrc && fallbackSrc !== src) {
            // If preferred fallback fails, try the other optimization
            e.target.src = preferThumb ? optimizedSrc : thumbSrc;
          } else if (e.target.src !== src) {
            // Finally fall back to original
            e.target.src = src;
          } else if (onError) {
            onError(e);
          }
        }}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;