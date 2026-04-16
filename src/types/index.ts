export interface User {
  id: string
  email: string
  nome: string | null
  apelido: string | null
  estado_origem: string
  pais_atual: string
  cidade_atual: string
  lat: number
  lng: number
  avatar_url: string | null
  frase: string | null
  profissao: string | null
  verified: boolean
  created_at: string
}

export interface Conquista {
  id: string
  nome: string
  descricao: string
  icone: string
  rarity: 'comum' | 'raro' | 'epico' | 'lendario'
}

export interface Estado {
  codigo: string
  nome: string
  bandeira: string
}

export const ESTADOS: Estado[] = [
  { codigo: 'AC', nome: 'Acre', bandeira: '🇧🇷' },
  { codigo: 'AL', nome: 'Alagoas', bandeira: '🇧🇷' },
  { codigo: 'AP', nome: 'Amapá', bandeira: '🇧🇷' },
  { codigo: 'AM', nome: 'Amazonas', bandeira: '🇧🇷' },
  { codigo: 'BA', nome: 'Bahia', bandeira: '🇧🇷' },
  { codigo: 'CE', nome: 'Ceará', bandeira: '🇧🇷' },
  { codigo: 'DF', nome: 'Distrito Federal', bandeira: '🇧🇷' },
  { codigo: 'ES', nome: 'Espírito Santo', bandeira: '🇧🇷' },
  { codigo: 'GO', nome: 'Goiás', bandeira: '🇧🇷' },
  { codigo: 'MA', nome: 'Maranhão', bandeira: '🇧🇷' },
  { codigo: 'MT', nome: 'Mato Grosso', bandeira: '🇧🇷' },
  { codigo: 'MS', nome: 'Mato Grosso do Sul', bandeira: '🇧🇷' },
  { codigo: 'MG', nome: 'Minas Gerais', bandeira: '🇧🇷' },
  { codigo: 'PA', nome: 'Pará', bandeira: '🇧🇷' },
  { codigo: 'PB', nome: 'Paraíba', bandeira: '🇧🇷' },
  { codigo: 'PR', nome: 'Paraná', bandeira: '🇧🇷' },
  { codigo: 'PE', nome: 'Pernambuco', bandeira: '🇧🇷' },
  { codigo: 'PI', nome: 'Piauí', bandeira: '🇧🇷' },
  { codigo: 'RJ', nome: 'Rio de Janeiro', bandeira: '🇧🇷' },
  { codigo: 'RN', nome: 'Rio Grande do Norte', bandeira: '🇧🇷' },
  { codigo: 'RS', nome: 'Rio Grande do Sul', bandeira: '🇧🇷' },
  { codigo: 'RO', nome: 'Rondônia', bandeira: '🇧🇷' },
  { codigo: 'RR', nome: 'Roraima', bandeira: '🇧🇷' },
  { codigo: 'SC', nome: 'Santa Catarina', bandeira: '🇧🇷' },
  { codigo: 'SP', nome: 'São Paulo', bandeira: '🇧🇷' },
  { codigo: 'SE', nome: 'Sergipe', bandeira: '🇧🇷' },
  { codigo: 'TO', nome: 'Tocantins', bandeira: '🇧🇷' },
]

export const PAISES: Record<string, string> = {
  US: 'Estados Unidos',
  GB: 'Reino Unido',
  DE: 'Alemanha',
  FR: 'França',
  ES: 'Espanha',
  IT: 'Itália',
  PT: 'Portugal',
  CA: 'Canadá',
  AU: 'Austrália',
  JP: 'Japão',
  KR: 'Coréia do Sul',
  CN: 'China',
  NL: 'Holanda',
  BE: 'Bélgica',
  CH: 'Suíça',
  AT: 'Áustria',
  SE: 'Suécia',
  NO: 'Noruega',
  DK: 'Dinamarca',
  FI: 'Finlândia',
  IE: 'Irlanda',
  NZ: 'Nova Zelândia',
  SG: 'Singapura',
  AE: 'Emirados Árabes',
  ZA: 'África do Sul',
  AR: 'Argentina',
  UY: 'Uruguai',
  CL: 'Chile',
  MX: 'México',
  CO: 'Colômbia',
  PE: 'Peru',
}