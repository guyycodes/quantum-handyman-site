import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onError,
  ...props 
}) => {
  // Just use the original image - no optimization attempt
  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={onError}
      {...props}
    />
  );
};


export default OptimizedImage;