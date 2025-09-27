import { FC, useState } from 'react'
import { Switch } from '@/components/atoms/Switch/switch'
import { 
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface BillingOverrideToggleProps {
  enabled: boolean
  canOverride: boolean
  encounterHasErrors: boolean
  onToggle: (enabled: boolean) => void
  className?: string
}

/**
 * BillingOverrideToggle Component
 * 
 * Toggle switch for enabling/disabling billing override functionality.
 * Shows appropriate warnings and tooltips based on encounter status.
 */
export const BillingOverrideToggle: FC<BillingOverrideToggleProps> = ({
  enabled,
  canOverride,
  encounterHasErrors,
  onToggle,
  className = ""
}) => {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async (checked: boolean) => {
    if (!canOverride && checked) {
      return // Prevent enabling if not allowed
    }

    setIsToggling(true)
    try {
      onToggle(checked)
    } finally {
      setIsToggling(false)
    }
  }

  const getTooltipContent = () => {
    if (!canOverride) {
      return "Override not permitted for this encounter"
    }
    
    if (enabled) {
      return "Billing override is enabled - encounter will bypass validation checks"
    }
    
    if (encounterHasErrors) {
      return "Enable override to bypass billing validation errors"
    }
    
    return "Enable billing override to bypass validation checks when needed"
  }

  const getSwitchVariant = () => {
    if (!canOverride) return 'disabled'
    if (enabled) return 'warning'
    return 'default'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {/* Warning icon when override is enabled */}
              {enabled && (
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
              )}
              
              {/* Toggle Switch */}
              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={!canOverride || isToggling}
                variant={getSwitchVariant()}
                size="sm"
                className={`
                  ${!canOverride ? 'opacity-50 cursor-not-allowed' : ''}
                  ${enabled ? 'bg-amber-600' : ''}
                `}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className="z-[9999] max-w-sm"
            sideOffset={8}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold">Billing Override</p>
              <p className="text-xs">{getTooltipContent()}</p>
              {enabled && (
                <div className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  <span>Validation checks bypassed</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  )
}
