# Rebrand UI/UX Guide - VITRINE

> **Purpose:** Concise guide to rebrand the marketplace UI/UX to VITRINE concept. Focuses exclusively on visual and branding elements, preserving all existing functionality and integrations.

## 🎯 Quick Reference: VITRINE Brand Identity

- **Brand Name:** VITRINE
- **Slogan:** "VITRINE - Tudo que Você Precisa"
- **Logo Symbol:** "V"
- **Primary Color:** Blue (#2563EB, #60A5FA, #1D4ED8)
- **Color Palette:** Blue-based (replaces green)
- **Context:** General marketplace (all categories)
- **Locale:** pt-MZ (maintains Mozambique context)
- **Currency:** MZN (Meticais)

---

## 📋 Rebrand Checklist

### 1. Color System & Theme

#### Files to Update:
- `tailwind.config.ts`
- `app/globals.css`

#### Changes:
- **Primary color:** Replace green (#00BE27) → Blue (#2563EB)
- **Color variants:** Update `primary.soft` and `primary.hard` to blue shades
- **CSS Variables:** Update `--primary` and `--ring` in `:root` and `.dark`
- **Theme color:** Update meta theme-color tags

#### Search & Replace:
```typescript
// tailwind.config.ts
primary: {
  DEFAULT: '#2563EB',  // was: '#00BE27'
  soft: '#60A5FA',     // was: '#6AC187'
  hard: '#1D4ED8',     // was: '#2C762F'
}

// globals.css
--primary: 217 91% 60%;  // Blue HSL equivalent
--ring: 217 91% 60%;
```

---

### 2. Brand Name & Text Content

#### Files to Update:
- `app/layout.tsx` (metadata, titles)
- `app/page.tsx` (hero section, CTAs)
- `components/layout/Header.tsx` (logo, navigation)
- `components/layout/Footer.tsx` (logo, description, contact)
- All content pages: `app/(content)/**/*.tsx`
- All admin pages: `app/(admin)/admin/**/*.tsx`
- All buyer pages: `app/(buyer)/**/*.tsx`
- All seller pages: `app/(seller)/**/*.tsx`
- All support pages: `app/(support)/**/*.tsx`

#### Changes:
- Replace brand name: `[CURRENT_BRAND]` → `VITRINE`
- Update slogan: `"VITRINE - Tudo que Você Precisa"`
- Update descriptions: "Marketplace completo com produtos de qualidade"
- Update logo symbol: Change initial letter to "V"

#### Search Pattern:
```bash
# Find all brand references
grep -r "[CURRENT_BRAND]" . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
```

---

### 3. SEO & Metadata

#### Files to Update:
- `app/layout.tsx`
- `lib/seo.ts`
- `components/seo/StructuredData.tsx`
- `app/sitemap.ts`

#### Changes:
- **Title:** "VITRINE - Marketplace Completo"
- **Description:** "Marketplace completo com produtos de qualidade em todas as categorias"
- **Keywords:** marketplace, eletrônicos, moda, esportes, casa, beleza
- **Open Graph:** Update siteName, title, description
- **Twitter Cards:** Update site, creator handles
- **URL Base:** Update to `https://vitrine.com` (if applicable)
- **Organization Schema:** Update name, description, logo

---

### 4. PWA Manifest

#### Files to Update:
- `public/manifest.json`
- `app/api/manifest/route.ts` (if exists)

#### Changes:
- **name:** "VITRINE - Marketplace Completo"
- **short_name:** "VITRINE"
- **description:** "Marketplace completo com produtos de qualidade"
- **theme_color:** "#2563EB" (blue)
- **background_color:** "#ffffff"
- **categories:** ["shopping", "business", "lifestyle"]
- **screenshots:** Update if available
- **shortcuts:** Update labels

---

### 5. Service Worker

#### Files to Update:
- `public/sw.js`

#### Changes:
- **Cache names:** `vitrine-v1.0.0`, `vitrine-static-v1.0.0`, `vitrine-dynamic-v1.0.0`
- **Notification title:** "VITRINE"
- **Notification messages:** "Nova notificação da VITRINE"

---

### 6. LocalStorage Keys

#### Files to Update:
- `contexts/MarketplaceContext.tsx`
- Any hooks using localStorage: `hooks/useCart.ts`, `hooks/useWishlist.ts`, etc.

#### Changes:
- Update localStorage key prefixes: `[current_prefix]_*` → `vitrine_*`
- Examples:
  - `vitrine_cart`
  - `vitrine_wishlist`
  - `vitrine_user_preferences`

---

### 7. Contact Information

#### Files to Update:
- `components/layout/Footer.tsx`
- `app/(content)/contato/page.tsx`
- `app/(admin)/admin/configuracoes/page.tsx`

#### Changes:
- **Email:** `contato@vitrine.com`
- **Phone:** Maintain Mozambique format (+258)
- **Address:** Maintain Mozambique context (Beira, Sofala)
- **Social Media:** Update handles if applicable

---

### 8. Mock Data & Content

#### Files to Update:
- `contexts/MarketplaceContext.tsx`
- All pages with mock data

#### Changes:
- **Products:** Update to general marketplace categories (electronics, fashion, sports, etc.)
- **Sellers:** Update store names (TechStore, FashionStore, etc.)
- **Categories:** General categories instead of organic-specific
- **Blog Posts:** Update titles and content to general marketplace topics
- **Reviews:** Update to reflect general products

---

### 9. Promotional Banners & Hero Sections

#### Files to Update:
- `app/page.tsx` (homepage promotional banner)
- Any other pages with promotional banners

#### Changes:
- **Banner Images:** Replace niche-specific images (e.g., organic foods) with general marketplace images
  - Use images representing diverse products (shopping, technology, fashion, etc.)
  - Example: Replace fruit/vegetable images with shopping/technology images
- **Alt Text:** Update image alt attributes to reflect new context
- **Statistics Labels:** Update text colors if using brand-specific color classes
  - Example: `text-green-gray-2` → `text-white/80` for white text on colored backgrounds
- **Descriptions:** Update promotional text to match new marketplace context

#### Example Updates:
```tsx
// Before (organic foods)
<img src="organic-fruits.jpg" alt="Alimentos Orgânicos" />
<div className="text-green-gray-2">Produtos</div>

// After (general marketplace)
<img src="shopping-technology.jpg" alt="VITRINE - Marketplace Confiável" />
<div className="text-white/80">Produtos</div>
```

---

### 10. Blog & News Sections

#### Files to Update:
- `app/page.tsx` (homepage blog/news section)
- `contexts/MarketplaceContext.tsx` (mock blog posts)
- Any blog listing pages

#### Changes:
- **Blog Post Titles:** Update from niche-specific to general marketplace topics
  - Example: "Benefícios dos Alimentos Orgânicos" → "Como Escolher os Melhores Produtos Online"
- **Blog Post Descriptions:** Update excerpts to match new context
- **Blog Post Images:** Replace niche-specific images with general marketplace images
- **Blog Categories:** Update categories (e.g., "Saúde", "Cultivo" → "Dicas", "Tendências", "Segurança")
- **Blog Tags:** Update tags to reflect general marketplace topics

#### Example Blog Post Updates:
```tsx
// Before (organic foods)
{
  title: 'Benefícios dos Alimentos Orgânicos para a Saúde',
  description: 'Descubra como os alimentos orgânicos podem transformar sua saúde...',
  image: 'organic-food.jpg',
  category: 'Saúde',
  tags: ['orgânico', 'saúde', 'nutrição']
}

// After (general marketplace)
{
  title: 'Como Escolher os Melhores Produtos Online',
  description: 'Dicas essenciais para fazer compras inteligentes...',
  image: 'shopping-online.jpg',
  category: 'Dicas',
  tags: ['compras online', 'dicas', 'qualidade']
}
```

#### Suggested Blog Topics for General Marketplace:
- "Como Escolher os Melhores Produtos Online"
- "Tendências de Moda e Tecnologia em 2024"
- "Guia Completo de Compras Online Seguras"
- "Os Melhores Produtos para Casa e Decoração"
- "Dicas de Economia nas Compras Online"
- "Produtos Essenciais para o Dia a Dia"

---

### 11. Component Visual Updates

#### Files to Update:
- `components/common/ProductCard.tsx`
- `components/common/SellerCard.tsx`
- All UI components using primary color

#### Changes:
- Update color classes: `bg-primary` will automatically use new blue
- Update any hardcoded color values
- Ensure logo/branding elements show "V" or "VITRINE"

---

### 12. Email & Notifications

#### Files to Update:
- `app/(admin)/admin/newsletter/**/*.tsx`
- Any email templates or notification components

#### Changes:
- **Sender name:** "VITRINE"
- **Sender email:** "VITRINE <noreply@vitrine.com>"
- **Email templates:** Update branding in templates

---

## 🔍 Verification Commands

After rebranding, verify changes with:

```bash
# Check brand name references
grep -r "VITRINE" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json"

# Check primary color usage
grep -r "#2563EB\|#60A5FA\|#1D4ED8" . --include="*.ts" --include="*.tsx" --include="*.css"

# Check localStorage keys
grep -r "vitrine_" . --include="*.ts" --include="*.tsx"

# Check old brand references (replace [OLD_BRAND])
grep -r "[OLD_BRAND]" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json"
```

---

## 📁 Complete File List

### Core Configuration (4 files)
1. `tailwind.config.ts`
2. `app/globals.css`
3. `components.json`
4. `app/layout.tsx`

### Layout Components (2 files)
5. `components/layout/Header.tsx`
6. `components/layout/Footer.tsx`

### Context & State (3 files)
7. `contexts/MarketplaceContext.tsx`
8. `lib/seo.ts`
9. `components/seo/StructuredData.tsx`

### PWA & Service Worker (3 files)
10. `public/manifest.json`
11. `public/sw.js`
12. `app/sitemap.ts`

### Content Pages (5 files)
13. `app/(content)/sobre/page.tsx`
14. `app/(content)/faq/page.tsx`
15. `app/(content)/contato/page.tsx`
16. `app/(content)/ajuda/page.tsx`
17. `app/(content)/seja-vendedor/page.tsx`

### Home Page (1 file)
18. `app/page.tsx` (includes promotional banner and blog/news sections)

### Admin Pages (15+ files)
19. `app/(admin)/admin/page.tsx`
20. `app/(admin)/admin/configuracoes/page.tsx`
21. `app/(admin)/admin/produtos/**/*.tsx` (all product pages)
22. `app/(admin)/admin/vendedores/**/*.tsx` (all seller pages)
23. `app/(admin)/admin/categorias/page.tsx`
24. `app/(admin)/admin/newsletter/**/*.tsx` (all newsletter pages)
25. `app/(admin)/admin/pedidos/page.tsx`
26. `app/(admin)/admin/usuarios/**/*.tsx`
27. `app/(admin)/admin/tickets/**/*.tsx`
28. `app/(admin)/admin/reembolsos/page.tsx`
29. `app/(admin)/admin/relatorios/page.tsx`

### Common Components (2 files)
30. `components/common/ProductCard.tsx`
31. `components/common/SellerCard.tsx`

### Hooks (if using localStorage)
32. `hooks/useCart.ts`
33. `hooks/useWishlist.ts`
34. Any other hooks with localStorage

**Total: ~35-40 files** (depending on structure)

---

## ✅ Post-Rebrand Checklist

- [ ] All color references updated (primary, theme-color, CSS variables)
- [ ] Brand name replaced in all text content
- [ ] Logo/symbol updated to "V"
- [ ] SEO metadata updated (titles, descriptions, OG tags)
- [ ] PWA manifest updated
- [ ] Service worker cache names updated
- [ ] LocalStorage keys updated
- [ ] Contact information updated
- [ ] Mock data reflects general marketplace
- [ ] Promotional banners updated with new images and context
- [ ] Blog/news sections updated with general marketplace topics
- [ ] All pages visually tested
- [ ] Responsive design verified
- [ ] Dark mode tested (if applicable)
- [ ] No console errors
- [ ] No broken links or references

---

## 🎨 VITRINE Color Palette

```css
/* Primary Colors */
--primary: #2563EB;      /* Main blue */
--primary-soft: #60A5FA;  /* Light blue */
--primary-hard: #1D4ED8;  /* Dark blue */

/* Tailwind Classes */
bg-primary → #2563EB
text-primary → #2563EB
border-primary → #2563EB
```

---

## 📝 Notes

- **Preserve Functionality:** Only change visual/branding elements. Do not modify business logic, API integrations, or data structures.
- **Maintain Context:** Keep Mozambique locale (pt-MZ), currency (MZN), and local contact formats.
- **Progressive Update:** Update files systematically, test after each major section.
- **Version Control:** Commit changes in logical groups (colors, branding, content, etc.).

---

**Last Updated:** Based on VITRINE.md transformation  
**Focus:** UI/UX rebranding only  
**Status:** Template for rebranding to VITRINE or any other brand

