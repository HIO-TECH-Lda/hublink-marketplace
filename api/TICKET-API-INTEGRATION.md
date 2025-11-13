# Ticket System API Integration Guide

## Overview

The Ticket System API allows users (buyers, sellers, and admins) to create, manage, and track support tickets. The system supports ticket creation with categories and priorities, threaded conversations (messages) within tickets, file attachments, status tracking, and assignment to support agents.

**Base URL:** `/api/v1/tickets`

**Authentication:** All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

**Role Requirements:**
- **Buyers/Sellers:** Can create tickets, view their own tickets, and add messages
- **Admins/Support:** Can view all tickets, update status, assign tickets, and add internal messages

---

## Buyer/Seller Endpoints

### 1. Create Ticket

Create a new support ticket.

**Endpoint:** `POST /api/v1/tickets`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Problema com pagamento M-Pesa",
  "description": "Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.",
  "category": "payment_problem",
  "priority": "high",
  "orderId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "productId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "tags": ["pagamento", "mpesa"],
  "attachments": []
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Ticket title (3-200 characters) |
| `description` | string | Yes | Detailed description (10-5000 characters) |
| `category` | string | Yes | One of: `technical_issue`, `payment_problem`, `order_issue`, `return_request`, `account_issue`, `product_issue`, `shipping_problem`, `general_inquiry`, `feature_request`, `bug_report` |
| `priority` | string | Yes | One of: `low`, `medium`, `high`, `urgent` |
| `orderId` | string | No | Related order ID (must belong to user) |
| `productId` | string | No | Related product ID |
| `tags` | string[] | No | Array of tags (max 10, each max 50 chars) |
| `attachments` | array | No | Array of attachment objects (see File Upload section) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
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

**Business Rules:**
- Initial message is automatically created with the ticket description
- Status is set to `open` by default
- If `orderId` is provided, it must belong to the authenticated user
- If `productId` is provided, it must exist

**Error Examples:**
```json
{
  "success": false,
  "message": "Order not found or does not belong to you"
}
```

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters",
    "Category is required"
  ]
}
```

---

### 2. Get My Tickets

Retrieve all tickets created by the authenticated user.

**Endpoint:** `GET /api/v1/tickets/my-tickets`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page (max 100) |
| `status` | string | No | - | Filter by status |
| `category` | string | No | - | Filter by category |
| `priority` | string | No | - | Filter by priority |
| `search` | string | No | - | Search in title and description |
| `sortBy` | string | No | `createdAt` | Sort field (`createdAt`, `updatedAt`, `priority`) |
| `sortOrder` | string | No | `desc` | Sort order (`asc` or `desc`) |

**Example Request:**
```
GET /api/v1/tickets/my-tickets?page=1&limit=20&status=open&category=payment_problem&search=mpesa&sortBy=createdAt&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
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

**Note:** Internal messages (`isInternal: true`) are automatically excluded from the response for non-admin users.

---

### 3. Get Single Ticket

Retrieve a specific ticket by ID.

**Endpoint:** `GET /api/v1/tickets/:ticketId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket retrieved successfully",
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

**Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not have permission to view this ticket"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Ticket not found"
}
```

---

### 4. Add Message to Ticket

Add a message to an existing ticket.

**Endpoint:** `POST /api/v1/tickets/:ticketId/messages`

**Request Body:**
```json
{
  "message": "Aparece 'Erro de conexão. Tente novamente.' quando clico em pagar.",
  "isInternal": false,
  "attachments": []
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | Message content (1-5000 characters) |
| `isInternal` | boolean | No | If `true`, message is only visible to admins/support (default: `false`) |
| `attachments` | array | No | Array of attachment objects (see File Upload section) |

**Business Rules:**
- Only admins/support can set `isInternal: true`
- Users can only add messages to their own tickets
- Cannot add messages to closed tickets (unless admin)
- Status auto-updates:
  - When user sends message: Status changes to `waiting_for_user` (if currently `in_progress`)
  - When support sends message: Status changes to `in_progress` (if currently `open` or `waiting_for_user`)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message added successfully",
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

---

### 5. Upload Attachment to Ticket

Upload a file attachment to a ticket or message.

**Endpoint:** `POST /api/v1/tickets/:ticketId/attachments`

**Request Body:**
```json
{
  "fileName": "screenshot.png",
  "fileSize": 245760,
  "mimeType": "image/png",
  "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "messageId": "65a1b2c3d4e5f6g7h8i9j0k7"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fileName` | string | Yes | Original file name |
| `fileSize` | number | Yes | File size in bytes (max 5MB) |
| `mimeType` | string | Yes | MIME type (`image/jpeg`, `image/png`, `image/gif`, `application/pdf`) |
| `base64` | string | Yes | Base64 encoded file data |
| `messageId` | string | No | If provided, attachment is linked to a specific message |

**File Constraints:**
- Max file size: 5MB per file
- Allowed types: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`
- Max files per ticket: 10
- Max files per message: 5

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "ticketId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "messageId": null,
    "fileName": "screenshot.png",
    "fileUrl": "https://res.cloudinary.com/example/tickets/attachments/65a1b2c3d4e5f6g7h8i9j0k8.png",
    "publicId": "tickets/attachments/65a1b2c3d4e5f6g7h8i9j0k8",
    "fileSize": 245760,
    "mimeType": "image/png",
    "uploadedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

**Error Examples:**
```json
{
  "success": false,
  "message": "File size exceeds 5MB limit"
}
```

```json
{
  "success": false,
  "message": "Invalid file type. Allowed types: JPEG, PNG, GIF, PDF"
}
```

---

### 6. Delete Attachment

Delete an attachment from a ticket or message.

**Endpoint:** `DELETE /api/v1/tickets/:ticketId/attachments/:attachmentId`

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

---

## Admin/Support Endpoints

### 7. Get All Tickets

Retrieve all tickets (admin/support only).

**Endpoint:** `GET /api/v1/tickets`

**Query Parameters:** Same as "Get My Tickets" plus:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignedTo` | string | No | Filter by assigned agent ID |
| `userId` | string | No | Filter by ticket creator ID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
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

**Note:** All messages (including internal) are visible to admins/support.

---

### 8. Update Ticket

Update ticket status, priority, assignment, or tags (admin/support only).

**Endpoint:** `PATCH /api/v1/tickets/:ticketId`

**Request Body (all fields optional):**
```json
{
  "status": "in_progress",
  "priority": "urgent",
  "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k6",
  "tags": ["pagamento", "mpesa", "urgente"]
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | One of: `open`, `in_progress`, `waiting_for_user`, `waiting_for_third_party`, `resolved`, `closed` |
| `priority` | string | No | One of: `low`, `medium`, `high`, `urgent` |
| `assignedTo` | string | No | User ID of support agent/admin |
| `tags` | string[] | No | Array of tags (max 10) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket updated successfully",
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

**Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not have permission to update this ticket"
}
```

---

### 9. Get Ticket Statistics

Get aggregated statistics for tickets (admin/support only).

**Endpoint:** `GET /api/v1/tickets/statistics`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | ISO date string (filter start) |
| `endDate` | string | No | ISO date string (filter end) |
| `category` | string | No | Filter by category |
| `assignedTo` | string | No | Filter by assigned agent |

**Example Request:**
```
GET /api/v1/tickets/statistics?startDate=2024-01-01&endDate=2024-01-31&category=payment_problem
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
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
      "technical_issue": 20,
      "payment_problem": 30,
      "order_issue": 25,
      "return_request": 10,
      "account_issue": 10,
      "product_issue": 10,
      "shipping_problem": 15,
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
    "averageResponseTime": 3600,
    "averageResolutionTime": 86400
  }
}
```

---

### 10. Delete Ticket

Delete a ticket (admin only).

**Endpoint:** `DELETE /api/v1/tickets/:ticketId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

**Note:** This permanently deletes the ticket and all associated attachments from Cloudinary.

---

## Ticket Status Values

| Status | Description |
|--------|-------------|
| `open` | Ticket created, waiting for support |
| `in_progress` | Support agent is working on the ticket |
| `waiting_for_user` | Waiting for user response |
| `waiting_for_third_party` | Waiting for external service/third party |
| `resolved` | Issue resolved, waiting for user confirmation |
| `closed` | Ticket closed (user confirmed or auto-closed) |

## Ticket Categories

| Category | Description |
|----------|-------------|
| `technical_issue` | Technical problems with the platform |
| `payment_problem` | Payment-related issues |
| `order_issue` | Order problems or questions |
| `return_request` | Return/refund requests |
| `account_issue` | Account-related problems |
| `product_issue` | Product-specific questions/issues |
| `shipping_problem` | Shipping and delivery issues |
| `general_inquiry` | General questions |
| `feature_request` | Feature suggestions |
| `bug_report` | Bug reports |

## Ticket Priorities

| Priority | Description |
|----------|-------------|
| `low` | Low priority, can be handled later |
| `medium` | Normal priority |
| `high` | High priority, needs attention soon |
| `urgent` | Urgent, requires immediate attention |

---

## File Upload Implementation

### Frontend File Upload Flow

1. **Convert file to base64:**
```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
```

2. **Upload attachment:**
```javascript
async function uploadAttachment(ticketId, file, messageId = null) {
  const base64 = await fileToBase64(file);
  
  const response = await fetch(`/api/v1/tickets/${ticketId}/attachments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      base64: base64,
      messageId: messageId
    })
  });
  
  return response.json();
}
```

3. **Validate before upload:**
```javascript
function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF');
  }
  
  return true;
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    "Field-specific error message"
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success (GET, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found (resource doesn't exist) |
| `413` | Payload Too Large (file size exceeds limit) |
| `500` | Internal Server Error |

### Common Error Messages

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters",
    "Category is required"
  ]
}
```

**Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**Forbidden:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

---

## Frontend Integration Example

### React/TypeScript Example

```typescript
// TicketService.ts
import axios from 'axios';

const API_BASE = '/api/v1/tickets';

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
  orderId?: string;
  productId?: string;
  tags?: string[];
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userId: any;
  userType: string;
  assignedTo?: any;
  orderId?: any;
  productId?: any;
  tags: string[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  _id: string;
  message: string;
  userId: any;
  userType: string;
  isInternal: boolean;
  createdAt: string;
}

class TicketService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    const response = await axios.post(`${API_BASE}`, data, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async getMyTickets(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<{ tickets: Ticket[]; pagination: any }> {
    const response = await axios.get(`${API_BASE}/my-tickets`, {
      headers: this.getHeaders(),
      params
    });
    return response.data.data;
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    const response = await axios.get(`${API_BASE}/${ticketId}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async addMessage(ticketId: string, message: string, isInternal = false): Promise<TicketMessage> {
    const response = await axios.post(
      `${API_BASE}/${ticketId}/messages`,
      { message, isInternal },
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  async uploadAttachment(
    ticketId: string,
    file: File,
    messageId?: string
  ): Promise<any> {
    const base64 = await this.fileToBase64(file);
    
    const response = await axios.post(
      `${API_BASE}/${ticketId}/attachments`,
      {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        base64,
        messageId
      },
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async updateTicket(
    ticketId: string,
    data: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      tags?: string[];
    }
  ): Promise<Ticket> {
    const response = await axios.patch(
      `${API_BASE}/${ticketId}`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  async getAllTickets(params: any): Promise<{ tickets: Ticket[]; pagination: any }> {
    const response = await axios.get(API_BASE, {
      headers: this.getHeaders(),
      params
    });
    return response.data.data;
  }

  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<any> {
    const response = await axios.get(`${API_BASE}/statistics`, {
      headers: this.getHeaders(),
      params
    });
    return response.data.data;
  }
}

export default new TicketService();
```

### Usage Example

```typescript
// CreateTicketForm.tsx
import React, { useState } from 'react';
import TicketService from './TicketService';

const CreateTicketForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ticket = await TicketService.createTicket(formData);
      console.log('Ticket created:', ticket);
      // Redirect or show success message
    } catch (error: any) {
      console.error('Error creating ticket:', error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        <option value="payment_problem">Payment Problem</option>
        <option value="order_issue">Order Issue</option>
        <option value="technical_issue">Technical Issue</option>
        {/* ... other categories */}
      </select>
      <select
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button type="submit">Create Ticket</button>
    </form>
  );
};
```

---

## Best Practices

1. **File Upload:**
   - Always validate file size and type on the frontend before uploading
   - Show upload progress for large files
   - Handle upload errors gracefully

2. **Pagination:**
   - Implement infinite scroll or pagination controls
   - Cache ticket lists to reduce API calls

3. **Real-time Updates:**
   - Consider implementing WebSocket or polling for ticket status updates
   - Refresh ticket list when new messages are added

4. **Error Handling:**
   - Display user-friendly error messages
   - Handle network errors and timeouts
   - Validate forms before submission

5. **Security:**
   - Never expose internal messages to non-admin users
   - Validate user permissions before showing admin actions
   - Store JWT tokens securely

---

## Support

For questions or issues with the Ticket API, please contact the backend team or refer to the main API documentation.

