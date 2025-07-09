import React, { useState, useMemo } from 'react';
import { CalendarIcon, ChevronUpIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Badge } from '@/components/atoms/Badge/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog/dialog';
import { Input } from '@/components/atoms/Input/input';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface FindAvailableDialogProps {
  open: boolean;
  onClose: () => void;
}

const FindAvailableDialog: React.FC<FindAvailableDialogProps> = ({ open, onClose }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    days: '30',
    category: '',
    serviceCategory: '',
    clinician: '',
    certification: '',
    gender: '',
    language: '',
    insurance: ''
  });

  // Sample programs data
  const programs = [
    { id: 'outpatient', name: 'Outpatient Program' },
    { id: 'intensive', name: 'Intensive Outpatient' },
    { id: 'partial', name: 'Partial Hospitalization' },
    { id: 'residential', name: 'Residential Treatment' },
  ];

  // Time slot data is now part of the results state

  const [results] = useState([
    { 
      id: '1',
      date: '2025-07-10', 
      program: 'outpatient',
      amSlots: ['8:00 AM', '9:00 AM', '10:00 AM'],
      pmSlots: ['1:00 PM', '2:00 PM', '3:00 PM']
    },
    { 
      id: '2',
      date: '2025-07-11', 
      program: 'intensive',
      amSlots: ['9:00 AM', '11:00 AM'],
      pmSlots: ['2:00 PM', '4:00 PM']
    },
    { 
      id: '3',
      date: '2025-07-12', 
      program: 'partial',
      amSlots: ['10:00 AM'],
      pmSlots: ['1:00 PM', '3:00 PM', '5:00 PM']
    },
  ]);

  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    // TODO: Implement actual search logic
    console.log('Searching with filters:', filters);
  };

  // Program names are now handled directly in the AG Grid cell renderer
  
  const handleProgramChange = (rowId: string, programId: string) => {
    console.log(`Program changed for row ${rowId} to ${programId}`);
  };
  
  const handleSlotSelect = (rowId: string, slot: string) => {
    setSelectedSlots(prev => {
      const newState = { ...prev };
      if (prev[rowId] === slot) {
        delete newState[rowId];
      } else {
        newState[rowId] = slot;
      }
      return newState as Record<string, string>;
    });
  };
  
  const handleBook = (rowId: string, slot: string) => {
    console.log('Booking slot:', { rowId, slot });
    onClose();
  };
  
  // Date change is handled directly in the input's onChange

  // AG Grid column definitions
  const columnDefs = useMemo(() => [
    { 
      field: 'date', 
      headerName: 'Date',
      width: 120,
      sortable: true,
      filter: true,
      cellStyle: { 
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        height: '100%'
      }
    },
    { 
      field: 'program', 
      headerName: 'Program',
      width: 200,
      sortable: true,
      filter: true,
      cellStyle: { 
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        height: '100%'
      },
      cellRenderer: (params: any) => {
        const program = programs.find(p => p.id === params.value) || { id: params.value, name: params.value };
        return (
          <div className="w-full flex justify-center">
            <Select 
              value={program.id}
              onValueChange={(value) => handleProgramChange(params.data.id, value)}
            >
              <SelectTrigger className="h-8 w-full max-w-[200px] text-left">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
    },
    { 
      field: 'timeSlots', 
      headerName: 'Available Slots',
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 300,
      cellStyle: { 
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        height: '100%'
      },
      cellRenderer: (params: any) => {
        const { amSlots, pmSlots } = params.data;
        const selectedSlot = Object.entries(selectedSlots).find(([key]) => key.startsWith(params.data.id + '-'))?.[1];
        
        return (
          <div className="w-full">
            <div className="flex flex-col justify-center" style={{ minHeight: '100%' }}>
              {amSlots.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">AM</div>
                  <div className="flex flex-wrap gap-1">
                    {amSlots.map((slot: string, index: number) => (
                      <Badge 
                        key={`am-${index}`}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={`cursor-pointer ${selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                        onClick={() => handleSlotSelect(params.data.id, slot)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {pmSlots.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">PM</div>
                  <div className="flex flex-wrap gap-1">
                    {pmSlots.map((slot: string, index: number) => (
                      <Badge 
                        key={`pm-${index}`}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={`cursor-pointer ${selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                        onClick={() => handleSlotSelect(params.data.id, slot)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedSlot && (
              <Button
                size="sm"
                onClick={() => handleBook(params.data.id, selectedSlot)}
                className="mt-2"
              >
                Book {selectedSlot}
              </Button>
            )}
          </div>
        );
      },
      width: 150
    }
  ], [selectedSlots, programs]);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Available Slots</DialogTitle>
        </DialogHeader>
        
        {/* Filters Section */}
        <div className="space-y-2">
          <button 
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
            {filtersExpanded ? (
              <ChevronUpIcon className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            )}
          </button>
          
          {filtersExpanded && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="pl-10"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
            
                {/* Days */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Days</label>
                  <Select 
                    value={filters.days}
                    onValueChange={(value) => handleFilterChange('days', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select 
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapy">Therapy</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Service Category */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Service Category</label>
                  <Select 
                    value={filters.serviceCategory}
                    onValueChange={(value) => handleFilterChange('serviceCategory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Clinician */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Clinician</label>
                  <Select 
                    value={filters.clinician}
                    onValueChange={(value) => handleFilterChange('clinician', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                      <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Certification */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Certification</label>
                  <Select 
                    value={filters.certification}
                    onValueChange={(value) => handleFilterChange('certification', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select certification" />
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <Select 
                    value={filters.gender}
                    onValueChange={(value) => handleFilterChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Language */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <Select 
                    value={filters.language}
                    onValueChange={(value) => handleFilterChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Insurance</label>
                  <Select 
                    value={filters.insurance}
                    onValueChange={(value) => handleFilterChange('insurance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance" />
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
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="default"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Slots</h3>
          <div className="ag-theme-alpine w-full" style={{ height: '400px' }}>
            <AgGridReact
              rowData={results}
              columnDefs={columnDefs as any}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowHeight={120}
              headerHeight={40}
              suppressCellFocus={true}
              onGridReady={(params) => {
                // Auto-size columns to fit content
                params.api.sizeColumnsToFit();
              }}
              onGridSizeChanged={(params) => {
                // Handle grid resizing
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindAvailableDialog;
