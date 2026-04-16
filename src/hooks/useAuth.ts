import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  state: string | null
  city: string | null
  country: string | null
  is_verified: boolean
  is_ambassador: boolean
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    if (!supabase) {
      setState(s => ({ ...s, loading: false }))
      return
    }

    const client = supabase

    async function loadUser() {
      const { data: { session } } = await client.auth.getSession()
      
      if (!session?.user) {
        setState({ user: null, profile: null, loading: false })
        return
      }

      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setState({
        user: session.user,
        profile: profile as Profile | null,
        loading: false,
      })
    }

    loadUser()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (!session?.user) {
          setState({ user: null, profile: null, loading: false })
          return
        }

        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setState({
          user: session.user,
          profile: profile as Profile | null,
          loading: false,
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}

export async function updateProfile(data: Partial<Profile>) {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) throw error
}