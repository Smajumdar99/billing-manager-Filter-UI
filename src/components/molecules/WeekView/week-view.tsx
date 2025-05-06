import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { UserGroupIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import EventPopover from '../../atoms/EventPopover/event-popover';

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

  const eventContent = (
    <div 
      className="absolute top-0 left-0 right-0 mx-1 p-1 rounded border text-xs overflow-hidden cursor-pointer"
      style={{ 
        backgroundColor: event.backgroundColor || '#E5EDFF',
        borderColor: event.type === 'Individual' ? '#C7D2FE' : 
                    event.type === 'Group' ? '#FDE68A' : '#E5E7EB',
        height: '46px'
      }}
    >
      <div className="flex items-center gap-1">
        {getEventIcon()}
        <div className="font-medium truncate flex-1">{event.title}</div>
      </div>
      <div className="text-gray-600 mt-0.5 flex items-center gap-1 text-[10px]">
        <span>{event.startTime} - {event.endTime}</span>
        {event.mobile && (
          <span className="flex items-center gap-0.5 text-blue-600">
            <PhoneIcon className="w-2.5 h-2.5" />
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

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, events, timeSlots, onEditEvent }) => {
  // Get the start of the week (Monday)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

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
        {timeSlots.map((time, timeIndex) => (
          <div key={timeIndex} className="flex border-b border-gray-100 min-h-[48px]">
            <div className="w-16 pr-2 text-right text-xs text-gray-500 py-2 sticky left-0 bg-white z-10">
              {time}
            </div>
            {weekDates.map((date, dateIndex) => (
              <div 
                key={dateIndex} 
                className="flex-1 border-l border-gray-100 first:border-l-0 relative"
              >
                {events
                  .filter(event => {
                    const eventHour = parseInt(event.startTime.split(':')[0]);
                    return eventHour === timeIndex;
                  })
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