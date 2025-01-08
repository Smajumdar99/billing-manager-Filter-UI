import { FC, useState } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { PatientTable } from '@/components/organisms/PatientTable';

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    phoneNumber: '(555) 123-4567',
    email: 'john.smith@email.com',
    lastEncounter: '2024-01-15',
    nextAppointment: '2024-02-01',
    status: 'Active',
    adminPrograms: ['Diabetes Care', 'Wellness Program'],
    insurance: 'Blue Cross Blue Shield',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    dateOfBirth: '1985-08-22',
    gender: 'Female',
    phoneNumber: '(555) 987-6543',
    email: 'sarah.j@email.com',
    lastEncounter: '2024-01-10',
    nextAppointment: null,
    status: 'Inactive',
    adminPrograms: ['Mental Health'],
    insurance: 'Aetna',
  },
  {
    id: '3',
    name: 'Michael Brown',
    dateOfBirth: '1978-03-30',
    gender: 'Male',
    phoneNumber: '(555) 234-5678',
    email: 'michael.b@email.com',
    lastEncounter: '2024-01-18',
    nextAppointment: '2024-02-15',
    status: 'Active',
    adminPrograms: ['Cardiac Care', 'Senior Wellness'],
    insurance: 'Medicare',
  },
  {
    id: '4',
    name: 'Emily Davis',
    dateOfBirth: '1995-11-12',
    gender: 'Female',
    phoneNumber: '(555) 345-6789',
    email: 'emily.d@email.com',
    lastEncounter: '2024-01-05',
    nextAppointment: '2024-02-10',
    status: 'Active',
    adminPrograms: ['Maternity Care'],
    insurance: 'UnitedHealthcare',
  },
  {
    id: '5',
    name: 'David Wilson',
    dateOfBirth: '1982-07-08',
    gender: 'Male',
    phoneNumber: '(555) 456-7890',
    email: 'david.w@email.com',
    lastEncounter: '2023-12-20',
    nextAppointment: null,
    status: 'Inactive',
    adminPrograms: [],
    insurance: 'Cigna',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    dateOfBirth: '1988-09-25',
    gender: 'Female',
    phoneNumber: '(555) 567-8901',
    email: 'lisa.a@email.com',
    lastEncounter: '2024-01-12',
    nextAppointment: '2024-02-05',
    status: 'Active',
    adminPrograms: ['Weight Management', 'Nutrition Counseling'],
    insurance: 'Humana',
  },
  {
    id: '7',
    name: 'Robert Taylor',
    dateOfBirth: '1970-12-03',
    gender: 'Male',
    phoneNumber: '(555) 678-9012',
    email: 'robert.t@email.com',
    lastEncounter: '2024-01-08',
    nextAppointment: '2024-02-20',
    status: 'Active',
    adminPrograms: ['Arthritis Care'],
    insurance: 'Medicare Advantage',
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    dateOfBirth: '1992-04-18',
    gender: 'Female',
    phoneNumber: '(555) 789-0123',
    email: 'jennifer.m@email.com',
    lastEncounter: '2024-01-16',
    nextAppointment: null,
    status: 'Pending',
    adminPrograms: ['Preventive Care'],
    insurance: 'Kaiser Permanente',
  },
  {
    id: '9',
    name: 'William Thompson',
    dateOfBirth: '1975-06-29',
    gender: 'Male',
    phoneNumber: '(555) 890-1234',
    email: 'william.t@email.com',
    lastEncounter: '2024-01-19',
    nextAppointment: '2024-02-08',
    status: 'Active',
    adminPrograms: ['Hypertension Management', 'Diabetes Care'],
    insurance: 'Blue Cross Blue Shield',
  },
  {
    id: '10',
    name: 'Maria Garcia',
    dateOfBirth: '1987-02-14',
    gender: 'Female',
    phoneNumber: '(555) 901-2345',
    email: 'maria.g@email.com',
    lastEncounter: '2024-01-11',
    nextAppointment: '2024-02-12',
    status: 'Active',
    adminPrograms: ['Mental Health', 'Wellness Program'],
    insurance: 'Anthem',
  },
  {
    id: '11',
    name: 'James Lee',
    dateOfBirth: '1980-10-07',
    gender: 'Male',
    phoneNumber: '(555) 012-3456',
    email: 'james.l@email.com',
    lastEncounter: '2024-01-17',
    nextAppointment: null,
    status: 'Inactive',
    adminPrograms: [],
    insurance: 'No Insurance',
  },
  {
    id: '12',
    name: 'Patricia White',
    dateOfBirth: '1993-01-23',
    gender: 'Female',
    phoneNumber: '(555) 123-4567',
    email: 'patricia.w@email.com',
    lastEncounter: '2024-01-09',
    nextAppointment: '2024-02-18',
    status: 'Active',
    adminPrograms: ['Preventive Care', 'Women\'s Health'],
    insurance: 'UnitedHealthcare',
  }
];

const AllPatients: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

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
          notificationCount={4}
          onSearch={handleSearch}
          onNotificationClick={() => console.log('Notification clicked')}
          onAddClick={() => console.log('Add clicked')}
          onResetLayout={() => console.log('Reset layout')}
          onMobileMenuClick={() => console.log('Mobile menu clicked')}
        />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">All Patients</h1>
            <p className="text-sm text-gray-500">Manage and view all patient records</p>
          </div>
          
          <div style={{ height: 'calc(100vh - 240px)' }}>
            <PatientTable 
              patients={mockPatients} 
              className="h-full"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllPatients; 