'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Upload, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTicket, useAddMessage, useUploadAttachment } from '@/hooks/useTickets';
import { useAuth } from '@/contexts/AuthContext';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
  getCategoryIcon,
  getCategoryText,
  formatDate,
  TICKET_STATUS,
  validateFile,
} from '@/lib/ticket-utils';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;

  const { data: ticket, isLoading } = useTicket(ticketId);
  const addMessage = useAddMessage();
  const uploadAttachment = useUploadAttachment();

  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      }
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    try {
      const message = await addMessage.mutateAsync({
        ticketId: ticket._id,
        message: newMessage,
        isInternal: false,
      });

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          await uploadAttachment.mutateAsync({
            ticketId: ticket._id,
            file,
            messageId: message._id,
          });
        }
      }

      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getUserName = (userId: any): string => {
    if (typeof userId === 'string') return 'Usuário';
    return `${userId.firstName || ''} ${userId.lastName || ''}`.trim() || 'Usuário';
  };

  const isCurrentUser = (messageUserId: any): boolean => {
    if (!user || !messageUserId) return false;
    const userId = typeof messageUserId === 'object' ? messageUserId._id : messageUserId;
    return userId === user._id;
  };

  const canAddMessage = ticket && ticket.status !== TICKET_STATUS.CLOSED && ticket.status !== TICKET_STATUS.RESOLVED;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-gray-6">Carregando ticket...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
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

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          /{' '}
          <Link href="/suporte/meus-tickets" className="hover:text-primary">
            Os Meus Tickets
          </Link>{' '}
          / <span className="text-primary">Ticket #{ticket._id.slice(-8)}</span>
        </nav>

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
              <p className="text-gray-6">Ticket #{ticket._id.slice(-8)}</p>
            </div>
            <Badge className={getStatusColor(ticket.status)}>{getStatusText(ticket.status)}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          <div className="lg:col-span-2 space-y-6">
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
                      <Badge className={getPriorityColor(ticket.priority)}>{getPriorityText(ticket.priority)}</Badge>
                    </div>
                  </div>

                  {ticket.orderId && (
                    <div>
                      <h4 className="font-medium text-gray-9 mb-1">Pedido Relacionado</h4>
                      <p className="text-gray-6">
                        {typeof ticket.orderId === 'object' ? ticket.orderId.orderNumber : ticket.orderId}
                      </p>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.messages
                    ?.filter((msg) => !msg.isInternal)
                    .map((message) => (
                      <div
                        key={message._id}
                        className={`p-4 rounded-lg ${
                          isCurrentUser(message.userId)
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-9">
                              {isCurrentUser(message.userId) ? 'Você' : getUserName(message.userId)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.userType === 'admin' || message.userType === 'support'
                                ? 'Suporte'
                                : message.userType === 'seller'
                                  ? 'Vendedor'
                                  : 'Cliente'}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-5">{formatDate(message.createdAt)}</span>
                        </div>
                        <p className="text-gray-7 whitespace-pre-wrap">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {message.attachments.map((att) => (
                              <a
                                key={att._id}
                                href={att.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                📎 {att.fileName}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {canAddMessage && (
                  <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-9 mb-3">Adicionar Mensagem</h4>
                    <div className="space-y-3">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        rows={4}
                      />

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
                          disabled={addMessage.isPending || !newMessage.trim()}
                          className="bg-primary hover:bg-primary-hard text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {addMessage.isPending ? 'Enviando...' : 'Enviar Mensagem'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status do Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-6">Status:</span>
                    <Badge className={getStatusColor(ticket.status)}>{getStatusText(ticket.status)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-6">Prioridade:</span>
                    <Badge className={getPriorityColor(ticket.priority)}>{getPriorityText(ticket.priority)}</Badge>
                  </div>
                  {ticket.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-6">Atribuído a:</span>
                      <span className="text-sm font-medium">
                        {typeof ticket.assignedTo === 'object'
                          ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                          : 'Suporte'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
