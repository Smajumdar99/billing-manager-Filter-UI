import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types/task';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
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
  CheckCircle
} from 'lucide-react';
import { ReviewFormsWidget } from './widgets/ReviewFormsWidget/review-forms-widget';
import { TransactionsReviewsWidget } from './widgets/TransactionsReviewsWidget/transactions-reviews-widget';
import { NewTaskDialog } from './molecules/NewTaskDialog/new-task-dialog';

interface TaskDetailsPanelProps {
  blockId: string;
  tasks: Task[];
  onClose: () => void;
}

const mockUrgentTasks = [
  {
    id: 'crisis1',
    title: 'Crisis intervention needed',
    description: 'Patient reported severe anxiety symptoms during telehealth session. Immediate assessment and intervention required. Previous history of panic attacks.',
    message: 'Urgent: Patient experiencing acute anxiety symptoms - requires immediate telehealth follow-up',
    date: '2024-04-19 09:15 AM',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    assignedTo: 'Lisa Thompson',
    person: 'John Doe'
  },
  {
    id: 'check1',
    title: 'Reminder: Check vitals',
    description: 'Critical patient requires immediate vital signs check. Blood pressure was elevated during last reading. Monitor for any changes in condition.',
    message: 'Follow-up required for elevated BP readings from morning check - Please review latest vitals',
    date: '2024-04-19 10:30 AM',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe'
  },
  {
    id: 'assess1',
    title: 'High risk assessment',
    description: 'Patient reported concerning symptoms during last visit. Need immediate follow-up assessment. Family history of cardiac issues.',
    message: 'Urgent assessment needed - Patient reported chest pain during morning rounds',
    date: '2024-04-19 11:45 AM',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe'
  },
  {
    id: 'med1',
    title: 'DrFirst: Controlled substance',
    description: 'New controlled substance prescription requires immediate review and approval. Check for drug interactions and verify dosage.',
    message: 'Pending controlled medication approval - Please review prescription details and patient history',
    date: '2024-04-19 01:20 PM',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe'
  },
  {
    id: 'doc1',
    title: 'Document crisis plan',
    description: 'Update crisis intervention plan for high-risk patient. Recent changes in medication require documentation update.',
    message: 'Crisis plan needs immediate update - Recent medication changes must be documented',
    date: '2024-04-19 02:30 PM',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    assignedTo: 'System',
    person: 'John Doe'
  }
];

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ blockId, tasks, onClose }) => {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Define the tasks to display based on blockId
  const displayTasks = useMemo(() => {
    if (blockId === 'expedite-queue') {
      return mockUrgentTasks;
    }
    return tasks;
  }, [blockId, tasks]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const dx = e.clientX - initialX;
    // Allow resizing between 30% and 90% of viewport width
    const minWidth = Math.max(400, window.innerWidth * 0.3);
    const maxWidth = window.innerWidth * 0.9;
    const newWidth = Math.max(minWidth, Math.min(initialWidth - dx, maxWidth));
    
    setWidth(newWidth);
  }, [isResizing, initialX, initialWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setInitialX(e.clientX);
    // Set initial width to current width or 70% of viewport width
    setInitialWidth(width || e.currentTarget.parentElement?.getBoundingClientRect().width || window.innerWidth * 0.7);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setWidth(null);
  };

  // Helper functions from AllTasksSection
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
      'expedite-queue': 'Urgent Tasks',
      'suggested-actions': 'All Reminders',
      'agenda': 'Agenda',
      'fyi-zone': 'Birthdays',
      'prescriptions': 'Review Prescriptions',
      'aging-tasks': 'Pending Too Long',
      'transaction-reviews': 'Transaction Reviews'
    };
    return titles[id] || 'Tasks';
  };

  // --- Priority label mapping for table display ---
  const PRIORITY_LABELS: Record<string, string> = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
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

  const columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      colId: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left' as const
    },
    {
      headerName: 'Subject',
      field: 'title',
      colId: 'title',
      flex: 1.5,
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
      flex: 2,
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
    // Category column removed as per UX simplification request (2025-04-18)
    // {
    //   headerName: 'Category',
    //   field: 'type',
    //   colId: 'type',
    //   flex: 1,
    //   cellRenderer: (params: any) => (
    //     <div className="flex items-center">
    //       <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
    //         {getCategoryIcon(params.data.type)}
    //       </div>
    //       <span className="text-sm text-gray-600">{params.data.type}</span>
    //     </div>
    //   )
    // },
    {
      headerName: 'Priority',
      field: 'priority',
      flex: 1,
      // Only display allowed priorities, and map to label
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
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {params.data.due}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
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
      flex: 1,
      // Use consistent mapping as in dialog
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {/* Use getReceivedFrom to match dialog logic */}
          {getReceivedFrom(params.data)}
        </div>
      )
    },
    {
      headerName: 'Person',
      field: 'person',
      flex: 1,
      cellRenderer: (params: any) => (
        <div 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          onClick={() => handlePersonClick(params.data.person || 'John Doe')}
          title={`View patient chart for ${params.data.person || 'John Doe'}`}
        >
          <User className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {params.data.person || 'John Doe'}
        </div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      colId: 'actions',
      flex: 1,
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
    if (blockId === 'needs-review') {
      return <ReviewFormsWidget />;
    }
    
    if (blockId === 'transaction-reviews') {
      return <TransactionsReviewsWidget />;
    }

    return (
      <>
        {displayTasks.length > 0 ? (
          <div className="w-full h-[calc(100vh-200px)]">
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
                suppressHorizontalScroll: true
              }}
            />
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

  return (
    <>
      <div 
        className={cn(
          "bg-white overflow-y-auto transition-all duration-300",
          isFullScreen ? "fixed inset-0 z-50" : "h-full relative"
        )}
        style={!isFullScreen ? { 
          width: width || window.innerWidth * 0.7,
          minWidth: `${Math.max(400, window.innerWidth * 0.3)}px`,
          maxWidth: isFullScreen ? '100%' : '90vw'
        } : undefined}
      >
        {/* Resize handle with improved grab area */}
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

        <div className="flex justify-between items-center px-4 py-2.5 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-900">{getBlockTitle(blockId)}</h2>
            {blockId !== 'needs-review' && (
              <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
                {displayTasks.length} tasks
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
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

        <div className="p-2 sm:p-1">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Message Dialog */}
      <NewTaskDialog 
        isOpen={isMessageDialogOpen} 
        onClose={() => setIsMessageDialogOpen(false)}
        initialPerson={selectedTask?.person}
        // Pass the selected task for reply context
        task={selectedTask}
      />
    </>
  );
};

export default TaskDetailsPanel; 