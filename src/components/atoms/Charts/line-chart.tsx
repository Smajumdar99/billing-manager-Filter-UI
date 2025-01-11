import { FC } from 'react'
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface LineChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  height?: number
}

export const LineChart: FC<LineChartProps> = ({
  data,
  xKey,
  yKeys,
  height = 300
}) => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04']

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis
          dataKey={xKey}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleString()}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        {yKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
} 