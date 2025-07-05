# Mobile Bottom Navigation System

A comprehensive mobile-first navigation solution that provides bottom navigation for mobile devices while preserving desktop functionality.

## 🎯 Overview

This system provides three main components:

1. **MobileBottomNavigation** - Bottom navigation bar with overlay menu for mobile
2. **ResponsiveNavigation** - Smart wrapper that shows appropriate navigation based on screen size
3. **ResponsiveLayout** - Complete layout solution for easy integration

## 📱 Features

### Mobile Bottom Navigation
- **Fixed Bottom Bar**: Always accessible navigation at bottom of screen
- **Primary Actions**: Dashboard, Schedule, Clients, Notifications in bottom bar
- **Overlay Menu**: Expandable menu for additional navigation items
- **Search Integration**: Built-in search functionality with overlay
- **Smart Interactions**: Tap outside to close, smooth animations

### Desktop Preservation
- **Zero Impact**: Desktop functionality remains completely unchanged
- **Existing Components**: Uses your current TopNavigationBar and MainNavigationBar
- **Same Props**: All existing props and callbacks work exactly the same

### Responsive Design
- **Automatic Detection**: Shows appropriate navigation based on screen size
- **Tailwind Breakpoints**: Uses `md:` breakpoint for desktop/mobile switching
- **Consistent Experience**: Same functionality across all devices

## 🚀 Quick Start

### Option 1: Use ResponsiveLayout (Recommended)

Replace your existing navigation setup with ResponsiveLayout:

```tsx
// Before (Desktop only)
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';

const MyPage = () => (
  <div>
    <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
    <MainNavigationBar activeItem="Dashboard" />
    <main>{/* Your content */}</main>
  </div>
);

// After (Responsive)
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout/responsive-layout';

const MyPage = () => (
  <ResponsiveLayout
    hospitalName="Demo Hospital"
    userAvatarUrl="/avatar.png"
    activeItem="Dashboard"
  >
    {/* Your content */}
  </ResponsiveLayout>
);
```

### Option 2: Use ResponsiveNavigation Component

For more control over layout:

```tsx
import ResponsiveNavigation from '@/components/organisms/ResponsiveNavigation/responsive-navigation';

const MyPage = () => (
  <div className="min-h-screen">
    <ResponsiveNavigation
      hospitalName="Demo Hospital"
      userAvatarUrl="/avatar.png"
      activeItem="Dashboard"
      onSearch={(term) => console.log('Search:', term)}
      onNavigate={(item) => console.log('Navigate to:', item)}
    />
    <main>{/* Your content */}</main>
  </div>
);
```

### Option 3: Use MobileBottomNavigation Directly

For custom implementations:

```tsx
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation/mobile-bottom-navigation';

const MyPage = () => (
  <div>
    {/* Your existing desktop navigation */}
    <div className="hidden md:block">
      <TopNavigationBar {...props} />
      <MainNavigationBar {...props} />
    </div>
    
    {/* Mobile navigation */}
    <MobileBottomNavigation
      activeItem="Dashboard"
      onSearch={(term) => handleSearch(term)}
      onNavigate={(item) => handleNavigate(item)}
    />
    
    <main>{/* Your content */}</main>
  </div>
);
```

## 🎨 Navigation Items

### Primary Items (Bottom Bar)
- **Dashboard** - Home/overview page
- **Schedule** - Calendar and appointments
- **Clients** - Patient management
- **Notifications** - Alerts and messages

### Secondary Items (Overlay Menu)
- **ADL** - Activities of Daily Living
- **Wait List** - Patient wait list management
- **Staff Dashboard** - Staff management
- **Practice** - Practice settings
- **Billing** - Billing and payments
- **Reports** - Analytics and reports
- **Inbox** - Task management
- **Administration** - System administration

## 🔧 Props Reference

### ResponsiveLayout Props

```tsx
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  
  // Navigation
  hospitalName: string;
  userAvatarUrl: string;
  activeItem?: string;
  onSearch?: (searchTerm: string) => void;
  onNavigate?: (itemName: string) => boolean | void;
  
  // Patient data (optional)
  patient?: {
    id: string;
    name: string;
    avatar?: string;
    gender: string;
    age?: number;
    bloodGroup?: string;
    insuranceProvider?: string;
    // ... other patient fields
  };
  
  // User info (optional)
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  
  // Callbacks (optional)
  onNewEncounter?: () => void;
  onViewChart?: () => void;
  
  // Styling (optional)
  className?: string;
  contentClassName?: string;
}
```

### MobileBottomNavigation Props

```tsx
interface MobileBottomNavigationProps {
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
  onSearch?: (searchTerm: string) => void;
}
```

## 📱 Mobile Experience

### Bottom Navigation Bar
- **Fixed Position**: Always visible at bottom of screen
- **4 Primary Items**: Most important navigation options
- **Menu Button**: Access to additional navigation items
- **Visual Feedback**: Active states and hover effects

### Overlay Menu
- **Slide Up Animation**: Smooth overlay appearance
- **Quick Access Section**: Primary items repeated for easy access
- **More Options Section**: Secondary navigation items
- **Search Integration**: Built-in search functionality
- **Close Interactions**: Tap outside or close button to dismiss

### Search Functionality
- **Expandable Search**: Tap search icon to show search bar
- **Auto Focus**: Keyboard appears automatically
- **Cancel Option**: Easy to dismiss search
- **Form Submission**: Handles search form submission

## 🎯 Design Principles

### Apple-Style Elegance
- **Clean Interface**: Minimal, uncluttered design
- **Smooth Animations**: Subtle transitions and feedback
- **Consistent Spacing**: Proper padding and margins
- **Professional Colors**: Blue accent with gray neutrals

### User Experience
- **Thumb-Friendly**: Bottom navigation optimized for mobile interaction
- **Quick Access**: Most important features always visible
- **Progressive Disclosure**: Additional options available when needed
- **Familiar Patterns**: Uses standard mobile navigation conventions

### Accessibility
- **Touch Targets**: Proper sizing for finger interaction
- **Visual Feedback**: Clear active and hover states
- **Keyboard Support**: Full keyboard navigation support
- **Screen Reader**: Proper ARIA labels and semantic HTML

## 🔄 Migration Guide

### Step 1: Install Components
Copy the component files to your project:
- `MobileBottomNavigation/mobile-bottom-navigation.tsx`
- `ResponsiveNavigation/responsive-navigation.tsx`
- `ResponsiveLayout/responsive-layout.tsx`

### Step 2: Update Existing Pages
Replace your navigation setup with ResponsiveLayout:

```tsx
// Find this pattern in your pages:
<TopNavigationBar {...topNavProps} />
<MainNavigationBar {...mainNavProps} />

// Replace with:
<ResponsiveLayout {...combinedProps}>
  {/* existing content */}
</ResponsiveLayout>
```

### Step 3: Test Responsive Behavior
- **Desktop**: Verify existing functionality works unchanged
- **Mobile**: Test bottom navigation and overlay menu
- **Tablet**: Check behavior at breakpoint boundaries

### Step 4: Customize as Needed
- **Navigation Items**: Modify primary/secondary item arrays
- **Styling**: Adjust colors, spacing, animations
- **Functionality**: Add custom search or navigation logic

## 🎨 Customization

### Adding Navigation Items

```tsx
// In mobile-bottom-navigation.tsx
const primaryNavItems = [
  // Add new primary item
  { 
    name: 'NewFeature', 
    icon: NewIcon, 
    iconSolid: NewIconSolid, 
    route: '/new-feature' 
  },
  // ... existing items
];

const secondaryNavItems = [
  // Add new secondary item
  { 
    name: 'NewSection', 
    icon: <NewSectionIcon className="h-5 w-5" />, 
    route: '/new-section' 
  },
  // ... existing items
];
```

### Styling Customization

```tsx
// Modify colors, spacing, animations
const customStyles = {
  bottomBar: "bg-white border-t border-gray-200 shadow-lg",
  activeItem: "text-blue-600",
  inactiveItem: "text-gray-500 hover:text-gray-700",
  overlay: "bg-white rounded-t-xl shadow-2xl",
};
```

### Search Integration

```tsx
const handleSearch = (searchTerm: string) => {
  // Custom search logic
  console.log('Searching for:', searchTerm);
  
  // Example: Navigate to search results
  navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  
  // Example: Filter current page content
  setFilteredItems(items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Bottom Navigation Not Showing**
   - Check that you're viewing on mobile (screen width < 768px)
   - Verify `md:hidden` class is working correctly

2. **Desktop Navigation Broken**
   - Ensure `hidden md:block` classes are applied correctly
   - Check that all props are passed through properly

3. **Overlay Not Closing**
   - Verify click outside handler is working
   - Check z-index conflicts with other components

4. **Search Not Working**
   - Ensure `onSearch` callback is provided
   - Check form submission handling

### Debug Tips

```tsx
// Add debug logging
const handleNavigate = (itemName: string) => {
  console.log('Navigation attempt:', itemName);
  console.log('Current active item:', activeItem);
  console.log('Screen size:', window.innerWidth);
  return true; // or false to prevent navigation
};
```

## 📚 Examples

See the complete example in:
- `src/examples/MyCalendarWithResponsiveNav.tsx`

This shows a full calendar page implementation with responsive navigation.

## 🎉 Benefits

### For Users
- **Mobile Optimized**: Native mobile navigation experience
- **Consistent Interface**: Same functionality across devices
- **Quick Access**: Important features always available
- **Familiar Patterns**: Standard mobile navigation conventions

### For Developers
- **Easy Integration**: Drop-in replacement for existing navigation
- **Zero Breaking Changes**: Desktop functionality preserved
- **Flexible Architecture**: Use components individually or together
- **Maintainable Code**: Clean separation of concerns

### For Business
- **Better Mobile Experience**: Improved user engagement on mobile
- **Reduced Development Time**: Pre-built responsive solution
- **Consistent Branding**: Apple-style design throughout
- **Future Proof**: Scalable architecture for new features
