'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Seller */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
