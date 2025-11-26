import type { RouticketApiResponse } from '@/lib/types';

const ROUTICKET_ENDPOINT = 'https://routicket.com/cuponera/cancun/api_cupones.php';

interface FetchCouponsOptions {
  apiPublicKey: string;
  userId: number | string;
  signal?: AbortSignal;
}

export async function fetchRouticketCoupons({
  apiPublicKey,
  userId,
  signal
}: FetchCouponsOptions): Promise<RouticketApiResponse> {
  const url = new URL(ROUTICKET_ENDPOINT);
  url.searchParams.set('api_public', apiPublicKey);
  url.searchParams.set('user_id', String(userId));

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal
  });

  if (!response.ok) {
    throw new Error(`Error fetching coupons: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as RouticketApiResponse;
  return data;
}
