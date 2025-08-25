import './globals.css';
import type { Metadata } from 'next';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import CartPopup from '@/components/popups/CartPopup';
import PWAProvider from '@/components/pwa/PWAProvider';
import StructuredData from '@/components/seo/StructuredData';
import { getOrganizationData } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: {
    default: 'VITRINE - Marketplace Completo',
    template: '%s | VITRINE'
  },
  description: 'VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais.',
  keywords: [
    'marketplace',
    'eletrônicos',
    'moda',
    'esportes',
    'casa',
    'beleza',
    'compras online',
    'vendedores',
    'produtos'
  ],
  authors: [{ name: 'VITRINE Team' }],
  creator: 'VITRINE',
  publisher: 'VITRINE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vitrine.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vitrine.com',
    title: 'VITRINE - Marketplace Completo',
    description: 'VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais.',
    siteName: 'VITRINE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VITRINE - Marketplace Completo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VITRINE - Marketplace Completo',
    description: 'VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais.',
    images: ['/og-image.jpg'],
    creator: '@vitrine',
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VITRINE" />
        <meta name="application-name" content="VITRINE" />
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VITRINE" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais." />
        <meta name="keywords" content="marketplace, eletrônicos, moda, esportes, casa, beleza, compras online, vendedores, produtos" />
        <meta name="author" content="VITRINE Team" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vitrine.com" />
        <meta property="og:title" content="VITRINE - Marketplace Completo" />
        <meta property="og:description" content="VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:site_name" content="VITRINE" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://vitrine.com" />
        <meta name="twitter:title" content="VITRINE - Marketplace Completo" />
        <meta name="twitter:description" content="VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais." />
        <meta name="twitter:image" content="/og-image.jpg" />
        <meta name="twitter:creator" content="@vitrine" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MarketplaceProvider>
          {children}
        </MarketplaceProvider>
      </body>
    </html>
  );
}