import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl p-6'
    
    const variants = {
      default: 'bg-white',
      elevated: 'bg-white shadow-[0_8px_24px_rgba(28,27,25,0.06)]',
      outlined: 'bg-white border border-[#bdcab9]/20',
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card