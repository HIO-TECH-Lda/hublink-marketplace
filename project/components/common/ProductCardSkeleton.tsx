'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-2 rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-2" />
      <div className="p-2 space-y-2">
        <div className="h-3 bg-gray-2 rounded w-full" />
        <div className="h-3 bg-gray-2 rounded w-2/3" />
        <div className="h-2.5 bg-gray-2 rounded w-1/2" />
        <div className="h-4 bg-gray-2 rounded w-1/3" />
      </div>
    </div>
  );
}
