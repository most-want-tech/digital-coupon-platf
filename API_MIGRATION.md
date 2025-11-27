# API Migration Documentation

## Overview

The API calls have been migrated to a Next.js structure with support for both demo/development and production modes. This allows developers to work without consuming API quotas and provides better caching and error handling.

## Architecture

### Before Migration
- Direct fetch calls to external Routicket API from client components
- No caching mechanism
- Limited error handling
- API credentials exposed in client-side code

### After Migration
- Next.js API routes handle all external API calls
- Built-in server-side caching with revalidation
- Demo mode using mock data for development
- Better separation of concerns and error handling

## File Structure

```
src/
├── app/
│   └── api/
│       └── coupons/
│           └── route.ts          # Next.js API route handler
├── data/
│   └── mock-coupons.json         # Mock data for demo mode
├── lib/
│   └── routicket.ts              # Updated to use Next.js API route
└── hooks/
    └── use-routicket-data.ts     # Hook with demo mode support
```

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Enable demo mode (uses mock data)
NEXT_PUBLIC_USE_DEMO_DATA=true

# Optional: Set custom base URL for API routes (defaults to localhost:3000)
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

For production, set to `false` or omit the variable:

```bash
# Use real API calls
NEXT_PUBLIC_USE_DEMO_DATA=false

# Set your production base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Configure your API credentials
NEXT_PUBLIC_API_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_API_SECRET_KEY=your-secret-key
NEXT_PUBLIC_PARTNER_ID=your-partner-id
NEXT_PUBLIC_USER_ID=your-user-id
```

See `.env.example` for all available configuration options.

## Usage

### Using Demo Mode

Demo mode is automatically enabled when:
1. `NEXT_PUBLIC_USE_DEMO_DATA=true` is set in environment variables, OR
2. `useDemoData: true` is passed to the hook

```typescript
// In your component
const { data, isLoading, error } = useRouticketData({
  apiPublicKey: 'PUBLIC-key',
  partnerId: 1427,
  useDemoData: true  // Force demo mode
});
```

### Using Production Mode

```typescript
const { data, isLoading, error } = useRouticketData({
  apiPublicKey: process.env.NEXT_PUBLIC_API_PUBLIC_KEY!,
  apiSecret: process.env.NEXT_PUBLIC_API_SECRET_KEY,
  userId: process.env.NEXT_PUBLIC_USER_ID,
  partnerId: process.env.NEXT_PUBLIC_PARTNER_ID,
  useDemoData: false  // Use real API
});
```

## API Route

The API route is available at: `/api/coupons`

### Query Parameters

| Parameter   | Required | Description                                    |
|-------------|----------|------------------------------------------------|
| demo        | No       | Set to 'true' to use mock data                 |
| api_public  | Yes*     | API public key (*required in production mode)  |
| api_secret  | No       | API secret key                                 |
| user_id     | No       | User ID for filtering                          |
| id_partner  | No       | Partner ID for filtering                       |

### Example Requests

**Demo Mode:**
```bash
GET /api/coupons?demo=true&id_partner=1427
```

**Production Mode:**
```bash
GET /api/coupons?api_public=PUBLIC-xxx&api_secret=SECRET-xxx&id_partner=1427
```

## Benefits

1. **Development Efficiency**: No API quota consumption during development
2. **Server-Side Caching**: Responses cached for 30 minutes in production
3. **Better Error Handling**: Centralized error handling in API routes
4. **Security**: API credentials not exposed in client-side code
5. **Flexibility**: Easy to switch between demo and production modes
6. **Testing**: Mock data allows for consistent testing scenarios
7. **Code Quality**: Shared utility functions for better maintainability

## Mock Data

The mock data in `src/data/mock-coupons.json` includes:
- 5 sample coupons with realistic data
- Complete API usage statistics
- Partner filtering support
- All required fields from the Routicket API

You can customize the mock data to match your testing needs.

## Migration Checklist

- [x] Create Next.js API route (`/api/coupons`)
- [x] Add mock data for demo mode
- [x] Update `fetchRouticketCoupons` to use API route
- [x] Add demo mode support to hooks
- [x] Create environment variable configuration
- [x] Document the migration

## Troubleshooting

### Issue: API returns 400 error
**Solution**: Make sure `api_public` parameter is provided when not in demo mode.

### Issue: Mock data not loading
**Solution**: Verify that `NEXT_PUBLIC_USE_DEMO_DATA=true` is set in your `.env.local` file.

### Issue: Changes not reflecting
**Solution**: Restart the Next.js dev server after changing environment variables.

## Utility Functions

The migration includes shared utility functions for better code organization:

### `isDemoModeEnabled()`
```typescript
import { isDemoModeEnabled } from '@/lib/routicket';

if (isDemoModeEnabled()) {
  // Use mock data
}
```

Checks if demo mode is enabled via the `NEXT_PUBLIC_USE_DEMO_DATA` environment variable.

### `getApiBaseUrl()`
Internal utility that determines the correct base URL for API calls:
- In browser: uses `window.location.origin`
- In server: uses `NEXT_PUBLIC_BASE_URL` or defaults to `http://localhost:3000`

## Future Enhancements

- Add more mock data scenarios
- Implement request rate limiting
- Add response compression
- Support for additional API endpoints
- Add API key validation middleware
- Add API response versioning
