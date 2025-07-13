import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/atoms/Card';
import { CheckCircleIcon, UserGroupIcon, CurrencyDollarIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * GroupActions Component
 * 
 * Handles bulk actions for selected patients in the appointment table
 * I will use atomic design principles for all components
 */

export interface GroupActionsData {
  status?: string;
  payer?: string;
  feePaid?: string;
  action?: 'update' | 'delete';
}

interface GroupActionsProps {
  selectedCount: number;
  selectedPatientIds: string[];
  onApplyActions: (actions: GroupActionsData) => void;
  onCancel: () => void;
  className?: string;
}

// Status options for appointments
const STATUS_OPTIONS = [
  { value: 'attended', label: 'Attended' },
  { value: 'absent', label: 'Absent' },
  { value: 'excused_absence', label: 'Excused Absence' },
  { value: 'conjoint_without_client_bill', label: 'Conjoint without client Bill' },
  { value: 'new_encounter', label: 'New Encounter' }
];

// Payer options
const PAYER_OPTIONS = [
  { value: 'person', label: 'Person' },
  { value: 'copay', label: 'CoPay' }
];

export const GroupActions: React.FC<GroupActionsProps> = ({
  selectedCount,
  selectedPatientIds,
  onApplyActions,
  onCancel,
  className = ''
}) => {
  // State for group action values
  const [status, setStatus] = useState<string>('');
  const [payer, setPayer] = useState<string>('');
  const [feePaid, setFeePaid] = useState<string>('');

  // Handle applying actions
  const handleApply = () => {
    const actions: GroupActionsData = {
      action: 'update'
    };
    
    if (status) actions.status = status;
    if (payer) actions.payer = payer;
    if (feePaid) actions.feePaid = feePaid;

    onApplyActions(actions);
    
    // Reset form after applying
    setStatus('');
    setPayer('');
    setFeePaid('');
  };

  // Handle delete action
  const handleDelete = () => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} patient${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`
    );
    
    if (confirmed) {
      onApplyActions({
        action: 'delete'
      });
    }
  };

  // Handle canceling actions
  const handleCancel = () => {
    setStatus('');
    setPayer('');
    setFeePaid('');
    onCancel();
  };

  // Check if any action is selected
  const hasActions = status || payer || feePaid;

  return (
    <Card className={`shadow-md border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader className="bg-blue-100 border-b border-blue-200 py-3">
        <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
          <UserGroupIcon className="w-4 h-4" />
          Group Actions - {selectedCount} patient{selectedCount !== 1 ? 's' : ''} selected
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payer Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Payer
            </label>
            <Select value={payer} onValueChange={setPayer}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select payer..." />
              </SelectTrigger>
              <SelectContent>
                {PAYER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fee Paid Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Fee Paid
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={feePaid}
                onChange={(e) => setFeePaid(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-blue-200">
          <div className="text-xs text-gray-600">
            Actions will be applied to all selected patients
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            
            {/* Delete Button */}
            <Button
              onClick={handleDelete}
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete Selected
            </Button>
            
            <Button
              onClick={handleApply}
              disabled={!hasActions}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Apply Actions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupActions; 