'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle, ArrowLeft, Smartphone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useOrder } from '@/hooks/useOrders';
import { useProcessPayment } from '@/hooks/usePayments';
import { formatCurrency } from '@/lib/payment';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { dispatch } = useMarketplace();
  const orderId = params.orderId as string;
  
  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(orderId);
  const processPaymentMutation = useProcessPayment();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    paymentMethod: 'mpesa',
    phoneNumber: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    savePaymentMethod: false
  });

  useEffect(() => {
    if (orderError) {
      setError('Erro ao carregar pedido. Tente novamente.');
    }
  }, [orderError]);

  const processPayment = async (paymentDetails = {}) => {
    try {
      const result = await processPaymentMutation.mutateAsync({
        orderId: orderId,
        paymentDetails: paymentDetails,
      });

      return result;
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Erro ao processar pagamento. Tente novamente.';
      throw new Error(apiMessage);
    }
  };

  const handlePaymentResponse = async (data: any) => {
    switch (data.type) {
      case 'stripe':
        await handleStripePayment(data);
        break;
      case 'manual':
        handleManualPayment(data);
        break;
      default:
        // Imali payment (M-Pesa, eMola, etc.)
        handleImaliPayment(data);
    }
  };

  const handleStripePayment = async (data: any) => {
    // For now, show success message
    // In a real implementation, you would integrate Stripe.js here
    setPaymentResult({
      type: 'stripe',
      message: 'Stripe payment integration required. Please contact support.',
      clientSecret: data.clientSecret
    });
  };

  const handleImaliPayment = (data: any) => {
    if (data.status === 'success' && data.data?.paymentLink) {
      // Show pay-by-link - use customer_link_id for the payment URL
      setPaymentResult({
        type: 'imali_link',
        paymentLink: data.data.paymentLink.customer_link_id || data.data.paymentLink.link_url,
        linkId: data.data.paymentLink.link_id,
        orderId: data.data.order?._id
      });
    } else if (data.status === 'success' && data.data?.data?.qrcode) {
      // Show QR code
      setPaymentResult({
        type: 'imali_qr',
        qrCode: data.data.data.qrcode,
        transactionId: data.data.data.transaction
      });
    }
  };

  const handleManualPayment = (data: any) => {
    setPaymentResult({
      type: 'manual',
      method: data.method,
      amount: data.amount,
      currency: data.currency,
      message: data.message
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPaymentResult(null);

    try {
      const paymentDetails: any = {};
      
      // Add method-specific details
      if (formData.paymentMethod === 'mpesa' || formData.paymentMethod === 'emola') {
        paymentDetails.send_to_phone = formData.phoneNumber;
        paymentDetails.title = `Pagamento Pedido #${orderId}`;
        paymentDetails.short_description = 'Pagamento do pedido';
        paymentDetails.type = 'DIRECT';
      } else if (formData.paymentMethod === 'imali') {
        paymentDetails.send_to_phone = formData.phoneNumber;
        paymentDetails.title = `Pagamento Pedido #${orderId}`;
        paymentDetails.short_description = 'Pagamento do pedido';
        paymentDetails.type = 'DIRECT';
      } else if (formData.paymentMethod === 'debit_card' || formData.paymentMethod === 'credit_card') {
        // For card payments, we'll need to handle Stripe integration
        paymentDetails.cardDetails = {
          number: formData.cardNumber,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvv: formData.cvv,
          holderName: formData.cardholderName
        };
      } else if (formData.paymentMethod === 'bank_transfer' || formData.paymentMethod === 'cash_on_delivery') {
        // Manual payment methods don't need additional details
        // paymentDetails remains empty
      }
      
      const result = await processPayment(paymentDetails);
      await handlePaymentResponse(result);
      
      // Clear cart after successful payment initiation
      dispatch({ type: 'CLEAR_CART' });
      setIsSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-6 mt-2">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated || !user) {
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
                  {paymentResult?.type === 'manual' ? 'Pagamento Criado!' : 'Pagamento Iniciado!'}
                </CardTitle>
                <CardDescription className="text-gray-6">
                  {paymentResult?.type === 'manual' 
                    ? 'Instruções de pagamento foram geradas.' 
                    : 'Seu pagamento foi processado com sucesso.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Payment Link */}
                {paymentResult?.type === 'imali_link' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-7 mb-3">Clique no link abaixo para completar o pagamento:</p>
                    <Button 
                      onClick={() => {
                        if (paymentResult.paymentLink) {
                          window.open(paymentResult.paymentLink, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Pagar Agora
                    </Button>
                  </div>
                )}

                {/* QR Code */}
                {paymentResult?.type === 'imali_qr' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-7 mb-3">Escaneie o QR code com seu app de pagamento:</p>
                    <div className="flex justify-center">
                      <img 
                        src={paymentResult.qrCode} 
                        alt="QR Code de Pagamento" 
                        className="w-48 h-48 border rounded"
                      />
                    </div>
                  </div>
                )}

                {/* Manual Payment Instructions */}
                {paymentResult?.type === 'manual' && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-7 mb-2">{paymentResult.message}</p>
                    <p className="text-sm font-medium text-gray-9">
                      Valor: {formatCurrency(paymentResult.amount)} {paymentResult.currency}
                    </p>
                  </div>
                )}

                {/* Stripe Payment */}
                {paymentResult?.type === 'stripe' && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-7">{paymentResult.message}</p>
                  </div>
                )}

                <p className="text-sm text-gray-6 mb-6">
                  Você receberá um email de confirmação em breve.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      const targetOrderId = paymentResult?.orderId || orderId;
                      router.push(`/pedido/${targetOrderId}`);
                    }}
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

  if (orderLoading) {
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-6 mb-8">O pedido solicitado não foi encontrado.</p>
          <Button onClick={() => router.push('/historico-pedidos')} className="bg-primary hover:bg-primary-hard text-white">
            Ver Meus Pedidos
          </Button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium">Método de Pagamento</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="mpesa"
                          name="paymentMethod"
                          value="mpesa"
                          checked={formData.paymentMethod === 'mpesa'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <Smartphone size={20} className="text-primary" />
                        <Label htmlFor="mpesa" className="flex-1 cursor-pointer">M-Pesa</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="emola"
                          name="paymentMethod"
                          value="emola"
                          checked={formData.paymentMethod === 'emola'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <Smartphone size={20} className="text-primary" />
                        <Label htmlFor="emola" className="flex-1 cursor-pointer">E-Mola</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="imali"
                          name="paymentMethod"
                          value="imali"
                          checked={formData.paymentMethod === 'imali'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <Smartphone size={20} className="text-primary" />
                        <Label htmlFor="imali" className="flex-1 cursor-pointer">Imali (Link de Pagamento)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="debit_card"
                          name="paymentMethod"
                          value="debit_card"
                          checked={formData.paymentMethod === 'debit_card'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <CreditCard size={20} className="text-primary" />
                        <Label htmlFor="debit_card" className="flex-1 cursor-pointer">Cartão de Débito</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="credit_card"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <CreditCard size={20} className="text-primary" />
                        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">Cartão de Crédito</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="bank_transfer"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === 'bank_transfer'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <CreditCard size={20} className="text-primary" />
                        <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">Transferência Bancária</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                        <input
                          type="radio"
                          id="cash_on_delivery"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary"
                        />
                        <CreditCard size={20} className="text-primary" />
                        <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">Pagamento na Entrega</Label>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Money Payment Fields */}
                  {(formData.paymentMethod === 'mpesa' || formData.paymentMethod === 'emola' || formData.paymentMethod === 'imali') && (
                    <div>
                      <Label htmlFor="phoneNumber">Número de Telefone *</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+258 84 999 9999"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="mt-1"
                        required
                      />
                      <p className="text-sm text-gray-6 mt-1">
                        {formData.paymentMethod === 'imali' 
                          ? 'Você receberá um link de pagamento via SMS.' 
                          : 'Você receberá uma notificação no seu telefone para confirmar o pagamento.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Card Payment Fields */}
                  {(formData.paymentMethod === 'debit_card' || formData.paymentMethod === 'credit_card') && (
                    <>
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
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="savePaymentMethod"
                      checked={formData.savePaymentMethod}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, savePaymentMethod: checked as boolean }))}
                    />
                    <Label htmlFor="savePaymentMethod" className="text-sm text-gray-7">
                      Salvar método de pagamento para futuras compras
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
                  disabled={processPaymentMutation.isPending}
                >
                  {processPaymentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pagar {formatCurrency(order.total || 0)}
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
                  {order.items?.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImage || '/placeholder-product.jpg'}
                          alt={item.productName || 'Produto'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-9 truncate">{item.productName || 'Produto'}</h4>
                        <p className="text-sm text-gray-6">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-9">{formatCurrency(item.totalPrice)}</p>
                      </div>
                    </div>
                  )) || []}
                </div>

                <div className="border-t border-gray-2 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Subtotal:</span>
                    <span className="text-gray-9">{formatCurrency(order.total || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Entrega:</span>
                    <span className="text-gray-9">{formatCurrency(order.shipping || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Desconto:</span>
                    <span className="text-gray-9">{formatCurrency(order.discount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-6">Impostos:</span>
                    <span className="text-gray-9">{formatCurrency(order.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-2 pt-2">
                    <span className="text-gray-9">Total:</span>
                    <span className="text-primary">{formatCurrency(order.total || 0)}</span>
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