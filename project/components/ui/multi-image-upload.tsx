'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, MoveUp, MoveDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface MultiImageUploadProps {
  images?: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  label?: string;
  className?: string;
  accept?: string;
}

export function MultiImageUpload({
  images = [],
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
  label = 'Imagens',
  className = '',
  accept = 'image/*'
}: MultiImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Por favor, selecione apenas arquivos de imagem.';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `A imagem deve ter no máximo ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check max images limit
    if (images.length + fileArray.length > maxImages) {
      errors.push(`Você pode adicionar no máximo ${maxImages} imagens.`);
    }

    for (const file of fileArray.slice(0, maxImages - images.length)) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const newImages: ImageFile[] = await Promise.all(
        validFiles.map(async (file) => ({
          file,
          preview: await fileToPreview(file),
          id: `${Date.now()}-${Math.random()}`
        }))
      );

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      alert('Erro ao processar as imagens. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, maxSizeMB, onChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      onChange(newImages);
    }
  };

  const handleClick = () => {
    if (images.length < maxImages) {
      fileInputRef.current?.click();
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-gray-7">
        {label} {images.length > 0 && `(${images.length}/${maxImages})`}
      </Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={!canAddMore}
      />

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Primary Badge */}
              {index === 0 && (
                <Badge className="absolute top-2 left-2 bg-primary text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Principal
                </Badge>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveImage(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(image.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-6">Processando imagens...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-4" />
              <div>
                <p className="text-sm font-medium text-gray-7">
                  Clique para fazer upload ou arraste imagens aqui
                </p>
                <p className="text-xs text-gray-5 mt-1">
                  PNG, JPG, GIF até {maxSizeMB}MB • Máximo {maxImages} imagens
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {images.length >= maxImages && (
        <p className="text-xs text-gray-5 text-center">
          Limite de {maxImages} imagens atingido. Remova uma imagem para adicionar outra.
        </p>
      )}
    </div>
  );
}

export default MultiImageUpload;

