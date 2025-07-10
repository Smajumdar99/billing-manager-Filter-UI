import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date?: string;
  isAllDay?: boolean;
  type?: 'Individual' | 'Group' | 'Provider';
  backgroundColor?: string;
  mobile?: string;
  home?: string;
  status?: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed';
  appointmentType?: string;
  location?: string;
  notes?: string;
  patientName?: string;
  program?: string;
  category?: string;
  copay?: number;
  phoneNumber?: string;
  supervisingProvider?: string;
  personName?: string;
}

interface EventPopoverProps {
  event: Event;
  children: React.ReactNode;
  onEdit?: (event: Event) => void;
  onView?: (event: Event) => void;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Confirmed':
      return 'text-blue-600 bg-blue-50';
    case 'Pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'Checked In':
      return 'text-green-600 bg-green-50';
    case 'Completed':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const EventPopover: React.FC<EventPopoverProps> = ({ event, children, onEdit, onView }) => {
  const [isVisible, setIsVisible] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 150); // Small delay to prevent flickering when moving between trigger and popover
  };

  const handlePopoverMouseEnter = () => {
    clearTimeout(hoverTimeout);
  };

  const handlePopoverMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={() => onView?.(event)}
        className="outline-none cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
          style={{ top: 'calc(100% + 4px)' }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          <div className="space-y-3">
            {/* Header with type icon, title and edit button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {event.type === 'Individual' ? (
                  <UserIcon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                ) : event.type === 'Group' ? (
                  <UserGroupIcon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                ) : null}
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  {event.personName && (
                    <p className="text-sm text-gray-600">{event.personName}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onEdit?.(event)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Status badge */}
            {event.status && (
              <div className="flex items-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  <span className="flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {event.status}
                  </span>
                </span>
              </div>
            )}

            {/* Time and duration */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>{event.isAllDay ? 'All Day' : `${event.startTime} - ${event.endTime}`}</span>
            </div>

            {/* Program */}
            {event.program && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardDocumentListIcon className="w-4 h-4" />
                <span>Program: {event.program}</span>
              </div>
            )}

            {/* Category */}
            {event.category && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardDocumentListIcon className="w-4 h-4" />
                <span>Category: {event.category}</span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>Location: {event.location}</span>
              </div>
            )}

            {/* Supervising Provider */}
            {event.supervisingProvider && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AcademicCapIcon className="w-4 h-4" />
                <span>Supervising Provider: {event.supervisingProvider}</span>
              </div>
            )}

            {/* Contact information */}
            {(event.phoneNumber || event.mobile || event.home) && (
              <div className="space-y-1.5">
                {event.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{event.phoneNumber}</span>
                  </div>
                )}
                {event.mobile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Mobile: {event.mobile}</span>
                  </div>
                )}
                {event.home && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Home: {event.home}</span>
                  </div>
                )}
              </div>
            )}

            {/* Copay */}
            {event.copay !== undefined && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>Copay: ${event.copay}</span>
              </div>
            )}

            {/* Notes */}
            {event.notes && (
              <div className="text-sm text-gray-600 border-t border-gray-100 pt-2 mt-2">
                <p className="font-medium mb-1">Notes:</p>
                <p className="text-sm">{event.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPopover; 