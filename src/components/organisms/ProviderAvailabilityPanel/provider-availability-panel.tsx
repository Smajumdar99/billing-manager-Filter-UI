import React, { useState, useEffect, useMemo } from 'react';
import { CalendarIcon, ChevronUpIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faClock, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/atoms/Button/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Badge } from '@/components/atoms/Badge/badge';
import { Input } from '@/components/atoms/Input/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Label } from '@/components/atoms/Label';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ProviderAvailabilityPanelProps {
  date?: string;
  appointmentType?: string;
  provider?: string;
  patient?: string;
  appointmentTab?: 'person' | 'provider' | 'group' | 'benefits';
  onSlotSelect?: (date: string, slot: string) => void;
}

interface AvailabilitySlot {
  id: string;
  date: string;
  program: string;
  amSlots: string[];
  pmSlots: string[];
}

const ProviderAvailabilityPanel: React.FC<ProviderAvailabilityPanelProps> = ({
  date,
  appointmentType,
  provider,
  patient,
  appointmentTab = 'person',
  onSlotSelect,
}) => {
  const [filters, setFilters] = useState({
    startDate: date || '',
    days: '30',
    category: appointmentType || '',
    serviceCategory: '',
    clinician: provider || '',
    certification: '',
    gender: '',
    language: '',
    insurance: ''
  });

  const [results, setResults] = useState<AvailabilitySlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Update filters when props change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      startDate: date || prev.startDate,
      category: appointmentType || prev.category,
      clinician: provider || prev.clinician,
    }));
  }, [date, appointmentType, provider]);

  // Check if we have enough info to show availability
  // For Provider tab, patient is not required
  // For Person/Group/Benefits tabs, patient is required
  const hasRequiredInfo = Boolean(
    date && 
    appointmentType && 
    provider && 
    (appointmentTab === 'provider' ? true : patient)
  );

  // Mock fetch function - replace with actual API call
  const fetchAvailability = async () => {
    if (!hasRequiredInfo) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockResults: AvailabilitySlot[] = [
        { 
          id: '1',
          date: date || '2025-07-10', 
          program: 'outpatient',
          amSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
          pmSlots: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        },
        { 
          id: '2',
          date: getNextDay(date || '2025-07-10'), 
          program: 'intensive',
          amSlots: ['9:00 AM', '11:00 AM'],
          pmSlots: ['2:00 PM', '4:00 PM']
        },
        { 
          id: '3',
          date: getNextDay(getNextDay(date || '2025-07-10')), 
          program: 'partial',
          amSlots: ['10:00 AM'],
          pmSlots: ['1:00 PM', '3:00 PM', '5:00 PM']
        },
      ];
      setResults(mockResults);
      setIsLoading(false);
    }, 500);
  };

  const getNextDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  // Fetch availability when required info changes
  useEffect(() => {
    if (hasRequiredInfo) {
      fetchAvailability();
    } else {
      setResults([]);
    }
  }, [date, appointmentType, provider, patient]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchAvailability();
  };

  const handleSlotSelect = (rowId: string, slot: string, date: string) => {
    setSelectedSlots(prev => {
      const newState = { ...prev };
      if (prev[rowId] === slot) {
        delete newState[rowId];
      } else {
        newState[rowId] = slot;
      }
      return newState;
    });
    
    // Call the callback to update parent form
    if (onSlotSelect) {
      onSlotSelect(date, slot);
    }
  };
  
  // AG Grid column definitions
  const columnDefs = useMemo(() => [
    { 
      field: 'timeSlots', 
      headerName: 'Available Slots',
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 200,
      cellStyle: { 
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        paddingTop: '12px',
        paddingBottom: '12px',
        height: '100%',
        overflow: 'visible',
        wordWrap: 'break-word'
      },
      cellRenderer: (params: any) => {
        const { amSlots, pmSlots, date } = params.data;
        const selectedSlot = selectedSlots[params.data.id];
        
        // Categorize slots into Morning, Afternoon, Evening
        const categorizeSlots = (slots: string[]) => {
          const morning: string[] = [];
          const afternoon: string[] = [];
          const evening: string[] = [];
          
          slots.forEach(slot => {
            const [time, period] = slot.split(' ');
            const [hours] = time.split(':').map(Number);
            let hour24 = hours;
            
            if (period === 'PM' && hour24 !== 12) {
              hour24 += 12;
            } else if (period === 'AM' && hour24 === 12) {
              hour24 = 0;
            }
            
            // Morning: 6 AM - 11:59 AM (6-11)
            // Afternoon: 12 PM - 4:59 PM (12-16)
            // Evening: 5 PM - 10:59 PM (17-22)
            if (hour24 >= 6 && hour24 < 12) {
              morning.push(slot);
            } else if (hour24 >= 12 && hour24 < 17) {
              afternoon.push(slot);
            } else if (hour24 >= 17 && hour24 < 23) {
              evening.push(slot);
            }
          });
          
          return { morning, afternoon, evening };
        };
        
        const allSlots = [...(amSlots || []), ...(pmSlots || [])];
        const { morning, afternoon, evening } = categorizeSlots(allSlots);
        
        return (
          <div className="w-full min-w-0">
            <div className="flex flex-col gap-2.5">
              {morning.length > 0 && (
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">Morning</div>
                  <div className="flex flex-wrap gap-1.5">
                    {morning.map((slot: string, index: number) => (
                      <Badge 
                        key={`morning-${index}`}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors text-xs px-2 py-0.5 ${
                          selectedSlot === slot 
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                            : 'bg-white border-green-500 hover:bg-green-50 hover:border-green-600'
                        }`}
                        onClick={() => handleSlotSelect(params.data.id, slot, date)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {afternoon.length > 0 && (
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">Afternoon</div>
                  <div className="flex flex-wrap gap-1.5">
                    {afternoon.map((slot: string, index: number) => (
                      <Badge 
                        key={`afternoon-${index}`}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors text-xs px-2 py-0.5 ${
                          selectedSlot === slot 
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                            : 'bg-white border-green-500 hover:bg-green-50 hover:border-green-600'
                        }`}
                        onClick={() => handleSlotSelect(params.data.id, slot, date)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {evening.length > 0 && (
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">Evening</div>
                  <div className="flex flex-wrap gap-1.5">
                    {evening.map((slot: string, index: number) => (
                      <Badge 
                        key={`evening-${index}`}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors text-xs px-2 py-0.5 ${
                          selectedSlot === slot 
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                            : 'bg-white border-green-500 hover:bg-green-50 hover:border-green-600'
                        }`}
                        onClick={() => handleSlotSelect(params.data.id, slot, date)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  ], [selectedSlots, onSlotSelect, results]);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: false,
    suppressSizeToFit: false,
  }), []);

  return (
    <Card className="h-full flex flex-col w-full border-0 shadow-none bg-transparent">
      <CardHeader className="bg-gray-50 border-b border-gray-200 py-2.5 px-4">
        <CardTitle className="text-sm font-semibold text-gray-800 break-words">Provider Availability</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col overflow-hidden min-w-0">
        {!hasRequiredInfo ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="rounded-full bg-blue-50 p-6">
                  <FontAwesomeIcon 
                    icon={faCalendarCheck} 
                    className="h-12 w-12 text-blue-500"
                  />
                </div>
              </div>
              
              {/* Title */}
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  View Available Slots
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {appointmentTab === 'provider' 
                    ? 'Please complete the appointment details to see available time slots for the selected provider.'
                    : 'Please complete the appointment details to see available time slots for the selected provider and patient.'}
                </p>
              </div>
              
              {/* Requirements List */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
                <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Required Information
                </p>
                <div className="space-y-2.5 text-left">
                  {!date && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCalendarCheck} className="h-2.5 w-2.5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">Select Date</span>
                    </div>
                  )}
                  {!appointmentType && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faClock} className="h-2.5 w-2.5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">Select Appointment Type</span>
                    </div>
                  )}
                  {!provider && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserDoctor} className="h-2.5 w-2.5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">Select Provider</span>
                    </div>
                  )}
                  {appointmentTab !== 'provider' && !patient && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="h-2.5 w-2.5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {appointmentTab === 'group' ? 'Add Patients to Group' : 'Select Patient'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters Section */}
            <div className="mb-4">
              <button 
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3"
              >
                <FunnelIcon className="h-3.5 w-3.5 mr-1.5" />
                {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
                {filtersExpanded ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 ml-1" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
                )}
              </button>
              
              {filtersExpanded && (
                <div className="bg-gray-50 rounded-xl p-5 flex flex-col max-h-[400px]">
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                    <div className="grid grid-cols-1 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Start Date</Label>
                      <div className="relative w-full">
                        <Input 
                          type="date" 
                          value={filters.startDate}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="h-9 text-sm pl-11 pr-3 bg-white w-full min-w-[140px]"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                      </div>
                    </div>
                
                    {/* Days */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Days</Label>
                      <Select 
                        value={filters.days}
                        onValueChange={(value) => handleFilterChange('days', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select days" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Category</Label>
                      <Select 
                        value={filters.category}
                        onValueChange={(value) => handleFilterChange('category', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select category" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="therapy">Therapy</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service Category */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Service Category</Label>
                      <Select 
                        value={filters.serviceCategory}
                        onValueChange={(value) => handleFilterChange('serviceCategory', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select service category" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clinician */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Clinician</Label>
                      <Select 
                        value={filters.clinician}
                        onValueChange={(value) => handleFilterChange('clinician', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select clinician" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                          <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                          <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Certification */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Certification</Label>
                      <Select 
                        value={filters.certification}
                        onValueChange={(value) => handleFilterChange('certification', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select certification" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="md">MD</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="lpc">LPC</SelectItem>
                          <SelectItem value="lcsw">LCSW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Gender</Label>
                      <Select 
                        value={filters.gender}
                        onValueChange={(value) => handleFilterChange('gender', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select gender" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Language */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Language</Label>
                      <Select 
                        value={filters.language}
                        onValueChange={(value) => handleFilterChange('language', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select language" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Insurance */}
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">Insurance</Label>
                      <Select 
                        value={filters.insurance}
                        onValueChange={(value) => handleFilterChange('insurance', value)}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white w-full min-w-[140px]">
                          <SelectValue placeholder="Select insurance" className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="blue-cross">Blue Cross</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                          <SelectItem value="united">United Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2 mt-auto flex-shrink-0">
                    <Button 
                      variant="default"
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="h-9 px-5 text-sm font-medium"
                    >
                      {isLoading ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Results Section */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-500 break-words">Loading availability...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-500 break-words">No available slots found</p>
                </div>
              ) : (
                <div className="ag-theme-alpine flex-1 min-w-0" style={{ minHeight: '300px', overflow: 'visible' }}>
                  <AgGridReact
                    rowData={results}
                    columnDefs={columnDefs as any}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    headerHeight={36}
                    suppressCellFocus={true}
                    suppressHorizontalScroll={true}
                    domLayout="normal"
                    getRowHeight={(params) => {
                      if (!params.data) return 120;
                      // Categorize slots to count sections
                      const allSlots = [...(params.data.amSlots || []), ...(params.data.pmSlots || [])];
                      const categorizeSlots = (slots: string[]) => {
                        const morning: string[] = [];
                        const afternoon: string[] = [];
                        const evening: string[] = [];
                        slots.forEach(slot => {
                          const [time, period] = slot.split(' ');
                          const [hours] = time.split(':').map(Number);
                          let hour24 = hours;
                          if (period === 'PM' && hour24 !== 12) hour24 += 12;
                          else if (period === 'AM' && hour24 === 12) hour24 = 0;
                          if (hour24 >= 6 && hour24 < 12) morning.push(slot);
                          else if (hour24 >= 12 && hour24 < 17) afternoon.push(slot);
                          else if (hour24 >= 17 && hour24 < 23) evening.push(slot);
                        });
                        return { morning, afternoon, evening };
                      };
                      const { morning, afternoon, evening } = categorizeSlots(allSlots);
                      
                      let height = 50; // Base padding
                      if (morning.length > 0) height += 40; // Morning section with label
                      if (afternoon.length > 0) height += 40; // Afternoon section with label
                      if (evening.length > 0) height += 40; // Evening section with label
                      return Math.max(height, 120); // Minimum height
                    }}
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit();
                      // Reset row heights after initial render to account for selected slots
                      setTimeout(() => {
                        params.api.resetRowHeights();
                      }, 100);
                    }}
                    onGridSizeChanged={(params) => {
                      params.api.sizeColumnsToFit();
                      params.api.resetRowHeights();
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderAvailabilityPanel;
