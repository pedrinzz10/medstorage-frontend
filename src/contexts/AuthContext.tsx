import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import type { AuthUser, Role } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface UserSummaryResponse {
  id: string;
  email: string;
  nome: string;
  role: Role;
}

interface ValidateResponse {
  valid: boolean;
  email: string;
  role: string;
}

function toAuthUser(u: UserSummaryResponse): AuthUser {
  const words = u.nome.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : u.nome.slice(0, 2).toUpperCase();
  return { id: u.id, nome: u.nome, email: u.email, role: u.role, initials };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('ms-user');
    if (!stored) { setLoading(false); return; }

    api.get<ValidateResponse>('/api/auth/validate')
      .then(v => {
        if (v.valid) setUser(JSON.parse(stored) as AuthUser);
        else sessionStorage.removeItem('ms-user');
      })
      .catch(() => sessionStorage.removeItem('ms-user'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const u = await api.post<UserSummaryResponse>('/api/auth/login', { email, password });
    const authUser = toAuthUser(u);
    sessionStorage.setItem('ms-user', JSON.stringify(authUser));
    setUser(authUser);
  }

  function logout() {
    api.post('/api/auth/logout').catch(() => null);
    sessionStorage.removeItem('ms-user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
