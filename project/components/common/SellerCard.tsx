'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Package, MapPin, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Seller {
  id: string;
  businessName: string;
  businessDescription: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
  location: string;
  isVerified: boolean;
  isTopSeller?: boolean;
  isFeatured?: boolean;
  joinedDate: string;
}

interface SellerCardProps {
  seller: Seller;
  showStats?: boolean;
}

export default function SellerCard({ seller, showStats = true }: SellerCardProps) {
  // Ensure seller.id is a string
  const sellerId = typeof seller.id === 'string' ? seller.id : String(seller.id);
  
  return (
    <Link href={`/vendedor/${sellerId}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full relative overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured Badge */}
        {seller.isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold shadow-lg">
              <Star size={12} className="mr-1 fill-white" />
              Destaque
            </Badge>
          </div>
        )}

        <CardContent className="p-6 h-full flex flex-col relative z-10">
          {/* Header with Logo and Basic Info */}
          <div className="flex items-start space-x-4 mb-4">
            {/* Logo Container */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover:scale-105 transition-transform duration-200">
              {seller.logo ? (
                <img
                  src={seller.logo}
                  alt={seller.businessName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {seller.businessName.charAt(0).toUpperCase()}
                </span>
              )}
              
              {/* Verified Badge */}
              {seller.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-9 group-hover:text-primary transition-colors break-words text-lg leading-tight mb-2">
                {seller.businessName}
              </h3>

              {/* Rating with Stars */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(seller.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {seller.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({seller.reviewCount.toLocaleString()})
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-500" />
                <span className="truncate">{seller.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {seller.businessDescription}
            </p>
          </div>

          {/* Stats Section */}
          {showStats && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 mb-4 border border-gray-200 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-200">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{seller.totalProducts.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Produtos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{seller.totalSales.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Vendas</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-medium group-hover:shadow-md"
          >
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
} 