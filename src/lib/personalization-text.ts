import type { CSSProperties } from 'react';
import type { EditableElementConfig, PropertyValue } from '@/lib/personalization-types';
import {
  FONT_FAMILY_OPTIONS,
  LETTER_SPACING_RANGE,
  TEXT_DECORATION_OPTIONS
} from '@/lib/personalization-presets';

export type GetCustomizationFn = <T extends PropertyValue>(
  elementId: string,
  propertyId: string,
  defaultValue: T
) => T;

export interface FontConfig {
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
}

export interface TextStyleDefaults {
  fontSize: number;
  color?: string;
  fontFamily?: string;
  letterSpacing?: number;
  backgroundColor?: string;
  textDecoration?: string;
}

export interface TextStyleOptions {
  highlightBackground?: boolean;
  backgroundPadding?: string;
  backgroundRadius?: string;
}

export const DEFAULT_FONT_FAMILY =
  FONT_FAMILY_OPTIONS[0]?.value || 'var(--font-sans, Inter, system-ui, sans-serif)';

export const FONT_FAMILY_SELECT_OPTIONS = FONT_FAMILY_OPTIONS.map((option) => ({
  label: option.label,
  value: option.value
}));

export const TEXT_DECORATION_SELECT_OPTIONS = TEXT_DECORATION_OPTIONS.map((option) => ({
  label: option.label,
  value: option.value
}));

export function buildTextProperties(
  getCustomization: GetCustomizationFn,
  elementId: string,
  fontConfig: FontConfig,
  colorDefault = ''
): EditableElementConfig['properties'] {
  const { defaultValue, min, max, step = 1 } = fontConfig;

  return [
    {
      id: 'fontSize',
      label: 'Tamaño de fuente',
      type: 'fontSize',
      value: getCustomization(elementId, 'fontSize', defaultValue),
      min,
      max,
      step,
      unit: 'px'
    },
    {
      id: 'color',
      label: 'Color del texto',
      type: 'color',
      value: getCustomization(elementId, 'color', colorDefault)
    },
    {
      id: 'fontFamily',
      label: 'Tipografía',
      type: 'select',
      value: getCustomization(elementId, 'fontFamily', DEFAULT_FONT_FAMILY),
      options: FONT_FAMILY_SELECT_OPTIONS
    },
    {
      id: 'letterSpacing',
      label: 'Espaciado entre letras',
      type: 'number',
      value: getCustomization(elementId, 'letterSpacing', 0),
      min: LETTER_SPACING_RANGE.min,
      max: LETTER_SPACING_RANGE.max,
      step: LETTER_SPACING_RANGE.step,
      unit: 'px'
    },
    {
      id: 'backgroundColor',
      label: 'Fondo del texto',
      type: 'color',
      value: getCustomization(elementId, 'backgroundColor', '')
    },
    {
      id: 'textDecoration',
      label: 'Decoración del texto',
      type: 'select',
      value: getCustomization(elementId, 'textDecoration', 'none'),
      options: TEXT_DECORATION_SELECT_OPTIONS
    }
  ];
}

export function buildTextStyles(
  getCustomization: GetCustomizationFn,
  elementId: string,
  defaults: TextStyleDefaults,
  options: TextStyleOptions = {}
): CSSProperties {
  const { highlightBackground = true, backgroundPadding, backgroundRadius } = options;

  const fontSize = getCustomization(elementId, 'fontSize', defaults.fontSize) as number;
  const color = getCustomization(elementId, 'color', defaults.color ?? '') as string;
  const fontFamily = getCustomization(
    elementId,
    'fontFamily',
    defaults.fontFamily ?? DEFAULT_FONT_FAMILY
  ) as string;
  const letterSpacing = getCustomization(
    elementId,
    'letterSpacing',
    defaults.letterSpacing ?? 0
  ) as number;
  const backgroundColor = getCustomization(
    elementId,
    'backgroundColor',
    defaults.backgroundColor ?? ''
  ) as string;
  const textDecoration = getCustomization(
    elementId,
    'textDecoration',
    defaults.textDecoration ?? 'none'
  ) as string;

  const style: CSSProperties = {
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}px`,
    textDecoration
  };

  if (color) {
    style.color = color;
  }

  if (fontFamily) {
    style.fontFamily = fontFamily;
  }

  if (backgroundColor && backgroundColor !== 'transparent') {
    style.backgroundColor = backgroundColor;

    if (highlightBackground) {
      style.display = 'inline-block';
      style.padding = backgroundPadding ?? '0.1em 0.35em';
      style.borderRadius = backgroundRadius ?? '0.45rem';
    }
  }

  return style;
}
