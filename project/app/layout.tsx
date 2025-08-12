import './globals.css';
import type { Metadata } from 'next';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import CartPopup from '@/components/popups/CartPopup';
import PWAProvider from '@/components/pwa/PWAProvider';
import StructuredData from '@/components/seo/StructuredData';
import { getOrganizationData } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: {
    default: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
    template: '%s | Txova'
  },
  description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala. Conectamos produtores locais com consumidores conscientes.',
  keywords: [
    'alimentos orgânicos',
    'marketplace',
    'Beira',
    'Moçambique',
    'produtos frescos',
    'produtores locais',
    'comida saudável',
    'vegetais orgânicos',
    'frutas orgânicas',
    'txova',
    'ecommerce',
    'compras online'
  ],
  authors: [{ name: 'Txova Team' }],
  creator: 'Txova',
  publisher: 'Txova',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://txova.co.mz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_MZ',
    url: 'https://txova.co.mz',
    siteName: 'Txova',
    title: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
    description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala. Conectamos produtores locais com consumidores conscientes.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Txova - Marketplace de Alimentos Orgânicos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@txova',
    creator: '@txova',
    title: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
    description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  manifest: '/manifest.json',
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Txova',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Txova',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Txova" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Txova" />
        <meta name="description" content="Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala. Conectamos produtores locais com consumidores conscientes." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#10b981" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Txova Team" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="MZ" />
        <meta name="geo.placename" content="Beira, Sofala, Moçambique" />
        <meta name="geo.position" content="-19.8333;34.8500" />
        <meta name="ICBM" content="-19.8333, 34.8500" />
        
        {/* Open Graph additional tags */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_MZ" />
        <meta property="og:site_name" content="Txova" />
        
        {/* Twitter Card additional tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@txova" />
        <meta name="twitter:creator" content="@txova" />
        
        {/* Structured Data */}
        <meta name="application/ld+json" content={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Txova - Marketplace Orgânico",
          "url": "https://txova.co.mz",
          "logo": "https://txova.co.mz/icons/icon-512x512.png",
          "description": "Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua Principal, 123",
            "addressLocality": "Beira",
            "addressRegion": "Sofala",
            "postalCode": "1100",
            "addressCountry": "MZ"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+258 84 123 4567",
            "contactType": "customer service",
            "email": "contato@txova.co.mz"
          },
          "sameAs": [
            "https://facebook.com/txova",
            "https://instagram.com/txova",
            "https://twitter.com/txova"
          ]
        })} />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#10b981" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body>
        <MarketplaceProvider>
          <PWAProvider>
            {children}
            <CartPopup />
          </PWAProvider>
        </MarketplaceProvider>
      </body>
    </html>
  );
}