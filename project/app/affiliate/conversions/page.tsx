'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMyAffiliateConversions } from '@/hooks/useAffiliate';
import { formatCurrency } from '@/lib/payment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AffiliateConversionsPage() {
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 25;

  const { data, isLoading } = useMyAffiliateConversions({
    page,
    limit,
    status: status === 'all' ? undefined : status,
  });

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

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / <span className="text-primary">Conversões de Afiliado</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Conversões</CardTitle>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center text-gray-6">Carregando conversões...</div>
                ) : conversions.length === 0 ? (
                  <div className="py-10 text-center text-gray-6">Sem conversões para os filtros atuais.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm text-gray-6">Data</th>
                          <th className="text-left py-2 text-sm text-gray-6">Pedido</th>
                          <th className="text-left py-2 text-sm text-gray-6">Valor Pedido</th>
                          <th className="text-left py-2 text-sm text-gray-6">Comissão</th>
                          <th className="text-left py-2 text-sm text-gray-6">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversions.map((conversion) => (
                          <tr key={conversion._id} className="border-b border-gray-100">
                            <td className="py-2 text-sm">{new Date(conversion.createdAt || '').toLocaleDateString('pt-MZ')}</td>
                            <td className="py-2 text-sm">{conversion.orderNumber || '—'}</td>
                            <td className="py-2 text-sm">{formatCurrency(conversion.orderTotal || conversion.orderSubtotal || 0)}</td>
                            <td className="py-2 text-sm">{formatCurrency(conversion.commissionAmount || 0)}</td>
                            <td className="py-2 text-sm">
                              <Badge className={`${getStatusBadgeClasses(conversion.status)} border text-xs capitalize`}>
                                {conversion.status}
                              </Badge>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

