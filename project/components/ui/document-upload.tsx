'use client';

import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  required?: boolean;
  acceptedTypes?: string;
  maxSize?: number; // MB
  onFileSelect: (file: File) => void;
  uploadedFile?: { name: string; size: number; type: string } | null;
  onRemoveFile: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  label, 
  required = false, 
  acceptedTypes = '.pdf,.doc,.docx', 
  maxSize = 5, // MB
  onFileSelect,
  uploadedFile,
  onRemoveFile
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.some(type => type.startsWith('.') ? fileExtension === type : file.type.includes(type.replace('*', '')))) {
      setError(`Tipo de arquivo não suportado. Tipos aceitos: ${acceptedTypes}`);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-7">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-3 hover:border-gray-4'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-4 mb-2" />
          <p className="text-sm text-gray-6 mb-2">
            Arraste e solte o arquivo aqui ou
          </p>
          <label className="cursor-pointer">
            <span className="text-primary hover:text-primary-hard font-medium">
              clique para selecionar
            </span>
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-gray-5 mt-2">
            Tipos aceitos: {acceptedTypes} • Máximo: {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-3 rounded-lg p-4 bg-gray-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-gray-9">{uploadedFile.name}</p>
                <p className="text-xs text-gray-6">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <button
                type="button"
                onClick={onRemoveFile}
                className="text-gray-4 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
