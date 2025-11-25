import { Business, Coupon } from './types';

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1',
    name: 'The Artisan Café',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
    category: 'food',
    description: 'Locally roasted coffee and fresh pastries made daily. A cozy spot for morning meetings or afternoon relaxation.',
    address: '123 Main Street, Downtown',
    hours: 'Mon-Fri: 7am-6pm, Sat-Sun: 8am-5pm',
    phone: '(555) 123-4567',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-2',
    name: 'FitZone Gym',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    category: 'services',
    description: 'State-of-the-art fitness center with personal training, group classes, and 24/7 access for members.',
    address: '456 Fitness Ave, North District',
    hours: 'Open 24/7',
    phone: '(555) 234-5678',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-3',
    name: 'Style & Co Boutique',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
    category: 'retail',
    description: 'Curated fashion and accessories for the modern professional. Discover unique pieces you won\'t find anywhere else.',
    address: '789 Fashion Boulevard, Shopping District',
    hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm',
    phone: '(555) 345-6789',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-4',
    name: 'The Reel Cinema',
    logo: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=200&fit=crop',
    category: 'entertainment',
    description: 'Independent cinema featuring the latest blockbusters and classic film screenings. Full concession stand with gourmet options.',
    address: '321 Entertainment Way, Arts District',
    hours: 'Daily: 12pm-11pm (showtimes vary)',
    phone: '(555) 456-7890',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-5',
    name: 'Bella Italia Restaurant',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    category: 'food',
    description: 'Authentic Italian cuisine with family recipes passed down through generations. Fresh pasta made in-house daily.',
    address: '555 Culinary Street, Little Italy',
    hours: 'Tue-Sun: 5pm-10pm, Closed Mondays',
    phone: '(555) 567-8901',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop'
  },
  {
    id: 'biz-6',
    name: 'TechWave Electronics',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop',
    category: 'retail',
    description: 'Latest gadgets, computers, and smart home devices. Expert advice and support for all your technology needs.',
    address: '888 Tech Plaza, Innovation Center',
    hours: 'Mon-Sat: 9am-9pm, Sun: 10am-6pm',
    phone: '(555) 678-9012',
    coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=300&fit=crop'
  }
];

export const mockCoupons: Coupon[] = [
  {
    id: 'coup-1',
    businessId: 'biz-1',
    title: 'Free Coffee with Any Pastry',
    description: 'Start your morning right! Buy any pastry and get a regular coffee absolutely free.',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
    terms: 'Valid for dine-in or takeout. One coupon per customer per visit. Cannot be combined with other offers. Regular sized coffee only.',
    expiryDate: '2025-03-31',
    category: 'food',
    redemptionCode: 'CAFE-FREE-001',
    isNew: true
  },
  {
    id: 'coup-2',
    businessId: 'biz-1',
    title: '20% Off Lunch Combos',
    description: 'Enjoy our signature sandwiches and salads at a special discount during lunch hours.',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop',
    terms: 'Valid Monday-Friday 11am-2pm. Excludes beverages. Dine-in only.',
    expiryDate: '2025-04-15',
    category: 'food',
    redemptionCode: 'CAFE-LUNCH-002'
  },
  {
    id: 'coup-3',
    businessId: 'biz-2',
    title: 'First Month 50% Off',
    description: 'New members save big! Get half off your first month of unlimited gym access.',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    terms: 'New members only. Requires 3-month minimum commitment. Includes all group classes and facility access.',
    expiryDate: '2025-03-25',
    category: 'services',
    redemptionCode: 'FIT-NEW-003',
    isNew: true
  },
  {
    id: 'coup-4',
    businessId: 'biz-2',
    title: 'Free Personal Training Session',
    description: 'Experience the difference a trainer makes. Complimentary 60-minute session with certified trainer.',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=400&fit=crop',
    terms: 'Active members or trial pass holders only. Must be scheduled in advance. One per customer.',
    expiryDate: '2025-04-30',
    category: 'services',
    redemptionCode: 'FIT-TRAIN-004'
  },
  {
    id: 'coup-5',
    businessId: 'biz-3',
    title: 'Buy 2 Get 1 Free - Accessories',
    description: 'Stock up on scarves, jewelry, and bags with this amazing deal.',
    discount: 'BUY 2 GET 1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&h=400&fit=crop',
    terms: 'Free item must be of equal or lesser value. Accessories only, excludes handbags over $50.',
    expiryDate: '2025-03-20',
    category: 'retail',
    redemptionCode: 'STYLE-ACC-005'
  },
  {
    id: 'coup-6',
    businessId: 'biz-3',
    title: '30% Off Spring Collection',
    description: 'Welcome spring with fresh new styles. Save on our entire new season collection.',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    terms: 'Valid on spring collection items only. Cannot be combined with other discounts. While supplies last.',
    expiryDate: '2025-04-10',
    category: 'retail',
    redemptionCode: 'STYLE-SPRING-006',
    isNew: true
  },
  {
    id: 'coup-7',
    businessId: 'biz-4',
    title: '2 for 1 Movie Tickets',
    description: 'Double the fun! Bring a friend and get two tickets for the price of one.',
    discount: '2 FOR 1',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
    terms: 'Valid Monday-Thursday only. Excludes opening weekend for new releases and special events. Based on availability.',
    expiryDate: '2025-04-30',
    category: 'entertainment',
    redemptionCode: 'REEL-MOVIE-007'
  },
  {
    id: 'coup-8',
    businessId: 'biz-4',
    title: 'Free Large Popcorn',
    description: 'Enjoy a complimentary large popcorn with any ticket purchase.',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&h=400&fit=crop',
    terms: 'One per ticket. Cannot be redeemed for other concession items. Valid for in-theater purchases only.',
    expiryDate: '2025-03-28',
    category: 'entertainment',
    redemptionCode: 'REEL-POP-008',
    isNew: true
  },
  {
    id: 'coup-9',
    businessId: 'biz-5',
    title: '25% Off Dinner for Two',
    description: 'Romantic dinner on a budget. Save on your entire meal for two guests.',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&h=400&fit=crop',
    terms: 'Valid Tuesday-Thursday after 5pm. Excludes alcoholic beverages. Maximum discount $50. Reservations recommended.',
    expiryDate: '2025-04-20',
    category: 'food',
    redemptionCode: 'BELLA-DINNER-009'
  },
  {
    id: 'coup-10',
    businessId: 'biz-5',
    title: 'Free Tiramisu with Entree',
    description: 'Indulge in our signature homemade tiramisu - complimentary with any entree.',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop',
    terms: 'Dine-in only. One dessert per entree ordered. Cannot be shared or taken to-go.',
    expiryDate: '2025-03-31',
    category: 'food',
    redemptionCode: 'BELLA-DESSERT-010'
  },
  {
    id: 'coup-11',
    businessId: 'biz-6',
    title: '$100 Off Laptops',
    description: 'Upgrade your tech! Save $100 on any laptop over $500.',
    discount: '$100 OFF',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    terms: 'Minimum purchase $500. Cannot be combined with clearance items. Excludes refurbished models.',
    expiryDate: '2025-04-15',
    category: 'retail',
    redemptionCode: 'TECH-LAPTOP-011',
    isNew: true
  },
  {
    id: 'coup-12',
    businessId: 'biz-6',
    title: 'Free Setup & Installation',
    description: 'Buy any smart home device and get free professional installation included.',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=400&fit=crop',
    terms: 'Valid for smart home devices $200+. Installation within 30 miles of store. Scheduled within 7 days of purchase.',
    expiryDate: '2025-04-30',
    category: 'retail',
    redemptionCode: 'TECH-INSTALL-012'
  }
];
