import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Label } from '@/components/atoms/Label/label'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef } from 'ag-grid-community'

interface ReportRecord {
  practitioner: string
  person: string
  dateOfService: string
  postToDate: string
  received: string
  checkId: string
}

/**
 * BillingReportsPage Component
 * 
 * Report - Person Receipts by Provider
 * Shows billing receipts filtered by date range, encounter program, provider, service code, etc.
 */
export const BillingReportsPage: FC = () => {
  const navigate = useNavigate()
  useDocumentTitle('Billing Reports - Person Receipts by Provider')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Manager')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter states
  const [dateType, setDateType] = useState('Post To Date')
  const [dateFrom, setDateFrom] = useState('2024-09-01')
  const [dateTo, setDateTo] = useState('2024-09-30')
  const [encounterProgram, setEncounterProgram] = useState('All selected')
  const [provider, setProvider] = useState('All selected')
  const [paymentMethod, setPaymentMethod] = useState('All')
  const [serviceCode, setServiceCode] = useState('')
  const [diagnosisCode, setDiagnosisCode] = useState('')
  const [includeInactiveUsers, setIncludeInactiveUsers] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showProcedures, setShowProcedures] = useState(false)
  const [showInsurance, setShowInsurance] = useState(false)

  // Mock data for the report
  const mockReportData: ReportRecord[] = [
    {
      practitioner: 'Admin, Erin/Max',
      person: 'Rogue, Virginia',
      dateOfService: '08/02/2024',
      postToDate: '08/02/2024',
      received: '450.00',
      checkId: ''
    },
    {
      practitioner: 'Carroll II, Test',
      person: 'Carroll II, Test',
      dateOfService: '08/02/2024',
      postToDate: '08/02/2024',
      received: '450.00',
      checkId: ''
    },
    {
      practitioner: 'MAXG, Maitra',
      person: 'MAXG, Maitra',
      dateOfService: '08/02/2024',
      postToDate: '08/02/2024',
      received: '2.00',
      checkId: '00000016401'
    },
    {
      practitioner: 'MOTIF, QA',
      person: 'MOTIF, QA',
      dateOfService: '08/19/2024',
      postToDate: '08/21/2024',
      received: '10.00',
      checkId: '00000018408'
    },
    {
      practitioner: 'MOTIF, QA',
      person: 'MOTIF, QA',
      dateOfService: '08/21/2024',
      postToDate: '08/21/2024',
      received: '10.00',
      checkId: '00000018402'
    },
    {
      practitioner: 'Treesi, Steve',
      person: 'Treesi, Steve',
      dateOfService: '08/19/2024',
      postToDate: '08/26/2024',
      received: '40.00',
      checkId: ''
    },
    {
      practitioner: 'MOTIF, QA',
      person: 'MOTIF, QA',
      dateOfService: '08/27/2024',
      postToDate: '08/26/2024',
      received: '20.00',
      checkId: ''
    },
    {
      practitioner: 'Treesi, Steve',
      person: 'Treesi, Steve',
      dateOfService: '08/07/2024',
      postToDate: '09/08/2024',
      received: '22.92',
      checkId: ''
    }
  ]

  // Column definitions for AG Grid
  const columnDefs: ColDef<ReportRecord>[] = [
    {
      headerName: 'Practitioner',
      field: 'practitioner',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 180
    },
    {
      headerName: 'Person',
      field: 'person',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 180
    },
    {
      headerName: 'Date Of Service',
      field: 'dateOfService',
      sortable: true,
      filter: true,
      width: 140
    },
    {
      headerName: 'Post To Date',
      field: 'postToDate',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      headerName: 'Received',
      field: 'received',
      sortable: true,
      filter: true,
      width: 120,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Check#',
      field: 'checkId',
      sortable: true,
      filter: true,
      width: 150
    }
  ]

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
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
    setActiveSidebarItem(itemLabel)
    
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  // Handle search action
  const handleSearch_Report = () => {
    console.log('Searching with filters:', {
      dateType,
      dateFrom,
      dateTo,
      encounterProgram,
      provider,
      paymentMethod,
      serviceCode,
      diagnosisCode,
      includeInactiveUsers,
      showDetails,
      showProcedures,
      showInsurance
    })
  }

  // Handle print action
  const handlePrint = () => {
    window.print()
  }

  // Handle CSV export
  const handleCSVExport = () => {
    try {
      const headers = ['Practitioner', 'Person', 'Date Of Service', 'Post To Date', 'Received', 'Check#']
      
      const csvRows = mockReportData.map(record => [
        record.practitioner,
        record.person,
        record.dateOfService,
        record.postToDate,
        record.received,
        record.checkId
      ])

      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `billing-report-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log('CSV export completed')
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  return (
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
        <Sidebar
          activeItem={activeSidebarItem}
          onMenuSelect={handleSidebarSelect}
          onSearch={handleSidebarSearch}
          onCollapsedChange={setSidebarCollapsed}
          defaultCollapsed={sidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-zinc-100">
          <div className="h-full flex flex-col">
            {/* Breadcrumb and Page Title */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex flex-col gap-2">
                <Breadcrumb
                  items={[
                    { label: 'Billing', href: '/billing' },
                    { label: 'Billing Manager', href: '/billing-manager' },
                    { label: 'Reports' }
                  ]}
                />
                <h1 className="text-lg font-semibold text-gray-900">
                  Report - Person Receipts by Provider
                </h1>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
              <div className="space-y-4">
                {/* Date Range Row */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="dateType" className="text-xs font-medium text-gray-700 mb-1">
                      By:
                    </Label>
                    <Select value={dateType} onValueChange={setDateType}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Deposit Date">Deposit Date</SelectItem>
                        <SelectItem value="Invoice Date">Invoice Date</SelectItem>
                        <SelectItem value="Payment Date">Payment Date</SelectItem>
                        <SelectItem value="Post To Date">Post To Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFrom" className="text-xs font-medium text-gray-700 mb-1">
                      From:
                    </Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo" className="text-xs font-medium text-gray-700 mb-1">
                      To:
                    </Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="encounterProgram" className="text-xs font-medium text-gray-700 mb-1">
                      Encounter Program:
                    </Label>
                    <Select value={encounterProgram} onValueChange={setEncounterProgram}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All selected">All selected</SelectItem>
                        <SelectItem value="ABA Therapy">ABA Therapy</SelectItem>
                        <SelectItem value="Speech Therapy">Speech Therapy</SelectItem>
                        <SelectItem value="Occupational Therapy">Occupational Therapy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="provider" className="text-xs font-medium text-gray-700 mb-1">
                      Provider:
                    </Label>
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All selected">All selected</SelectItem>
                        <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                        <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="paymentMethod" className="text-xs font-medium text-gray-700 mb-1">
                      Payment Method:
                    </Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="serviceCode" className="text-xs font-medium text-gray-700 mb-1">
                      Service Code:
                    </Label>
                    <Input
                      id="serviceCode"
                      type="text"
                      value={serviceCode}
                      onChange={(e) => setServiceCode(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diagnosisCode" className="text-xs font-medium text-gray-700 mb-1">
                      Diagnosis Code:
                    </Label>
                    <Input
                      id="diagnosisCode"
                      type="text"
                      value={diagnosisCode}
                      onChange={(e) => setDiagnosisCode(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInactiveUsers}
                        onChange={(e) => setIncludeInactiveUsers(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-xs text-gray-700">Include Inactive users</span>
                    </label>
                  </div>
                </div>

                {/* Display Options Checkboxes */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDetails}
                      onChange={(e) => setShowDetails(e.target.checked)}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Details</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProcedures}
                      onChange={(e) => setShowProcedures(e.target.checked)}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Procedures</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInsurance}
                      onChange={(e) => setShowInsurance(e.target.checked)}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Insurance</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    onClick={handleSearch_Report}
                  >
                    <Icon icon="search" className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Icon icon="print" className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCSVExport}
                  >
                    <Icon icon="file-csv" className="w-4 h-4 mr-2" />
                    CSV Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Report Table */}
            <div className="flex-1 overflow-hidden bg-white m-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="h-full ag-theme-alpine">
                <AgGridReact
                  rowData={mockReportData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true
                  }}
                  pagination={true}
                  paginationPageSize={20}
                  domLayout="normal"
                  suppressCellFocus={true}
                  enableCellTextSelection={true}
                  ensureDomOrder={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingReportsPage
