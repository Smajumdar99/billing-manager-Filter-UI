import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb';
import { PatientChartNav } from '@/components/organisms/PatientChartNav';

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
  
  const breadcrumbItems = [
    { label: 'Patient Care', href: '/patient-care' },
    { label: 'All Patients', href: '/patient-care/all-patients' },
    { label: 'Patient Chart' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        logo={<span className="text-xl font-bold">LOGO</span>}
        navigation={navigation}
        userInfo={{
          name: "Olivia Rhye",
          role: "Front Desk Officer"
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
          userInfo={{
            name: "Olivia Rhye",
            role: "Front Desk Officer",
            avatar: "https://ui-avatars.com/api/?name=Olivia+Rhye&background=random"
          }}
          patientInfo={mockPatientInfo}
        />
        <div className="flex-1 flex overflow-hidden">
          {navPosition === 'left' && (
            <PatientChartNav
              position="left"
              onPositionChange={setNavPosition}
              className="border-r"
            />
          )}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="text-2xl font-semibold text-gray-900 mt-4">Patient Chart</h1>
              <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
            </div>
            
            <div className="flex items-center justify-center h-[calc(100vh-300px)]">
              <p className="text-xl text-gray-500">Coming Soon</p>
            </div>
          </main>
          {navPosition === 'right' && (
            <PatientChartNav
              position="right"
              onPositionChange={setNavPosition}
              className="border-l"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientChart; 