'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Package,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import { MultiImageUpload, ImageFile } from '@/components/ui/multi-image-upload';
import { useAdminProduct, useUpdateProduct } from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useCategories';
import { useAdminSellers } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;
  
  const { data: product, isLoading } = useAdminProduct(productId);
  const { data: categories } = useCategories();
  const { data: sellersData } = useAdminSellers({ limit: 100 });
  const updateProduct = useUpdateProduct();

  // API returns array directly: {success: true, data: [...]}
  const sellers: any[] = Array.isArray(sellersData) ? sellersData : (sellersData ? [sellersData] : []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'draft',
    categoryId: '',
    subcategoryId: '',
    sellerId: '',
    sku: '',
    primaryImage: null as File | null,
    primaryImagePreview: '' as string,
    images: [] as ImageFile[],
    isFeatured: false,
    isBestSeller: false,
    tags: [] as string[],
    newTag: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      const productData = product as any;
      
      // Convert existing images to ImageFile format for preview
      const existingImages: ImageFile[] = [];
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach((img: any, index: number) => {
          // If it's already a URL, create a placeholder ImageFile
          if (typeof img === 'string' || img.url) {
            const url = typeof img === 'string' ? img : img.url;
            // Create a dummy file object for existing images
            const dummyFile = new File([], `image-${index}.jpg`, { type: 'image/jpeg' });
            existingImages.push({
              file: dummyFile,
              preview: url,
              id: `existing-${index}`
            });
          }
        });
      }
      
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        price: productData.price?.toString() || '',
        originalPrice: productData.originalPrice?.toString() || '',
        stock: productData.stock?.toString() || '',
        status: productData.status || 'draft',
        categoryId: productData.category?.id || productData.categoryId || '',
        subcategoryId: productData.subcategory?.id || productData.subcategoryId || '',
        sellerId: productData.seller?.id || productData.sellerId || '',
        sku: productData.sku || '',
        primaryImage: null,
        primaryImagePreview: productData.primaryImage || '',
        images: existingImages,
        isFeatured: productData.isFeatured || false,
        isBestSeller: productData.isBestSeller || false,
        tags: productData.tags || [],
        newTag: ''
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.price.trim() || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    if (!formData.stock.trim() || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser zero ou maior';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }
    if (!formData.sellerId) {
      newErrors.sellerId = 'Vendedor é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sellerId', formData.sellerId);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('isBestSeller', formData.isBestSeller.toString());
      
      if (formData.shortDescription) formDataToSend.append('shortDescription', formData.shortDescription);
      if (formData.subcategoryId) formDataToSend.append('subcategoryId', formData.subcategoryId);
      if (formData.originalPrice) formDataToSend.append('originalPrice', formData.originalPrice);
      if (formData.sku) formDataToSend.append('sku', formData.sku);
      
      // Add tags as JSON array
      if (formData.tags.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }

      // Add primary image file (only if new file uploaded)
      if (formData.primaryImage && formData.primaryImage.size > 0) {
        formDataToSend.append('primaryImage', formData.primaryImage);
      } else if (formData.images.length > 0 && formData.images[0].file.size > 0 && !formData.primaryImagePreview) {
        // Use first image as primary if no primary image set
        formDataToSend.append('primaryImage', formData.images[0].file);
      } else if (formData.primaryImagePreview) {
        // Keep existing primary image URL
        formDataToSend.append('primaryImageUrl', formData.primaryImagePreview);
      }

      // Add additional image files (only new files, preserve existing URLs)
      formData.images.forEach((img, index) => {
        if (img.file.size > 0) {
          // New file upload
          formDataToSend.append(`images`, img.file);
        } else {
          // Existing image URL - preserve it
          formDataToSend.append(`imageUrls`, img.preview);
        }
      });

      await updateProduct.mutateAsync({ productId, data: formDataToSend });
      
      toast({
        title: 'Produto atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      
      router.push(`/admin/produtos/${productId}`);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando produto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Produto não encontrado</p>
            <Button onClick={() => router.push('/admin/produtos')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </>
    );
  }

  const productData = product as any;

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Produto</h1>
            <p className="text-gray-6">{productData.name}</p>
          </div>
          <Button onClick={() => router.push(`/admin/produtos/${productId}`)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="shortDescription">Descrição Curta</Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      placeholder="Breve descrição do produto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={6}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Preço e Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (MZN) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Preço Original</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      placeholder="Para produtos em promoção"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Estoque *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category & Seller */}
            <Card>
              <CardHeader>
                <CardTitle>Categoria e Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryId">Categoria *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({...formData, categoryId: value})}
                    >
                      <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: any) => (
                          <SelectItem key={category._id || category.id} value={category._id || category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sellerId">Vendedor *</Label>
                    <Select
                      value={formData.sellerId}
                      onValueChange={(value) => setFormData({...formData, sellerId: value})}
                    >
                      <SelectTrigger className={errors.sellerId ? 'border-red-500' : ''}>
                        <SelectValue placeholder={
                          sellers.length === 0 
                            ? "Nenhum vendedor encontrado"
                            : "Selecione um vendedor"
                        } />
                      </SelectTrigger>
                      {sellers.length > 0 && (
                        <SelectContent>
                          {sellers.map((seller: any) => (
                            <SelectItem key={seller._id || seller.id} value={seller._id || seller.id}>
                              {seller.storeName || seller.businessName || seller.name || seller.fullName || seller.email || 'Vendedor sem nome'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                    {errors.sellerId && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellerId}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status & Flags */}
            <Card>
              <CardHeader>
                <CardTitle>Status e Marcadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Pendente</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="archived">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Produto em Destaque</Label>
                      <p className="text-xs text-gray-6">Exibir na página inicial</p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mais Vendido</Label>
                      <p className="text-xs text-gray-6">Marcar como best seller</p>
                    </div>
                    <Switch
                      checked={formData.isBestSeller}
                      onCheckedChange={(checked) => setFormData({...formData, isBestSeller: checked})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      placeholder="Código do produto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar tag..."
                      value={formData.newTag}
                      onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SingleImageUpload
                    image={formData.primaryImage}
                    preview={formData.primaryImagePreview}
                    onChange={(file) => setFormData({...formData, primaryImage: file})}
                    label="Imagem Principal"
                  />
                </div>
                
                <div>
                  <MultiImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData({...formData, images})}
                    maxImages={5}
                    label="Imagens Adicionais"
                  />
                  <p className="text-xs text-gray-6 mt-2">
                    A primeira imagem será usada como principal se nenhuma imagem principal for selecionada
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Nome:</span>
                    <span className="font-medium">{formData.name || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Preço:</span>
                    <span className="font-medium">
                      {formData.price ? `MZN ${parseFloat(formData.price).toFixed(2)}` : 'Não definido'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Estoque:</span>
                    <span className="font-medium">{formData.stock || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'draft' ? 'Pendente' : 
                       formData.status === 'active' ? 'Ativo' : 
                       formData.status === 'inactive' ? 'Inativo' : 'Rejeitado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? (
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
    </>
  );
}
