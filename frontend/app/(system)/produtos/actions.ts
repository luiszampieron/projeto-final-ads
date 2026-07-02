'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'

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

export async function criarProduto(formData: FormData) {
  const nome = String(formData.get('nome') ?? '').trim()
  const codigoSku = String(formData.get('codigoSku') ?? '').trim()
  const descricao = String(formData.get('descricao') ?? '').trim()
  const precoRaw = String(formData.get('precoUnitario') ?? '').trim()
  const unidade = String(formData.get('unidade') ?? '').trim()
  const ativo = formData.get('ativo') === 'on'

  if (!nome) {
    redirect('/produtos/novo?erro=Informe%20o%20nome%20do%20produto.')
  }

  const precoUnitario = Number(precoRaw.replace(',', '.'))
  if (!precoRaw || Number.isNaN(precoUnitario) || precoUnitario < 0) {
    redirect('/produtos/novo?erro=Informe%20um%20preço%20unitário%20válido.')
  }

  const response = await apiServerFetch('/produtos', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      codigoSku: codigoSku || undefined,
      descricao: descricao || undefined,
      precoUnitario,
      unidade: unidade || undefined,
      ativo,
    }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível criar o produto.')
    redirect(`/produtos/novo?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/produtos')
  redirect('/produtos?sucesso=Produto%20criado%20com%20sucesso.')
}

export async function atualizarProduto(formData: FormData) {
  const id = Number(formData.get('id'))
  const nome = String(formData.get('nome') ?? '').trim()
  const codigoSku = String(formData.get('codigoSku') ?? '').trim()
  const descricao = String(formData.get('descricao') ?? '').trim()
  const precoRaw = String(formData.get('precoUnitario') ?? '').trim()
  const unidade = String(formData.get('unidade') ?? '').trim()
  const ativo = formData.get('ativo') === 'on'

  if (Number.isNaN(id) || id <= 0) {
    redirect('/produtos?erro=ID%20de%20produto%20inválido.')
  }

  if (!nome) {
    redirect(`/produtos/${id}?erro=Informe%20o%20nome%20do%20produto.`)
  }

  const precoUnitario = Number(precoRaw.replace(',', '.'))
  if (!precoRaw || Number.isNaN(precoUnitario) || precoUnitario < 0) {
    redirect(`/produtos/${id}?erro=Informe%20um%20preço%20unitário%20válido.`)
  }

  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nome,
      codigoSku: codigoSku || undefined,
      descricao: descricao || undefined,
      precoUnitario,
      unidade: unidade || undefined,
      ativo,
    }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível atualizar o produto.')
    redirect(`/produtos/${id}?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/produtos')
  redirect(`/produtos/${id}?sucesso=Produto%20atualizado%20com%20sucesso.`)
}

export async function removerProduto(formData: FormData) {
  const id = Number(formData.get('id'))

  if (Number.isNaN(id) || id <= 0) {
    redirect('/produtos?erro=ID%20de%20produto%20inválido.')
  }

  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível remover o produto.')
    redirect(`/produtos?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/produtos')
  redirect('/produtos?sucesso=Produto%20removido%20com%20sucesso.')
}
