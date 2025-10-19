"use client"

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';

interface ClaimSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (submissionDate: string) => void;
  selectedEncounters?: any[];
}

export const ClaimSubmissionDialog: FC<ClaimSubmissionDialogProps> = ({ 
  open, 
  onClose,
  onSubmit
}) => {
  // Initialize with current date and time
  const now = new Date();
  const defaultDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const [submissionDate, setSubmissionDate] = useState(defaultDateTime);

  const handleSubmit = () => {
    onSubmit(submissionDate);
    onClose();
  };

  const formatDisplayDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="claim-submission-dialog-desc"
        className="max-w-[500px] w-full bg-gradient-to-br from-orange-50 to-blue-100 p-0 pt-12"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Claim Submission</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="claim-submission-dialog-desc" className="sr-only">
          Set the date and time when the claim will be posted
        </DialogDescription>
        
        {/* Main Content */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Claim Submission</h2>
            
            {/* Description */}
            <p className="text-gray-700 mb-6">
              This is the date the claim will be posted for.
            </p>
            
            {/* Date Input */}
            <div className="space-y-2">
              <label htmlFor="submission-date" className="block text-base font-medium text-gray-700">
                Claim Submission Date:
              </label>
              <input
                id="submission-date"
                type="datetime-local"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
              <p className="text-sm text-gray-500 mt-1">
                Selected: {formatDisplayDate(submissionDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-4 px-6 bg-white/50 border-t border-gray-200">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button 
              variant="default" 
              onClick={handleSubmit}
              className="min-w-[120px] text-base py-2.5"
            >
              Submit
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="min-w-[120px] text-base py-2.5"
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
