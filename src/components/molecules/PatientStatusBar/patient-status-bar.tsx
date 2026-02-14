import React, { useState, useMemo } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { PlusIcon, Cog6ToothIcon, XMarkIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
}

interface PatientStatusBarProps {
  patient?: {
    id?: string;
    name?: string;
    status?: string;
    dateOfDeath?: string;
    deceasedDate?: string;
  } | null;
  showWidgetActions?: boolean;
  widgetsExpanded?: boolean;
  onToggleWidgets?: () => void;
  // Widget management props
  availableWidgets?: WidgetConfig[];
  activeWidgets?: string[];
  onAddWidget?: (widgetId: string) => void;
  onRemoveWidget?: (widgetId: string) => void;
  // Edit mode props
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

/**
 * PatientStatusBar Component
 * 
 * Displays patient status information in a sleek, compact format:
 * - Deceased indicator (if patient died 14+ days ago) with days since death
 * - Active/Inactive status (if deceased, shows Deceased instead of Active)
 * 
 * Clean, modern, compact design
 */
export const PatientStatusBar: React.FC<PatientStatusBarProps> = ({ 
  patient, 
  showWidgetActions = false,
  widgetsExpanded = true,
  onToggleWidgets,
  availableWidgets = [],
  activeWidgets = [],
  onAddWidget,
  onRemoveWidget,
  editMode = false,
  onToggleEditMode
}) => {
  const [showWidgetSelector, setShowWidgetSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active')
  
  // Filter widgets based on search query
  const filteredWidgets = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableWidgets
    }
    const query = searchQuery.toLowerCase()
    return availableWidgets.filter(widget => 
      widget.title.toLowerCase().includes(query)
    )
  }, [availableWidgets, searchQuery])
  
  // Separate widgets into active and available
  const activeWidgetsList = useMemo(() => {
    return filteredWidgets.filter(widget => activeWidgets.includes(widget.id))
  }, [filteredWidgets, activeWidgets])
  
  const availableWidgetsList = useMemo(() => {
    return filteredWidgets.filter(widget => !activeWidgets.includes(widget.id))
  }, [filteredWidgets, activeWidgets])
  if (!patient) {
    return null;
  }

  // Check if patient is deceased
  const deceasedDate = patient.dateOfDeath || patient.deceasedDate;
  const isDeceased = deceasedDate !== undefined && deceasedDate !== null;
  
  // Calculate days since death if deceased
  let daysSinceDeath: number | null = null;
  if (isDeceased && deceasedDate) {
    const deathDate = new Date(deceasedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - deathDate.getTime());
    daysSinceDeath = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Show deceased indicator if patient died 14 days ago or more
  const showDeceasedIndicator = isDeceased && daysSinceDeath !== null && daysSinceDeath >= 14;

  // Determine status - if deceased, show Inactive (not Deceased)
  const isDeceasedStatus = isDeceased || patient.status?.toLowerCase() === 'deceased';
  const isActive = !isDeceasedStatus && patient.status?.toLowerCase() === 'active';
  const isInactive = isDeceasedStatus || patient.status?.toLowerCase() === 'inactive' || !patient.status;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Deceased Indicator - Only show if deceased 14+ days ago */}
          {showDeceasedIndicator && deceasedDate && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
              <Icon icon="skull" className="text-red-600 flex-shrink-0" size="sm" />
              <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                Deceased
              </span>
              <span className="text-xs text-red-600">
                {formatDate(deceasedDate)} ({daysSinceDeath !== null ? `${daysSinceDeath} day${daysSinceDeath !== 1 ? 's' : ''} ago` : ''})
              </span>
            </div>
          )}

          {/* Status Badge - Show Inactive if deceased */}
          {isDeceasedStatus ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-300">
              <XCircleIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Inactive
              </span>
            </div>
          ) : isActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircleIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Active
              </span>
            </div>
          ) : isInactive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-300">
              <XCircleIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Inactive
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
              <div className="h-4 w-4 rounded-full bg-amber-400 border border-amber-500 flex-shrink-0"></div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Unknown
              </span>
            </div>
          )}
        </div>

        {/* Client Summary Chart Actions - Only show on Client Summary Chart */}
        {showWidgetActions && (
          <div className="flex items-center gap-3">
            {/* Add Widget Button */}
            <div className="relative">
              <Button
                onClick={() => setShowWidgetSelector(!showWidgetSelector)}
                className="flex items-center gap-2 px-4 py-2 h-9 rounded-lg border transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 shadow-none"
              >
                <PlusIcon className="w-4 h-4" />
                Add Widget
              </Button>
              
              {/* Widget Selector Dropdown */}
              {showWidgetSelector && availableWidgets.length > 0 && (
                <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-xl w-96 overflow-hidden">
                  {/* Header */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900">Manage Widgets</h3>
                      <button
                        onClick={() => {
                          setShowWidgetSelector(false)
                          setSearchQuery('')
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative mb-2">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search widgets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'available')} className="w-full">
                    <div className="px-5">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 h-10">
                        <TabsTrigger value="active" className="text-sm font-medium py-1.5">
                          Active ({activeWidgetsList.length})
                        </TabsTrigger>
                        <TabsTrigger value="available" className="text-sm font-medium py-1.5">
                          Available ({availableWidgetsList.length})
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    {/* Active Widgets Tab */}
                    <TabsContent value="active" className="mt-3 px-5 pb-4">
                      {activeWidgetsList.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-500">
                          {searchQuery ? 'No active widgets match your search' : 'No active widgets'}
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                            {activeWidgetsList.map((widget, index) => (
                              <div
                                key={widget.id}
                                className={`flex items-center justify-between px-4 py-3 transition-colors group ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                              >
                                <span className="text-sm font-medium text-gray-900 flex-1">{widget.title}</span>
                                <button
                                  onClick={() => {
                                    onRemoveWidget?.(widget.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all"
                                  title="Remove widget"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Available Widgets Tab */}
                    <TabsContent value="available" className="mt-3 px-5 pb-4">
                      {availableWidgetsList.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-500">
                          {searchQuery ? 'No available widgets match your search' : 'All widgets are active'}
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                            {availableWidgetsList.map((widget, index) => (
                              <div
                                key={widget.id}
                                className={`flex items-center justify-between px-4 py-3 transition-colors group ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                              >
                                <span className="text-sm font-medium text-gray-900 flex-1">{widget.title}</span>
                                <button
                                  onClick={() => {
                                    onAddWidget?.(widget.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all"
                                  title="Add widget"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  <span>Add</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>

            {/* Edit Layout Button */}
            {onToggleEditMode && (
              <Button
                onClick={onToggleEditMode}
                className={`flex items-center gap-2 px-4 py-2 h-9 rounded-lg border transition-colors shadow-none ${
                  editMode 
                    ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Cog6ToothIcon className="w-4 h-4" />
                {editMode ? 'Exit Edit' : 'Edit Layout'}
              </Button>
            )}

            {/* Expand/Collapse All Button */}
            {onToggleWidgets && (
              <Button
                onClick={onToggleWidgets}
                className="flex items-center gap-2 px-4 py-2 h-9 rounded-lg border transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 shadow-none"
              >
                <Icon 
                  icon={widgetsExpanded ? "compress" : "expand"} 
                  className="h-4 w-4" 
                  size="sm"
                />
                <span>{widgetsExpanded ? 'Collapse All' : 'Expand All'}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
