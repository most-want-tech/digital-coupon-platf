# CouponHub - Digital Coupon Platform

A white-label digital coupon book SaaS platform that enables local businesses to offer modern, mobile-friendly coupons to customers. This demo showcases both the customer-facing interface and a comprehensive business dashboard, now served through a Next.js App Router deployment so SSR and streaming demos behave like production.

## 🧭 Project Status

- `main` and `dev` both point to the completed Next.js migration (Next 15 + React 19). Ship-ready code lives here.
- The legacy React/Vite stack has been archived in `legacy/react` for reference only. Do not merge or cherry-pick from it back into active branches.
- New features must be validated against the Next runtime (Edge-safe APIs, Server Components where possible) before merge.

## 🎯 Features

### Customer View
- **Coupon Browsing**: Grid display of digital coupons from local businesses
- **Category Filtering**: Filter by Food & Dining, Retail, Services, or Entertainment
- **Save Coupons**: Bookmark favorite deals for quick access later
- **Coupon Redemption**: Generate redemption codes and track usage
- **Business Profiles**: View detailed information about each business

### Business Dashboard
- **Overview Analytics**: Real-time stats on active coupons, redemptions, and engagement
- **Coupon Management**: Full CRUD operations for creating and managing promotional offers
- **Advanced Analytics**: 
  - Redemption trends over 30 days
  - Category performance breakdown
  - Top performing coupons
  - Weekly growth metrics
- **Business Settings**: 
  - Edit business profile and contact information
  - White-label branding customization (colors, logo, cover images)
  - API integration documentation
- **Live Data**: Dashboard uses real redemption data from customer interactions

## 🚀 Quick Start

Click the "Business Login" button in the header to access the business dashboard. Switch back to customer view anytime using the "Customer View" button.

## 🎨 White-Label Ready

The platform demonstrates full white-label capability:
- Custom brand colors (primary, secondary, accent)
- Custom logo and cover images
- Business-specific profile information
- API-ready for integration with existing systems

## 💡 Use Cases

Perfect for:
- Local business associations
- Shopping malls and commercial districts  
- Tourism boards
- Chamber of Commerce organizations
- Any organization connecting local businesses with customers

## 📊 Tech Stack

- Next.js 15 (App Router) on React 19 + TypeScript
- Tailwind CSS v4 theme tokens for styling
- shadcn/ui + Radix primitives for UI
- Framer Motion for animations
- date-fns for date handling
- Spark KV-backed persistence for demo state

## 🛠 Development Workflow

- Install deps with `npm install`.
- Run the app locally via `npm run dev` (Next dev server).
- Validate production builds with `npm run build && npm run start`.
- Run linting `npm run lint` and type safety checks `npm run type-check` before opening PRs.

## 🔧 API Ready

The platform is designed to connect with backend APIs for:
- Business management
- Coupon CRUD operations
- Redemption tracking
- Analytics data
- User authentication

---

📄 **License**: MIT License, Copyright GitHub, Inc.
