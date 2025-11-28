'use client';

import type { CSSProperties } from 'react';
import { CouponCard } from './CouponCard';
import { EditableElement } from './personalization/EditableElement';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import type { Coupon, Business } from '@/lib/types';
import type { EditableElementConfig } from '@/lib/personalization-types';
import { LETTER_SPACING_RANGE } from '@/lib/personalization-presets';
import {
  DEFAULT_FONT_FAMILY,
  FONT_FAMILY_SELECT_OPTIONS,
  TEXT_DECORATION_SELECT_OPTIONS
} from '@/lib/personalization-text';

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
        id: 'titleColor',
        label: 'Color título',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'titleColor', '')
      },
      {
        id: 'titleFontFamily',
        label: 'Tipografía título',
        type: 'select',
        value: getCustomization(`coupon-${coupon.id}`, 'titleFontFamily', DEFAULT_FONT_FAMILY),
        options: FONT_FAMILY_SELECT_OPTIONS
      },
      {
        id: 'titleLetterSpacing',
        label: 'Espaciado título',
        type: 'number',
        value: getCustomization(`coupon-${coupon.id}`, 'titleLetterSpacing', 0),
        min: LETTER_SPACING_RANGE.min,
        max: LETTER_SPACING_RANGE.max,
        step: LETTER_SPACING_RANGE.step,
        unit: 'px'
      },
      {
        id: 'titleBackground',
        label: 'Fondo título',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'titleBackground', '')
      },
      {
        id: 'titleDecoration',
        label: 'Decoración título',
        type: 'select',
        value: getCustomization(`coupon-${coupon.id}`, 'titleDecoration', 'none'),
        options: TEXT_DECORATION_SELECT_OPTIONS
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
      },
      {
        id: 'descriptionColor',
        label: 'Color descripción',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionColor', '')
      },
      {
        id: 'descriptionFontFamily',
        label: 'Tipografía descripción',
        type: 'select',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionFontFamily', DEFAULT_FONT_FAMILY),
        options: FONT_FAMILY_SELECT_OPTIONS
      },
      {
        id: 'descriptionLetterSpacing',
        label: 'Espaciado descripción',
        type: 'number',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionLetterSpacing', 0),
        min: LETTER_SPACING_RANGE.min,
        max: LETTER_SPACING_RANGE.max,
        step: LETTER_SPACING_RANGE.step,
        unit: 'px'
      },
      {
        id: 'descriptionBackground',
        label: 'Fondo descripción',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionBackground', '')
      },
      {
        id: 'descriptionDecoration',
        label: 'Decoración descripción',
        type: 'select',
        value: getCustomization(`coupon-${coupon.id}`, 'descriptionDecoration', 'none'),
        options: TEXT_DECORATION_SELECT_OPTIONS
      },
      {
        id: 'discountFontSize',
        label: 'Tamaño descuento',
        type: 'fontSize',
        value: getCustomization(`coupon-${coupon.id}`, 'discountFontSize', 14),
        min: 12,
        max: 20,
        step: 1,
        unit: 'px'
      },
      {
        id: 'discountColor',
        label: 'Color texto descuento',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'discountColor', '')
      },
      {
        id: 'discountBackground',
        label: 'Fondo etiqueta descuento',
        type: 'color',
        value: getCustomization(`coupon-${coupon.id}`, 'discountBackground', '')
      }
    ]
  };

  const couponKey = `coupon-${coupon.id}`;

  const customizedCoupon: Coupon = {
    ...coupon,
    image: getCustomization(couponKey, 'image', coupon.image) as string
  };

  const borderRadius = getCustomization(couponKey, 'borderRadius', 12) as number;
  const titleFontSize = getCustomization(couponKey, 'titleFontSize', 18) as number;
  const titleColor = getCustomization(couponKey, 'titleColor', '') as string;
  const titleFontFamily = getCustomization(couponKey, 'titleFontFamily', DEFAULT_FONT_FAMILY) as string;
  const titleLetterSpacing = getCustomization(couponKey, 'titleLetterSpacing', 0) as number;
  const titleBackground = getCustomization(couponKey, 'titleBackground', '') as string;
  const titleDecoration = getCustomization(couponKey, 'titleDecoration', 'none') as string;

  const descriptionFontSize = getCustomization(couponKey, 'descriptionFontSize', 14) as number;
  const descriptionColor = getCustomization(couponKey, 'descriptionColor', '') as string;
  const descriptionFontFamily = getCustomization(
    couponKey,
    'descriptionFontFamily',
    DEFAULT_FONT_FAMILY
  ) as string;
  const descriptionLetterSpacing = getCustomization(
    couponKey,
    'descriptionLetterSpacing',
    0
  ) as number;
  const descriptionBackground = getCustomization(couponKey, 'descriptionBackground', '') as string;
  const descriptionDecoration = getCustomization(
    couponKey,
    'descriptionDecoration',
    'none'
  ) as string;

  const discountFontSize = getCustomization(couponKey, 'discountFontSize', 14) as number;
  const discountColor = getCustomization(couponKey, 'discountColor', '') as string;
  const discountBackground = getCustomization(couponKey, 'discountBackground', '') as string;

  const cardStyles: CSSProperties = {
    borderRadius: `${borderRadius}px`,
    ['--coupon-title-font-size' as string]: `${titleFontSize}px`,
    ['--coupon-description-font-size' as string]: `${descriptionFontSize}px`,
    ['--coupon-discount-font-size' as string]: `${discountFontSize}px`,
    ['--coupon-title-letter-spacing' as string]: `${titleLetterSpacing}px`,
    ['--coupon-description-letter-spacing' as string]: `${descriptionLetterSpacing}px`,
    ['--coupon-title-decoration' as string]: titleDecoration,
    ['--coupon-description-decoration' as string]: descriptionDecoration,
    ['--coupon-title-font-family' as string]: titleFontFamily,
    ['--coupon-description-font-family' as string]: descriptionFontFamily
  };

  if (titleColor) {
    cardStyles['--coupon-title-color' as string] = titleColor;
  }

  if (titleBackground) {
    cardStyles['--coupon-title-background' as string] = titleBackground;
    cardStyles['--coupon-title-background-padding' as string] = '0.1em 0.35em';
    cardStyles['--coupon-title-background-radius' as string] = '0.35rem';
  }

  if (descriptionColor) {
    cardStyles['--coupon-description-color' as string] = descriptionColor;
  }

  if (descriptionBackground) {
    cardStyles['--coupon-description-background' as string] = descriptionBackground;
    cardStyles['--coupon-description-background-padding' as string] = '0.05em 0.25em';
    cardStyles['--coupon-description-background-radius' as string] = '0.35rem';
  }

  if (discountColor) {
    cardStyles['--coupon-discount-color' as string] = discountColor;
  }

  if (discountBackground) {
    cardStyles['--coupon-discount-background' as string] = discountBackground;
  }

  return (
    <EditableElement elementConfig={couponConfig}>
      <div style={cardStyles}>
        <CouponCard
          coupon={customizedCoupon}
          business={business}
          showActions={showActions}
        />
      </div>
    </EditableElement>
  );
}
