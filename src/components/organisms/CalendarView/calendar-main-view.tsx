import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDownIcon,
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
  PhoneIcon
} from '@heroicons/react/24/outline';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import WeekView from '../../molecules/WeekView/week-view';
import MonthView from '../../molecules/MonthView/month-view';
import { DataTable } from '../DataTable';
import EventPopover from '../../atoms/EventPopover/event-popover';

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

interface CalendarMainViewProps {
  selectedDate: Date;
  view: 'day' | 'week' | 'month' | 'agenda';
  onViewChange: (view: 'day' | 'week' | 'month' | 'agenda') => void;
  onDateChange: (date: Date) => void;
  onSettingsClick: () => void;
  onEditEvent?: (event: Event) => void;
  events?: Event[];
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

const EventCard: React.FC<{ 
  event: Event;
  onEditEvent?: (event: Event) => void;
}> = ({ event, onEditEvent }) => {
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

  const eventContent = (
    <div 
      className="absolute top-0 left-0 right-0 mx-2 p-2 rounded border text-xs overflow-hidden cursor-pointer"
      style={{ 
        backgroundColor: event.backgroundColor || '#E5EDFF',
        borderColor: event.type === 'Individual' ? '#C7D2FE' : 
                    event.type === 'Group' ? '#FDE68A' : '#E5E7EB',
        height: '46px'
      }}
    >
      <div className="flex items-center gap-1">
        {getEventIcon()}
        <div className="font-medium truncate flex-1">{event.title}</div>
      </div>
      <div className="text-gray-600 mt-1 flex items-center gap-2">
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
    <EventPopover event={event} onEdit={onEditEvent}>
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
  onEditEvent,
  events = []
}) => {
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

  const goToToday = () => onDateChange(new Date());

  // Filter all-day events
  const allDayEvents = events.filter(event => event.isAllDay);
  const timeEvents = events.filter(event => !event.isAllDay);

  // State for dropdown visibility
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsViewDropdownOpen(false);
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

  // Update agendaColumnDefs to include insurance and paperwork status
  const agendaColumnDefs = [
    {
      headerName: 'Appointment Date',
      field: 'startTime',
      cellRenderer: (params: any) => formatDate(params.value, 'MMM dd, yyyy'),
      minWidth: 130,
    },
    {
      headerName: 'Time',
      field: 'startTime',
      cellRenderer: (params: any) => 
        formatTimeRange(params.data.startTime, params.data.endTime, params.data.isAllDay),
      minWidth: 150,
    },
    {
      headerName: 'Program',
      field: 'program',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Type',
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
      headerName: 'Copay',
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
      headerName: 'Insurance',
      field: 'insuranceVerified',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className={`text-sm ${params.value ? 'text-green-600' : 'text-red-600'}`}>
          {params.value ? '✓ Verified' : '⚠ Pending'}
        </div>
      )
    },
    {
      headerName: 'Paperwork',
      field: 'paperworkComplete',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className={`text-sm ${params.value ? 'text-green-600' : 'text-yellow-600'}`}>
          {params.value ? '✓ Complete' : '⚠ Incomplete'}
        </div>
      )
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
  const agendaData = mockAgendaData;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        {/* Left side with profile image and date display */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
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
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {getHeaderDate()}
            </h2>
          </div>
        </div>
        
        {/* Right side with navigation controls */}
        <div className="flex items-center space-x-3">
          {/* View selector dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <span>{view === 'agenda' ? 'Agenda' : view.charAt(0).toUpperCase() + view.slice(1)}</span>
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                className="flex justify-between items-center"
                onClick={() => onViewChange('day')}
              >
                <div className="flex items-center">
                  {view === 'day' && <CheckIcon className="w-4 h-4 mr-2" />}
                  <span className={view !== 'day' ? "ml-6" : ""}>Day</span>
                </div>
                <DropdownMenuShortcut>1 or D</DropdownMenuShortcut>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex justify-between items-center"
                onClick={() => onViewChange('week')}
              >
                <div className="flex items-center">
                  {view === 'week' && <CheckIcon className="w-4 h-4 mr-2" />}
                  <span className={view !== 'week' ? "ml-6" : ""}>Week</span>
                </div>
                <DropdownMenuShortcut>0 or W</DropdownMenuShortcut>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex justify-between items-center"
                onClick={() => onViewChange('month')}
              >
                <div className="flex items-center">
                  {view === 'month' && <CheckIcon className="w-4 h-4 mr-2" />}
                  <span className={view !== 'month' ? "ml-6" : ""}>Month</span>
                </div>
                <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex justify-between items-center"
                onClick={() => onViewChange('agenda')}
              >
                <div className="flex items-center">
                  {view === 'agenda' && <CheckIcon className="w-4 h-4 mr-2" />}
                  <span className={view !== 'agenda' ? "ml-6" : ""}>Agenda</span>
                </div>
                <DropdownMenuShortcut>A</DropdownMenuShortcut>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex justify-between items-center">
                <span>Number of days</span>
                <ChevronRightIcon className="w-4 h-4" />
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="flex justify-between items-center"
                onClick={onSettingsClick}
              >
                <span>View Settings</span>
                <ChevronRightIcon className="w-4 h-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Today button */}
          <button 
            onClick={goToToday}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>

          {/* Agenda button */}
          <button 
            onClick={() => onViewChange(view === 'agenda' ? 'day' : 'agenda')}
            className={`px-4 py-1.5 text-sm font-medium border rounded-md transition-colors ${
              view === 'agenda' 
                ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Agenda
          </button>
          
          {/* Navigation arrows */}
          <div className="flex items-center">
            <button 
              onClick={goToPrevDate}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={goToNextDate}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <ArrowRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
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
      
      {/* Calendar Body */}
      <div className="flex-1 overflow-y-auto bg-white">
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
                    onEditEvent={onEditEvent}
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
                          onEditEvent={onEditEvent}
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
            events={events}
            timeSlots={timeSlots}
            onEditEvent={onEditEvent}
          />
        ) : view === 'month' ? (
          <MonthView
            selectedDate={selectedDate}
            events={events}
            onEditEvent={onEditEvent}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CalendarMainView;
