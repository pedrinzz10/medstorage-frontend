import { useState } from 'react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import type { Product } from '../../types';

export function ProductModal({ product, onClose, onSaved }: { product: Product | 'new'; onClose: () => void; onSaved: () => void }) {
  const isNew = product === 'new';
  const p = isNew ? null : product;

  const [nome, setNome]             = useState(p?.nome ?? '');
  const [sku, setSku]               = useState(p?.sku ?? '');
  const [preco, setPreco]           = useState(p ? String(p.precoBase) : '');
  const [unidade, setUnidade]       = useState(p?.unidade ?? 'unidade');
  const [estoqueMin, setEstoqueMin] = useState(p ? String(p.estoqueMinimo) : '');
  const [descricao, setDescricao]   = useState(p?.descricao ?? '');
  const [saving, setSaving]         = useState(false);
  const [erro, setErro]             = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErro(null);
    const body = {
      nome,
      sku,
      descricao,
      precoBase: Number(preco),
      unidade,
      estoqueMinimo: Number(estoqueMin),
      ativo: isNew ? true : p!.ativo,
    };
    try {
      if (isNew) await api.post('/api/products', body);
      else await api.put(`/api/products/${p!.id}`, body);
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

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

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : isNew ? 'Cadastrar' : 'Salvar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
