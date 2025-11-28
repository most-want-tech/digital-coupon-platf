'use client';

import { Storefront, Tag } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { EditableElement } from '@/components/personalization/EditableElement';
import { PersonalizationModeToggle } from '@/components/personalization/PersonalizationModeToggle';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { buildTextProperties, buildTextStyles } from '@/lib/personalization-text';
import type { BrandConfig } from '@/lib/types';

interface CustomerHeaderProps {
  brandConfig: BrandConfig;
  tagline: string;
  onSwitchToDashboard: () => void;
}

export function CustomerHeader({ brandConfig, tagline, onSwitchToDashboard }: CustomerHeaderProps) {
  const { getCustomization } = usePersonalization();

  const titleConfig = {
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
  } as const;

  const taglineConfig = {
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
  } as const;

  const titleStyle = buildTextStyles(getCustomization, 'header-title', {
    fontSize: 24,
    color: '#111827'
  });

  const taglineStyle = buildTextStyles(getCustomization, 'header-tagline', {
    fontSize: 12,
    color: '#6b7280'
  });

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {brandConfig.logoUrl ? (
            <img
              src={brandConfig.logoUrl}
              alt={brandConfig.platformName}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-primary-foreground" weight="fill" />
            </div>
          )}
          <div>
            <EditableElement elementConfig={titleConfig}>
              <h1 className="text-2xl font-bold tracking-tight" style={titleStyle}>
                {brandConfig.platformName}
              </h1>
            </EditableElement>
            <EditableElement elementConfig={taglineConfig}>
              <p className="text-xs text-muted-foreground" style={taglineStyle}>
                {tagline}
              </p>
            </EditableElement>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PersonalizationModeToggle />
          <Button variant="outline" size="sm" className="gap-2" onClick={onSwitchToDashboard}>
            <Storefront className="w-4 h-4" />
            Business Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
