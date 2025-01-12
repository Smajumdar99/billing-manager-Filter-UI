import type { UserRole } from '@/types/user';
import type { Widget, WidgetType } from '@/types/widget';

const defaultWidgets: Widget[] = [
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
    id: 'disclosures',
    type: 'disclosures',
    title: 'Disclosures & Amendments'
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
    id: 'identified_needs',
    type: 'identified_needs',
    title: 'Identified Needs'
  }
];

const widgetPermissions: Record<string, WidgetType[]> = {
  admin: [
    'patient_performance', 'notification_center', 'vital_signs', 'clinical_notes', 
    'medications', 'diagnosis', 'allergies', 'lab_results', 'appointments',
    'documents', 'patient_timeline', 'insurance', 'billing', 'disclosures',
    'demographics', 'implantable_devices', 'identified_needs'
  ],
  doctor: [
    'patient_performance', 'vital_signs', 'clinical_notes', 'medications', 
    'diagnosis', 'allergies', 'lab_results', 'appointments', 'documents',
    'patient_timeline', 'insurance', 'billing', 'disclosures', 'demographics',
    'implantable_devices', 'identified_needs'
  ],
  nurse: [
    'vital_signs', 'clinical_notes', 'medications', 'diagnosis', 'allergies', 
    'lab_results', 'appointments', 'documents', 'patient_timeline'
  ],
  patient: [
    'vital_signs', 'medications', 'diagnosis', 'allergies', 'lab_results',
    'appointments', 'documents'
  ],
  clinician: [
    'patient_performance', 'notification_center', 'vital_signs', 'clinical_notes', 
    'medications', 'diagnosis', 'allergies', 'lab_results', 'appointments',
    'documents', 'patient_timeline', 'insurance', 'billing', 'disclosures',
    'demographics', 'implantable_devices', 'identified_needs'
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