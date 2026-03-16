import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { format, addDays, parseISO } from 'date-fns';
import { CheckCircleIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface CancelledEventRow {
  eventDate: string; // display format dd/MM/yyyy
  cancelReason: string;
}

export interface EventCancellationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, selectedDates: string[]) => void;
  /** Called when the user clicks Allow with one or more rows selected */
  onAllow?: (allowedRows: CancelledEventRow[]) => void;
  eventName: string;
  currentDate: string; // ISO or YYYY-MM-DD
  /** Optional list of event dates (YYYY-MM-DD). If not provided, generates 14 days from currentDate. */
  eventDates?: string[];
  /** Pre-populate the cancelled events table (e.g. when opened from Activate Event) */
  initialCancelledEvents?: CancelledEventRow[];
}

/** Parse date string to Date */
function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const date = dateString.includes('T') ? new Date(dateString) : parseISO(dateString);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Format to DD/MM/YYYY for display */
function toDisplayDate(date: Date | undefined): string {
  if (!date) return '';
  return format(date, 'dd/MM/yyyy');
}

/** Generate list of date strings (YYYY-MM-DD) for the next N days from a start date */
function generateEventDates(startDateStr: string, count: number): string[] {
  const start = parseDate(startDateStr);
  if (!start) return [];
  return Array.from({ length: count }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
}

const EventCancellationDialog: React.FC<EventCancellationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onAllow,
  eventName,
  currentDate,
  eventDates: eventDatesProp,
  initialCancelledEvents,
}) => {
  const baseDates = useMemo(() => {
    if (eventDatesProp?.length) return eventDatesProp;
    return generateEventDates(currentDate, 14);
  }, [currentDate, eventDatesProp]);

  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [filterKeyword, setFilterKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelledEvents, setCancelledEvents] = useState<CancelledEventRow[]>(initialCancelledEvents ?? []);
  const [allowedIndices, setAllowedIndices] = useState<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDateDisplay = toDisplayDate(parseDate(currentDate));

  const filteredDates = useMemo(() => {
    if (!filterKeyword.trim()) return baseDates;
    const lower = filterKeyword.toLowerCase();
    return baseDates.filter((d) => {
      const display = toDisplayDate(parseDate(d));
      return display.includes(lower) || d.includes(lower);
    });
  }, [baseDates, filterKeyword]);

  useEffect(() => {
    if (open) {
      setSelectedDates(new Set());
      setFilterKeyword('');
      setDropdownOpen(false);
      setReason('');
      setAllowedIndices(new Set());
      setCancelledEvents(initialCancelledEvents ?? []);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  const toggleDate = (dateStr: string) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  const checkAll = () => {
    setSelectedDates(new Set(filteredDates));
  };

  const uncheckAll = () => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      filteredDates.forEach((d) => next.delete(d));
      return next;
    });
  };

  const handleCancelEvents = () => {
    const selected = Array.from(selectedDates);
    if (selected.length === 0 || !reason.trim()) return;
    const newRows: CancelledEventRow[] = selected.map((d) => ({
      eventDate: toDisplayDate(parseDate(d)),
      cancelReason: reason.trim(),
    }));
    setCancelledEvents((prev) => [...prev, ...newRows]);
    onConfirm(reason.trim(), selected);
    setSelectedDates(new Set());
    setReason('');
  };

  const toggleAllowedIndex = (index: number) => {
    setAllowedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleAllow = () => {
    const allowed = cancelledEvents.filter((_, i) => allowedIndices.has(i));
    setCancelledEvents((prev) => prev.filter((_, i) => !allowedIndices.has(i)));
    setAllowedIndices(new Set());
    if (allowed.length > 0) onAllow?.(allowed);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] bg-white rounded-lg shadow-xl w-full max-w-xl p-0">
        <DialogTitle className="sr-only">Event(s) Cancellation</DialogTitle>
        <DialogDescription className="sr-only">
          Select events to cancel, enter a reason, and manage cancelled events.
        </DialogDescription>

        {/* ── Fixed Header ── */}
        <div className="shrink-0 border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Event(s) Cancellation</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-medium text-gray-700">Event Name:</span> {eventName}
            <span className="mx-1.5 text-gray-300">·</span>
            <span className="font-medium text-gray-700">Current Date:</span> {currentDateDisplay}
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">

          {/* ── Cancellation Form ── */}
          <div className="flex flex-col gap-3">

            {/* Select Events dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Select Events <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-sm border border-input rounded-md bg-background hover:bg-gray-50 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className={selectedDates.size > 0 ? 'text-gray-900' : 'text-muted-foreground'}>
                  {selectedDates.size > 0
                    ? `${selectedDates.size} date${selectedDates.size > 1 ? 's' : ''} selected`
                    : 'Select Events'}
                </span>
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
                    <input
                      type="text"
                      placeholder="Filter: Enter keywords"
                      value={filterKeyword}
                      onChange={(e) => setFilterKeyword(e.target.value)}
                      className="flex-1 h-6 px-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); checkAll(); }}
                      className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-green-700 border border-green-200 rounded hover:bg-green-50 whitespace-nowrap"
                    >
                      <CheckCircleIcon className="w-3 h-3" />
                      Check all
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); uncheckAll(); }}
                      className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 whitespace-nowrap"
                    >
                      <XMarkIcon className="w-3 h-3" />
                      Uncheck all
                    </button>
                  </div>
                  <ul className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                    {filteredDates.map((dateStr) => {
                      const display = toDisplayDate(parseDate(dateStr));
                      const checked = selectedDates.has(dateStr);
                      return (
                        <li
                          key={dateStr}
                          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${checked ? 'bg-sky-50' : 'hover:bg-gray-50'}`}
                          onClick={() => toggleDate(dateStr)}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDate(dateStr)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-gray-300 accent-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-900">{display}</span>
                        </li>
                      );
                    })}
                    {filteredDates.length === 0 && (
                      <li className="px-3 py-2 text-xs text-gray-400 text-center">No dates match</li>
                    )}
                  </ul>

                  {/* Done button — appears only when at least one date is selected */}
                  {selectedDates.size > 0 && (
                    <div className="border-t border-gray-100 px-3 py-2 flex justify-end bg-white">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-primary rounded hover:brightness-110 transition-all"
                      >
                        Done — {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="event-cancel-reason" className="block text-xs font-medium text-gray-600 mb-1">
                Reason:
              </label>
              <Textarea
                id="event-cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={4}
                className="w-full resize-y text-sm min-h-[96px]"
              />
            </div>

            {/* Cancel the Event(s) — right-aligned */}
            <div className="flex justify-end">
              <Button type="button" size="sm" variant="default" onClick={handleCancelEvents}>
                Cancel the Event(s)
              </Button>
            </div>
          </div>

          {/* ── Divider ── */}
          <hr className="border-slate-200" />

          {/* ── Cancelled Events Table ── */}
          <div className="flex flex-col gap-2">
            <div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAllow}
                className="text-primary border-primary hover:bg-primary/5"
              >
                Activate
              </Button>
            </div>

            <div className="border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#D6E8F7] border-b border-[#b8d4eb]">
                    <th className="w-8 px-2 py-1.5 text-left">
                      <input
                        type="checkbox"
                        checked={cancelledEvents.length > 0 && allowedIndices.size === cancelledEvents.length}
                        onChange={() => {
                          if (allowedIndices.size === cancelledEvents.length) {
                            setAllowedIndices(new Set());
                          } else {
                            setAllowedIndices(new Set(cancelledEvents.map((_, i) => i)));
                          }
                        }}
                        className="h-3.5 w-3.5 rounded border-gray-400 accent-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-2 py-1.5 text-left font-medium text-gray-700">Event Date</th>
                    <th className="px-2 py-1.5 text-left font-medium text-gray-700">Cancel Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cancelledEvents.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-3 text-xs text-gray-400 text-center">
                        No cancelled events
                      </td>
                    </tr>
                  ) : (
                    cancelledEvents.map((row, index) => (
                      <tr
                        key={`${row.eventDate}-${index}`}
                        className={`cursor-pointer transition-colors ${allowedIndices.has(index) ? 'bg-sky-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleAllowedIndex(index)}
                      >
                        <td className="px-2 py-1.5">
                          <input
                            type="checkbox"
                            checked={allowedIndices.has(index)}
                            onChange={() => toggleAllowedIndex(index)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300 accent-primary focus:ring-primary h-3.5 w-3.5"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-gray-900">{row.eventDate}</td>
                        <td className="px-2 py-1.5 text-gray-600">{row.cancelReason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── Fixed Footer ── */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default EventCancellationDialog;
