# Backend API Endpoints - Status Report
## Response to Frontend Integration Gaps Analysis

**Date:** 2026-01-26  
**Status:** Endpoints Inventory Complete  
**API Base URL:** `/api/v1`

---

## 📋 Executive Summary

This document provides a complete inventory of **available** and **missing** backend endpoints based on the frontend integration requirements. We've organized endpoints by priority and implementation status.

### Quick Status Overview

| Category | Available ✅ | Missing ❌ | Notes |
|----------|-------------|-----------|--------|
| **Blog System** | ✅ Complete | ⚠️ Partial | Public routes exist, need featured/popular |
| **Sellers Directory** | ❌ None | ❌ Critical | Need public seller endpoints |
| **Contact Form** | ❌ None | ❌ Critical | No contact endpoint exists |
| **Newsletter Signup** | ⚠️ Admin Only | ❌ Critical | Need public subscription route |
| **Seller Application** | ⚠️ Via Auth | ⚠️ Enhancement | Can use auth registration, needs dedicated flow |
| **Search Suggestions** | ⚠️ Basic | ⚠️ Enhancement | Search exists, autocomplete missing |
| **Content Management** | ❌ None | ⚠️ Medium | No CMS endpoints |
| **Recommendations** | ❌ None | ⚠️ Low | No recommendation engine |

---

## ✅ AVAILABLE ENDPOINTS - Ready for Integration

### 1. Blog System (Public Routes) ✅

**Status:** Fully implemented and ready  
**Base Route:** `/api/v1/blog`

#### Available Endpoints:

```typescript
// Get published blog posts with filters
GET /api/v1/blog
Query Params:
  - search?: string
  - category?: string
  - isFeatured?: boolean
  - tags?: string (comma-separated)
  - page?: number
  - limit?: number
  - sortBy?: string
  - sortOrder?: 'asc' | 'desc'

Response:
{
  success: true,
  data: {
    posts: BlogPost[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}

// Get single post by slug
GET /api/v1/blog/slug/:slug
Response:
{
  success: true,
  data: {
    ...post,
    relatedPosts: BlogPost[] // Automatically included!
  }
}

// Get blog categories
GET /api/v1/blog/categories
Response:
{
  success: true,
  data: string[] // Array of unique categories
}

// Get blog tags
GET /api/v1/blog/tags
Response:
{
  success: true,
  data: string[] // Array of unique tags
}
```

#### Integration Notes:
- ✅ All public blog endpoints are ready
- ✅ Related posts are automatically returned with each post
- ✅ Supports filtering, search, pagination
- ⚠️ Frontend asks for `GET /blog/featured` and `GET /blog/popular` but these can be achieved using query params: `GET /blog?isFeatured=true`

#### Recommended Hook Structure:
```typescript
// hooks/useBlog.ts
export const useBlogPosts = (filters) => {
  return useQuery({
    queryKey: ['blog', 'posts', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/blog?${params}`);
      return response.data.data;
    }
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/slug/${slug}`);
      return response.data.data; // Includes relatedPosts
    }
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/blog/categories');
      return response.data.data;
    }
  });
};
```

---

### 2. Products & Search ✅

**Status:** Fully implemented  
**Base Route:** `/api/v1/products`

#### Available Endpoints:

```typescript
// Get all products with filters
GET /api/v1/products
Query Params:
  - category?: string
  - minPrice?: number
  - maxPrice?: number
  - search?: string
  - seller?: string
  - status?: string
  - page?: number
  - limit?: number

// Search products
GET /api/v1/products/search?q=searchTerm

// Get featured products
GET /api/v1/products/featured

// Get best sellers
GET /api/v1/products/best-sellers

// Get new arrivals
GET /api/v1/products/new-arrivals

// Get product by ID
GET /api/v1/products/:productId

// Get product by slug
GET /api/v1/products/slug/:slug

// Get products by category
GET /api/v1/products/category/:categoryId
```

#### Integration Notes:
- ✅ All product listing and filtering works
- ✅ Search is available but no autocomplete endpoint
- ✅ Featured, best-sellers, new-arrivals endpoints exist

---

### 3. Authentication & User Management ✅

**Status:** Fully implemented  
**Base Route:** `/api/v1/auth`

#### Available Endpoints:

```typescript
// Register new user (buyer, seller, or admin)
POST /api/v1/auth/register
Body:
{
  name: string,
  email: string,
  password: string,
  role?: 'buyer' | 'seller' | 'admin', // Optional, defaults to 'buyer'
  businessName?: string, // Required if role=seller
  businessAddress?: string, // Required if role=seller
  taxId?: string // Optional for seller
}

// Login
POST /api/v1/auth/login

// Get profile
GET /api/v1/auth/me (requires token)

// Update profile
PUT /api/v1/auth/me (requires token)

// Change password
PUT /api/v1/auth/change-password (requires token)

// Forgot password
POST /api/v1/auth/forgot-password

// Reset password
POST /api/v1/auth/reset-password

// Refresh token
POST /api/v1/auth/refresh

// Logout
POST /api/v1/auth/logout (requires token)
```

#### Integration Notes:
- ✅ Seller registration is available via `/auth/register` with `role: 'seller'`
- ⚠️ No dedicated `/sellers/apply` endpoint, but registration handles it
- ✅ All auth flows are complete

---

### 4. Email Service (Limited) ⚠️

**Status:** Test endpoints only, no production contact form  
**Base Route:** `/api/v1/email`

#### Available Endpoints:

```typescript
// Test email service
POST /api/v1/email/test

// Get email service status
GET /api/v1/email/status

// Send welcome email (internal use)
POST /api/v1/email/welcome

// Send password reset email (internal use)
POST /api/v1/email/password-reset

// Send newsletter (admin only)
POST /api/v1/email/newsletter (requires admin auth)

// Send custom email (admin only)
POST /api/v1/email/send (requires admin auth)
```

#### Integration Notes:
- ❌ **NO PUBLIC CONTACT FORM ENDPOINT EXISTS**
- ✅ Email infrastructure is set up (uses Brevo/Sendinblue)
- ❌ Need to create `POST /api/v1/contact` for contact form submissions

---

### 5. Newsletter (Admin Only) ⚠️

**Status:** Admin endpoints only, no public subscription  
**Base Route:** `/api/v1/admin/newsletter`

#### Available Endpoints (Admin Only):

```typescript
// Get newsletter stats
GET /api/v1/admin/newsletter/stats (admin only)

// Get all subscribers
GET /api/v1/admin/newsletter/subscribers (admin only)

// Create subscriber
POST /api/v1/admin/newsletter/subscribers (admin only)

// Update subscriber
PUT /api/v1/admin/newsletter/subscribers/:subscriberId (admin only)

// Update subscriber status
PATCH /api/v1/admin/newsletter/subscribers/:subscriberId/status (admin only)

// Delete subscriber
DELETE /api/v1/admin/newsletter/subscribers/:subscriberId (admin only)

// Campaign management (admin only)
GET /api/v1/admin/newsletter/campaigns
POST /api/v1/admin/newsletter/campaigns
PUT /api/v1/admin/newsletter/campaigns/:campaignId
DELETE /api/v1/admin/newsletter/campaigns/:campaignId
```

#### Integration Notes:
- ❌ **NO PUBLIC SUBSCRIPTION ENDPOINT**
- ✅ Admin can manage subscribers and campaigns
- ❌ Frontend newsletter popup and footer form have nowhere to submit
- 🚨 **CRITICAL:** Need public endpoint `POST /api/v1/newsletter/subscribe`

---

### 6. Seller Management (Admin Only) ⚠️

**Status:** Admin-only endpoints, no public directory  
**Base Route:** `/api/v1/admin/sellers`

#### Available Endpoints (Admin Only):

```typescript
// Get seller statistics
GET /api/v1/admin/sellers/stats (admin only)

// Get all sellers
GET /api/v1/admin/sellers (admin only)

// Create seller
POST /api/v1/admin/sellers (admin only)

// Get seller by ID
GET /api/v1/admin/sellers/:sellerId (admin only)

// Update seller
PUT /api/v1/admin/sellers/:sellerId (admin only)

// Update seller status
PATCH /api/v1/admin/sellers/:sellerId/status (admin only)
```

#### Integration Notes:
- ❌ **NO PUBLIC SELLER DIRECTORY ENDPOINTS**
- ✅ Sellers can be created via `/auth/register` with `role: 'seller'`
- ❌ No public seller profile endpoint
- ❌ No public seller listing endpoint
- 🚨 **CRITICAL:** Need complete public seller API (see Missing Endpoints section)

---

### 7. Other Integrated Features ✅

All these are already integrated and working:

- ✅ **Cart:** `/api/v1/cart` - Complete CRUD operations
- ✅ **Orders:** `/api/v1/orders` - Create, track, manage orders
- ✅ **Payments:** `/api/v1/payments` - Process payments (Stripe, iMali, manual)
- ✅ **Reviews:** `/api/v1/reviews` - Create, view, moderate reviews
- ✅ **Wishlist:** `/api/v1/wishlist` - Add, remove, move to cart
- ✅ **Refunds:** `/api/v1/refunds` - Request and manage refunds
- ✅ **Tickets:** `/api/v1/tickets` - Support ticket system
- ✅ **Payouts:** `/api/v1/payouts` - Seller payout requests
- ✅ **Seller Finances:** `/api/v1/seller/finances` - Financial tracking
- ✅ **Categories:** `/api/v1/categories` - Product categories
- ✅ **Admin Dashboard:** `/api/v1/admin/dashboard` - Admin analytics

---

## ❌ MISSING ENDPOINTS - Need Implementation

### 🔴 CRITICAL PRIORITY (Phase 1)

#### 1. Public Seller Endpoints 🚨

**Status:** Does not exist  
**Required for:** `/vendedores` page, `/vendedor/[id]` page

**Endpoints to Create:**

```typescript
// NEW: Public seller directory
GET /api/v1/sellers
Query Params:
  - search?: string
  - category?: string // Filter by products category
  - minRating?: number
  - location?: string
  - verified?: boolean
  - featured?: boolean
  - page?: number
  - limit?: number
  - sortBy?: 'rating' | 'sales' | 'name'
  - sortOrder?: 'asc' | 'desc'

Response:
{
  success: true,
  data: {
    sellers: Array<{
      id: string,
      businessName: string,
      logo?: string,
      description?: string,
      rating: number,
      totalReviews: number,
      totalSales: number,
      location?: string,
      isVerified: boolean,
      isFeatured: boolean,
      memberSince: Date,
      productCategories: string[],
      responseTime?: string,
      responseRate?: number
    }>,
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}

// NEW: Get public seller profile
GET /api/v1/sellers/:sellerId
Response:
{
  success: true,
  data: {
    id: string,
    businessName: string,
    logo?: string,
    description?: string,
    rating: number,
    totalReviews: number,
    totalSales: number,
    totalProducts: number,
    location?: string,
    isVerified: boolean,
    isFeatured: boolean,
    memberSince: Date,
    contactEmail?: string,
    phone?: string,
    website?: string,
    policies: {
      returns?: string,
      shipping?: string,
      warranty?: string
    },
    statistics: {
      avgResponseTime: string,
      responseRate: number,
      avgShippingTime: string,
      successfulOrders: number
    },
    recentProducts: Product[] // Last 8 products
  }
}

// NEW: Get seller's products (public)
GET /api/v1/sellers/:sellerId/products
Query Params:
  - category?: string
  - page?: number
  - limit?: number
  - sortBy?: string
  - sortOrder?: 'asc' | 'desc'

Response:
{
  success: true,
  data: {
    products: Product[],
    pagination: { ... }
  }
}

// NEW: Get top-rated sellers
GET /api/v1/sellers/top
Query Params:
  - limit?: number (default 10)

Response:
{
  success: true,
  data: Seller[]
}

// NEW: Get featured sellers
GET /api/v1/sellers/featured
Query Params:
  - limit?: number (default 6)

Response:
{
  success: true,
  data: Seller[]
}
```

**Implementation Steps:**
1. Create `src/routes/sellers.ts` (public routes)
2. Create `src/controllers/sellerController.ts`
3. Create `src/services/sellerService.ts`
4. Add route to `app.ts`: `app.use('/api/v1/sellers', sellerRoutes);`
5. Ensure only PUBLIC data is exposed (no financial info, no email unless explicitly public)

---

#### 2. Contact Form Endpoint 🚨

**Status:** Does not exist  
**Required for:** `/contato` page

**Endpoint to Create:**

```typescript
// NEW: Submit contact form
POST /api/v1/contact
Body:
{
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string,
  orderNumber?: string // Optional, for order-related inquiries
}

Response:
{
  success: true,
  message: 'Your message has been sent successfully. We will respond within 24 hours.'
}
```

**Implementation Steps:**
1. Create `src/routes/contact.ts`
2. Create `src/controllers/contactController.ts`
3. Use existing email service to send contact form to admin email
4. Optionally store contact submissions in database
5. Add route to `app.ts`: `app.use('/api/v1/contact', contactRoutes);`
6. Add rate limiting (max 5 submissions per IP per hour)

**Email Template Needed:**
- Create `src/templates/emails/contact-form.hbs` for admin notification

---

#### 3. Public Newsletter Subscription 🚨

**Status:** Admin endpoints exist, public route missing  
**Required for:** Newsletter popup, Footer newsletter form

**Endpoint to Create:**

```typescript
// NEW: Public newsletter subscription
POST /api/v1/newsletter/subscribe
Body:
{
  email: string,
  name?: string,
  source?: 'popup' | 'footer' | 'checkout' // Track subscription source
}

Response:
{
  success: true,
  message: 'Successfully subscribed! Please check your email to confirm.'
}

// NEW: Verify email subscription
GET /api/v1/newsletter/verify/:token
Response:
{
  success: true,
  message: 'Email verified successfully!'
}

// NEW: Unsubscribe from newsletter
POST /api/v1/newsletter/unsubscribe
Body:
{
  email: string
}

Response:
{
  success: true,
  message: 'Successfully unsubscribed.'
}

// NEW: Check subscription status
GET /api/v1/newsletter/status/:email
Response:
{
  success: true,
  data: {
    subscribed: boolean,
    verified: boolean,
    subscribedAt?: Date
  }
}
```

**Implementation Steps:**
1. Create `src/routes/newsletter.ts` (public routes, separate from admin)
2. Create `src/controllers/newsletterController.ts`
3. Create `src/services/newsletterService.ts`
4. Add double opt-in verification flow (send confirmation email)
5. Add rate limiting (max 3 subscriptions per IP per day)
6. Add route to `app.ts`: `app.use('/api/v1/newsletter', newsletterRoutes);`

**Email Templates Needed:**
- `src/templates/emails/newsletter-welcome.hbs` - Confirmation email
- `src/templates/emails/newsletter-goodbye.hbs` - Unsubscribe confirmation

---

### 🟡 MEDIUM PRIORITY (Phase 2)

#### 4. Seller Application Workflow ⚠️

**Status:** Can use auth registration, but needs better flow  
**Required for:** `/seja-vendedor` page

**Current Workaround:**
Frontend can use existing `POST /api/v1/auth/register` with `role: 'seller'`

**Recommended Enhancement:**

```typescript
// NEW: Dedicated seller application
POST /api/v1/sellers/apply
Body:
{
  // Personal info
  name: string,
  email: string,
  phone: string,
  
  // Business info
  businessName: string,
  businessType: 'individual' | 'company',
  businessAddress: string,
  taxId: string,
  
  // Additional info
  description: string,
  website?: string,
  productCategories: string[],
  estimatedMonthlyVolume?: string,
  
  // Documents (optional initially)
  documents?: {
    businessLicense?: string, // File URL
    taxCertificate?: string,
    idDocument?: string
  }
}

Response:
{
  success: true,
  message: 'Your seller application has been submitted! We will review it within 2-3 business days.',
  data: {
    applicationId: string,
    status: 'pending',
    submittedAt: Date
  }
}

// NEW: Check application status
GET /api/v1/sellers/application/:applicationId
Response:
{
  success: true,
  data: {
    applicationId: string,
    status: 'pending' | 'approved' | 'rejected',
    submittedAt: Date,
    reviewedAt?: Date,
    notes?: string
  }
}
```

**Implementation Steps:**
1. Create seller application workflow in `sellerService.ts`
2. Store applications separately from users
3. Send email confirmation when application is submitted
4. Admin can approve/reject from admin panel
5. On approval, create seller account automatically

---

#### 5. Content Management System (CMS) ⚠️

**Status:** Does not exist  
**Required for:** `/sobre`, `/termos`, `/privacidade`, `/faq`, etc.

**Option 1: Use Blog System for Pages**
- Frontend can treat blog posts with a special category (e.g., "page") as static content
- No new backend needed
- Limited flexibility

**Option 2: Dedicated CMS Endpoints (Recommended)**

```typescript
// NEW: Get page content by slug
GET /api/v1/content/:slug
Response:
{
  success: true,
  data: {
    slug: string,
    title: string,
    content: string, // HTML content
    metaTitle?: string,
    metaDescription?: string,
    lastUpdated: Date
  }
}

// Admin routes for content management
POST /api/v1/admin/content (create page)
PUT /api/v1/admin/content/:slug (update page)
DELETE /api/v1/admin/content/:slug (delete page)
GET /api/v1/admin/content (list all pages)
```

**Implementation Steps:**
1. Create `Content` model
2. Create `src/routes/content.ts` (public)
3. Create `src/routes/adminContent.ts` (admin only)
4. Create controllers and services
5. Add WYSIWYG editor support in admin panel

---

### 🟢 LOW PRIORITY (Phase 3+)

#### 6. Search Autocomplete & Suggestions ⚠️

**Status:** Basic search exists, autocomplete missing  
**Required for:** Better search UX

```typescript
// NEW: Search suggestions/autocomplete
GET /api/v1/search/suggestions
Query Params:
  - q: string (search query)
  - limit?: number (default 10)

Response:
{
  success: true,
  data: {
    products: Array<{ id, name, image, price }>, // Top 5 matching products
    categories: string[], // Matching categories
    sellers: Array<{ id, businessName, logo }>, // Matching sellers
    suggestions: string[] // Search term suggestions
  }
}
```

**Implementation Steps:**
1. Create `src/routes/search.ts`
2. Implement autocomplete with MongoDB text search
3. Add debouncing in frontend
4. Cache frequent searches
5. Track search queries for analytics

---

#### 7. Product Recommendations Engine ⚠️

**Status:** Does not exist  
**Required for:** Enhanced shopping experience

```typescript
// NEW: Related products
GET /api/v1/products/:productId/related
Query Params:
  - limit?: number (default 8)

Response:
{
  success: true,
  data: Product[]
}

// NEW: Frequently bought together
GET /api/v1/products/:productId/frequently-bought-together
Response:
{
  success: true,
  data: Product[]
}

// NEW: Personalized recommendations
GET /api/v1/recommendations (requires auth)
Response:
{
  success: true,
  data: {
    forYou: Product[], // Based on browsing history
    trending: Product[], // Trending products
    popular: Product[] // Popular in user's categories
  }
}
```

**Implementation Steps:**
1. Implement basic recommendation algorithm (category-based)
2. Track user browsing history (optional, privacy-conscious)
3. Analyze purchase patterns
4. ML-based recommendations (future enhancement)

---

## 🔧 ENDPOINT MODIFICATIONS NEEDED

### 1. Blog - Add Direct ID Access

Currently blog has `/blog/slug/:slug` but frontend might need:

```typescript
// Add this to existing blog routes
GET /api/v1/blog/:id // Get post by ID (not just slug)
```

### 2. Products - Seller Products Endpoint

Currently products has seller products at:
```
GET /api/v1/products/seller/my-products (requires seller auth)
```

This conflicts with REST conventions. When public seller endpoints are created, ensure:
```
GET /api/v1/sellers/:sellerId/products (public)
GET /api/v1/products/seller/my-products (authenticated seller - existing)
```

---

## 📊 Implementation Roadmap

### Week 1-2: Critical Public-Facing Features

**Priority 1: Public Seller Endpoints** (Estimated: 3-4 days)
- [ ] Create public seller routes (`/api/v1/sellers`)
- [ ] Implement seller directory with filters
- [ ] Implement seller profile page
- [ ] Add seller products endpoint
- [ ] Add top/featured sellers
- [ ] Test with real data
- [ ] Update API documentation

**Priority 2: Contact Form** (Estimated: 1 day)
- [ ] Create contact route (`/api/v1/contact`)
- [ ] Implement email sending
- [ ] Add rate limiting
- [ ] Create email template
- [ ] Test email delivery

**Priority 3: Newsletter Public Subscription** (Estimated: 2 days)
- [ ] Create public newsletter route (`/api/v1/newsletter`)
- [ ] Implement subscription endpoint
- [ ] Add email verification flow
- [ ] Create welcome email template
- [ ] Implement unsubscribe
- [ ] Add rate limiting
- [ ] Test double opt-in flow

---

### Week 3: Content Management

**Priority 4: Seller Application Enhancement** (Estimated: 2-3 days)
- [ ] Create dedicated application endpoint
- [ ] Implement application review workflow
- [ ] Add email notifications
- [ ] Create admin approval interface
- [ ] Test end-to-end flow

**Priority 5: CMS for Static Pages** (Estimated: 3-4 days)
- [ ] Create Content model
- [ ] Create public content routes
- [ ] Create admin content management
- [ ] Migrate existing static pages
- [ ] Test CRUD operations

---

### Week 4+: Enhancements

**Priority 6: Search Autocomplete** (Estimated: 2 days)
- [ ] Create search suggestions endpoint
- [ ] Implement autocomplete logic
- [ ] Add caching
- [ ] Performance optimization

**Priority 7: Recommendations Engine** (Estimated: 3-5 days)
- [ ] Design recommendation algorithm
- [ ] Implement related products
- [ ] Implement frequently bought together
- [ ] Add personalized recommendations
- [ ] A/B testing setup

---

## 📝 Integration Checklist for Frontend Team

### Immediately Available for Integration:

- [x] **Blog System** - All endpoints ready, can start integration now
  - Create `hooks/useBlog.ts`
  - Update `/blog` and `/blog/[id]` pages
  - Remove mock data from `MarketplaceContext`

- [x] **Products & Search** - Already integrated, works well
  - No action needed

- [x] **Authentication** - Complete
  - No action needed

### Waiting for Backend Implementation:

- [ ] **Sellers Directory** - Backend needs to implement first
  - Wait for `GET /api/v1/sellers` endpoint
  - Then create `hooks/useSellers.ts`
  - Update `/vendedores` and `/vendedor/[id]` pages

- [ ] **Contact Form** - Backend needs to implement first
  - Wait for `POST /api/v1/contact` endpoint
  - Then create `hooks/useContact.ts`
  - Update `/contato` page

- [ ] **Newsletter** - Backend needs to implement first
  - Wait for `POST /api/v1/newsletter/subscribe` endpoint
  - Then create `hooks/useNewsletter.ts`
  - Update newsletter popup and footer

### Can Use Workarounds:

- [x] **Seller Registration** - Can use existing auth endpoint
  - Use `POST /api/v1/auth/register` with `role: 'seller'`
  - Include `businessName`, `businessAddress` in registration
  - Later migrate to dedicated application endpoint

---

## 🔐 Authentication & Security Notes

### Public vs Protected Endpoints

**Public (No Auth Required):**
- All blog endpoints
- All product listing endpoints
- Public seller directory (to be created)
- Contact form (to be created)
- Newsletter subscription (to be created)

**Requires Authentication:**
- Cart operations
- Order placement
- Reviews (must own the product to review)
- Wishlist
- Profile management
- Seller dashboard
- Admin panel

**Security Measures in Place:**
- ✅ JWT authentication
- ✅ Role-based authorization (buyer, seller, admin)
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Helmet security headers
- ✅ CORS configured
- ✅ Request body size limits (10MB)
- ✅ Audit logging for admin actions

**Needed for New Endpoints:**
- [ ] Rate limiting for contact form (5 per hour)
- [ ] Rate limiting for newsletter (3 per day)
- [ ] Email verification for newsletter
- [ ] Captcha for public forms (optional enhancement)

---

## 📚 API Documentation

### Current Documentation:
- Extensive inline documentation in `/api/v1` health check
- Individual endpoint docs in code comments
- Feature-specific docs (PAYMENT-SYSTEM-DOCUMENTATION.md, etc.)

### Needed Documentation:
- [ ] OpenAPI/Swagger specification
- [ ] Postman collection for new endpoints
- [ ] Integration examples for frontend
- [ ] Error codes reference

---

## 🎯 Success Metrics

### Backend Completion Criteria:

**Phase 1 Complete When:**
- [ ] Public seller endpoints return real data
- [ ] Contact form sends emails successfully
- [ ] Newsletter subscription works with double opt-in
- [ ] All new endpoints have tests
- [ ] API documentation updated

**Phase 2 Complete When:**
- [ ] Seller application workflow functional
- [ ] CMS endpoints operational
- [ ] Static pages migrated to CMS
- [ ] Admin can manage content

**Phase 3 Complete When:**
- [ ] Search autocomplete returns relevant results
- [ ] Product recommendations show related items
- [ ] Performance metrics acceptable (<200ms response time)

---

## 🐛 Known Issues & Limitations

### Current Limitations:

1. **No Image Upload Endpoint**
   - Products, blog posts, and seller logos reference image URLs
   - Need dedicated image upload endpoint or Cloudinary integration
   - **Workaround:** Use Cloudinary directly from frontend

2. **No Real-time Notifications**
   - No WebSocket or Server-Sent Events
   - Notifications are pull-based (polling)
   - **Enhancement:** Add Socket.io for real-time updates

3. **Limited Search Capabilities**
   - Basic text search on products
   - No fuzzy matching
   - No search analytics
   - **Enhancement:** Implement Elasticsearch or similar

4. **No Bulk Operations**
   - Products, categories, etc. are created one-by-one
   - **Enhancement:** Add bulk import endpoints

5. **Email Service Requires Configuration**
   - Uses Brevo (Sendinblue)
   - Requires SMTP credentials in environment
   - Test mode available for development

---

## 💬 Questions & Support

### For Frontend Team:

**Need Clarification On:**
1. Should seller application create account immediately or require admin approval?
2. What data should be public in seller profiles? (email? phone?)
3. Should newsletter require double opt-in (recommended) or single opt-in?
4. Priority order for missing endpoints - does this match your needs?
5. Do you need pagination on all list endpoints? (currently blog has it, sellers will have it)

**Backend Team Contacts:**
- Technical questions: [Backend team]
- API issues: [Backend team]
- Feature requests: [Backend team]

---

## 🚀 Next Steps

### For Backend Team:
1. ✅ Review this document for accuracy
2. ⏳ Prioritize and assign missing endpoint tasks
3. ⏳ Start with Phase 1 critical endpoints
4. ⏳ Set up testing environment for new features
5. ⏳ Update API documentation as endpoints are added

### For Frontend Team:
1. ✅ Start integrating blog system immediately (all endpoints ready)
2. ⏳ Create placeholder UI for sellers directory (will be ready soon)
3. ⏳ Prepare contact form frontend (backend coming soon)
4. ⏳ Prepare newsletter forms (backend coming soon)
5. ⏳ Remove mock data from pages as APIs become available

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-26  
**Next Review:** After Phase 1 implementation  
**Maintained By:** Backend Team

---

## Appendix A: Quick Reference Table

| Frontend Requirement | Backend Status | Endpoint | Priority | ETA |
|---------------------|----------------|----------|----------|-----|
| Blog listing | ✅ Ready | `GET /api/v1/blog` | - | Now |
| Blog detail | ✅ Ready | `GET /api/v1/blog/slug/:slug` | - | Now |
| Blog categories | ✅ Ready | `GET /api/v1/blog/categories` | - | Now |
| Sellers directory | ❌ Missing | `GET /api/v1/sellers` | 🔴 Critical | Week 1 |
| Seller profile | ❌ Missing | `GET /api/v1/sellers/:id` | 🔴 Critical | Week 1 |
| Seller products | ❌ Missing | `GET /api/v1/sellers/:id/products` | 🔴 Critical | Week 1 |
| Contact form | ❌ Missing | `POST /api/v1/contact` | 🔴 Critical | Week 1 |
| Newsletter signup | ❌ Missing | `POST /api/v1/newsletter/subscribe` | 🔴 Critical | Week 2 |
| Seller application | ⚠️ Workaround | `POST /api/v1/sellers/apply` | 🟡 Medium | Week 3 |
| Static content (CMS) | ❌ Missing | `GET /api/v1/content/:slug` | 🟡 Medium | Week 3 |
| Search autocomplete | ❌ Missing | `GET /api/v1/search/suggestions` | 🟢 Low | Week 4+ |
| Product recommendations | ❌ Missing | `GET /api/v1/products/:id/related` | 🟢 Low | Week 4+ |

---

## Appendix B: Error Response Format

All API endpoints follow this error format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Error details (development only)",
  "statusCode": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Appendix C: Sample API Calls

### Blog Integration Example:

```typescript
// Fetch all blog posts
const response = await fetch('http://localhost:3002/api/v1/blog?page=1&limit=10');
const data = await response.json();
// data.data.posts = BlogPost[]
// data.data.pagination = { page, limit, total, totalPages }

// Fetch single post by slug
const response = await fetch('http://localhost:3002/api/v1/blog/slug/getting-started');
const data = await response.json();
// data.data = { ...post, relatedPosts: [] }
```

### Contact Form Example (Once Implemented):

```typescript
const response = await fetch('http://localhost:3002/api/v1/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    subject: 'Dúvida sobre produto',
    message: 'Gostaria de saber mais sobre...'
  })
});
const data = await response.json();
// data.success = true
// data.message = 'Your message has been sent...'
```

---

**End of Document**
