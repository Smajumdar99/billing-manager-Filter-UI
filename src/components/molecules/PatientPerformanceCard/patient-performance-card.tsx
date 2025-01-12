import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface PatientPerformanceCardProps {
  className?: string
  totalObjectives: number
  metObjectives: number
}

export const PatientPerformanceCard: FC<PatientPerformanceCardProps> = ({
  className,
  totalObjectives,
  metObjectives
}) => {
  const percentageComplete = Math.round((metObjectives / totalObjectives) * 100)
  const starRating = Math.round((percentageComplete / 100) * 5)
  const needleRotation = -90 + (percentageComplete / 100) * 180

  return (
    <div className={cn(
      "bg-transparent p-0 pt-1",
      className
    )}>
      <div className="flex items-start gap-4">
        {/* Gauge */}
        <div className="relative w-24 h-16">
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
          <span className="text-sm font-semibold text-[#1e3a8a]">
            Good Progress
          </span>
        </div>
      </div>
    </div>
  )
} 