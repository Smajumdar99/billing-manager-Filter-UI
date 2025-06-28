import React, { useState } from 'react';
import { TimelineFilter } from '@/components/atoms/TimelineFilter';
import { TimelineEvent } from '@/components/atoms/TimelineEvent';
import { ProgramEvent } from '@/components/atoms/ProgramEvent';
import type { EventStatus } from '@/components/atoms/TimelineEvent';
import type { ProgramEventProps } from '@/components/atoms/ProgramEvent';
import { ProgramEventDetailModal } from '@/components/atoms/ProgramEvent';
import { EventDetailModal, TimelineEventType } from '@/components/atoms/EventDetailModal';

/**
 * Timeline Event Data Interface
 */
interface TimelineEventData {
  id: string;
  title: string;
  status: EventStatus;
  category: 'assessments' | 'documentation' | 'services' | 'medication' | 'claims';
  date: Date;
  info?: string;
  hasMenu?: boolean;
}

/**
 * Program Event Data Interface
 */
interface ProgramEventData {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progressPercentage: number;
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  category: 'mental-health' | 'detox' | 'therapy' | 'rehabilitation';
}

/**
 * Enhanced timeline data with strategic positioning
 */
const mockTimelineData: TimelineEventData[] = [
  // 2020 Events
  { id: '1', title: 'Admitted', status: 'completed', category: 'documentation', date: new Date('2020-07-15'), info: '' },
  
  // 2021 Events  
  { id: '2', title: 'A&D Assessment', status: 'completed', category: 'assessments', date: new Date('2021-01-20'), info: '+2' },
  { id: '3', title: 'Vitals', status: 'completed', category: 'assessments', date: new Date('2021-02-10'), info: '+5' },
  { id: '4', title: 'PHQ9', status: 'warning', category: 'assessments', date: new Date('2021-02-25'), info: '' },
  { id: '5', title: 'Detoxification prog 1', status: 'completed', category: 'services', date: new Date('2021-05-15'), info: '' },
  { id: '6', title: 'Detoxification prog 2', status: 'skipped', category: 'services', date: new Date('2021-08-20'), info: 'Skipped', hasMenu: true },
  { id: '7', title: 'Mental Health Program', status: 'in-progress', category: 'services', date: new Date('2021-10-01'), info: '50% Complete' },
  { id: '8', title: 'Discharged', status: 'completed', category: 'documentation', date: new Date('2021-11-30'), info: '' },
  
  // 2022 Events
  { id: '9', title: 'Doctor appointment', status: 'completed', category: 'documentation', date: new Date('2022-01-15'), info: '', hasMenu: true },
  { id: '10', title: '$390 payment due', status: 'pending', category: 'claims', date: new Date('2022-03-10'), info: '', hasMenu: true },
  { id: '11', title: 'Claim Submitted', status: 'completed', category: 'claims', date: new Date('2022-06-20'), info: '$899.09' },
  { id: '12', title: 'Claim Denied', status: 'denied', category: 'claims', date: new Date('2022-08-15'), info: '', hasMenu: true },
  
  // 2023 Events
  { id: '13', title: 'Various appointments', status: 'completed', category: 'documentation', date: new Date('2023-02-01'), info: '' },
];

/**
 * Mock program data for behavioral programs spanning multiple dates
 */
const mockProgramData: ProgramEventData[] = [
  {
    id: 'prog-1',
    title: 'Mental Health Program',
    startDate: new Date('2021-10-01'),
    endDate: new Date('2022-01-15'),
    progressPercentage: 75,
    totalSessions: 16,
    completedSessions: 12,
    missedSessions: 2,
    category: 'mental-health'
  },
  {
    id: 'prog-2',
    title: 'Detoxification Program',
    startDate: new Date('2021-05-15'),
    endDate: new Date('2021-08-20'),
    progressPercentage: 100,
    totalSessions: 12,
    completedSessions: 12,
    missedSessions: 0,
    category: 'detox'
  },
  {
    id: 'prog-3',
    title: 'Cognitive Therapy',
    startDate: new Date('2022-03-01'),
    endDate: new Date('2022-08-30'),
    progressPercentage: 60,
    totalSessions: 20,
    completedSessions: 12,
    missedSessions: 3,
    category: 'therapy'
  }
];

/**
 * Filter categories for the timeline
 */
const filterCategories = [
  { id: 'assessments', label: 'Assessments', color: 'bg-teal-400' },
  { id: 'documentation', label: 'Documentation', color: 'bg-purple-400' },
  { id: 'services', label: 'Services', color: 'bg-orange-400' },
  { id: 'medication', label: 'Medication', color: 'bg-blue-400' },
  { id: 'claims', label: 'Claims', color: 'bg-green-400' }
];

/**
 * Calculate position percentage based on date within the timeline range
 */
const calculatePosition = (date: Date, startYear: number, endYear: number): number => {
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(endYear + 1, 0, 1);
  const totalTime = endDate.getTime() - startDate.getTime();
  const eventTime = date.getTime() - startDate.getTime();
  return Math.max(8, Math.min(92, (eventTime / totalTime) * 100));
};

/**
 * Calculate program position and width for spanning events
 */
const calculateProgramPosition = (startDate: Date, endDate: Date, startYear: number, endYear: number) => {
  const leftPosition = calculatePosition(startDate, startYear, endYear);
  const rightPosition = calculatePosition(endDate, startYear, endYear);
  const widthPercentage = rightPosition - leftPosition;
  
  return {
    leftPosition,
    widthPercentage: Math.max(5, widthPercentage) // Minimum 5% width
  };
};

/**
 * Smart positioning algorithm to avoid overlaps
 */
const calculateSmartPositions = (events: TimelineEventData[], startYear: number, endYear: number) => {
  const positions = events.map((event, index) => ({
    event,
    index,
    horizontalPosition: calculatePosition(event.date, startYear, endYear),
    verticalLevel: 0
  }));

  // Sort by horizontal position
  positions.sort((a, b) => a.horizontalPosition - b.horizontalPosition);

  // Calculate vertical levels to avoid overlaps
  const levels: { start: number; end: number; level: number }[] = [];
  
  positions.forEach((pos) => {
    const eventWidth = 150; // pixels
    const eventStart = pos.horizontalPosition - (eventWidth / 2) / 10; // Convert to percentage approximation
    const eventEnd = pos.horizontalPosition + (eventWidth / 2) / 10;
    
    // Find available level
    let level = 0;
    while (levels.some(l => l.level === level && 
      !(eventEnd < l.start || eventStart > l.end))) {
      level++;
    }
    
    pos.verticalLevel = level;
    levels.push({ start: eventStart, end: eventEnd, level });
  });

  return positions;
};

/**
 * Generate year markers for the timeline
 */
const generateYearMarkers = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

/**
 * Patient Timeline Component
 * 
 * Displays a comprehensive timeline view of patient lifecycle events with filtering capabilities
 */
export const PatientTimeline: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState('Any');
  const [startDate, setStartDate] = useState('Jan 2020');
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{start: number, end: number}>({start: 2021, end: 2022});
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<'left' | 'right' | 'range' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [originalRange, setOriginalRange] = useState<{start: number, end: number}>({start: 2021, end: 2022});
  
  const startYear = 2020;
  const endYear = 2023;
  const yearMarkers = generateYearMarkers(startYear, endYear);
  
  // Filter events based on selected activity AND selected year range
  const filteredEvents = mockTimelineData.filter(event => {
    const inActivity = selectedActivity === 'Any' || event.category === selectedActivity.toLowerCase();
    const inYearRange = event.date.getFullYear() >= selectedRange.start && event.date.getFullYear() <= selectedRange.end;
    return inActivity && inYearRange;
  });

  // Filter program events based on overlap with selected year range
  const filteredProgramData = mockProgramData.filter(program => {
    // Program is included if any part of it overlaps the selected year range
    return (
      program.endDate.getFullYear() >= selectedRange.start &&
      program.startDate.getFullYear() <= selectedRange.end
    );
  });

  // Calculate smart positions for events
  const eventPositions = calculateSmartPositions(filteredEvents, startYear, endYear);
  
  // Calculate program positions for filtered programs
  const programPositions = filteredProgramData.map(program => ({
    ...program,
    ...calculateProgramPosition(program.startDate, program.endDate, startYear, endYear)
  }));

  // Combine all events (point and program) for smart stacking
  const allTimelineItems = [
    ...eventPositions.map(pos => ({
      id: pos.event.id,
      type: 'point',
      left: pos.horizontalPosition,
      right: pos.horizontalPosition + 15, // 15% width for point events
      render: (lane: number) => (
        <div
          key={pos.event.id}
          className="absolute"
          style={{
            top: `${30 + lane * 90}px`,
            left: 0,
            right: 0,
            height: '70px',
          }}
        >
          <div
            onMouseEnter={() => handleEventHover(pos.event.id)}
            onMouseLeave={() => handleEventHover(null)}
            className={`transition-all duration-300 ${
              hoveredEvent === pos.event.id ? 'scale-105 z-50' : ''
            } ${
              selectedEvent === pos.event.id ? 'ring-2 ring-blue-400 ring-opacity-60 rounded-xl' : ''
            }`}
          >
            <TimelineEvent
              title={pos.event.title}
              status={pos.event.status}
              category={pos.event.category}
              info={pos.event.info}
              leftPosition={pos.horizontalPosition}
              width={150}
              onClick={() => {
                // Map category to modal type
                let type: TimelineEventType = 'documentation';
                if (pos.event.category === 'assessments') type = 'assessment';
                else if (pos.event.category === 'documentation') type = 'documentation';
                else if (pos.event.category === 'claims') type = 'claims';
                else if (pos.event.category === 'services') type = 'services';
                else if (pos.event.category === 'medication') type = 'medication';
                setModalEvent(pos.event);
                setModalType(type);
                setModalOpen(true);
              }}
              hasMenu={pos.event.hasMenu}
              date={pos.event.date}
            />
          </div>
        </div>
      ),
    })),
    ...programPositions.map((program) => ({
      id: program.id,
      type: 'program',
      left: program.leftPosition,
      right: program.leftPosition + program.widthPercentage,
      render: (lane: number) => (
        <div
          key={program.id}
          className="absolute"
          style={{
            top: `${30 + lane * 90}px`,
            left: 0,
            right: 0,
            height: '60px',
          }}
        >
          <ProgramEvent
            title={program.title}
            startDate={program.startDate}
            endDate={program.endDate}
            progressPercentage={program.progressPercentage}
            totalSessions={program.totalSessions}
            completedSessions={program.completedSessions}
            missedSessions={program.missedSessions}
            category={program.category}
            leftPosition={program.leftPosition}
            widthPercentage={program.widthPercentage}
            onClick={() => {
              setModalEvent(program);
              setModalType('program');
              setModalOpen(true);
            }}
          />
        </div>
      ),
    })),
  ];

  // Sort by start position
  allTimelineItems.sort((a, b) => a.left - b.left);

  // Assign to lanes
  const lanes: { end: number }[] = [];
  const itemsWithLanes = allTimelineItems.map(item => {
    let lane = 0;
    while (lanes[lane] && lanes[lane].end > item.left) {
      lane++;
    }
    lanes[lane] = { end: item.right };
    return { ...item, lane };
  });
  const maxLane = Math.max(0, ...itemsWithLanes.map(i => i.lane));

  // Handle global mouse events for range selection and dragging
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
      // Remove any cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && dragHandle) {
        e.preventDefault(); // Prevent text selection and other default behaviors
        
        // Set appropriate cursor for the drag operation
        if (dragHandle === 'left' || dragHandle === 'right') {
          document.body.style.cursor = 'ew-resize';
        } else if (dragHandle === 'range') {
          document.body.style.cursor = 'move';
        }
        document.body.style.userSelect = 'none';
        

        
        // Immediate update without requestAnimationFrame for better responsiveness
        const container = document.querySelector('[data-timeline-header]');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        
        // Use the same percentage calculation as the visual positioning
        const leftMarginPercent = 8; // 8% margin
        const usableWidthPercent = 84; // 84% usable width
        
        // Calculate mouse position as percentage of container width
        const mousePercentage = ((e.clientX - rect.left) / containerWidth) * 100;
        
        // Adjust for the left margin and map to usable area
        const adjustedPercentage = Math.max(0, Math.min(100, (mousePercentage - leftMarginPercent) / usableWidthPercent * 100));
        
        // Calculate target year with smoother progression
        const totalYears = endYear - startYear;
        const yearProgress = adjustedPercentage / 100;
        const targetYear = startYear + yearProgress * totalYears;
        
        // Allow half-year precision for smoother dragging
        const smoothYear = Math.max(startYear, Math.min(endYear, Math.round(targetYear * 2) / 2));
        const clampedYear = Math.round(smoothYear);
        
        if (dragHandle === 'left') {
          setSelectedRange(prev => ({
            start: Math.min(clampedYear, prev.end),
            end: prev.end
          }));
        } else if (dragHandle === 'right') {
          setSelectedRange(prev => ({
            start: prev.start,
            end: Math.max(clampedYear, prev.start)
          }));
        } else if (dragHandle === 'range') {
          const rangeDiff = originalRange.end - originalRange.start;
          const newStart = Math.max(startYear, Math.min(endYear - rangeDiff, clampedYear));
          setSelectedRange({
            start: newStart,
            end: newStart + rangeDiff
          });
        }
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, dragHandle, startYear, endYear, originalRange]);

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
    // Could trigger modal, sidebar, or detailed view
  };

  const handleEventHover = (eventId: string | null) => {
    setHoveredEvent(eventId);
  };

  const handleYearClick = (year: number) => {
    if (!isDragging) {
      setSelectedRange({start: year, end: year});
    }
  };

  const handleYearMouseDown = (year: number) => {
    setIsDragging(true);
    setSelectedRange({start: year, end: year});
  };

  const handleYearMouseOver = (year: number) => {
    if (isDragging) {
      setSelectedRange(prev => ({
        start: Math.min(prev.start, year),
        end: Math.max(prev.start, year)
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate months for selected range
  const getMonthsInRange = () => {
    const months = [];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    for (let year = selectedRange.start; year <= selectedRange.end; year++) {
      for (let month = 0; month < 12; month++) {
        months.push({
          year,
          month,
          label: `${monthNames[month]} ${year}`,
          position: ((year - startYear) * 12 + month) / ((endYear - startYear + 1) * 12) * 100
        });
      }
    }
    return months;
  };

  // Modal state for event detail
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<any>(null);
  const [modalType, setModalType] = useState<TimelineEventType>('program');

  // Handler for 'Jump to Today'
  const handleJumpToToday = () => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    setStartDate(label);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-100 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Timeline Header with Filters */}
      <div className="relative z-10 flex-shrink-0">
        <TimelineFilter
          categories={filterCategories}
          selectedActivity={selectedActivity}
          startDate={startDate}
          onActivityChange={setSelectedActivity}
          onStartDateChange={setStartDate}
          onJumpToToday={handleJumpToToday}
        />
      </div>

      {/* Enhanced Timeline Content */}
      <div className="flex-1 p-4 relative z-10 overflow-hidden">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border-0 h-full flex flex-col overflow-hidden ">
          {/* Interactive Year Selection Header */}
          <div 
            className="relative border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white select-none flex-shrink-0"
            onMouseUp={handleMouseUp}
            data-timeline-header
          >
            {/* Enhanced Grid Pattern Background */}
            <div className="absolute inset-0">
              {/* Main grid boxes pattern - more prominent */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `
                  linear-gradient(to right, #6b7280 1px, transparent 1px),
                  linear-gradient(to bottom, #6b7280 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Secondary grid for finer detail */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(to right, #9ca3af 0.5px, transparent 0.5px),
                  linear-gradient(to bottom, #9ca3af 0.5px, transparent 0.5px)
                `,
                backgroundSize: '10px 10px'
              }}></div>
              
              {/* Grid box highlights at intersections for better visibility */}
              <div className="absolute inset-0 opacity-8" style={{
                backgroundImage: `
                  radial-gradient(circle at 0px 0px, #4f46e5 1.5px, transparent 1.5px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Subtle grid box fill for depth */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `
                  linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
                  linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
                  linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}></div>
            </div>
            
            {/* Timeline Scale Marks */}
            <div className="absolute bottom-0 left-8 right-8 h-2 flex items-end">
              {Array.from({ length: 25 }, (_, index) => (
                <div 
                  key={index}
                  className={`flex-1 ${index % 5 === 0 ? 'h-2 bg-gray-400/50' : 'h-1 bg-gray-300/40'}`}
                  style={{ width: '4%' }}
                />
              ))}
            </div>
            
            <div className="flex items-center h-20 relative px-8">
              {/* Range Selection Background - Modern & Sleek */}
              <div 
                className={`absolute top-2 bottom-2 border-2 border-blue-200/90 bg-gradient-to-r from-blue-100/60 via-blue-50/40 to-blue-100/60 rounded-xl transition-all ease-out backdrop-blur-sm ${
                  isDragging ? 'duration-0 shadow-lg bg-gradient-to-r from-blue-200/70 via-blue-100/50 to-blue-200/70 border-blue-300/40' : 'duration-500'
                }`}
                style={{
                  left: `${8 + ((selectedRange.start - startYear) / (endYear - startYear)) * 84}%`,
                  width: `${Math.max(8, ((selectedRange.end - selectedRange.start + 1) / (endYear - startYear + 1)) * 84)}%`
                }}
              >
                {/* Left Handle - Sleek Design */}
                <div 
                  className={`absolute -left-1 top-1 bottom-1 w-4 bg-gradient-to-b from-blue-400/80 to-blue-500/80 rounded-lg cursor-ew-resize transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                    dragHandle === 'left' && isDragging 
                      ? 'bg-gradient-to-b from-blue-500/90 to-blue-600/90 scale-105 shadow-md' 
                      : 'hover:bg-gradient-to-b hover:from-blue-500/90 hover:to-blue-600/90 hover:scale-102'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsDragging(true);
                    setDragHandle('left');
                    setDragStartX(e.clientX);
                    setOriginalRange(selectedRange);
                  }}
                >
                  <div className="w-0.5 h-6 bg-white/80 rounded-full"></div>
                </div>
                
                {/* Center draggable area - Minimal Design */}
                <div 
                  className={`absolute left-4 right-4 top-0 bottom-0 cursor-move transition-all duration-300 rounded-lg ${
                    dragHandle === 'range' && isDragging 
                      ? 'bg-blue-50/20 scale-102' 
                      : 'hover:bg-blue-50/10'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsDragging(true);
                    setDragHandle('range');
                    setDragStartX(e.clientX);
                    setOriginalRange(selectedRange);
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Right Handle - Sleek Design */}
                <div 
                  className={`absolute -right-1 top-1 bottom-1 w-4 bg-gradient-to-b from-blue-400/80 to-blue-500/80 rounded-lg cursor-ew-resize transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                    dragHandle === 'right' && isDragging 
                      ? 'bg-gradient-to-b from-blue-500/90 to-blue-600/90 scale-105 shadow-md' 
                      : 'hover:bg-gradient-to-b hover:from-blue-500/90 hover:to-blue-600/90 hover:scale-102'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsDragging(true);
                    setDragHandle('right');
                    setDragStartX(e.clientX);
                    setOriginalRange(selectedRange);
                  }}
                >
                  <div className="w-0.5 h-6 bg-white/80 rounded-full"></div>
                </div>
              </div>
              
              {/* Year Markers */}
              {yearMarkers.map((year, index) => {
                const position = 8 + (index / (yearMarkers.length - 1)) * 84;
                const isSelected = year >= selectedRange.start && year <= selectedRange.end;
                
                return (
                  <div
                    key={year}
                    className="absolute transform -translate-x-1/2 cursor-pointer z-10"
                    style={{ left: `${position}%` }}
                    onClick={() => handleYearClick(year)}
                    onMouseDown={() => handleYearMouseDown(year)}
                    onMouseOver={() => handleYearMouseOver(year)}
                  >
                    <div className="flex flex-col items-center group">
                      <div className={`text-sm font-semibold mb-3 tracking-wide transition-all duration-200 ${
                        isSelected 
                          ? 'text-blue-700 scale-105' 
                          : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-102'
                      }`} style={{ paddingTop: '0px' }}>
                        {year}
                      </div>
                      <div className={`w-0.5 h-6 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 group-hover:bg-blue-400'
                      }`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Timeline Content Area */}
          <div className="relative bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col min-h-0">
            {/* Clean Background - No Grid Boxes */}
            <div className="absolute inset-0">
              {/* Vertical month grid lines - minimal and clean */}
              {Array.from({ length: (endYear - startYear + 1) * 12 }, (_, index) => {
                const monthPosition = 8 + (index / ((endYear - startYear + 1) * 12)) * 84;
                return (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 w-px bg-gray-300/40"
                    style={{ left: `${monthPosition}%` }}
                  />
                );
              })}
              
              {/* Horizontal timeline indicator */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-300 rounded-full opacity-50 transform -translate-y-1/2"></div>
              
              {/* Year markers for better visibility */}
              {yearMarkers.map((year, index) => {
                const position = 8 + (index / (yearMarkers.length - 1)) * 84;
                return (
                  <div
                    key={`grid-year-${year}`}
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-200/40"
                    style={{ left: `${position}%` }}
                  />
                );
              })}
            </div>

            {/* Timeline Events with Smart Stacking */}
            <div className="relative flex-1 px-8 py-6 overflow-hidden">
              {itemsWithLanes.map(item => item.render(item.lane))}
            </div>
          </div>

          {/* Range Detail View - Month Breakdown */}
          <div className="border-t-2 border-gray-100 bg-gradient-to-r from-blue-50/50 to-blue-50/30 flex-shrink-0 overflow-hidden h-[300px]">
            <div className="px-8 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  Detailed View: {selectedRange.start === selectedRange.end ? selectedRange.start : `${selectedRange.start} - ${selectedRange.end}`}
                </h3>
                <div className="text-sm text-gray-600">
                  {filteredEvents.filter(event => 
                    event.date.getFullYear() >= selectedRange.start && 
                    event.date.getFullYear() <= selectedRange.end
                  ).length} events in selected range
                </div>
              </div>
              
              {/* Horizontal Timeline for Months */}
              <div className="relative mb-3">
                <div className="h-2 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 rounded-full shadow-md opacity-70 mx-4"></div>
                {/* Month markers on timeline */}
                {Array.from({ length: 12 }, (_, index) => {
                  const position = (index / 11) * 100;
                  return (
                    <div
                      key={`month-marker-${index}`}
                      className="absolute top-1/2 w-1 h-4 bg-gray-400 transform -translate-y-1/2 -translate-x-1/2 opacity-60"
                      style={{ left: `${4 + position * 0.92}%` }}
                    />
                  );
                })}
              </div>
              
              {/* Month Grid for Selected Range */}
              <div className="grid grid-cols-12 gap-1 overflow-x-auto">
                {Array.from({ length: 12 }, (_, index) => {
                  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                  const year = selectedRange.start;
                  const monthEvents = filteredEvents.filter(event => 
                    event.date.getFullYear() === year && 
                    event.date.getMonth() === index
                  );
                  
                  return (
                    <div 
                      key={`${year}-${index}`}
                      className="flex flex-col items-center p-1.5 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-200 cursor-pointer border border-gray-200/50 min-h-[60px] min-w-0"
                    >
                                              <div className="text-xs font-bold text-blue-700 mb-0.5 truncate w-full text-center">
                          {monthNames[index]}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                        {year}
                      </div>
                      {monthEvents.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {monthEvents.slice(0, 2).map((event, idx) => (
                            <div
                              key={event.id}
                              className={`w-2 h-2 rounded-full ${
                                event.category === 'assessments' ? 'bg-teal-400' :
                                event.category === 'documentation' ? 'bg-purple-400' :
                                event.category === 'services' ? 'bg-orange-400' :
                                event.category === 'medication' ? 'bg-blue-400' :
                                'bg-green-400'
                              }`}
                            />
                          ))}
                          {monthEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{monthEvents.length - 2}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Event Detail Modal */}
      {modalEvent && (
        <EventDetailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          event={modalEvent}
        />
      )}
    </div>
  );
}; 