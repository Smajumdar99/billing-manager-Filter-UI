import { FC } from 'react'
import { cn } from '@/lib/utils'
import { PlusIcon } from '@heroicons/react/24/outline'

interface Referral {
  id: string
  name: string
  age: number
  state: string
  source: string
  avatar: string
}

interface PendingReferralsWidgetProps {
  referrals: Referral[]
}

const getBackgroundColor = (index: number) => {
  const colors = {
    0: "bg-[#faf9f7]", // Light beige for Albert
    1: "bg-[#f5f8fb]", // Light blue for Esther
    2: "bg-[#f8f7fa]", // Light purple for Guy
  }
  return colors[index as keyof typeof colors] || colors[0]
}

export const PendingReferralsWidget: FC<PendingReferralsWidgetProps> = ({ referrals }) => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-wrap gap-1.5 sm:gap-1 p-1">
          {referrals.map((referral, index) => (
            <div
              key={referral.id}
              className={cn(
                "p-1.5 rounded-lg shrink-0 min-w-0",
                "w-[130px] sm:w-[140px]",
                getBackgroundColor(index),
                "transition-colors duration-200"
              )}
            >
              <div className="flex items-center gap-1.5">
                <img
                  src={referral.avatar}
                  alt={referral.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-medium text-gray-900 truncate">
                    {referral.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="truncate">{referral.age}Y, {referral.state}</span>
                    <span>•</span>
                    <span className="truncate">{referral.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Button */}
          <button
            className={cn(
              "p-1.5 rounded-lg border border-dashed border-gray-300",
              "flex items-center gap-1.5",
              "text-blue-600 hover:text-blue-700",
              "transition-colors duration-200",
              "hover:border-blue-200 hover:bg-blue-50/30",
              "min-h-[32px]",
              "w-[130px] sm:w-[140px] shrink-0"
            )}
          >
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
              <PlusIcon className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-medium">Add New</span>
          </button>
        </div>
      </div>
    </div>
  )
} 