export interface Cliente {
  id: number
  nome: string
  documento?: string | null
  email?: string | null
  telefone?: string | null
  observacoes?: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface NovoCliente {
  nome: string
  documento?: string
  email?: string
  telefone?: string
  observacoes?: string
}

export interface AtualizarCliente extends Partial<NovoCliente> {}
