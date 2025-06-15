import React, { FC, useState } from 'react'
import { 
  MagnifyingGlassIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon,
  DocumentTextIcon, EyeIcon, PencilIcon, TrashIcon, ChatBubbleLeftRightIcon,
  GlobeAltIcon, ExclamationTriangleIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip'

// Types and Interfaces
interface Patient {
  id: string
}

interface Form {
  id: string
  name: string
  filledOn: string
  completion: number
  type: 'Message' | 'Patient Portal'
  hasGoldenThreadAlert?: boolean
  goldenThreadIssues?: string[]
  isUnbilled?: boolean
  unbilledReason?: string
}

type GroupBy = 'All' | 'Form Type'
type PatientForms = Record<string, Form[]>

interface PatientFormsManagerProps {
  /** Initial patient ID to select */
  initialPatientId?: string
  /** Callback when a patient is selected */
  onPatientSelect?: (patient: Patient | null) => void
  /** Custom CSS classes */
  className?: string
}

/**
 * PatientFormsManager Component
 * 
 * Manages patient selection and their associated forms with grouping,
 * filtering, and completion tracking capabilities.
 */
const PatientFormsManager: FC<PatientFormsManagerProps> = ({
  initialPatientId,
  onPatientSelect,
  className = ''
}) => {
  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialPatientId ? { id: initialPatientId } : null
  )
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<GroupBy>('Form Type')
  const [selectedEncounter, setSelectedEncounter] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Message', 'Patient Portal'])

  // Mock Data - Patients List
  const patients: Patient[] = [
    { id: 'Abced .asd (1002734)' },
    { id: 'Banana Leaves (1004649)' },
    { id: 'Bella Bella (1001044)' },
    { id: 'Cherry Babu (1004071)' },
    { id: 'Cherry Test (1004066)' },
    { id: 'Clint Hawkeye (1003605)' },
    { id: 'dev test Developer (1003400)' },
    { id: 'Gucci Supreme Genact (1002638)' },
    { id: 'Happy D Days (1004626)' },
    { id: 'HP Laptop (1002946)' },
    { id: 'John Resident (1004785)' },
    { id: 'Logs Test (1004205)' },
    { id: 'Love Coffee (1003662)' }
  ]

  // Mock Data - Patient Forms (simplified for brevity)
  const patientForms: PatientForms = {
    'Abced .asd (1002734)': [
      { 
        id: '1', 
        name: 'Medical History Form',
        filledOn: '2024-02-20',
        completion: 75,
        type: 'Patient Portal',
        hasGoldenThreadAlert: true,
        goldenThreadIssues: ['Missing required diagnostic information', 'Treatment plan incomplete']
      },
      { 
        id: '2', 
        name: 'Insurance Information',
        filledOn: '2024-02-19',
        completion: 100,
        type: 'Message',
        isUnbilled: true,
        unbilledReason: 'Pending insurance verification - Authorization required'
      },
      {
        id: '3',
        name: 'Allergy Assessment',
        filledOn: '2024-02-22',
        completion: 33,
        type: 'Patient Portal',
        hasGoldenThreadAlert: true,
        goldenThreadIssues: ['Missing allergy severity classifications', 'Cross-reactions not documented'],
        isUnbilled: true,
        unbilledReason: 'Form incomplete - Cannot process billing until completion'
      }
    ],
    'Banana Leaves (1004649)': [
      { 
        id: '4', 
        name: 'Consent Form',
        filledOn: '2024-02-18',
        completion: 30,
        type: 'Patient Portal',
        hasGoldenThreadAlert: true,
        goldenThreadIssues: ['Missing patient signature', 'Witness signature required']
      },
      { 
        id: '5', 
        name: 'Medication History',
        filledOn: '',
        completion: 0,
        type: 'Patient Portal'
      }
    ]
  }

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setSelectedForms([]) // Reset selected forms when switching patients
    onPatientSelect?.(patient)
  }

  // Handle patient deselection
  const handlePatientDeselect = () => {
    setSelectedPatient(null)
    setSelectedForms([])
    onPatientSelect?.(null)
  }

  // Handle form selection for checkboxes
  const handleFormSelect = (formId: string) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    )
  }

  // Toggle group expansion in grouped view
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  // Handle select all forms functionality
  const handleSelectAllForms = () => {
    if (!selectedPatient) return
    
    const currentPatientForms = patientForms[selectedPatient.id] || []
    const allFormIds = currentPatientForms.map(f => f.id)
    
    setSelectedForms(
      selectedForms.length === allFormIds.length 
        ? [] 
        : allFormIds
    )
  }

  // Render the forms table for selected patient
  const renderFormsTable = () => {
    if (!selectedPatient) return null
    
    const currentPatientForms = patientForms[selectedPatient.id] || []
    
    // Show empty state if no forms available
    if (currentPatientForms.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Available</h3>
          <p className="text-sm text-gray-500">There are no forms available for {selectedPatient.id}</p>
        </div>
      )
    }
    
    // Group forms by type or show all
    const groupedForms = groupBy === 'Form Type' 
      ? currentPatientForms.reduce((acc, form) => {
          if (!acc[form.type]) acc[form.type] = []
          acc[form.type].push(form)
          return acc
        }, {} as Record<string, Form[]>)
      : { 'All': currentPatientForms }

    return (
      <div className="bg-white rounded-lg shadow h-[calc(100vh)]">
        {/* Forms Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">{selectedPatient?.id}</h2>
            <div className="flex items-center gap-4">
              {/* Group By Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Group by:</span>
                <div className="relative">
                  <select 
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                    className="appearance-none bg-white pl-3 pr-8 py-1.5 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C75BC]/30 focus:border-[#1C75BC] cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Form Type">Form Source</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* New Appointment Button */}
              <button 
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C75BC] hover:bg-[#1C75BC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C75BC]"
              >
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Forms Table Content */}
        <div className="overflow-auto" style={{ height: 'calc(100% - 73px)' }}>
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50 sticky top-0 bottom-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#1C75BC] focus:ring-[#1C75BC]"
                    checked={selectedForms.length === currentPatientForms.length}
                    onChange={handleSelectAllForms}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filled On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form's Source
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedForms).map(([group, groupForms]) => (
                groupBy === 'Form Type' ? (
                  <React.Fragment key={group}>
                    {/* Group Header Row */}
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-3">
                        <button 
                          className="flex items-center text-sm font-medium text-gray-900"
                          onClick={() => toggleGroup(group)}
                        >
                          {expandedGroups.includes(group) ? (
                            <ChevronDownIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4 mr-2" />
                          )}
                          {group} ({groupForms.length})
                        </button>
                      </td>
                    </tr>
                    {/* Group Forms Rows */}
                    {expandedGroups.includes(group) && groupForms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#1C75BC] focus:ring-[#1C75BC]"
                            checked={selectedForms.includes(form.id)}
                            onChange={() => handleFormSelect(form.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {/* Golden Thread Alert */}
                            {form.hasGoldenThreadAlert && (
                              <TooltipRoot>
                                <TooltipTrigger asChild>
                                  <div className="relative flex items-center justify-center w-6 h-6 bg-amber-100 border-2 border-amber-400 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                                    <ExclamationTriangleIcon className="h-3 w-3 text-amber-700 font-bold" />
                                    <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="font-medium mb-1">Golden Thread Alert</div>
                                  <div className="text-xs">
                                    {form.goldenThreadIssues?.map((issue, idx) => (
                                      <div key={idx}>• {issue}</div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </TooltipRoot>
                            )}
                            
                            {/* Unbilled Alert */}
                            {form.isUnbilled && (
                              <TooltipRoot>
                                <TooltipTrigger asChild>
                                  <div className="relative flex items-center justify-center w-6 h-6 bg-red-100 border-2 border-red-400 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                                    <ExclamationCircleIcon className="h-3 w-3 text-red-700 font-bold" />
                                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="font-medium mb-1">Unbilled Form</div>
                                  <div className="text-xs text-neutral-300">{form.unbilledReason}</div>
                                </TooltipContent>
                              </TooltipRoot>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <EyeIcon className="w-4 h-4 text-gray-500" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>View form</p>
                              </TooltipContent>
                            </TooltipRoot>
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <PencilIcon className="w-4 h-4 text-gray-500" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>Edit form</p>
                              </TooltipContent>
                            </TooltipRoot>
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <TrashIcon className="w-4 h-4 text-gray-500" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>Delete form</p>
                              </TooltipContent>
                            </TooltipRoot>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {form.filledOn ? new Date(form.filledOn).toLocaleDateString() : 'Not filled'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {form.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-[#1C75BC] rounded-full" 
                                  style={{ width: `${form.completion}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">{form.completion}%</span>
                            </div>
                            {form.completion === 100 && form.filledOn && (
                              <div className="text-xs text-gray-400 mt-1">
                                Completed on {new Date(form.filledOn).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {form.type === 'Message' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <ChatBubbleLeftRightIcon className="w-3 h-3" />
                              Message
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <GlobeAltIcon className="w-3 h-3" />
                              Patient Portal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ) : (
                  // Ungrouped forms display
                  groupForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#1C75BC] focus:ring-[#1C75BC]"
                          checked={selectedForms.includes(form.id)}
                          onChange={() => handleFormSelect(form.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* Golden Thread Alert */}
                          {form.hasGoldenThreadAlert && (
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <div className="relative flex items-center justify-center w-6 h-6 bg-amber-100 border-2 border-amber-400 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                                  <ExclamationTriangleIcon className="h-3 w-3 text-amber-700 font-bold" />
                                  <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="font-medium mb-1">Golden Thread Alert</div>
                                <div className="text-xs">
                                  {form.goldenThreadIssues?.map((issue, idx) => (
                                    <div key={idx}>• {issue}</div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </TooltipRoot>
                          )}
                          
                          {/* Unbilled Alert */}
                          {form.isUnbilled && (
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <div className="relative flex items-center justify-center w-6 h-6 bg-red-100 border-2 border-red-400 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                                  <ExclamationCircleIcon className="h-3 w-3 text-red-700 font-bold" />
                                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="font-medium mb-1">Unbilled Form</div>
                                <div className="text-xs text-neutral-300">{form.unbilledReason}</div>
                              </TooltipContent>
                            </TooltipRoot>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <EyeIcon className="w-4 h-4 text-gray-500" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>View form</p>
                            </TooltipContent>
                          </TooltipRoot>
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <PencilIcon className="w-4 h-4 text-gray-500" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Edit form</p>
                            </TooltipContent>
                          </TooltipRoot>
                          <TooltipRoot>
                            <TooltipTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <TrashIcon className="w-4 h-4 text-gray-500" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Delete form</p>
                            </TooltipContent>
                          </TooltipRoot>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {form.filledOn ? new Date(form.filledOn).toLocaleDateString() : 'Not filled'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-[#1C75BC] rounded-full" 
                                style={{ width: `${form.completion}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">{form.completion}%</span>
                          </div>
                          {form.completion === 100 && form.filledOn && (
                            <div className="text-xs text-gray-400 mt-1">
                              Completed on {new Date(form.filledOn).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {form.type === 'Message' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <ChatBubbleLeftRightIcon className="w-3 h-3" />
                            Message
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <GlobeAltIcon className="w-3 h-3" />
                            Patient Portal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={`flex gap-6 h-[calc(100vh-12rem)] ${className}`}>
        {/* Patient List Panel */}
        <div className="w-96">
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
          {/* Patient List Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Patient List</h2>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C75BC]/30"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Patient List Content */}
          <div className="overflow-y-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedPatient?.id === patient.id ? 'bg-[#1C75BC]/5' : ''
                    }`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-blue-600">{patient.id}</div>
                        {selectedPatient?.id === patient.id && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePatientDeselect()
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Forms Panel */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow h-full">
          {!selectedPatient ? (
            // Empty state when no patient selected
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
              <p className="text-sm text-gray-500">Please select a patient from the list to view their forms</p>
            </div>
          ) : (
            // Forms table content
            <div className="h-full flex flex-col">
              {renderFormsTable()}
            </div>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

export default PatientFormsManager 