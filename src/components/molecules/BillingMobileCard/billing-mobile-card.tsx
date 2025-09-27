import { FC } from 'react'
import { Badge } from '@/components/atoms/Badge/badge'
import { Button } from '@/components/atoms/Button/button'
import { 
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'

interface BillingInvoice {
  id: string
  patientName: string
  patientId: string
  invoiceNumber: string
  dateOfService: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'cancelled'
  paymentMethod: string
  insuranceProvider?: string
  balanceOwed: number
  lastPaymentDate?: string
}

interface BillingMobileCardProps {
  invoice: BillingInvoice
  onViewDetails?: (invoice: BillingInvoice) => void
  onPayNow?: (invoice: BillingInvoice) => void
}

/**
 * BillingMobileCard Component
 * 
 * Mobile-optimized card component for displaying billing invoice information.
 * Includes status badges, patient info, and action buttons.
 * Responsive design for small screens with touch-friendly interactions.
 */
export const BillingMobileCard: FC<BillingMobileCardProps> = ({
  invoice,
  onViewDetails,
  onPayNow
}) => {
  // Status badge configuration with consistent colors
  const getStatusBadge = (status: BillingInvoice['status']) => {
    const statusConfig = {
      paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800' },
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', className: 'bg-orange-100 text-orange-800' }
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header with Invoice Number and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-sm text-primary">
            {invoice.invoiceNumber}
          </span>
        </div>
        {getStatusBadge(invoice.status)}
      </div>
      
      {/* Patient Information */}
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">{invoice.patientName}</h3>
        <p className="text-sm text-gray-500">{invoice.patientId}</p>
      </div>
      
      {/* Service Date */}
      <div className="flex items-center space-x-2 mb-3">
        <CalendarIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          Service: {new Date(invoice.dateOfService).toLocaleDateString()}
        </span>
      </div>
      
      {/* Payment Method */}
      <div className="flex items-center space-x-2 mb-3">
        <CreditCardIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{invoice.paymentMethod}</span>
        {invoice.insuranceProvider && (
          <span className="text-xs text-gray-500">
            • {invoice.insuranceProvider}
          </span>
        )}
      </div>
      
      {/* Amount Information */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
          <p className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Balance Owed</p>
          <p className={`font-semibold ${invoice.balanceOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${invoice.balanceOwed.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails?.(invoice)}
        >
          View Details
        </Button>
        {invoice.balanceOwed > 0 && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onPayNow?.(invoice)}
          >
            Pay Now
          </Button>
        )}
      </div>
    </div>
  )
}

export default BillingMobileCard
