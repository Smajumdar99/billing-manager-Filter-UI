import { FC, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/Button/button'
import { 
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip'
import { Icon } from '@/components/atoms/Icon/Icon'
import { BillingEncounter, BillingStatus } from '@/types/billing-manager'
import { InsuranceLevelIndicator } from '@/components/atoms/InsuranceLevelIndicator'
import { BillingOverrideToggle } from '@/components/atoms/BillingOverrideToggle'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faFileInvoiceDollar, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BanknotesIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'

export interface BillingQueueTableProps {
  encounters: BillingEncounter[]
  onEncounterSelect: (encounterId: string, selected: boolean) => void
  onEncounterEdit: (encounter: BillingEncounter) => void
  onEncounterClick?: (encounter: BillingEncounter) => void
  onGenerateClaim: (encounter: BillingEncounter) => void
  onViewErrors: (encounter: BillingEncounter) => void
  onBillingOverrideToggle: (encounterId: string, enabled: boolean) => void
  onHcfaBillTypeChange: (encounterId: string, billType: string) => void
  onPrimaryPayerChange: (encounterId: string, primaryPayer: string) => void
  selectedEncounters: string[]
  className?: string
}

/**
 * BillingQueueTable Component
 * 
 * AG Grid-based table for displaying billing encounters in a queue format.
 * Supports bulk selection, error highlighting, and quick actions.
 * Designed for billing managers to efficiently process encounters.
 */
export const BillingQueueTable: FC<BillingQueueTableProps> = ({
  encounters,
  onEncounterSelect,
  onEncounterEdit,
  onEncounterClick,
  onGenerateClaim,
  onViewErrors,
  onBillingOverrideToggle,
  onHcfaBillTypeChange,
  onPrimaryPayerChange,
  selectedEncounters,
  className = ""
}) => {


  // AG Grid column definitions matching the design
  const columnDefs = useMemo(() => [
    {
      headerName: '',
      field: 'selected',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left' as const,
      cellRenderer: () => null, // Hide the cell content, show only checkbox
    },
    {
      headerName: '',
      field: 'statusIcons',
      width: 80,
      pinned: 'left' as const,
      cellRenderer: (params: any) => {
        const isBilled = params.data.status === 'paid' || 
                        params.data.status === 'claim_accepted' || 
                        params.data.status === 'claim_submitted' ||
                        params.data.status === 'claim_generated';
        
        return (
          <div className="flex items-center justify-center gap-2 py-2">
            {/* Golden Thread Rule Error Icon */}
            {params.data.hasErrors && params.data.errorSeverity === 'critical' && (
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <FontAwesomeIcon 
                        icon={faExclamationTriangle} 
                        className="w-4 h-4 text-red-600" 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="text-xs">
                      <p className="font-semibold mb-1">[Form Completion Rule]</p>
                      <p>Encounter forms do not meet the completion criteria: Responsibilities v06 09202, Member must sign receipt of privacy practices</p>
                    </div>
                  </TooltipContent>
                </TooltipRoot>
              </TooltipProvider>
            )}
            
            {/* Billed/Unbilled Status Icon */}
            <TooltipProvider>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={faFileInvoiceDollar} 
                      className={`w-4 h-4 ${isBilled ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isBilled ? 'Billed' : 'Unbilled'}</p>
                </TooltipContent>
              </TooltipRoot>
            </TooltipProvider>
            
            {/* Billing Override Icon */}
            {params.data.billingOverrideEnabled && (
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <FontAwesomeIcon 
                        icon={faShieldAlt} 
                        className="w-4 h-4 text-green-600" 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="text-xs">
                      <p className="font-semibold">Overridden by: Admin</p>
                      <p>Encounter ID: {params.data.id}</p>
                      <p>{new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                      <p className="mt-1">Assessment Only</p>
                    </div>
                  </TooltipContent>
                </TooltipRoot>
              </TooltipProvider>
            )}
          </div>
        );
      }
    },
    {
      headerName: 'Patient',
      field: 'patientName',
      minWidth: 220,
      pinned: 'left' as const,
      cellRenderer: (params: any) => {
        return (
          <div className="py-1">
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{params.data.patientName}</div>
              <div className="text-xs text-gray-500">
                {params.data.patientMrn}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      headerName: 'Insurance Levels',
      field: 'insuranceLevels',
      minWidth: 160,
      pinned: 'left' as const,
      cellStyle: () => ({ 
        overflow: 'visible',
        zIndex: 'auto',
        position: 'relative'
      }),
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center py-2 relative z-10">
          <InsuranceLevelIndicator 
            insuranceLevels={params.data.insuranceLevels || []}
          />
        </div>
      )
    },
    {
      headerName: 'To encounter',
      field: 'id',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="py-1">
          <button
            onClick={() => onEncounterClick?.(params.data)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer block"
          >
            {params.value}
          </button>
          <div className="text-xs text-gray-500 mt-0.5">
            {new Date(params.data.dateOfService).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })}
          </div>
        </div>
      )
    },
    {
      headerName: 'Treatment time',
      field: 'treatmentTime',
      minWidth: 150,
      cellRenderer: (params: any) => {
        // Generate treatment time based on encounter type
        const getTimeSlot = (encounterType: string) => {
          const timeSlots: Record<string, string> = {
            'Inpatient Surgery': '08:00 to 12:00 (240 m)',
            'Emergency Visit': '10:30 to 19:00 (30 m)',
            'Outpatient Consultation': '08:30 to 09:30 (60 m)',
            'Diagnostic Procedure': '10:00 to 14:00 (240 m)',
            'Surgery': '08:00 to 12:00 (240 m)',
            'Follow-up Visit': '10:00 to 14:00 (240 m)',
            'Laboratory Tests': '09:00 to 16:30 (90 m)',
            'Maternity Care': '00:00 to 23:59 (1440 m)',
            'Corporate Health Check': '09:00 to 16:30 (90 m)',
            'ICU Stay': '00:00 to 23:59 (1440 m)'
          }
          return timeSlots[encounterType] || '08:00 to 12:00 (240 m)'
        }
        
        return (
          <div className="text-sm text-gray-700">
            {getTimeSlot(params.data.encounterType)}
          </div>
        )
      }
    },
    {
      headerName: 'Encounter Status',
      field: 'encounterStatus',
      minWidth: 140,
      cellRenderer: (params: any) => {
        // Get encounter status from data or derive from billing status
        const getEncounterStatus = () => {
          if (params.data.encounterStatus) {
            return params.data.encounterStatus;
          }
          // Derive from billing status if not explicitly set
          const status = params.data.status;
          if (status === 'claim_rejected' || status === 'unauthorized') {
            return 'Closed on Error';
          }
          if (status === 'paid' || status === 'claim_accepted') {
            return 'Closed';
          }
          return 'Open';
        };
        
        const encounterStatus = getEncounterStatus();
        const statusColors = {
          'Open': 'text-blue-600',
          'Closed': 'text-green-600',
          'Closed on Error': 'text-red-600'
        };
        
        return (
          <span className={`text-xs font-medium ${statusColors[encounterStatus as keyof typeof statusColors] || 'text-gray-600'}`}>
            {encounterStatus}
          </span>
        )
      }
    },
    {
      headerName: 'Billing Status',
      field: 'billingStatus',
      minWidth: 180,
      cellRenderer: (params: any) => {
        // Get billing status from data or derive from status field
        const getBillingStatus = () => {
          if (params.data.billingStatus) {
            return params.data.billingStatus;
          }
          // Derive from existing status field
          const status = params.data.status;
          const statusMap: Record<string, string> = {
            'unauthorized': 'Unbilled',
            'ready_to_bill': 'No claims generated',
            'in_review': 'No claims generated',
            'claim_generated': 'Claims generated but not submitted',
            'claim_submitted': 'Claims generated but not submitted',
            'claim_accepted': 'Billed',
            'paid': 'Billed',
            'claim_rejected': 'Denied',
            'write_off': 'Denied'
          };
          return statusMap[status] || 'Unbilled';
        };
        
        const billingStatus = getBillingStatus();
        const statusColors: Record<string, string> = {
          'Unbilled': 'text-gray-600',
          'No claims generated': 'text-orange-600',
          'Claims generated but not submitted': 'text-blue-600',
          'Billed': 'text-green-600',
          'Denied': 'text-red-600'
        };
        
        return (
          <span className={`text-xs font-medium ${statusColors[billingStatus] || 'text-gray-600'}`}>
            {billingStatus}
          </span>
        )
      }
    },
    {
      headerName: 'Facility',
      field: 'facility',
      minWidth: 180,
      cellRenderer: (params: any) => {
        // Generate facility name based on department
        const getFacilityName = (department: string) => {
          const facilityMap: Record<string, string> = {
            'Cardiology': 'Community Health Center',
            'Emergency': 'CMHC Outpatient - 1.0',
            'Neurology': 'Community Health Center',
            'Radiology': 'CMHC Outpatient - 1.0',
            'Orthopedics': 'Community Health Center',
            'Internal Medicine': 'CMHC Outpatient - 1.0',
            'Pathology': 'Community Health Center',
            'Obstetrics': 'CMHC Outpatient - 1.0',
            'Preventive Medicine': 'Community Health Center',
            'Critical Care': 'CMHC Outpatient - 1.0'
          }
          return facilityMap[department] || 'Community Health Center'
        }
        
        return (
          <div>
            <div className="text-sm text-gray-700 mb-1">
              {getFacilityName(params.data.department)}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => console.log('Navigate to dems for', params.data.id)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                To dems
              </button>
              <button 
                onClick={() => console.log('Navigate to fee sheet for', params.data.id)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                To Fee Sheet
              </button>
            </div>
          </div>
        )
      }
    },
    {
      headerName: 'Rend',
      field: 'provider',
      minWidth: 120,
      cellRenderer: (params: any) => {
        const getProviderName = (provider: string) => {
          const nameMap: Record<string, string> = {
            'Dr. Menon': 'Menon',
            'Dr. Iyer': 'Iyer', 
            'Dr. Malhotra': 'Malhotra',
            'Dr. Nanda': 'Nanda',
            'Dr. Kapoor': 'Kapoor',
            'Dr. Khanna': 'Khanna'
          }
          return nameMap[provider] || provider.replace('Dr. ', '')
        }
        
        return (
          <div className="text-sm text-gray-700">
            {getProviderName(params.value)}
          </div>
        )
      }
    },
    {
      headerName: 'POS',
      field: 'primaryPayer',
      minWidth: 160,
      cellStyle: () => ({ 
        overflow: 'visible',
        zIndex: 1
      }),
      cellRenderer: (params: any) => {
        // POS (Place of Service) options
        const posOptions = [
          { value: '01', label: '1: Pharmacy' },
          { value: '02', label: '2: Telehealth' },
          { value: '03', label: '03: School' },
          { value: '06', label: '6: Indian Health Service Provider-based Facility' },
          { value: '07', label: '7: Tribal 638 Free-standing Facility' },
          { value: '08', label: '8: Tribal 638 Provider-based Facility' },
          { value: '09', label: '9: Prison/Correctional Facility' },
          { value: '10', label: '10: Telehealth' },
          { value: '11', label: '11: Office' },
          { value: '12', label: '12: Home' },
          { value: '13', label: '13: Assisted Living Facility' },
          { value: '14', label: '14: Group Home' },
          { value: '15', label: '15: Mobile Unit' },
          { value: '16', label: '16: Temporary Lodging' },
          { value: '17', label: '17: Walk-in Retail Health Clinic' },
          { value: '18', label: '18: Place of Employment-Worksite' },
          { value: '19', label: '19: Off Campus-Outpatient Hospital' },
          { value: '22', label: '22: On Campus-Outpatient Hospital' },
          { value: '32', label: '32: Nursing Facility' },
          { value: '49', label: '49: Independent Clinic' },
          { value: '52', label: '52: Psychiatric Facility-Partial Hospitalization' },
          { value: '53', label: '53: Community Mental Health Center' },
          { value: '54', label: '54: Intermediate Care Facility/Individuals with Intell' },
          { value: '55', label: '55: Residential Substance Abuse Treatment Facility' },
          { value: '57', label: '57: Non-residential Substance Abuse Treatment Facility' },
          { value: '60', label: '60: Mass Immunization Center' },
          { value: '61', label: '61: Comprehensive Inpatient Rehabilitation Facility' },
          { value: '71', label: '71: Public Health Clinic' },
          { value: '99', label: '99: Community' }
        ]
        
        // Get current value or default to School (03)
        const getCurrentValue = () => {
          return params.data.posCode || '03'
        }
        
        return (
          <div className="w-full">
            <Select
              value={getCurrentValue()}
              onValueChange={(value) => onPrimaryPayerChange(params.data.id, value)}
            >
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-amber-500">
                <SelectValue placeholder="Select POS" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[300px]">
                {posOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-xs"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
    },
    {
      headerName: '$ amount',
      field: 'totalCharges',
      minWidth: 100,
      cellStyle: { textAlign: 'right' },
      headerClass: 'ag-header-cell-right',
      cellRenderer: (params: any) => {
        const formatAmount = (amount: number) => {
          if (amount >= 1000) {
            return `${(amount / 1000).toLocaleString()},000 (1 unit)`
          }
          return `${amount.toLocaleString()} (1 unit)`
        }
        
        return (
          <div className="text-right text-sm text-gray-700">
            {formatAmount(params.value)}
          </div>
        )
      }
    },
    {
      headerName: 'Provided by',
      field: 'providedBy',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700">
          {params.data.assignedTo || 'Annie Admin'}
        </div>
      )
    },
    {
      headerName: 'When',
      field: 'lastModified',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700">
          {new Date(params.value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })}
        </div>
      )
    },
    {
      headerName: '',
      field: 'actions',
      width: 60,
      pinned: 'right' as const,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Icon icon="ellipsis" className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Add & Justify */}
              <DropdownMenuItem onClick={() => console.log('Add & Justify:', params.data.id)}>
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Add & Justify
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Primary Bulk Actions */}
              <DropdownMenuItem 
                onClick={() => onGenerateClaim(params.data)}
                disabled={!params.data.canGenerateClaim}
              >
                <BanknotesIcon className="w-4 h-4 mr-2" />
                Generate Claims
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => console.log('Submit Claims:', params.data.id)}
                disabled={!params.data.canSubmitClaim}
              >
                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                Submit Claims
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => console.log('Override Blocks:', params.data.id)}
                disabled={!params.data.canOverride || !params.data.hasErrors}
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Override Blocks
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => console.log('Mark Ready:', params.data.id)}>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Mark Ready
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Secondary Actions */}
              <DropdownMenuItem onClick={() => console.log('Export:', params.data.id)}>
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ], [onEncounterEdit])

  // Handle row selection
  const handleSelectionChanged = useCallback((event: any) => {
    const selectedNodes = event.api.getSelectedNodes()
    const selectedIds = selectedNodes.map((node: any) => node.data.id)
    
    // Update selection for each encounter
    encounters.forEach(encounter => {
      const isSelected = selectedIds.includes(encounter.id)
      const wasSelected = selectedEncounters.includes(encounter.id)
      
      if (isSelected !== wasSelected) {
        onEncounterSelect(encounter.id, isSelected)
      }
    })
  }, [encounters, selectedEncounters, onEncounterSelect])

  // Grid options configuration
  const gridOptions = useMemo(() => ({
    suppressCellFocus: true,
    animateRows: true,
    pagination: true,
    paginationPageSize: 50,
    domLayout: 'normal' as const,
    rowHeight: 60,
    headerHeight: 44,
    rowSelection: 'multiple' as const,
    suppressRowClickSelection: true,
    onSelectionChanged: handleSelectionChanged,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      cellStyle: {
        borderRight: '1px solid #f3f4f6'
      }
    },
    // Clean rows without any colored borders
    getRowClass: () => {
      return ''
    }
  }), [handleSelectionChanged])

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <style>
        {`
          .ag-header-cell-right .ag-header-cell-label {
            justify-content: flex-end;
          }
        `}
      </style>
      <TooltipProvider>
        <DataTable
          rowData={encounters}
          columnDefs={columnDefs}
          className="w-full h-full"
          gridOptions={gridOptions}
        />
      </TooltipProvider>
    </div>
  )
}

export default BillingQueueTable
