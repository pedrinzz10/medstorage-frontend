import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import type { Commission, CommissionStatus } from '../types';

const MOCK_COMMISSIONS: Commission[] = [
  { id:'1', vendedorId:'1', vendedorNome:'Ana Oliveira',   periodoInicio:'2025-06-01', periodoFim:'2025-06-30', totalPedidos:42, valorVendido:128400, quantidadeUnidades:3210, taxaComissao:0.04, valorComissao:5136,  status:'PENDENTE' },
  { id:'2', vendedorId:'2', vendedorNome:'Carlos Mendes',  periodoInicio:'2025-06-01', periodoFim:'2025-06-30', totalPedidos:35, valorVendido: 98700, quantidadeUnidades:2640, taxaComissao:0.04, valorComissao:3948,  status:'PENDENTE' },
  { id:'3', vendedorId:'3', vendedorNome:'Beatriz Santos', periodoInicio:'2025-06-01', periodoFim:'2025-06-30', totalPedidos:28, valorVendido: 74200, quantidadeUnidades:1890, taxaComissao:0.035,valorComissao:2597,  status:'PENDENTE' },
  { id:'4', vendedorId:'1', vendedorNome:'Ana Oliveira',   periodoInicio:'2025-05-01', periodoFim:'2025-05-31', totalPedidos:38, valorVendido:114200, quantidadeUnidades:2890, taxaComissao:0.04, valorComissao:4568,  status:'PAGO' },
  { id:'5', vendedorId:'2', vendedorNome:'Carlos Mendes',  periodoInicio:'2025-05-01', periodoFim:'2025-05-31', totalPedidos:29, valorVendido: 82100, quantidadeUnidades:2200, taxaComissao:0.04, valorComissao:3284,  status:'PAGO' },
  { id:'6', vendedorId:'4', vendedorNome:'Rafael Costa',   periodoInicio:'2025-05-01', periodoFim:'2025-05-31', totalPedidos:17, valorVendido: 44800, quantidadeUnidades:1180, taxaComissao:0.03, valorComissao:1344,  status:'PAGO' },
  { id:'7', vendedorId:'5', vendedorNome:'Mariana Lima',   periodoInicio:'2025-04-01', periodoFim:'2025-04-30', totalPedidos:11, valorVendido: 29300, quantidadeUnidades: 760, taxaComissao:0.03, valorComissao: 879,  status:'CANCELADO' },
];

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
  const [filterStatus, setFilterStatus] = useState<CommissionStatus | 'TODOS'>('TODOS');

  const filtered = filterStatus === 'TODOS'
    ? MOCK_COMMISSIONS
    : MOCK_COMMISSIONS.filter(c => c.status === filterStatus);

  const totalPendente  = MOCK_COMMISSIONS.filter(c => c.status === 'PENDENTE').reduce((s, c) => s + c.valorComissao, 0);
  const totalPago      = MOCK_COMMISSIONS.filter(c => c.status === 'PAGO').reduce((s, c) => s + c.valorComissao, 0);
  const totalGeral     = MOCK_COMMISSIONS.reduce((s, c) => s + c.valorComissao, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Comissões</em>
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Acumulado" value={fmt(totalGeral)}    sub="todos os períodos"  color="accent" />
        <StatCard label="A Pagar"         value={fmt(totalPendente)} sub="pendente de pagamento" color="amber" />
        <StatCard label="Já Pago"         value={fmt(totalPago)}     sub="liquidado"           color="green"  />
        <StatCard label="Registros"       value={String(MOCK_COMMISSIONS.length)} sub="comissões cadastradas" color="accent" />
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
                {['Vendedor', 'Período', 'Pedidos', 'Volume Vendido', 'Taxa', 'Comissão', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-4 px-5 font-bold text-[11px] uppercase tracking-[0.8px]"
                    style={{ color: 'var(--text-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                    Nenhuma comissão encontrada
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => {
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
                    <td className="py-4 px-5">
                      {c.status === 'PENDENTE' && (
                        <button
                          className="neu-btn-sm px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-[11px] font-bold"
                          style={{ fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--ok)' }}
                        >
                          Marcar Pago
                        </button>
                      )}
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
