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
    const stored = parseStoredValue(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setConfig(stored);
    }
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
        }
        return resolved;
      });
    },
    []
  );

  return [config, updateConfig] as const;
}
