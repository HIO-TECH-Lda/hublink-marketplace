'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReviewForm, { ReviewFormValues } from '@/components/reviews/ReviewForm';
import StarRating from '@/components/reviews/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/hooks/useProducts';
import { useUserOrders } from '@/hooks/useOrders';
import { useCreateReview } from '@/hooks/useReviews';
import { formatCurrency } from '@/lib/payment';

export default function ProductReviewPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { loading: authLoading, isAuthenticated } = useAuth();
  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId);
  const {
    data: ordersData,
    isLoading: ordersLoading,
  } = useUserOrders({ limit: 50 }, { enabled: isAuthenticated });
  const createReview = useCreateReview();

  const [isSuccess, setIsSuccess] = useState(false);

  const eligibleOrders = useMemo(() => {
    if (!ordersData?.orders || !product) return [];

    const normalizedProductId = product._id || productId;
    return ordersData.orders.filter((order) => {
      const status = (order.status || '').toLowerCase();
      const isDeliveredOrCompleted = status === 'delivered' || status === 'completed';
      if (!isDeliveredOrCompleted) return false;

      const containsProduct = (order.items || []).some((item) => {
        const itemProductId =
          item.productId?._id ||
          (typeof item.productId === 'string' ? item.productId : undefined) ||
          item.product?._id ||
          (item.product as any)?.id;
        return itemProductId === normalizedProductId;
      });

      return containsProduct;
    });
  }, [ordersData, product, productId]);

  const orderOptions = useMemo(() => {
    return eligibleOrders.map((order) => {
      const id = order._id || (order as any).id;
      const label = `Pedido #${order.orderNumber || (order._id || '').slice(-6)}`;
      const description = `${new Date(order.createdAt || order.date || '').toLocaleDateString('pt-BR')} • ${formatCurrency(
        order.totalAmount || order.total || 0,
      )}`;
      return { id, label, description };
    });
  }, [eligibleOrders]);

  const isLoadingState = authLoading || productLoading || (isAuthenticated && ordersLoading);

  const handleSubmitReview = async (formValues: ReviewFormValues) => {
    if (!product) return;

    try {
      await createReview.mutateAsync({
        productId: product._id,
        orderId: formValues.orderId,
        rating: formValues.rating,
        title: formValues.title,
        content: formValues.content,
        images: formValues.images,
      });
      setIsSuccess(true);
    } catch (error) {
      // mutation already displays toast; no further action
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingState) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-gray-6">Carregando informações...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-9">Acesso Negado</h1>
          <p className="mb-8 text-gray-6">Você precisa estar logado para avaliar produtos.</p>
          <Link href="/entrar">
            <Button className="bg-primary text-white hover:bg-primary-hard">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-9">Erro</h1>
          <p className="mb-8 text-gray-6">Não foi possível carregar as informações do produto.</p>
          <Link href="/loja">
            <Button className="bg-primary text-white hover:bg-primary-hard">Voltar para a loja</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />

        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-9">Avaliação Enviada!</CardTitle>
                <CardDescription className="text-gray-6">
                  Obrigado por compartilhar sua experiência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm text-gray-6">
                  Sua avaliação foi enviada com sucesso e será revisada em breve.
                </p>
                <div className="space-y-2">
                  <Link href={`/produto/${product._id}`}>
                    <Button className="w-full bg-primary text-white hover:bg-primary-hard">
                      Voltar ao Produto
                    </Button>
                  </Link>
                  <Link href="/loja">
                    <Button variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const primaryImage = product.primaryImage || (Array.isArray(product.images) ? product.images[0] : undefined);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-gray-6">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>{' '}
          /
          <Link href="/loja" className="hover:text-primary">
            {' '}
            Loja
          </Link>{' '}
          /
          <Link href={`/produto/${product._id}`} className="hover:text-primary">
            {' '}
            {product.name}
          </Link>{' '}
          /
          <span className="text-primary">Avaliar</span>
        </nav>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Link
              href={`/produto/${product._id}`}
              className="mb-4 inline-flex items-center text-sm text-gray-6 hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Produto
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-gray-9">Avaliar Produto</h1>
            <p className="text-gray-6">Compartilhe sua experiência com outros compradores</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-1">
                  {primaryImage ? (
                    <img src={typeof primaryImage === 'string' ? primaryImage : primaryImage.url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 truncate font-medium text-gray-9">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    {product.sellerLogo && (
                      <img
                        src={product.sellerLogo}
                        alt={product.sellerName}
                        className="h-4 w-4 flex-shrink-0 rounded-full object-cover"
                      />
                    )}
                    {product.sellerName && (
                      <span className="truncate text-sm text-gray-6">Vendido por {product.sellerName}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={product.rating || product.averageRating || 0} size="sm" showValue />
                    <span className="text-sm text-gray-5">
                      ({product.totalReviews || product.reviews || 0} avaliações)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <ReviewForm
              productName={product.name}
              orders={orderOptions}
              onSubmit={handleSubmitReview}
              onCancel={handleCancel}
              isSubmitting={createReview.isPending}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Diretrizes para Avaliações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-6">Seja honesto e objetivo sobre sua experiência com o produto.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-6">Inclua detalhes específicos sobre qualidade, entrega e atendimento.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-6">Evite linguagem ofensiva ou comentários pessoais sobre vendedores.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-6">Fotos ajudam outros compradores a entender melhor o produto.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
} 