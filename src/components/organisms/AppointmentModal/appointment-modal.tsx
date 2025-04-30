import React, { FC, useState, useEffect } from 'react'
import { 
  XMarkIcon,
  UserIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
  PrinterIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'
import { 
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from '../../atoms/Select'
import { Checkbox } from '../../atoms/Checkbox'
import { Textarea } from '../../atoms/Textarea'
import { Button } from '../../atoms/Button'
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../atoms/Card'

interface Appointment {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  provider: string;
  patient: string;
  type: 'Individual' | 'Group' | 'Crisis';
  room?: string;
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

export const AppointmentModal: FC<AppointmentModalProps> = ({
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
        
        {/* Recipient Type Selection */}
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
            {/* Basic Information */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="patient">Person:</Label>
                  <Select 
                    value={patient} 
                    onValueChange={setPatient}
                  >
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Click to select" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="encounterType">Category:*</Label>
                    <div className="flex items-center">
                      <Checkbox
                        id="showOnlyMine"
                        checked={showOnlyMine}
                        onCheckedChange={(checked) => setShowOnlyMine(checked as boolean)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="showOnlyMine" className="ml-2 text-xs text-gray-600">
                        Show Only Mine
                      </label>
                    </div>
                  </div>
                  <Select 
                    value={encounterType} 
                    onValueChange={setEncounterType}
                  >
                    <SelectTrigger id="encounterType">
                      <SelectValue placeholder="-- Select Encounter Type --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Therapy">Therapy</SelectItem>
                      <SelectItem value="Medication Management">Medication Management</SelectItem>
                      <SelectItem value="Crisis Intervention">Crisis Intervention</SelectItem>
                    </SelectContent>
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
                      value={type} 
                      onValueChange={(value) => setType(value as 'Individual' | 'Group' | 'Crisis')}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Crisis">Crisis</SelectItem>
                      </SelectContent>
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
            
            {/* Date & Time */}
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
                        onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
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
                      onCheckedChange={(checked) => setIsRepeating(checked as boolean)}
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
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="every">every</SelectItem>
                          <SelectItem value="every other">every other</SelectItem>
                          <SelectItem value="every third">every third</SelectItem>
                          <SelectItem value="every fourth">every fourth</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={repeatInterval} 
                        onValueChange={setRepeatInterval}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">day</SelectItem>
                          <SelectItem value="week">week</SelectItem>
                          <SelectItem value="month">month</SelectItem>
                          <SelectItem value="year">year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Provider Information */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="provider">Provider:</Label>
                  <Select 
                    value={provider} 
                    onValueChange={setProvider}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="supervisingProvider">Supervising provider:*</Label>
                  <Select 
                    value={supervisingProvider} 
                    onValueChange={setSupervisingProvider}
                  >
                    <SelectTrigger id="supervisingProvider">
                      <SelectValue placeholder="-- Unassigned --" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="program">Program:*</Label>
                  <Select 
                    value={program} 
                    onValueChange={setProgram}
                  >
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1111ADiamond1111 Facility">1111ADiamond1111 Facility</SelectItem>
                      <SelectItem value="A-AADO">A-AADO</SelectItem>
                      <SelectItem value="A-METH">A-METH</SelectItem>
                      <SelectItem value="ABCXYZ">ABCXYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="billingProgram">Billing Program:*</Label>
                  <Select 
                    value={billingProgram} 
                    onValueChange={setBillingProgram}
                  >
                    <SelectTrigger id="billingProgram">
                      <SelectValue placeholder="Select Billing Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                      <SelectItem value="BILLING123">BILLING123</SelectItem>
                      <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Options */}
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status:</Label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Checked In">Checked In</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="No Show">No Show</SelectItem>
                    </SelectContent>
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
                      onCheckedChange={(checked) => setIsTelehealth(checked as boolean)}
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
                      onCheckedChange={(checked) => setPrintAppointmentSlip(checked as boolean)}
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