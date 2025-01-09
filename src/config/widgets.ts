import type { RoleWidgetConfig, Widget } from '@/types/widgets'
import type { UserRole } from '@/types/user'

// Base widgets with full configurations
const baseWidgets: Record<string, Widget> = {
  notification_center: {
    id: 'notification_center',
    type: 'notification_center',
    title: 'Notification Control Center',
    description: 'View and manage all notifications',
    permissions: {
      view: ['billing_specialist', 'billing_manager', 'clinician', 'front_desk', 
             'clinic_admin', 'cfo', 'practice_manager', 'ccbhc', 'supervisor'],
      edit: ['billing_specialist', 'billing_manager', 'clinician', 'front_desk', 
             'clinic_admin', 'cfo', 'practice_manager', 'ccbhc', 'supervisor']
    },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4 }
  },
  appointments: {
    id: 'appointments',
    type: 'appointments',
    title: 'Appointments',
    description: 'View and manage patient appointments',
    permissions: {
      view: ['front_desk', 'clinic_admin', 'practice_manager'],
      edit: ['front_desk', 'clinic_admin']
    },
    defaultPosition: { x: 0, y: 0, w: 6, h: 4 }
  },
  billing: {
    id: 'billing',
    type: 'billing',
    title: 'Billing Information',
    description: 'View and manage billing details',
    permissions: {
      view: ['billing_specialist', 'billing_manager', 'cfo'],
      edit: ['billing_specialist', 'billing_manager']
    },
    defaultPosition: { x: 6, y: 0, w: 6, h: 4 }
  },
  clinical_notes: {
    id: 'clinical_notes',
    type: 'clinical_notes',
    title: 'Clinical Notes',
    description: 'Patient clinical notes and observations',
    permissions: {
      view: ['clinician', 'clinic_admin', 'supervisor'],
      edit: ['clinician']
    },
    defaultPosition: { x: 0, y: 4, w: 12, h: 6 }
  },
  medications: {
    id: 'medications',
    type: 'medications',
    title: 'Medications',
    description: 'Current and past medications',
    permissions: {
      view: ['clinician', 'clinic_admin', 'supervisor'],
      edit: ['clinician']
    },
    defaultPosition: { x: 0, y: 10, w: 6, h: 4 }
  },
  insurance: {
    id: 'insurance',
    type: 'insurance',
    title: 'Insurance',
    description: 'Insurance and coverage information',
    permissions: {
      view: ['billing_specialist', 'billing_manager', 'front_desk', 'clinic_admin'],
      edit: ['billing_specialist', 'billing_manager']
    },
    defaultPosition: { x: 6, y: 10, w: 6, h: 4 }
  }
}

// Role-specific widget configurations
export const roleWidgetConfigs: RoleWidgetConfig[] = [
  {
    role: 'clinician',
    widgets: [
      baseWidgets.notification_center,
      baseWidgets.clinical_notes,
      baseWidgets.medications,
      {
        ...baseWidgets.appointments,
        permissions: { view: ['clinician'] } // Read-only for clinicians
      }
    ]
  },
  {
    role: 'billing_specialist',
    widgets: [
      baseWidgets.notification_center,
      baseWidgets.billing,
      baseWidgets.insurance,
      {
        ...baseWidgets.appointments,
        permissions: { view: ['billing_specialist'] } // Read-only for billing
      }
    ]
  },
  {
    role: 'front_desk',
    widgets: [
      baseWidgets.notification_center,
      baseWidgets.appointments,
      baseWidgets.insurance,
      {
        ...baseWidgets.clinical_notes,
        permissions: { view: ['front_desk'] } // Read-only basic info
      }
    ]
  },
  {
    role: 'clinic_admin',
    widgets: [
      baseWidgets.notification_center,
      baseWidgets.appointments,
      baseWidgets.clinical_notes,
      baseWidgets.medications,
      baseWidgets.insurance,
      baseWidgets.billing
    ]
  }
]

// Helper function to get widgets for a specific role
export const getWidgetsByRole = (role: UserRole): Widget[] => {
  const config = roleWidgetConfigs.find(c => c.role === role)
  return config?.widgets || []
}

// Helper function to check if a user has permission for a widget
export const hasWidgetPermission = (widget: Widget, role: UserRole, action: 'view' | 'edit' = 'view'): boolean => {
  if (action === 'view') {
    return widget.permissions.view.includes(role)
  }
  return widget.permissions.edit?.includes(role) || false
} 