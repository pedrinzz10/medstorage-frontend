import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Return, ReturnStatus } from '../types';

const STATUS_CFG: Record<ReturnStatus, { bg: string; t: string; label: string; dot: string }> = {
  PENDENTE:   { bg: 'var(--tag-pend)',    t: 'var(--tag-pend-t)',    label: 'Pendente',   dot: 'var(--tag-pend-dot)'    },
  PROCESSADO: { bg: 'var(--tag-pronto)',  t: 'var(--tag-pronto-t)',  label: 'Processado', dot: 'var(--tag-pronto-dot)'  },
  REJEITADO:  { bg: 'var(--tag-canc)',    t: 'var(--tag-canc-t)',    label: 'Rejeitado',  dot: 'var(--tag-canc-dot)'    },
};

const ALL_STATUS: ReturnStatus[] = ['PENDENTE', 'PROCESSADO', 'REJEITADO'];

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

function ReturnModal({ ret, onClose, onAction, canProcess }: { ret: Return; onClose: () => void; onAction: (id: string, action: 'process' | 'reject') => void; canProcess: boolean }) {
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
                <span className="text-[13px] font-medium">{item.productNome}</span>
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

        {ret.status === 'PENDENTE' && canProcess && (
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={() => onAction(ret.id, 'process')}>Processar</Button>
            <Button variant="danger-row" className="flex-1 neu-btn px-4 py-2 rounded-[10px]"
              style={{ background: 'var(--bg)' }} onClick={() => onAction(ret.id, 'reject')}>
              Rejeitar
            </Button>
          </div>
        )}
        {(ret.status !== 'PENDENTE' || !canProcess) && (
          <Button variant="ghost" className="w-full" onClick={onClose}>Fechar</Button>
        )}
      </div>
    </div>
  );
}

export function DevolucoesPage() {
  const { user } = useAuth();
  const canProcess = user?.role === 'admin' || user?.role === 'gerente_estoque';
  const [filterStatus, setFilterStatus] = useState<ReturnStatus | 'TODOS'>('TODOS');
  const [selected, setSelected] = useState<Return | null>(null);

  const { data, loading, error, reload } = useApiResource<PageResponse<Return>>('/api/returns?page=0&size=100&sort=dataSolicitacao,desc');
  const returns = data?.content ?? [];

  async function handleAction(id: string, action: 'process' | 'reject') {
    try {
      await api.patch(`/api/returns/${id}/${action}`);
      setSelected(null);
      reload();
    } catch (e) {
      alert((e as Error).message || 'Erro ao processar devolução');
    }
  }

  const filtered = filterStatus === 'TODOS'
    ? returns
    : returns.filter(r => r.status === filterStatus);

  const pendentes   = returns.filter(r => r.status === 'PENDENTE').length;
  const processados = returns.filter(r => r.status === 'PROCESSADO').length;
  const rejeitados  = returns.filter(r => r.status === 'REJEITADO').length;

  return (
    <AppLayout>
      {selected && <ReturnModal ret={selected} onClose={() => setSelected(null)} onAction={handleAction} canProcess={canProcess} />}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Devoluções</em>
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
        <StatCard label="Total"       value={String(data?.totalElements ?? returns.length)} sub="devoluções registradas" color="accent" />
        <StatCard label="Pendentes"   value={String(pendentes)}            sub="aguardando análise"     color="amber"  />
        <StatCard label="Processados" value={String(processados)}          sub="estoque estornado"      color="green"  />
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
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="neu-card rounded-[18px] p-5 h-[92px] animate-pulse" style={{ opacity: 0.6 }} />
          ))}
        {!loading && filtered.length === 0 && (
          <div className="neu-card rounded-[20px] py-12 text-center" style={{ color: 'var(--text-soft)' }}>
            {error ? 'Não foi possível carregar as devoluções' : 'Nenhuma devolução encontrada'}
          </div>
        )}
        {!loading && filtered.map(r => {
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
                {r.status === 'PENDENTE' && canProcess && (
                  <>
                    <button onClick={() => handleAction(r.id, 'process')}
                      className="neu-btn-sm px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-[11px] font-bold"
                      style={{ fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--ok)' }}>
                      Processar
                    </button>
                    <button onClick={() => handleAction(r.id, 'reject')}
                      className="neu-btn-sm px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-[11px] font-bold"
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
