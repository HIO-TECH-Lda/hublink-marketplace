/**
 * Centralized API Messages in Portuguese
 * All API response messages should use these translations
 */

export const Messages = {
  // General
  SUCCESS: 'Sucesso',
  // ERROR: 'Erro',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Não encontrado',
  INTERNAL_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Erro de validação',
  
  // Authentication & Authorization
  AUTH: {
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    LOGIN_FAILED: 'Email ou senha incorretos',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso',
    REGISTER_SUCCESS: 'Cadastro realizado com sucesso',
    REGISTER_FAILED: 'Falha ao realizar cadastro',
    TOKEN_INVALID: 'Token inválido',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_MISSING: 'Token não fornecido',
    UNAUTHORIZED: 'Não autorizado. Faça login para continuar',
    ACCESS_DENIED: 'Acesso negado',
    ADMIN_ONLY: 'Acesso restrito a administradores',
    SELLER_ONLY: 'Acesso restrito a vendedores',
    EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado',
    PHONE_ALREADY_EXISTS: 'Este telefone já está cadastrado',
    PASSWORD_RESET_EMAIL_SENT: 'Email de recuperação enviado com sucesso',
    PASSWORD_RESET_SUCCESS: 'Senha alterada com sucesso',
    PASSWORD_RESET_INVALID: 'Link de recuperação inválido ou expirado',
  },

  // Users
  USER: {
    CREATED: 'Usuário criado com sucesso',
    UPDATED: 'Usuário atualizado com sucesso',
    DELETED: 'Usuário excluído com sucesso',
    NOT_FOUND: 'Usuário não encontrado',
    PROFILE_UPDATED: 'Perfil atualizado com sucesso',
    PASSWORD_UPDATED: 'Senha atualizada com sucesso',
    FETCH_SUCCESS: 'Usuários obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter usuários',
    CANNOT_DELETE_WITH_ORDERS: 'Não é possível excluir usuário com pedidos existentes. Considere suspender.',
  },

  // Products
  PRODUCT: {
    CREATED: 'Produto criado com sucesso',
    UPDATED: 'Produto atualizado com sucesso',
    DELETED: 'Produto excluído com sucesso',
    NOT_FOUND: 'Produto não encontrado',
    NOT_AVAILABLE: 'Produto não disponível para compra',
    OUT_OF_STOCK: 'Produto fora de estoque',
    INSUFFICIENT_STOCK: 'Estoque insuficiente. Disponível: {available}',
    VARIANT_NOT_FOUND: 'Variante do produto não encontrada',
    VARIANT_INSUFFICIENT_STOCK: 'Estoque insuficiente na variante. Disponível: {available}',
    FETCH_SUCCESS: 'Produtos obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter produtos',
    ADDED_TO_WISHLIST: 'Produto adicionado à lista de desejos',
    REMOVED_FROM_WISHLIST: 'Produto removido da lista de desejos',
  },

  // Cart
  CART: {
    ITEM_ADDED: 'Item adicionado ao carrinho',
    ITEM_UPDATED: 'Carrinho atualizado',
    ITEM_REMOVED: 'Item removido do carrinho',
    CLEARED: 'Carrinho esvaziado',
    NOT_FOUND: 'Carrinho não encontrado',
    FETCH_SUCCESS: 'Carrinho obtido com sucesso',
    FETCH_FAILED: 'Falha ao obter carrinho',
  },

  // Orders
  ORDER: {
    CREATED: 'Pedido realizado com sucesso',
    UPDATED: 'Pedido atualizado com sucesso',
    CANCELLED: 'Pedido cancelado com sucesso',
    CONFIRMED: 'Pedido confirmado com sucesso',
    SHIPPED: 'Pedido enviado',
    DELIVERED: 'Pedido entregue',
    NOT_FOUND: 'Pedido não encontrado',
    RETRIEVED: 'Pedido obtido com sucesso',
    LIST_RETRIEVED: 'Pedidos obtidos com sucesso',
    LIST_FAILED: 'Falha ao obter pedidos',
    CREATE_FAILED: 'Falha ao criar pedido',
    FETCH_SUCCESS: 'Pedidos obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter pedido',
    STATUS_UPDATED: 'Status do pedido atualizado',
    STATUS_UPDATE_FAILED: 'Falha ao atualizar status do pedido',
    CANNOT_CANCEL: 'Não é possível cancelar este pedido',
    CANCEL_FAILED: 'Falha ao cancelar pedido',
    TRACKING_UPDATED: 'Rastreamento atualizado com sucesso',
    TRACKING_UPDATE_FAILED: 'Falha ao atualizar rastreamento',
    SELLER_ORDERS_RETRIEVED: 'Pedidos do vendedor obtidos com sucesso',
    SELLER_ORDERS_FAILED: 'Falha ao obter pedidos do vendedor',
    CART_EMPTY: 'O carrinho está vazio',
    ITEMS_UNAVAILABLE: 'Alguns itens não estão disponíveis',
    ITEMS_LOW_STOCK: 'Alguns itens têm estoque insuficiente',
    TRACKING_REQUIRED: 'Número de rastreamento é obrigatório para envio',
    CANCEL_REQUIRED: 'Informe quem cancelou e o motivo',
    REFUND_AMOUNT_REQUIRED: 'Valor do reembolso é obrigatório',
    INVALID_STATUS: 'Status do pedido inválido',
    GET_ALL_FAILED: 'Falha ao obter pedidos',
    STATS_FAILED: 'Falha ao obter estatísticas de pedidos',
  },

  // Reviews
  REVIEW: {
    CREATED: 'Avaliação enviada com sucesso',
    UPDATED: 'Avaliação atualizada com sucesso',
    DELETED: 'Avaliação excluída com sucesso',
    NOT_FOUND: 'Avaliação não encontrada',
    ALREADY_REVIEWED: 'Você já avaliou este produto',
    MODERATED: 'Avaliação moderada com sucesso',
    APPROVED: 'Avaliação aprovada com sucesso',
    REJECTED: 'Avaliação rejeitada com sucesso',
    FETCH_SUCCESS: 'Avaliações obtidas com sucesso',
    FETCH_FAILED: 'Falha ao obter avaliações',
    HELPFUL_MARKED: 'Avaliação marcada como útil',
    ORDER_REQUIRED: 'É necessário ter comprado o produto para avaliar',
    ORDER_NOT_DELIVERED: 'O pedido deve estar entregue para avaliar',
  },

  // Blog
  BLOG: {
    POST_CREATED: 'Post criado com sucesso',
    POST_UPDATED: 'Post atualizado com sucesso',
    POST_DELETED: 'Post excluído com sucesso',
    POST_NOT_FOUND: 'Post não encontrado',
    STATUS_UPDATED: 'Status do post atualizado com sucesso',
    FEATURED_MARKED: 'Post marcado como destaque',
    FEATURED_UNMARKED: 'Post removido dos destaques',
    FETCH_SUCCESS: 'Posts obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter posts',
    SLUG_EXISTS: 'Este slug já existe',
    MISSING_FIELDS: 'Campos obrigatórios faltando: título, conteúdo, autorId, autorName e categoria são obrigatórios',
  },

  // Sellers
  SELLER: {
    CREATED: 'Vendedor cadastrado com sucesso',
    UPDATED: 'Vendedor atualizado com sucesso',
    DELETED: 'Vendedor excluído com sucesso',
    NOT_FOUND: 'Vendedor não encontrado',
    VERIFIED: 'Vendedor verificado com sucesso',
    UNVERIFIED: 'Verificação do vendedor removida',
    FEATURED_MARKED: 'Vendedor marcado como destaque',
    FEATURED_UNMARKED: 'Vendedor removido dos destaques',
    FETCH_SUCCESS: 'Vendedores obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter vendedores',
    PROFILE_UPDATED: 'Perfil do vendedor atualizado',
  },

  // Payments
  PAYMENT: {
    INITIATED: 'Pagamento iniciado',
    SUCCESS: 'Pagamento realizado com sucesso',
    FAILED: 'Falha no pagamento',
    PENDING: 'Pagamento pendente',
    CANCELLED: 'Pagamento cancelado',
    REFUNDED: 'Pagamento reembolsado',
    NOT_FOUND: 'Pagamento não encontrado',
    INVALID_METHOD: 'Método de pagamento inválido',
    PROCESSED: 'Pagamento processado com sucesso',
    PROCESS_FAILED: 'Falha ao processar pagamento',
    INTENT_CREATED: 'Intenção de pagamento criada com sucesso',
    INTENT_FAILED: 'Falha ao criar intenção de pagamento',
    CONFIRMED: 'Pagamento confirmado com sucesso',
    CONFIRM_FAILED: 'Falha ao confirmar pagamento',
    REFUND_FAILED: 'Falha ao processar reembolso',
    ORDER_NOT_FOUND: 'Pedido não encontrado',
    ORDER_NOT_BELONG_TO_USER: 'O pedido não pertence a este usuário',
    ORDER_ALREADY_PAID: 'O pedido já foi pago',
    UNSUPPORTED_METHOD: 'Método de pagamento não suportado',
    PAYMENT_ALREADY_EXISTS: 'Já existe pagamento para este pedido',
    RECORD_NOT_FOUND: 'Registro de pagamento não encontrado',
    CANNOT_REFUND: 'Este pagamento não pode ser reembolsado',
    REFUND_AMOUNT_EXCEEDED: 'Valor do reembolso não pode exceder o valor pago',
    NOT_MANUAL_PAYMENT: 'Este pagamento não é manual',
    IMALI_INVALID_RESPONSE: 'Resposta inválida da API Imali',
    IMALI_MISSING_LINK: 'Link de pagamento não retornado pela Imali',
    IMALI_FAILED: 'Falha no pagamento Imali',
    MANUAL_PAYMENT_CREATED: 'Pagamento registrado. O administrador marcará como concluído quando receber.',
  },

  // Refunds
  REFUND: {
    REQUESTED: 'Reembolso solicitado com sucesso',
    APPROVED: 'Reembolso aprovado',
    REJECTED: 'Reembolso rejeitado',
    PROCESSED: 'Reembolso processado',
    NOT_FOUND: 'Reembolso não encontrado',
    FETCH_SUCCESS: 'Reembolsos obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter reembolsos',
    RETRIEVED: 'Reembolso obtido com sucesso',
    STATS_RETRIEVED: 'Estatísticas de reembolso obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas de reembolso',
    APPROVE_FAILED: 'Falha ao aprovar reembolso',
    REJECT_FAILED: 'Falha ao rejeitar reembolso',
    CREATE_FAILED: 'Falha ao criar solicitação de reembolso',
    NOT_PENDING: 'O reembolso não está pendente',
    ORDER_NOT_BELONG: 'O pedido não pertence a este comprador',
    PRODUCT_NOT_IN_ORDER: 'Produto não encontrado no pedido',
    REQUEST_EXISTS: 'Já existe uma solicitação de reembolso para este produto',
    REJECTION_REASON_REQUIRED: 'Motivo da rejeição é obrigatório',
  },

  // Tickets
  TICKET: {
    CREATED: 'Ticket criado com sucesso',
    UPDATED: 'Ticket atualizado com sucesso',
    CLOSED: 'Ticket fechado com sucesso',
    NOT_FOUND: 'Ticket não encontrado',
    MESSAGE_ADDED: 'Mensagem adicionada ao ticket',
    FETCH_SUCCESS: 'Tickets obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter tickets',
    ASSIGNED: 'Ticket atribuído com sucesso',
    RETRIEVED: 'Ticket obtido com sucesso',
    DELETE_FAILED: 'Falha ao excluir ticket',
    DELETED: 'Ticket excluído com sucesso',
    UPDATE_FAILED: 'Falha ao atualizar ticket',
    CREATE_FAILED: 'Falha ao criar ticket',
    ADD_MESSAGE_FAILED: 'Falha ao adicionar mensagem',
    STATS_RETRIEVED: 'Estatísticas obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    ATTACHMENT_UPLOADED: 'Anexo enviado com sucesso',
    ATTACHMENT_UPLOAD_FAILED: 'Falha ao enviar anexo',
    ATTACHMENT_DELETED: 'Anexo excluído com sucesso',
    ATTACHMENT_DELETE_FAILED: 'Falha ao excluir anexo',
    NO_PERMISSION: 'Você não tem permissão para acessar este ticket',
    NO_PERMISSION_UPDATE: 'Você não tem permissão para atualizar este ticket',
    NO_PERMISSION_MESSAGE: 'Você não tem permissão para adicionar mensagens a este ticket',
    NO_PERMISSION_DELETE: 'Você não tem permissão para excluir este anexo',
    CLOSED_CANNOT_MESSAGE: 'Não é possível adicionar mensagens a tickets fechados',
    ORDER_NOT_BELONG: 'Pedido não encontrado ou não pertence a você',
    ASSIGNED_MUST_BE_ADMIN: 'Usuário atribuído deve ser admin ou suporte',
    MESSAGE_NOT_FOUND: 'Mensagem não encontrada',
    ATTACHMENT_NOT_FOUND: 'Anexo não encontrado',
    FILE_SIZE_EXCEEDED: 'Tamanho do arquivo excede o limite de 5MB',
    INVALID_FILE_TYPE: 'Tipo de arquivo inválido. Tipos permitidos: JPEG, PNG, GIF, PDF',
  },

  // Contact
  CONTACT: {
    MESSAGE_SENT: 'Sua mensagem foi enviada com sucesso! Responderemos em até 24 horas.',
    MESSAGE_FAILED: 'Falha ao enviar mensagem. Por favor, tente novamente.',
    INVALID_EMAIL: 'Formato de email inválido',
    MISSING_FIELDS: 'Campos obrigatórios faltando',
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBED: 'Inscrito na newsletter com sucesso',
    UNSUBSCRIBED: 'Desinscrito da newsletter',
    ALREADY_SUBSCRIBED: 'Este email já está inscrito',
    NOT_FOUND: 'Inscrição não encontrada',
    EMAIL_SENT: 'Email enviado com sucesso',
    EMAIL_FAILED: 'Falha ao enviar email',
  },

  // Categories
  CATEGORY: {
    CREATED: 'Categoria criada com sucesso',
    UPDATED: 'Categoria atualizada com sucesso',
    DELETED: 'Categoria excluída com sucesso',
    NOT_FOUND: 'Categoria não encontrada',
    FETCH_SUCCESS: 'Categorias obtidas com sucesso',
    FETCH_FAILED: 'Falha ao obter categorias',
    RETRIEVED: 'Categoria obtida com sucesso',
    CREATE_FAILED: 'Falha ao criar categoria',
    UPDATE_FAILED: 'Falha ao atualizar categoria',
    DELETE_FAILED: 'Falha ao excluir categoria',
    HAS_CHILDREN: 'Não é possível excluir categoria com subcategorias. Exclua as subcategorias primeiro',
    ROOT_RETRIEVED: 'Categorias raiz obtidas com sucesso',
    ROOT_FAILED: 'Falha ao obter categorias raiz',
    CHILDREN_RETRIEVED: 'Subcategorias obtidas com sucesso',
    CHILDREN_FAILED: 'Falha ao obter subcategorias',
    FEATURED_RETRIEVED: 'Categorias em destaque obtidas com sucesso',
    FEATURED_FAILED: 'Falha ao obter categorias em destaque',
    TREE_BUILT: 'Árvore de categorias construída com sucesso',
    TREE_FAILED: 'Falha ao construir árvore de categorias',
    WITH_COUNT_RETRIEVED: 'Categoria com contagem de produtos obtida com sucesso',
    WITH_COUNT_FAILED: 'Falha ao obter categoria com contagem',
    PATH_RETRIEVED: 'Caminho da categoria obtido com sucesso',
    PATH_FAILED: 'Falha ao obter caminho da categoria',
    DESCENDANTS_RETRIEVED: 'Descendentes da categoria obtidos com sucesso',
    DESCENDANTS_FAILED: 'Falha ao obter descendentes',
    SEARCH_COMPLETED: 'Busca de categorias concluída com sucesso',
    SEARCH_FAILED: 'Falha ao buscar categorias',
    SEARCH_TERM_REQUIRED: 'Termo de busca é obrigatório',
  },

  // Wishlist
  WISHLIST: {
    ITEM_ADDED: 'Item adicionado à lista de desejos',
    ITEM_REMOVED: 'Item removido da lista de desejos',
    CLEARED: 'Lista de desejos esvaziada',
    FETCH_SUCCESS: 'Lista de desejos obtida com sucesso',
    FETCH_FAILED: 'Falha ao obter lista de desejos',
    RETRIEVED: 'Lista de desejos obtida com sucesso',
    ADD_FAILED: 'Falha ao adicionar à lista de desejos',
    REMOVE_FAILED: 'Falha ao remover da lista de desejos',
    CLEAR_FAILED: 'Falha ao esvaziar lista de desejos',
    NOT_FOUND: 'Lista de desejos não encontrada',
    STATUS_CHECKED: 'Status da lista de desejos verificado com sucesso',
    STATUS_CHECK_FAILED: 'Falha ao verificar status',
    MOVED_TO_CART: 'Produto movido para o carrinho com sucesso',
    MOVE_TO_CART_FAILED: 'Falha ao mover para o carrinho',
    STATS_RETRIEVED: 'Estatísticas da lista de desejos obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    ITEMS_RETRIEVED: 'Itens da lista de desejos obtidos com sucesso',
    ITEMS_FAILED: 'Falha ao obter itens',
    NOTES_UPDATED: 'Notas do item atualizadas com sucesso',
    NOTES_UPDATE_FAILED: 'Falha ao atualizar notas',
    RECOMMENDATIONS_RETRIEVED: 'Recomendações obtidas com sucesso',
    RECOMMENDATIONS_FAILED: 'Falha ao obter recomendações',
    BULK_ADD_COMPLETED: 'Adição em massa concluída',
    BULK_ADD_FAILED: 'Falha ao adicionar em massa',
    BULK_REMOVE_COMPLETED: 'Remoção em massa concluída',
    BULK_REMOVE_FAILED: 'Falha ao remover em massa',
    PRODUCT_ID_REQUIRED: 'ID do produto é obrigatório',
    PRODUCTS_ARRAY_REQUIRED: 'Array de produtos é obrigatório e não pode estar vazio',
    PRODUCT_IDS_ARRAY_REQUIRED: 'Array de IDs de produtos é obrigatório e não pode estar vazio',
    QUANTITY_MIN_1: 'Quantidade deve ser pelo menos 1',
    ITEM_NOT_FOUND: 'Item não encontrado na lista de desejos',
  },

  // Upload
  UPLOAD: {
    SUCCESS: 'Upload realizado com sucesso',
    FAILED: 'Falha no upload',
    INVALID_FILE: 'Arquivo inválido',
    FILE_TOO_LARGE: 'Arquivo muito grande',
    UNSUPPORTED_FORMAT: 'Formato de arquivo não suportado',
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PHONE: 'Número de telefone inválido',
    INVALID_FORMAT: 'Formato inválido',
    MIN_LENGTH: 'Comprimento mínimo não atingido',
    MAX_LENGTH: 'Comprimento máximo excedido',
    INVALID_VALUE: 'Valor inválido',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  },

  // Analytics
  ANALYTICS: {
    FETCH_SUCCESS: 'Análises obtidas com sucesso',
    FETCH_FAILED: 'Falha ao obter análises',
  },

  // Settings
  SETTINGS: {
    UPDATED: 'Configurações atualizadas com sucesso',
    FETCH_SUCCESS: 'Configurações obtidas com sucesso',
    FETCH_FAILED: 'Falha ao obter configurações',
  },

  // Reports
  REPORT: {
    GENERATED: 'Relatório gerado com sucesso',
    FAILED: 'Falha ao gerar relatório',
    NOT_FOUND: 'Relatório não encontrado',
  },

  // Admin - Products
  ADMIN_PRODUCT: {
    CREATED: 'Produto criado com sucesso',
    UPDATED: 'Produto atualizado com sucesso',
    DELETED: 'Produto excluído com sucesso',
    STATUS_UPDATED: 'Status do produto atualizado com sucesso',
    RETRIEVED: 'Produto obtido com sucesso',
    LIST_RETRIEVED: 'Produtos obtidos com sucesso',
    STATS_RETRIEVED: 'Estatísticas de produtos obtidas com sucesso',
    CREATE_FAILED: 'Falha ao criar produto',
    UPDATE_FAILED: 'Falha ao atualizar produto',
    DELETE_FAILED: 'Falha ao excluir produto',
    FETCH_FAILED: 'Falha ao obter produto',
    LIST_FAILED: 'Falha ao obter produtos',
    STATS_FAILED: 'Falha ao obter estatísticas',
    INVALID_STATUS: 'Status inválido. Deve ser um de: draft, active, inactive, archived',
  },

  // Admin - Orders
  ADMIN_ORDER: {
    RETRIEVED: 'Pedido obtido com sucesso',
    UPDATED: 'Pedido atualizado com sucesso',
    STATUS_UPDATED: 'Status do pedido atualizado com sucesso',
    LIST_RETRIEVED: 'Pedidos obtidos com sucesso',
    STATS_RETRIEVED: 'Estatísticas de pedidos obtidas com sucesso',
    FETCH_FAILED: 'Falha ao obter pedido',
    UPDATE_FAILED: 'Falha ao atualizar pedido',
    STATUS_UPDATE_FAILED: 'Falha ao atualizar status do pedido',
    LIST_FAILED: 'Falha ao obter pedidos',
    STATS_FAILED: 'Falha ao obter estatísticas',
  },

  // Admin - Users
  ADMIN_USER: {
    CREATED: 'Usuário criado com sucesso',
    UPDATED: 'Usuário atualizado com sucesso',
    DELETED: 'Usuário excluído com sucesso',
    STATUS_UPDATED: 'Status do usuário atualizado com sucesso',
    RETRIEVED: 'Usuário obtido com sucesso',
    LIST_RETRIEVED: 'Usuários obtidos com sucesso',
    STATS_RETRIEVED: 'Estatísticas de usuários obtidas com sucesso',
    SELLERS_RETRIEVED: 'Vendedores obtidos com sucesso',
    CREATE_FAILED: 'Falha ao criar usuário',
    UPDATE_FAILED: 'Falha ao atualizar usuário',
    DELETE_FAILED: 'Falha ao excluir usuário',
    FETCH_FAILED: 'Falha ao obter usuário',
    LIST_FAILED: 'Falha ao obter usuários',
    STATS_FAILED: 'Falha ao obter estatísticas',
    SELLERS_FAILED: 'Falha ao obter vendedores',
    REQUIRED_FIELDS: 'Campos obrigatórios: nome, sobrenome, email, telefone e senha',
    EMAIL_EXISTS: 'Este email já está cadastrado',
    PHONE_EXISTS: 'Este telefone já está cadastrado',
  },

  // Admin - Sellers
  ADMIN_SELLER: {
    CREATED: 'Vendedor criado com sucesso',
    UPDATED: 'Vendedor atualizado com sucesso',
    DELETED: 'Vendedor excluído com sucesso',
    VERIFIED: 'Vendedor verificado com sucesso',
    UNVERIFIED: 'Verificação do vendedor removida',
    FEATURED: 'Vendedor marcado como destaque',
    UNFEATURED: 'Vendedor removido dos destaques',
    SUSPENDED: 'Vendedor suspenso com sucesso',
    UNSUSPENDED: 'Suspensão do vendedor removida',
    STATUS_UPDATED: 'Status do vendedor atualizado com sucesso',
    RETRIEVED: 'Vendedor obtido com sucesso',
    LIST_RETRIEVED: 'Vendedores obtidos com sucesso',
    STATS_RETRIEVED: 'Estatísticas de vendedores obtidas com sucesso',
    CREATE_FAILED: 'Falha ao criar vendedor',
    UPDATE_FAILED: 'Falha ao atualizar vendedor',
    DELETE_FAILED: 'Falha ao excluir vendedor',
    FETCH_FAILED: 'Falha ao obter vendedor',
    LIST_FAILED: 'Falha ao obter vendedores',
    STATS_FAILED: 'Falha ao obter estatísticas',
    EMAIL_EXISTS: 'Este email já está cadastrado',
    PHONE_EXISTS: 'Este telefone já está cadastrado',
  },

  // Admin - Refunds
  ADMIN_REFUND: {
    STATS_RETRIEVED: 'Estatísticas de reembolsos obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    LIST_RETRIEVED: 'Reembolsos obtidos com sucesso',
    LIST_FAILED: 'Falha ao obter reembolsos',
    RETRIEVED: 'Reembolso obtido com sucesso',
    FETCH_FAILED: 'Falha ao obter reembolso',
    APPROVED: 'Reembolso aprovado com sucesso',
    APPROVE_FAILED: 'Falha ao aprovar reembolso',
    REJECTED: 'Reembolso rejeitado com sucesso',
    REJECT_FAILED: 'Falha ao rejeitar reembolso',
  },

  // Admin - Tickets
  ADMIN_TICKET: {
    STATS_RETRIEVED: 'Estatísticas de tickets obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    LIST_RETRIEVED: 'Tickets obtidos com sucesso',
    LIST_FAILED: 'Falha ao obter tickets',
    RETRIEVED: 'Ticket obtido com sucesso',
    FETCH_FAILED: 'Falha ao obter ticket',
    UPDATED: 'Ticket atualizado com sucesso',
    UPDATE_FAILED: 'Falha ao atualizar ticket',
    STATUS_UPDATED: 'Status do ticket atualizado com sucesso',
    STATUS_UPDATE_FAILED: 'Falha ao atualizar status',
    ASSIGNED: 'Ticket atribuído com sucesso',
    ASSIGN_FAILED: 'Falha ao atribuir ticket',
    MESSAGE_ADDED: 'Mensagem adicionada com sucesso',
    MESSAGE_FAILED: 'Falha ao adicionar mensagem',
  },

  // Admin - Categories
  ADMIN_CATEGORY: {
    STATS_RETRIEVED: 'Estatísticas de categorias obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    LIST_RETRIEVED: 'Categorias obtidas com sucesso',
    LIST_FAILED: 'Falha ao obter categorias',
    RETRIEVED: 'Categoria obtida com sucesso',
    FETCH_FAILED: 'Falha ao obter categoria',
    CREATED: 'Categoria criada com sucesso',
    CREATE_FAILED: 'Falha ao criar categoria',
    UPDATED: 'Categoria atualizada com sucesso',
    UPDATE_FAILED: 'Falha ao atualizar categoria',
    STATUS_UPDATED: 'Status da categoria atualizado com sucesso',
    STATUS_UPDATE_FAILED: 'Falha ao atualizar status',
    DELETED: 'Categoria excluída com sucesso',
    DELETE_FAILED: 'Falha ao excluir categoria',
  },

  // Admin - Newsletter
  ADMIN_NEWSLETTER: {
    STATS_RETRIEVED: 'Estatísticas de newsletter obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
    LIST_RETRIEVED: 'Inscritos obtidos com sucesso',
    LIST_FAILED: 'Falha ao obter inscritos',
    RETRIEVED: 'Inscrito obtido com sucesso',
    FETCH_FAILED: 'Falha ao obter inscrito',
    CREATED: 'Inscrito criado com sucesso',
    CREATE_FAILED: 'Falha ao criar inscrito',
    UPDATED: 'Inscrito atualizado com sucesso',
    UPDATE_FAILED: 'Falha ao atualizar inscrito',
    STATUS_UPDATED: 'Status do inscrito atualizado com sucesso',
    STATUS_UPDATE_FAILED: 'Falha ao atualizar status',
    DELETED: 'Inscrito excluído com sucesso',
    DELETE_FAILED: 'Falha ao excluir inscrito',
  },

  // Admin - Reports
  ADMIN_REPORTS: {
    RETRIEVED: 'Relatórios obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter relatórios',
    SALES_EXPORTED: 'Dados de vendas exportados com sucesso',
    SALES_EXPORT_FAILED: 'Falha ao exportar dados de vendas',
    PRODUCTS_EXPORTED: 'Dados de produtos exportados com sucesso',
    PRODUCTS_EXPORT_FAILED: 'Falha ao exportar dados de produtos',
  },

  // Admin - Audit Logs
  ADMIN_AUDIT: {
    RETRIEVED: 'Logs de auditoria obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter logs',
    STATS_RETRIEVED: 'Estatísticas de auditoria obtidas com sucesso',
    STATS_FAILED: 'Falha ao obter estatísticas',
  },

  // Dashboard
  DASHBOARD: {
    RETRIEVED: 'Dados do painel obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter dados do painel',
  },

  // Email
  EMAIL: {
    TEST_SUCCESS: 'Teste do serviço de email concluído com sucesso',
    TEST_FAILED: 'Falha no teste do serviço de email',
    SENT: 'Email enviado com sucesso',
    SEND_FAILED: 'Falha ao enviar email',
    STATUS_RETRIEVED: 'Status do serviço de email obtido',
    STATUS_FAILED: 'Falha ao obter status do serviço',
    WELCOME_SENT: 'Email de boas-vindas enviado com sucesso',
    WELCOME_FAILED: 'Falha ao enviar email de boas-vindas',
    PASSWORD_RESET_SENT: 'Email de recuperação de senha enviado com sucesso',
    PASSWORD_RESET_FAILED: 'Falha ao enviar email de recuperação de senha',
    NEWSLETTER_SENT: 'Email da newsletter enviado com sucesso',
    NEWSLETTER_FAILED: 'Falha ao enviar email da newsletter',
    EMAIL_REQUIRED: 'Endereço de email é obrigatório',
    TO_SUBJECT_TEMPLATE_REQUIRED: 'Destinatário, assunto e template são obrigatórios',
    TO_SUBJECT_CONTENT_REQUIRED: 'Destinatário, assunto e conteúdo são obrigatórios',
    EMAIL_TOKEN_REQUIRED: 'Email e token de recuperação são obrigatórios',
  },

  // Finance
  FINANCE: {
    DASHBOARD_RETRIEVED: 'Dados do painel financeiro obtidos com sucesso',
    DASHBOARD_FAILED: 'Falha ao obter dados do painel financeiro',
    TRANSACTIONS_RETRIEVED: 'Transações obtidas com sucesso',
    TRANSACTIONS_FAILED: 'Falha ao obter transações',
    TRANSACTION_RETRIEVED: 'Transação obtida com sucesso',
    TRANSACTION_FAILED: 'Falha ao obter transação',
    TRANSACTION_NOT_FOUND: 'Transação não encontrada',
    INCOME_CREATED: 'Entrada de receita criada com sucesso',
    INCOME_FAILED: 'Falha ao criar entrada de receita',
    EXPENSE_CREATED: 'Entrada de despesa criada com sucesso',
    EXPENSE_FAILED: 'Falha ao criar entrada de despesa',
    TRANSACTION_UPDATED: 'Transação atualizada com sucesso',
    TRANSACTION_UPDATE_FAILED: 'Falha ao atualizar transação',
    TRANSACTION_DELETED: 'Transação excluída com sucesso',
    TRANSACTION_DELETE_FAILED: 'Falha ao excluir transação',
    REPORT_GENERATED: 'Relatório gerado com sucesso',
    REPORT_FAILED: 'Falha ao gerar relatório',
    CATEGORIES_RETRIEVED: 'Categorias obtidas com sucesso',
    CATEGORIES_FAILED: 'Falha ao obter categorias',
    ATTACHMENT_UPLOADED: 'Anexo enviado com sucesso',
    ATTACHMENT_UPLOAD_FAILED: 'Falha ao enviar anexo',
    SALES_SYNCED: 'Vendas sincronizadas com sucesso',
    SALES_SYNC_FAILED: 'Falha ao sincronizar vendas',
    SYNC_ALL_SUCCESS: 'Sincronizadas {synced} pedidos, ignorados {skipped} pedidos',
    NO_INCOME_CREATED: 'Nenhuma entrada de receita criada (pedido não entregue ou pagamento não confirmado)',
    ORDER_ID_OR_SYNC_ALL_REQUIRED: 'orderId ou syncAll=true é obrigatório',
    RECORD_CREATED: 'Registro financeiro criado com sucesso',
    RECORD_UPDATED: 'Registro financeiro atualizado com sucesso',
    RECORD_DELETED: 'Registro financeiro excluído com sucesso',
    NOT_FOUND: 'Registro financeiro não encontrado',
    FETCH_SUCCESS: 'Registros financeiros obtidos com sucesso',
    FETCH_FAILED: 'Falha ao obter registros financeiros',
  },

  // Payout
  PAYOUT: {
    BALANCE_RETRIEVED: 'Saldo obtido com sucesso',
    BALANCE_FAILED: 'Falha ao obter saldo',
    HISTORY_RETRIEVED: 'Histórico de pagamentos obtido com sucesso',
    HISTORY_FAILED: 'Falha ao obter histórico de pagamentos',
    REQUESTED: 'Pagamento solicitado com sucesso',
    REQUEST_FAILED: 'Falha ao solicitar pagamento',
    RETRIEVED: 'Pagamento obtido com sucesso',
    FETCH_FAILED: 'Falha ao obter pagamento',
    NOT_FOUND: 'Pagamento não encontrado',
  },

  // Error Handling
  ERROR: {
    INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
    SOMETHING_WENT_WRONG: 'Algo deu errado',
    ROUTE_NOT_FOUND: 'Rota não encontrada',
    VALIDATION_FAILED: 'Falha na validação',
  },
};

/**
 * Helper function to get nested message
 * Usage: getMessage('USER.CREATED') or getMessage('AUTH.LOGIN_SUCCESS')
 */
export function getMessage(path: string, defaultMessage = 'Operação realizada'): string {
  const keys = path.split('.');
  let message: any = Messages;
  
  for (const key of keys) {
    if (message[key]) {
      message = message[key];
    } else {
      return defaultMessage;
    }
  }
  
  return typeof message === 'string' ? message : defaultMessage;
}

/**
 * Helper function to format message with variables
 * Usage: formatMessage('Produto {name} adicionado', { name: 'Laptop' })
 */
export function formatMessage(message: string, variables: Record<string, any>): string {
  let formatted = message;
  Object.keys(variables).forEach(key => {
    formatted = formatted.replace(`{${key}}`, String(variables[key]));
  });
  return formatted;
}

export default Messages;
