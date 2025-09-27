import { FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { DataTable } from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/Button/button'
import { Badge } from '@/components/atoms/Badge/badge'
import { Input } from '@/components/atoms/Input/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select/select'
import { BillingStatCard } from '@/components/atoms/BillingStatCard/billing-stat-card'
import { BillingMobileCard } from '@/components/molecules/BillingMobileCard/billing-mobile-card'
import { BillingWidget } from '@/components/widgets/BillingWidget/billing-widget'
import { BillingCardBlocks } from '@/components/organisms/BillingCardBlocks/BillingCardBlocks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { PaymentFilters } from '@/components/molecules/BillingFilters/payment-filters'
import { PriorAuthFilters } from '@/components/molecules/BillingFilters/prior-auth-filters'
import { CreditCardFilters } from '@/components/molecules/BillingFilters/credit-card-filters'
import { PaymentProcessingCenter } from '@/components/organisms/PaymentProcessingCenter/payment-processing-center'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  CreditCardIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  ReceiptRefundIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/react/24/outline'
import { WidgetType } from '@/types/widget'

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

// Billing widget configurations for comprehensive dashboard
interface BillingWidgetConfig {
  id: string
  title: string
  type: WidgetType
  icon: React.ReactNode
  description: string
}

const billingWidgets: BillingWidgetConfig[] = [
  {
    id: 'new-payment',
    title: 'New Payment',
    type: 'billing_new_payment',
    icon: <CreditCardIcon className="w-5 h-5" />,
    description: 'Process patient payments with guided workflow'
  },
  {
    id: 'invoices',
    title: 'Invoices',
    type: 'billing',
    icon: <DocumentTextIcon className="w-5 h-5" />,
    description: 'Comprehensive invoice tracking and management'
  },
  {
    id: 'payment-receipts',
    title: 'Receipts',
    type: 'billing_payment_receipts',
    icon: <ReceiptRefundIcon className="w-5 h-5" />,
    description: 'View and manage payment receipts'
  },
  {
    id: 'prior-auth',
    title: 'PA',
    type: 'billing_prior_auth',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    description: 'Manage insurance prior authorizations'
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards',
    type: 'billing_credit_cards',
    icon: <CreditCardIcon className="w-5 h-5" />,
    description: 'Manage patient credit card information'
  },
  {
    id: 'billing-statements',
    title: 'Statements',
    type: 'billing_statement',
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    description: 'Generate and view patient billing statements'
  },
  {
    id: 'write-off',
    title: 'Write-Offs',
    type: 'billing_write_off',
    icon: <ArchiveBoxXMarkIcon className="w-5 h-5" />,
    description: 'Process billing write-offs and adjustments'
  },
  {
    id: 'billing-notes',
    title: 'Notes',
    type: 'billing_notes',
    icon: <PencilSquareIcon className="w-5 h-5" />,
    description: 'View and manage billing notes'
  }
]

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

  // State management for filters and search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  
  // State for active billing widget tab
  const [activeWidgetTab, setActiveWidgetTab] = useState('invoices')
  
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

  // Filter billing data based on search and filters
  const filteredBillingData = useMemo(() => {
    return mockBillingData.filter(invoice => {
      const matchesSearch = !searchQuery || 
        invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      const matchesPaymentMethod = paymentMethodFilter === 'all' || 
        invoice.paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase())
      
      return matchesSearch && matchesStatus && matchesPaymentMethod
    })
  }, [searchQuery, statusFilter, paymentMethodFilter])

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

  // Status badge renderer with consistent colors
  const getStatusBadge = (status: BillingInvoice['status']) => {
    const statusConfig = {
      paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800' },
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', className: 'bg-orange-100 text-orange-800' }
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // AG Grid column definitions for billing table
  const columnDefs = [
    {
      headerName: 'Invoice #',
      field: 'invoiceNumber',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <div className="font-medium text-primary cursor-pointer hover:underline">
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Patient',
      field: 'patientName',
      minWidth: 180,
      cellRenderer: (params: any) => (
        <div>
          <div className="font-medium">{params.value}</div>
          <div className="text-sm text-gray-500">{params.data.patientId}</div>
        </div>
      )
    },
    {
      headerName: 'Date of Service',
      field: 'dateOfService',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <div className="text-sm">
          {new Date(params.value).toLocaleDateString()}
        </div>
      )
    },
    {
      headerName: 'Amount',
      field: 'amount',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="font-medium">
          ${params.value.toFixed(2)}
        </div>
      )
    },
    {
      headerName: 'Balance Owed',
      field: 'balanceOwed',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className={`font-medium ${params.value > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${params.value.toFixed(2)}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      minWidth: 100,
      cellRenderer: (params: any) => getStatusBadge(params.value)
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMethod',
      minWidth: 140
    },
    {
      headerName: 'Insurance',
      field: 'insuranceProvider',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <div className="text-sm">
          {params.value || '-'}
        </div>
      )
    }
  ]

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
          {/* Header Section with Title and Actions */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage invoices, payments, and billing operations
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button size="sm" className="gap-2">
                  <PlusIcon className="w-4 h-4" />
                  New Invoice
                </Button>
              </div>
            </div>
          </div>

          {/* Billing Card Blocks Section */}
          <div className="px-4 sm:px-6 py-6 bg-white border-b border-gray-200">
            <BillingCardBlocks 
              onBlockClick={handleBillingBlockClick}
              selectedBlockId={selectedBillingBlock}
            />
          </div>

          {/* Statistics Cards */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <BillingStatCard
                title="Total Revenue"
                value={`$${billingStats.totalRevenue.toFixed(2)}`}
                icon={<BanknotesIcon className="w-5 h-5" />}
                trend={{ value: 12.5, isPositive: true }}
              />
              <BillingStatCard
                title="Outstanding"
                value={`$${billingStats.totalOwed.toFixed(2)}`}
                icon={<ExclamationTriangleIcon className="w-5 h-5" />}
                trend={{ value: 3.2, isPositive: false }}
              />
              <BillingStatCard
                title="Paid Invoices"
                value={billingStats.paidInvoices}
                icon={<CreditCardIcon className="w-5 h-5" />}
              />
              <BillingStatCard
                title="Overdue"
                value={billingStats.overdueInvoices}
                icon={<CalendarIcon className="w-5 h-5" />}
              />
            </div>
          </div>



          {/* Billing Widgets Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <Tabs 
                value={activeWidgetTab} 
                onValueChange={setActiveWidgetTab}
                className="h-full flex flex-col"
              >
                {/* Widget Tabs Navigation */}
                <div className="border-b border-gray-200 px-4 sm:px-6 py-3">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
                    {billingWidgets.map((widget) => (
                      <TabsTrigger
                        key={widget.id}
                        value={widget.id}
                        className="flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm"
                        title={widget.description}
                      >
                        <span className="hidden sm:inline">{widget.icon}</span>
                        <span className="truncate">{widget.title.split(' ')[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
            </div>
            
                {/* Widget Content Area */}
                <div className="flex-1 overflow-auto">
                  {billingWidgets.map((widget) => (
                    <TabsContent 
                      key={widget.id} 
                      value={widget.id}
                      className="h-full mt-0"
                    >
                      {widget.id === 'invoices' ? (
                        // Custom Invoice Management View
                        <div className="h-full flex flex-col">
                          {/* Invoice-Specific Search and Filters */}
                          <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
                            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4">
                              {/* Search Input */}
                              <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="Search invoices, patients..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                              
                              {/* Invoice Filter Controls */}
                              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                                {/* Status Filter */}
                                <div className="min-w-0 flex-1 sm:w-48">
                                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Statuses</SelectItem>
                                      <SelectItem value="paid">Paid</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="overdue">Overdue</SelectItem>
                                      <SelectItem value="draft">Draft</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {/* Payment Method Filter */}
                                <div className="min-w-0 flex-1 sm:w-48">
                                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="All Payment Methods" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Payment Methods</SelectItem>
                                      <SelectItem value="insurance">Insurance</SelectItem>
                                      <SelectItem value="credit">Credit Card</SelectItem>
                                      <SelectItem value="self">Self Pay</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop View - Data Table */}
                          <div className="hidden lg:block flex-1 p-4">
                            <DataTable
                              rowData={filteredBillingData}
                              columnDefs={columnDefs}
                              className="w-full h-full"
                              gridOptions={{
                                suppressCellFocus: true,
                                animateRows: true,
                                pagination: true,
                                paginationPageSize: 25,
                                domLayout: 'normal',
                                rowHeight: 60,
                                headerHeight: 44,
                                rowSelection: 'multiple',
                                suppressRowClickSelection: true,
                                defaultColDef: {
                                  sortable: true,
                                  filter: true,
                                  resizable: true,
                                  flex: 1
                                }
                              }}
                            />
                          </div>

                          {/* Mobile View - Card Layout */}
                          <div className="lg:hidden flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                              {filteredBillingData.length > 0 ? (
                                filteredBillingData.map((invoice) => (
                                  <BillingMobileCard
                                    key={invoice.id}
                                    invoice={invoice}
                                    onViewDetails={(invoice) => console.log('View details:', invoice)}
                                    onPayNow={(invoice) => console.log('Pay now:', invoice)}
                                  />
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                  <DocumentTextIcon className="w-12 h-12 mb-4 text-gray-300" />
                                  <h3 className="text-lg font-medium mb-2">No invoices found</h3>
                                  <p className="text-sm text-center">
                                    Try adjusting your filters or create a new invoice
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Billing Widget Views with Tab-Specific Filters
                        <div className="h-full flex flex-col">
                          {/* Tab-Specific Filter Components */}
                          {widget.id === 'payment-receipts' && (
                            <PaymentFilters
                              onSearchChange={(search) => console.log('Payment search:', search)}
                              onTypeFilterChange={(type) => console.log('Payment type:', type)}
                              onStatusFilterChange={(status) => console.log('Payment status:', status)}
                              onDateFilterChange={(date) => console.log('Payment date:', date)}
                            />
                          )}
                          
                          {widget.id === 'prior-auth' && (
                            <PriorAuthFilters
                              onSearchChange={(search) => console.log('Prior auth search:', search)}
                              onStatusFilterChange={(status) => console.log('Prior auth status:', status)}
                              onProviderFilterChange={(provider) => console.log('Prior auth provider:', provider)}
                              onUrgencyFilterChange={(urgency) => console.log('Prior auth urgency:', urgency)}
                            />
                          )}
                          
                          {widget.id === 'credit-cards' && (
                            <CreditCardFilters
                              onSearchChange={(search) => console.log('Credit card search:', search)}
                              onCardTypeFilterChange={(type) => console.log('Card type:', type)}
                              onStatusFilterChange={(status) => console.log('Card status:', status)}
                              onExpirationFilterChange={(expiration) => console.log('Card expiration:', expiration)}
                            />
                          )}

                          {/* Widget Content */}
                          <div className="flex-1 overflow-auto">
                            {widget.id === 'new-payment' ? (
                              <PaymentProcessingCenter />
                            ) : (
                              <BillingWidget
                                patientId="sample-patient"
                                isFullscreen={true}
                                type={widget.type}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage 