import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { Verified, Users, MapPin } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">Tem no Mapa</h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Sobre</a>
            <a href="#mapa" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Mapa</a>
            <a href="#como-funciona" className="text-sm font-medium text-[#6b7280] hover:text-[#1c1b1b]">Como funciona</a>
          </nav>
          <div className="flex items-center gap-3">
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
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1c1b1b] mb-6 leading-tight tracking-tight font-[Plus_Jakarta_Sans]">
              Onde estão os brasileiros<br />
              <span className="text-[#009C3B]">pelo mundo?</span>
            </h1>
            <p className="text-xl text-[#6b7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Conectamos a diáspora brasileira em uma rede global. Encontre comunidades, eventos e suporte em qualquer lugar que você chamar de lar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/map">
                <Button variant="secondary" size="lg">
                  Explorar Mapa
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg">
                  Cadastrar minha cidade
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#009C3B] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFDF00] rounded-full blur-3xl"></div>
          </div>
        </section>

        <section className="py-12 px-6 bg-[#f6f3f2]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">4.5M+</p>
                <p className="text-sm text-[#6b7280] mt-1">Brasileiros cadastrados</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">1.200+</p>
                <p className="text-sm text-[#6b7280] mt-1">Cidades pelo mundo</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">27</p>
                <p className="text-sm text-[#6b7280] mt-1">Estados brasileiros representados</p>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1c1b1b] mb-16 font-[Plus_Jakarta_Sans]">
              Por que usar o Tem no Mapa?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f6f3f2] flex items-center justify-center">
                  <Verified className="w-8 h-8 text-[#009C3B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-3 font-[Plus_Jakarta_Sans]">Verificação</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Segurança em primeiro lugar. Processos rigorosos para garantir uma comunidade autêntica e confiável para todos.
                </p>
              </Card>
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f6f3f2] flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#009C3B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-3 font-[Plus_Jakarta_Sans]">Embaixadores</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Conecte-se com líderes locais que oferecem suporte real sobre moradia, trabalho e adaptação cultural.
                </p>
              </Card>
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f6f3f2] flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#009C3B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1c1b1b] mb-3 font-[Plus_Jakarta_Sans]">Mapa Interativo</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Filtre por serviços, eventos e brasileiros próximos em tempo real com nossa ferramenta de geolocalização.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-[#f6f3f2]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c1b1b] mb-6 font-[Plus_Jakarta_Sans]">
              Pronto para encontrar sua vila?
            </h2>
            <p className="text-xl text-[#6b7280] mb-10">
              Junte-se a milhares de brasileiros que já estão conectados e construindo comunidades fortes ao redor do mundo.
            </p>
            <Link to="/register">
              <Button size="lg">
                Começar agora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 bg-[#1c1b1b]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#009C3B] font-[Plus_Jakarta_Sans]">Tem no Mapa</h3>
              <p className="text-sm text-gray-400 mt-1">Conectando a Diáspora Brasileira</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Community Guidelines</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Tem no Mapa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}