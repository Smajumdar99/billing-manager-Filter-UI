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
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="min-w-full h-full flex flex-col">
          {/* Table Header - hidden on small screens, grid on md+ */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pb-2 border-b border-gray-200/60 shrink-0">
            {['PATIENT NAME', 'APPOINTMENT TYPE', 'CLINICIAN', 'CHECK-IN STATUS'].map((header) => (
              <div key={header} className="text-xs text-gray-500 font-medium tracking-wide truncate">
                {header}
              </div>
            ))}
          </div>

          {/* Table Body - responsive: cards on xs, 2-col on sm, 4-col on md+ */}
          <div className="space-y-1 sm:space-y-1 mt-1 overflow-y-auto min-h-0 flex-1">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 items-center py-2 px-2 sm:px-1 rounded-lg sm:rounded-none",
                  "transition-colors duration-200",
                  "hover:bg-gray-50/50 cursor-pointer border border-transparent sm:border-transparent hover:border-gray-200/60 sm:hover:border-transparent"
                )}
                onClick={() => onPatientClick?.(patient.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    "text-xs font-medium text-white shadow-sm",
                    patient.name.toLowerCase().includes('jhon') && "bg-[#FDA4AF]",
                    patient.name.toLowerCase().includes('jane') && "bg-[#FCD34D]",
                    patient.name.toLowerCase().includes('colleen') && "bg-[#94A3B8]",
                    patient.name.toLowerCase().includes('priscilla') && "bg-[#FDBA74]",
                    patient.name.toLowerCase().includes('brandie') && "bg-[#BEF264]"
                  )}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-500 sm:hidden">Patient</span>
                    <span className="text-sm text-gray-900 block truncate">{patient.name}</span>
                  </div>
                </div>

                <div className="min-w-0 sm:pl-0">
                  <span className="text-xs text-gray-500 sm:hidden">Type</span>
                  <span className="text-sm text-blue-600 block truncate">
                    {patient.appointmentType}
                  </span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    "text-xs font-medium text-white shadow-sm",
                    patient.clinician.name.includes('Michelle') && "bg-[#F9A8D4]",
                    patient.clinician.name.includes('Jorge') && "bg-[#FCA5A5]",
                    patient.clinician.name.includes('Courtney') && "bg-[#FDE68A]",
                    patient.clinician.name.includes('Orosz') && "bg-[#CBD5E1]",
                    patient.clinician.name.includes('Emma') && "bg-[#FDBA74]"
                  )}>
                    {patient.clinician.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-gray-500 sm:hidden">Clinician</span>
                    <span className="text-sm text-gray-900 truncate">
                      {patient.clinician.name}
                    </span>
                    {patient.clinician.title && (
                      <span className="text-xs text-gray-500">
                        ({patient.clinician.title})
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-xs text-gray-500 sm:hidden">Status</span>
                  {patient.status === 'Arrival' ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-purple-600">Arrival</span>
                      <span className="text-sm text-gray-500">Tomorrow</span>
                    </div>
                  ) : (
                    <span className={cn(
                      "text-sm block",
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