import { NextRequest, NextResponse } from 'next/server';
import type { RouticketApiResponse } from '@/lib/types';
import { isDemoModeEnabled } from '@/lib/routicket';
import mockCoupons from '@/data/mock-coupons.json';

const ROUTICKET_ENDPOINT =
  process.env.NEXT_PUBLIC_ROUTICKET_ENDPOINT || 'https://routicket.com/cuponera/cancun/api_cupones.php';
const ROUTICKET_API_PUBLIC_KEY = process.env.NEXT_PUBLIC_API_PUBLIC_KEY;
const ROUTICKET_API_SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY;
const ROUTICKET_PARTNER_ID = process.env.NEXT_PUBLIC_PARTNER_ID;
const ROUTICKET_USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const CACHE_REVALIDATE_SECONDS = 1800; // 30 minutes

function resolveConfigValue(
  envValue: string | undefined,
  paramValue: string | null
): string | undefined {
  return envValue ?? (paramValue ?? undefined);
}

/**
 * Next.js API route for fetching Routicket coupons
 * Supports both demo mode (using mock data) and production mode (calling external API)
 *
 * Configuration:
 * - Uses NEXT_PUBLIC_API_PUBLIC_KEY / SECRET / USER_ID / PARTNER_ID env vars by default
 * - Query parameters can override env values when testing manually
 * - demo: Set to 'true' to use mock data instead of external API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isDemoMode = searchParams.get('demo') === 'true' || isDemoModeEnabled();

    // If demo mode is enabled, return mock data
    if (isDemoMode) {
      // Filter by partner_id if provided in demo mode
      const partnerId = searchParams.get('id_partner');
      if (partnerId) {
        const filteredCoupons = (mockCoupons as RouticketApiResponse).cupones.filter(
          (coupon) => coupon.id_partner === Number(partnerId)
        );
        return NextResponse.json({
          ...mockCoupons,
          cupones: filteredCoupons,
          api_usage: {
            ...mockCoupons.api_usage,
            note: `Datos de demostración filtrados por partner ${partnerId}`
          }
        } as RouticketApiResponse);
      }
      
      return NextResponse.json(mockCoupons as RouticketApiResponse);
    }

    // Production mode - fetch from external API
    const apiPublicKey = resolveConfigValue(ROUTICKET_API_PUBLIC_KEY, searchParams.get('api_public'));
    if (!apiPublicKey) {
      return NextResponse.json(
        {
          error: 'Routicket API public key is not configured. Set NEXT_PUBLIC_API_PUBLIC_KEY or pass api_public in the request.'
        },
        { status: 500 }
      );
    }

    const url = new URL(ROUTICKET_ENDPOINT);
    url.searchParams.set('api_public', apiPublicKey);

    const userId = resolveConfigValue(ROUTICKET_USER_ID, searchParams.get('user_id'));
    if (userId) {
      url.searchParams.set('user_id', userId);
    }

    const partnerId = resolveConfigValue(ROUTICKET_PARTNER_ID, searchParams.get('id_partner'));
    if (partnerId) {
      url.searchParams.set('id_partner', partnerId);
    }

    const apiSecret = resolveConfigValue(ROUTICKET_API_SECRET_KEY, searchParams.get('api_secret'));
    if (apiSecret) {
      url.searchParams.set('api_secret', apiSecret);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      // Add cache control for production - revalidate every 30 minutes
      next: { revalidate: CACHE_REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json() as RouticketApiResponse;
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in coupons API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons', message: (error as Error).message },
      { status: 500 }
    );
  }
}
