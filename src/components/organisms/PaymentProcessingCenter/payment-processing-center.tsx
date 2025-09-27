import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/input'
import { Badge } from '@/components/atoms/Badge/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select/select'
import {
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Patient data types for behavioral health
interface Patient {
  id: string
  name: string
  phone: string
  insurance: string
  lastSession: string
  outstandingBalance: number
  nextAppointment?: string
}

interface ServiceItem {
  id: string
  type: 'copay' | 'session' | 'balance' | 'plan'
  description: string
  date: string
  amount: number
  status: 'pending' | 'overdue' | 'current'
}

// Mock data for behavioral health patients
const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'Sarah Martinez',
    phone: '(555) 123-4567',
    insurance: 'Blue Cross Blue Shield',
    lastSession: '2024-01-20',
    outstandingBalance: 85.00,
    nextAppointment: '2024-01-27'
  },
  {
    id: 'PAT002', 
    name: 'Michael Johnson',
    phone: '(555) 987-6543',
    insurance: 'Aetna',
    lastSession: '2024-01-18',
    outstandingBalance: 150.00
  },
  {
    id: 'PAT003',
    name: 'Emma Thompson',
    phone: '(555) 456-7890', 
    insurance: 'Medicare',
    lastSession: '2024-01-22',
    outstandingBalance: 25.00,
    nextAppointment: '2024-01-29'
  }
]

const mockServiceItems: ServiceItem[] = [
  {
    id: 'SVC001',
    type: 'copay',
    description: 'Individual Therapy Session Copay',
    date: '2024-01-27',
    amount: 25.00,
    status: 'current'
  },
  {
    id: 'SVC002',
    type: 'balance',
    description: 'Outstanding Balance - Group Therapy',
    date: '2024-01-15',
    amount: 45.00,
    status: 'overdue'
  },
  {
    id: 'SVC003',
    type: 'session',
    description: 'Intensive Outpatient Program (IOP)',
    date: '2024-01-20',
    amount: 85.00,
    status: 'pending'
  },
  {
    id: 'SVC004',
    type: 'plan',
    description: 'Treatment Plan Payment #3 of 6',
    date: '2024-01-30',
    amount: 120.00,
    status: 'current'
  }
]

type PaymentStep = 'search' | 'context' | 'payment' | 'confirm'

/**
 * PaymentProcessingCenter Component
 * 
 * Comprehensive payment processing interface designed specifically for 
 * behavioral health clinic billing managers. Provides step-by-step workflow
 * with proper context and patient information.
 */
export const PaymentProcessingCenter: FC = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('search')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total for selected services
  const totalAmount = selectedServices.reduce((total, serviceId) => {
    const service = mockServiceItems.find(s => s.id === serviceId)
    return total + (service?.amount || 0)
  }, 0)

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setCurrentStep('context')
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getServiceIcon = (type: ServiceItem['type']) => {
    switch (type) {
      case 'copay': return <CreditCardIcon className="w-4 h-4" />
      case 'session': return <CalendarIcon className="w-4 h-4" />
      case 'balance': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'plan': return <ClockIcon className="w-4 h-4" />
      default: return <BanknotesIcon className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: ServiceItem['status']) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'current': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stepTitles = {
    search: 'Find Patient',
    context: 'Payment Details', 
    payment: 'Payment Method',
    confirm: 'Confirmation'
  }

  const renderStepIndicator = () => (
    <div className="space-y-6">
      {(['search', 'context', 'payment', 'confirm'] as PaymentStep[]).map((step, index) => (
        <div key={step} className="relative flex items-start">
          {/* Step Circle */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
            currentStep === step 
              ? 'bg-blue-600 text-white' 
              : index < (['search', 'context', 'payment', 'confirm'] as PaymentStep[]).indexOf(currentStep)
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {index < (['search', 'context', 'payment', 'confirm'] as PaymentStep[]).indexOf(currentStep) ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          
          {/* Step Content */}
          <div className="ml-3 min-w-0 flex-1">
            <p className={`text-sm font-medium ${
              currentStep === step 
                ? 'text-blue-600' 
                : index < (['search', 'context', 'payment', 'confirm'] as PaymentStep[]).indexOf(currentStep)
                ? 'text-green-600'
                : 'text-gray-500'
            }`}>
              {stepTitles[step]}
            </p>
          </div>
          
          {/* Vertical Connector */}
          {index < 3 && (
            <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  )

  const renderSearchStep = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Find Patient</h2>
        <p className="text-sm text-gray-600">Search by name, phone number, or patient ID</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg py-3"
        />
      </div>

      {/* Patient Results - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => handlePatientSelect(patient)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.id} • {patient.phone}</p>
                  <p className="text-xs text-gray-400">{patient.insurance}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-red-600">
                  ${patient.outstandingBalance.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Outstanding</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContextStep = () => (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Details</h2>
        <p className="text-sm text-gray-600">Select services and amounts for payment</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Patient Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedPatient?.name}</h3>
              <p className="text-sm text-gray-600">{selectedPatient?.id} • {selectedPatient?.insurance}</p>
              {selectedPatient?.nextAppointment && (
                <p className="text-xs text-blue-600 mt-1">
                  Next: {new Date(selectedPatient.nextAppointment).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-red-600">
                ${selectedPatient?.outstandingBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Total Outstanding</p>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Select Items to Pay:</h3>
          {mockServiceItems.map((service) => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedServices.includes(service.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <div className="text-gray-600">
                    {getServiceIcon(service.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{service.description}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(service.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                  <p className="font-semibold text-gray-900">
                    ${service.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        {selectedServices.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Payment:</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Actions at Bottom */}
      <div className="border-t border-gray-200 pt-4 mt-4 bg-white">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('search')}>
            Back to Search
          </Button>
          <Button 
            onClick={() => setCurrentStep('payment')}
            disabled={selectedServices.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Method</h2>
        <p className="text-sm text-gray-600">Choose how to process the payment</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Payment Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">{selectedPatient?.name}</p>
              <p className="text-sm text-gray-600">{selectedServices.length} item(s) selected</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-6">
          <div
            onClick={() => setPaymentMethod('credit')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === 'credit'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Credit/Debit Card</h3>
                <p className="text-sm text-gray-600">Process card payment immediately</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('bank')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === 'bank'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BanknotesIcon className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Bank Account (ACH)</h3>
                <p className="text-sm text-gray-600">Direct bank transfer (3-5 business days)</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === 'cash'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BanknotesIcon className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="font-semibold">Cash/Check</h3>
                <p className="text-sm text-gray-600">Manual payment entry</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Actions at Bottom */}
      <div className="border-t border-gray-200 pt-4 mt-4 bg-white">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('context')}>
            Back to Details
          </Button>
          <Button 
            onClick={() => setCurrentStep('confirm')}
            disabled={!paymentMethod}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Review Payment
          </Button>
        </div>
      </div>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirm Payment</h2>
        <p className="text-sm text-gray-600">Review payment details before processing</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Final Review */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-semibold">{selectedPatient?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span className="font-semibold">{selectedServices.length} service(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold capitalize">{paymentMethod} Payment</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-green-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Actions at Bottom */}
      <div className="border-t border-gray-200 pt-4 mt-4 bg-white">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('payment')}>
            Back to Payment
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              // Handle payment processing
              console.log('Processing payment...', {
                patient: selectedPatient,
                services: selectedServices,
                amount: totalAmount,
                method: paymentMethod
              })
              // Reset workflow
              setCurrentStep('search')
              setSelectedPatient(null)
              setSelectedServices([])
              setPaymentMethod('')
              setSearchQuery('')
            }}
          >
            Process Payment
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Left Column - Steps Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-900 mb-2">Payment Processing</h1>
          <p className="text-sm text-gray-600">Complete the payment workflow step by step</p>
        </div>
        
        {/* Step Indicator - Vertical Layout */}
        <div className="flex-1">
          {renderStepIndicator()}
        </div>
      </div>

      {/* Right Column - Content */}
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
          {currentStep === 'search' && renderSearchStep()}
          {currentStep === 'context' && renderContextStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirm' && renderConfirmStep()}
        </div>
      </div>
    </div>
  )
}

export default PaymentProcessingCenter
