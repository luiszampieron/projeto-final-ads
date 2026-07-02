import Link from 'next/link'
import { apiServerJson } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'
import { SITUACAO_LABEL, SITUACOES } from '@/lib/situacao'
import ItensOrcamento from '@/components/ItensOrcamento'
import { criarOrcamento } from '../actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function NovoOrcamentoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const paramsSearch = searchParams ? await searchParams : {}
  const sucesso = getMensagem(paramsSearch, 'sucesso')
  const erro = getMensagem(paramsSearch, 'erro')

  const [clientes, produtos] = await Promise.all([
    apiServerJson<Cliente[]>('/clientes'),
    apiServerJson<Produto[]>('/produtos'),
  ])

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Orçamentos</span>
        <h1 className="display-6 fw-bold mb-2">Cadastrar orçamento</h1>
        <p className="text-muted mb-0">
          Preencha o cabeçalho e os itens do orçamento e salve para cadastrá-lo.
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
                <h2 className="h5 mb-1">Novo orçamento</h2>
                <p className="text-muted mb-0">
                  Selecione o cliente e adicione os itens.
                </p>
              </div>
              <Link href="/orcamentos" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

            <form action={criarOrcamento} className="d-flex flex-column gap-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="clienteId" className="form-label">Cliente</label>
                  <select id="clienteId" name="clienteId" className="form-select" defaultValue="" required>
                    <option value="" disabled>Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="situacao" className="form-label">Situação</label>
                  <select id="situacao" name="situacao" className="form-select" defaultValue="pendente">
                    {SITUACOES.map((s) => (
                      <option key={s} value={s}>{SITUACAO_LABEL[s]}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validoAte" className="form-label">Válido até</label>
                  <input id="validoAte" name="validoAte" type="date" className="form-control" />
                </div>

                <div className="col-md-4">
                  <label htmlFor="valorDesconto" className="form-label">Desconto (R$)</label>
                  <input
                    id="valorDesconto"
                    name="valorDesconto"
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="0,00"
                  />
                </div>

                <div className="col-md-8">
                  <label htmlFor="observacoes" className="form-label">Observações</label>
                  <input id="observacoes" name="observacoes" className="form-control" />
                </div>
              </div>

              <div>
                <h3 className="h6 mb-3">Itens</h3>
                <ItensOrcamento produtos={produtos} />
              </div>

              <div>
                <button type="submit" className="btn btn-primary">Salvar orçamento</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
