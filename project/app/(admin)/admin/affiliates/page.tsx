'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminAffiliates, useUpdateAffiliateStatus } from '@/hooks/useAdminAffiliates';
import { useToast } from '@/hooks/use-toast';

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 25;

  const { data, isLoading } = useAdminAffiliates({
    page,
    limit,
    status: status === 'all' ? undefined : status,
    search: search || undefined,
  });
  const updateStatus = useUpdateAffiliateStatus();

  const affiliates = data?.affiliates ?? [];
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.pages ?? 1);

  const getAffiliateStatusClasses = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      blocked: 'bg-red-100 text-red-800 border-red-300',
    };
    return map[s] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleStatusUpdate = async (affiliateId: string, nextStatus: 'pending' | 'active' | 'blocked') => {
    try {
      await updateStatus.mutateAsync({ affiliateId, status: nextStatus });
      toast({ title: 'Status atualizado', description: 'Status do afiliado atualizado com sucesso.' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao atualizar status do afiliado.', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Afiliados</h1>
            <p className="text-gray-6">Gerencie status e acompanhe os afiliados cadastrados.</p>
          </div>
          <Button onClick={() => router.push('/admin/affiliates/create')}>
            Criar afiliado
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Buscar por código de afiliado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lista de Afiliados</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-gray-6">Carregando afiliados...</div>
          ) : affiliates.length === 0 ? (
            <div className="py-10 text-center text-gray-6">Nenhum afiliado encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm text-gray-6">Usuário</th>
                    <th className="text-left py-2 text-sm text-gray-6">Código</th>
                    <th className="text-left py-2 text-sm text-gray-6">Comissão</th>
                    <th className="text-left py-2 text-sm text-gray-6">Pagamento</th>
                    <th className="text-left py-2 text-sm text-gray-6">Janela (dias)</th>
                    <th className="text-left py-2 text-sm text-gray-6">Status</th>
                    <th className="text-right py-2 text-sm text-gray-6">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((affiliate) => {
                    const user = typeof affiliate.userId === 'object' && affiliate.userId !== null ? affiliate.userId : null;
                    const userName =
                      user?.fullName ||
                      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
                      '—';
                    const userEmail = user?.email || '—';

                    return (
                    <tr key={affiliate._id} className="border-b border-gray-100">
                      <td className="py-2 text-sm">
                        <div>
                          <p className="font-medium text-gray-9">{userName}</p>
                          <p className="text-xs text-gray-5">{userEmail}</p>
                        </div>
                      </td>
                      <td className="py-2 text-sm font-medium">{affiliate.code}</td>
                      <td className="py-2 text-sm">
                        {affiliate.commissionType === 'percentage'
                          ? `${affiliate.commissionValue}%`
                          : `${affiliate.commissionValue}`}
                      </td>
                      <td className="py-2 text-sm">
                        <div className="capitalize">{affiliate.paymentMethod || '—'}</div>
                        <div className="text-xs text-gray-5">
                          {affiliate.paymentDetails?.phone
                            ? String(affiliate.paymentDetails.phone)
                            : affiliate.paymentDetails?.accountNumber
                              ? String(affiliate.paymentDetails.accountNumber)
                              : '—'}
                        </div>
                      </td>
                      <td className="py-2 text-sm">{affiliate.cookieWindowDays}</td>
                      <td className="py-2 text-sm">
                        <Badge className={`${getAffiliateStatusClasses(affiliate.status)} border text-xs capitalize`}>
                          {affiliate.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(affiliate._id, 'active')}>Ativar</Button>
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(affiliate._id, 'blocked')}>Bloquear</Button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-6">
                Página <span className="font-medium text-gray-9">{pagination?.page ?? page}</span> de{' '}
                <span className="font-medium text-gray-9">{totalPages}</span> •{' '}
                <span className="font-medium text-gray-9">{pagination?.total ?? 0}</span> registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={(pagination?.page ?? page) <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={(pagination?.page ?? page) >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

