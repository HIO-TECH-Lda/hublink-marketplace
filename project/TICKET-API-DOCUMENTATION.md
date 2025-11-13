# Ticket System API Documentation

**Version:** 1.0  
**Last Updated:** 2024  
**Base URL:** `/api/v1/tickets`

---

## Table of Contents

1. [Overview](#overview)
2. [Data Models](#data-models)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [File Upload](#file-upload)
6. [Error Handling](#error-handling)
7. [Business Logic Requirements](#business-logic-requirements)

---

## Overview

The Ticket System API allows users (buyers, sellers, and admins) to create, manage, and track support tickets. The system supports:

- Ticket creation with categories, priorities, and attachments
- Threaded conversations (messages) within tickets
- File attachments for tickets and messages
- Status tracking and assignment to support agents
- Filtering, searching, and pagination
- Internal notes (not visible to end users)

---

## Data Models

### Ticket Model

```typescript
interface Ticket {
  _id: string;                    // MongoDB ObjectId
  title: string;                  // Required, max 200 chars
  description: string;            // Required, max 5000 chars
  category: TicketCategory;      // Required, enum
  priority: TicketPriority;       // Required, enum
  status: TicketStatus;           // Required, enum, default: 'open'
  userId: ObjectId;               // Required, ref: users
  userType: 'buyer' | 'seller' | 'admin';  // Required
  assignedTo?: ObjectId;          // Optional, ref: users (support agent)
  orderId?: ObjectId;             // Optional, ref: orders
  productId?: ObjectId;           // Optional, ref: products
  tags: string[];                 // Array of strings, max 10 tags
  attachments: TicketAttachment[]; // Array of attachments
  messages: TicketMessage[];       // Array of messages
  createdAt: Date;                // Auto-generated
  updatedAt: Date;                // Auto-updated
}
```

### TicketMessage Model

```typescript
interface TicketMessage {
  _id: string;                    // MongoDB ObjectId
  ticketId: ObjectId;             // Required, ref: tickets
  userId: ObjectId;               // Required, ref: users
  userType: 'buyer' | 'seller' | 'admin' | 'support';  // Required
  message: string;                // Required, max 5000 chars
  isInternal: boolean;            // Default: false (if true, not visible to end user)
  attachments: TicketAttachment[]; // Array of attachments
  createdAt: Date;                // Auto-generated
}
```

### TicketAttachment Model

```typescript
interface TicketAttachment {
  _id: string;                    // MongoDB ObjectId
  ticketId: ObjectId;             // Required, ref: tickets
  messageId?: ObjectId;            // Optional, ref: ticket_messages (if attached to message)
  fileName: string;                // Required
  fileUrl: string;                 // Required, full URL to file
  fileSize: number;                // Required, in bytes
  mimeType: string;               // Required, e.g., 'image/jpeg', 'application/pdf'
  uploadedAt: Date;               // Auto-generated
}
```

### Enums

```typescript
enum TicketCategory {
  TECHNICAL_ISSUE = 'technical_issue',
  PAYMENT_PROBLEM = 'payment_problem',
  ORDER_ISSUE = 'order_issue',
  RETURN_REQUEST = 'return_request',
  ACCOUNT_ISSUE = 'account_issue',
  PRODUCT_ISSUE = 'product_issue',
  SHIPPING_PROBLEM = 'shipping_problem',
  GENERAL_INQUIRY = 'general_inquiry',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report'
}

enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_USER = 'waiting_for_user',
  WAITING_FOR_THIRD_PARTY = 'waiting_for_third_party',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}
```

---

## Authentication & Authorization

### Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Authorization Rules

1. **Buyers/Sellers:**
   - Can create tickets
   - Can view only their own tickets
   - Can add messages to their own tickets
   - Cannot view internal messages (`isInternal: true`)

2. **Support Agents/Admins:**
   - Can view all tickets
   - Can update ticket status and assign tickets
   - Can add messages (including internal messages)
   - Can view all messages (including internal)

3. **Validation:**
   - `orderId` must belong to the user if provided
   - `productId` must exist if provided
   - Users cannot modify tickets created by others (except admins)

---

## API Endpoints

### 1. Create Ticket

**POST** `/api/v1/tickets`

**Request Body:**
```json
{
  "title": "Problema com pagamento M-Pesa",
  "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
  "category": "payment_problem",
  "priority": "high",
  "orderId": "65a1b2c3d4e5f6g7h8i9j0k1",  // Optional
  "productId": "65a1b2c3d4e5f6g7h8i9j0k2", // Optional
  "tags": ["pagamento", "mpesa"]            // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "title": "Problema com pagamento M-Pesa",
    "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
    "category": "payment_problem",
    "priority": "high",
    "status": "open",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@example.com"
    },
    "userType": "buyer",
    "assignedTo": null,
    "orderId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "orderNumber": "ORD-001"
    },
    "productId": null,
    "tags": ["pagamento", "mpesa"],
    "attachments": [],
    "messages": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "ticketId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "userId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
          "firstName": "João",
          "lastName": "Silva"
        },
        "userType": "buyer",
        "message": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
        "isInternal": false,
        "attachments": [],
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Validation:**
- `title`: Required, string, 3-200 characters
- `description`: Required, string, 10-5000 characters
- `category`: Required, must be valid enum value
- `priority`: Required, must be valid enum value
- `orderId`: Optional, must be valid ObjectId and belong to user
- `productId`: Optional, must be valid ObjectId
- `tags`: Optional, array of strings, max 10 tags, each max 50 chars

**Business Logic:**
- Automatically create first message with ticket description
- Set initial status to `open`
- Auto-assign to support agent based on category (if available)
- Send notification email to support team

---

### 2. Get User Tickets

**GET** `/api/v1/tickets/my-tickets`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `status` (optional): Filter by status (enum value)
- `category` (optional): Filter by category (enum value)
- `priority` (optional): Filter by priority (enum value)
- `search` (optional): Search in title and description
- `sortBy` (optional, default: 'createdAt'): Sort field ('createdAt', 'updatedAt', 'priority')
- `sortOrder` (optional, default: 'desc'): Sort order ('asc' | 'desc')

**Example:**
```
GET /api/v1/tickets/my-tickets?page=1&limit=20&status=open&category=payment_problem&search=mpesa&sortBy=createdAt&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "title": "Problema com pagamento M-Pesa",
        "description": "Não consegui finalizar o pagamento...",
        "category": "payment_problem",
        "priority": "high",
        "status": "open",
        "orderId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
          "orderNumber": "ORD-001"
        },
        "messages": [
          {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
            "message": "Não consegui finalizar...",
            "createdAt": "2024-01-20T10:30:00.000Z"
          }
        ],
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Authorization:**
- Returns only tickets where `userId` matches authenticated user
- Excludes internal messages (`isInternal: true`) for non-admin users

---

### 3. Get Single Ticket

**GET** `/api/v1/tickets/:ticketId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "title": "Problema com pagamento M-Pesa",
    "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
    "category": "payment_problem",
    "priority": "high",
    "status": "open",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@example.com"
    },
    "userType": "buyer",
    "assignedTo": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "firstName": "Maria",
      "lastName": "Santos",
      "email": "maria@support.com"
    },
    "orderId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "orderNumber": "ORD-001"
    },
    "productId": null,
    "tags": ["pagamento", "mpesa"],
    "attachments": [],
    "messages": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "ticketId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "userId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
          "firstName": "João",
          "lastName": "Silva"
        },
        "userType": "buyer",
        "message": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
        "isInternal": false,
        "attachments": [],
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Authorization:**
- Users can only view their own tickets (unless admin/support)
- Internal messages (`isInternal: true`) are excluded for non-admin users

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Ticket not found"
}
```

**Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "You don't have permission to view this ticket"
}
```

---

### 4. Update Ticket

**PATCH** `/api/v1/tickets/:ticketId`

**Request Body (all fields optional):**
```json
{
  "status": "in_progress",
  "priority": "urgent",
  "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k6",
  "tags": ["pagamento", "mpesa", "urgente"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "title": "Problema com pagamento M-Pesa",
    "status": "in_progress",
    "priority": "urgent",
    "assignedTo": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "firstName": "Maria",
      "lastName": "Santos"
    },
    "tags": ["pagamento", "mpesa", "urgente"],
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

**Authorization:**
- Only admins/support agents can update tickets
- Users cannot update their own tickets (except closing resolved tickets)

**Validation:**
- `status`: Must be valid enum value
- `priority`: Must be valid enum value
- `assignedTo`: Must be valid ObjectId of a support agent/admin
- `tags`: Array of strings, max 10 tags

**Business Logic:**
- Update `updatedAt` timestamp
- Send notification if status changes
- Send notification if ticket is assigned
- Log status changes for audit trail

---

### 5. Add Message to Ticket

**POST** `/api/v1/tickets/:ticketId/messages`

**Request Body:**
```json
{
  "message": "Aparece 'Erro de conexão. Tente novamente.' quando clico em pagar.",
  "isInternal": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
    "ticketId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "firstName": "João",
      "lastName": "Silva"
    },
    "userType": "buyer",
    "message": "Aparece 'Erro de conexão. Tente novamente.' quando clico em pagar.",
    "isInternal": false,
    "attachments": [],
    "createdAt": "2024-01-20T11:30:00.000Z"
  }
}
```

**Validation:**
- `message`: Required, string, 1-5000 characters
- `isInternal`: Optional, boolean, default: false
- Only admins/support can set `isInternal: true`

**Business Logic:**
- Update ticket `updatedAt` timestamp
- If user sends message, set status to `waiting_for_user` (if currently `waiting_for_user` or `in_progress`)
- If support sends message, set status to `in_progress` (if currently `open` or `waiting_for_user`)
- Send notification to opposite party (user ↔ support)
- Cannot add messages to closed tickets (unless admin)

---

### 6. Get All Tickets (Admin/Support)

**GET** `/api/v1/tickets`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority
- `assignedTo` (optional): Filter by assigned agent ID
- `userId` (optional): Filter by ticket creator ID
- `search` (optional): Search in title and description
- `sortBy` (optional, default: 'createdAt'): Sort field
- `sortOrder` (optional, default: 'desc'): Sort order

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "title": "Problema com pagamento M-Pesa",
        "category": "payment_problem",
        "priority": "high",
        "status": "open",
        "userId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
          "firstName": "João",
          "lastName": "Silva"
        },
        "assignedTo": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
          "firstName": "Maria",
          "lastName": "Santos"
        },
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

**Authorization:**
- Only admins and support agents can access this endpoint
- Returns all tickets with all messages (including internal)

---

### 7. Get Ticket Statistics

**GET** `/api/v1/tickets/statistics`

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `category` (optional): Filter by category
- `assignedTo` (optional): Filter by assigned agent

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "open": 25,
      "in_progress": 15,
      "waiting_for_user": 10,
      "waiting_for_third_party": 5,
      "resolved": 80,
      "closed": 15
    },
    "byCategory": {
      "payment_problem": 30,
      "order_issue": 25,
      "technical_issue": 20,
      "shipping_problem": 15,
      "return_request": 10,
      "product_issue": 10,
      "account_issue": 10,
      "general_inquiry": 10,
      "bug_report": 10,
      "feature_request": 10
    },
    "byPriority": {
      "low": 50,
      "medium": 60,
      "high": 30,
      "urgent": 10
    },
    "averageResponseTime": 3600,  // seconds
    "averageResolutionTime": 86400  // seconds
  }
}
```

**Authorization:**
- Only admins and support agents can access this endpoint

---

### 8. Delete Ticket

**DELETE** `/api/v1/tickets/:ticketId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

**Authorization:**
- Only admins can delete tickets
- Soft delete recommended (set `deletedAt` timestamp instead of hard delete)

---

## File Upload

### Upload Ticket Attachment

**POST** `/api/v1/tickets/:ticketId/attachments`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (required)
- `messageId`: ObjectId (optional, if attaching to a specific message)

**File Constraints:**
- Max file size: 5MB per file
- Allowed types: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`
- Max files per ticket: 10
- Max files per message: 5

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "ticketId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "messageId": null,
    "fileName": "screenshot.png",
    "fileUrl": "https://cdn.example.com/tickets/attachments/65a1b2c3d4e5f6g7h8i9j0k8.png",
    "fileSize": 245760,
    "mimeType": "image/png",
    "uploadedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### Upload Message Attachment

**POST** `/api/v1/tickets/:ticketId/messages/:messageId/attachments`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (required)

**Response:** Same as ticket attachment

### Delete Attachment

**DELETE** `/api/v1/tickets/:ticketId/attachments/:attachmentId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

**Authorization:**
- Users can delete their own attachments
- Admins/support can delete any attachment

**Business Logic:**
- Delete file from storage (Cloudinary/S3)
- Remove attachment reference from ticket/message

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error, invalid input
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: File size exceeds limit
- `415 Unsupported Media Type`: Invalid file type
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Common Error Messages

```json
// Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 200 characters"
    },
    {
      "field": "category",
      "message": "Invalid category. Must be one of: technical_issue, payment_problem, ..."
    }
  ]
}

// Unauthorized
{
  "success": false,
  "message": "Authentication required"
}

// Forbidden
{
  "success": false,
  "message": "You don't have permission to perform this action"
}

// Not Found
{
  "success": false,
  "message": "Ticket not found"
}

// File Upload Error
{
  "success": false,
  "message": "File size exceeds 5MB limit"
}
```

---

## Business Logic Requirements

### 1. Ticket Creation

- **Auto-assignment:** Automatically assign ticket to available support agent based on:
  - Category expertise
  - Current workload (tickets assigned)
  - Availability status
- **Initial Message:** Create first message with ticket description
- **Notifications:**
  - Email to support team (if ticket is urgent or high priority)
  - Email confirmation to ticket creator
- **Order/Product Validation:**
  - Verify `orderId` belongs to user
  - Verify `productId` exists

### 2. Status Management

**Status Transitions:**
- `open` → `in_progress` (when support agent responds)
- `in_progress` → `waiting_for_user` (when support asks question)
- `waiting_for_user` → `in_progress` (when user responds)
- `in_progress` → `resolved` (when support marks as resolved)
- `resolved` → `closed` (when user confirms or after 7 days)
- `resolved` → `open` (if user reopens)
- `closed` → `open` (if admin reopens)

**Auto-status Updates:**
- When user sends message: Set to `waiting_for_user` (if currently `in_progress`)
- When support sends message: Set to `in_progress` (if currently `open` or `waiting_for_user`)
- After 7 days of inactivity: Send reminder email
- After 30 days of inactivity: Auto-close if `resolved`

### 3. Message Handling

- **Internal Messages:** Only visible to admins/support agents
- **Notifications:**
  - Email notification when new message is added
  - Push notification (if enabled)
- **Message Ordering:** Sort by `createdAt` ascending
- **Character Limits:** Max 5000 characters per message

### 4. File Upload

- **Storage:** Use Cloudinary, AWS S3, or similar
- **File Processing:**
  - Validate file type and size
  - Generate unique filename
  - Store file metadata in database
  - Return public URL
- **Cleanup:** Delete orphaned files (attachments without ticket/message)

### 5. Search & Filtering

- **Search:** Full-text search on `title` and `description`
- **Filters:** Support multiple filter combinations
- **Sorting:** Default sort by `createdAt` descending
- **Pagination:** Always return pagination metadata

### 6. Notifications

**Email Notifications:**
- Ticket created (to support team)
- New message (to opposite party)
- Status change (to ticket creator)
- Assignment (to assigned agent)
- Resolution (to ticket creator)

**Notification Content:**
- Include ticket title, status, and link
- Include message preview (if applicable)
- Include relevant context (order/product info)

### 7. Audit Trail

**Log the following events:**
- Ticket creation
- Status changes
- Assignment changes
- Priority changes
- Message additions
- File uploads
- Ticket closure

**Audit Log Format:**
```typescript
{
  _id: ObjectId,
  ticketId: ObjectId,
  action: string,  // 'created', 'status_changed', 'assigned', etc.
  userId: ObjectId,
  changes: {
    field: string,
    oldValue: any,
    newValue: any
  },
  timestamp: Date
}
```

### 8. Rate Limiting

- **Ticket Creation:** Max 10 tickets per user per day
- **Messages:** Max 50 messages per ticket per day
- **File Uploads:** Max 20 uploads per user per day

### 9. Data Privacy

- **User Data:** Only return necessary user information
- **Internal Messages:** Never expose to end users
- **GDPR Compliance:** Support data export and deletion requests

---

## Database Indexes

**Recommended indexes for performance:**

```javascript
// tickets collection
db.tickets.createIndex({ userId: 1, createdAt: -1 });
db.tickets.createIndex({ status: 1, priority: -1 });
db.tickets.createIndex({ assignedTo: 1, status: 1 });
db.tickets.createIndex({ category: 1, status: 1 });
db.tickets.createIndex({ orderId: 1 });
db.tickets.createIndex({ productId: 1 });
db.tickets.createIndex({ title: "text", description: "text" }); // Text search

// ticket_messages collection
db.ticket_messages.createIndex({ ticketId: 1, createdAt: 1 });
db.ticket_messages.createIndex({ userId: 1 });
db.ticket_messages.createIndex({ isInternal: 1 });

// ticket_attachments collection
db.ticket_attachments.createIndex({ ticketId: 1 });
db.ticket_attachments.createIndex({ messageId: 1 });
```

---

## Testing Requirements

### Unit Tests
- Model validation
- Business logic functions
- Status transition rules

### Integration Tests
- API endpoint testing
- Authentication/authorization
- File upload handling
- Database operations

### Test Cases
1. Create ticket with valid data
2. Create ticket with invalid data (validation)
3. Get user tickets (filtering, pagination)
4. Add message to ticket
5. Update ticket status (authorization)
6. Upload file attachment
7. Search tickets
8. Internal message visibility

---

## Additional Notes

1. **Real-time Updates:** Consider implementing WebSocket for real-time ticket updates
2. **Caching:** Cache frequently accessed tickets and statistics
3. **Background Jobs:** Use queue system for email notifications
4. **Monitoring:** Track ticket response times and resolution rates
5. **Analytics:** Log ticket metrics for reporting dashboard

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintained By:** Backend Development Team

