# Audit Log Configuration Guide

## Overview

The audit logging system is configured to automatically track **ALL operations** across **ALL models** in the system, regardless of user or role.

---

## Automatic Tracking

### Global Middleware

A global middleware (`src/middleware/auditLog.ts`) automatically intercepts and logs:

- **POST** requests → `create` actions
- **PUT/PATCH** requests → `update` actions  
- **DELETE** requests → `delete` actions
- **GET** requests → `read` actions (currently disabled by default for performance)

### What Gets Logged Automatically

✅ **Authentication Events:**
- ✅ Login attempts (successful and failed)
- ✅ User registration
- ✅ Logout
- ✅ Password changes
- ✅ Password reset requests (forgot password)
- ✅ Password reset completions (with token)
- ✅ Failed password reset attempts
- ✅ Token refresh

✅ **Admin Operations:**
- User management (create, update, delete, status changes)
- Order management (updates, status changes)
- Product management (create, update, delete, status changes)
- Category management (create, update, delete)
- Seller management (create, update, status changes)
- Blog management (create, update, delete, status changes)
- Newsletter management (subscribers, campaigns)
- Ticket management (create, update, status changes)
- Refund management (approve, reject)

✅ **Seller Operations:**
- Product creation and updates
- Order fulfillment
- Inventory updates
- Profile updates

✅ **Buyer Operations:**
- Order placement
- Profile updates
- Review submissions
- Support ticket creation
- Newsletter subscriptions

✅ **Support Operations:**
- Ticket responses
- Status updates

✅ **System Operations:**
- Automated processes (if they use the API)
- Background jobs (if they use the API)

---

## Configuration Options

### Enable/Disable Read Operation Logging

By default, `GET` requests (read operations) are **NOT** logged to reduce database load. To enable:

**File:** `src/middleware/auditLog.ts`

```typescript
// CHANGE THIS:
if (req.method === 'GET') {
  return next();
}

// TO THIS (uncomment the block):
// if (req.method === 'GET') {
//   return next();
// }
```

### Exclude Specific Routes

Add routes to the exclusion list:

**File:** `src/middleware/auditLog.ts`

```typescript
const EXCLUDED_ROUTES = [
  '/api/v1/health',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/admin/audit-logs',
  '/api/v1/admin/reports',
  '/api/v1/your-route-here' // Add your route
];
```

### Track Additional Entity Types

The middleware automatically extracts entity types from URLs. For custom patterns, update:

**File:** `src/middleware/auditLog.ts`

```typescript
// Add your custom URL pattern matching
const customMatch = path.match(/your-pattern-here/);
```

---

## What Gets Captured

For each operation, the following is logged:

### User Information
- User ID
- User name
- User email
- User role

### Action Information
- Action type (`create`, `read`, `update`, `delete`)
- Entity type (e.g., `user`, `order`, `product`)
- Entity ID
- Entity name (for readability)

### Change Tracking
- Field-level changes (for updates)
- Old values
- New values

### Metadata
- IP address
- User agent (browser/client)
- HTTP method
- Full URL
- Response status code
- Timestamp

---

## Viewing Audit Logs

### Via API

**Get all logs:**
```
GET /api/v1/admin/audit-logs
```

**Filter by entity:**
```
GET /api/v1/admin/audit-logs?entityType=user
GET /api/v1/admin/audit-logs?entityType=order
GET /api/v1/admin/audit-logs?entityType=product
```

**Filter by user:**
```
GET /api/v1/admin/audit-logs?userId=507f1f77bcf86cd799439011
```

**Filter by action:**
```
GET /api/v1/admin/audit-logs?action=delete
GET /api/v1/admin/audit-logs?action=update
```

**Filter by date range:**
```
GET /api/v1/admin/audit-logs?startDate=2024-01-01&endDate=2024-12-31
```

**Get statistics:**
```
GET /api/v1/admin/audit-logs/statistics
```

---

## Performance Considerations

### Database Impact

- **Async Logging:** All logging happens asynchronously after the response is sent
- **Non-blocking:** Failed logging never affects the main application
- **Indexed:** The AuditLog collection has optimized indexes for fast queries

### Storage Impact

Audit logs grow over time. Consider:

1. **Archiving:** Move old logs to cold storage
2. **Retention Policy:** Delete logs older than X months/years
3. **Aggregation:** Summarize old logs before deletion

### Recommended Retention Policies

- **Production:** 1-2 years
- **Staging:** 3-6 months
- **Development:** 1 month

---

## Manual Logging Enhancement

For more detailed logging with change detection, manually add logging in controllers:

```typescript
import { AuditLogService } from '../services/auditLogService';

// In your controller
const oldData = await Model.findById(id);
const updatedData = await Model.findByIdAndUpdate(id, updateData);

const changes = AuditLogService.detectChanges(
  oldData,
  updatedData,
  ['field1', 'field2', 'field3'] // Specific fields to track
);

await AuditLogService.logFromRequest(
  req,
  'update',
  'your_entity_type',
  id,
  entityName,
  changes,
  'Detailed description'
);
```

---

## Compliance & Security

### GDPR Compliance

Audit logs may contain personal data. Ensure:
- Proper data retention policies
- Secure access controls (admin only)
- Data anonymization for long-term storage

### Security Benefits

- **Accountability:** Track who did what and when
- **Forensics:** Investigate security incidents
- **Compliance:** Meet regulatory requirements
- **Debugging:** Trace issues back to specific actions

---

## Monitoring Recommendations

### Set Up Alerts For:

1. **High-Risk Actions:**
   - User deletions
   - Role changes
   - Permission updates
   - Bulk operations

2. **Unusual Patterns:**
   - Multiple failed operations
   - Operations outside business hours
   - High-volume operations from single user

3. **Security Events:**
   - Admin account modifications
   - Password changes
   - Status changes (active ↔ suspended)

---

## Example Queries

### Find All Admin Actions
```
GET /api/v1/admin/audit-logs?userRole=admin
```

### Find All Deletions
```
GET /api/v1/admin/audit-logs?action=delete
```

### Track Changes to Specific Order
```
GET /api/v1/admin/audit-logs?entityType=orders&entityId=507f1f77bcf86cd799439011
```

### Activity Report for User
```
GET /api/v1/admin/audit-logs?userId=507f1f77bcf86cd799439011&startDate=2024-01-01
```

### Recent Activity (Last 24 Hours)
```javascript
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

GET /api/v1/admin/audit-logs?startDate=${yesterday.toISOString()}
```

---

## Troubleshooting

### Logs Not Appearing

1. **Check middleware order:** Audit middleware must be after body parsers
2. **Check excluded routes:** Ensure route is not in exclusion list
3. **Check response status:** Only 2xx responses are logged
4. **Check database connection:** Ensure MongoDB is connected

### Performance Issues

1. **Disable read logging:** Comment out GET request logging
2. **Add more exclusions:** Exclude high-volume routes
3. **Optimize indexes:** Ensure AuditLog indexes are created
4. **Archive old logs:** Move old data to separate collection

---

## Best Practices

1. ✅ **Review logs regularly** - Monitor for unusual patterns
2. ✅ **Set up retention policies** - Don't store logs indefinitely
3. ✅ **Secure access** - Only admins should view logs
4. ✅ **Add manual logging** - For critical operations needing detail
5. ✅ **Monitor storage** - Track audit log collection size
6. ✅ **Test logging** - Verify logs are created for important operations
7. ✅ **Document entity types** - Keep consistent naming conventions
8. ✅ **Archive before deleting** - Export logs before cleanup

---

## Current Status

✅ **Enabled:** Automatic logging for all POST, PUT, PATCH, DELETE operations across ALL models
✅ **Enabled:** Authentication tracking (login, logout, registration, password changes)
❌ **Disabled:** Automatic logging for GET operations (can be enabled for read tracking)
✅ **Manual Enhancement:** Available in seller management controller for detailed change tracking
✅ **Global Coverage:** All users and roles are tracked (buyers, sellers, admins, support, guests)

---

## Next Steps

For enhanced logging with detailed change tracking, consider adding manual logging to:
- User management controllers
- Order management controllers  
- Product management controllers
- Payment controllers
- Refund controllers

See `docs/AUDIT_LOG_USAGE_EXAMPLES.md` for integration examples.

