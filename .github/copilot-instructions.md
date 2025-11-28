# CouponHub Copilot Guide

## Quick Orientation
- React 19 + Vite app; `src/App.tsx` flips `viewMode` between the customer grid and `AdminDashboard`. Prefer slotting new feature toggles here so both experiences stay in sync.
- Type definitions in `src/lib/types.ts` drive data flow. Reuse these shapes (e.g., `RouticketCoupon`, `BrandConfig`) when extending hooks or components to keep analytics and management views compiling.
- UI atoms live in `src/components/ui/*` (shadcn-based). Use the existing exports plus the `cn` helper from `src/lib/utils.ts` instead of reinventing layout primitives.
- Path alias `@/` maps to `src/` via `vite.config.ts`; respect this when importing to avoid broken builds.

## Data & State Flow
- Customer view loads partner coupons via `useRouticketData` → `fetchRouticketCoupons`. That hook already handles AbortControllers and partner filtering; extend it rather than re-fetching manually.
- `App.tsx` normalizes Routicket dates with `normalizeDate` and enriches coupons with mock-brand data. Keep any new API mappers in this layer so downstream components stay dumb/presentational.
- Local brand theming persists through `useBrandConfigs` (localStorage key `brand-configs`). Always call `applyBrandColors` after mutating configs or colors will desync.
- Demo fallbacks use `mockBusinesses` and `mockCoupons`; analytics derive counts from `RouticketCoupon.status`, `vistosx`, `scan`, and `usado`. Maintain those keys when mocking.

## UI & Styling Patterns
- Tailwind v4 is configured to read `theme.json` overrides and inject OKLCH colors (`brand-config.ts`). When adding design tokens prefer updating the theme file or the helper converters in `src/lib/color-utils.ts`.
- Animations (e.g., `CouponCard`) rely on Framer Motion; wrap new interactive cards with `motion.div` for consistency.
- Toast notifications use `sonner` (`toast.success/error`). Admin settings expect optimistic toasts—mirror that pattern for new dashboard actions.
- Strings presented to end users default to Spanish copy; align new messaging with that locale unless you are explicitly adding bilingual support.

## Key Workflows
- Install deps with `npm install`; run locally via `npm run dev`. Production check is `npm run build` (note: uses `tsc -b --noCheck` before the Vite build) and linting is `npm run lint`.
- If asset imports fail, ensure the Spark Vite plugins remain in `vite.config.ts`; removing them breaks icon proxying in production.
- Routing is intentionally flat—customer and admin views are controlled states, not react-router. To add “pages,” extend the state machine or compose tabs within `AdminDashboard`.
- External API keys in `App.tsx` are demo values; when integrating real secrets, push them into env vars and thread them through `useRouticketData` props.

## Common Pitfalls
- `RouticketCoupon.status` of `1` means active—`DashboardOverview` and `CouponManagement` assume this. Keep that sentinel when transforming data.
- Date handling expects ISO strings. Use `normalizeDate` or mimic its guard rails to avoid crashing the customer grid on malformed API responses.
- Brand color pickers convert hex ⇄ OKLCH; bypassing `hexToOklch`/`oklchToHex` yields inconsistent theming between dashboards and public view.
- Avoid direct DOM mutation; rely on `applyBrandColors` and existing hooks so SSR or future hydration work stays possible.
