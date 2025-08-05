'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SellerSidebar from '@/app/(seller)/components/SellerSidebar';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const productId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    sku: '',
    weight: '',
    color: '',
    type: '',
    inStock: true,
    tags: [] as string[],
    images: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');

  // Find the product to edit
  const product = state.products.find(p => p.id === productId);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        weight: product.weight || '',
        color: product.color || '',
        type: product.type || '',
        inStock: product.inStock,
        tags: product.tags || [],
        images: product.images || []
      });
    }
    setIsLoading(false);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      inStock: checked
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update product
      const updatedProduct = {
        ...product!,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.images[0] || product!.image,
        images: formData.images.length > 0 ? formData.images : undefined,
        category: formData.category,
        brand: formData.brand,
        inStock: formData.inStock,
        tags: formData.tags,
        sku: formData.sku,
        weight: formData.weight,
        color: formData.color,
        stockStatus: formData.inStock ? 'Em estoque' : 'Fora de estoque',
        type: formData.type
      };

      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      
      // Redirect to products page
      router.push('/vendedor/produtos');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state.isAuthenticated || !state.user?.isSeller) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado como vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-gray-6">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Produto não encontrado</h1>
          <p className="text-gray-6 mb-8">O produto que você está tentando editar não existe.</p>
          <Link href="/vendedor/produtos">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Voltar aos Produtos
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <nav className="text-sm text-gray-6 mb-2">
                  <Link href="/vendedor/produtos" className="hover:text-primary">Produtos</Link> / 
                  <span className="text-primary"> Editar Produto</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-9">Editar Produto</h1>
              </div>
              <Link href="/vendedor/produtos">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar aos Produtos
                </Button>
              </Link>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-9 mb-4">Informações Básicas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Nome do Produto *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: Tomates Orgânicos"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Categoria *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="Legumes">Legumes</option>
                        <option value="Frutas">Frutas</option>
                        <option value="Verduras">Verduras</option>
                        <option value="Temperos">Temperos</option>
                        <option value="Grãos">Grãos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Marca
                      </label>
                      <Input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Ex: Fazenda Verde"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        SKU
                      </label>
                      <Input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Ex: TOM-ORG-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-7 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o produto em detalhes..."
                    rows={4}
                    required
                  />
                </div>

                {/* Pricing */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-9 mb-4">Preços</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Preço de Venda (MTn) *
                      </label>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Preço Original (MTn)
                      </label>
                      <Input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-9 mb-4">Detalhes do Produto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Peso
                      </label>
                      <Input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Ex: 500g"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Cor
                      </label>
                      <Input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="Ex: Vermelho"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">
                        Tipo
                      </label>
                      <Input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        placeholder="Ex: Orgânico"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-gray-7">
                      Produto em estoque
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-9 mb-4">Tags</h2>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Adicionar tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        className="px-4"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:bg-primary-hard rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-9 mb-4">Imagens</h2>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="URL da imagem"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddImage}
                        variant="outline"
                        className="px-4"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-2">
                  <Link href="/vendedor/produtos">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-hard text-white"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 