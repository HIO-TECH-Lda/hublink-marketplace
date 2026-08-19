'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, DollarSign, ShoppingBag, Smartphone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useCreateOrderFromCart } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/payment';

export default function CheckoutPage() {
  const { state, dispatch } = useMarketplace();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: cartData, isLoading } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const createOrder = useCreateOrderFromCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    email: '',
    phone: '',
    country: 'Moçambique',
    state: '',
    zipCode: '',
    shipToDifferentAddress: false,
    orderNotes: '',
    paymentMethod: 'mpesa'
  });

  // Prefill form with authenticated user's data
  useEffect(() => {
    if (!user) return;

    const billing: any = (user as any).billingAddress || {};

    setFormData(prev => ({
      ...prev,
      firstName: user.firstName || prev.firstName,
      lastName: user.lastName || prev.lastName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      address: billing.address || prev.address,
      city: billing.city || prev.city,
      country: billing.country || prev.country,
      state: billing.state || prev.state,
      zipCode: billing.zipCode || prev.zipCode,
    }));
  }, [user]);


  // Use API data instead of context state
  const cartItems = cartData?.items || [];
  const totalItems =
    cartData?.totalItems ?? (cartData as any)?.summary?.itemCount ?? cartItems.reduce((s: number, i: any) => s + (Number(i.quantity) || 0), 0);
  const subtotal =
    cartData?.totalPrice ?? (cartData as any)?.summary?.subtotal ?? cartItems.reduce((s: number, i: any) => s + (Number(i.quantity) || 0) * (i.product?.price ?? i.unitPrice ?? i.price ?? 0), 0);
  const shipping = subtotal >= 500 ? 0 : 100; // Free shipping above 500 MZN
  const total = subtotal + shipping;

  // Require login for checkout
  useEffect(() => {
    if (authLoading || isLoading) return;
    if (!isAuthenticated && cartItems.length > 0) {
      router.replace(`/entrar?returnUrl=${encodeURIComponent('/checkout')}`);
    }
  }, [isAuthenticated, authLoading, isLoading, cartItems.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      shipToDifferentAddress: checked
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const billingAddress = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      state: formData.state,
      zipCode: formData.zipCode,
      email: formData.email,
      phone: formData.phone,
    };

    const shippingAddress = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      state: formData.state,
      zipCode: formData.zipCode,
      email: formData.email,
      phone: formData.phone,
    };

    createOrder.mutate(
      {
        billingAddress,
        shippingAddress,
        payment: {
          method: formData.paymentMethod,
        },
        ...(formData.orderNotes.trim() && { notes: formData.orderNotes.trim() }),
      },
      {
        onSuccess: (order: any) => {
          toast({
            title: 'Pedido criado',
            description: 'Seu pedido foi criado com sucesso. Continue para o pagamento.',
          });

          const orderId = order.orderId;
          if (orderId) {
            router.push(`/pagamento/${orderId}`);
          }
        },
        onError: (error: any) => {
          const api = error?.response?.data || {};
          const details = Array.isArray(api.errors) ? api.errors.join(' | ') : (api.error || api.message);
          toast({
            title: 'Erro ao criar pedido',
            description: details || 'Tente novamente.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Carrinho Vazio</h1>
          <p className="text-gray-6 mb-8">Ainda não adicionou produtos ou serviços ao seu carrinho.</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Ir para as Compras
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/carrinho" className="hover:text-primary"> Carrinho</Link> / 
          <span className="text-primary"> Finalizar Pedido</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-9 mb-6">Informações de Facturação e Entrega</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Primeiro Nome *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Apelido *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+258 84 999 9999"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Província *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Sofala"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Beira"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço de Entrega *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Avenida 25 de Setembro, 123"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  
                  <div>
                    <Label htmlFor="zipCode">Código Postal *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="2100"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shipToDifferentAddress"
                      checked={formData.shipToDifferentAddress}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="shipToDifferentAddress">
                      Enviar para um endereço diferente
                    </Label>
                  </div>
                </div> */}

                {/* Back to Cart Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-2">
                  <Link href="/carrinho">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      <ArrowLeft size={16} className="mr-2" />
                      Voltar ao Carrinho
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-9 mb-6">Informações Adicionais</h2>
                
                <div>
                  <Label htmlFor="orderNotes">Notas do Pedido (opcional)</Label>
                  <Textarea
                    id="orderNotes"
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Indique aqui informações importantes sobre o seu pedido, como ponto de referência, instruções especiais para entrega ou melhor horário para contacto."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-9 mb-2">Método de Pagamento</h2>
                <p className="text-sm text-gray-6 mb-6">Seleccione a forma de pagamento pretendida:</p>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" className="mt-1" />
                    <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-gray-9">
                        <Smartphone size={20} className="text-primary" />
                        M-Pesa
                      </span>
                      <span className="block text-sm text-gray-6 mt-1">Pagamento no acto da entrega via M-Pesa.</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="emola" id="emola" className="mt-1" />
                    <Label htmlFor="emola" className="flex-1 cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-gray-9">
                        <Smartphone size={20} className="text-primary" />
                        E-Mola
                      </span>
                      <span className="block text-sm text-gray-6 mt-1">Pagamento no acto da entrega via E-Mola.</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="debit_card" id="debit_card" className="mt-1" />
                    <Label htmlFor="debit_card" className="flex-1 cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-gray-9">
                        <CreditCard size={20} className="text-primary" />
                        Cartão de Débito
                      </span>
                      <span className="block text-sm text-gray-6 mt-1">Pagamento no acto da entrega por cartão de débito, quando disponível.</span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" className="mt-1" />
                    <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-gray-9">
                        <DollarSign size={20} className="text-primary" />
                        Numerário
                      </span>
                      <span className="block text-sm text-gray-6 mt-1">Pagamento no acto da entrega em dinheiro.</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-9 mb-6">Resumo do Pedido</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-gray-6 mt-2 text-sm">Carregando carrinho...</p>
                    </div>
                  ) : (
                    cartItems.map((item: any) => (
                      <div key={item.productId?._id || item.product?._id || item._id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage || item.productId?.primaryImage || item.product?.primaryImage || '/placeholder.jpg'}
                            alt={item.productName || item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-9 text-sm line-clamp-2">{item.productName || item.product?.name}</h4>
                          <p className="text-xs text-gray-6">Vendido por {item.sellerName || item.product?.sellerName}</p>
                          <p className="text-xs text-gray-6">Qtd: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency((item.unitPrice || item.price || item.product?.price) * item.quantity)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3 border-t border-gray-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Subtotal ({totalItems} itens)</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-6">Taxa de Entrega</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-primary">Grátis</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-2 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-9">Total</span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hard text-white py-3 mt-6"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} className="mr-2" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-6 text-center mt-4">
                  Ao finalizar o pedido, confirma que os dados apresentados estão correctos e que concorda
                  com os nossos{' '}
                  <Link href="/termos" className="text-primary hover:text-primary-hard">
                    Termos e Condições
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
} 