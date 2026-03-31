'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  useAdminAffiliateConversions,
  useApproveAffiliateConversion,
  useRejectAffiliateConversion,
} from '@/hooks/useAdminAffiliates';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/payment';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminAffiliateConversionsPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState<string>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [page, setPage] = useState(1);
  const limit = 30;
  const [selectedConversion, setSelectedConversion] = useState<any | null>(null);

  const { data, isLoading } = useAdminAffiliateConversions({
    page,
    limit,
    status: status === 'all' ? undefined : status,
  });
  const approveMutation = useApproveAffiliateConversion();
  const rejectMutation = useRejectAffiliateConversion();

  const conversions = data?.conversions ?? [];
  const pagination = data?.pagination;
  const totalPages = useMemo(() => Math.max(1, pagination?.pages ?? 1), [pagination?.pages]);

  const getStatusBadgeClasses = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-blue-100 text-blue-800 border-blue-300',
      paid: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return map[s] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleApprove = async (conversionId: string) => {
    try {
      await approveMutation.mutateAsync(conversionId);
      toast({ title: 'Conversão aprovada', description: 'A conversão foi aprovada com sucesso.' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao aprovar conversão.', variant: 'destructive' });
    }
  };

  const handleReject = async (conversionId: string) => {
    if (!rejectReason.trim()) {
      toast({ title: 'Motivo obrigatório', description: 'Informe um motivo antes de rejeitar.', variant: 'destructive' });
      return;
    }

    try {
      await rejectMutation.mutateAsync({ conversionId, reason: rejectReason.trim() });
      toast({ title: 'Conversão rejeitada', description: 'A conversão foi rejeitada com sucesso.' });
      setRejectReason('');
    } catch {
      toast({ title: 'Erro', description: 'Falha ao rejeitar conversão.', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Conversões de Afiliados</h1>
        <p className="text-gray-6">Revise, aprove e rejeite conversões com base em atribuição.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
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
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Motivo para rejeição (obrigatório ao rejeitar)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lista de Conversões</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-gray-6">Carregando conversões...</div>
          ) : conversions.length === 0 ? (
            <div className="py-10 text-center text-gray-6">Nenhuma conversão encontrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm text-gray-6">Data</th>
                    <th className="text-left py-2 text-sm text-gray-6">Pedido</th>
                    <th className="text-left py-2 text-sm text-gray-6">Comissão</th>
                    <th className="text-left py-2 text-sm text-gray-6">Status</th>
                    <th className="text-right py-2 text-sm text-gray-6">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((conversion) => (
                    <tr key={conversion._id} className="border-b border-gray-100">
                      <td className="py-2 text-sm">{new Date(conversion.createdAt || '').toLocaleDateString('pt-MZ')}</td>
                      <td className="py-2 text-sm">{conversion.orderNumber || '—'}</td>
                      <td className="py-2 text-sm">{formatCurrency(conversion.commissionAmount || 0)}</td>
                      <td className="py-2 text-sm">
                        <Badge className={`${getStatusBadgeClasses(conversion.status)} border text-xs capitalize`}>
                          {conversion.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedConversion(conversion)}>Ver</Button>
                          <Button size="sm" variant="outline" onClick={() => handleApprove(conversion._id)}>Aprovar</Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(conversion._id)}>Rejeitar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-6">
                Página <span className="font-medium text-gray-9">{pagination?.page ?? page}</span> de{' '}
                <span className="font-medium text-gray-9">{totalPages}</span>
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

      <Dialog open={!!selectedConversion} onOpenChange={(open) => !open && setSelectedConversion(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedConversion && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Conversão</DialogTitle>
                <DialogDescription>
                  Informações de atribuição e campos brutos retornados pela API.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border rounded-md p-3">
                    <p className="text-xs text-gray-6 mb-1">Pedido</p>
                    <p className="font-medium text-gray-9">{selectedConversion.orderNumber || '—'}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs text-gray-6 mb-1">Comissão</p>
                    <p className="font-medium text-gray-9">{formatCurrency(selectedConversion.commissionAmount || 0)}</p>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <p className="text-xs text-gray-6 mb-2">Payload</p>
                  <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 overflow-x-auto whitespace-pre-wrap text-[11px] text-gray-800">
                    {JSON.stringify(selectedConversion, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

