# Site URL and contact emails (optional)

To override the default app URL and contact emails, add these to `.env.local`:

```env
# Brand / site name and description used in metadata and admin defaults
NEXT_PUBLIC_SITE_NAME=Vitrine
NEXT_PUBLIC_SITE_DESCRIPTION=Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala.

# Base URL of the site (no trailing slash). Used in metadata, sitemap, structured data, robots.
NEXT_PUBLIC_APP_URL=https://vitrine.co.mz

# Contact emails (used across layout, footer, contact/help/legal pages, admin config)
NEXT_PUBLIC_CONTACT_EMAIL=contato@vitrine.co.mz
NEXT_PUBLIC_SUPPORT_EMAIL=suporte@vitrine.co.mz
NEXT_PUBLIC_PRIVACY_EMAIL=privacidade@vitrine.co.mz
NEXT_PUBLIC_LEGAL_EMAIL=juridico@vitrine.co.mz
NEXT_PUBLIC_NO_REPLY_EMAIL=noreply@vitrine.co.mz
```

If not set, the defaults (vitrine.co.mz and the emails above) are used. All values are read via `lib/site-config.ts`.
