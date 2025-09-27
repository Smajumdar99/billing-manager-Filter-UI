import { FC, useState, useMemo } from 'react'
import { Input } from '@/components/atoms/Input/input'
import { Button } from '@/components/atoms/Button/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select/select'
import { Badge } from '@/components/atoms/Badge/badge'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { BillingQueueFilters, PayerType, BillingStatus, BillType, ErrorType } from '@/types/billing-manager'

export interface BillingQueueFiltersProps {
  filters: BillingQueueFilters
  onFiltersChange: (filters: BillingQueueFilters) => void
  onClearFilters: () => void
  encounterCount: number
  className?: string
}

// Define criteria types
interface FilterCriteria {
  value: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'range' | 'toggle' | 'text'
  options?: string[]
}

/**
 * BillingFiltersPanel Component
 * 
 * Advanced filtering interface with criteria dropdown approach.
 * Users select a criteria type, then choose from relevant options below.
 * Reduces cognitive load and makes advanced filters more discoverable.
 */
export const BillingFiltersPanel: FC<BillingQueueFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  encounterCount,
  className = ""
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string>('')
  const [criteriaSearch, setCriteriaSearch] = useState('')

  // Define all available criteria based on the provided list
  const allCriteria: FilterCriteria[] = [
    { value: 'authorization_status', label: 'Authorization Status', type: 'select', options: ['Authorized', 'Pending', 'Denied', 'Not Required', 'Expired'] },
    { value: 'bill_type', label: 'Bill Type', type: 'multiselect', options: ['Professional', 'Institutional', 'UB04', 'HCFA', 'Emergency', 'Routine'] },
    { value: 'billing_status', label: 'Billing Status', type: 'multiselect', options: ['Ready to Bill', 'Unbilled', 'No Claims Generated', 'Billed', 'Denied', 'Authorized', 'Unauthorized', 'In Review', 'Claim Generated', 'Claim Submitted', 'Claim Accepted', 'Paid', 'Partially Paid'] },
    { value: 'billing_units', label: 'Billing Units', type: 'range', options: [] },
    { value: 'charge_coded', label: 'Charge Coded', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'claim_type', label: 'Claim Type', type: 'select', options: ['Primary', 'Secondary', 'Electronic', 'Paper'] },
    { value: 'current_insurance', label: 'Current Billed Insurance', type: 'multiselect', options: ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'UnitedHealth', 'Cigna', 'Humana', 'Anthem', 'EAP', 'Tricare', 'Self Pay', 'Other'] },
    { value: 'date_of_billing', label: 'Date of Billing', type: 'date', options: [] },
    { value: 'date_of_discharge', label: 'Date of Discharge', type: 'date', options: [] },
    { value: 'date_of_entry', label: 'Date of Entry', type: 'date', options: [] },
    { value: 'date_of_service', label: 'Date of Service', type: 'date', options: [] },
    { value: 'encounter', label: 'Encounter', type: 'text', options: [] },
    { value: 'encounter_complete_status', label: 'Encounter Complete Status', type: 'select', options: ['Complete', 'Incomplete', 'Pending'] },
    { value: 'encounter_reprocessed_date', label: 'Encounter Reprocessed Date', type: 'date', options: [] },
    { value: 'encounter_reprocessed_status', label: 'Encounter Reprocessed Status', type: 'select', options: ['Reprocessed', 'Not Reprocessed', 'Pending'] },
    { value: 'encounter_service_code_count', label: 'Encounter Service Code Count', type: 'range', options: [] },
    { value: 'encounter_status', label: 'Encounter Status', type: 'select', options: ['Open', 'Closed', 'Pending', 'In Progress'] },
    { value: 'exclude_zero_balance', label: 'Exclude Encounters With Zero Balance', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'program_name', label: 'Program Name', type: 'multiselect', options: ['Outpatient Mental Health', 'Inpatient Psychiatry', 'Emergency', 'Intensive Outpatient', 'Partial Hospitalization', 'Crisis Center'] },
    { value: 'funding_source', label: 'Funding Source', type: 'multiselect', options: ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'UnitedHealth', 'Cigna', 'Self Pay', 'Government', 'Corporate', 'Other'] },
    { value: 'funding_source_type', label: 'Funding Source Type', type: 'select', options: ['Commercial', 'Medicare', 'Medicaid', 'Self Pay', 'Workers Comp', 'Other'] },
    { value: 'hl7_partner', label: 'HL7 Partner', type: 'select', options: ['Partner A', 'Partner B', 'Partner C', 'None'] },
    { value: 'last_level_billed', label: 'Last Level Billed', type: 'select', options: ['Primary', 'Secondary', 'Tertiary', 'Patient'] },
    { value: 'last_level_closed', label: 'Last Level Closed', type: 'select', options: ['Primary', 'Secondary', 'Tertiary', 'Patient'] },
    { value: 'location', label: 'Location', type: 'multiselect', options: ['Main Campus', 'Satellite Clinic A', 'Satellite Clinic B', 'Telehealth', 'Home Visit'] },
    { value: 'marked_for_rebill', label: 'Marked For Rebill', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'marked_as_cleared', label: 'Marked as Cleared', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'modifiers', label: 'Modifiers', type: 'multiselect', options: ['25', '26', '59', 'GT', '95', 'Other'] },
    { value: 'prp_billing', label: 'PRP Billing', type: 'select', options: ['Current Month', 'Previous Month', 'Custom'] },
    { value: 'payment_id', label: 'Payment Id', type: 'text', options: [] },
    { value: 'person_first_name', label: 'Person First Name', type: 'text', options: [] },
    { value: 'person_id', label: 'Person Id', type: 'text', options: [] },
    { value: 'person_last_name', label: 'Person Last Name', type: 'text', options: [] },
    { value: 'person_name', label: 'Person Name', type: 'text', options: [] },
    { value: 'place_of_service', label: 'Place Of Service', type: 'select', options: ['Office', 'Home', 'Hospital', 'Telehealth', 'Other'] },
    { value: 'post_primary_billing_rules', label: 'Post Primary Billing Rules Applied', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'provider', label: 'Provider', type: 'multiselect', options: ['Psychiatrist', 'Therapist', 'Social Worker', 'Counselor', 'Psychologist', 'Nurse Practitioner'] },
    { value: 'service_code', label: 'Service Code', type: 'text', options: [] },
    { value: 'whether_insured', label: 'Whether Insured', type: 'toggle', options: ['Yes', 'No'] },
    { value: 'x12_partner_any', label: 'X12 Partner - Any payer level', type: 'select', options: ['Partner A', 'Partner B', 'Partner C', 'None'] },
    { value: 'x12_partner_current', label: 'X12 Partner - Current payer level only', type: 'select', options: ['Partner A', 'Partner B', 'Partner C', 'None'] }
  ]

  // Filter criteria based on search
  const filteredCriteria = useMemo(() => {
    if (!criteriaSearch) return allCriteria
    return allCriteria.filter(criteria => 
      criteria.label.toLowerCase().includes(criteriaSearch.toLowerCase())
    )
  }, [criteriaSearch, allCriteria])

  // Get selected criteria details
  const selectedCriteriaDetails = useMemo(() => {
    return allCriteria.find(c => c.value === selectedCriteria)
  }, [selectedCriteria, allCriteria])

  // Handle date range changes
  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    })
  }

  // Handle multi-select filter changes
  const handleMultiSelectChange = <T extends string>(
    field: keyof BillingQueueFilters,
    value: T,
    currentValues: T[]
  ) => {
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    onFiltersChange({
      ...filters,
      [field]: updatedValues
    })
  }

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.payers.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.billTypes.length > 0) count++
    if (filters.errorTypes.length > 0) count++
    if (filters.hasErrors !== null) count++
    return count
  }

  // Render options based on selected criteria type
  const renderCriteriaOptions = () => {
    if (!selectedCriteriaDetails) return null

    switch (selectedCriteriaDetails.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Select Option</h4>
            <Select>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder={`Choose ${selectedCriteriaDetails.label.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {selectedCriteriaDetails.options?.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Select Options (Multiple)</h4>
            <div className="flex flex-wrap gap-1">
              {selectedCriteriaDetails.options?.map((option) => (
                <Badge
                  key={option}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/90 text-xs"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Date Range</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Value Range</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                <Input
                  type="number"
                  placeholder="0"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                <Input
                  type="number"
                  placeholder="1000"
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        )

      case 'toggle':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Choose Option</h4>
            <div className="flex gap-2">
              {selectedCriteriaDetails.options?.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Enter Value</h4>
            <Input
              type="text"
              placeholder={`Enter ${selectedCriteriaDetails.label.toLowerCase()}...`}
              className="text-xs h-8"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2 text-gray-500"
        >
          <XMarkIcon className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      <div className="text-xs text-gray-600">
        {encounterCount} encounter{encounterCount !== 1 ? 's' : ''} match current filters
      </div>

      {/* Criteria Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700">Choose Criteria</h4>
        
        {/* Searchable Criteria Dropdown */}
        <div className="space-y-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search criteria (e.g., billing status, authorization)..."
              value={criteriaSearch}
              onChange={(e) => setCriteriaSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs h-8"
            />
          </div>
          
          {/* Criteria List */}
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
            {filteredCriteria.length > 0 ? (
              filteredCriteria.map((criteria) => (
                <button
                  key={criteria.value}
                  onClick={() => {
                    setSelectedCriteria(criteria.value)
                    setCriteriaSearch('')
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedCriteria === criteria.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{criteria.label}</div>
                  <div className="text-xs text-gray-500 capitalize">{criteria.type.replace('_', ' ')} filter</div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-gray-500 text-center">
                No criteria found matching your search
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Criteria Options */}
      {renderCriteriaOptions()}
    </div>
  )
}

export default BillingFiltersPanel
