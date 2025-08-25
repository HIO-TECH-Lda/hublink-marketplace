'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, DollarSign, FileText, Upload, X, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { RefundService, formatCurrency, formatDate } from '@/lib/payment';

export default function RefundPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useMarketplace();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    amount: 0,
    images: [] as File[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      const foundOrder = state.orders.find(o => o.id === orderId);
      if (!foundOrder) {
        setError('Pedido não encontrado.');
        setIsLoading(false);
        return;
      }
      
      setOrder(foundOrder);
      setFormData(prev => ({ ...prev, amount: foundOrder.total }));

      // Load existing refunds
      const existingRefunds = await RefundService.getRefundsByPaymentIntent(`pi_${orderId}`);
      setRefunds(existingRefunds);

    } catch (err) {
      setError('Erro ao carregar dados do pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
      );
      
      if (formData.images.length + newImages.length > 3) {
        setError('Máximo de 3 imagens permitidas.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      setError('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason || !formData.description) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert images to base64 for storage (in real app, upload to cloud storage)
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const refund = await RefundService.createRefund(
        `pi_${orderId}`,
        formData.amount * 100, // Convert to cents
        formData.reason as any,
        formData.description,
        imageUrls
      );
      
      setRefunds(prev => [refund, ...prev]);
      setIsSuccess(true);
    } catch (err) {
      setError('Erro ao solicitar reembolso. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'succeeded':
        return 'Aprovado';
      case 'failed':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'requested_by_customer':
        return 'Solicitado pelo cliente';
      case 'fraudulent':
        return 'Transação fraudulenta';
      case 'duplicate':
        return 'Cobrança duplicada';
      case 'other':
        return 'Outro motivo';
      default:
        return reason;
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

  if (isLoading) {
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

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Erro</h1>
          <p className="text-gray-6 mb-8">{error}</p>
          <Button onClick={() => router.push('/historico-pedidos')} className="bg-primary hover:bg-primary-hard text-white">
            Voltar aos Pedidos
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
                  Reembolso Solicitado!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Sua solicitação foi enviada com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Você receberá uma confirmação por email em breve.
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

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Button variant="ghost" onClick={() => router.push(`/pedido/${orderId}`)} className="p-0 h-auto text-gray-6 hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Pedido
          </Button>
        </nav>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-9">
                Solicitar Reembolso
              </CardTitle>
              <CardDescription className="text-gray-6">
                Pedido #{order.id} - {formatDate(order.createdAt)}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Refund Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Nova Solicitação
                  </CardTitle>
                  <CardDescription>
                    Preencha os detalhes da sua solicitação de reembolso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="reason">Motivo do Reembolso *</Label>
                      <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione um motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="requested_by_customer">Solicitado pelo cliente</SelectItem>
                          <SelectItem value="fraudulent">Transação fraudulenta</SelectItem>
                          <SelectItem value="duplicate">Cobrança duplicada</SelectItem>
                          <SelectItem value="other">Outro motivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Valor do Reembolso (MTn)</Label>
                      <input
                        type="number"
                        id="amount"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        max={order.total}
                        min={0}
                        step={0.01}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-6 mt-1">
                        Valor máximo: {formatCurrency(order.total * 100)}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição Detalhada *</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o motivo do reembolso em detalhes..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Imagens de Apoio (Opcional)</Label>
                      <div className="mt-1 space-y-3">
                        {/* Image Upload Area */}
                        {formData.images.length < 3 && (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 text-gray-4 mx-auto mb-2" />
                            <p className="text-sm text-gray-6 mb-1">Clique para adicionar imagens</p>
                            <p className="text-xs text-gray-5">PNG, JPG até 5MB (máx. 3 imagens)</p>
                          </div>
                        )}
                        
                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {formData.images.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Imagem ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hard text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Solicitar Reembolso
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Refund History */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Total do Pedido:</span>
                      <span className="text-gray-9">{formatCurrency(order.total * 100)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Status:</span>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Data:</span>
                      <span className="text-gray-9">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund History */}
              {refunds.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9">
                      Histórico de Reembolsos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {refunds.map((refund) => (
                        <div key={refund.id} className="border border-gray-2 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {refund.status === 'succeeded' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : refund.status === 'pending' ? (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-medium text-gray-9">
                                {formatCurrency(refund.amount)}
                              </span>
                            </div>
                            <Badge className={getRefundStatusColor(refund.status)}>
                              {getRefundStatusText(refund.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-6 space-y-1">
                            <p>Motivo: {getReasonText(refund.reason)}</p>
                            <p>Solicitado em: {formatDate(refund.createdAt)}</p>
                            {refund.processedAt && (
                              <p>Processado em: {formatDate(refund.processedAt)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Informações Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-6 space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Reembolsos são processados em até 5 dias úteis</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>O valor será creditado no método de pagamento original</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Você receberá confirmação por email quando processado</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Para dúvidas, entre em contato com nosso suporte</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 