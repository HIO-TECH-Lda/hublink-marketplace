# Mensagens Hardcoded Restantes

Este arquivo lista todas as mensagens hardcoded em inglês que ainda precisam ser migradas para português usando o sistema Messages.

**ÚLTIMA ATUALIZAÇÃO**: 29/01/2026 - Migração quase completa!

## ✅ Arquivos Atualizados Recentemente

- [x] authController.ts ✅ ATUALIZADO
- [x] middleware/auth.ts ✅ ATUALIZADO
- [x] productController.ts ✅ ATUALIZADO
- [x] cartController.ts ✅ ATUALIZADO
- [x] orderController.ts ✅ ATUALIZADO
- [x] paymentController.ts ✅ ATUALIZADO
- [x] wishlistController.ts ✅ ATUALIZADO
- [x] refundController.ts ✅ ATUALIZADO
- [x] reviewController.ts ✅ ATUALIZADO
- [x] categoryController.ts ✅ ATUALIZADO
- [x] adminProductController.ts ✅ ATUALIZADO
- [x] adminCategoryController.ts ✅ ATUALIZADO
- [x] adminUserController.ts ✅ ATUALIZADO
- [x] adminTicketController.ts ✅ ATUALIZADO
- [x] adminRefundController.ts ✅ ATUALIZADO
- [x] emailController.ts ✅ ATUALIZADO
- [x] financeController.ts ✅ ATUALIZADO
- [x] payoutController.ts ✅ ATUALIZADO
- [x] app.ts ✅ ATUALIZADO

## Arquivos com Mensagens Hardcoded

### Controllers Principais (CRÍTICO)
- [x] authController.ts ✅ ATUALIZADO
- [x] productController.ts ✅ ATUALIZADO  
- [x] cartController.ts ✅ ATUALIZADO
- [x] orderController.ts ✅ ATUALIZADO
- [ ] paymentController.ts ⏳ PENDENTE
- [ ] wishlistController.ts ⏳ PENDENTE
- [ ] refundController.ts ⏳ PENDENTE
- [ ] reviewController.ts ⏳ PENDENTE
- [ ] categoryController.ts ⏳ PENDENTE

### Controllers Admin
- [ ] adminProductController.ts ⏳ PENDENTE
- [ ] adminCategoryController.ts ⏳ PENDENTE
- [ ] adminUserController.ts ⏳ PENDENTE
- [ ] adminTicketController.ts ⏳ PENDENTE
- [ ] adminRefundController.ts ⏳ PENDENTE

### Outros
- [ ] emailController.ts ⏳ PENDENTE
- [ ] financeController.ts ⏳ PENDENTE
- [ ] payoutController.ts ⏳ PENDENTE
- [ ] middleware/auth.ts ✅ ATUALIZADO
- [ ] app.ts ⏳ PENDENTE

## Mensagens Encontradas por Arquivo

### paymentController.ts
- 'Refund processed successfully'
- 'Webhook signature verification failed'
- 'Webhook processed successfully'
- 'Payment not found' (várias ocorrências)
- 'Access denied' (várias ocorrências)
- 'Payment retrieved successfully'
- 'Payments retrieved successfully'
- 'Manual payment created successfully'
- 'Manual payment marked as completed'
- 'Payment statistics retrieved successfully'
- 'Payment analytics retrieved successfully'
- 'Payment performance data retrieved successfully'

### wishlistController.ts
- 'Wishlist retrieved successfully'
- 'Product added to wishlist successfully'
- 'Product ID is required' (várias ocorrências)
- 'Failed to remove from wishlist'
- 'Wishlist cleared successfully'
- 'Quantity must be at least 1'
- 'Failed to move to cart'
- 'Product IDs array is required and must not be empty'
- 'Failed to bulk remove from wishlist'
- 'Bulk add to wishlist completed'

### refundController.ts
- 'Refund statistics retrieved successfully'
- 'Failed to retrieve refund statistics'
- 'Refund not found' (várias ocorrências)
- 'Failed to retrieve refund' (várias ocorrências)
- 'Refund approved successfully' (várias ocorrências)
- 'Refund rejected successfully' (várias ocorrências)
- 'Refund request created successfully'

### reviewController.ts
- 'Review created successfully'
- 'Review updated successfully'
- 'Access denied. Admin only.' (várias ocorrências)
- 'User reviews retrieved successfully'
- 'Recent reviews retrieved successfully'
- 'Review analytics retrieved successfully'
- 'Review request sent successfully'
- 'Seller reviews retrieved successfully'

### categoryController.ts
- 'Category tree built successfully'
- 'Category updated successfully'
- 'Category not found or has children'
- 'Failed to retrieve category with product count'
- 'Category search completed successfully'

### adminProductController.ts
- 'Product updated successfully'
- 'Invalid status. Must be one of: draft, active, inactive, archived'
- 'Product deleted successfully'

### adminCategoryController.ts
- 'Category created successfully'
- 'Category updated successfully'
- 'Category status updated successfully'
- 'Category deleted successfully'

### adminUserController.ts
- 'User created successfully'
- 'User status updated successfully'
- 'User deleted successfully'

### adminTicketController.ts
- 'Ticket status updated successfully'
- 'User ID is required'
- 'Message added successfully'
- 'Ticket deleted successfully'

### adminRefundController.ts
- 'Refund rejected successfully'

### emailController.ts
- 'Email service test completed successfully'
- 'Email service test failed'
- 'To, subject, and template are required'
- 'Failed to send email'
- 'Email service status retrieved'
- 'Welcome email sent successfully'
- 'Email and reset token are required'
- 'Failed to send password reset email'

### financeController.ts
- 'Transaction retrieved successfully'
- 'Transaction deleted successfully'
- 'Either orderId or syncAll=true is required'

### payoutController.ts
- 'Payout requested successfully'
- 'Payout retrieved successfully'

### app.ts
- 'Too many requests from this IP, please try again later.'
- 'Txova Marketplace API is running'
- 'Welcome to Marketplace API'

## Próximos Passos

1. Adicionar mensagens faltantes em messages.ts
2. Atualizar cada arquivo sistematicamente
3. Verificar se há mais mensagens hardcoded
4. Testar compilação após cada atualização
