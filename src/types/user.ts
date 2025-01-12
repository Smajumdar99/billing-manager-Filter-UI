import { Layouts } from './layout'

export type UserRole = 
  | 'billing_specialist'
  | 'billing_manager'
  | 'clinician'
  | 'front_desk'
  | 'clinic_admin'
  | 'cfo'
  | 'practice_manager'
  | 'ccbhc'
  | 'supervisor'
  | 'doctor';

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: Date
  isActive: boolean
  permissions?: string[]
}

export interface UserSettings {
  id: string
  userId: string
  dashboardLayout?: Layouts
  sidebarCollapsed?: boolean
  theme?: 'light' | 'dark'
  createdAt: Date
  updatedAt: Date
} 