import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { StatusTag } from '../components/ui/StatusTag';
import { Button } from '../components/ui/Button';
import type { Order, OrderStatus } from '../types';

/** Dados de exemplo para prototipagem */
const MOCK_ORDERS: Order[] = [
  {
    id: '1', numeroPedido: 'PED-2025-001', customerId: 'c1', customerNome: 'Hospital São Luís',
    valorTotal: 1240, createdAt: '2025-06-30T08:00:00',
    status: 'CRIADO', items: [],
  },
  {
    id: '2', numeroPedido: 'PED-2025-002', customerId: 'c2', customerNome: 'Clínica Vida',
    valorTotal: 3800, createdAt: '2025-06-30T09:15:00',
    status: 'CONFIRMADO', items: [],
  },
  {
    id: '3', numeroPedido: 'PED-2025-003', customerId: 'c3', customerNome: 'UBS Centro',
    valorTotal: 560, createdAt: '2025-06-29T14:00:00',
    status: 'SEPARADO', items: [],
  },
  {
    id: '4', numeroPedido: 'PED-2025-004', customerId: 'c4', customerNome: 'Hospital Regional',
    valorTotal: 6120, createdAt: '2025-06-29T10:30:00',
    status: 'PRONTO', items: [],
  },
  {
    id: '5', numeroPedido: 'PED-2025-005', customerId: 'c5', customerNome: 'Laboratório Alpha',
    valorTotal: 240, createdAt: '2025-06-28T16:45:00',
    status: 'FINALIZADO', items: [],
  },
  {
    id: '6', numeroPedido: 'PED-2025-006', customerId: 'c6', customerNome: 'Farmácia Central',
    valorTotal: 980, createdAt: '2025-06-28T11:00:00',
    status: 'CANCELADO', items: [],
  },
];

const FILTER_OPTIONS: { label: string; value: OrderStatus | 'TODOS' }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Criado', value: 'CRIADO' },
  { label: 'Confirmado', value: 'CONFIRMADO' },
  { label: 'Separado', value: 'SEPARADO' },
  { label: 'Pronto', value: 'PRONTO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

/** Formata valor monetário em BRL */
function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Página de Gestão de Pedidos.
 * Exibe estatísticas, filtros e tabela com todos os pedidos.
 */
export function PedidosPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'TODOS'>('TODOS');

  const filtered = MOCK_ORDERS.filter(o => {
    const matchSearch =
      o.numeroPedido.toLowerCase().includes(search.toLowerCase()) ||
      o.customerNome.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'TODOS' || o.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const totais = {
    hoje: MOCK_ORDERS.length,
    pendentes: MOCK_ORDERS.filter(o => o.status === 'CRIADO').length,
    prontos: MOCK_ORDERS.filter(o => o.status === 'PRONTO').length,
    faturamento: MOCK_ORDERS.filter(o => o.status !== 'CANCELADO')
      .reduce((acc, o) => acc + o.valorTotal, 0),
  };

  return (
    <AppLayout>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[21px] font-extrabold tracking-[-0.5px]">
          Gestão de{' '}
          <em className="text-[var(--accent)] not-italic">Pedidos</em>
        </h1>
        <Button variant="primary">+ Novo Pedido</Button>
      </div>

      {/* Cards de estatística */}
      <div className="grid grid-cols-4 gap-4 mb-[26px]">
        <StatCard label="Total Hoje"   value={totais.hoje}       sub="+3 vs. ontem"              color="accent" />
        <StatCard label="Pendentes"    value={totais.pendentes}  sub="Aguardando confirmação"    color="amber" />
        <StatCard label="Prontos"      value={totais.prontos}    sub="Prontos para retirada"     color="green" />
        <StatCard
          label="Faturamento"
          value={`R$ ${(totais.faturamento / 1000).toFixed(0)}k`}
          sub="Mês corrente"
          color="accent"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2.5 items-center mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar pedido, cliente ou N.º…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="neu-input w-full px-[18px] py-[11px] rounded-[12px] border-none outline-none text-[13.5px]"
            style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}
          />
        </div>
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className="transition-colors duration-100"
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-fade)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-3.5 text-[13px] font-bold font-[var(--accent)] tabular-nums" style={{ color: 'var(--accent)' }}>
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
                    <Button variant="row">Ver</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
