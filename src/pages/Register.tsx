import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '@/lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
        <div className="w-full max-w-md p-8 text-center">
          <h1 className="text-3xl font-semibold mb-4 text-[#009C3B]">
            Verifique seu email
          </h1>
          <p className="text-[#6b6375]">
            Enviamos um link de confirmação para {email}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 text-[#009C3B]">
          Criar conta
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
              minLength={6}
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
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-8 text-center text-[#6b6375]">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#009C3B] font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}