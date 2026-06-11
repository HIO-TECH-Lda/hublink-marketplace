'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MessageSquare, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMyTickets } from '@/hooks/useTickets';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import {
  getStatusColor,
  getStatusText,
  getPriorityText,
  getCategoryText,
  formatDate,
  TICKET_STATUS,
  TICKET_CATEGORY,
  TICKET_PRIORITY,
} from '@/lib/ticket-utils';
import Link from 'next/link';

export default function MyTicketsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data: ticketsData, isLoading } = useMyTickets({
    page: 1,
    limit: 50,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    search: searchTerm || undefined,
  });

  const tickets = ticketsData?.tickets || [];

  const filteredTickets = useMemo(() => {
    if (!searchTerm) return tickets;
    const searchLower = searchTerm.toLowerCase();
    return tickets.filter(
      (ticket) =>
        ticket.title?.toLowerCase().includes(searchLower) ||
        ticket.description?.toLowerCase().includes(searchLower),
    );
  }, [tickets, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          / <span className="text-primary">Os Meus Pedidos de Apoio</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Pedidos de Apoio</h1>
                <p className="text-gray-6 text-sm sm:text-base">Acompanhe aqui as suas solicitações de apoio, dúvidas, reclamações ou pedidos de esclarecimento enviados à equipa do Txova.</p>
              </div>
              <Button
                onClick={() => router.push('/suporte/novo-ticket')}
                className="bg-primary hover:bg-primary-hard text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido de Apoio
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Pesquisar pedidos de apoio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {showFilters && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Todos os Estados" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Estados</SelectItem>
                          <SelectItem value={TICKET_STATUS.OPEN}>Aberto</SelectItem>
                          <SelectItem value={TICKET_STATUS.IN_PROGRESS}>Em Análise</SelectItem>
                          <SelectItem value={TICKET_STATUS.WAITING_FOR_USER}>A aguardar resposta</SelectItem>
                          <SelectItem value={TICKET_STATUS.WAITING_FOR_THIRD_PARTY}>Aguardando Terceiros</SelectItem>
                          <SelectItem value={TICKET_STATUS.RESOLVED}>Resolvido</SelectItem>
                          <SelectItem value={TICKET_STATUS.CLOSED}>Fechado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Todas as Categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Categorias</SelectItem>
                          {Object.values(TICKET_CATEGORY).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {getCategoryText(cat)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Todas as Prioridades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Prioridades</SelectItem>
                          {Object.values(TICKET_PRIORITY).map((pri) => (
                            <SelectItem key={pri} value={pri}>
                              {getPriorityText(pri)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
              <div className="flex flex-wrap gap-2">
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-sm">
                    Estado: {getStatusText(statusFilter)}
                    <button onClick={() => setStatusFilter('all')} className="ml-2 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="text-sm">
                    Categoria: {getCategoryText(categoryFilter)}
                    <button onClick={() => setCategoryFilter('all')} className="ml-2 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {priorityFilter !== 'all' && (
                  <Badge variant="secondary" className="text-sm">
                    Prioridade: {getPriorityText(priorityFilter)}
                    <button onClick={() => setPriorityFilter('all')} className="ml-2 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                <p className="text-gray-6">A carregar pedidos de apoio...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum pedido de apoio encontrado</h3>
                  <p className="text-gray-6 mb-6 text-sm sm:text-base">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Tente ajustar os filtros ou criar um novo pedido de apoio.'
                      : 'Ainda não criou nenhum pedido de apoio. Sempre que precisar de ajuda com compras, pagamentos, entregas, vendedores, produtos ou serviços, poderá criar um pedido de apoio e acompanhar a resposta nesta área.'}
                  </p>
                  <Button
                    onClick={() => router.push('/suporte/novo-ticket')}
                    className="bg-primary hover:bg-primary-hard text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Pedido de Apoio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-5 uppercase tracking-wide mb-1">
                              Pedido de Apoio
                            </p>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-9 mb-2 truncate">
                              {ticket.title}
                            </h3>
                            <p className="text-gray-6 text-sm mb-1">
                              <span className="font-medium text-gray-7">Descrição:</span>{' '}
                              <span className="line-clamp-2">{ticket.description}</span>
                            </p>
                            <p className="text-xs text-gray-5">Referência: #{ticket._id.slice(-8)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-6">
                          <p>
                            <span className="font-medium text-gray-7">Estado:</span>{' '}
                            <Badge className={`${getStatusColor(ticket.status)} text-xs ml-1`}>
                              {getStatusText(ticket.status)}
                            </Badge>
                          </p>
                          <p>
                            <span className="font-medium text-gray-7">Prioridade:</span>{' '}
                            {getPriorityText(ticket.priority)}
                          </p>
                          <p>
                            <span className="font-medium text-gray-7">Categoria:</span>{' '}
                            {getCategoryText(ticket.category)}
                          </p>
                          <p>
                            <span className="font-medium text-gray-7">Criado em:</span>{' '}
                            {formatDate(ticket.createdAt)}
                          </p>
                          <p>
                            <span className="font-medium text-gray-7">Mensagens:</span>{' '}
                            {ticket.messages?.length || 0}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => router.push(`/suporte/ticket/${ticket._id}`)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            className="bg-primary hover:bg-primary-hard text-white"
                            onClick={() => router.push(`/suporte/ticket/${ticket._id}`)}
                          >
                            Responder
                          </Button>
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
