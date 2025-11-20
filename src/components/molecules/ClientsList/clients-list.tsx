import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import PrescriptionModal from '@/components/molecules/PrescriptionModal/prescription-modal';
import { Input } from '@/components/atoms/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { DataTable } from '@/components/organisms/DataTable';
import { cn } from '@/lib/utils';
import {
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,

  PlusIcon,
  Squares2X2Icon,
  TableCellsIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  BeakerIcon,
  CubeIcon,
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { ColDef } from 'ag-grid-community';

// Search scope options
const searchScopes = [
  { value: 'all', label: 'All Fields' },
  { value: 'name', label: 'Previous Name' },
  { value: 'alias', label: 'Alias Name' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'discharged', label: 'Discharged' },
  { value: 'admitted', label: 'Admitted' },
  { value: 'nonAdmitted', label: 'Non-Admitted' },
  { value: 'futureAdmit', label: 'Future-Admit' },
  { value: 'inactive', label: 'Inactive-Patients' },
  { value: 'clientType', label: 'ClientType' },
  { value: 'cpms', label: 'CPMS' },
  { value: 'facility', label: 'Facility' },
  { value: 'encounterNumber', label: 'Encounter Number' },
  { value: 'payerCode', label: 'PayerCode' },
  { value: 'booking', label: 'Booking#' },
  { value: 'cases', label: 'Cases' },
  { value: 'dob', label: 'DOB' },
  { value: 'pid', label: 'PID' },
  { value: 'externalId', label: 'External ID' }
];

// Advanced search fields matching the original design
const advancedSearchFields = [
  // Column 1
  { id: 'name', label: 'Name' },
  { id: 'middle', label: 'Middle' },
  { id: 'suffix', label: 'Suffix' },
  { id: 'dob', label: 'DOB' },
  { id: 'genderIdentity', label: 'Gender Identity' },
  { id: 'sexualOrientation', label: 'Sexual Orientation' },
  { id: 'mrn', label: 'MRN #' },
  { id: 'pronounName', label: 'Pronoun Name' },
  { id: 'demographicAlert', label: 'Demographic Alert' },
  { id: 'myTest', label: 'my test' },
  { id: 'school', label: 'School' },
  { id: 'email', label: 'Email' },
  { id: 'chosenName', label: 'Chosen Name' },

  // Column 2
  { id: 'first', label: 'First' },
  { id: 'language', label: 'Language' },
  { id: 'previousName', label: 'Previous Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'maritalStatus', label: 'Marital Status' },
  { id: 'medicaidIdNumber', label: 'Medicaid ID Number' },
  { id: 'clientClosedDate', label: 'Client Closed Date' },
  { id: 'courtOrderedFirearm', label: 'Court ordered firearm or weapon restriction' },
  { id: 'personType', label: 'Person Type' },
  { id: 'radioo', label: 'radioo' },
  { id: 'preferredName', label: 'Preferred Name' },
  { id: 'testingPurpose', label: 'testing purpose' },
  { id: 'testingPurpose2', label: 'testing purpose' },

  // Column 3
  { id: 'last', label: 'Last' },
  { id: 'aliasName', label: 'Alias Name' },
  { id: 'externalId', label: 'External ID' },
  { id: 'ss', label: 'S.S.' },
  { id: 'rin', label: 'RIN #' },
  { id: 'va', label: 'VA' },
  { id: 'livedName', label: 'Lived Name' },
  { id: 'restrictionDate', label: 'If yes, enter restriction date' },
  { id: 'test', label: 'test' },
  { id: 'marriageStatus3', label: 'Marriage Status3' },
  { id: 'preferredName2', label: 'Preferred Name' },
  { id: 'ifOther', label: 'If Other, please indicate' },
  { id: 'punty', label: 'punty' }
];

// Mock patient data - expanded to match the screenshot columns
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    homePhone: '(555) 123-4567',
    mobilePhone: '(555) 123-4568',
    workPhone: '(555) 123-4569',
    socialSecurity: 'XXX-XX-1234',
    externalId: '1003594',
    pid: '1003594',
    payerCode: 'Waverock Hospitals - Ensoftek, A-AADO',
    adminPrograms: ['Diabetes Care', 'Wellness Program'],
    insurance: 'Blue Cross Blue Shield',
    encounterCount: 5,
    diagnosis: 'Type 2 Diabetes',
    lastEncounter: '2024-01-15',
    lastEncounterDays: 15,
    levelOfCare: 'Outpatient',
    email: 'john.smith@email.com',
    nextAppointment: '2024-02-01',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    dateOfBirth: '1985-08-22',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    homePhone: '(555) 987-6543',
    mobilePhone: '(555) 987-6544',
    workPhone: '(555) 987-6545',
    socialSecurity: 'XXX-XX-5678',
    externalId: '1004873',
    pid: '1004873',
    payerCode: 'A-METH',
    adminPrograms: ['Mental Health'],
    insurance: 'Aetna',
    encounterCount: 2,
    diagnosis: 'Anxiety Disorder',
    lastEncounter: '2024-01-10',
    lastEncounterDays: 20,
    levelOfCare: 'Therapy',
    email: 'sarah.j@email.com',
    nextAppointment: null,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Michael Brown',
    dateOfBirth: '1978-03-30',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    homePhone: '(555) 234-5678',
    mobilePhone: '(555) 234-5679',
    workPhone: '(555) 234-5680',
    socialSecurity: 'XXX-XX-9012',
    externalId: '1002734',
    pid: '1002734',
    payerCode: 'A-AADO',
    adminPrograms: ['Cardiac Care', 'Senior Wellness'],
    insurance: 'Medicare',
    encounterCount: 19,
    diagnosis: 'Hypertension',
    lastEncounter: '2024-01-18',
    lastEncounterDays: 12,
    levelOfCare: 'Chronic Care',
    email: 'michael.b@email.com',
    nextAppointment: '2024-02-15',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Emily Davis',
    dateOfBirth: '1995-11-12',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    homePhone: '(555) 345-6789',
    mobilePhone: '(555) 345-6790',
    workPhone: '(555) 345-6791',
    socialSecurity: 'XXX-XX-3456',
    externalId: '1004132',
    pid: '1004132',
    payerCode: 'MAT-CARE',
    adminPrograms: ['Maternity Care'],
    insurance: 'UnitedHealthcare',
    encounterCount: 2,
    diagnosis: 'Pregnancy Care',
    lastEncounter: '2024-01-05',
    lastEncounterDays: 25,
    levelOfCare: 'Prenatal',
    email: 'emily.d@email.com',
    nextAppointment: '2024-02-10',
    status: 'Active',
  },
  {
    id: '5',
    name: 'David Wilson',
    dateOfBirth: '1982-07-08',
    gender: 'Male',
    profilePicture: null,
    homePhone: '(555) 456-7890',
    mobilePhone: '(555) 456-7891',
    workPhone: '(555) 456-7892',
    socialSecurity: 'XXX-XX-7890',
    externalId: '1003080',
    pid: '1003080',
    payerCode: '(Medicaid) AETNA(P)',
    adminPrograms: [],
    insurance: 'Cigna',
    encounterCount: 42,
    diagnosis: 'General Checkup',
    lastEncounter: '2023-12-20',
    lastEncounterDays: 41,
    levelOfCare: 'Primary Care',
    email: 'david.w@email.com',
    nextAppointment: null,
    status: 'Inactive',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    dateOfBirth: '1988-09-25',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
    homePhone: '(555) 567-8901',
    mobilePhone: '(555) 567-8902',
    workPhone: '(555) 567-8903',
    socialSecurity: 'XXX-XX-2345',
    externalId: '1004979',
    pid: '1004979',
    payerCode: 'NUTRITION',
    adminPrograms: ['Weight Management', 'Nutrition Counseling'],
    insurance: 'Humana',
    encounterCount: 0,
    diagnosis: 'Obesity',
    lastEncounter: '2024-01-12',
    lastEncounterDays: 18,
    levelOfCare: 'Nutrition',
    email: 'lisa.a@email.com',
    nextAppointment: '2024-02-05',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Robert Taylor',
    dateOfBirth: '1970-12-03',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    homePhone: '(555) 678-9012',
    mobilePhone: '(555) 678-9013',
    workPhone: '(555) 678-9014',
    socialSecurity: 'XXX-XX-6789',
    externalId: '1003975',
    pid: '1003975',
    payerCode: 'ARTHRITIS-CARE',
    adminPrograms: ['Arthritis Care'],
    insurance: 'Medicare Advantage',
    encounterCount: 1,
    diagnosis: 'Arthritis',
    lastEncounter: '2024-01-08',
    lastEncounterDays: 22,
    levelOfCare: 'Specialty',
    email: 'robert.t@email.com',
    nextAppointment: '2024-02-20',
    status: 'Active',
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    dateOfBirth: '1992-04-18',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    homePhone: '(555) 789-0123',
    mobilePhone: '(555) 789-0124',
    workPhone: '(555) 789-0125',
    socialSecurity: 'XXX-XX-4567',
    externalId: '1003234',
    pid: '1003234',
    payerCode: 'PREV-CARE',
    adminPrograms: ['Preventive Care'],
    insurance: 'Kaiser Permanente',
    encounterCount: 13,
    diagnosis: 'Preventive Screening',
    lastEncounter: '2024-01-16',
    lastEncounterDays: 14,
    levelOfCare: 'Preventive',
    email: 'jennifer.m@email.com',
    nextAppointment: null,
    status: 'Pending',
  },
  {
    id: '9',
    name: 'Carlos Rodriguez',
    dateOfBirth: '1965-12-10',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    homePhone: '(555) 890-1234',
    mobilePhone: '(555) 890-1235',
    workPhone: '(555) 890-1236',
    socialSecurity: 'XXX-XX-8901',
    externalId: '1005467',
    pid: '1005467',
    payerCode: 'CARDIO-SPEC',
    adminPrograms: ['Cardiac Rehabilitation', 'Senior Care'],
    insurance: 'Medicare',
    encounterCount: 28,
    diagnosis: 'Coronary Artery Disease',
    lastEncounter: '2024-01-20',
    lastEncounterDays: 10,
    levelOfCare: 'Specialty',
    email: 'carlos.r@email.com',
    nextAppointment: '2024-02-12',
    status: 'Active',
  },
  {
    id: '10',
    name: 'Amanda Thompson',
    dateOfBirth: '1998-06-25',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg',
    homePhone: '(555) 901-2345',
    mobilePhone: '(555) 901-2346',
    workPhone: '',
    socialSecurity: 'XXX-XX-0123',
    externalId: '1004521',
    pid: '1004521',
    payerCode: 'YOUNG-ADULT',
    adminPrograms: ['Mental Health', 'Substance Abuse'],
    insurance: 'Medicaid',
    encounterCount: 7,
    diagnosis: 'Depression',
    lastEncounter: '2024-01-14',
    lastEncounterDays: 16,
    levelOfCare: 'Outpatient',
    email: 'amanda.t@email.com',
    nextAppointment: '2024-02-14',
    status: 'Active',
  },
  {
    id: '11',
    name: 'Dr. William Chen',
    dateOfBirth: '1975-03-08',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    homePhone: '(555) 012-3456',
    mobilePhone: '(555) 012-3457',
    workPhone: '(555) 012-3458',
    socialSecurity: 'XXX-XX-1234',
    externalId: '1002998',
    pid: '1002998',
    payerCode: 'PROF-CARE',
    adminPrograms: ['Executive Health'],
    insurance: 'Blue Cross Blue Shield',
    encounterCount: 3,
    diagnosis: 'Annual Physical',
    lastEncounter: '2024-01-22',
    lastEncounterDays: 8,
    levelOfCare: 'Executive',
    email: 'william.chen@email.com',
    nextAppointment: '2024-03-22',
    status: 'Active',
  },
  {
    id: '12',
    name: 'Maria Santos',
    dateOfBirth: '1987-09-14',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg',
    homePhone: '(555) 123-4567',
    mobilePhone: '(555) 123-4568',
    workPhone: '(555) 123-4569',
    socialSecurity: 'XXX-XX-2345',
    externalId: '1004892',
    pid: '1004892',
    payerCode: 'DIABETES-MGMT',
    adminPrograms: ['Diabetes Management', 'Nutrition'],
    insurance: 'UnitedHealthcare',
    encounterCount: 15,
    diagnosis: 'Type 1 Diabetes',
    lastEncounter: '2024-01-19',
    lastEncounterDays: 11,
    levelOfCare: 'Chronic Care',
    email: 'maria.santos@email.com',
    nextAppointment: '2024-02-08',
    status: 'Active',
  },
  {
    id: '13',
    name: 'James Patterson',
    dateOfBirth: '1955-11-30',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
    homePhone: '(555) 234-5678',
    mobilePhone: '',
    workPhone: '',
    socialSecurity: 'XXX-XX-3456',
    externalId: '1001743',
    pid: '1001743',
    payerCode: 'HOSPICE-CARE',
    adminPrograms: ['Palliative Care', 'Social Services'],
    insurance: 'Medicare Advantage',
    encounterCount: 67,
    diagnosis: 'Terminal Cancer',
    lastEncounter: '2024-01-25',
    lastEncounterDays: 5,
    levelOfCare: 'Hospice',
    email: 'james.p@email.com',
    nextAppointment: '2024-02-02',
    status: 'Active',
  },
  {
    id: '14',
    name: 'Rachel Green',
    dateOfBirth: '1993-02-28',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
    homePhone: '(555) 345-6789',
    mobilePhone: '(555) 345-6790',
    workPhone: '(555) 345-6791',
    socialSecurity: 'XXX-XX-4567',
    externalId: '1005123',
    pid: '1005123',
    payerCode: 'PREGNANCY-CARE',
    adminPrograms: ['Obstetrics', 'High Risk Pregnancy'],
    insurance: 'Aetna',
    encounterCount: 8,
    diagnosis: 'High Risk Pregnancy',
    lastEncounter: '2024-01-17',
    lastEncounterDays: 13,
    levelOfCare: 'Maternal Care',
    email: 'rachel.green@email.com',
    nextAppointment: '2024-02-07',
    status: 'Active',
  },
  {
    id: '15',
    name: 'Thomas Anderson',
    dateOfBirth: '1980-01-15',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    homePhone: '(555) 456-7890',
    mobilePhone: '(555) 456-7891',
    workPhone: '(555) 456-7892',
    socialSecurity: 'XXX-XX-5678',
    externalId: '1003876',
    pid: '1003876',
    payerCode: 'ORTHO-SPORT',
    adminPrograms: ['Sports Medicine', 'Physical Therapy'],
    insurance: 'Cigna',
    encounterCount: 11,
    diagnosis: 'ACL Tear',
    lastEncounter: '2024-01-11',
    lastEncounterDays: 19,
    levelOfCare: 'Rehabilitation',
    email: 'thomas.anderson@email.com',
    nextAppointment: '2024-02-11',
    status: 'Active',
  },
  {
    id: '16',
    name: 'Susan Miller',
    dateOfBirth: '1962-07-22',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/8.jpg',
    homePhone: '(555) 567-8901',
    mobilePhone: '(555) 567-8902',
    workPhone: '',
    socialSecurity: 'XXX-XX-6789',
    externalId: '1002654',
    pid: '1002654',
    payerCode: 'MENTAL-HEALTH',
    adminPrograms: ['Psychiatry', 'Counseling'],
    insurance: 'Humana',
    encounterCount: 23,
    diagnosis: 'Bipolar Disorder',
    lastEncounter: '2024-01-13',
    lastEncounterDays: 17,
    levelOfCare: 'Mental Health',
    email: 'susan.miller@email.com',
    nextAppointment: '2024-02-13',
    status: 'Active',
  },
  {
    id: '17',
    name: 'Kevin Wong',
    dateOfBirth: '1989-10-05',
    gender: 'Male',
    profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg',
    homePhone: '(555) 678-9012',
    mobilePhone: '(555) 678-9013',
    workPhone: '(555) 678-9014',
    socialSecurity: 'XXX-XX-7890',
    externalId: '1004332',
    pid: '1004332',
    payerCode: 'EMERGENCY',
    adminPrograms: ['Emergency Care'],
    insurance: 'Kaiser Permanente',
    encounterCount: 1,
    diagnosis: 'Motor Vehicle Accident',
    lastEncounter: '2024-01-28',
    lastEncounterDays: 2,
    levelOfCare: 'Emergency',
    email: 'kevin.wong@email.com',
    nextAppointment: '2024-02-05',
    status: 'Active',
  },
  {
    id: '18',
    name: 'Helen Foster',
    dateOfBirth: '1943-05-17',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg',
    homePhone: '(555) 789-0123',
    mobilePhone: '',
    workPhone: '',
    socialSecurity: 'XXX-XX-8901',
    externalId: '1001234',
    pid: '1001234',
    payerCode: 'GERIATRIC',
    adminPrograms: ['Geriatric Medicine', 'Memory Care'],
    insurance: 'Medicare',
    encounterCount: 89,
    diagnosis: 'Alzheimer\'s Disease',
    lastEncounter: '2024-01-24',
    lastEncounterDays: 6,
    levelOfCare: 'Long-term Care',
    email: 'helen.foster@email.com',
    nextAppointment: '2024-02-03',
    status: 'Active',
  },
  {
    id: '19',
    name: 'Marcus Johnson',
    dateOfBirth: '1991-08-12',
    gender: 'Male',
    profilePicture: null,
    homePhone: '(555) 890-1234',
    mobilePhone: '(555) 890-1235',
    workPhone: '',
    socialSecurity: 'XXX-XX-9012',
    externalId: '1005001',
    pid: '1005001',
    payerCode: 'ADDICTION',
    adminPrograms: ['Substance Abuse Treatment'],
    insurance: 'Medicaid',
    encounterCount: 34,
    diagnosis: 'Opioid Addiction',
    lastEncounter: '2023-12-15',
    lastEncounterDays: 46,
    levelOfCare: 'Rehabilitation',
    email: 'marcus.j@email.com',
    nextAppointment: null,
    status: 'Inactive',
  },
  {
    id: '20',
    name: 'Dr. Sarah Kim',
    dateOfBirth: '1977-12-03',
    gender: 'Female',
    profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
    homePhone: '(555) 901-2345',
    mobilePhone: '(555) 901-2346',
    workPhone: '(555) 901-2347',
    socialSecurity: 'XXX-XX-0123',
    externalId: '1003567',
    pid: '1003567',
    payerCode: 'STAFF-HEALTH',
    adminPrograms: ['Employee Health'],
    insurance: 'Blue Cross Blue Shield',
    encounterCount: 2,
    diagnosis: 'Work Physical',
    lastEncounter: '2024-01-09',
    lastEncounterDays: 21,
    levelOfCare: 'Occupational',
    email: 'sarah.kim@email.com',
    nextAppointment: '2024-07-09',
    status: 'Active',
  },
];

// Helper function to calculate age
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

// Helper to get status badge styles
const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return "bg-green-50 text-green-700 border-green-200";
    case 'inactive':
      return "bg-gray-50 text-gray-700 border-gray-200";
    case 'pending':
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};



// Modern Grid Card Component
const ClientGridCard: React.FC<{
  patient: any;
  onSelect: (patient: any) => void;
  onPrescribeClick: () => void;
}> = ({ patient, onSelect, onPrescribeClick }) => {
  const navigate = useNavigate();
  const age = calculateAge(patient.dateOfBirth);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Generate initials as fallback
  const initials = patient.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Action handlers
  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation(); // Prevent card click

    if (action === 'Add Encounter') {
      navigate('/add-encounter');
      return;
    }

    if (action === 'Prescribe') {
      onPrescribeClick();
      return;
    }

    console.log(`${action} action for patient:`, patient.name);
    // Add your action logic here
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-200 relative overflow-hidden"
      onClick={() => onSelect(patient)}
    >
      {/* Header with Avatar, Status, and Actions Menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center flex-1">
          {patient.profilePicture && !imageError ? (
            <img
              src={patient.profilePicture}
              alt={`${patient.name} profile`}
              className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-50"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4 text-white text-sm font-semibold">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-500">
              {patient.gender}, {age} years old
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1 text-xs font-medium rounded-full border', getStatusBadgeStyles(patient.status))}>
            {patient.status}
          </span>

          {/* Desktop: Three-dot menu in header */}
          <div className="hidden sm:block relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Patient actions"
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </button>

            {/* Desktop Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Documents');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                  Documents
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Chart');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <ChartBarIcon className="h-4 w-4 text-gray-500" />
                  Chart
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Add Encounter');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <PlusIcon className="h-4 w-4 text-gray-500" />
                  Add Encounter
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Prescribe');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <BeakerIcon className="h-4 w-4 text-gray-500" />
                  Prescribe
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Diagnosis');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  Diagnosis
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'ABA Tool');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  ABA Tool
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Edit');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <PencilIcon className="h-4 w-4 text-gray-500" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Delete');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Bottom Action Bar on Hover */}
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {/* Main Actions */}
          <button
            onClick={(e) => handleAction(e, 'Documents')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm min-w-0 flex-shrink-0"
          >
            <DocumentTextIcon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Docs</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Chart')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm min-w-0 flex-shrink-0"
          >
            <ChartBarIcon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Chart</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Add Encounter')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm min-w-0 flex-shrink-0"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Add</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Prescribe')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm min-w-0 flex-shrink-0"
          >
            <BeakerIcon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Rx</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Edit')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm min-w-0 flex-shrink-0"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Edit</span>
          </button>

          {/* Overflow Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm min-w-0 flex-shrink-0"
              aria-label="More actions"
            >
              <EllipsisVerticalIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">More</span>
            </button>

            {/* Overflow Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(e) => {
                    handleAction(e, 'Diagnosis');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  Diagnosis
                </button>
                <button
                  onClick={(e) => {
                    handleAction(e, 'ABA Tool');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  ABA Tool
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={(e) => {
                    handleAction(e, 'Delete');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Patient ID</p>
          <p className="text-sm font-medium text-gray-900">{patient.pid}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Insurance</p>
          <p className="text-sm text-gray-600 truncate">{patient.insurance}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Encounters</p>
          <p className="text-sm font-medium text-gray-900">{patient.encounterCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Level of Care</p>
          <p className="text-sm text-gray-600 truncate">{patient.levelOfCare}</p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Primary Diagnosis</p>
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{patient.diagnosis}</p>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
          {patient.mobilePhone || patient.homePhone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
          {patient.email}
        </div>
      </div>

      {/* Footer with Last Encounter */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            Last encounter: {new Date(patient.lastEncounter).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-400">
            {patient.lastEncounterDays} days ago
          </div>
        </div>
        {patient.nextAppointment && (
          <div className="flex items-center text-xs text-blue-600 mt-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Mobile: Scrollable Bottom Action Bar - Always Visible */}
      <div className="sm:hidden mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* Primary Actions - Always Visible */}
          <button
            onClick={(e) => handleAction(e, 'Documents')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation flex-shrink-0 min-w-[60px]"
          >
            <DocumentTextIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Docs</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Chart')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation flex-shrink-0 min-w-[60px]"
          >
            <ChartBarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Chart</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Add Encounter')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation flex-shrink-0 min-w-[60px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Add</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Prescribe')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation flex-shrink-0 min-w-[60px]"
          >
            <BeakerIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Rx</span>
          </button>
          <button
            onClick={(e) => handleAction(e, 'Edit')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation flex-shrink-0 min-w-[60px]"
          >
            <PencilIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Edit</span>
          </button>

          {/* More Menu for Additional Actions */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-w-[60px]"
            >
              <EllipsisHorizontalIcon className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 font-medium">More</span>
            </button>

            {/* More Actions Dropdown */}
            {isMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Diagnosis');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  Diagnosis
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'ABA Tool');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  <CubeIcon className="h-4 w-4 text-gray-500" />
                  ABA Tool
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction(e, 'Delete');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// Table Actions Dropdown Component
const TableActionsDropdown: React.FC<{
  patient: any;
  onPrescribeClick: () => void;
}> = ({ patient, onPrescribeClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleAction = (action: string, event?: React.MouseEvent) => {
    console.log(`🔥 TableActionsDropdown: ${action} action clicked for patient:`, patient.name);
    console.log('🔥 Event details:', event?.type, event?.target);

    // Prevent event bubbling to AG Grid
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (action === 'Add Encounter') {
      navigate('/add-encounter');
      setIsOpen(false);
      return;
    }

    if (action === 'Prescribe') {
      console.log('🔥 TableActionsDropdown: About to call onPrescribeClick for patient:', patient.name);
      console.log('🔥 onPrescribeClick function:', typeof onPrescribeClick, onPrescribeClick);

      try {
        onPrescribeClick();
        console.log('🔥 TableActionsDropdown: onPrescribeClick called successfully');
      } catch (error) {
        console.error('🔥 Error calling onPrescribeClick:', error);
      }

      setIsOpen(false);
      return;
    }

    console.log(`${action} action for patient:`, patient.name);
    setIsOpen(false);
    // Add your action logic here
  };

  const toggleDropdown = (event?: React.MouseEvent) => {
    console.log('🔥 TableActionsDropdown: Toggle dropdown clicked, current isOpen:', isOpen);

    // Prevent AG Grid from interfering
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Calculate position when opening
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.right - 192 + window.scrollX // 192px = dropdown width
      });
      console.log('🔥 Dropdown position calculated:', { top: rect.bottom + window.scrollY + 4, left: rect.right - 192 + window.scrollX });
    }

    setIsOpen(!isOpen);
    console.log('🔥 Dropdown isOpen set to:', !isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Check if click is inside dropdown
        const dropdownElement = document.getElementById(`dropdown-${patient.id}`);
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          console.log('🔥 Clicking outside dropdown, closing');
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      console.log('🔥 Added click outside listener');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, patient.id]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          console.log('🔥 Three-dot button clicked');
          toggleDropdown(e);
        }}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        title="Actions"
      >
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && createPortal(
        <div
          id={`dropdown-${patient.id}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: '192px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            zIndex: 999999, // Very high z-index
            padding: '4px 0',
            display: 'block',
            visibility: 'visible'
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('Documents clicked');
                handleAction('Documents', e);
              }}
            >
              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
              Documents
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('Chart clicked');
                handleAction('Chart', e);
              }}
            >
              <ChartBarIcon className="h-4 w-4 text-gray-500" />
              Chart
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('Add Encounter clicked');
                handleAction('Add Encounter', e);
              }}
            >
              <PlusIcon className="h-4 w-4 text-gray-500" />
              Add Encounter
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 active:bg-blue-100 transition-colors font-medium"
              onClick={(e) => {
                console.log('Prescribe clicked');
                handleAction('Prescribe', e);
              }}
            >
              <BeakerIcon className="h-4 w-4 text-blue-600" />
              Prescribe
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('Diagnosis clicked');
                handleAction('Diagnosis', e);
              }}
            >
              <CubeIcon className="h-4 w-4 text-gray-500" />
              Diagnosis
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('ABA Tool clicked');
                handleAction('ABA Tool', e);
              }}
            >
              <CubeIcon className="h-4 w-4 text-gray-500" />
              ABA Tool
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={(e) => {
                console.log('Edit clicked');
                handleAction('Edit', e);
              }}
            >
              <PencilIcon className="h-4 w-4 text-gray-500" />
              Edit
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
              onClick={(e) => {
                console.log('Delete clicked');
                handleAction('Delete', e);
              }}
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
              Delete
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Advanced Search Modal Component - Matching Original Design
const AdvancedSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
}> = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchMode, setSearchMode] = useState<'wildcards' | 'whole' | 'prefix'>('wildcards');
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const handleCheckAll = () => {
    const allSelected = advancedSearchFields.reduce((acc, field) => {
      acc[field.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedFields(allSelected);
  };

  const handleUncheckAll = () => {
    setSelectedFields({});
  };

  const handleSearch = () => {
    const selectedFieldIds = Object.keys(selectedFields).filter(key => selectedFields[key]);
    onSearch({
      query: searchQuery,
      fields: selectedFieldIds,
      searchMode
    });
    onClose();
  };

  const getSelectedCount = () => {
    return Object.values(selectedFields).filter(Boolean).length;
  };

  // Split fields into 3 columns
  const fieldsPerColumn = Math.ceil(advancedSearchFields.length / 3);
  const column1 = advancedSearchFields.slice(0, fieldsPerColumn);
  const column2 = advancedSearchFields.slice(fieldsPerColumn, fieldsPerColumn * 2);
  const column3 = advancedSearchFields.slice(fieldsPerColumn * 2);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header with Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Search:</label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search terms..."
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                Cancel
              </Button>
            </div>

            {/* Search Mode Options */}
            <div className="flex items-center gap-6">
              {[
                { value: 'wildcards', label: 'Use Wildcards' },
                { value: 'whole', label: 'Find whole words only' },
                { value: 'prefix', label: 'Match prefix' }
              ].map((mode) => (
                <label key={mode.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchMode"
                    value={mode.value}
                    checked={searchMode === mode.value}
                    onChange={(e) => setSearchMode(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Select Fields Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">
                Select Fields: {getSelectedCount() > 0 && (
                  <span className="text-primary font-medium">({getSelectedCount()} of {advancedSearchFields.length} selected)</span>
                )}
              </h3>
              <div className="flex gap-2">
                {getSelectedCount() === 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCheckAll}
                    className="text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <CheckIcon className="h-3 w-3 mr-1" />
                    Select All Fields
                  </Button>
                ) : getSelectedCount() === advancedSearchFields.length ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUncheckAll}
                    className="text-xs bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                  >
                    <XMarkIcon className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCheckAll}
                      className="text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUncheckAll}
                      className="text-xs bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                    >
                      <XMarkIcon className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Fields Grid - 3 Columns */}
            <div className="grid grid-cols-3 gap-6 max-h-[50vh] overflow-y-auto">
              {/* Column 1 */}
              <div className="space-y-2">
                {column1.map((field) => (
                  <label key={field.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFields[field.id] || false}
                      onChange={() => handleFieldToggle(field.id)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                {column2.map((field) => (
                  <label key={field.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFields[field.id] || false}
                      onChange={() => handleFieldToggle(field.id)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>

              {/* Column 3 */}
              <div className="space-y-2">
                {column3.map((field) => (
                  <label key={field.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFields[field.id] || false}
                      onChange={() => handleFieldToggle(field.id)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};



// Skeleton Loading Components
const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
    </td>
  </tr>
);

const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 230px)' }}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const GridCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-pulse">
    {/* Header with Avatar and Status */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
        <div className="flex-1">
          <div className="w-32 h-5 bg-gray-200 rounded mb-2" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded-full" />
    </div>

    {/* Patient Info Grid */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-1">
        <div className="w-16 h-3 bg-gray-200 rounded" />
        <div className="w-12 h-4 bg-gray-200 rounded" />
      </div>
      <div className="space-y-1">
        <div className="w-20 h-3 bg-gray-200 rounded" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="space-y-1">
        <div className="w-18 h-3 bg-gray-200 rounded" />
        <div className="w-8 h-4 bg-gray-200 rounded" />
      </div>
      <div className="space-y-1">
        <div className="w-22 h-3 bg-gray-200 rounded" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    </div>

    {/* Diagnosis */}
    <div className="mb-4">
      <div className="w-28 h-3 bg-gray-200 rounded mb-1" />
      <div className="w-full h-8 bg-gray-100 rounded-lg" />
    </div>

    {/* Contact Info */}
    <div className="space-y-2 mb-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
        <div className="w-28 h-4 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
        <div className="w-36 h-4 bg-gray-200 rounded" />
      </div>
    </div>

    {/* Footer with Last Encounter */}
    <div className="pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-1" />
          <div className="w-32 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center mt-2">
        <div className="w-4 h-4 bg-gray-200 rounded mr-1" />
        <div className="w-24 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const GridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto">
    {Array.from({ length: 8 }).map((_, index) => (
      <GridCardSkeleton key={index} />
    ))}
  </div>
);

const MobileCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="w-32 h-5 bg-gray-200 rounded mb-1" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded-full" />
    </div>

    <div className="space-y-2 mb-3">
      <div className="flex justify-between">
        <div className="w-16 h-4 bg-gray-200 rounded" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="w-12 h-4 bg-gray-200 rounded" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="w-24 h-4 bg-gray-200 rounded" />
      <div className="w-4 h-4 bg-gray-200 rounded" />
    </div>
  </div>
);

const MobileSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <MobileCardSkeleton key={index} />
    ))}
  </div>
);

export interface ClientsListProps {
  className?: string;
  onPatientSelect?: (patient: any) => void;
  isLoading?: boolean; // Add loading state prop
}

/**
 * ClientsList Component
 * 
 * Displays a list of patients/clients with search functionality using AG Grid DataTable.
 * Provides better performance and built-in features for data management.
 */
const ClientsList: React.FC<ClientsListProps> = ({
  className,
  onPatientSelect,
  isLoading = false // Default to false if not provided
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const navigate = useNavigate();

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed - isPrescriptionModalOpen:', isPrescriptionModalOpen, 'selectedPatient:', selectedPatient?.name);
  }, [isPrescriptionModalOpen, selectedPatient]);

  // Filter patients based on search query and scope
  const filteredPatients = mockPatients.filter(patient => {
    if (!searchQuery.trim()) return true;

    const searchTerm = searchQuery.toLowerCase();

    // Filter based on selected scope
    switch (searchScope) {
      case 'name':
        return patient.name.toLowerCase().includes(searchTerm);
      case 'dob':
        return patient.dateOfBirth.includes(searchTerm);
      case 'pid':
        return patient.pid.toLowerCase().includes(searchTerm);
      case 'externalId':
        return patient.externalId.toLowerCase().includes(searchTerm);
      case 'payerCode':
        return patient.payerCode.toLowerCase().includes(searchTerm);
      case 'all':
      default:
        return (
          patient.name.toLowerCase().includes(searchTerm) ||
          patient.homePhone.includes(searchTerm) ||
          patient.mobilePhone.includes(searchTerm) ||
          patient.workPhone.includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm) ||
          patient.id.includes(searchTerm) ||
          patient.externalId.toLowerCase().includes(searchTerm) ||
          patient.pid.toLowerCase().includes(searchTerm) ||
          patient.payerCode.toLowerCase().includes(searchTerm) ||
          patient.dateOfBirth.includes(searchTerm)
        );
    }
  });

  // Handle advanced search
  const handleAdvancedSearch = (filters: Record<string, string>) => {
    console.log('Advanced search filters:', filters);
    // TODO: Implement advanced search logic
    // For now, just close the modal
  };

  // Handle patient selection
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);

    // Store patient data for the OldUI to use
    sessionStorage.setItem('selectedPatient', JSON.stringify({
      id: patient.id,
      name: patient.name,
      gender: patient.gender,
      age: calculateAge(patient.dateOfBirth),
      dob: patient.dateOfBirth,
      homePhone: patient.homePhone,
      mobilePhone: patient.mobilePhone,
      workPhone: patient.workPhone,
      socialSecurity: patient.socialSecurity,
      externalId: patient.externalId,
      pid: patient.pid,
      payerCode: patient.payerCode,
      email: patient.email,
      lastEncounter: patient.lastEncounter,
      lastEncounterDays: patient.lastEncounterDays,
      nextAppointment: patient.nextAppointment,
      status: patient.status,
      adminPrograms: patient.adminPrograms,
      insurance: patient.insurance,
      encounterCount: patient.encounterCount,
      diagnosis: patient.diagnosis,
      levelOfCare: patient.levelOfCare
    }));

    // Store the desired menu tab to navigate directly to Client Summary Chart
    sessionStorage.setItem('selectedMenu', 'Client Summary Chart');

    // Navigate to the old UI with the selected patient
    navigate('/old-ui');

    // Call the callback if provided
    onPatientSelect?.(patient);
  };

  // AG Grid column definitions for desktop view - matches screenshot layout
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1,
      pinned: 'left',
      cellRenderer: (params: any) => {
        // Generate initials as fallback
        const initials = params.data.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const [imageError, setImageError] = React.useState(false);

        return (
          <div
            className="flex items-center py-2 cursor-pointer hover:bg-blue-50 rounded-md px-2 -mx-2 transition-colors"
            onClick={() => handlePatientSelect(params.data)}
          >
            {params.data.profilePicture && !imageError ? (
              <img
                src={params.data.profilePicture}
                alt={`${params.data.name} profile`}
                className="w-8 h-8 rounded-full object-cover mr-3"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 text-sm font-medium">
                {initials}
              </div>
            )}
            <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {params.data.name}
            </div>
          </div>
        );
      }
    },
    {
      field: 'dateOfBirth',
      headerName: 'Client DOB',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {new Date(params.data.dateOfBirth).toLocaleDateString()}
        </div>
      )
    },
    {
      field: 'gender',
      headerName: 'Client Sex',
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.gender}
        </div>
      )
    },
    {
      field: 'homePhone',
      headerName: 'Home #',
      minWidth: 130,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.homePhone || '-'}
        </div>
      )
    },
    {
      field: 'mobilePhone',
      headerName: 'Mobile #',
      minWidth: 130,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.mobilePhone || '-'}
        </div>
      )
    },
    {
      field: 'workPhone',
      headerName: 'Work #',
      minWidth: 130,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.workPhone || '-'}
        </div>
      )
    },
    {
      field: 'socialSecurity',
      headerName: 'S.S.',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.socialSecurity || '-'}
        </div>
      )
    },
    {
      field: 'externalId',
      headerName: 'External ID',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.externalId || '-'}
        </div>
      )
    },
    {
      field: 'pid',
      headerName: 'PID',
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.pid || '-'}
        </div>
      )
    },
    {
      field: 'payerCode',
      headerName: 'Payer Code',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.payerCode || '-'}
        </div>
      )
    },
    {
      field: 'adminPrograms',
      headerName: 'Admit Program(s)',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.adminPrograms?.join(', ') || '-'}
        </div>
      )
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.insurance || '-'}
        </div>
      )
    },
    {
      field: 'encounterCount',
      headerName: '# Enc(s)',
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.encounterCount || 0}
        </div>
      )
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.diagnosis || '-'}
        </div>
      )
    },
    {
      field: 'lastEncounterDays',
      headerName: 'Date (Days) of Last Encounter',
      minWidth: 180,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {new Date(params.data.lastEncounter).toLocaleDateString()}
          <div className="text-xs text-gray-500">
            ({params.data.lastEncounterDays} days)
          </div>
        </div>
      )
    },
    {
      field: 'levelOfCare',
      headerName: 'Level Of Care',
      minWidth: 130,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 py-2">
          {params.data.levelOfCare || '-'}
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      filter: false,
      suppressNavigable: true,
      cellClass: 'actions-cell',
      pinned: 'right',
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center py-2">
          <TableActionsDropdown
            patient={params.data}
            onPrescribeClick={() => {
              console.log('Actions Column: onPrescribeClick called for patient:', params.data.name);
              console.log('Actions Column: Setting selectedPatient to:', params.data);
              setSelectedPatient(params.data);
              console.log('Actions Column: Setting isPrescriptionModalOpen to true');
              setIsPrescriptionModalOpen(true);
            }}
          />
        </div>
      )
    }
  ], []);

  // Handle row click for patient selection
  const onRowClicked = (event: any) => {
    // Don't navigate if clicking on the actions column
    if (event.column?.getColId() === 'actions') {
      return;
    }
    handlePatientSelect(event.data);
  };

  return (
    <div className={cn("bg-gray-50/30 h-screen flex flex-col", className)}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            {/* Mobile: Filter Icon + Search Bar */}
            <div className="flex items-center gap-2 flex-1 sm:hidden">
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                aria-label="Filter patients"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
              </button>

              {/* Mobile Search Input */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-10"
                />
              </div>
            </div>

            {/* Desktop: Full Search Controls */}
            <div className="hidden sm:flex w-full sm:w-auto gap-2">
              {/* Search Scope Dropdown */}
              <Select value={searchScope} onValueChange={setSearchScope}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select search scope" />
                </SelectTrigger>
                <SelectContent>
                  {searchScopes.map((scope) => (
                    <SelectItem key={scope.value} value={scope.value}>
                      {scope.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Input */}
              <div className="relative flex-1 sm:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={`Search by ${searchScopes.find(s => s.value === searchScope)?.label.toLowerCase() || 'all fields'}...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>

              {/* Advanced Search Link */}
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
              >
                Advanced Search
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle - Desktop only */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <TableCellsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/patient-care/intake')}
              >
                <PlusIcon className="h-4 w-4" />
                New Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex-1 overflow-auto">
        {isLoading ? (
          /* Loading State - Show Skeleton */
          <>
            {/* Desktop View */}
            <div className="hidden sm:block">
              {viewMode === 'table' ? (
                /* Table Skeleton */
                <TableSkeleton />
              ) : (
                /* Grid Skeleton */
                <GridSkeleton />
              )}
            </div>

            {/* Mobile View - Skeleton Cards */}
            <div className="sm:hidden">
              <MobileSkeleton />
            </div>
          </>
        ) : filteredPatients.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden sm:block">
              {viewMode === 'table' ? (
                /* Table View - AG Grid DataTable */
                <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 230px)' }}>
                  <DataTable
                    rowData={filteredPatients}
                    columnDefs={columnDefs}
                    gridOptions={{
                      domLayout: 'normal',
                      pagination: true,
                      paginationPageSize: 50,
                      suppressRowClickSelection: true,
                      suppressHorizontalScroll: false,
                      alwaysShowHorizontalScroll: false,
                      suppressScrollOnNewData: true
                    }}
                  />
                </div>
              ) : (
                /* Grid View - Modern Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <ClientGridCard
                      key={patient.id}
                      patient={patient}
                      onSelect={handlePatientSelect}
                      onPrescribeClick={() => {
                        setSelectedPatient(patient);
                        setIsPrescriptionModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile View - Always Grid Cards with three-dot menu */}
            <div className="sm:hidden">
              <div className="grid grid-cols-1 gap-4">
                {filteredPatients.map((patient) => (
                  <ClientGridCard
                    key={patient.id}
                    patient={patient}
                    onSelect={handlePatientSelect}
                    onPrescribeClick={() => {
                      // Navigate to prescription page on mobile
                      navigate(`/prescription?patient=${encodeURIComponent(patient.name)}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <UserIcon className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery.trim()
                ? `No clients match "${searchQuery}"`
                : "No clients available"}
            </p>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/patient-care/intake')}
            >
              <PlusIcon className="h-4 w-4" />
              Add New Client
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
      />

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          console.log('PrescriptionModal: onClose called');
          setIsPrescriptionModalOpen(false);
        }}
        patientName={selectedPatient?.name}
      />
    </div>
  );
};

export default ClientsList; 