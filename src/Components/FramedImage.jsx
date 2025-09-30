import React from 'react'
import OptimizedImage from '../Components/OptimizedImage'

const FramedImage = ({ 
  src, 
  alt = 'Image',
  className = '',
  frameStyle = 'modern', // modern, classic, minimal, shadow
  aspectRatio = 'auto', // auto, square, portrait, landscape, custom
  customRatio = '2/3',
  objectFit = 'cover', // cover, contain, fill, none, scale-down
  rounded = 'xl', // none, sm, md, lg, xl, 2xl, 3xl, full
  shadow = true,
  overlay = true, // adds a subtle gradient overlay
  border = false,
  borderColor = 'border-gray-200',
  padding = 0,
  background = 'bg-gray-100',
  hover = true, // adds hover effects
  maxWidth = '', // e.g., 'max-w-md', 'max-w-lg', etc.
  maxHeight = '', // e.g., 'max-h-96', 'max-h-[400px]', etc.
  width = '', // e.g., 'w-full', 'w-96', 'w-[300px]'
  height = '', // e.g., 'h-96', 'h-[400px]'
  caption = '',
  captionPosition = 'bottom', // bottom, overlay-bottom
  preferThumb = true // Use thumbnail version for better performance
}) => {
  
  // Define aspect ratio classes
  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    custom: `aspect-[${customRatio}]`
  }

  // Define rounded classes
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }

  // Define frame styles
  const frameStyles = {
    modern: `${shadow ? 'shadow-lg' : ''} ${hover ? 'hover:shadow-2xl transition-shadow duration-300' : ''} overflow-hidden`,
    classic: `${border ? `border-4 ${borderColor}` : ''} ${shadow ? 'shadow-xl' : ''} ${hover ? 'hover:shadow-2xl transition-all duration-300' : ''} overflow-hidden`,
    minimal: 'overflow-hidden',
    shadow: 'shadow-2xl overflow-hidden'
  }

  // Combine all image wrapper classes
  const imageWrapperClasses = `
    relative 
    ${aspectRatio !== 'auto' ? aspectRatioClasses[aspectRatio] : ''} 
    ${roundedClasses[rounded]}
    ${frameStyles[frameStyle]}
    ${background}
    ${padding ? `p-${padding}` : ''}
    ${maxWidth}
    ${maxHeight}
    ${width}
    ${height}
    ${className}
  `.trim()

  // Image classes
  const imageClasses = `
    w-full 
    h-full 
    ${aspectRatio !== 'auto' ? 'absolute inset-0' : ''}
    object-${objectFit}
    ${roundedClasses[rounded]}
    ${hover ? 'transition-transform duration-300 group-hover:scale-105' : ''}
  `.trim()

  return (
    <figure className={`${width || 'w-full'}`}>
      <div className={`${imageWrapperClasses} group`}>
        <OptimizedImage 
          src={src} 
          alt={alt}
          className={imageClasses}
          loading="lazy"
          preferThumb={preferThumb}
        />
        
        {/* Optional overlay */}
        {overlay && (
          <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none ${roundedClasses[rounded]}`} />
        )}
        
        {/* Caption overlay */}
        {caption && captionPosition === 'overlay-bottom' && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent ${roundedClasses[rounded]}`}>
            <p className="text-white text-sm font-medium">{caption}</p>
          </div>
        )}
      </div>
      
      {/* Caption below image */}
      {caption && captionPosition === 'bottom' && (
        <figcaption className="mt-3 text-center text-sm text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default FramedImage
