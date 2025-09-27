import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Icon } from '@/components/atoms/Icon/Icon'

export interface SortOption {
  field: string
  label: string
  direction: 'asc' | 'desc'
}

export interface BillingSortPanelProps {
  currentSort?: SortOption
  onSortChange: (sort: SortOption | undefined) => void
  encounterCount: number
  className?: string
}

/**
 * BillingSortPanel Component
 * 
 * Sort interface for billing encounters with predefined sort options
 * and direction controls (Oldest First / Newest First).
 */
export const BillingSortPanel: FC<BillingSortPanelProps> = ({
  currentSort,
  onSortChange,
  encounterCount,
  className = ""
}) => {
  const [selectedField, setSelectedField] = useState<string>(currentSort?.field || '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(currentSort?.direction || 'desc')

  // Available sort fields
  const sortFields = [
    { value: 'dateOfService', label: 'Encounter Date' },
    { value: 'id', label: 'Encounter Id' },
    { value: 'patientName', label: 'Person Last Name' },
    { value: 'patientFirstName', label: 'Person First Name' }
  ]

  // Handle field selection
  const handleFieldSelect = (field: string) => {
    setSelectedField(field)
    const newSort: SortOption = {
      field,
      label: sortFields.find(f => f.value === field)?.label || field,
      direction: sortDirection
    }
    onSortChange(newSort)
  }

  // Handle direction change
  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction)
    if (selectedField) {
      const newSort: SortOption = {
        field: selectedField,
        label: sortFields.find(f => f.value === selectedField)?.label || selectedField,
        direction
      }
      onSortChange(newSort)
    }
  }

  // Clear sort
  const handleClearSort = () => {
    setSelectedField('')
    setSortDirection('desc')
    onSortChange(undefined)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="sort" className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-700">Sort By</span>
        </div>
        
        {currentSort && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSort}
            className="gap-2 text-gray-500"
          >
            <Icon icon="times" className="w-4 h-4" />
            Clear Sort
          </Button>
        )}
      </div>

      <div className="text-xs text-gray-600">
        {encounterCount} encounter{encounterCount !== 1 ? 's' : ''} will be sorted
      </div>

      {/* Sort Field Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700">4. Sort By</h4>
        
        <div className="space-y-2">
          {sortFields.map((field) => (
            <button
              key={field.value}
              onClick={() => handleFieldSelect(field.value)}
              className={`w-full text-left px-3 py-2 text-sm border rounded-lg transition-colors ${
                selectedField === field.value
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {field.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Direction */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="oldest-first"
              name="sortDirection"
              checked={sortDirection === 'asc'}
              onChange={() => handleDirectionChange('asc')}
              className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
            />
            <label htmlFor="oldest-first" className="text-sm text-gray-700">
              Oldest First
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="newest-first"
              name="sortDirection"
              checked={sortDirection === 'desc'}
              onChange={() => handleDirectionChange('desc')}
              className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
            />
            <label htmlFor="newest-first" className="text-sm text-gray-700">
              Newest First
            </label>
          </div>
        </div>
      </div>

      {/* Current Sort Display */}
      {currentSort && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            {sortDirection === 'asc' ? (
              <Icon icon="arrow-up" className="w-4 h-4" />
            ) : (
              <Icon icon="arrow-down" className="w-4 h-4" />
            )}
            <span className="text-amber-700 font-medium">
              Sorted by {currentSort.label} ({sortDirection === 'asc' ? 'Oldest First' : 'Newest First'})
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingSortPanel
