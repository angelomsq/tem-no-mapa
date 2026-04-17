import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface VerificationPhoto {
  id: string
  user_id: string
  photo_url: string
  description: string
  is_verified: boolean
  vote_count: number
}

export default function Verification() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<VerificationPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPhotos() {
      const client = supabase
      if (!client) return

      const { data } = await client
        .from('verification_photos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      setPhotos(data as VerificationPhoto[] || [])
      setLoading(false)
    }

    loadPhotos()
  }, [])

  async function handleVote(photoId: string, vote: boolean) {
    const client = supabase
    if (!client) return

    // Simple vote - in production, use fingerprint to prevent spam
    await client.from('verification_votes').insert({
      photo_id: photoId,
      voter_fingerprint: user?.id || 'anonymous',
      vote,
    })

    // Update vote count
    const photo = photos.find(p => p.id === photoId)
    if (photo) {
      setPhotos(photos.map(p => 
        p.id === photoId 
          ? { ...p, vote_count: p.vote_count + (vote ? 1 : -1) }
          : p
      ))
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Verificação de Embaixadores</h1>
      <p className="text-[#6b6375] mb-8">
        Vote se você reconhece este brasileiro. 5 votos positivos = Embaixador Verificado!
      </p>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009C3B]"></div>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center p-8 text-[#6b6375]">
          Nenhuma foto de verificação ainda. <br />
          Seja o primeiro a se verificar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white rounded-lg border border-[#e5e4e7] overflow-hidden">
              <div className="aspect-square bg-[#f6f3f2] flex items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
              <div className="p-4">
                {photo.description && (
                  <p className="text-sm text-[#6b6375] mb-3">{photo.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(photo.id, true)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      👍 {Math.max(0, photo.vote_count)}
                    </button>
                    <button
                      onClick={() => handleVote(photo.id, false)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      👎
                    </button>
                  </div>
                  {photo.is_verified && (
                    <span className="px-2 py-1 bg-[#009C3B] text-white text-xs rounded-full">
                      ✓ Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-[#f6f3f2] rounded-lg">
        <h2 className="font-medium mb-2">Como funciona</h2>
        <ol className="list-decimal list-inside text-[#6b6375] space-y-1">
          <li>Faça upload de uma foto sua</li>
          <li>Outros brasileiros vão votar se te reconhecem</li>
          <li>Com 5 votos positivos, você vira Embaixador Verificado</li>
        </ol>
      </div>
    </div>
  )
}