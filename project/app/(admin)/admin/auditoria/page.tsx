'use client';

import React, { useState } from 'react';
import { 
  FileSearch,
  Search,
  Filter,
  X,
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
  Globe,
  Clock,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
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
import { useRouter } from 'next/navigation';

export default function AuditLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
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
  const hasActiveFilters = userId || entityType !== 'all' || entityId || action !== 'all' || startDate || endDate;

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
      case 'create': return 'text-green-600 bg-green-100 border-green-200';
      case 'read': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'update': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'delete': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
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
      case 'create': return <Plus className="w-3.5 h-3.5" />;
      case 'read': return <Eye className="w-3.5 h-3.5" />;
      case 'update': return <Edit className="w-3.5 h-3.5" />;
      case 'delete': return <Trash2 className="w-3.5 h-3.5" />;
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

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-3.5 h-3.5" />;
      case 'order': return <Package className="w-3.5 h-3.5" />;
      case 'product': return <Package className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-MZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    if (typeof value === 'string' && value.length > 150) {
      return value.substring(0, 150) + '...';
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const navigateToEntity = (entityType: string, entityId: string) => {
    const routes: Record<string, string> = {
      'user': `/admin/usuarios/${entityId}`,
      'order': `/admin/pedidos/${entityId}`,
      'product': `/admin/produtos/${entityId}`,
      'category': `/admin/categorias/${entityId}`,
      'seller': `/admin/vendedores/${entityId}`,
      'blog': `/admin/blog/${entityId}`,
      'ticket': `/admin/tickets/${entityId}`,
      'refund': `/admin/reembolsos/${entityId}`
    };
    const route = routes[entityType];
    if (route) {
      router.push(route);
    }
  };

  if (isLoading && !logsData) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando logs de auditoria...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Logs de Auditoria</h1>
            <p className="text-gray-6">Rastreamento completo de todas as ações realizadas na plataforma</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && stats.byAction && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-6 mb-1">Total de Logs</p>
                  <p className="text-2xl font-bold text-gray-9">{(stats.total || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-6 mb-1">Criações</p>
                  <p className="text-2xl font-bold text-green-600">{(stats.byAction.create || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-6 mb-1">Atualizações</p>
                  <p className="text-2xl font-bold text-orange-600">{(stats.byAction.update || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-6 mb-1">Exclusões</p>
                  <p className="text-2xl font-bold text-red-600">{(stats.byAction.delete || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entityType" className="text-xs font-medium">Tipo de Entidade</Label>
                <Select value={entityType} onValueChange={(v) => { setEntityType(v); setPage(1); }}>
                  <SelectTrigger className="h-9">
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
                <Label htmlFor="action" className="text-xs font-medium">Ação</Label>
                <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
                  <SelectTrigger className="h-9">
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
                <Label htmlFor="userId" className="text-xs font-medium">ID do Usuário</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setPage(1); }}
                  placeholder="Ex: 507f1f77bcf86cd799439012"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="entityId" className="text-xs font-medium">ID da Entidade</Label>
                <Input
                  id="entityId"
                  value={entityId}
                  onChange={(e) => { setEntityId(e.target.value); setPage(1); }}
                  placeholder="Ex: 507f1f77bcf86cd799439013"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="text-xs font-medium">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs font-medium">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="h-9"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {entityType !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getEntityTypeText(entityType)}
                    <button onClick={() => setEntityType('all')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {action !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getActionText(action)}
                    <button onClick={() => setAction('all')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {userId && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Usuário: {userId.substring(0, 8)}...
                    <button onClick={() => setUserId('')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {entityId && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Entidade: {entityId.substring(0, 8)}...
                    <button onClick={() => setEntityId('')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    De: {new Date(startDate).toLocaleDateString('pt-MZ')}
                    <button onClick={() => setStartDate('')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Até: {new Date(endDate).toLocaleDateString('pt-MZ')}
                    <button onClick={() => setEndDate('')} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-9">
              Logs de Auditoria
              {logsData?.pagination.total && (
                <span className="text-sm font-normal text-gray-6 ml-2">
                  ({logsData.pagination.total.toLocaleString()})
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Ação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Entidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Usuário</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Alterações</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7 text-xs uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Badge className={`${getActionColor(log.action)} border flex items-center gap-1.5 w-fit`}>
                        {getActionIcon(log.action)}
                        {getActionText(log.action)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getEntityIcon(log.entity.type)}
                          {getEntityTypeText(log.entity.type)}
                        </Badge>
                        {log.entity.name && (
                          <span className="text-sm text-gray-7 font-medium max-w-[200px] truncate">
                            {log.entity.name}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-5 mt-1 font-mono">
                        {log.entity.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-9">{log.user.name}</p>
                          {log.user.role && (
                            <Badge variant="outline" className="text-xs mt-0.5">
                              {log.user.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-9">
                        {formatDate(log.createdAt)}
                      </div>
                      <div className="text-xs text-gray-5">
                        {formatTime(log.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {log.changes && log.changes.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {log.changes.length} campo(s)
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(log.id)}
                            className="h-6 px-2 text-xs"
                          >
                            {expandedLogs.has(log.id) ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Ver
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-5">Sem alterações</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(log.id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedLogs.has(log.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        {log.entity.type && log.entity.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateToEntity(log.entity.type, log.entity.id)}
                            className="h-8 w-8 p-0"
                            title="Ver entidade"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {expandedLogs.size > 0 && logs.map((log) => (
                  expandedLogs.has(log.id) && (
                    <tr key={`${log.id}-expanded`} className="bg-gray-50">
                      <td colSpan={6} className="py-4 px-4">
                        <div className="space-y-4">
                          {log.description && (
                            <div className="p-3 bg-white rounded border">
                              <p className="text-sm text-gray-7">{log.description}</p>
                            </div>
                          )}
                          {log.changes && log.changes.length > 0 && (
                            <div className="p-3 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-gray-9 mb-3">Alterações Realizadas</h4>
                              <div className="space-y-3">
                                {log.changes.map((change, idx) => (
                                  <div key={idx} className="border-l-2 border-l-primary pl-3 py-2">
                                    <div className="flex items-start justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-9">
                                        {change.field}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(JSON.stringify(change, null, 2))}
                                        className="h-6 w-6 p-0"
                                        title="Copiar alteração"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                      <div className="p-2 bg-red-50 rounded border border-red-200">
                                        <p className="text-xs text-red-600 font-medium mb-1">Valor Anterior</p>
                                        <p className="text-xs text-gray-9 font-mono break-all">
                                          {formatValue(change.oldValue)}
                                        </p>
                                      </div>
                                      <div className="p-2 bg-green-50 rounded border border-green-200">
                                        <p className="text-xs text-green-600 font-medium mb-1">Novo Valor</p>
                                        <p className="text-xs text-gray-9 font-mono break-all">
                                          {formatValue(change.newValue)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {log.metadata && (
                            <div className="p-3 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-gray-9 mb-3">Metadados</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {log.metadata.ipAddress && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Globe className="w-4 h-4 text-gray-5" />
                                    <span className="text-gray-7">IP:</span>
                                    <span className="font-mono text-gray-9">{log.metadata.ipAddress}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(log.metadata.ipAddress || '')}
                                      className="h-5 w-5 p-0"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                                {log.metadata.method && log.metadata.url && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Monitor className="w-4 h-4 text-gray-5" />
                                    <span className="text-gray-7">Request:</span>
                                    <span className="font-mono text-gray-9">
                                      {log.metadata.method} {log.metadata.url}
                                    </span>
                                  </div>
                                )}
                                {log.metadata.statusCode && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-7">Status:</span>
                                    <Badge 
                                      variant={log.metadata.statusCode >= 200 && log.metadata.statusCode < 300 ? 'default' : 'destructive'}
                                      className="text-xs"
                                    >
                                      {log.metadata.statusCode}
                                    </Badge>
                                  </div>
                                )}
                                {log.user.email && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-7">Email:</span>
                                    <span className="text-gray-9">{log.user.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {logs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileSearch className="w-16 h-16 text-gray-4 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum log encontrado</h3>
            <p className="text-gray-6 mb-4">
              {hasActiveFilters 
                ? 'Tente ajustar os filtros para encontrar mais resultados'
                : 'Não há logs de auditoria disponíveis no momento'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t mt-6">
          <div className="text-sm text-gray-6">
            Mostrando <span className="font-medium text-gray-9">
              {((page - 1) * limit) + 1}
            </span> - <span className="font-medium text-gray-9">
              {Math.min(page * limit, logsData?.pagination.total || 0)}
            </span> de <span className="font-medium text-gray-9">
              {logsData?.pagination.total || 0}
            </span> logs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
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
    </>
  );
}
