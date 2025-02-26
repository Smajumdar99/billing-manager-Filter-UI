import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon, Cog6ToothIcon,
  HomeIcon, ClipboardDocumentIcon, UserGroupIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, Cog8ToothIcon, InboxIcon, WrenchScrewdriverIcon,
  ChartPieIcon, DocumentTextIcon, EnvelopeOpenIcon, DocumentCheckIcon, PencilSquareIcon,
  BeakerIcon as LabIcon, ArrowTrendingUpIcon, DocumentPlusIcon, ClipboardIcon,
  ClipboardDocumentListIcon, Square3Stack3DIcon as MedicationIcon, AcademicCapIcon, CheckCircleIcon,
  ExclamationCircleIcon, EyeIcon, UserGroupIcon as GroupIcon, FolderIcon,
  DocumentDuplicateIcon, PresentationChartBarIcon, PencilIcon, TrashIcon,
  ChatBubbleLeftRightIcon, GlobeAltIcon, ChevronDownIcon, ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Patient {
  id: string
}

interface Form {
  id: string
  name: string
  filledOn: string
  completion: number
  type: 'Message' | 'Patient Portal'
}

type GroupBy = 'All' | 'Form Type'

type PatientForms = Record<string, Form[]>

const OldUI: FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('Patient Forms')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<GroupBy>('Form Type')
  const [selectedEncounter, setSelectedEncounter] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Message', 'Patient Portal'])

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

  const patientForms: PatientForms = {
    'Abced .asd (1002734)': [
      { 
        id: '1', 
        name: 'Medical History Form',
        filledOn: '2024-02-20',
        completion: 75,
        type: 'Patient Portal'
      },
      { 
        id: '2', 
        name: 'Insurance Information',
        filledOn: '2024-02-19',
        completion: 100,
        type: 'Message'
      },
      {
        id: '3',
        name: 'Allergy Assessment',
        filledOn: '2024-02-22',
        completion: 33,
        type: 'Patient Portal'
      },
      {
        id: '4',
        name: 'Current Medications List',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      },
      {
        id: '5',
        name: 'Family Medical History',
        filledOn: '',
        completion: 0,
        type: 'Patient Portal'
      },
      {
        id: '6',
        name: 'Surgical History Documentation',
        filledOn: '2024-02-23',
        completion: 85,
        type: 'Patient Portal'
      },
      {
        id: '7',
        name: 'Vaccination Records',
        filledOn: '2024-02-21',
        completion: 100,
        type: 'Message'
      },
      {
        id: '8',
        name: 'Mental Health Screening',
        filledOn: '2024-02-18',
        completion: 45,
        type: 'Patient Portal'
      },
      {
        id: '9',
        name: 'Dietary Restrictions Form',
        filledOn: '',
        completion: 15,
        type: 'Patient Portal'
      },
      {
        id: '10',
        name: 'Emergency Contact Update',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      },
      {
        id: '11',
        name: 'Physical Examination Results',
        filledOn: '2024-02-23',
        completion: 90,
        type: 'Patient Portal'
      },
      {
        id: '12',
        name: 'Lab Test Requisition',
        filledOn: '',
        completion: 0,
        type: 'Message'
      }
    ],
    'Banana Leaves (1004649)': [
      { 
        id: '4', 
        name: 'Consent Form',
        filledOn: '2024-02-18',
        completion: 30,
        type: 'Patient Portal'
      },
      { 
        id: '5', 
        name: 'Medication History',
        filledOn: '',
        completion: 0,
        type: 'Patient Portal'
      },
      { 
        id: '6', 
        name: 'Family History Questionnaire',
        filledOn: '2024-02-15',
        completion: 90,
        type: 'Message'
      },
      {
        id: '7',
        name: 'COVID-19 Screening',
        filledOn: '2024-02-21',
        completion: 100,
        type: 'Message'
      }
    ],
    'Bella Bella (1001044)': [
      { 
        id: '8', 
        name: 'Mental Health Assessment',
        filledOn: '',
        completion: 0,
        type: 'Patient Portal'
      },
      { 
        id: '9', 
        name: 'Immunization Record',
        filledOn: '2024-02-17',
        completion: 45,
        type: 'Message'
      },
      {
        id: '10',
        name: 'Sleep Study Questionnaire',
        filledOn: '2024-02-23',
        completion: 88,
        type: 'Patient Portal'
      },
      {
        id: '11',
        name: 'Dietary Preferences',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      }
    ],
    'Cherry Babu (1004071)': [
      { 
        id: '12', 
        name: 'Dental History',
        filledOn: '2024-02-21',
        completion: 60,
        type: 'Patient Portal'
      },
      { 
        id: '13', 
        name: 'Emergency Contact Form',
        filledOn: '2024-02-22',
        completion: 100,
        type: 'Message'
      },
      {
        id: '14',
        name: 'Pain Assessment',
        filledOn: '2024-02-23',
        completion: 25,
        type: 'Patient Portal'
      }
    ],
    'Cherry Test (1004066)': [
      { 
        id: '15', 
        name: 'Allergy Information',
        filledOn: '2024-02-23',
        completion: 85,
        type: 'Patient Portal'
      },
      {
        id: '16',
        name: 'Surgical History',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      },
      {
        id: '17',
        name: 'Exercise Routine',
        filledOn: '',
        completion: 0,
        type: 'Patient Portal'
      }
    ],
    'Clint Hawkeye (1003605)': [
      { 
        id: '18', 
        name: 'Vision Test Results',
        filledOn: '',
        completion: 0,
        type: 'Message'
      },
      { 
        id: '19', 
        name: 'Physical Examination',
        filledOn: '2024-02-24',
        completion: 95,
        type: 'Patient Portal'
      },
      {
        id: '20',
        name: 'Medication Review',
        filledOn: '2024-02-22',
        completion: 70,
        type: 'Message'
      }
    ],
    'dev test Developer (1003400)': [
      {
        id: '21',
        name: 'System Test Form',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      },
      {
        id: '22',
        name: 'Bug Report Template',
        filledOn: '',
        completion: 15,
        type: 'Patient Portal'
      }
    ],
    'Gucci Supreme Genact (1002638)': [
      {
        id: '23',
        name: 'Lifestyle Assessment',
        filledOn: '2024-02-20',
        completion: 50,
        type: 'Patient Portal'
      },
      {
        id: '24',
        name: 'Travel History',
        filledOn: '2024-02-21',
        completion: 100,
        type: 'Message'
      },
      {
        id: '25',
        name: 'Vaccination Record',
        filledOn: '2024-02-23',
        completion: 75,
        type: 'Patient Portal'
      }
    ],
    'Happy D Days (1004626)': [
      {
        id: '26',
        name: 'Mental Wellness Check',
        filledOn: '2024-02-24',
        completion: 40,
        type: 'Message'
      },
      {
        id: '27',
        name: 'Daily Mood Tracker',
        filledOn: '2024-02-23',
        completion: 100,
        type: 'Patient Portal'
      }
    ],
    'HP Laptop (1002946)': [
      {
        id: '28',
        name: 'Hardware Diagnostic',
        filledOn: '',
        completion: 0,
        type: 'Message'
      },
      {
        id: '29',
        name: 'Software Update Form',
        filledOn: '2024-02-22',
        completion: 65,
        type: 'Patient Portal'
      }
    ],
    'John Resident (1004785)': [
      {
        id: '30',
        name: 'Residency Application',
        filledOn: '2024-02-24',
        completion: 100,
        type: 'Message'
      },
      {
        id: '31',
        name: 'Medical License Verification',
        filledOn: '2024-02-23',
        completion: 80,
        type: 'Patient Portal'
      },
      {
        id: '32',
        name: 'Training Certificate',
        filledOn: '',
        completion: 20,
        type: 'Message'
      }
    ]
  }

  const filteredPatients = patients.filter(patient =>
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFormSelect = (formId: string) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    )
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

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
    
    const groupedForms = groupBy === 'Form Type' 
      ? currentPatientForms.reduce((acc, form) => {
          if (!acc[form.type]) acc[form.type] = []
          acc[form.type].push(form)
          return acc
        }, {} as Record<string, Form[]>)
      : { 'All': currentPatientForms }

    return (
      <div className="bg-white rounded-lg shadow h-[calc(100vh)]">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">{selectedPatient?.id}</h2>
            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Encounter:</span>
                <div className="relative">
                  <select 
                    value={selectedEncounter}
                    onChange={(e) => setSelectedEncounter(e.target.value)}
                    className="appearance-none bg-white pl-3 pr-8 py-1.5 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C75BC]/30 focus:border-[#1C75BC] cursor-pointer"
                  >
                    <option value="all">All Encounters</option>
                    <option value="1">Encounter 1</option>
                    <option value="2">Encounter 2</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <button 
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C75BC] hover:bg-[#1C75BC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C75BC]"
              >
                New Appointment
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto" style={{ height: 'calc(100% - 73px)' }}>
          <table className="min-w-full divide-y divide-gray-200">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedForms).map(([group, groupForms]) => (
                groupBy === 'Form Type' ? (
                  <React.Fragment key={group}>
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
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <EyeIcon className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <PencilIcon className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <TrashIcon className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(form.filledOn).toLocaleDateString()}
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
                            {form.completion === 100 && (
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
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <EyeIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <PencilIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <TrashIcon className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.filledOn).toLocaleDateString()}
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
                          {form.completion === 100 && (
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

  const renderContent = () => {
    if (selectedMenu === 'Patient Forms') {
      return (
        <div className="flex gap-6 p-6 h-[calc(100vh-8rem)]">
          {/* Patient List */}
          <div className="w-96">
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
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
              <div className="overflow-y-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedPatient?.id === patient.id ? 'bg-[#1C75BC]/5' : ''
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-blue-600">{patient.id}</div>
                            {selectedPatient?.id === patient.id && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedPatient(null)
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

          {/* Right Panel - Empty State or Forms */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow h-full">
              {!selectedPatient ? (
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
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="flex items-center p-2 h-16 bg-[#1C75BC]/15 text-[#1C75BC]">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-64 px-4 py-1.5 pl-10 rounded text-sm bg-white/50 border border-[#1C75BC]/20 placeholder-[#1C75BC]/70 focus:outline-none focus:ring-2 focus:ring-[#1C75BC]/30"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-[#1C75BC]/70" />
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-6">
          <BellIcon className="h-4 w-4 text-[#1C75BC]" />
          <QuestionMarkCircleIcon className="h-4 w-4 text-[#1C75BC]" />
          <EnvelopeIcon className="h-4 w-4 text-[#1C75BC]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1C75BC]">Mayank Hospitals</span>
            <img src="https://ui-avatars.com/api/?name=Darlene+Robertson" alt="User" className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center h-10 bg-[#1C75BC] text-white">
        <nav className="flex w-full">
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <ClipboardDocumentIcon className="h-4 w-4" />
            ADL
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <UserGroupIcon className="h-4 w-4" />
            Pre-Admit/Referrals
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <ClockIcon className="h-4 w-4" />
            Wait List
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <CalendarDaysIcon className="h-4 w-4" />
            Schedule
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-[#1C75BC]">
            <UsersIcon className="h-4 w-4" />
            Clients
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <BeakerIcon className="h-4 w-4" />
            Practice
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <BanknotesIcon className="h-4 w-4" />
            Billing
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <ChartBarIcon className="h-4 w-4" />
            Reports
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <Cog8ToothIcon className="h-4 w-4" />
            Administration
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <InboxIcon className="h-4 w-4" />
            Inbox
          </Link>
          <Link to="#" className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-blue-600">
            <WrenchScrewdriverIcon className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <input
              type="search"
              placeholder="Search menu"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<ChartPieIcon />} label="Client Summary Chart" />
            <SidebarItem icon={<DocumentTextIcon />} label="Past Encounters" />
            <SidebarItem icon={<EnvelopeOpenIcon />} label="Message Patient" />
            <SidebarItem icon={<ChartBarIcon />} label="ROI Dashboard" badge="1" />
            <SidebarItem icon={<PencilSquareIcon />} label="Prescribe" />
            <SidebarItem icon={<LabIcon />} label="Labs" />
            <SidebarItem icon={<ArrowTrendingUpIcon />} label="Trend Vitals" />
            <SidebarItem icon={<DocumentPlusIcon />} label="Forms to Sign" />
            <SidebarItem icon={<ClipboardIcon />} label="Record Vitals" />
            <SidebarItem icon={<ClipboardDocumentListIcon />} label="Treatment Plan" />
            <SidebarItem icon={<MedicationIcon />} label="Administer Medications" />
            <SidebarItem icon={<DocumentCheckIcon />} label="RecordMAR Orders/Vitals" />
            <SidebarItem icon={<AcademicCapIcon />} label="Patient Education" />
            <SidebarItem icon={<CheckCircleIcon />} label="Batch Eligibility Checking" />
            <SidebarItem icon={<ExclamationCircleIcon />} label="New Incident" />
            <SidebarItem icon={<EyeIcon />} label="View Incidents" />
            <SidebarItem icon={<GroupIcon />} label="Patient Monitoring Rounds" />
            <SidebarItem 
              icon={<DocumentTextIcon />} 
              label="Patient Forms" 
              isActive={selectedMenu === 'Patient Forms'}
              onClick={() => setSelectedMenu('Patient Forms')}
            />
            <SidebarItem icon={<FolderIcon />} label="Form Cabinet" />
            <SidebarItem icon={<DocumentDuplicateIcon />} label="CCDA" />
            <SidebarItem icon={<ChartBarIcon />} label="ABA Definition" />
            <SidebarItem icon={<PresentationChartBarIcon />} label="ABA Reports" />
            <SidebarItem icon={<ClipboardDocumentListIcon />} label="ABA Tracking" />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: JSX.Element
  label: string
  badge?: string
  isActive?: boolean
  onClick?: () => void
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label, badge, isActive, onClick }) => {
  const iconWithClasses = {
    ...icon,
    props: {
      ...icon.props,
      className: `h-4 w-4 mr-3 ${isActive ? 'text-[#1C75BC]' : 'text-gray-500'}`
    }
  }
  
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      className={`flex items-center px-4 py-2 text-sm relative ${
        isActive 
          ? 'text-[#1C75BC] bg-[#1C75BC]/5' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C75BC]" />
      )}
      {iconWithClasses}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
          {badge}
        </span>
      )}
    </a>
  )
}

export default OldUI 
