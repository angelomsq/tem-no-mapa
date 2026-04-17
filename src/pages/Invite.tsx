import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function Invite() {
  const { user } = useAuth()
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ clicks: 0, signups: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInviteData() {
      const client = supabase
      if (!client || !user) return

      // Get or create invite code
      const { data: existing } = await client
        .from('invite_links')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        setInviteLink(`${window.location.origin}/register?ref=${existing.code}`)
        setStats({ clicks: existing.clicks || 0, signups: 0 })
      } else {
        // Create new invite code
        const code = Math.random().toString(36).substring(2, 10)
        await client.from('invite_links').insert({ user_id: user.id, code })
        setInviteLink(`${window.location.origin}/register?ref=${code}`)
      }

      setLoading(false)
    }

    loadInviteData()
  }, [user])

  function copyToClipboard() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Convidar Amigos</h1>
      <p className="text-[#6b6375] mb-8">
        Convide seus amigos para fazerem parte da comunidade brasileira no exterior!
      </p>

      <div className="bg-white rounded-lg p-6 border border-[#e5e4e7] mb-6">
        <h2 className="font-medium mb-4">Seu link de convite</h2>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 p-3 border border-[#e5e4e7] rounded-lg bg-[#f6f3f2]"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-[#009C3B] text-white rounded-lg font-medium whitespace-nowrap"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 border border-[#e5e4e7] text-center">
          <div className="text-3xl font-bold text-[#009C3B]">{stats.clicks}</div>
          <div className="text-sm text-[#6b6375]">Cliques no link</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-[#e5e4e7] text-center">
          <div className="text-3xl font-bold text-[#009C3B]">{stats.signups}</div>
          <div className="text-sm text-[#6b6375]">Cadastros realizados</div>
        </div>
      </div>

      <div className="mt-8 bg-[#f6f3f2] rounded-lg p-6">
        <h3 className="font-medium mb-2">Como funciona</h3>
        <ol className="list-decimal list-inside text-[#6b6375] space-y-2">
          <li>Copie seu link de convite</li>
          <li>Compartilhe com amigos nas redes sociais</li>
          <li>Quando seu amigo se cadastrar, você ganha pontos</li>
          <li>Convide mais amigos para desbloquear conquistas!</li>
        </ol>
      </div>
    </div>
  )
}