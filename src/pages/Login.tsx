import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn, signInWithGoogle } from '@/lib/supabase'

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
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 text-[#009C3B]">
          Tem no Mapa
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#e5e4e7] rounded-lg bg-white"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#e5e4e7] rounded-lg bg-white"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#009C3B] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[#6b6375]">ou</span>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mt-4 py-3 border border-[#e5e4e7] rounded-lg font-medium hover:bg-[#f6f3f2] disabled:opacity-50"
        >
          Continuar com Google
        </button>

        <p className="mt-8 text-center text-[#6b6375]">
          Não tem conta?{' '}
          <Link to="/register" className="text-[#009C3B] font-medium">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  )
}