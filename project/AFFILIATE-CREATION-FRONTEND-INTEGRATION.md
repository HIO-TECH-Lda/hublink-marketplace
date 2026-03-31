# Affiliate Creation Frontend Integration

This document covers only affiliate profile creation flows:

1. Buyer/User self-apply flow
2. Admin creates affiliate flow

Base API URL: `http://localhost:3002/api/v1`

## 1) User Self-Apply

### Endpoint
- `POST /affiliate/apply`
- Auth required: **Yes** (`Authorization: Bearer <token>`)
- Roles: authenticated user

### Request Body
All fields are optional.

```json
{
  "code": "HELTONAFF",
  "paymentMethod": "mpesa",
  "paymentDetails": {
    "phone": "84xxxxxxx"
  }
}
```

Notes:
- If `code` is missing, backend generates one automatically.
- If user already has affiliate profile, backend returns existing profile.
- New self-applied profile is created with status `pending`.

### Success Response (201)
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {
    "affiliate": {
      "_id": "65f...",
      "userId": "65a...",
      "code": "HELTONAFF",
      "status": "pending",
      "commissionType": "percentage",
      "commissionValue": 5,
      "cookieWindowDays": 30,
      "minPayoutAmount": 1000,
      "paymentMethod": "mpesa",
      "paymentDetails": {
        "phone": "84xxxxxxx"
      },
      "createdAt": "2026-01-29T10:00:00.000Z",
      "updatedAt": "2026-01-29T10:00:00.000Z"
    }
  }
}
```

### Error Response (400)
```json
{
  "success": false,
  "message": "Affiliate code already exists"
}
```

## 2) Admin Creates Affiliate

### Endpoint
- `POST /admin/affiliates`
- Auth required: **Yes**
- Roles: **admin**

### Request Body
`POST /admin/affiliates` supports two modes:

1. Create affiliate for existing user using `userId`
2. Create new user + affiliate in one request using `user`

```json
{
  "userId": "65a123...",
  "code": "MYAFF2026",
  "status": "active",
  "commissionType": "percentage",
  "commissionValue": 7.5,
  "cookieWindowDays": 45,
  "minPayoutAmount": 1500,
  "paymentMethod": "bank_transfer",
  "paymentDetails": {
    "bankName": "BCI",
    "accountNumber": "1234567890",
    "accountName": "Helton Silva"
  }
}
```

Or full create flow (new user + affiliate):

```json
{
  "user": {
    "firstName": "Helton",
    "lastName": "Silva",
    "email": "helton.affiliate@test.com",
    "phone": "+258841112233",
    "password": "StrongPass123",
    "role": "buyer"
  },
  "code": "HELTONPARTNER",
  "status": "active",
  "commissionType": "percentage",
  "commissionValue": 7,
  "cookieWindowDays": 30,
  "minPayoutAmount": 1000
}
```

Notes:
- If `code` is missing, backend generates a unique code.
- You must provide at least one of: `userId` or `user`.
- If `user` is provided, backend first creates the user and then creates the affiliate linked to that user.
- If target user already has affiliate profile, request fails with `400`.
- Default status (if missing): `active`.

### Success Response (201)
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {
    "affiliate": {
      "_id": "65f...",
      "userId": "65a123...",
      "code": "MYAFF2026",
      "status": "active",
      "commissionType": "percentage",
      "commissionValue": 7.5,
      "cookieWindowDays": 45,
      "minPayoutAmount": 1500,
      "paymentMethod": "bank_transfer",
      "paymentDetails": {
        "bankName": "BCI",
        "accountNumber": "1234567890",
        "accountName": "Helton Silva"
      },
      "createdAt": "2026-01-29T10:00:00.000Z",
      "updatedAt": "2026-01-29T10:00:00.000Z"
    }
  }
}
```

### Error Response (400)
```json
{
  "success": false,
  "message": "User already has an affiliate profile"
}
```

Possible error messages:
- `userId or user payload is required`
- `User not found`
- `Email or phone already exists`
- `Affiliate code already exists`

## 3) Frontend UI Checklist

- Self-apply page:
  - Optional `affiliate code` input
  - Optional payout method + details
  - Submit button disabled while loading
  - Show returned `status` (`pending` expected on first apply)

- Admin create page:
  - Either `userId` OR complete `user` form
  - Optional commission fields
  - Optional payout method and details
  - Handle `code already exists`, `user already has profile`, and `email/phone exists` errors

## 4) Suggested Frontend Types

```ts
export type AffiliateStatus = 'pending' | 'active' | 'blocked';
export type CommissionType = 'percentage' | 'fixed';
export type PaymentMethod = 'bank_transfer' | 'mpesa' | 'emola' | 'other';

export interface Affiliate {
  _id: string;
  userId: string;
  code: string;
  status: AffiliateStatus;
  commissionType: CommissionType;
  commissionValue: number;
  cookieWindowDays: number;
  minPayoutAmount: number;
  paymentMethod?: PaymentMethod;
  paymentDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```
