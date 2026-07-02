import Link from 'next/link'
import { criarProduto } from '../actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function NovoProdutoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const paramsSearch = searchParams ? await searchParams : {}
  const sucesso = getMensagem(paramsSearch, 'sucesso')
  const erro = getMensagem(paramsSearch, 'erro')

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Produtos</span>
        <h1 className="display-6 fw-bold mb-2">Cadastrar produto</h1>
        <p className="text-muted mb-0">
          Preencha os dados do produto e salve para cadastrá-lo.
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
        <div className="card surface-card">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h2 className="h5 mb-1">Novo produto</h2>
                <p className="text-muted mb-0">Informe os dados do produto.</p>
              </div>
              <Link href="/produtos" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

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

              <div className="col-12 d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary">
                  Salvar produto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
