'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApplyAffiliateProfile } from '@/hooks/useAffiliate';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AffiliateApplyPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const applyMutation = useApplyAffiliateProfile();

  const [code, setCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mpesa' | 'emola' | 'other' | ''>('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [createdAffiliate, setCreatedAffiliate] = useState<any | null>(null);

  const paymentDetails = useMemo(() => {
    if (!paymentMethod) return undefined;
    if (paymentMethod === 'mpesa' || paymentMethod === 'emola') {
      return phone ? { phone } : undefined;
    }
    if (paymentMethod === 'bank_transfer') {
      const details: Record<string, unknown> = {};
      if (bankName) details.bankName = bankName;
      if (accountNumber) details.accountNumber = accountNumber;
      if (accountName) details.accountName = accountName;
      return Object.keys(details).length ? details : undefined;
    }
    return otherDetails ? { details: otherDetails } : undefined;
  }, [accountName, accountNumber, bankName, otherDetails, paymentMethod, phone]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await applyMutation.mutateAsync({
        ...(code.trim() ? { code: code.trim().toUpperCase() } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
        ...(paymentDetails ? { paymentDetails } : {}),
      });
      setCreatedAffiliate(result.affiliate);

      toast({
        title: 'Perfil de afiliado enviado',
        description: `Estado atual: ${result.affiliate.status}`,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Falha ao enviar candidatura de afiliado.';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / <span className="text-primary">Candidatura a Afiliado</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Candidatar-se ao Programa de Afiliados</CardTitle>
              </CardHeader>
              <CardContent>
                {authLoading ? (
                  <div className="py-8 text-center text-gray-6">Verificando autenticação...</div>
                ) : !isAuthenticated ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-7 mb-4">Você precisa entrar para se candidatar.</p>
                    <Link href="/entrar"><Button>Entrar</Button></Link>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                      <Label htmlFor="code">Código de Afiliado (opcional)</Label>
                      <Input
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ex: HELTONAFF"
                      />
                    </div>

                    <div>
                      <Label>Método de Pagamento (opcional)</Label>
                      <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="emola">E-Mola</SelectItem>
                          <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(paymentMethod === 'mpesa' || paymentMethod === 'emola') && (
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="84xxxxxxx" />
                      </div>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="bankName">Banco</Label>
                          <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Nº da Conta</Label>
                          <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="accountName">Nome da Conta</Label>
                          <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'other' && (
                      <div>
                        <Label htmlFor="otherDetails">Detalhes</Label>
                        <Input id="otherDetails" value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} />
                      </div>
                    )}

                    <Button type="submit" disabled={applyMutation.isPending}>
                      {applyMutation.isPending ? 'Enviando...' : 'Enviar Candidatura'}
                    </Button>
                  </form>
                )}

                {createdAffiliate && (
                  <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-6 mb-2">Candidatura processada</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-6">Código</p>
                        <p className="font-semibold text-gray-9">{createdAffiliate.code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-6">Status</p>
                        <Badge variant="outline" className="capitalize mt-1">{createdAffiliate.status}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

