import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TopNavigationBar from '../components/old-ui/TopNavigationBar';
import MainNavigationBar from '../components/old-ui/MainNavigationBar';
import { 
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  UsersIcon,
  UserPlusIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  XCircleIcon,
  ArrowUpOnSquareStackIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ClockIcon as UpdateClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/atoms/Button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/atoms/Card';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '../components/atoms/Tooltip/tooltip';
import { Breadcrumb } from '../components/atoms/Breadcrumb/breadcrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientsTable } from '../components/organisms/PatientsTable';
import { PatientData, PatientActionHandlers } from '../types/patients';
import AddPatientsModal from '../components/molecules/GroupAppointmentForm/AddPatientsModal';
import { ComboboxOption } from '@/components/atoms/Combobox/Combobox';

// Mock appointment data interface
interface AppointmentData {
  id: string;
  title: string;
  provider: string;
  patient: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  isAllDay: boolean;
  duration: string;
  encounterType: string;
  program: string;
  billingProgram: string;
  supervisingProvider: string;
  status: string;
  room: string;
  comments: string;
  isRepeating: boolean;
  repeatFrequency: string;
  repeatInterval: string;
  repeatUntil: string;
  location: string;
  isTelehealth: boolean;
  printAppointmentSlip: boolean;
  showOnlyMine: boolean;
  type: 'Person' | 'Provider' | 'Group' | 'Benefits';
  patients?: PatientData[]; // Added patients array for group appointments
  // Individual appointment specific fields
  copay?: number;
  insuranceVerified?: boolean;
  checkInNotes?: string;
  priorAuthRequired?: boolean;
  priorAuthStatus?: 'Approved' | 'Pending' | 'Denied' | 'Not Required';
  priorAuthNumber?: string;
  // Billing information
  balanceDue?: number;
  nonBillableBalance?: number;
  undistributedAmount?: number;
  // Audit information
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

// PatientData interface now imported from types

const ViewAppointmentPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for AddPatientsModal
  const [addPatientsModalOpen, setAddPatientsModalOpen] = useState(false);
  const groupCapacity = 10;
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  const [patientFilter, setPatientFilter] = useState('admitted');
  const [capacityError, setCapacityError] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  
  // Waitlist patients mock data
  const waitlistPatients = useMemo(() => [
    { id: '2003414', name: 'Waitlist, One', phone: '111-222-3333', ss: 'XXX-XX-1111', dob: '12/12/2000', pid: '2003414', externalId: '2003414' },
    { id: '2003415', name: 'Waitlist, Two', phone: '222-333-4444', ss: 'XXX-XX-2222', dob: '11/11/1999', pid: '2003415', externalId: '2003415' },
  ], []);
  
  // Patient options for Combobox
  const patientOptions: ComboboxOption[] = useMemo(() => [
    { value: '1003414', label: '12@3, Monster', description: '355-666-8888 | XXX-XX-5666 | 29/12/2004 | 1003414' },
    { value: '1003415', label: 'Jane Doe', description: '123-456-7890 | XXX-XX-1234 | 01/01/1990 | 1003415' },
    { value: '1003416', label: 'John Smith', description: '987-654-3210 | XXX-XX-4321 | 02/02/1985 | 1003416' },
    { value: '1003417', label: 'Alice Johnson', description: '555-111-2222 | XXX-XX-5678 | 03/03/1982 | 1003417' },
    { value: '1003418', label: 'Bob Brown', description: '444-222-3333 | XXX-XX-8765 | 04/04/1975 | 1003418' },
    { value: '1003419', label: 'Carol White', description: '333-444-5555 | XXX-XX-3456 | 05/05/1995 | 1003419' },
    { value: '1003420', label: 'David Black', description: '222-555-6666 | XXX-XX-6543 | 06/06/1988 | 1003420' },
    { value: '1003421', label: 'Eve Green', description: '111-666-7777 | XXX-XX-7890 | 07/07/1992 | 1003421' },
    { value: '1003422', label: 'Frank Blue', description: '666-777-8888 | XXX-XX-8901 | 08/08/1980 | 1003422' },
    { value: '1003423', label: 'Grace Red', description: '777-888-9999 | XXX-XX-9012 | 09/09/1978 | 1003423' },
    { value: '1003424', label: 'Hank Violet', description: '888-999-0000 | XXX-XX-0123 | 10/10/1983 | 1003424' },
    { value: '1003425', label: 'Ivy Orange', description: '999-000-1111 | XXX-XX-1230 | 11/11/1991 | 1003425' },
  ], []);

  // Patient action handlers for the PatientsTable component
  const patientActionHandlers: PatientActionHandlers = {
    onEditEncounterTime: (patient: PatientData) => {
      console.log('Edit Encounter Time clicked', patient);
    },
    onRulesSatisfied: (patient: PatientData) => {
      console.log('Rules Satisfied clicked', patient);
    },
    onViewEncounter: (patient: PatientData) => {
      console.log('View Encounter clicked', patient);
    },
    onNotInterested: (patient: PatientData) => {
      console.log('Not Interested clicked', patient);
    },
    onSignInOut: (patient: PatientData) => {
      console.log(patient.isSignedIn ? 'Sign out clicked' : 'Sign in clicked', patient);
    },
    onViewNotes: (patient: PatientData) => {
      console.log('View Patient Notes clicked', patient);
    },
    onGoldenThreat: (patient: PatientData) => {
      console.log('Golden Threat Alerts clicked', patient);
    },
    onPriorAuth: (patient: PatientData) => {
      console.log('Prior Authorisation clicked', patient);
    },
    onUndoCheckIn: (patient: PatientData) => {
      console.log('Undo Check-in clicked', patient);
    },
  };
  
  // Handler for adding patients to event
  const handleAddToEvent = useCallback(() => {
    // TODO: Implement actual logic to add patients to the appointment
    console.log('Adding patients to event:', selectedPatients);
    
    // For now, just close the modal and show a success message
    setAddPatientsModalOpen(false);
    alert(`${selectedPatients.length} patients added to the appointment successfully!`);
    
    // Reset selected patients
    setSelectedPatients([]);
  }, [selectedPatients]);

  // Mock fetch function (replace with real API call)
  const fetchAppointment = async (id: string): Promise<AppointmentData | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data based on appointment ID
    if (id === '6') {
      return {
        id: '6',
        title: 'Group Therapy Session',
        provider: 'Sarah Wilson, LCSW',
        patient: 'Multiple Patients',
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
        comments: 'Staff Training Session for new procedures',
        isRepeating: true,
        repeatFrequency: 'every',
        repeatInterval: 'week',
        repeatUntil: '2025-12-31',
        location: 'Main Clinic',
        isTelehealth: false,
        printAppointmentSlip: false,
        showOnlyMine: false,
        type: 'Group',
        // Audit information
        lastUpdated: '2025-07-03T16:45:00Z',
        lastUpdatedBy: 'Sarah Wilson, LCSW',
        // Mock patients data for group appointment
        patients: [
          {
            id: '1001',
            clientName: 'Smith, John(1001)',
            allowEmail: true,
            email: 'john.smith@email.com',
            notes: 'Regular attendance',
            primaryCounselor: 'Sarah Wilson, LCSW',
            insurance: 'MHSA',
            serviceProgram: 'A-AADO',
            status: 'Attended',
            encounter: 'Completed',
            benefits: 'Active',
            isSignedIn: true
          },
          {
            id: '1002',
            clientName: 'Johnson, Sarah(1002)',
            allowEmail: false,
            email: 'sarah.j@email.com',
            notes: 'Needs follow-up',
            primaryCounselor: 'Michael Chen, LPC',
            insurance: 'MHSA',
            serviceProgram: 'A-AADO',
            status: 'Attended',
            encounter: 'In Progress',
            benefits: 'Active',
            isSignedIn: false
          },
          {
            id: '1003',
            clientName: 'Brown, Michael(1003)',
            allowEmail: true,
            email: 'michael.b@email.com',
            notes: 'Good progress',
            primaryCounselor: 'Emily Rodriguez, LMFT',
            insurance: 'Blue Cross',
            serviceProgram: 'A-AADO',
            status: 'Attended',
            encounter: 'Completed',
            benefits: 'Active',
            isSignedIn: true
          },
          {
            id: '1004',
            clientName: 'Davis, Emily(1004)',
            allowEmail: true,
            email: 'emily.d@email.com',
            notes: 'First session',
            primaryCounselor: 'James Taylor, LCDC',
            insurance: 'Aetna',
            serviceProgram: 'A-AADO',
            status: 'No Show',
            encounter: 'Pending',
            benefits: 'Pending',
            isSignedIn: false
          },
          {
            id: '1005',
            clientName: 'Wilson, Robert(1005)',
            allowEmail: false,
            email: 'robert.w@email.com',
            notes: 'Late arrival',
            primaryCounselor: 'Sarah Wilson, LCSW',
            insurance: 'Medicare',
            serviceProgram: 'A-AADO',
            status: 'Attended',
            encounter: 'Completed',
            benefits: 'Active',
            isSignedIn: false
          }
        ]
      };
    }
    
    // Default mock for other appointments
    return {
      id: id || '1',
      title: 'Individual Therapy Session',
      provider: 'Michael Chen, LPC',
      patient: 'John Doe',
      appointmentDate: '2025-01-15',
      appointmentStartTime: '10:00',
      appointmentEndTime: '11:00',
      isAllDay: false,
      duration: '60',
      encounterType: 'Follow-up',
      program: '1111ADiamond1111 Facility',
      billingProgram: 'APOLLO1234',
      supervisingProvider: 'Sarah Wilson, LCSW',
      status: 'Scheduled',
      room: 'Room 101',
      comments: 'Regular follow-up session',
      isRepeating: false,
      repeatFrequency: 'every',
      repeatInterval: 'week',
      repeatUntil: '',
      location: 'Main Clinic',
      isTelehealth: false,
      printAppointmentSlip: false,
      showOnlyMine: false,
      type: 'Person',
      patients: [], // No patients for individual appointments
      // Individual appointment specific fields
      copay: 25.00,
      insuranceVerified: true,
      checkInNotes: 'Patient arrived 5 minutes early, completed intake forms',
      priorAuthRequired: true,
      priorAuthStatus: 'Approved',
      priorAuthNumber: 'PA-2025-001234',
      // Billing information
      balanceDue: 12206.00,
      nonBillableBalance: 270.00,
      undistributedAmount: 0.00,
      // Audit information
      lastUpdated: '2025-01-14T15:30:00Z',
      lastUpdatedBy: 'Emily Rodriguez, LMFT'
    };
  };

  // Load appointment data
  useEffect(() => {
    if (appointmentId) {
      setLoading(true);
      fetchAppointment(appointmentId).then(data => {
        setAppointmentData(data);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching appointment:', error);
        setLoading(false);
      });
    }
  }, [appointmentId]);

  // Column definitions and table logic now handled by PatientsTable component

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format last updated timestamp
  const formatLastUpdated = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Scheduled':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Checked In':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Handle duplicate event action
  const handleDuplicateEvent = () => {
    if (!appointmentData) return;
    
    // Navigate to new appointment page with current appointment data pre-filled
    // Create URL params with current appointment data for duplication
    const duplicateParams = new URLSearchParams({
      duplicate: 'true',
      title: appointmentData.title,
      provider: appointmentData.provider,
      patient: appointmentData.patient,
      appointmentDate: appointmentData.appointmentDate,
      appointmentStartTime: appointmentData.appointmentStartTime,
      appointmentEndTime: appointmentData.appointmentEndTime,
      isAllDay: appointmentData.isAllDay.toString(),
      duration: appointmentData.duration,
      encounterType: appointmentData.encounterType,
      program: appointmentData.program,
      billingProgram: appointmentData.billingProgram,
      supervisingProvider: appointmentData.supervisingProvider,
      status: appointmentData.status,
      room: appointmentData.room,
      comments: appointmentData.comments,
      location: appointmentData.location,
      isTelehealth: appointmentData.isTelehealth.toString(),
      type: appointmentData.type
    });
    
    navigate(`/new-appointment?${duplicateParams.toString()}`);
  };



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
        <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
        <MainNavigationBar activeItem="Schedule" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading appointment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
        <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
        <MainNavigationBar activeItem="Schedule" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Appointment not found</p>
            <Button onClick={() => navigate('/my-calendar')} className="mt-4">
              Back to Calendar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
      {/* Top Navigation Bar */}
      <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
      {/* Main Navigation Bar */}
      <MainNavigationBar activeItem="Schedule" />
      
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col px-2 sm:px-4">
        {/* Breadcrumb */}
        <div className="px-0 pt-4 pb-2">
          <Breadcrumb items={[
            { label: 'Schedule', href: '/my-calendar' },
            { label: 'View Appointment' }
          ]} />
        </div>



        {/* Main Content */}
        <div className="flex-1 pb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Appointment Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{appointmentData.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointmentData.status)}`}>
                      <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      {appointmentData.status}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{appointmentData.type} Appointment</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Action Buttons */}
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {/* Create Telehealth Appointment */}
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            aria-label="Create Telehealth Appointment" 
                            onClick={() => console.log('Create Telehealth Appointment')}
                            className="hover:bg-blue-50"
                          >
                            <VideoCameraIcon className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Create Telehealth Appointment</TooltipContent>
                      </TooltipRoot>
                      
                      {/* Contact Attendees - Only show for Group appointments */}
                      {appointmentData.type === 'Group' && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              aria-label="Contact Attendees" 
                              onClick={() => console.log('Contact Attendees')}
                              className="hover:bg-blue-50"
                            >
                              <UsersIcon className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Contact Attendees</TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {/* Add or Remove Patients - Only show for Group appointments */}
                      {appointmentData.type === 'Group' && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              aria-label="Add or Remove Patients" 
                              onClick={() => setAddPatientsModalOpen(true)}
                              className="hover:bg-blue-50"
                            >
                              <UserPlusIcon className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Add or Remove Patients</TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {/* Upload Docs - Only show for Group appointments */}
                      {appointmentData.type === 'Group' && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              aria-label="Upload Docs" 
                              onClick={() => console.log('Upload Docs')}
                              className="hover:bg-blue-50"
                            >
                              <ArrowUpTrayIcon className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Upload Docs</TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {/* Prior Authorization - Only show for Individual appointments if required */}
                      {appointmentData.type === 'Person' && appointmentData.priorAuthRequired && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              aria-label="Prior Authorization" 
                              onClick={() => console.log('Prior Authorization clicked')}
                              className={`hover:bg-blue-50 ${
                                appointmentData.priorAuthStatus === 'Approved' ? 'text-green-600' :
                                appointmentData.priorAuthStatus === 'Pending' ? 'text-yellow-600' :
                                appointmentData.priorAuthStatus === 'Denied' ? 'text-red-600' :
                                'text-gray-600'
                              }`}
                            >
                              <ShieldCheckIcon className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Prior Authorization: {appointmentData.priorAuthStatus}
                            {appointmentData.priorAuthNumber && (
                              <div className="text-xs mt-1">#{appointmentData.priorAuthNumber}</div>
                            )}
                          </TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {/* Duplicate Event - Only show for Individual appointments */}
                      {appointmentData.type !== 'Group' && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              aria-label="Duplicate Event" 
                              onClick={handleDuplicateEvent}
                              className="hover:bg-green-50"
                            >
                              <DocumentDuplicateIcon className="w-5 h-5 text-green-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Duplicate Event</TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {/* Print Roster */}
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            aria-label="Print Roster" 
                            onClick={() => console.log('Print Roster')}
                            className="hover:bg-blue-50"
                          >
                            <PrinterIcon className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Print Roster</TooltipContent>
                      </TooltipRoot>
                      
                      {/* Cancel Event */}
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            aria-label="Cancel Event" 
                            onClick={() => console.log('Cancel Event')}
                            className="hover:bg-red-50"
                          >
                            <XCircleIcon className="w-5 h-5 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Cancel Event</TooltipContent>
                      </TooltipRoot>
                      
                      {/* Export to Outlook */}
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            aria-label="Export to Outlook" 
                            onClick={() => console.log('Export to Outlook')}
                            className="hover:bg-blue-50"
                          >
                            <ArrowUpOnSquareStackIcon className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Export to Outlook</TooltipContent>
                      </TooltipRoot>
                      
                      {/* Separator */}
                      <div className="h-6 w-px bg-gray-300 mx-2" />
                    </div>
                  </TooltipProvider>
                  
                  {appointmentData.isTelehealth && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                      <PhoneIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Telehealth</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => navigate(`/edit-appointment/${appointmentId}`)}
                  >
                    Edit Appointment
                  </Button>
                </div>
              </div>
            </div>

            {/* Appointment Details - Compact Layout */}
            <div className="p-6 space-y-6">
              {/* Appointment Information - All in One */}
              <Card className="shadow-none border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                  <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <InformationCircleIcon className="w-4 h-4" />
                    Appointment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-4 lg:gap-6">
                    {/* Date & Time Section */}
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3">
                      <div className="flex items-center gap-2 mb-3">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date & Time</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Date</span>
                          <span className="text-sm text-gray-900 mt-1 block">{formatDate(appointmentData.appointmentDate)}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Time</span>
                          <span className="text-sm text-gray-900 mt-1 block">
                            {appointmentData.isAllDay 
                              ? 'All Day' 
                              : `${formatTime(appointmentData.appointmentStartTime)} - ${formatTime(appointmentData.appointmentEndTime)} (${appointmentData.duration} mins)`
                            }
                          </span>
                        </div>
                        {appointmentData.isRepeating && (
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Repeats</span>
                            <span className="text-sm text-gray-900 mt-1 block">
                              {appointmentData.repeatFrequency} {appointmentData.repeatInterval}
                              {appointmentData.repeatUntil && ` until ${formatDate(appointmentData.repeatUntil)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Provider Information Section */}
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Provider Information</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Primary Provider</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.provider}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Supervising Provider</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.supervisingProvider}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Program</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.program}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Billing Program</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.billingProgram}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Location</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Location</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.location}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Room</span>
                          <span className="text-sm text-gray-900 mt-1 block">{appointmentData.room || 'Not assigned'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {appointmentData.comments && (
                      <div className="sm:col-span-1 md:col-span-2 lg:col-span-6 xl:col-span-3">
                        <div className="flex items-center gap-2 mb-3">
                          <ClipboardDocumentListIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Comments</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 leading-relaxed">{appointmentData.comments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Appointment Specific Information */}
              {appointmentData.type === 'Person' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* CoPay Information */}
                  <Card className="shadow-none border-gray-200">
                    <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                      <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4" />
                        CoPay Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">CoPay Amount</span>
                          <span className="text-lg font-semibold text-gray-900">
                            ${appointmentData.copay?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Insurance Verified</span>
                          <span className={`flex items-center gap-1 text-sm font-medium ${
                            appointmentData.insuranceVerified ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <CheckCircleIcon className="w-4 h-4" />
                            {appointmentData.insuranceVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                        {appointmentData.priorAuthRequired && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Prior Authorization</span>
                            <div className="flex items-center gap-2">
                              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                              <span className={`text-sm font-medium ${
                                appointmentData.priorAuthStatus === 'Approved' ? 'text-green-600' :
                                appointmentData.priorAuthStatus === 'Pending' ? 'text-yellow-600' :
                                appointmentData.priorAuthStatus === 'Denied' ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {appointmentData.priorAuthStatus}
                              </span>
                            </div>
                          </div>
                        )}
                        {appointmentData.priorAuthNumber && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Auth Number</span>
                            <span className="text-sm text-gray-900 mt-1 block font-mono">{appointmentData.priorAuthNumber}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Check-in Notes */}
                  <Card className="shadow-none border-gray-200">
                    <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                      <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        Check-in Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {appointmentData.checkInNotes ? (
                          <div>
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {appointmentData.checkInNotes}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No check-in notes available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                                     </Card>

                   {/* Billing Information */}
                   <Card className="shadow-none border-gray-200">
                     <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                       <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                         <BanknotesIcon className="w-4 h-4" />
                         Billing Information
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="p-4">
                       <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Balance Due</span>
                           <span className="text-lg font-semibold text-red-600">
                             ${appointmentData.balanceDue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                           </span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Non-Billable Balance</span>
                           <span className="text-sm font-medium text-gray-900">
                             ${appointmentData.nonBillableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                           </span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Undistributed Amount</span>
                           <span className="text-sm font-medium text-gray-900">
                             ${appointmentData.undistributedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                           </span>
                         </div>
                         <div className="pt-2 border-t border-gray-100">
                           <div className="text-xs text-gray-500 space-y-1">
                             <div>Non-Billable: ${appointmentData.nonBillableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                             <div>Undistributed: ${appointmentData.undistributedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               )}



              {/* Patients Table (for Group appointments) */}
              {appointmentData.type === 'Group' && appointmentData.patients && appointmentData.patients.length > 0 && (
                <PatientsTable
                  patients={appointmentData.patients}
                  title="Manage Group Roaster"
                  showGroupActions={true}
                  actionHandlers={patientActionHandlers}
                  maxHeight="96"
                  onPatientsUpdate={(updatedPatients) => {
                    // Handle patients update if needed
                    console.log('Patients updated:', updatedPatients);
                  }}
                  showAddMoreButton={true}
                  onAddMorePatients={() => {
                    // Open the AddPatientsModal
                    setAddPatientsModalOpen(true);
                  }}
                />
              )}

              {/* Last Updated Information - Moved to end of page */}
              {appointmentData.lastUpdated && (
                <div className="flex items-center justify-center py-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <UpdateClockIcon className="w-3 h-3" />
                    <span>
                      Last updated {formatLastUpdated(appointmentData.lastUpdated)}
                      {appointmentData.lastUpdatedBy && (
                        <span className="ml-1">by <span className="font-medium text-gray-600">{appointmentData.lastUpdatedBy}</span></span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* AddPatientsModal */}
    {addPatientsModalOpen && (
      <AddPatientsModal
        open={addPatientsModalOpen}
        onOpenChange={setAddPatientsModalOpen}
        patientOptions={patientOptions}
        selectedPatients={selectedPatients}
        setSelectedPatients={setSelectedPatients}
        groupCapacity={groupCapacity}
        patientFilter={patientFilter}
        setPatientFilter={setPatientFilter}
        capacityError={capacityError}
        setCapacityError={setCapacityError}
        showWaitlist={showWaitlist}
        setShowWaitlist={setShowWaitlist}
        waitlistPatients={waitlistPatients}
        onAddToEvent={handleAddToEvent}
      />
    )}
    </TooltipProvider>
  );
};

export default ViewAppointmentPage; 