import { useState, useEffect, useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { 
  LayoutDashboard, Users, CheckSquare, Map, Settings,
  LogOut, Search, Bell, HelpCircle, MapPin,
  Filter, UserPlus, MoreVertical, Edit, ChevronLeft, ChevronRight,
  CheckCircle, AlertTriangle, Newspaper
} from 'lucide-react'

export default function UserManagement() {
  const { profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterRole, setFilterRole] = useState('')

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile])

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
    } else if (supabase) {
      setLoading(false)
    }
  }, [isAdmin])

  if (authLoading || loading) {
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

  const mockUsers = [
    { id: '1', full_name: 'Mariana Silva', email: 'mariana.s@example.com', is_verified: true, is_ambassador: true, created_at: '2023-10-12', status: 'verified' as const },
    { id: '2', full_name: 'Lucas Costa', email: 'lucas.costa99@example.com', is_verified: false, is_ambassador: false, created_at: new Date().toISOString(), status: 'new' as const },
    { id: '3', full_name: 'João Pereira', email: 'jp.business@example.com', is_verified: false, is_ambassador: false, created_at: '2023-09-05', status: 'reported' as const },
    { id: '4', full_name: 'Ana Clara', email: 'ana.clara.88@example.com', is_verified: true, is_ambassador: false, created_at: '2023-08-21', status: 'verified' as const },
  ]

  const filteredUsers = mockUsers.filter(user => {
    if (filterStatus && user.status !== filterStatus) return false
    if (filterRole === 'ambassador' && !user.is_ambassador) return false
    if (filterRole === 'user' && user.is_ambassador) return false
    if (search && !user.full_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

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
            <Link to="/admin" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left bg-[#009C3B]">
              <Users className="w-5 h-5" />
              <span className="text-sm">User Management</span>
            </div>
            <Link to="/admin/moderation" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800">
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm">Content Moderation</span>
            </Link>
            <Link to="/admin/stats" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800">
              <Map className="w-5 h-5" />
              <span className="text-sm">Map Statistics</span>
            </Link>
            <Link to="/admin/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800">
              <Settings className="w-5 h-5" />
              <span className="text-sm">System Settings</span>
            </Link>
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
            <h1 className="text-xl font-bold text-[#1c1b1b] font-[Plus_Jakarta_Sans]">Tem no Mapa Admin</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="search" className="pl-10 pr-4 py-2 bg-[#f6f3f2] rounded-lg text-sm w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><Bell className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><HelpCircle className="w-5 h-5 text-gray-600" /></button>
              <div className="w-8 h-8 rounded-full bg-[#009C3B] flex items-center justify-center text-white font-medium">A</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1c1b1b] mb-2 font-[Plus_Jakarta_Sans]">User Management</h2>
            <p className="text-[#6b7280]">Manage community members, roles, and account statuses.</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#bdcab9]/20 rounded-lg text-sm">
              <Filter className="w-4 h-4" />Filter Options
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#009C3B] text-white rounded-lg text-sm">
              <UserPlus className="w-4 h-4" />Invite User
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <select className="px-3 py-2 bg-white border border-[#bdcab9]/20 rounded-lg text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Status</option><option value="verified">Verified</option><option value="new">New</option><option value="reported">Reported</option>
            </select>
            <select className="px-3 py-2 bg-white border border-[#bdcab9]/20 rounded-lg text-sm" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Role</option><option value="user">User</option><option value="ambassador">Ambassador</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-[#bdcab9]/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f6f3f2] border-b border-[#bdcab9]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Name & Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Status Badge</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#bdcab9]/20 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009C3B] flex items-center justify-center text-white font-medium">{user.full_name[0]}</div>
                        <div>
                          <p className="font-medium text-[#1c1b1b]">{user.full_name}</p>
                          <p className="text-sm text-[#6b7280]">{user.is_ambassador ? 'Ambassador' : 'User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.status === 'verified' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#009C3B]/10 text-[#009C3B] text-xs rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>}
                      {user.status === 'new' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#6b7280]/10 text-[#6b7280] text-xs rounded-full"><Newspaper className="w-3 h-3" />New</span>}
                      {user.status === 'reported' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#ba1a1a]/10 text-[#ba1a1a] text-xs rounded-full"><AlertTriangle className="w-3 h-3" />Reported</span>}
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">{new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><Edit className="w-4 h-4 text-[#6b7280]" /></button>
                        <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><MoreVertical className="w-4 h-4 text-[#6b7280]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-[#bdcab9]/20 flex justify-between items-center">
              <p className="text-sm text-[#6b7280]">Showing 1 to 4 of {filteredUsers.length} results</p>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><ChevronLeft className="w-4 h-4 text-[#6b7280]" /></button>
                {[1, 2, 3].map((page) => <button key={page} className={`w-8 h-8 rounded-lg text-sm ${page === 1 ? 'bg-[#009C3B] text-white' : 'hover:bg-[#f6f3f2]'}`}>{page}</button>)}
                <span className="text-[#6b7280]">...</span>
                <button className="w-8 h-8 rounded-lg text-sm hover:bg-[#f6f3f2]">12</button>
                <button className="p-2 hover:bg-[#f6f3f2] rounded-lg"><ChevronRight className="w-4 h-4 text-[#6b7280]" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}