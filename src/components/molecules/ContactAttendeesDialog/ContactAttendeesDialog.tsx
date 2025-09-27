import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { MultiSelect } from '@/components/atoms/MultiSelect';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs';
import { EnvelopeIcon, UserGroupIcon, ClipboardDocumentListIcon, ClockIcon as HistoryIcon } from '@heroicons/react/24/outline';

/**
 * ContactAttendeesDialog Component
 * 
 * Professional dialog for contacting appointment attendees via email.
 * Features include:
 * - Subject and message for email content
 * - Recipients selection with email addresses
 * - Email content and history tabs
 * 
 * Follows Apple-style design principles with healthcare practicality.
 * Uses consistent dialog styling with gradient background.
 */

interface EmailContent {
  subject: string;
  message: string;
  recipients: string[];
}

interface EmailHistoryItem {
  id: string;
  subject: string;
  message: string;
  sender: string;
  senderRole: string;
  recipients: string[];
  recipientLabels: string[];
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ContactAttendeesDialogProps {
  open: boolean;
  onClose: () => void;
  onSendEmail: (emailContent: EmailContent) => void;
  appointmentId?: string;
}

// Available email recipients (attendees)
const availableAttendees = [
  { value: 'dr.smith@clinic.com', label: 'Dr. Sarah Smith (Provider)' },
  { value: 'nurse.johnson@clinic.com', label: 'Nurse Johnson (Healthcare Staff)' },
  { value: 'patient.john@email.com', label: 'John Doe (Patient)' },
  { value: 'patient.jane@email.com', label: 'Jane Smith (Patient)' },
  { value: 'guardian.wilson@email.com', label: 'Mary Wilson (Guardian)' },
  { value: 'coordinator@clinic.com', label: 'Care Coordinator' },
  { value: 'admin@clinic.com', label: 'Administrative Staff' }
];

// Mock email history data - showing past communications
const mockEmailHistory: EmailHistoryItem[] = [
  {
    id: '1',
    subject: 'Appointment Reminder - Group Therapy Session Tomorrow',
    message: 'Dear attendees,\n\nThis is a friendly reminder about your upcoming Group Therapy Session scheduled for tomorrow at 10:00 AM. Please arrive 10 minutes early for check-in.\n\nLocation: Conference Room B\nDuration: 1 hour\n\nIf you have any questions or need to reschedule, please contact us immediately.\n\nBest regards,\nDr. Sarah Smith',
    sender: 'Dr. Sarah Smith',
    senderRole: 'Primary Care Provider',
    recipients: ['patient.john@email.com', 'patient.jane@email.com', 'guardian.wilson@email.com'],
    recipientLabels: ['John Doe (Patient)', 'Jane Smith (Patient)', 'Mary Wilson (Guardian)'],
    sentAt: '2024-01-14 2:30 PM',
    status: 'read'
  },
  {
    id: '2',
    subject: 'Pre-Session Instructions and Preparation',
    message: 'Hello everyone,\n\nPlease review the attached materials before our session. Bring any questions or concerns you\'d like to discuss.\n\nRemember to:\n- Arrive on time\n- Bring your insurance card\n- Complete the pre-session questionnaire\n\nLooking forward to seeing you all.\n\nWarm regards,\nNurse Johnson',
    sender: 'Nurse Johnson',
    senderRole: 'Healthcare Staff',
    recipients: ['patient.john@email.com', 'patient.jane@email.com'],
    recipientLabels: ['John Doe (Patient)', 'Jane Smith (Patient)'],
    sentAt: '2024-01-12 11:15 AM',
    status: 'delivered'
  },
  {
    id: '3',
    subject: 'Session Rescheduled - New Date and Time',
    message: 'Dear participants,\n\nDue to unforeseen circumstances, we need to reschedule our group session originally planned for January 10th.\n\nNew Details:\nDate: January 15th, 2024\nTime: 10:00 AM - 11:00 AM\nLocation: Same (Conference Room B)\n\nPlease confirm your attendance by replying to this email.\n\nThank you for your understanding.\n\nBest,\nCare Coordinator',
    sender: 'Care Coordinator',
    senderRole: 'Administrative Staff',
    recipients: ['patient.john@email.com', 'patient.jane@email.com', 'guardian.wilson@email.com', 'dr.smith@clinic.com'],
    recipientLabels: ['John Doe (Patient)', 'Jane Smith (Patient)', 'Mary Wilson (Guardian)', 'Dr. Sarah Smith (Provider)'],
    sentAt: '2024-01-08 4:45 PM',
    status: 'read'
  },
  {
    id: '4',
    subject: 'Welcome to Group Therapy Program',
    message: 'Welcome to our Group Therapy Program!\n\nWe\'re excited to have you join our supportive community. This program is designed to provide you with tools and strategies for personal growth.\n\nWhat to expect:\n- Weekly 1-hour sessions\n- Small group setting (6-8 participants)\n- Evidence-based therapeutic approaches\n- Confidential and safe environment\n\nYour first session is scheduled for January 15th at 10:00 AM.\n\nIf you have any questions, please don\'t hesitate to reach out.\n\nWelcome aboard!\nDr. Sarah Smith',
    sender: 'Dr. Sarah Smith',
    senderRole: 'Primary Care Provider',
    recipients: ['patient.john@email.com', 'patient.jane@email.com'],
    recipientLabels: ['John Doe (Patient)', 'Jane Smith (Patient)'],
    sentAt: '2024-01-05 9:00 AM',
    status: 'read'
  }
];

const ContactAttendeesDialog: React.FC<ContactAttendeesDialogProps> = ({
  open,
  onClose,
  onSendEmail,
  appointmentId
}) => {
  // Form state management
  const [formData, setFormData] = useState<EmailContent>({
    subject: '',
    message: '',
    recipients: []
  });
  
  // History filter state
  const [historyFilter, setHistoryFilter] = useState<'all' | 'provider' | 'person'>('all');

  // Filter emails based on recipient type
  const filteredEmailHistory = mockEmailHistory.filter(email => {
    if (historyFilter === 'all') return true;
    
    if (historyFilter === 'provider') {
      // Check if email has provider recipients (contains 'Provider', 'Healthcare Staff', 'Administrative Staff')
      return email.recipientLabels.some(label => 
        label.includes('Provider') || 
        label.includes('Healthcare Staff') || 
        label.includes('Administrative Staff') ||
        label.includes('Care Coordinator')
      );
    }
    
    if (historyFilter === 'person') {
      // Check if email has person recipients (contains 'Patient', 'Guardian')
      return email.recipientLabels.some(label => 
        label.includes('Patient') || 
        label.includes('Guardian')
      );
    }
    
    return true;
  });
  
  // Tab state management
  const [activeTab, setActiveTab] = useState('email-content');

  // Handle form field changes
  const handleInputChange = (field: keyof EmailContent, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (!formData.subject || !formData.message || !formData.recipients.length) {
      alert('Please fill in all required fields');
      return;
    }

    onSendEmail(formData);
    onClose();
    
    // Reset form
    setFormData({
      subject: '',
      message: '',
      recipients: []
    });
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
    // Reset form on close
    setFormData({
      subject: '',
      message: '',
      recipients: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[95vh] max-h-[95vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 p-6">
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Contact Attendees</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription className="sr-only">
          Send email communication to appointment attendees with customizable subject and message
        </DialogDescription>
        
        {/* Dialog Title - Outside white container */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Attendees
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Send email communication to appointment attendees with customizable subject and message
              </p>
            </div>
          </div>
        </div>

        {/* Main container with white background */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="px-6 pt-4 border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="email-content" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  Email Content
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <HistoryIcon className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - Email Content */}
            <TabsContent value="email-content" className="p-6 space-y-6 mt-0 h-[calc(95vh-300px)] min-h-[600px] overflow-y-auto">
              {/* Subject Field */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Appointment Reminder - John Doe"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="Compose your message to the attendees. Include any important information, updates, or instructions..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full resize-none"
                  required
                />
              </div>

              {/* Recipients Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipients <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <MultiSelect
                    options={availableAttendees}
                    value={formData.recipients}
                    onChange={(recipients) => handleInputChange('recipients', recipients)}
                    placeholder="Select attendees to send email to..."
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Select all attendees who should receive this email communication
                </p>
              </div>

              {/* Email Summary */}
              {formData.subject && formData.recipients.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Email Summary</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><span className="font-medium">Subject:</span> {formData.subject}</p>
                    <p><span className="font-medium">Recipients:</span> {formData.recipients.length} selected</p>
                    <p><span className="font-medium">Message Length:</span> {formData.message.length} characters</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab Content - History */}
            <TabsContent value="history" className="p-6 mt-0 h-[calc(95vh-220px)] min-h-[650px] overflow-y-auto">
              <div className="space-y-4 h-full flex flex-col">
                {/* Filter Section */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Filter by recipient:</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={historyFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setHistoryFilter('all')}
                      className="text-xs px-3 py-1"
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={historyFilter === 'provider' ? 'default' : 'outline'}
                      onClick={() => setHistoryFilter('provider')}
                      className="text-xs px-3 py-1"
                    >
                      Provider
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={historyFilter === 'person' ? 'default' : 'outline'}
                      onClick={() => setHistoryFilter('person')}
                      className="text-xs px-3 py-1"
                    >
                      Person
                    </Button>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">
                    {filteredEmailHistory.length} of {mockEmailHistory.length} emails
                  </span>
                </div>

                {/* Email History List */}
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {filteredEmailHistory.map((email) => (
                    <div key={email.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      {/* Subject - Primary Focus */}
                      <h4 className="font-semibold text-gray-900 mb-3 text-base leading-tight">
                        {email.subject}
                      </h4>

                      {/* Message Content - Secondary Focus */}
                      <div className="bg-gray-50 rounded-md p-3 mb-4">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          <div className="line-clamp-4">
                            {email.message.split('\n').map((line, index) => (
                              <span key={index}>
                                {line}
                                {index < email.message.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
                          {email.message.length > 200 && (
                            <button className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2">
                              Show more...
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Compact Metadata Section */}
                      <div className="space-y-3">
                        {/* Sender & Status Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">From:</span>
                            <span>{email.sender}</span>
                            <span className="text-gray-400">({email.senderRole})</span>
                            <span className="text-gray-300">•</span>
                            <span>{email.sentAt}</span>
                          </div>
                          
                          {/* Status Badge */}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            email.status === 'read' 
                              ? 'bg-green-100 text-green-800' 
                              : email.status === 'delivered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {email.status === 'read' ? '✓ Read' : email.status === 'delivered' ? '→ Delivered' : '• Sent'}
                          </div>
                        </div>

                        {/* Recipients Row */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">
                              To:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {email.recipientLabels.map((recipient, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                              >
                                {recipient}
                              </span>
                            ))}
                          </div>
                        </div>


                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State (if no history) */}
                {mockEmailHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Email History</h3>
                    <p className="text-gray-600 max-w-md">
                      No email communications have been sent to appointment attendees yet. 
                      Send your first message using the Email Content tab.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer - Only show on Email Content tab */}
        {activeTab === 'email-content' && (
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Send Email
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactAttendeesDialog;
