import React, { FC, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon, Cog6ToothIcon,
  HomeIcon, ClipboardDocumentIcon, UserGroupIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, Cog8ToothIcon, InboxIcon, WrenchScrewdriverIcon,
  ChartPieIcon, DocumentTextIcon, EnvelopeOpenIcon, DocumentCheckIcon, PencilSquareIcon,
  BeakerIcon as LabIcon, ArrowTrendingUpIcon, DocumentPlusIcon, ClipboardIcon,
  ClipboardDocumentListIcon, Square3Stack3DIcon as MedicationIcon, AcademicCapIcon, CheckCircleIcon,
  UserGroupIcon as GroupIcon, FolderIcon,
  DocumentDuplicateIcon, PresentationChartBarIcon, PencilIcon, TrashIcon,
  ChatBubbleLeftRightIcon, GlobeAltIcon, ChevronDownIcon, ChevronRightIcon,
  XMarkIcon, PrinterIcon, ArrowDownTrayIcon, PlusIcon, EllipsisVerticalIcon, CubeIcon
} from '@heroicons/react/24/outline'
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui'
import PastEncountersManager from '../components/organisms/PastEncountersManager'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { CompactMetrics } from '@/components/molecules/CompactMetrics'
import PatientFormsManager from '../components/organisms/PatientFormsManager'
import TimelinePage from './TimelinePage'
import ClientSummaryChartPage from './ClientSummaryChartPage'
import IncidentsPage from './IncidentsPage'
import PrescriptionModal from '../components/molecules/PrescriptionModal/prescription-modal'
import NewIncidentPage from '../components/organisms/NewIncident/NewIncidentPage'
import InterdisciplinaryTreatmentPlanPage from '../components/organisms/InterdisciplinaryTreatmentPlan/InterdisciplinaryTreatmentPlanPage'

// Widget configuration for dashboard
interface WidgetConfig {
  id: string
  type: string
  title: string
  component: React.ComponentType<any>
  defaultSize: { w: number; h: number }
}

// Available widgets for the dashboard
const availableWidgets: WidgetConfig[] = [
  {
    id: 'notification-center',
    type: 'notification_center',
    title: 'Notifications',
    component: () => null, // Placeholder - actual component imported in ClientSummaryChartPage
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'functional-status',
    type: 'functional_status',
    title: 'Functional Status',
    component: () => null, // Placeholder
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'diagnosis',
    type: 'diagnosis',
    title: 'Diagnosis',
    component: () => null, // Placeholder
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'demographics',
    type: 'demographics',
    title: 'Demographics',
    component: () => null, // Placeholder
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'insurance',
    type: 'insurance',
    title: 'Insurance',
    component: () => null, // Placeholder - actual component imported in ClientSummaryChartPage
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'medications',
    type: 'medications',
    title: 'Medications',
    component: () => null, // Placeholder - actual component imported in ClientSummaryChartPage
    defaultSize: { w: 6, h: 8 }
  }
]

// Types for encounter statistics
interface EncounterStats {
  total: number;
  thisMonth: number;
  lastVisit: string;
  providers: number;
}

const OldUI: FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('Patient Forms')
  // Patient-related state moved to PatientFormsManager component
  const [selectedPatient, setSelectedPatient] = useState<{ id: string } | null>(null)
  // Store full patient data for PatientSnapshot
  const [patientData, setPatientData] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState('Clients')
  const [encounterStats, setEncounterStats] = useState<EncounterStats | null>(null)
  
  // Prescription modal state
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  
  // Incident modal state
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)
  
  // Dashboard controls state for Client Summary Chart
  const [dashboardEditMode, setDashboardEditMode] = useState(false)
  const [dashboardShowWidgetSelector, setDashboardShowWidgetSelector] = useState(false)
  
  // Active widgets state for dashboard
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    'notification-center',
    'functional-status', 
    'diagnosis',
    'demographics',
    'insurance',
    'medications'
  ])
  
  // Widget management functions
  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId])
    }
  }
  
  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId))
  }
  
  const navigate = useNavigate();

  // Load patient from sessionStorage on component mount
  useEffect(() => {
    const savedPatient = sessionStorage.getItem('selectedPatient');
    const savedMenu = sessionStorage.getItem('selectedMenu');
    
    // Set the selected menu if it exists in sessionStorage
    if (savedMenu) {
      setSelectedMenu(savedMenu);
      // Clear the saved menu after using it to avoid persistent navigation
      sessionStorage.removeItem('selectedMenu');
    }
    
    if (savedPatient) {
      try {
        const patient = JSON.parse(savedPatient);
        console.log('Loaded patient from session:', patient);
        // Set the selected patient to use the patient data from ClientsList
        setSelectedPatient({ id: patient.name + ` (${patient.id})` });
        // Store full patient data for PatientSnapshot
        setPatientData({
          id: patient.id,
          name: patient.name,
          gender: patient.gender,
          age: patient.age,
          bloodGroup: patient.bloodGroup,
          insuranceProvider: patient.insurance,
          admittedTo: patient.levelOfCare,
          language: 'English',
          mobile: patient.mobilePhone || patient.homePhone,
          programAuditor: 'Dr. Johnson',
          auditorTimestamp: '2 hours ago',
          primaryCareProvider: 'Dr. Brown',
          nickname: patient.name.split(' ')[0]
        });
      } catch (error) {
        console.error('Error loading patient from session:', error);
      }
    }
  }, []);

  // Clear patient data when navigating away from client details
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear patient data on page refresh/reload
      // sessionStorage.removeItem('selectedPatient');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Generate breadcrumb items based on current context
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Clients', href: '/clients' }
    ];

    // Add patient context if available
    if (selectedPatient) {
      // Extract patient name from the ID format "Name (ID)"
      const patientName = selectedPatient.id.split(' (')[0];
      items.push({ 
        label: patientName,
        href: undefined // Current page, no link
      });
    }

    // Add current section context with more descriptive labels
    if (selectedMenu && selectedMenu !== 'Patient Forms') {
      let sectionLabel = selectedMenu;
      let sectionHref = undefined;
      
      // Make section labels more user-friendly
      switch (selectedMenu) {
        case 'Past Encounters':
          sectionLabel = 'Past Encounters';
          break;
        case 'Patient Forms':
          sectionLabel = 'Forms';
          break;
        case 'Client Summary Chart':
          sectionLabel = 'Summary Chart';
          break;
        case 'Message Patient':
          sectionLabel = 'Messages';
          break;
        case 'New Incident':
          // Add Incidents as clickable breadcrumb item first
          items.push({ 
            label: 'Incidents',
            href: '#incidents'
          });
          sectionLabel = 'New Incident';
          break;
        default:
          sectionLabel = selectedMenu;
      }
      
      items.push({ 
        label: sectionLabel,
        href: sectionHref // Current section, no link unless specified
      });
    }

    return items;
  };

  // Patient data and helper functions moved to PatientFormsManager component

  // Handle action buttons for Past Encounters
  const handleNewEncounter = () => {
    console.log('Creating new encounter for patient:', selectedPatient?.id);
    // Add new encounter logic here
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting encounters for patient:', selectedPatient?.id);
    // Add export logic here
  };

  // Patient Actions Dropdown Component
  const PatientActionsDropdown: React.FC<{ patient: any }> = ({ patient }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const handleAction = (action: string, event?: React.MouseEvent) => {
      console.log(`🔥 PatientActionsDropdown: ${action} action clicked for patient:`, patient.name)
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (action === 'Prescribe') {
        setIsPrescriptionModalOpen(true)
        setIsOpen(false)
        return
      }
      // Handle other actions here
      setIsOpen(false)
    }

    const getDropdownPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0 }
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 200 // Align right edge
      }
    }

    const dropdownMenu = isOpen ? (
      <div
        ref={dropdownRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
        style={{
          ...getDropdownPosition(),
          zIndex: 999999
        }}
      >
        {/* Documents */}
        <button
          onClick={(e) => handleAction('Documents', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <DocumentTextIcon className="h-4 w-4 text-gray-500" />
          Documents
        </button>

        {/* Chart */}
        <button
          onClick={(e) => handleAction('Chart', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <ChartBarIcon className="h-4 w-4 text-gray-500" />
          Chart
        </button>

        {/* Add Encounter */}
        <button
          onClick={(e) => handleAction('Add Encounter', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <PlusIcon className="h-4 w-4 text-gray-500" />
          Add Encounter
        </button>

        {/* Prescribe - Highlighted */}
        <button
          onClick={(e) => handleAction('Prescribe', e)}
          className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-3 font-medium"
        >
          <BeakerIcon className="h-4 w-4 text-blue-600" />
          Prescribe
        </button>

        {/* Diagnosis */}
        <button
          onClick={(e) => handleAction('Diagnosis', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <CubeIcon className="h-4 w-4 text-gray-500" />
          Diagnosis
        </button>

        {/* ABA Tool */}
        <button
          onClick={(e) => handleAction('ABA Tool', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <CubeIcon className="h-4 w-4 text-gray-500" />
          ABA Tool
        </button>

        {/* Edit */}
        <button
          onClick={(e) => handleAction('Edit', e)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <PencilIcon className="h-4 w-4 text-gray-500" />
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={(e) => handleAction('Delete', e)}
          className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-3"
        >
          <TrashIcon className="h-4 w-4 text-red-600" />
          Delete
        </button>
      </div>
    ) : null

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Patient Actions"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
        {createPortal(dropdownMenu, document.body)}
      </div>
    )
  }

  const renderContent = () => {
    // Add debug logs
    console.log('renderContent called, activeTab:', activeTab, 'selectedMenu:', selectedMenu);
    
    // Show Past Encounters content
    if (selectedMenu === 'Past Encounters') {
      console.log('Rendering Past Encounters content');
      return (
        <PastEncountersManager 
          patientId={selectedPatient?.id}
          patientName={selectedPatient?.id || 'No Patient Selected'}
          onNewEncounter={() => {
            console.log('Creating new encounter for patient:', selectedPatient?.id);
            // Add new encounter logic here
          }}
          onEncounterSelect={(encounterId: string) => {
            console.log('Selected encounter:', encounterId);
            // Add encounter selection logic here
          }}
          onStatsChange={setEncounterStats}
          className="h-full"
        />
      );
    }
    
    // Show Timeline content
    if (selectedMenu === 'Timeline') {
      console.log('Rendering Timeline content');
      return <TimelinePage />;
    }
    
    // Show Patient Forms content
    if (selectedMenu === 'Patient Forms') {
      console.log('Rendering Patient Forms content');
      return (
        <PatientFormsManager 
          initialPatientId={selectedPatient?.id}
          onPatientSelect={(patient) => setSelectedPatient(patient)}
        />
      );
    }
    
    // Show New Incident form content
    if (selectedMenu === 'New Incident') {
      console.log('Rendering New Incident form');
      return (
        <div className="h-full overflow-auto">
          <NewIncidentPage 
            onClose={() => {
              console.log('New Incident form closed, navigating back to Incidents');
              setSelectedMenu('Incidents');
            }}
          />
        </div>
      );
    }
    
    // Show Incidents content - Full incident management page
    if (selectedMenu === 'Incidents') {
      console.log('Rendering Incidents page');
      return (
        <IncidentsPage />
      );
    }
    
    // Show Interdisciplinary Treatment Plan content
    if (selectedMenu === 'Interdisciplinary Treatment Plan') {
      console.log('Rendering Interdisciplinary Treatment Plan page');
      return (
        <div className="h-full overflow-auto">
          <InterdisciplinaryTreatmentPlanPage 
            onBack={() => {
              console.log('Interdisciplinary Treatment Plan closed, navigating back to dashboard');
              setSelectedMenu('Patient Forms');
            }}
          />
        </div>
      );
    }
    
    // Show Client Summary Chart content
    if (selectedMenu === 'Client Summary Chart') {
      console.log('Rendering Client Summary Chart page');
      return (
        <ClientSummaryChartPage 
          externalEditMode={dashboardEditMode}
          externalActiveWidgets={activeWidgets}
          externalAddWidget={addWidget}
          externalRemoveWidget={removeWidget}
        />
      );
    }
    
    // Default fallback for other menu items
    if (selectedMenu && selectedMenu !== 'Patient Forms' && selectedMenu !== 'Past Encounters' && selectedMenu !== 'Timeline' && selectedMenu !== 'New Incident' && selectedMenu !== 'Interdisciplinary Treatment Plan' && selectedMenu !== 'Client Summary Chart') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedMenu}</h3>
          <p className="text-sm text-gray-500">This feature is coming soon!</p>
        </div>
      );
    }
    
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar - Non-sticky */}
      <div className="">
        <TopNavigationBar 
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
          onSearch={(searchTerm) => console.log('Search:', searchTerm)}
          patient={patientData}
          onNewEncounter={handleNewEncounter}
          onViewChart={() => console.log('View chart for patient:', patientData?.name)}
        />
      </div>

      {/* Main Navigation - Non-sticky */}
      <div className="">
        <MainNavigationBar 
        activeItem={activeTab}
        onNavigate={(itemName) => {
          console.log('Navigate to:', itemName);
          
          // Set the active tab
          setActiveTab(itemName);
          
          // Handle navigation to different pages
          if (itemName === 'Inbox') {
            navigate('/inbox');
          } else if (itemName === 'Dashboard') {
            navigate('/dashboard');
          } else if (itemName === 'Settings') {
            navigate('/settings');
          } else if (itemName === 'Schedule') {
            // Navigate to my-calendar page instead of showing local content
            navigate('/my-calendar');
          } else if (itemName === 'Clients') {
            // Reset to default state when returning to Clients tab
            setActiveTab('Clients');
          }
          // Other navigation will be handled by the MainNavigationBar component
        }}
      />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Only show when on Clients tab - Non-sticky */}
        {activeTab === 'Clients' && (
          <div className="">
            <Sidebar 
              activeItem={selectedMenu}
              onMenuSelect={(itemLabel) => setSelectedMenu(itemLabel)} 
              onSearch={(searchTerm) => console.log('Search sidebar:', searchTerm)}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 bg-gray-50 ${selectedMenu === 'Past Encounters' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {/* Breadcrumb Navigation - Only show when on Clients tab */}
          {activeTab === 'Clients' && (
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Breadcrumb 
                      items={getBreadcrumbItems()} 
                      onNavigate={(href) => {
                        if (href === '#incidents') {
                          setSelectedMenu('Incidents');
                        }
                      }}
                    />
                    {/* Draft Badge for New Incident */}
                    {selectedMenu === 'New Incident' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  {/* Compact Metrics for Past Encounters */}
                  {selectedMenu === 'Past Encounters' && encounterStats && (
                    <div className="border-l border-gray-200 pl-6">
                      <CompactMetrics stats={encounterStats} />
                    </div>
                  )}
                </div>
                
                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                  {/* New Incident Button for Incidents page */}
                  {selectedMenu === 'Incidents' && (
                    <Button
                      onClick={() => {
                        console.log('New Incident button clicked, switching to New Incident menu');
                        setSelectedMenu('New Incident');
                      }}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      New Incident
                    </Button>
                  )}
                  
                  {/* Plan Settings and New Plan Buttons for Interdisciplinary Treatment Plan page */}
                  {selectedMenu === 'Interdisciplinary Treatment Plan' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          console.log('Plan Settings button clicked');
                          // TODO: Implement plan settings functionality
                        }}
                        className="flex items-center gap-2"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        Plan Settings
                      </Button>
                      
                      <Button
                        onClick={() => {
                          console.log('New Plan button clicked - navigating to wizard');
                          navigate('/new-treatment-plan');
                        }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        New Plan
                      </Button>
                    </>
                  )}
                  
                  {/* Dashboard Controls for Client Summary Chart */}
                  {selectedMenu === 'Client Summary Chart' && (
                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <Button
                          onClick={() => setDashboardShowWidgetSelector(!dashboardShowWidgetSelector)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add Widget
                        </Button>
                        
                        {/* Widget Selector Dropdown */}
                        {dashboardShowWidgetSelector && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg border border-gray-200 shadow-lg w-80">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-900">Manage Widgets</h3>
                                <button
                                  onClick={() => setDashboardShowWidgetSelector(false)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {availableWidgets.map(widget => {
                                  const isActive = activeWidgets.includes(widget.id)
                                  return (
                                    <div
                                      key={widget.id}
                                      className="flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:bg-gray-50"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-900">{widget.title}</div>
                                        <div className="text-xs text-gray-500">
                                          {isActive ? 'Currently active' : 'Available to add'}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {isActive ? (
                                          <button
                                            onClick={() => removeWidget(widget.id)}
                                            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                          >
                                            Remove
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => addWidget(widget.id)}
                                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                          >
                                            Add
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => setDashboardEditMode(!dashboardEditMode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          dashboardEditMode 
                            ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        {dashboardEditMode ? 'Exit Edit' : 'Edit Layout'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Patient Actions Dropdown - Show when patient is selected */}
                  {patientData && selectedMenu !== 'Past Encounters' && (
                    <PatientActionsDropdown patient={patientData} />
                  )}
                </div>
                
                {/* Action Buttons for Past Encounters */}
                {selectedMenu === 'Past Encounters' && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handlePrint}
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleExport}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleNewEncounter}
                    >
                      <PlusIcon className="h-4 w-4" />
                      New Encounter
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content Area */}
          <div className={
            selectedMenu === 'Past Encounters' 
              ? 'h-[calc(100%-4rem)]' 
              : selectedMenu === 'Timeline'
                ? 'h-[calc(100%-4rem)] overflow-hidden'
                : 'p-6'
          }>
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          console.log('PrescriptionModal: onClose called from OldUI')
          setIsPrescriptionModalOpen(false)
        }}
        patientName={patientData?.name}
      />
      

    </div>
  )
}

export default OldUI 
