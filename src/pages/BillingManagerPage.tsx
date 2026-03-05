import { FC, useState, useMemo, useCallback, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { BillingFilterToolbar, type FilterValues } from '@/components/molecules/BillingFilterToolbar'
import { type SortOption } from '@/components/molecules/BillingQueueFilters'
import { BillingActionButtons, type ViewMode } from '@/components/molecules/BillingActionButtons'
import { Tabs, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs'
import { BillingQueueTable } from '@/components/organisms/BillingQueueTable'
import { BillingViewCardsListing } from '@/components/organisms/BillingViewCardsListing'
import { BillingErrorDialog } from '@/components/molecules/BillingErrorDialog'
import { OverrideDialog } from '@/components/molecules/OverrideDialog'
import { Button } from '@/components/atoms/Button/button'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { 
  mockBillingEncounters, 
  getBillingQueueStats, 
  defaultBillingFilters 
} from '@/data/mockBillingEncounters'
import { 
  BillingEncounter, 
  BillingQueueFilters as FilterType, 
  BulkActionType
} from '@/types/billing-manager'

/**
 * BillingManagerPage Component
 * 
 * Queue-based billing manager for processing encounters with comprehensive workflow.
 * Features filtering, bulk actions, error handling, and claim management.
 * Designed for billing specialists to efficiently manage billing operations.
 */
export const BillingManagerPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX and SEO
  useDocumentTitle('Billing Manager')

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Manager')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  // Toolbar filter state (selected filter category IDs from the popover)
  const [toolbarSelectedFilters, setToolbarSelectedFilters] = useState<string[]>([
    'authorization_status',
    'current_billed_insurance',
  ])

  // State for billing queue management
  const [encounters, setEncounters] = useState<BillingEncounter[]>(mockBillingEncounters)
  const [filters, setFilters] = useState<FilterType>(defaultBillingFilters)
  const [activeFilterCards, setActiveFilterCards] = useState<string[]>([])
  const [selectedEncounters, setSelectedEncounters] = useState<string[]>([])
  const [showErrorDialog, setShowErrorDialog] = useState<BillingEncounter | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSort, setCurrentSort] = useState<SortOption | undefined>(undefined)
  const [viewMode] = useState<ViewMode>('card')
  const [activeTab, setActiveTab] = useState<'ready' | 'blocked' | 'with_errors' | 'pending_submit'>('ready')
  const [billingTypeFilter, setBillingTypeFilter] = useState<string>('all')
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const [overrideActionType, setOverrideActionType] = useState<'override' | 'override_and_generate'>('override')

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages based on item name
    if (itemName === 'Dashboard') {
      navigate('/old-ui-dashboard')
    } else if (itemName === 'Inbox') {
      navigate('/task-hub')
    } else if (itemName === 'Settings') {
      navigate('/settings')
    } else if (itemName === 'Schedule') {
      navigate('/my-calendar')
    } else if (itemName === 'Clients') {
      navigate('/clients')
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard')
    } else if (itemName === 'Billing') {
      navigate('/billing')
    }
    // Current page is Billing Manager, so no navigation needed for that
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
    // Search functionality can be implemented here when needed
  }

  // Persist filters in session storage for continuity
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('billing-manager-filters')
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters))
      } catch (error) {
        console.error('Error loading saved filters:', error)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('billing-manager-filters', JSON.stringify(filters))
  }, [filters])

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false)
    }
  }, [isMobile])

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Handle toolbar filter apply (categories selected from the checkbox menu)
  const handleToolbarApplyFilters = useCallback((selectedFilters: string[]) => {
    setToolbarSelectedFilters(selectedFilters)
  }, [])

  // Handle token-level filter values (applied via each token's popover)
  const handleFilterValuesChange = useCallback((values: FilterValues) => {
    console.log('Filter values changed:', values)
  }, [])

  // Handle toolbar sort change
  const handleToolbarSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    const sortFields: Record<string, string> = {
      dateOfService: 'Encounter Date',
      id: 'Encounter Id',
      patientName: 'Person Last Name',
      patientFirstName: 'Person First Name',
    }
    setCurrentSort({ field, label: sortFields[field] || field, direction })
  }, [])

  // Handle sort changes
  const handleSortChange = useCallback((sort: SortOption | undefined) => {
    setCurrentSort(sort)
  }, [])


  // Handle encounter click (navigate to encounter details)
  const handleEncounterClick = useCallback((encounter: BillingEncounter) => {
    console.log('Navigating to encounter:', encounter.id)
    // TODO: Implement navigation to encounter details page
    // navigate(`/encounters/${encounter.id}`)
  }, [])

  // Handle action button clicks
  const handleActionButtonClick = useCallback((action: string, encounterIds: string[]) => {
    console.log(`Action: ${action}, Encounters: ${encounterIds.length}`)
    
    switch (action) {
      case 'clear_selection':
        setSelectedEncounters([])
        break
      case 'generate_claims':
        console.log('Generating claims for:', encounterIds)
        // TODO: Implement claim generation
        break
      case 'generate_and_submit_claims':
        console.log('Generating and submitting claims for:', encounterIds)
        // TODO: Implement claim generation and submission
        break
      case 'check_errors':
        console.log('Checking errors for:', encounterIds)
        // TODO: Implement error checking
        break
      case 'set_bill_type':
        console.log('Setting bill type for:', encounterIds)
        // TODO: Implement bill type setting
        break
      case 'set_bill_to':
        console.log('Setting bill-to for:', encounterIds)
        // TODO: Implement bill-to setting
        break
      case 'set_professional_hcfa':
        console.log('Setting Professional HCFA for:', encounterIds)
        // TODO: Implement professional HCFA setting
        break
      case 'set_institutional_ub04':
        console.log('Setting Institutional UB04 for:', encounterIds)
        // TODO: Implement institutional UB04 setting
        break
      case 'mark_as_cleared':
        console.log('Marking as cleared:', encounterIds)
        // TODO: Implement mark as cleared
        break
      case 'override_billing':
      case 'override':
        // Show override dialog
        setOverrideActionType('override')
        setShowOverrideDialog(true)
        break
      case 'override_and_generate':
        // Show override dialog for override and generate
        setOverrideActionType('override_and_generate')
        setShowOverrideDialog(true)
        break
      case 'mark_for_rebilling':
        console.log('Marking for rebilling:', encounterIds)
        // TODO: Implement mark for rebilling
        break
      case 'remove_rebill':
        console.log('Removing rebill mark:', encounterIds)
        // TODO: Implement remove rebill
        break
      case 'apply_post_primary_rules':
        console.log('Applying post primary rules:', encounterIds)
        // TODO: Implement post primary rules
        break
      default:
        console.log('Unknown action:', action)
    }
  }, [])

  // Filter and sort encounters based on current filter criteria and sort options
  const filteredEncounters = useMemo(() => {
    let filtered = encounters.filter(encounter => {
      // Tab-based filtering
      if (activeTab === 'ready') {
        // Show only encounters that are ready to bill (no blocking errors)
        if (encounter.billingOverrideEnabled || encounter.hasErrors) {
          return false
        }
      } else if (activeTab === 'blocked') {
        // Show only encounters that are blocked from billing
        if (!encounter.hasErrors && !encounter.billingOverrideEnabled) {
          return false
        }
      }
      
      // Exclude encounters with zero balance (core billing manager requirement)
      if (encounter.totalCharges === 0 || (encounter.allowedAmount !== undefined && encounter.allowedAmount === 0)) {
        return false
      }

      // Date range filter
      const encounterDate = new Date(encounter.dateOfService)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      
      if (encounterDate < startDate || encounterDate > endDate) {
        return false
      }

      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase()
        const searchFields = [
          encounter.patientName,
          encounter.patientMrn,
          encounter.patientId,
          encounter.claimNumber || '',
          encounter.encounterType,
          encounter.provider
        ].join(' ').toLowerCase()
        
        if (!searchFields.includes(searchLower)) {
          return false
        }
      }

      // High-value filter (> $50,000)
      if (activeFilterCards.includes('high-value') && encounter.totalCharges <= 50000) {
        return false
      }

      // Payer filter
      if (filters.payers.length > 0 && !filters.payers.includes(encounter.primaryPayer)) {
        return false
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(encounter.status)) {
        return false
      }

      // Bill type filter
      if (filters.billTypes.length > 0 && !filters.billTypes.includes(encounter.billType)) {
        return false
      }

      // Error filter
      if (filters.hasErrors !== null && encounter.hasErrors !== filters.hasErrors) {
        return false
      }

      // Error type filter
      if (filters.errorTypes.length > 0) {
        const encounterErrorTypes = encounter.errors.map(e => e.type)
        if (!filters.errorTypes.some(type => encounterErrorTypes.includes(type))) {
          return false
        }
      }

      return true
    })

    // Apply sorting if currentSort is set
    if (currentSort) {
      filtered = filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (currentSort.field) {
          case 'dateOfService':
            aValue = new Date(a.dateOfService)
            bValue = new Date(b.dateOfService)
            break
          case 'id':
            aValue = a.id
            bValue = b.id
            break
          case 'patientName':
            aValue = a.patientName.split(' ').pop() || '' // Last name
            bValue = b.patientName.split(' ').pop() || ''
            break
          case 'patientFirstName':
            aValue = a.patientName.split(' ')[0] || '' // First name
            bValue = b.patientName.split(' ')[0] || ''
            break
          default:
            return 0
        }

        // Handle different data types
        if (aValue instanceof Date && bValue instanceof Date) {
          const comparison = aValue.getTime() - bValue.getTime()
          return currentSort.direction === 'asc' ? comparison : -comparison
        } else {
          const comparison = String(aValue).localeCompare(String(bValue))
          return currentSort.direction === 'asc' ? comparison : -comparison
        }
      })
    }

    return filtered
  }, [encounters, filters, activeFilterCards, refreshKey, currentSort, activeTab])

  // Handle override confirmation from dialog
  const handleOverrideConfirm = useCallback((reason: string, notes: string) => {
    const encounterIds = selectedEncounters
    
    console.log('Override confirmed:', { reason, notes, encounterIds, actionType: overrideActionType })
    
    if (overrideActionType === 'override_and_generate') {
      // Override and generate claims
      setEncounters(prev => prev.map(enc => 
        encounterIds.includes(enc.id) 
          ? { 
              ...enc, 
              billingOverrideEnabled: true, 
              hasErrors: false, 
              errors: [], 
              status: 'claim_generated',
              overrideReason: reason,
              overrideNotes: notes,
              overriddenAt: new Date().toISOString()
            }
          : enc
      ))
    } else {
      // Just override
      setEncounters(prev => prev.map(enc => 
        encounterIds.includes(enc.id) 
          ? { 
              ...enc, 
              billingOverrideEnabled: true, 
              hasErrors: false, 
              errors: [],
              overrideReason: reason,
              overrideNotes: notes,
              overriddenAt: new Date().toISOString()
            }
          : enc
      ))
    }
    
    setSelectedEncounters([])
    setShowOverrideDialog(false)
  }, [selectedEncounters, overrideActionType])

  // Handle CSV export
  const handleExportCSV = useCallback(() => {
    try {
      // Create CSV headers
      const headers = [
        'Encounter ID',
        'Patient Name',
        'Patient MRN',
        'Date of Service',
        'Encounter Type',
        'Provider',
        'Department',
        'Primary Payer',
        'Status',
        'Bill Type',
        'Total Charges',
        'Allowed Amount',
        'Patient Responsibility',
        'Insurance Amount',
        'Claim Number',
        'Submission Date',
        'Response Date',
        'Priority',
        'Has Errors',
        'Error Severity',
        'Last Modified'
      ]

      // Convert encounters to CSV rows
      const csvRows = filteredEncounters.map(encounter => [
        encounter.id,
        encounter.patientName,
        encounter.patientMrn,
        encounter.dateOfService,
        encounter.encounterType,
        encounter.provider,
        encounter.department,
        encounter.primaryPayer,
        encounter.status,
        encounter.billType,
        encounter.totalCharges.toString(),
        encounter.allowedAmount?.toString() || '',
        encounter.patientResponsibility?.toString() || '',
        encounter.insuranceAmount?.toString() || '',
        encounter.claimNumber || '',
        encounter.submissionDate || '',
        encounter.responseDate || '',
        encounter.priority,
        encounter.hasErrors.toString(),
        encounter.errorSeverity || '',
        encounter.lastModified
      ])

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `billing-queue-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Exported ${filteredEncounters.length} encounters to CSV`)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }, [filteredEncounters])

  // Get selected encounter objects
  const selectedEncounterObjects = useMemo(() => {
    return filteredEncounters.filter(e => selectedEncounters.includes(e.id))
  }, [filteredEncounters, selectedEncounters])

  // Calculate queue statistics
  const queueStats = useMemo(() => {
    return getBillingQueueStats(filteredEncounters)
  }, [filteredEncounters])

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      // Already on this page, no need to navigate
      return
    } else if (itemLabel === 'Claims & Denials') {
      navigate('/claims-denials')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    }
    // Add more navigation logic here for other sidebar items as needed
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
    // Search functionality for sidebar items
  }

  // Handle encounter selection
  const handleEncounterSelect = useCallback((encounterId: string, selected: boolean) => {
    setSelectedEncounters(prev => 
      selected 
        ? [...prev, encounterId]
        : prev.filter(id => id !== encounterId)
    )
  }, [])

  // Handle quick filter changes from filter cards
  const handleQuickFilterChange = useCallback((newFilters: Partial<FilterType>) => {
    // Clear previous filters and apply new ones (single filter mode for simplicity)
    const updatedFilters = { ...defaultBillingFilters, ...newFilters }
    
    // Handle high-value filter specially - it's not a real payer
    let cardId: string | null = null
    if (newFilters.payers?.includes('high-value' as any)) {
      updatedFilters.payers = []
      cardId = 'high-value'
    } else {
      cardId = getFilterCardId(newFilters)
    }
    
    setFilters(updatedFilters)
    
    // Update active filter cards for UI feedback
    if (cardId) {
      setActiveFilterCards([cardId]) // Single active filter for simplicity
    }
  }, [])

  // Get filter card ID from filters
  const getFilterCardId = (filterData: Partial<FilterType>): string | null => {
    if (filterData.hasErrors === true) return 'with-errors'
    if (filterData.hasErrors === false && filterData.statuses?.includes('ready_to_bill')) return 'ready-to-bill'
    if (filterData.statuses?.includes('unauthorized')) return 'unauthorized'
    if (filterData.payers?.includes('Medicare')) return 'medicare-payer'
    if (filterData.payers?.includes('Medicaid')) return 'medicaid-payer'
    if (filterData.payers?.includes('Blue Cross Blue Shield')) return 'bcbs-payer'
    if (filterData.payers?.includes('Aetna')) return 'aetna-payer'
    if (filterData.payers?.includes('UnitedHealth')) return 'unitedhealth-payer'
    if (filterData.payers?.includes('Cigna')) return 'cigna-payer'
    if (filterData.payers?.includes('EAP')) return 'eap-payer'
    if (filterData.payers?.includes('Self Pay')) return 'self-pay'
    if (filterData.dateRange) {
      const daysDiff = Math.ceil((new Date(filterData.dateRange.end).getTime() - new Date(filterData.dateRange.start).getTime()) / (1000 * 3600 * 24))
      if (daysDiff <= 35) return 'last-30-days'
      if (daysDiff <= 65) return 'last-60-days'
      if (daysDiff <= 95) return 'last-90-days'
    }
    return null
  }

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setFilters(defaultBillingFilters)
    setActiveFilterCards([])
  }, [])

  // Handle bulk actions
  const handleBulkAction = useCallback((action: BulkActionType, encounterIds: string[], options?: any) => {
    console.log(`Bulk action: ${action}`, encounterIds, options)
    
    // Simulate action processing
    setEncounters(prev => prev.map(encounter => {
      if (!encounterIds.includes(encounter.id)) return encounter
      
      switch (action) {
        case 'generate_claims':
          return {
            ...encounter,
            status: 'claim_generated' as const,
            claimNumber: `CLM${Date.now()}${Math.floor(Math.random() * 1000)}`,
            canGenerateClaim: false,
            canSubmitClaim: true,
            lastModified: new Date().toISOString()
          }
        
        case 'submit_claims':
          return {
            ...encounter,
            status: 'claim_submitted' as const,
            submissionDate: new Date().toISOString(),
            canSubmitClaim: false,
            lastModified: new Date().toISOString()
          }

        case 'mark_ready':
          return {
            ...encounter,
            status: 'ready_to_bill' as const,
            canGenerateClaim: true,
            lastModified: new Date().toISOString()
          }

        case 'assign_to_user':
          return {
            ...encounter,
            assignedTo: options?.assignedTo,
            lastModified: new Date().toISOString()
          }

        default:
          return encounter
      }
    }))

    // Trigger refresh
    setRefreshKey(prev => prev + 1)
  }, [])

  // Handle error override
  const handleOverrideError = useCallback((errorId: string, reason: string) => {
    if (!showErrorDialog) return

    setEncounters(prev => prev.map(encounter => {
      if (encounter.id !== showErrorDialog.id) return encounter

      const updatedErrors = encounter.errors.map(error => 
        error.id === errorId 
          ? {
              ...error,
              overriddenBy: 'Current User', // In real app, get from auth context
              overriddenAt: new Date().toISOString(),
              overrideReason: reason
            }
          : error
      )

      const hasActiveErrors = updatedErrors.some(e => !e.overriddenBy && e.severity === 'critical')
      const newErrorSeverity = updatedErrors
        .filter(e => !e.overriddenBy)
        .reduce<'info' | 'warning' | 'critical'>((max, e) => {
          if (max === 'critical' || e.severity === 'critical') return 'critical'
          if (max === 'warning' || e.severity === 'warning') return 'warning'
          return 'info'
        }, 'info')

      return {
        ...encounter,
        errors: updatedErrors,
        hasErrors: hasActiveErrors,
        errorSeverity: updatedErrors.some(e => !e.overriddenBy) ? newErrorSeverity : undefined,
        canGenerateClaim: !hasActiveErrors && encounter.status === 'ready_to_bill',
        lastModified: new Date().toISOString()
      }
    }))

    setRefreshKey(prev => prev + 1)
  }, [showErrorDialog])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={handleSearch}
        userInfo={{
          name: "Sarah Johnson",
          role: "front_desk",
          avatar: "/avatar.png"
        }}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Billing" // Keep billing active since this is a billing-related page
        onNavigate={handleMainNavigation}
      />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex-1 overflow-hidden bg-zinc-200 flex relative">
        {/* Desktop Billing Sidebar */}
        {!isMobile && (
          <Sidebar
            activeItem={activeSidebarItem}
            onMenuSelect={handleSidebarSelect}
            onSearch={handleSidebarSearch}
            onCollapsedChange={setSidebarCollapsed}
            defaultCollapsed={sidebarCollapsed}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            
            {/* Sidebar Panel */}
            <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 flex flex-col">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2"
                >
                  <Icon icon="times" className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeItem={activeSidebarItem}
                  onMenuSelect={(item) => {
                    handleSidebarSelect(item)
                    setMobileSidebarOpen(false) // Close sidebar after selection
                  }}
                  onSearch={handleSidebarSearch}
                  onCollapsedChange={setSidebarCollapsed}
                  defaultCollapsed={false} // Always expanded on mobile
                />
              </div>
            </div>
          </>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-zinc-100">
          <div className="h-full flex flex-col">
            {/* Header Section with Statistics */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-0.5">
              <div className="flex flex-col">
                {/* Desktop: Single Row with Title, Metrics, and Actions */}
                <div className="hidden lg:block">
                  <div className="p-1">
                    <div className="flex items-center justify-between">
                      {/* Title Section */}
                      <div className="flex-shrink-0">
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Icon icon="file-invoice-dollar" className="w-4 h-4" />
                          Billing Manager
                        </h1>
                        <div className="mt-1">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <p className="text-xs text-gray-600">Queue-based billing workflow</p>
                            {/* Active Filters Display */}
                            {activeFilterCards.length > 0 && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500 font-medium">Filters:</span>
                                {activeFilterCards.map((card, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200 shadow-sm"
                                  >
                                    <span>{card}</span>
                                    <button
                                      onClick={() => {
                                        const newCards = activeFilterCards.filter((_, i) => i !== index);
                                        setActiveFilterCards(newCards);
                                        if (newCards.length === 0) {
                                          setFilters(defaultBillingFilters);
                                        }
                                      }}
                                      className="hover:bg-blue-200 rounded-sm p-0.5 transition-colors"
                                    >
                                      <Icon icon="times" className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                                <button
                                  onClick={() => {
                                    setActiveFilterCards([]);
                                    setFilters(defaultBillingFilters);
                                  }}
                                  className="text-xs text-gray-500 hover:text-gray-700 px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors"
                                >
                                  Clear all
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics Section - Desktop Inline - Hidden for now */}
                      <div className="hidden items-center gap-2 mx-4">
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setFilters(defaultBillingFilters);
                                setActiveFilterCards([]);
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="users" className="w-4 h-4 flex-shrink-0 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.totalEncounters}</span>
                              <span className="text-xs text-gray-600">Total</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total encounters in billing queue</p>
                          </TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                handleQuickFilterChange({ statuses: ['ready_to_bill'], hasErrors: false });
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="check-circle" className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.readyToBill}</span>
                              <span className="text-xs text-gray-600">Ready to Bill</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Encounters ready for billing with no errors</p>
                          </TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                handleQuickFilterChange({ hasErrors: true });
                              }}
                              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all duration-200 bg-gray-25 text-gray-700 hover:bg-gray-50 border border-gray-100"
                            >
                              <Icon icon="exclamation-triangle" className="w-4 h-4 flex-shrink-0 text-orange-600" />
                              <span className="text-sm font-semibold text-gray-800">{queueStats.withErrors}</span>
                              <span className="text-xs text-gray-600">Need Attention</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Encounters with errors requiring review</p>
                          </TooltipContent>
                        </TooltipRoot>

                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet: Stacked Layout */}
                <div className="lg:hidden">
                  <div className="overflow-hidden">
                    {/* Top Row - Title and Actions */}
                    <div className={`flex items-center justify-between p-4 sm:p-5 ${showMetrics ? "border-b border-gray-100" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          {/* Mobile Hamburger Menu */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMobileSidebarToggle}
                            className="p-2"
                          >
                            <Icon icon="bars" className="w-5 h-5" />
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex items-center gap-2">
                              <Icon icon="dollar-sign" className="w-5 h-5" />
                              Billing Manager
                            </h1>
                            <div className="mt-0.5">
                              <div className="flex items-center gap-2 flex-wrap justify-center">
                                <p className="text-xs sm:text-sm text-gray-600">Queue-based billing workflow</p>
                                {/* Active Filters Display - Mobile */}
                                {activeFilterCards.length > 0 && (
                                  <>
                                    <span className="text-xs text-gray-500 hidden sm:inline">•</span>
                                    <span className="text-xs text-gray-500 font-medium">Filters:</span>
                                    {activeFilterCards.slice(0, 2).map((card, index) => (
                                      <span 
                                        key={index}
                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200 shadow-sm"
                                      >
                                        <span>{card}</span>
                                        <button
                                          onClick={() => {
                                            const newCards = activeFilterCards.filter((_, i) => i !== index);
                                            setActiveFilterCards(newCards);
                                            if (newCards.length === 0) {
                                              setFilters(defaultBillingFilters);
                                            }
                                          }}
                                          className="hover:bg-blue-200 rounded-sm p-0.5 transition-colors"
                                        >
                                          <Icon icon="times" className="w-2.5 h-2.5" />
                                        </button>
                                      </span>
                                    ))}
                                    {activeFilterCards.length > 2 && (
                                      <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded-md">
                                        +{activeFilterCards.length - 2}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => {
                                        setActiveFilterCards([]);
                                        setFilters(defaultBillingFilters);
                                      }}
                                      className="text-xs text-gray-500 hover:text-gray-700 px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      Clear all
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Metrics Toggle Button - Mobile Only */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMetrics(!showMetrics)}
                            className="flex items-center gap-1.5 text-xs px-2 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Icon icon="chart-bar" className="w-4 h-4" />
                            <span className="hidden sm:inline">Metrics</span>
                            <Icon icon="chevron-down" className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetrics ? "rotate-180" : ""}`} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Mobile Friendly */}
                      <div className="flex gap-2 ml-3">
                        {/* Info icon with tooltip for Refresh button */}
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button className="flex items-center justify-center w-9 h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                              <Icon icon="info-circle" className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>The Refresh Button updates the billing queue with the latest encounter data and claim statuses</p>
                          </TooltipContent>
                        </TooltipRoot>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRefreshKey(prev => prev + 1)}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 min-h-[36px]"
                        >
                          <Icon icon="sync" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Refresh</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/billing-reports')}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 min-h-[36px]"
                        >
                          <Icon icon="chart-bar" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reports</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/invoice-manager')}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 min-h-[36px]"
                        >
                          <Icon icon="file-invoice" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Invoice Manager</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/encounter-details')}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 min-h-[36px]"
                        >
                          <Icon icon="file-medical" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Encounter Details</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportCSV}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 min-h-[36px]"
                        >
                          <Icon icon="download" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Mobile Metrics Section - Collapsible */}
                    {showMetrics && (
                      <div className="p-3 sm:p-5 animate-in slide-in-from-top-2 duration-200 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  setFilters(defaultBillingFilters);
                                  setActiveFilterCards([]);
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-blue-50 border-blue-200 hover:bg-blue-100"
                              >
                                <Icon icon="users" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-blue-700">{queueStats.totalEncounters}</span>
                                <span className="text-xs text-blue-600">Total</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total encounters in billing queue</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  handleQuickFilterChange({ statuses: ['ready_to_bill'], hasErrors: false });
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-green-50 border-green-200 hover:bg-green-100"
                              >
                                <Icon icon="check-circle" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-green-700">{queueStats.readyToBill}</span>
                                <span className="text-xs text-green-600">Ready</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Encounters ready for billing with no errors</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  handleQuickFilterChange({ hasErrors: true });
                                }}
                                className="flex items-center gap-2 rounded-full px-3 py-2 border transition-all duration-200 hover:shadow-md min-h-[40px] bg-red-50 border-red-200 hover:bg-red-100"
                              >
                                <Icon icon="exclamation-triangle" className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-semibold text-red-700">{queueStats.withErrors}</span>
                                <span className="text-xs text-red-600">Errors</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Encounters with errors requiring review</p>
                            </TooltipContent>
                          </TooltipRoot>
                          
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="flex-1 overflow-hidden">
              {/* Desktop: Full-width Layout with Horizontal Toolbar */}
              {!isMobile ? (
                <div className="flex flex-col h-full bg-zinc-100">
                  {/* Horizontal Filter Toolbar + Action Buttons */}
                  <div className="bg-white border-b border-gray-200">
                    <BillingFilterToolbar
                      searchQuery={filters.searchQuery}
                      onSearchChange={(query) =>
                        setFilters(prev => ({ ...prev, searchQuery: query }))
                      }
                      onApplyFilters={handleToolbarApplyFilters}
                      onFilterValuesChange={handleFilterValuesChange}
                      onClearFilters={handleClearAllFilters}
                      onSortChange={handleToolbarSortChange}
                      currentSort={
                        currentSort
                          ? { field: currentSort.field, direction: currentSort.direction }
                          : undefined
                      }
                    >
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <button className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                            <Icon icon="info-circle" className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The Refresh Button updates the billing queue with the latest encounter data and claim statuses</p>
                        </TooltipContent>
                      </TooltipRoot>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        className="flex items-center gap-1.5 text-xs px-3 py-2"
                      >
                        <Icon icon="sync" className="w-3.5 h-3.5" />
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/billing-reports')}
                        className="flex items-center gap-1.5 text-xs px-3 py-2"
                      >
                        <Icon icon="chart-bar" className="w-3.5 h-3.5" />
                        Reports
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/invoice-manager')}
                        className="flex items-center gap-1.5 text-xs px-3 py-2"
                      >
                        <Icon icon="file-invoice" className="w-3.5 h-3.5" />
                        Invoice Manager
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/encounter-details')}
                        className="flex items-center gap-1.5 text-xs px-3 py-2"
                      >
                        <Icon icon="file-medical" className="w-3.5 h-3.5" />
                        Encounter Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 text-xs px-3 py-2"
                      >
                        <Icon icon="download" className="w-3.5 h-3.5" />
                        Export
                      </Button>
                    </BillingFilterToolbar>
                  </div>

                  {/* Merged Tab Bar: Select All + Tabs + Billing Type */}
                  <div className="bg-white border-b border-gray-200">
                    <div className="flex items-center px-4 py-2 gap-4">
                      {/* Left: Select All */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={filteredEncounters.length > 0 && selectedEncounters.length === filteredEncounters.length}
                          ref={(input) => {
                            if (input) {
                              const allSelected = filteredEncounters.length > 0 && selectedEncounters.length === filteredEncounters.length
                              const someSelected = selectedEncounters.length > 0 && !allSelected
                              input.indeterminate = someSelected
                            }
                          }}
                          onChange={() => {
                            const allSelected = filteredEncounters.every(enc => selectedEncounters.includes(enc.id))
                            if (allSelected) {
                              filteredEncounters.forEach(enc => handleEncounterSelect(enc.id, false))
                            } else {
                              filteredEncounters.forEach(enc => {
                                if (!selectedEncounters.includes(enc.id)) {
                                  handleEncounterSelect(enc.id, true)
                                }
                              })
                            }
                          }}
                          className="w-4 h-4 accent-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {selectedEncounters.length === filteredEncounters.length && filteredEncounters.length > 0
                            ? 'All'
                            : selectedEncounters.length > 0
                            ? `${selectedEncounters.length}`
                            : 'All'}
                        </span>
                      </div>

                      {/* Center: Tabs */}
                      <div className="flex-1 min-w-0">
                        <Tabs
                          value={activeTab}
                          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                          className="w-full"
                        >
                          <TabsList className="h-9 items-center justify-center rounded-lg p-1 text-muted-foreground grid w-full max-w-2xl grid-cols-4 bg-gray-100">
                            <TabsTrigger
                              value="ready"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                            >
                              Ready to Bill ({encounters.filter(e => e.status === 'ready_to_bill' && !e.hasErrors).length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="blocked"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                            >
                              Blocked ({encounters.filter(e => e.hasErrors && e.errorSeverity === 'critical').length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="with_errors"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                            >
                              With Errors ({encounters.filter(e => e.hasErrors).length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="pending_submit"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                            >
                              Pending Submit ({encounters.filter(e => e.status === 'in_review' || e.status === 'authorized').length})
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>

                      {/* Right: Billing Type dropdown */}
                      <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">Billing Type:</span>
                        <Select value={billingTypeFilter} onValueChange={setBillingTypeFilter}>
                          <SelectTrigger className="w-[160px] h-8 text-sm">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types ({encounters.length})</SelectItem>
                            <SelectItem value="hcfa">HCFA ({encounters.filter(e => e.billType === 'professional' || e.hcfaBillType?.includes('HCFA')).length})</SelectItem>
                            <SelectItem value="ub04">UB-04 ({encounters.filter(e => e.billType === 'institutional' || e.hcfaBillType?.includes('UB-04')).length})</SelectItem>
                            <SelectItem value="not_set">Not Set ({encounters.filter(e => !e.billType && !e.hcfaBillType).length})</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Action Buttons — only visible when encounters are selected */}
                  {selectedEncounterObjects.length > 0 && (
                    <BillingActionButtons
                      selectedEncounters={selectedEncounterObjects}
                      onAction={handleActionButtonClick}
                    />
                  )}

                  {/* Queue Table or Card View */}
                  <div className="flex-1 p-4 overflow-hidden">
                    {viewMode === 'grid' ? (
                      <BillingQueueTable
                        encounters={filteredEncounters}
                        onEncounterSelect={handleEncounterSelect}
                        onEncounterEdit={(encounter) => console.log('Edit encounter:', encounter)}
                        onEncounterClick={handleEncounterClick}
                        onGenerateClaim={(encounter) => handleBulkAction('generate_claims', [encounter.id])}
                        onViewErrors={setShowErrorDialog}
                        onBillingOverrideToggle={(encounterId, enabled) => console.log('Toggle override:', encounterId, enabled)}
                        onHcfaBillTypeChange={(encounterId, billType) => console.log('Change bill type:', encounterId, billType)}
                        onPrimaryPayerChange={(encounterId, primaryPayer) => console.log('Change primary payer:', encounterId, primaryPayer)}
                        selectedEncounters={selectedEncounters}
                        className="h-full"
                      />
                    ) : (
                      <BillingViewCardsListing
                        encounters={filteredEncounters}
                        selectedEncounters={selectedEncounters}
                        onEncounterSelect={handleEncounterSelect}
                        onEncounterClick={handleEncounterClick}
                        className="h-full"
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Mobile: Vertical Layout */
                <div className="flex flex-col h-full bg-zinc-100">
                  {/* Mobile Horizontal Filter Toolbar */}
                  <div className="bg-white border-b border-gray-200">
                    <BillingFilterToolbar
                      searchQuery={filters.searchQuery}
                      onSearchChange={(query) =>
                        setFilters(prev => ({ ...prev, searchQuery: query }))
                      }
                      onApplyFilters={handleToolbarApplyFilters}
                      onFilterValuesChange={handleFilterValuesChange}
                      onClearFilters={handleClearAllFilters}
                      onSortChange={handleToolbarSortChange}
                      currentSort={
                        currentSort
                          ? { field: currentSort.field, direction: currentSort.direction }
                          : undefined
                      }
                    />
                  </div>

                  {/* Mobile Tab Bar - Queue Type Selection */}
                  <div className="bg-white border-b border-gray-200">
                    <div className="px-3 py-2">
                      <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                        className="w-full"
                      >
                        <TabsList className="h-10 items-center justify-center rounded-lg p-1 text-muted-foreground grid w-full grid-cols-2 bg-gray-100">
                          <TabsTrigger
                            value="ready"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                          >
                            Ready to Bill
                          </TabsTrigger>
                          <TabsTrigger
                            value="blocked"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                          >
                            Blocked
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  {/* Mobile Action Buttons Section */}
                  <div className="p-3 bg-zinc-100 border-b border-gray-200">
                    <BillingActionButtons
                      selectedEncounters={selectedEncounterObjects}
                      onAction={handleActionButtonClick}
                    />
                  </div>

                  {/* Mobile Table Section */}
                  <div className="flex-1 p-3 overflow-hidden">
                    <BillingQueueTable
                      encounters={filteredEncounters}
                      onEncounterSelect={handleEncounterSelect}
                      onEncounterEdit={(encounter) => console.log('Edit encounter:', encounter)}
                      onEncounterClick={handleEncounterClick}
                      onGenerateClaim={(encounter) => handleBulkAction('generate_claims', [encounter.id])}
                      onViewErrors={setShowErrorDialog}
                      onBillingOverrideToggle={(encounterId, enabled) => console.log('Toggle override:', encounterId, enabled)}
                      onHcfaBillTypeChange={(encounterId, billType) => console.log('Change bill type:', encounterId, billType)}
                      onPrimaryPayerChange={(encounterId, primaryPayer) => console.log('Change primary payer:', encounterId, primaryPayer)}
                      selectedEncounters={selectedEncounters}
                      className="h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      {showErrorDialog && (
        <BillingErrorDialog
          encounter={showErrorDialog}
          isOpen={!!showErrorDialog}
          onClose={() => setShowErrorDialog(null)}
          onOverrideError={handleOverrideError}
          canOverride={true} // In real app, check user permissions
        />
      )}

      {/* Override Dialog */}
      <OverrideDialog
        open={showOverrideDialog}
        onClose={() => setShowOverrideDialog(false)}
        encounters={selectedEncounterObjects}
        onConfirm={handleOverrideConfirm}
        actionType={overrideActionType}
      />
      </div>
    </TooltipProvider>
  )
}

export default BillingManagerPage
