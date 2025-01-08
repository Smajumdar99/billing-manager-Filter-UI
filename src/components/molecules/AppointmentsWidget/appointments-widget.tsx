import { FC, useState } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { ScrollArea } from '@/components/atoms/ScrollArea'
import { Appointment } from '@/types/appointment'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/atoms/Dialog/dialog'

interface TimeSlotProps {
  time: string
  appointments: Appointment[]
  showMore?: number
}

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'confirmed':
      return "bg-blue-50 text-blue-700 border border-blue-200"
    case 'checkedIn':
      return "bg-green-50 text-green-700 border border-green-200"
    case 'scheduled':
      return "bg-yellow-50 text-yellow-700 border border-yellow-200"
    case 'completed':
      return "bg-gray-50 text-gray-700 border border-gray-200"
    case 'cancelled':
      return "bg-red-50 text-red-700 border border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200"
  }
}

const StatusBadge: FC<{ status: string }> = ({ status }) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full text-[10px] font-medium inline-flex items-center gap-1",
    getStatusBadgeStyles(status)
  )}>
    {status === 'checkedIn' && (
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
    )}
    {status === 'confirmed' && (
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    )}
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

const getTimeSlotColors = (time: string) => {
  switch (time) {
    case '7':
      return {
        bg: "bg-blue-50/50",
        border: "border-l-blue-500",
        text: "text-blue-700"
      }
    case '8':
      return {
        bg: "bg-[#A193C7]/10",
        border: "border-l-[#A193C7]",
        text: "text-[#A193C7]"
      }
    case '9':
      return {
        bg: "bg-orange-50/50",
        border: "border-l-orange-500",
        text: "text-orange-700"
      }
    case '10':
      return {
        bg: "bg-green-50/50",
        border: "border-l-green-500",
        text: "text-green-700"
      }
    case '11':
      return {
        bg: "bg-purple-50/50",
        border: "border-l-purple-500",
        text: "text-purple-700"
      }
    case '2':
      return {
        bg: "bg-indigo-50/50",
        border: "border-l-indigo-500",
        text: "text-indigo-700"
      }
    default:
      return {
        bg: "bg-gray-50/50",
        border: "border-l-gray-500",
        text: "text-gray-700"
      }
  }
}

const TimeSlot: FC<TimeSlotProps> = ({ time, appointments, showMore }) => {
  if (appointments.length === 0) return null

  const colors = getTimeSlotColors(time)

  return (
    <div className="flex items-start gap-2">
      <div className={cn(
        "w-[50px] pt-1.5 text-xs font-medium shrink-0",
        colors.text
      )}>
        {time} AM
      </div>
      <div className="flex-1 min-w-0">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="flex gap-2 pb-1 pr-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={cn(
                  "w-[200px] shrink-0 p-3 rounded-lg",
                  colors.bg,
                  "border-l-4",
                  colors.border,
                  "transition-all duration-200",
                  "hover:bg-opacity-75"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "text-sm font-semibold",
                    colors.text
                  )}>
                    {apt.time} AM
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="text-sm font-medium text-gray-900 mb-0.5 truncate">
                  {apt.patientName}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 truncate flex-1 mr-2">
                    {apt.type === 'initial' ? 'Initial Assessment' : 
                     apt.type === 'followUp' ? 'Follow-up' : 'New Patient'}
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {apt.duration}min
                  </div>
                </div>
              </div>
            ))}
            {showMore && (
              <div className="flex items-center shrink-0 pr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-medium text-xs h-8",
                    colors.text,
                    `hover:${colors.text}/80`
                  )}
                >
                  +{showMore} more
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface AppointmentsWidgetProps {
  appointments: Appointment[]
  onAddAppointment?: () => void
  isMaximized?: boolean
  onMaximizeChange?: (isOpen: boolean) => void
  title: string
}

export const AppointmentsWidget: FC<AppointmentsWidgetProps> = ({
  appointments,
  onAddAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const daysToShow = 7

  const days = Array.from({ length: daysToShow }, (_, i) => addDays(selectedDate, i))

  const filteredAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), selectedDate)
  )

  // Group appointments by hour
  const appointmentsByHour = filteredAppointments.reduce((acc, apt) => {
    const hour = apt.time.split(':')[0]
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(apt)
    return acc
  }, {} as Record<string, Appointment[]>)

  return (
    <div className="h-full flex flex-col">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(prev => addDays(prev, -7))}
            className="h-6 w-6 shrink-0"
          >
            <ChevronLeftIcon className="h-3 w-3" />
          </Button>
          <div className="flex justify-between flex-1 px-1">
            {days.map((day, i) => {
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)

              return (
                <Button
                  key={i}
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 p-0 font-normal flex-col relative",
                    "hover:bg-transparent",
                    !isToday && !isSelected && "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className={cn(
                    "text-[8px] uppercase font-medium",
                    isToday && "text-[#4318FF]",
                    !isToday && !isSelected && "text-gray-600",
                    isSelected && !isToday && "text-gray-600"
                  )}>
                    {format(day, 'EEE')}
                  </span>
                  <span className={cn(
                    "relative inline-flex items-center justify-center",
                    "w-6 h-6 rounded-full",
                    isToday && "bg-[#4318FF] text-white",
                    isSelected && !isToday && "bg-[#4318FF]/10 text-[#4318FF]",
                    !isToday && !isSelected && "text-gray-900"
                  )}>
                    <span className="text-base leading-none">
                      {format(day, 'd')}
                    </span>
                  </span>
                </Button>
              )
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(prev => addDays(prev, 7))}
            className="h-6 w-6 shrink-0"
          >
            <ChevronRightIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Appointments list */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-6 pr-3">
          <TimeSlot time="7" appointments={appointmentsByHour['07'] || []} />
          <TimeSlot time="8" appointments={appointmentsByHour['08'] || []} />
          <TimeSlot time="9" appointments={appointmentsByHour['09'] || []} />
          <TimeSlot time="10" appointments={appointmentsByHour['10'] || []} />
          <TimeSlot time="11" appointments={appointmentsByHour['11'] || []} />
          <TimeSlot time="2" appointments={appointmentsByHour['14'] || []} />
        </div>
      </div>
    </div>
  )
} 