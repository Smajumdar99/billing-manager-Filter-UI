import { UserRole } from './user'

export type WidgetType = 
  | 'patient_performance'
  | 'notification_center'
  | 'vital_signs'
  | 'clinical_notes'
  | 'medications';

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

export interface RoleWidgetConfig {
  role: UserRole
  widgets: Widget[]
  layout?: {
    lg?: any[]
    md?: any[]
    sm?: any[]
  }
} 