'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function NewsletterPopup() {
  const { isNewsletterOpen, setIsNewsletterOpen, setHideNewsletter } = useApp();
  const [email, setEmail] = useState('');

  if (!isNewsletterOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription
    alert('Obrigado por se inscrever em nossa newsletter!');
    setIsNewsletterOpen(false);
  };

  const handleHideNewsletter = () => {
    sessionStorage.setItem('hideNewsletter', 'true');
    setHideNewsletter(true);
    setIsNewsletterOpen(false);
  };

  const handleClose = () => {
    setIsNewsletterOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-7" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-9 mb-2">
            Assine Nossa Newsletter
          </h3>
          <p className="text-gray-6 mb-6">
            Receba 10% de desconto na sua primeira compra e fique por dentro das novidades!
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              className="w-full px-4 py-3 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hard text-white"
            >
              Assinar
            </Button>
          </form>

          <button
            onClick={handleHideNewsletter}
            className="text-sm text-gray-6 hover:text-gray-9 mt-4 underline"
          >
            Não mostrar esta janela novamente
          </button>
        </div>
      </div>
    </div>
  );
}