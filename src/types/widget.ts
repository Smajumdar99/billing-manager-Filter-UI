export type WidgetType = 
  | 'patient_performance'
  | 'notification_center'
  | 'vital_signs'
  | 'clinical_notes'
  | 'medications'
  | 'diagnosis'
  | 'allergies'
  | 'lab_results'
  | 'appointments'
  | 'documents'
  | 'patient_timeline'
  | 'insurance'
  | 'billing'
  | 'disclosures'
  | 'demographics'
  | 'implantable_devices'
  | 'identified_needs';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type WidgetPositions = Record<WidgetType, WidgetPosition>;

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
} 