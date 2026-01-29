'use client';

import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminReviews, useReviewAnalytics, useModerateReview, AdminReview } from '@/hooks/useAdminReviews';
import { Textarea } from '@/components/ui/textarea';

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const { data: analytics, isLoading: analyticsLoading } = useReviewAnalytics();
  const { data: reviewsData, isLoading: reviewsLoading } = useAdminReviews({
    status: activeTab,
    page,
    limit: 10,
  });

  const moderateMutation = useModerateReview();

  const handleApprove = (review: AdminReview) => {
    setSelectedReview(review);
    setShowApproveModal(true);
  };

  const confirmApprove = () => {
    if (selectedReview) {
      moderateMutation.mutate({
        reviewId: selectedReview._id,
        status: 'approved',
      });
      setShowApproveModal(false);
      setSelectedReview(null);
    }
  };

  const handleReject = (review: AdminReview) => {
    setSelectedReview(review);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedReview) {
      moderateMutation.mutate({
        reviewId: selectedReview._id,
        status: 'rejected',
        notes: rejectNotes,
      });
      setShowRejectModal(false);
      setRejectNotes('');
      setSelectedReview(null);
    }
  };

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    return (
      <Badge className={`${styles[status as keyof typeof styles]} flex items-center gap-1`}>
        {icons[status as keyof typeof icons]}
        {status === 'pending' ? 'Pendente' : status === 'approved' ? 'Aprovada' : 'Rejeitada'}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Avaliações</h1>
        <p className="text-gray-600 mt-1">Modere e analise avaliações de produtos</p>
      </div>

      {/* Analytics Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{analytics.totalReviews.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-700">{analytics.pendingReviews}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-700">{analytics.approvedReviews.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejeitadas</p>
                  <p className="text-2xl font-bold text-red-700">{analytics.rejectedReviews.toLocaleString()}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      {analytics && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Avaliação Média:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">{analytics.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Últimos 30 dias:</span>
                <span className="text-lg font-bold">{analytics.recentReviews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: 'pending' as const, label: 'Pendentes', count: analytics?.pendingReviews },
          { key: 'approved' as const, label: 'Aprovadas', count: null },
          { key: 'rejected' as const, label: 'Rejeitadas', count: null },
          { key: 'all' as const, label: 'Todas', count: null },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : !reviewsData?.reviews.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma avaliação {activeTab === 'pending' ? 'pendente' : activeTab} encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviewsData.reviews.map((review) => {
            const isExpanded = expandedReviews.has(review._id);
            const contentLength = review.content.length;
            const shouldTruncate = contentLength > 200;

            return (
              <Card key={review._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.userId.avatar || `https://ui-avatars.com/api/?name=${review.userId.firstName}+${review.userId.lastName}`}
                        alt={review.userId.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {review.userId.firstName} {review.userId.lastName}
                          </span>
                          {review.isVerified && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              ✓ Compra Verificada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(review.status)}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{review.rating}.0</span>
                  </div>

                  {/* Product */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Produto: {review.productId.name}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2">{review.title}</h3>

                  {/* Content */}
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {shouldTruncate && !isExpanded
                      ? `${review.content.substring(0, 200)}...`
                      : review.content}
                  </p>

                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpanded(review._id)}
                      className="text-blue-600 text-sm mb-3 hover:underline"
                    >
                      {isExpanded ? 'Mostrar menos' : 'Ler mais'}
                    </button>
                  )}

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Votes */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.isHelpful}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{review.isNotHelpful}</span>
                    </div>
                    <span>Pedido: {review.orderId.orderNumber}</span>
                  </div>

                  {/* Moderator Notes */}
                  {review.moderatorNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                      <p className="font-semibold text-sm mb-1">Notas do Admin:</p>
                      <p className="text-sm">{review.moderatorNotes}</p>
                    </div>
                  )}

                  {/* Moderation Info */}
                  {review.moderatedBy && (
                    <p className="text-sm text-gray-500 mb-3">
                      Moderado por {review.moderatedBy.firstName} {review.moderatedBy.lastName} em{' '}
                      {new Date(review.moderatedAt!).toLocaleDateString('pt-BR')}
                    </p>
                  )}

                  {/* Actions */}
                  {review.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleApprove(review)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={moderateMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => handleReject(review)}
                        variant="destructive"
                        className="flex-1"
                        disabled={moderateMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {reviewsData && reviewsData.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, reviewsData.totalPages) }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(reviewsData.totalPages, p + 1))}
            disabled={page === reviewsData.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Aprovar Avaliação</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Tem certeza que deseja aprovar esta avaliação de{' '}
              <strong>{selectedReview.userId.firstName} {selectedReview.userId.lastName}</strong>?
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= selectedReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{selectedReview.rating}.0</span>
              </div>
              <p className="font-semibold text-sm mb-1">{selectedReview.title}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{selectedReview.content}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-blue-800">
                ℹ️ Ao aprovar, esta avaliação será visível publicamente e a classificação do produto/vendedor será atualizada.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedReview(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={confirmApprove}
                disabled={moderateMutation.isPending}
              >
                {moderateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aprovando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Aprovação
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Rejeitar Avaliação</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Tem certeza que deseja rejeitar esta avaliação? Você pode adicionar notas explicando o motivo.
            </p>

            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Notas do Admin (Opcional)</label>
              <Textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Ex: Contém linguagem inapropriada, viola diretrizes..."
              />
              <p className="text-sm text-gray-500 text-right">{rejectNotes.length}/500</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmReject}
                disabled={moderateMutation.isPending}
              >
                {moderateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejeitando...
                  </>
                ) : (
                  'Rejeitar Avaliação'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
