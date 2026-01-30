# 📋 Arquivos Faltando Atualizar para Português

## 🔴 Prioridade CRÍTICA (APIs Públicas - Usuários Finais)

### Controllers
1. **authController.ts** ⚠️ CRÍTICO
   - Login, registro, recuperação de senha
   - Perfil do usuário
   - ~10 mensagens

2. **productController.ts** ⚠️ CRÍTICO
   - Listagem de produtos
   - Detalhes do produto
   - Produtos em destaque
   - ~10+ mensagens

3. **orderController.ts** ⚠️ CRÍTICO
   - Criar pedidos
   - Consultar pedidos
   - Histórico de pedidos
   - ~10+ mensagens

4. **cartController.ts** ⚠️ CRÍTICO
   - Adicionar/remover itens
   - Atualizar carrinho
   - Limpar carrinho
   - ~10 mensagens

5. **paymentController.ts** ⚠️ CRÍTICO
   - Processar pagamentos
   - Callback de pagamento
   - ~8+ mensagens

### Services
6. **authService.ts**
   - Erros de autenticação
   - Validações de login/registro

7. **productService.ts**
   - Erros de produto não encontrado
   - Validações de estoque

8. **orderService.ts**
   - Erros de pedido
   - Validações de status

9. **cartService.ts**
   - Erros de carrinho
   - Validações de itens

10. **paymentService.ts**
    - Erros de pagamento
    - Validações de transação

### Middleware
11. **auth.ts** ⚠️
    - Token inválido/expirado
    - Não autorizado
    - ~5 mensagens

## 🟡 Prioridade ALTA (APIs Públicas - Secundárias)

### Controllers
12. **wishlistController.ts**
    - Lista de desejos
    - ~6 mensagens

13. **ticketController.ts**
    - Suporte ao cliente
    - ~8 mensagens

14. **refundController.ts**
    - Solicitações de reembolso
    - ~6 mensagens

15. **categoryController.ts**
    - Categorias de produtos
    - ~4 mensagens

16. **contactController.ts**
    - Já pode estar em PT (verificar)
    - ~3 mensagens

17. **publicNewsletterController.ts**
    - Inscrição newsletter
    - ~3 mensagens

### Services
18. **wishlistService.ts**
19. **ticketService.ts**
20. **refundService.ts**
21. **categoryService.ts**

## 🟢 Prioridade MÉDIA (APIs Admin)

### Controllers
22. **adminProductController.ts**
    - Gerenciar produtos (admin)
    - ~15 mensagens

23. **adminOrderController.ts**
    - Gerenciar pedidos (admin)
    - ~12 mensagens

24. **adminUserController.ts**
    - Gerenciar usuários (admin)
    - ~10 mensagens

25. **adminSellerController.ts**
    - Gerenciar vendedores (admin)
    - ~10 mensagens

26. **adminRefundController.ts**
    - Gerenciar reembolsos (admin)
    - ~8 mensagens

27. **adminTicketController.ts**
    - Gerenciar tickets (admin)
    - ~8 mensagens

28. **adminCategoryController.ts**
    - Gerenciar categorias (admin)
    - ~6 mensagens

29. **adminNewsletterController.ts**
    - Gerenciar newsletter (admin)
    - ~6 mensagens

30. **adminReportsController.ts**
    - Relatórios (admin)
    - ~5 mensagens

31. **adminAuditLogController.ts**
    - Logs de auditoria (admin)
    - ~4 mensagens

### Services
32. **adminProductService.ts**
33. **adminOrderService.ts**
34. **adminUserService.ts**
35. **adminSellerService.ts**
36. **adminRefundService.ts**
37. **adminTicketService.ts**
38. **adminCategoryService.ts**
39. **adminNewsletterService.ts**
40. **adminReportsService.ts**
41. **auditLogService.ts**

## 🔵 Prioridade BAIXA (Utilitários/Específicos)

### Controllers
42. **dashboardController.ts**
    - Dashboard stats
    - ~5 mensagens

43. **financeController.ts**
    - Finanças do vendedor
    - ~10 mensagens

44. **payoutController.ts**
    - Pagamentos aos vendedores
    - ~6 mensagens

45. **imaliController.ts**
    - Gateway de pagamento iMali
    - ~8 mensagens

46. **emailController.ts**
    - Envio de emails
    - ~3 mensagens

47. **testController.ts**
    - Testes (pode ignorar)
    - ~2 mensagens

### Services
48. **financeService.ts**
49. **payoutService.ts**
50. **emailService.ts**
51. **dashboardService.ts**
52. **newsletterService.ts**
53. **publicNewsletterService.ts**
54. **sellerRatingService.ts** (verificar se tem mensagens user-facing)

## ⚪ Outros

### Middleware
55. **errorHandler.ts**
    - Mensagens de erro genéricas
    - IMPORTANTE para UX

### Validators
56. **Validation schemas** (src/utils/validation.ts)
    - Mensagens de validação
    - Podem já estar em PT

## 📊 Resumo

### Totais
- **Total de arquivos**: ~56 arquivos
- **Já atualizados**: 9 arquivos (16%)
- **Prioridade CRÍTICA**: 11 arquivos (20%)
- **Prioridade ALTA**: 11 arquivos (20%)
- **Prioridade MÉDIA**: 21 arquivos (37%)
- **Prioridade BAIXA**: 13 arquivos (23%)

### Estimativa de Mensagens
- **Críticas**: ~70-100 mensagens
- **Altas**: ~40-60 mensagens
- **Médias**: ~100-150 mensagens
- **Baixas**: ~40-60 mensagens
- **TOTAL**: ~250-370 mensagens restantes

## 🎯 Plano de Ação Recomendado

### Fase 1 - Crítico (1-2 dias)
1. authController + authService
2. productController + productService
3. orderController + orderService
4. cartController + cartService
5. paymentController + paymentService
6. middleware/auth.ts

### Fase 2 - Alto (1 dia)
7. wishlistController + Service
8. ticketController + Service
9. refundController + Service
10. categoryController + Service
11. newsletterController + Service

### Fase 3 - Médio (2-3 dias)
12. Todos os adminControllers
13. Todos os adminServices

### Fase 4 - Baixo (1 dia)
14. Controllers específicos (finance, payout, imali)
15. Services restantes

### Fase 5 - Finalização
16. errorHandler middleware
17. Validação de mensagens
18. Testes completos

## 🚀 Como Proceder

Para cada arquivo:

1. **Adicionar import**:
```typescript
import Messages from '../utils/messages';
```

2. **Substituir mensagens**:
```typescript
// Antes
message: 'Product created successfully'

// Depois
message: Messages.PRODUCT.CREATED
```

3. **Substituir erros**:
```typescript
// Antes
throw new Error('Product not found')

// Depois
throw new Error(Messages.PRODUCT.NOT_FOUND)
```

4. **Testar**:
```bash
npm run lint
npm test
```

## 📝 Notas

- ✅ Sistema de mensagens já implementado
- ✅ Todas as mensagens disponíveis em `src/utils/messages.ts`
- ✅ Documentação completa em `PORTUGUESE-MESSAGES-GUIDE.md`
- ⚠️ Priorize controllers públicos antes dos admin
- ⚠️ Teste cada módulo após atualização

---

**Criado**: 29/01/2026  
**Status**: Lista completa de pendências  
**Próximo**: Iniciar Fase 1 (Crítico)
