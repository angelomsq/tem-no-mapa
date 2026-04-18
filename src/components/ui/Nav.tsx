import { useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavLink {
  to: string
  label: string
  active?: boolean
}

interface NavProps {
  links: NavLink[]
}

export function Nav({ links }: NavProps) {
  const location = useLocation()
  
  return (
    <nav className="flex items-center gap-8">
      {links.map(link => {
        const isActive = link.active || location.pathname === link.to
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-[#009C3B]'
                : 'text-[#6b7280] hover:text-[#1c1b1b]'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

interface UserMenuProps {
  name?: string | null
  avatarUrl?: string | null
  onSignOut: () => void
}

export function UserMenu({ name, avatarUrl, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleMouseEnter() {
    setIsOpen(true)
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    const relatedTarget = event.relatedTarget
    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) {
      return
    }
    setIsOpen(false)
  }

  const displayName = name || 'Usuário'
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#f6f3f2] transition-colors">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#009C3B] flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-[#1c1b1b]">{displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-2 z-50">
          <Link 
            to="/profile"
            className="block px-4 py-2 text-sm text-[#1c1b1b] hover:bg-[#f6f3f2]"
          >
            Meu Perfil
          </Link>
          <button 
            onClick={onSignOut}
            className="w-full text-left px-4 py-2 text-sm text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}