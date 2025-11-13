export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING_FOR_USER: 'waiting_for_user',
  WAITING_FOR_THIRD_PARTY: 'waiting_for_third_party',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const TICKET_CATEGORY = {
  TECHNICAL_ISSUE: 'technical_issue',
  PAYMENT_PROBLEM: 'payment_problem',
  ORDER_ISSUE: 'order_issue',
  RETURN_REQUEST: 'return_request',
  ACCOUNT_ISSUE: 'account_issue',
  PRODUCT_ISSUE: 'product_issue',
  SHIPPING_PROBLEM: 'shipping_problem',
  GENERAL_INQUIRY: 'general_inquiry',
  FEATURE_REQUEST: 'feature_request',
  BUG_REPORT: 'bug_report',
} as const;

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const getStatusIcon = (status: string) => {
  switch (status) {
    case TICKET_STATUS.OPEN:
      return '🔴';
    case TICKET_STATUS.IN_PROGRESS:
      return '🔵';
    case TICKET_STATUS.WAITING_FOR_USER:
      return '🟡';
    case TICKET_STATUS.WAITING_FOR_THIRD_PARTY:
      return '🟣';
    case TICKET_STATUS.RESOLVED:
      return '🟢';
    case TICKET_STATUS.CLOSED:
      return '⚫';
    default:
      return '⚪';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case TICKET_STATUS.OPEN:
      return 'bg-orange-100 text-orange-800';
    case TICKET_STATUS.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case TICKET_STATUS.WAITING_FOR_USER:
      return 'bg-yellow-100 text-yellow-800';
    case TICKET_STATUS.WAITING_FOR_THIRD_PARTY:
      return 'bg-purple-100 text-purple-800';
    case TICKET_STATUS.RESOLVED:
      return 'bg-green-100 text-green-800';
    case TICKET_STATUS.CLOSED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case TICKET_STATUS.OPEN:
      return 'Aberto';
    case TICKET_STATUS.IN_PROGRESS:
      return 'Em Progresso';
    case TICKET_STATUS.WAITING_FOR_USER:
      return 'Aguardando Resposta';
    case TICKET_STATUS.WAITING_FOR_THIRD_PARTY:
      return 'Aguardando Terceiros';
    case TICKET_STATUS.RESOLVED:
      return 'Resolvido';
    case TICKET_STATUS.CLOSED:
      return 'Fechado';
    default:
      return status;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case TICKET_PRIORITY.LOW:
      return 'bg-gray-100 text-gray-800';
    case TICKET_PRIORITY.MEDIUM:
      return 'bg-blue-100 text-blue-800';
    case TICKET_PRIORITY.HIGH:
      return 'bg-orange-100 text-orange-800';
    case TICKET_PRIORITY.URGENT:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
    case TICKET_PRIORITY.LOW:
      return 'Baixa';
    case TICKET_PRIORITY.MEDIUM:
      return 'Média';
    case TICKET_PRIORITY.HIGH:
      return 'Alta';
    case TICKET_PRIORITY.URGENT:
      return 'Urgente';
    default:
      return priority;
  }
};

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    [TICKET_CATEGORY.TECHNICAL_ISSUE]: '🔧',
    [TICKET_CATEGORY.PAYMENT_PROBLEM]: '💳',
    [TICKET_CATEGORY.ORDER_ISSUE]: '📦',
    [TICKET_CATEGORY.RETURN_REQUEST]: '🔄',
    [TICKET_CATEGORY.ACCOUNT_ISSUE]: '👤',
    [TICKET_CATEGORY.PRODUCT_ISSUE]: '🛍️',
    [TICKET_CATEGORY.SHIPPING_PROBLEM]: '🚚',
    [TICKET_CATEGORY.GENERAL_INQUIRY]: '❓',
    [TICKET_CATEGORY.FEATURE_REQUEST]: '💡',
    [TICKET_CATEGORY.BUG_REPORT]: '🐛',
  };
  return icons[category] || '📋';
};

export const getCategoryText = (category: string) => {
  const labels: Record<string, string> = {
    [TICKET_CATEGORY.TECHNICAL_ISSUE]: 'Problema Técnico',
    [TICKET_CATEGORY.PAYMENT_PROBLEM]: 'Problema com Pagamento',
    [TICKET_CATEGORY.ORDER_ISSUE]: 'Problema com Pedido',
    [TICKET_CATEGORY.RETURN_REQUEST]: 'Solicitação de Devolução',
    [TICKET_CATEGORY.ACCOUNT_ISSUE]: 'Problema com Conta',
    [TICKET_CATEGORY.PRODUCT_ISSUE]: 'Problema com Produto',
    [TICKET_CATEGORY.SHIPPING_PROBLEM]: 'Problema com Envio',
    [TICKET_CATEGORY.GENERAL_INQUIRY]: 'Consulta Geral',
    [TICKET_CATEGORY.FEATURE_REQUEST]: 'Solicitação de Funcionalidade',
    [TICKET_CATEGORY.BUG_REPORT]: 'Reportar Bug',
  };
  return labels[category] || category;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (file.size > maxSize) {
    return { valid: false, error: 'Tamanho máximo do arquivo: 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou PDF' };
  }

  return { valid: true };
};

