import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button/button';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge/badge';

/**
 * TransferDialog Component
 * 
 * A comprehensive dialog for transferring appointments between providers
 * Includes date filtering, provider selection, and multi-select transfer functionality
 */

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type?: 'Individual' | 'Group' | 'Provider';
  provider?: string;
  patient?: string;
  status?: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed';
  appointmentType?: string;
  location?: string;
  notes?: string;
}

interface Provider {
  id: string;
  value: string;
  label: string;
  status: 'active' | 'inactive';
  clientCount: number;
}

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  providers: Provider[];
  onTransfer: (eventIds: string[], fromProvider: string, toProvider: string) => void;
}

// Helper function to format date for display
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return format(date, 'MMM dd, yyyy');
  } catch {
    return '-';
  }
};

// Helper function to format time range
const formatTimeRange = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
  } catch {
    return '-';
  }
};

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    'Confirmed': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Checked In': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Completed': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

// Type badge component
const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case 'Individual':
        return <UserIcon className="w-3 h-3" />;
      case 'Group':
        return <UserGroupIcon className="w-3 h-3" />;
      default:
        return <ClockIcon className="w-3 h-3" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'Individual':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Group':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getColors()}`}>
      {getIcon()}
      {type}
    </span>
  );
};

export const TransferDialog: React.FC<TransferDialogProps> = ({
  isOpen,
  onClose,
  providers,
  onTransfer
}) => {
  // Form state
  const [fromDate, setFromDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(() => format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [targetProvider, setTargetProvider] = useState<string>('');
  
  // Data state
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Convert providers to ComboboxOption format for typeahead
  const providerOptions: ComboboxOption[] = providers.map(provider => ({
    value: provider.value,
    label: provider.label,
    description: `${provider.clientCount} client${provider.clientCount !== 1 ? 's' : ''} • ${provider.status}`,
    type: 'staff'
  }));

  // Generate mock events data for all providers - replace with actual API call
  const generateMockEvents = (): Event[] => {
    const events: Event[] = [];
    
    // Create appointments for each provider
    providers.forEach((provider, providerIndex) => {
      // Create 3-5 appointments per provider
      const appointmentCount = 3 + providerIndex; // Different counts for variety
      
      for (let i = 0; i < appointmentCount; i++) {
        const baseDate = new Date();
        const appointmentDate = addDays(baseDate, Math.floor(Math.random() * 14)); // Within next 2 weeks
        const hour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
        
        events.push({
          id: `${provider.id}-${i + 1}`,
          title: [
            'Initial Assessment - Depression',
            'Group Therapy - Anxiety',
            'Follow-up Session',
            'Medication Review',
            'Crisis Intervention',
            'Substance Use Assessment',
            'Family Therapy Session',
            'Behavioral Therapy'
          ][Math.floor(Math.random() * 8)],
          startTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), hour, 0).toISOString(),
          endTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), hour + 1, 30).toISOString(),
          type: ['Individual', 'Group', 'Provider'][Math.floor(Math.random() * 3)] as 'Individual' | 'Group' | 'Provider',
          provider: provider.label,
          patient: [
            'John Doe', 'Jane Smith', 'Michael Brown', 'Sarah Johnson', 
            'Robert Wilson', 'Emily Davis', 'Multiple Patients'
          ][Math.floor(Math.random() * 7)],
          status: ['Confirmed', 'Pending', 'Checked In', 'Completed'][Math.floor(Math.random() * 4)] as 'Confirmed' | 'Pending' | 'Checked In' | 'Completed',
          appointmentType: [
            'Initial Assessment', 'Follow-up', 'Group Therapy', 
            'Medication Review', 'Crisis Intervention'
          ][Math.floor(Math.random() * 5)],
          location: [
            'Room 101', 'Room 102', 'Conference Room A', 'Conference Room B', 
            'Telehealth', 'Crisis Unit'
          ][Math.floor(Math.random() * 6)]
        });
      }
    });
    
    return events;
  };

  const mockEvents = generateMockEvents();

  // Search for events
  const handleSearch = async () => {
    if (!selectedProvider) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter mock events by selected provider and date range
    const filteredEvents = mockEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      return event.provider === providers.find(p => p.value === selectedProvider)?.label &&
             eventDate >= from && eventDate <= to;
    });
    
    setEvents(filteredEvents);
    setSelectedEventIds([]);
    setIsLoading(false);
  };

  // Handle row selection
  const handleRowSelection = (selectedRows: any[]) => {
    setSelectedEventIds(selectedRows.map(row => row.id));
  };

  // Handle transfer
  const handleTransfer = () => {
    if (selectedEventIds.length === 0 || !targetProvider) return;
    
    onTransfer(selectedEventIds, selectedProvider, targetProvider);
    
    // Reset form
    setSelectedEventIds([]);
    setEvents([]);
    setHasSearched(false);
    onClose();
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFromDate(format(new Date(), 'yyyy-MM-dd'));
      setToDate(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
      setSelectedProvider('');
      setTargetProvider('');
      setEvents([]);
      setSelectedEventIds([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Column definitions for AG Grid
  const columnDefs = [
    {
      headerName: '',
      field: 'selection',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
      sortable: false,
      filter: false
    },
    {
      headerName: 'Date',
      field: 'startTime',
      cellRenderer: (params: any) => formatDate(params.value),
      minWidth: 120,
      flex: 1
    },
    {
      headerName: 'Time',
      field: 'startTime',
      cellRenderer: (params: any) => formatTimeRange(params.data.startTime, params.data.endTime),
      minWidth: 150,
      flex: 1
    },
    {
      headerName: 'Type',
      field: 'type',
      cellRenderer: (params: any) => <TypeBadge type={params.value || 'Individual'} />,
      minWidth: 100,
      flex: 1
    },
    {
      headerName: 'Appointment',
      field: 'title',
      minWidth: 200,
      flex: 2
    },
    {
      headerName: 'Patient',
      field: 'patient',
      minWidth: 150,
      flex: 1.5
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 120,
      flex: 1
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => <StatusBadge status={params.value || 'Pending'} />,
      minWidth: 100,
      flex: 1
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[1400px] lg:max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] w-[95vw] p-0 flex flex-col h-[850px] max-h-[95vh] bg-gradient-to-br from-orange-50 to-blue-100"
      >
        {/* Dialog Title */}
        <div className="px-4 md:px-6 py-4 rounded-t-xl">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowsRightLeftIcon className="w-6 h-6 text-blue-600" />
            </div>
            Transfer Appointments
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Search for appointments by provider and date range, then transfer them to another provider.
          </p>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="flex-1 flex min-h-0 overflow-auto p-4 md:p-6 pt-0 gap-4 md:gap-6">
          {/* Left Column - Search Controls */}
          <div className="w-56 md:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Criteria</h3>
            
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Source Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Source Provider
              </label>
              <Combobox
                options={providerOptions}
                value={selectedProvider ? [selectedProvider] : []}
                onChange={(values) => setSelectedProvider(values[0] || '')}
                placeholder="Select provider..."
                multiple={false}
                hideFilters={true}
                className="w-full"
              />
            </div>

            {/* Search Button */}
            <div>
              <Button
                variant="default"
                onClick={handleSearch}
                disabled={!selectedProvider || !fromDate || !toDate || isLoading}
                className="w-full h-10 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    Search
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Middle Column - Results */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
            {hasSearched ? (
              <>
                {/* Results Header */}
                <div className="flex-shrink-0 flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {events.length} appointment{events.length !== 1 ? 's' : ''} found
                  </Badge>
                  {selectedEventIds.length > 0 && (
                    <Badge variant="default" className="bg-primary/10 text-primary">
                      {selectedEventIds.length} selected
                    </Badge>
                  )}
                </div>

                {/* Data Table */}
                {events.length > 0 ? (
                  <div className="flex-1 min-h-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                    <div className="h-full min-h-[400px]">
                      <DataTable
                        rowData={events}
                        columnDefs={columnDefs}
                        gridOptions={{
                          rowHeight: 48,
                          headerHeight: 48,
                          suppressMenuHide: true,
                          rowSelection: 'multiple',
                          onSelectionChanged: (event) => {
                            const selectedRows = event.api.getSelectedRows();
                            handleRowSelection(selectedRows);
                          },
                          paginationPageSize: 8,
                          pagination: true,
                          domLayout: 'normal',
                          suppressHorizontalScroll: false,
                          autoSizeStrategy: {
                            type: 'fitCellContents'
                          }
                        }}
                        className="h-full ag-theme-alpine"
                      />
                    </div>
                  </div>
                ) : !isLoading && (
                  <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-lg border border-gray-100">
                    <div className="text-center">
                      <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                      <p className="text-gray-600">
                        No appointments were found for the selected provider and date range.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
                  <p className="text-gray-600 max-w-md">
                    Select a date range and provider, then click search to find appointments that can be transferred.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Transfer Controls */}
          <div className="w-56 md:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 space-y-4 relative overflow-visible z-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer To</h3>
            
            {selectedEventIds.length > 0 ? (
              <>
                {/* Selected count indicator */}
                <div className="bg-primary/10 text-primary p-3 rounded-lg text-center mb-4">
                  <p className="text-sm font-medium">
                    {selectedEventIds.length} appointment{selectedEventIds.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                {/* Target Provider Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-1" />
                    Target Provider
                  </label>
                  <div className="relative z-50 w-full max-w-48">
                    <Combobox
                      options={providerOptions.filter(option => option.value !== selectedProvider)}
                      value={targetProvider ? [targetProvider] : []}
                      onChange={(values) => setTargetProvider(values[0] || '')}
                      placeholder="Select provider..."
                      multiple={false}
                      hideFilters={true}
                      dropdownDirection="down"
                      className="w-full [&>button]:h-9 [&>button]:text-sm [&>button]:border-primary/30 [&>button]:focus:ring-primary [&>button]:focus:border-primary [&>div[role=listbox]]:w-48 [&>div[role=listbox]]:max-w-48 [&>div[role=listbox]]:max-h-[180px] [&>div[role=listbox]]:overflow-y-auto [&>div[role=listbox]]:z-[100] [&>div[role=listbox]]:py-1 [&>div[role=listbox]]:right-0 [&>div[role=listbox]]:left-auto [&_div[role=option]]:px-2 [&_div[role=option]]:py-1 [&_div[role=option]]:text-sm [&_div[role=option]]:leading-5 [&_input]:h-8 [&_input]:text-xs [&_input]:px-2"
                    />
                  </div>
                </div>

                {/* Transfer Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleTransfer}
                    disabled={!targetProvider}
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                  >
                    <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
                    Transfer ({selectedEventIds.length})
                  </Button>
                </div>

                {/* Cancel Button */}
                <div>
                  <Button 
                    variant="ghost" 
                    onClick={onClose} 
                    className="w-full h-10 border border-gray-200 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center py-12">
                <div>
                  <ArrowsRightLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">No appointments selected</h4>
                  <p className="text-xs text-gray-600">
                    Select appointments from the results to enable transfer options.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>


      </DialogContent>
    </Dialog>
  );
}; 