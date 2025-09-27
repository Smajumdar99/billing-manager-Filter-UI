import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Badge } from '@/components/atoms/Badge/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select/select'
import { 
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip'
import { 
  BanknotesIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  UserIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { BillingEncounter, BulkActionType } from '@/types/billing-manager'

export interface BillingBulkActionsProps {
  selectedEncounters: BillingEncounter[]
  onBulkAction: (action: BulkActionType, encounterIds: string[], options?: any) => void
  onClearSelection: () => void
  className?: string
}

/**
 * BillingBulkActions Component
 * 
 * Provides bulk action capabilities for selected billing encounters.
 * Supports claim generation, submission, overrides, assignments, and exports.
 * Includes permission-based action availability and confirmation dialogs.
 */
export const BillingBulkActions: FC<BillingBulkActionsProps> = ({
  selectedEncounters,
  onBulkAction,
  onClearSelection,
  className = ""
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)
  const [assignmentUser, setAssignmentUser] = useState<string>('')

  // Available bulk actions with configurations
  const bulkActions = [
    {
      type: 'generate_claims' as BulkActionType,
      label: 'Generate Claims',
      icon: <BanknotesIcon className="w-4 h-4" />,
      description: 'Generate claims for selected encounters',
      variant: 'default' as const,
      confirmationRequired: true,
      disabled: selectedEncounters.length === 0 || 
                !selectedEncounters.some(e => e.canGenerateClaim)
    },
    {
      type: 'submit_claims' as BulkActionType,
      label: 'Submit Claims',
      icon: <PaperAirplaneIcon className="w-4 h-4" />,
      description: 'Submit generated claims to payers',
      variant: 'default' as const,
      confirmationRequired: true,
      disabled: selectedEncounters.length === 0 || 
                !selectedEncounters.some(e => e.canSubmitClaim)
    },
    {
      type: 'override_blocks' as BulkActionType,
      label: 'Override Blocks',
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      description: 'Override billing blocks (requires permission)',
      variant: 'outline' as const,
      confirmationRequired: true,
      disabled: selectedEncounters.length === 0 || 
                !selectedEncounters.some(e => e.canOverride && e.hasErrors)
    },
    {
      type: 'mark_ready' as BulkActionType,
      label: 'Mark Ready',
      icon: <CheckCircleIcon className="w-4 h-4" />,
      description: 'Mark encounters as ready to bill',
      variant: 'outline' as const,
      confirmationRequired: false,
      disabled: selectedEncounters.length === 0
    }
  ]

  // Secondary actions (less frequently used)
  const secondaryActions = [
    {
      type: 'bulk_edit' as BulkActionType,
      label: 'Bulk Edit',
      icon: <PencilSquareIcon className="w-4 h-4" />,
      description: 'Edit multiple encounters at once',
      disabled: selectedEncounters.length === 0
    },
    {
      type: 'export_list' as BulkActionType,
      label: 'Export',
      icon: <DocumentArrowDownIcon className="w-4 h-4" />,
      description: 'Export selected encounters to CSV',
      disabled: selectedEncounters.length === 0
    }
  ]

  // Available users for assignment
  const availableUsers = [
    'Billing Specialist A',
    'Billing Specialist B', 
    'Senior Claims Analyst',
    'Government Claims Specialist',
    'Corporate Billing Team'
  ]

  // Handle bulk action execution
  const handleBulkAction = (actionType: BulkActionType, options?: any) => {
    const encounterIds = selectedEncounters.map(e => e.id)
    onBulkAction(actionType, encounterIds, options)
    setShowConfirmDialog(null)
    
    // Clear selection after successful action (except for non-destructive actions)
    if (!['export_list', 'bulk_edit'].includes(actionType)) {
      onClearSelection()
    }
  }

  // Handle assignment action
  const handleAssignment = () => {
    if (assignmentUser) {
      handleBulkAction('assign_to_user', { assignedTo: assignmentUser })
      setAssignmentUser('')
    }
  }

  // Get action statistics
  const getActionStats = () => {
    const canGenerateClaims = selectedEncounters.filter(e => e.canGenerateClaim).length
    const canSubmitClaims = selectedEncounters.filter(e => e.canSubmitClaim).length
    const hasErrors = selectedEncounters.filter(e => e.hasErrors).length
    const totalValue = selectedEncounters.reduce((sum, e) => sum + e.totalCharges, 0)

    return {
      canGenerateClaims,
      canSubmitClaims,
      hasErrors,
      totalValue
    }
  }

  const stats = getActionStats()

  if (selectedEncounters.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-gray-500">
          Select encounters from the table to perform bulk actions
        </p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 space-y-4 ${className}`}>
        {/* Selection Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {selectedEncounters.length} Selected
              </Badge>
              <span className="text-sm text-gray-600">
                Total Value: ${stats.totalValue.toLocaleString()}
              </span>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-2 text-xs">
              {stats.canGenerateClaims > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {stats.canGenerateClaims} Ready to Generate
                </Badge>
              )}
              {stats.canSubmitClaims > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {stats.canSubmitClaims} Ready to Submit
                </Badge>
              )}
              {stats.hasErrors > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                  {stats.hasErrors} With Errors
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500"
          >
            Clear Selection
          </Button>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap gap-2">
          {bulkActions.map((action) => (
            <TooltipRoot key={action.type}>
              <TooltipTrigger asChild>
                <Button
                  variant={action.variant}
                  size="sm"
                  disabled={action.disabled}
                  onClick={() => {
                    if (action.confirmationRequired) {
                      setShowConfirmDialog(action.type)
                    } else {
                      handleBulkAction(action.type)
                    }
                  }}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.description}</p>
              </TooltipContent>
            </TooltipRoot>
          ))}
        </div>

        {/* Assignment Section */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">Assign to:</span>
          <Select value={assignmentUser} onValueChange={setAssignmentUser}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            disabled={!assignmentUser}
            onClick={handleAssignment}
          >
            Assign
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500 mr-2">More actions:</span>
          {secondaryActions.map((action) => (
            <TooltipRoot key={action.type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={action.disabled}
                  onClick={() => handleBulkAction(action.type)}
                  className="gap-1 h-8 px-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.description}</p>
              </TooltipContent>
            </TooltipRoot>
          ))}
        </div>

        {/* Confirmation Dialogs */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm {bulkActions.find(a => a.type === showConfirmDialog)?.label}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to {showConfirmDialog.replace('_', ' ')} {selectedEncounters.length} encounter(s)?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleBulkAction(showConfirmDialog as BulkActionType)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default BillingBulkActions
