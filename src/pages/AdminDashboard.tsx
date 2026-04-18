import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface DashboardStats {
  total_users: number
  total_locations: number
  verified_users: number
  ambassadors: number
}

interface RecentUser {
  id: string
  full_name: string
  country: string
  created_at: string
}

export default function AdminDashboard() {
  const { profile, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_locations: 0,
    verified_users: 0,
    ambassadors: 0,
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])

  console.log('[AdminDashboard] profile:', profile)
  console.log('[AdminDashboard] loading:', loading)
  console.log('[AdminDashboard] role:', profile?.role)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/map" replace />
  }

  useEffect(() => {
    async function loadDashboard() {
      const client = supabase
      if (!client) return

      const [profiles, locations, verified, ambassadors] = await Promise.all([
        client.from('profiles').select('id', { count: 'exact', head: true }),
        client.from('user_locations').select('id', { count: 'exact', head: true }),
        client.from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        client.from('profiles').select('id', { count: 'exact', head: true }).eq('is_ambassador', true),
      ])

      setStats({
        total_users: profiles.count || 0,
        total_locations: locations.count || 0,
        verified_users: verified.count || 0,
        ambassadors: ambassadors.count || 0,
      })

      const { data: recent } = await client
        .from('profiles')
        .select('id, full_name, country, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentUsers(recent as RecentUser[] || [])
    }

    loadDashboard()
  }, [])

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50 border-b border-[#bdcab9]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/map" className="text-xl font-bold text-[#009C3B]">Tem no Mapa</Link>
          <nav className="flex items-center gap-6">
            <Link to="/map" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Mapa</Link>
            <Link to="/profile" className="text-sm font-medium text-[#009C3B]">Perfil</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">Dashboard Admin</h1>
        <p className="text-[#6b6375] mb-8">Visão geral da plataforma</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-[#e5e4e7]">
            <div className="text-3xl font-bold text-[#009C3B]">{stats.total_users}</div>
            <div className="text-sm text-[#6b6375]">Total Usuários</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#e5e4e7]">
            <div className="text-3xl font-bold text-[#009C3B]">{stats.total_locations}</div>
            <div className="text-sm text-[#6b6375]">Locais Cadastrados</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#e5e4e7]">
            <div className="text-3xl font-bold text-[#009C3B]">{stats.verified_users}</div>
            <div className="text-sm text-[#6b6375]">Verificados</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#e5e4e7]">
            <div className="text-3xl font-bold text-[#009C3B]">{stats.ambassadors}</div>
            <div className="text-sm text-[#6b6375]">Embaixadores</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e4e7] overflow-hidden">
          <div className="px-6 py-4 bg-[#f6f3f2] border-b border-[#e5e4e7]">
            <h2 className="font-semibold">Usuários Recentes</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b6375]">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b6375]">País</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b6375]">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-t border-[#e5e4e7]">
                  <td className="px-6 py-3">{user.full_name || '-'}</td>
                  <td className="px-6 py-3">{user.country || '-'}</td>
                  <td className="px-6 py-3 text-[#6b6375]">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}