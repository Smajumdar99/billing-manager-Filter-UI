import React, { useState, useMemo } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../atoms/Card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../atoms/Select';
import { DataTable } from '../../organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Types for benefit requests
interface BenefitRequest {
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

interface BenefitsTabProps {
  patientName: string;
  patientDOB: string;
  patientGender: string;
  patientId: string;
  onRequestBenefits?: (data: any) => void;
}

// Mock data for recent requests
const mockRequests: BenefitRequest[] = [
  {
    id: '1',
    payer: '(Medicaid) AETNA',
    insuranceId: 'Q12345000',
    provider: 'Doctor, Super',
    requestDate: '2025-07-14 13:14:57',
    requestBy: 'Admin, Ensoftek',
    status: 'Failed',
    statusDetails: 'Invalid Partner, Invalid X12 Configuration',
    serviceCode: 'Health Benefit Plan Coverage'
  },
  {
    id: '2',
    payer: '(Medicare) United Healthcare',
    insuranceId: 'UHC789012',
    provider: 'Smith, John MD',
    requestDate: '2025-07-10 09:30:15',
    requestBy: 'Wilson, Sarah',
    status: 'Success',
    statusDetails: 'Benefits verified successfully',
    serviceCode: 'Health Benefit Plan Coverage'
  },
  {
    id: '3',
    payer: '(Private) Blue Cross Blue Shield',
    insuranceId: 'BCBS456789',
    provider: 'Johnson, Emily NP',
    requestDate: '2025-07-08 14:22:33',
    requestBy: 'Chen, Michael',
    status: 'Pending',
    statusDetails: 'Request submitted, awaiting response',
    serviceCode: 'Mental Health Coverage'
  }
];

// Service code options
const serviceCodeOptions = [
  { value: 'health_benefit_plan', label: 'Health Benefit Plan Coverage' },
  { value: 'mental_health', label: 'Mental Health Coverage' },
  { value: 'substance_abuse', label: 'Substance Abuse Coverage' },
  { value: 'prescription_drug', label: 'Prescription Drug Coverage' },
  { value: 'vision_coverage', label: 'Vision Coverage' },
  { value: 'dental_coverage', label: 'Dental Coverage' },
  { value: 'rehabilitation', label: 'Rehabilitation Coverage' }
];

// Provider options
const providerOptions = [
  { value: 'provider_1', label: 'Dr. Michael Chen, LPC' },
  { value: 'provider_2', label: 'Dr. Sarah Wilson, LCSW' },
  { value: 'provider_3', label: 'Dr. Emily Rodriguez, LMFT' },
  { value: 'provider_4', label: 'Dr. James Taylor, LCDC' },
  { value: 'provider_5', label: 'Dr. Lisa Brown, PhD' }
];

// Payer options  
const payerOptions = [
  { value: 'aetna_medicaid', label: '(Medicaid) AETNA' },
  { value: 'united_medicare', label: '(Medicare) United Healthcare' },
  { value: 'bcbs_private', label: '(Private) Blue Cross Blue Shield' },
  { value: 'humana_medicare', label: '(Medicare) Humana' },
  { value: 'cigna_private', label: '(Private) Cigna' },
  { value: 'anthem_medicaid', label: '(Medicaid) Anthem' }
];

// X12 Partner options
const x12PartnerOptions = [
  { value: 'clearinghouse_1', label: 'Clearinghouse Alpha' },
  { value: 'clearinghouse_2', label: 'Clearinghouse Beta' },
  { value: 'direct_connect_1', label: 'Direct Connect - AETNA' },
  { value: 'direct_connect_2', label: 'Direct Connect - United Healthcare' },
  { value: 'direct_connect_3', label: 'Direct Connect - Blue Cross Blue Shield' },
  { value: 'relay_health', label: 'Relay Health' },
  { value: 'availity', label: 'Availity' },
  { value: 'change_healthcare', label: 'Change Healthcare' }
];

const BenefitsTab: React.FC<BenefitsTabProps> = ({
  patientName,
  patientDOB,
  patientGender,
  patientId,
  onRequestBenefits
}) => {
  const [selectedServiceCode, setSelectedServiceCode] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedX12Partner, setSelectedX12Partner] = useState('');
  const [selectedPayer, setSelectedPayer] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  // AG Grid column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Payer',
      field: 'payer',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Insurance ID',
      field: 'insuranceId',
      flex: 1,
      minWidth: 150,
      cellStyle: { fontFamily: 'monospace' }
    },
    {
      headerName: 'Provider',
      field: 'provider',
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Request Date',
      field: 'requestDate',
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    },
    {
      headerName: 'Request By',
      field: 'requestBy',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const status = params.value;
        const statusDetails = params.data.statusDetails;
        const statusDisplay = getStatusDisplay(status);
        
        // Return React JSX instead of DOM elements
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.color}`}>
              {status}
            </span>
            {statusDetails && (
              <span 
                className="text-xs text-gray-500 truncate max-w-xs" 
                title={statusDetails}
              >
                {statusDetails}
              </span>
            )}
          </div>
        );
      }
    }
  ], []);

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Success':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: CheckCircleIcon
        };
      case 'Failed':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: XCircleIcon
        };
      case 'Pending':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: ClockIcon
        };
      case 'In Progress':
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: ClockIcon
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: ClockIcon
        };
    }
  };



  // Handle new benefit request
  const handleRequestBenefits = async () => {
    if (!selectedServiceCode || !selectedProvider || !selectedX12Partner || !selectedPayer) {
      alert('Please fill in all required fields');
      return;
    }

    setIsRequesting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRequest = {
        serviceCode: selectedServiceCode,
        provider: selectedProvider,
        x12Partner: selectedX12Partner,
        payer: selectedPayer,
        patientId: patientId
      };
      
      onRequestBenefits?.(newRequest);
      
      // Reset form
      setSelectedServiceCode('');
      setSelectedProvider('');
      setSelectedX12Partner('');
      setSelectedPayer('');
      
      alert('Benefit request submitted successfully!');
    } catch (error) {
      console.error('Error requesting benefits:', error);
      alert('Failed to submit benefit request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Information Header */}
      <Card className="shadow-none border-gray-200">
        <CardHeader className="bg-primary/5 border-b border-gray-200 py-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-primary" />
            Eligibility & Benefit Request(s) And Response(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Applicant:</span>
              <span className="text-sm text-gray-900">{patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">DOB:</span>
              <span className="text-sm text-gray-900">{patientDOB}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Gender:</span>
              <span className="text-sm text-gray-900">{patientGender}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests Table */}
      <Card className="shadow-none border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            Recent Benefit Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full">
            <DataTable
              rowData={mockRequests}
              columnDefs={columnDefs}
              gridOptions={{
                pagination: true,
                paginationPageSize: 5,
                suppressRowClickSelection: true,
                rowHeight: 60,
                domLayout: 'autoHeight',
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* New Benefit Request Form */}
      <Card className="shadow-none border-gray-200">
        <CardHeader className="bg-primary/5 border-b border-gray-200 py-3">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4" />
            Request New Benefit Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Charge Disclaimer */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Chargeable Service Notice</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Benefit verification requests may incur charges. Please confirm with your administrator 
                  before submitting multiple requests for the same patient.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Code <span className="text-red-500">*</span>
              </label>
              <Select value={selectedServiceCode} onValueChange={setSelectedServiceCode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select service code" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCodeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Provider <span className="text-red-500">*</span>
              </label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* X12 Partner */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                X12 Partner <span className="text-red-500">*</span>
              </label>
              <Select value={selectedX12Partner} onValueChange={setSelectedX12Partner}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select X12 partner" />
                </SelectTrigger>
                <SelectContent>
                  {x12PartnerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payer */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Payer <span className="text-red-500">*</span>
              </label>
              <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payer" />
                </SelectTrigger>
                <SelectContent>
                  {payerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Request Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleRequestBenefits}
              disabled={!selectedServiceCode || !selectedProvider || !selectedX12Partner || !selectedPayer || isRequesting}
              className="min-w-32"
            >
              {isRequesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Requesting...
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Request Benefits
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenefitsTab; 