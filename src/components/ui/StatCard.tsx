interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'accent' | 'green' | 'amber' | 'red';
}

const colorMap: Record<string, string> = {
  accent: 'var(--accent)',
  green:  'var(--green)',
  amber:  'var(--warn)',
  red:    'var(--crit)',
};

/** Card neumórfico de estatística para dashboards */
export function StatCard({ label, value, sub, color = 'accent' }: StatCardProps) {
  return (
    <div className="neu-card rounded-[18px] p-5">
      <p
        className="text-[10.5px] font-bold uppercase tracking-[1px] mb-2.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-[28px] font-extrabold tracking-[-1px] leading-none"
        style={{ color: colorMap[color] ?? colorMap.accent }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11.5px] mt-1" style={{ color: 'var(--text-soft)' }}>
          {sub}
        </p>
      )}
    </div>
  );
}
