import { useState, useEffect, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { 
  LayoutDashboard, Users, CheckSquare, Map, Settings,
  LogOut, Search, Bell, HelpCircle, MapPin,
  AlertTriangle, Delete, CheckCircle, Merge, Image, MoreVertical,
  Clock
} from 'lucide-react'

export default function Moderation() {
  const { profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile])

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    async function loadReports() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
      } catch (e) {
        console.error('[Moderation] error:', e)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
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

  const mockReports = [
    {
      id: '1',
      type: 'Hate Speech',
      description: '"Feijoada do Zé" - Reported by @carlos_m: "This user left a highly offensive comment attacking people from the northeast..."',
      status: 'pending',
      priority: 'high',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      reported_by: '@carlos_m',
      content_id: 'pin_comment_123'
    },
    {
      id: '2',
      type: 'Duplicate',
      description: '"Padaria Brasil" - Reported by Multiple Users (3): "This bakery is already listed under a slightly different name on the same street."',
      status: 'pending',
      priority: 'medium',
      created_at: new Date(Date.now() - 18000000).toISOString(),
      reported_by: '@multiple',
      content_id: 'map_pin_456'
    },
    {
      id: '3',
      type: 'Irrelevant Media',
      description: '"Capoeira Studio" - Reported by System Auto-Flag: "Image uploaded does not appear to relate to a physical location or business."',
      status: 'pending',
      priority: 'low',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      reported_by: 'System',
      content_id: 'photo_789'
    },
  ]

  const filteredReports = activeTab === 'pending' 
    ? mockReports.filter(r => r.status === 'pending')
    : mockReports.filter(r => r.status === 'resolved')

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
            <Link to="/admin/users" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-800">
              <Users className="w-5 h-5" />
              <span className="text-sm">User Management</span>
            </Link>
            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left bg-[#009C3B]">
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm">Content Moderation</span>
            </div>
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
            <h2 className="text-2xl font-bold text-[#1c1b1b] mb-2 font-[Plus_Jakarta_Sans]">Review Queue</h2>
            <p className="text-[#6b7280]">Manage reported content to maintain community standards.</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pending' ? 'bg-[#009C3B] text-white' : 'bg-white text-[#6b7280] border border-[#bdcab9]/20'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'resolved' ? 'bg-[#009C3B] text-white' : 'bg-white text-[#6b7280] border border-[#bdcab9]/20'}`}
            >
              Resolved
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <button className="p-4 bg-[#ba1a1a]/10 rounded-lg text-left">
              <p className="text-2xl font-bold text-[#ba1a1a]">3</p>
              <p className="text-sm text-[#6b7280]">High Priority</p>
            </button>
            <button className="p-4 bg-[#f6f3f2] rounded-lg text-left">
              <p className="text-2xl font-bold text-[#1c1b1b]">12</p>
              <p className="text-sm text-[#6b7280]">Duplicate Pins</p>
            </button>
            <button className="p-4 bg-[#f6f3f2] rounded-lg text-left">
              <p className="text-2xl font-bold text-[#1c1b1b]">8</p>
              <p className="text-sm text-[#6b7280]">Comments</p>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#bdcab9]/20 overflow-hidden">
            <div className="p-4 border-b border-[#bdcab9]/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6b7280]">sort</span>
                <select className="text-sm border border-[#bdcab9]/20 rounded px-2 py-1">
                  <option>Oldest First</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 border-b border-[#bdcab9]/20 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {report.priority === 'high' ? (
                      <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
                    ) : report.type === 'Duplicate' ? (
                      <Merge className="w-5 h-5 text-[#FFDF00]" />
                    ) : (
                      <Image className="w-5 h-5 text-[#6b7280]" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1c1b1b]">{report.type}</span>
                        <span className="text-xs text-[#6b7280]">
                          {report.type === 'Hate Speech' ? 'Pin Comment' : report.type === 'Duplicate' ? 'Map Pin' : 'Pin Photo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                        <Clock className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-[#f6f3f2] rounded">
                    <MoreVertical className="w-4 h-4 text-[#6b7280]" />
                  </button>
                </div>

                <p className="text-sm text-[#6b7280] mb-4">{report.description}</p>

                <div className="flex gap-2">
                  {report.type === 'Hate Speech' && (
                    <>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ba1a1a] text-white rounded-lg text-sm">
                        <Delete className="w-4 h-4" />
                        Remove
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bdcab9]/20 rounded-lg text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Warn User
                      </button>
                    </>
                  )}
                  {report.type === 'Duplicate' && (
                    <>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#009C3B] text-white rounded-lg text-sm">
                        <Merge className="w-4 h-4" />
                        Merge Pins
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bdcab9]/20 rounded-lg text-sm">
                        <Delete className="w-4 h-4" />
                        Delete Newest
                      </button>
                    </>
                  )}
                  {report.type === 'Irrelevant Media' && (
                    <>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bdcab9]/20 rounded-lg text-sm">
                        <Image className="w-4 h-4" />
                        Remove Photo
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#009C3B] text-white rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Approve Photo
                      </button>
                    </>
                  )}
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bdcab9]/20 rounded-lg text-sm text-[#6b7280]">
                    <CheckCircle className="w-4 h-4" />
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}