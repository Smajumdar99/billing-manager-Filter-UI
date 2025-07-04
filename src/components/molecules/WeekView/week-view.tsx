import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { UserGroupIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import EventPopover from '../../atoms/EventPopover/event-popover';
import EventTypeBadge from '../../atoms/EventTypeBadge';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  type?: 'Individual' | 'Group' | 'Provider';
  backgroundColor?: string;
  mobile?: string;
  home?: string;
}

interface WeekViewProps {
  selectedDate: Date;
  events: Event[];
  timeSlots: string[];
  onEditEvent?: (event: Event) => void;
}

interface EventCardProps {
  event: Event;
  onEditEvent?: (event: Event) => void;
}

// Helper to get standard background color for event types (copy from calendar-main-view)
const getEventBgColor = (type?: string) => {
  switch (type) {
    case 'Group':
      return '#E6F9ED'; // soft green
    case 'Individual':
      return '#E5EDFF'; // soft blue
    case 'Provider':
      return '#F3E8FF'; // soft purple
    default:
      return '#F3F4F6'; // soft gray
  }
};

const EventCard: React.FC<EventCardProps> = ({ event, onEditEvent }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'Individual':
        return <UserIcon className="w-4 h-4 text-gray-600" />;
      case 'Group':
        return <UserGroupIcon className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  // Use standard background color for event type
  const bgColor = getEventBgColor(event.type);

  const eventContent = (
    <div 
      className="mx-1 my-1 p-2 rounded border text-xs overflow-hidden cursor-pointer bg-white flex flex-col gap-1 min-w-0"
      style={{ 
        backgroundColor: bgColor,
        borderColor: event.type === 'Individual' ? '#C7D2FE' : 
                    event.type === 'Group' ? '#A7F3D0' : 
                    event.type === 'Provider' ? '#D8B4FE' : '#E5E7EB',
      }}
    >
      {/* Badge and title row */}
      <div className="flex items-center gap-2 min-w-0">
        <EventTypeBadge type={event.type} />
        {getEventIcon()}
        <div className="font-medium truncate flex-1">{event.title}</div>
      </div>
      {/* Time and phone row */}
      <div className="text-gray-600 flex items-center gap-2 min-w-0">
        <span>{event.startTime} - {event.endTime}</span>
        {event.mobile && (
          <span className="flex items-center gap-1 text-blue-600">
            <PhoneIcon className="w-3 h-3" />
            {event.mobile}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <EventPopover event={event} onEdit={onEditEvent}>
      {eventContent}
    </EventPopover>
  );
};

// Helper to generate 30-minute time slots for a day
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${h === 0 ? 12 : h > 12 ? h - 12 : h}:00 ${h < 12 ? 'AM' : 'PM'}`);
    slots.push(`${h === 0 ? 12 : h > 12 ? h - 12 : h}:30 ${h < 12 ? 'AM' : 'PM'}`);
  }
  return slots;
};

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, events, timeSlots, onEditEvent }) => {
  // Use 30-minute intervals for time slots
  const slots = generateTimeSlots();
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Helper to check if event starts at a given slot (hour and minute)
  const eventMatchesSlot = (event: Event, slot: string) => {
    const [slotTime, slotPeriod] = slot.split(' ');
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
    const eventPeriod = eventHour < 12 ? 'AM' : 'PM';
    // Convert to 12-hour format for comparison
    const eventHour12 = eventHour === 0 ? 12 : eventHour > 12 ? eventHour - 12 : eventHour;
    return eventHour12 === slotHour && eventMinute === slotMinute && eventPeriod === slotPeriod;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week header */}
      <div className="flex border-b border-gray-200">
        <div className="w-16 flex-shrink-0" /> {/* Time column spacer */}
        {weekDates.map((date, index) => (
          <div 
            key={index}
            className="flex-1 text-center py-2 text-sm font-medium border-l border-gray-100 first:border-l-0"
          >
            <div className="text-gray-600">{format(date, 'EEE')}</div>
            <div className="text-gray-900">{format(date, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        {slots.map((slot, slotIndex) => (
          <div key={slotIndex} className="flex border-b border-gray-100 min-h-[32px]">
            <div className="w-16 pl-2 text-left text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
              {slot}
            </div>
            {weekDates.map((date, dateIndex) => (
              <div 
                key={dateIndex} 
                className="flex-1 border-l border-gray-100 first:border-l-0 relative"
              >
                {events
                  .filter(event => eventMatchesSlot(event, slot))
                  .map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      onEditEvent={onEditEvent}
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView; 