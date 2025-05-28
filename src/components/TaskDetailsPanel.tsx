import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import { Switch } from '@/components/atoms/Switch';
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
} from 'lucide-react';
import { ReviewFormsWidget } from './widgets/ReviewFormsWidget/review-forms-widget';
import { NewTaskDialog } from './molecules/NewTaskDialog/new-task-dialog';
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

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ blockId, tasks, onClose }) => {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [showOnlyAdmitted, setShowOnlyAdmitted] = useState(false);

  // Agenda table definitions
  const agendaColumnDefs = [
    {
      headerName: 'Appointment Date',
      field: 'startTime',
      cellRenderer: (params: any) => formatDate(params.value, 'MMM dd, yyyy'),
      minWidth: 130,
    },
    {
      headerName: 'Time',
      field: 'startTime',
      cellRenderer: (params: any) => 
        formatTimeRange(params.data.startTime, params.data.endTime, params.data.isAllDay),
      minWidth: 150,
    },
    {
      headerName: 'Program',
      field: 'program',
      minWidth: 120,
      cellRenderer: (params: any) => params.value || '-',
    },
    {
      headerName: 'Type',
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
      headerName: 'Copay',
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
      headerName: 'Insurance',
      field: 'insuranceVerified',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className={`text-sm ${params.value ? 'text-green-600' : 'text-red-600'}`}>
          {params.value ? '✓ Verified' : '⚠ Pending'}
        </div>
      )
    },
    {
      headerName: 'Paperwork',
      field: 'paperworkComplete',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className={`text-sm ${params.value ? 'text-green-600' : 'text-yellow-600'}`}>
          {params.value ? '✓ Complete' : '⚠ Incomplete'}
        </div>
      )
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
      'treatment-reviews': 'Treatment Reviews'
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
    setSelectedTask(task);
    setIsMessageDialogOpen(true);
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

  // Handle row selection
  const onSelectionChanged = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes();
    setSelectedRows(selectedNodes.map((node: any) => node.data));
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
          onClick={() => handlePersonClick(params.data.person || 'John Doe')}
          title={`View patient chart for ${params.data.person || 'John Doe'}`}
        >
          <User className="h-5 w-5 mr-2 text-gray-600" />
          {params.data.person || 'John Doe'}
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

  const renderContent = () => {
    if (blockId === 'needs-review' || blockId === 'treatment-reviews' || blockId === 'needs-review-medium') {
      return <ReviewFormsWidget />;
    }

    if (blockId === 'prescriptions') {
      return <ReviewPrescriptionsWidget />;
    }

    if (blockId === 'agenda') {
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

  // Update the header section to include the filter toggle
  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2.5 border-b sticky top-0 bg-white z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-gray-900">{blockTitle}</h2>
        {blockId !== 'needs-review' && 
         blockId !== 'needs-review-medium' && 
         blockId !== 'prescriptions' && (
          <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
            {displayTasks.length} tasks
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-4">
        {blockId !== 'needs-review' && 
         blockId !== 'needs-review-medium' &&
         blockId !== 'transaction-reviews' && 
         blockId !== 'prescriptions' &&
         blockId !== 'agenda' && 
         blockId !== 'message' && (
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <MobileHeader title={blockTitle} onBack={onClose} />
        
        <div className="pt-16 pb-4 px-4">
          {/* Add filter toggle for mobile */}
          {blockId !== 'needs-review' && 
           blockId !== 'transaction-reviews' && 
           blockId !== 'agenda' && 
           blockId !== 'message' && (
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
        {blockId === 'needs-review' || blockId === 'treatment-reviews' || blockId === 'needs-review-medium' ? (
          <ReviewFormsWidget />
        ) : blockId === 'prescriptions' ? (
          <ReviewPrescriptionsWidget />
        ) : blockId === 'treatment-plans' || blockId === 'transaction-reviews' ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-4xl text-gray-300 mb-4">🚧</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon!</h3>
            <p className="text-gray-500">
              {blockId === 'treatment-plans' ? 'Treatment Plans' : 'Treatment Reviews'} same as Review Forms.
            </p>
          </div>
        ) : blockId === 'agenda' ? (
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
        ) : (
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
        )}
      </div>
      
      {/* Message Dialog */}
      <NewTaskDialog
        open={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default TaskDetailsPanel; 