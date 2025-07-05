import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline'
import CalendarSidebar from '../components/organisms/CalendarSidebar/calendar-sidebar'
import CalendarDetails from '../components/organisms/CalendarSidebar/calendar-details'
import { CalendarMainView } from '../components/organisms/CalendarView/calendar-main-view'
import ResponsiveLayout from '../components/layouts/ResponsiveLayout/responsive-layout'

// Define event types
type AppointmentType = 'Individual' | 'Group' | 'Provider';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  type: AppointmentType;
  client?: string;
  mobile?: string;
  home?: string;
  category?: string;
  backgroundColor?: string;
  status?: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed';
  appointmentType?: string;
  location?: string;
  notes?: string;
  program?: string;
  copay?: number;
}

/**
 * MyCalendar Component - Enhanced with Responsive Navigation
 * 
 * Example showing how to integrate ResponsiveLayout for mobile-friendly navigation
 * - Desktop: Shows traditional TopNavigationBar + MainNavigationBar
 * - Mobile: Shows simplified top bar + bottom navigation with overlay menu
 * 
 * Key Benefits:
 * - Zero impact on desktop functionality
 * - Mobile-optimized bottom navigation
 * - Consistent user experience across devices
 * - Easy integration with existing pages
 */
const MyCalendarWithResponsiveNav: React.FC = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'agenda'>('week')
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample patient data for demonstration
  const samplePatient = {
    id: "P001",
    name: "John Doe",
    avatar: "/patient-avatar.png",
    gender: "Male",
    age: 35,
    bloodGroup: "O+",
    insuranceProvider: "Blue Cross",
    admittedTo: "Behavioral Health",
    language: "English",
    mobile: "+1 (555) 123-4567",
    programAuditor: "Dr. Smith",
    auditorTimestamp: "2024-01-15T10:30:00Z",
    primaryCareProvider: "Dr. Johnson",
    nickname: "Johnny"
  };

  // Sample user info
  const userInfo = {
    name: "Dr. Sarah Johnson",
    role: "clinician",
    avatar: "/avatar.png"
  };

  // Sample calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Individual Therapy - John Doe',
      startTime: '09:00',
      endTime: '10:00',
      isAllDay: false,
      type: 'Individual',
      client: 'John Doe',
      mobile: '+1 (555) 123-4567',
      status: 'Confirmed',
      appointmentType: 'Individual Therapy',
      location: 'Room 101',
      program: 'Outpatient',
      copay: 25,
      backgroundColor: 'bg-blue-100'
    },
    {
      id: '2',
      title: 'Group Therapy Session',
      startTime: '14:00',
      endTime: '15:30',
      isAllDay: false,
      type: 'Group',
      status: 'Pending',
      appointmentType: 'Group Therapy',
      location: 'Conference Room A',
      program: 'Intensive Outpatient',
      backgroundColor: 'bg-green-100'
    }
  ];

  // Handle search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
    // Implement your search logic here
  };

  // Handle navigation
  const handleNavigate = (itemName: string) => {
    console.log('Navigating to:', itemName);
    // Return false to prevent navigation if needed
    return true;
  };

  // Handle new encounter
  const handleNewEncounter = () => {
    console.log('Creating new encounter for patient:', samplePatient.name);
    // Implement new encounter logic
  };

  // Handle view chart
  const handleViewChart = () => {
    console.log('Viewing chart for patient:', samplePatient.name);
    // Implement view chart logic
  };

  // Handle event selection
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowSidebar(true);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ResponsiveLayout
      hospitalName="Behavioral Health Clinic"
      userAvatarUrl="/avatar.png"
      onSearch={handleSearch}
      patient={samplePatient}
      onNewEncounter={handleNewEncounter}
      onViewChart={handleViewChart}
      userInfo={userInfo}
      activeItem="Schedule"
      onNavigate={handleNavigate}
      contentClassName="flex h-screen overflow-hidden"
    >
      {/* Calendar Content - Same as your existing calendar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Calendar View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CalendarMainView
            selectedDate={selectedDate}
            view={currentView}
            onViewChange={setCurrentView}
            onDateChange={handleDateSelect}
            onSettingsClick={() => {}}
            events={events}
            onEditEvent={handleEventSelect}
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Sidebar */}
        <CalendarSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Event Details */}
        {selectedEvent && (
          <CalendarDetails
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default MyCalendarWithResponsiveNav;
