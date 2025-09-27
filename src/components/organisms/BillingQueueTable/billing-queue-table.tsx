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
      headerName: 'Patient',
      field: 'patientName',
      minWidth: 220,
      pinned: 'left' as const,
      cellRenderer: (params: any) => {
        // Use a professional Unsplash photo for all patients
        const getUnsplashAvatar = () => {
          // Professional headshot from Unsplash - optimized for healthcare applications
          return `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face&auto=format&q=80`;
        };

        return (
          <div className="py-1 flex items-center gap-3">
            {/* Patient Avatar */}
            <img 
              src={getUnsplashAvatar()}
              alt={`${params.data.patientName} avatar`}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                // Fallback to a neutral gray avatar if Unsplash fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium border border-gray-200 hidden">
              <Icon icon="user" className="w-4 h-4" />
            </div>
            
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{params.data.patientName}</div>
              <div className="text-xs text-gray-500">
                {params.data.patientMrn}
              </div>
              {/* Golden Thread Rule indicator */}
              {params.data.hasErrors && params.data.errorSeverity === 'critical' && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="exclamation-triangle" className="w-3 h-3" />
                  <span className="text-xs text-red-600">Golden Thread Rule</span>
                </div>
              )}
              {/* Billing Override indicator */}
              {params.data.canOverride && (
                <div className="text-xs text-orange-600 mt-1">Billing Override</div>
              )}
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
      headerName: 'Status',
      field: 'status',
      minWidth: 140,
      cellRenderer: (params: any) => {
        const getStatusDisplay = (status: BillingStatus) => {
          const statusMap = {
            ready_to_bill: { text: 'Pending for submission', className: 'text-orange-600' },
            authorized: { text: 'Authorized', className: 'text-blue-600' },
            unauthorized: { text: 'Unbilled Service', className: 'text-red-600' },
            in_review: { text: 'In Review', className: 'text-yellow-600' },
            claim_generated: { text: 'Claim Generated', className: 'text-indigo-600' },
            claim_submitted: { text: 'Claim Submitted', className: 'text-purple-600' },
            claim_accepted: { text: 'Claim Accepted', className: 'text-emerald-600' },
            claim_rejected: { text: 'Claim Rejected', className: 'text-red-600' },
            paid: { text: 'Paid', className: 'text-green-600' },
            write_off: { text: 'Write-off', className: 'text-gray-600' },
            patient_balance: { text: 'Patient Balance', className: 'text-orange-600' }
          }
          return statusMap[status] || { text: status, className: 'text-gray-600' }
        }
        
        const statusInfo = getStatusDisplay(params.value)
        return (
          <span className={`text-xs font-medium ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        )
      }
    },
    {
      headerName: 'Billing Override',
      field: 'billingOverrideEnabled',
      minWidth: 100,
      cellStyle: () => ({ 
        overflow: 'visible',
        zIndex: 1
      }),
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center py-2 relative">
          <BillingOverrideToggle
            enabled={params.data.billingOverrideEnabled || false}
            canOverride={params.data.canOverride || false}
            encounterHasErrors={params.data.hasErrors || false}
            onToggle={(enabled) => onBillingOverrideToggle(params.data.id, enabled)}
          />
        </div>
      )
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
      headerName: 'HCFA bill',
      field: 'hcfaBillType',
      minWidth: 160,
      cellStyle: () => ({ 
        overflow: 'visible',
        zIndex: 1
      }),
      cellRenderer: (params: any) => {
        // HCFA bill type options
        const billTypeOptions = [
          { value: 'POS: 02 telehealth', label: 'POS: 02 telehealth' },
          { value: 'POS: 11 office', label: 'POS: 11 office' },
          { value: 'POS: 21 inpatient', label: 'POS: 21 inpatient' },
          { value: 'POS: 22 outpatient', label: 'POS: 22 outpatient' },
          { value: 'POS: 23 emergency', label: 'POS: 23 emergency' },
          { value: 'UB-04 institutional', label: 'UB-04 institutional' },
          { value: 'CMS-1500 professional', label: 'CMS-1500 professional' }
        ]
        
        // Get current value or default
        const getCurrentValue = () => {
          return params.data.hcfaBillType || 'POS: 02 telehealth'
        }
        
        return (
          <div className="w-full">
            <Select
              value={getCurrentValue()}
              onValueChange={(value) => onHcfaBillTypeChange(params.data.id, value)}
            >
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-amber-500">
                <SelectValue placeholder="Select bill type" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {billTypeOptions.map((option) => (
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
      headerName: 'Primary',
      field: 'primaryPayer',
      minWidth: 160,
      cellStyle: () => ({ 
        overflow: 'visible',
        zIndex: 1
      }),
      cellRenderer: (params: any) => {
        // Primary payer options
        const primaryPayerOptions = [
          { value: 'Pacific Sources', label: 'Pacific Sources' },
          { value: 'Bluecross', label: 'Bluecross' },
          { value: 'Medicare', label: 'Medicare' },
          { value: 'Medicaid', label: 'Medicaid' },
          { value: 'United Healthcare', label: 'United Healthcare' },
          { value: 'Aetna', label: 'Aetna' },
          { value: 'Cigna', label: 'Cigna' },
          { value: 'Humana', label: 'Humana' },
          { value: 'BCBS', label: 'Blue Cross Blue Shield' },
          { value: 'Self Pay', label: 'Self Pay' },
          { value: 'Government', label: 'Government' },
          { value: 'Corporate', label: 'Corporate' }
        ]
        
        // Get current value or default to Pacific Sources
        const getCurrentValue = () => {
          const payerMap: Record<string, string> = {
            'Medicare': 'Bluecross',
            'Medicaid': 'Pacific Sources',
            'Blue Cross Blue Shield': 'BCBS',
            'HDFC ERGO': 'Pacific Sources',
            'Bajaj Allianz': 'Pacific Sources',
            'United India': 'Pacific Sources',
            'Self Pay': 'Self Pay',
            'Government': 'Government',
            'Corporate': 'Corporate',
            'Aetna': 'Aetna'
          }
          return payerMap[params.value] || 'Pacific Sources'
        }
        
        return (
          <div className="w-full">
            <Select
              value={getCurrentValue()}
              onValueChange={(value) => onPrimaryPayerChange(params.data.id, value)}
            >
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-amber-500">
                <SelectValue placeholder="Select primary payer" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {primaryPayerOptions.map((option) => (
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
      headerName: 'CPT#',
      field: 'cptCode',
      minWidth: 100,
      cellRenderer: (params: any) => {
        // Generate CPT codes based on encounter type
        const getCPTCode = (encounterType: string) => {
          const cptMap: Record<string, string> = {
            'Inpatient Surgery': '90834 (J45.20)',
            'Emergency Visit': '90834 (J45.20)',
            'Outpatient Consultation': '90834 (J45.20)',
            'Diagnostic Procedure': '90834 (J45.20)',
            'Surgery': '90834 (J45.20)',
            'Follow-up Visit': '90834 (J45.20)',
            'Laboratory Tests': '90834 (J45.20)',
            'Maternity Care': '90834 (J45.20)',
            'Corporate Health Check': '90834 (J45.20)',
            'ICU Stay': '90834 (J45.20)'
          }
          return cptMap[encounterType] || '90834 (J45.20)'
        }
        
        return (
          <div className="text-sm text-gray-700">
            {getCPTCode(params.data.encounterType)}
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
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEncounterEdit(params.data)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Icon icon="ellipsis" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More actions</p>
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
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
