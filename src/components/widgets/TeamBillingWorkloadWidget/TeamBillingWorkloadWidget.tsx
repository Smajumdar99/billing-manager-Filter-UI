import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'

interface TeamWorkloadData {
  teamName: string
  completed: number
  remaining: number
  overdue: number
}

interface TeamBillingWorkloadWidgetProps {
  className?: string
  showTeamView?: boolean
}

const mockTeamData: TeamWorkloadData[] = [
  {
    teamName: 'Payers team',
    completed: 22,
    remaining: 0,
    overdue: 0
  },
  {
    teamName: 'Grant team',
    completed: 15,
    remaining: 3,
    overdue: 0
  },
  {
    teamName: 'Copay team',
    completed: 8,
    remaining: 10,
    overdue: 0
  },
  {
    teamName: 'NY payers team',
    completed: 12,
    remaining: 6,
    overdue: 0
  },
  {
    teamName: 'Lorem ipsum',
    completed: 20,
    remaining: 0,
    overdue: 3
  }
]

export const TeamBillingWorkloadWidget: React.FC<TeamBillingWorkloadWidgetProps> = ({
  className = '',
  showTeamView = true
}) => {
  const getChartOption = () => {
    const teams = mockTeamData.map(team => team.teamName)
    const completedData = mockTeamData.map(team => team.completed)
    const remainingData = mockTeamData.map(team => team.remaining)
    const overdueData = mockTeamData.map(team => team.overdue)

    return {
      // Enable 3D rendering
      animation: true,
      animationDuration: 1200,
      animationEasing: 'cubicOut',
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: {
          color: '#374151',
          fontSize: 13
        },
        formatter: function(params: any) {
          let result = `<div style="font-weight: 700; margin-bottom: 8px; color: #111827; font-size: 14px;">${params[0].name}</div>`
          params.forEach((param: any) => {
            if (param.value > 0) {
              result += `<div style="display: flex; align-items: center; gap: 10px; margin: 6px 0;">
                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: ${param.color}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></span>
                <span style="font-weight: 600; color: #374151;">${param.seriesName}: <span style="color: #111827;">${param.value}</span></span>
              </div>`
            }
          })
          return result
        }
      },
      legend: {
        show: false // We'll create custom legend
      },
      grid: {
        left: '15%',
        right: '4%',
        top: '8%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          fontWeight: 500
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(243, 244, 246, 0.8)',
            width: 1,
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: teams,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#374151',
          fontSize: 13,
          fontWeight: 600,
          margin: 12
        }
      },
      series: [
        {
          name: 'Completed',
          type: 'bar',
          stack: 'workload',
          data: completedData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#10B981' },
                { offset: 0.5, color: '#34D399' },
                { offset: 1, color: '#6EE7B7' }
              ]
            },
            borderRadius: [0, 4, 4, 0],
            shadowColor: 'rgba(16, 185, 129, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          barWidth: 28,
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(16, 185, 129, 0.5)'
            }
          }
        },
        {
          name: 'Remaining',
          type: 'bar',
          stack: 'workload',
          data: remainingData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#0EA5E9' },
                { offset: 0.5, color: '#38BDF8' },
                { offset: 1, color: '#7DD3FC' }
              ]
            },
            borderRadius: [0, 4, 4, 0],
            shadowColor: 'rgba(14, 165, 233, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(14, 165, 233, 0.5)'
            }
          }
        },
        {
          name: 'Overdue',
          type: 'bar',
          stack: 'workload',
          data: overdueData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#EF4444' },
                { offset: 0.5, color: '#F87171' },
                { offset: 1, color: '#FCA5A5' }
              ]
            },
            borderRadius: [0, 4, 4, 0],
            shadowColor: 'rgba(239, 68, 68, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(239, 68, 68, 0.5)'
            }
          }
        }
      ]
    }
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Team Billing Workload</h3>
        {showTeamView && (
          <div className="flex items-center gap-2">
            <Select defaultValue="team">
              <SelectTrigger className="w-40 h-8 text-sm text-gray-600 bg-white border border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team View</SelectItem>
                <SelectItem value="individual">Individual View</SelectItem>
              </SelectContent>
            </Select>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon="ellipsis" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Legend with 3D styling */}
      <div className="flex items-center gap-6 mb-6 p-3 bg-gradient-to-r from-gray-50/50 to-gray-100/30 rounded-lg border border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25"></div>
          <span className="text-sm font-semibold text-gray-800">Completed</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/25"></div>
          <span className="text-sm font-semibold text-gray-800">Remaining</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/25"></div>
          <span className="text-sm font-semibold text-gray-800">Overdue</span>
        </div>
      </div>

      {/* Enhanced Chart Container */}
      <div className="h-80 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20 rounded-xl"></div>
        <ReactECharts
          option={getChartOption()}
          style={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
          opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
        />
      </div>
    </div>
  )
}

export default TeamBillingWorkloadWidget
