import { useEffect, useMemo, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CouponCard } from '@/components/CouponCard';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { mockBusinesses, mockCoupons } from '@/lib/mock-data';
import { BrandConfig, CategoryType } from '@/lib/types';
import { Tag, Storefront } from '@phosphor-icons/react';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';

function App() {
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [brandConfigs, setBrandConfigs] = useKV<Record<string, BrandConfig>>('brand-configs', {});

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

  if (viewMode === 'business') {
    return (
      <BusinessDashboard
        onBackToCustomer={() => setViewMode('customer')}
        brandConfigs={brandConfigs || {}}
        onBrandConfigUpdate={setBrandConfigs}
      />
    );
  }

  const filteredCoupons = mockCoupons.filter((coupon) =>
    activeCategory === 'all' ? true : coupon.category === activeCategory
  );

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
            Configurar marca
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
              {currentBrandConfig.platformName}
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold max-w-2xl leading-tight">
              Tu catálogo de cupones digitales listo para compartir
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="px-6">
                Ver cupones destacados
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6"
                onClick={() => setViewMode('business')}
              >
                Personalizar experiencia
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">Explora cupones</h3>
            <p className="text-muted-foreground">
              Filtra por categoría y descubre promociones listas para compartir.
            </p>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {filteredCoupons.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card">
              <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                No hay cupones para esta categoría
              </h4>
              <p className="text-muted-foreground">
                Selecciona otra categoría para ver más promociones disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCoupons.map((coupon) => {
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