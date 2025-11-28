'use client';

import { CouponCard } from './CouponCard';
import { EditableElement } from './personalization/EditableElement';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import type { Coupon, Business } from '@/lib/types';
import type { EditableElementConfig } from '@/lib/personalization-types';

interface EditableCouponCardProps {
  coupon: Coupon;
  business: Business;
  showActions?: boolean;
}

export function EditableCouponCard({ coupon, business, showActions = false }: EditableCouponCardProps) {
  const { getCustomization } = usePersonalization();

  const couponConfig: EditableElementConfig = {
    elementId: `coupon-${coupon.id}`,
    elementLabel: `Cupón: ${coupon.title}`,
    elementType: 'coupon-card',
    category: 'coupon',
    properties: [
      {
        id: 'title',
        label: 'Título del cupón',
        type: 'text',
        value: getCustomization(`coupon-${coupon.id}`, 'title', coupon.title)
      },
      {
        id: 'description',
        label: 'Descripción',
        type: 'text',
        value: getCustomization(`coupon-${coupon.id}`, 'description', coupon.description)
      },
      {
        id: 'discount',
        label: 'Etiqueta de descuento',
        type: 'text',
        value: getCustomization(`coupon-${coupon.id}`, 'discount', coupon.discount)
      },
      {
        id: 'image',
        label: 'Imagen del cupón',
        type: 'image',
        value: getCustomization(`coupon-${coupon.id}`, 'image', coupon.image)
      },
      {
        id: 'borderRadius',
        label: 'Redondez de bordes',
        type: 'borderRadius',
        value: getCustomization(`coupon-${coupon.id}`, 'borderRadius', 12),
        min: 0,
        max: 24,
        step: 2,
        unit: 'px'
      },
      {
        id: 'titleFontSize',
        label: 'Tamaño título',
        type: 'fontSize',
        value: getCustomization(`coupon-${coupon.id}`, 'titleFontSize', 18),
        min: 14,
        max: 28,
        step: 1,
        unit: 'px'
      },
      {
        id: 'descriptionFontSize',
        label: 'Tamaño descripción',
        type: 'fontSize',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionFontSize', 14),
        min: 12,
        max: 18,
        step: 1,
        unit: 'px'
      }
    ]
  };

  // Apply customizations to coupon
  const customizedCoupon: Coupon = {
    ...coupon,
    title: getCustomization(`coupon-${coupon.id}`, 'title', coupon.title) as string,
    description: getCustomization(`coupon-${coupon.id}`, 'description', coupon.description) as string,
    discount: getCustomization(`coupon-${coupon.id}`, 'discount', coupon.discount) as string,
    image: getCustomization(`coupon-${coupon.id}`, 'image', coupon.image) as string
  };

  const borderRadius = getCustomization(`coupon-${coupon.id}`, 'borderRadius', 12) as number;
  const titleFontSize = getCustomization(`coupon-${coupon.id}`, 'titleFontSize', 18) as number;
  const descriptionFontSize = getCustomization(`coupon-${coupon.id}`, 'descriptionFontSize', 14) as number;

  return (
    <EditableElement elementConfig={couponConfig}>
      <div
        style={{
          borderRadius: `${borderRadius}px`,
          // Pass custom styles to children via CSS variables
          ['--title-font-size' as string]: `${titleFontSize}px`,
          ['--description-font-size' as string]: `${descriptionFontSize}px`
        }}
      >
        <CouponCard
          coupon={customizedCoupon}
          business={business}
          showActions={showActions}
        />
      </div>
    </EditableElement>
  );
}
