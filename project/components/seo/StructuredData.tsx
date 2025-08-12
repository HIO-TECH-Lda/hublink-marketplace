'use client';

import Script from 'next/script';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

interface ProductData {
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency: string;
  availability: string;
  brand: string;
  category: string;
  sku: string;
  url: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface StructuredDataProps {
  type: 'organization' | 'product' | 'breadcrumb' | 'website';
  data: OrganizationData | ProductData | BreadcrumbData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseUrl = 'https://txova.co.mz';

    switch (type) {
      case 'organization':
        const orgData = data as OrganizationData;
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: orgData.name,
          url: orgData.url,
          logo: orgData.logo,
          description: orgData.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: orgData.address.streetAddress,
            addressLocality: orgData.address.addressLocality,
            addressRegion: orgData.address.addressRegion,
            postalCode: orgData.address.postalCode,
            addressCountry: orgData.address.addressCountry,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: orgData.contactPoint.telephone,
            contactType: orgData.contactPoint.contactType,
            email: orgData.contactPoint.email,
          },
          sameAs: orgData.sameAs,
        };

      case 'product':
        const productData = data as ProductData;
        const structuredProduct: any = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productData.name,
          description: productData.description,
          image: productData.image,
          brand: {
            '@type': 'Brand',
            name: productData.brand,
          },
          category: productData.category,
          sku: productData.sku,
          url: productData.url,
          offers: {
            '@type': 'Offer',
            price: productData.price,
            priceCurrency: productData.priceCurrency,
            availability: productData.availability,
            seller: {
              '@type': 'Organization',
              name: 'Txova',
            },
          },
        };

        if (productData.aggregateRating) {
          structuredProduct.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: productData.aggregateRating.ratingValue,
            reviewCount: productData.aggregateRating.reviewCount,
          };
        }

        return structuredProduct;

      case 'breadcrumb':
        const breadcrumbData = data as BreadcrumbData;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbData.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          })),
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Txova - Marketplace Orgânico',
          url: baseUrl,
          description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/loja?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Helper functions for common structured data
export const getOrganizationData = (): OrganizationData => ({
  name: 'Txova - Marketplace Orgânico',
  url: 'https://txova.co.mz',
  logo: 'https://txova.co.mz/icons/icon-512x512.png',
  description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala',
  address: {
    streetAddress: 'Rua Principal, 123',
    addressLocality: 'Beira',
    addressRegion: 'Sofala',
    postalCode: '1100',
    addressCountry: 'MZ',
  },
  contactPoint: {
    telephone: '+258 84 123 4567',
    contactType: 'customer service',
    email: 'contato@txova.co.mz',
  },
  sameAs: [
    'https://facebook.com/txova',
    'https://instagram.com/txova',
    'https://twitter.com/txova',
  ],
});

export const getProductData = (product: any): ProductData => ({
  name: product.name,
  description: product.description,
  image: product.image,
  price: product.price,
  priceCurrency: 'MZN',
  availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  brand: product.brand || 'Txova',
  category: product.category,
  sku: product.sku || product.id,
  url: `https://txova.co.mz/produto/${product.id}`,
  aggregateRating: product.rating ? {
    ratingValue: product.rating,
    reviewCount: product.reviews || 0,
  } : undefined,
});

export const getBreadcrumbData = (items: Array<{ name: string; url: string }>): BreadcrumbData => ({
  items: [
    { name: 'Início', url: '/' },
    ...items,
  ],
}); 