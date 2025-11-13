'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Upload, X, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateTicket, useUploadAttachment } from '@/hooks/useTickets';
import BuyerSidebar from '@/app/(buyer)/components/BuyerSidebar';
import { TICKET_CATEGORY, TICKET_PRIORITY, validateFile } from '@/lib/ticket-utils';
import { getCategoryText, getPriorityText } from '@/lib/ticket-utils';
import Link from 'next/link';

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createTicket = useCreateTicket();
  const uploadAttachment = useUploadAttachment();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>(TICKET_PRIORITY.MEDIUM);
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    const urlProductId = searchParams.get('productId');
    const urlCategory = searchParams.get('category');

    if (urlOrderId) setOrderId(urlOrderId);
    if (urlProductId) setProductId(urlProductId);
    if (urlCategory && Object.values(TICKET_CATEGORY).includes(urlCategory as any)) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  const categoryOptions = Object.values(TICKET_CATEGORY).map((cat) => ({
    value: cat,
    label: getCategoryText(cat),
    icon: '📋',
  }));

  const priorityOptions = Object.values(TICKET_PRIORITY).map((pri) => ({
    value: pri,
    label: getPriorityText(pri),
  }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        setErrors((prev) => ({ ...prev, attachments: validation.error || 'Arquivo inválido' }));
      }
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!category) newErrors.category = 'Categoria é obrigatória';
    if (!priority) newErrors.priority = 'Prioridade é obrigatória';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const ticketData = {
        title,
        description,
        category,
        priority,
        orderId: orderId || undefined,
        productId: productId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      const ticket = await createTicket.mutateAsync(ticketData);

      // Upload attachments if any
      if (attachments.length > 0 && ticket._id) {
        for (const file of attachments) {
          await uploadAttachment.mutateAsync({
            ticketId: ticket._id,
            file,
          });
        }
      }

      router.push(`/suporte/ticket/${ticket._id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          /{' '}
          <Link href="/suporte/meus-tickets" className="hover:text-primary">
            Meus Tickets
          </Link>{' '}
          / <span className="text-primary">Novo Ticket</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          <div className="lg:col-span-3">
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
                <CardDescription>Preencha os campos abaixo com as informações do seu problema</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade *</label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <Badge className="bg-transparent">{option.label}</Badge>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição Detalhada *
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva detalhadamente o problema..."
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anexos (opcional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Arraste arquivos aqui ou clique para selecionar
                      </p>
                      <p className="text-xs text-gray-500 mb-4">Máximo 5MB por arquivo. Formatos: PDF, JPG, PNG</p>
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

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
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

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={createTicket.isPending}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createTicket.isPending} className="bg-primary hover:bg-primary-hard text-white">
                      {createTicket.isPending ? 'Criando Ticket...' : 'Criar Ticket'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
