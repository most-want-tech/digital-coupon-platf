import { useCallback, useEffect, useState } from 'react';
import type { BrandConfig } from '@/lib/types';

const STORAGE_KEY = 'brand-configs';

const parseStoredValue = (value: string | null) => {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as Record<string, BrandConfig>;
  } catch {
    return undefined;
  }
};

export function useBrandConfigs(initial: Record<string, BrandConfig> = {}) {
  const [config, setConfig] = useState<Record<string, BrandConfig>>(initial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    async function loadConfigs() {
      try {
        const response = await fetch('/api/brand-configs');
        if (response.ok) {
          const data = await response.json();
          if (data.configs && Object.keys(data.configs).length > 0) {
            setConfig(data.configs);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load brand configs from server:', error);
      }
      
      const stored = parseStoredValue(window.localStorage.getItem(STORAGE_KEY));
      if (stored) {
        setConfig(stored);
      }
    }
    
    loadConfigs();
  }, []);

  const updateConfig = useCallback(
    (
      next:
        | Record<string, BrandConfig>
        | ((prev: Record<string, BrandConfig>) => Record<string, BrandConfig>)
    ) => {
      setConfig((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: Record<string, BrandConfig>) => Record<string, BrandConfig>)(prev) : next;
        
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
          } catch {
            // Ignore storage quota errors in private browsing modes.
          }
          
          fetch('/api/brand-configs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ configs: resolved })
          }).catch((error) => {
            console.error('Failed to save brand configs to server:', error);
          });
        }
        
        return resolved;
      });
    },
    []
  );

  return [config, updateConfig] as const;
}
