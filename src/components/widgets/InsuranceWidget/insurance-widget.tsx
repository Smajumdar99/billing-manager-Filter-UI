import { FC, useState } from 'react';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  CalendarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules/Tabs/tabs';
import { cn } from '@/lib/utils';

interface InsuranceInfo {
  id: string;
  type: 'Primary' | 'Secondary' | 'Tertiary';
  provider: string;
  policyNumber: string;
  groupNumber: string;
  subscriberId: string;
  subscriberName: string;
  relationship: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  coverageType: string;
  copay: {
    primaryCare: number;
    specialistVisit: number;
    urgentCare: number;
    emergency: number;
  };
  deductible: {
    individual: number;
    family: number;
    remaining: number;
  };
  outOfPocketMax: {
    individual: number;
    family: number;
    remaining: number;
  };
  providerContact: {
    phone: string;
    address: string;
    website: string;
  };
  verificationDate?: string;
  authorizationRequired: boolean;
  coverageDetails: {
    service: string;
    covered: boolean;
    notes?: string;
  }[];
}

interface InsuranceWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const InsuranceWidget: FC<InsuranceWidgetProps> = ({ patientId, isFullscreen = false }) => {
  // This would normally come from an API/database
  const [insurances] = useState<InsuranceInfo[]>([
    {
      id: '123',
      type: 'Primary',
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'POL-123456789',
      groupNumber: 'GRP-987654321',
      subscriberId: 'SUB-123456',
      subscriberName: 'John Doe',
      relationship: 'Self',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      coverageType: 'PPO',
      copay: {
        primaryCare: 25,
        specialistVisit: 40,
        urgentCare: 50,
        emergency: 150
      },
      deductible: {
        individual: 2000,
        family: 4000,
        remaining: 1500
      },
      outOfPocketMax: {
        individual: 5000,
        family: 10000,
        remaining: 4000
      },
      providerContact: {
        phone: '1-800-123-4567',
        address: '123 Insurance Ave, Healthcare City, HC 12345',
        website: 'www.bcbs.com'
      },
      verificationDate: '2024-03-15',
      authorizationRequired: true,
      coverageDetails: [
        { service: 'Primary Care', covered: true },
        { service: 'Specialist Visits', covered: true },
        { service: 'Mental Health', covered: true },
        { service: 'Prescription Drugs', covered: true },
        { service: 'Vision', covered: false, notes: 'Separate vision plan required' },
        { service: 'Dental', covered: false, notes: 'Separate dental plan required' },
        { service: 'Physical Therapy', covered: true, notes: 'Prior authorization required' }
      ]
    },
    {
      id: '456',
      type: 'Secondary',
      provider: 'Aetna',
      policyNumber: 'POL-987654321',
      groupNumber: 'GRP-123456789',
      subscriberId: 'SUB-789012',
      subscriberName: 'Jane Doe',
      relationship: 'Spouse',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      coverageType: 'HMO',
      copay: {
        primaryCare: 15,
        specialistVisit: 30,
        urgentCare: 40,
        emergency: 100
      },
      deductible: {
        individual: 1500,
        family: 3000,
        remaining: 1000
      },
      outOfPocketMax: {
        individual: 4000,
        family: 8000,
        remaining: 3000
      },
      providerContact: {
        phone: '1-800-987-6543',
        address: '456 Healthcare St, Medical City, MC 54321',
        website: 'www.aetna.com'
      },
      verificationDate: '2024-03-10',
      authorizationRequired: true,
      coverageDetails: [
        { service: 'Primary Care', covered: true },
        { service: 'Specialist Visits', covered: true },
        { service: 'Mental Health', covered: true },
        { service: 'Prescription Drugs', covered: true },
        { service: 'Vision', covered: true },
        { service: 'Dental', covered: true },
        { service: 'Physical Therapy', covered: true, notes: 'Prior authorization required' }
      ]
    },
    {
      id: '789',
      type: 'Tertiary',
      provider: 'United Healthcare',
      policyNumber: 'POL-456789123',
      groupNumber: 'GRP-456789123',
      subscriberId: 'SUB-345678',
      subscriberName: 'John Doe',
      relationship: 'Self',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Inactive',
      coverageType: 'EPO',
      copay: {
        primaryCare: 20,
        specialistVisit: 35,
        urgentCare: 45,
        emergency: 125
      },
      deductible: {
        individual: 1750,
        family: 3500,
        remaining: 1250
      },
      outOfPocketMax: {
        individual: 4500,
        family: 9000,
        remaining: 3500
      },
      providerContact: {
        phone: '1-800-345-6789',
        address: '789 Medical Ave, Health City, HC 98765',
        website: 'www.unitedhealthcare.com'
      },
      verificationDate: '2024-02-28',
      authorizationRequired: false,
      coverageDetails: [
        { service: 'Primary Care', covered: true },
        { service: 'Specialist Visits', covered: true },
        { service: 'Mental Health', covered: true },
        { service: 'Prescription Drugs', covered: true },
        { service: 'Vision', covered: true },
        { service: 'Dental', covered: false },
        { service: 'Physical Therapy', covered: true }
      ]
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('summary');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInsuranceTypeColor = (type: InsuranceInfo['type']) => {
    switch (type) {
      case 'Primary':
        return 'bg-blue-100 text-blue-800';
      case 'Secondary':
        return 'bg-purple-100 text-purple-800';
      case 'Tertiary':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderInsuranceCard = (insurance: InsuranceInfo) => {
    return (
      <div key={insurance.id} className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 mb-0">
              <h3 className="text-sm font-semibold text-gray-900">{insurance.provider}</h3>
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getInsuranceTypeColor(insurance.type)
              )}>
                {insurance.type}
              </span>
            </div>
            <p className="text-sm text-gray-500">{insurance.coverageType}</p>
          </div>
          <span className={cn(
            'px-2 py-1 text-xs rounded-full',
            insurance.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          )}>
            {insurance.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Policy Number</p>
            <p className="text-sm font-medium">{insurance.policyNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Group Number</p>
            <p className="text-sm font-medium">{insurance.groupNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Subscriber ID</p>
            <p className="text-sm font-medium">{insurance.subscriberId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Relationship to Subscriber</p>
            <p className="text-sm font-medium">{insurance.relationship}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(insurance.startDate)} - {formatDate(insurance.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4" />
            <span>{insurance.providerContact.phone}</span>
          </div>
          {insurance.verificationDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DocumentTextIcon className="w-4 h-4" />
              <span>Last Verified: {formatDate(insurance.verificationDate)}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Deductible Remaining</p>
              <div className="space-y-1">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((insurance.deductible.individual - insurance.deductible.remaining) / insurance.deductible.individual) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(insurance.deductible.remaining)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Out of Pocket Remaining</p>
              <div className="space-y-1">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((insurance.outOfPocketMax.individual - insurance.outOfPocketMax.remaining) / insurance.outOfPocketMax.individual) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(insurance.outOfPocketMax.remaining)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-28">Type</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-48">Provider</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-28">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-36">Coverage Type</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[400px]">Programs</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">Policy Number</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">Group Number</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">Subscriber</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">Effective Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">End Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-44">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {insurances.map((insurance) => (
                      <tr key={insurance.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <span className={cn(
                            'px-2.5 py-1 text-xs font-medium rounded-full',
                            getInsuranceTypeColor(insurance.type)
                          )}>
                            {insurance.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{insurance.provider}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={cn(
                            'px-2.5 py-1 text-xs font-medium rounded-full',
                            insurance.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          )}>
                            {insurance.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{insurance.coverageType}</td>
                        <td className="px-3 py-4">
                          <div className="grid grid-cols-1 gap-2">
                            {insurance.coverageDetails.map((detail, index) => (
                              <div key={index} className="flex items-center gap-2">
                                {detail.covered ? (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                ) : (
                                  <XCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
                                )}
                                <span className="text-sm font-medium text-gray-900">{detail.service}</span>
                                {detail.notes && (
                                  <span className="text-xs text-gray-500 italic ml-1">({detail.notes})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{insurance.policyNumber}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{insurance.groupNumber}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{insurance.subscriberName}</p>
                            <p className="text-xs text-gray-500">{insurance.relationship}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{formatDate(insurance.startDate)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{formatDate(insurance.endDate)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {insurance.verificationDate ? formatDate(insurance.verificationDate) : 'Not verified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isFullscreen) {
    return renderTableView();
  }

  return (
    <div className="h-full">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="h-[calc(100%-48px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            {insurances.map(renderInsuranceCard)}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="h-[calc(100%-48px)] overflow-y-auto">
          <div className="space-y-8">
            {insurances.map(insurance => (
              <div key={insurance.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{insurance.provider}</h3>
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    getInsuranceTypeColor(insurance.type)
                  )}>
                    {insurance.type}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Copays</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Primary Care Visit</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.copay.primaryCare)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Specialist Visit</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.copay.specialistVisit)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Urgent Care</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.copay.urgentCare)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Emergency Room</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.copay.emergency)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Coverage Details</h4>
                    <div className="space-y-3">
                      {insurance.coverageDetails.map((detail, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            {detail.covered ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm">{detail.service}</span>
                          </div>
                          {detail.notes && (
                            <span className="text-sm text-gray-500">{detail.notes}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="h-[calc(100%-48px)] overflow-y-auto">
          <div className="space-y-8">
            {insurances.map(insurance => (
              <div key={insurance.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{insurance.provider}</h3>
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    getInsuranceTypeColor(insurance.type)
                  )}>
                    {insurance.type}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Deductible</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Individual</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.deductible.individual)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Family</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.deductible.family)}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm text-gray-500">Remaining</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${((insurance.deductible.individual - insurance.deductible.remaining) / insurance.deductible.individual) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm font-medium">{formatCurrency(insurance.deductible.remaining)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Out of Pocket Maximum</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Individual</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.outOfPocketMax.individual)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Family</p>
                        <p className="text-sm font-medium">{formatCurrency(insurance.outOfPocketMax.family)}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm text-gray-500">Remaining</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${((insurance.outOfPocketMax.individual - insurance.outOfPocketMax.remaining) / insurance.outOfPocketMax.individual) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm font-medium">{formatCurrency(insurance.outOfPocketMax.remaining)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 