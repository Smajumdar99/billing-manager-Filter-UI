import { FC, useState, useEffect } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { navigation } from '@/components/organisms/SidebarMenu';
import { PatientTable } from '@/components/organisms/PatientTable';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';

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
  },
  {
    id: '13',
    name: 'Thomas Rodriguez',
    dateOfBirth: '1983-03-14',
    gender: 'Male',
    phoneNumber: '(555) 234-5678',
    email: 'thomas.r@email.com',
    lastEncounter: '2024-01-20',
    nextAppointment: '2024-02-22',
    status: 'Active',
    adminPrograms: ['Diabetes Care'],
    insurance: 'Aetna',
  },
  {
    id: '14',
    name: 'Sandra Kim',
    dateOfBirth: '1991-07-30',
    gender: 'Female',
    phoneNumber: '(555) 345-6789',
    email: 'sandra.k@email.com',
    lastEncounter: '2024-01-18',
    nextAppointment: '2024-02-25',
    status: 'Active',
    adminPrograms: ['Wellness Program'],
    insurance: 'Blue Shield',
  },
  {
    id: '15',
    name: 'Kevin Chen',
    dateOfBirth: '1988-12-05',
    gender: 'Male',
    phoneNumber: '(555) 456-7890',
    email: 'kevin.c@email.com',
    lastEncounter: '2024-01-15',
    nextAppointment: null,
    status: 'Pending',
    adminPrograms: ['Mental Health'],
    insurance: 'Kaiser Permanente',
  },
  {
    id: '16',
    name: 'Rachel Green',
    dateOfBirth: '1994-09-18',
    gender: 'Female',
    phoneNumber: '(555) 567-8901',
    email: 'rachel.g@email.com',
    lastEncounter: '2024-01-22',
    nextAppointment: '2024-02-28',
    status: 'Active',
    adminPrograms: ['Nutrition Counseling'],
    insurance: 'Humana',
  },
  {
    id: '17',
    name: 'Daniel Park',
    dateOfBirth: '1976-11-25',
    gender: 'Male',
    phoneNumber: '(555) 678-9012',
    email: 'daniel.p@email.com',
    lastEncounter: '2024-01-19',
    nextAppointment: '2024-02-23',
    status: 'Active',
    adminPrograms: ['Cardiac Care'],
    insurance: 'Medicare',
  },
  {
    id: '18',
    name: 'Michelle Wong',
    dateOfBirth: '1989-04-12',
    gender: 'Female',
    phoneNumber: '(555) 789-0123',
    email: 'michelle.w@email.com',
    lastEncounter: '2024-01-21',
    nextAppointment: '2024-02-26',
    status: 'Active',
    adminPrograms: ['Women\'s Health'],
    insurance: 'Cigna',
  },
  {
    id: '19',
    name: 'Christopher Lee',
    dateOfBirth: '1984-08-08',
    gender: 'Male',
    phoneNumber: '(555) 890-1234',
    email: 'chris.l@email.com',
    lastEncounter: '2024-01-16',
    nextAppointment: null,
    status: 'Inactive',
    adminPrograms: [],
    insurance: 'UnitedHealthcare',
  },
  {
    id: '20',
    name: 'Amanda Martinez',
    dateOfBirth: '1992-06-20',
    gender: 'Female',
    phoneNumber: '(555) 901-2345',
    email: 'amanda.m@email.com',
    lastEncounter: '2024-01-23',
    nextAppointment: '2024-02-27',
    status: 'Active',
    adminPrograms: ['Preventive Care'],
    insurance: 'Anthem',
  }
];

const PatientTableSkeleton: FC = () => {
  return (
    <div className="space-y-4">
      {/* Table Header Skeleton */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="flex items-center p-4 border-b">
          <div className="flex-1">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[200px]" /> {/* Search bar */}
            <Skeleton className="h-9 w-9 rounded-lg" /> {/* Filter button */}
            <Skeleton className="h-9 w-[120px] rounded-lg" /> {/* Add button */}
          </div>
        </div>
        
        {/* Table Body Skeleton */}
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(20)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-2">
                <Skeleton className="h-8 w-8 rounded" /> {/* Checkbox */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <Skeleton className="h-4 w-32" /> {/* Name */}
                <Skeleton className="h-4 w-24" /> {/* DOB */}
                <Skeleton className="h-4 w-20" /> {/* Gender */}
                <Skeleton className="h-4 w-32" /> {/* Phone */}
                <Skeleton className="h-4 w-40" /> {/* Email */}
                <Skeleton className="h-4 w-24" /> {/* Last Encounter */}
                <Skeleton className="h-4 w-24" /> {/* Next Appointment */}
                <Skeleton className="h-6 w-20 rounded-full" /> {/* Status */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllPatients: FC = () => {
  const { user } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handlePatientClick = (patient: any) => {
    // Store patient data in sessionStorage for persistence
    sessionStorage.setItem('selectedPatient', JSON.stringify({
      id: patient.id,
      name: patient.name,
      gender: patient.gender || 'Not specified',
      age: calculateAge(patient.dateOfBirth),
      dob: patient.dateOfBirth,
      bloodGroup: 'O+', // This should come from your patient data
      insuranceProvider: patient.insurance,
      admittedTo: patient.admittedTo || 'General Ward',
      language: patient.language || 'English',
      mobile: patient.phoneNumber,
      programAuditor: patient.programAuditor || 'Dr. Smith',
      auditorTimestamp: new Date().toISOString(),
      status: patient.status,
      adminPrograms: patient.adminPrograms,
      email: patient.email,
      lastEncounter: patient.lastEncounter,
      nextAppointment: patient.nextAppointment
    }));
    navigate(`/patient-care/patient-chart/${patient.id}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        logo={<span className="text-xl font-bold">LOGO</span>}
        navigation={navigation}
        userInfo={{
          name: user?.displayName || 'Guest User',
          role: user?.role || 'No Role'
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
            {isLoading ? (
              <PatientTableSkeleton />
            ) : (
              <PatientTable 
                patients={mockPatients} 
                className="h-full"
                defaultPageSize={20}
                onPatientClick={handlePatientClick}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default AllPatients; 