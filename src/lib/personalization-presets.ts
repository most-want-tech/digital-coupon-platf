export const FONT_FAMILY_OPTIONS = [
  {
    label: 'Sans (Inter)',
    value: 'var(--font-sans, Inter, system-ui, sans-serif)'
  },
  {
    label: 'Serif (Playfair)',
    value: '"Playfair Display", "Times New Roman", serif'
  },
  {
    label: 'Rounded (Quicksand)',
    value: '"Quicksand", "Nunito", sans-serif'
  },
  {
    label: 'Condensada (Oswald)',
    value: '"Oswald", "Arial Narrow", sans-serif'
  },
  {
    label: 'Monoespaciada (Space Mono)',
    value: '"Space Mono", "Roboto Mono", monospace'
  }
] as const;

export const TEXT_DECORATION_OPTIONS = [
  { label: 'Sin decoración', value: 'none' },
  { label: 'Subrayado', value: 'underline' },
  { label: 'Tachado', value: 'line-through' },
  { label: 'Sobrelinea', value: 'overline' }
] as const;

export const LETTER_SPACING_RANGE = {
  min: -2,
  max: 10,
  step: 0.5
} as const;
