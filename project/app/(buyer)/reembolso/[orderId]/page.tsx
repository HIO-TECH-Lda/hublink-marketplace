'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Upload, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/hooks/useOrders';
import { useCreateRefundRequest } from '@/hooks/useRefunds';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/payment';
import { RefundableItemsList } from '@/components/refund/RefundableItemsList';
import { RefundRequestsList } from '@/components/refund/RefundRequestsList';
import type { OrderItem, Refund } from '@/types/api';

const REFUND_REASONS: { value: string; label: string }[] = [
  { value: 'defective', label: 'Produto com defeito' },
  { value: 'damaged', label: 'Produto danificado' },
  { value: 'wrong_item', label: 'Item incorreto recebido' },
  { value: 'not_as_described', label: 'Não corresponde à descrição' },
  { value: 'size_issue', label: 'Problema com tamanho' },
  { value: 'quality_issue', label: 'Problema de qualidade' },
  { value: 'changed_mind', label: 'Mudei de ideia' },
  { value: 'other', label: 'Outro motivo' },
];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function RefundPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { loading: authLoading, isAuthenticated } = useAuth();
  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(orderId);
  const createRefundRequest = useCreateRefundRequest();
  const { toast } = useToast();

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundDescription, setRefundDescription] = useState('');
  const [refundImages, setRefundImages] = useState<File[]>([]);
  const [refundImagePreviews, setRefundImagePreviews] = useState<string[]>([]);

  const orderRefunds: Refund[] = (order?.refunds as Refund[] | undefined) ?? [];
  const orderItems: OrderItem[] = (order?.items as OrderItem[] | undefined) ?? [];

  const resetRefundForm = () => {
    setRefundReason('');
    setRefundDescription('');
    setRefundImages([]);
    setRefundImagePreviews([]);
    setSelectedItem(null);
  };

  const handleDialogChange = (open: boolean) => {
    setShowRefundModal(open);
    if (!open) {
      resetRefundForm();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= MAX_IMAGE_SIZE,
    );

    if (refundImages.length + validFiles.length > MAX_IMAGES) {
      toast({
        title: 'Limite de imagens excedido',
        description: `Adicione no máximo ${MAX_IMAGES} imagens.`,
        variant: 'destructive',
      });
      return;
    }

    setRefundImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefundImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setRefundImages((prev) => prev.filter((_, i) => i !== index));
    setRefundImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          }),
      ),
    );
  };

  const handleRefundSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!order || !selectedItem) return;

    if (!refundReason || refundDescription.trim().length < 10) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Informe o motivo e descreva o problema com pelo menos 10 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    const productId =
      selectedItem.productId?._id ||
      (selectedItem.productId as unknown as string) ||
      selectedItem.product?._id ||
      (selectedItem.product as any)?.id;

    if (!productId) {
      toast({
        title: 'Produto não identificado',
        description: 'Não foi possível identificar o produto para esta solicitação.',
        variant: 'destructive',
      });
      return;
    }

    const orderItemId = selectedItem._id || (selectedItem as any)?.id;

    const imageUrls =
      refundImages.length > 0 ? await convertImagesToBase64(refundImages) : [];

    createRefundRequest.mutate(
      {
        orderId: order._id || order.id || orderId,
        productId,
        reason: refundReason,
        description: refundDescription,
        images: imageUrls,
        orderItemId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Solicitação enviada',
            description: 'A equipe analisará sua solicitação e você receberá um e-mail com a atualização.',
          });
          handleDialogChange(false);
        },
      },
    );
  };

  if (authLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-6">Carregando reembolsos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso restrito</h1>
          <p className="text-gray-6 mb-8">Faça login para acompanhar suas solicitações de reembolso.</p>
          <Button onClick={() => router.push('/entrar')} className="bg-primary hover:bg-primary-hard text-white">
            Fazer login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-6 mb-8">
            Não encontramos informações sobre este pedido. Verifique o link ou tente novamente mais tarde.
          </p>
          <Button
            onClick={() => router.push('/historico-pedidos')}
            className="bg-primary hover:bg-primary-hard text-white"
          >
            Voltar para meus pedidos
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
          <Button
            variant="ghost"
            onClick={() => router.push(`/pedido/${order._id || order.id || orderId}`)}
            className="p-0 h-auto text-gray-6 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao pedido
          </Button>
        </nav>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-9">
                    Reembolsos do pedido #{order.orderNumber || (order._id || order.id)?.slice(-6)}
                  </CardTitle>
                  <CardDescription>
                    Realizado em {formatDate(order.createdAt || order.date || new Date().toISOString())}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-slate-900 text-white">Status: {order.status}</Badge>
                  <Badge variant="outline">
                    Total: {formatCurrency(order.totalAmount || order.total || 0)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Itens do pedido
                  </CardTitle>
                  <CardDescription>
                    Solicite o reembolso por item. Apenas itens entregues e pagos são elegíveis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <RefundableItemsList
                  order={order!}
                  items={orderItems}
                  refunds={orderRefunds}
                  onRequest={(item) => {
                    setSelectedItem(item);
                    setShowRefundModal(true);
                  }}
                  showStatusMessage
                />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Minhas solicitações
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o status de cada solicitação de reembolso relacionada a este pedido.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <RefundRequestsList
                  refunds={orderRefunds}
                  emptyMessage="Você ainda não enviou nenhuma solicitação de reembolso para este pedido."
                />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Resumo do pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        {formatCurrency(order.subtotal || order.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entrega</span>
                      <span className="text-gray-900">
                        {formatCurrency(order.shipping || 0)}
                      </span>
                    </div>
                    {(order.discount || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desconto</span>
                        <span className="text-gray-900">
                          {formatCurrency(order.discount || 0)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
                      <span>Total pago</span>
                      <span className="text-primary">
                        {formatCurrency(order.totalAmount || order.total || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Dicas importantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      • Envie fotos claras que mostrem o motivo da solicitação para agilizar a análise.
                    </p>
                    <p>
                      • Assim que o vendedor aprovar o pedido, o reembolso será processado no mesmo
                      método de pagamento.
                    </p>
                    <p>
                      • Você pode acompanhar o andamento aqui ou na página do pedido.
                    </p>
                    <p>
                      • Em caso de dúvidas, entre em contato com o suporte informando o código do
                      pedido.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <Dialog open={showRefundModal} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar reembolso</DialogTitle>
            <DialogDescription>
              Descreva o problema encontrado e anexe evidências para acelerar a análise.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={
                      selectedItem.product?.primaryImage ||
                      selectedItem.productImage ||
                      '/placeholder.jpg'
                    }
                    alt={selectedItem.product?.name || selectedItem.productName || 'Produto'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {selectedItem.product?.name || selectedItem.productName}
                  </p>
                  <p className="text-sm text-gray-600">Quantidade: {selectedItem.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Valor total:{' '}
                    {formatCurrency(
                      (selectedItem.unitPrice || selectedItem.product?.price || 0) *
                        selectedItem.quantity,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleRefundSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do reembolso *
              </label>
              <Select value={refundReason} onValueChange={(value) => setRefundReason(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  {REFUND_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição detalhada *
              </label>
              <Textarea
                value={refundDescription}
                onChange={(event) => setRefundDescription(event.target.value)}
                placeholder="Explique o que aconteceu com este item..."
                rows={4}
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 10 caracteres. Informe detalhes como defeitos, prazos e expectativas.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidências visuais (opcional)
              </label>
              <label
                htmlFor="refund-image-upload"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-500" />
                <span className="text-sm text-gray-600">Adicionar imagens</span>
                <span className="text-xs text-gray-500">
                  PNG ou JPG até 5MB, máximo de {MAX_IMAGES} imagens
                </span>
              </label>
              <input
                id="refund-image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {refundImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {refundImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hard text-white"
                disabled={createRefundRequest.isPending}
              >
                {createRefundRequest.isPending ? 'Enviando...' : 'Enviar solicitação'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}