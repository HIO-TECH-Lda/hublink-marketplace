## Admin Audit Logs API

Complete API reference for audit logging and activity tracking.

## Base URL

```
/api/v1/admin/audit-logs
```

**Authentication:** All endpoints require admin authentication via `Authorization: Bearer <token>`

---

## Overview

The audit logging system tracks all CRUD operations (Create, Read, Update, Delete) across the platform, capturing:
- Who performed the action
- What entity was affected
- What changed (field-level changes)
- When it happened
- Additional metadata (IP address, user agent, etc.)

---

## Get Audit Logs

**GET** `/`

**Query Parameters:**
- `userId` (string, optional): Filter by user ID
- `entityType` (string, optional): Filter by entity type (e.g., `user`, `order`, `product`)
- `entityId` (string, optional): Filter by specific entity ID
- `action` (string, optional): Filter by action (`create`, `read`, `update`, `delete`)
- `startDate` (string, optional): Start date (ISO 8601)
- `endDate` (string, optional): End date (ISO 8601)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 50, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "507f1f77bcf86cd799439011",
        "user": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Helton Furau",
          "email": "helton@email.com",
          "role": "admin"
        },
        "action": "update",
        "entity": {
          "type": "order",
          "id": "507f1f77bcf86cd799439013",
          "name": "ORD-001"
        },
        "changes": [
          {
            "field": "status",
            "oldValue": "pending",
            "newValue": "confirmed"
          },
          {
            "field": "confirmedAt",
            "oldValue": null,
            "newValue": "2024-12-31T10:00:00.000Z"
          }
        ],
        "metadata": {
          "ipAddress": "192.168.1.1",
          "userAgent": "Mozilla/5.0...",
          "method": "PUT",
          "url": "/api/v1/admin/orders/507f1f77bcf86cd799439013",
          "statusCode": 200
        },
        "description": "Order status updated to confirmed",
        "createdAt": "2024-12-31T10:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439014",
        "user": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Helton Furau",
          "email": "helton@email.com",
          "role": "admin"
        },
        "action": "create",
        "entity": {
          "type": "product",
          "id": "507f1f77bcf86cd799439015",
          "name": "Tomates Orgânicos"
        },
        "changes": [],
        "metadata": {
          "ipAddress": "192.168.1.1",
          "userAgent": "Mozilla/5.0...",
          "method": "POST",
          "url": "/api/v1/admin/products",
          "statusCode": 201
        },
        "description": "New product created",
        "createdAt": "2024-12-31T09:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25
    }
  }
}
```

---

## Get Audit Log Statistics

**GET** `/statistics`

**Query Parameters:**
- `startDate` (string, optional): Start date (ISO 8601)
- `endDate` (string, optional): End date (ISO 8601)

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 1250,
    "byAction": {
      "create": 320,
      "read": 500,
      "update": 380,
      "delete": 50
    },
    "byEntityType": [
      {
        "entityType": "order",
        "count": 450
      },
      {
        "entityType": "product",
        "count": 280
      },
      {
        "entityType": "user",
        "count": 220
      },
      {
        "entityType": "category",
        "count": 150
      },
      {
        "entityType": "blog",
        "count": 100
      }
    ],
    "topUsers": [
      {
        "userId": "507f1f77bcf86cd799439012",
        "userName": "Helton Furau",
        "activityCount": 520
      },
      {
        "userId": "507f1f77bcf86cd799439013",
        "userName": "Maria Silva",
        "activityCount": 380
      }
    ]
  }
}
```

---

## Integration Guide

### Manual Logging

Use `AuditLogService` in your controllers:

```typescript
import { AuditLogService } from '../services/auditLogService';

// Simple logging
await AuditLogService.logFromRequest(
  req,
  'update',
  'order',
  orderId,
  order.orderNumber,
  [{ field: 'status', oldValue: 'pending', newValue: 'confirmed' }],
  'Order status updated to confirmed'
);

// Detect changes automatically
const changes = AuditLogService.detectChanges(oldOrder, newOrder);
await AuditLogService.logFromRequest(
  req,
  'update',
  'order',
  orderId,
  order.orderNumber,
  changes
);
```

### Logging Examples by Action

**Create:**
```typescript
await AuditLogService.logFromRequest(
  req,
  'create',
  'product',
  product._id.toString(),
  product.name,
  undefined,
  'New product created'
);
```

**Read:**
```typescript
await AuditLogService.logFromRequest(
  req,
  'read',
  'user',
  userId,
  user.email,
  undefined,
  'User profile viewed'
);
```

**Update:**
```typescript
const changes = AuditLogService.detectChanges(
  originalData,
  updatedData,
  ['name', 'price', 'stock'] // Fields to track
);
await AuditLogService.logFromRequest(
  req,
  'update',
  'product',
  productId,
  product.name,
  changes,
  'Product updated'
);
```

**Delete:**
```typescript
await AuditLogService.logFromRequest(
  req,
  'delete',
  'category',
  categoryId,
  category.name,
  undefined,
  'Category deleted'
);
```

---

## Entity Types

Common entity types tracked:
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

## TypeScript Interfaces

```typescript
interface AuditLog {
  id: string;
  user: {
    id?: string;
    name: string;
    email?: string;
    role?: string;
  };
  action: 'create' | 'read' | 'update' | 'delete';
  entity: {
    type: string;
    id: string;
    name?: string;
  };
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    method?: string;
    url?: string;
    statusCode?: number;
  };
  description?: string;
  createdAt: Date;
}

interface AuditLogStatistics {
  total: number;
  byAction: {
    create: number;
    read: number;
    update: number;
    delete: number;
  };
  byEntityType: Array<{
    entityType: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    activityCount: number;
  }>;
}
```

---

## Features

### Automatic Change Detection

The `detectChanges` method automatically compares objects and generates field-level changes:

```typescript
const changes = AuditLogService.detectChanges(oldData, newData);
// Returns: [{ field: 'status', oldValue: 'draft', newValue: 'published' }, ...]
```

### Sensitive Data Handling

- Passwords and sensitive fields are automatically excluded
- Long strings are truncated (>500 characters)
- Large arrays are summarized
- ObjectIds are converted to strings

### Non-blocking

Audit logging is designed to never break the main application flow:
- Errors are caught and logged internally
- Operations proceed even if logging fails

---

## Best Practices

1. **Always log administrative actions** - Especially updates and deletes
2. **Include entity names** - Makes logs more readable
3. **Add descriptions** - Provide context for the action
4. **Track specific fields** - Use `fieldsToTrack` parameter for focused tracking
5. **Use meaningful entity types** - Be consistent with naming
6. **Log sensitive operations** - Password changes, permission updates, etc.

---

## Common Use Cases

### Track User Changes
```typescript
// View all changes to a specific user
GET /api/v1/admin/audit-logs?entityType=user&entityId=507f1f77bcf86cd799439012

// Track all actions by a user
GET /api/v1/admin/audit-logs?userId=507f1f77bcf86cd799439012
```

### Security Auditing
```typescript
// View all delete operations
GET /api/v1/admin/audit-logs?action=delete&startDate=2024-12-01

// Track admin activities
GET /api/v1/admin/audit-logs?userRole=admin&startDate=2024-12-01
```

### Compliance Reporting
```typescript
// Get all logs for a specific period
GET /api/v1/admin/audit-logs?startDate=2024-01-01&endDate=2024-12-31

// Export statistics
GET /api/v1/admin/audit-logs/statistics?startDate=2024-01-01&endDate=2024-12-31
```

---

## Nice to Have Features

1. **Real-time Alerts** - Notify admins of suspicious activities
2. **Automated Reports** - Weekly/monthly audit reports
3. **Export Capabilities** - Export logs to CSV/PDF
4. **Advanced Filtering** - More filter options (user role, IP range)
5. **Log Retention Policies** - Automatic archiving of old logs
6. **Compliance Templates** - Pre-built reports for regulations (GDPR, HIPAA)
7. **Visual Timeline** - Graphical view of activities
8. **Anomaly Detection** - Flag unusual patterns
9. **Restore Functionality** - Rollback changes from audit logs
10. **Integration Webhooks** - Send logs to external systems

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

**Common Status Codes:**
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `500`: Internal Server Error

---

## Notes

- All dates are in ISO 8601 format (UTC)
- Audit logs are immutable (cannot be edited or deleted)
- Default retention period is indefinite (configure as needed)
- Logs are indexed for fast querying
- Sensitive fields are automatically excluded (password, tokens, etc.)
- System actions (automated processes) may have no userId
- IP addresses may be IPv4 or IPv6 format
- User agent strings are stored as-is from the request

