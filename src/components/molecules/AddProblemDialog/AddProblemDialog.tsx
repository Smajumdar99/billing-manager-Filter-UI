import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Autocomplete, AutocompleteOption } from '@/components/atoms/Autocomplete/Autocomplete';
import { ExclamationTriangleIcon, CalendarIcon } from '@heroicons/react/24/outline';

/**
 * AddProblemDialog Component
 * 
 * Professional dialog for adding problems to treatment plans.
 * Based on the legacy form content provided by the user.
 * 
 * Follows Apple-style design principles with clean, intuitive UX.
 * Uses consistent dialog styling pattern.
 */

interface Problem {
  id: string;
  coding: string;
  title: string;
  details: string;
  relatedTo: string;
  beginDate: string;
  endDate: string;
  accessPrograms: string;
  occurrence: string;
  outcome: string;
  comments: string;
  provider: string;
  priority: 'High' | 'Medium' | 'Low';
}

// Predefined problems list for typeahead functionality
const PREDEFINED_PROBLEMS: AutocompleteOption[] = [
  { value: 'Connected with Community Resources', label: 'Connected with Community Resources' },
  { value: 'Effective Social Functioning', label: 'Effective Social Functioning' },
  { value: 'Fulfill-Legal Obligations', label: 'Fulfill-Legal Obligations' },
  { value: 'Improved Physical Health', label: 'Improved Physical Health' },
  { value: 'Improvement in Marriage Relationships', label: 'Improvement in Marriage Relationships' },
  { value: 'Increased Freedom from Financial Concerns', label: 'Increased Freedom from Financial Concerns' },
  { value: 'Increased Freedom from Substances', label: 'Increased Freedom from Substances' },
  { value: 'Increased Inner Peace', label: 'Increased Inner Peace' },
  { value: 'Reduced Family Stress', label: 'Reduced Family Stress' },
  { value: 'Reduced Stress', label: 'Reduced Stress' },
  { value: 'Stable Emotional/Behavioral Functioning', label: 'Stable Emotional/Behavioral Functioning' }
];

interface AddProblemDialogProps {
  open: boolean;
  onClose: () => void;
  onAddProblem: (problem: Problem) => void;
  existingProblems: Problem[];
  editingProblem?: Problem | null;
}

const AddProblemDialog: React.FC<AddProblemDialogProps> = ({
  open,
  onClose,
  onAddProblem,
  existingProblems,
  editingProblem
}) => {
  const [formData, setFormData] = useState({
    coding: '',
    title: '',
    details: '',
    relatedTo: 'Mental Health',
    beginDate: '',
    endDate: '',
    accessPrograms: '120 of 120 selected',
    occurrence: 'Unknown or N/A',
    outcome: 'Unassigned',
    comments: '',
    provider: 'Ensoftek Admin',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  // Initialize form data when editing a problem
  useEffect(() => {
    if (editingProblem) {
      setFormData({
        coding: editingProblem.coding,
        title: editingProblem.title,
        details: editingProblem.details,
        relatedTo: editingProblem.relatedTo,
        beginDate: editingProblem.beginDate,
        endDate: editingProblem.endDate,
        accessPrograms: editingProblem.accessPrograms,
        occurrence: editingProblem.occurrence,
        outcome: editingProblem.outcome,
        comments: editingProblem.comments,
        provider: editingProblem.provider,
        priority: editingProblem.priority
      });
    } else {
      // Reset form for new problem
      setFormData({
        coding: '',
        title: '',
        details: '',
        relatedTo: 'Mental Health',
        beginDate: '',
        endDate: '',
        accessPrograms: '120 of 120 selected',
        occurrence: 'Unknown or N/A',
        outcome: 'Unassigned',
        comments: '',
        provider: 'Ensoftek Admin',
        priority: 'Medium'
      });
    }
  }, [editingProblem, open]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding the problem
  const handleAddProblem = () => {
    if (!formData.coding || !formData.title) {
      return;
    }

    const newProblem: Problem = {
      id: editingProblem?.id || Date.now().toString(),
      coding: formData.coding,
      title: formData.title,
      details: formData.details,
      relatedTo: formData.relatedTo,
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      accessPrograms: formData.accessPrograms,
      occurrence: formData.occurrence,
      outcome: formData.outcome,
      comments: formData.comments,
      provider: formData.provider,
      priority: formData.priority
    };

    onAddProblem(newProblem);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Clear end date when Clear button is clicked
  const clearEndDate = () => {
    handleInputChange('endDate', '');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col bg-gradient-to-br from-orange-50 to-blue-100">
        {/* Dialog Title */}
        <div className="px-4 py-3 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
            {editingProblem ? 'Edit Problem' : 'Add Problems'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {editingProblem 
              ? 'Update the problem information and details.'
              : 'Add a new problem to the treatment plan with detailed information and tracking.'
            }
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-0 overflow-hidden p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Coding */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Coding:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="text"
                  value={formData.coding}
                  onChange={(e) => handleInputChange('coding', e.target.value)}
                  placeholder="Enter problem code"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('coding', '')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Title<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Autocomplete
                  options={PREDEFINED_PROBLEMS}
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  placeholder="Select or type a problem title..."
                  className="w-full"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-2">
                Details<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  placeholder="Enter detailed description of the problem"
                  className="resize-none"
                />
              </div>
            </div>

            {/* Related To */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Related To<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1">
                <Select value={formData.relatedTo} onValueChange={(value) => handleInputChange('relatedTo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                    <SelectItem value="Physical Health">Physical Health</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Begin Date */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Begin Date<span className="text-red-500">*</span>:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.beginDate}
                  onChange={(e) => handleInputChange('beginDate', e.target.value)}
                  className="flex-1"
                />
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                End Date:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="flex-1"
                />
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearEndDate}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Access Programs */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Access Programs:
              </label>
              <div className="flex-1">
                <Select value={formData.accessPrograms} onValueChange={(value) => handleInputChange('accessPrograms', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="120 of 120 selected">120 of 120 selected</SelectItem>
                    <SelectItem value="All Programs">All Programs</SelectItem>
                    <SelectItem value="Selected Programs">Selected Programs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Occurrence */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Occurrence:
              </label>
              <div className="flex-1">
                <Select value={formData.occurrence} onValueChange={(value) => handleInputChange('occurrence', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown or N/A">Unknown or N/A</SelectItem>
                    <SelectItem value="First Occurrence">First Occurrence</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="Chronic">Chronic</SelectItem>
                    <SelectItem value="Acute">Acute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Outcome */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Outcome:
              </label>
              <div className="flex-1">
                <Select value={formData.outcome} onValueChange={(value) => handleInputChange('outcome', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Improving">Improving</SelectItem>
                    <SelectItem value="Stable">Stable</SelectItem>
                    <SelectItem value="Worsening">Worsening</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comments */}
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-2">
                Comments:
              </label>
              <div className="flex-1">
                <Textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Additional comments or notes"
                  className="resize-none"
                />
              </div>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Provider:
              </label>
              <div className="flex-1">
                <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ensoftek Admin">Ensoftek Admin</SelectItem>
                    <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                    <SelectItem value="Lisa Rodriguez, LCSW">Lisa Rodriguez, LCSW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                Priority:
              </label>
              <div className="flex-1">
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as 'High' | 'Medium' | 'Low')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={handleCancel} className="px-3 h-9 font-normal border-gray-200 text-sm">
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleAddProblem}
            disabled={!formData.coding || !formData.title}
          >
            {editingProblem ? 'Save Changes' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblemDialog;
