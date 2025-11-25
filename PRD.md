# Planning Guide

A white-label digital coupon book platform that enables local businesses to offer modern, mobile-friendly coupons to customers, replacing traditional paper coupon books with an elegant digital experience.

**Experience Qualities**:
1. **Professional** - The platform must inspire confidence in business owners that this is a legitimate, high-quality SaaS solution they can trust with their brand.
2. **Accessible** - Customers should instantly understand how to browse and redeem coupons without instruction, with clear visual hierarchy guiding them through the experience.
3. **Customizable** - The white-label nature should be immediately apparent, demonstrating how easily it adapts to any business's brand identity.

**Complexity Level**: Light Application (multiple features with basic state)
  - The demo showcases core coupon browsing, filtering, and redemption flows with persistent favorites and redemption tracking. Now includes a comprehensive business dashboard for managing coupons, viewing analytics, and customizing branding, but doesn't require user accounts or complex backend logic at this stage.

## Essential Features

### Coupon Browsing & Discovery
- **Functionality**: Display grid/list of available coupons from local businesses with category filtering
- **Purpose**: Allow customers to quickly scan available offers and find relevant deals
- **Trigger**: Landing on the main page or selecting a category filter
- **Progression**: View all coupons → Filter by category (optional) → See coupon details → Decide to save or redeem
- **Success criteria**: Users can see all coupons at a glance, filter works instantly, images load quickly

### Coupon Detail & Redemption
- **Functionality**: Show full coupon details, terms, and generate redemption code/barcode
- **Purpose**: Provide all information needed to use the coupon and create a redemption mechanism
- **Trigger**: Clicking on a coupon card
- **Progression**: Click coupon → View full details & terms → Click "Redeem Now" → See redemption code/QR → Show to business → Mark as used
- **Success criteria**: Clear redemption flow, code is easily visible, terms are readable

### Favorites & Saved Coupons
- **Functionality**: Allow users to save coupons for quick access later
- **Purpose**: Enable customers to bookmark deals they want to use in the future
- **Trigger**: Clicking heart/save icon on any coupon
- **Progression**: Click save icon → Coupon marked as favorite → Access from "Saved" filter → Remove when no longer needed
- **Success criteria**: Favorites persist between sessions, easy to add/remove, clear visual indication

### Category Filtering
- **Functionality**: Filter coupons by business type (Food & Dining, Retail, Services, Entertainment)
- **Trigger**: Selecting a category chip/button
- **Progression**: Click category → View filtered results → Click "All" to reset
- **Success criteria**: Instant filtering, clear active state, accurate results

### Business Profile View
- **Functionality**: Display business information, location, hours, and all their active coupons
- **Purpose**: Help customers learn about the business and see all available offers
- **Trigger**: Clicking business name or "View Store" button
- **Progression**: Click business → See profile with info → Browse their coupons → Return to main view
- **Success criteria**: Complete business information displayed, easy navigation back

### Business Dashboard (Owner View)
- **Functionality**: Comprehensive admin panel for business owners to manage coupons, view analytics, and customize branding
- **Purpose**: Enable business owners to independently manage their digital coupon presence and track performance
- **Trigger**: Clicking "Business Login" button from customer view
- **Progression**: Access dashboard → View overview/analytics → Create/edit coupons → Customize branding → Switch back to customer view
- **Success criteria**: All CRUD operations work, analytics display real data, branding customization demonstrates white-label capability

## Edge Case Handling
- **No coupons available**: Show empty state with friendly message encouraging business owners to add offers
- **Expired coupons**: Automatically filter out or clearly mark as expired with disabled redemption
- **Already redeemed**: Track redemptions and show visual indicator that coupon was used
- **Broken images**: Fallback to business logo or category icon if coupon image fails to load
- **Long business names/terms**: Truncate elegantly with ellipsis and show full text on hover or in detail view
- **Network failures**: Graceful handling with retry options for API calls (simulated for demo)

## Design Direction
The design should evoke trust and modern sophistication while remaining approachable - think premium SaaS dashboard meets consumer mobile app. It should feel polished enough to impress business owners during sales demos while being intuitive enough for any customer to use. A clean, spacious interface with generous white space emphasizes quality and allows the coupon content to shine.

## Color Selection
Complementary color scheme with professional, trustworthy blues balanced with warm accent colors to create energy and highlight deals.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Communicates trust, stability, and corporate professionalism for the B2B sales aspect
- **Secondary Colors**: 
  - Soft Sky Blue (oklch(0.92 0.04 240)) - Light backgrounds and secondary elements
  - Slate Gray (oklch(0.55 0.02 250)) - Supporting text and borders
- **Accent Color**: Vibrant Coral/Orange (oklch(0.68 0.19 35)) - CTAs, badges, and deal highlights to create urgency and excitement
- **Foreground/Background Pairings**:
  - Background (White oklch(0.99 0 0)): Primary text (oklch(0.25 0.02 250)) - Ratio 14.1:1 ✓
  - Card (White oklch(0.99 0 0)): Card text (oklch(0.25 0.02 250)) - Ratio 14.1:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(0.99 0 0)) - Ratio 9.2:1 ✓
  - Secondary (Sky Blue oklch(0.92 0.04 240)): Dark text (oklch(0.25 0.02 250)) - Ratio 12.8:1 ✓
  - Accent (Coral oklch(0.68 0.19 35)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Muted (Light Gray oklch(0.96 0.01 250)): Muted text (oklch(0.5 0.02 250)) - Ratio 7.2:1 ✓

## Font Selection
Professional sans-serif typography that balances corporate credibility with modern friendliness - Inter for its excellent readability at all sizes and professional appearance.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold/32px/tight tracking - Used for main "Digital Coupons" header
  - H2 (Section Headers): Inter SemiBold/24px/normal tracking - Category names, business names
  - H3 (Coupon Titles): Inter SemiBold/18px/normal tracking - Individual coupon offer headlines
  - Body (Descriptions): Inter Regular/15px/1.6 line-height - Coupon terms, business descriptions
  - Small (Metadata): Inter Medium/13px/normal tracking - Expiry dates, categories, business hours
  - Button Text: Inter SemiBold/15px/tight tracking - CTAs and action buttons

## Animations
Subtle, purposeful animations that provide immediate feedback and guide attention without slowing down the user experience - emphasizing the premium, polished nature of the platform.

- **Purposeful Meaning**: Smooth micro-interactions communicate the app's responsiveness and quality, with slightly playful bounces on redemption success to create emotional satisfaction
- **Hierarchy of Movement**: 
  - **Primary**: Coupon redemption flow (modal open, code reveal) - 300-400ms with gentle easing
  - **Secondary**: Favorite button feedback (scale + color) - 150ms spring animation
  - **Tertiary**: Hover states on cards (subtle lift + shadow) - 200ms ease-out
  - **Ambient**: Filter transitions and category switches - 250ms cross-fade

## Component Selection

- **Components**:
  - **Dialog**: For coupon redemption modal showing QR codes and redemption details
  - **Card**: Primary container for coupon grid items, business info cards
  - **Button**: All CTAs including "Redeem Now", "View Store", category filters
  - **Badge**: Category tags, "NEW" indicators, "SAVED" status, expiry warnings
  - **Separator**: Dividing sections within coupon details and business profiles
  - **Avatar**: Business logos in compact views
  - **Tabs**: Switching between "All Coupons" and "Saved" views
  - **Scroll Area**: Business coupon listings, terms and conditions

- **Customizations**:
  - **Coupon Grid Component**: Custom responsive grid with aspect-ratio locked cards showing hero image, business logo overlay, discount headline, and quick actions
  - **Category Filter Bar**: Horizontal scrollable pill buttons with active state highlighting
  - **Redemption Code Display**: Large, prominent QR code or barcode with copy-to-clipboard functionality
  - **Business Header Card**: Custom layout with cover image, logo, name, rating, and action buttons

- **States**:
  - **Buttons**: Default (solid primary), Hover (slight darken + lift), Active (scale down), Loading (spinner), Disabled (muted with reduced opacity)
  - **Coupon Cards**: Default (flat), Hover (shadow + translate-y), Saved (gold heart icon), Redeemed (overlay with checkmark)
  - **Category Filters**: Default (ghost), Active (solid primary), Hover (light background)

- **Icon Selection**:
  - Heart (regular/fill) - Favorites toggle
  - Storefront - Business profiles
  - Tag - Discount/offer indication
  - QrCode - Redemption codes
  - Clock - Expiry information
  - MapPin - Business location
  - FunnelSimple - Filter actions
  - Check - Redeemed status
  - Copy - Copy redemption code
  - X - Close modals

- **Spacing**:
  - Page padding: p-6 (mobile) / p-8 (desktop)
  - Card padding: p-6
  - Section gaps: gap-8 (main sections), gap-4 (card grids), gap-2 (inline elements)
  - Button padding: px-6 py-2.5 (primary), px-4 py-2 (secondary)

- **Mobile**:
  - Single column coupon grid on mobile (<640px), 2 columns on tablet (640-1024px), 3 columns on desktop (>1024px)
  - Category filters switch to horizontal scroll with snap points on mobile
  - Redemption modal becomes full-screen sheet on mobile devices
  - Sticky header with compact business selector on scroll
  - Bottom navigation could be added for favorites/profile in future iterations
