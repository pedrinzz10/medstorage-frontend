import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Usuários simulados para prototipagem da UI */
const MOCK_USERS: Record<string, AuthUser> = {
  'admin@distribuidor.com': {
    id: '1',
    nome: 'Administrador',
    email: 'admin@distribuidor.com',
    role: 'admin',
    initials: 'AD',
  },
  'gerente@distribuidor.com': {
    id: '2',
    nome: 'Carlos Gerente',
    email: 'gerente@distribuidor.com',
    role: 'gerente_estoque',
    initials: 'GE',
  },
  'vendedor1@distribuidor.com': {
    id: '3',
    nome: 'Vendedor Um',
    email: 'vendedor1@distribuidor.com',
    role: 'vendedor',
    initials: 'V1',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  async function login(email: string, _password: string) {
    /* Em produção: POST /api/auth/login */
    await new Promise(r => setTimeout(r, 600));
    const found = MOCK_USERS[email];
    if (!found) throw new Error('Credenciais inválidas');
    setUser(found);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
