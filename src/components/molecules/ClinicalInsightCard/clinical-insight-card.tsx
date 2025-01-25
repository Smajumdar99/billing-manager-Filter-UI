import { FC } from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  BeakerIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export type InsightType = 
  | 'trend_up'
  | 'trend_down'
  | 'warning'
  | 'success'
  | 'due'
  | 'metric'
  | 'lab'
  | 'vital';

export interface ClinicalInsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  value?: string | number;
  date?: string;
  className?: string;
}

const iconMap: Record<InsightType, typeof ArrowTrendingUpIcon> = {
  trend_up: ArrowTrendingUpIcon,
  trend_down: ArrowTrendingDownIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  due: ClockIcon,
  metric: ChartBarIcon,
  lab: BeakerIcon,
  vital: HeartIcon
};

const colorMap: Record<InsightType, { bg: string, text: string, icon: string, border: string }> = {
  trend_up: {
    bg: 'bg-emerald-50/50',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
    border: 'border-emerald-100'
  },
  trend_down: {
    bg: 'bg-rose-50/50',
    text: 'text-rose-700',
    icon: 'text-rose-600',
    border: 'border-rose-100'
  },
  warning: {
    bg: 'bg-amber-50/50',
    text: 'text-amber-700',
    icon: 'text-amber-600',
    border: 'border-amber-100'
  },
  success: {
    bg: 'bg-green-50/50',
    text: 'text-green-700',
    icon: 'text-green-600',
    border: 'border-green-100'
  },
  due: {
    bg: 'bg-blue-50/50',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    border: 'border-blue-100'
  },
  metric: {
    bg: 'bg-indigo-50/50',
    text: 'text-indigo-700',
    icon: 'text-indigo-600',
    border: 'border-indigo-100'
  },
  lab: {
    bg: 'bg-purple-50/50',
    text: 'text-purple-700',
    icon: 'text-purple-600',
    border: 'border-purple-100'
  },
  vital: {
    bg: 'bg-rose-50/50',
    text: 'text-rose-700',
    icon: 'text-rose-600',
    border: 'border-rose-100'
  }
};

export const ClinicalInsightCard: FC<ClinicalInsightCardProps> = ({
  type,
  title,
  description,
  value,
  date,
  className
}) => {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className={cn(
      "relative flex flex-col gap-2 p-3 bg-white rounded-xl border transition-all duration-200",
      "hover:shadow-lg hover:-translate-y-0.5",
      colors.border,
      colors.bg,
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          "flex items-center justify-center w-6 h-6 rounded-lg",
          "bg-white shadow-sm",
          colors.icon
        )}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {value && (
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-base font-semibold tracking-tight leading-none",
              colors.text
            )}>
              {value}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <h4 className={cn(
          "text-xs font-medium leading-tight",
          colors.text
        )}>
          {title}
        </h4>
        <p className="text-xs text-slate-600 line-clamp-2 leading-normal">
          {description}
        </p>
      </div>

      {date && (
        <div className="flex items-center gap-1 mt-auto">
          <ClockIcon className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] text-slate-500 leading-none">{date}</span>
        </div>
      )}
    </div>
  );
}; 