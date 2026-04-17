import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1c1b1b] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#f6f3f2] border border-transparent rounded-lg px-4 py-3 text-[#1c1b1b] placeholder-[#6b7280] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#009C3B]/20 focus:shadow-[0_0_0_2px_rgba(0,156,59,0.1)] ${error ? 'border-[#ba1a1a]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ba1a1a]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input