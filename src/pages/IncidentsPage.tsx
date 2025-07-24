import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '@/components/organisms/DataTable';
import { GridOptions } from 'ag-grid-community';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { TableSkeleton } from '@/components/atoms/TableSkeleton';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';


/**
 * IncidentsPage Component
 * 
 * Modern incident management dashboard for healthcare facilities
 * Features comprehensive incident tracking, filtering, and reporting capabilities
 * 
 * Key Features:
 * - Comprehensive incident filtering and search
 * - Integrated table within filters section for unified layout
 * - Modal-based new incident creation
 * - Mobile-responsive design with card view
 * - Professional healthcare UI standards
 */

// Incident interface for healthcare facility incident management
interface Incident {
  id: string;
  incidentNumber: string;
  patientId?: string;
  patientName?: string;
  incidentType: string;
  category: 'Clinical' | 'Non-clinical';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  reportedDate: string;
  reportedTime: string;
  location: string;
  facility: string;
  reporterName: string;
  reporterRole: string;
  description: string;
  immediateActions: string;
  assignedTo?: string;
  followUpRequired: boolean;
  estimatedResolutionDate?: string;
  actualResolutionDate?: string;
  riskLevel: string;
  witnessName?: string;
  witnessContact?: string;
  tags: string[];
}

// Props interface for modal state management


// Mock incident data for development and testing
const mockIncidents: Incident[] = [
  {
    id: '1',
    incidentNumber: 'INC-2024-001',
    patientId: 'P001',
    patientName: 'John Smith',
    incidentType: 'Patient Fall',
    category: 'Clinical',
    severity: 'Medium',
    status: 'Under Investigation',
    reportedDate: '2024-01-15',
    reportedTime: '14:30',
    location: 'Room 205',
    facility: 'Main Hospital',
    reporterName: 'Sarah Johnson',
    reporterRole: 'Nurse',
    description: 'Patient slipped while getting out of bed, no visible injuries',
    immediateActions: 'Assisted patient back to bed, vital signs checked',
    assignedTo: 'Dr. Wilson',
    followUpRequired: true,
    estimatedResolutionDate: '2024-01-20',
    riskLevel: 'Medium',
    witnessName: 'Mike Davis',
    witnessContact: 'mike.davis@hospital.com',
    tags: ['fall', 'patient-safety']
  },
  {
    id: '2',
    incidentNumber: 'INC-2024-002',
    patientId: 'P002',
    patientName: 'Emily Davis',
    incidentType: 'Medication Error',
    category: 'Clinical',
    severity: 'High',
    status: 'Open',
    reportedDate: '2024-01-16',
    reportedTime: '09:15',
    location: 'ICU Ward',
    facility: 'Main Hospital',
    reporterName: 'Dr. Anderson',
    reporterRole: 'Physician',
    description: 'Wrong dosage administered due to prescription error',
    immediateActions: 'Corrected dosage, monitored patient for adverse reactions',
    assignedTo: 'Pharmacy Manager',
    followUpRequired: true,
    estimatedResolutionDate: '2024-01-18',
    riskLevel: 'High',
    tags: ['medication', 'dosage-error']
  },
  {
    id: '3',
    incidentNumber: 'INC-2024-003',
    incidentType: 'Equipment Failure',
    category: 'Non-clinical',
    severity: 'Critical',
    status: 'Resolved',
    reportedDate: '2024-01-14',
    reportedTime: '16:45',
    location: 'Operating Room 3',
    facility: 'Surgical Center',
    reporterName: 'Tech Support',
    reporterRole: 'Technician',
    description: 'Ventilator malfunction during surgery',
    immediateActions: 'Backup ventilator deployed immediately, surgery continued',
    assignedTo: 'Biomedical Engineering',
    followUpRequired: false,
    actualResolutionDate: '2024-01-15',
    riskLevel: 'Critical',
    tags: ['equipment', 'ventilator', 'surgery']
  }
];

// Incident type options for filtering
const incidentTypeOptions: ComboboxOption[] = [
  { value: 'Patient Fall', label: 'Patient Fall' },
  { value: 'Medication Error', label: 'Medication Error' },
  { value: 'Equipment Failure', label: 'Equipment Failure' },
  { value: 'Security Breach', label: 'Security Breach' },
  { value: 'Infection Control', label: 'Infection Control' },
  { value: 'Documentation Error', label: 'Documentation Error' },
  { value: 'Communication Issue', label: 'Communication Issue' },
  { value: 'Staff Injury', label: 'Staff Injury' },
  { value: 'Visitor Incident', label: 'Visitor Incident' },
  { value: 'Other', label: 'Other' }
];

// Severity level options for filtering
const severityOptions: ComboboxOption[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

// Status options for filtering
const statusOptions: ComboboxOption[] = [
  { value: 'Open', label: 'Open' },
  { value: 'Under Investigation', label: 'Under Investigation' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Closed', label: 'Closed' }
];

// Facility options for filtering
const facilityOptions: ComboboxOption[] = [
  { value: 'Main Hospital', label: 'Main Hospital' },
  { value: 'Surgical Center', label: 'Surgical Center' },
  { value: 'Emergency Department', label: 'Emergency Department' },
  { value: 'Outpatient Clinic', label: 'Outpatient Clinic' },
  { value: 'Rehabilitation Center', label: 'Rehabilitation Center' }
];

const IncidentsPage: React.FC = () => {
  // State management for filters and UI
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncidentType, setSelectedIncidentType] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [isLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedIncidentType.length > 0 ||
      selectedSeverity.length > 0 ||
      selectedStatus.length > 0 ||
      selectedFacility.length > 0 ||
      showOpenOnly
    );
  }, [searchQuery, selectedIncidentType, selectedSeverity, selectedStatus, selectedFacility, showOpenOnly]);

  // Column definitions for AG Grid
  const columnDefs = useMemo(() => [
    {
      headerName: 'Incident #',
      field: 'incidentNumber',
      width: 130,
      pinned: 'left' as const,
      cellRenderer: (params: any) => (
        <span className="font-mono text-sm text-blue-600">
          {params.value}
        </span>
      )
    },
    {
      headerName: 'Patient',
      field: 'patientName',
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span>{params.value || 'N/A'}</span>
        </div>
      )
    },
    {
      headerName: 'Type',
      field: 'incidentType',
      width: 160
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 120,
      cellRenderer: (params: any) => {
        const categoryColors = {
          'Clinical': 'bg-blue-50 text-blue-700 border-blue-200',
          'Non-clinical': 'bg-gray-50 text-gray-700 border-gray-200'
        };
        return (
          <Badge 
            variant="outline" 
            className={categoryColors[params.value as keyof typeof categoryColors] || 'bg-gray-50 text-gray-700 border-gray-200'}
          >
            {params.value}
          </Badge>
        );
      }
    },
    {
      headerName: 'Severity',
      field: 'severity',
      width: 100,
      cellRenderer: (params: any) => {
        const severityColors = {
          'Low': 'default',
          'Medium': 'secondary',
          'High': 'outline',
          'Critical': 'destructive'
        };
        return (
          <Badge variant={severityColors[params.value as keyof typeof severityColors] as any}>
            {params.value}
          </Badge>
        );
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      cellRenderer: (params: any) => {
        const statusColors = {
          'Open': 'destructive',
          'Under Investigation': 'outline',
          'Resolved': 'secondary',
          'Closed': 'default'
        };
        return (
          <Badge variant={statusColors[params.value as keyof typeof statusColors] as any}>
            {params.value}
          </Badge>
        );
      }
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: 'Reported Date',
      field: 'reportedDate',
      width: 130,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: 'Reporter',
      field: 'reporterName',
      width: 140
    },
    {
      headerName: 'Assigned To',
      field: 'assignedTo',
      width: 140
    },
    {
      headerName: 'Facility',
      field: 'facility',
      width: 140
    }
  ], []);

  // Grid options for AG Grid
  const gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100
    },
    pagination: true,
    paginationPageSize: 20,
    rowHeight: 50,
    headerHeight: 45,
    animateRows: true,
    rowSelection: 'single',
    onRowClicked: (event: any) => {
      console.log('Incident selected:', event.data);
    }
  };

  // Filter incidents based on search query and selected filters
  const filteredIncidents = useMemo(() => {
    let filtered = mockIncidents;

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(incident =>
        incident.incidentNumber.toLowerCase().includes(query) ||
        incident.patientName?.toLowerCase().includes(query) ||
        incident.incidentType.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query) ||
        incident.reporterName.toLowerCase().includes(query)
      );
    }

    // Apply incident type filter
    if (selectedIncidentType.length > 0) {
      filtered = filtered.filter(incident =>
        selectedIncidentType.includes(incident.incidentType)
      );
    }

    // Apply severity filter
    if (selectedSeverity.length > 0) {
      filtered = filtered.filter(incident =>
        selectedSeverity.includes(incident.severity)
      );
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(incident =>
        selectedStatus.includes(incident.status)
      );
    }

    // Apply facility filter
    if (selectedFacility.length > 0) {
      filtered = filtered.filter(incident =>
        selectedFacility.includes(incident.facility)
      );
    }

    // Apply open only filter
    if (showOpenOnly) {
      filtered = filtered.filter(incident =>
        incident.status === 'Open' || incident.status === 'Under Investigation'
      );
    }

    return filtered;
  }, [searchQuery, selectedIncidentType, selectedSeverity, selectedStatus, selectedFacility, showOpenOnly]);

  // Handle refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIncidentType([]);
    setSelectedSeverity([]);
    setSelectedStatus([]);
    setSelectedFacility([]);
    setShowOpenOnly(false);
  };

  // Handle incident selection
  const handleIncidentSelect = (incident: Incident) => {
    console.log('Selected incident:', incident);
  };

  // Incident card component for mobile view
  const IncidentCard: React.FC<{ incident: Incident; onSelect: (incident: Incident) => void }> = ({ incident, onSelect }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(incident)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm text-blue-600 font-medium">
            {incident.incidentNumber}
          </span>
          <Badge variant={
            incident.severity === 'Critical' ? 'destructive' :
            incident.severity === 'High' ? 'outline' :
            incident.severity === 'Medium' ? 'secondary' : 'default'
          }>
            {incident.severity}
          </Badge>
        </div>
        <Badge variant={
          incident.status === 'Open' ? 'destructive' :
          incident.status === 'Under Investigation' ? 'outline' :
          incident.status === 'Resolved' ? 'secondary' : 'default'
        }>
          {incident.status}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{incident.incidentType}</h3>
        <Badge 
          variant="outline" 
          className={incident.category === 'Clinical' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
        >
          {incident.category}
        </Badge>
      </div>
      
      {incident.patientName && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <UserIcon className="w-4 h-4" />
          <span>{incident.patientName}</span>
        </div>
      )}
      
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
        <MapPinIcon className="w-4 h-4" />
        <span>{incident.location}</span>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
        <CalendarIcon className="w-4 h-4" />
        <span>{incident.reportedDate} at {incident.reportedTime}</span>
      </div>
      
      <p className="text-sm text-gray-700 line-clamp-2">{incident.description}</p>
      
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        Reported by {incident.reporterName} • {incident.facility}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Content */}
      <div className="flex-1 overflow-visible">
        {/* Filters Section with Integrated Table */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 min-h-[200px]">
          {/* Search and Filter Controls */}
          <div className="space-y-4">
            {/* Mobile Layout - Stacked */}
            <div className="lg:hidden space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search incidents, patients, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="text-gray-600 w-full sm:w-auto"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sm:hidden ml-2">Refresh</span>
                </Button>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-4">
                <Combobox
                  options={incidentTypeOptions}
                  value={selectedIncidentType}
                  onChange={setSelectedIncidentType}
                  placeholder="Incident Type"
                  multiple
                  className="w-full"
                />
                
                <Combobox
                  options={severityOptions}
                  value={selectedSeverity}
                  onChange={setSelectedSeverity}
                  placeholder="Severity"
                  multiple
                  className="w-full"
                />
                
                <Combobox
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Status"
                  multiple
                  className="w-full"
                />
                
                <Combobox
                  options={facilityOptions}
                  value={selectedFacility}
                  onChange={setSelectedFacility}
                  placeholder="Facility"
                  multiple
                  className="w-full"
                />
                
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <Checkbox
                    id="open-only-mobile"
                    checked={showOpenOnly}
                    onCheckedChange={setShowOpenOnly}
                  />
                  <label htmlFor="open-only-mobile" className="text-sm text-gray-700 whitespace-nowrap">
                    Open incidents only
                  </label>
                </div>
                
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 w-full sm:col-span-2"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Desktop Layout - Single Row */}
            <div className="hidden lg:flex items-center gap-4 pb-4">
              {/* Search Bar */}
              <div className="relative w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search incidents, patients, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="text-gray-600"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              {/* Filter Controls */}
              <Combobox
                options={incidentTypeOptions}
                value={selectedIncidentType}
                onChange={setSelectedIncidentType}
                placeholder="Incident Type"
                multiple
                className="min-w-[160px]"
              />
              
              <Combobox
                options={severityOptions}
                value={selectedSeverity}
                onChange={setSelectedSeverity}
                placeholder="Severity"
                multiple
                className="min-w-[130px]"
              />
              
              <Combobox
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Status"
                multiple
                className="min-w-[120px]"
              />
              
              <Combobox
                options={facilityOptions}
                value={selectedFacility}
                onChange={setSelectedFacility}
                placeholder="Facility"
                multiple
                className="min-w-[140px]"
              />
              
              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-only-desktop"
                  checked={showOpenOnly}
                  onCheckedChange={setShowOpenOnly}
                />
                <label htmlFor="open-only-desktop" className="text-sm text-gray-700 whitespace-nowrap">
                  Open incidents only
                </label>
              </div>
              
              {/* Clear All Button - Only show when filters are applied */}
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  Clear All
                </Button>
              )}
            </div>


          </div>

          {/* Integrated Incidents Table */}
          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {/* Desktop Skeleton */}
                <div className="hidden lg:block">
                  <TableSkeleton 
                    variant="desktop" 
                    rows={8}
                    className="w-full"
                  />
                </div>
                
                {/* Mobile Skeleton */}
                <div className="lg:hidden">
                  <TableSkeleton 
                    variant="mobile" 
                    rows={6}
                    className="w-full"
                  />
                </div>
              </div>
            ) : filteredIncidents.length > 0 ? (
              <div className="overflow-hidden">
                {/* Desktop View - AG Grid */}
                <div className="hidden lg:block">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <DataTable
                      rowData={filteredIncidents}
                      columnDefs={columnDefs}
                      className="w-full h-96"
                      gridOptions={gridOptions}
                    />
                  </div>
                </div>
                
                {/* Mobile/Tablet View - Cards */}
                <div className="lg:hidden max-h-96 overflow-y-auto">
                  {filteredIncidents.map((incident) => (
                    <IncidentCard 
                      key={incident.id} 
                      incident={incident}
                      onSelect={handleIncidentSelect}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <ExclamationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default IncidentsPage;
