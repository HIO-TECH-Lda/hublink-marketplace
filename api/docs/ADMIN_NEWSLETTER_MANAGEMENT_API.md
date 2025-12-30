# Admin Newsletter Management API

Complete API reference for managing newsletter subscribers and email campaigns.

## Base URL

```
/api/v1/admin/newsletter
```

**Authentication:** All endpoints require admin authentication via `Authorization: Bearer <token>`

---

## Statistics

### Get Newsletter Statistics

**GET** `/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSubscribers": 4,
    "activeSubscribers": 2,
    "unsubscribed": 1,
    "bounced": 1,
    "campaignsSent": 2,
    "campaignsScheduled": 1,
    "campaignsDraft": 3
  }
}
```

---

## Subscriber Management

### 1. Get All Subscribers

**GET** `/subscribers`

**Query Parameters:**
- `search` (string, optional): Search by email or name
- `status` (string, optional): Filter by status (`active`, `unsubscribed`, `bounced`, `pending`, `all`)
- `origin` (string, optional): Filter by origin (`popup`, `footer`, `signup`, `admin`, `import`, `all`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)

**Response:**

```json
{
  "success": true,
  "data": {
    "subscribers": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "joao.silva@email.com",
        "firstName": "João",
        "lastName": "Silva",
        "fullName": "João Silva",
        "status": "active",
        "origin": "popup",
        "tags": ["organic", "vegetables"],
        "engagement": {
          "emailsSent": 12,
          "emailsOpened": 8,
          "emailsClicked": 3,
          "openRate": "66.7",
          "clickRate": "25.0"
        },
        "registeredAt": "2024-01-15T12:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 4,
      "totalPages": 1
    }
  }
}
```

### 2. Get Subscriber by ID

**GET** `/subscribers/:subscriberId`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "joao.silva@email.com",
    "firstName": "João",
    "lastName": "Silva",
    "fullName": "João Silva",
    "status": "active",
    "origin": "popup",
    "tags": ["organic", "vegetables"],
    "preferences": {
      "categories": ["organic"],
      "frequency": "weekly",
      "promotions": true,
      "productUpdates": true,
      "blogPosts": true
    },
    "metadata": {
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referrer": "https://example.com"
    },
    "stats": {
      "emailsSent": 12,
      "emailsOpened": 8,
      "emailsClicked": 3,
      "lastOpened": "2024-01-20T10:00:00.000Z",
      "lastClicked": "2024-01-20T10:05:00.000Z",
      "openRate": "66.67",
      "clickRate": "25.00"
    },
    "unsubscribedAt": null,
    "unsubscribedReason": null,
    "createdAt": "2024-01-15T12:30:00.000Z",
    "updatedAt": "2024-01-20T10:05:00.000Z"
  }
}
```

### 3. Create Subscriber

**POST** `/subscribers`

**Request Body:**

```json
{
  "email": "novo@email.com",
  "firstName": "Novo",
  "lastName": "Usuário",
  "status": "active",
  "origin": "admin",
  "tags": ["organic", "fruits"],
  "preferences": {
    "categories": ["organic"],
    "frequency": "weekly",
    "promotions": true,
    "productUpdates": true,
    "blogPosts": true
  },
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://example.com"
  }
}
```

**Required Fields:**
- `email` (string): Valid email address

**Response:** Created subscriber object (same format as Get Subscriber by ID)

### 4. Update Subscriber

**PUT** `/subscribers/:subscriberId`

**Request Body:** Same as Create Subscriber (all fields optional)

**Response:** Updated subscriber object

### 5. Update Subscriber Status

**PATCH** `/subscribers/:subscriberId/status`

**Request Body:**

```json
{
  "status": "active"
}
```

**Valid Status Values:**
- `active`: Active subscriber
- `unsubscribed`: Unsubscribed
- `bounced`: Email bounced
- `pending`: Pending verification

**Response:** Updated subscriber object

### 6. Delete Subscriber

**DELETE** `/subscribers/:subscriberId`

**Response:**

```json
{
  "success": true,
  "message": "Subscriber deleted successfully"
}
```

---

## Campaign Management

### 1. Get All Campaigns

**GET** `/campaigns`

**Query Parameters:**
- `search` (string, optional): Search by name or subject
- `type` (string, optional): Filter by type (`newsletter`, `promotional`, `announcement`, `welcome`, `all`)
- `status` (string, optional): Filter by status (`draft`, `scheduled`, `sending`, `sent`, `cancelled`, `all`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)

**Response:**

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Ofertas da Semana - Orgânicos",
        "subject": "🌿 20% OFF em produtos orgânicos selecionados",
        "type": "promotional",
        "status": "sent",
        "subscribers": 1250,
        "performance": {
          "openRate": 47.2,
          "clickRate": 11.8
        },
        "sentAt": "2024-01-20T12:00:00.000Z",
        "scheduledAt": null,
        "createdAt": "2024-01-19T16:30:00.000Z"
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

### 2. Get Campaign by ID

**GET** `/campaigns/:campaignId`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Ofertas da Semana - Orgânicos",
    "subject": "🌿 20% OFF em produtos orgânicos selecionados",
    "type": "promotional",
    "status": "sent",
    "content": {
      "html": "<html>...</html>",
      "plainText": "Plain text version..."
    },
    "segmentation": {
      "subscriberStatus": "all",
      "tags": ["organic"],
      "preferences": {
        "categories": ["organic"],
        "frequency": ["weekly"]
      }
    },
    "scheduledAt": null,
    "timezone": "Africa/Maputo",
    "sentAt": "2024-01-20T12:00:00.000Z",
    "createdBy": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Helton Furau"
    },
    "stats": {
      "totalSubscribers": 1250,
      "sent": 1250,
      "delivered": 1180,
      "opened": 557,
      "clicked": 139,
      "bounced": 70,
      "unsubscribed": 5,
      "deliveryRate": 94.4,
      "openRate": 47.2,
      "clickRate": 11.8
    },
    "createdAt": "2024-01-19T16:30:00.000Z",
    "updatedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### 3. Create Campaign

**POST** `/campaigns`

**Request Body:**

```json
{
  "name": "Ofertas da Semana - Orgânicos",
  "subject": "🌿 20% OFF em produtos orgânicos selecionados",
  "type": "promotional",
  "status": "draft",
  "content": {
    "html": "<html><body><h1>Ofertas Especiais</h1>...</body></html>",
    "plainText": "Ofertas Especiais\n\n20% OFF em produtos orgânicos..."
  },
  "segmentation": {
    "subscriberStatus": "all",
    "tags": ["organic"],
    "preferences": {
      "categories": ["organic"],
      "frequency": ["weekly"]
    }
  },
  "scheduledAt": "2024-01-21T11:00:00.000Z",
  "timezone": "Africa/Maputo"
}
```

**Required Fields:**
- `name` (string): Campaign name
- `subject` (string): Email subject
- `content.html` (string): HTML content

**Campaign Types:**
- `newsletter`: Regular newsletter
- `promotional`: Promotional campaign
- `announcement`: Announcement
- `welcome`: Welcome email

**Segmentation Options:**
- `subscriberStatus`: `all`, `active`, `new` (last 30 days)
- `tags`: Array of subscriber tags
- `preferences.categories`: Array of preferred categories
- `preferences.frequency`: Array of frequency preferences

**Response:** Created campaign object (same format as Get Campaign by ID)

### 4. Update Campaign

**PUT** `/campaigns/:campaignId`

**Request Body:** Same as Create Campaign (all fields optional)

**Note:** Only campaigns with status `draft` or `scheduled` can be updated.

**Response:** Updated campaign object

### 5. Update Campaign Status

**PATCH** `/campaigns/:campaignId/status`

**Request Body:**

```json
{
  "status": "scheduled",
  "scheduledAt": "2024-01-21T11:00:00.000Z"
}
```

**Valid Status Values:**
- `draft`: Draft campaign
- `scheduled`: Scheduled for future sending
- `sending`: Currently being sent
- `sent`: Successfully sent
- `cancelled`: Cancelled

**Response:** Updated campaign object

### 6. Delete Campaign

**DELETE** `/campaigns/:campaignId`

**Note:** Only campaigns with status `draft` or `cancelled` can be deleted.

**Response:**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

## TypeScript Interfaces

```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  origin: 'popup' | 'footer' | 'signup' | 'admin' | 'import';
  tags: string[];
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    promotions?: boolean;
    productUpdates?: boolean;
    blogPosts?: boolean;
  };
  stats: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    lastOpened?: Date;
    lastClicked?: Date;
    openRate: string;
    clickRate: string;
  };
  registeredAt: Date;
}

interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  content: {
    html: string;
    plainText?: string;
  };
  segmentation?: {
    subscriberStatus?: 'all' | 'active' | 'new';
    tags?: string[];
    preferences?: {
      categories?: string[];
      frequency?: string[];
    };
  };
  scheduledAt?: Date;
  timezone: string;
  sentAt?: Date;
  createdBy?: {
    id: string;
    name: string;
  };
  stats: {
    totalSubscribers: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Status Mapping

### Subscriber Status
- `active`: Active and receiving emails
- `unsubscribed`: Unsubscribed from newsletter
- `bounced`: Email address bounced
- `pending`: Pending verification

### Campaign Status
- `draft`: Draft, not yet scheduled
- `scheduled`: Scheduled for future sending
- `sending`: Currently being sent
- `sent`: Successfully sent
- `cancelled`: Cancelled before sending

---

## Nice to Have Features

1. **Export Subscribers:** Export subscriber list to CSV/Excel
2. **Bulk Import:** Import subscribers from CSV
3. **A/B Testing:** Test different subject lines or content
4. **Email Templates:** Pre-built email templates
5. **Automated Campaigns:** Trigger campaigns based on events
6. **Analytics Dashboard:** Visual charts and graphs
7. **Unsubscribe Management:** Handle unsubscribe requests
8. **Bounce Handling:** Automatic bounce detection and handling
9. **Tag Management:** Create and manage subscriber tags
10. **Campaign Preview:** Preview campaign before sending
11. **Send Test Email:** Send test email before campaign
12. **Campaign Duplication:** Duplicate existing campaigns
13. **Performance Comparison:** Compare campaign performance
14. **Subscriber Segmentation:** Advanced segmentation rules
15. **Scheduled Reports:** Automated performance reports

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
- Email addresses are automatically lowercased
- Subscriber engagement rates are calculated automatically
- Campaign performance metrics are updated after sending
- Estimated subscribers are calculated based on segmentation
- Only draft or cancelled campaigns can be deleted
- Campaign status transitions: `draft` → `scheduled` → `sending` → `sent`
- Subscriber tags are automatically lowercased
- Timezone defaults to `Africa/Maputo` if not specified

