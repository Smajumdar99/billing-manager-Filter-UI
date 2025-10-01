import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface AccountsReceivableWidgetProps {
  className?: string
}

interface ReceivableData {
  category: string
  amount: number
  color: string
  description: string
}

// Mock data matching the image
const mockReceivableData: ReceivableData[] = [
  {
    category: 'Less than 30 days',
    amount: 3900.00,
    color: '#93C5FD', // Pastel Blue
    description: 'Current receivables'
  },
  {
    category: 'Waiting for too long (3 months)',
    amount: 5900.00,
    color: '#FDE68A', // Pastel Yellow
    description: 'Aged receivables requiring attention'
  },
  {
    category: 'Overdue 100+ days',
    amount: 2100.00,
    color: '#FCA5A5', // Pastel Red
    description: 'Significantly overdue accounts'
  }
]

export const AccountsReceivableWidget: React.FC<AccountsReceivableWidgetProps> = ({
  className = ''
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const getChartOption = () => {
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
          const data = params[0]
          const item = mockReceivableData.find(d => d.category === data.name)
          return `<div style="font-weight: 600; margin-bottom: 6px; color: #111827;">${data.name}</div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: ${data.color};"></span>
                    <span>Amount: <strong>${formatCurrency(data.value)}</strong></span>
                  </div>
                  <div style="color: #6B7280; font-size: 12px;">${item?.description || ''}</div>`
        }
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
        data: mockReceivableData.map(item => item.category),
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
          fontWeight: 500,
          interval: 0,
          rotate: 0,
          formatter: function(value: string) {
            // Split long labels into multiple lines
            if (value.length > 15) {
              const words = value.split(' ')
              const mid = Math.ceil(words.length / 2)
              return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ')
            }
            return value
          }
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
          name: 'Accounts Receivable',
          type: 'bar',
          data: mockReceivableData.map(item => ({
            value: item.amount,
            itemStyle: {
              color: item.color,
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffsetY: 2
            }
          })),
          barWidth: '60%',
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
            fontSize: 12,
            fontWeight: 600,
            formatter: function(params: any) {
              return formatCurrency(params.value)
            }
          }
        }
      ]
    }
  }

  const totalReceivable = mockReceivableData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">Accounts Receivable (Patient + Payor)</h3>
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
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(totalReceivable)}
        </div>
        <div className="text-sm text-gray-600">
          Total Outstanding Receivables
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ReactECharts
          option={getChartOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
        />
      </div>

      {/* Aging Analysis */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {mockReceivableData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <div className="text-xs font-medium text-gray-900 mb-1">
              {formatCurrency(item.amount)}
            </div>
            <div className="text-xs text-gray-600">
              {((item.amount / totalReceivable) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* View Details Button */}
      <div className="mt-4 flex justify-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Detailed Aging Report
        </button>
      </div>
    </div>
  )
}

export default AccountsReceivableWidget
