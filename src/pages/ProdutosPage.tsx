import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ProductModal } from '../components/products/ProductModal';
import { useAuth } from '../contexts/AuthContext';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Product } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export function ProdutosPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch]         = useState('');
  const [filterAtivo, setFilterAtivo] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');
  const [modal, setModal]           = useState<Product | 'new' | null>(null);

  const { data, loading, error, reload } = useApiResource<PageResponse<Product>>('/api/products?page=0&size=100&sort=nome,asc');
  const products = data?.content ?? [];

  async function toggleAtivo(p: Product) {
    try {
      if (p.ativo) await api.delete(`/api/products/${p.id}`);
      else await api.put(`/api/products/${p.id}`, {
        nome: p.nome, sku: p.sku, descricao: p.descricao,
        precoBase: p.precoBase, unidade: p.unidade, estoqueMinimo: p.estoqueMinimo, ativo: true,
      });
      reload();
    } catch (e) {
      alert((e as Error).message || 'Erro ao alterar status do produto');
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchAtivo  = filterAtivo === 'TODOS' || (filterAtivo === 'ATIVO' ? p.ativo : !p.ativo);
    return matchSearch && matchAtivo;
  });

  const ativos   = products.filter(p => p.ativo).length;
  const inativos = products.filter(p => !p.ativo).length;

  return (
    <AppLayout>
      {modal !== null && <ProductModal product={modal} onClose={() => setModal(null)} onSaved={reload} />}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Catálogo de <em className="not-italic" style={{ color: 'var(--accent)' }}>Produtos</em>
        </h1>
        {isAdmin && <Button variant="primary" onClick={() => setModal('new')}>+ Novo Produto</Button>}
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
        <StatCard label="Total"    value={String(products.length)} sub="produtos cadastrados" color="accent" />
        <StatCard label="Ativos"   value={String(ativos)}          sub="disponíveis para venda" color="green"  />
        <StatCard label="Inativos" value={String(inativos)}        sub="fora de linha"        color="amber"  />
        <StatCard label="Filtrados" value={String(filtered.length)} sub="na visão atual"      color="accent" />
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nome ou SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="neu-input flex-1 min-w-[220px] px-5 py-3 rounded-[14px] border-none outline-none text-[14px]"
          style={{ fontFamily: 'inherit', color: 'var(--text)' }}
        />
        <div className="neu-card-sm rounded-[10px] flex overflow-hidden flex-shrink-0">
          {(['TODOS', 'ATIVO', 'INATIVO'] as const).map(f => (
            <button key={f} onClick={() => setFilterAtivo(f)}
              className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.5px] border-none cursor-pointer transition-all duration-150"
              style={{
                fontFamily: 'inherit',
                background: filterAtivo === f ? 'var(--accent)' : 'var(--bg)',
                color:      filterAtivo === f ? 'var(--text-on-accent)' : 'var(--text-muted)',
              }}>
              {f === 'TODOS' ? 'Todos' : f === 'ATIVO' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="neu-card rounded-[18px] p-5 h-[220px] animate-pulse" style={{ opacity: 0.6 }} />
          ))}
        {!loading && filtered.length === 0 && (
          <p className="col-span-full text-center py-12" style={{ color: 'var(--text-soft)' }}>
            {error ? 'Não foi possível carregar os produtos' : 'Nenhum produto encontrado'}
          </p>
        )}
        {!loading && filtered.map(p => (
          <div key={p.id} className="neu-card rounded-[18px] p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14.5px] leading-tight">{p.nome}</p>
                <p className="text-[11px] mt-0.5 font-mono" style={{ color: 'var(--accent)' }}>{p.sku}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                style={{
                  background: p.ativo ? 'var(--ok-bg)'   : 'var(--tag-canc)',
                  color:      p.ativo ? 'var(--ok)'       : 'var(--tag-canc-t)',
                }}>
                {p.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {p.descricao && (
              <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.descricao}</p>
            )}

            <div className="neu-inset rounded-[11px] px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-[20px] font-extrabold tracking-[-0.5px]" style={{ color: 'var(--accent)' }}>
                  {fmt(p.precoBase)}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>por {p.unidade}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold">{p.estoqueMinimo}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>estoque mín.</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2 mt-auto">
                <Button variant="row" className="flex-1" onClick={() => setModal(p)}>Editar</Button>
                <Button variant="danger-row" className="flex-1 neu-btn-sm px-3 py-1.5 rounded-[7px] text-[12px] font-semibold"
                  style={{ background: 'var(--bg)', color: p.ativo ? 'var(--crit)' : 'var(--ok)' }}
                  onClick={() => toggleAtivo(p)}>
                  {p.ativo ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
