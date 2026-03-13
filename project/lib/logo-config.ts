/**
 * Logo Configuration
 * 
 * Centralized configuration for logo assets across the application.
 * All logo paths are defined via environment variables in .env.local
 * 
 * If env vars are not set, components will fall back to text-based logos.
 */

export const logoConfig = {
  // Main logo with full branding
  main: process.env.NEXT_PUBLIC_LOGO_MAIN,
  
  // Icon-only version (for small spaces)
  icon: process.env.NEXT_PUBLIC_LOGO_ICON,
  
  // Icon positioned over text
  iconOverText: process.env.NEXT_PUBLIC_LOGO_ICON_OVER_TEXT,
  
  // Monochromatic versions for different backgrounds
  white: process.env.NEXT_PUBLIC_LOGO_WHITE,
  black: process.env.NEXT_PUBLIC_LOGO_BLACK,
  gray: process.env.NEXT_PUBLIC_LOGO_GRAY,
  green: process.env.NEXT_PUBLIC_LOGO_GREEN,
  
  // Favicon
  favicon: process.env.NEXT_PUBLIC_FAVICON,
  
  // Brand name
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME,
} as const;

export type LogoVariant = 'main' | 'icon' | 'iconOverText' | 'white' | 'black' | 'gray' | 'green';
