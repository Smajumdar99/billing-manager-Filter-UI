import React, { useState, useEffect } from 'react';
import { BuildingOfficeIcon, ClipboardDocumentListIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@/components/atoms/Switch';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * DiagnosesAndFacilitiesStep Component
 * 
 * Step 2 of the New Treatment Plan wizard.
 * Handles active diagnoses selection and facility/program assignment.
 * 
 * Features:
 * - Active diagnoses selection with search
 * - Facility and program selection
 * - Visual selection indicators
 * - Search and filter functionality
 * - Apple-style clean design
 */

interface DiagnosesAndFacilitiesStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Mock diagnoses data - Default diagnoses shown first
const mockDiagnoses = [
  // Default diagnoses (commonly used)
  { code: 'R50.81', description: 'Fever presenting with conditions classified elsewhere' },
  { code: 'F15.10', description: 'Other stimulant abuse, uncomplicated' },
  { code: 'F99', description: 'Mental disorder, not otherwise specified' },
  { code: 'R06.7', description: 'Sneezing' },
  // Additional diagnoses
  { code: 'F10.980', description: 'Alcohol use, unspecified with alcohol-induced anxiety disorder' },
  { code: 'F84.0', description: 'Autistic disorder' },
  { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
  { code: 'F80.9', description: 'Developmental disorder of speech and language, unspecified' }
];

// Default selected diagnoses
const defaultSelectedDiagnoses = ['R50.81', 'F15.10', 'F99', 'R06.7'];

// Mock facilities data
const mockFacilities = [
  { id: '1111ADiamond1111', name: '1111ADiamond1111 Facility', type: 'Primary Care' },
  { id: '22Best', name: '22Best Facility', type: 'Behavioral Health' },
  { id: '789', name: '789 Specialty Center', type: 'Specialty Care' },
  { id: 'A-AADO', name: 'A-AADO Treatment Center', type: 'Addiction Treatment' },
  { id: 'A-METH', name: 'A-METH Recovery Center', type: 'Substance Abuse' },
  { id: 'A-SUBX', name: 'A-SUBX Clinic', type: 'Outpatient Services' }
];

// Mock providers data
const mockProviders = [
  { id: 'PROV001', name: 'Dr. Sarah Johnson', title: 'Psychiatrist', specialty: 'Adult Psychiatry', license: 'MD-12345' },
  { id: 'PROV002', name: 'Dr. Michael Chen', title: 'Clinical Psychologist', specialty: 'Behavioral Therapy', license: 'PSY-67890' },
  { id: 'PROV003', name: 'Lisa Rodriguez, LCSW', title: 'Licensed Clinical Social Worker', specialty: 'Substance Abuse', license: 'LCSW-11111' },
  { id: 'PROV004', name: 'Dr. James Wilson', title: 'Addiction Medicine Specialist', specialty: 'Addiction Medicine', license: 'MD-22222' },
  { id: 'PROV005', name: 'Maria Garcia, RN', title: 'Registered Nurse', specialty: 'Psychiatric Nursing', license: 'RN-33333' },
  { id: 'PROV006', name: 'Dr. Emily Davis', title: 'Family Medicine Physician', specialty: 'Primary Care', license: 'MD-44444' },
  { id: 'PROV007', name: 'Robert Thompson, LMFT', title: 'Licensed Marriage & Family Therapist', specialty: 'Family Therapy', license: 'LMFT-55555' },
  { id: 'PROV008', name: 'Dr. Amanda Lee', title: 'Neurologist', specialty: 'Neurology', license: 'MD-66666' }
];



const DiagnosesAndFacilitiesStep: React.FC<DiagnosesAndFacilitiesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [diagnosesSearch, setDiagnosesSearch] = useState('');
  const [facilitiesSearch, setFacilitiesSearch] = useState('');
  const [providersSearch, setProvidersSearch] = useState('');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false); // Settings collapsed by default

  // Initialize default diagnoses when component mounts if none are selected
  useEffect(() => {
    if (formData.activeDiagnoses.length === 0) {
      updateFormData({ activeDiagnoses: defaultSelectedDiagnoses });
    }
  }, []); // Empty dependency array means this runs once on mount

  // Filter functions
  const filteredDiagnoses = mockDiagnoses.filter(diagnosis =>
    diagnosis.code.toLowerCase().includes(diagnosesSearch.toLowerCase()) ||
    diagnosis.description.toLowerCase().includes(diagnosesSearch.toLowerCase())
  );

  const filteredFacilities = mockFacilities.filter(facility =>
    facility.name.toLowerCase().includes(facilitiesSearch.toLowerCase()) ||
    facility.type.toLowerCase().includes(facilitiesSearch.toLowerCase())
  );

  const filteredProviders = mockProviders.filter(provider =>
    provider.name.toLowerCase().includes(providersSearch.toLowerCase()) ||
    provider.title.toLowerCase().includes(providersSearch.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(providersSearch.toLowerCase())
  );



  // Selection handlers
  const toggleDiagnosis = (diagnosisCode: string) => {
    const updatedDiagnoses = formData.activeDiagnoses.includes(diagnosisCode)
      ? formData.activeDiagnoses.filter(code => code !== diagnosisCode)
      : [...formData.activeDiagnoses, diagnosisCode];
    
    updateFormData({ activeDiagnoses: updatedDiagnoses });
  };

  const toggleFacility = (facilityId: string) => {
    const updatedFacilities = formData.selectedFacilities.includes(facilityId)
      ? formData.selectedFacilities.filter(id => id !== facilityId)
      : [...formData.selectedFacilities, facilityId];
    
    updateFormData({ selectedFacilities: updatedFacilities });
  };

  const toggleProvider = (providerId: string) => {
    // For now, we'll use a simple array of provider IDs
    // Later this can be enhanced to store full provider objects
    const currentProviders = formData.assignedProviders.map(p => p.providerId);
    const isSelected = currentProviders.includes(providerId);
    
    if (isSelected) {
      // Remove provider
      const updatedProviders = formData.assignedProviders.filter(p => p.providerId !== providerId);
      updateFormData({ assignedProviders: updatedProviders });
    } else {
      // Add provider
      const provider = mockProviders.find(p => p.id === providerId);
      if (provider) {
        const newProvider = {
          id: `assigned-${Date.now()}`, // Generate unique ID
          providerId: provider.id,
          providerName: provider.name,
          providerTitle: provider.title,
          role: provider.specialty,
          assignedDate: new Date().toISOString().split('T')[0]
        };
        updateFormData({ assignedProviders: [...formData.assignedProviders, newProvider] });
      }
    }
  };



  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Active Diagnoses Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600 mr-2" />
            Active Diagnoses
          </h3>
          
          {/* Search to Add */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Search and Add Diagnoses:</h4>
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder="Search diagnoses by code or description..."
                value={diagnosesSearch}
                onChange={(e) => setDiagnosesSearch(e.target.value)}
                className="w-full"
              />
              
              {/* Search Results Overlay */}
              {diagnosesSearch && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredDiagnoses
                    .filter(diagnosis => !formData.activeDiagnoses.includes(diagnosis.code))
                    .map((diagnosis) => (
                    <button
                      key={diagnosis.code}
                      onClick={() => {
                        toggleDiagnosis(diagnosis.code);
                        setDiagnosesSearch(''); // Clear search after adding
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{diagnosis.code}</div>
                          <div className="text-sm text-gray-600">{diagnosis.description}</div>
                        </div>
                        <PlusIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                  {filteredDiagnoses.filter(diagnosis => !formData.activeDiagnoses.includes(diagnosis.code)).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No matching diagnoses found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Diagnoses */}
          {formData.activeDiagnoses.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Diagnoses:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.activeDiagnoses.map(diagnosisCode => {
                  const diagnosis = mockDiagnoses.find(d => d.code === diagnosisCode);
                  return diagnosis ? (
                    <div key={diagnosisCode} className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="font-medium text-xs text-green-800 bg-green-100 px-2 py-1 rounded whitespace-nowrap">{diagnosis.code}</span>
                        <span className="text-xs text-green-700 truncate">{diagnosis.description}</span>
                      </div>
                      <button
                        onClick={() => toggleDiagnosis(diagnosisCode)}
                        className="text-green-600 hover:text-green-800 p-0.5 hover:bg-green-100 rounded ml-2 flex-shrink-0"
                        title="Remove diagnosis"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Facilities Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-600 mr-2" />
            Facilities
          </h3>
          
          {/* Search to Add */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Search and Add Facilities:</h4>
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder="Search facilities by name or type..."
                value={facilitiesSearch}
                onChange={(e) => setFacilitiesSearch(e.target.value)}
                className="w-full"
              />
              
              {/* Search Results Overlay */}
              {facilitiesSearch && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredFacilities
                    .filter(facility => !formData.selectedFacilities.includes(facility.id))
                    .map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => {
                        toggleFacility(facility.id);
                        setFacilitiesSearch(''); // Clear search after adding
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{facility.name}</div>
                          <div className="text-sm text-gray-600">{facility.type}</div>
                        </div>
                        <PlusIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                  {filteredFacilities.filter(facility => !formData.selectedFacilities.includes(facility.id)).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No matching facilities found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Facilities */}
          {formData.selectedFacilities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Facilities:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.selectedFacilities.map(facilityId => {
                  const facility = mockFacilities.find(f => f.id === facilityId);
                  return facility ? (
                    <div key={facilityId} className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="font-medium text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded whitespace-nowrap">{facility.type}</span>
                        <span className="text-xs text-blue-700 truncate">{facility.name}</span>
                      </div>
                      <button
                        onClick={() => toggleFacility(facilityId)}
                        className="text-blue-600 hover:text-blue-800 p-0.5 hover:bg-blue-100 rounded ml-2 flex-shrink-0"
                        title="Remove facility"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Required Signatures from Providers Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 text-gray-600 mr-2" />
            Required Signatures from Providers
          </h3>
          
          {/* Search to Add */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Search and Add Providers:</h4>
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder="Search providers by name, title, or specialty..."
                value={providersSearch}
                onChange={(e) => setProvidersSearch(e.target.value)}
                className="w-full"
              />
              
              {/* Search Results Overlay */}
              {providersSearch && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProviders
                    .filter(provider => !formData.assignedProviders.some(ap => ap.providerId === provider.id))
                    .map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        toggleProvider(provider.id);
                        setProvidersSearch(''); // Clear search after adding
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.title} • {provider.specialty}</div>
                          <div className="text-xs text-gray-500">License: {provider.license}</div>
                        </div>
                        <PlusIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                  {filteredProviders.filter(provider => !formData.assignedProviders.some(ap => ap.providerId === provider.id)).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No matching providers found</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Collapsible Settings Section */}
          <div className="mb-4">
            {/* Settings Header - Clickable to expand/collapse */}
            <button
              type="button"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-1"
            >
              {isSettingsExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
              Settings
            </button>
            
            {/* Collapsible Settings Content */}
            {isSettingsExpanded && (
              <div className="space-y-3 pl-6 border-l-2 border-gray-100">
                {/* Show Person Signature */}
                <div className="flex items-center justify-between">
                  <label htmlFor="show-person-signature" className="text-sm text-gray-700 cursor-pointer">
                    Show Person Signature
                  </label>
                  <Switch
                    id="show-person-signature"
                    checked={formData.signatureOptions?.showPersonSignature || false}
                    onCheckedChange={(checked) => 
                      updateFormData({
                        signatureOptions: {
                          ...(formData.signatureOptions || {}),
                          showPersonSignature: checked
                        }
                      })
                    }
                  />
                </div>
                
                {/* Show Guardian Signature */}
                <div className="flex items-center justify-between">
                  <label htmlFor="show-guardian-signature" className="text-sm text-gray-700 cursor-pointer">
                    Show Guardian Signature
                  </label>
                  <Switch
                    id="show-guardian-signature"
                    checked={formData.signatureOptions?.showGuardianSignature || false}
                    onCheckedChange={(checked) => 
                      updateFormData({
                        signatureOptions: {
                          ...(formData.signatureOptions || {}),
                          showGuardianSignature: checked
                        }
                      })
                    }
                  />
                </div>
                
                {/* Show Outside Agency Signatures */}
                <div className="flex items-center justify-between">
                  <label htmlFor="show-outside-agency-signatures" className="text-sm text-gray-700 cursor-pointer">
                    Show Outside Agency Signature(s)
                  </label>
                  <Switch
                    id="show-outside-agency-signatures"
                    checked={formData.signatureOptions?.showOutsideAgencySignatures || false}
                    onCheckedChange={(checked) => 
                      updateFormData({
                        signatureOptions: {
                          ...(formData.signatureOptions || {}),
                          showOutsideAgencySignatures: checked
                        }
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Selected Providers */}
          {formData.assignedProviders.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Required Signatures:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.assignedProviders.map(assignedProvider => {
                  const provider = mockProviders.find(p => p.id === assignedProvider.providerId);
                  return provider ? (
                    <div key={assignedProvider.id} className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-200 rounded-md">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="font-medium text-xs text-purple-800 bg-purple-100 px-2 py-1 rounded whitespace-nowrap">{provider.title}</span>
                        <span className="text-xs text-purple-700 truncate">{provider.name}</span>
                      </div>
                      <button
                        onClick={() => toggleProvider(assignedProvider.providerId)}
                        className="text-purple-600 hover:text-purple-800 p-0.5 hover:bg-purple-100 rounded ml-2 flex-shrink-0"
                        title="Remove provider signature requirement"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default DiagnosesAndFacilitiesStep;
