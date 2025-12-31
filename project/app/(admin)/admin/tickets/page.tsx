'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  MessageSquare, 
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  useAdminTicketStats,
  useAdminTickets,
  useUpdateTicketStatus,
  useDeleteTicket,
  Ticket,
  TicketCategory,
  TicketStatus
} from '@/hooks/useAdmin';
import { useAdminUsers } from '@/hooks/useAdmin';

export default function AdminTicketsPage() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats, isLoading: statsLoading } = useAdminTicketStats();
  const { data: ticketsData, isLoading: ticketsLoading } = useAdminTickets({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
    assignedTo: assignedToFilter === 'all' ? undefined : assignedToFilter,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const { data: usersData } = useAdminUsers({ limit: 100, role: 'all' });

  const updateStatus = useUpdateTicketStatus();
  const deleteTicket = useDeleteTicket();

  const tickets = ticketsData?.tickets || [];
  const isLoading = statsLoading || ticketsLoading;
  const users = usersData?.users || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-orange-600 bg-orange-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'waiting_for_user': return 'text-yellow-600 bg-yellow-100';
      case 'waiting_for_third_party': return 'text-purple-600 bg-purple-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'waiting_for_user': return 'Aguardando Resposta';
      case 'waiting_for_third_party': return 'Aguardando Terceiros';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  const getCategoryText = (category: string) => {
    const labels: Record<string, string> = {
      'technical_issue': 'Problema Técnico',
      'payment_problem': 'Problema com Pagamento',
      'order_issue': 'Problema com Pedido',
      'return_request': 'Solicitação de Devolução',
      'account_issue': 'Problema com Conta',
      'product_issue': 'Problema com Produto',
      'shipping_problem': 'Problema com Envio',
      'general_inquiry': 'Consulta Geral',
      'feature_request': 'Solicitação de Funcionalidade',
      'bug_report': 'Reportar Bug'
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

  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    updateStatus.mutate({ ticketId, status });
  };

  const handleDeleteTicket = (ticketId: string, ticketNumber: string) => {
    if (confirm(`Tem certeza que deseja excluir o ticket "${ticketNumber}"?`)) {
      deleteTicket.mutate(ticketId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = ticketsData?.pagination.totalPages || 1;

  if (isLoading && !ticketsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando tickets...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gestão de Tickets</h1>
            <p className="text-gray-6">Gerencie todas as solicitações de suporte da plataforma</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-9">{stats.total.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-5 h-5 text-gray-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Abertos</p>
                  <p className="text-xl font-bold text-orange-600">{stats.open.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Em Progresso</p>
                  <p className="text-xl font-bold text-blue-600">{stats.inProgress.toLocaleString()}</p>
                </div>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Urgentes</p>
                  <p className="text-xl font-bold text-red-600">{stats.urgent.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Alta</p>
                  <p className="text-xl font-bold text-orange-600">{stats.high.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por título, descrição ou número do ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="waiting_for_user">Aguardando Resposta</SelectItem>
                <SelectItem value="waiting_for_third_party">Aguardando Terceiros</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="technical_issue">Problema Técnico</SelectItem>
                <SelectItem value="payment_problem">Problema com Pagamento</SelectItem>
                <SelectItem value="order_issue">Problema com Pedido</SelectItem>
                <SelectItem value="return_request">Solicitação de Devolução</SelectItem>
                <SelectItem value="account_issue">Problema com Conta</SelectItem>
                <SelectItem value="product_issue">Problema com Produto</SelectItem>
                <SelectItem value="shipping_problem">Problema com Envio</SelectItem>
                <SelectItem value="general_inquiry">Consulta Geral</SelectItem>
                <SelectItem value="feature_request">Solicitação de Funcionalidade</SelectItem>
                <SelectItem value="bug_report">Reportar Bug</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || assignedToFilter !== 'all') && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                  setAssignedToFilter('all');
                  setPage(1);
                }}
              >
                Limpar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Tickets ({ticketsData?.pagination.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Ticket</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Criado por</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Prioridade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Atribuído a</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Mensagens</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Criado em</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-9">{ticket.ticketNumber}</p>
                        <p className="text-sm text-gray-6 line-clamp-1">{ticket.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-7">{ticket.createdBy.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryText(ticket.category)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {ticket.assignedTo ? (
                        <p className="text-sm text-gray-7">{ticket.assignedTo.name}</p>
                      ) : (
                        <span className="text-sm text-gray-5">Não atribuído</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-6">
                        <MessageSquare className="w-4 h-4" />
                        {ticket.messageCount || 0}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-6">{formatDate(ticket.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {ticket.status !== 'in_progress' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                                disabled={updateStatus.isPending}
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Marcar como Em Progresso
                              </DropdownMenuItem>
                            )}
                            {ticket.status !== 'resolved' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                                disabled={updateStatus.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar como Resolvido
                              </DropdownMenuItem>
                            )}
                            {ticket.status !== 'closed' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                                disabled={updateStatus.isPending}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Fechar Ticket
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTicket(ticket.id, ticket.ticketNumber)}
                              className="text-red-600"
                              disabled={deleteTicket.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhum ticket encontrado</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-6">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
