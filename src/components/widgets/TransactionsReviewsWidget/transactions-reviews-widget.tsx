import { FC, useState } from 'react';
import { Card } from '@/components/atoms/Card/card';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/Dialog/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from "@radix-ui/react-icons";
import { 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  UserIcon,
  CalendarIcon as HeroCalendarIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  XMarkIcon,
  ArrowPathIcon as DocumentArrowPathIcon,
  ArrowRightIcon as DocumentArrowRightIcon
} from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

// Types for treatment plan review data
interface TreatmentPlanReview {
  id: string;
  patientId: string;
  patientName: string;
  planType: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'deferred' | 'reassigned';
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  encounterId: string;
  dateOfService: string;
  serviceProvider: string;
  objectives: {
    id: string;
    description: string;
    status: 'met' | 'not_met' | 'in_progress';
    progress: number;
  }[];
}

interface TransactionsReviewsWidgetProps {
  className?: string;
}

// Mock data for treatment plans
const mockTreatmentPlans: TreatmentPlanReview[] = [
  {
    id: '1',
    patientId: 'PT100123',
    patientName: 'John Doe',
    planType: 'Behavioral Health Treatment Plan',
    submittedDate: '2024-03-15',
    status: 'pending',
    assignedTo: 'Dr. Smith',
    priority: 'high',
    encounterId: '100206247',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    objectives: [
      {
        id: '1',
        description: 'Improve daily functioning',
        status: 'in_progress',
        progress: 65
      },
      {
        id: '2',
        description: 'Reduce anxiety symptoms',
        status: 'not_met',
        progress: 30
      }
    ]
  },
  {
    id: '2',
    patientId: 'PT100124',
    patientName: 'Jane Smith',
    planType: 'Substance Use Treatment Plan',
    submittedDate: '2024-03-14',
    status: 'deferred',
    assignedTo: 'Dr. Johnson',
    priority: 'medium',
    encounterId: '100206248',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    objectives: [
      {
        id: '1',
        description: 'Maintain sobriety',
        status: 'met',
        progress: 100
      },
      {
        id: '2',
        description: 'Attend support groups',
        status: 'in_progress',
        progress: 75
      }
    ]
  }
];

// Add new interfaces for filter options
interface FilterOptions {
  dateRange: Date | undefined;
  sortBy: string;
  serviceProgram: string;
  serviceProvider: string;
}

// Add mock data for filters
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Priority' },
  { value: 'patientName', label: 'Patient Name' },
];

const serviceProgramOptions = [
  { value: 'all', label: 'All Programs' },
  { value: 'behavioral', label: 'Behavioral Health' },
  { value: 'primary', label: 'Primary Care' },
  { value: 'specialty', label: 'Specialty Care' },
];

const serviceProviderOptions = [
  { value: 'all', label: 'All Providers' },
  { value: 'ensoftek', label: 'Ensoftek Admin' },
  { value: 'dr-smith', label: 'Dr. Smith' },
  { value: 'dr-johnson', label: 'Dr. Johnson' },
];

// Add new component for treatment plan review dialog
const TreatmentPlanReviewDialog: FC<{
  plan: TreatmentPlanReview;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'approve' | 'reject' | 'assign' | 'defer') => void;
}> = ({ plan, isOpen, onClose, onAction }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Treatment Plan Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Patient Information</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm"><span className="font-medium">Name:</span> {plan.patientName}</p>
                <p className="text-sm"><span className="font-medium">ID:</span> {plan.patientId}</p>
                <p className="text-sm"><span className="font-medium">Plan Type:</span> {plan.planType}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Service Details</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm"><span className="font-medium">Encounter:</span> {plan.encounterId}</p>
                <p className="text-sm"><span className="font-medium">Service Date:</span> {plan.dateOfService}</p>
                <p className="text-sm"><span className="font-medium">Provider:</span> {plan.serviceProvider}</p>
              </div>
            </div>
          </div>

          {/* Treatment Objectives Table */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Treatment Objectives</h4>
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objective</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plan.objectives.map((objective) => (
                    <tr key={objective.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{objective.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            objective.status === 'met' ? 'bg-green-100 text-green-800' :
                            objective.status === 'not_met' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {objective.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                objective.status === 'met' ? 'bg-green-500' :
                                objective.status === 'not_met' ? 'bg-red-500' :
                                'bg-yellow-500'
                              )}
                              style={{ width: `${objective.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{objective.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => onAction('reject')}>Reject</Button>
          <Button variant="secondary" onClick={() => onAction('defer')}>Defer</Button>
          <Button variant="secondary" onClick={() => onAction('assign')}>Assign</Button>
          <Button onClick={() => onAction('approve')}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add EmptyState component
const EmptyState: FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/[0.02] via-primary/[0.05] to-secondary">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 left-8 w-24 h-24 bg-primary/15 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/5">
              <ClipboardDocumentIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Treatment Plan Selected</h3>
              <p className="text-gray-600 mb-6">Select a treatment plan from the list to review its details, objectives, and progress tracking.</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                  <span>Review</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DocumentCheckIcon className="w-5 h-5 text-primary/80" />
                  <span>Sign</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ArrowPathIcon className="w-5 h-5 text-primary/60" />
                  <span>Process</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransactionsReviewsWidget: FC<TransactionsReviewsWidgetProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlanReview | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    sortBy: 'newest',
    serviceProgram: 'all',
    serviceProvider: 'all'
  });

  // Filter treatment plans based on search and filters
  const filteredPlans = mockTreatmentPlans.filter(plan => {
    const matchesSearch = searchQuery === '' || 
      plan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === 'all' || plan.status === activeTab;
    const matchesProgram = filters.serviceProgram === 'all' || plan.serviceProvider.includes(filters.serviceProgram);
    const matchesProvider = filters.serviceProvider === 'all' || plan.assignedTo.includes(filters.serviceProvider);

    return matchesSearch && matchesStatus && matchesProgram && matchesProvider;
  });

  // Sort filtered plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'patientName':
        return a.patientName.localeCompare(b.patientName);
      default: // newest
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'deferred':
        return 'bg-blue-100 text-blue-800';
      case 'reassigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlanAction = (action: 'approve' | 'reject' | 'assign' | 'defer') => {
    // TODO: Implement action handling
    console.log(`Action ${action} for plan ${selectedPlan?.id}`);
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Filters and Search */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, ID, or plan type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Service Program</label>
                  <Select
                    value={filters.serviceProgram}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, serviceProgram: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceProgramOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Service Provider</label>
                  <Select
                    value={filters.serviceProvider}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, serviceProvider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceProviderOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="deferred">Deferred</TabsTrigger>
            <TabsTrigger value="reassigned">Reassigned</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Transaction List */}
        <div className="w-1/2 border-r overflow-y-auto">
          <div className="p-4 space-y-4">
            {sortedPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  selectedPlan?.id === plan.id ? "bg-gray-50 border-primary" : "hover:bg-gray-50"
                )}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{plan.planType}</h3>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(plan.status))}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(plan.priority))}>
                        {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Patient: {plan.patientId} - {plan.patientName}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <DocumentArrowRightIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Encounter:</span> {plan.encounterId}
                  </div>
                  <div>
                    <span className="font-medium">Service Date:</span> {plan.dateOfService}
                  </div>
                  <div>
                    <span className="font-medium">Assigned To:</span> {plan.assignedTo}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {plan.submittedDate}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-1/2 overflow-y-auto">
          {selectedPlan ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">TREATMENT PLAN</h2>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={() => handlePlanAction('reject')}>
                    Reject
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handlePlanAction('defer')}>
                    Defer
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handlePlanAction('assign')}>
                    Assign
                  </Button>
                  <Button size="sm" onClick={() => handlePlanAction('approve')}>
                    Approve
                  </Button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedPlan.patientId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Parent:</span> {selectedPlan.patientName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Admission:</span> {selectedPlan.dateOfService}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Diagnosis Code:</span> {selectedPlan.planType}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Primary Therapist:</span> {selectedPlan.assignedTo}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date of Plan:</span> {selectedPlan.submittedDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">LOC:</span> Outpatient
                  </p>
                </div>
              </div>

              {/* Treatment Objectives Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Problem List</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Behavior Objectives</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interventions</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Responsible Party</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type of Service</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedPlan.objectives.map((objective) => (
                      <tr key={objective.id}>
                        <td className="px-4 py-2 text-sm">{objective.description}</td>
                        <td className="px-4 py-2 text-sm">Goal {objective.id}</td>
                        <td className="px-4 py-2 text-sm">{objective.description}</td>
                        <td className="px-4 py-2 text-sm">Standard interventions</td>
                        <td className="px-4 py-2 text-sm">{selectedPlan.assignedTo}</td>
                        <td className="px-4 py-2 text-sm">Therapy</td>
                        <td className="px-4 py-2 text-sm">Weekly</td>
                        <td className="px-4 py-2 text-sm">{selectedPlan.dateOfService}</td>
                        <td className="px-4 py-2 text-sm">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              objective.status === 'met' ? 'bg-green-100 text-green-800' :
                              objective.status === 'not_met' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            )}
                          >
                            {objective.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comments Section */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Comments:</h4>
                <p className="text-sm text-gray-600">{selectedPlan.notes || 'No comments available.'}</p>
              </div>

              {/* Signatures Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Physician signature:</span>
                  <span className="text-gray-500">Date:</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Staff Signature:</span>
                  <span className="text-gray-500">Date:</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Client Signature:</span>
                  <span className="text-gray-500">Date:</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Supervisor Signature:</span>
                  <span className="text-gray-500">Date:</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Clinician Signature:</span>
                  <span className="text-gray-500">Date:</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}; 