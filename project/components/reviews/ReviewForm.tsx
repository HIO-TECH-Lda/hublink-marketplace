'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StarRating from './StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReviewFormProps {
  productName: string;
  orders: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  onSubmit: (review: ReviewFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ReviewFormValues {
  rating: number;
  title: string;
  content: string;
  images: string[];
  orderId: string;
}

export default function ReviewForm({
  productName,
  orders,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (orders.length > 0 && !orderId) {
      setOrderId(orders[0].id);
    }
  }, [orders, orderId]);

  const hasEligibleOrders = useMemo(() => orders.length > 0, [orders]);

  const handleAddImageField = () => {
    if (imageUrls.length >= 5) {
      setError('Máximo de 5 URLs de imagens permitidas.');
      return;
    }
    setImageUrls((prev) => [...prev, '']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, idx) => (idx === index ? value : url)));
    setError('');
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!hasEligibleOrders) {
      setError('Você não possui pedidos elegíveis para avaliar este produto.');
      return;
    }

    if (!orderId) {
      setError('Selecione o pedido utilizado para comprar este produto.');
      return;
    }

    if (rating === 0) {
      setError('Por favor, selecione uma avaliação.');
      return;
    }

    if (title.trim().length < 5) {
      setError('O título deve ter pelo menos 5 caracteres.');
      return;
    }

    if (content.trim().length < 10) {
      setError('O comentário deve ter pelo menos 10 caracteres.');
      return;
    }

    const sanitizedImages = imageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .slice(0, 5);

    await onSubmit({
      rating,
      title: title.trim(),
      content: content.trim(),
      images: sanitizedImages,
      orderId,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-9">Avaliar Produto</CardTitle>
        <CardDescription>Compartilhe sua experiência com &quot;{productName}&quot;</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!hasEligibleOrders && (
            <Alert variant="destructive">
              <AlertDescription>
                Você precisa ter um pedido entregue ou concluído deste produto para enviar uma
                avaliação.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-7">Selecione o pedido *</Label>
            <Select
              value={orderId}
              onValueChange={setOrderId}
              disabled={!hasEligibleOrders || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o pedido" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900">{order.label}</span>
                      {order.description && (
                        <span className="text-xs text-gray-500">{order.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-7">Sua Avaliação *</Label>
            <div className="flex items-center gap-4">
              <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
              <span className="text-sm text-gray-6">
                {rating > 0 && `${rating} ${rating === 1 ? 'estrela' : 'estrelas'}`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-7">
              Título da Avaliação *
            </Label>
            <Input
              id="title"
              placeholder="Resuma sua experiência em poucas palavras"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-5">{title.length}/100 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-7">
              Comentário *
            </Label>
            <Textarea
              id="content"
              placeholder="Conte-nos mais sobre sua experiência com este produto..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-5">{content.length}/1000 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-7">Fotos (URLs públicas, opcional)</Label>
            <div className="space-y-3">
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={url}
                        onChange={(event) => handleImageUrlChange(index, event.target.value)}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImageUrl(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {imageUrls.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImageField}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar URL de imagem
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-hard text-white text-sm"
              disabled={isSubmitting || !hasEligibleOrders}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 