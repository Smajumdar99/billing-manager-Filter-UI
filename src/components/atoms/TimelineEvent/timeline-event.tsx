import React from 'react';
import { CheckIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/solid';

/**
 * Timeline Event Status Types
 */
export type EventStatus = 'completed' | 'in-progress' | 'skipped' | 'warning' | 'pending' | 'denied';

/**
 * Timeline Event Props
 */
export interface TimelineEventProps {
  /** Event title/name */
  title: string;
  /** Event status */
  status: EventStatus;
  /** Event category for color coding */
  category: 'assessments' | 'documentation' | 'services' | 'medication' | 'claims';
  /** Additional info like completion percentage or amount */
  info?: string;
  /** Position from left (in percentage) */
  leftPosition: number;
  /** Width of the event (in pixels) */
  width?: number;
  /** Click handler */
  onClick?: () => void;
  /** Whether event has a menu (three dots) */
  hasMenu?: boolean;
  /** Event date for display below the line */
  date?: Date;
}

/**
 * Get category color classes based on event category
 */
const getCategoryColors = (category: string, status: EventStatus) => {
  const baseColors = {
    assessments: 'bg-teal-50 border-teal-200 text-teal-900 shadow-teal-100',
    documentation: 'bg-purple-50 border-purple-200 text-purple-900 shadow-purple-100', 
    services: 'bg-orange-50 border-orange-200 text-orange-900 shadow-orange-100',
    medication: 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100',
    claims: 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100'
  };
  
  if (status === 'skipped') {
    return 'bg-yellow-50 border-yellow-300 text-yellow-800 shadow-yellow-100';
  }
  
  if (status === 'warning' || status === 'denied') {
    return 'bg-yellow-50 border-yellow-300 text-yellow-800 shadow-yellow-100';
  }
  
  return baseColors[category as keyof typeof baseColors] || baseColors.assessments;
};

/**
 * Get status icon based on event status
 */
const getStatusIcon = (status: EventStatus) => {
  switch (status) {
    case 'completed':
      return <CheckIcon className="h-3 w-3 text-green-600" />;
    case 'warning':
    case 'denied':
      return <ExclamationTriangleIcon className="h-3 w-3 text-yellow-600" />;
    case 'in-progress':
      return <ClockIcon className="h-3 w-3 text-blue-600" />;
    default:
      return null;
  }
};

/**
 * Timeline Event Component
 * 
 * Renders an individual event on the patient timeline with proper positioning and styling
 */
export const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  status,
  category,
  info,
  leftPosition,
  width = 120,
  onClick,
  hasMenu = false,
  date
}) => {
  const colorClasses = getCategoryColors(category, status);
  const statusIcon = getStatusIcon(status);
  
  return (
    <div
      className={`absolute transform -translate-x-1/2 cursor-pointer group z-10`}
      style={{ 
        left: `${leftPosition}%`,
        width: `${width}px`
      }}
      onClick={onClick}
    >
      <div
        className={`
          px-3 py-2 rounded-lg border text-xs font-medium text-center
          shadow-md hover:shadow-lg transition-all duration-200 ease-out
          hover:scale-102 hover:-translate-y-0.5 transform
          ${colorClasses}
          ${status === 'skipped' ? 'opacity-75' : ''}
          min-h-[50px] flex flex-col justify-center
        `}
      >
        <div className="flex items-center justify-center space-x-1 mb-1">
          {statusIcon}
          <span className="truncate font-semibold text-center leading-tight">{title}</span>
          {hasMenu && (
            <button className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
            </button>
          )}
        </div>
        
        {/* Date Display Inside Card */}
        {date && (
          <div className="text-xs text-gray-600 font-medium text-center mb-1 opacity-75">
            {date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        )}
        
        {info && (
          <div className="text-xs font-medium opacity-80 text-center">
            {info}
          </div>
        )}
      </div>
      

    </div>
  );
}; 