'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function NewsletterPopup() {
  const { state, dispatch } = useMarketplace();
  const [email, setEmail] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!state.showNewsletterPopup) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('hideNewsletterPopup', 'true');
    }
    dispatch({ type: 'HIDE_NEWSLETTER_POPUP' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    
    // Mock: Store subscription in localStorage for demo purposes
    const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
    const newSubscription = {
      id: Date.now().toString(),
      email,
      status: 'active',
      source: 'popup',
      tags: ['organic', 'new-subscriber'],
      preferences: {
        categories: ['vegetables', 'fruits'],
        frequency: 'weekly',
        language: 'pt-MZ'
      },
      stats: {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
    
    // Show success message
    alert('Obrigado por se inscrever na nossa newsletter!');
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
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-9 mb-2">
              Assine Nossa Newsletter
            </h2>
            <p className="text-gray-6">
              Receba <span className="text-primary font-semibold">10% de desconto</span> na sua primeira compra 
              e fique por dentro das nossas ofertas especiais!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hard text-white py-3"
            >
              Assinar Newsletter
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
              Não mostrar esta janela novamente
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}