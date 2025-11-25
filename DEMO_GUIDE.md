# CouponHub Demo Guide

## Overview
This demo showcases a complete white-label digital coupon platform with both customer-facing and business management interfaces. All functionality is live and interactive.

## Getting Started

### Customer View (Default)
When you first load the application, you'll see the customer-facing coupon marketplace.

**Key Features:**
- Browse all available coupons from local businesses
- Filter by category (Food & Dining, Retail, Services, Entertainment)
- Save favorite coupons for later
- Click any coupon to view redemption details
- Click business logos to see full business profiles

**Try it:**
1. Click the heart icon on any coupon to save it
2. Switch to the "Saved" tab to see your favorites
3. Click "Redeem Now" to generate a redemption code
4. Click "Mark as Used" to simulate a redemption

### Business Dashboard
Click the **"Business Login"** button in the top right to access the business management interface.

## Business Dashboard Features

### 1. Overview Tab
Real-time business analytics dashboard.

**What you'll see:**
- Active coupon count
- Total redemptions across all coupons
- Coupons expiring within 7 days
- Overall engagement rate
- Top performing coupons by redemption count
- Recent activity feed

**Live Demo Feature:**
- Go to customer view, redeem some coupons
- Return to business dashboard to see updated stats in real-time!

### 2. Coupons Tab
Complete coupon management system.

**Features:**
- View all active and expired coupons
- Create new coupons with the "Create Coupon" button
- Edit existing coupons
- Duplicate coupons to create similar offers quickly
- Delete unwanted coupons
- See redemption counts for each coupon

**Try Creating a Coupon:**
1. Click "Create Coupon"
2. Fill in the form:
   - Title: "50% Off First Purchase"
   - Discount: "50% OFF"
   - Description: "New customers save big!"
   - Category: Select from dropdown
   - Expiry Date: Pick a future date
   - Terms: Add any restrictions
3. Click "Create Coupon"

**Note:** In this demo, coupon changes are simulated with toast notifications. A production version would persist to your backend API.

### 3. Analytics Tab
Detailed performance metrics and trends.

**Charts & Metrics:**
- **Total Redemptions:** Lifetime redemption count
- **Weekly Growth:** Week-over-week percentage change
- **Average Per Coupon:** Mean redemptions across all offers
- **30-Day Trend Chart:** Visual bar chart of daily redemptions
- **Category Performance:** Breakdown by business category with progress bars
- **Top Performers:** Ranked list of most successful coupons

**Live Data:**
All analytics pull from actual redemption data. Test by:
1. Switching to customer view
2. Redeeming multiple coupons
3. Returning to Analytics tab to see updated charts

### 4. Settings Tab
Business profile and white-label branding customization.

**Business Profile Section:**
- Edit business name, category, description
- Update address, phone, email, website
- Modify business hours
- Save changes (demo mode shows success toast)

**White-Label Branding Section:**
Demonstrates the platform's customization capabilities:
- **Primary Color:** Main brand color for buttons and highlights
- **Secondary Color:** Supporting UI elements
- **Accent Color:** Deals and call-to-action highlights
- **Logo URL:** Business logo (200x200px recommended)
- **Cover Image URL:** Profile banner (1200x400px recommended)

**Try It:**
1. Change the primary color using the color picker
2. Update the hex code value
3. Click "Save Branding" to see the demo confirmation

**API Integration Section:**
Shows example API endpoint and key management for production integration.

## Testing the Full Flow

### Complete Demo Walkthrough:

1. **Start in Customer View:**
   - Browse the 12 pre-loaded coupons
   - Filter by "Food & Dining" category
   - Save 3-4 coupons you like
   - Click on a business logo to view their profile

2. **Redeem Some Coupons:**
   - Click "Redeem Now" on a coupon
   - View the QR code and redemption code
   - Click "Mark as Used" to complete redemption
   - Repeat for 4-5 different coupons

3. **Switch to Business Dashboard:**
   - Click "Business Login" in the header
   - Dismiss the welcome card (or keep it for reference)
   - View the Overview tab stats - you'll see your redemptions!

4. **Check Analytics:**
   - Go to Analytics tab
   - See the redemption trend chart (last 30 days)
   - View top performing coupons
   - Check category breakdown

5. **Manage Coupons:**
   - Go to Coupons tab
   - View all active coupons with redemption counts
   - Try creating a new coupon
   - Edit or duplicate an existing one

6. **Customize Branding:**
   - Go to Settings tab
   - Update business information
   - Experiment with brand colors
   - See the white-label capabilities

7. **Return to Customer View:**
   - Click "Customer View" button
   - See how your coupons appear to end users
   - Redeem more coupons to generate additional data

## Data Persistence

The demo uses browser-based persistent storage (Spark KV):
- **Saved Coupons:** Persists across sessions
- **Redemption History:** Tracks all redeemed coupons
- **Welcome Card State:** Remembers if you dismissed it

**To Reset Data:**
Clear your browser's local storage or use the browser's developer tools to delete KV entries.

## Mock Data

The demo includes 6 businesses across 4 categories:
- **Food & Dining:** The Artisan Café, Bella Italia Restaurant
- **Services:** FitZone Gym
- **Retail:** Style & Co Boutique, TechWave Electronics
- **Entertainment:** The Reel Cinema

12 active coupons with various discount types:
- Percentage discounts (20%, 25%, 30%, 50%)
- Fixed amount ($100 off)
- BOGO (Buy One Get One, 2 for 1)
- Free items/services

## Production Readiness

This demo is designed to show how the platform would work with real backend APIs:

**API Integration Points:**
- Business CRUD operations
- Coupon management endpoints
- Redemption tracking
- Analytics data aggregation
- User authentication
- Image upload/storage

**White-Label Features:**
- Complete theme customization
- Logo and branding assets
- Custom domain support (not shown in demo)
- Multi-tenant architecture ready

## Business Use Cases

Perfect for:
- **Local Business Associations:** Chamber of Commerce coupon books
- **Shopping Centers:** Mall-wide promotion platform
- **Tourism Boards:** Visitor attraction passes and deals
- **Business Improvement Districts:** Downtown business promotions
- **Franchise Operations:** Corporate coupon management for multiple locations

## Technical Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui v4
- **Icons:** Phosphor Icons
- **Animations:** Framer Motion
- **Date Handling:** date-fns
- **State:** React hooks + Spark KV persistence
- **Build:** Vite

## Support & Customization

This platform is fully customizable for your specific use case. Ready for:
- Backend API integration
- Custom business logic
- Additional features (loyalty programs, user accounts, etc.)
- Payment processing integration
- Email/SMS notifications
- Mobile app development

---

**Questions or want to customize this for your business?**
Contact us about implementing CouponHub for your community!
