import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { signUp } from '@/lib/supabase'
import { Button, Card, Input } from '@/components/ui'

export default function Register() {
  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { user } = await signUp(email, password)
      if (user) {
        const { supabase } = await import('@/lib/supabase')
        await supabase?.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          referral_code: referralCode || null,
        })
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-6">
        <Card className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-[#009C3B] mb-4">
            Verifique seu email
          </h1>
          <p className="text-[#6b7280]">
            Enviamos um link de confirmação para <strong>{email}</strong>
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#009C3B] mb-2">
            Criar conta
          </h1>
          <p className="text-[#6b7280]">
            Junte-se à comunidade brasileira no exterior
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Nome completo"
            placeholder="Seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && (
            <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] p-3 rounded-lg">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-8 text-center text-[#6b7280]">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#009C3B] font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  )
}