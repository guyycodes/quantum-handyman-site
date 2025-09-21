import React from 'react'
import { Calendar } from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  defaultButtonText: 'Book Service',
  defaultHelperText: 'Powered by Dandymen.io booking platform',
  ariaLabel: 'Book {service} with Quantum Handyman',
  defaultService: 'a service'
}

const BookingCTA = ({
  service = null,
  buttonText = CONTENT.defaultButtonText,
  buttonStyle = 'primary',
  size = 'md',
  referralCode = null,
  className = '',
  showHelperText = true,
  helperText = CONTENT.defaultHelperText,
  helperTextStyle = 'text-xs text-black italic'
}) => {
  const BOOKING_URL = 'https://www.dandymen.io//book?package=THE_TRIM'
  
  const buildBookingURL = () => {
    const url = new URL(BOOKING_URL)
    url.searchParams.set('utm_source', 'website')
    url.searchParams.set('utm_medium', 'cta')
    if (service) url.searchParams.set('service', service)
    if (referralCode) url.searchParams.set('ref', referralCode)
    return url.toString()
  }

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
    // Track click event if needed in the future
    window.open(buildBookingURL(), '_blank')
  }
  
  return (
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
        <span className={helperTextStyle}>
          {helperText}
        </span>
      )}
    </div>
  )
}

export default BookingCTA
