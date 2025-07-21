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

import IncidentsPage from './IncidentsPage'
import PrescriptionModal from '../components/molecules/PrescriptionModal/prescription-modal'
import NewIncidentPage from '../components/organisms/NewIncident/NewIncidentPage'
import InterdisciplinaryTreatmentPlanPage from '../components/organisms/InterdisciplinaryTreatmentPlan/InterdisciplinaryTreatmentPlanPage'

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

  
  const navigate = useNavigate();

  // Load patient from sessionStorage on component mount
  useEffect(() => {
    const savedPatient = sessionStorage.getItem('selectedPatient');
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
    
    // Default fallback for other menu items
    if (selectedMenu && selectedMenu !== 'Patient Forms' && selectedMenu !== 'Past Encounters' && selectedMenu !== 'Timeline' && selectedMenu !== 'New Incident' && selectedMenu !== 'Interdisciplinary Treatment Plan') {
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
      {/* Top Navigation Bar - Sticky */}
      <div className="sticky top-0 z-50">
        <TopNavigationBar 
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
          onSearch={(searchTerm) => console.log('Search:', searchTerm)}
          patient={patientData}
          onNewEncounter={handleNewEncounter}
          onViewChart={() => console.log('View chart for patient:', patientData?.name)}
        />
      </div>

      {/* Main Navigation - Sticky */}
      <div className="sticky top-[68px] z-40">
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
        {/* Sidebar - Only show when on Clients tab - Sticky */}
        {activeTab === 'Clients' && (
          <div className="sticky top-[68px] h-[calc(100vh-68px)] z-30">
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
                  
                  {/* New Plan Button for Interdisciplinary Treatment Plan page */}
                  {selectedMenu === 'Interdisciplinary Treatment Plan' && (
                    <Button
                      onClick={() => {
                        console.log('New Plan button clicked');
                        // TODO: Implement new plan modal or navigation
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      New Plan
                    </Button>
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
