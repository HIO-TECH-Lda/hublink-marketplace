'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Mock token validation
    const validateToken = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: token is valid if it's not empty and has some length
      if (token && token.length > 10) {
        setIsValidToken(true);
      } else {
        setError('Link de redefinição inválido ou expirado.');
      }
      setIsCheckingToken(false);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock validation
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success
    setIsSuccess(true);
    setIsLoading(false);
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Verificando link de redefinição...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-9">
                  Link Inválido
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Este link de redefinição de senha é inválido ou expirou.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Solicite um novo link de redefinição de senha.
                </p>
                <Link href="/esqueci-senha">
                  <Button className="w-full bg-primary hover:bg-primary-hard text-white">
                    Solicitar Novo Link
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
                  Senha Redefinida!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Sua senha foi alterada com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Agora você pode fazer login com sua nova senha.
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Nova Senha</h1>
            <p className="text-gray-6">
              Digite sua nova senha abaixo.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-9">
                Redefinir Senha
              </CardTitle>
              <CardDescription>
                Crie uma nova senha segura para sua conta
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
                  <Label htmlFor="password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-4 hover:text-gray-6"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-5">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-4 hover:text-gray-6"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hard text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
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