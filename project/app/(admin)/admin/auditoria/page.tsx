'use client';

import React, { useState } from 'react';
import { 
  FileSearch,
  Search,
  Filter,
  Calendar,
  User,
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Monitor,
  Globe
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  useAdminAuditLogs,
  useAdminAuditLogStats,
  AuditLog
} from '@/hooks/useAdmin';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const limit = 50;

  // Filters
  const [userId, setUserId] = useState('');
  const [entityType, setEntityType] = useState<string>('all');
  const [entityId, setEntityId] = useState('');
  const [action, setAction] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const params: any = {
    page,
    limit
  };

  if (userId) params.userId = userId;
  if (entityType !== 'all') params.entityType = entityType;
  if (entityId) params.entityId = entityId;
  if (action !== 'all') params.action = action;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data: logsData, isLoading } = useAdminAuditLogs(params);
  const { data: stats } = useAdminAuditLogStats(
    startDate || endDate ? { startDate, endDate } : undefined
  );

  const logs = logsData?.logs || [];
  const totalPages = logsData?.pagination.totalPages || 1;

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-600 bg-green-100';
      case 'read': return 'text-blue-600 bg-blue-100';
      case 'update': return 'text-orange-600 bg-orange-100';
      case 'delete': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create': return 'Criar';
      case 'read': return 'Visualizar';
      case 'update': return 'Atualizar';
      case 'delete': return 'Excluir';
      default: return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'update': return <Edit className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEntityTypeText = (type: string) => {
    const labels: Record<string, string> = {
      'user': 'Usuário',
      'order': 'Pedido',
      'product': 'Produto',
      'category': 'Categoria',
      'seller': 'Vendedor',
      'blog': 'Blog',
      'newsletter_subscriber': 'Assinante',
      'newsletter_campaign': 'Campanha',
      'ticket': 'Ticket',
      'refund': 'Reembolso',
      'payment': 'Pagamento'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  const handleClearFilters = () => {
    setUserId('');
    setEntityType('all');
    setEntityId('');
    setAction('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  if (isLoading && !logsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando logs de auditoria...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Logs de Auditoria</h1>
            <p className="text-gray-6">Rastreamento de todas as ações realizadas na plataforma</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && stats.byAction && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-9">{(stats.total || 0).toLocaleString()}</p>
                </div>
                <FileSearch className="w-5 h-5 text-gray-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Criações</p>
                  <p className="text-xl font-bold text-green-600">{(stats.byAction.create || 0).toLocaleString()}</p>
                </div>
                <Plus className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Atualizações</p>
                  <p className="text-xl font-bold text-orange-600">{(stats.byAction.update || 0).toLocaleString()}</p>
                </div>
                <Edit className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Exclusões</p>
                  <p className="text-xl font-bold text-red-600">{(stats.byAction.delete || 0).toLocaleString()}</p>
                </div>
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="entityType">Tipo de Entidade</Label>
              <Select value={entityType} onValueChange={(v) => { setEntityType(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="order">Pedido</SelectItem>
                  <SelectItem value="product">Produto</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="newsletter_subscriber">Assinante</SelectItem>
                  <SelectItem value="newsletter_campaign">Campanha</SelectItem>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="refund">Reembolso</SelectItem>
                  <SelectItem value="payment">Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="action">Ação</Label>
              <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="create">Criar</SelectItem>
                  <SelectItem value="read">Visualizar</SelectItem>
                  <SelectItem value="update">Atualizar</SelectItem>
                  <SelectItem value="delete">Excluir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="userId">ID do Usuário</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setPage(1); }}
                placeholder="Filtrar por usuário"
              />
            </div>
            <div>
              <Label htmlFor="entityId">ID da Entidade</Label>
              <Input
                id="entityId"
                value={entityId}
                onChange={(e) => { setEntityId(e.target.value); setPage(1); }}
                placeholder="Filtrar por entidade"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          {(userId || entityType !== 'all' || entityId || action !== 'all' || startDate || endDate) && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Logs de Auditoria ({logsData?.pagination.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        <span className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {getActionText(log.action)}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        {getEntityTypeText(log.entity.type)}
                      </Badge>
                      {log.entity.name && (
                        <span className="text-sm text-gray-7 font-medium">
                          {log.entity.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-6 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{log.user.name}</span>
                        {log.user.role && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {log.user.role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>
                    {log.description && (
                      <p className="text-sm text-gray-7 mb-2">{log.description}</p>
                    )}
                    {log.changes && log.changes.length > 0 && (
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(log.id)}
                          className="text-xs"
                        >
                          {expandedLogs.has(log.id) ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Ocultar alterações
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Ver alterações ({log.changes.length})
                            </>
                          )}
                        </Button>
                        {expandedLogs.has(log.id) && (
                          <div className="mt-2 p-3 bg-gray-50 rounded border">
                            <div className="space-y-2">
                              {log.changes.map((change, idx) => (
                                <div key={idx} className="text-sm">
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium text-gray-7 min-w-[120px]">
                                      {change.field}:
                                    </span>
                                    <div className="flex-1">
                                      <div className="text-red-600 line-through">
                                        {formatValue(change.oldValue)}
                                      </div>
                                      <div className="text-green-600 font-medium">
                                        → {formatValue(change.newValue)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {expandedLogs.has(log.id) && log.metadata && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-6">
                          {log.metadata.ipAddress && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>IP: {log.metadata.ipAddress}</span>
                            </div>
                          )}
                          {log.metadata.method && (
                            <div className="flex items-center gap-1">
                              <Monitor className="w-3 h-3" />
                              <span>{log.metadata.method} {log.metadata.url}</span>
                            </div>
                          )}
                          {log.metadata.statusCode && (
                            <div>
                              <span>Status: {log.metadata.statusCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(log.id)}
                  >
                    {expandedLogs.has(log.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {logs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileSearch className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhum log de auditoria encontrado</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-6">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

