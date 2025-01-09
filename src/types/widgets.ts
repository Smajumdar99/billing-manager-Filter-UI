import { UserRole } from './user'

export type WidgetType = 
  | 'notification_center'
  | 'appointments'
  | 'billing'
  | 'clinical_notes'
  | 'medications'
  | 'insurance'
  | 'lab_results'
  | 'vital_signs'
  | 'documents'
  | 'treatment_plans'
  | 'assessments'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  description?: string
  permissions: {
    view: UserRole[]
    edit?: UserRole[]
  }
  defaultPosition?: {
    x: number
    y: number
    w: number
    h: number
  }
  settings?: Record<string, any>
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