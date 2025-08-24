'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Save, Store, CreditCard, User, Shield, Bell, FileText, Upload, X, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SellerSidebar from '@/app/(seller)/components/SellerSidebar';
import Link from 'next/link';

// Document Upload Component
const DocumentUpload = ({ 
  label, 
  required = false, 
  acceptedTypes = '.pdf,.doc,.docx', 
  maxSize = 5, // MB
  onFileSelect,
  uploadedFile,
  onRemoveFile
}: {
  label: string;
  required?: boolean;
  acceptedTypes?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  uploadedFile?: { name: string; size: number; type: string } | null;
  onRemoveFile: () => void;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.some(type => type.startsWith('.') ? fileExtension === type : file.type.includes(type.replace('*', '')))) {
      setError(`Tipo de arquivo não suportado. Tipos aceitos: ${acceptedTypes}`);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-7">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-3 hover:border-gray-4'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-4 mb-2" />
          <p className="text-sm text-gray-6 mb-2">
            Arraste e solte o arquivo aqui ou
          </p>
          <label className="cursor-pointer">
            <span className="text-primary hover:text-primary-hard font-medium">
              clique para selecionar
            </span>
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-gray-5 mt-2">
            Tipos aceitos: {acceptedTypes} • Máximo: {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-3 rounded-lg p-4 bg-gray-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-gray-9">{uploadedFile.name}</p>
                <p className="text-xs text-gray-6">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <button
                type="button"
                onClick={onRemoveFile}
                className="text-gray-4 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default function SellerSettingsPage() {
  const { state, dispatch } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  
  const [storeData, setStoreData] = useState({
    storeName: state.user?.storeSettings?.storeName || '',
    storeDescription: state.user?.storeSettings?.storeDescription || '',
    storeEmail: state.user?.storeSettings?.storeEmail || '',
    storePhone: state.user?.storeSettings?.storePhone || ''
  });

  const [paymentData, setPaymentData] = useState({
    bankName: state.user?.storeSettings?.bankName || '',
    accountNumber: state.user?.storeSettings?.accountNumber || '',
    agencyNumber: state.user?.storeSettings?.agencyNumber || '',
    paymentKey: state.user?.storeSettings?.paymentKey || '',
    paymentMethod: state.user?.storeSettings?.paymentMethod || 'M-Pesa'
  });

  const [accountData, setAccountData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || ''
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    customerReviews: true,
    paymentReceived: true,
    marketingEmails: false
  });

  // Document upload state
  const [documents, setDocuments] = useState({
    idDocument: null as File | null,
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    bankStatement: null as File | null,
    additionalDocuments: [] as File[]
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    idDocument: null as { name: string; size: number; type: string } | null,
    businessLicense: null as { name: string; size: number; type: string } | null,
    taxCertificate: null as { name: string; size: number; type: string } | null,
    bankStatement: null as { name: string; size: number; type: string } | null,
    additionalDocuments: [] as { name: string; size: number; type: string }[]
  });

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleDocumentSelect = (documentType: string, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    }));
  };

  const handleDocumentRemove = (documentType: string) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const handleAdditionalDocumentSelect = (file: File) => {
    setDocuments(prev => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, file]
    }));

    setUploadedFiles(prev => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, {
        name: file.name,
        size: file.size,
        type: file.type
      }]
    }));
  };

  const handleAdditionalDocumentRemove = (index: number) => {
    setDocuments(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }));

    setUploadedFiles(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add document files
      if (documents.idDocument) {
        formData.append('idDocument', documents.idDocument);
      }
      if (documents.businessLicense) {
        formData.append('businessLicense', documents.businessLicense);
      }
      if (documents.taxCertificate) {
        formData.append('taxCertificate', documents.taxCertificate);
      }
      if (documents.bankStatement) {
        formData.append('bankStatement', documents.bankStatement);
      }
      
      documents.additionalDocuments.forEach((file, index) => {
        formData.append(`additionalDocument_${index}`, file);
      });

      // Add other form data
      formData.append('storeData', JSON.stringify(storeData));
      formData.append('paymentData', JSON.stringify(paymentData));
      formData.append('accountData', JSON.stringify(accountData));
      formData.append('notifications', JSON.stringify(notifications));

      // Update user with new settings
      const updatedUser = {
        ...state.user!,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        phone: accountData.phone,
        storeSettings: {
          storeName: storeData.storeName,
          storeDescription: storeData.storeDescription,
          storeEmail: storeData.storeEmail,
          storePhone: storeData.storePhone,
          bankName: paymentData.bankName,
          accountNumber: paymentData.accountNumber,
          agencyNumber: paymentData.agencyNumber,
          paymentKey: paymentData.paymentKey,
          paymentMethod: paymentData.paymentMethod,
          documents: {
            idDocument: uploadedFiles.idDocument,
            businessLicense: uploadedFiles.businessLicense,
            taxCertificate: uploadedFiles.taxCertificate,
            bankStatement: uploadedFiles.bankStatement,
            additionalDocuments: uploadedFiles.additionalDocuments
          }
        }
      };

      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you could add a toast notification here)
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state.isAuthenticated || !state.user?.isSeller) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado como vendedor para acessar esta página.</p>
          <Button className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'store', label: 'Banca', icon: Store },
    { id: 'payment', label: 'Pagamentos', icon: CreditCard },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Configurações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-2">
                <nav className="flex overflow-x-auto px-4 sm:px-6">
                  <div className="flex space-x-4 sm:space-x-8 min-w-full">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab.id
                              ? 'border-primary text-primary'
                              : 'border-transparent text-gray-6 hover:text-gray-9'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit}>
                  {/* Store Settings */}
                  {activeTab === 'store' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Banca</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome da Banca *
                            </label>
                            <Input
                              type="text"
                              name="storeName"
                              value={storeData.storeName}
                              onChange={handleStoreChange}
                              placeholder="Digite o nome da sua loja"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email da Banca *
                            </label>
                            <Input
                              type="email"
                              name="storeEmail"
                              value={storeData.storeEmail}
                              onChange={handleStoreChange}
                              placeholder="Digite o email da loja"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Telefone da Banca
                          </label>
                          <Input
                            type="tel"
                            name="storePhone"
                            value={storeData.storePhone}
                            onChange={handleStoreChange}
                            placeholder="Digite o telefone da loja"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Descrição da Banca
                          </label>
                          <Textarea
                            name="storeDescription"
                            value={storeData.storeDescription}
                            onChange={handleStoreChange}
                            placeholder="Descreva sua loja e produtos"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Settings */}
                  {activeTab === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações de Pagamento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome do Banco
                            </label>
                            <Input
                              type="text"
                              name="bankName"
                              value={paymentData.bankName}
                              onChange={handlePaymentChange}
                              placeholder="Digite o nome do banco"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Número da Conta
                            </label>
                            <Input
                              type="text"
                              name="accountNumber"
                              value={paymentData.accountNumber}
                              onChange={handlePaymentChange}
                              placeholder="Digite o número da conta"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Número da Agência
                            </label>
                            <Input
                              type="text"
                              name="agencyNumber"
                              value={paymentData.agencyNumber}
                              onChange={handlePaymentChange}
                              placeholder="Digite o número da agência"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Chave de Pagamento (M-Pesa/E-Mola)
                            </label>
                            <Input
                              type="text"
                              name="paymentKey"
                              value={paymentData.paymentKey}
                              onChange={handlePaymentChange}
                              placeholder="Digite a chave de pagamento"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Método de Pagamento Preferido
                          </label>
                          <select
                            name="paymentMethod"
                            value={paymentData.paymentMethod}
                            onChange={handlePaymentChange}
                            className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Transferência Bancária">Transferência Bancária</option>
                            <option value="E-Mola">E-Mola</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Upload Settings */}
                  {activeTab === 'documents' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Documentos Necessários</h3>
                        <p className="text-sm text-gray-6 mb-6">
                          Para verificar sua identidade e legitimidade do negócio, precisamos dos seguintes documentos. 
                          Todos os documentos devem estar em formato PDF.
                        </p>
                        
                        <div className="space-y-6">
                          {/* ID Document */}
                          <DocumentUpload
                            label="Documento de Identificação (BI/Passaporte)"
                            required={true}
                            acceptedTypes=".pdf"
                            maxSize={5}
                            onFileSelect={(file) => handleDocumentSelect('idDocument', file)}
                            uploadedFile={uploadedFiles.idDocument}
                            onRemoveFile={() => handleDocumentRemove('idDocument')}
                          />

                          {/* Business License */}
                          <DocumentUpload
                            label="Licença Comercial (se aplicável)"
                            required={false}
                            acceptedTypes=".pdf"
                            maxSize={5}
                            onFileSelect={(file) => handleDocumentSelect('businessLicense', file)}
                            uploadedFile={uploadedFiles.businessLicense}
                            onRemoveFile={() => handleDocumentRemove('businessLicense')}
                          />

                          {/* Tax Certificate */}
                          <DocumentUpload
                            label="Certificado de Contribuinte"
                            required={false}
                            acceptedTypes=".pdf"
                            maxSize={5}
                            onFileSelect={(file) => handleDocumentSelect('taxCertificate', file)}
                            uploadedFile={uploadedFiles.taxCertificate}
                            onRemoveFile={() => handleDocumentRemove('taxCertificate')}
                          />

                          {/* Bank Statement */}
                          <DocumentUpload
                            label="Extrato Bancário (últimos 3 meses)"
                            required={false}
                            acceptedTypes=".pdf"
                            maxSize={5}
                            onFileSelect={(file) => handleDocumentSelect('bankStatement', file)}
                            uploadedFile={uploadedFiles.bankStatement}
                            onRemoveFile={() => handleDocumentRemove('bankStatement')}
                          />

                          {/* Additional Documents */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-7 mb-2">
                                Documentos Adicionais
                              </label>
                              <p className="text-xs text-gray-5 mb-3">
                                Outros documentos que possam ser relevantes para a verificação da sua conta.
                              </p>
                            </div>

                            {/* Upload additional documents */}
                            <DocumentUpload
                              label="Adicionar Documento"
                              required={false}
                              acceptedTypes=".pdf,.doc,.docx"
                              maxSize={5}
                              onFileSelect={handleAdditionalDocumentSelect}
                              uploadedFile={null}
                              onRemoveFile={() => {}}
                            />

                            {/* Display uploaded additional documents */}
                            {uploadedFiles.additionalDocuments.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-7">Documentos Adicionais Enviados:</p>
                                {uploadedFiles.additionalDocuments.map((file, index) => (
                                  <div key={index} className="border border-gray-3 rounded-lg p-3 bg-gray-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-9">{file.name}</p>
                                          <p className="text-xs text-gray-6">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleAdditionalDocumentRemove(index)}
                                        className="text-gray-4 hover:text-red-500 transition-colors"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Document Upload Guidelines */}
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="text-sm font-semibold text-blue-900 mb-2">Diretrizes para Upload de Documentos:</h4>
                          <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Todos os documentos devem estar em formato PDF</li>
                            <li>• Tamanho máximo por arquivo: 5MB</li>
                            <li>• Certifique-se de que os documentos estão legíveis e completos</li>
                            <li>• Documentos devem estar atualizados (não expirados)</li>
                            <li>• Para documentos em outros idiomas, inclua tradução oficial</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Settings */}
                  {activeTab === 'account' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Conta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome *
                            </label>
                            <Input
                              type="text"
                              name="firstName"
                              value={accountData.firstName}
                              onChange={handleAccountChange}
                              placeholder="Digite seu nome"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Sobrenome *
                            </label>
                            <Input
                              type="text"
                              name="lastName"
                              value={accountData.lastName}
                              onChange={handleAccountChange}
                              placeholder="Digite seu sobrenome"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email *
                            </label>
                            <Input
                              type="email"
                              name="email"
                              value={accountData.email}
                              onChange={handleAccountChange}
                              placeholder="Digite seu email"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Telefone
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={accountData.phone}
                              onChange={handleAccountChange}
                              placeholder="Digite seu telefone"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Preferências de Notificação</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="newOrders"
                              checked={notifications.newOrders}
                              onCheckedChange={(checked) => handleNotificationChange('newOrders', checked as boolean)}
                            />
                            <label htmlFor="newOrders" className="text-sm text-gray-7 cursor-pointer">
                              Novos pedidos
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="lowStock"
                              checked={notifications.lowStock}
                              onCheckedChange={(checked) => handleNotificationChange('lowStock', checked as boolean)}
                            />
                            <label htmlFor="lowStock" className="text-sm text-gray-7 cursor-pointer">
                              Produtos com estoque baixo
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="customerReviews"
                              checked={notifications.customerReviews}
                              onCheckedChange={(checked) => handleNotificationChange('customerReviews', checked as boolean)}
                            />
                            <label htmlFor="customerReviews" className="text-sm text-gray-7 cursor-pointer">
                              Novas avaliações de clientes
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="paymentReceived"
                              checked={notifications.paymentReceived}
                              onCheckedChange={(checked) => handleNotificationChange('paymentReceived', checked as boolean)}
                            />
                            <label htmlFor="paymentReceived" className="text-sm text-gray-7 cursor-pointer">
                              Pagamentos recebidos
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="marketingEmails"
                              checked={notifications.marketingEmails}
                              onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked as boolean)}
                            />
                            <label htmlFor="marketingEmails" className="text-sm text-gray-7 cursor-pointer">
                              Emails de marketing e promoções
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary-hard text-white px-6 py-2 flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isSubmitting ? 'Salvando...' : 'Salvar Configurações'}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 