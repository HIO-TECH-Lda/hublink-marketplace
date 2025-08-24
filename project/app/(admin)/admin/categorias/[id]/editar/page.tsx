'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Tag, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Upload
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  productCount: number;
  image?: string;
  parentCategory?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    parentCategory: ''
  });

  const [parentCategories] = useState([
    { id: '1', name: 'Alimentos' },
    { id: '2', name: 'Bebidas' },
    { id: '3', name: 'Cuidados Pessoais' },
    { id: '4', name: 'Casa e Jardim' }
  ]);

  useEffect(() => {
    loadCategory();
  }, [params.id]);

  const loadCategory = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockCategory: Category = {
      id: params.id as string,
      name: 'Frutas',
      description: 'Frutas frescas e orgânicas cultivadas localmente',
      slug: 'frutas',
      status: 'active',
      productCount: 25,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z'
    };

    setCategory(mockCategory);
    
    setFormData({
      name: mockCategory.name,
      description: mockCategory.description,
      status: mockCategory.status,
      parentCategory: mockCategory.parentCategory || 'none'
    });
    
    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da categoria é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (category) {
        const updatedCategory: Category = {
          ...category,
          name: formData.name,
          description: formData.description,
          status: formData.status as Category['status'],
          parentCategory: formData.parentCategory === 'none' ? undefined : formData.parentCategory,
          updatedAt: new Date().toISOString()
        };

        setCategory(updatedCategory);
      }

      router.push(`/admin/categorias`);
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando categoria...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Tag className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Categoria não encontrada</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Categoria</h1>
            <p className="text-gray-6">{category.name}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome da Categoria *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Descrição *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status and Parent Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Categoria Pai</label>
                    <Select value={formData.parentCategory} onValueChange={(value) => setFormData({...formData, parentCategory: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria pai" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
                        {parentCategories.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Imagem da Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Tag className="w-12 h-12 text-gray-4" />
                  </div>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Imagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Slug:</span>
                    <span className="font-medium">{category.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Produtos:</span>
                    <span className="font-medium">{category.productCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">{category.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Criada em:</span>
                    <span className="font-medium">{new Date(category.createdAt).toLocaleDateString('pt-MZ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
} 