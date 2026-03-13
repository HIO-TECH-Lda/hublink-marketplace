# Logo Configuration System

## Overview
This document describes the centralized logo management system implemented across the Vitrine marketplace application.

## Implementation Date
January 26, 2026

---

## Architecture

### Core Files

1. **`lib/logo-config.ts`** - Centralized logo configuration
   - Reads logo paths from environment variables
   - Provides type-safe logo variant options
   - Defines fallback brand name

2. **`components/common/Logo.tsx`** - Reusable Logo component
   - Supports multiple logo variants (main, icon, white, black, etc.)
   - Implements graceful fallback to text-based logo
   - Configurable sizing and styling
   - Optional clickability (links to homepage)

3. **`.env.local`** - Environment configuration (user-created)
   - Stores all logo asset paths
   - Not committed to version control
   - Allows per-environment customization

4. **`.env.example`** - Template for environment variables
   - Documents required/optional logo variables
   - Serves as reference for setup

---

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Logo Configuration
NEXT_PUBLIC_LOGO_MAIN=/logo/Logo-vitrine-fundo-transparente.png
NEXT_PUBLIC_LOGO_ICON=/logo/Favicon-logo-vitrine.png
NEXT_PUBLIC_LOGO_ICON_OVER_TEXT=/logo/Logo-vitrine-fundo-transparente-icon-por-cima-da-fonte.png
NEXT_PUBLIC_LOGO_WHITE=/logo/Logo-vitrine-fundo-transparente-monocromatico-branco.png
NEXT_PUBLIC_LOGO_BLACK=/logo/Logo-vitrine-fundo-transparente-monocromatico-preto.png
NEXT_PUBLIC_LOGO_GRAY=/logo/Logo-vitrine-fundo-transparente-monocromatico--cinza.png
NEXT_PUBLIC_LOGO_GREEN=/logo/Logo-vitrine-fundo-transparente-monocromatico--verde-sem-gradiente.png
NEXT_PUBLIC_FAVICON=/logo/Favicon-logo-vitrine.png
NEXT_PUBLIC_BRAND_NAME=Vitrine
```

### Variable Descriptions

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_LOGO_MAIN` | Main logo for header and public pages | No* |
| `NEXT_PUBLIC_LOGO_ICON` | Icon-only version for compact spaces | No* |
| `NEXT_PUBLIC_LOGO_ICON_OVER_TEXT` | Icon positioned over text variant | No* |
| `NEXT_PUBLIC_LOGO_WHITE` | White monochromatic for dark backgrounds | No* |
| `NEXT_PUBLIC_LOGO_BLACK` | Black monochromatic variant | No* |
| `NEXT_PUBLIC_LOGO_GRAY` | Gray monochromatic variant | No* |
| `NEXT_PUBLIC_LOGO_GREEN` | Green monochromatic variant | No* |
| `NEXT_PUBLIC_FAVICON` | Favicon for browser tab | No* |
| `NEXT_PUBLIC_BRAND_NAME` | Brand name (defaults to "Vitrine") | No |

*Not technically required because the system falls back to text-based logo, but recommended for production.

---

## Logo Assets

All logo files are stored in `/public/logo/`:

```
/public/logo/
├── Logo-vitrine-fundo-transparente.png
├── Favicon-logo-vitrine.png
├── Logo-vitrine-fundo-transparente-icon-por-cima-da-fonte.png
├── Logo-vitrine-fundo-transparente-monocromatico-branco.png
├── Logo-vitrine-fundo-transparente-monocromatico-preto.png
├── Logo-vitrine-fundo-transparente-monocromatico--cinza.png
└── Logo-vitrine-fundo-transparente-monocromatico--verde-sem-gradiente.png
```

---

## Usage

### Basic Usage

```tsx
import Logo from '@/components/common/Logo';

export default function MyComponent() {
  return (
    <Logo 
      variant="main" 
      width={120} 
      height={40} 
      clickable={true}
    />
  );
}
```

### Logo Variants

```tsx
// Main logo (colored, full branding)
<Logo variant="main" />

// Icon only (compact spaces)
<Logo variant="icon" width={40} height={40} />

// White version (dark backgrounds)
<Logo variant="white" />

// Black version (light backgrounds)
<Logo variant="black" />

// Other variants
<Logo variant="gray" />
<Logo variant="green" />
<Logo variant="iconOverText" />
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'main' \| 'icon' \| 'white' \| 'black' \| 'gray' \| 'green' \| 'iconOverText'` | `'main'` | Logo variant to display |
| `width` | `number` | `120` | Width in pixels (Next.js Image) |
| `height` | `number` | `40` | Height in pixels (Next.js Image) |
| `className` | `string` | `''` | Custom CSS classes for logo image |
| `clickable` | `boolean` | `true` | Whether logo links to homepage |
| `showBrandName` | `boolean` | `false` | Show brand name text alongside logo |
| `brandNameClassName` | `string` | `'text-xl sm:text-2xl font-bold text-gray-9'` | Classes for brand name text |
| `containerClassName` | `string` | `'flex items-center space-x-2'` | Classes for logo container |

---

## Fallback Strategy

When environment variables are **not set** (undefined), the Logo component automatically falls back to a text-based logo:

```
┌─────────┬──────────┐
│    T    │  Vitrine   │  ← Circular "T" + Brand Name
└─────────┴──────────┘
```

This ensures:
- ✅ Application works even without `.env.local` configuration
- ✅ Graceful degradation in all environments
- ✅ No broken images or empty spaces
- ✅ Development can proceed without logo files

---

## Updated Components

The following components have been updated to use the new Logo system:

### 1. **`components/layout/Header.tsx`**
- **Usage:** Main logo in public header
- **Variant:** `main`
- **Size:** 120x40px
- **Clickable:** Yes (links to `/`)
- **Context:** Primary navigation bar

### 2. **`components/layout/AdminLayout.tsx`**
- **Usage:** Logo in admin sidebar header
- **Variant:** `main`
- **Size:** 100x32px
- **Clickable:** Yes (links to `/`)
- **Context:** Admin panel navigation

### 3. **`app/layout.tsx`**
- **Usage:** Favicon in page metadata
- **Variant:** Uses `NEXT_PUBLIC_FAVICON` env var
- **Fallback:** Default `/icons/icon-192x192.png`
- **Context:** Browser tab icon, bookmarks, PWA icon

---

## Benefits

### 1. **Single Source of Truth**
All logo paths defined in one place (`.env.local`), making updates simple and consistent.

### 2. **Environment-Specific Configuration**
Different logos per environment:
- Development: Testing logos
- Staging: Staging-branded logos
- Production: Final production logos

### 3. **Type-Safe**
TypeScript ensures valid logo variants and catches errors at compile time.

### 4. **Reusable**
Single `<Logo>` component used across entire application, ensuring consistency.

### 5. **Graceful Fallback**
Works perfectly even without environment configuration.

### 6. **Easy Maintenance**
Update logo across entire app by changing one environment variable.

### 7. **Performance**
Uses Next.js `<Image>` component with automatic optimization.

---

## Setup Instructions

### For Developers

1. **Copy logo assets** to `/public/logo/` directory

2. **Create `.env.local`** file in project root:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_LOGO_MAIN=/logo/Logo-vitrine-fundo-transparente.png
   NEXT_PUBLIC_LOGO_WHITE=/logo/Logo-vitrine-fundo-transparente-monocromatico-branco.png
   NEXT_PUBLIC_FAVICON=/logo/Favicon-logo-vitrine.png
   NEXT_PUBLIC_BRAND_NAME=Vitrine
   ```

4. **Restart Next.js development server**:
   ```bash
   npm run dev
   ```

5. **Verify logos appear** in:
   - Header (public pages)
   - Admin sidebar
   - Browser tab (favicon)

### For Production

1. **Set environment variables** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other: Follow platform-specific instructions

2. **Ensure logo assets** are in `/public/logo/` directory

3. **Deploy** the application

---

## Troubleshooting

### Logo Not Appearing

**Problem:** Logo shows as text-based fallback

**Solutions:**
1. Check `.env.local` file exists in project root
2. Verify environment variable names start with `NEXT_PUBLIC_`
3. Restart Next.js development server (`npm run dev`)
4. Ensure logo file path is correct and file exists
5. Clear browser cache

### Favicon Not Updating

**Problem:** Old favicon still showing in browser

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Check `NEXT_PUBLIC_FAVICON` in `.env.local`
4. Verify favicon file exists at specified path
5. Restart development server

### Logo Too Large/Small

**Problem:** Logo size doesn't look right

**Solutions:**
1. Adjust `width` and `height` props in component usage
2. Use `className` prop for responsive sizing (e.g., `"h-8 sm:h-10 w-auto"`)
3. Consider using different logo variant (icon vs. main)

---

## Best Practices

1. **Always use the Logo component** - Don't hardcode logo paths in components
2. **Choose appropriate variant** - Use `white` for dark backgrounds, `main` for light
3. **Responsive sizing** - Use Tailwind classes like `h-8 sm:h-10 w-auto`
4. **Keep aspect ratio** - Use `w-auto` when setting fixed height
5. **Provide alt text** - Automatically handled by Logo component
6. **Test fallback** - Verify app works without env vars set
7. **Document changes** - Update this file when adding new logo variants

---

## Future Enhancements

Potential improvements for consideration:

- [ ] Dynamic logo switching based on theme (light/dark mode)
- [ ] Animated logo variants
- [ ] SVG logo support for better scaling
- [ ] Logo loading states/skeleton
- [ ] A/B testing different logo variants
- [ ] Logo CDN integration
- [ ] Automated logo optimization pipeline

---

## Related Files

- `lib/logo-config.ts` - Logo configuration utility
- `components/common/Logo.tsx` - Logo component
- `components/layout/Header.tsx` - Public header with logo
- `components/layout/AdminLayout.tsx` - Admin sidebar with logo
- `app/layout.tsx` - Root layout with favicon
- `.env.local` - Environment configuration (not in git)
- `.env.example` - Environment template

---

## Questions or Issues?

If you encounter any issues with the logo system or have suggestions for improvements, please:

1. Check this documentation first
2. Review the troubleshooting section
3. Consult the related files listed above
4. Contact the development team

---

**Last Updated:** January 26, 2026
**Maintained By:** Development Team
