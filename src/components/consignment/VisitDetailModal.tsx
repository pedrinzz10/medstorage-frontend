import { useState } from 'react';
import { Button } from '../ui/Button';
import { RegisterCountModal } from './RegisterCountModal';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import type { ConsignmentVisit } from '../../types';

const statusLabel: Record<string, string> = {
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
};

export function VisitDetailModal({ visit, onClose, onChanged }: {
  visit: ConsignmentVisit;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'gerente_estoque';
  const [showCount, setShowCount] = useState(false);

  async function handleCancel() {
    if (!confirm('Cancelar esta visita agendada?')) return;
    try {
      await api.patch(`/api/consignment-visits/${visit.id}/cancel`);
      onChanged();
      onClose();
    } catch (e) {
      alert((e as Error).message || 'Erro ao cancelar visita');
    }
  }

  if (showCount) {
    return (
      <RegisterCountModal
        customerId={visit.customerId}
        customerNome={visit.customerNome}
        visitId={visit.id}
        onClose={() => { setShowCount(false); onClose(); }}
        onSaved={onChanged}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[420px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">Visita — {visit.customerNome}</h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 text-[13px]">
          <div className="neu-inset rounded-[11px] px-4 py-3 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.7px] w-[110px] flex-shrink-0" style={{ color: 'var(--text-soft)' }}>Data</span>
            <span className="font-medium">{new Date(visit.dataAgendada + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="neu-inset rounded-[11px] px-4 py-3 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.7px] w-[110px] flex-shrink-0" style={{ color: 'var(--text-soft)' }}>Funcionário</span>
            <span className="font-medium">{visit.funcionarioNome}</span>
          </div>
          <div className="neu-inset rounded-[11px] px-4 py-3 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.7px] w-[110px] flex-shrink-0" style={{ color: 'var(--text-soft)' }}>Status</span>
            <span className="font-medium">{statusLabel[visit.status] ?? visit.status}</span>
          </div>
          {visit.observacoes && (
            <div className="neu-inset rounded-[11px] px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1" style={{ color: 'var(--text-soft)' }}>Observações</p>
              <p>{visit.observacoes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {canManage && visit.status === 'AGENDADA' && (
            <Button variant="primary" className="w-full" onClick={() => setShowCount(true)}>
              Registrar Contagem
            </Button>
          )}
          <div className="flex gap-3">
            {canManage && visit.status === 'AGENDADA' && (
              <button onClick={handleCancel}
                className="flex-1 neu-btn px-[18px] py-[9px] rounded-[10px] text-[13px] font-bold tracking-[0.2px] border-none cursor-pointer"
                style={{ fontFamily: 'inherit', background: 'var(--crit-bg)', color: 'var(--crit)' }}>
                Cancelar Visita
              </button>
            )}
            <Button variant="ghost" className="flex-1" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
