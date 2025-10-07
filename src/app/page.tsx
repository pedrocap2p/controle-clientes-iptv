"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, DollarSign, Tv, AlertCircle, Plus, Search, Edit, Trash2, Eye, Calendar, Phone, LogOut, Settings, Image, Download, Upload, Shield, UserCheck, Crown, Film, Monitor, Trophy, UserPlus, Lock, RefreshCw, Star, AlertTriangle, Clock, Database } from 'lucide-react'

// Importar serviços do Supabase
import { 
  usuarioService, 
  revendaService, 
  clienteService, 
  bannerService, 
  planoService, 
  configService,
  inicializarDados,
  verificarConexao
} from '@/lib/database'

interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: 'admin' | 'usuario'
  ativo: boolean
  data_cadastro: string
  ultimo_acesso: string
}

interface Revenda {
  id: string
  nome: string
  email: string
  senha: string
  ativo: boolean
  data_vencimento: string
  valor_mensal: number
  data_cadastro: string
  ultimo_acesso: string
  bloqueado: boolean
  observacoes: string
  logo_personalizada?: string
  posicao_logo?: 'direita' | 'centro'
  dias_alerta_vencimento?: number
  tipo: 'master' | 'simples'
  permissoes?: {
    clientes: boolean
    pagamentos: boolean
    banners: boolean
    configuracoes: boolean
    usuarios: boolean
    revendas: boolean
    planos: boolean
  }
}

interface Cliente {
  id: string
  nome: string
  whatsapp: string
  plano: string
  status: 'ativo' | 'inativo' | 'suspenso' | 'vencido'
  data_vencimento: string
  valor_mensal: number
  data_ultimo_pagamento: string
  observacoes: string
  data_cadastro: string
  usuario_id: string
}

interface Pagamento {
  id: string
  clienteId: string
  clienteNome: string
  valor: number
  data: string
  status: 'pago' | 'pendente' | 'atrasado'
  metodo: string
  usuarioId: string
}

interface Banner {
  id: string
  categoria: 'filme' | 'serie' | 'esporte'
  imagem_url: string
  logo_url: string
  usuario_id: string
  data_criacao: string
  sinopse?: string
  data_evento?: string
  logo_personalizada?: string
  posicao_logo?: 'direita' | 'centro'
}

interface ConfigSistema {
  logo_url: string
  nome_sistema: string
  cor_primaria: string
  cor_secundaria: string
}

interface Plano {
  id: string
  nome: string
  valor: number
  canais: string
  descricao: string
  ativo: boolean
}

interface JogoFutebol {
  id: string
  mandante: string
  visitante: string
  data: string
  horario: string
  campeonato: string
  estadio: string
  status: 'agendado' | 'ao_vivo' | 'finalizado'
  placarMandante?: number
  placarVisitante?: number
  imagemMandante: string
  imagemVisitante: string
  imagemBanner: string
}

// Base de dados expandida com filmes de 1940 até atual
const acervoCompleto = {
  filmes: {
    // Clássicos (1940-1980)
    'casablanca': {
      titulo: 'Casablanca',
      sinopse: 'Durante a Segunda Guerra Mundial, um americano expatriado encontra sua antiga amante em seu nightclub em Casablanca.',
      imagemUrl: 'https://images.unsplash.com/photo-1489599511986-c6b3c9c5b1c8?w=800&h=1200&fit=crop'
    },
    'cidadao kane': {
      titulo: 'Cidadão Kane',
      sinopse: 'A ascensão e queda de um magnata da mídia americana, contada através das memórias de pessoas que o conheceram.',
      imagemUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop'
    },
    'poderoso chefao': {
      titulo: 'O Poderoso Chefão',
      sinopse: 'A saga da família Corleone, uma das mais poderosas famílias da máfia italiana-americana.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    'tubarao': {
      titulo: 'Tubarão',
      sinopse: 'Um tubarão gigante aterroriza uma cidade litorânea durante o verão.',
      imagemUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1200&fit=crop'
    },
    
    // Anos 80-90
    'de volta para o futuro': {
      titulo: 'De Volta Para o Futuro',
      sinopse: 'Um adolescente viaja acidentalmente no tempo e deve garantir que seus pais se apaixonem.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'et': {
      titulo: 'E.T. - O Extraterrestre',
      sinopse: 'Um menino faz amizade com um alienígena perdido na Terra.',
      imagemUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
    },
    'jurassic park': {
      titulo: 'Jurassic Park',
      sinopse: 'Dinossauros são trazidos de volta à vida em um parque temático que sai de controle.',
      imagemUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop'
    },
    'titanic': {
      titulo: 'Titanic',
      sinopse: 'Um romance épico ambientado durante a viagem inaugural do RMS Titanic.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    
    // Anos 2000
    'senhor dos aneis': {
      titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
      sinopse: 'Um hobbit embarca em uma jornada épica para destruir um anel poderoso.',
      imagemUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=1200&fit=crop'
    },
    'matrix': {
      titulo: 'Matrix',
      sinopse: 'Um hacker descobre que a realidade é uma simulação controlada por máquinas.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'gladiador': {
      titulo: 'Gladiador',
      sinopse: 'Um general romano se torna gladiador para vingar a morte de sua família.',
      imagemUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop'
    },
    
    // Anos 2010-2020
    'avatar': {
      titulo: 'Avatar',
      sinopse: 'Um ex-marine paraplégico é enviado para a lua Pandora em uma missão única.',
      imagemUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop'
    },
    'vingadores': {
      titulo: 'Vingadores: Ultimato',
      sinopse: 'Os heróis remanescentes se unem para desfazer as ações de Thanos.',
      imagemUrl: 'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=800&h=1200&fit=crop'
    },
    'pantera negra': {
      titulo: 'Pantera Negra',
      sinopse: 'T\'Challa retorna para casa para assumir o trono de Wakanda.',
      imagemUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop'
    },
    'coringa': {
      titulo: 'Coringa',
      sinopse: 'A origem sombria do icônico vilão do Batman.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    
    // Filmes Atuais (2020-2024)
    'duna': {
      titulo: 'Duna',
      sinopse: 'Paul Atreides deve viajar para o planeta mais perigoso do universo.',
      imagemUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
    },
    'top gun maverick': {
      titulo: 'Top Gun: Maverick',
      sinopse: 'Maverick retorna como instrutor de uma nova geração de pilotos.',
      imagemUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=1200&fit=crop'
    },
    'batman': {
      titulo: 'Batman',
      sinopse: 'Uma nova versão sombria do Cavaleiro das Trevas.',
      imagemUrl: 'https://images.unsplash.com/photo-1509347528160-9329d33b2588?w=800&h=1200&fit=crop'
    },
    'homem aranha': {
      titulo: 'Homem-Aranha: Sem Volta Para Casa',
      sinopse: 'Peter Parker enfrenta vilões de outras dimensões.',
      imagemUrl: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=800&h=1200&fit=crop'
    },
    'avatar 2': {
      titulo: 'Avatar: O Caminho da Água',
      sinopse: 'Jake Sully e sua família enfrentam novas ameaças em Pandora.',
      imagemUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop'
    }
  },
  series: {
    // Séries Clássicas
    'breaking bad': {
      titulo: 'Breaking Bad',
      sinopse: 'Um professor de química se torna fabricante de metanfetamina.',
      imagemUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop'
    },
    'game of thrones': {
      titulo: 'Game of Thrones',
      sinopse: 'Famílias nobres lutam pelo controle dos Sete Reinos.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    'lost': {
      titulo: 'Lost',
      sinopse: 'Sobreviventes de um acidente aéreo ficam presos em uma ilha misteriosa.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    
    // Séries Atuais
    'stranger things': {
      titulo: 'Stranger Things',
      sinopse: 'Crianças enfrentam forças sobrenaturais em uma pequena cidade.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'house of dragon': {
      titulo: 'House of the Dragon',
      sinopse: 'A história da Casa Targaryen 200 anos antes de Game of Thrones.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    'wednesday': {
      titulo: 'Wednesday',
      sinopse: 'Wednesday Addams navega pela vida estudantil na Academia Nevermore.',
      imagemUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop'
    },
    'the boys': {
      titulo: 'The Boys',
      sinopse: 'Vigilantes lutam contra super-heróis corruptos.',
      imagemUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=1200&fit=crop'
    },
    'euphoria': {
      titulo: 'Euphoria',
      sinopse: 'Adolescentes navegam por drogas, sexo e identidade.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    'round 6': {
      titulo: 'Round 6',
      sinopse: 'Jogadores falidos competem em jogos infantis mortais.',
      imagemUrl: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=800&h=1200&fit=crop'
    },
    'the witcher': {
      titulo: 'The Witcher',
      sinopse: 'Geralt de Rivia, um caçador de monstros, busca seu destino.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    }
  }
}

// API simulada para buscar jogos do dia do GE Globo
const buscarJogosGEGlobo = async (termoBusca?: string): Promise<JogoFutebol[]> => {
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)
  
  // Simular dados extraídos do ge.globo.com/agenda/#/futebol
  const jogosSimulados: JogoFutebol[] = [
    {
      id: '1',
      mandante: 'Flamengo',
      visitante: 'Palmeiras',
      data: hoje.toISOString().split('T')[0],
      horario: '16:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Maracanã',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      mandante: 'Corinthians',
      visitante: 'Santos',
      data: hoje.toISOString().split('T')[0],
      horario: '18:30',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Neo Química Arena',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      mandante: 'São Paulo',
      visitante: 'Vasco',
      data: hoje.toISOString().split('T')[0],
      horario: '21:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Morumbi',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      mandante: 'Botafogo',
      visitante: 'Fluminense',
      data: amanha.toISOString().split('T')[0],
      horario: '19:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Nilton Santos',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      mandante: 'Grêmio',
      visitante: 'Internacional',
      data: amanha.toISOString().split('T')[0],
      horario: '16:30',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Arena do Grêmio',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop'
    },
    {
      id: '6',
      mandante: 'Atlético-MG',
      visitante: 'Cruzeiro',
      data: amanha.toISOString().split('T')[0],
      horario: '20:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Arena MRV',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    }
  ]

  // Filtrar por termo de busca se fornecido
  if (termoBusca) {
    const termo = termoBusca.toLowerCase()
    return jogosSimulados.filter(jogo => 
      jogo.mandante.toLowerCase().includes(termo) ||
      jogo.visitante.toLowerCase().includes(termo) ||
      jogo.campeonato.toLowerCase().includes(termo)
    )
  }

  return jogosSimulados
}

// API aprimorada para buscar dados de filmes/séries com busca inteligente do IMDB
const buscarConteudoIMDB = async (titulo: string, tipo: 'filme' | 'serie') => {
  // Simular busca no IMDB.com/pt/ com resultados reais
  const tituloLimpo = titulo.toLowerCase().trim()
  const acervo = tipo === 'filme' ? acervoCompleto.filmes : acervoCompleto.series
  
  // Busca exata primeiro
  for (const [chave, dados] of Object.entries(acervo)) {
    if (chave.includes(tituloLimpo) || dados.titulo.toLowerCase().includes(tituloLimpo)) {
      return {
        ...dados,
        imagemUrl: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=1200&fit=crop&auto=format&q=80`
      }
    }
  }
  
  // Busca por palavras-chave
  const palavrasChave = tituloLimpo.split(' ')
  for (const [chave, dados] of Object.entries(acervo)) {
    const tituloCompleto = dados.titulo.toLowerCase()
    if (palavrasChave.some(palavra => tituloCompleto.includes(palavra) || chave.includes(palavra))) {
      return {
        ...dados,
        imagemUrl: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=1200&fit=crop&auto=format&q=80`
      }
    }
  }
  
  return null
}

// API simulada para buscar dados de esportes com imagens reais do dia atual e anterior
const buscarDadosEsporteGoogle = async (nomeClube: string) => {
  const hoje = new Date()
  const ontem = new Date(hoje)
  ontem.setDate(ontem.getDate() - 1)
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)
  
  const clubes = {
    'flamengo': {
      nome: 'Flamengo',
      jogador: 'Gabigol',
      imagemJogador: `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Flamengo vs Palmeiras',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Flamengo 2x1 Vasco',
        hoje: 'Flamengo vs Palmeiras - 16:00',
        amanha: 'Flamengo vs Corinthians - 19:00'
      }
    },
    'palmeiras': {
      nome: 'Palmeiras',
      jogador: 'Dudu',
      imagemJogador: `https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Palmeiras vs Corinthians',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Palmeiras 3x0 Santos',
        hoje: 'Palmeiras vs Flamengo - 16:00',
        amanha: 'Palmeiras vs São Paulo - 20:00'
      }
    },
    'corinthians': {
      nome: 'Corinthians',
      jogador: 'Róger Guedes',
      imagemJogador: `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Corinthians vs São Paulo',
      dataJogo: ontem.toISOString().split('T')[0],
      jogos: {
        ontem: 'Corinthians 1x1 Fluminense',
        hoje: 'Corinthians vs Santos - 18:00',
        amanha: 'Corinthians vs Flamengo - 19:00'
      }
    },
    'santos': {
      nome: 'Santos',
      jogador: 'Marcos Leonardo',
      imagemJogador: `https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Santos vs Fluminense',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Santos 0x3 Palmeiras',
        hoje: 'Santos vs Corinthians - 18:00',
        amanha: 'Santos vs Botafogo - 17:00'
      }
    },
    'são paulo': {
      nome: 'São Paulo',
      jogador: 'Calleri',
      imagemJogador: `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'São Paulo vs Fluminense',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'São Paulo 2x0 Vasco',
        hoje: 'São Paulo vs Botafogo - 21:00',
        amanha: 'São Paulo vs Palmeiras - 20:00'
      }
    }
  }

  const chave = nomeClube.toLowerCase()
  return clubes[chave] || null
}

// Função para verificar vencimento de revendas e enviar alertas
const verificarVencimentoRevendas = (revendas: Revenda[]) => {
  const hoje = new Date()
  const alertas: string[] = []
  
  revendas.forEach(revenda => {
    const dataVencimento = new Date(revenda.data_vencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Alerta de 5 dias até vencimento
    if (diffDays <= 5 && diffDays >= 0) {
      alertas.push(`⚠️ ATENÇÃO: Seu plano vence em ${diffDays} dia(s)! Renove antes do vencimento para não perder o acesso.`)
    }
    
    // Bloqueio automático às 12:00 do dia do vencimento (horário de Brasília)
    if (diffDays < 0) {
      const agora = new Date()
      const horaBrasilia = agora.getHours() - 3 // Ajuste para horário de Brasília
      
      if (horaBrasilia >= 12) {
        revenda.bloqueado = true
        revenda.ativo = false
        alertas.push(`🚫 BLOQUEADO: Seu plano venceu e foi bloqueado às 12:00. Entre em contato para renovar.`)
      }
    }
  })
  
  return alertas
}

export default function IPTVManagerPro() {
  // Estados de autenticação
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [revendas, setRevendas] = useState<Revenda[]>([])
  const [mostrarLogin, setMostrarLogin] = useState(true)
  const [alertasVencimento, setAlertasVencimento] = useState<string[]>([])

  // Estados do sistema
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [configSistema, setConfigSistema] = useState<ConfigSistema>({
    logo_url: '',
    nome_sistema: 'IPTV Manager Pro',
    cor_primaria: '#7c3aed',
    cor_secundaria: '#a855f7'
  })

  // Estados de conexão
  const [conectado, setConectado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  // Estados de UI
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalEditarCliente, setModalEditarCliente] = useState(false)
  const [modalPagamento, setModalPagamento] = useState(false)
  const [modalBanner, setModalBanner] = useState(false)
  const [modalConfig, setModalConfig] = useState(false)
  const [modalUsuarios, setModalUsuarios] = useState(false)
  const [modalRevendas, setModalRevendas] = useState(false)
  const [modalEditarPlano, setModalEditarPlano] = useState(false)
  const [modalAlterarCredenciais, setModalAlterarCredenciais] = useState(false)
  const [modalEditarRevenda, setModalEditarRevenda] = useState(false)
  const [revendaEditando, setRevendaEditando] = useState<Revenda | null>(null)
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Estados para busca em tempo real
  const [buscaConteudo, setBuscaConteudo] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  // Inicialização do sistema com Supabase
  useEffect(() => {
    const inicializar = async () => {
      try {
        setCarregando(true)
        
        // Verificar conexão com Supabase
        const conexaoOk = await verificarConexao()
        setConectado(conexaoOk)
        
        if (conexaoOk) {
          // Inicializar dados padrão
          await inicializarDados()
          
          // Carregar dados do banco
          await carregarDados()
        } else {
          console.warn('⚠️ Sem conexão com Supabase - usando dados locais')
          // Fallback para dados locais se não houver conexão
          carregarDadosLocais()
        }
      } catch (error) {
        console.error('❌ Erro na inicialização:', error)
        // Sempre usar fallback local em caso de erro
        setConectado(false)
        carregarDadosLocais()
      } finally {
        setCarregando(false)
      }
    }

    inicializar()
  }, [])

  // Carregar dados do Supabase
  const carregarDados = async () => {
    try {
      const [usuariosData, revendasData, clientesData, bannersData, planosData, configData] = await Promise.all([
        usuarioService.listar().catch(() => []),
        revendaService.listar().catch(() => []),
        clienteService.listar().catch(() => []),
        bannerService.listar().catch(() => []),
        planoService.listar().catch(() => []),
        configService.obter().catch(() => null)
      ])

      // Converter dados do Supabase para formato da aplicação
      setUsuarios(usuariosData.map(u => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        senha: u.senha,
        tipo: u.tipo,
        ativo: u.ativo,
        data_cadastro: u.data_cadastro,
        ultimo_acesso: u.ultimo_acesso
      })))

      setRevendas(revendasData.map(r => ({
        id: r.id,
        nome: r.nome,
        email: r.email,
        senha: r.senha,
        ativo: r.ativo,
        data_vencimento: r.data_vencimento,
        valor_mensal: r.valor_mensal,
        data_cadastro: r.data_cadastro,
        ultimo_acesso: r.ultimo_acesso,
        bloqueado: r.bloqueado,
        observacoes: r.observacoes,
        logo_personalizada: r.logo_personalizada || undefined,
        posicao_logo: r.posicao_logo,
        dias_alerta_vencimento: r.dias_alerta_vencimento,
        tipo: r.tipo,
        permissoes: r.permissoes
      })))

      setClientes(clientesData.map(c => ({
        id: c.id,
        nome: c.nome,
        whatsapp: c.whatsapp,
        plano: c.plano,
        status: c.status,
        data_vencimento: c.data_vencimento,
        valor_mensal: c.valor_mensal,
        data_ultimo_pagamento: c.data_ultimo_pagamento,
        observacoes: c.observacoes,
        data_cadastro: c.data_cadastro,
        usuario_id: c.usuario_id
      })))

      setBanners(bannersData.map(b => ({
        id: b.id,
        categoria: b.categoria,
        imagem_url: b.imagem_url,
        logo_url: b.logo_url,
        usuario_id: b.usuario_id,
        data_criacao: b.data_criacao,
        sinopse: b.sinopse || undefined,
        data_evento: b.data_evento || undefined,
        logo_personalizada: b.logo_personalizada || undefined,
        posicao_logo: b.posicao_logo
      })))

      setPlanos(planosData)

      if (configData) {
        setConfigSistema({
          logo_url: configData.logo_url,
          nome_sistema: configData.nome_sistema,
          cor_primaria: configData.cor_primaria,
          cor_secundaria: configData.cor_secundaria
        })
      }

      console.log('✅ Dados carregados do Supabase com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao carregar dados do Supabase:', error)
      throw error
    }
  }

  // Fallback para dados locais
  const carregarDadosLocais = () => {
    const STORAGE_PREFIX = 'iptv_manager_v2_'
    
    const carregarDados = (chave: string, dadosPadrao: any = null) => {
      try {
        const dados = localStorage.getItem(`${STORAGE_PREFIX}${chave}`)
        return dados ? JSON.parse(dados) : dadosPadrao
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        return dadosPadrao
      }
    }

    // Carregar dados salvos localmente
    const usuariosSalvos = carregarDados('usuarios', [])
    const revendasSalvas = carregarDados('revendas', [])
    const clientesSalvos = carregarDados('clientes', [])
    const bannersSalvos = carregarDados('banners', [])
    const configSalva = carregarDados('config_sistema')
    const planosSalvos = carregarDados('planos', [])

    // Criar usuário admin padrão se não existir
    let usuariosFinais = usuariosSalvos
    if (usuariosSalvos.length === 0) {
      const adminPadrao: Usuario = {
        id: 'admin',
        nome: 'Administrador',
        email: 'admin@iptv.com',
        senha: 'admin123',
        tipo: 'admin',
        ativo: true,
        data_cadastro: '2024-01-01',
        ultimo_acesso: new Date().toISOString()
      }
      usuariosFinais = [adminPadrao]
    }

    // Dados de exemplo apenas se não houver clientes salvos
    let clientesFinais = clientesSalvos
    if (clientesSalvos.length === 0) {
      const clientesIniciais: Cliente[] = [
        {
          id: '1',
          nome: 'João Silva',
          whatsapp: '(11) 99999-9999',
          plano: 'Premium',
          status: 'ativo',
          data_vencimento: '2024-01-15',
          valor_mensal: 49.90,
          data_ultimo_pagamento: '2023-12-15',
          observacoes: 'Cliente pontual',
          data_cadastro: '2023-06-10',
          usuario_id: 'admin'
        },
        {
          id: '2',
          nome: 'Maria Santos',
          whatsapp: '(11) 88888-8888',
          plano: 'Básico',
          status: 'ativo',
          data_vencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          valor_mensal: 29.90,
          data_ultimo_pagamento: '2023-11-20',
          observacoes: 'Cliente regular',
          data_cadastro: '2023-08-15',
          usuario_id: 'admin'
        },
        {
          id: '3',
          nome: 'Carlos Oliveira',
          whatsapp: '(11) 77777-7777',
          plano: 'Ultra',
          status: 'ativo',
          data_vencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          valor_mensal: 79.90,
          data_ultimo_pagamento: '2023-12-01',
          observacoes: 'Cliente VIP',
          data_cadastro: '2023-05-20',
          usuario_id: 'admin'
        }
      ]
      clientesFinais = clientesIniciais
    }

    // Aplicar dados carregados
    setUsuarios(usuariosFinais)
    setRevendas(revendasSalvas)
    setClientes(clientesFinais)
    setBanners(bannersSalvos)
    
    if (configSalva) {
      setConfigSistema(configSalva)
    }

    console.log('✅ Dados locais carregados como fallback')
  }

  // Verificar vencimentos de revendas
  useEffect(() => {
    if (revendas.length > 0) {
      const alertas = verificarVencimentoRevendas(revendas)
      setAlertasVencimento(alertas)
    }
  }, [revendas])

  // Busca em tempo real para conteúdo com IMDB
  useEffect(() => {
    if (buscaConteudo.length >= 2) {
      const resultados = []
      
      // Buscar em filmes
      for (const [chave, dados] of Object.entries(acervoCompleto.filmes)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'filme', chave })
        }
      }
      
      // Buscar em séries
      for (const [chave, dados] of Object.entries(acervoCompleto.series)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'serie', chave })
        }
      }
      
      setResultadosBusca(resultados.slice(0, 8)) // Limitar a 8 resultados
      setMostrarResultados(true)
    } else {
      setResultadosBusca([])
      setMostrarResultados(false)
    }
  }, [buscaConteudo])

  // Funções de autenticação
  const fazerLogin = async (email: string, senha: string) => {
    try {
      if (conectado) {
        // Tentar login com Supabase
        const usuario = await usuarioService.buscarPorEmail(email)
        if (usuario && usuario.senha === senha && usuario.ativo) {
          const usuarioAtualizado = { 
            ...usuario, 
            ultimo_acesso: new Date().toISOString() 
          }
          await usuarioService.atualizar(usuario.id, { ultimo_acesso: new Date().toISOString() })
          setUsuarioLogado(usuarioAtualizado)
          setMostrarLogin(false)
          return
        }

        // Verificar revendas
        const revenda = await revendaService.buscarPorEmail(email)
        if (revenda && revenda.senha === senha && revenda.ativo && !revenda.bloqueado) {
          const usuarioRevenda: Usuario = {
            id: revenda.id,
            nome: revenda.nome,
            email: revenda.email,
            senha: revenda.senha,
            tipo: 'usuario',
            ativo: true,
            data_cadastro: revenda.data_cadastro,
            ultimo_acesso: new Date().toISOString()
          }
          await revendaService.atualizar(revenda.id, { ultimo_acesso: new Date().toISOString() })
          setUsuarioLogado(usuarioRevenda)
          setMostrarLogin(false)
          return
        }
      } else {
        // Fallback para login local
        const usuario = usuarios.find(u => u.email === email && u.senha === senha && u.ativo)
        if (usuario) {
          const usuarioAtualizado = { ...usuario, ultimo_acesso: new Date().toISOString() }
          setUsuarioLogado(usuarioAtualizado)
          setMostrarLogin(false)
          return
        }

        const revenda = revendas.find(r => r.email === email && r.senha === senha && r.ativo && !r.bloqueado)
        if (revenda) {
          const usuarioRevenda: Usuario = {
            id: revenda.id,
            nome: revenda.nome,
            email: revenda.email,
            senha: revenda.senha,
            tipo: 'usuario',
            ativo: true,
            data_cadastro: revenda.data_cadastro,
            ultimo_acesso: new Date().toISOString()
          }
          setUsuarioLogado(usuarioRevenda)
          setMostrarLogin(false)
          return
        }
      }

      alert('Email ou senha incorretos, ou conta inativa!')
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro ao fazer login. Tente novamente.')
    }
  }

  const logout = () => {
    setUsuarioLogado(null)
    setMostrarLogin(true)
  }

  // Função para verificar se usuário tem permissões de admin (admin ou revenda master)
  const temPermissoesAdmin = () => {
    if (usuarioLogado?.tipo === 'admin') return true
    
    const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
    return revendaAtual?.tipo === 'master'
  }

  // Função para verificar permissões específicas de revenda
  const temPermissao = (permissao: keyof NonNullable<Revenda['permissoes']>) => {
    if (usuarioLogado?.tipo === 'admin') return true
    
    const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
    if (!revendaAtual) return false
    
    // Para revenda master, todas as permissões EXCETO configurações
    if (revendaAtual.tipo === 'master') {
      if (permissao === 'configuracoes') return false // SEMPRE REMOVIDO para revenda master
      return true
    }
    
    // Para revenda simples, verificar permissões específicas
    return revendaAtual.permissoes?.[permissao] ?? false
  }

  // Filtrar dados por usuário
  const clientesFiltrados = clientes
    .filter(cliente => usuarioLogado?.tipo === 'admin' || cliente.usuario_id === usuarioLogado?.id)
    .filter(cliente => {
      const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        cliente.whatsapp.includes(busca)
      const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus
      return matchBusca && matchStatus
    })

  // Clientes que vencem nos próximos 3 dias
  const clientesVencendo = clientesFiltrados.filter(cliente => {
    const hoje = new Date()
    const dataVencimento = new Date(cliente.data_vencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  })

  const estatisticas = {
    totalClientes: clientesFiltrados.length,
    clientesAtivos: clientesFiltrados.filter(c => c.status === 'ativo').length,
    clientesVencidos: clientesFiltrados.filter(c => c.status === 'vencido').length,
    receitaMensal: clientesFiltrados.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor_mensal, 0)
  }

  // Funções de gerenciamento com Supabase
  const adicionarCliente = async (dadosCliente: Omit<Cliente, 'id' | 'data_cadastro' | 'usuario_id'>) => {
    try {
      const novoCliente = {
        ...dadosCliente,
        data_cadastro: new Date().toISOString().split('T')[0],
        usuario_id: usuarioLogado?.id || ''
      }

      if (conectado) {
        const clienteCriado = await clienteService.criar(novoCliente)
        setClientes([...clientes, {
          ...clienteCriado,
          data_vencimento: clienteCriado.data_vencimento,
          data_ultimo_pagamento: clienteCriado.data_ultimo_pagamento,
          data_cadastro: clienteCriado.data_cadastro
        }])
      } else {
        // Fallback local
        const clienteLocal: Cliente = {
          ...novoCliente,
          id: Date.now().toString()
        }
        setClientes([...clientes, clienteLocal])
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
      alert('Erro ao adicionar cliente. Tente novamente.')
    }
  }

  const editarCliente = async (clienteEditado: Cliente) => {
    try {
      if (conectado) {
        await clienteService.atualizar(clienteEditado.id, {
          nome: clienteEditado.nome,
          whatsapp: clienteEditado.whatsapp,
          plano: clienteEditado.plano,
          status: clienteEditado.status,
          data_vencimento: clienteEditado.data_vencimento,
          valor_mensal: clienteEditado.valor_mensal,
          data_ultimo_pagamento: clienteEditado.data_ultimo_pagamento,
          observacoes: clienteEditado.observacoes
        })
      }
      
      setClientes(clientes.map(cliente => 
        cliente.id === clienteEditado.id ? clienteEditado : cliente
      ))
    } catch (error) {
      console.error('Erro ao editar cliente:', error)
      alert('Erro ao editar cliente. Tente novamente.')
    }
  }

  const excluirCliente = async (clienteId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      try {
        if (conectado) {
          await clienteService.excluir(clienteId)
        }
        
        setClientes(clientes.filter(cliente => cliente.id !== clienteId))
        setPagamentos(pagamentos.filter(pagamento => pagamento.clienteId !== clienteId))
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
        alert('Erro ao excluir cliente. Tente novamente.')
      }
    }
  }

  const criarBanner = async (dadosBanner: Omit<Banner, 'id' | 'data_criacao' | 'usuario_id'>) => {
    try {
      const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
      const novoBanner = {
        ...dadosBanner,
        data_criacao: new Date().toISOString(),
        usuario_id: usuarioLogado?.id || '',
        logo_url: configSistema.logo_url,
        logo_personalizada: revendaAtual?.logo_personalizada || '',
        posicao_logo: revendaAtual?.posicao_logo || 'direita'
      }

      if (conectado) {
        const bannerCriado = await bannerService.criar(novoBanner)
        setBanners([...banners, {
          ...bannerCriado,
          imagem_url: bannerCriado.imagem_url,
          logo_url: bannerCriado.logo_url,
          usuario_id: bannerCriado.usuario_id,
          data_criacao: bannerCriado.data_criacao
        }])
      } else {
        // Fallback local
        const bannerLocal: Banner = {
          ...novoBanner,
          id: Date.now().toString()
        }
        setBanners([...banners, bannerLocal])
      }
    } catch (error) {
      console.error('Erro ao criar banner:', error)
      alert('Erro ao criar banner. Tente novamente.')
    }
  }

  const excluirBanner = async (bannerId: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        if (conectado) {
          await bannerService.excluir(bannerId)
        }
        
        setBanners(banners.filter(banner => banner.id !== bannerId))
      } catch (error) {
        console.error('Erro ao excluir banner:', error)
        alert('Erro ao excluir banner. Tente novamente.')
      }
    }
  }

  // Tela de carregamento
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Tv className="w-10 h-10 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">IPTV Manager Pro</h1>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Database className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-white">Conectando ao banco de dados...</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de Login
  if (mostrarLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tv className="w-10 h-10 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">{configSistema.nome_sistema}</h1>
            </div>
            <CardTitle className="text-white">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-purple-200">
              Entre com suas credenciais de acesso
            </CardDescription>
            {!conectado && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 text-sm font-medium">Modo offline - dados locais</span>
                </div>
                <p className="text-yellow-200 text-xs">
                  Para usar o banco de dados Supabase, vá em Configurações do Projeto → Integrações → Conectar Supabase
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={fazerLogin} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Interface principal (resto do código permanece igual...)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Status de Conexão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className={`w-4 h-4 ${conectado ? 'text-green-400' : 'text-yellow-400'}`} />
            <span className={`text-sm ${conectado ? 'text-green-400' : 'text-yellow-400'}`}>
              {conectado ? 'Conectado ao Supabase' : 'Modo offline - dados locais'}
            </span>
          </div>
        </div>

        {/* Alertas de Vencimento */}
        {alertasVencimento.length > 0 && (
          <div className="space-y-2">
            {alertasVencimento.map((alerta, index) => (
              <div key={index} className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                <p className="text-orange-200 text-sm">{alerta}</p>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-4">
          <div className="flex items-center gap-4">
            {configSistema.logo_url && (
              <img src={configSistema.logo_url} alt="Logo" className="w-12 h-12 rounded-lg" />
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                <Tv className="w-6 lg:w-8 h-6 lg:h-8 text-purple-400" />
                {configSistema.nome_sistema}
              </h1>
              <p className="text-purple-200 text-sm lg:text-base">
                Bem-vindo, {usuarioLogado?.nome} 
                {usuarioLogado?.tipo === 'admin' && <Crown className="inline w-4 h-4 ml-2 text-yellow-400" />}
                {usuarioLogado?.tipo === 'usuario' && (
                  <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">
                    {revendas.find(r => r.id === usuarioLogado.id)?.tipo === 'master' ? (
                      <>
                        <Crown className="inline w-3 h-3 mr-1 text-yellow-400" />
                        Revenda Master - R$ {revendas.find(r => r.id === usuarioLogado.id)?.valor_mensal.toFixed(2)}/mês
                      </>
                    ) : (
                      `Revenda Simples - R$ ${revendas.find(r => r.id === usuarioLogado.id)?.valor_mensal.toFixed(2)}/mês`
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setModalAlterarCredenciais(true)}
              className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Alterar Credenciais
            </Button>
            
            {temPermissao('configuracoes') && (
              <Button
                variant="outline"
                onClick={() => setModalConfig(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            )}
            
            {temPermissao('usuarios') && (
              <Button
                variant="outline"
                onClick={() => setModalUsuarios(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Usuários
              </Button>
            )}
            
            {temPermissao('revendas') && (
              <Button
                variant="outline"
                onClick={() => setModalRevendas(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Revendas
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs lg:text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-white">{estatisticas.totalClientes}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Clientes Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-400">{estatisticas.clientesAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Clientes Vencidos</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-red-400">{estatisticas.clientesVencidos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-green-400">
                R$ {estatisticas.receitaMensal.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principal */}
        <Tabs defaultValue="clientes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#87CEEB]/10 backdrop-blur-sm">
            {temPermissao('clientes') && (
              <TabsTrigger value="clientes" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Clientes
              </TabsTrigger>
            )}
            {temPermissao('pagamentos') && (
              <TabsTrigger value="pagamentos" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Pagamentos
              </TabsTrigger>
            )}
            {temPermissao('banners') && (
              <TabsTrigger value="banners" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Banners
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab Clientes */}
          {temPermissao('clientes') && (
            <TabsContent value="clientes" className="space-y-6">
              <Tabs defaultValue="todos" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-[#87CEEB]/10 backdrop-blur-sm">
                  <TabsTrigger value="todos" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                    Todos os Clientes
                  </TabsTrigger>
                  <TabsTrigger value="vencendo" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Vencendo (3 dias)
                  </TabsTrigger>
                </TabsList>

                {/* Aba Todos os Clientes */}
                <TabsContent value="todos">
                  <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                          <CardTitle className="text-white">Gerenciar Clientes</CardTitle>
                          <CardDescription className="text-purple-200">
                            Controle completo dos seus clientes IPTV
                          </CardDescription>
                        </div>
                        
                        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                          <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Novo Cliente
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                              <DialogDescription className="text-slate-300">
                                Preencha os dados do cliente para cadastro
                              </DialogDescription>
                            </DialogHeader>
                            <NovoClienteForm onSubmit={adicionarCliente} onClose={() => setModalAberto(false)} />
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Filtros */}
                      <div className="flex flex-col lg:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por nome ou WhatsApp..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="pl-10 bg-[#87CEEB]/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                          <SelectTrigger className="w-full lg:w-48 bg-[#87CEEB]/10 border-white/20 text-white">
                            <SelectValue placeholder="Filtrar por status" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="todos">Todos os Status</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="vencido">Vencido</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {clientesFiltrados.map((cliente) => (
                          <Card key={cliente.id} className="bg-[#87CEEB]/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                    <h3 className="font-semibold text-white text-base lg:text-lg">{cliente.nome}</h3>
                                    <Badge className={getStatusColor(cliente.status)}>
                                      {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      WhatsApp: {cliente.whatsapp}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Vence: {new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm">
                                    <span className="text-purple-300">Plano: {cliente.plano}</span>
                                    <span className="text-green-300">R$ {cliente.valor_mensal.toFixed(2)}/mês</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setClienteSelecionado(cliente)}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setClienteEditando(cliente)
                                      setModalEditarCliente(true)
                                    }}
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => excluirCliente(cliente.id)}
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Aba Clientes Vencendo */}
                <TabsContent value="vencendo">
                  <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Clientes Vencendo nos Próximos 3 Dias
                      </CardTitle>
                      <CardDescription className="text-purple-200">
                        Clientes que precisam de atenção urgente
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {clientesVencendo.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhum cliente vencendo nos próximos 3 dias.</p>
                          </div>
                        ) : (
                          clientesVencendo.map((cliente) => {
                            const hoje = new Date()
                            const dataVencimento = new Date(cliente.data_vencimento)
                            const diffTime = dataVencimento.getTime() - hoje.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            
                            let corAlerta = 'bg-yellow-500'
                            let textoAlerta = 'Vence em breve'
                            
                            if (diffDays === 0) {
                              corAlerta = 'bg-red-500'
                              textoAlerta = 'Vence hoje!'
                            } else if (diffDays === 1) {
                              corAlerta = 'bg-orange-500'
                              textoAlerta = 'Vence amanhã!'
                            } else if (diffDays === 2) {
                              corAlerta = 'bg-yellow-500'
                              textoAlerta = 'Vence em 2 dias'
                            } else if (diffDays === 3) {
                              corAlerta = 'bg-blue-500'
                              textoAlerta = 'Vence em 3 dias'
                            }
                            
                            return (
                              <Card key={cliente.id} className="bg-[#87CEEB]/5 border-white/10">
                                <CardContent className="p-4">
                                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                        <h3 className="font-semibold text-white text-base lg:text-lg">{cliente.nome}</h3>
                                        <Badge className={corAlerta}>
                                          {textoAlerta}
                                        </Badge>
                                        <Badge className={getStatusColor(cliente.status)}>
                                          {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                                        </Badge>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4" />
                                          WhatsApp: {cliente.whatsapp}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Vence: {new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm">
                                        <span className="text-purple-300">Plano: {cliente.plano}</span>
                                        <span className="text-green-300">R$ {cliente.valor_mensal.toFixed(2)}/mês</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setClienteSelecionado(cliente)}
                                        className="border-white/20 text-white hover:bg-white/10"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setClienteEditando(cliente)
                                          setModalEditarCliente(true)
                                        }}
                                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}

          {/* Tab Banners */}
          {temPermissao('banners') && (
            <TabsContent value="banners" className="space-y-6">
              <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      <CardTitle className="text-white">Gerador de Banners</CardTitle>
                      <CardDescription className="text-purple-200">
                        Crie banners profissionais com busca inteligente do IMDB.com/pt/ e jogos do GE Globo
                      </CardDescription>
                    </div>
                    
                    <Dialog open={modalBanner} onOpenChange={setModalBanner}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Banner
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Banner</DialogTitle>
                          <DialogDescription className="text-slate-300">
                            Crie banners personalizados com busca inteligente do IMDB.com/pt/ e jogos do GE Globo
                          </DialogDescription>
                        </DialogHeader>
                        <BannerForm 
                          onSubmit={criarBanner} 
                          onClose={() => setModalBanner(false)}
                          usuarioLogado={usuarioLogado}
                          revendas={revendas}
                          onAtualizarLogo={() => {}}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {banners
                      .filter(banner => usuarioLogado?.tipo === 'admin' || banner.usuario_id === usuarioLogado?.id)
                      .map((banner) => (
                      <Card key={banner.id} className="bg-[#87CEEB]/5 border-white/10 overflow-hidden">
                        <div className="relative">
                          {banner.imagem_url && (
                            <img 
                              src={banner.imagem_url} 
                              alt="Banner"
                              className="w-full h-32 lg:h-48 object-cover"
                            />
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={
                              banner.categoria === 'filme' ? 'bg-red-500' :
                              banner.categoria === 'serie' ? 'bg-blue-500' : 'bg-green-500'
                            }>
                              {banner.categoria === 'filme' && <Film className="w-3 h-3 mr-1" />}
                              {banner.categoria === 'serie' && <Monitor className="w-3 h-3 mr-1" />}
                              {banner.categoria === 'esporte' && <Trophy className="w-3 h-3 mr-1" />}
                              {banner.categoria.charAt(0).toUpperCase() + banner.categoria.slice(1)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => excluirBanner(banner.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 p-1 h-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {(banner.logo_personalizada || banner.logo_url) && (
                            <img 
                              src={banner.logo_personalizada || banner.logo_url} 
                              alt="Logo"
                              className={`absolute bottom-2 w-8 lg:w-12 h-8 lg:h-12 rounded bg-white/20 backdrop-blur-sm p-1 ${
                                banner.posicao_logo === 'centro' ? 'left-1/2 transform -translate-x-1/2' : 'left-2'
                              }`}
                            />
                          )}
                        </div>
                        <CardContent className="p-3 lg:p-4">
                          {banner.sinopse && (
                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{banner.sinopse}</p>
                          )}
                          {banner.data_evento && (
                            <p className="text-xs text-purple-300 mb-4">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(banner.data_evento).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm"
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = banner.imagem_url
                              link.download = `banner-${banner.categoria}-${Date.now()}.jpg`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Banner
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Tab Pagamentos */}
          {temPermissao('pagamentos') && (
            <TabsContent value="pagamentos" className="space-y-6">
              <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Sistema de Pagamentos com WhatsApp</CardTitle>
                  <CardDescription className="text-purple-200">
                    Gerencie pagamentos e envie lembretes automáticos via WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PagamentosWhatsApp clientes={clientesFiltrados} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Modais */}
        {clienteSelecionado && (
          <Dialog open={!!clienteSelecionado} onOpenChange={() => setClienteSelecionado(null)}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Cliente</DialogTitle>
              </DialogHeader>
              <ClienteDetalhes cliente={clienteSelecionado} />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Editar Cliente */}
        <Dialog open={modalEditarCliente} onOpenChange={setModalEditarCliente}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription className="text-slate-300">
                Altere os dados do cliente
              </DialogDescription>
            </DialogHeader>
            {clienteEditando && (
              <EditarClienteForm 
                cliente={clienteEditando}
                onSubmit={(clienteEditado) => {
                  editarCliente(clienteEditado)
                  setModalEditarCliente(false)
                  setClienteEditando(null)
                }}
                onClose={() => {
                  setModalEditarCliente(false)
                  setClienteEditando(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Alterar Credenciais */}
        <Dialog open={modalAlterarCredenciais} onOpenChange={setModalAlterarCredenciais}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Credenciais</DialogTitle>
              <DialogDescription className="text-slate-300">
                Altere seu email e senha de acesso
              </DialogDescription>
            </DialogHeader>
            <AlterarCredenciaisForm 
              usuarioAtual={usuarioLogado}
              onSubmit={() => {}} 
              onClose={() => setModalAlterarCredenciais(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Componentes auxiliares
function LoginForm({ onLogin }: {
  onLogin: (email: string, senha: string) => void
}) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(formData.email, formData.senha)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="senha" className="text-white">Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({...formData, senha: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
        Entrar
      </Button>
    </form>
  )
}

function AlterarCredenciaisForm({ usuarioAtual, onSubmit, onClose }: {
  usuarioAtual: Usuario | null
  onSubmit: (email: string, senha: string) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    email: usuarioAtual?.email || '',
    senha: '',
    confirmarSenha: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }
    
    onSubmit(formData.email, formData.senha)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">Novo Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="senha" className="text-white">Nova Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({...formData, senha: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="confirmarSenha" className="text-white">Confirmar Nova Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Alterar Credenciais
        </Button>
      </div>
    </form>
  )
}

function NovoClienteForm({ onSubmit, onClose }: { 
  onSubmit: (cliente: Omit<Cliente, 'id' | 'data_cadastro' | 'usuario_id'>) => void
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    plano: '',
    status: 'ativo' as Cliente['status'],
    data_vencimento: '',
    valor_mensal: 0,
    data_ultimo_pagamento: '',
    observacoes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        <div>
          <Label htmlFor="plano">Plano</Label>
          <Input
            id="plano"
            value={formData.plano}
            onChange={(e) => setFormData({...formData, plano: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Digite o nome do plano"
            required
          />
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valor_mensal}
            onChange={(e) => setFormData({...formData, valor_mensal: parseFloat(e.target.value)})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.data_vencimento}
            onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Cadastrar Cliente
        </Button>
      </div>
    </form>
  )
}

function EditarClienteForm({ cliente, onSubmit, onClose }: {
  cliente: Cliente
  onSubmit: (cliente: Cliente) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    ...cliente
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        <div>
          <Label htmlFor="plano">Plano</Label>
          <Input
            id="plano"
            value={formData.plano}
            onChange={(e) => setFormData({...formData, plano: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: Cliente['status']) => setFormData({...formData, status: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valor_mensal}
            onChange={(e) => setFormData({...formData, valor_mensal: parseFloat(e.target.value)})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.data_vencimento}
            onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="dataUltimoPagamento">Data do Último Pagamento</Label>
          <Input
            id="dataUltimoPagamento"
            type="date"
            value={formData.data_ultimo_pagamento}
            onChange={(e) => setFormData({...formData, data_ultimo_pagamento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Edit className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  )
}

function PagamentosWhatsApp({ clientes }: { clientes: Cliente[] }) {
  const [whatsappNumero, setWhatsappNumero] = useState('')
  const [mensagemTemplate, setMensagemTemplate] = useState(
    'Olá {nome}! Seu plano IPTV vence em {dias} dia(s) ({data}). Valor: R$ {valor}. Renove para manter o acesso!'
  )
  const [historicoPagamentos, setHistoricoPagamentos] = useState<{cliente: Cliente, whatsapp: string, data: string}[]>([])

  const enviarWhatsApp = (cliente: Cliente, numeroWhatsApp?: string) => {
    const hoje = new Date()
    const dataVencimento = new Date(cliente.data_vencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const mensagem = mensagemTemplate
      .replace('{nome}', cliente.nome)
      .replace('{dias}', diffDays.toString())
      .replace('{data}', dataVencimento.toLocaleDateString('pt-BR'))
      .replace('{valor}', cliente.valor_mensal.toFixed(2))
    
    const numero = numeroWhatsApp || whatsappNumero || cliente.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`
    
    // Adicionar ao histórico
    setHistoricoPagamentos(prev => [...prev, {
      cliente,
      whatsapp: numero,
      data: new Date().toLocaleString('pt-BR')
    }])
    
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Configuração de WhatsApp */}
      <Card className="bg-[#87CEEB]/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">📱 Configuração WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatsapp" className="text-white">Número WhatsApp (opcional)</Label>
            <Input
              id="whatsapp"
              value={whatsappNumero}
              onChange={(e) => setWhatsappNumero(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="11999999999 (apenas números)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se não preenchido, usará o WhatsApp cadastrado do cliente
            </p>
          </div>
          
          <div>
            <Label htmlFor="mensagem" className="text-white">Mensagem de Lembrete (Editável)</Label>
            <Textarea
              id="mensagem"
              value={mensagemTemplate}
              onChange={(e) => setMensagemTemplate(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={4}
            />
            <p className="text-xs text-gray-400 mt-1">
              Use: {'{nome}'} {'{dias}'} {'{data}'} {'{valor}'} para personalizar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes para Pagamento */}
      <Card className="bg-[#87CEEB]/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">💰 Enviar Lembretes de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map((cliente) => {
              const hoje = new Date()
              const dataVencimento = new Date(cliente.data_vencimento)
              const diffTime = dataVencimento.getTime() - hoje.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              let corStatus = 'bg-green-500'
              let textoStatus = 'Em dia'
              
              if (diffDays <= 0) {
                corStatus = 'bg-red-500'
                textoStatus = 'Vencido'
              } else if (diffDays <= 3) {
                corStatus = 'bg-orange-500'
                textoStatus = 'Vencendo'
              } else if (diffDays <= 7) {
                corStatus = 'bg-yellow-500'
                textoStatus = 'Próximo'
              }
              
              return (
                <div key={cliente.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
                      <h3 className="font-semibold text-white">{cliente.nome}</h3>
                      <Badge className={corStatus}>{textoStatus}</Badge>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <span>📱 {cliente.whatsapp}</span>
                      <span>📅 Vence: {dataVencimento.toLocaleDateString('pt-BR')}</span>
                      <span>💰 R$ {cliente.valor_mensal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => enviarWhatsApp(cliente)}
                      className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm"
                    >
                      📱 Enviar WhatsApp
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Envios */}
      {historicoPagamentos.length > 0 && (
        <Card className="bg-[#87CEEB]/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">📋 Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historicoPagamentos.slice(-10).reverse().map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded text-sm">
                  <div className="text-white">
                    <span className="font-medium">{item.cliente.nome}</span>
                    <span className="text-gray-400 ml-2">→ {item.whatsapp}</span>
                  </div>
                  <span className="text-gray-400">{item.data}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BannerForm({ onSubmit, onClose, usuarioLogado, revendas, onAtualizarLogo }: {
  onSubmit: (banner: Omit<Banner, 'id' | 'data_criacao' | 'usuario_id' | 'logo_url' | 'logo_personalizada' | 'posicao_logo'>) => void
  onClose: () => void
  usuarioLogado: Usuario | null
  revendas: Revenda[]
  onAtualizarLogo: (logoUrl: string, posicao: 'direita' | 'centro') => void
}) {
  const [formData, setFormData] = useState({
    categoria: 'filme' as Banner['categoria'],
    imagem_url: '',
    sinopse: '',
    data_evento: ''
  })

  const [logoPersonalizada, setLogoPersonalizada] = useState('')
  const [posicaoLogo, setPosicaoLogo] = useState<'direita' | 'centro'>('direita')
  const [buscaConteudo, setBuscaConteudo] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [buscandoConteudo, setBuscandoConteudo] = useState(false)
  const [dadosEncontrados, setDadosEncontrados] = useState<any>(null)
  const [imagemDispositivo, setImagemDispositivo] = useState('')
  
  // Estados para busca de jogos
  const [jogosEncontrados, setJogosEncontrados] = useState<JogoFutebol[]>([])
  const [mostrarJogos, setMostrarJogos] = useState(false)
  const [jogoSelecionado, setJogoSelecionado] = useState<JogoFutebol | null>(null)

  const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)

  // Busca em tempo real com IMDB
  useEffect(() => {
    if (buscaConteudo.length >= 2 && formData.categoria !== 'esporte') {
      const resultados = []
      
      // Buscar em filmes
      for (const [chave, dados] of Object.entries(acervoCompleto.filmes)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'filme', chave })
        }
      }
      
      // Buscar em séries
      for (const [chave, dados] of Object.entries(acervoCompleto.series)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'serie', chave })
        }
      }
      
      setResultadosBusca(resultados.slice(0, 8))
      setMostrarResultados(true)
    } else {
      setResultadosBusca([])
      setMostrarResultados(false)
    }
  }, [buscaConteudo, formData.categoria])

  // Busca de jogos do GE Globo
  useEffect(() => {
    if (formData.categoria === 'esporte') {
      buscarJogosGEGlobo(buscaConteudo).then(jogos => {
        setJogosEncontrados(jogos)
        setMostrarJogos(jogos.length > 0)
      })
    } else {
      setJogosEncontrados([])
      setMostrarJogos(false)
    }
  }, [buscaConteudo, formData.categoria])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Atualizar logo da revenda se necessário
    if (logoPersonalizada && usuarioLogado?.tipo === 'usuario') {
      onAtualizarLogo(logoPersonalizada, posicaoLogo)
    }
    
    onSubmit({
      categoria: formData.categoria,
      imagem_url: imagemDispositivo || formData.imagem_url,
      sinopse: formData.sinopse,
      data_evento: formData.data_evento
    })
    onClose()
  }

  const selecionarConteudo = async (conteudo: any) => {
    setBuscandoConteudo(true)
    try {
      // Buscar dados atualizados do IMDB
      const dadosIMDB = await buscarConteudoIMDB(conteudo.titulo, conteudo.tipo)
      if (dadosIMDB) {
        setFormData(prev => ({
          ...prev,
          categoria: conteudo.tipo,
          sinopse: dadosIMDB.sinopse,
          imagem_url: dadosIMDB.imagemUrl
        }))
        setDadosEncontrados(dadosIMDB)
      } else {
        setFormData(prev => ({
          ...prev,
          categoria: conteudo.tipo,
          sinopse: conteudo.sinopse,
          imagem_url: conteudo.imagemUrl
        }))
        setDadosEncontrados(conteudo)
      }
    } catch (error) {
      console.error('Erro ao buscar no IMDB:', error)
      setFormData(prev => ({
        ...prev,
        categoria: conteudo.tipo,
        sinopse: conteudo.sinopse,
        imagem_url: conteudo.imagemUrl
      }))
      setDadosEncontrados(conteudo)
    } finally {
      setBuscandoConteudo(false)
      setBuscaConteudo('')
      setMostrarResultados(false)
    }
  }

  const selecionarJogo = (jogo: JogoFutebol) => {
    setJogoSelecionado(jogo)
    setFormData(prev => ({
      ...prev,
      imagem_url: jogo.imagemBanner,
      sinopse: `${jogo.mandante} vs ${jogo.visitante} - ${jogo.campeonato} - ${jogo.estadio}`,
      data_evento: jogo.data
    }))
    setBuscaConteudo('')
    setMostrarJogos(false)
  }

  const buscarDadosEsporte = async () => {
    if (!buscaConteudo || formData.categoria !== 'esporte') return
    
    setBuscandoConteudo(true)
    try {
      const dados = await buscarDadosEsporteGoogle(buscaConteudo)
      if (dados) {
        setDadosEncontrados(dados)
        setFormData(prev => ({
          ...prev,
          imagem_url: dados.imagemJogador,
          data_evento: dados.dataJogo,
          sinopse: `Partida de futebol - ${dados.nome} com destaque para ${dados.jogador}`
        }))
      } else {
        alert('Clube não encontrado. Tente outro nome.')
      }
    } catch (error) {
      console.error('Erro ao buscar dados do esporte:', error)
    } finally {
      setBuscandoConteudo(false)
    }
  }

  const gerarBannerData = (diasOffset: number) => {
    if (dadosEncontrados && formData.categoria === 'esporte') {
      const data = new Date()
      data.setDate(data.getDate() + diasOffset)
      
      let jogo = ''
      if (diasOffset === -1) jogo = dadosEncontrados.jogos.ontem
      else if (diasOffset === 0) jogo = dadosEncontrados.jogos.hoje
      else if (diasOffset === 1) jogo = dadosEncontrados.jogos.amanha
      
      setFormData(prev => ({
        ...prev,
        data_evento: data.toISOString().split('T')[0]
      }))
    }
  }

  const handleImagemDispositivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagemDispositivo(result)
        setFormData(prev => ({ ...prev, imagem_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Busca Inteligente */}
          <div>
            <Label>
              🔍 Busca Inteligente 
              {formData.categoria === 'esporte' ? ' - Jogos do GE Globo' : ' - IMDB.com/pt/'}
            </Label>
            <div className="relative">
              <Input
                value={buscaConteudo}
                onChange={(e) => setBuscaConteudo(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder={
                  formData.categoria === 'esporte' 
                    ? "Digite o nome do time ou campeonato..." 
                    : "Digite o nome do filme ou série..."
                }
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              
              {/* Resultados de Filmes/Séries */}
              {mostrarResultados && resultadosBusca.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {resultadosBusca.map((resultado, index) => (
                    <div
                      key={index}
                      onClick={() => selecionarConteudo(resultado)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0"
                    >
                      <img 
                        src={resultado.imagemUrl} 
                        alt={resultado.titulo}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{resultado.titulo}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{resultado.sinopse}</p>
                        <Badge className={resultado.tipo === 'filme' ? 'bg-red-500' : 'bg-blue-500'}>
                          {resultado.tipo === 'filme' ? 'Filme' : 'Série'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resultados de Jogos */}
              {mostrarJogos && jogosEncontrados.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2 bg-slate-700 border-b border-slate-600">
                    <h4 className="text-white font-medium text-sm">⚽ Jogos do Dia - GE Globo</h4>
                  </div>
                  {jogosEncontrados.map((jogo) => (
                    <div
                      key={jogo.id}
                      onClick={() => selecionarJogo(jogo)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={jogo.imagemMandante} 
                          alt={jogo.mandante}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                        <span className="text-white text-sm font-medium">{jogo.mandante}</span>
                        <span className="text-gray-400 text-xs">vs</span>
                        <span className="text-white text-sm font-medium">{jogo.visitante}</span>
                        <img 
                          src={jogo.imagemVisitante} 
                          alt={jogo.visitante}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {jogo.horario}
                        </div>
                        <p className="text-xs text-purple-300">{jogo.campeonato}</p>
                        <p className="text-xs text-gray-500">{jogo.estadio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select onValueChange={(value) => {
                setFormData({...formData, categoria: value as Banner['categoria']})
                setDadosEncontrados(null)
                setJogoSelecionado(null)
                setBuscaConteudo('')
              }}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="filme">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Filme
                    </div>
                  </SelectItem>
                  <SelectItem value="serie">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Série
                    </div>
                  </SelectItem>
                  <SelectItem value="esporte">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Esporte
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.categoria === 'esporte' && !jogoSelecionado && (
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={buscarDadosEsporte}
                  disabled={buscandoConteudo || !buscaConteudo}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  {buscandoConteudo ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar Clube
                </Button>
              </div>
            )}
          </div>

          {/* Informações do Jogo Selecionado */}
          {jogoSelecionado && (
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">⚽ Jogo Selecionado</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={jogoSelecionado.imagemMandante} alt={jogoSelecionado.mandante} className="w-8 h-8 rounded-full" />
                  <span className="text-white font-medium">{jogoSelecionado.mandante}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-white font-medium">{jogoSelecionado.visitante}</span>
                  <img src={jogoSelecionado.imagemVisitante} alt={jogoSelecionado.visitante} className="w-8 h-8 rounded-full" />
                </div>
                <div className="text-right">
                  <p className="text-purple-300 text-sm">{jogoSelecionado.horario}</p>
                  <p className="text-gray-400 text-xs">{jogoSelecionado.campeonato}</p>
                </div>
              </div>
            </div>
          )}

          {formData.categoria === 'esporte' && dadosEncontrados && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => gerarBannerData(-1)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Ontem
              </Button>
              <Button
                type="button"
                onClick={() => gerarBannerData(0)}
                className="bg-green-600 hover:bg-green-700"
              >
                Hoje
              </Button>
              <Button
                type="button"
                onClick={() => gerarBannerData(1)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Amanhã
              </Button>
            </div>
          )}

          {(formData.categoria === 'filme' || formData.categoria === 'serie') && (
            <div>
              <Label htmlFor="sinopse">Sinopse (Preenchida Automaticamente)</Label>
              <Textarea
                id="sinopse"
                value={formData.sinopse}
                onChange={(e) => setFormData({...formData, sinopse: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Sinopse será preenchida automaticamente..."
                rows={4}
                readOnly
              />
            </div>
          )}

          {formData.categoria === 'esporte' && (
            <div>
              <Label htmlFor="dataEvento">Data do Evento</Label>
              <Input
                id="dataEvento"
                type="date"
                value={formData.data_evento}
                onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}

          {/* Opção de Enviar Imagem do Dispositivo */}
          <div className="space-y-2">
            <Label>📱 Enviar Imagem do Dispositivo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImagemDispositivo}
              className="bg-slate-700 border-slate-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
            />
            {imagemDispositivo && (
              <p className="text-sm text-green-400">✅ Imagem carregada do dispositivo</p>
            )}
          </div>

          <div>
            <Label>Banner Real (Preenchido Automaticamente)</Label>
            <Input
              value={formData.imagem_url}
              onChange={(e) => setFormData({...formData, imagem_url: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="URL da imagem será preenchida automaticamente ou use imagem do dispositivo"
              readOnly={!!imagemDispositivo}
            />
          </div>

          {/* Configuração de Logo Personalizada */}
          <div className="space-y-4 border-t border-slate-600 pt-4">
            <h3 className="text-white font-semibold">Logo Personalizada</h3>
            
            <div>
              <Label htmlFor="logoPersonalizada">URL da Logo (fundo transparente)</Label>
              <Input
                id="logoPersonalizada"
                value={logoPersonalizada || revendaAtual?.logo_personalizada || ''}
                onChange={(e) => setLogoPersonalizada(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://exemplo.com/logo-transparente.png"
              />
            </div>

            <div>
              <Label>Posição da Logo no Banner</Label>
              <Select value={posicaoLogo} onValueChange={(value: 'direita' | 'centro') => setPosicaoLogo(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="direita">Canto Superior Direito</SelectItem>
                  <SelectItem value="centro">Centro do Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Image className="w-4 h-4 mr-2" />
              Criar Banner
            </Button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <Label>Preview do Banner</Label>
        {formData.imagem_url ? (
          <div className="relative rounded-lg overflow-hidden">
            <img src={formData.imagem_url} alt="Preview" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-4">
                {jogoSelecionado && (
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <img src={jogoSelecionado.imagemMandante} alt={jogoSelecionado.mandante} className="w-8 h-8 rounded-full" />
                      <span className="font-bold">{jogoSelecionado.mandante}</span>
                      <span className="text-yellow-300">VS</span>
                      <span className="font-bold">{jogoSelecionado.visitante}</span>
                      <img src={jogoSelecionado.imagemVisitante} alt={jogoSelecionado.visitante} className="w-8 h-8 rounded-full" />
                    </div>
                    <p className="text-sm text-yellow-300">{jogoSelecionado.horario} - {jogoSelecionado.campeonato}</p>
                  </div>
                )}
                {formData.sinopse && !jogoSelecionado && (
                  <p className="text-xs opacity-70 line-clamp-3">{formData.sinopse}</p>
                )}
                {formData.data_evento && (
                  <p className="text-sm text-yellow-300 mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(formData.data_evento).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            {(logoPersonalizada || revendaAtual?.logo_personalizada) && (
              <img 
                src={logoPersonalizada || revendaAtual?.logo_personalizada} 
                alt="Logo"
                className={`absolute bottom-2 w-12 h-12 rounded bg-white/20 backdrop-blur-sm p-1 ${
                  posicaoLogo === 'centro' ? 'left-1/2 transform -translate-x-1/2' : 'left-2'
                }`}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Preview aparecerá aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ClienteDetalhes({ cliente }: { cliente: Cliente }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Nome</Label>
          <p className="text-white font-medium">{cliente.nome}</p>
        </div>
        <div>
          <Label className="text-gray-300">Status</Label>
          <div className="mt-1">
            <Badge className={getStatusColor(cliente.status)}>
              {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div>
          <Label className="text-gray-300">WhatsApp</Label>
          <p className="text-white">{cliente.whatsapp}</p>
        </div>
        <div>
          <Label className="text-gray-300">Plano</Label>
          <p className="text-white">{cliente.plano}</p>
        </div>
        <div>
          <Label className="text-gray-300">Valor Mensal</Label>
          <p className="text-green-400 font-bold">R$ {cliente.valor_mensal.toFixed(2)}</p>
        </div>
        <div>
          <Label className="text-gray-300">Data de Vencimento</Label>
          <p className="text-white">{new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <Label className="text-gray-300">Último Pagamento</Label>
          <p className="text-white">{new Date(cliente.data_ultimo_pagamento).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <Label className="text-gray-300">Data de Cadastro</Label>
          <p className="text-white">{new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      <div>
        <Label className="text-gray-300">Observações</Label>
        <p className="text-white">{cliente.observacoes}</p>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ativo': return 'bg-green-500 hover:bg-green-600'
    case 'vencido': return 'bg-red-500 hover:bg-red-600'
    case 'suspenso': return 'bg-yellow-500 hover:bg-yellow-600'
    case 'inativo': return 'bg-gray-500 hover:bg-gray-600'
    default: return 'bg-gray-500'
  }
}