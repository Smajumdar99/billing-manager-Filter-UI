import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input/input'
import { Badge } from '@/components/atoms/Badge/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { Sidebar } from '@/components/organisms/Sidebar/sidebar'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'

// Unified code entry interface
interface FeeSheetCode {
  id: string
  precedence: number
  source?: string
  type: 'ICD-10' | 'CPT' | 'HCPCS' | 'Revenue'
  code: string
  description: string
  units?: number
  chargeAmount?: number
  modifier1?: string
  modifier2?: string
  linkedDiagnoses?: string[] // For procedures, which diagnoses they're linked to
  // Additional fields
  adjType?: 'Patient' | 'Payer1' | 'Payer2' | 'Payer3'
  reason?: string
  adjGroupCode?: string
  justify?: string
  provider?: string
  notes?: string
  billable?: 'Billable' | 'Non-Billable'
  nd?: string
  qty?: number
  qtyUnit?: 'ml' | 'grams' | 'milligrams' | 'iu' | 'units'
}

// Mock codes for search
const mockCodes = {
  'ICD-10': [
    { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
  ],
  'CPT': [
    { code: '90837', description: 'Psychotherapy, 60 minutes with patient' },
    { code: '90834', description: 'Psychotherapy, 45 minutes with patient' },
    { code: '90832', description: 'Psychotherapy, 30 minutes with patient' },
    { code: '99214', description: 'Office visit, established patient, moderate complexity' },
    { code: '99213', description: 'Office visit, established patient, low complexity' },
    { code: '96136', description: 'Psychological or neuropsychological test administration' },
    { code: '99205', description: 'Office visit, new patient, high complexity' },
  ],
  'HCPCS': [
    { code: 'G0438', description: 'Annual wellness visit; includes a personalized prevention plan' },
    { code: 'G0439', description: 'Annual wellness visit; subsequent' },
    { code: 'J3490', description: 'Unclassified drugs' },
  ],
  'Revenue': [
    { code: '0450', description: 'Emergency room - General classification' },
    { code: '0510', description: 'Clinic - General classification' },
  ]
}

// Mock data for dropdowns
const adjGroupCodes = ['CO', 'PR', 'OA', 'PI', 'CR']
const justifyCodes = ['A04.9', 'E11.9', 'I10', 'J44.9', 'M79.3', 'R50.9']
const providers = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis']
const qtyUnits = ['ml', 'grams', 'milligrams', 'iu', 'units']

/**
 * FeeSheetDetailsPage Component
 * 
 * Full-page fee sheet management interface for healthcare billing
 * Allows users to add/edit services, link diagnoses, and manage charge details
 */
export const FeeSheetDetailsPage: FC = () => {
  const navigate = useNavigate()
  const { feeSheetId } = useParams<{ feeSheetId: string }>()
  useDocumentTitle(`Fee Sheet ${feeSheetId || ''} - Edit Details`)

  // Sidebar state
  const [activeSidebarItem, setActiveSidebarItem] = useState('Fee Sheet')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock data - would come from API based on feeSheetId
  const patientName = 'John Smith'
  const encounterId = 'E20241202001'

  // Unified codes list
  const [codes, setCodes] = useState<FeeSheetCode[]>([
    { id: '1', precedence: 1, source: 'Manual', type: 'ICD-10', code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate' },
    { id: '2', precedence: 2, source: 'Template', type: 'ICD-10', code: 'F41.1', description: 'Generalized anxiety disorder' },
    { id: '3', precedence: 1, source: 'Manual', type: 'CPT', code: '90837', description: 'Psychotherapy, 60 minutes', units: 1, chargeAmount: 180.00, linkedDiagnoses: ['F33.1', 'F41.1'] },
  ])

  const [showAddCode, setShowAddCode] = useState(false)
  const [selectedCodeType, setSelectedCodeType] = useState<'ICD-10' | 'CPT' | 'HCPCS' | 'Revenue'>('CPT')
  const [searchCode, setSearchCode] = useState('')
  const [showOptionsSection, setShowOptionsSection] = useState(false)

  // Add new code
  const handleAddCode = (selectedCode: { code: string; description: string }) => {
    const newCode: FeeSheetCode = {
      id: Date.now().toString(),
      precedence: codes.length + 1,
      type: selectedCodeType,
      code: selectedCode.code,
      description: selectedCode.description,
      // Only add units and charges for procedure codes
      ...(selectedCodeType === 'CPT' || selectedCodeType === 'HCPCS' ? {
        units: 1,
        chargeAmount: 0,
        linkedDiagnoses: []
      } : {})
    }
    setCodes([...codes, newCode])
    setShowAddCode(false)
    setSearchCode('')
  }

  // Update code field
  const updateCode = (id: string, field: keyof FeeSheetCode, value: any) => {
    setCodes(codes.map(code =>
      code.id === id ? { ...code, [field]: value } : code
    ))
  }

  // Remove code
  const removeCode = (id: string) => {
    setCodes(codes.filter(code => code.id !== id))
  }

  // Get diagnosis codes only
  const diagnosisCodes = codes.filter(c => c.type === 'ICD-10')
  
  // Get procedure codes only
  const procedureCodes = codes.filter(c => c.type === 'CPT' || c.type === 'HCPCS' || c.type === 'Revenue')

  // Calculate totals
  const totalCharges = procedureCodes.reduce((sum, code) => 
    sum + ((code.chargeAmount || 0) * (code.units || 0)), 0
  )

  // Filter codes based on search and selected type
  const filteredCodes = mockCodes[selectedCodeType].filter(code =>
    code.code.toLowerCase().includes(searchCode.toLowerCase()) ||
    code.description.toLowerCase().includes(searchCode.toLowerCase())
  )

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

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    setActiveSidebarItem(itemLabel)
    
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'Fee Sheet') {
      navigate('/fee-sheet')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  const handleSave = () => {
    console.log('Saving fee sheet:', { codes })
    // TODO: Implement save logic
    navigate('/fee-sheet') // Go back to fee sheet list
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={(searchTerm) => console.log('Search:', searchTerm)}
        userInfo={{
          name: "Sarah Johnson",
          role: "front_desk",
          avatar: "/avatar.png"
        }}
      />

      {/* Main Navigation Bar */}
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
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex flex-col gap-2">
                <Breadcrumb
                  items={[
                    { label: 'Billing', href: '/billing' },
                    { label: 'Fee Sheet', href: '/fee-sheet' },
                    { label: `Edit ${feeSheetId}` }
                  ]}
                />
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Edit Fee Sheet</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Patient: <span className="font-medium">{patientName}</span>
                      {' • '}
                      Encounter: <span className="font-mono font-medium">{encounterId}</span>
                      {' • '}
                      Fee Sheet ID: <span className="font-mono font-medium">{feeSheetId}</span>
                    </p>
                    {/* Compact Summary Info */}
                    <div className="flex items-center gap-6 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">Codes:</span>
                        <span className="font-semibold text-gray-900">{codes.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">Procedures:</span>
                        <span className="font-semibold text-gray-900">{procedureCodes.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">Diagnoses:</span>
                        <span className="font-semibold text-gray-900">{diagnosisCodes.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-semibold text-green-700">${totalCharges.toFixed(2)}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Unbilled
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      View Adjustments
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Log Treatment Time
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Mark as Cleared
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Close Encounter
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/fee-sheet')}>
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      Save & Generate Claim
                    </Button>
                    <Button size="sm" onClick={handleSave} className="gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

      {/* Page Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-full mx-auto p-6">
          {/* Unified Codes Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Table Header with Add Code Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Fee Sheet Codes</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddCode(!showAddCode)}
                className="gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Code
              </Button>
            </div>

            {/* Add Code Section */}
            {showAddCode && (
              <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-48">
                    <label className="text-xs font-medium text-gray-700 block mb-1.5">Code Type</label>
                    <Select value={selectedCodeType} onValueChange={(value) => setSelectedCodeType(value as any)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICD-10">ICD-10 (Diagnosis)</SelectItem>
                        <SelectItem value="CPT">CPT (Procedure)</SelectItem>
                        <SelectItem value="HCPCS">HCPCS</SelectItem>
                        <SelectItem value="Revenue">Revenue Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-700 block mb-1.5">Search Code</label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={`Search ${selectedCodeType} codes...`}
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                {searchCode && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredCodes.map((code) => (
                      <button
                        key={code.code}
                        onClick={() => handleAddCode(code)}
                        className="w-full text-left px-4 py-3 hover:bg-white rounded-lg text-sm border border-transparent hover:border-gray-200 transition-colors"
                      >
                        <span className="font-mono font-semibold text-gray-900">{code.code}</span>
                        <span className="text-gray-600 ml-3">{code.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Codes Table */}
            <div className="relative overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: '2000px' }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                      Precedence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20">
                      Units
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Charge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-28">
                      Modifiers
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Adj Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-40">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-28">
                      Adj Group Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-28">
                      Justify
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-40">
                      Notes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Billable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                      ND
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                      Qty
                    </th>
                    <th className="sticky right-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20 border-l border-gray-200 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codes.map((code) => (
                    <tr key={code.id} className="group hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={code.precedence}
                          onChange={(e) => updateCode(code.id, 'precedence', parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-sm text-center"
                          title="Set precedence order"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            // TODO: Open source selection modal/popover
                            console.log('Edit source for', code.id)
                          }}
                          className="relative group"
                          title={`Source: ${code.source || 'Not set'}`}
                        >
                          <div className="relative w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                            {/* User Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            {/* Settings Icon Overlay */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-white rounded-full text-gray-500 group-hover:text-blue-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={code.type === 'ICD-10' ? 'default' : 'secondary'}
                          className="text-xs font-medium"
                        >
                          {code.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-gray-900">{code.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{code.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        {(code.type === 'CPT' || code.type === 'HCPCS') ? (
                          <Input
                            type="number"
                            value={code.units || 1}
                            onChange={(e) => updateCode(code.id, 'units', parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-sm"
                            min="1"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(code.type === 'CPT' || code.type === 'HCPCS') ? (
                          <Input
                            type="number"
                            value={code.chargeAmount || 0}
                            onChange={(e) => updateCode(code.id, 'chargeAmount', parseFloat(e.target.value) || 0)}
                            className="w-28 h-8 text-sm"
                            step="0.01"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(code.type === 'CPT' || code.type === 'HCPCS') ? (
                          <div className="flex gap-1">
                            <Input
                              type="text"
                              value={code.modifier1 || ''}
                              onChange={(e) => updateCode(code.id, 'modifier1', e.target.value.toUpperCase())}
                              className="w-12 h-8 text-xs uppercase text-center"
                              maxLength={2}
                              placeholder="--"
                            />
                            <Input
                              type="text"
                              value={code.modifier2 || ''}
                              onChange={(e) => updateCode(code.id, 'modifier2', e.target.value.toUpperCase())}
                              className="w-12 h-8 text-xs uppercase text-center"
                              maxLength={2}
                              placeholder="--"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      {/* Adj Type */}
                      <td className="px-4 py-3">
                        <Select value={code.adjType || ''} onValueChange={(value) => updateCode(code.id, 'adjType', value as any)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Patient">Patient</SelectItem>
                            <SelectItem value="Payer1">Payer 1</SelectItem>
                            <SelectItem value="Payer2">Payer 2</SelectItem>
                            <SelectItem value="Payer3">Payer 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      {/* Reason */}
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={code.reason || ''}
                          onChange={(e) => updateCode(code.id, 'reason', e.target.value)}
                          className="w-full h-8 text-xs"
                          placeholder="Enter reason..."
                        />
                      </td>
                      {/* Adj Group Code */}
                      <td className="px-4 py-3">
                        <Select value={code.adjGroupCode || ''} onValueChange={(value) => updateCode(code.id, 'adjGroupCode', value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {adjGroupCodes.map((agc) => (
                              <SelectItem key={agc} value={agc}>{agc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      {/* Justify */}
                      <td className="px-4 py-3">
                        <Select value={code.justify || ''} onValueChange={(value) => updateCode(code.id, 'justify', value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {justifyCodes.map((jc) => (
                              <SelectItem key={jc} value={jc}>{jc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      {/* Provider */}
                      <td className="px-4 py-3">
                        <Select value={code.provider || ''} onValueChange={(value) => updateCode(code.id, 'provider', value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.map((prov) => (
                              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      {/* Notes */}
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={code.notes || ''}
                          onChange={(e) => updateCode(code.id, 'notes', e.target.value)}
                          className="w-full h-8 text-xs"
                          placeholder="Add notes..."
                        />
                      </td>
                      {/* Billable */}
                      <td className="px-4 py-3">
                        <Select value={code.billable || ''} onValueChange={(value) => updateCode(code.id, 'billable', value as any)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Billable">Billable</SelectItem>
                            <SelectItem value="Non-Billable">Non-Billable</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      {/* ND */}
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={code.nd || ''}
                          onChange={(e) => updateCode(code.id, 'nd', e.target.value)}
                          className="w-full h-8 text-xs"
                          placeholder="ND..."
                        />
                      </td>
                      {/* Qty with Unit */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={code.qty || ''}
                            onChange={(e) => updateCode(code.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                            placeholder="0"
                            step="0.01"
                          />
                          <Select value={code.qtyUnit || ''} onValueChange={(value) => updateCode(code.id, 'qtyUnit', value as any)}>
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {qtyUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="sticky right-0 bg-white group-hover:bg-gray-50 px-4 py-3 border-l border-gray-200 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCode(code.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {codes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <DocumentTextIcon className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-base font-medium">No codes added yet</p>
                  <p className="text-sm mt-1">Click "Add Code" to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Insurance and Provider Options Section */}
          <div className="bg-white rounded-lg border border-gray-200 mt-6">
            {/* Collapsible Header */}
            <button
              onClick={() => setShowOptionsSection(!showOptionsSection)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-base font-semibold text-gray-900">Insurance & Provider Options</h3>
              {showOptionsSection ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Collapsible Content */}
            {showOptionsSection && (
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-4">
              {/* Row 1: Place of Service, Bill-To */}
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Place Of Service:
                  </label>
                  <Select defaultValue="telehealth">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telehealth">10: Telehealth</SelectItem>
                      <SelectItem value="office">11: Office</SelectItem>
                      <SelectItem value="home">12: Home</SelectItem>
                      <SelectItem value="inpatient">21: Inpatient Hospital</SelectItem>
                      <SelectItem value="outpatient">22: Outpatient Hospital</SelectItem>
                      <SelectItem value="emergency">23: Emergency Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Bill-To:
                  </label>
                  <Select defaultValue="person">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Person</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Type Of Bill/UB04 Box 4:
                  </label>
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="-- Select --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="111">111 - Hospital Inpatient</SelectItem>
                      <SelectItem value="131">131 - Hospital Outpatient</SelectItem>
                      <SelectItem value="141">141 - Hospital Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useProviderName"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="useProviderName" className="text-sm text-gray-700">
                    Use Provider Name for CMS1500
                  </label>
                </div>
              </div>

              {/* Providers Section - Grouped */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Providers</h4>
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Rendering:
                    </label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="h-9 text-sm bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin, Ensoftek - CV</SelectItem>
                        <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                        <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Supervising:
                    </label>
                    <Select defaultValue="endocrinology">
                      <SelectTrigger className="h-9 text-sm bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="endocrinology">doctor, Endocrinology</SelectItem>
                        <SelectItem value="cardiology">doctor, Cardiology</SelectItem>
                        <SelectItem value="neurology">doctor, Neurology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Referring:
                    </label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm bg-white">
                        <SelectValue placeholder="-- Unassigned --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                        <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                        <SelectItem value="dr-davis">Dr. Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Referring NPI:
                    </label>
                    <Input
                      type="text"
                      className="h-9 text-sm bg-white"
                      placeholder="Enter NPI..."
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Price Level and Prior Authorization */}
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Price Level:
                  </label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="discounted">Discounted</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-9">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Prior Authorization:
                  </label>
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="-- Unassigned --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                      <SelectItem value="auth1">Authorization 1</SelectItem>
                      <SelectItem value="auth2">Authorization 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
  )
}

export default FeeSheetDetailsPage
