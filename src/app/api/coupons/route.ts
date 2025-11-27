import { NextRequest, NextResponse } from 'next/server';
import type { RouticketApiResponse } from '@/lib/types';
import { isDemoModeEnabled } from '@/lib/routicket';
import mockCoupons from '@/data/mock-coupons.json';

const ROUTICKET_ENDPOINT = 'https://routicket.com/cuponera/cancun/api_cupones.php';
const CACHE_REVALIDATE_SECONDS = 1800; // 30 minutes

/**
 * Next.js API route for fetching Routicket coupons
 * Supports both demo mode (using mock data) and production mode (calling external API)
 * 
 * Query parameters:
 * - api_public: API public key (required in production mode)
 * - user_id: User ID (optional)
 * - id_partner: Partner ID (optional)
 * - api_secret: API secret key (optional)
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
    const apiPublicKey = searchParams.get('api_public');
    if (!apiPublicKey) {
      return NextResponse.json(
        { error: 'api_public parameter is required in production mode' },
        { status: 400 }
      );
    }

    const url = new URL(ROUTICKET_ENDPOINT);
    url.searchParams.set('api_public', apiPublicKey);

    const userId = searchParams.get('user_id');
    if (userId) {
      url.searchParams.set('user_id', userId);
    }

    const partnerId = searchParams.get('id_partner');
    if (partnerId) {
      url.searchParams.set('id_partner', partnerId);
    }

    const apiSecret = searchParams.get('api_secret');
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
