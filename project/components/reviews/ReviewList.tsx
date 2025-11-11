'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import type { Review } from '@/types/api';

interface ReviewListProps {
  reviews: Review[];
  onHelpful?: (reviewId: string, isHelpful: boolean) => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onHelpful, onReport }: ReviewListProps) {
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;

    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUserName = (userId: Review['userId']): string => {
    if (typeof userId === 'string') return 'Usuário';
    return `${userId.firstName || ''} ${userId.lastName || ''}`.trim() || 'Usuário';
  };

  const getUserAvatar = (userId: Review['userId']): string | undefined => {
    if (typeof userId === 'object' && userId.avatar) return userId.avatar;
    return undefined;
  };

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-7">Nenhuma avaliação ainda</h3>
        <p className="text-gray-5">Seja o primeiro a avaliar este produto!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const userName = getUserName(review.userId);
        const userAvatar = getUserAvatar(review.userId);
        const reviewId = review._id;
        const isExpanded = expandedReviews.has(reviewId);
        const hasHelpfulVote = helpfulVotes.has(reviewId);
        const hasNotHelpfulVote = notHelpfulVotes.has(reviewId);
        const helpfulCount = (review.helpfulVotes || 0) + (hasHelpfulVote ? 1 : 0);
        const notHelpfulCount = (review.notHelpfulVotes || 0) + (hasNotHelpfulVote ? 1 : 0);

        return (
          <Card key={reviewId} className="border border-gray-2">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-gray-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-9">{userName}</h4>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Compra Verificada
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-5">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReport?.(reviewId)}
                  className="text-gray-4 hover:text-gray-6"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-3">
                <StarRating rating={review.rating} size="sm" showValue={false} />
              </div>

              <h5 className="mb-2 font-medium text-gray-9">{review.title}</h5>

              <div className="mb-3">
                <p
                  className={`text-gray-7 ${!isExpanded && review.content.length > 200 ? 'line-clamp-3' : ''}`}
                >
                  {review.content}
                </p>
                {review.content.length > 200 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleReviewExpansion(reviewId)}
                    className="h-auto p-0 text-primary hover:text-primary-hard"
                  >
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                  </Button>
                )}
              </div>

              {review.images && review.images.length > 0 && (
                <div className="mb-3">
                  <div className="grid grid-cols-3 gap-2">
                    {review.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="h-20 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                  {review.images.length > 3 && (
                    <p className="mt-1 text-sm text-gray-5">+{review.images.length - 3} mais imagens</p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-gray-2 pt-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(reviewId, true)}
                    className={`h-8 px-3 text-sm ${
                      hasHelpfulVote ? 'bg-primary/10 text-primary' : 'text-gray-5 hover:text-gray-7'
                    }`}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Útil ({helpfulCount})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(reviewId, false)}
                    className={`h-8 px-3 text-sm ${
                      hasNotHelpfulVote ? 'bg-red-50 text-red-500' : 'text-gray-5 hover:text-gray-7'
                    }`}
                  >
                    <ThumbsDown className="mr-1 h-4 w-4" />
                    Não útil ({notHelpfulCount})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 