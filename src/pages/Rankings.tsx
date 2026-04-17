import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ESTADOS, PAISES } from '@/types'

interface RankingEntry {
  id: string
  rank_type: string
  entity_name: string
  entity_code: string
  position: number
  score: number
}

export default function Rankings() {
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('country')

  useEffect(() => {
    async function loadRankings() {
      const client = supabase
      if (!client) return

      const { data } = await client
        .from('rankings')
        .select('*')
        .eq('rank_type', filter)
        .order('position', { ascending: true })
        .limit(20)

      setRankings(data as RankingEntry[] || [])
      setLoading(false)
    }

    loadRankings()
  }, [filter])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ranking</h2>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('country')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'country'
              ? 'bg-[#009C3B] text-white'
              : 'bg-white border border-[#e5e4e7]'
          }`}
        >
          Por País
        </button>
        <button
          onClick={() => setFilter('state')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'state'
              ? 'bg-[#009C3B] text-white'
              : 'bg-white border border-[#e5e4e7]'
          }`}
        >
          Por Estado
        </button>
        <button
          onClick={() => setFilter('city')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'city'
              ? 'bg-[#009C3B] text-white'
              : 'bg-white border border-[#e5e4e7]'
          }`}
        >
          Por Cidade
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center p-8 text-[#6b6375]">
          Nenhum ranking disponível ainda
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e5e4e7] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f6f3f2]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#6b6375]">Posição</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#6b6375]">
                  {filter === 'country' ? 'País' : filter === 'state' ? 'Estado' : 'Cidade'}
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#6b6375]">Brasileiros</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry, index) => (
                <tr key={entry.id} className="border-t border-[#e5e4e7]">
                  <td className="px-4 py-3">
                    <span className="text-lg">
                      {index < 3 ? medals[index] : `#${entry.position}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {filter === 'country' 
                      ? PAISES[entry.entity_code] || entry.entity_name
                      : filter === 'state'
                      ? `${entry.entity_code} - ${ESTADOS.find(e => e.codigo === entry.entity_code)?.nome || entry.entity_name}`
                      : entry.entity_name
                    }
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#009C3B]">
                    {entry.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}