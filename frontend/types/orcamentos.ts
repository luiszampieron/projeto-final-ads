export type SituacaoOrcamento =
  | 'pendente'
  | 'enviado'
  | 'aprovado'
  | 'rejeitado'
  | 'cancelado'

export interface ClienteResumo {
  id: number
  nome: string
  documento?: string | null
  email?: string | null
  telefone?: string | null
}

export interface UsuarioResumo {
  id: number
  nomeCompleto: string
  email: string
}

export interface ItemOrcamento {
  id: number
  produtoId: number
  nomeProdutoRegistro: string
  precoUnitarioRegistro: number
  quantidade: number
  totalLinha: number
}

export interface Orcamento {
  id: number
  clienteId: number
  cliente?: ClienteResumo
  usuarioAutorId: number
  usuarioAutor?: UsuarioResumo
  situacao: SituacaoOrcamento
  subtotal: number
  valorDesconto: number
  total: number
  validoAte: string | null
  observacoes: string | null
  criadoEm: string
  atualizadoEm: string
  itens: ItemOrcamento[]
}

export interface ItemOrcamentoInput {
  produtoId: number
  quantidade: number
  precoUnitario?: number
}

export interface NovoOrcamento {
  clienteId: number
  valorDesconto?: number
  validoAte?: string
  observacoes?: string
  situacao?: SituacaoOrcamento
  itens: ItemOrcamentoInput[]
}

export interface AtualizarOrcamento extends Partial<Omit<NovoOrcamento, 'itens'>> {
  itens?: ItemOrcamentoInput[]
}
