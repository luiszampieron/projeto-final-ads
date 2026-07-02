import { apiServerJson } from '@/lib/api-server'
import type {
  DashboardResumo,
  OrcamentosPorStatus,
  SerieMensalQuantidade,
  SerieMensalValor,
  TopClienteOrcamentos,
  TopProdutoOrcado,
} from '@/types/dashboard'
import { SITUACAO_COLOR, SITUACAO_LABEL, SITUACOES } from '@/lib/situacao'
import { formatarMoeda } from '@/lib/format'
import BarChart from '@/components/Charts/BarChart'
import LineChart from '@/components/Charts/LineChart'

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getParam(params: Record<string, string | string[] | undefined>, chave: string) {
  const valor = params[chave]
  return typeof valor === 'string' ? valor : undefined
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : {}
  const anoAtual = new Date().getFullYear()

  const anoParam = getParam(params, 'ano')
  const ano = anoParam && Number.isFinite(Number(anoParam)) ? Number(anoParam) : anoAtual

  const limitParam = getParam(params, 'limit')
  const limiteBruto = limitParam && Number.isFinite(Number(limitParam)) ? Number(limitParam) : 10
  const limite = Math.min(Math.max(Math.trunc(limiteBruto), 1), 50)

  const [resumo, porStatus, porMes, valorPorMes, topClientes, topProdutos] = await Promise.all([
    apiServerJson<DashboardResumo>('/dashboard/resumo'),
    apiServerJson<OrcamentosPorStatus[]>('/dashboard/orcamentos-por-status'),
    apiServerJson<SerieMensalQuantidade[]>(`/dashboard/orcamentos-por-mes?ano=${ano}`),
    apiServerJson<SerieMensalValor[]>(`/dashboard/valor-orcado-por-mes?ano=${ano}`),
    apiServerJson<TopClienteOrcamentos[]>(`/dashboard/top-clientes-orcamentos?limit=${limite}`),
    apiServerJson<TopProdutoOrcado[]>(`/dashboard/top-produtos-orcados?limit=${limite}`),
  ])

  const dadosStatus = SITUACOES.map((s) => ({
    label: SITUACAO_LABEL[s],
    value: porStatus.find((p) => p.situacao === s)?.total ?? 0,
    color: SITUACAO_COLOR[s],
  }))

  const dadosQuantidadeMes = porMes
    .slice()
    .sort((a, b) => a.mes - b.mes)
    .map((m) => ({ label: MESES_ABREV[m.mes - 1], value: m.total }))

  const dadosValorMes = valorPorMes
    .slice()
    .sort((a, b) => a.mes - b.mes)
    .map((m) => ({ label: MESES_ABREV[m.mes - 1], value: m.total }))

  const totalAno = dadosValorMes.reduce((soma, m) => soma + m.value, 0)
  const anosDisponiveis = Array.from({ length: 6 }, (_, i) => anoAtual - i)

  return (
    <section className="row g-4">
      <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
          <span className="section-eyebrow">Área interna</span>
          <h1 className="display-6 fw-bold mb-2">Dashboard</h1>
          <p className="text-muted mb-0">Panorama de clientes, produtos e orçamentos.</p>
        </div>

        <form className="d-flex gap-2 align-items-end" method="get">
          <div>
            <label htmlFor="ano" className="form-label small mb-1">Ano</label>
            <select id="ano" name="ano" defaultValue={String(ano)} className="form-select form-select-sm">
              {anosDisponiveis.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="limit" className="form-label small mb-1">Top (rankings)</label>
            <input
              id="limit"
              name="limit"
              type="number"
              min={1}
              max={50}
              defaultValue={limite}
              className="form-control form-control-sm"
              style={{ width: 90 }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Aplicar</button>
        </form>
      </div>

      <div className="col-md-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <span className="feature-icon mb-3">Σ</span>
            <p className="text-muted mb-1 small">Total de orçamentos</p>
            <h2 className="display-6 fw-bold mb-0">{resumo.totalOrcamentos}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <span className="feature-icon mb-3">◈</span>
            <p className="text-muted mb-1 small">Clientes cadastrados</p>
            <h2 className="display-6 fw-bold mb-0">{resumo.totalClientes}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <span className="feature-icon mb-3">✓</span>
            <p className="text-muted mb-1 small">Produtos ativos</p>
            <h2 className="display-6 fw-bold mb-0">{resumo.totalProdutosAtivos}</h2>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h6 mb-3">Orçamentos por situação</h2>
            <BarChart data={dadosStatus} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h6 mb-3">Orçamentos por mês — {ano}</h2>
            <BarChart data={dadosQuantidadeMes} color="var(--verde-600)" showValues={false} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h6 mb-3">Valor orçado por mês — {ano}</h2>
            <LineChart data={dadosValorMes} />
            <p className="text-muted small mb-0 mt-2">Total do ano: {formatarMoeda(totalAno)}</p>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Top clientes por orçamentos</h2>
            {topClientes.length === 0 ? (
              <p className="text-muted mb-0">Nenhum orçamento registrado ainda.</p>
            ) : (
              <ol className="list-group list-group-numbered">
                {topClientes.map((c) => (
                  <li
                    key={c.clienteId}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                  >
                    <span>{c.nome}</span>
                    <span className="badge rounded-pill" style={{ backgroundColor: 'var(--verde-700)' }}>
                      {c.totalOrcamentos}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card surface-card h-100">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Top produtos orçados</h2>
            {topProdutos.length === 0 ? (
              <p className="text-muted mb-0">Nenhum item de orçamento registrado ainda.</p>
            ) : (
              <ol className="list-group list-group-numbered">
                {topProdutos.map((p) => (
                  <li
                    key={p.produtoId}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                  >
                    <span>{p.nome}</span>
                    <span className="badge rounded-pill" style={{ backgroundColor: 'var(--verde-700)' }}>
                      {p.totalOcorrencias}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
