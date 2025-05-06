import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parse, isValid, parseISO } from 'date-fns';
import { UserGroupIcon, UserIcon, PhoneIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import EventPopover from '../../atoms/EventPopover/event-popover';

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
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Confirmed':
      return 'text-blue-600';
    case 'Pending':
      return 'text-yellow-600';
    case 'Checked In':
      return 'text-green-600';
    case 'Completed':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

const getEventBackground = (type?: string) => {
  switch (type) {
    case 'Individual':
      return 'bg-blue-50 border-blue-200';
    case 'Group':
      return 'bg-yellow-50 border-yellow-200';
    case 'Provider':
      return 'bg-purple-50 border-purple-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

interface MonthViewProps {
  selectedDate: Date;
  events: Event[];
  onEditEvent?: (event: Event) => void;
}

interface EventCardProps {
  event: Event;
  isCompact?: boolean;
  onEditEvent?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false, onEditEvent }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'Individual':
        return <UserIcon className="w-3 h-3 text-gray-600" />;
      case 'Group':
        return <UserGroupIcon className="w-3 h-3 text-gray-600" />;
      default:
        return null;
    }
  };

  const eventContent = isCompact ? (
    <div 
      className={`flex items-center gap-1 px-1.5 py-1 rounded-md border text-[10px] mb-1 overflow-hidden cursor-pointer ${getEventBackground(event.type)}`}
    >
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {getEventIcon()}
        <span className="truncate font-medium">{event.title}</span>
      </div>
      <span className={`flex-shrink-0 ${getStatusColor(event.status)}`}>
        {format(parse(event.startTime, 'HH:mm', new Date()), 'h:mm a')}
      </span>
    </div>
  ) : (
    <div 
      className={`px-2 py-1 rounded-md border text-xs mb-1 overflow-hidden cursor-pointer ${getEventBackground(event.type)}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          {getEventIcon()}
          <span className="font-medium truncate">{event.title}</span>
        </div>
        <span className={getStatusColor(event.status)}>{event.status}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-gray-600">
        <div className="flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          <span>{format(parse(event.startTime, 'HH:mm', new Date()), 'h:mm a')}</span>
        </div>
        {event.appointmentType && (
          <span className="text-gray-500">• {event.appointmentType}</span>
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

const MonthView: React.FC<MonthViewProps> = ({ selectedDate, events, onEditEvent }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add days from previous/next month to fill the calendar grid
  const startDay = monthStart.getDay();
  const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1; // Adjust for week starting on Monday

  const calendarDays = [
    ...Array(daysFromPrevMonth).fill(null),
    ...monthDays
  ];

  // Calculate week rows
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Helper function to check if an event belongs to a specific day
  const getEventsForDay = (day: Date | null, events: Event[]) => {
    if (!day) return [];
    
    const dayStr = format(day, 'yyyy-MM-dd');
    
    return events.filter(event => {
      try {
        // First try to parse as ISO date string (full datetime)
        if (event.startTime.includes('T')) {
          const eventDate = parseISO(event.startTime);
          return isValid(eventDate) && format(eventDate, 'yyyy-MM-dd') === dayStr;
        }
        
        // If it's just a date string
        if (event.date) {
          return event.date === dayStr;
        }
        
        // If it's just a time string, combine with the day
        const [hours, minutes] = event.startTime.split(':');
        const eventDate = new Date(day);
        eventDate.setHours(parseInt(hours, 10));
        eventDate.setMinutes(parseInt(minutes, 10));
        
        return format(eventDate, 'yyyy-MM-dd') === dayStr;
      } catch (error) {
        console.error('Error parsing date for event:', event, error);
        return false;
      }
    });
  };

  // Debug log to check events data
  console.log('Month View - Current events:', events);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Month grid */}
      <div className="grid grid-cols-7 text-sm">
        {/* Weekday headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="p-2 text-center font-medium text-gray-600 border-b">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayEvents = day ? getEventsForDay(day, events) : [];
              
              return (
                <div
                  key={dayIndex}
                  className={`min-h-[120px] p-1 border-b border-r relative ${
                    !day || !isSameMonth(day, selectedDate)
                      ? 'bg-gray-50'
                      : isToday(day)
                      ? 'bg-blue-50'
                      : 'bg-white'
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-right mb-1">
                        <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${
                          isToday(day) ? 'bg-blue-500 text-white' : 'text-gray-600'
                        }`}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            isCompact={true}
                            onEditEvent={onEditEvent}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MonthView; 