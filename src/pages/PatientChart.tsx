import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb';
import { PatientChartNav } from '@/components/organisms/PatientChartNav';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';
import { getWidgetsByRole, hasWidgetPermission } from '@/config/widgets';
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
import type { Patient } from '@/types/patient';
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
  ListBulletIcon
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

const PatientChart: FC = () => {
  const { patientId = '' } = useParams();
  const [navPosition, setNavPosition] = useState<'left' | 'right'>('left');
  const { user } = useCurrentUser();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreenWidget, setFullscreenWidget] = useState<WidgetType | null>(null);
  const [minimizedWidgets, setMinimizedWidgets] = useState<WidgetType[]>([]);

  const userRole = user?.role || 'doctor' as UserRole;
  const availableWidgets: Widget[] = getWidgetsByRole(userRole);

  // Define default widgets that should always be shown
  const defaultWidgetTypes: WidgetType[] = [
    'patient_performance',
    'notification_center',
    'vital_signs',
    'diagnosis',
    'clinical_notes',
    'allergies',
    'medications',
    'lab_results',
    'appointments'
  ];

  const [activeWidgets, setActiveWidgets] = useState<WidgetType[]>(defaultWidgetTypes);

  console.log('Current user role:', userRole);
  console.log('Available widgets:', availableWidgets);

  const [widgetPositions, setWidgetPositions] = useState<WidgetPositions>({
    patient_performance: { x: 20, y: 20, width: 400, height: 100 },
    notification_center: { x: 20, y: 140, width: 400, height: 700 },
    vital_signs: { x: 440, y: 20, width: 390, height: 400 },
    diagnosis: { x: 440, y: 440, width: 390, height: 400 },
    clinical_notes: { x: 850, y: 20, width: 350, height: 400 },
    allergies: { x: 850, y: 440, width: 350, height: 400 },
    medications: { x: 1220, y: 20, width: 350, height: 400 },
    lab_results: { x: 1220, y: 440, width: 350, height: 400 },
    appointments: { x: 20, y: 860, width: 400, height: 400 },
    documents: { x: 0, y: 0, width: 0, height: 0 },
    patient_timeline: { x: 0, y: 0, width: 0, height: 0 },
    insurance: { x: 0, y: 0, width: 0, height: 0 },
    billing: { x: 0, y: 0, width: 0, height: 0 },
    disclosures: { x: 0, y: 0, width: 0, height: 0 },
    demographics: { x: 0, y: 0, width: 0, height: 0 },
    implantable_devices: { x: 0, y: 0, width: 0, height: 0 },
    identified_needs: { x: 0, y: 0, width: 0, height: 0 }
  });

  console.log('Widget positions:', widgetPositions);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Simulate API call
        const mockPatient: Patient = {
          id: patientId,
          name: 'John Doe',
          dob: '1990-01-01',
          gender: 'Male',
          age: 33,
          bloodGroup: 'O+',
          insuranceProvider: 'Blue Cross',
          admittedTo: 'General Ward',
          language: 'English',
          mobile: '+1234567890',
          programAuditor: 'Dr. Smith',
          auditorTimestamp: new Date().toISOString(),
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatient(mockPatient);
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

  const handleDragStop: RndDragCallback = (e, d) => {
    const widgetElement = e.target as HTMLElement;
    const widgetType = widgetElement.closest('[data-widget-type]')?.getAttribute('data-widget-type') as WidgetType;
    if (widgetType) {
      setWidgetPositions(prev => ({
        ...prev,
        [widgetType]: { ...prev[widgetType], x: d.x, y: d.y }
      }));
    }
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    const widgetType = ref.getAttribute('data-widget-type') as WidgetType;
    if (widgetType) {
      setWidgetPositions(prev => ({
        ...prev,
        [widgetType]: {
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight
        }
      }));
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
    setMinimizedWidgets(prev => 
      prev.includes(widgetType) 
        ? prev.filter(w => w !== widgetType)
        : [...prev, widgetType]
    );
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
      height: isMinimized ? 48 : position.height,
      x: position.x,
      y: position.y,
      zIndex: 0
    };
  };

  const renderWidgetContent = (type: WidgetType) => {
    switch (type) {
      case 'patient_performance':
        return <PatientPerformanceCard totalObjectives={10} metObjectives={7} />;
      case 'notification_center':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <NotificationCenter patientId={patientId} />
            </div>
          </div>
        );
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
      // Placeholder content for unimplemented widgets
      case 'documents':
      case 'patient_timeline':
      case 'insurance':
      case 'billing':
      case 'disclosures':
      case 'demographics':
      case 'implantable_devices':
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
      default:
        return null;
    }
  };

  const renderWidgetFooter = (type: WidgetType) => {
    if (type === 'patient_performance') return null;
    
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
      default:
        return null;
    }
  };

  const isPatientPerformance = (type: WidgetType): boolean => type === 'patient_performance';

  const handleToggleWidget = (widgetType: WidgetType) => {
    // Don't allow removing default widgets
    if (defaultWidgetTypes.includes(widgetType)) {
      return;
    }

    setActiveWidgets(prev => {
      const newActiveWidgets = prev.includes(widgetType)
        ? prev.filter(w => w !== widgetType)
        : [...prev, widgetType];
      
      // If we're adding a widget, update its position
      if (!prev.includes(widgetType)) {
        // Find the lowest y-coordinate and available x-coordinate
        let maxY = 0;
        let usedPositions = new Set<string>();
        
        // Track all used positions
        prev.forEach(activeWidget => {
          const pos = widgetPositions[activeWidget];
          maxY = Math.max(maxY, pos.y + pos.height);
          usedPositions.add(`${pos.x},${pos.y}`);
        });

        // Define grid positions
        const gridX = [20, 440, 850, 1220];
        const gridY = [20, 440, 860];
        
        // Find first available grid position
        let newX = gridX[0];
        let newY = gridY[0];
        
        // Find first available position in the grid
        let found = false;
        for (const y of gridY) {
          for (const x of gridX) {
            if (!usedPositions.has(`${x},${y}`)) {
              newX = x;
              newY = y;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        
        // If no grid position is available, add to the next row
        if (!found) {
          newX = 20;
          newY = maxY + 20;
        }
        
        setWidgetPositions(prevPositions => ({
          ...prevPositions,
          [widgetType]: {
            ...prevPositions[widgetType],
            x: newX,
            y: newY,
            width: 350,
            height: 400
          }
        }));
      }
      
      return newActiveWidgets;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          navigation={navigation}
          logo={<span>LOGO</span>}
          userInfo={{
            name: user?.displayName || '',
            role: user?.role || ''
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
              name: user?.displayName || '',
              role: user?.role || ''
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
          name: user?.displayName || '',
          role: userRole
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
            name: user?.displayName || '',
            role: userRole
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
                className="border-0"
              />
            </div>
          )}
          <main className="flex-1 overflow-y-auto rounded-sm p-0 pt-2">
            <div className="mb-0 px-4 flex justify-between items-center">
              <Breadcrumb items={breadcrumbItems} />
              <div className="flex items-center gap-2">
                <WidgetSelector
                  availableWidgets={availableWidgets}
                  activeWidgets={activeWidgets}
                  onToggleWidget={handleToggleWidget}
                />
                <MainMenubar className="ml-2" />
              </div>
            </div>
            
            <div className="relative w-full h-[calc(200vh)] p-4 overflow-y-auto">
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
                    console.log('Rendering widget:', widget);
                    console.log('Widget position:', position);
                    
                    if (!position) {
                      console.log('No position found for widget:', widget.type);
                      return null;
                    }

                    const rndProps = {
                      key: widget.id,
                      default: getWidgetStyle(widget),
                      minWidth: 200,
                      maxWidth: fullscreenWidget === widget.type ? window.innerWidth : 800,
                      minHeight: minimizedWidgets.includes(widget.type) ? 48 : 200,
                      maxHeight: fullscreenWidget === widget.type ? window.innerHeight : 800,
                      bounds: "parent",
                      dragHandleClassName: "drag-handle",
                      onDragStop: handleDragStop,
                      onResizeStop: handleResizeStop,
                      disableDragging: fullscreenWidget === widget.type,
                      "data-widget-type": widget.type,
                      className: "absolute bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300",
                      style: {
                        ...getWidgetStyle(widget),
                        transition: 'height 0.3s ease-in-out'
                      }
                    };

                    switch (widget.type) {
                      case 'patient_performance':
                        return (
                          <Rnd {...rndProps} minHeight={100} maxHeight={100}>
                            <div className="h-full flex flex-col">
                              <div className="flex-1 p-4">
                                <PatientPerformanceCard
                                  totalObjectives={10}
                                  metObjectives={7}
                                />
                              </div>
                            </div>
                          </Rnd>
                        );
                      default: {
                        const isMinimized = minimizedWidgets.includes(widget.type);
                        return (
                          <>
                            <Rnd {...rndProps} minHeight={48} maxHeight={isMinimized ? 48 : 800}>
                              <div className="h-full flex flex-col">
                                <div className="drag-handle flex items-center justify-between p-4 cursor-move bg-white">
                                  <h3 className="font-medium">{widget.title}</h3>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => toggleMinimize(widget.type)}
                                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                      {isMinimized ? (
                                        <ArrowsPointingOutIcon className="w-4 h-4 rotate-180" />
                                      ) : (
                                        <ArrowsPointingInIcon className="w-4 h-4" />
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
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          onClick={() => console.log('Delete', widget.type)}
                                          className="gap-2 text-red-600 focus:text-red-600"
                                        >
                                          <TrashIcon className="w-4 h-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                {!isMinimized && (
                                  <div className="flex-1 p-4 pb-14">
                                    {renderWidgetContent(widget.type)}
                                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
                                      <div className="relative h-full">
                                        <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
                                          {renderWidgetFooter(widget.type)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Rnd>

                            <Dialog open={fullscreenWidget === widget.type} onOpenChange={() => setFullscreenWidget(null)}>
                              <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] flex flex-col overflow-hidden">
                                <div className="shrink-0 flex items-center justify-between p-4 bg-white">
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
                                <div className="flex-1 overflow-hidden">
                                  {renderWidgetContent(widget.type)}
                                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
                                    <div className="relative h-full">
                                      <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
                                        {renderWidgetFooter(widget.type)}
                                      </div>
                                    </div>
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
            </div>
          </main>
          {navPosition === 'right' && (
            <div className="bg-white rounded-2xl shadow-sm ml-2">
              <PatientChartNav
                position="right"
                onPositionChange={setNavPosition}
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