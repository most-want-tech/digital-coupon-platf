import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CouponCard } from '@/components/CouponCard';
import { AdminDashboard } from '@/components/AdminDashboard';
import type { Business, Coupon } from '@/lib/types';
import { Tag, Storefront } from '@phosphor-icons/react';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';
import { useBrandConfigs } from '@/hooks/use-brand-configs';
import { useRouticketData } from '@/hooks/use-routicket-data';

const API_PUBLIC_KEY = 'PUBLIC-d6fee5badbc6667e';
const API_SECRET_KEY = 'SECRET-2b5503383995adc8ffaddba8ec79f331';
const PARTNER_ID = 1427;
const USER_ID = 1427;

const normalizeDate = (value?: string) => {
  if (!value || value === '0000-00-00') {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString();
  }
  return parsed.toISOString();
};

function App() {
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
    partnerId: PARTNER_ID
  });

  const partnerBusiness: Business | undefined = useMemo(() => {
    const firstCoupon = partnerCoupons[0];
    if (!firstCoupon) return undefined;
    return {
      id: `partner-${PARTNER_ID}`,
      name: firstCoupon.text?.trim() || `Partner ${PARTNER_ID}`,
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

  const currentBrandConfig = useMemo(() => {
    if (brandConfigs && Object.keys(brandConfigs).length > 0) {
      const firstKey = Object.keys(brandConfigs)[0];
      return brandConfigs[firstKey];
    }
    return defaultBrandConfig;
  }, [brandConfigs]);

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

  const businessCoupons = shouldUsePartner ? apiCoupons : [];

  if (viewMode === 'business') {
    return (
      <AdminDashboard
        onBackToCustomer={() => setViewMode('customer')}
        brandConfigs={brandConfigs || {}}
        onBrandConfigUpdate={setBrandConfigs}
        apiData={apiData}
        partnerId={PARTNER_ID}
        apiPublicKey={API_PUBLIC_KEY}
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
              <h1 className="text-2xl font-bold tracking-tight">
                {currentBrandConfig.platformName}
              </h1>
              <p className="text-xs text-muted-foreground">{tagline}</p>
            </div>
          </div>

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
      </header>

      <main className="container mx-auto px-6 py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border bg-card text-card-foreground">
          {currentBrandConfig.heroImageUrl && (
            <img
              src={currentBrandConfig.heroImageUrl}
              alt="Imagen promocional"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}
          <div className="relative z-10 p-10 sm:p-16 bg-linear-to-r from-background/90 via-background/85 to-background/60">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              {displayBusiness.name || currentBrandConfig.platformName}
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold max-w-2xl leading-tight">
              {currentBrandConfig.platformName}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="px-6">
                {currentBrandConfig.primaryButtonLabel || 'Ver cupones destacados'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6"
                onClick={() => setViewMode('business')}
              >
                {currentBrandConfig.secondaryButtonLabel || 'Personalizar experiencia'}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">
              Promociones de {displayBusiness?.name || currentBrandConfig.platformName}
            </h3>
            <p className="text-muted-foreground">
              Comparte estas ofertas con tu comunidad y aumenta tus canjes digitales.
            </p>
          </div>

          {isApiLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-muted/40 h-64 animate-pulse" />
              ))}
            </div>
          ) : apiError ? (
            <div className="text-center py-16 border rounded-xl bg-card">
              <Tag className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h4 className="text-xl font-semibold mb-2">No pudimos cargar las promociones</h4>
              <p className="text-muted-foreground mb-4">{apiError}</p>
              <Button onClick={refreshApi} size="sm">
                Reintentar
              </Button>
            </div>
          ) : businessCoupons.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card">
              <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                No hay cupones disponibles por ahora
              </h4>
              <p className="text-muted-foreground">
                Revisa nuevamente más tarde o sincroniza desde el panel de administración.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {businessCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} business={displayBusiness} showActions={false} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground space-y-2">
          <p>
            {currentBrandConfig.platformName} — experiencias de cupones listas
            para tu marca.
          </p>
          <p>
            Personaliza colores, imágenes y mensajes para lanzar tu propio
            cuaderno de cupones digitales.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
