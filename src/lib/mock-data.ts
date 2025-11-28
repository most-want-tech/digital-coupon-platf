import type { Business, Coupon } from './types';

export const mockBusiness: Business = {
  id: 'mock-business-1',
  name: 'CaféHub Premium',
  logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
  category: 'food',
  description: 'Tu cafetería de confianza con las mejores promociones',
  address: 'Calle Principal 123, Centro',
  hours: 'Lun-Vie: 8am-8pm, Sáb-Dom: 9am-6pm',
  phone: '(555) 123-4567',
  coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
  email: 'contacto@cafehub.com',
  website: 'https://cafehub.com'
};

const getExpiryDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const mockCoupons: Coupon[] = [
  {
    id: 'mock-coupon-1',
    businessId: mockBusiness.id,
    title: '2x1 en Café Americano',
    description: 'Disfruta de dos cafés americanos por el precio de uno. Válido de lunes a viernes.',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    terms: 'Válido solo en horario de 8am a 12pm. No acumulable con otras promociones.',
    expiryDate: getExpiryDate(15),
    category: 'food',
    redemptionCode: 'CAFE2X1',
    isNew: true,
    isActive: true,
    maxRedemptions: 100,
    currentRedemptions: 23,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-coupon-2',
    businessId: mockBusiness.id,
    title: 'Descuento en Repostería',
    description: '30% de descuento en toda nuestra selección de pasteles, galletas y postres artesanales.',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    terms: 'Válido en compras mayores a $500. Aplicable a toda la repostería del día.',
    expiryDate: getExpiryDate(7),
    category: 'food',
    redemptionCode: 'SWEET30',
    isNew: false,
    isActive: true,
    maxRedemptions: 50,
    currentRedemptions: 45,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-coupon-3',
    businessId: mockBusiness.id,
    title: 'Café Gratis con Desayuno',
    description: 'Obtén un café gratis al ordenar cualquier desayuno completo de nuestro menú.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop',
    terms: 'Válido solo en consumo en tienda. Desayuno mínimo $300.',
    expiryDate: getExpiryDate(30),
    category: 'food',
    redemptionCode: 'BREAKFAST',
    isNew: true,
    isActive: true,
    maxRedemptions: 200,
    currentRedemptions: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-coupon-4',
    businessId: mockBusiness.id,
    title: 'Combo Merienda',
    description: 'Café + Sándwich + Postre por solo $199. La combinación perfecta para tu tarde.',
    discount: '$199',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    terms: 'Válido de 3pm a 6pm todos los días. Sándwiches y postres del día.',
    expiryDate: getExpiryDate(20),
    category: 'food',
    redemptionCode: 'COMBO199',
    isNew: false,
    isActive: true,
    maxRedemptions: 150,
    currentRedemptions: 87,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-coupon-5',
    businessId: mockBusiness.id,
    title: 'Happy Hour Café',
    description: '40% de descuento en todas las bebidas calientes durante nuestro happy hour.',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
    terms: 'Válido de 4pm a 6pm. Incluye cafés, tés y chocolates calientes.',
    expiryDate: getExpiryDate(4),
    category: 'food',
    redemptionCode: 'HAPPY40',
    isNew: false,
    isActive: true,
    maxRedemptions: 80,
    currentRedemptions: 62,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-coupon-6',
    businessId: mockBusiness.id,
    title: 'Tarjeta de Lealtad',
    description: 'Acumula 10 sellos y obtén tu bebida favorita completamente gratis.',
    discount: '10+1 GRATIS',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
    terms: 'Aplicable a cualquier bebida del menú. Un sello por compra mayor a $80.',
    expiryDate: getExpiryDate(60),
    category: 'food',
    redemptionCode: 'LOYALTY',
    isNew: true,
    isActive: true,
    maxRedemptions: 100,
    currentRedemptions: 5,
    createdAt: new Date().toISOString()
  }
];
