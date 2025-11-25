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
}

export interface RedemptionHistory {
  couponId: string;
  redeemedAt: string;
}
