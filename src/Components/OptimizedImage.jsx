import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onError,
  preferThumb = false, // Use thumb version if available
  ...props 
}) => {
  const [failedSources, setFailedSources] = useState(new Set());
  
  // Generate optimized paths
  const pathWithoutExt = src.replace(/\.[^/.]+$/, '');
  const extension = src.match(/\.[^/.]+$/)?.[0] || '';
  
  // Check for different optimization patterns
  const webpSrc = `${pathWithoutExt}-optimized.webp`;
  const optimizedSrc = `${pathWithoutExt}-optimized${extension}`;
  const thumbSrc = `${pathWithoutExt}-thumb${extension}`;
  
  // Use thumb version for smaller images if preferred
  const fallbackSrc = preferThumb ? thumbSrc : optimizedSrc;
  
  // If we've already failed to load optimized versions, go straight to original
  const imgSrc = failedSources.has(fallbackSrc) ? src : fallbackSrc;
  
  return (
    <picture>
      {/* WebP version for modern browsers - only if we haven't failed */}
      {!failedSources.has(webpSrc) && (
        <source 
          srcSet={webpSrc} 
          type="image/webp"
          onError={() => {
            setFailedSources(prev => new Set([...prev, webpSrc]));
          }}
        />
      )}
      
      {/* Optimized original format as fallback */}
      <img 
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={(e) => {
          const currentSrc = e.target.src;
          
          // Track this failed source
          setFailedSources(prev => new Set([...prev, currentSrc]));
          
          // If current source is not the original, fall back to original
          if (!currentSrc.endsWith(src) && currentSrc !== src) {
            e.target.src = src;
          } else if (onError) {
            // If even the original fails, call the provided error handler
            onError(e);
          }
        }}
        {...props}
      />
    </picture>
  );
};


export default OptimizedImage;