'use client';

import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (review: ReviewData) => void;
  onCancel: () => void;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  images: File[];
}

export default function ReviewForm({ productId, productName, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (images.length + validFiles.length > 5) {
      setError('Máximo de 5 imagens permitidas.');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Por favor, selecione uma avaliação.');
      return;
    }

    if (!title.trim()) {
      setError('Por favor, adicione um título para sua avaliação.');
      return;
    }

    if (!comment.trim()) {
      setError('Por favor, adicione um comentário para sua avaliação.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewData = {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images
      };

      await onSubmit(reviewData);
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-9">
          Avaliar Produto
        </CardTitle>
        <CardDescription>
          Compartilhe sua experiência com "{productName}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-7">
              Sua Avaliação *
            </Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="lg"
              />
              <span className="text-sm text-gray-6">
                {rating > 0 && `${rating} ${rating === 1 ? 'estrela' : 'estrelas'}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-7">
              Título da Avaliação *
            </Label>
            <Input
              id="title"
              placeholder="Resuma sua experiência em poucas palavras"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-5">
              {title.length}/100 caracteres
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-7">
              Comentário *
            </Label>
            <Textarea
              id="comment"
              placeholder="Conte-nos mais sobre sua experiência com este produto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-5">
              {comment.length}/1000 caracteres
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-7">
              Fotos (opcional)
            </Label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-3 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-4 mx-auto mb-2" />
                <p className="text-sm text-gray-6 mb-2">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-5">
                  Máximo 5 imagens, 5MB cada
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Selecionar Imagens
                  </Button>
                </Label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-hard text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 