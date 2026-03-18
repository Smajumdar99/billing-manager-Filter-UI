import { FC, useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { Pencil, X, Filter, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { Icon } from '@/components/atoms/Icon/Icon'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group'
import { Calendar } from '@/components/atoms/Calendar/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/Popover/popover'
import { format } from 'date-fns'
import { CalendarIcon, CheckCircleIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterCategory {
  id: string
  label: string
  template: 'multiselect' | 'date' | 'yesno' | 'service_code' | 'text' | 'select' | 'range'
  options?: string[]
}

export type FilterValues = Record<string, any>

export interface BillingFilterToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onApplyFilters: (selectedCategories: string[]) => void
  onFilterValuesChange: (values: FilterValues) => void
  onClearFilters: () => void
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void
  currentSort?: { field: string; direction: 'asc' | 'desc' }
  children?: ReactNode
  className?: string
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
  /** Billing Type dropdown in filter section (right-aligned when provided) */
  billingTypeValue?: string
  onBillingTypeChange?: (value: string) => void
  billingTypeOptions?: { value: string; label: string }[]
}

interface SelectedFilter {
  categoryId: string
  value: any
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'authorization_status', label: 'Authorization Status', template: 'multiselect', options: ['Authorized', 'Pending', 'Denied', 'Not Required', 'Expired'] },
  { id: 'billing_units', label: 'Billing Units', template: 'range' },
  { id: 'current_billed_insurance', label: 'Current Billed Insurance', template: 'multiselect', options: ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'UnitedHealth', 'Cigna', 'Humana', 'Anthem', 'EAP', 'Tricare', 'Self Pay', 'Other'] },
  { id: 'date_of_entry', label: 'Date of Entry', template: 'date' },
  { id: 'encounter_complete_status', label: 'Encounter Complete Status', template: 'select', options: ['Complete', 'Incomplete', 'Pending'] },
  { id: 'encounter_service_code_count', label: 'Encounter Service Code Count', template: 'range' },
  { id: 'program_name', label: 'Program Name', template: 'multiselect', options: ['Outpatient Mental Health', 'Inpatient Psychiatry', 'Emergency', 'Intensive Outpatient', 'Partial Hospitalization', 'Crisis Center'] },
  { id: 'hl7_partner', label: 'HL7 Partner', template: 'select', options: ['Partner A', 'Partner B', 'Partner C', 'None'] },
  { id: 'location', label: 'Location', template: 'multiselect', options: ['Main Campus', 'Satellite Clinic A', 'Satellite Clinic B', 'Telehealth', 'Home Visit'] },
  { id: 'modifiers', label: 'Modifiers', template: 'multiselect', options: ['25', '26', '59', 'GT', '95', 'Other'] },
  { id: 'person_first_name', label: 'Person First Name', template: 'text' },
  { id: 'person_last_name', label: 'Person Last Name', template: 'text' },
  { id: 'person_id', label: 'Person Id', template: 'text' },
  { id: 'place_of_service', label: 'Place Of Service', template: 'select', options: ['Office', 'Home', 'Hospital', 'Telehealth', 'Other'] },
  { id: 'provider', label: 'Provider', template: 'multiselect', options: ['Psychiatrist', 'Therapist', 'Social Worker', 'Counselor', 'Psychologist', 'Nurse Practitioner'] },
  { id: 'service_code', label: 'Service Code', template: 'service_code' },
  { id: 'whether_insured', label: 'Whether Insured', template: 'yesno' },
  { id: 'bill_type', label: 'Bill Type', template: 'multiselect', options: ['Professional', 'Institutional', 'UB04', 'HCFA', 'Emergency', 'Routine'] },
  { id: 'charge_coded', label: 'Charge Coded', template: 'yesno' },
  { id: 'date_of_billing', label: 'Date of Billing', template: 'date' },
  { id: 'date_of_service', label: 'Date of Service', template: 'date' },
  { id: 'encounter_reprocessed_date', label: 'Encounter Reprocessed Date', template: 'date' },
  { id: 'encounter_status', label: 'Encounter Status', template: 'select', options: ['Open', 'Closed', 'Pending', 'In Progress'] },
  { id: 'funding_source', label: 'Funding Source', template: 'multiselect', options: ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'UnitedHealth', 'Cigna', 'Self Pay', 'Government', 'Corporate', 'Other'] },
  { id: 'last_level_billed', label: 'Last Level Billed', template: 'select', options: ['Primary', 'Secondary', 'Tertiary', 'Patient'] },
  { id: 'marked_for_rebill', label: 'Marked For Rebill', template: 'yesno' },
  { id: 'prp_billing', label: 'PRP Billing', template: 'select', options: ['Current Month', 'Previous Month', 'Custom'] },
  { id: 'person_name', label: 'Person Name', template: 'text' },
  { id: 'billing_status', label: 'Billing Status', template: 'multiselect', options: ['Ready to Bill', 'Unbilled', 'No Claims Generated', 'Billed', 'Denied', 'Authorized', 'Unauthorized', 'In Review', 'Claim Generated', 'Claim Submitted', 'Claim Accepted', 'Paid', 'Partially Paid'] },
  { id: 'claim_type', label: 'Claim Type', template: 'multiselect', options: ['Primary', 'Secondary', 'Electronic', 'Paper'] },
  { id: 'date_of_discharge', label: 'Date of Discharge', template: 'date' },
  { id: 'encounter', label: 'Encounter', template: 'text' },
  { id: 'encounter_reprocessed_status', label: 'Encounter Reprocessed Status', template: 'select', options: ['Reprocessed', 'Not Reprocessed', 'Pending'] },
  { id: 'exclude_zero_balance', label: 'Exclude Encounters With Zero Balance', template: 'yesno' },
  { id: 'funding_source_type', label: 'Funding Source Type', template: 'select', options: ['Commercial', 'Medicare', 'Medicaid', 'Self Pay', 'Workers Comp', 'Other'] },
  { id: 'last_level_closed', label: 'Last Level Closed', template: 'select', options: ['Primary', 'Secondary', 'Tertiary', 'Patient'] },
  { id: 'marked_as_cleared', label: 'Marked as Cleared', template: 'yesno' },
  { id: 'payment_id', label: 'Payment Id', template: 'text' },
]

const CATEGORY_MAP = new Map(FILTER_CATEGORIES.map(c => [c.id, c]))

const SORT_FIELDS = [
  { value: 'dateOfService', label: 'Encounter Date' },
  { value: 'id', label: 'Encounter Id' },
  { value: 'patientName', label: 'Person Last Name' },
  { value: 'patientFirstName', label: 'Person First Name' },
]

const SERVICE_CODE_TABS = ['All', 'CPT4', 'HCPCS', 'ICD10-PCS', 'Rev'] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatFilterValue = (cat: FilterCategory, value: any): string => {
  if (value === undefined || value === null || value === '') return 'Any'
  switch (cat.template) {
    case 'multiselect':
      return Array.isArray(value) && value.length > 0 ? value.join(', ') : 'Any'
    case 'date': {
      const from = value?.from ? format(new Date(value.from), 'dd/MM/yyyy') : ''
      const to = value?.to ? format(new Date(value.to), 'dd/MM/yyyy') : ''
      if (from && to) return `${from} – ${to}`
      if (from) return `From ${from}`
      if (to) return `To ${to}`
      return 'Any'
    }
    case 'yesno':
      return value === true ? 'Yes' : value === false ? 'No' : 'Any'
    case 'text':
      return typeof value === 'string' && value.trim() ? value : 'Any'
    case 'select':
      return typeof value === 'string' ? value : 'Any'
    case 'range': {
      const min = value?.min ?? ''
      const max = value?.max ?? ''
      if (min && max) return `${min} – ${max}`
      if (min) return `≥ ${min}`
      if (max) return `≤ ${max}`
      return 'Any'
    }
    case 'service_code':
      return value?.search ? `${value.tab ?? 'All'}: ${value.search}` : 'Any'
    default:
      return String(value)
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BillingFilterToolbar: FC<BillingFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onApplyFilters,
  onFilterValuesChange,
  onClearFilters,
  onSortChange,
  currentSort,
  children,
  className = '',
  externalOpen,
  onExternalOpenChange,
  billingTypeValue,
  onBillingTypeChange,
  billingTypeOptions = [],
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null)
  const [mobileDraftValue, setMobileDraftValue] = useState<any>(undefined)

  // ---- Committed state (what the parent knows about) ----
  const [appliedFilters, setAppliedFilters] = useState<SelectedFilter[]>([])

  // ---- Staging: completed filters inside the popover ----
  const [isFiltersOpenInternal, setIsFiltersOpenInternal] = useState(false)
  const isFiltersOpen = externalOpen !== undefined ? externalOpen : isFiltersOpenInternal
  const setIsFiltersOpen = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(isFiltersOpenInternal) : v
    setIsFiltersOpenInternal(next)
    onExternalOpenChange?.(next)
  }, [isFiltersOpenInternal, onExternalOpenChange])
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([])

  // ---- Draft: the single category being configured right now ----
  const [draftFilter, setDraftFilter] = useState<string | null>(null)
  const [draftValue, setDraftValue] = useState<any>(undefined)

  // ---- Left-pane search ----
  const [filterSearch, setFilterSearch] = useState('')

  // ---- Sort popover ----
  const [isSortOpen, setIsSortOpen] = useState(false)

  // ---- Refs for click-outside ----
  const filtersRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
      setIsFiltersOpen(false)
    }
    if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
      setIsSortOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  // Sync staging state when the popover opens
  useEffect(() => {
    if (isFiltersOpen) {
      setSelectedFilters([...appliedFilters])
      setDraftFilter(null)
      setDraftValue(undefined)
      setFilterSearch('')
    }
  }, [isFiltersOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Derived ----
  const selectedCategoryIds = useMemo(
    () => new Set(selectedFilters.map(f => f.categoryId)),
    [selectedFilters],
  )

  const visibleCategories = useMemo(() => {
    if (!filterSearch.trim()) return FILTER_CATEGORIES
    const q = filterSearch.toLowerCase()
    return FILTER_CATEGORIES.filter(c => c.label.toLowerCase().includes(q))
  }, [filterSearch])

  const draftCat = draftFilter ? CATEGORY_MAP.get(draftFilter) ?? null : null

  // ---- Handlers ----

  const handleCategoryClick = (catId: string) => {
    if (draftFilter || selectedCategoryIds.has(catId)) return
    setDraftFilter(catId)
    setDraftValue(undefined)
  }

  const handleConfirmDraft = () => {
    if (!draftFilter) return
    setSelectedFilters(prev => [...prev, { categoryId: draftFilter, value: draftValue }])
    setDraftFilter(null)
    setDraftValue(undefined)
  }

  const handleCancelDraft = () => {
    setDraftFilter(null)
    setDraftValue(undefined)
  }

  const handleEditFilter = (catId: string) => {
    const existing = selectedFilters.find(f => f.categoryId === catId)
    setSelectedFilters(prev => prev.filter(f => f.categoryId !== catId))
    setDraftFilter(catId)
    setDraftValue(existing?.value)
  }

  const handleDeleteFilter = (catId: string) => {
    setSelectedFilters(prev => prev.filter(f => f.categoryId !== catId))
  }

  const handleApply = () => {
    setAppliedFilters([...selectedFilters])
    const catIds = selectedFilters.map(f => f.categoryId)
    const vals: FilterValues = {}
    for (const f of selectedFilters) {
      if (f.value !== undefined) vals[f.categoryId] = f.value
    }
    onApplyFilters(catIds)
    onFilterValuesChange(vals)
    setIsFiltersOpen(false)
  }

  const handleClearAll = () => {
    setSelectedFilters([])
    setDraftFilter(null)
    setDraftValue(undefined)
    setAppliedFilters([])
    onClearFilters()
    onFilterValuesChange({})
    setIsFiltersOpen(false)
  }

  const handleSortFieldChange = (field: string) => {
    if (currentSort?.field === field) {
      onSortChange?.('', currentSort?.direction ?? 'desc')
    } else {
      onSortChange?.(field, currentSort?.direction ?? 'desc')
    }
  }

  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    onSortChange?.(currentSort?.field ?? 'dateOfService', direction)
  }

  // ===========================================================================
  // Mobile handlers
  // ===========================================================================
  const handleMobileCategoryToggle = (catId: string) => {
    if (mobileExpandedCat === catId) {
      setMobileExpandedCat(null)
      setMobileDraftValue(undefined)
    } else {
      const existing = selectedFilters.find(f => f.categoryId === catId)
      setMobileExpandedCat(catId)
      setMobileDraftValue(existing?.value)
    }
  }

  const handleMobileConfirm = () => {
    if (!mobileExpandedCat) return
    setSelectedFilters(prev => {
      const without = prev.filter(f => f.categoryId !== mobileExpandedCat)
      return [...without, { categoryId: mobileExpandedCat, value: mobileDraftValue }]
    })
    setMobileExpandedCat(null)
    setMobileDraftValue(undefined)
  }

  const handleMobileCancel = () => {
    setMobileExpandedCat(null)
    setMobileDraftValue(undefined)
  }

  const handleMobileDeleteFilter = (catId: string) => {
    setSelectedFilters(prev => prev.filter(f => f.categoryId !== catId))
  }

  const handleMobileEditFilter = (catId: string) => {
    const existing = selectedFilters.find(f => f.categoryId === catId)
    setMobileExpandedCat(catId)
    setMobileDraftValue(existing?.value)
  }

  const handleMobileApply = () => {
    setAppliedFilters([...selectedFilters])
    const catIds = selectedFilters.map(f => f.categoryId)
    const vals: FilterValues = {}
    for (const f of selectedFilters) {
      if (f.value !== undefined) vals[f.categoryId] = f.value
    }
    onApplyFilters(catIds)
    onFilterValuesChange(vals)
    setIsFiltersOpen(false)
    setMobileExpandedCat(null)
  }

  const handleMobileClearAll = () => {
    setSelectedFilters([])
    setMobileExpandedCat(null)
    setMobileDraftValue(undefined)
    setAppliedFilters([])
    onClearFilters()
    onFilterValuesChange({})
    setIsFiltersOpen(false)
  }

  // ===========================================================================
  // JSX
  // ===========================================================================

  // ─── Mobile full-screen modal ───
  if (!isDesktop && isFiltersOpen) {
    const mobileCatIds = new Set(selectedFilters.map(f => f.categoryId))
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col h-[100dvh]">
        {/* ── Header ── */}
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={() => { setIsFiltersOpen(false); setMobileExpandedCat(null) }}
            className="p-2 -mr-2 rounded-lg active:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* ── Selected Criteria chips ── */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 min-h-[68px] flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selected Criteria</span>
            <span className="text-xs text-slate-500">{selectedFilters.length} selected</span>
          </div>
          {selectedFilters.length === 0 ? (
            <p className="text-xs text-slate-400">No criteria selected — tap a category below to add filters.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedFilters.map(f => {
                const cat = CATEGORY_MAP.get(f.categoryId)!
                return (
                  <div
                    key={f.categoryId}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 pl-3 pr-1.5 py-1.5 rounded-lg text-xs shadow-sm"
                  >
                    <span className="font-medium text-slate-700">{cat.label}:</span>
                    <span className="text-slate-500 max-w-[100px] truncate">{formatFilterValue(cat, f.value)}</span>
                    <button
                      type="button"
                      onClick={() => handleMobileEditFilter(f.categoryId)}
                      className="p-1 rounded active:bg-slate-100"
                    >
                      <Pencil size={12} className="text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMobileDeleteFilter(f.categoryId)}
                      className="p-1 rounded active:bg-slate-100"
                    >
                      <X size={12} className="text-slate-400" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Category accordion list ── */}
        <div className="flex-1 overflow-y-auto pb-24">
          {FILTER_CATEGORIES.map(cat => {
            const hasActiveFilter = mobileCatIds.has(cat.id)
            const isExpanded = mobileExpandedCat === cat.id
            const mobileDraftCat = isExpanded ? cat : null

            return (
              <div key={cat.id}>
                {/* Category header row */}
                <button
                  type="button"
                  onClick={() => handleMobileCategoryToggle(cat.id)}
                  className={`w-full flex justify-between items-center px-4 py-3.5 border-b border-slate-100 transition-colors active:bg-slate-50 ${
                    isExpanded ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {hasActiveFilter && (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${hasActiveFilter ? 'text-slate-900 font-semibold' : 'text-slate-700 font-medium'}`}>
                      {cat.label}
                    </span>
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded configuration panel */}
                {isExpanded && mobileDraftCat && (
                  <div className="bg-white px-4 py-4 border-b border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
                    <h4 className="text-[#1a73e8] font-medium text-sm mb-3">
                      Configure: {mobileDraftCat.label}
                    </h4>
                    <MobileCardBody cat={mobileDraftCat} value={mobileDraftValue} onChange={setMobileDraftValue} />
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
                      <button
                        type="button"
                        onClick={handleMobileCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg active:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleMobileConfirm}
                        className="px-5 py-2 text-sm font-medium text-white bg-[#1a73e8] rounded-lg active:bg-blue-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Fixed footer ── */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3.5 border-t border-slate-200 bg-white flex gap-3" style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}>
          <button
            type="button"
            onClick={handleMobileClearAll}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl active:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleMobileApply}
            disabled={mobileExpandedCat !== null}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] rounded-xl active:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Apply Filters ({selectedFilters.length})
          </button>
        </div>
      </div>
    )
  }

  // On mobile when filter modal is closed, render nothing (parent handles its own filter button)
  if (!isDesktop) return null

  // ─── Desktop toolbar (unchanged) ───
  return (
    <div className={`flex items-center justify-between gap-4 py-3 px-4 ${className}`}>
      {/* ===== Left Side: Filters + Sort By + Search ===== */}
      <div className="flex items-center gap-3">

      {/* ----- Filters Button + Two-Pane Popover ----- */}
      <div className="relative" ref={filtersRef}>
        <button
          onClick={() => { setIsFiltersOpen(prev => !prev); setIsSortOpen(false) }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            isFiltersOpen
              ? 'bg-gray-100 border-gray-400 text-gray-900'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          Filters
          {appliedFilters.length > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {appliedFilters.length}
            </span>
          )}
        </button>

        {/* ===== Two-Pane Popover ===== */}
        {isFiltersOpen && (
          <div className="absolute z-50 mt-2 w-[800px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden max-h-[calc(100vh-250px)]">
            {/* Body: two panes */}
            <div className="flex flex-1 min-h-0">

              {/* ---- Left Pane: search + category list ---- */}
              <div className="w-1/3 flex flex-col min-h-0 border-r border-gray-200">
                <div className="shrink-0 p-3 border-b border-gray-100">
                  <div className="relative">
                    <Icon icon="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={e => setFilterSearch(e.target.value)}
                      placeholder="Search filters..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                  {visibleCategories.map(cat => {
                    const isAlreadySelected = selectedCategoryIds.has(cat.id)
                    const isCurrentDraft = draftFilter === cat.id
                    const isDisabled = (draftFilter !== null && !isCurrentDraft) || isAlreadySelected

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        disabled={isDisabled}
                        className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors ${
                          isCurrentDraft
                            ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                            : isAlreadySelected
                            ? 'bg-gray-50 text-gray-400 cursor-default'
                            : isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        {isAlreadySelected && (
                          <Icon icon="check" className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        )}
                        <span>{cat.label}</span>
                      </button>
                    )
                  })}
                  {visibleCategories.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">No filters match your search.</p>
                  )}
                </div>
              </div>

              {/* ---- Right Pane ---- */}
              <div className="w-2/3 bg-slate-50 flex flex-col min-h-0">
                {/* Header */}
                <div className="shrink-0 p-4 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Selected Criteria</span>
                  <span className="text-base text-slate-500">{selectedFilters.length} selected</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {/* Draft configuration card */}
                  {draftCat && (
                    <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm p-3 mb-3">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2.5">
                        Configure: {draftCat.label}
                      </h4>
                      <CardBody cat={draftCat} value={draftValue} onChange={setDraftValue} />
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={handleCancelDraft}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmDraft}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed filter cards */}
                  {selectedFilters.length === 0 && !draftCat ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-slate-400">No criteria selected</p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {selectedFilters.map(f => {
                        const cat = CATEGORY_MAP.get(f.categoryId)!
                        return (
                          <div
                            key={f.categoryId}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between bg-white"
                          >
                            <div className="text-sm min-w-0">
                              <span className="font-semibold text-slate-800">{cat.label}:</span>
                              <span className="text-slate-500 ml-1">{formatFilterValue(cat, f.value)}</span>
                            </div>
                            <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                              <button
                                onClick={() => handleEditFilter(f.categoryId)}
                                title={`Edit ${cat.label}`}
                              >
                                <Pencil size={16} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                              </button>
                              <button
                                onClick={() => handleDeleteFilter(f.categoryId)}
                                title={`Remove ${cat.label}`}
                              >
                                <X size={16} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ---- Footer ---- */}
            <div className="shrink-0 p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                disabled={draftFilter !== null}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----- Sort By Button + Popover ----- */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => { setIsSortOpen(prev => !prev); setIsFiltersOpen(false) }}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            isSortOpen
              ? 'bg-gray-100 border-gray-400 text-gray-900'
              : currentSort?.field
                ? 'bg-white border-2 border-primary text-gray-700 hover:bg-gray-50'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown size={16} />
          Sort By
          {isSortOpen ? <ChevronUp size={14} className="ml-0.5" /> : <ChevronDown size={14} className="ml-0.5" />}
        </button>

        {isSortOpen && (
          <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg w-60 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-900">Sort By</span>
              <button
                onClick={() => setIsSortOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon icon="chevron-up" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {SORT_FIELDS.map(field => {
                const isActive = currentSort?.field === field.value
                return (
                  <button
                    key={field.value}
                    onClick={() => handleSortFieldChange(field.value)}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isActive ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </span>
                    <span className="text-sm text-gray-700 select-none">{field.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="border-t border-gray-200 my-4" />

            <RadioGroup
              value={currentSort?.direction ?? 'desc'}
              onValueChange={(val) => handleSortDirectionChange(val as 'asc' | 'desc')}
              className="gap-3"
            >
              <div className="flex items-center gap-2.5">
                <RadioGroupItem value="desc" id="sort-dir-desc" />
                <Icon icon="arrow-down" className="w-3.5 h-3.5 text-gray-500" />
                <label htmlFor="sort-dir-desc" className="text-sm text-gray-700 cursor-pointer select-none">
                  Newest First
                </label>
              </div>
              <div className="flex items-center gap-2.5">
                <RadioGroupItem value="asc" id="sort-dir-asc" />
                <Icon icon="arrow-up" className="w-3.5 h-3.5 text-gray-500" />
                <label htmlFor="sort-dir-asc" className="text-sm text-gray-700 cursor-pointer select-none">
                  Oldest First
                </label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* ----- Global Search Input ----- */}
      <div className="relative w-[400px]">
        <Icon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search patients, MRN, Encounters..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      </div>

      {/* ===== Right Side: Billing Type (right-aligned) + Action Buttons (children) ===== */}
      <div className="ml-auto flex items-center gap-3 flex-shrink-0">
        {(billingTypeValue != null && onBillingTypeChange && billingTypeOptions.length > 0) && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Billing Type:</span>
            <Select value={billingTypeValue} onValueChange={onBillingTypeChange}>
              <SelectTrigger className="w-[160px] h-8 text-sm bg-slate-50/80 border-gray-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {billingTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================================================================
// CardBody — the switch statement rendering the correct input template
// ===========================================================================

const CardBody: FC<{
  cat: FilterCategory
  value: any
  onChange: (val: any) => void
}> = ({ cat, value, onChange }) => {
  switch (cat.template) {
    case 'multiselect': {
      const selected: string[] = Array.isArray(value) ? value : []
      const toggle = (opt: string) =>
        onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])

      return (
        <div className="flex flex-wrap gap-1.5">
          {(cat.options ?? []).map(opt => {
            const active = selected.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                  active
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )
    }

    case 'date':
      return <DateRangeCard value={value} onChange={onChange} />

    case 'yesno':
      return (
        <div className="flex gap-2">
          {([
            { label: 'Yes', v: true },
            { label: 'No', v: false },
          ] as const).map(opt => (
            <button
              key={opt.label}
              onClick={() => onChange(opt.v)}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                value === opt.v
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )

    case 'service_code':
      return <ServiceCodeCard value={value} onChange={onChange} />

    case 'text':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${cat.label.toLowerCase()}...`}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )

    case 'select':
      return (
        <div className="flex flex-wrap gap-1.5">
          {(cat.options ?? []).map(opt => (
            <button
              key={opt}
              onClick={() => onChange(value === opt ? null : opt)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                value === opt
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )

    case 'range': {
      const min = value?.min ?? ''
      const max = value?.max ?? ''
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              value={min}
              onChange={e => onChange({ min: e.target.value, max })}
              placeholder="0"
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              value={max}
              onChange={e => onChange({ min, max: e.target.value })}
              placeholder="1000"
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

// ===========================================================================
// Date Range card body (uses project Calendar + Popover atoms)
// ===========================================================================

const DateRangeCard: FC<{
  value: any
  onChange: (val: any) => void
}> = ({ value, onChange }) => {
  const fromDate: Date | undefined = value?.from ? new Date(value.from) : undefined
  const toDate: Date | undefined = value?.to ? new Date(value.to) : undefined

  const handleFromSelect = (date: Date | undefined) => {
    onChange({ from: date?.toISOString().split('T')[0] ?? '', to: value?.to ?? '' })
  }

  const handleToSelect = (date: Date | undefined) => {
    onChange({ from: value?.from ?? '', to: date?.toISOString().split('T')[0] ?? '' })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">From</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-left transition-colors">
              <span className={fromDate ? 'text-gray-900' : 'text-gray-400'}>
                {fromDate ? format(fromDate, 'dd-MM-yyyy') : 'dd-mm-yyyy'}
              </span>
              <CalendarIcon className="w-4 h-4 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">To</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-left transition-colors">
              <span className={toDate ? 'text-gray-900' : 'text-gray-400'}>
                {toDate ? format(toDate, 'dd-MM-yyyy') : 'dd-mm-yyyy'}
              </span>
              <CalendarIcon className="w-4 h-4 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// ===========================================================================
// Service Code card body (stateful for internal tab)
// ===========================================================================

const ServiceCodeCard: FC<{
  value: any
  onChange: (val: any) => void
}> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<typeof SERVICE_CODE_TABS[number]>('All')
  const searchVal: string = value?.search ?? ''

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {SERVICE_CODE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="relative">
        <Icon icon="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={e => onChange({ ...value, search: e.target.value, tab: activeTab })}
          placeholder="Search by code, description..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  )
}

// ===========================================================================
// MobileCardBody — touch-optimised filter configuration inputs
// ===========================================================================

const MobileCardBody: FC<{
  cat: FilterCategory
  value: any
  onChange: (val: any) => void
}> = ({ cat, value, onChange }) => {
  switch (cat.template) {
    case 'multiselect': {
      const selected: string[] = Array.isArray(value) ? value : []
      const toggle = (opt: string) =>
        onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])

      return (
        <div className="flex flex-wrap gap-2">
          {(cat.options ?? []).map(opt => {
            const active = selected.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  active
                    ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                    : 'border-slate-300 text-slate-600 active:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )
    }

    case 'date':
      return <DateRangeCard value={value} onChange={onChange} />

    case 'yesno':
      return (
        <div className="flex gap-3">
          {([
            { label: 'Yes', v: true },
            { label: 'No', v: false },
          ] as const).map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.v)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                value === opt.v
                  ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                  : 'bg-white border-slate-300 text-slate-600 active:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )

    case 'service_code':
      return <ServiceCodeCard value={value} onChange={onChange} />

    case 'text':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${cat.label.toLowerCase()}...`}
          className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )

    case 'select':
      return (
        <div className="flex flex-wrap gap-2">
          {(cat.options ?? []).map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(value === opt ? null : opt)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                value === opt
                  ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                  : 'border-slate-300 text-slate-600 active:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )

    case 'range': {
      const min = value?.min ?? ''
      const max = value?.max ?? ''
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Min</label>
            <input
              type="number"
              value={min}
              onChange={e => onChange({ min: e.target.value, max })}
              placeholder="0"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Max</label>
            <input
              type="number"
              value={max}
              onChange={e => onChange({ min, max: e.target.value })}
              placeholder="1000"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

export default BillingFilterToolbar
