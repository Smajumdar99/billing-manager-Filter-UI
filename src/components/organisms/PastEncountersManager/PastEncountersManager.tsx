import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { EncountersTable } from '@/components/organisms/EncountersTable';

// Types and Interfaces
export interface EncounterStats {
  total: number;
  thisMonth: number;
  lastVisit: string;
  providers: number;
}

export interface PastEncountersManagerProps {
  /** CSS class name for styling */
  className?: string;
  /** Patient ID to filter encounters for specific patient */
  patientId?: string;
  /** Patient name for display purposes */
  patientName?: string;
  /** Callback when new encounter is requested */
  onNewEncounter?: () => void;
  /** Callback when an encounter is selected */
  onEncounterSelect?: (encounterId: string) => void;
  /** Callback to provide encounter stats to parent */
  onStatsChange?: (stats: EncounterStats) => void;
}

/**
 * PastEncountersManager Component
 * 
 * A simplified organism component that renders the EncountersTable component.
 * All search and filtering functionality is handled by the EncountersTable itself.
 * Stats are provided to parent via callback for flexible positioning.
 */
const PastEncountersManager: React.FC<PastEncountersManagerProps> = ({
  className,
  patientId,
  patientName = 'Current Patient',
  onNewEncounter,
  onEncounterSelect,
  onStatsChange
}) => {
  // Mock encounter statistics - in real app, this would come from an API
  const encounterStats: EncounterStats = useMemo(() => {
    const stats = {
      total: 24,
      thisMonth: 3,
      lastVisit: 'Nov 1, 2024',
      providers: 2
    };
    
    // Notify parent of stats changes
    onStatsChange?.(stats);
    
    return stats;
  }, [patientId, onStatsChange]);

  return (
    <div className={cn("bg-gray-50/30 min-h-screen", className)}>
      {/* Encounters Table - All search and filtering handled here */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          <EncountersTable 
            patientId={patientId}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Export hook for getting encounter stats
export const useEncounterStats = (patientId?: string): EncounterStats => {
  return useMemo(() => ({
    total: 24,
    thisMonth: 3,
    lastVisit: 'Nov 1, 2024',
    providers: 2
  }), [patientId]);
};

export default PastEncountersManager; 