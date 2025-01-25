import { z } from 'zod';

export interface VitalRanges {
  normal: [number, number];
  warning: [number, number];
}

export interface VitalSign {
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

export interface BaselineVitals {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  recordedAt: string;
}

export interface RelevantCondition {
  name: string;
  diagnosedDate: string;
  status: string;
}

export interface ClinicalContext {
  baselineVitals: BaselineVitals;
  relevantConditions: RelevantCondition[];
}

export interface CriticalAlert {
  type: 'warning' | 'critical' | 'info';
  message: string;
  recommendation?: string;
  timestamp: string;
}

export interface VitalsData {
  patientId: string;
  readings: VitalSign[];
  clinicalContext: ClinicalContext;
  criticalAlerts: CriticalAlert[];
  lastUpdated: string;
}

// Zod schema for validation
export const vitalSignSchema = z.object({
  timestamp: z.string(),
  systolic: z.number(),
  diastolic: z.number(),
  heartRate: z.number(),
  temperature: z.number(),
  respiratoryRate: z.number(),
  spO2: z.number(),
  painScore: z.number(),
  weight: z.number().optional(),
  height: z.number().optional(),
  bmi: z.number().optional(),
});

export const vitalsDataSchema = z.object({
  patientId: z.string(),
  readings: z.array(vitalSignSchema),
  clinicalContext: z.object({
    baselineVitals: z.object({
      bloodPressure: z.object({
        systolic: z.number(),
        diastolic: z.number(),
      }),
      heartRate: z.number(),
      recordedAt: z.string(),
    }),
    relevantConditions: z.array(z.object({
      name: z.string(),
      diagnosedDate: z.string(),
      status: z.string(),
    })),
  }),
  criticalAlerts: z.array(z.object({
    type: z.enum(['warning', 'critical', 'info']),
    message: z.string(),
    recommendation: z.string().optional(),
    timestamp: z.string(),
  })),
  lastUpdated: z.string(),
});

// Standard vital ranges
export const VITAL_RANGES: Record<string, VitalRanges> = {
  bloodPressure: { normal: [90, 120], warning: [120, 140] },
  heartRate: { normal: [60, 100], warning: [50, 120] },
  temperature: { normal: [97.0, 99.0], warning: [99.0, 100.4] },
  spO2: { normal: [95, 100], warning: [94, 95] },
  respiratoryRate: { normal: [12, 20], warning: [10, 24] },
  painScore: { normal: [0, 3], warning: [4, 7] },
}; 