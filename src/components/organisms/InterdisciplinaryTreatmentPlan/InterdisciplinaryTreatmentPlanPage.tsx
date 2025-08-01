import React, { useState, useMemo } from 'react';
import { GridOptions } from 'ag-grid-community';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faChartLine, 
  faPowerOff, 
  faEye, 
  faPrint, 
  faSignature,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { TableSkeleton } from '@/components/atoms/TableSkeleton';

import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog/confirm-dialog';
import { useOngoingPlanCheck } from '@/hooks/useOngoingPlanCheck';

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

// Function to determine if a plan is active based on end date
const isPlanActive = (endDate?: string): boolean => {
  if (!endDate) return true; // No end date means ongoing/active
  const today = new Date();
  const planEndDate = new Date(endDate);
  return planEndDate >= today;
};

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
    endDate: '2024-07-15', // Past end date - should be inactive
    isActive: isPlanActive('2024-07-15'),
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
    endDate: undefined, // No end date - ongoing/active
    isActive: isPlanActive(undefined),
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
    endDate: '2025-02-01', // Future end date - should be active
    isActive: isPlanActive('2025-02-01'),
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
  },
  {
    id: '5',
    planNumber: 'TP-2024-005',
    patientId: 'P005',
    patientName: 'Alex Chen',
    planTitle: 'Communication Enhancement Program',
    programs: ['Speech Therapy', 'Language Development'],
    startDate: '2024-03-01',
    endDate: '2024-09-01', // Future end date - should be active
    isActive: isPlanActive('2024-09-01'),
    visits: 32,
    createdDate: '2024-02-25',
    createdBy: 'Dr. Lisa Park',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-28',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Excellent communication goals established'
    },
    objectives: 5,
    measures: 8,
    isCompleted: false,
    lastModified: '2024-03-15',
    assignedTherapists: ['Lisa Park', 'James Wilson'],
    planType: 'Individual',
    priority: 'High',
    tags: ['speech-therapy', 'communication', 'language']
  },
  {
    id: '6',
    planNumber: 'TP-2024-006',
    patientId: 'P006',
    patientName: 'Maya Patel',
    planTitle: 'Sensory Integration Therapy Plan',
    programs: ['Occupational Therapy', 'Sensory Integration'],
    startDate: '2024-01-10',
    endDate: '2024-05-10', // Past end date - should be expired
    isActive: isPlanActive('2024-05-10'),
    visits: 28,
    createdDate: '2024-01-05',
    createdBy: 'Dr. Rachel Green',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-01-08',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Comprehensive sensory assessment completed'
    },
    objectives: 6,
    measures: 11,
    isCompleted: false,
    lastModified: '2024-05-12',
    assignedTherapists: ['Rachel Green', 'Tom Anderson'],
    planType: 'Individual',
    priority: 'Medium',
    tags: ['occupational-therapy', 'sensory-integration']
  },
  {
    id: '7',
    planNumber: 'TP-2024-007',
    patientId: 'P007',
    patientName: 'Jordan Martinez',
    planTitle: 'Intensive Behavioral Support',
    programs: ['ABA Therapy', 'Behavioral Intervention'],
    startDate: '2024-04-01',
    endDate: '2024-09-01', // Changed to have end date
    isActive: isPlanActive('2024-09-01'),
    visits: 15,
    createdDate: '2024-03-25',
    createdBy: 'Dr. Kevin Brown',
    supervisorReview: {
      status: 'In Review',
      reviewer: 'Dr. Michael Wilson'
    },
    objectives: 9,
    measures: 14,
    isCompleted: false,
    lastModified: '2024-04-20',
    assignedTherapists: ['Kevin Brown', 'Sandra Lee'],
    planType: 'Individual',
    priority: 'Urgent',
    tags: ['aba-therapy', 'behavioral', 'intensive']
  },
  {
    id: '8',
    planNumber: 'TP-2023-015',
    patientId: 'P008',
    patientName: 'Emma Thompson',
    planTitle: 'Early Intervention Program',
    programs: ['Early Intervention', 'Developmental Therapy'],
    startDate: '2023-09-01',
    endDate: '2024-03-01', // Past end date - should be expired
    isActive: isPlanActive('2024-03-01'),
    visits: 42,
    createdDate: '2023-08-25',
    createdBy: 'Dr. Nancy White',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2023-08-30',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Age-appropriate developmental goals set'
    },
    objectives: 8,
    measures: 12,
    isCompleted: true,
    lastModified: '2024-03-05',
    assignedTherapists: ['Nancy White', 'Peter Clark'],
    planType: 'Individual',
    priority: 'High',
    tags: ['early-intervention', 'developmental']
  },
  {
    id: '9',
    planNumber: 'TP-2024-008',
    patientId: 'P009',
    patientName: 'Ryan O\'Connor',
    planTitle: 'Transition to Adulthood Support',
    programs: ['Life Skills Training', 'Vocational Therapy'],
    startDate: '2024-06-01',
    endDate: '2025-06-01', // Future end date - should be active
    isActive: isPlanActive('2025-06-01'),
    visits: 8,
    createdDate: '2024-05-20',
    createdBy: 'Dr. Michelle Davis',
    supervisorReview: {
      status: 'Pending',
      reviewer: 'Dr. Michael Wilson'
    },
    objectives: 12,
    measures: 18,
    isCompleted: false,
    lastModified: '2024-06-15',
    assignedTherapists: ['Michelle Davis', 'Carlos Rodriguez'],
    planType: 'Individual',
    priority: 'Medium',
    tags: ['life-skills', 'vocational', 'transition']
  },
  {
    id: '10',
    planNumber: 'TP-2024-009',
    patientId: 'P010',
    patientName: 'Sophia Kim',
    planTitle: 'Group Social Skills Workshop',
    programs: ['Group Therapy', 'Social Skills Training', 'Peer Interaction'],
    startDate: '2024-07-01',
    endDate: '2024-09-01', // Changed to have end date
    isActive: isPlanActive('2024-09-01'),
    visits: 4,
    createdDate: '2024-06-25',
    createdBy: 'Dr. Amanda Rodriguez',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-06-28',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Group dynamics assessment completed'
    },
    objectives: 4,
    measures: 6,
    isCompleted: false,
    lastModified: '2024-07-10',
    assignedTherapists: ['Amanda Rodriguez', 'Lisa Park'],
    planType: 'Group',
    priority: 'Low',
    tags: ['group-therapy', 'social-skills', 'peer-interaction']
  },
  {
    id: '11',
    planNumber: 'TP-2024-011',
    patientId: 'P011',
    patientName: 'Alex Thompson',
    planTitle: 'Physical Therapy Recovery Program',
    programs: ['Physical Therapy', 'Occupational Therapy'],
    startDate: '2024-03-01',
    endDate: '2024-08-15', // Future end date - active
    isActive: isPlanActive('2024-08-15'),
    visits: 32,
    createdDate: '2024-02-25',
    createdBy: 'Dr. Jennifer Walsh',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-28',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Post-injury rehabilitation plan approved'
    },
    objectives: 5,
    measures: 8,
    isCompleted: false,
    lastModified: '2024-07-20',
    assignedTherapists: ['Jennifer Walsh', 'Mark Stevens'],
    planType: 'Individual',
    priority: 'High',
    tags: ['physical-therapy', 'rehabilitation', 'recovery']
  },
  {
    id: '12',
    planNumber: 'TP-2024-012',
    patientId: 'P012',
    patientName: 'Sophia Chen',
    planTitle: 'Anxiety Management Protocol',
    programs: ['Group Therapy', 'Social Skills Training', 'Family Therapy'],
    startDate: '2024-05-01',
    endDate: '2024-11-01', // Future end date - active
    isActive: isPlanActive('2024-11-01'),
    visits: 16,
    createdDate: '2024-04-28',
    createdBy: 'Dr. Lisa Park',
    supervisorReview: {
      status: 'In Review',
      reviewDate: '2024-07-15',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Progress review scheduled for next month'
    },
    objectives: 6,
    measures: 9,
    isCompleted: false,
    lastModified: '2024-07-25',
    assignedTherapists: ['Lisa Park', 'David Kim', 'Sarah Martinez'],
    planType: 'Family',
    priority: 'Medium',
    tags: ['anxiety', 'family-therapy', 'group-support']
  },
  {
    id: '13',
    planNumber: 'TP-2023-045',
    patientId: 'P013',
    patientName: 'Marcus Williams',
    planTitle: 'Completed ADHD Management Plan',
    programs: ['Behavioral Intervention', 'Parent Training', 'Social Skills Training'],
    startDate: '2023-09-01',
    endDate: '2024-06-30', // Past end date - expired
    isActive: isPlanActive('2024-06-30'),
    visits: 45,
    createdDate: '2023-08-25',
    createdBy: 'Dr. Kevin Brown',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-06-25',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Successfully completed all objectives'
    },
    objectives: 7,
    measures: 14,
    isCompleted: true,
    lastModified: '2024-06-30',
    assignedTherapists: ['Kevin Brown', 'Amanda Rodriguez'],
    planType: 'Individual',
    priority: 'High',
    tags: ['adhd', 'behavioral', 'completed']
  },
  {
    id: '14',
    planNumber: 'TP-2024-014',
    patientId: 'P014',
    patientName: 'Isabella Garcia',
    planTitle: 'Autism Spectrum Support Program',
    programs: ['ABA Therapy', 'Speech Therapy', 'Sensory Integration'],
    startDate: '2024-02-15',
    endDate: '2024-12-15', // Future end date - active
    isActive: isPlanActive('2024-12-15'),
    visits: 28,
    createdDate: '2024-02-10',
    createdBy: 'Dr. Amanda Rodriguez',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-12',
      reviewer: 'Dr. Michael Wilson',
      comments: 'Comprehensive autism support plan'
    },
    objectives: 9,
    measures: 15,
    isCompleted: false,
    lastModified: '2024-07-28',
    assignedTherapists: ['Amanda Rodriguez', 'Sarah Johnson', 'Tom Anderson'],
    planType: 'Individual',
    priority: 'Urgent',
    tags: ['autism', 'aba-therapy', 'sensory-integration']
  },
  {
    id: '15',
    planNumber: 'TP-2024-015',
    patientId: 'P015',
    patientName: 'Ethan Davis',
    planTitle: 'Short-Term Crisis Intervention',
    programs: ['Behavioral Intervention', 'Family Therapy'],
    startDate: '2024-07-01',
    endDate: '2024-08-01', // Near future end date - active but ending soon
    isActive: isPlanActive('2024-08-01'),
    visits: 8,
    createdDate: '2024-06-28',
    createdBy: 'Dr. Rachel Green',
    supervisorReview: {
      status: 'Pending',
      reviewDate: undefined,
      reviewer: 'Dr. Michael Wilson',
      comments: 'Urgent intervention plan pending review'
    },
    objectives: 3,
    measures: 5,
    isCompleted: false,
    lastModified: '2024-07-30',
    assignedTherapists: ['Rachel Green', 'Lisa Park'],
    planType: 'Family',
    priority: 'Urgent',
    tags: ['crisis-intervention', 'short-term', 'urgent']
  }
];

// Program options for filtering
const allProgramOptions = [
  'ABA Therapy',
  'Speech Therapy', 
  'Occupational Therapy',
  'Physical Therapy',
  'Social Skills Training',
  'Group Therapy',
  'Family Therapy',
  'Parent Training',
  'Language Development',
  'Sensory Integration',
  'Behavioral Intervention',
  'Early Intervention',
  'Developmental Therapy',
  'Life Skills Training',
  'Vocational Therapy',
  'Peer Interaction'
];

// Plan type options for filtering
const allPlanTypeOptions = [
  'Individual',
  'Group', 
  'Family'
];

// Priority options for filtering
const allPriorityOptions = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];

// Component props interface
interface InterdisciplinaryTreatmentPlanPageProps {
  onBack?: () => void;
  onNewPlan?: () => void; // Callback for when user wants to create a new plan
  treatmentPlansData?: any[]; // Treatment plans data from parent
  onTreatmentPlansChange?: (plans: any[]) => void; // Callback to update parent state
}

const InterdisciplinaryTreatmentPlanPage: React.FC<InterdisciplinaryTreatmentPlanPageProps> = ({ 
  onNewPlan, 
  treatmentPlansData, 
  onTreatmentPlansChange 
}) => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [includeInactivePlans, setIncludeInactivePlans] = useState(true);
  const [showSettingsChanges, setShowSettingsChanges] = useState(false);
  const [includeCompletedPlans, setIncludeCompletedPlans] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Editable end date state
  const [editingEndDate, setEditingEndDate] = useState<{planId: string, value: string} | null>(null);
  
  // Initialize treatment plans from props or use mock data
  const [treatmentPlans, setTreatmentPlans] = useState(
    treatmentPlansData && treatmentPlansData.length > 0 ? treatmentPlansData : mockTreatmentPlans
  );
  
  // Sync parent data with full mock data on mount
  React.useEffect(() => {
    if (onTreatmentPlansChange && (!treatmentPlansData || treatmentPlansData.length <= 1)) {
      // Parent has minimal data, sync with full mock data
      onTreatmentPlansChange(mockTreatmentPlans);
      setTreatmentPlans(mockTreatmentPlans);
    }
  }, [onTreatmentPlansChange, treatmentPlansData]);
  
  // Update parent state when treatment plans change
  const updateTreatmentPlans = (newPlans: any[]) => {
    setTreatmentPlans(newPlans);
    if (onTreatmentPlansChange) {
      onTreatmentPlansChange(newPlans);
    }
  };
  
  // Use custom hook for ongoing plan check
  const {
    showOngoingPlanWarning,
    ongoingPlans,
    handleNewPlanWithCheck,
    handleConfirmNewPlan,
    handleCancelNewPlan
  } = useOngoingPlanCheck();
  
  // Typeahead search states
  const [programSearch, setProgramSearch] = useState('');
  const [planTypeSearch, setPlanTypeSearch] = useState('');
  const [prioritySearch, setPrioritySearch] = useState('');
  
  // Filter options based on search
  const filteredProgramOptions = allProgramOptions.filter(program =>
    program.toLowerCase().includes(programSearch.toLowerCase()) &&
    !selectedPrograms.includes(program)
  );
  
  const filteredPlanTypeOptions = allPlanTypeOptions.filter(planType =>
    planType.toLowerCase().includes(planTypeSearch.toLowerCase()) &&
    !selectedPlanTypes.includes(planType)
  );
  
  const filteredPriorityOptions = allPriorityOptions.filter(priority =>
    priority.toLowerCase().includes(prioritySearch.toLowerCase()) &&
    !selectedPriorities.includes(priority)
  );
  
  // Helper functions for adding/removing filter options
  const addProgram = (program: string) => {
    setSelectedPrograms([...selectedPrograms, program]);
    setProgramSearch('');
  };
  
  const removeProgram = (program: string) => {
    setSelectedPrograms(selectedPrograms.filter(p => p !== program));
  };
  
  const addPlanType = (planType: string) => {
    setSelectedPlanTypes([...selectedPlanTypes, planType]);
    setPlanTypeSearch('');
  };
  
  const removePlanType = (planType: string) => {
    setSelectedPlanTypes(selectedPlanTypes.filter(p => p !== planType));
  };
  
  const addPriority = (priority: string) => {
    setSelectedPriorities([...selectedPriorities, priority]);
    setPrioritySearch('');
  };
  
  const removePriority = (priority: string) => {
    setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
  };

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
      minWidth: 160,
      cellRenderer: (_params: any) => {
        const plan = _params.data;
        const isEditing = editingEndDate?.planId === plan.id;
        
        if (isEditing) {
          return (
            <div className="py-2 flex items-center gap-2">
              <Input
                type="date"
                value={editingEndDate?.value || ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="text-xs h-7 w-28"
                autoFocus
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveEndDate}
                className="p-1 h-7 w-7"
              >
                <CheckIcon className="w-3 h-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEditEndDate}
                className="p-1 h-7 w-7"
              >
                <XMarkIcon className="w-3 h-3 text-red-600" />
              </Button>
            </div>
          );
        }
        
        return (
          <div className="py-2 flex items-center justify-between group">
            <div className="text-sm text-gray-900">
              {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Ongoing'}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleStartEditEndDate(plan.id, plan.endDate)}
              className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 transition-opacity"
            >
              <PencilIcon className="w-3 h-3 text-gray-500" />
            </Button>
          </div>
        );
      }
    },
    {
      headerName: 'Status',
      field: 'isActive',
      flex: 1,
      minWidth: 100,
      cellRenderer: (_params: any) => {
        const plan = _params.data;
        const today = new Date();
        const endDate = plan.endDate ? new Date(plan.endDate) : null;
        
        let status = 'Active';
        let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'default';
        
        if (!plan.endDate) {
          status = 'Ongoing';
          variant = 'default';
        } else if (endDate && endDate < today) {
          status = 'Expired';
          variant = 'destructive';
        } else if (plan.isCompleted) {
          status = 'Completed';
          variant = 'secondary';
        } else if (!plan.isActive) {
          status = 'Inactive';
          variant = 'outline';
        }
        
        return (
          <div className="py-2">
            <Badge variant={variant}>
              {status}
            </Badge>
            {endDate && endDate < today && (
              <div className="text-xs text-red-600 mt-1">
                Ended {endDate.toLocaleDateString()}
              </div>
            )}
          </div>
        );
      }
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
    },
    {
      headerName: 'Actions Available',
      field: 'actions',
      width: 280,
      minWidth: 280,
      maxWidth: 280,
      pinned: 'right',
      suppressSizeToFit: true,
      cellRenderer: (_params: any) => (
        <TooltipProvider>
          <div className="py-2 flex flex-wrap gap-1">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Progress</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                  <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Review Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  <FontAwesomeIcon icon={faPrint} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  <FontAwesomeIcon icon={faSignature} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Request Person Signature</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        </TooltipProvider>
      )
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
    let filtered = treatmentPlans;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.planTitle.toLowerCase().includes(searchLower) ||
        plan.planNumber.toLowerCase().includes(searchLower) ||
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
  }, [treatmentPlans, searchTerm, selectedPrograms, selectedPlanTypes, selectedPriorities, includeInactivePlans, includeCompletedPlans]);

  // Check if any filters are active (different from default state)
  const hasActiveFilters = searchTerm || selectedPrograms.length > 0 || selectedPlanTypes.length > 0 || 
    selectedPriorities.length > 0 || !includeInactivePlans || showSettingsChanges || !includeCompletedPlans;

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
    setIncludeInactivePlans(true);
    setShowSettingsChanges(false);
    setIncludeCompletedPlans(true);
    // Clear typeahead search states
    setProgramSearch('');
    setPlanTypeSearch('');
    setPrioritySearch('');
  };

  // Handle treatment plan selection
  const handleTreatmentPlanSelect = (plan: TreatmentPlan) => {
    console.log('Selected treatment plan:', plan);
  };

  // Note: New Plan button warning logic is now handled by the parent component (OldUI.tsx)
  // The real "New Plan" button in the UI calls the warning logic before navigation

  // Handle end date editing
  const handleStartEditEndDate = (planId: string, currentEndDate?: string) => {
    const dateValue = currentEndDate ? new Date(currentEndDate).toISOString().split('T')[0] : '';
    setEditingEndDate({ planId, value: dateValue });
  };

  const handleSaveEndDate = () => {
    if (!editingEndDate) return;
    
    const updatedPlans = treatmentPlans.map(plan => {
      if (plan.id === editingEndDate.planId) {
        const newEndDate = editingEndDate.value || undefined;
        return {
          ...plan,
          endDate: newEndDate,
          isActive: newEndDate ? isPlanActive(newEndDate) : isPlanActive(undefined)
        };
      }
      return plan;
    });
    
    updateTreatmentPlans(updatedPlans);
    setEditingEndDate(null);
    console.log('End date updated for plan:', editingEndDate.planId, 'New date:', editingEndDate.value);
  };

  const handleCancelEditEndDate = () => {
    setEditingEndDate(null);
  };

  const handleEndDateChange = (value: string) => {
    if (editingEndDate) {
      setEditingEndDate({ ...editingEndDate, value });
    }
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
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {programSearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProgramOptions.map((program) => (
                      <button
                        key={program}
                        onClick={() => addProgram(program)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{program}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredProgramOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching programs found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Programs */}
              {selectedPrograms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPrograms.map(program => (
                    <div key={program} className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
                      <span className="text-xs text-blue-700">{program}</span>
                      <button
                        onClick={() => removeProgram(program)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search plan types..."
                  value={planTypeSearch}
                  onChange={(e) => setPlanTypeSearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {planTypeSearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPlanTypeOptions.map((planType) => (
                      <button
                        key={planType}
                        onClick={() => addPlanType(planType)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{planType}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredPlanTypeOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching plan types found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Plan Types */}
              {selectedPlanTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPlanTypes.map(planType => (
                    <div key={planType} className="flex items-center bg-green-50 border border-green-200 rounded-md px-2 py-1">
                      <span className="text-xs text-green-700">{planType}</span>
                      <button
                        onClick={() => removePlanType(planType)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search priorities..."
                  value={prioritySearch}
                  onChange={(e) => setPrioritySearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {prioritySearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPriorityOptions.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => addPriority(priority)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{priority}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredPriorityOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching priorities found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Priorities */}
              {selectedPriorities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPriorities.map(priority => (
                    <div key={priority} className="flex items-center bg-purple-50 border border-purple-200 rounded-md px-2 py-1">
                      <span className="text-xs text-purple-700">{priority}</span>
                      <button
                        onClick={() => removePriority(priority)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {filteredTreatmentPlans.length} of {treatmentPlans.length} plans
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
                  </div>
                  {(() => {
                    const today = new Date();
                    const endDate = plan.endDate ? new Date(plan.endDate) : null;
                    
                    let status = 'Active';
                    let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'default';
                    
                    if (!plan.endDate) {
                      status = 'Ongoing';
                      variant = 'default';
                    } else if (endDate && endDate < today) {
                      status = 'Expired';
                      variant = 'destructive';
                    } else if (plan.isCompleted) {
                      status = 'Completed';
                      variant = 'secondary';
                    } else if (!plan.isActive) {
                      status = 'Inactive';
                      variant = 'outline';
                    }
                    
                    return (
                      <div className="text-right">
                        <Badge variant={variant}>
                          {status}
                        </Badge>
                        {endDate && endDate < today && (
                          <div className="text-xs text-red-600 mt-1">
                            Ended {endDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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

                {/* Supervisor Review Info */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  {plan.supervisorReview ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge 
                          variant={{
                            'Approved': 'default',
                            'Rejected': 'destructive',
                            'In Review': 'secondary',
                            'Pending': 'outline'
                          }[plan.supervisorReview.status] as 'default' | 'destructive' | 'secondary' | 'outline' || 'default'}
                          className="text-xs"
                        >
                          {plan.supervisorReview.status}
                        </Badge>
                        {plan.supervisorReview.reviewer && (
                          <div className="text-xs text-gray-600 mt-1">by {plan.supervisorReview.reviewer}</div>
                        )}
                      </div>
                      {plan.supervisorReview.reviewDate && (
                        <div className="text-xs text-gray-500">
                          {new Date(plan.supervisorReview.reviewDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No supervisor review</div>
                  )}
                </div>

                {/* Actions - Moved to bottom and expanded */}
                <TooltipProvider>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                          <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Progress</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                          <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deactivate Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Review Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                          <FontAwesomeIcon icon={faPrint} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          <FontAwesomeIcon icon={faSignature} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Request Person Signature</p>
                      </TooltipContent>
                    </TooltipRoot>
                  </div>
                </TooltipProvider>
              </div>
            ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Ongoing Plan Warning Dialog */}
      <ConfirmDialog
        isOpen={showOngoingPlanWarning}
        onClose={handleCancelNewPlan}
        onConfirm={handleConfirmNewPlan}
        title="Ongoing Plans Detected"
        message={`You have ${ongoingPlans.length} ongoing treatment plan${ongoingPlans.length > 1 ? 's' : ''} without end dates. Creating a new plan while existing plans are ongoing may cause conflicts. Would you like to proceed anyway?`}
        confirmButtonText="Proceed"
      />
    </div>
  );
};

export default InterdisciplinaryTreatmentPlanPage;
