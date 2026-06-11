'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSellerReviews } from '@/hooks/useReviews';
import { Star, Search, Filter, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SellerSidebar from '../../components/SellerSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StarRating from '@/components/reviews/StarRating';
import type { Review } from '@/types/api';

export default function SellerReviewsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviewsData, isLoading: reviewsLoading } = useSellerReviews({
    page: 1,
    limit: 50,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const reviews = reviewsData?.reviews || [];

  const filteredReviews = useMemo(() => {
    if (!searchTerm) return reviews;

    const searchLower = searchTerm.toLowerCase();
    return reviews.filter(
      (review) =>
        review.title?.toLowerCase().includes(searchLower) ||
        review.content?.toLowerCase().includes(searchLower) ||
        (typeof review.productId === 'object' &&
          review.productId.name?.toLowerCase().includes(searchLower)) ||
        (typeof review.userId === 'object' &&
          `${review.userId.firstName} ${review.userId.lastName}`.toLowerCase().includes(searchLower)),
    );
  }, [reviews, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  const getUserName = (userId: Review['userId']): string => {
    if (typeof userId === 'string') return 'Utilizador';
    return `${userId.firstName || ''} ${userId.lastName || ''}`.trim() || 'Utilizador';
  };

  const getProductName = (productId: Review['productId']): string => {
    if (typeof productId === 'string') return 'Produto';
    return productId.name || 'Produto';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-9">Acesso Negado</h1>
          <p className="mb-8 text-gray-6">Você precisa ser um vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary text-white hover:bg-primary-hard">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-9 mb-2">Avaliações dos Meus Produtos</h1>
                <p className="text-gray-6">Gira e acompanhe as avaliações feitas pelos clientes aos produtos da sua banca. Consulte comentários, classificações, estado da avaliação e feedback dos compradores.</p>
              </div>

              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por produto, cliente ou conteúdo da avaliação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="approved">Aprovadas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="rejected">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                  <p className="text-gray-6">Carregando avaliações...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-12 text-center">
                  <Star className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-9">Nenhuma avaliação encontrada</h3>
                  <p className="text-gray-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Tente ajustar os filtros de busca.'
                      : 'Ainda não há avaliações para seus produtos.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((review) => {
                    const userName = getUserName(review.userId);
                    const productName = getProductName(review.productId);
                    const productId =
                      typeof review.productId === 'object' ? review.productId._id : review.productId;

                    return (
                      <Card key={review._id} className="border border-gray-2">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Link
                                  href={`/produto/${productId}`}
                                  className="font-semibold text-gray-9 hover:text-primary transition-colors"
                                >
                                  {productName}
                                </Link>
                                <Badge className={getStatusColor(review.status)}>
                                  {getStatusText(review.status)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={review.rating} size="sm" showValue={false} />
                                <span className="text-sm text-gray-6">{review.rating}/5</span>
                              </div>
                              <p className="text-sm text-gray-5">
                                Por <span className="font-medium text-gray-7">{userName}</span> em{' '}
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                            {review.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Compra Verificada
                              </Badge>
                            )}
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-9 mb-2">{review.title}</h4>
                            <p className="text-gray-7 text-sm leading-relaxed">{review.content}</p>
                          </div>

                          {review.images && review.images.length > 0 && (
                            <div className="mb-4">
                              <div className="grid grid-cols-3 gap-2">
                                {review.images.slice(0, 3).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="h-20 w-full rounded-lg object-cover"
                                  />
                                ))}
                              </div>
                              {review.images.length > 3 && (
                                <p className="mt-1 text-sm text-gray-5">
                                  +{review.images.length - 3} mais imagens
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-2">
                            <div className="flex items-center gap-4 text-sm text-gray-6">
                              <span>
                                Útil: {review.helpfulVotes || 0} | Não útil: {review.notHelpfulVotes || 0}
                              </span>
                            </div>
                            <Link href={`/produto/${productId}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Produto
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

