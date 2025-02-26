import type { UserRole } from '@/types/user';
import type { Widget, WidgetType } from '@/types/widget';

export const defaultWidgets: Widget[] = [
  {
    id: 'patient-performance',
    type: 'patient_performance',
    title: 'Patient Performance'
  },
  {
    id: 'notification-center',
    type: 'notification_center',
    title: 'Notifications'
  },
  {
    id: 'activity',
    type: 'activity',
    title: 'Recent Activity'
  },
  {
    id: 'clinical-insights-carousel',
    type: 'clinical_insights_carousel',
    title: 'Clinical Insights',
    description: 'Key clinical insights and trends for the patient'
  },
  {
    id: 'vital-signs',
    type: 'vital_signs',
    title: 'Vital Signs'
  },
  {
    id: 'clinical-notes',
    type: 'clinical_notes',
    title: 'Clinical Notes'
  },
  {
    id: 'medications',
    type: 'medications',
    title: 'Medications'
  },
  {
    id: 'diagnosis',
    type: 'diagnosis',
    title: 'Diagnosis'
  },
  {
    id: 'allergies',
    type: 'allergies',
    title: 'Allergies'
  },
  {
    id: 'lab-results',
    type: 'lab_results',
    title: 'Lab Results'
  },
  {
    id: 'appointments',
    type: 'appointments',
    title: 'Appointments'
  },
  {
    id: 'documents',
    type: 'documents',
    title: 'Documents'
  },
  {
    id: 'patient_timeline',
    type: 'patient_timeline',
    title: 'Patient Timeline'
  },
  {
    id: 'insurance',
    type: 'insurance',
    title: 'Insurance'
  },
  {
    id: 'billing',
    type: 'billing',
    title: 'Billing'
  },
  {
    id: 'billing-payment-receipts',
    type: 'billing_payment_receipts',
    title: 'Payment Receipts'
  },
  {
    id: 'billing-statement',
    type: 'billing_statement',
    title: 'Billing Statement'
  },
  {
    id: 'billing-prior-auth',
    type: 'billing_prior_auth',
    title: 'Prior Authorization'
  },
  {
    id: 'billing-new-payment',
    type: 'billing_new_payment',
    title: 'New Payment'
  },
  {
    id: 'billing-credit_cards',
    type: 'billing_credit_cards',
    title: 'Credit Cards'
  },
  {
    id: 'billing-write_off',
    type: 'billing_write_off',
    title: 'Write Off'
  },
  {
    id: 'billing-notes',
    type: 'billing_notes',
    title: 'Billing Notes'
  },
  {
    id: 'demographics',
    type: 'demographics',
    title: 'Demographics'
  },
  {
    id: 'implantable_devices',
    type: 'implantable_devices',
    title: 'Implantable Devices'
  },
  {
    id: 'disclosures',
    type: 'disclosures',
    title: 'Disclosures',
    description: 'Manage patient disclosures and consents'
  },
  {
    id: 'amendments',
    type: 'amendments',
    title: 'Amendments',
    description: 'Track and manage amendments to patient records'
  },
  {
    id: 'identified_needs',
    type: 'identified_needs',
    title: 'Identified Needs'
  },
  {
    id: 'id-card-photos',
    type: 'id_card_photos',
    title: 'ID/Card Photos',
    description: 'View and manage patient ID cards and photos'
  },
  {
    id: 'prescriptions',
    type: 'prescriptions',
    title: 'Prescriptions',
    description: 'Manage patient prescriptions and medications'
  }
];

export const widgetPermissions: Record<string, WidgetType[]> = {
  admin: [
    'patient_performance', 
    'notification_center', 
    'activity',
    'medications', 'diagnosis', 'allergies', 'lab_results', 'appointments',
    'documents', 'patient_timeline', 'insurance', 'billing', 'disclosures',
    'demographics', 'implantable_devices', 'identified_needs', 'id_card_photos',
    'prescriptions'
  ],
  clinical_admin: [
    // Core Monitoring Widgets
    'patient_performance',
    'notification_center',
    'activity',
    'clinical_insights_carousel',
    
    // Clinical Widgets
    'vital_signs',
    'clinical_notes',
    'medications',
    'diagnosis',
    'allergies',
    'lab_results',
    'prescriptions',
    
    // Administrative & Compliance Widgets
    'appointments',
    'documents',
    'patient_timeline',
    'demographics',
    'insurance',
    'disclosures',
    'amendments',
    'identified_needs',
    
    // Quality & Oversight Widgets
    'golden_thread_alerts',
    'clinical_reminders'
  ],
  front_desk: [
    'patient_performance',
    'notification_center',
    'appointments',
    'demographics',
    'insurance',
    'billing',
    'documents',
    'id_card_photos',
    'billing_payment_receipts',
    'billing_statement',
    'billing_prior_auth',
    'billing_new_payment',
    'billing_credit_cards',
    'billing_write_off',
    'billing_notes',
    'lab_results'
  ],
  doctor: [
    'patient_performance', 
    'notification_center', 
    'activity',
    'clinical_insights_carousel',
    'vital_signs',
    'clinical_notes',
    'medications',
    'diagnosis',
    'allergies',
    'lab_results',
    'appointments',
    'documents',
    'patient_timeline',
    'insurance',
    'billing',
    'disclosures',
    'demographics',
    'implantable_devices',
    'identified_needs',
    'id_card_photos',
    'prescriptions'
  ],
  nurse: [
    'vital_signs', 
    'notification_center', 
    'activity',
    'clinical_insights_carousel',
    'clinical_notes',
    'medications',
    'diagnosis',
    'allergies',
    'lab_results',
    'appointments',
    'documents',
    'id_card_photos',
    'prescriptions'
  ],
  patient: [
    'vital_signs', 
    'activity',
    'medications',
    'diagnosis',
    'allergies',
    'lab_results',
    'appointments',
    'documents',
    'id_card_photos'
  ],
  clinician: [
    'patient_performance', 
    'notification_center', 
    'activity',
    'clinical_insights_carousel',
    'vital_signs',
    'clinical_notes',
    'medications',
    'diagnosis',
    'allergies',
    'lab_results',
    'appointments',
    'documents',
    'patient_timeline',
    'insurance',
    'billing',
    'disclosures',
    'demographics',
    'implantable_devices',
    'identified_needs',
    'id_card_photos',
    'prescriptions'
  ],
  billing_specialist: [
    'patient_performance',
    'notification_center',
    'insurance',
    'billing',
    'billing_payment_receipts',
    'billing_statement',
    'billing_prior_auth',
    'billing_new_payment',
    'billing_credit_cards',
    'billing_write_off',
    'billing_notes',
    'demographics',
    'id_card_photos',
    'disclosures',
    'amendments'
  ]
};

export const getWidgetsByRole = (role: string): Widget[] => {
  const allowedTypes = widgetPermissions[role] || [];
  return defaultWidgets.filter(widget => allowedTypes.includes(widget.type));
};

export const hasWidgetPermission = (widgetType: WidgetType, role: string): boolean => {
  const allowedTypes = widgetPermissions[role] || [];
  return allowedTypes.includes(widgetType);
}; 