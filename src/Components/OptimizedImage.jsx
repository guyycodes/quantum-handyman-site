import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onError,
  ...props 
}) => {
  // Generate WebP path
  const pathWithoutExt = src.replace(/\.[^/.]+$/, '');
  const webpSrc = `${pathWithoutExt}-optimized.webp`;
  
  return (
    <picture>
      {/* Try WebP version first */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Fallback to original */}
      <img 
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onError={onError}
        {...props}
      />
    </picture>
  );
};


export default OptimizedImage;