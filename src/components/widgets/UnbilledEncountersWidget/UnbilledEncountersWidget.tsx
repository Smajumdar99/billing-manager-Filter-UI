import React from 'react'
import ReactECharts from 'echarts-for-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs'

interface UnbilledData {
  period: string
  encounters: number
  claims: number
  color: string
}

interface UnbilledEncountersWidgetProps {
  className?: string
}

const mockUnbilledData: UnbilledData[] = [
  {
    period: 'Past 7 days',
    encounters: 87,
    claims: 12,
    color: '#2563EB' // blue-600
  },
  {
    period: 'Past 14 days',
    encounters: 56,
    claims: 8,
    color: '#2563EB' // blue-600
  },
  {
    period: 'Past 3 weeks',
    encounters: 19,
    claims: 15,
    color: '#EAB308' // yellow-500
  },
  {
    period: 'Past 30 days',
    encounters: 53,
    claims: 25,
    color: '#DC2626' // red-600
  }
]

export const UnbilledEncountersWidget: React.FC<UnbilledEncountersWidgetProps> = ({
  className = ''
}) => {

  const getEncountersChartOption = () => {
    const periods = mockUnbilledData.map(item => item.period)
    const encountersData = mockUnbilledData.map(item => item.encounters)
    
    // Modern gradient color scheme
    const gradientColors = [
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#3B82F6' },
          { offset: 0.5, color: '#1D4ED8' },
          { offset: 1, color: '#1E40AF' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#8B5CF6' },
          { offset: 0.5, color: '#7C3AED' },
          { offset: 1, color: '#6D28D9' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#F59E0B' },
          { offset: 0.5, color: '#D97706' },
          { offset: 1, color: '#B45309' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#EF4444' },
          { offset: 0.5, color: '#DC2626' },
          { offset: 1, color: '#B91C1C' }
        ]
      }
    ]

    return {
      // Enhanced animations
      animation: true,
      animationDuration: 1500,
      animationEasing: 'elasticOut',
      animationDelay: (idx: number) => idx * 200,
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0,0,0.12)'
          }
        },
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
          const param = params[0]
          return `<div style="font-weight: 700; margin-bottom: 10px; color: #111827; font-size: 15px;">${param.name}</div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 14px; height: 14px; border-radius: 4px; background: linear-gradient(135deg, #3B82F6, #1E40AF); box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);"></div>
                    <span style="font-weight: 600; color: #374151;">Unbilled Encounters: <span style="color: #111827; font-weight: 700;">${param.value}</span></span>
                  </div>`
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '12%',
        bottom: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: periods,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 13,
          fontWeight: 600,
          interval: 0,
          rotate: 0,
          margin: 15
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
          fontSize: 12,
          fontWeight: 500
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(243, 244, 246, 0.6)',
            width: 1,
            type: 'dashed'
          }
        },
        max: 100
      },
      series: [
        {
          name: 'Unbilled Encounters',
          type: 'bar',
          data: encountersData.map((value, index) => ({
            value,
            itemStyle: {
              color: gradientColors[index],
              borderRadius: [8, 8, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.15)',
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowOffsetY: 4
            }
          })),
          barWidth: 48,
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
              shadowOffsetY: 8
            }
          },
          label: {
            show: true,
            position: 'inside',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2
          }
        }
      ]
    }
  }

  const getClaimsChartOption = () => {
    const periods = mockUnbilledData.map(item => item.period)
    const claimsData = mockUnbilledData.map(item => item.claims)
    
    // Modern gradient color scheme for claims
    const gradientColors = [
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#06B6D4' },
          { offset: 0.5, color: '#0891B2' },
          { offset: 1, color: '#0E7490' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#10B981' },
          { offset: 0.5, color: '#059669' },
          { offset: 1, color: '#047857' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#F59E0B' },
          { offset: 0.5, color: '#D97706' },
          { offset: 1, color: '#B45309' }
        ]
      },
      {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#F97316' },
          { offset: 0.5, color: '#EA580C' },
          { offset: 1, color: '#C2410C' }
        ]
      }
    ]

    return {
      // Enhanced animations
      animation: true,
      animationDuration: 1500,
      animationEasing: 'elasticOut',
      animationDelay: (idx: number) => idx * 200,
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0,0,0.12)'
          }
        },
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
          const param = params[0]
          return `<div style="font-weight: 700; margin-bottom: 10px; color: #111827; font-size: 15px;">${param.name}</div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 14px; height: 14px; border-radius: 4px; background: linear-gradient(135deg, #06B6D4, #0E7490); box-shadow: 0 4px 8px rgba(6, 182, 212, 0.3);"></div>
                    <span style="font-weight: 600; color: #374151;">Unbilled Claims: <span style="color: #111827; font-weight: 700;">${param.value}</span></span>
                  </div>`
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '12%',
        bottom: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: periods,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 13,
          fontWeight: 600,
          interval: 0,
          rotate: 0,
          margin: 15
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
          fontSize: 12,
          fontWeight: 500
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(243, 244, 246, 0.6)',
            width: 1,
            type: 'dashed'
          }
        },
        max: 30
      },
      series: [
        {
          name: 'Unbilled Claims',
          type: 'bar',
          data: claimsData.map((value, index) => ({
            value,
            itemStyle: {
              color: gradientColors[index],
              borderRadius: [8, 8, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.15)',
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowOffsetY: 4
            }
          })),
          barWidth: 48,
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
              shadowOffsetY: 8
            }
          },
          label: {
            show: true,
            position: 'inside',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2
          }
        }
      ]
    }
  }

  const totalEncounters = mockUnbilledData.reduce((sum, item) => sum + item.encounters, 0)
  const totalClaims = mockUnbilledData.reduce((sum, item) => sum + item.claims, 0)

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Unbilled Data</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon="ellipsis" className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Tabs Component */}
      <Tabs defaultValue="encounters" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="encounters" className="data-[state=active]:bg-white">
              Unbilled Encounters ({totalEncounters.toString().padStart(3, '0')})
            </TabsTrigger>
            <TabsTrigger value="claims" className="data-[state=active]:bg-white">
              Unbilled Claims ({totalClaims.toString().padStart(2, '0')})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Enhanced Chart Container with Bottom Alignment */}
        <TabsContent value="encounters" className="mt-0">
          <div className="h-80 relative flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-xl"></div>
            <div className="flex-1 flex items-end">
              <ReactECharts
                option={getEncountersChartOption()}
                style={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
                opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="claims" className="mt-0">
          <div className="h-80 relative flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/20 to-emerald-50/20 rounded-xl"></div>
            <div className="flex-1 flex items-end">
              <ReactECharts
                option={getClaimsChartOption()}
                style={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
                opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UnbilledEncountersWidget
