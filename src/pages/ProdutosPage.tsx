import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import type { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { id:'1', nome:'Seringa 10 ml',         descricao:'Seringa descartável com agulha',    sku:'SRG-10ML-001', precoBase:2.50,  unidade:'unidade', estoqueMinimo:50,  ativo:true  },
  { id:'2', nome:'Luva Nitrila P',        descricao:'Caixa com 100 luvas nitrila P',     sku:'LVN-P-100',    precoBase:45.00, unidade:'caixa',   estoqueMinimo:20,  ativo:true  },
  { id:'3', nome:'Máscara Cirúrgica',     descricao:'Máscara tripla camada caixa 50un',  sku:'MSK-CRG-50',   precoBase:22.00, unidade:'caixa',   estoqueMinimo:30,  ativo:true  },
  { id:'4', nome:'Gaze Estéril 10 cm',    descricao:'Gaze estéril pacote com 10 unid',   sku:'GZE-10C-100',  precoBase:12.00, unidade:'pacote',  estoqueMinimo:40,  ativo:true  },
  { id:'5', nome:'Álcool 70% 1 L',        descricao:'Álcool isopropílico 70% — 1 litro', sku:'ALC-70-1L',    precoBase:8.90,  unidade:'frasco',  estoqueMinimo:25,  ativo:true  },
  { id:'6', nome:'Cateter Venoso 20G',    descricao:'Cateter intravenoso periférico 20G', sku:'CVP-20G-001',  precoBase:3.80,  unidade:'unidade', estoqueMinimo:100, ativo:false },
  { id:'7', nome:'Estetoscópio Duplo',    descricao:'Estetoscópio adulto/pediátrico',    sku:'EST-DUP-001',  precoBase:189.0, unidade:'unidade', estoqueMinimo:5,   ativo:true  },
  { id:'8', nome:'Termômetro Digital',    descricao:'Termômetro digital axilar',          sku:'TRM-DGT-001',  precoBase:28.50, unidade:'unidade', estoqueMinimo:10,  ativo:true  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

function ProductModal({ product, onClose }: { product: Product | 'new'; onClose: () => void }) {
  const isNew = product === 'new';
  const p = isNew ? null : product;

  const [nome, setNome]             = useState(p?.nome ?? '');
  const [sku, setSku]               = useState(p?.sku ?? '');
  const [preco, setPreco]           = useState(p ? String(p.precoBase) : '');
  const [unidade, setUnidade]       = useState(p?.unidade ?? 'unidade');
  const [estoqueMin, setEstoqueMin] = useState(p ? String(p.estoqueMinimo) : '');
  const [descricao, setDescricao]   = useState(p?.descricao ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[480px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">
            {isNew ? 'Novo Produto' : 'Editar Produto'}
          </h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Nome',          val: nome,       set: setNome,       type: 'text' },
            { label: 'SKU',           val: sku,        set: setSku,        type: 'text' },
            { label: 'Preço (R$)',    val: preco,      set: setPreco,      type: 'number' },
            { label: 'Estoque Mín.',  val: estoqueMin, set: setEstoqueMin, type: 'number' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>
                {f.label}
              </label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
            </div>
          ))}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
              style={{ color: 'var(--text-muted)' }}>
              Unidade
            </label>
            <select value={unidade} onChange={e => setUnidade(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] cursor-pointer"
              style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
              {['unidade', 'caixa', 'pacote', 'frasco', 'rolo', 'par'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
              style={{ color: 'var(--text-muted)' }}>
              Descrição
            </label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] resize-none"
              style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1">
            {isNew ? 'Cadastrar' : 'Salvar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

export function ProdutosPage() {
  const [search, setSearch]         = useState('');
  const [filterAtivo, setFilterAtivo] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');
  const [modal, setModal]           = useState<Product | 'new' | null>(null);

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search.toUpperCase());
    const matchAtivo  = filterAtivo === 'TODOS' || (filterAtivo === 'ATIVO' ? p.ativo : !p.ativo);
    return matchSearch && matchAtivo;
  });

  const ativos   = MOCK_PRODUCTS.filter(p => p.ativo).length;
  const inativos = MOCK_PRODUCTS.filter(p => !p.ativo).length;

  return (
    <AppLayout>
      {modal !== null && <ProductModal product={modal} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Catálogo de <em className="not-italic" style={{ color: 'var(--accent)' }}>Produtos</em>
        </h1>
        <Button variant="primary" onClick={() => setModal('new')}>+ Novo Produto</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total"    value={String(MOCK_PRODUCTS.length)} sub="produtos cadastrados" color="accent" />
        <StatCard label="Ativos"   value={String(ativos)}               sub="disponíveis para venda" color="green"  />
        <StatCard label="Inativos" value={String(inativos)}             sub="fora de linha"        color="amber"  />
        <StatCard label="Categorias" value="4"                          sub="tipos de produto"     color="accent" />
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
        {filtered.length === 0 && (
          <p className="col-span-full text-center py-12" style={{ color: 'var(--text-soft)' }}>
            Nenhum produto encontrado
          </p>
        )}
        {filtered.map(p => (
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

            <div className="flex gap-2 mt-auto">
              <Button variant="row" className="flex-1" onClick={() => setModal(p)}>Editar</Button>
              <Button variant="danger-row" className="flex-1 neu-btn-sm px-3 py-1.5 rounded-[7px] text-[12px] font-semibold"
                style={{ background: 'var(--bg)', color: p.ativo ? 'var(--crit)' : 'var(--ok)' }}>
                {p.ativo ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
