import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem } from '../../ui/select';

/**
 * Timeline Filter Props
 */
export interface TimelineFilterProps {
  /** Filter categories */
  categories: Array<{
    id: string;
    label: string;
    color: string;
    count?: number;
  }>;
  /** Selected activity type */
  selectedActivity: string;
  /** Start date value */
  startDate: string;
  /** On activity change handler */
  onActivityChange: (activity: string) => void;
  /** On start date change handler */
  onStartDateChange: (date: string) => void;
  /** On jump to today handler */
  onJumpToToday?: () => void;
}

/**
 * Timeline Filter Component
 * 
 * Provides filtering controls for the patient timeline view
 */
export const TimelineFilter: React.FC<TimelineFilterProps> = ({
  categories,
  selectedActivity,
  startDate,
  onActivityChange,
  onStartDateChange,
  onJumpToToday
}) => {
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 border-b-2 border-gray-100">
      {/* Enhanced Category Legend */}
      <div className="flex items-center space-x-8">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-3 group">
            <div 
              className={`w-4 h-4 rounded-lg ${category.color} shadow-sm group-hover:shadow-md transition-shadow duration-200`}
            />
            <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
              {category.label}
            </span>
            {category.count && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Filter Controls */}
      <div className="flex items-center space-x-6">
        {/* Activities Filter */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-700">Activities:</span>
          <div className="relative min-w-[160px]">
            <Select
              value={selectedActivity}
              onValueChange={onActivityChange}
              className="w-full"
              placeholder="Any"
            >
              <SelectItem value="Any">Any</SelectItem>
              <SelectItem value="Assessments">Assessments</SelectItem>
              <SelectItem value="Documentation">Documentation</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="Claims">Claims</SelectItem>
            </Select>
          </div>
        </div>

        {/* Start Date Filter + Today Button */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-700">Start date:</span>
          <div className="relative min-w-[140px]">
            <Select
              value={startDate}
              onValueChange={onStartDateChange}
              className="w-full"
              placeholder="Select..."
            >
              <SelectItem value="Jan 2020">Jan 2020</SelectItem>
              <SelectItem value="Jan 2021">Jan 2021</SelectItem>
              <SelectItem value="Jan 2022">Jan 2022</SelectItem>
              <SelectItem value="Jan 2023">Jan 2023</SelectItem>
            </Select>
          </div>
          {/* Today Button */}
          <button
            type="button"
            className="ml-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onJumpToToday}
            aria-label="Jump to Today"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}; 