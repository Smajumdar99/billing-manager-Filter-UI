import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import { Switch } from '@/components/atoms/Switch';
import { ColDef } from 'ag-grid-community';
import {
  XCircle,
  Clock,
  User,
  Bell,
  FileText,
  Calendar,
  ClipboardCheck,
  BarChart2,
  MessageSquare,
  Layers,
  Maximize2,
  Minimize2,
  GripVertical,
  CheckCircle,
  BedDouble,
  FileCheck,
  AlertCircle,
  Receipt,
  Skull,
  UserRound,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreHorizontal,
  ClockIcon,
  XCircleIcon,
  Search,
  FileWarning,
  Trash2,
  Plus,
  Users,
} from 'lucide-react';
import { ReviewFormsWidget } from './widgets/ReviewFormsWidget/review-forms-widget';
import { NewTaskDialog } from '@/components/molecules/NewTaskDialog/new-task-dialog';
import { NewMessageDialog } from '@/components/molecules/NewMessageDialog/new-message-dialog';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ReviewPrescriptionsWidget } from './widgets/ReviewPrescriptionsWidget/review-prescriptions-widget';
import { format } from 'date-fns';

// Define ColumnMenuTab type since it's not exported from DataTable
type ColumnMenuTab = 'filterMenuTab' | 'generalMenuTab' | 'columnsMenuTab';

// Define the Task type based on the existing usage
interface Task {
  id: string;
  title: string;
  priority: 'Blockers' | 'High' | 'Medium' | 'Low';
  program: string;
  type: string;
  due: string;
  status?: string;
  description?: string;
  assignedTo?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
  person?: string;
  message: string;
  date?: string;
  isAdmitted?: boolean;
}

// Add types for agenda
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'in-progress';
type AppointmentType = 'Initial Assessment' | 'Follow-up' | 'Medication Review' | 'Group Therapy' | 'Individual Therapy' | 'Crisis Intervention' | 'Telehealth';
type Program = 'Adult Mental Health' | 'Substance Use' | 'Child & Adolescent' | 'Crisis Services' | 'Dual Diagnosis' | 'IOP' | 'MAT Program';
type Category = 'Urgent' | 'Routine' | 'New Patient' | 'Established' | 'Walk-in';

interface AgendaEventType {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  facility: string;
  program: Program;
  appointmentType: AppointmentType;
  category: Category;
  person: string;
  copay: number;
  insuranceVerified?: boolean;
  paperworkComplete?: boolean;
  status: AppointmentStatus;
}

interface TaskDetailsPanelProps {
  blockId: string;
  tasks: Task[];
  onClose: () => void;
}

// Update message interface
interface Message {
  id: string;
  message: string;
  from: string;
  to?: string;
  person: string;
  type: string;
  date: string;
  status: string;
  assignedTo?: string;
}

const mockUrgentTasks: Task[] = [
  {
    id: 'crisis1',
    title: 'Crisis intervention needed',
    description: 'Patient reported severe anxiety symptoms during telehealth session. Immediate assessment and intervention required. Previous history of panic attacks.',
    message: 'Urgent: Patient experiencing acute anxiety symptoms - requires immediate telehealth follow-up',
    date: '2024-04-19 09:15 AM',
    priority: 'High' as const,
    due: 'Today',
    status: 'Pending',
    assignedTo: 'Lisa Thompson',
    person: 'John Doe',
    isAdmitted: true,
    type: 'Encounter',
    program: 'Behavioral Health'
  },
  {
    id: 'check1',
    title: 'Reminder: Check vitals',
    description: 'Critical patient requires immediate vital signs check. Blood pressure was elevated during last reading. Monitor for any changes in condition.',
    message: 'Follow-up required for elevated BP readings from morning check - Please review latest vitals',
    date: '2024-04-19 10:30 AM',
    priority: 'High' as const,
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe',
    isAdmitted: true,
    type: 'Admit/Discharge',
    program: 'Primary Care'
  },
  {
    id: 'assess1',
    title: 'High risk assessment',
    description: 'Patient reported concerning symptoms during last visit. Need immediate follow-up assessment. Family history of cardiac issues.',
    message: 'Urgent assessment needed - Patient reported chest pain during morning rounds',
    date: '2024-04-19 11:45 AM',
    priority: 'High' as const,
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe',
    isAdmitted: true,
    type: 'Encounter',
    program: 'Cardiology'
  },
  {
    id: 'med1',
    title: 'DrFirst: Controlled substance',
    description: 'New controlled substance prescription requires immediate review and approval. Check for drug interactions and verify dosage.',
    message: 'Pending controlled medication approval - Please review prescription details and patient history',
    date: '2024-04-19 01:20 PM',
    priority: 'High' as const,
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe',
    isAdmitted: true,
    type: 'Authorizations',
    program: 'Pharmacy'
  },
  {
    id: 'doc1',
    title: 'Document crisis plan',
    description: 'Update crisis intervention plan for high-risk patient. Recent changes in medication require documentation update.',
    message: 'Crisis plan needs immediate update - Recent medication changes must be documented',
    date: '2024-04-19 02:30 PM',
    priority: 'High' as const,
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe',
    isAdmitted: true,
    type: 'Encounter',
    program: 'Crisis Management'
  }
];

// Helper functions moved to top level
const getPriorityBadgeStyles = (priority: string) => {
  switch (priority) {
    case 'High':
      return "bg-red-50 text-red-700 border-red-200";
    case 'Medium':
      return "bg-amber-50 text-amber-700 border-amber-200";
    case 'Low':
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'Completed':
      return "bg-green-50 text-green-700 border-green-200";
    case 'In Progress':
      return "bg-blue-50 text-blue-700 border-blue-200";
    case 'Pending':
      return "bg-amber-50 text-amber-700 border-amber-200";
    case 'Overdue':
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const PRIORITY_LABELS: Record<string, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority'
};

// Add MobileHeader component for mobile view
const MobileHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-3 flex items-center gap-3">
    <button
      onClick={onBack}
      className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    </button>
    <h1 className="text-lg font-medium text-gray-900">{title}</h1>
  </div>
);

// Add TaskCard component for mobile view
const TaskCard: React.FC<{ task: any; onReply: (task: any) => void; onPersonClick: (person: string) => void }> = ({ 
  task, 
  onReply,
  onPersonClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm">
      {/* Title */}
      <div className="flex items-start gap-2 mb-3">
        <h3 
          className="text-base font-medium text-blue-600 hover:text-blue-800 flex-1 cursor-pointer" 
          onClick={() => onReply(task)}
        >
          {task.title || <span className="text-gray-400 italic">No subject</span>}
        </h3>
        <Badge variant="outline" className={cn('text-xs h-6 shrink-0 whitespace-nowrap', getPriorityBadgeStyles(task.priority))}>
          {PRIORITY_LABELS[task.priority?.toLowerCase()] || 'Unknown'}
        </Badge>
      </div>
      
      {/* Message */}
      <div 
        className={cn(
          "text-sm text-gray-600 mb-4",
          !isExpanded && "line-clamp-3"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="whitespace-pre-wrap break-words">
          {task.message || task.description}
        </p>
        {!isExpanded && (
          <button className="text-blue-600 hover:text-blue-800 text-xs mt-1">
            Show more
          </button>
        )}
      </div>
      
      {/* Meta Information */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
            {task.due || task.dueDate}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5 text-gray-400" />
            {task.assignedTo}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn('text-xs h-6', getStatusBadgeStyles(task.status))}>
            {task.status}
          </Badge>
          <div 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            onClick={() => onPersonClick(task.person)}
          >
            <User className="h-4 w-4 mr-1.5 text-blue-400" />
            {task.person}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-gray-100">
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => onReply(task)}
        >
          Reply
        </button>
        <button 
          className="text-gray-400 hover:text-gray-600 rounded-sm hover:bg-gray-50 p-1"
          title="Complete task"
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString: string, formatStr: string): string => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const formatTimeRange = (startTime: string, endTime: string, isAllDay?: boolean): string => {
  try {
    if (isAllDay) return 'All Day';
    if (!startTime || !endTime) return '-';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return '-';
  }
};

// Status badge component
const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
  const statusConfig = {
    'scheduled': { bg: 'bg-blue-50', text: 'text-blue-700', icon: ClockIcon },
    'completed': { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    'cancelled': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircleIcon },
    'no-show': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: XCircleIcon },
    'in-progress': { bg: 'bg-purple-50', text: 'text-purple-700', icon: ClockIcon }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
};

// Action buttons component
const ActionButtons: React.FC<{ data: AgendaEventType }> = ({ data }) => {
  return (
    <div className="flex items-center space-x-2">
      <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
        <EyeIcon className="w-4 h-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50">
        <PencilIcon className="w-4 h-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
        <TrashIcon className="w-4 h-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

// Add search input component
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// Add type for selection event
interface SelectionChangedEvent {
  api: {
    getSelectedNodes: () => Array<{
      data: Message | Task;
    }>;
  };
}

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ blockId, tasks, onClose }): JSX.Element => {
  console.log('TaskDetailsPanel rendered with blockId:', blockId); // Debug component mount

  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [showOnlyAdmitted, setShowOnlyAdmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessageTab, setActiveMessageTab] = useState<'inbox' | 'sent'>('inbox');
  const [messageFilter, setMessageFilter] = useState<'all' | 'my'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);

  // Updated agenda table definitions to match screenshot structure
  const agendaColumnDefs = [
    {
      headerName: 'Appointment Dt.',
      field: 'startTime',
      cellRenderer: (params: any) => formatDate(params.value, 'MMM dd, yyyy'),
      minWidth: 130,
    },
    {
      headerName: 'Start-End Time',
      field: 'startTime',
      cellRenderer: (params: any) => 
        formatTimeRange(params.data.startTime, params.data.endTime, params.data.isAllDay),
      minWidth: 150,
    },
    {
      headerName: 'Facility',
      field: 'facility',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Program',
      field: 'program',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Appt. Type',
      field: 'appointmentType',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Category',
      field: 'category',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Person',
      field: 'person',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-xs text-gray-600">
            {params.value?.charAt(0) || '?'}
          </div>
          {params.value || '-'}
        </div>
      ),
    },
    {
      headerName: 'CoPay',
      field: 'copay',
      cellRenderer: (params: any) => 
        typeof params.value === 'number' ? `$${params.value.toFixed(2)}` : '-',
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => params.value ? <StatusBadge status={params.value} /> : '-',
      minWidth: 130,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => <ActionButtons data={params.data} />,
      sortable: false,
      filter: false,
      minWidth: 150,
    },
  ];

  // Mock data for agenda view
  const mockAgendaData: AgendaEventType[] = [
    {
      id: '1',
      title: 'Initial Assessment - Depression',
      startTime: new Date(2024, 2, 20, 9, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 10, 30).toISOString(),
      facility: 'Main Campus',
      program: 'Adult Mental Health',
      appointmentType: 'Initial Assessment',
      category: 'New Patient',
      person: 'Sarah Johnson',
      copay: 40.00,
      insuranceVerified: true,
      paperworkComplete: false,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Medication Management',
      startTime: new Date(2024, 2, 20, 10, 0).toISOString(),
      endTime: new Date(2024, 2, 20, 10, 30).toISOString(),
      facility: 'West Wing',
      program: 'Adult Mental Health',
      appointmentType: 'Medication Review',
      category: 'Established',
      person: 'Michael Chen',
      copay: 25.00,
      insuranceVerified: true,
      paperworkComplete: true,
      status: 'in-progress'
    }
  ];

  // Update mock data type annotations
  const mockMessagesData: Message[] = [
    {
      id: 'm1',
      message: 'New lab results available for review - CBC shows elevated white count',
      from: 'Dr. Sarah Wilson',
      person: 'John Doe',
      type: 'Clinical',
      date: '2024-04-19 09:15 AM',
      status: 'Unread'
    },
    {
      id: 'm2',
      message: 'Patient requesting medication adjustment due to side effects',
      from: 'Lisa Thompson',
      person: 'Sarah Miller',
      type: 'Medication',
      date: '2024-04-19 10:30 AM',
      status: 'Read'
    },
    {
      id: 'm3',
      message: 'Schedule follow-up for medication review next week',
      from: 'Front Desk',
      person: 'Michael Klein',
      type: 'Appointment',
      date: '2024-04-19 11:45 AM',
      status: 'Unread'
    },
    {
      id: 'm4',
      message: 'Insurance verification needed for upcoming procedure',
      from: 'Billing Department',
      person: 'Emma Davis',
      type: 'Insurance',
      date: '2024-04-19 12:00 PM',
      status: 'Unread'
    },
    {
      id: 'm5',
      message: 'Patient reported adverse reaction to new medication',
      from: 'Nurse Johnson',
      person: 'Robert Wilson',
      type: 'Clinical',
      date: '2024-04-19 12:30 PM',
      status: 'Unread'
    },
    {
      id: 'm6',
      message: 'Family requesting care plan update discussion',
      from: 'Social Services',
      person: 'David Brown',
      type: 'Care Plan',
      date: '2024-04-19 1:15 PM',
      status: 'Read'
    },
    {
      id: 'm7',
      message: 'Urgent: Blood pressure readings outside normal range',
      from: 'Dr. Martinez',
      person: 'Patricia Moore',
      type: 'Clinical',
      date: '2024-04-19 1:45 PM',
      status: 'Unread'
    },
    {
      id: 'm8',
      message: 'Pharmacy requesting prescription clarification',
      from: 'Pharmacy',
      person: 'James Wilson',
      type: 'Medication',
      date: '2024-04-19 2:00 PM',
      status: 'Read'
    },
    {
      id: 'm9',
      message: 'Physical therapy progress report available',
      from: 'PT Department',
      person: 'Linda White',
      type: 'Clinical',
      date: '2024-04-19 2:30 PM',
      status: 'Unread'
    },
    {
      id: 'm10',
      message: 'Mental health assessment results ready for review',
      from: 'Dr. Thompson',
      person: 'George Brown',
      type: 'Assessment',
      date: '2024-04-19 3:00 PM',
      status: 'Read'
    },
    {
      id: 'm11',
      message: 'Dietary consultation recommendations updated',
      from: 'Nutrition Services',
      person: 'Susan Clark',
      type: 'Care Plan',
      date: '2024-04-19 3:30 PM',
      status: 'Unread'
    },
    {
      id: 'm12',
      message: 'Lab work authorization pending insurance approval',
      from: 'Lab Services',
      person: 'Thomas Anderson',
      type: 'Insurance',
      date: '2024-04-19 4:00 PM',
      status: 'Unread'
    }
  ];

  // Update mock data type annotations
  const mockSentMessagesData: Message[] = [
    {
      id: 's1',
      message: 'Treatment plan update for chronic condition management',
      from: 'You',
      to: 'Dr. Williams',
      person: 'John Doe',
      type: 'Care Plan',
      date: '2024-04-19 08:30 AM',
      status: 'Sent'
    },
    {
      id: 's2',
      message: 'Medication adjustment recommendation based on latest vitals',
      from: 'You',
      to: 'Dr. Martinez',
      person: 'Sarah Miller',
      type: 'Medication',
      date: '2024-04-19 09:45 AM',
      status: 'Sent'
    },
    {
      id: 's3',
      message: 'Patient discharge summary and follow-up plan',
      from: 'You',
      to: 'Care Team',
      person: 'Robert Wilson',
      type: 'Clinical',
      date: '2024-04-19 11:00 AM',
      status: 'Sent'
    }
  ];

  // Update filteredMessages to include status filter
  const filteredMessages = useMemo(() => {
    let filtered = activeMessageTab === 'inbox' ? mockMessagesData : mockSentMessagesData;
    
    // Apply message filter
    if (messageFilter === 'my') {
      filtered = filtered.filter(message => 
        message.from === 'You' || message.to === 'You' || message.assignedTo === 'You'
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => 
        statusFilter === 'unread' 
          ? message.status === 'Unread'
          : message.status === 'Read'
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(message => 
        message.message.toLowerCase().includes(query) ||
        message.from.toLowerCase().includes(query) ||
        message.person.toLowerCase().includes(query) ||
        message.type.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, messageFilter, statusFilter, activeMessageTab]);

  // Add bulk action handlers with void return type
  const handleBulkMarkAsRead = (): void => {
    console.log('Marking messages as read:', selectedMessages);
    // Here you would make an API call to update the messages
    setSelectedMessages([]); // Clear selection after action
  };

  const handleBulkMarkAsUnread = (): void => {
    console.log('Marking messages as unread:', selectedMessages);
    // Here you would make an API call to update the messages
    setSelectedMessages([]); // Clear selection after action
  };

  const handleBulkMarkAsDone = (): void => {
    console.log('Marking messages as done:', selectedMessages);
    // Here you would make an API call to update the messages
    setSelectedMessages([]); // Clear selection after action
  };

  // Add bulk delete handler
  const handleBulkDelete = (): void => {
    console.log('Deleting messages:', selectedMessages);
    // Here you would make an API call to delete the messages
    setSelectedMessages([]); // Clear selection after action
  };

  // Handle new message creation
  const handleNewMessage = (): void => {
    console.log('Opening new message dialog');
    // This would open a dialog to create a new message
    setIsMessageDialogOpen(true);
    setSelectedTask(null); // Clear any selected task for new message
  };

  // Handle inbox groups
  const handleInboxGroups = (): void => {
    console.log('Opening inbox groups');
    // This would open a dialog or navigate to inbox groups management
  };

  // Single onSelectionChanged handler for both messages and tasks
  const onSelectionChanged = (event: SelectionChangedEvent): void => {
    const selectedNodes = event.api.getSelectedNodes();
    if (blockId === 'messages') {
      setSelectedMessages(selectedNodes.map(node => node.data as Message));
    } else {
      setSelectedRows(selectedNodes.map(node => node.data as Task));
    }
  };

  // Update message column definitions
  const messageColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 48,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      suppressMenu: true,
      resizable: false
    },
    {
      headerName: 'Message',
      field: 'message',
      minWidth: 300,
      flex: 2,
      cellRenderer: (params: any) => (
        <div 
          className="text-sm text-gray-900 line-clamp-2 hover:line-clamp-none cursor-pointer py-2" 
          title={params.value}
          onClick={() => handleSendMessage(params.data)}
        >
          {params.value}
        </div>
      )
    },
    {
      headerName: 'From',
      field: 'from',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-5 w-5 mr-2 text-gray-600" />
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Person',
      field: 'person',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          onClick={() => handlePersonClick(params.value)}
          title={`View patient chart for ${params.value}`}
        >
          <User className="h-5 w-5 mr-2 text-gray-600" />
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Type',
      field: 'type',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => {
        const typeIconMap: { [key: string]: React.ReactNode } = {
          'Clinical': <FileCheck className="h-3.5 w-3.5" />,
          'Medication': <FileText className="h-3.5 w-3.5" />,
          'Appointment': <Calendar className="h-3.5 w-3.5" />
        };

        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              {typeIconMap[params.value] || <Layers className="h-3.5 w-3.5" />}
            </div>
            <span className="text-sm text-gray-600">{params.value}</span>
          </div>
        );
      }
    },
    {
      headerName: 'Date',
      field: 'date',
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge 
          variant="outline" 
          className={cn(
            "text-sm h-6",
            params.value === 'Unread' 
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          {params.value}
        </Badge>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 120,
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex justify-end gap-2">
          <button 
            className="text-gray-400 hover:text-amber-600 p-2 rounded-sm hover:bg-amber-50"
            title="Mark as Client Grievance"
            onClick={() => console.log('Mark as grievance:', params.data.id)}
          >
            <FileWarning className="h-6 w-6 text-amber-500 hover:text-amber-600" />
          </button>
          <button 
            className="text-gray-400 hover:text-blue-600 p-2 rounded-sm hover:bg-blue-50"
            title="Mark as read"
            onClick={() => console.log('Mark as read:', params.data.id)}
          >
            <EyeIcon className="h-6 w-6 text-blue-500 hover:text-blue-600" />
          </button>
        </div>
      )
    }
  ];

  // Define the tasks to display based on blockId
  const displayTasks = useMemo(() => {
    return tasks.filter(task => {
    if (showOnlyAdmitted) {
        return task.isAdmitted;
    }
      return true;
    });
  }, [tasks, showOnlyAdmitted]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
    if (!isResizing) return;
    
      const newWidth = initialWidth + (e.clientX - initialX);
      if (newWidth >= 400 && newWidth <= 800) {
    setWidth(newWidth);
      }
    },
    [isResizing, initialWidth, initialX]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setInitialX(e.clientX);
    setInitialWidth(width || 400);
  }, [width]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setWidth(null);
  };

  // Helper functions from AllTasksSection
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reminder':
        return <Bell className="h-4 w-4" />;
      case 'Review Form':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'Agenda':
        return <Calendar className="h-4 w-4" />;
      case 'Review Prescriptions':
        return <FileText className="h-4 w-4" />;
      case 'Message':
        return <MessageSquare className="h-4 w-4" />;
      case 'Assessment':
        return <BarChart2 className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const getBlockTitle = (id: string) => {
    const titles: { [key: string]: string } = {
      'assigned-to-me': 'Assigned to Me',
      'needs-review': 'Review Forms',
      'needs-review-medium': 'Review Forms',
      'expedite-queue': 'Urgent Tasks',
      'suggested-actions': 'All Reminders',
      'agenda': 'Agenda',
      'fyi-zone': 'Birthdays',
      'prescriptions': 'Review Prescriptions',
      'aging-tasks': 'Pending Too Long',
      'transaction-reviews': 'Transaction Reviews',
      'treatment-reviews': 'Treatment Reviews',
      'messages': 'Messages'
    };
    return titles[id] || 'Tasks';
  };

  // --- Recipient name mapping for 'Received from' column ---
  // This should match logic from NewTaskDialog and use the same mockRecipients if possible.
  // For now, fallback to showing assignedTo, person, or 'System'.
  function getReceivedFrom(task: any) {
    // Prefer assignedTo, fallback to person, then 'System'
    return task.assignedTo || task.person || 'System';
  }

  // Handle send message click
  const handleSendMessage = (task: Task) => {
    console.log('handleSendMessage called with blockId:', blockId, 'task:', task);
    setSelectedTask(task);
    
    if (blockId === 'messages') {
      console.log('Opening NewMessageDialog for messages block');
      setIsMessageDialogOpen(true);
    } else {
      console.log('Opening NewTaskDialog for non-messages block');
      setIsTaskDialogOpen(true);
    }
  };
  
  // Navigate to patient chart when clicking on a person
  const handlePersonClick = (personName: string) => {
    // Simple mapping of person names to sequential patient IDs
    // In a real application, this would come from your data source
    const personToPatientIdMap: Record<string, string> = {
      'John Doe': '1',
      'Sarah Miller': '2',
      'Michael Klein': '3',
      'Lisa Thompson': '4',
      'Robert Johnson': '5',
      'David Williams': '6',
      'Emma Wilson': '7',
      'James Wilson': '8',
      'Carlos Rodriguez': '9',
      'Group A Patients': '10',
      'Anxiety Support Group': '11'
    };
    
    // Get the patientId from the mapping, or use a fallback of '1' if not found
    const patientId = personToPatientIdMap[personName] || '1';
    
    // Navigate to the patient chart with the correct path
    navigate(`/patient-chart/${patientId}`);
  };

  // Handle complete selected tasks
  const handleCompleteSelected = () => {
    // Here you would typically make an API call to update the tasks
    // For now, we'll just log the completed tasks
    console.log('Completing tasks:', selectedRows);
    
    // Clear selection after completion
    setSelectedRows([]);
  };

  const columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      colId: 'checkbox',
      width: 35,
      minWidth: 35,
      maxWidth: 35,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left' as const,
      resizable: false,
      menuTabs: [] as ColumnMenuTab[],
      suppressMenu: true
    },
    {
      headerName: 'Subject',
      field: 'title',
      colId: 'title',
      minWidth: 200,
      cellRenderer: (params: any) => (
        <div 
          className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600" 
          onClick={() => handleSendMessage(params.data)}
          title={params.data.title || 'No subject'}
        >
          {params.data.title || <span className="text-gray-400 italic">No subject</span>}
        </div>
      )
    },
    {
      headerName: 'Message',
      field: 'message',
      colId: 'message',
      minWidth: 250,
      cellRenderer: (params: any) => {
        const messageText = params.data.description || params.data.message || 'No message';
        
        return (
          <div 
            className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none cursor-pointer py-2" 
            title={messageText}
          >
            {messageText}
          </div>
        );
      }
    },
    {
      headerName: 'Type',
      field: 'type',
      minWidth: 150,
      cellRenderer: (params: any) => {
        const typeIconMap: { [key: string]: React.ReactNode } = {
          'Admit/Discharge': <BedDouble className="h-3.5 w-3.5" />,
          'Appointment': <Calendar className="h-3.5 w-3.5" />,
          'Authorizations': <FileCheck className="h-3.5 w-3.5" />,
          'Billing alerts': <AlertCircle className="h-3.5 w-3.5" />,
          'Billing statement': <Receipt className="h-3.5 w-3.5" />,
          'Deceased': <Skull className="h-3.5 w-3.5" />,
          'Encounter': <UserRound className="h-3.5 w-3.5" />
        };

        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              {typeIconMap[params.value] || <Layers className="h-3.5 w-3.5" />}
            </div>
            <span className="text-sm text-gray-600">{params.value}</span>
          </div>
        );
      }
    },
    {
      headerName: 'Priority',
      field: 'priority',
      minWidth: 120,
      cellRenderer: (params: any) => {
        // For URGENT TASKS (expedite-queue), always show High Priority
        if (blockId === 'expedite-queue') {
          return (
            <Badge 
              variant="outline" 
              className={cn("text-sm h-6", getPriorityBadgeStyles('High'))}
            >
              High Priority
            </Badge>
          );
        }
        // Enforce only the 3 allowed priorities
        const value = (params.data.priority || '').toLowerCase();
        const label = PRIORITY_LABELS[value] || 'Unknown';
        return (
          <Badge 
            variant="outline" 
            className={cn("text-sm h-6", getPriorityBadgeStyles(label.replace(' Priority','')))}
          >
            {label}
          </Badge>
        );
      }
    },
    {
      headerName: 'Due',
      field: 'due',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          {params.data.due}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <Badge 
          variant="outline" 
          className={cn("text-sm h-6", getStatusBadgeStyles(params.data.status || 'Pending'))}
        >
          {params.data.status || 'Pending'}
        </Badge>
      )
    },
    {
      headerName: 'Received from',
      field: 'assignedTo',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-5 w-5 mr-2 text-gray-600" />
          {getReceivedFrom(params.data)}
        </div>
      )
    },
    {
      headerName: 'Person',
      field: 'person',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          onClick={() => handlePersonClick(params.value)}
          title={`View patient chart for ${params.value}`}
        >
          <User className="h-5 w-5 mr-2 text-gray-600" />
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      colId: 'actions',
      minWidth: 120,
      resizable: false,
      menuTabs: [] as ColumnMenuTab[],
      suppressMenu: true,
      cellRenderer: (params: any) => (
        <div className="flex gap-1 justify-end">
          <Button 
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 px-2 py-0.5 text-xs h-6"
            onClick={() => handleSendMessage(params.data)}
          >
            Reply
          </Button>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50"
            title="Complete task"
          >
            <CheckCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  const renderContent = (): JSX.Element => {
    console.log('renderContent called with blockId:', blockId);

    if (blockId === 'messages') {
      console.log('Attempting to render messages table');
      return (
        <div className="h-full p-4">
          {/* Message Tabs */}
          <div className="mb-4 border-b">
            <div className="flex gap-4">
              <button
                className={cn(
                  "pb-2 text-sm font-medium relative",
                  activeMessageTab === 'inbox'
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setActiveMessageTab('inbox')}
              >
                Inbox
                {activeMessageTab === 'inbox' && mockMessagesData.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {mockMessagesData.length}
                  </span>
                )}
              </button>
              <button
                className={cn(
                  "pb-2 text-sm font-medium relative",
                  activeMessageTab === 'sent'
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setActiveMessageTab('sent')}
              >
                Sent
                {activeMessageTab === 'sent' && mockSentMessagesData.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {mockSentMessagesData.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="mb-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by message, person, or notes..."
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {/* Message Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Show:</span>
                <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      messageFilter === 'all'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMessageFilter('all')}
                  >
                    All Messages
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      messageFilter === 'my'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMessageFilter('my')}
                  >
                    My Messages
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      statusFilter === 'all'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      statusFilter === 'unread'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setStatusFilter('unread')}
                  >
                    Unread
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      statusFilter === 'read'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setStatusFilter('read')}
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedMessages.length > 0 && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  onClick={handleBulkMarkAsRead}
                >
                  <EyeIcon className="w-4 h-4 mr-1.5" />
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-700 hover:bg-blue-100"
                  onClick={handleBulkMarkAsUnread}
                >
                  <EyeIcon className="w-4 h-4 mr-1.5" />
                  Mark as Unread
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-blue-100"
                  onClick={handleBulkMarkAsDone}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Mark as Done
                </Button>
                <div className="w-px h-6 bg-blue-200 mx-2" /> {/* Separator */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleBulkDelete}
                  title="Delete selected messages"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <DataTable
            rowData={filteredMessages}
            columnDefs={messageColumnDefs}
            gridOptions={{
              rowHeight: 48,
              headerHeight: 48,
              suppressMenuHide: true,
              paginationPageSize: 15,
              defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true
              },
              rowSelection: 'multiple',
              onSelectionChanged: onSelectionChanged
            }}
            className="rounded-lg border border-gray-200"
          />
        </div>
      );
    }

    if (blockId === 'needs-review' || blockId === 'treatment-reviews' || blockId === 'needs-review-medium') {
      console.log('Rendering Review Forms Widget');
      return <ReviewFormsWidget />;
    }
    
    if (blockId === 'prescriptions') {
      console.log('Rendering Prescriptions Widget');
      return <ReviewPrescriptionsWidget />;
    }

    if (blockId === 'agenda') {
      console.log('Rendering Agenda');
      return (
        <div className="h-full p-4">
          <DataTable
            rowData={mockAgendaData}
            columnDefs={agendaColumnDefs}
            gridOptions={{
              rowHeight: 48,
              headerHeight: 48,
              suppressMenuHide: true,
              paginationPageSize: 15,
            }}
            className="rounded-lg border border-gray-200"
          />
        </div>
      );
    }

    if (blockId === 'treatment-plans' || blockId === 'transaction-reviews') {
      console.log('Rendering Coming Soon');
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-4xl text-gray-300 mb-4">🚧</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon!</h3>
          <p className="text-gray-500">
            {blockId === 'treatment-plans' ? 'Treatment Plans' : 'Treatment Reviews'} same as Review Forms.
          </p>
        </div>
      );
    }

    // Default return for tasks
    console.log('Rendering default tasks view');
    return (
      <>
        {displayTasks.length > 0 ? (
          <div className="w-full h-[calc(100vh-200px)]">
            {/* Desktop View */}
            <div className="hidden sm:block h-full overflow-x-auto">
              <div className="min-w-[1200px] h-full">
              <DataTable
                rowData={displayTasks}
                columnDefs={columnDefs}
                className="w-full h-full rounded-lg"
                gridOptions={{
                  suppressCellFocus: true,
                  animateRows: true,
                  pagination: true,
                  paginationPageSize: 10,
                  domLayout: 'autoHeight',
                  rowHeight: 48,
                  headerHeight: 40,
                  rowSelection: 'multiple',
                    onSelectionChanged: onSelectionChanged,
                    defaultColDef: {
                      sortable: true,
                      filter: 'agTextColumnFilter',
                      menuTabs: ['filterMenuTab'] as ColumnMenuTab[],
                      filterParams: {
                        buttons: ['reset', 'apply'],
                        closeOnApply: true
                      },
                      resizable: true,
                      flex: 1
                    }
                }}
              />
              </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
              {displayTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  onReply={handleSendMessage}
                  onPersonClick={handlePersonClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-48">
            <Layers className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">No tasks found in this category.</p>
          </div>
        )}
      </>
    );
  };

  // Get block title (existing function)
  const blockTitle = getBlockTitle(blockId);

  // Move renderHeader function definition before it's used
  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2.5 border-b sticky top-0 bg-white z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-gray-900">{blockTitle}</h2>
        {blockId === 'messages' && (
          <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
            {filteredMessages.length} {activeMessageTab === 'inbox' ? 'messages' : 'sent'}
          </Badge>
        )}
        {blockId !== 'messages' && 
         blockId !== 'needs-review' && 
         blockId !== 'needs-review-medium' && 
         blockId !== 'prescriptions' && (
          <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
            {displayTasks.length} tasks
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Message Action Buttons - Only show for messages */}
        {blockId === 'messages' && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleNewMessage}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleInboxGroups}
            >
              <Users className="w-4 h-4 mr-2" />
              Inbox Groups
            </Button>
          </div>
        )}
        {blockId !== 'needs-review' && 
         blockId !== 'needs-review-medium' &&
         blockId !== 'transaction-reviews' && 
         blockId !== 'prescriptions' &&
         blockId !== 'agenda' && 
         blockId !== 'messages' && (
          <div className="flex items-center gap-2">
            <Switch
              checked={showOnlyAdmitted}
              onCheckedChange={setShowOnlyAdmitted}
              id="admitted-filter"
            />
            <label 
              htmlFor="admitted-filter" 
              className="text-sm text-gray-600 flex items-center gap-1.5 cursor-pointer"
            >
              <BedDouble className="w-4 h-4" />
              Admitted Patients Only
            </label>
          </div>
        )}
        {selectedRows.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
            onClick={handleCompleteSelected}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Complete ({selectedRows.length})
          </Button>
        )}
        <button
          onClick={toggleFullScreen}
          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50"
          title={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50"
          title="Close panel"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Main render
  console.log('Before main render, blockId:', blockId); // Debug before return

  if (isMobile) {
    console.log('Rendering mobile view');
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <MobileHeader title={blockTitle} onBack={onClose} />
        
        <div className="pt-16 pb-4 px-4">
          {/* Add filter toggle for mobile */}
          {blockId !== 'needs-review' && 
           blockId !== 'transaction-reviews' && 
           blockId !== 'agenda' && 
           blockId !== 'messages' && (
            <div className="flex items-center gap-2 mb-4 px-2">
              <Switch
                checked={showOnlyAdmitted}
                onCheckedChange={setShowOnlyAdmitted}
                id="admitted-filter-mobile"
              />
              <label 
                htmlFor="admitted-filter-mobile" 
                className="text-sm text-gray-600 flex items-center gap-1.5"
              >
                <BedDouble className="w-4 h-4" />
                Admitted Patients Only
              </label>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    );
  }

  // Desktop view (existing code)
  return (
      <div 
        className={cn(
        "fixed top-0 right-0 h-screen bg-white border-l shadow-lg transition-all duration-300 ease-in-out z-50",
        isFullScreen ? "w-full" : "relative"
        )}
        style={!isFullScreen ? { 
          width: width || window.innerWidth * 0.7,
          minWidth: `${Math.max(400, window.innerWidth * 0.3)}px`,
        maxWidth: '90vw'
        } : undefined}
      >
        {!isFullScreen && (
          <div
            className="absolute left-0 top-0 bottom-0 w-6 cursor-ew-resize hover:bg-blue-200/20 transition-colors group z-20"
            onMouseDown={startResizing}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {renderHeader()}

      <div className="h-[calc(100vh-64px)] overflow-y-auto">
            {renderContent()}
      </div>
      
      {/* Message Dialog */}
      <NewMessageDialog
        open={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        task={selectedTask}
      />
      
      {/* Task Dialog */}
      <NewTaskDialog
        open={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default TaskDetailsPanel; 