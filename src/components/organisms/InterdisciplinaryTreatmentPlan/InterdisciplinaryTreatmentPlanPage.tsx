import React, { useState, useMemo } from 'react';
import { GridOptions } from 'ag-grid-community';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon, PencilIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { TableSkeleton } from '@/components/atoms/TableSkeleton';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';

/**
 * InterdisciplinaryTreatmentPlanPage Component
 * 
 * Modern treatment plan management dashboard for healthcare facilities
 * Features comprehensive plan tracking, filtering, and management capabilities
 * 
 * Key Features:
 * - Comprehensive treatment plan filtering and search
 * - Integrated table within filters section for unified layout
 * - Modal-based new plan creation
 * - Mobile-responsive design with card view
 * - Professional healthcare UI standards
 */

// Treatment Plan interface for healthcare facility plan management
interface TreatmentPlan {
  id: string;
  planNumber: string;
  patientId?: string;
  patientName?: string;
  planTitle: string;
  programs: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  visits: number;
  createdDate: string;
  createdBy: string;
  supervisorReview?: {
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
    reviewDate?: string;
    reviewer?: string;
    comments?: string;
  };
  objectives: number;
  measures: number;
  isCompleted: boolean;
  lastModified: string;
  assignedTherapists: string[];
  planType: 'Individual' | 'Group' | 'Family';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags: string[];
}

// Mock treatment plan data for development and testing
const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: '1',
    planNumber: 'TP-2024-001',
    patientId: 'P001',
    patientName: 'John Smith',
    planTitle: 'Comprehensive Behavioral Intervention Plan',
    programs: ['ABA Therapy', 'Speech Therapy', 'Occupational Therapy'],
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    isActive: true,
    visits: 24,
    createdDate: '2024-01-10',
    createdBy: 'Dr. Sarah Johnson',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-01-12',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Comprehensive plan with clear objectives'
    },
    objectives: 8,
    measures: 12,
    isCompleted: false,
    lastModified: '2024-01-20',
    assignedTherapists: ['Sarah Johnson', 'Mike Davis', 'Emily Chen'],
    planType: 'Individual',
    priority: 'High',
    tags: ['autism', 'behavioral', 'communication']
  },
  {
    id: '2',
    planNumber: 'TP-2024-002',
    patientId: 'P002',
    patientName: 'Emily Davis',
    planTitle: 'Social Skills Development Program',
    programs: ['Social Skills Training', 'Group Therapy'],
    startDate: '2024-01-20',
    endDate: '2024-06-20',
    isActive: true,
    visits: 18,
    createdDate: '2024-01-18',
    createdBy: 'Dr. Amanda Rodriguez',
    supervisorReview: {
      status: 'In Review',
      reviewer: 'Dr. Michael Wilson'
    },
    objectives: 6,
    measures: 9,
    isCompleted: false,
    lastModified: '2024-01-22',
    assignedTherapists: ['Amanda Rodriguez', 'Lisa Park'],
    planType: 'Group',
    priority: 'Medium',
    tags: ['social-skills', 'group-therapy']
  },
  {
    id: '3',
    planNumber: 'TP-2024-003',
    patientId: 'P003',
    patientName: 'Michael Johnson',
    planTitle: 'Completed Autism Spectrum Intervention',
    programs: ['ABA Therapy', 'Speech Therapy'],
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    isActive: false,
    visits: 48,
    createdDate: '2023-05-25',
    createdBy: 'Dr. Jennifer Lee',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2023-05-28',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Excellent progress achieved'
    },
    objectives: 10,
    measures: 15,
    isCompleted: true,
    lastModified: '2024-01-05',
    assignedTherapists: ['Jennifer Lee', 'Robert Kim'],
    planType: 'Individual',
    priority: 'High',
    tags: ['autism', 'completed', 'successful']
  },
  {
    id: '4',
    planNumber: 'TP-2024-004',
    patientId: 'P004',
    patientName: 'Sarah Wilson',
    planTitle: 'Family-Centered Behavioral Support',
    programs: ['Family Therapy', 'Parent Training', 'ABA Therapy'],
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    isActive: true,
    visits: 12,
    createdDate: '2024-01-25',
    createdBy: 'Dr. Maria Garcia',
    supervisorReview: {
      status: 'Pending',
      reviewer: 'Dr. Michael Wilson'
    },
    objectives: 7,
    measures: 10,
    isCompleted: false,
    lastModified: '2024-02-03',
    assignedTherapists: ['Maria Garcia', 'David Thompson'],
    planType: 'Family',
    priority: 'Medium',
    tags: ['family-therapy', 'parent-training']
  }
];

// Program options for filtering
const programOptions: ComboboxOption[] = [
  { value: 'ABA Therapy', label: 'ABA Therapy' },
  { value: 'Speech Therapy', label: 'Speech Therapy' },
  { value: 'Occupational Therapy', label: 'Occupational Therapy' },
  { value: 'Physical Therapy', label: 'Physical Therapy' },
  { value: 'Social Skills Training', label: 'Social Skills Training' },
  { value: 'Group Therapy', label: 'Group Therapy' },
  { value: 'Family Therapy', label: 'Family Therapy' },
  { value: 'Parent Training', label: 'Parent Training' }
];

// Plan type options for filtering
const planTypeOptions: ComboboxOption[] = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Group', label: 'Group' },
  { value: 'Family', label: 'Family' }
];

// Priority options for filtering
const priorityOptions: ComboboxOption[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Urgent', label: 'Urgent' }
];

// Component props interface
interface InterdisciplinaryTreatmentPlanPageProps {
  onBack?: () => void;
}

const InterdisciplinaryTreatmentPlanPage: React.FC<InterdisciplinaryTreatmentPlanPageProps> = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [includeInactivePlans, setIncludeInactivePlans] = useState(false);
  const [showSettingsChanges, setShowSettingsChanges] = useState(false);
  const [includeCompletedPlans, setIncludeCompletedPlans] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Column definitions for AG Grid
  const columnDefs: any[] = [
    {
      headerName: 'Plans',
      field: 'planTitle',
      flex: 2,
      minWidth: 200,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="font-medium text-gray-900">{_params.data.planTitle}</div>
          <div className="text-sm text-gray-500">#{_params.data.planNumber}</div>
          {_params.data.patientName && (
            <div className="text-sm text-blue-600">{_params.data.patientName}</div>
          )}
        </div>
      )
    },
    {
      headerName: 'Program(s)',
      field: 'programs',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          {_params.data.programs.slice(0, 2).map((program: string, index: number) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
              {program}
            </Badge>
          ))}
          {_params.data.programs.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{_params.data.programs.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      flex: 1,
      minWidth: 120,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">
            {new Date(_params.data.startDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      flex: 1,
      minWidth: 120,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">
            {_params.data.endDate ? new Date(_params.data.endDate).toLocaleDateString() : 'Ongoing'}
          </div>
        </div>
      )
    },
    {
      headerName: 'Active',
      field: 'isActive',
      flex: 0.8,
      minWidth: 80,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <Badge variant={_params.data.isActive ? 'default' : 'secondary'}>
            {_params.data.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      )
    },
    {
      headerName: 'Visits',
      field: 'visits',
      flex: 0.8,
      minWidth: 80,
      cellRenderer: (_params: any) => (
        <div className="py-2 text-center">
          <div className="text-sm font-medium text-gray-900">{_params.data.visits}</div>
        </div>
      )
    },
    {
      headerName: 'Created Date',
      field: 'createdDate',
      flex: 1,
      minWidth: 120,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">
            {new Date(_params.data.createdDate).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            by {_params.data.createdBy}
          </div>
        </div>
      )
    },
    {
      headerName: 'Actions Available',
      field: 'actions',
      flex: 1.2,
      minWidth: 140,
      cellRenderer: (_params: any) => (
        <div className="py-2 flex gap-1">
          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
            <EyeIcon className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
            <PencilIcon className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
            <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      )
    },
    {
      headerName: 'Supervisor Review Details',
      field: 'supervisorReview',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params: any) => {
        const review = params.data.supervisorReview;
        if (!review) return <div className="py-2 text-sm text-gray-400">No review</div>;
        
        const statusColors: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
          'Approved': 'default',
          'Rejected': 'destructive',
          'In Review': 'secondary',
          'Pending': 'outline'
        };
        
        return (
          <div className="py-2">
            <Badge variant={statusColors[review.status] || 'default'} className="mb-1">
              {review.status}
            </Badge>
            {review.reviewer && (
              <div className="text-xs text-gray-600">by {review.reviewer}</div>
            )}
            {review.reviewDate && (
              <div className="text-xs text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  // Grid options
  const gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true
    },
    pagination: true,
    paginationPageSize: 20,
    rowHeight: 80,
    onRowClicked: (event: any) => {
      console.log('Treatment plan selected:', event.data);
    }
  };

  // Filter treatment plans based on search and filters
  const filteredTreatmentPlans = useMemo(() => {
    let filtered = mockTreatmentPlans;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.planTitle.toLowerCase().includes(searchLower) ||
        plan.planNumber.toLowerCase().includes(searchLower) ||
        plan.patientName?.toLowerCase().includes(searchLower) ||
        plan.programs.some(program => program.toLowerCase().includes(searchLower)) ||
        plan.createdBy.toLowerCase().includes(searchLower)
      );
    }

    // Program filter
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter(plan => 
        plan.programs.some(program => selectedPrograms.includes(program))
      );
    }

    // Plan type filter
    if (selectedPlanTypes.length > 0) {
      filtered = filtered.filter(plan => selectedPlanTypes.includes(plan.planType));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(plan => selectedPriorities.includes(plan.priority));
    }

    // Include inactive plans filter
    if (!includeInactivePlans) {
      filtered = filtered.filter(plan => plan.isActive);
    }

    // Include completed plans filter
    if (!includeCompletedPlans) {
      filtered = filtered.filter(plan => !plan.isCompleted);
    }

    return filtered;
  }, [searchTerm, selectedPrograms, selectedPlanTypes, selectedPriorities, includeInactivePlans, includeCompletedPlans]);

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedPrograms.length > 0 || selectedPlanTypes.length > 0 || 
    selectedPriorities.length > 0 || includeInactivePlans || showSettingsChanges || includeCompletedPlans;

  // Handle refresh functionality
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPrograms([]);
    setSelectedPlanTypes([]);
    setSelectedPriorities([]);
    setIncludeInactivePlans(false);
    setShowSettingsChanges(false);
    setIncludeCompletedPlans(false);
  };

  // Handle treatment plan selection
  const handleTreatmentPlanSelect = (plan: TreatmentPlan) => {
    console.log('Selected treatment plan:', plan);
  };



  return (
    <div className="min-h-full bg-gray-50 p-6 pt-0 pb-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search treatment plans, patients, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Program Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program(s)</label>
              <Combobox
                options={programOptions}
                value={selectedPrograms}
                onChange={setSelectedPrograms}
                placeholder="Select programs..."
                multiple
              />
            </div>

            {/* Plan Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <Combobox
                options={planTypeOptions}
                value={selectedPlanTypes}
                onChange={setSelectedPlanTypes}
                placeholder="Select plan types..."
                multiple
              />
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <Combobox
                options={priorityOptions}
                value={selectedPriorities}
                onChange={setSelectedPriorities}
                placeholder="Select priorities..."
                multiple
              />
            </div>
          </div>

          {/* Checkbox Filters */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center">
              <Checkbox
                id="includeInactive"
                checked={includeInactivePlans}
                onCheckedChange={setIncludeInactivePlans}
              />
              <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
                Include Inactive Plans
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="showSettings"
                checked={showSettingsChanges}
                onCheckedChange={setShowSettingsChanges}
              />
              <label htmlFor="showSettings" className="ml-2 text-sm text-gray-700">
                Show Settings Changes
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="includeCompleted"
                checked={includeCompletedPlans}
                onCheckedChange={setIncludeCompletedPlans}
              />
              <label htmlFor="includeCompleted" className="ml-2 text-sm text-gray-700">
                Include Completed Plans/Objectives/Measures
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredTreatmentPlans.length} of {mockTreatmentPlans.length} plans
              </span>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <ArrowPathIcon className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Table Section */}
          <div className="mt-6">
            {isLoading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : (
              <div className="h-[600px]">
                <DataTable
                  columnDefs={columnDefs}
                  rowData={filteredTreatmentPlans}
                  gridOptions={gridOptions}
                  className="ag-theme-alpine h-full"
              />
            </div>
          )}

          {/* Mobile Card View - Hidden on desktop */}
          <div className="block md:hidden mt-6">
            <div className="space-y-4">
            {filteredTreatmentPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTreatmentPlanSelect(plan)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{plan.planTitle}</h3>
                    <p className="text-sm text-gray-500">#{plan.planNumber}</p>
                    {plan.patientName && (
                      <p className="text-sm text-blue-600">{plan.patientName}</p>
                    )}
                  </div>
                  <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {plan.programs.slice(0, 3).map((program, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {program}
                    </Badge>
                  ))}
                  {plan.programs.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{plan.programs.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Start:</span> {new Date(plan.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Visits:</span> {plan.visits}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(plan.createdDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">By:</span> {plan.createdBy}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <EyeIcon className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <PencilIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterdisciplinaryTreatmentPlanPage;
