import { useState } from 'react';
import { Button } from '../ui/Button';
import { api, type PageResponse } from '../../lib/api';
import { useApiResource } from '../../lib/useApiResource';
import type { Customer, StaffMember } from '../../types';

export function ScheduleVisitModal({ initialDate, onClose, onSaved }: {
  initialDate: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: customersPage } = useApiResource<PageResponse<Customer>>('/api/customers?page=0&size=100&sort=nome,asc');
  const { data: staff }         = useApiResource<StaffMember[]>('/api/users/staff');
  const customers = customersPage?.content ?? [];

  const [customerId, setCustomerId]     = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [dataAgendada, setDataAgendada] = useState(initialDate);
  const [observacoes, setObservacoes]   = useState('');
  const [saving, setSaving]             = useState(false);
  const [erro, setErro]                 = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/consignment-visits', {
        customerId, funcionarioId, dataAgendada, observacoes: observacoes || null,
      });
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao agendar visita');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[440px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">Agendar Visita</h2>
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
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Funcionário
            </label>
            <select value={funcionarioId} onChange={e => setFuncionarioId(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] cursor-pointer"
              style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
              <option value="">Selecione…</option>
              {(staff ?? []).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-muted)' }}>
              Data
            </label>
            <input type="date" value={dataAgendada} onChange={e => setDataAgendada(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px]"
              style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
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
            disabled={saving || !customerId || !funcionarioId || !dataAgendada}>
            {saving ? 'Agendando…' : 'Agendar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
