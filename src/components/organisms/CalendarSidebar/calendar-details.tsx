import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, PlusIcon, MagnifyingGlassIcon, ClockIcon, UserIcon, ChevronDownIcon, ChevronRightIcon, ArrowLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button'

/**
 * CalendarDetails Component
 * 
 * Right sidebar for the calendar view showing event details and shortcuts
 * Enhanced with search functionality, improved quick meeting feature, and
 * upcoming appointments display for behavioral health clinic staff
 */
interface CalendarDetailsProps {
  upcomingMeeting?: {
    title: string;
    time: string;
    participants: string[];
  } | null;
  onCreateMeeting: () => void;
}

// Sample upcoming appointments for a front desk officer in a behavioral health clinic
const SAMPLE_APPOINTMENTS = [
  {
    id: 1,
    patientName: 'James Wilson',
    appointmentType: 'Initial Assessment',
    time: '10:30 AM',
    provider: 'Dr. Sarah Johnson',
    status: 'Confirmed'
  },
  {
    id: 2,
    patientName: 'Emily Rodriguez',
    appointmentType: 'Therapy Session',
    time: '11:45 AM',
    provider: 'Dr. Michael Chen',
    status: 'Checked In'
  },
  {
    id: 3,
    patientName: 'Robert Davis',
    appointmentType: 'Medication Review',
    time: '1:15 PM',
    provider: 'Dr. Lisa Thompson',
    status: 'Pending'
  },
  {
    id: 4,
    patientName: 'Sophia Martinez',
    appointmentType: 'Follow-up',
    time: '2:30 PM',
    provider: 'Dr. Sarah Johnson',
    status: 'Confirmed'
  }
];

// Sample clinicians/physicians for quick meeting selection
const SAMPLE_CLINICIANS = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Psychiatrist', availability: 'Available today' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Psychologist', availability: 'Available tomorrow' },
  { id: 3, name: 'Dr. Lisa Thompson', specialty: 'Therapist', availability: 'Available today' },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Counselor', availability: 'Available today' },
  { id: 5, name: 'Dr. Emily Rodriguez', specialty: 'Psychiatrist', availability: 'Available Friday' },
];

// Sample time slots for appointment creation
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
];

export const CalendarDetails: React.FC<CalendarDetailsProps> = ({
  upcomingMeeting = null,
  onCreateMeeting
}) => {
  // State for search input and quick meeting input
  const [searchQuery, setSearchQuery] = useState('');
  const [quickMeetingInput, setQuickMeetingInput] = useState('');
  // State for shortcuts section collapse
  const [shortcutsCollapsed, setShortcutsCollapsed] = useState(true);
  // State for quick meeting flow
  const [showClinicianList, setShowClinicianList] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState<typeof SAMPLE_CLINICIANS[0] | null>(null);
  const [showAppointmentCreation, setShowAppointmentCreation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('Initial Assessment');
  
  // Refs for the dropdown components
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter appointments based on search query
  const filteredAppointments = SAMPLE_APPOINTMENTS.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.appointmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter clinicians based on quick meeting input
  const filteredClinicians = quickMeetingInput.length > 0
    ? SAMPLE_CLINICIANS.filter(clinician => 
        clinician.name.toLowerCase().includes(quickMeetingInput.toLowerCase()) ||
        clinician.specialty.toLowerCase().includes(quickMeetingInput.toLowerCase())
      )
    : SAMPLE_CLINICIANS;

  // Handle clinician selection
  const handleClinicianSelect = (clinician: typeof SAMPLE_CLINICIANS[0]) => {
    setSelectedClinician(clinician);
    setShowClinicianList(false);
    setShowAppointmentCreation(true);
  };

  // Handle appointment creation
  const handleCreateAppointment = () => {
    // In a real app, this would save the appointment to a database
    console.log('Creating appointment:', {
      clinician: selectedClinician?.name,
      date: selectedDate,
      time: selectedTime,
      patient: patientName,
      type: appointmentType
    });
    
    // Reset states
    setSelectedClinician(null);
    setShowAppointmentCreation(false);
    setQuickMeetingInput('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTime('');
    setPatientName('');
    setAppointmentType('Initial Assessment');
    
    // Focus back on the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (showAppointmentCreation) {
      setShowAppointmentCreation(false);
      setSelectedClinician(null);
      setShowClinicianList(true);
    } else {
      setShowClinicianList(false);
      setQuickMeetingInput('');
    }
  };

  // Toggle clinician list visibility
  const toggleClinicianList = () => {
    setShowClinicianList(!showClinicianList);
    if (!showClinicianList && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle clicks outside of the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowClinicianList(false);
      }
    }

    // Add event listener when dropdown is shown
    if (showClinicianList) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClinicianList]);

  return (
    <div className="w-80 border-l border-gray-200 flex flex-col overflow-hidden bg-white shadow-sm">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col overflow-auto">
        {/* Only show appointments and other sections if not in appointment creation mode */}
        {!showAppointmentCreation ? (
          <>
            {/* Upcoming Appointments */}
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Today's appointments</h4>
              {filteredAppointments.length > 0 ? (
                <div className="space-y-2">
                  {filteredAppointments.map(appointment => (
                    <div key={appointment.id} className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-gray-800 truncate">{appointment.patientName}</h5>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{appointment.appointmentType}</p>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <p className="text-xs font-medium text-gray-700 mt-0.5">{appointment.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <p className="text-xs text-gray-500 italic">No appointments found matching "{searchQuery}"</p>
              ) : (
                <p className="text-xs text-gray-500 italic">No appointments scheduled for today</p>
              )}
            </div>
            
            {/* Quick Meeting */}
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick meeting</h4>
              <div className="relative">
                <div className="flex items-center space-x-1.5">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      className="block w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Type name..."
                      value={quickMeetingInput}
                      onChange={(e) => setQuickMeetingInput(e.target.value)}
                      onFocus={() => setShowClinicianList(true)}
                    />
                  </div>
                  <button
                    className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                    onClick={toggleClinicianList}
                    aria-label="Show clinicians"
                  >
                    {showClinicianList ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Clinician List */}
                {showClinicianList && (
                  <div 
                    ref={dropdownRef}
                    className="mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                  >
                    {filteredClinicians.length > 0 ? (
                      filteredClinicians.map((clinician) => (
                        <div
                          key={clinician.id}
                          className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                          onClick={() => handleClinicianSelect(clinician)}
                        >
                          <div className="font-medium text-gray-800">{clinician.name}</div>
                          <div className="text-gray-500 flex justify-between">
                            <span>{clinician.specialty}</span>
                            <span className="text-blue-600">{clinician.availability}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 italic">No clinicians found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Current Meeting Details */}
            {upcomingMeeting && (
              <div className="p-3 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center mb-1">
                  <CalendarIcon className="h-4 w-4 text-blue-600 mr-1.5" />
                  <h3 className="text-xs font-semibold text-gray-800">Current meeting</h3>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">{upcomingMeeting.title}</h4>
                <p className="text-xs text-gray-600 mb-1 flex items-center">
                  <ClockIcon className="h-3 w-3 text-gray-500 mr-1" />
                  {upcomingMeeting.time}
                </p>
                <div className="space-y-0.5">
                  {upcomingMeeting.participants.map((participant, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <UserIcon className="h-3 w-3 text-gray-500 mr-1" />
                      {participant}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Quick Appointment Creation Interface */
          <div className="p-3">
            <div className="flex items-center mb-3">
              <button 
                className="p-1 rounded-md hover:bg-gray-100 mr-2"
                onClick={handleBack}
              >
                <ArrowLeftIcon className="h-4 w-4 text-gray-500" />
              </button>
              <h4 className="text-xs font-semibold text-gray-800">New appointment</h4>
            </div>
            
            {selectedClinician && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md">
                <div className="font-medium text-xs text-gray-800">{selectedClinician.name}</div>
                <div className="text-xs text-gray-600">{selectedClinician.specialty}</div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Patient name</label>
                <input
                  type="text"
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Appointment type</label>
                <select
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  <option>Initial Assessment</option>
                  <option>Follow-up</option>
                  <option>Therapy Session</option>
                  <option>Medication Review</option>
                  <option>Consultation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="block w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                <div className="grid grid-cols-3 gap-1">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      className={`text-xs py-1 px-2 rounded-md border ${selectedTime === time ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button
                variant="secondary"
                onClick={handleCreateAppointment}
                disabled={!selectedClinician || !patientName || !selectedDate || !selectedTime}
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Shortcuts Section */}
      {!showAppointmentCreation && (
        <div className="p-3 bg-gray-50 mt-auto">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => setShortcutsCollapsed(!shortcutsCollapsed)}
          >
            <h4 className="text-xs font-semibold text-gray-700">Shortcuts</h4>
            {shortcutsCollapsed ? (
              <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-3.5 w-3.5 text-gray-500" />
            )}
          </div>
          
          {!shortcutsCollapsed && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 p-1.5 bg-white rounded-md border border-gray-100">
                <span className="text-xs">Command menu</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded text-xs font-medium">⌘/</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 p-1.5 bg-white rounded-md border border-gray-100">
                <span className="text-xs">Mini calendar</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded text-xs font-medium">c</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 p-1.5 bg-white rounded-md border border-gray-100">
                <span className="text-xs">Return to menu</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded text-xs font-medium">Esc</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 p-1.5 bg-white rounded-md border border-gray-100">
                <span className="text-xs">Go to date</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded text-xs font-medium">g</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Get status color based on appointment status
const getStatusColor = (status: string) => {
  switch(status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Checked In': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default CalendarDetails;
