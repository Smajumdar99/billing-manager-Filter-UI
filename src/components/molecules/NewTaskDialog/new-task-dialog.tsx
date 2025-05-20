"use client"

import { FC, useState, useId, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";
import { Checkbox } from '@/components/atoms/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup';
import { EyeIcon, XMarkIcon, XCircleIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/atoms/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/Popover";
import { Calendar } from "@/components/ui/calendar";
import { format as formatDate, addDays } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Combobox } from "@/components/atoms/Combobox/Combobox";
import { useTaskContext } from '@/context/TaskContext';
import { useToast } from '@/components/ui/use-toast';

interface Recipient {
  id: string;
  name: string;
  role: string;
  type: 'staff' | 'patient' | 'group';
}

interface DeliveryMethod {
  value: 'app' | 'email' | 'sms';
  label: string;
}

interface Priority {
  value: 'high' | 'medium' | 'low';
  label: string;
}

interface Task {
  id: string;
  title: string;
  person?: string;
  message: string;
  priority: string;
  due: string;
}

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPerson?: string;
  onTaskAdded?: () => void;
  // The task being replied to or viewed, if any
  task?: Task | null;
}

// Mock data - replace with actual data source
const mockRecipients: Recipient[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Physician', type: 'staff' },
  { id: '2', name: 'Dr. Michael Chen', role: 'Surgeon', type: 'staff' },
  { id: '3', name: 'Nurse Rebecca Adams', role: 'Registered Nurse', type: 'staff' },
  { id: '4', name: 'Cardiology Department', role: 'Department', type: 'group' },
  { id: '5', name: 'Emergency Team', role: 'Team', type: 'group' },
  { id: '6', name: 'John Smith', role: 'Patient', type: 'patient' },
  { id: '7', name: 'Emma Davis', role: 'Patient', type: 'patient' },
  { id: '8', name: 'John Doe', role: 'Patient', type: 'patient' },
  { id: '9', name: 'Sarah Miller', role: 'Patient', type: 'patient' },
  { id: '10', name: 'Michael Klein', role: 'Patient', type: 'patient' },
  { id: '11', name: 'Lisa Thompson', role: 'Patient', type: 'patient' },
  { id: '12', name: 'Robert Johnson', role: 'Patient', type: 'patient' },
  { id: '13', name: 'David Williams', role: 'Patient', type: 'patient' },
  { id: '14', name: 'Emma Wilson', role: 'Patient', type: 'patient' },
  { id: '15', name: 'James Wilson', role: 'Patient', type: 'patient' },
  { id: '16', name: 'Carlos Rodriguez', role: 'Patient', type: 'patient' },
  { id: '17', name: 'Group A Patients', role: 'Patient Group', type: 'group' },
  { id: '18', name: 'Anxiety Support Group', role: 'Patient Group', type: 'group' },
];

const deliveryMethods: DeliveryMethod[] = [
  { value: 'app', label: 'App Notification' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' }
];

const priorities: Priority[] = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
];

// Mock data for today's tasks
const todaysTasks = [
  { id: 1, subject: 'Review Lab Results', recipients: 'Dr. Sarah Johnson, Dr. Michael Chen', time: '09:30 AM', status: 'Sent' },
  { id: 2, subject: 'Patient Follow-up', recipients: 'Nurse Rebecca Adams', time: '11:15 AM', status: 'Sent' },
  { id: 3, subject: 'Schedule Meeting', recipients: 'Cardiology Department', time: '02:00 PM', status: 'Sent' },
  { id: 4, subject: 'Medication Review', recipients: 'Dr. Michael Chen', time: '02:30 PM', status: 'Sent' },
  { id: 5, subject: 'Emergency Consultation', recipients: 'Emergency Team', time: '03:15 PM', status: 'Sent' },
  { id: 6, subject: 'Patient Discharge', recipients: 'Nurse Rebecca Adams', time: '03:45 PM', status: 'Sent' },
  { id: 7, subject: 'Staff Meeting', recipients: 'All Staff', time: '04:00 PM', status: 'Sent' },
  { id: 8, subject: 'Lab Test Results', recipients: 'Dr. Sarah Johnson', time: '04:30 PM', status: 'Sent' },
  { id: 9, subject: 'Patient Appointment', recipients: 'John Smith', time: '05:00 PM', status: 'Sent' },
  { id: 10, subject: 'Treatment Plan Review', recipients: 'Dr. Michael Chen', time: '05:30 PM', status: 'Sent' },
  { id: 11, subject: 'Shift Handover', recipients: 'Evening Staff', time: '06:00 PM', status: 'Sent' },
  { id: 12, subject: 'Equipment Check', recipients: 'Maintenance Team', time: '06:30 PM', status: 'Sent' },
];

export const NewTaskDialog: FC<NewTaskDialogProps> = ({ 
  isOpen, 
  onClose,
  initialPerson,
  onTaskAdded,
  task // optional, used for reply/view mode
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('medium');
  const [conversation, setConversation] = useState([
    {
      user: 'Dr. Sarah',
      text: 'Please follow up with patient.',
      time: 'Today, 9:30 AM',
      type: 'comment',
    },
    {
      user: 'System',
      text: 'Task status changed to In Progress',
      time: 'Today, 9:31 AM',
      type: 'status',
    },
    {
      user: 'Nurse Amy',
      text: 'Will do!',
      time: 'Today, 9:32 AM',
      type: 'comment',
    },
  ]);
  const [reply, setReply] = useState('');
  const [progress, setProgress] = useState('not_started');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDateType, setStartDateType] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [dueDateType, setDueDateType] = useState<'today' | 'tomorrow' | 'custom'>('tomorrow');
  const [attachments, setAttachments] = useState<File[]>([]);
  // --- Linked Patient/Client State ---
  const [linkedPatientId, setLinkedPatientId] = useState<string | null>(null);
  // Add state for message
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  // --- Error States for Validation ---
  const [recipientError, setRecipientError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [messageError, setMessageError] = useState('');

  // --- Task Context ---
  const { addTask } = useTaskContext();
  const { toast } = useToast();

  // Handler for file input change
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
      e.target.value = '';
    }
  };
  // Handler to remove a file
  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Helper to get today's and tomorrow's date in yyyy-MM-dd
  const todayStr = formatDate(new Date(), 'yyyy-MM-dd');
  const tomorrowStr = formatDate(addDays(new Date(), 1), 'yyyy-MM-dd');

  // Compute startDate and dueDate based on type
  const computedStartDate = startDateType === 'today' ? todayStr : startDateType === 'tomorrow' ? tomorrowStr : startDate;
  const computedDueDate = dueDateType === 'today' ? todayStr : dueDateType === 'tomorrow' ? tomorrowStr : dueDate;

  // Handler for sending a reply
  const handleSendReply = () => {
    if (reply.trim() === '') return;
    setConversation(prev => [
      ...prev,
      {
        user: 'You',
        text: reply,
        time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: 'numeric', month: 'short' }),
        type: 'comment',
      },
    ]);
    setReply('');
  };

  // Auto-populate CC with initial person if provided
  useEffect(() => {
    if (initialPerson && selectedRecipients.length === 0) {
      // Check if person exists in mockRecipients
      const existingRecipient = mockRecipients.find(r => r.name === initialPerson);
      
      if (existingRecipient) {
        setSelectedRecipients([existingRecipient]);
      } else if (initialPerson) {
        // Create a new recipient entry for this person
        const newRecipient: Recipient = {
          id: `patient-${Date.now()}`,
          name: initialPerson,
          role: 'Patient',
          type: 'patient'
        };
        setSelectedRecipients([newRecipient]);
      }
    }
  }, [initialPerson, selectedRecipients.length]);

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prefill dialog fields if a task is provided (for reply/view)
  useEffect(() => {
    if (task) {
      setSubject(task.title || '');
      setSelectedRecipients(task.person ? [{ id: '', name: task.person, role: '', type: 'patient' }] : []);
      setMessage(task.message || '');
      setSelectedPriority(task.priority || 'medium');
      setDueDate(task.due || '');
      // Add any other fields as needed
    } else {
      setSubject('');
      setSelectedRecipients([]);
      setMessage('');
      setSelectedPriority('medium');
      setDueDate('');
    }
  }, [task, isOpen]);

  const filteredRecipients = mockRecipients.filter(recipient => {
    if (searchQuery === '') return true; // Show all recipients when no search query
    
    return recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           recipient.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const removeRecipient = (recipientId: string) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== recipientId));
  };

  // --- Send Handler ---
  const handleSendTask = () => {
    console.log('Send button clicked');
    let valid = true;
    if (selectedRecipients.length === 0) {
      setRecipientError('Please select at least one recipient/assignee.');
      valid = false;
    }
    if (!subject.trim()) {
      setSubjectError('Please enter a subject.');
      valid = false;
    }
    if (!message.trim()) {
      setMessageError('Please enter a message.');
      valid = false;
    }
    if (!valid) {
      console.log('Validation failed:', {selectedRecipients, subject, message});
      return;
    }
    // Clear errors if all valid
    setRecipientError('');
    setSubjectError('');
    setMessageError('');
    // Create new task object
    const newTask = {
      id: `${Date.now()}`,
      subject,
      message,
      recipients: selectedRecipients,
      linkedPatientId,
      progress: progress,
      priority: selectedPriority,
      startDate: computedStartDate,
      dueDate: computedDueDate,
      attachments,
      createdAt: new Date().toISOString(),
      createdBy: 'You', // Replace with actual user if available
    };
    console.log('Adding new task:', newTask);
    addTask(newTask);
    if (onTaskAdded) onTaskAdded();
    // Optionally reset form and close dialog
    setMessage('');
    setSelectedRecipients([]);
    setAttachments([]);
    setLinkedPatientId(null);
    setSubject('');
    setProgress('not_started');
    setSelectedPriority('medium');
    setStartDateType('today');
    setDueDateType('today');
    onClose();
    console.log('Task sent and dialog closed');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="new-task-dialog-desc"
        className="sm:max-w-[900px] lg:max-w-4xl p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">New Task</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="new-task-dialog-desc" className="sr-only">
          Create a new task and optionally send a message to recipients. Fill out the form fields to specify task details.
        </DialogDescription>
        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">New Task</h2>
        </div>
        {/* Main two-column layout for compact, beautiful UX */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-4 p-4">
          {/* Left: Task Creation Form */}
          <div className="flex-1 min-w-0 p-4 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            {/* Recipients/Assignees and Link to Patient/Client side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recipients/Assignees Section - using shadcn Combobox */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recipients/Assignees <span className="text-red-500">*</span>
                </label>
                {/* Inline error message for Recipients */}
                {recipientError && <div className="text-xs text-red-500 mb-1">{recipientError}</div>}
                <Combobox
                  options={filteredRecipients.filter(r => ['staff', 'group', 'department', 'team'].includes(r.type)).map(r => ({
                    value: r.id,
                    label: r.name,
                    description: r.role,
                    type: r.type as 'staff' | 'group' | 'department' | 'team'
                  }))}
                  value={selectedRecipients.map(r => r.id)}
                  onChange={ids => {
                    const newRecipients = filteredRecipients.filter(r => ids.includes(r.id));
                    setSelectedRecipients(newRecipients);
                    if (recipientError) setRecipientError('');
                  }}
                  placeholder="Search staff or groups..."
                  multiple
                  className="w-full"
                />
              </div>
              {/* Link to Patient/Client Combobox (optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Link to Patient/Client <span className='text-gray-400'>(optional)</span></label>
                <Combobox
                  // Hide filter tabs for a cleaner UI
                  hideFilters={true}
                  options={filteredRecipients.filter(r => r.type === 'patient').map(r => ({
                    value: r.id,
                    label: r.name,
                    description: r.role,
                    type: 'staff' // not used for filtering here
                  }))}
                  value={linkedPatientId ? [linkedPatientId] : []}
                  onChange={ids => setLinkedPatientId(ids[0] || null)}
                  placeholder="Search patient or client..."
                  multiple={false}
                  className="w-full"
                />
              </div>
            </div>
            {/* Two-column layout for Progress, Priority, Start Date, Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</label>
                <Select value={progress} onValueChange={setProgress}>
                  <SelectTrigger>
                    <SelectValue placeholder="Not Started Yet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started Yet</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Priority Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Start Date Picker with Today/Tomorrow/Custom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
                <div className="flex gap-1 mb-2">
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      startDateType === 'today'
                        ? 'bg-gray-200 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => { setStartDateType('today'); setStartDate(todayStr); }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      startDateType === 'tomorrow'
                        ? 'bg-gray-200 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => { setStartDateType('tomorrow'); setStartDate(tomorrowStr); }}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      startDateType === 'custom'
                        ? 'bg-gray-200 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => setStartDateType('custom')}
                  >
                    Custom
                  </button>
                </div>
                {startDateType === 'custom' && (
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                )}
                {startDateType !== 'custom' && (
                  <div className="text-xs text-gray-600 mt-1">{computedStartDate}</div>
                )}
              </div>
              {/* Due Date Picker with Today/Tomorrow/Custom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
                <div className="flex gap-1 mb-2">
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      dueDateType === 'today'
                        ? 'bg-gray-200 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => { setDueDateType('today'); setDueDate(todayStr); }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      dueDateType === 'tomorrow'
                        ? 'bg-gray-200 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => { setDueDateType('tomorrow'); setDueDate(tomorrowStr); }}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs font-medium transition-colors",
                      dueDateType === 'custom'
                        ? 'bg-gray-100 border-gray-300 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    )}
                    style={{ minWidth: 0 }}
                    onClick={() => setDueDateType('custom')}
                  >
                    Custom
                  </button>
                </div>
                {dueDateType === 'custom' && (
                  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                )}
                {dueDateType !== 'custom' && (
                  <div className="text-xs text-gray-600 mt-1">{computedDueDate}</div>
                )}
              </div>
            </div>
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Subject <span className="text-red-500">*</span>
              </label>
              {/* Inline error message for Subject */}
              {subjectError && <div className="text-xs text-red-500 mb-1">{subjectError}</div>}
              <Input
                className="w-full"
                placeholder="Enter reminder subject"
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  if (subjectError) setSubjectError('');
                }}
              />
            </div>
            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Message <span className="text-red-500">*</span>
              </label>
              {/* Inline error message for Message */}
              {messageError && <div className="text-xs text-red-500 mb-1">{messageError}</div>}
              <Select value={''} onValueChange={() => {}}>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="template1">Template 1</SelectItem>
                    <SelectItem value="template2">Template 2</SelectItem>
                    <SelectItem value="template3">Template 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Textarea
                className="w-full mt-2"
                placeholder="Enter your task details here..."
                value={message}
                onChange={e => {
                  setMessage(e.target.value);
                  if (messageError) setMessageError('');
                }}
              />
            </div>
            {/* Attachments Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attachments</label>
              <Input
                type="file"
                multiple
                className="w-full text-xs text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-50 file:text-primary hover:file:bg-blue-100"
                onChange={handleAttachmentChange}
              />
              {attachments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {attachments.map((file, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-800">
                      <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeAttachment(idx)}
                        aria-label="Remove attachment"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
           
          </div>
          {/* Right: Conversation History */}
          <div className="w-[320px] min-w-[240px] max-w-[400px] bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Conversation</h3>
            </div>
            {/* Stylish, modern message list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
              {conversation.length === 0 && (
                <div className="text-xs text-gray-400 text-center mt-10">No conversation yet for this task.</div>
              )}
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={[
                    'flex flex-col px-3 py-2 rounded-lg shadow-xs border',
                    msg.type === 'status'
                      ? 'bg-blue-50 border-blue-100 border-l-4'
                      : 'bg-white border-gray-100 border-l-4 border-primary/20',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">
                      {msg.user}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-2">{msg.time}</span>
                  </div>
                  <div className={msg.type === 'status' ? 'text-xs font-medium text-blue-700' : 'text-sm text-gray-700'}>{msg.text}</div>
                </div>
              ))}
            </div>
            {/* Modern reply box */}
            <div className="border-t border-gray-100 bg-white p-2 flex items-center gap-2 shadow-inner rounded-b-xl">
              <Input
                className="flex-1 rounded-full border border-gray-200 px-3 py-1 text-sm bg-gray-50 focus:outline-none focus:border-primary"
                placeholder="Add a comment..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendReply(); }}
                aria-label="Add a comment"
              />
              <button
                type="button"
                className="bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendReply}
                disabled={!reply.trim()}
                aria-label="Send"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghose" onClick={onClose} className="px-3 h-9 font-normal border-gray-200 text-sm">Cancel</Button>
          <Button variant="default" onClick={handleSendTask}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 