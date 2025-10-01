import React, { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'

interface BillingMetric {
  label: string
  amount: number
  color: string
  icon: string
}

interface BillingOverviewWidgetProps {
  className?: string
}

const mockBillingMetrics: BillingMetric[] = [
  {
    label: 'Total Billed',
    amount: 10900.00,
    color: 'text-gray-900',
    icon: 'file-invoice-dollar'
  },
  {
    label: 'Billed Payer',
    amount: 9000.00,
    color: 'text-gray-900',
    icon: 'building'
  },
  {
    label: 'Billed Patients',
    amount: 1090.00,
    color: 'text-gray-900',
    icon: 'users'
  },
  {
    label: 'Total Received',
    amount: 4000.00,
    color: 'text-gray-900',
    icon: 'money-bill-wave'
  },
  {
    label: 'Patients/Copay',
    amount: 0.00,
    color: 'text-gray-900',
    icon: 'credit-card'
  },
  {
    label: 'Total Outstanding',
    amount: 6900.00,
    color: 'text-gray-900',
    icon: 'exclamation-triangle'
  }
]

export const BillingOverviewWidget: React.FC<BillingOverviewWidgetProps> = ({
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'grid'>('chart')
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const getChartOption = () => {
    // Prepare data for donut chart with pastel colors
    const chartData = [
      { name: 'Billed Payer', value: 9000, color: ['#93C5FD', '#7DD3FC', '#60A5FA'] }, // Pastel Blue gradient
      { name: 'Billed Patients', value: 1090, color: ['#86EFAC', '#6EE7B7', '#4ADE80'] }, // Pastel Green gradient
      { name: 'Outstanding', value: 6900, color: ['#FDE68A', '#FCD34D', '#FBBF24'] }, // Pastel Yellow gradient
      { name: 'Received', value: 4000, color: ['#C4B5FD', '#A78BFA', '#8B5CF6'] } // Pastel Purple gradient
    ]

    return {
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicInOut',
      
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 16,
        padding: [16, 20],
        textStyle: {
          color: '#374151',
          fontSize: 14,
          fontWeight: 500
        },
        formatter: function(params: any) {
          const percentage = ((params.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)
          return `<div style="font-weight: 700; margin-bottom: 8px; color: #111827; font-size: 15px;">${params.name}</div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 14px; height: 14px; border-radius: 50%; background: ${params.color}; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
                    <span style="font-weight: 600; color: #374151;">Amount: <span style="color: #111827; font-weight: 700;">$${params.value.toLocaleString()}</span></span>
                  </div>
                  <div style="margin-top: 8px; color: #6B7280; font-size: 13px;">${percentage}% of total</div>`
        }
      },
      
      legend: {
        show: false
      },
      
      series: [
        {
          name: 'Billing Overview',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOffsetX: 0,
            shadowOffsetY: 5
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 25,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
              shadowOffsetY: 10,
              scale: 1.05
            }
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 13,
            fontWeight: 600,
            color: '#374151',
            formatter: function(params: any) {
              const percentage = ((params.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)
              return `${params.name}\n${percentage}%`
            }
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            smooth: true,
            lineStyle: {
              color: '#9CA3AF',
              width: 2
            }
          },
          data: chartData.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: item.color[0] },
                  { offset: 0.5, color: item.color[1] },
                  { offset: 1, color: item.color[2] }
                ]
              }
            }
          }))
        }
      ]
    }
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Billing Overview</h3>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-32 h-8 text-sm text-gray-600 bg-white border border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon="ellipsis" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toggle Between Chart and Grid View */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'chart'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chart View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid View
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        /* 3D Donut Chart */
        <div className="h-64 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-sky-50/30 rounded-xl"></div>
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
            opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
          />
        </div>
      ) : (
        /* Metrics Grid - Brand Colors & Grid Layout */
        <div className="grid grid-cols-2 gap-3">
          {mockBillingMetrics.map((metric, index) => (
            <div key={index} className="group relative overflow-hidden">
              {/* Subtle background */}
              <div className="absolute inset-0 opacity-3 bg-gradient-to-r from-gray-50 to-gray-100"></div>
              
              {/* Main content */}
              <div className="relative p-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-gray-300 transition-all duration-300 hover:shadow-md hover:scale-[1.01] group-hover:shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  {/* Icon without background */}
                  <div className="flex items-center justify-center w-8 h-8">
                    <FontAwesomeIcon 
                      icon={metric.icon as any} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs font-medium text-warm-gray-600">{metric.label}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-lg font-bold ${metric.color} tracking-tight`}>
                    {formatCurrency(metric.amount)}
                  </p>
                  
                  {/* Trend indicator */}
                  {index < 3 && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded-full">
                      <FontAwesomeIcon icon="arrow-up" className="w-2 h-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">+5%</span>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Button - Secondary Style */}
      <div className="mt-4 flex justify-center">
        <button className="group px-4 py-2 text-sm font-medium text-sky-700 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 hover:border-sky-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
          <span className="flex items-center gap-2">
            View Details
            <FontAwesomeIcon icon="arrow-right" className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  )
}

export default BillingOverviewWidget
