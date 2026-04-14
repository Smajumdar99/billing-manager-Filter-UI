import React from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import {
  Utensils,
  MapPin,
  CheckCircle2,
  Users,
  User,
  Activity,
  LogOut,
} from 'lucide-react';
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
  location?: string;
  personName?: string;
  category?: string;
  program?: string;
  notes?: string;
  phoneNumber?: string;
  supervisingProvider?: string;
  copay?: number;
}

interface WeekViewProps {
  selectedDate: Date;
  events: Event[];
  timeSlots: string[];
  onEditEvent?: (event: Event) => void;
  onDateChange?: (date: Date) => void;
}

const DESKTOP_SLOT_H = 40;
const DESKTOP_PX_PER_MIN = DESKTOP_SLOT_H / 30;

const isWeekend = (date: Date) => {
  const d = date.getDay();
  return d === 0 || d === 6;
};

const parseMins = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const formatTime12h = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};

const formatTimeRange = (start: string, end: string) =>
  `${formatTime12h(start)} – ${formatTime12h(end)}`;

const getInitials = (name: string) => {
  const parts = name.split(/[\s,]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) ?? '?').toUpperCase();
};

type BadgeVariant = 'provider' | 'individual' | 'group' | 'review';

const badgeStyles: Record<BadgeVariant, string> = {
  provider: 'bg-purple-100 text-purple-800 border-purple-200/80',
  individual: 'bg-blue-100 text-blue-800 border-blue-200/80',
  group: 'bg-green-100 text-green-800 border-green-200/80',
  review: 'bg-amber-100 text-amber-800 border-amber-200/80',
};

function getBadge(event: Event): { label: string; variant: BadgeVariant } {
  const cat = (event.category || '').toLowerCase();
  if (cat === 'review' || cat === 'plan review') return { label: 'Review', variant: 'review' };
  if (event.type === 'Individual') return { label: 'Individual', variant: 'individual' };
  if (event.type === 'Group') return { label: 'Group', variant: 'group' };
  return { label: 'Provider', variant: 'provider' };
}

type CardBg = 'teal' | 'blue' | 'green' | 'purple' | 'amber' | 'neutral';

const cardBgClasses: Record<CardBg, string> = {
  teal: 'bg-teal-50/80 border-l-teal-400',
  blue: 'bg-blue-50/70 border-l-blue-400',
  green: 'bg-emerald-50/80 border-l-emerald-400',
  purple: 'bg-purple-50/80 border-l-purple-400',
  amber: 'bg-amber-50/80 border-l-amber-400',
  neutral: 'bg-slate-50 border-l-slate-300',
};

const desktopCardStyles: Record<CardBg, string> = {
  teal: 'bg-teal-50/80 border-l-teal-500',
  blue: 'bg-blue-50/80 border-l-blue-500',
  green: 'bg-emerald-50/80 border-l-emerald-500',
  purple: 'bg-purple-50/80 border-l-purple-500',
  amber: 'bg-amber-50/80 border-l-amber-500',
  neutral: 'bg-slate-50/80 border-l-slate-400',
};

function eventStartsInSlotRange(event: Event, _slots: string[]): boolean {
  const mins = parseMins(event.startTime);
  return mins >= 0 && mins < _slots.length * 30;
}

function getCardBg(event: Event): CardBg {
  const t = (event.title || '').toLowerCase();
  const c = (event.category || '').toLowerCase();
  if (t.includes('lunch') || c === 'break') return 'teal';
  if (c === 'review' || c === 'plan review') return 'amber';
  if (t.includes('supervision') || c === 'supervision') return 'purple';
  if (event.type === 'Individual') return 'blue';
  if (event.type === 'Group') return 'green';
  if (event.type === 'Provider') return 'purple';
  return 'neutral';
}

const statusPill: Record<string, string> = {
  Confirmed: 'bg-emerald-600 text-white',
  Pending: 'bg-amber-500 text-white',
  'Checked In': 'bg-blue-600 text-white',
  Completed: 'bg-gray-500 text-white',
};

interface ListEventRowProps {
  event: Event;
  onEditEvent?: (event: Event) => void;
}

const ListEventRow: React.FC<ListEventRowProps> = ({ event, onEditEvent }) => {
  const bg = getCardBg(event);
  const badge = getBadge(event);
  const isBreak = event.title === 'Lunch Break' || event.category === 'Break';
  const isOut = (event.category || '').toLowerCase().includes('out of office');
  const displayName = event.personName || event.title;

  const inner = (
    <div className="flex flex-row items-stretch w-full">
      {/* Left: time label */}
      <div className="w-[72px] shrink-0 flex flex-col justify-start pt-3.5 pr-2 text-right">
        <span className="text-xs font-medium text-gray-400 tabular-nums leading-tight">
          {formatTime12h(event.startTime)}
        </span>
      </div>

      {/* Thin separator line */}
      <div className="w-px bg-gray-200 shrink-0 self-stretch" />

      {/* Right: card */}
      <div className={`flex-1 ml-3 rounded-xl border-l-[3px] px-3.5 py-3 ${cardBgClasses[bg]} min-w-0`}>
        {/* Badge + Title row */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyles[badge.variant]}`}>
            {badge.label}
          </span>
          <span className="text-[13px] font-bold text-gray-900 truncate">{displayName}</span>
        </div>

        {/* Time range */}
        <div className="text-xs text-gray-500 mb-1.5 tabular-nums">
          {formatTimeRange(event.startTime, event.endTime)}
        </div>

        {/* Break: just an icon + short label */}
        {isBreak && (
          <div className="flex items-center gap-1.5 text-xs text-teal-700">
            <Utensils className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          </div>
        )}

        {/* Out of Office */}
        {isOut && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          </div>
        )}

        {/* Individual with personName */}
        {!isBreak && !isOut && event.type === 'Individual' && event.personName && (
          <div className="flex flex-col gap-1 min-w-0">
            {event.appointmentType && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-700 truncate">{event.appointmentType}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Group */}
        {!isBreak && !isOut && event.type === 'Group' && (
          <div className="flex flex-col gap-1 min-w-0">
            {event.supervisingProvider && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 min-w-0">
                <User className="w-3.5 h-3.5 shrink-0 text-gray-500" strokeWidth={2} />
                <span className="truncate">{event.supervisingProvider}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Generic provider / fallback (not break, not out) */}
        {!isBreak && !isOut && event.type === 'Provider' && (
          <div className="flex flex-col gap-1 min-w-0">
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Status pill */}
        {event.status && (
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusPill[event.status] ?? 'bg-gray-200 text-gray-700'}`}>
              <CheckCircle2 className="w-3 h-3 shrink-0" strokeWidth={2.5} />
              {event.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <EventPopover event={event} onEdit={onEditEvent}>
      {inner}
    </EventPopover>
  );
};

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${h === 0 ? 12 : h > 12 ? h - 12 : h}:00 ${h < 12 ? 'AM' : 'PM'}`);
    slots.push(`${h === 0 ? 12 : h > 12 ? h - 12 : h}:30 ${h < 12 ? 'AM' : 'PM'}`);
  }
  return slots;
};

const eventMatchesSlot = (event: Event, slot: string) => {
  const [slotTime, slotPeriod] = slot.split(' ');
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);
  const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
  const eventPeriod = eventHour < 12 ? 'AM' : 'PM';
  const eventHour12 = eventHour === 0 ? 12 : eventHour > 12 ? eventHour - 12 : eventHour;
  return eventHour12 === slotHour && eventMinute === slotMinute && eventPeriod === slotPeriod;
};

function eventBelongsToDay(event: Event, day: Date): boolean {
  if (!event.date) return true;
  try {
    return isSameDay(parseISO(`${event.date}T12:00:00`), day);
  } catch {
    return false;
  }
}

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, events, onEditEvent, onDateChange }) => {
  const slots = generateTimeSlots();
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayEvents = events
    .filter((e) => eventBelongsToDay(e, selectedDate))
    .sort((a, b) => parseMins(a.startTime) - parseMins(b.startTime));

  const dayLabel = format(selectedDate, 'EEEE') + ' schedule';
  const dateLabel = format(selectedDate, 'MMM d');

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <style>{`
        .week-tape-scrollbar::-webkit-scrollbar { display: none; }
        .week-tape-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Mobile: day tabs + list tape */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        {/* Day tab bar */}
        <div className="grid grid-cols-7 gap-1.5 w-full px-3 py-2.5 border-b border-gray-200 bg-slate-50/80 shrink-0">
          {weekDates.map((date, index) => {
            const active = isSameDay(date, selectedDate);
            const weekend = isWeekend(date);
            const dayAbbrev = format(date, 'EEE').toUpperCase();
            return (
              <button
                key={index}
                type="button"
                onClick={() => onDateChange?.(date)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                  active
                    ? 'bg-purple-600 text-white shadow-sm'
                    : weekend
                      ? 'bg-slate-200/90 text-slate-950 hover:bg-slate-300/90'
                      : 'bg-gray-100 text-slate-950 hover:bg-gray-200/90'
                }`}
              >
                <span className={`tabular-nums text-base font-bold leading-none ${active ? 'text-white' : 'text-slate-950'}`}>
                  {format(date, 'd')}
                </span>
                <span className={`text-[10px] font-medium uppercase mt-0.5 leading-tight ${active ? 'text-white' : 'text-slate-800'}`}>
                  {dayAbbrev}
                </span>
              </button>
            );
          })}
        </div>

        {/* Schedule list header */}
        <div className="flex items-baseline justify-between px-4 pt-4 pb-2 bg-white">
          <h2 className="text-lg font-bold text-gray-900">{dayLabel}</h2>
          <span className="text-sm font-medium text-gray-400">{dateLabel}</span>
        </div>

        {/* Event tape list */}
        <div className="flex-1 overflow-y-auto bg-white px-1 pb-6">
          {dayEvents.length === 0 ? (
            <div className="text-sm text-gray-400 py-12 text-center">No appointments for this day.</div>
          ) : (
            <div className="flex flex-col gap-4 pt-1">
              {dayEvents.map((event) => (
                <ListEventRow key={event.id} event={event} onEditEvent={onEditEvent} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: week grid with rich cards */}
      <div className="hidden md:flex flex-col h-full w-full overflow-hidden">
        {/* Day headers */}
        <div className="flex border-b border-gray-200 min-w-0 shrink-0">
          <div className="w-16 flex-shrink-0" />
          <div className="flex flex-1 min-w-0">
            {weekDates.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              return (
                <div
                  key={index}
                  className={`flex-1 text-center py-2.5 text-sm font-medium border-l border-gray-100 first:border-l-0 min-w-0 ${isToday ? 'bg-blue-50/60' : ''}`}
                  style={{ minWidth: '100px' }}
                >
                  <div className="text-gray-500 text-xs">{format(date, 'EEE')}</div>
                  <div className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>{format(date, 'd')}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time grid with absolutely positioned cards */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="flex min-w-0" style={{ position: 'relative' }}>
            {/* Time axis */}
            <div className="w-16 flex-shrink-0 sticky left-0 bg-white z-20">
              {slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="border-b border-slate-50 flex items-start" style={{ height: `${DESKTOP_SLOT_H}px` }}>
                  <span className="pl-2 pt-1 text-[11px] text-gray-400 tabular-nums whitespace-nowrap">{slot}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div className="flex flex-1 min-w-0">
              {weekDates.map((colDate, dateIndex) => (
                <div
                  key={dateIndex}
                  className="flex-1 border-l border-slate-100 first:border-l-0 relative min-w-0"
                  style={{ minWidth: '100px', height: `${slots.length * DESKTOP_SLOT_H}px` }}
                >
                  {/* Background grid lines */}
                  {slots.map((_, si) => (
                    <div key={si} className="absolute w-full border-b border-slate-50" style={{ top: `${si * DESKTOP_SLOT_H}px`, height: `${DESKTOP_SLOT_H}px` }} />
                  ))}

                  {/* Event cards */}
                  {events.filter(ev => eventBelongsToDay(ev, colDate) && eventStartsInSlotRange(ev, slots)).map((event) => {
                    const badge = getBadge(event);
                    const bg = getCardBg(event);
                    const startMin = parseMins(event.startTime);
                    const endMin = parseMins(event.endTime);
                    const durationMin = Math.max(endMin - startMin, 15);
                    const top = startMin * DESKTOP_PX_PER_MIN;
                    const height = durationMin * DESKTOP_PX_PER_MIN;
                    const displayName = event.personName || event.title;
                    const showBadge = durationMin > 30;
                    const showDetails = durationMin >= 60;

                    return (
                      <EventPopover key={event.id} event={event} onEdit={onEditEvent}>
                        <div
                          className={`absolute z-10 rounded-r-md border-l-[3px] overflow-hidden cursor-pointer transition-shadow hover:shadow-sm ${desktopCardStyles[bg]}`}
                          style={{ top: `${top + 1}px`, height: `${height - 2}px`, left: '2px', width: 'calc(100% - 4px)' }}
                        >
                          <div className="h-full flex flex-col gap-0.5 p-1.5 overflow-hidden">
                            {showBadge && (
                              <span className={`self-start inline-flex items-center px-1.5 py-px rounded-full text-[9px] font-bold border leading-none ${badgeStyles[badge.variant]}`}>
                                {badge.label}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-gray-900 truncate leading-tight">{displayName}</span>
                            {showBadge && (
                              <span className="text-[10px] text-gray-500 tabular-nums truncate leading-tight">
                                {formatTimeRange(event.startTime, event.endTime)}
                              </span>
                            )}
                            {showDetails && event.location && (
                              <div className="flex items-center gap-0.5 text-[10px] text-gray-500 truncate min-w-0">
                                <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            {showDetails && event.personName && (
                              <div className="flex items-center gap-1 text-[10px] text-gray-600 truncate min-w-0">
                                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600 shrink-0">
                                  {getInitials(event.personName)}
                                </div>
                                <span className="truncate">{event.personName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </EventPopover>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
