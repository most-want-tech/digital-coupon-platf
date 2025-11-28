# CouponHub Copilot Guide

## Quick Orientation
- Next.js 15 App Router shell; `src/app/page.tsx` is the only route and renders the shared `src/App.tsx`, which flips `viewMode` between the customer grid and `AdminDashboard`. Keep feature toggles here so both experiences stay in sync.
- Type definitions in `src/lib/types.ts` drive data flow. Reuse these shapes (e.g., `RouticketCoupon`, `BrandConfig`) when extending hooks or components to keep analytics and management views compiling.
- UI atoms live in `src/components/ui/*` (shadcn-based). Use the existing exports plus the `cn` helper from `src/lib/utils.ts` instead of reinventing layout primitives.
- Path alias `@/` maps to `src/` via `tsconfig.json`; update that file (and only that file) if you reorganize directories.

## Branching & Deployments
- `main` and `dev` both track the Next.js migration. Treat them as source of truth for all work.
- `legacy/react` is read-only for historical context—never merge from it or resurrect Vite entry points.
- Ship-ready builds must pass `next build` and `npm run type-check` before hitting either protected branch.

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
- Install deps with `npm install`; run locally with `npm run dev` (Next dev server, supports fast refresh).
- Production parity check is `npm run build && npm run start`; enforce linting via `npm run lint` and types via `npm run type-check`.
- If asset imports fail, inspect `next.config.ts` and `spark.meta.json`; both must stay aligned so Spark’s icon proxy keeps working.
- Routing is intentionally flat—customer and admin views are controlled states inside `App`, not multiple Next routes. To add “pages,” extend that state machine or compose tabs within `AdminDashboard`.
- External API keys in `App.tsx` are demo values; when integrating real secrets, move them into env vars and pass them through `useRouticketData` props or Next server actions as needed.

## Common Pitfalls
- `RouticketCoupon.status` of `1` means active—`DashboardOverview` and `CouponManagement` assume this. Keep that sentinel when transforming data.
- Date handling expects ISO strings. Use `normalizeDate` or mimic its guard rails to avoid crashing the customer grid on malformed API responses.
- Brand color pickers convert hex ⇄ OKLCH; bypassing `hexToOklch`/`oklchToHex` yields inconsistent theming between dashboards and public view.
- Avoid direct DOM mutation; rely on `applyBrandColors` and existing hooks so SSR or future hydration work stays possible.
