'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiServerFetch } from '@/lib/api-server'

function lerMensagemErro(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data
  ) {
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

export async function atualizarPerfil(formData: FormData) {
  const nomeCompleto = String(formData.get('nomeCompleto') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()

  if (!nomeCompleto || !email) {
    redirect('/usuario?erro=Preencha%20nome%20e%20email.')
  }

  const response = await apiServerFetch('/usuarios/atual', {
    method: 'PATCH',
    body: JSON.stringify({ nomeCompleto, email }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível atualizar o perfil.')
    redirect(`/usuario?erro=${encodeURIComponent(mensagem)}`)
  }

  revalidatePath('/usuario')
  redirect('/usuario?sucesso=Perfil%20atualizado%20com%20sucesso.')
}

export async function alterarSenha(formData: FormData) {
  const senhaAtual = String(formData.get('senhaAtual') ?? '')
  const novaSenha = String(formData.get('novaSenha') ?? '')
  const confirmarSenha = String(formData.get('confirmarSenha') ?? '')

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    redirect('/usuario?erro=Preencha%20todos%20os%20campos%20da%20senha.')
  }

  if (novaSenha.length < 6) {
    redirect('/usuario?erro=A%20nova%20senha%20deve%20ter%20pelo%20menos%206%20caracteres.')
  }

  if (novaSenha !== confirmarSenha) {
    redirect('/usuario?erro=A%20confirma%C3%A7%C3%A3o%20da%20senha%20n%C3%A3o%20confere.')
  }

  const response = await apiServerFetch('/usuarios/atual/senha', {
    method: 'PATCH',
    body: JSON.stringify({ senhaAtual, novaSenha }),
  })

  if (!response.ok) {
    const mensagem = await obterErro(response, 'Não foi possível alterar a senha.')
    redirect(`/usuario?erro=${encodeURIComponent(mensagem)}`)
  }

  redirect('/usuario?sucesso=Senha%20alterada%20com%20sucesso.')
}
