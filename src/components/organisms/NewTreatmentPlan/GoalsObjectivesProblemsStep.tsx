import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TagIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon, ClockIcon, HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import AddConditionDialog from '@/components/molecules/AddConditionDialog/AddConditionDialog';
import AddProblemDialog from '@/components/molecules/AddProblemDialog/AddProblemDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [isAddConditionDialogOpen, setIsAddConditionDialogOpen] = useState(false);
  const [editingConditionData, setEditingConditionData] = useState<any>(null);
  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false);
  const [editingProblemData, setEditingProblemData] = useState<any>(null);
  const [isActiveDiagnosesExpanded, setIsActiveDiagnosesExpanded] = useState(true);

  // Check for new conditions from mobile page on component mount/focus
  useEffect(() => {
    const checkForNewCondition = () => {
      const newConditionStr = localStorage.getItem('newCondition');
      if (newConditionStr) {
        try {
          const newCondition = JSON.parse(newConditionStr);
          addPredefinedCondition(newCondition);
          localStorage.removeItem('newCondition');
        } catch (error) {
          console.error('Error parsing new condition:', error);
        }
      }
    };

    // Check immediately
    checkForNewCondition();

    // Listen for focus events (when user returns to this page)
    window.addEventListener('focus', checkForNewCondition);
    
    return () => {
      window.removeEventListener('focus', checkForNewCondition);
    };
  }, []);

  // Handle recovery goal change
  const handleRecoveryGoalChange = (value: string) => {
    updateFormData({ recoveryGoal: value });
  };

  // Condition management
  const handleAddConditionClick = () => {
    if (isMobile) {
      // Navigate to mobile page with state (no function)
      navigate('/treatment-plan/add-condition', {
        state: {
          existingConditions: formData.conditions,
          editingCondition: null
        }
      });
    } else {
      // Open desktop dialog
      setIsAddConditionDialogOpen(true);
    }
  };

  const handleEditConditionClick = (condition: any) => {
    if (isMobile) {
      // Navigate to mobile page with state (no function)
      navigate('/treatment-plan/add-condition', {
        state: {
          existingConditions: formData.conditions,
          editingCondition: condition
        }
      });
    } else {
      // Open desktop dialog
      setEditingConditionData(condition);  
      setIsAddConditionDialogOpen(true);
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
  const addProblem = (problem: any) => {
    const existingProblemIndex = formData.problems.findIndex(p => p.id === problem.id);
    
    if (existingProblemIndex >= 0) {
      // Update existing problem
      const updatedProblems = [...formData.problems];
      updatedProblems[existingProblemIndex] = problem;
      updateFormData({ problems: updatedProblems });
    } else {
      // Add new problem
      updateFormData({
        problems: [...formData.problems, problem]
      });
    }
  };

  const deleteProblem = (id: string) => {
    const updatedProblems = formData.problems.filter(problem => problem.id !== id);
    updateFormData({ problems: updatedProblems });
  };

  const editProblem = (problem: any) => {
    setEditingProblemData(problem);
    setIsAddProblemDialogOpen(true);
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-900 flex items-center">
              <HeartIcon className="w-4 h-4 text-blue-600 mr-2" />
              Active Diagnoses
            </h3>
            <button
              onClick={() => setIsActiveDiagnosesExpanded(!isActiveDiagnosesExpanded)}
              className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>{isActiveDiagnosesExpanded ? 'Collapse' : 'Expand'}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActiveDiagnosesExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {/* Active Diagnoses Table - Collapsible */}
          {isActiveDiagnosesExpanded && (
          <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    ICD Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {activePatientDiagnoses.map((diagnosis, index) => (
                  <tr key={index} className="hover:bg-blue-25 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-blue-900">
                      {diagnosis.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-700">
                      {diagnosis.description}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {diagnosis.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {new Date(diagnosis.dateAdded).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          
          {/* Always show the explanatory text */}
          <p className="text-xs text-blue-600 mt-3 italic">
            These are the patient's current active diagnoses. Treatment goals and objectives should align with these conditions.
          </p>
        </div>
        
        {/* Recovery Goal Section - Compact */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <TagIcon className="w-4 h-4 text-gray-600 mr-2" />
            Recovery Goal/Person-Family Vision
          </h3>
          
          <div>
            <label htmlFor="recoveryGoal" className="block text-sm font-medium text-gray-700 mb-1.5">
              Describe the overall recovery goal and vision for this treatment plan
            </label>
            <textarea
              id="recoveryGoal"
              rows={4}
              value={formData.recoveryGoal}
              onChange={(e) => handleRecoveryGoalChange(e.target.value)}
              placeholder="Enter the recovery goal and person-family vision. Describe what success looks like for this treatment plan and the desired outcomes for the patient and their family..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This should be a comprehensive description of the treatment goals and expected outcomes
            </p>
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
                        onClick={handleAddConditionClick}
                        className="gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
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
                              onClick={() => handleEditConditionClick(condition)}
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
                        onClick={handleAddConditionClick}
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
        
        {/* Problems List or Empty State */}
        <div className="space-y-3">
          {formData.problems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Problems Added</h4>
              <p className="text-gray-600 mb-4">Add problems that need to be addressed in this treatment plan. Problems help identify specific areas requiring intervention.</p>
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsAddProblemDialogOpen(true)}
                      className="gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Your First Problem
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open dialog to add problems</p>
                  </TooltipContent>
                </TooltipRoot>
              </TooltipProvider>
            </div>
          ) : (
            /* Problems List */
            <>
              {formData.problems.map((problem) => (
                <div key={problem.id} className="bg-zinc-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{problem.title}</div>
                      <div className="text-sm text-gray-600">{problem.details}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>Related: {problem.relatedTo}</span>
                        <span>Outcome: {problem.outcome}</span>
                        <Badge variant="secondary" className={`${getPriorityColor(problem.priority)} ml-2`}>
                          {problem.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => editProblem(problem)}
                              className="p-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit problem</p>
                          </TooltipContent>
                        </TooltipRoot>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => deleteProblem(problem.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete problem</p>
                          </TooltipContent>
                        </TooltipRoot>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Problem Button - shown when problems exist */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsAddProblemDialogOpen(true)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Another Problem
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new problem</p>
                    </TooltipContent>
                  </TooltipRoot>
                </TooltipProvider>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Condition Dialog - Desktop Only */}
      {!isMobile && (
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
      )}

      {/* Add Problem Dialog */}
      <AddProblemDialog
        open={isAddProblemDialogOpen}
        onClose={() => {
          setIsAddProblemDialogOpen(false);
          setEditingProblemData(null);
        }}
        onAddProblem={addProblem}
        existingProblems={formData.problems}
        editingProblem={editingProblemData}
      />
      </div>
    </div>
  );
};

export default GoalsObjectivesProblemsStep;
