import React, { useState } from 'react';
import { FormStatusIcon } from '@/components/atoms/FormStatusIcon';
import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/Dialog';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface FormStatusLegendProps {
  className?: string;
}

/**
 * FormStatusLegend Component
 * 
 * Displays a legend explaining all form status icons
 * I will use atomic design principles - this is a molecular component
 */
export const FormStatusLegend: React.FC<FormStatusLegendProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    {
      status: 'complete' as const,
      label: 'Form Complete',
      description: 'Treatment plan has been completed on time'
    },
    {
      status: 'incomplete' as const,
      label: 'Form Is Incomplete',
      description: 'Treatment plan is started but not yet completed'
    },
    {
      status: 'not-created-due-soon' as const,
      label: 'Form Not Created - Due Soon',
      description: 'Treatment plan not started and due date is approaching'
    },
    {
      status: 'completed-after-due' as const,
      label: 'Form Completed After Due Date',
      description: 'Treatment plan was completed but after the due date'
    },
    {
      status: 'incomplete-overdue' as const,
      label: 'Form Still Incomplete - Overdue',
      description: 'Treatment plan is started but overdue for completion'
    },
    {
      status: 'not-created-overdue' as const,
      label: 'Form Not Created - Overdue',
      description: 'Treatment plan not started and past due date'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <QuestionMarkCircleIcon className="w-4 h-4" />
          Form Status Legend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Treatment Plan Form Status Legend</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600 mb-4">
            The following icons indicate the current status of treatment plan forms:
          </p>
          <div className="grid gap-3">
            {legendItems.map((item) => (
              <div key={item.status} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <FormStatusIcon 
                  status={item.status} 
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Provider Type Indicators</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-blue-600 flex-shrink-0">
                  P
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">Primary Provider</div>
                  <div className="text-xs text-gray-600">Main clinician responsible for the client's care</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-green-600 flex-shrink-0">
                  T
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">Care Team Member</div>
                  <div className="text-xs text-gray-600">Supporting clinician as part of the treatment team</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Treatment plans include both 14-Day Treatment Plans (required within 14 days of admission) 
              and MDTP (Multidisciplinary Treatment Plans) developed by the care team.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormStatusLegend; 