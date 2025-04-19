import { FC, useState, useEffect, useMemo } from 'react'
import { format, addDays, isSameDay, parseISO, isToday, isAfter } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { ScrollArea } from '@/components/atoms/ScrollArea'
import { Appointment } from '@/types/appointment'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  VideoCameraIcon,
  PhoneIcon,
  ClipboardDocumentIcon as ClipboardIcon,
  TableCellsIcon,
  Squares2X2Icon,
  CheckIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/atoms/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/atoms/Input'

// Mock data for upcoming appointments
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    time: '09:00',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'scheduled',
    type: 'followUp',
    duration: 30,
    program: 'Addiction Recovery',
    provider: 'Dr. Sarah Johnson',
    category: 'Adaptive Skills Assessment',
    isGroup: false,
    isRecurring: true
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    time: '10:30',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'confirmed',
    type: 'initial',
    duration: 45,
    program: 'Mental Health',
    provider: 'Dr. Robert Chen',
    category: 'CAMS Assessment Forms',
    isGroup: false,
    isRecurring: false
  },
  {
    id: '3',
    patientName: 'Robert Johnson',
    time: '14:15',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'scheduled',
    type: 'newPatient',
    duration: 60,
    program: 'Family Therapy',
    provider: 'Dr. Emily Lewis',
    category: 'Agent Info',
    isGroup: true,
    isRecurring: false
  },
  {
    id: '4',
    patientName: 'Emily Wilson',
    time: '11:00',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'confirmed',
    type: 'followUp',
    duration: 30,
    program: 'Behavioral Health',
    provider: 'Dr. Michael Brown',
    category: 'Adaptive Skills Assessment',
    isGroup: false,
    isRecurring: true
  },
  {
    id: '5',
    patientName: 'Michael Brown',
    time: '15:45',
    date: new Date(),
    status: 'scheduled',
    type: 'initial',
    duration: 45,
    program: 'Addiction Recovery',
    provider: 'Dr. Sarah Johnson',
    category: 'Mobiles Addiction @ 123',
    isGroup: true,
    isRecurring: false
  },
  {
    id: '6',
    patientName: 'Sarah Miller',
    time: '08:30',
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    status: 'confirmed',
    type: 'followUp',
    duration: 30,
    program: 'Mental Health',
    provider: 'Dr. Robert Chen',
    category: 'Adolescent',
    isGroup: false,
    isRecurring: true
  },
  {
    id: '7',
    patientName: 'David Wilson',
    time: '13:00',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'scheduled',
    type: 'newPatient',
    duration: 60,
    program: 'Behavioral Health',
    provider: 'Dr. Emily Lewis',
    category: 'U/A Results',
    isGroup: true,
    isRecurring: false
  }
];

// Helper to get status badge styles
const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'confirmed':
      return "bg-blue-50 text-blue-700 border-blue-200"
    case 'checkedIn':
      return "bg-green-50 text-green-700 border-green-200"
    case 'scheduled':
      return "bg-amber-50 text-amber-700 border-amber-200"
    case 'completed':
      return "bg-gray-50 text-gray-700 border-gray-200"
    case 'cancelled':
      return "bg-red-50 text-red-700 border-red-200"
    case 'processed':
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

// Helper to get appointment type text
const getAppointmentTypeText = (type: string) => {
  switch (type) {
    case 'initial':
      return 'Initial Assessment'
    case 'followUp':
      return 'Follow-up'
    case 'newPatient':
      return 'New Patient'
    default:
      return 'Appointment'
  }
}

// Component for displaying an appointment card
const AppointmentCard: FC<{ appointment: Appointment }> = ({ appointment }) => {
  const isVirtual = appointment.id === '2' || appointment.id === '4' || appointment.id === '7' // Mock some virtual appointments
  const isPhoneCall = appointment.id === '3' || appointment.id === '6' // Mock some phone appointments
  
  return (
    <div className="py-3.5 mb-4 border-l-[3px] border-[#1C75BC] bg-white rounded-md hover:shadow-sm transition-shadow duration-200 max-w-4xl mx-auto pl-6 pr-4 relative">
      {/* Status badge positioned at top right */}
      <div className="absolute top-3.5 right-4">
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs py-0.5 px-2.5 font-normal", 
            getStatusBadgeStyles(appointment.status)
          )}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </div>

      {/* Patient name and program */}
      <div className="mb-2.5 pr-20">
        <h3 className="font-medium text-gray-900 text-base">{appointment.patientName}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {appointment.program} • {appointment.isGroup ? 'Group Session' : 'Individual Session'}
          {appointment.isRecurring && ' • Recurring'}
        </p>
      </div>
      
      {/* Date and time with icons */}
      <div className="flex items-start mb-4">
        <div className="flex items-center mr-10">
          <div className="text-gray-400 mr-2.5 w-4 flex-shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className="text-xs text-gray-600">
            {format(appointment.date, 'EEE, MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="text-gray-400 mr-2.5 w-4 flex-shrink-0">
            <ClockIcon className="h-4 w-4" />
          </div>
          <span className="text-xs text-gray-600">
            {appointment.time} ({appointment.duration} min)
          </span>
        </div>
      </div>
      
      {/* Provider and Category */}
      <div className="grid grid-cols-2 gap-6 mb-3.5">
        <div className="flex items-start">
          <div className="mr-2.5 mt-0.5 w-4 flex-shrink-0">
            <UserIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Provider</div>
            <div className="text-xs text-gray-700 mt-0.5">{appointment.provider}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="mr-2.5 mt-0.5 w-4 flex-shrink-0">
            <ClipboardIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Category</div>
            <div className="text-xs text-gray-700 mt-0.5">{appointment.category}</div>
          </div>
        </div>
      </div>
      
      {/* Appointment type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2.5 w-4 flex-shrink-0">
            {isVirtual ? (
              <VideoCameraIcon className="h-4 w-4 text-[#1C75BC]" />
            ) : isPhoneCall ? (
              <PhoneIcon className="h-4 w-4 text-[#1C75BC]" />
            ) : (
              <UserIcon className="h-4 w-4 text-[#1C75BC]" />
            )}
          </div>
          <span className="text-xs text-gray-600">
            {isVirtual ? 'Virtual Visit' : isPhoneCall ? 'Phone Call' : 'In-Person'} • {getAppointmentTypeText(appointment.type)}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-6 text-xs px-3 py-0 rounded-md">
            Reschedule
          </Button>
          {isVirtual && (
            <Button size="sm" className="h-6 text-xs px-3 py-0 rounded-md bg-[#1C75BC] hover:bg-[#1667A5]">
              Join Call
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Component for displaying an appointment in tabular view
const AppointmentRow: FC<{ appointment: Appointment }> = ({ appointment }) => {
  const isVirtual = appointment.id === '2' || appointment.id === '4' || appointment.id === '7'
  const isPhoneCall = appointment.id === '3' || appointment.id === '6'
  
  return (
    <TableRow className="h-[45px] hover:bg-gray-50/50">
      <TableCell className="py-2">
        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
        <div className="text-xs text-gray-500">
          {appointment.program} {appointment.isGroup ? '• Group' : '• Individual'}
          {appointment.isRecurring && ' • Recurring'}
        </div>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-sm text-gray-600">
          {format(appointment.date, 'MMM d, yyyy')}
        </span>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-sm text-gray-600">{appointment.time}</span>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-sm text-gray-600">{appointment.duration} min</span>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-sm text-gray-600">{appointment.provider}</span>
      </TableCell>
      <TableCell className="py-2">
        <span className="text-sm text-gray-600">{appointment.category}</span>
      </TableCell>
      <TableCell className="py-2">
        {isVirtual ? (
          <Badge variant="outline" className="text-[10px] h-[18px] flex items-center bg-blue-50 text-blue-700">
            <VideoCameraIcon className="h-3 w-3 mr-1" />
            Virtual
          </Badge>
        ) : isPhoneCall ? (
          <Badge variant="outline" className="text-[10px] h-[18px] flex items-center bg-green-50 text-green-700">
            <PhoneIcon className="h-3 w-3 mr-1" />
            Phone
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] h-[18px] flex items-center bg-purple-50 text-purple-700">
            <UserIcon className="h-3 w-3 mr-1" />
            In-Person
          </Badge>
        )}
      </TableCell>
      <TableCell className="py-2">
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] h-[18px]", 
            getStatusBadgeStyles(appointment.status)
          )}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3 py-0 rounded-md">
            Reschedule
          </Button>
          {isVirtual && (
            <Button size="sm" className="h-7 text-xs px-3 py-0 rounded-md bg-[#1C75BC] hover:bg-[#1667A5]">
              Join Call
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

// View toggle component
export const ViewToggle: FC<{ 
  activeView: 'card' | 'table'; 
  onViewChange: (view: 'card' | 'table') => void 
}> = ({ activeView, onViewChange }) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <button
        className={cn(
          "flex items-center justify-center px-2 py-1.5 border-r",
          activeView === 'card' 
            ? "bg-[#1C75BC] text-white hover:bg-[#1667A5]" 
            : "bg-white text-gray-500 hover:bg-gray-50"
        )}
        onClick={() => onViewChange('card')}
        aria-label="Card View"
      >
        <Squares2X2Icon className="h-4 w-4" />
      </button>
      <button
        className={cn(
          "flex items-center justify-center px-2 py-1.5",
          activeView === 'table' 
            ? "bg-[#1C75BC] text-white hover:bg-[#1667A5]" 
            : "bg-white text-gray-500 hover:bg-gray-50"
        )}
        onClick={() => onViewChange('table')}
        aria-label="Table View"
      >
        <TableCellsIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

// Main component
interface UpcomingAppointmentsProps {
  appointments?: Appointment[]
  activeFilter?: string
  viewMode?: 'card' | 'table'
  onViewModeChange?: (mode: 'card' | 'table') => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export const UpcomingAppointments: FC<UpcomingAppointmentsProps> = ({ 
  appointments = mockAppointments,
  activeFilter: externalFilter = 'all',
  viewMode: externalViewMode,
  onViewModeChange,
  searchQuery: externalSearchQuery = '',
  onSearchChange
}) => {
  // Use internal state if external filter is not provided
  const [internalFilter, setInternalFilter] = useState('all')
  
  // Use internal view mode state if external is not provided
  const [internalViewMode, setInternalViewMode] = useState<'card' | 'table'>('table')
  
  // Use internal search state if external is not provided
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  
  // Get the active filter from props or internal state
  const activeFilter = externalFilter || internalFilter
  
  // Get the view mode from props or internal state
  const viewMode = externalViewMode || internalViewMode

  // Get search query from props or internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'card' | 'table') => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    } else {
      setInternalViewMode(mode)
    }
  }

  // Handle search query change
  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query)
    } else {
      setInternalSearchQuery(query)
    }
  }
  
  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(apt => {
    if (activeFilter === 'today') {
      return isToday(apt.date)
    }
    if (activeFilter === 'week') {
      const oneWeekFromNow = addDays(new Date(), 7)
      return isAfter(oneWeekFromNow, apt.date)
    }
    if (activeFilter === 'virtual') {
      // In a real app, this would check a virtual flag on the appointment
      return apt.id === '2' || apt.id === '4' || apt.id === '7'
    }
    return true
  }).sort((a, b) => a.date.getTime() - b.date.getTime())
  
  // Apply search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredAppointments
    }
    
    const query = searchQuery.toLowerCase().trim()
    return filteredAppointments.filter(apt => 
      apt.patientName.toLowerCase().includes(query) || 
      apt.provider?.toLowerCase().includes(query) || 
      apt.category?.toLowerCase().includes(query) || 
      apt.program?.toLowerCase().includes(query)
    )
  }, [searchQuery, filteredAppointments])

  // Use the search results instead of all appointments
  const displayAppointments = searchResults

  // Group appointments by date - used only for card view
  const appointmentsByDate: Record<string, Appointment[]> = {}
  
  displayAppointments.forEach(apt => {
    const dateKey = format(apt.date, 'yyyy-MM-dd')
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = []
    }
    appointmentsByDate[dateKey].push(apt)
  })

  // Render either card view or table view based on viewMode
  const renderAppointments = () => {
    if (displayAppointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-48">
          <CalendarIcon className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-gray-500">
            {searchQuery.trim() 
              ? `No appointments found matching "${searchQuery}"` 
              : "No appointments found for the selected filter."}
          </p>
        </div>
      );
    }

    if (viewMode === 'card') {
      // Card view - grouped by date
      if (Object.keys(appointmentsByDate).length === 0) {
        return (
          <div className="flex flex-col items-center justify-center text-center h-48">
            <CalendarIcon className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">No appointments found for the selected filter.</p>
          </div>
        );
      }
      
      return (
        <div className="max-w-4xl mx-auto">
          {Object.keys(appointmentsByDate).sort().map(dateKey => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold mb-4 mt-5 first:mt-0 pl-1">
                {isToday(parseISO(dateKey)) 
                  ? 'Today' 
                  : format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
              </h3>
              
              {appointmentsByDate[dateKey].map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      // Table view - single table with all appointments
      return (
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-[200px] py-3">Patient</TableHead>
                    <TableHead className="w-[100px] py-3">Date</TableHead>
                    <TableHead className="w-[80px] py-3">Time</TableHead>
                    <TableHead className="w-[90px] py-3">Duration</TableHead>
                    <TableHead className="w-[150px] py-3">Provider</TableHead>
                    <TableHead className="w-[150px] py-3">Category</TableHead>
                    <TableHead className="w-[100px] py-3">Type</TableHead>
                    <TableHead className="w-[100px] py-3">Status</TableHead>
                    <TableHead className="w-[150px] py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayAppointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {displayAppointments.length > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-500 px-2">
              <div>
                Showing {displayAppointments.length} {displayAppointments.length === 1 ? 'appointment' : 'appointments'}
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeftIcon className="h-4 w-4 text-gray-400" />
                </button>
                <span className="px-2">1</span>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 pr-4">
        {renderAppointments()}
      </ScrollArea>
    </div>
  )
}

export default UpcomingAppointments 