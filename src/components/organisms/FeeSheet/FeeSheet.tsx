import { FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/organisms/DataTable'
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import ColumnCustomizer, { ColumnConfig } from '@/components/molecules/ColumnCustomizer'
import FeeSheetDetails from './FeeSheetDetails'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface FeeSheetProps {
  patientId?: string
  patientName?: string
  className?: string
  /** If true, shows patient selector (for billing module context) */
  showPatientSelector?: boolean
}

/**
 * Fee Sheet Entry Interface
 * Represents a single billable service/charge entry
 */
interface FeeSheetEntry {
  id: string
  precedence: number
  date: string
  clientId: string
  clientName: string
  encounter: string
  codeDescription: string
  codeType: string
  code: string
  modifier: string
  justify: string
  units: number
  totalCharge: number
  priorAuthorization: string
  billed: boolean
  billDate: string
  originalCodeId: string
  billableService: string
  billingRuleId: string
  billingRule: string
  contractAmount: number
  codeSource: string
  codeSourceName: string
  lastLevelBilled: string
  lastLevelClosed: string
  emergencyFlag: boolean
  billType: string
  markedForRebilling: boolean
  codeBillableLevel: string
  lastModifiedOn: string
  lastModifiedBy: string
  action: string
  actionDate: string
}

// Mock patients for selector
const mockPatients: ComboboxOption[] = [
  { value: 'John Smith (1)', label: 'John Smith', description: 'PID: 1' },
  { value: '1001234', label: 'John Doe', description: 'PID: 1001234' },
  { value: '1001235', label: 'Jane Smith', description: 'PID: 1001235' },
  { value: '1001236', label: 'Robert Johnson', description: 'PID: 1001236' },
  { value: '1001237', label: 'Emily Davis', description: 'PID: 1001237' },
  { value: '1001238', label: 'Michael Brown', description: 'PID: 1001238' },
]

// Mock fee sheet data
const mockFeeSheetData: FeeSheetEntry[] = [
  // John Smith entries
  {
    id: 'FS101',
    precedence: 1,
    date: '12/02/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241202001',
    codeDescription: 'Individual Psychotherapy - 60 minutes',
    codeType: 'CPT',
    code: '90837',
    modifier: '',
    justify: 'F33.1',
    units: 1,
    totalCharge: 180.00,
    priorAuthorization: 'PA-2024-JS-001',
    billed: false,
    billDate: '',
    originalCodeId: 'OC101',
    billableService: 'Psychotherapy',
    billingRuleId: 'BR001',
    billingRule: 'Standard Rate',
    contractAmount: 180.00,
    codeSource: 'Manual',
    codeSourceName: 'Provider Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '12/02/2024 2:30 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'CURRENT',
    actionDate: '12/02/2024'
  },
  {
    id: 'FS102',
    precedence: 1,
    date: '11/29/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241129001',
    codeDescription: 'Medication Management - 30 minutes',
    codeType: 'CPT',
    code: '99214',
    modifier: '',
    justify: 'F33.1, F41.1',
    units: 1,
    totalCharge: 125.00,
    priorAuthorization: 'PA-2024-JS-001',
    billed: false,
    billDate: '',
    originalCodeId: 'OC102',
    billableService: 'Medication Management',
    billingRuleId: 'BR004',
    billingRule: 'Med Management Rate',
    contractAmount: 125.00,
    codeSource: 'Template',
    codeSourceName: 'Med Management Template',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 2',
    lastModifiedOn: '11/29/2024 11:15 AM',
    lastModifiedBy: 'Dr. Michael Chen',
    action: 'CURRENT',
    actionDate: '11/29/2024'
  },
  {
    id: 'FS103',
    precedence: 1,
    date: '11/26/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241126001',
    codeDescription: 'Crisis Intervention - 45 minutes',
    codeType: 'CPT',
    code: '90839',
    modifier: '',
    justify: 'F32.9',
    units: 1,
    totalCharge: 200.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC103',
    billableService: 'Crisis Intervention',
    billingRuleId: 'BR005',
    billingRule: 'Crisis Rate',
    contractAmount: 200.00,
    codeSource: 'Manual',
    codeSourceName: 'Emergency Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: true,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 3',
    lastModifiedOn: '11/26/2024 4:45 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'CURRENT',
    actionDate: '11/26/2024'
  },
  {
    id: 'FS104',
    precedence: 1,
    date: '11/22/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241122001',
    codeDescription: 'Psychological Testing - Administration',
    codeType: 'CPT',
    code: '96136',
    modifier: '',
    justify: 'F33.1',
    units: 2,
    totalCharge: 260.00,
    priorAuthorization: 'PA-2024-JS-002',
    billed: false,
    billDate: '',
    originalCodeId: 'OC104',
    billableService: 'Psychological Testing',
    billingRuleId: 'BR006',
    billingRule: 'Testing Rate',
    contractAmount: 130.00,
    codeSource: 'Schedule',
    codeSourceName: 'Testing Schedule',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 2',
    lastModifiedOn: '11/22/2024 3:20 PM',
    lastModifiedBy: 'Dr. Rebecca Stone',
    action: 'CURRENT',
    actionDate: '11/22/2024'
  },
  // Diagnosis codes (ICD) for John Smith
  {
    id: 'FS105',
    precedence: 1,
    date: '12/02/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241202001',
    codeDescription: 'Major depressive disorder, recurrent, moderate',
    codeType: 'ICD-10',
    code: 'F33.1',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC105',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Manual',
    codeSourceName: 'Provider Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '12/02/2024 2:30 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'INSERT',
    actionDate: '12/02/2024'
  },
  {
    id: 'FS106',
    precedence: 1,
    date: '11/29/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241129001',
    codeDescription: 'Generalized anxiety disorder',
    codeType: 'ICD-10',
    code: 'F41.1',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC106',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Manual',
    codeSourceName: 'Provider Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '11/29/2024 11:15 AM',
    lastModifiedBy: 'Dr. Michael Chen',
    action: 'INSERT',
    actionDate: '11/29/2024'
  },
  {
    id: 'FS107',
    precedence: 1,
    date: '11/26/2024',
    clientId: 'John Smith (1)',
    clientName: 'John Smith',
    encounter: 'E20241126001',
    codeDescription: 'Depressive episode, unspecified',
    codeType: 'ICD-10',
    code: 'F32.9',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC107',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Manual',
    codeSourceName: 'Emergency Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: true,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '11/26/2024 4:45 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'INSERT',
    actionDate: '11/26/2024'
  },
  // Other patients
  {
    id: 'FS001',
    precedence: 1,
    date: '12/01/2024',
    clientId: '1001234',
    clientName: 'John Doe',
    encounter: 'E20241201001',
    codeDescription: 'Individual Psychotherapy - 45 minutes',
    codeType: 'CPT',
    code: '90834',
    modifier: '',
    justify: 'F41.1',
    units: 1,
    totalCharge: 150.00,
    priorAuthorization: 'PA-2024-001',
    billed: false,
    billDate: '',
    originalCodeId: 'OC001',
    billableService: 'Psychotherapy',
    billingRuleId: 'BR001',
    billingRule: 'Standard Rate',
    contractAmount: 150.00,
    codeSource: 'Manual',
    codeSourceName: 'Provider Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '12/01/2024 10:30 AM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'CURRENT',
    actionDate: '12/01/2024'
  },
  {
    id: 'FS002',
    precedence: 1,
    date: '11/28/2024',
    clientId: '1001234',
    clientName: 'John Doe',
    encounter: 'E20241128002',
    codeDescription: 'Psychiatric Diagnostic Evaluation',
    codeType: 'CPT',
    code: '90791',
    modifier: '',
    justify: 'F32.9',
    units: 1,
    totalCharge: 250.00,
    priorAuthorization: 'PA-2024-001',
    billed: true,
    billDate: '11/30/2024',
    originalCodeId: 'OC002',
    billableService: 'Evaluation',
    billingRuleId: 'BR002',
    billingRule: 'Evaluation Rate',
    contractAmount: 250.00,
    codeSource: 'Template',
    codeSourceName: 'Initial Eval Template',
    lastLevelBilled: 'Primary',
    lastLevelClosed: 'Closed',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 2',
    lastModifiedOn: '11/28/2024 2:15 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'CURRENT',
    actionDate: '11/28/2024'
  },
  {
    id: 'FS003',
    precedence: 1,
    date: '11/25/2024',
    clientId: '1001235',
    clientName: 'Jane Smith',
    encounter: 'E20241125003',
    codeDescription: 'Group Psychotherapy',
    codeType: 'CPT',
    code: '90853',
    modifier: '',
    justify: 'F43.10',
    units: 1,
    totalCharge: 75.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC003',
    billableService: 'Group Therapy',
    billingRuleId: 'BR003',
    billingRule: 'Group Rate',
    contractAmount: 75.00,
    codeSource: 'Schedule',
    codeSourceName: 'Group Session Schedule',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '11/25/2024 3:45 PM',
    lastModifiedBy: 'Dr. Michael Chen',
    action: 'CURRENT',
    actionDate: '11/25/2024'
  },
  // Diagnosis codes for John Doe
  {
    id: 'FS004',
    precedence: 1,
    date: '12/01/2024',
    clientId: '1001234',
    clientName: 'John Doe',
    encounter: 'E20241201001',
    codeDescription: 'Generalized anxiety disorder',
    codeType: 'ICD-10',
    code: 'F41.1',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC008',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Manual',
    codeSourceName: 'Provider Entry',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '12/01/2024 10:30 AM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'INSERT',
    actionDate: '12/01/2024'
  },
  {
    id: 'FS005',
    precedence: 1,
    date: '11/28/2024',
    clientId: '1001234',
    clientName: 'John Doe',
    encounter: 'E20241128002',
    codeDescription: 'Depressive episode, unspecified',
    codeType: 'ICD-10',
    code: 'F32.9',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: true,
    billDate: '11/30/2024',
    originalCodeId: 'OC009',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Template',
    codeSourceName: 'Initial Eval Template',
    lastLevelBilled: 'Primary',
    lastLevelClosed: 'Closed',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '11/28/2024 2:15 PM',
    lastModifiedBy: 'Dr. Sarah Wilson',
    action: 'INSERT',
    actionDate: '11/28/2024'
  },
  // Diagnosis codes for Jane Smith
  {
    id: 'FS006',
    precedence: 1,
    date: '11/25/2024',
    clientId: '1001235',
    clientName: 'Jane Smith',
    encounter: 'E20241125003',
    codeDescription: 'Post-traumatic stress disorder, unspecified',
    codeType: 'ICD-10',
    code: 'F43.10',
    modifier: '',
    justify: '',
    units: 1,
    totalCharge: 0.00,
    priorAuthorization: '',
    billed: false,
    billDate: '',
    originalCodeId: 'OC010',
    billableService: 'Diagnosis',
    billingRuleId: 'BR007',
    billingRule: 'Diagnosis Code',
    contractAmount: 0.00,
    codeSource: 'Schedule',
    codeSourceName: 'Group Session Schedule',
    lastLevelBilled: '',
    lastLevelClosed: '',
    emergencyFlag: false,
    billType: 'Professional',
    markedForRebilling: false,
    codeBillableLevel: 'Level 1',
    lastModifiedOn: '11/25/2024 3:45 PM',
    lastModifiedBy: 'Dr. Michael Chen',
    action: 'INSERT',
    actionDate: '11/25/2024'
  },
]

/**
 * FeeSheet Component
 * 
 * Reusable fee sheet component that can be embedded in different contexts:
 * - Patient details page (OldUI) - Shows fee sheets for the current patient
 * - Billing module pages - Shows patient selector and all unbilled fee sheets
 * - Standalone fee sheet page
 */
export const FeeSheet: FC<FeeSheetProps> = ({
  patientId,
  patientName,
  className = '',
  showPatientSelector = false
}) => {
  const navigate = useNavigate()
  const [selectedPatients, setSelectedPatients] = useState<string[]>(patientId ? [patientId] : [])
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceType, setServiceType] = useState<'all' | 'procedures' | 'icds'>('all')
  const [selectedEncounter, setSelectedEncounter] = useState<string>('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)

  // Handle opening fee sheet details
  const handleOpenDetails = (entry?: any) => {
    setSelectedEntry(entry || null)
    setShowDetailsModal(true)
  }

  // Handle saving fee sheet details
  const handleSaveDetails = (data: any) => {
    console.log('Saving fee sheet details:', data)
    // TODO: Implement save logic
  }

  // Column configuration state
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { id: 'id', label: 'ID', visible: true, category: 'basic' },
    { id: 'date', label: 'Date', visible: true, category: 'dates' },
    { id: 'client', label: 'Client', visible: true, category: 'basic', required: true },
    { id: 'encounter', label: 'Encounter', visible: true, category: 'basic' },
    { id: 'codeDescription', label: 'Code Description', visible: true, category: 'basic' },
    { id: 'codeType', label: 'Code Type', visible: true, category: 'basic' },
    { id: 'code', label: 'Code', visible: true, category: 'basic' },
    { id: 'modifier', label: 'Modifier', visible: true, category: 'additional' },
    { id: 'justify', label: 'Justify', visible: true, category: 'basic' },
    { id: 'units', label: 'Units', visible: true, category: 'basic' },
    { id: 'totalCharge', label: 'Total Charge', visible: true, category: 'basic', required: true },
    { id: 'priorAuthorization', label: 'Prior Authorization', visible: true, category: 'additional' },
    { id: 'billed', label: 'Billed', visible: true, category: 'basic' },
    { id: 'billDate', label: 'Bill Date', visible: true, category: 'dates' },
    { id: 'billableService', label: 'Billable Service', visible: true, category: 'additional' },
    { id: 'billingRule', label: 'Billing Rule', visible: true, category: 'additional' },
    { id: 'contractAmount', label: 'Contract Amount', visible: true, category: 'additional' },
    { id: 'codeSource', label: 'Code Source', visible: true, category: 'additional' },
    { id: 'codeSourceName', label: 'Code Source Name', visible: true, category: 'additional' },
    { id: 'lastLevelBilled', label: 'Last Level Billed', visible: true, category: 'additional' },
    { id: 'lastLevelClosed', label: 'Last Level Closed', visible: true, category: 'additional' },
    { id: 'emergency', label: 'Emergency', visible: true, category: 'basic' },
    { id: 'billType', label: 'Bill Type', visible: true, category: 'additional' },
    { id: 'markedForRebilling', label: 'Marked for Rebilling', visible: true, category: 'additional' },
    { id: 'lastModifiedOn', label: 'Last Modified On', visible: true, category: 'dates' },
    { id: 'lastModifiedBy', label: 'Last Modified By', visible: true, category: 'dates' },
    { id: 'action', label: 'Action', visible: true, category: 'additional' },
    { id: 'actionDate', label: 'Action Date', visible: true, category: 'dates' },
    { id: 'actions', label: 'Actions', visible: true, category: 'basic', required: true },
  ])

  // Get unique encounters for filter dropdown
  const uniqueEncounters = useMemo(() => {
    const encounters = new Set<string>()
    mockFeeSheetData.forEach(entry => {
      if (entry.encounter) {
        encounters.add(entry.encounter)
      }
    })
    return Array.from(encounters).sort()
  }, [])

  // Filter data based on context
  const filteredData = useMemo(() => {
    // In billing module context, don't load data until patient is selected
    if (showPatientSelector && selectedPatients.length === 0) {
      return []
    }

    let data = mockFeeSheetData

    // If in patient details context (patientId provided), filter by that patient
    if (patientId && !showPatientSelector) {
      console.log('FeeSheet: Filtering for patient ID:', patientId)
      // Try exact match first, then partial match (for flexible ID formats)
      data = data.filter(entry => {
        const exactMatch = entry.clientId === patientId
        const containsMatch = entry.clientId.includes(patientId) || patientId.includes(entry.clientId)
        const match = exactMatch || containsMatch
        if (match) {
          console.log('FeeSheet: Matched entry:', entry.id, entry.clientName)
        }
        return match
      })
      console.log('FeeSheet: Filtered data count:', data.length)
    }
    // If in billing module context with patient selector (single patient)
    else if (showPatientSelector && selectedPatients.length > 0) {
      data = data.filter(entry => entry.clientId === selectedPatients[0])
    }

    // Apply service type filter
    if (serviceType === 'procedures') {
      // Filter for CPT codes (procedures)
      data = data.filter(entry => entry.codeType === 'CPT')
    } else if (serviceType === 'icds') {
      // Filter for ICD codes (diagnosis) - in justify field
      data = data.filter(entry => entry.justify && entry.justify.trim() !== '')
    }

    // Apply encounter filter
    if (selectedEncounter !== 'all') {
      data = data.filter(entry => entry.encounter === selectedEncounter)
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(entry =>
        entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.encounter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.codeDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Show only unbilled entries by default
    return data.filter(entry => !entry.billed)
  }, [patientId, selectedPatients, searchTerm, serviceType, selectedEncounter, showPatientSelector])

  // All column definitions for AG Grid
  const allColumnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      minWidth: 100,
      pinned: 'left' as const,
      cellRenderer: (params: any) => (
        <button
          onClick={() => navigate(`/fee-sheet/${params.data.id}`)}
          className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline py-2 cursor-pointer"
          title="View Fee Sheet Details"
        >
          {params.data.id}
        </button>
      )
    },
    {
      headerName: 'Date',
      field: 'date',
      minWidth: 110,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.date}</div>
      )
    },
    {
      headerName: 'Client',
      field: 'clientName',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <div className="text-sm font-semibold text-gray-900">{params.data.clientName}</div>
          <div className="text-xs text-gray-500">ID: {params.data.clientId}</div>
        </div>
      )
    },
    {
      headerName: 'Encounter',
      field: 'encounter',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <button
          onClick={() => navigate('/add-encounter', { state: { encounterId: params.data.encounter, mode: 'edit' } })}
          className="flex items-center gap-2 text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline py-2 cursor-pointer"
          title="Edit Encounter"
        >
          <PencilIcon className="w-4 h-4" />
          {params.data.encounter}
        </button>
      )
    },
    {
      headerName: 'Code Description',
      field: 'codeDescription',
      minWidth: 250,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.codeDescription}</div>
      )
    },
    {
      headerName: 'Code Type',
      field: 'codeType',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className="text-xs">
          {params.data.codeType}
        </Badge>
      )
    },
    {
      headerName: 'Code',
      field: 'code',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="text-sm font-mono font-semibold text-gray-900 py-2">{params.data.code}</div>
      )
    },
    {
      headerName: 'Modifier',
      field: 'modifier',
      minWidth: 90,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.modifier || '-'}</div>
      )
    },
    {
      headerName: 'Justify',
      field: 'justify',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="text-sm font-mono text-gray-700 py-2">{params.data.justify}</div>
      )
    },
    {
      headerName: 'Units',
      field: 'units',
      minWidth: 80,
      cellRenderer: (params: any) => (
        <div className="text-sm text-center text-gray-700 py-2">{params.data.units}</div>
      )
    },
    {
      headerName: 'Total Charge',
      field: 'totalCharge',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm font-semibold text-green-700 py-2">
          ${params.data.totalCharge.toFixed(2)}
        </div>
      )
    },
    {
      headerName: 'Prior Authorization',
      field: 'priorAuthorization',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.priorAuthorization || '-'}</div>
      )
    },
    {
      headerName: 'Billed',
      field: 'billed',
      minWidth: 90,
      cellRenderer: (params: any) => (
        <div className="py-2 flex items-center justify-center">
          {params.data.billed ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      )
    },
    {
      headerName: 'Bill Date',
      field: 'billDate',
      minWidth: 110,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.billDate || '-'}</div>
      )
    },
    {
      headerName: 'Billable Service',
      field: 'billableService',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.billableService}</div>
      )
    },
    {
      headerName: 'Billing Rule',
      field: 'billingRule',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.billingRule}</div>
      )
    },
    {
      headerName: 'Contract Amount',
      field: 'contractAmount',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">
          ${params.data.contractAmount.toFixed(2)}
        </div>
      )
    },
    {
      headerName: 'Code Source',
      field: 'codeSource',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.codeSource}</div>
      )
    },
    {
      headerName: 'Code Source Name',
      field: 'codeSourceName',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.codeSourceName}</div>
      )
    },
    {
      headerName: 'Last Level Billed',
      field: 'lastLevelBilled',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastLevelBilled || '-'}</div>
      )
    },
    {
      headerName: 'Last Level Closed',
      field: 'lastLevelClosed',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastLevelClosed || '-'}</div>
      )
    },
    {
      headerName: 'Emergency',
      field: 'emergencyFlag',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="py-2">
          {params.data.emergencyFlag && (
            <Badge variant="destructive" className="text-xs">Emergency</Badge>
          )}
        </div>
      )
    },
    {
      headerName: 'Bill Type',
      field: 'billType',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.billType}</div>
      )
    },
    {
      headerName: 'Marked for Rebilling',
      field: 'markedForRebilling',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="py-2 flex items-center justify-center">
          {params.data.markedForRebilling ? (
            <Badge variant="destructive" className="text-xs">Rebill</Badge>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      )
    },
    {
      headerName: 'Last Modified On',
      field: 'lastModifiedOn',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastModifiedOn}</div>
      )
    },
    {
      headerName: 'Last Modified By',
      field: 'lastModifiedBy',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastModifiedBy}</div>
      )
    },
    {
      headerName: 'Action',
      field: 'action',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className="text-xs">
          {params.data.action}
        </Badge>
      )
    },
    {
      headerName: 'Action Date',
      field: 'actionDate',
      minWidth: 110,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.actionDate}</div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 120,
      maxWidth: 120,
      pinned: 'right' as const,
      lockPosition: true,
      suppressMovable: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 py-2 bg-white">
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-7 w-7"
            onClick={() => handleOpenDetails(params.data)}
            title="Edit Fee Sheet"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => console.log('Delete:', params.data.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ]

  // Map column field names to config IDs
  const columnFieldToId: Record<string, string> = {
    'id': 'id',
    'date': 'date',
    'clientName': 'client',
    'encounter': 'encounter',
    'codeDescription': 'codeDescription',
    'codeType': 'codeType',
    'code': 'code',
    'modifier': 'modifier',
    'justify': 'justify',
    'units': 'units',
    'totalCharge': 'totalCharge',
    'priorAuthorization': 'priorAuthorization',
    'billed': 'billed',
    'billDate': 'billDate',
    'billableService': 'billableService',
    'billingRule': 'billingRule',
    'contractAmount': 'contractAmount',
    'codeSource': 'codeSource',
    'codeSourceName': 'codeSourceName',
    'lastLevelBilled': 'lastLevelBilled',
    'lastLevelClosed': 'lastLevelClosed',
    'emergencyFlag': 'emergency',
    'billType': 'billType',
    'markedForRebilling': 'markedForRebilling',
    'lastModifiedOn': 'lastModifiedOn',
    'lastModifiedBy': 'lastModifiedBy',
    'action': 'action',
    'actionDate': 'actionDate',
    'actions': 'actions',
  }

  // Filter columns based on visibility
  const columnDefs = useMemo(() => {
    return allColumnDefs.filter(col => {
      const configId = columnFieldToId[col.field as string]
      const config = columnConfigs.find(c => c.id === configId)
      return config?.visible !== false
    })
  }, [columnConfigs])

  const gridOptions = {
    pagination: true,
    paginationPageSize: 50,
    suppressCellFocus: true,
    rowHeight: 60,
    headerHeight: 48,
    suppressHorizontalScroll: false,
  }

  return (
    <div className={cn('h-full flex flex-col bg-gray-50', className)}>
      {/* Header Section - Compact & Sleek */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-col gap-3">
          {/* Title and Actions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Fee Sheet</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {showPatientSelector 
                    ? 'Manage unbilled charges and services' 
                    : `Unbilled charges for ${patientName || 'patient'}`
                  }
                </p>
              </div>
              
              {/* Patient Selector - Inline with title */}
              {showPatientSelector && (
                <div className="w-64">
                  <Combobox
                    options={mockPatients}
                    value={selectedPatients}
                    onChange={setSelectedPatients}
                    placeholder="Select a patient..."
                    multiple={false}
                    hideFilters={true}
                    keepOpenOnSelect={false}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5">
                <ArrowPathIcon className="w-3.5 h-3.5" />
                Refresh
              </Button>
              <Button size="sm" className="h-8 px-3 text-xs gap-1.5">
                Process Billing
              </Button>
            </div>
          </div>

          {/* Search and Stats Row - Only show when there's data or patient is selected */}
          {(!showPatientSelector || selectedPatients.length > 0) && (
            <div className="flex items-center justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by client, encounter, code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
                <Select value={selectedEncounter} onValueChange={setSelectedEncounter}>
                  <SelectTrigger className="w-44 h-8 text-xs">
                    <SelectValue placeholder="All Encounters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Encounters</SelectItem>
                    {uniqueEncounters.map(encounter => (
                      <SelectItem key={encounter} value={encounter}>
                        {encounter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="procedures">Procedures (CPT)</SelectItem>
                    <SelectItem value="icds">Diagnosis (ICD)</SelectItem>
                  </SelectContent>
                </Select>
                <ColumnCustomizer
                  columns={columnConfigs}
                  onColumnsChange={setColumnConfigs}
                  className="h-8 text-xs"
                />
              </div>

              {/* Summary Stats - Compact */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Entries:</span>
                  <span className="font-semibold text-gray-900">{filteredData.length}</span>
                </div>
                <div className="h-3 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-semibold text-green-700">
                    ${filteredData.reduce((sum, entry) => sum + entry.totalCharge, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden p-3">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showPatientSelector && selectedPatients.length === 0
                ? 'Select a Patient to Get Started'
                : 'No Fee Sheets Found'}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              {showPatientSelector && selectedPatients.length === 0
                ? 'Please select a patient from the dropdown above to view their encounter fee sheets.'
                : 'No unbilled fee sheets found. Fee sheets are automatically created when encounters are added.'}
            </p>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto">
            <div style={{ minWidth: '1400px', height: '600px' }}>
              <DataTable
                rowData={filteredData}
                columnDefs={columnDefs}
                className="w-full h-full rounded-lg"
                gridOptions={gridOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fee Sheet Details Modal */}
      <FeeSheetDetails
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        feeSheetId={selectedEntry?.id}
        patientName={selectedEntry?.clientName || patientName}
        encounterId={selectedEntry?.encounter}
        onSave={handleSaveDetails}
      />
    </div>
  )
}

export default FeeSheet
