import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { signUp } from '@/lib/supabase'
import { Button, Card } from '@/components/ui'
import { User, Mail, Lock, Globe } from 'lucide-react'

export default function Register() {
  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    if (!agreeTerms) {
      setError('Você precisa concordar com os Termos e Condições')
      return
    }

    setLoading(true)

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
        <Card className="w-full max-w-md p-10 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-[#009C3B]" />
          <h1 className="text-2xl font-bold text-[#009C3B] mb-4 font-[Plus_Jakarta_Sans]">
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
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <Globe className="w-12 h-12 mx-auto mb-4 text-[#009C3B]" />
          <h1 className="text-2xl font-bold text-[#009C3B] mb-2 font-[Plus_Jakarta_Sans]">
            Tem no Mapa
          </h1>
          <p className="text-[#6b7280]">
            Junte-se à nossa vizinhança global.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1c1b1b] mb-2">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1b1b] mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1b1b] mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1b1b] mb-2">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#bdcab9] text-[#009C3B] focus:ring-[#009C3B]"
            />
            <label htmlFor="terms" className="text-sm text-[#6b7280]">
              Eu concordo com os Termos e Condições e a Política de Privacidade.
            </label>
          </div>

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
            {loading ? 'Criando conta...' : 'Create Account'}
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
          onClick={() => {}}
          disabled={loading}
          className="w-full"
        >
          Google
        </Button>

        <p className="mt-8 text-center text-[#6b7280]">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-[#009C3B] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}