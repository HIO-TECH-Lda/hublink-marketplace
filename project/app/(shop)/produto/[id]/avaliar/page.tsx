'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReviewForm from '@/components/reviews/ReviewForm';
import StarRating from '@/components/reviews/StarRating';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  images: File[];
}

export default function ProductReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useMarketplace();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Find product from context
    const foundProduct = state.products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Produto não encontrado.');
    }
  }, [productId, state.products]);

  // Check if user is authenticated
  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para avaliar produtos.</p>
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

  const handleSubmitReview = async (reviewData: ReviewData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success
      setIsSuccess(true);
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-9">
                  Avaliação Enviada!
                </CardTitle>
                <CardDescription className="text-gray-6">
                  Obrigado por compartilhar sua experiência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-6 mb-6">
                  Sua avaliação foi enviada com sucesso e será revisada em breve.
                </p>
                <div className="space-y-2">
                  <Link href={`/produto/${productId}`}>
                    <Button className="w-full bg-primary hover:bg-primary-hard text-white">
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

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Erro</h1>
          <p className="text-gray-6 mb-8">{error}</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Voltar à Loja
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando produto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/loja" className="hover:text-primary"> Loja</Link> / 
          <Link href={`/produto/${product.id}`} className="hover:text-primary"> {product.name}</Link> / 
          <span className="text-primary">Avaliar</span>
        </nav>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href={`/produto/${product.id}`}
              className="inline-flex items-center text-sm text-gray-6 hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Produto
            </Link>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Avaliar Produto</h1>
            <p className="text-gray-6">
              Compartilhe sua experiência com outros compradores
            </p>
          </div>

          {/* Product Info */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-9 mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={product.sellerLogo || 'https://placehold.co/16x16/cccccc/000000?text=S'}
                      alt={product.sellerName}
                      className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-sm text-gray-6 truncate">Vendido por {product.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating
                      rating={product.rating || 0}
                      size="sm"
                      showValue={true}
                    />
                    <span className="text-sm text-gray-5">
                      ({product.reviewCount || 0} avaliações)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Form */}
          <div className="mb-8">
            <ReviewForm
              productId={product.id}
              productName={product.name}
              onSubmit={handleSubmitReview}
              onCancel={handleCancel}
            />
          </div>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">
                Diretrizes para Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-6">
                  Seja honesto e objetivo sobre sua experiência com o produto
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-6">
                  Inclua detalhes específicos sobre qualidade, entrega e atendimento
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-6">
                  Evite linguagem ofensiva ou comentários pessoais sobre vendedores
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-6">
                  Fotos ajudam outros compradores a entender melhor o produto
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 