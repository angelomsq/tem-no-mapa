import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './Nav'

interface LayoutProps {
  children: ReactNode
}

const navLinks = [
  { to: '/map', label: 'Mapa' },
  { to: '/achievements', label: 'Conquistas' },
  { to: '/rankings', label: 'Ranking' },
  { to: '/missions', label: 'Missões' },
  { to: '/invite', label: 'Convidar' },
  { to: '/verification', label: 'Verificação' },
]

export default function Layout({ children }: LayoutProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await supabase?.auth.signOut()
    navigate('/login')
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50 border-b border-[#bdcab9]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/map" className="text-xl font-bold text-[#009C3B]">
            Tem no Mapa
          </Link>
          
          <nav className="flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#009C3B]'
                    : 'text-[#6b7280] hover:text-[#1c1b1b]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'text-[#009C3B]'
                    : 'text-[#6b7280] hover:text-[#1c1b1b]'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <UserMenu
            name={profile?.full_name}
            avatarUrl={profile?.avatar_url}
            onSignOut={handleSignOut}
          />
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}