import { Business, Coupon } from './types';

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1',
    name: 'Café Artesanal',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
    category: 'food',
    description: 'Café tostado localmente y pasteles frescos hechos diariamente. Un lugar acogedor para reuniones matutinas o relajación por la tarde.',
    address: 'Calle Principal 123, Centro',
    hours: 'Lun-Vie: 7am-6pm, Sab-Dom: 8am-5pm',
    phone: '(555) 123-4567',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-2',
    name: 'Gimnasio FitZone',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    category: 'services',
    description: 'Centro de fitness de última generación con entrenamiento personal, clases grupales y acceso 24/7 para miembros.',
    address: 'Av. Fitness 456, Distrito Norte',
    hours: 'Abierto 24/7',
    phone: '(555) 234-5678',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-3',
    name: 'Boutique Estilo & Co',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
    category: 'retail',
    description: 'Moda y accesorios seleccionados para el profesional moderno. Descubre piezas únicas que no encontrarás en ningún otro lugar.',
    address: 'Bulevar de la Moda 789, Distrito Comercial',
    hours: 'Lun-Sab: 10am-8pm, Dom: 11am-6pm',
    phone: '(555) 345-6789',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-4',
    name: 'Cine The Reel',
    logo: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=200&fit=crop',
    category: 'entertainment',
    description: 'Cine independiente con los últimos éxitos de taquilla y proyecciones de películas clásicas. Puesto de concesión completo con opciones gourmet.',
    address: 'Camino del Entretenimiento 321, Distrito de las Artes',
    hours: 'Diario: 12pm-11pm (horarios varían)',
    phone: '(555) 456-7890',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-5',
    name: 'Restaurante Bella Italia',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    category: 'food',
    description: 'Auténtica cocina italiana con recetas familiares transmitidas de generación en generación. Pasta fresca hecha en casa diariamente.',
    address: 'Calle Culinaria 555, Pequeña Italia',
    hours: 'Mar-Dom: 5pm-10pm, Cerrado los Lunes',
    phone: '(555) 567-8901',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-6',
    name: 'Electrónica TechWave',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop',
    category: 'retail',
    description: 'Últimos gadgets, computadoras y dispositivos para el hogar inteligente. Asesoramiento experto y soporte para todas tus necesidades tecnológicas.',
    address: 'Plaza Tecnológica 888, Centro de Innovación',
    hours: 'Lun-Sab: 9am-9pm, Dom: 10am-6pm',
    phone: '(555) 678-9012',
    coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=300&fit=crop'
  }
];

export const mockCoupons: Coupon[] = [
  {
    id: 'coup-1',
    businessId: 'biz-1',
    title: 'Café Gratis con Cualquier Pastel',
    description: '¡Empieza bien tu mañana! Compra cualquier pastel y obtén un café regular totalmente gratis.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
    terms: 'Válido para comer aquí o llevar. Un cupón por cliente por visita. No acumulable con otras ofertas. Solo café tamaño regular.',
    expiryDate: '2026-03-31',
    category: 'food',
    redemptionCode: 'CAFE-GRATIS-001',
    isNew: true
  },
  {
    id: 'coup-2',
    businessId: 'biz-1',
    title: '20% de Descuento en Combos de Almuerzo',
    description: 'Disfruta de nuestros sándwiches y ensaladas exclusivos con un descuento especial durante el almuerzo.',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop',
    terms: 'Válido de Lunes a Viernes 11am-2pm. Excluye bebidas. Solo para comer aquí.',
    expiryDate: '2026-04-15',
    category: 'food',
    redemptionCode: 'CAFE-ALMUERZO-002'
  },
  {
    id: 'coup-3',
    businessId: 'biz-2',
    title: 'Primer Mes 50% OFF',
    description: '¡Los nuevos miembros ahorran en grande! Obtén la mitad de precio en tu primer mes de acceso ilimitado al gimnasio.',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    terms: 'Solo nuevos miembros. Requiere compromiso mínimo de 3 meses. Incluye todas las clases grupales y acceso a instalaciones.',
    expiryDate: '2026-03-25',
    category: 'services',
    redemptionCode: 'FIT-NUEVO-003',
    isNew: true
  },
  {
    id: 'coup-4',
    businessId: 'biz-2',
    title: 'Sesión de Entrenamiento Personal Gratis',
    description: 'Experimenta la diferencia que hace un entrenador. Sesión complementaria de 60 minutos con entrenador certificado.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=400&fit=crop',
    terms: 'Solo miembros activos o con pase de prueba. Debe programarse con anticipación. Uno por cliente.',
    expiryDate: '2026-04-30',
    category: 'services',
    redemptionCode: 'FIT-ENTRENA-004'
  },
  {
    id: 'coup-5',
    businessId: 'biz-3',
    title: 'Compra 2 Lleva 1 Gratis - Accesorios',
    description: 'Abastécete de bufandas, joyas y bolsos con esta increíble oferta.',
    discount: '2x1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&h=400&fit=crop',
    terms: 'El artículo gratis debe ser de igual o menor valor. Solo accesorios, excluye bolsos de más de $50.',
    expiryDate: '2026-03-20',
    category: 'retail',
    redemptionCode: 'ESTILO-ACC-005'
  },
  {
    id: 'coup-6',
    businessId: 'biz-3',
    title: '30% OFF Colección de Primavera',
    description: 'Da la bienvenida a la primavera con nuevos estilos frescos. Ahorra en toda nuestra colección de nueva temporada.',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    terms: 'Válido solo en artículos de la colección de primavera. No acumulable con otros descuentos. Hasta agotar existencias.',
    expiryDate: '2026-04-10',
    category: 'retail',
    redemptionCode: 'ESTILO-PRIMAVERA-006',
    isNew: true
  },
  {
    id: 'coup-7',
    businessId: 'biz-4',
    title: '2x1 en Entradas de Cine',
    description: '¡Doble diversión! Trae a un amigo y obtén dos entradas por el precio de una.',
    discount: '2x1',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
    terms: 'Válido solo de Lunes a Jueves. Excluye fin de semana de estreno para nuevos lanzamientos y eventos especiales. Sujeto a disponibilidad.',
    expiryDate: '2026-04-30',
    category: 'entertainment',
    redemptionCode: 'CINE-PELI-007'
  },
  {
    id: 'coup-8',
    businessId: 'biz-4',
    title: 'Palomitas Grandes Gratis',
    description: 'Disfruta de unas palomitas grandes de cortesía con cualquier compra de entrada.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&h=400&fit=crop',
    terms: 'Una por entrada. No se puede canjear por otros artículos de concesión. Válido solo para compras en el cine.',
    expiryDate: '2025-12-28',
    category: 'entertainment',
    redemptionCode: 'CINE-PALOMITAS-008',
    isNew: true
  },
  {
    id: 'coup-9',
    businessId: 'biz-5',
    title: '25% OFF Cena para Dos',
    description: 'Cena romántica con presupuesto. Ahorra en toda tu comida para dos invitados.',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&h=400&fit=crop',
    terms: 'Válido Martes-Jueves después de las 5pm. Excluye bebidas alcohólicas. Descuento máximo $50. Se recomienda reservar.',
    expiryDate: '2026-04-20',
    category: 'food',
    redemptionCode: 'BELLA-CENA-009'
  },
  {
    id: 'coup-10',
    businessId: 'biz-5',
    title: 'Tiramisú Gratis con Plato Fuerte',
    description: 'Deléitate con nuestro tiramisú casero exclusivo - cortesía con cualquier plato fuerte.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop',
    terms: 'Solo para comer aquí. Un postre por plato fuerte ordenado. No se puede compartir ni llevar.',
    expiryDate: '2026-03-31',
    category: 'food',
    redemptionCode: 'BELLA-POSTRE-010'
  },
  {
    id: 'coup-11',
    businessId: 'biz-6',
    title: '$100 OFF en Laptops',
    description: '¡Actualiza tu tecnología! Ahorra $100 en cualquier laptop de más de $500.',
    discount: '$100 OFF',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    terms: 'Compra mínima $500. No acumulable con artículos en liquidación. Excluye modelos reacondicionados.',
    expiryDate: '2026-04-15',
    category: 'retail',
    redemptionCode: 'TECH-LAPTOP-011',
    isNew: true
  },
  {
    id: 'coup-12',
    businessId: 'biz-6',
    title: 'Configuración e Instalación Gratis',
    description: 'Compra cualquier dispositivo de hogar inteligente y obtén instalación profesional gratis incluida.',
    discount: 'GRATIS',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=400&fit=crop',
    terms: 'Válido para dispositivos de hogar inteligente de $200+. Instalación dentro de 30 millas de la tienda. Programado dentro de 7 días de la compra.',
    expiryDate: '2026-04-30',
    category: 'retail',
    redemptionCode: 'TECH-INSTAL-012'
  }
];
