import { useState, useEffect, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { 
  LayoutDashboard, Users, CheckSquare, Map, Settings,
  LogOut, Search, Bell, HelpCircle, TrendingUp,
  MapPin, Flag, MoreVertical
} from 'lucide-react'

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

interface Report {
  id: string
  type: string
  description: string
  status: string
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
  const [reports, setReports] = useState<Report[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile])

  useEffect(() => {
    if (!isAdmin) {
      setDataLoading(false)
      return
    }

    async function loadDashboard() {
      if (!supabase) {
        console.error('[AdminDashboard] supabase is null')
        setDataLoading(false)
        return
      }

      try {
        const [profiles, locations, verified, ambassadors] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('user_locations').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_ambassador', true),
        ])

        setStats({
          total_users: profiles.count || 0,
          total_locations: locations.count || 0,
          verified_users: verified.count || 0,
          ambassadors: ambassadors.count || 0,
        })

        const { data: recent } = await supabase
          .from('profiles')
          .select('id, full_name, country, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        setRecentUsers(recent as RecentUser[] || [])

        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setReports(reportsData as Report[] || [])
      } catch (e) {
        console.error('[AdminDashboard] error:', e)
      } finally {
        setDataLoading(false)
      }
    }

    const timer = setTimeout(() => {
      setDataLoading(false)
    }, 5000)

    loadDashboard().finally(() => clearTimeout(timer))
  }, [isAdmin])

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/map" replace />
  }

  const mockReports = [
    { id: '1', type: 'Spam', description: 'Fake business listing in Downtown.', status: 'pending', created_at: new Date().toISOString() },
    { id: '2', type: 'Incorrect Info', description: 'Phone number outdated for Padaria.', status: 'resolved', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', type: 'Inappropriate', description: 'User reported hostile comment.', status: 'pending', created_at: new Date(Date.now() - 172800000).toISOString() },
  ]

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex">
      <aside className="w-64 bg-[#1c1b1b] text-white min-h-screen fixed">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-[#009C3B]" />
            <span className="text-lg font-bold">Tem no Mapa</span>
          </div>
          
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase mb-2 px-3">Admin Portal</p>
            <p className="text-sm font-medium px-3">Community Management</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${activeTab === 'overview' ? 'bg-[#009C3B]' : 'hover:bg-gray-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${activeTab === 'users' ? 'bg-[#009C3B]' : 'hover:bg-gray-800'}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">User Management</span>
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${activeTab === 'moderation' ? 'bg-[#009C3B]' : 'hover:bg-gray-800'}`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm">Content Moderation</span>
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${activeTab === 'statistics' ? 'bg-[#009C3B]' : 'hover:bg-gray-800'}`}
            >
              <Map className="w-5 h-5" />
              <span className="text-sm">Map Statistics</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${activeTab === 'settings' ? 'bg-[#009C3B]' : 'hover:bg-gray-800'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">System Settings</span>
            </button>
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800 text-gray-400">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="glass sticky top-0 z-50 border-b border-[#bdcab9]/20 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1c1b1b] font-[Plus_Jakarta_Sans]">Tem no Mapa Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="search"
                  className="pl-10 pr-4 py-2 bg-[#f6f3f2] rounded-lg text-sm w-64"
                />
              </div>
              <button className="p-2 hover:bg-[#f6f3f2] rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-[#f6f3f2] rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#009C3B] flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1c1b1b] mb-2 font-[Plus_Jakarta_Sans]">Overview</h2>
            <p className="text-[#6b7280]">Platform metrics and community activity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-[#009C3B]" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
              </div>
              <p className="text-3xl font-bold text-[#1c1b1b]">{stats.total_users.toLocaleString()}</p>
              <p className="text-sm text-[#6b7280]">Total Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex items-center justify-between mb-2">
                <MapPin className="w-6 h-6 text-[#009C3B]" />
                <span className="text-sm text-green-600 font-medium">+8%</span>
              </div>
              <p className="text-3xl font-bold text-[#1c1b1b]">{stats.total_locations.toLocaleString()}</p>
              <p className="text-sm text-[#6b7280]">Active Map Pins</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex items-center justify-between mb-2">
                <Flag className="w-6 h-6 text-[#ba1a1a]" />
              </div>
              <p className="text-3xl font-bold text-[#ba1a1a]">{reports.length || 34}</p>
              <p className="text-sm text-[#6b7280]">Reported Content</p>
              <span className="inline-block mt-2 px-2 py-1 bg-[#ba1a1a]/10 text-[#ba1a1a] text-xs rounded-full">Action Needed</span>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-[#009C3B]" />
                <span className="text-sm text-green-600 font-medium">+342</span>
              </div>
              <p className="text-3xl font-bold text-[#1c1b1b]">Today's Growth</p>
              <p className="text-sm text-[#6b7280]">New users today</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#1c1b1b] font-[Plus_Jakarta_Sans]">Map Activity</h3>
                <button className="text-sm text-[#009C3B] font-medium">View Full Map</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#f6f3f2] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#009C3B]"></div>
                    <span className="font-medium text-[#1c1b1b]">High Density</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">United States, Portugal, United Kingdom</p>
                </div>
                <div className="p-4 bg-[#f6f3f2] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFDF00]"></div>
                    <span className="font-medium text-[#1c1b1b]">New Clusters</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">Spain, Germany, Canada</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#bdcab9]/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#1c1b1b] font-[Plus_Jakarta_Sans]">Recent Reports</h3>
                <button className="text-sm text-[#009C3B] font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="flex items-start justify-between p-4 border border-[#bdcab9]/20 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#1c1b1b]">{report.type}</span>
                        <span className="text-xs text-[#6b7280]">
                          {new Date(report.created_at).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-[#6b7280]">{report.description}</p>
                    </div>
                    <button className="p-1 hover:bg-[#f6f3f2] rounded">
                      <MoreVertical className="w-4 h-4 text-[#6b7280]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 border border-[#bdcab9]/20">
            <div className="px-6 py-4 bg-[#f6f3f2] border-b border-[#bdcab9]/20 mb-0">
              <h2 className="font-semibold text-[#1c1b1b]">Recent Users</h2>
            </div>
            <table className="w-full">
              <thead className="bg-[#fafafa]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Country</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-t border-[#bdcab9]/20">
                    <td className="px-6 py-3">{user.full_name || '-'}</td>
                    <td className="px-6 py-3">{user.country || '-'}</td>
                    <td className="px-6 py-3 text-[#6b7280]">
                      {new Date(user.created_at).toLocaleDateString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}