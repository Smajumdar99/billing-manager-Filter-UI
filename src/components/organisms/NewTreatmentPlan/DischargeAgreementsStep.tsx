import React, { useState } from 'react';
import { DocumentCheckIcon, ClipboardDocumentListIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * DischargeAgreementsStep Component
 * 
 * Step 5 of the New Treatment Plan wizard.
 * Handles initial discharge planning and criteria definition.
 * 
 * Features:
 * - Initial Discharge Plan selection
 * - Initial Discharge Criteria selection
 * - Other Notable Items textarea for additional notes
 * - Custom options for both sections
 * - Apple-style clean design
 */

interface DischargeAgreementsStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Initial Discharge Plan options
const initialDischargePlanOptions = [
  'Attend 12 step recovery group',
  'Attend Aftercare/continuing care group',
  'Attend PHP and or IOP program',
  'Outpatient Therapy with attending MD or Mental Health Therapist',
  'Participate in family therapy',
  'Primary Care Physician follow up',
  'Reduction of life-threatening or endangering symptoms to within safe limits',
  'Replacement in alternative living arrangement',
  'Return to previous work or school arrangements'
];

// Initial Discharge Criteria options
const initialDischargeCriteriaOptions = [
  'Ability to meet basic life and health needs',
  'Adequate post-discharge living arrangements',
  'Improved stabilization in mood, thinking, and/or behavior',
  'Motivation to continue treatment in a less acute level of care',
  'Need for constant or close observation no longer required',
  'Return to previous living arrangements',
  'Verbal commitment to aftercare and medication compliance',
  'Verbalizes decreased cravings for drugs/ETOH',
  'Verbalizes increased insight into substance abuse issues'
];

const DischargeAgreementsStep: React.FC<DischargeAgreementsStepProps> = ({
  formData,
  updateFormData
}) => {
  const [customPlanInput, setCustomPlanInput] = useState('');
  const [customCriteriaInput, setCustomCriteriaInput] = useState('');

  // Handle Initial Discharge Plan
  const toggleDischargePlan = (plan: string) => {
    const currentPlans = formData.initialDischargePlan || [];
    const isSelected = currentPlans.includes(plan);
    
    if (isSelected) {
      updateFormData({
        initialDischargePlan: currentPlans.filter(p => p !== plan)
      });
    } else {
      updateFormData({
        initialDischargePlan: [...currentPlans, plan]
      });
    }
  };

  // Handle Initial Discharge Criteria
  const toggleDischargeCriteria = (criteria: string) => {
    const currentCriteria = formData.initialDischargeCriteria || [];
    const isSelected = currentCriteria.includes(criteria);
    
    if (isSelected) {
      updateFormData({
        initialDischargeCriteria: currentCriteria.filter(c => c !== criteria)
      });
    } else {
      updateFormData({
        initialDischargeCriteria: [...currentCriteria, criteria]
      });
    }
  };

  // Add custom discharge plan
  const addCustomPlan = () => {
    if (customPlanInput.trim() && !formData.initialDischargePlan.includes(customPlanInput.trim())) {
      updateFormData({
        initialDischargePlan: [...(formData.initialDischargePlan || []), customPlanInput.trim()]
      });
      setCustomPlanInput('');
    }
  };

  // Add custom discharge criteria
  const addCustomCriteria = () => {
    if (customCriteriaInput.trim() && !formData.initialDischargeCriteria.includes(customCriteriaInput.trim())) {
      updateFormData({
        initialDischargeCriteria: [...(formData.initialDischargeCriteria || []), customCriteriaInput.trim()]
      });
      setCustomCriteriaInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Initial Discharge Plan Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
            Initial Discharge Plan
          </h3>
          
          {/* Discharge Plan Options */}
          <div className="space-y-3">
            {initialDischargePlanOptions.map((plan) => {
              const isSelected = formData.initialDischargePlan?.includes(plan) || false;
              return (
                <label key={plan} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDischargePlan(plan)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{plan}</span>
                </label>
              );
            })}
            
            {/* Custom Plan Input */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={false}
                  readOnly
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Other:</span>
              </label>
              <div className="flex gap-2 mt-2 ml-7">
                <Input
                  type="text"
                  placeholder="Enter custom discharge plan..."
                  value={customPlanInput}
                  onChange={(e) => setCustomPlanInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={addCustomPlan}
                  disabled={!customPlanInput.trim()}
                  size="sm"
                  className="px-4"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Initial Discharge Criteria Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600 mr-2" />
            Initial Discharge Criteria
          </h3>
          
          {/* Discharge Criteria Options */}
          <div className="space-y-3">
            {initialDischargeCriteriaOptions.map((criteria) => {
              const isSelected = formData.initialDischargeCriteria?.includes(criteria) || false;
              return (
                <label key={criteria} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDischargeCriteria(criteria)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{criteria}</span>
                </label>
              );
            })}
            
            {/* Custom Criteria Input */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={false}
                  readOnly
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Other:</span>
              </label>
              <div className="flex gap-2 mt-2 ml-7">
                <Input
                  type="text"
                  placeholder="Enter custom discharge criteria..."
                  value={customCriteriaInput}
                  onChange={(e) => setCustomCriteriaInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={addCustomCriteria}
                  disabled={!customCriteriaInput.trim()}
                  size="sm"
                  className="px-4"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Notable Items Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
            Other Notable Items
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional notes, observations, or considerations for discharge planning
            </label>
            <Textarea
              value={formData.otherNotableItems || ''}
              onChange={(e) => updateFormData({ otherNotableItems: e.target.value })}
              placeholder="Enter any other notable items, special considerations, or additional information relevant to the discharge planning process..."
              rows={4}
              className="w-full"
            />
            {formData.otherNotableItems && (
              <div className="text-xs text-gray-500 mt-1">
                {formData.otherNotableItems.length} characters
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Discharge Planning Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Discharge Plans</h5>
              <div className="text-sm text-gray-600">
                {formData.initialDischargePlan?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {formData.initialDischargePlan.map((plan, index) => (
                      <li key={index}>{plan}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No discharge plans selected</p>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Discharge Criteria</h5>
              <div className="text-sm text-gray-600">
                {formData.initialDischargeCriteria?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {formData.initialDischargeCriteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No discharge criteria selected</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Notable Items Summary */}
          {formData.otherNotableItems && (
            <div className="mt-6 pt-4 border-t border-blue-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Other Notable Items</h5>
              <div className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-blue-100">
                <p className="whitespace-pre-wrap">{formData.otherNotableItems}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DischargeAgreementsStep;
