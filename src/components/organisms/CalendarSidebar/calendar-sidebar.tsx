import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  EllipsisHorizontalIcon,
  Bars3Icon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format, subDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Combobox } from '../../atoms/Combobox/Combobox';
import { AppointmentModal } from '../AppointmentModal/appointment-modal';

/**
 * CalendarSidebar Component
 * 
 * Left navigation sidebar for the calendar view with mini calendar and calendar list
 */
interface CalendarSidebarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCurrentMonthChange: (date: Date) => void;
  onCreateAppointment: () => void;
  selectedProviders?: string[];
  onProviderSelectionChange?: (providers: string[]) => void;
}

// Sample location data for behavioral health clinics
const locationOptions = [
  { id: 'all', value: 'all', label: 'All Locations', status: 'active' },
  { id: 'main_campus', value: 'main_campus', label: 'Main Campus - Downtown', status: 'active' },
  { id: 'north_clinic', value: 'north_clinic', label: 'North Side Clinic', status: 'active' },
  { id: 'west_center', value: 'west_center', label: 'West Treatment Center', status: 'active' },
  { id: 'south_facility', value: 'south_facility', label: 'South Recovery Facility', status: 'active' },
  { id: 'east_outpatient', value: 'east_outpatient', label: 'East Outpatient Center', status: 'active' },
  { id: 'crisis_center', value: 'crisis_center', label: 'Crisis Intervention Center', status: 'active' },
  { id: 'detox_unit', value: 'detox_unit', label: 'Medical Detox Unit', status: 'active' },
  { id: 'residential_wing', value: 'residential_wing', label: 'Residential Treatment Wing', status: 'inactive' },
  { id: 'family_center', value: 'family_center', label: 'Family Counseling Center', status: 'active' },
  { id: 'telehealth_hub', value: 'telehealth_hub', label: 'Telehealth Services Hub', status: 'active' },
  { id: 'old_north', value: 'old_north', label: 'Old North Location', status: 'inactive' },
  { id: 'temp_site', value: 'temp_site', label: 'Temporary Site - Mall', status: 'inactive' }
];

// Sample program data for behavioral health clinics
const programOptions = [
  { id: 'all', value: 'all', label: 'All Programs', status: 'active' },
  { id: 'outpatient', value: 'outpatient', label: 'Outpatient Treatment', status: 'active' },
  { id: 'intensive', value: 'intensive', label: 'Intensive Outpatient Program (IOP)', status: 'active' },
  { id: 'partial', value: 'partial', label: 'Partial Hospitalization Program (PHP)', status: 'active' },
  { id: 'detox', value: 'detox', label: 'Medical Detox', status: 'active' },
  { id: 'residential', value: 'residential', label: 'Residential Treatment', status: 'inactive' },
  { id: 'dui', value: 'dui', label: 'DUI Education Program', status: 'active' },
  { id: 'dual_diagnosis', value: 'dual_diagnosis', label: 'Dual Diagnosis Treatment', status: 'active' },
  { id: 'family_therapy', value: 'family_therapy', label: 'Family Therapy Program', status: 'active' },
  { id: 'group_therapy', value: 'group_therapy', label: 'Group Therapy Sessions', status: 'active' },
  { id: 'medication_mgmt', value: 'medication_mgmt', label: 'Medication Management', status: 'active' },
  { id: 'crisis_intervention', value: 'crisis_intervention', label: 'Crisis Intervention', status: 'inactive' },
  { id: 'aftercare', value: 'aftercare', label: 'Aftercare Support', status: 'inactive' }
];

// Sample provider data for behavioral health clinics
const providerOptions = [
  { id: 'all', value: 'all', label: 'All Providers', status: 'active', clientCount: 0 },
  { id: 'sarah_wilson', value: 'sarah_wilson', label: 'Sarah Wilson, LCSW', status: 'active', clientCount: 23 },
  { id: 'michael_chen', value: 'michael_chen', label: 'Michael Chen, LPC', status: 'active', clientCount: 18 },
  { id: 'emily_rodriguez', value: 'emily_rodriguez', label: 'Emily Rodriguez, LMFT', status: 'active', clientCount: 15 },
  { id: 'james_taylor', value: 'james_taylor', label: 'James Taylor, LCDC', status: 'inactive', clientCount: 0 },
  { id: 'maria_garcia', value: 'maria_garcia', label: 'Maria Garcia, LMHC', status: 'active', clientCount: 31 },
  { id: 'david_kim', value: 'david_kim', label: 'David Kim, PhD', status: 'active', clientCount: 12 },
  { id: 'lisa_brown', value: 'lisa_brown', label: 'Lisa Brown, NP', status: 'inactive', clientCount: 0 },
  { id: 'robert_johnson', value: 'robert_johnson', label: 'Robert Johnson, LADC', status: 'active', clientCount: 27 },
  { id: 'jennifer_davis', value: 'jennifer_davis', label: 'Jennifer Davis, LCSW-S', status: 'active', clientCount: 19 },
  { id: 'thomas_martinez', value: 'thomas_martinez', label: 'Thomas Martinez, LPC-S', status: 'active', clientCount: 22 },
  { id: 'amanda_white', value: 'amanda_white', label: 'Amanda White, LMFT', status: 'inactive', clientCount: 0 },
  { id: 'carlos_rivera', value: 'carlos_rivera', label: 'Carlos Rivera, LPC', status: 'inactive', clientCount: 0 }
];



export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentDate,
  selectedDate,
  onDateChange,
  onCurrentMonthChange,
  onCreateAppointment,
  selectedProviders: externalSelectedProviders = ['sarah_wilson'], // Default to Sarah Wilson
  onProviderSelectionChange
}) => {
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(externalSelectedProviders);


  
  // Add state for provider search and inactive filter
  const [providerSearchTerm, setProviderSearchTerm] = useState('');
  const [showInactiveProviders, setShowInactiveProviders] = useState(false);
  const [showProviderFilters, setShowProviderFilters] = useState(false);
  
  // Add state for program search and inactive filter
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [showInactivePrograms, setShowInactivePrograms] = useState(false);
  const [showProgramFilters, setShowProgramFilters] = useState(false);
  
  // Add state for location search and inactive filter
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [showInactiveLocations, setShowInactiveLocations] = useState(false);
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  
  // Ref for filter menu
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  // Sync external provider selection
  useEffect(() => {
    setSelectedProviders(externalSelectedProviders);
  }, [externalSelectedProviders]);
  
  // Notify parent when provider selection changes
  useEffect(() => {
    if (onProviderSelectionChange) {
      onProviderSelectionChange(selectedProviders);
    }
  }, [selectedProviders, onProviderSelectionChange]);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowProviderFilters(false);
      }
    };

    if (showProviderFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProviderFilters]);

  // Handle provider selection
  const handleProviderToggle = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  // Handle program selection
  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  // Handle location selection
  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // Filter providers based on search term, status, and client count
  const filteredProviders = providerOptions.slice(1).filter(provider => {
    const matchesSearch = provider.label.toLowerCase().includes(providerSearchTerm.toLowerCase());
    // Show both active and inactive providers by default, or filter by status if toggle is used
    const matchesStatus = showInactiveProviders ? provider.status === 'inactive' : true;
    // For inactive providers, don't require client count > 0 since they typically have 0 clients
    const hasClients = provider.status === 'active' ? provider.clientCount > 0 : true;
    return matchesSearch && matchesStatus && hasClients;
  });

  // Filter programs based on search term and status
  const filteredPrograms = programOptions.slice(1).filter(program => {
    const matchesSearch = program.label.toLowerCase().includes(programSearchTerm.toLowerCase());
    const matchesStatus = showInactivePrograms ? program.status === 'inactive' : program.status === 'active';
    return matchesSearch && matchesStatus;
  });

  // Filter locations based on search term only (show all active locations)
  const filteredLocations = locationOptions.slice(1).filter(location => {
    const matchesSearch = location.label.toLowerCase().includes(locationSearchTerm.toLowerCase());
    return matchesSearch && location.status === 'active';
  });

  // Handle select all providers
  const handleSelectAllProviders = () => {
    const availableProviders = filteredProviders.map(provider => provider.value);
    const allSelected = availableProviders.every(id => selectedProviders.includes(id));
    
    if (allSelected) {
      // Deselect all filtered providers
      setSelectedProviders(prev => prev.filter(id => !availableProviders.includes(id)));
    } else {
      // Select all filtered providers
      setSelectedProviders(prev => {
        const newSelection = [...prev];
        availableProviders.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Check if all filtered providers are selected
  const allFilteredProvidersSelected = filteredProviders.length > 0 && 
    filteredProviders.every(provider => selectedProviders.includes(provider.value));
  
  // Check if some filtered providers are selected
  const someFilteredProvidersSelected = filteredProviders.some(provider => 
    selectedProviders.includes(provider.value)
  );

  // Handle select all programs
  const handleSelectAllPrograms = () => {
    const availablePrograms = filteredPrograms.map(program => program.value);
    const allSelected = availablePrograms.every(id => selectedPrograms.includes(id));
    
    if (allSelected) {
      // Deselect all filtered programs
      setSelectedPrograms(prev => prev.filter(id => !availablePrograms.includes(id)));
    } else {
      // Select all filtered programs
      setSelectedPrograms(prev => {
        const newSelection = [...prev];
        availablePrograms.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Check if all filtered programs are selected
  const allFilteredProgramsSelected = filteredPrograms.length > 0 && 
    filteredPrograms.every(program => selectedPrograms.includes(program.value));
  
  // Check if some filtered programs are selected
  const someFilteredProgramsSelected = filteredPrograms.some(program => 
    selectedPrograms.includes(program.value)
  );

  // Handle select all locations
  const handleSelectAllLocations = () => {
    const availableLocations = filteredLocations.map(location => location.value);
    const allSelected = availableLocations.every(id => selectedLocations.includes(id));
    
    if (allSelected) {
      // Deselect all filtered locations
      setSelectedLocations(prev => prev.filter(id => !availableLocations.includes(id)));
    } else {
      // Select all filtered locations
      setSelectedLocations(prev => {
        const newSelection = [...prev];
        availableLocations.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Check if all filtered locations are selected
  const allFilteredLocationsSelected = filteredLocations.length > 0 && 
    filteredLocations.every(location => selectedLocations.includes(location.value));
  
  // Check if some filtered locations are selected
  const someFilteredLocationsSelected = filteredLocations.some(location => 
    selectedLocations.includes(location.value)
  );

  // Generate days for the mini calendar
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous/next month to fill the calendar grid
  const startDay = getDay(monthStart);
  const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1; // Adjust for week starting on Monday
  
  const calendarDays = [
    ...Array(daysFromPrevMonth).fill(null),
    ...monthDays
  ];
  
  // Calculate week rows
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Sample providers and patients data for behavioral health clinic
  const sampleProviders = [
    { id: '1', name: 'Sarah Wilson, LCSW' },
    { id: '2', name: 'Michael Chen, LPC' },
    { id: '3', name: 'Emily Rodriguez, LMFT' },
    { id: '4', name: 'James Taylor, LCDC' }
  ];

  const samplePatients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Johnson' },
    { id: '4', name: 'Maria Garcia' }
  ];

  const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate('/new-appointment');
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`relative border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'} h-full`}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/25 to-purple-100/30 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/25 via-orange-100/20 to-amber-100/30 animate-gradient-xy-2 animation-delay-2000"></div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Header Section */}
        {isCollapsed ? (
          /* Collapsed Layout - Vertical Stack */
          <div className="p-4 flex flex-col items-center gap-3">
            {/* Hamburger Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Expand sidebar"
            >
              <Bars3Icon className="w-4 h-4" />
            </button>
            
            {/* New Appointment Button - Icon Only */}
            <button 
              className="rounded-full bg-white/80 backdrop-blur-sm border border-gray-300/50 hover:bg-white/90 hover:shadow-md p-2 shadow-sm transition-all duration-200"
              onClick={handleOpenModal}
              title="New Appointment"
            >
              <PlusIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        ) : (
          /* Expanded Layout - Horizontal Row */
          <div className="p-4 flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="flex-shrink-0 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Collapse sidebar"
            >
              <Bars3Icon className="w-4 h-4" />
            </button>
            
            {/* New Appointment Button - Full Width with Label */}
            <button 
              className="flex items-center justify-center flex-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300/50 hover:bg-white/90 hover:shadow-md py-2 px-4 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200"
              onClick={handleOpenModal}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Appointment
            </button>
          </div>
        )}
        
        {/* Mini Calendar - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="px-4 pb-3">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-1">
                <button 
                  onClick={() => onCurrentMonthChange(subDays(currentDate, 30))}
                  className="p-1 rounded-full hover:bg-white/60 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button 
                  onClick={() => onCurrentMonthChange(addDays(currentDate, 30))}
                  className="p-1 rounded-full hover:bg-white/60 backdrop-blur-sm transition-colors"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Calendar container with subtle border and shadow */}
            <div className="rounded-md overflow-hidden border border-gray-200/80 shadow-sm backdrop-blur-sm bg-white/40">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 bg-white/50 backdrop-blur-sm border-b border-gray-200/80">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
                  <div key={i} className="h-6 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="bg-white/60 backdrop-blur-sm">
                {weeks.map((week, weekIndex) => (
                  <div 
                    key={weekIndex} 
                    className={`grid grid-cols-7 ${weekIndex < weeks.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return <div key={`empty-${dayIndex}`} className="h-6 w-full" />;
                      }
                      
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isSelectedDay = isSameDay(day, selectedDate);
                      const isTodayDate = isToday(day);
                      
                      return (
                        <button
                          key={dayIndex}
                          onClick={() => onDateChange(day)}
                          className={`h-6 w-full flex items-center justify-center text-xs transition-colors
                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                            ${isTodayDate ? 'bg-blue-50/80 text-blue-600 font-medium' : ''}
                            ${isSelectedDay && !isTodayDate ? 'bg-gray-100/80' : ''}
                            ${isSelectedDay ? 'font-medium' : ''}
                            hover:bg-white/60
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Locations Section - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="px-4 mb-3 relative">
            {/* Title */}
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-gray-700">Locations</h3>
            </div>
            
            {/* Search input for locations */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search locations..."
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            
            {/* Locations table */}
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white/60 backdrop-blur-sm">
              {filteredLocations.length > 0 ? (
                <div className="max-h-32 overflow-y-auto">
                  {/* Table header */}
                  <div className="bg-gray-50/80 border-b border-gray-200 px-2 py-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allFilteredLocationsSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredLocationsSelected && !allFilteredLocationsSelected;
                      }}
                      onChange={handleSelectAllLocations}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs font-medium text-gray-600 flex-1">Location</span>
                  </div>
                  
                  {/* Table body */}
                  <div>
                    {filteredLocations.map((location) => (
                      <div key={location.id} className={`flex items-center space-x-2 px-2 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors ${selectedLocations.includes(location.value) ? 'bg-blue-50/80 border-blue-200/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location.value)}
                          onChange={() => handleLocationToggle(location.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                        />
                        <span className="text-xs flex-1 text-gray-700">
                          {location.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center">No locations found</div>
              )}
            </div>
          </div>
        )}
        
        {/* Providers Section - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="px-4 mb-3 relative">
            {/* Title with filter icon */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700">Providers</h3>
              <button
                onClick={() => setShowProviderFilters(!showProviderFilters)}
                className="p-1 rounded hover:bg-white/50 transition-colors"
                title="Filter options"
              >
                <FunnelIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            
            {/* Filter menu */}
            {showProviderFilters && (
              <div 
                ref={filterMenuRef}
                className="absolute top-6 right-4 z-20 bg-white border border-gray-200 rounded-md shadow-lg py-2 px-3 min-w-[180px]"
              >
                <div className="space-y-2">
                  {/* Show inactive providers only toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInactiveProviders}
                      onChange={(e) => setShowInactiveProviders(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs text-gray-700">Show Inactive Only</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Search input for providers */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search providers..."
                value={providerSearchTerm}
                onChange={(e) => setProviderSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            
            {/* Providers table */}
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white/60 backdrop-blur-sm">
              {filteredProviders.length > 0 ? (
                <div className="max-h-32 overflow-y-auto">
                  {/* Table header */}
                  <div className="bg-gray-50/80 border-b border-gray-200 px-2 py-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allFilteredProvidersSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredProvidersSelected && !allFilteredProvidersSelected;
                      }}
                      onChange={handleSelectAllProviders}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs font-medium text-gray-600 flex-1">Provider</span>
                    <span className="text-xs font-medium text-gray-600">Clients</span>
                  </div>
                  
                  {/* Table body */}
                  <div>
                    {filteredProviders.map((provider) => (
                      <div key={provider.id} className={`flex items-center space-x-2 px-2 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors ${provider.status === 'inactive' ? 'opacity-70' : ''} ${selectedProviders.includes(provider.value) ? 'bg-blue-50/80 border-blue-200/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedProviders.includes(provider.value)}
                          onChange={() => handleProviderToggle(provider.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                        />
                        <span className={`text-xs flex-1 ${provider.status === 'inactive' ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {provider.label}
                        </span>
                        <span className="text-xs font-medium text-blue-600 min-w-[3rem] text-center">
                          {provider.clientCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center">No providers found</div>
              )}
            </div>
          </div>
        )}
        
        {/* Programs Section - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="px-4 mb-3 relative">
            {/* Title with filter icon */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700">Programs</h3>
              <button
                onClick={() => setShowProgramFilters(!showProgramFilters)}
                className="p-1 rounded hover:bg-white/50 transition-colors"
                title="Filter options"
              >
                <FunnelIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            
            {/* Filter menu */}
            {showProgramFilters && (
              <div 
                className="absolute top-6 right-4 z-20 bg-white border border-gray-200 rounded-md shadow-lg py-2 px-3 min-w-[180px]"
              >
                <div className="space-y-2">
                  {/* Show inactive programs only toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInactivePrograms}
                      onChange={(e) => setShowInactivePrograms(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs text-gray-700">Show Inactive Only</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Search input for programs */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search programs..."
                value={programSearchTerm}
                onChange={(e) => setProgramSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            
            {/* Programs table */}
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white/60 backdrop-blur-sm">
              {filteredPrograms.length > 0 ? (
                <div className="max-h-32 overflow-y-auto">
                  {/* Table header */}
                  <div className="bg-gray-50/80 border-b border-gray-200 px-2 py-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allFilteredProgramsSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredProgramsSelected && !allFilteredProgramsSelected;
                      }}
                      onChange={handleSelectAllPrograms}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs font-medium text-gray-600 flex-1">Program</span>
                  </div>
                  
                  {/* Table body */}
                  <div>
                    {filteredPrograms.map((program) => (
                      <div key={program.id} className={`flex items-center space-x-2 px-2 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors ${program.status === 'inactive' ? 'opacity-70' : ''} ${selectedPrograms.includes(program.value) ? 'bg-blue-50/80 border-blue-200/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(program.value)}
                          onChange={() => handleProgramToggle(program.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                        />
                        <span className={`text-xs flex-1 ${program.status === 'inactive' ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {program.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center">No programs found</div>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom padding for better scrolling experience */}
        <div className="h-4 flex-shrink-0"></div>

      </div>
    </div>
  );
};

export default CalendarSidebar;
