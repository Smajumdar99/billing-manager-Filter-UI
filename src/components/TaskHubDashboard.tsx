import React, { useState } from 'react';
import { 
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Task interface for detailed list
interface Task {
  id: string;
  title: string;
  priority: 'Blockers' | 'High' | 'Medium' | 'Low';
  program: string;
  type?: 'Reminder' | 'Messages' | 'Dr First Notifications' | 'Review Forms' | 'Birthdays' | 'Agenda' | 'Assessment' | 'Medication' | 'Treatment' | 'Insurance' | 'Clinical' | 'Administrative' | 'Transaction Reviews';
  due: string;
}

type GroupByOption = 'Priority' | 'Program' | 'Type' | 'Due';

interface TaskHubDashboardProps {
  tasks: Task[];
  onGroupChange: (group: GroupByOption) => void;
  groupBy: GroupByOption;
}

const TaskHubDashboard: React.FC<TaskHubDashboardProps> = ({ 
  tasks, 
  onGroupChange, 
  groupBy 
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const initialTasksToShow = 20;
  // State to track if Quick Glance section is expanded, default to collapsed
  const [isQuickGlanceExpanded, setIsQuickGlanceExpanded] = useState(false);

  // Toggle group expansion
  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Toggle Quick Glance section expansion
  const toggleQuickGlanceExpansion = () => {
    setIsQuickGlanceExpanded(prev => !prev);
  };

  // Group tasks by the selected grouping
  const getGroupedTasks = () => {
    switch (groupBy) {
      case 'Priority': {
        const grouped: Record<string, Task[]> = {
          'Blockers': [],
          'High': [],
          'Medium': [],
          'Low': []
        };
        
        tasks.forEach(task => {
          grouped[task.priority].push(task);
        });
        
        return grouped;
      }
      case 'Program': {
        const grouped: Record<string, Task[]> = {};
        
        // First pass to identify all unique programs
        tasks.forEach(task => {
          if (!grouped[task.program]) {
            grouped[task.program] = [];
          }
        });
        
        // Second pass to populate groups
        tasks.forEach(task => {
          grouped[task.program].push(task);
        });
        
        return grouped;
      }
      case 'Type': {
        const grouped: Record<string, Task[]> = {
          'Reminder': [],
          'Messages': [],
          'Dr First Notifications': [],
          'Review Forms': [],
          'Transaction Reviews': [],
          'Birthdays': [],
          'Agenda': [],
          'Assessment': [],
          'Medication': [],
          'Treatment': [],
          'Insurance': [],
          'Clinical': [],
          'Administrative': []
        };
        
        tasks.forEach(task => {
          if (task.type) {
            grouped[task.type].push(task);
          }
        });
        
        return grouped;
      }
      case 'Due': {
        const grouped: Record<string, Task[]> = {
          'Overdue': [],
          'Today': [],
          'Tomorrow': [],
          'This Week': [],
          'Later': []
        };
        
        tasks.forEach(task => {
          const due = task.due.toLowerCase();
          
          if (due.includes('yesterday') || due.includes('overdue') || due.includes('late')) {
            grouped['Overdue'].push(task);
          } else if (due.includes('today')) {
            grouped['Today'].push(task);
          } else if (due.includes('tomorrow')) {
            grouped['Tomorrow'].push(task);
          } else if (due.includes('this week') || due.includes('in 2 day') || due.includes('in 3 day') || due.includes('in 4 day') || due.includes('in 5 day')) {
            grouped['This Week'].push(task);
          } else {
            grouped['Later'].push(task);
          }
        });
        
        return grouped;
      }
      
      default:
        return {};
    }
  };

  const groupedTasks = getGroupedTasks();
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div 
        className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={toggleQuickGlanceExpansion}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">Quick Glance</h2>
          <div className="ml-2 p-1 text-gray-500">
            {isQuickGlanceExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>
        </div>
        
        {/* Grouping Options - Only show when expanded */}
        {isQuickGlanceExpanded && (
          <div 
            className="flex items-center space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm text-gray-500">Group by:</span>
            <div className="flex space-x-1">
              {(['Priority', 'Program', 'Type', 'Due'] as const).map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    groupBy === option 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGroupChange(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Only render content when expanded */}
      {isQuickGlanceExpanded && (
        <div className="p-3 overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-2">
            {groupedTasks && 
              Object.entries(groupedTasks).map(([groupName, groupTasks]) => {
                if (groupTasks.length === 0) return null;
                
                const isExpanded = expandedGroups[groupName] || false;
                const tasksToShow = isExpanded ? groupTasks : groupTasks.slice(0, initialTasksToShow);
                const hasMoreTasks = groupTasks.length > initialTasksToShow;
                
                // Get color for the dot based on group name
                const getDotColor = () => {
                  switch(groupName) {
                    case 'Blockers':
                      return 'bg-red-500';
                    case 'High':
                      return 'bg-orange-500';
                    case 'Medium':
                      return 'bg-yellow-400';
                    case 'Low':
                      return 'bg-green-500';
                    case 'Behavioral Health':
                    case 'PHP':
                    case 'IOP':
                      return 'bg-blue-500';
                    case 'Medical':
                    case 'MAT':
                      return 'bg-purple-500';
                    case 'Administrative':
                    case 'SUD':
                      return 'bg-gray-500';
                    case 'Today':
                      return 'bg-red-500';
                    case 'Tomorrow':
                      return 'bg-amber-500';
                    case 'This Week':
                      return 'bg-emerald-500';
                    case 'Later':
                      return 'bg-blue-500';
                    default:
                      return 'bg-gray-400';
                  }
                };
                
                return (
                  <div 
                    key={groupName} 
                    className="flex-shrink-0 w-72 bg-gray-50 rounded-xl overflow-hidden flex flex-col"
                  >
                    {/* Group Header - Clean minimal style */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getDotColor()} mr-2`}></div>
                        <h3 className="text-base font-medium text-gray-900">{groupName}</h3>
                        <span className="ml-1 text-xs text-gray-500">
                          {groupTasks.length}
                        </span>
                      </div>
                      
                      {hasMoreTasks && (
                        <button 
                          onClick={() => toggleGroupExpansion(groupName)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {isExpanded ? 'Show less' : 'Show all'}
                        </button>
                      )}
                    </div>
                    
                    {/* Tasks - Compact cards */}
                    <div className="space-y-2 px-3 pb-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                      {tasksToShow.map(task => (
                        <div 
                          key={task.id} 
                          className="bg-white rounded-lg p-2.5 shadow-sm hover:shadow transition-all duration-200"
                        >
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0 pr-2">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{task.title}</h4>
                              
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {/* Priority indicator - as a small dot */}
                                {groupBy !== 'Priority' && (
                                  <div className="flex items-center">
                                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                      task.priority === 'Blockers' ? 'bg-red-500' :
                                      task.priority === 'High' ? 'bg-orange-500' :
                                      task.priority === 'Medium' ? 'bg-amber-500' :
                                      'bg-emerald-500'
                                    }`}></div>
                                    <span className="text-xs text-gray-600">{task.priority}</span>
                                  </div>
                                )}
                                
                                {/* Program badge - compact */}
                                {groupBy !== 'Program' && (
                                  <span className="text-xs text-gray-600">
                                    {task.program}
                                  </span>
                                )}
                                
                                {/* Type badge - compact */}
                                {groupBy !== 'Type' && task.type && (
                                  <span className="text-xs text-gray-600">
                                    {task.type}
                                  </span>
                                )}
                                
                                {/* Due date - inline */}
                                <div className="flex items-center ml-auto text-xs text-gray-500">
                                  <ClockIcon className="w-3 h-3 mr-0.5" />
                                  {task.due}
                                </div>
                              </div>
                            </div>
                            
                            {/* Done button - smaller */}
                            <button
                              className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show More Button - Only visible when not expanded and has more tasks */}
                      {hasMoreTasks && !isExpanded && (
                        <button 
                          className="w-full py-1 text-center text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={() => toggleGroupExpansion(groupName)}
                        >
                          Show {groupTasks.length - initialTasksToShow} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHubDashboard;
