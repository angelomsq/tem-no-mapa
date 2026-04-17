import type { HTMLAttributes, ReactNode } from 'react'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Header({ children, className = '', ...props }: HeaderProps) {
  return (
    <header
      className={`glass sticky top-0 z-50 border-b border-[#bdcab9]/20 ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {children}
      </div>
    </header>
  )
}