import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();

  // Enquanto a sessão é revalidada no servidor, não redirecionar —
  // evita expulsar para /login um usuário logado ao dar refresh.
  if (loading) {
    return (
      <div
        className="min-h-screen grid place-items-center"
        style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}
      >
        <span className="text-[13px]">Carregando…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ padding: '28px 30px' }}>
        {children}
      </main>
    </div>
  );
}
