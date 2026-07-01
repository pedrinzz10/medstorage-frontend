import { useState } from 'react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

export function CustomerFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [nome, setNome]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [telefone, setTelefone]               = useState('');
  const [cnpj, setCnpj]                       = useState('');
  const [endereco, setEndereco]               = useState('');
  const [contatoPrincipal, setContatoPrincipal] = useState('');
  const [saving, setSaving]                   = useState(false);
  const [erro, setErro]                       = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/customers', {
        nome,
        email,
        telefone: telefone || null,
        cnpj: cnpj || null,
        endereco: endereco || null,
        contatoPrincipal: contatoPrincipal || null,
      });
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao cadastrar cliente');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[480px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">Novo Cliente</h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Nome',              val: nome,             set: setNome,             type: 'text' },
            { label: 'E-mail',            val: email,            set: setEmail,            type: 'email' },
            { label: 'Telefone',          val: telefone,         set: setTelefone,         type: 'text' },
            { label: 'CNPJ',              val: cnpj,             set: setCnpj,             type: 'text' },
            { label: 'Endereço',          val: endereco,         set: setEndereco,         type: 'text' },
            { label: 'Contato Principal', val: contatoPrincipal, set: setContatoPrincipal, type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>
                {f.label}
              </label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px]"
                style={{ fontFamily: 'inherit', color: 'var(--text)' }} />
            </div>
          ))}
        </div>

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving || !nome.trim() || !email.trim()}>
            {saving ? 'Salvando…' : 'Cadastrar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
