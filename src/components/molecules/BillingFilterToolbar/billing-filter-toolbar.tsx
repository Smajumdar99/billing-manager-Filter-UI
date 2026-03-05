import { FC, useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { Pencil, X } from 'lucide-react'
import { Icon } from '@/components/atoms/Icon/Icon'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group'
import { Calendar } from '@/components/atoms/Calendar/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/Popover/popover'
import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'

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
}) => {
  // ---- Committed state (what the parent knows about) ----
  const [appliedFilters, setAppliedFilters] = useState<SelectedFilter[]>([])

  // ---- Staging: completed filters inside the popover ----
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
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
    onSortChange?.(field, currentSort?.direction ?? 'desc')
  }

  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    onSortChange?.(currentSort?.field ?? 'dateOfService', direction)
  }

  // ===========================================================================
  // JSX
  // ===========================================================================
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
          <Icon icon="filter" className="w-4 h-4" />
          Filters
          {appliedFilters.length > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {appliedFilters.length}
            </span>
          )}
        </button>

        {/* ===== Two-Pane Popover ===== */}
        {isFiltersOpen && (
          <div
            className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-xl w-[780px] flex flex-col"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {/* Body: two panes */}
            <div className="flex flex-1 min-h-0 overflow-hidden" style={{ minHeight: 420 }}>

              {/* ---- Left Pane: search + category list ---- */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-100">
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
                <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
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
              <div className="w-2/3 flex flex-col bg-slate-50">
                {/* Header */}
                <div className="flex justify-between items-center w-full px-4 pt-4 pb-3">
                  <span className="text-lg font-bold text-slate-800">Selected Criteria</span>
                  <span className="text-base text-slate-500">{selectedFilters.length} selected</span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-3">
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
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-white rounded-b-xl">
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
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            isSortOpen
              ? 'bg-gray-100 border-gray-400 text-gray-900'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Icon icon="sort" className="w-4 h-4" />
          Sort By
          <Icon icon={isSortOpen ? 'chevron-up' : 'chevron-down'} className="w-3 h-3 ml-0.5" />
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

            <RadioGroup
              value={currentSort?.field ?? ''}
              onValueChange={handleSortFieldChange}
              className="gap-3"
            >
              {SORT_FIELDS.map(field => (
                <div key={field.value} className="flex items-center gap-2.5">
                  <RadioGroupItem value={field.value} id={`sort-field-${field.value}`} />
                  <label htmlFor={`sort-field-${field.value}`} className="text-sm text-gray-700 cursor-pointer select-none">
                    {field.label}
                  </label>
                </div>
              ))}
            </RadioGroup>

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

      {/* ===== Right Side: Action Buttons (passed via children) ===== */}
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {children}
        </div>
      )}
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
                    ? 'bg-blue-600 border-blue-600 text-white'
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
                  ? 'bg-blue-600 border-blue-600 text-white'
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
                  ? 'bg-blue-600 border-blue-600 text-white'
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
                ? 'bg-blue-600 text-white'
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

export default BillingFilterToolbar
