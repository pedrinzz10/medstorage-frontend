import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { StatusTag } from '../components/ui/StatusTag';
import { Button } from '../components/ui/Button';
import { CreateOrderModal } from '../components/orders/CreateOrderModal';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import type { Order, OrderStatus } from '../types';

const PAGE_SIZE = 30;

const FILTER_OPTIONS: { label: string; value: OrderStatus | 'TODOS' }[] = [
  { label: 'Todos',      value: 'TODOS' },
  { label: 'Criado',     value: 'CRIADO' },
  { label: 'Confirmado', value: 'CONFIRMADO' },
  { label: 'Separado',   value: 'SEPARADO' },
  { label: 'Pronto',     value: 'PRONTO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
  { label: 'Cancelado',  value: 'CANCELADO' },
];

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  CRIADO:     'CONFIRMADO',
  CONFIRMADO: 'SEPARADO',
  SEPARADO:   'PRONTO',
  PRONTO:     'FINALIZADO',
};

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildUrl(statusFilter: OrderStatus | 'TODOS', page: number) {
  const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE), sort: 'createdAt,desc' });
  if (statusFilter !== 'TODOS') params.set('status', statusFilter);
  return `/api/orders?${params}`;
}

export function PedidosPage() {
  const { user } = useAuth();
  const location = useLocation();
  const canChangeStatus = user?.role === 'admin' || user?.role === 'gerente_estoque';
  const canCreateOrder = user?.role === 'admin' || user?.role === 'vendedor';

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'TODOS'>('TODOS');
  const [search, setSearch] = useState(() => (location.state as { customerName?: string } | null)?.customerName ?? '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async (statusFilter: OrderStatus | 'TODOS', page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<PageResponse<Order>>(buildUrl(statusFilter, page));
      setOrders(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (e) {
      setError((e as Error).message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders(activeFilter, 0);
  }, [activeFilter, fetchOrders]);

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(o =>
      o.numeroPedido.toLowerCase().includes(q) ||
      o.customerNome.toLowerCase().includes(q),
    );
  }, [orders, search]);

  const totais = useMemo(() => ({
    total:      totalElements,
    pendentes:  orders.filter(o => o.status === 'CRIADO').length,
    prontos:    orders.filter(o => o.status === 'PRONTO').length,
    faturamento: orders
      .filter(o => o.status !== 'CANCELADO')
      .reduce((acc, o) => acc + o.valorTotal, 0),
  }), [orders, totalElements]);

  async function handleAdvance(order: Order) {
    const nextStatus = STATUS_NEXT[order.status];
    if (!nextStatus) return;
    setAdvancing(order.id);
    try {
      await api.patch(`/api/orders/${order.id}/status`, { newStatus: nextStatus });
      await fetchOrders(activeFilter, currentPage);
    } catch (e) {
      alert((e as Error).message || 'Erro ao avançar status');
    } finally {
      setAdvancing(null);
    }
  }

  function handleFilterChange(value: OrderStatus | 'TODOS') {
    setSearch('');
    setActiveFilter(value);
  }

  return (
    <AppLayout>
      {showCreate && (
        <CreateOrderModal onClose={() => setShowCreate(false)} onSaved={() => fetchOrders(activeFilter, currentPage)} />
      )}
      {viewingOrder && (
        <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[21px] font-extrabold tracking-[-0.5px]">
          Gestão de{' '}
          <em className="text-[var(--accent)] not-italic">Pedidos</em>
        </h1>
        {canCreateOrder && <Button variant="primary" onClick={() => setShowCreate(true)}>+ Novo Pedido</Button>}
      </div>

      {/* Cards de estatística */}
      <div className="grid grid-cols-4 gap-4 mb-[26px]">
        <StatCard label="Total"      value={totais.total}      sub="Nesta página"             color="accent" />
        <StatCard label="Pendentes"  value={totais.pendentes}  sub="Aguardando confirmação"   color="amber"  />
        <StatCard label="Prontos"    value={totais.prontos}    sub="Prontos para retirada"    color="green"  />
        <StatCard
          label="Faturamento"
          value={`R$ ${(totais.faturamento / 1000).toFixed(1)}k`}
          sub="Pedidos não cancelados"
          color="accent"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2.5 items-center mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar pedido ou cliente…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="neu-input w-full px-[18px] py-[11px] rounded-[12px] border-none outline-none text-[13.5px]"
            style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}
          />
        </div>
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className="px-4 py-2.5 rounded-[10px] border-none cursor-pointer text-[12px] font-semibold uppercase tracking-[0.7px] transition-all duration-200"
            style={{
              fontFamily: 'inherit',
              background: activeFilter === f.value ? 'var(--nav-active)' : 'var(--bg)',
              color: activeFilter === f.value ? 'var(--accent)' : 'var(--text-muted)',
              boxShadow: '4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="neu-card rounded-[20px] overflow-hidden">
        {error && (
          <div className="px-5 py-4 text-[13px] font-semibold" style={{ color: 'var(--crit)', background: 'var(--crit-bg)' }}>
            {error} —{' '}
            <button
              className="underline cursor-pointer border-none bg-transparent font-semibold"
              style={{ color: 'var(--crit)', fontFamily: 'inherit' }}
              onClick={() => void fetchOrders(activeFilter, currentPage)}
            >
              Tentar novamente
            </button>
          </div>
        )}

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['N.º Pedido', 'Cliente', 'Itens', 'Valor', 'Data', 'Status', ''].map(h => (
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div
                        className="h-3.5 rounded-[6px] animate-pulse"
                        style={{ background: 'var(--border)', width: j === 1 ? '60%' : j === 6 ? '40px' : '80%' }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  {search ? 'Nenhum pedido encontrado para esta busca.' : 'Nenhum pedido neste status.'}
                </td>
              </tr>
            ) : (
              filtered.map((order, i) => {
                const nextStatus = STATUS_NEXT[order.status];
                const isAdvancing = advancing === order.id;
                return (
                  <tr
                    key={order.id}
                    className="transition-colors duration-100"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-fade)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-5 py-3.5 text-[13px] font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                      {order.numeroPedido}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] font-semibold">
                      {order.customerNome}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px]" style={{ color: 'var(--text-muted)' }}>
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] font-bold tabular-nums">
                      {formatBRL(order.valorTotal)}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px]" style={{ color: 'var(--text-muted)' }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusTag status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <Button variant="row" onClick={() => setViewingOrder(order)}>Ver</Button>
                        {canChangeStatus && nextStatus && (
                          <button
                            onClick={() => void handleAdvance(order)}
                            disabled={isAdvancing}
                            className="px-2.5 py-1 rounded-[7px] border-none cursor-pointer text-[11px] font-bold uppercase tracking-[0.5px] transition-all duration-150"
                            style={{
                              fontFamily: 'inherit',
                              background: isAdvancing ? 'var(--border)' : 'var(--accent)',
                              color: isAdvancing ? 'var(--text-muted)' : '#fff',
                              opacity: isAdvancing ? 0.7 : 1,
                            }}
                          >
                            {isAdvancing ? '…' : `→ ${nextStatus.slice(0, 4)}`}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {!loading && !error && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {totalElements} pedidos — página {currentPage + 1} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => void fetchOrders(activeFilter, currentPage - 1)}
                className="px-3 py-1.5 rounded-[8px] border-none cursor-pointer text-[12px] font-semibold transition-all"
                style={{
                  fontFamily: 'inherit',
                  background: 'var(--bg)',
                  color: currentPage === 0 ? 'var(--text-muted)' : 'var(--text)',
                  boxShadow: '3px 3px 7px var(--shadow-d), -3px -3px 7px var(--shadow-l)',
                  opacity: currentPage === 0 ? 0.5 : 1,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Anterior
              </button>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => void fetchOrders(activeFilter, currentPage + 1)}
                className="px-3 py-1.5 rounded-[8px] border-none cursor-pointer text-[12px] font-semibold transition-all"
                style={{
                  fontFamily: 'inherit',
                  background: 'var(--bg)',
                  color: currentPage >= totalPages - 1 ? 'var(--text-muted)' : 'var(--text)',
                  boxShadow: '3px 3px 7px var(--shadow-d), -3px -3px 7px var(--shadow-l)',
                  opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
