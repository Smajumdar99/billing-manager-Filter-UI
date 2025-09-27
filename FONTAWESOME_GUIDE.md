# FontAwesome Integration Guide

## Overview

This project uses FontAwesome Pro icons for a comprehensive and professional icon library. The license key is securely stored in environment variables and the configuration is set up for both free and pro icons.

## License Information

- **License Key**: Stored securely in `.env.local` as `VITE_FONTAWESOME_PRO_TOKEN`
- **Registry**: Configured to use FontAwesome Pro registry
- **Security**: License key is excluded from git via `.gitignore`

## Setup Status

✅ **Completed:**
- Environment variables configured
- FontAwesome configuration file created
- Icon wrapper component created
- Free icons library loaded
- CSS imports configured

⏳ **Pending:**
- FontAwesome Pro packages installation (authentication issue)
- Pro icons activation

## Usage

### Basic Icon Usage

```tsx
import { Icon } from '@/components/atoms/Icon';

// Basic icon
<Icon icon="stethoscope" />

// With styling
<Icon icon="heart" className="text-red-500" />

// With size
<Icon icon="user-md" size="2x" />
```

### Healthcare-Specific Icons

```tsx
// Medical equipment
<Icon icon="stethoscope" className="text-blue-600" />
<Icon icon="pills" className="text-green-600" />

// Patient care
<Icon icon="user-md" className="text-blue-700" />
<Icon icon="heart" className="text-red-500" />

// Clinical
<Icon icon="clipboard" className="text-amber-600" />
<Icon icon="file-alt" className="text-blue-500" />
```

### Interactive Icons

```tsx
// Spinning (loading states)
<Icon icon="spinner" spin className="text-blue-600" />

// Pulsing (heartbeat effect)
<Icon icon="heart" pulse className="text-red-500" />

// Clickable
<Icon 
  icon="cog" 
  className="cursor-pointer hover:text-blue-600" 
  onClick={handleSettingsClick}
/>
```

### In Buttons and Components

```tsx
// Button with icon
<button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded">
  <Icon icon="plus" />
  <span>Add Patient</span>
</button>

// Navigation item
<div className="flex items-center space-x-3">
  <Icon icon="calendar" className="text-gray-600" />
  <span>Schedule</span>
</div>
```

## Available Icons (Free Version)

### Healthcare Icons
- `stethoscope` - Medical examination
- `heart` - Cardiology, vital signs
- `pills` - Medication, pharmacy
- `user-md` - Healthcare provider
- `hospital` - Medical facility
- `ambulance` - Emergency services
- `clipboard` - Medical records
- `file-alt` - Documents, reports

### Common UI Icons
- `user` - Patient, profile
- `calendar` - Scheduling, appointments
- `home` - Dashboard, main
- `chart-bar` - Analytics, reports
- `cog` - Settings, configuration
- `bell` - Notifications, alerts
- `search` - Search functionality
- `filter` - Data filtering
- `plus` / `minus` - Add/remove actions
- `edit` - Edit functionality
- `trash` - Delete actions
- `save` - Save operations
- `print` - Print documents
- `download` / `upload` - File operations
- `eye` / `eye-slash` - Show/hide
- `lock` / `unlock` - Security
- `check` / `times` - Success/error states

## Pro Icons (Available Once Installed)

### Advanced Healthcare Icons
- `user-medical` - Medical professional
- `heart-pulse` - Cardiac monitoring
- `prescription-bottle` - Prescriptions
- `calendar-check` - Appointment confirmation
- `clipboard-check` - Completed tasks
- `user-nurse` - Nursing staff
- `hospital-user` - Patient in hospital
- `bed-pulse` - Patient monitoring
- `file-medical` - Medical records
- `kit-medical` - Medical kit
- `truck-medical` - Medical transport
- `hand-holding-medical` - Medical assistance
- `syringe` - Injections, vaccines
- `thermometer` - Temperature monitoring
- `bandage` - Wound care
- `x-ray` - Radiology
- `dna` - Genetics
- `microscope` - Laboratory
- `vial` - Lab samples
- `tablets` - Medication
- `capsules` - Pills
- `weight` - Patient weight
- `ruler-vertical` - Height measurement
- `eye-dropper` - Medication administration
- `lungs` - Respiratory
- `brain` - Neurology
- `tooth` - Dental
- `bone` - Orthopedics
- `wheelchair` - Accessibility
- `crutch` - Mobility aids
- `glasses` - Vision
- `hearing-aid` - Hearing assistance

## Icon Properties

### Size Options
- `xs` - Extra small
- `sm` - Small
- `lg` - Large
- `1x` to `10x` - Numeric sizes

### Animation Options
- `spin` - Continuous rotation
- `pulse` - Pulsing effect

### Transform Options
- `flip` - Horizontal, vertical, or both
- `rotation` - 90, 180, 270 degrees

### Other Options
- `fixedWidth` - Consistent width alignment
- `inverse` - Inverted colors

## File Structure

```
src/
├── lib/
│   └── fontawesome.ts          # FontAwesome configuration
├── components/
│   ├── atoms/
│   │   └── Icon/
│   │       ├── Icon.tsx        # Icon wrapper component
│   │       └── index.ts        # Export file
│   └── examples/
│       └── FontAwesomeExample.tsx  # Usage examples
└── App.tsx                     # FontAwesome import
```

## Environment Files

```
.env.local                      # FontAwesome Pro license key
.npmrc                         # FontAwesome Pro registry config
```

## Migration from Heroicons

When migrating from Heroicons to FontAwesome:

1. Replace Heroicon imports with Icon component
2. Update icon names to FontAwesome equivalents
3. Adjust sizing (Heroicons uses className, FontAwesome uses size prop)
4. Update styling classes as needed

### Example Migration

```tsx
// Before (Heroicons)
import { UserIcon } from '@heroicons/react/24/outline';
<UserIcon className="h-6 w-6 text-gray-600" />

// After (FontAwesome)
import { Icon } from '@/components/atoms/Icon';
<Icon icon="user" size="lg" className="text-gray-600" />
```

## Next Steps

1. **Resolve FontAwesome Pro Authentication**: Contact FontAwesome support if needed
2. **Install Pro Packages**: Once authentication is resolved
3. **Activate Pro Icons**: Uncomment pro icon imports in `fontawesome.ts`
4. **Update Components**: Gradually migrate from Heroicons to FontAwesome
5. **Add More Icons**: Expand the icon library as needed

## Support

- **FontAwesome Documentation**: https://fontawesome.com/docs
- **React FontAwesome**: https://github.com/FortAwesome/react-fontawesome
- **Pro License Support**: https://fontawesome.com/support

## Security Notes

- Never commit `.env.local` or `.npmrc` to version control
- License key is for this project only
- Keep license key secure and don't share publicly
- Use environment variables for sensitive configuration
