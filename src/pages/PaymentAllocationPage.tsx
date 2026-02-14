import { FC, useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import { Checkbox } from '@/components/atoms/Checkbox'
import { Switch } from '@/components/atoms/Switch/switch'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { Autocomplete, AutocompleteOption } from '@/components/atoms/Autocomplete/Autocomplete'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef } from 'ag-grid-community'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, ArrowUp, ArrowDown } from "lucide-react"

// Rebill Switch Renderer
const RebillSwitchRenderer = (params: any) => {
  if (params.node.rowPinned) {
    return null
  }

  const handleChange = (checked: boolean) => {
    if (params.node && params.node.setDataValue) {
      params.node.setDataValue(params.colDef.field, checked)
    }
  }

  return (
    <div className="flex items-center justify-center h-full pointer-events-auto">
      <Switch
        checked={params.value === true}
        onCheckedChange={handleChange}
        className="scale-75"
      />
    </div>
  )
}

// Follow Up Switch Renderer
const FollowUpSwitchRenderer = (params: any) => {
  if (params.node.rowPinned) {
    return null
  }

  const handleChange = (checked: boolean) => {
    if (params.node && params.node.setDataValue) {
      params.node.setDataValue(params.colDef.field, checked ? 'Yes' : 'No')
    }
  }

  return (
    <div className="flex items-center justify-center h-full pointer-events-auto">
      <Switch
        checked={params.value === 'Yes'}
        onCheckedChange={handleChange}
        className="scale-75"
      />
    </div>
  )
}

// Actions Cell Renderer
const ActionsCellRenderer = (params: any) => {
  if (params.node.rowPinned) {
    return null
  }

  const handleInsertAbove = () => {
    params.context.onInsertRow(params.data.id, 'before')
  }

  const handleInsertBelow = () => {
    params.context.onInsertRow(params.data.id, 'after')
  }

  const handleDelete = () => {
    params.context.onDeleteRow(params.data.id)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[9999]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleInsertAbove}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Insert Row Above
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleInsertBelow}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Insert Row Below
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Row
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Post For Select Cell Renderer Component
const PostForCellRenderer = (params: any) => {
  const [value, setValue] = useState(params.value || 'Patient')
  
  // Update value when params change (e.g., when data is refreshed)
  useEffect(() => {
    setValue(params.value || 'Patient')
  }, [params.value])

  if (params.node.rowPinned) {
    return (
      <div className="w-full h-full flex items-center px-2 font-bold text-gray-700">
        {params.value}
      </div>
    )
  }
  
  // Mock data for patients and insurance companies
  const options = [
    // Patient option (single option since allocation is for a particular patient)
    { value: 'Patient', label: 'Patient', type: 'patient' },
    // Insurance Companies
    { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield', type: 'insurance' },
    { value: 'Aetna', label: 'Aetna', type: 'insurance' },
    { value: 'UnitedHealthcare', label: 'UnitedHealthcare', type: 'insurance' },
    { value: 'Cigna', label: 'Cigna', type: 'insurance' },
    { value: 'Medicare', label: 'Medicare', type: 'insurance' },
    { value: 'Medicaid', label: 'Medicaid', type: 'insurance' },
  ]

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    // Update the cell value in AG Grid
    params.setValue(newValue)
    // Update the underlying data
    if (params.node && params.node.data) {
      params.node.setDataValue(params.colDef.field!, newValue)
    }
  }

  return (
    <div className="w-full h-full flex items-center px-2">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-8 w-full text-xs border-none shadow-none focus:ring-0 bg-transparent">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className="z-[9999] max-h-[300px]">
          {options.filter(opt => opt.type === 'patient').map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-1">Insurance Companies</div>
          {options.filter(opt => opt.type === 'insurance').map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Adj Reason Cell Renderer
const AdjReasonCellRenderer = (params: any) => {
  const [value, setValue] = useState(params.value || '')

  useEffect(() => {
    setValue(params.value || '')
  }, [params.value])

  if (params.node.rowPinned) {
    return null
  }

  const options = [
    'Contractual adjustment',
    'Co-payment',
    'Deductible',
    'Coinsurance',
    'Patient responsibility',
    'Write-off',
    'Other'
  ]

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    params.setValue(newValue)
    if (params.node && params.node.data) {
      params.node.setDataValue(params.colDef.field!, newValue)
    }
  }

  return (
    <div className="w-full h-full flex items-center px-2">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-8 w-full text-xs border-none shadow-none focus:ring-0 bg-transparent">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-xs">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Adj Group Code Cell Renderer
const AdjGroupCodeCellRenderer = (params: any) => {
  const [value, setValue] = useState(params.value || '')

  useEffect(() => {
    setValue(params.value || '')
  }, [params.value])

  if (params.node.rowPinned) {
    return null
  }

  const options = ['CO', 'PR', 'OA', 'PI', 'OA2']

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    params.setValue(newValue)
    if (params.node && params.node.data) {
      params.node.setDataValue(params.colDef.field!, newValue)
    }
  }

  return (
    <div className="w-full h-full flex items-center px-2">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-8 w-full text-xs border-none shadow-none focus:ring-0 bg-transparent">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-xs">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Done With Cell Renderer
const DoneWithCellRenderer = (params: any) => {
  const [value, setValue] = useState(params.value || 'Person')

  useEffect(() => {
    setValue(params.value || 'Person')
  }, [params.value])

  if (params.node.rowPinned) {
    return null
  }

  const options = ['Person', 'PayerX']

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    params.setValue(newValue)
    if (params.node && params.node.data) {
      params.node.setDataValue(params.colDef.field!, newValue)
    }
  }

  return (
    <div className="w-full h-full flex items-center px-2">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-8 w-full text-xs border-none shadow-none focus:ring-0 bg-transparent">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-xs">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Service interface
interface Service {
  id: string
  postFor: string
  serviceDate: string
  encProgram: string
  encounter: string
  renderingProvider: string
  serviceCode: string
  charge: number
  copay: number
  balance: number
  allowed: number
  payment: number
  capitation: number
  adjAmount: number
  adjReason: string
  adjGroupCode: string
  deductible: number
  recoupment: number
  doneWith: string
  rebill: boolean
  followUp: string
  followUpReason: string
  actions?: any
}

// Mock service data
const mockServices: Service[] = [
  {
    id: 'SVC-001',
    postFor: 'Patient',
    serviceDate: '2024-10-15',
    encProgram: '1NF',
    encounter: 'ENC-12345',
    renderingProvider: 'Dr. Sarah Williams',
    serviceCode: '99213',
    charge: 250.00,
    copay: 25.00,
    balance: 225.00,
    allowed: 200.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-002',
    postFor: 'Patient',
    serviceDate: '2024-10-15',
    encProgram: 'Methadone Services',
    encounter: 'ENC-12345',
    renderingProvider: 'Dr. Sarah Williams',
    serviceCode: '80053',
    charge: 300.00,
    copay: 0.00,
    balance: 300.00,
    allowed: 250.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 30.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-003',
    postFor: 'Patient',
    serviceDate: '2024-10-18',
    encProgram: 'OT',
    encounter: 'ENC-12346',
    renderingProvider: 'Dr. Michael Brown',
    serviceCode: '99214',
    charge: 400.00,
    copay: 40.00,
    balance: 360.00,
    allowed: 350.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-004',
    postFor: 'Patient',
    serviceDate: '2024-10-20',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12347',
    renderingProvider: 'Dr. Sarah Williams',
    serviceCode: '99213',
    charge: 250.00,
    copay: 25.00,
    balance: 225.00,
    allowed: 200.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-005',
    postFor: 'Patient',
    serviceDate: '2024-10-21',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12348',
    renderingProvider: 'Dr. Michael Brown',
    serviceCode: '99214',
    charge: 400.00,
    copay: 40.00,
    balance: 360.00,
    allowed: 350.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-006',
    postFor: 'Patient',
    serviceDate: '2024-10-22',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12349',
    renderingProvider: 'Dr. Sarah Williams',
    serviceCode: '99213',
    charge: 250.00,
    copay: 25.00,
    balance: 225.00,
    allowed: 200.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-007',
    postFor: 'Patient',
    serviceDate: '2024-10-23',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12350',
    renderingProvider: 'Dr. Michael Brown',
    serviceCode: '99214',
    charge: 400.00,
    copay: 40.00,
    balance: 360.00,
    allowed: 350.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-008',
    postFor: 'Patient',
    serviceDate: '2024-10-24',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12351',
    renderingProvider: 'Dr. Sarah Williams',
    serviceCode: '99213',
    charge: 250.00,
    copay: 25.00,
    balance: 225.00,
    allowed: 200.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Person',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  },
  {
    id: 'SVC-009',
    postFor: 'Patient',
    serviceDate: '2024-10-25',
    encProgram: 'Adult A&D Outpatient Services',
    encounter: 'ENC-12352',
    renderingProvider: 'Dr. Michael Brown',
    serviceCode: '99214',
    charge: 400.00,
    copay: 40.00,
    balance: 360.00,
    allowed: 350.00,
    payment: 0.00,
    capitation: 0.00,
    adjAmount: 50.00,
    adjReason: 'Contractual adjustment',
    adjGroupCode: 'CO',
    deductible: 0.00,
    recoupment: 0.00,
    doneWith: 'Pending',
    rebill: false,
    followUp: 'No',
    followUpReason: ''
  }
]

// Payment details interface
interface PaymentDetails {
  dateOfEntry: string
  paymentMethod: string
  checkRefNumber: string
  paymentAmount: string
  payingEntity: string
  paymentCategory: string
  location: string
  paymentFrom: string
  paymentReceivedBy: string
  description: string
  undistributed: string
}

/**
 * PaymentAllocationPage Component
 * 
 * Page for allocating payments to specific services/invoices.
 */
const PaymentAllocationPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  useDocumentTitle('Payment Allocation')

  // Get payment details from location state or use defaults
  const paymentDetails: PaymentDetails = location.state?.paymentDetails || {
    dateOfEntry: new Date().toISOString().split('T')[0],
    paymentMethod: 'Check Payment',
    checkRefNumber: '',
    paymentAmount: '0.00',
    payingEntity: 'Insurance',
    paymentCategory: 'Funding Source',
    location: '',
    paymentFrom: '',
    paymentReceivedBy: 'Admin, Ensoftek',
    description: '',
    undistributed: '0.00'
  }

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Payments')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Filter states
  const [person, setPerson] = useState('')
  const [personId, setPersonId] = useState('')
  const [show, setShow] = useState('All Transactions')
  const [services, setServices] = useState('All')
  const [doneWith, setDoneWith] = useState('all')
  const [rebill, setRebill] = useState(false)
  const [claimNumber, setClaimNumber] = useState('')
  const [serviceFrom, setServiceFrom] = useState('')
  const [serviceTo, setServiceTo] = useState('')

  // Service data state - using state so we can update it
  const [serviceData, setServiceData] = useState<Service[]>(mockServices)
  const [filteredServiceData, setFilteredServiceData] = useState<Service[]>(mockServices)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())

  // Mock person/patient options for autocomplete
  const personOptions: AutocompleteOption[] = [
    { value: 'John Doe', label: 'John Doe', code: 'P001' },
    { value: 'Jane Smith', label: 'Jane Smith', code: 'P002' },
    { value: 'Robert Johnson', label: 'Robert Johnson', code: 'P003' },
    { value: 'Mary Williams', label: 'Mary Williams', code: 'P004' },
    { value: 'Michael Brown', label: 'Michael Brown', code: 'P005' },
    { value: 'Sarah Davis', label: 'Sarah Davis', code: 'P006' },
  ]

  // Update personId when person is selected
  useEffect(() => {
    if (person) {
      const selectedPerson = personOptions.find(opt => opt.value === person || opt.label === person)
      if (selectedPerson && selectedPerson.code) {
        setPersonId(selectedPerson.code)
      }
    } else {
      setPersonId('')
    }
  }, [person])

  // Handle cell value changes
  const handleCellValueChanged = (params: any) => {
    const updatedData = serviceData.map(service => {
      if (service.id === params.data.id) {
        return { ...service, [params.colDef.field]: params.newValue }
      }
      return service
    })
    setServiceData(updatedData)
  }

  // Column definitions for services table
  const serviceColumnDefs: ColDef<Service>[] = [
    {
      headerName: 'Post For',
      field: 'postFor',
      width: 200,
      pinned: 'left',
      editable: true,
      cellRenderer: PostForCellRenderer,
      cellStyle: { 
        padding: '0',
        display: 'flex',
        alignItems: 'center'
      }
    },
    {
      headerName: 'Service Date',
      field: 'serviceDate',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : ''
      }
    },
    {
      headerName: 'Enc Program',
      field: 'encProgram',
      width: 120
    },
    {
      headerName: 'Encounter',
      field: 'encounter',
      width: 120
    },
    {
      headerName: 'Rendering Provider',
      field: 'renderingProvider',
      width: 180
    },
    {
      headerName: 'Service Code',
      field: 'serviceCode',
      width: 120
    },
    {
      headerName: 'Charge',
      field: 'charge',
      width: 100,
      type: 'rightAligned',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      }
    },
    {
      headerName: 'Copay',
      field: 'copay',
      width: 100,
      type: 'rightAligned',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      }
    },
    {
      headerName: 'Balance',
      field: 'balance',
      width: 100,
      type: 'rightAligned',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      }
    },
    {
      headerName: 'Allowed',
      field: 'allowed',
      width: 100,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Payment',
      field: 'payment',
      width: 100,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Capitation',
      field: 'capitation',
      width: 120,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Adj Amount',
      field: 'adjAmount',
      width: 120,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Adj Reason',
      field: 'adjReason',
      width: 180,
      editable: true,
      cellRenderer: AdjReasonCellRenderer,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC',
        padding: '0',
        display: 'flex',
        alignItems: 'center'
      }
    },
    {
      headerName: 'Adj Group Code',
      field: 'adjGroupCode',
      width: 140,
      editable: true,
      cellRenderer: AdjGroupCodeCellRenderer,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC',
        padding: '0',
        display: 'flex',
        alignItems: 'center'
      }
    },
    {
      headerName: 'Deductible',
      field: 'deductible',
      width: 100,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Recoupment',
      field: 'recoupment',
      width: 120,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        precision: 2
      },
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      },
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '$0.00'
      },
      valueParser: (params: any) => {
        return params.newValue ? parseFloat(params.newValue) : 0
      }
    },
    {
      headerName: 'Done With',
      field: 'doneWith',
      width: 120,
      editable: true,
      cellRenderer: DoneWithCellRenderer,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC',
        padding: '0',
        display: 'flex',
        alignItems: 'center'
      }
    },
    {
      headerName: 'Rebill',
      field: 'rebill',
      width: 80,
      cellRenderer: RebillSwitchRenderer,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }
    },
    {
      headerName: 'Follow Up',
      field: 'followUp',
      width: 100,
      cellRenderer: FollowUpSwitchRenderer,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }
    },
    {
      headerName: 'Follow Up Reason',
      field: 'followUpReason',
      width: 180,
      flex: 1,
      editable: true,
      cellStyle: { 
        backgroundColor: '#f0f9ff',
        cursor: 'pointer',
        borderLeft: '2px solid #1C75BC'
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: ActionsCellRenderer,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      },
      sortable: false,
      filter: false,
      resizable: false
    }
  ]

  // Update personId when person is selected
  useEffect(() => {
    if (person) {
      const selectedPerson = personOptions.find(opt => opt.value === person || opt.label === person)
      if (selectedPerson && selectedPerson.code) {
        setPersonId(selectedPerson.code)
      }
    } else {
      setPersonId('')
    }
  }, [person])

  // Filter services based on selected person and other filters
  useEffect(() => {
    let filtered = [...serviceData]

    // Filter by person (if selected)
    // Note: In a real application, services would have a personId or personName field
    // For now, when a person is selected, we show all services
    // In production, you would filter like: filtered = filtered.filter(service => service.personId === personId)

    // Filter by other criteria
    if (doneWith && doneWith !== '' && doneWith !== 'all') {
      filtered = filtered.filter(service => service.doneWith === doneWith)
    }

    if (services && services !== 'All') {
      filtered = filtered.filter(service => service.encProgram === services)
    }

    if (rebill) {
      filtered = filtered.filter(service => service.rebill === true)
    }

    if (claimNumber && claimNumber.trim() !== '') {
      // Filter by claim number if we had that field
      // filtered = filtered.filter(service => service.claimNumber?.includes(claimNumber))
    }

    setFilteredServiceData(filtered)
  }, [person, personId, show, services, doneWith, rebill, claimNumber, serviceFrom, serviceTo, serviceData])

  // Handle search
  const handleSearch = useCallback(() => {
    console.log('Searching services with filters:', {
      person,
      personId,
      show,
      services,
      doneWith,
      rebill,
      claimNumber,
      serviceFrom,
      serviceTo
    })
    // Filtering is now handled by useEffect above
  }, [person, personId, show, services, doneWith, rebill, claimNumber, serviceFrom, serviceTo])

  // Handle adding a new row (add to top)
  const handleAddRow = useCallback(() => {
    setServiceData(prev => {
      // If there are existing rows, copy data from the first one
      const referenceRow = prev.length > 0 ? prev[0] : null
      
      const newRow: Service = {
        id: `NEW-${Date.now()}`,
        postFor: 'Patient',
        serviceDate: new Date().toISOString().split('T')[0],
        encProgram: referenceRow ? referenceRow.encProgram : '',
        encounter: referenceRow ? referenceRow.encounter : '',
        renderingProvider: referenceRow ? referenceRow.renderingProvider : '',
        serviceCode: referenceRow ? referenceRow.serviceCode : '',
        charge: 0,
        copay: 0,
        balance: 0,
        allowed: 0,
        payment: 0,
        capitation: 0,
        adjAmount: 0,
        adjReason: '',
        adjGroupCode: '',
        deductible: 0,
        recoupment: 0,
        doneWith: 'Person',
        rebill: false,
        followUp: 'No',
        followUpReason: ''
      }
      
      return [newRow, ...prev]
    })
  }, [])

  // Handle inserting a row before or after a specific row
  const handleInsertRow = useCallback((targetId: string, position: 'before' | 'after') => {
    setServiceData(prev => {
      const index = prev.findIndex(row => row.id === targetId)
      if (index === -1) return prev
      
      const targetRow = prev[index]
      
      const newRow: Service = {
        id: `NEW-${Date.now()}`,
        postFor: 'Patient',
        serviceDate: new Date().toISOString().split('T')[0],
        encProgram: targetRow.encProgram,
        encounter: targetRow.encounter,
        renderingProvider: targetRow.renderingProvider,
        serviceCode: targetRow.serviceCode,
        charge: 0,
        copay: 0,
        balance: 0,
        allowed: 0,
        payment: 0,
        capitation: 0,
        adjAmount: 0,
        adjReason: '',
        adjGroupCode: '',
        deductible: 0,
        recoupment: 0,
        doneWith: 'Person',
        rebill: false,
        followUp: 'No',
        followUpReason: ''
      }

      const newData = [...prev]
      if (position === 'before') {
        newData.splice(index, 0, newRow)
      } else {
        newData.splice(index + 1, 0, newRow)
      }
      return newData
    })
  }, [])

  // Handle deleting a row
  const handleDeleteRow = useCallback((id: string) => {
    setServiceData(prev => prev.filter(row => row.id !== id))
  }, [])

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

  const handleSearchNav = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
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

  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Billing', href: '/billing' },
    { label: 'Payments', href: '/payments' },
    { label: 'New Payment', href: '/new-payment' },
    { label: 'Payment Allocation' }
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Navigation Bar */}
        <TopNavigationBar
          onNavigation={handleMainNavigation}
          onSearch={handleSearchNav}
        />

        {/* Main Navigation Bar */}
        <MainNavigationBar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <Sidebar
            activeItem={activeSidebarItem}
            onItemSelect={handleSidebarSelect}
            onSearch={handleSidebarSearch}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
            isMobile={isMobile}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
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
                
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Icon icon="money-bill-wave" className="w-5 h-5 text-[#1C75BC]" />
                    Payment Allocation
                  </h1>
                </div>
              </div>

              <div className="mt-4">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-white">
              <div className="max-w-full mx-auto space-y-6">
                {/* Payment Details Summary - Compact */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Date Of Entry:</span>
                      <span className="font-medium text-gray-900">{new Date(paymentDetails.dateOfEntry).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Check/Ref Number:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.checkRefNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Payment Amount:</span>
                      <span className="font-medium text-gray-900">${parseFloat(paymentDetails.paymentAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Paying Entity:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.payingEntity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Payment Category:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.paymentCategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Payment From:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.paymentFrom || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Payment Received by:</span>
                      <span className="font-medium text-gray-900">{paymentDetails.paymentReceivedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Undistributed:</span>
                      <span className="font-medium text-red-700">${parseFloat(paymentDetails.undistributed).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Service Selection Form */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    {/* Filter Form */}
                    <div className="space-y-4">
                      {/* Top Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <Label htmlFor="person" className="text-xs font-medium text-gray-700 mb-1">
                              Person:
                            </Label>
                          <Autocomplete
                            options={personOptions}
                              value={person}
                            onChange={setPerson}
                            placeholder="Type to search person..."
                            className="text-sm w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="show" className="text-xs font-medium text-gray-700 mb-1">
                            Show:
                          </Label>
                          <Select value={show} onValueChange={setShow}>
                            <SelectTrigger className="text-sm h-9 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All Transactions">All Transactions</SelectItem>
                              <SelectItem value="Unpaid Only">Unpaid Only</SelectItem>
                              <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                              <SelectItem value="Fully Paid">Fully Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="services" className="text-xs font-medium text-gray-700 mb-1">
                            Services:
                          </Label>
                          <Select value={services} onValueChange={setServices}>
                            <SelectTrigger className="text-sm h-9 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Outpatient">Outpatient</SelectItem>
                              <SelectItem value="Inpatient">Inpatient</SelectItem>
                              <SelectItem value="Emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="doneWith" className="text-xs font-medium text-gray-700 mb-1">
                            Done With:
                          </Label>
                          <Select value={doneWith} onValueChange={setDoneWith}>
                            <SelectTrigger className="text-sm h-9 w-full">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="Change to next level">Change to next level</SelectItem>
                              <SelectItem value="Reset to original">Reset to original</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col">
                          <Label htmlFor="rebill" className="text-xs font-medium text-gray-700 mb-1">
                            &nbsp;
                          </Label>
                          <div className="flex items-center h-9 gap-2">
                            <Checkbox
                              id="rebill"
                              checked={rebill}
                              onCheckedChange={(checked: boolean | string) => setRebill(checked === true)}
                            />
                            <Label htmlFor="rebill" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Rebill:
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor="claimNumber" className="text-xs font-medium text-gray-700 mb-1">
                            Claim number:
                          </Label>
                          <Input
                            id="claimNumber"
                            type="text"
                            value={claimNumber}
                            onChange={(e) => setClaimNumber(e.target.value)}
                            placeholder="Enter claim number"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceFrom" className="text-xs font-medium text-gray-700 mb-1">
                            Service From:
                          </Label>
                          <div className="relative">
                            <Input
                              id="serviceFrom"
                              type="date"
                              value={serviceFrom}
                              onChange={(e) => setServiceFrom(e.target.value)}
                              className="text-sm pr-10"
                            />
                            <Icon 
                              icon="calendar" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="serviceTo" className="text-xs font-medium text-gray-700 mb-1">
                            Service To:
                          </Label>
                          <div className="relative">
                            <Input
                              id="serviceTo"
                              type="date"
                              value={serviceTo}
                              onChange={(e) => setServiceTo(e.target.value)}
                              className="text-sm pr-10"
                            />
                            <Icon 
                              icon="calendar" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={handleSearch}
                            className="w-full bg-[#1C75BC] hover:bg-[#155a94] text-white"
                          >
                            <Icon icon="search" className="w-4 h-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Table */}
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-end mb-4">
                      <Button 
                        onClick={handleAddRow}
                        variant="outline" 
                        size="sm"
                        className="text-[#1C75BC] border-dashed border-[#1C75BC] bg-blue-50/50 hover:bg-blue-50"
                      >
                        <Icon icon="plus" className="w-4 h-4 mr-2" />
                        Add Adjustment / Service Line
                      </Button>
                    </div>

                    <div className="ag-theme-alpine mb-4" style={{ width: '100%' }}>
                      <AgGridReact
                        rowData={filteredServiceData}
                        columnDefs={serviceColumnDefs}
                        defaultColDef={{
                          sortable: true,
                          filter: true,
                          resizable: true,
                        }}
                        domLayout="autoHeight"
                        suppressCellFocus={true}
                        rowSelection="multiple"
                        rowHeight={35}
                        headerHeight={40}
                        pinnedBottomRowData={[{
                          postFor: 'Total',
                          serviceDate: undefined,
                          encProgram: undefined,
                          encounter: undefined,
                          renderingProvider: undefined,
                          serviceCode: undefined,
                          charge: filteredServiceData.reduce((sum, row) => sum + (row.charge || 0), 0),
                          copay: filteredServiceData.reduce((sum, row) => sum + (row.copay || 0), 0),
                          balance: filteredServiceData.reduce((sum, row) => sum + (row.balance || 0), 0),
                          allowed: filteredServiceData.reduce((sum, row) => sum + (row.allowed || 0), 0),
                          payment: filteredServiceData.reduce((sum, row) => sum + (row.payment || 0), 0),
                          capitation: filteredServiceData.reduce((sum, row) => sum + (row.capitation || 0), 0),
                          adjAmount: filteredServiceData.reduce((sum, row) => sum + (row.adjAmount || 0), 0),
                          adjReason: undefined,
                          adjGroupCode: undefined,
                          deductible: filteredServiceData.reduce((sum, row) => sum + (row.deductible || 0), 0),
                          recoupment: filteredServiceData.reduce((sum, row) => sum + (row.recoupment || 0), 0),
                          doneWith: undefined,
                          rebill: undefined,
                          followUp: undefined,
                          followUpReason: undefined,
                          actions: undefined
                        }]}
                        onSelectionChanged={(params) => {
                          const selectedIds = params.api.getSelectedRows().map((row: Service) => row.id)
                          setSelectedServices(new Set(selectedIds))
                        }}
                        onCellValueChanged={handleCellValueChanged}
                        context={{
                          onInsertRow: handleInsertRow,
                          onDeleteRow: handleDeleteRow
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/payments')}
                      className="text-[#1C75BC] border-[#1C75BC] hover:bg-[#1C75BC] hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('Allocating payment to selected services:', Array.from(selectedServices))
                        // Allocation logic will be implemented here
                        navigate('/payments')
                      }}
                      className="bg-[#1C75BC] hover:bg-[#155a94] text-white"
                    >
                      Allocate Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default PaymentAllocationPage

