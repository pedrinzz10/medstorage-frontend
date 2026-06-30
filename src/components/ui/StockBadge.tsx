import type { StockStatus } from '../../types';

interface StockBadgeProps {
  status: StockStatus;
}

const config: Record<StockStatus, { label: string; bg: string; text: string; dot: string; bar: string }> = {
  OK:      { label: 'Normal',  bg: 'var(--ok-bg)',   text: 'var(--ok)',   dot: 'var(--ok)',   bar: 'var(--ok-bar)' },
  ATENCAO: { label: 'Atenção', bg: 'var(--warn-bg)', text: 'var(--warn)', dot: 'var(--warn)', bar: 'var(--warn-bar)' },
  CRITICO: { label: 'Crítico', bg: 'var(--crit-bg)', text: 'var(--crit)', dot: 'var(--crit)', bar: 'var(--crit-bar)' },
};

/** Badge de status de estoque (Normal / Atenção / Crítico) */
export function StockBadge({ status }: StockBadgeProps) {
  const { label, bg, text, dot } = config[status];

  return (
    <span
      className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-[6px] text-[10.5px] font-bold uppercase tracking-[0.6px] whitespace-nowrap"
      style={{ background: bg, color: text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
      {label}
    </span>
  );
}

/** Barra de progresso neumórfica do estoque */
export function StockBar({ status, percent }: { status: StockStatus; percent: number }) {
  const { bar } = config[status];
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="neu-inset h-[7px] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, background: bar }}
      />
    </div>
  );
}
