import React, { useState } from 'react';
import { CalendarIcon, UserIcon, DocumentTextIcon, BuildingOfficeIcon, XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select/select';
import { Switch } from '@/components/atoms/Switch';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * PlanDetailsStep Component
 * 
 * Step 1 of the New Treatment Plan wizard.
 * Collects basic plan information including plan name, type, dates, and patient details.
 * 
 * Features:
 * - Plan name and type selection
 * - Start and end date inputs
 * - Patient selection and details
 * - Form validation
 * - Apple-style clean design
 */

interface PlanDetailsStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Mock patient data for selection
const mockPatients = [
  { id: 'P001', name: 'John Smith', livedName: 'Johnny', pronouns: 'he/him', dob: '1995-03-15' },
  { id: 'P002', name: 'Emily Davis', livedName: 'Em', pronouns: 'she/her', dob: '1988-07-22' },
  { id: 'P003', name: 'Michael Johnson', livedName: 'Mike', pronouns: 'he/him', dob: '1992-11-08' },
  { id: 'P004', name: 'Sarah Wilson', livedName: 'Sarah', pronouns: 'they/them', dob: '1985-05-30' },
  { id: 'P005', name: 'David Brown', livedName: 'Dave', pronouns: 'he/him', dob: '1990-09-12' }
];

// Mock facilities data
const mockFacilities = [
  { id: '1111ADiamond1111', name: '1111ADiamond1111 Facility', type: 'Primary Care' },
  { id: '22Best', name: '22Best Facility', type: 'Behavioral Health' },
  { id: '789', name: '789 Specialty Center', type: 'Specialty Care' },
  { id: 'A-AADO', name: 'A-AADO Treatment Center', type: 'Addiction Treatment' },
  { id: 'A-METH', name: 'A-METH Recovery Center', type: 'Substance Abuse' },
  { id: 'A-SUBX', name: 'A-SUBX Clinic', type: 'Outpatient Services' }
];

// Mock data for providers
const mockProviders = [
  { id: '1', name: 'Dr. Sarah Johnson', title: 'MD', specialty: 'Psychiatry', license: 'MD12345' },
  { id: '2', name: 'Dr. Michael Chen', title: 'PhD', specialty: 'Psychology', license: 'PH67890' },
  { id: '3', name: 'Lisa Rodriguez', title: 'LCSW', specialty: 'Social Work', license: 'SW11223' },
  { id: '4', name: 'Dr. Emily Davis', title: 'MD', specialty: 'Family Medicine', license: 'MD44556' },
  { id: '5', name: 'James Wilson', title: 'LPC', specialty: 'Counseling', license: 'PC77889' },
  { id: '6', name: 'Dr. Amanda Taylor', title: 'PharmD', specialty: 'Pharmacy', license: 'PD99001' },
];

// Mock existing plan names for typeahead
const mockExistingPlanNames = [
  'Comprehensive Mental Health Treatment Plan',
  'Substance Abuse Recovery Program',
  'Anxiety and Depression Management Plan',
  'Behavioral Therapy Treatment Plan',
  'Crisis Intervention and Stabilization Plan',
  'Dual Diagnosis Treatment Program',
  'Trauma-Informed Care Plan',
  'Adolescent Mental Health Program',
  'Family Therapy Treatment Plan',
  'Medication Management Protocol',
  'Cognitive Behavioral Therapy Plan',
  'Group Therapy Treatment Program',
];

const PlanDetailsStep: React.FC<PlanDetailsStepProps> = ({
  formData,
  updateFormData
}) => {
  const [facilitiesSearch, setFacilitiesSearch] = useState('');
  const [providersSearch, setProvidersSearch] = useState('');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [planNameSearch, setPlanNameSearch] = useState('');
  const [showPlanNameDropdown, setShowPlanNameDropdown] = useState(false);
  
  // Filter facilities based on search
  const filteredFacilities = mockFacilities.filter(facility =>
    facility.name.toLowerCase().includes(facilitiesSearch.toLowerCase()) ||
    facility.type.toLowerCase().includes(facilitiesSearch.toLowerCase())
  );
  
  // Handle input changes
  const handleInputChange = (field: keyof TreatmentPlanFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = mockPatients.find(p => p.id === patientId);
    if (selectedPatient) {
      updateFormData({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientLivedName: selectedPatient.livedName,
        patientPronouns: selectedPatient.pronouns
      });
    }
  };

  // Handle facility selection
  const toggleFacility = (facilityId: string) => {
    const updatedFacilities = formData.selectedFacilities.includes(facilityId)
      ? formData.selectedFacilities.filter(id => id !== facilityId)
      : [...formData.selectedFacilities, facilityId];

    updateFormData({ selectedFacilities: updatedFacilities });
  };

  // Filter providers based on search
  const filteredProviders = mockProviders.filter(provider =>
    provider.name.toLowerCase().includes(providersSearch.toLowerCase()) ||
    provider.title.toLowerCase().includes(providersSearch.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(providersSearch.toLowerCase())
  );

  // Filter plan names based on search
  const filteredPlanNames = mockExistingPlanNames.filter(planName =>
    planName.toLowerCase().includes(planNameSearch.toLowerCase())
  );

  // Handle plan name selection
  const handlePlanNameSelect = (selectedName: string) => {
    updateFormData({ planName: selectedName });
    setPlanNameSearch('');
    setShowPlanNameDropdown(false);
  };

  // Handle plan name input change
  const handlePlanNameChange = (value: string) => {
    updateFormData({ planName: value });
    setPlanNameSearch(value);
    setShowPlanNameDropdown(value.length > 0);
  };

  // Handle provider toggle
  const toggleProvider = (providerId: string) => {
    const provider = mockProviders.find(p => p.id === providerId);
    if (!provider) return;

    const isCurrentlyAssigned = formData.assignedProviders?.some(ap => ap.providerId === providerId);
    
    if (isCurrentlyAssigned) {
      // Remove provider
      const updatedProviders = formData.assignedProviders?.filter(ap => ap.providerId !== providerId) || [];
      updateFormData({ assignedProviders: updatedProviders });
    } else {
      // Add provider
      const newAssignedProvider = {
        id: `ap-${Date.now()}`,
        providerId: providerId,
        providerName: provider.name,
        providerTitle: provider.title,
        role: provider.specialty,
        assignedDate: new Date().toISOString().split('T')[0]
      };
      const updatedProviders = [...(formData.assignedProviders || []), newAssignedProvider];
      updateFormData({ assignedProviders: updatedProviders });
    }
  };

  // Calculate minimum end date (6 months from start date)
  const getMinEndDate = () => {
    if (!formData.startDate) return '';
    const startDate = new Date(formData.startDate);
    startDate.setMonth(startDate.getMonth() + 6);
    return startDate.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Patient Information Section - First section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">John Smith</h4>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Lived Name:</span> Johnny
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-medium">Pronouns:</span> he/him
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500 font-medium">ID:</span> <span className="text-gray-500">P001</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Layout: Single column for large and smaller, multi-column for extra large */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        {/* Plan Information Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-gray-600 mr-2" />
            Plan Details
          </h3>
          
          {/* Plan details - full width */}
          <div className="space-y-6">
            {/* Plan Name with Typeahead */}
            <div>
              <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="planName"
                  type="text"
                  value={formData.planName}
                  onChange={(e) => handlePlanNameChange(e.target.value)}
                  onFocus={() => setShowPlanNameDropdown(formData.planName.length > 0)}
                  onBlur={() => setTimeout(() => setShowPlanNameDropdown(false), 200)}
                  placeholder="Type to search existing plans or create new..."
                  className="w-full"
                  required
                />
                
                {/* Typeahead Dropdown */}
                {showPlanNameDropdown && filteredPlanNames.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPlanNames.slice(0, 8).map((planName, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlanNameSelect(planName)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{planName}</div>
                            <div className="text-xs text-gray-500">Existing plan template</div>
                          </div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredPlanNames.length === 0 && formData.planName.length > 0 && (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        <div className="font-medium text-gray-700">Create new plan: "{formData.planName}"</div>
                        <div className="text-xs mt-1">Press Enter or continue typing</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type to search existing plans or create a new treatment plan name
              </p>
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Plan Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {/* Initial Plan Card */}
                <button
                  type="button"
                  onClick={() => handleInputChange('planType', 'Initial')}
                  className={`relative p-3 rounded-md border-2 transition-all duration-200 text-left ${
                    formData.planType === 'Initial'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        formData.planType === 'Initial' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        Initial Plan
                      </h3>
                      <p className={`text-xs ${
                        formData.planType === 'Initial' ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        New treatment plan
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.planType === 'Initial'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.planType === 'Initial' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Review Plan Card */}
                <button
                  type="button"
                  onClick={() => handleInputChange('planType', 'Review')}
                  className={`relative p-3 rounded-md border-2 transition-all duration-200 text-left ${
                    formData.planType === 'Review'
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        formData.planType === 'Review' ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        Review Plan
                      </h3>
                      <p className={`text-xs ${
                        formData.planType === 'Review' ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Plan review/update
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.planType === 'Review'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.planType === 'Review' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select whether this is an initial plan or a review
              </p>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={getMinEndDate()}
                    className="w-full pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Date Last Reviewed - Only show for Review Plan */}
            {formData.planType === 'Review' && (
              <div>
                <label htmlFor="dateLastReviewed" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Last Reviewed <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="dateLastReviewed"
                    type="date"
                    value={formData.dateLastReviewed}
                    onChange={(e) => handleInputChange('dateLastReviewed', e.target.value)}
                    className="w-full pl-10"
                    required={formData.planType === 'Review'}
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Date when this treatment plan was last reviewed
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Facilities Section - Second Column */}
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
            <div className="grid grid-cols-1 gap-3">
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

        {/* Required Signatures from Providers Section - Third Column */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 text-gray-600 mr-2" />
            Signatures from Providers
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
                    .filter(provider => !formData.assignedProviders?.some(ap => ap.providerId === provider.id))
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
                  {filteredProviders.filter(provider => !formData.assignedProviders?.some(ap => ap.providerId === provider.id)).length === 0 && (
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
          {formData.assignedProviders && formData.assignedProviders.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Required Signatures:</h4>
              <div className="grid grid-cols-1 gap-3">
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

export default PlanDetailsStep;
