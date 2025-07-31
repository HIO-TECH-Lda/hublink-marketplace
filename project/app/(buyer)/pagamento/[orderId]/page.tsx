'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { PaymentService, formatCurrency } from '@/lib/payment';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const orderId = params.orderId as string;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  useEffect(() => {
    const foundOrder = state.orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError('Pedido não encontrado.');
    }
  }, [orderId, state.orders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const paymentIntent = await PaymentService.createPaymentIntent(order.total * 100);
      const result = await PaymentService.confirmPayment(paymentIntent.id, 'pm_1');
      
      if (result.status === 'succeeded') {
        // Clear cart after successful payment
        dispatch({ type: 'CLEAR_CART' });
        setIsSuccess(true);
      } else {
        setError('Pagamento falhou. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
          <Button onClick={() => router.push('/entrar')} className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
          </Button>
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
                  Pagamento Aprovado!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Seu pedido foi processado com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Você receberá um email de confirmação em breve.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push(`/pedido/${orderId}`)}
                    className="w-full bg-primary hover:bg-primary-hard text-white"
                  >
                    Ver Detalhes do Pedido
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/historico-pedidos')}
                    className="w-full"
                  >
                    Meus Pedidos
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando pedido...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto text-gray-6 hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-9">
                Informações de Pagamento
              </CardTitle>
              <CardDescription>
                Escolha sua forma de pagamento preferida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Mês</Label>
                      <Select value={formData.expiryMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Ano</Label>
                      <Select value={formData.expiryYear} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                        maxLength={4}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Nome do Titular</Label>
                    <Input
                      id="cardholderName"
                      placeholder="Como aparece no cartão"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={formData.saveCard}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, saveCard: checked as boolean }))}
                    />
                    <Label htmlFor="saveCard" className="text-sm text-gray-7">
                      Salvar cartão para futuras compras
                    </Label>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-1 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-gray-6">
                    <p className="font-medium text-gray-7 mb-1">Pagamento Seguro</p>
                    <p>Suas informações de pagamento são criptografadas e protegidas.</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hard text-white py-3"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pagar {formatCurrency(order.total * 100)}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-9">
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-9 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-6">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-9">{formatCurrency(item.price * item.quantity * 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-2 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Subtotal:</span>
                    <span className="text-gray-9">{formatCurrency(order.subtotal * 100)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Frete:</span>
                    <span className="text-gray-9">{formatCurrency(order.shipping * 100)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-2 pt-2">
                    <span className="text-gray-9">Total:</span>
                    <span className="text-primary">{formatCurrency(order.total * 100)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 