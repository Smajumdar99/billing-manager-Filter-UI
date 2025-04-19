import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb';
import { PatientChartNav } from '@/components/organisms/PatientChartNav';
import { useAuth } from '@/context/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';
import { getWidgetsByRole } from '@/config/widgets';
import type { UserRole } from '@/types/user';
import type { WidgetPositions, WidgetType, Widget } from '@/types/widget';
import { VitalsWidget } from '@/components/widgets/VitalsWidget/vitals-widget';
import { NotesWidget } from '@/components/widgets/NotesWidget/notes-widget';
import { MainMenubar } from '@/components/molecules/Menubar/menubar';
import { MedicationsWidget } from '@/components/widgets/MedicationsWidget/medications-widget';
import { DiagnosisWidget } from '@/components/widgets/DiagnosisWidget/diagnosis-widget';
import { AllergiesWidget } from '@/components/widgets/AllergiesWidget/allergies-widget';
import { LabResultsWidget } from '@/components/widgets/LabResultsWidget/lab-results-widget';
import { AppointmentsWidget } from '@/components/widgets/AppointmentsWidget/appointments-widget';
import { PatientPerformanceCard } from '@/components/molecules/PatientPerformanceCard/patient-performance-card';
import { DisclosuresWidget } from '@/components/widgets/DisclosuresWidget/disclosures-widget';
import { PrescriptionsWidget } from '@/components/widgets/PrescriptionsWidget/prescriptions-widget';
import { ImplantableDevicesWidget } from '@/components/widgets/ImplantableDevicesWidget/implantable-devices-widget';
import type { Patient } from '@/types/patient';
import { mockPatients, type MockPatient } from '@/data/mockPatients';
import { calculateAge } from '@/utils/date';
import { Skeleton } from '@/components/atoms/Skeleton';
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon, 
  XMarkIcon, 
  EllipsisVerticalIcon,
  ArrowDownTrayIcon, 
  PrinterIcon, 
  ShareIcon, 
  TrashIcon, 
  PlusIcon, 
  DocumentPlusIcon, 
  PlusCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ListBulletIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  CreditCardIcon,
  PencilSquareIcon,
  ArchiveBoxXMarkIcon,
  HeartIcon,
  BellIcon,
  UserIcon,
  ClipboardIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  CalendarIcon,
  DocumentIcon,
  ChartPieIcon,
  DeviceTabletIcon,
  DocumentDuplicateIcon,
  ClockIcon as ClockIconOutline,
  StarIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  RectangleStackIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
import { Dialog, DialogContent } from '@/components/atoms/Dialog/dialog';
import { PatientSnapshot } from '@/components/molecules/PatientSnapshot/patient-snapshot';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/atoms/Button/button';
import { WidgetSelector } from '@/components/molecules/WidgetSelector/widget-selector';
import { ActivityWidget } from '@/components/widgets/ActivityWidget/activity-widget';
import { cn } from '@/lib/utils';
import { InsuranceWidget } from '@/components/widgets/InsuranceWidget';
import Demographics from './Demographics';
import { DemographicsWidget } from '@/components/widgets/DemographicsWidget/demographics-widget';
import { ClinicalInsightsCarousel } from '@/components/widgets/ClinicalInsightsCarousel/clinical-insights-carousel';
import { BillingWidget } from '@/components/widgets/BillingWidget/billing-widget';
import { IDCardPhotosWidget } from '@/components/widgets/IDCardPhotosWidget/id-card-photos-widget';
import { AmendmentsWidget } from '@/components/widgets/AmendmentsWidget/amendments-widget';
import { DocumentsWidget } from '@/components/widgets/DocumentsWidget/documents-widget';
import { FrontDeskInsightsCarousel } from '@/components/widgets/FrontDeskInsightsCarousel/front-desk-insights-carousel';
import { FunctionalStatusWidget } from '@/components/widgets/FunctionalStatusWidget/functional-status-widget';
import { CognitiveStatusWidget } from '@/components/widgets/CognitiveStatusWidget/cognitive-status-widget';
import { AdvancedDirectivesWidget } from '@/components/widgets/AdvancedDirectivesWidget/advanced-directives-widget';

const PatientChart: FC = () => {
  const { patientId = '' } = useParams();
  const [navPosition, setNavPosition] = useState<'left' | 'right'>('left');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { user: authUser, loading: authLoading } = useAuth();
  const { user: dbUser } = useCurrentUser();  // Keep this for role info
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
  const [fullscreenWidget, setFullscreenWidget] = useState<WidgetType | null>(null);
  const [minimizedWidgets, setMinimizedWidgets] = useState<WidgetType[]>([]);

  // Add logging to track user state
  useEffect(() => {
    console.log('Current user state:', {
      authUid: authUser?.uid,
      authLoading,
      isLoading,
      isWidgetsLoading
    });
  }, [authUser?.uid, authLoading, isLoading, isWidgetsLoading]);

  const userRole = dbUser?.role || 'doctor' as UserRole;
  const availableWidgets: Widget[] = getWidgetsByRole(userRole);

  // Define default widgets based on role
  const defaultWidgetTypes: WidgetType[] = (() => {
    switch (userRole) {
      case 'billing_specialist':
        return [
          'patient_performance',
          'notification_center'
        ];
      case 'billing_manager':
        return [
          'patient_performance',
          'notification_center',
          'insurance',
          'billing',
          'demographics',
          'documents'
        ];
      case 'clinician':
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'clinical_insights_carousel',
          'vital_signs',
          'clinical_notes',
          'medications',
          'diagnosis',
          'allergies',
          'lab_results'
        ];
      case 'front_desk':
        return [
          'patient_performance',
          'notification_center',
          'front_desk_insights',
          'appointments',
          'demographics',
          'insurance',
          'billing',
          'id_card_photos'
        ];
      case 'clinic_admin':
        return [
          'patient_performance',
          'notification_center'
        ];
      case 'clinical_admin':
          return [
            'patient_performance',
            'notification_center'
          ];  
      case 'cfo':
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'insurance',
          'billing',
          'demographics',
          'documents'
        ];
      case 'practice_manager':
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'clinical_insights_carousel',
          'appointments',
          'demographics',
          'insurance',
          'billing',
          'documents',
          'patient_timeline'
        ];
      case 'ccbhc':
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'clinical_insights_carousel',
          'vital_signs',
          'clinical_notes',
          'medications',
          'diagnosis',
          'allergies',
          'lab_results',
          'identified_needs'
        ];
      case 'supervisor':
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'clinical_insights_carousel',
          'appointments',
          'demographics',
          'insurance',
          'billing',
          'documents',
          'patient_timeline'
        ];
      case 'doctor':
      default:
        return [
          'patient_performance',
          'notification_center',
          'activity',
          'clinical_insights_carousel',
          'vital_signs',
          'clinical_notes',
          'medications',
          'diagnosis',
          'allergies',
          'lab_results'
        ];
    }
  })();

  const [activeWidgets, setActiveWidgets] = useState<WidgetType[]>(defaultWidgetTypes);

  // Define default positions
  const defaultPositions: WidgetPositions = {
    patient_performance: { x: 20, y: 20, width: 400, height: 150 },
    notification_center: { x: 20, y: 190, width: 400, height: 600 },
    activity: { x: 20, y: 860, width: 400, height: 420 },
    clinical_insights_carousel: { x: 1220, y: 1080, width: 1200, height: 400 },
    front_desk_insights: { x: 440, y: 20, width: 760, height: 250 },
    vital_signs: { x: 440, y: 440, width: 390, height: 400 },
    diagnosis: { x: 440, y: 860, width: 390, height: 400 },
    clinical_notes: { x: 850, y: 440, width: 350, height: 400 },
    allergies: { x: 850, y: 860, width: 350, height: 400 },
    medications: { x: 1220, y: 440, width: 350, height: 400 },
    lab_results: { x: 1220, y: 860, width: 350, height: 400 },
    appointments: { x: 440, y: 20, width: 390, height: 400 },
    billing: { x: 850, y: 440, width: 350, height: 400 },
    billing_payment_receipts: { x: 440, y: 860, width: 390, height: 400 },
    billing_statement: { x: 850, y: 860, width: 350, height: 400 },
    billing_prior_auth: { x: 1220, y: 860, width: 350, height: 400 },
    billing_new_payment: { x: 440, y: 1280, width: 390, height: 400 },
    billing_credit_cards: { x: 850, y: 1280, width: 350, height: 400 },
    billing_write_off: { x: 1220, y: 1280, width: 350, height: 400 },
    billing_notes: { x: 440, y: 1700, width: 390, height: 400 },
    documents: { x: 1220, y: 20, width: 350, height: 400 },
    patient_timeline: { x: 0, y: 0, width: 0, height: 0 },
    insurance: { x: 850, y: 20, width: 350, height: 400 },
    disclosures: { x: 0, y: 0, width: 0, height: 0 },
    demographics: { x: 440, y: 440, width: 390, height: 400 },
    implantable_devices: { x: 0, y: 0, width: 0, height: 0 },
    identified_needs: { x: 0, y: 0, width: 0, height: 0 },
    problems: { x: 0, y: 0, width: 0, height: 0 },
    procedures: { x: 0, y: 0, width: 0, height: 0 },
    immunizations: { x: 0, y: 0, width: 0, height: 0 },
    id_card_photos: { x: 1220, y: 440, width: 350, height: 400 },
    clinical_reminders: { x: 0, y: 0, width: 0, height: 0 },
    inbox_reminders: { x: 0, y: 0, width: 0, height: 0 },
    notes: { x: 0, y: 0, width: 0, height: 0 },
    intra_office_messages: { x: 0, y: 0, width: 0, height: 0 },
    patient_portal_messages: { x: 0, y: 0, width: 0, height: 0 },
    patient_reminders: { x: 0, y: 0, width: 0, height: 0 },
    amendments: { x: 0, y: 0, width: 0, height: 0 },
    vitals: { x: 0, y: 0, width: 0, height: 0 },
    functional_status: { x: 0, y: 0, width: 0, height: 0 },
    cognitive_status: { x: 0, y: 0, width: 0, height: 0 },
    diagnostic_imaging: { x: 0, y: 0, width: 0, height: 0 },
    active_directives: { x: 0, y: 0, width: 0, height: 0 },
    golden_thread_alerts: { x: 0, y: 0, width: 0, height: 0 },
    appointment_reminders: { x: 0, y: 0, width: 0, height: 0 },
    prescriptions: { x: 0, y: 0, width: 0, height: 0 }
  };

  const [widgetPositions, setWidgetPositions] = useState<WidgetPositions>(defaultPositions);

  // Load widget positions from Firestore
  useEffect(() => {
    const loadWidgetPositions = async () => {
      if (authLoading || !authUser?.uid) {
        setIsWidgetsLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'userSettings', authUser.uid);
        const docSnap = await getDoc(docRef);
        
        // Initialize with default widgets for the role
        let initialWidgets = defaultWidgetTypes;
        let initialPositions = { ...defaultPositions };
        
        if (docSnap.exists() && docSnap.data().patientChartLayout?.lg) {
          const savedLayout = docSnap.data().patientChartLayout.lg;
          
          // Convert layout array to positions object while preserving default positions
          const savedPositions = savedLayout.reduce((acc: WidgetPositions, item: any) => {
            acc[item.i] = {
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h
            };
            return acc;
          }, {});

          // Merge saved positions with defaults, prioritizing saved positions
          initialPositions = {
            ...defaultPositions,
            ...savedPositions
          };

          // Get widget types from saved layout
          const savedWidgets = savedLayout.map((item: any) => item.i as WidgetType);
          
          // Merge saved widgets with defaults, ensuring all default widgets are included
          initialWidgets = Array.from(new Set([...defaultWidgetTypes, ...savedWidgets]));
        } else {
          // If no saved layout exists, save the default layout
          await saveWidgetPositions(initialPositions, initialWidgets);
        }

        setWidgetPositions(initialPositions);
        setActiveWidgets(initialWidgets);
      } catch (error) {
        console.error('Error loading widget positions:', error);
        // Fallback to defaults on error
        setWidgetPositions(defaultPositions);
        setActiveWidgets(defaultWidgetTypes);
      } finally {
        setIsWidgetsLoading(false);
      }
    };

    loadWidgetPositions();
  }, [authUser?.uid, authLoading, defaultWidgetTypes]);

  // Save widget positions to Firestore with debounce
  const saveWidgetPositions = async (positions: WidgetPositions, active: WidgetType[]) => {
    if (authLoading || !authUser?.uid || isWidgetsLoading) {
      return;
    }
    
    try {
      // Convert positions object to layout array format
      const layoutItems = active.map(widgetType => ({
        i: widgetType,
        x: positions[widgetType].x,
        y: positions[widgetType].y,
        w: positions[widgetType].width,
        h: positions[widgetType].height,
        minW: 4,
        minH: 4,
        isDraggable: true,
        isResizable: true,
        static: false
      }));

      const docRef = doc(db, 'userSettings', authUser.uid);
      
      // Prepare the update data
      const updateData = {
        patientChartLayout: {
          lg: layoutItems,
          md: layoutItems,
          sm: layoutItems,
          updatedAt: new Date()
        },
        updatedAt: new Date()
      };

      // Use setDoc with merge
      await setDoc(docRef, updateData, { merge: true });
    } catch (error) {
      console.error('Error saving widget positions:', error);
    }
  };

  const handleDragStop: RndDragCallback = (e, d) => {
    console.log('Drag stop triggered');
    const widgetElement = e.target as HTMLElement;
    const widgetType = widgetElement.closest('[data-widget-type]')?.getAttribute('data-widget-type') as WidgetType;
    if (widgetType) {
      console.log('Dragged widget:', widgetType);
      const newPositions = {
        ...widgetPositions,
        [widgetType]: { ...widgetPositions[widgetType], x: d.x, y: d.y }
      };
      setWidgetPositions(newPositions);
      saveWidgetPositions(newPositions, activeWidgets);
    }
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    console.log('Resize stop triggered');
    const widgetType = ref.getAttribute('data-widget-type') as WidgetType;
    if (widgetType) {
      console.log('Resized widget:', widgetType);
      const newPositions = {
        ...widgetPositions,
        [widgetType]: {
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight
        }
      };
      setWidgetPositions(newPositions);
      saveWidgetPositions(newPositions, activeWidgets);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Patients', href: '/patient-care/all-patients' },
    { label: patient?.name || 'Patient Chart', href: `/patient-care/patient-chart/${patientId}` },
  ];

  const toggleFullscreen = (widgetType: WidgetType) => {
    setFullscreenWidget(fullscreenWidget === widgetType ? null : widgetType);
  };

  const toggleMinimize = (widgetType: WidgetType) => {
    setMinimizedWidgets(prev => {
      const isCurrentlyMinimized = prev.includes(widgetType);
      const newMinimizedWidgets = isCurrentlyMinimized
        ? prev.filter(w => w !== widgetType)
        : [...prev, widgetType];

      // Update widget height when toggling activity widget
      if (widgetType === 'activity') {
        setWidgetPositions(prevPositions => ({
          ...prevPositions,
          [widgetType]: {
            ...prevPositions[widgetType],
            height: isCurrentlyMinimized ? 350 : 48
          }
        }));
      }

      return newMinimizedWidgets;
    });
  };

  const getWidgetStyle = (widget: Widget) => {
    const isMinimized = minimizedWidgets.includes(widget.type);
    if (fullscreenWidget === widget.type) {
      return {
        width: '100%',
        height: '100%',
        x: 0,
        y: 0,
        zIndex: 50
      };
    }
    const position = widgetPositions[widget.type];
    return {
      width: position.width,
      height: widget.type === 'activity' ? (isMinimized ? 48 : 350) : (isMinimized ? 48 : position.height),
      x: position.x,
      y: position.y,
      zIndex: 0
    };
  };

  const renderWidgetContent = (type: WidgetType) => {
    switch (type) {
      case 'patient_performance':
        return <PatientPerformanceCard totalObjectives={10} metObjectives={7} userRole={userRole} />;
      case 'notification_center':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <NotificationCenter patientId={patientId} />
            </div>
          </div>
        );
      case 'activity':
        return <ActivityWidget patientId={patientId} />;
      case 'clinical_insights_carousel':
        return <ClinicalInsightsCarousel patientId={patientId} isFullscreen={fullscreenWidget === 'clinical_insights_carousel'} />;
      case 'front_desk_insights':
        return <FrontDeskInsightsCarousel patientId={patientId} isFullscreen={fullscreenWidget === 'front_desk_insights'} />;
      case 'vital_signs':
        return <VitalsWidget patientId={patientId} />;
      case 'diagnosis':
        return <DiagnosisWidget patientId={patientId} />;
      case 'clinical_notes':
        return <NotesWidget patientId={patientId} />;
      case 'allergies':
        return <AllergiesWidget patientId={patientId} />;
      case 'medications':
        return <MedicationsWidget patientId={patientId} isFullscreen={fullscreenWidget === 'medications'} />;
      case 'lab_results':
        return <LabResultsWidget patientId={patientId} />;
      case 'appointments':
        return <AppointmentsWidget patientId={patientId} />;
      case 'insurance':
        return <InsuranceWidget patientId={patientId} isFullscreen={fullscreenWidget === 'insurance'} />;
      case 'demographics':
        return <DemographicsWidget patientId={patientId} isFullscreen={fullscreenWidget === 'demographics'} />;
      case 'billing':
      case 'billing_payment_receipts':
      case 'billing_statement':
      case 'billing_prior_auth':
      case 'billing_new_payment':
      case 'billing_credit_cards':
      case 'billing_write_off':
      case 'billing_notes':
        return <BillingWidget patientId={patientId} isFullscreen={fullscreenWidget === type} />;
      case 'prescriptions':
        return <PrescriptionsWidget patientId={patientId} />;
      case 'id_card_photos':
        return <IDCardPhotosWidget patientId={patientId} isFullscreen={fullscreenWidget === 'id_card_photos'} />;
      case 'amendments':
        return <AmendmentsWidget patientId={patientId} isFullscreen={fullscreenWidget === 'amendments'} />;
      case 'disclosures':
        return <DisclosuresWidget patientId={patientId} isFullscreen={fullscreenWidget === 'disclosures'} />;
      case 'implantable_devices':
        return <ImplantableDevicesWidget patientId={patientId} isFullscreen={fullscreenWidget === 'disclosures'} />;
      case 'documents':
        return <DocumentsWidget patientId={patientId} />;
      case 'patient_timeline':
      case 'identified_needs':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-2xl mb-4">🚧</div>
            <h3 className="text-lg font-medium mb-2">{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p className="text-sm text-slate-500 text-center">
              This widget is coming soon. We're working hard to bring you this functionality.
            </p>
          </div>
        );
      case 'functional_status':
        return <FunctionalStatusWidget patientId={patientId} isFullscreen={fullscreenWidget === 'functional_status'} />;
      case 'cognitive_status':
        return <CognitiveStatusWidget patientId={patientId} isFullscreen={fullscreenWidget === 'cognitive_status'} />;
      case 'advanced_directives':
        return <AdvancedDirectivesWidget patientId={patientId} isFullscreen={fullscreenWidget === 'advanced_directives'} />;
      default:
        return null;
    }
  };

  const renderWidgetFooter = (type: WidgetType) => {
    if (type === 'patient_performance' || type === 'id_card_photos') return null;
    
    switch (type) {
      case 'notification_center':
        return (
          <>
            <Button
              onClick={() => console.log('New Task')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              New Task
            </Button>
            <Button
              onClick={() => console.log('New Reminder')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              New Reminder
            </Button>
          </>
        );
      case 'vital_signs':
        return (
          <>
            <Button
              onClick={() => console.log('Add vital signs')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Vital Signs
            </Button>
            <Button
              onClick={() => console.log('View Trends')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View Trends
            </Button>
          </>
        );
      case 'diagnosis':
        return (
          <>
            <Button
              onClick={() => console.log('Add diagnosis')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Diagnosis
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
      case 'clinical_notes':
        return (
          <>
            <Button
              onClick={() => console.log('Add new note')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <DocumentPlusIcon className="w-4 h-4" />
              Add New Note
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
      case 'allergies':
        return (
          <>
            <Button
              onClick={() => console.log('Add allergy')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Allergy
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
      case 'medications':
        return (
          <>
            <Button
              onClick={() => console.log('Prescribe medication')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusIcon className="w-4 h-4" />
              Prescribe Medication
            </Button>
            <Button
              onClick={() => console.log('View Active Medications')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              Active Medications
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              History
            </Button>
          </>
        );
      case 'lab_results':
        return (
          <>
            <Button
              onClick={() => console.log('Add lab result')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Lab Result
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
      case 'appointments':
        return (
          <>
            <Button
              onClick={() => console.log('Add lab result')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Appointment
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
      case 'insurance':
        return (
          <>
            <Button
              onClick={() => console.log('Verify Insurance')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Benefits
            </Button>
            <Button
              onClick={() => console.log('Add Insurance')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Insurance
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              size="sm"
              className="shrink-0"
            >
              View History
            </Button>
          </>
        );
        case 'amendments':
        return (
          <>
            <Button
              onClick={() => console.log('Verify Record')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Record
            </Button>
            
          </>
        );
        case 'implantable_devices':
        return (
          <>
            <Button
              onClick={() => console.log('Add Device')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Add Device
            </Button>
            <Button
              onClick={() => console.log('Edit Devices')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Edit
            </Button>
            
          </>
        );
        case 'prescriptions':
          return (
            <>
              <Button
                onClick={() => console.log('Add Prescription')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Add Prescription
              </Button>
              <Button
                onClick={() => console.log('Edit Prescription')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Edit Prescription
              </Button>
              
            </>
          );
        case 'billing':
          return (
            <>
              <Button
                onClick={() => console.log('Payments Receipts')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Payments Receipts
              </Button>
              <Button
                onClick={() => console.log('Statement')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Statement
              </Button>
              <Button
                onClick={() => console.log('Prior Authorization')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                Prior Authorization
              </Button>
              <Button
                onClick={() => console.log('New Payment')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <BanknotesIcon className="w-4 h-4" />
                New Payment
              </Button>
              <Button
                onClick={() => console.log('Credit Cards on File')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <CreditCardIcon className="w-4 h-4" />
                Credit Cards
              </Button>
              <Button
                onClick={() => console.log('Write Off')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <ArchiveBoxXMarkIcon className="w-4 h-4" />
                Write Off
              </Button>
              <Button
                onClick={() => console.log('Add Note')}
                variant="link"
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Add Note
              </Button>
            </>
          );
      case 'advanced_directives':
        return (
          <>
            <Button
              onClick={() => console.log('Add Directive')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PlusIcon className="w-4 h-4" />
              Add Directive
            </Button>
            <Button
              onClick={() => console.log('Edit Directive')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => console.log('Preview/Print Directive')}
              variant="link"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <PrinterIcon className="w-4 h-4" />
              Preview / Print
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const isPatientPerformance = (type: WidgetType): boolean => type === 'patient_performance';

  const handleToggleWidget = (widgetType: WidgetType) => {
    console.log('handleToggleWidget called with:', widgetType);
    console.log('Current active widgets:', activeWidgets);
    console.log('Default widget types:', defaultWidgetTypes);
    
    // Don't allow removing default widgets
    if (defaultWidgetTypes.includes(widgetType)) {
      console.log('Cannot modify default widget:', widgetType);
      return;
    }

    setActiveWidgets(prev => {
      console.log('Previous active widgets:', prev);
      if (prev.includes(widgetType)) {
        // Removing widget
        console.log('Removing widget:', widgetType);
        const newActiveWidgets = prev.filter(w => w !== widgetType);
        saveWidgetPositions(widgetPositions, newActiveWidgets);
        return newActiveWidgets;
      } else {
        // Adding widget
        console.log('Adding widget:', widgetType);
        // Find the lowest empty position in the grid
        const gridX = [20, 440, 850, 1220];
        const gridY = [20, 440, 860];
        
        // Create a set of occupied positions
        const occupiedPositions = new Set(
          prev.map(widget => {
            const pos = widgetPositions[widget];
            return `${pos.x},${pos.y}`;
          })
        );
        
        // Find first available grid position
        let newX = gridX[0];
        let newY = gridY[0];
        
        let positionFound = false;
        for (const y of gridY) {
          for (const x of gridX) {
            if (!occupiedPositions.has(`${x},${y}`)) {
              newX = x;
              newY = y;
              positionFound = true;
              break;
            }
          }
          if (positionFound) break;
        }
        
        // If no grid position is available, add below the lowest widget
        if (!positionFound) {
          const maxY = Math.max(...prev.map(w => widgetPositions[w].y + widgetPositions[w].height));
          newY = maxY + 20;
        }

        // Update positions with the new widget
        const newPositions = {
          ...widgetPositions,
          [widgetType]: {
            x: newX,
            y: newY,
            width: 350,
            height: 400
          }
        };
        
        // Update widget positions state
        setWidgetPositions(newPositions);
        
        // Add widget to active widgets
        const newActiveWidgets = [...prev, widgetType];
        
        // Save the updated state
        saveWidgetPositions(newPositions, newActiveWidgets);
        
        return newActiveWidgets;
      }
    });
  };

  const handleDeleteWidget = (widgetType: WidgetType) => {
    // Don't allow deleting default widgets
    if (defaultWidgetTypes.includes(widgetType)) {
      console.log('Cannot delete default widget:', widgetType);
      return;
    }

    // Remove widget from active widgets
    setActiveWidgets(prev => {
      const newActiveWidgets = prev.filter(w => w !== widgetType);
      // Save the updated widget positions without the deleted widget
      saveWidgetPositions(widgetPositions, newActiveWidgets);
      return newActiveWidgets;
    });
  };

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Try to get patient data from sessionStorage first
        const storedPatient = sessionStorage.getItem('selectedPatient');
        if (storedPatient) {
          const parsedPatient = JSON.parse(storedPatient);
          if (parsedPatient.id === patientId) {
            setPatient(parsedPatient as Patient);
            setIsLoading(false);
            return;
          }
        }

        // Find patient in mockPatients if not in sessionStorage
        const mockPatient = mockPatients.find((p: MockPatient) => p.id === patientId);
        if (mockPatient) {
          const patientData: Patient = {
            id: mockPatient.id,
            name: mockPatient.name,
            gender: mockPatient.gender,
            age: calculateAge(mockPatient.dateOfBirth),
            dob: mockPatient.dateOfBirth,
            bloodGroup: 'O+',
            insuranceProvider: mockPatient.insurance,
            admittedTo: 'General Ward',
            language: 'English',
            mobile: mockPatient.phoneNumber,
            programAuditor: 'Dr. Smith',
            auditorTimestamp: new Date().toISOString(),
            status: mockPatient.status,
            adminPrograms: mockPatient.adminPrograms,
            email: mockPatient.email,
            lastEncounter: mockPatient.lastEncounter,
            nextAppointment: mockPatient.nextAppointment
          };
          setPatient(patientData);
          // Store in session storage for future use
          sessionStorage.setItem('selectedPatient', JSON.stringify(patientData));
        } else {
          const unknownPatient: Patient = {
            id: patientId,
            name: 'Unknown Patient',
            dob: '1990-01-01',
            gender: 'Not specified',
            age: 0,
            bloodGroup: 'Unknown',
            insuranceProvider: 'Unknown',
            admittedTo: 'Unknown',
            language: 'Unknown',
            mobile: 'Unknown',
            programAuditor: 'Unknown',
            auditorTimestamp: new Date().toISOString(),
            status: 'Unknown',
            adminPrograms: [],
            email: 'Unknown',
            lastEncounter: 'Unknown',
            nextAppointment: null
          };
          setPatient(unknownPatient);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  // Function to get appropriate icon based on widget type
  const getWidgetIcon = (widgetType: WidgetType) => {
    // Modern styled icon with circular background
    const getStyledIcon = (Icon: any, bgColor: string, iconColor: string) => {
      return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} mr-2 shadow-md`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      );
    };
    
    switch (widgetType) {
      case 'patient_performance':
        return getStyledIcon(ChartBarIcon, 'bg-blue-100', 'text-blue-600');
      case 'notification_center':
        return getStyledIcon(BellIcon, 'bg-amber-100', 'text-amber-600');
      case 'activity':
        return getStyledIcon(ClockIconOutline, 'bg-purple-100', 'text-purple-600');
      case 'clinical_insights_carousel':
        return getStyledIcon(ChartPieIcon, 'bg-cyan-100', 'text-cyan-700');
      case 'front_desk_insights':
        return getStyledIcon(SquaresPlusIcon, 'bg-amber-100', 'text-amber-700');
      case 'vital_signs':
        return getStyledIcon(HeartIcon, 'bg-red-100', 'text-red-600');
      case 'clinical_notes':
        return getStyledIcon(DocumentIcon, 'bg-emerald-100', 'text-emerald-600');
      case 'medications':
        return getStyledIcon(SquaresPlusIcon, 'bg-orange-100', 'text-orange-600');
      case 'diagnosis':
        return getStyledIcon(ClipboardIcon, 'bg-indigo-100', 'text-indigo-600');
      case 'allergies':
        return getStyledIcon(ExclamationTriangleIcon, 'bg-rose-100', 'text-rose-600');
      case 'lab_results':
        return getStyledIcon(BeakerIcon, 'bg-blue-100', 'text-blue-500');
      case 'appointments':
        return getStyledIcon(CalendarIcon, 'bg-violet-100', 'text-violet-600');
      case 'demographics':
        return getStyledIcon(UserIcon, 'bg-green-100', 'text-green-600');
      case 'insurance':
        return getStyledIcon(BuildingOfficeIcon, 'bg-blue-100', 'text-blue-700');
      case 'billing':
      case 'billing_payment_receipts':
      case 'billing_statement':
      case 'billing_prior_auth':
      case 'billing_new_payment':
      case 'billing_credit_cards':
      case 'billing_write_off':
      case 'billing_notes':
        return getStyledIcon(BanknotesIcon, 'bg-green-100', 'text-green-700');
      case 'documents':
        return getStyledIcon(DocumentDuplicateIcon, 'bg-amber-100', 'text-amber-700');
      case 'id_card_photos':
        return getStyledIcon(IdentificationIcon, 'bg-purple-100', 'text-purple-700');
      case 'amendments':
        return getStyledIcon(PencilSquareIcon, 'bg-orange-100', 'text-orange-700');
      case 'patient_timeline':
        return getStyledIcon(ListBulletIcon, 'bg-blue-100', 'text-blue-600');
      case 'disclosures':
        return getStyledIcon(InformationCircleIcon, 'bg-teal-100', 'text-teal-600');
      case 'implantable_devices':
        return getStyledIcon(DeviceTabletIcon, 'bg-slate-100', 'text-slate-700');
      case 'prescriptions':
        return getStyledIcon(ClipboardDocumentCheckIcon, 'bg-orange-100', 'text-orange-600');
      case 'identified_needs':
        return getStyledIcon(StarIcon, 'bg-yellow-100', 'text-yellow-600');
      case 'advanced_directives':
        return getStyledIcon(ClipboardDocumentCheckIcon, 'bg-purple-100', 'text-purple-600');
      default:
        return getStyledIcon(RectangleStackIcon, 'bg-slate-100', 'text-slate-600');
    }
  };

  if (isLoading || isWidgetsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          navigation={navigation}
          logo={<span>LOGO</span>}
          userInfo={{
            name: authUser?.displayName || '',
            role: dbUser?.role || 'No Role'
          }}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            variant="patient-chart"
            notificationCount={0}
            onSearch={() => {}}
            onNotificationClick={() => {}}
            onAddClick={() => {}}
            onResetLayout={() => {}}
            onMobileMenuClick={() => {}}
            userInfo={{
              name: authUser?.displayName || '',
              role: dbUser?.role || 'No Role'
            }}
          />
          <div className="flex-1 flex overflow-hidden p-2">
            <div className="bg-white rounded-2xl shadow-sm mr-2">
              <PatientChartNav
                position={navPosition}
                onPositionChange={setNavPosition}
                className="border-0"
              />
            </div>
            <main className="flex-1 overflow-y-auto rounded-sm p-0 pt-2">
              <div className="mb-0 px-4 flex justify-between items-center">
                <Breadcrumb items={breadcrumbItems} />
                <MainMenubar className="ml-4" />
              </div>
              <div className="relative w-full h-[calc(100vh)] p-4 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-32" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        navigation={navigation}
        logo={<span>LOGO</span>}
        userInfo={{
          name: authUser?.displayName || '',
          role: dbUser?.role || 'No Role'
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          variant="patient-chart"
          notificationCount={3}
          onSearch={() => {}}
          onNotificationClick={() => {}}
          onAddClick={() => {}}
          onMobileMenuClick={() => {}}
          userInfo={{
            name: authUser?.displayName || '',
            role: dbUser?.role || 'No Role'
          }}
        >
          <PatientSnapshot
            patient={{
              id: patient?.id || '',
              name: patient?.name || '',
              gender: patient?.gender || '',
              age: patient?.age || 0,
              bloodGroup: patient?.bloodGroup || '',
              insuranceProvider: patient?.insuranceProvider || '',
              admittedTo: patient?.admittedTo || '',
              language: patient?.language || '',
              mobile: patient?.mobile || '',
              programAuditor: patient?.programAuditor || '',
              auditorTimestamp: patient?.auditorTimestamp || '',
            }}
            variant="header"
            onNewEncounter={() => console.log('New encounter')}
            onViewChart={() => console.log('View chart')}
          />
        </Header>
        <div className="flex-1 flex overflow-hidden p-2">
          {navPosition === 'left' && (
            <div className="bg-white rounded-2xl shadow-sm mr-2">
              <PatientChartNav
                position="left"
                onPositionChange={setNavPosition}
                onSectionSelect={setSelectedSection}
                className="border-0"
              />
            </div>
          )}
          <main className="flex-1 overflow-y-auto rounded-sm p-0 pt-2">
            <div className="mb-0 px-4 flex justify-between items-center">
              <Breadcrumb items={breadcrumbItems} />
              <div className="flex items-center gap-2">
                {!selectedSection && (
                  <WidgetSelector
                    availableWidgets={availableWidgets}
                    activeWidgets={activeWidgets}
                    onToggleWidget={handleToggleWidget}
                  />
                )}
                <MainMenubar className="ml-2" />
              </div>
            </div>
            
            <div className="relative w-full h-[calc(300vh)] p-4 overflow-y-auto">
              {selectedSection === 'Demographics' ? (
                <Demographics patientId={patientId} />
              ) : (
                <>
                  {availableWidgets.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No widgets available for your role.</p>
                    </div>
                  ) : (
                    <>
                      {availableWidgets.map(widget => {
                        // Only render if widget is active
                        if (!activeWidgets.includes(widget.type)) return null;
                        
                        const position = widgetPositions[widget.type];
                        
                        if (!position) {
                          console.log('No position found for widget:', widget.type);
                          return null;
                        }

                        const rndProps = {
                          key: widget.id,
                          default: getWidgetStyle(widget),
                          minWidth: 200,
                          maxWidth: fullscreenWidget === widget.type 
                            ? window.innerWidth 
                            :1900,
                          minHeight: minimizedWidgets.includes(widget.type) ? 48 : widget.type === 'patient_performance' ? 100 : 200,
                          maxHeight: fullscreenWidget === widget.type ? window.innerHeight : widget.type === 'patient_performance' ? 300 : 800,
                          bounds: "parent",
                          dragHandleClassName: "drag-handle",
                          onDragStop: handleDragStop,
                          onResizeStop: handleResizeStop,
                          disableDragging: fullscreenWidget === widget.type,
                          enableResizing: {
                            top: false,
                            right: true,
                            bottom: true,
                            left: false,
                            topRight: false,
                            bottomRight: true,
                            bottomLeft: false,
                            topLeft: false
                          },
                          "data-widget-type": widget.type,
                          className: "absolute bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300",
                          style: {
                            ...getWidgetStyle(widget),
                            transition: 'height 0.3s ease-in-out'
                          }
                        };

                        switch (widget.type) {
                          case 'patient_performance':
                            return (
                              <>
                                <Rnd {...rndProps}>
                                  <div className="h-full flex flex-col">
                                    <div className="drag-handle flex items-center justify-between p-3 cursor-move bg-white border-b">
                                      <h3 className="font-medium text-sm flex items-center">
                                        {getWidgetIcon(widget.type)}
                                        {widget.title}
                                      </h3>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => toggleFullscreen(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <ArrowsPointingOutIcon className="w-4 h-4" />
                                        </button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                              <EllipsisVerticalIcon className="w-4 h-4" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Export', widget.type)}
                                              className="gap-2"
                                            >
                                              <ArrowDownTrayIcon className="w-4 h-4" />
                                              Export
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Print', widget.type)}
                                              className="gap-2"
                                            >
                                              <PrinterIcon className="w-4 h-4" />
                                              Print
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Share', widget.type)}
                                              className="gap-2"
                                            >
                                              <ShareIcon className="w-4 h-4" />
                                              Share
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteWidget(widget.type)}
                                              className="gap-2 text-red-600 focus:text-red-600"
                                              disabled={defaultWidgetTypes.includes(widget.type)}
                                            >
                                              <TrashIcon className="w-4 h-4" />
                                              {defaultWidgetTypes.includes(widget.type) ? 'Cannot Delete Default Widget' : 'Delete'}
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <PatientPerformanceCard
                                        totalObjectives={10}
                                        metObjectives={7}
                                        userRole={userRole}
                                      />
                                    </div>
                                  </div>
                                </Rnd>

                                <Dialog open={fullscreenWidget === widget.type} onOpenChange={() => setFullscreenWidget(null)}>
                                  <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 shadow-md">
                                    <div className="flex flex-col h-full">
                                      <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold flex items-center">
                                          {getWidgetIcon(widget.type)}
                                          {widget.title}
                                        </h2>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => console.log('Export', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Print', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <PrinterIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Share', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ShareIcon className="w-4 h-4" />
                                          </button>
                                          <div className="w-px h-4 bg-gray-200 mx-1" />
                                          <button
                                            onClick={() => setFullscreenWidget(null)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex-1 p-6 overflow-auto">
                                        <PatientPerformanceCard
                                          totalObjectives={10}
                                          metObjectives={7}
                                          userRole={userRole}
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          case 'clinical_insights_carousel': {
                            const isMinimized = minimizedWidgets.includes(widget.type);
                            return (
                              <>
                                <Rnd {...rndProps} minHeight={isMinimized ? 48 : 100} maxHeight={isMinimized ? 48 : 300}>
                                  <div className="h-full flex flex-col">
                                    <div className="drag-handle flex items-center justify-between p-3 cursor-move bg-white border-b">
                                      <h3 className="font-medium text-sm flex items-center">
                                        {getWidgetIcon(widget.type)}
                                        {widget.title}
                                      </h3>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => toggleMinimize(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          {isMinimized ? (
                                          <ChevronDownIcon className="w-4 h-4" />
                                          ) : (
                                          <ChevronUpIcon className="w-4 h-4" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => toggleFullscreen(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <ArrowsPointingOutIcon className="w-4 h-4" />
                                        </button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                              <EllipsisVerticalIcon className="w-4 h-4" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Export', widget.type)}
                                              className="gap-2"
                                            >
                                              <ArrowDownTrayIcon className="w-4 h-4" />
                                              Export
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Print', widget.type)}
                                              className="gap-2"
                                            >
                                              <PrinterIcon className="w-4 h-4" />
                                              Print
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Share', widget.type)}
                                              className="gap-2"
                                            >
                                              <ShareIcon className="w-4 h-4" />
                                              Share
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    {!isMinimized && (
                                      <div className="flex-1">
                                        <ClinicalInsightsCarousel
                                          patientId={patientId}
                                          isFullscreen={fullscreenWidget === 'clinical_insights_carousel'}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Rnd>
                                
                                <Dialog open={fullscreenWidget === widget.type} onOpenChange={() => setFullscreenWidget(null)}>
                                  <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 shadow-md">
                                    <div className="flex flex-col h-full">
                                      <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold">{widget.title}</h2>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => console.log('Export', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Print', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <PrinterIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Share', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ShareIcon className="w-4 h-4" />
                                          </button>
                                          <div className="w-px h-4 bg-gray-200 mx-1" />
                                          <button
                                            onClick={() => setFullscreenWidget(null)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex-1 p-6 overflow-auto">
                                        <ClinicalInsightsCarousel
                                          patientId={patientId}
                                          isFullscreen={true}
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          }
                          case 'front_desk_insights': {
                            const isMinimized = minimizedWidgets.includes(widget.type);
                            return (
                              <>
                                <Rnd {...rndProps} minHeight={isMinimized ? 48 : 100} maxHeight={isMinimized ? 48 : 300}>
                                  <div className="h-full flex flex-col">
                                    <div className="drag-handle flex items-center justify-between p-3 cursor-move bg-white border-b">
                                      <h3 className="font-medium text-sm flex items-center">
                                        {getWidgetIcon(widget.type)}
                                        {widget.title}
                                      </h3>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => toggleMinimize(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          {isMinimized ? (
                                          <ChevronDownIcon className="w-4 h-4" />
                                          ) : (
                                          <ChevronUpIcon className="w-4 h-4" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => toggleFullscreen(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <ArrowsPointingOutIcon className="w-4 h-4" />
                                        </button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                              <EllipsisVerticalIcon className="w-4 h-4" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Export', widget.type)}
                                              className="gap-2"
                                            >
                                              <ArrowDownTrayIcon className="w-4 h-4" />
                                              Export
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Print', widget.type)}
                                              className="gap-2"
                                            >
                                              <PrinterIcon className="w-4 h-4" />
                                              Print
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Share', widget.type)}
                                              className="gap-2"
                                            >
                                              <ShareIcon className="w-4 h-4" />
                                              Share
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    {!isMinimized && (
                                      <div className="flex-1">
                                        <FrontDeskInsightsCarousel
                                          patientId={patientId}
                                          isFullscreen={fullscreenWidget === 'front_desk_insights'}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Rnd>
                                
                                <Dialog open={fullscreenWidget === widget.type} onOpenChange={() => setFullscreenWidget(null)}>
                                  <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 shadow-md">
                                    <div className="flex flex-col h-full">
                                      <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold">{widget.title}</h2>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => console.log('Export', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Print', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <PrinterIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Share', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ShareIcon className="w-4 h-4" />
                                          </button>
                                          <div className="w-px h-4 bg-gray-200 mx-1" />
                                          <button
                                            onClick={() => setFullscreenWidget(null)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex-1 p-6 overflow-auto">
                                        <FrontDeskInsightsCarousel
                                          patientId={patientId}
                                          isFullscreen={true}
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          }
                          default: {
                            const isMinimized = minimizedWidgets.includes(widget.type);
                            return (
                              <>
                                <Rnd {...rndProps} minHeight={48} maxHeight={isMinimized ? 48 : 800}>
                                  <div className="h-full flex flex-col">
                                    <div className="drag-handle flex items-center justify-between p-4 cursor-move bg-white">
                                      <h3 className="font-medium flex items-center">
                                        {getWidgetIcon(widget.type)}
                                        {widget.title}
                                      </h3>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => toggleMinimize(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          {isMinimized ? (
                                          <ChevronDownIcon className="w-4 h-4" />
                                          ) : (
                                          <ChevronUpIcon className="w-4 h-4" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => toggleFullscreen(widget.type)}
                                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <ArrowsPointingOutIcon className="w-4 h-4" />
                                        </button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                              <EllipsisVerticalIcon className="w-4 h-4" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Export', widget.type)}
                                              className="gap-2"
                                            >
                                              <ArrowDownTrayIcon className="w-4 h-4" />
                                              Export
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Print', widget.type)}
                                              className="gap-2"
                                            >
                                              <PrinterIcon className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => console.log('Share', widget.type)}
                                              className="gap-2"
                                            >
                                              <ShareIcon className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteWidget(widget.type)}
                                              className="gap-2 text-red-600 focus:text-red-600"
                                              disabled={defaultWidgetTypes.includes(widget.type)}
                                            >
                                              <TrashIcon className="w-4 h-4" />
                                              {defaultWidgetTypes.includes(widget.type) ? 'Cannot Delete Default Widget' : 'Delete'}
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    {!isMinimized && (
                                      <div className={cn(
                                        "flex-1 p-4 pb-14",
                                        widget.type === 'id_card_photos' && "!pb-4"
                                      )}>
                                        {renderWidgetContent(widget.type)}
                                        {renderWidgetFooter(widget.type) && (
                                          <div className="absolute bottom-0 left-0 right-0 h-14 rounded-b-lg bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-md">
                                            <div className="relative h-full">
                                              <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
                                                {renderWidgetFooter(widget.type)}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </Rnd>

                                <Dialog open={fullscreenWidget === widget.type} onOpenChange={() => setFullscreenWidget(null)}>
                                  <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 shadow-md">
                                    <div className="flex flex-col h-full">
                                      <div className="flex items-center justify-left px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold pr-4 flex items-center">
                                          {getWidgetIcon(widget.type)}
                                          {widget.title}
                                        </h2>
                                        <div className="flex items-center gap-1 pr-8">
                                          <button
                                            onClick={() => console.log('Export', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Print', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <PrinterIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => console.log('Share', widget.type)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <ShareIcon className="w-4 h-4" />
                                          </button>
                                          <div className="w-px h-4 bg-gray-200 mx-1" />
                                          <button
                                            onClick={() => setFullscreenWidget(null)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex-1 p- pb-14 overflow-auto relative">
                                        {renderWidgetContent(widget.type)}
                                        {renderWidgetFooter(widget.type) && (
                                          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-md">
                                            <div className="relative h-full">
                                              <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
                                                {renderWidgetFooter(widget.type)}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          }
                        }
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
          {navPosition === 'right' && (
            <div className="bg-white rounded-2xl shadow-sm ml-2">
              <PatientChartNav
                position="right"
                onPositionChange={setNavPosition}
                onSectionSelect={setSelectedSection}
                className="border-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientChart; 