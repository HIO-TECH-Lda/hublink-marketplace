export const formatCurrency = (amount: number, currency: string = 'MZN'): string => {
  // Amount is stored in cents, convert to base unit for display
  // const baseAmount = amount / 100;
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatAmount = (amount: number): string => {
  return (amount / 100).toFixed(2);
};

export const calculateProfitMargin = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return Math.round(((income - expenses) / income) * 100);
};

export const getPeriodDates = (period: 'today' | 'week' | 'month' | 'year') => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);

  switch (period) {
    case 'today':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate = new Date(now);
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const EXPENSE_CATEGORIES = [
  { slug: 'shipping-delivery', name: 'Envio e Entrega', icon: '🚚', color: '#3B82F6' },
  { slug: 'marketing', name: 'Marketing e Publicidade', icon: '📢', color: '#10B981' },
  { slug: 'product-costs', name: 'Custos de Produtos', icon: '📦', color: '#F59E0B' },
  { slug: 'packaging', name: 'Embalagem', icon: '📦', color: '#8B5CF6' },
  { slug: 'utilities', name: 'Utilidades', icon: '⚡', color: '#EF4444' },
  { slug: 'rent-storage', name: 'Aluguel e Armazenamento', icon: '🏢', color: '#06B6D4' },
  { slug: 'professional-services', name: 'Serviços Profissionais', icon: '💼', color: '#EC4899' },
  { slug: 'equipment-tools', name: 'Equipamentos e Ferramentas', icon: '🔧', color: '#84CC16' },
  { slug: 'travel-transportation', name: 'Viagens e Transporte', icon: '🚗', color: '#F97316' },
  { slug: 'taxes-fees', name: 'Impostos e Taxas', icon: '📋', color: '#6366F1' },
  { slug: 'other', name: 'Outros', icon: '📝', color: '#6B7280' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Dinheiro' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'bank_transfer', label: 'Transferência Bancária' },
  { value: 'emola', label: 'E-Mola' },
  { value: 'other', label: 'Outro' },
] as const;

export const getCategoryName = (slug: string): string => {
  const category = EXPENSE_CATEGORIES.find((cat) => cat.slug === slug);
  return category?.name || slug;
};

export const getCategoryIcon = (slug: string): string => {
  const category = EXPENSE_CATEGORIES.find((cat) => cat.slug === slug);
  return category?.icon || '📝';
};

export const getCategoryColor = (slug: string): string => {
  const category = EXPENSE_CATEGORIES.find((cat) => cat.slug === slug);
  return category?.color || '#6B7280';
};

export const getPaymentMethodLabel = (method: string): string => {
  const payment = PAYMENT_METHODS.find((p) => p.value === method);
  return payment?.label || method;
};

