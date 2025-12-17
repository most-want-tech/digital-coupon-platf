# Server-Side Persistence Guide

This guide explains how user personalizations and brand configurations are persisted on the server side.

## Overview

The system now includes server-side persistence for user customizations and brand configurations. Data is stored in JSON files on the server and automatically loaded when customers visit the coupon showcase.

## Architecture

### Dual Storage Strategy

The system uses a **dual-layer storage approach** for reliability:

1. **Primary: Server-side JSON files** (`/data` directory)
2. **Fallback: Browser localStorage**

When saving, data is written to both locations. When loading, the server is checked first, with localStorage as a fallback if the server is unavailable.

### Data Files

Located in the `/data` directory:

- **personalizations.json** - UI element customizations (text, colors, layouts)
- **brand-configs.json** - Brand/business theme configurations

## API Endpoints

### Personalizations API (`/api/personalizations`)

#### GET - Load Personalizations
```bash
curl http://localhost:3000/api/personalizations
```

Response:
```json
{
  "customizations": {
    "hero-title": {
      "text": "Welcome to Our Store",
      "fontSize": "3rem"
    }
  },
  "lastUpdated": "2024-11-28T16:00:00.000Z"
}
```

#### POST - Save Personalizations
```bash
curl -X POST http://localhost:3000/api/personalizations \
  -H "Content-Type: application/json" \
  -d '{
    "customizations": {
      "hero-title": {
        "text": "Custom Welcome Message"
      }
    }
  }'
```

#### DELETE - Clear Personalizations
```bash
curl -X DELETE http://localhost:3000/api/personalizations
```

### Brand Configs API (`/api/brand-configs`)

#### GET - Load Brand Configurations
```bash
curl http://localhost:3000/api/brand-configs
```

Response:
```json
{
  "configs": {
    "business-123": {
      "platformName": "My Shop",
      "primaryColor": "#3b82f6",
      "accentColor": "#8b5cf6",
      "logoUrl": "https://example.com/logo.png"
    }
  },
  "lastUpdated": "2024-11-28T16:00:00.000Z"
}
```

#### POST - Save Brand Configurations
```bash
curl -X POST http://localhost:3000/api/brand-configs \
  -H "Content-Type: application/json" \
  -d '{
    "configs": {
      "business-123": {
        "platformName": "Updated Shop Name",
        "primaryColor": "#ff5733"
      }
    }
  }'
```

#### DELETE - Clear Brand Configurations
```bash
curl -X DELETE http://localhost:3000/api/brand-configs
```

## Usage in Code

### Personalizations

The `PersonalizationContext` automatically handles server persistence:

```tsx
import { usePersonalization } from '@/contexts/PersonalizationContext';

function MyComponent() {
  const { saveCustomizations, getCustomization } = usePersonalization();
  
  // Get a customization (with fallback)
  const title = getCustomization('hero-title', 'text', 'Default Title');
  
  // Save is automatic when updateProperty is called
  // Or manually trigger:
  await saveCustomizations();
}
```

### Brand Configs

The `useBrandConfigs` hook handles server persistence:

```tsx
import { useBrandConfigs } from '@/hooks/use-brand-configs';

function MyComponent() {
  const [brandConfigs, setBrandConfigs] = useBrandConfigs();
  
  // Update config (automatically saves to server)
  setBrandConfigs({
    'business-123': {
      platformName: 'New Name',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6'
    }
  });
}
```

## Data Flow

### On Application Load

1. Client requests data from `/api/personalizations` and `/api/brand-configs`
2. Server reads from JSON files (creates if missing)
3. Client receives and applies configurations
4. Fallback to localStorage if server request fails

### On Save

1. User makes changes in the admin dashboard
2. Client sends POST request to server API
3. Server updates JSON file with new data
4. Client also saves to localStorage as backup
5. Success/error feedback shown to user

### On Customer Visit

1. Page loads and requests server-side data
2. Personalizations are applied to UI elements
3. Brand colors and themes are applied
4. User sees customized coupon showcase

## File Structure

```
digital-coupon-platf/
├── data/
│   ├── .gitkeep                    # Keep directory in git
│   ├── README.md                   # Data directory documentation
│   ├── personalizations.json       # User customizations (gitignored)
│   └── brand-configs.json         # Brand configs (gitignored)
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── personalizations/
│   │       │   └── route.ts       # Personalizations API
│   │       └── brand-configs/
│   │           └── route.ts       # Brand configs API
│   ├── contexts/
│   │   └── PersonalizationContext.tsx  # Updated with server persistence
│   └── hooks/
│       └── use-brand-configs.ts   # Updated with server persistence
```

## Development Setup

### Initial Setup

The data directory and JSON files are created automatically when:
- The server starts
- First API request is made
- Files are missing

No manual setup required!

### Manual Setup (Optional)

```bash
# Create data directory
mkdir -p data

# Create initial JSON files
echo '{"customizations":{},"lastUpdated":null}' > data/personalizations.json
echo '{"configs":{},"lastUpdated":null}' > data/brand-configs.json
```

## Production Deployment

### Environment Considerations

- Ensure the `/data` directory is writable by the Node.js process
- Consider setting up periodic backups of JSON files
- For multi-server deployments, use a shared file system or migrate to a database

### Backup Strategy

```bash
# Simple backup script
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp data/*.json "$BACKUP_DIR/"
echo "Backup created: $BACKUP_DIR"
```

### Restore from Backup

```bash
# Restore from specific backup
cp backups/20241128_160000/*.json data/
```

## Migration to Database (Future)

If you need to scale beyond file-based storage, the API routes can be updated to use a database while keeping the same interface:

```typescript
// Example: Switch to database
export async function GET() {
  const data = await db.personalizations.findFirst();
  return NextResponse.json(data);
}
```

The client code (`PersonalizationContext` and `useBrandConfigs`) won't need changes.

## Troubleshooting

### Issue: Personalizations not persisting

**Solution:**
1. Check `/data` directory exists and is writable
2. Check browser console for API errors
3. Verify server logs for file write errors

### Issue: Old localStorage data conflicts

**Solution:**
Clear browser localStorage and reload:
```javascript
localStorage.removeItem('personalization-customizations');
localStorage.removeItem('brand-configs');
```

### Issue: File permissions error

**Solution:**
```bash
chmod -R 755 data/
```

### Issue: Data not loading on customer view

**Solution:**
1. Check API endpoints are accessible: `/api/personalizations`
2. Verify JSON files are valid (use `cat data/*.json | jq`)
3. Check server logs for errors

## Testing

### Test API Endpoints

```bash
# Test personalizations
curl http://localhost:3000/api/personalizations

# Test brand configs
curl http://localhost:3000/api/brand-configs

# Test save
curl -X POST http://localhost:3000/api/personalizations \
  -H "Content-Type: application/json" \
  -d '{"customizations":{"test":{"value":"hello"}}}'
```

### Test with Dev Server

```bash
npm run dev

# In another terminal, test endpoints
curl http://localhost:3000/api/personalizations
```

## Security Considerations

1. **Input Validation**: All POST requests validate data structure
2. **Error Handling**: Graceful fallbacks prevent data loss
3. **File System**: JSON files are in a dedicated `/data` directory
4. **Git Exclusion**: User data files are gitignored by default

## Benefits

✅ **Persistent Across Sessions**: Data survives browser clears and new devices  
✅ **Multi-User Support**: Different configurations per business/customer  
✅ **Backup Friendly**: Simple JSON files, easy to backup and restore  
✅ **Fallback Ready**: localStorage fallback ensures reliability  
✅ **SSR Compatible**: Data loads server-side for better UX  
✅ **Simple Architecture**: No database required for basic deployments  

## Next Steps

For production deployments, consider:
- Setting up automated backups
- Adding authentication/authorization for API endpoints
- Migrating to a database for multi-server setups
- Adding data versioning for rollback capability
