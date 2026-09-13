'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import apiClient from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputVal = email.trim();
    if (!inputVal) {
      setError('Por favor, insira o seu e-mail.');
      return;
    }

    // Check if user entered a phone number or invalid email format
    const phoneRegex = /^(\+258|258)?[0-9]{8,10}$/;
    if (phoneRegex.test(inputVal.replace(/[\s-]/g, '')) || !inputVal.includes('@')) {
      setError(
        'A recuperação por link requer um email associado à conta. Se a sua conta foi criada apenas com telefone, por favor introduza o email associado no seu perfil ou contacte o suporte.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email: inputVal });
      setIsSuccess(true);
    } catch (err: any) {
      const apiError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Não foi possível enviar o link de redefinição. Verifique o email ou contacte o suporte.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
                  Email Enviado!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Enviámos um link para redefinir a sua palavra-passe para <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-6">
                  Verifique a sua caixa de entrada e clique no link para criar uma nova palavra-passe. 
                  O link expira em 1 hora.
                </p>
                <div className="space-y-2">
                  <Link href="/entrar">
                    <Button className="w-full bg-primary hover:bg-primary-hard text-white">
                      Voltar ao Login
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                    }}
                  >
                    Enviar Novamente
                  </Button>
                </div>
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
            <Link href="/entrar" className="inline-flex items-center text-sm text-gray-6 hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </Link>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Esqueceu a palavra-passe?</h1>
            <p className="text-gray-6">
              Introduza o seu e-mail associado à conta e enviaremos um link de redefinição.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-9">
                Redefinir Palavra-passe
              </CardTitle>
              <CardDescription>
                Introduza o e-mail cadastrado na sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-blue-800">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    A recuperação via link é enviada por e-mail. Se se registou apenas com telefone e ainda não adicionou um e-mail ao perfil, contacte a nossa equipa de apoio ao cliente.
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="ex: seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hard text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'A enviar...' : 'Enviar Link de Redefinição'}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-6">
                  Recordou a palavra-passe?{' '}
                  <Link href="/entrar" className="text-primary hover:underline">
                    Fazer login
                  </Link>
                </p>
                <p className="text-xs text-gray-5">
                  Precisa de ajuda?{' '}
                  <Link href="/ajuda" className="text-primary hover:underline">
                    Contactar Suporte
                  </Link>
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