import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { UserFormModal } from '../components/admin/UserFormModal';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Role, SystemUser } from '../types';

function initialsOf(nome: string) {
  const words = nome.trim().split(/\s+/);
  return (words.length >= 2 ? words[0][0] + words[words.length - 1][0] : nome.slice(0, 2)).toUpperCase();
}

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
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data, loading, error, reload } = useApiResource<PageResponse<SystemUser>>(
    isAdmin ? '/api/users?page=0&size=100&sort=nome,asc' : null,
  );
  const users = data?.content ?? [];
  const [showCreate, setShowCreate] = useState(false);

  async function toggleAtivo(u: SystemUser) {
    try {
      await api.patch(`/api/users/${u.id}`, {
        nome: u.nome, telefone: u.telefone ?? null, role: u.role, ativo: !u.ativo,
      });
      reload();
    } catch (e) {
      alert((e as Error).message || 'Erro ao alterar status do usuário');
    }
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px] mb-4">
          Painel <em className="not-italic" style={{ color: 'var(--accent)' }}>Administrativo</em>
        </h1>
        <div className="neu-card rounded-[20px] p-12 text-center text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Acesso restrito a administradores.
        </div>
      </AppLayout>
    );
  }

  const ativos = users.filter(u => u.ativo).length;
  const admins = users.filter(u => u.role === 'admin').length;
  const inativos = users.filter(u => !u.ativo).length;

  return (
    <AppLayout>
      {showCreate && (
        <UserFormModal onClose={() => setShowCreate(false)} onSaved={reload} />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Painel <em className="not-italic" style={{ color: 'var(--accent)' }}>Administrativo</em>
        </h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ Novo Usuário</Button>
      </div>

      {error && (
        <div className="px-5 py-3 rounded-[14px] mb-5 text-[13px] font-semibold flex items-center gap-3"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
          {error} —{' '}
          <button className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }} onClick={reload}>Tentar novamente</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Usuários" value={data?.totalElements ?? users.length} sub="cadastrados"     color="accent" />
        <StatCard label="Ativos"         value={ativos}   sub="com acesso"        color="green" />
        <StatCard label="Administradores" value={admins}  sub="perfil admin"      color="accent" />
        <StatCard label="Inativos"       value={inativos} sub="sem acesso"        color="red" />
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
            {loading && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[13px]" style={{ color: 'var(--text-soft)' }}>
                {error ? 'Não foi possível carregar os usuários' : 'Nenhum usuário cadastrado'}
              </td></tr>
            )}
            {!loading && users.map((u, i) => (
              <tr
                key={u.id}
                style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}
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
                        background: avatarColors[u.role].bg,
                        color: avatarColors[u.role].color,
                        boxShadow: '2px 2px 6px var(--shadow-d), -2px -2px 6px var(--shadow-l)',
                      }}
                    >
                      {initialsOf(u.nome)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-tight">{u.nome}</p>
                      <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                </td>

                {/* Perfil */}
                <td className="px-5 py-3.5">
                  <RoleTag role={u.role} />
                </td>

                {/* Telefone */}
                <td className="px-5 py-3.5 text-[13.5px]" style={{ color: 'var(--text-muted)' }}>
                  {u.telefone ?? '—'}
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                    style={{ color: u.ativo ? 'var(--on-t)' : 'var(--off-t)' }}
                  >
                    <span
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: u.ativo ? 'var(--on-t)' : 'var(--off-t)' }}
                    />
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    {u.id !== user?.id && (
                      <Button variant={u.ativo ? 'danger-row' : 'row'} onClick={() => toggleAtivo(u)}>
                        {u.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
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
            { label: 'Expiração do token',     value: <span className="text-[13px] font-bold">24 horas</span> },
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
            { label: 'Limite de tentativas de login', value: <Pill ok>5 req / min / IP</Pill> },
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
