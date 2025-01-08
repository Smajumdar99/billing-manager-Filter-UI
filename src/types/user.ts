import { Layouts } from './layout'

export interface UserSettings {
  id: string
  userId: string
  dashboardLayout?: Layouts
  sidebarCollapsed?: boolean
  createdAt: Date
  updatedAt: Date
} 