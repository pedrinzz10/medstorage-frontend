import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { api, type PageResponse } from '../lib/api';
import { useApiResource } from '../lib/useApiResource';
import type { Customer } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

function CustomerModal({ customer, onClose, onViewOrders }: { customer: Customer; onClose: () => void; onViewOrders: (c: Customer) => void }) {
  // A lista traz só dados básicos; os agregados (pedidos, volume, última
  // compra) vêm do detalhe. Busca o detalhe ao abrir o modal.
  const [detail, setDetail] = useState<Customer>(customer);
  useEffect(() => {
    api.get<Customer>(`/api/customers/${customer.id}`)
      .then(setDetail)
      .catch(() => { /* mantém dados básicos se o detalhe falhar */ });
  }, [customer.id]);
  customer = detail;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }}
      onClick={onClose}
    >
      <div
        className="neu-card-lg rounded-[24px] w-full max-w-[520px] p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">{customer.nome}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{customer.cnpj}</p>
          </div>
          <button
            onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="neu-card-sm rounded-[14px] p-3.5 text-center">
            <p className="text-[22px] font-extrabold" style={{ color: 'var(--accent)' }}>{customer.totalPedidos}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Pedidos</p>
          </div>
          <div className="neu-card-sm rounded-[14px] p-3.5 text-center">
            <p className="text-[17px] font-extrabold" style={{ color: 'var(--accent)' }}>{fmt(customer.valorTotalGasto ?? 0)}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Total Gasto</p>
          </div>
          <div className="neu-card-sm rounded-[14px] p-3.5 text-center">
            <p className="text-[13px] font-extrabold" style={{ color: 'var(--text)' }}>
              {customer.ultimaCompra ? new Date(customer.ultimaCompra).toLocaleDateString('pt-BR') : '—'}
            </p>
            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Última Compra</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-[13px]">
          {[
            { label: 'E-mail',           val: customer.email },
            { label: 'Telefone',         val: customer.telefone },
            { label: 'Endereço',         val: customer.endereco },
            { label: 'Contato Principal',val: customer.contatoPrincipal },
          ].map(r => (
            <div key={r.label} className="neu-inset rounded-[11px] px-4 py-3 flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.7px] w-[120px] flex-shrink-0" style={{ color: 'var(--text-soft)' }}>{r.label}</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>{r.val ?? '—'}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={() => onViewOrders(customer)}>Ver Pedidos</Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

export function ClientesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, loading, error, reload } = useApiResource<PageResponse<Customer>>('/api/customers?page=0&size=100&sort=nome,asc');
  const customers = data?.content ?? [];

  const filtered = customers.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    (c.cnpj ?? '').includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const comCnpj = customers.filter(c => c.cnpj).length;
  const comContato = customers.filter(c => c.contatoPrincipal).length;

  return (
    <AppLayout>
      {selected && (
        <CustomerModal
          customer={selected}
          onClose={() => setSelected(null)}
          onViewOrders={c => navigate('/pedidos', { state: { customerName: c.nome } })}
        />
      )}
      {showCreate && (
        <CustomerFormModal onClose={() => setShowCreate(false)} onSaved={reload} />
      )}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Clientes</em>
        </h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ Novo Cliente</Button>
      </div>

      {error && (
        <div className="px-5 py-3 rounded-[14px] mb-5 text-[13px] font-semibold flex items-center gap-3"
          style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
          {error} —{' '}
          <button className="underline cursor-pointer border-none bg-transparent font-semibold"
            style={{ color: 'var(--crit)', fontFamily: 'inherit' }} onClick={reload}>Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Clientes" value={String(data?.totalElements ?? customers.length)} sub="cadastrados"       color="accent" />
        <StatCard label="Com CNPJ"       value={String(comCnpj)}                                  sub="pessoa jurídica"    color="green"  />
        <StatCard label="Com Contato"    value={String(comContato)}                               sub="contato principal"  color="amber"  />
        <StatCard label="Exibidos"       value={String(filtered.length)}                          sub="na busca atual"     color="accent" />
      </div>

      {/* Barra de busca */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar por nome, CNPJ ou e-mail…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="neu-input w-full px-5 py-3.5 rounded-[14px] border-none outline-none text-[14px]"
          style={{ fontFamily: 'inherit', color: 'var(--text)' }}
        />
      </div>

      {/* Tabela */}
      <div className="neu-card rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                {['Cliente', 'CNPJ', 'Contato', 'Telefone', 'Endereço', ''].map(h => (
                  <th key={h} className="text-left py-4 px-5 font-bold text-[11px] uppercase tracking-[0.8px]"
                    style={{ color: 'var(--text-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>Carregando…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                    {error ? 'Não foi possível carregar os clientes' : 'Nenhum cliente encontrado'}
                  </td>
                </tr>
              )}
              {!loading && filtered.map((c, i) => (
                <tr key={c.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="transition-all duration-150"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-fade)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 neu-card-sm"
                        style={{ background: 'var(--secondary)', color: 'var(--secondary-text)' }}>
                        {c.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">{c.nome}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>{c.cnpj ?? '—'}</td>
                  <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>{c.contatoPrincipal ?? '—'}</td>
                  <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>{c.telefone ?? '—'}</td>
                  <td className="py-4 px-5 max-w-[240px] truncate" style={{ color: 'var(--text-muted)' }}>{c.endereco ?? '—'}</td>
                  <td className="py-4 px-5">
                    <Button variant="row" onClick={() => setSelected(c)}>Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
