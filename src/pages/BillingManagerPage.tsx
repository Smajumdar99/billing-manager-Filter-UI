import {
  FC,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { BillingFilterToolbar, type FilterValues } from '@/components/molecules/BillingFilterToolbar'
import { type SortOption } from '@/components/molecules/BillingQueueFilters'
import { BillingActionButtons, type ViewMode } from '@/components/molecules/BillingActionButtons'
import { Tabs, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs'
import { BillingQueueTable } from '@/components/organisms/BillingQueueTable'
import { BillingViewCardsListing } from '@/components/organisms/BillingViewCardsListing'
import { BillingErrorDialog } from '@/components/molecules/BillingErrorDialog'
import { OverrideDialog } from '@/components/molecules/OverrideDialog'
import { Button } from '@/components/atoms/Button/button'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Icon } from '@/components/atoms/Icon/Icon'
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  UserGroupIcon,
  BeakerIcon,
  BanknotesIcon,
  ChartBarIcon,
  InboxIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  AlertTriangle,
  AlertCircle,
  Edit3,
  FileText,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Send,
  ShieldAlert,
  CheckCircle,
  Download,
  RefreshCw,
  MoreVertical,
  DollarSign,
  Check,
  X,
} from 'lucide-react'
import { BuildingLightFullIcon } from '@/assets/icons/BuildingLightFullIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import { 
  mockBillingEncounters, 
  getBillingQueueStats, 
  defaultBillingFilters 
} from '@/data/mockBillingEncounters'
import { 
  BillingEncounter, 
  BillingQueueFilters as FilterType, 
  BulkActionType,
  getBillStatusDisplay,
  getEncounterStatusDisplay,
  type BillStatusDisplay,
  type EncounterStatusDisplay,
} from '@/types/billing-manager'

/** Matches BillingViewCardsListing — duration label beside treatment time range. */
function formatTreatmentDurationLabelForEncounter(enc: BillingEncounter): string | null {
  if (
    enc.treatmentDurationMinutes != null &&
    Number.isFinite(enc.treatmentDurationMinutes)
  ) {
    const m = Math.max(0, Math.round(enc.treatmentDurationMinutes))
    if (m === 0) return null
    return m === 1 ? '1 min' : `${m} mins`
  }
  const range = enc.treatmentTime?.trim()
  if (!range || range === '-') return null
  const normalized = range.replace(/[–—]/g, '-')
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
  const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10)
  let diff = end - start
  if (diff <= 0) diff += 24 * 60
  if (diff <= 0) return null
  return diff === 1 ? '1 min' : `${diff} mins`
}

function mobileEncounterStatusBadgeClass(label: EncounterStatusDisplay): string {
  switch (label) {
    case 'Open':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Closed':
      return 'bg-gray-100 text-gray-700 border border-gray-200'
    case 'Closed with errors':
      return 'bg-red-50 text-red-700 border border-red-200'
  }
}

function mobileBillStatusBadgeClass(label: BillStatusDisplay): string {
  switch (label) {
    case 'Unbilled':
      return 'bg-gray-100 text-gray-700 border border-gray-200'
    case 'Partially Billed':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'Billing Complete':
      return 'bg-green-50 text-green-700 border border-green-200'
  }
}

const mobileSidebarItems: Array<{
  icon: string
  label: string
  subItems?: Array<{ label: string }>
}> = [
  { icon: "chart-bar", label: "Billing Dashboard" },
  { icon: "file-invoice-dollar", label: "Billing Manager" },
  { icon: "cogs", label: "Masters", subItems: [{ label: "Level of Care" }] },
  { icon: "clipboard-list", label: "Claims & Denials" },
  { icon: "exchange-alt", label: "ERA Process" },
  { icon: "file-contract", label: "Fee Sheet" },
  { icon: "dollar-sign", label: "Charges" },
  { icon: "receipt", label: "Checkout" },
  { icon: "chart-line", label: "Error Reports", subItems: [{ label: "Golden Thread Errors" }] },
  { icon: "exclamation-triangle", label: "View Billing Errors", subItems: [{ label: "HCFA" }, { label: "UB04" }] },
  { icon: "credit-card", label: "Payments" },
  { icon: "chart-pie", label: "Report" },
  { icon: "file-signature", label: "Statement Manager", subItems: [{ label: "New" }, { label: "Report" }] },
  { icon: "shield-alt", label: "PRP Program", subItems: [{ label: "Compile PRP Program" }, { label: "Status Report" }, { label: "Settings" }] },
  { icon: "tools", label: "Manage UB-04 Preprocessing", subItems: [{ label: "Pre Process" }, { label: "Pre Process Status Report" }, { label: "Settings" }] },
  { icon: "shield-alt", label: "Eligibility & Benefits" },
  { icon: "calendar", label: "Accounting Period" },
  { icon: "file-export", label: "Export Data to General Ledger", subItems: [{ label: "Manage Crosswalks" }, { label: "Export Data" }, { label: "Export History" }, { label: "Adjustment Accounts" }] },
  { icon: "redo-alt", label: "Reprocess Encounters" },
]

type BillingSecondaryTab = 'ready' | 'blocked' | 'with_errors' | 'pending_submit'

type BillingResponsiveSecondaryFilterRowsProps = {
  filteredEncounters: BillingEncounter[]
  selectedEncounters: string[]
  handleEncounterSelect: (encounterId: string, selected: boolean) => void
  encounters: BillingEncounter[]
  billingTypeFilter: string
  setBillingTypeFilter: (v: string) => void
  activeTab: BillingSecondaryTab
  setActiveTab: (v: BillingSecondaryTab) => void
  collapsedEncounterIds: Set<string>
  setCollapsedEncounterIds: Dispatch<SetStateAction<Set<string>>>
  billingTypeDropdownOpen: boolean
  setBillingTypeDropdownOpen: Dispatch<SetStateAction<boolean>>
  mobileBillingTypeOptions: Array<{ value: string; label: string; count: number }>
  mobileActiveBillingLabel: string
  mobileStatusPillOptions: ReadonlyArray<{
    value: BillingSecondaryTab
    label: string
    count: number
  }>
}

const BillingResponsiveSecondaryFilterRows: FC<BillingResponsiveSecondaryFilterRowsProps> = ({
  filteredEncounters,
  selectedEncounters,
  handleEncounterSelect,
  encounters,
  billingTypeFilter,
  setBillingTypeFilter,
  activeTab,
  setActiveTab,
  collapsedEncounterIds,
  setCollapsedEncounterIds,
  billingTypeDropdownOpen,
  setBillingTypeDropdownOpen,
  mobileBillingTypeOptions,
  mobileActiveBillingLabel,
  mobileStatusPillOptions,
}) => {
  const isBillFiltered = billingTypeFilter !== 'all'
  const [mobileStatusDropdownOpen, setMobileStatusDropdownOpen] = useState(false)
  const activeStatusLabel = mobileStatusPillOptions.find(o => o.value === activeTab)

  return (
    <>
      {/* Desktop: merged tab bar — md+ only */}
      <div className="hidden md:flex w-full flex-col bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-2 gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="checkbox"
              checked={
                filteredEncounters.length > 0 &&
                selectedEncounters.length === filteredEncounters.length
              }
              ref={input => {
                if (input) {
                  const allSelected =
                    filteredEncounters.length > 0 &&
                    selectedEncounters.length === filteredEncounters.length
                  const someSelected = selectedEncounters.length > 0 && !allSelected
                  input.indeterminate = someSelected
                }
              }}
              onChange={() => {
                const allSelected = filteredEncounters.every(enc =>
                  selectedEncounters.includes(enc.id)
                )
                if (allSelected) {
                  filteredEncounters.forEach(enc => handleEncounterSelect(enc.id, false))
                } else {
                  filteredEncounters.forEach(enc => {
                    if (!selectedEncounters.includes(enc.id)) {
                      handleEncounterSelect(enc.id, true)
                    }
                  })
                }
              }}
              className="w-4 h-4 accent-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {selectedEncounters.length === filteredEncounters.length &&
              filteredEncounters.length > 0
                ? 'All'
                : selectedEncounters.length > 0
                  ? `${selectedEncounters.length}`
                  : 'All'}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <Select value={billingTypeFilter} onValueChange={setBillingTypeFilter}>
              <SelectTrigger className="h-8 min-w-[160px] max-w-[280px] text-sm bg-slate-50/80 border-gray-200 shrink-0">
                <span className="flex min-w-0 flex-1 items-center overflow-hidden text-left">
                  <span className="text-gray-500 mr-1 shrink-0">Bill type:</span>
                  <span className="min-w-0 truncate text-gray-900 font-medium">
                    <SelectValue placeholder={`All (${encounters.length})`} />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{`All (${encounters.length})`}</SelectItem>
                <SelectItem value="hcfa">{`HCFA (${encounters.filter(e => e.billType === 'professional' || e.hcfaBillType?.includes('HCFA')).length})`}</SelectItem>
                <SelectItem value="ub04">{`UB-04 (${encounters.filter(e => e.billType === 'institutional' || e.hcfaBillType?.includes('UB-04')).length})`}</SelectItem>
                <SelectItem value="not_set">{`Not Set (${encounters.filter(e => !e.billType && !e.hcfaBillType).length})`}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="h-7 w-px shrink-0 bg-slate-200 self-center"
            aria-hidden="true"
          />

          <div className="flex items-center gap-3 min-w-0">
            <Tabs
              value={activeTab}
              onValueChange={value => setActiveTab(value as BillingSecondaryTab)}
            >
              <TabsList
                className="h-9 items-center justify-center rounded-lg p-1 text-muted-foreground grid grid-cols-4 bg-gray-100"
                style={{ width: 'max-content' }}
              >
                <TabsTrigger
                  value="ready"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  Ready to Bill (
                  {encounters.filter(e => e.status === 'ready_to_bill' && !e.hasErrors).length})
                </TabsTrigger>
                <TabsTrigger
                  value="blocked"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  Blocked (
                  {encounters.filter(e => e.hasErrors && e.errorSeverity === 'critical').length})
                </TabsTrigger>
                <TabsTrigger
                  value="with_errors"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  With Errors ({encounters.filter(e => e.hasErrors).length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending_submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  Pending Submit (
                  {
                    encounters.filter(
                      e => e.status === 'in_review' || e.status === 'authorized'
                    ).length
                  }
                  )
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap flex-shrink-0">
              Total - <span className="font-semibold text-gray-800">{encounters.length}</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                const allCollapsed =
                  filteredEncounters.length > 0 &&
                  collapsedEncounterIds.size === filteredEncounters.length
                if (allCollapsed) {
                  setCollapsedEncounterIds(new Set())
                } else {
                  setCollapsedEncounterIds(new Set(filteredEncounters.map(e => e.id)))
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all duration-150 shadow-sm h-8"
            >
              {filteredEncounters.length > 0 &&
              collapsedEncounterIds.size === filteredEncounters.length ? (
                <>
                  <ChevronDownIcon className="w-3.5 h-3.5" /> Expand All
                </>
              ) : (
                <>
                  <ChevronUpIcon className="w-3.5 h-3.5" /> Collapse All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: filter row — small screens only */}
      <div
        className="relative flex md:hidden flex-row items-center gap-2 w-full pb-2 bg-white border-b border-gray-200 px-4 pt-3"
      >
        <span className="relative flex flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              setBillingTypeDropdownOpen(p => !p)
              setMobileStatusDropdownOpen(false)
            }}
            className={`w-full inline-flex items-center justify-center gap-1.5 border py-1.5 px-3 rounded-lg shadow-sm text-sm font-semibold transition-colors whitespace-nowrap ${
              isBillFiltered
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <span
              className={`font-normal ${isBillFiltered ? 'text-blue-500' : 'text-gray-500'}`}
            >
              Bill type:{' '}
            </span>
            <span
              className={`font-semibold truncate ${isBillFiltered ? 'text-blue-900' : 'text-slate-800'}`}
            >
              {mobileActiveBillingLabel}
            </span>
            <ChevronDownIcon
              className={`shrink-0 w-3.5 h-3.5 transition-transform ${isBillFiltered ? 'text-blue-400' : 'text-slate-400'} ${billingTypeDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {billingTypeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setBillingTypeDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 w-full z-50 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1">
                {mobileBillingTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${
                      billingTypeFilter === opt.value
                        ? 'bg-blue-50 text-[#1a73e8] font-medium'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-blue-50'
                    }`}
                    onClick={() => {
                      setBillingTypeFilter(opt.value)
                      setBillingTypeDropdownOpen(false)
                    }}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </>
          )}
        </span>

        <span className="relative flex flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              setMobileStatusDropdownOpen(p => !p)
              setBillingTypeDropdownOpen(false)
            }}
            className={`w-full inline-flex items-center justify-center gap-1.5 border py-1.5 px-3 rounded-lg shadow-sm text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab !== 'ready'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <span className={`font-semibold truncate ${activeTab !== 'ready' ? 'text-blue-900' : 'text-slate-800'}`}>
              {activeStatusLabel ? `${activeStatusLabel.label} (${activeStatusLabel.count})` : 'Status'}
            </span>
            <ChevronDownIcon
              className={`shrink-0 w-3.5 h-3.5 transition-transform ${activeTab !== 'ready' ? 'text-blue-400' : 'text-slate-400'} ${mobileStatusDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileStatusDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMobileStatusDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 w-full z-50 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1">
                {mobileStatusPillOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${
                      activeTab === opt.value
                        ? 'bg-blue-50 text-[#1a73e8] font-medium'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-blue-50'
                    }`}
                    onClick={() => {
                      setActiveTab(opt.value)
                      setMobileStatusDropdownOpen(false)
                    }}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </>
          )}
        </span>
      </div>
    </>
  )
}

/**
 * BillingManagerPage Component
 * 
 * Queue-based billing manager for processing encounters with comprehensive workflow.
 * Features filtering, bulk actions, error handling, and claim management.
 * Designed for billing specialists to efficiently manage billing operations.
 */
export const BillingManagerPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX and SEO
  useDocumentTitle('Billing Manager')

  // Mobile / desktop detection
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Manager')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [moreSheetOpen, setMoreSheetOpen] = useState(false)
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)
  const [billingTypeDropdownOpen, setBillingTypeDropdownOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [showInsurance, setShowInsurance] = useState(true)
  const [showForms, setShowForms] = useState(false)
  const [showClaims, setShowClaims] = useState(false)
  const [openInsuranceLineId, setOpenInsuranceLineId] = useState<string | null>(null)
  const [mobileBulkMoreOpen, setMobileBulkMoreOpen] = useState(false)
  /** Which encounter card has the kebab menu open (mobile). */
  const [mobileMoreOpenId, setMobileMoreOpenId] = useState<string | null>(null)
  const [showMetrics, setShowMetrics] = useState(false)
  const [expandedMenuItems, setExpandedMenuItems] = useState<Set<string>>(new Set())

  // Toolbar filter state (selected filter category IDs from the popover)
  const [toolbarSelectedFilters, setToolbarSelectedFilters] = useState<string[]>([
    'authorization_status',
    'current_billed_insurance',
  ])

  // State for billing queue management
  const [encounters, setEncounters] = useState<BillingEncounter[]>(mockBillingEncounters)
  const [filters, setFilters] = useState<FilterType>(defaultBillingFilters)
  const [activeFilterCards, setActiveFilterCards] = useState<string[]>([])
  const [selectedEncounters, setSelectedEncounters] = useState<string[]>([])
  const [showErrorDialog, setShowErrorDialog] = useState<BillingEncounter | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSort, setCurrentSort] = useState<SortOption | undefined>({
    field: 'dateOfService',
    label: 'Encounter Date',
    direction: 'desc',
  })
  const [viewMode] = useState<ViewMode>('card')
  const [activeTab, setActiveTab] = useState<'ready' | 'blocked' | 'with_errors' | 'pending_submit'>('ready')
  const [billingTypeFilter, setBillingTypeFilter] = useState<string>('all')
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const [overrideActionType, setOverrideActionType] = useState<'override' | 'override_and_generate'>('override')
  const [alertModal, setAlertModal] = useState<{ open: boolean; type: 'goldenThread' | 'override' }>({ open: false, type: 'goldenThread' })
  const [collapsedEncounterIds, setCollapsedEncounterIds] = useState<Set<string>>(new Set())
  const [overriddenEncounterIds, setOverriddenEncounterIds] = useState<string[]>([])
  /** Snapshot of row IDs when Override modal opens — used on Confirm so IDs match even if selection state shifts */
  const overrideDialogSelectionRef = useRef<string[]>([])

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages based on item name
    if (itemName === 'Dashboard') {
      navigate('/old-ui-dashboard')
    } else if (itemName === 'Inbox') {
      navigate('/task-hub')
    } else if (itemName === 'Settings') {
      navigate('/settings')
    } else if (itemName === 'Schedule') {
      navigate('/my-calendar')
    } else if (itemName === 'Clients') {
      navigate('/clients')
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard')
    } else if (itemName === 'Billing') {
      navigate('/billing')
    }
    // Current page is Billing Manager, so no navigation needed for that
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
    // Search functionality can be implemented here when needed
  }

  // Persist filters in session storage for continuity
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('billing-manager-filters')
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters))
      } catch (error) {
        console.error('Error loading saved filters:', error)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('billing-manager-filters', JSON.stringify(filters))
  }, [filters])

  // Close mobile overlays when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false)
      setMoreSheetOpen(false)
    }
  }, [isMobile])

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Handle toolbar filter apply (categories selected from the checkbox menu)
  const handleToolbarApplyFilters = useCallback((selectedFilters: string[]) => {
    setToolbarSelectedFilters(selectedFilters)
  }, [])

  // Handle token-level filter values (applied via each token's popover)
  const handleFilterValuesChange = useCallback((values: FilterValues) => {
    console.log('Filter values changed:', values)
  }, [])

  // Handle toolbar sort change
  const handleToolbarSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    const sortFields: Record<string, string> = {
      dateOfService: 'Encounter Date',
      id: 'Encounter Id',
      patientName: 'Person Last Name',
      patientFirstName: 'Person First Name',
    }
    setCurrentSort({ field, label: sortFields[field] || field, direction })
  }, [])

  // Handle sort changes
  const handleSortChange = useCallback((sort: SortOption | undefined) => {
    setCurrentSort(sort)
  }, [])


  // Handle encounter click (navigate to encounter details)
  const handleEncounterClick = useCallback((encounter: BillingEncounter) => {
    console.log('Navigating to encounter:', encounter.id)
    // TODO: Implement navigation to encounter details page
    // navigate(`/encounters/${encounter.id}`)
  }, [])

  // Handle action button clicks
  const handleActionButtonClick = useCallback((action: string, encounterIds: string[]) => {
    console.log(`Action: ${action}, Encounters: ${encounterIds.length}`)
    
    switch (action) {
      case 'clear_selection':
        setSelectedEncounters([])
        break
      case 'generate_claims':
        console.log('Generating claims for:', encounterIds)
        // TODO: Implement claim generation
        break
      case 'generate_and_submit_claims':
        console.log('Generating and submitting claims for:', encounterIds)
        // TODO: Implement claim generation and submission
        break
      case 'check_errors':
        console.log('Checking errors for:', encounterIds)
        // TODO: Implement error checking
        break
      case 'set_bill_type':
        console.log('Setting bill type for:', encounterIds)
        // TODO: Implement bill type setting
        break
      case 'set_bill_to':
        console.log('Setting bill-to for:', encounterIds)
        // TODO: Implement bill-to setting
        break
      case 'set_professional_hcfa':
        console.log('Setting Professional HCFA for:', encounterIds)
        // TODO: Implement professional HCFA setting
        break
      case 'set_institutional_ub04':
        console.log('Setting Institutional UB04 for:', encounterIds)
        // TODO: Implement institutional UB04 setting
        break
      case 'mark_as_cleared':
        console.log('Marking as cleared:', encounterIds)
        // TODO: Implement mark as cleared
        break
      case 'override_billing':
      case 'override':
        overrideDialogSelectionRef.current = encounterIds.map((id) => String(id).trim())
        setOverrideActionType('override')
        setShowOverrideDialog(true)
        break
      case 'override_and_generate':
        overrideDialogSelectionRef.current = encounterIds.map((id) => String(id).trim())
        setOverrideActionType('override_and_generate')
        setShowOverrideDialog(true)
        break
      case 'mark_for_rebilling':
        console.log('Marking for rebilling:', encounterIds)
        // TODO: Implement mark for rebilling
        break
      case 'remove_rebill':
        console.log('Removing rebill mark:', encounterIds)
        // TODO: Implement remove rebill
        break
      case 'apply_post_primary_rules':
        console.log('Applying post primary rules:', encounterIds)
        // TODO: Implement post primary rules
        break
      default:
        console.log('Unknown action:', action)
    }
  }, [])

  // Filter and sort encounters based on current filter criteria and sort options
  const filteredEncounters = useMemo(() => {
    let filtered = encounters.filter(encounter => {
      // Tab-based filtering — overridden encounters always stay visible in "ready"
      if (activeTab === 'ready') {
        if (encounter.hasErrors) {
          return false
        }
      } else if (activeTab === 'blocked') {
        if (!encounter.hasErrors && !encounter.billingOverrideEnabled) {
          return false
        }
      }
      
      // Exclude encounters with zero balance (core billing manager requirement)
      if (encounter.totalCharges === 0 || (encounter.allowedAmount !== undefined && encounter.allowedAmount === 0)) {
        return false
      }

      // Date range filter
      const encounterDate = new Date(encounter.dateOfService)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      
      if (encounterDate < startDate || encounterDate > endDate) {
        return false
      }

      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase()
        const searchFields = [
          encounter.patientName,
          encounter.patientMrn,
          encounter.patientId,
          encounter.claimNumber || '',
          encounter.encounterType,
          encounter.provider
        ].join(' ').toLowerCase()
        
        if (!searchFields.includes(searchLower)) {
          return false
        }
      }

      // High-value filter (> $50,000)
      if (activeFilterCards.includes('high-value') && encounter.totalCharges <= 50000) {
        return false
      }

      // Payer filter
      if (filters.payers.length > 0 && !filters.payers.includes(encounter.primaryPayer)) {
        return false
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(encounter.status)) {
        return false
      }

      // Bill type filter
      if (filters.billTypes.length > 0 && !filters.billTypes.includes(encounter.billType)) {
        return false
      }

      // Error filter
      if (filters.hasErrors !== null && encounter.hasErrors !== filters.hasErrors) {
        return false
      }

      // Error type filter
      if (filters.errorTypes.length > 0) {
        const encounterErrorTypes = encounter.errors.map(e => e.type)
        if (!filters.errorTypes.some(type => encounterErrorTypes.includes(type))) {
          return false
        }
      }

      return true
    })

    // Apply sorting if currentSort is set
    if (currentSort) {
      filtered = filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (currentSort.field) {
          case 'dateOfService':
            aValue = new Date(a.dateOfService)
            bValue = new Date(b.dateOfService)
            break
          case 'id':
            aValue = a.id
            bValue = b.id
            break
          case 'patientName':
            aValue = a.patientName.split(' ').pop() || '' // Last name
            bValue = b.patientName.split(' ').pop() || ''
            break
          case 'patientFirstName':
            aValue = a.patientName.split(' ')[0] || '' // First name
            bValue = b.patientName.split(' ')[0] || ''
            break
          default:
            return 0
        }

        // Handle different data types
        if (aValue instanceof Date && bValue instanceof Date) {
          const comparison = aValue.getTime() - bValue.getTime()
          return currentSort.direction === 'asc' ? comparison : -comparison
        } else {
          const comparison = String(aValue).localeCompare(String(bValue))
          return currentSort.direction === 'asc' ? comparison : -comparison
        }
      })
    }

    return filtered
  }, [encounters, filters, activeFilterCards, refreshKey, currentSort, activeTab])

  // Handle override confirmation from dialog
  const handleOverrideConfirm = useCallback((reason: string, notes: string) => {
    const fromSnapshot = overrideDialogSelectionRef.current
    const encounterIds =
      fromSnapshot.length > 0
        ? fromSnapshot
        : selectedEncounters.map((id) => String(id).trim())

    const normalizedIds = [...new Set(encounterIds.map((id) => String(id).trim()))]

    setOverriddenEncounterIds((prev) => [...new Set([...prev.map((id) => String(id).trim()), ...normalizedIds])])
    overrideDialogSelectionRef.current = []

    console.log('Override confirmed:', { reason, notes, encounterIds: normalizedIds, actionType: overrideActionType })
    
    if (overrideActionType === 'override_and_generate') {
      // Override and generate claims
      setEncounters(prev => prev.map(enc => 
        normalizedIds.includes(String(enc.id).trim()) 
          ? { 
              ...enc, 
              billingOverrideEnabled: true, 
              hasErrors: false, 
              errors: [], 
              status: 'claim_generated',
              overrideReason: reason,
              overrideNotes: notes,
              overriddenAt: new Date().toISOString()
            }
          : enc
      ))
    } else {
      // Just override
      setEncounters(prev => prev.map(enc => 
        normalizedIds.includes(String(enc.id).trim()) 
          ? { 
              ...enc, 
              billingOverrideEnabled: true, 
              hasErrors: false, 
              errors: [],
              overrideReason: reason,
              overrideNotes: notes,
              overriddenAt: new Date().toISOString()
            }
          : enc
      ))
    }
    
    setSelectedEncounters([])
    setShowOverrideDialog(false)
  }, [selectedEncounters, overrideActionType])

  // Handle CSV export
  const handleExportCSV = useCallback(() => {
    try {
      // Create CSV headers
      const headers = [
        'Encounter ID',
        'Patient Name',
        'Patient MRN',
        'Date of Service',
        'Encounter Type',
        'Provider',
        'Department',
        'Primary Payer',
        'Status',
        'Bill Type',
        'Total Charges',
        'Allowed Amount',
        'Patient Responsibility',
        'Insurance Amount',
        'Claim Number',
        'Submission Date',
        'Response Date',
        'Priority',
        'Has Errors',
        'Error Severity',
        'Last Modified'
      ]

      // Convert encounters to CSV rows
      const csvRows = filteredEncounters.map(encounter => [
        encounter.id,
        encounter.patientName,
        encounter.patientMrn,
        encounter.dateOfService,
        encounter.encounterType,
        encounter.provider,
        encounter.department,
        encounter.primaryPayer,
        encounter.status,
        encounter.billType,
        encounter.totalCharges.toString(),
        encounter.allowedAmount?.toString() || '',
        encounter.patientResponsibility?.toString() || '',
        encounter.insuranceAmount?.toString() || '',
        encounter.claimNumber || '',
        encounter.submissionDate || '',
        encounter.responseDate || '',
        encounter.priority,
        encounter.hasErrors.toString(),
        encounter.errorSeverity || '',
        encounter.lastModified
      ])

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `billing-queue-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Exported ${filteredEncounters.length} encounters to CSV`)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }, [filteredEncounters])

  // Get selected encounter objects
  const selectedEncounterObjects = useMemo(() => {
    return filteredEncounters.filter(e => selectedEncounters.includes(e.id))
  }, [filteredEncounters, selectedEncounters])

  // Calculate queue statistics
  const queueStats = useMemo(() => {
    return getBillingQueueStats(filteredEncounters)
  }, [filteredEncounters])

  const mobileBillingTypeOptions = useMemo(
    () => [
      { value: 'all' as const, label: 'All', count: encounters.length },
      {
        value: 'hcfa' as const,
        label: 'HCFA',
        count: encounters.filter(
          e => e.billType === 'professional' || e.hcfaBillType?.includes('HCFA')
        ).length,
      },
      {
        value: 'ub04' as const,
        label: 'UB-04',
        count: encounters.filter(
          e => e.billType === 'institutional' || e.hcfaBillType?.includes('UB-04')
        ).length,
      },
      {
        value: 'not_set' as const,
        label: 'Not Set',
        count: encounters.filter(e => !e.billType && !e.hcfaBillType).length,
      },
    ],
    [encounters]
  )

  const mobileStatusPillOptions = useMemo(
    () =>
      [
        {
          value: 'ready' as const,
          label: 'Ready to Bill',
          count: encounters.filter(e => e.status === 'ready_to_bill' && !e.hasErrors).length,
        },
        {
          value: 'blocked' as const,
          label: 'Blocked',
          count: encounters.filter(e => e.hasErrors && e.errorSeverity === 'critical').length,
        },
        {
          value: 'with_errors' as const,
          label: 'With Errors',
          count: encounters.filter(e => e.hasErrors).length,
        },
        {
          value: 'pending_submit' as const,
          label: 'Pending Submit',
          count: encounters.filter(
            e => e.status === 'in_review' || e.status === 'authorized'
          ).length,
        },
      ] as const,
    [encounters]
  )

  const mobileActiveBillingLabel = useMemo(() => {
    const active = mobileBillingTypeOptions.find(o => o.value === billingTypeFilter)
    return active ? `${active.label} (${active.count})` : ''
  }, [mobileBillingTypeOptions, billingTypeFilter])

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      // Already on this page, no need to navigate
      return
    } else if (itemLabel === 'Claims & Denials') {
      navigate('/claims-denials')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    }
    // Add more navigation logic here for other sidebar items as needed
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
    // Search functionality for sidebar items
  }

  // Handle encounter selection
  const handleEncounterSelect = useCallback((encounterId: string, selected: boolean) => {
    setSelectedEncounters(prev => 
      selected 
        ? [...prev, encounterId]
        : prev.filter(id => id !== encounterId)
    )
  }, [])

  // Handle quick filter changes from filter cards
  const handleQuickFilterChange = useCallback((newFilters: Partial<FilterType>) => {
    // Clear previous filters and apply new ones (single filter mode for simplicity)
    const updatedFilters = { ...defaultBillingFilters, ...newFilters }
    
    // Handle high-value filter specially - it's not a real payer
    let cardId: string | null = null
    if (newFilters.payers?.includes('high-value' as any)) {
      updatedFilters.payers = []
      cardId = 'high-value'
    } else {
      cardId = getFilterCardId(newFilters)
    }
    
    setFilters(updatedFilters)
    
    // Update active filter cards for UI feedback
    if (cardId) {
      setActiveFilterCards([cardId]) // Single active filter for simplicity
    }
  }, [])

  // Get filter card ID from filters
  const getFilterCardId = (filterData: Partial<FilterType>): string | null => {
    if (filterData.hasErrors === true) return 'with-errors'
    if (filterData.hasErrors === false && filterData.statuses?.includes('ready_to_bill')) return 'ready-to-bill'
    if (filterData.statuses?.includes('unauthorized')) return 'unauthorized'
    if (filterData.payers?.includes('Medicare')) return 'medicare-payer'
    if (filterData.payers?.includes('Medicaid')) return 'medicaid-payer'
    if (filterData.payers?.includes('Blue Cross Blue Shield')) return 'bcbs-payer'
    if (filterData.payers?.includes('Aetna')) return 'aetna-payer'
    if (filterData.payers?.includes('UnitedHealth')) return 'unitedhealth-payer'
    if (filterData.payers?.includes('Cigna')) return 'cigna-payer'
    if (filterData.payers?.includes('EAP')) return 'eap-payer'
    if (filterData.payers?.includes('Self Pay')) return 'self-pay'
    if (filterData.dateRange) {
      const daysDiff = Math.ceil((new Date(filterData.dateRange.end).getTime() - new Date(filterData.dateRange.start).getTime()) / (1000 * 3600 * 24))
      if (daysDiff <= 35) return 'last-30-days'
      if (daysDiff <= 65) return 'last-60-days'
      if (daysDiff <= 95) return 'last-90-days'
    }
    return null
  }

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setFilters(defaultBillingFilters)
    setActiveFilterCards([])
    setToolbarSelectedFilters([])
  }, [])

  // Handle bulk actions
  const handleBulkAction = useCallback((action: BulkActionType, encounterIds: string[], options?: any) => {
    console.log(`Bulk action: ${action}`, encounterIds, options)
    
    // Simulate action processing
    setEncounters(prev => prev.map(encounter => {
      if (!encounterIds.includes(encounter.id)) return encounter
      
      switch (action) {
        case 'generate_claims':
          return {
            ...encounter,
            status: 'claim_generated' as const,
            claimNumber: `CLM${Date.now()}${Math.floor(Math.random() * 1000)}`,
            canGenerateClaim: false,
            canSubmitClaim: true,
            lastModified: new Date().toISOString()
          }
        
        case 'submit_claims':
          return {
            ...encounter,
            status: 'claim_submitted' as const,
            submissionDate: new Date().toISOString(),
            canSubmitClaim: false,
            lastModified: new Date().toISOString()
          }

        case 'mark_ready':
          return {
            ...encounter,
            status: 'ready_to_bill' as const,
            canGenerateClaim: true,
            lastModified: new Date().toISOString()
          }

        case 'assign_to_user':
          return {
            ...encounter,
            assignedTo: options?.assignedTo,
            lastModified: new Date().toISOString()
          }

        default:
          return encounter
      }
    }))

    // Trigger refresh
    setRefreshKey(prev => prev + 1)
  }, [])

  // Handle error override
  const handleOverrideError = useCallback((errorId: string, reason: string) => {
    if (!showErrorDialog) return

    setEncounters(prev => prev.map(encounter => {
      if (encounter.id !== showErrorDialog.id) return encounter

      const updatedErrors = encounter.errors.map(error => 
        error.id === errorId 
          ? {
              ...error,
              overriddenBy: 'Current User', // In real app, get from auth context
              overriddenAt: new Date().toISOString(),
              overrideReason: reason
            }
          : error
      )

      const hasActiveErrors = updatedErrors.some(e => !e.overriddenBy && e.severity === 'critical')
      const newErrorSeverity = updatedErrors
        .filter(e => !e.overriddenBy)
        .reduce<'info' | 'warning' | 'critical'>((max, e) => {
          if (max === 'critical' || e.severity === 'critical') return 'critical'
          if (max === 'warning' || e.severity === 'warning') return 'warning'
          return 'info'
        }, 'info')

      return {
        ...encounter,
        errors: updatedErrors,
        hasErrors: hasActiveErrors,
        errorSeverity: updatedErrors.some(e => !e.overriddenBy) ? newErrorSeverity : undefined,
        canGenerateClaim: !hasActiveErrors && encounter.status === 'ready_to_bill',
        lastModified: new Date().toISOString()
      }
    }))

    setRefreshKey(prev => prev + 1)
  }, [showErrorDialog])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={handleSearch}
        userInfo={{
          name: "Sarah Johnson",
          role: "front_desk",
          avatar: "/avatar.png"
        }}
      />

      {/* Main Navigation — hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <MainNavigationBar
          activeItem="Billing"
          onNavigate={handleMainNavigation}
        />
      </div>
      
      {/* Main Content Area with Sidebar */}
      <div className="flex-1 overflow-hidden bg-zinc-200 flex relative">
        {/* Desktop Billing Sidebar */}
        {!isMobile && (
          <Sidebar
            activeItem={activeSidebarItem}
            onMenuSelect={handleSidebarSelect}
            onSearch={handleSidebarSearch}
            onCollapsedChange={setSidebarCollapsed}
            defaultCollapsed={sidebarCollapsed}
          />
        )}

        {/* Mobile Left-Sliding Sidebar Navigation */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <div
              className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-out flex flex-col ${
                mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
              }`}
            >
              {/* Header with search */}
              <div className="shrink-0 border-b border-gray-200 bg-white">
                <div className="flex items-center p-3">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="search"
                        placeholder="Search navigation..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C75BC] focus:border-[#1C75BC] transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg ml-2 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Scrollable Navigation Items */}
              <nav className="flex-1 overflow-y-auto">
                <div className="py-2 space-y-0.5">
                  {mobileSidebarItems.map((item) => {
                    const isActive = activeSidebarItem === item.label
                    const hasSubItems = item.subItems && item.subItems.length > 0
                    const isExpanded = expandedMenuItems.has(item.label)
                    const iconColor = isActive ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600 bg-gray-50/50'

                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          className={`flex items-center w-full px-3 py-2 text-sm relative transition-colors duration-150 ${
                            isActive
                              ? 'text-[#1C75BC] bg-[#1C75BC]/10 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            if (hasSubItems) {
                              setExpandedMenuItems(prev => {
                                const next = new Set(prev)
                                if (next.has(item.label)) next.delete(item.label)
                                else next.add(item.label)
                                return next
                              })
                            } else {
                              handleSidebarSelect(item.label)
                              setMobileSidebarOpen(false)
                            }
                          }}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C75BC]" />
                          )}
                          <div className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${iconColor}`}>
                            <FontAwesomeIcon icon={item.icon as IconProp} className="h-4 w-4" />
                          </div>
                          <span className="ml-2 flex-1 truncate text-left">{item.label}</span>
                          {hasSubItems && (
                            <FontAwesomeIcon
                              icon={(isExpanded ? 'chevron-up' : 'chevron-down') as IconProp}
                              className="w-3 h-3 text-gray-400 ml-2 shrink-0"
                            />
                          )}
                        </button>

                        {hasSubItems && isExpanded && (
                          <div className="ml-6 border-l border-gray-200 pl-4 py-1">
                            {item.subItems!.map((sub, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="block w-full text-left py-1.5 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-150"
                                onClick={() => setMobileSidebarOpen(false)}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </nav>
            </div>
          </>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-zinc-100">
          <div className="h-full flex flex-col">
            {/* Header Section with Statistics */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-0">
              <div className="flex flex-col">
                {/* Desktop: Single Row with Title, Metrics, and Actions */}
                <div className="hidden lg:block">
                  <div className="py-1 px-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-0">
                      {/* Title Section */}
                      <div className="flex-shrink-0">
                        <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <Icon icon="file-invoice-dollar" className="w-3.5 h-3.5" />
                          Billing Manager
                        </h1>
                        <div className="mt-0">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <p className="text-[11px] text-gray-500">Queue-based billing workflow</p>
                            {/* Active Filters Display */}
                            {activeFilterCards.length > 0 && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500 font-medium">Filters:</span>
                                {activeFilterCards.map((card, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200 shadow-sm"
                                  >
                                    <span>{card}</span>
                                    <button
                                      onClick={() => {
                                        const newCards = activeFilterCards.filter((_, i) => i !== index);
                                        setActiveFilterCards(newCards);
                                        if (newCards.length === 0) {
                                          setFilters(defaultBillingFilters);
                                        }
                                      }}
                                      className="hover:bg-blue-200 rounded-sm p-0.5 transition-colors"
                                    >
                                      <Icon icon="times" className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                                <button
                                  onClick={() => {
                                    setActiveFilterCards([]);
                                    setFilters(defaultBillingFilters);
                                  }}
                                  className="text-xs text-gray-500 hover:text-gray-700 px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors"
                                >
                                  Clear all
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Info + Action buttons (Refresh, Reports, Invoice Manager, Encounter Details, Export) */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="flex items-center justify-center p-1 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                              aria-label="Billing queue info"
                            >
                              <Icon icon="info-circle" className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>The Refresh Button updates the billing queue with the latest encounter data and claim statuses</p>
                          </TooltipContent>
                        </TooltipRoot>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRefreshKey(prev => prev + 1)}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 h-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Icon icon="sync" className="w-3 h-3" />
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/billing-reports')}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 h-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Icon icon="chart-bar" className="w-3 h-3" />
                          Reports
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/invoice-manager')}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 h-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Icon icon="file-invoice" className="w-3 h-3" />
                          Invoice Manager
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/encounter-details')}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 h-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Icon icon="file-medical" className="w-3 h-3" />
                          Encounter Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportCSV}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 h-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Icon icon="download" className="w-3 h-3" />
                          Export
                        </Button>
                      </div>
                      
                      {/* Metrics Section - Desktop Inline - Hidden for now */}
                      <div className="hidden items-center gap-2 mx-4">
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setFilters(defaultBillingFilters);
                                setActiveFilterCards([]);
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="users" className="w-4 h-4 flex-shrink-0 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.totalEncounters}</span>
                              <span className="text-xs text-gray-600">Total</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total encounters in billing queue</p>
                          </TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                handleQuickFilterChange({ statuses: ['ready_to_bill'], hasErrors: false });
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="check-circle" className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.readyToBill}</span>
                              <span className="text-xs text-gray-600">Ready to Bill</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Encounters ready for billing with no errors</p>
                          </TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                handleQuickFilterChange({ hasErrors: true });
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="exclamation-triangle" className="w-4 h-4 flex-shrink-0 text-orange-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.withErrors}</span>
                              <span className="text-xs text-gray-600">Need Attention</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Encounters with errors requiring review</p>
                          </TooltipContent>
                        </TooltipRoot>

                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet: Stacked Layout */}
                <div className="lg:hidden">
                  <div>
                    {/* Top Row - Title and Actions */}
                    <div className="flex items-center gap-3 w-full px-4 py-3 sm:px-5">
                      <button
                        type="button"
                        onClick={handleMobileSidebarToggle}
                        className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors active:bg-slate-200 flex-shrink-0"
                      >
                        <Icon icon="bars" className="w-6 h-6 text-slate-700" />
                      </button>

                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex items-center gap-2 flex-1">
                        <Icon icon="file-invoice-dollar" className="w-5 h-5" />
                        Billing Manager
                      </h1>

                      {/* Actions Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMobileActionsOpen(prev => !prev)}
                          className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5 text-slate-600" />
                        </button>

                        {mobileActionsOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setMobileActionsOpen(false)} />
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40">
                              {[
                                { icon: 'sync', label: 'Refresh', action: () => setRefreshKey(prev => prev + 1) },
                                { icon: 'chart-bar', label: 'Reports', action: () => navigate('/billing-reports') },
                                { icon: 'file-alt', label: 'Invoice Manager', action: () => navigate('/invoice-manager') },
                                { icon: 'clipboard-list', label: 'Encounter Details', action: () => navigate('/encounter-details') },
                                { icon: 'download', label: 'Export', action: () => handleExportCSV() },
                              ].map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => {
                                    item.action()
                                    setMobileActionsOpen(false)
                                  }}
                                >
                                  <Icon icon={item.icon} className="w-4 h-4 text-gray-500" />
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Metrics Section - Collapsible */}
                    {showMetrics && (
                      <div className="p-3 sm:p-5 animate-in slide-in-from-top-2 duration-200 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  setFilters(defaultBillingFilters);
                                  setActiveFilterCards([]);
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-blue-50 border-blue-200 hover:bg-blue-100"
                              >
                                <Icon icon="users" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-blue-700">{queueStats.totalEncounters}</span>
                                <span className="text-xs text-blue-600">Total</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total encounters in billing queue</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  handleQuickFilterChange({ statuses: ['ready_to_bill'], hasErrors: false });
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-green-50 border-green-200 hover:bg-green-100"
                              >
                                <Icon icon="check-circle" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-green-700">{queueStats.readyToBill}</span>
                                <span className="text-xs text-green-600">Ready</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Encounters ready for billing with no errors</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  handleQuickFilterChange({ hasErrors: true });
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-red-50 border-red-200 hover:bg-red-100"
                              >
                                <Icon icon="exclamation-triangle" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-red-700">{queueStats.withErrors}</span>
                                <span className="text-xs text-red-600">Errors</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Encounters with errors requiring review</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="flex-1 overflow-hidden">
              {/* Desktop: Full-width Layout with Horizontal Toolbar */}
              {!isMobile ? (
                <div className="flex flex-col h-full bg-zinc-100">
                  {/* Horizontal Filter Toolbar + Action Buttons */}
                  <div className="bg-white border-b border-gray-200">
                    <BillingFilterToolbar
                      searchQuery={filters.searchQuery}
                      onSearchChange={(query) =>
                        setFilters(prev => ({ ...prev, searchQuery: query }))
                      }
                      onApplyFilters={handleToolbarApplyFilters}
                      onFilterValuesChange={handleFilterValuesChange}
                      onClearFilters={handleClearAllFilters}
                      onSortChange={handleToolbarSortChange}
                      currentSort={
                        currentSort
                          ? { field: currentSort.field, direction: currentSort.direction }
                          : undefined
                      }
                    />
                  </div>

                  <BillingResponsiveSecondaryFilterRows
                    filteredEncounters={filteredEncounters}
                    selectedEncounters={selectedEncounters}
                    handleEncounterSelect={handleEncounterSelect}
                    encounters={encounters}
                    billingTypeFilter={billingTypeFilter}
                    setBillingTypeFilter={setBillingTypeFilter}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    collapsedEncounterIds={collapsedEncounterIds}
                    setCollapsedEncounterIds={setCollapsedEncounterIds}
                    billingTypeDropdownOpen={billingTypeDropdownOpen}
                    setBillingTypeDropdownOpen={setBillingTypeDropdownOpen}
                    mobileBillingTypeOptions={mobileBillingTypeOptions}
                    mobileActiveBillingLabel={mobileActiveBillingLabel}
                    mobileStatusPillOptions={mobileStatusPillOptions}
                  />

                  {/* Bulk Action Buttons — only visible when encounters are selected */}
                  {selectedEncounterObjects.length > 0 && (
                    <BillingActionButtons
                      selectedEncounters={selectedEncounterObjects}
                      onAction={handleActionButtonClick}
                    />
                  )}

                  {/* Queue Table or Card View — table only on desktop */}
                  <div className="flex-1 p-4 overflow-hidden">
                    {isDesktop ? (
                      viewMode === 'grid' ? (
                        <BillingQueueTable
                          encounters={filteredEncounters}
                          onEncounterSelect={handleEncounterSelect}
                          onEncounterEdit={(encounter) => console.log('Edit encounter:', encounter)}
                          onEncounterClick={handleEncounterClick}
                          onGenerateClaim={(encounter) => handleBulkAction('generate_claims', [encounter.id])}
                          onViewErrors={setShowErrorDialog}
                          onBillingOverrideToggle={(_id, enabled) => console.log('Toggle override:', _id, enabled)}
                          onHcfaBillTypeChange={(_id, billType) => console.log('Change bill type:', _id, billType)}
                          onPrimaryPayerChange={(_id, primaryPayer) => console.log('Change primary payer:', _id, primaryPayer)}
                          selectedEncounters={selectedEncounters}
                          className="h-full"
                        />
                      ) : (
                        <BillingViewCardsListing
                          encounters={filteredEncounters}
                          selectedEncounters={selectedEncounters}
                          onEncounterSelect={handleEncounterSelect}
                          onEncounterClick={handleEncounterClick}
                          collapsedEncounterIds={collapsedEncounterIds}
                          onCollapsedEncounterIdsChange={setCollapsedEncounterIds}
                          overriddenEncounterIds={overriddenEncounterIds}
                          className="h-full"
                        />
                      )
                    ) : (
                      <div className="w-full space-y-3 pb-24 bg-slate-50 pt-2">
                        {filteredEncounters.map((enc) => {
                          const statusStyle = enc.hasErrors
                            ? 'bg-red-50 text-red-700'
                            : enc.status === 'ready_to_bill'
                              ? 'bg-green-50 text-green-700'
                              : enc.status === 'claim_generated' || enc.status === 'claim_submitted'
                                ? 'bg-purple-50 text-purple-700'
                                : enc.status === 'paid' || enc.status === 'claim_accepted'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-50 text-slate-700'
                          const patientInitials = enc.patientName
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map(part => part[0]?.toUpperCase() ?? '')
                            .join('')

                          return (
                            <div
                              key={enc.id}
                              className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col mx-4"
                            >
                              {/* Header — name + badge */}
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center min-w-0">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
                                    {patientInitials}
                                  </div>
                                  <div className="flex items-center gap-1.5 ml-1 mr-2">
                                    <AlertTriangle size={18} className="text-amber-500 fill-amber-100" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-[15px] font-semibold text-slate-800 truncate">{enc.patientName}</div>
                                    <div className="text-xs text-slate-500">MRN: {enc.patientMrn}</div>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${statusStyle}`}>
                                  {enc.status.replace(/_/g, ' ')}
                                </span>
                              </div>

                              {/* Time & Provider */}
                              <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                                <span>{enc.treatmentTime || 'N/A'}</span>
                                <span className="text-slate-300">•</span>
                                <span>{enc.provider}</span>
                              </div>

                              {/* Billing details */}
                              <div className="mt-3 pt-3 border-t border-slate-50 flex flex-col gap-1">
                                <span className="text-sm text-slate-600">Code: {enc.hcfaBillType || enc.encounterType}</span>
                                <span className="text-sm text-slate-600">Facility: {enc.department}</span>
                              </div>

                              {/* Footer — total + actions */}
                              <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                                <div className="text-sm font-bold text-slate-800">
                                  Total: ${enc.totalCharges.toFixed(2)}
                                </div>
                                <button type="button" className="p-2 text-slate-400 hover:bg-slate-50 rounded-full" aria-label="Encounter actions">
                                  <Icon icon="ellipsis-h" className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Mobile: Vertical Layout */
                <div className="flex flex-col h-full bg-zinc-100">
                  {/* Mobile toolbar — single row: Filter icon, Sort icon, then Search */}
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-row items-center gap-2 w-full">
                    {/* Filter icon button */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setMobileFilterOpen(true)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                          toolbarSelectedFilters.length > 0
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        title="Filters"
                      >
                        <FunnelIcon className="w-5 h-5" />
                      </button>
                      {toolbarSelectedFilters.length > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold px-1 pointer-events-none">
                          {toolbarSelectedFilters.length > 99 ? '99+' : toolbarSelectedFilters.length}
                        </span>
                      )}
                      <BillingFilterToolbar
                        searchQuery={filters.searchQuery}
                        onSearchChange={(query) =>
                          setFilters(prev => ({ ...prev, searchQuery: query }))
                        }
                        onApplyFilters={handleToolbarApplyFilters}
                        onFilterValuesChange={handleFilterValuesChange}
                        onClearFilters={handleClearAllFilters}
                        externalOpen={mobileFilterOpen}
                        onExternalOpenChange={setMobileFilterOpen}
                      />
                    </div>

                    {/* Sort icon button */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        title="Sort By"
                        onClick={() => setMobileSortOpen(prev => !prev)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                          currentSort
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowsUpDownIcon className="w-5 h-5" />
                      </button>

                        {mobileSortOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setMobileSortOpen(false)} />
                            <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-40">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-semibold text-gray-800">Sort By</span>
                                </div>
                                {currentSort && (
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 font-medium active:opacity-70"
                                    onClick={() => { setCurrentSort(undefined); setMobileSortOpen(false) }}
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>

                              <div className="py-1">
                                {[
                                  { value: 'dateOfService', label: 'Encounter Date' },
                                  { value: 'id', label: 'Encounter Id' },
                                  { value: 'patientName', label: 'Person Last Name' },
                                  { value: 'patientFirstName', label: 'Person First Name' },
                                ].map((field) => {
                                  const isSelected = currentSort?.field === field.value
                                  return (
                                    <button
                                      key={field.value}
                                      type="button"
                                      className="flex items-center gap-3 w-full px-4 py-3 active:bg-gray-50 transition-colors"
                                      onClick={() => handleToolbarSortChange(field.value, currentSort?.direction || 'desc')}
                                    >
                                      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected ? 'border-blue-600' : 'border-gray-300'
                                      }`}>
                                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                      </span>
                                      <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                        {field.label}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>

                              <div className="border-t border-gray-100 mx-4" />

                              <div className="py-1">
                                {[
                                  { value: 'desc' as const, label: 'Newest First', icon: '↓' },
                                  { value: 'asc' as const, label: 'Oldest First', icon: '↑' },
                                ].map((dir) => {
                                  const isSelected = (currentSort?.direction || 'desc') === dir.value
                                  return (
                                    <button
                                      key={dir.value}
                                      type="button"
                                      className="flex items-center gap-3 w-full px-4 py-3 active:bg-gray-50 transition-colors"
                                      onClick={() => {
                                        handleToolbarSortChange(currentSort?.field || 'dateOfService', dir.value)
                                        setMobileSortOpen(false)
                                      }}
                                    >
                                      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                      }`}>
                                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                      </span>
                                      <span className={`text-sm flex items-center gap-1.5 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                        <span className="text-gray-400">{dir.icon}</span>
                                        {dir.label}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )}
                    </div>

                    {/* Search input */}
                    <div className="relative flex-1 min-w-0">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="billing-mobile-search"
                        type="search"
                        placeholder="Search patients, MRN..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <BillingResponsiveSecondaryFilterRows
                    filteredEncounters={filteredEncounters}
                    selectedEncounters={selectedEncounters}
                    handleEncounterSelect={handleEncounterSelect}
                    encounters={encounters}
                    billingTypeFilter={billingTypeFilter}
                    setBillingTypeFilter={setBillingTypeFilter}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    collapsedEncounterIds={collapsedEncounterIds}
                    setCollapsedEncounterIds={setCollapsedEncounterIds}
                    billingTypeDropdownOpen={billingTypeDropdownOpen}
                    setBillingTypeDropdownOpen={setBillingTypeDropdownOpen}
                    mobileBillingTypeOptions={mobileBillingTypeOptions}
                    mobileActiveBillingLabel={mobileActiveBillingLabel}
                    mobileStatusPillOptions={mobileStatusPillOptions}
                  />

                  {/* Mobile bulk action toolbar — visible only when cards are selected */}
                  {selectedEncounters.length > 0 && !isDesktop && (
                    <div className="relative z-20 flex md:hidden flex-row items-center gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap py-2.5 pl-3 pr-6 border-b border-gray-100 bg-gray-50/50 flex-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
                      <label className="shrink-0 inline-flex items-center gap-1.5 cursor-pointer select-none px-2 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm">
                        <input
                          type="checkbox"
                          checked={
                            filteredEncounters.length > 0 &&
                            selectedEncounters.length === filteredEncounters.length
                          }
                          ref={input => {
                            if (input) {
                              const allSelected =
                                filteredEncounters.length > 0 &&
                                selectedEncounters.length === filteredEncounters.length
                              const someSelected = selectedEncounters.length > 0 && !allSelected
                              input.indeterminate = someSelected
                            }
                          }}
                          onChange={() => {
                            const allSelected = filteredEncounters.every(enc =>
                              selectedEncounters.includes(enc.id)
                            )
                            if (allSelected) {
                              filteredEncounters.forEach(enc => handleEncounterSelect(enc.id, false))
                            } else {
                              filteredEncounters.forEach(enc => {
                                if (!selectedEncounters.includes(enc.id)) {
                                  handleEncounterSelect(enc.id, true)
                                }
                              })
                            }
                          }}
                          className="w-3.5 h-3.5 accent-blue-600 rounded border-gray-300"
                        />
                        <span className="text-xs font-medium text-gray-700 tabular-nums">
                          {selectedEncounters.length === filteredEncounters.length && filteredEncounters.length > 0
                            ? 'All'
                            : selectedEncounters.length}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleBulkAction('generate_claims', selectedEncounters)}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 shadow-sm active:bg-gray-50"
                      >
                        <FileText size={13} className="text-gray-500" />
                        Generate Claims
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBulkAction('override_blocks', selectedEncounters)}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 shadow-sm active:bg-gray-50"
                      >
                        <ShieldAlert size={13} className="text-gray-500" />
                        Override
                      </button>

                      <span className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setMobileBulkMoreOpen(p => !p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 shadow-sm active:bg-gray-50"
                        >
                          <MoreVertical size={13} className="text-gray-500" />
                          More
                        </button>
                        {mobileBulkMoreOpen && (
                          <>
                            <div className="fixed inset-0 z-[99]" onClick={() => setMobileBulkMoreOpen(false)} />
                            <div className="fixed right-3 top-auto mt-1 w-56 z-[100] bg-white rounded-xl shadow-lg border border-gray-200 py-1.5">
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { handleBulkAction('generate_claims', selectedEncounters); setMobileBulkMoreOpen(false) }}>
                                <Send size={16} className="text-gray-400 shrink-0" /> Generate &amp; Submit Claims
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Check Errors', selectedEncounters) }}>
                                <AlertTriangle size={16} className="text-gray-400 shrink-0" /> Check Errors
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Rebill', selectedEncounters) }}>
                                <RefreshCw size={16} className="text-gray-400 shrink-0" /> Rebill
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Set Bill Type', selectedEncounters) }}>
                                <FileText size={16} className="text-gray-400 shrink-0" /> Set Bill Type
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Set Bill-To', selectedEncounters) }}>
                                <Edit3 size={16} className="text-gray-400 shrink-0" /> Set Bill-To
                              </button>
                              <div className="h-px bg-gray-200 my-1.5 mx-3" />
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Mark as Cleared', selectedEncounters) }}>
                                <CheckCircle size={16} className="text-gray-400 shrink-0" /> Mark as Cleared
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Re-Open', selectedEncounters) }}>
                                <RefreshCw size={16} className="text-gray-400 shrink-0" /> Re-Open
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Remove Re-bill', selectedEncounters) }}>
                                <XMarkIcon className="w-4 h-4 text-gray-400 shrink-0" /> Remove Re-bill
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('Apply Post Primary Rules', selectedEncounters) }}>
                                <ShieldAlert size={16} className="text-gray-400 shrink-0" /> Apply Post Primary Rules
                              </button>
                              <button type="button" className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-3" onClick={() => { setMobileBulkMoreOpen(false); console.log('POS modal', selectedEncounters) }}>
                                <BuildingLightFullIcon className="h-4 w-4 shrink-0 text-gray-400" /> Set POS
                              </button>
                            </div>
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Mobile content — table on desktop, stacked cards on mobile */}
                  <div className="flex-1 overflow-auto">
                    {isDesktop ? (
                      <BillingQueueTable
                        encounters={filteredEncounters}
                        onEncounterSelect={handleEncounterSelect}
                        onEncounterEdit={(encounter) => console.log('Edit encounter:', encounter)}
                        onEncounterClick={handleEncounterClick}
                        onGenerateClaim={(encounter) => handleBulkAction('generate_claims', [encounter.id])}
                        onViewErrors={setShowErrorDialog}
                        onBillingOverrideToggle={(_id, enabled) => console.log('Toggle override:', _id, enabled)}
                        onHcfaBillTypeChange={(_id, billType) => console.log('Change bill type:', _id, billType)}
                        onPrimaryPayerChange={(_id, primaryPayer) => console.log('Change primary payer:', _id, primaryPayer)}
                        selectedEncounters={selectedEncounters}
                        className="h-full"
                      />
                    ) : (
                      <div className="w-full space-y-2.5 pb-32 bg-slate-50 pt-2">
                        {filteredEncounters.map((enc) => {
                          const patientInitials = enc.patientName
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map(part => part[0]?.toUpperCase() ?? '')
                            .join('')

                          const encounterStatus = getEncounterStatusDisplay(enc.status)
                          const billingStatus = getBillStatusDisplay(enc.status)
                          const dateOfServiceFormatted = new Date(enc.dateOfService).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                          const treatmentDurationLabel = formatTreatmentDurationLabelForEncounter(enc)
                          const programLabel =
                            enc.program?.trim() || enc.encounterType || '—'

                          const mServiceLines = [
                            { id: 's1', insurance: 'Primary: Blue Cross Blue Shield', code: '99213', dx: ['Z00.00'] as string[], unit: 1, unitPrice: 120, total: 120, type: 'HCFA', pos: '11', rend: enc.provider.replace(/^Dr\.\s*/i, ''), x12: '-', levels: { p: true, s: false, t: false } },
                            { id: 's2', insurance: 'Primary: Blue Cross Blue Shield', code: '85025', dx: [] as string[], unit: 1, unitPrice: 25, total: 25, type: 'HCFA', pos: '11', rend: enc.provider.replace(/^Dr\.\s*/i, ''), x12: '-', levels: { p: false, s: false, t: false }, hasError: true, errorMessage: 'Not in Service Plan' },
                          ]

                          const mClaimsHistory = [
                            { id: 'c1', date: '03/10/2026', time: '15:23', status: 'Re-opened' },
                            { id: 'c2', date: '03/08/2026', time: '09:41', status: 'Re-opened' },
                            { id: 'c3', date: '03/05/2026', time: '14:02', status: 'Re-opened' },
                          ]

                          const showMore = mobileMoreOpenId === enc.id

                          return (
                            <div
                              key={enc.id}
                              className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col mx-3 overflow-hidden"
                            >
                              {/* Patient header */}
                              <div className="flex flex-row items-start justify-between w-full px-3 py-2">
                                {/* Left: Checkbox + Avatar + Identity */}
                                <div className="flex flex-row items-center justify-center gap-3 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={selectedEncounters.includes(enc.id)}
                                    onChange={(e) => handleEncounterSelect(enc.id, e.target.checked)}
                                    className="w-4 h-4 accent-blue-600 rounded border-slate-300 shrink-0 mt-1"
                                  />
                                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {patientInitials}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <Link
                                      to={`/chart/${enc.patientId}`}
                                      className="text-sm font-bold text-slate-900 truncate leading-tight hover:text-blue-600 transition-colors block"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {enc.patientName}
                                    </Link>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-[10px] text-gray-400">PID: {enc.patientId}</span>
                                      <span className="text-[10px] text-gray-300 mx-0.5">|</span>
                                      <span className="text-[10px] text-gray-400">External ID: {enc.patientMrn}</span>
                                    </div>
                                  </div>
                                </div>
                                {/* Right: Kebab menu */}
                                <div className="shrink-0">
                                  <div className="relative flex items-center text-slate-400">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setMobileMoreOpenId(showMore ? null : enc.id)
                                            }}
                                            className={`p-1.5 rounded-lg transition-colors ${showMore ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-100/50 hover:text-slate-600 active:bg-slate-100'}`}
                                            aria-label="More options"
                                          >
                                            <MoreHorizontal size={16} />
                                          </button>
                                          {showMore && (
                                            <>
                                              <div
                                                role="presentation"
                                                className="fixed inset-0 z-40"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setMobileMoreOpenId(null)
                                                }}
                                              />
                                              <div
                                                className="absolute top-8 right-0 w-[220px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 flex flex-col py-1.5 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <Plus size={15} className="text-slate-400 shrink-0" /> Add &amp; Justify
                                                </button>
                                                <div className="h-px bg-slate-100 my-1 mx-3" />
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <FileText size={15} className="text-slate-400 shrink-0" /> Generate Claims
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <Send size={15} className="text-slate-400 shrink-0" /> Generate &amp; Submit Claims
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <AlertTriangle size={15} className="text-slate-400 shrink-0" /> Check Errors
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <ShieldAlert size={15} className="text-slate-400 shrink-0" /> Override
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <RefreshCw size={15} className="text-slate-400 shrink-0" /> Rebill
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <Edit3 size={15} className="text-slate-400 shrink-0" /> Set Bill Type
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <Edit3 size={15} className="text-slate-400 shrink-0" /> Set Bill-To
                                                </button>
                                                <div className="h-px bg-slate-100 my-1 mx-3" />
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <CheckCircle size={15} className="text-slate-400 shrink-0" /> Mark as Cleared
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <RefreshCw size={15} className="text-slate-400 shrink-0" /> Re-Open
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <AlertTriangle size={15} className="text-slate-400 shrink-0" /> Remove Re-bill
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <ShieldAlert size={15} className="text-slate-400 shrink-0" /> Apply Post Primary Rules
                                                </button>
                                                <div className="h-px bg-slate-100 my-1 mx-3" />
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <BuildingLightFullIcon className="h-[15px] w-[15px] text-slate-400 shrink-0" /> Set POS
                                                </button>
                                                <button type="button" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] text-slate-700 transition-colors text-left w-full">
                                                  <Download size={15} className="text-slate-400 shrink-0" /> Export
                                                </button>
                                              </div>
                                            </>
                                          )}
                                  </div>{/* end relative kebab wrapper */}
                                </div>{/* end right alerts+kebab */}
                              </div>{/* end header row */}

                              {/* Alert capsule buttons */}
                              {/* TODO: restore conditional — (enc.hasErrors || enc.billingOverrideEnabled) */}
                              {(true) && (
                              <div className="flex items-center justify-start gap-2 w-full px-3.5 py-1.5 border-t border-gray-100 bg-white">
                                {/* TODO: restore conditional — enc.hasErrors */}
                                {true && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setAlertModal({ open: true, type: 'goldenThread' }) }}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  Golden Thread
                                </button>
                                )}
                                {/* TODO: restore conditional — enc.billingOverrideEnabled */}
                                {true && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setAlertModal({ open: true, type: 'override' }) }}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                >
                                  <AlertTriangle className="h-3 w-3 text-red-700" />
                                  Override
                                </button>
                                )}
                              </div>
                              )}

                              {/* 2-column data grid */}
                              <div className="grid grid-cols-2 gap-y-2 gap-x-4 px-3 py-2.5 border-y border-gray-100">
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Encounter ID</div>
                                  <button
                                    type="button"
                                    className="text-left text-sm font-medium text-blue-600 hover:underline"
                                    onClick={() => handleEncounterClick(enc)}
                                  >
                                    {enc.id}
                                  </button>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date of Service</div>
                                  <div className="text-sm font-medium text-gray-900">{dateOfServiceFormatted}</div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Program</div>
                                  <div className="text-sm font-medium text-gray-900 truncate">{programLabel}</div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Provider</div>
                                  <div className="text-sm font-medium text-gray-900 truncate">{enc.provider}</div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Treatment Time</div>
                                  <div className="text-sm font-medium text-gray-900 flex items-baseline gap-1.5">
                                    <span>{enc.treatmentTime || '—'}</span>
                                    {treatmentDurationLabel && (
                                      <span className="text-[10px] text-gray-500">({treatmentDurationLabel})</span>
                                    )}
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${mobileEncounterStatusBadgeClass(encounterStatus)}`}>
                                      {encounterStatus}
                                    </span>
                                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight whitespace-nowrap ${mobileBillStatusBadgeClass(billingStatus)}`}>
                                      {billingStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom action row: Fee Sheet (left) | Bill Status + Amount (right) */}
                              <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => e.preventDefault()}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
                                >
                                  <FileText size={13} className="shrink-0" aria-hidden />
                                  Fee Sheet
                                </button>
                                <span className="text-base font-bold text-gray-900 tabular-nums shrink-0">
                                  ${enc.totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>

                              {/* ── Line items / accordions ── */}
                              <div className="flex flex-col gap-1.5 w-full px-3 pb-3">
                                  {/* [3B] Insurance Sub-Cards */}
                                  <div className="flex flex-col">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setShowInsurance(!showInsurance)
                                      }}
                                      className="flex items-center justify-between w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md hover:border-slate-400 active:bg-slate-50 transition-all duration-150 group"
                                    >
                                      <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest">Insurance &amp; Codes</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-medium tabular-nums">{mServiceLines.length} lines</span>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showInsurance ? 'rotate-180' : ''}`} />
                                      </div>
                                    </button>
                                    {showInsurance && (
                                      <div className="mt-2 mb-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                                      <div className="flex flex-col gap-3">
                                      {mServiceLines.map((svc) => (
                                        <div
                                          key={svc.id}
                                          className={`rounded-xl shadow-sm p-3.5 flex flex-col gap-3 mb-0 last:mb-0 border ${
                                            svc.hasError
                                              ? 'bg-red-50 border-red-100'
                                              : 'bg-white border-slate-100'
                                          }`}
                                        >
                                          {/* Insurance selector */}
                                          <button
                                            type="button"
                                            onClick={() => setOpenInsuranceLineId(prev => (prev === svc.id ? null : svc.id))}
                                            className="flex items-center justify-between w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors active:bg-slate-200"
                                          >
                                            <span className="truncate text-left">{svc.insurance}</span>
                                            <ChevronDown
                                              size={14}
                                              className={`text-slate-400 shrink-0 ml-2 transition-transform ${openInsuranceLineId === svc.id ? 'rotate-180' : ''}`}
                                            />
                                          </button>

                                          {/* Insurance level chips */}
                                          <div className="flex flex-wrap items-center gap-2">
                                            {/* Primary */}
                                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                              svc.levels.p
                                                ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                                            }`}>
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                svc.levels.p
                                                  ? 'bg-emerald-200/70'
                                                  : 'bg-amber-200/70'
                                              }`}>
                                                <DollarSign size={14} strokeWidth={2.5} className={svc.levels.p ? 'text-emerald-700' : 'text-amber-700'} />
                                              </div>
                                              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                                svc.levels.p ? 'text-emerald-700' : 'text-amber-700'
                                              }`}>
                                                {svc.levels.p
                                                  ? <Check size={13} strokeWidth={3} className="text-emerald-600" />
                                                  : <Check size={13} strokeWidth={3} className="text-amber-600" />
                                                }
                                                <span>1</span>
                                              </div>
                                            </div>
                                            {/* Secondary */}
                                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                              svc.levels.s
                                                ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                            }`}>
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                svc.levels.s
                                                  ? 'bg-emerald-200/70'
                                                  : 'bg-slate-200/70'
                                              }`}>
                                                <DollarSign size={14} strokeWidth={2.5} className={svc.levels.s ? 'text-emerald-700' : 'text-slate-400'} />
                                              </div>
                                              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                                svc.levels.s ? 'text-emerald-700' : 'text-slate-400'
                                              }`}>
                                                {svc.levels.s
                                                  ? <Check size={13} strokeWidth={3} className="text-emerald-600" />
                                                  : <span className="text-slate-300">–</span>
                                                }
                                                <span>2</span>
                                              </div>
                                            </div>
                                            {/* Tertiary */}
                                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                              svc.levels.t
                                                ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                            }`}>
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                svc.levels.t
                                                  ? 'bg-emerald-200/70'
                                                  : 'bg-slate-200/70'
                                              }`}>
                                                <DollarSign size={14} strokeWidth={2.5} className={svc.levels.t ? 'text-emerald-700' : 'text-slate-400'} />
                                              </div>
                                              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                                svc.levels.t ? 'text-emerald-700' : 'text-slate-400'
                                              }`}>
                                                {svc.levels.t
                                                  ? <Check size={13} strokeWidth={3} className="text-emerald-600" />
                                                  : <span className="text-slate-300">–</span>
                                                }
                                                <span>3</span>
                                              </div>
                                            </div>
                                          </div>
                                          {openInsuranceLineId === svc.id && (
                                            <div className="flex flex-col rounded-lg border border-slate-100 bg-white shadow-sm overflow-hidden">
                                              {[
                                                'Primary: Blue Cross Blue Shield',
                                                'Secondary: Aetna',
                                                'Tertiary: Self Pay',
                                              ].map((label) => (
                                                <button
                                                  key={label}
                                                  type="button"
                                                  onClick={() => setOpenInsuranceLineId(null)}
                                                  className="w-full text-left px-3 py-2.5 text-[12px] text-slate-700 hover:bg-slate-50 active:bg-slate-100 border-b border-slate-100 last:border-b-0"
                                                >
                                                  {label}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                                            <div className="flex flex-col min-w-0">
                                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Code</span>
                                              <span className="text-[12px] text-blue-600 font-medium truncate">
                                                {svc.code}
                                                {svc.dx.length > 0 ? ` (${svc.dx.join(', ')})` : ''}
                                              </span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Diagnosis</span>
                                              {(() => {
                                                const dxText = svc.dx.filter(Boolean).join(', ')
                                                const hasDx = dxText.length > 0
                                                return hasDx ? (
                                                  <button
                                                    type="button"
                                                    className="text-left bg-transparent border-0 p-0 m-0 font-inherit max-w-full rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      console.log('Diagnosis edit (mobile line):', enc.id, svc.id)
                                                    }}
                                                  >
                                                    <span className="text-[12px] text-slate-700 font-medium border-b border-dashed border-gray-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                                                      {dxText}
                                                    </span>
                                                  </button>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1 min-h-[44px] py-2 -my-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      console.log('Diagnosis add/justify (mobile line):', enc.id, svc.id)
                                                    }}
                                                  >
                                                    <span aria-hidden className="select-none">+</span>
                                                    <span>Add/Justify</span>
                                                  </button>
                                                )
                                              })()}
                                            </div>
                                            <div className="flex flex-col items-end min-w-0">
                                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Total</span>
                                              <span className="text-[13px] text-slate-900 font-bold tabular-nums">${svc.total.toFixed(2)}</span>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 border-t border-slate-100 pt-3 mt-1">
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">Unit</span>
                                              <span className="text-[11px] text-slate-700">{svc.unit}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">Unit Price</span>
                                              <span className="text-[11px] text-slate-700">${svc.unitPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">Billing Type</span>
                                              <span className="text-[11px] text-slate-700">{svc.type}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">POS</span>
                                              <span className="text-[11px] text-slate-700">{svc.pos}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">Rend</span>
                                              <span className="text-[11px] text-slate-700">{svc.rend}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[9px] font-semibold text-slate-500 uppercase">X12 Partner</span>
                                              <span className="text-[11px] text-slate-700">{svc.x12}</span>
                                            </div>
                                          </div>
                                          {svc.hasError && svc.errorMessage && (
                                            <div className="mt-3 pt-3 border-t border-red-100">
                                              <span className="text-[13px] font-medium text-red-600">
                                                {svc.errorMessage}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                      </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* [3C] Edit Forms + Claims History */}
                                  <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setShowForms(!showForms)
                                        }}
                                        className="flex items-center justify-between w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md hover:border-slate-400 active:bg-slate-50 transition-all duration-150 group"
                                      >
                                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700 uppercase tracking-widest">
                                          <Edit3 size={13} className="text-slate-400" /> Edit Forms
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showForms ? 'rotate-180' : ''}`} />
                                      </button>
                                      {showForms && (
                                        <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                                        <div className="flex flex-col gap-1.5 pl-0.5">
                                          <button type="button" className="flex items-center justify-between py-2.5 text-left w-full active:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-2 text-[13px] font-medium text-blue-600">
                                              <FileText size={14} className="text-blue-400 shrink-0" />
                                              New Patient Encounter
                                            </div>
                                            <ChevronDown size={14} className="text-slate-400 -rotate-90 shrink-0" />
                                          </button>
                                          <button type="button" className="flex items-center justify-between py-2.5 text-left w-full active:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-2 text-[13px] font-medium text-blue-600">
                                              <FileText size={14} className="text-blue-400 shrink-0" />
                                              Services Conclusion Plan
                                            </div>
                                            <ChevronDown size={14} className="text-slate-400 -rotate-90 shrink-0" />
                                          </button>
                                        </div>
                                        </div>
                                      )}
                                  </div>

                                  <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setShowClaims(!showClaims)
                                        }}
                                        className="flex items-center justify-between w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md hover:border-slate-400 active:bg-slate-50 transition-all duration-150 group"
                                      >
                                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700 uppercase tracking-widest">
                                          <Clock size={13} className="text-slate-400" /> Activity
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showClaims ? 'rotate-180' : ''}`} />
                                      </button>
                                      {showClaims && (
                                        <div className="mt-2 mb-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                                          <div className="flex flex-col gap-0 overflow-hidden rounded-md border border-slate-100 bg-white">
                                          <div className="flex flex-col max-h-[100px] overflow-y-auto divide-y divide-slate-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                            {mClaimsHistory.map((entry) => (
                                              <div
                                                key={entry.id}
                                                className="flex items-center justify-start text-[12px] text-slate-600 py-1 px-3 min-w-0"
                                              >
                                                <span className="truncate">
                                                  {entry.date} {entry.time} {entry.status}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>


                  {/* Fixed Bottom Navigation Bar */}
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-between items-center z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                    <button type="button" className="flex flex-col items-center p-2 min-w-[64px]" onClick={() => navigate('/old-ui-dashboard')}>
                      <HomeIcon className="w-6 h-6 text-slate-500" />
                      <span className="text-[10px] mt-1 font-medium text-slate-500">Dashboard</span>
                    </button>
                    <button type="button" className="flex flex-col items-center p-2 min-w-[64px]" onClick={() => navigate('/my-calendar')}>
                      <CalendarDaysIcon className="w-6 h-6 text-slate-500" />
                      <span className="text-[10px] mt-1 font-medium text-slate-500">Schedule</span>
                    </button>
                    <button type="button" className="flex flex-col items-center p-2 min-w-[64px]" onClick={() => navigate('/clients')}>
                      <UsersIcon className="w-6 h-6 text-slate-500" />
                      <span className="text-[10px] mt-1 font-medium text-slate-500">Clients</span>
                    </button>
                    <button type="button" className="flex flex-col items-center p-2 min-w-[64px]">
                      <BellAlertIcon className="w-6 h-6 text-slate-500" />
                      <span className="text-[10px] mt-1 font-medium text-slate-500">Notifications</span>
                    </button>
                    <button type="button" className="flex flex-col items-center p-2 min-w-[64px]" onClick={() => setMoreSheetOpen(prev => !prev)}>
                      <EllipsisHorizontalIcon className="w-6 h-6 text-blue-600" />
                      <span className="text-[10px] mt-1 font-medium text-blue-600">More</span>
                    </button>
                  </div>

                  {/* "More" Bottom Sheet */}
                  <div
                    className={`fixed inset-0 bg-black/40 z-[55] transition-opacity duration-300 ${
                      moreSheetOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setMoreSheetOpen(false)}
                  />
                  <div
                    className={`fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
                      moreSheetOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ maxHeight: '85vh' }}
                  >
                    <div className="flex justify-center pt-3 pb-1">
                      <div className="w-10 h-1 rounded-full bg-slate-300" />
                    </div>

                    <div className="flex items-center justify-between px-5 pb-4">
                      <h2 className="text-lg font-semibold text-slate-900">Navigation Menu</h2>
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                          <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full" onClick={() => setMoreSheetOpen(false)}>
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-y-auto px-5 pb-10" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Access</p>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {([
                          { icon: HomeIcon, label: 'Dashboard', route: '/old-ui-dashboard' },
                          { icon: CalendarDaysIcon, label: 'Schedule', route: '/my-calendar' },
                          { icon: UsersIcon, label: 'Clients', route: '/clients' },
                          { icon: BellAlertIcon, label: 'Notifications', route: '' },
                        ] as const).map((item) => {
                          const isHighlighted = item.label === 'Billing'
                          return (
                            <button
                              key={item.label}
                              type="button"
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                isHighlighted
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                              onClick={() => {
                                setMoreSheetOpen(false)
                                if (item.route) navigate(item.route)
                              }}
                            >
                              <item.icon className={`w-5 h-5 flex-shrink-0 ${isHighlighted ? 'text-blue-600' : 'text-slate-500'}`} />
                              {item.label}
                            </button>
                          )
                        })}
                      </div>

                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">More Options</p>
                      <div className="flex flex-col gap-1">
                        {([
                          { icon: ClipboardDocumentIcon, label: 'ADL', route: '/adl' },
                          { icon: ClockIcon, label: 'Wait List', route: '/wait-list' },
                          { icon: UserGroupIcon, label: 'Staff Dashboard', route: '/staff-dashboard' },
                          { icon: BeakerIcon, label: 'Practice', route: '/practice' },
                          { icon: BanknotesIcon, label: 'Billing', route: '/billing' },
                          { icon: ChartBarIcon, label: 'Reports', route: '/reports' },
                          { icon: InboxIcon, label: 'Inbox', route: '/task-hub' },
                        ] as const).map((item) => {
                          const isActive = item.label === 'Billing'
                          return (
                            <button
                              key={item.label}
                              type="button"
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-colors ${
                                isActive
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                              onClick={() => {
                                setMoreSheetOpen(false)
                                if (item.route) navigate(item.route)
                              }}
                            >
                              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      {showErrorDialog && (
        <BillingErrorDialog
          encounter={showErrorDialog}
          isOpen={!!showErrorDialog}
          onClose={() => setShowErrorDialog(null)}
          onOverrideError={handleOverrideError}
          canOverride={true} // In real app, check user permissions
        />
      )}

      {/* Alert capsule centered modal */}
      {alertModal.open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setAlertModal(prev => ({ ...prev, open: false }))}
        >
          <div
            className="w-[95%] max-w-sm p-6 bg-white rounded-xl shadow-2xl relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAlertModal(prev => ({ ...prev, open: false }))}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-semibold text-gray-950 mb-3">
              {alertModal.type === 'goldenThread' ? 'Golden Thread Error' : 'Override Details'}
            </h3>
            <p className="text-sm text-gray-600">
              {alertModal.type === 'goldenThread'
                ? 'Multiple critical validation rules were triggered. You cannot bill this until issues are resolved.'
                : 'A previous user enabled an override on this encounter. Ensure all data is correct before proceeding.'}
            </p>
          </div>
        </div>
      )}

      {/* Override Dialog */}
      <OverrideDialog
        open={showOverrideDialog}
        onClose={() => {
          overrideDialogSelectionRef.current = []
          setShowOverrideDialog(false)
        }}
        encounters={selectedEncounterObjects}
        onConfirm={handleOverrideConfirm}
        actionType={overrideActionType}
      />
      </div>
    </TooltipProvider>
  )
}

export default BillingManagerPage
