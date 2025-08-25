'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Users, Clock, CheckCircle, AlertCircle, X, MessageSquare, Eye } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace, TicketCategory, TicketPriority, TicketStatus } from '@/contexts/MarketplaceContext';

export default function AdminTicketsPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter tickets
  const filteredTickets = state.tickets.filter(ticket => {
    // Search filter
    if (searchTerm && !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

    // Agent filter
    if (agentFilter !== 'all') {
      if (agentFilter === 'unassigned' && ticket.assignedTo !== null && ticket.assignedTo !== '') return false;
      if (agentFilter !== 'unassigned' && ticket.assignedTo !== agentFilter) return false;
    }

    return true;
  });

  // Get statistics
  const stats = {
    total: state.tickets.length,
    open: state.tickets.filter(t => t.status === TicketStatus.OPEN).length,
    inProgress: state.tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
    waiting: state.tickets.filter(t => t.status === TicketStatus.WAITING_FOR_USER || t.status === TicketStatus.WAITING_FOR_THIRD_PARTY).length,
    resolved: state.tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
    closed: state.tickets.filter(t => t.status === TicketStatus.CLOSED).length,
    urgent: state.tickets.filter(t => t.priority === TicketPriority.URGENT).length,
    high: state.tickets.filter(t => t.priority === TicketPriority.HIGH).length
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-500" />;
      case TicketStatus.WAITING_FOR_USER:
        return <MessageSquare className="w-4 h-4 text-yellow-500" />;
      case TicketStatus.WAITING_FOR_THIRD_PARTY:
        return <Clock className="w-4 h-4 text-purple-500" />;
      case TicketStatus.RESOLVED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case TicketStatus.CLOSED:
        return <X className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-orange-100 text-orange-800';
      case TicketStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.WAITING_FOR_USER:
        return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.WAITING_FOR_THIRD_PARTY:
        return 'bg-purple-100 text-purple-800';
      case TicketStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case TicketStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'Aberto';
      case TicketStatus.IN_PROGRESS:
        return 'Em Progresso';
      case TicketStatus.WAITING_FOR_USER:
        return 'Aguardando Resposta';
      case TicketStatus.WAITING_FOR_THIRD_PARTY:
        return 'Aguardando Terceiros';
      case TicketStatus.RESOLVED:
        return 'Resolvido';
      case TicketStatus.CLOSED:
        return 'Fechado';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return 'bg-gray-100 text-gray-800';
      case TicketPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800';
      case TicketPriority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case TicketPriority.URGENT:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return 'Baixa';
      case TicketPriority.MEDIUM:
        return 'Média';
      case TicketPriority.HIGH:
        return 'Alta';
      case TicketPriority.URGENT:
        return 'Urgente';
      default:
        return priority;
    }
  };

  const getCategoryIcon = (category: TicketCategory) => {
    const icons: Record<TicketCategory, string> = {
      [TicketCategory.TECHNICAL_ISSUE]: '🔧',
      [TicketCategory.PAYMENT_PROBLEM]: '💳',
      [TicketCategory.ORDER_ISSUE]: '📦',
      [TicketCategory.RETURN_REQUEST]: '🔄',
      [TicketCategory.ACCOUNT_ISSUE]: '👤',
      [TicketCategory.PRODUCT_ISSUE]: '🛍️',
      [TicketCategory.SHIPPING_PROBLEM]: '🚚',
      [TicketCategory.GENERAL_INQUIRY]: '❓',
      [TicketCategory.FEATURE_REQUEST]: '💡',
      [TicketCategory.BUG_REPORT]: '🐛'
    };
    return icons[category] || '📋';
  };

  const getCategoryText = (category: TicketCategory) => {
    const labels: Record<TicketCategory, string> = {
      [TicketCategory.TECHNICAL_ISSUE]: 'Problema Técnico',
      [TicketCategory.PAYMENT_PROBLEM]: 'Problema com Pagamento',
      [TicketCategory.ORDER_ISSUE]: 'Problema com Pedido',
      [TicketCategory.RETURN_REQUEST]: 'Solicitação de Devolução',
      [TicketCategory.ACCOUNT_ISSUE]: 'Problema com Conta',
      [TicketCategory.PRODUCT_ISSUE]: 'Problema com Produto',
      [TicketCategory.SHIPPING_PROBLEM]: 'Problema com Envio',
      [TicketCategory.GENERAL_INQUIRY]: 'Consulta Geral',
      [TicketCategory.FEATURE_REQUEST]: 'Solicitação de Funcionalidade',
      [TicketCategory.BUG_REPORT]: 'Reportar Bug'
    };
    return labels[category] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: string) => {
    const user = state.user?.id === userId ? state.user : 
                state.orders.find(o => o.userId === userId)?.user;
    return user ? `${user.firstName} ${user.lastName}` : 'Usuário';
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-9 mb-2">Gestão de Tickets</h1>
              <p className="text-gray-6">Gerencie todas as solicitações de suporte da plataforma</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-9">{stats.total}</p>
                </div>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6">Em Aberto</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{stats.open}</p>
                </div>
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6">Em Progresso</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6">Urgentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.urgent}</p>
                </div>
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filter Toggle Button */}
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="h-12 px-4"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            <span className="sm:hidden">Filtros</span>
          </Button>
        </div>

        {/* Filters - Collapsible */}
        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Todos os Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value={TicketStatus.OPEN}>Aberto</SelectItem>
                      <SelectItem value={TicketStatus.IN_PROGRESS}>Em Progresso</SelectItem>
                      <SelectItem value={TicketStatus.WAITING_FOR_USER}>Aguardando Resposta</SelectItem>
                      <SelectItem value={TicketStatus.WAITING_FOR_THIRD_PARTY}>Aguardando Terceiros</SelectItem>
                      <SelectItem value={TicketStatus.RESOLVED}>Resolvido</SelectItem>
                      <SelectItem value={TicketStatus.CLOSED}>Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as TicketCategory | 'all')}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Todas as Categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      <SelectItem value={TicketCategory.TECHNICAL_ISSUE}>Problema Técnico</SelectItem>
                      <SelectItem value={TicketCategory.PAYMENT_PROBLEM}>Problema com Pagamento</SelectItem>
                      <SelectItem value={TicketCategory.ORDER_ISSUE}>Problema com Pedido</SelectItem>
                      <SelectItem value={TicketCategory.RETURN_REQUEST}>Solicitação de Devolução</SelectItem>
                      <SelectItem value={TicketCategory.ACCOUNT_ISSUE}>Problema com Conta</SelectItem>
                      <SelectItem value={TicketCategory.PRODUCT_ISSUE}>Problema com Produto</SelectItem>
                      <SelectItem value={TicketCategory.SHIPPING_PROBLEM}>Problema com Envio</SelectItem>
                      <SelectItem value={TicketCategory.GENERAL_INQUIRY}>Consulta Geral</SelectItem>
                      <SelectItem value={TicketCategory.FEATURE_REQUEST}>Solicitação de Funcionalidade</SelectItem>
                      <SelectItem value={TicketCategory.BUG_REPORT}>Reportar Bug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Todas as Prioridades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Prioridades</SelectItem>
                      <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                      <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                      <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
                      <SelectItem value={TicketPriority.URGENT}>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Agent Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agente</label>
                  <Select value={agentFilter} onValueChange={setAgentFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Todos os Agentes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Agentes</SelectItem>
                      <SelectItem value="unassigned">Não Atribuído</SelectItem>
                      {state.agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters Summary */}
        {(statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || agentFilter !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="text-sm">
                Status: {getStatusText(statusFilter)}
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="text-sm">
                Categoria: {getCategoryText(categoryFilter)}
                <button 
                  onClick={() => setCategoryFilter('all')}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {priorityFilter !== 'all' && (
              <Badge variant="secondary" className="text-sm">
                Prioridade: {getPriorityText(priorityFilter)}
                <button 
                  onClick={() => setPriorityFilter('all')}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {agentFilter !== 'all' && (
              <Badge variant="secondary" className="text-sm">
                Agente: {agentFilter === 'unassigned' ? 'Não Atribuído' : state.agents.find(a => a.id === agentFilter)?.name}
                <button 
                  onClick={() => setAgentFilter('all')}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Tickets ({filteredTickets.length})</CardTitle>
            <CardDescription className="text-sm">
              Lista de todos os tickets de suporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum ticket encontrado</h3>
                <p className="text-gray-6 text-sm">Tente ajustar os filtros para ver mais resultados.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(ticket.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-9 truncate">
                                {ticket.title}
                              </h3>
                              <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                                {getPriorityText(ticket.priority)}
                              </Badge>
                            </div>
                            <p className="text-gray-6 text-sm mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-5">#{ticket.id}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                            className="h-8 px-2 sm:h-9 sm:px-3"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Ver</span>
                            <span className="sm:hidden">Ver</span>
                          </Button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                          {getStatusText(ticket.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">{getCategoryIcon(ticket.category)}</span>
                          <span className="hidden sm:inline">{getCategoryText(ticket.category)}</span>
                          <span className="sm:hidden">{getCategoryText(ticket.category).split(' ')[0]}</span>
                        </Badge>
                        {ticket.orderId && (
                          <Badge variant="outline" className="text-xs">
                            <span className="hidden sm:inline">Pedido: {ticket.orderId}</span>
                            <span className="sm:hidden">P: {ticket.orderId}</span>
                          </Badge>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-5">
                        <span>Criado por {getUserName(ticket.userId)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{ticket.messages.length} mensagens</span>
                        {ticket.assignedTo && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">
                              Atribuído a {state.agents.find(a => a.id === ticket.assignedTo)?.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
