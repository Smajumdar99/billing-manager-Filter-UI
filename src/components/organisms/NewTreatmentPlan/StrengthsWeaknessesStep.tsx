import React, { useState } from 'react';
import { HeartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * StrengthsWeaknessesStep Component
 * 
 * Enhanced UX for adding patient strengths and weaknesses.
 * Mobile-friendly, intuitive interface with quick-add functionality.
 * 
 * Features:
 * - Simple, one-click strength/weakness addition
 * - Mobile-first responsive design
 * - Predefined common options for quick selection
 * - Clean empty states with clear guidance
 * - Easy editing and management
 * - Apple-style clean design
 */

interface StrengthsWeaknessesStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Common strengths for quick selection
const commonStrengths = [
  'Good communication skills',
  'Strong family support',
  'Motivated to change',
  'Good problem-solving abilities',
  'Physically healthy',
  'Emotionally stable',
  'Good social skills',
  'Creative and artistic',
  'Good memory',
  'Responsible and reliable',
  'Positive attitude',
  'Good academic performance'
];

// Common weaknesses for quick selection
const commonWeaknesses = [
  'Difficulty with communication',
  'Limited social support',
  'Anxiety or depression',
  'Substance use issues',
  'Financial difficulties',
  'Housing instability',
  'Transportation barriers',
  'Health problems',
  'Learning difficulties',
  'Behavioral challenges',
  'Family conflicts',
  'Low self-esteem'
];



const StrengthsWeaknessesStep: React.FC<StrengthsWeaknessesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [customStrength, setCustomStrength] = useState('');
  const [customWeakness, setCustomWeakness] = useState('');

  // Quick add strength from predefined list
  const addQuickStrength = (strengthText: string) => {
    const newStrength = {
      id: Date.now().toString(),
      title: strengthText,
      description: '',
      category: 'Personal'
    };

    updateFormData({
      strengths: [...(formData.strengths || []), newStrength]
    });
  };

  // Add custom strength
  const addCustomStrength = () => {
    if (!customStrength.trim()) return;

    const newStrength = {
      id: Date.now().toString(),
      title: customStrength,
      description: '',
      category: 'Personal'
    };

    updateFormData({
      strengths: [...(formData.strengths || []), newStrength]
    });

    setCustomStrength('');
  };

  // Quick add weakness from predefined list
  const addQuickWeakness = (weaknessText: string) => {
    const newWeakness = {
      id: Date.now().toString(),
      title: weaknessText,
      description: '',
      category: 'Personal',
      impactLevel: 'Medium' as const
    };

    updateFormData({
      weaknesses: [...(formData.weaknesses || []), newWeakness]
    });
  };

  // Add custom weakness
  const addCustomWeakness = () => {
    if (!customWeakness.trim()) return;

    const newWeakness = {
      id: Date.now().toString(),
      title: customWeakness,
      description: '',
      category: 'Personal',
      impactLevel: 'Medium' as const
    };

    updateFormData({
      weaknesses: [...(formData.weaknesses || []), newWeakness]
    });

    setCustomWeakness('');
  };





  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Strengths Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <HeartIcon className="w-5 h-5 text-green-600 mr-2" />
              Patient Strengths
            </h3>
          </div>
          
          {/* Quick Add Strengths */}
          {(formData.strengths || []).length === 0 ? (
            <div className="text-center py-8">
              <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-sm font-medium text-gray-900 mb-2">No strengths added yet</h4>
              <p className="text-sm text-gray-500 mb-4">Add patient strengths to help guide treatment planning</p>
            </div>
          ) : null}
          
          {/* All Strengths - One Click Add */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Select Strengths (click to add)
                {(formData.strengths || []).length > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-normal">({(formData.strengths || []).length} selected)</span>
                )}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    // Add all common strengths that aren't already added
                    const currentTitles = (formData.strengths || []).map(s => s.title);
                    const newStrengths = commonStrengths
                      .filter(strength => !currentTitles.includes(strength))
                      .map(strength => ({
                        id: Date.now().toString() + Math.random(),
                        title: strength,
                        description: '',
                        category: 'Personal'
                      }));
                    
                    if (newStrengths.length > 0) {
                      updateFormData({ strengths: [...(formData.strengths || []), ...newStrengths] });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Select All
                </button>
                {(formData.strengths || []).length > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => updateFormData({ strengths: [] })}
                      className="text-red-600 hover:text-red-800 underline transition-colors"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Predefined common strengths */}
              {commonStrengths.map((strength) => {
                const isAdded = (formData.strengths || []).some(s => s.title === strength);
                return (
                  <button
                    key={strength}
                    onClick={() => {
                      if (isAdded) {
                        // Remove if already added
                        const updated = (formData.strengths || []).filter(s => s.title !== strength);
                        updateFormData({ strengths: updated });
                      } else {
                        // Add if not present
                        addQuickStrength(strength);
                      }
                    }}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isAdded 
                        ? 'text-green-800 bg-green-100 border border-green-300 hover:bg-green-200' 
                        : 'text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isAdded ? '✓ ' : '+ '}{strength}
                  </button>
                );
              })}
              
              {/* Custom strengths that were added */}
              {(formData.strengths || []).filter(s => !commonStrengths.includes(s.title)).map((strength) => (
                <button
                  key={strength.id}
                  onClick={() => {
                    // Remove custom strength
                    const updated = (formData.strengths || []).filter(s => s.id !== strength.id);
                    updateFormData({ strengths: updated });
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors text-green-800 bg-green-100 border border-green-300 hover:bg-green-200"
                >
                  ✓ {strength.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Custom Input - Inline */}
          <div className="mb-4">
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Add custom strength..."
                value={customStrength}
                onChange={(e) => setCustomStrength(e.target.value)}
                className="flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customStrength.trim()) {
                    addCustomStrength();
                  }
                }}
              />
              {customStrength.trim() && (
                <Button
                  onClick={addCustomStrength}
                  size="sm"
                  className="px-3"
                >
                  Add
                </Button>
              )}
            </div>
          </div>


        </div>

        {/* Weaknesses Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-2" />
              Weaknesses & Barriers
            </h3>
          </div>
          
          {/* Quick Add Weaknesses */}
          {(formData.weaknesses || []).length === 0 ? (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-sm font-medium text-gray-900 mb-2">No weaknesses added yet</h4>
              <p className="text-sm text-gray-500 mb-4">Identify barriers and challenges to address in treatment</p>
            </div>
          ) : null}
          
          {/* All Weaknesses - One Click Add */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Select Barriers (click to add)
                {(formData.weaknesses || []).length > 0 && (
                  <span className="ml-2 text-xs text-orange-600 font-normal">({(formData.weaknesses || []).length} selected)</span>
                )}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    // Add all common weaknesses that aren't already added
                    const currentTitles = (formData.weaknesses || []).map(w => w.title);
                    const newWeaknesses = commonWeaknesses
                      .filter(weakness => !currentTitles.includes(weakness))
                      .map(weakness => ({
                        id: Date.now().toString() + Math.random(),
                        title: weakness,
                        description: '',
                        category: 'Personal',
                        impactLevel: 'Medium' as const
                      }));
                    
                    if (newWeaknesses.length > 0) {
                      updateFormData({ weaknesses: [...(formData.weaknesses || []), ...newWeaknesses] });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Select All
                </button>
                {(formData.weaknesses || []).length > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => updateFormData({ weaknesses: [] })}
                      className="text-red-600 hover:text-red-800 underline transition-colors"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Predefined common weaknesses */}
              {commonWeaknesses.map((weakness) => {
                const isAdded = (formData.weaknesses || []).some(w => w.title === weakness);
                return (
                  <button
                    key={weakness}
                    onClick={() => {
                      if (isAdded) {
                        // Remove if already added
                        const updated = (formData.weaknesses || []).filter(w => w.title !== weakness);
                        updateFormData({ weaknesses: updated });
                      } else {
                        // Add if not present
                        addQuickWeakness(weakness);
                      }
                    }}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isAdded 
                        ? 'text-orange-800 bg-orange-100 border border-orange-300 hover:bg-orange-200' 
                        : 'text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isAdded ? '✓ ' : '+ '}{weakness}
                  </button>
                );
              })}
              
              {/* Custom weaknesses that were added */}
              {(formData.weaknesses || []).filter(w => !commonWeaknesses.includes(w.title)).map((weakness) => (
                <button
                  key={weakness.id}
                  onClick={() => {
                    // Remove custom weakness
                    const updated = (formData.weaknesses || []).filter(w => w.id !== weakness.id);
                    updateFormData({ weaknesses: updated });
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors text-orange-800 bg-orange-100 border border-orange-300 hover:bg-orange-200"
                >
                  ✓ {weakness.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Custom Input - Inline */}
          <div className="mb-4">
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Add custom barrier..."
                value={customWeakness}
                onChange={(e) => setCustomWeakness(e.target.value)}
                className="flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customWeakness.trim()) {
                    addCustomWeakness();
                  }
                }}
              />
              {customWeakness.trim() && (
                <Button
                  onClick={addCustomWeakness}
                  size="sm"
                  className="px-3"
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Notes Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Plan Notes</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes, observations, or treatment considerations
              </label>
              <Textarea
                value={formData.planNotes || ''}
                onChange={(e) => updateFormData({ planNotes: e.target.value })}
                placeholder="Enter any additional notes about the patient's strengths, weaknesses, or treatment considerations..."
                rows={4}
                className="w-full"
              />
            </div>
            
            {formData.planNotes && (
              <div className="text-xs text-gray-500">
                {formData.planNotes.length} characters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknessesStep;
