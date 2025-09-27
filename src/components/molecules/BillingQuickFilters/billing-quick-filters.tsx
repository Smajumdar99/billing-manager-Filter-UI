import { FC, useState } from 'react'
import { Badge } from '@/components/atoms/Badge/badge'
import { Button } from '@/components/atoms/Button/button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { BillingQueueFilters, PayerType, BillingStatus, BillType } from '@/types/billing-manager'

export interface BillingQuickFiltersProps {
  onFilterChange: (filters: Partial<BillingQueueFilters>) => void
  onClearFilters: () => void
  activeFilters: string[]
  encounterCount: number
  className?: string
}

// Predefined filter cards for quick access
interface FilterCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  filters: Partial<BillingQueueFilters>
  count?: number
}

/**
 * BillingQuickFilters Component
 * 
 * Simple card-based filtering interface for billing queue.
 * Provides predefined filter combinations that billing specialists commonly use.
 * Reduces cognitive load with visual cards instead of complex filter controls.
 */
export const BillingQuickFilters: FC<BillingQuickFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  activeFilters,
  encounterCount,
  className = ""
}) => {
  // State for bill type radio selection
  const [selectedBillType, setSelectedBillType] = useState<string>('all')

  // Calculate date ranges for filters
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)
  const sixtyDaysAgo = new Date(today)
  sixtyDaysAgo.setDate(today.getDate() - 60)
  const ninetyDaysAgo = new Date(today)
  ninetyDaysAgo.setDate(today.getDate() - 90)

  // Quick date filters with encounter counts
  const dateFilters: FilterCard[] = [
    {
      id: 'last-30-days',
      title: 'Last 30 Days',
      description: 'Most recent encounters',
      icon: "calendar",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        dateRange: {
          start: thirtyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        }
      },
      count: 847
    },
    {
      id: 'last-60-days',
      title: 'Last 60 Days',
      description: 'Extended recent period',
      icon: "calendar",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        dateRange: {
          start: sixtyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        }
      },
      count: 1624
    },
    {
      id: 'last-90-days',
      title: 'Last 90 Days',
      description: 'Quarterly view',
      icon: "calendar",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        dateRange: {
          start: ninetyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        }
      },
      count: 2341
    }
  ]

  // Status-based quick filters with encounter counts
  const statusFilters: FilterCard[] = [
    {
      id: 'ready-to-bill',
      title: 'Ready to Bill',
      description: 'No errors, ready for claims',
      icon: "check-circle",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        statuses: ['ready_to_bill' as BillingStatus],
        hasErrors: false
      },
      count: 243
    },
    {
      id: 'with-errors',
      title: 'Need Attention',
      description: 'Encounters with errors',
      icon: "exclamation-triangle",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        hasErrors: true
      },
      count: 87
    },
    {
      id: 'unauthorized',
      title: 'Need Authorization',
      description: 'Pending pre-auth',
      icon: "clock",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        statuses: ['unauthorized' as BillingStatus]
      },
      count: 156
    },
    {
      id: 'high-value',
      title: 'High Value',
      description: 'Claims > $50,000',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['high-value' as PayerType] // Special flag for high value filtering
      },
      count: 23
    }
  ]

  // Major US behavioral health payers with encounter counts
  const payerFilters: FilterCard[] = [
    {
      id: 'medicare-payer',
      title: 'Medicare',
      description: 'Federal health insurance',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Medicare' as PayerType]
      },
      count: 289
    },
    {
      id: 'medicaid-payer',
      title: 'Medicaid',
      description: 'State health insurance',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Medicaid' as PayerType]
      },
      count: 412
    },
    {
      id: 'bcbs-payer',
      title: 'Blue Cross Blue Shield',
      description: 'BCBS commercial plans',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Blue Cross Blue Shield' as PayerType]
      },
      count: 156
    },
    {
      id: 'aetna-payer',
      title: 'Aetna',
      description: 'Aetna commercial insurance',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Aetna' as PayerType]
      },
      count: 134
    },
    {
      id: 'unitedhealth-payer',
      title: 'UnitedHealth',
      description: 'UnitedHealthcare plans',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['UnitedHealth' as PayerType]
      },
      count: 98
    },
    {
      id: 'cigna-payer',
      title: 'Cigna',
      description: 'Cigna behavioral health',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Cigna' as PayerType]
      },
      count: 87
    },
    {
      id: 'eap-payer',
      title: 'EAP',
      description: 'Employee Assistance Programs',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['EAP' as PayerType]
      },
      count: 73
    },
    {
      id: 'self-pay',
      title: 'Self Pay',
      description: 'Private pay patients',
      icon: "money-bill-wave",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        payers: ['Self Pay' as PayerType]
      },
      count: 145
    }
  ]

  // Service type filters specific to behavioral health with encounter counts
  const serviceFilters: FilterCard[] = [
    {
      id: 'individual-therapy',
      title: 'Individual Therapy',
      description: 'One-on-one therapy sessions',
      icon: "user",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'individual therapy'
      },
      count: 432
    },
    {
      id: 'group-therapy',
      title: 'Group Therapy',
      description: 'Group therapy sessions',
      icon: "users",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'group therapy'
      },
      count: 187
    },
    {
      id: 'psychiatry',
      title: 'Psychiatry',
      description: 'Psychiatric evaluations & med mgmt',
      icon: "flask",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'psychiatry'
      },
      count: 298
    },
    {
      id: 'telehealth',
      title: 'Telehealth',
      description: 'Virtual sessions',
      icon: "video",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'telehealth'
      },
      count: 365
    }
  ]

  // Provider type filters with encounter counts
  const providerFilters: FilterCard[] = [
    {
      id: 'psychiatrist',
      title: 'Psychiatrist',
      description: 'MD/DO providers',
      icon: "graduation-cap",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'psychiatrist'
      },
      count: 214
    },
    {
      id: 'therapist',
      title: 'Therapist',
      description: 'LPC/LMFT providers',
      icon: "heart",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'therapist'
      },
      count: 389
    },
    {
      id: 'social-worker',
      title: 'Social Worker',
      description: 'LCSW providers',
      icon: "users",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'social worker'
      },
      count: 156
    },
    {
      id: 'counselor',
      title: 'Counselor',
      description: 'Licensed counselors',
      icon: "user",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'counselor'
      },
      count: 245
    }
  ]

  // Authorization & Documentation filters with encounter counts
  const authFilters: FilterCard[] = [
    {
      id: 'pre-auth-required',
      title: 'Pre-Auth Required',
      description: 'Needs authorization',
      icon: "shield-alt",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        statuses: ['unauthorized' as BillingStatus]
      },
      count: 124
    },
    {
      id: 'missing-diagnosis',
      title: 'Missing Diagnosis',
      description: 'No primary diagnosis',
      icon: "file-alt",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        hasErrors: true,
        errorTypes: ['Documentation Missing']
      },
      count: 67
    },
    {
      id: 'treatment-plan',
      title: 'Treatment Plan',
      description: 'Missing treatment plan',
      icon: "clipboard-check",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        hasErrors: true,
        errorTypes: ['Documentation Missing']
      },
      count: 43
    },
    {
      id: 'crisis-sessions',
      title: 'Crisis Sessions',
      description: 'Emergency/crisis billing',
      icon: "phone",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'crisis'
      },
      count: 89
    }
  ]


  // Bill type options for radio buttons
  const billTypeOptions = [
    { id: 'all', label: 'All Bill Types', count: 3 },
    { id: 'hcfa', label: 'HCFA (3)', count: 3 },
    { id: 'ub04', label: 'UB-04 (0)', count: 0 },
    { id: 'not-set', label: 'Not Set (0)', count: 0 }
  ]

  // Get filtered counts based on selected bill type
  const getFilteredCount = (baseCount: number) => {
    switch (selectedBillType) {
      case 'hcfa':
        return baseCount // HCFA has all the encounters
      case 'ub04':
        return 0 // No UB-04 encounters
      case 'not-set':
        return 0 // No Not Set encounters
      default:
        return baseCount // All bill types
    }
  }

  // Detailed status filters with dynamic encounter counts
  const detailedStatusFilters: FilterCard[] = [
    {
      id: 'unbilled-no-claim-no-errors',
      title: 'Unbilled (No Claim, No Errors)',
      description: 'Ready for claim generation',
      icon: "clock",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        statuses: ['ready_to_bill' as BillingStatus],
        hasErrors: false,
        ...(selectedBillType !== 'all' && selectedBillType !== 'not-set' ? { billTypes: [selectedBillType as BillType] } : {})
      },
      count: getFilteredCount(0)
    },
    {
      id: 'pending-submit-no-errors',
      title: 'Pending Submit (No Errors)',
      description: 'Claims generated, awaiting submission',
      icon: "pause",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        statuses: ['claim_generated' as BillingStatus],
        hasErrors: false,
        ...(selectedBillType !== 'all' && selectedBillType !== 'not-set' ? { billTypes: [selectedBillType as BillType] } : {})
      },
      count: getFilteredCount(0)
    },
    {
      id: 'with-errors-status',
      title: 'With Errors',
      description: `Encounters requiring attention ($${getFilteredCount(1026).toLocaleString()}.00)`,
      icon: "exclamation-triangle",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        hasErrors: true,
        ...(selectedBillType !== 'all' && selectedBillType !== 'not-set' ? { billTypes: [selectedBillType as BillType] } : {})
      },
      count: getFilteredCount(3)
    },
    {
      id: 'blocked-disabled',
      title: 'Blocked/Disabled',
      description: 'Cannot be processed',
      icon: "ban",
      color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      filters: {
        searchQuery: 'blocked',
        ...(selectedBillType !== 'all' && selectedBillType !== 'not-set' ? { billTypes: [selectedBillType as BillType] } : {})
      },
      count: getFilteredCount(0)
    }
  ]

  // Handle filter card click
  const handleFilterClick = (card: FilterCard) => {
    onFilterChange(card.filters)
  }

  // Handle bill type radio button change
  const handleBillTypeChange = (billType: string) => {
    setSelectedBillType(billType)
    // Apply bill type filter if specific type is selected
    if (billType !== 'all' && billType !== 'not-set') {
      onFilterChange({ billTypes: [billType as BillType] })
    } else if (billType === 'all') {
      onFilterChange({ billTypes: [] })
    }
  }

  // Check if a filter is active
  const isFilterActive = (filterId: string) => {
    return activeFilters.includes(filterId)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-gray-500"
          >
            <Icon icon="times" className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Date Range Filters */}
      <div className="bg-blue-100/40 rounded-lg p-3 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">
          Date Ranges
        </h4>
        <div className="grid grid-cols-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {dateFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-3 text-left transition-colors duration-150 relative ${
                index < dateFilters.length - 1 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? `bg-blue-50 border-blue-200 text-blue-700` 
                  : `${card.color}`
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-green-100/40 rounded-lg p-3 border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-3">
          Billing Status
        </h4>
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {statusFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-3 text-left transition-colors duration-150 relative ${
                index % 2 === 0 && index < statusFilters.length - 1 ? 'border-r border-gray-200' : ''
              } ${
                index < statusFilters.length - 2 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? `bg-blue-50 border-blue-200 text-blue-700` 
                  : `${card.color}`
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payer Filters */}
      <div className="bg-purple-100/40 rounded-lg p-3 border border-purple-200">
        <h4 className="text-sm font-semibold text-purple-800 mb-3">
          Insurance Payers
        </h4>
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {payerFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-2 text-left transition-all hover:bg-gray-50 relative ${
                index % 2 === 0 && index < payerFilters.length - 1 ? 'border-r border-gray-200' : ''
              } ${
                index < payerFilters.length - 2 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? 'bg-blue-50' 
                  : 'bg-zinc-50'
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Service Type Filters */}
      <div className="bg-orange-100/40 rounded-lg p-3 border border-orange-200">
        <h4 className="text-sm font-semibold text-orange-800 mb-3">
          Service Types
        </h4>
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {serviceFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-2 text-left transition-all hover:bg-gray-50 relative ${
                index % 2 === 0 && index < serviceFilters.length - 1 ? 'border-r border-gray-200' : ''
              } ${
                index < serviceFilters.length - 2 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? 'bg-blue-50' 
                  : 'bg-zinc-50'
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Provider Type Filters */}
      <div className="bg-indigo-100/40 rounded-lg p-3 border border-indigo-200">
        <h4 className="text-sm font-semibold text-indigo-800 mb-3">
          Provider Types
        </h4>
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {providerFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-2 text-left transition-all hover:bg-gray-50 relative ${
                index % 2 === 0 && index < providerFilters.length - 1 ? 'border-r border-gray-200' : ''
              } ${
                index < providerFilters.length - 2 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? 'bg-blue-50' 
                  : 'bg-zinc-50'
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Authorization & Documentation Filters */}
      <div className="bg-amber-100/40 rounded-lg p-3 border border-amber-200">
        <h4 className="text-sm font-semibold text-amber-800 mb-3">
          Authorization & Documentation
        </h4>
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {authFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-2 text-left transition-all hover:bg-gray-50 relative ${
                index % 2 === 0 && index < authFilters.length - 1 ? 'border-r border-gray-200' : ''
              } ${
                index < authFilters.length - 2 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? 'bg-blue-50' 
                  : 'bg-zinc-50'
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Status Filters with Bill Type Radio Buttons */}
      <div className="bg-slate-100/40 rounded-lg p-3 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Detailed Status
        </h4>
        
        {/* Bill Type Radio Buttons */}
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-cyan-800 mb-2">
            Bill Types
          </h5>
          <div className="grid grid-cols-4 gap-2 p-2 bg-white rounded-lg border border-gray-200">
            {billTypeOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer text-xs"
              >
                <input
                  type="radio"
                  name="billType"
                  value={option.id}
                  checked={selectedBillType === option.id}
                  onChange={(e) => handleBillTypeChange(e.target.value)}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {detailedStatusFilters.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleFilterClick(card)}
              className={`p-3 text-left transition-colors duration-150 relative ${
                index < detailedStatusFilters.length - 1 ? 'border-b border-gray-200' : ''
              } ${
                isFilterActive(card.id) 
                  ? `bg-blue-50 border-blue-200 text-blue-700` 
                  : `${card.color}`
              }`}
            >
              {/* Selected Tick Mark - Bottom Position */}
              {isFilterActive(card.id) && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{card.title}</span>
                </div>
                {card.count !== undefined && (
                  <div className="px-2 py-1 bg-gray-200/80 text-gray-600 rounded-full text-xs font-semibold">
                    {card.count}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-700">Active filters:</span>
            {activeFilters.map((filterId, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800 text-xs">
                {filterId.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingQuickFilters
