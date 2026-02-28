import React, { useState } from 'react';

type Props = {
  open: boolean;
  handle: string;
  objective: string;
  planDays: 7 | 30;
  onSubmit: (payload: { name: string; email: string; whatsapp: string; consent: boolean }) => Promise<void>;
  onClose: () => void;
};

export const LeadUnlockModal: React.FC<Props> = ({ open, handle, objective, planDays, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await onSubmit({ name, email, whatsapp, consent });
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-lg bg-white border-2 border-black p-6 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-xl font-extrabold">Desbloquear plano completo</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>
        <p className="text-sm text-gray-600">@{handle} • {objective} • {planDays} dias</p>

        <input className="w-full border-2 p-3" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full border-2 p-3" placeholder="Seu e-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border-2 p-3" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />

        <label className="flex gap-2 items-start text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          <span>Autorizo o uso dos meus dados para contato e melhoria da experiência.</span>
        </label>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button disabled={loading} className="btn-neurelic w-full" type="submit">
          {loading ? 'Salvando...' : 'Desbloquear agora'}
        </button>
      </form>
    </div>
  );
};
