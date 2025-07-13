/**
 * Patient Data Types
 * 
 * Types and interfaces for patient table functionality
 * I will use atomic design principles for all components
 */

export interface PatientData {
  id: string;
  clientName: string;
  allowEmail: boolean;
  email: string;
  notes: string;
  primaryCounselor: string;
  insurance: string;
  serviceProgram: string;
  status: string;
  encounter: string;
  benefits: string;
  isSignedIn: boolean;
}

export interface PatientActionHandlers {
  onEditEncounterTime?: (patient: PatientData) => void;
  onRulesSatisfied?: (patient: PatientData) => void;
  onViewEncounter?: (patient: PatientData) => void;
  onNotInterested?: (patient: PatientData) => void;
  onSignInOut?: (patient: PatientData) => void;
  onViewNotes?: (patient: PatientData) => void;
  onGoldenThreat?: (patient: PatientData) => void;
  onPriorAuth?: (patient: PatientData) => void;
  onUndoCheckIn?: (patient: PatientData) => void;
}

export interface PatientsTableProps {
  patients: PatientData[];
  title?: string;
  showGroupActions?: boolean;
  actionHandlers?: PatientActionHandlers;
  className?: string;
  maxHeight?: string;
  onPatientsUpdate?: (patients: PatientData[]) => void;
  showAddMoreButton?: boolean;
  onAddMorePatients?: () => void;
} 