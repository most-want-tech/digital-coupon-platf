'use client';

import { EditableCouponCard } from '@/components/EditableCouponCard';
import { EditableElement } from '@/components/personalization/EditableElement';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { buildTextProperties, buildTextStyles } from '@/lib/personalization-text';
import type { Business, Coupon } from '@/lib/types';

interface CouponsSectionProps {
  businessName: string;
  fallbackPlatformName: string;
  businessCoupons: Coupon[];
  effectiveBusiness: Business;
  isLoading: boolean;
}

export function CouponsSection({
  businessName,
  fallbackPlatformName,
  businessCoupons,
  effectiveBusiness,
  isLoading
}: CouponsSectionProps) {
  const { getCustomization } = usePersonalization();

  const sectionTitleStyle = buildTextStyles(getCustomization, 'section-title', {
    fontSize: 24,
    color: '#111827'
  });

  const sectionDescriptionStyle = buildTextStyles(getCustomization, 'section-description', {
    fontSize: 16,
    color: '#6b7280'
  });

  const titleConfig = {
    elementId: 'section-title',
    elementLabel: 'Título de sección',
    elementType: 'text',
    category: 'text',
    properties: buildTextProperties(
      getCustomization,
      'section-title',
      { defaultValue: 24, min: 16, max: 48, step: 2 },
      '#111827'
    )
  } as const;

  const descriptionConfig = {
    elementId: 'section-description',
    elementLabel: 'Descripción de sección',
    elementType: 'text',
    category: 'text',
    properties: buildTextProperties(
      getCustomization,
      'section-description',
      { defaultValue: 16, min: 12, max: 24, step: 1 },
      '#6b7280'
    )
  } as const;

  return (
    <section className="space-y-6">
      <div>
        <EditableElement elementConfig={titleConfig}>
          <h3 className="text-2xl font-semibold" style={sectionTitleStyle}>
            {`Promociones de ${businessName || fallbackPlatformName}`}
          </h3>
        </EditableElement>
        <EditableElement elementConfig={descriptionConfig}>
          <p className="text-muted-foreground" style={sectionDescriptionStyle}>
            {'Comparte estas ofertas con tu comunidad y aumenta tus canjes digitales.'}
          </p>
        </EditableElement>
      </div>

      {isLoading ? (
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
  );
}
