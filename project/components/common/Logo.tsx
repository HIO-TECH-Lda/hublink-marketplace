import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logoConfig, LogoVariant } from '@/lib/logo-config';

interface LogoProps {
  /** Logo variant to display */
  variant?: LogoVariant;
  /** Width in pixels (for Next.js Image) */
  width?: number;
  /** Height in pixels (for Next.js Image) */
  height?: number;
  /** Custom CSS classes */
  className?: string;
  /** Whether logo is clickable (links to homepage) */
  clickable?: boolean;
  /** Show brand name text alongside logo */
  showBrandName?: boolean;
  /** Custom brand name text classes */
  brandNameClassName?: string;
  /** Container classes when clickable */
  containerClassName?: string;
  /** Whether to prioritize loading (use only for above-fold logos) */
  priority?: boolean;
}

export default function Logo({
  variant = 'main',
  width = 120,
  height = 40,
  className = '',
  clickable = true,
  showBrandName = false,
  brandNameClassName = 'text-xl sm:text-2xl font-bold text-gray-9',
  containerClassName = 'flex items-center space-x-2',
  priority = false,
}: LogoProps) {
  const logoPath = logoConfig[variant];
  const brandName = logoConfig.brandName ?? 'VITRINE';
  
  // Fallback: Text-based logo with circular "T"
  const FallbackLogo = () => (
    <div className={containerClassName}>
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">{brandName.charAt(0)}</span>
      </div>
      <span className={brandNameClassName}>{brandName}</span>
    </div>
  );

  // If no logo path is set, use fallback
  if (!logoPath) {
    if (clickable) {
      return (
        <Link href="/" className={containerClassName}>
          <FallbackLogo />
        </Link>
      );
    }
    return <FallbackLogo />;
  }

  // Logo content
  const LogoContent = () => (
    <div className={containerClassName}>
      <Image
        src={logoPath}
        alt={brandName}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
      {showBrandName && (
        <span className={brandNameClassName}>{brandName}</span>
      )}
    </div>
  );

  // If clickable, wrap in Link
  if (clickable) {
    return (
      <Link href="/" className="inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
