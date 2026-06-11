'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import Link from 'next/link';

export default function SellerPopup() {
  const { state, dispatch } = useMarketplace();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const shouldShow =
    state.showNewsletterPopup &&
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_ACTIVE_POPUP === 'SELLER';

  if (!shouldShow) return null;

  const handleClose = () => {
    dispatch({ type: 'HIDE_NEWSLETTER_POPUP' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 relative animate-slide-in-right">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-1 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-9 mb-2">
              Seja Vendedor no Txova
            </h2>
            <p className="text-gray-6">
              Dê mais visibilidade ao seu negócio e alcance novos clientes na sua comunidade.
            </p>
          </div>

          <div className="space-y-4">
            <ul className="text-sm text-gray-7 list-disc list-inside text-left space-y-1 mb-4">
              <li>Sem mensalidade para começar</li>
              <li>Painel completo para gestão de pedidos e produtos</li>
              <li>Pagamentos seguros e suporte dedicado</li>
            </ul>

            <Link href="/seja-vendedor" onClick={handleClose}>
              <Button className="w-full bg-primary hover:bg-primary-hard text-white py-3">
                Cadastre-se como Vendedor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

