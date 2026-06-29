import { apiServerJson } from '@/lib/api-server'
import type { UsuarioAtual } from '@/types/usuario'
import { alterarSenha, atualizarPerfil } from './actions'

function formatarData(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(valor))
}

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function UsuarioPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const usuario = await apiServerJson<UsuarioAtual>('/usuarios/atual')
  const params = searchParams ? await searchParams : {}
  const sucesso = getMensagem(params, 'sucesso')
  const erro = getMensagem(params, 'erro')

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Minha conta</span>
        <h1 className="display-6 fw-bold mb-0">Perfil do usuário</h1>
      </div>

      {sucesso && (
        <div className="col-12">
          <div className="alert alert-success mb-0">{sucesso}</div>
        </div>
      )}

      {erro && (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{erro}</div>
        </div>
      )}

      <div className="col-lg-5">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Dados da conta</h2>

            <dl className="profile-list row mb-0">
              <dt className="col-sm-5">ID</dt>
              <dd className="col-sm-7">{usuario.id}</dd>

              <dt className="col-sm-5">Nome</dt>
              <dd className="col-sm-7">{usuario.nomeCompleto}</dd>

              <dt className="col-sm-5">Email</dt>
              <dd className="col-sm-7">{usuario.email}</dd>

              <dt className="col-sm-5">Perfil</dt>
              <dd className="col-sm-7 text-capitalize">{usuario.perfil}</dd>

              <dt className="col-sm-5">Ativo</dt>
              <dd className="col-sm-7">{usuario.ativo ? 'Sim' : 'Não'}</dd>

              <dt className="col-sm-5">Criado em</dt>
              <dd className="col-sm-7">{formatarData(usuario.criadoEm)}</dd>

              <dt className="col-sm-5">Atualizado em</dt>
              <dd className="col-sm-7">{formatarData(usuario.atualizadoEm)}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card surface-card mb-4">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Editar perfil</h2>

            <form action={atualizarPerfil}>
              <div className="mb-3">
                <label htmlFor="nomeCompleto" className="form-label">
                  Nome completo
                </label>
                <input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  className="form-control"
                  defaultValue={usuario.nomeCompleto}
                  maxLength={200}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  defaultValue={usuario.email}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Salvar alterações
              </button>
            </form>
          </div>
        </div>

        <div className="card surface-card">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Alterar senha</h2>

            <form action={alterarSenha}>
              <div className="mb-3">
                <label htmlFor="senhaAtual" className="form-label">
                  Senha atual
                </label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  className="form-control"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="novaSenha" className="form-label">
                  Nova senha
                </label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmarSenha" className="form-label">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline-primary">
                Alterar senha
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
