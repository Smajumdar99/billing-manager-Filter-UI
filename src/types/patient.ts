export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  age: number;
  bloodGroup?: string;
  insuranceProvider?: string;
  admittedTo?: string;
  language?: string;
  mobile?: string;
  programAuditor?: string;
  auditorTimestamp?: string;
} 