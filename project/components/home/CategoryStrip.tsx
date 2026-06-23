'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { Loader2, Grid3X3 } from 'lucide-react';

export default function CategoryStrip() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <section className="bg-white border-b border-gray-2">
      <div className="container px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category._id}
              href={`/loja?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center gap-1.5 min-w-[64px] sm:min-w-[72px] group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-lighter border border-primary/10 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <Grid3X3 size={20} className="text-primary" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-8 text-center line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
