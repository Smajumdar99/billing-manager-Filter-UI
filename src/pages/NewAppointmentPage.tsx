import React, { useState, useEffect, useMemo } from 'react';
import TopNavigationBar from '../components/old-ui/TopNavigationBar';
import MainNavigationBar from '../components/old-ui/MainNavigationBar';
// Heroicons no longer needed - all replaced with FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUsers, faUser, faPhone, faPrint, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import { Input } from '../components/atoms/Input';
import { Label } from '../components/atoms/Label';
import { 
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from '../components/atoms/Select';
import { Checkbox } from '../components/atoms/Checkbox';
import { Switch } from '../components/atoms/Switch/switch';
import { Textarea } from '../components/atoms/Textarea';
import { Button } from '../components/atoms/Button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/atoms/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/molecules/Tabs/tabs';
import GroupAppointmentForm from '../components/molecules/GroupAppointmentForm/group-appointment-form';
import AddressSelectionModal from '../components/molecules/GroupAppointmentForm/AddressSelectionModal';
import { Breadcrumb } from '../components/atoms/Breadcrumb/breadcrumb';
import { useParams } from 'react-router-dom';
import FindAvailableDialog from '@/components/organisms/FindAvailableDialog/find-available-dialog';
import AppointmentEditActions from '../components/molecules/AppointmentEditActions/appointment-edit-actions';
import { RecurringEditDialog } from '../components/molecules/RecurringEditDialog';
import RoomAllocationModal from '@/components/molecules/GroupAppointmentForm/RoomAllocationModal';
// Import other atomic components and form sections as needed
// (Assume Person and Provider form content is modularized or inline for now)

// Sample providers and patients data for demonstration
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

const NewAppointmentPage: React.FC = () => {
  // Get appointmentId from route params to detect edit mode
  const { appointmentId } = useParams<{ appointmentId?: string }>();
  const isEditMode = Boolean(appointmentId);
  const isCreateMode = !isEditMode;

  // Tab state
  const [activeTab, setActiveTab] = useState<'person' | 'provider' | 'group' | 'benefits'>('person');
  // Form state (copied from modal)
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [patient, setPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentStartTime, setAppointmentStartTime] = useState('');
  const [appointmentEndTime, setAppointmentEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [duration, setDuration] = useState('20');
  const [encounterType, setEncounterType] = useState('');
  const [program, setProgram] = useState('1111ADiamond1111 Facility');
  const [billingProgram, setBillingProgram] = useState('');
  const [supervisingProvider, setSupervisingProvider] = useState('');
  const [status, setStatus] = useState('Created');
  const [room, setRoom] = useState('');
  const [comments, setComments] = useState('');
  // Set isRepeating to true for group appointments in edit mode (for demo)
  const [isRepeating, setIsRepeating] = useState(isEditMode && activeTab === 'group');
  const [repeatFrequency, setRepeatFrequency] = useState('every');
  const [repeatInterval, setRepeatInterval] = useState('day');
  const [repeatUntil, setRepeatUntil] = useState('');
  const [location, setLocation] = useState('');
  const [isTelehealth, setIsTelehealth] = useState(false);
  const [printAppointmentSlip, setPrintAppointmentSlip] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  
  // Room allocation state
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomAllocationModal, setShowRoomAllocationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
  
  // Recurring edit dialog state
  const [showRecurringEditDialog, setShowRecurringEditDialog] = useState(false);
  const [showFindAvailableDialog, setShowFindAvailableDialog] = useState(false);

  // Duration calculation function - matches Group form logic
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight appointments (end time is next day)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Add 24 hours
    }
    
    return endMinutes - startMinutes;
  };

  // Memoized duration calculation
  const calculatedDuration = useMemo(() => {
    return calculateDuration(appointmentStartTime, appointmentEndTime);
  }, [appointmentStartTime, appointmentEndTime]);

  // Mock fetch function for demo (replace with real API call)
  const fetchAppointment = async (id: string) => {
    // Simulate fetching appointment data
    if (id === '6') {
      return {
        title: 'Group Therapy Session',
        provider: 'Sarah Wilson, LCSW',
        patient: '',
        appointmentDate: '2025-07-04',
        appointmentStartTime: '08:40',
        appointmentEndTime: '09:40',
        isAllDay: false,
        duration: '60',
        encounterType: 'Therapy',
        program: '1111ADiamond1111 Facility',
        billingProgram: 'APOLLO1234',
        supervisingProvider: 'James Taylor, LCDC',
        status: 'Confirmed',
        room: 'Conference Room A',
        comments: 'Staff Training',
        isRepeating: false,
        repeatFrequency: 'every',
        repeatInterval: 'week',
        repeatUntil: '',
        location: 'main-clinic',
        isTelehealth: false,
        printAppointmentSlip: false,
        showOnlyMine: false,
        type: 'Group',
      };
    }
    // Default mock
    return null;
  };

  // Load appointment data if editing
  useEffect(() => {
    if (isEditMode && appointmentId) {
      fetchAppointment(appointmentId).then(data => {
        if (data) {
          setTitle(data.title || '');
          setProvider(data.provider || '');
          setPatient(data.patient || '');
          setAppointmentDate(data.appointmentDate || '');
          setAppointmentStartTime(data.appointmentStartTime || '');
          setAppointmentEndTime(data.appointmentEndTime || '');
          setIsAllDay(data.isAllDay || false);
          setDuration(data.duration || '');
          setEncounterType(data.encounterType || '');
          setProgram(data.program || '');
          setBillingProgram(data.billingProgram || '');
          setSupervisingProvider(data.supervisingProvider || '');
          setStatus(data.status || '');
          setRoom(data.room || '');
          setComments(data.comments || '');
          setIsRepeating(data.isRepeating || false);
          setRepeatFrequency(data.repeatFrequency || 'every');
          setRepeatInterval(data.repeatInterval || 'day');
          setRepeatUntil(data.repeatUntil || '');
          setLocation(data.location || '');
          setIsTelehealth(data.isTelehealth || false);
          setPrintAppointmentSlip(data.printAppointmentSlip || false);
          setShowOnlyMine(data.showOnlyMine || false);
          // Auto-select correct tab based on type
          if (data.type === 'Group') setActiveTab('group');
          else if (data.type === 'provider') setActiveTab('provider');
          else if (data.type === 'benefits') setActiveTab('benefits');
          else setActiveTab('person');
        }
      });
    }
  }, [isEditMode, appointmentId]);

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

  // Update isRepeating when switching to group tab in edit mode (for demo)
  useEffect(() => {
    if (isEditMode && activeTab === 'group') {
      setIsRepeating(true);
    }
  }, [isEditMode, activeTab]);

  // Handler for Save - checks for recurring appointments
  const handleSave = () => {
    // Check if this is an edit mode and appointment is recurring
    if (isEditMode && isRepeating) {
      // Show recurring edit dialog to let user choose
      setShowRecurringEditDialog(true);
    } else {
      // Save normally for non-recurring or new appointments
      handleSaveAppointment('single');
    }
  };

  // Actual save logic - handles both single and recurring saves
  const handleSaveAppointment = (editType: 'single' | 'all') => {
    // Close the recurring dialog if it was open
    setShowRecurringEditDialog(false);
    
    // TODO: Implement actual save logic based on editType
    if (editType === 'single') {
      console.log('Saving only this occurrence...');
      // API call to save only this occurrence
      alert('This appointment occurrence saved!');
    } else {
      console.log('Saving all occurrences in the series...');
      // API call to save all occurrences in the recurring series
      alert('All appointment occurrences saved!');
    }
    
    // TODO: Navigate back to calendar or show success message
    // Example: navigate('/calendar');
  };

  // Handler for editing this occurrence only
  const handleEditThisOccurrence = () => {
    handleSaveAppointment('single');
  };

  // Handler for editing all occurrences
  const handleEditAllOccurrences = () => {
    handleSaveAppointment('all');
  };

  // Handler for closing recurring edit dialog
  const handleCloseRecurringDialog = () => {
    setShowRecurringEditDialog(false);
  };

  // Room allocation handlers
  const handleRoomSelected = (room: any) => {
    setSelectedRoom(room);
    setShowRoomAllocationModal(false);
  };

  const handleAddressSelected = (address: any) => {
    setSelectedAddress(address);
    setShowAddressSelectionModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
      {/* Top Navigation Bar */}
      <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
      {/* Main Navigation Bar */}
      <MainNavigationBar activeItem="Schedule" />
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-2 sm:px-4">
        {/* Breadcrumb */}
        <div className="px-0 pt-4 pb-2">
          <Breadcrumb items={[
            { label: 'Schedule', href: '/my-calendar' },
            { label: isEditMode ? 'Edit Appointment' : 'New Appointment' }
          ]} />
        </div>

        {/* Main Content - Scrollable Area */}
        <form className="flex-1 p-0 pt-0" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {/* Card with fixed height and internal scroll, responsive */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mx-auto" style={{ height: '84vh', overflowY: 'auto', maxWidth: '100%' }}>
            {/* Appointment Type Selection as Tab Bar and Tab Content */}
            <div className="p-2 sm:p-4 border-b border-gray-100">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'person' | 'provider' | 'group' | 'benefits')}>
                {/* Only show label and tab triggers if not in edit mode */}
                {!isEditMode && (
                  <>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Appointment Type</Label>
                    <TabsList>
                      <TabsTrigger value="person">
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-1.5" /> Person
                      </TabsTrigger>
                      <TabsTrigger value="provider">
                        <FontAwesomeIcon icon={faUserMd} className="h-4 w-4 mr-1.5" /> Provider
                      </TabsTrigger>
                      <TabsTrigger value="group">
                        <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-1.5" /> Group
                      </TabsTrigger>

                    </TabsList>
                  </>
                )}
                {/* Tab Content: Always render all, but only the activeTab is visible */}
                <TabsContent value="person">
                  {/* Person Appointment Form Content */}
                  <div>
                    <div className="p-4 space-y-4">
                      {/* First Row - For Whom and For What - Side by Side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - For Whom */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">For Whom</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="patient" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Person:</Label>
                              <Select value={patient} onValueChange={setPatient}>
                                <SelectTrigger id="patient" className="h-8 text-sm">
                                  <SelectValue placeholder="Click to select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {samplePatients.map(p => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="title" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title:</Label>
                              <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-8 text-sm"
                                required
                              />
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Right Column - For What */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">For What</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <Label htmlFor="encounterType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Type:<span className="text-red-500 font-bold text-sm">*</span></Label>
                                <div className="flex items-center">
                                  <Checkbox
                                    id="showOnlyMine"
                                    checked={showOnlyMine}
                                    onCheckedChange={(checked) => setShowOnlyMine(checked as boolean)}
                                    className="h-3 w-3"
                                  />
                                  <label htmlFor="showOnlyMine" className="ml-1.5 text-xs text-gray-600">
                                    Show Only Mine
                                  </label>
                                </div>
                              </div>
                              <Select value={encounterType} onValueChange={setEncounterType}>
                                <SelectTrigger id="encounterType" className="h-8 text-sm">
                                  <SelectValue placeholder="-- Select Contact Type --" />
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
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Second Row - When and Where - Side by Side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - When */}
                        <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">When</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Date and All Day Event Row - Matches Group form layout */}
                            <div className="space-y-2">
                              <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Input 
                                    id="appointmentDate" 
                                    type="date" 
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="h-9 text-sm w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch 
                                    id="allDayEvent"
                                    checked={isAllDay}
                                    onCheckedChange={setIsAllDay}
                                  />
                                  <label htmlFor="allDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer">
                                    All day event
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* Time Controls - Hidden when All Day Event is on - Matches Group form */}
                            {!isAllDay && (
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="startTime" 
                                      type="time" 
                                      value={appointmentStartTime}
                                      onChange={(e) => setAppointmentStartTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                    <span className="text-sm text-gray-400">—</span>
                                    <Input 
                                      id="endTime" 
                                      type="time" 
                                      value={appointmentEndTime}
                                      onChange={(e) => setAppointmentEndTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                  </div>
                                  {calculatedDuration > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                                      <span className="text-sm font-semibold text-blue-700">{calculatedDuration}</span>
                                      <span className="text-xs text-blue-600 font-medium">mins</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Repeating Appointment Section - Matches Group form with Switch */}
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Switch 
                                  id="repeats"
                                  checked={isRepeating}
                                  onCheckedChange={setIsRepeating}
                                />
                                <label htmlFor="repeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                                  Repeats
                                </label>
                              </div>
                              {isRepeating && (
                                <div className="ml-5 space-y-2">
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Repeat</span>
                                    <div className="col-span-5">
                                      <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="every">every</SelectItem>
                                          <SelectItem value="every other">every other</SelectItem>
                                          <SelectItem value="every third">every third</SelectItem>
                                          <SelectItem value="every fourth">every fourth</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="col-span-5">
                                      <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                                        <SelectTrigger className="h-8 text-sm">
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
                                  </div>
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Until</span>
                                    <div className="col-span-6">
                                      <div className="relative">
                                        <Input
                                          id="repeatUntil"
                                          type="date"
                                          value={repeatUntil}
                                          onChange={(e) => setRepeatUntil(e.target.value)}
                                          className="h-8 text-sm pr-8"
                                          placeholder="Select end date"
                                        />
                                        <FontAwesomeIcon icon={faCalendar} className="absolute right-2 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        </Card>
                        
                        {/* Right Column - Where */}
                        <Card className="shadow-none border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                            <CardTitle className="text-sm font-semibold text-gray-800">Where</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Address:</Label>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowAddressSelectionModal(true)}
                                  >
                                    {selectedAddress ? 'Change Address' : 'Select Address'}
                                  </Button>
                                  {selectedAddress ? (
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{selectedAddress.name}</div>
                                      <div className="text-xs text-gray-600">
                                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-700">145, 8th Avenue<br />Portland, FL - 433323455</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Room Allocation */}
                              {!selectedRoom ? (
                                <div className="pt-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowRoomAllocationModal(true)}
                                  >
                                    Allocate Room
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allocated Room:</Label>
                                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-green-800">{selectedRoom.name}</div>
                                      <div className="text-xs text-green-600">
                                        {selectedRoom.building} • Floor {selectedRoom.floor} • Capacity: {selectedRoom.capacity}
                                      </div>
                                    </div>
                                    <TooltipProvider>
                                      <div className="flex items-center gap-1">
                                        <TooltipRoot>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              onClick={() => setShowRoomAllocationModal(true)}
                                              className="text-green-600 hover:text-green-800 p-1"
                                            >
                                              <PencilIcon className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Edit room allocation</p>
                                          </TooltipContent>
                                        </TooltipRoot>
                                        <TooltipRoot>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              onClick={() => setSelectedRoom(null)}
                                              className="text-green-600 hover:text-green-800 p-1"
                                            >
                                              <XMarkIcon className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Release room</p>
                                          </TooltipContent>
                                        </TooltipRoot>
                                      </div>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Third Row - With Whom - Full Width */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">With Whom</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="provider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
                            <Select value={provider} onValueChange={setProvider}>
                              <SelectTrigger id="provider" className="h-8 text-sm">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={supervisingProvider} onValueChange={setSupervisingProvider}>
                              <SelectTrigger id="supervisingProvider" className="h-8 text-sm">
                                <SelectValue placeholder="-- Unassigned --" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="program" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:</Label>
                            <Select value={program} onValueChange={setProgram}>
                              <SelectTrigger id="program" className="h-8 text-sm">
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
                          <div className="space-y-1">
                            <Label htmlFor="billingProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Program:</Label>
                            <Select value={billingProgram} onValueChange={setBillingProgram}>
                              <SelectTrigger id="billingProgram" className="h-8 text-sm">
                                <SelectValue placeholder="Select Billing Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                                <SelectItem value="BILLING123">BILLING123</SelectItem>
                                <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="location" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={location} onValueChange={setLocation}>
                              <SelectTrigger id="location" className="h-8 text-sm">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facility1">1 New Facilityss</SelectItem>
                                <SelectItem value="apollo">APOLLO Hospitals</SelectItem>
                                <SelectItem value="main-clinic">Main Clinic</SelectItem>
                                <SelectItem value="east-wing">East Wing</SelectItem>
                                <SelectItem value="west-wing">West Wing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Fourth Row - Everything Else - Full Width */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Everything Else</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</Label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger id="status" className="h-8 text-sm">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Created">Created</SelectItem>
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
                          <div className="space-y-1">
                            <Label htmlFor="comments" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments:</Label>
                            <Textarea
                              id="comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                          <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center">
                              <Checkbox
                                id="telehealth"
                                checked={isTelehealth}
                                onCheckedChange={(checked) => setIsTelehealth(checked as boolean)}
                              />
                              <label htmlFor="telehealth" className="ml-1.5 text-sm text-gray-600">
                                <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                Telehealth Appointment
                              </label>
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                id="printAppointmentSlip"
                                checked={printAppointmentSlip}
                                onCheckedChange={(checked) => setPrintAppointmentSlip(checked as boolean)}
                              />
                              <label htmlFor="printAppointmentSlip" className="ml-1.5 text-sm text-gray-600">
                                <FontAwesomeIcon icon={faPrint} className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                Print Appointment Slip
                              </label>
                            </div>
                          </div>
                        
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="provider">
                  {/* Provider Appointment Form Content */}
                  <div>
                    <div className="p-4 space-y-4">
                      {/* With Whom Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">With Whom</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="provider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
                            <Select value={provider} onValueChange={setProvider}>
                              <SelectTrigger id="provider" className="h-8 text-sm">
                                <SelectValue placeholder="Select Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500 font-bold text-sm">*</span></Label>
                            <Select value={supervisingProvider} onValueChange={setSupervisingProvider}>
                              <SelectTrigger id="supervisingProvider" className="h-8 text-sm">
                                <SelectValue placeholder="-- Unassigned --" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleProviders.map(p => (
                                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="program" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:<span className="text-red-500">*</span></Label>
                            <Select value={program} onValueChange={setProgram}>
                              <SelectTrigger id="program" className="h-8 text-sm">
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
                          <div className="space-y-1">
                            <Label htmlFor="billingProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Program:<span className="text-red-500">*</span></Label>
                            <Select value={billingProgram} onValueChange={setBillingProgram}>
                              <SelectTrigger id="billingProgram" className="h-8 text-sm">
                                <SelectValue placeholder="Select Billing Program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APOLLO1234">APOLLO1234</SelectItem>
                                <SelectItem value="BILLING123">BILLING123</SelectItem>
                                <SelectItem value="INSURANCE456">INSURANCE456</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="location" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:<span className="text-red-500">*</span></Label>
                            <Select value={location} onValueChange={setLocation}>
                              <SelectTrigger id="location" className="h-8 text-sm">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facility1">1 New Facilityss</SelectItem>
                                <SelectItem value="apollo">APOLLO Hospitals</SelectItem>
                                <SelectItem value="main-clinic">Main Clinic</SelectItem>
                                <SelectItem value="east-wing">East Wing</SelectItem>
                                <SelectItem value="west-wing">West Wing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* When Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">When</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Date and All Day Event Row - Matches Group form layout */}
                            <div className="space-y-2">
                              <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Input 
                                    id="appointmentDate" 
                                    type="date" 
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="h-9 text-sm w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch 
                                    id="allDayEvent"
                                    checked={isAllDay}
                                    onCheckedChange={setIsAllDay}
                                  />
                                  <label htmlFor="allDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer">
                                    All day event
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* Time Controls - Hidden when All Day Event is on - Matches Group form */}
                            {!isAllDay && (
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="startTime" 
                                      type="time" 
                                      value={appointmentStartTime}
                                      onChange={(e) => setAppointmentStartTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                    <span className="text-sm text-gray-400">—</span>
                                    <Input 
                                      id="endTime" 
                                      type="time" 
                                      value={appointmentEndTime}
                                      onChange={(e) => setAppointmentEndTime(e.target.value)}
                                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                      required
                                    />
                                  </div>
                                  {calculatedDuration > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                                      <span className="text-sm font-semibold text-blue-700">{calculatedDuration}</span>
                                      <span className="text-xs text-blue-600 font-medium">mins</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Repeating Appointment Section - Matches Group form with Switch */}
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Switch 
                                  id="repeats"
                                  checked={isRepeating}
                                  onCheckedChange={setIsRepeating}
                                />
                                <label htmlFor="repeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                                  Repeats
                                </label>
                              </div>
                              {isRepeating && (
                                <div className="ml-5 space-y-2">
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Repeat</span>
                                    <div className="col-span-5">
                                      <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                        <SelectTrigger className="h-8 text-sm">
                                          <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="every">every</SelectItem>
                                          <SelectItem value="every other">every other</SelectItem>
                                          <SelectItem value="every third">every third</SelectItem>
                                          <SelectItem value="every fourth">every fourth</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="col-span-5">
                                      <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                                        <SelectTrigger className="h-8 text-sm">
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
                                  </div>
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    <span className="text-xs text-gray-600 col-span-2">Until</span>
                                    <div className="col-span-6">
                                      <div className="relative">
                                        <Input
                                          id="repeatUntil"
                                          type="date"
                                          value={repeatUntil}
                                          onChange={(e) => setRepeatUntil(e.target.value)}
                                          className="h-8 text-sm pr-8"
                                          placeholder="Select end date"
                                        />
                                        <FontAwesomeIcon icon={faCalendar} className="absolute right-2 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Additional Options Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Additional Options</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</Label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger id="status" className="h-8 text-sm">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Created">Created</SelectItem>
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
                          <div className="space-y-1">
                            <Label htmlFor="comments" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments:</Label>
                            <Textarea
                              id="comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="group">
                  <GroupAppointmentForm />
                </TabsContent>
                <TabsContent value="benefits">
                  {/* ...existing benefits tab content... */}
                </TabsContent>
              </Tabs>
              {/* Mobile Action Buttons (bottom of form card, only on mobile) */}
              <div className="flex flex-col gap-2 sm:hidden mt-4 px-4 pb-4">
                <div className="flex flex-row gap-2 w-full">
                  <Button type="button" variant="outline" className="text-sm h-10 text-blue-600 border-blue-400 flex-1">Cancel</Button>
                  {/* Only show Find Available for person or benefits tab */}
                  {(activeTab === 'person' || activeTab === 'benefits') && (
                    <Button type="button" variant="outline" className="text-sm h-10 text-blue-600 border-blue-400 flex-1">Find Available</Button>
                  )}
                  <Button type="button" variant="outline" className="text-sm h-10 text-red-600 border-red-400 p-2 flex-1" aria-label="Delete">
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mx-auto" />
                  </Button>
                </div>
                <Button type="submit" className="text-sm h-10 bg-sky-500 hover:bg-sky-600 text-white w-full">Save Appointment</Button>
              </div>
              
              {/* Desktop Sticky Action Footer (only on desktop) */}
              <div className="hidden sm:block sticky bottom-0 bg-white px-4 py-3 mt-4">
                {isEditMode ? (
                  /* Edit Mode Actions */
                  <AppointmentEditActions onSave={handleSave} />
                ) : (
                  /* Create Mode Actions */
                  <div className="flex flex-row gap-2 justify-end">
                    <Button type="button" variant="outline" className="text-sm h-8">Cancel</Button>
                    {/* Only show Find Available for person or benefits tab */}
                    {(activeTab === 'person' || activeTab === 'benefits') && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="text-sm h-8"
                        onClick={() => setShowFindAvailableDialog(true)}
                      >
                        Find Available
                      </Button>
                    )}
                    <Button type="button" variant="outline" className="text-xs h-8 text-red-600 border-red-400 p-2" aria-label="Delete">
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </Button>
                    <Button type="submit" className="text-sm h-8 ">Save Appointment</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Recurring Edit Dialog */}
      <RecurringEditDialog
        isOpen={showRecurringEditDialog}
        onClose={handleCloseRecurringDialog}
        onEditThis={handleEditThisOccurrence}
        onEditAll={handleEditAllOccurrences}
        appointmentTitle={title || 'Untitled Appointment'}
      />
      
      {/* Find Available Dialog */}
      <FindAvailableDialog
        open={showFindAvailableDialog}
        onClose={() => setShowFindAvailableDialog(false)}
      />
      
      {/* Room Allocation Modal */}
      <RoomAllocationModal
        open={showRoomAllocationModal}
        onClose={() => setShowRoomAllocationModal(false)}
        onRoomSelected={handleRoomSelected}
        selectedDate={appointmentDate}
        selectedTime={appointmentStartTime}
      />
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressSelectionModal}
        onClose={() => setShowAddressSelectionModal(false)}
        onAddressSelected={handleAddressSelected}
        selectedAddress={selectedAddress}
      />
    </div>
  );
};

export default NewAppointmentPage; 