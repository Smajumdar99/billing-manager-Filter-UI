import React from 'react';
import { cn } from '@/lib/utils';

export interface FormStatusIconProps {
  status: 'complete' | 'incomplete' | 'not-created-due-soon' | 'completed-after-due' | 'incomplete-overdue' | 'not-created-overdue';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FormStatusIcon Component
 * 
 * Displays form status icons based on the current state of treatment plans
 * I will use atomic design principles for this reusable component
 */
export const FormStatusIcon: React.FC<FormStatusIconProps> = ({ 
  status, 
  className,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const getIconPath = (status: string) => {
    switch (status) {
      case 'complete':
        return '/formicons/form_complete.svg';
      case 'incomplete':
        return '/formicons/form_is_incomplete.svg';
      case 'not-created-due-soon':
        return '/formicons/form_is_notcreated-due-soon.svg';
      case 'completed-after-due':
        return '/formicons/formCompleted_after_dueDate.svg';
      case 'incomplete-overdue':
        return '/formicons/formIs_Still_incomplete_overdue.svg';
      case 'not-created-overdue':
        return '/formicons/form_not_created_overdue.svg';
      default:
        return '/formicons/form_is_incomplete.svg';
    }
  };

  const getAltText = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Form Complete';
      case 'incomplete':
        return 'Form Is Incomplete';
      case 'not-created-due-soon':
        return 'Form Not Created - Due Soon';
      case 'completed-after-due':
        return 'Form Completed After Due Date';
      case 'incomplete-overdue':
        return 'Form Still Incomplete - Overdue';
      case 'not-created-overdue':
        return 'Form Not Created - Overdue';
      default:
        return 'Form Status';
    }
  };

  return (
    <img
      src={getIconPath(status)}
      alt={getAltText(status)}
      className={cn(sizeClasses[size], className)}
      title={getAltText(status)}
    />
  );
};

export default FormStatusIcon; 