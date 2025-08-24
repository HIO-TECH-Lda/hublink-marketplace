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
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full relative overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Top Seller Badge - Positioned absolutely */}
        {/* {seller.isTopSeller && (
          <div className="absolute top-3 right-3 z-10 animate-pulse">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
              <Award size={12} className="mr-1" />
              Top Vendedor
            </Badge>
          </div>
        )} */}

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

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(seller.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {seller.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({seller.reviewCount})
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
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-200">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Package size={16} className="text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{seller.totalProducts}</div>
                  <div className="text-xs text-gray-600 font-medium">Produtos</div>
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