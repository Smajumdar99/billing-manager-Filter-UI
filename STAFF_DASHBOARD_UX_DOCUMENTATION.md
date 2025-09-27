# Staff Dashboard UX Documentation

## 🎯 Overview

The Staff Dashboard is a responsive healthcare management interface built using **Atomic Design principles**. It provides behavioral health counselors with an efficient way to manage their caseload, track treatment plans, and monitor client progress across desktop and mobile devices.

## 📱 Responsive Design Strategy

### Desktop-First Approach (lg: 1024px+)
- **Compact Header Layout**: Single row with title, metrics, and actions
- **Always-Visible Metrics**: No collapsing, maximum information density
- **Table View**: AG Grid DataTable for efficient data scanning
- **Horizontal Layout**: Optimal use of wide screen real estate

### Mobile-First Approach (< 1024px)
- **Progressive Disclosure**: Collapsible metrics and filters
- **Card-Based Layout**: Touch-friendly client cards
- **Vertical Stacking**: Optimized for portrait orientation
- **Touch Targets**: Minimum 44px tap areas

## 🏗️ Atomic Design Structure

### Atoms (Basic Building Blocks)
- **Button**: Primary actions (Refresh, Export, Filter toggles)
- **Badge**: Status indicators (Active, Discharged, High Risk)
- **FormStatusIcon**: Treatment plan status indicators
- **Input**: Search fields and form inputs
- **Tooltip**: Contextual help and information

### Molecules (Component Combinations)
- **MetricButton**: Icon + Number + Label for dashboard metrics
- **ClientCard**: Complete client information display
- **SearchBar**: Input with search icon
- **FilterToggle**: Button with active state and count badge

### Organisms (Complex Components)
- **HeaderSection**: Title, metrics, and actions
- **FilterSection**: Search, categories, and filter controls
- **ClientGrid**: Responsive layout for client cards/table
- **DataTable**: AG Grid implementation for desktop

### Templates (Page Layout)
- **ResponsiveLayout**: Conditional desktop/mobile layouts
- **DashboardTemplate**: Complete page structure

## 🎨 Design Tokens

### Color Palette
```css
/* Primary Colors */
--blue-50: #eff6ff;
--blue-600: #2563eb;
--blue-700: #1d4ed8;

/* Status Colors */
--green-50: #f0fdf4;    /* Active/Complete */
--green-600: #16a34a;
--red-50: #fef2f2;      /* High Risk/Incomplete */
--red-600: #dc2626;
--orange-50: #fff7ed;   /* Today/Urgent */
--orange-600: #ea580c;
--gray-50: #f9fafb;     /* Neutral/Discharged */
--gray-600: #4b5563;
```

### Typography Scale
```css
/* Headings */
--text-xl: 1.25rem;     /* Main title */
--text-lg: 1.125rem;    /* Section headers */
--text-base: 1rem;      /* Body text */
--text-sm: 0.875rem;    /* Secondary text */
--text-xs: 0.75rem;     /* Labels and badges */

/* Font Weights */
--font-bold: 700;       /* Titles */
--font-semibold: 600;   /* Emphasis */
--font-medium: 500;     /* Labels */
--font-normal: 400;     /* Body */
```

### Spacing System
```css
/* Based on 4px grid */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
```

## 📐 Layout Specifications

### Header Component

#### Desktop Layout (lg+)
```
┌─────────────────────────────────────────────────────────────────┐
│ Title + Description     │  Metrics (4 badges)  │  Actions       │
│ Staff Dashboard         │  [45] [40] [5] [19]   │  [↻] [↓]      │
│ Dashboard with...       │  Total Active Disch   │  Refresh Export│
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Container**: `flex items-center justify-between`
- **Title Section**: `flex-shrink-0` (fixed width)
- **Metrics Section**: `flex items-center gap-3 mx-6`
- **Actions Section**: `flex gap-2 flex-shrink-0`
- **Height**: ~80px total
- **Padding**: 16px all sides

#### Mobile Layout (< lg)
```
┌─────────────────────────────────────────┐
│ Staff Dashboard    [📊] │ [↻] [↓]       │
│ Dashboard with...       │               │
├─────────────────────────────────────────┤
│ [📊 Metrics ▼] (Collapsible)           │
│ ┌─────────────────────────────────────┐ │
│ │ [45] [40] [5] [19]                 │ │
│ │ Total Active Disch Risk            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Specifications:**
- **Header Row**: `flex items-center justify-between`
- **Metrics Toggle**: `lg:hidden` (only on mobile)
- **Collapsible Section**: Conditional rendering with animation
- **Animation**: `animate-in slide-in-from-top-2 duration-200`

### Metric Buttons

#### Visual Design
```css
.metric-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px; /* rounded-full */
  border: 1px solid;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms;
  min-height: 40px; /* Touch target */
}

/* Color Variants */
.metric-button--total {
  background: var(--blue-50);
  color: var(--blue-700);
  border-color: var(--blue-200);
}

.metric-button--active {
  background: var(--green-50);
  color: var(--green-700);
  border-color: var(--green-200);
}

.metric-button--discharged {
  background: var(--gray-50);
  color: var(--gray-700);
  border-color: var(--gray-200);
}

.metric-button--high-risk {
  background: var(--red-50);
  color: var(--red-700);
  border-color: var(--red-200);
}
```

#### Interactive States
- **Hover**: Darker background variant (`hover:bg-blue-100`)
- **Active**: Ring effect (`ring-2 ring-blue-200`)
- **Focus**: Keyboard navigation support

### Client Cards (Mobile)

#### Card Structure
```
┌─────────────────────────────────────────┐
│ Sarah Johnson                [Active]   │
│ PID: 1002762                           │
│                                         │
│ [Intensive Outpatient Program (IOP)]   │
│                                         │
│ Provider: Sarah Wilson                  │
│                                         │
│ DOB:        │ Admitted:                 │
│ 02/24/1989  │ 02/24/2023               │
│ Discharged: │ Last Seen:                │
│ N/A         │ 12/15/2023               │
│ Next Appt:  │ Location:                 │
│ Today 2:00PM│ Main Campus              │
│                                         │
│ Treatment Plans:                        │
│ [🔴] 14-Day: Not yet                   │
│ [🔴] MDTP: 05/16/2024  [#E24051600I] [📝]│
│                                         │
│ [👁 Chart] [📋 Plan] [📅 Schedule]      │
└─────────────────────────────────────────┘
```

#### Specifications
- **Container**: `bg-white rounded-lg border border-gray-200 p-4 mb-3`
- **Shadow**: `shadow-sm hover:shadow-md transition-shadow`
- **Grid Layout**: 2-column for information pairs
- **Touch Targets**: 44px minimum for all interactive elements
- **Typography**: Clear hierarchy with proper contrast

### Filter Section

#### Mobile Layout
```
┌─────────────────────────────────────────┐
│ [🔍 Search clients...]     [🔽 Filters] │
│                              (3)        │
├─────────────────────────────────────────┤
│ [Admitted] [Discharged]                 │
├─────────────────────────────────────────┤
│ ▼ Filters (Collapsible)                │
│ ┌─────────────────────────────────────┐ │
│ │ Status: [dropdown]                  │ │
│ │ Clinician: [dropdown]               │ │
│ │ Due Date: [dropdown]                │ │
│ │                                     │ │
│ │ Additional Options:                 │ │
│ │ □ Only show incomplete              │ │
│ │ [Clear all filters]                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search clients...]  [Admitted] [Discharged]                 │
│                                                                 │
│ Status: [dropdown] │ Clinician: [dropdown] │ Due Date: [dropdown]│
│                                                                 │
│ Additional Options: □ Only show incomplete    [Clear filters]   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Interaction Patterns

### Progressive Disclosure
- **Mobile Metrics**: Hidden by default, expandable with animation
- **Mobile Filters**: Collapsible with active count indicator
- **Client Details**: Expandable sections within cards

### Touch Interactions
- **Minimum Target Size**: 44px × 44px for all interactive elements
- **Visual Feedback**: Immediate hover/focus states
- **Gesture Support**: Tap to expand, swipe for navigation

### Keyboard Navigation
- **Tab Order**: Logical flow through interactive elements
- **Focus Indicators**: Clear visual focus rings
- **Keyboard Shortcuts**: Standard patterns (Enter, Space, Escape)

## 📊 Data Display Patterns

### Status Indicators
```css
/* Form Status Icons */
.status-complete { color: #16a34a; } /* Green */
.status-incomplete { color: #dc2626; } /* Red */
.status-in-progress { color: #f59e0b; } /* Amber */
.status-overdue { color: #dc2626; } /* Red */
```

### Information Hierarchy
1. **Primary**: Client name, status
2. **Secondary**: PID, program, provider
3. **Tertiary**: Dates, locations
4. **Quaternary**: Treatment details

### Content Density
- **Mobile**: Single column, generous whitespace
- **Desktop**: Multi-column, compact but scannable

## 🎛️ Component API Reference

### MetricButton Component
```typescript
interface MetricButtonProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant: 'total' | 'active' | 'discharged' | 'high-risk';
  onClick: () => void;
  active?: boolean;
  tooltip?: string;
}
```

### ClientCard Component
```typescript
interface ClientCardProps {
  client: Client;
  onSelect: (client: Client) => void;
  expandable?: boolean;
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}
```

### FilterSection Component
```typescript
interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isMobile: boolean;
}
```

## 🔧 Implementation Guidelines

### Responsive Breakpoints
```css
/* Mobile: Default (no prefix) */
/* Tablet: sm (640px+) */
/* Desktop: lg (1024px+) */
/* Large Desktop: xl (1280px+) */
```

### CSS Framework Integration
- **Tailwind CSS**: Primary styling framework
- **CSS Variables**: For theme customization
- **Component Classes**: Reusable utility combinations

### Performance Considerations
- **Lazy Loading**: Client cards pagination
- **Virtual Scrolling**: Large data sets
- **Debounced Search**: 300ms delay
- **Memoization**: Expensive calculations

### Accessibility Requirements
- **WCAG 2.1 AA**: Minimum compliance level
- **Color Contrast**: 4.5:1 ratio for normal text
- **Screen Readers**: Proper ARIA labels
- **Keyboard Navigation**: Full functionality without mouse

## 🧪 Testing Scenarios

### Responsive Testing
1. **Mobile Portrait**: 375px × 667px (iPhone SE)
2. **Mobile Landscape**: 667px × 375px
3. **Tablet Portrait**: 768px × 1024px (iPad)
4. **Desktop**: 1440px × 900px (MacBook)
5. **Large Desktop**: 1920px × 1080px

### Interaction Testing
1. **Metric Filtering**: Click each metric, verify filter application
2. **Search Functionality**: Type query, verify instant results
3. **Card Expansion**: Tap details, verify smooth animation
4. **Filter Toggling**: Show/hide filters, verify state persistence

### Performance Testing
1. **Large Datasets**: 1000+ clients
2. **Search Performance**: Real-time filtering
3. **Scroll Performance**: Smooth card rendering
4. **Memory Usage**: No leaks with frequent interactions

## 🔗 Prototype Links

### Interactive Prototypes
- **Desktop Version**: [Figma Prototype - Desktop](#)
- **Mobile Version**: [Figma Prototype - Mobile](#)
- **Component Library**: [Storybook Components](#)

### Design Files
- **Figma Design System**: [Design Tokens & Components](#)
- **Icon Library**: [Heroicons v2.0](https://heroicons.com/)
- **Color Palette**: [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)

## 📝 Development Checklist

### Before Implementation
- [ ] Review complete UX documentation
- [ ] Understand atomic design structure
- [ ] Set up responsive breakpoints
- [ ] Configure color tokens
- [ ] Implement base components

### During Development
- [ ] Build atoms first (Button, Badge, Input)
- [ ] Combine into molecules (MetricButton, SearchBar)
- [ ] Create organisms (Header, FilterSection)
- [ ] Implement responsive templates
- [ ] Add interactive states

### Testing & QA
- [ ] Cross-browser compatibility
- [ ] Responsive behavior validation
- [ ] Accessibility audit
- [ ] Performance benchmarking
- [ ] User acceptance testing

## 🚀 Future Enhancements

### Phase 2 Features
- **Dark Mode**: Theme switching capability
- **Custom Dashboards**: User-configurable layouts
- **Advanced Filters**: Date ranges, custom criteria
- **Bulk Actions**: Multi-select operations

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Support**: PWA capabilities
- **Advanced Analytics**: Usage tracking
- **API Integration**: Backend synchronization

---

## 📞 Support & Contact

For questions about this UX documentation or implementation guidance:

- **UX Team**: [Contact UX Designer]
- **Development Team**: [Contact Lead Developer]
- **Documentation**: [Link to Technical Docs]

**Last Updated**: ${new Date().toLocaleDateString()}  
**Version**: 1.0.0  
**Authors**: UX Design Team
