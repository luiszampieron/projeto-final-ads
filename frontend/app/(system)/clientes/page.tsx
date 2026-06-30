import Link from 'next/link'
import { apiServerJson } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'
import { criarCliente, removerCliente } from './actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : {}
  const nomeFiltro = typeof params.nome === 'string' ? params.nome : ''
  const documentoFiltro = typeof params.documento === 'string' ? params.documento : ''

  const query = new URLSearchParams()
  if (nomeFiltro) query.set('nome', nomeFiltro)
  if (documentoFiltro) query.set('documento', documentoFiltro)

  const clientes = await apiServerJson<Cliente[]>(
    `/clientes${query.toString() ? `?${query.toString()}` : ''}`,
  )

  const sucesso = getMensagem(params, 'sucesso')
  const erro = getMensagem(params, 'erro')

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Clientes</span>
        <h1 className="display-6 fw-bold mb-2">Cadastro de clientes</h1>
        <p className="text-muted mb-0">Liste, filtre, cadastre, edite e exclua clientes.</p>
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

      <div className="col-12">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card surface-card h-100">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Filtros</h2>
                <form className="row g-3" method="get">
                  <div className="col-12">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input id="nome" name="nome" defaultValue={nomeFiltro} className="form-control" placeholder="Buscar por nome" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="documento" className="form-label">Documento</label>
                    <input id="documento" name="documento" defaultValue={documentoFiltro} className="form-control" placeholder="Buscar por documento" />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">Aplicar filtros</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card surface-card h-100">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Cadastrar cliente</h2>
                <form action={criarCliente} className="row g-3">
                  <div className="col-12">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input id="nome" name="nome" className="form-control" maxLength={200} required />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="documento" className="form-label">Documento</label>
                    <input id="documento" name="documento" className="form-control" maxLength={20} />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" name="email" type="email" className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefone" className="form-label">Telefone</label>
                    <input id="telefone" name="telefone" className="form-control" maxLength={30} />
                  </div>

                  <div className="col-12">
                    <label htmlFor="observacoes" className="form-label">Observações</label>
                    <textarea id="observacoes" name="observacoes" className="form-control" rows={3} />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">Salvar cliente</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card surface-card">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Clientes cadastrados</h2>
            {clientes.length === 0 ? (
              <p className="text-muted mb-0">Nenhum cliente encontrado para os filtros atuais.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Documento</th>
                      <th>Email</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.nome}</td>
                        <td>{c.documento ?? '-'}</td>
                        <td>{c.email ?? '-'}</td>
                        <td className="text-end">
                          <Link href={`/clientes/${c.id}`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                          <form action={removerCliente} className="d-inline">
                            <input type="hidden" name="id" value={c.id} />
                            <button type="submit" className="btn btn-sm btn-outline-danger">Excluir</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
