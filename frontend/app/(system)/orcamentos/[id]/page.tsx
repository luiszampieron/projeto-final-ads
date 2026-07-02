import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ApiRequestError, apiServerJson } from '@/lib/api-server'
import type { Orcamento } from '@/types/orcamentos'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'
import { SITUACAO_LABEL, SITUACOES } from '@/lib/situacao'
import { formatarData, formatarDataHora, formatarMoeda } from '@/lib/format'
import ItensOrcamento from '@/components/ItensOrcamento'
import { atualizarOrcamento } from '../actions'

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function OrcamentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const paramsSearch = searchParams ? await searchParams : {}
  const sucesso = getMensagem(paramsSearch, 'sucesso')
  const erro = getMensagem(paramsSearch, 'erro')
  let orcamento: Orcamento

  try {
    orcamento = await apiServerJson<Orcamento>(`/orcamentos/${id}`)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const [clientes, produtos] = await Promise.all([
    apiServerJson<Cliente[]>('/clientes'),
    apiServerJson<Produto[]>('/produtos'),
  ])

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Orçamentos</span>
        <h1 className="display-6 fw-bold mb-2">Editar orçamento</h1>
        <p className="text-muted mb-0">Atualize o cabeçalho e os itens do orçamento.</p>
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
                <h2 className="h5 mb-1">Orçamento #{orcamento.id}</h2>
                <p className="text-muted mb-0">
                  Cliente: {orcamento.cliente?.nome ?? `#${orcamento.clienteId}`} · Criado em{' '}
                  {formatarDataHora(orcamento.criadoEm)}
                </p>
              </div>
              <Link href="/orcamentos" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

            <form action={atualizarOrcamento} className="d-flex flex-column gap-4 mb-4">
              <input type="hidden" name="id" value={orcamento.id} />

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="clienteId" className="form-label">Cliente</label>
                  <select
                    id="clienteId"
                    name="clienteId"
                    className="form-select"
                    defaultValue={orcamento.clienteId}
                    required
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="situacao" className="form-label">Situação</label>
                  <select
                    id="situacao"
                    name="situacao"
                    className="form-select"
                    defaultValue={orcamento.situacao}
                  >
                    {SITUACOES.map((s) => (
                      <option key={s} value={s}>{SITUACAO_LABEL[s]}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validoAte" className="form-label">Válido até</label>
                  <input
                    id="validoAte"
                    name="validoAte"
                    type="date"
                    className="form-control"
                    defaultValue={orcamento.validoAte ? orcamento.validoAte.slice(0, 10) : ''}
                  />
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
                    defaultValue={orcamento.valorDesconto}
                  />
                </div>

                <div className="col-md-8">
                  <label htmlFor="observacoes" className="form-label">Observações</label>
                  <input
                    id="observacoes"
                    name="observacoes"
                    className="form-control"
                    defaultValue={orcamento.observacoes ?? ''}
                  />
                </div>
              </div>

              <div>
                <h3 className="h6 mb-3">Itens</h3>
                <ItensOrcamento produtos={produtos} itensIniciais={orcamento.itens} />
              </div>

              <div className="small text-muted">
                Subtotal: {formatarMoeda(orcamento.subtotal)} · Desconto: {formatarMoeda(orcamento.valorDesconto)} ·{' '}
                <strong>Total: {formatarMoeda(orcamento.total)}</strong>
                <span className="d-block">
                  Os valores acima refletem a última versão salva; salve para recalcular após alterar os itens.
                </span>
              </div>

              <div>
                <button type="submit" className="btn btn-primary">Salvar alterações</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
