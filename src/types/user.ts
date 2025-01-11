import { Layouts } from './layout'

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'clinician';

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