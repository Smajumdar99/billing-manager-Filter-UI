import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../atoms/Card';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/Select/select';
import { Textarea } from '../../atoms/Textarea';
import { Button } from '../../atoms/Button';
import { Switch } from '../../atoms/Switch/switch';

import { Combobox, ComboboxOption } from '../../atoms/Combobox/Combobox';
import { DataTable } from '../../organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddPatientsModal from './AddPatientsModal';
import RoomAllocationModal from './RoomAllocationModal';
import AddressSelectionModal from './AddressSelectionModal';

// GroupAppointmentForm: Modular form for Group tab in AppointmentModal
const GroupAppointmentForm: React.FC = () => {
  const [isTelehealth, setIsTelehealth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addPatients, setAddPatients] = useState(false);
  const [addPatientsModalOpen, setAddPatientsModalOpen] = useState(false);
  // State for Room Allocation Modal
  const [showRoomAllocationModal, setShowRoomAllocationModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  
  // State for Address Selection Modal
  const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  // State for conditional UI controls
  const [isAllDayEvent, setIsAllDayEvent] = useState(false)
  const [hasRepeats, setHasRepeats] = useState(false)
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Calculate duration in minutes based on start and end time
  const calculateDuration = useCallback((start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Handle case where end time is next day (e.g., start: 23:00, end: 01:00)
    if (endMinutes < startMinutes) {
      return (24 * 60 - startMinutes) + endMinutes;
    }
    
    return endMinutes - startMinutes;
  }, []);
  
  // Computed duration value
  const duration = useMemo(() => {
    return calculateDuration(startTime, endTime);
  }, [startTime, endTime, calculateDuration]);
  // Placeholder: group capacity and selected patients
  const groupCapacity = 10;
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  // Patient filter state
  const [patientFilter, setPatientFilter] = useState('admitted');
  // Add state for capacity warning
  const [capacityError, setCapacityError] = useState(false);
  // Waitlist state (mock data for now)
  const [showWaitlist, setShowWaitlist] = useState(false);
  const waitlistPatients = useMemo(() => [
    { id: '2003414', name: 'Waitlist, One', phone: '111-222-3333', ss: 'XXX-XX-1111', dob: '12/12/2000', pid: '2003414', externalId: '2003414' },
    { id: '2003415', name: 'Waitlist, Two', phone: '222-333-4444', ss: 'XXX-XX-2222', dob: '11/11/1999', pid: '2003415', externalId: '2003415' },
  ], []);
  const [groupEventPatients, setGroupEventPatients] = useState<any[]>([]); // Patients added to the event

  // Memoize patient options for Combobox
  const patientOptions: ComboboxOption[] = useMemo(() => [
    { value: '1003414', label: '12@3, Monster', description: '355-666-8888 | XXX-XX-5666 | 29/12/2004 | 1003414' },
    { value: '1003415', label: 'Jane Doe', description: '123-456-7890 | XXX-XX-1234 | 01/01/1990 | 1003415' },
    { value: '1003416', label: 'John Smith', description: '987-654-3210 | XXX-XX-4321 | 02/02/1985 | 1003416' },
    { value: '1003417', label: 'Alice Johnson', description: '555-111-2222 | XXX-XX-5678 | 03/03/1982 | 1003417' },
    { value: '1003418', label: 'Bob Brown', description: '444-222-3333 | XXX-XX-8765 | 04/04/1975 | 1003418' },
    { value: '1003419', label: 'Carol White', description: '333-444-5555 | XXX-XX-3456 | 05/05/1995 | 1003419' },
    { value: '1003420', label: 'David Black', description: '222-555-6666 | XXX-XX-6543 | 06/06/1988 | 1003420' },
    { value: '1003421', label: 'Eve Green', description: '111-666-7777 | XXX-XX-7890 | 07/07/1992 | 1003421' },
    { value: '1003422', label: 'Frank Blue', description: '666-777-8888 | XXX-XX-8901 | 08/08/1980 | 1003422' },
    { value: '1003423', label: 'Grace Red', description: '777-888-9999 | XXX-XX-9012 | 09/09/1978 | 1003423' },
    { value: '1003424', label: 'Hank Violet', description: '888-999-0000 | XXX-XX-0123 | 10/10/1983 | 1003424' },
    { value: '1003425', label: 'Ivy Orange', description: '999-000-1111 | XXX-XX-1230 | 11/11/1991 | 1003425' },
  ], []);

  // Memoize selected patient row data for DataTable
  const selectedPatientRowData = useMemo(() => patientOptions
    .filter(p => selectedPatients.includes(p.value))
    .map(p => {
      const [phone, ss, dob, extId] = (p.description || '').split(' | ');
      return {
        id: p.value,
        name: p.label,
        phone,
        ss,
        dob,
        pid: p.value,
        externalId: extId
      };
    }), [selectedPatients, patientOptions]);

  // Memoize event handlers
  const handleSelectedPatients = useCallback((newSelected: string[]) => {
    if (newSelected.length > groupCapacity) {
      setCapacityError(true);
      return;
    }
    setCapacityError(false);
    setSelectedPatients(newSelected);
  }, [groupCapacity]);

  const onSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > groupCapacity) {
      setCapacityError(true);
      // Deselect the last selected row
      event.node.setSelected(false);
      return;
    }
    setCapacityError(false);
    setSelectedPatients(selectedRows.map((row: any) => row.id));
  }, [groupCapacity]);

  // AG Grid column definitions
  const columnDefs: ColDef[] = [
    { headerName: '', field: 'checkbox', checkboxSelection: true, headerCheckboxSelection: true, width: 40, suppressMenu: true, pinned: 'left' },
    { headerName: 'Name', field: 'name', minWidth: 150 },
    { headerName: 'Phone', field: 'phone', minWidth: 120 },
    { headerName: 'SS', field: 'ss', minWidth: 120 },
    { headerName: 'DOB', field: 'dob', minWidth: 120 },
    { headerName: 'PID', field: 'pid', minWidth: 100 },
    { headerName: 'External ID', field: 'externalId', minWidth: 100 },
  ];

  // Handler for Add to Event
  const handleAddToEvent = useCallback(() => {
    // Add selected patients to groupEventPatients (avoid duplicates)
    setGroupEventPatients(prev => {
      const newPatients = selectedPatients.filter(pid => !prev.includes(pid));
      return [...prev, ...newPatients];
    });
    setAddPatientsModalOpen(false);
    setSelectedPatients([]); // Clear modal selection
  }, [selectedPatients]);

  // Handle room selection from RoomAllocationModal
  const handleRoomSelected = useCallback((room: any) => {
    setSelectedRoom(room);
    console.log('Room selected:', room);
    // You can add additional logic here to update the form with room details
  }, []);

  // Handle address selection from AddressSelectionModal
  const handleAddressSelected = useCallback((address: any) => {
    setSelectedAddress(address);
    console.log('Address selected:', address);
    // You can add additional logic here to update the form with address details
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Main Group Appointment Form Card */}
      <Card className="shadow-none border-gray-200">
        <CardContent className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="groupProgram" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program:*</Label>
              <Select>
                <SelectTrigger id="groupProgram" className="h-8 text-sm">
                  <SelectValue placeholder="A-AADO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A-AADO">A-AADO</SelectItem>
                  <SelectItem value="B-BILL">B-BILL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupBillingLocation" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Location:*</Label>
              <Select>
                <SelectTrigger id="groupBillingLocation" className="h-8 text-sm">
                  <SelectValue placeholder="Select Billing Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loc1">Location 1</SelectItem>
                  <SelectItem value="loc2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupCategory" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category:</Label>
              <Select>
                <SelectTrigger id="groupCategory" className="h-8 text-sm">
                  <SelectValue placeholder="-- Select One --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupLocation" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location:*</Label>
              <Select>
                <SelectTrigger id="groupLocation" className="h-8 text-sm">
                  <SelectValue placeholder="-- Select Location --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Clinic</SelectItem>
                  <SelectItem value="east">East Wing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupIncludedPrograms" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Included Programs:</Label>
              <Input id="groupIncludedPrograms" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider:</Label>
              <Select>
                <SelectTrigger id="groupProvider" className="h-8 text-sm">
                  <SelectValue placeholder="Admin, Ensoftek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin, Ensoftek</SelectItem>
                  <SelectItem value="provider2">Provider 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupSupervisingProvider" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Supervising provider:*</Label>
              <Select>
                <SelectTrigger id="groupSupervisingProvider" className="h-8 text-sm">
                  <SelectValue placeholder="-- Unassigned --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                  <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="groupAssistingStaff" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assisting Staff:</Label>
              <Input id="groupAssistingStaff" className="h-8 text-sm" />
            </div>
          </div>
          {/* Right Column - Enhanced DATE Section */}
          <div className="space-y-4">
            {/* Date Input with All Day Event Select */}
            <div className="space-y-2">
              <Label htmlFor="groupDate" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date:</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input 
                    id="groupDate" 
                    type="date" 
                    className="h-9 text-sm w-44 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="groupAllDayEvent"
                    checked={isAllDayEvent}
                    onCheckedChange={setIsAllDayEvent}
                  />
                  <label htmlFor="groupAllDayEvent" className="text-sm text-gray-700 font-medium cursor-pointer">
                    All day event
                  </label>
                </div>
              </div>
            </div>

            {/* Time Controls - Hidden when All Day Event is on */}
            {!isAllDayEvent && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time:</Label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Input 
                      id="groupStartTime" 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <span className="text-sm text-gray-400">—</span>
                    <Input 
                      id="groupEndTime" 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  {duration > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                      <span className="text-sm font-semibold text-blue-700">{duration}</span>
                      <span className="text-xs text-blue-600 font-medium">mins</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Repeats Switch */}
            <div className="flex items-center gap-3">
              <Switch 
                id="groupRepeats"
                checked={hasRepeats}
                onCheckedChange={setHasRepeats}
              />
              <label htmlFor="groupRepeats" className="text-sm text-gray-700 font-medium cursor-pointer">
                Repeats
              </label>
            </div>

            {/* Repeat Controls - Only show when Repeats is on */}
            {hasRepeats && (
              <div className="space-y-3 pl-7 border-l-2 border-blue-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <Select>
                    <SelectTrigger className="h-9 text-sm w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="every" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every">every</SelectItem>
                      <SelectItem value="every other">every other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-9 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">day</SelectItem>
                      <SelectItem value="week">week</SelectItem>
                      <SelectItem value="month">month</SelectItem>
                      <SelectItem value="year">year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">until</span>
                  <div className="relative">
                    <Input 
                      id="groupRepeatUntil" 
                      type="date" 
                      className="h-9 text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="dd/mm/yyyy" 
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className={selectedRoom ? "text-green-600 text-xs border-green-300" : "text-blue-600 text-xs"}
                onClick={() => setShowRoomAllocationModal(true)}
              >
                {selectedRoom ? 'Change Room' : 'Allocate Room'}
              </Button>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Address:</Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className={selectedAddress ? "text-green-600 text-xs border-green-300" : "text-blue-600 text-xs"}
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
            
            {/* Selected Room Display */}
            {selectedRoom && (
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
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedRoom(null)}
                    className="text-green-600 hover:text-green-800 p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="groupTelehealth"
                checked={isTelehealth}
                onCheckedChange={setIsTelehealth}
              />
              <label htmlFor="groupTelehealth" className="text-xs text-gray-600 font-medium select-none">
                Setup as Telehealth Appointment
              </label>
            </div>
            {/* Telehealth Details - show when switch is ON */}
            {isTelehealth && (
              <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                  <div className="flex-1">
                    <Label htmlFor="telehealthMeetingTopic" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Meeting Topic</Label>
                    <Select>
                      <SelectTrigger id="telehealthMeetingTopic" className="h-8 text-sm bg-white">
                        <SelectValue placeholder="-- Select One --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="topic1">Topic 1</SelectItem>
                        <SelectItem value="topic2">Topic 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="telehealthPassword" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</Label>
                    <div className="relative flex items-center">
                      <Input
                        id="telehealthPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="h-8 text-sm pr-10 bg-white"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="absolute right-2 text-xs text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-red-600 font-medium">
                  NOTE: Using a meeting password is strongly recommended for security.
                </div>
                <div className="flex flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="telehealthVisitOptions" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">TELEHEALTH VISIT OPTIONS</Label>
                    <Select>
                      <SelectTrigger id="telehealthVisitOptions" className="h-10 text-base bg-white">
                        <SelectValue placeholder="Audio/Video" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audiovideo">Audio/Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="telehealthPersonLocation" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">PERSON LOCATION</Label>
                    <Select>
                      <SelectTrigger id="telehealthPersonLocation" className="h-10 text-base bg-white">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Group Notes and Plan */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="groupNotes" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Group Notes:</Label>
          <Textarea id="groupNotes" className="text-sm" rows={2} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="groupPlan" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan:</Label>
          <Textarea id="groupPlan" className="text-sm" rows={2} />
        </div>
      </div>
      {/* Prominent Add Patients Section (button always visible) */}
      <Card className="mt-6 border-blue-400 bg-blue-50">
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
          <span className="text-base font-bold text-blue-900 flex-1">Would you like to add Patients to this Appointment?</span>
          <Button type="button" variant="default" className="text-white font-semibold px-6 py-2 rounded shadow" onClick={() => setAddPatientsModalOpen(true)}>
            Add Patients
          </Button>
        </CardContent>
      </Card>
      {/* AddPatientsModal rendered here */}
      {addPatientsModalOpen && (
        <AddPatientsModal
          open={addPatientsModalOpen}
          onOpenChange={setAddPatientsModalOpen}
          patientOptions={patientOptions}
          selectedPatients={selectedPatients}
          setSelectedPatients={setSelectedPatients}
          groupCapacity={groupCapacity}
          patientFilter={patientFilter}
          setPatientFilter={setPatientFilter}
          capacityError={capacityError}
          setCapacityError={setCapacityError}
          showWaitlist={showWaitlist}
          setShowWaitlist={setShowWaitlist}
          waitlistPatients={waitlistPatients}
          onAddToEvent={handleAddToEvent}
        />
      )}
      
      {/* Room Allocation Modal */}
      <RoomAllocationModal
        open={showRoomAllocationModal}
        onClose={() => setShowRoomAllocationModal(false)}
        onRoomSelected={handleRoomSelected}
        selectedDate={new Date().toLocaleDateString()}
        selectedTime="10:00 AM"
      />
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressSelectionModal}
        onClose={() => setShowAddressSelectionModal(false)}
        onAddressSelected={handleAddressSelected}
        selectedAddress={selectedAddress}
      />
      {/* Show groupEventPatients in AG Grid table below Add Patients section */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Patients Added to Event</h3>
        {groupEventPatients.length === 0 ? (
          <div className="text-xs text-gray-400">No patients have been added to this event yet.</div>
        ) : (
          <DataTable
            rowData={patientOptions.filter(p => groupEventPatients.includes(p.value)).map(p => {
              const [phone, ss, dob, extId] = (p.description || '').split(' | ');
              return {
                id: p.value,
                name: p.label,
                phone,
                ss,
                dob,
                pid: p.value,
                externalId: extId
              };
            })}
            columnDefs={columnDefs}
            className="w-full"
            gridOptions={{
              domLayout: 'autoHeight',
              pagination: false,
              overlayNoRowsTemplate: '<span>No patients found.</span>',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroupAppointmentForm; 