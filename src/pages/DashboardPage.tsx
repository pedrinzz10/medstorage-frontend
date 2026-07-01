import { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { SellerPerformance, Order, OrderStatus } from '../types';

const ALL_ORDER_STATUS: OrderStatus[] = ['CRIADO', 'CONFIRMADO', 'SEPARADO', 'PRONTO', 'FINALIZADO', 'CANCELADO'];

const STATUS_COLOR: Record<string, string> = {
  CRIADO:     'var(--tag-pend-t)',
  CONFIRMADO: 'var(--tag-confirm-t)',
  SEPARADO:   'var(--tag-sep-t)',
  PRONTO:     'var(--tag-pronto-t)',
  FINALIZADO: 'var(--tag-fin-t)',
  CANCELADO:  'var(--tag-canc-t)',
};
const STATUS_BG: Record<string, string> = {
  CRIADO:     'var(--tag-pend)',
  CONFIRMADO: 'var(--tag-confirm)',
  SEPARADO:   'var(--tag-sep)',
  PRONTO:     'var(--tag-pronto)',
  FINALIZADO: 'var(--tag-fin)',
  CANCELADO:  'var(--tag-canc)',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

function MedalIcon({ rank }: { rank: number }) {
  const colors = ['#fbbf24', '#94a3b8', '#cd7c3a'];
  if (rank > 3) return <span className="text-[13px] font-bold" style={{ color: 'var(--text-soft)' }}>#{rank}</span>;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={colors[rank - 1]}>
      <circle cx="12" cy="8" r="6" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('mes');

  const { data: sellersData } = useApiResource<SellerPerformance[]>(
    isAdmin ? '/api/sellers/performance/all' : null,
  );
  const sellers = (sellersData ?? []).slice().sort((a, b) => b.valorVendido - a.valorVendido);

  const { data: recentData } = useApiResource<PageResponse<Order>>('/api/orders?page=0&size=6&sort=createdAt,desc');
  const recent = recentData?.content ?? [];

  // Contagem por status: um count leve por status (size=1 lê totalElements).
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ALL_ORDER_STATUS.map(s =>
        api.get<PageResponse<Order>>(`/api/orders?status=${s}&page=0&size=1`)
          .then(p => [s, p.totalElements] as const)
          .catch(() => [s, 0] as const),
      ),
    ).then(pairs => {
      if (!cancelled) setStatusCounts(Object.fromEntries(pairs));
    });
    return () => { cancelled = true; };
  }, []);

  const totalVendido = sellers.reduce((s, v) => s + v.valorVendido, 0);
  const totalPedidos = sellers.reduce((s, v) => s + v.totalPedidos, 0);
  const totalUnidades = sellers.reduce((s, v) => s + v.quantidadeUnidades, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Visão <em className="not-italic" style={{ color: 'var(--accent)' }}>Geral</em>
        </h1>
        <div className="neu-card-sm rounded-[10px] flex overflow-hidden">
          {(['dia', 'semana', 'mes'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.5px] border-none cursor-pointer transition-all duration-150"
              style={{
                fontFamily: 'inherit',
                background: period === p ? 'var(--accent)' : 'var(--bg)',
                color: period === p ? 'var(--text-on-accent)' : 'var(--text-muted)',
              }}
            >
              {p === 'dia' ? 'Hoje' : p === 'semana' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Faturamento"     value={fmt(totalVendido)}          sub="pedidos finalizados"    color="accent" />
        <StatCard label="Pedidos"         value={String(totalPedidos)}        sub="no mês corrente"        color="green"  />
        <StatCard label="Unidades"        value={totalUnidades.toLocaleString('pt-BR')} sub="itens distribuídos"  color="accent" />
        <StatCard label="Ticket Médio"    value={fmt(totalPedidos > 0 ? totalVendido / totalPedidos : 0)} sub="por pedido" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ranking de vendedores */}
        <div className="lg:col-span-2 neu-card rounded-[20px] p-6">
          <h2 className="text-[15px] font-bold mb-5 tracking-[-0.3px]">Desempenho de Vendedores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                  {['#', 'Vendedor', 'Pedidos', 'Unidades', 'Faturado'].map(h => (
                    <th key={h} className="text-left pb-3 font-bold text-[11px] uppercase tracking-[0.8px]"
                      style={{ color: 'var(--text-soft)', paddingRight: h === 'Faturado' ? 0 : '16px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isAdmin && (
                  <tr><td colSpan={5} className="py-8 text-center text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                    Ranking disponível para administradores.
                  </td></tr>
                )}
                {isAdmin && sellers.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                    Sem dados de vendas no período.
                  </td></tr>
                )}
                {sellers.map((s, i) => {
                  const pct = sellers[0].valorVendido > 0 ? (s.valorVendido / sellers[0].valorVendido) * 100 : 0;
                  return (
                    <tr key={s.vendedorId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3.5 pr-4"><MedalIcon rank={i + 1} /></td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 neu-card-sm"
                            style={{ background: 'var(--secondary)', color: 'var(--secondary-text)' }}>
                            {s.vendedorNome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="font-semibold leading-tight">{s.vendedorNome}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{s.vendedorEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold">{s.totalPedidos}</td>
                      <td className="py-3.5 pr-4" style={{ color: 'var(--text-muted)' }}>{s.quantidadeUnidades.toLocaleString('pt-BR')}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="neu-inset h-[5px] rounded-full overflow-hidden w-[60px]">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                          </div>
                          <span className="font-bold" style={{ color: 'var(--accent)' }}>{fmt(s.valorVendido)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pedidos recentes */}
        <div className="neu-card rounded-[20px] p-6">
          <h2 className="text-[15px] font-bold mb-5 tracking-[-0.3px]">Pedidos Recentes</h2>
          <div className="flex flex-col gap-3">
            {recent.length === 0 && (
              <p className="text-[12.5px] py-4 text-center" style={{ color: 'var(--text-soft)' }}>Nenhum pedido recente.</p>
            )}
            {recent.map(o => (
              <div key={o.id} className="neu-card-sm rounded-[13px] p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>{o.numeroPedido}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: STATUS_BG[o.status], color: STATUS_COLOR[o.status] }}>
                    {o.status}
                  </span>
                </div>
                <p className="text-[12.5px] font-medium leading-tight">{o.customerNome}</p>
                <p className="text-[12px] font-bold mt-1" style={{ color: 'var(--text-muted)' }}>
                  {fmt(o.valorTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="mt-5 neu-card rounded-[20px] p-6">
        <h2 className="text-[15px] font-bold mb-4 tracking-[-0.3px]">Distribuição por Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_ORDER_STATUS.map(status => (
            <div key={status} className="neu-card-sm rounded-[14px] p-4 text-center">
              <p className="text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: STATUS_COLOR[status] }}>
                {statusCounts[status] ?? '—'}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: STATUS_BG[status], color: STATUS_COLOR[status] }}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
