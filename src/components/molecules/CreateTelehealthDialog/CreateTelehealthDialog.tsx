import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { VideoCameraIcon, CalendarDaysIcon, ClockIcon, ClipboardDocumentListIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * CreateTelehealthDialog Component
 * 
 * Professional dialog for creating telehealth appointments.
 * Features include:
 * - Meeting topic and password
 * - Person location and telehealth platform selection
 * - Event schedule information display
 * 
 * Follows Apple-style design principles with healthcare practicality.
 * Uses consistent dialog styling with gradient background.
 */

interface TelehealthAppointment {
  subject: string;
  body: string;
  meetingPassword: string;
  platform: string;
  personLocation: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface CreateTelehealthDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateAppointment: (appointment: TelehealthAppointment) => void;
  appointmentId?: string;
}

// Available telehealth platforms
const telehealthPlatforms = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'webex', label: 'Cisco Webex' },
  { value: 'meet', label: 'Google Meet' },
  { value: 'doxy', label: 'Doxy.me' },
  { value: 'other', label: 'Other Platform' },
];

// Available person locations
const personLocations = [
  { value: 'home', label: 'Home' },
  { value: 'office', label: 'Office' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'other', label: 'Other Location' },
];

const CreateTelehealthDialog: React.FC<CreateTelehealthDialogProps> = ({
  open,
  onClose,
  onCreateAppointment,
  appointmentId: _appointmentId // TODO: Use this for editing existing telehealth appointments
}) => {
  // Form state management
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [platform, setPlatform] = useState('');
  const [personLocation, setPersonLocation] = useState('');

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (!subject || !body || !platform || !personLocation) {
      alert('Please fill in all required fields');
      return;
    }

    const appointmentData: TelehealthAppointment = {
      subject,
      body,
      meetingPassword,
      platform,
      personLocation,
      date: '2024-01-15', // Default date
      startTime: '10:00', // Default time
      endTime: '10:30', // Default end time
    };

    onCreateAppointment(appointmentData);
    onClose();
    
    // Reset form
    setSubject('');
    setBody('');
    setMeetingPassword('');
    setPlatform('');
    setPersonLocation('');
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
    // Reset form on close
    setSubject('');
    setBody('');
    setMeetingPassword('');
    setPlatform('');
    setPersonLocation('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 p-6">
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Create Telehealth Appointment</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription className="sr-only">
          Schedule a virtual appointment with comprehensive meeting details and recipient management
        </DialogDescription>
        
        {/* Dialog Title - Outside white container */}
        <div className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <VideoCameraIcon className="w-6 h-6 text-blue-600" />
            Create Telehealth Appointment
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            Schedule a secure video consultation with meeting details.
          </DialogDescription>
        </div>

        {/* Dialog Content - White container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-6 mb-4 p-6 space-y-6">
          {/* Meeting Topic Field */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Meeting Topic <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="subject"
              placeholder="Describe the meeting topic, agenda, preparation instructions, or any special notes for participants..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={4}
              className="w-full resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Provide clear meeting objectives and any preparation instructions for participants.
            </p>
          </div>

          {/* Meeting Password Field */}
          <div className="space-y-2">
            <label htmlFor="meetingPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              Meeting Password
              <div className="relative group">
                <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Recommended for security. Share only with authorized participants.
                </div>
              </div>
            </label>
            <Input
              id="meetingPassword"
              type="text"
              placeholder="Enter a secure password for the meeting..."
              value={meetingPassword}
              onChange={(e) => setMeetingPassword(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Optional but recommended for enhanced meeting security.
            </p>
          </div>

          {/* Person Location and Telehealth Platform - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Person Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Person Location <span className="text-red-500">*</span>
              </label>
              <Select value={personLocation} onValueChange={setPersonLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select person location" />
                </SelectTrigger>
                <SelectContent>
                  {personLocations.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Where will the person be joining from?
              </p>
            </div>

            {/* Telehealth Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Telehealth Platform <span className="text-red-500">*</span>
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select telehealth platform" />
                </SelectTrigger>
                <SelectContent>
                  {telehealthPlatforms.map((platformOption) => (
                    <SelectItem key={platformOption.value} value={platformOption.value}>
                      {platformOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Choose the video conferencing platform for this appointment.
              </p>
            </div>
          </div>

          {/* Event Schedule Information Panel - Compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-4 h-4" />
              Event Schedule Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-blue-700 font-medium">Date:</span>
                  <span className="text-blue-800 ml-1">2024-01-15</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-blue-700 font-medium">Start:</span>
                  <span className="text-blue-800 ml-1">10:00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-blue-700 font-medium">End:</span>
                  <span className="text-blue-800 ml-1">10:30</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              This information is read-only and reflects the current appointment schedule.
            </p>
          </div>

          {/* Meeting Link Generation Status */}
          {platform && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                <VideoCameraIcon className="w-4 h-4" />
                Meeting Link Status
              </h3>
              <p className="text-sm text-green-800">
                Meeting link will be automatically generated for <strong>{telehealthPlatforms.find(p => p.value === platform)?.label}</strong> when the appointment is created.
              </p>
              <p className="text-xs text-green-700 mt-1">
                Meeting details will be shared with relevant participants via email.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Outside white container */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            Create Telehealth Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTelehealthDialog;
