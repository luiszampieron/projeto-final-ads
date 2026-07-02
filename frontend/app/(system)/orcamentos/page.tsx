import Link from 'next/link'
import { apiServerJson } from '@/lib/api-server'
import type { Orcamento } from '@/types/orcamentos'
import { SITUACAO_COLOR, SITUACAO_LABEL, SITUACOES } from '@/lib/situacao'
import { formatarData, formatarMoeda } from '@/lib/format'

const MESES = [
  { valor: 1, rotulo: 'Janeiro' },
  { valor: 2, rotulo: 'Fevereiro' },
  { valor: 3, rotulo: 'Março' },
  { valor: 4, rotulo: 'Abril' },
  { valor: 5, rotulo: 'Maio' },
  { valor: 6, rotulo: 'Junho' },
  { valor: 7, rotulo: 'Julho' },
  { valor: 8, rotulo: 'Agosto' },
  { valor: 9, rotulo: 'Setembro' },
  { valor: 10, rotulo: 'Outubro' },
  { valor: 11, rotulo: 'Novembro' },
  { valor: 12, rotulo: 'Dezembro' },
]

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: 'sucesso' | 'erro',
) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : {}
  const mesFiltro = typeof params.mes === 'string' ? params.mes : ''
  const anoFiltro = typeof params.ano === 'string' ? params.ano : ''
  const situacaoFiltro = typeof params.situacao === 'string' ? params.situacao : ''

  const query = new URLSearchParams()
  if (mesFiltro) query.set('mes', mesFiltro)
  if (anoFiltro) query.set('ano', anoFiltro)
  if (situacaoFiltro) query.set('situacao', situacaoFiltro)

  const orcamentos = await apiServerJson<Orcamento[]>(
    `/orcamentos${query.toString() ? `?${query.toString()}` : ''}`,
  )

  const sucesso = getMensagem(params, 'sucesso')
  const erro = getMensagem(params, 'erro')

  return (
    <section className="row g-4">
      <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
        <div>
          <span className="section-eyebrow">Orçamentos</span>
          <h1 className="display-6 fw-bold mb-2">Orçamentos</h1>
          <p className="text-muted mb-0">Liste, filtre e edite orçamentos com múltiplos itens.</p>
        </div>
        <Link href="/orcamentos/novo" className="btn btn-primary">
          Cadastrar orçamento
        </Link>
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
            <h2 className="h5 mb-3">Filtros</h2>
            <form className="row g-3 align-items-end" method="get">
              <div className="col-sm-4 col-md-3">
                <label htmlFor="mes" className="form-label">Mês</label>
                <select id="mes" name="mes" defaultValue={mesFiltro} className="form-select">
                  <option value="">Todos</option>
                  {MESES.map((m) => (
                    <option key={m.valor} value={m.valor}>{m.rotulo}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-4 col-md-3">
                <label htmlFor="ano" className="form-label">Ano</label>
                <input
                  id="ano"
                  name="ano"
                  type="number"
                  defaultValue={anoFiltro}
                  className="form-control"
                  placeholder="Ex.: 2026"
                />
              </div>

              <div className="col-sm-4 col-md-3">
                <label htmlFor="situacao" className="form-label">Situação</label>
                <select id="situacao" name="situacao" defaultValue={situacaoFiltro} className="form-select">
                  <option value="">Todas</option>
                  {SITUACOES.map((s) => (
                    <option key={s} value={s}>{SITUACAO_LABEL[s]}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100">Aplicar filtros</button>
              </div>
            </form>
            <p className="text-muted small mb-0 mt-2">
              O filtro por período considera mês e ano juntos.
            </p>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card surface-card">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Orçamentos cadastrados</h2>
            {orcamentos.length === 0 ? (
              <p className="text-muted mb-0">Nenhum orçamento encontrado para os filtros atuais.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Situação</th>
                      <th>Total</th>
                      <th>Válido até</th>
                      <th>Criado em</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.cliente?.nome ?? `Cliente #${o.clienteId}`}</td>
                        <td>
                          <span
                            className="badge rounded-pill"
                            style={{ backgroundColor: SITUACAO_COLOR[o.situacao] }}
                          >
                            {SITUACAO_LABEL[o.situacao]}
                          </span>
                        </td>
                        <td>{formatarMoeda(o.total)}</td>
                        <td>{formatarData(o.validoAte)}</td>
                        <td>{formatarData(o.criadoEm)}</td>
                        <td className="text-end">
                          <Link href={`/orcamentos/${o.id}`} className="btn btn-sm btn-outline-primary">
                            Editar
                          </Link>
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
