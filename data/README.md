# User Personalization Data

This directory stores user personalization and brand configuration data as JSON files on the server.

## Files

- **personalizations.json** - Stores UI element customizations (text, colors, styles)
- **brand-configs.json** - Stores brand/business theme configurations

## Structure

### personalizations.json
```json
{
  "customizations": {
    "element-id": {
      "property-name": "value"
    }
  },
  "lastUpdated": "2024-11-28T16:00:00.000Z"
}
```

### brand-configs.json
```json
{
  "configs": {
    "business-id": {
      "platformName": "My Platform",
      "primaryColor": "#3b82f6",
      "accentColor": "#8b5cf6",
      "logoUrl": "...",
      "tagline": "..."
    }
  },
  "lastUpdated": "2024-11-28T16:00:00.000Z"
}
```

## API Endpoints

### Personalizations
- `GET /api/personalizations` - Load personalizations
- `POST /api/personalizations` - Save personalizations
- `DELETE /api/personalizations` - Clear personalizations

### Brand Configs
- `GET /api/brand-configs` - Load brand configurations
- `POST /api/brand-configs` - Save brand configurations
- `DELETE /api/brand-configs` - Clear brand configurations

## Backup & Restore

The JSON files can be backed up regularly and restored as needed. They are excluded from git by default to prevent committing user data.

## Initial Setup

If files don't exist, they will be automatically created when the server starts or when first accessed via the API.
