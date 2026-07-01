import { useState } from 'react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import type { Role } from '../../types';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'vendedor',        label: 'Vendedor' },
  { value: 'gerente_estoque', label: 'Gerente Estoque' },
  { value: 'admin',           label: 'Admin' },
];

export function UserFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [nome, setNome]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [role, setRole]         = useState<Role>('vendedor');
  const [saving, setSaving]     = useState(false);
  const [erro, setErro]         = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErro(null);
    try {
      await api.post('/api/auth/register', { nome, email, password, role, telefone: telefone || null });
      onSaved();
      onClose();
    } catch (e) {
      setErro((e as Error).message || 'Erro ao cadastrar usuário');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(57,74,81,.45)' }} onClick={onClose}>
      <div className="neu-card-lg rounded-[24px] w-full max-w-[480px] p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[17px] font-extrabold tracking-[-0.4px]">Novo Usuário</h2>
          <button onClick={onClose}
            className="neu-btn-sm w-8 h-8 rounded-[8px] border-none cursor-pointer flex items-center justify-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--bg)' }}>
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Nome',     val: nome,     set: setNome,     type: 'text' },
            { label: 'E-mail',   val: email,    set: setEmail,    type: 'email' },
            { label: 'Senha',    val: password, set: setPassword, type: 'password' },
            { label: 'Telefone', val: telefone, set: setTelefone, type: 'text' },
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

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
              style={{ color: 'var(--text-muted)' }}>
              Perfil
            </label>
            <select value={role} onChange={e => setRole(e.target.value as Role)}
              className="neu-input w-full px-4 py-3 rounded-[11px] border-none outline-none text-[14px] cursor-pointer"
              style={{ fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }}>
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {erro && (
          <p className="mt-4 text-[12px] font-semibold" style={{ color: 'var(--crit)' }}>{erro}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="primary" className="flex-1" onClick={handleSave}
            disabled={saving || !nome.trim() || !email.trim() || password.length < 6}>
            {saving ? 'Salvando…' : 'Cadastrar'}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
