import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Commission, CommissionStatus } from '../types';

const STATUS_CFG: Record<CommissionStatus, { bg: string; t: string; label: string }> = {
  PENDENTE:  { bg: 'var(--tag-pend)',    t: 'var(--tag-pend-t)',    label: 'Pendente'  },
  PAGO:      { bg: 'var(--tag-pronto)',  t: 'var(--tag-pronto-t)',  label: 'Pago'      },
  CANCELADO: { bg: 'var(--tag-canc)',    t: 'var(--tag-canc-t)',    label: 'Cancelado' },
};

const ALL_STATUS: CommissionStatus[] = ['PENDENTE', 'PAGO', 'CANCELADO'];

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

const fmtDate = (s: string) => new Date(s + 'T00:00').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

export function ComissoesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [filterStatus, setFilterStatus] = useState<CommissionStatus | 'TODOS'>('TODOS');

  const { data, loading, error, reload } = useApiResource<PageResponse<Commission>>(
    isAdmin ? '/api/commissions?page=0&size=100&sort=periodoInicio,desc' : null,
  );
  const commissions = data?.content ?? [];

  const filtered = filterStatus === 'TODOS'
    ? commissions
    : commissions.filter(c => c.status === filterStatus);

  const totalPendente  = commissions.filter(c => c.status === 'PENDENTE').reduce((s, c) => s + c.valorComissao, 0);
  const totalPago      = commissions.filter(c => c.status === 'PAGO').reduce((s, c) => s + c.valorComissao, 0);
  const totalGeral     = commissions.reduce((s, c) => s + c.valorComissao, 0);

  if (!isAdmin) {
    return (
      <AppLayout>
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px] mb-4">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Comissões</em>
        </h1>
        <div className="neu-card rounded-[20px] p-12 text-center text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Acesso restrito a administradores.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Comissões</em>
        </h1>
      </div>

      {error && (
        <div className="px-5 py-3 rounded-[14px] mb-5 text-[13px] font-semibold flex items-center gap-3"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
          {error} —{' '}
          <button className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }} onClick={reload}>Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Acumulado" value={fmt(totalGeral)}    sub="todos os períodos"  color="accent" />
        <StatCard label="A Pagar"         value={fmt(totalPendente)} sub="pendente de pagamento" color="amber" />
        <StatCard label="Já Pago"         value={fmt(totalPago)}     sub="liquidado"           color="green"  />
        <StatCard label="Registros"       value={String(data?.totalElements ?? commissions.length)} sub="comissões cadastradas" color="accent" />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['TODOS', ...ALL_STATUS] as const).map(s => {
          const active = filterStatus === s;
          const cfg = s !== 'TODOS' ? STATUS_CFG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-4 py-2 rounded-[10px] border-none cursor-pointer text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-150"
              style={{
                fontFamily: 'inherit',
                background: active ? (cfg?.bg ?? 'var(--accent)') : 'var(--bg)',
                color:      active ? (cfg?.t  ?? 'var(--text-on-accent)') : 'var(--text-muted)',
                boxShadow:  active ? 'none' : '4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l)',
              }}
            >
              {s === 'TODOS' ? 'Todos' : STATUS_CFG[s].label}
            </button>
          );
        })}
      </div>

      {/* Tabela */}
      <div className="neu-card rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                {['Vendedor', 'Período', 'Pedidos', 'Volume Vendido', 'Taxa', 'Comissão', 'Status'].map(h => (
                  <th key={h} className="text-left py-4 px-5 font-bold text-[11px] uppercase tracking-[0.8px]"
                    style={{ color: 'var(--text-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>Carregando…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                    {error ? 'Não foi possível carregar as comissões' : 'Nenhuma comissão encontrada'}
                  </td>
                </tr>
              )}
              {!loading && filtered.map((c, i) => {
                const cfg = STATUS_CFG[c.status];
                return (
                  <tr key={c.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 neu-card-sm"
                          style={{ background: 'var(--secondary)', color: 'var(--secondary-text)' }}>
                          {c.vendedorNome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-semibold">{c.vendedorNome}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>
                      {fmtDate(c.periodoInicio)} – {fmtDate(c.periodoFim)}
                    </td>
                    <td className="py-4 px-5 font-semibold">{c.totalPedidos}</td>
                    <td className="py-4 px-5 font-semibold">{fmt(c.valorVendido)}</td>
                    <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>{fmtPct(c.taxaComissao)}</td>
                    <td className="py-4 px-5 font-bold" style={{ color: 'var(--accent)' }}>{fmt(c.valorComissao)}</td>
                    <td className="py-4 px-5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: cfg.bg, color: cfg.t }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
