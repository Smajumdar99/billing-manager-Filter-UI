import React, { FC, useState, useEffect } from 'react'
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
  XMarkIcon, PrinterIcon, ArrowDownTrayIcon, PlusIcon
} from '@heroicons/react/24/outline'
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui'
import PastEncountersManager from '../components/organisms/PastEncountersManager'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { CompactMetrics } from '@/components/molecules/CompactMetrics'
import PatientFormsManager from '../components/organisms/PatientFormsManager'

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
        default:
          sectionLabel = selectedMenu;
      }
      
      items.push({ 
        label: sectionLabel,
        href: undefined // Current section, no link
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
    
    // Default fallback for other menu items
    if (selectedMenu && selectedMenu !== 'Patient Forms' && selectedMenu !== 'Past Encounters') {
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
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={(searchTerm) => console.log('Search:', searchTerm)}
        patient={patientData}
        onNewEncounter={handleNewEncounter}
        onViewChart={() => console.log('View chart for patient:', patientData?.name)}
      />

      {/* Main Navigation */}
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

      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar - Only show when on Clients tab */}
        {activeTab === 'Clients' && (
          <Sidebar 
            activeItem={selectedMenu}
            onMenuSelect={(itemLabel) => setSelectedMenu(itemLabel)} 
            onSearch={(searchTerm) => console.log('Search sidebar:', searchTerm)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 ${selectedMenu === 'Past Encounters' ? 'bg-gray-50 overflow-hidden' : 'bg-gray-50 overflow-y-auto'}`}>
          {/* Breadcrumb Navigation - Only show when on Clients tab */}
          {activeTab === 'Clients' && (
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Breadcrumb items={getBreadcrumbItems()} />
                  
                  {/* Compact Metrics for Past Encounters */}
                  {selectedMenu === 'Past Encounters' && encounterStats && (
                    <div className="border-l border-gray-200 pl-6">
                      <CompactMetrics stats={encounterStats} />
                    </div>
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
          <div className={selectedMenu === 'Past Encounters' ? 'h-[calc(100%-4rem)]' : 'p-6'}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OldUI 
