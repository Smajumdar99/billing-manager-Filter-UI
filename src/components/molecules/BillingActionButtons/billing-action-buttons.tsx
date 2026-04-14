import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import {
  X,
  FileText,
  Send,
  AlertTriangle,
  ShieldCheck,
  ShieldPlus,
  RefreshCw,
  MoreHorizontal,
  Settings,
  Users,
  CheckCircle,
  RotateCcw,
  XCircle,
  Play,
} from 'lucide-react'
import { BuildingLightFullIcon } from '@/assets/icons/BuildingLightFullIcon'
import { BillingEncounter } from '@/types/billing-manager'
import { GenerateClaimsDialog } from '@/components/molecules/GenerateClaimsDialog'
import { ClaimSubmissionDialog } from '@/components/molecules/ClaimSubmissionDialog'
import { SetBillTypeDialog } from '@/components/molecules/SetBillTypeDialog'
import { SetBillToDialog } from '@/components/molecules/SetBillToDialog'

const POS_OPTIONS = [
  { value: '11', label: '11 - Office' },
  { value: '12', label: '12 - Home' },
  { value: '21', label: '21 - Inpatient Hospital' },
  { value: '22', label: '22 - On Campus-Outpatient Hospital' },
  { value: '23', label: '23 - Emergency Room - Hospital' },
  { value: '24', label: '24 - Ambulatory Surgical Center' },
  { value: '31', label: '31 - Skilled Nursing Facility' },
  { value: '32', label: '32 - Nursing Facility' },
  { value: '41', label: '41 - Ambulance - Land' },
  { value: '42', label: '42 - Ambulance - Air or Water' },
  { value: '49', label: '49 - Independent Clinic' },
  { value: '50', label: '50 - Federally Qualified Health Center' },
  { value: '53', label: '53 - Community Mental Health Center' },
  { value: '65', label: '65 - End-Stage Renal Disease Treatment Facility' },
  { value: '71', label: '71 - Public Health Clinic' },
  { value: '72', label: '72 - Rural Health Clinic' },
  { value: '81', label: '81 - Independent Laboratory' },
  { value: '99', label: '99 - Other Place of Service' },
]

export interface BillingActionButtonsProps {
  selectedEncounters: BillingEncounter[]
  onAction: (action: string, encounterIds: string[]) => void
  className?: string
  // Select All props
  totalEncounters?: number
  onSelectAll?: () => void
}

/**
 * BillingActionButtons Component
 * 
 * Compact bulk actions dropdown that appears above the billing table.
 * Space-efficient dropdown menu with all major billing operations.
 */
export const BillingActionButtons: FC<BillingActionButtonsProps> = ({
  selectedEncounters,
  onAction,
  className = "",
  totalEncounters = 0,
  onSelectAll
}) => {
  const [showGenerateClaimsDialog, setShowGenerateClaimsDialog] = useState(false)
  const [showClaimSubmissionDialog, setShowClaimSubmissionDialog] = useState(false)
  const [showSetBillTypeDialog, setShowSetBillTypeDialog] = useState(false)
  const [showSetBillToDialog, setShowSetBillToDialog] = useState(false)
  const [isPosModalOpen, setIsPosModalOpen] = useState(false)
  const [posValue, setPosValue] = useState('11')
  const selectedCount = selectedEncounters.length
  const encounterIds = selectedEncounters.map(e => e.id)
  
  // Check if any encounters can generate claims
  const canGenerateClaims = selectedEncounters.some(e => 
    e.status === 'ready_to_bill' || e.status === 'authorized'
  )
  
  // Check if any encounters are billed
  const hasBilled = selectedEncounters.some(e => e.status === 'claim_generated' || e.status === 'claim_submitted')
  
  // Check if any encounters are marked for rebill
  const hasRebillMarked = selectedEncounters.some(e => e.markedForRebill)
  
  // Check if any encounters are blocked (have errors or need override)
  const hasBlockedEncounters = selectedEncounters.some(e => e.hasErrors || e.billingOverrideEnabled)

  const handleAction = (action: string) => {
    if (action === 'generate_claims') {
      setShowGenerateClaimsDialog(true)
    } else if (action === 'generate_and_submit_claims') {
      setShowClaimSubmissionDialog(true)
    } else if (action === 'set_bill_type') {
      setShowSetBillTypeDialog(true)
    } else if (action === 'set_bill_to') {
      setShowSetBillToDialog(true)
    } else {
      onAction(action, encounterIds)
    }
  }

  const handleClaimSubmission = (submissionDate: string) => {
    console.log('Submitting claims with date:', submissionDate)
    onAction('generate_and_submit_claims', encounterIds)
  }

  const handleSetBillType = (billType: 'hcfa' | 'ub04') => {
    console.log('Setting bill type:', billType)
    onAction('set_bill_type', encounterIds)
  }

  const handleSetBillTo = (billTo: 'person' | 'insurance') => {
    console.log('Setting bill-to:', billTo)
    onAction('set_bill_to', encounterIds)
  }

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4 ${className}`}>
      {/* Left Side - Select All and Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Select All Control */}
        {onSelectAll && totalEncounters > 0 && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={totalEncounters > 0 && selectedEncounters.length === totalEncounters}
                ref={(input) => {
                  if (input) {
                    const allSelected = totalEncounters > 0 && selectedEncounters.length === totalEncounters
                    const someSelected = selectedEncounters.length > 0 && !allSelected
                    input.indeterminate = someSelected
                  }
                }}
                onChange={onSelectAll}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                {selectedEncounters.length === totalEncounters
                  ? 'Deselect All'
                  : selectedEncounters.length > 0
                  ? `${selectedEncounters.length} selected`
                  : 'Select All'}
              </span>
            </div>
          </>
        )}
        
        {selectedCount > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction('clear_selection', [])}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
            
            {/* Vertical Separator */}
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            
            {/* Action Buttons - Responsive visibility */}
            {/* Always show: Generate Claims, Submit Claims */}
            <Button
              variant="outline"
              size="sm"
              disabled={!canGenerateClaims}
              onClick={() => handleAction('generate_claims')}
              className="text-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden xl:inline">Generate Claims</span>
              <span className="xl:hidden">Generate</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!canGenerateClaims}
              onClick={() => handleAction('generate_and_submit_claims')}
              className="text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden xl:inline">Generate & Submit Claims</span>
              <span className="xl:hidden">Submit</span>
            </Button>
            
            {/* Show on large screens and up */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('check_errors')}
              className="text-xs hidden lg:inline-flex"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden xl:inline">Check Errors</span>
              <span className="xl:hidden">Errors</span>
            </Button>
            
            {/* Show on extra large screens only */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('override_billing')}
              className="text-xs hidden xl:inline-flex"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Override
            </Button>
            
            {/* Show "Override and Generate Claim" only when blocked encounters are selected */}
            {hasBlockedEncounters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('override_and_generate')}
                className="text-xs hidden xl:inline-flex"
              >
                <ShieldPlus className="w-3.5 h-3.5 mr-1.5" />
                Override & Generate
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('mark_for_rebilling')}
              className="text-xs hidden xl:inline-flex"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Rebill
            </Button>
            
            {/* More Actions Dropdown - Contains hidden actions on smaller screens */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Actions hidden on smaller screens */}
                <div className="xl:hidden">
                  <DropdownMenuItem onClick={() => handleAction('override_billing')}>
                    <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                    Override Billing
                  </DropdownMenuItem>
                  {hasBlockedEncounters && (
                    <DropdownMenuItem onClick={() => handleAction('override_and_generate')}>
                      <ShieldPlus className="w-4 h-4 mr-2 shrink-0" />
                      Override & Generate Claim
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleAction('mark_for_rebilling')}>
                    <RefreshCw className="w-4 h-4 mr-2 shrink-0" />
                    Mark for Rebilling
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                
                <div className="lg:hidden">
                  <DropdownMenuItem onClick={() => handleAction('check_errors')}>
                    <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                    Check Errors
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                
                {/* Always in dropdown */}
                <DropdownMenuItem onClick={() => handleAction('set_bill_type')}>
                  <Settings className="w-4 h-4 mr-2 shrink-0" />
                  Set Bill Type
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('set_bill_to')}>
                  <Users className="w-4 h-4 mr-2 shrink-0" />
                  Set Bill-To
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  disabled={!hasBilled}
                  onClick={() => handleAction('mark_as_cleared')}
                >
                  <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                  Mark as Cleared
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('reopen')}>
                  <RotateCcw className="w-4 h-4 mr-2 shrink-0" />
                  Re-Open
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  disabled={!hasRebillMarked}
                  onClick={() => handleAction('remove_rebill')}
                >
                  <XCircle className="w-4 h-4 mr-2 shrink-0" />
                  Remove Re-bill
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('apply_post_primary_rules')}>
                  <Play className="w-4 h-4 mr-2 shrink-0" />
                  Apply Post Primary Rules
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setIsPosModalOpen(true)}>
                  <BuildingLightFullIcon className="w-4 h-4 mr-2 shrink-0" />
                  Set POS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Right Side - Empty for now */}
      <div className="flex items-center gap-3">
      </div>

      {/* Generate Claims Dialog */}
      <GenerateClaimsDialog
        open={showGenerateClaimsDialog}
        onClose={() => setShowGenerateClaimsDialog(false)}
        selectedEncounters={selectedEncounters}
      />

      {/* Claim Submission Dialog */}
      <ClaimSubmissionDialog
        open={showClaimSubmissionDialog}
        onClose={() => setShowClaimSubmissionDialog(false)}
        onSubmit={handleClaimSubmission}
        selectedEncounters={selectedEncounters}
      />

      {/* Set Bill Type Dialog */}
      <SetBillTypeDialog
        open={showSetBillTypeDialog}
        onClose={() => setShowSetBillTypeDialog(false)}
        onSubmit={handleSetBillType}
        selectedEncounters={selectedEncounters}
      />

      {/* Set Bill-To Dialog */}
      <SetBillToDialog
        open={showSetBillToDialog}
        onClose={() => setShowSetBillToDialog(false)}
        onSubmit={handleSetBillTo}
        selectedEncounters={selectedEncounters}
      />

      {/* POS Modal */}
      {isPosModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsPosModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Change Point of Service (POS)
              </h2>
              <button
                type="button"
                onClick={() => setIsPosModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              <p className="text-sm text-gray-600">
                Set the Place of Service for{' '}
                <span className="font-semibold text-gray-900">{selectedCount}</span>{' '}
                patient encounter{selectedCount !== 1 ? 's' : ''}.
              </p>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Point of Service
                </label>
                <Select value={posValue} onValueChange={setPosValue}>
                  <SelectTrigger className="w-full h-10 text-sm">
                    <SelectValue placeholder="Select POS" />
                  </SelectTrigger>
                  <SelectContent>
                    {POS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  onAction('set_pos', encounterIds)
                  setIsPosModalOpen(false)
                }}
                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingActionButtons
