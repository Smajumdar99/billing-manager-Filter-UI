import { useState } from 'react';

// Mock treatment plan interface (should match your actual interface)
interface TreatmentPlan {
  id: string;
  planNumber: string;
  patientName: string;
  endDate?: string;
  isActive: boolean;
  isCompleted: boolean;
  // ... other properties
}

/**
 * Custom hook to check for ongoing treatment plans before creating a new one
 * This provides a reusable way to implement the business rule that only one
 * plan per program should be active at a time
 */
export const useOngoingPlanCheck = () => {
  const [showOngoingPlanWarning, setShowOngoingPlanWarning] = useState(false);
  const [ongoingPlans, setOngoingPlans] = useState<TreatmentPlan[]>([]);

  // Check for ongoing plans (plans without end dates that are active and not completed)
  const checkForOngoingPlans = (treatmentPlans: TreatmentPlan[]) => {
    const ongoing = treatmentPlans.filter(plan => 
      !plan.endDate && plan.isActive && !plan.isCompleted
    );
    return ongoing;
  };

  // Handle new plan creation with ongoing plan check
  const handleNewPlanWithCheck = (
    treatmentPlans: TreatmentPlan[],
    onProceed: () => void
  ) => {
    const ongoing = checkForOngoingPlans(treatmentPlans);
    
    if (ongoing.length > 0) {
      setOngoingPlans(ongoing);
      setShowOngoingPlanWarning(true);
      
      // Return a promise that resolves when user makes a decision
      return new Promise<boolean>((resolve) => {
        // Store the resolve function for later use
        (window as any).__ongoingPlanResolve = resolve;
        (window as any).__ongoingPlanProceed = onProceed;
      });
    } else {
      // No ongoing plans, proceed directly
      onProceed();
      return Promise.resolve(true);
    }
  };

  // Handle confirmation to proceed with new plan despite ongoing plans
  const handleConfirmNewPlan = () => {
    setShowOngoingPlanWarning(false);
    const proceed = (window as any).__ongoingPlanProceed;
    const resolve = (window as any).__ongoingPlanResolve;
    
    if (proceed) proceed();
    if (resolve) resolve(true);
    
    // Clean up
    delete (window as any).__ongoingPlanProceed;
    delete (window as any).__ongoingPlanResolve;
  };

  // Handle cancellation of new plan creation
  const handleCancelNewPlan = () => {
    setShowOngoingPlanWarning(false);
    setOngoingPlans([]);
    
    const resolve = (window as any).__ongoingPlanResolve;
    if (resolve) resolve(false);
    
    // Clean up
    delete (window as any).__ongoingPlanProceed;
    delete (window as any).__ongoingPlanResolve;
  };

  return {
    showOngoingPlanWarning,
    ongoingPlans,
    handleNewPlanWithCheck,
    handleConfirmNewPlan,
    handleCancelNewPlan,
    checkForOngoingPlans
  };
};
