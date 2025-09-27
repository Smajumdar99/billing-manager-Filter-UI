import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { ClockIcon, UserPlusIcon } from '@heroicons/react/24/outline';

// Props for WaitlistDialog
interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistPatients: any[];
  onAddPatientToEvent: (patientId: string) => void;
  groupCapacity: number;
  currentPatientCount: number;
}

/**
 * WaitlistDialog - Professional nested dialog for viewing and managing waitlist patients.
 * Follows the same design pattern as AddConditionDialog with Apple-style elegance.
 * Features comprehensive patient information and action capabilities.
 */
const WaitlistDialog: React.FC<WaitlistDialogProps> = ({
  open,
  onOpenChange,
  waitlistPatients,
  onAddPatientToEvent,
  groupCapacity,
  currentPatientCount,
}) => {
  // Memoize waitlist patient row data for DataTable
  const waitlistRowData = React.useMemo(() => 
    waitlistPatients.map(patient => ({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      ss: patient.ss,
      dob: patient.dob,
      pid: patient.pid,
      externalId: patient.externalId,
      waitlistDate: patient.waitlistDate || '2024-08-15',
      priority: patient.priority || 'Standard',
      reason: patient.reason || 'Group capacity reached'
    })), [waitlistPatients]);

  // Handler to add patient from waitlist to event
  const handleAddToEvent = React.useCallback((patientId: string) => {
    if (currentPatientCount >= groupCapacity) {
      // Show capacity error - could be enhanced with toast notification
      return;
    }
    onAddPatientToEvent(patientId);
    // Keep dialog open so user can add more patients if capacity allows
  }, [currentPatientCount, groupCapacity, onAddPatientToEvent]);

  // AG Grid column definitions for waitlist patients
  const columnDefs: ColDef[] = [
    { 
      headerName: 'Name', 
      field: 'name', 
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full" title="On waitlist"></div>
          <span className="font-medium">{params.value}</span>
        </div>
      )
    },
    { headerName: 'Phone', field: 'phone', minWidth: 120 },
    { headerName: 'SS', field: 'ss', minWidth: 100 },
    { headerName: 'DOB', field: 'dob', minWidth: 110 },
    { headerName: 'PID', field: 'pid', minWidth: 90 },
    { headerName: 'External ID', field: 'externalId', minWidth: 100 },
    { 
      headerName: 'Waitlist Date', 
      field: 'waitlistDate', 
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span className="text-sm text-gray-600">{params.value}</span>
      )
    },
    { 
      headerName: 'Priority', 
      field: 'priority', 
      minWidth: 100,
      cellRenderer: (params: any) => {
        const priority = params.value;
        const colorClass = priority === 'High' ? 'bg-red-100 text-red-800' :
                          priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {priority}
          </span>
        );
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        const canAdd = currentPatientCount < groupCapacity;
        return (
          <Button
            size="sm"
            variant={canAdd ? "default" : "outline"}
            disabled={!canAdd}
            onClick={() => handleAddToEvent(params.data.id)}
            className="h-8 px-3 text-xs"
            title={canAdd ? "Add to appointment" : "Group capacity reached"}
          >
            <UserPlusIcon className="w-3 h-3 mr-1" />
            Add
          </Button>
        );
      },
      suppressMenu: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100">
        <DialogTitle className="flex items-center gap-3">
          <ClockIcon className="w-6 h-6 text-orange-600" />
          Waitlist Patients
        </DialogTitle>
        
        <DialogDescription>
          Patients waiting for available spots in this group appointment. Add patients to the appointment when capacity allows.
        </DialogDescription>

        {/* Main Content Area */}
        <div className="flex flex-col h-[600px]">
          {/* Status Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  <strong>Group Capacity:</strong> {groupCapacity}
                </span>
                <span className="text-gray-600">
                  <strong>Current Patients:</strong> {currentPatientCount}
                </span>
                <span className="text-gray-600">
                  <strong>Available Spots:</strong> {Math.max(0, groupCapacity - currentPatientCount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-xs text-gray-500">Waitlist Status</span>
              </div>
            </div>
          </div>

          {/* Waitlist Table */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
            {waitlistPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ClockIcon className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No Waitlist Patients</h3>
                <p className="text-sm text-center max-w-md">
                  There are currently no patients on the waitlist for this appointment.
                  Patients will appear here when the group reaches capacity.
                </p>
              </div>
            ) : (
              <div className="h-full">
                <DataTable
                  rowData={waitlistRowData}
                  columnDefs={columnDefs}
                  className="h-full"
                  gridOptions={{
                    domLayout: 'normal',
                    getRowId: (data: any) => data.data.id,
                    pagination: true,
                    paginationPageSize: 10,
                    overlayNoRowsTemplate: '<span>No waitlist patients found.</span>',
                    headerHeight: 40,
                    rowHeight: 50,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {waitlistPatients.length > 0 && (
              <span>
                {waitlistPatients.length} patient{waitlistPatients.length !== 1 ? 's' : ''} on waitlist
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              variant="default"
              disabled={currentPatientCount >= groupCapacity}
              onClick={() => {
                // Could implement bulk add functionality here
                console.log('Bulk add functionality - TODO');
              }}
            >
              Add All Available
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
