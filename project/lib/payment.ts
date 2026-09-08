export const formatCurrency = (amount: number, currency: string = 'MZN'): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-MZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
