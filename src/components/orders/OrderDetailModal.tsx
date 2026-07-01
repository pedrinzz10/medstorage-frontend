import { StatusTag } from '../ui/StatusTag';
import { Button } from '../ui/Button';
import type { Order } from '../../types';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[560px] p-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">{order.numeroPedido}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{order.customerNome}</p>
          </div>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <StatusTag status={order.status} />
          <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            {order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : '—'}
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {order.items.map(item => (
            <div key={item.id} className="neu-inset rounded-[11px] px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-semibold">{item.productNome}</p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                    {item.quantidade} × {formatBRL(item.precoUnitario)}
                  </p>
                </div>
                <p className="text-[14px] font-bold">{formatBRL(item.subtotal)}</p>
              </div>
              {item.lotes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.lotes.map((l, i) => (
                    <span key={i}
                      className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--nav-active)', color: 'var(--accent)' }}>
                      Lote {l.lote} — val. {new Date(l.validade + 'T00:00:00').toLocaleDateString('pt-BR')} — {l.quantidadeConsumida}un
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {order.notas && (
          <div className="neu-inset rounded-[11px] px-4 py-3 mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-1" style={{ color: 'var(--text-soft)' }}>Notas</p>
            <p className="text-[13px]" style={{ color: 'var(--text)' }}>{order.notas}</p>
          </div>
        )}

        <div className="flex justify-between items-center px-1 mb-6">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>Total</span>
          <span className="text-[20px] font-extrabold" style={{ color: 'var(--accent)' }}>{formatBRL(order.valorTotal)}</span>
        </div>

        <Button variant="ghost" className="w-full" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}
