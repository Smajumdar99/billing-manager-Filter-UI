import { FC, useState } from 'react';
import { Card } from '@/components/atoms/Card/card';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Animation utility classes
const animationStyles = {
  '.animate-blob': {
    animation: 'blob 7s infinite',
  },
  '.animation-delay-2000': {
    animationDelay: '2s',
  },
  '.animation-delay-4000': {
    animationDelay: '4s',
  },
  '@keyframes blob': {
    '0%': {
      transform: 'translate(0px, 0px) scale(1)',
    },
    '33%': {
      transform: 'translate(30px, -50px) scale(1.1)',
    },
    '66%': {
      transform: 'translate(-20px, 20px) scale(0.9)',
    },
    '100%': {
      transform: 'translate(0px, 0px) scale(1)',
    },
  },
};

// Add styles to your tailwind.css or equivalent
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;
  document.head.appendChild(style);
}

// Update the PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

// Types for form review data
interface FormReview {
  id: string;
  formType: string;
  patientId: string;
  patientName: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'deferred' | 'reassigned';
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  formData: any;
  notes?: string;
  encounterId: string;
  dateOfService: string;
  serviceProvider: string;
}

interface ReviewFormsWidgetProps {
  className?: string;
}

// Mock data for demonstration
const mockForms: FormReview[] = [
  {
    id: '1',
    formType: 'Patient Health Care Questionnaire (PHQ-9)',
    patientId: 'PT100234',
    patientName: 'John Doe',
    submittedDate: '2024-03-20',
    status: 'pending',
    assignedTo: 'Dr. Smith',
    priority: 'high',
    formData: {},
    encounterId: '100206238',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '2',
    formType: 'Alcohol Screening Questionnaire (AUDIT)',
    patientId: 'PT100235',
    patientName: 'Jane Smith',
    submittedDate: '2024-03-19',
    status: 'pending',
    assignedTo: 'Dr. Johnson',
    priority: 'medium',
    formData: {},
    encounterId: '100206239',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '3',
    formType: 'Generalized Anxiety Disorder (GAD-7)',
    patientId: 'PT100236',
    patientName: 'Michael Brown',
    submittedDate: '2024-03-18',
    status: 'approved',
    assignedTo: 'Dr. Williams',
    priority: 'high',
    formData: {},
    encounterId: '100206240',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '4',
    formType: 'Patient Health Questionnaire (PHQ-9)',
    patientId: 'PT100237',
    patientName: 'Sarah Wilson',
    submittedDate: '2024-03-17',
    status: 'rejected',
    assignedTo: 'Dr. Anderson',
    priority: 'medium',
    formData: {},
    encounterId: '100206241',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    notes: 'Incomplete responses'
  },
  {
    id: '5',
    formType: 'Depression Screening Form',
    patientId: 'PT100238',
    patientName: 'David Lee',
    submittedDate: '2024-03-16',
    status: 'deferred',
    assignedTo: 'Dr. Taylor',
    priority: 'low',
    formData: {},
    encounterId: '100206242',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    notes: 'Needs additional information'
  },
  {
    id: '6',
    formType: 'Substance Use Assessment',
    patientId: 'PT100239',
    patientName: 'Emily Davis',
    submittedDate: '2024-03-15',
    status: 'reassigned',
    assignedTo: 'Dr. Martinez',
    priority: 'high',
    formData: {},
    encounterId: '100206243',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    notes: 'Reassigned to specialist'
  },
  {
    id: '7',
    formType: 'Mental Health Intake Form',
    patientId: 'PT100240',
    patientName: 'Robert Johnson',
    submittedDate: '2024-03-14',
    status: 'pending',
    assignedTo: 'Dr. Smith',
    priority: 'high',
    formData: {},
    encounterId: '100206244',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '8',
    formType: 'Anxiety Assessment Scale',
    patientId: 'PT100241',
    patientName: 'Lisa Anderson',
    submittedDate: '2024-03-13',
    status: 'approved',
    assignedTo: 'Dr. Johnson',
    priority: 'medium',
    formData: {},
    encounterId: '100206245',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '9',
    formType: 'Bipolar Disorder Screening',
    patientId: 'PT100242',
    patientName: 'James Wilson',
    submittedDate: '2024-03-12',
    status: 'pending',
    assignedTo: 'Dr. Williams',
    priority: 'high',
    formData: {},
    encounterId: '100206246',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '10',
    formType: 'Post-Traumatic Stress Disorder (PTSD) Checklist',
    patientId: 'PT100243',
    patientName: 'Maria Garcia',
    submittedDate: '2024-03-11',
    status: 'rejected',
    assignedTo: 'Dr. Taylor',
    priority: 'medium',
    formData: {},
    encounterId: '100206247',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    notes: 'Missing required sections'
  },
  {
    id: '11',
    formType: 'Attention Deficit Hyperactivity Disorder (ADHD) Assessment',
    patientId: 'PT100244',
    patientName: 'Thomas Moore',
    submittedDate: '2024-03-10',
    status: 'deferred',
    assignedTo: 'Dr. Anderson',
    priority: 'low',
    formData: {},
    encounterId: '100206248',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin',
    notes: 'Awaiting parent questionnaire'
  },
  {
    id: '12',
    formType: 'Eating Disorder Screening',
    patientId: 'PT100245',
    patientName: 'Jennifer White',
    submittedDate: '2024-03-09',
    status: 'pending',
    assignedTo: 'Dr. Martinez',
    priority: 'high',
    formData: {},
    encounterId: '100206249',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
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

// Update the Calendar component props type
interface CalendarProps {
  mode: "single";
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  initialFocus?: boolean;
}

export const ReviewFormsWidget: FC<ReviewFormsWidgetProps> = ({ className }) => {
  const [selectedForm, setSelectedForm] = useState<FormReview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    sortBy: 'newest',
    serviceProgram: 'all',
    serviceProvider: 'all',
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  // Filter forms based on all criteria
  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.formType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    const matchesProvider = filters.serviceProvider === 'all' || form.serviceProvider === serviceProviderOptions.find(p => p.value === filters.serviceProvider)?.label;
    const matchesDate = !filters.dateRange || form.dateOfService === format(filters.dateRange, 'MM/dd/yyyy');
    
    return matchesSearch && matchesStatus && matchesProvider && matchesDate;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      case 'oldest':
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      case 'priority':
        return b.priority.localeCompare(a.priority);
      case 'patientName':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: FormReview['status']) => {
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

  const getPriorityColor = (priority: FormReview['priority']) => {
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

  return (
    <div className="h-screen flex flex-col">
      {/* Metrics Section */}
      <div className={cn(
        "flex-none border-b bg-white transition-all",
        isCompactView ? "px-4 py-2" : "px-4 py-3"
      )}>
        <div className="flex items-center justify-between mb-0">
          <h2 className={cn(
            "font-medium text-gray-700",
            isCompactView ? "text-xs" : "text-sm"
          )}>Metrics Overview</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-600 hover:text-gray-900"
            onClick={() => setIsCompactView(!isCompactView)}
          >
            {isCompactView ? (
              <div className="flex items-center gap-1.5">
                <ArrowPathIcon className="w-3.5 h-3.5" />
                <span>Expand View</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ArrowPathIcon className="w-3.5 h-3.5" />
                <span>Compact View</span>
              </div>
            )}
          </Button>
        </div>

        <div className={cn(
          "grid gap-3 transition-all",
          isCompactView ? "grid-cols-3 mt-2" : "grid-cols-3 mt-3"
        )}>
          {/* Pending Card */}
          <div className={cn(
            "flex items-center rounded-lg border",
            isCompactView 
              ? "bg-yellow-50/50 border-yellow-200 px-3 py-1.5" 
              : "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200 p-3"
          )}>
            <div className="flex items-center gap-2 flex-1">
              <div className={cn(
                "rounded-lg",
                isCompactView ? "bg-yellow-100/50" : "bg-yellow-100",
                isCompactView ? "p-0.5" : "p-1.5"
              )}>
                <DocumentTextIcon className={cn(
                  "text-yellow-700/80",
                  isCompactView ? "w-3.5 h-3.5" : "w-5 h-5"
                )} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className={cn(
                  "font-semibold text-yellow-900",
                  isCompactView ? "text-base" : "text-xl"
                )}>12</p>
                <div>
                  <p className={cn(
                    "font-medium text-yellow-800/80",
                    isCompactView ? "text-xs" : "text-sm"
                  )}>Pending</p>
                  {!isCompactView && (
                    <p className="text-xs text-yellow-700/80 mt-0.5">4 pending {'>'} 24h</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* High Priority Card */}
          <div className={cn(
            "flex items-center rounded-lg border",
            isCompactView 
              ? "bg-red-50/50 border-red-200 px-3 py-1.5" 
              : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 p-3"
          )}>
            <div className="flex items-center gap-2 flex-1">
              <div className={cn(
                "rounded-lg",
                isCompactView ? "bg-red-100/50" : "bg-red-100",
                isCompactView ? "p-0.5" : "p-1.5"
              )}>
                <DocumentCheckIcon className={cn(
                  "text-red-700/80",
                  isCompactView ? "w-3.5 h-3.5" : "w-5 h-5"
                )} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className={cn(
                  "font-semibold text-red-900",
                  isCompactView ? "text-base" : "text-xl"
                )}>5</p>
                <div>
                  <p className={cn(
                    "font-medium text-red-800/80",
                    isCompactView ? "text-xs" : "text-sm"
                  )}>High Priority</p>
                  {!isCompactView && (
                    <p className="text-xs text-red-700/80 mt-0.5">2 critical cases</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Average Time Card */}
          <div className={cn(
            "flex items-center rounded-lg border",
            isCompactView 
              ? "bg-blue-50/50 border-blue-200 px-3 py-1.5" 
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 p-3"
          )}>
            <div className="flex items-center gap-2 flex-1">
              <div className={cn(
                "rounded-lg",
                isCompactView ? "bg-blue-100/50" : "bg-blue-100",
                isCompactView ? "p-0.5" : "p-1.5"
              )}>
                <ClockIcon className={cn(
                  "text-blue-700/80",
                  isCompactView ? "w-3.5 h-3.5" : "w-5 h-5"
                )} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className={cn(
                  "font-semibold text-blue-900",
                  isCompactView ? "text-base" : "text-xl"
                )}>2.5h</p>
                <div>
                  <p className={cn(
                    "font-medium text-blue-800/80",
                    isCompactView ? "text-xs" : "text-sm"
                  )}>Avg Time</p>
                  {!isCompactView && (
                    <p className="text-xs text-blue-700/80 mt-0.5">15% faster this week</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/4 border-r bg-white flex flex-col">
          {/* Search and Filters Header */}
          <div className="p-3 border-b bg-white">
            {/* Search Row */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  className="pl-8 w-full bg-gray-50 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "gap-1.5 shrink-0 px-2.5 text-gray-600 border-gray-200 hover:bg-gray-50",
                      showFilters && "bg-gray-100"
                    )}
                  >
                    <FunnelIcon className="w-3.5 h-3.5" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    {/* Date Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateRange && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange ? format(filters.dateRange, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange}
                            onSelect={(date: Date | undefined) => setFilters({ ...filters, dateRange: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Sort By Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Sort by</label>
                      <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select sort order" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service Program Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Service Program</label>
                      <Select value={filters.serviceProgram} onValueChange={(value) => setFilters({ ...filters, serviceProgram: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceProgramOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service Provider Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Service Provider</label>
                      <Select value={filters.serviceProvider} onValueChange={(value) => setFilters({ ...filters, serviceProvider: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceProviderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reset Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setFilters({
                        dateRange: undefined,
                        sortBy: 'newest',
                        serviceProgram: 'all',
                        serviceProvider: 'all',
                      })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" onValueChange={setFilterStatus}>
              <TabsList className="w-full bg-gray-50/50">
                <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white text-xs">All</TabsTrigger>
                <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-white text-xs">Pending</TabsTrigger>
                <TabsTrigger value="approved" className="flex-1 data-[state=active]:bg-white text-xs">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="flex-1 data-[state=active]:bg-white text-xs">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Forms List */}
          <div className="overflow-auto">
            <div className="p-3 space-y-2">
              {filteredForms.map((form) => (
                <Card
                  key={form.id}
                  className={cn(
                    "p-2.5 cursor-pointer transition-colors shadow-sm hover:shadow",
                    selectedForm?.id === form.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedForm(form)}
                >
                  {/* Header - Form Type and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-gray-900 line-clamp-1 flex-1">{form.formType}</h4>
                    <Badge className={cn("shrink-0 opacity-90 text-[10px] px-1.5 py-0.5", getStatusColor(form.status))}>
                      {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Patient Info - Two Column Layout */}
                  <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <div className="col-span-2">
                      <p className="text-[11px] text-gray-600/80">
                        <span className="text-gray-600/80">Patient:</span> {form.patientId} - {form.patientName}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-600/80">
                      <span className="text-gray-600/80">Encounter:</span> {form.encounterId}
                    </p>
                    <p className="text-[11px] text-gray-600/80">
                      <span className="text-gray-600/80">Service:</span> {form.dateOfService}
                    </p>
                  </div>

                  {/* Footer - Metadata */}
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500/80">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-gray-400/80" />
                        {form.submittedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-gray-400/80" />
                        {form.assignedTo}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-1.5 py-0.5 opacity-80", getPriorityColor(form.priority))}
                    >
                      {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form Preview */}
        <div className="flex-1 bg-gray-50">
          {selectedForm ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h4 className="font-medium">{selectedForm.formType}</h4>
                  {numPages && (
                    <span className="text-sm text-gray-500">
                      Page {pageNumber} of {numPages}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= (numPages || 1)}
                  >
                    Next
                  </Button>
                  <div className="w-px h-6 bg-gray-200 mx-2" />
                  <Button variant="outline" size="sm" className="gap-2">
                    <DocumentArrowPathIcon className="w-4 h-4" />
                    Defer
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <DocumentArrowRightIcon className="w-4 h-4" />
                    Reassign
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-red-600">
                    <XMarkIcon className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <DocumentCheckIcon className="w-4 h-4" />
                    Approve & Sign
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col items-center">
                  <Document
                    file="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading={
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-full text-red-500">
                        Failed to load PDF. Please try again.
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      className="max-w-full"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      scale={1.2}
                    />
                  </Document>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/[0.02] via-primary/[0.05] to-secondary">
              <div className="w-full max-w-md text-center space-y-6">
                {/* Decorative elements */}
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-4 left-8 w-24 h-24 bg-primary/15 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  
                  <div className="relative">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/5">
                      <DocumentTextIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Form Selected</h3>
                      <p className="text-gray-600 mb-6">Select a form from the list to review its contents and take action.</p>
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
          )}
        </div>
      </div>
    </div>
  );
}; 