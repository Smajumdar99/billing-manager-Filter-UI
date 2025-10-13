/**
 * Billing Manager Types
 * 
 * Type definitions for the queue-based billing management system
 * Supports encounter-based billing workflow with error handling and bulk operations
 */

export type BillingStatus = 
  | 'ready_to_bill' 
  | 'authorized' 
  | 'unauthorized' 
  | 'in_review' 
  | 'claim_generated' 
  | 'claim_submitted' 
  | 'claim_accepted' 
  | 'claim_rejected' 
  | 'paid' 
  | 'write_off' 
  | 'patient_balance'

export type BillType = 
  | 'professional' 
  | 'institutional' 
  | 'ub04' 
  | 'hcfa' 
  | 'emergency' 
  | 'routine'

export type ErrorType = 
  | 'golden_thread' 
  | 'documentation' 
  | 'insurance_verification' 
  | 'coding' 
  | 'authorization' 
  | 'eligibility' 
  | 'demographic'

export type PayerType = 
  | 'Medicare' 
  | 'Medicaid' 
  | 'Blue Cross Blue Shield' 
  | 'Aetna' 
  | 'UnitedHealth' 
  | 'Cigna' 
  | 'Humana' 
  | 'Anthem' 
  | 'EAP' 
  | 'Tricare' 
  | 'Self Pay' 
  | 'HDFC ERGO'
  | 'Bajaj Allianz'
  | 'United India'
  | 'Government'
  | 'Corporate'
  | 'Other'

export type InsuranceBillingStatus = 'billed' | 'ready' | 'not_applicable' | 'pending'

/**
 * Insurance level billing information
 */
export interface InsuranceLevel {
  level: 'primary' | 'secondary' | 'tertiary'
  payer?: PayerType
  present: boolean
  billedTo: boolean
  status: InsuranceBillingStatus
}

/**
 * Individual billing error with details and override capability
 */
export interface BillingError {
  id: string
  type: ErrorType
  severity: 'critical' | 'warning' | 'info'
  message: string
  details?: string
  canOverride: boolean
  overrideReason?: string
  overriddenBy?: string
  overriddenAt?: string
}

/**
 * Core billing encounter entity for queue management
 */
export interface BillingEncounter {
  id: string
  patientId: string
  patientName: string
  patientMrn: string
  dateOfService: string
  treatmentTime?: string // Format: "HH:MM - HH:MM" (e.g., "10:00 - 10:30")
  encounterType: string
  provider: string
  department: string
  
  // Insurance and billing details
  primaryPayer: PayerType
  secondaryPayer?: PayerType
  tertiaryPayer?: PayerType
  policyNumber: string
  authorizationNumber?: string
  
  // Insurance billing levels
  insuranceLevels: InsuranceLevel[]
  
  // Billing status and amounts
  status: BillingStatus
  billType: BillType
  hcfaBillType?: string
  totalCharges: number
  allowedAmount?: number
  patientResponsibility?: number
  insuranceAmount?: number
  
  // Error handling
  errors: BillingError[]
  hasErrors: boolean
  errorSeverity?: 'critical' | 'warning' | 'info'
  
  // Claim information
  claimNumber?: string
  submissionDate?: string
  responseDate?: string
  
  // Assignment and processing
  assignedTo?: string
  lastModified: string
  priority: 'high' | 'medium' | 'low'
  
  // Flags for bulk operations
  selected?: boolean
  canGenerateClaim: boolean
  canSubmitClaim: boolean
  canOverride: boolean
  markedForRebill?: boolean
  
  // Override functionality
  billingOverrideEnabled: boolean
  overrideReason?: string
  overriddenBy?: string
  overriddenAt?: string
}

/**
 * Filter criteria for the billing queue
 */
export interface BillingQueueFilters {
  dateRange: {
    start: string
    end: string
  }
  payers: PayerType[]
  statuses: BillingStatus[]
  billTypes: BillType[]
  errorTypes: ErrorType[]
  hasErrors: boolean | null
  assignedTo?: string
  priority?: 'high' | 'medium' | 'low'
  searchQuery: string
}

/**
 * Bulk action types available for selected encounters
 */
export type BulkActionType = 
  | 'generate_claims' 
  | 'submit_claims' 
  | 'override_blocks' 
  | 'assign_to_user' 
  | 'mark_ready' 
  | 'export_list' 
  | 'bulk_edit'

/**
 * Bulk action configuration
 */
export interface BulkAction {
  type: BulkActionType
  label: string
  icon: React.ReactNode
  description: string
  requiresPermission?: string
  confirmationRequired: boolean
}

/**
 * Queue statistics for dashboard overview
 */
export interface BillingQueueStats {
  totalEncounters: number
  readyToBill: number
  withErrors: number
  claimsGenerated: number
  claimsSubmitted: number
  totalValue: number
  errorsByType: Record<ErrorType, number>
  encountersByPayer: Record<PayerType, number>
}

/**
 * Override request for error handling
 */
export interface OverrideRequest {
  encounterId: string
  errorId: string
  reason: string
  justification: string
  requestedBy: string
  approvedBy?: string
  approvedAt?: string
}

/**
 * ERA (Electronic Remittance Advice) data
 */
export interface ERAData {
  id: string
  claimNumber: string
  patientName: string
  dateOfService: string
  totalBilled: number
  allowedAmount: number
  paidAmount: number
  writeOffAmount: number
  patientBalance: number
  adjustmentCodes: string[]
  paymentDate: string
  checkNumber?: string
}
