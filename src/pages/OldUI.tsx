import React, { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui'

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
  const navigate = useNavigate();

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
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={(searchTerm) => console.log('Search:', searchTerm)}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Clients"
        onNavigate={(itemName) => {
          console.log('Navigate to:', itemName);
          
          // Handle navigation to different pages
          if (itemName === 'Inbox') {
            navigate('/inbox');
          } else if (itemName === 'Dashboard') {
            navigate('/dashboard');
          } else if (itemName === 'Settings') {
            navigate('/settings');
          }
          // Other navigation will be handled by the MainNavigationBar component
        }}
      />

      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          activeItem={selectedMenu}
          onMenuSelect={(itemLabel) => setSelectedMenu(itemLabel)} 
          onSearch={(searchTerm) => console.log('Search sidebar:', searchTerm)}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default OldUI 
