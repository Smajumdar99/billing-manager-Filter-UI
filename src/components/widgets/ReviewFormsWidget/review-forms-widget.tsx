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
  UserIcon,
  CalendarIcon as HeroCalendarIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ArrowRightIcon as DocumentArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
    id: '16',
    formType: 'Review intake form for new patient consultation',
    patientId: 'PT100234',
    patientName: 'John Doe',
    submittedDate: '2024-03-20',
    status: 'pending',
    assignedTo: 'Dr. Smith',
    priority: 'medium',
    formData: {},
    encounterId: '100206238',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '26',
    formType: 'Review consent forms for group therapy',
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
    id: '46',
    formType: 'Review patient satisfaction survey results',
    patientId: 'PT100236',
    patientName: 'Michael Brown',
    submittedDate: '2024-03-18',
    status: 'approved',
    assignedTo: 'Dr. Williams',
    priority: 'low',
    formData: {},
    encounterId: '100206240',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '47',
    formType: 'Review treatment authorization request forms',
    patientId: 'PT100237',
    patientName: 'Sarah Wilson',
    submittedDate: '2024-03-17',
    status: 'rejected',
    assignedTo: 'Dr. Anderson',
    priority: 'high',
    formData: {},
    encounterId: '100206241',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '48',
    formType: 'Review updated HIPAA compliance forms',
    patientId: 'PT100238',
    patientName: 'David Lee',
    submittedDate: '2024-03-16',
    status: 'deferred',
    assignedTo: 'Dr. Taylor',
    priority: 'medium',
    formData: {},
    encounterId: '100206242',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '71',
    formType: 'Review medication consent forms',
    patientId: 'PT100239',
    patientName: 'Emily Davis',
    submittedDate: '2024-03-15',
    status: 'reassigned',
    assignedTo: 'Dr. Martinez',
    priority: 'high',
    formData: {},
    encounterId: '100206243',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '72',
    formType: 'Review discharge summary forms',
    patientId: 'PT100240',
    patientName: 'Robert Johnson',
    submittedDate: '2024-03-14',
    status: 'pending',
    assignedTo: 'Dr. Smith',
    priority: 'medium',
    formData: {},
    encounterId: '100206244',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  },
  {
    id: '73',
    formType: 'Review insurance pre-authorization forms',
    patientId: 'PT100241',
    patientName: 'Lisa Anderson',
    submittedDate: '2024-03-13',
    status: 'approved',
    assignedTo: 'Dr. Johnson',
    priority: 'high',
    formData: {},
    encounterId: '100206245',
    dateOfService: '02/03/2025',
    serviceProvider: 'Ensoftek Admin'
  }
];

// Add new interfaces for filter options
interface FilterOptions {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: string;
  serviceProgram: string;
  serviceProvider: string;
  personName: string;
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

// Add DateRange type
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Update the Calendar component props type
interface CalendarProps {
  mode: "single";
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  initialFocus?: boolean;
}

// Add this CSS at the top of your file or in your global styles
const hideScrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = hideScrollbarStyles;
  document.head.appendChild(style);
}

export const ReviewFormsWidget: FC<ReviewFormsWidgetProps> = ({ className }) => {
  const [selectedForm, setSelectedForm] = useState<FormReview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      from: undefined,
      to: undefined
    },
    sortBy: 'newest',
    serviceProgram: 'all',
    serviceProvider: 'all',
    personName: ''
  });

  // Calculate counts for each status
  const statusCounts = mockForms.reduce((acc, form) => {
    acc[form.status] = (acc[form.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allCount = mockForms.length;
  const pendingCount = statusCounts['pending'] || 0;
  const approvedCount = statusCounts['approved'] || 0;
  const rejectedCount = statusCounts['rejected'] || 0;
  const deferredCount = statusCounts['deferred'] || 0;
  const reassignedCount = statusCounts['reassigned'] || 0;

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
    const matchesPerson = !filters.personName || form.patientName.toLowerCase().includes(filters.personName.toLowerCase());
    
    // Update date range filtering logic
    const formDate = new Date(form.dateOfService);
    const matchesDate = (!filters.dateRange.from && !filters.dateRange.to) || 
                       (filters.dateRange.from && filters.dateRange.to && 
                        formDate >= filters.dateRange.from && 
                        formDate <= filters.dateRange.to);
    
    return matchesSearch && matchesStatus && matchesProvider && matchesDate && matchesPerson;
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

  // Mobile Form Card Component
  const FormCard: FC<{ form: FormReview }> = ({ form }) => (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-colors shadow-sm hover:shadow",
        selectedForm?.id === form.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
      )}
      onClick={() => {
        setSelectedForm(form);
        if (isMobile) setShowMobilePreview(true);
      }}
    >
      {/* Header - Form Type and Status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-900">{form.formType}</h4>
        <Badge className={cn("shrink-0 text-xs", getStatusColor(form.status))}>
          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
        </Badge>
      </div>

      {/* Patient Info */}
      <div className="space-y-1 mb-3">
        <p className="text-sm text-gray-700">
          <span className="text-gray-600">Patient:</span> {form.patientName}
        </p>
        <p className="text-sm text-gray-600">ID: {form.patientId}</p>
        <p className="text-sm text-gray-600">Service Date: {form.dateOfService}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <UserIcon className="w-4 h-4" />
          {form.assignedTo}
        </div>
        <Badge 
          variant="outline" 
          className={cn("text-xs", getPriorityColor(form.priority))}
        >
          {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
        </Badge>
      </div>
    </Card>
  );

  // Mobile Preview Header
  const MobilePreviewHeader: FC = () => (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobilePreview(false)}
          className="text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Button>
        <h2 className="text-lg font-medium text-gray-900">
          {selectedForm?.formType || 'Form Preview'}
        </h2>
      </div>
    </div>
  );

  if (isMobile) {
    if (showMobilePreview && selectedForm) {
      return (
        <div className="fixed inset-0 bg-white z-50">
          <MobilePreviewHeader />
          
          <div className="pt-16 pb-20 px-4 h-full overflow-auto">
            {/* Form Details */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-lg mb-4">{selectedForm.formType}</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Patient</label>
                    <p className="text-base">{selectedForm.patientName} ({selectedForm.patientId})</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Service Date</label>
                    <p className="text-base">{selectedForm.dateOfService}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <Badge className={cn("mt-1 text-sm", getStatusColor(selectedForm.status))}>
                      {selectedForm.status.charAt(0).toUpperCase() + selectedForm.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Assigned To</label>
                    <p className="text-base">{selectedForm.assignedTo}</p>
                  </div>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Document
                  file="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={pageNumber} 
                    width={window.innerWidth - 48}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
                
                {numPages && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      Page {pageNumber} of {numPages}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= (numPages || 1)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-red-600"
                onClick={() => {/* handle reject */}}
              >
                Reject
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {/* handle approve */}}
              >
                Approve & Sign
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Mobile Search and Filters */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or person name"
                className="pl-8 w-full bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("gap-1.5", showFilters && "bg-gray-100")}
            >
              <FunnelIcon className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" onValueChange={setFilterStatus} className="w-full">
            <div className="w-full overflow-x-auto hide-scrollbar">
              <TabsList className="bg-gray-50/50 inline-flex min-w-max border-b border-gray-200">
                <TabsTrigger value="all" className="px-4">
                  All
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                    {allCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-4">
                  Pending
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-medium">
                    {pendingCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="px-4">
                  Approved
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                    {approvedCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="px-4">
                  Rejected
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-medium">
                    {rejectedCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="deferred" className="px-4">
                  Deferred
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">
                    {deferredCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="reassigned" className="px-4">
                  Reassigned
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-medium">
                    {reassignedCount}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Mobile Forms List */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {filteredForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      </div>
    );
  }

  // Return existing desktop view
  return (
    <div className="h-screen flex flex-col">
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
                  placeholder="Search by form or person name"
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
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    {/* Person Name Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Person Name</label>
                      <Input
                        placeholder="Filter by person name"
                        value={filters.personName}
                        onChange={(e) => setFilters({ ...filters, personName: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date Range</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateRange.from && !filters.dateRange.to && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange.from && filters.dateRange.to ? (
                              `${format(filters.dateRange.from, "MMM dd, yyyy")} - ${format(filters.dateRange.to, "MMM dd, yyyy")}`
                            ) : (
                              "Select date range"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex flex-col sm:flex-row">
                            <div className="border-b sm:border-b-0 sm:border-r border-gray-200">
                              <Calendar
                                mode="single"
                                selected={filters.dateRange.from}
                                onSelect={(date) => 
                                  setFilters({ 
                                    ...filters, 
                                    dateRange: { 
                                      ...filters.dateRange, 
                                      from: date 
                                    } 
                                  })
                                }
                                initialFocus
                                className="rounded-l-md"
                                classNames={{
                                  months: "flex flex-col space-y-4",
                                  month: "space-y-3",
                                  caption: "flex justify-center pt-1 relative items-center px-8",
                                  caption_label: "text-sm font-medium",
                                  nav: "flex items-center",
                                  nav_button: cn(
                                    "h-7 w-7 bg-transparent p-0 hover:bg-gray-50 rounded-md",
                                    "absolute top-1 flex items-center justify-center text-gray-500"
                                  ),
                                  nav_button_previous: "left-1",
                                  nav_button_next: "right-1",
                                  table: "w-full border-collapse",
                                  head_row: "flex w-full",
                                  head_cell: "text-gray-500 w-9 font-normal text-[0.8rem] text-center",
                                  row: "flex w-full mt-1",
                                  cell: cn(
                                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                    "h-9 w-9 hover:bg-gray-100 rounded-md transition-colors",
                                    "[&:has([aria-selected])]:bg-gray-100"
                                  ),
                                  day: cn(
                                    "h-9 w-9 p-0 font-normal",
                                    "flex items-center justify-center rounded-md transition-colors",
                                    "hover:bg-primary hover:text-primary-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                  ),
                                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                  day_today: "bg-accent text-accent-foreground",
                                  day_outside: "text-gray-400",
                                  day_disabled: "text-gray-400",
                                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                  day_hidden: "invisible",
                                }}
                              />
                            </div>
                            <div>
                              <Calendar
                                mode="single"
                                selected={filters.dateRange.to}
                                onSelect={(date) => 
                                  setFilters({ 
                                    ...filters, 
                                    dateRange: { 
                                      ...filters.dateRange, 
                                      to: date 
                                    } 
                                  })
                                }
                                initialFocus
                                className="rounded-r-md"
                                classNames={{
                                  months: "flex flex-col space-y-4",
                                  month: "space-y-3",
                                  caption: "flex justify-center pt-1 relative items-center px-8",
                                  caption_label: "text-sm font-medium",
                                  nav: "flex items-center",
                                  nav_button: cn(
                                    "h-7 w-7 bg-transparent p-0 hover:bg-gray-50 rounded-md",
                                    "absolute top-1 flex items-center justify-center text-gray-500"
                                  ),
                                  nav_button_previous: "left-1",
                                  nav_button_next: "right-1",
                                  table: "w-full border-collapse",
                                  head_row: "flex w-full",
                                  head_cell: "text-gray-500 w-9 font-normal text-[0.8rem] text-center",
                                  row: "flex w-full mt-1",
                                  cell: cn(
                                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                    "h-9 w-9 hover:bg-gray-100 rounded-md transition-colors",
                                    "[&:has([aria-selected])]:bg-gray-100"
                                  ),
                                  day: cn(
                                    "h-9 w-9 p-0 font-normal",
                                    "flex items-center justify-center rounded-md transition-colors",
                                    "hover:bg-primary hover:text-primary-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                  ),
                                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                  day_today: "bg-accent text-accent-foreground",
                                  day_outside: "text-gray-400",
                                  day_disabled: "text-gray-400",
                                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                  day_hidden: "invisible",
                                }}
                              />
                            </div>
                          </div>
                          <div className="p-3 border-t border-gray-100">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => 
                                  setFilters({ 
                                    ...filters, 
                                    dateRange: { 
                                      from: undefined, 
                                      to: undefined 
                                    } 
                                  })
                                }
                              >
                                Clear
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  const button = document.querySelector('[data-state="open"]');
                                  if (button) {
                                    (button as HTMLButtonElement).click();
                                  }
                                }}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
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
                        dateRange: {
                          from: undefined,
                          to: undefined
                        },
                        sortBy: 'newest',
                        serviceProgram: 'all',
                        serviceProvider: 'all',
                        personName: ''
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
              <div className="w-full overflow-x-auto hide-scrollbar">
                <TabsList className="bg-gray-50/50 inline-flex min-w-max border-b border-gray-200">
                  <TabsTrigger value="all" className="px-4 data-[state=active]:bg-white text-xs">
                    All
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                      {allCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="px-4 data-[state=active]:bg-white text-xs">
                    Pending
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-medium">
                      {pendingCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="px-4 data-[state=active]:bg-white text-xs">
                    Approved
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                      {approvedCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="px-4 data-[state=active]:bg-white text-xs">
                    Rejected
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-medium">
                      {rejectedCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="deferred" className="px-4 data-[state=active]:bg-white text-xs">
                    Deferred
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">
                      {deferredCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="reassigned" className="px-4 data-[state=active]:bg-white text-xs">
                    Reassigned
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-medium">
                      {reassignedCount}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
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
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= (numPages || 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-200 mx-2" />
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowPathIcon className="w-4 h-4" />
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