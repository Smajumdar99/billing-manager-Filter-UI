# Billing Manager Module Documentation

## Table of Contents
1. [Module Introduction](#module-introduction)
2. [Filters Section](#filters-section)
   - [Quick Filters](#quick-filters)
   - [Advanced Filters](#advanced-filters)
   - [Global Search](#global-search)
   - [Filter Management](#filter-management)
3. [Queue Management](#queue-management) *(To be documented)*
4. [Bulk Actions](#bulk-actions) *(To be documented)*
5. [Error Handling](#error-handling) *(To be documented)*
6. [Claim Management](#claim-management) *(To be documented)*

---

## Module Introduction

### Overview

The **Billing Manager** is a comprehensive queue-based billing management system designed for healthcare billing specialists. It provides a streamlined workflow for processing encounters, managing claims, handling billing errors, and executing bulk operations on healthcare encounters.

### Key Features

- **Queue-Based Workflow**: Organize and process encounters in a structured queue system with multiple status-based views
- **Comprehensive Filtering**: Powerful filtering system with quick filters for common use cases and advanced filters for complex queries
- **Bulk Operations**: Process multiple encounters simultaneously with bulk actions
- **Error Management**: Identify, review, and override billing errors with detailed error information
- **Multi-Insurance Support**: Handle primary, secondary, and tertiary insurance levels with visual indicators
- **Claim Lifecycle Tracking**: Track encounters from ready-to-bill status through claim generation, submission, and payment
- **Responsive Design**: Optimized for desktop and mobile devices with adaptive layouts

### Purpose

The Billing Manager module enables billing specialists to:
- Efficiently filter and locate specific encounters requiring attention
- Process large volumes of billing encounters with bulk actions
- Identify and resolve billing errors before claim submission
- Track the status of claims throughout the billing lifecycle
- Generate reports and export data for external analysis

### User Roles

- **Billing Specialists**: Primary users who process encounters and manage claims
- **Billing Managers**: Supervisors who can override billing rules and approve exceptions
- **Administrators**: Users with full access to all features and system configuration

---

## Filters Section

The Filters section is the primary navigation and discovery tool for finding specific encounters in the billing queue. It consists of two main components: **Quick Filters** and **Advanced Filters**, accessible through tabs in the left sidebar (desktop) or collapsible panel (mobile).

### Filter Panel Layout

#### Desktop View
- **Location**: Left sidebar (width: 384px / 96px when collapsed)
- **Collapse/Expand**: Click chevron icon to collapse filters panel for more table space
- **Active Filter Indicator**: Blue badge with count appears when filters are active and panel is collapsed
- **Persistent State**: Filters are saved to session storage for continuity across page refreshes

#### Mobile View
- **Location**: Collapsible panel above the encounter list
- **Toggle Button**: "Filters" button with badge showing active filter count
- **Full-Screen Overlay**: When expanded, filters take full width with scrollable content

### Global Search

**Location**: Above filter tabs, always visible

**Functionality**:
- Searches across multiple encounter fields simultaneously:
  - Patient Name
  - Patient MRN (Medical Record Number)
  - Patient ID
  - Claim Number
  - Encounter Type
  - Provider Name

**Usage**:
- Enter search terms in the search input field
- Results update in real-time as you type
- Search is case-insensitive and matches partial text
- Clear search by clicking the X icon or clearing the input field

**Example Queries**:
- `Johnson` - Finds all encounters for patients with "Johnson" in their name
- `MRN001238` - Finds encounters with specific MRN
- `CLM2024` - Finds encounters with claim numbers starting with "CLM2024"
- `Dr. Menon` - Finds all encounters with provider "Dr. Menon"

---

## Quick Filters

Quick Filters provide one-click access to commonly used filter combinations. Each filter card displays an encounter count, making it easy to see how many encounters match each filter.

### Date Range Filters

**Location**: First section in Quick Filters tab

**Purpose**: Filter encounters by date of service

**Available Options**:

1. **Last 30 Days**
   - **Description**: Most recent encounters
   - **Date Range**: From 30 days ago to today
   - **Example Count**: 847 encounters
   - **Use Case**: Recent encounters that need immediate attention

2. **Last 60 Days**
   - **Description**: Extended recent period
   - **Date Range**: From 60 days ago to today
   - **Example Count**: 1,624 encounters
   - **Use Case**: Monthly billing cycle review

3. **Last 90 Days**
   - **Description**: Quarterly view
   - **Date Range**: From 90 days ago to today
   - **Example Count**: 2,341 encounters
   - **Use Case**: Quarterly billing audits and reporting

**Visual Design**:
- Light blue background section (`bg-blue-100/40`)
- White cards with border
- Selected state: Blue background with checkmark icon in bottom-right corner
- Encounter count displayed in gray badge on the right

**Interaction**:
- Click any date range card to apply the filter
- Only one date range can be active at a time
- Selected filter is highlighted with blue background and checkmark

### Billing Status Filters

**Location**: Second section in Quick Filters tab

**Purpose**: Filter encounters by their billing readiness and error status

**Available Options**:

1. **Ready to Bill**
   - **Description**: No errors, ready for claims
   - **Filter Criteria**: 
     - Status: `ready_to_bill`
     - Has Errors: `false`
   - **Example Count**: 243 encounters
   - **Use Case**: Encounters that can be immediately processed for claim generation
   - **Icon**: Check circle

2. **Need Attention**
   - **Description**: Encounters with errors
   - **Filter Criteria**: 
     - Has Errors: `true`
   - **Example Count**: 87 encounters
   - **Use Case**: Encounters requiring review and error resolution before billing
   - **Icon**: Exclamation triangle

3. **Need Authorization**
   - **Description**: Pending pre-authorization
   - **Filter Criteria**: 
     - Status: `unauthorized`
   - **Example Count**: 156 encounters
   - **Use Case**: Encounters waiting for insurance authorization before billing
   - **Icon**: Clock

4. **High Value**
   - **Description**: Claims > $50,000
   - **Filter Criteria**: 
     - Total Charges: Greater than $50,000
   - **Example Count**: 23 encounters
   - **Use Case**: High-value claims requiring special attention and review
   - **Icon**: Money bill wave

**Visual Design**:
- Light green background section (`bg-green-100/40`)
- Grid layout: 2 columns
- Selected state: Blue background with checkmark
- Encounter count displayed in gray badge

**Interaction**:
- Click any status card to apply the filter
- Multiple status filters can be combined (except for mutually exclusive ones)
- Selected filters are highlighted

### Insurance Payer Filters

**Location**: Third section in Quick Filters tab

**Purpose**: Filter encounters by primary insurance payer

**Available Options**:

1. **Medicare**
   - **Description**: Federal health insurance
   - **Example Count**: 289 encounters
   - **Icon**: Money bill wave

2. **Medicaid**
   - **Description**: State health insurance
   - **Example Count**: 412 encounters
   - **Icon**: Money bill wave

3. **Blue Cross Blue Shield**
   - **Description**: BCBS commercial plans
   - **Example Count**: 156 encounters
   - **Icon**: Money bill wave

4. **Aetna**
   - **Description**: Aetna commercial insurance
   - **Example Count**: 134 encounters
   - **Icon**: Money bill wave

5. **UnitedHealth**
   - **Description**: UnitedHealthcare plans
   - **Example Count**: 98 encounters
   - **Icon**: Money bill wave

6. **Cigna**
   - **Description**: Cigna behavioral health
   - **Example Count**: 87 encounters
   - **Icon**: Money bill wave

7. **EAP**
   - **Description**: Employee Assistance Programs
   - **Example Count**: 73 encounters
   - **Icon**: Money bill wave

8. **Self Pay**
   - **Description**: Private pay patients
   - **Example Count**: 145 encounters
   - **Icon**: Money bill wave

**Visual Design**:
- Light purple background section (`bg-purple-100/40`)
- Grid layout: 2 columns
- Selected state: Blue background with checkmark

**Interaction**:
- Click any payer card to filter encounters by that payer
- Only one payer filter can be active at a time (single-select mode)
- Filter can be cleared by clicking the active filter again or using "Clear All"

### Service Type Filters

**Location**: Fourth section in Quick Filters tab

**Purpose**: Filter encounters by service type (specific to behavioral health)

**Available Options**:

1. **Individual Therapy**
   - **Description**: One-on-one therapy sessions
   - **Filter Method**: Search query match
   - **Example Count**: 432 encounters
   - **Icon**: User

2. **Group Therapy**
   - **Description**: Group therapy sessions
   - **Filter Method**: Search query match
   - **Example Count**: 187 encounters
   - **Icon**: Users

3. **Psychiatry**
   - **Description**: Psychiatric evaluations & med mgmt
   - **Filter Method**: Search query match
   - **Example Count**: 298 encounters
   - **Icon**: Flask

4. **Telehealth**
   - **Description**: Virtual sessions
   - **Filter Method**: Search query match
   - **Example Count**: 365 encounters
   - **Icon**: Video

**Visual Design**:
- Light orange background section (`bg-orange-100/40`)
- Grid layout: 2 columns

**Interaction**:
- Uses search query matching against encounter type and description fields
- May return results that partially match the service type

### Provider Type Filters

**Location**: Fifth section in Quick Filters tab

**Purpose**: Filter encounters by provider specialty/type

**Available Options**:

1. **Psychiatrist**
   - **Description**: MD/DO providers
   - **Filter Method**: Search query match
   - **Example Count**: 214 encounters
   - **Icon**: Graduation cap

2. **Therapist**
   - **Description**: LPC/LMFT providers
   - **Filter Method**: Search query match
   - **Example Count**: 389 encounters
   - **Icon**: Heart

3. **Social Worker**
   - **Description**: LCSW providers
   - **Filter Method**: Search query match
   - **Example Count**: 156 encounters
   - **Icon**: Users

4. **Counselor**
   - **Description**: Licensed counselors
   - **Filter Method**: Search query match
   - **Example Count**: 245 encounters
   - **Icon**: User

**Visual Design**:
- Light indigo background section (`bg-indigo-100/40`)
- Grid layout: 2 columns

### Authorization & Documentation Filters

**Location**: Sixth section in Quick Filters tab

**Purpose**: Filter encounters based on authorization requirements and documentation completeness

**Available Options**:

1. **Pre-Auth Required**
   - **Description**: Needs authorization
   - **Filter Criteria**: Status = `unauthorized`
   - **Example Count**: 124 encounters
   - **Icon**: Shield alt

2. **Missing Diagnosis**
   - **Description**: No primary diagnosis
   - **Filter Criteria**: 
     - Has Errors: `true`
     - Error Type: Documentation Missing
   - **Example Count**: 67 encounters
   - **Icon**: File alt

3. **Treatment Plan**
   - **Description**: Missing treatment plan
   - **Filter Criteria**: 
     - Has Errors: `true`
     - Error Type: Documentation Missing
   - **Example Count**: 43 encounters
   - **Icon**: Clipboard check

4. **Crisis Sessions**
   - **Description**: Emergency/crisis billing
   - **Filter Method**: Search query match for "crisis"
   - **Example Count**: 89 encounters
   - **Icon**: Phone

**Visual Design**:
- Light amber background section (`bg-amber-100/40`)
- Grid layout: 2 columns

### Active Filters Display

**Location**: Header section and filter panel footer

**Functionality**:
- Shows all currently active filter cards as badges
- Displays filter names in a readable format
- Allows individual filter removal via X button
- "Clear All" button removes all active filters at once

**Desktop Header**:
- Active filters shown as gradient blue badges next to page description
- Each badge has a remove button
- "Clear all" link appears when filters are active

**Mobile Header**:
- Shows up to 2 filter badges with "+N more" indicator if additional filters exist
- "Clear all" button always visible when filters are active

---

## Advanced Filters

Advanced Filters provide granular control over filtering criteria with a dropdown-based selection system. Users can build complex filter combinations and apply sorting options.

### Accessing Advanced Filters

**Desktop**: Click "Advanced" tab in the filter panel

**Mobile**: Click "Advanced" tab after opening the filter panel

### Filter Structure

The Advanced Filters interface uses a two-step process:
1. **Select Criteria**: Choose what field/attribute to filter by
2. **Configure Value**: Set the filter value(s) based on the criteria type

### Filter Criteria Types

Advanced Filters support multiple criteria types, each with different input controls:

#### 1. Select (Single Choice)
- **Description**: Select one option from a predefined list
- **Input Control**: Dropdown select
- **Examples**:
  - Authorization Status: Authorized, Pending, Denied, Not Required, Expired
  - Claim Type: Primary, Secondary, Electronic, Paper
  - Encounter Complete Status: Complete, Incomplete, Pending

#### 2. Multiselect (Multiple Choice)
- **Description**: Select multiple options from a predefined list
- **Input Control**: Badge-based selection (click to toggle)
- **Examples**:
  - Bill Type: Professional, Institutional, UB04, HCFA, Emergency, Routine
  - Billing Status: Ready to Bill, Unbilled, No Claims Generated, Billed, Denied, etc.
  - Current Billed Insurance: Medicare, Medicaid, Blue Cross Blue Shield, etc.

#### 3. Date Range
- **Description**: Filter by date field with start and end dates
- **Input Control**: Two date pickers (From/To)
- **Available Fields**:
  - Date of Billing
  - Date of Discharge
  - Date of Entry
  - Date of Service
  - Encounter Reprocessed Date

#### 4. Value Range
- **Description**: Filter numeric values with minimum and maximum
- **Input Control**: Two number inputs (Min/Max)
- **Available Fields**:
  - Billing Units
  - Encounter Service Code Count

#### 5. Toggle (Yes/No)
- **Description**: Boolean filter with Yes/No options
- **Input Control**: Button group
- **Examples**:
  - Charge Coded: Yes, No
  - Exclude Encounters With Zero Balance: Yes, No
  - Marked For Rebill: Yes, No
  - Marked as Cleared: Yes, No
  - Whether Insured: Yes, No

#### 6. Text Input
- **Description**: Free-text search for specific fields
- **Input Control**: Text input field
- **Available Fields**:
  - Encounter ID
  - Person ID
  - Person First Name
  - Person Last Name
  - Person Name
  - Payment ID

#### 7. Service Code Typeahead
- **Description**: Search and select service codes (CPT4, HCPCS, ICD10-PCS, Rev Codes)
- **Input Control**: Typeahead search with code type filter
- **Features**:
  - Filter by code type (All, CPT4, HCPCS, ICD10-PCS, Rev)
  - Search by code number, description, or short description
  - Multiple code selection
  - Displays code type badge, modifier, and full description
  - Selected codes shown with remove option

### Available Filter Criteria

The Advanced Filters panel includes 40+ filter criteria organized by category:

#### Authorization & Eligibility
- Authorization Status
- Whether Insured

#### Billing Information
- Bill Type
- Billing Status
- Billing Units
- Charge Coded
- Claim Type
- Date of Billing
- Last Level Billed
- Last Level Closed
- Post Primary Billing Rules Applied

#### Encounter Details
- Encounter (ID)
- Encounter Complete Status
- Encounter Reprocessed Date
- Encounter Reprocessed Status
- Encounter Service Code Count
- Encounter Status
- Date of Entry
- Date of Service
- Date of Discharge

#### Financial
- Payment ID
- Exclude Encounters With Zero Balance

#### Insurance & Payer
- Current Billed Insurance
- Funding Source
- Funding Source Type
- X12 Partner (Any payer level)
- X12 Partner (Current payer level only)

#### Location & Program
- Location
- Program Name
- Place Of Service

#### Patient Information
- Person ID
- Person First Name
- Person Last Name
- Person Name

#### Provider & Service
- Provider
- Service Code
- Modifiers

#### Processing Status
- HL7 Partner
- Marked For Rebill
- Marked as Cleared
- PRP Billing

### Using Advanced Filters

#### Step 1: Search for Criteria
1. Type in the "Search criteria..." field to find filter criteria
2. Criteria list filters in real-time as you type
3. Matching criteria are shown in a scrollable list

#### Step 2: Select Criteria
1. Click a radio button next to the desired criteria
2. The criteria configuration panel appears below
3. Already-applied criteria are disabled (shown as "Applied")

#### Step 3: Configure Filter Value
1. Based on the criteria type, configure the filter:
   - **Select**: Choose one option from dropdown
   - **Multiselect**: Click badges to toggle selections
   - **Date Range**: Enter start and end dates
   - **Value Range**: Enter minimum and maximum values
   - **Toggle**: Click Yes or No button
   - **Text**: Enter search text
   - **Service Code**: Use typeahead to search and select codes

2. For multiselect and service codes, selections are immediately added to applied filters

#### Step 4: Review Selected Criteria
- Applied filters appear in the "Selected Criteria" section
- Shows filter name and selected values
- Each filter can be removed individually using the X button

#### Step 5: Apply Filters
- Click the "Apply" button at the bottom of the panel
- All selected filters and sort options are applied simultaneously
- The encounter list updates to show filtered results

### Sorting Options

**Location**: Top section of Advanced Filters panel (collapsible)

**Available Sort Fields**:
1. **Encounter Date** (`dateOfService`)
   - Sorts by date of service
   - Default direction: Newest First (descending)

2. **Encounter ID** (`id`)
   - Sorts by encounter identifier
   - Default direction: Newest First (descending)

3. **Person Last Name** (`patientName`)
   - Sorts alphabetically by patient's last name
   - Default direction: A-Z (ascending)

4. **Person First Name** (`patientFirstName`)
   - Sorts alphabetically by patient's first name
   - Default direction: A-Z (ascending)

**Sort Directions**:
- **Newest First** (Descending): Most recent items first
- **Oldest First** (Ascending): Oldest items first

**Using Sorting**:
1. Expand the "Sort By" section
2. Select a sort field using radio buttons
3. Select sort direction (Newest/Oldest First)
4. Sort appears in "Selected Criteria" section
5. Click "Apply" to apply sorting along with filters

### Filter Management

#### Clearing Filters

**Clear Individual Filter**:
- Click the X button on any active filter badge (header) or in the Selected Criteria section (Advanced Filters)

**Clear All Filters**:
- **Quick Filters Tab**: Click "Clear All" button at the top of the panel
- **Advanced Filters Tab**: Click "Clear All" button next to "Add Filters" heading
- **Header**: Click "Clear all" link in the active filters display

**Clear Sort Only**:
- Remove sort from Selected Criteria section in Advanced Filters
- Or uncheck all sort field radio buttons

#### Filter Persistence

- Filters are automatically saved to browser session storage
- Filters persist across page refreshes within the same browser session
- Filters are cleared when the browser session ends
- Filters do not persist across different browser tabs or windows

#### Active Filter Indicators

**Desktop**:
- Active filter count badge on collapsed filter panel
- Filter badges in header showing active filter names
- Blue highlight on active filter cards in Quick Filters

**Mobile**:
- Badge count on Filters toggle button
- Active filter badges in header (limited display)
- Checkmark icons on selected filter cards

### Filter Combinations

#### How Filters Combine

- **Quick Filters**: Generally replace previous filters (single-select mode for most categories)
- **Advanced Filters**: All selected criteria are combined with AND logic
  - Example: "Billing Status = Ready to Bill AND Primary Payer = Medicare AND Date of Service = Last 30 Days"
- **Global Search**: Combines with other filters using AND logic
- **Active Tab**: Filters are applied within the context of the selected tab (Ready to Bill, Blocked, With Errors, Pending Submit)

#### Filter Precedence

1. **Tab Selection** (Highest precedence) - Determines which encounters are available
2. **Quick Filters or Advanced Filters** - Applies additional filtering criteria
3. **Global Search** - Further narrows results
4. **Sorting** - Orders the final result set

#### Best Practices

1. **Start Broad, Narrow Down**: Begin with date range or status filters, then add specific criteria
2. **Use Quick Filters for Common Tasks**: Use predefined filter combinations for everyday workflows
3. **Use Advanced Filters for Complex Queries**: When you need multiple criteria or specific values
4. **Combine with Search**: Use global search along with filters to find specific patients or encounters
5. **Clear Filters Regularly**: Avoid confusion by clearing filters when starting new tasks

---

## Filter Counts and Statistics

### Encounter Count Display

Throughout the filter interface, encounter counts are displayed to help users understand the impact of their filter selections:

- **Filter Cards**: Each Quick Filter card shows the total number of encounters matching that filter
- **Advanced Filters**: The encounter count is shown at the bottom of the panel
- **Header**: The total filtered encounter count is displayed in the page header

### Count Updates

- Encounter counts update in real-time as filters are applied
- Counts reflect only encounters visible in the current tab
- Zero-balance encounters are automatically excluded from counts

---

## Technical Details

### Filter State Management

- Filters are stored in React state and synced to session storage
- Filter state is managed by `BillingManagerPage` component
- Quick Filters and Advanced Filters share the same underlying filter state object
- Filter changes trigger automatic re-rendering of the encounter list

### Filter Performance

- Filtering is performed client-side on the encounter dataset
- Filter operations are memoized to prevent unnecessary recalculations
- Large datasets may experience slight delays; consider using more specific filters

### Data Structure

**Filter Object Structure**:
```typescript
{
  dateRange: {
    start: string (ISO date)
    end: string (ISO date)
  }
  payers: PayerType[]
  statuses: BillingStatus[]
  billTypes: BillType[]
  errorTypes: ErrorType[]
  hasErrors: boolean | null
  assignedTo?: string
  priority?: 'high' | 'medium' | 'low'
  searchQuery: string
}
```

---

## Future Enhancements

Planned improvements to the Filters section:

1. **Saved Filter Presets**: Save and recall frequently used filter combinations
2. **Filter Templates**: Pre-defined filter sets for common workflows
3. **Export Filtered Results**: Export current filter state for sharing or documentation
4. **Filter History**: View and reuse recently applied filter combinations
5. **Custom Filter Criteria**: Allow administrators to define custom filter fields
6. **Advanced Date Options**: Relative date ranges (e.g., "This Week", "Last Month")
7. **Filter Validation**: Prevent conflicting filter combinations
8. **Performance Optimization**: Server-side filtering for large datasets

---

*This documentation covers the Filters section of the Billing Manager module. Additional sections will be documented in future updates.*




