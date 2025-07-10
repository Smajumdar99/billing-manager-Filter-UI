import React, { useState, useEffect } from 'react';
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
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/atoms/Button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/atoms/Card';
import { TooltipProvider } from '../components/atoms/Tooltip/tooltip';
import { Breadcrumb } from '../components/atoms/Breadcrumb/breadcrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientsTable } from '../components/organisms/PatientsTable';
import { PatientData, PatientActionHandlers } from '../types/patients';

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
}

// PatientData interface now imported from types

const ViewAppointmentPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

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
      patients: [] // No patients for individual appointments
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
                  <Button 
                    onClick={() => navigate(`/edit-appointment/${appointmentId}`)}
                  >
                    Edit Appointment
                  </Button>
                  {appointmentData.isTelehealth && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                      <PhoneIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Telehealth</span>
                    </div>
                  )}
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

              {/* Patients Table (for Group appointments) */}
              {appointmentData.type === 'Group' && appointmentData.patients && appointmentData.patients.length > 0 && (
                <PatientsTable
                  patients={appointmentData.patients}
                  title="Patients"
                  showGroupActions={true}
                  actionHandlers={patientActionHandlers}
                  maxHeight="96"
                  onPatientsUpdate={(updatedPatients) => {
                    // Handle patients update if needed
                    console.log('Patients updated:', updatedPatients);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default ViewAppointmentPage; 