import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import LeafletMap from '@/components/LeafletMap'

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
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState<string>('')
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

  function handleSignOut() {
    supabase?.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="flex items-center justify-between p-4 bg-white border-b border-[#e5e4e7]">
        <h1 className="text-xl font-semibold text-[#009C3B]">Tem no Mapa</h1>
        
        <nav className="flex items-center gap-6">
          <Link to="/map" className="text-[#009C3B] font-medium">Mapa</Link>
          <Link to="/achievements" className="text-[#6b6375]">Conquistas</Link>
          <Link to="/rankings" className="text-[#6b6375]">Ranking</Link>
          <Link to="/invite" className="text-[#6b6375]">Convidar</Link>
          <Link to="/profile" className="text-[#6b6375]">Perfil</Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6b6375]">{profile?.full_name || user?.email}</span>
          <button 
            onClick={handleSignOut}
            className="text-sm text-[#6b6375] hover:text-[#009C3B]"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-64px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
          </div>
        ) : (
          <LeafletMap
            locations={locations}
            selectedState={filter}
            onStateSelect={setFilter}
          />
        )}
      </main>
    </div>
  )
}