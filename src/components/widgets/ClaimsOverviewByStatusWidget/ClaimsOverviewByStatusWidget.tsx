import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ClaimsOverviewByStatusWidgetProps {
  className?: string
}

interface ClaimStatusOverview {
  status: string
  percentage: number
  color: string
  description: string
}

// Mock data matching the image
const mockClaimsOverviewData: ClaimStatusOverview[] = [
  {
    status: 'Received',
    percentage: 39,
    color: '#86EFAC', // Pastel Green
    description: 'Claims received and being processed'
  },
  {
    status: 'Denied',
    percentage: 24,
    color: '#FCA5A5', // Pastel Red
    description: 'Claims that have been denied'
  },
  {
    status: 'Pending',
    percentage: 11,
    color: '#FDE68A', // Pastel Yellow
    description: 'Claims pending review'
  },
  {
    status: 'Awaiting info...',
    percentage: 14,
    color: '#DDD6FE', // Pastel Light Purple
    description: 'Claims awaiting additional information'
  },
  {
    status: 'Paid Partial',
    percentage: 12,
    color: '#93C5FD', // Pastel Blue
    description: 'Claims with partial payments'
  }
]

export const ClaimsOverviewByStatusWidget: React.FC<ClaimsOverviewByStatusWidgetProps> = ({
  className = ''
}) => {
  const getChartOption = () => {
    return {
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicInOut',
      
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
          const item = mockClaimsOverviewData.find(d => d.status === params.name)
          return `<div style="font-weight: 600; margin-bottom: 6px; color: #111827;">${params.name}</div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
                    <span>Percentage: <strong>${params.percent}%</strong></span>
                  </div>
                  <div style="color: #6B7280; font-size: 12px;">${item?.description || ''}</div>`
        }
      },
      
      legend: {
        show: false // We'll create a custom legend
      },
      
      series: [
        {
          name: 'Claims Overview',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffsetY: 4,
              scale: 1.02
            }
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 12,
            fontWeight: 600,
            color: '#374151',
            formatter: function(params: any) {
              return `${params.percent}%`
            }
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
            smooth: true,
            lineStyle: {
              color: '#9CA3AF',
              width: 1
            }
          },
          data: mockClaimsOverviewData.map(item => ({
            name: item.status,
            value: item.percentage,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ]
    }
  }

  const totalClaims = mockClaimsOverviewData.reduce((sum, item) => sum + item.percentage, 0)

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">Claims overview by status</h3>
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

      {/* Chart and Legend Container */}
      <div className="flex-1 flex items-center justify-between min-h-0">
        {/* Chart */}
        <div className="flex-1 h-64">
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
          />
        </div>

        {/* Custom Legend */}
        <div className="ml-6 space-y-3">
          {mockClaimsOverviewData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{item.status}</div>
                <div className="text-xs text-gray-600">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            Total Claims Distribution
          </div>
          <div className="text-lg font-bold text-gray-900">
            {totalClaims}% Coverage
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 flex justify-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Detailed Status Report
        </button>
      </div>
    </div>
  )
}

export default ClaimsOverviewByStatusWidget
