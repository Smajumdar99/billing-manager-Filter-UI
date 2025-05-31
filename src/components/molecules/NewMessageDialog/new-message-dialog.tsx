"use client"

import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select";
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup';
import { Label } from '@/components/atoms/Label';
import { cn } from '@/lib/utils';

interface MessageType {
  value: string;
  label: string;
}

interface Recipient {
  id: string;
  name: string;
  role: string;
  type: 'staff' | 'patient' | 'group';
}

interface MessageStatus {
  value: string;
  label: string;
}

interface NewMessageDialogProps {
  open: boolean;
  onClose: () => void;
  task?: any | null; // For reply mode
}

// Mock data for message types
const messageTypes: MessageType[] = [
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'clinical', label: 'Clinical' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'billing', label: 'Billing' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'lab', label: 'Lab Results' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'insurance', label: 'Insurance' },
];

// Mock data for recipients
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
];

// Mock data for groups
const mockGroups: Recipient[] = mockRecipients.filter(r => r.type === 'group');

// Mock data for users (staff + patients)
const mockUsers: Recipient[] = mockRecipients.filter(r => r.type === 'staff' || r.type === 'patient');

// Message status options
const messageStatuses: MessageStatus[] = [
  { value: 'new', label: 'New' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
];

export const NewMessageDialog: FC<NewMessageDialogProps> = ({ 
  open, 
  onClose,
  task // optional, used for reply mode
}) => {
  const [messageType, setMessageType] = useState<string>('unassigned');
  const [recipientType, setRecipientType] = useState<'group' | 'user'>('user');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [messageStatus, setMessageStatus] = useState<string>('new');
  const [messageContent, setMessageContent] = useState<string>('');

  // --- Error States for Validation ---
  const [personError, setPersonError] = useState('');
  const [messageError, setMessageError] = useState('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (task) {
        // Pre-fill for reply mode
        setMessageType(task.type?.toLowerCase() || 'unassigned');
        setMessageStatus('new');
        
        // Map person name to recipient ID
        if (task.person) {
          const foundRecipient = mockRecipients.find(r => r.name === task.person);
          if (foundRecipient) {
            setSelectedPerson(foundRecipient.id);
            // Set recipient type based on found recipient
            setRecipientType(foundRecipient.type === 'group' ? 'group' : 'user');
          } else {
            // If person not found in recipients, keep as user type and clear selection
            setRecipientType('user');
            setSelectedPerson('');
          }
        } else {
          setRecipientType('user');
          setSelectedPerson('');
        }
        
        // Pre-fill message content with original message
        setMessageContent(`\n\n--- Original Message ---\n${task.message || ''}`);
      } else {
        // Reset for new message
        setMessageType('unassigned');
        setRecipientType('user');
        setSelectedPerson('');
        setMessageStatus('new');
        setMessageContent('');
      }
      setPersonError('');
      setMessageError('');
    }
  }, [open, task]);

  // Get available recipients based on type
  const availableRecipients = recipientType === 'group' ? mockGroups : mockUsers;

  // Handle form submission
  const handleSendMessage = () => {
    let valid = true;

    if (!selectedPerson) {
      setPersonError('Please select a person.');
      valid = false;
    }

    if (!messageContent.trim()) {
      setMessageError('Please enter a message.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    // Clear errors
    setPersonError('');
    setMessageError('');

    // Here you would typically send the message via API
    console.log('Sending message:', {
      type: messageType,
      to: selectedPerson,
      recipientType,
      status: messageStatus,
      message: messageContent
    });

    // Close dialog and reset
    onClose();
  };

  // Handle clear message
  const handleClear = () => {
    setMessageContent('');
    setMessageError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="new-message-dialog-desc"
        className="sm:max-w-[700px] lg:max-w-[800px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">
          {task ? 'Reply to Message' : 'New Message'}
        </DialogTitle>
        
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="new-message-dialog-desc" className="sr-only">
          {task ? 'Reply to an existing message' : 'Create and send a new message'}
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            {task ? 'Reply to Message' : 'New Message'}
          </h2>
        </div>

        {/* Main content layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          {/* Message Form */}
          <div className="min-w-0 p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col w-full">
            
            {/* First Row: Type and To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Type:
                </label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {messageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* To (Group/User Radio Selection) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  To:
                </label>
                <RadioGroup 
                  value={recipientType} 
                  onValueChange={(value) => {
                    setRecipientType(value as 'group' | 'user');
                    setSelectedPerson(''); // Reset person selection when type changes
                    setPersonError('');
                  }}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="text-sm">Group</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="text-sm">User(s)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Second Row: Person and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Person */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Person: <span className="text-red-500">*</span>
                </label>
                {personError && (
                  <div className="text-xs text-red-500 mb-1">{personError}</div>
                )}
                <Select 
                  value={selectedPerson} 
                  onValueChange={(value) => {
                    setSelectedPerson(value);
                    setPersonError('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Click to select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableRecipients.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          <div className="flex flex-col">
                            <span>{person.name}</span>
                            {person.role && (
                              <span className="text-xs text-gray-500">{person.role}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status:
                </label>
                <Select value={messageStatus} onValueChange={setMessageStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {messageStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Message: <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  Clear
                </Button>
              </div>
              {messageError && (
                <div className="text-xs text-red-500 mb-1">{messageError}</div>
              )}
              <Textarea
                value={messageContent}
                onChange={(e) => {
                  setMessageContent(e.target.value);
                  setMessageError('');
                }}
                placeholder="Type your message here..."
                className="w-full mt-2 min-h-[300px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={onClose} className="px-3 h-9 font-normal border-gray-200 text-sm">
            Close
          </Button>
          <Button variant="default" onClick={handleSendMessage}>
            Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 