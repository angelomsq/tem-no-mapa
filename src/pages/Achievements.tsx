import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: string
}

interface UserBadge {
  id: string
  badge_type: string
  badge_name: string
  earned_at: string
}

export default function Achievements() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBadges() {
      const client = supabase
      if (!client) return

      const { data: allBadges } = await client.from('badges').select('*')
      setBadges(allBadges as Badge[] || [])

      if (user) {
        const { data: earned } = await client
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
        setUserBadges(earned as UserBadge[] || [])
      }

      setLoading(false)
    }

    loadBadges()
  }, [user])

  const earnedIds = userBadges.map(ub => ub.badge_type)

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-100 border-gray-300',
    rare: 'bg-blue-100 border-blue-300',
    epic: 'bg-purple-100 border-purple-300',
    legendary: 'bg-yellow-100 border-yellow-300',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Conquistas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map(badge => {
          const earned = earnedIds.includes(badge.id)
          
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 ${
                earned 
                  ? rarityColors[badge.rarity] + ' opacity-100'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className="font-medium text-sm">{badge.name}</h3>
              <p className="text-xs text-[#6b6375] mt-1">{badge.description}</p>
              
              {earned && (
                <span className="text-xs text-[#009C3B] font-medium mt-2 block">
                  Conquistado
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-2">Estatísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#e5e4e7]">
            <div className="text-2xl font-bold text-[#009C3B]">{userBadges.length}</div>
            <div className="text-sm text-[#6b6375]">Badges</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#e5e4e7]">
            <div className="text-2xl font-bold text-[#009C3B]">
              {badges.length - userBadges.length}
            </div>
            <div className="text-sm text-[#6b6375]">Restantes</div>
          </div>
        </div>
      </div>
    </div>
  )
}