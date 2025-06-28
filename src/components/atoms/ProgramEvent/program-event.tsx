import React from 'react';
import { ClockIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/solid';

/**
 * Program Event Props Interface
 * Represents a behavioral program spanning multiple dates
 */
export interface ProgramEventProps {
  /** Program name/title */
  title: string;
  /** Program start date */
  startDate: Date;
  /** Program end date */
  endDate: Date;
  /** Current progress percentage (0-100) */
  progressPercentage: number;
  /** Total number of sessions planned */
  totalSessions: number;
  /** Number of completed sessions */
  completedSessions: number;
  /** Number of missed sessions */
  missedSessions: number;
  /** Program category for color coding */
  category: 'mental-health' | 'detox' | 'therapy' | 'rehabilitation';
  /** Position from left (in percentage) for start */
  leftPosition: number;
  /** Width percentage across timeline */
  widthPercentage: number;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Get program category colors
 */
const getProgramColors = (category: string) => {
  const colors = {
    'mental-health': {
      bg: 'bg-gradient-to-r from-purple-100 to-indigo-100',
      border: 'border-purple-300',
      text: 'text-purple-900',
      progress: 'bg-purple-500',
      shadow: 'shadow-purple-100'
    },
    'detox': {
      bg: 'bg-gradient-to-r from-orange-100 to-red-100',
      border: 'border-orange-300',
      text: 'text-orange-900',
      progress: 'bg-orange-500',
      shadow: 'shadow-orange-100'
    },
    'therapy': {
      bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      border: 'border-blue-300',
      text: 'text-blue-900',
      progress: 'bg-blue-500',
      shadow: 'shadow-blue-100'
    },
    'rehabilitation': {
      bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
      border: 'border-green-300',
      text: 'text-green-900',
      progress: 'bg-green-500',
      shadow: 'shadow-green-100'
    }
  };
  
  return colors[category as keyof typeof colors] || colors['mental-health'];
};

/**
 * Program Event Component
 * 
 * Displays behavioral programs as horizontal bars spanning across timeline dates
 * with progress indicators and missing visit alerts
 */
export const ProgramEvent: React.FC<ProgramEventProps> = ({
  title,
  startDate,
  endDate,
  progressPercentage,
  totalSessions,
  completedSessions,
  missedSessions,
  category,
  leftPosition,
  widthPercentage,
  onClick
}) => {
  const colors = getProgramColors(category);
  
  // Calculate status indicators
  const isCompleted = progressPercentage >= 100;
  const hasMissedSessions = missedSessions > 0;
  const isInProgress = progressPercentage > 0 && progressPercentage < 100;
  
  return (
    <div
      className="absolute cursor-pointer group z-20"
      style={{ 
        left: `${leftPosition}%`,
        width: `${widthPercentage}%`,
        minWidth: '200px'
      }}
      onClick={onClick}
    >
      {/* Main Program Bar */}
      <div
        className={`
          relative h-20 rounded-lg border-2 transition-all duration-300
          hover:shadow-lg hover:scale-102 transform
          ${colors.bg} ${colors.border} ${colors.shadow}
        `}
      >
        {/* Progress Bar Background */}
        <div className="absolute inset-1 bg-white/50 rounded-md overflow-hidden">
          {/* Progress Fill */}
          <div 
            className={`h-full transition-all duration-500 ${colors.progress} opacity-60`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {/* Program Title at Top */}
        <div className="absolute top-0 left-0 w-full px-3 pt-2 flex items-center min-w-0">
          <div className="flex items-center space-x-2 min-w-0 w-full">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : isInProgress ? (
                <ClockIcon className="h-4 w-4 text-blue-600" />
              ) : (
                <div className="h-4 w-4 rounded-full bg-gray-400" />
              )}
            </div>
            {/* Program Title */}
            <div className={`font-semibold text-base truncate ${colors.text} min-w-0 max-w-xs overflow-hidden whitespace-nowrap`} style={{maxWidth: '12vw'}}>
              {title}
            </div>
            {/* Missing Sessions Alert */}
            {hasMissedSessions && (
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            )}
          </div>
        </div>
        {/* Program Info at Bottom */}
        <div className="absolute bottom-0 left-0 w-full px-3 pb-2 flex items-end justify-between min-w-0">
          {/* Progress/Session Info */}
          <div className="flex items-center space-x-3 text-xs font-medium min-w-0">
            {/* Progress Percentage */}
            <div className={`${colors.text} opacity-80 truncate max-w-[40px] overflow-hidden whitespace-nowrap`}>
              {progressPercentage}%
            </div>
            {/* Session Count */}
            <div className={`${colors.text} opacity-70 truncate max-w-[60px] overflow-hidden whitespace-nowrap`}>
              {completedSessions}/{totalSessions}
            </div>
            {/* Missed Sessions */}
            {hasMissedSessions && (
              <div className="text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded text-xs truncate max-w-[60px] overflow-hidden whitespace-nowrap">
                {missedSessions} missed
              </div>
            )}
          </div>
        </div>
        {/* Date Range Tooltip on Hover */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
      
      {/* Session Indicators (Optional - for detailed view) */}
      <div className="absolute -bottom-3 left-0 right-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {Array.from({ length: Math.min(totalSessions, 10) }, (_, index) => {
          const isSessionCompleted = index < completedSessions;
          const isSessionMissed = index >= completedSessions && index < completedSessions + missedSessions;
          
          return (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                isSessionCompleted ? 'bg-green-500' :
                isSessionMissed ? 'bg-yellow-500' :
                'bg-gray-300'
              }`}
            />
          );
        })}
        {totalSessions > 10 && (
          <div className="text-xs text-gray-500">+{totalSessions - 10}</div>
        )}
      </div>
    </div>
  );
}; 