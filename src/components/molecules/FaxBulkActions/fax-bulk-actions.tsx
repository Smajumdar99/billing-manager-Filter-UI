import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/atoms/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faDownload, 
  faTrash,
  faCheck,
  faUsers,
  faEnvelopeOpen,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip';
import { IncomingFax } from '@/types/fax';

/**
 * FaxBulkActions Component
 * 
 * I will use atomic design principles for all components.
 * Handles bulk actions for selected faxes: assign to patient, download, delete
 */

export interface FaxBulkActionsData {
  action: 'assignToPatient' | 'download' | 'delete' | 'markRead' | 'markUnread';
  patientId?: string;
}

interface FaxBulkActionsProps {
  selectedCount: number;
  selectedFaxes: IncomingFax[];
  onApplyActions: (actions: FaxBulkActionsData) => void;
  onCancel: () => void;
  className?: string;
}

// Mock patient data for type-ahead selection (in real app, this would come from props or API)
const PATIENT_OPTIONS: ComboboxOption[] = [
  { value: 'patient-001', label: 'Michael Rodriguez', description: 'MRN: 789456 • DOB: 1985-03-15', type: 'staff' },
  { value: 'patient-002', label: 'Jennifer Smith', description: 'MRN: 456123 • DOB: 1992-07-22', type: 'staff' },
  { value: 'patient-003', label: 'David Wilson', description: 'MRN: 321987 • DOB: 1978-11-08', type: 'staff' },
  { value: 'patient-004', label: 'Amanda Thompson', description: 'MRN: 654321 • DOB: 1990-02-14', type: 'staff' },
  { value: 'patient-005', label: 'Robert Anderson', description: 'MRN: 147258 • DOB: 1975-09-30', type: 'staff' },
  { value: 'patient-006', label: 'Lisa Martinez', description: 'MRN: 369852 • DOB: 1988-12-05', type: 'staff' },
  { value: 'patient-007', label: 'James Parker', description: 'MRN: 852741 • DOB: 1983-06-18', type: 'staff' },
  { value: 'patient-008', label: 'Maria Garcia', description: 'MRN: 963258 • DOB: 1995-04-27', type: 'staff' },
  { value: 'patient-009', label: 'John Thompson', description: 'MRN: 741852 • DOB: 1980-10-12', type: 'staff' },
  { value: 'patient-010', label: 'Sarah Johnson', description: 'MRN: 159753 • DOB: 1987-08-03', type: 'staff' }
];

export const FaxBulkActions: React.FC<FaxBulkActionsProps> = ({
  selectedCount,
  selectedFaxes,
  onApplyActions,
  onCancel,
  className = ''
}) => {
  const [selectedPatient, setSelectedPatient] = useState<string[]>([]);

  // Handle assign to patient action
  const handleAssignToPatient = () => {
    if (selectedPatient.length === 0) {
      alert('Please select a patient to assign the faxes to.');
      return;
    }

    onApplyActions({
      action: 'assignToPatient',
      patientId: selectedPatient[0] // Get the first (and only) selected patient
    });
    
    // Reset form after applying
    setSelectedPatient([]);
  };

  // Handle bulk download action
  const handleBulkDownload = () => {
    const totalPages = selectedFaxes.reduce((sum, fax) => sum + fax.pageCount, 0);
    const confirmed = window.confirm(
      `Download ${selectedCount} fax${selectedCount !== 1 ? 'es' : ''} (${totalPages} total pages)?`
    );
    
    if (confirmed) {
      onApplyActions({
        action: 'download'
      });
    }
  };

  // Handle bulk delete action
  const handleBulkDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} fax${selectedCount !== 1 ? 'es' : ''}? This action cannot be undone.`
    );
    
    if (confirmed) {
      onApplyActions({
        action: 'delete'
      });
    }
  };

  // Handle mark as read action
  const handleMarkRead = () => {
    onApplyActions({
      action: 'markRead'
    });
  };

  // Handle mark as unread action
  const handleMarkUnread = () => {
    onApplyActions({
      action: 'markUnread'
    });
  };

  // Handle canceling actions
  const handleCancel = () => {
    setSelectedPatient([]);
    onCancel();
  };

  // Get count of unassigned faxes
  const unassignedCount = selectedFaxes.filter(fax => !fax.linkedPatient).length;

  return (
    <TooltipProvider>
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm ${className}`}>
        <div className="px-4 py-3">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Bulk Actions</span>
            </div>
            <div className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {selectedCount} selected
            </div>
            {unassignedCount > 0 && (
              <div className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                {unassignedCount} unassigned
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-white/50"
          >
            ✕
          </Button>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Patient Assignment - Compact */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Assign to:</span>
            <Combobox
              options={PATIENT_OPTIONS}
              value={selectedPatient}
              onChange={setSelectedPatient}
              placeholder="Type to search patients..."
              multiple={false}
              hideFilters={true}
              enableDirectTyping={true}
              className="flex-1 min-w-[200px]"
            />
            <Button
              onClick={handleAssignToPatient}
              disabled={selectedPatient.length === 0}
              size="sm"
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-xs font-medium"
            >
              <FontAwesomeIcon icon={faUserPlus} className="w-3 h-3 mr-1" />
              Assign
            </Button>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex items-center gap-2">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleMarkRead}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <FontAwesomeIcon icon={faEnvelopeOpen} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as Read</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleMarkUnread}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as Unread</TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleBulkDownload}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download All Selected Faxes</TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleBulkDelete}
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Selected Faxes</TooltipContent>
            </TooltipRoot>
          </div>
        </div>

        {/* Summary Stats - Ultra Compact */}
        <div className="mt-2 pt-2 border-t border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="font-medium">
                {selectedFaxes.reduce((sum, fax) => sum + fax.pageCount, 0)} pages
              </span>
              <span className="text-gray-400">•</span>
              <span>
                {selectedFaxes.filter(f => f.status === 'new').length} unread
              </span>
              <span className="text-gray-400">•</span>
              <span>
                {selectedFaxes.filter(f => f.status === 'reviewed').length} read
              </span>
              <span className="text-gray-400">•</span>
              <span>
                {selectedFaxes.filter(f => f.status === 'urgent').length} urgent
              </span>
            </div>
            <div className="text-xs text-blue-600 font-medium">
              Actions apply to all selected
            </div>
          </div>
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FaxBulkActions;
