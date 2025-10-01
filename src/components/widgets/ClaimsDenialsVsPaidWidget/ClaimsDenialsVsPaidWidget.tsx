import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ClaimsDenialsVsPaidWidgetProps {
  className?: string
}

interface PayorData {
  name: string
  paid: number
  denied: number
}

// Mock data matching the image
const mockPayorData: PayorData[] = [
  {
    name: 'Anthem',
    paid: 5500.00,
    denied: 567.00
  },
  {
    name: 'Kaiser',
    paid: 3200.00,
    denied: 939.00
  },
  {
    name: 'KFF',
    paid: 5500.00,
    denied: 245.00
  },
  {
    name: 'Kaiser',
    paid: 3600.00,
    denied: 345.00
  }
]

export const ClaimsDenialsVsPaidWidget: React.FC<ClaimsDenialsVsPaidWidgetProps> = ({
  className = ''
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const getChartOption = () => {
    const payorNames = mockPayorData.map(item => item.name)
    const paidAmounts = mockPayorData.map(item => item.paid)
    const deniedAmounts = mockPayorData.map(item => item.denied)

    return {
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
      
      tooltip: {
        trigger: 'axis',
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
          const payorName = params[0].name
          const paidData = params.find((p: any) => p.seriesName === 'Paid')
          const deniedData = params.find((p: any) => p.seriesName === 'Denied')
          
          return `<div style="font-weight: 600; margin-bottom: 8px; color: #111827;">${payorName}</div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: #86EFAC;"></span>
                    <span>Paid: <strong>${formatCurrency(paidData?.value || 0)}</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: #FCA5A5;"></span>
                    <span>Denied: <strong>${formatCurrency(deniedData?.value || 0)}</strong></span>
                  </div>`
        }
      },
      
      legend: {
        show: true,
        bottom: 0,
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#6B7280',
          fontSize: 12,
          fontWeight: 500
        },
        data: [
          {
            name: 'Paid',
            icon: 'rect',
            itemStyle: {
              color: '#86EFAC'
            }
          },
          {
            name: 'Denied',
            icon: 'rect',
            itemStyle: {
              color: '#FCA5A5'
            }
          }
        ]
      },
      
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      
      xAxis: {
        type: 'category',
        data: payorNames,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E5E7EB',
            width: 1
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 11,
          fontWeight: 500
        }
      },
      
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 11,
          fontWeight: 500,
          formatter: function(value: number) {
            if (value >= 1000) {
              return '$' + (value / 1000) + 'K'
            }
            return '$' + value
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F3F4F6',
            width: 1,
            type: 'solid'
          }
        }
      },
      
      series: [
        {
          name: 'Paid',
          type: 'bar',
          data: paidAmounts.map(amount => ({
            value: amount,
            itemStyle: {
              color: '#86EFAC', // Pastel Green
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffsetY: 2
            }
          })),
          barWidth: '35%',
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffsetY: 4
            }
          },
          label: {
            show: true,
            position: 'top',
            color: '#374151',
            fontSize: 10,
            fontWeight: 600,
            formatter: function(params: any) {
              return formatCurrency(params.value)
            }
          }
        },
        {
          name: 'Denied',
          type: 'bar',
          data: deniedAmounts.map(amount => ({
            value: amount,
            itemStyle: {
              color: '#FCA5A5', // Pastel Red
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffsetY: 2
            }
          })),
          barWidth: '35%',
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffsetY: 4
            }
          },
          label: {
            show: true,
            position: 'top',
            color: '#374151',
            fontSize: 10,
            fontWeight: 600,
            formatter: function(params: any) {
              return formatCurrency(params.value)
            }
          }
        }
      ]
    }
  }

  const totalPaid = mockPayorData.reduce((sum, item) => sum + item.paid, 0)
  const totalDenied = mockPayorData.reduce((sum, item) => sum + item.denied, 0)
  const denialRate = ((totalDenied / (totalPaid + totalDenied)) * 100).toFixed(1)

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">Claims denials vs paid by payors</h3>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 mb-1">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-xs text-gray-600">
            Total Paid
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600 mb-1">
            {formatCurrency(totalDenied)}
          </div>
          <div className="text-xs text-gray-600">
            Total Denied ({denialRate}%)
          </div>
        </div>
      </div>

      {/* Chart - Flex grow to fill remaining space */}
      <div className="flex-1 mb-4 min-h-0">
        <ReactECharts
          option={getChartOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
        />
      </div>

      {/* View Details Button - Always at bottom */}
      <div className="flex justify-center mt-auto">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Detailed Claims Analysis
        </button>
      </div>
    </div>
  )
}

export default ClaimsDenialsVsPaidWidget
