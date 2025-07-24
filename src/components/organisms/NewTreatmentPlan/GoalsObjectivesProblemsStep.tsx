import React, { useState } from 'react';
import { TagIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * GoalsObjectivesProblemsStep Component
 * 
 * Step 3 of the New Treatment Plan wizard.
 * Handles recovery goals, conditions, and identified problems.
 * 
 * Features:
 * - Recovery goal/person-family vision text area
 * - Conditions management with ICD codes
 * - Problems identification with priority levels
 * - Add, edit, and delete functionality
 * - Apple-style clean design
 */

interface GoalsObjectivesProblemsStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Mock conditions data (ICD codes)
const mockConditions = [
  { code: 'ICD10:F99', description: 'Mental disorder, not otherwise specified' },
  { code: 'ICD10:F10.980', description: 'Alcohol use, unspecified with alcohol-induced anxiety disorder' },
  { code: 'ICD10:F84.0', description: 'Autistic disorder' },
  { code: 'ICD10:F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
  { code: 'ICD10:F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'ICD10:F41.1', description: 'Generalized anxiety disorder' }
];

const GoalsObjectivesProblemsStep: React.FC<GoalsObjectivesProblemsStepProps> = ({
  formData,
  updateFormData
}) => {
  const [newConditionCode, setNewConditionCode] = useState('');
  const [newConditionDescription, setNewConditionDescription] = useState('');
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDescription, setNewProblemDescription] = useState('');
  const [newProblemPriority, setNewProblemPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editingCondition, setEditingCondition] = useState<string | null>(null);
  const [editingProblem, setEditingProblem] = useState<string | null>(null);

  // Handle recovery goal change
  const handleRecoveryGoalChange = (value: string) => {
    updateFormData({ recoveryGoal: value });
  };

  // Condition management
  const addCondition = () => {
    if (newConditionCode.trim() && newConditionDescription.trim()) {
      const newCondition = {
        id: Date.now().toString(),
        code: newConditionCode.trim(),
        description: newConditionDescription.trim()
      };
      
      updateFormData({
        conditions: [...formData.conditions, newCondition]
      });
      
      setNewConditionCode('');
      setNewConditionDescription('');
    }
  };

  const addPredefinedCondition = (condition: { code: string; description: string }) => {
    const newCondition = {
      id: Date.now().toString(),
      code: condition.code,
      description: condition.description
    };
    
    updateFormData({
      conditions: [...formData.conditions, newCondition]
    });
  };

  const updateCondition = (id: string, code: string, description: string) => {
    const updatedConditions = formData.conditions.map(condition =>
      condition.id === id ? { ...condition, code, description } : condition
    );
    
    updateFormData({ conditions: updatedConditions });
    setEditingCondition(null);
  };

  const deleteCondition = (id: string) => {
    const updatedConditions = formData.conditions.filter(condition => condition.id !== id);
    updateFormData({ conditions: updatedConditions });
  };

  // Problem management
  const addProblem = () => {
    if (newProblemTitle.trim() && newProblemDescription.trim()) {
      const newProblem = {
        id: Date.now().toString(),
        title: newProblemTitle.trim(),
        description: newProblemDescription.trim(),
        priority: newProblemPriority
      };
      
      updateFormData({
        problems: [...formData.problems, newProblem]
      });
      
      setNewProblemTitle('');
      setNewProblemDescription('');
      setNewProblemPriority('Medium');
    }
  };

  const updateProblem = (id: string, title: string, description: string, priority: 'High' | 'Medium' | 'Low') => {
    const updatedProblems = formData.problems.map(problem =>
      problem.id === id ? { ...problem, title, description, priority } : problem
    );
    
    updateFormData({ problems: updatedProblems });
    setEditingProblem(null);
  };

  const deleteProblem = (id: string) => {
    const updatedProblems = formData.problems.filter(problem => problem.id !== id);
    updateFormData({ problems: updatedProblems });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
        {/* Recovery Goal Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TagIcon className="w-5 h-5 text-gray-600 mr-2" />
            Recovery Goal/Person-Family Vision
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="recoveryGoal" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the overall recovery goal and vision for this treatment plan
              </label>
              <textarea
                id="recoveryGoal"
                rows={6}
                value={formData.recoveryGoal}
                onChange={(e) => handleRecoveryGoalChange(e.target.value)}
                placeholder="Enter the recovery goal and person-family vision. Describe what success looks like for this treatment plan and the desired outcomes for the patient and their family..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This should be a comprehensive description of the treatment goals and expected outcomes
              </p>
            </div>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-600 mr-2" />
            Conditions
          </h3>
          
          {/* Add New Condition */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Condition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Input
                  type="text"
                  placeholder="ICD Code (e.g., ICD10:F99)"
                  value={newConditionCode}
                  onChange={(e) => setNewConditionCode(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Condition description"
                  value={newConditionDescription}
                  onChange={(e) => setNewConditionDescription(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={addCondition}
              disabled={!newConditionCode.trim() || !newConditionDescription.trim()}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Condition
            </Button>
          </div>

          {/* Predefined Conditions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Add Common Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {mockConditions.map((condition) => (
                <button
                  key={condition.code}
                  onClick={() => addPredefinedCondition(condition)}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  disabled={formData.conditions.some(c => c.code === condition.code)}
                >
                  {condition.code}
                </button>
              ))}
            </div>
          </div>

          {/* Current Conditions */}
          <div className="space-y-3">
            {formData.conditions.map((condition) => (
              <div key={condition.id} className="bg-white rounded-lg border border-gray-200 p-4">
                {editingCondition === condition.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        type="text"
                        defaultValue={condition.code}
                        onBlur={(e) => updateCondition(condition.id, e.target.value, condition.description)}
                      />
                      <Input
                        type="text"
                        defaultValue={condition.description}
                        onBlur={(e) => updateCondition(condition.id, condition.code, e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingCondition(null)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingCondition(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{condition.code}</div>
                      <div className="text-sm text-gray-600">{condition.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCondition(condition.id)}
                      >
                        <PencilIcon className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCondition(condition.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Problems Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-600 mr-2" />
            Problems
          </h3>
          
          {/* Add New Problem */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Problem</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    placeholder="Problem title"
                    value={newProblemTitle}
                    onChange={(e) => setNewProblemTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    value={newProblemPriority}
                    onValueChange={(value) => setNewProblemPriority(value as 'High' | 'Medium' | 'Low')}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </Select>
                </div>
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Problem description and details"
                  value={newProblemDescription}
                  onChange={(e) => setNewProblemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <Button
                onClick={addProblem}
                disabled={!newProblemTitle.trim() || !newProblemDescription.trim()}
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Problem
              </Button>
            </div>
          </div>

          {/* Current Problems */}
          <div className="space-y-3">
            {formData.problems.map((problem) => (
              <div key={problem.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{problem.title}</h4>
                      <Badge variant="secondary" className={getPriorityColor(problem.priority)}>
                        {problem.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{problem.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProblem(problem.id)}
                    >
                      <PencilIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProblem(problem.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default GoalsObjectivesProblemsStep;
