import { useState } from 'react';
import { Button } from '../ui/Button';
import { api, type PageResponse } from '../../lib/api';
import { useApiResource } from '../../lib/useApiResource';
import type { InventoryMovement } from '../../types';

export function MovementsModal({ productId, productNome, canRestock, onClose, onChanged }: {
  productId: string;
  productNome: string;
  canRestock: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { data, loading, error, reload } = useApiResource<PageResponse<InventoryMovement>>(
    `/api/inventory/movements?productId=${productId}&size=50&sort=createdAt,desc`,
  );
  const movements = data?.content ?? [];

  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo]         = useState('');
  const [saving, setSaving]         = useState(false);
  const [erro, setErro]             = useState<string | null>(null);

  async function handleRestock() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/inventory/movements', { productId, quantidade: Number(quantidade), motivo });
      setQuantidade('');
      setMotivo('');
      reload();
      onChanged();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao registrar movimentação');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[560px] p-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">
            Movimentações — {productNome}
          </h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        {canRestock && (
          <div className="neu-inset rounded-[14px] p-4 mb-5 flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
              Registrar entrada de estoque
            </p>
            <div className="flex gap-3">
              <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)}
                className="neu-input w-[130px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <input type="text" placeholder="Motivo (ex: reposição)" value={motivo} onChange={e => setMotivo(e.target.value)}
                className="neu-input flex-1 px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <Button variant="primary" onClick={handleRestock}
                disabled={saving || !quantidade || Number(quantidade) < 1 || !motivo.trim()}>
                {saving ? 'Salvando…' : 'Adicionar'}
              </Button>
            </div>
            {erro && <p className="text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {loading && <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>}
          {!loading && movements.length === 0 && (
            <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              {error ? 'Não foi possível carregar as movimentações' : 'Nenhuma movimentação registrada'}
            </p>
          )}
          {!loading && movements.map(m => (
            <div key={m.id} className="neu-card-sm rounded-[12px] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold">
                  <span style={{ color: m.tipo === 'IN' ? 'var(--ok)' : 'var(--crit)' }}>
                    {m.tipo === 'IN' ? '+ ' : '− '}{m.quantidade}
                  </span>{' '}
                  {m.motivo}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {new Date(m.createdAt).toLocaleString('pt-BR')}{m.criadoPorEmail ? ` · ${m.criadoPorEmail}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
