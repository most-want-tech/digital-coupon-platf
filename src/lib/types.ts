export type CategoryType = 'all' | 'food' | 'retail' | 'services' | 'entertainment';

export interface Business {
  id: string;
  name: string;
  logo: string;
  category: Exclude<CategoryType, 'all'>;
  description: string;
  address: string;
  hours: string;
  phone: string;
  coverImage: string;
  email?: string;
  website?: string;
  ownerId?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface Coupon {
  id: string;
  businessId: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  terms: string;
  expiryDate: string;
  category: Exclude<CategoryType, 'all'>;
  redemptionCode: string;
  isNew?: boolean;
  isActive?: boolean;
  maxRedemptions?: number;
  currentRedemptions?: number;
  createdAt?: string;
}

export interface RedemptionHistory {
  couponId: string;
  redeemedAt: string;
  businessId?: string;
}

export interface AnalyticsData {
  totalRedemptions: number;
  totalViews: number;
  activeCoupons: number;
  savedCount: number;
  redemptionsByDate: { date: string; count: number }[];
  redemptionsByCategory: { category: string; count: number }[];
  topCoupons: { couponId: string; couponTitle: string; count: number }[];
}

export interface BusinessUser {
  id: string;
  businessId: string;
  email: string;
  role: 'owner' | 'admin' | 'staff';
}

export interface BrandConfig {
  platformName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  businessId?: string;
}
