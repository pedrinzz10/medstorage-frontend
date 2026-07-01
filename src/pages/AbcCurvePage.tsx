import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { useApiResource } from '../lib/useApiResource';
import type { AbcClasse, ProductAbc } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const classeConfig: Record<AbcClasse, { label: string; bg: string; color: string }> = {
  A: { label: 'A', bg: 'var(--tag-pronto)', color: 'var(--tag-pronto-t)' },
  B: { label: 'B', bg: 'var(--tag-pend)', color: 'var(--tag-pend-t)' },
  C: { label: 'C', bg: 'var(--tag-canc)', color: 'var(--tag-canc-t)' },
};

function ClasseTag({ classe }: { classe: AbcClasse }) {
  const { label, bg, color } = classeConfig[classe];
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-[7px] text-[12px] font-extrabold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

/**
 * Curva ABC — classifica produtos por relevância de valor vendido (Pareto):
 * A cobre até 80% do valor acumulado, B até 95%, C o restante.
 */
export function AbcCurvePage() {
  const { data, loading, error, reload } = useApiResource<ProductAbc[]>('/api/products/abc-analysis');
  const produtos = data ?? [];

  const contagem = (classe: AbcClasse) => produtos.filter(p => p.classe === classe).length;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Curva <em className="not-italic" style={{ color: 'var(--accent)' }}>ABC</em>
        </h1>
      </div>

      {error && (
        <div className="px-5 py-3 rounded-[14px] mb-5 text-[13px] font-semibold flex items-center gap-3"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
          {error} —{' '}
          <button className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }} onClick={reload}>Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard label="Classe A" value={contagem('A')} sub="até 80% do valor vendido" color="green" />
        <StatCard label="Classe B" value={contagem('B')} sub="80% a 95% do valor vendido" color="amber" />
        <StatCard label="Classe C" value={contagem('C')} sub="restante / sem venda" color="red" />
      </div>

      <div className="neu-card rounded-[20px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Classe', 'Produto', 'SKU', 'Valor Vendido', 'Qtd. Vendida', '% Acumulado'].map(h => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-[1px]"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</td></tr>
            )}
            {!loading && produtos.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px]" style={{ color: 'var(--text-soft)' }}>
                {error ? 'Não foi possível carregar a curva ABC' : 'Nenhum produto cadastrado'}
              </td></tr>
            )}
            {!loading && produtos.map((p, i) => (
              <tr
                key={p.productId}
                style={{ borderBottom: i < produtos.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <td className="px-5 py-3.5"><ClasseTag classe={p.classe} /></td>
                <td className="px-5 py-3.5 text-[13.5px] font-semibold">{p.nome}</td>
                <td className="px-5 py-3.5 text-[12.5px] font-mono" style={{ color: 'var(--accent)' }}>{p.sku}</td>
                <td className="px-5 py-3.5 text-[13.5px] font-bold tabular-nums">{fmt(p.valorVendido)}</td>
                <td className="px-5 py-3.5 text-[13.5px]" style={{ color: 'var(--text-muted)' }}>{p.quantidadeVendida}</td>
                <td className="px-5 py-3.5 text-[13.5px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {p.percentualAcumulado.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
