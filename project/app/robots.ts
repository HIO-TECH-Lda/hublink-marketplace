import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/vendedor/', '/painel/', '/carrinho/', '/checkout/', '/entrar/', '/criar-conta/'],
      },
    ],
    sitemap: `${siteConfig.appUrl}/sitemap.xml`,
  };
}
