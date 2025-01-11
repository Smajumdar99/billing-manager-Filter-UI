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

  console.log('Current user role:', userRole);
  console.log('Available widgets:', availableWidgets);

  const [widgetPositions, setWidgetPositions] = useState<WidgetPositions>({
    patient_performance: { x: 20, y: 20, width: 400, height: 100 },
    notification_center: { x: 20, y: 140, width: 400, height: 600 },
    vital_signs: { x: 440, y: 20, width: 390, height: 400 },
    clinical_notes: { x: 850, y: 20, width: 350, height: 400 },
    medications: { x: 1220, y: 20, width: 350, height: 400 },
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
        return <PatientPerformanceCard patientId={patientId} />;
      case 'notification_center':
        return <NotificationCenter patientId={patientId} />;
      case 'vital_signs':
        return <VitalsWidget patientId={patientId} />;
      case 'clinical_notes':
        return <NotesWidget patientId={patientId} />;
      case 'medications':
        return <MedicationsWidget patientId={patientId} />;
      default:
        return null;
    }
  };

  const renderWidgetFooter = (type: Exclude<WidgetType, 'patient_performance'>) => {
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
    }
  };

  const isPatientPerformance = (type: WidgetType): type is 'patient_performance' => type === 'patient_performance';

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
              <div className="relative w-full h-[calc(100vh-200px)] p-4">
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
              <MainMenubar className="ml-4" />
            </div>
            
            <div className="relative w-full h-[calc(160vh)] p-4 overflow-hidden">
              {availableWidgets.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No widgets available for your role.</p>
                </div>
              ) : (
                availableWidgets.map(widget => {
                  console.log('Rendering widget:', widget);
                  const position = widgetPositions[widget.type];
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
                    case 'notification_center':
                    case 'vital_signs':
                    case 'clinical_notes':
                    case 'medications':
                      const isMinimized = minimizedWidgets.includes(widget.type);
                      return (
                        <>
                          <Rnd {...rndProps} minHeight={48} maxHeight={isMinimized ? 48 : 800}>
                            <div className="h-full flex flex-col">
                              <div className="drag-handle flex items-center justify-between p-4 cursor-move bg-white">
                                <h3 className="font-medium">{widget.title}</h3>
                                <div className="flex items-center gap-1">
                                  {widget.type !== 'patient_performance' && (
                                    <>
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
                                    </>
                                  )}
                                </div>
                              </div>
                              {!isMinimized && (
                                <div className="flex-1 p-4 pb-14">
                                  {renderWidgetContent(widget.type)}
                                  {!isPatientPerformance(widget.type) && (
                                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
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
                                {!isPatientPerformance(widget.type) && (
                                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
                                    <div className="relative h-full">
                                      <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
                                        {renderWidgetFooter(widget.type)}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      );
                    default:
                      return null;
                  }
                })
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