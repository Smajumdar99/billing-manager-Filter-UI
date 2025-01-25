export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetPositions {
  [key: string]: WidgetPosition;
}

export type WidgetType =
  | 'patient_performance'
  | 'notification_center'
  | 'activity'
  | 'vital_signs'
  | 'diagnosis'
  | 'clinical_notes'
  | 'allergies'
  | 'medications'
  | 'lab_results'
  | 'appointments'
  | 'documents'
  | 'patient_timeline'
  | 'insurance'
  | 'billing'
  | 'billing_payment_receipts'
  | 'billing_statement'
  | 'billing_prior_auth'
  | 'billing_new_payment'
  | 'billing_credit_cards'
  | 'billing_write_off'
  | 'billing_notes'
  | 'disclosures'
  | 'demographics'
  | 'implantable_devices'
  | 'identified_needs'
  | 'clinical_insights_carousel'
  | 'problems'
  | 'procedures'
  | 'immunizations'
  | 'id_card_photos'
  | 'clinical_reminders'
  | 'inbox_reminders'
  | 'notes'
  | 'intra_office_messages'
  | 'patient_portal_messages'
  | 'patient_reminders'
  | 'amendments'
  | 'vitals'
  | 'functional_status'
  | 'cognitive_status'
  | 'diagnostic_imaging'
  | 'active_directives'
  | 'golden_thread_alerts'
  | 'appointment_reminders'
  | 'prescriptions';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  settings?: Record<string, unknown>;
} 