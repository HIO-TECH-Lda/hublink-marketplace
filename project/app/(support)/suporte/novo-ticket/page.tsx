'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useMarketplace, TicketCategory, TicketPriority, TicketStatus } from '@/contexts/MarketplaceContext';

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useMarketplace();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [priority, setPriority] = useState<TicketPriority | ''>('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill from URL parameters
  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    const urlProductId = searchParams.get('productId');
    const urlCategory = searchParams.get('category');
    
    if (urlOrderId) setOrderId(urlOrderId);
    if (urlProductId) setProductId(urlProductId);
    if (urlCategory && Object.values(TicketCategory).includes(urlCategory as TicketCategory)) {
      setCategory(urlCategory as TicketCategory);
    }
  }, [searchParams]);

  const categoryOptions = [
    { value: TicketCategory.TECHNICAL_ISSUE, label: 'Problema Técnico', icon: '🔧' },
    { value: TicketCategory.PAYMENT_PROBLEM, label: 'Problema com Pagamento', icon: '💳' },
    { value: TicketCategory.ORDER_ISSUE, label: 'Problema com Pedido', icon: '📦' },
    { value: TicketCategory.RETURN_REQUEST, label: 'Solicitação de Devolução', icon: '🔄' },
    { value: TicketCategory.ACCOUNT_ISSUE, label: 'Problema com Conta', icon: '👤' },
    { value: TicketCategory.PRODUCT_ISSUE, label: 'Problema com Produto', icon: '🛍️' },
    { value: TicketCategory.SHIPPING_PROBLEM, label: 'Problema com Envio', icon: '🚚' },
    { value: TicketCategory.GENERAL_INQUIRY, label: 'Consulta Geral', icon: '❓' },
    { value: TicketCategory.FEATURE_REQUEST, label: 'Solicitação de Funcionalidade', icon: '💡' },
    { value: TicketCategory.BUG_REPORT, label: 'Reportar Bug', icon: '🐛' }
  ];

  const priorityOptions = [
    { value: TicketPriority.LOW, label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
    { value: TicketPriority.MEDIUM, label: 'Média', color: 'bg-blue-100 text-blue-800' },
    { value: TicketPriority.HIGH, label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: TicketPriority.URGENT, label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`Arquivo ${file.name} é muito grande. Tamanho máximo: 5MB`);
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!priority) {
      newErrors.priority = 'Prioridade é obrigatória';
    }

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!state.user) {
      alert('Você precisa estar logado para criar um ticket');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTicket = {
        id: `TICK-${Date.now()}`,
        title,
        description,
        category: category as TicketCategory,
        priority: priority as TicketPriority,
        status: TicketStatus.OPEN,
        userId: state.user.id,
        userType: state.user.role as 'buyer' | 'seller' | 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [{
          id: `msg-${Date.now()}`,
          ticketId: `TICK-${Date.now()}`,
          userId: state.user.id,
          userType: state.user.role as 'buyer' | 'seller' | 'admin',
          message: description,
          createdAt: new Date().toISOString(),
          isInternal: false,
          attachments: []
        }],
        tags: [],
        attachments: [],
        orderId: orderId || undefined,
        productId: productId || undefined
      };

      // Add to context (in real app, this would be an API call)
      dispatch({ type: 'ADD_TICKET', payload: newTicket });

      // Show success message
      alert('Ticket criado com sucesso!');
      router.push('/suporte/meus-tickets');
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Erro ao criar ticket. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para criar um ticket de suporte.</p>
          <Button onClick={() => router.push('/entrar')} className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Novo Ticket de Suporte</h1>
            <p className="text-gray-6">Descreva seu problema ou solicitação para que possamos ajudá-lo.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Novo Ticket
              </CardTitle>
              <CardDescription>
                Preencha os campos abaixo com as informações do seu problema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Ticket *
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Descreva brevemente o problema"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade *
                    </label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                      <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <Badge className={option.color}>
                              {option.label}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.priority && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.priority}
                      </p>
                    )}
                  </div>
                </div>

                {/* Related Order/Product */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número do Pedido (opcional)
                    </label>
                    <Input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Ex: ORD-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID do Produto (opcional)
                    </label>
                    <Input
                      type="text"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="Ex: PROD-123"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzir, se aplicável..."
                    rows={6}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anexos (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Máximo 5MB por arquivo. Formatos: PDF, JPG, PNG
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Selecionar Arquivos
                      </Button>
                    </label>
                  </div>

                  {/* File List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-hard text-white"
                  >
                    {isSubmitting ? 'Criando Ticket...' : 'Criar Ticket'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
