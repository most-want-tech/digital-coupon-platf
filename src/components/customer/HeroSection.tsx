'use client';

import { Button } from '@/components/ui/button';
import { EditableElement } from '@/components/personalization/EditableElement';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { buildTextProperties, buildTextStyles } from '@/lib/personalization-text';
import type { EditableElementConfig } from '@/lib/personalization-types';
import type { BrandConfig, Business } from '@/lib/types';

interface HeroSectionProps {
  displayBusiness: Business;
  brandConfig: BrandConfig;
  tagline: string;
  onOpenDashboard: () => void;
  onRequestLogin: () => void;
  isAuthenticated: boolean;
}

export function HeroSection({
  displayBusiness,
  brandConfig,
  tagline,
  onOpenDashboard,
  onRequestLogin,
  isAuthenticated
}: HeroSectionProps) {
  const { getCustomization } = usePersonalization();

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

  const heroImageUrl = getCustomization('hero-image', 'url', brandConfig.heroImageUrl || '');
  const heroImageOpacity = getCustomization('hero-image', 'opacity', 80);

  const heroImageConfig: EditableElementConfig = {
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
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card text-card-foreground">
      <EditableElement elementConfig={heroImageConfig}>
        {heroImageUrl && (
          <img
            src={heroImageUrl as string}
            alt="Imagen promocional"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: (heroImageOpacity as number) / 100 }}
          />
        )}
      </EditableElement>
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
          <p className="text-sm font-semibold uppercase tracking-wide text-accent" style={heroSubtitleStyle}>
            {displayBusiness.name || brandConfig.platformName}
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
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold max-w-2xl leading-tight" style={heroTitleStyle}>
            {brandConfig.platformName}
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
          <p className="mt-4 max-w-2xl text-base text-muted-foreground" style={heroDescriptionStyle}>
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
              {brandConfig.primaryButtonLabel || 'Ver cupones destacados'}
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
              onClick={isAuthenticated ? onOpenDashboard : onRequestLogin}
            >
              {isAuthenticated
                ? brandConfig.secondaryButtonLabel || 'Personalizar experiencia'
                : 'Ingresar como negocio'}
            </Button>
          </EditableElement>
        </div>
      </div>
    </section>
  );
}
