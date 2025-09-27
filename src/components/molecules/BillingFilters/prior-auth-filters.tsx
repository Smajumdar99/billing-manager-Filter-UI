import { FC, useState } from 'react'
import { Input } from '@/components/atoms/Input/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select/select'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface PriorAuthFiltersProps {
  onSearchChange?: (search: string) => void
  onStatusFilterChange?: (status: string) => void
  onProviderFilterChange?: (provider: string) => void
  onUrgencyFilterChange?: (urgency: string) => void
}

/**
 * PriorAuthFilters Component
 * 
 * Molecule component for prior authorization filtering.
 * Provides search and filter controls specific to prior auth data.
 * Uses atomic design principles with reusable components.
 */
export const PriorAuthFilters: FC<PriorAuthFiltersProps> = ({
  onSearchChange,
  onStatusFilterChange,
  onProviderFilterChange,
  onUrgencyFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [authStatus, setAuthStatus] = useState('all')
  const [provider, setProvider] = useState('all')
  const [urgency, setUrgency] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleStatusChange = (value: string) => {
    setAuthStatus(value)
    onStatusFilterChange?.(value)
  }

  const handleProviderChange = (value: string) => {
    setProvider(value)
    onProviderFilterChange?.(value)
  }

  const handleUrgencyChange = (value: string) => {
    setUrgency(value)
    onUrgencyFilterChange?.(value)
  }

  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search authorizations, patients..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Prior Auth Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Authorization Status Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={authStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Insurance Provider Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="aetna">Aetna</SelectItem>
                <SelectItem value="medicare">Medicare</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
                <SelectItem value="cigna">Cigna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={urgency} onValueChange={handleUrgencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Urgencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="expedited">Expedited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriorAuthFilters
