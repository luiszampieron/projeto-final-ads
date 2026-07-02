import type { SituacaoOrcamento } from '@/types/orcamentos'

export const SITUACOES: SituacaoOrcamento[] = [
  'pendente',
  'enviado',
  'aprovado',
  'rejeitado',
  'cancelado',
]

export const SITUACAO_LABEL: Record<SituacaoOrcamento, string> = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado',
}

export const SITUACAO_COLOR: Record<SituacaoOrcamento, string> = {
  pendente: '#c9a227',
  enviado: '#3a7ca5',
  aprovado: '#588157',
  rejeitado: '#b3452c',
  cancelado: '#8a8f87',
}
