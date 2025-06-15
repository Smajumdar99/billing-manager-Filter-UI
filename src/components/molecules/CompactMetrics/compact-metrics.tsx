import React from 'react';
import { cn } from '@/lib/utils';
import {
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { EncounterStats } from '@/components/organisms/PastEncountersManager';

export interface CompactMetricsProps {
  /** CSS class name for styling */
  className?: string;
  /** Encounter statistics to display */
  stats: EncounterStats;
}

/**
 * CompactMetrics Component
 * 
 * A molecule component that displays encounter statistics in a compact,
 * horizontal layout suitable for header rows and breadcrumb areas.
 */
const CompactMetrics: React.FC<CompactMetricsProps> = ({
  className,
  stats
}) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Total Encounters Stat */}
      <div className="flex items-center gap-1.5">
        <ClockIcon className="h-4 w-4 text-blue-600" />
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-blue-700">{stats.total}</span>
          <span className="text-xs text-blue-600">Total</span>
        </div>
      </div>

      {/* This Month Stat */}
      <div className="flex items-center gap-1.5">
        <DocumentTextIcon className="h-4 w-4 text-green-600" />
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-green-700">{stats.thisMonth}</span>
          <span className="text-xs text-green-600">This Month</span>
        </div>
      </div>

      {/* Last Visit Stat */}
      <div className="flex items-center gap-1.5">
        <CalendarIcon className="h-4 w-4 text-amber-600" />
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-amber-700">{stats.lastVisit}</span>
          <span className="text-xs text-amber-600">Last Visit</span>
        </div>
      </div>

      {/* Providers Stat */}
      <div className="flex items-center gap-1.5">
        <UserIcon className="h-4 w-4 text-purple-600" />
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-purple-700">{stats.providers}</span>
          <span className="text-xs text-purple-600">Providers</span>
        </div>
      </div>
    </div>
  );
};

export default CompactMetrics; 