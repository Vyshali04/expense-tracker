import React from 'react'
import { clsx } from 'clsx'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }

  return (
    <div className={clsx(
      'loading-spinner border-gray-300 border-t-primary-600 rounded-full animate-spin',
      sizeClasses[size],
      className
    )} />
  )
}

export default LoadingSpinner