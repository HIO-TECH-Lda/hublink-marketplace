'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, RefreshCw, Bell } from 'lucide-react';

interface PWAProviderProps {
  children: React.ReactNode;
}

interface UpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    registerServiceWorker();
    setupOnlineOfflineListeners();
    setupBeforeInstallPrompt();
    setupAppUpdateListener();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const setupOnlineOfflineListeners = () => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  };

  const setupBeforeInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });
  };

  const setupAppUpdateListener = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker is controlling the page
        window.location.reload();
      });
    }
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
    }
    setShowUpdatePrompt(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }
  };

  return (
    <>
      {children}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <UpdatePrompt
          onUpdate={handleUpdate}
          onDismiss={() => setShowUpdatePrompt(false)}
        />
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={() => setShowInstallPrompt(false)}
        />
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Modo Offline</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function UpdatePrompt({ onUpdate, onDismiss }: UpdatePromptProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-blue-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 text-lg">Nova versão disponível</CardTitle>
            <button
              onClick={onDismiss}
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={20} />
            </button>
          </div>
          <CardDescription className="text-blue-700">
            Uma nova versão do Vitrine está disponível. Atualize para obter as últimas funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex space-x-2">
            <Button
              onClick={onUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              <RefreshCw size={16} className="mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-green-50 border-green-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-900 text-lg">Instalar Vitrine</CardTitle>
            <button
              onClick={onDismiss}
              className="text-green-600 hover:text-green-800"
            >
              <X size={20} />
            </button>
          </div>
          <CardDescription className="text-green-700">
            Instale o Vitrine no seu dispositivo para acessar mais rapidamente e usar offline.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex space-x-2">
            <Button
              onClick={onInstall}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <Download size={16} className="mr-2" />
              Instalar
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 