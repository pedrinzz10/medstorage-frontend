import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import type { Return, ReturnStatus } from '../types';

const MOCK_RETURNS: Return[] = [
  { id:'1', numeroRetorno:'DEV-2025-001', orderId:'o4', numeroPedido:'PED-2025-004', processadoPor:undefined, status:'PENDENTE',  motivo:'Produto com embalagem danificada', dataSolicitacao:'2025-06-29T10:30:00', dataProcessamento:undefined, items:[{ productId:'p1', productName:'Luva Nitrila P', quantidade:20, motivo:'Embalagem aberta' }] },
  { id:'2', numeroRetorno:'DEV-2025-002', orderId:'o2', numeroPedido:'PED-2025-002', processadoPor:'u1',       status:'APROVADO',  motivo:'Quantidade incorreta recebida',     dataSolicitacao:'2025-06-28T14:00:00', dataProcessamento:'2025-06-28T16:30:00', items:[{ productId:'p2', productName:'Seringa 10ml', quantidade:50 }] },
  { id:'3', numeroRetorno:'DEV-2025-003', orderId:'o1', numeroPedido:'PED-2025-001', processadoPor:'u1',       status:'REJEITADO', motivo:'Produto fora do prazo de devolução', dataSolicitacao:'2025-06-27T09:15:00', dataProcessamento:'2025-06-27T11:00:00', items:[{ productId:'p3', productName:'Máscara Cirúrgica', quantidade:100 }] },
  { id:'4', numeroRetorno:'DEV-2025-004', orderId:'o5', numeroPedido:'PED-2025-005', processadoPor:undefined, status:'PENDENTE',  motivo:'Produto errado enviado',             dataSolicitacao:'2025-06-30T08:00:00', dataProcessamento:undefined, items:[{ productId:'p4', productName:'Álcool 70% 1L', quantidade:10 }] },
];

const STATUS_CFG: Record<ReturnStatus, { bg: string; t: string; label: string; dot: string }> = {
  PENDENTE:  { bg: 'var(--tag-pend)',    t: 'var(--tag-pend-t)',    label: 'Pendente',  dot: 'var(--tag-pend-dot)'    },
  APROVADO:  { bg: 'var(--tag-pronto)',  t: 'var(--tag-pronto-t)',  label: 'Aprovado',  dot: 'var(--tag-pronto-dot)'  },
  REJEITADO: { bg: 'var(--tag-canc)',    t: 'var(--tag-canc-t)',    label: 'Rejeitado', dot: 'var(--tag-canc-dot)'    },
};

const ALL_STATUS: ReturnStatus[] = ['PENDENTE', 'APROVADO', 'REJEITADO'];

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

function ReturnModal({ ret, onClose }: { ret: Return; onClose: () => void }) {
  const cfg = STATUS_CFG[ret.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[500px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[1px] mb-1" style={{ color: 'var(--text-soft)' }}>Devolução</p>
            <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">{ret.numeroRetorno}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Pedido: {ret.numeroPedido}</p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: cfg.bg, color: cfg.t }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
        </div>

        <div className="neu-inset rounded-[12px] px-4 py-3 mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1" style={{ color: 'var(--text-soft)' }}>Motivo</p>
          <p className="text-[13px]" style={{ color: 'var(--text)' }}>{ret.motivo}</p>
        </div>

        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-3" style={{ color: 'var(--text-soft)' }}>Itens</p>
          <div className="flex flex-col gap-2">
            {ret.items.map(item => (
              <div key={item.productId} className="neu-card-sm rounded-[12px] px-4 py-3 flex justify-between items-center">
                <span className="text-[13px] font-medium">{item.productName}</span>
                <span className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>{item.quantidade} un</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px] mb-6">
          <div className="neu-inset rounded-[10px] px-3 py-2.5">
            <p style={{ color: 'var(--text-soft)' }}>Solicitação</p>
            <p className="font-semibold mt-0.5">{fmtDate(ret.dataSolicitacao)}</p>
          </div>
          <div className="neu-inset rounded-[10px] px-3 py-2.5">
            <p style={{ color: 'var(--text-soft)' }}>Processamento</p>
            <p className="font-semibold mt-0.5">{ret.dataProcessamento ? fmtDate(ret.dataProcessamento) : '—'}</p>
          </div>
        </div>

        {ret.status === 'PENDENTE' && (
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">Aprovar</Button>
            <Button variant="danger-row" className="flex-1 neu-btn px-4 py-2 rounded-[10px]"
              style={{ background: 'var(--bg)' }}>
              Rejeitar
            </Button>
          </div>
        )}
        {ret.status !== 'PENDENTE' && (
          <Button variant="ghost" className="w-full" onClick={onClose}>Fechar</Button>
        )}
      </div>
    </div>
  );
}

export function DevolucoesPage() {
  const [filterStatus, setFilterStatus] = useState<ReturnStatus | 'TODOS'>('TODOS');
  const [selected, setSelected] = useState<Return | null>(null);

  const filtered = filterStatus === 'TODOS'
    ? MOCK_RETURNS
    : MOCK_RETURNS.filter(r => r.status === filterStatus);

  const pendentes  = MOCK_RETURNS.filter(r => r.status === 'PENDENTE').length;
  const aprovados  = MOCK_RETURNS.filter(r => r.status === 'APROVADO').length;
  const rejeitados = MOCK_RETURNS.filter(r => r.status === 'REJEITADO').length;

  return (
    <AppLayout>
      {selected && <ReturnModal ret={selected} onClose={() => setSelected(null)} />}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Devoluções</em>
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total"       value={String(MOCK_RETURNS.length)} sub="devoluções registradas" color="accent" />
        <StatCard label="Pendentes"   value={String(pendentes)}            sub="aguardando análise"     color="amber"  />
        <StatCard label="Aprovados"   value={String(aprovados)}            sub="estoque estornado"      color="green"  />
        <StatCard label="Rejeitados"  value={String(rejeitados)}           sub="não autorizados"        color="red"    />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['TODOS', ...ALL_STATUS] as const).map(s => {
          const active = filterStatus === s;
          const cfg = s !== 'TODOS' ? STATUS_CFG[s] : null;
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-4 py-2 rounded-[10px] border-none cursor-pointer text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-150"
              style={{
                fontFamily: 'inherit',
                background: active ? (cfg?.bg ?? 'var(--accent)') : 'var(--bg)',
                color:      active ? (cfg?.t  ?? 'var(--text-on-accent)') : 'var(--text-muted)',
                boxShadow:  active ? 'none' : '4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l)',
              }}>
              {s === 'TODOS' ? 'Todas' : STATUS_CFG[s].label}
            </button>
          );
        })}
      </div>

      {/* Cards de devolução */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="neu-card rounded-[20px] py-12 text-center" style={{ color: 'var(--text-soft)' }}>
            Nenhuma devolução encontrada
          </div>
        )}
        {filtered.map(r => {
          const cfg = STATUS_CFG[r.status];
          return (
            <div key={r.id} className="neu-card rounded-[18px] p-5 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <p className="font-bold text-[14px]" style={{ color: 'var(--accent)' }}>{r.numeroRetorno}</p>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: cfg.bg, color: cfg.t }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                    {cfg.label}
                  </span>
                  <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Pedido: {r.numeroPedido}</span>
                </div>
                <p className="text-[13px] mb-1" style={{ color: 'var(--text)' }}>{r.motivo}</p>
                <p className="text-[11.5px]" style={{ color: 'var(--text-soft)' }}>
                  {r.items.length} {r.items.length === 1 ? 'item' : 'itens'} · Solicitado em {fmtDate(r.dataSolicitacao)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="row" onClick={() => setSelected(r)}>Detalhes</Button>
                {r.status === 'PENDENTE' && (
                  <>
                    <button className="neu-btn-sm px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-[11px] font-bold"
                      style={{ fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--ok)' }}>
                      Aprovar
                    </button>
                    <button className="neu-btn-sm px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-[11px] font-bold"
                      style={{ fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--crit)' }}>
                      Rejeitar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
