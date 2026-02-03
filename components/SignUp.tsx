
import React, { useState } from 'react';
import type { User } from '../types';
import Button from './common/Button';
import Input from './common/Input';

interface SignUpProps {
  onSignUp: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && whatsapp && password) {
      onSignUp({ name, email, whatsapp });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary tracking-tight">AI Content Coach</h1>
          <p className="mt-2 text-brand-secondary">
            Crie sua conta para iniciar o diagnóstico da sua estratégia.
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-8 space-y-6">
            <h2 className="font-semibold text-lg text-brand-primary">Cadastro</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input id="name" label="Nome Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input id="email" label="Seu Melhor E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input id="whatsapp" label="WhatsApp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="(XX) XXXXX-XXXX" />
                <Input id="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit">Cadastrar e Iniciar Diagnóstico</Button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
