import { useState } from 'react';
import { Button } from '../ui/Button';
import { api, type PageResponse } from '../../lib/api';
import { useApiResource } from '../../lib/useApiResource';
import type { Customer, Product } from '../../types';

interface Line { productId: string; quantidade: string }

export function CreateConsignmentModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { data: customersPage } = useApiResource<PageResponse<Customer>>('/api/customers?page=0&size=100&sort=nome,asc');
  const { data: productsPage }  = useApiResource<PageResponse<Product>>('/api/products?page=0&size=200&sort=nome,asc');
  const customers = customersPage?.content ?? [];
  const products  = (productsPage?.content ?? []).filter(p => p.ativo);

  const [customerId, setCustomerId]   = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [lines, setLines]             = useState<Line[]>([{ productId: '', quantidade: '1' }]);
  const [saving, setSaving]           = useState(false);
  const [erro, setErro]               = useState<string | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }
  function addLine() {
    setLines(prev => [...prev, { productId: '', quantidade: '1' }]);
  }
  function removeLine(i: number) {
    setLines(prev => prev.filter((_, idx) => idx !== i));
  }

  const validLines = lines.filter(l => l.productId && Number(l.quantidade) > 0);

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/consignments', {
        customerId,
        items: validLines.map(l => ({ productId: l.productId, quantidade: Number(l.quantidade) })),
        observacoes: observacoes || null,
      });
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao criar consignação');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[560px] p-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">Nova Remessa em Consignação</h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Cliente
            </label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] cursor-pointer"
              style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
              <option value="">Selecione…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
                Itens enviados
              </label>
              <button onClick={addLine} type="button"
                className="text-[12px] font-bold cursor-pointer border-none bg-transparent"
                style={{ color: 'var(--accent)', fontFamily: 'inherit' }}>
                + adicionar item
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {lines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <select value={line.productId} onChange={e => updateLine(i, { productId: e.target.value })}
                    className="neu-input flex-1 px-3 py-2.5 rounded-[10px] border-none outline-none text-[13px] cursor-pointer"
                    style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
                    <option value="">Produto…</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.sku}</option>)}
                  </select>
                  <input type="number" min={1} value={line.quantidade} onChange={e => updateLine(i, { quantidade: e.target.value })}
                    className="neu-input w-[80px] px-3 py-2.5 rounded-[10px] border-none outline-none text-[13px]"
                    style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
                  <button onClick={() => removeLine(i)} type="button" disabled={lines.length === 1}
                    className="neu-btn-sm w-9 h-9 rounded-[8px] border-none cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ color: 'var(--crit)', fontFamily: 'inherit', background: 'var(--bg)' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Observações (opcional)
            </label>
            <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={2}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] resize-none"
              style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
          </div>
        </div>

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={handleSave}
            disabled={saving || !customerId || validLines.length === 0}>
            {saving ? 'Enviando…' : 'Enviar em Consignação'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
