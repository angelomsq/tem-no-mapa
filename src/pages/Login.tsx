import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn, signInWithGoogle } from '@/lib/supabase'
import { Button, Card, Input } from '@/components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro com Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#009C3B] mb-2">
            Tem no Mapa
          </h1>
          <p className="text-[#6b7280]">
            Entre na comunidade brasileira no exterior
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#bdcab9]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-[#6b7280]">ou continue com</span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full"
        >
          Google
        </Button>

        <p className="mt-8 text-center text-[#6b7280]">
          Não tem conta?{' '}
          <Link to="/register" className="text-[#009C3B] font-semibold hover:underline">
            Cadastrar
          </Link>
        </p>
      </Card>
    </div>
  )
}