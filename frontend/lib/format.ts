export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarData(valor?: string | null): string {
  if (!valor) return '-'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(valor))
}

export function formatarDataHora(valor: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(valor))
}
