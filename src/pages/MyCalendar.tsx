import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CalendarSidebar from '../components/organisms/CalendarSidebar/calendar-sidebar'
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
  phoneNumber?: string;
  supervisingProvider?: string;
  personName?: string;
}

/**
 * MyCalendar Page Component
 * 
 * Enhanced with responsive navigation for mobile-friendly experience:
 * - Desktop: Traditional TopNavigationBar + MainNavigationBar
 * - Mobile: Simplified top bar + bottom navigation with overlay menu
 * 
 * This page displays a Google Calendar-like interface with a 3-column layout.
 * Uses modular components for each section to improve code organization and maintainability.
 */
const MyCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'agenda'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add activeTab state
  const [activeTab, setActiveTab] = useState<'provider' | 'room' | 'patient'>('provider');
  
  // Provider selection state
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['sarah_wilson']); // Default to first provider
  
  // Patient selection state
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  // Available providers data (this should match the sidebar data)
  const availableProviders = [
    { id: 'sarah_wilson', value: 'sarah_wilson', label: 'Sarah Wilson, LCSW', status: 'active' as const, clientCount: 23 },
    { id: 'michael_chen', value: 'michael_chen', label: 'Michael Chen, LPC', status: 'active' as const, clientCount: 18 },
    { id: 'emily_rodriguez', value: 'emily_rodriguez', label: 'Emily Rodriguez, LMFT', status: 'active' as const, clientCount: 15 },
    { id: 'maria_garcia', value: 'maria_garcia', label: 'Maria Garcia, LMHC', status: 'active' as const, clientCount: 31 },
    { id: 'david_kim', value: 'david_kim', label: 'David Kim, PhD', status: 'active' as const, clientCount: 12 },
    { id: 'robert_johnson', value: 'robert_johnson', label: 'Robert Johnson, LADC', status: 'active' as const, clientCount: 27 },
    { id: 'jennifer_davis', value: 'jennifer_davis', label: 'Jennifer Davis, LCSW-S', status: 'active' as const, clientCount: 19 },
    { id: 'thomas_martinez', value: 'thomas_martinez', label: 'Thomas Martinez, LPC-S', status: 'active' as const, clientCount: 22 }
  ];

  // Sample patient data
  const availablePatients = [
    { id: '1', value: 'john_doe', label: 'John Doe', status: 'active' },
    { id: '2', value: 'jane_smith', label: 'Jane Smith', status: 'active' },
    { id: '3', value: 'bob_johnson', label: 'Bob Johnson', status: 'active' },
    { id: '4', value: 'alice_brown', label: 'Alice Brown', status: 'active' },
    { id: '5', value: 'charlie_davis', label: 'Charlie Davis', status: 'active' }
  ];

  // Handle creating a new appointment or meeting
  const handleCreateAppointment = () => {
    console.log('Create new appointment');
    // Implementation would go here
  };
  
  // Handle settings click
  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // Implementation would go here
  };
  
  // Handle My Calendar toggle - resets to user's default providers when enabled
  const handleMyCalendarToggle = (isMyCalendar: boolean) => {
    if (isMyCalendar) {
      // Reset to user's default provider (first provider) when switching to "My Calendar"
      setSelectedProviders(['sarah_wilson']); // Default to logged-in user's provider
      console.log('Switched to My Calendar - showing user\'s personal calendar');
    } else {
      console.log('Switched away from My Calendar - user can select other providers');
    }
  };
  
  // Sample events data with comprehensive information
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Adaptive Skills Assessment',
      startTime: '08:00',
      endTime: '09:40',
      isAllDay: false,
      type: 'Individual',
      backgroundColor: '#FFE4E1',
      personName: 'Bhog, Raj',
      program: 'Behavioral Health',
      category: 'Assessment',
      location: 'Room 101',
      supervisingProvider: 'Dr. Sarah Wilson',
      status: 'Confirmed',
      appointmentType: 'Initial Assessment',
      notes: 'First time assessment for adaptive skills evaluation',
      copay: 25,
      phoneNumber: '415-555-0101'
    },
    {
      id: '2',
      title: 'Hold for Client - test',
      startTime: '07:20',
      endTime: '08:00',
      isAllDay: false,
      type: 'Provider',
      backgroundColor: '#FFFACD',
      status: 'Pending',
      location: 'Virtual',
      program: 'General',
      category: 'Hold'
    },
    {
      id: '3',
      title: 'Adaptive Skills Therapy',
      startTime: '08:40',
      endTime: '09:40',
      isAllDay: false,
      type: 'Individual',
      personName: 'PoMan, Black',
      mobile: '415-555-0132',
      home: '415-555-0132',
      backgroundColor: '#E6E6FA',
      program: 'Behavioral Health',
      category: 'Therapy',
      location: 'Room 203',
      supervisingProvider: 'Dr. Michael Brown',
      status: 'Checked In',
      appointmentType: 'Follow-up',
      notes: 'Weekly therapy session',
      copay: 30
    },
    {
      id: '4',
      title: 'Adaptive Skills Therapy',
      startTime: '10:00',
      endTime: '11:00',
      isAllDay: false,
      type: 'Individual',
      personName: 'Adam, Test',
      mobile: '777-777-7777',
      home: '888-888-8888',
      backgroundColor: '#E6E6FA',
      program: 'Behavioral Health',
      category: 'Therapy',
      location: 'Room 105',
      supervisingProvider: 'Dr. Emily Davis',
      status: 'Confirmed',
      appointmentType: 'Regular Session',
      notes: 'Bi-weekly therapy session',
      copay: 30
    },
    {
      id: '5',
      title: 'Lunch Break',
      startTime: '01:00',
      endTime: '01:20',
      isAllDay: false,
      type: 'Provider',
      backgroundColor: '#FF69B4',
      category: 'Break',
      location: 'Break Room'
    },
    {
      id: '6',
      title: 'Agent Info',
      startTime: '01:20',
      endTime: '02:00',
      isAllDay: false,
      type: 'Group',
      backgroundColor: '#FFFFFF',
      program: 'Staff Training',
      category: 'Information Session',
      location: 'Conference Room A',
      supervisingProvider: 'Dr. James Wilson',
      status: 'Confirmed'
    },
    {
      id: '7',
      title: 'Adaptive Skills Assessment',
      startTime: '02:00',
      endTime: '03:40',
      isAllDay: false,
      type: 'Individual',
      personName: 'Dhawg, Ravanag',
      backgroundColor: '#FFE4E1',
      program: 'Behavioral Health',
      category: 'Assessment',
      location: 'Room 102',
      supervisingProvider: 'Dr. Lisa Anderson',
      status: 'Pending',
      appointmentType: 'Initial Assessment',
      notes: 'Comprehensive adaptive skills evaluation',
      copay: 25,
      phoneNumber: '415-555-0145'
    },
    {
      id: '8',
      title: 'OUTe',
      startTime: '04:30',
      endTime: '05:00',
      isAllDay: false,
      type: 'Provider',
      backgroundColor: '#F0F0F0',
      category: 'Out of Office',
      location: 'Out of Office'
    }
  ];

  // Handle navigation from responsive navigation components
  const handleNavigate = (itemName: string) => {
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
    } else if (itemName === 'ADL') {
      navigate('/adl');
    } else if (itemName === 'Wait List') {
      navigate('/wait-list');
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard');
    } else if (itemName === 'Practice') {
      navigate('/practice');
    } else if (itemName === 'Billing') {
      navigate('/billing');
    } else if (itemName === 'Reports') {
      navigate('/reports');
    } else if (itemName === 'Administration') {
      navigate('/administration');
    } else if (itemName === 'Notifications') {
      navigate('/notifications');
    }
  };

  // Handle search from responsive navigation
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setSearchQuery(query);
  };

  return (
    <ResponsiveLayout
      hospitalName="DrCloud EHR"
      userAvatarUrl="/images/avatars/default-avatar.png"
      activeItem="Schedule"
      onNavigate={handleNavigate}
      onSearch={handleSearch}
    >
      {/* Calendar Interface */}
      <div className="flex h-full overflow-hidden bg-white w-full min-w-0">
        {/* Left Column - Calendar Navigation (Hidden on mobile) */}
        <div className="hidden md:block flex-shrink-0">
          <CalendarSidebar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onCurrentMonthChange={setCurrentDate}
            onCreateAppointment={handleCreateAppointment}
            selectedProviders={selectedProviders}
            onProviderSelectionChange={setSelectedProviders}
            selectedPatients={selectedPatients}
            onPatientSelectionChange={setSelectedPatients}
            activeTab={activeTab}
          />
        </div>
        
        {/* Main Calendar View - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <CalendarMainView
            selectedDate={selectedDate}
            view={view}
            onViewChange={setView}
            onDateChange={setSelectedDate}
            onSettingsClick={handleSettingsClick}
            events={sampleEvents}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedProviders={selectedProviders}
            availableProviders={availableProviders}
            selectedPatients={selectedPatients}
            availablePatients={availablePatients}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onMyCalendarToggle={handleMyCalendarToggle}
          />
        </div>
      </div>
    </ResponsiveLayout>
  )
}

export default MyCalendar
