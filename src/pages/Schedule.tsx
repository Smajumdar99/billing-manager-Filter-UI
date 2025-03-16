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
  PhoneIcon
} from '@heroicons/react/24/outline'
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
}

interface Patient {
  id: string;
  name: string;
}

// Modal component for creating new appointments
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  providers: Array<{ id: string; name: string }>;
  patients: Array<{ id: string; name: string }>;
  selectedDate?: Date;
  selectedProvider?: string;
  startTime?: string;
  endTime?: string;
}

const AppointmentModal: FC<AppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  providers,
  patients,
  selectedDate,
  selectedProvider,
  startTime,
  endTime
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'person' | 'provider' | 'group' | 'benefits'>('person');
  
  // Form state
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState(selectedProvider || '');
  const [patient, setPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [appointmentStartTime, setAppointmentStartTime] = useState(startTime || '');
  const [appointmentEndTime, setAppointmentEndTime] = useState(endTime || '');
  const [isAllDay, setIsAllDay] = useState(false);
  const [duration, setDuration] = useState('20');
  const [encounterType, setEncounterType] = useState('');
  const [program, setProgram] = useState('1111ADiamond1111 Facility');
  const [billingProgram, setBillingProgram] = useState('');
  const [supervisingProvider, setSupervisingProvider] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [room, setRoom] = useState('');
  const [comments, setComments] = useState('');
  const [type, setType] = useState<'Individual' | 'Group' | 'Crisis'>('Individual');
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('every');
  const [repeatInterval, setRepeatInterval] = useState('day');
  const [isTelehealth, setIsTelehealth] = useState(false);
  const [printAppointmentSlip, setPrintAppointmentSlip] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (appointmentStartTime && duration && !isAllDay) {
      const [hours, minutes] = appointmentStartTime.split(':').map(Number);
      const durationMinutes = parseInt(duration);
      
      const endDate = new Date();
      endDate.setHours(hours, minutes + durationMinutes, 0);
      
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      
      setAppointmentEndTime(`${endHours}:${endMinutes}`);
    }
  }, [appointmentStartTime, duration, isAllDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      provider,
      patient,
      startTime: appointmentStartTime,
      endTime: appointmentEndTime,
      type,
      room,
      // Additional fields
      date: appointmentDate,
      isAllDay,
      duration,
      encounterType,
      program,
      billingProgram,
      supervisingProvider,
      status,
      comments,
      isRepeating,
      repeatFrequency: isRepeating ? repeatFrequency : undefined,
      repeatInterval: isRepeating ? repeatInterval : undefined,
      isTelehealth,
      printAppointmentSlip
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-800">Add New Appointment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Recipient Type Selection - using the same style as in Inbox.tsx */}
        <div className="px-6 pt-6 pb-2">
          <Label className="block mb-2">Appointment Type</Label>
          <div className="flex space-x-2">
            <Button 
              type="button"
              variant={activeTab === 'person' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('person')}
              className="text-xs"
            >
              <UserIcon className="h-3.5 w-3.5 mr-1.5" />
              PERSON
            </Button>
            <Button 
              type="button"
              variant={activeTab === 'provider' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('provider')}
              className="text-xs"
            >
              <UserIcon className="h-3.5 w-3.5 mr-1.5" />
              PROVIDER
            </Button>
            <Button 
              type="button"
              variant={activeTab === 'group' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('group')}
              className="text-xs"
            >
              <UserGroupIcon className="h-3.5 w-3.5 mr-1.5" />
              GROUP
            </Button>
            <Button 
              type="button"
              variant={activeTab === 'benefits' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('benefits')}
              className="text-xs"
            >
              <InformationCircleIcon className="h-3.5 w-3.5 mr-1.5" />
              Benefits
            </Button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main appointment information */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="patient">Person:</Label>
                  <Select 
                    id="patient"
                    value={patient} 
                    onValueChange={setPatient}
                    placeholder="Click to select"
                  >
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="encounterType">Category:*</Label>
                    <div className="flex items-center">
                      <Checkbox
                        id="showOnlyMine"
                        checked={showOnlyMine}
                        onCheckedChange={(checked) => setShowOnlyMine(checked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="showOnlyMine" className="ml-2 text-xs text-gray-600">
                        Show Only Mine
                      </label>
                    </div>
                  </div>
                  <Select 
                    id="encounterType"
                    value={encounterType} 
                    onValueChange={setEncounterType}
                    placeholder="-- Select Encounter Type --"
                  >
                    <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                    <SelectItem value="Medication Management">Medication Management</SelectItem>
                    <SelectItem value="Crisis Intervention">Crisis Intervention</SelectItem>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title:</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="type">Type:</Label>
                    <Select 
                      id="type"
                      value={type} 
                      onValueChange={(value) => setType(value as 'Individual' | 'Group' | 'Crisis')}
                    >
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                      <SelectItem value="Crisis">Crisis</SelectItem>
                    </Select>
                  </div>
                  
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="room">Room:</Label>
                    <Input
                      id="room"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Time and scheduling */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="appointmentDate">Date:</Label>
                    <div className="relative">
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Checkbox
                        id="allDayEvent"
                        checked={isAllDay}
                        onCheckedChange={(checked) => setIsAllDay(checked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="allDayEvent" className="ml-2 text-sm text-gray-700">
                        All day event
                      </label>
                    </div>
                    
                    {!isAllDay && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="startTime" className="text-xs text-gray-500">
                            Start Time
                          </Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={appointmentStartTime}
                            onChange={(e) => setAppointmentStartTime(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="endTime" className="text-xs text-gray-500">
                            End Time
                          </Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={appointmentEndTime}
                            onChange={(e) => setAppointmentEndTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isAllDay && (
                  <div className="flex items-center">
                    <Label htmlFor="duration" className="w-20">
                      Duration:
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="0"
                        className="w-16"
                      />
                      <span className="ml-2 text-sm text-gray-600">minutes</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <div className="flex items-center mb-2">
                    <Checkbox
                      id="repeats"
                      checked={isRepeating}
                      onCheckedChange={(checked) => setIsRepeating(checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="repeats" className="ml-2 text-sm font-medium text-gray-700">
                      Repeating Appointment
                    </label>
                  </div>
                  
                  {isRepeating && (
                    <div className="ml-6 flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Repeat</span>
                      <Select 
                        value={repeatFrequency} 
                        onValueChange={setRepeatFrequency}
                        className="w-auto"
                      >
                        <SelectItem value="every">every</SelectItem>
                        <SelectItem value="every other">every other</SelectItem>
                        <SelectItem value="every third">every third</SelectItem>
                        <SelectItem value="every fourth">every fourth</SelectItem>
                      </Select>
                      
                      <Select 
                        value={repeatInterval} 
                        onValueChange={setRepeatInterval}
                        className="w-auto"
                      >
                        <SelectItem value="day">day</SelectItem>
                        <SelectItem value="week">week</SelectItem>
                        <SelectItem value="month">month</SelectItem>
                        <SelectItem value="year">year</SelectItem>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Provider information */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="provider">Provider:</Label>
                  <Select 
                    id="provider"
                    value={provider} 
                    onValueChange={setProvider}
                    placeholder="Select Provider"
                  >
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="supervisingProvider">Supervising provider:*</Label>
                  <Select 
                    id="supervisingProvider"
                    value={supervisingProvider} 
                    onValueChange={setSupervisingProvider}
                    placeholder="-- Unassigned --"
                  >
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="program">Program:*</Label>
                  <Select 
                    id="program"
                    value={program} 
                    onValueChange={setProgram}
                  >
                    <SelectItem value="1111ADiamond1111 Facility">1111ADiamond1111 Facility</SelectItem>
                    <SelectItem value="A-AADO">A-AADO</SelectItem>
                    <SelectItem value="A-METH">A-METH</SelectItem>
                    <SelectItem value="ABCXYZ">ABCXYZ</SelectItem>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="billingProgram">Billing Program:*</Label>
                  <Select 
                    id="billingProgram"
                    value={billingProgram} 
                    onValueChange={setBillingProgram}
                    placeholder="Select Billing Program"
                  >
                    <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                    <SelectItem value="BILLING123">BILLING123</SelectItem>
                    <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional options */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status:</Label>
                  <Select 
                    id="status"
                    value={status} 
                    onValueChange={setStatus}
                  >
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Checked In">Checked In</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No Show">No Show</SelectItem>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="comments">Comments:</Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={2}
                  />
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="telehealth"
                      checked={isTelehealth}
                      onCheckedChange={(checked) => setIsTelehealth(checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="telehealth" className="ml-2 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4 inline mr-1 text-blue-500" />
                      Telehealth Appointment
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox
                      id="printAppointmentSlip"
                      checked={printAppointmentSlip}
                      onCheckedChange={(checked) => setPrintAppointmentSlip(checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="printAppointmentSlip" className="ml-2 text-sm text-gray-600">
                      <PrinterIcon className="w-4 h-4 inline mr-1 text-blue-500" />
                      Print Appointment Slip
                    </label>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-blue-600"
                  >
                    <UserIcon className="w-4 h-4 mr-1.5" />
                    Check-In as Arrived
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center text-sm">
            {isTelehealth && (
              <div className="flex items-center text-blue-600">
                <PhoneIcon className="h-4 w-4 mr-1" />
                <span>Telehealth appointment</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="text-blue-600"
            >
              Find Available
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              Save Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [currentView, setCurrentView] = useState<'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'>('timeGridDay');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
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
      return calendarRef.current.getApi().view.title;
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
      
      const { type, provider, patient } = extendedProps;
      
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
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={(searchTerm) => console.log('Search:', searchTerm)}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Schedule"
        onNavigate={(itemName) => {
          console.log('Navigate to:', itemName);
          
          // Handle navigation to different pages
          if (itemName === 'Inbox') {
            navigate('/inbox');
          } else if (itemName === 'Dashboard') {
            navigate('/dashboard');
          } else if (itemName === 'Settings') {
            navigate('/settings');
          } else if (itemName === 'Clients') {
            navigate('/old-ui');
          }
          // Other navigation will be handled by the MainNavigationBar component
        }}
      />

      {/* Calendar Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="w-72 bg-blue-50/20 border-r border-gray-200 overflow-y-auto flex-shrink-0 shadow-sm">
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-medium text-gray-800">Filter by:</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id="personApptsOnly"
                      name="personApptsOnly"
                      type="checkbox"
                      checked={filters.personApptsOnly}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="personApptsOnly" className="ml-2.5 text-sm text-gray-700">
                      Person appts only
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id="providerResvOnly"
                      name="providerResvOnly"
                      type="checkbox"
                      checked={filters.providerResvOnly}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="providerResvOnly" className="ml-2.5 text-sm text-gray-700">
                      Provider resv. only
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id="providerInOfficeResvOnly"
                      name="providerInOfficeResvOnly"
                      type="checkbox"
                      checked={filters.providerInOfficeResvOnly}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="providerInOfficeResvOnly" className="ml-2.5 text-sm text-gray-700">
                      Provider in Office resv. only
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id="groupApptsOnly"
                      name="groupApptsOnly"
                      type="checkbox"
                      checked={filters.groupApptsOnly}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="groupApptsOnly" className="ml-2.5 text-sm text-gray-700">
                      Group appts only
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id="filterByHours"
                      name="filterByHours"
                      type="checkbox"
                      checked={filters.filterByHours}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="filterByHours" className="ml-2.5 text-sm text-gray-700">
                      Appts in next
                    </label>
                  </div>
                  <select
                    name="apptsInNextHours"
                    value={filters.apptsInNextHours}
                    onChange={handleFilterChange}
                    disabled={!filters.filterByHours}
                    className="ml-2 text-sm border border-gray-200 rounded p-1 w-16 text-gray-700 bg-white focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                  </select>
                  <span className="ml-2 text-sm text-gray-700">hours</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-800">Programs</h3>
                  <div className="flex items-center">
                    <input
                      id="includeInactivePrograms"
                      name="includeInactivePrograms"
                      type="checkbox"
                      checked={filters.includeInactivePrograms}
                      onChange={handleFilterChange}
                      className="h-3.5 w-3.5 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="includeInactivePrograms" className="ml-1.5 text-xs text-gray-500">
                      Include inactive Facilities
                    </label>
                  </div>
                </div>
                
                <div className="border bg-white border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <div className="p-2 border-b border-gray-200 bg-gray-50">
                    <input
                      type="text"
                      placeholder="Search programs..."
                      value={programSearch}
                      onChange={(e) => setProgramSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="bg-blue-50 p-2.5 border-b border-gray-200">
                      <div className="text-sm font-medium text-blue-700">All Programs</div>
                    </div>
                    {programs.slice(1).filter(program => 
                      program.name.toLowerCase().includes(programSearch.toLowerCase())
                    ).map(program => (
                      <div key={program.id} className="p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors">
                        <div className="text-sm text-gray-700">{program.name}</div>
                      </div>
                    ))}
                    {programs.slice(1).filter(program => 
                      program.name.toLowerCase().includes(programSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No matching programs found
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-800">Providers</h3>
                  <div className="flex items-center">
                    <input
                      id="includeInactiveProviders"
                      name="includeInactiveProviders"
                      type="checkbox"
                      checked={filters.includeInactiveProviders}
                      onChange={handleFilterChange}
                      className="h-3.5 w-3.5 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="includeInactiveProviders" className="ml-1.5 text-xs text-gray-500">
                      Include inactive Providers
                    </label>
                  </div>
                </div>
                
                <div className="border bg-white border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <div className="p-2 border-b border-gray-200 bg-gray-50">
                    <input
                      type="text"
                      placeholder="Search providers..."
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="bg-blue-50 p-2.5 border-b border-gray-200">
                      <div className="text-sm font-medium text-blue-700">All Providers</div>
                    </div>
                    {providers.filter(provider => 
                      provider.name.toLowerCase().includes(providerSearch.toLowerCase())
                    ).map(provider => (
                      <div key={provider.id} className="p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors flex justify-between items-center">
                        <div className="text-sm text-gray-700">{provider.name}</div>
                        {provider.count !== null && (
                          <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                            {provider.count}
                          </div>
                        )}
                      </div>
                    ))}
                    {providers.filter(provider => 
                      provider.name.toLowerCase().includes(providerSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No matching providers found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 p-4 bg-white overflow-hidden flex flex-col">
          {/* Calendar Header */}
          <div className="bg-orange-50/40 rounded-lg border border-gray-200 mb-4">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <Tooltip content="Create a new appointment" side="bottom">
                  <button 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                    onClick={() => setIsNewAppointmentModalOpen(true)}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Appointment
                  </button>
                </Tooltip>
                
                <Tooltip content={showFilters ? "Hide filter options" : "Show filter options"} side="bottom">
                  <button
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border ${showFilters ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'} transition-colors shadow-sm`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </Tooltip>
                
                <div className="flex items-center gap-2">
                  <Tooltip content="Previous" side="bottom">
                    <button 
                      onClick={handlePrev}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Go to today" side="bottom">
                    <button 
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={handleToday}
                    >
                      Today
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Next" side="bottom">
                    <button 
                      onClick={handleNext}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <h2 className="text-lg font-semibold text-gray-800 ml-2">
                    {getHeaderTitle()}
                  </h2>
                </div>
              </div>
              
              {/* View selection buttons */}
              <div className="flex items-center">
                <div className="flex mr-3">
                  <Tooltip content="Refresh calendar" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                      onClick={() => {
                        if (calendarRef.current) {
                          calendarRef.current.getApi().refetchEvents();
                        }
                      }}
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Export calendar" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 ml-1"
                      onClick={() => console.log('Export calendar')}
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Transfer appointments" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 ml-1"
                      onClick={() => console.log('Transfer appointments')}
                    >
                      <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="My Calendar" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 ml-1"
                      onClick={() => console.log('My Calendar')}
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Print calendar" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 ml-1"
                      onClick={() => console.log('Print calendar')}
                    >
                      <PrinterIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Export to Outlook" side="bottom">
                    <button 
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 ml-1"
                      onClick={() => console.log('Export to Outlook')}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 6L15.7071 11.2929C15.3166 11.6834 15.3166 12.3166 15.7071 12.7071L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 14V10C3 9.44772 3.44772 9 4 9H13C13.5523 9 14 9.44772 14 10V14C14 14.5523 13.5523 15 13 15H4C3.44772 15 3 14.5523 3 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
                
                <div className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <Tooltip content="Day view" side="bottom">
                    <button 
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${currentView === 'timeGridDay' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => {
                        setCurrentView('timeGridDay');
                        if (calendarRef.current) {
                          calendarRef.current.getApi().changeView('timeGridDay');
                        }
                      }}
                    >
                      Day
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Week view" side="bottom">
                    <button 
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${currentView === 'timeGridWeek' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => {
                        setCurrentView('timeGridWeek');
                        if (calendarRef.current) {
                          calendarRef.current.getApi().changeView('timeGridWeek');
                        }
                      }}
                    >
                      Week
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Month view" side="bottom">
                    <button 
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${currentView === 'dayGridMonth' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => {
                        setCurrentView('dayGridMonth');
                        if (calendarRef.current) {
                          calendarRef.current.getApi().changeView('dayGridMonth');
                        }
                      }}
                    >
                      Month
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            {/* Legend for appointment types */}
            <div className="px-4 py-2 bg-white flex items-center text-xs text-gray-600 border-b border-gray-200">
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-blue-400 mr-1.5"></span>
                <UserIcon className="w-4 h-4 text-blue-500 mr-1" />
                Individual
              </div>
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-purple-400 mr-1.5"></span>
                <UserGroupIcon className="w-4 h-4 text-purple-500 mr-1" />
                Group
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>
                <BoltIcon className="w-4 h-4 text-red-500 mr-1" />
                Crisis
              </div>
              <div className="ml-auto flex items-center text-xs text-gray-500">
                <span className="mr-1">Business hours:</span>
                <span className="font-medium">8:00am - 6:00pm</span>
              </div>
            </div>
          </div>
          
          {/* FullCalendar */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-visible">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
              initialView="timeGridDay"
              headerToolbar={false} // We're using our custom header
              events={getFilteredEvents()}
              resources={resources} // Always show all resources
              resourceAreaWidth="15%"
              resourceLabelDidMount={(info: any) => {
                // Customize resource labels if needed
              }}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              slotDuration="00:20:00"
              height="100%"
              resourceOrder="title"
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              nowIndicator={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
              }}
              businessHours={{
                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '18:00',
              }}
              views={{
                timeGridDay: {
                  // Day view settings
                  dayMaxEventRows: false,
                  eventMinHeight: 30
                },
                timeGridWeek: {
                  // Week view settings
                  dayMaxEventRows: true,
                  eventMinHeight: 25
                },
                dayGridMonth: {
                  // Month view settings
                  dayMaxEventRows: true,
                  eventMinHeight: 20
                }
              }}
              eventContent={(eventInfo) => {
                const { title, extendedProps } = eventInfo.event;
                const { patient, room, type, provider, patientInfo } = extendedProps;
                const startTime = new Date(eventInfo.event.start!).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
                const endTime = new Date(eventInfo.event.end!).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
                
                return (
                  <EventWithTooltip
                    title={title}
                    startTime={startTime}
                    endTime={endTime}
                    patient={patient}
                    room={room}
                    type={type}
                    provider={provider}
                    patientInfo={patientInfo}
                  />
                );
              }}
            />
          </div>
        </div>
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