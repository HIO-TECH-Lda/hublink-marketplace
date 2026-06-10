'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinanceReport } from '@/hooks/useSellerFinances';
import { FileText, Download, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SellerSidebar from '../../../components/SellerSidebar';
import { formatCurrency, calculateProfitMargin } from '@/lib/finance-utils';
import Link from 'next/link';

export default function ReportsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getReportParams = () => {
    const params: any = { type: reportType };
    switch (reportType) {
      case 'daily':
        params.date = date;
        break;
      case 'weekly':
        params.week = date;
        break;
      case 'monthly':
        params.month = month;
        break;
      case 'yearly':
        params.year = year;
        break;
      case 'custom':
        params.startDate = startDate;
        params.endDate = endDate;
        break;
    }
    return params;
  };

  const { data: report, isLoading } = useFinanceReport(getReportParams());

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
          / <span className="text-primary">Relatórios</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Relatórios Financeiros</h1>
              <p className="text-gray-6 text-sm sm:text-base">Gere relatórios detalhados sobre as receitas, despesas, transacções e desempenho financeiro da sua banca no Txova.</p>
            </div>

            {/* Report Type Selector */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
                    <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {reportType === 'daily' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  )}

                  {reportType === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data (qualquer dia da semana)
                      </label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  )}

                  {reportType === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                      <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                    </div>
                  )}

                  {reportType === 'yearly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                      <Input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="2020"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  )}

                  {reportType === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Display */}
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-6">Gerando relatório...</p>
              </div>
            ) : report ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Resumo</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar em PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                      <div>
                        <p className="text-sm text-gray-6 mb-1">Total Receitas</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(report.summary.totalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-6 mb-1">Total Despesas</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(report.summary.totalExpenses)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-6 mb-1">Lucro Líquido</p>
                        <p
                          className={`text-2xl font-bold ${
                            report.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(report.summary.netProfit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-6 mb-1">Margem de Lucro</p>
                        <p className="text-2xl font-bold text-gray-9">{report.summary.profitMargin}%</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-6">
                        Período: {new Date(report.period.startDate).toLocaleDateString('pt-BR')} até{' '}
                        {new Date(report.period.endDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-6">
                        Total de Transacções: {report.summary.transactionCount}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição das Receitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-7">Marketplace</span>
                        <span className="font-semibold text-gray-9">
                          {formatCurrency(report.incomeBreakdown.marketplace)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-7">Vendas Manuais</span>
                        <span className="font-semibold text-gray-9">
                          {formatCurrency(report.incomeBreakdown.manual)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-7">Outros</span>
                        <span className="font-semibold text-gray-9">{formatCurrency(report.incomeBreakdown.other)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Breakdown */}
                {report.expenseBreakdown.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Breakdown de Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.expenseBreakdown.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-7">{item.category}</span>
                              <div className="text-right">
                                <span className="font-semibold text-gray-9">{formatCurrency(item.amount)}</span>
                                <span className="text-sm text-gray-5 ml-2">({item.percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-5">Selecione um período para gerar o relatório</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

