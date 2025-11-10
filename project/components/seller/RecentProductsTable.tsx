'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/api';

interface RecentProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
  limit?: number;
}

export default function RecentProductsTable({
  products,
  isLoading = false,
  onDelete,
  showActions = true,
  limit,
}: RecentProductsTableProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-6">Carregando produtos...</p>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-6">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayProducts.map((product: any) => (
            <tr key={product._id || product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.primaryImage || product.images?.[0]?.url || '/placeholder-product.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(product.description || '').length > 50 
                        ? `${product.description.substring(0, 50)}...` 
                        : product.description || '—'
                      }
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {product.category || product.categoryId?.name || '—'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {product.originalPrice && (
                    <div className="text-gray-500 line-through">
                      MTn {Number(product.originalPrice).toFixed(2)}
                    </div>
                  )}
                  <div className="font-medium text-green-600">
                    MTn {Number(product.price || 0).toFixed(2)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${(product.stock ?? 0) > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-900">
                    {(product.stock ?? 0) > 0 ? 'Em Estoque' : 'Fora de Estoque'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  (product.stock ?? 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {(product.stock ?? 0) > 0 ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/produto/${product._id || product.id}`}>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-gray-3 text-gray-7 hover:bg-gray-1 flex items-center justify-center">
                        <Eye size={14} />
                      </Button>
                    </Link>
                    <Link href={`/vendedor/produtos/editar/${product._id || product.id}`}>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center">
                        <Edit size={14} />
                      </Button>
                    </Link>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                        onClick={() => onDelete(product._id || product.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

