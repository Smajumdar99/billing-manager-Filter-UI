import { FC, useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/input'
import { Checkbox } from '@/components/atoms/Checkbox/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { DataTable } from '@/components/organisms/DataTable/index'
import { ColDef } from 'ag-grid-community'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Label } from '@/components/atoms/Label/label'
import { Calendar } from '@/components/atoms/Calendar/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/Popover/popover'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { Switch } from '@/components/atoms/Switch/switch'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

/**
 * Statement Encounter Interface
 * Based on the screenshot, statements show encounter-level billing information
 */
interface StatementEncounter {
  id: string
  facility: string
  person: string
  invoice: string
  svcDate: string // Service Date
  lastStmt: string // Last Statement Date
  renderingProvider: string
  claims: string
  serviceCode: string
  units: number
  charge: number
  adjust: number
  insurancePaid: number
  patientPaid: number
  balance: number
  bySource: string // Insurance source (Ins1, Pt, etc.)
  encounterStatus: string
  billedStatus: string
}

/**
 * StatementPage Component
 * 
 * Comprehensive statement management page for viewing and managing patient statements.
 * Features filtering, column customization, bulk actions, and summary totals.
 */
export const StatementPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title
  useDocumentTitle('Statements')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Statements')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // State for location address
  const [locationAddress, setLocationAddress] = useState('Primary Biz. Location')

  // State for filters
  const [encounterFacility, setEncounterFacility] = useState('')
  const [serviceDateFrom, setServiceDateFrom] = useState<Date | undefined>()
  const [serviceDateTo, setServiceDateTo] = useState<Date | undefined>()
  const [claimNumber, setClaimNumber] = useState('')
  const [onlyBilledEncounters, setOnlyBilledEncounters] = useState(false)
  const [onlyBalanceDue, setOnlyBalanceDue] = useState(false)
  const [encounterStatus, setEncounterStatus] = useState('All')
  const [collectionStatus, setCollectionStatus] = useState('All')

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    person: true,
    followUpReason: true,
    encounterStatus: true,
    facility: true,
    serviceCode: true,
    renderingProvider: true,
  })

  // State for column customizer popover
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false)

  // State for selected encounters
  const [selectedEncounters, setSelectedEncounters] = useState<string[]>([])

  // Mock data based on screenshot
  const mockEncounters: StatementEncounter[] = [
    {
      id: '1',
      facility: '1111ADiamond1111',
      person: '',
      invoice: '1004146.100206915',
      svcDate: '09/18/2025',
      lastStmt: '',
      renderingProvider: 'alle, Vaishali',
      claims: '',
      serviceCode: 'CPT4:333-Tom',
      units: 1,
      charge: 300.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 300.00,
      bySource: 'Ins1',
      encounterStatus: 'Closed',
      billedStatus: 'Not Billed',
    },
    {
      id: '2',
      facility: 'Facility',
      person: '',
      invoice: '1004146.100206903',
      svcDate: '08/29/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 6,
      charge: 750.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 750.00,
      bySource: 'Pt',
      encounterStatus: 'Closed',
      billedStatus: 'Not Billed',
    },
    {
      id: '3',
      facility: '1111ADiamond1111',
      person: '',
      invoice: '1004146.100206895',
      svcDate: '08/11/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:333-Tom',
      units: 1,
      charge: 300.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 300.00,
      balance: 0.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '4',
      facility: 'A-AADO',
      person: '',
      invoice: '1004146.100206896',
      svcDate: '08/06/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 2,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 150.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '5',
      facility: 'Vision care',
      person: '',
      invoice: '1004146.100206893',
      svcDate: '08/06/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:333-Tom',
      units: 1,
      charge: 300.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 300.00,
      balance: 0.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '6',
      facility: 'testing billing fac',
      person: '',
      invoice: '1004146.100206831',
      svcDate: '07/22/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 2,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 150.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '7',
      facility: '1111ADiamond1111 Facility',
      person: '',
      invoice: '1004146.100206328',
      svcDate: '06/27/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 2,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 150.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '8',
      facility: 'Waverock Hosiptals',
      person: '',
      invoice: '1004146.100206331',
      svcDate: '06/21/2025',
      lastStmt: '06/21/2025',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90791-HF',
      units: 1,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 150.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '9',
      facility: 'APOLL\'O1234',
      person: '',
      invoice: '1004146.100206326',
      svcDate: '06/20/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90832',
      units: 1,
      charge: 130.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 130.00,
      balance: 0.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '10',
      facility: 'Waverock Hosiptals',
      person: '',
      invoice: '1004146.100206329',
      svcDate: '06/19/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:012345-Engerix',
      units: 1,
      charge: 25.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 25.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '11',
      facility: 'A-AADO',
      person: '',
      invoice: '1004146.100206321',
      svcDate: '05/30/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:97116, CPT4:90791, CPT4:99244, CPT4:99355',
      units: 4,
      charge: 165.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 165.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '12',
      facility: 'A-AADO',
      person: '',
      invoice: '1004146.100206319',
      svcDate: '05/30/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: '',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 2,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 150.00,
      balance: 0.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Billed',
    },
    {
      id: '13',
      facility: 'Waverock Hosiptals',
      person: '',
      invoice: '1004146.100206291',
      svcDate: '04/15/2025',
      lastStmt: '',
      renderingProvider: 'Admin, Ensoftek',
      claims: 'P-1004146-1006385202(TEST)',
      serviceCode: 'CPT4:90375, HCPCS:H0050',
      units: 2,
      charge: 150.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 150.00,
      balance: 0.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
    {
      id: '14',
      facility: 'B-ACTS',
      person: '',
      invoice: '1004146.100206255',
      svcDate: '12/25/2024',
      lastStmt: '',
      renderingProvider: '',
      claims: '',
      serviceCode: 'CPT4:90296, HCPCS:H0018',
      units: 2,
      charge: 475.00,
      adjust: 0.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balance: 475.00,
      bySource: 'Pt',
      encounterStatus: 'Open',
      billedStatus: 'Not Billed',
    },
  ]

  // Filter encounters based on filters
  const filteredEncounters = useMemo(() => {
    return mockEncounters.filter(encounter => {
      // Encounter Facility filter
      if (encounterFacility && encounterFacility !== 'all' && encounterFacility !== '') {
        if (!encounter.facility.toLowerCase().includes(encounterFacility.toLowerCase())) {
          return false
        }
      }

      // Service Date Range filter
      if (serviceDateFrom || serviceDateTo) {
        try {
          // Parse MM/DD/YYYY format
          const [month, day, year] = encounter.svcDate.split('/')
          const svcDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          if (serviceDateFrom && svcDate < serviceDateFrom) return false
          if (serviceDateTo && svcDate > serviceDateTo) return false
        } catch (e) {
          // Invalid date, skip this filter
        }
      }

      // Claim Number filter
      if (claimNumber && claimNumber.trim() !== '') {
        const encounterClaims = encounter.claims || ''
        if (!encounterClaims.toLowerCase().includes(claimNumber.toLowerCase())) {
          return false
        }
      }

      // Only billed encounters filter
      if (onlyBilledEncounters && encounter.billedStatus !== 'Billed') {
        return false
      }

      // Only encounters with balance due filter
      if (onlyBalanceDue && encounter.balance === 0) {
        return false
      }

      // Encounter Status filter
      if (encounterStatus !== 'All' && encounter.encounterStatus !== encounterStatus) {
        return false
      }

      return true
    })
  }, [encounterFacility, serviceDateFrom, serviceDateTo, claimNumber, onlyBilledEncounters, onlyBalanceDue, encounterStatus])

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    return filteredEncounters.reduce(
      (acc, encounter) => ({
        charge: acc.charge + encounter.charge,
        adjust: acc.adjust + encounter.adjust,
        insurancePaid: acc.insurancePaid + encounter.insurancePaid,
        patientPaid: acc.patientPaid + encounter.patientPaid,
        balance: acc.balance + encounter.balance,
      }),
      { charge: 0, adjust: 0, insurancePaid: 0, patientPaid: 0, balance: 0 }
    )
  }, [filteredEncounters])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Handle navigation
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

  const handleSidebarSelect = (itemLabel: string) => {
    setActiveSidebarItem(itemLabel)
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

  // Handle search
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setEncounterFacility('')
    setServiceDateFrom(undefined)
    setServiceDateTo(undefined)
    setClaimNumber('')
    setOnlyBilledEncounters(false)
    setOnlyBalanceDue(false)
    setEncounterStatus('All')
    setCollectionStatus('All')
  }

  // Handle actions
  const handlePrint = () => {
    console.log('Print statements')
    window.print()
  }

  const handlePDFDownload = () => {
    console.log('Download PDF for selected statements:', selectedEncounters)
  }

  const handleEmailStatements = () => {
    console.log('Email patient statements for selected:', selectedEncounters)
  }

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    const cols: ColDef[] = [
      {
        headerName: '',
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        suppressMenu: true,
      },
    ]

    // Facility is always visible (core column)
    cols.push({
      headerName: 'Facility',
      field: 'facility',
      minWidth: 150,
      flex: 1,
    })

    if (columnVisibility.person) {
      cols.push({
        headerName: 'Person',
        field: 'person',
        minWidth: 120,
        flex: 1,
      })
    }

    cols.push({
      headerName: 'Invoice',
      field: 'invoice',
      minWidth: 180,
      flex: 1,
    })

    cols.push({
      headerName: 'Svc Date',
      field: 'svcDate',
      minWidth: 100,
      flex: 1,
    })

    cols.push({
      headerName: 'Last Stmt',
      field: 'lastStmt',
      minWidth: 100,
      flex: 1,
    })

    // Rendering Provider is always visible (core column)
    cols.push({
      headerName: 'Rendering Provider',
      field: 'renderingProvider',
      minWidth: 150,
      flex: 1,
    })

    cols.push({
      headerName: 'Claim(s)',
      field: 'claims',
      minWidth: 150,
      flex: 1,
    })

    // Service Code is always visible (core column)
    cols.push({
      headerName: 'Service Code',
      field: 'serviceCode',
      minWidth: 200,
      flex: 1,
    })

    cols.push({
      headerName: 'Unit(s)',
      field: 'units',
      minWidth: 80,
      flex: 1,
      cellStyle: { textAlign: 'right' },
    })

    cols.push({
      headerName: 'Charge',
      field: 'charge',
      minWidth: 100,
      flex: 1,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => formatCurrency(params.value),
    })

    cols.push({
      headerName: 'Adjust',
      field: 'adjust',
      minWidth: 100,
      flex: 1,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => formatCurrency(params.value),
    })

    cols.push({
      headerName: 'Insurance Paid',
      field: 'insurancePaid',
      minWidth: 120,
      flex: 1,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => formatCurrency(params.value),
    })

    cols.push({
      headerName: 'Patient Paid',
      field: 'patientPaid',
      minWidth: 120,
      flex: 1,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => formatCurrency(params.value),
    })

    cols.push({
      headerName: 'Balance',
      field: 'balance',
      minWidth: 100,
      flex: 1,
      cellStyle: { textAlign: 'right', fontWeight: 'bold' },
      valueFormatter: (params) => formatCurrency(params.value),
    })

    cols.push({
      headerName: 'By Source',
      field: 'bySource',
      minWidth: 100,
      flex: 1,
    })

    if (columnVisibility.encounterStatus) {
      cols.push({
        headerName: 'Encounter Status',
        field: 'encounterStatus',
        minWidth: 130,
        flex: 1,
      })
    }

    cols.push({
      headerName: 'Billed Status',
      field: 'billedStatus',
      minWidth: 120,
      flex: 1,
    })

    return cols
  }, [columnVisibility])

  // Debug: Log data and columns
  useEffect(() => {
    console.log('=== STATEMENT PAGE DEBUG ===')
    console.log('Filtered encounters count:', filteredEncounters.length)
    console.log('All filtered encounters:', filteredEncounters)
    console.log('Sample encounter:', filteredEncounters[0])
    console.log('Column definitions count:', columnDefs.length)
    console.log('Column definitions:', columnDefs)
    console.log('===========================')
  }, [filteredEncounters, columnDefs])

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
          onSearch={() => {}}
          onCollapsedChange={setSidebarCollapsed}
          defaultCollapsed={sidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="min-h-full flex flex-col">
            {/* Header Section with Breadcrumb */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Breadcrumb Navigation */}
                <Breadcrumb
                  items={[
                    { label: 'Billing', href: '/billing' },
                    { label: 'Statements' }
                  ]}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2"
                  >
                    <Icon icon="print" className="w-4 h-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePDFDownload}
                    className="gap-2"
                    disabled={selectedEncounters.length === 0}
                  >
                    <Icon icon="file-alt" className="w-4 h-4" />
                    PDF Download Selected Statements
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailStatements}
                    className="gap-2"
                    disabled={selectedEncounters.length === 0}
                  >
                    <Icon icon="envelope" className="w-4 h-4" />
                    Email Patient Statements
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location Address */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Location Address:
                  </Label>
                  <Select value={locationAddress} onValueChange={setLocationAddress}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary Biz. Location">Primary Biz. Location</SelectItem>
                      <SelectItem value="Secondary Location">Secondary Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Encounter Facility */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Encounter Facility:
                  </Label>
                  <Select value={encounterFacility || 'all'} onValueChange={(value) => setEncounterFacility(value === 'all' ? '' : value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="1111ADiamond1111">1111ADiamond1111</SelectItem>
                      <SelectItem value="Facility">Facility</SelectItem>
                      <SelectItem value="A-AADO">A-AADO</SelectItem>
                      <SelectItem value="Vision care">Vision care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Date Range */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Svc Date:
                  </Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal"
                        >
                          {serviceDateFrom ? format(serviceDateFrom, 'MM/dd/yyyy') : 'From'}
                          <Icon icon="calendar" className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={serviceDateFrom}
                          onSelect={setServiceDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-sm text-gray-500">To:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal"
                        >
                          {serviceDateTo ? format(serviceDateTo, 'MM/dd/yyyy') : 'To'}
                          <Icon icon="calendar" className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={serviceDateTo}
                          onSelect={setServiceDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Claim # */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Claim #:
                  </Label>
                  <Input
                    type="text"
                    value={claimNumber}
                    onChange={(e) => setClaimNumber(e.target.value)}
                    placeholder="Enter claim number"
                    className="flex-1"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="only-billed"
                      checked={onlyBilledEncounters}
                      onCheckedChange={(checked) => setOnlyBilledEncounters(checked === true)}
                    />
                    <Label htmlFor="only-billed" className="text-sm text-gray-700 cursor-pointer">
                      Only billed encounters
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="only-balance-due"
                      checked={onlyBalanceDue}
                      onCheckedChange={(checked) => setOnlyBalanceDue(checked === true)}
                    />
                    <Label htmlFor="only-balance-due" className="text-sm text-gray-700 cursor-pointer">
                      Only encounters with balance due
                    </Label>
                  </div>
                </div>

                {/* Status Dropdowns */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Encounter status:
                  </Label>
                  <Select value={encounterStatus} onValueChange={setEncounterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Collection Status:
                  </Label>
                  <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {}}
                    className="gap-2"
                  >
                    <Icon icon="search" className="w-4 h-4" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="gap-2"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Column Customizer Section */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
              <div className="flex items-center justify-end">
                <Popover open={isColumnCustomizerOpen} onOpenChange={setIsColumnCustomizerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-white hover:bg-gray-50 text-xs"
                    >
                      <AdjustmentsHorizontalIcon className="w-4 h-4" />
                      Columns ({columnDefs.length})
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Customize Columns</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-person" className="text-sm text-gray-700 cursor-pointer">
                            Person
                          </Label>
                          <Switch
                            id="col-person"
                            checked={columnVisibility.person}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, person: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-follow-up" className="text-sm text-gray-700 cursor-pointer">
                            Follow-up Reason
                          </Label>
                          <Switch
                            id="col-follow-up"
                            checked={columnVisibility.followUpReason}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, followUpReason: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-encounter-status" className="text-sm text-gray-700 cursor-pointer">
                            Encounter Status
                          </Label>
                          <Switch
                            id="col-encounter-status"
                            checked={columnVisibility.encounterStatus}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, encounterStatus: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-facility" className="text-sm text-gray-700 cursor-pointer">
                            Facility
                          </Label>
                          <Switch
                            id="col-facility"
                            checked={columnVisibility.facility}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, facility: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-service-code" className="text-sm text-gray-700 cursor-pointer">
                            Service Code
                          </Label>
                          <Switch
                            id="col-service-code"
                            checked={columnVisibility.serviceCode}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, serviceCode: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-rendering-provider" className="text-sm text-gray-700 cursor-pointer">
                            Rendering Provider
                          </Label>
                          <Switch
                            id="col-rendering-provider"
                            checked={columnVisibility.renderingProvider}
                            onCheckedChange={(checked) =>
                              setColumnVisibility((prev) => ({ ...prev, renderingProvider: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{columnDefs.length} columns visible</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsColumnCustomizerOpen(false)}
                          className="text-xs"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="flex-1 bg-white px-4 sm:px-6 py-4 overflow-hidden">
              <div className="w-full" style={{ height: '600px' }}>
                {filteredEncounters.length > 0 && columnDefs.length > 0 ? (
                  <DataTable
                    rowData={filteredEncounters}
                    columnDefs={columnDefs}
                    gridOptions={{
                      rowSelection: 'multiple',
                      onSelectionChanged: (event) => {
                        const selectedRows = event.api.getSelectedRows()
                        setSelectedEncounters(selectedRows.map((row) => row.id))
                      },
                      pagination: true,
                      paginationPageSize: 20,
                      domLayout: 'normal',
                      suppressCellFocus: true,
                      animateRows: true,
                      rowHeight: 40,
                      headerHeight: 40,
                      defaultColDef: {
                        sortable: true,
                        filter: true,
                        resizable: true,
                        minWidth: 100,
                        flex: 1,
                      },
                    }}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>
                      {filteredEncounters.length === 0 
                        ? `No encounters found matching the current filters.` 
                        : `Loading table... (${filteredEncounters.length} encounters, ${columnDefs.length} columns)`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Totals Section */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex justify-end">
                <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-[400px]">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Total:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Charge:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(summaryTotals.charge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Adjust:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(summaryTotals.adjust)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Insurance Paid:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(summaryTotals.insurancePaid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Patient Paid:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(summaryTotals.patientPaid)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-sm font-semibold text-gray-900">Balance:</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(summaryTotals.balance)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-sm text-gray-600">Undistributed Amount:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(426.00)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-sm font-semibold text-gray-900">Total Balance Due:</span>
                      <span className="text-sm font-bold text-red-600">{formatCurrency(1889.00)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatementPage

