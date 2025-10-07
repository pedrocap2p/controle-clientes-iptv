import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Criar cliente Supabase apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Flag para verificar se o Supabase está disponível
export const isSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          senha: string
          tipo: 'admin' | 'usuario'
          ativo: boolean
          data_cadastro: string
          ultimo_acesso: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          senha: string
          tipo?: 'admin' | 'usuario'
          ativo?: boolean
          data_cadastro?: string
          ultimo_acesso?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          senha?: string
          tipo?: 'admin' | 'usuario'
          ativo?: boolean
          data_cadastro?: string
          ultimo_acesso?: string
          updated_at?: string
        }
      }
      revendas: {
        Row: {
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
          logo_personalizada: string | null
          posicao_logo: 'direita' | 'centro'
          dias_alerta_vencimento: number
          tipo: 'master' | 'simples'
          permissoes: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          senha: string
          ativo?: boolean
          data_vencimento: string
          valor_mensal: number
          data_cadastro?: string
          ultimo_acesso?: string
          bloqueado?: boolean
          observacoes?: string
          logo_personalizada?: string | null
          posicao_logo?: 'direita' | 'centro'
          dias_alerta_vencimento?: number
          tipo?: 'master' | 'simples'
          permissoes?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          senha?: string
          ativo?: boolean
          data_vencimento?: string
          valor_mensal?: number
          data_cadastro?: string
          ultimo_acesso?: string
          bloqueado?: boolean
          observacoes?: string
          logo_personalizada?: string | null
          posicao_logo?: 'direita' | 'centro'
          dias_alerta_vencimento?: number
          tipo?: 'master' | 'simples'
          permissoes?: any
          updated_at?: string
        }
      }
      clientes: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          whatsapp: string
          plano: string
          status?: 'ativo' | 'inativo' | 'suspenso' | 'vencido'
          data_vencimento: string
          valor_mensal: number
          data_ultimo_pagamento?: string
          observacoes?: string
          data_cadastro?: string
          usuario_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          whatsapp?: string
          plano?: string
          status?: 'ativo' | 'inativo' | 'suspenso' | 'vencido'
          data_vencimento?: string
          valor_mensal?: number
          data_ultimo_pagamento?: string
          observacoes?: string
          data_cadastro?: string
          usuario_id?: string
          updated_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          categoria: 'filme' | 'serie' | 'esporte'
          imagem_url: string
          logo_url: string | null
          usuario_id: string
          data_criacao: string
          sinopse: string | null
          data_evento: string | null
          logo_personalizada: string | null
          posicao_logo: 'direita' | 'centro'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          categoria: 'filme' | 'serie' | 'esporte'
          imagem_url: string
          logo_url?: string | null
          usuario_id: string
          data_criacao?: string
          sinopse?: string | null
          data_evento?: string | null
          logo_personalizada?: string | null
          posicao_logo?: 'direita' | 'centro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          categoria?: 'filme' | 'serie' | 'esporte'
          imagem_url?: string
          logo_url?: string | null
          usuario_id?: string
          data_criacao?: string
          sinopse?: string | null
          data_evento?: string | null
          logo_personalizada?: string | null
          posicao_logo?: 'direita' | 'centro'
          updated_at?: string
        }
      }
      planos: {
        Row: {
          id: string
          nome: string
          valor: number
          canais: string
          descricao: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          valor: number
          canais: string
          descricao: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          valor?: number
          canais?: string
          descricao?: string
          ativo?: boolean
          updated_at?: string
        }
      }
      config_sistema: {
        Row: {
          id: string
          logo_url: string
          nome_sistema: string
          cor_primaria: string
          cor_secundaria: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string
          nome_sistema?: string
          cor_primaria?: string
          cor_secundaria?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string
          nome_sistema?: string
          cor_primaria?: string
          cor_secundaria?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}