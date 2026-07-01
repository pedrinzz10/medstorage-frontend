import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { CreateConsignmentModal } from '../components/consignment/CreateConsignmentModal';
import { ItemActionModal } from '../components/consignment/ItemActionModal';
import { RegisterCountModal } from '../components/consignment/RegisterCountModal';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Consignment, ConsignmentItem, ConsignmentStatus } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export function ConsignacaoPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'vendedor';
  const isAdmin = user?.role === 'admin';
  const canCount = user?.role === 'admin' || user?.role === 'gerente_estoque';

  const [filter, setFilter] = useState<ConsignmentStatus | 'TODOS'>('ATIVO');
  const [showCreate, setShowCreate] = useState(false);
  const [action, setAction] = useState<{ consignmentId: string; item: ConsignmentItem; type: 'usage' | 'return' } | null>(null);
  const [counting, setCounting] = useState<{ customerId: string; customerNome: string } | null>(null);

  const url = filter === 'TODOS'
    ? '/api/consignments?page=0&size=100&sort=createdAt,desc'
    : `/api/consignments?page=0&size=100&sort=createdAt,desc&status=${filter}`;
  const { data, loading, error, reload } = useApiResource<PageResponse<Consignment>>(url);
  const consignments = data?.content ?? [];

  async function handleClose(id: string) {
    if (!confirm('Encerrar esta consignação manualmente (baixa administrativa)?')) return;
    try {
      await api.patch(`/api/consignments/${id}/close`);
      reload();
    } catch (e) {
      alert((e as Error).message || 'Erro ao encerrar consignação');
    }
  }

  const ativas = consignments.filter(c => c.status === 'ATIVO').length;
  const totalItensEmAberto = consignments
    .filter(c => c.status === 'ATIVO')
    .reduce((acc, c) => acc + c.items.reduce((s, i) => s + i.saldoDisponivel, 0), 0);
  const valorEmAberto = consignments
    .filter(c => c.status === 'ATIVO')
    .reduce((acc, c) => acc + c.items.reduce((s, i) => s + i.saldoDisponivel * i.precoUnitario, 0), 0);

  return (
    <AppLayout>
      {showCreate && (
        <CreateConsignmentModal onClose={() => setShowCreate(false)} onSaved={reload} />
      )}
      {action && (
        <ItemActionModal
          consignmentId={action.consignmentId}
          item={action.item}
          action={action.type}
          onClose={() => setAction(null)}
          onSaved={reload}
        />
      )}
      {counting && (
        <RegisterCountModal
          customerId={counting.customerId}
          customerNome={counting.customerNome}
          onClose={() => setCounting(null)}
          onSaved={reload}
        />
      )}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Material em <em className="not-italic" style={{ color: 'var(--accent)' }}>Consignação</em>
        </h1>
        {canManage && <Button variant="primary" onClick={() => setShowCreate(true)}>+ Nova Remessa</Button>}
      </div>

      {error && (
        <div className="px-5 py-3 rounded-[14px] mb-5 text-[13px] font-semibold flex items-center gap-3"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
          {error} —{' '}
          <button className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }} onClick={reload}>Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard label="Consignações Ativas" value={ativas} sub="em aberto com clientes" color="accent" />
        <StatCard label="Itens em Aberto" value={totalItensEmAberto} sub="unidades no cliente" color="amber" />
        <StatCard label="Valor em Aberto" value={fmt(valorEmAberto)} sub="ainda não faturado" color="green" />
      </div>

      <div className="neu-card-sm rounded-[10px] flex overflow-hidden flex-shrink-0 mb-5 w-fit">
        {(['ATIVO', 'ENCERRADO', 'TODOS'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.5px] border-none cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'inherit',
              background: filter === f ? 'var(--accent)' : 'var(--bg)',
              color:      filter === f ? 'var(--text-on-accent)' : 'var(--text-muted)',
            }}>
            {f === 'ATIVO' ? 'Ativas' : f === 'ENCERRADO' ? 'Encerradas' : 'Todas'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading && <p className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>}
        {!loading && consignments.length === 0 && (
          <p className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            {error ? 'Não foi possível carregar as consignações' : 'Nenhuma consignação encontrada'}
          </p>
        )}
        {!loading && consignments.map(c => (
          <div key={c.id} className="neu-card rounded-[18px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-[15px]">{c.customerNome}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Desde {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                  {c.observacoes ? ` · ${c.observacoes}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px]"
                  style={{
                    background: c.status === 'ATIVO' ? 'var(--ok-bg)' : 'var(--tag-canc)',
                    color:      c.status === 'ATIVO' ? 'var(--ok)'    : 'var(--tag-canc-t)',
                  }}>
                  {c.status === 'ATIVO' ? 'Ativa' : 'Encerrada'}
                </span>
                {canCount && c.status === 'ATIVO' && (
                  <button onClick={() => setCounting({ customerId: c.customerId, customerNome: c.customerNome })}
                    className="text-[11px] font-bold cursor-pointer border-none bg-transparent"
                    style={{ color: 'var(--accent)', fontFamily: 'inherit' }}>
                    Registrar Contagem
                  </button>
                )}
                {isAdmin && c.status === 'ATIVO' && (
                  <button onClick={() => handleClose(c.id)}
                    className="text-[11px] font-bold cursor-pointer border-none bg-transparent"
                    style={{ color: 'var(--crit)', fontFamily: 'inherit' }}>
                    Encerrar
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {c.items.map(item => (
                <div key={item.id} className="neu-inset rounded-[11px] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-[13.5px] font-semibold">{item.productNome}</p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Enviado {item.quantidadeEnviada} · Usado {item.quantidadeUsada} · Devolvido {item.quantidadeDevolvida}
                      {item.lote ? ` · Lote ${item.lote}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[14px] font-bold" style={{ color: 'var(--accent)' }}>{item.saldoDisponivel}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-soft)' }}>disponível</p>
                    </div>
                    {canManage && c.status === 'ATIVO' && item.saldoDisponivel > 0 && (
                      <div className="flex gap-1.5">
                        <Button variant="row" onClick={() => setAction({ consignmentId: c.id, item, type: 'usage' })}>Registrar Uso</Button>
                        <Button variant="row" onClick={() => setAction({ consignmentId: c.id, item, type: 'return' })}>Devolver</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
