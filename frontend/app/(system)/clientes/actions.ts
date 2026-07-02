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

export async function criarCliente(formData: FormData) {
  const nome = String(formData.get('nome') ?? '').trim()
  const documento = String(formData.get('documento') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const observacoes = String(formData.get('observacoes') ?? '').trim()

  if (!nome) {
    redirect('/clientes/novo?erro=Informe%20o%20nome%20do%20cliente.')
  }

  const response = await apiServerFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify({ nome, documento: documento || undefined, email: email || undefined, telefone: telefone || undefined, observacoes: observacoes || undefined }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível criar o cliente.')
    redirect(`/clientes/novo?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/clientes')
  redirect('/clientes?sucesso=Cliente%20criado%20com%20sucesso.')
}

export async function removerCliente(formData: FormData) {
  const id = Number(formData.get('id'))

  if (Number.isNaN(id) || id <= 0) {
    redirect('/clientes?erro=ID%20de%20cliente%20inválido.')
  }

  const response = await apiServerFetch(`/clientes/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível remover o cliente.')
    redirect(`/clientes?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/clientes')
  redirect('/clientes?sucesso=Cliente%20removido%20com%20sucesso.')
}

export async function atualizarCliente(formData: FormData) {
  const id = Number(formData.get('id'))
  const nome = String(formData.get('nome') ?? '').trim()
  const documento = String(formData.get('documento') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const observacoes = String(formData.get('observacoes') ?? '').trim()

  if (Number.isNaN(id) || id <= 0) {
    redirect('/clientes?erro=ID%20de%20cliente%20inválido.')
  }

  if (!nome) {
    redirect(`/clientes/${id}?erro=Informe%20o%20nome%20do%20cliente.`)
  }

  const response = await apiServerFetch(`/clientes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ nome, documento: documento || undefined, email: email || undefined, telefone: telefone || undefined, observacoes: observacoes || undefined }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível atualizar o cliente.')
    redirect(`/clientes/${id}?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/clientes')
  redirect(`/clientes/${id}?sucesso=Cliente%20atualizado%20com%20sucesso.`)
}
