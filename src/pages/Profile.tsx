import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { useAuth, updateProfile, updateAvatar } from '@/hooks/useAuth'
import { ESTADOS } from '@/types'
import { 
  MapPin, Edit3, Bell, ChevronDown, 
  Home, User, Bookmark, Plus, CheckCircle, 
  Share2, Settings, LogOut, Utensils
} from 'lucide-react'

interface Milestone {
  icon: string
  title: string
  description: string
}

export default function Profile() {
  const { user, profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    state: profile?.state || '',
    city: profile?.city || '',
    country: profile?.country || '',
  })

  const milestones: Milestone[] = [
    { icon: 'verified', title: 'Verified Resident', description: 'Identity confirmed' },
    { icon: 'hub', title: 'Community Connector', description: 'Added 10+ locations' },
  ]

  async function handleSave() {
    setLoading(true)
    try {
      await updateProfile(formData)
      setEditing(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await updateAvatar(file)
      window.location.reload()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    } finally {
      setUploading(false)
    }
  }

  async function generateShareImage() {
    const element = document.getElementById('profile-card')
    if (!element) return

    try {
      const canvas = await html2canvas(element, { backgroundColor: '#009C3B' })
      const link = document.createElement('a')
      link.download = 'meu-perfil-tem-no-mapa.png'
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/map" className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#009C3B]" />
            <span className="text-xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">Tem no Mapa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/map" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Mapa</Link>
            <Link to="/community" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Comunidade</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#f6f3f2] rounded-lg">
              <Bell className="w-5 h-5 text-[#6b7280]" />
            </button>
            <button className="flex items-center gap-2 hover:bg-[#f6f3f2] px-3 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#009C3B] flex items-center justify-center text-white font-medium">
                {(formData.full_name || user?.email)?.[0]?.toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-[#6b7280]" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-[#bdcab9]/20 min-h-[calc(100vh-73px)] p-6 hidden md:block">
          <nav className="space-y-2">
            <Link to="/feed" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] hover:bg-[#f6f3f2]">
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Feed</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f6f3f2] text-[#009C3B]">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <Link to="/saved" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] hover:bg-[#f6f3f2]">
              <Bookmark className="w-5 h-5" />
              <span className="text-sm font-medium">Saved Places</span>
            </Link>
            <Link to="/map" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] hover:bg-[#f6f3f2]">
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Pin</span>
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-[#bdcab9]/20">
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] hover:bg-[#f6f3f2]">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] hover:bg-[#f6f3f2] w-full">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-3xl">
            <div id="profile-card" className="bg-white rounded-xl p-8 mb-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#009C3B] flex items-center justify-center text-white text-4xl font-semibold">
                      {(formData.full_name || user?.email)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#009C3B] rounded-full flex items-center justify-center text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-[#1c1b1b] mb-2 font-[Plus_Jakarta_Sans]">
                  {formData.full_name || 'Meu Perfil'}
                </h2>
                
                <div className="flex items-center gap-2 text-[#6b7280] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{profile?.city || '-'}, {profile?.country || '-'}</span>
                </div>

                {profile?.is_verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#009C3B]/10 text-[#009C3B] text-sm rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    Verified Resident
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-3 mb-8">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#bdcab9]/20 rounded-lg font-medium text-[#6b7280] hover:bg-[#f6f3f2]"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={generateShareImage}
                  className="flex items-center gap-2 px-4 py-2 bg-[#009C3B] text-white rounded-lg font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {editing && (
                <div className="border-t border-[#bdcab9]/20 pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Estado de Origem</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                      >
                        <option value="">Selecione</option>
                        {ESTADOS.map(estado => (
                          <option key={estado.codigo} value={estado.codigo}>
                            {estado.codigo} - {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">País Atual</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cidade Atual</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-[#009C3B] to-[#008732] text-white rounded-lg font-semibold"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-[#bdcab9]/20 rounded-lg font-medium text-[#6b7280]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-[#1c1b1b] mb-6 font-[Plus_Jakarta_Sans]">Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-[#f6f3f2] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#009C3B]/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-[#009C3B]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1c1b1b]">{milestone.title}</p>
                      <p className="text-sm text-[#6b7280]">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#1c1b1b] font-[Plus_Jakarta_Sans]">My Places</h3>
                <button className="text-sm text-[#009C3B] font-medium">View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-[#bdcab9]/20 rounded-xl hover:bg-[#f6f3f2] cursor-pointer">
                  <div className="w-16 h-16 bg-[#f6f3f2] rounded-lg flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-[#6b7280]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1c1b1b]">Restaurant Name</p>
                    <p className="text-sm text-[#6b7280]">Lisbon, Portugal</p>
                  </div>
                  <MapPin className="w-5 h-5 text-[#6b7280]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="py-8 px-6 border-t border-[#bdcab9]/20 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#009C3B]" />
            <p className="text-sm text-[#6b7280]">
              © 2024 Tem no Mapa. Connecting the diaspora.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[#6b7280] hover:text-[#1c1b1b]">Privacy Policy</a>
            <a href="#" className="text-sm text-[#6b7280] hover:text-[#1c1b1b]">Terms</a>
            <a href="#" className="text-sm text-[#6b7280] hover:text-[#1c1b1b]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}