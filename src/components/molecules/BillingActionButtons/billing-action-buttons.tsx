import { FC } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Badge } from '@/components/atoms/Badge/badge'
import { Icon } from '@/components/atoms/Icon/Icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BillingEncounter } from '@/types/billing-manager'

export interface BillingActionButtonsProps {
  selectedEncounters: BillingEncounter[]
  onAction: (action: string, encounterIds: string[]) => void
  className?: string
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
  className = ""
}) => {
  const selectedCount = selectedEncounters.length
  const encounterIds = selectedEncounters.map(e => e.id)
  
  // Check if any encounters can generate claims
  const canGenerateClaims = selectedEncounters.some(e => 
    e.status === 'ready_to_bill' || e.status === 'authorized'
  )
  
  // Check if any encounters have errors
  const hasErrors = selectedEncounters.some(e => e.hasErrors)
  
  // Check if any encounters are billed
  const hasBilled = selectedEncounters.some(e => e.status === 'billed' || e.status === 'paid')
  
  // Check if any encounters are marked for rebill
  const hasRebillMarked = selectedEncounters.some(e => e.markedForRebill)

  const handleAction = (action: string) => {
    onAction(action, encounterIds)
  }

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4 ${className}`}>
      {/* Selection Info */}
      <div className="flex items-center gap-3">
        {selectedCount > 0 ? (
          <>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {selectedCount} encounter{selectedCount !== 1 ? 's' : ''} selected
            </Badge>
            
            {/* Status indicators */}
            <div className="flex gap-4 text-xs text-gray-600">
              <span>Ready: {selectedEncounters.filter(e => e.status === 'ready_to_bill').length}</span>
              <span>Errors: {selectedEncounters.filter(e => e.hasErrors).length}</span>
              <span>Billed: {selectedEncounters.filter(e => e.status === 'billed' || e.status === 'paid').length}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Select encounters to perform bulk actions</span>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Ready to use bulk operations on selected items</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bulk Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={selectedCount === 0}
            >
              <Icon icon="cogs" className="w-4 h-4 mr-2" />
              Bulk Actions
              <Icon icon="chevron-down" className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Claims Actions */}
            <DropdownMenuItem 
              disabled={selectedCount === 0 || !canGenerateClaims}
              onClick={() => handleAction('generate_claims')}
            >
              <Icon icon="file-alt" className="w-4 h-4 mr-2" />
              Generate Claim(s)
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0 || !canGenerateClaims}
              onClick={() => handleAction('generate_and_submit_claims')}
            >
              <Icon icon="paper-plane" className="w-4 h-4 mr-2" />
              Generate & Submit Claim(s)
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('check_errors')}
            >
              <Icon icon="exclamation-triangle" className="w-4 h-4 mr-2" />
              Claims Errors Check
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Configuration Actions */}
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('set_bill_type')}
            >
              <Icon icon="cog" className="w-4 h-4 mr-2" />
              Set Bill Type
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('set_bill_to')}
            >
              <Icon icon="users" className="w-4 h-4 mr-2" />
              Set Bill-To
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('set_professional_hcfa')}
            >
              <Icon icon="file-alt" className="w-4 h-4 mr-2" />
              Professional (HCFA)
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('set_institutional_ub04')}
            >
              <Icon icon="building" className="w-4 h-4 mr-2" />
              Institutional (UB04)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Status Actions */}
            <DropdownMenuItem 
              disabled={selectedCount === 0 || !hasBilled}
              onClick={() => handleAction('mark_as_cleared')}
            >
              <Icon icon="check-circle" className="w-4 h-4 mr-2" />
              Mark as Cleared
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('reopen')}
            >
              <Icon icon="sync" className="w-4 h-4 mr-2" />
              Re-Open
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Override Actions */}
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('override_billing')}
            >
              <Icon icon="shield-alt" className="w-4 h-4 mr-2" />
              Override Billing
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Rebilling Actions */}
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('mark_for_rebilling')}
            >
              <Icon icon="redo-alt" className="w-4 h-4 mr-2" />
              Mark for Rebilling
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0 || !hasRebillMarked}
              onClick={() => handleAction('remove_rebill')}
            >
              <Icon icon="times" className="w-4 h-4 mr-2" />
              Remove Re-bill
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleAction('apply_post_primary_rules')}
            >
              <Icon icon="play" className="w-4 h-4 mr-2" />
              Apply Post Primary Rules
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Selection */}
        {selectedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('clear_selection', [])}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon="times" className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default BillingActionButtons
