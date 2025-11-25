import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Business, CategoryType, BrandConfig } from '@/lib/types';
import { 
  FloppyDisk,
  Image as ImageIcon,
  Palette,
  Globe
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { applyBrandColors } from '@/lib/brand-config';
import { hexToOklch } from '@/lib/color-utils';

interface BusinessSettingsProps {
  business: Business;
  brandConfig?: BrandConfig;
  onBrandConfigUpdate: (config: BrandConfig) => void;
}

export function BusinessSettings({ business, brandConfig, onBrandConfigUpdate }: BusinessSettingsProps) {
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
    accentColorHex: '#E8965A'
  });

  useEffect(() => {
    if (brandConfig) {
      setBrandingData(prev => ({
        ...prev,
        platformName: brandConfig.platformName,
        primaryColor: brandConfig.primaryColor,
        accentColor: brandConfig.accentColor
      }));
    }
  }, [brandConfig]);

  const handleSaveProfile = () => {
    toast.success('¡Perfil de negocio actualizado exitosamente!');
  };

  const handleSaveBranding = () => {
    const newConfig: BrandConfig = {
      platformName: brandingData.platformName,
      primaryColor: hexToOklch(brandingData.primaryColorHex),
      accentColor: hexToOklch(brandingData.accentColorHex),
      businessId: business.id
    };
    
    onBrandConfigUpdate(newConfig);
    applyBrandColors(newConfig);
    toast.success('¡Configuración de marca actualizada exitosamente!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold mb-1">Configuración del Negocio</h2>
        <p className="text-muted-foreground">Gestiona el perfil y la marca de tu negocio</p>
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
