import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Filter, Search, ChevronDown, Download, Plus } from 'lucide-react'
import { Input } from '@/components/atoms/Input/input'
import { Checkbox } from '@/components/atoms/Checkbox/checkbox'
import { Label } from '@/components/atoms/Label/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/Popover/popover'
import { DataTable } from '@/components/organisms/DataTable'
import type { ColDef, ColumnMenuTab } from 'ag-grid-community'
import './claims-denials-ag-grid.css'

/**
 * ClaimsDenialsPage Component
 * 
 * Unified claims and denials management interface.
 * Combines claims processing and denials management workflows.
 */
export const ClaimsDenialsPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX and SEO
  useDocumentTitle('Claims & Denials')

  // State for sidebar navigation and UI
  const [activeSidebarItem, setActiveSidebarItem] = useState('Claims & Denials')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'claims' | 'denials'>('claims')
  const [payersPopoverOpen, setPayersPopoverOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [selectedPayers, setSelectedPayers] = useState<string[]>([])
  
  // Available payers for filter
  const payers = [
    'Medicare',
    'Medicaid',
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'UnitedHealthcare',
    'Tricare',
    'Other'
  ]

  interface DeniedClaimRecord {
    claimId: string
    claimStatus: string
    rejectedOn: string
    pid: string
    clientName: string
    insurance: string
    encounters: string
    settlementStatus: string
    remarkCodes: string
    payer: string
  }

  const deniedClaims = useMemo<DeniedClaimRecord[]>(
    () => [
      {
        claimId: 'P-1005303-1008242202(TEST)',
        claimStatus: 'Rejected',
        rejectedOn: '11/27/2025',
        pid: '1005303',
        clientName: 'ALERTS, GOOGLE',
        insurance: 'VALUE OPTIONS',
        encounters: '11/27/2025 (100219084)',
        settlementStatus: '',
        remarkCodes: '',
        payer: 'Other'
      },
      {
        claimId: 'P-1005311-1008242399(TEST)',
        claimStatus: 'Rejected',
        rejectedOn: '11/19/2025',
        pid: '1005311',
        clientName: 'DOE, JANE',
        insurance: 'Blue Cross Blue Shield',
        encounters: '11/19/2025 (100218772)',
        settlementStatus: '',
        remarkCodes: 'CO-16',
        payer: 'Blue Cross Blue Shield'
      }
    ],
    []
  )

  const deniedClaimsColumnDefs = useMemo<ColDef<DeniedClaimRecord>[]>(
    () => [
      {
        headerName: '',
        colId: 'selection',
        width: 48,
        minWidth: 48,
        maxWidth: 48,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: 'left',
        sortable: false,
        filter: false,
        resizable: false,
        flex: 0,
        menuTabs: [] as ColumnMenuTab[],
        suppressMenu: true,
        cellClass: 'claims-denials-selection-col',
        headerClass: 'claims-denials-selection-col',
        cellStyle: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' }
      },
      {
        headerName: 'Claim ID',
        field: 'claimId',
        minWidth: 240,
        pinned: 'left',
        cellRenderer: (params: any) => (
          <button
            type="button"
            onClick={() => console.log('Open claim', params.value)}
            className="text-left"
          >
            {params.value}
          </button>
        )
      },
      {
        headerName: 'Claim Status',
        field: 'claimStatus',
        minWidth: 220,
        cellRenderer: (params: any) => (
          <div>
            <div>
              {params.data.claimStatus} on {params.data.rejectedOn}{' '}
              <button
                type="button"
                onClick={() => console.log('View history', params.data.claimId)}
              >
                (History)
              </button>
            </div>
          </div>
        )
      },
      {
        headerName: 'PID',
        field: 'pid',
        width: 110
      },
      {
        headerName: 'Client Name',
        field: 'clientName',
        minWidth: 180
      },
      {
        headerName: 'Insurance',
        field: 'insurance',
        minWidth: 160
      },
      {
        headerName: 'Encounter(s)',
        field: 'encounters',
        minWidth: 200
      },
      {
        headerName: 'Settlement Status',
        field: 'settlementStatus',
        minWidth: 150
      },
      {
        headerName: 'Remark Codes',
        field: 'remarkCodes',
        minWidth: 140
      }
    ],
    []
  )

  const filteredDeniedClaims = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return deniedClaims.filter((row) => {
      const matchesQuery =
        query.length === 0 ||
        row.claimId.toLowerCase().includes(query) ||
        row.pid.toLowerCase().includes(query) ||
        row.clientName.toLowerCase().includes(query) ||
        row.insurance.toLowerCase().includes(query) ||
        row.encounters.toLowerCase().includes(query)

      const matchesPayer = selectedPayers.length === 0 || selectedPayers.includes(row.payer)
      const matchesStatus = statusFilter === 'all' || statusFilter === 'denied'

      return matchesQuery && matchesPayer && matchesStatus
    })
  }, [deniedClaims, searchQuery, selectedPayers, statusFilter])

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
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  // Handle sidebar menu selection
  const handleMenuSelect = (itemLabel: string) => {
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'Claims & Denials') {
      navigate('/claims-denials')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Fee Sheet') {
      navigate('/fee-sheet')
    }
  }

  // Toggle payer selection
  const togglePayer = (payer: string) => {
    setSelectedPayers(prev => 
      prev.includes(payer) 
        ? prev.filter(p => p !== payer) 
        : [...prev, payer]
    )
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    if (value !== 'custom') {
      setCustomStartDate('')
      setCustomEndDate('')
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all')
    setDateRange('30')
    setCustomStartDate('')
    setCustomEndDate('')
    setSelectedPayers([])
    setSearchQuery('')
  }

  const handleApplyFilters = () => {
    setPayersPopoverOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigationBar
        hospitalName="Behavioral Health Clinic"
        onSearch={handleSearch}
        userAvatarUrl="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff"
        userInfo={{
          name: "Sarah Johnson",
          role: "Billing Manager",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff"
        }}
      />

      {/* Main Navigation */}
      <MainNavigationBar
        activeItem="Billing"
        onNavigate={handleMainNavigation}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeItem={activeSidebarItem}
          onMenuSelect={handleMenuSelect}
          onSearch={handleSearch}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Page Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header with Tabs */}
          <div className="border-b border-gray-200 bg-white shrink-0">
            <div className="flex min-h-[48px] items-center justify-between px-6 py-2">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900">Claims & Denials</h1>
                <div className="flex items-center rounded-md bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab('claims')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'claims' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Claims
                  </button>
                  <button
                    onClick={() => setActiveTab('denials')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'denials' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Denials
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="flex h-7 items-center justify-center">
                  <Download className="h-4 w-4 mr-2 shrink-0" aria-hidden />
                  <span>Export</span>
                </Button>
                <Button variant="default" size="sm" className="flex h-7 items-center justify-center">
                  <Plus className="h-4 w-4 mr-2 shrink-0" aria-hidden />
                  <span>New Claim</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full flex-1 min-h-0 px-4 pb-4 pt-3">
            {/* Horizontal filter bar */}
            <div className="flex flex-wrap items-center gap-3 w-full mb-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="relative w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search claims..."
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-9 text-sm shrink-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="appealed">Appealed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-[160px] h-9 text-sm shrink-0">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === 'custom' && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  <input
                    type="date"
                    aria-label="Start date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="h-9 px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-500">to</span>
                  <input
                    type="date"
                    aria-label="End date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="h-9 px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <Popover open={payersPopoverOpen} onOpenChange={setPayersPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 text-sm shrink-0"
                  >
                    Payers
                    {selectedPayers.length > 0 ? (
                      <span className="text-slate-500">({selectedPayers.length})</span>
                    ) : null}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-72 p-3">
                  <p className="text-xs font-medium text-slate-700 mb-2">Select payers</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {payers.map((payer) => (
                      <div key={payer} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payer-popover-${payer}`}
                          checked={selectedPayers.includes(payer)}
                          onCheckedChange={() => togglePayer(payer)}
                        />
                        <Label htmlFor={`payer-popover-${payer}`} className="text-sm font-normal cursor-pointer">
                          {payer}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="ml-auto flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    clearFilters()
                    setPayersPopoverOpen(false)
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded-md transition-colors"
                >
                  Clear
                </button>
                <Button variant="default" size="sm" className="h-9 text-sm" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Main content — full width */}
            <div className="flex-1 overflow-auto w-full min-h-0">
              {activeTab === 'claims' ? (
                <div className="w-full">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Claims</h2>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-gray-500">No claims found. Create a new claim to get started.</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Denials</h2>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">
                        Showing {filteredDeniedClaims.length} denied claim{filteredDeniedClaims.length === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div className="p-4">
                      <DataTable
                        className="claims-denials-ag-grid"
                        rowData={filteredDeniedClaims}
                        columnDefs={deniedClaimsColumnDefs}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button 
            size="lg" 
            className="rounded-full shadow-lg h-14 w-14"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Mobile Filters Panel */}
      {isMobile && mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close filters</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search claims..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="appealed">Appealed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                {dateRange === 'custom' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in slide-in-from-left-2 duration-200">
                    <input
                      type="date"
                      aria-label="Start date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="h-9 px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-500">to</span>
                    <input
                      type="date"
                      aria-label="End date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="h-9 px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Payers */}
              <div className="space-y-2">
                <Label>Payers</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {payers.map((payer) => (
                    <div key={payer} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-payer-${payer}`} 
                        checked={selectedPayers.includes(payer)}
                        onCheckedChange={() => togglePayer(payer)}
                      />
                      <Label htmlFor={`mobile-payer-${payer}`} className="text-sm font-normal">
                        {payer}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimsDenialsPage
