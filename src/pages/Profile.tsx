import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { supabase } from '@/lib/supabase'
import { useAuth, updateProfile, updateAvatar } from '@/hooks/useAuth'
import { ESTADOS } from '@/types'

interface UserStats {
  total_locations: number
  total_badges: number
  member_days: number
}

export default function Profile() {
  const { user, profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState<UserStats>({ total_locations: 0, total_badges: 0, member_days: 0 })
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    state: profile?.state || '',
    city: profile?.city || '',
    country: profile?.country || '',
  })

  useEffect(() => {
    async function loadStats() {
      const client = supabase
      if (!client || !user) return

      const { data: locations } = await client
        .from('user_locations')
        .select('id')
        .eq('user_id', user.id)

      const { data: badges } = await client
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id)

      const createdAt = new Date(profile?.created_at || Date.now())
      const days = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

      setStats({
        total_locations: locations?.length || 0,
        total_badges: badges?.length || 0,
        member_days: days,
      })
    }

    loadStats()
  }, [user, profile])

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
      <header className="flex items-center justify-between p-4 bg-white border-b border-[#e5e4e7]">
        <h1 className="text-xl font-semibold text-[#009C3B]">Tem no Mapa</h1>
        <nav className="flex items-center gap-6">
          <Link to="/map" className="text-[#6b6375]">Mapa</Link>
          <Link to="/achievements" className="text-[#6b6375]">Conquistas</Link>
          <Link to="/rankings" className="text-[#6b6375]">Ranking</Link>
          <Link to="/profile" className="text-[#009C3B] font-medium">Perfil</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div id="profile-card" className="bg-white rounded-lg p-6 border border-[#e5e4e7]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-full bg-[#009C3B] flex items-center justify-center text-white text-3xl font-semibold cursor-pointer hover:opacity-80"
                    >
                      {(formData.full_name || user?.email)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading && <span className="text-sm text-[#6b6375]">Enviando...</span>}
                  <div>
                    <h2 className="text-2xl font-semibold">{formData.full_name || 'Meu Perfil'}</h2>
                    <p className="text-sm text-[#6b6375]">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile?.is_verified && (
                    <span className="px-3 py-1 bg-[#009C3B] text-white text-sm rounded-full">Verificado</span>
                  )}
                  {profile?.is_ambassador && (
                    <span className="px-3 py-1 bg-[#FFDF00] text-black text-sm rounded-full">Embaixador</span>
                  )}
                </div>
              </div>

              {editing ? (
                <div className="space-y-4">
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
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-[#009C3B] text-white rounded-lg font-medium"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-[#e5e4e7] rounded-lg font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {profile?.bio && <p className="text-[#6b6375] mb-6 text-lg">{profile.bio}</p>}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-[#6b6375]">Estado de Origem</span>
                      <p className="font-medium text-lg">
                        {profile?.state ? `${profile.state} - ${ESTADOS.find(e => e.codigo === profile.state)?.nome}` : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#6b6375]">País Atual</span>
                      <p className="font-medium text-lg">{profile?.country || '-'}</p>
                    </div>
                    <div>
                      <span className="text-[#6b6375]">Cidade Atual</span>
                      <p className="font-medium text-lg">{profile?.city || '-'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 border border-[#e5e4e7] rounded-lg font-medium"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={generateShareImage}
                    className="ml-2 px-4 py-2 bg-[#009C3B] text-white rounded-lg font-medium"
                  >
                    📤 Compartilhar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-[#e5e4e7]">
              <h3 className="font-semibold mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#6b6375]">Locais cadastrados</span>
                  <span className="font-bold text-[#009C3B]">{stats.total_locations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6375]">Conquistas</span>
                  <span className="font-bold text-[#009C3B]">{stats.total_badges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6375]">Membro desde</span>
                  <span className="font-bold text-[#009C3B]}">{stats.member_days} dias</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#e5e4e7]">
              <h3 className="font-semibold mb-4">Acesso Rápido</h3>
              <div className="space-y-2">
                <Link
                  to="/achievements"
                  className="block p-3 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-center"
                >
                  🏆 Minhas Conquistas
                </Link>
                <Link
                  to="/rankings"
                  className="block p-3 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-center"
                >
                  📊 Ranking
                </Link>
                <Link
                  to="/map"
                  className="block p-3 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-center"
                >
                  🗺️ Explorar Mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}