import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import type { Role, SystemUser } from '../types';

/** Usuários do sistema para prototipagem */
const MOCK_USERS: SystemUser[] = [
  {
    id: '1', nome: 'Administrador', email: 'admin@distribuidor.com',
    role: 'admin', ativo: true, initials: 'AD',
  },
  {
    id: '2', nome: 'Carlos Gerente', email: 'gerente@distribuidor.com',
    role: 'gerente_estoque', telefone: '(11) 98888-0001', ativo: true, initials: 'GE',
  },
  {
    id: '3', nome: 'Vendedor Um', email: 'vendedor1@distribuidor.com',
    role: 'vendedor', telefone: '(11) 97777-0001', ativo: true, initials: 'V1',
  },
];

interface RoleTagProps { role: Role }

const roleConfig: Record<Role, { label: string; bg: string; color: string }> = {
  admin:           { label: 'Admin',          bg: 'var(--role-admin-bg)', color: 'var(--role-admin-t)' },
  gerente_estoque: { label: 'Gerente Estoque', bg: 'var(--role-ger-bg)',   color: 'var(--role-ger-t)' },
  vendedor:        { label: 'Vendedor',        bg: 'var(--role-vnd-bg)',   color: 'var(--role-vnd-t)' },
};

function RoleTag({ role }: RoleTagProps) {
  const { label, bg, color } = roleConfig[role];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-[0.5px]"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

/** Pill para configurações de segurança */
function Pill({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-[0.4px]"
      style={{
        background: ok ? 'var(--pill-ok-bg)' : 'var(--pill-warn-bg)',
        color: ok ? 'var(--pill-ok-t)' : 'var(--pill-warn-t)',
      }}
    >
      {children}
    </span>
  );
}

const avatarColors: Record<Role, { bg: string; color: string }> = {
  admin:           { bg: 'var(--secondary)', color: 'var(--secondary-text)' },
  gerente_estoque: { bg: 'var(--accent)',    color: 'var(--text-on-accent)' },
  vendedor:        { bg: 'var(--warm)',      color: 'var(--warm-text)'      },
};

/**
 * Página Administrativa — gerencia usuários e exibe configurações de segurança.
 * Visível apenas para o perfil admin.
 */
export function AdminPage() {
  return (
    <AppLayout>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Painel <em className="not-italic" style={{ color: 'var(--accent)' }}>Administrativo</em>
        </h1>
        <Button variant="primary">+ Novo Usuário</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Usuários Ativos" value={3}          sub="No sistema"       color="accent" />
        <StatCard label="Pedidos Hoje"    value={24}         sub="+12% vs. ontem"   color="green" />
        <StatCard label="Faturamento"     value="R$ 48k"     sub="Mês corrente"     color="accent" />
        <StatCard label="Alertas"         value={2}          sub="Estoque crítico"  color="red" />
      </div>

      {/* Seção: usuários */}
      <div
        className="flex items-center gap-3.5 text-[13px] font-bold uppercase tracking-[1px] mb-4"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>Gerenciamento de Usuários</span>
        <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="neu-card rounded-[20px] overflow-hidden mb-7">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Usuário', 'Perfil', 'Telefone', 'Status', 'Ações'].map(h => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-[1px]"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, i) => (
              <tr
                key={user.id}
                style={{ borderBottom: i < MOCK_USERS.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-fade)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                className="transition-colors duration-100"
              >
                {/* Nome e e-mail */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12px] font-extrabold flex-shrink-0"
                      style={{
                        background: avatarColors[user.role].bg,
                        color: avatarColors[user.role].color,
                        boxShadow: '2px 2px 6px var(--shadow-d), -2px -2px 6px var(--shadow-l)',
                      }}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-tight">{user.nome}</p>
                      <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Perfil */}
                <td className="px-5 py-3.5">
                  <RoleTag role={user.role} />
                </td>

                {/* Telefone */}
                <td className="px-5 py-3.5 text-[13.5px]" style={{ color: 'var(--text-muted)' }}>
                  {user.telefone ?? '—'}
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                    style={{ color: user.ativo ? 'var(--on-t)' : 'var(--off-t)' }}
                  >
                    <span
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: user.ativo ? 'var(--on-t)' : 'var(--off-t)' }}
                    />
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <Button variant="row">Editar</Button>
                    {user.role !== 'admin' && (
                      <Button variant="danger-row">Desativar</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção: segurança */}
      <div
        className="flex items-center gap-3.5 text-[13px] font-bold uppercase tracking-[1px] mb-4"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>Configuração de Segurança</span>
        <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="grid grid-cols-2 gap-[18px]">
        {/* JWT */}
        <div className="neu-card rounded-[20px] p-6">
          <p className="text-[12px] font-bold uppercase tracking-[1px] mb-[18px]" style={{ color: 'var(--text-muted)' }}>
            Autenticação JWT
          </p>
          {[
            { label: 'Armazenamento do token', value: <Pill ok>HttpOnly Cookie</Pill> },
            { label: 'Atributo SameSite',      value: <Pill ok>Strict</Pill> },
            { label: 'Secure flag (produção)', value: <Pill ok>Ativado</Pill> },
            { label: 'Expiração do token',     value: <span className="text-[13px] font-bold">1 hora</span> },
          ].map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between py-[11px]"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              {row.value}
            </div>
          ))}
        </div>

        {/* Rate Limiting */}
        <div className="neu-card rounded-[20px] p-6">
          <p className="text-[12px] font-bold uppercase tracking-[1px] mb-[18px]" style={{ color: 'var(--text-muted)' }}>
            Rate Limiting e Proxy
          </p>
          {[
            { label: 'Limite de tentativas de login', value: <Pill ok>10 req / min / IP</Pill> },
            { label: 'Cabeçalho X-Forwarded-For',     value: <Pill ok>Somente proxy confiável</Pill> },
            { label: 'TRUSTED_PROXIES',               value: <Pill ok={false}>Configurável via env</Pill> },
            { label: 'Hash de senhas (BCrypt)',        value: <Pill ok>rounds = 10</Pill> },
          ].map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between py-[11px]"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              {row.value}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
