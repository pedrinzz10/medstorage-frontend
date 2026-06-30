import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { Button } from '../ui/Button';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout base de todas as páginas autenticadas.
 * Redireciona para /login se não houver usuário logado.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ padding: '28px 30px' }}>
        {/* Botão de tema flutuante */}
        <div className="fixed top-5 right-5 z-50">
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
