'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMyAffiliateDashboard } from '@/hooks/useAffiliate';
import { formatCurrency } from '@/lib/payment';

export default function AffiliateDashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data, isLoading, isError } = useMyAffiliateDashboard();

  const affiliateData = data;
  const summary = affiliateData?.summary;
  const recentConversions = affiliateData?.recentConversions ?? [];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / <span className="text-primary">Afiliados</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-9">Dashboard de Afiliado</h1>
              <p className="text-gray-6 mt-1">Acompanhe cliques, conversões e comissões.</p>
            </div>

            {authLoading || isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-6">Carregando dados do afiliado...</p>
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-7 mb-4">Você precisa iniciar sessão para aceder a esta área.</p>
                <Link href="/entrar">
                  <Button>Entrar</Button>
                </Link>
              </div>
            ) : isError ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-7 mb-4">Não foi possível carregar o dashboard agora.</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
              </div>
            ) : !affiliateData ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-lg font-semibold text-gray-9 mb-2">Você ainda não é afiliado</h2>
                <p className="text-gray-6 mb-4">Assim que seu perfil de afiliado estiver ativo, os dados aparecerão aqui.</p>
                <Link href="/affiliate/apply">
                  <Button variant="outline">Candidatar-se agora</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card><CardHeader><CardTitle className="text-sm">Cliques</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{summary?.clicks ?? 0}</p></CardContent></Card>
                  <Card><CardHeader><CardTitle className="text-sm">Conversões</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{summary?.conversions ?? 0}</p></CardContent></Card>
                  <Card><CardHeader><CardTitle className="text-sm">Comissão Pendente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(summary?.pendingCommission ?? 0)}</p></CardContent></Card>
                  <Card><CardHeader><CardTitle className="text-sm">Comissão Paga</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(summary?.paidCommission ?? 0)}</p></CardContent></Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversões Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentConversions.length === 0 ? (
                      <p className="text-gray-6">Ainda não há conversões registadas.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 text-sm text-gray-6">Data</th>
                              <th className="text-left py-2 text-sm text-gray-6">Pedido</th>
                              <th className="text-left py-2 text-sm text-gray-6">Comissão</th>
                              <th className="text-left py-2 text-sm text-gray-6">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentConversions.slice(0, 8).map((conversion) => (
                              <tr key={conversion._id} className="border-b border-gray-100">
                                <td className="py-2 text-sm">{new Date(conversion.createdAt || '').toLocaleDateString('pt-MZ')}</td>
                                <td className="py-2 text-sm">{conversion.orderNumber || '—'}</td>
                                <td className="py-2 text-sm">{formatCurrency(conversion.commissionAmount || 0)}</td>
                                <td className="py-2 text-sm capitalize">{conversion.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

