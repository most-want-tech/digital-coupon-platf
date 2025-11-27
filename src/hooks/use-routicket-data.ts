import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchRouticketCoupons } from '@/lib/routicket';
import type { RouticketApiResponse } from '@/lib/types';

interface UseRouticketDataOptions {
  apiPublicKey: string;
  apiSecret?: string;
  userId?: number | string;
  partnerId?: number | string;
  useDemoData?: boolean;
}

interface UseRouticketDataResult {
  data: RouticketApiResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  partnerCoupons: RouticketApiResponse['cupones'];
}

export function useRouticketData(options: UseRouticketDataOptions): UseRouticketDataResult {
  const { apiPublicKey, apiSecret, userId, partnerId, useDemoData } = options;
  const [data, setData] = useState<RouticketApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const response = await fetchRouticketCoupons({
          apiPublicKey,
          apiSecret,
          userId,
          partnerId,
          signal,
          useDemoData
        });
        setData(response);
        setError(null);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        setError((err as Error).message || 'No fue posible obtener la información de Routicket.');
      } finally {
        if (!signal || !signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [apiPublicKey, apiSecret, userId, partnerId, useDemoData]
  );

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const refresh = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    load(controller.signal);
  }, [load]);

  const partnerCoupons = useMemo(() => {
    if (!data) return [];
    if (partnerId === undefined || partnerId === null) {
      return data.cupones;
    }
    return data.cupones.filter((coupon) => Number(coupon.id_partner) === Number(partnerId));
  }, [data, partnerId]);

  return {
    data,
    isLoading,
    error,
    refresh,
    partnerCoupons
  };
}
