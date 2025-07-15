import React from 'react';
import { Button } from '../../atoms/Button';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '../../atoms/Tooltip';
import { VideoCameraIcon, UsersIcon, UserPlusIcon, ArrowUpTrayIcon, PrinterIcon, XCircleIcon, ArrowUpOnSquareStackIcon } from '@heroicons/react/24/outline';

// Props for AppointmentEditActions
interface AppointmentEditActionsProps {
  onSave: () => void;
}

// AppointmentEditActions: Action bar for editing appointments (edit mode only)
// Each action is a button with an icon and tooltip. Handlers are stubbed for now.
const AppointmentEditActions: React.FC<AppointmentEditActionsProps> = ({ onSave }) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 mb-2 shadow-sm">
        {/* Create Telehealth Appointment */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Create Telehealth Appointment" onClick={() => console.log('Create Telehealth Appointment')}>
              <VideoCameraIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Create Telehealth Appointment</TooltipContent>
        </TooltipRoot>
        {/* Contact Attendees */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Contact Attendees" onClick={() => console.log('Contact Attendees')}>
              <UsersIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Contact Attendees</TooltipContent>
        </TooltipRoot>
        {/* Add or Remove Patients */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Add or Remove Patients" onClick={() => console.log('Add or Remove Patients')}>
              <UserPlusIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Add or Remove Patients</TooltipContent>
        </TooltipRoot>
        {/* Upload Docs */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Upload Docs" onClick={() => console.log('Upload Docs')}>
              <ArrowUpTrayIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Upload Docs</TooltipContent>
        </TooltipRoot>
        {/* Print Roster */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Print Roster" onClick={() => console.log('Print Roster')}>
              <PrinterIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Print Roster</TooltipContent>
        </TooltipRoot>
        {/* Cancel Event */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Cancel Event" onClick={() => console.log('Cancel Event')}>
              <XCircleIcon className="w-5 h-5 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Cancel Event</TooltipContent>
        </TooltipRoot>
        {/* Export to Outlook */}
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Export to Outlook" onClick={() => console.log('Export to Outlook')}>
              <ArrowUpOnSquareStackIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Export to Outlook</TooltipContent>
        </TooltipRoot>
        {/* Save Changes button - prominent, at the end */}
        <Button type="button" size="sm" className="ml-auto text-white px-4" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </TooltipProvider>
  );
};

export default AppointmentEditActions; 