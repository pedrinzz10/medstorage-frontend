import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'row' | 'danger-row';
  children: ReactNode;
}

/**
 * Botão neumórfico com três variantes visuais:
 * - primary: fundo accent, para ações principais
 * - ghost:   fundo neutro elevado, para ações secundárias
 * - row:     botão compacto para linhas de tabela
 */
export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'border-none cursor-pointer font-[inherit] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary: `${base} neu-btn px-[18px] py-[9px] rounded-[10px] text-white text-[13px] font-bold tracking-[0.2px]`,
    ghost:   `${base} neu-btn px-[16px] py-[9px] rounded-[10px] text-[var(--text-muted)] text-[12px] font-semibold uppercase tracking-[0.8px]`,
    row:     `${base} neu-btn-sm px-3 py-[5px] rounded-[7px] text-[var(--text-muted)] text-[12px] font-semibold hover:text-[var(--accent)]`,
    'danger-row': `${base} neu-btn-sm px-3 py-[5px] rounded-[7px] text-[var(--text-muted)] text-[12px] font-semibold hover:text-[var(--crit)]`,
  };

  const style = variant === 'primary'
    ? { background: 'var(--accent)' }
    : { background: 'var(--bg)' };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
