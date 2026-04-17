import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Mission {
  id: string
  title: string
  description: string
  target_type: string
  target_count: number
  week_start: string
  week_end: string
}

interface UserMission {
  mission_id: string
  progress: number
  completed: boolean
  claimed_at: string | null
}

export default function Missions() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [userMissions, setUserMissions] = useState<Record<string, UserMission>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMissions() {
      const client = supabase
      if (!client) return

      const now = new Date().toISOString().split('T')[0]
      const { data: allMissions } = await client
        .from('weekly_missions')
        .select('*')
        .lte('week_start', now)
        .gte('week_end', now)
        .order('id')

      setMissions(allMissions as Mission[] || [])

      if (user) {
        const { data: progress } = await client
          .from('user_missions')
          .select('*')
          .eq('user_id', user.id)

        const progressMap: Record<string, UserMission> = {}
        progress?.forEach(p => {
          progressMap[p.mission_id] = p
        })
        setUserMissions(progressMap)
      }

      setLoading(false)
    }

    loadMissions()
  }, [user])

  const targetIcons: Record<string, string> = {
    locations: '📍',
    referrals: '👥',
    votes: '🗳️',
    verification: '✅',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50 border-b border-[#bdcab9]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/map" className="text-xl font-bold text-[#009C3B]">Tem no Mapa</Link>
          <nav className="flex items-center gap-6">
            <Link to="/map" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Mapa</Link>
            <Link to="/achievements" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Conquistas</Link>
            <Link to="/profile" className="text-sm font-medium text-[#009C3B]">Perfil</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">Missões Semanais</h1>
        <p className="text-[#6b6375] mb-8">
          Complete missões toda semana para ganhar recompensas!
        </p>

        {missions.length === 0 ? (
          <div className="text-center p-8 text-[#6b6375]">
            Nenhuma missão disponível esta semana
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map(mission => {
              const userMission = userMissions[mission.id]
              const currentProgress = userMission?.progress || 0
              const target = mission.target_count
              const percent = Math.min((currentProgress / target) * 100, 100)
              const isCompleted = userMission?.completed || false
              const weekEnd = new Date(mission.week_end)
              const daysLeft = Math.ceil((weekEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

              return (
                <div
                  key={mission.id}
                  className={`bg-white rounded-xl p-6 border ${
                    isCompleted
                      ? 'border-[#009C3B]/30 bg-[#009C3B]/5'
                      : 'border-[#e5e4e7]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{targetIcons[mission.target_type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">{mission.title}</h3>
                        {isCompleted && (
                          <span className="px-3 py-1 bg-[#009C3B] text-white text-sm rounded-full">
                            Conquistado
                          </span>
                        )}
                      </div>
                      <p className="text-[#6b6375] mb-3">{mission.description}</p>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#6b6375]">
                            {currentProgress} / {target}
                          </span>
                          <span className="text-[#6b6375]">
                            {daysLeft} dias restantes
                          </span>
                        </div>
                        <div className="h-2 bg-[#e5e4e7] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#009C3B] to-[#008732] rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {!isCompleted && currentProgress >= target && (
                        <button
                          className="mt-3 px-4 py-2 bg-[#009C3B] text-white rounded-lg font-medium text-sm"
                          onClick={async () => {
                            const client = supabase
                            if (!client || !user) return

                            await client.from('user_missions').upsert({
                              user_id: user.id,
                              mission_id: mission.id,
                              progress: currentProgress,
                              completed: true,
                              claimed_at: new Date().toISOString(),
                            })

                            setUserMissions(prev => ({
                              ...prev,
                              [mission.id]: {
                                mission_id: mission.id,
                                progress: currentProgress,
                                completed: true,
                                claimed_at: new Date().toISOString(),
                              },
                            }))
                          }}
                        >
                          Receber Recompensa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}