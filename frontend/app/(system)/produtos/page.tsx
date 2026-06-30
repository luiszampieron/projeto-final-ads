import Link from 'next/link'
import { apiServerJson } from '@/lib/api-server'
import type { Produto } from '@/types/produtos'
import { criarProduto, removerProduto } from './actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : {}
  const nomeFiltro =
    typeof params.nome === 'string' ? params.nome : ''
  const ativoFiltro =
    typeof params.ativo === 'string' ? params.ativo : ''

  const query = new URLSearchParams()
  if (nomeFiltro) query.set('nome', nomeFiltro)
  if (ativoFiltro) query.set('ativo', ativoFiltro)

  const queryString = query.toString()
  const produtos = await apiServerJson<Produto[]>(
    `/produtos${queryString ? `?${queryString}` : ''}`,
  )

  const sucesso = getMensagem(params, 'sucesso')
  const erro = getMensagem(params, 'erro')

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Produtos</span>
        <h1 className="display-6 fw-bold mb-2">Cadastro de produtos</h1>
        <p className="text-muted mb-0">
          Liste, filtre, cadastre, edite e exclua produtos.
        </p>
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
                    <label htmlFor="nome" className="form-label">
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      defaultValue={nomeFiltro}
                      className="form-control"
                      placeholder="Buscar por nome"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="ativo" className="form-label">
                      Status
                    </label>
                    <select
                      id="ativo"
                      name="ativo"
                      defaultValue={ativoFiltro}
                      className="form-select"
                    >
                      <option value="">Todos</option>
                      <option value="true">Ativos</option>
                      <option value="false">Inativos</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Aplicar filtros
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card surface-card h-100">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Cadastrar produto</h2>
                <form action={criarProduto} className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nome" className="form-label">
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      className="form-control"
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="codigoSku" className="form-label">
                      Código SKU
                    </label>
                    <input
                      id="codigoSku"
                      name="codigoSku"
                      className="form-control"
                      maxLength={80}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="descricao" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      className="form-control"
                      rows={3}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="precoUnitario" className="form-label">
                      Preço unitário
                    </label>
                    <input
                      id="precoUnitario"
                      name="precoUnitario"
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="unidade" className="form-label">
                      Unidade
                    </label>
                    <input
                      id="unidade"
                      name="unidade"
                      className="form-control"
                      maxLength={20}
                      placeholder="UN"
                    />
                  </div>

                  <div className="col-md-4 form-check mt-4">
                    <input
                      id="ativo"
                      name="ativo"
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked
                    />
                    <label htmlFor="ativo" className="form-check-label">
                      Ativo
                    </label>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Salvar produto
                    </button>
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
            <h2 className="h5 mb-3">Produtos cadastrados</h2>
            {produtos.length === 0 ? (
              <p className="text-muted mb-0">
                Nenhum produto encontrado para os filtros atuais.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Preço</th>
                      <th>Unidade</th>
                      <th>Status</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id}>
                        <td>{produto.id}</td>
                        <td>{produto.nome}</td>
                        <td>R$ {Number(produto.precoUnitario).toFixed(2)}</td>
                        <td>{produto.unidade}</td>
                        <td>{produto.ativo ? 'Ativo' : 'Inativo'}</td>
                        <td className="text-end">
                          <Link
                            href={`/produtos/${produto.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Editar
                          </Link>
                          <form action={removerProduto} className="d-inline">
                            <input type="hidden" name="id" value={produto.id} />
                            <button
                              type="submit"
                              className="btn btn-sm btn-outline-danger"
                            >
                              Excluir
                            </button>
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
