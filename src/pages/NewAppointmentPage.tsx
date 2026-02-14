import React, { useState, useEffect, useMemo } from 'react';
import TopNavigationBar from '../components/old-ui/TopNavigationBar';
import MainNavigationBar from '../components/old-ui/MainNavigationBar';
// Heroicons no longer needed - all replaced with FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUsers, faUser, faPhone, faPrint, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { XMarkIcon, PencilIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import { Input } from '../components/atoms/Input';
import { Label } from '../components/atoms/Label';
import { 
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from '../components/atoms/Select';
import { Checkbox } from '../components/atoms/Checkbox';
import { Switch } from '../components/atoms/Switch/switch';
import { Textarea } from '../components/atoms/Textarea';
import { Button } from '../components/atoms/Button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/atoms/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/atoms/Dialog/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/molecules/Tabs/tabs';
import GroupAppointmentForm from '../components/molecules/GroupAppointmentForm/group-appointment-form';
import AddressSelectionModal from '../components/molecules/GroupAppointmentForm/AddressSelectionModal';
import { Breadcrumb } from '../components/atoms/Breadcrumb/breadcrumb';
import { useParams, useSearchParams } from 'react-router-dom';
import FindAvailableDialog from '@/components/organisms/FindAvailableDialog/find-available-dialog';
import ProviderAvailabilityPanel from '@/components/organisms/ProviderAvailabilityPanel/provider-availability-panel';
import AppointmentEditActions from '../components/molecules/AppointmentEditActions/appointment-edit-actions';
import { RecurringEditDialog } from '../components/molecules/RecurringEditDialog';
import RoomAllocationModal from '@/components/molecules/GroupAppointmentForm/RoomAllocationModal';
import BenefitsTab from '../components/molecules/BenefitsTab/BenefitsTab';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
// Import other atomic components and form sections as needed
// (Assume Person and Provider form content is modularized or inline for now)

/** Summary row for prior auth (Sessions / Amt / Units with Authorized, Created, Balance) */
interface PriorAuthSummary {
  sessionsAuthorized: number;
  sessionsCreated: number;
  sessionsBalance: number;
  amtAuthorized: number;
  amtCreated: number;
  amtBalance: number;
  unitsAuthorized: number;
  unitsCreated: number;
  unitsBalance: number;
}

/** Per-code row for prior auth table */
interface PriorAuthCodeRow {
  code: string;
  authorized: number;
  created: number;
  balance: number;
}

/** Encounter row for prior auth encounter details */
interface PriorAuthEncounterRow {
  encounterId: string;
  dos: string;
  serviceCodes: string;
  units: number;
  amt: number;
  posted: number;
  unposted: number;
}

// Prior auth detail for selected person (shown in popup)
interface PriorAuthDetail {
  id: string;
  requestDate: string;
  serviceDate: string;
  expirationDate?: string;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'in_review';
  serviceType: string;
  cptCodes: string[];
  unitsRequested: number;
  unitsApproved?: number;
  insuranceProvider: string;
  diagnosis: string;
  authNumber?: string;
  denialReason?: string;
  notes?: string;
  /** Table data for summary / code / encounter tables (optional; derived from above if missing) */
  summary?: PriorAuthSummary;
  codeDetails?: PriorAuthCodeRow[];
  encounterDetails?: PriorAuthEncounterRow[];
}

// Extended patient for Person select (PID, phones, insurance, copay, prior auth)
interface SamplePatientExtended {
  id: string;
  name: string;
  pid: string;
  externalId: string;
  homePhone: string;
  workPhone: string;
  insurance: string;
  copayAvailable: boolean;
  /** Copay amount in dollars when available (e.g. 25 for $25) */
  copayAmount?: number;
  /** Balance due in dollars (negative = amount owed) */
  balanceDue?: number;
  /** Non-billable balance in dollars */
  nonBillableBalance?: number;
  /** Undistributed amount in dollars */
  undistributedAmount?: number;
  priorAuthDetails: PriorAuthDetail[];
}

// Sample providers and patients data for demonstration
const sampleProviders = [
  { id: '1', name: 'Sarah Wilson, LCSW' },
  { id: '2', name: 'Michael Chen, LPC' },
  { id: '3', name: 'Emily Rodriguez, LMFT' },
  { id: '4', name: 'James Taylor, LCDC' }
];

const samplePatients: SamplePatientExtended[] = [
  {
    id: '1',
    name: 'John Doe',
    pid: '1003594',
    externalId: '1003594',
    homePhone: '(555) 123-4567',
    workPhone: '(555) 123-4569',
    insurance: 'Blue Cross Blue Shield',
    copayAvailable: true,
    copayAmount: 25,
    balanceDue: -1313,
    nonBillableBalance: 0,
    undistributedAmount: 0,
    priorAuthDetails: [
      {
        id: 'PA-2024-001',
        requestDate: '2024-03-10',
        serviceDate: '2024-03-15',
        expirationDate: '2024-06-30',
        status: 'approved',
        serviceType: 'Individual Psychotherapy',
        cptCodes: ['90834'],
        unitsRequested: 16,
        unitsApproved: 16,
        insuranceProvider: 'Blue Cross Blue Shield',
        diagnosis: 'Major Depressive Disorder',
        authNumber: 'AUTH-BCBS-78901',
        notes: 'Continuation of therapy recommended.',
        summary: {
          sessionsAuthorized: 5,
          sessionsCreated: 2,
          sessionsBalance: 3,
          amtAuthorized: 1000,
          amtCreated: 300,
          amtBalance: 700,
          unitsAuthorized: 6,
          unitsCreated: 0,
          unitsBalance: 6
        },
        codeDetails: [
          { code: 'CPT4:90834', authorized: 4, created: 0, balance: 4 },
          { code: 'HCPCS:H0004', authorized: 2, created: 0, balance: 2 }
        ],
        encounterDetails: [
          { encounterId: '100206995', dos: '01/11/2025', serviceCodes: 'HCPCS:H0050', units: 1, amt: 150, posted: 0, unposted: 150 },
          { encounterId: '100206998', dos: '27/11/2025', serviceCodes: 'CPT4:99244', units: 1, amt: 85, posted: 0, unposted: 85 },
          { encounterId: '', dos: '', serviceCodes: 'CPT4:99355', units: 1, amt: 65, posted: 0, unposted: 65 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    pid: '1004873',
    externalId: '1004873',
    homePhone: '(555) 987-6543',
    workPhone: '(555) 987-6545',
    insurance: 'Aetna',
    copayAvailable: true,
    copayAmount: 25,
    balanceDue: 0,
    nonBillableBalance: 0,
    undistributedAmount: 0,
    priorAuthDetails: [
      {
        id: 'PA-2024-003',
        requestDate: '2024-02-28',
        serviceDate: '2024-03-05',
        expirationDate: '2024-05-31',
        status: 'approved',
        serviceType: 'Group Therapy',
        cptCodes: ['90853'],
        unitsRequested: 24,
        unitsApproved: 20,
        insuranceProvider: 'Aetna',
        diagnosis: 'Generalized Anxiety Disorder',
        authNumber: 'AUTH-AET-45678',
        summary: {
          sessionsAuthorized: 24,
          sessionsCreated: 5,
          sessionsBalance: 19,
          amtAuthorized: 2400,
          amtCreated: 500,
          amtBalance: 1900,
          unitsAuthorized: 24,
          unitsCreated: 5,
          unitsBalance: 19
        },
        codeDetails: [
          { code: 'CPT4:90853', authorized: 24, created: 5, balance: 19 }
        ],
        encounterDetails: [
          { encounterId: '100206903', dos: '29/08/2025', serviceCodes: 'HCPCS:H0050', units: 5, amt: 750, posted: 0, unposted: 750 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Robert Johnson',
    pid: '1002734',
    externalId: '1002734',
    homePhone: '(555) 234-5678',
    workPhone: '(555) 234-5680',
    insurance: 'Medicare',
    copayAvailable: false,
    balanceDue: 85.5,
    nonBillableBalance: 0,
    undistributedAmount: 0,
    priorAuthDetails: [
      {
        id: 'PA-2024-004',
        requestDate: '2024-03-12',
        serviceDate: '2024-03-18',
        status: 'denied',
        serviceType: 'Psychiatric Evaluation',
        cptCodes: ['90791'],
        unitsRequested: 1,
        insuranceProvider: 'Medicare',
        diagnosis: 'Bipolar I Disorder',
        denialReason: 'Insufficient documentation of medical necessity.'
      }
    ]
  },
  {
    id: '4',
    name: 'Maria Garcia',
    pid: '1004132',
    externalId: '1004132',
    homePhone: '(555) 345-6789',
    workPhone: '(555) 345-6791',
    insurance: 'UnitedHealthcare',
    copayAvailable: true,
    copayAmount: 40,
    balanceDue: 0,
    nonBillableBalance: 0,
    undistributedAmount: 0,
    priorAuthDetails: []
  }
];

const NewAppointmentPage: React.FC = () => {
  // Get appointmentId from route params to detect edit mode
  const { appointmentId } = useParams<{ appointmentId?: string }>();
  const isEditMode = Boolean(appointmentId);
  const isCreateMode = !isEditMode;
  
  // Get URL search parameters for duplication
  const [searchParams] = useSearchParams();
  const isDuplicateMode = searchParams.get('duplicate') === 'true';

  // State to track the original appointment type for edit mode
  const [originalAppointmentType, setOriginalAppointmentType] = useState<'person' | 'provider' | 'group'>('person');
  
  // Tab state - modified to include appointmentInfo and benefits for edit mode (individual appointments only)
  const [activeTab, setActiveTab] = useState<'person' | 'provider' | 'group' | 'appointmentInfo' | 'benefits'>(() => {
    // In edit mode, show appointmentInfo for individual appointments, group for group appointments
    if (isEditMode) {
      return originalAppointmentType === 'group' ? 'group' : 'appointmentInfo';
    }
    return 'person';
  });

  // Determine if availability panel should be shown based on active tab
  const shouldShowAvailabilityPanel = activeTab === 'person' || activeTab === 'provider' || activeTab === 'group' || activeTab === 'benefits';
  // Form state (copied from modal)
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [patient, setPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentStartTime, setAppointmentStartTime] = useState('');
  const [appointmentEndTime, setAppointmentEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [duration, setDuration] = useState('20');
  const [encounterType, setEncounterType] = useState('');
  const [program, setProgram] = useState('1111ADiamond1111 Facility');
  const [billingProgram, setBillingProgram] = useState('');
  const [supervisingProvider, setSupervisingProvider] = useState('');
  const [status, setStatus] = useState('Created');
  const [room, setRoom] = useState('');
  const [comments, setComments] = useState('');
  // Set isRepeating to true for group appointments in edit mode (for demo)
  const [isRepeating, setIsRepeating] = useState(isEditMode && activeTab === 'group');
  const [repeatFrequency, setRepeatFrequency] = useState('every');
  const [repeatInterval, setRepeatInterval] = useState('day');
  const [repeatUntil, setRepeatUntil] = useState('');
  const [location, setLocation] = useState('');
  const [isTelehealth, setIsTelehealth] = useState(false);
  const [printAppointmentSlip, setPrintAppointmentSlip] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  
  // Patient demographics for Benefits tab
  const [patientDOB, setPatientDOB] = useState('1985-03-15');
  const [patientGender, setPatientGender] = useState('Male');
  
  // Room allocation state
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomAllocationModal, setShowRoomAllocationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
  
  // Recurring edit dialog state
  const [showRecurringEditDialog, setShowRecurringEditDialog] = useState(false);
  const [showFindAvailableDialog, setShowFindAvailableDialog] = useState(false);
  const [showAvailabilityMobile, setShowAvailabilityMobile] = useState(false);

  // Prior Authorization details dialog (for selected person)
  const [showPriorAuthDialog, setShowPriorAuthDialog] = useState(false);
  
  // Check In dropdown state
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false);

  // Duration calculation function - matches Group form logic
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight appointments (end time is next day)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Add 24 hours
    }
    
    return endMinutes - startMinutes;
  };

  // Memoized duration calculation
  const calculatedDuration = useMemo(() => {
    return calculateDuration(appointmentStartTime, appointmentEndTime);
  }, [appointmentStartTime, appointmentEndTime]);

  // Mock fetch function for demo (replace with real API call)
  const fetchAppointment = async (id: string) => {
    // Simulate fetching appointment data
    if (id === '6') {
      return {
        title: 'Group Therapy Session',
        provider: 'Sarah Wilson, LCSW',
        patient: '',
        appointmentDate: '2025-07-04',
        appointmentStartTime: '08:40',
        appointmentEndTime: '09:40',
        isAllDay: false,
        duration: '60',
        encounterType: 'Therapy',
        program: '1111ADiamond1111 Facility',
        billingProgram: 'APOLLO1234',
        supervisingProvider: 'James Taylor, LCDC',
        status: 'Confirmed',
        room: 'Conference Room A',
        comments: 'Staff Training',
        isRepeating: false,
        repeatFrequency: 'every',
        repeatInterval: 'week',
        repeatUntil: '',
        location: 'main-clinic',
        isTelehealth: false,
        printAppointmentSlip: false,
        showOnlyMine: false,
        type: 'Group',
      };
    } else if (id === '7') {
      // Mock individual appointment for testing
      return {
        title: 'Individual Therapy Session',
        provider: 'Michael Chen, LPC',
        patient: 'John Doe',
        appointmentDate: '2025-07-05',
        appointmentStartTime: '10:00',
        appointmentEndTime: '11:00',
        isAllDay: false,
        duration: '60',
        encounterType: 'office-visit',
        program: '1111ADiamond1111 Facility',
        billingProgram: 'APOLLO1234',
        supervisingProvider: 'James Taylor, LCDC',
        status: 'Scheduled',
        room: 'Room 101',
        comments: 'Individual session',
        isRepeating: false,
        repeatFrequency: 'every',
        repeatInterval: 'week',
        repeatUntil: '',
        location: 'main-clinic',
        isTelehealth: false,
        printAppointmentSlip: false,
        showOnlyMine: false,
        type: 'Person',
        // Patient demographics for Benefits tab
        patientDOB: '1985-03-15',
        patientGender: 'Male',
      };
    }
    // Default mock
    return null;
  };

  // Load appointment data if editing
  useEffect(() => {
    if (isEditMode && appointmentId) {
      fetchAppointment(appointmentId).then(data => {
        if (data) {
          setTitle(data.title || '');
          setProvider(data.provider || '');
          setPatient(data.patient || '');
          setAppointmentDate(data.appointmentDate || '');
          setAppointmentStartTime(data.appointmentStartTime || '');
          setAppointmentEndTime(data.appointmentEndTime || '');
          setIsAllDay(data.isAllDay || false);
          setDuration(data.duration || '');
          setEncounterType(data.encounterType || '');
          setProgram(data.program || '');
          setBillingProgram(data.billingProgram || '');
          setSupervisingProvider(data.supervisingProvider || '');
          setStatus(data.status || '');
          setRoom(data.room || '');
          setComments(data.comments || '');
          setIsRepeating(data.isRepeating || false);
          setRepeatFrequency(data.repeatFrequency || 'every');
          setRepeatInterval(data.repeatInterval || 'day');
          setRepeatUntil(data.repeatUntil || '');
          setLocation(data.location || '');
          setIsTelehealth(data.isTelehealth || false);
          setPrintAppointmentSlip(data.printAppointmentSlip || false);
          setShowOnlyMine(data.showOnlyMine || false);
          
          // Set patient demographics for Benefits tab
          setPatientDOB(data.patientDOB || '1985-03-15');
          setPatientGender(data.patientGender || 'Male');
          
          // Set original appointment type for tab logic
          const appointmentType = data.type?.toLowerCase() === 'group' ? 'group' : 
                                 data.type?.toLowerCase() === 'provider' ? 'provider' : 'person';
          setOriginalAppointmentType(appointmentType);
          
          // Auto-select correct tab based on type and edit mode
          if (appointmentType === 'group') {
            setActiveTab('group');
          } else {
            // For individual appointments in edit mode, show appointment info tab
            setActiveTab('appointmentInfo');
          }
        }
      });
    }
  }, [isEditMode, appointmentId]);

  // Handle duplication mode - populate form with URL parameters
  useEffect(() => {
    if (isDuplicateMode && isCreateMode) {
      // Populate form fields from URL parameters
      setTitle(searchParams.get('title') || '');
      setProvider(searchParams.get('provider') || '');
      setPatient(searchParams.get('patient') || '');
      setAppointmentDate(searchParams.get('appointmentDate') || new Date().toISOString().split('T')[0]);
      setAppointmentStartTime(searchParams.get('appointmentStartTime') || '');
      setAppointmentEndTime(searchParams.get('appointmentEndTime') || '');
      setIsAllDay(searchParams.get('isAllDay') === 'true');
      setDuration(searchParams.get('duration') || '20');
      setEncounterType(searchParams.get('encounterType') || '');
      setProgram(searchParams.get('program') || '1111ADiamond1111 Facility');
      setBillingProgram(searchParams.get('billingProgram') || '');
      setSupervisingProvider(searchParams.get('supervisingProvider') || '');
      setStatus('Created'); // Reset status for new appointment
      setRoom(searchParams.get('room') || '');
      setComments(searchParams.get('comments') || '');
      setLocation(searchParams.get('location') || '');
      setIsTelehealth(searchParams.get('isTelehealth') === 'true');
      
      // Set appointment type and tab based on original appointment
      const appointmentType = searchParams.get('type')?.toLowerCase();
      if (appointmentType === 'group') {
        setActiveTab('group');
        setOriginalAppointmentType('group');
      } else if (appointmentType === 'provider') {
        setActiveTab('provider');
        setOriginalAppointmentType('provider');
      } else {
        setActiveTab('person');
        setOriginalAppointmentType('person');
      }
      
      // Reset recurring settings for duplicated appointment
      setIsRepeating(false);
      setRepeatFrequency('every');
      setRepeatInterval('day');
      setRepeatUntil('');
      setPrintAppointmentSlip(false);
      setShowOnlyMine(false);
    }
  }, [isDuplicateMode, isCreateMode, searchParams]);

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (appointmentStartTime && duration && !isAllDay) {
      const [hours, minutes] = appointmentStartTime.split(':').map(Number);
      const durationMinutes = parseInt(duration);
      const endDate = new Date();
      endDate.setHours(hours, minutes + durationMinutes, 0);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      setAppointmentEndTime(`${endHours}:${endMinutes}`);
    }
  }, [appointmentStartTime, duration, isAllDay]);

  // Update isRepeating when switching to group tab in edit mode (for demo)
  useEffect(() => {
    if (isEditMode && activeTab === 'group') {
      setIsRepeating(true);
    }
  }, [isEditMode, activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCheckInDropdown) {
        setShowCheckInDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCheckInDropdown]);

  // Handler for Save - checks for recurring appointments
  const handleSave = () => {
    // Check if this is an edit mode and appointment is recurring
    if (isEditMode && isRepeating) {
      // Show recurring edit dialog to let user choose
      setShowRecurringEditDialog(true);
    } else {
      // Save normally for non-recurring or new appointments
      handleSaveAppointment('single');
    }
  };

  // Actual save logic - handles both single and recurring saves
  const handleSaveAppointment = (editType: 'single' | 'all') => {
    // Close the recurring dialog if it was open
    setShowRecurringEditDialog(false);
    
    // TODO: Implement actual save logic based on editType
    if (editType === 'single') {
      console.log('Saving only this occurrence...');
      // API call to save only this occurrence
      alert('This appointment occurrence saved!');
    } else {
      console.log('Saving all occurrences in the series...');
      // API call to save all occurrences in the recurring series
      alert('All appointment occurrences saved!');
    }
    
    // TODO: Navigate back to calendar or show success message
    // Example: navigate('/calendar');
  };

  // Handler for editing this occurrence only
  const handleEditThisOccurrence = () => {
    handleSaveAppointment('single');
  };

  // Handler for editing all occurrences
  const handleEditAllOccurrences = () => {
    handleSaveAppointment('all');
  };

  // Handler for closing recurring edit dialog
  const handleCloseRecurringDialog = () => {
    setShowRecurringEditDialog(false);
  };

  // Room allocation handlers
  const handleRoomSelected = (room: any) => {
    setSelectedRoom(room);
    setShowRoomAllocationModal(false);
  };

  const handleAddressSelected = (address: any) => {
    setSelectedAddress(address);
    setShowAddressSelectionModal(false);
  };

  // Handler for benefit request submission
  const handleBenefitRequest = (data: any) => {
    console.log('Benefit request submitted:', data);
    // TODO: Implement API call to submit benefit request
    // For now, just show a success message
    alert('Benefit request submitted successfully!');
  };

  // Handler for slot selection from availability panel
  const handleSlotSelect = (date: string, slot: string) => {
    // Parse the slot time (e.g., "8:00 AM" -> "08:00")
    const parseTimeSlot = (slotStr: string): string => {
      const [time, period] = slotStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes}`;
    };

    const startTime = parseTimeSlot(slot);
    setAppointmentStartTime(startTime);
    
    // Calculate end time based on duration
    if (duration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const durationMinutes = parseInt(duration);
      const endDate = new Date();
      endDate.setHours(hours, minutes + durationMinutes, 0);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      setAppointmentEndTime(`${endHours}:${endMinutes}`);
    }
    
    // Set the date if it's different
    if (date && date !== appointmentDate) {
      setAppointmentDate(date);
    }
    
    // Close mobile availability panel if open
    setShowAvailabilityMobile(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
      {/* Top Navigation Bar */}
      <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
      {/* Main Navigation Bar */}
      <MainNavigationBar activeItem="Schedule" />
      <div className="max-w-8xl mx-auto w-full flex-1 flex flex-col px-2 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="px-0 pt-4 pb-2">
          <Breadcrumb items={[
            { label: 'Schedule', href: '/my-calendar' },
            { label: isEditMode ? 'Edit Appointment' : isDuplicateMode ? 'Duplicate Appointment' : 'New Appointment' }
          ]} />
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 xl:gap-4 2xl:gap-5 pb-4 items-start lg:items-stretch">
          {/* Left Column - Form */}
          <form className="w-full lg:flex-1 lg:max-w-none xl:max-w-4xl 2xl:max-w-5xl p-0 pt-0" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            {/* Card with fixed height and internal scroll, responsive */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mx-auto w-full" style={{ height: '84vh', overflowY: 'auto', maxWidth: '100%' }}>
            {/* Appointment Type Selection as Tab Bar and Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
                              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'person' | 'provider' | 'group' | 'appointmentInfo' | 'benefits')}>
                                    {/* Show different tab structures based on mode */}
                  {isEditMode && originalAppointmentType !== 'group' ? (
                    /* Edit mode for individual appointments (Person/Provider) */
                    <>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Edit Appointment</Label>
                      <TabsList>
                        <TabsTrigger value="appointmentInfo">
                          <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 mr-1.5" /> Appointment Info
                        </TabsTrigger>
                        <TabsTrigger value="benefits">
                          <FontAwesomeIcon icon={faUserMd} className="h-4 w-4 mr-1.5" /> Benefits
                        </TabsTrigger>
                      </TabsList>
                    </>
                  ) : isEditMode && originalAppointmentType === 'group' ? (
                    /* Edit mode for group appointments - no tabs, just the form */
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Edit Group Appointment</Label>
                  ) : (
                    /* Create mode - show appointment type selection */
                    <>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        {isDuplicateMode ? 'Duplicate Appointment' : 'Appointment Type'}
                      </Label>
                      <TabsList>
                        <TabsTrigger value="person">
                          <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-1.5" /> Person
                        </TabsTrigger>
                        <TabsTrigger value="provider">
                          <FontAwesomeIcon icon={faUserMd} className="h-4 w-4 mr-1.5" /> Provider
                        </TabsTrigger>
                        <TabsTrigger value="group">
                          <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-1.5" /> Group
                        </TabsTrigger>
                      </TabsList>
                    </>
                  )}
                {/* Tab Content: Always render all, but only the activeTab is visible */}
                <TabsContent value="person">
                  {/* Person Appointment Form Content */}
                  <div>
                    <div className="p-4 sm:p-6 space-y-4">
                      {/* First Row - For Whom and For What - Side by Side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {/* Left Column - For Whom - fixed max height, content scrolls inside */}
                        <Card className="shadow-none border-gray-200 min-w-0 flex flex-col max-h-[280px]">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2 flex-shrink-0">
                            <CardTitle className="text-sm font-semibold text-gray-800">For Whom</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
                            <div className="space-y-1">
                              <Label htmlFor="patient" className="text-xs font-semibold text-gray-500 uppercase tracking-wide break-words">Person:</Label>
                              <Select value={patient} onValueChange={setPatient}>
                                <SelectTrigger id="patient" className="h-8 text-sm w-full">
                                  <SelectValue placeholder="Click to select" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {samplePatients.map(p => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Selected person details - compact, only when a person is selected */}
                            {patient && (() => {
                              const selectedPersonDetails = samplePatients.find(p => p.name === patient);
                              if (!selectedPersonDetails) return null;
                              return (
                                <div className="rounded-md border border-gray-200 bg-gray-50/80 p-3 space-y-2 text-xs">
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    <div>
                                      <span className="text-gray-500 font-medium">PID:</span>{' '}
                                      <span className="text-gray-800">{selectedPersonDetails.pid}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium">External ID:</span>{' '}
                                      <span className="text-gray-800">{selectedPersonDetails.externalId}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium">Home:</span>{' '}
                                      <span className="text-gray-800">{selectedPersonDetails.homePhone}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium">Work:</span>{' '}
                                      <span className="text-gray-800">{selectedPersonDetails.workPhone}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-500 font-medium">Insurance:</span>{' '}
                                      <span className="text-gray-800">{selectedPersonDetails.insurance}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium">Copay:</span>{' '}
                                      <span className={selectedPersonDetails.copayAvailable ? 'text-green-700 font-medium' : 'text-amber-700'}>
                                        {selectedPersonDetails.copayAvailable
                                          ? selectedPersonDetails.copayAmount != null
                                            ? `$${selectedPersonDetails.copayAmount.toFixed(2)}`
                                            : 'Available'
                                          : 'Not available'}
                                      </span>
                                    </div>
                                    {(selectedPersonDetails.balanceDue != null || selectedPersonDetails.nonBillableBalance != null || selectedPersonDetails.undistributedAmount != null) && (
                                      <div className="col-span-2">
                                        <span className="text-gray-500 font-medium">Balance Due:</span>{' '}
                                        <span className={(selectedPersonDetails.balanceDue ?? 0) < 0 ? 'text-red-600 font-medium' : 'text-gray-800'}>
                                          {(selectedPersonDetails.balanceDue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-gray-600 ml-1">
                                          (Non-Billable Balance: {(selectedPersonDetails.nonBillableBalance ?? 0).toFixed(2)}) (Undistributed Amount: {(selectedPersonDetails.undistributedAmount ?? 0).toFixed(2)})
                                        </span>
                                      </div>
                                    )}
                                    <div className="col-span-2 flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setShowPriorAuthDialog(true)}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                      >
                                        {selectedPersonDetails.priorAuthDetails.length > 0
                                          ? `Prior Authorization (${selectedPersonDetails.priorAuthDetails.length})`
                                          : 'Prior Authorization'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="space-y-1">
                              <Label htmlFor="title" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title:</Label>
                              <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-8 text-sm"
                                required
                              />
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Right Column - For What */}
                        <Card className="shadow-none border-gray-200 min-w-0">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">For What</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <Label htmlFor="encounterType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Type:<span className="text-red-500 font-bold text-sm">*</span></Label>
                                <div className="flex items-center">
                                  <Checkbox
                                    id="showOnlyMine"
                                    checked={showOnlyMine}
                                    onCheckedChange={(checked) => setShowOnlyMine(checked as boolean)}
                                    className="h-3 w-3"
                                  />
                                  <label htmlFor="showOnlyMine" className="ml-1.5 text-xs text-gray-600">
                                    Show Only Mine
                                  </label>
                                </div>
                              </div>
                              <Select value={encounterType} onValueChange={setEncounterType}>
                                <SelectTrigger id="encounterType" className="h-8 text-sm">
                                  <SelectValue placeholder="-- Select Contact Type --" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                                  <SelectItem value="Therapy">Therapy</SelectItem>
                                  <SelectItem value="Medication Management">Medication Management</SelectItem>
                                  <SelectItem value="Crisis Intervention">Crisis Intervention</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Second Row - When and Where - Side by Side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {/* Left Column - When */}
                        <Card className="shadow-none border-gray-200 min-w-0">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">When</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 min-w-0 overflow-hidden">
                          <div className="space-y-3 min-w-0">
                            {/* Date and All Day Event Row - Matches Group form layout */}
                            <div className="space-y-2 min-w-0">
                              <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
                                <div className="relative flex-shrink-0">
                                  <Input 
                                    id="appointmentDate" 
                                    type="date" 
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="h-9 text-sm w-full sm:w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                  />
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                                  <Switch 
                                    id="allDayEvent"
                                    checked={isAllDay}
                                    onCheckedChange={setIsAllDay}
                                    className="flex-shrink-0"
                                  />
                                  <label htmlFor="allDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer whitespace-nowrap flex-shrink-0">
                                    All day event
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* Time Controls - Hidden when All Day Event is on - Matches Group form */}
                            {!isAllDay && (
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="startTime" 
                                      type="time" 
                                      value={appointmentStartTime}
                                      onChange={(e) => setAppointmentStartTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                    <span className="text-sm text-gray-400">—</span>
                                    <Input 
                                      id="endTime" 
                                      type="time" 
                                      value={appointmentEndTime}
                                      onChange={(e) => setAppointmentEndTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                  </div>
                                  {calculatedDuration > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                                      <span className="text-sm font-semibold text-blue-700">{calculatedDuration}</span>
                                      <span className="text-xs text-blue-600 font-medium">mins</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Repeating Appointment Section - Matches Group form with Switch */}
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Switch 
                                  id="repeats"
                                  checked={isRepeating}
                                  onCheckedChange={setIsRepeating}
                                />
                                <label htmlFor="repeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                                  Repeats
                                </label>
                              </div>
                              {isRepeating && (
                                <div className="ml-5 space-y-2">
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Repeat</span>
                                    <div className="col-span-5">
                                      <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="every">every</SelectItem>
                                          <SelectItem value="every other">every other</SelectItem>
                                          <SelectItem value="every third">every third</SelectItem>
                                          <SelectItem value="every fourth">every fourth</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="col-span-5">
                                      <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select interval" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="day">day</SelectItem>
                                          <SelectItem value="week">week</SelectItem>
                                          <SelectItem value="month">month</SelectItem>
                                          <SelectItem value="year">year</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Until</span>
                                    <div className="col-span-6">
                                      <div className="relative">
                                        <Input
                                          id="repeatUntil"
                                          type="date"
                                          value={repeatUntil}
                                          onChange={(e) => setRepeatUntil(e.target.value)}
                                          className="h-8 text-sm pr-8"
                                          placeholder="Select end date"
                                        />
                                        <FontAwesomeIcon icon={faCalendar} className="absolute right-2 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        </Card>
                        
                        {/* Right Column - Where */}
                        <Card className="shadow-none border-gray-200 min-w-0">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">Where</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Address:</Label>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowAddressSelectionModal(true)}
                                  >
                                    {selectedAddress ? 'Change Address' : 'Select Address'}
                                  </Button>
                                  {selectedAddress ? (
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{selectedAddress.name}</div>
                                      <div className="text-xs text-gray-600">
                                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-700">145, 8th Avenue<br />Portland, FL - 433323455</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Room Allocation */}
                              {!selectedRoom ? (
                                <div className="pt-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowRoomAllocationModal(true)}
                                  >
                                    Allocate Room
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allocated Room:</Label>
                                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-green-800">{selectedRoom.name}</div>
                                      <div className="text-xs text-green-600">
                                        {selectedRoom.building} • Floor {selectedRoom.floor} • Capacity: {selectedRoom.capacity}
                                      </div>
                                    </div>
                                    <TooltipProvider>
                                      <div className="flex items-center gap-1">
                                        <TooltipRoot>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              onClick={() => setShowRoomAllocationModal(true)}
                                              className="text-green-600 hover:text-green-800 p-1"
                                            >
                                              <PencilIcon className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Edit room allocation</p>
                                          </TooltipContent>
                                        </TooltipRoot>
                                        <TooltipRoot>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              onClick={() => setSelectedRoom(null)}
                                              className="text-green-600 hover:text-green-800 p-1"
                                            >
                                              <XMarkIcon className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Release room</p>
                                          </TooltipContent>
                                        </TooltipRoot>
                                      </div>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Third Row - With Whom - Full Width */}
                      <Card className="shadow-none border-gray-200 min-w-0">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">With Whom</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="provider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
                            <Select value={provider} onValueChange={setProvider}>
                              <SelectTrigger id="provider" className="h-8 text-sm">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={supervisingProvider} onValueChange={setSupervisingProvider}>
                              <SelectTrigger id="supervisingProvider" className="h-8 text-sm">
                                <SelectValue placeholder="-- Unassigned --" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="program" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:</Label>
                            <Select value={program} onValueChange={setProgram}>
                              <SelectTrigger id="program" className="h-8 text-sm">
                                <SelectValue placeholder="Select Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1111ADiamond1111 Facility">1111ADiamond1111 Facility</SelectItem>
                                <SelectItem value="A-AADO">A-AADO</SelectItem>
                                <SelectItem value="A-METH">A-METH</SelectItem>
                                <SelectItem value="ABCXYZ">ABCXYZ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="billingProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Program:</Label>
                            <Select value={billingProgram} onValueChange={setBillingProgram}>
                              <SelectTrigger id="billingProgram" className="h-8 text-sm">
                                <SelectValue placeholder="Select Billing Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                                <SelectItem value="BILLING123">BILLING123</SelectItem>
                                <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="location" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={location} onValueChange={setLocation}>
                              <SelectTrigger id="location" className="h-8 text-sm">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facility1">1 New Facilityss</SelectItem>
                                <SelectItem value="apollo">APOLLO Hospitals</SelectItem>
                                <SelectItem value="main-clinic">Main Clinic</SelectItem>
                                <SelectItem value="east-wing">East Wing</SelectItem>
                                <SelectItem value="west-wing">West Wing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Fourth Row - Everything Else - Full Width */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Everything Else</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</Label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger id="status" className="h-8 text-sm">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Created">Created</SelectItem>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="No Show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="comments" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments:</Label>
                            <Textarea
                              id="comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                          <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center">
                              <Checkbox
                                id="telehealth"
                                checked={isTelehealth}
                                onCheckedChange={(checked) => setIsTelehealth(checked as boolean)}
                              />
                              <label htmlFor="telehealth" className="ml-1.5 text-sm text-gray-600">
                                <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                Telehealth Appointment
                              </label>
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                id="printAppointmentSlip"
                                checked={printAppointmentSlip}
                                onCheckedChange={(checked) => setPrintAppointmentSlip(checked as boolean)}
                              />
                              <label htmlFor="printAppointmentSlip" className="ml-1.5 text-sm text-gray-600">
                                <FontAwesomeIcon icon={faPrint} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                Print Appointment Slip
                              </label>
                            </div>
                          </div>
                        
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="provider">
                  {/* Provider Appointment Form Content */}
                  <div>
                    <div className="p-4 space-y-4">
                      {/* With Whom Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">With Whom</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="provider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
                            <Select value={provider} onValueChange={setProvider}>
                              <SelectTrigger id="provider" className="h-8 text-sm">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={supervisingProvider} onValueChange={setSupervisingProvider}>
                              <SelectTrigger id="supervisingProvider" className="h-8 text-sm">
                                <SelectValue placeholder="-- Unassigned --" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="program" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:<span className="text-red-500">*</span></Label>
                            <Select value={program} onValueChange={setProgram}>
                              <SelectTrigger id="program" className="h-8 text-sm">
                                <SelectValue placeholder="Select Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1111ADiamond1111 Facility">1111ADiamond1111 Facility</SelectItem>
                                <SelectItem value="A-AADO">A-AADO</SelectItem>
                                <SelectItem value="A-METH">A-METH</SelectItem>
                                <SelectItem value="ABCXYZ">ABCXYZ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="billingProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Program:<span className="text-red-500">*</span></Label>
                            <Select value={billingProgram} onValueChange={setBillingProgram}>
                              <SelectTrigger id="billingProgram" className="h-8 text-sm">
                                <SelectValue placeholder="Select Billing Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                                <SelectItem value="BILLING123">BILLING123</SelectItem>
                                <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="location" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:<span className="text-red-500">*</span></Label>
                            <Select value={location} onValueChange={setLocation}>
                              <SelectTrigger id="location" className="h-8 text-sm">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facility1">1 New Facilityss</SelectItem>
                                <SelectItem value="apollo">APOLLO Hospitals</SelectItem>
                                <SelectItem value="main-clinic">Main Clinic</SelectItem>
                                <SelectItem value="east-wing">East Wing</SelectItem>
                                <SelectItem value="west-wing">West Wing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* When Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">When</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Date and All Day Event Row - Matches Group form layout */}
                            <div className="space-y-2">
                              <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className="relative flex-shrink-0">
                                  <Input 
                                    id="appointmentDate" 
                                    type="date" 
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="h-9 text-sm w-full sm:w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                  />
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                                  <Switch 
                                    id="allDayEvent"
                                    checked={isAllDay}
                                    onCheckedChange={setIsAllDay}
                                  />
                                  <label htmlFor="allDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer whitespace-nowrap">
                                    All day event
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* Time Controls - Hidden when All Day Event is on - Matches Group form */}
                            {!isAllDay && (
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="startTime" 
                                      type="time" 
                                      value={appointmentStartTime}
                                      onChange={(e) => setAppointmentStartTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                    <span className="text-sm text-gray-400">—</span>
                                    <Input 
                                      id="endTime" 
                                      type="time" 
                                      value={appointmentEndTime}
                                      onChange={(e) => setAppointmentEndTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                  </div>
                                  {calculatedDuration > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                                      <span className="text-sm font-semibold text-blue-700">{calculatedDuration}</span>
                                      <span className="text-xs text-blue-600 font-medium">mins</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Repeating Appointment Section - Matches Group form with Switch */}
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Switch 
                                  id="repeats"
                                  checked={isRepeating}
                                  onCheckedChange={setIsRepeating}
                                />
                                <label htmlFor="repeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                                  Repeats
                                </label>
                              </div>
                              {isRepeating && (
                                <div className="ml-5 space-y-2">
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Repeat</span>
                                    <div className="col-span-5">
                                      <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="every">every</SelectItem>
                                          <SelectItem value="every other">every other</SelectItem>
                                          <SelectItem value="every third">every third</SelectItem>
                                          <SelectItem value="every fourth">every fourth</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="col-span-5">
                                      <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select interval" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="day">day</SelectItem>
                                          <SelectItem value="week">week</SelectItem>
                                          <SelectItem value="month">month</SelectItem>
                                          <SelectItem value="year">year</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Until</span>
                                    <div className="col-span-6">
                                      <div className="relative">
                                        <Input
                                          id="repeatUntil"
                                          type="date"
                                          value={repeatUntil}
                                          onChange={(e) => setRepeatUntil(e.target.value)}
                                          className="h-8 text-sm pr-8"
                                          placeholder="Select end date"
                                        />
                                        <FontAwesomeIcon icon={faCalendar} className="absolute right-2 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Additional Options Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Additional Options</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</Label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger id="status" className="h-8 text-sm">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Created">Created</SelectItem>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="No Show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="comments" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments:</Label>
                            <Textarea
                              id="comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="group">
                  <GroupAppointmentForm />
                </TabsContent>
                <TabsContent value="appointmentInfo">
                  {/* Show the appropriate form based on original appointment type */}
                  {originalAppointmentType === 'person' ? (
                    /* Person Appointment Form Content - Full content from Person tab */
                    <div>
                      <div className="p-4 space-y-4">
                        {/* First Row - For Whom and For What - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column - For Whom - fixed max height, content scrolls inside */}
                          <Card className="shadow-none border-gray-200 flex flex-col max-h-[280px]">
                            <CardHeader className="bg-gray-50 border-b border-gray-200 py-2 flex-shrink-0">
                              <CardTitle className="text-sm font-semibold text-gray-800">For Whom</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
                              <div className="space-y-1">
                                <Label htmlFor="patient" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Person:</Label>
                                <Select value={patient} onValueChange={setPatient}>
                                  <SelectTrigger id="patient" className="h-8 text-sm">
                                    <SelectValue placeholder="Click to select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {samplePatients.map(p => (
                                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Selected person details - compact, only when a person is selected (edit mode) */}
                              {patient && (() => {
                                const selectedPersonDetails = samplePatients.find(p => p.name === patient);
                                if (!selectedPersonDetails) return null;
                                return (
                                  <div className="rounded-md border border-gray-200 bg-gray-50/80 p-3 space-y-2 text-xs">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                      <div>
                                        <span className="text-gray-500 font-medium">PID:</span>{' '}
                                        <span className="text-gray-800">{selectedPersonDetails.pid}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 font-medium">External ID:</span>{' '}
                                        <span className="text-gray-800">{selectedPersonDetails.externalId}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 font-medium">Home:</span>{' '}
                                        <span className="text-gray-800">{selectedPersonDetails.homePhone}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 font-medium">Work:</span>{' '}
                                        <span className="text-gray-800">{selectedPersonDetails.workPhone}</span>
                                      </div>
                                      <div className="col-span-2">
                                        <span className="text-gray-500 font-medium">Insurance:</span>{' '}
                                        <span className="text-gray-800">{selectedPersonDetails.insurance}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 font-medium">Copay:</span>{' '}
                                        <span className={selectedPersonDetails.copayAvailable ? 'text-green-700 font-medium' : 'text-amber-700'}>
                                          {selectedPersonDetails.copayAvailable
                                            ? selectedPersonDetails.copayAmount != null
                                              ? `$${selectedPersonDetails.copayAmount.toFixed(2)}`
                                              : 'Available'
                                            : 'Not available'}
                                        </span>
                                      </div>
                                      {(selectedPersonDetails.balanceDue != null || selectedPersonDetails.nonBillableBalance != null || selectedPersonDetails.undistributedAmount != null) && (
                                        <div className="col-span-2">
                                          <span className="text-gray-500 font-medium">Balance Due:</span>{' '}
                                          <span className={(selectedPersonDetails.balanceDue ?? 0) < 0 ? 'text-red-600 font-medium' : 'text-gray-800'}>
                                            {(selectedPersonDetails.balanceDue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </span>
                                          <span className="text-gray-600 ml-1">
                                            (Non-Billable Balance: {(selectedPersonDetails.nonBillableBalance ?? 0).toFixed(2)}) (Undistributed Amount: {(selectedPersonDetails.undistributedAmount ?? 0).toFixed(2)})
                                          </span>
                                        </div>
                                      )}
                                      <div className="col-span-2 flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setShowPriorAuthDialog(true)}
                                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                        >
                                          {selectedPersonDetails.priorAuthDetails.length > 0
                                            ? `Prior Authorization (${selectedPersonDetails.priorAuthDetails.length})`
                                            : 'Prior Authorization'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              <div className="space-y-1">
                                <Label htmlFor="title" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title:</Label>
                                <Input
                                  id="title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="h-8 text-sm"
                                  required
                                />
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Right Column - For What */}
                          <Card className="shadow-none border-gray-200">
                            <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                              <CardTitle className="text-sm font-semibold text-gray-800">For What</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <Label htmlFor="encounterType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Type:<span className="text-red-500 font-bold text-sm">*</span></Label>
                                  <div className="flex items-center">
                                    <Checkbox
                                      id="showOnlyMine"
                                      checked={showOnlyMine}
                                      onCheckedChange={(checked) => setShowOnlyMine(checked as boolean)}
                                      className="h-3 w-3"
                                    />
                                    <label htmlFor="showOnlyMine" className="ml-1.5 text-xs text-gray-600">
                                      Show Only Mine
                                    </label>
                                  </div>
                                </div>
                                <Select value={encounterType} onValueChange={setEncounterType}>
                                  <SelectTrigger id="encounterType" className="h-8 text-sm">
                                    <SelectValue placeholder="-- Select Contact Type --" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                                    <SelectItem value="Therapy">Therapy</SelectItem>
                                    <SelectItem value="Medication Management">Medication Management</SelectItem>
                                    <SelectItem value="Crisis Intervention">Crisis Intervention</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Second Row - When and Where - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column - When */}
                          <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">When</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Date and All Day Event Row - Matches Group form layout */}
                              <div className="space-y-2">
                                <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <Input 
                                      id="appointmentDate" 
                                      type="date" 
                                      value={appointmentDate}
                                      onChange={(e) => setAppointmentDate(e.target.value)}
                                      className="h-9 text-sm w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch 
                                      id="allDayEvent"
                                      checked={isAllDay}
                                      onCheckedChange={setIsAllDay}
                                    />
                                    <label htmlFor="allDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer">
                                      All day event
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {/* Time Controls - Hidden when All Day Event is on - Matches Group form */}
                              {!isAllDay && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        id="startTime" 
                                        type="time" 
                                        value={appointmentStartTime}
                                        onChange={(e) => setAppointmentStartTime(e.target.value)}
                                        className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                      />
                                      <span className="text-sm text-gray-400">—</span>
                                      <Input 
                                        id="endTime" 
                                        type="time" 
                                        value={appointmentEndTime}
                                        onChange={(e) => setAppointmentEndTime(e.target.value)}
                                        className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                      />
                                    </div>
                                    {calculatedDuration > 0 && (
                                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                                        <span className="text-sm font-semibold text-blue-700">{calculatedDuration}</span>
                                        <span className="text-xs text-blue-600 font-medium">mins</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* Repeating Appointment Section - Matches Group form with Switch */}
                              <div className="pt-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <Switch 
                                    id="repeats"
                                    checked={isRepeating}
                                    onCheckedChange={setIsRepeating}
                                  />
                                  <label htmlFor="repeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                                    Repeats
                                  </label>
                                </div>
                                {isRepeating && (
                                  <div className="ml-5 space-y-2">
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <span className="text-xs text-gray-600 col-span-2">Repeat</span>
                                      <div className="col-span-5">
                                        <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Select frequency" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="every">every</SelectItem>
                                            <SelectItem value="every other">every other</SelectItem>
                                            <SelectItem value="every third">every third</SelectItem>
                                            <SelectItem value="every fourth">every fourth</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-5">
                                        <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Select interval" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="day">day</SelectItem>
                                            <SelectItem value="week">week</SelectItem>
                                            <SelectItem value="month">month</SelectItem>
                                            <SelectItem value="year">year</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <span className="text-xs text-gray-600 col-span-2">Until</span>
                                      <div className="col-span-6">
                                        <div className="relative">
                                          <Input
                                            id="repeatUntil"
                                            type="date"
                                            value={repeatUntil}
                                            onChange={(e) => setRepeatUntil(e.target.value)}
                                            className="h-8 text-sm pr-8"
                                            placeholder="Select end date"
                                          />
                                          <FontAwesomeIcon icon={faCalendar} className="absolute right-2 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          </Card>
                          
                          {/* Right Column - Where */}
                          <Card className="shadow-none border-gray-200">
                            <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                              <CardTitle className="text-sm font-semibold text-gray-800">Where</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Address:</Label>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setShowAddressSelectionModal(true)}
                                    >
                                      {selectedAddress ? 'Change Address' : 'Select Address'}
                                    </Button>
                                    {selectedAddress ? (
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">{selectedAddress.name}</div>
                                        <div className="text-xs text-gray-600">
                                          {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-700">145, 8th Avenue<br />Portland, FL - 433323455</span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Room Allocation */}
                                {!selectedRoom ? (
                                  <div className="pt-2">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setShowRoomAllocationModal(true)}
                                    >
                                      Allocate Room
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allocated Room:</Label>
                                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-green-800">{selectedRoom.name}</div>
                                        <div className="text-xs text-green-600">
                                          {selectedRoom.building} • Floor {selectedRoom.floor} • Capacity: {selectedRoom.capacity}
                                        </div>
                                      </div>
                                      <TooltipProvider>
                                        <div className="flex items-center gap-1">
                                          <TooltipRoot>
                                            <TooltipTrigger asChild>
                                              <Button 
                                                type="button" 
                                                variant="ghost" 
                                                onClick={() => setShowRoomAllocationModal(true)}
                                                className="text-green-600 hover:text-green-800 p-1"
                                              >
                                                <PencilIcon className="w-4 h-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Edit room allocation</p>
                                            </TooltipContent>
                                          </TooltipRoot>
                                          <TooltipRoot>
                                            <TooltipTrigger asChild>
                                              <Button 
                                                type="button" 
                                                variant="ghost" 
                                                onClick={() => setSelectedRoom(null)}
                                                className="text-green-600 hover:text-green-800 p-1"
                                              >
                                                <XMarkIcon className="w-4 h-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Release room</p>
                                            </TooltipContent>
                                          </TooltipRoot>
                                        </div>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Third Row - With Whom - Full Width */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">With Whom</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="provider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
                              <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger id="provider" className="h-8 text-sm">
                                  <SelectValue placeholder="Select Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sampleProviders.map(p => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500 font-bold text-sm">*</span></Label>
                              <Select value={supervisingProvider} onValueChange={setSupervisingProvider}>
                                <SelectTrigger id="supervisingProvider" className="h-8 text-sm">
                                  <SelectValue placeholder="-- Unassigned --" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sampleProviders.map(p => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="program" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:</Label>
                              <Select value={program} onValueChange={setProgram}>
                                <SelectTrigger id="program" className="h-8 text-sm">
                                  <SelectValue placeholder="Select Program" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1111ADiamond1111 Facility">1111ADiamond1111 Facility</SelectItem>
                                  <SelectItem value="A-AADO">A-AADO</SelectItem>
                                  <SelectItem value="A-METH">A-METH</SelectItem>
                                  <SelectItem value="ABCXYZ">ABCXYZ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="billingProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Program:</Label>
                              <Select value={billingProgram} onValueChange={setBillingProgram}>
                                <SelectTrigger id="billingProgram" className="h-8 text-sm">
                                  <SelectValue placeholder="Select Billing Program" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                                  <SelectItem value="BILLING123">BILLING123</SelectItem>
                                  <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="location" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:<span className="text-red-500 font-bold text-sm">*</span></Label>
                              <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger id="location" className="h-8 text-sm">
                                  <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="facility1">1 New Facilityss</SelectItem>
                                  <SelectItem value="apollo">APOLLO Hospitals</SelectItem>
                                  <SelectItem value="main-clinic">Main Clinic</SelectItem>
                                  <SelectItem value="east-wing">East Wing</SelectItem>
                                  <SelectItem value="west-wing">West Wing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Fourth Row - Everything Else - Full Width */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">Everything Else</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</Label>
                              <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status" className="h-8 text-sm">
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Created">Created</SelectItem>
                                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                                  <SelectItem value="Checked In">Checked In</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                  <SelectItem value="No Show">No Show</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="comments" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments:</Label>
                              <Textarea
                                id="comments"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                            <div className="flex flex-wrap gap-4 pt-2">
                              <div className="flex items-center">
                                <Checkbox
                                  id="telehealth"
                                  checked={isTelehealth}
                                  onCheckedChange={(checked) => setIsTelehealth(checked as boolean)}
                                />
                                <label htmlFor="telehealth" className="ml-1.5 text-sm text-gray-600">
                                  <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                  Telehealth Appointment
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox
                                  id="printAppointmentSlip"
                                  checked={printAppointmentSlip}
                                  onCheckedChange={(checked) => setPrintAppointmentSlip(checked as boolean)}
                                />
                                <label htmlFor="printAppointmentSlip" className="ml-1.5 text-sm text-gray-600">
                                  <FontAwesomeIcon icon={faPrint} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                  Print Appointment Slip
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    /* Provider Appointment Form Content */
                    <div>
                      <div className="p-4 space-y-4">
                        {/* Provider appointment form content would go here */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">Provider Appointment</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Provider appointment form content...</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="benefits">
                  {/* Benefits Tab Content */}
                  <div className="p-4">
                    <BenefitsTab
                      patientName={patient}
                      patientDOB={patientDOB}
                      patientGender={patientGender}
                      patientId={appointmentId || 'new'}
                      onRequestBenefits={handleBenefitRequest}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              {/* Mobile Action Buttons (bottom of form card, only on mobile) */}
              <div className="flex flex-col gap-2 sm:hidden mt-4 px-4 pb-4">
                {isEditMode && originalAppointmentType !== 'group' ? (
                  /* Individual appointments - specific actions */
                  <>
                    <div className="flex flex-row gap-2 w-full">
                      <Button type="button" variant="outline" className="text-sm h-10 text-red-600 border-red-400 flex-1" onClick={() => console.log('Delete appointment')}>
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <Button type="button" variant="outline" className="text-sm h-10 text-blue-600 border-blue-400 flex-1" onClick={() => console.log('Duplicate appointment')}>
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                        Duplicate
                      </Button>
                    </div>
                    <div className="flex flex-row gap-2 w-full">
                      <Button type="button" variant="outline" className="text-sm h-10 text-blue-600 border-blue-400 flex-1" onClick={() => console.log('Print slip')}>
                        <FontAwesomeIcon icon={faPrint} className="w-4 h-4 mr-1" />
                        Print Slip
                      </Button>
                      <div className="relative flex-1">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="text-sm h-10 text-blue-600 border-blue-400 w-full flex items-center justify-center gap-1" 
                          onClick={() => setShowCheckInDropdown(!showCheckInDropdown)}
                        >
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                          Check In
                          <ChevronDownIcon className="w-3 h-3" />
                        </Button>
                        {showCheckInDropdown && (
                          <div className="absolute right-0 top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <div className="py-1">
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  console.log('Check in - Arrived');
                                  setShowCheckInDropdown(false);
                                }}
                              >
                                Arrived
                              </button>
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  console.log('Check in - Arrived With Payment');
                                  setShowCheckInDropdown(false);
                                }}
                              >
                                Arrived With Payment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="text-sm h-10 bg-sky-500 hover:bg-sky-600 text-white w-full">Save Changes</Button>
                  </>
                ) : (
                  /* Group appointments or create mode - show all buttons */
                  <>
                    <div className="flex flex-row gap-2 w-full">
                      <Button type="button" variant="outline" className="text-sm h-10 text-blue-600 border-blue-400 flex-1">Cancel</Button>
                      {/* Show Find Available for all appointment tabs */}
                      {shouldShowAvailabilityPanel && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="text-sm h-10 text-blue-600 border-blue-400 flex-1"
                          onClick={() => setShowAvailabilityMobile(true)}
                        >
                          Find Available
                        </Button>
                      )}
                      <Button type="button" variant="outline" className="text-sm h-10 text-red-600 border-red-400 p-2 flex-1" aria-label="Delete">
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mx-auto" />
                      </Button>
                    </div>
                    <Button type="submit" className="text-sm h-10 bg-sky-500 hover:bg-sky-600 text-white w-full">
                      {isEditMode ? 'Save Changes' : isDuplicateMode ? 'Create Appointment' : 'Save Appointment'}
                    </Button>
                  </>
                )}
              </div>
              
              {/* Desktop Sticky Action Footer (only on desktop) */}
              <div className="hidden sm:block sticky bottom-0 bg-white px-4 py-3 mt-4">
                {isEditMode ? (
                  /* Edit Mode Actions */
                  originalAppointmentType === 'group' ? (
                    <AppointmentEditActions 
                      onSave={handleSave} 
                      onCreateTelehealth={() => console.log('Create Telehealth - TODO: Implement')} 
                      onContactAttendees={() => console.log('Contact Attendees - TODO: Implement')}
                    />
                  ) : (
                    /* Individual appointments - specific actions */
                    <div className="flex flex-row gap-2 justify-end">
                      <Button type="button" variant="outline" className="text-sm h-8 text-red-600 border-red-400" onClick={() => console.log('Delete appointment')}>
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <Button type="button" variant="outline" className="text-sm h-8" onClick={() => console.log('Duplicate appointment')}>
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button type="button" variant="outline" className="text-sm h-8" onClick={() => console.log('Print slip')}>
                        <FontAwesomeIcon icon={faPrint} className="w-4 h-4 mr-1" />
                        Print Slip
                      </Button>
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="text-sm h-8 flex items-center gap-1" 
                          onClick={() => setShowCheckInDropdown(!showCheckInDropdown)}
                        >
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                          Check In
                          <ChevronDownIcon className="w-3 h-3" />
                        </Button>
                        {showCheckInDropdown && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <div className="py-1">
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  console.log('Check in - Arrived');
                                  setShowCheckInDropdown(false);
                                }}
                              >
                                Arrived
                              </button>
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  console.log('Check in - Arrived With Payment');
                                  setShowCheckInDropdown(false);
                                }}
                              >
                                Arrived With Payment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="default" type="submit" className="text-sm h-8">
                        {isDuplicateMode ? 'Create Appointment' : 'Save Changes'}
                      </Button>
                    </div>
                  )
                ) : (
                  /* Create Mode Actions */
                  <div className="flex flex-row gap-2 justify-end">
                    <Button type="button" variant="outline" className="text-sm h-8">Cancel</Button>
                    {/* Show Find Available for all appointment tabs - Mobile shows panel, Desktop is always visible */}
                    {shouldShowAvailabilityPanel && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="text-sm h-8 lg:hidden"
                        onClick={() => setShowAvailabilityMobile(true)}
                      >
                        Find Available
                      </Button>
                    )}
                    <Button type="button" variant="outline" className="text-xs h-8 text-red-600 border-red-400 p-2" aria-label="Delete">
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </Button>
                    <Button variant="default" type="submit" className="text-sm h-8">
                      {isDuplicateMode ? 'Create Appointment' : 'Save Appointment'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

          {/* Right Column - Availability Panel (Desktop) */}
          {shouldShowAvailabilityPanel && (
            <div className="hidden lg:block lg:flex-none lg:w-96 xl:w-[480px] 2xl:w-[520px] lg:max-w-md xl:max-w-[480px] 2xl:max-w-[520px]">
              <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm" style={{ height: '84vh', overflowY: 'auto' }}>
                <ProviderAvailabilityPanel
                  date={appointmentDate}
                  appointmentType={encounterType}
                  provider={provider}
                  patient={activeTab === 'provider' ? undefined : patient}
                  appointmentTab={activeTab}
                  onSlotSelect={handleSlotSelect}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Recurring Edit Dialog */}
      <RecurringEditDialog
        isOpen={showRecurringEditDialog}
        onClose={handleCloseRecurringDialog}
        onEditThis={handleEditThisOccurrence}
        onEditAll={handleEditAllOccurrences}
        appointmentTitle={title || 'Untitled Appointment'}
      />

      {/* Prior Authorization details dialog for selected person - matches NewTaskDialog popup style */}
      <Dialog open={showPriorAuthDialog} onOpenChange={setShowPriorAuthDialog}>
        <DialogContent
          aria-describedby="prior-auth-dialog-desc"
          className="sm:max-w-[720px] p-0 flex flex-col max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
        >
          <DialogTitle className="sr-only">Prior Authorization — {patient || 'Person'}</DialogTitle>
          <DialogDescription id="prior-auth-dialog-desc" className="sr-only">
            View prior authorization details for the selected person
          </DialogDescription>
          {/* Visible title bar - matches NewTaskDialog */}
          <div className="px-4 py-2 rounded-t-xl">
            <h2 className="text-base font-semibold text-gray-900">Prior Authorization — {patient || 'Person'}</h2>
          </div>
          {/* Main content in white card - data table layout */}
          <div className="flex-1 min-h-0 overflow-hidden p-4">
            <div className="min-h-0 h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              {!patient ? (
                <p className="text-sm text-gray-500">Select a person to view prior authorization.</p>
              ) : (() => {
                const selectedPersonDetails = samplePatients.find(p => p.name === patient);
                if (!selectedPersonDetails?.priorAuthDetails?.length) {
                  return <p className="text-sm text-gray-500">No prior authorization records.</p>;
                }
                const asOfDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
                return (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Active Prior Authorizations as on {asOfDate}
                    </h3>
                    {selectedPersonDetails.priorAuthDetails.map((auth) => (
                      <div key={auth.id} className="rounded-lg border border-gray-200 bg-gray-50/30 overflow-hidden">
                        {/* Auth header */}
                        <div className="px-3 py-2 border-b border-gray-200 bg-white flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-800">{auth.serviceType}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            auth.status === 'approved' ? 'bg-green-100 text-green-800' :
                            auth.status === 'denied' ? 'bg-red-100 text-red-800' :
                            auth.status === 'pending' || auth.status === 'in_review' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {auth.status.replace('_', ' ')}
                          </span>
                          {auth.authNumber && (
                            <span className="text-gray-600 text-sm">
                              Authorization #: {auth.authNumber} Valid From: {auth.requestDate} To: {auth.expirationDate ?? '—'}
                            </span>
                          )}
                        </div>

                        <div className="p-3 space-y-4">
                          {/* Summary table */}
                          {(auth.summary || auth.unitsRequested != null) && (
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200 hover:bg-transparent">
                                  <TableHead className="w-[100px] text-xs font-semibold text-gray-600 bg-gray-50">Summary:</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Authorized</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Created</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Balance</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {auth.summary ? (
                                  <>
                                    <TableRow className="border-gray-200">
                                      <TableCell className="text-xs font-medium text-gray-700 py-1.5">Sessions:</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.sessionsAuthorized}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.sessionsCreated}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.sessionsBalance}</TableCell>
                                    </TableRow>
                                    <TableRow className="border-gray-200">
                                      <TableCell className="text-xs font-medium text-gray-700 py-1.5">Amt:</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.amtAuthorized.toFixed(2)}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.amtCreated.toFixed(2)}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.amtBalance.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow className="border-gray-200">
                                      <TableCell className="text-xs font-medium text-gray-700 py-1.5">Units:</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.unitsAuthorized}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.unitsCreated}</TableCell>
                                      <TableCell className="text-xs text-right py-1.5">{auth.summary.unitsBalance}</TableCell>
                                    </TableRow>
                                  </>
                                ) : (
                                  <TableRow className="border-gray-200">
                                    <TableCell className="text-xs font-medium text-gray-700 py-1.5">Units:</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{auth.unitsRequested}</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">—</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{auth.unitsApproved ?? auth.unitsRequested}</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          )}

                          {/* Code details table */}
                          {(auth.codeDetails?.length || auth.cptCodes?.length) && (
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200 hover:bg-transparent">
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50">Code</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Authorized</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Created</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Balance</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {auth.codeDetails?.length
                                  ? auth.codeDetails.map((row, i) => (
                                      <TableRow key={i} className="border-gray-200">
                                        <TableCell className="text-xs py-1.5">{row.code}</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">{row.authorized}</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">{row.created}</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">{row.balance}</TableCell>
                                      </TableRow>
                                    ))
                                  : auth.cptCodes?.map((code, i) => (
                                      <TableRow key={i} className="border-gray-200">
                                        <TableCell className="text-xs py-1.5">CPT4:{code}</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">{auth.unitsApproved ?? auth.unitsRequested}</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">—</TableCell>
                                        <TableCell className="text-xs text-right py-1.5">{auth.unitsApproved ?? auth.unitsRequested}</TableCell>
                                      </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                          )}

                          {/* Encounter details table */}
                          {auth.encounterDetails?.length > 0 && (
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200 hover:bg-transparent">
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50">Encounter (DOS)</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50">Service Code(s)</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Units</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Amt</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Posted</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-600 bg-gray-50 text-right">Unposted</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {auth.encounterDetails.map((row, i) => (
                                  <TableRow key={i} className="border-gray-200">
                                    <TableCell className="text-xs py-1.5">
                                      {row.encounterId && row.dos ? `${row.encounterId} (${row.dos})` : row.serviceCodes || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs py-1.5">{row.encounterId ? (row.serviceCodes || '—') : '—'}</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{row.units}</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{row.amt.toFixed(2)}</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{row.posted.toFixed(2)}</TableCell>
                                    <TableCell className="text-xs text-right py-1.5">{row.unposted.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}

                          {/* Diagnosis / notes */}
                          {(auth.diagnosis || auth.denialReason || auth.notes) && (
                            <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-gray-100">
                              {auth.diagnosis && <p><span className="font-medium text-gray-700">Diagnosis:</span> {auth.diagnosis}</p>}
                              {auth.denialReason && <p className="text-amber-700">{auth.denialReason}</p>}
                              {auth.notes && <p className="italic text-gray-500">{auth.notes}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
          <DialogFooter className="py-2.5 px-4">
            <Button variant="ghost" onClick={() => setShowPriorAuthDialog(false)} className="px-3 h-9 font-normal border-gray-200 text-sm">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Find Available Dialog - Legacy (kept for backward compatibility) */}
      <FindAvailableDialog
        open={showFindAvailableDialog}
        onClose={() => setShowFindAvailableDialog(false)}
      />
      
      {/* Mobile Availability Panel Modal */}
      {shouldShowAvailabilityPanel && (
        <Dialog open={showAvailabilityMobile} onOpenChange={setShowAvailabilityMobile}>
          <DialogContent className="max-w-full h-[90vh] flex flex-col p-0 gap-0">
            <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
              <DialogTitle>Provider Availability</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0">
              <div className="h-full">
                <ProviderAvailabilityPanel
                  date={appointmentDate}
                  appointmentType={encounterType}
                  provider={provider}
                  patient={activeTab === 'provider' ? undefined : patient}
                  appointmentTab={activeTab}
                  onSlotSelect={handleSlotSelect}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Room Allocation Modal */}
      <RoomAllocationModal
        open={showRoomAllocationModal}
        onClose={() => setShowRoomAllocationModal(false)}
        onRoomSelected={handleRoomSelected}
        selectedDate={appointmentDate}
        selectedTime={appointmentStartTime}
      />
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressSelectionModal}
        onClose={() => setShowAddressSelectionModal(false)}
        onAddressSelected={handleAddressSelected}
        selectedAddress={selectedAddress}
      />
    </div>
  );
};

export default NewAppointmentPage; 