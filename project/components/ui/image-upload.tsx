'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Move, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  className 
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;

    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images, maxImages, onImagesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    e.target.value = '';
  }, [handleFileUpload]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else if (previewIndex && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [images, onImagesChange, previewIndex]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
    
    // Update preview index if needed
    if (previewIndex === fromIndex) {
      setPreviewIndex(toIndex);
    }
  }, [images, onImagesChange, previewIndex]);

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-gray-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Arraste e solte imagens aqui ou clique para selecionar
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Máximo {maxImages} imagens, 5MB cada
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer">
              Selecionar Imagens
            </Button>
          </label>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Imagens do Produto ({images.length}/{maxImages})
            </h3>
            <p className="text-xs text-gray-500">
              A primeira imagem será a imagem principal
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square relative">
                    <img
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPreviewIndex(index)}
                          className="w-8 h-8 p-0"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="w-8 h-8 p-0"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* Move buttons */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex flex-col space-y-1">
                        {index > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => moveImage(index, index - 1)}
                            className="w-6 h-6 p-0"
                          >
                            <Move size={12} className="rotate-90" />
                          </Button>
                        )}
                        {index < images.length - 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => moveImage(index, index + 1)}
                            className="w-6 h-6 p-0"
                          >
                            <Move size={12} className="-rotate-90" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Primary image indicator */}
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Principal
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Visualizar Imagem {previewIndex + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreviewIndex(null)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={images[previewIndex]}
                alt={`Imagem ${previewIndex + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
