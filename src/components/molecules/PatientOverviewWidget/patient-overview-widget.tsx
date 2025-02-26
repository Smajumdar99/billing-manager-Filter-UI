import { FC } from 'react'
import { cn } from '@/lib/utils'

interface Patient {
  id: string
  name: string
  avatar: string
  appointmentType: 'Initial Assessment' | 'Follow-up' | 'New Patient'
  clinician: {
    name: string
    avatar: string
    title?: string
  }
  status: 'Checked In' | 'Waiting to Check In' | 'Arrival' 
  arrivalTime?: 'Tomorrow'
}

interface PatientOverviewWidgetProps {
  patients: Patient[]
  onPatientClick?: (patientId: string) => void
}

export const PatientOverviewWidget: FC<PatientOverviewWidgetProps> = ({ patients, onPatientClick }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200/60">
            {['PATIENT NAME', 'APPOINTMENT TYPE', 'CLINICIAN', 'CHECK-IN STATUS'].map((header) => (
              <div key={header} className="text-xs text-gray-500 font-medium tracking-wide">
                {header}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="space-y-1 mt-1 overflow-y-auto">
            {patients.map((patient) => (
              <div 
                key={patient.id} 
                className={cn(
                  "grid grid-cols-4 gap-4 items-center py-2 px-1",
                  "transition-colors duration-200",
                  "hover:bg-gray-50/50 cursor-pointer"
                )}
                onClick={() => onPatientClick?.(patient.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center",
                    "text-xs font-medium text-white shadow-sm",
                    patient.name.toLowerCase().includes('jhon') && "bg-[#FDA4AF]",
                    patient.name.toLowerCase().includes('jane') && "bg-[#FCD34D]",
                    patient.name.toLowerCase().includes('colleen') && "bg-[#94A3B8]",
                    patient.name.toLowerCase().includes('priscilla') && "bg-[#FDBA74]",
                    patient.name.toLowerCase().includes('brandie') && "bg-[#BEF264]"
                  )}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm text-gray-900">{patient.name}</span>
                </div>

                <div>
                  <span className={cn(
                    "text-sm text-blue-600"
                  )}>
                    {patient.appointmentType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center",
                    "text-xs font-medium text-white shadow-sm",
                    patient.clinician.name.includes('Michelle') && "bg-[#F9A8D4]",
                    patient.clinician.name.includes('Jorge') && "bg-[#FCA5A5]",
                    patient.clinician.name.includes('Courtney') && "bg-[#FDE68A]",
                    patient.clinician.name.includes('Orosz') && "bg-[#CBD5E1]",
                    patient.clinician.name.includes('Emma') && "bg-[#FDBA74]"
                  )}>
                    {patient.clinician.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">
                      {patient.clinician.name}
                    </span>
                    {patient.clinician.title && (
                      <span className="text-xs text-gray-500">
                        ({patient.clinician.title})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {patient.status === 'Arrival' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-purple-600">Arrival</span>
                      <span className="text-sm text-gray-500">Tomorrow</span>
                    </div>
                  ) : (
                    <span className={cn(
                      "text-sm",
                      patient.status === 'Checked In' && "text-blue-600",
                      patient.status === 'Waiting to Check In' && "text-red-600"
                    )}>
                      {patient.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 