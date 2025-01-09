import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb';
import { PatientChartNav } from '@/components/organisms/PatientChartNav';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';
import { getWidgetsByRole, hasWidgetPermission } from '@/config/widgets';
import type { UserRole } from '@/types/user';
import type { Layout } from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Mock patient data - in a real app, this would come from an API
const mockPatientInfo = {
  id: '123',
  name: 'Wade Warren',
  gender: 'Male',
  age: 76,
  bloodGroup: 'B positive',
  insuranceProvider: 'Blue Cross Blue Shield',
  admittedTo: 'CMHC Psychiatric Rehabilitation',
  language: 'English',
  mobile: '(555) 123-4567',
  programAuditor: 'Audrey Auditor',
  auditorTimestamp: '01/01/2021 4:23 PM'
};

const PatientChartSkeleton = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <div className="h-6 w-20 bg-gray-200 rounded-md skeleton-pulse" />
        </div>
        <div className="px-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md skeleton-pulse" />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <div className="h-16 bg-white border-b px-4">
          <div className="h-full flex items-center">
            <div className="h-8 w-64 bg-gray-200 rounded-md skeleton-pulse" />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden p-2">
          {/* Left Nav Skeleton */}
          <div className="w-64 bg-white rounded-2xl shadow-sm mr-2">
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-md skeleton-pulse" />
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="flex-1 bg-white rounded-sm p-4">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-gray-400">/</span>}
                  <div className="h-4 w-20 bg-gray-200 rounded skeleton-pulse" />
                </div>
              ))}
            </div>

            {/* Widget Skeleton */}
            <div className="mt-4">
              <div className="h-[400px] bg-gray-100 rounded-lg border skeleton-pulse" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const PatientChart: FC = () => {
  const { patientId } = useParams();
  const [navPosition, setNavPosition] = useState<'left' | 'right'>('left');
  const { user, loading } = useCurrentUser();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  
  const breadcrumbItems = [
    { label: 'Patient Care', href: '/patient-care' },
    { label: 'All Patients', href: '/patient-care/all-patients' },
    { label: 'Patient Chart' },
  ];

  if (loading) {
    return <PatientChartSkeleton />;
  }

  // Get available widgets for the user's role
  const availableWidgets = user?.role ? getWidgetsByRole(user.role) : [];
  const notificationWidget = availableWidgets.find(w => w.type === 'notification_center');
  const userRole = user?.role as UserRole | undefined;

  // Initialize layouts if not set and widgets are available
  if (layouts.length === 0 && notificationWidget?.defaultPosition) {
    setLayouts([
      {
        i: notificationWidget.id,
        x: notificationWidget.defaultPosition.x,
        y: notificationWidget.defaultPosition.y,
        w: notificationWidget.defaultPosition.w,
        h: notificationWidget.defaultPosition.h,
        minW: 4,
        minH: 3
      }
    ]);
  }

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayouts(newLayout);
    // Here you could save the layout to user preferences
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        logo={<span className="text-xl font-bold">LOGO</span>}
        navigation={navigation}
        userInfo={{
          name: user?.displayName || '',
          role: user?.role || ''
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          variant="patient-chart"
          notificationCount={4}
          onSearch={() => {}}
          onNotificationClick={() => console.log('Notification clicked')}
          onAddClick={() => console.log('Add clicked')}
          onResetLayout={() => console.log('Reset layout')}
          onMobileMenuClick={() => console.log('Mobile menu clicked')}
          patientInfo={mockPatientInfo}
        />
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
          <main className="flex-1 overflow-y-auto bg-white rounded-sm p-0 pt-4">
            <div className="mb-0 px-4">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            
            {/* Widgets Section */}
            {notificationWidget && userRole && hasWidgetPermission(notificationWidget, userRole) && layouts.length > 0 && (
              <GridLayout
                className="layout"
                layout={layouts}
                cols={12}
                rowHeight={100}
                width={1200}
                onLayoutChange={handleLayoutChange}
                draggableHandle=".cursor-move"
                margin={[16, 16]}
                isResizable={false}
              >
                <div key={notificationWidget.id}>
                  <NotificationCenter />
                </div>
              </GridLayout>
            )}
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