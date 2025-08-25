'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Upload, X, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMarketplace, TicketCategory, TicketPriority, TicketStatus } from '@/contexts/MarketplaceContext';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const foundTicket = state.tickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
    }
  }, [ticketId, state.tickets]);

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="w-5 h-5 text-blue-500" />;
      case TicketStatus.WAITING_FOR_USER:
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case TicketStatus.WAITING_FOR_THIRD_PARTY:
        return <Clock className="w-5 h-5 text-purple-500" />;
      case TicketStatus.RESOLVED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case TicketStatus.CLOSED:
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`Arquivo ${file.name} é muito grande. Tamanho máximo: 5MB`);
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket || !state.user) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newMsg = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        userId: state.user.id,
        userType: state.user.role as 'buyer' | 'seller' | 'admin',
        message: newMessage,
        createdAt: new Date().toISOString(),
        isInternal: false
      };

      // Update ticket with new message
      const updatedTicket = {
        ...ticket,
        messages: [...ticket.messages, newMsg],
        updatedAt: new Date().toISOString()
      };

      // Update in context
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      setTicket(updatedTicket);

      // Clear form
      setNewMessage('');
      setAttachments([]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para ver este ticket.</p>
          <Button onClick={() => router.push('/entrar')} className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Ticket não encontrado</h1>
          <p className="text-gray-6 mb-8">O ticket que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => router.push('/suporte/meus-tickets')} className="bg-primary hover:bg-primary-hard text-white">
            Voltar aos Tickets
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user has access to this ticket
  if (ticket.userId !== state.user.id && state.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você não tem permissão para ver este ticket.</p>
          <Button onClick={() => router.push('/suporte/meus-tickets')} className="bg-primary hover:bg-primary-hard text-white">
            Voltar aos Tickets
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8">
        <div>
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/suporte/meus-tickets')}
              className="p-0 h-auto text-gray-6 hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Tickets
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-9 mb-2">{ticket.title}</h1>
                <p className="text-gray-6">Ticket #{ticket.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <Badge className={getStatusColor(ticket.status)}>
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">Descrição</h4>
                      <p className="text-gray-6">{ticket.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Categoria</h4>
                        <Badge variant="outline">
                          <span className="mr-1">{getCategoryIcon(ticket.category)}</span>
                          {getCategoryText(ticket.category)}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Prioridade</h4>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </div>
                    </div>

                    {ticket.orderId && (
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Pedido Relacionado</h4>
                        <p className="text-gray-6">{ticket.orderId}</p>
                      </div>
                    )}

                    {ticket.productId && (
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Produto Relacionado</h4>
                        <p className="text-gray-6">{ticket.productId}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Criado em</h4>
                        <p className="text-gray-6">{formatDate(ticket.createdAt)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-9 mb-1">Última atualização</h4>
                        <p className="text-gray-6">{formatDate(ticket.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mensagens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ticket.messages.map((message: any) => (
                      <div key={message.id} className={`p-4 rounded-lg ${
                        message.userId === state.user?.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-9">
                              {message.userId === state.user?.id ? 'Você' : 
                               state.agents?.find(a => a.id === message.userId)?.name || 'Suporte'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.userType === 'admin' ? 'Suporte' : 
                               message.userType === 'seller' ? 'Vendedor' : 'Cliente'}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-5">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-7 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* New Message Form */}
                  {ticket.status !== TicketStatus.CLOSED && ticket.status !== TicketStatus.RESOLVED && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-9 mb-3">Adicionar Mensagem</h4>
                      
                      <div className="space-y-3">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          rows={4}
                        />
                        
                        {/* File Upload */}
                        <div>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="message-file-upload"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label htmlFor="message-file-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Anexar Arquivos
                            </Button>
                          </label>
                        </div>

                        {/* File List */}
                        {attachments.length > 0 && (
                          <div className="space-y-2">
                            {attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button
                            onClick={handleSendMessage}
                            disabled={isSubmitting || !newMessage.trim()}
                            className="bg-primary hover:bg-primary-hard text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ticket Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status do Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-6">Status:</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-6">Prioridade:</span>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </div>
                    {ticket.assignedTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-6">Atribuído a:</span>
                        <span className="text-sm font-medium">
                          {state.agents?.find(a => a.id === ticket.assignedTo)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push(`/suporte/novo-ticket?orderId=${ticket.orderId}`)}
                    >
                      Criar Ticket Relacionado
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/suporte/meus-tickets')}
                    >
                      Ver Todos os Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
