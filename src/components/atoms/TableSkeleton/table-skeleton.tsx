import React from 'react';
import { cn } from '@/lib/utils';

/**
 * TableSkeleton Component - Atomic Design Pattern
 * 
 * Provides skeleton loading states for Staff Dashboard table
 * Supports both desktop AG Grid view and mobile card view
 * 
 * Features:
 * - Matches actual table column structure
 * - Responsive design for desktop/mobile
 * - Smooth shimmer animation
 * - Configurable number of rows
 */

interface TableSkeletonProps {
  /** Number of skeleton rows to display */
  rows?: number;
  /** Variant for different table layouts */
  variant?: 'desktop' | 'mobile';
  /** Additional CSS classes */
  className?: string;
}

// Skeleton shimmer animation styles
const shimmerClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

// Desktop skeleton row component - matches AG Grid structure
const DesktopSkeletonRow: React.FC = () => (
  <div className="flex items-center border-b border-gray-100 px-4 py-3 min-h-[52px]">
    {/* Client Column */}
    <div className="flex-none w-[180px] pr-4">
      <div className={cn("h-4 rounded mb-1", shimmerClasses)} />
      <div className={cn("h-3 w-20 rounded", shimmerClasses)} />
    </div>
    
    {/* Program Column */}
    <div className="flex-none w-[200px] pr-4">
      <div className={cn("h-6 w-32 rounded-full", shimmerClasses)} />
    </div>
    
    {/* Provider Column */}
    <div className="flex-none w-[160px] pr-4">
      <div className={cn("h-4 w-28 rounded", shimmerClasses)} />
    </div>
    
    {/* Status Column */}
    <div className="flex-none w-[120px] pr-4">
      <div className={cn("h-5 w-16 rounded-full", shimmerClasses)} />
    </div>
    
    {/* DOB Column */}
    <div className="flex-none w-[100px] pr-4">
      <div className={cn("h-4 w-20 rounded", shimmerClasses)} />
    </div>
    
    {/* Admitted Date Column */}
    <div className="flex-none w-[120px] pr-4">
      <div className={cn("h-4 w-20 rounded", shimmerClasses)} />
    </div>
    
    {/* Discharged Date Column */}
    <div className="flex-none w-[130px] pr-4">
      <div className={cn("h-4 w-16 rounded", shimmerClasses)} />
    </div>
    
    {/* Last Seen Column */}
    <div className="flex-none w-[120px] pr-4">
      <div className={cn("h-4 w-20 rounded", shimmerClasses)} />
    </div>
    
    {/* Next Appointment Column */}
    <div className="flex-none w-[140px] pr-4">
      <div className={cn("h-4 w-24 rounded", shimmerClasses)} />
    </div>
    
    {/* Treatment Plans Column */}
    <div className="flex-none w-[240px] pr-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <div className={cn("h-3 w-3 rounded-full", shimmerClasses)} />
          <div className={cn("h-3 w-20 rounded", shimmerClasses)} />
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("h-3 w-3 rounded-full", shimmerClasses)} />
          <div className={cn("h-3 w-16 rounded", shimmerClasses)} />
        </div>
      </div>
    </div>
    
    {/* Location Column */}
    <div className="flex-none w-[140px] pr-4">
      <div className={cn("h-4 w-24 rounded mb-1", shimmerClasses)} />
      <div className={cn("h-3 w-16 rounded", shimmerClasses)} />
    </div>
    
    {/* Actions Column */}
    <div className="flex-none w-[140px]">
      <div className="flex items-center justify-center gap-2">
        <div className={cn("h-8 w-8 rounded-lg", shimmerClasses)} />
        <div className={cn("h-8 w-8 rounded-lg", shimmerClasses)} />
        <div className={cn("h-8 w-8 rounded-lg", shimmerClasses)} />
      </div>
    </div>
  </div>
);

// Mobile skeleton card component - matches mobile card structure
const MobileSkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm">
    {/* Header with name and status */}
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className={cn("h-4 w-32 rounded mb-1", shimmerClasses)} />
        <div className={cn("h-3 w-20 rounded", shimmerClasses)} />
      </div>
      <div className={cn("h-6 w-16 rounded-full", shimmerClasses)} />
    </div>
    
    {/* Program and Provider */}
    <div className="mb-3">
      <div className={cn("h-6 w-40 rounded-full mb-2", shimmerClasses)} />
      <div className={cn("h-3 w-36 rounded", shimmerClasses)} />
    </div>
    
    {/* Key Information Grid */}
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <div className={cn("h-3 w-12 rounded mb-1", shimmerClasses)} />
          <div className={cn("h-3 w-20 rounded", shimmerClasses)} />
        </div>
      ))}
    </div>
    
    {/* Treatment Plans */}
    <div className="mb-3 p-2 bg-gray-50 rounded">
      <div className={cn("h-3 w-24 rounded mb-2", shimmerClasses)} />
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", shimmerClasses)} />
            <div className={cn("h-3 w-28 rounded", shimmerClasses)} />
          </div>
        ))}
      </div>
    </div>
    
    {/* Quick Actions */}
    <div className="flex gap-2 pt-3 border-t border-gray-100">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={cn("h-8 flex-1 rounded", shimmerClasses)} />
      ))}
    </div>
  </div>
);

// Desktop skeleton header - matches AG Grid header structure
const DesktopSkeletonHeader: React.FC = () => (
  <div className="flex items-center bg-gray-50 border-b border-gray-200 px-4 py-3 h-[44px] font-medium text-sm text-gray-700">
    <div className="flex-none w-[180px] pr-4">Client</div>
    <div className="flex-none w-[200px] pr-4">Program</div>
    <div className="flex-none w-[160px] pr-4">Provider</div>
    <div className="flex-none w-[120px] pr-4">Client Status</div>
    <div className="flex-none w-[100px] pr-4">DOB</div>
    <div className="flex-none w-[120px] pr-4">Admitted On</div>
    <div className="flex-none w-[130px] pr-4">Discharged On</div>
    <div className="flex-none w-[120px] pr-4">Last Seen</div>
    <div className="flex-none w-[140px] pr-4">Next Appointment</div>
    <div className="flex-none w-[240px] pr-4">Treatment Plans</div>
    <div className="flex-none w-[140px] pr-4">Location</div>
    <div className="flex-none w-[140px]">Actions</div>
  </div>
);

/**
 * Main TableSkeleton Component
 * 
 * Renders skeleton loading states for Staff Dashboard table
 * Automatically adapts to desktop/mobile layouts
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 8, 
  variant = 'desktop',
  className 
}) => {
  return (
    <div className={cn("w-full", className)}>
      {variant === 'desktop' ? (
        // Desktop skeleton - mimics AG Grid structure
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1400px]">
              {/* Header */}
              <DesktopSkeletonHeader />
              
              {/* Rows */}
              <div className="bg-white">
                {[...Array(rows)].map((_, index) => (
                  <DesktopSkeletonRow key={index} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Pagination skeleton */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className={cn("h-4 w-32 rounded", shimmerClasses)} />
            <div className="flex items-center gap-2">
              <div className={cn("h-8 w-8 rounded", shimmerClasses)} />
              <div className={cn("h-8 w-8 rounded", shimmerClasses)} />
              <div className={cn("h-8 w-8 rounded", shimmerClasses)} />
              <div className={cn("h-8 w-8 rounded", shimmerClasses)} />
            </div>
          </div>
        </div>
      ) : (
        // Mobile skeleton - mimics card structure
        <div className="p-4">
          {[...Array(rows)].map((_, index) => (
            <MobileSkeletonCard key={index} />
          ))}
        </div>
      )}
    </div>
  );
}; 