import type { RouticketApiResponse } from '@/lib/types';

interface FetchCouponsOptions {
  apiPublicKey: string;
  userId?: number | string;
  partnerId?: number | string;
  apiSecret?: string;
  signal?: AbortSignal;
  useDemoData?: boolean;
}

/**
 * Fetches Routicket coupons through the Next.js API route
 * This function now calls the internal API route instead of the external API directly
 * 
 * Benefits:
 * - Server-side caching and revalidation
 * - Demo mode support for development
 * - Centralized API configuration
 * - Better error handling
 */
/**
 * Determines the base URL for API calls
 * In browser: uses current origin
 * In server: uses NEXT_PUBLIC_BASE_URL or defaults to localhost
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

/**
 * Checks if demo mode is enabled via environment variable
 */
export function isDemoModeEnabled(): boolean {
  return typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_USE_DEMO_DATA === 'true';
}

export async function fetchRouticketCoupons({
  apiPublicKey,
  userId,
  partnerId,
  apiSecret,
  signal,
  useDemoData
}: FetchCouponsOptions): Promise<RouticketApiResponse> {
  // Build URL for Next.js API route
  const url = new URL('/api/coupons', getApiBaseUrl());
  
  // Check if demo mode is enabled via env var or parameter
  const isDemoMode = useDemoData ?? isDemoModeEnabled();
  
  if (isDemoMode) {
    url.searchParams.set('demo', 'true');
  } else {
    url.searchParams.set('api_public', apiPublicKey);
    if (apiSecret) {
      url.searchParams.set('api_secret', apiSecret);
    }
  }
  
  if (userId !== undefined) {
    url.searchParams.set('user_id', String(userId));
  }
  if (partnerId !== undefined) {
    url.searchParams.set('id_partner', String(partnerId));
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Error fetching coupons: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as RouticketApiResponse;
  return data;
}
