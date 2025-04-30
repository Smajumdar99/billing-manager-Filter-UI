import React, { FC } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import { EventWithTooltip } from '../EventWithTooltip'

interface ScheduleCalendarProps {
  calendarRef: React.RefObject<FullCalendar>;
  events: EventInput[];
  resources: Array<{ id: string; title: string }>;
  currentView: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'agenda';
  onDateSelect: (selectInfo: DateSelectArg) => void;
  onEventClick: (clickInfo: EventClickArg) => void;
}

export const ScheduleCalendar: FC<ScheduleCalendarProps> = ({
  calendarRef,
  events,
  resources,
  currentView,
  onDateSelect,
  onEventClick,
}) => {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
      initialView="timeGridDay"
      headerToolbar={false} // We're using custom header
      events={events}
      resources={resources}
      resourceAreaWidth="15%"
      resourceLabelDidMount={(info: any) => {
        // Customize resource labels if needed
      }}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      select={onDateSelect}
      eventClick={onEventClick}
      slotMinTime="06:00:00"
      slotMaxTime="22:00:00"
      allDaySlot={false}
      slotDuration="00:20:00"
      height="100%"
      resourceOrder="title"
      schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
      nowIndicator={true}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: 'short'
      }}
      slotLabelFormat={{
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      }}
      businessHours={{
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startTime: '08:00',
        endTime: '18:00',
      }}
      views={{
        timeGridDay: {
          dayMaxEventRows: false,
          eventMinHeight: 30
        },
        timeGridWeek: {
          dayMaxEventRows: true,
          eventMinHeight: 25
        },
        dayGridMonth: {
          dayMaxEventRows: true,
          eventMinHeight: 20
        }
      }}
      eventContent={(eventInfo) => {
        const { title, extendedProps } = eventInfo.event;
        const { patient, room, type, provider, patientInfo } = extendedProps;
        const startTime = new Date(eventInfo.event.start!).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        const endTime = new Date(eventInfo.event.end!).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        
        return (
          <EventWithTooltip
            title={title}
            startTime={startTime}
            endTime={endTime}
            patient={patient}
            room={room}
            type={type}
            provider={provider}
            patientInfo={patientInfo}
          />
        );
      }}
    />
  )
} 