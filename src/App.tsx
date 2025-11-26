import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CouponCard } from '@/components/CouponCard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { mockBusinesses, mockCoupons } from '@/lib/mock-data';
import { Tag, Storefront } from '@phosphor-icons/react';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';
import { useBrandConfigs } from '@/hooks/use-brand-configs';

function App() {
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [brandConfigs, setBrandConfigs] = useBrandConfigs({});

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

  const activeBusinessId =
    currentBrandConfig.businessId || mockBusinesses[0]?.id || '';
  const displayBusiness = mockBusinesses.find(
    (business) => business.id === activeBusinessId
  );
  const businessCoupons = mockCoupons.filter(
    (coupon) => coupon.businessId === activeBusinessId
  );

  if (viewMode === 'business') {
    return (
      <AdminDashboard
        onBackToCustomer={() => setViewMode('customer')}
        brandConfigs={brandConfigs || {}}
        onBrandConfigUpdate={setBrandConfigs}
      />
    );
  }

  const backgroundStyle = currentBrandConfig.backgroundColor
    ? { backgroundColor: currentBrandConfig.backgroundColor }
    : undefined;

  const tagline =
    currentBrandConfig.tagline ||
    'Explora ofertas exclusivas de negocios locales en tu comunidad.';

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
              {displayBusiness?.name || currentBrandConfig.platformName}
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

          {businessCoupons.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card">
              <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                No hay cupones disponibles por ahora
              </h4>
              <p className="text-muted-foreground">
                Agrega promociones desde el panel de personalización para mostrarlas aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {businessCoupons.map((coupon) => {
                const business = mockBusinesses.find(
                  (item) => item.id === coupon.businessId
                );
                if (!business) return null;

                return (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    business={business}
                    showActions={false}
                  />
                );
              })}
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