import React from 'react';
import PastEncountersManager, { PastEncountersManagerProps } from '@/components/organisms/PastEncountersManager';

/**
 * PastEncounters Component Props
 * @deprecated Use PastEncountersManager from organisms instead
 */
export interface PastEncountersProps extends PastEncountersManagerProps {}

/**
 * PastEncounters Component
 * 
 * @deprecated This component has been moved to organisms/PastEncountersManager.
 * This wrapper is maintained for backward compatibility.
 * Please use PastEncountersManager directly for new implementations.
 */
const PastEncounters: React.FC<PastEncountersProps> = (props) => {
  return <PastEncountersManager {...props} />;
};

export default PastEncounters; 