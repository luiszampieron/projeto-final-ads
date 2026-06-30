export interface Produto {
  id: number
  codigoSku?: string | null
  nome: string
  descricao?: string | null
  precoUnitario: string
  unidade: string
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface NovoProduto {
  codigoSku?: string
  nome: string
  descricao?: string
  precoUnitario: number
  unidade?: string
  ativo?: boolean
}

export interface AtualizarProduto extends Partial<NovoProduto> {}
