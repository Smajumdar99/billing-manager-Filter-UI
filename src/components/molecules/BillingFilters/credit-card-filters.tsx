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

interface CreditCardFiltersProps {
  onSearchChange?: (search: string) => void
  onCardTypeFilterChange?: (type: string) => void
  onStatusFilterChange?: (status: string) => void
  onExpirationFilterChange?: (expiration: string) => void
}

/**
 * CreditCardFilters Component
 * 
 * Molecule component for credit card management filtering.
 * Provides search and filter controls specific to credit card data.
 * Uses atomic design principles with reusable components.
 */
export const CreditCardFilters: FC<CreditCardFiltersProps> = ({
  onSearchChange,
  onCardTypeFilterChange,
  onStatusFilterChange,
  onExpirationFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cardType, setCardType] = useState('all')
  const [cardStatus, setCardStatus] = useState('all')
  const [expiration, setExpiration] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleTypeChange = (value: string) => {
    setCardType(value)
    onCardTypeFilterChange?.(value)
  }

  const handleStatusChange = (value: string) => {
    setCardStatus(value)
    onStatusFilterChange?.(value)
  }

  const handleExpirationChange = (value: string) => {
    setExpiration(value)
    onExpirationFilterChange?.(value)
  }

  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search cards, patients..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Credit Card Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Card Type Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={cardType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Card Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Card Types</SelectItem>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
                <SelectItem value="debit">Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Card Status Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={cardStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiration Filter */}
          <div className="min-w-0 flex-1 sm:w-48">
            <Select value={expiration} onValueChange={handleExpirationChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Expirations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expirations</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon (30 days)</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="this-year">Expiring This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCardFilters
