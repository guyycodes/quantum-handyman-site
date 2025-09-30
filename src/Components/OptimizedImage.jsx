import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onError,
  ...props 
}) => {
  // Generate optimized paths
  const pathWithoutExt = src.replace(/\.[^/.]+$/, '');
  const extension = src.match(/\.[^/.]+$/)?.[0] || '';
  
  const webpSrc = `${pathWithoutExt}-optimized.webp`;
  const optimizedSrc = `${pathWithoutExt}-optimized${extension}`;
  
  return (
    <picture>
      {/* WebP version for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Optimized original format as fallback */}
      <img 
        src={optimizedSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={(e) => {
          // If optimized version fails, fall back to original
          if (e.target.src !== src) {
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