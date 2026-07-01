import { useState } from 'react';
import { Button } from '../ui/Button';
import { api, type PageResponse } from '../../lib/api';
import { useApiResource } from '../../lib/useApiResource';
import type { Batch, BatchOrderTrace, InventoryMovement } from '../../types';

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

  const {
    data: batches, loading: loadingBatches, error: errorBatches, reload: reloadBatches,
  } = useApiResource<Batch[]>(canRestock ? `/api/products/${productId}/batches` : null);

  const [traceBatch, setTraceBatch] = useState<Batch | null>(null);
  const {
    data: trace, loading: loadingTrace, error: errorTrace,
  } = useApiResource<BatchOrderTrace[]>(traceBatch ? `/api/inventory/batches/${traceBatch.id}/orders` : null);

  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo]         = useState('');
  const [lote, setLote]             = useState('');
  const [validade, setValidade]     = useState('');
  const [saving, setSaving]         = useState(false);
  const [erro, setErro]             = useState<string | null>(null);

  const [quantidadeContada, setQuantidadeContada] = useState('');
  const [observacao, setObservacao]               = useState('');
  const [savingCount, setSavingCount]             = useState(false);
  const [erroCount, setErroCount]                 = useState<string | null>(null);

  async function handleRestock() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/inventory/movements', { productId, quantidade: Number(quantidade), motivo, lote, validade });
      setQuantidade('');
      setMotivo('');
      setLote('');
      setValidade('');
      reload();
      reloadBatches();
      onChanged();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao registrar movimentação');
    } finally {
      setSaving(false);
    }
  }

  async function handleRegisterCount() {
    setSavingCount(true);
    setErroCount(null);
    try {
      await api.post('/api/inventory/movements/count', {
        productId, quantidadeContada: Number(quantidadeContada), observacao,
      });
      setQuantidadeContada('');
      setObservacao('');
      reload();
      onChanged();
    } catch (e) {
      setErroCount((e as Error).message || 'Erro ao registrar contagem');
    } finally {
      setSavingCount(false);
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
            <div className="flex gap-3 flex-wrap">
              <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)}
                className="neu-input w-[110px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <input type="text" placeholder="Lote" value={lote} onChange={e => setLote(e.target.value)}
                className="neu-input w-[120px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <input type="date" value={validade} onChange={e => setValidade(e.target.value)}
                className="neu-input w-[150px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <input type="text" placeholder="Motivo (ex: reposição)" value={motivo} onChange={e => setMotivo(e.target.value)}
                className="neu-input flex-1 min-w-[160px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <Button variant="primary" onClick={handleRestock}
                disabled={saving || !quantidade || Number(quantidade) < 1 || !motivo.trim() || !lote.trim() || !validade}>
                {saving ? 'Salvando…' : 'Adicionar'}
              </Button>
            </div>
            {erro && <p className="text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>}
          </div>
        )}

        {canRestock && (
          <div className="neu-inset rounded-[14px] p-4 mb-5 flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
              Registrar contagem física
            </p>
            <div className="flex gap-3">
              <input type="number" placeholder="Qtd. contada" value={quantidadeContada} onChange={e => setQuantidadeContada(e.target.value)}
                className="neu-input w-[130px] px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <input type="text" placeholder="Observação (ex: contagem mensal)" value={observacao} onChange={e => setObservacao(e.target.value)}
                className="neu-input flex-1 px-4 py-2.5 rounded-[10px] border-none outline-none text-[13.5px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
              <Button variant="primary" onClick={handleRegisterCount}
                disabled={savingCount || quantidadeContada === '' || Number(quantidadeContada) < 0 || !observacao.trim()}>
                {savingCount ? 'Salvando…' : 'Registrar'}
              </Button>
            </div>
            {erroCount && <p className="text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erroCount}</p>}
          </div>
        )}

        {canRestock && traceBatch && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setTraceBatch(null)}
                className="neu-btn-sm w-7 h-7 rounded-[7px] border-none cursor-pointer flex items-center justify-center"
                style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
                ←
              </button>
              <p className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
                Pedidos que consumiram o lote {traceBatch.lote}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {loadingTrace && <p className="text-center py-6 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>}
              {!loadingTrace && (trace ?? []).length === 0 && (
                <p className="text-center py-6 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  {errorTrace ? 'Não foi possível carregar os pedidos' : 'Nenhum pedido consumiu este lote ainda'}
                </p>
              )}
              {!loadingTrace && (trace ?? []).map((t, i) => (
                <div key={i} className="neu-card-sm rounded-[12px] px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold">{t.numeroPedido} — {t.customerNome}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {t.status} · {new Date(t.dataConsumo).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-[14px] font-bold">{t.quantidadeConsumida}un</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {canRestock && !traceBatch && (
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: 'var(--text-muted)' }}>
              Lotes
            </p>
            <div className="flex flex-col gap-2">
              {loadingBatches && <p className="text-center py-6 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>}
              {!loadingBatches && (batches ?? []).length === 0 && (
                <p className="text-center py-6 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  {errorBatches ? 'Não foi possível carregar os lotes' : 'Nenhum lote registrado'}
                </p>
              )}
              {!loadingBatches && (batches ?? []).map(b => {
                const cor = b.diasParaVencer <= 7 ? 'var(--crit)' : b.diasParaVencer <= 30 ? 'var(--warn)' : 'var(--text)';
                return (
                  <div key={b.id} className="neu-card-sm rounded-[12px] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold">{b.lote}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: cor }}>
                        Validade {new Date(b.validade + 'T00:00:00').toLocaleDateString('pt-BR')} ({b.diasParaVencer}d)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[14px] font-bold">{b.quantidade}</p>
                      <button onClick={() => setTraceBatch(b)}
                        className="text-[11px] font-bold cursor-pointer border-none bg-transparent"
                        style={{ color: 'var(--accent)', fontFamily: 'inherit' }}>
                        Ver pedidos
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
