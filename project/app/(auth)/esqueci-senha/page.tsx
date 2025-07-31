'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido.');
      setIsLoading(false);
      return;
    }

    // Mock success
    setIsSuccess(true);
    setIsLoading(false);
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
                  Enviamos um link para redefinir sua senha para <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-6">
                  Verifique sua caixa de entrada e clique no link para criar uma nova senha. 
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Esqueceu sua senha?</h1>
            <p className="text-gray-6">
              Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-9">
                Redefinir Senha
              </CardTitle>
              <CardDescription>
                Insira o email associado à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-6">
                  Lembrou sua senha?{' '}
                  <Link href="/entrar" className="text-primary hover:underline">
                    Fazer login
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