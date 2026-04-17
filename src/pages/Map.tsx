import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import LeafletMap from '@/components/LeafletMap'
import { Button } from '@/components/ui'

interface Location {
  id: string
  user_id: string
  latitude: number
  longitude: number
  city: string
  country: string
  state: string
}

export default function Map() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState<string>('')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLocations() {
      if (!supabase) return

      let query = supabase.from('user_locations').select('*')
      
      if (filter) {
        query = query.eq('state', filter)
      }

      const { data } = await query
      setLocations(data as Location[] || [])
      setLoading(false)
    }

    loadLocations()
  }, [filter])

  async function handleSignOut() {
    await supabase?.auth.signOut()
    navigate('/login')
  }

  const navLinks = [
    { to: '/map', label: 'Mapa', active: true },
    { to: '/achievements', label: 'Conquistas' },
    { to: '/rankings', label: 'Ranking' },
    { to: '/invite', label: 'Convidar' },
    { to: '/verification', label: 'Verificação' },
    { to: '/profile', label: 'Perfil' },
    ...(profile?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ]

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
                  link.active
                    ? 'text-[#009C3B]'
                    : 'text-[#6b7280] hover:text-[#1c1b1b]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-sm text-[#6b7280]">
              {profile?.full_name || user?.email?.split('@')[0]}
            </div>
            <Button variant="tertiary" size="sm" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
          </div>
        ) : (
          <div className="relative">
            <LeafletMap
              locations={locations}
              selectedState={filter}
              onStateSelect={setFilter}
              showHeatmap={showHeatmap}
            />
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="absolute top-4 right-4 z-[1000] px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium"
            >
              {showHeatmap ? 'Mostrar Pinos' : 'Mostrar Calor'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}