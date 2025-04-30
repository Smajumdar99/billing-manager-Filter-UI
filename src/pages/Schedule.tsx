import React, { FC, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PlusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  InformationCircleIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  PhoneIcon,
  CheckIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  SwatchIcon,
  MapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { TopNavigationBar, MainNavigationBar } from '../components/old-ui'

// FullCalendar imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core'

// Import custom styles for FullCalendar
import '../styles/fullcalendar-custom.css'

// Import our new shadcn-style components
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectItem } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Tooltip } from '../components/ui/tooltip'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'
import { DataTable } from '../components/organisms/DataTable'  // Updated import path
import { ScheduleFilters } from '../components/organisms/ScheduleFilters/schedule-filters'
import { ScheduleHeader } from '../components/organisms/ScheduleHeader'
import { ScheduleCalendar } from '../components/organisms/ScheduleCalendar'
import { AppointmentModal } from '../components/organisms/AppointmentModal'
import { AppointmentSearchResults } from '@/components/organisms/AppointmentSearchResults/appointment-search-results'
import { SearchFilters } from '@/components/molecules/AppointmentSearch/appointment-search'

// Types for our calendar
interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  provider: string;
  patient: string;
  type: 'Individual' | 'Group' | 'Crisis';
  room?: string;
  color?: string;
  patientInfo?: {
    age?: number;
    gender?: string;
    mrn?: string;
    insuranceStatus?: string;
    lastVisit?: string;
  };
  // New fields
  date?: string;
  isAllDay?: boolean;
  duration?: string;
  encounterType?: string;
  program?: string;
  billingProgram?: string;
  supervisingProvider?: string;
  status?: string;
  comments?: string;
  isRepeating?: boolean;
  repeatFrequency?: string;
  repeatInterval?: string;
  isTelehealth?: boolean;
  printAppointmentSlip?: boolean;
  hasChart?: boolean;
  hasLink?: boolean;
  category?: string;
}

interface Patient {
  id: string;
  name: string;
}

// Appointment details modal
interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit: () => void;
  onDelete: () => void;
}

const AppointmentDetailsModal: FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !appointment) return null;

  // Determine icon based on appointment type
  const TypeIcon = appointment.type === 'Individual' 
    ? UserIcon 
    : appointment.type === 'Group' 
      ? UserGroupIcon 
      : BoltIcon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-800">Appointment Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{appointment.title}</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-medium text-gray-700">{appointment.startTime} - {appointment.endTime}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Provider</div>
                <div className="font-medium text-gray-700">{appointment.provider}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <UserGroupIcon className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Patient</div>
                <div className="font-medium text-gray-700">{appointment.patient}</div>
              </div>
            </div>
            
            {appointment.room && (
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Room</div>
                  <div className="font-medium text-gray-700">{appointment.room}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <TypeIcon className={`w-5 h-5 mr-3 ${
                appointment.type === 'Individual' ? 'text-blue-500' : 
                appointment.type === 'Group' ? 'text-purple-500' : 
                'text-red-500'
              }`} />
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium text-gray-700">{appointment.type}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom event component with tooltip
const EventWithTooltip: FC<{
  title: string;
  startTime: string;
  endTime: string;
  patient: string;
  room?: string;
  type: 'Individual' | 'Group' | 'Crisis';
  provider: string;
  patientInfo?: {
    age?: number;
    gender?: string;
    mrn?: string;
    insuranceStatus?: string;
    lastVisit?: string;
  };
}> = ({ title, startTime, endTime, patient, room, type, provider, patientInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);
  
  // Determine indicator color based on appointment type
  const indicatorColor = type === 'Individual' 
    ? 'bg-blue-400' 
    : type === 'Group' 
      ? 'bg-purple-400' 
      : 'bg-red-400';
  
  // Determine icon based on appointment type
  const TypeIcon = type === 'Individual' 
    ? UserIcon 
    : type === 'Group' 
      ? UserGroupIcon 
      : BoltIcon;
  
  return (
    <div 
      className="h-full relative flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={eventRef}
    >
      {/* Type indicator bar */}
      <div className={`${indicatorColor} w-1.5 h-full rounded-l-sm`}></div>
      
      {/* Event content */}
      <div className="flex-1 p-1 flex flex-col justify-between min-w-0">
        {/* Event title with text truncation */}
        <div className="font-medium text-xs truncate max-w-full" title={title}>
          {title}
        </div>
        
        {/* Patient and room info with text truncation */}
        <div className="text-xs opacity-90 truncate max-w-full" title={`${startTime} • ${patient}${room ? ` • ${room}` : ''}`}>
          {startTime} • {patient}{room && <span className="opacity-75"> • {room}</span>}
        </div>
        
        {/* Type icon indicator - increased size */}
        <div className="absolute top-0.5 right-0.5 flex items-center">
          <TypeIcon className={`w-4 h-4 ${
            type === 'Individual' ? 'text-blue-500' : 
            type === 'Group' ? 'text-purple-500' : 
            'text-red-500'
          }`} />
        </div>
      </div>
      
      {/* Fixed position tooltip that appears on hover */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-1 z-[10000]">
          <div className="bg-white text-gray-800 text-xs rounded-md py-2 px-3 shadow-lg border border-gray-200 w-64">
            <div className="font-semibold text-sm mb-1.5 text-gray-900">{title}</div>
            
            <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
              <div className="text-gray-500 font-medium">Time:</div>
              <div className="font-medium">{startTime} - {endTime}</div>
              
              <div className="text-gray-500 font-medium">Type:</div>
              <div className="flex items-center">
                <TypeIcon className={`w-3.5 h-3.5 mr-1.5 ${
                  type === 'Individual' ? 'text-blue-500' : 
                  type === 'Group' ? 'text-purple-500' : 
                  'text-red-500'
                }`} />
                <span className="font-medium">{type}</span>
              </div>
              
              <div className="text-gray-500 font-medium">Provider:</div>
              <div className="font-medium">{provider}</div>
              
              {room && (
                <>
                  <div className="text-gray-500 font-medium">Room:</div>
                  <div className="font-medium">{room}</div>
                </>
              )}
            </div>
            
            {patientInfo && type !== 'Group' && (
              <>
                <div className="mt-2 mb-1 font-medium text-gray-700 border-b border-gray-200 pb-1">
                  Patient Information
                </div>
                <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                  <div className="text-gray-500 font-medium">Patient:</div>
                  <div className="font-medium">{patient}</div>
                  
                  {patientInfo.mrn && (
                    <>
                      <div className="text-gray-500 font-medium">MRN:</div>
                      <div>{patientInfo.mrn}</div>
                    </>
                  )}
                  
                  {patientInfo.age && patientInfo.gender && (
                    <>
                      <div className="text-gray-500 font-medium">Demographics:</div>
                      <div>{patientInfo.age} y/o {patientInfo.gender}</div>
                    </>
                  )}
                  
                  {patientInfo.insuranceStatus && (
                    <>
                      <div className="text-gray-500 font-medium">Insurance:</div>
                      <div className={`${patientInfo.insuranceStatus === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                        {patientInfo.insuranceStatus}
                      </div>
                    </>
                  )}
                  
                  {patientInfo.lastVisit && (
                    <>
                      <div className="text-gray-500 font-medium">Last Visit:</div>
                      <div>{patientInfo.lastVisit}</div>
                    </>
                  )}
                </div>
              </>
            )}
            
            {type === 'Group' && (
              <div className="mt-2 text-gray-600 italic">
                Group session with multiple patients
              </div>
            )}
            
            <div className="mt-2 pt-1 border-t border-gray-100 text-xs text-blue-600 font-medium">
              Click for more details
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add this interface near the top with other interfaces
interface StaffMember {
  name: string;
  role: string;
  appointments: Appointment[];
}

// Add this function before the Schedule component
const groupAppointmentsByStaff = (appointments: Appointment[]): StaffMember[] => {
  // Mock staff roles - in real app, this would come from your backend
  const staffRoles: Record<string, string> = {
    'Sreedhar Reddy': 'Clinician',
    'Dr. Smith': 'Psychiatrist',
    'Dr. Johnson': 'Emergency Care',
    'Dr. Williams': 'Therapist'
  };

  const staffMap = new Map<string, StaffMember>();
  
  appointments.forEach(appointment => {
    const { provider } = appointment;
    if (!staffMap.has(provider)) {
      staffMap.set(provider, {
        name: provider,
        role: staffRoles[provider] || 'Staff',
        appointments: []
      });
    }
    staffMap.get(provider)?.appointments.push(appointment);
  });

  return Array.from(staffMap.values());
};

/**
 * Schedule Page Component
 * 
 * Displays a calendar interface for scheduling appointments using FullCalendar
 */
const Schedule: FC = () => {
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string | undefined>(undefined);
  const [selectedEndTime, setSelectedEndTime] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | 'all'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDetailsModalOpen, setIsAppointmentDetailsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'agenda'>('timeGridDay');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    personApptsOnly: false,
    providerResvOnly: false,
    providerInOfficeResvOnly: false,
    groupApptsOnly: false,
    apptsInNextHours: 3,
    filterByHours: false,
    includeInactivePrograms: false,
    includeInactiveProviders: false
  });
  
  // Search states for Programs and Providers
  const [programSearch, setProgramSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  
  // Sample data for demonstration
  const providers = [
    { id: '1', name: 'Sreedhar Reddy', count: 4 },
    { id: '2', name: 'Dr. Smith', count: null },
    { id: '3', name: 'Dr. Johnson', count: null },
    { id: '4', name: 'Dr. Williams', count: null },
    { id: '5', name: 'QADA QCQC', count: null },
    { id: '6', name: 'Qqq Aaaa', count: 2 },
    { id: '7', name: 'Radiologist doctor', count: 3 },
    { id: '8', name: 'Rheumato logist', count: 62 },
    { id: '9', name: 'Rohith Palem', count: null },
    { id: '10', name: 'Rose Kate', count: 1 },
    { id: '11', name: 'Sairam Rayavarapu', count: 34 },
    { id: '12', name: 'SCI Specialist', count: 4 },
    { id: '13', name: 'Skin Doctor', count: 2 },
    { id: '14', name: 'Sleep Doctor', count: 11 },
    { id: '15', name: 'SM Specialist', count: 22 },
    { id: '16', name: 'sravan ren', count: 2 }
  ];
  
  const programs = [
    { id: '1', name: 'All Programs' },
    { id: '2', name: '1111ADiamond1111 Facility' },
    { id: '3', name: 'A-AADO' },
    { id: '4', name: 'A-METH' },
    { id: '5', name: 'ABCXYZ' }
  ];
  
  const patients: Patient[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Johnson' },
    { id: '4', name: 'Emily Davis' }
  ];
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      personApptsOnly: false,
      providerResvOnly: false,
      providerInOfficeResvOnly: false,
      groupApptsOnly: false,
      apptsInNextHours: 3,
      filterByHours: false,
      includeInactivePrograms: false,
      includeInactiveProviders: false
    });
    setProgramSearch('');
    setProviderSearch('');
  };
  
  // Convert appointments to FullCalendar events
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Call/Text/CADC SUD Crisis or Intervention',
      startTime: '06:00',
      endTime: '06:20',
      provider: 'Sreedhar Reddy',
      patient: 'John Doe',
      type: 'Individual',
      room: 'Room A',
      patientInfo: {
        age: 42,
        gender: 'Male',
        mrn: 'MRN12345',
        insuranceStatus: 'Active',
        lastVisit: '10/15/2023'
      }
    },
    {
      id: '2',
      title: 'Group Therapy Session',
      startTime: '09:00',
      endTime: '10:00',
      provider: 'Dr. Smith',
      patient: 'Multiple Patients',
      type: 'Group',
      room: 'Conference Room B'
    },
    {
      id: '3',
      title: 'Emergency Consultation',
      startTime: '11:30',
      endTime: '12:00',
      provider: 'Dr. Johnson',
      patient: 'Jane Smith',
      type: 'Crisis',
      room: 'Emergency Room 1',
      patientInfo: {
        age: 35,
        gender: 'Female',
        mrn: 'MRN54321',
        insuranceStatus: 'Pending',
        lastVisit: '09/22/2023'
      }
    },
    {
      id: '4',
      title: 'Follow-up Appointment',
      startTime: '13:00',
      endTime: '13:30',
      provider: 'Dr. Williams',
      patient: 'Robert Johnson',
      type: 'Individual',
      room: 'Room C',
      patientInfo: {
        age: 28,
        gender: 'Male',
        mrn: 'MRN67890',
        insuranceStatus: 'Active',
        lastVisit: '11/05/2023'
      }
    },
    {
      id: '5',
      title: 'Medication Review',
      startTime: '14:15',
      endTime: '14:45',
      provider: 'Sreedhar Reddy',
      patient: 'Emily Davis',
      type: 'Individual',
      room: 'Room A',
      patientInfo: {
        age: 52,
        gender: 'Female',
        mrn: 'MRN24680',
        insuranceStatus: 'Active',
        lastVisit: '10/30/2023'
      }
    },
    {
      id: '6',
      title: 'Family Therapy Session',
      startTime: '15:30',
      endTime: '16:30',
      provider: 'Dr. Smith',
      patient: 'Johnson Family',
      type: 'Group',
      room: 'Conference Room A'
    }
  ]);
  
  // Convert appointments to FullCalendar events
  const getEvents = (): EventInput[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    return appointments.map(appointment => {
      // Parse start and end times
      const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
      const [endHour, endMinute] = appointment.endTime.split(':').map(Number);
      
      // Create Date objects for start and end
      const start = new Date(year, month, day, startHour, startMinute);
      const end = new Date(year, month, day, endHour, endMinute);
      
      // Determine color and className based on appointment type
      let backgroundColor = '#bfdbfe'; // pastel blue
      let borderColor = '#93c5fd';
      let textColor = '#1e40af';
      let className = 'event-individual';
      
      if (appointment.type === 'Group') {
        backgroundColor = '#ddd6fe'; // pastel purple
        borderColor = '#c4b5fd';
        textColor = '#5b21b6';
        className = 'event-group';
      } else if (appointment.type === 'Crisis') {
        backgroundColor = '#fecaca'; // pastel red
        borderColor = '#fca5a5';
        textColor = '#b91c1c';
        className = 'event-crisis';
      }
      
      return {
        id: appointment.id,
        title: appointment.title,
        start,
        end,
        backgroundColor,
        borderColor,
        textColor,
        className,
        extendedProps: {
          provider: appointment.provider,
          patient: appointment.patient,
          type: appointment.type,
          room: appointment.room,
          patientInfo: appointment.patientInfo
        },
        resourceId: providers.find(p => p.name === appointment.provider)?.id
      };
    });
  };
  
  // Resources for FullCalendar (providers)
  const resources = providers.map(provider => ({
    id: provider.id,
    title: provider.name
  }));
  
  // Handle date selection in calendar
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;
    
    // Format times for the modal
    const startHours = startDate.getHours().toString().padStart(2, '0');
    const startMinutes = startDate.getMinutes().toString().padStart(2, '0');
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    setSelectedDate(startDate);
    setSelectedStartTime(`${startHours}:${startMinutes}`);
    setSelectedEndTime(`${endHours}:${endMinutes}`);
    setIsNewAppointmentModalOpen(true);
  };
  
  // Handle event click in calendar
  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const appointment = appointments.find(a => a.id === eventId);
    
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsAppointmentDetailsModalOpen(true);
    }
  };
  
  // Handle saving a new appointment
  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    // Create a new appointment with all the provided data
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString() // Simple ID generation
    };
    
    // Add to appointments list
    setAppointments([...appointments, newAppointment]);
    
    // If print appointment slip is requested, handle that
    if (newAppointment.printAppointmentSlip) {
      console.log('Printing appointment slip for:', newAppointment.title);
      // In a real app, this would trigger a print function
    }
  };
  
  // Handle deleting an appointment
  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
      setIsAppointmentDetailsModalOpen(false);
      setSelectedAppointment(null);
    }
  };
  
  // Handle editing an appointment
  const handleEditAppointment = () => {
    if (!selectedAppointment) return;
    
    // Close details modal
    setIsAppointmentDetailsModalOpen(false);
    
    // Set all the appointment data for the edit modal
    setSelectedDate(selectedAppointment.date ? new Date(selectedAppointment.date) : undefined);
    setSelectedStartTime(selectedAppointment.startTime);
    setSelectedEndTime(selectedAppointment.endTime);
    setSelectedProvider(selectedAppointment.provider);
    
    // Open the edit modal
    setIsNewAppointmentModalOpen(true);
  };
  
  // Handle navigation buttons
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };
  
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };
  
  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };
  
  // Get current date title
  const getHeaderTitle = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const view = api.view;
      const date = api.getDate();
      
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
      };

      switch (view.type) {
        case 'timeGridDay':
          return formatDate(date);
        case 'timeGridWeek':
          const start = view.currentStart;
          const end = view.currentEnd;
          return `${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(start)} - ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(end.getTime() - 86400000))}`;
        case 'dayGridMonth':
          return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
        default:
          return api.view.title;
      }
    }
    return '';
  };
  
  // Get filtered events
  const getFilteredEvents = (): EventInput[] => {
    const events = getEvents();
    
    // Apply filters
    return events.filter(event => {
      const extendedProps = event.extendedProps as {
        type: 'Individual' | 'Group' | 'Crisis';
        provider: string;
        patient: string;
        room?: string;
      };
      
      if (!extendedProps) return true;
      
      const { type, provider, patient, room } = extendedProps;
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          patient.toLowerCase().includes(query) ||
          provider.toLowerCase().includes(query) ||
          (room && room.toLowerCase().includes(query)) ||
          (event.title ? event.title.toLowerCase().includes(query) : false);
        
        if (!matchesSearch) return false;
      }
      
      // Person appointments only
      if (filters.personApptsOnly && type !== 'Individual') {
        return false;
      }
      
      // Group appointments only
      if (filters.groupApptsOnly && type !== 'Group') {
        return false;
      }
      
      // Provider reservations only (simplified logic)
      if (filters.providerResvOnly && patient !== '') {
        return false;
      }
      
      // Provider in office reservations only (simplified logic)
      if (filters.providerInOfficeResvOnly && patient !== '') {
        return false;
      }
      
      // Filter by hours
      if (filters.filterByHours) {
        const now = new Date();
        const eventStart = new Date(event.start as string);
        const hoursDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 0 || hoursDiff > filters.apptsInNextHours) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Add column definitions for agenda view
  const agendaColumnDefs = [
    {
      headerName: 'Time',
      field: 'time',
      colId: 'time',
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
          <div className="text-sm text-gray-900">
            {params.data.startTime} - {params.data.endTime}
          </div>
        </div>
      )
    },
    {
      headerName: 'Title',
      field: 'title',
      colId: 'title',
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className={`w-1 h-6 rounded-sm ${
            params.data.type === 'Individual' ? 'bg-blue-400' :
            params.data.type === 'Group' ? 'bg-purple-400' :
            'bg-red-400'
          }`} />
          <div>
            <div className="text-sm font-medium text-gray-900">{params.data.title}</div>
            <div className="text-xs text-gray-500">{params.data.patient}</div>
          </div>
        </div>
      )
    },
    {
      headerName: 'Category',
      field: 'category',
      colId: 'category',
      width: 180,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {params.data.category || 'AdMission'}
          </span>
          <div className="flex gap-1">
            {params.data.hasChart && (
              <Tooltip content="Has Chart" side="top">
                <DocumentTextIcon className="h-4 w-4 text-blue-500" />
              </Tooltip>
            )}
            {params.data.hasLink && (
              <Tooltip content="Has Link" side="top">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-500" />
              </Tooltip>
            )}
          </div>
        </div>
      )
    },
    {
      headerName: 'Type',
      field: 'type',
      colId: 'type',
      width: 130,
      cellRenderer: (params: any) => {
        const TypeIcon = params.data.type === 'Individual' 
          ? UserIcon 
          : params.data.type === 'Group' 
            ? UserGroupIcon 
            : BoltIcon;
        
        return (
          <div className="flex items-center gap-2">
            <TypeIcon className={`h-4 w-4 ${
              params.data.type === 'Individual' ? 'text-blue-500' :
              params.data.type === 'Group' ? 'text-purple-500' :
              'text-red-500'
            }`} />
            <span className="text-sm text-gray-600">{params.data.type}</span>
          </div>
        );
      }
    },
    {
      headerName: 'Person',
      field: 'provider',
      colId: 'provider',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{params.data.provider}</span>
        </div>
      )
    },
    {
      headerName: 'Room',
      field: 'room',
      colId: 'room',
      width: 120,
      cellRenderer: (params: any) => (
        params.data.room ? (
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{params.data.room}</span>
          </div>
        ) : null
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      colId: 'status',
      width: 120,
      cellRenderer: (params: any) => (
        <Badge 
          variant="outline" 
          className={cn(
            "text-sm h-6",
            params.data.status === 'Scheduled' ? "bg-green-50 text-green-700 border-green-200" :
            params.data.status === 'Cancelled' ? "bg-red-50 text-red-700 border-red-200" :
            "bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          {params.data.status || 'Scheduled'}
        </Badge>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      colId: 'actions',
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => {
              setSelectedAppointment(params.data);
              setIsAppointmentDetailsModalOpen(true);
            }}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => handleEditAppointment()}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  // Add new state for color schemes
  const [activeColorScheme, setActiveColorScheme] = useState<'category' | 'facility' | 'location'>('category');

  // Color scheme configurations
  const colorSchemes = {
    category: {
      icon: SwatchIcon,
      label: 'Category Color Scheme',
      colors: ['#60A5FA', '#C084FC', '#F87171'],
      iconColor: 'text-blue-500',
      eventColors: {
        individual: { bg: '#bfdbfe', border: '#93c5fd', text: '#1e40af' },
        group: { bg: '#ddd6fe', border: '#c4b5fd', text: '#5b21b6' },
        crisis: { bg: '#fecaca', border: '#fca5a5', text: '#b91c1c' }
      }
    },
    facility: {
      icon: BuildingOfficeIcon,
      label: 'Facility Color Scheme',
      colors: ['#34D399', '#A78BFA', '#FB923C'],
      iconColor: 'text-green-500',
      eventColors: {
        individual: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
        group: { bg: '#ede9fe', border: '#c4b5fd', text: '#5b21b6' },
        crisis: { bg: '#ffedd5', border: '#fdba74', text: '#9a3412' }
      }
    },
    location: {
      icon: MapIcon,
      label: 'Location Color Scheme',
      colors: ['#F472B6', '#FBBF24', '#2DD4BF'],
      iconColor: 'text-pink-500',
      eventColors: {
        individual: { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
        group: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
        crisis: { bg: '#ccfbf1', border: '#5eead4', text: '#115e59' }
      }
    }
  };

  // Update calendar when color scheme changes
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, [activeColorScheme]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={(searchTerm) => {
          setSearchQuery(searchTerm);
          setShowSearchResults(true);
          setSearchFilters({
            query: searchTerm,
            appointmentTypes: [],
            status: [],
            providers: [],
            facilities: [],
            sortBy: 'date',
            sortOrder: 'asc'
          });
        }}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Schedule"
        onNavigate={(itemName) => {
          console.log('Navigate to:', itemName);
          
          if (itemName === 'Schedule') {
            navigate('/schedule');
          } else if (itemName === 'Inbox') {
            navigate('/inbox');
          } else if (itemName === 'Dashboard') {
            navigate('/dashboard');
          } else if (itemName === 'Settings') {
            navigate('/settings');
          } else if (itemName === 'Clients') {
            navigate('/old-ui');
          }
        }}
      />

      {/* Calendar Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Fixed width */}
        <div className="w-[280px] h-full border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <ScheduleFilters
            filters={filters}
            onFilterChange={setFilters}
            providers={providers}
            programs={programs}
            onProviderSelect={(providerId) => {
              const provider = providers.find(p => p.id === providerId);
              if (provider) {
                setSelectedProvider(provider.name);
              }
            }}
            onProgramSelect={(programId) => {
              console.log('Selected program:', programId);
            }}
            calendarRef={calendarRef}
          />
        </div>

        {/* Main Calendar Area - Flex grow */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Schedule Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <ScheduleHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={async (filters) => {
                setShowSearchResults(true);
                setSearchFilters({
                  query: searchQuery,
                  appointmentTypes: [],
                  status: [],
                  providers: [],
                  facilities: [],
                  sortBy: 'date',
                  sortOrder: 'asc'
                });
              }}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleToday={handleToday}
              getHeaderTitle={getHeaderTitle}
              currentView={currentView}
              setCurrentView={setCurrentView}
              calendarRef={calendarRef}
              onNewAppointment={() => setIsNewAppointmentModalOpen(true)}
              activeColorScheme={activeColorScheme}
              setActiveColorScheme={setActiveColorScheme}
              colorScheme={{
                eventColors: {
                  individual: { bg: '#bfdbfe', border: '#93c5fd', text: '#1e40af' },
                  group: { bg: '#ddd6fe', border: '#c4b5fd', text: '#5b21b6' },
                  crisis: { bg: '#fecaca', border: '#fca5a5', text: '#b91c1c' }
                }
              }}
            />
          </div>

          {/* Calendar/Agenda View - Flex grow */}
          <div className="flex-1 overflow-hidden p-4">
            {currentView === 'agenda' ? (
              <div className="h-full overflow-auto">
                <div className="space-y-6">
                  {groupAppointmentsByStaff(appointments).map((staff) => (
                    <div key={staff.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Staff Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">{staff.name}</h3>
                        <p className="text-xs text-gray-500">{staff.role}</p>
                      </div>
                      
                      {/* Staff Appointments */}
                      <div className="divide-y divide-gray-100">
                        {staff.appointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-1 h-6 rounded-sm ${
                                  appointment.type === 'Individual' ? 'bg-blue-400' :
                                  appointment.type === 'Group' ? 'bg-purple-400' :
                                  'bg-red-400'
                                }`} />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {appointment.startTime} - {appointment.endTime}
                                    </span>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "text-xs",
                                        appointment.type === 'Individual' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        appointment.type === 'Group' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                        "bg-red-50 text-red-700 border-red-200"
                                      )}
                                    >
                                      {appointment.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{appointment.title}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" />
                                      {appointment.patient}
                                    </span>
                                    {appointment.room && (
                                      <span className="flex items-center gap-1">
                                        <MapPinIcon className="h-3 w-3" />
                                        {appointment.room}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                  {appointment.status || 'Scheduled'}
                                </Badge>
                                <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsAppointmentDetailsModalOpen(true);
                                }}>
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full">
                <ScheduleCalendar
                  calendarRef={calendarRef}
                  events={getFilteredEvents()}
                  resources={resources}
                  currentView={currentView}
                  onDateSelect={handleDateSelect}
                  onEventClick={handleEventClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Results Sidebar - Conditional */}
        {showSearchResults && (
          <div className="w-[384px] border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Search Results</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSearchResults(false);
                  setSearchQuery('');
                  setSearchFilters(null);
                }}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>
            <AppointmentSearchResults
              initialSearchQuery={searchQuery}
              initialFilters={searchFilters}
              onClose={() => {
                setShowSearchResults(false);
                setSearchQuery('');
                setSearchFilters(null);
              }}
            />
          </div>
        )}
      </div>
      
      {/* New Appointment Modal */}
      <AppointmentModal 
        isOpen={isNewAppointmentModalOpen}
        onClose={() => {
          setIsNewAppointmentModalOpen(false);
          setSelectedDate(undefined);
          setSelectedStartTime(undefined);
          setSelectedEndTime(undefined);
        }}
        onSave={handleSaveAppointment}
        providers={providers}
        patients={patients}
        selectedDate={selectedDate}
        selectedProvider={selectedProvider !== 'all' ? selectedProvider : undefined}
        startTime={selectedStartTime}
        endTime={selectedEndTime}
      />
      
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal 
        isOpen={isAppointmentDetailsModalOpen}
        onClose={() => {
          setIsAppointmentDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  )
}

export default Schedule 