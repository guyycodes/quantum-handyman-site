import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import BookingModal from './BookingModal'

// Content Management - All text content in one place
const CONTENT = {
  defaultButtonText: 'Book Service',
  ariaLabel: 'Book {service} with Quantum Handyman',
  defaultService: 'a service',
  defaultHelperText: '⚡ Instant AI estimates available'
}

const BookingCTA = ({
  service = null,
  buttonText = CONTENT.defaultButtonText,
  buttonStyle = 'primary',
  size = 'md',
  className = '',
  showHelperText = false,
  helperText = CONTENT.defaultHelperText,
  onClick = null // Optional callback when button is clicked
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const styleClasses = {
    primary: 'bg-primary text-white hover:bg-blue-600 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-green-600 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
  }

  const handleClick = () => {
    if (onClick) onClick() // Call optional callback
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  
  return (
    <>
      <div className={showHelperText ? 'inline-flex flex-col items-center gap-1' : ''}>
        <button
          onClick={handleClick}
          className={`
            inline-flex items-center justify-center gap-2
            font-semibold rounded-lg transition-all duration-200
            transform hover:scale-105 active:scale-95
            ${sizeClasses[size]}
            ${styleClasses[buttonStyle]}
            ${className}
          `}
          aria-label={CONTENT.ariaLabel.replace('{service}', service || CONTENT.defaultService)}
        >
          <Calendar className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
          <span>{buttonText}</span>
        </button>
        {showHelperText && (
          <span className="text-xs text-green-600 dark:text-green-400 animate-pulse">
            {helperText}
          </span>
        )}
      </div>
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        initialService={service}
      />
    </>
  )
}

export default BookingCTA