export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checkedIn' | 'completed' | 'cancelled'
export type AppointmentType = 'initial' | 'followUp' | 'newPatient'

export interface Appointment {
  id: string
  patientName: string
  time: string
  date: Date
  status: AppointmentStatus
  type: AppointmentType
  duration: number // in minutes
  program?: string // Behavioral program name
  provider?: string // Healthcare provider name
  category?: string // Assessment category
  isGroup?: boolean // Whether it's a group or individual appointment
  isRecurring?: boolean // Whether the appointment recurs
} 