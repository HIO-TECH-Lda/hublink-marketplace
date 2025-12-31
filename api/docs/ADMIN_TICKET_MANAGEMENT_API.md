# Admin Ticket Management API

Complete API reference for managing support tickets.

## Base URL

```
/api/v1/admin/tickets
```

**Authentication:** All endpoints require admin/support authentication via `Authorization: Bearer <token>`

---

## Statistics

### Get Ticket Statistics

**GET** `/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 3,
    "open": 1,
    "inProgress": 1,
    "waitingForUser": 0,
    "waitingForThirdParty": 1,
    "resolved": 0,
    "closed": 0,
    "urgent": 0,
    "high": 1,
    "medium": 2,
    "low": 0
  }
}
```

---

## Ticket Management

### 1. Get All Tickets

**GET** `/`

**Query Parameters:**
- `search` (string, optional): Search by title, description, or ticket number
- `status` (string, optional): Filter by status (`open`, `in_progress`, `waiting_for_user`, `waiting_for_third_party`, `resolved`, `closed`, `all`)
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`, `urgent`, `all`)
- `category` (string, optional): Filter by category (see categories below, `all`)
- `assignedTo` (string, optional): Filter by assigned user ID (`all`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)

**Response:**

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "507f1f77bcf86cd799439011",
        "ticketNumber": "TICK-001",
        "title": "Problema com pagamento M-Pesa",
        "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
        "category": "payment_problem",
        "priority": "high",
        "status": "in_progress",
        "createdBy": {
          "id": "507f1f77bcf86cd799439012",
          "name": "João Silva"
        },
        "assignedTo": {
          "id": "507f1f77bcf86cd799439013",
          "name": "Maria Silva"
        },
        "orderId": {
          "id": "507f1f77bcf86cd799439014",
          "orderNumber": "ORD-002"
        },
        "productId": null,
        "tags": ["Problema com Pagamento"],
        "messageCount": 3,
        "createdAt": "2024-01-20T12:30:00.000Z",
        "updatedAt": "2024-01-20T13:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 2. Get Ticket by ID

**GET** `/:ticketId`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "ticketNumber": "TICK-001",
    "title": "Problema com pagamento M-Pesa",
    "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
    "category": "payment_problem",
    "priority": "high",
    "status": "in_progress",
    "createdBy": {
      "id": "507f1f77bcf86cd799439012",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+258841234567"
    },
    "assignedTo": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Maria Silva",
      "email": "maria@email.com"
    },
    "orderId": {
      "id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-002",
      "status": "pending",
      "totalAmount": 1500.00
    },
    "productId": null,
    "tags": ["Problema com Pagamento"],
    "attachments": [],
    "messages": {
      "public": [
        {
          "id": "507f1f77bcf86cd799439015",
          "userId": "507f1f77bcf86cd799439012",
          "userType": "buyer",
          "message": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
          "isInternal": false,
          "attachments": [],
          "createdAt": "2024-01-20T12:30:00.000Z"
        },
        {
          "id": "507f1f77bcf86cd799439016",
          "userId": "507f1f77bcf86cd799439013",
          "userType": "admin",
          "message": "Olá! Vou verificar o problema com o M-Pesa. Pode me informar qual erro específico aparece na tela?",
          "isInternal": false,
          "attachments": [],
          "createdAt": "2024-01-20T13:00:00.000Z"
        }
      ],
      "internal": [
        {
          "id": "507f1f77bcf86cd799439017",
          "userId": "507f1f77bcf86cd799439013",
          "userType": "admin",
          "message": "dasd",
          "isInternal": true,
          "attachments": [],
          "createdAt": "2024-12-31T08:54:00.000Z"
        }
      ],
      "all": [
        {
          "id": "507f1f77bcf86cd799439015",
          "userId": "507f1f77bcf86cd799439012",
          "userType": "buyer",
          "message": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
          "isInternal": false,
          "attachments": [],
          "createdAt": "2024-01-20T12:30:00.000Z"
        }
      ]
    },
    "stats": {
      "messageCount": 4,
      "timeOpen": 710,
      "lastUpdate": "2024-12-31T08:54:00.000Z"
    },
    "createdAt": "2024-01-20T12:30:00.000Z",
    "updatedAt": "2024-12-31T08:54:00.000Z"
  }
}
```

### 3. Update Ticket

**PUT** `/:ticketId`

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "category": "payment_problem",
  "priority": "high",
  "status": "in_progress",
  "assignedTo": "507f1f77bcf86cd799439013",
  "tags": ["Problema com Pagamento", "Urgente"]
}
```

**All fields are optional.** Only provided fields will be updated.

**Response:** Updated ticket object (same format as Get Ticket by ID)

### 4. Update Ticket Status (Quick Action)

**PATCH** `/:ticketId/status`

**Request Body:**

```json
{
  "status": "in_progress"
}
```

**Valid Status Values:**
- `open`: New ticket
- `in_progress`: Being worked on
- `waiting_for_user`: Waiting for user response
- `waiting_for_third_party`: Waiting for third party (e.g., shipping company)
- `resolved`: Issue resolved
- `closed`: Ticket closed

**Response:** Updated ticket object

### 5. Assign Ticket

**PATCH** `/:ticketId/assign`

**Request Body:**

```json
{
  "userId": "507f1f77bcf86cd799439013"
}
```

**Response:** Updated ticket object with new assignment

### 6. Add Message to Ticket

**POST** `/:ticketId/messages`

**Request Body (Public Message):**

```json
{
  "message": "Olá! Vou verificar o problema com o M-Pesa. Pode me informar qual erro específico aparece na tela?",
  "isInternal": false,
  "attachments": [
    {
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "fileName": "screenshot.jpg",
      "fileSize": 102400,
      "mimeType": "image/jpeg"
    }
  ]
}
```

**Request Body (Internal Note):**

```json
{
  "message": "dasd",
  "isInternal": true
}
```

**Fields:**
- `message` (string, required): Message content
- `isInternal` (boolean, optional): If true, creates internal note (default: false)
- `attachments` (array, optional): Array of attachment objects with base64 or fileUrl

**Attachment Format:**
- `base64` (string): Base64 encoded file (will be uploaded to Cloudinary)
- `fileUrl` (string): Already uploaded file URL
- `fileName` (string): File name
- `fileSize` (number): File size in bytes
- `mimeType` (string): MIME type

**Response:** Updated ticket object with new message

### 7. Delete Ticket

**DELETE** `/:ticketId`

**Response:**

```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

---

## Ticket Categories

- `technical_issue`: Technical problems
- `payment_problem`: Payment issues
- `order_issue`: Order-related problems
- `return_request`: Return/refund requests
- `account_issue`: Account problems
- `product_issue`: Product-specific questions
- `shipping_problem`: Shipping and delivery issues
- `general_inquiry`: General questions
- `feature_request`: Feature suggestions
- `bug_report`: Bug reports

---

## Ticket Priorities

- `low`: Low priority
- `medium`: Normal priority (default)
- `high`: High priority
- `urgent`: Urgent, requires immediate attention

---

## Ticket Statuses

- `open`: New ticket, not yet assigned
- `in_progress`: Being worked on by support team
- `waiting_for_user`: Waiting for user response
- `waiting_for_third_party`: Waiting for third party (e.g., shipping company)
- `resolved`: Issue resolved, waiting for user confirmation
- `closed`: Ticket closed

---

## TypeScript Interfaces

```typescript
interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TicketStatus;
  createdBy: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  orderId?: {
    id: string;
    orderNumber: string;
    status?: string;
    totalAmount?: number;
  };
  productId?: {
    id: string;
    name: string;
    image?: string;
    slug?: string;
  };
  tags: string[];
  attachments: TicketAttachment[];
  messages: {
    public: TicketMessage[];
    internal: TicketMessage[];
    all: TicketMessage[];
  };
  stats: {
    messageCount: number;
    timeOpen: number | null; // Days
    lastUpdate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TicketMessage {
  id: string;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin' | 'support';
  message: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  createdAt: Date;
}

interface TicketAttachment {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  fileSize: number;
  mimeType: string;
}

type TicketCategory = 
  | 'technical_issue'
  | 'payment_problem'
  | 'order_issue'
  | 'return_request'
  | 'account_issue'
  | 'product_issue'
  | 'shipping_problem'
  | 'general_inquiry'
  | 'feature_request'
  | 'bug_report';

type TicketStatus = 
  | 'open'
  | 'in_progress'
  | 'waiting_for_user'
  | 'waiting_for_third_party'
  | 'resolved'
  | 'closed';
```

---

## Quick Actions

Common status updates for quick actions:

- **Mark as In Progress:** `PATCH /:ticketId/status` with `{ "status": "in_progress" }`
- **Awaiting Response:** `PATCH /:ticketId/status` with `{ "status": "waiting_for_user" }`
- **Mark as Resolved:** `PATCH /:ticketId/status` with `{ "status": "resolved" }`
- **Close Ticket:** `PATCH /:ticketId/status` with `{ "status": "closed" }`

---

## Nice to Have Features

1. **Ticket Templates:** Pre-defined response templates
2. **Auto-Assignment:** Automatic ticket assignment based on rules
3. **SLA Tracking:** Track response and resolution times
4. **Ticket Escalation:** Automatic escalation for overdue tickets
5. **Email Notifications:** Notify users on ticket updates
6. **Ticket Merging:** Merge duplicate tickets
7. **Ticket History:** Complete audit trail of all changes
8. **Canned Responses:** Quick response templates
9. **Ticket Tags Management:** Create and manage tag categories
10. **Bulk Actions:** Update multiple tickets at once
11. **Export Tickets:** Export tickets to CSV/Excel
12. **Ticket Analytics:** Performance metrics and reports
13. **Knowledge Base Integration:** Link tickets to knowledge base articles
14. **Customer Satisfaction:** Post-resolution surveys
15. **Ticket Follow-up:** Automated follow-up for resolved tickets

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
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Notes

- All dates are in ISO 8601 format (UTC)
- Internal messages are only visible to admins/support staff
- Public messages are visible to ticket creator and admins/support
- Attachments are automatically uploaded to Cloudinary
- Time open is calculated in days from ticket creation
- Ticket numbers are auto-generated if not provided
- Messages are sorted chronologically in the `all` array
- Only admins can delete tickets
- Support staff can view and update tickets

