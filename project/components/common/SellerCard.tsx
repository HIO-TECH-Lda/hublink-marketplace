'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Package, MapPin, Award } from 'lucide-react';
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
  isTopSeller: boolean;
  joinedDate: string;
}

interface SellerCardProps {
  seller: Seller;
  showStats?: boolean;
}

export default function SellerCard({ seller, showStats = true }: SellerCardProps) {
  return (
    <Link href={`/vendedor/${seller.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-4">
            {/* Logo */}
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {seller.logo ? (
                <img
                  src={seller.logo}
                  alt={seller.businessName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {seller.businessName.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-9 truncate group-hover:text-primary transition-colors">
                  {seller.businessName}
                </h3>
                {seller.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verificado
                  </Badge>
                )}
                {seller.isTopSeller && (
                  <Badge className="bg-warning text-white text-xs">
                    <Award size={12} className="mr-1" />
                    Top
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(seller.rating) ? 'text-warning fill-warning' : 'text-gray-3'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-6">
                  {seller.rating} ({seller.reviewCount})
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1 text-sm text-gray-6">
                <MapPin size={14} />
                <span>{seller.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-7 mb-4 line-clamp-2">
            {seller.businessDescription}
          </p>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-1 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Package size={16} className="text-primary" />
                  <span className="text-sm font-medium text-gray-9">{seller.totalProducts}</span>
                </div>
                <span className="text-xs text-gray-6">Produtos</span>
              </div>
              <div className="text-center p-3 bg-gray-1 rounded-lg">
                <div className="text-sm font-medium text-gray-9 mb-1">
                  {seller.totalSales.toLocaleString('pt-MZ')} MZN
                </div>
                <span className="text-xs text-gray-6">Vendas</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-white"
          >
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
} 