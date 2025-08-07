'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Package, 
  User, 
  Star, 
  Edit, 
  Eye,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Building,
  Tag,
  FileText
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  seller: {
    id: string;
    name: string;
    businessName: string;
    email: string;
    phone: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

interface Review {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock product data
    const mockProduct: Product = {
      id: params.id as string,
      name: 'Maçãs Orgânicas',
      description: 'Maçãs orgânicas frescas e saborosas, cultivadas sem agrotóxicos. Perfeitas para consumo direto ou para preparo de receitas saudáveis.',
      price: 150.00,
      category: 'Frutas',
      tags: ['orgânico', 'fresco', 'saudável', 'sem agrotóxicos'],
      seller: {
        id: '1',
        name: 'João Silva',
        businessName: 'Fazenda Verde',
        email: 'joao@fazendaverde.com',
        phone: '(258) 84-123-4567'
      },
      status: 'active',
      rating: 4.8,
      reviewCount: 25,
      stock: 50,
      image: '/images/apples.jpg',
      images: ['/images/apples.jpg', '/images/apples-2.jpg', '/images/apples-3.jpg'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z'
    };

    const mockReviews: Review[] = [
      {
        id: '1',
        customer: {
          name: 'Maria Santos',
          email: 'maria@email.com'
        },
        rating: 5,
        comment: 'Excelente qualidade! As maçãs são muito saborosas e frescas.',
        createdAt: '2024-01-18T15:30:00Z'
      },
      {
        id: '2',
        customer: {
          name: 'Pedro Oliveira',
          email: 'pedro@email.com'
        },
        rating: 4,
        comment: 'Boa qualidade, entrega rápida. Recomendo!',
        createdAt: '2024-01-17T12:20:00Z'
      }
    ];

    setProduct(mockProduct);
    setReviews(mockReviews);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (product) {
      setProduct({
        ...product,
        status: newStatus as Product['status'],
        updatedAt: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando produto...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Produto não encontrado</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Detalhes do Produto</h1>
            <p className="text-gray-6">{product.name}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Status do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${getStatusColor(product.status)} text-sm`}>
                    {getStatusText(product.status)}
                  </Badge>
                  <p className="text-sm text-gray-6 mt-2">
                    Última atualização: {formatDate(product.updatedAt)}
                  </p>
                </div>
                <Select value={product.status} onValueChange={handleUpdateStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informações do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Nome do Produto</label>
                  <p className="text-gray-9 font-medium">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Descrição</label>
                  <p className="text-gray-9">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Preço</label>
                    <p className="text-gray-9 font-medium text-lg">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Estoque</label>
                    <p className="text-gray-9 font-medium">{product.stock} unidades</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Categoria</label>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Imagens do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Avaliações ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-9">{review.customer.name}</p>
                        <p className="text-sm text-gray-6">{review.customer.email}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-7">{review.comment}</p>
                    <p className="text-xs text-gray-5 mt-2">{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Vendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-9">{product.seller.businessName}</p>
                  <p className="text-sm text-gray-6">{product.seller.name}</p>
                  <p className="text-sm text-gray-6">{product.seller.email}</p>
                  <p className="text-sm text-gray-6">{product.seller.phone}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Ver Vendedor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Avaliação:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{product.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Avaliações:</span>
                  <span className="font-medium">{product.reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Preço:</span>
                  <span className="font-bold">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Estoque:</span>
                  <span className="font-medium">{product.stock} unidades</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Produto Criado</p>
                    <p className="text-xs text-gray-6">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
                {product.status === 'active' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Aprovado</p>
                      <p className="text-xs text-gray-6">{formatDate(product.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {product.status === 'rejected' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Rejeitado</p>
                      <p className="text-xs text-gray-6">{formatDate(product.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 