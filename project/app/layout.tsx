import './globals.css';
import type { Metadata } from 'next';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';

export const metadata: Metadata = {
  title: 'Ecobazar - Marketplace de Alimentos Orgânicos',
  description: 'Marketplace brasileiro de alimentos orgânicos frescos e saudáveis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <MarketplaceProvider>
          {children}
        </MarketplaceProvider>
      </body>
    </html>
  );
}