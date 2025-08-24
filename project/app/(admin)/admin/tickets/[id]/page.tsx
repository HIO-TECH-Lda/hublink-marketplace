'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Upload, X, Clock, CheckCircle, AlertCircle, MessageSquare, User, Tag, Calendar, FileText, Edit3, Save, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMarketplace, TicketCategory, TicketPriority, TicketStatus } from '@/contexts/MarketplaceContext';

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<any>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const foundTicket = state.tickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
      setEditedTicket(foundTicket);
    }
  }, [ticketId, state.tickets]);

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-9 mb-2">Ticket não encontrado</h3>
            <p className="text-gray-6 mb-4">O ticket que você está procurando não existe.</p>
            <Button onClick={() => router.push('/admin/tickets')}>
              Voltar para Tickets
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMsg = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        userId: state.user?.id || 'admin',
        userType: 'admin' as const,
        message: newMessage,
        createdAt: new Date().toISOString(),
        isInternal: false,
        attachments: []
      };
      const updatedTicket = {
        ...ticket,
        messages: [...ticket.messages, newMsg],
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      setTicket(updatedTicket);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedTicket) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedTicket = {
        ...editedTicket,
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      setTicket(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Erro ao atualizar ticket. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTicket(ticket);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/tickets')}
              className="h-9"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-9">Ticket #{ticket.id}</h1>
              <p className="text-gray-6 text-sm">{ticket.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="h-9"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isSubmitting}
                  className="h-9"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-9"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informações do Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <Input
                        value={editedTicket.title}
                        onChange={(e) => setEditedTicket({...editedTicket, title: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <Textarea
                        value={editedTicket.description}
                        onChange={(e) => setEditedTicket({...editedTicket, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <Select 
                          value={editedTicket.status} 
                          onValueChange={(value) => setEditedTicket({...editedTicket, status: value})}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TicketStatus.OPEN}>Aberto</SelectItem>
                            <SelectItem value={TicketStatus.IN_PROGRESS}>Em Progresso</SelectItem>
                            <SelectItem value={TicketStatus.WAITING_FOR_USER}>Aguardando Resposta</SelectItem>
                            <SelectItem value={TicketStatus.WAITING_FOR_THIRD_PARTY}>Aguardando Terceiros</SelectItem>
                            <SelectItem value={TicketStatus.RESOLVED}>Resolvido</SelectItem>
                            <SelectItem value={TicketStatus.CLOSED}>Fechado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                        <Select 
                          value={editedTicket.priority} 
                          onValueChange={(value) => setEditedTicket({...editedTicket, priority: value})}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                            <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                            <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
                            <SelectItem value={TicketPriority.URGENT}>Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <Select 
                          value={editedTicket.category} 
                          onValueChange={(value) => setEditedTicket({...editedTicket, category: value})}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Atribuir Agente</label>
                                                 <Select 
                           value={editedTicket.assignedTo || 'unassigned'} 
                           onValueChange={(value) => setEditedTicket({...editedTicket, assignedTo: value === 'unassigned' ? null : value})}
                         >
                           <SelectTrigger className="h-10">
                             <SelectValue placeholder="Selecionar agente" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="unassigned">Não atribuído</SelectItem>
                             {state.agents?.map((agent) => (
                               <SelectItem key={agent.id} value={agent.id}>
                                 {agent.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-9 mb-2">{ticket.title}</h3>
                      <p className="text-gray-6 text-sm">{ticket.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1">{getStatusText(ticket.status)}</span>
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                      <Badge variant="outline">
                        <span className="mr-1">{getCategoryIcon(ticket.category)}</span>
                        {getCategoryText(ticket.category)}
                      </Badge>
                      {ticket.orderId && (
                        <Badge variant="outline">
                          Pedido: {ticket.orderId}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-6">Criado por:</span>
                        <span className="font-medium">{getUserName(ticket.userId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-6">Criado em:</span>
                        <span className="font-medium">{formatDate(ticket.createdAt)}</span>
                      </div>
                      {ticket.assignedTo && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-6">Atribuído a:</span>
                          <span className="font-medium">
                            {state.agents?.find(a => a.id === ticket.assignedTo)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mensagens ({ticket.messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.isInternal 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : message.userType === 'admin'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.userType === 'admin' ? 'Administrador' : getUserName(message.userId)}
                          </span>
                          {message.isInternal && (
                            <Badge variant="outline" className="text-xs">
                              Nota Interna
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-5">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-7 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* New Message Form */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Mensagem (Pública)
                    </label>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua resposta..."
                      rows={3}
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anexos
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" className="h-10">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (ticket.status !== TicketStatus.IN_PROGRESS) {
                      const updatedTicket = { ...ticket, status: TicketStatus.IN_PROGRESS };
                      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
                      setTicket(updatedTicket);
                    }
                  }}
                  disabled={ticket.status === TicketStatus.IN_PROGRESS}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Marcar como Em Progresso
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (ticket.status !== TicketStatus.WAITING_FOR_USER) {
                      const updatedTicket = { ...ticket, status: TicketStatus.WAITING_FOR_USER };
                      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
                      setTicket(updatedTicket);
                    }
                  }}
                  disabled={ticket.status === TicketStatus.WAITING_FOR_USER}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Aguardando Resposta
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (ticket.status !== TicketStatus.RESOLVED) {
                      const updatedTicket = { ...ticket, status: TicketStatus.RESOLVED };
                      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
                      setTicket(updatedTicket);
                    }
                  }}
                  disabled={ticket.status === TicketStatus.RESOLVED}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Resolvido
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (ticket.status !== TicketStatus.CLOSED) {
                      const updatedTicket = { ...ticket, status: TicketStatus.CLOSED };
                      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
                      setTicket(updatedTicket);
                    }
                  }}
                  disabled={ticket.status === TicketStatus.CLOSED}
                >
                  <X className="w-4 h-4 mr-2" />
                  Fechar Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nota Interna</CardTitle>
                <CardDescription>
                  Adicione uma nota interna visível apenas para administradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Digite uma nota interna..."
                  rows={3}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    if (!internalNote.trim()) return;
                    setIsSubmitting(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      const newMsg = {
                        id: `msg-${Date.now()}`,
                        ticketId: ticket.id,
                        userId: state.user?.id || 'admin',
                        userType: 'admin' as const,
                        message: internalNote,
                        createdAt: new Date().toISOString(),
                        isInternal: true,
                        attachments: []
                      };
                      const updatedTicket = {
                        ...ticket,
                        messages: [...ticket.messages, newMsg],
                        updatedAt: new Date().toISOString()
                      };
                      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
                      setTicket(updatedTicket);
                      setInternalNote('');
                    } catch (error) {
                      console.error('Error adding internal note:', error);
                      alert('Erro ao adicionar nota interna. Tente novamente.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={!internalNote.trim() || isSubmitting}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Adicionar Nota Interna
                </Button>
              </CardContent>
            </Card>

            {/* Ticket Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Mensagens:</span>
                  <span className="font-medium">{ticket.messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Tempo Aberto:</span>
                  <span className="font-medium">
                    {Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Última Atualização:</span>
                  <span className="font-medium text-xs">
                    {formatDate(ticket.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
