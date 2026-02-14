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

interface EncounterDetailRecord {
  program: string
  primaryFunding: string
  secondaryFunding: string
  tertiaryFunding: string
  codeType: string
  code: string
  modifier: string
  clientName: string
  dob: string
  pid: string
  userName: string
  placeOfService: string
  encounter: string
  date: string
  from: string
  to: string
  duration: string
  units: string
  fee: string
  billStatus: string
  encounterStatus: string
}

/**
 * EncounterDetailsPage Component
 * 
 * Report - Encounter Details Report
 * Shows detailed encounter information including billing and insurance data.
 */
export const EncounterDetailsPage: FC = () => {
  const navigate = useNavigate()
  useDocumentTitle('Encounter Details Report')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Manager')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter states
  const [dateRange, setDateRange] = useState('Today')
  const [dateFrom, setDateFrom] = useState('10/10/2025')
  const [dateTo, setDateTo] = useState('10/10/2025')
  const [patient, setPatient] = useState('')
  const [program, setProgram] = useState('all')
  const [primaryInsurance, setPrimaryInsurance] = useState('all')
  const [secondaryInsurance, setSecondaryInsurance] = useState('all')
  const [tertiaryInsurance, setTertiaryInsurance] = useState('all')
  const [codeType, setCodeType] = useState('all')

  // Mock data for the encounter details table
  const mockEncounterData: EncounterDetailRecord[] = [
    {
      program: '',
      primaryFunding: '',
      secondaryFunding: '',
      tertiaryFunding: '',
      codeType: 'HCPCS',
      code: 'H0047',
      modifier: '',
      clientName: 'Natsu, Dragneel',
      dob: '02/15/2000',
      pid: '1003685',
      userName: 'Doctor, Psychiatrist',
      placeOfService: 'Office',
      encounter: '100184478',
      date: '10/19/2025',
      from: '00:00',
      to: '00:00',
      duration: '00:00:00',
      units: '1',
      fee: '$20.00',
      billStatus: 'Unbilled',
      encounterStatus: 'Closed'
    }
  ]

  // Column definitions for AG Grid
  const columnDefs: ColDef<EncounterDetailRecord>[] = [
    {
      headerName: 'Program',
      field: 'program',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'Primary Funding Source',
      field: 'primaryFunding',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Secondary Funding Source',
      field: 'secondaryFunding',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Tertiary Funding Source',
      field: 'tertiaryFunding',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Code Type',
      field: 'codeType',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Code',
      field: 'code',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Modifier',
      field: 'modifier',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Client Name',
      field: 'clientName',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'DOB',
      field: 'dob',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'PID',
      field: 'pid',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'User Name',
      field: 'userName',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Place of Service',
      field: 'placeOfService',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      headerName: 'Encounter',
      field: 'encounter',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'From',
      field: 'from',
      sortable: true,
      filter: true,
      width: 80
    },
    {
      headerName: 'To',
      field: 'to',
      sortable: true,
      filter: true,
      width: 80
    },
    {
      headerName: 'Duration',
      field: 'duration',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Units',
      field: 'units',
      sortable: true,
      filter: true,
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: 'Fee',
      field: 'fee',
      sortable: true,
      filter: true,
      width: 100,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Bill Status',
      field: 'billStatus',
      sortable: true,
      filter: true,
      width: 110
    },
    {
      headerName: 'Encounter Status',
      field: 'encounterStatus',
      sortable: true,
      filter: true,
      width: 130
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
  const handleSearchEncounters = () => {
    console.log('Searching encounters with filters:', {
      dateRange,
      dateFrom,
      dateTo,
      patient,
      program,
      primaryInsurance,
      secondaryInsurance,
      tertiaryInsurance,
      codeType
    })
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle CSV export
  const handleExportCSV = () => {
    try {
      const headers = [
        'Program', 'Primary Funding Source', 'Secondary Funding Source', 'Tertiary Funding Source',
        'Code Type', 'Code', 'Modifier', 'Client Name', 'DOB', 'PID', 'User Name',
        'Place of Service', 'Encounter', 'Date', 'From', 'To', 'Duration', 'Units', 'Fee',
        'Bill Status', 'Encounter Status'
      ]
      
      const csvRows = mockEncounterData.map(record => [
        record.program,
        record.primaryFunding,
        record.secondaryFunding,
        record.tertiaryFunding,
        record.codeType,
        record.code,
        record.modifier,
        record.clientName,
        record.dob,
        record.pid,
        record.userName,
        record.placeOfService,
        record.encounter,
        record.date,
        record.from,
        record.to,
        record.duration,
        record.units,
        record.fee,
        record.billStatus,
        record.encounterStatus
      ])

      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `encounter-details-${new Date().toISOString().split('T')[0]}.csv`)
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

  // Handle offline reports
  const handleOfflineReports = () => {
    console.log('Offline Reports clicked')
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
                    { label: 'Encounter Details Report' }
                  ]}
                />
                <h1 className="text-lg font-semibold text-gray-900">
                  Report - Encounter Details Report
                </h1>
                <p className="text-xs text-gray-600">
                  All details for billable encounters including billing and insurance information. Select your filters and click Search or hit enter to begin your query. Leaving a Blank field will search without any filter for that field.
                </p>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
              <div className="space-y-4">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="dateRange" className="text-xs font-medium text-gray-700 mb-1">
                      Date Range:
                    </Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Today">Today</SelectItem>
                        <SelectItem value="Yesterday">Yesterday</SelectItem>
                        <SelectItem value="This Week">This Week</SelectItem>
                        <SelectItem value="Last Week">Last Week</SelectItem>
                        <SelectItem value="This Month">This Month</SelectItem>
                        <SelectItem value="Last Month">Last Month</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="patient" className="text-xs font-medium text-gray-700 mb-1">
                      Patient:
                    </Label>
                    <Input
                      id="patient"
                      type="text"
                      value={patient}
                      onChange={(e) => setPatient(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="program" className="text-xs font-medium text-gray-700 mb-1">
                      Program:
                    </Label>
                    <Select value={program} onValueChange={setProgram}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        <SelectItem value="Mental Health">Mental Health</SelectItem>
                        <SelectItem value="Substance Abuse">Substance Abuse</SelectItem>
                        <SelectItem value="Primary Care">Primary Care</SelectItem>
                        <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryInsurance" className="text-xs font-medium text-gray-700 mb-1">
                      Primary Insurance:
                    </Label>
                    <Select value={primaryInsurance} onValueChange={setPrimaryInsurance}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Insurance</SelectItem>
                        <SelectItem value="Medicare">Medicare</SelectItem>
                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                        <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                        <SelectItem value="Self Pay">Self Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Second Row - Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="dateFrom" className="text-xs font-medium text-gray-700 mb-1">
                      From:
                    </Label>
                    <Input
                      id="dateFrom"
                      type="text"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-sm"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo" className="text-xs font-medium text-gray-700 mb-1">
                      To:
                    </Label>
                    <Input
                      id="dateTo"
                      type="text"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-sm"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="secondaryInsurance" className="text-xs font-medium text-gray-700 mb-1">
                      Secondary Insurance:
                    </Label>
                    <Select value={secondaryInsurance} onValueChange={setSecondaryInsurance}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Insurance</SelectItem>
                        <SelectItem value="Medicare">Medicare</SelectItem>
                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                        <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                        <SelectItem value="Self Pay">Self Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tertiaryInsurance" className="text-xs font-medium text-gray-700 mb-1">
                      Tertiary Insurance:
                    </Label>
                    <Select value={tertiaryInsurance} onValueChange={setTertiaryInsurance}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Insurance</SelectItem>
                        <SelectItem value="Medicare">Medicare</SelectItem>
                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                        <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                        <SelectItem value="Self Pay">Self Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="codeType" className="text-xs font-medium text-gray-700 mb-1">
                      Code Type:
                    </Label>
                    <Select value={codeType} onValueChange={setCodeType}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Code Types</SelectItem>
                        <SelectItem value="CPT4">CPT4</SelectItem>
                        <SelectItem value="HCPCS">HCPCS</SelectItem>
                        <SelectItem value="ICD10">ICD10</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    size="sm"
                    onClick={handleSearchEncounters}
                  >
                    <Icon icon="search" className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <div className="flex items-center gap-3">
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
                      onClick={handleExportCSV}
                    >
                      <Icon icon="file-csv" className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOfflineReports}
                    >
                      <Icon icon="folder" className="w-4 h-4 mr-2" />
                      Offline Reports
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Results Section */}
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-800">Report Results</h3>
              <p className="text-xs text-gray-600">
                In date BETWEEN 2025-10-19 00:00:00 AND 2025-10-19 23:59:59
              </p>
            </div>

            {/* Encounter Details Table */}
            <div className="flex-1 overflow-hidden bg-white m-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="h-full ag-theme-alpine">
                <AgGridReact
                  rowData={mockEncounterData}
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

export default EncounterDetailsPage
