'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SingleImageUploadProps {
  image?: File | null;
  preview?: string;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  label?: string;
  className?: string;
  accept?: string;
  required?: boolean;
}

export function SingleImageUpload({
  image,
  preview,
  onChange,
  maxSizeMB = 5,
  label = 'Imagem',
  className = '',
  accept = 'image/*',
  required = false
}: SingleImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
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

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    setIsUploading(true);
    try {
      const previewUrl = await fileToPreview(file);
      setLocalPreview(previewUrl);
      onChange(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

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
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayPreview = localPreview || preview;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-7">
        {label} {required && '*'}
      </Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {displayPreview ? (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={displayPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          {image && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {image.name}
            </div>
          )}
        </div>
      ) : (
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
              <p className="text-sm text-gray-6">Processando imagem...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-4" />
              <div>
                <p className="text-sm font-medium text-gray-7">
                  Clique para fazer upload ou arraste uma imagem aqui
                </p>
                <p className="text-xs text-gray-5 mt-1">
                  PNG, JPG, GIF até {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SingleImageUpload;

