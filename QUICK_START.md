# Quick Start Guide - API Migration

## TL;DR

The application now supports **demo mode** (mock data) and **production mode** (real API calls).

## Development Setup (Demo Mode)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```
   
   The `.env.local` is already configured for demo mode by default.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to http://localhost:3000

   You'll see 5 sample coupons loaded from mock data - **no API calls are made!**

## Switch to Production Mode

1. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_USE_DEMO_DATA=false
   NEXT_PUBLIC_API_PUBLIC_KEY=your-actual-key
   NEXT_PUBLIC_API_SECRET_KEY=your-actual-secret
   NEXT_PUBLIC_PARTNER_ID=your-partner-id
   NEXT_PUBLIC_USER_ID=your-user-id
   ```

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

   Now it will fetch real data from the Routicket API.

## Key Features

- ✅ **Demo mode by default** - No API quota consumption during development
- ✅ **30-minute server-side caching** - Reduces API calls in production
- ✅ **Easy toggle** - One environment variable to switch modes
- ✅ **5 sample coupons** - Realistic mock data for testing
- ✅ **Full feature parity** - Both modes work identically

## Files Changed

| File | Purpose |
|------|---------|
| `src/app/api/coupons/route.ts` | Next.js API route handler |
| `src/data/mock-coupons.json` | Mock data for demo mode |
| `src/lib/routicket.ts` | Updated to use API route |
| `.env.example` | Environment variables template |
| `.env.local` | Local development configuration |

## Testing

**Test demo mode:**
```bash
curl http://localhost:3000/api/coupons?demo=true
```

**Test with partner filter:**
```bash
curl "http://localhost:3000/api/coupons?demo=true&id_partner=1427"
```

## Deployment

For production deployments (Vercel, Netlify, etc.):

1. Set environment variables in your hosting platform:
   ```
   NEXT_PUBLIC_USE_DEMO_DATA=false
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   NEXT_PUBLIC_API_PUBLIC_KEY=***
   NEXT_PUBLIC_API_SECRET_KEY=***
   ```

2. Deploy normally:
   ```bash
   npm run build
   npm start
   ```

## Need Help?

- See `API_MIGRATION.md` for complete documentation
- Check `src/data/mock-coupons.json` to customize mock data
- Environment variables are in `.env.example`

## Common Issues

**Q: Changes not reflecting?**  
A: Restart the dev server after changing environment variables.

**Q: Want more mock coupons?**  
A: Edit `src/data/mock-coupons.json` and add more coupon objects.

**Q: API returning 400 error?**  
A: Make sure you've set `NEXT_PUBLIC_USE_DEMO_DATA=false` and provided valid API credentials.
