'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawIdentifier = identifier.trim();
    if (!rawIdentifier) {
      setError('Insira seu email ou telefone');
      return;
    }

    const cleanIdentifier = rawIdentifier.includes('@')
      ? rawIdentifier
      : rawIdentifier.replace(/[\s-]/g, '');

    setLoading(true);
    setError('');

    try {
      await login(cleanIdentifier, password);
      // Redirect or close modal
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="identifier">Email ou Telefone</Label>
        <Input
          type="text"
          id="identifier"
          placeholder="ex: joao@exemplo.com, 847554622 ou +258847554622"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Palavra-passe</Label>
        <Input
          type="password"
          id="password"
          placeholder="A sua palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'A entrar...' : 'Entrar'}
      </Button>
    </form>
  );
}
