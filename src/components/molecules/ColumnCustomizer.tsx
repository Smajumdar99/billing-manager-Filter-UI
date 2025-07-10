import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Switch } from '@/components/atoms/Switch/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/Popover/popover';
import { AdjustmentsHorizontalIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

/**
 * ColumnCustomizer Component
 * 
 * Allows users to customize which columns are visible in the table
 * I will use atomic design principles for all components
 */

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  category: 'basic' | 'dates' | 'appointments' | 'forms' | 'additional';
  required?: boolean; // Some columns like Client name should always be visible
}

interface ColumnCustomizerProps {
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  className?: string;
}

const CATEGORY_LABELS = {
  basic: 'Basic Information',
  dates: 'Date Information', 
  appointments: 'Appointments & Sessions',
  forms: 'Treatment Plans & Forms',
  additional: 'Additional Information'
};

export const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  columns,
  onColumnsChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Group columns by category
  const columnsByCategory = columns.reduce((acc, column) => {
    if (!acc[column.category]) {
      acc[column.category] = [];
    }
    acc[column.category].push(column);
    return acc;
  }, {} as Record<string, ColumnConfig[]>);

  // Handle individual column toggle
  const handleColumnToggle = (columnId: string, visible: boolean) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  // Handle category toggle (show/hide all columns in category)
  const handleCategoryToggle = (category: string, visible: boolean) => {
    const updatedColumns = columns.map(col => 
      col.category === category && !col.required 
        ? { ...col, visible } 
        : col
    );
    onColumnsChange(updatedColumns);
  };

  // Check if all columns in category are visible
  const isCategoryVisible = (category: string) => {
    const categoryColumns = columnsByCategory[category] || [];
    const visibleCount = categoryColumns.filter(col => col.visible).length;
    const totalCount = categoryColumns.length;
    return visibleCount === totalCount;
  };

  // Check if some columns in category are visible
  const isCategoryPartiallyVisible = (category: string) => {
    const categoryColumns = columnsByCategory[category] || [];
    const visibleCount = categoryColumns.filter(col => col.visible).length;
    return visibleCount > 0 && visibleCount < categoryColumns.length;
  };

  // Quick presets
  const applyPreset = (preset: 'minimal' | 'standard' | 'comprehensive') => {
    let updatedColumns: ColumnConfig[];
    
    switch (preset) {
      case 'minimal':
        updatedColumns = columns.map(col => ({
          ...col,
          visible: col.required || ['provider', 'program', 'clientStatus', 'nextAppointment'].includes(col.id)
        }));
        break;
      case 'standard':
        updatedColumns = columns.map(col => ({
          ...col,
          visible: col.required || !['levelOfCare', 'dateLastSeenByMe', 'individualSession', 'groupSession', 'cancelNoShow', 'tentativeDischargeDate', 'erVisitsInfo', 'admitLocation'].includes(col.id)
        }));
        break;
      case 'comprehensive':
        updatedColumns = columns.map(col => ({ ...col, visible: true }));
        break;
      default:
        return;
    }
    
    onColumnsChange(updatedColumns);
  };

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2 bg-white hover:bg-gray-50", className)}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Columns ({visibleCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Customize Columns</h3>
          
          {/* Quick Presets */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 mb-2 block">Quick Presets:</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('minimal')}
                className="text-xs"
              >
                Minimal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('standard')}
                className="text-xs"
              >
                Standard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('comprehensive')}
                className="text-xs"
              >
                All
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.entries(columnsByCategory).map(([category, categoryColumns]) => (
            <div key={category} className="p-4 border-b border-gray-100 last:border-b-0">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-900">
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {categoryColumns.filter(col => col.visible).length}/{categoryColumns.length}
                  </span>
                  <Switch
                    checked={isCategoryVisible(category)}
                    onCheckedChange={(checked) => handleCategoryToggle(category, checked)}
                    className={cn(
                      isCategoryPartiallyVisible(category) && "opacity-60"
                    )}
                  />
                </div>
              </div>

              {/* Individual Columns */}
              <div className="space-y-2">
                {categoryColumns.map((column) => (
                  <div key={column.id} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 flex items-center gap-2">
                      {column.required && (
                        <span className="text-xs text-blue-600 font-medium">Required</span>
                      )}
                      {column.label}
                    </label>
                    <Switch
                      checked={column.visible}
                      onCheckedChange={(checked) => handleColumnToggle(column.id, checked)}
                      disabled={column.required}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{visibleCount} columns visible</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              <CheckIcon className="w-3 h-3 mr-1" />
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnCustomizer; 