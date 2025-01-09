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

const PatientChart: FC = () => {
  const { patientId } = useParams();
  const [navPosition, setNavPosition] = useState<'left' | 'right'>('left');
  const { user, loading } = useCurrentUser();
  
  const breadcrumbItems = [
    { label: 'Patient Care', href: '/patient-care' },
    { label: 'All Patients', href: '/patient-care/all-patients' },
    { label: 'Patient Chart' },
  ];

  if (loading) {
    return <div>Loading...</div>; // You might want to use a proper loading component
  }

  // Get available widgets for the user's role
  const availableWidgets = user?.role ? getWidgetsByRole(user.role) : [];
  const notificationWidget = availableWidgets.find(w => w.type === 'notification_center');

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
          <main className="flex-1 overflow-y-auto bg-white rounded-sm p-4">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="text-2xl font-semibold text-gray-900 mt-4">Patient Chart</h1>
              <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
            </div>
            
            {/* Widgets Section */}
            <div className="grid grid-cols-12 gap-4">
              {notificationWidget && hasWidgetPermission(notificationWidget, user?.role || '') && (
                <div className="col-span-6">
                  <NotificationCenter />
                </div>
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