import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../atoms/Dialog/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/Select/select';
import { Combobox, ComboboxOption } from '../../atoms/Combobox/Combobox';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { DataTable } from '../../organisms/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../atoms/Tabs/tabs';
import { ColDef } from 'ag-grid-community';
import { UserGroupIcon, TrashIcon, ClockIcon, UserPlusIcon, CalendarIcon, FunnelIcon, ChevronDownIcon, CheckIcon, DocumentTextIcon, PrinterIcon, ArrowDownTrayIcon, EllipsisVerticalIcon, XMarkIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import ColumnCustomizer, { ColumnConfig } from '@/components/molecules/ColumnCustomizer';

// Props for AddPatientsModal
interface AddPatientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientOptions: ComboboxOption[];
  selectedPatients: string[];
  setSelectedPatients: (ids: string[]) => void;
  groupCapacity: number;
  patientFilter: string;
  setPatientFilter: (filter: string) => void;
  capacityError: boolean;
  setCapacityError: (err: boolean) => void;
  waitlistPatients: any[];
  onAddToEvent: () => void;
  onAddWaitlistPatientToEvent: (patientId: string) => void;
}

/**
 * AddPatientsModal - atomic molecule for adding patients to a group appointment.
 * Handles patient search, selection, filtering, and waitlist overlay.
 */
const AddPatientsModal: React.FC<AddPatientsModalProps> = ({
  open,
  onOpenChange,
  patientOptions,
  selectedPatients,
  setSelectedPatients,
  groupCapacity,
  patientFilter,
  setPatientFilter,
  capacityError,
  setCapacityError,
  waitlistPatients,
  onAddToEvent,
  onAddWaitlistPatientToEvent,
}) => {
  // Tab state management
  const [activeTab, setActiveTab] = React.useState('add-patients');

  // Filters expand/collapse state - collapsed by default
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  // Notes sidebar state
  const [notesSidebarOpen, setNotesSidebarOpen] = React.useState(false);
  const [selectedPatientForNotes, setSelectedPatientForNotes] = React.useState<any>(null);
  const [newNoteText, setNewNoteText] = React.useState('');
  const [newNoteDate, setNewNoteDate] = React.useState(new Date().toISOString().split('T')[0]);

  // Session selection sidebar state
  const [sessionSidebarOpen, setSessionSidebarOpen] = React.useState(false);
  const [selectedPatientForSessions, setSelectedPatientForSessions] = React.useState<any>(null);
  const [selectedSessions, setSelectedSessions] = React.useState<string[]>([]);
  const [showProgramDropdown, setShowProgramDropdown] = React.useState(false);
  const [sessionProgramFilter, setSessionProgramFilter] = React.useState<string[]>([]);

  // Toast notification state
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error' | 'info'>('success');

  // Enhanced patient data state (to allow updates)
  const [patientData, setPatientData] = React.useState(() => [
    {
      id: 'PID001',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      ssn: '***-**-1234',
      dob: '1985-03-15',
      pid: 'PID001',
      externalId: 'EXT001',
      program: 'Vision care',
      type: 'Group',
      status: 'Active',
      provider: 'Dr. Sarah Smith',
      waitlistDate: '2024-08-15',
      priority: 'High',
      reason: 'Transportation issues',
      eventName: 'Vision Care Group Session',
      eventDate: '2024-08-20',
      lastNoteDate: '2024-08-15',
      socialDeterminants: 'Transportation',
      statusChangeDate: '2024-08-15'
    },
    {
      id: 'PID002',
      name: 'Michael Chen',
      phone: '(555) 234-5678',
      ssn: '***-**-2345',
      dob: '1978-11-22',
      pid: 'PID002',
      externalId: 'EXT002',
      program: 'Physical Therapy',
      type: 'Individual',
      status: 'Successfully Placed',
      provider: 'Dr. John Wilson',
      waitlistDate: '2024-08-10',
      priority: 'Medium',
      reason: 'Capacity reached',
      eventName: 'Physical Therapy Session',
      eventDate: '2024-08-18',
      lastNoteDate: '2024-08-12',
      socialDeterminants: 'None',
      statusChangeDate: '2024-08-16'
    },
    {
      id: 'PID003',
      name: 'Emily Rodriguez',
      phone: '(555) 345-6789',
      ssn: '***-**-3456',
      dob: '1992-07-08',
      pid: 'PID003',
      externalId: 'EXT003',
      program: 'Group Therapy',
      type: 'Group',
      status: 'Active',
      provider: 'Nurse Johnson',
      waitlistDate: '2024-08-12',
      priority: 'Standard',
      reason: 'Scheduling conflict',
      eventName: 'Group Therapy Session',
      eventDate: '2024-08-22',
      lastNoteDate: '2024-08-14',
      socialDeterminants: 'Food Security',
      statusChangeDate: '2024-08-12'
    },
    {
      id: 'PID004',
      name: 'David Thompson',
      phone: '(555) 456-7890',
      ssn: '***-**-4567',
      dob: '1965-12-03',
      pid: 'PID004',
      externalId: 'EXT004',
      program: 'Occupational Therapy',
      type: 'Individual',
      status: 'Ineligible',
      provider: 'Dr. Maria Garcia',
      waitlistDate: '2024-08-08',
      priority: 'Low',
      reason: 'Insurance requirements not met',
      eventName: 'Occupational Therapy',
      eventDate: '2024-08-25',
      lastNoteDate: '2024-08-10',
      socialDeterminants: 'Housing',
      statusChangeDate: '2024-08-14'
    },
    {
      id: 'PID005',
      name: 'Lisa Anderson',
      phone: '(555) 567-8901',
      ssn: '***-**-5678',
      dob: '1980-04-17',
      pid: 'PID005',
      externalId: 'EXT005',
      program: 'Speech Therapy',
      type: 'Individual',
      status: 'Removed at Client Request',
      provider: 'Dr. Robert Kim',
      waitlistDate: '2024-08-05',
      priority: 'Medium',
      reason: 'Found alternative provider',
      eventName: 'Speech Therapy Session',
      eventDate: '2024-08-28',
      lastNoteDate: '2024-08-08',
      socialDeterminants: 'Transportation',
      statusChangeDate: '2024-08-13'
    },
    {
      id: 'PID006',
      name: 'Robert Martinez',
      phone: '(555) 678-9012',
      ssn: '***-**-6789',
      dob: '1973-09-25',
      pid: 'PID006',
      externalId: 'EXT006',
      program: 'Vision care',
      type: 'Group',
      status: 'Active',
      provider: 'Dr. Sarah Smith',
      waitlistDate: '2024-08-14',
      priority: 'High',
      reason: 'Urgent care needed',
      eventName: 'Vision Care Group Session',
      eventDate: '2024-08-21',
      lastNoteDate: '2024-08-16',
      socialDeterminants: 'Housing',
      statusChangeDate: '2024-08-14'
    },
    {
      id: 'PID007',
      name: 'Jennifer Wilson',
      phone: '(555) 789-0123',
      ssn: '***-**-7890',
      dob: '1988-01-12',
      pid: 'PID007',
      externalId: 'EXT007',
      program: 'Physical Therapy',
      type: 'Individual',
      status: 'Removed - Already Taken Care',
      provider: 'Dr. John Wilson',
      waitlistDate: '2024-08-06',
      priority: 'Standard',
      reason: 'Received care elsewhere',
      eventName: 'Physical Therapy Session',
      eventDate: '2024-08-30',
      lastNoteDate: '2024-08-09',
      socialDeterminants: 'Employment',
      statusChangeDate: '2024-08-11'
    },
    {
      id: 'PID008',
      name: 'Christopher Lee',
      phone: '(555) 890-1234',
      ssn: '***-**-8901',
      dob: '1995-06-30',
      pid: 'PID008',
      externalId: 'EXT008',
      program: 'Group Therapy',
      type: 'Group',
      status: 'Removed - Ineligible',
      provider: 'Nurse Johnson',
      waitlistDate: '2024-08-07',
      priority: 'Low',
      reason: 'Does not meet program criteria',
      eventName: 'Group Therapy Session',
      eventDate: '2024-08-26',
      lastNoteDate: '2024-08-11',
      socialDeterminants: 'Education',
      statusChangeDate: '2024-08-15'
    }
  ]);

  // Waitlist column customization state
  const [waitlistColumnConfigs, setWaitlistColumnConfigs] = React.useState<ColumnConfig[]>([
    { id: 'actions', label: 'Actions', visible: true, category: 'basic', required: true },
    { id: 'person', label: 'Person', visible: true, category: 'basic', required: true },
    { id: 'status', label: 'Status', visible: true, category: 'basic' },
    { id: 'program', label: 'Program', visible: true, category: 'basic' },
    { id: 'addedToWaitlistOn', label: 'Added to Waitlist On', visible: true, category: 'dates' },
    { id: 'provider', label: 'Provider', visible: true, category: 'basic' },
    { id: 'eventName', label: 'Event Name', visible: true, category: 'basic' },
    { id: 'eventDate', label: 'Event Date', visible: true, category: 'dates' },
    { id: 'lastNoteDate', label: 'Last Note Date', visible: false, category: 'dates' },
    { id: 'socialDeterminants', label: 'Social Determinants', visible: false, category: 'additional' },
    { id: 'statusChangeDate', label: 'Status Change Date', visible: false, category: 'dates' }
  ]);

  // Waitlist filter states - empty by default to show all patients
  const [waitlistFilters, setWaitlistFilters] = React.useState({
    program: '',
    type: '',
    waitListFrom: '',
    waitListTo: '',
    person: '',
    status: '',
    socialDeterminants: '',
    appointmentProvider: '',
    eventName: '',
    includeInactiveClients: false
  });

  // Pre-populate selectedPatients with first 4 patients when modal opens and selection is empty
  React.useEffect(() => {
    if (open && selectedPatients.length === 0 && patientOptions.length > 0) {
      const defaultIds = patientOptions.slice(0, 4).map(p => p.value);
      setSelectedPatients(defaultIds);
    }
  }, [open, selectedPatients.length, patientOptions, setSelectedPatients]);

  // Memoize selected patient row data for DataTable
  const selectedPatientRowData = React.useMemo(() => patientOptions
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

  // Handler to remove a patient from the selected list
  const handleRemovePatient = React.useCallback((id: string) => {
    setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    setCapacityError(false);
  }, [selectedPatients, setSelectedPatients, setCapacityError]);

  // AG Grid column definitions (Actions column: reduced width, trash icon)
  const columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', minWidth: 150 },
    { headerName: 'Phone', field: 'phone', minWidth: 120 },
    { headerName: 'SS', field: 'ss', minWidth: 120 },
    { headerName: 'DOB', field: 'dob', minWidth: 120 },
    { headerName: 'PID', field: 'pid', minWidth: 100 },
    { headerName: 'External ID', field: 'externalId', minWidth: 100 },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 40, // Reduced width for icon-only
      maxWidth: 40,
      cellRenderer: (params: any) => {
        // Render a delete (trash) button for each row
        return (
          <button
            type="button"
            className="text-gray-400 hover:text-red-600 focus:outline-none"
            title="Remove patient"
            onClick={() => handleRemovePatient(params.data.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        );
      },
      suppressMenu: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  // Handler for Combobox selection
  const handleSelectedPatients = React.useCallback((newSelected: string[]) => {
    if (newSelected.length > groupCapacity) {
      setCapacityError(true);
      return;
    }
    setCapacityError(false);
    setSelectedPatients(newSelected);
  }, [groupCapacity, setCapacityError, setSelectedPatients]);

  // Handle waitlist filter changes
  const handleWaitlistFilterChange = React.useCallback((field: string, value: any) => {
    setWaitlistFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Clear waitlist filters
  const clearWaitlistFilters = React.useCallback(() => {
    setWaitlistFilters({
      program: '',
      type: '',
      waitListFrom: '',
      waitListTo: '',
      person: '',
      status: '',
      socialDeterminants: '',
      appointmentProvider: '',
      eventName: '',
      includeInactiveClients: false
    });
  }, []);

  // Memoized filtered waitlist data for DataTable
  const waitlistRowData = React.useMemo(() => {
    // Enhanced patient data with proper names and diverse statuses
    const enhancedPatients = [
      {
        id: 'p1',
        name: 'Sarah Johnson',
        phone: '(555) 123-4567',
        ss: '***-**-1234',
        dob: '1985-03-15',
        pid: 'PID001',
        externalId: 'EXT001',
        status: 'Active',
        program: 'Vision care',
        type: 'Group',
        provider: 'Dr. Sarah Smith',
        waitlistDate: '2024-08-10',
        priority: 'High',
        reason: 'Group capacity reached',
        eventName: 'Vision Care Group Session',
        eventDate: '2024-08-25',
        lastNoteDate: '2024-08-12',
        socialDeterminants: 'Transportation',
        statusChangeDate: '2024-08-10'
      },
      {
        id: 'p2',
        name: 'Michael Chen',
        phone: '(555) 234-5678',
        ss: '***-**-2345',
        dob: '1978-11-22',
        pid: 'PID002',
        externalId: 'EXT002',
        status: 'Successfully Placed',
        program: 'Physical Therapy',
        type: 'Individual',
        provider: 'Dr. John Wilson',
        waitlistDate: '2024-08-05',
        priority: 'Medium',
        reason: 'Placement found',
        eventName: 'Physical Therapy Session',
        eventDate: '2024-08-22',
        lastNoteDate: '2024-08-15',
        socialDeterminants: 'Housing',
        statusChangeDate: '2024-08-16'
      },
      {
        id: 'p3',
        name: 'Emily Rodriguez',
        phone: '(555) 345-6789',
        ss: '***-**-3456',
        dob: '1992-07-08',
        pid: 'PID003',
        externalId: 'EXT003',
        status: 'Active',
        program: 'Group Therapy',
        type: 'Group',
        provider: 'Nurse Johnson',
        waitlistDate: '2024-08-12',
        priority: 'Standard',
        reason: 'Waiting for group formation',
        eventName: 'Group Therapy Session',
        eventDate: '2024-08-28',
        lastNoteDate: '2024-08-14',
        socialDeterminants: 'Food Security',
        statusChangeDate: '2024-08-12'
      },
      {
        id: 'p4',
        name: 'David Thompson',
        phone: '(555) 456-7890',
        ss: '***-**-4567',
        dob: '1965-12-03',
        pid: 'PID004',
        externalId: 'EXT004',
        status: 'Ineligible',
        program: 'Occupational Therapy',
        type: 'Individual',
        provider: 'Care Coordinator',
        waitlistDate: '2024-08-08',
        priority: 'Low',
        reason: 'Insurance requirements not met',
        eventName: 'Occupational Therapy',
        eventDate: '2024-08-30',
        lastNoteDate: '2024-08-13',
        socialDeterminants: 'Employment',
        statusChangeDate: '2024-08-14'
      },
      {
        id: 'p5',
        name: 'Lisa Anderson',
        phone: '(555) 567-8901',
        ss: '***-**-5678',
        dob: '1980-04-17',
        pid: 'PID005',
        externalId: 'EXT005',
        status: 'Removed at Client Request',
        program: 'Speech Therapy',
        type: 'Individual',
        provider: 'Dr. Sarah Smith',
        waitlistDate: '2024-08-06',
        priority: 'Medium',
        reason: 'Client found alternative provider',
        eventName: 'Speech Therapy Session',
        eventDate: '2024-08-26',
        lastNoteDate: '2024-08-11',
        socialDeterminants: 'Transportation',
        statusChangeDate: '2024-08-13'
      },
      {
        id: 'p6',
        name: 'Robert Martinez',
        phone: '(555) 678-9012',
        ss: '***-**-6789',
        dob: '1973-09-25',
        pid: 'PID006',
        externalId: 'EXT006',
        status: 'Active',
        program: 'Vision care',
        type: 'Group',
        provider: 'Admin, Ensoftek',
        waitlistDate: '2024-08-14',
        priority: 'High',
        reason: 'Urgent care needed',
        eventName: 'Vision Care Assessment',
        eventDate: '2024-08-24',
        lastNoteDate: '2024-08-16',
        socialDeterminants: 'Housing',
        statusChangeDate: '2024-08-14'
      },
      {
        id: 'p7',
        name: 'Jennifer Wilson',
        phone: '(555) 789-0123',
        ss: '***-**-7890',
        dob: '1988-01-12',
        pid: 'PID007',
        externalId: 'EXT007',
        status: 'Removed - Already Taken Care',
        program: 'Physical Therapy',
        type: 'Group',
        provider: 'Dr. John Wilson',
        waitlistDate: '2024-08-07',
        priority: 'Standard',
        reason: 'Patient received care elsewhere',
        eventName: 'Physical Therapy Group',
        eventDate: '2024-08-27',
        lastNoteDate: '2024-08-15',
        socialDeterminants: 'Education',
        statusChangeDate: '2024-08-15'
      },
      {
        id: 'p8',
        name: 'Christopher Lee',
        phone: '(555) 890-1234',
        ss: '***-**-8901',
        dob: '1995-06-30',
        pid: 'PID008',
        externalId: 'EXT008',
        status: 'Removed - Ineligible',
        program: 'Group Therapy',
        type: 'Group',
        provider: 'Nurse Johnson',
        waitlistDate: '2024-08-09',
        priority: 'Low',
        reason: 'Does not meet program criteria',
        eventName: 'Group Therapy Session',
        eventDate: '2024-08-29',
        lastNoteDate: '2024-08-12',
        socialDeterminants: 'Employment',
        statusChangeDate: '2024-08-14'
      }
    ];
    
    // Use patient data state (allows for updates) - show all patients including Successfully Placed
    let filtered = patientData;

    // Apply filters
    if (waitlistFilters.program) {
      filtered = filtered.filter(p => p.program.toLowerCase().includes(waitlistFilters.program.toLowerCase()));
    }
    if (waitlistFilters.type) {
      filtered = filtered.filter(p => p.type.toLowerCase().includes(waitlistFilters.type.toLowerCase()));
    }
    if (waitlistFilters.person) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(waitlistFilters.person.toLowerCase()));
    }
    if (waitlistFilters.status) {
      filtered = filtered.filter(p => p.status.toLowerCase().includes(waitlistFilters.status.toLowerCase()));
    }
    if (waitlistFilters.appointmentProvider) {
      filtered = filtered.filter(p => p.provider.toLowerCase().includes(waitlistFilters.appointmentProvider.toLowerCase()));
    }

    // Filter out Successfully Placed patients from waitlist (they should only appear in Add Patients tab)
    filtered = filtered.filter(p => p.status !== 'Successfully Placed');
    
    return filtered;
  }, [patientData, waitlistFilters]);

  // Handler to add patient from waitlist to event
  const handleAddFromWaitlist = React.useCallback((patientId: string) => {
    if (selectedPatients.length >= groupCapacity) {
      setCapacityError(true);
      return;
    }
    onAddWaitlistPatientToEvent(patientId);
    setCapacityError(false);
  }, [selectedPatients.length, groupCapacity, onAddWaitlistPatientToEvent, setCapacityError]);

  // Handler for patient actions
  const handlePatientAction = React.useCallback((patientId: string, action: string, reason?: string) => {
    switch(action) {
      case 'approve-add-to-sessions':
        console.log('Adding patient to current sessions:', patientId);
        // Find the patient to add
        const patientToAdd = patientData.find(p => p.id === patientId);
        if (patientToAdd) {
          // Remove from waitlist by updating status
          setPatientData(prevData => 
            prevData.map(patient => 
              patient.id === patientId 
                ? { 
                    ...patient, 
                    status: 'Successfully Placed',
                    statusChangeDate: new Date().toISOString().split('T')[0]
                  }
                : patient
            )
          );
          
          // Add to selected patients list (for the Add Patients tab)
          if (!selectedPatients.includes(patientId)) {
            setSelectedPatients([...selectedPatients, patientId]);
          }
          
          // Also call the callback to add to event
          onAddWaitlistPatientToEvent(patientId);
          
          // Show success toast
          setToastMessage(`${patientToAdd.name} has been added to the current sessions!`);
          setToastType('success');
          setShowToast(true);
          
          // Auto-hide toast after 4 seconds
          setTimeout(() => setShowToast(false), 4000);
        }
        break;
      case 'approve-add-to-other':
        console.log('Opening session selection for patient:', patientId);
        // Find the patient data and open session selection sidebar
        const patientForSessions = patientData.find(p => p.id === patientId);
        if (patientForSessions) {
          setSelectedPatientForSessions(patientForSessions);
          setSessionSidebarOpen(true);
          setSelectedSessions([]);
          setSessionProgramFilter([]);
        }
        break;
      case 'mark-ineligible':
        console.log('Marking patient as ineligible:', patientId);
        // TODO: Implement ineligible functionality - change status to "Ineligible"
        break;
      case 'remove-client-request':
        console.log('Removing patient - client request:', patientId);
        // TODO: Implement removal - change status to "Removed at Client Request"
        break;
      case 'remove-already-taken':
        console.log('Removing patient - already taken care:', patientId);
        // TODO: Implement removal - change status to "Removed - Already Taken Care"
        break;
      case 'remove-ineligible':
        console.log('Removing patient - ineligible:', patientId);
        // TODO: Implement removal - change status to "Removed - Ineligible"
        break;
      case 'notes':
        console.log('Notes clicked for patient ID:', patientId);
        console.log('Available waitlist data:', waitlistRowData);
        // Find the patient data and open notes sidebar
        const patient = patientData.find(p => p.id === patientId);
        console.log('Found patient:', patient);
        if (patient) {
          console.log('Opening notes sidebar for:', patient.name);
          setSelectedPatientForNotes(patient);
          setNotesSidebarOpen(true);
          setNewNoteText('');
          setNewNoteDate(new Date().toISOString().split('T')[0]);
        } else {
          console.error('Patient not found in waitlist data');
        }
        break;
      default:
        console.log('Unknown action:', action, 'for patient:', patientId);
    }
  }, []);

  // Handler for printing waitlist
  const handlePrintWaitlist = React.useCallback(() => {
    // Get visible columns based on configuration
    const visibleColumns = waitlistColumnConfigs.filter(col => col.visible);
    
    // Create printable content
    const printContent = `
      <html>
        <head>
          <title>Waitlist Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; }
            .header-info { margin-bottom: 20px; }
            .print-date { color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Waitlist Report</h1>
          <div class="header-info">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Patients:</strong> ${waitlistRowData.length}</p>
            <p><strong>Group Capacity:</strong> ${groupCapacity}</p>
            <p><strong>Current Patients:</strong> ${selectedPatients.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${visibleColumns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${waitlistRowData.map(patient => `
                <tr>
                  ${visibleColumns.map(col => {
                    let value = '';
                    switch(col.id) {
                      case 'actions': value = 'Actions Available'; break;
                      case 'program': value = patient.program || 'N/A'; break;
                      case 'person': value = patient.name || 'N/A'; break;
                      case 'addedToWaitlistOn': value = patient.waitlistDate || 'N/A'; break;
                      case 'provider': value = patient.provider || 'N/A'; break;
                      case 'eventName': value = patient.eventName || 'N/A'; break;
                      case 'eventDate': value = patient.eventDate || 'N/A'; break;
                      case 'lastNoteDate': value = patient.lastNoteDate || 'N/A'; break;
                      case 'socialDeterminants': value = patient.socialDeterminants || 'N/A'; break;
                      case 'status': value = patient.status || 'Active'; break;
                      case 'statusChangeDate': value = patient.statusChangeDate || 'N/A'; break;
                      default: value = 'N/A';
                    }
                    return `<td>${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }, [waitlistRowData, waitlistColumnConfigs, groupCapacity, selectedPatients.length]);

  // Handler for exporting to CSV
  const handleExportCSV = React.useCallback(() => {
    // Get visible columns based on configuration
    const visibleColumns = waitlistColumnConfigs.filter(col => col.visible);
    
    // Create CSV headers
    const headers = visibleColumns.map(col => col.label).join(',');
    
    // Create CSV rows
    const rows = waitlistRowData.map(patient => {
      return visibleColumns.map(col => {
        let value = '';
        switch(col.id) {
          case 'actions': value = 'Actions Available'; break;
          case 'program': value = patient.program || ''; break;
          case 'person': value = patient.name || ''; break;
          case 'addedToWaitlistOn': value = patient.waitlistDate || ''; break;
          case 'provider': value = patient.provider || ''; break;
          case 'eventName': value = patient.eventName || ''; break;
          case 'eventDate': value = patient.eventDate || ''; break;
          case 'lastNoteDate': value = patient.lastNoteDate || ''; break;
          case 'socialDeterminants': value = patient.socialDeterminants || ''; break;
          case 'status': value = patient.status || 'Active'; break;
          case 'statusChangeDate': value = patient.statusChangeDate || ''; break;
          default: value = '';
        }
        // Escape commas and quotes in CSV
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [waitlistRowData, waitlistColumnConfigs]);

  // Handler for adding a new note
  const handleAddNote = React.useCallback(() => {
    if (!newNoteText.trim() || !selectedPatientForNotes) return;
    
    // TODO: Implement actual note saving to backend
    console.log('Adding note for patient:', selectedPatientForNotes.id, {
      text: newNoteText,
      date: newNoteDate,
      timestamp: new Date().toISOString()
    });
    
    // Clear form and close sidebar
    setNewNoteText('');
    setNewNoteDate(new Date().toISOString().split('T')[0]);
    setNotesSidebarOpen(false);
    setSelectedPatientForNotes(null);
  }, [newNoteText, newNoteDate, selectedPatientForNotes]);

  // Handler for closing notes sidebar
  const handleCloseNotes = React.useCallback(() => {
    setNotesSidebarOpen(false);
    setSelectedPatientForNotes(null);
    setNewNoteText('');
    setNewNoteDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Handler for closing session selection sidebar
  const handleCloseSessions = React.useCallback(() => {
    setSessionSidebarOpen(false);
    setSelectedPatientForSessions(null);
    setSelectedSessions([]);
    setSessionProgramFilter([]);
  }, []);

  // Handler for adding patient to selected sessions
  const handleAddToSelectedSessions = React.useCallback(() => {
    if (!selectedPatientForSessions || selectedSessions.length === 0) return;
    
    // Update patient status to "Successfully Placed"
    setPatientData(prevData => 
      prevData.map(patient => 
        patient.id === selectedPatientForSessions.id 
          ? { 
              ...patient, 
              status: 'Successfully Placed',
              statusChangeDate: new Date().toISOString().split('T')[0]
            }
          : patient
      )
    );
    
    // TODO: Implement actual session assignment to backend
    console.log('Adding patient to sessions:', selectedPatientForSessions.id, selectedSessions);
    
    // Show success toast
    setToastMessage(`${selectedPatientForSessions.name} has been added to ${selectedSessions.length} session(s)!`);
    setToastType('success');
    setShowToast(true);
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => setShowToast(false), 4000);
    
    // Close sidebar
    handleCloseSessions();
  }, [selectedPatientForSessions, selectedSessions]);

  // Mock session data based on the provided table
  const availableSessions = React.useMemo(() => [
    {
      id: 'session-1',
      name: 'AB',
      fromDate: '08/06/2025',
      toDate: '09/30/2025',
      time: '6:00 AM - 6:45 AM (45 Min)',
      provider: 'Admin, Ensoftek',
      recurringDetails: 'Every workday until 09/30/2025',
      program: 'Vision care'
    },
    {
      id: 'session-2',
      name: 'Agent Info',
      fromDate: '01/24/2025',
      toDate: '10/31/2025',
      time: '12:20 PM - 1:05 PM (45 Min)',
      provider: 'Admin, Ensoftek',
      recurringDetails: 'Every day until 10/31/2025',
      program: 'A - AADO'
    },
    {
      id: 'session-3',
      name: 'Anger Expression',
      fromDate: '03/13/2024',
      toDate: '03/31/2029',
      time: '2:40 PM - 3:10 PM (30 Min)',
      provider: 'Doctor Super',
      recurringDetails: 'Every Mon,Tue,Wed,Thu,Fri,Sat,Sun until 03/31/2029',
      program: 'Behavioral Health'
    }
  ], []);

  // Filter sessions based on program filter
  const filteredSessions = React.useMemo(() => {
    if (sessionProgramFilter.length === 0) {
      return availableSessions;
    }
    return availableSessions.filter(session => 
      sessionProgramFilter.includes(session.program)
    );
  }, [availableSessions, sessionProgramFilter]);

  // Get unique programs for filter dropdown
  const availablePrograms = React.useMemo(() => {
    const programs = [...new Set(availableSessions.map(session => session.program))];
    return programs.sort();
  }, [availableSessions]);

  // Waitlist column definitions
  const waitlistColumnDefs: ColDef[] = [
    { 
      headerName: 'Person', 
      field: 'name', 
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full" title="On waitlist"></div>
          <span className="font-medium">{params.value}</span>
        </div>
      )
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      minWidth: 180,
      cellRenderer: (params: any) => {
        const status = params.value;
        let colorClass = '';
        let bgClass = '';
        
        // Define status colors for clean labels
        switch(status) {
          case 'Active':
            colorClass = 'text-green-800';
            bgClass = 'bg-green-100';
            break;
          case 'Successfully Placed':
            colorClass = 'text-blue-800';
            bgClass = 'bg-blue-100';
            break;
          case 'Ineligible':
            colorClass = 'text-red-800';
            bgClass = 'bg-red-100';
            break;
          case 'Removed at Client Request':
            colorClass = 'text-orange-800';
            bgClass = 'bg-orange-100';
            break;
          case 'Removed - Ineligible':
            colorClass = 'text-red-800';
            bgClass = 'bg-red-100';
            break;
          case 'Removed - Already Taken Care':
            colorClass = 'text-gray-800';
            bgClass = 'bg-gray-100';
            break;
          default:
            colorClass = 'text-gray-800';
            bgClass = 'bg-gray-100';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}>
            {status}
          </span>
        );
      }
    },
    { headerName: 'Phone', field: 'phone', minWidth: 120 },
    { headerName: 'SS', field: 'ss', minWidth: 100 },
    { headerName: 'DOB', field: 'dob', minWidth: 110 },
    { headerName: 'PID', field: 'pid', minWidth: 90 },
    { headerName: 'External ID', field: 'externalId', minWidth: 100 },
    { 
      headerName: 'Waitlist Date', 
      field: 'waitlistDate', 
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span className="text-sm text-gray-600">{params.value}</span>
      )
    },
    { 
      headerName: 'Priority', 
      field: 'priority', 
      minWidth: 100,
      cellRenderer: (params: any) => {
        const priority = params.value;
        const colorClass = priority === 'High' ? 'bg-red-100 text-red-800' :
                          priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {priority}
          </span>
        );
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 180,
      maxWidth: 180,
      cellStyle: { textAlign: 'right' },
      headerClass: 'text-right',
      cellRenderer: (params: any) => {
        const patientId = params.data.id;
        const currentStatus = params.data.status;
        
        return (
          <div className="flex items-center gap-1 justify-end">
            {/* Primary Action - Approve Dropdown (only if Active) */}
            {currentStatus === 'Active' && (
              <Select onValueChange={(value) => handlePatientAction(patientId, value)}>
                <SelectTrigger className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200 w-auto min-w-[90px] [&>svg]:hidden">
                  <div className="flex items-center gap-1">
                    <span>Approve</span>
                    <ChevronDownIcon className="w-3 h-3" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve-add-to-sessions">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3 h-3 text-green-600" />
                      <span>Add to the following sessions</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="approve-add-to-other">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3 text-blue-600" />
                      <span>Add to other sessions</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {/* Notes Button - Always available */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePatientAction(patientId, 'notes')}
              className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              title="View/Edit notes"
            >
              <DocumentTextIcon className="w-3 h-3" />
            </Button>
            
            {/* Actions Dropdown - Only for Active patients */}
            {currentStatus === 'Active' && (
              <Select onValueChange={(value) => handlePatientAction(patientId, value)}>
                <SelectTrigger className="h-7 w-8 px-1 bg-gray-50 hover:bg-gray-100 border-gray-200">
                  <EllipsisVerticalIcon className="w-3 h-3 text-gray-600" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mark-ineligible">
                    <div className="flex items-center gap-2">
                      <XMarkIcon className="w-3 h-3 text-red-600" />
                      <span>Mark Ineligible</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="remove-client-request">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-3 h-3 text-orange-600" />
                      <span>Remove - Client Request</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="remove-already-taken">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-3 h-3 text-gray-600" />
                      <span>Remove - Already Taken Care</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="remove-ineligible">
                    <div className="flex items-center gap-2">
                      <XMarkIcon className="w-3 h-3 text-red-600" />
                      <span>Remove - Ineligible</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        );
      },
      suppressMenu: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] max-h-[95vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 p-6">
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Add Patients to Appointment</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription className="sr-only">
          Manage patients for group appointment with search, selection, and waitlist functionality
        </DialogDescription>
        
        {/* Dialog Title - Outside white container */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Patients to Appointment
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Search and select patients to add to this group appointment, or manage the waitlist
              </p>
            </div>
          </div>
        </div>

        {/* Main container with white background */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg relative overflow-hidden">
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="px-6 pt-4 border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="add-patients" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Add Patients
                </TabsTrigger>
                <TabsTrigger 
                  value="waitlist" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600"
                >
                  <ClockIcon className="w-4 h-4" />
                  Waitlist ({waitlistPatients.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - Add Patients */}
            <TabsContent value="add-patients" className="p-6 space-y-4 mt-0 h-[calc(95vh-300px)] min-h-[600px] overflow-y-auto">
            {/* Filter Bar with Select and Combobox for typeahead */}
            <div className="flex flex-col sm:flex-row gap-2 items-center p-4 border-b border-gray-100">
              <div className="w-48 flex-shrink-0">
                <Select value={patientFilter} onValueChange={setPatientFilter}>
                  <SelectTrigger className="h-8 text-sm w-full">
                    <SelectValue placeholder="Filter Patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="not-admitted">Not-Admitted</SelectItem>
                    <SelectItem value="program">My Program</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full">
                <Combobox
                  options={patientOptions}
                  value={selectedPatients}
                  onChange={handleSelectedPatients}
                  placeholder="Search and select patients..."
                  multiple={true}
                  hideFilters={true}
                />
              </div>
            </div>
            {/* Capacity Info, Error, and Show Waitlist link */}
            <div className="mb-2 text-xs text-gray-600 px-4 pt-2 flex items-center justify-between">
              <div>
                Group Capacity: <span className="font-bold">{groupCapacity}</span> &nbsp;|&nbsp; Patients Added: <span className="font-bold">{selectedPatients.length}</span>
                {capacityError && (
                  <span className="ml-4 text-red-600 font-semibold">Group capacity reached. Cannot add more patients.</span>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-blue-600 underline font-semibold hover:text-blue-800 focus:outline-none"
                onClick={() => setActiveTab('waitlist')}
              >
                Show Waitlist ({waitlistPatients.length})
              </button>
            </div>

            {/* Patients Table or Empty State using DataTable */}
            <div className="mb-4 mx-4 bg-white flex-1" style={{ minHeight: 120 }}>
              {selectedPatientRowData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm font-semibold">
                  <UserGroupIcon className="w-14 h-14 mb-4 text-blue-200" />
                  <div>No patients added yet.<br />
                  <span className="font-normal text-gray-400">Use the search above to add patients.</span></div>
                </div>
              ) : (
                <DataTable
                  rowData={selectedPatientRowData}
                  columnDefs={columnDefs}
                  className="w-full"
                  gridOptions={{
                    domLayout: 'autoHeight',
                    getRowId: (data: any) => data.id,
                    pagination: false,
                    overlayNoRowsTemplate: '<span>No patients found.</span>',
                  }}
                />
              )}
            </div>
            </TabsContent>

            {/* Tab Content - Waitlist */}
            <TabsContent value="waitlist" className="p-6 space-y-4 mt-0 h-[calc(95vh-300px)] min-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-orange-500" />
                  Waitlist ({waitlistRowData.length})
                </h2>
              </div>

              {/* Waitlist Filters */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                {/* Filter Header - Always Visible */}
                <div className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setFiltersExpanded(!filtersExpanded)}>
                  {filtersExpanded ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 transform -rotate-90" />
                  )}
                  <FunnelIcon className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-700">Waitlist Filters</h3>
                  <span className="text-xs text-gray-500 ml-2">({Object.values(waitlistFilters).filter(v => v && v !== '').length} active)</span>
                  <div className="ml-auto">
                    {Object.values(waitlistFilters).filter(v => v && v !== '').length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          clearWaitlistFilters();
                        }}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Collapsible Filter Content */}
                {filtersExpanded && (
                  <div className="px-4 pt-4 pb-4 border-t border-gray-200 bg-white">
                
                {/* Filter Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Program:</label>
                    <Select value={waitlistFilters.program} onValueChange={(value) => handleWaitlistFilterChange('program', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vision care">Vision care</SelectItem>
                        <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                        <SelectItem value="Occupational Therapy">Occupational Therapy</SelectItem>
                        <SelectItem value="Speech Therapy">Speech Therapy</SelectItem>
                        <SelectItem value="Group Therapy">Group Therapy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type:</label>
                    <Select value={waitlistFilters.type} onValueChange={(value) => handleWaitlistFilterChange('type', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Wait List From:</label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        value={waitlistFilters.waitListFrom}
                        onChange={(e) => handleWaitlistFilterChange('waitListFrom', e.target.value)}
                        className="h-8 text-sm pr-8"
                      />
                      <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Wait List To:</label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        value={waitlistFilters.waitListTo}
                        onChange={(e) => handleWaitlistFilterChange('waitListTo', e.target.value)}
                        className="h-8 text-sm pr-8"
                      />
                      <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {/* Filter Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Person:</label>
                    <Input 
                      type="text" 
                      placeholder="Search by name"
                      value={waitlistFilters.person}
                      onChange={(e) => handleWaitlistFilterChange('person', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status:</label>
                    <Select value={waitlistFilters.status} onValueChange={(value) => handleWaitlistFilterChange('status', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Social Determinants:</label>
                    <Select value={waitlistFilters.socialDeterminants} onValueChange={(value) => handleWaitlistFilterChange('socialDeterminants', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select determinants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Food Security">Food Security</SelectItem>
                        <SelectItem value="Employment">Employment</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center text-xs text-gray-600">
                      <input 
                        type="checkbox" 
                        checked={waitlistFilters.includeInactiveClients}
                        onChange={(e) => handleWaitlistFilterChange('includeInactiveClients', e.target.checked)}
                        className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Include Inactive Clients
                    </label>
                  </div>
                </div>
                
                {/* Filter Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Appointment Provider:</label>
                    <Select value={waitlistFilters.appointmentProvider} onValueChange={(value) => handleWaitlistFilterChange('appointmentProvider', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin, Ensoftek">Admin, Ensoftek</SelectItem>
                        <SelectItem value="Dr. Sarah Smith">Dr. Sarah Smith</SelectItem>
                        <SelectItem value="Dr. John Wilson">Dr. John Wilson</SelectItem>
                        <SelectItem value="Nurse Johnson">Nurse Johnson</SelectItem>
                        <SelectItem value="Care Coordinator">Care Coordinator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Event Name:</label>
                    <Select value={waitlistFilters.eventName} onValueChange={(value) => handleWaitlistFilterChange('eventName', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="Group Therapy Session">Group Therapy Session</SelectItem>
                        <SelectItem value="Vision Care Appointment">Vision Care Appointment</SelectItem>
                        <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                        <SelectItem value="Occupational Therapy">Occupational Therapy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                  </div>
                )}
              </div>
              
              {/* Controls Bar - Status + Column Customizer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">
                      <strong>Group Capacity:</strong> {groupCapacity}
                    </span>
                    <span className="text-gray-700">
                      <strong>Current Patients:</strong> {selectedPatients.length}
                    </span>
                    <span className="text-gray-700">
                      <strong>Filtered Results:</strong> {waitlistRowData.length}
                    </span>
                  </div>
                  
                  {/* Export and Column Controls */}
                  <div className="flex items-center gap-2">
                    {/* Print Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrintWaitlist}
                      className="text-xs h-8 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      title="Print waitlist report"
                    >
                      <PrinterIcon className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    
                    {/* Export CSV Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="text-xs h-8 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      title="Export to CSV"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Export CSV
                    </Button>
                    
                    {/* Column Customizer */}
                    <ColumnCustomizer
                      columns={waitlistColumnConfigs}
                      onColumnsChange={setWaitlistColumnConfigs}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Waitlist Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100% - 100px)' }}>
                {waitlistPatients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                    <ClockIcon className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No Waitlist Patients</h3>
                    <p className="text-sm text-center max-w-md">
                      There are currently no patients on the waitlist for this appointment.
                      Patients will appear here when the group reaches capacity.
                    </p>
                  </div>
                ) : (
                  <div className="h-full">
                    <DataTable
                      rowData={waitlistRowData}
                      columnDefs={waitlistColumnDefs}
                      className="h-full"
                      gridOptions={{
                        domLayout: 'normal',
                        getRowId: (data: any) => data.data.id,
                        pagination: true,
                        paginationPageSize: 10,
                        overlayNoRowsTemplate: '<span>No waitlist patients found.</span>',
                        headerHeight: 40,
                        rowHeight: 50,
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {activeTab === 'add-patients' ? (
              <span>
                {selectedPatients.length} of {groupCapacity} patients selected
              </span>
            ) : (
              <span>
                {waitlistPatients.length} patient{waitlistPatients.length !== 1 ? 's' : ''} on waitlist
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {activeTab === 'add-patients' ? (
              <>
                <Button size="sm" variant="outline">Add to Wait List</Button>
                <Button size="sm" disabled={selectedPatients.length >= groupCapacity} onClick={onAddToEvent}>
                  Add to Event
                </Button>
              </>
            ) : (
              <Button 
                variant="default"
                disabled={selectedPatients.length >= groupCapacity}
                onClick={() => {
                  // Could implement bulk add functionality here
                  console.log('Bulk add functionality - TODO');
                }}
              >
                Add All Available
              </Button>
            )}
          </div>
        </div>

        {/* Success Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top duration-300">
            <div className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[320px] ${
              toastType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toastType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className={`p-1 rounded-full ${
                toastType === 'success' ? 'bg-green-100' :
                toastType === 'error' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {toastType === 'success' && <CheckIcon className="w-4 h-4 text-green-600" />}
                {toastType === 'error' && <XMarkIcon className="w-4 h-4 text-red-600" />}
                {toastType === 'info' && <DocumentTextIcon className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowToast(false)}
                className="h-6 w-6 p-0 border-0 hover:bg-transparent"
              >
                <XMarkIcon className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Session Selection Sidebar */}
        {sessionSidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/20 z-40"
              onClick={handleCloseSessions}
            />
            
            {/* Sidebar Panel */}
            <div className="absolute top-0 right-0 h-full w-[500px] bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Select Sessions</h3>
                      <p className="text-sm text-gray-600">{selectedPatientForSessions?.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCloseSessions}
                    className="h-8 w-8 p-0"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Current Program:</span>
                    <p className="font-medium text-gray-900">{selectedPatientForSessions?.program}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Priority:</span>
                    <p className="font-medium text-gray-900">{selectedPatientForSessions?.priority}</p>
                  </div>
                </div>
              </div>

              {/* Available Sessions Table */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Available Group Sessions</h4>
                    <div className="relative">
                      <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-md bg-white min-h-[32px] w-48 cursor-pointer" onClick={() => setShowProgramDropdown(!showProgramDropdown)}>
                        {sessionProgramFilter.length === 0 ? (
                          <span className="text-xs text-gray-500">All Programs</span>
                        ) : (
                          sessionProgramFilter.map((program) => (
                            <span key={program} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {program}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSessionProgramFilter(prev => prev.filter(p => p !== program));
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        )}
                        <ChevronDownIcon className="w-3 h-3 text-gray-400 ml-auto" />
                      </div>
                      {showProgramDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                setSessionProgramFilter([]);
                                setShowProgramDropdown(false);
                              }}
                              className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                            >
                              Clear All
                            </button>
                            {availablePrograms.map((program) => (
                              <button
                                key={program}
                                onClick={() => {
                                  setSessionProgramFilter(prev => 
                                    prev.includes(program)
                                      ? prev.filter(p => p !== program)
                                      : [...prev, program]
                                  );
                                }}
                                className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={sessionProgramFilter.includes(program)}
                                  onChange={() => {}}
                                  className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                />
                                {program}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Results count */}
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">
                      Showing {filteredSessions.length} of {availableSessions.length} sessions
                      {sessionProgramFilter.length > 0 && (
                        <>
                          {' '}for {sessionProgramFilter.length} program{sessionProgramFilter.length !== 1 ? 's' : ''}
                          <button 
                            onClick={() => setSessionProgramFilter([])}
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            Clear filter
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No sessions found for the selected program.</p>
                        {sessionProgramFilter.length > 0 && (
                          <button 
                            onClick={() => setSessionProgramFilter([])}
                            className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Show all sessions
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredSessions.map((session) => (
                      <div 
                        key={session.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSessions.includes(session.id)
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedSessions(prev => 
                            prev.includes(session.id)
                              ? prev.filter(id => id !== session.id)
                              : [...prev, session.id]
                          );
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={selectedSessions.includes(session.id)}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <h5 className="font-medium text-gray-900">{session.name}</h5>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {session.program}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Date Range:</span>
                                <p>{session.fromDate} - {session.toDate}</p>
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>
                                <p>{session.time}</p>
                              </div>
                              <div>
                                <span className="font-medium">Provider:</span>
                                <p>{session.provider}</p>
                              </div>
                              <div>
                                <span className="font-medium">Recurring:</span>
                                <p>{session.recurringDetails}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToSelectedSessions}
                    disabled={selectedSessions.length === 0}
                    className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Add to {selectedSessions.length} Session{selectedSessions.length !== 1 ? 's' : ''}
                  </Button>
                  <Button
                    onClick={handleCloseSessions}
                    variant="outline"
                    className="h-9 px-4 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes Sidebar */}
        {notesSidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/20 z-40"
              onClick={handleCloseNotes}
            />
            
            {/* Sidebar Panel */}
            <div className="absolute top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Patient Notes</h3>
                      <p className="text-sm text-gray-600">{selectedPatientForNotes?.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCloseNotes}
                    className="h-8 w-8 p-0"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedPatientForNotes?.status === 'Active' ? 'text-green-800 bg-green-100' :
                        selectedPatientForNotes?.status === 'Successfully Placed' ? 'text-blue-800 bg-blue-100' :
                        selectedPatientForNotes?.status === 'Ineligible' ? 'text-red-800 bg-red-100' :
                        selectedPatientForNotes?.status?.includes('Removed') ? 'text-gray-800 bg-gray-100' :
                        'text-gray-800 bg-gray-100'
                      }`}>
                        {selectedPatientForNotes?.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Program:</span>
                    <p className="font-medium text-gray-900">{selectedPatientForNotes?.program}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Provider:</span>
                    <p className="font-medium text-gray-900">{selectedPatientForNotes?.provider}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Waitlist Date:</span>
                    <p className="font-medium text-gray-900">{selectedPatientForNotes?.waitlistDate}</p>
                  </div>
                </div>
              </div>

              {/* Existing Notes Section */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Previous Notes</h4>
                  <div className="space-y-3">
                    {/* Mock existing notes - TODO: Replace with actual notes data */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">2024-08-15</span>
                        <span className="text-xs text-gray-500">Dr. Sarah Smith</span>
                      </div>
                      <p className="text-sm text-gray-800">Patient expressed interest in group therapy. Discussed transportation options and confirmed availability for Tuesday sessions.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">2024-08-12</span>
                        <span className="text-xs text-gray-500">Nurse Johnson</span>
                      </div>
                      <p className="text-sm text-gray-800">Initial assessment completed. Patient meets all program requirements and is ready for placement when capacity becomes available.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Note Section */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add New Note
                </h4>
                
                {/* Note Date */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date:</label>
                  <Input
                    type="date"
                    value={newNoteDate}
                    onChange={(e) => setNewNoteDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                
                {/* Note Text */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Note:</label>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNoteText.trim()}
                    className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" />
                    Add Note
                  </Button>
                  <Button
                    onClick={handleCloseNotes}
                    variant="outline"
                    className="h-8 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientsModal;