import React, { useState, useRef, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/atoms/Dialog'
import { Button } from '@/components/atoms/Button'
import { LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface PlanSettingsAuthDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Plan Settings Authentication Dialog
 * Requires 4-digit PIN for accessing critical business settings
 * I will use atomic design principles for this security component
 */
const PlanSettingsAuthDialog: React.FC<PlanSettingsAuthDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  
  // Refs for input fields to handle focus management
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Correct PIN for authentication (hardcoded for now)
  const CORRECT_PIN = '1234'
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', ''])
      setError('')
      setIsVerifying(false)
      // Focus first input after dialog opens
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])
  
  // Handle input change for PIN digits
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return
    if (value && !/^\d$/.test(value)) return
    
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    setError('') // Clear error when user types
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-verify when all 4 digits are entered
    if (newPin.every(digit => digit !== '') && index === 3) {
      setTimeout(() => verifyPin(newPin.join('')), 200)
    }
  }
  
  // Handle backspace/delete key
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Move to previous input if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'Enter') {
      // Verify PIN on Enter if all digits filled
      const currentPin = pin.join('')
      if (currentPin.length === 4) {
        verifyPin(currentPin)
      }
    }
  }
  
  // Verify the entered PIN
  const verifyPin = async (enteredPin: string) => {
    setIsVerifying(true)
    setError('')
    
    // Simulate verification delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (enteredPin === CORRECT_PIN) {
      // Success - grant access to Plan Settings
      onSuccess()
      onClose()
    } else {
      // Failed authentication
      setError('Invalid PIN. Please try again.')
      setPin(['', '', '', ''])
      setIsVerifying(false)
      // Focus first input for retry
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }
  
  // Handle manual verify button click
  const handleVerify = () => {
    const enteredPin = pin.join('')
    if (enteredPin.length === 4) {
      verifyPin(enteredPin)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center p-6">
          {/* Security Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <LockClosedIcon className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Title */}
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Plan Settings Access
          </DialogTitle>
          
          {/* Description */}
          <DialogDescription className="text-sm text-gray-600 text-center mb-8">
            Enter your 4-digit PIN to access global treatment plan settings
          </DialogDescription>
          
          {/* PIN Input Fields */}
          <div className="flex justify-center space-x-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  error 
                    ? 'border-red-300 bg-red-50' 
                    : isVerifying 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="•"
              />
            ))}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          
          {/* Loading State */}
          {isVerifying && (
            <div className="flex items-center space-x-2 text-blue-600 mb-4">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Verifying PIN...</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleVerify}
              disabled={pin.join('').length !== 4 || isVerifying}
              className="flex-1"
            >
              {isVerifying ? 'Verifying...' : 'Access Settings'}
            </Button>
          </div>
          
          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            This feature is protected to prevent unauthorized access to critical business settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlanSettingsAuthDialog