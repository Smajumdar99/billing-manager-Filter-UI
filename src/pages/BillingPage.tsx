import { FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Button } from '@/components/atoms/Button/button'
import { BillingStatCard } from '@/components/atoms/BillingStatCard/billing-stat-card'
import { BillingCardBlocks } from '@/components/organisms/BillingCardBlocks/BillingCardBlocks'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TeamBillingWorkloadWidget } from '@/components/widgets/TeamBillingWorkloadWidget'
import { UnbilledEncountersWidget } from '@/components/widgets/UnbilledEncountersWidget'
import { BillingOverviewWidget } from '@/components/widgets/BillingOverviewWidget'
import { ClaimsAcceptanceWidget } from '@/components/widgets/ClaimsAcceptanceWidget'
import { ClaimsStatusRecommendationsWidget } from '@/components/widgets/ClaimsStatusRecommendationsWidget'
import { AccountsReceivableWidget } from '@/components/widgets/AccountsReceivableWidget'
import { ClaimsDenialsVsPaidWidget } from '@/components/widgets/ClaimsDenialsVsPaidWidget'
import { ClaimsOverviewByStatusWidget } from '@/components/widgets/ClaimsOverviewByStatusWidget'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'

// Billing data types for proper structure
interface BillingInvoice {
  id: string
  patientName: string
  patientId: string
  invoiceNumber: string
  dateOfService: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'cancelled'
  paymentMethod: string
  insuranceProvider?: string
  balanceOwed: number
  lastPaymentDate?: string
}

// Mock billing data for demonstration
const mockBillingData: BillingInvoice[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'PAT001',
    invoiceNumber: 'INV-2024-001',
    dateOfService: '2024-01-15',
    amount: 250.00,
    status: 'paid',
    paymentMethod: 'Insurance + Copay',
    insuranceProvider: 'Blue Cross Blue Shield',
    balanceOwed: 0,
    lastPaymentDate: '2024-01-20'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientId: 'PAT002',
    invoiceNumber: 'INV-2024-002',
    dateOfService: '2024-01-18',
    amount: 180.00,
    status: 'pending',
    paymentMethod: 'Self Pay',
    balanceOwed: 180.00
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    patientId: 'PAT003',
    invoiceNumber: 'INV-2024-003',
    dateOfService: '2024-01-10',
    amount: 320.00,
    status: 'overdue',
    paymentMethod: 'Insurance',
    insuranceProvider: 'Aetna',
    balanceOwed: 320.00
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    patientId: 'PAT004',
    invoiceNumber: 'INV-2024-004',
    dateOfService: '2024-01-22',
    amount: 95.00,
    status: 'paid',
    paymentMethod: 'Credit Card',
    balanceOwed: 0,
    lastPaymentDate: '2024-01-22'
  },
  {
    id: '5',
    patientName: 'David Wilson',
    patientId: 'PAT005',
    invoiceNumber: 'INV-2024-005',
    dateOfService: '2024-01-25',
    amount: 440.00,
    status: 'draft',
    paymentMethod: 'Insurance',
    insuranceProvider: 'Medicare',
    balanceOwed: 440.00
  }
]

// Billing Pipeline Data for Manager Overview
interface BillingPipelineData {
  totalEncounters: number
  billedEncounters: number
  unbilledEncounters: number
  billedAmount: number
  unbilledAmount: number
  paymentsReceived: number
  paymentsOutstanding: number
  totalClaims: number
  submittedClaims: number
  pendingClaims: number
  billingBlockers: {
    missingInsurance: number
    missingDocumentation: number
    authorizationPending: number
    codingIncomplete: number
    other: number
  }
}

// Mock billing pipeline data
const mockBillingPipelineData: BillingPipelineData = {
  totalEncounters: 1247,
  billedEncounters: 892,
  unbilledEncounters: 355,
  billedAmount: 234750.00,
  unbilledAmount: 89250.00,
  paymentsReceived: 187600.00,
  paymentsOutstanding: 47150.00,
  totalClaims: 1089,
  submittedClaims: 756,
  pendingClaims: 333,
  billingBlockers: {
    missingInsurance: 127,
    missingDocumentation: 98,
    authorizationPending: 76,
    codingIncomplete: 42,
    other: 12
  } // Total: 355 (matches unbilledEncounters)
}


/**
 * BillingPage Component
 * 
 * Comprehensive billing dashboard with multiple widget views, data table, filtering, and management features.
 * Includes all 8 billing widget types with tabbed interface for easy navigation.
 * Follows atomic design principles and uses AG Grid for data display.
 * Responsive design with mobile and desktop views.
 */
export const BillingPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX
  useDocumentTitle('Billing Dashboard')

  // State management for search
  const [searchQuery, setSearchQuery] = useState('')
  
  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // State for selected billing card block
  const [selectedBillingBlock, setSelectedBillingBlock] = useState<string | null>(null)

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages
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
    }
    // Billing is current page, so no navigation needed
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
    setSearchQuery(searchTerm)
  }

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    }
    // Add more navigation logic here for other sidebar items as needed
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
    // Search functionality for sidebar items
  }

  // Handle billing card block selection
  const handleBillingBlockClick = (blockId: string) => {
    console.log(`Billing block clicked: ${blockId}`)
    setSelectedBillingBlock(blockId)
    // Here you could navigate to specific views or filter data based on the selected block
  }

  // Filter billing data based on search
  const filteredBillingData = useMemo(() => {
    return mockBillingData.filter(invoice => {
      const matchesSearch = !searchQuery || 
        invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })
  }, [searchQuery])

  // Calculate summary statistics
  const billingStats = useMemo(() => {
    const totalRevenue = filteredBillingData.reduce((sum, invoice) => sum + invoice.amount, 0)
    const totalOwed = filteredBillingData.reduce((sum, invoice) => sum + invoice.balanceOwed, 0)
    const paidInvoices = filteredBillingData.filter(invoice => invoice.status === 'paid').length
    const overdueInvoices = filteredBillingData.filter(invoice => invoice.status === 'overdue').length
    
    return {
      totalRevenue,
      totalOwed,
      paidInvoices,
      overdueInvoices,
      totalInvoices: filteredBillingData.length
    }
  }, [filteredBillingData])


  return (
    <div className="flex flex-col h-screen bg-white">
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
        activeItem="Billing"
        onNavigate={handleMainNavigation}
      />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex-1 bg-gray-50 flex overflow-auto">
        {/* Billing Sidebar */}
        <Sidebar
          activeItem={activeSidebarItem}
          onMenuSelect={handleSidebarSelect}
          onSearch={handleSidebarSearch}
          onCollapsedChange={setSidebarCollapsed}
          defaultCollapsed={sidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="min-h-full flex flex-col">
          {/* Header Section with Tabs and Actions */}
          <Tabs defaultValue="dashboard" className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Tab Navigation */}
                <div>
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
                    <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
                    <TabsTrigger value="encounter-metrics" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Encounter Metrics</TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FontAwesomeIcon icon="download" className="w-4 h-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FontAwesomeIcon icon="file-alt" className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button size="sm" className="gap-2">
                    <FontAwesomeIcon icon="plus" className="w-4 h-4" />
                    New Invoice
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Tab Content */}
            <TabsContent value="dashboard" className="flex-1 mt-0">
              {/* Billing Manager Overview - Apple Style */}
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Pipeline Overview */}
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* 1. How many encounters are there? */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon="eye" className="w-3 h-3 text-gray-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{mockBillingPipelineData.totalEncounters.toLocaleString()}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Encounters</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{mockBillingPipelineData.billedEncounters} Billed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{mockBillingPipelineData.unbilledEncounters} Not Billed</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. How much has been billed? */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon="check-circle" className="w-3 h-3 text-emerald-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">${mockBillingPipelineData.billedAmount.toLocaleString()}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Amount Billed</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon="check" className="w-3 h-3" />
                        Submitted
                      </span>
                      <span className="text-xs text-gray-600 font-medium">{mockBillingPipelineData.billedEncounters} encounters</span>
                    </div>
                  </div>

                  {/* 3. How much has NOT been billed? */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon="clock" className="w-3 h-3 text-orange-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">${mockBillingPipelineData.unbilledAmount.toLocaleString()}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Not Yet Billed</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon="clock" className="w-3 h-3" />
                        Pending
                      </span>
                      <span className="text-xs text-gray-600 font-medium">{mockBillingPipelineData.unbilledEncounters} encounters</span>
                    </div>
                  </div>

                  {/* 4. For billed claims - have we received payments? */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon="dollar-sign" className="w-3 h-3 text-blue-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">${mockBillingPipelineData.paymentsReceived.toLocaleString()}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Payments Received</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon="money-bill-wave" className="w-3 h-3" />
                        Collected
                      </span>
                      <span className="text-xs text-red-600 font-medium">${mockBillingPipelineData.paymentsOutstanding.toLocaleString()} Outstanding</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Billing Blockers - Apple Style */}
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Billing Queue Issues</h3>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 pb-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon="exclamation-triangle" className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Active Blockers</p>
                        <p className="text-xs text-gray-500">355 encounters need attention</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.values(mockBillingPipelineData.billingBlockers).reduce((sum, count) => sum + count, 0)}
                    </p>
                  </div>
                  
                  {/* Blockers Breakdown - Apple Style */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">Insurance</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{mockBillingPipelineData.billingBlockers.missingInsurance}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">Documentation</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{mockBillingPipelineData.billingBlockers.missingDocumentation}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">Authorization</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{mockBillingPipelineData.billingBlockers.authorizationPending}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">Coding</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{mockBillingPipelineData.billingBlockers.codingIncomplete}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Widgets Section */}
          <div className="px-4 sm:px-6 py-6 bg-gradient-to-br from-blue-100 to-zinc-200">
            {/* First Row - 2x2 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
              <TeamBillingWorkloadWidget />
              <UnbilledEncountersWidget />
              <BillingOverviewWidget />
              <ClaimsAcceptanceWidget />
            </div>
            
            {/* Full Width Claims Status Recommendations Widget */}
            <div className="w-full mb-6">
              <ClaimsStatusRecommendationsWidget />
            </div>
            
            {/* Second Row - New Widgets (After Claims Status) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AccountsReceivableWidget />
              <ClaimsDenialsVsPaidWidget />
              <ClaimsOverviewByStatusWidget />
            </div>
          </div>
            </TabsContent>

            {/* Encounter Metrics Tab Content */}
            <TabsContent value="encounter-metrics" className="flex-1 mt-0">
              {/* Filters Section */}
              <div className="px-4 sm:px-6 py-4 bg-zinc-50 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Side - Date Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon="calendar-alt" className="w-4 h-4 text-primary" />
                    </div>
                    
                    {/* Quick Date Filters */}
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-primary transition-colors">
                        Today
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white border border-primary rounded-lg hover:brightness-110 transition-colors">
                        This Week
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-primary transition-colors">
                        This Month
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-primary transition-colors">
                        Last 30 Days
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Custom Date Range & Status Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Custom Date Range */}
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        defaultValue="2024-09-01"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="date"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        defaultValue="2024-09-28"
                      />
                    </div>

                    {/* Status Filter using Select component */}
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="printed">Printed</SelectItem>
                        <SelectItem value="resubmitted">Re-submitted</SelectItem>
                        <SelectItem value="updated">Updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters Display */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-600">Active filters:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    This Week
                    <button className="hover:bg-blue-200 rounded-full p-0.5">
                      <FontAwesomeIcon icon="times" className="w-2 h-2" />
                    </button>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    All Status
                    <button className="hover:bg-blue-200 rounded-full p-0.5">
                      <FontAwesomeIcon icon="times" className="w-2 h-2" />
                    </button>
                  </span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 underline">
                    Clear all
                  </button>
                </div>
              </div>

              {/* Billing Card Blocks Section */}
              <div className="px-4 sm:px-6 py-6 bg-white">
                <BillingCardBlocks 
                  onBlockClick={handleBillingBlockClick}
                  selectedBlockId={selectedBillingBlock}
                />
              </div>
            </TabsContent>
          </Tabs>

        </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage 