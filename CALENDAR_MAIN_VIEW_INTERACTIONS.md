# Calendar Main View Interaction Behavior Documentation

## Overview
The Calendar Main View is the central component that displays calendar content, handles appointment management, search/filtering, and provides various calendar viewing modes. This document describes every interaction behavior that developers need to implement.

## 1. Header Section Behaviors

### Profile Image Display
- **Location**: Top-left corner of header
- **Size**: 40px × 40px circular image
- **Default Image**: `/profile-placeholder.jpg`
- **Error Handling**: Falls back to Unsplash image if default fails
- **Styling**: Rounded-full with overflow hidden

### Date Display
- **Position**: Next to profile image
- **Format**: Changes based on current view mode:
  - **Day View**: "MMMM d, yyyy" (e.g., "March 15, 2024")
  - **Week View**: "MMM d - MMM d, yyyy" (e.g., "Mar 10 - Mar 16, 2024")
  - **Month View**: "MMMM yyyy" (e.g., "March 2024")
  - **Agenda View**: Same as Day view
- **Styling**: 2xl font, semibold, gray-800 text

## 2. Search Functionality Behavior

### Search Input Field
- **Location**: Center of header, maximum width 400px
- **Placeholder**: "Search appointments..."
- **Icon**: MagnifyingGlass icon on the left
- **Real-time Search**: Filters as user types
- **Search Targets**:
  - Event titles
  - Appointment types
  - Locations
  - Notes
  - Person names (in agenda view)
  - Programs and categories (in agenda view)
  - Status text (in agenda view)

### Search State Management
- **External Mode**: Uses `searchQuery` prop and `onSearchChange` callback
- **Internal Mode**: Uses `internalSearchQuery` state when no external handler
- **Auto-detection**: Automatically chooses mode based on prop availability
- **Case Insensitive**: All searches ignore case

## 3. Filter System Behavior

### Filter Toggle Button
- **Icon**: Funnel icon
- **Size**: 40px × 40px (w-10 h-10)
- **States**:
  - **Default**: Gray border and text
  - **Active Filters**: Blue background and border
  - **Dropdown Open**: Blue background
- **Badge**: Shows count of active filters (1-4) in top-right corner

### Filter Dropdown Panel
- **Trigger**: Click filter button
- **Position**: Right-aligned, below button with 8px margin
- **Size**: 288px width (w-72)
- **Close Behavior**: Clicks outside panel close it automatically
- **Z-index**: 50 to appear above other content

### Filter Options
1. **Person Appointments Only**
   - **Icon**: UserIcon
   - **Target**: Events with `type: 'Individual'`
   - **Color Theme**: Blue hover states

2. **Group Appointments Only**
   - **Icon**: UserGroupIcon  
   - **Target**: Events with `type: 'Group'`
   - **Color Theme**: Green hover states

3. **Provider Reservations Only**
   - **Icon**: Cog6ToothIcon
   - **Target**: Events with `type: 'Provider'`
   - **Color Theme**: Purple hover states

4. **Appointments in Next X Hours**
   - **Icon**: ClockIcon
   - **Dropdown**: Select 1, 2, 3, 4, 6, 8, 12, or 24 hours
   - **Logic**: Calculates time difference from current time
   - **Color Theme**: Orange hover states
   - **Interaction**: Dropdown only enabled when checkbox is checked

### Filter Combination Logic
- **Individual Filters**: Each can be active independently
- **Time Filter**: Can combine with type filters or work alone
- **All Active**: Shows only events matching ALL selected criteria
- **Clear Button**: Resets all filters to false/default values

### Result Count Display
- **Location**: Filter dropdown header
- **Shows**: Number of filtered results
- **Color**: Blue badge with border
- **Views**: Shows `agendaData.length` for agenda, `filteredEvents.length` for others

## 4. View Selection Behavior

### View Dropdown Menu
- **Trigger**: Button showing current view name
- **Options**: Day, Week, Month, Agenda
- **Icons**: Each option shows CheckIcon when active
- **Keyboard Shortcuts**: Displayed on right side (1/D, 0/W, M, A)
- **Alignment**: Right-aligned dropdown

### View Change Effects
- **Date Format**: Header date format changes based on view
- **Content Area**: Completely different rendering for each view
- **Provider Layout**: Day view automatically uses columns layout
- **URL/State**: Calls `onViewChange` callback with selected view

### Additional Menu Options
- **Number of days**: Submenu option (not implemented)
- **View Settings**: Calls `onSettingsClick` callback
- **Keyboard Support**: Shortcuts work when dropdown is focused

## 5. Navigation Controls Behavior

### Today Button
- **Action**: Calls `goToToday()` which sets date to `new Date()`
- **Styling**: Gray border and text, hover background change
- **Always Available**: Works in all view modes

### Agenda Toggle Button
- **Dual Purpose**: 
  - If current view is agenda → switches to day view
  - If current view is not agenda → switches to agenda view
- **Visual States**: Blue when agenda is active, gray when not
- **Text**: Always shows "Agenda"

### Arrow Navigation
- **Previous Button**: ArrowLeft icon, calls `goToPrevDate()`
- **Next Button**: ArrowRight icon, calls `goToNextDate()`
- **Date Logic**:
  - **Day**: Adds/subtracts 1 day
  - **Week**: Adds/subtracts 7 days  
  - **Month**: Adds/subtracts 1 month
  - **Agenda**: Same as day view

## 6. Settings Menu Behavior

### Settings Dropdown Trigger
- **Icon**: Cog6ToothIcon (gear icon)
- **Size**: 20px × 20px (w-5 h-5)
- **Hover**: Gray background circle
- **Alignment**: Right-aligned dropdown

### Settings Menu Options

#### Primary Actions
1. **Transfer**: Logs "Transfer clicked" (placeholder)
2. **Print**: Calls `window.print()`
3. **Refresh**: Logs "Refresh clicked" (placeholder)  
4. **Export to Outlook**: Logs action (placeholder)

#### Provider Layout Submenu
- **Trigger**: Shows current layout icon (Squares2X2, QueueList, or ViewColumns)
- **Side Panel**: Opens to the right
- **Options**:
  - **Horizontal Tabs**: Squares2X2Icon, traditional tab interface
  - **Vertical Stack**: QueueListIcon, providers stacked vertically
  - **Side-by-Side (Day Only)**: ViewColumnsIcon, responsive columns
- **Check Marks**: Green checkmark shows active selection
- **Smart Behavior**: Day view automatically uses columns regardless of setting

#### Color Schemes Submenu
- **Trigger**: SwatchIcon with "Color Schemes" text
- **Side Panel**: Opens to the right
- **Categories**: Facility, Category, Location
- **Color Previews**: Shows current color as 12px circle
- **Color Pickers**: 3 color options per category as clickable circles
- **Interactive**: Clicking color updates `colorSchemes` state
- **Stop Propagation**: Color clicks don't close menu

## 7. Provider Tab System Behavior

### Visibility Rules
- **Show When**: `displayProviders.length > 0` AND `effectiveLayoutMode === 'tabs'`
- **Hide When**: No providers selected OR layout mode is vertical/columns
- **Layout**: Horizontal scrolling tabs below header

### Tab Rendering
- **Source**: Uses `displayProviders` (filtered from selected providers)
- **Active State**: Blue background and border for active tab
- **Inactive State**: Gray text with transparent border
- **Hover**: Gray background and darker text
- **Client Count**: Shows in parentheses with different colors for active/inactive

### Tab Selection Behavior
- **Click Action**: Sets `activeProviderId` to clicked provider's value
- **Default Selection**: First provider automatically selected on load
- **State Sync**: Updates when `selectedProvidersList` changes
- **Overflow**: Horizontal scroll when tabs exceed container width

## 8. Layout Mode Behaviors

### Smart Layout Detection
- **Function**: `getEffectiveLayoutMode()` determines actual layout to use
- **Day View Override**: Always returns 'columns' for day view with providers
- **Other Views**: Respects user's `providerLayoutMode` preference
- **Automatic**: No user interaction needed for day view columns

### Columns Layout (Day View Only)
- **Trigger**: Day view with one or more providers
- **Container**: Flexbox with full height
- **Responsive Width**:
  - 1 provider: Full width (w-full)
  - 2 providers: 50% each (w-1/2)  
  - 3 providers: 33% each (w-1/3)
  - 4+ providers: 25% each (w-1/4)
- **Minimum Width**: 300px when more than 2 providers
- **Borders**: Right border between columns, none on last column

#### Column Provider Headers
- **Sticky Position**: `top-0 z-20` stays visible while scrolling
- **Background**: Blue gradient from blue-50 to blue-100
- **Content**: Provider name (truncated) and client count
- **Styling**: Centered text, compact design for space efficiency

#### Column Calendar Content
- **Time Labels**: Compact 48px width (w-12) instead of 64px
- **All-day Section**: Condensed spacing with 8px horizontal padding
- **Time Slots**: Same 24-hour structure as main day view
- **Events**: Full EventCard functionality within each column
- **Scrolling**: Independent vertical scroll per column

### Vertical Layout
- **Trigger**: User selects vertical in settings AND not day view
- **Container**: Full height with vertical scroll
- **Provider Sections**: Stacked with borders between each
- **Minimum Height**: 600px per provider section

#### Vertical Provider Headers  
- **Sticky Position**: `top-0 z-20` stays visible while scrolling
- **Background**: Blue gradient with full padding
- **Icon**: UserIcon on the left
- **Content**: Full provider name and client count badge
- **Spacing**: Generous padding and margins

#### Vertical Calendar Content
- **Full Views**: Each provider gets complete calendar view
- **View Support**: Day, Week, Month, and Agenda views
- **Standard Sizing**: Normal time label width (64px)
- **Independent**: Each provider section works independently

### Horizontal Tabs Layout
- **Trigger**: User selects tabs in settings AND not day view
- **Behavior**: Single calendar view with provider tabs above
- **Active Provider**: Shows calendar for currently selected provider tab
- **Standard Layout**: Uses original calendar layout dimensions

## 9. Calendar View Rendering

### Day View Structure
- **All-day Section**: Top section for full-day events
- **Time Grid**: 24 hourly slots (12-hour AM/PM format)
- **Time Labels**: Right-aligned in 64px column (16px in columns mode)
- **Event Area**: Flexible width area for event placement
- **Minimum Height**: 48px per time slot
- **Borders**: Light gray between time slots

### Week View Integration
- **Component**: Uses WeekView component
- **Props**: `selectedDate`, `events`, `timeSlots`, `onEditEvent`
- **Responsive**: Inherits from WeekView component behavior

### Month View Integration  
- **Component**: Uses MonthView component
- **Props**: `selectedDate`, `events`, `onEditEvent`
- **Layout**: Inherits from MonthView component behavior

### Agenda View Rendering
- **Component**: DataTable with AgGrid
- **Data Source**: `mockAgendaData` (10 sample appointments)
- **Columns**: 11 columns including actions
- **Pagination**: 15 rows per page
- **Row Height**: 48px, header height 48px
- **Styling**: Rounded border, gray-200 border color

## 10. Event Card Behavior

### Event Rendering
- **Container**: Absolute positioned within time slot
- **Height**: Fixed 46px
- **Margins**: 8px horizontal margins
- **Background**: Color based on event type or custom backgroundColor
- **Border**: Color-coded based on event type
- **Overflow**: Hidden with rounded corners

### Event Content Display
- **Icon**: UserIcon for Individual, UserGroupIcon for Group
- **Title**: Bold text, truncated if too long
- **Time**: Start-end time format
- **Phone**: Shows mobile number with PhoneIcon if available
- **Status**: Visual indication through colors

### Event Interaction
- **Hover**: Cursor changes to pointer
- **Click**: Opens EventPopover component
- **Edit Action**: Triggers `onEditEvent` callback if provided
- **Popover**: Shows detailed event information and edit options

## 11. Search and Filter Integration

### Event Filtering Logic
- **Search First**: Search filter applied before type filters
- **Type Filters**: Applied if any are active
- **Time Filter**: Can combine with type filters
- **Exit Early**: Failed search immediately excludes event
- **Combination**: Must pass ALL active filters to be shown

### Agenda Filtering Logic
- **Different Fields**: Searches person, program, appointment type, category, status
- **Type Mapping**: Maps agenda types to filter categories
- **Same Logic**: Uses identical filtering structure as events
- **Result Display**: Shows filtered count in filter header

## 12. State Management Rules

### Internal State Variables
- `internalSearchQuery`: Search when no external handler
- `showFilters`: Controls filter dropdown visibility
- `filters`: FilterOptions object with 5 boolean/number properties
- `activeProviderId`: Currently selected provider for tabs
- `providerLayoutMode`: User's layout preference ('tabs'|'vertical'|'columns')
- `isViewDropdownOpen`: View selector dropdown state
- `colorSchemes`: Object with facility/category/location colors

### Derived State
- `currentSearchQuery`: External query or internal query
- `handleSearchChange`: External handler or internal setter
- `displayProviders`: Filtered providers from selected list
- `effectiveLayoutMode`: Smart layout based on view and providers
- `filteredEvents`: Events after search and filter application
- `agendaData`: Agenda items after search and filter application

### External Communication
- `onViewChange`: Called when view selector changes
- `onDateChange`: Called when navigation arrows used
- `onSettingsClick`: Called from settings menu
- `onEditEvent`: Called when event card is edited
- `onSearchChange`: Called when search input changes (if provided)

## 13. Responsive Behavior

### Layout Adaptation
- **Header**: Flexible layout with max-width search in center
- **Provider Columns**: Automatic width calculation based on count
- **Minimum Widths**: Prevents columns from becoming too narrow
- **Scroll Handling**: Independent scrolling areas per layout mode
- **Content Priority**: Essential controls always visible

### Content Scaling
- **Time Labels**: Adjust width based on layout mode
- **Event Cards**: Maintain readability at different sizes
- **Provider Headers**: Truncate text to fit available space
- **Search Field**: Maximum width with flexible behavior

## 14. Error Handling and Edge Cases

### Date Formatting Safety
- **formatDate Function**: Try-catch with fallback to '-'
- **formatTimeRange Function**: Handles invalid dates gracefully
- **Invalid Input**: Logs errors and shows safe fallback text

### Empty States
- **No Events**: Calendar shows empty time slots
- **No Providers**: Hides provider-related UI elements
- **No Search Results**: Shows filtered count of 0
- **Failed Filtering**: Gracefully handles filter edge cases

### Data Validation
- **Provider Lists**: Handles empty arrays and missing data
- **Event Properties**: Safe property access with fallbacks
- **Time Calculations**: Error handling for date math operations
- **Search Input**: Handles special characters and empty strings

This documentation captures every interaction behavior in the Calendar Main View component. Developers should implement each behavior exactly as described to ensure consistent user experience and functionality. 