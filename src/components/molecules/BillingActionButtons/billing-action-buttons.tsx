import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Icon } from '@/components/atoms/Icon/Icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BillingEncounter } from '@/types/billing-manager'
import { GenerateClaimsDialog } from '@/components/molecules/GenerateClaimsDialog'
import { ClaimSubmissionDialog } from '@/components/molecules/ClaimSubmissionDialog'
import { SetBillTypeDialog } from '@/components/molecules/SetBillTypeDialog'
import { SetBillToDialog } from '@/components/molecules/SetBillToDialog'

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
              <Icon icon="times" className="w-4 h-4 mr-1" />
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
              <Icon icon="file-alt" className="w-3.5 h-3.5 mr-1.5" />
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
              <Icon icon="paper-plane" className="w-3.5 h-3.5 mr-1.5" />
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
              <Icon icon="exclamation-triangle" className="w-3.5 h-3.5 mr-1.5" />
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
              <Icon icon="shield-alt" className="w-3.5 h-3.5 mr-1.5" />
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
                <Icon icon="shield-alt" className="w-3.5 h-3.5 mr-1.5" />
                <Icon icon="file-alt" className="w-3.5 h-3.5 mr-1.5" />
                Override & Generate
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('mark_for_rebilling')}
              className="text-xs hidden xl:inline-flex"
            >
              <Icon icon="redo-alt" className="w-3.5 h-3.5 mr-1.5" />
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
                  <Icon icon="ellipsis-h" className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Actions hidden on smaller screens */}
                <div className="xl:hidden">
                  <DropdownMenuItem onClick={() => handleAction('override_billing')}>
                    <Icon icon="shield-alt" className="w-4 h-4 mr-2" />
                    Override Billing
                  </DropdownMenuItem>
                  {hasBlockedEncounters && (
                    <DropdownMenuItem onClick={() => handleAction('override_and_generate')}>
                      <Icon icon="shield-alt" className="w-4 h-4 mr-2" />
                      <Icon icon="file-alt" className="w-4 h-4 mr-2" />
                      Override & Generate Claim
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleAction('mark_for_rebilling')}>
                    <Icon icon="redo-alt" className="w-4 h-4 mr-2" />
                    Mark for Rebilling
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                
                <div className="lg:hidden">
                  <DropdownMenuItem onClick={() => handleAction('check_errors')}>
                    <Icon icon="exclamation-triangle" className="w-4 h-4 mr-2" />
                    Check Errors
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                
                {/* Always in dropdown */}
                <DropdownMenuItem onClick={() => handleAction('set_bill_type')}>
                  <Icon icon="cog" className="w-4 h-4 mr-2" />
                  Set Bill Type
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('set_bill_to')}>
                  <Icon icon="users" className="w-4 h-4 mr-2" />
                  Set Bill-To
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('set_professional_hcfa')}>
                  <Icon icon="file-alt" className="w-4 h-4 mr-2" />
                  Professional (HCFA)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('set_institutional_ub04')}>
                  <Icon icon="building" className="w-4 h-4 mr-2" />
                  Institutional (UB04)
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  disabled={!hasBilled}
                  onClick={() => handleAction('mark_as_cleared')}
                >
                  <Icon icon="check-circle" className="w-4 h-4 mr-2" />
                  Mark as Cleared
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('reopen')}>
                  <Icon icon="sync" className="w-4 h-4 mr-2" />
                  Re-Open
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  disabled={!hasRebillMarked}
                  onClick={() => handleAction('remove_rebill')}
                >
                  <Icon icon="times" className="w-4 h-4 mr-2" />
                  Remove Re-bill
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('apply_post_primary_rules')}>
                  <Icon icon="play" className="w-4 h-4 mr-2" />
                  Apply Post Primary Rules
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
    </div>
  )
}

export default BillingActionButtons
