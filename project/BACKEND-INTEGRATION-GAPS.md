# Backend Integration Gaps Analysis

## Summary
This document identifies all pages and features in the frontend that are **NOT YET integrated** with the backend API, despite having API endpoints available or needing to be implemented.

---

## ✅ Already Integrated Features (No Action Needed)

The following features are **already integrated** with the backend API:

### Core E-commerce
- ✅ **Authentication** - Login, Register, Profile Management (via `AuthContext` and `useAuth`)
- ✅ **Products** - Product listing, search, featured products, best sellers (via `useProducts`)
- ✅ **Categories** - Category management (via `useCategories`)
- ✅ **Cart** - Add, update, remove items (via `useCart`)
- ✅ **Wishlist** - Add/remove from wishlist (via `useWishlist`)
- ✅ **Orders** - Order creation, tracking, history (via `useOrders`)
- ✅ **Payments** - Payment processing (via `usePayments`)
- ✅ **Reviews** - Product reviews and ratings (via `useReviews`)
- ✅ **Refunds** - Refund requests and management (via `useRefunds`)

### Seller Features
- ✅ **Seller Dashboard** - Analytics and stats (via API)
- ✅ **Seller Products** - Product management (via `useProducts` and `useMyProducts`)
- ✅ **Seller Orders** - Order tracking (via `useSellerOrders`)
- ✅ **Seller Finances** - Financial tracking, expenses, income (via `useSellerFinances`)
- ✅ **Payouts** - Payout requests and history (via `usePayouts`)

### Admin Features
- ✅ **Admin Dashboard** - Complete statistics (via `useAdminDashboard`)
- ✅ **Admin Users** - User management (via `useAdminUsers`)
- ✅ **Admin Products** - Product moderation (via `useAdminProducts`)
- ✅ **Admin Orders** - Order management (via `useAdminOrders`)
- ✅ **Admin Sellers** - Seller management (via `useAdminSellers`)
- ✅ **Admin Categories** - Category CRUD (via `useAdminCategories`)
- ✅ **Admin Refunds** - Refund approvals (via `useAdminRefunds`)
- ✅ **Admin Tickets** - Support ticket management (via `useAdminTickets`)
- ✅ **Admin Reports** - Analytics and exports (via `useAdminReports`)
- ✅ **Admin Newsletter** - Subscriber and campaign management (via `useAdminNewsletterStats`, `useAdminSubscribers`, `useAdminCampaigns`)
- ✅ **Admin Blog** - Blog post management (via `useAdminBlogPosts`)
- ✅ **Admin Reviews** - Review moderation and analytics (via `useAdminReviews`, `useReviewAnalytics`, `useModerateReview`)
- ✅ **Admin Audit Logs** - System activity tracking (via `useAdminAuditLogs`)

### Support Features
- ✅ **Ticket System** - Create, view, update tickets (via `useTickets`)

---

## ❌ NOT INTEGRATED - Requires Backend Integration

### 🔴 CRITICAL: Public-Facing Pages (High Priority)

#### 1. **Blog Pages** 📝 ✅ **INTEGRATED**
**Status:** ✅ **Fully integrated with backend API**  
**Backend API:** `GET /blog` in `api/src/routes/blog.ts`  
**Pages Affected:**
- `/blog` - `app/(content)/blog/page.tsx` ✅
- `/blog/[id]` - `app/(content)/blog/[id]/page.tsx` ✅

**Integration Complete:**
- ✅ Created `hooks/useBlog.ts` with:
  - `useBlogPosts()` - Fetch published blog posts with filters
  - `useBlogPost(slug)` - Fetch single post by slug (includes related posts)
  - `useBlogCategories()` - Fetch blog categories
  - `useBlogTags()` - Fetch blog tags
  - `useFeaturedPosts()` - Fetch featured posts
- ✅ Updated blog list page with API integration
- ✅ Updated blog detail page with API integration
- ✅ Added loading states and error handling
- ✅ Implemented pagination
- ✅ Category and tag filtering working

**Backend Endpoints Used:**
```
✅ GET /blog - List blog posts (public)
✅ GET /blog/slug/:slug - Get single post by slug
✅ GET /blog/categories - List categories
✅ GET /blog/tags - List tags
```

---

#### 2. **Sellers Directory Page** 🏪 ✅ **INTEGRATED**
**Status:** ✅ **Fully integrated with backend API**  
**Backend API:** `GET /sellers` in `api/src/routes/sellers.ts`  
**Pages Affected:**
- `/vendedores` - `app/(shop)/vendedores/page.tsx` ✅

**Integration Complete:**
- ✅ Created `hooks/useSellers.ts` with:
  - `useSellers(filters)` - Fetch verified sellers with filters
  - `useTopSellers()` - Fetch top-rated sellers
  - `useFeaturedSellers()` - Fetch featured sellers
  - `useSellerProfile(id)` - Fetch seller public profile
  - `useSellerProducts(id, filters)` - Fetch seller's products
- ✅ Removed mock sellers array
- ✅ Added API-based filtering and pagination
- ✅ Loading states and error handling

**Backend Endpoints Used:**
```
✅ GET /sellers - List verified sellers (public)
✅ GET /sellers/top - Top-rated sellers
✅ GET /sellers/featured - Featured sellers
✅ GET /sellers/:id - Seller profile (public)
✅ GET /sellers/:id/products - Seller products
```

---

#### 3. **Individual Seller Profile Page** 👤 ✅ **INTEGRATED**
**Status:** ✅ **Fully integrated with backend API**  
**Backend API:** `GET /sellers/:id` in `api/src/routes/sellers.ts`  
**Pages Affected:**
- `/vendedor/[id]` - `app/(shop)/vendedor/[id]/page.tsx` ✅

**Integration Complete:**
- ✅ Uses `useSellerProfile()` hook
- ✅ Uses `useSellerProducts()` for product listing
- ✅ Removed mock data
- ✅ Dynamic seller information from API
- ✅ Seller's products with filtering

---

#### 4. **Contact Form** 📧 ✅ **INTEGRATED**
**Status:** ✅ **Fully integrated with backend API**  
**Backend API:** `POST /contact` in `api/src/routes/contact.ts`  
**Pages Affected:**
- `/contato` - `app/(content)/contato/page.tsx` ✅

**Integration Complete:**
- ✅ Created `hooks/useContact.ts` with:
  - `useSubmitContactForm()` - Submit contact form to API
- ✅ Updated contact page to use hook
- ✅ Added loading state during submission
- ✅ Form validation and error handling
- ✅ Success toast notifications

**Backend Endpoint Used:**
```
✅ POST /contact - Submit contact form (with rate limiting)
```

---

#### 5. **Newsletter Popup** 📬 ✅ **INTEGRATED**
**Status:** ✅ **Fully integrated with backend API**  
**Backend API:** `POST /newsletter/subscribe` in `api/src/routes/newsletter.ts`  
**Components Affected:**
- `components/popups/NewsletterPopup.tsx` ✅
- `components/layout/Footer.tsx` (footer newsletter form) ✅

**Integration Complete:**
- ✅ Created `hooks/useNewsletter.ts` with:
  - `useNewsletterSubscribe()` - Subscribe to newsletter
  - `useNewsletterUnsubscribe()` - Unsubscribe from newsletter
  - `useNewsletterStatus()` - Check subscription status
- ✅ Updated newsletter popup with API integration
- ✅ Updated footer newsletter form
- ✅ Removed localStorage mock data
- ✅ Loading states and toast notifications
- ✅ Tracks subscription source (popup/footer)

**Backend Endpoints Used:**
```
✅ POST /newsletter/subscribe - Public subscription (with rate limiting)
✅ POST /newsletter/unsubscribe - Unsubscribe
✅ GET /newsletter/status/:email - Check status
```

---

### 🟡 MEDIUM PRIORITY: Content Pages

#### 6. **Static Content Pages** 📄
**Status:** Hardcoded HTML content  
**Backend API:** Could use admin blog or create CMS endpoints  
**Pages Affected:**
- `/sobre` - About page
- `/termos` - Terms of service
- `/privacidade` - Privacy policy
- `/trocas-devolucoes` - Returns and exchanges
- `/seja-vendedor` - Become a seller (landing page)
- `/faq` - FAQ page
- `/ajuda` - Help page

**Current Issue:**
- All content is hardcoded in TSX files
- Cannot be updated without code deployment
- No content management system

**Recommended Integration:**
- Option 1: Use admin blog system for content pages
- Option 2: Create dedicated CMS endpoints:
  ```
  GET /content/:slug - Fetch page content
  PUT /admin/content/:slug - Update content (admin)
  ```
- Create `hooks/useContent.ts` for fetching dynamic content

---

### 🟢 LOW PRIORITY: Enhancement Features

#### 7. **Search Suggestions** 🔍
**Status:** Functional but could use backend search  
**Backend API:** `GET /products/search` exists but no autocomplete  
**Components Affected:**
- `components/search/SearchSuggestions.tsx`
- `components/layout/Header.tsx` (search bar)

**Enhancement Needed:**
- Add autocomplete endpoint: `GET /search/suggestions?q=query`
- Return product names, categories, seller names
- Implement debounced search with React Query

---

#### 8. **Advanced Filters** 🎯
**Status:** UI exists but limited backend filtering  
**Components Affected:**
- `components/search/AdvancedFilters.tsx`
- `app/(shop)/busca/page.tsx`

**Enhancement Needed:**
- Expand product API to support:
  - Price range filtering
  - Multiple category selection
  - Seller filtering
  - Rating filtering
  - Stock availability filtering
- Backend already supports some filters via `GET /products?filters`

---

#### 9. **Seller Application Form** 📝
**Status:** Form exists but no submission  
**Pages Affected:**
- `/seja-vendedor` - `app/(content)/seja-vendedor/page.tsx`

**Current Issue:**
- Beautiful landing page with form
- Form submission not implemented
- Should create seller account or send application

**Required Integration:**
- Create `hooks/useSellerApplication.ts` with:
  - `useSubmitSellerApplication()` - Submit seller registration
- Backend endpoint: `POST /sellers/apply` or use `POST /auth/register?role=seller`

---

#### 10. **Product Recommendations** 💡
**Status:** Not implemented  
**Backend API:** Could create recommendation engine  

**Enhancement Ideas:**
- Related products on product page
- "Frequently bought together"
- "You might also like"
- Personalized recommendations based on browsing history

**Backend Endpoints Needed:**
```
GET /products/:id/related - Related products
GET /products/:id/frequently-bought-together
GET /recommendations - Personalized recommendations
```

---

## 📋 Integration Priority Roadmap

### Phase 1: Critical Public-Facing Features ✅ **COMPLETE**
1. **Blog Integration** ⭐⭐⭐⭐⭐ ✅ **COMPLETE**
   - ✅ Created `hooks/useBlog.ts`
   - ✅ Updated blog list page with API integration
   - ✅ Updated blog detail page with API integration
   - ✅ Added pagination, filtering, loading states

2. **Sellers Directory** ⭐⭐⭐⭐⭐ ✅ **COMPLETE**
   - ✅ Created public seller endpoints (backend)
   - ✅ Created `hooks/useSellers.ts`
   - ✅ Updated sellers directory page
   - ✅ Updated seller profile page
   - ✅ Added pagination and filtering

3. **Contact Form** ⭐⭐⭐⭐ ✅ **COMPLETE**
   - ✅ Created `hooks/useContact.ts`
   - ✅ Integrated with email service
   - ✅ Added form validation and rate limiting

4. **Newsletter Signup** ⭐⭐⭐⭐ ✅ **COMPLETE**
   - ✅ Created `hooks/useNewsletter.ts`
   - ✅ Integrated popup form
   - ✅ Integrated footer form
   - ✅ Email delivery with welcome messages

### Phase 2: Content Management (Week 3)
5. **Static Content Pages** ⭐⭐⭐
   - Decide on CMS approach
   - Create content management system
   - Migrate hardcoded content

6. **Seller Application** ⭐⭐⭐
   - Integrate application form
   - Add application review workflow
   - Email notifications for applicants

### Phase 3: Enhancements (Week 4+)
7. **Search Suggestions** ⭐⭐
   - Implement autocomplete
   - Add debouncing
   - Improve UX

8. **Advanced Filtering** ⭐⭐
   - Enhance product filters
   - Add faceted search
   - Performance optimization

9. **Product Recommendations** ⭐
   - Build recommendation engine
   - A/B test recommendations
   - Track conversion improvements

---

## 🔧 Required Backend Endpoints to Create

### Public Seller Endpoints
```typescript
GET    /sellers                    // List public sellers
GET    /sellers/:id                // Seller profile
GET    /sellers/:id/products       // Seller products
GET    /sellers/featured           // Featured sellers
GET    /sellers/top                // Top-rated sellers
```

### Public Blog Endpoints (Already exist in blog.ts, verify they work)
```typescript
GET    /blog                       // Published posts
GET    /blog/:slug                 // Single post by slug
GET    /blog/categories            // Blog categories
GET    /blog/featured              // Featured posts
GET    /blog/popular               // Popular posts
```

### Newsletter Endpoints (May need public route)
```typescript
POST   /newsletter/subscribe       // Public subscription
POST   /newsletter/unsubscribe     // Unsubscribe
GET    /newsletter/verify/:token   // Email verification
```

### Contact & Applications
```typescript
POST   /contact                    // Contact form submission
POST   /sellers/apply              // Seller application
```

### Content Management (Optional)
```typescript
GET    /content/:slug              // Get page content
PUT    /admin/content/:slug        // Update content (admin only)
POST   /admin/content              // Create page (admin only)
DELETE /admin/content/:slug        // Delete page (admin only)
```

### Search & Recommendations
```typescript
GET    /search/suggestions         // Autocomplete suggestions
GET    /products/:id/related       // Related products
GET    /recommendations            // Personalized recommendations
```

---

## 📝 Implementation Checklist

### For Each Feature Integration:
- [ ] Create React Query hook in `/hooks` directory
- [ ] Add TypeScript types to `/types/api.ts`
- [ ] Update page/component to use hook instead of mock data
- [ ] Add loading states and error handling
- [ ] Test with real API data
- [ ] Add error boundaries where needed
- [ ] Update documentation

### Example Hook Template:
```typescript
// hooks/useFeatureName.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export const useFeature = () => {
  return useQuery({
    queryKey: ['feature'],
    queryFn: async () => {
      const response = await apiClient.get('/feature');
      return response.data.data;
    },
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: FeatureData) => {
      const response = await apiClient.post('/feature', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature'] });
      toast({
        title: 'Success',
        description: 'Feature created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create feature',
        variant: 'destructive',
      });
    },
  });
};
```

---

## 🎯 Success Metrics

Once integration is complete, verify:
- ✅ No references to `MarketplaceContext.blogPosts`
- ✅ No hardcoded mock data arrays in pages
- ✅ All forms submit to API endpoints
- ✅ Loading states appear during API calls
- ✅ Error messages display on API failures
- ✅ Data updates without page refresh
- ✅ React Query cache invalidation works
- ✅ Authentication flows properly
- ✅ API requests include auth tokens when needed

---

## 📚 Related Documentation

- [API Integration README](./API-INTEGRATION-README.md)
- [Features Analysis](./FEATURES-ANALYSIS.md)
- [Admin Integration Guide](./ADMIN-INTEGRATION-GUIDE.md)
- [Authentication Guide](./AUTHENTICATION-GUIDE.md)

---

**Last Updated:** 2026-01-26  
**Status:** ✅ Phase 1 COMPLETE - All Critical Public-Facing Features Integrated  
**Completed:** Blog, Sellers Directory, Contact Form, Newsletter  
**Next Steps:** Phase 2 - Static Content Pages & Seller Application  
**Next Review:** After Phase 2 completion
