import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/input'
import { Badge } from '@/components/atoms/Badge/badge'
import { 
  ExclamationTriangleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { BillingEncounter, BillingError } from '@/types/billing-manager'

export interface BillingErrorDialogProps {
  encounter: BillingEncounter
  isOpen: boolean
  onClose: () => void
  onOverrideError: (errorId: string, reason: string) => void
  canOverride?: boolean
  className?: string
}

/**
 * BillingErrorDialog Component
 * 
 * Displays billing errors for an encounter with override capabilities.
 * Shows error details, severity levels, and allows authorized users to override errors.
 * Tracks override reasons for audit trail compliance.
 */
export const BillingErrorDialog: FC<BillingErrorDialogProps> = ({
  encounter,
  isOpen,
  onClose,
  onOverrideError,
  canOverride = false,
  className = ""
}) => {
  const [overrideReason, setOverrideReason] = useState('')
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null)

  if (!isOpen) return null

  // Get error severity styling
  const getErrorSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
    const severityConfig = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800' },
      warning: { label: 'Warning', className: 'bg-yellow-100 text-yellow-800' },
      info: { label: 'Info', className: 'bg-blue-100 text-blue-800' }
    }
    
    const config = severityConfig[severity]
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // Get error type display name
  const getErrorTypeDisplayName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Handle error override
  const handleOverride = () => {
    if (selectedErrorId && overrideReason.trim()) {
      onOverrideError(selectedErrorId, overrideReason.trim())
      setOverrideReason('')
      setSelectedErrorId(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              Billing Errors - {encounter.patientName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Encounter: {encounter.encounterType} | Date: {new Date(encounter.dateOfService).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Error List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {encounter.errors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No errors found for this encounter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {encounter.errors.map((error) => (
                <div
                  key={error.id}
                  className={`border rounded-lg p-4 ${
                    error.severity === 'critical' 
                      ? 'border-red-200 bg-red-50/50' 
                      : error.severity === 'warning'
                      ? 'border-yellow-200 bg-yellow-50/50'
                      : 'border-blue-200 bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getErrorSeverityBadge(error.severity)}
                      <Badge variant="outline" className="text-xs">
                        {getErrorTypeDisplayName(error.type)}
                      </Badge>
                    </div>
                    
                    {error.canOverride && canOverride && !error.overriddenBy && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedErrorId(error.id)}
                        className="gap-1 text-xs"
                      >
                        <ShieldCheckIcon className="w-3 h-3" />
                        Override
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">{error.message}</p>
                    {error.details && (
                      <p className="text-sm text-gray-600">{error.details}</p>
                    )}
                    
                    {error.overriddenBy && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <p className="font-medium text-green-800">
                          Overridden by {error.overriddenBy}
                        </p>
                        {error.overriddenAt && (
                          <p className="text-green-600">
                            Date: {new Date(error.overriddenAt).toLocaleString()}
                          </p>
                        )}
                        {error.overrideReason && (
                          <p className="text-green-600 mt-1">
                            Reason: {error.overrideReason}
                          </p>
                        )}
                      </div>
                    )}

                    {!error.canOverride && error.severity === 'critical' && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                        <p className="text-red-800 font-medium">
                          This error cannot be overridden and must be resolved before proceeding.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Override Section */}
        {selectedErrorId && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Override Error - Provide Justification
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="Enter reason for override (required for audit trail)"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  This override will be logged for compliance and audit purposes.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedErrorId(null)
                      setOverrideReason('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={!overrideReason.trim()}
                    onClick={handleOverride}
                    className="gap-1"
                  >
                    <ShieldCheckIcon className="w-3 h-3" />
                    Override Error
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BillingErrorDialog
