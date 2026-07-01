import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import type { Customer } from '../types';

const MOCK_CUSTOMERS: Customer[] = [
  { id:'1', nome:'Hospital São Luís',     email:'compras@saoluis.com.br',   telefone:'(98) 3212-4000', cnpj:'12.345.678/0001-90', endereco:'Rua dos Remédios, 100 — São Luís/MA', contatoPrincipal:'Dra. Fernanda Alves',   totalPedidos:24, valorTotalGasto:87400,  ultimaCompra:'2025-06-30' },
  { id:'2', nome:'Clínica Vida',          email:'admin@clinicavida.com',    telefone:'(11) 3344-5566', cnpj:'23.456.789/0001-01', endereco:'Av. Paulista, 500 — São Paulo/SP',   contatoPrincipal:'Sr. Roberto Moura',     totalPedidos:18, valorTotalGasto:54200,  ultimaCompra:'2025-06-30' },
  { id:'3', nome:'UBS Centro',            email:'ubs@prefeitura.gov.br',    telefone:'(21) 2222-3333', cnpj:'34.567.890/0001-12', endereco:'Rua da Saúde, 10 — Rio de Janeiro/RJ', contatoPrincipal:'Enf. Carla Reis',    totalPedidos:11, valorTotalGasto:21000,  ultimaCompra:'2025-06-29' },
  { id:'4', nome:'Hospital Regional',     email:'suprimentos@hospreg.com', telefone:'(31) 3444-5555', cnpj:'45.678.901/0001-23', endereco:'Av. do Contorno, 1200 — BH/MG',      contatoPrincipal:'Sr. Marcos Duarte',     totalPedidos:32, valorTotalGasto:143600, ultimaCompra:'2025-06-29' },
  { id:'5', nome:'Laboratório Alpha',     email:'lab@alphasaude.com',       telefone:'(85) 3211-0000', cnpj:'56.789.012/0001-34', endereco:'Rua dos Laboratoristas, 55 — Fortaleza/CE', contatoPrincipal:'Dra. Julia Pinto',  totalPedidos: 7, valorTotalGasto:18400,  ultimaCompra:'2025-06-28' },
  { id:'6', nome:'Farmácia Central',      email:'pedidos@farmaciacentral.com', telefone:'(51) 3101-2020', cnpj:'67.890.123/0001-45', endereco:'Av. Independência, 88 — Porto Alegre/RS', contatoPrincipal:'Sra. Patrícia Luz', totalPedidos:15, valorTotalGasto:36800,  ultimaCompra:'2025-06-28' },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

function CustomerModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
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
          <Button variant="primary" className="flex-1">Ver Pedidos</Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

export function ClientesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    (c.cnpj ?? '').includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalGasto = MOCK_CUSTOMERS.reduce((s, c) => s + (c.valorTotalGasto ?? 0), 0);
  const totalPedidos = MOCK_CUSTOMERS.reduce((s, c) => s + (c.totalPedidos ?? 0), 0);

  return (
    <AppLayout>
      {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Gestão de <em className="not-italic" style={{ color: 'var(--accent)' }}>Clientes</em>
        </h1>
        <Button variant="primary">+ Novo Cliente</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Clientes"  value={String(MOCK_CUSTOMERS.length)} sub="cadastrados"           color="accent" />
        <StatCard label="Total Pedidos"   value={String(totalPedidos)}           sub="histórico"             color="green"  />
        <StatCard label="Volume Total"    value={fmt(totalGasto)}                sub="faturado p/ clientes"  color="accent" />
        <StatCard label="Ticket Médio"    value={fmt(totalGasto / totalPedidos)} sub="por pedido"            color="amber"  />
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
                {['Cliente', 'CNPJ', 'Contato', 'Pedidos', 'Volume Total', 'Última Compra', ''].map(h => (
                  <th key={h} className="text-left py-4 px-5 font-bold text-[11px] uppercase tracking-[0.8px]"
                    style={{ color: 'var(--text-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                    Nenhum cliente encontrado
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => (
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
                  <td className="py-4 px-5 font-semibold">{c.totalPedidos ?? 0}</td>
                  <td className="py-4 px-5 font-bold" style={{ color: 'var(--accent)' }}>
                    {fmt(c.valorTotalGasto ?? 0)}
                  </td>
                  <td className="py-4 px-5" style={{ color: 'var(--text-muted)' }}>
                    {c.ultimaCompra ? new Date(c.ultimaCompra).toLocaleDateString('pt-BR') : '—'}
                  </td>
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
