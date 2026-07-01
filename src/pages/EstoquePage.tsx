import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { StockBadge, StockBar } from '../components/ui/StockBadge';
import { Button } from '../components/ui/Button';
import { ProductModal } from '../components/products/ProductModal';
import { MovementsModal } from '../components/products/MovementsModal';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { InventoryItem, Product, StockStatus } from '../types';

const FILTERS: { label: string; value: StockStatus | 'TODOS' }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Normal', value: 'OK' },
  { label: 'Atenção', value: 'ATENCAO' },
  { label: 'Crítico', value: 'CRITICO' },
];

/** Percentual de estoque disponível em relação ao máximo estimado (3× mínimo) */
function stockPercent(item: InventoryItem) {
  const max = Math.max(item.estoqueMinimo * 3, item.quantidadeAtual);
  return Math.round((item.disponivel / max) * 100);
}

/**
 * Página de Controle de Estoque.
 * Exibe grid de cards por produto com barra de nível e indicadores de reserva.
 */
export function EstoquePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canRestock = user?.role === 'admin' || user?.role === 'gerente_estoque';

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<StockStatus | 'TODOS'>('TODOS');
  const [productModal, setProductModal] = useState<Product | 'new' | null>(null);
  const [movementsFor, setMovementsFor] = useState<InventoryItem | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);

  const { data, loading, error, reload } = useApiResource<InventoryItem[]>('/api/inventory/status');
  const inventory = data ?? [];

  const criticos = inventory.filter(i => i.statusEstoque === 'CRITICO');

  async function openEdit(item: InventoryItem) {
    setLoadingEdit(item.id);
    try {
      const product = await api.get<Product>(`/api/products/${item.id}`);
      setProductModal(product);
    } catch (e) {
      alert((e as Error).message || 'Erro ao carregar produto');
    } finally {
      setLoadingEdit(null);
    }
  }

  const filtered = inventory.filter(i => {
    const matchSearch =
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'TODOS' || i.statusEstoque === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout>
      {productModal !== null && (
        <ProductModal product={productModal} onClose={() => setProductModal(null)} onSaved={reload} />
      )}
      {movementsFor && (
        <MovementsModal
          productId={movementsFor.id}
          productNome={movementsFor.nome}
          canRestock={canRestock}
          onClose={() => setMovementsFor(null)}
          onChanged={reload}
        />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[21px] font-extrabold tracking-[-0.5px]">
          Controle de{' '}
          <em className="text-[var(--accent)] not-italic">Estoque</em>
        </h1>
        {isAdmin && <Button variant="primary" onClick={() => setProductModal('new')}>+ Novo Produto</Button>}
      </div>

      {error && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-[14px] mb-[22px] text-[13px] font-semibold"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}
        >
          {error} —{' '}
          <button
            className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }}
            onClick={reload}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Alerta de estoque crítico */}
      {criticos.length > 0 && (
        <div
          className="flex items-center gap-3.5 px-5 py-3 rounded-[14px] mb-[22px] text-[13px] font-semibold"
          style={{
            background: 'var(--crit-bg)',
            borderLeft: '3px solid var(--crit)',
            color: 'var(--crit)',
          }}
        >
          <span
            className="px-2 py-0.5 rounded-[6px] text-white text-[11px] font-extrabold"
            style={{ background: 'var(--crit)' }}
          >
            {criticos.length} produto{criticos.length !== 1 ? 's' : ''}
          </span>
          com estoque abaixo do nível mínimo — reposição necessária.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Produtos"
          value={inventory.length}
          sub="No catálogo"
          color="accent"
        />
        <StatCard
          label="Estoque Crítico"
          value={criticos.length}
          sub="Abaixo do mínimo"
          color="red"
        />
        <StatCard
          label="Reservado"
          value={inventory.reduce((acc, i) => acc + i.reservada, 0)}
          sub="Unidades alocadas"
          color="green"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2.5 mb-[22px] flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar produto, SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="neu-input w-full px-[18px] py-[11px] rounded-[12px] border-none outline-none text-[13.5px]"
            style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}
          />
        </div>
        {FILTERS.map(f => (
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

      {/* Grid de cards */}
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="neu-card rounded-[20px] p-[22px] h-[200px] animate-pulse" style={{ opacity: 0.6 }} />
          ))}
        {!loading && filtered.map(item => (
          <div
            key={item.id}
            className="neu-card rounded-[20px] p-[22px] flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {/* Cabeçalho do card */}
            <div className="flex justify-between items-start gap-2.5">
              <div>
                <p className="text-[14.5px] font-bold">{item.nome}</p>
                <p className="text-[11px] mt-0.5 tabular-nums tracking-[0.2px]" style={{ color: 'var(--text-muted)' }}>
                  {item.sku}
                </p>
              </div>
              <StockBadge status={item.statusEstoque} />
            </div>

            {/* Preço */}
            <p className="text-[19px] font-extrabold tracking-[-0.5px]" style={{ color: 'var(--accent)' }}>
              {item.precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}{' '}
              <small className="text-[12px] font-normal" style={{ color: 'var(--text-muted)' }}>
                / {item.unidade}
              </small>
            </p>

            {/* Barra de estoque */}
            <div>
              <div className="flex justify-between text-[12px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Disponível</span>
                <strong className="text-[13.5px] font-bold" style={{ color: 'var(--text)' }}>
                  {item.disponivel} {item.unidade !== 'unidade' ? item.unidade.slice(0, 2) : 'un'}
                </strong>
              </div>
              <StockBar status={item.statusEstoque} percent={stockPercent(item)} />
              {item.reservada > 0 && (
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-soft)' }}>
                  {item.reservada} reservado{item.reservada !== 1 ? 's' : ''} (total: {item.quantidadeAtual})
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              {isAdmin && (
                <Button variant="row" className="flex-1 text-center" disabled={loadingEdit === item.id} onClick={() => openEdit(item)}>
                  {loadingEdit === item.id ? '…' : 'Editar'}
                </Button>
              )}
              <Button variant="row" className="flex-1 text-center" onClick={() => setMovementsFor(item)}>Movimentações</Button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="col-span-full text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            {error ? 'Não foi possível carregar o estoque.' : 'Nenhum produto encontrado.'}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
