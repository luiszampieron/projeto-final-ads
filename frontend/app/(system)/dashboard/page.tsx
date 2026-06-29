export default function DashboardPage() {
  return (
    <section>
      <div className="d-flex flex-column gap-2 mb-4">
        <span className="section-eyebrow">Área interna</span>
        <h1 className="display-6 fw-bold mb-0">Dashboard</h1>
        <p className="text-muted mb-0">
          Bem-vindo ao sistema. Esta tela fica reservada para os relatórios da
          próxima etapa.
        </p>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card surface-card h-100">
            <div className="card-body p-4">
              <span className="feature-icon mb-3">✓</span>
              <h2 className="h5">Autenticação pronta</h2>
              <p className="text-muted mb-0">
                O login grava o JWT, as rotas internas são protegidas e o botão
                sair encerra a sessão.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card surface-card h-100">
            <div className="card-body p-4">
              <span className="feature-icon mb-3">▦</span>
              <h2 className="h5">Layout global</h2>
              <p className="text-muted mb-0">
                Cabeçalho, menu de navegação e rodapé aparecem nas telas
                internas.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card surface-card h-100">
            <div className="card-body p-4">
              <span className="feature-icon mb-3">↗</span>
              <h2 className="h5">API compartilhada</h2>
              <p className="text-muted mb-0">
                Use os helpers de servidor em <code>lib/api-server.ts</code>
                para chamadas autenticadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
