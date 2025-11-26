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
  tagline?: string;
  backgroundColor?: string;
  heroImageUrl?: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
}

export interface RouticketCoupon {
  id: number;
  titulo: string;
  condiciones: string;
  fecha_inicio: string;
  fecha_final: string;
  tipo: string;
  usado: number;
  status: number;
  id_empresa: number;
  id_partner: number;
  foto: string;
  fecha_create: string;
  mg: number;
  comentarios: number;
  descripcion: string;
  vistosx: number;
  scan: number;
  url_tienda: string;
  text: string;
  fecha: string;
  hora: number;
  link: string;
  foto_post: string;
  code: string | number;
}

export interface RouticketApiUsage {
  api_public: string;
  owner_id: number;
  contador_prev: number;
  contador: number;
  note: string;
}

export interface RouticketStatsTotals {
  usado: number;
  scan: number;
  vistosx: number;
  mg: number;
  comentarios: number;
}

export interface RouticketStatsAverages {
  usado: number;
  scan: number;
  vistosx: number;
  mg: number;
  comentarios: number;
}

export interface RouticketStatsDates {
  min_fecha_inicio: string;
  max_fecha_final: string;
  min_fecha_create: string;
  max_fecha_create: string;
}

export interface RouticketStatsTopEntry {
  id: number;
  titulo: string;
  usado: number;
  scan: number;
  vistosx: number;
  mg: number;
}

export interface RouticketStatsTop {
  most_used: RouticketStatsTopEntry;
  least_used: RouticketStatsTopEntry;
  most_scanned: RouticketStatsTopEntry;
  least_scanned: RouticketStatsTopEntry;
  most_viewed: RouticketStatsTopEntry;
  least_viewed: RouticketStatsTopEntry;
  most_mg: RouticketStatsTopEntry;
  least_mg: RouticketStatsTopEntry;
}

export interface RouticketStats {
  records: number;
  data_bytes: number;
  data_kb: number;
  totals: RouticketStatsTotals;
  averages: RouticketStatsAverages;
  by_tipo: Record<string, number>;
  by_status: Record<string, number>;
  dates: RouticketStatsDates;
  top: RouticketStatsTop;
}

export interface RouticketApiResponse {
  api_usage: RouticketApiUsage;
  stats: RouticketStats;
  cupones: RouticketCoupon[];
}
