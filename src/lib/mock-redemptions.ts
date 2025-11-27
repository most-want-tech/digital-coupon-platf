import { RedemptionHistory } from './types';
import { subDays, subHours } from 'date-fns';
import { mockCoupons } from './mock-data';

/**
 * Generate realistic mock redemption data for demos
 * Spread across the last 30 days with varied patterns
 */
export function generateMockRedemptions(): RedemptionHistory[] {
  const redemptions: RedemptionHistory[] = [];
  const now = new Date();
  
  // Generate redemptions for each coupon with realistic patterns
  mockCoupons.forEach((coupon, couponIndex) => {
    // Different coupons get different redemption counts (5-25 per coupon)
    const baseRedemptionCount = 5 + (couponIndex % 20);
    
    for (let i = 0; i < baseRedemptionCount; i++) {
      // Random day in the last 30 days, weighted towards more recent
      const daysAgo = Math.floor(Math.random() * Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      let redemptionDate = subDays(now, daysAgo);
      redemptionDate = subHours(redemptionDate, hoursAgo);
      
      redemptions.push({
        couponId: coupon.id,
        businessId: coupon.businessId,
        redeemedAt: redemptionDate.toISOString()
      });
    }
  });
  
  // Sort by date (most recent first)
  redemptions.sort((a, b) => 
    new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
  );
  
  return redemptions;
}

// Generate mock data once
export const mockRedemptions = generateMockRedemptions();
