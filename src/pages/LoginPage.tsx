import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Tela de login neumórfica do MedStorage.
 * Autentica o usuário e redireciona para /pedidos.
 */
export function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Só pré-preenche credenciais em desenvolvimento; em produção os campos
  // iniciam vazios para não expor um usuário de teste.
  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@distribuidor.com' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'Admin123!' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/pedidos');
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 0) {
        setError('Não foi possível conectar ao servidor. Verifique se a API está no ar.');
      } else if (status === 401 || status === 404) {
        setError('E-mail ou senha inválidos.');
      } else {
        setError((e as Error).message || 'Erro ao entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen grid place-items-center px-4"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Toggle de tema */}
      <button
        className="neu-btn fixed top-5 right-5 px-4 py-2 rounded-[10px] border-none cursor-pointer text-[12px] font-semibold uppercase tracking-[0.5px]"
        style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontFamily: 'inherit' }}
        onClick={toggleTheme}
      >
        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      </button>

      {/* Card de login */}
      <div className="neu-card-lg rounded-[28px] w-full max-w-[400px] px-11 py-[50px]">
        {/* Marca */}
        <div className="text-center mb-[42px]">
          <div
            className="neu-card-sm inline-flex items-center justify-center w-[72px] h-[72px] rounded-[20px] text-[22px] font-extrabold tracking-[-1px] mb-5"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            MS
          </div>
          <h1 className="font-display text-[26px] font-bold tracking-[-0.8px] leading-tight">
            Med<em className="not-italic" style={{ color: 'var(--accent)' }}>Storage</em>
          </h1>
          <p className="text-[13px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Sistema de Gestão de Distribuição Médica
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo e-mail */}
          <div className="mb-6">
            <label
              className="block text-[11px] font-bold uppercase tracking-[1.2px] mb-2.5"
              style={{ color: 'var(--text-muted)' }}
            >
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="email@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="neu-input w-full px-[18px] py-[14px] rounded-[14px] border-none outline-none text-[15px]"
              style={{
                fontFamily: 'inherit',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* Campo senha */}
          <div className="mb-2">
            <label
              className="block text-[11px] font-bold uppercase tracking-[1.2px] mb-2.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Senha
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="neu-input w-full px-[18px] py-[14px] rounded-[14px] border-none outline-none text-[15px]"
              style={{
                fontFamily: 'inherit',
                color: 'var(--text)',
              }}
            />
          </div>
          <div className="text-right mt-2 mb-0">
            <a
              href="#"
              className="text-[12px] font-semibold tracking-[0.2px] no-underline"
              style={{ color: 'var(--accent)' }}
            >
              Esqueceu a senha?
            </a>
          </div>

          {/* Erro */}
          {error && (
            <p className="mt-3 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="neu-btn w-full py-[15px] mt-3 rounded-[14px] border-none cursor-pointer text-[15px] font-bold tracking-[0.3px] disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', fontFamily: 'inherit' }}
          >
            {loading ? 'Entrando…' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Separador */}
        <div
          className="flex items-center gap-3.5 my-[30px] text-[11px] font-semibold uppercase tracking-[1px]"
          style={{ color: 'var(--text-soft)' }}
        >
          <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          autenticação segura
          <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Chips de segurança */}
        <div className="flex gap-2 justify-center flex-wrap">
          {['JWT', 'HttpOnly Cookie', 'SameSite Strict'].map(chip => (
            <span
              key={chip}
              className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.4px]"
              style={{ background: 'var(--secondary-fade)', color: 'var(--secondary)' }}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Barra de status seguro */}
        <div
          className="mt-[26px] px-4 py-[11px] rounded-[12px] text-center text-[12px] font-semibold flex items-center justify-center gap-2 tracking-[0.2px]"
          style={{
            background: 'var(--ok-bg)',
            color: 'var(--ok)',
          }}
        >
          <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: 'var(--ok)' }} />
          Conexão protegida — dados criptografados
        </div>

        <p className="text-center mt-6 text-[11px] tracking-[0.2px]" style={{ color: 'var(--text-soft)' }}>
          Distribuidor de Materiais Médicos &mdash; &copy; 2025
        </p>
      </div>
    </div>
  );
}
