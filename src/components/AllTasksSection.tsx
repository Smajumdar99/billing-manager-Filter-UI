import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
  DocumentTextIcon,
  CalendarIcon,
  DocumentCheckIcon,
  PresentationChartLineIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel
} from '@/components/ui/menubar';

// Task interface for the table
interface Task {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  program: string;
  person: string;
}

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Billable Encounter (100209919)',
    message: 'has no Insurance coverage for the Person Sin Chan (1004918)',
    date: '04/11/2025 02:09:00',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Ensoftek Admin',
    status: 'Pending',
    program: 'Insurance Review',
    person: 'Sin Chan'
  },
  {
    id: '2',
    title: 'Your Participant has checked-in',
    message: 'for following Group Meeting Group session: Eisenberg form Facility: A-AADO (A-AADO) Session date: 04/11/2025 Session Time: 04:00 PM to 04:59 PM',
    date: '04/11/2025',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'System',
    status: 'Completed',
    program: 'Group Sessions',
    person: 'Eisenberg'
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `${i + 3}`,
    title: `Task Title ${i + 3}`,
    message: `Task message for task ${i + 3}`,
    date: `04/1${Math.floor(i/2)+1}/2025`,
    priority: ['High','Medium','Low'][i%3] as 'High'|'Medium'|'Low',
    dueDate: ['Today','Tomorrow','Overdue'][i%3],
    assignedTo: ['Ensoftek Admin','System','John Doe'][i%3],
    status: ['Pending','Completed','In Progress'][i%3],
    program: ['Insurance Review','Group Sessions','Form Review'][i%3],
    person: ['Sin Chan','Eisenberg','John Doe'][i%3]
  }))
];

// Helper to get priority badge styles
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

// Helper to get status badge styles
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

/**
 * AllTasksSection Component
 * 
 * A collapsible section that displays all tasks in a tabular format.
 * Includes filtering and search functionality.
 */
const AllTasksSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter tasks based on search query and active filter
  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.program.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
        task.priority.toLowerCase() === activeFilter.toLowerCase() ||
        task.status.toLowerCase() === activeFilter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      colId: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    {
      headerName: 'Task',
      field: 'title',
      colId: 'title',
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="text-sm font-medium text-gray-900 truncate" title={params.data.title}>
          {params.data.title}
        </div>
      )
    },
    {
      headerName: 'Priority',
      field: 'priority',
      flex: 1,
      cellRenderer: (params: any) => {
        const value = (params.data.priority || '').toLowerCase();
        const label = PRIORITY_LABELS[value] || 'Unknown';
        return (
          <Badge variant="outline" className={cn('text-sm h-6', getPriorityBadgeStyles(params.data.priority))}>
            {label}
          </Badge>
        );
      }
    },
    {
      headerName: 'Due',
      field: 'dueDate',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {params.data.dueDate}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className={cn('text-sm h-6', getStatusBadgeStyles(params.data.status))}>
          {params.data.status}
        </Badge>
      )
    },
    {
      headerName: 'Received from',
      field: 'assignedTo',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {params.data.assignedTo}
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
          tabIndex={0}
          role="button"
          title={`View patient chart for ${params.data.person}`}
        >
          <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {params.data.person}
        </div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex gap-2 items-center justify-end">
          <button
            className="text-blue-600 hover:text-blue-800 text-xs font-medium underline px-1 py-0.5"
            tabIndex={0}
            title="Reply to task"
          >
            Reply
          </button>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50"
            title="Complete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-2">
      <div 
        className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">All Tasks</h2>
          <div className="ml-2 p-1 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* Search and Filter Controls */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Menubar className="bg-white border rounded-lg px-2 py-1">
              <MenubarMenu>
                <MenubarTrigger>Filters</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => setActiveFilter('all')}>
                    All
                  </MenubarItem>
                  <MenubarItem onClick={() => setActiveFilter('High')}>
                    High Priority
                  </MenubarItem>
                  <MenubarItem onClick={() => setActiveFilter('Overdue')}>
                    Overdue
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarLabel>Category</MenubarLabel>
                  {['Reminder', 'Review Form', 'Agenda', 'Review Prescriptions', 'Message', 'Assessment', 'Other'].map(category => (
                    <MenubarItem key={category} onClick={() => setActiveFilter(category)}>
                      {category}
                    </MenubarItem>
                  ))}
                  <MenubarSeparator />
                  <MenubarLabel>Status</MenubarLabel>
                  {['Pending', 'In Progress', 'Completed', 'Overdue'].map(status => (
                    <MenubarItem key={status} onClick={() => setActiveFilter(status)}>
                      {status}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          
          {/* Tasks Table */}
          {filteredTasks.length > 0 ? (
            <div className="w-full h-[calc(100vh-350px)]">
              <DataTable
                rowData={filteredTasks}
                columnDefs={columnDefs}
                className="w-full h-full rounded-lg"
                gridOptions={{
                  suppressCellFocus: true,
                  animateRows: true,
                  pagination: true,
                  paginationPageSize: 20,
                  domLayout: 'autoHeight',
                  rowHeight: 48,
                  headerHeight: 40,
                  suppressHorizontalScroll: true
                }}
              />
              
              <div className="flex justify-between items-center text-sm text-gray-500 px-2 mt-4">
                <div>
                  Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center gap-1"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add New Task
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48">
              <RectangleStackIcon className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">
                {searchQuery.trim() 
                  ? `No tasks found matching "${searchQuery}"` 
                  : "No tasks found for the selected filter."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllTasksSection;
