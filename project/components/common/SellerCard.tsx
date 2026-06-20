'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, CheckCircle } from 'lucide-react';
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
  const sellerId = typeof seller.id === 'string' ? seller.id : String(seller.id);

  return (
    <Link href={`/vendedor/${sellerId}`} className="block h-full min-w-0">
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer h-full relative overflow-hidden border border-gray-2 shadow-sm hover:border-primary/20 bg-white">
        {seller.isFeatured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-primary text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0">
              <Star size={10} className="mr-0.5 fill-white hidden sm:inline" />
              Destaque
            </Badge>
          </div>
        )}

        <CardContent className="p-3 sm:p-4 h-full flex flex-col relative z-10">
          <div className="flex items-start gap-2.5 sm:gap-3 mb-2 sm:mb-3 min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/10">
              {seller.logo ? (
                <img
                  src={seller.logo}
                  alt={seller.businessName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-base sm:text-lg font-bold text-primary">
                  {seller.businessName.charAt(0).toUpperCase()}
                </span>
              )}

              {seller.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle size={10} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-9 group-hover:text-primary transition-colors text-sm sm:text-base leading-tight line-clamp-2 pr-6 sm:pr-8">
                {seller.businessName}
              </h3>

              <div className="flex items-center gap-1 mt-1 flex-wrap">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={10}
                      className={
                        star <= Math.round(seller.rating)
                          ? 'fill-warning text-warning'
                          : 'fill-gray-3 text-gray-3'
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-8">
                  {seller.rating.toFixed(1)}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-5">
                  ({seller.reviewCount.toLocaleString()})
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-6 mt-1 min-w-0">
                <MapPin size={10} className="flex-shrink-0" />
                <span className="truncate">{seller.location}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-6 leading-relaxed line-clamp-2 mb-2 sm:mb-3 flex-1 min-w-0">
            {seller.businessDescription}
          </p>

          {showStats && (
            <div className="bg-gray-1 rounded-md p-2 mb-2 sm:mb-3 border border-gray-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-gray-9 truncate">
                    {seller.totalProducts.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-6">Produtos</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-gray-9 truncate">
                    {seller.totalSales.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-6">Vendas</div>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-primary text-primary hover:bg-primary hover:text-white"
          >
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
