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
} 