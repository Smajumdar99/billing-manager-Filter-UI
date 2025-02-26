import { FC, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Star, 
  CheckCircle2, 
  Circle,
  Stethoscope,
  FileEdit,
  Activity,
  Pill,
  Calendar,
  TestTube,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  CreditCard,
  FileCheck,
  Phone,
  ClipboardSignature,
  Building2,
  ShieldCheck,
  BadgeCheck,
  Receipt,
  FileSpreadsheet,
  ClipboardCheck,
  Wallet,
  CreditCard as CCIcon,
  XCircle,
  PencilLine,
  DollarSign
} from 'lucide-react'

interface PatientPerformanceCardProps {
  className?: string
  totalObjectives: number
  metObjectives: number
  onAction?: (action: string) => void
  userRole?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: string
}

const clinicianQuickActions: QuickAction[] = [
  { id: '1', label: 'New Encounter', icon: <Stethoscope className="w-4 h-4" />, action: 'new_encounter' },
  { id: '2', label: 'Add Note', icon: <FileEdit className="w-4 h-4" />, action: 'add_note' },
  { id: '3', label: 'Add Vitals', icon: <Activity className="w-4 h-4" />, action: 'add_vitals' },
  { id: '4', label: 'Add Medication', icon: <Pill className="w-4 h-4" />, action: 'add_medication' },
  { id: '5', label: 'Schedule Visit', icon: <Calendar className="w-4 h-4" />, action: 'schedule_visit' },
  { id: '6', label: 'Lab Results', icon: <TestTube className="w-4 h-4" />, action: 'view_labs' },
  { id: '7', label: 'Add Diagnosis', icon: <FileText className="w-4 h-4" />, action: 'add_diagnosis' },
  { id: '8', label: 'Care Plan', icon: <ClipboardList className="w-4 h-4" />, action: 'care_plan' },
]

const frontDeskQuickActions: QuickAction[] = [
  { id: '1', label: 'New Encounter', icon: <Stethoscope className="w-4 h-4" />, action: 'new_encounter' },
  { id: '2', label: 'Demographics', icon: <UserCircle className="w-4 h-4" />, action: 'edit_demographics' },
  { id: '3', label: 'Schedule', icon: <Calendar className="w-4 h-4" />, action: 'schedule_appointment' },
  { id: '4', label: 'Payments', icon: <CreditCard className="w-4 h-4" />, action: 'process_payment' },
  { id: '5', label: 'Check In', icon: <FileCheck className="w-4 h-4" />, action: 'check_in' },
  { id: '6', label: 'Contact', icon: <Phone className="w-4 h-4" />, action: 'contact_patient' },
  { id: '7', label: 'Documents', icon: <ClipboardSignature className="w-4 h-4" />, action: 'manage_documents' },
  { id: '8', label: 'Insurance', icon: <ShieldCheck className="w-4 h-4" />, action: 'verify_insurance' },
]

const billingSpecialistQuickActions: QuickAction[] = [
  { id: '1', label: 'Payments', icon: <DollarSign className="w-4 h-4" />, action: 'process_payment' },
  { id: '2', label: 'Receipts', icon: <Receipt className="w-4 h-4" />, action: 'view_receipts' },
  { id: '3', label: 'Statement', icon: <FileSpreadsheet className="w-4 h-4" />, action: 'view_statement' },
  { id: '4', label: 'Prior Auth', icon: <ClipboardCheck className="w-4 h-4" />, action: 'prior_auth' },
  { id: '5', label: 'New Payment', icon: <Wallet className="w-4 h-4" />, action: 'new_payment' },
  { id: '6', label: 'Credit Cards', icon: <CCIcon className="w-4 h-4" />, action: 'manage_cards' },
  { id: '7', label: 'Write Off', icon: <XCircle className="w-4 h-4" />, action: 'write_off' },
  { id: '8', label: 'Add Note', icon: <PencilLine className="w-4 h-4" />, action: 'add_billing_note' },
]

export const PatientPerformanceCard: FC<PatientPerformanceCardProps> = ({
  className,
  totalObjectives,
  metObjectives,
  onAction,
  userRole = 'clinician'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const percentageComplete = Math.round((metObjectives / totalObjectives) * 100)
  const starRating = Math.round((percentageComplete / 100) * 5)
  const needleRotation = -90 + (percentageComplete / 100) * 180

  // Select quick actions based on user role
  const quickActions = (() => {
    switch (userRole) {
      case 'front_desk':
        return frontDeskQuickActions;
      case 'billing_specialist':
        return billingSpecialistQuickActions;
      default:
        return clinicianQuickActions;
    }
  })();

  // Auto-rotate carousel
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
  }

  const handleActionClick = (actionType: string) => {
    onAction?.(actionType)
  }

  const renderQuickActions = () => (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-4 gap-4 px-6 h-full place-content-center">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.action)}
            className="flex flex-col items-center justify-center p-0 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              {action.icon}
            </div>
            <span className="text-[9px] text-gray-600 text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPerformanceMetrics = () => (
    <div className="flex items-center justify-between w-full h-full px-6">
      <div className="flex items-center gap-4">
        {/* Gauge */}
        <div className="relative w-24 h-20 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 160 100">
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd1d1" />
                <stop offset="25%" stopColor="#ff6b6b" />
                <stop offset="50%" stopColor="#ffd93d" />
                <stop offset="75%" stopColor="#95cd41" />
              </linearGradient>
            </defs>

            {/* Main arc */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Labels */}
            <text x="20" y="105" className="text-[12px] font-medium fill-[#1e3a8a]" textAnchor="middle">POOR</text>
            <text x="50" y="15" className="text-[12px] font-medium fill-[#1e3a8a]" textAnchor="middle">FAIR</text>
            <text x="120" y="15" className="text-[12px] font-medium fill-[#1e3a8a]" textAnchor="middle">GOOD</text>
            <text x="140" y="105" className="text-[12px] font-medium fill-[#1e3a8a]" textAnchor="middle">EXCELLENT</text>

            {/* Needle */}
            <g transform={`rotate(${needleRotation}, 80, 80)`}>
              <circle cx="80" cy="80" r="4" className="fill-[#1e3a8a]" />
              <path
                d="M 80 80 L 80 30"
                className="stroke-[#1e3a8a]"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[12px] font-medium text-gray-500">Patient Performance</h3>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < starRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-green-700">
            Good Progress
          </span>
        </div>
      </div>

      {/* Objectives Status */}
      <div className="flex flex-col items-end gap-1 pr-4">
        <h4 className="text-[12px] font-medium text-gray-500">Objectives</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium">{metObjectives}</span>
          </div>
          <span className="text-xs text-gray-400">/</span>
          <div className="flex items-center gap-1">
            <Circle className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium">{totalObjectives}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">{percentageComplete}% Complete</span>
      </div>
    </div>
  )

  return (
    <div 
      className={cn("bg-transparent p-0 relative min-h-[100px] h-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden h-full">
        <div 
          className="transition-transform duration-500 ease-in-out flex h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="min-w-full">
            {renderQuickActions()}
          </div>
          <div className="min-w-full">
            {renderPerformanceMetrics()}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
} 