/**
 * Site configuration (app URL and contact emails).
 * Values are read from environment variables so they can be updated without code changes.
 *
 * Add to .env.local:
 *   NEXT_PUBLIC_SITE_NAME=Marketplace
 *   NEXT_PUBLIC_SITE_DESCRIPTION=Marketplace moçambicano da Beira
 *   NEXT_PUBLIC_APP_URL=https://marketplace.co.mz
 *   NEXT_PUBLIC_CONTACT_EMAIL=contato@marketplace.co.mz
 *   NEXT_PUBLIC_SUPPORT_EMAIL=suporte@marketplace.co.mz
 *   NEXT_PUBLIC_PRIVACY_EMAIL=privacidade@marketplace.co.mz
 *   NEXT_PUBLIC_LEGAL_EMAIL=juridico@marketplace.co.mz
 *   NEXT_PUBLIC_NO_REPLY_EMAIL=noreply@marketplace.co.mz
 */

const defaults = {
  siteName: 'Marketplace',
  siteDescription:
    'Marketplace moçambicano da Beira.',
  appUrl: 'https://marketplace.co.mz',
  contactEmail: 'contato@marketplace.co.mz',
  supportEmail: 'suporte@marketplace.co.mz',
  privacyEmail: 'privacidade@marketplace.co.mz',
  legalEmail: 'juridico@marketplace.co.mz',
  noReplyEmail: 'noreply@marketplace.co.mz',
} as const;

export const siteConfig = {
  /** Display name of the site / brand */
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || defaults.siteName,
  /** Default site description (used in meta and admin defaults) */
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || defaults.siteDescription,
  /** Base URL of the app (no trailing slash) */
  appUrl: process.env.NEXT_PUBLIC_APP_URL || defaults.appUrl,
  /** General contact email */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || defaults.contactEmail,
  /** Support email */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || defaults.supportEmail,
  /** Privacy / data protection contact */
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || defaults.privacyEmail,
  /** Legal / terms contact */
  legalEmail: process.env.NEXT_PUBLIC_LEGAL_EMAIL || defaults.legalEmail,
  /** No-reply / system sender email */
  noReplyEmail: process.env.NEXT_PUBLIC_NO_REPLY_EMAIL || defaults.noReplyEmail,
} as const;
