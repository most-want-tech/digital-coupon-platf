'use client';

import { useEffect, useMemo, useState } from 'react';
import { Storefront, Tag } from '@phosphor-icons/react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { EditableCouponCard } from '@/components/EditableCouponCard';
import { FloatingPersonalizationPanel } from '@/components/personalization/FloatingPersonalizationPanel';
import { EditableElement } from '@/components/personalization/EditableElement';
import { PersonalizationModeToggle } from '@/components/personalization/PersonalizationModeToggle';
import { Button } from '@/components/ui/button';
import { PersonalizationProvider, usePersonalization } from '@/contexts/PersonalizationContext';
import { useBrandConfigs } from '@/hooks/use-brand-configs';
import { useRouticketData } from '@/hooks/use-routicket-data';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';
import { mockBusiness, mockCoupons } from '@/lib/mock-data';
import type { Business, BrandConfig, Coupon } from '@/lib/types';
import type { EditableElementConfig } from '@/lib/personalization-types';
import { buildTextProperties, buildTextStyles } from '@/lib/personalization-text';

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

function CustomerView() {
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [brandConfigs, setBrandConfigs] = useBrandConfigs({});
  const { getCustomization } = usePersonalization();

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

  const currentBrandConfig = useMemo(
    () => getPrimaryBrandConfig(brandConfigs),
    [brandConfigs]
  );

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

  const headerTitleConfig: EditableElementConfig = {
    elementId: 'header-title',
    elementLabel: 'Título del encabezado',
    elementType: 'text',
    category: 'header',
    properties: buildTextProperties(
      getCustomization,
      'header-title',
      { defaultValue: 24, min: 16, max: 48, step: 1 },
      '#111827'
    )
  };

  const headerTaglineConfig: EditableElementConfig = {
    elementId: 'header-tagline',
    elementLabel: 'Subtítulo del encabezado',
    elementType: 'text',
    category: 'header',
    properties: buildTextProperties(
      getCustomization,
      'header-tagline',
      { defaultValue: 12, min: 10, max: 24, step: 1 },
      '#6b7280'
    )
  };

  const headerTitleStyle = buildTextStyles(getCustomization, 'header-title', {
    fontSize: 24,
    color: '#111827'
  });
  const headerTaglineStyle = buildTextStyles(getCustomization, 'header-tagline', {
    fontSize: 12,
    color: '#6b7280'
  });
  const heroSubtitleStyle = buildTextStyles(getCustomization, 'hero-subtitle', { fontSize: 14 });
  const heroTitleStyle = buildTextStyles(getCustomization, 'hero-title', { fontSize: 36 });
  const heroDescriptionStyle = buildTextStyles(getCustomization, 'hero-description', {
    fontSize: 16,
    color: '#4b5563'
  });
  const heroPrimaryButtonStyle = buildTextStyles(
    getCustomization,
    'hero-primary-button',
    { fontSize: 16 },
    { highlightBackground: false }
  );
  const heroSecondaryButtonStyle = buildTextStyles(
    getCustomization,
    'hero-secondary-button',
    { fontSize: 16 },
    { highlightBackground: false }
  );
  const sectionTitleStyle = buildTextStyles(getCustomization, 'section-title', {
    fontSize: 24,
    color: '#111827'
  });
  const sectionDescriptionStyle = buildTextStyles(getCustomization, 'section-description', {
    fontSize: 16,
    color: '#6b7280'
  });

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <FloatingPersonalizationPanel />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentBrandConfig.logoUrl ? (
              <img
                src={currentBrandConfig.logoUrl}
                alt={currentBrandConfig.platformName}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary-foreground" weight="fill" />
              </div>
            )}
            <div>
              <EditableElement elementConfig={headerTitleConfig}>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={headerTitleStyle}
                >
                  {currentBrandConfig.platformName}
                </h1>
              </EditableElement>
              <EditableElement elementConfig={headerTaglineConfig}>
                <p
                  className="text-xs text-muted-foreground"
                  style={headerTaglineStyle}
                >
                  {tagline}
                </p>
              </EditableElement>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PersonalizationModeToggle />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setViewMode('business')}
            >
              <Storefront className="w-4 h-4" />
              Business Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border bg-card text-card-foreground">
          {(() => {
            const heroImageUrl = getCustomization(
              'hero-image',
              'url',
              currentBrandConfig.heroImageUrl || ''
            );
            const heroImageOpacity = getCustomization('hero-image', 'opacity', 80);

            return (
              <EditableElement
                elementConfig={{
                  elementId: 'hero-image',
                  elementLabel: 'Imagen de héroe',
                  elementType: 'image',
                  category: 'hero',
                  properties: [
                    {
                      id: 'url',
                      label: 'URL de imagen',
                      type: 'image',
                      value: heroImageUrl
                    },
                    {
                      id: 'opacity',
                      label: 'Opacidad',
                      type: 'number',
                      value: heroImageOpacity,
                      min: 0,
                      max: 100,
                      step: 5,
                      unit: '%'
                    }
                  ]
                }}
              >
                {heroImageUrl && (
                  <img
                    src={heroImageUrl as string}
                    alt="Imagen promocional"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: (heroImageOpacity as number) / 100 }}
                  />
                )}
              </EditableElement>
            );
          })()}
          <div className="relative z-10 p-10 sm:p-16 bg-linear-to-r from-background/90 via-background/85 to-background/60">
            <EditableElement
              elementConfig={{
                elementId: 'hero-subtitle',
                elementLabel: 'Subtítulo del héroe',
                elementType: 'text',
                category: 'hero',
                properties: buildTextProperties(getCustomization, 'hero-subtitle', {
                  defaultValue: 14,
                  min: 10,
                  max: 24,
                  step: 1
                })
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide text-accent"
                style={heroSubtitleStyle}
              >
                {displayBusiness.name || currentBrandConfig.platformName}
              </p>
            </EditableElement>
            <EditableElement
              elementConfig={{
                elementId: 'hero-title',
                elementLabel: 'Título del héroe',
                elementType: 'text',
                category: 'hero',
                properties: buildTextProperties(getCustomization, 'hero-title', {
                  defaultValue: 36,
                  min: 24,
                  max: 72,
                  step: 2
                })
              }}
            >
              <h2
                className="mt-4 text-3xl sm:text-4xl font-bold max-w-2xl leading-tight"
                style={heroTitleStyle}
              >
                {currentBrandConfig.platformName}
              </h2>
            </EditableElement>
            <EditableElement
              elementConfig={{
                elementId: 'hero-description',
                elementLabel: 'Descripción del héroe',
                elementType: 'text',
                category: 'hero',
                properties: buildTextProperties(getCustomization, 'hero-description', {
                  defaultValue: 16,
                  min: 12,
                  max: 24,
                  step: 1
                })
              }}
            >
              <p
                className="mt-4 max-w-2xl text-base text-muted-foreground"
                style={heroDescriptionStyle}
              >
                {tagline}
              </p>
            </EditableElement>
            <div className="mt-6 flex flex-wrap gap-3">
              <EditableElement
                elementConfig={{
                  elementId: 'hero-primary-button',
                  elementLabel: 'Botón primario',
                  elementType: 'button',
                  category: 'button',
                  properties: buildTextProperties(getCustomization, 'hero-primary-button', {
                    defaultValue: 16,
                    min: 12,
                    max: 24,
                    step: 1
                  })
                }}
              >
                <Button size="lg" className="px-6" style={heroPrimaryButtonStyle}>
                  {currentBrandConfig.primaryButtonLabel || 'Ver cupones destacados'}
                </Button>
              </EditableElement>
              <EditableElement
                elementConfig={{
                  elementId: 'hero-secondary-button',
                  elementLabel: 'Botón secundario',
                  elementType: 'button',
                  category: 'button',
                  properties: buildTextProperties(getCustomization, 'hero-secondary-button', {
                    defaultValue: 16,
                    min: 12,
                    max: 24,
                    step: 1
                  })
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6"
                  style={heroSecondaryButtonStyle}
                  onClick={() => setViewMode('business')}
                >
                  {currentBrandConfig.secondaryButtonLabel || 'Personalizar experiencia'}
                </Button>
              </EditableElement>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <EditableElement
              elementConfig={{
                elementId: 'section-title',
                elementLabel: 'Título de sección',
                elementType: 'text',
                category: 'text',
                properties: buildTextProperties(getCustomization, 'section-title', {
                  defaultValue: 24,
                  min: 16,
                  max: 48,
                  step: 2
                }, '#111827')
              }}
            >
              <h3
                className="text-2xl font-semibold"
                style={sectionTitleStyle}
              >
                {`Promociones de ${displayBusiness?.name || currentBrandConfig.platformName}`}
              </h3>
            </EditableElement>
            <EditableElement
              elementConfig={{
                elementId: 'section-description',
                elementLabel: 'Descripción de sección',
                elementType: 'text',
                category: 'text',
                properties: buildTextProperties(getCustomization, 'section-description', {
                  defaultValue: 16,
                  min: 12,
                  max: 24,
                  step: 1
                }, '#6b7280')
              }}
            >
              <p className="text-muted-foreground" style={sectionDescriptionStyle}>
                {'Comparte estas ofertas con tu comunidad y aumenta tus canjes digitales.'}
              </p>
            </EditableElement>
          </div>

          {isApiLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-muted/40 h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {businessCoupons.map((coupon) => (
                <EditableCouponCard
                  key={coupon.id}
                  coupon={coupon}
                  business={effectiveBusiness}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </section>
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

function App() {
  return (
    <PersonalizationProvider>
      <CustomerView />
    </PersonalizationProvider>
  );
}

export default App;
