'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Tag, 
  Calendar, 
  FileText, 
  Edit3, 
  Save, 
  Users,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  useAdminTicket,
  useUpdateTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useAddTicketMessage,
  useDeleteTicket,
  useAdminUsers,
  Ticket,
  TicketStatus
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ticketId = params.id as string;

  const { data: ticket, isLoading } = useAdminTicket(ticketId);
  const { data: usersData } = useAdminUsers({ limit: 100, role: 'all' });
  const updateTicket = useUpdateTicket();
  const updateStatus = useUpdateTicketStatus();
  const assignTicket = useAssignTicket();
  const addMessage = useAddTicketMessage();
  const deleteTicket = useDeleteTicket();

  const [newMessage, setNewMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Partial<Ticket>>({});

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
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !internalNote.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite uma mensagem.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const message = isInternal ? internalNote : newMessage;
      const attachmentData = await Promise.all(
        attachments.map(async (file) => {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          return {
            base64,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type
          };
        })
      );

      await addMessage.mutateAsync({
        ticketId,
        data: {
          message,
          isInternal,
          attachments: attachmentData.length > 0 ? attachmentData : undefined
        }
      });

      setNewMessage('');
      setInternalNote('');
      setIsInternal(false);
      setAttachments([]);
    } catch (error: any) {
      // Error is handled by the hook
    }
  };

  const handleUpdateStatus = (status: TicketStatus) => {
    updateStatus.mutate({ ticketId, status });
  };

  const handleAssign = (userId: string) => {
    assignTicket.mutate({ ticketId, userId });
  };

  const handleSaveEdit = async () => {
    try {
      const updateData: any = { ...editedTicket };
      if (updateData.assignedTo && typeof updateData.assignedTo === 'object') {
        updateData.assignedTo = updateData.assignedTo.id;
      }
      await updateTicket.mutateAsync({ ticketId, data: updateData });
      setIsEditing(false);
      setEditedTicket({});
    } catch (error: any) {
      // Error is handled by the hook
    }
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o ticket "${ticket?.ticketNumber}"?`)) {
      deleteTicket.mutate(ticketId, {
        onSuccess: () => {
          router.push('/admin/tickets');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando ticket...</p>
          </div>
        </div>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
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
      </>
    );
  }

  const messages = ticket.messages?.public || [];
  const internalMessages = ticket.messages?.internal || [];
  const allMessages = ticket.messages?.all || [];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{ticket.ticketNumber}</h1>
            <p className="text-gray-6">{ticket.title}</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={() => { setIsEditing(false); setEditedTicket({}); }} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} disabled={updateTicket.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => { setIsEditing(true); setEditedTicket(ticket); }} variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={handleDelete} variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={editedTicket.title || ''}
                      onChange={(e) => setEditedTicket({...editedTicket, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={editedTicket.description || ''}
                      onChange={(e) => setEditedTicket({...editedTicket, description: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select 
                        value={editedTicket.category || ''} 
                        onValueChange={(value) => setEditedTicket({...editedTicket, category: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
                    </div>
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select 
                        value={editedTicket.priority || ''} 
                        onValueChange={(value) => setEditedTicket({...editedTicket, priority: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Título</label>
                    <p className="text-gray-9 font-medium">{ticket.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Descrição</label>
                    <p className="text-gray-9 whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7">Categoria</label>
                      <Badge variant="outline">{getCategoryText(ticket.category)}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Prioridade</label>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens ({allMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {allMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg border ${
                      message.isInternal 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-9">
                          {message.userType === 'admin' || message.userType === 'support' 
                            ? 'Equipe de Suporte' 
                            : ticket.createdBy.name}
                        </p>
                        <p className="text-xs text-gray-6">{formatDate(message.createdAt)}</p>
                      </div>
                      {message.isInternal && (
                        <Badge variant="outline" className="text-xs">Nota Interna</Badge>
                      )}
                    </div>
                    <p className="text-gray-9 whitespace-pre-wrap">{message.message}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            {att.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Message */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isInternal}
                    onCheckedChange={setIsInternal}
                  />
                  <Label>Nota Interna (não visível para o usuário)</Label>
                </div>
                <Textarea
                  value={isInternal ? internalNote : newMessage}
                  onChange={(e) => isInternal ? setInternalNote(e.target.value) : setNewMessage(e.target.value)}
                  placeholder={isInternal ? "Adicionar nota interna..." : "Digite sua mensagem..."}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-6">
                    {attachments.length} arquivo(s) anexado(s)
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={addMessage.isPending || (!newMessage.trim() && !internalNote.trim())}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {addMessage.isPending ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status e Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select 
                  value={ticket.status} 
                  onValueChange={(value) => handleUpdateStatus(value as TicketStatus)}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="waiting_for_user">Aguardando Resposta</SelectItem>
                    <SelectItem value="waiting_for_third_party">Aguardando Terceiros</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Atribuir a</Label>
                <Select 
                  value={ticket.assignedTo?.id || 'none'} 
                  onValueChange={(value) => value !== 'none' && handleAssign(value)}
                  disabled={assignTicket.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não atribuído</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleUpdateStatus('in_progress')}
                  variant="outline"
                  size="sm"
                  disabled={updateStatus.isPending || ticket.status === 'in_progress'}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Em Progresso
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('resolved')}
                  variant="outline"
                  size="sm"
                  disabled={updateStatus.isPending || ticket.status === 'resolved'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Resolver
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('closed')}
                  variant="outline"
                  size="sm"
                  disabled={updateStatus.isPending || ticket.status === 'closed'}
                >
                  <X className="w-4 h-4 mr-1" />
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-6">Criado por:</span>
                <span className="font-medium">{ticket.createdBy.name}</span>
              </div>
              {ticket.assignedTo && (
                <div className="flex justify-between">
                  <span className="text-gray-6">Atribuído a:</span>
                  <span className="font-medium">{ticket.assignedTo.name}</span>
                </div>
              )}
              {ticket.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-6">Pedido:</span>
                  <a 
                    href={`/admin/pedidos/${ticket.orderId.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {ticket.orderId.orderNumber}
                  </a>
                </div>
              )}
              {ticket.productId && (
                <div className="flex justify-between">
                  <span className="text-gray-6">Produto:</span>
                  <a 
                    href={`/admin/produtos/${ticket.productId.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {ticket.productId.name}
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-6">Criado em:</span>
                <span className="font-medium text-xs">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-6">Atualizado em:</span>
                <span className="font-medium text-xs">{formatDate(ticket.updatedAt)}</span>
              </div>
              {ticket.stats && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Mensagens:</span>
                    <span className="font-medium">{ticket.stats.messageCount}</span>
                  </div>
                  {ticket.stats.timeOpen !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-6">Tempo aberto:</span>
                      <span className="font-medium">{ticket.stats.timeOpen} dias</span>
                    </div>
                  )}
                </>
              )}
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <span className="text-gray-6 block mb-2">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
