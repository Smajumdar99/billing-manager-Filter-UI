import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui';
import { 
  ArchiveBoxIcon, DocumentIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon,
  UserGroupIcon, ClipboardDocumentCheckIcon, ChatBubbleLeftIcon, CurrencyDollarIcon,
  ClipboardDocumentListIcon, UserIcon, BellIcon, CheckCircleIcon, XCircleIcon, 
  AdjustmentsHorizontalIcon, FunnelIcon, PlusIcon, ArrowPathIcon, EllipsisHorizontalIcon,
  ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, BoltIcon, CakeIcon,
  ReceiptPercentIcon, IdentificationIcon, ShieldCheckIcon, BuildingOfficeIcon,
  ChevronDownIcon, ArrowSmallUpIcon, ArrowSmallDownIcon, EnvelopeIcon, XMarkIcon,
  PaperClipIcon, CalendarIcon, ClockIcon, ExclamationCircleIcon, PhoneIcon,
  TableCellsIcon, Squares2X2Icon, EyeIcon, EyeSlashIcon, PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, BellIcon as BellSolid, ArrowUpIcon, ArrowDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/atoms/Select/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UpcomingAppointments } from '@/components/organisms/UpcomingAppointments'
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { format } from 'date-fns';
import Messages from '../components/widgets/ActivityCenter/Messages';
import { ReviewFormsWidget } from '@/components/widgets/ReviewFormsWidget/review-forms-widget';
import { TransactionsReviewsWidget } from '@/components/widgets/TransactionsReviewsWidget/transactions-reviews-widget';

/**
 * Inbox Page
 * 
 * This page demonstrates the use of the reusable navigation components
 * including TopNavigationBar, MainNavigationBar, and Sidebar.
 * It uses the same layout as OldUI but with a modern content area.
 */
const Inbox: React.FC = () => {
  const navigate = useNavigate();
  // Track the active sidebar menu item
  const [selectedMenu, setSelectedMenu] = useState('Activity Center');
  // Track active top tab
  const [activeTopTab, setActiveTopTab] = useState('Reminders');
  // Add loading state for skeleton loading
  const [isLoading, setIsLoading] = useState(true);
  // Track sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Send Reminder modal state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState<number | null>(null);
  const [reminderRecipientType, setReminderRecipientType] = useState<string>('staff');
  const [reminderRecipients, setReminderRecipients] = useState<string[]>([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderSubject, setReminderSubject] = useState('');
  const [reminderPriority, setReminderPriority] = useState<string>('medium');
  const [reminderMethod, setReminderMethod] = useState<string>('app');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [schedulingPreset, setSchedulingPreset] = useState<string>('now'); // Default to 'now'
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(''); // Track selected template
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'nursing', 'cardiology', 'icu', 'john', 'emergency'
  ]);
  const [includeMe, setIncludeMe] = useState(false);
  const [showAdditionalRecipients, setShowAdditionalRecipients] = useState(false); // Track whether to show additional recipients
  // Filter state for upcoming appointments
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'card' | 'table'>('card');
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');
  
  // Mock current user data (in a real app, this would come from auth context)
  const currentUser = {
    id: 0,
    name: "Dr. Current Provider",
    role: "Primary Care Physician",
    email: "provider@hospital.org"
  };
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    recipients: '',
    subject: '',
    message: '',
    scheduledTime: ''
  });

  // Define types for messages
  interface MessageType {
    id: number;
    subject: string;
    recipient: string;
    recipientType: string;
    sentDate: string;
    status: string; // 'delivered', 'sent', or 'scheduled'
    scheduledDate?: string;
    scheduledTime?: string;
    isSampleMessage?: boolean;
  }

  // Mock data for recently sent messages
  const [recentMessages, setRecentMessages] = useState<MessageType[]>([
    {
      id: 1,
      subject: "Appointment Reminder",
      recipient: "Dr. Sarah Johnson",
      recipientType: "staff",
      sentDate: "2023-06-15T10:30:00",
      status: "delivered"
    },
    {
      id: 2,
      subject: "Medication Refill Approval",
      recipient: "Nursing Team A",
      recipientType: "group",
      sentDate: "2023-06-14T16:45:00",
      status: "delivered"
    },
    {
      id: 3,
      subject: "Lab Results Ready",
      recipient: "John Smith",
      recipientType: "patient",
      sentDate: "2023-06-14T09:15:00",
      status: "delivered"
    },
    {
      id: 4,
      subject: "Pre-operative Instructions",
      recipient: "Elizabeth Davis",
      recipientType: "patient",
      sentDate: "2023-06-13T14:20:00",
      status: "delivered"
    }
  ]);
  
  // Mock data for staff members
  const staffMembers = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Physician" },
    { id: 2, name: "Dr. Michael Chen", role: "Surgeon" },
    { id: 3, name: "Nurse Rebecca Adams", role: "Registered Nurse" },
    { id: 4, name: "Nurse David Miller", role: "Registered Nurse" },
    { id: 5, name: "Dr. Emily Wilson", role: "Neurologist" }
  ];
  
  // Mock data for patient list
  const patients = [
    { id: 101, name: "John Smith", mrn: "MRN10045" },
    { id: 102, name: "Elizabeth Davis", mrn: "MRN10089" },
    { id: 103, name: "Robert Johnson", mrn: "MRN10132" },
    { id: 104, name: "Maria Garcia", mrn: "MRN10156" },
    { id: 105, name: "James Williams", mrn: "MRN10201" }
  ];
  
  // Mock data for groups
  const groups = [
    { id: 201, name: "Nursing Team A", members: 12 },
    { id: 202, name: "Nursing Team B", members: 10 },
    { id: 203, name: "ICU Staff", members: 8 },
    { id: 204, name: "Cardiology Department", members: 15 },
    { id: 205, name: "Administrative Staff", members: 20 }
  ];
  
  // Mock data for message templates
  const messageTemplates = [
    { id: 1, title: "Appointment Reminder", content: "This is a reminder about your upcoming appointment on [DATE] at [TIME]. Please arrive 15 minutes early to complete any necessary paperwork." },
    { id: 2, title: "Medication Refill", content: "Your medication refill for [MEDICATION] has been approved. Please contact the pharmacy to arrange pickup." },
    { id: 3, title: "Staff Meeting", content: "Please be reminded of the staff meeting on [DATE] at [TIME] in [LOCATION]. Attendance is required." },
    { id: 4, title: "Lab Results", content: "Your recent lab results are now available. Please schedule a follow-up appointment to review them." }
  ];
  
  // Define top tabs for the Activity Center
  const activityCenterTabs = [
    { 
      id: 'reminders', 
      label: 'Reminders', 
      icon: <BellIcon className="h-5 w-5" />, 
      activeIcon: <BellSolid className="h-5 w-5" />,
      count: 608, 
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      description: 'Task reminders and notifications'
    },
    { 
      id: 'reviewForms', 
      label: 'Review Forms', 
      icon: <DocumentIcon className="h-5 w-5" />, 
      count: 275, 
      color: 'bg-amber-500',
      gradient: 'from-amber-500 to-amber-600',
      description: 'Forms waiting for review'
    },
    { 
      id: 'transactionsReviews', 
      label: 'Transactions Reviews', 
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />, 
      count: 41, 
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Financial transactions requiring approval'
    },
    { 
      id: 'upcomingAppointments', 
      label: 'Upcoming Appointments', 
      icon: <CalendarDaysIcon className="h-5 w-5" />,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Schedule of upcoming appointments'
    },
    { 
      id: 'drFirstNotifications', 
      label: 'DrFirst Notifications', 
      icon: <DocumentIcon className="h-5 w-5" />, 
      hasAlert: true, 
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      description: 'Priority notifications from DrFirst'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <ChatBubbleLeftIcon className="h-5 w-5" />, 
      count: 9, 
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      description: 'Communication from patients and staff'
    },
    { 
      id: 'birthdays', 
      label: 'Birthdays', 
      icon: <CakeIcon className="h-5 w-5" />,
      gradient: 'from-pink-500 to-pink-600',
      description: 'Upcoming patient birthdays'
    },
    { 
      id: 'unbilledEncounters', 
      label: 'Unbilled Encounters', 
      icon: <ReceiptPercentIcon className="h-5 w-5" />,
      gradient: 'from-green-500 to-green-600',
      description: 'Patient encounters pending billing'
    },
    { 
      id: 'authorizations', 
      label: 'Authorization(s)', 
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Insurance authorizations requiring review'
    },
    { 
      id: 'staffDashboard', 
      label: 'Staff Dashboard', 
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      gradient: 'from-teal-500 to-teal-600',
      description: 'Staff performance and metrics'
    },
    { 
      id: 'applicants', 
      label: 'Applicants', 
      icon: <IdentificationIcon className="h-5 w-5" />,
      gradient: 'from-cyan-500 to-cyan-600',
      description: 'Job applicants and hiring status'
    },
  ];
  
  // Define sidebar items for Inbox
  const inboxSidebarItems = [
    { icon: <ArchiveBoxIcon />, label: "Activity Center" },
    { icon: <DocumentIcon />, label: "Documents" },
    { icon: <CalendarDaysIcon />, label: "Daily Log" },
    { icon: <ChatBubbleLeftRightIcon />, label: "Client Messages", badge: "16" },
    { icon: <UserGroupIcon />, label: "Staff Dashboard" },
    { icon: <ClipboardDocumentCheckIcon />, label: "Forms Reviews" },
    { icon: <ChatBubbleLeftIcon />, label: "Direct Messaging" },
    { icon: <CurrencyDollarIcon />, label: "Transactions Reviews" },
    { icon: <ClipboardDocumentListIcon />, label: "Treatment Plan Reviews" },
    { icon: <ClipboardDocumentListIcon />, label: "Treatment Plan Reviews(New UI)" },
    { icon: <UserIcon />, label: "User Forms" },
  ];
  
  // Handle tab change
  const handleTabChange = (tabLabel: string) => {
    setActiveTopTab(tabLabel);
    
    // Show skeleton loading when changing tabs
    setIsLoading(true);
    
    // Reset filters when switching tabs
    setSearchQuery('');
    setSelectedReminders([]);
    setViewMode('all');
    
    // Keep all Activity Center tabs within Activity Center
    const activityCenterTabs = [
      'Reminders',
      'Review Forms',
      'Transactions Reviews',
      'Upcoming Appointments',
      'DrFirst Notifications',
      'Messages',
      'Birthdays',
      'Unbilled Encounters',
      'Authorization(s)'
    ];
    
    // Update sidebar selection based on the tab
    if (activityCenterTabs.includes(tabLabel)) {
      setSelectedMenu('Activity Center');
    }
    
    // Simulate loading data (would be an API call in real app)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    console.log(`Switched to tab: ${tabLabel}`);
  };
  
  // Sample reminder data for the mockup
  const reminderData = [
    {
      id: 1,
      priority: 'High',
      from: 'Dr. Sarah Johnson',
      dueDate: '2024-03-15',
      isOverdue: false,
      person: 'Robert Wilson (1004445)',
      description: 'Follow-up required for medication review and adjustment. Patient reported side effects.',
      type: 'Evaluation',
      isCompleted: false,
    },
    {
      id: 2,
      priority: 'Medium',
      from: 'Nurse Practitioner',
      dueDate: '2024-03-18',
      isOverdue: false,
      person: 'Emily Chen (1004552)',
      description: 'Routine check-up scheduled. Review recent lab results before appointment.',
      type: 'Appointment',
      isCompleted: false,
    },
    {
      id: 3,
      priority: 'Low',
      from: 'System',
      dueDate: '2024-03-20',
      isOverdue: false,
      person: 'James Brown (1004678)',
      description: 'Annual patient satisfaction survey due for completion.',
      type: 'Form',
      isCompleted: false,
    },
    {
      id: 4,
      priority: 'High',
      from: 'Dr. Michael Lee',
      dueDate: '2024-03-14',
      isOverdue: false,
      person: 'Sarah Miller (1004789)',
      description: 'Urgent: Review updated treatment plan and sign off on changes.',
      type: 'Form',
      isCompleted: true,
    },
    {
      id: 5,
      priority: 'Medium',
      from: 'Physical Therapy',
      dueDate: '2024-03-16',
      isOverdue: false,
      person: 'David Thompson (1004890)',
      description: 'PT evaluation report ready for review. Please check and approve exercise plan.',
      type: 'Evaluation',
      isCompleted: false,
    },
    {
      id: 6,
      priority: 'High',
      from: 'Emergency Department',
      dueDate: '2024-03-13',
      isOverdue: true,
      person: 'Lisa Anderson (1004901)',
      description: 'Critical: Follow-up required for recent ER visit. Patient needs immediate care plan review.',
      type: 'Appointment',
      isCompleted: false,
    },
    {
      id: 7,
      priority: 'Low',
      from: 'Lab Services',
      dueDate: '2024-03-19',
      isOverdue: false,
      person: 'Mark Davis (1005001)',
      description: 'Routine blood work results available for review.',
      type: 'Form',
      isCompleted: false,
    },
    {
      id: 8,
      priority: 'Medium',
      from: 'Billing Department',
      dueDate: '2024-03-17',
      isOverdue: false,
      person: 'Jennifer White (1005112)',
      description: 'Insurance verification needed before scheduled procedure.',
      type: 'Form',
      isCompleted: false,
    },
    {
      id: 9,
      priority: 'High',
      from: 'Dr. Elizabeth Taylor',
      dueDate: '2024-03-12',
      isOverdue: true,
      person: 'Michael Jordan (1005223)',
      description: 'Patient reported severe symptoms. Immediate evaluation required.',
      type: 'Evaluation',
      isCompleted: true,
    },
    {
      id: 10,
      priority: 'Low',
      from: 'System',
      dueDate: '2024-03-21',
      isOverdue: false,
      person: 'Rachel Green (1005334)',
      description: 'Monthly quality assurance review due for completion.',
      type: 'Form',
      isCompleted: false,
    }
  ];
  
  // Filter and view states
  const [viewMode, setViewMode] = useState('all'); // 'all', 'today', 'upcoming', 'overdue'
  const [filterOptions, setFilterOptions] = useState({
    showCompleted: false,
    priorityFilter: 'all', // 'all', 'high', 'medium', 'low'
    typeFilter: 'all', // 'all', 'appointment', 'evaluation', 'form', 'check-in'
    personFilter: '',
  });
  const [selectedReminders, setSelectedReminders] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add sort state at the top of the component with other state variables
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Add column filter state
  const [columnFilters, setColumnFilters] = useState<{
    priority: string[];
    dueDate: { start: string; end: string };
    from: string;
    person: string;
  }>({
    priority: [],
    dueDate: { start: '', end: '' },
    from: '',
    person: '',
  });

  // Add filter dropdown visibility state
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Close filter when clicking outside
  const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeFilter && filterRefs.current[activeFilter] && 
          !filterRefs.current[activeFilter]?.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilter]);

  // Toggle filter dropdown
  const toggleFilter = (filterName: string) => {
    if (activeFilter === filterName) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterName);
      updateDropdownPosition(filterName);
    }
  };

  // Handle priority filter change
  const handlePriorityFilter = (priority: string) => {
    if (columnFilters.priority.includes(priority)) {
      setColumnFilters({
        ...columnFilters,
        priority: columnFilters.priority.filter(p => p !== priority)
      });
    } else {
      setColumnFilters({
        ...columnFilters,
        priority: [...columnFilters.priority, priority]
      });
    }
  };

  // Handle text filter change
  const handleTextFilter = (field: 'from' | 'person', value: string) => {
    setColumnFilters({
      ...columnFilters,
      [field]: value
    });
  };

  // Handle date filter change
  const handleDateFilter = (field: 'start' | 'end', value: string) => {
    setColumnFilters({
      ...columnFilters,
      dueDate: {
        ...columnFilters.dueDate,
        [field]: value
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setColumnFilters({
      priority: [],
      dueDate: { start: '', end: '' },
      from: '',
      person: ''
    });
    setActiveFilter(null);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return columnFilters.priority.length > 0 || 
           columnFilters.dueDate.start !== '' || 
           columnFilters.dueDate.end !== '' ||
           columnFilters.from !== '' ||
           columnFilters.person !== '';
  };

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log('Navigate to:', itemName);
    
    // Example navigation logic
    if (itemName === 'Dashboard') {
      navigate('/dashboard');
    } else if (itemName === 'Clients') {
      navigate('/old-ui');
    }
    // Other navigation items will be handled by the MainNavigationBar component itself
  };
  
  // Handle sidebar menu item selection
  const handleMenuSelect = (itemLabel: string) => {
    setSelectedMenu(itemLabel);
    console.log('Selected sidebar menu:', itemLabel);
  };
  
  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
    setSearchQuery(searchTerm);
  };

  // Toggle reminder completion status
  const toggleReminderCompletion = (id: number) => {
    console.log('Toggle completion for reminder:', id);
    // In a real app, this would update the state or call an API
  };

  // Add a function to handle sending a reminder
  const handleSendReminder = (id: number) => {
    console.log(`Opening send reminder dialog for ID: ${id}`);
    
    // Find the reminder from the reminder data
    const reminderItem = reminderData.find(reminder => reminder.id === id);
    
    if (reminderItem) {
      // Extract patient information from the person field
      // The format is typically "Patient Name (ID)"
      const personInfo = reminderItem.person;
      
      // Set reminder ID and open modal
      setSelectedReminderId(id);
      
      // Reset other form fields
      setReminderRecipientType('patient');
      setReminderRecipients([]);
      setReminderMessage('');
      setReminderSubject('');
      setReminderPriority('medium');
      setReminderMethod('app');
      setScheduledDate('');
      setScheduledTime('');
      setSchedulingPreset('now'); // Reset to 'now'
      setSelectedTemplate(''); // Reset selected template
      setRecipientSearchTerm('');
      setIsSearchFocused(false);
      setIncludeMe(false);
      setShowAdditionalRecipients(false); // Hide additional recipients by default when patient is selected
      setShowAllMessages(false); // Reset to showing filtered messages
      setShowRecentMessages(false); // Hide recent messages section by default
      setFormErrors({
        recipients: '',
        subject: '',
        message: '',
        scheduledTime: ''
      });
      
      // Pre-populate the subject with context from the reminder
      setReminderSubject(`Follow-up: ${reminderItem.type}`);
      
      // We don't need to auto-select the patient in the list anymore
      // Instead, we'll display them separately above the "Include me" option
      // We'll add handling for this in the UI without changing recipients state
      
      // Show the modal after setting up
      setShowReminderModal(true);
    } else {
      // Fallback if reminder not found
      setSelectedReminderId(id);
      setShowReminderModal(true);
    }
  };
  
  // Function to close the reminder modal
  const closeReminderModal = () => {
    setShowReminderModal(false);
    setSelectedReminderId(null);
    setReminderRecipientType('staff'); // Reset to staff as default
    setReminderRecipients([]);
    setReminderMessage('');
    setReminderSubject('');
    setReminderPriority('medium');
    setReminderMethod('app');
    setScheduledDate('');
    setScheduledTime('');
    setSchedulingPreset('now'); // Reset to 'now'
    setSelectedTemplate(''); // Reset selected template
    setRecipientSearchTerm('');
    setIsSearchFocused(false);
    setIncludeMe(false);
    setShowAdditionalRecipients(false); // Reset showAdditionalRecipients state
    setShowAllMessages(false); // Reset to showing filtered messages
    setShowRecentMessages(false); // Reset to hiding recent messages section
    setFormErrors({
      recipients: '',
      subject: '',
      message: '',
      scheduledTime: ''
    });
  };
  
  // Function to apply a message template
  const applyTemplate = (templateId: number) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      // Get current date and format it for placeholders
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Format time for placeholders
      const timeStr = today.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Add 1 day to today for appointment placeholders
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      
      // Replace placeholders with actual values
      let content = template.content
        .replace('[DATE]', tomorrowStr)
        .replace('[TIME]', timeStr)
        .replace('[LOCATION]', 'Conference Room A')
        .replace('[MEDICATION]', 'prescribed medication');
      
      setReminderSubject(template.title);
      setReminderMessage(content);
    }
  };
  
  // Function to handle recipient selection based on type
  const handleRecipientSelection = (id: number) => {
    let selectedIds = [...reminderRecipients];
    const stringId = id.toString();
    
    if (selectedIds.includes(stringId)) {
      selectedIds = selectedIds.filter(rid => rid !== stringId);
    } else {
      selectedIds.push(stringId);
    }
    
    setReminderRecipients(selectedIds);
  };
  
  // Function to validate form fields
  const validateForm = () => {
    const errors = {
      recipients: '',
      subject: '',
      message: '',
      scheduledTime: ''
    };
    
    // Check if we have an auto-selected patient from a reminder
    const hasAutoSelectedPatient = selectedReminderId && 
                                  getPatientFromReminder(selectedReminderId) && 
                                  reminderRecipientType === 'patient';
    
    // Validate recipients - don't show error if includeMe is true or we have an auto-selected patient
    if (reminderRecipients.length === 0 && !includeMe && !hasAutoSelectedPatient) {
      errors.recipients = 'Please select at least one recipient or include yourself';
    }
    
    // Validate subject for urgent messages
    if (reminderPriority === 'urgent' && !reminderSubject.trim()) {
      errors.subject = 'Subject is required for urgent messages';
    }
    
    // Validate message
    if (!reminderMessage.trim()) {
      errors.message = 'Message content is required';
    }
    
    // Validate scheduled time if date is set and not using a preset
    if (schedulingPreset !== 'now') {
      if (scheduledDate && !scheduledTime) {
        errors.scheduledTime = 'Please set a time for the scheduled date';
      }
    }
    
    setFormErrors(errors);
    
    // Form is valid if no error messages exist
    return !Object.values(errors).some(error => error);
  };
  
  // Function to send the reminder
  const sendReminder = () => {
    // Validate form before sending
    if (!validateForm()) {
      return;
    }

    // Prepare recipients list and summary
    const recipientsList = [...reminderRecipients];
    let recipientSummary = '';
    
    // Add auto-selected patient from reminder if available
    const autoSelectedPatient = selectedReminderId ? getPatientFromReminder(selectedReminderId) : null;
    let hasAutoSelectedPatient = false;
    
    if (autoSelectedPatient && reminderRecipientType === 'patient') {
      hasAutoSelectedPatient = true;
      recipientSummary = autoSelectedPatient.name;
    }
    
    // Add other selected recipients to the summary
    if (reminderRecipients.length > 0) {
      switch (reminderRecipientType) {
        case 'staff':
          const staffMember = staffMembers.find(s => s.id.toString() === reminderRecipients[0]);
          recipientSummary = reminderRecipients.length > 1 
            ? `${staffMember?.name || "Unknown"} +${reminderRecipients.length - 1} more`
            : staffMember?.name || "Unknown";
          break;
        case 'patient':
          const patient = patients.find(p => p.id.toString() === reminderRecipients[0]);
          recipientSummary = reminderRecipients.length > 1 
            ? `${patient?.name || "Unknown"} +${reminderRecipients.length - 1} more`
            : patient?.name || "Unknown";
          // If we also have an auto-selected patient, add it to the summary
          if (hasAutoSelectedPatient && autoSelectedPatient) {
            recipientSummary = `${autoSelectedPatient.name} + ${recipientSummary}`;
          }
          break;
        case 'group':
          const group = groups.find(g => g.id.toString() === reminderRecipients[0]);
          recipientSummary = reminderRecipients.length > 1 
            ? `${group?.name || "Unknown"} +${reminderRecipients.length - 1} more`
            : group?.name || "Unknown";
          break;
      }
    } else if (hasAutoSelectedPatient && autoSelectedPatient) {
      // If we only have the auto-selected patient
      recipientSummary = autoSelectedPatient.name;
    }
    
    // Add current user if includeMe is true
    if (includeMe) {
      recipientSummary = recipientSummary 
        ? `${recipientSummary} + You (${currentUser.name})`
        : `You (${currentUser.name})`;
    }
    
    // Get delivery time text
    let deliveryTimeText = 'immediately';
    if (schedulingPreset !== 'now') {
      if (scheduledDate) {
        const dateObj = new Date(scheduledDate);
        const timeObj = scheduledTime ? new Date(`2000-01-01T${scheduledTime}`) : new Date();
        
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(dateObj);
        
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(timeObj);
        
        deliveryTimeText = `on ${formattedDate} at ${formattedTime}`;
      }
    }

    // In a real app, this would make an API call to send the reminder
    console.log("Sending reminder:", {
      recipientType: reminderRecipientType,
      selectedRecipients: reminderRecipients,
      autoSelectedPatient: hasAutoSelectedPatient ? autoSelectedPatient : null,
      includeCurrentUser: includeMe,
      currentUserInfo: includeMe ? currentUser : null,
      subject: reminderSubject,
      message: reminderMessage,
      priority: reminderPriority,
      method: reminderMethod,
      schedulingPreset,
      scheduledDate: scheduledDate || 'now',
      scheduledTime: scheduledTime || 'now',
      deliveryTimeText
    });
    
    // Add to recent messages
    const newMessage: MessageType = {
      id: Date.now(),
      subject: reminderSubject || "No Subject",
      recipient: recipientSummary || "No recipients",
      recipientType: hasAutoSelectedPatient ? "patient" : 
                     includeMe && reminderRecipients.length === 0 ? "self" : 
                     reminderRecipientType,
      sentDate: new Date().toISOString(),
      status: schedulingPreset === 'now' ? "sent" : "scheduled",
      // Add scheduled date/time for scheduled messages
      ...(schedulingPreset !== 'now' && {
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime
      })
    };
    
    setRecentMessages([newMessage, ...recentMessages.slice(0, 9)]);
    
    // Close the modal
    closeReminderModal();
    
    // Show confirmation
    if (schedulingPreset === 'now') {
      alert(`Reminder sent successfully!`);
    } else {
      alert(`Reminder scheduled successfully! It will be sent ${deliveryTimeText}.`);
    }
  };
  
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to filter recipients based on search term
  const getFilteredRecipients = () => {
    const searchTerm = recipientSearchTerm.toLowerCase().trim();
    
    if (!searchTerm) {
      return {
        filteredStaff: staffMembers,
        filteredPatients: patients,
        filteredGroups: groups
      };
    }
    
    const filteredStaff = staffMembers.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm) || 
      staff.role.toLowerCase().includes(searchTerm)
    );
    
    const filteredPatients = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) || 
      patient.mrn.toLowerCase().includes(searchTerm)
    );
    
    const filteredGroups = groups.filter(group => 
      group.name.toLowerCase().includes(searchTerm)
    );
    
    return {
      filteredStaff,
      filteredPatients,
      filteredGroups
    };
  };

  // Toggle all selected reminders
  const toggleSelectAll = () => {
    if (selectedReminders.length === filteredReminders.length) {
      setSelectedReminders([]);
    } else {
      setSelectedReminders(filteredReminders.map(r => r.id));
    }
  };

  // Toggle selection of a single reminder
  const toggleSelectReminder = (id: number) => {
    if (selectedReminders.includes(id)) {
      setSelectedReminders(selectedReminders.filter(r => r !== id));
    } else {
      setSelectedReminders([...selectedReminders, id]);
    }
  };

  // Mark selected reminders as complete
  const markSelectedAsComplete = () => {
    console.log('Mark as complete:', selectedReminders);
    // In a real app, this would update the state or call an API
  };

  // Update the filteredReminders to include column filters
  const filteredReminders = reminderData.filter(reminder => {
    // Filter by completion status
    if (!filterOptions.showCompleted && reminder.isCompleted) {
      return false;
    }
    
    // Filter by priority if priority filters are selected
    if (columnFilters.priority.length > 0 && !columnFilters.priority.includes(reminder.priority)) {
      return false;
    }
    
    // Filter by date range
    if (columnFilters.dueDate.start && new Date(reminder.dueDate) < new Date(columnFilters.dueDate.start)) {
      return false;
    }
    if (columnFilters.dueDate.end && new Date(reminder.dueDate) > new Date(columnFilters.dueDate.end)) {
      return false;
    }
    
    // Filter by from
    if (columnFilters.from && !reminder.from.toLowerCase().includes(columnFilters.from.toLowerCase())) {
      return false;
    }
    
    // Filter by person
    if (columnFilters.person && !reminder.person.toLowerCase().includes(columnFilters.person.toLowerCase())) {
      return false;
    }
    
    // Filter by view mode
    if (viewMode === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reminderDate = new Date(reminder.dueDate);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === today.getTime();
    } else if (viewMode === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reminderDate = new Date(reminder.dueDate);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() > today.getTime();
    } else if (viewMode === 'overdue') {
      return reminder.isOverdue;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        reminder.person.toLowerCase().includes(query) ||
        reminder.description.toLowerCase().includes(query) ||
        reminder.from.toLowerCase().includes(query) ||
        reminder.priority.toLowerCase().includes(query) ||
        reminder.type.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Add a sort function
  const handleSort = (field: string) => {
    // If clicking the same field, toggle direction, otherwise default to ascending
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort the filtered reminders
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    // Helper for comparing values
    const compareValues = (valA: any, valB: any) => {
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    };

    switch (sortField) {
      case 'priority':
        // Priority order: High, Medium, Low
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return sortDirection === 'asc' 
          ? priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'dueDate':
        return compareValues(new Date(a.dueDate), new Date(b.dueDate));
      case 'from':
        return compareValues(a.from, b.from);
      case 'person':
        return compareValues(a.person, b.person);
      default:
        return 0;
    }
  });

  // Get priority color class
  const getPriorityColorClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get type color class and icon
  const getTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'appointment':
        return { 
          colorClass: 'bg-purple-100 text-purple-800', 
          icon: <CalendarDaysIcon className="h-3 w-3 mr-1" /> 
        };
      case 'evaluation':
        return { 
          colorClass: 'bg-blue-100 text-blue-800', 
          icon: <ClipboardDocumentCheckIcon className="h-3 w-3 mr-1" /> 
        };
      case 'form':
        return { 
          colorClass: 'bg-orange-100 text-orange-800', 
          icon: <DocumentIcon className="h-3 w-3 mr-1" /> 
        };
      case 'check-in':
        return { 
          colorClass: 'bg-green-100 text-green-800', 
          icon: <CheckCircleIcon className="h-3 w-3 mr-1" /> 
        };
      default:
        return { 
          colorClass: 'bg-gray-100 text-gray-800', 
          icon: <BellIcon className="h-3 w-3 mr-1" /> 
        };
    }
  };
  
  // Add useEffect to simulate initial data loading
  useEffect(() => {
    // Simulate initial data loading (would be an API call in real app)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Create a skeleton loading component for reminders
  const RemindersSkeletonLoading = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
                <TableHead className="w-[200px]">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  
  // Create a skeleton loading component for messages
  const MessagesSkeletonLoading = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Message list skeleton */}
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-4 border-b flex">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
          <div className="ml-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Generic skeleton loading for other tabs
  const GenericSkeletonLoading = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 border-b">
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
      
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 border-b">
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Handle sidebar collapse state change
  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Function to handle search term change
  const handleSearchChange = (value: string) => {
    setRecipientSearchTerm(value);
  };
  
  // Function to apply a search term from recent searches
  const applyRecentSearch = (term: string) => {
    setRecipientSearchTerm(term);
    
    // Move this term to the front of recent searches
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5); // Keep only the 5 most recent
    
    setRecentSearches(updatedSearches);
  };
  
  // Function to save a search term
  const saveSearch = () => {
    if (!recipientSearchTerm.trim() || recentSearches.includes(recipientSearchTerm.trim())) {
      return;
    }
    
    const updatedSearches = [
      recipientSearchTerm.trim(),
      ...recentSearches
    ].slice(0, 5); // Keep only the 5 most recent
    
    setRecentSearches(updatedSearches);
  };

  // Function to select all filtered recipients
  const handleSelectAllFiltered = (checked: boolean) => {
    const { filteredStaff, filteredPatients, filteredGroups } = getFilteredRecipients();
    
    let idsToSelect: string[] = [];
    
    if (reminderRecipientType === 'staff') {
      idsToSelect = filteredStaff.map(staff => staff.id.toString());
    } else if (reminderRecipientType === 'patient') {
      idsToSelect = filteredPatients.map(patient => patient.id.toString());
    } else if (reminderRecipientType === 'group') {
      idsToSelect = filteredGroups.map(group => group.id.toString());
    }
    
    if (checked) {
      // Add all filtered IDs to current selection (avoiding duplicates)
      const newSelection = [...new Set([...reminderRecipients, ...idsToSelect])];
      setReminderRecipients(newSelection);
    } else {
      // Remove all filtered IDs from current selection
      const newSelection = reminderRecipients.filter(id => !idsToSelect.includes(id));
      setReminderRecipients(newSelection);
    }
  };
  
  // Function to check if all filtered items are selected
  const areAllFilteredSelected = () => {
    const { filteredStaff, filteredPatients, filteredGroups } = getFilteredRecipients();
    
    let filteredIds: string[] = [];
    
    if (reminderRecipientType === 'staff') {
      filteredIds = filteredStaff.map(staff => staff.id.toString());
    } else if (reminderRecipientType === 'patient') {
      filteredIds = filteredPatients.map(patient => patient.id.toString());
    } else if (reminderRecipientType === 'group') {
      filteredIds = filteredGroups.map(group => group.id.toString());
    }
    
    // If there are no filtered items, return false
    if (filteredIds.length === 0) return false;
    
    // Check if all filtered IDs are in the current selection
    return filteredIds.every(id => reminderRecipients.includes(id));
  };

  // Helper function to get patient information from a reminder
  const getPatientFromReminder = (reminderId: number | null) => {
    if (!reminderId) return null;
    
    const reminderItem = reminderData.find(reminder => reminder.id === reminderId);
    if (!reminderItem || !reminderItem.person) return null;
    
    // Extract the name and ID from the person field
    const personInfo = reminderItem.person;
    const patientName = personInfo.split('(')[0].trim();
    
    // Try to extract the ID
    let patientId = '';
    const idMatch = personInfo.match(/\(([^)]+)\)/);
    if (idMatch && idMatch[1]) {
      patientId = idMatch[1];
    }
    
    return {
      name: patientName,
      id: patientId,
      fullInfo: personInfo,
      reminderType: reminderItem.type
    };
  };

  // Function to handle creating a new reminder (without auto-selecting a patient)
  const handleNewReminder = () => {
    console.log(`Opening new reminder dialog`);
    
    // Reset the modal state for a fresh reminder
    setSelectedReminderId(null);
    setReminderRecipientType('staff'); // Default to staff type for new reminders
    setReminderRecipients([]);
    setReminderMessage('');
    setReminderSubject('');
    setReminderPriority('medium');
    setReminderMethod('app');
    setScheduledDate('');
    setScheduledTime('');
    setSchedulingPreset('now'); // Reset to 'now'
    setSelectedTemplate(''); // Reset selected template
    setRecipientSearchTerm('');
    setIsSearchFocused(false);
    setIncludeMe(false);
    setShowAdditionalRecipients(true); // Always show recipient selection for new reminders
    setShowAllMessages(false); // Reset to showing filtered messages
    setShowRecentMessages(false); // Hide recent messages section by default
    setFormErrors({
      recipients: '',
      subject: '',
      message: '',
      scheduledTime: ''
    });
    
    // Show the modal
    setShowReminderModal(true);
  };

  // Handle onClick event for New Reminder button
  const onNewReminderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleNewReminder();
  };

  // Function to get contextual recent messages based on current scenario
  const getContextualRecentMessages = (): MessageType[] => {
    // If there's an auto-selected patient, filter messages sent to that patient
    if (selectedReminderId && getPatientFromReminder(selectedReminderId)) {
      const patientInfo = getPatientFromReminder(selectedReminderId);
      
      if (patientInfo) {
        // Filter messages that were sent to this patient
        const patientMessages = recentMessages.filter(message => 
          message.recipient.toLowerCase().includes(patientInfo.name.toLowerCase()) || 
          (message.recipientType === 'patient' && message.recipient.includes(patientInfo.id))
        );
        
        // If no messages found for this patient, generate a sample message
        if (patientMessages.length === 0) {
          // Create a sample message based on the reminder type
          const reminderType = patientInfo.reminderType || 'Appointment';
          const sampleMessage: MessageType = {
            id: 0, // Use 0 to clearly identify this as a generated message
            subject: `${reminderType} Reminder`,
            recipient: patientInfo.name,
            recipientType: "patient",
            sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            status: "delivered",
            isSampleMessage: true // Flag to identify this as a sample
          };
          
          return [sampleMessage];
        }
        
        return patientMessages;
      }
    }
    
    // For staff-specific view when staff type is selected with no specific patient
    if (reminderRecipientType === 'staff' && reminderRecipients.length > 0) {
      const staffId = reminderRecipients[0];
      const selectedStaff = staffMembers.find(s => s.id.toString() === staffId);
      
      if (selectedStaff) {
        return recentMessages.filter(message => 
          message.recipient.toLowerCase().includes(selectedStaff.name.toLowerCase()) ||
          message.recipientType === 'staff'
        );
      }
    }
    
    // For group-specific view
    if (reminderRecipientType === 'group' && reminderRecipients.length > 0) {
      const groupId = reminderRecipients[0];
      const selectedGroup = groups.find(g => g.id.toString() === groupId);
      
      if (selectedGroup) {
        return recentMessages.filter(message => 
          message.recipient.toLowerCase().includes(selectedGroup.name.toLowerCase()) ||
          message.recipientType === 'group'
        );
      }
    }
    
    // If "Include me" is selected but no other recipients, show messages sent by/to current user
    if (includeMe && reminderRecipients.length === 0 && !selectedReminderId) {
      return recentMessages.filter(message => 
        message.recipient.includes('You') || 
        message.recipient.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        message.recipientType === 'self'
      );
    }
    
    // Default: show all recent messages
    return recentMessages;
  };

  // Update the recent messages section whenever recipients change
  useEffect(() => {
    // This will trigger a re-render of the recent messages section
    // when reminderRecipients or selectedReminderId changes
    console.log("Recipients changed, updating recent messages view");
    // No need to do anything else as getContextualRecentMessages() will be called during render
  }, [reminderRecipients, selectedReminderId, reminderRecipientType, includeMe]);

  // State to track whether to show all messages or only contextual messages
  const [showAllMessages, setShowAllMessages] = useState(false);

  // State to control visibility of the Recently Sent Messages section
  const [showRecentMessages, setShowRecentMessages] = useState(false);

  // Function to get messages based on filter setting and context
  const getFilteredMessages = (): MessageType[] => {
    // If showAllMessages is true, or there's no context to filter by, show all
    if (showAllMessages || 
        (!selectedReminderId && reminderRecipients.length === 0)) {
      return recentMessages;
    }
    
    // Otherwise, show contextual messages
    return getContextualRecentMessages();
  };

  // Function to handle scheduling preset selection
  const handleSchedulingPreset = (preset: string) => {
    setSchedulingPreset(preset);
    
    const now = new Date();
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };
    
    const formatTime = (date: Date) => {
      return date.toTimeString().substring(0, 5); // HH:MM format
    };
    
    // Handle different preset options
    switch(preset) {
      case 'now':
        // Clear the scheduled date and time
        setScheduledDate('');
        setScheduledTime('');
        break;
        
      case 'tomorrow':
        // Set for tomorrow at the same time
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(formatDate(tomorrow));
        setScheduledTime(formatTime(now));
        break;
        
      case '2days':
        // Set for 2 days from now
        const twoDays = new Date(now);
        twoDays.setDate(twoDays.getDate() + 2);
        setScheduledDate(formatDate(twoDays));
        setScheduledTime(formatTime(now));
        break;
        
      case '1week':
        // Set for 1 week from now
        const oneWeek = new Date(now);
        oneWeek.setDate(oneWeek.getDate() + 7);
        setScheduledDate(formatDate(oneWeek));
        setScheduledTime(formatTime(now));
        break;
        
      case '2weeks':
        // Set for 2 weeks from now
        const twoWeeks = new Date(now);
        twoWeeks.setDate(twoWeeks.getDate() + 14);
        setScheduledDate(formatDate(twoWeeks));
        setScheduledTime(formatTime(now));
        break;
        
      case 'custom':
        // Keep the existing values for custom scheduling
        break;
        
      default:
        // Default to now
        setScheduledDate('');
        setScheduledTime('');
        break;
    }
  };

  // Format time for display
  const formatTime = (time: string) => {
    return time ? time.replace(/:00$/, '') : '';
  };

  // View toggle component for the header
  const ViewToggle: React.FC<{ 
    activeView: 'card' | 'table'; 
    onViewChange: (view: 'card' | 'table') => void 
  }> = ({ activeView, onViewChange }) => {
    return (
      <div className="flex border rounded-md overflow-hidden">
        <button
          className={cn(
            "flex items-center justify-center px-2 py-1.5 border-r",
            activeView === 'card' 
              ? "bg-[#1C75BC] text-white hover:bg-[#1667A5]" 
              : "bg-white text-gray-500 hover:bg-gray-50"
          )}
          onClick={() => onViewChange('card')}
          aria-label="Card View"
        >
          <Squares2X2Icon className="h-4 w-4" />
        </button>
        <button
          className={cn(
            "flex items-center justify-center px-2 py-1.5",
            activeView === 'table' 
              ? "bg-[#1C75BC] text-white hover:bg-[#1667A5]" 
              : "bg-white text-gray-500 hover:bg-gray-50"
          )}
          onClick={() => onViewChange('table')}
          aria-label="Table View"
        >
          <TableCellsIcon className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Add these state variables after other state declarations
  const [statusSearch, setStatusSearch] = useState('');
  const [prioritySearch, setPrioritySearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  // Add these filter functions after other functions
  const getFilteredStatuses = () => {
    const statuses = ['All', 'Today', 'Upcoming', 'Overdue'];
    return statuses.filter(status => 
      status.toLowerCase().includes(statusSearch.toLowerCase())
    );
  };

  const getFilteredPriorities = () => {
    const priorities = ['All', 'High', 'Medium', 'Low'];
    return priorities.filter(priority => 
      priority.toLowerCase().includes(prioritySearch.toLowerCase())
    );
  };

  const getFilteredTypes = () => {
    const types = ['All', 'Appointment', 'Evaluation', 'Form'];
    return types.filter(type => 
      type.toLowerCase().includes(typeSearch.toLowerCase())
    );
  };

  // Add this after other state declarations
  const [dropdownPositions, setDropdownPositions] = useState<{ [key: string]: { top: string; left: string } }>({});

  // Add this function after other function declarations
  const updateDropdownPosition = (filterName: string) => {
    const buttonElement = document.querySelector(`button[data-filter="${filterName}"]`);
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setDropdownPositions(prev => ({
        ...prev,
        [filterName]: {
          top: `${rect.bottom + window.scrollY + 4}px`,
          left: `${rect.left + window.scrollX}px`
        }
      }));
    }
  };

  // Inbox Groups data
  const inboxGroups = [
    { id: 1, name: "Nursing Team A", description: "Messages related to Nursing Team A", count: 15 },
    { id: 2, name: "Nursing Team B", description: "Messages related to Nursing Team B", count: 12 },
    { id: 3, name: "ICU Staff", description: "Messages related to ICU Staff", count: 10 },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={handleSearch}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Inbox"
        onNavigate={handleMainNavigation}
      />

      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          items={inboxSidebarItems}
          activeItem={selectedMenu}
          onMenuSelect={handleMenuSelect}
          onSearch={(term) => console.log('Sidebar search:', term)}
          defaultCollapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
        />

        {/* Activity Center Vertical Tab Bar - Only show when Activity Center is selected */}
        {selectedMenu === 'Activity Center' && (
          <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center py-6 overflow-y-auto">
            {activityCenterTabs.map((tab, index) => (
              <div 
                key={tab.id}
                className="relative mb-6 w-full flex justify-center"
              >
                <button
                  onClick={() => handleTabChange(tab.label)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                    activeTopTab === tab.label 
                      ? 'bg-blue-100' 
                      : 'hover:bg-gray-100'
                  }`}
                  aria-label={tab.label}
                  title={tab.label}
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById(`tooltip-${index}`);
                    if (tooltip) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      
                      // Calculate position to ensure tooltip appears to the right
                      // rect.right will give us the right edge of the button
                      // Adding 15px for breathing space
                      tooltip.style.top = `${rect.top + (rect.height/2) - 30}px`;
                      tooltip.style.left = `${rect.right + 15}px`;
                      tooltip.style.display = 'block';
                      tooltip.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById(`tooltip-${index}`);
                    if (tooltip) {
                      tooltip.style.display = 'none';
                      tooltip.style.opacity = '0';
                    }
                  }}
                >
                  {/* Alert indicator */}
                  {tab.hasAlert && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                  
                  {/* Icon */}
                  <div className={`h-5 w-5 ${activeTopTab === tab.label ? 'text-blue-600' : 'text-gray-500'}`}>
                    {tab.icon}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Tooltips rendered outside the tab bar */}
        {selectedMenu === 'Activity Center' && activityCenterTabs.map((tab, index) => (
          <div 
            key={`tooltip-${tab.id}`}
            id={`tooltip-${index}`}
            className="fixed hidden opacity-0 z-[9999] bg-white shadow-lg rounded-md px-3 py-2 text-sm max-w-[200px] transition-opacity duration-200 border border-gray-200"
            style={{ pointerEvents: 'none' }}
          >
            {/* Left-pointing triangle */}
            <div className="absolute -left-2 top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent z-10"></div>
            <div className="absolute -left-[9px] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-gray-200 border-b-[8px] border-b-transparent z-[5]"></div>
            
            <div className="font-semibold">{tab.label}</div>
            {tab.description && <div className="text-gray-600 mt-1">{tab.description}</div>}
            {tab.count !== undefined && tab.count > 0 && (
              <div className="mt-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tab.count} {tab.count === 1 ? 'item' : 'items'}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {/* Activity Center content area - Only show when Activity Center is selected */}
        {selectedMenu === 'Activity Center' && (
          <div className={`flex-1 bg-gradient-to-br from-orange-50/70 to-blue-50 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-0' : ''}`}>
            {/* Page Header */}
            <div className="bg-white/0 p-4 mb-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800 mr-4">
                    {activeTopTab} ({filteredReminders.length})
                  </h1>
                  {activeTopTab === 'Upcoming Appointments' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Search appointments..."
                        value={appointmentSearchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentSearchQuery(e.target.value)}
                        className="pl-9 w-64 py-2 h-9 text-sm border-gray-200 rounded-full shadow-sm focus:border-[#1C75BC] focus:ring-[#1C75BC]/20"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {activeTopTab === 'Upcoming Appointments' ? (
                    <>
                      {/* Filter options for Upcoming Appointments */}
                      <div className="mr-2 flex items-center">
                        <button className={`px-3 py-1 text-xs font-medium rounded-full mr-1 ${selectedFilter === 'all' ? 'bg-[#1C75BC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setSelectedFilter('all')}>
                          All
                        </button>
                        <button className={`px-3 py-1 text-xs font-medium rounded-full mr-1 ${selectedFilter === 'today' ? 'bg-[#1C75BC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setSelectedFilter('today')}>
                          Today
                        </button>
                        <button className={`px-3 py-1 text-xs font-medium rounded-full mr-1 ${selectedFilter === 'week' ? 'bg-[#1C75BC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setSelectedFilter('week')}>
                          This Week
                        </button>
                        <button className={`px-3 py-1 text-xs font-medium ${selectedFilter === 'virtual' ? 'bg-[#1C75BC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setSelectedFilter('virtual')}>
                          Virtual
                        </button>
                        <div className="ml-2">
                          <ViewToggle activeView={appointmentViewMode} onViewChange={setAppointmentViewMode} />
                        </div>
                      </div>
                      
                      <button className="bg-[#1C75BC] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-[#1667A5]">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        New Appointment
                      </button>
                    </>
                  ) : null}
                  
                  <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-blue-100">
                    <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                    Refresh
                  </button>
                  
                  <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-blue-100">
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-1.5" />
                    View Logs
                  </button>

                  <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-blue-100">
                    <UserGroupIcon className="h-4 w-4 mr-1.5" />
                    Inbox Groups
                  </button>

                  {activeTopTab === 'Reminders' && (
                    <button 
                      className="bg-[#1C75BC] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-[#1C75BC]/90"
                      onClick={onNewReminderClick}
                    >
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      New Reminder
                    </button>
                  )}
                  {activeTopTab === 'Messages' && (
                    <button className="bg-[#1C75BC] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center hover:bg-[#1C75BC]/90">
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      New Message
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              {/* View Selector Tabs - Only show for Reminders */}
              {activeTopTab === 'Reminders' && (
                <>
                  <div className="space-y-4">
                    {/* Filters and Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search reminders"
                            className="h-8 w-[150px] lg:w-[180px] rounded-md border-0 bg-white/90 px-2 text-sm shadow-none ring-1 ring-gray-200 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button
                          data-filter="status"
                          onClick={() => toggleFilter('status')}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm h-8 border-0 bg-white px-3 ring-1 ring-gray-200 hover:bg-gray-100 transition-all"
                        >
                          {viewMode === 'all' ? 'Status' : viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </button>
                        <button
                          data-filter="priority"
                          onClick={() => toggleFilter('priority')}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm h-8 border-0 bg-white px-3 ring-1 ring-gray-200 hover:bg-gray-100 transition-all"
                        >
                          {filterOptions.priorityFilter === 'all' ? 'Priority' : filterOptions.priorityFilter.charAt(0).toUpperCase() + filterOptions.priorityFilter.slice(1)}
                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </button>
                        <button
                          data-filter="type"
                          onClick={() => toggleFilter('type')}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm h-8 border-0 bg-white px-3 ring-1 ring-gray-200 hover:bg-gray-100 transition-all"
                        >
                          {filterOptions.typeFilter === 'all' ? 'Type' : filterOptions.typeFilter.charAt(0).toUpperCase() + filterOptions.typeFilter.slice(1)}
                          <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </button>

                        {/* Status Dropdown */}
                        {activeFilter === 'status' && (
                          <div
                            ref={(el) => (filterRefs.current['status'] = el)}
                            className="fixed min-w-[180px] rounded-md border border-gray-200 bg-white shadow-lg z-50"
                            style={dropdownPositions['status']}
                          >
                            <div className="p-2">
                              <input
                                type="text"
                                placeholder="Filter statuses..."
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                                value={statusSearch}
                                onChange={(e) => setStatusSearch(e.target.value)}
                              />
                            </div>
                            <div className="p-2">
                              <div className="space-y-1">
                                {getFilteredStatuses().map((status: string) => (
                                  <button
                                    key={status}
                                    className={`w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-gray-100 ${
                                      viewMode === status.toLowerCase() ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => {
                                      setViewMode(status.toLowerCase());
                                      setActiveFilter(null);
                                      setStatusSearch('');
                                    }}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Priority Dropdown */}
                        {activeFilter === 'priority' && (
                          <div
                            ref={(el) => (filterRefs.current['priority'] = el)}
                            className="fixed min-w-[180px] rounded-md border border-gray-200 bg-white shadow-lg z-50"
                            style={dropdownPositions['priority']}
                          >
                            <div className="p-2">
                              <input
                                type="text"
                                placeholder="Filter priorities..."
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                                value={prioritySearch}
                                onChange={(e) => setPrioritySearch(e.target.value)}
                              />
                            </div>
                            <div className="p-2">
                              <div className="space-y-1">
                                {getFilteredPriorities().map((priority: string) => (
                                  <button
                                    key={priority}
                                    className={`w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-gray-100 ${
                                      filterOptions.priorityFilter === priority.toLowerCase() ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => {
                                      setFilterOptions({ ...filterOptions, priorityFilter: priority.toLowerCase() });
                                      setActiveFilter(null);
                                      setPrioritySearch('');
                                    }}
                                  >
                                    {priority}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Type Dropdown */}
                        {activeFilter === 'type' && (
                          <div
                            ref={(el) => (filterRefs.current['type'] = el)}
                            className="fixed min-w-[180px] rounded-md border border-gray-200 bg-white shadow-lg z-50"
                            style={dropdownPositions['type']}
                          >
                            <div className="p-2">
                              <input
                                type="text"
                                placeholder="Filter types..."
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                                value={typeSearch}
                                onChange={(e) => setTypeSearch(e.target.value)}
                              />
                            </div>
                            <div className="p-2">
                              <div className="space-y-1">
                                {getFilteredTypes().map((type: string) => (
                                  <button
                                    key={type}
                                    className={`w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-gray-100 ${
                                      filterOptions.typeFilter === type.toLowerCase() ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => {
                                      setFilterOptions({ ...filterOptions, typeFilter: type.toLowerCase() });
                                      setActiveFilter(null);
                                      setTypeSearch('');
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="show-completed"
                            className="h-4 w-4 rounded-sm border-gray-200 text-gray-900"
                            checked={filterOptions.showCompleted}
                            onChange={(e) => setFilterOptions({ ...filterOptions, showCompleted: e.target.checked })}
                          />
                          <label htmlFor="show-completed" className="text-sm text-gray-500">
                            Show Completed
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Reminders Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/50">
                              <TableHead className="w-[40px] pl-4">
                                <div className="flex items-center justify-center">
                                  <Checkbox 
                                    checked={selectedReminders.length === filteredReminders.length}
                                    onCheckedChange={toggleSelectAll}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="w-[100px]">Priority</TableHead>
                              <TableHead>From</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Person</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[100px]">Type</TableHead>
                              <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedReminders.map((reminder) => (
                              <TableRow key={reminder.id} className="h-[45px]">
                                <TableCell className="pl-4">
                                  <div className="flex items-center justify-center">
                                    <Checkbox 
                                      checked={selectedReminders.includes(reminder.id)}
                                      onCheckedChange={() => toggleSelectReminder(reminder.id)}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className={`text-sm font-medium ${getPriorityColorClass(reminder.priority)}`}>
                                    {reminder.priority}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{reminder.from}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm text-gray-600">
                                      {format(new Date(reminder.dueDate), 'MMM d, yyyy')}
                                    </span>
                                    {reminder.isOverdue && (
                                      <Badge variant="destructive" className="text-[10px] h-[18px]">
                                        Overdue
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{reminder.person}</TableCell>
                                <TableCell className="text-sm max-w-md">
                                  <div className="truncate">{reminder.description}</div>
                                </TableCell>
                                <TableCell>
                                  {(() => {
                                    const { colorClass, icon } = getTypeInfo(reminder.type);
                                    return (
                                      <Badge variant="outline" className={`text-[10px] h-[18px] flex items-center ${colorClass}`}>
                                        {icon}
                                        {reminder.type}
                                      </Badge>
                                    );
                                  })()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleSendReminder(reminder.id)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      <PaperAirplaneIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => toggleReminderCompletion(reminder.id)}
                                      className={`${
                                        reminder.isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
                                      }`}
                                    >
                                      <CheckCircleIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Add filter status and reset button */}
                    {hasActiveFilters() && (
                      <div className="px-4 py-2 bg-blue-50 flex justify-between items-center border-b border-blue-100">
                        <div className="text-xs text-blue-700">
                          <span className="font-medium">{filteredReminders.length}</span> results with filters applied
                        </div>
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                          onClick={resetFilters}
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}

                    {/* Pagination */}
                    {filteredReminders.length > 0 && (
                      <div className="flex justify-between items-center text-sm text-gray-500 px-2">
                        <div>
                          Showing {filteredReminders.length} of {reminderData.length} reminders
                        </div>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 rounded hover:bg-gray-100">
                            <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
                          </button>
                          <span className="px-2">1</span>
                          <button className="p-1 rounded hover:bg-gray-100">
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Messages Tab Content */}
              {activeTopTab === 'Messages' && selectedMenu === 'Activity Center' && (
                isLoading ? (
                  <MessagesSkeletonLoading />
                ) : (
                  <>
                    {/* Inbox Groups */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Inbox Groups</h3>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <PlusIcon className="w-4 h-4 mr-1" />
                          New Group
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inboxGroups.map((group) => (
                          <Card key={group.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium">{group.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {group.count} messages
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">{group.description}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <EllipsisHorizontalIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Messages Content */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                      <Messages />
                    </div>
                  </>
                )
              )}
              
              {/* Review Forms Tab Content */}
              {activeTopTab === 'Review Forms' && selectedMenu === 'Activity Center' && (
                isLoading ? (
                  <GenericSkeletonLoading />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ReviewFormsWidget />
                  </div>
                )
              )}
              
              {/* Transactions Reviews Tab Content */}
              {activeTopTab === 'Transactions Reviews' && (
                isLoading ? (
                  <GenericSkeletonLoading />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <TransactionsReviewsWidget />
                  </div>
                )
              )}
              
              {/* Other tabs content with skeleton loading */}
              {['Transactions Reviews', 'DrFirst Notifications', 'Birthdays', 'Unbilled Encounters', 'Authorization(s)'].includes(activeTopTab) && (
                isLoading ? (
                  <GenericSkeletonLoading />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Other tabs content */}
                    <p className="p-4 text-gray-500">{activeTopTab} content will be displayed here.</p>
                  </div>
                )
              )}
              
              {/* Upcoming Appointments Tab Content */}
              {activeTopTab === 'Upcoming Appointments' && (
                isLoading ? (
                  <GenericSkeletonLoading />
                ) : (
                  <div className="rounded-lg overflow-hidden p-4 h-[calc(100vh-220px)]">
                    <UpcomingAppointments 
                      activeFilter={selectedFilter}
                      viewMode={appointmentViewMode}
                      onViewModeChange={setAppointmentViewMode}
                      searchQuery={appointmentSearchQuery}
                      onSearchChange={setAppointmentSearchQuery}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
        
        {/* Content for non-Activity Center sidebar menu items */}
        {selectedMenu !== 'Activity Center' && (
          <div className={`flex-1 flex items-center justify-center bg-gray-50 p-8 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-0' : ''}`}>
            {isLoading ? (
              <GenericSkeletonLoading />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  {inboxSidebarItems.find(item => item.label === selectedMenu)?.icon || <ArchiveBoxIcon className="h-16 w-16" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedMenu} Content
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  This is a placeholder for the {selectedMenu.toLowerCase()} content. 
                  In a complete implementation, this area would display the relevant data and functionality for {selectedMenu.toLowerCase()}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-blue-800">Send Reminder</h2>
              <button 
                onClick={closeReminderModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content - Two Column Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Main Form Area */}
              <div className={`transition-all duration-300 ease-in-out ${showRecentMessages ? 'w-2/3' : 'w-full'} p-6 overflow-y-auto`}>
                {/* Recipient Type Selection and Recent Messages Toggle in same row */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                          reminderRecipientType === 'staff' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setReminderRecipientType('staff')}
                      >
                        <UserIcon className="h-3.5 w-3.5 inline mr-1.5" />
                        Staff
                      </button>
                      <button 
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                          reminderRecipientType === 'patient' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setReminderRecipientType('patient')}
                      >
                        <UserIcon className="h-3.5 w-3.5 inline mr-1.5" />
                        Patients
                      </button>
                      <button 
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                          reminderRecipientType === 'group' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setReminderRecipientType('group')}
                      >
                        <UserGroupIcon className="h-3.5 w-3.5 inline mr-1.5" />
                        Groups
                      </button>
                    </div>
                  </div>
                  
                  {/* Toggle button for Recent Messages section */}
                  <button 
                    onClick={() => setShowRecentMessages(!showRecentMessages)}
                    className="text-xs px-3 py-1.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 flex items-center h-fit self-end transition-colors duration-200"
                  >
                    {showRecentMessages ? (
                      <>
                        <EyeSlashIcon className="h-3.5 w-3.5 mr-1.5" />
                        Hide Recent Messages
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                        Show Recent Messages
                      </>
                    )}
                  </button>
                </div>
                
                {/* Recipients Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Select Recipients</label>
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="include-me"
                          className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={includeMe}
                          onChange={(e) => setIncludeMe(e.target.checked)}
                        />
                        <label htmlFor="include-me" className={`ml-1.5 text-xs cursor-pointer flex items-center ${includeMe ? 'font-medium' : ''}`}>
                          <span className={`${includeMe ? 'text-blue-700' : 'text-gray-700'}`}>Include me (Encounter Provider)</span>
                          <span className="ml-1 text-gray-500">Dr. {currentUser.name.split(' ')[1]}</span>
                        </label>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span>{reminderRecipients.length} selected</span>
                    </div>
                  </div>
                  
                  {/* Auto-Selected Patient from Reminder - Shown at the top */}
                  {selectedReminderId && getPatientFromReminder(selectedReminderId) && reminderRecipientType === 'patient' && (
                    <div className="mb-3 p-2.5 bg-blue-50 rounded-md border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 mr-2">
                          <UserIcon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <span className="text-sm text-gray-800">
                            {getPatientFromReminder(selectedReminderId)?.name}
                          </span>
                          <span className="ml-1.5 text-xs text-gray-500">
                            ID: {getPatientFromReminder(selectedReminderId)?.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 mr-1">
                          Auto-selected from reminder
                        </span>
                        <button 
                          onClick={() => {
                            // Clear the selectedReminderId to remove the auto-selected patient
                            setSelectedReminderId(null);
                            
                            // Pre-fill search with the patient name to make it easy to find again if needed
                            const patient = getPatientFromReminder(selectedReminderId);
                            if (patient) {
                              setRecipientSearchTerm(patient.name);
                            }
                            
                            // Show the recipient selection after removing the auto-selected patient
                            setShowAdditionalRecipients(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Remove patient"
                          aria-label="Remove patient"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Include Others Option - Only shown when a patient is selected and additional recipients are hidden */}
                  {selectedReminderId && getPatientFromReminder(selectedReminderId) && !showAdditionalRecipients && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-between">
                      <label htmlFor="include-others" className="text-sm text-gray-700 flex items-center cursor-pointer">
                        <span>Do you want to include others in this reminder?</span>
                      </label>
                      <button 
                        onClick={() => setShowAdditionalRecipients(true)}
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      >
                        Add recipients
                      </button>
                    </div>
                  )}
                  
                  {/* Full Recipient Selection - Only shown when no patient is selected OR showAdditionalRecipients is true */}
                  {((!selectedReminderId || !getPatientFromReminder(selectedReminderId)) || showAdditionalRecipients) && (
                    <>
                      {/* Search Recipients */}
                      <div className="mb-2 relative">
                        <input
                          type="text"
                          className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md text-xs"
                          placeholder={`Search additional ${reminderRecipientType === 'staff' ? 'staff members' : reminderRecipientType === 'patient' ? 'patients' : 'groups'}...`}
                          value={recipientSearchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => {
                            // Delay hiding the recent searches to allow clicking on them
                            setTimeout(() => setIsSearchFocused(false), 200);
                            // Save the search term if not empty
                            if (recipientSearchTerm.trim()) {
                              saveSearch();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && recipientSearchTerm.trim()) {
                              saveSearch();
                            }
                          }}
                        />
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-2" />
                        {recipientSearchTerm && (
                          <button 
                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setRecipientSearchTerm('')}
                            aria-label="Clear search"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* Recent Searches Dropdown */}
                        {isSearchFocused && recentSearches.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b">
                              Recent Searches
                            </div>
                            <ul className="max-h-32 overflow-auto">
                              {recentSearches.map((term, index) => (
                                <li key={index}>
                                  <button
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center"
                                    onClick={() => applyRecentSearch(term)}
                                  >
                                    <ClockIcon className="h-3 w-3 text-gray-400 mr-2" />
                                    {term}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className={`border ${formErrors.recipients ? 'border-red-300' : 'border-gray-300'} rounded-md h-40 overflow-y-auto`}>
                        <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center">
                          <input 
                            type="checkbox" 
                            id="select-all-recipients"
                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            checked={areAllFilteredSelected()}
                            onChange={(e) => handleSelectAllFiltered(e.target.checked)}
                          />
                          <label htmlFor="select-all-recipients" className="text-xs font-medium text-gray-700 flex-1">
                            Select All {recipientSearchTerm ? `(Filtered)` : ''}
                          </label>
                          {recipientSearchTerm && (
                            <span className="text-xs text-gray-500">
                              {/* Simple count that avoids TypeScript errors */}
                              Results found
                            </span>
                          )}
                        </div>
                        
                        {reminderRecipientType === 'staff' && (
                          <ul className="divide-y divide-gray-200">
                            {getFilteredRecipients().filteredStaff.length > 0 ? (
                              getFilteredRecipients().filteredStaff.map(staff => (
                                <li key={staff.id} className="px-4 py-2 hover:bg-gray-50 flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`staff-${staff.id}`}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                    checked={reminderRecipients.includes(staff.id.toString())}
                                    onChange={() => handleRecipientSelection(staff.id)}
                                  />
                                  <label htmlFor={`staff-${staff.id}`} className="flex-1 flex items-center cursor-pointer">
                                    <span className="font-medium text-sm">{staff.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">{staff.role}</span>
                                  </label>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-3 text-center text-sm text-gray-500">
                                No staff members found matching "{recipientSearchTerm}"
                              </li>
                            )}
                          </ul>
                        )}
                        
                        {reminderRecipientType === 'patient' && (
                          <ul className="divide-y divide-gray-200">
                            {getFilteredRecipients().filteredPatients.length > 0 ? (
                              getFilteredRecipients().filteredPatients.map(patient => (
                                <li key={patient.id} className="px-4 py-2 hover:bg-gray-50 flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`patient-${patient.id}`}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                    checked={reminderRecipients.includes(patient.id.toString())}
                                    onChange={() => handleRecipientSelection(patient.id)}
                                  />
                                  <label htmlFor={`patient-${patient.id}`} className="flex-1 flex items-center cursor-pointer">
                                    <span className="font-medium text-sm">{patient.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">{patient.mrn}</span>
                                  </label>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-3 text-center text-sm text-gray-500">
                                No patients found matching "{recipientSearchTerm}"
                              </li>
                            )}
                          </ul>
                        )}
                        
                        {reminderRecipientType === 'group' && (
                          <ul className="divide-y divide-gray-200">
                            {getFilteredRecipients().filteredGroups.length > 0 ? (
                              getFilteredRecipients().filteredGroups.map(group => (
                                <li key={group.id} className="px-4 py-2 hover:bg-gray-50 flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`group-${group.id}`}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                    checked={reminderRecipients.includes(group.id.toString())}
                                    onChange={() => handleRecipientSelection(group.id)}
                                  />
                                  <label htmlFor={`group-${group.id}`} className="flex-1 flex items-center cursor-pointer">
                                    <span className="font-medium text-sm">{group.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">{group.members} members</span>
                                  </label>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-3 text-center text-sm text-gray-500">
                                No groups found matching "{recipientSearchTerm}"
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                  
                  {formErrors.recipients && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.recipients}</p>
                  )}
                </div>
                
                {/* Message Composition */}
                <div className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      className={`w-full px-3 py-2 border ${formErrors.subject ? 'border-red-300' : 'border-gray-300'} rounded-md text-sm`}
                      placeholder="Enter reminder subject"
                      value={reminderSubject}
                      onChange={(e) => setReminderSubject(e.target.value)}
                    />
                    {formErrors.subject && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.subject}</p>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <div className="mb-2">
                      <Select
                        key={`template-select-${selectedTemplate}`}
                        value={selectedTemplate}
                        onValueChange={(value) => {
                          setSelectedTemplate(value);
                          if (value) {
                            applyTemplate(parseInt(value));
                          }
                        }}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {messageTemplates.map(template => (
                              <SelectItem key={template.id} value={template.id.toString()}>
                                {template.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <textarea 
                      className={`w-full px-3 py-2 border ${formErrors.message ? 'border-red-300' : 'border-gray-300'} rounded-md text-sm h-32`}
                      placeholder="Enter your message here..."
                      value={reminderMessage}
                      onChange={(e) => setReminderMessage(e.target.value)}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-2 text-xs text-gray-500 flex items-center">
                    <PaperClipIcon className="h-3 w-3 mr-1" />
                    <span>Attachments are not supported for reminders</span>
                  </div>
                </div>
                
                {/* Delivery Options */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      key={`priority-select-${reminderPriority}`}
                      defaultValue={reminderPriority}
                      onValueChange={(value) => setReminderPriority(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                    <Select
                      key={`method-select-${reminderMethod}`}
                      defaultValue={reminderMethod}
                      onValueChange={(value) => setReminderMethod(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="app">App Notification</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS Text</SelectItem>
                          <SelectItem value="all">All Methods</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Schedule Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Schedule</label>
                  
                  {/* Scheduling Preset Options */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === 'now' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('now')}
                      >
                        Send now
                      </button>
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === 'tomorrow' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('tomorrow')}
                      >
                        Tomorrow
                      </button>
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === '2days' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('2days')}
                      >
                        2 days
                      </button>
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === '1week' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('1week')}
                      >
                        1 week
                      </button>
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === '2weeks' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('2weeks')}
                      >
                        2 weeks
                      </button>
                      <button 
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md ${
                          schedulingPreset === 'custom' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSchedulingPreset('custom')}
                      >
                        Custom
                      </button>
                    </div>
                  </div>
                  
                  {/* Date and Time Selectors - shown if custom or a preset with date is selected */}
                  {schedulingPreset !== 'now' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-8"
                          value={scheduledDate}
                          onChange={(e) => {
                            setScheduledDate(e.target.value);
                            // If date was manually changed, switch to custom
                            if (schedulingPreset !== 'custom') {
                              setSchedulingPreset('custom');
                            }
                          }}
                        />
                        <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-2.5" />
                      </div>
                      <div className="relative">
                        <input 
                          type="time" 
                          className={`w-full border ${formErrors.scheduledTime ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 text-sm pr-8`}
                          value={scheduledTime}
                          onChange={(e) => {
                            setScheduledTime(e.target.value);
                            // If time was manually changed, switch to custom
                            if (schedulingPreset !== 'custom') {
                              setSchedulingPreset('custom');
                            }
                          }}
                        />
                        <ClockIcon className="h-4 w-4 text-gray-400 absolute right-3 top-2.5" />
                      </div>
                    </div>
                  )}
                  
                  {schedulingPreset === 'now' ? (
                    <p className="text-xs text-gray-500 mt-1">Message will be sent immediately</p>
                  ) : schedulingPreset === 'custom' ? (
                    <p className="text-xs text-gray-500 mt-1">Select a custom date and time</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled for: {scheduledDate} at {scheduledTime || "current time"}
                    </p>
                  )}
                  
                  {formErrors.scheduledTime && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.scheduledTime}</p>
                  )}
                </div>
              </div>
              
              {/* Right Sidebar - Recent Messages - with animation */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showRecentMessages 
                    ? 'w-1/3 opacity-100 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto' 
                    : 'w-0 opacity-0 p-0'
                }`}
              >
                {showRecentMessages && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-sm text-gray-700">Recently Sent Messages</h3>
                      
                      {/* Show contextual filter indicators only if not showing all messages */}
                      {!showAllMessages && (
                        <>
                          {/* Contextual filter indicator */}
                          {selectedReminderId && getPatientFromReminder(selectedReminderId) && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <span>To: {getPatientFromReminder(selectedReminderId)?.name}</span>
                            </div>
                          )}
                          
                          {reminderRecipientType === 'staff' && reminderRecipients.length > 0 && !selectedReminderId && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <span>To staff</span>
                            </div>
                          )}
                          
                          {reminderRecipientType === 'group' && reminderRecipients.length > 0 && !selectedReminderId && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <span>To group</span>
                            </div>
                          )}
                          
                          {includeMe && reminderRecipients.length === 0 && !selectedReminderId && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <span>To myself</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Toggle for filtering - only show when there's context to filter by */}
                    {(selectedReminderId || reminderRecipients.length > 0) && (
                      <div className="flex items-center justify-end mb-2">
                        <div className="text-xs text-gray-500 mr-2">
                          {showAllMessages ? 'Showing all messages' : 'Showing filtered messages'}
                        </div>
                        <button 
                          onClick={() => setShowAllMessages(!showAllMessages)}
                          className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          {showAllMessages ? 'Show filtered' : 'Show all'}
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {getFilteredMessages().map(message => (
                        <div key={message.id} className={`bg-white p-3 rounded-md border ${message.isSampleMessage ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} shadow-sm`}>
                          {message.isSampleMessage && (
                            <div className="mb-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                              Example message
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-800 mb-1 truncate">{message.subject}</div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <span className="truncate max-w-[120px]">To: {message.recipient}</span>
                            </div>
                            <div>{formatDate(message.sentDate)}</div>
                          </div>
                          <div className="mt-2 text-xs flex justify-between items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                              message.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              message.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {message.status === 'delivered' ? 'Delivered' : 
                               message.status === 'scheduled' ? 'Scheduled' : 'Sent'}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                              message.recipientType === 'staff' ? 'bg-purple-100 text-purple-800' : 
                              message.recipientType === 'patient' ? 'bg-blue-100 text-blue-800' : 
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {message.recipientType === 'staff' ? 'Staff' : 
                              message.recipientType === 'patient' ? 'Patient' : 'Group'}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {getFilteredMessages().length === 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          No recent messages
                          {(selectedReminderId || reminderRecipients.length > 0) && (
                            <> for this recipient</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center text-sm">
                {reminderPriority === 'urgent' && (
                  <div className="flex items-center text-red-600 mr-4">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    <span>Urgent notifications may trigger alerts</span>
                  </div>
                )}
                
                {includeMe && (
                  <div className="flex items-center text-blue-600">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>You will receive a copy</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={closeReminderModal}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  onClick={sendReminder}
                  disabled={
                    ((reminderRecipients.length === 0 && !includeMe) && 
                    !(selectedReminderId && getPatientFromReminder(selectedReminderId) && reminderRecipientType === 'patient')) || 
                    !reminderMessage.trim()
                  }
                >
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox; 