import Image from "next/image";
import Link from "next/link";

export default function PaginaInicial() {
  return (
    <div className="institutional-page">
      <header className="institutional-header">
        <nav className="container d-flex align-items-center justify-content-between py-4">
          <Link href="/" className="institutional-brand">
            <span className="brand-mark brand-mark-sm">
              <Image
                src="/logo.svg"
                alt="Logo SENAC Orçamentos"
                width={28}
                height={28}
                priority
              />
            </span>
            <span>SENAC Orçamentos</span>
          </Link>

          <div className="d-none d-md-flex align-items-center gap-4">
            <a href="#solucoes" className="institutional-link">
              Soluções
            </a>
            <a href="#beneficios" className="institutional-link">
              Benefícios
            </a>
            <a href="#contato" className="institutional-link">
              Acesso
            </a>
          </div>

          <Link href="/login" className="btn btn-secondary px-4">
            Entrar
          </Link>
        </nav>
      </header>

      <main>
        <section className="institutional-hero">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <p className="hero-kicker">Gestão comercial inteligente</p>
                <h1 className="hero-title">
                  Orçamentos mais claros, rápidos e profissionais.
                </h1>
                <p className="hero-text">
                  Uma plataforma para organizar clientes, produtos e propostas
                  em um fluxo simples, seguro e pensado para pequenas empresas.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                  <Link href="/login" className="btn btn-secondary btn-lg px-5">
                    Acessar sistema
                  </Link>
                  <a href="#solucoes" className="btn btn-outline-light btn-lg px-5">
                    Ver recursos
                  </a>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="hero-panel">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <span className="text-white-50 small">Resumo mensal</span>
                      <h2 className="h4 text-white mb-0">Painel comercial</h2>
                    </div>
                    <span className="hero-panel-badge">Online</span>
                  </div>

                  <div className="hero-metric">
                    <span>Orçamentos enviados</span>
                    <strong>128</strong>
                  </div>
                  <div className="hero-metric">
                    <span>Clientes ativos</span>
                    <strong>42</strong>
                  </div>
                  <div className="hero-metric">
                    <span>Produtos cadastrados</span>
                    <strong>315</strong>
                  </div>

                  <div className="hero-progress mt-4">
                    <div />
                  </div>
                  <p className="text-white-50 small mt-3 mb-0">
                    Visão rápida para acompanhar cadastros, propostas e
                    indicadores do negócio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solucoes" className="institutional-section">
          <div className="container">
            <div className="section-heading text-center mx-auto">
              <span className="section-eyebrow">Soluções</span>
              <h2>Um sistema preparado para o dia a dia da empresa</h2>
              <p>
                Centralize informações importantes e reduza retrabalho na hora
                de montar um orçamento.
              </p>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-md-4">
                <article className="institutional-card">
                  <span className="feature-icon mb-3">01</span>
                  <h3>Clientes organizados</h3>
                  <p>
                    Cadastre, consulte e atualize clientes com rapidez para
                    manter sua base sempre confiável.
                  </p>
                </article>
              </div>

              <div className="col-md-4">
                <article className="institutional-card">
                  <span className="feature-icon mb-3">02</span>
                  <h3>Produtos centralizados</h3>
                  <p>
                    Tenha preços e informações de produtos prontos para compor
                    propostas de forma consistente.
                  </p>
                </article>
              </div>

              <div className="col-md-4">
                <article className="institutional-card">
                  <span className="feature-icon mb-3">03</span>
                  <h3>Orçamentos completos</h3>
                  <p>
                    Monte propostas com itens, quantidades e valores, mantendo
                    o histórico acessível para consulta.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="institutional-band">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-5">
                <span className="section-eyebrow">Benefícios</span>
                <h2>Mais controle sem complicar a operação.</h2>
              </div>

              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="benefit-item">
                      <strong>Interface protegida</strong>
                      <span>Rotas internas com autenticação por JWT.</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="benefit-item">
                      <strong>Navegação simples</strong>
                      <span>Menu direto para dashboard, cadastros e perfil.</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="benefit-item">
                      <strong>Perfil do usuário</strong>
                      <span>Atualização de dados e troca de senha.</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="benefit-item">
                      <strong>Base para relatórios</strong>
                      <span>Estrutura pronta para indicadores comerciais.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="institutional-cta">
          <div className="container">
            <div className="cta-card text-center">
              <span className="section-eyebrow">Comece agora</span>
              <h2>Acesse o ambiente do sistema</h2>
              <p>
                Entre com o usuário demo para testar as telas internas e validar
                o fluxo de autenticação.
              </p>
              <Link href="/login" className="btn btn-primary btn-lg px-5">
                Fazer login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="institutional-footer">
        <div className="container py-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <Link href="/" className="institutional-footer-brand">
                <span className="brand-mark brand-mark-sm">
                  <Image
                    src="/logo.svg"
                    alt="Logo SENAC Orçamentos"
                    width={28}
                    height={28}
                  />
                </span>
                <span>SENAC Orçamentos</span>
              </Link>
              <p className="institutional-footer-text mt-3 mb-0">
                Sistema acadêmico para gestão de clientes, produtos e
                orçamentos, desenvolvido no projeto final de Desenvolvimento
                Frontend.
              </p>
            </div>

            <div className="col-6 col-lg-2 offset-lg-1">
              <h2 className="institutional-footer-title">Sistema</h2>
              <ul className="institutional-footer-list">
                <li>
                  <a href="#solucoes">Soluções</a>
                </li>
                <li>
                  <a href="#beneficios">Benefícios</a>
                </li>
                <li>
                  <Link href="/login">Login</Link>
                </li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <h2 className="institutional-footer-title">Módulos</h2>
              <ul className="institutional-footer-list">
                <li>Clientes</li>
                <li>Produtos</li>
                <li>Orçamentos</li>
              </ul>
            </div>

            <div className="col-lg-2">
              <h2 className="institutional-footer-title">Acesso demo</h2>
              <p className="institutional-footer-text mb-3">
                Teste com o usuário disponibilizado na atividade.
              </p>
              <Link href="/login" className="btn btn-secondary btn-sm px-4">
                Entrar
              </Link>
            </div>
          </div>

          <div className="institutional-footer-bottom">
            <span>&copy; {new Date().getFullYear()} SENAC Orçamentos</span>
            <span>Feito para o Projeto Final ADS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
