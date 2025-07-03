import React, { useState, useEffect } from 'react';
import TopNavigationBar from '../components/old-ui/TopNavigationBar';
import MainNavigationBar from '../components/old-ui/MainNavigationBar';
import { 
  UserIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
  PrinterIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
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
import { Breadcrumb } from '../components/atoms/Breadcrumb/breadcrumb';
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
  const [status, setStatus] = useState('Scheduled');
  const [room, setRoom] = useState('');
  const [comments, setComments] = useState('');
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('every');
  const [repeatInterval, setRepeatInterval] = useState('day');
  const [repeatUntil, setRepeatUntil] = useState('');
  const [location, setLocation] = useState('');
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

  // Handler for Save (stub)
  const handleSave = () => {
    // TODO: Implement save logic
    alert('Appointment saved!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
      {/* Top Navigation Bar */}
      <TopNavigationBar hospitalName="Demo Hospital" userAvatarUrl="/avatar.png" />
      {/* Main Navigation Bar */}
      <MainNavigationBar />
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-2 sm:px-4">
        {/* Breadcrumb */}
        <div className="px-0 pt-4 pb-0">
          <Breadcrumb items={[
            { label: 'Schedule', href: '/schedule' },
            { label: 'New Appointment' }
          ]} />
        </div>
        {/* Page Header */}
        <div className="px-0 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Add New Appointment</h1>
          {/* Action Buttons (desktop only, top right) */}
          <div className="hidden sm:flex flex-row gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" size="sm" className="text-xs h-8 w-full sm:w-auto">Cancel</Button>
            {/* Only show Find Available for person or benefits tab */}
            {(activeTab === 'person' || activeTab === 'benefits') && (
              <Button type="button" variant="outline" size="sm" className="text-xs h-8 w-full sm:w-auto">Find Available</Button>
            )}
            <Button type="button" variant="outline" size="sm" className="text-xs h-8 text-red-600 border-red-400 p-2 w-full sm:w-auto" aria-label="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
            <Button type="submit" size="sm" className="text-xs h-8 bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto">Save Appointment</Button>
          </div>
        </div>
        {/* Main Content - Scrollable Area */}
        <form className="flex-1 p-2 pt-0" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {/* Card with fixed height and internal scroll, responsive */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mx-auto" style={{ height: '82vh', overflowY: 'auto', maxWidth: '100%' }}>
            {/* Appointment Type Selection as Tab Bar */}
            <div className="p-2 sm:p-4 border-b border-gray-100">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Appointment Type</Label>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'person' | 'provider' | 'group' | 'benefits')}>
                <TabsList>
                  <TabsTrigger value="person">
                    <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Person
                  </TabsTrigger>
                  <TabsTrigger value="provider">
                    <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Provider
                  </TabsTrigger>
                  <TabsTrigger value="group">
                    <UserGroupIcon className="h-3.5 w-3.5 mr-1.5" /> Group
                  </TabsTrigger>
                  <TabsTrigger value="benefits">
                    <InformationCircleIcon className="h-3.5 w-3.5 mr-1.5" /> Benefits
                  </TabsTrigger>
                </TabsList>
                {/* Tab Content: Render form sections based on selected tab */}
                <TabsContent value="person">
                  {/* Person Appointment Form Content (copied from modal) */}
                  <div>
                    <div className="p-4 space-y-4">
                      {/* Basic Information Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
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
                            <div className="flex justify-between">
                              <Label htmlFor="encounterType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category:*</Label>
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
                          <div className="grid grid-cols-1 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="room" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Room:</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="room"
                                  value={room}
                                  onChange={(e) => setRoom(e.target.value)}
                                  className="h-8 text-sm flex-1"
                                />
                                <button
                                  type="button"
                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium underline whitespace-nowrap"
                                  onClick={() => { console.log('Allocate Room clicked'); }}
                                >
                                  Allocate Room
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {/* Date & Time Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Date & Time</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Date and All Day Event Row */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2 space-y-1">
                                <Label htmlFor="appointmentDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
                                <Input
                                  id="appointmentDate"
                                  type="date"
                                  value={appointmentDate}
                                  onChange={(e) => setAppointmentDate(e.target.value)}
                                  className="h-8 text-sm"
                                  required
                                />
                              </div>
                              <div className="flex items-center pt-6">
                                <Checkbox
                                  id="allDayEvent"
                                  checked={isAllDay}
                                  onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
                                  className="h-3 w-3"
                                />
                                <label htmlFor="allDayEvent" className="ml-1.5 text-xs text-gray-600">All day event</label>
                              </div>
                            </div>
                            {/* Time and Duration Row */}
                            {!isAllDay && (
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <Label htmlFor="startTime" className="text-xs text-gray-500">Start Time</Label>
                                  <Input
                                    id="startTime"
                                    type="time"
                                    value={appointmentStartTime}
                                    onChange={(e) => setAppointmentStartTime(e.target.value)}
                                    className="h-8 text-sm"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor="endTime" className="text-xs text-gray-500">End Time</Label>
                                  <Input
                                    id="endTime"
                                    type="time"
                                    value={appointmentEndTime}
                                    onChange={(e) => setAppointmentEndTime(e.target.value)}
                                    className="h-8 text-sm"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor="duration" className="text-xs text-gray-500">Duration</Label>
                                  <div className="flex items-center gap-1">
                                    <Input
                                      id="duration"
                                      type="number"
                                      value={duration}
                                      onChange={(e) => setDuration(e.target.value)}
                                      min="0"
                                      className="h-8 text-sm flex-1"
                                    />
                                    <span className="text-xs text-gray-500 whitespace-nowrap">min</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Repeating Appointment Section */}
                            <div className="pt-1 space-y-2">
                              <div className="flex items-center">
                                <Checkbox
                                  id="repeats"
                                  checked={isRepeating}
                                  onCheckedChange={(checked) => setIsRepeating(checked as boolean)}
                                  className="h-3 w-3"
                                />
                                <label htmlFor="repeats" className="ml-1.5 text-xs font-medium text-gray-700">Repeating Appointment</label>
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
                                        <CalendarIcon className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {/* Provider Information Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Provider Information</CardTitle>
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
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500">*</span></Label>
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
                                className="h-3 w-3"
                              />
                              <label htmlFor="telehealth" className="ml-1.5 text-xs text-gray-600">
                                <PhoneIcon className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                                Telehealth Appointment
                              </label>
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                id="printAppointmentSlip"
                                checked={printAppointmentSlip}
                                onCheckedChange={(checked) => setPrintAppointmentSlip(checked as boolean)}
                                className="h-3 w-3"
                              />
                              <label htmlFor="printAppointmentSlip" className="ml-1.5 text-xs text-gray-600">
                                <PrinterIcon className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                                Print Appointment Slip
                              </label>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-blue-600 text-xs"
                            >
                              <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                              Check-In as Arrived
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="provider">
                  {/* Provider Appointment Form Content (copied from modal) */}
                  <div>
                    <div className="p-4 space-y-4">
                      {/* Basic Information Card */}
                      <Card className="shadow-none border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800">Basic Information</CardTitle>
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
                            <Label htmlFor="supervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:<span className="text-red-500">*</span></Label>
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
                  {/* ...Copy all Benefits tab form content from modal here... */}
                </TabsContent>
              </Tabs>
            </div>
            {/* Mobile Action Buttons (bottom of form card, only on mobile) */}
            <div className="flex flex-col gap-2 sm:hidden mt-4 px-4 pb-4">
              <div className="flex flex-row gap-2 w-full">
                <Button type="button" variant="outline" size="sm" className="text-xs h-10 text-blue-600 border-blue-400 flex-1">Cancel</Button>
                {/* Only show Find Available for person or benefits tab */}
                {(activeTab === 'person' || activeTab === 'benefits') && (
                  <Button type="button" variant="outline" size="sm" className="text-xs h-10 text-blue-600 border-blue-400 flex-1">Find Available</Button>
                )}
                <Button type="button" variant="outline" size="sm" className="text-xs h-10 text-red-600 border-red-400 p-2 flex-1" aria-label="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <Button type="submit" size="sm" className="text-xs h-10 bg-sky-500 hover:bg-sky-600 text-white w-full">Save Appointment</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentPage; 