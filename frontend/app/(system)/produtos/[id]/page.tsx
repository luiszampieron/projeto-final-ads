import Link from 'next/link'
import { apiServerJson } from '@/lib/api-server'
import type { Produto } from '@/types/produtos'
import { atualizarProduto, removerProduto } from '../actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function ProdutoPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const paramsSearch = searchParams ? await searchParams : {}
  const sucesso = getMensagem(paramsSearch, 'sucesso')
  const erro = getMensagem(paramsSearch, 'erro')
  const produto = await apiServerJson<Produto>(`/produtos/${params.id}`)

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Produtos</span>
        <h1 className="display-6 fw-bold mb-2">Editar produto</h1>
        <p className="text-muted mb-0">
          Atualize os dados do produto e salve as alterações.
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
                <h2 className="h5 mb-1">Produto #{produto.id}</h2>
                <p className="text-muted mb-0">{produto.nome}</p>
              </div>
              <Link href="/produtos" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

            <form action={atualizarProduto} className="row g-3 mb-4">
              <input type="hidden" name="id" value={produto.id} />

              <div className="col-md-6">
                <label htmlFor="nome" className="form-label">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  className="form-control"
                  maxLength={200}
                  defaultValue={produto.nome}
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
                  defaultValue={produto.codigoSku ?? ''}
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
                  defaultValue={produto.descricao ?? ''}
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
                  defaultValue={Number(produto.precoUnitario).toFixed(2)}
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
                  defaultValue={produto.unidade}
                />
              </div>

              <div className="col-md-4 form-check mt-4">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={produto.ativo}
                />
                <label htmlFor="ativo" className="form-check-label">
                  Ativo
                </label>
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary">
                  Salvar alterações
                </button>
              </div>
            </form>

            <div className="border-top pt-4">
              <form action={removerProduto}>
                <input type="hidden" name="id" value={produto.id} />
                <button type="submit" className="btn btn-outline-danger">
                  Excluir produto
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
