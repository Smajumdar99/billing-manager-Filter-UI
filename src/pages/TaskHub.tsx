import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar, MainNavigationBar } from '../components/old-ui';
import { PlusIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import TaskHubDashboard from '../components/TaskHubDashboard';
import AllTasksSection from '../components/AllTasksSection';
import TaskDetailsPanel from '../components/TaskDetailsPanel';
import { NewTaskDialog } from '@/components/molecules/NewTaskDialog/new-task-dialog';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { BlurIn } from '@/components/ui/blur-in';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem
} from '@/components/ui/menubar';

import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';

// Task block type definition
interface TaskBlock {
  id: string;
  count: number;
  label: string;
  textColor: string;
  isCustom?: boolean;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

// Task interface for detailed list
interface Task {
  id: string;
  title: string;
  priority: 'Blockers' | 'High' | 'Medium' | 'Low';
  program: string;
  type: 'Reminder' | 'Messages' | 'Dr First Notifications' | 'Review Forms' | 'Birthdays' | 'Agenda' | 'Assessment' | 'Medication' | 'Treatment' | 'Insurance' | 'Clinical' | 'Administrative' | 'Transaction Reviews';
  due: string;
  assignedTo?: string;
  person?: string;
}

/**
 * TaskHub Page
 * 
 * A modern, responsive Task Hub dashboard for an EHR system used by behavioral health clinics.
 * Features a grid of task blocks with counts, labels, and visual enhancements.
 */
const TaskHub: React.FC = () => {
  // --- Get tasks from context ---
  const { myTasks } = useTaskContext();

  // We're using navigate in the handleMainNavigation function
  const navigate = useNavigate();
  // State for grouping tasks in the dashboard
  const [groupBy, setGroupBy] = useState<'Priority' | 'Program' | 'Type' | 'Due'>('Priority');
  
  // Filter and sort state
  const [filterCriteria, setFilterCriteria] = useState<string[]>([]);
  const [sortCriteria, setSortCriteria] = useState<'count-asc' | 'count-desc' | 'label-asc' | 'label-desc' | 'criticality-asc' | 'criticality-desc'>('criticality-desc');
  
  // Sample tasks data
  const tasks: Task[] = [
    // Original tasks
    { id: '1', title: 'Complete patient assessment for John D.', priority: 'High', program: 'Behavioral Health', type: 'Assessment', due: 'Today', person: 'John Doe' },
    { id: '2', title: 'Review medication plan for Sarah M.', priority: 'Medium', program: 'Medical', type: 'Medication', due: 'Tomorrow', person: 'Sarah Miller' },
    { id: '3', title: 'Update treatment notes for group therapy', priority: 'Low', program: 'PHP', type: 'Treatment', due: 'Today', person: 'Group A Patients' },
    { id: '4', title: 'Insurance verification for new patient', priority: 'Medium', program: 'Administrative', type: 'Insurance', due: 'Today', person: 'Emma Wilson' },
    { id: '5', title: 'Follow up on lab results for Michael K.', priority: 'High', program: 'Medical', type: 'Clinical', due: 'Yesterday - Overdue', person: 'Michael Klein' },
    { id: '6', title: 'Schedule next appointment for anxiety group', priority: 'Low', program: 'Behavioral Health', type: 'Administrative', due: 'This week', person: 'Anxiety Support Group' },
    { id: '7', title: 'Complete discharge paperwork for Robert J.', priority: 'Medium', program: 'PHP', type: 'Administrative', due: 'Tomorrow', person: 'Robert Johnson' },
    { id: '8', title: 'Crisis intervention plan review', priority: 'Blockers', program: 'IOP', type: 'Treatment', due: 'Today', person: 'Lisa Thompson' },
    { id: '9', title: 'Medication reconciliation for Lisa T.', priority: 'High', program: 'MAT', type: 'Medication', due: 'Today', person: 'Lisa Thompson' },
    { id: '10', title: 'Update treatment plan for David W.', priority: 'Medium', program: 'SUD', type: 'Treatment', due: 'This week', person: 'David Williams' },
    
    // Reminder tasks
    { id: '11', title: 'Call pharmacy about prescription refill', priority: 'High', program: 'Medical', type: 'Reminder', due: 'Today', person: 'James Wilson' },
    { id: '23', title: 'Reminder: Call patient about appointment', priority: 'Medium', program: 'Administrative', type: 'Reminder', due: 'Tomorrow', person: 'Carlos Rodriguez' },
    { id: '31', title: 'Reminder: Submit weekly report to supervisor', priority: 'Medium', program: 'Behavioral Health', type: 'Reminder', due: 'Today' },
    { id: '32', title: 'Reminder: Order lab tests for patient follow-up', priority: 'High', program: 'Medical', type: 'Reminder', due: 'Tomorrow' },
    { id: '33', title: 'Reminder: Check in with high-risk patient', priority: 'Blockers', program: 'PHP', type: 'Reminder', due: 'Today' },
    { id: '34', title: 'Reminder: Complete continuing education credits', priority: 'Low', program: 'Administrative', type: 'Reminder', due: 'This week' },
    
    // Messages tasks
    { id: '12', title: 'New message from Dr. Johnson about patient care', priority: 'Medium', program: 'Behavioral Health', type: 'Messages', due: 'Tomorrow' },
    { id: '24', title: 'New secure message from patient family', priority: 'Medium', program: 'Behavioral Health', type: 'Messages', due: 'Today' },
    { id: '35', title: 'Message: Question about medication side effects', priority: 'High', program: 'Medical', type: 'Messages', due: 'Today' },
    { id: '36', title: 'Message: Patient requesting appointment change', priority: 'Low', program: 'Administrative', type: 'Messages', due: 'Tomorrow' },
    { id: '37', title: 'Message: Consultation request from primary care', priority: 'Medium', program: 'PHP', type: 'Messages', due: 'Today' },
    { id: '38', title: 'Message: Insurance inquiry about coverage', priority: 'Medium', program: 'Administrative', type: 'Messages', due: 'This week' },
    
    // Assessment tasks
    { id: '13', title: 'High risk assessment for Kevin L.', priority: 'Blockers', program: 'PHP', type: 'Assessment', due: 'Today' },
    { id: '18', title: 'Review treatment compliance for MAT patients', priority: 'High', program: 'MAT', type: 'Assessment', due: 'Today' },
    { id: '22', title: 'Review lab results for substance screening', priority: 'High', program: 'SUD', type: 'Assessment', due: 'Today' },
    { id: '39', title: 'Initial assessment for new referral patient', priority: 'Medium', program: 'Behavioral Health', type: 'Assessment', due: 'Tomorrow' },
    { id: '40', title: 'Quarterly assessment update for chronic care', priority: 'Medium', program: 'Medical', type: 'Assessment', due: 'This week' },
    
    // Dr First Notifications tasks
    { id: '14', title: 'DrFirst: New prescription alert for patient #12345', priority: 'Medium', program: 'Medical', type: 'Dr First Notifications', due: 'This week' },
    { id: '25', title: 'DrFirst: Medication interaction warning', priority: 'High', program: 'PHP', type: 'Dr First Notifications', due: 'Tomorrow' },
    { id: '41', title: 'DrFirst: Prescription renewal needed', priority: 'Medium', program: 'MAT', type: 'Dr First Notifications', due: 'Today' },
    { id: '42', title: 'DrFirst: Prior authorization required', priority: 'High', program: 'Administrative', type: 'Dr First Notifications', due: 'Today' },
    { id: '43', title: 'DrFirst: Controlled substance monitoring alert', priority: 'Blockers', program: 'SUD', type: 'Dr First Notifications', due: 'Today' },
    
    // Insurance tasks
    { id: '15', title: 'Process insurance claim for therapy sessions', priority: 'Low', program: 'Administrative', type: 'Insurance', due: 'Later' },
    { id: '30', title: 'Follow up on insurance authorization', priority: 'High', program: 'Administrative', type: 'Insurance', due: 'Today' },
    { id: '44', title: 'Insurance appeal for denied claim', priority: 'Medium', program: 'Behavioral Health', type: 'Insurance', due: 'This week' },
    { id: '45', title: 'Verify insurance benefits for new treatment', priority: 'Medium', program: 'Medical', type: 'Insurance', due: 'Tomorrow' },
    
    // Review Forms tasks
    { id: '16', title: 'Review intake form for new patient consultation', priority: 'Medium', program: 'Behavioral Health', type: 'Review Forms', due: 'Tomorrow' },
    { id: '26', title: 'Review consent forms for group therapy', priority: 'Medium', program: 'Medical', type: 'Review Forms', due: 'This week' },
    { id: '46', title: 'Review patient satisfaction survey results', priority: 'Low', program: 'Administrative', type: 'Review Forms', due: 'This week' },
    { id: '47', title: 'Review treatment authorization request forms', priority: 'High', program: 'PHP', type: 'Review Forms', due: 'Today' },
    { id: '48', title: 'Review updated HIPAA compliance forms', priority: 'Medium', program: 'Administrative', type: 'Review Forms', due: 'Tomorrow' },
    { id: '71', title: 'Review medication consent forms', priority: 'High', program: 'Medical', type: 'Review Forms', due: 'Today' },
    { id: '72', title: 'Review discharge summary forms', priority: 'Medium', program: 'PHP', type: 'Review Forms', due: 'Tomorrow' },
    { id: '73', title: 'Review insurance pre-authorization forms', priority: 'High', program: 'Administrative', type: 'Review Forms', due: 'Today' },
    { id: '74', title: 'Review therapy progress note forms', priority: 'Medium', program: 'IOP', type: 'Review Forms', due: 'Today' },
    { id: '75', title: 'Review patient feedback forms', priority: 'Low', program: 'SUD', type: 'Review Forms', due: 'This week' },
    { id: '76', title: 'Review telehealth consent forms', priority: 'High', program: 'MAT', type: 'Review Forms', due: 'Today' },
    { id: '77', title: 'Review behavioral health assessment forms', priority: 'Medium', program: 'Behavioral Health', type: 'Review Forms', due: 'Tomorrow' },

    // Transaction Reviews tasks - reduce to 2 tasks
    { id: '66', title: 'Review insurance claim transactions', priority: 'High', program: 'Administrative', type: 'Transaction Reviews', due: 'Today' },
    { id: '67', title: 'Verify patient billing transactions', priority: 'Medium', program: 'Administrative', type: 'Transaction Reviews', due: 'Tomorrow' },
    
    // Administrative tasks
    { id: '17', title: 'Follow up on missed appointment for Emily R.', priority: 'High', program: 'IOP', type: 'Administrative', due: 'Today' },
    { id: '21', title: 'Document group therapy attendance', priority: 'Low', program: 'IOP', type: 'Administrative', due: 'Today' },
    { id: '49', title: 'Update patient contact information', priority: 'Low', program: 'Administrative', type: 'Administrative', due: 'This week' },
    { id: '50', title: 'Schedule staff training session', priority: 'Medium', program: 'Behavioral Health', type: 'Administrative', due: 'Tomorrow' },
    
    // Birthday tasks
    { id: '19', title: 'Patient birthday: James Wilson turns 42 today', priority: 'Low', program: 'PHP', type: 'Birthdays', due: 'Today' },
    { id: '27', title: 'Staff birthday: Dr. Martinez celebration', priority: 'Low', program: 'Behavioral Health', type: 'Birthdays', due: 'Later' },
    { id: '51', title: 'Patient birthday: Sarah Johnson turns 35', priority: 'Low', program: 'IOP', type: 'Birthdays', due: 'Tomorrow' },
    { id: '52', title: 'Team member birthday: Office manager Lisa', priority: 'Low', program: 'Administrative', type: 'Birthdays', due: 'Today' },
    { id: '53', title: 'Patient milestone: 1 year sobriety celebration', priority: 'Medium', program: 'SUD', type: 'Birthdays', due: 'This week' },
    
    // Agenda tasks
    { id: '20', title: 'Team meeting to discuss case management', priority: 'Medium', program: 'Behavioral Health', type: 'Agenda', due: 'This week' },
    { id: '28', title: 'Weekly supervision meeting with clinical team', priority: 'Medium', program: 'Medical', type: 'Agenda', due: 'Tomorrow' },
    { id: '54', title: 'Monthly quality improvement committee', priority: 'Medium', program: 'Administrative', type: 'Agenda', due: 'Next week' },
    { id: '55', title: 'Interdisciplinary team care planning', priority: 'High', program: 'PHP', type: 'Agenda', due: 'Tomorrow' },
    { id: '56', title: 'Staff development workshop', priority: 'Low', program: 'Behavioral Health', type: 'Agenda', due: 'This week' },
    
    // Clinical tasks
    { id: '29', title: 'Document crisis intervention', priority: 'Blockers', program: 'IOP', type: 'Clinical', due: 'Today' },
    { id: '57', title: 'Update clinical progress notes for weekly session', priority: 'Medium', program: 'Behavioral Health', type: 'Clinical', due: 'Today' },
    { id: '58', title: 'Clinical supervision for new therapist', priority: 'Medium', program: 'PHP', type: 'Clinical', due: 'Tomorrow' },
    { id: '59', title: 'Review clinical outcome measures', priority: 'Low', program: 'Medical', type: 'Clinical', due: 'This week' },
    
    // Medication tasks
    { id: '60', title: 'Medication management follow-up', priority: 'High', program: 'MAT', type: 'Medication', due: 'Today' },
    { id: '61', title: 'Review medication adherence reports', priority: 'Medium', program: 'SUD', type: 'Medication', due: 'Tomorrow' },
    { id: '62', title: 'Update medication list for patient portal', priority: 'Low', program: 'Medical', type: 'Medication', due: 'This week' },
    
    // Treatment tasks
    { id: '63', title: 'Update group therapy curriculum', priority: 'Medium', program: 'Behavioral Health', type: 'Treatment', due: 'This week' },
    { id: '64', title: 'Review evidence-based protocol implementation', priority: 'High', program: 'PHP', type: 'Treatment', due: 'Tomorrow' },
    { id: '65', title: 'Coordinate care with external providers', priority: 'Medium', program: 'Medical', type: 'Treatment', due: 'Today' }
  ];

  // Get filtered tasks for each block
  const getTasksForBlock = (blockId: string): Task[] => {
    switch (blockId) {
      case 'expedite-queue':
        // Only return tasks with Blockers priority and due Today
        return tasks.filter(task => 
          task.priority === 'Blockers' && 
          task.due === 'Today'
        );
      case 'needs-review':
        // Return only Review Forms type tasks
        return tasks.filter(task => task.type === 'Review Forms');
      case 'transaction-reviews':
        // Return only Transaction Reviews type tasks
        return tasks.filter(task => task.type === 'Transaction Reviews');
      case 'aging-tasks':
        // Return tasks that are overdue
        return tasks.filter(task => 
          task.due === 'Yesterday - Overdue' || 
          task.due.includes('Overdue')
        );
      case 'fyi-zone':
        // Return only low priority informational tasks
        return tasks.filter(task => 
          task.priority === 'Low' && 
          task.type !== 'Review Forms'
        );
      case 'suggested-actions':
        // Return only Reminder type tasks
        return tasks.filter(task => task.type === 'Reminder');
      case 'agenda':
        // Return only Agenda type tasks
        return tasks.filter(task => task.type === 'Agenda');
      case 'prescriptions':
        // Return only Medication type tasks
        return tasks.filter(task => task.type === 'Medication');
      case 'assigned-to-me':
        // Return tasks assigned to the current user
        return tasks.filter(task => task.assignedTo === 'me');
      case 'created-by-me':
        // Return tasks created by the user from context
        return myTasks;
      default:
        return [];
    }
  };

  // Task blocks data with dynamic counts
  const taskBlocks: TaskBlock[] = [
    {
      id: 'expedite-queue',
      count: getTasksForBlock('expedite-queue').length,
      label: 'Urgent Tasks',
      textColor: 'text-red-700',
      criticality: 'critical'
    },
    {
      id: 'suggested-actions',
      count: getTasksForBlock('suggested-actions').length,
      label: 'All Reminders',
      textColor: 'text-amber-700',
      criticality: 'medium'
    },
    {
      id: 'agenda',
      count: getTasksForBlock('agenda').length,
      label: 'Agenda',
      textColor: 'text-blue-700',
      criticality: 'low'
    },
    {
      id: 'fyi-zone',
      count: getTasksForBlock('fyi-zone').length,
      label: 'Info Only',
      textColor: 'text-green-700',
      criticality: 'low'
    },
    {
      id: 'needs-review',
      count: getTasksForBlock('needs-review').length,
      label: 'Review Forms',
      textColor: 'text-purple-700',
      criticality: 'high'
    },
    {
      id: 'transaction-reviews',
      count: getTasksForBlock('transaction-reviews').length,
      label: 'Transaction Reviews',
      textColor: 'text-indigo-700',
      criticality: 'high'
    },
    {
      id: 'prescriptions',
      count: getTasksForBlock('prescriptions').length,
      label: 'Review Prescriptions',
      textColor: 'text-indigo-700',
      criticality: 'high'
    },
    {
      id: 'assigned-to-me',
      count: getTasksForBlock('assigned-to-me').length,
      label: 'Assigned to Me',
      textColor: 'text-teal-700',
      criticality: 'medium'
    },
    {
      id: 'aging-tasks',
      count: getTasksForBlock('aging-tasks').length,
      label: 'Pending Too Long',
      textColor: 'text-orange-700',
      criticality: 'high'
    },
    {
      id: 'created-by-me',
      count: myTasks.length,
      label: 'Tasks Created by Me',
      textColor: 'text-blue-700',
      criticality: 'medium',
    },
  ];
  
  // State for adding custom blocks
  const [showAddBlockModal, setShowAddBlockModal] = useState<boolean>(false);
  const [newBlockConfig, setNewBlockConfig] = useState({
    label: '',
    description: '',
    criticality: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    color: 'blue',
    filters: {
      priority: [] as string[],
      program: [] as string[],
      type: [] as string[],
      dueDate: [] as string[],
      status: [] as string[]
    }
  });
  
  // All task blocks (original + custom)
  const [customBlocks, setCustomBlocks] = useState<TaskBlock[]>([]);
  const allTaskBlocks = useMemo(() => [...taskBlocks, ...customBlocks], [taskBlocks, customBlocks]);
  
  // Filter and sort handlers
  const handleFilterChange = (criteria: string) => {
    if (filterCriteria.includes(criteria)) {
      setFilterCriteria(filterCriteria.filter(item => item !== criteria));
    } else {
      setFilterCriteria([...filterCriteria, criteria]);
    }
  };
  
  const handleSortChange = (criteria: 'count-asc' | 'count-desc' | 'label-asc' | 'label-desc' | 'criticality-asc' | 'criticality-desc') => {
    setSortCriteria(criteria);
  };
  
  // Apply filters and sorting to task blocks
  const filteredAndSortedBlocks = useMemo(() => {
    let result = [...allTaskBlocks];
    
    // Apply filters
    if (filterCriteria.length > 0) {
      result = result.filter(block => {
        // Filter by count range
        if (filterCriteria.includes('count-low') && block.count > 5) return false;
        if (filterCriteria.includes('count-medium') && (block.count <= 5 || block.count > 10)) return false;
        if (filterCriteria.includes('count-high') && block.count <= 10) return false;
        
        // Filter by custom/default
        if (filterCriteria.includes('custom-only') && !block.isCustom) return false;
        if (filterCriteria.includes('default-only') && block.isCustom) return false;
        
        return true;
      });
    }
    
    // Criticality order mapping (for sorting)
    const criticalityOrder = { 
      critical: 4, 
      high: 3, 
      medium: 2, 
      low: 1 
    };

    // Apply sorting
    result.sort((a, b) => {
      switch (sortCriteria) {
        case 'count-asc':
          return a.count - b.count;
        case 'count-desc':
          return b.count - a.count;
        case 'label-asc':
          return a.label.localeCompare(b.label);
        case 'label-desc':
          return b.label.localeCompare(a.label);
        case 'criticality-asc':
          return criticalityOrder[a.criticality] - criticalityOrder[b.criticality];
        case 'criticality-desc':
        default: // Make criticality-desc the default sort
          // Sort by criticality first
          const criticalityDiff = criticalityOrder[b.criticality] - criticalityOrder[a.criticality];
          if (criticalityDiff !== 0) return criticalityDiff;
          // If criticality is the same, sort by count
          return b.count - a.count;
      }
    });
    
    return result;
  }, [allTaskBlocks, filterCriteria, sortCriteria]);

  // --- Add refs for filter/sort dropdowns and buttons ---
  // Removed refs for dropdowns, handled by Menubar now

  // --- Handle closing dropdowns on outside click ---
  // Removed outside click logic, handled by Menubar now

  // Helper to map criticality to badge color and label
  const getCriticalityBadge = (criticality: TaskBlock['criticality']) => {
    // Map criticality to shadcn badge color classes and readable label
    switch (criticality) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700 border-green-200">Low</Badge>;
    }
  };

  // Helper to rotate through several pastel gradient backgrounds
  const getPastelGradient = (index: number) => {
    // Rotate through a few nice pastel combos
    const gradients = [
      'bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50',
      'bg-gradient-to-br from-green-50 via-teal-50 to-blue-50',
      'bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-50',
      'bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50',
      'bg-gradient-to-br from-orange-50 via-yellow-50 to-yellow-50',
    ];
    return gradients[index % gradients.length];
  };

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`);
    
    // Use navigate to handle special cases
    if (itemName === 'Home') {
      navigate('/');
    } else if (itemName === 'Inbox') {
      navigate('/inbox');
    } else {
      // For other items, we would navigate to their respective routes
      console.log(`Would navigate to ${itemName}`);
    }
  };

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`);
    // In a real app, this would trigger a search operation
  };

  // Handle adding a new custom block
  const handleAddCustomBlock = () => {
    if (newBlockConfig.label.trim() === '') return;
    
    // Generate a random color for the new block
    const colors = [
      'text-blue-600', 'text-green-600', 'text-indigo-600', 
      'text-purple-600', 'text-pink-600', 'text-cyan-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newBlock: TaskBlock = {
      id: `custom-${Date.now()}`,
      count: 0,
      label: newBlockConfig.label,
      textColor: randomColor,
      isCustom: true,
      criticality: newBlockConfig.criticality
    };
    
    setCustomBlocks([...customBlocks, newBlock]);
    setNewBlockConfig({
      label: '',
      description: '',
      criticality: 'medium',
      color: 'blue',
      filters: {
        priority: [],
        program: [],
        type: [],
        dueDate: [],
        status: []
      }
    });
    setShowAddBlockModal(false);
  };

  // Task Block Component
  const TaskBlockComponent: React.FC<TaskBlock & { index: number; isSelected?: boolean }> = ({ id, count, label, textColor, criticality, index, isSelected }: any) => {
    // Attach ref to the 'created-by-me' card
    const ref = id === 'created-by-me' ? createdByMeRef : undefined;
    // Get colors based on criticality
    const getColors = () => {
      switch (criticality) {
        case 'critical':
          return {
            accent: 'bg-red-500',
            accentLight: 'bg-red-100',
            number: 'text-red-600',
            icon: 'text-gray-500',
            iconBg: 'bg-gray-50',
            badge: 'bg-red-100 text-red-700',
            selectedBg: 'bg-red-50',
            selectedBorder: 'border-red-300'
          };
        case 'high':
          return {
            accent: 'bg-orange-500',
            accentLight: 'bg-orange-100',
            number: 'text-orange-600',
            icon: 'text-gray-500',
            iconBg: 'bg-gray-50',
            badge: 'bg-orange-100 text-orange-700',
            selectedBg: 'bg-orange-50',
            selectedBorder: 'border-orange-300'
          };
        case 'medium':
          return {
            accent: 'bg-gray-400',
            accentLight: 'bg-gray-200',
            number: 'text-gray-600',
            icon: 'text-gray-500',
            iconBg: 'bg-gray-50',
            badge: 'bg-gray-100 text-gray-600',
            selectedBg: 'bg-gray-50',
            selectedBorder: 'border-gray-300'
          };
        default: // low
          return {
            accent: 'bg-gray-300',
            accentLight: 'bg-gray-200',
            number: 'text-gray-600',
            icon: 'text-gray-500',
            iconBg: 'bg-gray-50',
            badge: 'bg-gray-100 text-gray-600',
            selectedBg: 'bg-gray-50',
            selectedBorder: 'border-gray-300'
          };
      }
    };

    const colors = getColors();
    const progressPercent = Math.min(100, count * 10);
    const alphabet = String.fromCharCode(65 + index);
    
    // Icon mapping based on label
    const getIcon = () => {
      switch (label) {
        case 'Expedite Queue':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'Suggested Actions':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          );
        case 'Agenda':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3L4 14h7v7l9-11h-7z" />
            </svg>
          );
        case 'FYI Zone':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          );
        case 'Review Forms':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case 'Prescriptions':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 013 6.586V4a2 2 0 0114 0v8.586a2 2 0 01-.293.707l-.548.547z" />
            </svg>
          );
        case 'Assigned to Me':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          );
        case 'Aging Tasks':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'Transaction Reviews':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case 'Tasks Created by Me':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          );
        default:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          );
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border-2 border-white ring-2 ring-inset ring-white/80',
          getPastelGradient(index),
          isSelected ? 'ring-2 ring-blue-300 scale-[1.02]' : '',
          'hover:scale-[1.03] hover:border-blue-200 transition-all duration-200 cursor-pointer group p-5 h-full flex flex-col'
        )}
        tabIndex={0}
        aria-label={label}
        data-testid={`task-block-${id}`}
      >
        {/* White overlay for ultra-light pastel effect with frosted hover */}
        <div className="absolute inset-0 rounded-xl bg-white/70 pointer-events-none z-0 group-hover:bg-white/80" />
        {/* Header with icon and label */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className={`w-9 h-9 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <div className={colors.icon}>
              {getIcon()}
            </div>
          </div>
          <BlurIn
            word={label}
            className="bg-gradient-to-r from-muted-foreground to-foreground bg-clip-text text-transparent text-md md:text-sm lg:text-md text-left"
            duration={1.2}
          />
        </div>
        
        {/* Bottom section with count and priority */}
        <div className="mt-auto flex justify-between items-end z-10 relative">
          {/* Count display */}
          <div>
            {/* Count display: bold for critical, normal for others */}
            <span
              className={cn(
                "text-4xl",
                criticality === "critical" ? "font-bold" : "font-normal",
                colors.number
              )}
            >
              {count}
            </span>
          </div>
          
          {/* Priority badge */}
          {getCriticalityBadge(criticality)}
        </div>
      </div>
    );
  };

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const createdByMeRef = useRef<HTMLDivElement | null>(null);
  const [showCreatedByMeGuide, setShowCreatedByMeGuide] = useState(false);

  // Hide guide after 4s or on click
  useEffect(() => {
    if (showCreatedByMeGuide) {
      const timeout = setTimeout(() => setShowCreatedByMeGuide(false), 4000);
      const handler = () => setShowCreatedByMeGuide(false);
      document.addEventListener('mousedown', handler);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('mousedown', handler);
      };
    }
  }, [showCreatedByMeGuide]);

  const handleTaskClick = (blockId: string) => {
    setSelectedBlockId(blockId);
  };
  
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-red-50/50">
      {/* Top Navigation */}
      <TopNavigationBar 
        hospitalName="Dr. Cloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={handleSearch}
      />
      
      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Inbox"
        onNavigate={handleMainNavigation}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 overflow-auto transition-all duration-300 ${
          selectedBlockId ? 'min-w-0 w-0 flex-shrink' : 'w-full'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Smart Categorisation and Smart Assist Sections */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 mb-6 md:mb-8">
              {/* Smart Categorisation Section */}
              <div className={`w-full ${selectedBlockId ? 'lg:w-full' : 'lg:w-2/3'}`}>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">Smart Categorisation</h2>
                  <div className="flex items-center gap-2 relative overflow-visible">
                    {/* The parent div for Filter/Sort buttons is now relative and overflow-visible to contain dropdowns */}
                    <Menubar className="bg-white border border-gray-200 rounded-md shadow-none px-4 mx-2">
                      {/* Filter Menubar */}
                      <MenubarMenu>
                        <MenubarTrigger className="text-xs px-2 py-1 text-gray-600">Filter</MenubarTrigger>
                        <MenubarContent align="end" className="min-w-[12rem]">
                          <MenubarLabel>Filter by:</MenubarLabel>
                          <MenubarCheckboxItem
                            checked={filterCriteria.includes('count-low')}
                            onCheckedChange={() => handleFilterChange('count-low')}
                          >Low (0-5)</MenubarCheckboxItem>
                          <MenubarCheckboxItem
                            checked={filterCriteria.includes('count-medium')}
                            onCheckedChange={() => handleFilterChange('count-medium')}
                          >Medium (6-10)</MenubarCheckboxItem>
                          <MenubarCheckboxItem
                            checked={filterCriteria.includes('count-high')}
                            onCheckedChange={() => handleFilterChange('count-high')}
                          >High (11+)</MenubarCheckboxItem>
                          <MenubarSeparator />
                          <MenubarCheckboxItem
                            checked={filterCriteria.includes('custom-only')}
                            onCheckedChange={() => handleFilterChange('custom-only')}
                          >Custom only</MenubarCheckboxItem>
                          <MenubarCheckboxItem
                            checked={filterCriteria.includes('default-only')}
                            onCheckedChange={() => handleFilterChange('default-only')}
                          >Default only</MenubarCheckboxItem>
                        </MenubarContent>
                      </MenubarMenu>
                      {/* Sort Menubar */}
                      <MenubarMenu>
                        <MenubarTrigger className="text-xs px-2 py-1 text-gray-600">Sort</MenubarTrigger>
                        <MenubarContent align="end" className="min-w-[12rem]">
                          <MenubarLabel>Sort by:</MenubarLabel>
                          <MenubarRadioGroup value={sortCriteria} onValueChange={handleSortChange}>
                            <MenubarRadioItem value="criticality-desc">Priority (high to low)</MenubarRadioItem>
                            <MenubarRadioItem value="criticality-asc">Priority (low to high)</MenubarRadioItem>
                            <MenubarRadioItem value="count-desc">Count (high to low)</MenubarRadioItem>
                            <MenubarRadioItem value="count-asc">Count (low to high)</MenubarRadioItem>
                            <MenubarRadioItem value="label-asc">Label (A to Z)</MenubarRadioItem>
                            <MenubarRadioItem value="label-desc">Label (Z to A)</MenubarRadioItem>
                          </MenubarRadioGroup>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                    <Button 
                      variant="default"
                      onClick={() => setShowNewTaskDialog(true)}
                    >
                      New Task
                    </Button>
                  </div>
                </div>
                
                {/* Task Blocks Grid */}
                <div className={`grid gap-4 sm:gap-6 ${
                  selectedBlockId 
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {filteredAndSortedBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => handleTaskClick(block.id)}
                      className="cursor-pointer"
                    >
                      <TaskBlockComponent
                        {...block}
                        index={index}
                        isSelected={selectedBlockId === block.id}
                      />
                    </div>
                  ))}
                  
                  {/* Add New Block Button */}
                  <div 
                    onClick={() => setShowAddBlockModal(true)}
                    className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-transparent flex items-center justify-center h-[130px] cursor-pointer hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                        <PlusIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-700">Add New Label</h3>
                      <p className="text-xs text-gray-500 mt-1">Create custom categories</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Smart Assist Section - Hide when details panel is open */}
              {!selectedBlockId && (
                <div className="w-full lg:w-1/3">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-500 text-xs">🧠</span>
                          </div>
                          <h2 className="text-base font-medium text-gray-800">Smart Assist</h2>
                        </div>
                        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          AI-Powered
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
                      <div className="space-y-3">
                        {/* Risk Identified */}
                        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
                          {/* Removed colored vertical bar for minimal look */}
                          <div className="p-3 w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Risk Identified</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                              You have 4 overdue high-priority tasks from last week
                            </p>
                          </div>
                        </div>
                        
                        {/* Task Recommendation */}
                        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
                          {/* Removed colored vertical bar for minimal look */}
                          <div className="p-3 w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Task Recommendation</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                              Based on your schedule, now would be a good time to review patient assessments
                            </p>
                          </div>
                        </div>
                        
                        {/* Productivity Update */}
                        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
                          {/* Removed colored vertical bar for minimal look */}
                          <div className="p-3 w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Productivity Update</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                              You cleared 10 tasks today — great job!
                            </p>
                          </div>
                        </div>
                        
                        {/* Pattern Detected */}
                        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
                          {/* Removed colored vertical bar for minimal look */}
                          <div className="p-3 w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Pattern Detected</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                              You often delay Rx renewals — want to batch them?
                            </p>
                          </div>
                        </div>
                        
                        {/* Follow-up Needed */}
                        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
                          {/* Removed colored vertical bar for minimal look */}
                          <div className="p-3 w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Follow-up Needed</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                              3 urgent messages haven't been responded to
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-4">
                        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <span>View All Insights</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Glance Section */}
            <div className="mb-6">
              <TaskHubDashboard 
                tasks={tasks}
                groupBy={groupBy}
                onGroupChange={setGroupBy}
              />
            </div>
            
            {/* All Tasks Section */}
            <div className="mb-6">
              <AllTasksSection />
            </div>
          </div>
        </main>

        {/* Right Panel - Task Details */}
        {selectedBlockId && (
          <div className="h-full flex-none border-l border-gray-200">
            <TaskDetailsPanel
              blockId={selectedBlockId}
              tasks={getTasksForBlock(selectedBlockId)}
              onClose={() => setSelectedBlockId(null)}
            />
          </div>
        )}
      </div>
      
      {/* Add New Task Dialog */}
      <NewTaskDialog 
        isOpen={showNewTaskDialog}
        onClose={() => setShowNewTaskDialog(false)}
        onTaskAdded={() => setShowCreatedByMeGuide(true)}
      />

      {/* Add New Block Modal */}
      {showAddBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-0 relative overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Create Smart Label</h3>
                    <p className="text-sm text-gray-500">Configure a custom category with smart filters</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddBlockModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Modal content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                <label htmlFor="blockLabel" className="block text-sm font-medium text-gray-700 mb-1">
                        Label Name*
                </label>
                <input
                  type="text"
                  id="blockLabel"
                        value={newBlockConfig.label}
                        onChange={(e) => setNewBlockConfig({...newBlockConfig, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter a descriptive name"
                />
              </div>
              
                    <div>
                      <label htmlFor="blockDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        id="blockDescription"
                        value={newBlockConfig.description}
                        onChange={(e) => setNewBlockConfig({...newBlockConfig, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional description for this label"
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Appearance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority Level
                </label>
                      <Select
                        value={newBlockConfig.criticality}
                        onValueChange={(value) => 
                          setNewBlockConfig({
                            ...newBlockConfig,
                            criticality: value as 'critical' | 'high' | 'medium' | 'low'
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Theme
                      </label>
                      <div className="flex gap-2">
                        {['blue', 'purple', 'green', 'orange', 'red'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewBlockConfig({...newBlockConfig, color})}
                            className={`w-8 h-8 rounded-full border-2 ${
                              newBlockConfig.color === color 
                                ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400' 
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: `var(--${color}-500)` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Filters */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Smart Filters</h4>
                  <div className="space-y-4">
                    {/* Priority Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Priority
                      </label>
                      <Select
                        value={newBlockConfig.filters.priority.join(",")}
                        onValueChange={(value) => {
                          setNewBlockConfig({
                            ...newBlockConfig,
                            filters: {
                              ...newBlockConfig.filters,
                              priority: value.split(",").filter(Boolean)
                            }
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {['Blockers', 'High', 'Medium', 'Low'].map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {newBlockConfig.filters.priority.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {newBlockConfig.filters.priority.map((priority) => (
                            <span
                              key={priority}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                priority === 'Blockers' ? 'bg-red-100 text-red-700' :
                                priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              {priority}
                              <button
                                type="button"
                                onClick={() => {
                                  setNewBlockConfig({
                                    ...newBlockConfig,
                                    filters: {
                                      ...newBlockConfig.filters,
                                      priority: newBlockConfig.filters.priority.filter(p => p !== priority)
                                    }
                                  });
                                }}
                                className="ml-1 inline-flex items-center p-0.5 hover:bg-opacity-80 rounded-full"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Program Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program
                      </label>
                      <Select
                        value={newBlockConfig.filters.program.join(",")}
                        onValueChange={(value) => {
                          setNewBlockConfig({
                            ...newBlockConfig,
                            filters: {
                              ...newBlockConfig.filters,
                              program: value.split(",").filter(Boolean)
                            }
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select programs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[
                              'Behavioral Health',
                              'Medical',
                              'PHP',
                              'IOP',
                              'MAT',
                              'SUD'
                            ].map((program) => (
                              <SelectItem key={program} value={program}>
                                {program}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {newBlockConfig.filters.program.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {newBlockConfig.filters.program.map((program) => (
                            <span
                              key={program}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                            >
                              {program}
                              <button
                                type="button"
                                onClick={() => {
                                  setNewBlockConfig({
                                    ...newBlockConfig,
                                    filters: {
                                      ...newBlockConfig.filters,
                                      program: newBlockConfig.filters.program.filter(p => p !== program)
                                    }
                                  });
                                }}
                                className="ml-1 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Task Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Assessment', 'Treatment', 'Medication', 'Review Forms',
                          'Messages', 'Administrative', 'Clinical', 'Insurance'
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              const types = newBlockConfig.filters.type;
                              setNewBlockConfig({
                                ...newBlockConfig,
                                filters: {
                                  ...newBlockConfig.filters,
                                  type: types.includes(type)
                                    ? types.filter(t => t !== type)
                                    : [...types, type]
                                }
                              });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              newBlockConfig.filters.type.includes(type)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Due Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Overdue', 'Today', 'Tomorrow', 'This Week', 'Next Week', 'Later'
                        ].map((dueDate) => (
                          <button
                            key={dueDate}
                            onClick={() => {
                              const dates = newBlockConfig.filters.dueDate;
                              setNewBlockConfig({
                                ...newBlockConfig,
                                filters: {
                                  ...newBlockConfig.filters,
                                  dueDate: dates.includes(dueDate)
                                    ? dates.filter(d => d !== dueDate)
                                    : [...dates, dueDate]
                                }
                              });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              newBlockConfig.filters.dueDate.includes(dueDate)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {dueDate}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Pending', 'In Progress', 'Completed', 'On Hold'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              const statuses = newBlockConfig.filters.status;
                              setNewBlockConfig({
                                ...newBlockConfig,
                                filters: {
                                  ...newBlockConfig.filters,
                                  status: statuses.includes(status)
                                    ? statuses.filter(s => s !== status)
                                    : [...statuses, status]
                                }
                              });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              newBlockConfig.filters.status.includes(status)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-sm h-[110px] border border-gray-200">
                      <div className="h-0.5 w-full bg-gray-100">
                        <div 
                          className={`h-0.5 bg-${newBlockConfig.color}-500`}
                          style={{ width: '50%' }}
                        ></div>
                      </div>
                      <div className="p-4 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full bg-${newBlockConfig.color}-100 flex items-center justify-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${newBlockConfig.color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        </div>
                          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                            {newBlockConfig.label || "New Label"}
                        </h3>
                      </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className={`text-4xl font-bold text-${newBlockConfig.color}-600`}>0</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            newBlockConfig.criticality === 'critical' ? 'bg-red-100 text-red-700' :
                            newBlockConfig.criticality === 'high' ? 'bg-orange-100 text-orange-700' :
                            newBlockConfig.criticality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {newBlockConfig.criticality}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showCreatedByMeGuide && createdByMeRef.current && (
        <div style={{
          position: 'absolute',
          zIndex: 50,
          left: createdByMeRef.current.getBoundingClientRect().left + window.scrollX + createdByMeRef.current.offsetWidth + 12,
          top: createdByMeRef.current.getBoundingClientRect().top + window.scrollY,
        }}
          className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg px-4 py-2 text-blue-900 text-sm animate-fade-in"
        >
          <b>Task added!</b> You can find it in <b>Tasks Created by Me</b>.
        </div>
      )}
    </div>
  );
};

export default TaskHub;