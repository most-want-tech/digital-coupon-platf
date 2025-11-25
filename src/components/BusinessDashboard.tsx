import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CouponCard } from '@/components/CouponCard';
import { mockBusinesses, mockCoupons } from '@/lib/mock-data';
import { BrandConfig } from '@/lib/types';
import { applyBrandColors, defaultBrandConfig } from '@/lib/brand-config';
import { hexToOklch, oklchToHex } from '@/lib/color-utils';
import { ArrowLeft, ArrowCounterClockwise, FloppyDisk, Palette } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';

interface BusinessDashboardProps {
  onBackToCustomer: () => void;
  brandConfigs: Record<string, BrandConfig>;
  onBrandConfigUpdate: (
    configs:
      | Record<string, BrandConfig>
      | ((prev?: Record<string, BrandConfig>) => Record<string, BrandConfig>)
  ) => void;
}

type BrandFormState = {
  platformName: string;
  tagline: string;
  logoUrl: string;
  heroImageUrl: string;
  primaryColorHex: string;
  accentColorHex: string;
  backgroundColorHex: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
};

const fallbackPrimaryHex = oklchToHex(defaultBrandConfig.primaryColor);
const fallbackAccentHex = oklchToHex(defaultBrandConfig.accentColor);
const fallbackBackgroundHex = defaultBrandConfig.backgroundColor ?? '#f7f7fb';

export function BusinessDashboard({
  onBackToCustomer,
  brandConfigs,
  onBrandConfigUpdate
}: BusinessDashboardProps) {
  const initialBusinessId = mockBusinesses[0]?.id ?? Object.keys(brandConfigs)[0] ?? '';

  const buildFormState = (businessId: string): BrandFormState => {
    const existingConfig = brandConfigs?.[businessId];
    const business = mockBusinesses.find((item) => item.id === businessId);

    return {
      platformName:
        existingConfig?.platformName ||
        business?.name ||
        defaultBrandConfig.platformName,
      tagline: existingConfig?.tagline || defaultBrandConfig.tagline || '',
      logoUrl: existingConfig?.logoUrl || business?.logo || '',
      heroImageUrl:
        existingConfig?.heroImageUrl || defaultBrandConfig.heroImageUrl || '',
      primaryColorHex: oklchToHex(
        existingConfig?.primaryColor || defaultBrandConfig.primaryColor
      ) || fallbackPrimaryHex,
      accentColorHex: oklchToHex(
        existingConfig?.accentColor || defaultBrandConfig.accentColor
      ) || fallbackAccentHex,
      backgroundColorHex:
        existingConfig?.backgroundColor || fallbackBackgroundHex,
      primaryButtonLabel:
        existingConfig?.primaryButtonLabel || defaultBrandConfig.primaryButtonLabel || 'Ver cupones',
      secondaryButtonLabel:
        existingConfig?.secondaryButtonLabel || defaultBrandConfig.secondaryButtonLabel || 'Compartir'
    };
  };

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(initialBusinessId);
  const [formState, setFormState] = useState<BrandFormState>(() => buildFormState(initialBusinessId));

  useEffect(() => {
    if (!selectedBusinessId) return;
    setFormState(buildFormState(selectedBusinessId));
  }, [selectedBusinessId, brandConfigs]);

  const selectedBusiness = useMemo(
    () => mockBusinesses.find((item) => item.id === selectedBusinessId),
    [selectedBusinessId]
  );

  const previewCoupons = useMemo(
    () =>
      mockCoupons
        .filter((coupon) => coupon.businessId === selectedBusinessId)
        .slice(0, 2),
    [selectedBusinessId]
  );

  const previewThemeVars = useMemo(() => {
    return {
      '--primary': hexToOklch(formState.primaryColorHex),
      '--accent': hexToOklch(formState.accentColorHex),
      '--brand-background': formState.backgroundColorHex,
      backgroundColor: formState.backgroundColorHex
    } as CSSProperties & Record<string, string>;
  }, [formState.primaryColorHex, formState.accentColorHex, formState.backgroundColorHex]);

  const handleFieldChange = <K extends keyof BrandFormState>(key: K, value: BrandFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!selectedBusinessId) return;

    const newConfig: BrandConfig = {
      platformName: formState.platformName,
      primaryColor: hexToOklch(formState.primaryColorHex),
      accentColor: hexToOklch(formState.accentColorHex),
      backgroundColor: formState.backgroundColorHex,
      logoUrl: formState.logoUrl,
      tagline: formState.tagline,
      heroImageUrl: formState.heroImageUrl,
      businessId: selectedBusinessId,
      primaryButtonLabel: formState.primaryButtonLabel,
      secondaryButtonLabel: formState.secondaryButtonLabel
    };

    onBrandConfigUpdate((prev = {}) => ({
      ...prev,
      [selectedBusinessId]: newConfig
    }));

    applyBrandColors(newConfig);
    toast.success('¡Marca guardada y aplicada a la vista del cliente!');
  };

  const handleReset = () => {
    if (!selectedBusinessId) return;
    setFormState(buildFormState(selectedBusinessId));
    toast.info('Campos restablecidos a los valores guardados.');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-center" />

      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2" onClick={onBackToCustomer}>
              <ArrowLeft className="w-4 h-4" />
              Vista cliente
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Estudio de marca</h1>
              <p className="text-xs text-muted-foreground">
                Ajusta colores, mensajes e imágenes y observa la vista previa en tiempo real.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Palette className="w-4 h-4" />
            Modo personalización
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Opciones de marca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business-select">Negocio de referencia</Label>
                <Select
                  value={selectedBusinessId}
                  onValueChange={setSelectedBusinessId}
                  disabled={mockBusinesses.length === 0}
                >
                  <SelectTrigger id="business-select">
                    <SelectValue placeholder="Selecciona un negocio" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBusinesses.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nombre de la plataforma</Label>
                  <Input
                    id="platform-name"
                    value={formState.platformName}
                    onChange={(event) => handleFieldChange('platformName', event.target.value)}
                    placeholder="Ej. Cuponera de Barrio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Mensaje destacado</Label>
                  <Textarea
                    id="tagline"
                    value={formState.tagline}
                    onChange={(event) => handleFieldChange('tagline', event.target.value)}
                    rows={3}
                    placeholder="Describe el beneficio principal de tus cupones."
                  />
                  <p className="text-xs text-muted-foreground">
                    Este texto aparece en la cabecera y en la vista previa pública.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo (URL)</Label>
                  <Input
                    id="logo-url"
                    value={formState.logoUrl}
                    onChange={(event) => handleFieldChange('logoUrl', event.target.value)}
                    placeholder="https://tu-marca.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-url">Imagen hero (URL)</Label>
                  <Input
                    id="hero-url"
                    value={formState.heroImageUrl}
                    onChange={(event) => handleFieldChange('heroImageUrl', event.target.value)}
                    placeholder="https://tu-marca.com/encabezado.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-button-label">Botón principal</Label>
                  <Input
                    id="primary-button-label"
                    value={formState.primaryButtonLabel}
                    onChange={(event) => handleFieldChange('primaryButtonLabel', event.target.value)}
                    placeholder="Ver cupones destacados"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-button-label">Botón secundario</Label>
                  <Input
                    id="secondary-button-label"
                    value={formState.secondaryButtonLabel}
                    onChange={(event) => handleFieldChange('secondaryButtonLabel', event.target.value)}
                    placeholder="Personalizar experiencia"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Color primario</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formState.primaryColorHex}
                      onChange={(event) => handleFieldChange('primaryColorHex', event.target.value)}
                      className="h-10 w-16 cursor-pointer"
                    />
                    <Input
                      value={formState.primaryColorHex}
                      onChange={(event) => handleFieldChange('primaryColorHex', event.target.value)}
                      placeholder="#4F46E5"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color de acento</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formState.accentColorHex}
                      onChange={(event) => handleFieldChange('accentColorHex', event.target.value)}
                      className="h-10 w-16 cursor-pointer"
                    />
                    <Input
                      value={formState.accentColorHex}
                      onChange={(event) => handleFieldChange('accentColorHex', event.target.value)}
                      placeholder="#E8965A"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color de fondo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formState.backgroundColorHex}
                      onChange={(event) => handleFieldChange('backgroundColorHex', event.target.value)}
                      className="h-10 w-16 cursor-pointer"
                    />
                    <Input
                      value={formState.backgroundColorHex}
                      onChange={(event) => handleFieldChange('backgroundColorHex', event.target.value)}
                      placeholder="#F7F7FB"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
                  <ArrowCounterClockwise className="w-4 h-4" />
                  Restablecer
                </Button>
                <Button size="sm" className="gap-2" onClick={handleSave}>
                  <FloppyDisk className="w-4 h-4" />
                  Guardar marca
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={previewThemeVars} className="border-primary/10">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Vista previa en vivo</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Así verán tus clientes el cuaderno de cupones personalizado.
                  </p>
                </div>
                {formState.logoUrl ? (
                  <img
                    src={formState.logoUrl}
                    alt="Logo de marca"
                    className="h-10 w-10 rounded-md object-contain border border-border"
                  />
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative overflow-hidden rounded-3xl border bg-background/80">
                {formState.heroImageUrl && (
                  <img
                    src={formState.heroImageUrl}
                    alt="Imagen hero"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                )}
                <div className="relative z-10 p-10 sm:p-16 bg-linear-to-r from-background/90 via-background/80 to-background/70">
                  <Badge variant="secondary" className="mb-4 w-fit">
                    {selectedBusiness?.name || formState.platformName}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                    {formState.platformName}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                    {formState.tagline || 'Añade un mensaje para tus clientes potenciales.'}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button size="sm" className="px-5">
                      {formState.primaryButtonLabel || 'Ver cupones'}
                    </Button>
                    <Button variant="outline" size="sm" className="px-5">
                      {formState.secondaryButtonLabel || 'Compartir catálogo'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Cupones destacados</h3>
                  <Badge variant="outline">Simulación</Badge>
                </div>
                {previewCoupons.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-background/70 p-6 text-sm text-muted-foreground">
                    Agrega cupones para este negocio y se mostrarán automáticamente en la vista previa.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {previewCoupons.map((coupon) => (
                      <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        business={selectedBusiness ?? mockBusinesses[0]}
                        showActions={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
