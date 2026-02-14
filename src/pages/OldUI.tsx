import React, { FC, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon, Cog6ToothIcon,
  HomeIcon, ClipboardDocumentIcon, UserGroupIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, Cog8ToothIcon, InboxIcon, WrenchScrewdriverIcon,
  ChartPieIcon, DocumentTextIcon, EnvelopeOpenIcon, DocumentCheckIcon, PencilSquareIcon,
  BeakerIcon as LabIcon, ArrowTrendingUpIcon, DocumentPlusIcon, ClipboardIcon,
  ClipboardDocumentListIcon, Square3Stack3DIcon as MedicationIcon, AcademicCapIcon,
  UserGroupIcon as GroupIcon, FolderIcon,
  DocumentDuplicateIcon, PresentationChartBarIcon, PencilIcon, TrashIcon,
  ChatBubbleLeftRightIcon, GlobeAltIcon, ChevronDownIcon, ChevronRightIcon,
  XMarkIcon, PrinterIcon, ArrowDownTrayIcon, PlusIcon, EllipsisVerticalIcon, CubeIcon,
  Squares2X2Icon, XCircleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
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
import PlanSettingsPage from './PlanSettingsPage'
import PlanSettingsAuthDialog from '../components/molecules/PlanSettingsAuthDialog'
import { useOngoingPlanCheck } from '../hooks/useOngoingPlanCheck'
import { ConfirmDialog } from '../components/molecules/ConfirmDialog/confirm-dialog'
import { FeeSheet } from '@/components/organisms/FeeSheet'
import { Icon } from '@/components/atoms/Icon'
import { Tooltip } from '@/components/ui/tooltip'
import { Switch } from '@/components/atoms/Switch/switch'

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
  },
  {
    id: 'problems',
    type: 'problems',
    title: 'Problems',
    component: () => null, // Placeholder - actual component imported in ClientSummaryChartPage
    defaultSize: { w: 6, h: 8 }
  },
  {
    id: 'billing',
    type: 'billing',
    title: 'Billing',
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
  const navigate = useNavigate()
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
  
  // Plan Settings authentication dialog state
  const [isPlanSettingsAuthOpen, setIsPlanSettingsAuthOpen] = useState(false)
  
  // Dashboard controls state for Client Summary Chart
  const [dashboardEditMode, setDashboardEditMode] = useState(false)
  const [widgetsExpanded, setWidgetsExpanded] = useState(true)
  const chartPageRef = useRef<{ toggleExpandAll: () => void } | null>(null)
  const [isTestPatient, setIsTestPatient] = useState(false)
  
  // Ongoing plan check hook for New Plan warning
  const {
    showOngoingPlanWarning,
    ongoingPlans,
    handleNewPlanWithCheck,
    handleConfirmNewPlan,
    handleCancelNewPlan
  } = useOngoingPlanCheck()
  
  // Treatment plans state - shared between parent and child components
  // In a real app, this would come from a global state or API
  const [treatmentPlansData, setTreatmentPlansData] = useState([
    {
      id: '2',
      planNumber: 'TP-2024-002',
      patientId: 'P002',
      patientName: 'Emily Davis',
      planTitle: 'Social Skills Development Program',
      programs: ['Social Skills Training', 'Group Therapy'],
      startDate: '2024-01-20',
      endDate: undefined, // No end date - ongoing/active
      isActive: true,
      visits: 18,
      createdDate: '2024-01-18',
      createdBy: 'Dr. Amanda Rodriguez',
      supervisorReview: {
        status: 'In Review',
        reviewDate: '2024-01-22',
        reviewer: 'Dr. Michael Wilson',
        comments: 'Pending final review'
      },
      objectives: 6,
      measures: 9,
      isCompleted: false,
      lastModified: '2024-01-25',
      assignedTherapists: ['Amanda Rodriguez', 'Lisa Park'],
      planType: 'Group',
      priority: 'Medium',
      tags: ['social-skills', 'group-therapy', 'communication']
    }
    // This will be populated with full data when the child component initializes
  ])
  // Active widgets state for dashboard
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    'notification-center',
    'functional-status', 
    'diagnosis',
    'demographics',
    'insurance',
    'billing'
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
          nickname: patient.name.split(' ')[0],
          status: patient.status,
          dateOfDeath: patient.dateOfDeath,
          deceasedDate: patient.deceasedDate
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
        case 'Plan Settings':
          // Plan Settings is a global setting, add Treatment Plans as clickable breadcrumb
          items.push({ 
            label: 'Treatment Plans',
            href: '#treatment-plans'
          });
          sectionLabel = 'Plan Settings';
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
    navigate('/add-encounter');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting encounters for patient:', selectedPatient?.id);
    // Add export logic here
  };

  // Helper function to calculate patient status
  const getPatientStatus = (patient: any) => {
    if (!patient) return null
    
    const deceasedDate = patient.dateOfDeath || patient.deceasedDate;
    const isDeceased = deceasedDate !== undefined && deceasedDate !== null;
    
    let daysSinceDeath: number | null = null;
    if (isDeceased && deceasedDate) {
      const deathDate = new Date(deceasedDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - deathDate.getTime());
      daysSinceDeath = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const showDeceasedIndicator = isDeceased && daysSinceDeath !== null && daysSinceDeath >= 14;
    const isDeceasedStatus = isDeceased || patient.status?.toLowerCase() === 'deceased';
    const isActive = !isDeceasedStatus && patient.status?.toLowerCase() === 'active';
    const isInactive = isDeceasedStatus || patient.status?.toLowerCase() === 'inactive' || !patient.status;

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
        return dateString;
      }
    };

    return {
      showDeceasedIndicator,
      deceasedDate,
      daysSinceDeath,
      isDeceasedStatus,
      isActive,
      isInactive,
      formatDate
    }
  }

  // Widget Actions Menu Component - Consolidates widget management actions
  const WidgetActionsMenu: React.FC<{
    widgetsExpanded: boolean
    onToggleWidgets: () => void
    availableWidgets: WidgetConfig[]
    activeWidgets: string[]
    onAddWidget: (widgetId: string) => void
    onRemoveWidget: (widgetId: string) => void
    editMode: boolean
    onToggleEditMode: () => void
  }> = ({ widgetsExpanded, onToggleWidgets, availableWidgets, activeWidgets, onAddWidget, onRemoveWidget, editMode, onToggleEditMode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showWidgetSelector, setShowWidgetSelector] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'active' | 'available'>('active')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const widgetSelectorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
            widgetSelectorRef.current && !widgetSelectorRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setShowWidgetSelector(false)
        }
      }

      if (isOpen || showWidgetSelector) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, showWidgetSelector])

    const getDropdownPosition = () => {
      if (!buttonRef.current) return { top: 0, right: 0 }
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      }
    }

    const filteredWidgets = availableWidgets.filter(widget => {
      if (!searchQuery.trim()) return true
      return widget.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const activeWidgetsList = filteredWidgets.filter(widget => activeWidgets.includes(widget.id))
    const availableWidgetsList = filteredWidgets.filter(widget => !activeWidgets.includes(widget.id))

    const dropdownMenu = isOpen ? (
      <div
        ref={dropdownRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
        style={{
          ...getDropdownPosition(),
          zIndex: 999999
        }}
      >
        <button
          onClick={() => {
            setShowWidgetSelector(!showWidgetSelector)
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <PlusIcon className="h-4 w-4 text-gray-500" />
          Add Widget
        </button>

        <button
          onClick={() => {
            onToggleEditMode()
            setIsOpen(false)
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <Cog6ToothIcon className="h-4 w-4 text-gray-500" />
          {editMode ? 'Exit Edit' : 'Edit Layout'}
        </button>

        <button
          onClick={() => {
            onToggleWidgets()
            setIsOpen(false)
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <Icon
            icon={widgetsExpanded ? "compress" : "expand"}
            className="h-4 w-4"
            size="sm"
          />
          {widgetsExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
    ) : null

    const widgetSelectorMenu = showWidgetSelector ? (
      <div
        ref={widgetSelectorRef}
        className="fixed bg-white rounded-xl border border-gray-200 shadow-xl w-96 overflow-hidden"
        style={{
          top: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 4,
          right: window.innerWidth - (buttonRef.current?.getBoundingClientRect().right || 0),
          zIndex: 9999999
        }}
      >
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Manage Widgets</h3>
            <button
              onClick={() => {
                setShowWidgetSelector(false)
                setSearchQuery('')
              }}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative mb-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
        
        <div className="px-5">
          <div className="grid grid-cols-2 bg-gray-100/50 h-10 rounded-lg p-1 mb-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${
                activeTab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
              }`}
            >
              Active ({activeWidgetsList.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${
                activeTab === 'available' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
              }`}
            >
              Available ({availableWidgetsList.length})
            </button>
          </div>
        </div>

        {activeTab === 'active' ? (
          <div className="px-5 pb-4">
            {activeWidgetsList.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {searchQuery ? 'No active widgets match your search' : 'No active widgets'}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {activeWidgetsList.map((widget, index) => (
                    <div
                      key={widget.id}
                      className={`flex items-center justify-between px-4 py-3 transition-colors group ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100`}
                    >
                      <span className="text-sm font-medium text-gray-900 flex-1">{widget.title}</span>
                      <button
                        onClick={() => {
                          onRemoveWidget?.(widget.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all"
                        title="Remove widget"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-5 pb-4">
            {availableWidgetsList.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {searchQuery ? 'No available widgets match your search' : 'All widgets are active'}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {availableWidgetsList.map((widget, index) => (
                    <div
                      key={widget.id}
                      className={`flex items-center justify-between px-4 py-3 transition-colors group ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100`}
                    >
                      <span className="text-sm font-medium text-gray-900 flex-1">{widget.title}</span>
                      <button
                        onClick={() => {
                          onAddWidget?.(widget.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all"
                        title="Add widget"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ) : null

    return (
      <div className="relative">
        <Tooltip content="Widget Actions" side="bottom">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className={`flex items-center justify-center px-4 py-2 h-9 rounded-lg border transition-colors shadow-none ${
              isOpen
                ? 'bg-gray-100 border-gray-300 text-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Cog6ToothIconSolid className="h-4 w-4" />
          </button>
        </Tooltip>
        {createPortal(dropdownMenu, document.body)}
        {createPortal(widgetSelectorMenu, document.body)}
      </div>
    )
  }

  // Patient Actions Menu Component - Consolidates all patient actions
  const PatientActionsMenu: React.FC<{
    patient: any
    isTestPatient: boolean
    onTestPatientChange: (checked: boolean) => void
    onPrescribe: () => void
    onAddEncounter: () => void
    onEdit: () => void
    onNavigate?: (path: string) => void
  }> = ({ patient, isTestPatient, onTestPatientChange, onPrescribe, onAddEncounter, onEdit, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [clientInfoSubMenuOpen, setClientInfoSubMenuOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const clientInfoRef = useRef<HTMLButtonElement>(null)
    const subMenuRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
            subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setClientInfoSubMenuOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const getDropdownPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0 }
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      }
    }

    const handleAction = (action: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      
      switch (action) {
        case 'Prescribe':
          onPrescribe()
          break
        case 'Add Encounter':
          onAddEncounter()
          break
        case 'Edit':
          onEdit()
          break
        default:
          break
      }
      setIsOpen(false)
    }

    const handleMenuAction = (action: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      console.log(`Menu action: ${action}`)
      // Handle menu actions here
      setIsOpen(false)
      setClientInfoSubMenuOpen(false)
    }

    const handleClientInfoSubMenuAction = (action: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      console.log(`Client Info sub-menu action: ${action}`)
      
      // Handle Facesheet navigation
      if (action === 'Facesheet' && patient && onNavigate) {
        let patientId = patient.id || patient.name || ''
        if (typeof patientId === 'string' && patientId.includes(' (')) {
          patientId = patientId.split(' (')[1].replace(')', '')
        } else if (!patientId && patient.name) {
          patientId = patient.name
        }
        if (patientId) {
          onNavigate(`/facesheet/${encodeURIComponent(patientId)}`)
        }
      }

      // Handle Admit / Pause / Discharge navigation
      if (action === 'Admit / Pause / Discharge' && patient && onNavigate) {
        let patientId = patient.id || patient.name || ''
        if (typeof patientId === 'string' && patientId.includes(' (')) {
          patientId = patientId.split(' (')[1].replace(')', '')
        } else if (!patientId && patient.name) {
          patientId = patient.name
        }
        if (patientId) {
          onNavigate(`/admit-pause-discharge/${encodeURIComponent(patientId)}`)
        }
      }
      
      setIsOpen(false)
      setClientInfoSubMenuOpen(false)
    }

    const getSubMenuPosition = () => {
      if (!clientInfoRef.current || !dropdownRef.current) return { top: 0, right: 0 }
      const clientInfoRect = clientInfoRef.current.getBoundingClientRect()
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      // Position sub-menu on the left side, aligning its right edge with the main menu's left edge
      return {
        top: clientInfoRect.top,
        right: window.innerWidth - dropdownRect.left + 4
      }
    }

    const clientInfoSubMenu = clientInfoSubMenuOpen && isOpen ? (
      <div
        ref={subMenuRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
        style={{
          ...getSubMenuPosition(),
          zIndex: 999999
        }}
        onMouseEnter={() => setClientInfoSubMenuOpen(true)}
        onMouseLeave={() => setClientInfoSubMenuOpen(false)}
      >
        <button
          onClick={(e) => handleClientInfoSubMenuAction('Level of Care', e)}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Level of Care
        </button>
        <button
          onClick={(e) => handleClientInfoSubMenuAction('Admit / Pause / Discharge', e)}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Admit / Pause / Discharge
        </button>
        <button
          onClick={(e) => handleClientInfoSubMenuAction('Facesheet', e)}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Facesheet
        </button>
        <button
          onClick={(e) => handleClientInfoSubMenuAction('Manage eSignature', e)}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Manage eSignature
        </button>
      </div>
    ) : null

    const dropdownMenu = isOpen ? (
      <div
        ref={dropdownRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
        style={{
          ...getDropdownPosition(),
          zIndex: 999999
        }}
      >
        {/* Test Patient Toggle */}
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <label htmlFor="menu-test-patient-switch" className="text-sm font-medium text-gray-700 cursor-pointer">
              Test Patient
            </label>
            <Switch
              id="menu-test-patient-switch"
              checked={isTestPatient}
              onCheckedChange={(checked) => {
                onTestPatientChange(checked)
                console.log('Test patient status changed:', checked)
              }}
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {/* Client Info with Sub-menu */}
          <div 
            className="relative"
            onMouseEnter={() => setClientInfoSubMenuOpen(true)}
            onMouseLeave={() => setClientInfoSubMenuOpen(false)}
          >
            <button
              ref={clientInfoRef}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setClientInfoSubMenuOpen(!clientInfoSubMenuOpen)
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors justify-between"
            >
              <div className="flex items-center gap-3">
                <UsersIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span>Client Info</span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

          </div>

          {/* Resident Info */}
          <button
            onClick={(e) => handleMenuAction('Resident Info', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <UsersIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Resident Info</span>
          </button>

          {/* Clinical */}
          <button
            onClick={(e) => handleMenuAction('Clinical', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <BeakerIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Clinical</span>
          </button>

          {/* Billing */}
          <button
            onClick={(e) => handleMenuAction('Billing', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <BanknotesIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Billing</span>
          </button>

          {/* Documents */}
          <button
            onClick={(e) => handleMenuAction('Documents', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <DocumentTextIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Documents</span>
          </button>

          {/* Reports */}
          <button
            onClick={(e) => handleMenuAction('Reports', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <ChartBarIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Reports</span>
          </button>

          {/* Other */}
          <button
            onClick={(e) => handleMenuAction('Other', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <CubeIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>Other</span>
          </button>

          {/* EDI */}
          <button
            onClick={(e) => handleMenuAction('EDI', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <GlobeAltIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>EDI</span>
          </button>

          {/* External Links */}
          <button
            onClick={(e) => handleMenuAction('External Links', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <GlobeAltIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>External Links</span>
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100 my-1"></div>

        {/* More Options Menu Item */}
        <div className="py-1">
          <button
            onClick={(e) => handleMenuAction('More Options', e)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <Cog6ToothIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>More Options</span>
          </button>
        </div>
      </div>
    ) : null

    return (
      <div className="relative">
        <Tooltip content="Patient Actions" side="bottom">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className={`flex items-center justify-center px-4 py-2 h-9 rounded-lg border transition-colors shadow-none ${
              isOpen
                ? 'bg-gray-100 border-gray-300 text-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Squares2X2Icon className="h-4 w-4" />
          </button>
        </Tooltip>
        {createPortal(dropdownMenu, document.body)}
        {createPortal(clientInfoSubMenu, document.body)}
      </div>
    )
  }

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
          className={`flex items-center justify-center px-4 py-2 h-9 rounded-lg border transition-colors ${
            isOpen
              ? 'bg-gray-100 border-gray-300 text-gray-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          title="Patient Actions"
        >
          <EllipsisVerticalIcon className="h-4 w-4" />
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
            treatmentPlansData={treatmentPlansData}
            onTreatmentPlansChange={setTreatmentPlansData}
          />
        </div>
      );
    }
    
    // Show Client Summary Chart content
    if (selectedMenu === 'Client Summary Chart') {
      console.log('Rendering Client Summary Chart page');
      return (
        <ClientSummaryChartPage 
          ref={chartPageRef}
          externalEditMode={dashboardEditMode}
          externalActiveWidgets={activeWidgets}
          externalAddWidget={addWidget}
          externalRemoveWidget={removeWidget}
          onWidgetExpandStateChange={setWidgetsExpanded}
        />
      );
    }
    
    // Show Plan Settings content
    if (selectedMenu === 'Plan Settings') {
      console.log('Rendering Plan Settings page');
      return <PlanSettingsPage />;
    }
    
    // Show Fee Sheet content
    if (selectedMenu === 'Fee Sheet') {
      console.log('Rendering Fee Sheet page');
      return (
        <FeeSheet 
          patientId={selectedPatient?.id}
          patientName={selectedPatient?.id || 'No Patient Selected'}
        />
      );
    }
    
    // Default fallback for other menu items
    if (selectedMenu && selectedMenu !== 'Patient Forms' && selectedMenu !== 'Past Encounters' && selectedMenu !== 'Timeline' && selectedMenu !== 'New Incident' && selectedMenu !== 'Interdisciplinary Treatment Plan' && selectedMenu !== 'Client Summary Chart' && selectedMenu !== 'Plan Settings' && selectedMenu !== 'Fee Sheet') {
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
        {/* Sidebar - Only show when on Clients tab and not on Plan Settings - Non-sticky */}
        {activeTab === 'Clients' && selectedMenu !== 'Plan Settings' && (
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
                        } else if (href === '#treatment-plans') {
                          setSelectedMenu('Interdisciplinary Treatment Plan');
                        }
                      }}
                    />
                    {/* Draft Badge for New Incident */}
                    {selectedMenu === 'New Incident' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                        Draft
                      </span>
                    )}
                    
                    {/* Patient Status Badges - Show right after breadcrumb */}
                    {patientData && (() => {
                      const status = getPatientStatus(patientData)
                      if (!status) return null
                      
                      return (
                        <>
                          {/* Deceased Indicator */}
                          {status.showDeceasedIndicator && status.deceasedDate && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                              <Icon icon="skull" className="text-red-600 flex-shrink-0" size="sm" />
                              <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                                Deceased
                              </span>
                              <span className="text-xs text-red-600">
                                {status.formatDate(status.deceasedDate)} ({status.daysSinceDeath !== null ? `${status.daysSinceDeath} day${status.daysSinceDeath !== 1 ? 's' : ''} ago` : ''})
                              </span>
                            </div>
                          )}

                          {/* Status Badge - Show Inactive if deceased */}
                          {status.isDeceasedStatus ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-300">
                              <XCircleIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                Inactive
                              </span>
                            </div>
                          ) : status.isActive ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                              <CheckCircleIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                                Active
                              </span>
                            </div>
                          ) : status.isInactive ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-300">
                              <XCircleIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                Inactive
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="h-4 w-4 rounded-full bg-amber-400 border border-amber-500 flex-shrink-0"></div>
                              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                                Unknown
                              </span>
                            </div>
                          )}
                        </>
                      )
                    })()}
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
                          console.log('Plan Settings button clicked - requesting authentication');
                          setIsPlanSettingsAuthOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        Plan Settings
                      </Button>
                      
                      <Button
                        onClick={() => {
                          console.log('New Plan button clicked - checking for ongoing plans');
                          // Check for ongoing plans before navigating
                          handleNewPlanWithCheck(treatmentPlansData, () => {
                            console.log('Proceeding to new plan creation');
                            navigate('/new-treatment-plan');
                          });
                        }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        New Plan
                      </Button>
                    </>
                  )}
                  
                  {/* Patient Actions Menu - Only show on Client Summary Chart */}
                  {selectedMenu === 'Client Summary Chart' && patientData && (
                    <>
                      {/* Widget Actions Menu */}
                      <WidgetActionsMenu
                        widgetsExpanded={widgetsExpanded}
                        onToggleWidgets={() => {
                          chartPageRef.current?.toggleExpandAll()
                          setWidgetsExpanded(prev => !prev)
                        }}
                        availableWidgets={availableWidgets}
                        activeWidgets={activeWidgets}
                        onAddWidget={addWidget}
                        onRemoveWidget={removeWidget}
                        editMode={dashboardEditMode}
                        onToggleEditMode={() => setDashboardEditMode(!dashboardEditMode)}
                      />
                      <PatientActionsMenu
                        patient={patientData}
                        isTestPatient={isTestPatient}
                        onTestPatientChange={setIsTestPatient}
                        onPrescribe={() => setIsPrescriptionModalOpen(true)}
                        onAddEncounter={handleNewEncounter}
                        onEdit={() => {
                          console.log('Edit action clicked for patient:', patientData.name)
                          // TODO: Implement edit patient functionality
                        }}
                        onNavigate={navigate}
                      />
                    </>
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
                : selectedMenu === 'Plan Settings'
                  ? 'h-[calc(100%-4rem)]' // Full height for Plan Settings
                  : selectedMenu === 'Fee Sheet'
                    ? 'h-[calc(100%-4rem)]' // Full height for Fee Sheet, no padding
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
      
      {/* Ongoing Plan Warning Dialog */}
      <ConfirmDialog
        isOpen={showOngoingPlanWarning}
        onClose={handleCancelNewPlan}
        onConfirm={handleConfirmNewPlan}
        title="Ongoing Plans Detected"
        message={`You have ${ongoingPlans.length} ongoing treatment plan${ongoingPlans.length > 1 ? 's' : ''} without end dates. Creating a new plan while existing plans are ongoing may cause conflicts. Would you like to proceed anyway?`}
        confirmButtonText="Proceed"
      />
      
      {/* Plan Settings Authentication Dialog */}
      <PlanSettingsAuthDialog
        isOpen={isPlanSettingsAuthOpen}
        onClose={() => {
          console.log('Plan Settings authentication dialog closed');
          setIsPlanSettingsAuthOpen(false);
        }}
        onSuccess={() => {
          console.log('Plan Settings authentication successful - navigating to Plan Settings');
          setSelectedMenu('Plan Settings');
        }}
      />

    </div>
  )
}

export default OldUI 
