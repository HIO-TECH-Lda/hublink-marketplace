'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinanceTransactions } from '@/hooks/useSellerFinances';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SellerSidebar from '../../../components/SellerSidebar';
import { formatCurrency, getCategoryName, getCategoryIcon, getPaymentMethodLabel } from '@/lib/finance-utils';
import Link from 'next/link';

export default function TransactionsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: transactionsData, isLoading } = useFinanceTransactions({
    page: 1,
    limit: 100,
    type: typeFilter !== 'all' ? (typeFilter as 'income' | 'expense') : undefined,
    search: searchTerm || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy: 'date',
    sortOrder: 'desc',
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

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

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
          / <span className="text-primary">Transações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Todas as Transações</h1>
              <p className="text-gray-6 text-sm sm:text-base">Visualize todas as suas receitas e despesas</p>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="income">Receitas</SelectItem>
                      <SelectItem value="expense">Despesas</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-6 mb-1">Total Receitas</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-6 mb-1">Total Despesas</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-6 mb-1">Lucro Líquido</p>
                  <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions List */}
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-6">Carregando transações...</p>
              </div>
            ) : transactions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-5">Nenhuma transação encontrada</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card
                    key={transaction._id}
                    className={`hover:shadow-md transition-shadow ${
                      transaction.type === 'income' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                            }`}
                          >
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-6 h-6 text-green-600" />
                            ) : (
                              <span className="text-xl">
                                {transaction.category ? getCategoryIcon(transaction.category) : '📝'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-9 truncate">{transaction.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-6 flex-wrap">
                              <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                              {transaction.type === 'expense' && transaction.category && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                  {getCategoryName(transaction.category)}
                                </span>
                              )}
                              {transaction.source === 'marketplace' && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  Marketplace
                                </span>
                              )}
                              {transaction.customerName && (
                                <span className="text-gray-5">• {transaction.customerName}</span>
                              )}
                              {transaction.vendor && <span className="text-gray-5">• {transaction.vendor}</span>}
                              <span className="text-gray-5">• {getPaymentMethodLabel(transaction.paymentMethod)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
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

