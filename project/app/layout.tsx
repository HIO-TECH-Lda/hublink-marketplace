import './globals.css';
import type { Metadata } from 'next';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import CartPopup from '@/components/popups/CartPopup';

export const metadata: Metadata = {
  title: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
  description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ">
      <body>
        <MarketplaceProvider>
          {children}
          <CartPopup />
        </MarketplaceProvider>
      </body>
    </html>
  );
}