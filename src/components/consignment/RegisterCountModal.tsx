import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { api, type PageResponse } from '../../lib/api';
import { useApiResource } from '../../lib/useApiResource';
import type { Consignment, ConsignmentCount } from '../../types';

interface Line { consignmentItemId: string; quantidadeContada: string; loteConferido: string; validadeConferida: string }

function emptyLine(item: { id: string; lote?: string; validade?: string }): Line {
  return { consignmentItemId: item.id, quantidadeContada: '', loteConferido: item.lote ?? '', validadeConferida: item.validade ?? '' };
}

export function RegisterCountModal({ customerId, customerNome, visitId, onClose, onSaved }: {
  customerId: string;
  customerNome: string;
  visitId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data, loading } = useApiResource<PageResponse<Consignment>>(
    `/api/consignments?customerId=${customerId}&status=ATIVO&page=0&size=100`,
  );
  const activeItems = (data?.content ?? []).flatMap(c => c.items.filter(i => i.saldoDisponivel > 0));

  // Indexado por consignmentItemId (não por posição) para não quebrar quando
  // a lista carrega de forma assíncrona depois do primeiro render.
  const [lineByItemId, setLineByItemId] = useState<Record<string, Line>>({});

  useEffect(() => {
    if (!data) return;
    setLineByItemId(prev => {
      const next: Record<string, Line> = {};
      for (const item of activeItems) {
        next[item.id] = prev[item.id] ?? emptyLine(item);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [saving, setSaving] = useState(false);
  const [erro, setErro]     = useState<string | null>(null);
  const [result, setResult] = useState<ConsignmentCount | null>(null);

  function updateLine(itemId: string, patch: Partial<Line>) {
    setLineByItemId(prev => ({ ...prev, [itemId]: { ...(prev[itemId] ?? emptyLine({ id: itemId })), ...patch } }));
  }

  const validLines = Object.values(lineByItemId).filter(l => l.quantidadeContada !== '');

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      const response = await api.post<ConsignmentCount>('/api/consignments/counts', {
        customerId,
        visitId: visitId ?? null,
        dataContagem: new Date().toISOString().slice(0, 10),
        items: validLines.map(l => ({
          consignmentItemId: l.consignmentItemId,
          quantidadeContada: Number(l.quantidadeContada),
          loteConferido: l.loteConferido || null,
          validadeConferida: l.validadeConferida || null,
        })),
      });
      setResult(response);
      onSaved();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao registrar contagem');
    } finally {
      setSaving(false);
    }
  }

  function divergenceColor(d: number) {
    if (d > 0) return 'var(--crit)';
    if (d < 0) return 'var(--warn)';
    return 'var(--ok)';
  }
  function divergenceLabel(d: number) {
    if (d > 0) return `Faltando ${d} un.`;
    if (d < 0) return `Sobra ${Math.abs(d)} un.`;
    return 'OK';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[600px] p-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">
            {result ? 'Resultado da Contagem' : 'Registrar Contagem'} — {customerNome}
          </h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        {result ? (
          <div className="flex flex-col gap-2">
            {result.items.map(item => (
              <div key={item.id} className="neu-inset rounded-[11px] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-semibold">{item.productNome}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Contado {item.quantidadeContada}{item.loteConferido ? ` · Lote ${item.loteConferido}` : ''}
                  </p>
                </div>
                <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: 'var(--nav-active)', color: divergenceColor(item.divergencia) }}>
                  {divergenceLabel(item.divergencia)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            {loading && (
              <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>
            )}
            {!loading && activeItems.length === 0 && (
              <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                Nenhum item consignado ativo para este cliente.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {!loading && activeItems.map(item => {
                const line = lineByItemId[item.id] ?? emptyLine(item);
                return (
                  <div key={item.id} className="neu-inset rounded-[11px] p-4">
                    <p className="text-[13px] font-semibold mb-2">
                      {item.productNome} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· saldo esperado {item.saldoDisponivel}</span>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <input type="number" min={0} placeholder="Qtd. contada" value={line.quantidadeContada}
                        onChange={e => updateLine(item.id, { quantidadeContada: e.target.value })}
                        className="neu-input w-[110px] px-3 py-2.5 rounded-[10px] border-none outline-none text-[13px]"
                        style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
                      <input type="text" placeholder="Lote conferido" value={line.loteConferido}
                        onChange={e => updateLine(item.id, { loteConferido: e.target.value })}
                        className="neu-input flex-1 min-w-[120px] px-3 py-2.5 rounded-[10px] border-none outline-none text-[13px]"
                        style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
                      <input type="date" value={line.validadeConferida}
                        onChange={e => updateLine(item.id, { validadeConferida: e.target.value })}
                        className="neu-input w-[150px] px-3 py-2.5 rounded-[10px] border-none outline-none text-[13px]"
                        style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          {result ? (
            <Button variant="primary" className="flex-1" onClick={onClose}>Fechar</Button>
          ) : (
            <>
              <Button variant="primary" className="flex-1" onClick={handleSave}
                disabled={saving || validLines.length === 0}>
                {saving ? 'Registrando…' : 'Registrar Contagem'}
              </Button>
              <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
