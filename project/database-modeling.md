# Database Modeling Document - Txova Marketplace

**Database:** MongoDB  
**Version:** 1.0.0  
**Date:** Janeiro 2024

---

## 📋 Overview

Este documento define o modelo de dados MongoDB para a plataforma Txova, um marketplace brasileiro de alimentos orgânicos. O modelo foi projetado para suportar todas as funcionalidades implementadas no Sprint 01 e Sprint 02.

---

## 🏗️ Arquitetura do Banco

### **Configuração MongoDB**
- **Database:** `ecobazar`
- **Collections:** 12 principais
- **Indexes:** Otimizados para performance
- **Sharding:** Preparado para escalabilidade

---

## 📊 Collections

### 1. **users**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String, // hashed
  avatar: String, // URL da imagem
  isSeller: Boolean,
  isAdmin: Boolean,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  status: String, // 'active', 'inactive', 'suspended'
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  preferences: {
    language: String,
    currency: String,
    timezone: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  addresses: [{
    _id: ObjectId,
    type: String, // 'billing', 'shipping'
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ phone: 1 }
{ isSeller: 1 }
{ status: 1 }
{ createdAt: -1 }
```

---

### 2. **sellers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  businessName: String,
  businessDescription: String,
  cnpj: String,
  logo: String, // URL
  banner: String, // URL
  category: String,
  tags: [String],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  businessHours: [{
    day: Number, // 0-6 (Sunday-Saturday)
    open: String, // HH:MM
    close: String, // HH:MM
    isOpen: Boolean
  }],
  deliveryOptions: {
    pickup: Boolean,
    localDelivery: Boolean,
    shipping: Boolean,
    deliveryRadius: Number, // km
    deliveryFee: Number
  },
  paymentMethods: [String], // ['pix', 'credit_card', 'bank_transfer']
  commissionRate: Number, // percentage
  minimumPayout: Number,
  totalSales: Number,
  totalOrders: Number,
  averageRating: Number,
  totalReviews: Number,
  status: String, // 'pending', 'approved', 'rejected', 'suspended'
  approvedAt: Date,
  approvedBy: ObjectId, // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1 } // unique
{ businessName: 1 }
{ cnpj: 1 } // unique
{ status: 1 }
{ category: 1 }
```

---

### 3. **categories**
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  image: String, // URL
  icon: String, // icon name
  parentId: ObjectId, // ref: categories (for subcategories)
  level: Number, // 0 for main categories
  order: Number,
  isActive: Boolean,
  metadata: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ slug: 1 } // unique
{ parentId: 1 }
{ level: 1 }
{ isActive: 1 }
```

---

### 4. **products**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: sellers
  categoryId: ObjectId, // ref: categories
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  images: [String], // URLs
  mainImage: String, // URL
  price: Number,
  comparePrice: Number, // original price for discounts
  costPrice: Number, // seller's cost
  sku: String,
  barcode: String,
  weight: Number, // kg
  dimensions: {
    length: Number, // cm
    width: Number, // cm
    height: Number // cm
  },
  stock: Number,
  minStock: Number, // alert threshold
  maxStock: Number,
  isOrganic: Boolean,
  isGlutenFree: Boolean,
  isVegan: Boolean,
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  tags: [String],
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    _id: ObjectId,
    name: String, // e.g., "Size", "Color"
    options: [{
      value: String,
      price: Number,
      stock: Number,
      sku: String
    }]
  }],
  status: String, // 'draft', 'active', 'inactive', 'out_of_stock'
  isFeatured: Boolean,
  isBestSeller: Boolean,
  viewCount: Number,
  salesCount: Number,
  averageRating: Number,
  totalReviews: Number,
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ slug: 1 } // unique
{ sellerId: 1 }
{ categoryId: 1 }
{ status: 1 }
{ isOrganic: 1 }
{ price: 1 }
{ averageRating: -1 }
{ salesCount: -1 }
{ name: "text", description: "text" } // text search
```

---

### 5. **orders**
```javascript
{
  _id: ObjectId,
  orderNumber: String, // e.g., "ORD-2024-001"
  userId: ObjectId, // ref: users
  sellerId: ObjectId, // ref: sellers
  items: [{
    productId: ObjectId, // ref: products
    variantId: ObjectId, // ref: product variants
    name: String,
    sku: String,
    price: Number,
    quantity: Number,
    total: Number,
    image: String
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  currency: String, // "BRL"
  status: String, // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  paymentMethod: String, // 'credit_card', 'pix', 'paypal'
  paymentIntentId: String, // external payment ID
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  billingAddress: {
    // same structure as shippingAddress
  },
  deliveryMethod: String, // 'pickup', 'local_delivery', 'shipping'
  estimatedDelivery: Date,
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
  sellerNotes: String,
  commission: Number, // platform commission
  sellerAmount: Number, // amount after commission
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}
```

**Indexes:**
```javascript
{ orderNumber: 1 } // unique
{ userId: 1 }
{ sellerId: 1 }
{ status: 1 }
{ paymentStatus: 1 }
{ createdAt: -1 }
```

---

### 6. **reviews**
```javascript
{
  _id: ObjectId,
  productId: ObjectId, // ref: products
  userId: ObjectId, // ref: users
  orderId: ObjectId, // ref: orders
  rating: Number, // 1-5
  title: String,
  comment: String,
  images: [String], // URLs
  isVerified: Boolean, // purchased the product
  helpful: Number, // helpful votes count
  notHelpful: Number, // not helpful votes count
  status: String, // 'pending', 'approved', 'rejected'
  moderatedBy: ObjectId, // ref: users (admin)
  moderatedAt: Date,
  moderationNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ productId: 1 }
{ userId: 1 }
{ orderId: 1 }
{ rating: 1 }
{ status: 1 }
{ createdAt: -1 }
```

---

### 7. **payments**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId, // ref: orders
  userId: ObjectId, // ref: users
  amount: Number,
  currency: String,
  method: String, // 'credit_card', 'pix', 'paypal'
  status: String, // 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'
  externalId: String, // payment gateway ID
  gateway: String, // 'stripe', 'paypal', 'pix'
  gatewayData: Object, // raw gateway response
  cardInfo: {
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number
  },
  pixCode: String,
  pixExpiresAt: Date,
  refunds: [{
    _id: ObjectId,
    amount: Number,
    reason: String,
    status: String,
    externalId: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date
}
```

**Indexes:**
```javascript
{ orderId: 1 } // unique
{ userId: 1 }
{ externalId: 1 }
{ status: 1 }
{ createdAt: -1 }
```

---

### 8. **payouts**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: sellers
  amount: Number,
  currency: String,
  status: String, // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  method: String, // 'bank_transfer', 'pix'
  bankInfo: {
    bank: String,
    agency: String,
    account: String,
    accountType: String
  },
  pixKey: String,
  externalId: String, // payout gateway ID
  orders: [ObjectId], // ref: orders
  commission: Number,
  netAmount: Number, // amount after commission
  scheduledAt: Date,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ sellerId: 1 }
{ status: 1 }
{ externalId: 1 }
{ scheduledAt: 1 }
{ createdAt: -1 }
```

---

### 9. **carts**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  sessionId: String, // for guest users
  items: [{
    productId: ObjectId, // ref: products
    variantId: ObjectId, // ref: product variants
    quantity: Number,
    addedAt: Date
  }],
  expiresAt: Date, // cart expiration
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1 }
{ sessionId: 1 }
{ expiresAt: 1 }
```

---

### 10. **wishlists**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  productId: ObjectId, // ref: products
  addedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1, productId: 1 } // unique compound
{ userId: 1 }
{ addedAt: -1 }
```

---

### 11. **search_history**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users (optional, for guest users)
  sessionId: String,
  query: String,
  filters: Object, // applied filters
  resultsCount: Number,
  clickedProducts: [ObjectId], // ref: products
  createdAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1 }
{ sessionId: 1 }
{ query: 1 }
{ createdAt: -1 }
```

---

### 12. **system_settings**
```javascript
{
  _id: ObjectId,
  key: String, // unique setting key
  value: Mixed, // setting value
  type: String, // 'string', 'number', 'boolean', 'object', 'array'
  category: String, // 'general', 'security', 'payment', 'email', 'notifications'
  description: String,
  isPublic: Boolean, // if setting can be exposed to frontend
  updatedBy: ObjectId, // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ key: 1 } // unique
{ category: 1 }
{ isPublic: 1 }
```

---

### 13. **newsletter_subscribers**
```javascript
{
  _id: ObjectId,
  email: String,
  firstName: String, // optional
  lastName: String, // optional
  status: String, // 'active', 'unsubscribed', 'bounced', 'pending'
  source: String, // 'popup', 'footer', 'signup', 'admin'
  tags: [String], // for segmentation
  preferences: {
    categories: [String], // preferred content categories
    frequency: String, // 'weekly', 'monthly', 'promotional'
    language: String
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  stats: {
    emailsSent: Number,
    emailsOpened: Number,
    emailsClicked: Number,
    lastOpened: Date,
    lastClicked: Date
  },
  unsubscribedAt: Date,
  unsubscribedReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ status: 1 }
{ source: 1 }
{ createdAt: -1 }
{ "preferences.categories": 1 }
```

---

### 14. **newsletter_campaigns**
```javascript
{
  _id: ObjectId,
  name: String,
  subject: String,
  content: String, // HTML content
  plainText: String, // plain text version
  status: String, // 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
  type: String, // 'newsletter', 'promotional', 'announcement', 'welcome'
  segment: {
    tags: [String],
    categories: [String],
    status: String, // 'all', 'active', 'new'
    customFilters: Object
  },
  schedule: {
    scheduledAt: Date,
    timezone: String
  },
  stats: {
    totalSubscribers: Number,
    emailsSent: Number,
    emailsDelivered: Number,
    emailsOpened: Number,
    emailsClicked: Number,
    unsubscribes: Number,
    bounces: Number,
    openRate: Number,
    clickRate: Number
  },
  sentAt: Date,
  sentBy: ObjectId, // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ status: 1 }
{ type: 1 }
{ "schedule.scheduledAt": 1 }
{ createdAt: -1 }
{ sentBy: 1 }
```

---

## 🔗 Relacionamentos

### **Referências Diretas (ObjectId)**
- `users` → `sellers` (1:1)
- `sellers` → `products` (1:N)
- `categories` → `products` (1:N)
- `users` → `orders` (1:N)
- `sellers` → `orders` (1:N)
- `products` → `reviews` (1:N)
- `users` → `reviews` (1:N)
- `orders` → `payments` (1:1)
- `sellers` → `payouts` (1:N)

---

## 📈 Indexes de Performance

### **Indexes Compostos**
```javascript
// Orders - busca por vendedor e status
{ sellerId: 1, status: 1, createdAt: -1 }

// Products - busca por categoria e status
{ categoryId: 1, status: 1, averageRating: -1 }

// Reviews - busca por produto e status
{ productId: 1, status: 1, createdAt: -1 }
```

### **Indexes de Texto**
```javascript
// Products - busca textual
{ name: "text", description: "text", tags: "text" }

// Sellers - busca textual
{ businessName: "text", businessDescription: "text" }
```

---

## 🔒 Segurança e Validação

### **Validações de Schema**
```javascript
// Exemplo para users collection
{
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "firstName", "lastName"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        status: {
          enum: ["active", "inactive", "suspended"]
        }
      }
    }
  }
}
```

---

## 📊 Agregações Comuns

### **1. Dashboard de Vendedor**
```javascript
db.orders.aggregate([
  { $match: { sellerId: ObjectId("..."), status: { $in: ["confirmed", "processing", "shipped"] } } },
  { $group: {
    _id: null,
    totalOrders: { $sum: 1 },
    totalRevenue: { $sum: "$total" },
    averageOrderValue: { $avg: "$total" }
  }}
])
```

### **2. Produtos Mais Vendidos**
```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: {
    _id: "$items.productId",
    totalSold: { $sum: "$items.quantity" },
    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
  }},
  { $sort: { totalSold: -1 } },
  { $limit: 10 }
])
```

---

## 🚀 Estratégias de Escalabilidade

### **Sharding**
- **Shard Key:** `sellerId` (para orders, products, reviews)
- **Shard Key:** `userId` (para orders, reviews, carts)
- **Shard Key:** `createdAt` (para logs e analytics)

### **Replicação**
- **Primary:** 1 node
- **Secondary:** 2 nodes
- **Arbiter:** 1 node (se necessário)

---

## 📋 Migração de Dados

### **Fase 1: Preparação**
1. Criar índices em background
2. Validar integridade dos dados
3. Backup completo

### **Fase 2: Migração**
1. Migrar dados em lotes
2. Validar consistência
3. Atualizar aplicação

---

## 🔍 Monitoramento

### **Métricas Importantes**
- **QPS (Queries per Second)**
- **Latência média de queries**
- **Uso de memória e CPU**
- **Tamanho das collections**

### **Alertas**
- **Latência > 100ms**
- **Uso de memória > 80%**
- **Erros de conexão > 5%**

---

## 📝 Conclusão

Este modelo de dados MongoDB foi projetado para suportar todas as funcionalidades da plataforma Txova, com foco em:

- **Performance:** Índices otimizados para queries comuns
- **Escalabilidade:** Preparado para crescimento
- **Flexibilidade:** Schema que permite evolução
- **Segurança:** Validações e controle de acesso
- **Manutenibilidade:** Estrutura clara e documentada

O modelo está pronto para implementação e pode ser expandido conforme novas funcionalidades sejam adicionadas ao projeto. 