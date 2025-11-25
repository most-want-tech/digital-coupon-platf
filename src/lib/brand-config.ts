import { BrandConfig } from './types';

export const defaultBrandConfig: BrandConfig = {
  platformName: 'Cupones Digitales',
  primaryColor: 'oklch(0.45 0.15 250)',
  accentColor: 'oklch(0.68 0.19 35)',
  tagline: 'Descubre ofertas locales personalizadas para tu comunidad.',
  backgroundColor: '#f7f7fb',
  heroImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop'
};

export function applyBrandColors(config: BrandConfig) {
  const root = document.documentElement;
  
  root.style.setProperty('--primary', config.primaryColor);
  root.style.setProperty('--accent', config.accentColor);
  if (config.backgroundColor) {
    root.style.setProperty('--brand-background', config.backgroundColor);
  } else {
    root.style.removeProperty('--brand-background');
  }
}

export function getBrandConfig(brandConfigs: Record<string, BrandConfig>, businessId?: string): BrandConfig {
  if (businessId && brandConfigs[businessId]) {
    return brandConfigs[businessId];
  }
  return defaultBrandConfig;
}
