import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50 border-b border-[#bdcab9]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#009C3B]">Tem no Mapa</h1>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="tertiary" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1c1b1b] mb-6 leading-tight">
              Onde os brasileiros<br />
              <span className="text-[#009C3B]">estão no mundo?</span>
            </h1>
            <p className="text-xl text-[#6b7280] mb-10 max-w-2xl mx-auto">
              Descubra onde seus compatriotas estão vivendo, trabalhando e construyendo uma nova história. O mapa da diáspora brasileira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Começar Agora</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Já tenho conta</Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#009C3B] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFDF00] rounded-full blur-3xl"></div>
          </div>
        </section>

        <section className="py-20 px-6 bg-[#f6f3f2]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1c1b1b] mb-12">
              Como funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-2">Explore o Mapa</h3>
                <p className="text-[#6b7280]">
                  Veja onde brasileiros estão ao redor do mundo. Filtre por estado de origem e descubra comunidades.
                </p>
              </Card>
              <Card className="text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-2">Cadastre-se</h3>
                <p className="text-[#6b7280]">
                  Marque sua localização e conecte-se com outros brasileiros na sua cidade ou país.
                </p>
              </Card>
              <Card className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-2">Ganhe Conquistas</h3>
                <p className="text-[#6b7280]">
                  Explore novos lugares, convide amigos e desbloqueie badges exclusivos de Embaixador.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1c1b1b] mb-6">
              Junte-se à comunidade
            </h2>
            <p className="text-xl text-[#6b7280] mb-8">
              Mais de 100 brasileiros já estão no mapa. Seja o próximo!
            </p>
            <Link to="/register">
              <Button size="lg">Criar Minha Conta</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-[#bdcab9]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6b7280]">
            © 2026 Tem no Mapa. Feito com ❤️ para a comunidade brasileira.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm text-[#6b7280] hover:text-[#009C3B]">Login</Link>
            <Link to="/register" className="text-sm text-[#6b7280] hover:text-[#009C3B]">Cadastro</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}