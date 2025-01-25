import { Layouts } from './layout'

export type UserRole = 
  | 'doctor'
  | 'nurse'
  | 'clinician'
  | 'front_desk'
  | 'clinic_admin'
  | 'billing_specialist'
  | 'billing_manager'
  | 'cfo'
  | 'practice_manager'
  | 'ccbhc'
  | 'supervisor';

export interface User {
  uid: string;
  id: string;
  displayName: string | null;
  email: string | null;
  role: UserRole;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface UserSettings {
  id: string
  userId: string
  dashboardLayout?: Layouts
  sidebarCollapsed?: boolean
  patientChartNavSettings?: {
    position: 'left' | 'right'
    isCollapsed: boolean
  }
  theme?: 'light' | 'dark'
  createdAt: Date
  updatedAt: Date
} 