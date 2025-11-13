import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userId: string | { _id: string; firstName: string; lastName: string; email: string };
  userType: 'buyer' | 'seller' | 'admin';
  assignedTo?: string | { _id: string; firstName: string; lastName: string; email: string };
  orderId?: string | { _id: string; orderNumber: string };
  productId?: string | { _id: string; name: string };
  tags: string[];
  attachments: TicketAttachment[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  _id: string;
  ticketId: string;
  userId: string | { _id: string; firstName: string; lastName: string };
  userType: 'buyer' | 'seller' | 'admin' | 'support';
  message: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface TicketAttachment {
  _id: string;
  ticketId: string;
  messageId?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
  orderId?: string;
  productId?: string;
  tags?: string[];
}

export interface TicketsResponse {
  tickets: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TicketStatistics {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  averageResponseTime: number;
  averageResolutionTime: number;
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Buyer/Seller Hooks
export const useMyTickets = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['tickets', 'my-tickets', params],
    queryFn: async () => {
      const response = await apiClient.get('/tickets/my-tickets', { params });
      return response.data.data as TicketsResponse;
    },
  });
};

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: async () => {
      const response = await apiClient.get(`/tickets/${ticketId}`);
      return response.data.data as Ticket;
    },
    enabled: !!ticketId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await apiClient.post('/tickets', data);
      return response.data.data as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] });
      toast({
        title: 'Ticket criado',
        description: 'Seu ticket foi criado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível criar o ticket.';
      toast({
        title: 'Erro ao criar ticket',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useAddMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketId,
      message,
      isInternal = false,
    }: {
      ticketId: string;
      message: string;
      isInternal?: boolean;
    }) => {
      const response = await apiClient.post(`/tickets/${ticketId}/messages`, {
        message,
        isInternal,
      });
      return response.data.data as TicketMessage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] });
      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível enviar a mensagem.';
      toast({
        title: 'Erro ao enviar mensagem',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketId,
      file,
      messageId,
    }: {
      ticketId: string;
      file: File;
      messageId?: string;
    }) => {
      const base64 = await fileToBase64(file);
      const response = await apiClient.post(`/tickets/${ticketId}/attachments`, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        base64,
        messageId,
      });
      return response.data.data as TicketAttachment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      toast({
        title: 'Anexo enviado',
        description: 'O arquivo foi anexado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível enviar o anexo.';
      toast({
        title: 'Erro ao enviar anexo',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, attachmentId }: { ticketId: string; attachmentId: string }) => {
      const response = await apiClient.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      toast({
        title: 'Anexo removido',
        description: 'O anexo foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível remover o anexo.';
      toast({
        title: 'Erro ao remover anexo',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Admin/Support Hooks
export const useAllTickets = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  userId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['tickets', 'all', params],
    queryFn: async () => {
      const response = await apiClient.get('/tickets', { params });
      return response.data.data as TicketsResponse;
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: {
        status?: string;
        priority?: string;
        assignedTo?: string;
        tags?: string[];
      };
    }) => {
      const response = await apiClient.patch(`/tickets/${ticketId}`, data);
      return response.data.data as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] });
      toast({
        title: 'Ticket atualizado',
        description: 'O ticket foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível atualizar o ticket.';
      toast({
        title: 'Erro ao atualizar ticket',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useTicketStatistics = (params?: {
  startDate?: string;
  endDate?: string;
  category?: string;
  assignedTo?: string;
}) => {
  return useQuery({
    queryKey: ['tickets', 'statistics', params],
    queryFn: async () => {
      const response = await apiClient.get('/tickets/statistics', { params });
      return response.data.data as TicketStatistics;
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiClient.delete(`/tickets/${ticketId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Ticket removido',
        description: 'O ticket foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível remover o ticket.';
      toast({
        title: 'Erro ao remover ticket',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

