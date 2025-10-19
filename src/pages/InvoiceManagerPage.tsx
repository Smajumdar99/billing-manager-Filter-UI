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
import { TooltipRoot, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/Tooltip/tooltip'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef } from 'ag-grid-community'

interface InvoiceRecord {
  person: string
  invoice: string
  svcDate: string
  lastStmt: string
  insuranceBal: string
  rendering: string
  claimId: string
  serviceCode: string
  units: number
  charge: string
  rulWritoff: string
  adjust: string
  insurance: string
  patientPaid: string
  balance: string
  byStatus: string
  prcStatus: string
  billedStatus: string
}

/**
 * InvoiceManagerPage Component
 * 
 * Invoice Manager for managing billing invoices with comprehensive filtering.
 */
export const InvoiceManagerPage: FC = () => {
  const navigate = useNavigate()
  useDocumentTitle('Invoice Manager')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Billing Manager')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter states - Group 1: Payment/Transaction Filters
  const [payer, setPayer] = useState('Persion')
  const [source, setSource] = useState('')
  const [payDate, setPayDate] = useState('')
  const [depositDate, setDepositDate] = useState('')
  const [amount, setAmount] = useState('')

  // Filter states - Group 2: Patient/Encounter Filters
  const [name, setName] = useState('')
  const [personId, setPersonId] = useState('')
  const [encounter, setEncounter] = useState('')
  const [svcDateFrom, setSvcDateFrom] = useState('')
  const [svcDateTo, setSvcDateTo] = useState('')
  const [status, setStatus] = useState('All')
  const [insuredStatus, setInsuredStatus] = useState('All')
  const [fundingSource, setFundingSource] = useState('')
  const [encounterStatus, setEncounterStatus] = useState('All')
  const [collectionStatus, setCollectionStatus] = useState('')
  const [program, setProgram] = useState('')

  // Mock data for the invoice table
  const mockInvoiceData: InvoiceRecord[] = [
    {
      person: 'A-AACO',
      invoice: '186 RHC',
      svcDate: '03/01/2025',
      lastStmt: '04/01/2025',
      insuranceBal: 'Default not available',
      rendering: 'Admin, Enochia',
      claimId: 'CPT4:Day/Cohn CPT4:Respnsh CPT4:Genrl',
      serviceCode: 'CPT4:Day/Cohn',
      units: 8,
      charge: '850.00',
      rulWritoff: '0.00',
      adjust: '0.00',
      insurance: '0.00',
      patientPaid: '0.00',
      balance: '850.00',
      byStatus: 'PI',
      prcStatus: 'Closed',
      billedStatus: 'Not Billed'
    },
    {
      person: 'A-AACO',
      invoice: 'G 4 App',
      svcDate: '02/07/2025',
      lastStmt: '04/01/2025',
      insuranceBal: 'Default not available',
      rendering: 'Examiner, Medical',
      claimId: 'HCPCS:H0031H0 HO HCPCS:H2014',
      serviceCode: 'HCPCS:H0031',
      units: 3,
      charge: '125.00',
      rulWritoff: '0.00',
      adjust: '3.00',
      insurance: '0.00',
      patientPaid: '0.00',
      balance: '122.00',
      byStatus: 'PI',
      prcStatus: 'Closed',
      billedStatus: 'Not Billed'
    },
    {
      person: 'A-AACO',
      invoice: 'G 4 App',
      svcDate: '02/07/2025',
      lastStmt: '04/01/2025',
      insuranceBal: 'Default not available',
      rendering: 'Examiner, Medical',
      claimId: 'CPT4:96446 CPT4:90791 CPT4:97535',
      serviceCode: 'CPT4:96446',
      units: 3,
      charge: '565.00',
      rulWritoff: '0.00',
      adjust: '0.00',
      insurance: '0.00',
      patientPaid: '0.00',
      balance: '565.00',
      byStatus: 'PI',
      prcStatus: 'Closed',
      billedStatus: 'Not Billed'
    },
    {
      person: 'SAP care hospital',
      invoice: 'G 4 App',
      svcDate: '06/07/2025',
      lastStmt: '04/01/2025',
      insuranceBal: 'Default not available',
      rendering: 'Examiner, Medical',
      claimId: 'CPT4:87188',
      serviceCode: 'CPT4:87188',
      units: 3,
      charge: '365.00',
      rulWritoff: '0.00',
      adjust: '0.00',
      insurance: '0.00',
      patientPaid: '0.00',
      balance: '365.00',
      byStatus: 'PI',
      prcStatus: 'Open',
      billedStatus: 'Billed'
    },
    {
      person: 'A-AACO',
      invoice: 'Q3PROO',
      svcDate: '10/22/2024',
      lastStmt: '04/01/2025',
      insuranceBal: 'Default not available',
      rendering: 'Admin, Enochia',
      claimId: 'CPT4:R0281-hg',
      serviceCode: 'CPT4:R0281-hg',
      units: 3,
      charge: '7,500.00',
      rulWritoff: '0.00',
      adjust: '0.00',
      insurance: '0.00',
      patientPaid: '0.00',
      balance: '7,500.00',
      byStatus: 'PI',
      prcStatus: 'Closed',
      billedStatus: 'Not Billed'
    }
  ]

  // Column definitions for AG Grid
  const columnDefs: ColDef<InvoiceRecord>[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left'
    },
    {
      headerName: 'Person',
      field: 'person',
      sortable: true,
      filter: true,
      width: 150,
      pinned: 'left'
    },
    {
      headerName: 'Invoice',
      field: 'invoice',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        return `<a href="#" style="color: #0066cc; text-decoration: underline;">${params.value}</a>`
      }
    },
    {
      headerName: 'Svc Date',
      field: 'svcDate',
      sortable: true,
      filter: true,
      width: 110
    },
    {
      headerName: 'Last Stmt',
      field: 'lastStmt',
      sortable: true,
      filter: true,
      width: 110
    },
    {
      headerName: 'Insurance(Bal)',
      field: 'insuranceBal',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Rendering',
      field: 'rendering',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Claim(s)',
      field: 'claimId',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      headerName: 'Service Code',
      field: 'serviceCode',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Unit(s)',
      field: 'units',
      sortable: true,
      filter: true,
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: 'Charge',
      field: 'charge',
      sortable: true,
      filter: true,
      width: 100,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Rul Writoff',
      field: 'rulWritoff',
      sortable: true,
      filter: true,
      width: 100,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Adjust',
      field: 'adjust',
      sortable: true,
      filter: true,
      width: 90,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Insurance',
      field: 'insurance',
      sortable: true,
      filter: true,
      width: 100,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Patient Paid',
      field: 'patientPaid',
      sortable: true,
      filter: true,
      width: 110,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'Balance',
      field: 'balance',
      sortable: true,
      filter: true,
      width: 100,
      cellStyle: { textAlign: 'right' }
    },
    {
      headerName: 'By Status',
      field: 'byStatus',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Prc Status',
      field: 'prcStatus',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      headerName: 'Billed Status',
      field: 'billedStatus',
      sortable: true,
      filter: true,
      width: 120
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
  const handleSearchInvoices = () => {
    console.log('Searching invoices with filters:', {
      // Group 1
      payer,
      source,
      payDate,
      depositDate,
      amount,
      // Group 2
      name,
      personId,
      encounter,
      svcDateFrom,
      svcDateTo,
      status,
      insuredStatus,
      fundingSource,
      encounterStatus,
      collectionStatus,
      program
    })
  }

  // Handle manage columns
  const handleManageColumns = () => {
    console.log('Manage columns clicked')
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
                    { label: 'Invoice Manager' }
                  ]}
                />
                <h1 className="text-lg font-semibold text-gray-900">
                  Invoice Manager
                </h1>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
              <div className="space-y-6">
                {/* Group 1: Payment/Transaction Filters */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment & Transaction Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="payer" className="text-xs font-medium text-gray-700 mb-1">
                        Payer:
                      </Label>
                      <Select value={payer} onValueChange={setPayer}>
                        <SelectTrigger className="text-sm bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Persion">Persion</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source" className="text-xs font-medium text-gray-700 mb-1">
                        Source:
                      </Label>
                      <Input
                        id="source"
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payDate" className="text-xs font-medium text-gray-700 mb-1">
                        Pay Date:
                      </Label>
                      <Input
                        id="payDate"
                        type="date"
                        value={payDate}
                        onChange={(e) => setPayDate(e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="depositDate" className="text-xs font-medium text-gray-700 mb-1">
                        Deposit Date:
                      </Label>
                      <Input
                        id="depositDate"
                        type="date"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label htmlFor="amount" className="text-xs font-medium text-gray-700">
                          Amount:
                        </Label>
                        <TooltipProvider>
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button type="button" className="text-blue-600 hover:text-blue-700">
                                <Icon icon="circle-info" className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-2xl p-4 bg-white text-gray-900 border border-gray-200 shadow-lg">
                              <div className="space-y-3 text-xs">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">EOB Data Entry Module</h4>
                                  <p className="text-gray-700">This module promotes efficient entry of EOB data.</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold mb-1">Input Fields</h5>
                                  <p className="text-gray-700">The initial window is the invoice search page. At the top you may enter a source (e.g. check number), pay date and check amount. The reason for the source and pay date is so that you don't have to enter them over and over again for each claim. The amount that you enter will be decreased for each invoice that is given part of the payment, and hopefully will end at zero when you are done.</p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-700">Just below the check information is a blue area where you put in your search parameters. You can search by patient name, chart number, encounter number or date of service, or any combination of these. You may also select whether you want to see all invoices, open invoices, or only invoices that are due (by the patient). Click the Search button to perform the search.</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold mb-1">Electronic Remits</h5>
                                  <p className="text-gray-700">Alternatively, you may use the search page to upload an electronic remittance (X12 835) file that you have obtained from your payer or clearinghouse. You can do this by clicking the Browse button and selecting the file to upload, and then clicking Search to perform the upload and display the corresponding invoices.</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold mb-1">Manual Posting</h5>
                                  <p className="text-gray-700">Upon searching you are presented with a list of invoices. You may click on one of the invoice numbers to open a second window, which is the data entry page for manual posting. The Source and Date columns are copied from the first page, so normally you will not need to touch those.</p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-700 font-medium">Pay attention to the "Done with" checkboxes. After the insurances are marked complete then we will start asking the patient to pay the remaining balance.</p>
                                </div>
                              </div>
                            </TooltipContent>
                          </TooltipRoot>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 2: Patient/Encounter Filters */}
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Patient & Encounter Filters</h3>
                  <div className="space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-xs font-medium text-gray-700 mb-1">
                          Name:
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="personId" className="text-xs font-medium text-gray-700 mb-1">
                          Person ID:
                        </Label>
                        <Input
                          id="personId"
                          type="text"
                          value={personId}
                          onChange={(e) => setPersonId(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="encounter" className="text-xs font-medium text-gray-700 mb-1">
                          Encounter:
                        </Label>
                        <Input
                          id="encounter"
                          type="text"
                          value={encounter}
                          onChange={(e) => setEncounter(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="svcDateFrom" className="text-xs font-medium text-gray-700 mb-1">
                          SVC Date From:
                        </Label>
                        <Input
                          id="svcDateFrom"
                          type="date"
                          value={svcDateFrom}
                          onChange={(e) => setSvcDateFrom(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="svcDateTo" className="text-xs font-medium text-gray-700 mb-1">
                          SVC Date To:
                        </Label>
                        <Input
                          id="svcDateTo"
                          type="date"
                          value={svcDateTo}
                          onChange={(e) => setSvcDateTo(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-xs font-medium text-gray-700 mb-1">
                          Status:
                        </Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger className="text-sm bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label htmlFor="insuredStatus" className="text-xs font-medium text-gray-700 mb-1">
                          Insured Status:
                        </Label>
                        <Select value={insuredStatus} onValueChange={setInsuredStatus}>
                          <SelectTrigger className="text-sm bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Insured">Insured</SelectItem>
                            <SelectItem value="Non Insured">Non Insured</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fundingSource" className="text-xs font-medium text-gray-700 mb-1">
                          Funding Source:
                        </Label>
                        <Input
                          id="fundingSource"
                          type="text"
                          value={fundingSource}
                          onChange={(e) => setFundingSource(e.target.value)}
                          className="text-sm bg-white"
                          placeholder="Select"
                        />
                      </div>
                      <div>
                        <Label htmlFor="encounterStatus" className="text-xs font-medium text-gray-700 mb-1">
                          Encounter Status:
                        </Label>
                        <Select value={encounterStatus} onValueChange={setEncounterStatus}>
                          <SelectTrigger className="text-sm bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="collectionStatus" className="text-xs font-medium text-gray-700 mb-1">
                          Collection Status:
                        </Label>
                        <Input
                          id="collectionStatus"
                          type="text"
                          value={collectionStatus}
                          onChange={(e) => setCollectionStatus(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="program" className="text-xs font-medium text-gray-700 mb-1">
                          Program:
                        </Label>
                        <Input
                          id="program"
                          type="text"
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    size="sm"
                    onClick={handleSearchInvoices}
                  >
                    <Icon icon="search" className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageColumns}
                  >
                    <Icon icon="cog" className="w-4 h-4 mr-2" />
                    Manage Columns
                  </Button>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="flex-1 overflow-hidden bg-white m-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="h-full ag-theme-alpine">
                <AgGridReact
                  rowData={mockInvoiceData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true
                  }}
                  rowSelection="multiple"
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

export default InvoiceManagerPage
