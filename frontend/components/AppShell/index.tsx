import Link from 'next/link'
import { logout } from '@/app/(auth)/logout/actions'
import type { UsuarioAtual } from '@/types/usuario'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/orcamentos', label: 'Orçamentos' },
  { href: '/usuario', label: 'Perfil' },
]

export default function AppShell({
  usuario,
  children,
}: {
  usuario: UsuarioAtual
  children: React.ReactNode
}) {
  return (
    <div className="app-shell min-vh-100 d-flex flex-column">
      <header className="app-header text-white">
        <div className="container py-3 d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <span className="app-brand-badge">SO</span>
            <div>
            <Link href="/dashboard" className="text-white text-decoration-none">
              <strong className="fs-4">SENAC Orçamentos</strong>
            </Link>
            <div className="small text-white-50">
              Logado como {usuario.nomeCompleto}
            </div>
            </div>
          </div>

          <form action={logout}>
            <button type="submit" className="btn btn-outline-light btn-sm px-4">
              Sair
            </button>
          </form>
        </div>

        <nav className="border-top border-white border-opacity-25">
          <div className="container d-flex flex-wrap gap-2 py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="app-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-grow-1">
        <div className="container app-content">{children}</div>
      </main>

      <footer className="border-top bg-white">
        <div className="container py-3 small text-muted d-flex flex-column flex-md-row justify-content-between gap-2">
          <span>SENAC Orçamentos</span>
          <span>Projeto final de Desenvolvimento Frontend</span>
        </div>
      </footer>
    </div>
  )
}
