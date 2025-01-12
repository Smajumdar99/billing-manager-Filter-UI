export interface MockPatient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  lastEncounter: string;
  nextAppointment: string | null;
  status: string;
  adminPrograms: string[];
  insurance: string;
}

export const mockPatients: MockPatient[] = [
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
  }
]; 