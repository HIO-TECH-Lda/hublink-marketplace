import './globals.css';
import type { Metadata } from 'next';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import CartPopup from '@/components/popups/CartPopup';
import PWAProvider from '@/components/pwa/PWAProvider';

export const metadata: Metadata = {
  title: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
  description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala',
  manifest: '/manifest.json',
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Txova',
  },
  formatDetection: {
    telephone: false,
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
        <meta name="description" content="Marketplace moçambicano de alimentos orgânicos frescos e saudáveis" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#10b981" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#10b981" />
        <link rel="shortcut icon" href="/favicon.ico" />
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