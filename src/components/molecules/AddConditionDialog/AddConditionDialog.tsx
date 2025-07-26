import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { PlusIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * AddConditionDialog Component
 * 
 * Professional dialog for adding medical conditions to treatment plans.
 * Features a two-section layout:
 * - Left: List of common conditions with ICD codes (30% width)
 * - Right: Form for condition details and customization (70% width)
 * 
 * Follows Apple-style design principles with clean, intuitive UX.
 * Uses NewTaskDialog background styling for consistency.
 */

interface Condition {
  id: string;
  code: string;
  description: string;
}

interface AddConditionDialogProps {
  open: boolean;
  onClose: () => void;
  onAddCondition: (condition: Condition) => void;
  existingConditions: Condition[];
  editingCondition?: Condition | null;
}

// Enhanced conditions list based on the screenshot provided
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

const AddConditionDialog: React.FC<AddConditionDialogProps> = ({
  open,
  onClose,
  onAddCondition,
  existingConditions,
  editingCondition
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedCondition, setSelectedCondition] = useState<typeof commonConditions[0] | null>(null);
  const [expandedObjectives, setExpandedObjectives] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    coding: '',
    title: '',
    beginDate: '',
    endDate: '',
    accessPrograms: '118 of 178 selected',
    pathogen: '',
    signsSymptoms: '',
    occurrence: 'Unknown or N/A',
    referredBy: '',
    outcome: 'Unassigned',
    comments: '',
    mdcip: '',
    reportedByClient: false,
    outsideAgency: false,
    provider: "-- Provider's --",
    // Step 2: Patient Goal & Objectives
    patientGoal: '',
    objectives: [] as Array<{
      id: string;
      text: string;
      services: Array<{
        id: string;
        name: string;
        serviceCode: string;
        provider: string;
        minutes: string;
        frequency: string;
        duration: string;
      }>;
      measures: Array<{
        id: string;
        name: string;
        initialMeasure: string;
        desiredMeasure: string;
      }>;
      interventions: string[];
    }>
  });

  // Initialize form data when editing a condition
  useEffect(() => {
    if (editingCondition) {
      setFormData(prev => ({
        ...prev,
        coding: editingCondition.code,
        title: editingCondition.description
      }));
      // Find and select the matching condition from common conditions
      const matchingCondition = commonConditions.find(c => c.code === editingCondition.code);
      if (matchingCondition) {
        setSelectedCondition(matchingCondition);
      }
    }
  }, [editingCondition]);

  // Handle condition selection from left panel
  const handleConditionSelect = (condition: typeof commonConditions[0]) => {
    setSelectedCondition(condition);
    setFormData(prev => ({
      ...prev,
      coding: condition.code,
      title: condition.description
    }));
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (currentStep === 1 && formData.coding && formData.title) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Handle objectives management
  const addObjective = () => {
    const newObjective = {
      id: Date.now().toString(),
      text: '',
      services: [],
      measures: [],
      interventions: []
    };
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, newObjective]
    }));
    // Auto-expand new objective
    setExpandedObjectives(prev => new Set([...prev, newObjective.id]));
  };

  const updateObjectiveText = (objectiveId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, text } : obj
      )
    }));
  };

  const removeObjective = (objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== objectiveId)
    }));
  };

  // Service management
  const addService = (objectiveId: string) => {
    const newService = {
      id: Date.now().toString(),
      name: '',
      serviceCode: '',
      provider: '',
      minutes: '',
      frequency: '',
      duration: ''
    };
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, services: [...obj.services, newService] }
          : obj
      )
    }));
  };

  const updateService = (objectiveId: string, serviceId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? {
              ...obj,
              services: obj.services.map(service => 
                service.id === serviceId ? { ...service, [field]: value } : service
              )
            }
          : obj
      )
    }));
  };

  const removeService = (objectiveId: string, serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, services: obj.services.filter(service => service.id !== serviceId) }
          : obj
      )
    }));
  };

  // Measure management
  const addMeasure = (objectiveId: string) => {
    const newMeasure = {
      id: Date.now().toString(),
      name: '',
      initialMeasure: '',
      desiredMeasure: ''
    };
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, measures: [...obj.measures, newMeasure] }
          : obj
      )
    }));
  };

  const updateMeasure = (objectiveId: string, measureId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? {
              ...obj,
              measures: obj.measures.map(measure => 
                measure.id === measureId ? { ...measure, [field]: value } : measure
              )
            }
          : obj
      )
    }));
  };

  const removeMeasure = (objectiveId: string, measureId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, measures: obj.measures.filter(measure => measure.id !== measureId) }
          : obj
      )
    }));
  };

  // Toggle objective expand/collapse
  const toggleObjective = (objectiveId: string) => {
    setExpandedObjectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
  };

  // Handle adding the condition
  const handleAddCondition = () => {
    if (formData.coding && formData.title) {
      const newCondition: Condition = {
        id: Date.now().toString(),
        code: formData.coding,
        description: formData.title
      };
      
      onAddCondition(newCondition);
      onClose();
      
      // Reset form
      setCurrentStep(1);
      setSelectedCondition(null);
      setFormData({
        coding: '',
        title: '',
        beginDate: '',
        endDate: '',
        accessPrograms: '118 of 178 selected',
        pathogen: '',
        signsSymptoms: '',
        occurrence: 'Unknown or N/A',
        referredBy: '',
        outcome: 'Unassigned',
        comments: '',
        mdcip: '',
        reportedByClient: false,
        outsideAgency: false,
        provider: "-- Provider's --",
        patientGoal: '',
        objectives: []
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[95vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100">
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-6 h-6 text-blue-600" />
            {editingCondition ? 'Edit Condition' : 'Add New Condition'}
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStep === 1 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'
            }`}>
              Conditions
            </span>
            <span className="text-gray-300 text-lg">→</span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStep === 2 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'
            }`}>
              Goal & Objective
            </span>
          </div>
        </DialogTitle>
        <DialogDescription>
          {currentStep === 1 
            ? (editingCondition 
                ? 'Update the condition details and modify the treatment plan as needed.'
                : 'Select a condition from the list or enter custom details to add to the treatment plan.')
            : 'Define the overall patient goal and specific objectives to achieve for this condition.'
          }
        </DialogDescription>

        {/* Step-based content rendering */}
        {currentStep === 1 ? (
          /* Step 1: Condition Details */
          <div className="flex gap-6 h-[700px]">
          {/* Left Section - Common Conditions (30% width) */}
          <div className="w-[30%] bg-white rounded-lg border border-gray-200 overflow-hidden mr-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-900">Common Conditions</h3>
              <p className="text-xs text-gray-600 mt-1">Select a condition to auto-populate the form</p>
            </div>
            
            <div className="overflow-y-auto h-full p-4 space-y-2">
              {commonConditions.map((condition) => {
                const isDisabled = existingConditions.some(c => c.code === condition.code);
                const isSelected = selectedCondition?.code === condition.code;
                
                return (
                  <button
                    key={condition.code}
                    onClick={() => !isDisabled && handleConditionSelect(condition)}
                    disabled={isDisabled}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                        : isDisabled
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className={`font-medium text-sm ${
                        isSelected ? 'text-blue-900' : isDisabled ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {condition.code}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isSelected ? 'text-blue-700' : isDisabled ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {condition.description}
                      </div>
                      {isDisabled && (
                        <div className="text-xs text-red-500 mt-1">Already added</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Section - Form (70% width) */}
          <div className="w-[70%] bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-900">Condition Details</h3>
              <p className="text-xs text-gray-600 mt-1">Complete the form to add the condition</p>
            </div>
            
            <div className="overflow-y-auto h-full p-4 space-y-4">
              {/* Primary Diagnosis Code */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="primaryDiagnosis"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="primaryDiagnosis" className="text-sm font-medium text-gray-700">
                  Primary Diagnosis Code
                </label>
              </div>

              {/* Coding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coding:</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.coding}
                    onChange={(e) => handleInputChange('coding', e.target.value)}
                    placeholder="Enter ICD code"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" className="px-3">
                    Clear
                  </Button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter condition title"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Begin Date:</label>
                  <Input
                    type="text"
                    value={formData.beginDate}
                    onChange={(e) => handleInputChange('beginDate', e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      placeholder="dd/mm/yyyy"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" className="px-3">
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* Access Programs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Programs:</label>
                <Select value={formData.accessPrograms} onValueChange={(value) => handleInputChange('accessPrograms', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="118 of 178 selected">118 of 178 selected</SelectItem>
                    <SelectItem value="All programs">All programs</SelectItem>
                    <SelectItem value="Custom selection">Custom selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pathogen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pathogen:</label>
                <Input
                  type="text"
                  value={formData.pathogen}
                  onChange={(e) => handleInputChange('pathogen', e.target.value)}
                  placeholder="Enter pathogen information"
                />
              </div>

              {/* Signs & Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signs & Symptoms:</label>
                <Textarea
                  rows={3}
                  value={formData.signsSymptoms}
                  onChange={(e) => handleInputChange('signsSymptoms', e.target.value)}
                  placeholder="Enter signs and symptoms"
                  className="resize-none"
                />
              </div>

              {/* Occurrence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occurrence:</label>
                <Select value={formData.occurrence} onValueChange={(value) => handleInputChange('occurrence', value)}>
                  <SelectTrigger>
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

              {/* Referred By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referred By:</label>
                <Input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => handleInputChange('referredBy', e.target.value)}
                  placeholder="Enter referring party"
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome:</label>
                <Select value={formData.outcome} onValueChange={(value) => handleInputChange('outcome', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Improved">Improved</SelectItem>
                    <SelectItem value="Stable">Stable</SelectItem>
                    <SelectItem value="Worsened">Worsened</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                <Textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Additional comments or notes"
                  className="resize-none"
                />
              </div>

              {/* MDCIP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MDCIP:</label>
                <Input
                  type="text"
                  value={formData.mdcip}
                  onChange={(e) => handleInputChange('mdcip', e.target.value)}
                  placeholder="MDCIP information"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reportedByClient"
                    checked={formData.reportedByClient}
                    onChange={(e) => handleInputChange('reportedByClient', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="reportedByClient" className="text-sm text-gray-700">
                    Reported by Client
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="outsideAgency"
                    checked={formData.outsideAgency}
                    onChange={(e) => handleInputChange('outsideAgency', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="outsideAgency" className="text-sm text-gray-700">
                    Outside Agency
                  </label>
                </div>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider:</label>
                <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-- Provider's --">-- Provider's --</SelectItem>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Step 2: Patient Goal & Objectives */
          <div className="h-[700px] bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-900 mb-1">Patient Goal & Objectives</h3>
              <p className="text-xs text-gray-600">Define the overall goal and specific objectives for: <span className="font-medium">{formData.title}</span></p>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              {/* Patient Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Goal (in patient's words):
                </label>
                <Textarea
                  rows={4}
                  value={formData.patientGoal}
                  onChange={(e) => handleInputChange('patientGoal', e.target.value)}
                  placeholder="Describe the overall goal as expressed by the patient (e.g., 'I want to feel less anxious when meeting new people')..."
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Write this in the patient's own words to capture their personal motivation and desired outcome.
                </p>
              </div>

              {/* Objectives Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Objectives to Reach Goal:
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addObjective}
                    className="text-xs"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" />
                    Add Objective
                  </Button>
                </div>
                
                {formData.objectives.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-2">
                      <PlusIcon className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">No objectives added yet</p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addObjective}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add First Objective
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.objectives.map((objective, index) => (
                      <div key={objective.id} className="border border-gray-200 rounded-lg bg-gray-50">
                        {/* Objective Header - Always Visible */}
                        <div className="p-4 pb-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleObjective(objective.id)}
                                  className="p-1 h-6 w-6 hover:bg-gray-200"
                                >
                                  <ChevronDownIcon 
                                    className={`w-4 h-4 transition-transform ${
                                      expandedObjectives.has(objective.id) ? 'rotate-180' : ''
                                    }`} 
                                  />
                                </Button>
                                <label className="text-sm font-medium text-gray-700">
                                  Objective {index + 1}:
                                </label>
                              </div>
                              <Textarea
                                rows={2}
                                value={objective.text}
                                onChange={(e) => updateObjectiveText(objective.id, e.target.value)}
                                placeholder="e.g., 'Practice deep breathing exercises twice daily'..."
                                className="resize-none text-sm"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeObjective(objective.id)}
                              className="text-red-600 hover:text-red-700 mt-6"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {expandedObjectives.has(objective.id) && (
                          <div className="px-4 pb-4 space-y-4">

                        {/* Services Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Services:</label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addService(objective.id)}
                              className="text-xs"
                            >
                              <PlusIcon className="w-3 h-3 mr-1" />
                              Add Service
                            </Button>
                          </div>
                          
                          {objective.services.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No services added</p>
                          ) : (
                            <div className="space-y-2">
                              {objective.services.map((service) => (
                                <div key={service.id} className="bg-white border border-gray-200 rounded p-3">
                                  <div className="grid grid-cols-7 gap-2 text-xs">
                                    <div>
                                      <label className="block text-gray-600 mb-1">Name</label>
                                       <Select 
                                         value={service.name} 
                                         onValueChange={(value) => updateService(objective.id, service.id, 'name', value)}
                                       >
                                         <SelectTrigger className="h-7 text-xs">
                                           <SelectValue placeholder="Select" />
                                         </SelectTrigger>
                                         <SelectContent className="z-50" position="popper" sideOffset={4}>
                                           <SelectItem value="Adaptive Skills Assessment">Adaptive Skills Assessment</SelectItem>
                                           <SelectItem value="Behavioral Therapy">Behavioral Therapy</SelectItem>
                                           <SelectItem value="Counseling">Counseling</SelectItem>
                                         </SelectContent>
                                       </Select>
                                    </div>
                                    <div>
                                      <label className="block text-gray-600 mb-1">Service Code</label>
                                      <Input 
                                        value={service.serviceCode}
                                        onChange={(e) => updateService(objective.id, service.id, 'serviceCode', e.target.value)}
                                        placeholder="Code"
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-600 mb-1">Provider</label>
                                      <Select 
                                        value={service.provider} 
                                        onValueChange={(value) => updateService(objective.id, service.id, 'provider', value)}
                                      >
                                        <SelectTrigger className="h-7 text-xs">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                         <SelectContent className="z-50" position="popper" sideOffset={4} alignOffset={-4}>
                                           <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                                           <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                                         </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="block text-gray-600 mb-1">Minutes</label>
                                      <Input 
                                        value={service.minutes}
                                        onChange={(e) => updateService(objective.id, service.id, 'minutes', e.target.value)}
                                        placeholder="90"
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-600 mb-1">Frequency</label>
                                      <Select 
                                        value={service.frequency} 
                                        onValueChange={(value) => updateService(objective.id, service.id, 'frequency', value)}
                                      >
                                        <SelectTrigger className="h-7 text-xs">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                         <SelectContent className="z-50" position="popper" sideOffset={4} alignOffset={-4}>
                                           <SelectItem value="Weekly">Weekly</SelectItem>
                                           <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                           <SelectItem value="Monthly">Monthly</SelectItem>
                                         </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="block text-gray-600 mb-1">Duration</label>
                                       <Input 
                                         value={service.duration}
                                         onChange={(e) => updateService(objective.id, service.id, 'duration', e.target.value)}
                                        placeholder="6 months"
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                    <div className="flex items-end">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeService(objective.id, service.id)}
                                        className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                                      >
                                        <TrashIcon className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Measures Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Measures:</label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addMeasure(objective.id)}
                              className="text-xs"
                            >
                              <PlusIcon className="w-3 h-3 mr-1" />
                              Add Measure
                            </Button>
                          </div>
                          
                          {objective.measures.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No measures added</p>
                          ) : (
                            <div className="space-y-2">
                              {objective.measures.map((measure) => (
                                <div key={measure.id} className="bg-white border border-gray-200 rounded p-3">
                                  <div className="grid grid-cols-4 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Measure Name</label>
                                      <Input 
                                        value={measure.name}
                                        onChange={(e) => updateMeasure(objective.id, measure.id, 'name', e.target.value)}
                                        placeholder="e.g., Anxiety Level"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Initial Measure</label>
                                      <Input 
                                        value={measure.initialMeasure}
                                        onChange={(e) => updateMeasure(objective.id, measure.id, 'initialMeasure', e.target.value)}
                                        placeholder="e.g., 8/10"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Desired Measure</label>
                                      <Input 
                                        value={measure.desiredMeasure}
                                        onChange={(e) => updateMeasure(objective.id, measure.id, 'desiredMeasure', e.target.value)}
                                        placeholder="e.g., 4/10"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div className="flex items-end">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeMeasure(objective.id, measure.id)}
                                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                      >
                                        <TrashIcon className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interventions Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Interventions:</label>
                          <Textarea
                            rows={2}
                            value={objective.interventions.join('\n')}
                            onChange={(e) => {
                              const interventions = e.target.value.split('\n').filter(i => i.trim());
                              setFormData(prev => ({
                                ...prev,
                                objectives: prev.objectives.map(obj => 
                                  obj.id === objective.id ? { ...obj, interventions } : obj
                                )
                              }));
                            }}
                            placeholder="Enter interventions (one per line)..."
                            className="resize-none text-sm"
                          />
                        </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Add specific, measurable objectives that will help achieve the patient's overall goal.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="py-3 px-4 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div>
              {currentStep === 2 && (
                <Button 
                  variant="ghost" 
                  onClick={handlePreviousStep}
                  className="px-4 h-9 font-normal text-sm"
                >
                  ← Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} className="px-4 h-9 font-normal text-sm">
                Cancel
              </Button>
              {currentStep === 1 ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleAddCondition}
                    disabled={!formData.coding || !formData.title}
                    className="px-4 h-9"
                  >
                    Add Condition
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleNextStep}
                    disabled={!formData.coding || !formData.title}
                    className="px-4 h-9"
                  >
                    Next: Set Goals →
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleAddCondition}
                  className="px-4 h-9"
                >
                  Add Condition
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConditionDialog;
