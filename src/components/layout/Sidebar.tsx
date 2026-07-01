import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NavSection {
  title: string;
  items: { label: string; path: string }[];
}

function buildSections(canSeeAbcCurve: boolean): NavSection[] {
  return [
    {
      title: 'Operações',
      items: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Pedidos',   path: '/pedidos' },
        { label: 'Estoque',   path: '/estoque' },
        ...(canSeeAbcCurve ? [{ label: 'Curva ABC', path: '/curva-abc' }] : []),
        { label: 'Produtos',  path: '/produtos' },
        { label: 'Clientes',  path: '/clientes' },
        { label: 'Consignação', path: '/consignacao' },
        { label: 'Calendário', path: '/calendario' },
        ...(canSeeAbcCurve ? [{ label: 'Histórico de Contagens', path: '/contagens' }] : []),
      ],
    },
    {
      title: 'Financeiro',
      items: [
        { label: 'Comissões',   path: '/comissoes' },
        { label: 'Devoluções',  path: '/devolucoes' },
      ],
    },
  ];
}

const adminItem = { label: 'Administração', path: '/admin' };

/** Sidebar de navegação neumórfica com seções e perfil do usuário */
export function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const sections = buildSections(user?.role === 'admin' || user?.role === 'gerente_estoque');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItemBase =
    'px-3.5 py-2.5 rounded-xl cursor-pointer text-[13.5px] font-medium transition-all duration-150 tracking-[-0.1px] no-underline block';
  const navItemIdle  = `${navItemBase} text-[var(--text-muted)] hover:text-[var(--text)]`;
  const navItemActive = `${navItemBase} neu-card-sm font-bold text-[var(--accent)]`;

  return (
    <nav
      className="neu-sidebar w-[210px] min-h-screen flex-shrink-0 flex flex-col gap-1 sticky top-0 h-screen overflow-y-auto"
      style={{ padding: '28px 14px' }}
    >
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-3 pb-6">
        <div
          className="neu-card-sm w-9 h-9 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold flex-shrink-0"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}
        >
          MS
        </div>
        <span className="text-[15px] font-extrabold tracking-[-0.4px]">
          Med<em className="text-[var(--accent)] not-italic">Storage</em>
        </span>
      </div>

      {/* Seções de navegação */}
      {sections.map(section => (
        <div key={section.title}>
          <p
            className="text-[10px] font-bold uppercase tracking-[1.2px] px-3.5 pt-3 pb-1.5"
            style={{ color: 'var(--text-soft)' }}
          >
            {section.title}
          </p>
          {section.items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? navItemActive : navItemIdle}
              style={({ isActive }) =>
                isActive
                  ? { color: 'var(--accent)', background: 'var(--nav-active)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="h-px mx-3.5 my-2" style={{ background: 'var(--border)' }} />
        </div>
      ))}

      {/* Item admin (só visível para admin) */}
      {user?.role === 'admin' && (
        <NavLink
          to={adminItem.path}
          className={({ isActive }) => isActive ? navItemActive : navItemIdle}
          style={({ isActive }) =>
            isActive
              ? { color: 'var(--accent)', background: 'var(--nav-active)' }
              : { color: 'var(--text-muted)' }
          }
        >
          {adminItem.label}
        </NavLink>
      )}

      {/* Toggle de tema */}
      <button
        onClick={toggleTheme}
        className="mt-auto mb-2 w-full px-3.5 py-2 rounded-[10px] border-none cursor-pointer text-[11px] font-bold uppercase tracking-[0.8px] transition-all duration-150 neu-btn-sm"
        style={{ fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text-soft)' }}
      >
        {theme === 'light' ? '☽  Modo Escuro' : '☀  Modo Claro'}
      </button>

      {/* Perfil do usuário */}
      <div
        className="rounded-[14px] p-3 cursor-pointer"
        style={{ background: 'var(--secondary-fade)' }}
        onClick={handleLogout}
        title="Clique para sair"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="neu-card-sm w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12px] font-extrabold flex-shrink-0"
            style={{ background: 'var(--secondary)', color: 'var(--secondary-text)' }}
          >
            {user?.initials ?? '??'}
          </div>
          <div>
            <p className="text-[13px] font-bold leading-tight">{user?.nome ?? '—'}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {user?.role ?? '—'}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
