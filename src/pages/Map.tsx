import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { ESTADOS } from '@/types'

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
  const mapRef = useRef<HTMLDivElement>(null)
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

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="flex items-center justify-between p-4 bg-white border-b border-[#e5e4e7]">
        <h1 className="text-xl font-semibold text-[#009C3B]">Tem no Mapa</h1>
        
        <nav className="flex items-center gap-6">
          <Link to="/map" className="text-[#009C3B] font-medium">Mapa</Link>
          <Link to="/profile" className="text-[#6b6375]">Perfil</Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6b6375]">{profile?.full_name || user?.email}</span>
        </div>
      </header>

      <main className="flex">
        <aside className="w-64 p-4 bg-white border-r border-[#e5e4e7]">
          <h2 className="font-medium mb-4">Filtrar por Estado</h2>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border border-[#e5e4e7] rounded-lg"
          >
            <option value="">Todos</option>
            {ESTADOS.map(estado => (
              <option key={estado.codigo} value={estado.codigo}>
                {estado.codigo} - {estado.nome}
              </option>
            ))}
          </select>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Legenda</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E8F5E9]"></span>
                <span className="text-[#6b6375]">0-10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#81C784]"></span>
                <span className="text-[#6b6375]">10-30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span>
                <span className="text-[#6b6375]">30-60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1B5E20]"></span>
                <span className="text-[#6b6375]">&gt;60%</span>
              </div>
            </div>
          </div>
        </aside>

        <div ref={mapRef} className="flex-1 bg-[#e5e4e7] min-h-[calc(100vh-64px)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#6b6375]">
              Nenhum brasileiro encontrado neste filtro
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6b6375]">
              {locations.length} brasileiros encontrados
            </div>
          )}
        </div>
      </main>
    </div>
  )
}