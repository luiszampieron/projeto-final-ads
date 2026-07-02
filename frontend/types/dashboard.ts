import type { SituacaoOrcamento } from './orcamentos'

export interface DashboardResumo {
  totalOrcamentos: number
  totalClientes: number
  totalProdutosAtivos: number
}

export interface OrcamentosPorStatus {
  situacao: SituacaoOrcamento
  total: number
}

export interface SerieMensalQuantidade {
  ano: number
  mes: number
  total: number
}

export interface SerieMensalValor {
  ano: number
  mes: number
  total: number
}

export interface TopClienteOrcamentos {
  clienteId: number
  nome: string
  totalOrcamentos: number
}

export interface TopProdutoOrcado {
  produtoId: number
  nome: string
  totalOcorrencias: number
}
