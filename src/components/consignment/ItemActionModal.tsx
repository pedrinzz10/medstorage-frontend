import { useState } from 'react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import type { ConsignmentItem } from '../../types';

interface Props {
  consignmentId: string;
  item: ConsignmentItem;
  action: 'usage' | 'return';
  onClose: () => void;
  onSaved: () => void;
}

export function ItemActionModal({ consignmentId, item, action, onClose, onSaved }: Props) {
  const [quantidade, setQuantidade] = useState('');
  const [dataUso, setDataUso]       = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving]         = useState(false);
  const [erro, setErro]             = useState<string | null>(null);

  const isUsage = action === 'usage';

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      if (isUsage) {
        await api.post(`/api/consignments/${consignmentId}/items/${item.id}/usage`, {
          quantidade: Number(quantidade), dataUso,
        });
      } else {
        await api.post(`/api/consignments/${consignmentId}/items/${item.id}/return`, {
          quantidade: Number(quantidade),
        });
      }
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao registrar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[420px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">
            {isUsage ? 'Registrar Uso' : 'Registrar Devolução'}
          </h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <p className="text-[13px] font-semibold mb-1">{item.productNome}</p>
        <p className="text-[11.5px] mb-5" style={{ color: 'var(--text-muted)' }}>
          Saldo disponível no cliente: {item.saldoDisponivel}
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Quantidade
            </label>
            <input type="number" min={1} max={item.saldoDisponivel} value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px]"
              style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
          </div>

          {isUsage && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
                Data do uso
              </label>
              <input type="date" value={dataUso} onChange={e => setDataUso(e.target.value)}
                className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
            </div>
          )}
        </div>

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={handleSave}
            disabled={saving || !quantidade || Number(quantidade) < 1 || Number(quantidade) > item.saldoDisponivel}>
            {saving ? 'Salvando…' : 'Confirmar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
