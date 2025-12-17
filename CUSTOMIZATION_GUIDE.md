# Customization Guide

## Overview

The Business Settings module provides comprehensive customization capabilities for white-label branding and configuration management. This guide explains how to use all the features effectively.

## Features

### 1. Business Profile Management
Edit your business information visible to customers:
- Business name and category
- Description
- Contact information (address, phone, email, website)
- Operating hours

All changes are saved to localStorage and persist across sessions.

### 2. White-Label Branding

#### Text Content
- **Platform Name**: The name displayed in the header
- **Tagline**: Descriptive text on the main page
- **Button Labels**: Customize primary and secondary CTA text

#### Visual Branding
- **Logo URL**: Your brand's logo (PNG recommended)
- **Hero Image URL**: Main homepage image
- **Primary Color**: Main brand color for buttons and highlights
- **Accent Color**: Secondary color for offers and CTAs
- **Background Color**: Platform background color

#### Style Properties (Sliders)
- **Border Radius** (0-24px): Control corner rounding on cards and buttons
- **Spacing** (1-8): Adjust spacing between elements
- **Font Size** (12-20px): Set base font size

All sliders are fully functional and update in real-time.

### 3. Configuration Management

#### Export Configuration
Export your complete customization to a JSON file:
1. Click the **"Exportar"** button in the top-right corner
2. A JSON file will be downloaded with format: `customization-{businessId}-{timestamp}.json`

The exported file includes:
- All business profile data
- Complete branding configuration
- Style properties
- Metadata (version, export date, business ID)

#### Import Configuration
Load a previously exported configuration:
1. Click the **"Importar"** button
2. Select a JSON configuration file
3. Review the imported settings
4. Click **"Guardar"** buttons to apply changes

#### Reset to Defaults
Restore all settings to default values:
1. Click the **"Restablecer"** button
2. Confirm the action
3. All settings return to platform defaults

### 4. Save Functionality

Two independent save systems:

#### Business Profile
- Click **"Guardar Cambios"** in the Business Profile card
- Saves to: `localStorage['business-profile-{businessId}']`
- Persists name, category, description, contact info

#### Branding Configuration
- Click **"Guardar Marca"** in the White-Label Branding card
- Saves to: `localStorage['brand-configs']`
- Immediately applies colors to the platform
- Persists all visual and style settings

## Configuration File Format

```json
{
  "business": {
    "name": "Mi Negocio",
    "category": "food",
    "description": "Descripción del negocio",
    "address": "Calle Principal 123",
    "phone": "(555) 123-4567",
    "hours": "Lun-Vie: 9am-6pm",
    "email": "contacto@negocio.com",
    "website": "https://www.negocio.com"
  },
  "branding": {
    "platformName": "Mis Cupones",
    "primaryColor": "oklch(0.45 0.15 250)",
    "accentColor": "oklch(0.68 0.19 35)",
    "primaryColorHex": "#4F46E5",
    "accentColorHex": "#E8965A",
    "backgroundColor": "#f7f7fb",
    "logoUrl": "https://ejemplo.com/logo.png",
    "heroImageUrl": "https://ejemplo.com/hero.jpg",
    "tagline": "Tu eslogan personalizado",
    "primaryButtonLabel": "Ver Ofertas",
    "secondaryButtonLabel": "Personalizar",
    "borderRadius": 12,
    "spacing": 4,
    "fontSize": 16,
    "businessId": "partner-123"
  },
  "metadata": {
    "version": "1.0.0",
    "exportedAt": "2024-11-28T15:50:00.000Z",
    "businessId": "partner-123"
  }
}
```

## Technical Details

### Color System
- Colors are stored in OKLCH format for better perceptual uniformity
- Hex values are converted to/from OKLCH automatically
- Color pickers use hex for user convenience
- Both formats are saved in exports for compatibility

### Storage
- Business profiles: `localStorage['business-profile-{businessId}']`
- Brand configs: `localStorage['brand-configs']` (all businesses)
- Automatic persistence on save
- JSON format for easy backup/transfer

### Type Safety
All configuration objects are fully typed:
- `BrandConfig`: Brand customization interface
- `CustomizationConfig`: Complete export format
- `Business`: Business profile data

### Validation
- Import validates JSON structure
- Missing properties use defaults
- Invalid colors fallback to defaults
- Category values validated against enum

## Best Practices

1. **Export Regularly**: Keep backups of your customizations
2. **Test Changes**: Preview before saving to production
3. **Use High-Quality Images**: Logos should be PNG with transparency
4. **Color Contrast**: Ensure text readability with chosen colors
5. **Consistent Branding**: Use the same config across environments

## Troubleshooting

### Sliders Not Moving
- Ensure you're clicking and dragging on the slider track
- Values should update in real-time next to the label
- Try refreshing if sliders appear frozen

### Text Not Editable
- Click directly in the input field
- Ensure the field isn't disabled
- Check browser console for errors

### Colors Not Applying
- Click "Guardar Marca" after color changes
- Colors apply immediately on save
- Refresh page if colors don't update

### Import Not Working
- Verify JSON file format matches schema
- Check browser console for validation errors
- Ensure file isn't corrupted

### Save Not Persisting
- Check browser localStorage isn't disabled
- Verify you have storage quota available
- Private browsing may limit storage

## API Integration

For programmatic access, all configuration is available via localStorage:

```javascript
// Read brand configs
const configs = JSON.parse(localStorage.getItem('brand-configs') || '{}');

// Read business profile
const businessId = 'partner-123';
const profile = JSON.parse(localStorage.getItem(`business-profile-${businessId}`) || '{}');

// Write brand config
const newConfig = { /* config object */ };
localStorage.setItem('brand-configs', JSON.stringify(newConfig));
```

## Migration from Legacy

If migrating from an older version:
1. Export existing config if available
2. Update to latest version
3. Import config or reconfigure manually
4. Test all features
5. Export new backup

## Support

For issues or questions:
- Check this guide first
- Review browser console for errors
- Verify configuration file format
- Test in different browser if issues persist
