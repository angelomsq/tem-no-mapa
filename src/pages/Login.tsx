import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn, signInWithGoogle } from '@/lib/supabase'
import { Button, Card } from '@/components/ui'
import { Mail, Lock } from 'lucide-react'

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
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#009C3B] mb-2 font-[Plus_Jakarta_Sans]">
            Tem no Mapa
          </h1>
          <p className="text-[#6b7280]">
            Welcome back to your global neighborhood
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1c1b1b] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="email"
                placeholder="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#1c1b1b]">Password</label>
              <Link to="/forgot-password" className="text-sm text-[#009C3B] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] p-3 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#bdcab9]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-[#6b7280]">Or continue with</span>
          </div>
        </div>

        <Button variant="secondary" onClick={handleGoogle} disabled={loading} className="w-full">
          Google
        </Button>

        <p className="mt-8 text-center text-[#6b7280]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#009C3B] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  )
}