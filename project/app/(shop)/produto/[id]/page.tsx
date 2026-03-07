'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAddToCart, useUpdateCartItem, useRemoveFromCart, useCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useCheckWishlistStatus } from '@/hooks/useWishlist';
import { useProduct } from '@/hooks/useProducts';
import { useProductReviews, useReviewStatistics, useMarkReviewHelpful } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';
import ReviewList from '@/components/reviews/ReviewList';
import { Heart, ShoppingCart, Star, Share2, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/ProductCard';
import { formatCurrency } from '@/lib/payment';
// API calls are encapsulated in hooks (useProduct, useAddToCart, useAddToWishlist)

export default function ProductPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const productId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product data from API via hook
  const { data: product, isLoading, error } = useProduct(productId);

  // Review hooks
  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(productId, {
    page: 1,
    limit: 10,
    status: 'approved',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const { data: reviewStats } = useReviewStatistics(productId);
  const markHelpful = useMarkReviewHelpful();

  // Cart and wishlist hooks
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const { data: cart } = useCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { toast } = useToast();

  // Check wishlist status via hook - must be called before any early returns
  const { data: isInWishlist = false } = useCheckWishlistStatus(productId);

  // Check if product is in cart and get current quantity
  const cartItem = cart?.items?.find((item: any) => item.productId?._id === product?._id);
  const isInCart = !!cartItem;
  const currentCartQuantity = cartItem?.quantity || 0;

  if (isLoading) {
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Produto não encontrado</h1>
          <p className="text-gray-6 mb-8">O produto que você está procurando não existe.</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <ArrowLeft size={16} className="mr-2" />
              Voltar para as Compras
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para adicionar itens ao carrinho.',
        variant: 'destructive',
      });
      return;
    }

    addToCart.mutate(
      {
        productId: product._id,
        quantity,
        productSnapshot: {
          name: product.name,
          price: product.price,
          primaryImage: product.primaryImage ?? (product.images?.[0] as any)?.url,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Adicionado ao carrinho',
            description: `${product.name} foi adicionado ao seu carrinho.`,
          });
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao adicionar ao carrinho';
          toast({
            title: 'Erro',
            description: apiError,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para gerenciar sua lista de desejos.',
        variant: 'destructive',
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate(product._id, {
        onSuccess: () => {
          toast({
            title: 'Removido da lista de desejos',
            description: `${product.name} foi removido da sua lista de desejos.`,
          });
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao remover da lista de desejos';
          toast({
            title: 'Erro',
            description: apiError,
            variant: 'destructive',
          });
        },
      });
    } else {
      addToWishlist.mutate(product._id, {
        onSuccess: () => {
          toast({
            title: 'Adicionado à lista de desejos',
            description: `${product.name} foi adicionado à sua lista de desejos.`,
          });
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao adicionar à lista de desejos';
          toast({
            title: 'Erro',
            description: apiError,
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para atualizar o carrinho.',
        variant: 'destructive',
      });
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveFromCart();
      return;
    }

    updateCartItem.mutate(
      { productId: product._id, quantity: newQuantity },
      {
        onSuccess: () => {
          toast({
            title: 'Carrinho atualizado',
            description: `Quantidade de ${product.name} atualizada para ${newQuantity}.`,
          });
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao atualizar carrinho';
          toast({
            title: 'Erro',
            description: apiError,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleRemoveFromCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para remover itens do carrinho.',
        variant: 'destructive',
      });
      return;
    }

    removeFromCart.mutate(product._id, {
      onSuccess: () => {
        toast({
          title: 'Removido do carrinho',
          description: `${product.name} foi removido do seu carrinho.`,
        });
      },
      onError: (error: any) => {
        const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao remover do carrinho';
        toast({
          title: 'Erro',
          description: apiError,
          variant: 'destructive',
        });
      },
    });
  };

  // For now, we'll show an empty related products section
  // This could be enhanced with a separate API call for related products
  const relatedProducts: any[] = [];

  // Combine primaryImage and images array, handling both string and object formats
  const allImages = [
    ...(product?.primaryImage ? [product.primaryImage] : []),
    ...(product?.images?.map(img => typeof img === 'string' ? img : (img as any).url) || [])
  ].filter(Boolean);

  // Get current selected image
  const currentImage = allImages[selectedImage] || product?.primaryImage || '/placeholder-product.jpg';

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/loja" className="hover:text-primary"> Comprar Agora</Link> / 
          <Link href={`/loja?category=${product.category}`} className="hover:text-primary"> {product.category}</Link> 
          <span className="text-primary">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-1 rounded-lg overflow-hidden">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {allImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-1 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={product.sellerLogo || 'https://placehold.co/20x20/cccccc/000000?text=S'}
                    alt={product.sellerName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-6">Vendido por </span>
                  <Link 
                    href={`/vendedor/${typeof product.sellerId === 'object' ? product.sellerId._id : product.sellerId}`}
                    className="text-sm text-primary hover:text-primary-hard font-medium transition-colors"
                  >
                    {product.sellerName}
                  </Link>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.round(reviewStats?.averageRating || product.rating || product.averageRating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-3'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-6">
                    ({(reviewStats?.averageRating || product.rating || product.averageRating || 0).toFixed(1)} -{' '}
                    {reviewStats?.totalReviews || product.totalReviews || product.reviews || 0} avaliações)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-6 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className={`w-3 h-3 rounded-full ${(product.stock > 0 || product.inStock) ? 'bg-primary' : 'bg-danger'}`}></div>
                  <span className={`font-medium ${(product.stock > 0 || product.inStock) ? 'text-primary' : 'text-danger'}`}>
                    {(product.stock > 0 || product.inStock) ? 'Em Estoque' : 'Fora de Estoque'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-7">Quantidade</label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-3 rounded-lg">
                    <button
                      onClick={() => handleUpdateCartQuantity(currentCartQuantity - 1)}
                      disabled={addToCart.isPending || updateCartItem.isPending || removeFromCart.isPending}
                      className="p-2 hover:bg-gray-1 transition-colors disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium">{currentCartQuantity}</span>
                    <button
                      onClick={() => handleUpdateCartQuantity(currentCartQuantity + 1)}
                      disabled={addToCart.isPending || updateCartItem.isPending || removeFromCart.isPending}
                      className="p-2 hover:bg-gray-1 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-6">
                    {product.weight && `${product.weight}g`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                {isInCart ? (
                  <div className="flex-1 space-y-2">
                    <Button
                      onClick={handleRemoveFromCart}
                      disabled={addToCart.isPending || updateCartItem.isPending || removeFromCart.isPending}
                      variant="outline"
                      className="w-full border-danger text-danger hover:bg-danger hover:text-white"
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Remover do Carrinho
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!(product.stock > 0 || product.inStock) || addToCart.isPending}
                    className="flex-1 bg-primary hover:bg-primary-hard text-white py-3"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    {addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </Button>
                )}
                
                <Button
                  onClick={handleToggleWishlist}
                  disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                  variant="outline"
                  className={`border-2 ${
                    isInWishlist 
                      ? 'border-danger text-danger hover:bg-danger hover:text-white' 
                      : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart size={20} className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {addToWishlist.isPending || removeFromWishlist.isPending 
                    ? 'Processando...' 
                    : isInWishlist 
                      ? 'Remover dos Favoritos' 
                      : 'Adicionar aos Favoritos'
                  }
                </Button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-2">
                <div className="flex items-center space-x-2">
                  <Truck size={20} className="text-primary" />
                  <span className="text-sm text-gray-6">Entrega Grátis acima de 500 MZN</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-primary" />
                  <span className="text-sm text-gray-6">Garantia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 size={20} className="text-primary" />
                  <span className="text-sm text-gray-6">Compartilhar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-2">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Descrição' },
                { id: 'details', label: 'Informações Adicionais' },
                { id: 'reviews', label: 'Avaliações' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-6 hover:text-gray-9'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-7 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-9 mb-3">Informações do Produto</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-6">Categoria:</span>
                      <span className="text-gray-9">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-6">Tipo:</span>
                      <span className="text-gray-9">{product.type}</span>
                    </div>
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-6">Peso:</span>
                        <span className="text-gray-9">{product.weight}g</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-6">Cor:</span>
                        <span className="text-gray-9">{product.color}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-9 mb-3">Informações do Vendedor</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-6">Vendedor:</span>
                      <span className="text-gray-9">{product.sellerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-6">Avaliação:</span>
                      <span className="text-gray-9">4.8/5.0</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-6">Tempo de Entrega:</span>
                      <span className="text-gray-9">1-3 dias úteis</span>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Reviews Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold text-gray-9">
                        {(reviewStats?.averageRating || product.rating || product.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-6">
                        ({reviewStats?.totalReviews || product.totalReviews || product.reviews || 0} avaliações)
                      </span>
                    </div>
                  </div>
                  {isAuthenticated && (
                    <Link href={`/produto/${product._id}/avaliar`}>
                      <Button className="bg-primary hover:bg-primary-hard text-white">
                        Avaliar Produto
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="text-gray-6">Carregando avaliações...</p>
                  </div>
                ) : (
                  <ReviewList
                    reviews={reviewsData?.reviews || []}
                    onHelpful={(reviewId, isHelpful) => {
                      markHelpful.mutate({ reviewId, isHelpful });
                    }}
                  />
                )}

                {/* Load More Reviews */}
                {reviewsData && reviewsData.totalPages > 1 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Ver Todas as Avaliações
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-9 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 