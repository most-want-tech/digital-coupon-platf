import { BrandConfig } from './types';

export const defaultBrandConfig: BrandConfig = {
  platformName: 'Cupones Digitales',
  primaryColor: 'oklch(0.45 0.15 250)',
  accentColor: 'oklch(0.68 0.19 35)',
};

export function applyBrandColors(config: BrandConfig) {
  const root = document.documentElement;
  
  root.style.setProperty('--primary', config.primaryColor);
  root.style.setProperty('--accent', config.accentColor);
}

export function getBrandConfig(brandConfigs: Record<string, BrandConfig>, businessId?: string): BrandConfig {
  if (businessId && brandConfigs[businessId]) {
    return brandConfigs[businessId];
  }
  return defaultBrandConfig;
}
