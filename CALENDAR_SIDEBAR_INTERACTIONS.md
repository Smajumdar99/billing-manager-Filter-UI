# Calendar Sidebar Interaction Behavior Documentation

## Overview
The Calendar Sidebar is the left navigation panel that provides users with calendar controls, appointment creation, and filtering options. This document describes every interaction behavior that developers need to implement.

## 1. Sidebar Collapse/Expand Behavior

### Visual States
- **Expanded State**: Sidebar width is 256px (w-64), showing all content
- **Collapsed State**: Sidebar width is 48px (w-12), showing only icons

### Interaction Behavior
- **Toggle Button**: Located at top-left corner with a Squares2X2Icon
- **Click Action**: Clicking toggles between expanded and collapsed states
- **Animation**: Smooth transition using `transition-all duration-300`
- **Accessibility**: Button has proper aria-label that changes based on state

### What Happens When Collapsed
- All text content disappears
- Only essential icons remain visible
- New Appointment button becomes a circular plus icon
- Mini calendar, locations, providers, and programs sections are hidden
- Background gradients continue to animate

## 2. New Appointment Button Behavior

### Expanded State
- **Appearance**: Full-width rounded button with "New Appointment" text
- **Icon**: Plus icon on the left side
- **Styling**: White background with backdrop blur effect

### Collapsed State  
- **Appearance**: Circular button with only plus icon
- **Tooltip**: Shows "..." on hover (should be "New Appointment")
- **Position**: Centered in the collapsed sidebar

### Click Behavior
- **Action**: Opens the Appointment Modal
- **Modal State**: Sets `isModalOpen` to true
- **Props Passed**: providers, patients, selectedDate, startTime (09:00), endTime (10:00)

## 3. Mini Calendar Behavior

### Visibility Rules
- **Show**: Only when sidebar is expanded (`!isCollapsed`)
- **Hide**: Completely hidden when sidebar is collapsed

### Month Navigation
- **Previous Button**: ChevronLeft icon, subtracts 30 days from current date
- **Next Button**: ChevronRight icon, adds 30 days to current date
- **Month Display**: Shows current month and year in "MMMM yyyy" format

### Calendar Grid Behavior
- **Week Start**: Starts on Monday (European style)
- **Previous Month Days**: Shown in light gray when needed to fill grid
- **Current Month Days**: Full opacity and clickable
- **Today Highlighting**: Blue background (`bg-blue-50/80`) and blue text
- **Selected Date**: Gray background when not today (`bg-gray-100/80`)
- **Hover Effect**: White background with transparency

### Date Selection
- **Click Action**: Calls `onDateChange(day)` with selected date
- **Visual Feedback**: Selected date gets highlighted background
- **Month Boundary**: Can select dates from previous/next month (shown in gray)

## 4. Locations Section Behavior

### Visibility Rules
- **Show**: Only when sidebar is expanded (`!isCollapsed`)
- **Hide**: Completely hidden when sidebar is collapsed

### Search Functionality
- **Input Field**: "Search locations..." placeholder
- **Real-time Filtering**: Filters as user types
- **Case Insensitive**: Matches location names regardless of case
- **Clear on Type**: Previous search clears when typing new search

### Selection Behavior
- **Select All Checkbox**: 
  - Shows checked when all filtered locations are selected
  - Shows indeterminate when some are selected
  - Clicking selects/deselects all filtered locations
- **Individual Checkboxes**: Each location has its own checkbox
- **Visual Feedback**: Selected locations get blue background (`bg-blue-50/80`)

### Data Filtering Rules
- **Active Only**: Only shows locations with `status: 'active'`
- **Search Match**: Must match search term in location label
- **No Results**: Shows "No locations found" message when no matches

### State Management
- **Local State**: `selectedLocations` array of location values
- **Toggle Function**: `handleLocationToggle` adds/removes from selection
- **Select All Function**: `handleSelectAllLocations` selects/deselects all filtered

## 5. Providers Section Behavior

### Visibility Rules
- **Show**: Only when sidebar is expanded (`!isCollapsed`)
- **Hide**: Completely hidden when sidebar is collapsed

### External Sync Behavior
- **Default Selection**: Defaults to ['sarah_wilson'] if no external selection
- **Sync on Changes**: Updates internal state when external `selectedProviders` changes
- **Notify Parent**: Calls `onProviderSelectionChange` when selection changes
- **Two-way Binding**: Maintains sync between parent and child components

### Filter Menu Behavior
- **Toggle Button**: Funnel icon next to "Providers" title
- **Click to Open**: Shows filter dropdown menu
- **Click Outside**: Closes filter menu automatically
- **Filter Options**: 
  - "Show Inactive Only" checkbox toggles between active/inactive providers

### Search Functionality
- **Input Field**: "Search providers..." placeholder
- **Real-time Filtering**: Filters as user types
- **Case Insensitive**: Matches provider names regardless of case

### Data Filtering Rules
- **Has Clients**: Only shows providers with `clientCount > 0`
- **Status Filter**: Shows active providers by default, inactive when filter toggled
- **Search Match**: Must match search term in provider label
- **Combined Filters**: All filters apply simultaneously

### Selection Behavior
- **Select All Checkbox**: 
  - Header checkbox with indeterminate state support
  - Selects/deselects all currently filtered providers
  - Shows checked when all filtered providers selected
- **Individual Selection**: Each provider has checkbox for selection
- **Visual States**: 
  - Selected: Blue background (`bg-blue-50/80`)
  - Inactive: Strikethrough text and reduced opacity
  - Hover: Light gray background

### Client Count Display
- **Format**: Shows number in blue text in rightmost column
- **Alignment**: Center-aligned in minimum 3rem width
- **Color**: Blue (`text-blue-600`) to indicate importance

## 6. Programs Section Behavior

### Visibility Rules
- **Show**: Only when sidebar is expanded (`!isCollapsed`)
- **Hide**: Completely hidden when sidebar is collapsed

### Filter Menu Behavior
- **Toggle Button**: Funnel icon next to "Programs" title
- **Filter Options**: "Show Inactive Only" checkbox
- **Click Outside**: Auto-closes when clicking elsewhere

### Search and Selection
- **Search Field**: "Search programs..." placeholder with real-time filtering
- **Select All**: Header checkbox with indeterminate state support
- **Individual Selection**: Each program has its own checkbox
- **Visual Feedback**: Selected programs get blue background

### Data Filtering Rules
- **Status Filter**: Active by default, can toggle to show inactive only
- **Search Match**: Case-insensitive matching on program labels
- **No Results**: Shows "No programs found" when no matches

## 7. Visual Design Behaviors

### Background Animation
- **Gradient Layers**: Two animated gradient overlays
- **Animation**: `animate-gradient-xy` and `animate-gradient-xy-2`
- **Timing**: Second layer has 2-second delay (`animation-delay-2000`)
- **Colors**: Blue, indigo, purple, rose, orange, amber combinations

### Backdrop Effects
- **Glass Morphism**: `backdrop-blur-sm` on various elements
- **Transparency**: White backgrounds with opacity (e.g., `bg-white/80`)
- **Depth**: Subtle borders and shadows for layered appearance

### Hover States
- **Buttons**: Increased brightness and shadow on hover
- **Table Rows**: Light background change on hover
- **Icons**: Color changes on hover (gray to blue)

## 8. Responsive Behavior

### Layout Adaptation
- **Fixed Width**: Sidebar maintains fixed width (collapsed: 48px, expanded: 256px)
- **Overflow Handling**: `overflow-y-auto overflow-x-hidden` for content area
- **Scroll Behavior**: Smooth scrolling with bottom padding for better UX

### Content Priority
- **Essential First**: Create button and collapse toggle always visible
- **Progressive Enhancement**: Additional content shows only when expanded
- **Graceful Degradation**: Functional even in collapsed state

## 9. State Management Rules

### Internal State Variables
- `isCollapsed`: Controls sidebar expansion state
- `isModalOpen`: Controls appointment modal visibility
- `selectedLocations`: Array of selected location values
- `selectedPrograms`: Array of selected program values  
- `selectedProviders`: Array of selected provider values (synced externally)
- Search terms for each section (`locationSearchTerm`, `providerSearchTerm`, `programSearchTerm`)
- Filter visibility states (`showLocationFilters`, `showProviderFilters`, `showProgramFilters`)
- Inactive filter toggles (`showInactiveLocations`, `showInactiveProviders`, `showInactivePrograms`)

### External Communication
- `onDateChange`: Called when calendar date is selected
- `onCurrentMonthChange`: Called when calendar month is navigated
- `onCreateAppointment`: Called when appointment is successfully created
- `onProviderSelectionChange`: Called when provider selection changes

## 10. Error Handling and Edge Cases

### Empty States
- **No Search Results**: Shows appropriate "No [items] found" messages
- **Empty Selections**: Handles empty arrays gracefully
- **Missing Data**: Falls back to default values where appropriate

### Data Validation
- **Date Boundaries**: Calendar properly handles month transitions
- **Selection Limits**: No artificial limits on selections
- **Search Edge Cases**: Handles empty strings, special characters

This documentation captures every interaction behavior in the Calendar Sidebar component. Developers should implement each behavior exactly as described to ensure consistent user experience. 