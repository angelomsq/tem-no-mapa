import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import LeafletMap from '@/components/LeafletMap'
import { MapPin, Globe, Lightbulb, ArrowRight, ChevronDown, Users } from 'lucide-react'
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

interface CityStats {
  city: string
  country: string
  count: number
}

const topCities: CityStats[] = [
  { city: 'Miami', country: 'USA', count: 300000 },
  { city: 'Lisbon', country: 'PT', count: 250000 },
  { city: 'London', country: 'UK', count: 180000 },
  { city: 'Hamamatsu', country: 'JP', count: 200000 },
]

const statesOrigin = [
  { state: 'São Paulo', percentage: 28 },
  { state: 'Rio de Janeiro', percentage: 15 },
  { state: 'Minas Gerais', percentage: 12 },
]

export default function Map() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState<string>('')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showInsights, setShowInsights] = useState(true)

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
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">
            The Global Neighborhood
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setShowInsights(false)} className="text-sm font-medium text-[#009C3B]">Map</button>
            <button className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Communities</button>
            <button className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Directory</button>
            <button className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Events</button>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-[#009C3B] text-white rounded-lg text-sm font-medium">
              Join Community
            </Link>
          </div>
        </div>
      </header>

      {showInsights && (
        <section className="py-12 px-6 bg-[#1c1b1b]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[Plus_Jakarta_Sans]">
                  Global Insights
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed">
                  A Community Without Borders.<br />
                  Mapping over 4.5 million Brazilians living abroad. Explore the density of our diaspora and find where your state of origin has settled.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded-lg text-sm"
                  >
                    <option value="">Todos os Estados</option>
                    {ESTADOS.map(estado => (
                      <option key={estado.codigo} value={estado.codigo}>
                        {estado.codigo} - {estado.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {topCities.map((city, index) => (
                <div key={index} className="bg-[#2a2a2a] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#009C3B]" />
                    <span className="text-white font-medium">{city.city}</span>
                    <span className="text-gray-500 text-sm">{city.country}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#009C3B]">
                    {city.count.toLocaleString()}+
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">BRAZILIAN DENSITY</h3>
              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#009C3B]/20"></div>
                  <span className="text-gray-400 text-sm">Low Density</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#009C3B]/50"></div>
                  <span className="text-gray-400 text-sm">Emerging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#009C3B]"></div>
                  <span className="text-gray-400 text-sm">High Density</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Shaded regions represent the estimated population of Brazilian citizens and descendants per country.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-[#009C3B]" />
                  <span className="text-gray-400">Global Total</span>
                </div>
                <p className="text-3xl font-bold text-white">4,500,000+</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-[#009C3B]" />
                  <span className="text-gray-400">Top Destination</span>
                </div>
                <p className="text-3xl font-bold text-white">United States</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#FFDF00]" />
                  <span className="text-gray-400">Regional Spotlight</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  The European Connection
                </p>
                <p className="text-sm text-gray-400">
                  Portugal remains the leading destination in Europe, with over 250,000 residents. Recent years have seen a 20% surge in the professional diaspora moving to Lisbon and Porto.
                </p>
                <button className="flex items-center gap-2 mt-3 text-[#009C3B] text-sm hover:underline">
                  Explore Europe Map <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">States of Origin</h3>
                <div className="space-y-3">
                  {statesOrigin.map((state, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-gray-400 w-32">{state.state}</span>
                      <div className="flex-1 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#009C3B] rounded-full" style={{ width: `${state.percentage}%` }}></div>
                      </div>
                      <span className="text-white font-medium">{state.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-6 h-6 text-[#FFDF00]" />
                  <span className="text-gray-400">Did you know?</span>
                </div>
                <p className="text-sm text-gray-300">
                  The city of Framingham, MA has one of the highest densities of Brazilians per capita in the United States.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowInsights(false)}
                className="flex items-center gap-2 text-[#009C3B] hover:underline"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {!showInsights && (
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
      )}
    </div>
  )
}