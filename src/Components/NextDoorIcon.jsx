import React from 'react'

const NextDoorIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2L3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-9-5z"/>
    <path d="M12 4.5L5 8.5v8.5h14V8.5l-7-4z" fill="currentColor" opacity="0.8"/>
    <circle cx="8" cy="13" r="1.5" fill="white"/>
    <circle cx="16" cy="13" r="1.5" fill="white"/>
    <path d="M10 15h4v2h-4z" fill="white"/>
  </svg>
)

export default NextDoorIcon
