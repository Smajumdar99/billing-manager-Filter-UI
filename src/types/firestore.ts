import { WidgetLayout } from '@/components/organisms/WidgetGrid'

export interface UserSettings {
  id: string
  userId: string
  dashboardLayout: {
    [breakpoint: string]: WidgetLayout[]
  }
  theme?: 'light' | 'dark'
  createdAt: Date
  updatedAt: Date
} 