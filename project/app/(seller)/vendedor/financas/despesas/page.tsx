'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinanceTransactions } from '@/hooks/useSellerFinances';
import { Plus, ArrowDownRight, Search, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SellerSidebar from '../../../components/SellerSidebar';
import { formatCurrency, EXPENSE_CATEGORIES, getCategoryName, getCategoryIcon } from '@/lib/finance-utils';
import Link from 'next/link';

export default function ExpensesPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: transactionsData, isLoading } = useFinanceTransactions({
    type: 'expense',
    page: 1,
    limit: 50,
    search: searchTerm || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const transactions = transactionsData?.transactions || [];

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

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          /{' '}
          <Link href="/vendedor/financas" className="hover:text-primary">
            Finanças
          </Link>{' '}
          / <span className="text-primary">Despesas</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Despesas</h1>
                <p className="text-gray-6 text-sm sm:text-base">Gira e acompanhe as despesas e custos associados à sua banca no Txova, incluindo entregas, embalagens, transporte, reposição de produtos, comunicação, marketing e outras despesas operacionais.</p>
              </div>
              <Link href="/vendedor/financas/despesas/nova">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Pesquisar despesas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Data inicial"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Data final"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6 mb-1">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {isLoading ? '...' : formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-6 mb-1">Total de Transacções</p>
                    <p className="text-2xl font-bold text-gray-9">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-6">Carregando despesas...</p>
              </div>
            ) : transactions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ArrowDownRight className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhuma despesa encontrada</h3>
                  <p className="text-gray-6 mb-6">Comece adicionando sua primeira despesa.</p>
                  <Link href="/vendedor/financas/despesas/nova">
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Despesa
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">
                            {transaction.category ? getCategoryIcon(transaction.category) : '📝'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-9 truncate">{transaction.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-6">
                              <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                              {transaction.category && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                  {getCategoryName(transaction.category)}
                                </span>
                              )}
                              {transaction.vendor && (
                                <span className="text-gray-5">• {transaction.vendor}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

