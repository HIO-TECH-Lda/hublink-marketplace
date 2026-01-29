# Color Palette Update - Txova Branding Colors

## New Branding Colors

Based on the official Txova branding, the following colors have been implemented across the application:

### Primary Colors
- **Primary (DEFAULT)**: `#097019` - Dark green, main brand color
- **Primary Soft**: `#14B32E` - Bright green, secondary brand color
- **Primary Hard**: `#083427` - Very dark green, used for emphasis
- **Primary Light**: `#0A8C21` - Medium green for hover states
- **Primary Lighter**: `#E8F5E9` - Very light green for backgrounds

### Supporting Colors (unchanged)
- **Warning**: `#FF7B40` - Orange for warnings
- **Danger**: `#EA4B4E` - Red for errors and destructive actions
- **Gray Scale**: 9 shades from `#F7F7F7` to `#4D4D4D`
- **Green-Gray**: Updated to coordinate with new primary colors

## Files Updated

### Configuration Files
1. **`tailwind.config.ts`**
   - Updated primary color palette
   - Updated green-gray palette to coordinate with new branding

2. **`app/globals.css`**
   - Updated CSS variables for light mode
   - Updated CSS variables for dark mode
   - Adjusted primary, accent, and ring colors

3. **`public/manifest.json`**
   - Updated `theme_color` from `#53B046` to `#097019`

4. **`app/layout.tsx`**
   - Updated `themeColor` metadata
   - Updated `msapplication-TileColor`
   - Updated `theme-color` meta tag
   - Updated Safari mask-icon color

5. **`app/api/manifest/route.ts`**
   - Updated dynamic manifest `theme_color` from `#10b981` to `#097019`

### Component Files
1. **`components/pwa/PWAProvider.tsx`**
   - Updated install prompt to use primary color classes
   - Changed from generic green to branded primary colors

2. **`components/products/ProductCard.tsx`**
   - Updated "New" badge from `bg-green-500` to `bg-primary`

3. **`app/(content)/trocas-devolucoes/page.tsx`**
   - Updated info cards to use primary colors
   - Updated policy sections with primary color highlights

4. **`app/(auth)/criar-conta/page.tsx`**
   - Updated "Become a Seller" section with primary colors

5. **`app/(admin)/admin/vendedores/page.tsx`**
   - Updated dollar sign icon to use primary color

## Color Usage Guidelines

### When to Use Primary Colors
- Brand elements (logos, primary buttons, key CTAs)
- Navigation and headers
- Important highlights and badges
- Links and interactive elements
- Success messages related to core functionality

### When to Use Semantic Colors
- Status indicators (active/inactive/suspended) - Keep as semantic green/yellow/red
- Form validation states
- Alert messages
- Data visualization (charts, graphs)

### CSS Classes Available

#### Tailwind Classes
```css
/* Background */
bg-primary          /* #097019 */
bg-primary-soft     /* #14B32E */
bg-primary-hard     /* #083427 */
bg-primary-light    /* #0A8C21 */
bg-primary-lighter  /* #E8F5E9 */

/* Text */
text-primary
text-primary-soft
text-primary-hard
text-primary-light

/* Border */
border-primary
border-primary-soft
border-primary-hard

/* Opacity */
bg-primary/20       /* 20% opacity */
border-primary/30   /* 30% opacity */
```

#### CSS Variables (for shadcn/ui components)
```css
--primary: 142 96% 24%      /* HSL for #097019 */
--accent: 142 67% 39%       /* HSL for #14B32E */
--ring: 142 96% 24%         /* Focus ring color */
```

## Testing Checklist

- [x] PWA manifest colors updated
- [x] Meta theme colors updated
- [x] Tailwind configuration updated
- [x] CSS variables updated
- [x] Component styles updated
- [x] Dark mode colors coordinated
- [ ] Test on iOS Safari (Apple mobile web app)
- [ ] Test on Android Chrome (PWA install)
- [ ] Test on desktop browsers
- [ ] Verify all interactive states (hover, focus, active)

## Notes

- Status indicators in admin panels retain semantic colors (green for active, yellow for warning, red for error)
- Chart colors in finance utilities remain unchanged for data visualization clarity
- Scrollbar styling remains neutral gray
- The green-gray palette has been updated to create a smooth gradient that aligns with the new branding colors
