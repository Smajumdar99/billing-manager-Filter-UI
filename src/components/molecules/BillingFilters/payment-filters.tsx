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

interface PaymentFiltersProps {
  onSearchChange?: (search: string) => void
  onTypeFilterChange?: (type: string) => void
  onStatusFilterChange?: (status: string) => void
  onDateFilterChange?: (dateRange: string) => void
}

/**
 * PaymentFilters Component
 * 
 * Molecule component for payment receipt filtering.
 * Provides search and filter controls specific to payment data.
 * Uses atomic design principles with reusable components.
 */
export const PaymentFilters: FC<PaymentFiltersProps> = ({
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onDateFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentType, setPaymentType] = useState('all')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleTypeChange = (value: string) => {
    setPaymentType(value)
    onTypeFilterChange?.(value)
  }

  const handleStatusChange = (value: string) => {
    setPaymentStatus(value)
    onStatusFilterChange?.(value)
  }

  const handleDateChange = (value: string) => {
    setDateRange(value)
    onDateFilterChange?.(value)
  }

  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search payments, receipts..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Payment Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Payment Type Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={paymentType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="insurance">Insurance Payment</SelectItem>
                <SelectItem value="patient">Patient Payment</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Payment Status Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={paymentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={dateRange} onValueChange={handleDateChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFilters
