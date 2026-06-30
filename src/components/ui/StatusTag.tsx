import type { OrderStatus } from '../../types';

interface StatusTagProps {
  status: OrderStatus;
}

const config: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  CRIADO:     { label: 'Criado',     bg: 'var(--tag-pend)',    text: 'var(--tag-pend-t)',    dot: 'var(--tag-pend-dot)' },
  CONFIRMADO: { label: 'Confirmado', bg: 'var(--tag-confirm)', text: 'var(--tag-confirm-t)', dot: 'var(--tag-confirm-dot)' },
  SEPARADO:   { label: 'Separado',   bg: 'var(--tag-sep)',     text: 'var(--tag-sep-t)',     dot: 'var(--tag-sep-dot)' },
  PRONTO:     { label: 'Pronto',     bg: 'var(--tag-pronto)',  text: 'var(--tag-pronto-t)',  dot: 'var(--tag-pronto-dot)' },
  FINALIZADO: { label: 'Finalizado', bg: 'var(--tag-fin)',     text: 'var(--tag-fin-t)',     dot: 'var(--tag-fin-dot)' },
  CANCELADO:  { label: 'Cancelado',  bg: 'var(--tag-canc)',    text: 'var(--tag-canc-t)',    dot: 'var(--tag-canc-dot)' },
};

/** Tag colorida com indicador de ponto para status de pedidos */
export function StatusTag({ status }: StatusTagProps) {
  const { label, bg, text, dot } = config[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-[0.6px]"
      style={{ background: bg, color: text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dot }}
      />
      {label}
    </span>
  );
}
