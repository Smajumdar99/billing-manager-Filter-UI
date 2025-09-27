import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { Button } from '@/components/atoms/Button/button';
import { 
  CreditCardIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  ClockIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { WidgetType } from '@/types/widget';

interface BillingWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
  type?: WidgetType;
}

interface BillingTransaction {
  id: string;
  date: string;
  serviceDate: string;
  postingDate: string;
  type: 'payment' | 'charge' | 'adjustment' | 'refund' | 'insurance_payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'denied' | 'appealed';
  description: string;
  paymentMethod?: string;
  reference?: string;
  cptCode?: string;
  claimId?: string;
  insuranceInfo?: {
    provider: string;
    coveragePercent: number;
    status: string;
  };
  denialReason?: string;
  appealStatus?: string;
}

interface BillingNote {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'general' | 'payment_plan' | 'collection' | 'insurance';
  priority: 'low' | 'medium' | 'high';
}

interface BillingStatement {
  id: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  remainingBalance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  items: Array<{
    description: string;
    serviceDate: string;
    chargeAmount: number;
    adjustments: number;
    insurance: number;
    patientPortion: number;
  }>;
}

interface InsurancePolicy {
  id: string;
  type: 'primary' | 'secondary' | 'tertiary';
  provider: string;
  policyNumber: string;
  groupNumber: string;
  subscriberName: string;
  subscriberId: string;
  effectiveDate: string;
  terminationDate?: string;
  status: 'active' | 'inactive' | 'pending' | 'terminated';
  coverageDetails: {
    deductible: number;
    deductibleMet: number;
    outOfPocket: number;
    outOfPocketMet: number;
    copay: number;
    coinsurance: number;
  };
  verificationDate?: string;
  verificationStatus?: 'verified' | 'pending' | 'failed';
}

interface PriorAuthRequest {
  id: string;
  patientName: string;
  patientId: string;
  requestDate: string;
  serviceDate: string;
  expirationDate?: string;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'in_review';
  serviceType: string;
  cptCodes: string[];
  unitsRequested: number;
  unitsApproved?: number;
  insuranceProvider: string;
  diagnosis: string;
  diagnosisCodes: string[];
  clinician: string;
  authNumber?: string;
  denialReason?: string;
  notes?: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

interface CreditCard {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  expirationMonth: number;
  expirationYear: number;
  nameOnCard: string;
  billingZip: string;
  isDefault: boolean;
  addedDate: string;
  lastUsed?: string;
  status: 'active' | 'expired' | 'declined';
}

const mockTransactions: BillingTransaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    serviceDate: '2024-03-15',
    postingDate: '2024-03-15',
    type: 'charge',
    amount: 180.00,
    status: 'pending',
    description: 'Individual Psychotherapy Session (45 min)',
    reference: 'INV-2024-001',
    cptCode: '90834',
    claimId: 'CLM-2024-001',
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      coveragePercent: 80,
      status: 'In Network'
    }
  },
  {
    id: '2',
    date: '2024-03-14',
    serviceDate: '2024-03-14',
    postingDate: '2024-03-14',
    type: 'payment',
    amount: 45.00,
    status: 'completed',
    description: 'Therapy Session Copay',
    paymentMethod: 'Credit Card',
    reference: 'PMT-2024-001'
  },
  {
    id: '3',
    date: '2024-03-10',
    serviceDate: '2024-03-10',
    postingDate: '2024-03-12',
    type: 'insurance_payment',
    amount: 144.00,
    status: 'completed',
    description: 'Insurance Payment - Individual Therapy',
    reference: 'INS-2024-001',
    claimId: 'CLM-2024-001',
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      coveragePercent: 80,
      status: 'Processed'
    }
  },
  {
    id: '4',
    date: '2024-03-08',
    serviceDate: '2024-03-01',
    postingDate: '2024-03-08',
    type: 'charge',
    amount: 250.00,
    status: 'denied',
    description: 'Psychiatric Diagnostic Evaluation',
    cptCode: '90791',
    claimId: 'CLM-2024-002',
    denialReason: 'Prior Authorization Required',
    appealStatus: 'Appeal Submitted',
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      coveragePercent: 80,
      status: 'Denied'
    }
  },
  {
    id: '5',
    date: '2024-03-05',
    serviceDate: '2024-03-05',
    postingDate: '2024-03-05',
    type: 'charge',
    amount: 90.00,
    status: 'pending',
    description: 'Group Therapy Session',
    reference: 'INV-2024-003',
    cptCode: '90853',
    claimId: 'CLM-2024-003',
    insuranceInfo: {
      provider: 'Aetna',
      coveragePercent: 70,
      status: 'In Network'
    }
  },
  {
    id: '6',
    date: '2024-03-01',
    serviceDate: '2024-03-01',
    postingDate: '2024-03-01',
    type: 'charge',
    amount: 300.00,
    status: 'denied',
    description: 'Intensive Outpatient Program (IOP)',
    reference: 'INV-2024-004',
    cptCode: '90834',
    claimId: 'CLM-2024-004',
    denialReason: 'Prior Authorization Required for IOP Services',
    appealStatus: 'PA Request Submitted',
    insuranceInfo: {
      provider: 'UnitedHealth',
      coveragePercent: 80,
      status: 'Out of Network'
    }
  }
];

const mockBillingNotes: BillingNote[] = [
  {
    id: '1',
    date: '2024-03-15',
    author: 'Sarah Martinez, Billing Manager',
    content: 'Patient requested payment plan for IOP services. Approved for 12 monthly payments of $75. Patient experiencing financial hardship due to recent job loss.',
    type: 'payment_plan',
    priority: 'high'
  },
  {
    id: '2',
    date: '2024-03-10',
    author: 'John Stevens, Insurance Specialist',
    content: 'Prior authorization approved for 16 individual therapy sessions. Auth valid through 06/30/2024. Patient diagnosed with Major Depressive Disorder.',
    type: 'insurance',
    priority: 'medium'
  },
  {
    id: '3',
    date: '2024-03-08',
    author: 'Maria Rodriguez, Collections',
    content: 'Patient called regarding overdue balance. Explained insurance denial reason. Referred to prior auth team for resubmission.',
    type: 'collection',
    priority: 'high'
  },
  {
    id: '4',
    date: '2024-03-05',
    author: 'David Chen, Billing Coordinator',
    content: 'UnitedHealth requires additional documentation for IOP services. Submitted treatment plan and progress notes. Awaiting review.',
    type: 'insurance',
    priority: 'medium'
  }
];

const mockStatements: BillingStatement[] = [
  {
    id: 'STMT-2024-001',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    totalAmount: 450.00,
    remainingBalance: 350.00,
    status: 'partial',
    items: [
      {
        description: 'Office Visit - Primary Care',
        serviceDate: '2024-03-01',
        chargeAmount: 150.00,
        adjustments: -25.00,
        insurance: -100.00,
        patientPortion: 25.00
      },
      {
        description: 'Lab Tests - Comprehensive Panel',
        serviceDate: '2024-03-01',
        chargeAmount: 300.00,
        adjustments: -50.00,
        insurance: -200.00,
        patientPortion: 50.00
      }
    ]
  },
  {
    id: 'STMT-2024-002',
    date: '2024-02-01',
    dueDate: '2024-02-29',
    totalAmount: 200.00,
    remainingBalance: 0.00,
    status: 'paid',
    items: [
      {
        description: 'Follow-up Visit',
        serviceDate: '2024-02-01',
        chargeAmount: 200.00,
        adjustments: -40.00,
        insurance: -140.00,
        patientPortion: 20.00
      }
    ]
  }
];

const mockInsurancePolicies: InsurancePolicy[] = [
  {
    id: 'INS-001',
    type: 'primary',
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456789',
    groupNumber: 'GRP987654',
    subscriberName: 'John Doe',
    subscriberId: 'SUB123456',
    effectiveDate: '2024-01-01',
    status: 'active',
    coverageDetails: {
      deductible: 2000.00,
      deductibleMet: 1500.00,
      outOfPocket: 5000.00,
      outOfPocketMet: 3000.00,
      copay: 25.00,
      coinsurance: 20
    },
    verificationDate: '2024-03-15',
    verificationStatus: 'verified'
  },
  {
    id: 'INS-002',
    type: 'secondary',
    provider: 'Medicare',
    policyNumber: 'MED987654321',
    groupNumber: 'MEDGRP123',
    subscriberName: 'John Doe',
    subscriberId: 'SUB987654',
    effectiveDate: '2024-01-01',
    status: 'active',
    coverageDetails: {
      deductible: 1000.00,
      deductibleMet: 500.00,
      outOfPocket: 2000.00,
      outOfPocketMet: 1000.00,
      copay: 0.00,
      coinsurance: 0
    },
    verificationDate: '2024-03-15',
    verificationStatus: 'verified'
  }
];

const mockPriorAuthRequests: PriorAuthRequest[] = [
  {
    id: 'PA-2024-001',
    patientName: 'Sarah Martinez',
    patientId: 'PAT001',
    requestDate: '2024-03-10',
    serviceDate: '2024-03-15',
    expirationDate: '2024-06-30',
    status: 'approved',
    serviceType: 'Individual Psychotherapy',
    cptCodes: ['90834'],
    unitsRequested: 16,
    unitsApproved: 16,
    insuranceProvider: 'Blue Cross Blue Shield',
    diagnosis: 'Major Depressive Disorder, Recurrent',
    diagnosisCodes: ['F33.1'],
    clinician: 'Dr. Jennifer Walsh, PhD',
    authNumber: 'AUTH-BCBS-78901',
    urgency: 'routine',
    notes: 'Patient has made significant progress. Continuation of therapy recommended.'
  },
  {
    id: 'PA-2024-002',
    patientName: 'Michael Brown',
    patientId: 'PAT003',
    requestDate: '2024-03-08',
    serviceDate: '2024-03-20',
    status: 'pending',
    serviceType: 'Intensive Outpatient Program (IOP)',
    cptCodes: ['90834', '90837'],
    unitsRequested: 72,
    insuranceProvider: 'UnitedHealth',
    diagnosis: 'Alcohol Use Disorder, Severe',
    diagnosisCodes: ['F10.20'],
    clinician: 'Dr. Mark Thompson, MD',
    urgency: 'urgent',
    notes: 'Patient requires intensive treatment due to recent relapse. Previous outpatient treatment insufficient.'
  },
  {
    id: 'PA-2024-003',
    patientName: 'Emily Davis',
    patientId: 'PAT004',
    requestDate: '2024-02-28',
    serviceDate: '2024-03-05',
    expirationDate: '2024-05-31',
    status: 'approved',
    serviceType: 'Group Therapy',
    cptCodes: ['90853'],
    unitsRequested: 24,
    unitsApproved: 20,
    insuranceProvider: 'Aetna',
    diagnosis: 'Generalized Anxiety Disorder',
    diagnosisCodes: ['F41.1'],
    clinician: 'LCSW Maria Santos',
    authNumber: 'AUTH-AET-45678',
    urgency: 'routine'
  },
  {
    id: 'PA-2024-004',
    patientName: 'David Wilson',
    patientId: 'PAT005',
    requestDate: '2024-03-12',
    serviceDate: '2024-03-18',
    status: 'denied',
    serviceType: 'Psychiatric Evaluation',
    cptCodes: ['90791'],
    unitsRequested: 1,
    insuranceProvider: 'Medicare',
    diagnosis: 'Bipolar I Disorder',
    diagnosisCodes: ['F31.9'],
    clinician: 'Dr. Robert Lee, MD',
    denialReason: 'Insufficient documentation of medical necessity. Previous psychiatric records required.',
    urgency: 'routine'
  },
  {
    id: 'PA-2024-005',
    patientName: 'Lisa Johnson',
    patientId: 'PAT006',
    requestDate: '2024-03-14',
    serviceDate: '2024-03-25',
    status: 'in_review',
    serviceType: 'Psychological Testing',
    cptCodes: ['96116', '96118'],
    unitsRequested: 8,
    insuranceProvider: 'Cigna',
    diagnosis: 'ADHD, Combined Presentation',
    diagnosisCodes: ['F90.2'],
    clinician: 'Dr. Susan Chen, PsyD',
    urgency: 'routine',
    notes: 'Comprehensive psychological evaluation requested for differential diagnosis and treatment planning.'
  }
];

const mockCreditCards: CreditCard[] = [
  {
    id: 'CC-001',
    cardType: 'visa',
    lastFour: '4242',
    expirationMonth: 12,
    expirationYear: 2025,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: true,
    addedDate: '2024-01-15',
    lastUsed: '2024-03-14',
    status: 'active'
  },
  {
    id: 'CC-002',
    cardType: 'mastercard',
    lastFour: '8888',
    expirationMonth: 8,
    expirationYear: 2026,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: false,
    addedDate: '2023-11-20',
    lastUsed: '2024-02-28',
    status: 'active'
  },
  {
    id: 'CC-003',
    cardType: 'amex',
    lastFour: '1234',
    expirationMonth: 6,
    expirationYear: 2024,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: false,
    addedDate: '2023-08-10',
    status: 'expired'
  }
];

export const BillingWidget: FC<BillingWidgetProps> = ({ patientId, isFullscreen = false, type = 'billing' }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: BillingTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'denied':
        return 'bg-orange-100 text-orange-800';
      case 'appealed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: BillingTransaction['type']) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'charge':
        return 'bg-blue-100 text-blue-800';
      case 'adjustment':
        return 'bg-purple-100 text-purple-800';
      case 'refund':
        return 'bg-orange-100 text-orange-800';
      case 'insurance_payment':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBillingOverview = () => (
    <div className="h-full flex flex-col relative">
      <Tabs defaultValue="transactions" className="flex-1">
        <TabsList className="pl-2 shrink-0 w-full justify-start gap-2 sticky top-0 bg-gray-50 border-b z-10">
          <TabsTrigger value="transactions">
            Transactions
            <Badge variant="secondary" className="ml-2 h-4 w-4">
              {mockTransactions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="payment_receipts">Payment Receipts</TabsTrigger>
          <TabsTrigger value="prior_auth">Prior Authorization</TabsTrigger>
          <TabsTrigger value="credit_cards">Credit Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-3 grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border bg-white hover:bg-gray-50/50 transition-colors p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <BanknotesIcon className="w-4 h-4 text-gray-500" />
                    Account Summary
                  </h4>
                  <Button variant="ghost" size="sm" className="h-7 px-2.5 hover:bg-white">
                    <CreditCardIcon className="w-3.5 h-3.5 mr-1" />
                    Pay Now
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">Current Balance</span>
                      <span className="font-semibold text-red-600">{formatCurrency(350.00)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" 
                        style={{ width: '70%' }} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="flex items-center justify-between bg-orange-50/50 rounded-md p-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Past Due</span>
                        <span className="font-medium text-sm text-orange-600">{formatCurrency(150.00)}</span>
                      </div>
                      <XCircleIcon className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex items-center justify-between bg-green-50/50 rounded-md p-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Last Payment</span>
                        <span className="font-medium text-sm text-green-600">{formatCurrency(75.00)}</span>
                      </div>
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-white hover:bg-gray-50/50 transition-colors p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />
                    Insurance Status
                  </h4>
                  <Badge variant="outline" className="text-xs px-1.5 h-5 hover:bg-blue-50">
                    In Network
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">Deductible Met</span>
                      <div>
                        <span className="font-medium text-sm">{formatCurrency(1500)}</span>
                        <span className="text-xs text-gray-400 ml-0.5">/ {formatCurrency(2000)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" 
                        style={{ width: '75%' }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">Out of Pocket</span>
                      <div>
                        <span className="font-medium text-sm">{formatCurrency(3000)}</span>
                        <span className="text-xs text-gray-400 ml-0.5">/ {formatCurrency(5000)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" 
                        style={{ width: '60%' }} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-xs text-gray-500 block">Coverage Split</span>
                      <div className="font-medium text-sm">80% / 20%</div>
                    </div>
                    <div className="flex -space-x-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
                        <span className="text-xs font-medium text-blue-600">80</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                        <span className="text-xs font-medium text-gray-500">20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Notes Section */}
            <div className="px-4 mb-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Billing Notes</h4>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <PencilSquareIcon className="w-4 h-4" />
                    Add Note
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockBillingNotes.map(note => (
                    <div key={note.id} className="flex gap-3 text-sm">
                      <div className="shrink-0 w-[2px] self-stretch rounded-full bg-blue-500" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{note.author}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">{formatDate(note.date)}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              note.priority === 'high' 
                                ? 'border-red-500 text-red-500' 
                                : note.priority === 'medium'
                                ? 'border-yellow-500 text-yellow-500'
                                : 'border-gray-500 text-gray-500'
                            }
                          >
                            {note.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{note.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 px-4">
              {mockTransactions.map(transaction => (
                <div key={transaction.id} className="rounded-lg border p-3 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{transaction.description}</h4>
                        <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs">Service: {formatDate(transaction.serviceDate)}</span>
                        </div>
                        {transaction.cptCode && (
                          <div className="flex items-center gap-1.5">
                            <DocumentTextIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">CPT: {transaction.cptCode}</span>
                          </div>
                        )}
                        {transaction.claimId && (
                          <div className="flex items-center gap-1.5">
                            <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">Claim: {transaction.claimId}</span>
                          </div>
                        )}
                        {transaction.denialReason && (
                          <div className="flex items-center gap-1.5">
                            <XCircleIcon className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs text-red-500">{transaction.denialReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="claims" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="space-y-4 p-4">
              {mockTransactions
                .filter(t => t.claimId)
                .map(claim => (
                  <div key={claim.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{claim.description}</h4>
                          <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <DocumentTextIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">Claim ID: {claim.claimId}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">Service Date: {formatDate(claim.serviceDate)}</span>
                          </div>
                          {claim.insuranceInfo && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircleIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs">{claim.insuranceInfo.provider} - {claim.insuranceInfo.status}</span>
                            </div>
                          )}
                          {claim.denialReason && (
                            <div className="flex items-center gap-1.5">
                              <XCircleIcon className="w-3.5 h-3.5 text-red-500" />
                              <span className="text-xs text-red-500">{claim.denialReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(claim.amount)}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="statements" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Billing Statements</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <DocumentTextIcon className="w-4 h-4 mr-1" />
                    Download Latest
                  </Button>
                </div>
              </div>

              {mockStatements.map(statement => (
                <div key={statement.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Statement {statement.id}</h4>
                        <Badge className={
                          statement.status === 'paid' ? 'bg-green-100 text-green-800' :
                          statement.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          statement.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due Date: {formatDate(statement.dueDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Remaining Balance</div>
                      <div className={`font-semibold ${statement.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(statement.remainingBalance)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {statement.items.map((item, index) => (
                      <div key={index} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.description}</span>
                          <span className="text-sm text-gray-500">{formatDate(item.serviceDate)}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Charges</div>
                            <div className="font-medium">{formatCurrency(item.chargeAmount)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Adjustments</div>
                            <div className="font-medium text-blue-600">{formatCurrency(item.adjustments)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Insurance</div>
                            <div className="font-medium text-green-600">{formatCurrency(item.insurance)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Patient Portion</div>
                            <div className="font-medium text-red-600">{formatCurrency(item.patientPortion)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="insurance" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-4 space-y-6">
              {mockInsurancePolicies.map(policy => (
                <div key={policy.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{policy.provider}</h4>
                        <Badge className={
                          policy.type === 'primary' ? 'bg-blue-100 text-blue-800' :
                          policy.type === 'secondary' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}
                        </Badge>
                        <Badge className={
                          policy.status === 'active' ? 'bg-green-100 text-green-800' :
                          policy.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          policy.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Policy: {policy.policyNumber} • Group: {policy.groupNumber}
                      </div>
                    </div>
                    {policy.verificationStatus && (
                      <Badge className={
                        policy.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        policy.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {policy.verificationStatus === 'verified' ? 'Verified' : 
                         policy.verificationStatus === 'pending' ? 'Verification Pending' : 
                         'Verification Failed'}
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Subscriber Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span>{policy.subscriberName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">ID:</span>
                            <span>{policy.subscriberId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Effective Date:</span>
                            <span>{formatDate(policy.effectiveDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Coverage Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deductible:</span>
                            <span>{formatCurrency(policy.coverageDetails.deductible)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deductible Met:</span>
                            <span>{formatCurrency(policy.coverageDetails.deductibleMet)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Out of Pocket:</span>
                            <span>{formatCurrency(policy.coverageDetails.outOfPocket)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Out of Pocket Met:</span>
                            <span>{formatCurrency(policy.coverageDetails.outOfPocketMet)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Copay:</span>
                            <span>{formatCurrency(policy.coverageDetails.copay)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Coinsurance:</span>
                            <span>{policy.coverageDetails.coinsurance}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {policy.verificationDate && (
                      <div className="text-sm text-gray-500 mt-4">
                        Last Verified: {formatDate(policy.verificationDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="payment_receipts" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Receipts</h3>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  Download All
                </Button>
              </div>

              <div className="space-y-4">
                {mockTransactions
                  .filter(t => t.type === 'payment')
                  .map(payment => (
                    <div key={payment.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{payment.description}</h4>
                            <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            Reference: {payment.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {formatCurrency(payment.amount)}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 mb-1">Payment Date</div>
                            <div>{formatDate(payment.date)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Payment Method</div>
                            <div className="flex items-center gap-1">
                              <CreditCardIcon className="w-4 h-4" />
                              {payment.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="prior_auth" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Prior Authorizations</h3>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 mr-1" />
                  New Request
                </Button>
              </div>

              {mockPriorAuthRequests.map(auth => (
                <div key={auth.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{auth.serviceType}</h4>
                        <Badge className={getPriorAuthStatusColor(auth.status)}>
                          {auth.status.charAt(0).toUpperCase() + auth.status.slice(1).replace('_', ' ')}
                        </Badge>
                        <Badge className={getUrgencyColor(auth.urgency)}>
                          {auth.urgency.charAt(0).toUpperCase() + auth.urgency.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {auth.patientName} • CPT: {auth.cptCodes.join(', ')}
                      </div>
                    </div>
                    {auth.authNumber && (
                      <div className="text-right">
                        <div className="text-sm font-medium">Auth #{auth.authNumber}</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Service Date</div>
                        <div>{formatDate(auth.serviceDate)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Insurance</div>
                        <div>{auth.insuranceProvider}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Clinician</div>
                        <div>{auth.clinician}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Units</div>
                        <div>
                          {auth.unitsApproved !== undefined 
                            ? `${auth.unitsApproved} of ${auth.unitsRequested} approved` 
                            : `${auth.unitsRequested} requested`
                          }
                        </div>
                      </div>
                      {auth.denialReason && (
                        <div>
                          <div className="text-red-500 flex items-center gap-1">
                            <XCircleIcon className="w-4 h-4" />
                            {auth.denialReason}
                          </div>
                        </div>
                      )}
                      {auth.expirationDate && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="text-gray-500 mb-1">Expires</div>
                          <div>{formatDate(auth.expirationDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="credit_cards" className="absolute inset-0 top-[41px]">
          <ScrollArea className="h-[calc(100%)]">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Credit Cards on File</h3>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <CreditCardIcon className="w-4 h-4 mr-1" />
                  Add New Card
                </Button>
              </div>

              <div className="grid gap-4">
                {mockCreditCards.map(card => (
                  <div key={card.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={getCardTypeColor(card.cardType)}>
                          {getCardIcon(card.cardType)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} ending in {card.lastFour}
                          </div>
                          <div className="text-sm text-gray-500">
                            Expires {card.expirationMonth.toString().padStart(2, '0')}/{card.expirationYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.isDefault && (
                          <Badge className="bg-green-100 text-green-800">Default</Badge>
                        )}
                        <Badge className={
                          card.status === 'active' ? 'bg-green-100 text-green-800' :
                          card.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                          {card.lastUsed ? `Last used on ${formatDate(card.lastUsed)}` : 'Never used'}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          {!card.isDefault && card.status === 'active' && (
                            <Button variant="ghost" size="sm">Set Default</Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderPaymentReceipts = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Payment Receipts</h3>
        {!isFullscreen && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <DocumentTextIcon className="w-4 h-4" />
            Download All
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-4">
          {mockTransactions
            .filter(t => t.type === 'payment')
            .map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{payment.description}</h4>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(payment.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCardIcon className="w-4 h-4" />
                      {payment.paymentMethod}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(payment.amount)}
                  </div>
                  {!isFullscreen && (
                    <Button variant="ghost" size="sm">
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderBillingStatement = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Billing Statements</h3>
        {!isFullscreen && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              Print Statement
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current Balance</h4>
              <div className="text-2xl font-semibold text-red-600">
                {formatCurrency(350.00)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Last Payment</h4>
              <div className="text-2xl font-semibold text-green-600">
                {formatCurrency(75.00)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate('2024-03-14')}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium">Recent Activity</h4>
            </div>
            <div className="divide-y">
              {mockTransactions.map(transaction => (
                <div key={transaction.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{transaction.description}</span>
                      <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                  </div>
                  <span className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const getPriorAuthStatusColor = (status: PriorAuthRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: PriorAuthRequest['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'emergency':
        return 'bg-red-200 text-red-900';
      case 'routine':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPriorAuth = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Prior Authorizations</h3>
        {!isFullscreen && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
            New Request
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-4">
          {mockPriorAuthRequests.map(auth => (
            <div key={auth.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{auth.serviceType}</h4>
                    <Badge className={getPriorAuthStatusColor(auth.status)}>
                      {auth.status.charAt(0).toUpperCase() + auth.status.slice(1).replace('_', ' ')}
                    </Badge>
                    <Badge className={getUrgencyColor(auth.urgency)}>
                      {auth.urgency.charAt(0).toUpperCase() + auth.urgency.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {auth.patientName} ({auth.patientId}) • {auth.insuranceProvider}
                  </div>
                </div>
                {auth.authNumber && (
                  <div className="text-right">
                    <div className="text-sm font-medium">Auth #{auth.authNumber}</div>
                    {auth.expirationDate && (
                      <div className="text-xs text-gray-500">
                        Expires: {formatDate(auth.expirationDate)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-500 mb-1">Request Date</div>
                    <div>{formatDate(auth.requestDate)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Service Date</div>
                    <div>{formatDate(auth.serviceDate)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Clinician</div>
                    <div>{auth.clinician}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Units Requested</div>
                    <div>
                      {auth.unitsApproved !== undefined 
                        ? `${auth.unitsApproved} of ${auth.unitsRequested}` 
                        : auth.unitsRequested
                      }
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-500 mb-1">Diagnosis</div>
                    <div className="flex items-center gap-2">
                      <span>{auth.diagnosis}</span>
                      <Badge variant="outline" className="text-xs">
                        {auth.diagnosisCodes.join(', ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 mb-1">CPT Codes</div>
                    <div className="flex gap-1">
                      {auth.cptCodes.map(code => (
                        <Badge key={code} variant="outline" className="text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {auth.denialReason && (
                    <div className="pt-2 border-t">
                      <div className="text-red-500 flex items-start gap-2">
                        <XCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium">Denial Reason</div>
                          <div className="text-sm">{auth.denialReason}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {auth.notes && (
                    <div className="pt-2 border-t">
                      <div className="text-gray-500 mb-1">Notes</div>
                      <div className="text-sm">{auth.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderNewPayment = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">New Payment</h3>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="p-4 border rounded-lg">
          <h4 className="text-sm font-medium mb-2">Current Balance</h4>
          <div className="text-2xl font-semibold text-red-600">
            {formatCurrency(350.00)}
          </div>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full gap-2">
            <CreditCardIcon className="w-4 h-4" />
            Pay with Credit Card
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <BanknotesIcon className="w-4 h-4" />
            Pay with Bank Account
          </Button>
        </div>
      </div>
    </div>
  );

  const getCardIcon = (cardType: CreditCard['cardType']) => {
    // In a real app, you might want to use actual card brand icons
    return <CreditCardIcon className="w-5 h-5" />;
  };

  const getCardTypeColor = (cardType: CreditCard['cardType']) => {
    switch (cardType) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-red-600';
      case 'amex':
        return 'text-green-600';
      case 'discover':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderCreditCards = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Saved Payment Methods</h3>
        {!isFullscreen && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <CreditCardIcon className="w-4 h-4" />
            Add New Card
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-4">
          {mockCreditCards.map(card => (
            <div key={card.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={getCardTypeColor(card.cardType)}>
                    {getCardIcon(card.cardType)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} ending in {card.lastFour}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {card.expirationMonth.toString().padStart(2, '0')}/{card.expirationYear}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.isDefault && (
                    <Badge className="bg-green-100 text-green-800">Default</Badge>
                  )}
                  <Badge className={
                    card.status === 'active' ? 'bg-green-100 text-green-800' :
                    card.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-500 mb-1">Name on Card</div>
                    <div>{card.nameOnCard}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Billing ZIP</div>
                    <div>{card.billingZip}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Added Date</div>
                    <div>{formatDate(card.addedDate)}</div>
                  </div>
                  {card.lastUsed && (
                    <div>
                      <div className="text-gray-500 mb-1">Last Used</div>
                      <div>{formatDate(card.lastUsed)}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm text-gray-500">
                    {card.status === 'expired' ? 'Card has expired' : 
                     card.status === 'declined' ? 'Card was declined' : 
                     'Card is active and ready to use'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    {!card.isDefault && (
                      <Button variant="ghost" size="sm">
                        Set Default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderWriteOff = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Write Off</h3>
        {!isFullscreen && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArchiveBoxXMarkIcon className="w-4 h-4" />
            New Write Off
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-500 text-center mt-8">
        No write-offs found.
      </div>
    </div>
  );

  const renderBillingNotes = () => (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Billing Notes</h3>
        {!isFullscreen && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <PencilSquareIcon className="w-4 h-4" />
            Add Note
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-500 text-center mt-8">
        No billing notes found.
      </div>
    </div>
  );

  // Render appropriate content based on widget type
  switch (type) {
    case 'billing':
      return renderBillingOverview();
    case 'billing_payment_receipts':
      return renderPaymentReceipts();
    case 'billing_statement':
      return renderBillingStatement();
    case 'billing_prior_auth':
      return renderPriorAuth();
    case 'billing_new_payment':
      return renderNewPayment();
    case 'billing_credit_cards':
      return renderCreditCards();
    case 'billing_write_off':
      return renderWriteOff();
    case 'billing_notes':
      return renderBillingNotes();
    default:
      return renderBillingOverview();
  }
}; 