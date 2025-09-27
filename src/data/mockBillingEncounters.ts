import { 
  BillingEncounter, 
  BillingError, 
  BillingQueueStats,
  PayerType,
  BillingStatus,
  BillType,
  ErrorType 
} from '@/types/billing-manager'

/**
 * Mock billing errors for demonstration
 */
const mockErrors: BillingError[] = [
  {
    id: 'err_001',
    type: 'golden_thread',
    severity: 'critical',
    message: 'Missing discharge summary',
    details: 'Patient discharge summary not available in system',
    canOverride: false
  },
  {
    id: 'err_002',
    type: 'documentation',
    severity: 'warning',
    message: 'Incomplete procedure notes',
    details: 'Surgeon notes missing from procedure documentation',
    canOverride: true
  },
  {
    id: 'err_003',
    type: 'insurance_verification',
    severity: 'critical',
    message: 'Insurance eligibility expired',
    details: 'Patient insurance coverage expired on date of service',
    canOverride: false
  },
  {
    id: 'err_004',
    type: 'authorization',
    severity: 'warning',
    message: 'Pre-authorization pending',
    details: 'Procedure requires pre-authorization from payer',
    canOverride: true
  },
  {
    id: 'err_005',
    type: 'coding',
    severity: 'warning',
    message: 'ICD-10 code mismatch',
    details: 'Diagnosis code does not support procedure performed',
    canOverride: true
  }
]

/**
 * Mock billing encounters for the queue-based billing manager
 */
export const mockBillingEncounters: BillingEncounter[] = [
  {
    id: 'enc_001',
    patientId: 'pat_001',
    patientName: 'Michael Johnson',
    patientMrn: 'MRN001238',
    dateOfService: '2024-01-08',
    encounterType: 'Surgery',
    provider: 'Dr. Menon',
    department: 'Orthopedics',
    primaryPayer: 'Blue Cross Blue Shield',
    policyNumber: 'BA987654',
    authorizationNumber: 'AUTH67890',
    status: 'claim_rejected',
    billType: 'institutional',
    hcfaBillType: 'UB-04 institutional',
    hcfaBillType: 'UB-04 institutional',
    totalCharges: 180.00,
    allowedAmount: 180.00,
    patientResponsibility: 5000.00,
    insuranceAmount: 115000.00,
    errors: [mockErrors[0]], // Critical golden thread error
    hasErrors: true,
    errorSeverity: 'critical',
    lastModified: '2024-01-22',
    priority: 'high',
    assignedTo: 'Annie Admin',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: 3 insurances, primary billed (green), secondary ready (red), tertiary pending (red)
    insuranceLevels: [
      { level: 'primary', payer: 'Blue Cross Blue Shield', present: true, billedTo: true, status: 'billed' },
      { level: 'secondary', payer: 'Medicare', present: true, billedTo: false, status: 'ready' },
      { level: 'tertiary', payer: 'Self Pay', present: true, billedTo: false, status: 'pending' }
    ]
  },
  {
    id: 'enc_002',
    patientId: 'pat_002',
    patientName: 'Emily Davis',
    patientMrn: 'MRN001239',
    dateOfService: '2024-01-14',
    encounterType: 'Follow-up Visit',
    provider: 'Dr. Iyer',
    department: 'Internal Medicine',
    primaryPayer: 'UnitedHealth',
    policyNumber: 'UI567890',
    status: 'ready_to_bill',
    billType: 'professional',
    hcfaBillType: 'POS: 11 office',
    hcfaBillType: 'POS: 11 office',
    totalCharges: 3500.00,
    allowedAmount: 3200.00,
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-19',
    priority: 'low',
    assignedTo: 'Annie Admin',
    canGenerateClaim: true,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: 2 insurances, primary billed (green), secondary ready (red)
    insuranceLevels: [
      { level: 'primary', payer: 'UnitedHealth', present: true, billedTo: true, status: 'billed' },
      { level: 'secondary', payer: 'Self Pay', present: true, billedTo: false, status: 'ready' }
    ]
  },
  {
    id: 'enc_003',
    patientId: 'pat_003',
    patientName: 'Robert Wilson',
    patientMrn: 'MRN001240',
    dateOfService: '2024-01-16',
    encounterType: 'Laboratory Tests',
    provider: 'Dr. Malhotra',
    department: 'Pathology',
    primaryPayer: 'Self Pay',
    policyNumber: 'SELF001',
    status: 'authorized',
    billType: 'professional',
    hcfaBillType: 'POS: 11 office',
    totalCharges: 2800.00,
    patientResponsibility: 2800.00,
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-17',
    priority: 'low',
    assignedTo: 'Annie Admin',
    canGenerateClaim: true,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: Primary only, billed (green)
    insuranceLevels: [
      { level: 'primary', payer: 'Self Pay', present: true, billedTo: true, status: 'billed' }
    ]
  },
  {
    id: 'enc_004',
    patientId: 'pat_004',
    patientName: 'Sarah Thompson',
    patientMrn: 'MRN001241',
    dateOfService: '2024-01-13',
    encounterType: 'Maternity Care',
    provider: 'Dr. Nanda',
    department: 'Obstetrics',
    primaryPayer: 'Government',
    policyNumber: 'GOV123456',
    status: 'claim_accepted',
    billType: 'institutional',
    hcfaBillType: 'UB-04 institutional',
    totalCharges: 65000.00,
    allowedAmount: 58000.00,
    claimNumber: 'CLM2024003',
    submissionDate: '2024-01-18',
    responseDate: '2024-01-23',
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-23',
    priority: 'medium',
    assignedTo: 'Government Claims S',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: All 3 levels billed (all green)
    insuranceLevels: [
      { level: 'primary', payer: 'Government', present: true, billedTo: true, status: 'billed' },
      { level: 'secondary', payer: 'Medicare', present: true, billedTo: true, status: 'billed' },
      { level: 'tertiary', payer: 'Self Pay', present: true, billedTo: true, status: 'billed' }
    ]
  },
  {
    id: 'enc_005',
    patientId: 'pat_005',
    patientName: 'David Martinez',
    patientMrn: 'MRN001242',
    dateOfService: '2024-01-11',
    encounterType: 'Corporate Health Check',
    provider: 'Dr. Kapoor',
    department: 'Preventive Medicine',
    primaryPayer: 'Corporate',
    policyNumber: 'CORP789123',
    status: 'paid',
    billType: 'professional',
    hcfaBillType: 'POS: 11 office',
    totalCharges: 12000.00,
    allowedAmount: 12000.00,
    insuranceAmount: 12000.00,
    claimNumber: 'CLM2024004',
    submissionDate: '2024-01-16',
    responseDate: '2024-01-21',
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-21',
    priority: 'low',
    assignedTo: 'Corporate Billing Tea',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: 2 insurances, both billed (both green)
    insuranceLevels: [
      { level: 'primary', payer: 'Cigna', present: true, billedTo: true, status: 'billed' },
      { level: 'secondary', payer: 'Medicare', present: true, billedTo: true, status: 'billed' }
    ]
  },
  {
    id: 'enc_006',
    patientId: 'pat_006',
    patientName: 'Jessica Brown',
    patientMrn: 'MRN001243',
    dateOfService: '2024-01-09',
    encounterType: 'ICU Stay',
    provider: 'Dr. Khanna',
    department: 'Critical Care',
    primaryPayer: 'Aetna',
    policyNumber: 'AET456123',
    status: 'in_review',
    billType: 'institutional',
    hcfaBillType: 'UB-04 institutional',
    totalCharges: 285000.00,
    errors: [mockErrors[2]], // Insurance eligibility expired
    hasErrors: true,
    errorSeverity: 'critical',
    lastModified: '2024-01-17',
    priority: 'high',
    assignedTo: 'Senior Claims Analyst',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: true,
    overrideReason: 'Critical patient - bypass validation',
    overriddenBy: 'Senior Billing Manager',
    overriddenAt: '2024-01-17T10:30:00Z',
    // Scenario: Primary not billed (red), secondary N/A
    insuranceLevels: [
      { level: 'primary', payer: 'Aetna', present: true, billedTo: false, status: 'pending' },
      { level: 'secondary', present: false, billedTo: false, status: 'not_applicable' }
    ]
  },
  {
    id: 'enc_007',
    patientId: 'pat_007',
    patientName: 'Robert Wilson',
    patientMrn: 'MRN001240',
    dateOfService: '2024-01-16',
    encounterType: 'Laboratory Tests',
    provider: 'Dr. Malhotra',
    department: 'Pathology',
    primaryPayer: 'Self Pay',
    policyNumber: 'SELF001',
    status: 'authorized',
    billType: 'professional',
    hcfaBillType: 'POS: 11 office',
    totalCharges: 2800.00,
    patientResponsibility: 2800.00,
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-17',
    priority: 'low',
    canGenerateClaim: true,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: Primary only, authorized but not billed (red)
    insuranceLevels: [
      { level: 'primary', payer: 'Self Pay', present: true, billedTo: false, status: 'ready' }
    ]
  },
  {
    id: 'enc_008',
    patientId: 'pat_008',
    patientName: 'Sarah Thompson',
    patientMrn: 'MRN001241',
    dateOfService: '2024-01-13',
    encounterType: 'Maternity Care',
    provider: 'Dr. Nanda',
    department: 'Obstetrics',
    primaryPayer: 'Government',
    policyNumber: 'GOV123456',
    status: 'claim_accepted',
    billType: 'institutional',
    hcfaBillType: 'UB-04 institutional',
    totalCharges: 65000.00,
    allowedAmount: 58000.00,
    claimNumber: 'CLM2024003',
    submissionDate: '2024-01-18',
    responseDate: '2024-01-23',
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-23',
    priority: 'medium',
    assignedTo: 'Government Claims Specialist',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: Government insurance with secondary, both billed (both green)
    insuranceLevels: [
      { level: 'primary', payer: 'Government', present: true, billedTo: true, status: 'billed' },
      { level: 'secondary', payer: 'Medicare', present: true, billedTo: true, status: 'billed' }
    ]
  },
  {
    id: 'enc_009',
    patientId: 'pat_009',
    patientName: 'David Martinez',
    patientMrn: 'MRN001242',
    dateOfService: '2024-01-11',
    encounterType: 'Corporate Health Check',
    provider: 'Dr. Kapoor',
    department: 'Preventive Medicine',
    primaryPayer: 'Corporate',
    policyNumber: 'CORP789123',
    status: 'paid',
    billType: 'professional',
    hcfaBillType: 'POS: 11 office',
    totalCharges: 12000.00,
    allowedAmount: 12000.00,
    insuranceAmount: 12000.00,
    claimNumber: 'CLM2024004',
    submissionDate: '2024-01-16',
    responseDate: '2024-01-21',
    errors: [],
    hasErrors: false,
    lastModified: '2024-01-21',
    priority: 'low',
    assignedTo: 'Corporate Billing Team',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: Corporate insurance, primary billed (green)
    insuranceLevels: [
      { level: 'primary', payer: 'Corporate', present: true, billedTo: true, status: 'billed' }
    ]
  },
  {
    id: 'enc_010',
    patientId: 'pat_010',
    patientName: 'Jessica Brown',
    patientMrn: 'MRN001243',
    dateOfService: '2024-01-09',
    encounterType: 'ICU Stay',
    provider: 'Dr. Khanna',
    department: 'Critical Care',
    primaryPayer: 'Aetna',
    policyNumber: 'AET456123',
    status: 'in_review',
    billType: 'institutional',
    hcfaBillType: 'UB-04 institutional',
    totalCharges: 285000.00,
    errors: [mockErrors[2]], // Insurance eligibility expired
    hasErrors: true,
    errorSeverity: 'critical',
    lastModified: '2024-01-17',
    priority: 'high',
    assignedTo: 'Senior Claims Analyst',
    canGenerateClaim: false,
    canSubmitClaim: false,
    canOverride: false,
    billingOverrideEnabled: false,
    // Scenario: Primary not billed (red), secondary N/A
    insuranceLevels: [
      { level: 'primary', payer: 'Aetna', present: true, billedTo: false, status: 'pending' },
      { level: 'secondary', present: false, billedTo: false, status: 'not_applicable' }
    ]
  }
]

/**
 * Calculate billing queue statistics from encounters
 */
export const getBillingQueueStats = (encounters: BillingEncounter[]): BillingQueueStats => {
  const stats: BillingQueueStats = {
    totalEncounters: encounters.length,
    readyToBill: 0,
    withErrors: 0,
    claimsGenerated: 0,
    claimsSubmitted: 0,
    totalValue: 0,
    errorsByType: {
      golden_thread: 0,
      documentation: 0,
      insurance_verification: 0,
      coding: 0,
      authorization: 0,
      eligibility: 0,
      demographic: 0
    },
    encountersByPayer: {
      Medicare: 0,
      Medicaid: 0,
      'Blue Cross Blue Shield': 0,
      Aetna: 0,
      UnitedHealth: 0,
      Cigna: 0,
      EAP: 0,
      Humana: 0,
      Anthem: 0,
      Tricare: 0,
      'Self Pay': 0,
      'HDFC ERGO': 0,
      'Bajaj Allianz': 0,
      'United India': 0,
      Government: 0,
      Corporate: 0,
      Other: 0
    }
  }

  encounters.forEach(encounter => {
    // Count by status
    if (encounter.status === 'ready_to_bill') stats.readyToBill++
    if (encounter.hasErrors) stats.withErrors++
    if (encounter.claimNumber) stats.claimsGenerated++
    if (['claim_submitted', 'claim_accepted', 'claim_rejected', 'paid'].includes(encounter.status)) {
      stats.claimsSubmitted++
    }

    // Sum total value
    stats.totalValue += encounter.totalCharges

    // Count errors by type
    encounter.errors.forEach(error => {
      stats.errorsByType[error.type]++
    })

    // Count by payer
    stats.encountersByPayer[encounter.primaryPayer]++
  })

  return stats
}

/**
 * Default filter values for the billing queue
 */
export const defaultBillingFilters = {
  dateRange: {
    start: '2024-01-01',
    end: '2024-01-31'
  },
  payers: [] as PayerType[],
  statuses: [] as BillingStatus[],
  billTypes: [] as BillType[],
  errorTypes: [] as ErrorType[],
  hasErrors: null,
  searchQuery: ''
}
