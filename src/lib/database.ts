import { supabase } from './supabase'
import type { Database } from './supabase'

// Tipos baseados no banco de dados
type Usuario = Database['public']['Tables']['usuarios']['Row']
type Revenda = Database['public']['Tables']['revendas']['Row']
type Cliente = Database['public']['Tables']['clientes']['Row']
type Banner = Database['public']['Tables']['banners']['Row']
type Plano = Database['public']['Tables']['planos']['Row']
type ConfigSistema = Database['public']['Tables']['config_sistema']['Row']

// Função para verificar se Supabase está disponível
const isSupabaseAvailable = () => !!supabase

// Função para verificar conexão com o banco
export const verificarConexao = async (): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('⚠️ Supabase não configurado - usando dados locais')
    return false
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)
    
    if (error) {
      console.warn('⚠️ Erro de conexão com Supabase:', error.message)
      return false
    }
    
    return true
  } catch (error) {
    console.warn('⚠️ Erro de conexão com Supabase:', error)
    return false
  }
}

// Serviços para Usuários
export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async criar(usuario: Database['public']['Tables']['usuarios']['Insert']): Promise<Usuario> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert(usuario)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async atualizar(id: string, usuario: Database['public']['Tables']['usuarios']['Update']): Promise<Usuario> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async excluir(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Serviços para Revendas
export const revendaService = {
  async listar(): Promise<Revenda[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('revendas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async buscarPorEmail(email: string): Promise<Revenda | null> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('revendas')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async criar(revenda: Database['public']['Tables']['revendas']['Insert']): Promise<Revenda> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('revendas')
      .insert(revenda)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async atualizar(id: string, revenda: Database['public']['Tables']['revendas']['Update']): Promise<Revenda> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('revendas')
      .update(revenda)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async excluir(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { error } = await supabase
      .from('revendas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Serviços para Clientes
export const clienteService = {
  async listar(usuarioId?: string): Promise<Cliente[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    let query = supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (usuarioId) {
      query = query.eq('usuario_id', usuarioId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  async buscarPorId(id: string): Promise<Cliente | null> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async criar(cliente: Database['public']['Tables']['clientes']['Insert']): Promise<Cliente> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async atualizar(id: string, cliente: Database['public']['Tables']['clientes']['Update']): Promise<Cliente> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async excluir(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async listarVencendoEm(dias: number, usuarioId?: string): Promise<Cliente[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + dias)
    
    let query = supabase
      .from('clientes')
      .select('*')
      .lte('data_vencimento', dataLimite.toISOString().split('T')[0])
      .order('data_vencimento', { ascending: true })
    
    if (usuarioId) {
      query = query.eq('usuario_id', usuarioId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }
}

// Serviços para Banners
export const bannerService = {
  async listar(usuarioId?: string): Promise<Banner[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    let query = supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (usuarioId) {
      query = query.eq('usuario_id', usuarioId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  async criar(banner: Database['public']['Tables']['banners']['Insert']): Promise<Banner> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('banners')
      .insert(banner)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async excluir(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Serviços para Planos
export const planoService = {
  async listar(): Promise<Plano[]> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .eq('ativo', true)
      .order('valor', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async criar(plano: Database['public']['Tables']['planos']['Insert']): Promise<Plano> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('planos')
      .insert(plano)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async atualizar(id: string, plano: Database['public']['Tables']['planos']['Update']): Promise<Plano> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('planos')
      .update(plano)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Serviços para Configurações do Sistema
export const configService = {
  async obter(): Promise<ConfigSistema | null> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('config_sistema')
      .select('*')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async atualizar(config: Database['public']['Tables']['config_sistema']['Update']): Promise<ConfigSistema> {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error('Supabase não configurado')
    }

    // Primeiro, tenta atualizar
    const { data: existingData } = await supabase
      .from('config_sistema')
      .select('id')
      .limit(1)
      .single()
    
    if (existingData) {
      // Atualiza registro existente
      const { data, error } = await supabase
        .from('config_sistema')
        .update(config)
        .eq('id', existingData.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Cria novo registro
      const { data, error } = await supabase
        .from('config_sistema')
        .insert(config as Database['public']['Tables']['config_sistema']['Insert'])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  }
}

// Função para inicializar dados padrão
export const inicializarDados = async () => {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('⚠️ Supabase não configurado - pulando inicialização de dados')
    return
  }

  try {
    // Verificar se já existe usuário admin
    const adminExistente = await usuarioService.buscarPorEmail('admin@iptv.com')
    
    if (!adminExistente) {
      await usuarioService.criar({
        id: 'admin',
        nome: 'Administrador',
        email: 'admin@iptv.com',
        senha: 'admin123',
        tipo: 'admin',
        ativo: true,
        data_cadastro: new Date().toISOString().split('T')[0],
        ultimo_acesso: new Date().toISOString()
      })
    }

    // Verificar se já existem planos
    const planosExistentes = await planoService.listar()
    
    if (planosExistentes.length === 0) {
      const planosIniciais = [
        { nome: 'Básico', valor: 29.90, canais: '100+ canais', descricao: 'Plano básico com canais essenciais', ativo: true },
        { nome: 'Premium', valor: 49.90, canais: '200+ canais + filmes', descricao: 'Plano premium com filmes inclusos', ativo: true },
        { nome: 'Ultra', valor: 79.90, canais: '300+ canais + filmes + séries', descricao: 'Plano completo com séries', ativo: true },
        { nome: 'Família', valor: 99.90, canais: '400+ canais + múltiplas telas', descricao: 'Plano familiar com múltiplas telas', ativo: true }
      ]

      for (const plano of planosIniciais) {
        await planoService.criar(plano)
      }
    }

    // Verificar se já existe configuração do sistema
    const configExistente = await configService.obter()
    
    if (!configExistente) {
      await configService.atualizar({
        logo_url: '',
        nome_sistema: 'IPTV Manager Pro',
        cor_primaria: '#7c3aed',
        cor_secundaria: '#a855f7'
      })
    }

    console.log('✅ Dados iniciais configurados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao inicializar dados:', error)
  }
}