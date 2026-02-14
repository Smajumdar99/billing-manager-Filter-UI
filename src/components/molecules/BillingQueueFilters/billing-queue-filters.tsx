import { FC, useState, useMemo, useRef, useEffect } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group'
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { BillingQueueFilters } from '@/types/billing-manager'

// Sort option interface
export interface SortOption {
  field: string
  label: string
  direction: 'asc' | 'desc'
}

export interface BillingQueueFiltersProps {
  filters: BillingQueueFilters
  onFiltersChange: (filters: BillingQueueFilters) => void
  onClearFilters: () => void
  encounterCount: number
  currentSort?: SortOption
  onSortChange?: (sort: SortOption | undefined) => void
  className?: string
}

// Define criteria types
interface FilterCriteria {
  value: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'range' | 'toggle' | 'text' | 'service_code_typeahead'
  options?: string[]
}

// Service code types
type ServiceCodeType = 'CPT4' | 'HCPCS' | 'ICD10-PCS' | 'Rev'

// Service code interface
interface ServiceCode {
  code: string
  type: ServiceCodeType
  modifier?: string
  description: string
  shortDescription: string
}

// Mock service codes data (replace with API call in production)
const mockServiceCodes: ServiceCode[] = [
  // CPT4 Codes
  { code: '90791', type: 'CPT4', modifier: '', description: 'Psychiatric diagnostic evaluation', shortDescription: 'Psych eval' },
  { code: '90792', type: 'CPT4', modifier: '', description: 'Psychiatric diagnostic evaluation with medical services', shortDescription: 'Psych eval w/med' },
  { code: '90832', type: 'CPT4', modifier: '', description: 'Psychotherapy, 30 minutes with patient', shortDescription: 'Psychotherapy 30min' },
  { code: '90834', type: 'CPT4', modifier: '', description: 'Psychotherapy, 45 minutes with patient', shortDescription: 'Psychotherapy 45min' },
  { code: '90837', type: 'CPT4', modifier: '', description: 'Psychotherapy, 60 minutes with patient', shortDescription: 'Psychotherapy 60min' },
  { code: '90846', type: 'CPT4', modifier: '', description: 'Family psychotherapy without patient present', shortDescription: 'Family therapy' },
  { code: '90847', type: 'CPT4', modifier: '', description: 'Family psychotherapy with patient present', shortDescription: 'Family therapy w/pt' },
  { code: '90853', type: 'CPT4', modifier: '', description: 'Group psychotherapy', shortDescription: 'Group therapy' },
  { code: '96372', type: 'CPT4', modifier: '', description: 'Therapeutic, prophylactic, or diagnostic injection', shortDescription: 'Injection' },
  { code: '99213', type: 'CPT4', modifier: '', description: 'Office or other outpatient visit, established patient, 20-29 minutes', shortDescription: 'Office visit 20-29min' },
  { code: '99214', type: 'CPT4', modifier: '', description: 'Office or other outpatient visit, established patient, 30-39 minutes', shortDescription: 'Office visit 30-39min' },
  
  // HCPCS Codes
  { code: 'H0001', type: 'HCPCS', modifier: '', description: 'Alcohol and/or drug assessment', shortDescription: 'Substance assessment' },
  { code: 'H0004', type: 'HCPCS', modifier: '', description: 'Behavioral health counseling and therapy, per 15 minutes', shortDescription: 'Behavioral counseling' },
  { code: 'H0005', type: 'HCPCS', modifier: '', description: 'Alcohol and/or drug services; group counseling by a clinician', shortDescription: 'Substance group' },
  { code: 'H0031', type: 'HCPCS', modifier: '', description: 'Mental health assessment, by non-physician', shortDescription: 'MH assessment' },
  { code: 'H0032', type: 'HCPCS', modifier: '', description: 'Mental health service plan development by non-physician', shortDescription: 'MH plan dev' },
  { code: 'H2011', type: 'HCPCS', modifier: '', description: 'Crisis intervention service, per 15 minutes', shortDescription: 'Crisis intervention' },
  { code: 'H2014', type: 'HCPCS', modifier: '', description: 'Skills training and development, per 15 minutes', shortDescription: 'Skills training' },
  { code: 'H2019', type: 'HCPCS', modifier: '', description: 'Therapeutic behavioral services, per 15 minutes', shortDescription: 'Behavioral services' },
  { code: 'S9480', type: 'HCPCS', modifier: '', description: 'Intensive outpatient psychiatric services, per diem', shortDescription: 'IOP per diem' },
  
  // ICD10-PCS Codes
  { code: 'GZ30ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Psychological Tests, None', shortDescription: 'Psych testing' },
  { code: 'GZ31ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Crisis Intervention, None', shortDescription: 'Crisis interv' },
  { code: 'GZ32ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Medication Management, None', shortDescription: 'Med mgmt' },
  { code: 'GZ33ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Individual Psychotherapy, None', shortDescription: 'Individual therapy' },
  { code: 'GZ34ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Counseling, None', shortDescription: 'Counseling' },
  { code: 'GZ35ZZZ', type: 'ICD10-PCS', modifier: '', description: 'Mental Health Services, Family Psychotherapy, None', shortDescription: 'Family therapy' },
  
  // Rev Codes
  { code: '0100', type: 'Rev', modifier: '', description: 'All-inclusive rate', shortDescription: 'All-inclusive' },
  { code: '0101', type: 'Rev', modifier: '', description: 'Room and board - private (one bed)', shortDescription: 'Private room' },
  { code: '0110', type: 'Rev', modifier: '', description: 'Room and board - general classification', shortDescription: 'General room' },
  { code: '0114', type: 'Rev', modifier: '', description: 'Room and board - semi-private (two beds)', shortDescription: 'Semi-private' },
  { code: '0124', type: 'Rev', modifier: '', description: 'Room and board - psychiatric - private', shortDescription: 'Psych private' },
  { code: '0134', type: 'Rev', modifier: '', description: 'Room and board - psychiatric - semi-private', shortDescription: 'Psych semi-private' },
  { code: '0144', type: 'Rev', modifier: '', description: 'Room and board - psychiatric - ward', shortDescription: 'Psych ward' },
  { code: '0154', type: 'Rev', modifier: '', description: 'Room and board - psychiatric - other', shortDescription: 'Psych other' },
  { code: '0250', type: 'Rev', modifier: '', description: 'Pharmacy - general classification', shortDescription: 'Pharmacy' },
  { code: '0260', type: 'Rev', modifier: '', description: 'IV therapy - general classification', shortDescription: 'IV therapy' },
  { code: '0450', type: 'Rev', modifier: '', description: 'Emergency room - general classification', shortDescription: 'ER' },
  { code: '0900', type: 'Rev', modifier: '', description: 'Behavioral health treatment/services - general', shortDescription: 'BH services' },
  { code: '0911', type: 'Rev', modifier: '', description: 'Behavioral health treatment - electroshock treatment', shortDescription: 'ECT' },
  { code: '0914', type: 'Rev', modifier: '', description: 'Behavioral health treatment - activity therapy', shortDescription: 'Activity therapy' },
  { code: '0915', type: 'Rev', modifier: '', description: 'Behavioral health treatment - intensive outpatient services - psychiatric', shortDescription: 'IOP psych' },
  { code: '0916', type: 'Rev', modifier: '', description: 'Behavioral health treatment - intensive outpatient services - chemical dependency', shortDescription: 'IOP chem dep' },
  { code: '0917', type: 'Rev', modifier: '', description: 'Behavioral health treatment - community behavioral health program (day treatment)', shortDescription: 'Day treatment' },
]

/**
 * BillingFiltersPanel Component
 * 
 * Advanced filtering interface with criteria dropdown approach.
 * Users select a criteria type, then choose from relevant options below.
 * Reduces cognitive load and makes advanced filters more discoverable.
 */
// Applied filter interface
interface AppliedFilter {
  criteriaValue: string
  criteriaLabel: string
  criteriaType: string
  selectedValues: any[]
}

export const BillingFiltersPanel: FC<BillingQueueFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  encounterCount,
  currentSort,
  onSortChange,
  className = ""
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string>('')
  const [criteriaSearch, setCriteriaSearch] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([])
  
  // Service code typeahead state
  const [serviceCodeSearch, setServiceCodeSearch] = useState('')
  const [selectedServiceCodeType, setSelectedServiceCodeType] = useState<ServiceCodeType | 'All'>('All')
  const [showServiceCodeDropdown, setShowServiceCodeDropdown] = useState(false)
  const [selectedServiceCodes, setSelectedServiceCodes] = useState<ServiceCode[]>([])
  const serviceCodeDropdownRef = useRef<HTMLDivElement>(null)
  
  // Sort state
  const [selectedSortField, setSelectedSortField] = useState<string>(currentSort?.field || '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(currentSort?.direction || 'desc')
  
  // Collapse state
  const [isSortExpanded, setIsSortExpanded] = useState(true)
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceCodeDropdownRef.current && !serviceCodeDropdownRef.current.contains(event.target as Node)) {
        setShowServiceCodeDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Available sort fields
  const sortFields = [
    { value: 'dateOfService', label: 'Encounter Date' },
    { value: 'id', label: 'Encounter Id' },
    { value: 'patientName', label: 'Person Last Name' },
    { value: 'patientFirstName', label: 'Person First Name' }
  ]

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
    { value: 'post_primary_billing_rules', label: 'Post Primary Billing Rules Applied', type: 'multiselect', options: ['Primary Insurance', 'Secondary Insurance', 'Tertiary Insurance'] },
    { value: 'provider', label: 'Provider', type: 'multiselect', options: ['Psychiatrist', 'Therapist', 'Social Worker', 'Counselor', 'Psychologist', 'Nurse Practitioner'] },
    { value: 'service_code', label: 'Service Code', type: 'service_code_typeahead', options: [] },
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
  
  // Filter service codes based on search and type
  const filteredServiceCodes = useMemo(() => {
    if (!serviceCodeSearch) return []
    
    let filtered = mockServiceCodes
    
    // Filter by type if not 'All'
    if (selectedServiceCodeType !== 'All') {
      filtered = filtered.filter(code => code.type === selectedServiceCodeType)
    }
    
    // Filter by search term (code, description, or short description)
    filtered = filtered.filter(code => 
      code.code.toLowerCase().includes(serviceCodeSearch.toLowerCase()) ||
      code.description.toLowerCase().includes(serviceCodeSearch.toLowerCase()) ||
      code.shortDescription.toLowerCase().includes(serviceCodeSearch.toLowerCase())
    )
    
    // Limit to 10 results
    return filtered.slice(0, 10)
  }, [serviceCodeSearch, selectedServiceCodeType])
  
  // Handle service code selection
  const handleServiceCodeSelect = (code: ServiceCode) => {
    // Check if already selected
    const isAlreadySelected = selectedServiceCodes.some(sc => sc.code === code.code && sc.type === code.type)
    if (!isAlreadySelected) {
      setSelectedServiceCodes([...selectedServiceCodes, code])
    }
    setServiceCodeSearch('')
    setShowServiceCodeDropdown(false)
  }
  
  // Remove selected service code
  const handleRemoveServiceCode = (code: ServiceCode) => {
    setSelectedServiceCodes(selectedServiceCodes.filter(sc => !(sc.code === code.code && sc.type === code.type)))
  }
  
  // Handle sort field selection - LOCAL STATE ONLY (no immediate apply)
  const handleSortFieldSelect = (field: string) => {
    setSelectedSortField(field)
    // Don't call onSortChange - wait for Apply button
  }
  
  // Handle sort direction change - LOCAL STATE ONLY (no immediate apply)
  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction)
    // Don't call onSortChange - wait for Apply button
  }
  
  // Clear sort - LOCAL STATE ONLY
  const handleClearSort = () => {
    setSelectedSortField('')
    setSortDirection('desc')
    // Don't call onSortChange - wait for Apply button
  }
  
  // Add filter to applied filters
  const handleAddFilter = (values: any[]) => {
    if (!selectedCriteria || values.length === 0) return
    
    const criteria = allCriteria.find(c => c.value === selectedCriteria)
    if (!criteria) return
    
    // Check if filter already exists
    const existingIndex = appliedFilters.findIndex(f => f.criteriaValue === selectedCriteria)
    
    if (existingIndex >= 0) {
      // Update existing filter
      const updated = [...appliedFilters]
      updated[existingIndex] = {
        criteriaValue: selectedCriteria,
        criteriaLabel: criteria.label,
        criteriaType: criteria.type,
        selectedValues: values
      }
      setAppliedFilters(updated)
    } else {
      // Add new filter
      setAppliedFilters([
        ...appliedFilters,
        {
          criteriaValue: selectedCriteria,
          criteriaLabel: criteria.label,
          criteriaType: criteria.type,
          selectedValues: values
        }
      ])
    }
    
    // Reset selection
    setSelectedCriteria('')
  }
  
  // Remove applied filter
  const handleRemoveFilter = (criteriaValue: string) => {
    setAppliedFilters(appliedFilters.filter(f => f.criteriaValue !== criteriaValue))
  }
  
  // Clear all filters
  const handleClearAllFilters = () => {
    setAppliedFilters([])
    setSelectedCriteria('')
    onClearFilters()
    handleClearSort()
  }
  
  // Apply all filters and sort - BATCH OPERATION
  const handleApplyFilters = () => {
    // Apply sort if selected
    if (selectedSortField && onSortChange) {
      const sortToApply: SortOption = {
        field: selectedSortField,
        label: sortFields.find(f => f.value === selectedSortField)?.label || selectedSortField,
        direction: sortDirection
      }
      onSortChange(sortToApply)
    } else if (onSortChange) {
      // Clear sort if nothing selected
      onSortChange(undefined)
    }
    
    // Apply filters
    // TODO: Convert appliedFilters array to BillingQueueFilters format
    // and call onFiltersChange(convertedFilters)
    
    console.log('Applied filters:', appliedFilters)
    console.log('Applied sort:', { selectedSortField, sortDirection })
  }

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
            <Select
              onValueChange={(value) => {
                // Find the option label from value
                const option = selectedCriteriaDetails.options?.find(
                  opt => opt.toLowerCase().replace(/\s+/g, '_') === value
                )
                if (option) {
                  handleAddFilter([option])
                }
              }}
            >
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
        // Get currently selected values for this criteria
        const currentFilter = appliedFilters.find(f => f.criteriaValue === selectedCriteria)
        const selectedValues = currentFilter?.selectedValues || []
        
        return (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Select Options (Multiple)</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedCriteriaDetails.options?.map((option) => {
                const isSelected = selectedValues.includes(option)
                return (
                  <Badge
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 text-xs"
                    onClick={() => {
                      const newValues = isSelected
                        ? selectedValues.filter(v => v !== option)
                        : [...selectedValues, option]
                      
                      if (newValues.length > 0) {
                        handleAddFilter(newValues)
                      } else {
                        // Remove filter if no values selected
                        handleRemoveFilter(selectedCriteria)
                      }
                    }}
                  >
                    {option}
                  </Badge>
                )
              })}
            </div>
            {selectedValues.length > 0 && (
              <div className="text-xs text-gray-600 mt-2">
                {selectedValues.length} selected
              </div>
            )}
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
      
      case 'service_code_typeahead':
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-700">Search Service Codes</h4>
            
            {/* Code Type Filter */}
            <div className="flex gap-1.5 flex-wrap">
              {(['All', 'CPT4', 'HCPCS', 'ICD10-PCS', 'Rev'] as const).map((type) => (
                <Button
                  key={type}
                  variant={selectedServiceCodeType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedServiceCodeType(type)}
                  className="text-xs h-7 px-3"
                >
                  {type}
                </Button>
              ))}
            </div>
            
            {/* Typeahead Search */}
            <div className="relative" ref={serviceCodeDropdownRef}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by code, description..."
                  value={serviceCodeSearch}
                  onChange={(e) => {
                    setServiceCodeSearch(e.target.value)
                    setShowServiceCodeDropdown(true)
                  }}
                  onFocus={() => setShowServiceCodeDropdown(true)}
                  className="text-xs h-8 pl-10"
                />
              </div>
              
              {/* Dropdown Results */}
              {showServiceCodeDropdown && serviceCodeSearch && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredServiceCodes.length > 0 ? (
                    <div className="py-1">
                      {filteredServiceCodes.map((code, index) => (
                        <button
                          key={`${code.type}-${code.code}-${index}`}
                          onClick={() => handleServiceCodeSelect(code)}
                          className="w-full text-left px-3 py-2.5 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-blue-700">{code.code}</span>
                                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                  {code.type}
                                </Badge>
                                {code.modifier && (
                                  <span className="text-xs text-gray-500">Mod: {code.modifier}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-900 font-medium mb-0.5">{code.shortDescription}</div>
                              <div className="text-xs text-gray-600 line-clamp-2">{code.description}</div>
                            </div>
                            <PlusIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-xs text-gray-500 text-center">
                      No service codes found matching your search
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Service Codes */}
            {selectedServiceCodes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-700">Selected Codes ({selectedServiceCodes.length})</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedServiceCodes.map((code, index) => (
                    <div
                      key={`${code.type}-${code.code}-${index}`}
                      className="flex items-start justify-between gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-blue-700">{code.code}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-white">
                            {code.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-700">{code.shortDescription}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveServiceCode(code)}
                        className="flex-shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Remove code"
                      >
                        <XMarkIcon className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sort Section */}
      <div className="space-y-2.5">
        <button
          onClick={() => setIsSortExpanded(!isSortExpanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <h4 className="text-sm font-semibold text-gray-900">Sort By</h4>
          {isSortExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          )}
        </button>
        
        {/* Sort Field Options - Shadcn Radio List */}
        {isSortExpanded && (
          <RadioGroup value={selectedSortField} onValueChange={handleSortFieldSelect}>
          {sortFields.map((field) => (
            <div key={field.value} className="flex items-center gap-2">
              <RadioGroupItem value={field.value} id={`sort-${field.value}`} />
              <label
                htmlFor={`sort-${field.value}`}
                className="text-sm text-gray-900 cursor-pointer"
              >
                {field.label}
              </label>
            </div>
          ))}
        </RadioGroup>
        
        )}
        
        {/* Sort Direction - Shadcn Radio List */}
        {isSortExpanded && (
          <RadioGroup value={sortDirection} onValueChange={handleSortDirectionChange} className="pt-1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="desc" id="sort-desc" />
            <label htmlFor="sort-desc" className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer">
              <ArrowDownIcon className="w-4 h-4 text-gray-700" />
              Newest First
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <RadioGroupItem value="asc" id="sort-asc" />
            <label htmlFor="sort-asc" className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer">
              <ArrowUpIcon className="w-4 h-4 text-gray-700" />
              Oldest First
            </label>
          </div>
        </RadioGroup>
        )}
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Filters Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center justify-between flex-1 text-left group mr-2"
          >
            <h4 className="text-sm font-semibold text-gray-900">Add Filters</h4>
            {isFiltersExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            )}
          </button>
          {(selectedSortField || appliedFilters.length > 0) && (
            <button
              onClick={() => {
                setAppliedFilters([])
                setSelectedCriteria('')
                setSelectedSortField('')
                setSortDirection('desc')
                onClearFilters()
              }}
              className="text-xs text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Search Criteria Input */}
        {isFiltersExpanded && (
          <>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search criteria..."
                value={criteriaSearch}
                onChange={(e) => setCriteriaSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
              />
            </div>
            
            {/* Criteria List - Shadcn Radio Buttons with Scrolling */}
            <div className="max-h-64 overflow-y-auto pr-1">
          {filteredCriteria.length > 0 ? (
            <RadioGroup value={selectedCriteria} onValueChange={setSelectedCriteria}>
              {filteredCriteria.map((criteria) => {
                const isAlreadyApplied = appliedFilters.some(f => f.criteriaValue === criteria.value)
                
                return (
                  <div
                    key={criteria.value}
                    className={`flex items-center gap-2 ${
                      isAlreadyApplied ? 'opacity-50' : ''
                    }`}
                  >
                    <RadioGroupItem
                      value={criteria.value}
                      id={`criteria-${criteria.value}`}
                      disabled={isAlreadyApplied}
                    />
                    <label
                      htmlFor={`criteria-${criteria.value}`}
                      className={`text-sm text-gray-900 flex-1 ${
                        isAlreadyApplied ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {criteria.label}
                    </label>
                    {isAlreadyApplied && (
                      <span className="text-xs text-gray-500">Applied</span>
                    )}
                  </div>
                )
              })}
            </RadioGroup>
          ) : (
            <div className="px-2 py-3 text-sm text-gray-500">
              No criteria found
            </div>
          )}
            </div>
            
            {/* Selected Criteria Label */}
            {selectedCriteria && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Configure: {allCriteria.find(c => c.value === selectedCriteria)?.label}
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Criteria Options */}
      {selectedCriteria && isFiltersExpanded && renderCriteriaOptions()}
      {/* Selected Criteria Summary - Above Apply Button */}
      {(selectedSortField || appliedFilters.length > 0) && (
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Selected Criteria</h4>
            <span className="text-xs text-gray-600">
              {(selectedSortField ? 1 : 0) + appliedFilters.length} selected
            </span>
          </div>
          
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {/* Sort Summary */}
            {selectedSortField && (
              <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-md text-xs border border-gray-200">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {sortDirection === 'asc' ? (
                    <ArrowUpIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ArrowDownIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className="font-medium text-gray-900">
                    Sort: {sortFields.find(f => f.value === selectedSortField)?.label}
                  </span>
                  <span className="text-gray-600">
                    ({sortDirection === 'asc' ? 'Oldest' : 'Newest'})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSortField('')
                    setSortDirection('desc')
                  }}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600 transition-colors ml-2"
                  title="Remove sort"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {/* Applied Filters Summary */}
            {appliedFilters.map((filter) => (
              <div
                key={filter.criteriaValue}
                className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-md text-xs border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900">{filter.criteriaLabel}: </span>
                  <span className="text-gray-600 truncate">
                    {Array.isArray(filter.selectedValues) 
                      ? filter.selectedValues.join(', ')
                      : String(filter.selectedValues)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFilter(filter.criteriaValue)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600 transition-colors ml-2"
                  title="Remove filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Spacer for sticky button */}
      <div className="h-16" />
      
      {/* Apply Filters Button - Sticky at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 pt-3 pb-3 mt-4">
        <Button
          onClick={handleApplyFilters}
          className="w-full"
          size="sm"
          disabled={appliedFilters.length === 0 && !selectedSortField}
        >
          {appliedFilters.length > 0 || selectedSortField
            ? `Apply ${appliedFilters.length > 0 ? `${appliedFilters.length} Filter${appliedFilters.length !== 1 ? 's' : ''}` : ''}${appliedFilters.length > 0 && selectedSortField ? ' & ' : ''}${selectedSortField ? 'Sort' : ''}`
            : 'Apply Search'}
        </Button>
      </div>
    </div>
  )
}

export default BillingFiltersPanel
