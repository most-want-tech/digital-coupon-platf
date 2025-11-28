import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Business, CategoryType, BrandConfig } from '@/lib/types';
import { 
  FloppyDisk,
  Image as ImageIcon,
  Palette,
  Globe,
  DownloadSimple,
  UploadSimple,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { applyBrandColors } from '@/lib/brand-config';
import { hexToOklch, oklchToHex } from '@/lib/color-utils';

interface BusinessSettingsProps {
  business: Business;
  brandConfig?: BrandConfig;
  onBrandConfigUpdate: (config: BrandConfig) => void;
}

interface CustomizationConfig {
  business: {
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    hours: string;
    email: string;
    website: string;
  };
  branding: BrandConfig & {
    primaryColorHex: string;
    accentColorHex: string;
    borderRadius: number;
    spacing: number;
    fontSize: number;
  };
  metadata: {
    version: string;
    exportedAt: string;
    businessId: string;
  };
}

export function BusinessSettings({ business, brandConfig, onBrandConfigUpdate }: BusinessSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: business.name,
    category: business.category,
    description: business.description,
    address: business.address,
    phone: business.phone,
    hours: business.hours,
    email: business.email || '',
    website: business.website || ''
  });

  const [brandingData, setBrandingData] = useState({
    platformName: brandConfig?.platformName || 'Cupones Digitales',
    primaryColor: brandConfig?.primaryColor || 'oklch(0.45 0.15 250)',
    accentColor: brandConfig?.accentColor || 'oklch(0.68 0.19 35)',
    primaryColorHex: '#4F46E5',
    accentColorHex: '#E8965A',
    logoUrl: brandConfig?.logoUrl || '',
    tagline: brandConfig?.tagline || 'Descubre ofertas locales personalizadas para tu comunidad.',
    backgroundColor: brandConfig?.backgroundColor || '#f7f7fb',
    heroImageUrl: brandConfig?.heroImageUrl || '',
    primaryButtonLabel: brandConfig?.primaryButtonLabel || 'Ver cupones destacados',
    secondaryButtonLabel: brandConfig?.secondaryButtonLabel || 'Personalizar experiencia',
    borderRadius: 8,
    spacing: 4,
    fontSize: 16
  });

  useEffect(() => {
    if (brandConfig) {
      const primaryHex = oklchToHex(brandConfig.primaryColor);
      const accentHex = oklchToHex(brandConfig.accentColor);
      
      setBrandingData(prev => ({
        ...prev,
        platformName: brandConfig.platformName,
        primaryColor: brandConfig.primaryColor,
        accentColor: brandConfig.accentColor,
        primaryColorHex: primaryHex,
        accentColorHex: accentHex,
        logoUrl: brandConfig.logoUrl || '',
        tagline: brandConfig.tagline || prev.tagline,
        backgroundColor: brandConfig.backgroundColor || prev.backgroundColor,
        heroImageUrl: brandConfig.heroImageUrl || prev.heroImageUrl,
        primaryButtonLabel: brandConfig.primaryButtonLabel || prev.primaryButtonLabel,
        secondaryButtonLabel: brandConfig.secondaryButtonLabel || prev.secondaryButtonLabel
      }));
    }
  }, [brandConfig]);

  const handleSaveProfile = () => {
    // Save business profile data to localStorage
    try {
      const businessData = {
        ...business,
        ...formData
      };
      localStorage.setItem(`business-profile-${business.id}`, JSON.stringify(businessData));
      toast.success('¡Perfil de negocio actualizado exitosamente!');
    } catch (error) {
      toast.error('Error al guardar el perfil del negocio');
      console.error('Save profile error:', error);
    }
  };

  const handleSaveBranding = () => {
    try {
      const newConfig: BrandConfig = {
        platformName: brandingData.platformName,
        primaryColor: hexToOklch(brandingData.primaryColorHex),
        accentColor: hexToOklch(brandingData.accentColorHex),
        logoUrl: brandingData.logoUrl,
        tagline: brandingData.tagline,
        backgroundColor: brandingData.backgroundColor,
        heroImageUrl: brandingData.heroImageUrl,
        primaryButtonLabel: brandingData.primaryButtonLabel,
        secondaryButtonLabel: brandingData.secondaryButtonLabel,
        businessId: business.id
      };
      
      onBrandConfigUpdate(newConfig);
      applyBrandColors(newConfig);
      toast.success('¡Configuración de marca actualizada exitosamente!');
    } catch (error) {
      toast.error('Error al guardar la configuración de marca');
      console.error('Save branding error:', error);
    }
  };

  const handleExportConfig = () => {
    try {
      const config: CustomizationConfig = {
        business: formData,
        branding: {
          platformName: brandingData.platformName,
          primaryColor: hexToOklch(brandingData.primaryColorHex),
          accentColor: hexToOklch(brandingData.accentColorHex),
          primaryColorHex: brandingData.primaryColorHex,
          accentColorHex: brandingData.accentColorHex,
          logoUrl: brandingData.logoUrl,
          tagline: brandingData.tagline,
          backgroundColor: brandingData.backgroundColor,
          heroImageUrl: brandingData.heroImageUrl,
          primaryButtonLabel: brandingData.primaryButtonLabel,
          secondaryButtonLabel: brandingData.secondaryButtonLabel,
          borderRadius: brandingData.borderRadius,
          spacing: brandingData.spacing,
          fontSize: brandingData.fontSize,
          businessId: business.id
        },
        metadata: {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          businessId: business.id
        }
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customization-${business.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('¡Configuración exportada exitosamente!');
    } catch (error) {
      toast.error('Error al exportar la configuración');
      console.error('Export error:', error);
    }
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config: CustomizationConfig = JSON.parse(content);

        // Validate config structure
        if (!config.business || !config.branding || !config.metadata) {
          throw new Error('Formato de configuración inválido');
        }

        // Apply business data with proper typing
        setFormData({
          ...formData,
          name: config.business.name,
          category: config.business.category as Exclude<CategoryType, 'all'>,
          description: config.business.description,
          address: config.business.address,
          phone: config.business.phone,
          hours: config.business.hours,
          email: config.business.email,
          website: config.business.website
        });

        // Apply branding data
        setBrandingData({
          platformName: config.branding.platformName,
          primaryColor: config.branding.primaryColor,
          accentColor: config.branding.accentColor,
          primaryColorHex: config.branding.primaryColorHex,
          accentColorHex: config.branding.accentColorHex,
          logoUrl: config.branding.logoUrl || '',
          tagline: config.branding.tagline || brandingData.tagline,
          backgroundColor: config.branding.backgroundColor || brandingData.backgroundColor,
          heroImageUrl: config.branding.heroImageUrl || brandingData.heroImageUrl,
          primaryButtonLabel: config.branding.primaryButtonLabel || brandingData.primaryButtonLabel,
          secondaryButtonLabel: config.branding.secondaryButtonLabel || brandingData.secondaryButtonLabel,
          borderRadius: config.branding.borderRadius || 8,
          spacing: config.branding.spacing || 4,
          fontSize: config.branding.fontSize || 16
        });

        toast.success('¡Configuración importada exitosamente! Recuerda guardar los cambios.');
      } catch (error) {
        toast.error('Error al importar la configuración');
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleResetToDefaults = () => {
    if (!confirm('¿Estás seguro de que deseas restablecer toda la configuración a los valores predeterminados?')) {
      return;
    }

    setFormData({
      name: business.name,
      category: business.category,
      description: business.description,
      address: business.address,
      phone: business.phone,
      hours: business.hours,
      email: business.email || '',
      website: business.website || ''
    });

    setBrandingData({
      platformName: 'Cupones Digitales',
      primaryColor: 'oklch(0.45 0.15 250)',
      accentColor: 'oklch(0.68 0.19 35)',
      primaryColorHex: '#4F46E5',
      accentColorHex: '#E8965A',
      logoUrl: '',
      tagline: 'Descubre ofertas locales personalizadas para tu comunidad.',
      backgroundColor: '#f7f7fb',
      heroImageUrl: '',
      primaryButtonLabel: 'Ver cupones destacados',
      secondaryButtonLabel: 'Personalizar experiencia',
      borderRadius: 8,
      spacing: 4,
      fontSize: 16
    });

    toast.success('Configuración restablecida a valores predeterminados');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Business Settings</h2>
          <p className="text-muted-foreground">Manage your business profile and customize your white-label branding</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportConfig}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <UploadSimple className="w-4 h-4" />
            Importar
          </Button>
          <Button variant="outline" onClick={handleExportConfig} className="gap-2">
            <DownloadSimple className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleResetToDefaults} className="gap-2">
            <ArrowsClockwise className="w-4 h-4" />
            Restablecer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil del Negocio</CardTitle>
          <CardDescription>Actualiza la información de tu negocio visible para los clientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nombre del Negocio *</Label>
              <Input
                id="business-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Exclude<CategoryType, 'all'> })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Comida y Restaurantes</SelectItem>
                  <SelectItem value="retail">Tiendas</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="entertainment">Entretenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Cuéntale a los clientes sobre tu negocio"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle Principal 123, Ciudad, Estado"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@negocio.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours">Horario</Label>
              <Input
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="Lun-Vie: 9am-6pm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.tunegocio.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveProfile} className="gap-2">
              <FloppyDisk className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Marca White-Label
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia de la plataforma con los colores e imágenes de tu marca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nombre de la Plataforma</Label>
              <Input
                id="platform-name"
                value={brandingData.platformName}
                onChange={(e) => setBrandingData({ ...brandingData, platformName: e.target.value })}
                placeholder="Cupones Digitales"
              />
              <p className="text-xs text-muted-foreground">Este nombre aparecerá en la cabecera de la plataforma</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Eslogan</Label>
              <Input
                id="tagline"
                value={brandingData.tagline}
                onChange={(e) => setBrandingData({ ...brandingData, tagline: e.target.value })}
                placeholder="Descubre ofertas locales personalizadas para tu comunidad."
              />
              <p className="text-xs text-muted-foreground">Texto descriptivo que aparece en la página principal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-url">URL del Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logo-url"
                  value={brandingData.logoUrl}
                  onChange={(e) => setBrandingData({ ...brandingData, logoUrl: e.target.value })}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <Button variant="outline" size="icon" className="shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">URL de la imagen de tu logo (recomendado: PNG transparente)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-image-url">URL de Imagen Hero</Label>
              <Input
                id="hero-image-url"
                value={brandingData.heroImageUrl}
                onChange={(e) => setBrandingData({ ...brandingData, heroImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
              />
              <p className="text-xs text-muted-foreground">Imagen principal de la página de inicio</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-button-label">Etiqueta Botón Principal</Label>
                <Input
                  id="primary-button-label"
                  value={brandingData.primaryButtonLabel}
                  onChange={(e) => setBrandingData({ ...brandingData, primaryButtonLabel: e.target.value })}
                  placeholder="Ver cupones destacados"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-button-label">Etiqueta Botón Secundario</Label>
                <Input
                  id="secondary-button-label"
                  value={brandingData.secondaryButtonLabel}
                  onChange={(e) => setBrandingData({ ...brandingData, secondaryButtonLabel: e.target.value })}
                  placeholder="Personalizar experiencia"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Color Primario</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={brandingData.primaryColorHex}
                  onChange={(e) => setBrandingData({ ...brandingData, primaryColorHex: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.primaryColorHex}
                  onChange={(e) => setBrandingData({ ...brandingData, primaryColorHex: e.target.value })}
                  placeholder="#4F46E5"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Color principal de marca para botones y destacados</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Color de Acento</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={brandingData.accentColorHex}
                  onChange={(e) => setBrandingData({ ...brandingData, accentColorHex: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.accentColorHex}
                  onChange={(e) => setBrandingData({ ...brandingData, accentColorHex: e.target.value })}
                  placeholder="#E8965A"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Color de resaltado para ofertas y CTAs</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-color">Color de Fondo</Label>
              <div className="flex gap-2">
                <Input
                  id="background-color"
                  type="color"
                  value={brandingData.backgroundColor}
                  onChange={(e) => setBrandingData({ ...brandingData, backgroundColor: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.backgroundColor}
                  onChange={(e) => setBrandingData({ ...brandingData, backgroundColor: e.target.value })}
                  placeholder="#f7f7fb"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Color de fondo principal de la plataforma</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <h4 className="font-semibold">Ajustes de Estilo</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="border-radius">Radio de Borde</Label>
                  <span className="text-sm text-muted-foreground">{brandingData.borderRadius}px</span>
                </div>
                <Slider
                  id="border-radius"
                  min={0}
                  max={24}
                  step={1}
                  value={[brandingData.borderRadius]}
                  onValueChange={(value) => setBrandingData({ ...brandingData, borderRadius: value[0] })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Redondeo de esquinas en tarjetas y botones</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="spacing">Espaciado</Label>
                  <span className="text-sm text-muted-foreground">{brandingData.spacing}</span>
                </div>
                <Slider
                  id="spacing"
                  min={1}
                  max={8}
                  step={1}
                  value={[brandingData.spacing]}
                  onValueChange={(value) => setBrandingData({ ...brandingData, spacing: value[0] })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Espaciado entre elementos</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Tamaño de Fuente</Label>
                  <span className="text-sm text-muted-foreground">{brandingData.fontSize}px</span>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={20}
                  step={1}
                  value={[brandingData.fontSize]}
                  onValueChange={(value) => setBrandingData({ ...brandingData, fontSize: value[0] })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Tamaño base de fuente</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Plataforma White-Label</h4>
                <p className="text-sm text-muted-foreground">
                  Estas personalizaciones se aplicarán en toda la plataforma de cara al cliente. 
                  Tu marca reemplazará el tema por defecto, creando una experiencia completamente 
                  personalizada para tus clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveBranding} className="gap-2">
              <FloppyDisk className="w-4 h-4" />
              Guardar Marca
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integración API</CardTitle>
          <CardDescription>Conecta tus sistemas a la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="text-sm mb-4">
              Usa la API para integrar con tus sistemas existentes. Gestiona cupones, 
              rastrea canjes y sincroniza datos de clientes programáticamente.
            </p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Endpoint API</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value="https://api.cuponesdigitales.io/v1"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">Copiar</Button>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Clave API</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value="sk_live_••••••••••••••••••••"
                    readOnly
                    type="password"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">Mostrar</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline">Ver Documentación API</Button>
            <Button variant="outline">Generar Nueva Clave</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
