import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ESTADOS } from '@/types'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Location {
  id: string
  user_id: string
  latitude: number
  longitude: number
  city: string
  country: string
  state: string
}

interface MapProps {
  locations: Location[]
  selectedState: string
  onStateSelect: (state: string) => void
}

function MapController({ selectedState }: { selectedState: string }) {
  const map = useMap()

  useEffect(() => {
    if (selectedState) {
      const stateCoords: Record<string, [number, number]> = {
        SP: [-23.5, -46.6],
        RJ: [-22.9, -43.2],
        MG: [-19.9, -43.9],
        RS: [-30.0, -51.2],
        PR: [-24.0, -52.0],
        BA: [-12.9, -38.5],
        PE: [-8.4, -35.0],
        CE: [-5.2, -39.3],
      }
      const coords = stateCoords[selectedState]
      if (coords) {
        map.flyTo(coords, 6, { duration: 1 })
      } else if (selectedState.length === 2) {
        const estado = ESTADOS.find(e => e.codigo === selectedState)
        if (estado) {
          // Default to Brazil view for unknown states
          map.flyTo([-15.0, -55.0], 5, { duration: 1 })
        }
      }
    }
  }, [selectedState, map])

  return null
}

export default function LeafletMap({ locations, selectedState, onStateSelect }: MapProps) {
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    setMapKey(k => k + 1)
  }, [selectedState])

  // Group locations by country for stats
  const countryCounts = locations.reduce((acc, loc) => {
    acc[loc.country] = (acc[loc.country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-white border-r border-[#e5e4e7] p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4">Filtrar por Estado</h2>
        
        <select
          value={selectedState}
          onChange={(e) => onStateSelect(e.target.value)}
          className="w-full p-2 border border-[#e5e4e7] rounded-lg mb-4"
        >
          <option value="">Todos os estados</option>
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
              <span className="text-[#6b6375]">0 brasileiros</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#81C784]"></span>
              <span className="text-[#6b6375]">1-4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span>
              <span className="text-[#6b6375]">5-14</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E7D32]"></span>
              <span className="text-[#6b6375]">15-29</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1B5E20]"></span>
              <span className="text-[#6b6375]">30+</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Por País</h3>
          <div className="space-y-1">
            {Object.entries(countryCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([country, count]) => (
                <div key={country} className="flex justify-between text-sm py-1 border-b border-[#f0f0f0]">
                  <span className="text-[#6b6375]">{country}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 relative">
        <MapContainer
          key={mapKey}
          center={[20, 0]}
          zoom={3}
          className="h-full w-full"
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController selectedState={selectedState} />
          
          {locations.map(location => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
            >
              <Popup>
                <div className="text-center">
                  <strong>{location.city}</strong>
                  <br />
                  <span className="text-sm text-[#6b6375]">{location.country}</span>
                  {location.state && (
                    <>
                      <br />
                      <span className="text-sm">Origem: {location.state}</span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm z-[1000]">
          <span className="text-[#6b6375]">{locations.length} brasileiros no mapa</span>
        </div>
      </div>
    </div>
  )
}