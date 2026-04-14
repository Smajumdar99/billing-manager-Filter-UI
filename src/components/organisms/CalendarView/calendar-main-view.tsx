import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Minus, ChevronLeft, ChevronRight, User, Users, Folder, Calendar as CalendarLucide, MessageSquare, Printer, Download, Clock, X, Search, Settings, ArrowRightLeft, RefreshCw, Upload, Menu, Palette } from 'lucide-react';
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
  QueueListIcon,
  ViewColumnsIcon,
  Bars3Icon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, getDaysInMonth } from 'date-fns';
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
import { Switch } from '../../atoms/Switch';
import { TransferDialog } from '../../molecules/TransferDialog/transfer-dialog';
import { toast } from '../../atoms/Toast/use-toast';

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
  /** ISO date string yyyy-MM-dd — when set, event only appears on that day in week list */
  date?: string;
  isAllDay?: boolean;
  type?: 'Individual' | 'Group' | 'Provider';
  backgroundColor?: string;
  mobile?: string;
  home?: string;
  status?: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed';
  appointmentType?: string;
  location?: string;
  notes?: string;
  category?: string;
  program?: string;
  personName?: string;
  phoneNumber?: string;
  supervisingProvider?: string;
  copay?: number;
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
  onMyCalendarToggle?: (isMyCalendar: boolean) => void;
  onProviderSelectionChange?: (providerIds: string[]) => void;
}

type ColorScheme = {
  facility: string;
  category: string;
  location: string;
};

/** Provider / clinician type labels for advanced search "for" dropdown (reference list). */
const ADVANCED_SEARCH_PROVIDER_TYPE_OPTIONS: readonly string[] = [
  'Doctor, Acupuncturist',
  'doctor, Allergist',
  'doctor, Andrologist',
  'Doctor, Ayurvedic',
  'doctor, Dermatologist',
  'doctor, Endocrinologist',
  'doctor, Epidemiologist',
  'doctor, ER',
  'doctor, Gastroenterologist',
  'doctor, Hepatologist',
  'doctor, Homeopathic',
  'doctor, Immunologist',
  'doctor, Intensivist',
  'doctor, Microbiologist',
  'Doctor, Naturopathic',
  'doctor, OB',
  'doctor, Oncologist',
  'doctor, Orthopedist',
  'doctor, Osteopath',
  'doctor, Parasitologist',
];

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

/** Mobile soft-block event cards: tinted bg + thick left border (no separate accent strip) */
const getMobileEventSoftBlockClasses = (type?: Event['type']) => {
  switch (type) {
    case 'Provider':
      return {
        block: 'bg-purple-50/70 border-purple-500',
        typeText: 'text-purple-600',
      };
    case 'Group':
      return {
        block: 'bg-emerald-50/70 border-emerald-500',
        typeText: 'text-emerald-600',
      };
    case 'Individual':
      return {
        block: 'bg-blue-50/70 border-blue-500',
        typeText: 'text-blue-600',
      };
    default:
      return {
        block: 'bg-slate-50/70 border-slate-500',
        typeText: 'text-slate-600',
      };
  }
};

/**
 * Mobile: time gutter + continuous vertical rule in content column (empty hours still draw border-l).
 * md+: classic sticky time column + plain content cell.
 */
const DayScheduleTimelineRow: React.FC<{
  timeLabel: string;
  variant?: 'hour' | 'allDay';
  children: React.ReactNode;
}> = ({ timeLabel, variant = 'hour', children }) => {
  const isAllDay = variant === 'allDay';
  return (
    <div
      className={`flex w-full border-b pl-2 md:pl-0 ${
        isAllDay ? 'border-gray-200 min-h-[30px] md:min-h-[32px]' : 'border-gray-100 min-h-[44px] md:min-h-0'
      }`}
    >
      <div
        className={`w-10 shrink-0 md:w-12 md:sticky md:left-0 md:bg-white md:z-10 ${
          isAllDay
            ? 'flex items-center justify-center text-center px-0.5 md:px-0.5 py-1.5'
            : 'text-right pr-2 md:pr-1 pt-2 md:py-1.5'
        }`}
      >
        <span className="text-[10px] font-medium text-slate-400 md:text-xs md:text-gray-500 md:font-normal">
          {timeLabel}
        </span>
      </div>
      <div
        className={`flex-1 flex flex-col gap-2 border-l border-slate-200 pl-3 pr-4 md:border-l-0 md:pl-0 md:pr-0 md:gap-0 md:relative ${
          isAllDay ? 'pb-2 pt-1.5 md:pb-0' : 'pb-3 pt-1.5 md:pb-0 md:pt-0 md:min-h-[40px]'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const mobilePopupStatusClass = (status?: Event['status']) => {
  switch (status) {
    case 'Confirmed':
      return 'text-blue-600 bg-blue-50';
    case 'Pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'Checked In':
      return 'text-green-600 bg-green-50';
    case 'Completed':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const EventCard: React.FC<{
  event: Event;
  onViewEvent?: (event: Event) => void;
  onEditEvent?: (event: Event) => void;
  activeEventId: string | null;
  onActivateEventId: (id: string | null) => void;
}> = ({ event, onViewEvent, onEditEvent, activeEventId, onActivateEventId }) => {
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

  const bgColor = getEventBgColor(event.type);
  const soft = getMobileEventSoftBlockClasses(event.type);
  const typeLabel = event.type ?? 'Event';
  const isPopupOpen = activeEventId === event.id;

  const mobileCardFace = (
    <div
      className={`relative flex w-full flex-col border-l-[4px] p-3 mb-1 rounded-r-xl rounded-l-sm transition-all duration-200 ease-out shadow-[0_4px_14px_-2px_rgba(15,23,42,0.12),0_2px_6px_-2px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.75)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.14),0_4px_10px_-4px_rgba(15,23,42,0.1),inset_0_1px_0_0_rgba(255,255,255,0.85)] active:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1),inset_0_2px_4px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04] ${soft.block} ${isPopupOpen ? 'ring-2 ring-primary/30' : ''}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/80 to-white/0 opacity-90"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 truncate text-[14px] font-bold leading-tight text-slate-900">
          {event.title}
        </h4>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-white/60 ${soft.typeText}`}
        >
          {typeLabel}
        </span>
      </div>
      <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-[12px] font-medium text-slate-600">
        <span className="shrink-0">
          {event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}
        </span>
        {event.type === 'Individual' && (
          <span className="flex shrink-0 items-center opacity-70" aria-hidden>
            <UserIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {event.type === 'Group' && (
          <span className="flex shrink-0 items-center opacity-70" aria-hidden>
            <UserGroupIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {event.mobile && (
          <span className="flex min-w-0 items-center gap-1 text-slate-700">
            <PhoneIcon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">{event.mobile}</span>
          </span>
        )}
      </div>
    </div>
  );

  const mobileDetailPopup = isPopupOpen && (
        <div
          role="dialog"
          aria-label="Event details"
          className="absolute top-full left-0 z-[60] mt-1 ml-[2.5%] w-[95%] origin-top rounded-xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200 ease-out"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <h4 className="text-[15px] font-semibold leading-tight text-slate-800">{event.title}</h4>
            <button
              type="button"
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Edit appointment"
              onClick={() => {
                onEditEvent?.(event);
                onActivateEventId(null);
              }}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          </div>
          {event.personName && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600">
              <UserIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.personName}</span>
            </div>
          )}
          {event.status && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600">
              <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${mobilePopupStatusClass(event.status)}`}>
                {event.status}
              </span>
            </div>
          )}
          <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
            <ClockIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>{event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}</span>
          </div>
          {(event.category || event.appointmentType) && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
              <ClipboardDocumentListIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.category || event.appointmentType}</span>
            </div>
          )}
          {event.program && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
              <ClipboardDocumentListIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.program}</span>
            </div>
          )}
          {event.location && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
              <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.location}</span>
            </div>
          )}
          {event.supervisingProvider && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
              <UserIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.supervisingProvider}</span>
            </div>
          )}
          {(event.phoneNumber || event.mobile) && (
            <div className="mb-2 flex items-center gap-3 text-[13px] text-slate-600 last:mb-0">
              <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{event.phoneNumber || event.mobile}</span>
            </div>
          )}
          {event.notes && (
            <div className="mt-2 border-t border-slate-100 pt-2 text-[12px] text-slate-600">
              <span className="font-medium text-slate-700">Notes: </span>
              {event.notes}
            </div>
          )}
        </div>
  );

  const desktopCard = (
    <div
      className="mx-2 my-1 flex min-w-0 cursor-pointer flex-col gap-1 overflow-hidden rounded-lg border bg-white p-2 text-xs shadow-[0_3px_10px_-2px_rgba(15,23,42,0.1),0_1px_4px_-1px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)] ring-1 ring-slate-900/[0.05] transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_6px_16px_-4px_rgba(15,23,42,0.12),0_2px_6px_-2px_rgba(15,23,42,0.08)] active:translate-y-0 active:shadow-md"
      style={{
        backgroundColor: bgColor,
        borderColor:
          event.type === 'Individual'
            ? '#C7D2FE'
            : event.type === 'Group'
              ? '#A7F3D0'
              : event.type === 'Provider'
                ? '#D8B4FE'
                : '#E5E7EB',
      }}
    >
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <EventTypeBadge type={event.type} />
          {getEventIcon()}
          <div className="font-medium truncate flex-1">{event.title}</div>
        </div>
        <div className="text-gray-600 flex items-center gap-2 min-w-0">
          <span>
            {event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}
          </span>
          {event.mobile && (
            <span className="flex items-center gap-1 text-blue-600">
              <PhoneIcon className="w-3 h-3" />
              {event.mobile}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full md:hidden" data-event-card-root>
        <button
          type="button"
          className="w-full text-left"
          aria-expanded={isPopupOpen}
          aria-haspopup="dialog"
          onClick={(e) => {
            e.stopPropagation();
            onActivateEventId(activeEventId === event.id ? null : event.id);
          }}
          onDoubleClick={() => onViewEvent?.(event)}
        >
          {mobileCardFace}
        </button>
        {mobileDetailPopup}
      </div>
      <div className="hidden md:block w-full min-w-0">
        <EventPopover event={event as never} onEdit={onEditEvent} onView={onViewEvent}>
          {desktopCard}
        </EventPopover>
      </div>
    </>
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
  onTabChange,
  onMyCalendarToggle,
  onProviderSelectionChange
}) => {
  // State for internal search functionality if no external handler provided
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  // State for My Calendar toggle - determines if viewing user's personal calendar
  const [isMyCalendar, setIsMyCalendar] = useState(false);
  
  // State for agenda date range - used when view is 'agenda'
  const [agendaDateRange, setAgendaDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7) // Default to 7 days from today
  });
  
  // State for tab functionality - Provider selected by default
  // const [activeTab, setActiveTab] = useState<'provider' | 'room' | 'patient'>('provider');
  
  // State for advanced search overlay
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    keywords: '',
    operator: 'AND',
    serviceType: 'Any Service Type',
    dateFrom: format(new Date(), 'yyyy-MM-dd'),
    dateTo: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    provider: 'Admin, Ensoftek',
    facility: 'All Facilities',
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
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /** Mobile day view: which event detail popup is open (tap same/other card to toggle/switch) */
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Options drawer: Locations, Providers, Programs (advanced filters)
  const optionsDrawerLocations = ['Main Campus - Downtown', 'North Clinic', 'Virtual', 'Emergency Unit', 'Walk-in Clinic', 'IOP Center', 'Room 101', 'Room 102', 'Room 105', 'Room 203', 'Conference Room A', 'Break Room'];
  const optionsDrawerPrograms = ['Adult Mental Health', 'Substance Use', 'Child & Adolescent', 'Crisis Services', 'Dual Diagnosis', 'IOP', 'MAT Program', 'Behavioral Health', 'General', 'Staff Training'];
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [optionsSearchLocations, setOptionsSearchLocations] = useState('');
  const [optionsSearchProviders, setOptionsSearchProviders] = useState('');
  const [optionsSearchPrograms, setOptionsSearchPrograms] = useState('');
  const [openSection, setOpenSection] = useState<'locations' | 'providers' | 'programs' | ''>('providers');

  // State for transfer dialog
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  
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

  // Filter events based on My Calendar toggle
  // When My Calendar is ON, show only events for the logged-in user (Dr. Sarah Wilson)
  // When My Calendar is OFF, show all events
  const myCalendarFilteredEvents = isMyCalendar 
    ? filteredEvents.filter(event => {
        // Filter to show only events where the current user is the supervising provider
        // Check if the event title contains the user's name or if it's their appointment type
        const isUserEvent = event.title.toLowerCase().includes('sarah') || 
                           event.title.toLowerCase().includes('wilson') ||
                           (event as any).supervisingProvider === 'Dr. Sarah Wilson' ||
                           (event as any).personName === 'Sarah Wilson';
        return isUserEvent;
      })
    : filteredEvents;

  type SearchResultRow = {
    id: string;
    date: string;
    time: string;
    durationMins: number;
    program: string;
    provider: string;
    category: string;
    status: string;
    resident: string;
    comments: string;
  };

  // Filter all-day events
  const allDayEvents = myCalendarFilteredEvents.filter(event => event.isAllDay);
  const timeEvents = myCalendarFilteredEvents.filter(event => !event.isAllDay);
  const searchResults: SearchResultRow[] = [
    {
      id: 'sr-1',
      date: '24/03/2026',
      time: '10:00',
      durationMins: 21,
      program: 'A-AADO',
      provider: 'Admin, Ensoftek',
      category: 'All Staff',
      status: 'Scheduled',
      resident: 'Resident Name',
      comments: 'testing',
    },
    {
      id: 'sr-2',
      date: '25/03/2026',
      time: '10:00',
      durationMins: 71,
      program: 'A-AADO',
      provider: 'Admin, Ensoftek',
      category: 'All Staff',
      status: 'Scheduled',
      resident: 'Resident Name',
      comments: 'testing',
    },
    {
      id: 'sr-3',
      date: '26/03/2026',
      time: '10:00',
      durationMins: 71,
      program: 'A-AADO',
      provider: 'Admin, Ensoftek',
      category: 'All Staff',
      status: 'Scheduled',
      resident: 'Resident Name',
      comments: 'testing',
    },
    {
      id: 'sr-4',
      date: '27/03/2026',
      time: '10:00',
      durationMins: 21,
      program: 'A-AADO',
      provider: 'Admin, Ensoftek',
      category: 'All Staff',
      status: 'Scheduled',
      resident: 'Resident Name',
      comments: 'testing',
    },
  ];

  const getEventDurationMinutes = (event: Event) => {
    if (event.isAllDay) return 24 * 60;
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    return Math.max(0, endTotal - startTotal);
  };

  const totalResultsDurationMinutes = searchResults.reduce((total, event) => total + event.durationMins, 0);

  const getDesktopResultTone = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return {
          container: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50',
        };
      case 'Pending':
        return {
          container: 'bg-purple-50 border-purple-200',
          badge: 'bg-purple-100/80 text-purple-700 border-purple-200/50',
        };
      case 'Checked In':
        return {
          container: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50',
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          badge: 'bg-blue-100/80 text-blue-700 border-blue-200/50',
        };
    }
  };

  const ProviderDoctorIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 14 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192C240 147.8 275.8 112 320 112zM192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192zM264 486.4L264 432L360 432L360 473C338.8 482.3 324 503.4 324 528L324 552C324 563 333 572 344 572C355 572 364 563 364 552L364 528C364 517 373 508 384 508C395 508 404 517 404 528L404 552C404 563 413 572 424 572C435 572 444 563 444 552L444 528C444 503.4 429.2 482.3 408 473L408 436.3C458.7 450.3 496 496.8 496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552C544 459.2 468.8 384 376 384L264 384C171.2 384 96 459.2 96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552C144 502.8 173.6 460.5 216 442L216 486.4C201.7 494.7 192 510.2 192 528C192 554.5 213.5 576 240 576C266.5 576 288 554.5 288 528C288 510.2 278.3 494.7 264 486.4z" />
    </svg>
  );

  // State for dropdown visibility
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const mobileFilterDropdownRef = useRef<HTMLDivElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  /** Full-screen mobile search panel — must be excluded from outside-click; it is NOT under searchOverlayRef (desktop-only). */
  const mobileSearchOverlayRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideFilter = (filterDropdownRef.current?.contains(target)) || (mobileFilterDropdownRef.current?.contains(target));
      if (!insideFilter) setShowFilters(false);
      const insideDesktopSearch = searchOverlayRef.current?.contains(target);
      const insideMobileSearch = mobileSearchOverlayRef.current?.contains(target);
      if (!insideDesktopSearch && !insideMobileSearch) {
        setShowSearchOverlay(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile event detail sheet when tapping outside any event card (root includes popup)
  useEffect(() => {
    if (activeEventId === null) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('[data-event-card-root]')) {
        setActiveEventId(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [activeEventId]);

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
      case 'agenda':
        return `${format(agendaDateRange.startDate, 'MMM d')} - ${format(agendaDateRange.endDate, 'MMM d, yyyy')}`;
      default:
        return format(selectedDate, 'MMMM d, yyyy');
    }
  };

  // Date range handlers for agenda view
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    setAgendaDateRange(prev => ({
      ...prev,
      startDate: newStartDate,
      // Ensure end date is not before start date
      endDate: newStartDate > prev.endDate ? addDays(newStartDate, 1) : prev.endDate
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    setAgendaDateRange(prev => ({
      ...prev,
      endDate: newEndDate,
      // Ensure start date is not after end date
      startDate: newEndDate < prev.startDate ? subDays(newEndDate, 1) : prev.startDate
    }));
  };

  // Settings menu handlers
  const handleTransfer = () => {
    setShowTransferDialog(true);
  };

  // Handle dialog close - refresh page to ensure clean state
  const handleTransferDialogClose = () => {
    setShowTransferDialog(false);
    // Small delay to ensure dialog closes smoothly before refresh
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Handle transfer operation
  const handleTransferComplete = (eventIds: string[], fromProvider: string, toProvider: string) => {
    console.log('Transferring events:', { eventIds, fromProvider, toProvider });
    
    // Here you would make the actual API call to transfer the events
    // For now, we'll just show a success message
    
    // Close the dialog
    setShowTransferDialog(false);
    
    // Show success toast notification
    toast({
      title: "Transfer Successful! ✅",
      description: `Successfully transferred ${eventIds.length} appointment${eventIds.length !== 1 ? 's' : ''} from ${fromProvider} to ${toProvider}`,
      variant: 'default'
    });
    
    // Refresh the page to ensure clean state after dialog close
    setTimeout(() => {
      window.location.reload();
    }, 2000); // Give time for user to see the toast
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
      <TooltipProvider>
        <div className="flex items-center space-x-2">
          {/* View appointment details */}
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
                <EyeIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </TooltipRoot>
          
          {/* Edit appointment */}
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50">
                <PencilIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Appointment</p>
            </TooltipContent>
          </TooltipRoot>
          
          {/* Allocate Room */}
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button 
                className="p-1 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
                onClick={() => {
                  // Handle room allocation logic here
                  console.log('Allocating room for appointment:', data.id, data.title);
                  // You can add navigation to room allocation page or open a modal
                }}
              >
                <FontAwesomeIcon icon={faBed} className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Allocate Room</p>
            </TooltipContent>
          </TooltipRoot>
          
          {/* Delete appointment */}
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                <TrashIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Appointment</p>
            </TooltipContent>
          </TooltipRoot>
          
          {/* More actions */}
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                <EllipsisHorizontalIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Actions</p>
            </TooltipContent>
          </TooltipRoot>
        </div>
      </TooltipProvider>
    );
  };

  // Mock data for a behavioral health clinic
  const mockAgendaData: AgendaEventType[] = [
    {
      id: '1',
      title: 'Initial Assessment - Depression',
      startTime: new Date(2025, 6, 21, 9, 0).toISOString(), // Today - July 21, 2025
      endTime: new Date(2025, 6, 21, 10, 30).toISOString(),
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
      title: 'Medication Management - Dr. Sarah Wilson',
      startTime: new Date(2025, 6, 21, 10, 0).toISOString(), // Today
      endTime: new Date(2025, 6, 21, 10, 30).toISOString(),
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
      startTime: new Date(2025, 6, 22, 11, 0).toISOString(), // Tomorrow - July 22, 2025
      endTime: new Date(2025, 6, 22, 12, 30).toISOString(),
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
      startTime: new Date(2025, 6, 22, 14, 0).toISOString(), // Tomorrow
      endTime: new Date(2025, 6, 22, 15, 30).toISOString(),
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
      title: 'Crisis Intervention - Sarah Wilson',
      startTime: new Date(2025, 6, 23, 9, 30).toISOString(), // July 23, 2025
      endTime: new Date(2025, 6, 23, 10, 30).toISOString(),
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
      startTime: new Date(2025, 6, 23, 13, 0).toISOString(), // July 23, 2025
      endTime: new Date(2025, 6, 23, 14, 0).toISOString(),
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
      startTime: new Date(2025, 6, 24, 15, 0).toISOString(), // July 24, 2025
      endTime: new Date(2025, 6, 24, 16, 30).toISOString(),
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
      title: 'Walk-in Assessment - Dr. Sarah Wilson',
      startTime: new Date(2025, 6, 25, 10, 45).toISOString(), // July 25, 2025
      endTime: new Date(2025, 6, 25, 11, 45).toISOString(),
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
      startTime: new Date(2025, 6, 26, 13, 30).toISOString(), // July 26, 2025
      endTime: new Date(2025, 6, 26, 14, 30).toISOString(),
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
      title: 'IOP Group Session - Sarah Wilson',
      startTime: new Date(2025, 6, 27, 9, 0).toISOString(), // July 27, 2025
      endTime: new Date(2025, 6, 27, 12, 0).toISOString(),
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
  // Filter agenda data based on search query, filter options, and date range
  const agendaData = mockAgendaData.filter(appointment => {
    // Apply date range filter for agenda view
    if (view === 'agenda') {
      const appointmentDate = new Date(appointment.startTime);
      const startOfDay = new Date(agendaDateRange.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(agendaDateRange.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      if (appointmentDate < startOfDay || appointmentDate > endOfDay) {
        return false;
      }
    }
    
    // Apply search filter
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
    
    // Apply My Calendar filter if enabled
    if (isMyCalendar) {
      const isUserAppointment = appointment.title.toLowerCase().includes('sarah') || 
                               appointment.title.toLowerCase().includes('wilson') ||
                               appointment.person.toLowerCase().includes('sarah') ||
                               appointment.person.toLowerCase().includes('wilson') ||
                               (appointment as any).supervisingProvider === 'Dr. Sarah Wilson';
      if (!isUserAppointment) {
        return false;
      }
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

  // Handler for My Calendar toggle - switches between personal and other calendars
  const handleMyCalendarToggle = (checked: boolean) => {
    setIsMyCalendar(checked);
    // Call parent callback to update calendar data
    if (onMyCalendarToggle) {
      onMyCalendarToggle(checked);
    }
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
      <div className="flex flex-row items-center justify-between w-full px-4 py-2 bg-white border-b border-gray-200">
        {/* Left Column: Tools & Search */}
        <div className="flex-1 flex flex-row items-center justify-start gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop: Search button */}
          <div className="hidden md:block" ref={searchOverlayRef}>
            <button
              type="button"
              onClick={() => {
                setHasSearched(false);
                setIsSearchModalOpen(true);
              }}
              className="relative flex items-center justify-center w-9 h-9 border rounded-lg transition-colors text-gray-700 border-gray-300 hover:bg-gray-50"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop: Filter toggle button with dropdown */}
          <div className="relative hidden md:block" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center justify-center w-9 h-9 border rounded-lg transition-colors ${
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

            {showFilters && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-[calc(100vw-2rem)]">
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
                        {myCalendarFilteredEvents.length}
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
                <div className="p-3">
                  <div className="space-y-1">
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

        {/* Center Column: Date Navigation */}
        <div className="flex flex-row items-center justify-center gap-1.5 md:gap-4 min-w-0">
          {view !== 'agenda' && (
            <button
              onClick={goToPrevDate}
              className="shrink-0 p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors min-w-[28px] min-h-[28px] md:min-w-[32px] md:min-h-[32px] flex items-center justify-center"
              aria-label="Previous"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
            </button>
          )}

          <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
            {view === 'agenda' ? (
              <div className="flex items-center gap-1 md:gap-2 min-w-0">
                <div className="flex items-center gap-0.5 md:gap-1 min-w-0">
                  <label className="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap shrink-0 hidden sm:inline">From:</label>
                  <input
                    type="date"
                    value={format(agendaDateRange.startDate, 'yyyy-MM-dd')}
                    onChange={handleStartDateChange}
                    aria-label="From date"
                    className="min-w-0 max-w-[100px] md:max-w-none px-1.5 md:px-2 py-0.5 md:py-1 text-xs md:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-0.5 md:gap-1 min-w-0">
                  <label className="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap shrink-0 hidden sm:inline">To:</label>
                  <input
                    type="date"
                    value={format(agendaDateRange.endDate, 'yyyy-MM-dd')}
                    onChange={handleEndDateChange}
                    aria-label="To date"
                    className="min-w-0 max-w-[100px] md:max-w-none px-1.5 md:px-2 py-0.5 md:py-1 text-xs md:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs font-bold text-purple-600 md:text-lg md:font-bold md:text-slate-800 lg:text-xl whitespace-nowrap">
                {getHeaderDate()}
              </span>
            )}

            {view === 'day' && (
              <button
                onClick={goToToday}
                className="hidden md:inline-flex shrink-0 text-xs md:text-sm px-2 py-1 md:px-3 font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
            )}
            {view === 'week' && (
              <button
                onClick={goToToday}
                className="hidden md:inline-flex shrink-0 text-xs md:text-sm px-2 py-1 md:px-3 font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                This Week
              </button>
            )}
            {view === 'month' && (
              <button
                onClick={goToToday}
                className="hidden md:inline-flex shrink-0 text-xs md:text-sm px-2 py-1 md:px-3 font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                This Month
              </button>
            )}
          </div>

          {view !== 'agenda' && (
            <button
              onClick={goToNextDate}
              className="shrink-0 p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors min-w-[28px] min-h-[28px] md:min-w-[32px] md:min-h-[32px] flex items-center justify-center"
              aria-label="Next"
            >
              <ArrowRightIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Middle section - removed (search/filter moved to left column) */}
        <div className="hidden">
          <div>
            <div>
              <button
                type="button"
                disabled
                className="hidden"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter toggle button with dropdown (desktop only; mobile has its own dropdown) */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center justify-center w-9 h-9 border rounded-lg transition-colors ${
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
                          {myCalendarFilteredEvents.length}
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
        
        {/* Right Column: Views & Settings */}
        <div className="flex-1 flex flex-row items-center justify-end gap-3">
          {/* Mobile: Filter icon with dropdown (same Filter by options as desktop) */}
          <div className="relative md:hidden" ref={mobileFilterDropdownRef}>
            <button
              type="button"
              className={`relative flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                showFilters || hasActiveFilters()
                  ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                  : 'text-slate-600 border-gray-200 hover:bg-slate-100'
              }`}
              aria-label="Filter"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5" />
              {hasActiveFilters() && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {[filters.personAppts, filters.providerReserv, filters.groupAppts, filters.nextHours].filter(Boolean).length}
                </span>
              )}
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-[calc(100vw-2rem)]">
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
                        {myCalendarFilteredEvents.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
                <div className="p-3">
                  <div className="space-y-1">
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
                          <span className={`text-xs font-medium ${filters.nextHours ? 'text-gray-600' : 'text-gray-400'}`}>
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
          {/* Mobile: Search button */}
          <button 
            onClick={() => setShowSearchOverlay(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 border rounded-lg transition-colors text-slate-600 border-gray-200 hover:bg-slate-100"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Provider/Room/Patient selector */}
          <div className="hidden md:block w-40">
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
              
              <DropdownMenuItem className="flex items-center justify-between px-2 py-2" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>My calendar</span>
                </div>
                <Switch 
                  checked={isMyCalendar}
                  onCheckedChange={handleMyCalendarToggle}
                  className="ml-2"
                />
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <DropdownMenuItem className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {providerLayoutMode === 'tabs' ? 
                          <Bars3Icon className="w-4 h-4 mr-2" /> : 
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
                      <Bars3Icon className="w-4 h-4" />
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

      {/* Mobile Search Overlay — same fields as desktop, stacked for small screens */}
      {showSearchOverlay && (
        <div
          ref={mobileSearchOverlayRef}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => {
            setShowSearchOverlay(false);
            setShowResults(false);
          }}
        >
          <div className="bg-white h-full" onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col bg-slate-50 relative">
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Search Appointments</h3>
                  <button
                    onClick={() => {
                      setShowSearchOverlay(false);
                      setShowResults(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            <div className="flex flex-col gap-2.5 p-3 bg-white border-b border-slate-200">
              {/* Keywords + Operator */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 block">Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="h-8 py-1 px-2 text-[13px] border border-slate-300 rounded-md w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter keywords..."
                    value={advancedFilters.keywords}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, keywords: e.target.value })}
                  />
                  {/* Operator — 3D toggle switch */}
                  <div className="inline-flex rounded-lg bg-gray-100 p-0.5 shadow-inner shrink-0">
                    {(['AND', 'OR'] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setAdvancedFilters({ ...advancedFilters, operator: op })}
                        className={`relative z-10 h-8 px-4 text-xs rounded-md transition-all duration-200 ${
                          advancedFilters.operator === op
                            ? 'bg-primary text-primary-foreground font-bold shadow-md'
                            : 'text-gray-500 font-medium hover:text-gray-700'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 block">in Service Type</label>
                <div className="relative w-full">
                  <select
                    className="h-8 py-1 px-2 text-[13px] border border-slate-300 rounded-md w-full bg-slate-50 focus:bg-white appearance-none pr-9 focus:ring-2 focus:ring-blue-500"
                    value={advancedFilters.serviceType}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, serviceType: e.target.value })}
                  >
                    <option>Any Service Type</option>
                    <option>Individual Therapy</option>
                    <option>Group Therapy</option>
                    <option>Assessment</option>
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Medication Review</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 block">between</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="h-8 px-2 text-[12px] border border-slate-300 rounded-md flex-1 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    value={advancedFilters.dateFrom}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                  />
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">and</span>
                  <input
                    type="date"
                    className="h-8 px-2 text-[12px] border border-slate-300 rounded-md flex-1 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    value={advancedFilters.dateTo}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                  />
                </div>
              </div>

              {/* Provider */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 block">for Provider</label>
                <div className="relative w-full">
                  <select
                    className="h-8 py-1 px-2 text-[13px] border border-slate-300 rounded-md w-full bg-slate-50 focus:bg-white appearance-none pr-9 focus:ring-2 focus:ring-blue-500"
                    value={advancedFilters.provider}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, provider: e.target.value })}
                  >
                    <option value="Admin, Ensoftek">Admin, Ensoftek</option>
                    {ADVANCED_SEARCH_PROVIDER_TYPE_OPTIONS.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                    {providersToShow.map((p) => (
                      <option key={p.id} value={p.label}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Facility */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 block">at Facility</label>
                <div className="relative w-full">
                  <select
                    className="h-8 py-1 px-2 text-[13px] border border-slate-300 rounded-md w-full bg-slate-50 focus:bg-white appearance-none pr-9 focus:ring-2 focus:ring-blue-500"
                    value={advancedFilters.facility}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, facility: e.target.value })}
                  >
                    <option>All Facilities</option>
                    {optionsDrawerLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white pt-3 mt-1 border-t border-gray-200">
                <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1 h-9 bg-primary text-primary-foreground hover:brightness-110 text-[13px] font-semibold rounded-md transition-colors"
                  onClick={() => setShowResults(true)}
                >
                  Submit
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-9 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[13px] font-medium rounded-md transition-colors"
                  onClick={() => {
                    setShowSearchOverlay(false);
                    setShowResults(false);
                  }}
                >
                  Return
                </Button>
                </div>
              </div>

              {showResults && (
                <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-between items-center text-[13px] font-medium text-blue-700 bg-blue-50/50 p-2 rounded-md border border-blue-100">
                    <span>{searchResults.length} Results found</span>
                    <span>Total: {totalResultsDurationMinutes} mins</span>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="flex items-center gap-2 mt-2 mb-3">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-[#0ea5e9] text-[#0ea5e9] font-semibold text-[13px] rounded-md shadow-sm hover:bg-[#f0f9ff] transition-colors">
                      <Printer size={14} />
                      Print
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-[#0ea5e9] text-[#0ea5e9] font-semibold text-[13px] rounded-md shadow-sm hover:bg-[#f0f9ff] transition-colors">
                      <Download size={14} />
                      Export CSV
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pb-8">
                    {searchResults.map((event) => {
                      const duration = event.durationMins;
                      const providerName = event.provider;
                      const residentName = event.resident;
                      const programName = event.program;
                      const commentText = event.comments?.trim();
                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => navigate(`/view-appointment/${event.id}`)}
                          className="w-full text-left bg-white rounded-lg border-l-[4px] border-l-blue-500 border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                        >
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2 pb-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-[14px] font-bold text-slate-900 leading-tight truncate">{event.category}</h4>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded shrink-0">
                                {event.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[12px] text-slate-700 font-semibold">
                              <span>{event.date} • {event.time}</span>
                              <span className="text-slate-300">•</span>
                              <span>{duration} Mins</span>
                            </div>

                            <div className="flex items-center gap-3 text-[12px] text-slate-500 mt-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Users size={14} className="shrink-0 text-slate-400" />
                                <span className="truncate">{residentName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Folder size={14} className="shrink-0 text-slate-400" />
                                <span className="truncate">{programName}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                                <ProviderDoctorIcon size={14} className="shrink-0 text-slate-400 fill-current" />
                                <span className="truncate">{providerName}</span>
                              </div>
                              {commentText && (
                                <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
                                  <MessageSquare size={12} className="shrink-0 mt-0.5" />
                                  <span className="italic line-clamp-1">"{commentText}"</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 text-slate-300 group-hover:text-blue-500 pt-1 transition-colors">
                            <ChevronRight size={22} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay - Options (Go to Today + Locations, Providers, Programs) */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-56 h-full shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Options</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-0.5 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col min-h-0">
              <div className="flex-shrink-0 pt-2.5 border-t border-gray-200">
                <button
                  onClick={() => {
                    goToToday();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full py-2 px-2.5 rounded-md text-sm transition-colors ${
                    isTodayActive()
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="font-medium">Go to Today</span>
                </button>
              </div>

              {/* Mini Calendar - monthly view matching desktop */}
              <div className="w-full bg-white border border-slate-200 rounded-md p-2.5 mb-4 flex-shrink-0 mt-2.5">
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-[14px] font-bold text-[#1e293b]">{format(selectedDate, 'MMMM yyyy')}</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onDateChange(subMonths(selectedDate, 1))}
                      className="p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDateChange(addMonths(selectedDate, 1))}
                      className="p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1.5">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <span key={day} className="text-[10px] font-semibold text-slate-400 uppercase">{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {(() => {
                    const monthStart = startOfMonth(selectedDate);
                    const startOffset = (monthStart.getDay() + 6) % 7;
                    const daysInMonth = getDaysInMonth(selectedDate);
                    const selectedDay = selectedDate.getDate();
                    const cells = [];
                    for (let i = 0; i < startOffset; i++) {
                      cells.push(<div key={`empty-${i}`} />);
                    }
                    for (let d = 1; d <= daysInMonth; d++) {
                      const isActive = d === selectedDay;
                      cells.push(
                        <button
                          key={d}
                          type="button"
                          onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d))}
                          className={`w-6 h-6 mx-auto flex items-center justify-center text-[12px] rounded-full hover:bg-slate-100 ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}`}
                        >
                          {d}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-20 pr-2 custom-scrollbar">
                {/* Locations accordion */}
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === 'locations' ? '' : 'locations')}
                    className="w-full flex justify-between items-center py-2 focus:outline-none"
                  >
                    <h3 className="text-[15px] font-bold text-[#1e293b]">Locations</h3>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform ${openSection === 'locations' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'locations' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Search locations..."
                          value={optionsSearchLocations}
                          onChange={(e) => setOptionsSearchLocations(e.target.value)}
                          className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col mt-1 border border-slate-200 rounded-md overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
                        {optionsDrawerLocations
                          .filter(loc => !optionsSearchLocations.trim() || loc.toLowerCase().includes(optionsSearchLocations.toLowerCase()))
                          .map((location) => (
                            <label key={location} className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100 bg-white hover:bg-slate-50 cursor-pointer last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedLocationIds.includes(location)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedLocationIds(prev => [...prev, location]);
                                  else setSelectedLocationIds(prev => prev.filter(id => id !== location));
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{location}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Providers accordion */}
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === 'providers' ? '' : 'providers')}
                    className="w-full flex justify-between items-center py-2 focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-[#1e293b]">Providers</h3>
                      <Filter size={14} className="text-slate-400" />
                    </div>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform ${openSection === 'providers' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'providers' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Search providers..."
                          value={optionsSearchProviders}
                          onChange={(e) => setOptionsSearchProviders(e.target.value)}
                          className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col mt-1 border border-slate-200 rounded-md overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border-b border-slate-200 flex-shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-[#ef4444] flex items-center justify-center text-white">
                              <Minus size={12} />
                            </div>
                            <span className="text-sm text-slate-600 font-medium">Provider</span>
                          </div>
                          <span className="text-sm text-slate-600 font-medium">Clients</span>
                        </div>
                        {providersToShow
                          .filter(p => !optionsSearchProviders.trim() || p.label.toLowerCase().includes(optionsSearchProviders.toLowerCase()))
                          .map((provider) => {
                            const isSelected = selectedProvidersList.includes(provider.value);
                            const parts = provider.label.includes(',') ? provider.label.split(/,\s*/) : [provider.label, ''];
                            const name = parts[0] || provider.label;
                            const credential = parts[1] || '';
                            return (
                              <label
                                key={provider.id}
                                className={`flex justify-between items-center px-3 py-2.5 border-b border-slate-100 cursor-pointer last:border-b-0 ${isSelected ? 'bg-blue-50/50 hover:bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (!onProviderSelectionChange) return;
                                      if (isSelected) {
                                        onProviderSelectionChange(selectedProvidersList.filter(id => id !== provider.value));
                                      } else {
                                        onProviderSelectionChange([...selectedProvidersList, provider.value]);
                                      }
                                    }}
                                    className={`w-4 h-4 mt-0.5 rounded focus:ring-[#f97316] ${isSelected ? 'border-orange-500 text-[#f97316]' : 'border-slate-300 text-blue-600'}`}
                                  />
                                  <span className="text-sm text-slate-700 leading-tight">
                                    {name}
                                    {credential && (
                                      <>
                                        , <br /><span className="text-slate-500">{credential}</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                                <span className="text-sm text-blue-600 font-medium">{provider.clientCount}</span>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Programs accordion */}
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === 'programs' ? '' : 'programs')}
                    className="w-full flex justify-between items-center py-2 focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-[#1e293b]">Programs</h3>
                      <Filter size={14} className="text-slate-400" />
                    </div>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform ${openSection === 'programs' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'programs' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Search programs..."
                          value={optionsSearchPrograms}
                          onChange={(e) => setOptionsSearchPrograms(e.target.value)}
                          className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col mt-1 border border-slate-200 rounded-md overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
                        {optionsDrawerPrograms
                          .filter(prog => !optionsSearchPrograms.trim() || prog.toLowerCase().includes(optionsSearchPrograms.toLowerCase()))
                          .map((program) => (
                            <label key={program} className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100 bg-white hover:bg-slate-50 cursor-pointer last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedProgramIds.includes(program)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedProgramIds(prev => [...prev, program]);
                                  else setSelectedProgramIds(prev => prev.filter(id => id !== program));
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{program}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Provider Banner - shows avatar + provider name + badge */}
      {activeProvider && (
        <div className={`${activeTab === 'provider' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200' : 'bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200'} px-4 py-2`}>
          <div className="flex flex-row items-center justify-center gap-3 w-full">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
              <img 
                src="/profile-placeholder.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1745433972680-6f4d34b602c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }}
              />
            </div>
            <h3 className={`text-sm font-semibold ${activeTab === 'provider' ? 'text-blue-900' : 'text-green-900'} truncate`}>{activeProvider.label}</h3>
            {activeTab === 'provider' && activeProvider.clientCount > 0 && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 font-medium shrink-0">
                {activeProvider.clientCount} clients
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile View Switchers - Provider View and Calendar View dropdowns side by side */}
      <div className="md:hidden px-4 py-1 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <select
              className="w-full h-9 appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value as 'provider' | 'room' | 'patient')}
            >
              <option value="provider">Provider View</option>
              <option value="room">Room View</option>
              <option value="patient">Patient View</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-500">
              <ChevronDown size={14} />
            </div>
          </div>
          <div className="relative flex-1 min-w-0">
            <select
              className="w-full h-9 appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              value={view}
              onChange={(e) => onViewChange(e.target.value as 'day' | 'week' | 'month' | 'agenda')}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="agenda">Agenda</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-500">
              <ChevronDown size={14} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsSheetOpen(true)}
            className="flex items-center justify-center w-9 h-9 border rounded-lg transition-colors text-slate-600 border-gray-200 hover:bg-slate-100"
            aria-label="Open schedule settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      {/* Calendar Body - Conditional layout based on provider layout mode */}
      <div className="flex-1 overflow-y-auto overflow-x-clip bg-white smart-scrollbar calendar-main-scroll w-full min-w-0">
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
                {/* Provider Day Calendar Content */}
                <div className="h-full overflow-y-auto smart-scrollbar calendar-main-scroll">
                  {/* All-day events */}
                  <DayScheduleTimelineRow timeLabel="All day" variant="allDay">
                    {allDayEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onViewEvent={handleViewEvent}
                        onEditEvent={handleEditEvent}
                        activeEventId={activeEventId}
                        onActivateEventId={setActiveEventId}
                      />
                    ))}
                  </DayScheduleTimelineRow>
                  
                  {/* Time slots — mobile time gutter + continuous vertical rule */}
                  <div className="relative">
                    {timeSlots.map((time, index) => (
                      <DayScheduleTimelineRow key={index} timeLabel={time}>
                        {timeEvents
                          .filter(event => {
                            const eventHour = parseInt(event.startTime.split(':')[0], 10);
                            return eventHour === index;
                          })
                          .map(event => (
                            <EventCard
                              key={event.id}
                              event={event}
                              onViewEvent={handleViewEvent}
                              onEditEvent={handleEditEvent}
                              activeEventId={activeEventId}
                              onActivateEventId={setActiveEventId}
                            />
                          ))}
                      </DayScheduleTimelineRow>
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
                      <DayScheduleTimelineRow timeLabel="All day" variant="allDay">
                        {allDayEvents.map(event => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onViewEvent={handleViewEvent}
                            activeEventId={activeEventId}
                            onActivateEventId={setActiveEventId}
                          />
                        ))}
                      </DayScheduleTimelineRow>
                      
                      {/* Time slots — mobile time gutter */}
                      <div className="relative">
                        {timeSlots.map((time, index) => (
                          <DayScheduleTimelineRow key={index} timeLabel={time}>
                            {timeEvents
                              .filter(event => {
                                const eventHour = parseInt(event.startTime.split(':')[0], 10);
                                return eventHour === index;
                              })
                              .map(event => (
                                <EventCard
                                  key={event.id}
                                  event={event}
                                  onViewEvent={handleViewEvent}
                                  activeEventId={activeEventId}
                                  onActivateEventId={setActiveEventId}
                                />
                              ))}
                          </DayScheduleTimelineRow>
                        ))}
                      </div>
                    </div>
                  ) : view === 'week' ? (
                    <WeekView 
                      selectedDate={selectedDate} 
                      events={myCalendarFilteredEvents}
                      timeSlots={timeSlots}
                      onEditEvent={handleEditEvent}
                      onDateChange={onDateChange}
                    />
                  ) : (
                    <MonthView 
                      selectedDate={selectedDate} 
                      events={myCalendarFilteredEvents}
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
                <DayScheduleTimelineRow timeLabel="All day" variant="allDay">
                  {allDayEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEditEvent={handleEditEvent}
                      activeEventId={activeEventId}
                      onActivateEventId={setActiveEventId}
                    />
                  ))}
                </DayScheduleTimelineRow>
                
                {/* Time slots — mobile time gutter */}
                <div className="relative">
                  {timeSlots.map((time, index) => (
                    <DayScheduleTimelineRow key={index} timeLabel={time}>
                      {timeEvents
                        .filter(event => {
                          const eventHour = parseInt(event.startTime.split(':')[0], 10);
                          return eventHour === index;
                        })
                        .map(event => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onEditEvent={handleEditEvent}
                            activeEventId={activeEventId}
                            onActivateEventId={setActiveEventId}
                          />
                        ))}
                    </DayScheduleTimelineRow>
                  ))}
                </div>
              </div>
            ) : view === 'week' ? (
              <div className="h-full w-full overflow-hidden">
                <WeekView 
                  selectedDate={selectedDate} 
                  events={myCalendarFilteredEvents}
                  timeSlots={timeSlots}
                  onEditEvent={handleEditEvent}
                  onDateChange={onDateChange}
                />
              </div>
            ) : (
              <MonthView 
                selectedDate={selectedDate} 
                events={myCalendarFilteredEvents}
                onEditEvent={handleEditEvent}
              />
            )}
          </>
        )}
      </div>

      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-800">Search Appointments</h2>
              <button onClick={() => setIsSearchModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md ml-2">
                <X size={18} />
              </button>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Keywords</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      className="h-7 flex-1 rounded-md border border-slate-300 bg-white px-2 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      value={advancedFilters.keywords}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, keywords: e.target.value })}
                    />
                    <div className="inline-flex h-7 items-stretch rounded-md border border-slate-300 bg-slate-100 overflow-hidden shrink-0">
                      {(['AND', 'OR'] as const).map((op, idx) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setAdvancedFilters({ ...advancedFilters, operator: op })}
                          className={`h-full min-w-[2rem] px-1.5 text-[11px] font-semibold leading-none transition-all duration-200 ${
                            advancedFilters.operator === op
                              ? 'bg-primary text-primary-foreground'
                              : 'text-gray-500 hover:text-gray-800'
                          } ${idx === 1 ? 'border-l border-slate-300' : ''}`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Service Type</label>
                  <div className="relative">
                    <select
                      className="h-7 w-full appearance-none rounded-md border border-slate-300 bg-white py-0 pl-2 pr-7 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      value={advancedFilters.serviceType}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, serviceType: e.target.value })}
                    >
                      <option>Any Service Type</option>
                      <option>Individual Therapy</option>
                      <option>Group Therapy</option>
                      <option>Assessment</option>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                      <option>Medication Review</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" aria-hidden />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    className="h-7 w-full rounded-md border border-slate-300 bg-white px-2 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    value={advancedFilters.dateFrom}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    className="h-7 w-full rounded-md border border-slate-300 bg-white px-2 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    value={advancedFilters.dateTo}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Provider</label>
                  <div className="relative">
                    <select
                      className="h-7 w-full appearance-none rounded-md border border-slate-300 bg-white py-0 pl-2 pr-7 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      value={advancedFilters.provider}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, provider: e.target.value })}
                    >
                      <option value="Admin, Ensoftek">Admin, Ensoftek</option>
                      {ADVANCED_SEARCH_PROVIDER_TYPE_OPTIONS.map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                      {providersToShow.map((p) => (
                        <option key={p.id} value={p.label}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" aria-hidden />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Facility</label>
                  <div className="relative">
                    <select
                      className="h-7 w-full appearance-none rounded-md border border-slate-300 bg-white py-0 pl-2 pr-7 text-[12px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      value={advancedFilters.facility}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, facility: e.target.value })}
                    >
                      <option>All Facilities</option>
                      {optionsDrawerLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setHasSearched(false)} className="px-4 py-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Clear</button>
                <button onClick={() => setHasSearched(true)} className="px-4 py-1.5 text-[12px] font-semibold text-white bg-primary text-primary-foreground rounded-md hover:brightness-110">Submit</button>
              </div>
            </div>

            {hasSearched && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0">
                  <div className="text-[12px] font-medium text-slate-600">
                    <span className="text-blue-700 font-bold">{searchResults.length} Results found</span> <span className="mx-2 text-slate-300">|</span> Total: {totalResultsDurationMinutes} mins
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#0ea5e9] text-[#0ea5e9] font-semibold text-[12px] rounded shadow-sm hover:bg-[#f0f9ff]">
                      <Printer size={13} /> Print
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#0ea5e9] text-[#0ea5e9] font-semibold text-[12px] rounded shadow-sm hover:bg-[#f0f9ff]">
                      <Download size={13} /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="sticky top-0 bg-slate-50 border-y border-slate-200 z-10">
                      <tr>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date-Time</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration (Mins)</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resident (Lived Name)</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {searchResults.map((event) => {
                        return (
                          <tr key={event.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 last:border-0">
                            <td className="py-4 px-4 text-[13px] text-slate-600 whitespace-nowrap">{event.date} {event.time}:00</td>
                            <td className="py-4 px-4 text-[13px] text-slate-600">{event.durationMins}</td>
                            <td className="py-4 px-4 text-[13px] text-slate-600">{event.program}</td>
                            <td className="py-4 px-4 text-[13px] text-slate-600">{event.provider}</td>
                            <td className="py-4 px-4 text-[13px] text-slate-600">{event.category}</td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide border border-blue-200/50">{event.status}</span>
                            </td>
                            <td className="py-4 px-4 text-[13px] text-slate-600">{event.resident}</td>
                            <td className="py-4 px-4 text-[13px] text-slate-600 max-w-[200px] truncate" title={event.comments}>{event.comments}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-white">
                  <span className="text-[12px] text-slate-500">Showing 1 to {searchResults.length} of {searchResults.length} entries</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2.5 py-1 border border-slate-200 rounded text-[12px] text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-[12px] text-blue-600 font-medium">1</button>
                    <button className="px-2.5 py-1 border border-slate-200 rounded text-[12px] text-slate-600 hover:bg-slate-50">Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isSettingsSheetOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSettingsSheetOpen(false)}
          />

          <div className="relative bg-white w-full rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-300 ease-out">
            <div className="flex flex-col items-center pt-3 pb-2 border-b border-slate-100 shrink-0">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full mb-3" />
              <div className="w-full flex justify-between items-center px-4">
                <h3 className="text-base font-bold text-slate-800">Schedule Settings</h3>
                <button
                  onClick={() => setIsSettingsSheetOpen(false)}
                  className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
                  aria-label="Close schedule settings"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1 pb-8">
              <button
                className="flex items-center gap-3 w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={() => {
                  handleTransfer();
                  setIsSettingsSheetOpen(false);
                }}
              >
                <ArrowRightLeft size={18} className="text-slate-400" />
                Transfer
              </button>
              <button
                className="flex items-center gap-3 w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={() => {
                  handlePrint();
                  setIsSettingsSheetOpen(false);
                }}
              >
                <Printer size={18} className="text-slate-400" />
                Print
              </button>
              <button
                className="flex items-center gap-3 w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={handleRefresh}
              >
                <RefreshCw size={18} className="text-slate-400" />
                Refresh
              </button>
              <button
                className="flex items-center gap-3 w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={handleExportToOutlook}
              >
                <Upload size={18} className="text-slate-400" />
                Export to Outlook
              </button>

              <hr className="my-1 border-slate-100" />

              <div className="flex items-center justify-between w-full py-3.5 px-2 hover:bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 text-[14px] text-slate-700 font-medium">
                  <CalendarLucide size={18} className="text-slate-400" />
                  My calendar
                </div>
                <Switch
                  checked={isMyCalendar}
                  onCheckedChange={handleMyCalendarToggle}
                  className="ml-2"
                />
              </div>

              <hr className="my-1 border-slate-100" />

              <button
                className="flex items-center justify-between w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={() => setProviderLayoutMode((prev) => (prev === 'tabs' ? 'vertical' : prev === 'vertical' ? 'columns' : 'tabs'))}
              >
                <div className="flex items-center gap-3">
                  <Menu size={18} className="text-slate-400" />
                  Provider Layout
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button
                className="flex items-center justify-between w-full py-3.5 px-2 text-[14px] text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                onClick={() => handleColorSchemeChange('facility')}
              >
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-slate-400" />
                  Color Schemes
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button - New Appointment */}
      <button
        onClick={() => navigate('/new-appointment')}
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30 active:scale-95"
        aria-label="New Appointment"
      >
        <PlusIcon className="w-5 h-5" />
      </button>

      {/* Transfer Dialog */}
      <TransferDialog
        isOpen={showTransferDialog}
        onClose={handleTransferDialogClose}
        providers={providersToShow}
        onTransfer={handleTransferComplete}
      />
    </div>
  );
};
