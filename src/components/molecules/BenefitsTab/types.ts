// Types for benefit requests and responses
export interface BenefitRequest {
  id: string;
  payer: string;
  insuranceId: string;
  provider: string;
  requestDate: string;
  requestBy: string;
  status: 'Success' | 'Failed' | 'Pending' | 'In Progress';
  statusDetails?: string;
  serviceCode?: string;
  responseData?: any;
}

export interface BenefitsTabProps {
  patientName: string;
  patientDOB: string;
  patientGender: string;
  patientId: string;
  onRequestBenefits?: (data: BenefitRequestData) => void;
}

export interface BenefitRequestData {
  serviceCode: string;
  provider: string;
  x12Partner: string;
  payer: string;
  patientId: string;
}

export interface ServiceCodeOption {
  value: string;
  label: string;
}

export interface ProviderOption {
  value: string;
  label: string;
}

export interface PayerOption {
  value: string;
  label: string;
}

export interface X12PartnerOption {
  value: string;
  label: string;
} 