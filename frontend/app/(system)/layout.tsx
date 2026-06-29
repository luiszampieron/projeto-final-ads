import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { apiServerJson } from '@/lib/api-server'
import type { UsuarioAtual } from '@/types/usuario'

export default async function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let usuario: UsuarioAtual

  try {
    usuario = await apiServerJson<UsuarioAtual>('/usuarios/atual')
  } catch {
    redirect('/login')
  }

  return (
    <AppShell usuario={usuario}>
      {children}
    </AppShell>
  );
}
