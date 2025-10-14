"use client"

import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

interface Encounter {
  id: string;
  patientName: string;
  patientId?: string;
  patientMrn?: string;
  dateOfService: string;
  treatmentTime?: string;
  provider: string;
  department: string;
  status: string;
  encounterType: string;
  hasErrors?: boolean;
  errorSeverity?: string;
  billingOverrideEnabled?: boolean;
}

interface EncounterDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  encounters: Encounter[];
  selectedEncounterId?: string;
}

export const EncounterDetailsDialog: FC<EncounterDetailsDialogProps> = ({ 
  open, 
  onClose,
  encounters,
  selectedEncounterId
}) => {
  const [activeEncounterId, setActiveEncounterId] = useState<string>(selectedEncounterId || encounters[0]?.id || '');
  
  // Auto-select the first encounter when dialog opens or encounters change
  useEffect(() => {
    if (open && encounters.length > 0) {
      // If selectedEncounterId is provided, use it; otherwise use the first encounter
      const initialId = selectedEncounterId || encounters[0].id;
      setActiveEncounterId(initialId);
    }
  }, [open, encounters, selectedEncounterId]);
  
  const activeEncounter = encounters.find(e => e.id === activeEncounterId);

  const getEncounterStatus = (encounter: Encounter) => {
    if (encounter.status === 'claim_rejected' || encounter.status === 'unauthorized') {
      return 'Closed on Error';
    }
    if (encounter.status === 'paid' || encounter.status === 'claim_accepted') {
      return 'Closed';
    }
    return 'Open';
  };

  const getBillingStatus = (encounter: Encounter) => {
    const statusMap: Record<string, string> = {
      'unauthorized': 'Unbilled',
      'ready_to_bill': 'No claims generated',
      'in_review': 'No claims generated',
      'claim_generated': 'Claims generated but not submitted',
      'claim_submitted': 'Claims generated but not submitted',
      'claim_accepted': 'Billed',
      'paid': 'Billed',
      'claim_rejected': 'Denied',
      'write_off': 'Denied'
    };
    return statusMap[encounter.status] || 'Unbilled';
  };

  const getFacilityName = (department: string) => {
    const facilityMap: Record<string, string> = {
      'Cardiology': 'Community Health Center',
      'Emergency': 'CMHC Outpatient - 1.0',
      'Neurology': 'Community Health Center',
      'Radiology': 'CMHC Outpatient - 1.0',
      'Orthopedics': 'Community Health Center',
      'Internal Medicine': 'CMHC Outpatient - 1.0',
      'Pathology': 'Community Health Center',
      'Obstetrics': 'CMHC Outpatient - 1.0',
      'Preventive Medicine': 'Community Health Center',
      'Critical Care': 'CMHC Outpatient - 1.0'
    };
    return facilityMap[department] || 'Community Health Center';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="encounter-details-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1400px] p-0 flex flex-col h-[90vh] max-h-[95vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        {/* Accessible dialog title */}
        <DialogTitle className="sr-only">Encounter Details</DialogTitle>
        <DialogDescription id="encounter-details-dialog-desc" className="sr-only">
          View and manage encounter details
        </DialogDescription>

        {/* Dialog Header */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">Encounter Details</h2>
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          {/* Left: Encounters List */}
          <div className="w-[340px] min-w-[340px] p-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="mb-3 pb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                {activeEncounter ? `${activeEncounter.patientName}'s Encounters` : 'Patient Encounters'}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{encounters.length} total</p>
            </div>
            
            {/* Scrollable encounters list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {encounters.map((encounter) => {
                const isActive = encounter.id === activeEncounterId;
                const encounterStatus = getEncounterStatus(encounter);
                
                return (
                  <button
                    key={encounter.id}
                    onClick={() => setActiveEncounterId(encounter.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm",
                      isActive 
                        ? "bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-200" 
                        : "bg-white border-gray-200 hover:border-amber-200 hover:bg-amber-50/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-600 truncate">
                          {encounter.id}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {encounter.encounterType}
                        </p>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2",
                        encounterStatus === 'Open' ? 'bg-blue-100 text-blue-700' :
                        encounterStatus === 'Closed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {encounterStatus}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Date:</span>
                        <span className="text-xs text-gray-900">
                          {new Date(encounter.dateOfService).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Provider:</span>
                        <span className="text-xs text-gray-900 truncate ml-2">{encounter.provider}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Department:</span>
                        <span className="text-xs text-gray-900 truncate ml-2">{encounter.department}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Encounter Details */}
          <div className="flex-1 min-w-0 p-6 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-y-auto">
            {activeEncounter ? (
              <div className="space-y-6">
                {/* Header with Edit Button */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {activeEncounter.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        MRN: {activeEncounter.patientId || activeEncounter.patientMrn}
                      </p>
                    </div>
                    <Button variant="outline" className="ml-4">
                      Edit Form
                    </Button>
                  </div>
                </div>

                {/* Encounter Information Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Encounter ID
                    </label>
                    <p className="text-sm text-blue-600 font-medium">{activeEncounter.id}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Encounter Type
                    </label>
                    <p className="text-sm text-gray-900">{activeEncounter.encounterType}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Treatment Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(activeEncounter.dateOfService).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Treatment Time
                    </label>
                    <p className="text-sm text-gray-900">{activeEncounter.treatmentTime || '-'}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Provider
                    </label>
                    <p className="text-sm text-gray-900">{activeEncounter.provider}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Department
                    </label>
                    <p className="text-sm text-gray-900">{activeEncounter.department}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Facility
                    </label>
                    <p className="text-sm text-gray-900">{getFacilityName(activeEncounter.department)}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Encounter Status
                    </label>
                    <p className="text-sm text-gray-900">{getEncounterStatus(activeEncounter)}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Billing Status
                    </label>
                    <p className="text-sm text-gray-900">{getBillingStatus(activeEncounter)}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                    Additional Information
                  </h4>
                  <div className="space-y-3">
                    {activeEncounter.hasErrors && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">Error Detected</p>
                          <p className="text-xs text-red-600 mt-1">
                            This encounter has {activeEncounter.errorSeverity} errors that need attention.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeEncounter.billingOverrideEnabled && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-green-800">Billing Override Enabled</p>
                          <p className="text-xs text-green-600 mt-1">
                            Special billing rules are applied to this encounter.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">No encounter selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={onClose} className="px-3 h-9 font-normal border-gray-200 text-sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
