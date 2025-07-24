import React, { useState } from 'react';
import { HeartIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * StrengthsWeaknessesStep Component
 * 
 * Step 5 of the New Treatment Plan wizard.
 * Handles patient strengths and weaknesses assessment.
 * 
 * Features:
 * - Strengths identification with categories
 * - Weaknesses/barriers documentation
 * - Impact level assessment
 * - Add, edit, and delete functionality
 * - Apple-style clean design
 */

interface StrengthsWeaknessesStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Strength categories
const strengthCategories = [
  'Cognitive',
  'Social',
  'Emotional',
  'Physical',
  'Communication',
  'Academic',
  'Behavioral',
  'Family Support',
  'Personal',
  'Other'
];

// Weakness/barrier categories
const weaknessCategories = [
  'Cognitive',
  'Social',
  'Emotional',
  'Physical',
  'Communication',
  'Academic',
  'Behavioral',
  'Environmental',
  'Family',
  'Other'
];

// Impact levels
const impactLevels = ['Low', 'Medium', 'High'] as const;

const StrengthsWeaknessesStep: React.FC<StrengthsWeaknessesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [newStrengthTitle, setNewStrengthTitle] = useState('');
  const [newStrengthDescription, setNewStrengthDescription] = useState('');
  const [newStrengthCategory, setNewStrengthCategory] = useState('');
  
  const [newWeaknessTitle, setNewWeaknessTitle] = useState('');
  const [newWeaknessDescription, setNewWeaknessDescription] = useState('');
  const [newWeaknessCategory, setNewWeaknessCategory] = useState('');
  const [newWeaknessImpact, setNewWeaknessImpact] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  const [editingStrength, setEditingStrength] = useState<string | null>(null);
  const [editingWeakness, setEditingWeakness] = useState<string | null>(null);

  // Strength management
  const addStrength = () => {
    if (newStrengthTitle.trim() && newStrengthDescription.trim() && newStrengthCategory) {
      const newStrength = {
        id: Date.now().toString(),
        title: newStrengthTitle.trim(),
        description: newStrengthDescription.trim(),
        category: newStrengthCategory
      };
      
      updateFormData({
        strengths: [...formData.strengths, newStrength]
      });
      
      setNewStrengthTitle('');
      setNewStrengthDescription('');
      setNewStrengthCategory('');
    }
  };

  const updateStrength = (id: string, title: string, description: string, category: string) => {
    const updatedStrengths = formData.strengths.map(strength =>
      strength.id === id ? { ...strength, title, description, category } : strength
    );
    
    updateFormData({ strengths: updatedStrengths });
    setEditingStrength(null);
  };

  const deleteStrength = (id: string) => {
    const updatedStrengths = formData.strengths.filter(strength => strength.id !== id);
    updateFormData({ strengths: updatedStrengths });
  };

  // Weakness management
  const addWeakness = () => {
    if (newWeaknessTitle.trim() && newWeaknessDescription.trim() && newWeaknessCategory) {
      const newWeakness = {
        id: Date.now().toString(),
        title: newWeaknessTitle.trim(),
        description: newWeaknessDescription.trim(),
        category: newWeaknessCategory,
        impactLevel: newWeaknessImpact
      };
      
      updateFormData({
        weaknesses: [...formData.weaknesses, newWeakness]
      });
      
      setNewWeaknessTitle('');
      setNewWeaknessDescription('');
      setNewWeaknessCategory('');
      setNewWeaknessImpact('Medium');
    }
  };

  const updateWeakness = (id: string, title: string, description: string, category: string, impactLevel: 'Low' | 'Medium' | 'High') => {
    const updatedWeaknesses = formData.weaknesses.map(weakness =>
      weakness.id === id ? { ...weakness, title, description, category, impactLevel } : weakness
    );
    
    updateFormData({ weaknesses: updatedWeaknesses });
    setEditingWeakness(null);
  };

  const deleteWeakness = (id: string) => {
    const updatedWeaknesses = formData.weaknesses.filter(weakness => weakness.id !== id);
    updateFormData({ weaknesses: updatedWeaknesses });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Cognitive': 'bg-blue-100 text-blue-800',
      'Social': 'bg-green-100 text-green-800',
      'Emotional': 'bg-purple-100 text-purple-800',
      'Physical': 'bg-red-100 text-red-800',
      'Communication': 'bg-yellow-100 text-yellow-800',
      'Academic': 'bg-indigo-100 text-indigo-800',
      'Behavioral': 'bg-pink-100 text-pink-800',
      'Family Support': 'bg-teal-100 text-teal-800',
      'Environmental': 'bg-orange-100 text-orange-800',
      'Personal': 'bg-cyan-100 text-cyan-800',
      'Family': 'bg-teal-100 text-teal-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Strengths Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HeartIcon className="w-5 h-5 text-gray-600 mr-2" />
            Patient Strengths
          </h3>
          
          {/* Add New Strength */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Strength</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Strength title"
                    value={newStrengthTitle}
                    onChange={(e) => setNewStrengthTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    value={newStrengthCategory}
                    onValueChange={setNewStrengthCategory}
                  >
                    <option value="">Select category...</option>
                    {strengthCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Describe this strength and how it can be leveraged in treatment..."
                  value={newStrengthDescription}
                  onChange={(e) => setNewStrengthDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <Button
                onClick={addStrength}
                disabled={!newStrengthTitle.trim() || !newStrengthDescription.trim() || !newStrengthCategory}
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Strength
              </Button>
            </div>
          </div>

          {/* Current Strengths */}
          <div className="space-y-3">
            {formData.strengths.map((strength) => (
              <div key={strength.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{strength.title}</h4>
                      <Badge variant="secondary" className={getCategoryColor(strength.category)}>
                        {strength.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{strength.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingStrength(strength.id)}
                    >
                      <PencilIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteStrength(strength.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.strengths.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <HeartIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No strengths identified yet</p>
            </div>
          )}
        </div>

        {/* Weaknesses Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-600 mr-2" />
            Weaknesses & Barriers
          </h3>
          
          {/* Add New Weakness */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Weakness/Barrier</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Weakness title"
                    value={newWeaknessTitle}
                    onChange={(e) => setNewWeaknessTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    value={newWeaknessCategory}
                    onValueChange={setNewWeaknessCategory}
                  >
                    <option value="">Select category...</option>
                    {weaknessCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Select
                    value={newWeaknessImpact}
                    onValueChange={(value) => setNewWeaknessImpact(value as 'Low' | 'Medium' | 'High')}
                  >
                    {impactLevels.map((level) => (
                      <option key={level} value={level}>
                        {level} Impact
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Describe this weakness or barrier and how it impacts treatment..."
                  value={newWeaknessDescription}
                  onChange={(e) => setNewWeaknessDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <Button
                onClick={addWeakness}
                disabled={!newWeaknessTitle.trim() || !newWeaknessDescription.trim() || !newWeaknessCategory}
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Weakness
              </Button>
            </div>
          </div>

          {/* Current Weaknesses */}
          <div className="space-y-3">
            {formData.weaknesses.map((weakness) => (
              <div key={weakness.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{weakness.title}</h4>
                      <Badge variant="secondary" className={getCategoryColor(weakness.category)}>
                        {weakness.category}
                      </Badge>
                      <Badge variant="secondary" className={getImpactColor(weakness.impactLevel)}>
                        {weakness.impactLevel} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{weakness.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingWeakness(weakness.id)}
                    >
                      <PencilIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteWeakness(weakness.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.weaknesses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No weaknesses or barriers identified yet</p>
            </div>
          )}
        </div>

        {/* Analysis Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Assessment Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Summary */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Strengths by Category</h5>
              <div className="space-y-2">
                {strengthCategories.map(category => {
                  const count = formData.strengths.filter(s => s.category === category).length;
                  return count > 0 ? (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{category}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {count}
                      </Badge>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Weaknesses Summary */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Barriers by Impact Level</h5>
              <div className="space-y-2">
                {impactLevels.map(level => {
                  const count = formData.weaknesses.filter(w => w.impactLevel === level).length;
                  return (
                    <div key={level} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{level} Impact</span>
                      <Badge variant="secondary" className={getImpactColor(level)}>
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-sm text-blue-800 space-y-1">
              <div>
                <strong>Total Strengths:</strong> {formData.strengths.length}
              </div>
              <div>
                <strong>Total Barriers:</strong> {formData.weaknesses.length}
              </div>
              <div>
                <strong>High Impact Barriers:</strong> {formData.weaknesses.filter(w => w.impactLevel === 'High').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknessesStep;
