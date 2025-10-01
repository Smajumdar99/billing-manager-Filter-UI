import React from 'react';
import { cn } from '@/lib/utils';

// Task block interface
export interface TaskBlock {
  id: string;
  count: number;
  label: string;
  textColor: string;
  isCustom?: boolean;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

interface TaskBlockCardProps extends TaskBlock {
  index: number;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

/**
 * TaskBlockCard Component
 * 
 * Reusable card component used in TaskHub and other places
 * Extracted from TaskHub for consistency across the app
 */
export const TaskBlockCard: React.FC<TaskBlockCardProps> = ({ 
  id, 
  count, 
  label, 
  textColor, 
  criticality, 
  index, 
  isSelected,
  onClick
}) => {
  // Get colors based on criticality
  const getColors = () => {
    switch (criticality) {
      case 'critical':
        return {
          accent: 'bg-red-500',
          accentLight: 'bg-red-100',
          number: 'text-red-600',
          icon: 'text-gray-500',
          iconBg: 'bg-gray-50',
          badge: 'bg-red-100 text-red-700',
          selectedBg: 'bg-red-50',
          selectedBorder: 'border-red-300'
        };
      case 'high':
        return {
          accent: 'bg-orange-500',
          accentLight: 'bg-orange-100',
          number: 'text-orange-600',
          icon: 'text-gray-500',
          iconBg: 'bg-gray-50',
          badge: 'bg-orange-100 text-orange-700',
          selectedBg: 'bg-orange-50',
          selectedBorder: 'border-orange-300'
        };
      case 'medium':
        return {
          accent: 'bg-gray-400',
          accentLight: 'bg-gray-200',
          number: 'text-gray-600',
          icon: 'text-gray-500',
          iconBg: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-600',
          selectedBg: 'bg-gray-50',
          selectedBorder: 'border-gray-300'
        };
      default: // low
        return {
          accent: 'bg-gray-300',
          accentLight: 'bg-gray-200',
          number: 'text-gray-600',
          icon: 'text-gray-500',
          iconBg: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-600',
          selectedBg: 'bg-gray-50',
          selectedBorder: 'border-gray-300'
        };
    }
  };

  // Helper to rotate through several pastel gradient backgrounds
  const getPastelGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50',
      'bg-gradient-to-br from-green-50 via-teal-50 to-blue-50',
      'bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-50',
      'bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50',
      'bg-gradient-to-br from-orange-50 via-yellow-50 to-yellow-50',
    ];
    return gradients[index % gradients.length];
  };


  const colors = getColors();
  
  return (
    <div
      className={cn(
        'relative rounded-xl border-2 border-white ring-2 ring-inset ring-white/80',
        getPastelGradient(index),
        isSelected ? 'ring-2 ring-blue-300 scale-[1.02] z-10' : '',
        'hover:scale-[1.03] hover:border-white hover:z-10 transition-all duration-200 cursor-pointer group p-3 h-full flex flex-col',
        'border-2 border-white shadow-sm'
      )}
      onClick={() => onClick?.(id)}
      tabIndex={0}
      aria-label={label}
      data-testid={`task-block-${id}`}
    >
      {/* White overlay for ultra-light pastel effect with frosted hover */}
      <div className="absolute inset-0 rounded-xl bg-white/70 pointer-events-none z-0 group-hover:bg-white/80" />
      
      {/* Header with icon and label */}
      <div className="flex items-center gap-2 z-10 relative">
        <span className="text-gray-800 font-medium text-sm md:text-xs lg:text-sm text-left line-clamp-2">
          {label}
        </span>
      </div>
      
      {/* Bottom section with count */}
      <div className="mt-2 flex justify-between items-end z-10 relative">
        {/* Count display */}
        <div>
          <span
            className={cn(
              "text-3xl",
              criticality === "critical" ? "font-bold" : "font-normal",
              colors.number
            )}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskBlockCard;
