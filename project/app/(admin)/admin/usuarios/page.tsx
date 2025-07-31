'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Mail,
  Phone,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isSeller: boolean;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

export default function UserManagementPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const loadUsers = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        isSeller: false,
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:25:00Z',
        totalOrders: 5,
        totalSpent: 450.00
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 88888-8888',
        isSeller: true,
        status: 'active',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-20T16:45:00Z',
        totalOrders: 12,
        totalSpent: 1200.00
      },
      {
        id: '3',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '(11) 77777-7777',
        isSeller: false,
        status: 'inactive',
        createdAt: '2024-01-05T11:20:00Z',
        lastLogin: '2024-01-15T10:30:00Z',
        totalOrders: 2,
        totalSpent: 180.00
      },
      {
        id: '4',
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@email.com',
        phone: '(11) 66666-6666',
        isSeller: true,
        status: 'suspended',
        createdAt: '2024-01-01T08:45:00Z',
        lastLogin: '2024-01-18T13:20:00Z',
        totalOrders: 8,
        totalSpent: 750.00
      },
      {
        id: '5',
        firstName: 'Carlos',
        lastName: 'Ferreira',
        email: 'carlos.ferreira@email.com',
        phone: '(11) 55555-5555',
        isSeller: false,
        status: 'active',
        createdAt: '2024-01-12T15:10:00Z',
        lastLogin: '2024-01-20T18:30:00Z',
        totalOrders: 3,
        totalSpent: 320.00
      }
    ];

    setUsers(mockUsers);
    setIsLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => 
        roleFilter === 'seller' ? user.isSeller : !user.isSeller
      );
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditUser = (userId: string) => {
    router.push(`/admin/usuarios/${userId}/editar`);
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/usuarios/${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando usuários...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Usuários</h1>
        <p className="text-gray-6">Gerencie contas de usuários e vendedores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-6">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-9">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-6">Vendedores</p>
                <p className="text-2xl font-bold text-gray-9">
                  {users.filter(user => user.isSeller).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-6">Clientes</p>
                <p className="text-2xl font-bold text-gray-9">
                  {users.filter(user => !user.isSeller).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-6">Ativos</p>
                <p className="text-2xl font-bold text-gray-9">
                  {users.filter(user => user.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                <Input
                  placeholder="Nome, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Tipo</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="customer">Clientes</SelectItem>
                  <SelectItem value="seller">Vendedores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-2">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Usuário</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Contato</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Pedidos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Total Gasto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Último Login</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-2 hover:bg-gray-1/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-9">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-6">ID: {user.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-6">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-6">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.isSeller ? 'default' : 'secondary'}>
                        {user.isSeller ? 'Vendedor' : 'Cliente'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-9">{user.totalOrders}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-9">{formatCurrency(user.totalSpent)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-6">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-6">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 