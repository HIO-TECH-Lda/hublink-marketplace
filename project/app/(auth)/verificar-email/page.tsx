'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setVerificationStatus('verifying');
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification logic
    if (verificationToken && verificationToken.length > 10) {
      setVerificationStatus('success');
    } else {
      setVerificationStatus('error');
      setError('Link de verificação inválido ou expirado.');
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError('');
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResendSuccess(true);
    setIsResending(false);
    
    // Hide success message after 5 seconds
    setTimeout(() => setResendSuccess(false), 5000);
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Verificando seu email...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-9">
                  Email Verificado!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Sua conta foi verificada com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Agora você pode acessar todas as funcionalidades da plataforma.
                </p>
                <Link href="/entrar">
                  <Button className="w-full bg-primary hover:bg-primary-hard text-white">
                    Fazer Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-9">
                  Verificação Falhou
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Não foi possível verificar seu email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  O link de verificação é inválido ou expirou. Solicite um novo link.
                </p>
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full bg-primary hover:bg-primary-hard text-white"
                >
                  {isResending ? 'Enviando...' : 'Reenviar Email de Verificação'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Verifique seu Email</h1>
            <p className="text-gray-6">
              Enviamos um link de verificação para seu email.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-9 text-center">
                Verificação Necessária
              </CardTitle>
              <CardDescription className="text-center">
                Para completar seu cadastro, verifique seu endereço de email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resendSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Email de verificação reenviado com sucesso!
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-6">
                  Verifique sua caixa de entrada e clique no link de verificação. 
                  Se não encontrar o email, verifique sua pasta de spam.
                </p>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleResendEmail}
                    disabled={isResending}
                    variant="outline"
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Reenviar Email de Verificação'
                    )}
                  </Button>
                  
                  <Link href="/entrar">
                    <Button variant="ghost" className="w-full">
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-5 text-center">
                  Não recebeu o email? Verifique se o endereço está correto ou{' '}
                  <button 
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="text-primary hover:underline"
                  >
                    solicite um novo link
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 