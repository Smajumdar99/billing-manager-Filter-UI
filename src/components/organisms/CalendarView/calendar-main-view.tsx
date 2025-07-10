import React, { useState, useRef, useEffect } from 'react';
import { 
  Cog6ToothIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ArrowUpOnSquareStackIcon,
  PrinterIcon,
  ArrowsRightLeftIcon,
  SwatchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  UserIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  QueueListIcon,
  ViewColumnsIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  
} from "@/components/ui/dropdown-menu";
import WeekView from '../../molecules/WeekView/week-view';
import MonthView from '../../molecules/MonthView/month-view';
import { DataTable } from '../DataTable';
import EventPopover from '../../atoms/EventPopover/event-popover';
import { useNavigate } from 'react-router-dom';
import EventTypeBadge from '../../atoms/EventTypeBadge';
import { Button } from '../../atoms/Button/button';

/**
 * CalendarMainView Component
 * 
 * Middle section of the calendar interface showing the main calendar view with time slots
 */
interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  type?: 'Individual' | 'Group' | 'Provider';
  backgroundColor?: string;
  mobile?: string;
  home?: string;
  status?: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed';
  appointmentType?: string;
  location?: string;
  notes?: string;
}

interface FilterOptions {
  personAppts: boolean;
  providerReserv: boolean;
  groupAppts: boolean;
  nextHours: boolean;
  hoursValue: number;
}

interface Provider {
  id: string;
  value: string;
  label: string;
  status: 'active' | 'inactive';
  clientCount: number;
}

interface CalendarMainViewProps {
  selectedDate: Date;
  view: 'day' | 'week' | 'month' | 'agenda';
  onViewChange: (view: 'day' | 'week' | 'month' | 'agenda') => void;
  onDateChange: (date: Date) => void;
  onSettingsClick: () => void;
  onViewEvent?: (event: Event) => void;
  events?: Event[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedProviders?: string[];
  availableProviders?: Provider[];
  selectedPatients?: string[];
  availablePatients?: { id: string; value: string; label: string; status: string }[];
  activeTab: 'provider' | 'room' | 'patient';
  onTabChange: (tab: 'provider' | 'room' | 'patient') => void;
}

type ColorScheme = {
  facility: string;
  category: string;
  location: string;
};

// Add new types for agenda data
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'in-progress';

// Add more specific types
type AppointmentType = 'Initial Assessment' | 'Follow-up' | 'Medication Review' | 'Group Therapy' | 'Individual Therapy' | 'Crisis Intervention' | 'Telehealth';
type Program = 'Adult Mental Health' | 'Substance Use' | 'Child & Adolescent' | 'Crisis Services' | 'Dual Diagnosis' | 'IOP' | 'MAT Program';
type Category = 'Urgent' | 'Routine' | 'New Patient' | 'Established' | 'Walk-in';

interface AgendaEventType {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  facility: string;
  program: Program;
  appointmentType: AppointmentType;
  category: Category;
  person: string;
  copay: number;
  insuranceVerified?: boolean;
  paperworkComplete?: boolean;
  status: AppointmentStatus;
}

// Helper function to safely format dates
const formatDate = (dateString: string, formatStr: string): string => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

// Helper function to safely format time range
const formatTimeRange = (startTime: string, endTime: string, isAllDay?: boolean): string => {
  try {
    if (isAllDay) return 'All Day';
    if (!startTime || !endTime) return '-';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return '-';
  }
};

// Helper to get standard background color for event types
const getEventBgColor = (type?: string) => {
  switch (type) {
    case 'Group':
      return '#E6F9ED'; // soft green
    case 'Individual':
      return '#E5EDFF'; // soft blue
    case 'Provider':
      return '#F3E8FF'; // soft purple
    default:
      return '#F3F4F6'; // soft gray
  }
};

const EventCard: React.FC<{ 
  event: Event;
  onViewEvent?: (event: Event) => void;
  onEditEvent?: (event: Event) => void;
}> = ({ event, onViewEvent, onEditEvent }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'Individual':
        return <UserIcon className="w-4 h-4 text-gray-600" />;
      case 'Group':
        return <UserGroupIcon className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  // Use standard background color for event type
  const bgColor = getEventBgColor(event.type);

  const eventContent = (
    <div 
      className="mx-2 my-1 p-2 rounded border text-xs overflow-hidden cursor-pointer bg-white flex flex-col gap-1 min-w-0"
      style={{ 
        backgroundColor: bgColor,
        borderColor: event.type === 'Individual' ? '#C7D2FE' : 
                    event.type === 'Group' ? '#A7F3D0' : 
                    event.type === 'Provider' ? '#D8B4FE' : '#E5E7EB',
      }}
    >
      {/* Badge and title row */}
      <div className="flex items-center gap-2 min-w-0">
        <EventTypeBadge type={event.type} />
        {getEventIcon()}
        <div className="font-medium truncate flex-1">{event.title}</div>
      </div>
      {/* Time and phone row */}
      <div className="text-gray-600 flex items-center gap-2 min-w-0">
        <span>{event.startTime} - {event.endTime}</span>
        {event.mobile && (
          <span className="flex items-center gap-1 text-blue-600">
            <PhoneIcon className="w-3 h-3" />
            {event.mobile}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <EventPopover event={event} onEdit={onEditEvent} onView={onViewEvent}>
      {eventContent}
    </EventPopover>
  );
};

export const CalendarMainView: React.FC<CalendarMainViewProps> = ({
  selectedDate,
  view,
  onViewChange,
  onDateChange,
  onSettingsClick,
  onViewEvent,
  events = [],
  searchQuery = '',
  onSearchChange,
  selectedProviders = [],
  availableProviders = [],
  selectedPatients = [],
  availablePatients = [],
  activeTab,
  onTabChange
}) => {
  // State for internal search functionality if no external handler provided
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  // State for tab functionality - Provider selected by default
  // const [activeTab, setActiveTab] = useState<'provider' | 'room' | 'patient'>('provider');
  
  // State for advanced search overlay
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    serviceType: 'Any Service Type',
    dateFrom: '',
    dateTo: '',
    program: 'All Programs',
    status: 'All Statuses',
    provider: 'All Providers'
  });
  
  // State for filter functionality
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    personAppts: false,
    providerReserv: false,
    groupAppts: false,
    nextHours: false,
    hoursValue: 3
  });
  
  // State for mobile hamburger menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Use external search state if provided, otherwise use internal state
  const currentSearchQuery = searchQuery || internalSearchQuery;
  const handleSearchChange = onSearchChange || setInternalSearchQuery;
  
  // Provider tab state
  const [activeProviderId, setActiveProviderId] = useState<string>('');
  
  // Provider layout preference state
  const [providerLayoutMode, setProviderLayoutMode] = useState<'tabs' | 'vertical' | 'columns'>('tabs');
  
  // Sample provider data (will be replaced by props)
  const defaultProviders: Provider[] = [
    { id: 'sarah_wilson', value: 'sarah_wilson', label: 'Sarah Wilson, LCSW', status: 'active', clientCount: 23 },
    { id: 'michael_chen', value: 'michael_chen', label: 'Michael Chen, LPC', status: 'active', clientCount: 18 },
    { id: 'emily_rodriguez', value: 'emily_rodriguez', label: 'Emily Rodriguez, LMFT', status: 'active', clientCount: 15 },
    { id: 'maria_garcia', value: 'maria_garcia', label: 'Maria Garcia, LMHC', status: 'active', clientCount: 31 },
    { id: 'david_kim', value: 'david_kim', label: 'David Kim, PhD', status: 'active', clientCount: 12 }
  ];
  
  // Get providers to display (either from props or default)
  const providersToShow = availableProviders.length > 0 ? availableProviders : defaultProviders;
  const selectedProvidersList = selectedProviders.length > 0 ? selectedProviders : [defaultProviders[0]?.value || ''];
  
  // Filter providers to show only selected ones
  const displayProviders = providersToShow.filter(provider => 
    selectedProvidersList.includes(provider.value)
  );
  
  // Determine effective layout mode - always use columns for Day view if multiple providers
  const getEffectiveLayoutMode = () => {
    if (view === 'day' && displayProviders.length > 0) {
      return 'columns';
    }
    return providerLayoutMode;
  };
  
  const effectiveLayoutMode = getEffectiveLayoutMode();
  
  // Set first provider as active by default
  useEffect(() => {
    if (!activeProviderId && selectedProvidersList.length > 0) {
      setActiveProviderId(selectedProvidersList[0]);
    }
  }, [selectedProvidersList, activeProviderId]);
  
  // Get active provider details
  const activeProvider = providersToShow.find(p => p.value === activeProviderId);
  
  // Generate time slots for the day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return `${hour} ${ampm}`;
  });

  // Handle navigation between dates
  const goToNextDate = () => {
    switch (view) {
      case 'day':
        onDateChange(addDays(selectedDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(selectedDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(selectedDate, 1));
        break;
    }
  };

  const goToPrevDate = () => {
    switch (view) {
      case 'day':
        onDateChange(subDays(selectedDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(selectedDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(selectedDate, 1));
        break;
    }
  };

  const goToToday = () => {
    // Set date to today and switch to day view
    onDateChange(new Date());
    onViewChange('day');
  };

  // Helper to check if selectedDate is today
  const isTodayActive = () => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();
  };

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    return filters.personAppts || filters.providerReserv || filters.groupAppts || filters.nextHours;
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      personAppts: false,
      providerReserv: false,
      groupAppts: false,
      nextHours: false,
      hoursValue: 3
    });
  };

  // Helper function to check if event is within next hours
  const isWithinNextHours = (eventStartTime: string, hours: number): boolean => {
    try {
      const now = new Date();
      const eventTime = new Date(eventStartTime);
      const timeDiff = eventTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff >= 0 && hoursDiff <= hours;
    } catch {
      return false;
    }
  };

  // Filter events based on search query and filter options
  const filteredEvents = events.filter(event => {
    // Apply search filter first
    if (currentSearchQuery) {
      const searchLower = currentSearchQuery.toLowerCase();
      const matchesSearch = (
        event.title.toLowerCase().includes(searchLower) ||
        (event.appointmentType && event.appointmentType.toLowerCase().includes(searchLower)) ||
        (event.location && event.location.toLowerCase().includes(searchLower)) ||
        (event.notes && event.notes.toLowerCase().includes(searchLower))
      );
      if (!matchesSearch) return false;
    }

    // Apply type filters if any are active
    if (hasActiveFilters()) {
      let matchesTypeFilter = false;
      
      if (filters.personAppts && event.type === 'Individual') {
        matchesTypeFilter = true;
      }
      if (filters.providerReserv && event.type === 'Provider') {
        matchesTypeFilter = true;
      }
      if (filters.groupAppts && event.type === 'Group') {
        matchesTypeFilter = true;
      }
      
      // Apply time filter if active
      if (filters.nextHours && !isWithinNextHours(event.startTime, filters.hoursValue)) {
        return false;
      }
      
      // If type filters are active but no match, exclude the event
      if ((filters.personAppts || filters.providerReserv || filters.groupAppts) && !matchesTypeFilter) {
        return false;
      }
      
      // If only time filter is active and event matches time, include it
      if (filters.nextHours && !filters.personAppts && !filters.providerReserv && !filters.groupAppts) {
        return true;
      }
      
      return matchesTypeFilter;
    }

    return true;
  });

  // Filter all-day events
  const allDayEvents = filteredEvents.filter(event => event.isAllDay);
  const timeEvents = filteredEvents.filter(event => !event.isAllDay);

  // State for dropdown visibility
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (searchOverlayRef.current && !searchOverlayRef.current.contains(event.target as Node)) {
        setShowSearchOverlay(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get formatted date range for header
  const getHeaderDate = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'MMMM d, yyyy');
      case 'week':
        const weekStart = addDays(selectedDate, -selectedDate.getDay() + 1);
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return format(selectedDate, 'MMMM d, yyyy');
    }
  };

  // Settings menu handlers
  const handleTransfer = () => {
    console.log('Transfer clicked');
    // Implementation here
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    // Implementation here
  };

  const handleExportToOutlook = () => {
    console.log('Export to Outlook clicked');
    // Implementation here
  };

  const [colorSchemes, setColorSchemes] = useState<ColorScheme>({
    facility: '#4F46E5', // Indigo
    category: '#10B981', // Emerald
    location: '#F59E0B', // Amber
  });

  const handleColorSchemeChange = (scheme: 'facility' | 'category' | 'location') => {
    console.log('Color scheme changed to:', scheme);
    // Implementation here
  };

  // Status badge renderer
  const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
    const statusConfig = {
      'scheduled': { bg: 'bg-blue-50', text: 'text-blue-700', icon: ClockIcon },
      'completed': { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircleIcon },
      'cancelled': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircleIcon },
      'no-show': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: XCircleIcon },
      'in-progress': { bg: 'bg-purple-50', text: 'text-purple-700', icon: ClockIcon }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  // Action buttons renderer
  const ActionButtons: React.FC<{ data: AgendaEventType }> = ({ data }) => {
    return (
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
          <EyeIcon className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50">
          <PencilIcon className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
          <TrashIcon className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Mock data for a behavioral health clinic
  const mockAgendaData: AgendaEventType[] = [
    {
      id: '1',
      title: 'Initial Assessment - Depression',
      startTime: new Date(2024, 2, 20, 9, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 10, 30).toISOString(),
      facility: 'Main Campus',
      program: 'Adult Mental Health',
      appointmentType: 'Initial Assessment',
      category: 'New Patient',
      person: 'Sarah Johnson',
      copay: 40.00,
      insuranceVerified: true,
      paperworkComplete: false,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Medication Management',
      startTime: new Date(2024, 2, 20, 10, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 10, 30).toISOString(),
      facility: 'Main Campus',
      program: 'Adult Mental Health',
      appointmentType: 'Medication Review',
      category: 'Established',
      person: 'Michael Chen',
      copay: 25.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Substance Use Assessment',
      startTime: new Date(2024, 2, 20, 11, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 12, 30).toISOString(),
      facility: 'North Center',
      program: 'Substance Use',
      appointmentType: 'Initial Assessment',
      category: 'Urgent',
      person: 'Robert Wilson',
      copay: 50.00,
      insuranceVerified: false,
      paperworkComplete: false,
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Group Therapy - Anxiety Management',
      startTime: new Date(2024, 2, 20, 14, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 15, 30).toISOString(),
      facility: 'West Wing',
      program: 'Adult Mental Health',
      appointmentType: 'Group Therapy',
      category: 'Routine',
      person: 'Multiple Patients',
      copay: 20.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Crisis Intervention',
      startTime: new Date(2024, 2, 20, 9, 30).toISOString(),
      endTime: new Date(2024, 2, 20, 10, 30).toISOString(),
      facility: 'Emergency Unit',
      program: 'Crisis Services',
      appointmentType: 'Crisis Intervention',
      category: 'Urgent',
      person: 'Emily Brown',
      copay: 0.00,
      insuranceVerified: false,
      paperworkComplete: false,
      status: 'completed'
    },
    {
      id: '6',
      title: 'Telehealth - Depression Follow-up',
      startTime: new Date(2024, 2, 20, 13, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 14, 0).toISOString(),
      facility: 'Virtual Care',
      program: 'Adult Mental Health',
      appointmentType: 'Telehealth',
      category: 'Established',
      person: 'Jennifer Martinez',
      copay: 30.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'scheduled'
    },
    {
      id: '7',
      title: 'MAT Program Intake',
      startTime: new Date(2024, 2, 20, 15, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 16, 30).toISOString(),
      facility: 'South Center',
      program: 'MAT Program',
      appointmentType: 'Initial Assessment',
      category: 'New Patient',
      person: 'David Thompson',
      copay: 75.00,
      insuranceVerified: true,
      paperworkComplete: false,
      status: 'scheduled'
    },
    {
      id: '8',
      title: 'Walk-in Assessment',
      startTime: new Date(2024, 2, 20, 10, 45).toISOString(),
      endTime: new Date(2024, 2, 20, 11, 45).toISOString(),
      facility: 'Walk-in Clinic',
      program: 'Crisis Services',
      appointmentType: 'Crisis Intervention',
      category: 'Walk-in',
      person: 'Alex Rodriguez',
      copay: 50.00,
      insuranceVerified: false,
      paperworkComplete: false,
      status: 'in-progress'
    },
    {
      id: '9',
      title: 'Dual Diagnosis Follow-up',
      startTime: new Date(2024, 2, 20, 13, 30).toISOString(),
      endTime: new Date(2024, 2, 20, 14, 30).toISOString(),
      facility: 'Main Campus',
      program: 'Dual Diagnosis',
      appointmentType: 'Follow-up',
      category: 'Established',
      person: 'Patricia Lee',
      copay: 35.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'scheduled'
    },
    {
      id: '10',
      title: 'IOP Group Session',
      startTime: new Date(2024, 2, 20, 9, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 12, 0).toISOString(),
      facility: 'IOP Center',
      program: 'IOP',
      appointmentType: 'Group Therapy',
      category: 'Routine',
      person: 'Multiple Patients',
      copay: 45.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'completed'
    }
  ];

  // Updated agendaColumnDefs to match screenshot structure
  const agendaColumnDefs = [
    {
      headerName: 'Appointment Dt.',
      field: 'startTime',
      cellRenderer: (params: any) => formatDate(params.value, 'MMM dd, yyyy'),
      minWidth: 130,
    },
    {
      headerName: 'Start-End Time',
      field: 'startTime',
      cellRenderer: (params: any) => 
        formatTimeRange(params.data.startTime, params.data.endTime, params.data.isAllDay),
      minWidth: 150,
    },
    {
      headerName: 'Facility',
      field: 'facility',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Program',
      field: 'program',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Appt. Type',
      field: 'appointmentType',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Category',
      field: 'category',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Person',
      field: 'person',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-xs text-gray-600">
            {params.value?.charAt(0) || '?'}
          </div>
          {params.value || '-'}
        </div>
      ),
    },
    {
      headerName: 'CoPay',
      field: 'copay',
      cellRenderer: (params: any) => 
        typeof params.value === 'number' ? `$${params.value.toFixed(2)}` : '-',
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => params.value ? <StatusBadge status={params.value} /> : '-',
      minWidth: 130,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => <ActionButtons data={params.data} />,
      sortable: false,
      filter: false,
      minWidth: 150,
    },
  ];

  // Use mockAgendaData instead of transforming events
  // Filter agenda data based on search query and filter options
  const agendaData = mockAgendaData.filter(appointment => {
    // Apply search filter first
    if (currentSearchQuery) {
      const searchLower = currentSearchQuery.toLowerCase();
      const matchesSearch = (
        appointment.title.toLowerCase().includes(searchLower) ||
        appointment.person.toLowerCase().includes(searchLower) ||
        appointment.program.toLowerCase().includes(searchLower) ||
        appointment.appointmentType.toLowerCase().includes(searchLower) ||
        appointment.category.toLowerCase().includes(searchLower) ||
        appointment.status.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Apply filters if any are active
    if (hasActiveFilters()) {
      let matchesTypeFilter = false;
      
      // Map agenda appointment types to our filter types
      if (filters.personAppts && (appointment.appointmentType.includes('Individual') || appointment.appointmentType.includes('Assessment') || appointment.appointmentType.includes('Follow-up'))) {
        matchesTypeFilter = true;
      }
      if (filters.groupAppts && appointment.appointmentType.includes('Group')) {
        matchesTypeFilter = true;
      }
      // Provider appointments in agenda context might be administrative or provider-specific
      if (filters.providerReserv && appointment.title.includes('Hold')) {
        matchesTypeFilter = true;
      }
      
      // Apply time filter if active
      if (filters.nextHours && !isWithinNextHours(appointment.startTime, filters.hoursValue)) {
        return false;
      }
      
      // If type filters are active but no match, exclude the appointment
      if ((filters.personAppts || filters.providerReserv || filters.groupAppts) && !matchesTypeFilter) {
        return false;
      }
      
      // If only time filter is active and appointment matches time, include it
      if (filters.nextHours && !filters.personAppts && !filters.providerReserv && !filters.groupAppts) {
        return true;
      }
      
      return matchesTypeFilter;
    }

    return true;
  });

  const navigate = useNavigate();

  // Handler for viewing events - Navigate to view appointment screen for all events
  const handleViewEvent = (event: Event) => {
    // Navigate to View Appointment page for all event types
    navigate(`/view-appointment/${event.id}`);
  };

  // Handler for editing events - Navigate to edit appointment screen for all events
  const handleEditEvent = (event: Event) => {
    // Navigate to Edit Appointment page for all event types
    navigate(`/edit-appointment/${event.id}`);
  };

  // Patients to show (either from props or default)
  const defaultPatients = [
    { id: '1', value: 'john_doe', label: 'John Doe', status: 'active' },
    { id: '2', value: 'jane_smith', label: 'Jane Smith', status: 'active' },
    { id: '3', value: 'robert_johnson', label: 'Robert Johnson', status: 'active' },
    { id: '4', value: 'maria_garcia', label: 'Maria Garcia', status: 'active' },
  ];
  const patientsToShow = availablePatients.length > 0 ? availablePatients : defaultPatients;
  const selectedPatientsList = selectedPatients.length > 0 ? selectedPatients : [defaultPatients[0]?.value || ''];
  // Filter patients to show only selected ones
  const displayPatients = patientsToShow.filter(patient =>
    selectedPatientsList.includes(patient.value)
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Mobile-Responsive Calendar Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200">
        {/* Left side - Mobile: Simplified, Desktop: Full */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile hamburger menu - only visible on mobile */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Profile image - smaller on mobile */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
            <img 
              src="/profile-placeholder.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for image loading error
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1745433972680-6f4d34b602c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              }}
            />
          </div>
          
          {/* Date with navigation arrows and view button */}
          <div className="flex items-center">
            {/* Left arrow */}
            {view !== 'agenda' && (
              <button
                onClick={goToPrevDate}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
              </button>
            )}
            
            <div className="flex items-center pr-3">
              {/* Date display */}
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {getHeaderDate()}
              </h2>
              
              {/* Show only the relevant button based on current view */}
              <div className="ml-3">
                {view === 'day' && (
                  <button 
                    onClick={goToToday}
                    className="hidden md:flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    Today
                  </button>
                )}
                {view === 'week' && (
                  <button 
                    onClick={goToToday}
                    className="hidden md:flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    This Week
                  </button>
                )}
                {view === 'month' && (
                  <button 
                    onClick={goToToday}
                    className="hidden md:flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    This Month
                  </button>
                )}
              </div>
            </div>
            
            {/* Right arrow */}
            {view !== 'agenda' && (
              <button
                onClick={goToNextDate}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <ArrowRightIcon className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        {/* Middle section - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-1 max-w-4xl mx-8">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1" ref={searchOverlayRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search appointments or click for advanced filters..."
                value={currentSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClick={() => setShowSearchOverlay(true)}
              />
              
              {/* Modern Search Overlay */}
              {showSearchOverlay && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden min-w-[600px]">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Advanced Search</h3>
                      <button
                        onClick={() => setShowSearchOverlay(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Filter Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Service Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                        <Select
                          value={advancedFilters.serviceType}
                          onValueChange={(value) => setAdvancedFilters({...advancedFilters, serviceType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any Service Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any Service Type">Any Service Type</SelectItem>
                            <SelectItem value="Individual Therapy">Individual Therapy</SelectItem>
                            <SelectItem value="Group Therapy">Group Therapy</SelectItem>
                            <SelectItem value="Assessment">Assessment</SelectItem>
                            <SelectItem value="Consultation">Consultation</SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Program */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                        <Select
                          value={advancedFilters.program}
                          onValueChange={(value) => setAdvancedFilters({...advancedFilters, program: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Programs" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Programs">All Programs</SelectItem>
                            <SelectItem value="Outpatient">Outpatient</SelectItem>
                            <SelectItem value="Intensive Outpatient">Intensive Outpatient</SelectItem>
                            <SelectItem value="Partial Hospitalization">Partial Hospitalization</SelectItem>
                            <SelectItem value="Residential">Residential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <Select
                          value={advancedFilters.status}
                          onValueChange={(value) => setAdvancedFilters({...advancedFilters, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Statuses">All Statuses</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="No Show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Provider */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                        <Select
                          value={advancedFilters.provider}
                          onValueChange={(value) => setAdvancedFilters({...advancedFilters, provider: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Providers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Providers">All Providers</SelectItem>
                            <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                            <SelectItem value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</SelectItem>
                            <SelectItem value="Dr. David Kim">Dr. David Kim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Date Range */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={advancedFilters.dateFrom}
                            onChange={(e) => setAdvancedFilters({...advancedFilters, dateFrom: e.target.value})}
                            placeholder="From"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={advancedFilters.dateTo}
                            onChange={(e) => setAdvancedFilters({...advancedFilters, dateTo: e.target.value})}
                            placeholder="To"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setAdvancedFilters({
                            serviceType: 'Any Service Type',
                            dateFrom: '',
                            dateTo: '',
                            program: 'All Programs',
                            status: 'All Statuses',
                            provider: 'All Providers'
                          });
                          handleSearchChange('');
                        }}
                      >
                        Clear All
                      </Button>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSearchOverlay(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            // Apply filters logic here
                            setShowSearchOverlay(false);
                          }}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filter toggle button with dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters()
                    ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="w-4 h-4" />
                {hasActiveFilters() && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[filters.personAppts, filters.providerReserv, filters.groupAppts, filters.nextHours].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Filter dropdown overlay */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-[calc(100vw-2rem)]">
                  {/* Ensure filter dropdown doesn't overflow viewport */}
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center space-x-2">
                      <FunnelIcon className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-800">Filter by:</h3>
                      {hasActiveFilters() && view === 'agenda' && (
                        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                          {agendaData.length}
                        </span>
                      )}
                      {hasActiveFilters() && view !== 'agenda' && (
                        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                          {filteredEvents.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  </div>
                  
                  {/* Filter options */}
                  <div className="p-3">
                    <div className="space-y-1">
                      {/* Compact options with icons */}
                      <label className="flex items-center justify-between cursor-pointer hover:bg-blue-50 px-2 py-1.5 rounded group transition-colors">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 mr-2 transition-colors" />
                          <input
                            type="checkbox"
                            checked={filters.personAppts}
                            onChange={(e) => setFilters(prev => ({ ...prev, personAppts: e.target.checked }))}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1 mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Person appointments only</span>
                        </div>
                        {filters.personAppts && <CheckIcon className="w-4 h-4 text-blue-600" />}
                      </label>
                      
                      <label className="flex items-center justify-between cursor-pointer hover:bg-green-50 px-2 py-1.5 rounded group transition-colors">
                        <div className="flex items-center">
                          <UserGroupIcon className="w-4 h-4 text-gray-500 group-hover:text-green-600 mr-2 transition-colors" />
                          <input
                            type="checkbox"
                            checked={filters.groupAppts}
                            onChange={(e) => setFilters(prev => ({ ...prev, groupAppts: e.target.checked }))}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-1 mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Group appointments only</span>
                        </div>
                        {filters.groupAppts && <CheckIcon className="w-4 h-4 text-green-600" />}
                      </label>
                      
                      <label className="flex items-center justify-between cursor-pointer hover:bg-purple-50 px-2 py-1.5 rounded group transition-colors">
                        <div className="flex items-center">
                          <Cog6ToothIcon className="w-4 h-4 text-gray-500 group-hover:text-purple-600 mr-2 transition-colors" />
                          <input
                            type="checkbox"
                            checked={filters.providerReserv}
                            onChange={(e) => setFilters(prev => ({ ...prev, providerReserv: e.target.checked }))}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-1 mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Provider reservations only</span>
                        </div>
                        {filters.providerReserv && <CheckIcon className="w-4 h-4 text-purple-600" />}
                      </label>
                      
                      {/* Time-based filter with compact design */}
                      <div className="hover:bg-orange-50 px-2 py-1.5 rounded group transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-gray-500 group-hover:text-orange-600 mr-2 transition-colors" />
                            <input
                              type="checkbox"
                              checked={filters.nextHours}
                              onChange={(e) => setFilters(prev => ({ ...prev, nextHours: e.target.checked }))}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Appointments in next</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {filters.nextHours && <CheckIcon className="w-4 h-4 text-orange-600 mr-1" />}
                            <select
                              value={filters.hoursValue}
                              onChange={(e) => setFilters(prev => ({ ...prev, hoursValue: parseInt(e.target.value) }))}
                              className={`text-xs border rounded px-1.5 py-0.5 font-medium min-w-[40px] ${
                                filters.nextHours 
                                  ? 'border-orange-300 text-gray-700 bg-white focus:ring-orange-500 focus:border-orange-500' 
                                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                              }`}
                              disabled={!filters.nextHours}
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={6}>6</option>
                              <option value={8}>8</option>
                              <option value={12}>12</option>
                              <option value={24}>24</option>
                            </select>
                            <span className={`text-xs font-medium ${
                              filters.nextHours ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              hours
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right side - Mobile: Essential controls, Desktop: Full controls */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Mobile: Search button */}
          <button 
            onClick={() => setShowSearchOverlay(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Provider/Room/Patient selector */}
          <div className="hidden md:block w-40 mr-4">
            <Select 
              value={activeTab}
              onValueChange={(value: 'provider' | 'room' | 'patient') => onTabChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* View selector as tab bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => onViewChange('day')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'day' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Day view"
            >
              Day
            </button>
            
            <button 
              onClick={() => onViewChange('week')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'week' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Week view"
            >
              Week
            </button>
            
            <button 
              onClick={() => onViewChange('month')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'month' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Month view"
            >
              Month
            </button>
            
            <button 
              onClick={() => onViewChange('agenda')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'agenda' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Agenda view"
            >
              Agenda
            </button>
          </div>
          
          {/* Desktop-only controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Settings button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleTransfer}>
                <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
                <span>Transfer</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handlePrint}>
                <PrinterIcon className="w-4 h-4 mr-2" />
                <span>Print</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleRefresh}>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                <span>Refresh</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleExportToOutlook}>
                <ArrowUpOnSquareStackIcon className="w-4 h-4 mr-2" />
                <span>Export to Outlook</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <DropdownMenuItem className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {providerLayoutMode === 'tabs' ? 
                          <Squares2X2Icon className="w-4 h-4 mr-2" /> : 
                          providerLayoutMode === 'vertical' ?
                          <QueueListIcon className="w-4 h-4 mr-2" /> :
                          <ViewColumnsIcon className="w-4 h-4 mr-2" />
                        }
                        <span>Provider Layout</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setProviderLayoutMode('tabs')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Squares2X2Icon className="w-4 h-4" />
                      <span>Horizontal Tabs</span>
                    </div>
                    {providerLayoutMode === 'tabs' && <CheckIcon className="w-4 h-4 text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setProviderLayoutMode('vertical')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <QueueListIcon className="w-4 h-4" />
                      <span>Vertical Stack</span>
                    </div>
                    {providerLayoutMode === 'vertical' && <CheckIcon className="w-4 h-4 text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setProviderLayoutMode('columns')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ViewColumnsIcon className="w-4 h-4" />
                      <span>Side-by-Side (Day Only)</span>
                    </div>
                    {providerLayoutMode === 'columns' && <CheckIcon className="w-4 h-4 text-green-600" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenuSeparator />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <DropdownMenuItem className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <SwatchIcon className="w-4 h-4 mr-2" />
                        <span>Color Schemes</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => handleColorSchemeChange('facility')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colorSchemes.facility }}
                      />
                      <span>Facility</span>
                    </div>
                    <div className="flex gap-1">
                      {['#4F46E5', '#3B82F6', '#6366F1'].map((color) => (
                        <button
                          key={color}
                          className="w-3 h-3 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 transition-all"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorSchemes(prev => ({ ...prev, facility: color }));
                          }}
                        />
                      ))}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => handleColorSchemeChange('category')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colorSchemes.category }}
                      />
                      <span>Category</span>
                    </div>
                    <div className="flex gap-1">
                      {['#10B981', '#059669', '#34D399'].map((color) => (
                        <button
                          key={color}
                          className="w-3 h-3 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 transition-all"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorSchemes(prev => ({ ...prev, category: color }));
                          }}
                        />
                      ))}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => handleColorSchemeChange('location')}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colorSchemes.location }}
                      />
                      <span>Location</span>
                    </div>
                    <div className="flex gap-1">
                      {['#F59E0B', '#D97706', '#FBBF24'].map((color) => (
                        <button
                          key={color}
                          className="w-3 h-3 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 transition-all"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorSchemes(prev => ({ ...prev, location: color }));
                          }}
                        />
                      ))}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay - Only visible on mobile when hamburger is clicked */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Calendar Views</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {/* Day View */}
                <button
                  onClick={() => {
                    onViewChange('day');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    view === 'day'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Day</span>
                  {view === 'day' && <CheckIcon className="w-5 h-5" />}
                </button>
                
                {/* Week View */}
                <button
                  onClick={() => {
                    onViewChange('week');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    view === 'week'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Week</span>
                  {view === 'week' && <CheckIcon className="w-5 h-5" />}
                </button>
                
                {/* Month View */}
                <button
                  onClick={() => {
                    onViewChange('month');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    view === 'month'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Month</span>
                  {view === 'month' && <CheckIcon className="w-5 h-5" />}
                </button>
                
                {/* Agenda View */}
                <button
                  onClick={() => {
                    onViewChange('agenda');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    view === 'agenda'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Agenda</span>
                  {view === 'agenda' && <CheckIcon className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                {/* Today Button */}
                <button
                  onClick={() => {
                    goToToday();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    isTodayActive()
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="font-medium">Go to Today</span>
                </button>
              </div>
              
              {/* Filter Options Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">Filters</h4>
                  {hasActiveFilters() && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {[filters.personAppts, filters.providerReserv, filters.groupAppts, filters.nextHours].filter(Boolean).length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Person appointments filter */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.personAppts}
                      onChange={(e) => setFilters(prev => ({ ...prev, personAppts: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Person appointments only</span>
                  </label>
                  
                  {/* Group appointments filter */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.groupAppts}
                      onChange={(e) => setFilters(prev => ({ ...prev, groupAppts: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Group appointments only</span>
                  </label>
                  
                  {/* Provider reservations filter */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.providerReserv}
                      onChange={(e) => setFilters(prev => ({ ...prev, providerReserv: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Provider reservations only</span>
                  </label>
                  
                  {/* Next hours filter */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.nextHours}
                        onChange={(e) => setFilters(prev => ({ ...prev, nextHours: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Appointments in next</span>
                    </label>
                    
                    {filters.nextHours && (
                      <div className="ml-7 flex items-center space-x-2">
                        <select
                          value={filters.hoursValue}
                          onChange={(e) => setFilters(prev => ({ ...prev, hoursValue: parseInt(e.target.value) }))}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 12, 24].map(hour => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-600">hours</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Clear filters button */}
                {hasActiveFilters() && (
                  <button
                    onClick={() => {
                      setFilters({
                        personAppts: false,
                        groupAppts: false,
                        providerReserv: false,
                        nextHours: false,
                        hoursValue: 3
                      });
                    }}
                    className="w-full mt-4 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Provider Tabs - Only show if providers are selected and in tabs mode */}
      {displayProviders.length > 0 && effectiveLayoutMode === 'tabs' && (
        <div className="border-b border-gray-200 bg-gray-50/50">
          <div className="px-6 py-2">
            <div className="flex items-center space-x-1">
              {/* Provider tabs */}
              <div className="flex space-x-1 overflow-x-auto">
                {displayProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProviderId(provider.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      activeProviderId === provider.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white border border-transparent'
                    }`}
                  >
                    {provider.label}
                    {provider.clientCount > 0 && (
                      <span className={`ml-1.5 text-xs ${
                        activeProviderId === provider.value ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        ({provider.clientCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Calendar Body - Conditional layout based on provider layout mode */}
      <div className="flex-1 overflow-hidden bg-white smart-scrollbar calendar-main-scroll w-full min-w-0">
        {effectiveLayoutMode === 'columns' && view === 'day' && (activeTab === 'provider' ? displayProviders.length > 0 : displayPatients.length > 0) ? (
          <div className="h-full flex">
            {(activeTab === 'provider' ? displayProviders : displayPatients).map((entity, _) => (
              <div 
                key={entity.id} 
                className={`border-r border-gray-200 last:border-r-0 flex-1 ${
                  (activeTab === 'provider' ? displayProviders : displayPatients).length === 1 ? 'w-full' : 
                  (activeTab === 'provider' ? displayProviders : displayPatients).length === 2 ? 'w-1/2' : 
                  (activeTab === 'provider' ? displayProviders : displayPatients).length === 3 ? 'w-1/3' : 
                  'w-1/4'
                }`}
                style={{ minWidth: (activeTab === 'provider' ? displayProviders : displayPatients).length > 2 ? '300px' : 'auto' }}
              >
                {/* Entity Header */}
                <div className={`sticky top-0 z-20 ${activeTab === 'provider' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200' : 'bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200'} px-4 py-2`}>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className={`text-sm font-semibold ${activeTab === 'provider' ? 'text-blue-900' : 'text-green-900'} truncate`}>{entity.label}</h3>
                        {activeTab === 'provider' && 'clientCount' in entity && (entity as Provider).clientCount > 0 && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                            {(entity as Provider).clientCount} clients
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Provider Day Calendar Content */}
                <div className="h-full overflow-y-auto smart-scrollbar calendar-main-scroll">
                  {/* All-day events */}
                  <div className="border-b border-gray-200 min-h-[40px] flex items-center px-2 text-sm text-gray-500">
                    <div className="w-12 pr-1 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                      All day
                    </div>
                    <div className="flex-1 relative">
                      {allDayEvents.map(event => (
                        <EventCard 
                          key={event.id} 
                          event={event}
                          onViewEvent={handleViewEvent}
                          onEditEvent={handleEditEvent}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Time slots */}
                  <div className="relative">
                    {timeSlots.map((time, index) => (
                      <div key={index} className="flex border-b border-gray-100">
                        <div className="w-12 pr-1 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                          {time}
                        </div>
                        <div className="flex-1 min-h-[48px] relative">
                          {timeEvents
                            .filter(event => {
                              const eventHour = parseInt(event.startTime.split(':')[0]);
                              return eventHour === index;
                            })
                            .map(event => (
                              <EventCard 
                                key={event.id} 
                                event={event}
                                onViewEvent={handleViewEvent}
                                onEditEvent={handleEditEvent}
                              />
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : effectiveLayoutMode === 'vertical' && (activeTab === 'provider' ? displayProviders.length > 0 : displayPatients.length > 0) ? (
          <div className="h-full overflow-y-auto">
            {(activeTab === 'provider' ? displayProviders : displayPatients).map((entity, _) => (
              <div key={entity.id} className="border-b border-gray-200 last:border-b-0">
                {/* Entity Header */}
                <div className={`sticky top-0 z-20 ${activeTab === 'provider' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200' : 'bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200'} px-6 py-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {activeTab === 'provider' ? <UserIcon className="w-5 h-5 text-blue-600" /> : <UserIcon className="w-5 h-5 text-green-600" />}
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold ${activeTab === 'provider' ? 'text-blue-900' : 'text-green-900'}`}>{entity.label}</h3>
                        {activeTab === 'provider' && 'clientCount' in entity && (entity as Provider).clientCount > 0 && (
                          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full border border-blue-200 font-medium">
                            {(entity as Provider).clientCount} clients
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Provider Calendar Content */}
                <div className="min-h-[600px] bg-white">
                  {view === 'agenda' ? (
                    <div className="h-full p-4">
                      <DataTable
                        rowData={agendaData}
                        columnDefs={agendaColumnDefs}
                        gridOptions={{
                          rowHeight: 48,
                          headerHeight: 48,
                          suppressMenuHide: true,
                          paginationPageSize: 15,
                        }}
                        className="rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : view === 'day' ? (
                    <div className="relative">
                      {/* All-day events */}
                      <div className="border-b border-gray-200 min-h-[40px] flex items-center px-4 text-sm text-gray-500">
                        <div className="w-16 pr-2 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                          All day
                        </div>
                        <div className="flex-1 relative">
                          {allDayEvents.map(event => (
                            <EventCard 
                              key={event.id} 
                              event={event}
                              onViewEvent={handleViewEvent}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Time slots */}
                      <div className="relative">
                        {timeSlots.map((time, index) => (
                          <div key={index} className="flex border-b border-gray-100">
                            <div className="w-16 pr-2 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                              {time}
                            </div>
                            <div className="flex-1 min-h-[48px] relative">
                              {timeEvents
                                .filter(event => {
                                  const eventHour = parseInt(event.startTime.split(':')[0]);
                                  return eventHour === index;
                                })
                                .map(event => (
                                  <EventCard 
                                    key={event.id} 
                                    event={event}
                                    onViewEvent={handleViewEvent}
                                  />
                                ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : view === 'week' ? (
                    <WeekView 
                      selectedDate={selectedDate} 
                      events={filteredEvents}
                      timeSlots={timeSlots}
                      onEditEvent={handleEditEvent}
                    />
                  ) : (
                    <MonthView 
                      selectedDate={selectedDate} 
                      events={filteredEvents}
                      onEditEvent={handleEditEvent}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Horizontal Tabs Layout - Original single calendar view
          <>
            {view === 'agenda' ? (
              <div className="h-full p-4">
                <DataTable
                  rowData={agendaData}
                  columnDefs={agendaColumnDefs}
                  gridOptions={{
                    rowHeight: 48,
                    headerHeight: 48,
                    suppressMenuHide: true,
                    paginationPageSize: 15,
                  }}
                  className="rounded-lg border border-gray-200"
                />
              </div>
            ) : view === 'day' ? (
              <div className="relative h-full">
                {/* All-day events */}
                <div className="border-b border-gray-200 min-h-[40px] flex items-center px-4 text-sm text-gray-500">
                  <div className="w-16 pr-2 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                    All day
                  </div>
                  <div className="flex-1 relative">
                    {allDayEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event}
                        onEditEvent={handleEditEvent}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Time slots */}
                <div className="relative">
                  {timeSlots.map((time, index) => (
                    <div key={index} className="flex border-b border-gray-100">
                      <div className="w-16 pr-2 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
                        {time}
                      </div>
                      <div className="flex-1 min-h-[48px] relative">
                        {timeEvents
                          .filter(event => {
                            const eventHour = parseInt(event.startTime.split(':')[0]);
                            return eventHour === index;
                          })
                          .map(event => (
                            <EventCard 
                              key={event.id} 
                              event={event}
                              onEditEvent={handleEditEvent}
                            />
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : view === 'week' ? (
              <div className="h-full w-full overflow-hidden">
                <WeekView 
                  selectedDate={selectedDate} 
                  events={filteredEvents}
                  timeSlots={timeSlots}
                  onEditEvent={handleEditEvent}
                />
              </div>
            ) : (
              <MonthView 
                selectedDate={selectedDate} 
                events={filteredEvents}
                onEditEvent={handleEditEvent}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
