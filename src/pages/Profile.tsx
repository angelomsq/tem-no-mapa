import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, updateProfile } from '@/hooks/useAuth'
import { ESTADOS } from '@/types'

export default function Profile() {
  const { user, profile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    state: profile?.state || '',
    city: profile?.city || '',
    country: profile?.country || '',
  })

  async function handleSave() {
    setLoading(true)
    try {
      await updateProfile(formData)
      setEditing(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="flex items-center justify-between p-4 bg-white border-b border-[#e5e4e7]">
        <h1 className="text-xl font-semibold text-[#009C3B]">Tem no Mapa</h1>
        <nav className="flex items-center gap-6">
          <Link to="/map" className="text-[#6b6375]">Mapa</Link>
          <Link to="/profile" className="text-[#009C3B] font-medium">Perfil</Link>
        </nav>
      </header>
      <main className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg p-6 border border-[#e5e4e7]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#009C3B] flex items-center justify-center text-white text-2xl font-semibold">
                {(formData.full_name || user?.email)?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{formData.full_name || 'Meu Perfil'}</h2>
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
                  <label className="block text-sm font-medium mb-1">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full p-2 border border-[#e5e4e7] rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
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
              {profile?.bio && <p className="text-[#6b6375] mb-4">{profile.bio}</p>}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-[#6b6375]">Estado de Origem</span>
                  <p className="font-medium">
                    {profile?.state ? `${profile.state} - ${ESTADOS.find(e => e.codigo === profile.state)?.nome}` : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-[#6b6375]">País</span>
                  <p className="font-medium">{profile?.country || '-'}</p>
                </div>
                <div>
                  <span className="text-[#6b6375]">Cidade</span>
                  <p className="font-medium">{profile?.city || '-'}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 border border-[#e5e4e7] rounded-lg font-medium"
              >
                Editar Perfil
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}