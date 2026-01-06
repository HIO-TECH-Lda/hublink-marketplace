# Admin Create User - Frontend Guide

Required and optional fields for creating users with different roles.

## API Endpoint

```
POST /api/v1/admin/users
```

---

## Required Fields (All Roles)

These fields are **required** regardless of role:

```typescript
interface BaseUserFields {
  firstName: string;      // 2-50 characters
  lastName: string;       // 2-50 characters
  email: string;          // Valid email format, lowercase
  phone: string;          // Format: +258XXXXXXXXX (Mozambican)
  password: string;       // Minimum 8 characters
}
```

**Validation:**
- **firstName**: 2-50 characters
- **lastName**: 2-50 characters
- **email**: Must be valid email (auto-lowercased)
- **phone**: Must match `+258XXXXXXXXX` format
- **password**: Minimum 8 characters (will be hashed)

---

## Optional Fields (All Roles)

```typescript
interface OptionalUserFields {
  role?: 'buyer' | 'seller' | 'admin' | 'support'; // Default: 'buyer'
  status?: 'active' | 'inactive' | 'suspended';   // Default: 'active'
  emailVerified?: boolean;                         // Default: false
  phoneVerified?: boolean;                         // Default: false
  avatar?: string;                                 // URL or base64 image
}
```

---

## Role: Buyer

**Required:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer'
}
```

**Optional:**
```typescript
{
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
}
```

**No additional fields needed.**

---

## Role: Admin

**Required:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin'
}
```

**Optional:**
```typescript
{
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
}
```

**No additional fields needed.**

---

## Role: Support

**Required:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'support'
}
```

**Optional:**
```typescript
{
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
}
```

**No additional fields needed.**

---

## Role: Seller

**Required:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'seller';
  sellerProfile: {
    storeName: string;        // Store/business name
    storeDescription: string; // Business description
    address: string;          // Street address
    city: string;             // City
    province: string;         // Province/state
    postalCode: string;       // Postal/ZIP code
    productTypes: string;     // Types of products sold
    experience?: string;      // Years of experience (optional)
  }
}
```

**Optional:**
```typescript
{
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
}
```

**⚠️ Important:** `sellerProfile` is **required** when `role: 'seller'`

---

## Complete TypeScript Interface

```typescript
interface CreateUserRequest {
  // Required for all roles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  
  // Optional
  role?: 'buyer' | 'seller' | 'admin' | 'support';
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
  
  // Required only if role is 'seller'
  sellerProfile?: {
    storeName: string;
    storeDescription: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    productTypes: string;
    experience?: string;
  };
}
```

---

## Example Payloads

### Create Buyer

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao.silva@email.com",
  "phone": "+258841234567",
  "password": "SecurePass123",
  "role": "buyer",
  "status": "active",
  "emailVerified": false,
  "phoneVerified": false
}
```

### Create Admin

```json
{
  "firstName": "Maria",
  "lastName": "Costa",
  "email": "maria.admin@txova.com",
  "phone": "+258847654321",
  "password": "AdminPass123",
  "role": "admin",
  "status": "active",
  "emailVerified": true,
  "phoneVerified": true
}
```

### Create Support

```json
{
  "firstName": "Pedro",
  "lastName": "Santos",
  "email": "pedro.support@txova.com",
  "phone": "+258843456789",
  "password": "SupportPass123",
  "role": "support",
  "status": "active",
  "emailVerified": true,
  "phoneVerified": false
}
```

### Create Seller

```json
{
  "firstName": "Ana",
  "lastName": "Oliveira",
  "email": "ana@fazendaverde.com",
  "phone": "+258849876543",
  "password": "SellerPass123",
  "role": "seller",
  "status": "active",
  "emailVerified": true,
  "phoneVerified": false,
  "sellerProfile": {
    "storeName": "Fazenda Verde",
    "storeDescription": "Produtos orgânicos frescos da nossa fazenda",
    "address": "Rua das Flores, 123",
    "city": "Maputo",
    "province": "Maputo",
    "postalCode": "1100",
    "productTypes": "Frutas, Vegetais, Produtos Orgânicos",
    "experience": "5 anos"
  }
}
```

---

## Frontend Form Structure

### Step 1: Basic Information (All Roles)

- **First Name*** (text, 2-50 chars)
- **Last Name*** (text, 2-50 chars)
- **Email*** (email, unique)
- **Phone*** (text, +258XXXXXXXXX format)
- **Password*** (password, min 8 chars)
- **Role*** (select: buyer, seller, admin, support)
- **Status** (select: active, inactive, suspended) - Default: active
- **Email Verified** (checkbox) - Default: false
- **Phone Verified** (checkbox) - Default: false

### Step 2: Seller Information (Conditional - Only if role === 'seller')

- **Store Name*** (text)
- **Store Description*** (textarea)
- **Address*** (text)
- **City*** (text)
- **Province*** (text)
- **Postal Code*** (text)
- **Product Types*** (text or multi-select)
- **Experience** (text, optional)

---

## Validation Rules

### Phone Number
```javascript
const phoneRegex = /^\+258[0-9]{9}$/;
// Examples:
// ✅ Valid: +258841234567
// ❌ Invalid: 841234567
// ❌ Invalid: +258-84-123-4567
```

### Email
```javascript
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// Examples:
// ✅ Valid: user@example.com
// ✅ Valid: user.name@example.co.mz
// ❌ Invalid: user@
// ❌ Invalid: @example.com
```

### Password
- Minimum 8 characters
- Recommended: Include uppercase, lowercase, numbers, special characters

---

## Frontend Implementation Example

```typescript
// Form state
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '+258', // Pre-fill country code
  password: '',
  role: 'buyer',
  status: 'active',
  emailVerified: false,
  phoneVerified: false,
  sellerProfile: {
    storeName: '',
    storeDescription: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    productTypes: '',
    experience: ''
  }
});

// Handle role change
const handleRoleChange = (role: string) => {
  setFormData({
    ...formData,
    role,
    // Clear seller profile if not seller
    sellerProfile: role === 'seller' ? formData.sellerProfile : undefined
  });
};

// Submit
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  const payload = { ...formData };
  
  // Remove sellerProfile if not seller
  if (payload.role !== 'seller') {
    delete payload.sellerProfile;
  }
  
  const response = await fetch('/api/v1/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  // Handle response...
};
```

---

## UI/UX Recommendations

1. **Role Selector**: Prominent dropdown at the top
2. **Conditional Fields**: Show/hide seller profile section based on role
3. **Pre-fill Defaults**: 
   - Phone: `+258`
   - Role: `buyer`
   - Status: `active`
4. **Phone Input**: Format as user types (+258 XXX XXX XXX)
5. **Password Generator**: Offer "Generate Password" button
6. **Validation**: Real-time validation on blur
7. **Visual Indicators**: Mark required fields with asterisk (*)
8. **Help Text**: 
   - Phone: "Must start with +258 followed by 9 digits"
   - Password: "Minimum 8 characters"
9. **Role Descriptions**:
   - Buyer: "Regular customer account"
   - Seller: "Can list and sell products"
   - Admin: "Full system access"
   - Support: "Can manage tickets and help users"

---

## Error Handling

Common errors from API:

```typescript
{
  "success": false,
  "message": "User with this email or phone already exists"
}
```

```typescript
{
  "success": false,
  "message": "Please enter a valid Mozambican phone number (+258XXXXXXXXX)"
}
```

```typescript
{
  "success": false,
  "message": "Email is required"
}
```

---

## Summary

| Role | Base Fields | Additional Fields |
|------|-------------|-------------------|
| **Buyer** | firstName, lastName, email, phone, password | None |
| **Admin** | firstName, lastName, email, phone, password | None |
| **Support** | firstName, lastName, email, phone, password | None |
| **Seller** | firstName, lastName, email, phone, password | **sellerProfile*** (8 fields) |

**Note:** Only sellers need the `sellerProfile` object with store/business information.

