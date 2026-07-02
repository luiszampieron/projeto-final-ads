'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'
import type {
  AtualizarOrcamento,
  ItemOrcamentoInput,
  NovoOrcamento,
  SituacaoOrcamento,
} from '@/types/orcamentos'

function lerMensagemErro(data: unknown, fallback: string) {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: string | string[] }).message
    if (Array.isArray(message)) return message.join(' ')
    if (message) return message
  }
  return fallback
}

async function obterErro(response: Response, fallback: string) {
  try {
    return lerMensagemErro(await response.json(), fallback)
  } catch {
    return fallback
  }
}

function paraNumero(valor: FormDataEntryValue | null | undefined): number | undefined {
  const texto = String(valor ?? '').trim().replace(',', '.')
  if (!texto) return undefined
  const numero = Number(texto)
  return Number.isFinite(numero) ? numero : undefined
}

function montarItens(formData: FormData): ItemOrcamentoInput[] {
  const produtoIds = formData.getAll('produtoId[]')
  const quantidades = formData.getAll('quantidade[]')
  const precos = formData.getAll('precoUnitario[]')

  const itens: ItemOrcamentoInput[] = []

  produtoIds.forEach((valor, indice) => {
    const produtoId = Number(valor)
    const quantidade = paraNumero(quantidades[indice])
    const precoUnitario = paraNumero(precos[indice])

    if (produtoId > 0 && quantidade && quantidade > 0) {
      itens.push({ produtoId, quantidade, precoUnitario })
    }
  })

  return itens
}

export async function criarOrcamento(formData: FormData) {
  const clienteId = Number(formData.get('clienteId'))
  const valorDesconto = paraNumero(formData.get('valorDesconto'))
  const validoAte = String(formData.get('validoAte') ?? '').trim()
  const observacoes = String(formData.get('observacoes') ?? '').trim()
  const situacao = String(formData.get('situacao') ?? '').trim()
  const itens = montarItens(formData)

  if (!clienteId) {
    redirect('/orcamentos/novo?erro=Selecione%20um%20cliente.')
  }
  if (itens.length === 0) {
    redirect('/orcamentos/novo?erro=Informe%20ao%20menos%20um%20item%20v%C3%A1lido.')
  }

  const corpo: NovoOrcamento = {
    clienteId,
    itens,
    valorDesconto,
    validoAte: validoAte || undefined,
    observacoes: observacoes || undefined,
    situacao: situacao ? (situacao as SituacaoOrcamento) : undefined,
  }

  const response = await apiServerFetch('/orcamentos', {
    method: 'POST',
    body: JSON.stringify(corpo),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível criar o orçamento.')
    redirect(`/orcamentos/novo?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/orcamentos')
  redirect('/orcamentos?sucesso=Or%C3%A7amento%20criado%20com%20sucesso.')
}

export async function atualizarOrcamento(formData: FormData) {
  const id = Number(formData.get('id'))
  const clienteId = Number(formData.get('clienteId'))
  const valorDesconto = paraNumero(formData.get('valorDesconto'))
  const validoAte = String(formData.get('validoAte') ?? '').trim()
  const observacoes = String(formData.get('observacoes') ?? '').trim()
  const situacao = String(formData.get('situacao') ?? '').trim()
  const itens = montarItens(formData)

  if (Number.isNaN(id) || id <= 0) {
    redirect('/orcamentos?erro=ID%20de%20or%C3%A7amento%20inv%C3%A1lido.')
  }
  if (itens.length === 0) {
    redirect(`/orcamentos/${id}?erro=Informe%20ao%20menos%20um%20item%20v%C3%A1lido.`)
  }

  const corpo: AtualizarOrcamento = {
    clienteId: clienteId || undefined,
    itens,
    valorDesconto,
    validoAte: validoAte || undefined,
    observacoes: observacoes || undefined,
    situacao: situacao ? (situacao as SituacaoOrcamento) : undefined,
  }

  const response = await apiServerFetch(`/orcamentos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(corpo),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível atualizar o orçamento.')
    redirect(`/orcamentos/${id}?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/orcamentos')
  revalidatePath(`/orcamentos/${id}`)
  redirect(`/orcamentos/${id}?sucesso=Or%C3%A7amento%20atualizado%20com%20sucesso.`)
}
