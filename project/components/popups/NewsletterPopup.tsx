'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';

export default function NewsletterPopup() {
  const { state, dispatch } = useMarketplace();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const subscribe = useNewsletterSubscribe();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!state.showNewsletterPopup) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('hideNewsletterPopup', 'true');
    }
    dispatch({ type: 'HIDE_NEWSLETTER_POPUP' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe.mutateAsync({
      email,
      source: 'popup'
    });
    setEmail('');
    handleClose();
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
          {/* Header */}
          <div className="text-center mb-6">
            {/* <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">T</span>
            </div> */}
            <h2 className="text-2xl font-bold text-gray-9 mb-2">
              Fique por Dentro das Novidades do Txova
            </h2>
            <p className="text-gray-6">
              Subscreva a nossa newsletter e receba actualizações sobre promoções, novos vendedores, produtos em destaque, serviços locais e oportunidades para compradores e empreendedores.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="O seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hard text-white py-3"
              disabled={subscribe.isPending}
            >
              {subscribe.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                'Subscrever'
              )}
            </Button>
          </form>

          {/* Don't show again option */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="dontShowAgain" className="text-sm text-gray-6 cursor-pointer">
              Não voltar a mostrar esta janela
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}