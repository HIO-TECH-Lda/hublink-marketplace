'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (interactive) {
      // Add hover effect logic here if needed
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalfFilled = !isFilled && starValue - 0.5 <= rating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              disabled={!interactive}
              className={cn(
                'transition-colors duration-200',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled && 'fill-yellow-400 text-yellow-400',
                  isHalfFilled && 'fill-yellow-400/50 text-yellow-400',
                  !isFilled && !isHalfFilled && 'text-gray-300'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-7 ml-2">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}
    </div>
  );
} 