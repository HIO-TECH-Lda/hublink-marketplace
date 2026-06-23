'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAffiliateByAdmin } from '@/hooks/useAdminAffiliates';
import { useAdminUsers } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function AdminCreateAffiliatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateAffiliateByAdmin();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({
    page: 1,
    limit: 100,
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [createMode, setCreateMode] = useState<'userId' | 'newUser'>('userId');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneUser, setPhoneUser] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | 'admin' | 'support' | 'affiliate'>('affiliate');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'active' | 'pending' | 'blocked'>('active');
  const [commissionType, setCommissionType] = useState<'percentage' | 'fixed'>('percentage');
  const [commissionValue, setCommissionValue] = useState('5');
  const [cookieWindowDays, setCookieWindowDays] = useState('30');
  const [minPayoutAmount, setMinPayoutAmount] = useState('1000');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mpesa' | 'emola' | 'other' | ''>('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createMode === 'userId' && !userId.trim()) {
      toast({ title: 'Campo obrigatório', description: 'Selecione um usuário.', variant: 'destructive' });
      return;
    }
    if (createMode === 'newUser' && (!firstName || !lastName || !email || !phoneUser || !password)) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha os dados do novo usuário.', variant: 'destructive' });
      return;
    }

    const paymentDetails: Record<string, unknown> = {};
    if (paymentMethod === 'mpesa' || paymentMethod === 'emola') {
      if (phone) paymentDetails.phone = phone;
    } else if (paymentMethod === 'bank_transfer') {
      if (bankName) paymentDetails.bankName = bankName;
      if (accountNumber) paymentDetails.accountNumber = accountNumber;
      if (accountName) paymentDetails.accountName = accountName;
    }

    try {
      await createMutation.mutateAsync({
        ...(createMode === 'userId'
          ? { userId: userId.trim() }
          : {
              user: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phoneUser.trim(),
                password,
                role: userRole,
              },
            }),
        ...(code.trim() ? { code: code.trim().toUpperCase() } : {}),
        status,
        commissionType,
        commissionValue: Number(commissionValue),
        cookieWindowDays: Number(cookieWindowDays),
        minPayoutAmount: Number(minPayoutAmount),
        ...(paymentMethod ? { paymentMethod } : {}),
        ...(Object.keys(paymentDetails).length ? { paymentDetails } : {}),
      });

      toast({ title: 'Afiliado criado', description: 'Perfil de afiliado criado com sucesso.' });
      router.push('/admin/affiliates');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Falha ao criar afiliado.';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Afiliado</h1>
        <p className="text-gray-6">Crie manualmente um perfil de afiliado para um usuário existente.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Formulário de Criação</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label>Modo de criação</Label>
              <Select value={createMode} onValueChange={(v: any) => setCreateMode(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="userId">Usar userId existente</SelectItem>
                  <SelectItem value="newUser">Criar novo usuário + afiliado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createMode === 'userId' ? (
              <div>
                <Label>Usuário *</Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={usersLoading ? 'Carregando usuários...' : 'Selecionar usuário'} />
                  </SelectTrigger>
                  <SelectContent>
                    {(usersData?.users || []).map((user) => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.firstName} {user.lastName} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!usersLoading && (usersData?.users || []).length === 0 && (
                  <p className="text-sm text-gray-6 mt-2">Nenhum usuário ativo disponível.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phoneUser">Telefone *</Label>
                  <Input id="phoneUser" value={phoneUser} onChange={(e) => setPhoneUser(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <Label>Perfil</Label>
                  <Select value={userRole} onValueChange={(v: any) => setUserRole(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="code">Código (opcional)</Label>
                <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Tipo de Comissão</Label>
                <Select value={commissionType} onValueChange={(v: any) => setCommissionType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentual</SelectItem>
                    <SelectItem value="fixed">Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="commissionValue">Valor Comissão</Label>
                <Input id="commissionValue" type="number" value={commissionValue} onChange={(e) => setCommissionValue(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cookieWindowDays">Janela (dias)</Label>
                <Input id="cookieWindowDays" type="number" value={cookieWindowDays} onChange={(e) => setCookieWindowDays(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="minPayoutAmount">Mínimo para pagamento</Label>
              <Input id="minPayoutAmount" type="number" value={minPayoutAmount} onChange={(e) => setMinPayoutAmount(e.target.value)} />
            </div>

            <div>
              <Label>Método de pagamento</Label>
              <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
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
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="bankName">Banco</Label>
                  <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Nº Conta</Label>
                  <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="accountName">Nome Conta</Label>
                  <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Criando...' : 'Criar Afiliado'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/admin/affiliates')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

