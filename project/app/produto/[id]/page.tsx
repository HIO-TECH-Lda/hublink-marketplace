'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Heart, ShoppingCart, Share2, Facebook, Twitter, Instagram, Plus, Minus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function ProductDetailsPage() {
  const params = useParams();
  const { state, dispatch } = useMarketplace();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descricao');

  const product = state.products.find(p => p.id === params.id);
  const productReviews = state.reviews.filter(r => r.productId === params.id);
  const relatedProducts = state.products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Produto não encontrado</h1>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Voltar para a Loja
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity } 
    });
    dispatch({ type: 'SHOW_CART_POPUP' });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/loja" className="hover:text-primary"> Loja</Link> / 
          <Link href={`/loja?category=${product.category}`} className="hover:text-primary"> {product.category}</Link> / 
          <span className="text-primary">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link href="/loja" className="inline-flex items-center text-gray-6 hover:text-primary mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Voltar à Loja
        </Link>

        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-1 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-1 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">{product.name}</h1>
              
              {/* Seller Info */}
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={product.sellerLogo || 'https://placehold.co/40x40/cccccc/000000?text=S'}
                  alt={product.sellerName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-6">Vendido por</span>
                <Link href={`/vendedor/${product.sellerId}`} className="text-primary hover:text-primary-hard font-medium">
                  {product.sellerName}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-3'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-6">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* SKU */}
              <p className="text-sm text-gray-6">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.originalPrice && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-6 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-danger text-white text-xs px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
              <div className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-primary' : 'bg-danger'}`}></div>
              <span className="text-sm font-medium">
                {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
              </span>
            </div>

            {/* Brand */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-6">Marca:</span>
              <span className="text-sm font-medium">{product.brand}</span>
            </div>

            {/* Share */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-6">Compartilhar:</span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-6 hover:text-blue-600 transition-colors">
                  <Facebook size={16} />
                </button>
                <button className="p-2 text-gray-6 hover:text-blue-400 transition-colors">
                  <Twitter size={16} />
                </button>
                <button className="p-2 text-gray-6 hover:text-pink-600 transition-colors">
                  <Instagram size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-7 leading-relaxed">{product.description}</p>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center border border-gray-3 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-1 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-none focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-1 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-primary hover:bg-primary-hard text-white"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                </Button>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-6">Categoria:</span>
                <Link href={`/loja?category=${product.category}`} className="ml-2 text-primary hover:text-primary-hard">
                  {product.category}
                </Link>
              </div>
              <div>
                <span className="text-sm text-gray-6">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-1 text-gray-7 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="informacoes">Informações Adicionais</TabsTrigger>
              <TabsTrigger value="feedback">Feedback do Cliente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="descricao" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-7 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-7 leading-relaxed mt-4">
                  Este produto é cultivado seguindo rigorosos padrões orgânicos, garantindo que você receba alimentos 
                  frescos, nutritivos e livres de agrotóxicos. Nossos produtores são certificados e comprometidos 
                  com a sustentabilidade e qualidade.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="informacoes" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-2">
                    <span className="font-medium">Peso</span>
                    <span className="text-gray-6">{product.weight}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-2">
                    <span className="font-medium">Cor</span>
                    <span className="text-gray-6">{product.color}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-2">
                    <span className="font-medium">Categoria</span>
                    <span className="text-gray-6">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-2">
                    <span className="font-medium">Status do Estoque</span>
                    <span className="text-gray-6">{product.stockStatus}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-2">
                    <span className="font-medium">Tipo</span>
                    <span className="text-gray-6">{product.type}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-6">
              <div className="space-y-6">
                {productReviews.length > 0 ? (
                  productReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-2 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.userImage}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-9">{review.userName}</h4>
                            <span className="text-sm text-gray-6">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-3'}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-7 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-6 text-center py-8">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-9 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 