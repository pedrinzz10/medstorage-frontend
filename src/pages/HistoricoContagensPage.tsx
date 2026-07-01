import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { ConsignmentCount, Customer } from '../types';

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

export function HistoricoContagensPage() {
  const { data: customersPage } = useApiResource<PageResponse<Customer>>('/api/customers?page=0&size=100&sort=nome,asc');
  const customers = customersPage?.content ?? [];

  const [customerId, setCustomerId] = useState('');

  const url = customerId
    ? `/api/consignments/counts?customerId=${customerId}`
    : '/api/consignments/counts';
  const { data, loading, error, reload } = useApiResource<ConsignmentCount[]>(url);
  const counts = data ?? [];

  const totalDivergencias = counts.reduce(
    (acc, c) => acc + c.items.filter(i => i.divergencia > 0).length, 0,
  );
  const totalContagens = counts.length;
  const totalItensConferidos = counts.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Histórico de <em className="not-italic" style={{ color: 'var(--accent)' }}>Contagens</em>
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
        <StatCard label="Contagens Registradas" value={totalContagens} sub={customerId ? 'para o cliente selecionado' : 'em todos os clientes'} color="accent" />
        <StatCard label="Itens Conferidos" value={totalItensConferidos} sub="unidades de produto contadas" color="green" />
        <StatCard label="Com Divergência" value={totalDivergencias} sub="possível uso não reportado" color="red" />
      </div>

      <div className="mb-5 max-w-[320px]">
        <select value={customerId} onChange={e => setCustomerId(e.target.value)}
          className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] cursor-pointer"
          style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
          <option value="">Todos os clientes</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {loading && <p className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>Carregando…</p>}
        {!loading && counts.length === 0 && (
          <p className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            {error ? 'Não foi possível carregar o histórico' : 'Nenhuma contagem registrada ainda'}
          </p>
        )}
        {!loading && counts.map(c => (
          <div key={c.id} className="neu-card rounded-[18px] p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="font-bold text-[15px]">{c.customerNome}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {new Date(c.dataContagem + 'T00:00:00').toLocaleDateString('pt-BR')} · Conferido por {c.funcionarioNome}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {c.items.map(item => (
                <div key={item.id} className="neu-inset rounded-[11px] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-[13.5px] font-semibold">{item.productNome}</p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Contado {item.quantidadeContada}
                      {item.loteConferido ? ` · Lote ${item.loteConferido}` : ''}
                      {item.validadeConferida ? ` · Val. ${new Date(item.validadeConferida + 'T00:00:00').toLocaleDateString('pt-BR')}` : ''}
                    </p>
                  </div>
                  <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                    style={{ background: 'var(--nav-active)', color: divergenceColor(item.divergencia) }}>
                    {divergenceLabel(item.divergencia)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
