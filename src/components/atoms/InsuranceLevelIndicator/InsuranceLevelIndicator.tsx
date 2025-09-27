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
      {/* Unbilled indicator */}
      {isCompletelyUnbilled() && (
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-help">
                <Icon 
                  icon="exclamation-triangle" 
                  className="w-4 h-4 text-red-600 animate-pulse" 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="center"
              className="z-[99999] max-w-sm bg-white border border-red-300 shadow-lg"
              sideOffset={8}
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-800">
                  Unbilled Encounter
                </p>
                <p className="text-xs text-red-700 font-medium">
                  No insurance levels have been billed yet
                </p>
                <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border-l-2 border-red-400">
                  <div className="flex items-center gap-1 font-medium">
                    <Icon icon="file-invoice-dollar" className="w-3 h-3" />
                    <span>URGENT: Requires immediate billing attention</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      )}
      
      {/* Bill icon with overall tooltip */}
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <div className={`flex items-center cursor-help ${isCompletelyUnbilled() ? 'text-red-600' : 'text-gray-600'}`}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="current-color"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className={`z-[99999] max-w-xs bg-white border border-gray-200 shadow-lg ${isCompletelyUnbilled() ? 'border-red-300' : ''}`}
            sideOffset={8}
          >
            <div className="space-y-1">
              <p className={`text-sm font-semibold ${isCompletelyUnbilled() ? 'text-red-800' : 'text-gray-900'}`}>
                Insurance Billing Status
              </p>
              <p className={`text-xs ${isCompletelyUnbilled() ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                {getOverallTooltip()}
              </p>
              {isCompletelyUnbilled() && (
                <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border-l-2 border-red-400">
                  <div className="flex items-center gap-1 font-medium">
                    <Icon icon="file-invoice-dollar" className="w-3 h-3" />
                    <span>URGENT: Requires immediate billing attention</span>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-600 mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] border-r border-gray-300">
                      <Icon icon="check" className="w-2.5 h-2.5" />
                      1
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px] border-r border-gray-300">
                      2
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px]">
                      3
                    </div>
                  </div>
                  <span className="text-gray-700">= Billed successfully</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <div className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] border-r border-gray-300">
                      <Icon icon="clock" className="w-2.5 h-2.5" />
                      1
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px] border-r border-gray-300">
                      2
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px]">
                      3
                    </div>
                  </div>
                  <span className="text-gray-700">= Pending/Ready to bill</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px] border-r border-gray-300">
                      1
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px] border-r border-gray-300">
                      2
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center min-w-[28px]">
                      3
                    </div>
                  </div>
                  <span className="text-gray-700">= Not applicable</span>
                </div>
                {isCompletelyUnbilled() && (
                  <div className="text-red-600 font-medium flex items-center gap-1">
                    <Icon icon="file-invoice-dollar" className="w-3 h-3" />
                    <span>= Completely unbilled</span>
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
      
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
                
                let bgColor = 'bg-gray-100'
                let textColor = 'text-gray-400'
                let icon = null
                
                if (isPresent) {
                  if (status === 'billed') {
                    bgColor = 'bg-emerald-100'
                    textColor = 'text-emerald-700'
                    icon = <Icon icon="check" className="w-2.5 h-2.5" />
                  } else if (status === 'ready' || status === 'pending') {
                    bgColor = 'bg-amber-100'
                    textColor = 'text-amber-700'
                    icon = <Icon icon="clock" className="w-2.5 h-2.5" />
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
