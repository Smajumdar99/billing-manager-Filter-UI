import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ClaimsStatusRecommendationsWidgetProps {
  className?: string
}

interface ClaimStatusData {
  title: string
  percentage: number
  threshold: number
  totalClaims: number
  totalAmount: number
  status: 'high' | 'too-high' | 'moderate'
  statusLabel: string
  description: string
  chartData: {
    name: string
    value: number
    amount: number
    color: string
  }[]
}

// Mathematically accurate mock data - Total claims: 2,800
const mockClaimsStatusData: ClaimStatusData[] = [
  {
    title: 'Received',
    percentage: 59,
    threshold: 20,
    totalClaims: 1652, // 59% of 2800 = 1652
    totalAmount: 0, // Not shown in received
    status: 'high',
    statusLabel: 'High',
    description: '1,652 claims are in sitting in received status. It is recommended that it should never be more than 20% in received status.',
    chartData: [
      { name: 'Anthem', value: 45, amount: 743400, color: '#93C5FD' }, // 45% of 1652 = 743 claims * $1000 avg
      { name: 'Kaiser', value: 30, amount: 495600, color: '#FDE68A' }, // 30% of 1652 = 496 claims * $1000 avg
      { name: 'KFF', value: 15, amount: 247800, color: '#C4B5FD' }, // 15% of 1652 = 248 claims * $1000 avg
      { name: 'United healthcare', value: 10, amount: 165200, color: '#86EFAC' } // 10% of 1652 = 165 claims * $1000 avg
    ]
  },
  {
    title: 'Denied',
    percentage: 24,
    threshold: 8,
    totalClaims: 672, // 24% of 2800 = 672
    totalAmount: 1300000, // Total denied amount
    status: 'too-high',
    statusLabel: 'Too High',
    description: '672 claims are in denied status. It is recommended that it should never be more than 8% in denied status.',
    chartData: [
      { name: 'Anthem', value: 45, amount: 585000, color: '#93C5FD' }, // 45% of $1,300,000 = $585,000
      { name: 'Kaiser', value: 30, amount: 390000, color: '#FDE68A' }, // 30% of $1,300,000 = $390,000
      { name: 'KFF', value: 15, amount: 195000, color: '#C4B5FD' }, // 15% of $1,300,000 = $195,000
      { name: 'United healthcare', value: 10, amount: 130000, color: '#86EFAC' } // 10% of $1,300,000 = $130,000
    ]
  },
  {
    title: 'Awaiting Information',
    percentage: 14,
    threshold: 12,
    totalClaims: 392, // 14% of 2800 = 392
    totalAmount: 0, // Not shown in awaiting
    status: 'moderate',
    statusLabel: 'Moderate',
    description: '392 claims are in Awaiting Info... status. It is recommended that it should never be more than 12% in Awaiting Info... status.',
    chartData: [
      { name: 'Anthem', value: 45, amount: 176400, color: '#93C5FD' }, // 45% of 392 = 176 claims * $1000 avg
      { name: 'Kaiser', value: 30, amount: 117600, color: '#FDE68A' }, // 30% of 392 = 118 claims * $1000 avg
      { name: 'KFF', value: 15, amount: 58800, color: '#C4B5FD' }, // 15% of 392 = 59 claims * $1000 avg
      { name: 'United healthcare', value: 10, amount: 39200, color: '#86EFAC' } // 10% of 392 = 39 claims * $1000 avg
    ]
  }
]

export const ClaimsStatusRecommendationsWidget: React.FC<ClaimsStatusRecommendationsWidgetProps> = ({
  className = ''
}) => {
  const getChartOption = (data: ClaimStatusData) => {
    return {
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
      
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: {
          color: '#374151',
          fontSize: 13,
          fontWeight: 500
        },
        formatter: function(params: any) {
          const item = data.chartData.find(d => d.name === params.name)
          return `<div style="font-weight: 600; margin-bottom: 6px; color: #111827;">${params.name}</div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
                    <span>Claims: <strong>${params.value}%</strong></span>
                  </div>
                  ${item?.amount ? `<div style="color: #6B7280; font-size: 12px;">Amount: $${item.amount.toLocaleString()}</div>` : ''}`
        }
      },
      
      legend: {
        show: false
      },
      
      series: [
        {
          name: data.title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffsetY: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              scale: 1.02
            }
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 11,
            fontWeight: 600,
            color: '#374151',
            formatter: function(params: any) {
              return `${params.value}%`
            }
          },
          labelLine: {
            show: true,
            length: 8,
            length2: 6,
            smooth: true,
            lineStyle: {
              color: '#9CA3AF',
              width: 1
            }
          },
          data: data.chartData.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ]
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'high':
        return 'px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md'
      case 'too-high':
        return 'px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md'
      case 'moderate':
        return 'px-2 py-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-md'
      default:
        return 'px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md'
    }
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">Claims Status Recommendations</h3>
          <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
            Action Required
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md">
            <FontAwesomeIcon icon="expand" className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md">
            <FontAwesomeIcon icon="ellipsis" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Three Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockClaimsStatusData.map((data, index) => (
          <div key={index} className="flex flex-col bg-zinc-50 rounded-xl p-4 border border-zinc-200">
            {/* Chart Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-900">{data.title} {data.percentage}%</h4>
                <span className={getStatusBadgeClass(data.status)}>
                  {data.statusLabel}
                </span>
              </div>
              
              {/* Progress Bar with Threshold Line */}
              <div className="relative mb-2">
                {/* Background progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  {/* Progress fill */}
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.status === 'high' ? 'bg-green-500' : 
                      data.status === 'too-high' ? 'bg-red-500' : 
                      'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                  />
                </div>
                
                {/* Threshold line */}
                <div 
                  className="absolute top-0 w-0.5 h-2 bg-gray-600"
                  style={{ left: `${Math.min(data.threshold, 100)}%` }}
                />
                
                {/* Threshold label */}
                <div 
                  className="absolute -bottom-4 text-xs text-gray-600 transform -translate-x-1/2"
                  style={{ left: `${Math.min(data.threshold, 100)}%` }}
                >
                  Threshold:{data.threshold}%
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 mb-4">
              <ReactECharts
                option={getChartOption(data)}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
              />
            </div>

            {/* Chart Stats */}
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.percentage}%
              </div>
              {data.totalAmount > 0 && (
                <div className="text-sm text-gray-600">
                  (${data.totalAmount.toLocaleString()})
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-xs text-gray-600 mb-3 leading-relaxed">
              {data.description}
            </div>

            {/* View Details Button */}
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium self-start">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#93C5FD' }}></div>
            <span className="text-gray-600">Anthem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FDE68A' }}></div>
            <span className="text-gray-600">Kaiser</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C4B5FD' }}></div>
            <span className="text-gray-600">KFF</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#86EFAC' }}></div>
            <span className="text-gray-600">United healthcare</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimsStatusRecommendationsWidget
