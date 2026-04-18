import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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

  return (
    <div className="h-[calc(100vh-73px)]">
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
    </div>
  )
}