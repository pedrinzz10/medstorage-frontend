import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'row' | 'danger-row';
  children: ReactNode;
}

/**
 * Botão neumórfico com variantes:
 * - primary:    fundo âmbar (#fdc57b) com texto slate — CTAs principais
 * - secondary:  fundo sage (#7fa99b) com texto cream — ações de destaque secundário
 * - ghost:      fundo neutro elevado — ações terciárias
 * - row:        compacto para linhas de tabela/card
 * - danger-row: variante destrutiva para tabelas
 */
export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base =
    'border-none cursor-pointer font-[inherit] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const styles: Record<string, { cls: string; style: React.CSSProperties }> = {
    primary: {
      cls: `${base} neu-btn px-[18px] py-[9px] rounded-[10px] text-[13px] font-bold tracking-[0.2px]`,
      style: { background: 'var(--accent)', color: 'var(--text-on-accent)' },
    },
    secondary: {
      cls: `${base} neu-btn px-[18px] py-[9px] rounded-[10px] text-[13px] font-bold tracking-[0.2px]`,
      style: { background: 'var(--secondary)', color: '#fbf2d5' },
    },
    ghost: {
      cls: `${base} neu-btn px-[16px] py-[9px] rounded-[10px] text-[12px] font-semibold uppercase tracking-[0.8px]`,
      style: { background: 'var(--bg)', color: 'var(--text-muted)' },
    },
    row: {
      cls: `${base} neu-btn-sm px-3 py-[5px] rounded-[7px] text-[12px] font-semibold hover:text-[var(--secondary)]`,
      style: { background: 'var(--bg)', color: 'var(--text-muted)' },
    },
    'danger-row': {
      cls: `${base} neu-btn-sm px-3 py-[5px] rounded-[7px] text-[12px] font-semibold hover:text-[var(--crit)]`,
      style: { background: 'var(--bg)', color: 'var(--text-muted)' },
    },
  };

  const { cls, style } = styles[variant];

  return (
    <button className={`${cls} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}
