import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/contexts/AppContext';

export const metadata: Metadata = {
  title: 'Ecobazar - Alimentos Orgânicos Frescos e Saudáveis',
  description: 'Loja de alimentos orgânicos 100% confiável',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-poppins">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}