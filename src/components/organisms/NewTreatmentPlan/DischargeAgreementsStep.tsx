import React, { useState } from 'react';
import { DocumentCheckIcon, CalendarIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * DischargeAgreementsStep Component
 * 
 * Step 5 of the New Treatment Plan wizard.
 * Handles discharge planning and criteria definition.
 * 
 * Features:
 * - Discharge criteria definition
 * - Treatment plan review schedule
 * - Discharge planning summary
 * - Apple-style clean design
 */

interface DischargeAgreementsStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Discharge criteria options
const dischargeCriteriaOptions = [
  'Achievement of treatment goals',
  'Stabilization of symptoms',
  'Improved functional capacity',
  'Family readiness for transition',
  'Successful skill generalization',
  'Reduced support needs',
  'Medical clearance obtained',
  'Alternative placement secured'
];

// Agreement types
const agreementTypes = [
  {
    id: 'treatment_participation',
    title: 'Treatment Participation Agreement',
    description: 'Patient/family agrees to actively participate in all prescribed treatments and interventions.',
    required: true
  },
  {
    id: 'appointment_attendance',
    title: 'Appointment Attendance Agreement',
    description: 'Patient/family commits to attending scheduled appointments and providing 24-hour notice for cancellations.',
    required: true
  },
  {
    id: 'medication_compliance',
    title: 'Medication Compliance Agreement',
    description: 'Patient/family agrees to follow prescribed medication regimen and report any concerns or side effects.',
    required: false
  },
  {
    id: 'safety_protocols',
    title: 'Safety Protocols Agreement',
    description: 'Patient/family understands and agrees to follow all safety protocols and emergency procedures.',
    required: true
  },
  {
    id: 'progress_monitoring',
    title: 'Progress Monitoring Agreement',
    description: 'Patient/family agrees to participate in regular progress assessments and data collection.',
    required: true
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality Agreement',
    description: 'Patient/family understands confidentiality policies and agrees to information sharing protocols.',
    required: true
  }
];

// Review frequencies
const reviewFrequencies = [
  '30 days',
  '60 days',
  '90 days',
  '6 months',
  '12 months'
];

const DischargeAgreementsStep: React.FC<DischargeAgreementsStepProps> = ({
  formData,
  updateFormData
}) => {
  const [newCriteria, setNewCriteria] = useState('');

  // Handle discharge criteria
  const addDischargeCriteria = (criteria: string) => {
    if (criteria && !formData.dischargeCriteria.includes(criteria)) {
      updateFormData({
        dischargeCriteria: [...formData.dischargeCriteria, criteria]
      });
    }
  };

  const addCustomCriteria = () => {
    if (newCriteria.trim() && !formData.dischargeCriteria.includes(newCriteria.trim())) {
      updateFormData({
        dischargeCriteria: [...formData.dischargeCriteria, newCriteria.trim()]
      });
      setNewCriteria('');
    }
  };

  const removeDischargeCriteria = (criteria: string) => {
    const updatedCriteria = formData.dischargeCriteria.filter(c => c !== criteria);
    updateFormData({ dischargeCriteria: updatedCriteria });
  };

  // Handle agreements
  const toggleAgreement = (agreementId: string, agreed: boolean) => {
    const updatedAgreements = { ...formData.patientAgreements };
    
    if (agreed) {
      updatedAgreements[agreementId] = {
        agreed: true,
        agreedDate: new Date().toISOString(),
        agreedBy: 'Patient/Guardian' // In real app, this would be the actual name
      };
    } else {
      delete updatedAgreements[agreementId];
    }

    updateFormData({ patientAgreements: updatedAgreements });
  };

  // Handle other form fields
  const handleInputChange = (field: keyof TreatmentPlanFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  // Validation helpers
  const requiredAgreements = agreementTypes.filter(a => a.required);
  const allRequiredAgreementsAccepted = requiredAgreements.every(
    agreement => formData.patientAgreements[agreement.id]?.agreed
  );

  const isFormComplete = () => {
    return (
      formData.dischargeCriteria.length > 0 &&
      formData.reviewFrequency &&
      allRequiredAgreementsAccepted
    );
  };

  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Discharge Criteria Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentCheckIcon className="w-5 h-5 text-gray-600 mr-2" />
            Discharge Criteria
          </h3>
          
          {/* Quick Add Options */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Discharge Criteria</h4>
            <div className="flex flex-wrap gap-2">
              {dischargeCriteriaOptions.map((criteria) => (
                <button
                  key={criteria}
                  onClick={() => addDischargeCriteria(criteria)}
                  disabled={formData.dischargeCriteria.includes(criteria)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    formData.dischargeCriteria.includes(criteria)
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {formData.dischargeCriteria.includes(criteria) && (
                    <CheckIcon className="w-3 h-3 inline mr-1" />
                  )}
                  {criteria}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Criteria */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Criteria</h4>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter custom discharge criteria..."
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomCriteria();
                  }
                }}
              />
              <Button
                onClick={addCustomCriteria}
                disabled={!newCriteria.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Selected Criteria */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Discharge Criteria</h4>
            {formData.dischargeCriteria.length > 0 ? (
              <div className="space-y-2">
                {formData.dischargeCriteria.map((criteria, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{criteria}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeDischargeCriteria(criteria)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <DocumentCheckIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No discharge criteria selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Schedule Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 text-gray-600 mr-2" />
            Treatment Plan Review Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reviewFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                Review Frequency <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.reviewFrequency}
                onValueChange={(value) => handleInputChange('reviewFrequency', value)}
              >
                <option value="">Select frequency...</option>
                {reviewFrequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    Every {frequency}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <label htmlFor="nextReviewDate" className="block text-sm font-medium text-gray-700 mb-2">
                Next Review Date
              </label>
              <div className="relative">
                <Input
                  id="nextReviewDate"
                  type="date"
                  value={formData.nextReviewDate}
                  onChange={(e) => handleInputChange('nextReviewDate', e.target.value)}
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Agreements Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-600 mr-2" />
            Patient/Family Agreements
          </h3>
          
          <div className="space-y-4">
            {agreementTypes.map((agreement) => {
              const isAgreed = formData.patientAgreements[agreement.id]?.agreed || false;
              const agreementData = formData.patientAgreements[agreement.id];

              return (
                <div key={agreement.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{agreement.title}</h4>
                        {agreement.required && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                            Required
                          </Badge>
                        )}
                        {isAgreed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Agreed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{agreement.description}</p>
                      
                      {isAgreed && agreementData && (
                        <div className="text-xs text-gray-500">
                          Agreed by: {agreementData.agreedBy} on {new Date(agreementData.agreedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {!isAgreed ? (
                        <Button
                          size="sm"
                          onClick={() => toggleAgreement(agreement.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Agree
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAgreement(agreement.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Treatment Plan Completion Status</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                formData.dischargeCriteria.length > 0 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <DocumentCheckIcon className={`w-6 h-6 ${
                  formData.dischargeCriteria.length > 0 ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="text-sm font-medium text-gray-900">Discharge Criteria</div>
              <div className="text-xs text-gray-500">{formData.dischargeCriteria.length} defined</div>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                formData.reviewFrequency ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <CalendarIcon className={`w-6 h-6 ${
                  formData.reviewFrequency ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="text-sm font-medium text-gray-900">Review Schedule</div>
              <div className="text-xs text-gray-500">
                {formData.reviewFrequency ? `Every ${formData.reviewFrequency}` : 'Not set'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                allRequiredAgreementsAccepted ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <ClipboardDocumentCheckIcon className={`w-6 h-6 ${
                  allRequiredAgreementsAccepted ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="text-sm font-medium text-gray-900">Required Agreements</div>
              <div className="text-xs text-gray-500">
                {Object.keys(formData.patientAgreements).length} of {agreementTypes.length} signed
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200">
            <div className={`text-center p-3 rounded-lg ${
              isFormComplete() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className="font-medium">
                {isFormComplete() 
                  ? '✅ Treatment Plan Ready for Submission' 
                  : '⚠️ Please complete all required sections'}
              </div>
              {!isFormComplete() && (
                <div className="text-sm mt-1">
                  Missing: {[
                    formData.dischargeCriteria.length === 0 && 'Discharge Criteria',
                    !formData.reviewFrequency && 'Review Frequency',
                    !allRequiredAgreementsAccepted && 'Required Agreements'
                  ].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeAgreementsStep;
