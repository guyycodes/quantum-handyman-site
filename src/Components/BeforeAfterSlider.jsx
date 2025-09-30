import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

const BeforeAfterSlider = ({ 
  beforeImage, 
  afterImage, 
  beforeAlt = 'Before', 
  afterAlt = 'After',
  height = 'h-72',
  showLabels = true,
  showInstruction = true,
  containerClassName = ''
}) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }
  
  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }
  
  const handleMouseLeave = () => {
    setSliderPosition(50)
  }

  return (
    <div 
      className={`relative w-full ${height} overflow-hidden cursor-ew-resize bg-gradient-to-br from-gray-50 to-gray-100 ${containerClassName}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <OptimizedImage
          src={beforeImage}
          alt={beforeAlt}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          loading="lazy"
        />
      </div>
      
      {/* After Image (revealed by slider) */}
      <div 
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <OptimizedImage
            src={afterImage}
            alt={afterAlt}
            className="max-w-full max-h-full object-contain pointer-events-none select-none"
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Slider Line and Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
        style={{ 
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)'
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary/20">
            <div className="flex">
              <ChevronRight className="w-4 h-4 text-primary -mr-2 rotate-180" />
              <ChevronRight className="w-4 h-4 text-primary -ml-2" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm pointer-events-none">
            BEFORE
          </div>
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm pointer-events-none">
            AFTER
          </div>
        </>
      )}
      
      {/* Instruction */}
      {showInstruction && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none">
          ↔ Drag to compare
        </div>
      )}
    </div>
  )
}

export default BeforeAfterSlider
