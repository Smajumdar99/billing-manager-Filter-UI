import React, { useState } from 'react';
import { TagIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import AddConditionDialog from '@/components/molecules/AddConditionDialog/AddConditionDialog';
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



const GoalsObjectivesProblemsStep: React.FC<GoalsObjectivesProblemsStepProps> = ({
  formData,
  updateFormData
}) => {
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDescription, setNewProblemDescription] = useState('');
  const [newProblemPriority, setNewProblemPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [isAddConditionDialogOpen, setIsAddConditionDialogOpen] = useState(false);
  const [editingConditionData, setEditingConditionData] = useState<any>(null);

  // Handle recovery goal change
  const handleRecoveryGoalChange = (value: string) => {
    updateFormData({ recoveryGoal: value });
  };

  // Condition management

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

  const deleteCondition = (id: string) => {
    const updatedConditions = formData.conditions.filter(condition => condition.id !== id);
    updateFormData({ conditions: updatedConditions });
  };

  // Defer condition - marks condition as deferred for later review
  const deferCondition = (id: string) => {
    const updatedConditions = formData.conditions.map(condition =>
      condition.id === id 
        ? { ...condition, deferred: true, deferredDate: new Date().toISOString() } 
        : condition
    );
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

  // Mock active diagnoses data - in real app this would come from patient data
  const activePatientDiagnoses = [
    { code: 'F84.0', description: 'Autistic disorder', dateAdded: '2024-01-15', status: 'Active' },
    { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type', dateAdded: '2024-01-10', status: 'Active' },
    { code: 'F80.9', description: 'Developmental disorder of speech and language, unspecified', dateAdded: '2023-12-20', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Active Diagnosis Section - Informational Only */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <HeartIcon className="w-4 h-4 text-blue-600 mr-2" />
            Active Diagnoses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activePatientDiagnoses.map((diagnosis, index) => (
              <div key={index} className="bg-white rounded-md border border-blue-200 p-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">{diagnosis.code}</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {diagnosis.status}
                  </Badge>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed mb-2">{diagnosis.description}</p>
                <p className="text-xs text-blue-600">Added: {new Date(diagnosis.dateAdded).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-blue-600 mt-3 italic">
            These are the patient's current active diagnoses. Treatment goals and objectives should align with these conditions.
          </p>
        </div>
        
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
          
          {/* Current Conditions */}
          <div className="space-y-3">
            {formData.conditions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Conditions Added</h4>
                <p className="text-gray-600 mb-4">Add medical conditions to this treatment plan using ICD codes.</p>
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsAddConditionDialogOpen(true)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Add Your First Condition
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open dialog to add medical conditions</p>
                    </TooltipContent>
                  </TooltipRoot>
                </TooltipProvider>
              </div>
            ) : (
              formData.conditions.map((condition) => (
              <div key={condition.id} className="bg-zinc-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{condition.code}</div>
                      <div className="text-sm text-gray-600">{condition.description}</div>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setEditingConditionData(condition);
                                setIsAddConditionDialogOpen(true);
                              }}
                              className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit condition</p>
                          </TooltipContent>
                        </TooltipRoot>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => deferCondition(condition.id)}
                              className="p-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <ClockIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Defer condition</p>
                          </TooltipContent>
                        </TooltipRoot>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => deleteCondition(condition.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete condition</p>
                          </TooltipContent>
                        </TooltipRoot>
                      </TooltipProvider>
                    </div>
                </div>
              </div>
              ))
            )}
            
            {/* Add Condition Button - shown when conditions exist */}
            {formData.conditions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsAddConditionDialogOpen(true)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Another Condition
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new medical condition</p>
                    </TooltipContent>
                  </TooltipRoot>
                </TooltipProvider>
              </div>
            )}
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
              <div key={problem.id} className="bg-zinc-50 rounded-lg border border-gray-200 p-4">
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

      {/* Add Condition Dialog */}
      <AddConditionDialog
        open={isAddConditionDialogOpen}
        onClose={() => {
          setIsAddConditionDialogOpen(false);
          setEditingConditionData(null);
        }}
        onAddCondition={addPredefinedCondition}
        existingConditions={formData.conditions}
        editingCondition={editingConditionData}
      />
    </div>
  );
};

export default GoalsObjectivesProblemsStep;
