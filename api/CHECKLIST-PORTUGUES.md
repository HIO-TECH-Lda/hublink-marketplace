# ✅ Checklist: Migração para Português

## 🔴 FASE 1 - CRÍTICO (APIs Públicas)

### Controllers + Services
- [ ] **authController.ts** + authService.ts
  - Login, registro, perfil, senha
  
- [ ] **productController.ts** + productService.ts
  - Listagem, detalhes, produtos em destaque
  
- [ ] **orderController.ts** + orderService.ts
  - Criar, consultar, histórico de pedidos
  
- [ ] **cartController.ts** + cartService.ts
  - Adicionar, remover, atualizar, limpar
  
- [ ] **paymentController.ts** + paymentService.ts
  - Processar pagamentos, callbacks

### Middleware
- [ ] **auth.ts**
  - Token inválido, não autorizado

---

## 🟡 FASE 2 - ALTA (APIs Públicas Secundárias)

- [ ] **wishlistController.ts** + wishlistService.ts
- [ ] **ticketController.ts** + ticketService.ts
- [ ] **refundController.ts** + refundService.ts
- [ ] **categoryController.ts** + categoryService.ts
- [ ] **contactController.ts** (verificar se já está em PT)
- [ ] **publicNewsletterController.ts** + Service

---

## 🟢 FASE 3 - MÉDIA (Admin)

### Gestão de Produtos
- [ ] **adminProductController.ts** + adminProductService.ts
- [ ] **adminCategoryController.ts** + adminCategoryService.ts

### Gestão de Pedidos
- [ ] **adminOrderController.ts** + adminOrderService.ts
- [ ] **adminRefundController.ts** + adminRefundService.ts

### Gestão de Usuários
- [ ] **adminUserController.ts** + adminUserService.ts
- [ ] **adminSellerController.ts** + adminSellerService.ts

### Suporte
- [ ] **adminTicketController.ts** + adminTicketService.ts
- [ ] **adminNewsletterController.ts** + adminNewsletterService.ts

### Relatórios
- [ ] **adminReportsController.ts** + adminReportsService.ts
- [ ] **adminAuditLogController.ts** + auditLogService.ts

---

## 🔵 FASE 4 - BAIXA (Específicos)

- [ ] **dashboardController.ts** + dashboardService.ts
- [ ] **financeController.ts** + financeService.ts
- [ ] **payoutController.ts** + payoutService.ts
- [ ] **imaliController.ts**
- [ ] **emailController.ts** + emailService.ts
- [ ] **newsletterService.ts**
- [ ] **publicNewsletterService.ts**

---

## ⚪ FASE 5 - FINALIZAÇÃO

- [ ] **errorHandler.ts** (middleware)
- [ ] **validation.ts** (mensagens de validação)
- [ ] Testes completos
- [ ] Verificação final

---

## ✅ CONCLUÍDO

### Controllers
- [x] **adminBlogController.ts**
- [x] **reviewController.ts**
- [x] **sellerController.ts**
- [x] **blogController.ts**

### Services
- [x] **adminBlogService.ts**
- [x] **reviewService.ts**
- [x] **sellerService.ts**
- [x] **blogService.ts**
- [x] **contactService.ts**

---

## 📊 Progresso Total

- **Concluídos**: 9/56 arquivos (16%)
- **Fase 1 (Crítico)**: 0/11 arquivos (0%)
- **Fase 2 (Alta)**: 0/11 arquivos (0%)
- **Fase 3 (Média)**: 0/21 arquivos (0%)
- **Fase 4 (Baixa)**: 0/13 arquivos (0%)

---

## 🎯 Próxima Ação

**INICIAR FASE 1 - CRÍTICO**

1. authController.ts
2. productController.ts
3. orderController.ts
4. cartController.ts
5. paymentController.ts

**Comando para iniciar**:
```bash
# Abrir arquivo
code src/controllers/authController.ts

# Adicionar import
import Messages from '../utils/messages';

# Substituir mensagens usando buscar e substituir
```

---

**Última Atualização**: 29/01/2026
