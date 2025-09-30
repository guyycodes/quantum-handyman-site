import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'eager', // Changed default to eager for immediate loading
  onError,
  ...props 
}) => {
  // Force image to load immediately
  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={onError}
      fetchpriority="high" // Add high priority for critical images
      {...props}
    />
  );
};


export default OptimizedImage;