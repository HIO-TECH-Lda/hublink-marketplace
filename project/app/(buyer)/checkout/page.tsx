'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, DollarSign, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { state, dispatch } = useMarketplace();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    email: '',
    phone: '',
    country: 'Brasil',
    state: '',
    zipCode: '',
    shipToDifferentAddress: false,
    orderNotes: '',
    paymentMethod: 'pix'
  });

  const subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 10;
  const total = subtotal + shipping;
  const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);

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
    
    // Create order
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      total,
      status: 'pending' as const,
      items: state.cart,
      userId: state.user?.id || 'guest',
      billingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        zipCode: formData.zipCode,
        email: formData.email,
        phone: formData.phone
      },
      paymentMethod: formData.paymentMethod,
      orderNotes: formData.orderNotes
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Redirect to payment page
    router.push(`/pagamento/${order.id}`);
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Carrinho vazio</h1>
          <p className="text-gray-6 mb-8">Adicione produtos ao carrinho para continuar.</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Ir para a Banca
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
          <span className="text-primary"> Checkout</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-9 mb-6">Informações de Faturamento</h2>
                
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
                    <Label htmlFor="lastName">Sobrenome *</Label>
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
                    <Label htmlFor="company">Nome da Empresa</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">País/Região *</Label>
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
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-6">
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
                </div>

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
                    placeholder="Notas sobre seu pedido, por exemplo, instruções especiais para entrega."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-9 mb-6">Método de Pagamento</h2>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard size={20} className="text-primary" />
                      <span>PIX</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                      <DollarSign size={20} className="text-primary" />
                      <span>Dinheiro na Entrega</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-gray-2 rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard size={20} className="text-primary" />
                      <span>PayPal</span>
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
                  {state.cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-9 text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-xs text-gray-6">Vendido por {item.product.sellerName}</p>
                        <p className="text-xs text-gray-6">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-3 border-t border-gray-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Subtotal ({totalItems} itens)</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-6">Frete</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-primary">Grátis</span>
                      ) : (
                        `R$ ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-2 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-9">Total</span>
                      <span className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hard text-white py-3 mt-6"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Fazer Pedido
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-6 text-center mt-4">
                  Ao fazer o pedido, você concorda com nossos{' '}
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