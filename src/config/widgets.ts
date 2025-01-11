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
  }
];

const widgetPermissions: Record<string, WidgetType[]> = {
  admin: ['patient_performance', 'notification_center', 'vital_signs', 'clinical_notes', 'medications'],
  doctor: ['patient_performance', 'vital_signs', 'clinical_notes', 'medications'],
  nurse: ['vital_signs', 'clinical_notes', 'medications'],
  patient: ['vital_signs', 'medications'],
  clinician: ['patient_performance', 'notification_center', 'vital_signs', 'clinical_notes', 'medications']
};

export const getWidgetsByRole = (role: string): Widget[] => {
  const allowedTypes = widgetPermissions[role] || [];
  return defaultWidgets.filter(widget => allowedTypes.includes(widget.type));
};

export const hasWidgetPermission = (widgetType: WidgetType, role: string): boolean => {
  const allowedTypes = widgetPermissions[role] || [];
  return allowedTypes.includes(widgetType);
}; 