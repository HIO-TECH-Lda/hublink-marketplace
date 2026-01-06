'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

interface ProductsListProps {
  filters?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  };
}

export default function ProductsList({ filters }: ProductsListProps) {
  const { data, isLoading, error } = useProducts(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load products</p>
      </div>
    );
  }

  if (!data?.products?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
