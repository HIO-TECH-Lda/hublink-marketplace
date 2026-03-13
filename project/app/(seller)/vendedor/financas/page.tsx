'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinanceDashboard, useSyncSales } from '@/hooks/useSellerFinances';
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SellerSidebar from '../../components/SellerSidebar';
import { formatCurrency, getPeriodDates } from '@/lib/finance-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  const periodDates = getPeriodDates(period);
  const { data: dashboard, isLoading } = useFinanceDashboard({
    period,
    ...periodDates,
  });
  const syncSales = useSyncSales();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa ser um vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const summary = dashboard?.summary || {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    activeOrders: 0,
    pendingRevenue: 0,
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          / <span className="text-primary">Finanças</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Dashboard Financeiro</h1>
                <p className="text-gray-6 text-sm sm:text-base">Acompanhe suas receitas, despesas e lucros</p>
              </div>
              <div className="flex gap-2">
                <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-6 mb-1">Total de Receitas</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                        {isLoading ? '...' : formatCurrency(summary.totalIncome)}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-6 mb-1">Total de Despesas</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                        {isLoading ? '...' : formatCurrency(summary.totalExpenses)}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-6 mb-1">Lucro Líquido</p>
                      <p
                        className={`text-xl sm:text-2xl lg:text-3xl font-bold break-words ${
                          summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isLoading ? '...' : formatCurrency(summary.netProfit)}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-6 mb-1">Margem de Lucro</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                        {isLoading ? '...' : `${summary.profitMargin}%`}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href="/vendedor/financas/receitas/nova">
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hard">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Receita
                </Button>
              </Link>
              <Link href="/vendedor/financas/despesas/nova">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => syncSales.mutate(true)}
                disabled={syncSales.isPending}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncSales.isPending ? 'animate-spin' : ''}`} />
                {syncSales.isPending ? 'Sincronizando...' : 'Sincronizar Vendas'}
              </Button>
              <Link href="/vendedor/financas/transacoes">
                <Button variant="outline">Ver Todas as Transações</Button>
              </Link>
              <Link href="/vendedor/financas/relatorios">
                <Button variant="outline">Relatórios</Button>
              </Link>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-9 mb-4">Receitas vs Despesas</h3>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : dashboard?.charts.incomeVsExpenses && dashboard.charts.incomeVsExpenses.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-2">
                      {dashboard.charts.incomeVsExpenses.map((item, index) => {
                        const maxValue = Math.max(
                          ...dashboard.charts.incomeVsExpenses.map((i) => Math.max(i.income, i.expenses)),
                        );
                        const incomeHeight = (item.income / maxValue) * 100;
                        const expenseHeight = (item.expenses / maxValue) * 100;
                        return (
                          <div key={index} className="flex-1 flex items-end gap-1">
                            <div
                              className="flex-1 bg-green-500 rounded-t"
                              style={{ height: `${incomeHeight}%` }}
                              title={`Receitas: ${formatCurrency(item.income)}`}
                            />
                            <div
                              className="flex-1 bg-red-500 rounded-t"
                              style={{ height: `${expenseHeight}%` }}
                              title={`Despesas: ${formatCurrency(item.expenses)}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-5">
                      <p>Nenhum dado disponível para o período selecionado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-9 mb-4">Despesas por Categoria</h3>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : dashboard?.charts.expenseBreakdown && dashboard.charts.expenseBreakdown.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.charts.expenseBreakdown.map((item, index) => {
                        const total = dashboard.charts.expenseBreakdown.reduce((sum, i) => sum + i.amount, 0);
                        const percentage = total > 0 ? (item.amount / total) * 100 : 0;
                        return (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-7">{item.category}</span>
                              <span className="text-sm font-medium text-gray-9">{formatCurrency(item.amount)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-5">
                      <p>Nenhuma despesa registrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-9">Transações Recentes</h3>
                  <Link href="/vendedor/financas/transacoes">
                    <Button variant="ghost" size="sm">
                      Ver Todas
                    </Button>
                  </Link>
                </div>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard?.recentTransactions.income.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-9">{transaction.description}</p>
                            <p className="text-sm text-gray-6">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">+{formatCurrency(transaction.amount)}</p>
                      </div>
                    ))}
                    {dashboard?.recentTransactions.expenses.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-9">{transaction.description}</p>
                            <p className="text-sm text-gray-6">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-red-600">-{formatCurrency(transaction.amount)}</p>
                      </div>
                    ))}
                    {(!dashboard?.recentTransactions.income.length &&
                      !dashboard?.recentTransactions.expenses.length) && (
                      <div className="py-8 text-center text-gray-5">
                        <p>Nenhuma transação recente</p>
                      </div>
                    )}
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

