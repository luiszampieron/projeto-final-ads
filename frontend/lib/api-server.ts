import 'server-only'

import { cookies } from 'next/headers'

export type ApiErrorBody = {
  message?: string | string[]
  mensagem?: string
  error?: string
  codigo?: string
  detalhes?: string[]
  statusCode?: number
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

/** Chamada autenticada ao backend (JWT em cookie `jwt-token`). Só no servidor. */
export async function apiServerFetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	
	const base = (process.env.BACKEND_API_URL ?? '').replace(/\/$/, '')
	const p = path.startsWith('/') ? path : `/${path}`
	const jwt = (await cookies()).get('jwt-token')?.value ?? ''
	const headers = new Headers(init?.headers)
	headers.set('Authorization', `Bearer ${jwt}`)
	headers.set('Content-Type', 'application/json')

	return fetch(`${base}${p}`, { ...init, headers })
}

export async function apiServerJson<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const response = await apiServerFetch(path, init)

	if (!response.ok) {
		let mensagem = 'Não foi possível concluir a requisição.'
		let body: ApiErrorBody | undefined

		try {
			const erro = (await response.json()) as ApiErrorBody
			body = erro
			if (Array.isArray(erro.message)) {
				mensagem = erro.message.join(' ')
			} else if (erro.message) {
				mensagem = erro.message
			} else if (erro.mensagem) {
				mensagem = erro.mensagem
			} else if (erro.detalhes?.length) {
				mensagem = erro.detalhes.join(' ')
			} else if (erro.error) {
				mensagem = erro.error
			}
		} catch {
			mensagem = response.statusText || mensagem
		}

		throw new ApiRequestError(mensagem, response.status, body)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json() as Promise<T>
}