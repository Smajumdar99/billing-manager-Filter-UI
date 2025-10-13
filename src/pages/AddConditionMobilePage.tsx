import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';

/**
 * AddConditionMobilePage Component
 * 
 * Mobile-first page for adding medical conditions to treatment plans.
 * Replaces the dialog on mobile devices with a full-page experience.
 * Features:
 * - Mobile-optimized single-column layout
 * - Touch-friendly UI elements
 * - Simple step-by-step flow
 * - Back navigation
 */

interface Condition {
  id: string;
  code: string;
  description: string;
}

interface LocationState {
  existingConditions: Condition[];
  editingCondition?: Condition | null;
  // Remove function from state - we'll use a different approach
}

// Common conditions list - same as dialog version
const commonConditions = [
  { code: 'ICD10:R06.7', description: 'Sneezing' },
  { code: 'ICD10:F32.5', description: 'Major Depressive Disorder' },
  { code: 'ICD10:A77.9', description: 'Spotted Fever Unspecified' },
  { code: 'ICD10:R50.81', description: 'Fever Presenting With Conditions Classified Elsewhere' },
  { code: 'ICD10:F15.10', description: 'Other Stimulant Abuse Uncomplicated' },
  { code: 'ICD10:F10.980', description: 'Alcohol Use Unspecified With Alcohol-Induced Anxiety Disorder' },
  { code: 'ICD10:F99', description: 'Mental Disorder Not Otherwise Specified' },
  { code: 'ICD10:F84.0', description: 'Autistic Disorder' },
  { code: 'ICD10:F90.9', description: 'Attention-Deficit Hyperactivity Disorder, Unspecified Type' },
  { code: 'ICD10:F32.9', description: 'Major Depressive Disorder, Single Episode, Unspecified' },
  { code: 'ICD10:F41.1', description: 'Generalized Anxiety Disorder' },
  { code: 'ICD10:F43.10', description: 'Post-Traumatic Stress Disorder, Unspecified' },
  { code: 'ICD10:F31.9', description: 'Bipolar Disorder, Unspecified' },
  { code: 'ICD10:F20.9', description: 'Schizophrenia, Unspecified' },
];

const AddConditionMobilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // States
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedCondition, setSelectedCondition] = useState<typeof commonConditions[0] | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [formData, setFormData] = useState({
    coding: '',
    title: '',
    beginDate: '',
    endDate: '',
    pathogen: '',
    signsSymptoms: '',
    occurrence: 'Unknown or N/A',
  });

  // Initialize form data when editing a condition
  useEffect(() => {
    if (state?.editingCondition) {
      setFormData(prev => ({
        ...prev,
        coding: state.editingCondition!.code,
        title: state.editingCondition!.description
      }));
      setStep('details');
      setShowCustomForm(true);
    }
  }, [state?.editingCondition]);

  // Handle back navigation
  const handleBack = () => {
    if (step === 'details' && !state?.editingCondition) {
      setStep('select');
      setSelectedCondition(null);
      setShowCustomForm(false);
    } else {
      navigate(-1);
    }
  };

  // Handle condition selection
  const handleConditionSelect = (condition: typeof commonConditions[0]) => {
    setSelectedCondition(condition);
    setFormData(prev => ({
      ...prev,
      coding: condition.code,
      title: condition.description
    }));
    setStep('details');
  };

  // Handle custom condition
  const handleCustomCondition = () => {
    setShowCustomForm(true);
    setStep('details');
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding the condition
  const handleAddCondition = () => {
    if (formData.coding && formData.title) {
      const newCondition: Condition = {
        id: Date.now().toString(),
        code: formData.coding,
        description: formData.title
      };
      
      // Store the condition in localStorage temporarily
      localStorage.setItem('newCondition', JSON.stringify(newCondition));
      
      // Navigate back with a flag indicating we added a condition
      navigate(-1, { replace: true });
    }
  };

  // Check if condition already exists
  const isConditionDisabled = (condition: typeof commonConditions[0]) => {
    return state?.existingConditions?.some(c => c.code === condition.code) || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 -ml-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">
            {state?.editingCondition ? 'Edit Condition' : 'Add Condition'}
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Step Indicator */}
      {!state?.editingCondition && (
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'select' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {step === 'select' ? '1' : <CheckIcon className="w-4 h-4" />}
            </div>
            <div className={`h-0.5 w-12 ${step === 'details' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'details' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Condition</span>
            <span>Add Details</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        {step === 'select' ? (
          /* Step 1: Select Condition */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a Condition</h2>
              <p className="text-gray-600 text-sm">Select from common conditions or add custom</p>
            </div>

            {/* Common Conditions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Common Conditions</h3>
              <div className="space-y-2">
                {commonConditions.map((condition) => {
                  const isDisabled = isConditionDisabled(condition);
                  
                  return (
                    <button
                      key={condition.code}
                      onClick={() => !isDisabled && handleConditionSelect(condition)}
                      disabled={isDisabled}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isDisabled
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {condition.code}
                      </div>
                      <div className="text-sm text-gray-600">
                        {condition.description}
                      </div>
                      {isDisabled && (
                        <div className="text-xs text-red-500 mt-1">Already added</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Condition Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleCustomCondition}
                variant="outline"
                className="w-full h-12 text-left justify-start gap-3"
              >
                <PlusIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Add Custom Condition</div>
                  <div className="text-xs text-gray-500">Enter your own ICD code and description</div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Condition Details */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Condition Details</h2>
              <p className="text-gray-600 text-sm">Complete the information below</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Primary Diagnosis Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="primaryDiagnosis"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="primaryDiagnosis" className="text-sm font-medium text-blue-900">
                  Mark as Primary Diagnosis Code
                </label>
              </div>

              {/* ICD Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ICD Code <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.coding}
                  onChange={(e) => handleInputChange('coding', e.target.value)}
                  placeholder="Enter ICD code (e.g., ICD10:F32.5)"
                  className="h-12"
                  readOnly={!showCustomForm && selectedCondition !== null}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter condition description"
                  className="h-12"
                  readOnly={!showCustomForm && selectedCondition !== null}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Begin Date</label>
                  <Input
                    type="date"
                    value={formData.beginDate}
                    onChange={(e) => handleInputChange('beginDate', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Pathogen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pathogen</label>
                <Input
                  type="text"
                  value={formData.pathogen}
                  onChange={(e) => handleInputChange('pathogen', e.target.value)}
                  placeholder="Enter pathogen information"
                  className="h-12"
                />
              </div>

              {/* Signs & Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signs & Symptoms</label>
                <Textarea
                  rows={4}
                  value={formData.signsSymptoms}
                  onChange={(e) => handleInputChange('signsSymptoms', e.target.value)}
                  placeholder="Describe signs and symptoms..."
                  className="resize-none"
                />
              </div>

              {/* Occurrence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occurrence</label>
                <Select value={formData.occurrence} onValueChange={(value) => handleInputChange('occurrence', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown or N/A">Unknown or N/A</SelectItem>
                    <SelectItem value="First occurrence">First occurrence</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="Chronic">Chronic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {step === 'details' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={handleAddCondition}
            disabled={!formData.coding || !formData.title}
            className="w-full h-12 rounded-full"
          >
            {state?.editingCondition ? 'Update Condition' : 'Add Condition'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddConditionMobilePage;
