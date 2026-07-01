import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { StockBadge, StockBar } from '../components/ui/StockBadge';
import { Button } from '../components/ui/Button';
import type { InventoryItem, StockStatus } from '../types';

/** Produtos de demonstração */
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'p1', nome: 'Seringa 10 ml',
    sku: 'SRG-10ML-001', precoBase: 2.50, unidade: 'unidade',
    quantidadeAtual: 340, disponivel: 340, reservada: 0,
    estoqueMinimo: 50, statusEstoque: 'OK',
  },
  {
    id: 'p2', nome: 'Luva Nitrila P',
    sku: 'LVN-P-100', precoBase: 45.00, unidade: 'caixa',
    quantidadeAtual: 60, disponivel: 38, reservada: 22,
    estoqueMinimo: 40, statusEstoque: 'ATENCAO',
  },
  {
    id: 'p3', nome: 'Máscara Cirúrgica',
    sku: 'MSK-CRG-50', precoBase: 22.00, unidade: 'caixa',
    quantidadeAtual: 18, disponivel: 8, reservada: 10,
    estoqueMinimo: 20, statusEstoque: 'CRITICO',
  },
  {
    id: 'p4', nome: 'Gaze Estéril 10 cm',
    sku: 'GZE-10C-100', precoBase: 12.00, unidade: 'pacote',
    quantidadeAtual: 215, disponivel: 215, reservada: 0,
    estoqueMinimo: 50, statusEstoque: 'OK',
  },
  {
    id: 'p5', nome: 'Álcool 70% 1 L',
    sku: 'ALC-70-1L', precoBase: 8.90, unidade: 'frasco',
    quantidadeAtual: 15, disponivel: 5, reservada: 10,
    estoqueMinimo: 20, statusEstoque: 'CRITICO',
  },
];

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
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<StockStatus | 'TODOS'>('TODOS');

  const criticos = MOCK_INVENTORY.filter(i => i.statusEstoque === 'CRITICO');

  const filtered = MOCK_INVENTORY.filter(i => {
    const matchSearch =
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'TODOS' || i.statusEstoque === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[21px] font-extrabold tracking-[-0.5px]">
          Controle de{' '}
          <em className="text-[var(--accent)] not-italic">Estoque</em>
        </h1>
        <Button variant="primary">+ Novo Produto</Button>
      </div>

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
          label="Produtos Ativos"
          value={MOCK_INVENTORY.length}
          sub="No catálogo ativo"
          color="accent"
        />
        <StatCard
          label="Estoque Crítico"
          value={criticos.length}
          sub="Abaixo do mínimo"
          color="red"
        />
        <StatCard
          label="Movimentações Hoje"
          value={14}
          sub="Entradas + saídas"
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
        {filtered.map(item => (
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
              <Button variant="row" className="flex-1 text-center">Editar</Button>
              <Button variant="row" className="flex-1 text-center">Movimentações</Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
