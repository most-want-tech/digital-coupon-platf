# GitHub Copilot Instructions for CouponHub

## Project Overview

CouponHub is a white-label digital coupon platform SaaS that enables local businesses to offer modern, mobile-friendly coupons to customers. This project includes both a customer-facing coupon marketplace and a comprehensive business dashboard for managing coupons, viewing analytics, and customizing branding.

**Key Features:**
- Customer coupon browsing and redemption
- Business dashboard with analytics
- White-label branding customization
- Persistent storage using Spark KV
- Real-time redemption tracking

## Technology Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6.4+
- **Styling:** Tailwind CSS v4 with custom theme system
- **Component Library:** shadcn/ui components (Radix UI primitives)
- **Icons:** Phosphor Icons (@phosphor-icons/react)
- **Animations:** Framer Motion
- **Date Handling:** date-fns
- **Storage:** @github/spark KV (browser-based persistent storage)
- **Type Safety:** TypeScript 5.7+ with strict null checks
- **Module System:** ESNext with bundler resolution

## Project Structure

```
/src
  /components       - React components
    /ui            - shadcn/ui reusable components
    /dashboard     - Business dashboard specific components
  /hooks           - Custom React hooks
  /lib             - Utility functions, types, and mock data
  /styles          - Global CSS and theme files
```

**Key Paths:**
- Path alias `@/*` maps to `./src/*`
- Use `@/components/...` for component imports
- Use `@/lib/...` for utilities and types
- Use `@/hooks/...` for custom hooks

## Development Commands

### Essential Commands
```bash
# Install dependencies (ALWAYS run first in a fresh clone)
npm install

# Start development server (runs on port 5173 by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Optimize dependencies
npm run optimize

# Kill process using port 5000 (if needed)
npm run kill
```

### Build Process
- TypeScript compilation: `tsc -b --noCheck` (skips type checking for speed)
- Vite bundling: `vite build`
- Build output: `dist/` directory (gitignored)
- Build warnings about CSS media queries and chunk size are expected and can be ignored

### Linting
**Note:** ESLint is configured in package.json but requires migration to flat config format. The `npm run lint` command currently fails due to missing `eslint.config.js`. This is a known issue.

## Code Style and Conventions

### TypeScript Guidelines
- Use TypeScript for all new files (`.tsx` for components, `.ts` for utilities)
- Leverage type inference where possible
- Define types in `/src/lib/types.ts` for shared types
- Use `interface` for object shapes, `type` for unions/intersections
- Enable strict null checks (already configured in tsconfig.json)

### React Component Guidelines
- Use functional components with hooks
- Prefer named exports for components
- Use React 19 features (no more `React.FC` needed)
- Keep component files focused and single-purpose
- Place UI components in `src/components/ui/`
- Place feature components in `src/components/`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow existing custom theme variables from `tailwind.config.js`
- Use theme variables: `--color-*`, `--size-*`, `--radius-*`
- Responsive design: mobile-first approach
- Custom breakpoints: `coarse`, `fine`, `pwa` (for PWA mode)
- Dark mode support via `data-appearance="dark"` attribute

### Component Patterns
```tsx
// Example component structure
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Coupon } from '@/lib/types';

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const [isSaved, setIsSaved] = useState(false);
  
  return (
    <div className="rounded-lg border p-4">
      {/* Component content */}
    </div>
  );
}
```

### State Management
- Use React hooks (`useState`, `useEffect`, etc.)
- Custom hooks in `/src/hooks/` directory
- Spark KV for persistent storage (see `use-brand-configs.ts` for examples)
- No Redux or external state management library

### Naming Conventions
- **Components:** PascalCase (`CouponCard.tsx`)
- **Files:** kebab-case for utilities (`mock-data.ts`, `color-utils.ts`)
- **Hooks:** camelCase with `use` prefix (`useMobile.ts`)
- **Types:** PascalCase interfaces and types
- **Constants:** UPPER_SNAKE_CASE or camelCase depending on context

## Testing

**Current State:** This project does not have test infrastructure set up. There are no test files (*.test.ts, *.spec.ts) in the source code.

**When Adding Features:**
- Focus on manual testing in the development environment
- Test responsive behavior at different breakpoints
- Verify functionality in both customer and business views
- Check that Spark KV persistence works correctly
- Ensure white-label branding updates reflect properly

**Future Testing:**
- When test infrastructure is needed, consider Vitest (works well with Vite)
- Follow React Testing Library patterns for component testing
- Add E2E tests with Playwright if needed

## Key Dependencies

### Core
- `react@19.0.0` & `react-dom@19.0.0` - UI framework
- `@github/spark` - Persistence and runtime utilities
- `typescript@5.7.2` - Type safety

### UI/Styling
- `tailwindcss@4.1.11` - Utility-first CSS
- `@radix-ui/*` - Headless UI primitives for accessible components
- `framer-motion@12.6.2` - Animations
- `lucide-react@0.484.0` & `@phosphor-icons/react@2.1.7` - Icon libraries

### Forms & Data
- `react-hook-form@7.54.2` - Form state management
- `zod@3.25.76` - Schema validation
- `date-fns@3.6.0` - Date utilities

### Charts
- `recharts@2.15.1` - Analytics charts

## Important Files

### Configuration Files
- `vite.config.ts` - Vite configuration with Spark plugin
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind theme and custom colors
- `theme.json` - Runtime theme overrides (initially empty)
- `components.json` - shadcn/ui configuration

### Entry Points
- `index.html` - HTML entry point
- `src/main.tsx` - React app entry point
- `src/App.tsx` - Root application component

### Key Library Files
- `src/lib/types.ts` - Shared TypeScript types
- `src/lib/mock-data.ts` - Sample businesses and coupons
- `src/lib/mock-redemptions.ts` - Redemption tracking data
- `src/lib/brand-config.ts` - White-label branding logic
- `src/lib/utils.ts` - Common utility functions

## Boundaries and Safety

### DO NOT
- **Never commit secrets, API keys, or credentials** to source control
- **Never modify the Spark plugin configuration** in `vite.config.ts` without understanding it first (marked with "DO NOT REMOVE" comment)
- **Never delete or modify `node_modules/`, `dist/`, or build artifacts** (they're gitignored)
- **Never change the icon proxy plugin** - it's required for Phosphor icon imports
- **Never break the white-label functionality** - businesses depend on customizable branding
- **Never remove existing accessibility features** (Radix UI provides this)
- **Never introduce breaking changes** to the public component APIs without discussion
- **Never modify package.json scripts** without testing them first

### ALWAYS
- **Always run `npm install`** when working with a fresh clone
- **Always test in both customer and business views** when making UI changes
- **Always preserve the existing file structure** and naming conventions
- **Always use the `@/*` path alias** for imports instead of relative paths when possible
- **Always check that builds succeed** with `npm run build` before finalizing changes
- **Always respect the mock data structure** in `src/lib/mock-data.ts`
- **Always maintain responsive design** - test mobile, tablet, and desktop viewports
- **Always preserve type safety** - don't use `any` unless absolutely necessary
- **Always follow the established component patterns** in existing code

### Production Readiness
- This is currently a **demo/prototype** - not production-ready
- API integration is simulated with mock data
- No real authentication or backend
- Storage uses browser-local Spark KV (not suitable for production data)
- Security measures (CSRF, XSS prevention, etc.) need implementation before production

## Common Tasks

### Adding a New Component
1. Create file in appropriate directory (`src/components/` or `src/components/ui/`)
2. Use TypeScript and functional component pattern
3. Import types from `@/lib/types`
4. Use Tailwind for styling
5. Export the component as named export

### Adding a New Page/View
1. Add component to `src/components/`
2. Import and integrate in `src/App.tsx`
3. Update navigation if needed
4. Ensure mobile responsiveness

### Working with Spark KV
```typescript
import { kv } from '@github/spark';

// Set value
await kv.set('key', value);

// Get value
const value = await kv.get('key');

// Check examples in src/hooks/use-brand-configs.ts
```

### Modifying Theme Colors
1. Update `src/styles/theme.css` for CSS variables
2. Use existing color tokens from `tailwind.config.js`
3. Test in both light and dark modes (if applicable)
4. Maintain WCAG AA contrast ratios

### Adding Mock Data
1. Update `src/lib/mock-data.ts` for businesses/coupons
2. Follow existing data structure patterns
3. Ensure all required fields are present
4. Update TypeScript types if adding new fields

## Design System

### Color Palette
- **Primary:** Deep Professional Blue - trust and stability
- **Secondary:** Soft Sky Blue - backgrounds
- **Accent:** Vibrant Coral/Orange - CTAs and highlights
- **Neutral:** Slate grays for text and borders

### Typography
- **Font Family:** Inter (system fallback available)
- **Headings:** SemiBold weight
- **Body:** Regular weight
- **Small text:** Medium weight

### Spacing
- Follow Tailwind spacing scale (mapped to CSS variables)
- Page padding: `p-6` (mobile) / `p-8` (desktop)
- Card padding: `p-6`
- Section gaps: `gap-8` (main), `gap-4` (grids)

### Animations
- Subtle, purposeful micro-interactions
- Modal transitions: 300-400ms
- Hover states: 200ms ease-out
- Use Framer Motion for complex animations

## Helpful Context

### White-Label Features
The platform is designed for multi-tenant white-label deployment:
- Each business can customize colors, logo, and branding
- Theme changes apply globally through CSS variables
- Settings are stored in Spark KV
- See `src/components/dashboard/BusinessSettings.tsx` for implementation

### Customer vs Business Views
- **Customer View:** Main coupon marketplace (default view)
- **Business Dashboard:** Admin panel with analytics and management
- Toggle between views via header navigation
- Business features: Overview, Coupons, Analytics, Settings tabs

### Redemption Flow
1. Customer clicks "Redeem Now" on coupon
2. Modal shows QR code and redemption code
3. Customer shows code to business
4. Customer clicks "Mark as Used"
5. Redemption recorded in Spark KV
6. Analytics update in real-time

## Documentation

- `README.md` - Project overview and features
- `PRD.md` - Product requirements (in Spanish - design specifications)
- `DEMO_GUIDE.md` - Comprehensive demo walkthrough
- `SECURITY.md` - Security policy
- `LICENSE` - MIT License

## Getting Help

### For Issues
- Check existing code patterns in similar components
- Review shadcn/ui documentation for component usage
- Consult Tailwind CSS v4 documentation for styling
- Check React 19 documentation for new patterns

### For Architecture Decisions
- Follow existing patterns in the codebase
- Maintain consistency with current structure
- Consider white-label requirements
- Think about mobile-first responsive design

---

## Summary for Quick Reference

**Tech:** React 19 + TypeScript + Vite + Tailwind v4 + shadcn/ui + Spark  
**Commands:** `npm install` → `npm run dev` → `npm run build`  
**Paths:** Use `@/` alias for imports  
**Style:** Tailwind utilities, theme variables, mobile-first  
**State:** React hooks + Spark KV for persistence  
**Testing:** Manual testing (no test framework yet)  
**Safety:** No secrets, preserve structure, test both views  

Happy coding! 🚀
