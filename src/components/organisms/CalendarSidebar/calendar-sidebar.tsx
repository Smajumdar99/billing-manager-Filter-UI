import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  EllipsisHorizontalIcon,
  Squares2X2Icon
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
}

// Sample location data
const locationOptions = [
  { id: 'all', value: 'all', label: 'All Locations' },
  { id: 'facility1', value: 'facility1', label: '1 New Facilityss' },
  { id: 'ameth', value: 'ameth', label: 'A-METH' },
  { id: 'asubx', value: 'asubx', label: 'A-SUBX' },
  { id: 'apollo', value: 'apollo', label: 'APOLLO Hospitals' }
];

// Sample program data
const programOptions = [
  { id: 'all', value: 'all', label: 'All Programs' },
  { id: 'diamond', value: 'diamond', label: '1111ADiamond1111 Facility' },
  { id: 'aado', value: 'aado', label: 'A-AADO' },
  { id: 'ameth', value: 'ameth', label: 'A-METH' },
  { id: 'arcxyz', value: 'arcxyz', label: 'ARCXYZ' }
];

// Sample provider data
const providerOptions = [
  { id: 'all', value: 'all', label: 'All Providers' },
  { id: 'smith', value: 'smith', label: 'Dr. John Smith' },
  { id: 'patel', value: 'patel', label: 'Dr. Anita Patel' },
  { id: 'rodriguez', value: 'rodriguez', label: 'Dr. Maria Rodriguez' },
  { id: 'wong', value: 'wong', label: 'Dr. David Wong' }
];

// Sample other calendar users data
const otherCalendarOptions = [
  { id: 'user1', value: 'user1', label: 'Dr. Sarah Wilson' },
  { id: 'user2', value: 'user2', label: 'Dr. Michael Chen' },
  { id: 'user3', value: 'user3', label: 'Dr. Emily Brown' },
  { id: 'user4', value: 'user4', label: 'Dr. James Taylor' }
];

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentDate,
  selectedDate,
  onDateChange,
  onCurrentMonthChange,
  onCreateAppointment
}) => {
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState(['all']);
  const [selectedProgram, setSelectedProgram] = useState(['all']);
  const [selectedProvider, setSelectedProvider] = useState(['all']);

  // Add state for other calendars
  const [selectedOtherCalendars, setSelectedOtherCalendars] = useState<string[]>([]);

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

  // Sample providers and patients data
  const sampleProviders = [
    { id: '1', name: 'Dr. Sarah Wilson' },
    { id: '2', name: 'Dr. Michael Chen' },
    { id: '3', name: 'Dr. Emily Brown' },
    { id: '4', name: 'Dr. James Taylor' }
  ];

  const samplePatients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Johnson' },
    { id: '4', name: 'Maria Garcia' }
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAppointment = (appointment: any) => {
    console.log('New appointment:', appointment);
    // Here you would typically save the appointment to your backend
    onCreateAppointment();
    setIsModalOpen(false);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`relative border-r bg-zinc-200/50 border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'}`}>
      {/* Collapse/Expand Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-1 left-3 transform -translate-x-1/2 z-10 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <Squares2X2Icon className="w-4 h-4" />
        ) : (
          <Squares2X2Icon className="w-4 h-4" />
        )}
      </button>

      {/* Create Button */}
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <button 
            className="rounded-full bg-white border border-gray-300 hover:bg-gray-50 p-2 shadow-sm"
            onClick={handleOpenModal}
            title="New Appointment"
          >
            <PlusIcon className="w-4 h-4 text-gray-700" />
          </button>
        ) : (
          <button 
            className="flex items-center justify-center w-full rounded-full bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm"
            onClick={handleOpenModal}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Appointment
          </button>
        )}
      </div>
      
      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        providers={sampleProviders}
        patients={samplePatients}
        selectedDate={selectedDate}
        startTime="09:00"
        endTime="10:00"
      />
      
      {/* Mini Calendar - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 pb-3">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-1">
              <button 
                onClick={() => onCurrentMonthChange(subDays(currentDate, 30))}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button 
                onClick={() => onCurrentMonthChange(addDays(currentDate, 30))}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Calendar container with subtle border and shadow */}
          <div className="rounded-md overflow-hidden border border-gray-200/80 shadow-sm">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200/80">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
                <div key={i} className="h-5 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-gray-500">
                    {day}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="bg-white">
              {weeks.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className={`grid grid-cols-7 ${weekIndex < weeks.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={`empty-${dayIndex}`} className="h-5 w-full" />;
                    }
                    
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelectedDay = isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <button
                        key={dayIndex}
                        onClick={() => onDateChange(day)}
                        className={`h-5 w-full flex items-center justify-center text-[10px] transition-colors
                          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                          ${isTodayDate ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                          ${isSelectedDay && !isTodayDate ? 'bg-gray-100' : ''}
                          ${isSelectedDay ? 'font-medium' : ''}
                          hover:bg-gray-50
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
      
      {/* Providers Section - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 mb-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Providers</h3>
          <Combobox
            options={providerOptions}
            value={selectedProvider}
            onChange={(value) => setSelectedProvider(value)}
            placeholder="Select provider"
            multiple={false}
            hideFilters={true}
            className="text-xs"
          />
        </div>
      )}
      
      {/* Programs Section - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 mb-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Programs</h3>
          <Combobox
            options={programOptions}
            value={selectedProgram}
            onChange={(value) => setSelectedProgram(value)}
            placeholder="Select program"
            multiple={false}
            hideFilters={true}
            className="text-xs"
          />
        </div>
      )}
      
      {/* Locations Section - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 mb-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Locations</h3>
          <Combobox
            options={locationOptions}
            value={selectedLocation}
            onChange={(value) => setSelectedLocation(value)}
            placeholder="Select location"
            multiple={false}
            hideFilters={true}
            className="text-xs"
          />
        </div>
      )}
      
      {/* My Calendars Section */}
      {!isCollapsed && (
        <div className="px-4 flex-1 overflow-y-auto">
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">My calendars</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-700">Person Appointments</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-700">Provider Reservations</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-purple-500 mr-2"></div>
                <span className="text-xs text-gray-700">Provider in Office Reserv</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-yellow-500 mr-2"></div>
                <span className="text-xs text-gray-700">Group Appointments</span>
              </div>
            </div>
          </div>

          {/* Other Calendars Section */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Other calendars</h3>
            <Combobox
              options={otherCalendarOptions}
              value={selectedOtherCalendars}
              onChange={(value) => setSelectedOtherCalendars(value)}
              placeholder="Add calendar"
              multiple={true}
              hideFilters={true}
              className="text-xs mb-3"
            />
            {selectedOtherCalendars.length > 0 && (
              <div className="space-y-2">
                {selectedOtherCalendars.map((calendarId) => {
                  const calendar = otherCalendarOptions.find(opt => opt.value === calendarId);
                  return (
                    <div key={calendarId} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-gray-500 mr-2"></div>
                        <span className="text-xs text-gray-700">{calendar?.label}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedOtherCalendars(prev => prev.filter(id => id !== calendarId))}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                      >
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Collapsed View - Show color indicators */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 space-y-3">
          <div className="w-4 h-4 rounded-sm bg-blue-500" title="Person Appointments"></div>
          <div className="w-4 h-4 rounded-sm bg-green-500" title="Provider Reservations"></div>
          <div className="w-4 h-4 rounded-sm bg-purple-500" title="Provider in Office Reserv"></div>
          <div className="w-4 h-4 rounded-sm bg-yellow-500" title="Group Appointments"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarSidebar;
