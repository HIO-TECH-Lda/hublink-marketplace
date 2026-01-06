'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/api';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product._id, quantity: 1 });
  };

  const handleAddToWishlist = () => {
    addToWishlist.mutate(product._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/produto/${product._id}`}>
        <div className="relative">
          <Image
            src={product.primaryImage || (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) || '/placeholder.jpg'}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              -{discountPercentage}%
            </div>
          )}
          {product.isNewArrival && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
              New
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/produto/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {(product.averageRating || product.rating) && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.averageRating || product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.totalReviews || product.reviews || 0})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Stock: {product.stock}
          </span>
          <div className="flex space-x-2">
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="sm"
            >
              <Heart size={16} />
            </Button>
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={addToCart.isPending}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
