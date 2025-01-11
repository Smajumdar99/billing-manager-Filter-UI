import { FC, useState, useEffect } from 'react';
import { LineChart } from '@/components/atoms/Charts/line-chart';
import { Badge } from '@/components/atoms/Badge/badge';
import { Button } from '@/components/atoms/Button/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { cn } from '@/lib/utils';

interface VitalSign {
  timestamp: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  spO2: number;
  painScore: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

interface VitalsWidgetProps {
  patientId: string;
  className?: string;
}

const mockVitals: VitalSign[] = Array.from({ length: 50 }, (_, i) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - i * 30); // Each entry 30 minutes apart
  return {
    timestamp: date.toISOString(),
    systolic: 120 + Math.sin(i * 0.5) * 5,
    diastolic: 80 + Math.sin(i * 0.5) * 3,
    heartRate: 72 + Math.sin(i * 0.3) * 4,
    temperature: 98.6 + Math.sin(i * 0.2) * 0.2,
    respiratoryRate: 16 + Math.sin(i * 0.4) * 2,
    spO2: 98 + Math.sin(i * 0.3),
    painScore: 2 + Math.floor(Math.sin(i * 0.8) * 2),
    weight: 70,
    height: 170,
    bmi: 24.2
  };
});

const getVitalStatus = (vital: number, ranges: { normal: [number, number], warning: [number, number] }): 'normal' | 'warning' | 'critical' => {
  if (vital >= ranges.normal[0] && vital <= ranges.normal[1]) return 'normal';
  if (vital >= ranges.warning[0] && vital <= ranges.warning[1]) return 'warning';
  return 'critical';
};

export const VitalsWidget: FC<VitalsWidgetProps> = ({ patientId, className }) => {
  const [vitals, setVitals] = useState<VitalSign[]>(mockVitals);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isRealTime, setIsRealTime] = useState(true);
  const [activeTab, setActiveTab] = useState('current');

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const lastVital = vitals[0];
      const newVital: VitalSign = {
        timestamp: new Date().toISOString(),
        systolic: lastVital.systolic + Math.random() * 6 - 3,
        diastolic: lastVital.diastolic + Math.random() * 4 - 2,
        heartRate: lastVital.heartRate + Math.random() * 4 - 2,
        temperature: lastVital.temperature + Math.random() * 0.2 - 0.1,
        respiratoryRate: lastVital.respiratoryRate + Math.random() * 2 - 1,
        spO2: Math.min(100, lastVital.spO2 + Math.random() * 2 - 1),
        painScore: lastVital.painScore,
        weight: lastVital.weight,
        height: lastVital.height,
        bmi: lastVital.bmi
      };
      setVitals(prev => [newVital, ...prev].slice(0, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime, vitals]);

  const currentVitals = vitals[0];

  const renderVitalCard = (
    label: string,
    value: number,
    unit: string,
    ranges: { normal: [number, number], warning: [number, number] },
    trend?: number,
    secondaryValue?: number
  ) => {
    const status = getVitalStatus(value, ranges);
    const statusColors = {
      normal: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      critical: 'bg-rose-50 text-rose-700 ring-rose-600/20'
    };

    const trendColors = {
      up: 'text-emerald-600',
      down: 'text-rose-600',
      neutral: 'text-slate-600'
    };

    return (
      <div className="relative p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-200">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 truncate">{label}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "rounded-md px-1 py-0.5 text-[10px] font-medium ml-1 whitespace-nowrap",
                  statusColors[status]
                )}
              >
                {status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-sm font-semibold tracking-tight leading-none">{value.toFixed(1)}</span>
              {secondaryValue && (
                <>
                  <span className="text-slate-300 mx-0.5">/</span>
                  <span className="text-sm font-semibold tracking-tight leading-none">{secondaryValue.toFixed(1)}</span>
                </>
              )}
              <span className="text-[10px] text-slate-500 ml-0.5 whitespace-nowrap">{unit}</span>
            </div>
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-0.5 mt-1">
            <span className={cn(
              "text-[10px] leading-none whitespace-nowrap",
              trend > 0 ? trendColors.up : trend < 0 ? trendColors.down : trendColors.neutral
            )}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
              {Math.abs(trend).toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500 leading-none whitespace-nowrap">from last</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg overflow-hidden">
          <div className={cn(
            "h-full transition-all duration-500",
            status === 'normal' ? 'bg-emerald-500' : 
            status === 'warning' ? 'bg-amber-500' : 
            'bg-rose-500'
          )} style={{
            width: `${Math.min(100, (value / ranges.warning[1]) * 100)}%`
          }} />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="flex h-full flex-col">
        <TabsList className="shrink-0 grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="current" className="text-xs py-1">Current</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs py-1">Trends</TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-1">History</TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <TabsContent value="current" className="m-0 p-1">
              <div className="space-y-3">
                <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-w-0">
                  {renderVitalCard(
                    "Blood Pressure",
                    currentVitals.systolic,
                    "mmHg",
                    { normal: [90, 120], warning: [120, 140] },
                    0,
                    currentVitals.diastolic
                  )}
                  {renderVitalCard(
                    "Heart Rate",
                    currentVitals.heartRate,
                    "bpm",
                    { normal: [60, 100], warning: [50, 120] },
                    2.0
                  )}
                  {renderVitalCard(
                    "Temperature",
                    currentVitals.temperature,
                    "°F",
                    { normal: [97.0, 99.0], warning: [99.0, 100.4] },
                    0.1
                  )}
                  {renderVitalCard(
                    "SpO2",
                    currentVitals.spO2,
                    "%",
                    { normal: [95, 100], warning: [94, 95] },
                    0
                  )}
                  {renderVitalCard(
                    "Respiratory Rate",
                    currentVitals.respiratoryRate,
                    "breaths/min",
                    { normal: [12, 20], warning: [10, 24] },
                    1.0
                  )}
                  {renderVitalCard(
                    "Pain Score",
                    currentVitals.painScore,
                    "/10",
                    { normal: [0, 3], warning: [4, 7] },
                    0
                  )}
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-3 space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-slate-900">Critical Alerts</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-md bg-white border">
                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-[3px] flex-shrink-0" />
                        <div className="flex-1 text-[11px] leading-4">
                          <span className="text-slate-900">SpO2 below 95% - </span>
                          <span className="text-slate-500">Consider supplemental oxygen assessment</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-slate-900">Clinical Context</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="rounded-md border border-slate-200 p-2">
                        <h5 className="text-[11px] font-medium text-slate-700 mb-1">Baseline Vitals</h5>
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[11px] text-slate-500">BP</span>
                            <span className="text-[11px] font-medium">118/78 mmHg</span>
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[11px] text-slate-500">HR</span>
                            <span className="text-[11px] font-medium">68 bpm</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 p-2">
                        <h5 className="text-[11px] font-medium text-slate-700 mb-1">Relevant Conditions</h5>
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[11px] text-slate-500">HTN</span>
                            <span className="text-[11px] font-medium">Diagnosed 2020</span>
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[11px] text-slate-500">DM Type 2</span>
                            <span className="text-[11px] font-medium">Well-controlled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="m-0 p-1">
              <div className="space-y-3">
                <div className="rounded-lg border bg-slate-50/50 p-2 sm:p-3">
                  <h3 className="text-xs font-medium text-slate-900 mb-2">Blood Pressure Trend</h3>
                  <div className="h-[140px] sm:h-[180px]">
                    <LineChart
                      data={vitals.map(v => ({
                        timestamp: new Date(v.timestamp),
                        systolic: v.systolic,
                        diastolic: v.diastolic
                      }))}
                      xKey="timestamp"
                      yKeys={["systolic", "diastolic"]}
                      height={180}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-2 sm:p-3">
                  <h3 className="text-xs font-medium text-slate-900 mb-2">Heart Rate & SpO2 Trend</h3>
                  <div className="h-[140px] sm:h-[180px]">
                    <LineChart
                      data={vitals.map(v => ({
                        timestamp: new Date(v.timestamp),
                        "Heart Rate": v.heartRate,
                        "SpO2": v.spO2
                      }))}
                      xKey="timestamp"
                      yKeys={["Heart Rate", "SpO2"]}
                      height={180}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-2 sm:p-3">
                  <h3 className="text-xs font-medium text-slate-900 mb-2">Temperature Trend</h3>
                  <div className="h-[140px] sm:h-[180px]">
                    <LineChart
                      data={vitals.map(v => ({
                        timestamp: new Date(v.timestamp),
                        Temperature: v.temperature
                      }))}
                      xKey="timestamp"
                      yKeys={["Temperature"]}
                      height={180}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-2 sm:p-3">
                  <h3 className="text-xs font-medium text-slate-900 mb-2">Respiratory Rate Trend</h3>
                  <div className="h-[140px] sm:h-[180px]">
                    <LineChart
                      data={vitals.map(v => ({
                        timestamp: new Date(v.timestamp),
                        "Respiratory Rate": v.respiratoryRate
                      }))}
                      xKey="timestamp"
                      yKeys={["Respiratory Rate"]}
                      height={180}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-2 sm:p-3">
                  <h3 className="text-xs font-medium text-slate-900 mb-2">Pain Score Trend</h3>
                  <div className="h-[140px] sm:h-[180px]">
                    <LineChart
                      data={vitals.map(v => ({
                        timestamp: new Date(v.timestamp),
                        "Pain Score": v.painScore
                      }))}
                      xKey="timestamp"
                      yKeys={["Pain Score"]}
                      height={180}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="m-0 p-1">
              <div className="space-y-3">
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50/50">
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">Time</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">BP</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">HR</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">Temp</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">SpO2</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">RR</th>
                        <th className="text-[11px] font-medium text-slate-500 py-2 px-3 text-left sticky top-0 bg-slate-50/50">Pain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {vitals.slice(0, 30).map((vital) => (
                        <tr key={vital.timestamp} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-medium text-slate-900">
                                {new Date(vital.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(vital.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.systolic.toFixed(1)}/{vital.diastolic.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.heartRate.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.temperature.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.spO2.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.respiratoryRate.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-xs font-medium text-slate-900">
                              {vital.painScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {vitals.length > 30 && (
                  <div className="flex justify-center mt-2 pb-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-500"
                      onClick={() => console.log('View all vitals')}
                    >
                      View All Vitals
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}; 