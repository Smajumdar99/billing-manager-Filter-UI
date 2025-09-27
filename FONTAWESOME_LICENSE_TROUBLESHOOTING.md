# FontAwesome Pro License Troubleshooting

## Issue
License key `FAPS-CHWA-TKMW-THQR-7067` is not authenticating with FontAwesome Pro registry.

## Possible Causes & Solutions

### 1. License Key Activation Required
**Most Likely Cause**: The license key needs to be activated on FontAwesome's website first.

**Solution Steps:**
1. Go to https://fontawesome.com/
2. Create an account or log in
3. Go to your account settings/license section
4. Enter the license key: `FAPS-CHWA-TKMW-THQR-7067`
5. Activate the license for npm usage

### 2. Account Linking Required
**Cause**: License key might need to be linked to a FontAwesome account.

**Solution Steps:**
1. Visit https://fontawesome.com/account
2. Link the license key to your account
3. Generate an npm token from your account dashboard
4. Use the generated token instead of the license key

### 3. Different Authentication Format
**Cause**: Some license keys require a different format.

**Try These Formats:**
```bash
# Format 1: Direct license key (current)
npm config set "//npm.fontawesome.com/:_authToken" FAPS-CHWA-TKMW-THQR-7067

# Format 2: With Bearer prefix
npm config set "//npm.fontawesome.com/:_authToken" "Bearer FAPS-CHWA-TKMW-THQR-7067"

# Format 3: Account-generated token (from FontAwesome dashboard)
npm config set "//npm.fontawesome.com/:_authToken" "YOUR_GENERATED_TOKEN"
```

### 4. Contact FontAwesome Support
If the above doesn't work, contact FontAwesome support:
- **Email**: support@fontawesome.com
- **License Key**: FAPS-CHWA-TKMW-THQR-7067
- **Issue**: Cannot authenticate with npm registry for Pro packages

## Current Workaround

While waiting for Pro access, you can use the extensive free icon library:

### Available Free Icons (40+ icons)
```tsx
// Healthcare specific
<Icon icon="stethoscope" />
<Icon icon="heart" />
<Icon icon="pills" />
<Icon icon="user-md" />
<Icon icon="hospital" />
<Icon icon="ambulance" />

// UI icons
<Icon icon="user" />
<Icon icon="calendar" />
<Icon icon="bell" />
<Icon icon="search" />
<Icon icon="cog" />
<Icon icon="chart-bar" />
```

## Testing Authentication

To test if authentication is working:
```bash
npm view @fortawesome/pro-solid-svg-icons --registry https://npm.fontawesome.com/
```

If successful, you should see package information instead of authentication errors.

## Next Steps

1. **Activate License**: Follow steps above to activate license key
2. **Test Authentication**: Run the test command
3. **Install Pro Packages**: Once authentication works:
   ```bash
   npm install @fortawesome/pro-solid-svg-icons @fortawesome/pro-regular-svg-icons @fortawesome/pro-light-svg-icons @fortawesome/pro-duotone-svg-icons @fortawesome/pro-thin-svg-icons
   ```
4. **Enable Pro Icons**: Uncomment Pro icon imports in `/src/lib/fontawesome.ts`

## Pro Icons Ready to Activate

Once Pro packages are installed, you'll have access to 30+ additional healthcare icons:
- `user-medical` - Medical professional
- `heart-pulse` - Cardiac monitoring  
- `prescription-bottle` - Prescriptions
- `syringe` - Injections
- `thermometer` - Temperature
- `x-ray` - Radiology
- `wheelchair` - Accessibility
- And many more...

## Current Status
✅ Free FontAwesome icons working
✅ Configuration files ready
✅ Components updated to use FontAwesome
⏳ Pro package installation pending authentication
