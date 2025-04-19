import React, { useState } from 'react';
import { 
  ChatBubbleLeftIcon, 
  PaperAirplaneIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  type: string;
  isRead: boolean;
  dueDate?: string;
  person?: string;
  description?: string;
}

const Messages: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [showType, setShowType] = useState<'new' | 'read' | 'all'>('new');
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [personSearch, setPersonSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample messages data
  const [messages] = useState<Message[]>([
    {
      id: 1,
      subject: "Lab Results Review Required",
      sender: "Dr. Sarah Johnson",
      recipient: "Dr. Michael Smith",
      content: "Please review the latest lab results for patient #1004445",
      timestamp: "2024-03-20T10:00:00",
      status: "delivered",
      priority: "high",
      type: "Evaluation",
      isRead: false,
      dueDate: "2024-03-15",
      person: "Robert Wilson (1004445)",
      description: "Follow-up required for medication review and adjustment. Patient reported side effects."
    },
    {
      id: 2,
      subject: "Medication Change Authorization",
      sender: "Nurse Practitioner Emily",
      recipient: "Dr. Michael Smith",
      content: "Request for medication change approval for patient #1004552",
      timestamp: "2024-03-20T09:30:00",
      status: "read",
      priority: "medium",
      type: "Appointment",
      isRead: true,
      dueDate: "2024-03-18",
      person: "Emily Chen (1004552)",
      description: "Routine check-up scheduled. Review recent lab results before appointment."
    },
    {
      id: 3,
      subject: "Urgent Consultation Request",
      sender: "Dr. James Wilson",
      recipient: "Dr. Michael Smith",
      content: "Need immediate consultation for cardiac patient",
      timestamp: "2024-03-19T15:45:00",
      status: "delivered",
      priority: "high",
      type: "Consultation",
      isRead: false,
      dueDate: "2024-03-21",
      person: "Maria Garcia (1004773)",
      description: "Urgent cardiology consultation needed. Patient experiencing chest pain and irregular heartbeat."
    },
    {
      id: 4,
      subject: "Prescription Renewal",
      sender: "Dr. Michael Smith",
      recipient: "Pharmacy Team",
      content: "Approved prescription renewal",
      timestamp: "2024-03-18T14:20:00",
      status: "sent",
      priority: "low",
      type: "Prescription",
      isRead: true,
      dueDate: "2024-03-25",
      person: "John Davis (1004889)",
      description: "Monthly medication renewal for hypertension management. No changes in current prescription."
    },
    {
      id: 5,
      subject: "Test Results Available",
      sender: "Lab Department",
      recipient: "Dr. Michael Smith",
      content: "New test results available for review",
      timestamp: "2024-03-17T11:30:00",
      status: "delivered",
      priority: "medium",
      type: "Lab Results",
      isRead: false,
      dueDate: "2024-03-19",
      person: "Sarah Thompson (1004665)",
      description: "Blood work and thyroid panel results ready for review. Some values outside normal range."
    },
    {
      id: 6,
      subject: "Follow-up Reminder",
      sender: "System Notification",
      recipient: "Dr. Michael Smith",
      content: "Patient follow-up due",
      timestamp: "2024-03-16T09:15:00",
      status: "delivered",
      priority: "medium",
      type: "Reminder",
      isRead: true,
      dueDate: "2024-03-22",
      person: "David Brown (1004991)",
      description: "Scheduled follow-up for post-surgery recovery assessment. Patient reported good progress."
    },
    {
      id: 7,
      subject: "Insurance Authorization",
      sender: "Insurance Coordinator",
      recipient: "Dr. Michael Smith",
      content: "Authorization needed for procedure",
      timestamp: "2024-03-15T16:45:00",
      status: "delivered",
      priority: "high",
      type: "Authorization",
      isRead: false,
      dueDate: "2024-03-17",
      person: "Lisa Martinez (1005023)",
      description: "Insurance authorization required for upcoming MRI procedure. Please review and approve."
    },
    {
      id: 8,
      subject: "Patient Message",
      sender: "Patient Portal",
      recipient: "Dr. Michael Smith",
      content: "New message from patient",
      timestamp: "2024-03-14T13:20:00",
      status: "delivered",
      priority: "low",
      type: "Message",
      isRead: true,
      dueDate: "2024-03-16",
      person: "Michael Wilson (1005134)",
      description: "Patient requesting clarification about medication side effects and dosage instructions."
    },
    {
      id: 9,
      subject: "Referral Request",
      sender: "Dr. Amanda Lee",
      recipient: "Dr. Michael Smith",
      content: "Referral request for specialist consultation",
      timestamp: "2024-03-13T11:20:00",
      status: "delivered",
      priority: "medium",
      type: "Referral",
      isRead: false,
      dueDate: "2024-03-20",
      person: "Kevin Zhang (1005245)",
      description: "Patient needs dermatology consultation for persistent skin condition not responding to current treatment."
    },
    {
      id: 10,
      subject: "Vaccination Schedule",
      sender: "Nurse Manager",
      recipient: "Dr. Michael Smith",
      content: "Updated vaccination schedule",
      timestamp: "2024-03-12T09:15:00",
      status: "read",
      priority: "low",
      type: "Schedule",
      isRead: true,
      dueDate: "2024-03-19",
      person: "Emma White (1005367)",
      description: "Routine vaccination schedule for pediatric patient. Please review and approve the proposed timeline."
    },
    {
      id: 11,
      subject: "Emergency Room Transfer",
      sender: "ER Department",
      recipient: "Dr. Michael Smith",
      content: "Patient transfer notification",
      timestamp: "2024-03-11T23:45:00",
      status: "delivered",
      priority: "high",
      type: "Transfer",
      isRead: false,
      dueDate: "2024-03-12",
      person: "Thomas Anderson (1005489)",
      description: "Emergency transfer from ER. Patient with severe abdominal pain requiring immediate surgical consultation."
    },
    {
      id: 12,
      subject: "Lab Test Request",
      sender: "Dr. Michael Smith",
      recipient: "Laboratory",
      content: "Urgent blood work request",
      timestamp: "2024-03-10T16:30:00",
      status: "sent",
      priority: "high",
      type: "Lab Request",
      isRead: true,
      dueDate: "2024-03-11",
      person: "Rachel Green (1005612)",
      description: "STAT blood work needed for pre-operative assessment. Patient scheduled for surgery tomorrow morning."
    },
    {
      id: 13,
      subject: "Medication Alert",
      sender: "Pharmacy System",
      recipient: "Dr. Michael Smith",
      content: "Potential drug interaction detected",
      timestamp: "2024-03-09T14:20:00",
      status: "delivered",
      priority: "high",
      type: "Alert",
      isRead: false,
      dueDate: "2024-03-10",
      person: "James Wilson (1005734)",
      description: "System detected potential interaction between newly prescribed medication and existing prescriptions."
    },
    {
      id: 14,
      subject: "Discharge Summary",
      sender: "Dr. Michael Smith",
      recipient: "Records Department",
      content: "Patient discharge documentation",
      timestamp: "2024-03-08T11:45:00",
      status: "sent",
      priority: "medium",
      type: "Discharge",
      isRead: true,
      dueDate: "2024-03-09",
      person: "Sofia Rodriguez (1005856)",
      description: "Complete discharge summary for post-operative patient. Including follow-up care instructions and medication list."
    },
    {
      id: 15,
      subject: "Appointment Request",
      sender: "Scheduling Team",
      recipient: "Dr. Michael Smith",
      content: "New patient consultation request",
      timestamp: "2024-03-07T09:30:00",
      status: "delivered",
      priority: "low",
      type: "Appointment",
      isRead: false,
      dueDate: "2024-03-14",
      person: "Oliver Brown (1005978)",
      description: "New patient requesting initial consultation for chronic back pain management."
    },
    {
      id: 16,
      subject: "Treatment Plan Update",
      sender: "Dr. Michael Smith",
      recipient: "Dr. Jennifer Lee",
      content: "Updated treatment plan for shared patient",
      timestamp: "2024-03-19T15:30:00",
      status: "sent",
      priority: "high",
      type: "Treatment",
      isRead: true,
      dueDate: "2024-03-22",
      person: "William Taylor (1006023)",
      description: "Modified chemotherapy protocol based on latest test results. Requesting your review and input."
    },
    {
      id: 17,
      subject: "Specialist Referral",
      sender: "Dr. Michael Smith",
      recipient: "Dr. Robert Chen",
      content: "Cardiology referral for patient",
      timestamp: "2024-03-18T11:20:00",
      status: "sent",
      priority: "medium",
      type: "Referral",
      isRead: true,
      dueDate: "2024-03-25",
      person: "Patricia Moore (1006134)",
      description: "Referring patient for advanced cardiac evaluation. ECG shows irregular patterns requiring specialist assessment."
    },
    {
      id: 18,
      subject: "Surgery Schedule Request",
      sender: "Dr. Michael Smith",
      recipient: "Surgery Department",
      content: "Requesting OR time slot",
      timestamp: "2024-03-17T09:45:00",
      status: "sent",
      priority: "high",
      type: "Surgery",
      isRead: true,
      dueDate: "2024-03-24",
      person: "Christopher Lee (1006245)",
      description: "Requesting operating room scheduling for emergency appendectomy. Patient prepped and ready for procedure."
    },
    {
      id: 19,
      subject: "Lab Test Orders",
      sender: "Dr. Michael Smith",
      recipient: "Laboratory Services",
      content: "New lab work orders",
      timestamp: "2024-03-16T14:15:00",
      status: "sent",
      priority: "medium",
      type: "Lab Request",
      isRead: true,
      dueDate: "2024-03-18",
      person: "Elizabeth Wilson (1006356)",
      description: "Comprehensive metabolic panel and thyroid function tests ordered. Patient fasting for 12 hours as required."
    },
    {
      id: 20,
      subject: "Medication Adjustment",
      sender: "Dr. Michael Smith",
      recipient: "Pharmacy Department",
      content: "Updated prescription details",
      timestamp: "2024-03-15T10:30:00",
      status: "sent",
      priority: "medium",
      type: "Prescription",
      isRead: true,
      dueDate: "2024-03-16",
      person: "Daniel Martinez (1006467)",
      description: "Adjusting blood pressure medication dosage based on recent monitoring results. Please update prescription."
    },
    {
      id: 21,
      subject: "Consultation Notes",
      sender: "Dr. Michael Smith",
      recipient: "Dr. Sarah Johnson",
      content: "Follow-up consultation summary",
      timestamp: "2024-03-14T16:45:00",
      status: "sent",
      priority: "low",
      type: "Consultation",
      isRead: true,
      dueDate: "2024-03-21",
      person: "Margaret Brown (1006578)",
      description: "Sharing detailed notes from follow-up consultation. Patient showing improvement with current treatment plan."
    },
    {
      id: 22,
      subject: "Emergency Transfer Request",
      sender: "Dr. Michael Smith",
      recipient: "City General Hospital",
      content: "Urgent patient transfer request",
      timestamp: "2024-03-13T08:20:00",
      status: "sent",
      priority: "high",
      type: "Transfer",
      isRead: true,
      dueDate: "2024-03-13",
      person: "Joseph Thompson (1006689)",
      description: "Requesting immediate transfer for acute care. Patient requires specialized cardiac intervention not available at our facility."
    },
    {
      id: 23,
      subject: "Insurance Pre-authorization",
      sender: "Dr. Michael Smith",
      recipient: "Insurance Department",
      content: "Treatment pre-authorization request",
      timestamp: "2024-03-12T13:40:00",
      status: "sent",
      priority: "medium",
      type: "Authorization",
      isRead: true,
      dueDate: "2024-03-19",
      person: "Susan Garcia (1006790)",
      description: "Requesting pre-authorization for MRI scan. Clinical notes and supporting documentation attached."
    }
  ]);

  // Filter and sort messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPerson = personSearch === '' || 
      message.sender.toLowerCase().includes(personSearch.toLowerCase()) ||
      message.recipient.toLowerCase().includes(personSearch.toLowerCase());
    
    const matchesType = 
      showType === 'all' ? true :
      showType === 'new' ? !message.isRead :
      message.isRead;

    const matchesTab = 
      activeTab === 'inbox' ? message.recipient === "Dr. Michael Smith" :
      message.sender === "Dr. Michael Smith";
    
    return matchesSearch && matchesPerson && matchesType && matchesTab;
  }).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'timestamp') {
      return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * direction;
    }
    // Type-safe field access with null checks
    const aValue = a[sortField as keyof Message] ?? '';
    const bValue = b[sortField as keyof Message] ?? '';
    return ((aValue > bValue ? 1 : -1) * direction);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  // Handle message selection
  const toggleMessageSelection = (id: number) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter(mId => mId !== id));
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Tabs and Search */}
      <div className="flex flex-col space-y-4 mb-4">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b">
          <div className="flex">
            <button 
              className={cn(
                "px-4 py-2 border-b-2 text-sm font-medium transition-colors",
                activeTab === 'inbox' 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('inbox')}
            >
              INBOX
            </button>
            <button 
              className={cn(
                "px-4 py-2 border-b-2 text-sm font-medium transition-colors",
                activeTab === 'sent' 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('sent')}
            >
              SENT ITEMS
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex items-center space-x-2">
          {/* Combined Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages or people..."
              value={searchQuery || personSearch}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPersonSearch(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {(searchQuery || personSearch) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPersonSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "flex items-center",
                  showType !== 'all' && "bg-blue-50 text-blue-600 border-blue-200"
                )}
              >
                <FunnelIcon className="h-4 w-4 mr-1" />
                {showType === 'new' ? 'Unread' : showType === 'read' ? 'Read' : 'All Messages'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => setShowType('all')}
                  className={cn(showType === 'all' && "bg-blue-50")}
                >
                  <span className="flex-1">All Messages</span>
                  {showType === 'all' && <Badge variant="secondary" className="ml-2">Selected</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowType('new')}
                  className={cn(showType === 'new' && "bg-blue-50")}
                >
                  <span className="flex-1">Unread</span>
                  {showType === 'new' && <Badge variant="secondary" className="ml-2">Selected</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowType('read')}
                  className={cn(showType === 'read' && "bg-blue-50")}
                >
                  <span className="flex-1">Read</span>
                  {showType === 'read' && <Badge variant="secondary" className="ml-2">Selected</Badge>}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        {selectedMessages.length > 0 && (
          <div className="flex items-center space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {/* Handle mark as read */}}
            >
              Mark as Read
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {/* Handle mark as unread */}}
            >
              Mark as Unread
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {/* Handle mark as done */}}
            >
              Mark as Done
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {/* Handle delete */}}
            >
              Delete
            </Button>
            <div className="ml-2 text-sm text-gray-500">
              {selectedMessages.length} selected
            </div>
          </div>
        )}
      </div>

      {/* Messages Table */}
      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[40px] py-3">
                <Checkbox
                  checked={selectedMessages.length === filteredMessages.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer py-3"
                onClick={() => handleSort('priority')}
              >
                Priority {sortField === 'priority' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer py-3"
                onClick={() => handleSort('sender')}
              >
                From {sortField === 'sender' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer py-3"
                onClick={() => handleSort('dueDate')}
              >
                Due Date {sortField === 'dueDate' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer py-3"
                onClick={() => handleSort('person')}
              >
                Person {sortField === 'person' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="py-3 w-[30%]">Description</TableHead>
              <TableHead 
                className="cursor-pointer py-3"
                onClick={() => handleSort('type')}
              >
                Type {sortField === 'type' && (
                  sortDirection === 'asc' ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="w-[100px] text-right py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMessages.map((message) => (
              <TableRow 
                key={message.id}
                className={cn(
                  "hover:bg-gray-50 bg-white"
                )}
              >
                <TableCell className="py-3">
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    onCheckedChange={() => toggleMessageSelection(message.id)}
                  />
                </TableCell>
                <TableCell className="py-3">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    message.priority === 'high' ? "text-red-600" :
                    message.priority === 'medium' ? "text-orange-600" :
                    "text-blue-600"
                  )}>
                    {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="py-3">{message.sender}</TableCell>
                <TableCell className="py-3">
                  {message.dueDate && (
                    <div className="flex items-center">
                      {new Date(message.dueDate) < new Date() && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full mr-2">
                          Overdue
                        </span>
                      )}
                      {message.dueDate}
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-3">{message.person}</TableCell>
                <TableCell className="py-3 max-w-md">
                  <p className="truncate">{message.description}</p>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="bg-blue-50">
                    {message.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Updated Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMessages.length)} of {filteredMessages.length} messages
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className={cn(
              "p-1 rounded hover:bg-gray-100",
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={cn(
                "px-3 py-1 rounded",
                currentPage === page ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
              )}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className={cn(
              "p-1 rounded hover:bg-gray-100",
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages; 