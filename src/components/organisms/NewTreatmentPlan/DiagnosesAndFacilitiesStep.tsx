import React, { useState, useEffect } from 'react';
import { ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
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



const DiagnosesAndFacilitiesStep: React.FC<DiagnosesAndFacilitiesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [diagnosesSearch, setDiagnosesSearch] = useState('');

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

  // Selection handlers
  const toggleDiagnosis = (diagnosisCode: string) => {
    const updatedDiagnoses = formData.activeDiagnoses.includes(diagnosisCode)
      ? formData.activeDiagnoses.filter(code => code !== diagnosisCode)
      : [...formData.activeDiagnoses, diagnosisCode];
    
    updateFormData({ activeDiagnoses: updatedDiagnoses });
  };



  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Active Diagnoses Section - Compact */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600 mr-2" />
            Active Diagnoses
          </h3>
          
          {/* Search to Add */}
          <div className="mb-4">
            <div className="mb-3 relative">
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

          {/* Selected Diagnoses - Compact */}
          {formData.activeDiagnoses.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {formData.activeDiagnoses.map(diagnosisCode => {
                  const diagnosis = mockDiagnoses.find(d => d.code === diagnosisCode);
                  return diagnosis ? (
                    <div key={diagnosisCode} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md text-xs">
                      <span className="font-medium text-green-800">{diagnosis.code}</span>
                      <span className="text-green-700 max-w-[200px] truncate">{diagnosis.description}</span>
                      <button
                        onClick={() => toggleDiagnosis(diagnosisCode)}
                        className="text-green-600 hover:text-green-800 hover:bg-green-100 rounded p-0.5 ml-1"
                        title="Remove diagnosis"
                      >
                        <XMarkIcon className="w-3 h-3" />
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
