'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { FloatingPersonalizationPanel } from '@/components/personalization/FloatingPersonalizationPanel';
import { useBrandConfigs } from '@/hooks/use-brand-configs';
import { useRouticketData } from '@/hooks/use-routicket-data';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';
import { mockBusiness, mockCoupons } from '@/lib/mock-data';
import type { BrandConfig, Business, Coupon } from '@/lib/types';
import { CustomerHeader } from './CustomerHeader';
import { HeroSection } from './HeroSection';
import { CouponsSection } from './CouponsSection';

const API_PUBLIC_KEY = process.env.NEXT_PUBLIC_API_PUBLIC_KEY ?? 'demo-public-key';
const API_SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY ?? 'demo-secret-key';
const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'demo-user';
const PARTNER_ID = process.env.NEXT_PUBLIC_PARTNER_ID ?? '1427';
const USE_DEMO_DATA = process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true';

function normalizeDate(value?: string | number | Date | null) {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

function getPrimaryBrandConfig(brandConfigs: Record<string, BrandConfig> | undefined) {
  if (brandConfigs && Object.keys(brandConfigs).length > 0) {
    const [firstKey] = Object.keys(brandConfigs);
    return brandConfigs[firstKey];
  }
  return defaultBrandConfig;
}

export function CustomerExperience() {
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [brandConfigs, setBrandConfigs] = useBrandConfigs({});

  const {
    data: apiData,
    isLoading: isApiLoading,
    error: apiError,
    refresh: refreshApi,
    partnerCoupons
  } = useRouticketData({
    apiPublicKey: API_PUBLIC_KEY,
    apiSecret: API_SECRET_KEY,
    userId: USER_ID,
    partnerId: PARTNER_ID,
    useDemoData: USE_DEMO_DATA
  });

  const partnerBusiness: Business | undefined = useMemo(() => {
    const firstCoupon = partnerCoupons[0];
    if (!firstCoupon) return undefined;
    return {
      id: `partner-${PARTNER_ID}`,
      name: firstCoupon.text?.trim() || firstCoupon.titulo || `Partner ${PARTNER_ID}`,
      logo: firstCoupon.foto_post || firstCoupon.foto || 'https://routicket.com/favicon.ico',
      category: 'services',
      description: apiData?.api_usage?.note || 'Ofertas sincronizadas automáticamente desde Routicket.',
      address: 'No disponible',
      hours: 'Sin horario disponible',
      phone: 'No disponible',
      coverImage: firstCoupon.foto || firstCoupon.foto_post || 'https://routicket.com/favicon.ico'
    };
  }, [partnerCoupons, apiData?.api_usage?.note]);

  const apiCoupons: Coupon[] = useMemo(() => {
    if (!partnerBusiness) return [];
    return partnerCoupons.map((coupon) => ({
      id: String(coupon.id),
      businessId: partnerBusiness.id,
      title: coupon.titulo,
      description: coupon.descripcion || coupon.condiciones || 'Promoción disponible',
      discount: coupon.text || 'Cupón digital',
      image: coupon.foto || coupon.foto_post || partnerBusiness.coverImage,
      terms: coupon.condiciones || '',
      expiryDate: normalizeDate(coupon.fecha_final),
      category: partnerBusiness.category,
      redemptionCode: String(coupon.code ?? coupon.id),
      isNew: Boolean(coupon.status === 1 && coupon.vistosx < 50),
      isActive: coupon.status === 1,
      maxRedemptions: undefined,
      currentRedemptions: coupon.usado,
      createdAt: normalizeDate(coupon.fecha_create)
    }));
  }, [partnerBusiness, partnerCoupons]);

  const currentBrandConfig = useMemo(() => getPrimaryBrandConfig(brandConfigs), [brandConfigs]);

  useEffect(() => {
    applyBrandColors(currentBrandConfig);
  }, [currentBrandConfig]);

  const placeholderBusiness = useMemo<Business>(
    () => ({
      id: 'placeholder-business',
      name: currentBrandConfig.platformName,
      logo: currentBrandConfig.logoUrl || 'https://routicket.com/favicon.ico',
      category: 'services',
      description:
        currentBrandConfig.tagline ||
        'Personaliza tu cuponera digital y sincroniza tus promociones en tiempo real.',
      address: 'No disponible',
      hours: 'Sin horario disponible',
      phone: 'No disponible',
      coverImage:
        currentBrandConfig.heroImageUrl ||
        currentBrandConfig.logoUrl ||
        'https://routicket.com/favicon.ico'
    }),
    [
      currentBrandConfig.platformName,
      currentBrandConfig.logoUrl,
      currentBrandConfig.tagline,
      currentBrandConfig.heroImageUrl
    ]
  );

  const shouldUsePartner = useMemo(() => {
    if (!partnerBusiness) return false;
    const configuredBusinessId = currentBrandConfig.businessId;
    return !configuredBusinessId || configuredBusinessId === partnerBusiness.id;
  }, [currentBrandConfig.businessId, partnerBusiness]);

  const displayBusiness: Business = (shouldUsePartner && partnerBusiness) || placeholderBusiness;

  const businessCoupons = useMemo(() => {
    if (shouldUsePartner && apiCoupons.length > 0) {
      return apiCoupons;
    }
    return mockCoupons;
  }, [shouldUsePartner, apiCoupons]);

  const effectiveBusiness = businessCoupons === mockCoupons ? mockBusiness : displayBusiness;

  if (viewMode === 'business') {
    return (
      <AdminDashboard
        onBackToCustomer={() => setViewMode('customer')}
        brandConfigs={brandConfigs || {}}
        onBrandConfigUpdate={setBrandConfigs}
        apiData={apiData}
        partnerId={PARTNER_ID}
        isLoading={isApiLoading}
        error={apiError}
        onRefresh={refreshApi}
      />
    );
  }

  const backgroundStyle = currentBrandConfig.backgroundColor
    ? { backgroundColor: currentBrandConfig.backgroundColor }
    : undefined;

  const tagline =
    currentBrandConfig.tagline ||
    (shouldUsePartner && partnerBusiness
      ? `Explora promociones exclusivas de ${partnerBusiness.name}.`
      : 'Explora ofertas exclusivas de negocios locales en tu comunidad.');

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <FloatingPersonalizationPanel />

      <CustomerHeader
        brandConfig={currentBrandConfig}
        tagline={tagline}
        onSwitchToDashboard={() => setViewMode('business')}
      />

      <main className="container mx-auto px-6 py-10 space-y-10">
        <HeroSection
          displayBusiness={displayBusiness}
          brandConfig={currentBrandConfig}
          tagline={tagline}
          onOpenDashboard={() => setViewMode('business')}
        />

        <CouponsSection
          businessName={displayBusiness?.name}
          fallbackPlatformName={currentBrandConfig.platformName}
          businessCoupons={businessCoupons}
          effectiveBusiness={effectiveBusiness}
          isLoading={isApiLoading}
        />
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground space-y-2">
          <p>{currentBrandConfig.platformName} — experiencias de cupones listas para tu marca.</p>
          <p>
            Personaliza colores, imágenes y mensajes para lanzar tu propio cuaderno de cupones digitales.
          </p>
        </div>
      </footer>
    </div>
  );
}
