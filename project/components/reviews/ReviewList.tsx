'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  productId: string;
  onHelpful?: (reviewId: string, isHelpful: boolean) => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, productId, onHelpful, onReport }: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set());
  const [notHelpfulVotes, setNotHelpfulVotes] = useState<Set<string>>(new Set());

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    if (isHelpful) {
      if (helpfulVotes.has(reviewId)) {
        setHelpfulVotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
      } else {
        setHelpfulVotes(prev => new Set(prev).add(reviewId));
        setNotHelpfulVotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
      }
    } else {
      if (notHelpfulVotes.has(reviewId)) {
        setNotHelpfulVotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
      } else {
        setNotHelpfulVotes(prev => new Set(prev).add(reviewId));
        setHelpfulVotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
      }
    }

    onHelpful?.(reviewId, isHelpful);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-gray-3 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-7 mb-2">Nenhuma avaliação ainda</h3>
        <p className="text-gray-5">Seja o primeiro a avaliar este produto!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border border-gray-2">
          <CardContent className="p-4">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-2 rounded-full flex items-center justify-center">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-9">{review.userName}</h4>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Compra Verificada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReport?.(review.id)}
                className="text-gray-4 hover:text-gray-6"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <StarRating
                rating={review.rating}
                size="sm"
                showValue={false}
              />
            </div>

            {/* Review Title */}
            <h5 className="font-medium text-gray-9 mb-2">{review.title}</h5>

            {/* Review Comment */}
            <div className="mb-3">
              <p className={`text-gray-7 ${!expandedReviews.has(review.id) && review.comment.length > 200 ? 'line-clamp-3' : ''}`}>
                {review.comment}
              </p>
              {review.comment.length > 200 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="p-0 h-auto text-primary hover:text-primary-hard"
                >
                  {expandedReviews.has(review.id) ? 'Ver menos' : 'Ver mais'}
                </Button>
              )}
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-3 gap-2">
                  {review.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
                {review.images.length > 3 && (
                  <p className="text-sm text-gray-5 mt-1">
                    +{review.images.length - 3} mais imagens
                  </p>
                )}
              </div>
            )}

            {/* Helpful Buttons */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpful(review.id, true)}
                  className={`h-8 px-3 text-sm ${
                    helpfulVotes.has(review.id) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-5 hover:text-gray-7'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Útil ({review.helpful + (helpfulVotes.has(review.id) ? 1 : 0)})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpful(review.id, false)}
                  className={`h-8 px-3 text-sm ${
                    notHelpfulVotes.has(review.id) 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-5 hover:text-gray-7'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Não útil ({review.notHelpful + (notHelpfulVotes.has(review.id) ? 1 : 0)})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 