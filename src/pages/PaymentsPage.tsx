import { FC, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/input'
import { Label } from '@/components/atoms/Label/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef } from 'ag-grid-community'

// Payment Record interface
interface PaymentRecord {
  id: string
  dateOfEntry: string
  payingEntity: string
  payer: string
  location: string
  insCode: string
  paymentMethod: string
  checkRefNumber: string
  payStatus: string
  payment: number
  undistributed: number
  checkStatus: string
  refundStatus: string
  paymentReceivedBy: string
}

// Mock payment data
const mockPaymentData: PaymentRecord[] = [
  {
    id: 'PAY-001',
    dateOfEntry: '2024-01-15',
    payingEntity: 'Patient',
    payer: 'John Smith',
    location: 'Main Campus',
    insCode: 'BCBS',
    paymentMethod: 'Check',
    checkRefNumber: 'CHK-12345',
    payStatus: 'Paid',
    payment: 1500.00,
    undistributed: 0.00,
    checkStatus: 'Cleared',
    refundStatus: 'None',
    paymentReceivedBy: 'Sarah Johnson'
  },
  {
    id: 'PAY-002',
    dateOfEntry: '2024-01-16',
    payingEntity: 'Insurance',
    payer: 'Blue Cross Blue Shield',
    location: 'Satellite Clinic A',
    insCode: 'BCBS',
    paymentMethod: 'EFT',
    checkRefNumber: 'EFT-67890',
    payStatus: 'Paid',
    payment: 3200.00,
    undistributed: 200.00,
    checkStatus: 'N/A',
    refundStatus: 'None',
    paymentReceivedBy: 'System'
  },
  {
    id: 'PAY-003',
    dateOfEntry: '2024-01-17',
    payingEntity: 'Patient',
    payer: 'Mary Johnson',
    location: 'Main Campus',
    insCode: 'MEDICARE',
    paymentMethod: 'Credit Card',
    checkRefNumber: 'CC-98765',
    payStatus: 'Pending',
    payment: 850.00,
    undistributed: 0.00,
    checkStatus: 'N/A',
    refundStatus: 'None',
    paymentReceivedBy: 'Michael Chen'
  },
  {
    id: 'PAY-004',
    dateOfEntry: '2024-01-18',
    payingEntity: 'Insurance',
    payer: 'Aetna',
    location: 'Telehealth',
    insCode: 'AETNA',
    paymentMethod: 'ACH',
    checkRefNumber: 'ACH-54321',
    payStatus: 'Partial',
    payment: 5000.00,
    undistributed: 1200.00,
    checkStatus: 'N/A',
    refundStatus: 'None',
    paymentReceivedBy: 'System'
  },
  {
    id: 'PAY-005',
    dateOfEntry: '2024-01-19',
    payingEntity: 'Patient',
    payer: 'Robert Davis',
    location: 'Main Campus',
    insCode: 'SELF',
    paymentMethod: 'Cash',
    checkRefNumber: 'CASH-001',
    payStatus: 'Paid',
    payment: 450.00,
    undistributed: 0.00,
    checkStatus: 'N/A',
    refundStatus: 'None',
    paymentReceivedBy: 'Emily Rodriguez'
  },
  {
    id: 'PAY-006',
    dateOfEntry: '2024-01-20',
    payingEntity: 'Insurance',
    payer: 'UnitedHealth',
    location: 'Satellite Clinic B',
    insCode: 'UHC',
    paymentMethod: 'Check',
    checkRefNumber: 'CHK-24680',
    payStatus: 'Paid',
    payment: 2800.00,
    undistributed: 0.00,
    checkStatus: 'Cleared',
    refundStatus: 'None',
    paymentReceivedBy: 'System'
  },
  {
    id: 'PAY-007',
    dateOfEntry: '2024-01-21',
    payingEntity: 'Patient',
    payer: 'Sarah Thompson',
    location: 'Main Campus',
    insCode: 'MEDICAID',
    paymentMethod: 'Credit Card',
    checkRefNumber: 'CC-11223',
    payStatus: 'Denied',
    payment: 0.00,
    undistributed: 0.00,
    checkStatus: 'N/A',
    refundStatus: 'Pending',
    paymentReceivedBy: 'David Martinez'
  },
  {
    id: 'PAY-008',
    dateOfEntry: '2024-01-22',
    payingEntity: 'Insurance',
    payer: 'Cigna',
    location: 'Main Campus',
    insCode: 'CIGNA',
    paymentMethod: 'EFT',
    checkRefNumber: 'EFT-33445',
    payStatus: 'Paid',
    payment: 1650.00,
    undistributed: 0.00,
    checkStatus: 'N/A',
    refundStatus: 'None',
    paymentReceivedBy: 'System'
  }
]

/**
 * Payments Page
 * 
 * Payments management page for handling payment processing,
 * reconciliation, and payment-related operations.
 */
export const PaymentsPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX
  useDocumentTitle('Payments')

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Payments')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Filter states
  const [dateOfEntry, setDateOfEntry] = useState('Date Of Service')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentFrom, setPaymentFrom] = useState('')
  const [paymentFrom2, setPaymentFrom2] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [payingEntity, setPayingEntity] = useState('')
  const [paymentReceivedBy, setPaymentReceivedBy] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [checkRefNumber, setCheckRefNumber] = useState('')
  const [paymentCategory, setPaymentCategory] = useState('')
  const [payStatus, setPayStatus] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [location, setLocation] = useState('')

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

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Handle filter search
  const handleFilterSearch = useCallback(() => {
    console.log('Searching payments with filters:', {
      dateOfEntry,
      dateFrom,
      dateTo,
      paymentAmount,
      paymentFrom,
      paymentFrom2,
      sortBy,
      payingEntity,
      paymentReceivedBy,
      paymentMethod,
      checkRefNumber,
      paymentCategory,
      payStatus,
      paymentId,
      location
    })
    // Filter logic will be implemented here
  }, [
    dateOfEntry,
    dateFrom,
    dateTo,
    paymentAmount,
    paymentFrom,
    paymentFrom2,
    sortBy,
    payingEntity,
    paymentReceivedBy,
    paymentMethod,
    checkRefNumber,
    paymentCategory,
    payStatus,
    paymentId,
    location
  ])

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setDateOfEntry('Date Of Service')
    setDateFrom('')
    setDateTo('')
    setPaymentAmount('')
    setPaymentFrom('')
    setPaymentFrom2('')
    setSortBy('')
    setPayingEntity('')
    setPaymentReceivedBy('')
    setPaymentMethod('')
    setCheckRefNumber('')
    setPaymentCategory('')
    setPayStatus('')
    setPaymentId('')
    setLocation('')
  }, [])

  // Payment data state
  const [paymentData, setPaymentData] = useState<PaymentRecord[]>(mockPaymentData)
  
  // Delete confirmation dialog state
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean
    paymentId: string | null
  }>({
    isOpen: false,
    paymentId: null
  })

  // Handle delete payment confirmation
  const handleDeleteClick = useCallback((paymentId: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      paymentId
    })
  }, [])

  // Handle delete payment confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmDialog.paymentId) {
      setPaymentData(prev => prev.filter(payment => payment.id !== deleteConfirmDialog.paymentId))
      console.log('Payment deleted:', deleteConfirmDialog.paymentId)
    }
    setDeleteConfirmDialog({
      isOpen: false,
      paymentId: null
    })
  }, [deleteConfirmDialog.paymentId])

  // Handle delete cancel
  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmDialog({
      isOpen: false,
      paymentId: null
    })
  }, [])

  // Column definitions for AG Grid
  const columnDefs: ColDef<PaymentRecord>[] = useMemo(() => [
    {
      headerName: 'ID',
      field: 'id',
      width: 90,
      pinned: 'left',
      cellStyle: { fontWeight: '500', fontFamily: 'monospace' },
      suppressSizeToFit: true
    },
    {
      headerName: 'Date Of Entry',
      field: 'dateOfEntry',
      width: 120,
      suppressSizeToFit: true,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : ''
      }
    },
    {
      headerName: 'Paying Entity',
      field: 'payingEntity',
      width: 120,
      suppressSizeToFit: true
    },
    {
      headerName: 'Payer',
      field: 'payer',
      width: 160,
      cellStyle: { fontWeight: '500' }
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 130,
      suppressSizeToFit: true
    },
    {
      headerName: 'Ins Code',
      field: 'insCode',
      width: 90,
      suppressSizeToFit: true,
      cellStyle: { fontFamily: 'monospace' }
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMethod',
      width: 130,
      suppressSizeToFit: true
    },
    {
      headerName: 'Check/Ref Number',
      field: 'checkRefNumber',
      width: 140,
      suppressSizeToFit: true,
      cellStyle: { fontFamily: 'monospace' }
    },
    {
      headerName: 'Pay Status',
      field: 'payStatus',
      width: 110,
      suppressSizeToFit: true,
      cellStyle: (params) => {
        const status = params.value?.toLowerCase()
        if (status === 'paid') return { color: '#15803d', fontWeight: '500' }
        if (status === 'pending') return { color: '#b45309', fontWeight: '500' }
        if (status === 'partial') return { color: '#0369a1', fontWeight: '500' }
        if (status === 'denied') return { color: '#b91c1c', fontWeight: '500' }
        return {}
      }
    },
    {
      headerName: 'Payment',
      field: 'payment',
      width: 110,
      suppressSizeToFit: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'
      },
      cellStyle: { fontWeight: '500' }
    },
    {
      headerName: 'Undistributed',
      field: 'undistributed',
      width: 120,
      suppressSizeToFit: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'
      },
      cellStyle: (params) => {
        return params.value > 0 ? { color: '#b45309', fontWeight: '500' } : { color: '#6b7280' }
      }
    },
    {
      headerName: 'Check Status',
      field: 'checkStatus',
      width: 110,
      suppressSizeToFit: true,
      cellStyle: (params) => {
        const status = params.value?.toLowerCase()
        if (status === 'cleared') return { color: '#15803d', fontWeight: '500' }
        if (status === 'pending') return { color: '#b45309', fontWeight: '500' }
        return { color: '#6b7280' }
      }
    },
    {
      headerName: 'Refund Status',
      field: 'refundStatus',
      width: 120,
      suppressSizeToFit: true,
      cellStyle: (params) => {
        const status = params.value?.toLowerCase()
        if (status === 'pending') return { color: '#b45309', fontWeight: '500' }
        if (status === 'processed') return { color: '#15803d', fontWeight: '500' }
        return { color: '#6b7280' }
      }
    },
    {
      headerName: 'Payment Received By',
      field: 'paymentReceivedBy',
      minWidth: 150,
      flex: 1
    },
    {
      headerName: 'Allocation',
      field: 'allocation',
      width: 100,
      pinned: 'right',
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                console.log('View allocation for payment:', params.data.id)
                // Allocation view logic will be implemented here
              }}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              title="View allocation"
            >
              <Icon icon="eye" className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(params.data.id)
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete payment"
            >
              <Icon icon="trash" className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    }
  ], [handleDeleteClick])

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Billing', href: '/billing' },
    { label: 'Payments' }
  ]

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
          activeItem="Billing"
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
                      setMobileSidebarOpen(false)
                    }}
                    onSearch={handleSidebarSearch}
                    onCollapsedChange={setSidebarCollapsed}
                    defaultCollapsed={false}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden bg-zinc-100">
            <div className="h-full flex flex-col">
              {/* Header Section */}
              <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
                <div className="flex flex-col gap-3">
                  {/* Breadcrumb */}
                  <Breadcrumb items={breadcrumbItems} />
                  
                  <div className="flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMobileSidebarToggle}
                        className="mr-2"
                      >
                        <Icon icon="bars" className="w-5 h-5" />
                      </Button>
                    )}
                    
                    {/* Title Section */}
                    <div className="flex-1">
                      <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Icon icon="money-bill-wave" className="w-5 h-5 text-[#1C75BC]" />
                        Payments
                      </h1>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Payment Processing and Management
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Exporting payments data...')
                          // Export logic will be implemented
                        }}
                      >
                        <Icon icon="file-export" className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Printing payments data...')
                          window.print()
                        }}
                      >
                        <Icon icon="print" className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Viewing ERAs...')
                          navigate('/era-process')
                        }}
                      >
                        <Icon icon="eye" className="w-4 h-4 mr-1" />
                        View ERAs
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          console.log('Processing ERA...')
                          navigate('/process-era')
                        }}
                      >
                        <Icon icon="exchange-alt" className="w-4 h-4 mr-1" />
                        Process ERA
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          navigate('/new-payment')
                        }}
                      >
                        <Icon icon="plus" className="w-4 h-4 mr-1" />
                        New Payment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area - Two Column Layout */}
              <div className="flex-1 overflow-hidden flex">
                {/* Left Section - Filters */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                  {/* Filter Header */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs h-7 px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Scrollable Filters Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Group 1: Date Range - Most common starting point */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Date Range</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfEntry" className="text-xs font-medium text-gray-700">
                            Date Of Entry
                          </Label>
                          <Select value={dateOfEntry} onValueChange={setDateOfEntry}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Date Of Service">Date Of Service</SelectItem>
                              <SelectItem value="Date Of Payment">Date Of Payment</SelectItem>
                              <SelectItem value="Date Of Entry">Date Of Entry</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="dateFrom" className="text-xs font-medium text-gray-700">
                              From
                            </Label>
                            <div className="relative">
                              <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="h-9 text-xs pr-8"
                              />
                              <Icon 
                                icon="calendar" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="dateTo" className="text-xs font-medium text-gray-700">
                              To
                            </Label>
                            <div className="relative">
                              <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="h-9 text-xs pr-8"
                              />
                              <Icon 
                                icon="calendar" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Group 2: Payment Identification - Quick lookups */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Payment Identification</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentId" className="text-xs font-medium text-gray-700">
                            Payment ID
                          </Label>
                          <Input
                            id="paymentId"
                            type="text"
                            value={paymentId}
                            onChange={(e) => setPaymentId(e.target.value)}
                            placeholder="Enter payment ID"
                            className="h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="checkRefNumber" className="text-xs font-medium text-gray-700">
                            Check/Ref Number
                          </Label>
                          <Input
                            id="checkRefNumber"
                            type="text"
                            value={checkRefNumber}
                            onChange={(e) => setCheckRefNumber(e.target.value)}
                            placeholder="Enter check/ref number"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Group 3: Financial Details - Amount and categorization */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Financial Details</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentAmount" className="text-xs font-medium text-gray-700">
                            Payment Amount
                          </Label>
                          <Input
                            id="paymentAmount"
                            type="text"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentCategory" className="text-xs font-medium text-gray-700">
                            Payment Category
                          </Label>
                          <Select value={paymentCategory} onValueChange={setPaymentCategory}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="copay">Copay</SelectItem>
                              <SelectItem value="deductible">Deductible</SelectItem>
                              <SelectItem value="coinsurance">Coinsurance</SelectItem>
                              <SelectItem value="self-pay">Self Pay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Group 4: Payment Source - Who is paying and how */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Payment Source</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="payingEntity" className="text-xs font-medium text-gray-700">
                            Paying Entity
                          </Label>
                          <Select value={payingEntity} onValueChange={setPayingEntity}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select entity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="patient">Patient</SelectItem>
                              <SelectItem value="insurance">Insurance</SelectItem>
                              <SelectItem value="third-party">Third Party</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentFrom" className="text-xs font-medium text-gray-700">
                            Payment From
                          </Label>
                          <Input
                            id="paymentFrom"
                            type="text"
                            value={paymentFrom}
                            onChange={(e) => setPaymentFrom(e.target.value)}
                            placeholder="Enter payment source"
                            className="h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentMethod" className="text-xs font-medium text-gray-700">
                            Payment Method
                          </Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="eft">EFT</SelectItem>
                              <SelectItem value="ach">ACH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Group 5: Status & Assignment - Workflow tracking */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Status & Assignment</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="payStatus" className="text-xs font-medium text-gray-700">
                            Pay Status
                          </Label>
                          <Select value={payStatus} onValueChange={setPayStatus}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="denied">Denied</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentReceivedBy" className="text-xs font-medium text-gray-700">
                            Payment Received by
                          </Label>
                          <Select value={paymentReceivedBy} onValueChange={setPaymentReceivedBy}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="---- Select -----" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff1">Staff Member 1</SelectItem>
                              <SelectItem value="staff2">Staff Member 2</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Group 6: Location - Organizational context */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Location</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="location" className="text-xs font-medium text-gray-700">
                            Location
                          </Label>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">Main Campus</SelectItem>
                              <SelectItem value="satellite1">Satellite Clinic A</SelectItem>
                              <SelectItem value="satellite2">Satellite Clinic B</SelectItem>
                              <SelectItem value="telehealth">Telehealth</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Group 7: Display Options - How to sort results */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Display Options</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="sortBy" className="text-xs font-medium text-gray-700">
                            Sort Result by
                          </Label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select sort option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="amount">Amount</SelectItem>
                              <SelectItem value="paymentId">Payment ID</SelectItem>
                              <SelectItem value="patient">Patient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Sticky Search Button */}
                  <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white sticky bottom-0">
                    <Button
                      onClick={handleFilterSearch}
                      className="w-full h-9 text-xs font-medium"
                    >
                      <Icon icon="search" className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Right Section - Results */}
                <div className="flex-1 overflow-hidden bg-zinc-50 flex flex-col">
                  <div className="flex-1 p-6">
                    {paymentData.length === 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex items-center justify-center">
                        <div>
                          <Icon icon="inbox" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Records Found</h3>
                          <p className="text-sm text-gray-600">
                            Apply filters and click Search to view payment records.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border border-gray-200 h-full overflow-hidden flex flex-col">
                        <div className="ag-theme-alpine flex-1" style={{ width: '100%', height: '100%' }}>
                          <AgGridReact
                            rowData={paymentData}
                            columnDefs={columnDefs}
                            defaultColDef={{
                              sortable: true,
                              filter: true,
                              resizable: true,
                            }}
                            domLayout="normal"
                            suppressCellFocus={true}
                            suppressRowClickSelection={true}
                            rowSelection={undefined}
                            rowHeight={40}
                            headerHeight={40}
                            animateRows={true}
                            pagination={true}
                            paginationPageSize={20}
                            suppressHorizontalScroll={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment"
        message={`Are you sure you want to delete payment ${deleteConfirmDialog.paymentId}? This action cannot be undone.`}
        confirmButtonText="Delete"
      />
    </TooltipProvider>
  )
}

export default PaymentsPage

