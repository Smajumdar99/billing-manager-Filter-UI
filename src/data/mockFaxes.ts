import { IncomingFax, OutgoingFax, ClinicLocation } from '@/types/fax';

/**
 * Mock clinic locations for multi-location behavioral health practice
 */
export const mockClinicLocations: ClinicLocation[] = [
  {
    id: 'loc-main',
    name: 'Main Campus',
    address: '123 Healthcare Blvd, Downtown',
    faxNumber: '(555) 987-6543'
  },
  {
    id: 'loc-north',
    name: 'North Branch',
    address: '456 Wellness Ave, North District',
    faxNumber: '(555) 987-6544'
  },
  {
    id: 'loc-south',
    name: 'South Branch',
    address: '789 Mental Health St, South District',
    faxNumber: '(555) 987-6545'
  },
  {
    id: 'loc-urgent',
    name: 'Crisis Center',
    address: '321 Emergency Way, Central',
    faxNumber: '(555) 987-6546'
  }
];

/**
 * Mock data for incoming faxes - Behavioral Health Clinic scenarios
 * 
 * Realistic fax scenarios that behavioral health clinics commonly receive:
 * - Insurance authorization requests
 * - Medical records from other providers
 * - Prescription requests
 * - Treatment plan updates
 * - Emergency notifications
 */
export const mockIncomingFaxes: IncomingFax[] = [
  {
    id: 'fax-001',
    subject: 'Prior Authorization Request - Outpatient Mental Health Services',
    sender: {
      name: 'Dr. Sarah Johnson',
      organization: 'BlueCross BlueShield',
      faxNumber: '(555) 123-4567',
      phoneNumber: '(555) 123-4500'
    },
    recipientFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 4,
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'new',
    priority: 'high',
    linkedPatient: {
      id: 'patient-001',
      name: 'Michael Rodriguez',
      dob: '1985-03-15',
      mrn: 'MRN-789456'
    },
    notes: 'Urgent: Authorization needed for continued therapy sessions'
  },
  {
    id: 'fax-002',
    subject: 'Medical Records Transfer - Previous Treatment History',
    sender: {
      organization: 'City General Hospital',
      faxNumber: '(555) 246-8135',
      phoneNumber: '(555) 246-8100'
    },
    recipientFaxNumber: '(555) 987-6544',
    location: mockClinicLocations[1], // North Branch
    pageCount: 12,
    receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'reviewed',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-002',
      name: 'Jennifer Smith',
      dob: '1992-07-22',
      mrn: 'MRN-456123'
    },
    reviewedBy: 'Dr. Lisa Chen',
    reviewedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    notes: 'Contains relevant psychiatric history from 2019-2023'
  },
  {
    id: 'fax-003',
    subject: 'Emergency: Crisis Intervention Report',
    sender: {
      name: 'Emergency Response Team',
      organization: 'County Crisis Center',
      faxNumber: '(555) 911-1234',
      phoneNumber: '(555) 911-1200'
    },
    recipientFaxNumber: '(555) 987-6546',
    location: mockClinicLocations[3], // Crisis Center
    pageCount: 3,
    receivedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'urgent',
    priority: 'urgent',
    linkedPatient: {
      id: 'patient-003',
      name: 'Amanda Thompson',
      dob: '1990-02-14',
      mrn: 'MRN-654321'
    },
    notes: 'URGENT: Patient had crisis episode last night, needs immediate follow-up'
  },
  {
    id: 'fax-004',
    subject: 'Prescription Refill Request - Antidepressant Medication',
    sender: {
      name: 'PharmTech Support',
      organization: 'MediRx Pharmacy',
      faxNumber: '(555) 555-7890',
      phoneNumber: '(555) 555-7800'
    },
    recipientFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 2,
    receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'assigned',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-004',
      name: 'David Wilson',
      dob: '1978-11-08',
      mrn: 'MRN-321987'
    },
    assignedTo: 'Dr. Sarah Johnson',
    assignedAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
    notes: 'Patient requesting 90-day refill of Sertraline 50mg'
  },
  {
    id: 'fax-005',
    subject: 'Treatment Plan Update from Psychiatrist',
    sender: {
      name: 'Dr. Robert Kim',
      organization: 'Downtown Psychiatry Associates',
      faxNumber: '(555) 333-4444',
      phoneNumber: '(555) 333-4400'
    },
    recipientFaxNumber: '(555) 987-6545',
    location: mockClinicLocations[2], // South Branch
    pageCount: 5,
    receivedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'new',
    priority: 'normal',
    notes: 'Updated medication regimen and therapy recommendations'
  },
  {
    id: 'fax-006',
    subject: 'Insurance Verification and Benefits Summary',
    sender: {
      organization: 'Anthem Insurance Services',
      faxNumber: '(555) 678-9012',
      phoneNumber: '(555) 678-9000'
    },
    recipientFaxNumber: '(555) 987-6544',
    location: mockClinicLocations[1], // North Branch
    pageCount: 8,
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'reviewed',
    priority: 'low',
    linkedPatient: {
      id: 'patient-005',
      name: 'Amanda Thompson',
      dob: '1990-02-14',
      mrn: 'MRN-654321'
    },
    reviewedBy: 'Insurance Coordinator',
    reviewedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    notes: 'Coverage approved for outpatient therapy through Dec 2024'
  },
  {
    id: 'fax-007',
    subject: 'Lab Results - Drug Screening Panel',
    sender: {
      organization: 'QuestLab Diagnostics',
      faxNumber: '(555) 111-2222',
      phoneNumber: '(555) 111-2200'
    },
    recipientFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 3,
    receivedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
    status: 'archived',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-006',
      name: 'Robert Anderson',
      dob: '1975-09-30',
      mrn: 'MRN-147258'
    },
    reviewedBy: 'Dr. Lisa Chen',
    reviewedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    notes: 'Results filed in patient chart - all negative'
  },
  {
    id: 'fax-008',
    subject: 'Discharge Summary - Inpatient Psychiatric Stay',
    sender: {
      name: 'Dr. Emily Zhang',
      organization: 'Regional Medical Center - Behavioral Unit',
      faxNumber: '(555) 777-8888',
      phoneNumber: '(555) 777-8800'
    },
    recipientFaxNumber: '(555) 987-6545',
    location: mockClinicLocations[2], // South Branch
    pageCount: 7,
    receivedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'new',
    priority: 'high',
    notes: 'Patient discharged yesterday, follow-up appointment needed within 7 days'
  },
  {
    id: 'fax-009',
    subject: 'Therapy Session Notes - Group Counseling',
    sender: {
      name: 'Licensed Clinical Social Worker',
      organization: 'Community Wellness Center',
      faxNumber: '(555) 444-5555',
      phoneNumber: '(555) 444-5500'
    },
    recipientFaxNumber: '(555) 987-6544',
    location: mockClinicLocations[1], // North Branch
    pageCount: 4,
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'assigned',
    priority: 'low',
    linkedPatient: {
      id: 'patient-007',
      name: 'Lisa Martinez',
      dob: '1988-12-05',
      mrn: 'MRN-369852'
    },
    assignedTo: 'Dr. James Parker',
    assignedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    notes: 'Progress notes from substance abuse counseling group'
  },
  {
    id: 'fax-010',
    subject: 'Worker\'s Compensation Claim - Mental Health Assessment',
    sender: {
      organization: 'State Worker\'s Compensation Board',
      faxNumber: '(555) 888-9999',
      phoneNumber: '(555) 888-9900'
    },
    recipientFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 6,
    receivedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    status: 'new',
    priority: 'normal',
    notes: 'Assessment required for workplace stress-related mental health claim'
  }
];

/**
 * Mock data for outgoing faxes - Behavioral Health Clinic scenarios
 * 
 * Common outgoing fax scenarios for behavioral health clinics
 */
export const mockOutgoingFaxes: OutgoingFax[] = [
  {
    id: 'out-fax-001',
    subject: 'Treatment Plan Update - Patient Progress Report',
    recipient: {
      name: 'Dr. Michael Chen',
      organization: 'Primary Care Associates',
      faxNumber: '(555) 123-4567',
      phoneNumber: '(555) 123-4500'
    },
    senderFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 3,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    sentAt: new Date(Date.now() - 25 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 20 * 60 * 1000),
    status: 'delivered',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-001',
      name: 'Michael Rodriguez',
      dob: '1985-03-15',
      mrn: 'MRN-789456'
    },
    createdBy: 'Dr. Sarah Johnson',
    attempts: 1,
    notes: 'Treatment plan update for primary care coordination'
  },
  {
    id: 'out-fax-002',
    subject: 'Prior Authorization Request - Continuation of Therapy',
    recipient: {
      organization: 'BlueCross BlueShield',
      faxNumber: '(555) 888-9999',
      phoneNumber: '(555) 888-9900'
    },
    senderFaxNumber: '(555) 987-6544',
    location: mockClinicLocations[1], // North Branch
    pageCount: 5,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    sentAt: new Date(Date.now() - 115 * 60 * 1000),
    status: 'sent',
    priority: 'high',
    linkedPatient: {
      id: 'patient-002',
      name: 'Jennifer Smith',
      dob: '1992-07-22',
      mrn: 'MRN-456123'
    },
    createdBy: 'Dr. Lisa Chen',
    attempts: 1,
    notes: 'Urgent - Authorization expires end of week'
  },
  {
    id: 'out-fax-003',
    subject: 'Medication Management Update',
    recipient: {
      name: 'Dr. Robert Kim',
      organization: 'Downtown Psychiatry',
      faxNumber: '(555) 333-4444',
      phoneNumber: '(555) 333-4400'
    },
    senderFaxNumber: '(555) 987-6545',
    location: mockClinicLocations[2], // South Branch
    pageCount: 2,
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'sending',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-003',
      name: 'David Wilson',
      dob: '1978-11-08',
      mrn: 'MRN-321987'
    },
    createdBy: 'Dr. Emily Zhang',
    attempts: 1,
    notes: 'Medication adjustment recommendations'
  },
  {
    id: 'out-fax-004',
    subject: 'Crisis Intervention Follow-up Report',
    recipient: {
      name: 'Emergency Response Team',
      organization: 'City General Hospital',
      faxNumber: '(555) 911-1234',
      phoneNumber: '(555) 911-1200'
    },
    senderFaxNumber: '(555) 987-6546',
    location: mockClinicLocations[3], // Crisis Center
    pageCount: 4,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    sentAt: new Date(Date.now() - 40 * 60 * 1000),
    status: 'failed',
    priority: 'urgent',
    linkedPatient: {
      id: 'patient-004',
      name: 'Amanda Thompson',
      dob: '1990-02-14',
      mrn: 'MRN-654321'
    },
    createdBy: 'Dr. James Parker',
    attempts: 2,
    errorMessage: 'Recipient fax line busy - will retry in 15 minutes',
    notes: 'URGENT: Crisis intervention follow-up - patient stable'
  },
  {
    id: 'out-fax-005',
    subject: 'Discharge Summary - Outpatient Treatment Completion',
    recipient: {
      name: 'Dr. Maria Rodriguez',
      organization: 'Family Medicine Center',
      faxNumber: '(555) 246-8135',
      phoneNumber: '(555) 246-8100'
    },
    senderFaxNumber: '(555) 987-6543',
    location: mockClinicLocations[0], // Main Campus
    pageCount: 6,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    status: 'delivered',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-005',
      name: 'Robert Anderson',
      dob: '1975-09-30',
      mrn: 'MRN-147258'
    },
    createdBy: 'Dr. Sarah Johnson',
    attempts: 1,
    notes: 'Patient successfully completed 12-week outpatient program'
  },
  {
    id: 'out-fax-006',
    subject: 'Lab Results Request - Drug Screening Panel',
    recipient: {
      organization: 'QuestLab Diagnostics',
      faxNumber: '(555) 111-2222',
      phoneNumber: '(555) 111-2200'
    },
    senderFaxNumber: '(555) 987-6544',
    location: mockClinicLocations[1], // North Branch
    pageCount: 1,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'queued',
    priority: 'normal',
    linkedPatient: {
      id: 'patient-006',
      name: 'Lisa Martinez',
      dob: '1988-12-05',
      mrn: 'MRN-369852'
    },
    createdBy: 'Dr. Lisa Chen',
    attempts: 0,
    notes: 'Routine drug screening for substance abuse program'
  }
];

// Helper function to get fax statistics
export const getFaxStats = (faxes: IncomingFax[]) => {
  return {
    total: faxes.length,
    new: faxes.filter(f => f.status === 'new').length,
    urgent: faxes.filter(f => f.status === 'urgent').length,
    reviewed: faxes.filter(f => f.status === 'reviewed').length,
    assigned: faxes.filter(f => f.status === 'assigned').length,
    unassigned: faxes.filter(f => !f.linkedPatient).length,
    todayCount: faxes.filter(f => {
      const today = new Date();
      const faxDate = f.receivedAt;
      return faxDate.toDateString() === today.toDateString();
    }).length
  };
};

// Helper function to get outgoing fax statistics
export const getOutgoingFaxStats = (faxes: OutgoingFax[]) => {
  return {
    total: faxes.length,
    draft: faxes.filter(f => f.status === 'draft').length,
    queued: faxes.filter(f => f.status === 'queued').length,
    sending: faxes.filter(f => f.status === 'sending').length,
    sent: faxes.filter(f => f.status === 'sent').length,
    delivered: faxes.filter(f => f.status === 'delivered').length,
    failed: faxes.filter(f => f.status === 'failed').length,
    todayCount: faxes.filter(f => {
      const today = new Date();
      const faxDate = f.createdAt;
      return faxDate.toDateString() === today.toDateString();
    }).length
  };
};
