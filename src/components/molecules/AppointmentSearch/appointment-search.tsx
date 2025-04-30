import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Tooltip } from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Label } from '../../ui/label';
import { ScrollArea } from '../../atoms/ScrollArea/scroll-area';
import { toast } from '../../atoms/Toast/use-toast';
import { Spinner } from '../../atoms/Spinner/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "../../ui/dropdown-menu";
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  StarIcon,
  BookmarkIcon,
  ClockIcon as TimeIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  IdentificationIcon,
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export interface AppointmentSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: (filters: SearchFilters) => Promise<void>;
  recentSearches?: string[];
  suggestions?: string[];
  savedFilters?: SavedFilter[];
  onSaveFilter?: (filter: SavedFilter) => void;
  isLoading?: boolean;
}

interface Service {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  name: string;
  role: string;
}

interface Program {
  id: string;
  name: string;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
  isDefault?: boolean;
}

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ForwardRefExoticComponent<any>;
  filter: Partial<SearchFilters>;
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'today',
    label: 'Today',
    icon: CalendarIcon,
    filter: {
      dateRange: {
        start: new Date(),
        end: new Date(),
      }
    }
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    icon: ClockIcon,
    filter: {
      status: ['upcoming']
    }
  },
  {
    id: 'urgent',
    label: 'Urgent',
    icon: BoltIcon,
    filter: {
      priority: 'urgent'
    }
  },
  {
    id: 'pending',
    label: 'Pending',
    icon: PendingIcon,
    filter: {
      status: ['pending']
    }
  }
];

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)' },
  { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM)' },
  { value: 'evening', label: 'Evening (4:00 PM - 8:00 PM)' }
];

const APPOINTMENT_TYPES = [
  { value: 'individual', label: 'Individual', icon: UserIcon },
  { value: 'group', label: 'Group', icon: UserGroupIcon },
  { value: 'crisis', label: 'Crisis', icon: BoltIcon }
];

const APPOINTMENT_STATUS = [
  { value: 'upcoming', label: 'Upcoming', icon: ClockIcon },
  { value: 'completed', label: 'Completed', icon: CheckCircleIcon },
  { value: 'cancelled', label: 'Cancelled', icon: XCircleIcon },
  { value: 'pending', label: 'Pending', icon: PendingIcon }
];

// Mock data for services (replace with actual data from your API)
const SERVICES: Service[] = [
  { id: 'adaptive-skills', name: 'Adaptive Skills Assessment' },
  { id: 'adaptive-therapy1', name: 'Adaptive Skills Therapy1' },
  { id: 'adaptive-therapy4', name: 'Adaptive Skills Therapy4' },
  { id: 'addiction', name: 'Addiction Sessions' },
  { id: 'admission', name: 'AdMission' },
  { id: 'adolescent', name: 'Adolescent' },
  { id: 'adult-assessment', name: 'Adult Open Access MH Assessment' },
  { id: 'adult-prp-blended', name: 'Adult PRP Billing- Blended' },
  { id: 'adult-prp-offsite', name: 'Adult PRP Billing- Offsite' },
  { id: 'adult-prp-onsite', name: 'Adult PRP Billing- Onsite' },
  { id: 'alcohol', name: 'Alcohol Sessions' },
  { id: 'anger-expression', name: 'Anger Expression' },
  { id: 'asam', name: 'ASAM Assessment' },
  { id: 'ats-group', name: 'ATS - Group Therapy' },
  { id: 'ats-methadone', name: 'ATS - Methadone Weekly Bundle and Take Outs - MAT OTP' },
  { id: 'behavioral-problems1', name: 'Behavioral Problem\'s1' },
  { id: 'behavioral-problems2', name: 'Behavioral Problems2' }
];

// Mock data for providers (replace with actual data)
const PROVIDERS: Provider[] = [
  { id: 'dr-smith', name: 'Dr. Smith', role: 'Psychiatrist' },
  { id: 'dr-jones', name: 'Dr. Jones', role: 'Therapist' },
  { id: 'dr-wilson', name: 'Dr. Wilson', role: 'Clinical Psychologist' },
  { id: 'dr-brown', name: 'Dr. Brown', role: 'Counselor' }
];

// Mock data for programs (replace with actual data)
const PROGRAMS: Program[] = [
  { id: 'mental-health', name: 'Mental Health Program' },
  { id: 'addiction-recovery', name: 'Addiction Recovery' },
  { id: 'behavioral-therapy', name: 'Behavioral Therapy' },
  { id: 'youth-counseling', name: 'Youth Counseling' }
];

export interface SearchFilters {
  query: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  appointmentTypes?: ('individual' | 'group' | 'crisis')[];
  status?: ('upcoming' | 'completed' | 'cancelled' | 'pending')[];
  providers?: string[];
  facilities?: string[];
  serviceId?: string;
  providerId?: string;
  programId?: string;
  patientInfo?: {
    name?: string;
    id?: string;
    phone?: string;
  };
  timePreference?: 'morning' | 'afternoon' | 'evening';
  priority?: 'normal' | 'urgent';
  sortBy?: 'date' | 'name' | 'provider' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export const AppointmentSearch: React.FC<AppointmentSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  recentSearches = [],
  suggestions = [],
  savedFilters = [],
  onSaveFilter,
  isLoading = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchQuery,
    appointmentTypes: [],
    status: [],
    providers: [],
    facilities: [],
    sortBy: 'date',
    sortOrder: 'asc'
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, query: value }));
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDropdownOpen(true);
    } else if (e.key === 'Enter') {
      applySearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      query: '',
      appointmentTypes: [],
      status: [],
      providers: [],
      facilities: [],
      sortBy: 'date',
      sortOrder: 'asc'
    });
    setActiveQuickFilters([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const toggleQuickFilter = (filterId: string) => {
    setActiveQuickFilters(prev => {
      const isActive = prev.includes(filterId);
      if (isActive) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });

    const quickFilter = QUICK_FILTERS.find(f => f.id === filterId);
    if (quickFilter) {
      setFilters(prev => ({
        ...prev,
        ...quickFilter.filter
      }));
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const validateFilters = (): boolean => {
    // Reset previous error
    setSearchError(null);

    // Validate date range
    if (filters.dateRange?.start && filters.dateRange?.end) {
      if (filters.dateRange.start > filters.dateRange.end) {
        setSearchError('Start date cannot be after end date');
        return false;
      }
    }

    // Validate at least one filter is selected
    const hasActiveFilters = 
      filters.query ||
      filters.dateRange ||
      (filters.appointmentTypes && filters.appointmentTypes.length > 0) ||
      (filters.status && filters.status.length > 0) ||
      filters.serviceId ||
      filters.providerId ||
      filters.programId ||
      filters.timePreference;

    if (!hasActiveFilters) {
      setSearchError('Please select at least one search criteria');
      return false;
    }

    return true;
  };

  const applySearch = async () => {
    if (!validateFilters()) {
      toast({
        title: "Invalid Search",
        description: searchError || 'Invalid search criteria',
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      
      if (onSearch) {
        await onSearch(filters);
      }
      
      setIsDropdownOpen(false);
      toast({
        title: "Search Complete",
        description: "Successfully retrieved appointments",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching';
      setSearchError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveFilter = () => {
    if (onSaveFilter) {
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name: `Filter ${savedFilters.length + 1}`,
        filters: { ...filters }
      };
      onSaveFilter(newFilter);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by patient name, ID, provider, or appointment type..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          className="h-11 pl-10 pr-32 w-full text-sm text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search appointments"
          disabled={isSearching || isLoading}
        />
        
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200" />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isSearching || isLoading ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="p-1.5 hover:bg-primary/10 rounded-full text-muted-foreground hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Clear search"
                  disabled={isSearching || isLoading}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              
              <Tooltip content="Advanced filters">
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  className={cn(
                    "p-1.5 hover:bg-primary/10 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                    showAdvancedFilters ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                  disabled={isSearching || isLoading}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-popover rounded-lg border border-border shadow-lg z-50">
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_FILTERS.map((filter) => (
                <Badge 
                  key={filter.id}
                  variant={activeQuickFilters.includes(filter.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    activeQuickFilters.includes(filter.id)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary hover:border-primary"
                  )}
                  onClick={() => toggleQuickFilter(filter.id)}
                >
                  <filter.icon className="w-4 h-4 mr-1.5" />
                  {filter.label}
                </Badge>
              ))}
            </div>

            {savedFilters.length > 0 && (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2.5">Saved Filters</h3>
                  <ScrollArea className="h-28">
                    <div className="space-y-1">
                      {savedFilters.map((filter) => (
                        <button
                          key={filter.id}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md flex items-center justify-between transition-all duration-200"
                          onClick={() => {
                            setFilters(filter.filters);
                            setSearchQuery(filter.filters.query || '');
                          }}
                        >
                          <div className="flex items-center">
                            <BookmarkIcon className="w-4 h-4 mr-2.5 text-muted-foreground" />
                            {filter.name}
                          </div>
                          {filter.isDefault && (
                            <StarIcon className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <DropdownMenuSeparator className="my-4" />
              </>
            )}

            {showAdvancedFilters && (
              <div className="space-y-5 mb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Service Type</Label>
                      <Select
                        value={filters.serviceId}
                        onValueChange={(value) => handleFilterChange('serviceId', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Service" className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[200px]">
                            {SERVICES.map((service) => (
                              <SelectItem 
                                key={service.id} 
                                value={service.id}
                                className="text-foreground py-2"
                              >
                                <div className="truncate max-w-[300px]">
                                  {service.name}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Provider</Label>
                      <Select
                        value={filters.providerId}
                        onValueChange={(value) => handleFilterChange('providerId', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Provider" className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDERS.map((provider) => (
                            <SelectItem 
                              key={provider.id} 
                              value={provider.id}
                              className="text-foreground py-2"
                            >
                              <div className="flex flex-col">
                                <span className="truncate max-w-[300px]">{provider.name}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[300px]">{provider.role}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Program</Label>
                      <Select
                        value={filters.programId}
                        onValueChange={(value) => handleFilterChange('programId', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Program" className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAMS.map((program) => (
                            <SelectItem 
                              key={program.id} 
                              value={program.id}
                              className="text-foreground py-2"
                            >
                              <div className="truncate max-w-[300px]">
                                {program.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Time Preference</Label>
                      <Select
                        value={filters.timePreference}
                        onValueChange={(value) => handleFilterChange('timePreference', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Select time" className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem 
                              key={slot.value} 
                              value={slot.value} 
                              className="text-foreground py-2"
                            >
                              <div className="truncate max-w-[300px]">
                                {slot.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Date Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10 truncate",
                              !filters.dateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {filters.dateRange?.start ? (
                                filters.dateRange.end ? (
                                  <>
                                    {format(filters.dateRange.start, "LLL dd, y")} -{" "}
                                    {format(filters.dateRange.end, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(filters.dateRange.start, "LLL dd, y")
                                )
                              ) : (
                                <span>Select date range</span>
                              )}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="border-b border-border p-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Select
                                value={filters.dateRange?.start ? format(filters.dateRange.start, "MMMM") : undefined}
                                onValueChange={(value) => {
                                  const currentDate = filters.dateRange?.start || new Date();
                                  const newDate = new Date(currentDate);
                                  newDate.setMonth(new Date(Date.parse(`${value} 1, 2000`)).getMonth());
                                  handleFilterChange('dateRange', {
                                    start: newDate,
                                    end: filters.dateRange?.end
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={filters.dateRange?.start ? filters.dateRange.start.getFullYear().toString() : undefined}
                                onValueChange={(value) => {
                                  const currentDate = filters.dateRange?.start || new Date();
                                  const newDate = new Date(currentDate);
                                  newDate.setFullYear(parseInt(value));
                                  handleFilterChange('dateRange', {
                                    start: newDate,
                                    end: filters.dateRange?.end
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={filters.dateRange?.start}
                            selected={{
                              from: filters.dateRange?.start,
                              to: filters.dateRange?.end
                            }}
                            onSelect={(range) => {
                              handleFilterChange('dateRange', range ? {
                                start: range.from as Date,
                                end: range.to as Date
                              } : undefined)
                            }}
                            numberOfMonths={2}
                            showOutsideDays={false}
                            className="p-4"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2">Appointment Types</Label>
                    <div className="flex flex-wrap gap-2">
                      {APPOINTMENT_TYPES.map((type) => (
                        <Badge
                          key={type.value}
                          variant={filters.appointmentTypes?.includes(type.value as any) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all duration-200",
                            filters.appointmentTypes?.includes(type.value as any)
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
                          )}
                          onClick={() => {
                            const types = filters.appointmentTypes || [];
                            const newTypes = types.includes(type.value as any)
                              ? types.filter(t => t !== type.value)
                              : [...types, type.value as any];
                            handleFilterChange('appointmentTypes', newTypes);
                          }}
                        >
                          <type.icon className="w-4 h-4 mr-1.5" />
                          {type.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2">Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {APPOINTMENT_STATUS.map((status) => (
                        <Badge
                          key={status.value}
                          variant={filters.status?.includes(status.value as any) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all duration-200",
                            filters.status?.includes(status.value as any)
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
                          )}
                          onClick={() => {
                            const statuses = filters.status || [];
                            const newStatuses = statuses.includes(status.value as any)
                              ? statuses.filter(s => s !== status.value)
                              : [...statuses, status.value as any];
                            handleFilterChange('status', newStatuses);
                          }}
                        >
                          <status.icon className="w-4 h-4 mr-1.5" />
                          {status.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Sort By</Label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => handleFilterChange('sortBy', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Sort by..." className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date" className="text-foreground py-2">Date</SelectItem>
                          <SelectItem value="name" className="text-foreground py-2">Patient Name</SelectItem>
                          <SelectItem value="provider" className="text-foreground py-2">Provider</SelectItem>
                          <SelectItem value="status" className="text-foreground py-2">Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2">Order</Label>
                      <Select
                        value={filters.sortOrder}
                        onValueChange={(value) => handleFilterChange('sortOrder', value)}
                      >
                        <SelectTrigger className="text-foreground h-10">
                          <SelectValue placeholder="Order..." className="text-muted-foreground truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc" className="text-foreground py-2">Ascending</SelectItem>
                          <SelectItem value="desc" className="text-foreground py-2">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchError && (
              <div className="mt-2 text-sm text-destructive">
                {searchError}
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3 p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={handleSaveFilter}
                disabled={isSearching || isLoading}
              >
                <BookmarkIcon className="w-4 h-4 mr-1.5" />
                Save Filter
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => {
                    setShowAdvancedFilters(false);
                    setIsDropdownOpen(false);
                  }}
                  disabled={isSearching || isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={applySearch}
                  className={cn(
                    "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200",
                    "flex items-center gap-2",
                    (isSearching || isLoading) && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isSearching || isLoading}
                >
                  {isSearching || isLoading ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 