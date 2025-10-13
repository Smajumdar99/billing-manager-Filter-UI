import { FC } from 'react'
import { Icon } from '@/components/atoms/Icon/Icon'
import { InsuranceLevel } from '@/types/billing-manager'
import { 
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip'

export interface InsuranceLevelIndicatorProps {
  insuranceLevels: InsuranceLevel[]
  className?: string
}

/**
 * InsuranceLevelIndicator Component
 * 
 * Visual indicator showing insurance billing status across multiple levels.
 * Shows green checkmarks for billed insurance, red X for pending/ready,
 * and grayed out indicators for not applicable levels.
 */
export const InsuranceLevelIndicator: FC<InsuranceLevelIndicatorProps> = ({
  insuranceLevels,
  className = ""
}) => {


  const getLevelLabel = (level: 'primary' | 'secondary' | 'tertiary') => {
    switch (level) {
      case 'primary': return '1'
      case 'secondary': return '2'
      case 'tertiary': return '3'
      default: return ''
    }
  }

  const getLevelName = (level: 'primary' | 'secondary' | 'tertiary') => {
    switch (level) {
      case 'primary': return 'Primary'
      case 'secondary': return 'Secondary'
      case 'tertiary': return 'Tertiary'
      default: return ''
    }
  }

  const getTooltipContent = (level: InsuranceLevel) => {
    const levelName = getLevelName(level.level)
    
    if (!level.present) {
      return `${levelName} Insurance: Not applicable`
    }

    const payerInfo = level.payer ? ` (${level.payer})` : ''
    
    switch (level.status) {
      case 'billed':
        return `${levelName} Insurance${payerInfo}: ✅ Billed successfully`
      case 'ready':
        return `${levelName} Insurance${payerInfo}: ⏳ Ready to bill`
      case 'pending':
        return `${levelName} Insurance${payerInfo}: ⚠️ Pending authorization`
      case 'not_applicable':
        return `${levelName} Insurance: Not applicable`
      default:
        return `${levelName} Insurance${payerInfo}: Status unknown`
    }
  }

  const isCompletelyUnbilled = () => {
    const presentLevels = insuranceLevels.filter(l => l.present)
    if (presentLevels.length === 0) return false
    return presentLevels.every(l => l.status !== 'billed')
  }

  const getOverallTooltip = () => {
    const totalLevels = insuranceLevels.filter(l => l.present).length
    const billedLevels = insuranceLevels.filter(l => l.present && l.status === 'billed').length
    const pendingLevels = insuranceLevels.filter(l => l.present && l.status !== 'billed').length
    
    if (totalLevels === 0) {
      return "No insurance information available"
    }
    
    if (isCompletelyUnbilled()) {
      return `⚠️ UNBILLED: All ${totalLevels} insurance level(s) require billing - needs immediate attention`
    }
    
    if (billedLevels === totalLevels) {
      return `All ${totalLevels} insurance level(s) billed successfully`
    }
    
    return `${billedLevels}/${totalLevels} insurance levels billed, ${pendingLevels} pending`
  }

  // Sort levels by priority
  const sortedLevels = [...insuranceLevels].sort((a, b) => {
    const order = { primary: 1, secondary: 2, tertiary: 3 }
    return order[a.level] - order[b.level]
  })

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Insurance level indicators - Unified rectangle with 3 boxes */}
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden cursor-help hover:scale-105 transition-transform">
              {/* Always show all 3 levels */}
              {['primary', 'secondary', 'tertiary'].map((levelType, index) => {
                const level = sortedLevels.find(l => l.level === levelType)
                const isPresent = level?.present || false
                const status = level?.status || 'not_applicable'
                
                // Get previous level to check if it's billed (for sequential billing logic)
                const previousLevelType = index === 1 ? 'primary' : index === 2 ? 'secondary' : null
                const previousLevel = previousLevelType ? sortedLevels.find(l => l.level === previousLevelType) : null
                const isPreviousLevelBilled = previousLevel?.status === 'billed'
                
                let bgColor = 'bg-gray-100'
                let textColor = 'text-gray-400'
                let icon = null
                
                if (isPresent) {
                  if (status === 'billed') {
                    bgColor = 'bg-emerald-100'
                    textColor = 'text-emerald-700'
                    icon = <Icon icon="check" className="w-2.5 h-2.5" />
                  } else if (status === 'ready' || status === 'pending') {
                    // Only show as pending/ready if:
                    // - It's primary (index 0), OR
                    // - Previous level is billed
                    if (index === 0 || isPreviousLevelBilled) {
                      bgColor = 'bg-amber-100'
                      textColor = 'text-amber-700'
                      icon = <Icon icon="clock" className="w-2.5 h-2.5" />
                    }
                    // Otherwise, keep it gray (not yet eligible for billing)
                  }
                }
                
                return (
                  <div 
                    key={levelType}
                    className={`px-2 py-1 ${bgColor} ${textColor} text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] ${
                      index < 2 ? 'border-r border-gray-300' : ''
                    }`}
                  >
                    {icon}
                    {index + 1}
                  </div>
                )
              })}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className="z-[99999] max-w-sm bg-white border border-gray-200 shadow-lg text-gray-900"
            sideOffset={8}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">Insurance Billing Status</p>
              <div className="space-y-1">
                {sortedLevels.map((level) => (
                  <p key={level.level} className="text-xs text-gray-700">{getTooltipContent(level)}</p>
                ))}
              </div>
            </div>
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  )
}
