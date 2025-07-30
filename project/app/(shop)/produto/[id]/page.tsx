'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Heart, ShoppingCart, Star, Share2, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const { state, dispatch } = useMarketplace();
  const productId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Find the product
  const product = state.products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Produto não encontrado</h1>
          <p className="text-gray-6 mb-8">O produto que você está procurando não existe.</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <ArrowLeft size={16} className="mr-2" />
              Voltar à Banca
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity } 
    });
    dispatch({ type: 'SHOW_CART_POPUP' });
  };

  const handleAddToWishlist = () => {
    const isInWishlist = state.wishlist.some(item => item.id === product.id);
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

  const isInWishlist = state.wishlist.some(item => item.id === product.id);

  // Get related products (same category, excluding current product)
  const relatedProducts = state.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/loja" className="hover:text-primary"> Banca</Link> / 
          <Link href={`/loja?category=${product.category}`} className="hover:text-primary"> {product.category}</Link> / 
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
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
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
                  <span className="text-sm text-gray-6">Vendido por {product.sellerName}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-3'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-6">(4.0 - 12 avaliações)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-6 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-primary' : 'bg-danger'}`}></div>
                  <span className={`font-medium ${product.inStock ? 'text-primary' : 'text-danger'}`}>
                    {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-7">Quantidade</label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-3 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-1 transition-colors disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
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
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-primary hover:bg-primary-hard text-white py-3"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className={`border-2 ${
                    isInWishlist 
                      ? 'border-danger text-danger hover:bg-danger hover:text-white' 
                      : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart size={20} className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </Button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-2">
                <div className="flex items-center space-x-2">
                  <Truck size={20} className="text-primary" />
                  <span className="text-sm text-gray-6">Entrega Grátis</span>
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
                    <div className="flex justify-between">
                      <span className="text-gray-6">Tempo de Entrega:</span>
                      <span className="text-gray-9">1-3 dias úteis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto text-gray-4 mb-4" />
                <h3 className="text-lg font-medium text-gray-9 mb-2">Avaliações</h3>
                <p className="text-gray-6">As avaliações para este produto ainda não estão disponíveis.</p>
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