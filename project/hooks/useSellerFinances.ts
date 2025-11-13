import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface FinanceTransaction {
  _id: string;
  sellerId: string;
  type: 'income' | 'expense';
  source: 'marketplace' | 'manual' | 'other';
  orderId?: string | { _id: string; orderNumber: string };
  amount: number;
  currency: string;
  category?: string;
  vendor?: string;
  description: string;
  date: string;
  paymentMethod: string;
  customerName?: string;
  attachments?: FinanceAttachment[];
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceAttachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface FinanceDashboard {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    activeOrders: number;
    pendingRevenue: number;
  };
  charts: {
    incomeVsExpenses: Array<{ date: string; income: number; expenses: number }>;
    expenseBreakdown: Array<{ category: string; amount: number }>;
    incomeSources: {
      marketplace: number;
      manual: number;
    };
  };
  recentTransactions: {
    income: FinanceTransaction[];
    expenses: FinanceTransaction[];
  };
  topProducts?: Array<{ name: string; revenue: number }>;
}

export interface FinanceReport {
  reportType: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    transactionCount: number;
  };
  incomeBreakdown: {
    marketplace: number;
    manual: number;
    other: number;
  };
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  transactions: FinanceTransaction[];
}

export interface ExpenseCategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface CreateIncomeData {
  amount: number;
  date: string;
  description: string;
  customerName?: string;
  paymentMethod: string;
  category?: string;
}

export interface CreateExpenseData {
  amount: number;
  date: string;
  category: string;
  description: string;
  vendor?: string;
  paymentMethod: string;
  isRecurring?: boolean;
}

export const useFinanceDashboard = (params?: {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'year';
}) => {
  return useQuery({
    queryKey: ['seller-finances', 'dashboard', params],
    queryFn: async () => {
      const response = await apiClient.get('/seller/finances/dashboard', { params });
      return response.data.data as FinanceDashboard;
    },
  });
};

export const useFinanceTransactions = (params?: {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['seller-finances', 'transactions', params],
    queryFn: async () => {
      const response = await apiClient.get('/seller/finances/transactions', { params });
      return response.data.data as {
        transactions: FinanceTransaction[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    },
  });
};

export const useFinanceReport = (params: {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  date?: string;
  week?: string;
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['seller-finances', 'report', params],
    queryFn: async () => {
      const response = await apiClient.get('/seller/finances/reports', { params });
      return response.data.data as FinanceReport;
    },
    enabled: !!params.type,
  });
};

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ['seller-finances', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/seller/finances/categories');
      return response.data.data as { categories: ExpenseCategory[] };
    },
  });
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateIncomeData) => {
      const response = await apiClient.post('/seller/finances/income', data);
      return response.data.data as FinanceTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-finances'] });
      toast({
        title: 'Receita adicionada',
        description: 'A receita foi registrada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível adicionar a receita.';
      toast({
        title: 'Erro ao adicionar receita',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      const response = await apiClient.post('/seller/finances/expenses', data);
      return response.data.data as FinanceTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-finances'] });
      toast({
        title: 'Despesa adicionada',
        description: 'A despesa foi registrada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível adicionar a despesa.';
      toast({
        title: 'Erro ao adicionar despesa',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      transactionId,
      data,
    }: {
      transactionId: string;
      data: Partial<CreateIncomeData | CreateExpenseData>;
    }) => {
      const response = await apiClient.patch(`/seller/finances/transactions/${transactionId}`, data);
      return response.data.data as FinanceTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-finances'] });
      toast({
        title: 'Transação atualizada',
        description: 'A transação foi atualizada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível atualizar a transação.';
      toast({
        title: 'Erro ao atualizar transação',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await apiClient.delete(`/seller/finances/transactions/${transactionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-finances'] });
      toast({
        title: 'Transação removida',
        description: 'A transação foi removida com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível remover a transação.';
      toast({
        title: 'Erro ao remover transação',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useSyncSales = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (syncAll: boolean = true) => {
      const response = await apiClient.post('/seller/finances/sync-sales', { syncAll });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seller-finances'] });
      const syncedCount = data?.syncedCount || 0;
      toast({
        title: 'Sincronização concluída',
        description: `${syncedCount} venda(s) sincronizada(s) com sucesso.`,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível sincronizar as vendas.';
      toast({
        title: 'Erro na sincronização',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

