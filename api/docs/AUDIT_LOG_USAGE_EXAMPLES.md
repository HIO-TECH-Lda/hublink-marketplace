# Audit Log Integration Examples

Quick reference for integrating audit logging into your controllers.

## Import

```typescript
import { AuditLogService } from '../services/auditLogService';
```

---

## Example 1: Create Operation

```typescript
static async createProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await ProductService.createProduct(req.body);
    
    // Log the creation
    await AuditLogService.logFromRequest(
      req,
      'create',
      'product',
      product._id.toString(),
      product.name,
      undefined,
      'New product created'
    );
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Example 2: Update with Change Tracking

```typescript
static async updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    
    // Get original data
    const originalProduct = await Product.findById(productId).lean();
    
    // Update
    const updatedProduct = await ProductService.updateProduct(productId, req.body);
    
    // Detect and log changes
    const changes = AuditLogService.detectChanges(
      originalProduct,
      updatedProduct,
      ['name', 'price', 'stock', 'status'] // Track specific fields
    );
    
    await AuditLogService.logFromRequest(
      req,
      'update',
      'product',
      productId,
      updatedProduct.name,
      changes,
      'Product updated'
    );
    
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Example 3: Delete Operation

```typescript
static async deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    await CategoryService.deleteCategory(categoryId);
    
    // Log the deletion
    await AuditLogService.logFromRequest(
      req,
      'delete',
      'category',
      categoryId,
      category?.name,
      undefined,
      'Category deleted'
    );
    
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Example 4: Status Update (Quick Action)

```typescript
static async updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(orderId);
    const oldStatus = order.status;
    
    order.status = status;
    await order.save();
    
    // Log status change
    await AuditLogService.logFromRequest(
      req,
      'update',
      'order',
      orderId,
      order.orderNumber,
      [{
        field: 'status',
        oldValue: oldStatus,
        newValue: status
      }],
      `Order status changed from ${oldStatus} to ${status}`
    );
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Example 5: Read Operation (Optional)

```typescript
static async getUser(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);
    
    // Optional: Log sensitive reads
    if ((req as any).user?.role === 'admin') {
      await AuditLogService.logFromRequest(
        req,
        'read',
        'user',
        userId,
        user.email,
        undefined,
        'User profile viewed by admin'
      );
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Example 6: Bulk Operations

```typescript
static async bulkUpdateProducts(req: Request, res: Response): Promise<void> {
  try {
    const { productIds, updates } = req.body;
    
    for (const productId of productIds) {
      const product = await Product.findByIdAndUpdate(productId, updates);
      
      // Log each update
      await AuditLogService.logFromRequest(
        req,
        'update',
        'product',
        productId,
        product?.name,
        Object.entries(updates).map(([field, value]) => ({
          field,
          oldValue: (product as any)?.[field],
          newValue: value
        })),
        'Bulk product update'
      );
    }
    
    res.json({ success: true, message: 'Products updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Entity Type Reference

Use these consistent entity types:

- `user` - User accounts
- `order` - Orders
- `product` - Products
- `category` - Categories
- `seller` - Sellers
- `blog` - Blog posts
- `newsletter_subscriber` - Newsletter subscribers
- `newsletter_campaign` - Newsletter campaigns
- `ticket` - Support tickets
- `refund` - Refunds
- `payment` - Payments

---

## Tips

1. **Track Important Fields Only**: Don't track every field, focus on business-critical data
2. **Meaningful Descriptions**: Add context that helps understand the action
3. **Non-blocking**: Audit logging never throws errors that break your main flow
4. **Entity Names**: Include entity names (order numbers, product names) for readability
5. **Sensitive Operations**: Always log security-related actions (password changes, role updates)

