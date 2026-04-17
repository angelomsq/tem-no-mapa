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

export function UserNav({ name, onSignOut }: { name?: string | null; onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[#6b7280]">{name || 'Usuário'}</span>
      <button 
        onClick={onSignOut}
        className="text-sm text-[#6b7280] hover:text-[#009C3B] font-medium"
      >
        Sair
      </button>
    </div>
  )
}