import React from 'react';
import { Dialog, DialogContent } from '../../atoms/Dialog/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/Select/select';
import { Combobox, ComboboxOption } from '../../atoms/Combobox/Combobox';
import { Button } from '../../atoms/Button';
import { DataTable } from '../../organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { UserGroupIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

// Props for AddPatientsModal
interface AddPatientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientOptions: ComboboxOption[];
  selectedPatients: string[];
  setSelectedPatients: (ids: string[]) => void;
  groupCapacity: number;
  patientFilter: string;
  setPatientFilter: (filter: string) => void;
  capacityError: boolean;
  setCapacityError: (err: boolean) => void;
  showWaitlist: boolean;
  setShowWaitlist: (show: boolean) => void;
  waitlistPatients: any[];
  onAddToEvent: () => void;
}

/**
 * AddPatientsModal - atomic molecule for adding patients to a group appointment.
 * Handles patient search, selection, filtering, and waitlist overlay.
 */
const AddPatientsModal: React.FC<AddPatientsModalProps> = ({
  open,
  onOpenChange,
  patientOptions,
  selectedPatients,
  setSelectedPatients,
  groupCapacity,
  patientFilter,
  setPatientFilter,
  capacityError,
  setCapacityError,
  showWaitlist,
  setShowWaitlist,
  waitlistPatients,
  onAddToEvent,
}) => {
  // Pre-populate selectedPatients with first 4 patients when modal opens and selection is empty
  React.useEffect(() => {
    if (open && selectedPatients.length === 0 && patientOptions.length > 0) {
      const defaultIds = patientOptions.slice(0, 4).map(p => p.value);
      setSelectedPatients(defaultIds);
    }
  }, [open, selectedPatients.length, patientOptions, setSelectedPatients]);

  // Memoize selected patient row data for DataTable
  const selectedPatientRowData = React.useMemo(() => patientOptions
    .filter(p => selectedPatients.includes(p.value))
    .map(p => {
      const [phone, ss, dob, extId] = (p.description || '').split(' | ');
      return {
        id: p.value,
        name: p.label,
        phone,
        ss,
        dob,
        pid: p.value,
        externalId: extId
      };
    }), [selectedPatients, patientOptions]);

  // Handler to remove a patient from the selected list
  const handleRemovePatient = React.useCallback((id: string) => {
    setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    setCapacityError(false);
  }, [selectedPatients, setSelectedPatients, setCapacityError]);

  // AG Grid column definitions (Actions column: reduced width, trash icon)
  const columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', minWidth: 150 },
    { headerName: 'Phone', field: 'phone', minWidth: 120 },
    { headerName: 'SS', field: 'ss', minWidth: 120 },
    { headerName: 'DOB', field: 'dob', minWidth: 120 },
    { headerName: 'PID', field: 'pid', minWidth: 100 },
    { headerName: 'External ID', field: 'externalId', minWidth: 100 },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 40, // Reduced width for icon-only
      maxWidth: 40,
      cellRenderer: (params: any) => {
        // Render a delete (trash) button for each row
        return (
          <button
            type="button"
            className="text-gray-400 hover:text-red-600 focus:outline-none"
            title="Remove patient"
            onClick={() => handleRemovePatient(params.data.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        );
      },
      suppressMenu: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  // Handler for Combobox selection
  const handleSelectedPatients = React.useCallback((newSelected: string[]) => {
    if (newSelected.length > groupCapacity) {
      setCapacityError(true);
      return;
    }
    setCapacityError(false);
    setSelectedPatients(newSelected);
  }, [groupCapacity, setCapacityError, setSelectedPatients]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[900px] lg:max-w-4xl p-0 flex flex-col h-[90vh] max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100 border border-gray-200"
      >
        {/* Modal Header */}
        <div className="px-4 py-2">
          <h2 className="text-base font-semibold text-gray-900">Add Patients to Appointment</h2>
        </div>
        {/* Main Content - Scrollable Area, fill height */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 pt-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 h-full">
            {/* Filter Bar with Select and Combobox for typeahead */}
            <div className="flex flex-col sm:flex-row gap-2 items-center p-4 border-b border-gray-100">
              <div className="w-48 flex-shrink-0">
                <Select value={patientFilter} onValueChange={setPatientFilter}>
                  <SelectTrigger className="h-8 text-sm w-full">
                    <SelectValue placeholder="Filter Patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="not-admitted">Not-Admitted</SelectItem>
                    <SelectItem value="program">My Program</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full">
                <Combobox
                  options={patientOptions}
                  value={selectedPatients}
                  onChange={handleSelectedPatients}
                  placeholder="Search and select patients..."
                  multiple={true}
                  hideFilters={true}
                />
              </div>
            </div>
            {/* Capacity Info, Error, and Show Waitlist link */}
            <div className="mb-2 text-xs text-gray-600 px-4 pt-2 flex items-center justify-between">
              <div>
                Group Capacity: <span className="font-bold">{groupCapacity}</span> &nbsp;|&nbsp; Patients Added: <span className="font-bold">{selectedPatients.length}</span>
                {capacityError && (
                  <span className="ml-4 text-red-600 font-semibold">Group capacity reached. Cannot add more patients.</span>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-blue-600 underline font-semibold hover:text-blue-800 focus:outline-none"
                onClick={() => setShowWaitlist(true)}
              >
                Show Waitlist
              </button>
            </div>
            {/* Waitlist Overlay */}
            {showWaitlist && (
              <div className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl" style={{ transform: 'translate(-50%, 0)', bottom: 0 }}>
                <div className="bg-white rounded-t-xl border border-gray-200 shadow-xl p-4 flex flex-col" style={{ height: '45vh', minHeight: 240 }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-sm">Waitlist Patients</span>
                    <button onClick={() => setShowWaitlist(false)} className="text-gray-400 hover:text-gray-700"><XMarkIcon className="w-5 h-5" /></button>
                  </div>
                  {waitlistPatients.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm font-semibold">
                      No patients in waitlist.
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="p-2 align-middle">Name</th>
                            <th className="p-2 align-middle">Phone</th>
                            <th className="p-2 align-middle">SS</th>
                            <th className="p-2 align-middle">DOB</th>
                            <th className="p-2 align-middle">PID</th>
                            <th className="p-2 align-middle">External ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waitlistPatients.map(p => (
                            <tr key={p.id}>
                              <td className="p-2 align-middle">{p.name}</td>
                              <td className="p-2 align-middle">{p.phone}</td>
                              <td className="p-2 align-middle">{p.ss}</td>
                              <td className="p-2 align-middle">{p.dob}</td>
                              <td className="p-2 align-middle">{p.pid}</td>
                              <td className="p-2 align-middle">{p.externalId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Patients Table or Empty State using DataTable */}
            <div className="mb-4 mx-4 bg-white flex-1" style={{ minHeight: 120 }}>
              {selectedPatientRowData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm font-semibold">
                  <UserGroupIcon className="w-14 h-14 mb-4 text-blue-200" />
                  <div>No patients added yet.<br />
                  <span className="font-normal text-gray-400">Use the search above to add patients.</span></div>
                </div>
              ) : (
                <DataTable
                  rowData={selectedPatientRowData}
                  columnDefs={columnDefs}
                  className="w-full"
                  gridOptions={{
                    domLayout: 'autoHeight',
                    getRowId: (data: any) => data.id,
                    pagination: false,
                    overlayNoRowsTemplate: '<span>No patients found.</span>',
                  }}
                />
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end px-4 pb-4">
              <Button size="sm" variant="outline">Add to Wait List</Button>
              <Button size="sm" disabled={selectedPatients.length >= groupCapacity} onClick={onAddToEvent}>
                Add to Event
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientsModal; 