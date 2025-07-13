import React, { useState } from 'react';
import { 
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  PencilIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { ColumnCustomizer, ColumnConfig } from '@/components/molecules/ColumnCustomizer';
import { GroupActions, GroupActionsData } from '@/components/molecules/GroupActions/group-actions';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip';
import { 
  PatientData, 
  PatientActionHandlers, 
  PatientsTableProps
} from '@/types/patients';

/**
 * PatientsTable Organism Component
 * 
 * A comprehensive patient table with selection, column customization, and group actions
 * I will use atomic design principles for all components
 */

const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  title = 'Manage Group Roaster',
  showGroupActions = true,
  actionHandlers = {},
  className = '',
  maxHeight = '96',
  onPatientsUpdate,
  showAddMoreButton = false,
  onAddMorePatients
}) => {
  // Column configuration state for patients table customization
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { id: 'checkbox', label: 'Select', visible: true, category: 'basic', required: true },
    { id: 'clientName', label: 'Client Name', visible: true, category: 'basic', required: true },
    { id: 'allowEmail', label: 'Allow Email?', visible: true, category: 'basic' },
    { id: 'email', label: 'Email', visible: true, category: 'basic' },
    { id: 'notes', label: 'Notes', visible: true, category: 'additional' },
    { id: 'primaryCounselor', label: 'Primary Counselor', visible: true, category: 'basic' },
    { id: 'insurance', label: 'Insurance', visible: true, category: 'basic' },
    { id: 'serviceProgram', label: 'Service Program', visible: true, category: 'basic' },
    { id: 'status', label: 'Status', visible: true, category: 'appointments' },
    { id: 'encounter', label: 'Encounter', visible: true, category: 'appointments' },
    { id: 'benefits', label: 'Benefits', visible: true, category: 'additional' },
    { id: 'actions', label: 'Actions', visible: true, category: 'additional', required: true }
  ]);

  // Patient selection state
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  // Handle column configuration changes
  const handleColumnConfigChange = (newConfigs: ColumnConfig[]) => {
    setColumnConfigs(newConfigs);
  };

  // Handle individual patient selection
  const handlePatientSelect = (patientId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  // Handle select all patients
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPatients(patients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  // Check if all patients are selected
  const isAllSelected = patients.length > 0 && selectedPatients.length === patients.length;

  // Check if some patients are selected  
  const isSomeSelected = selectedPatients.length > 0 && selectedPatients.length < patients.length;

  // Handle group actions
  const handleGroupActions = (actions: GroupActionsData) => {
    console.log('Applying group actions to patients:', selectedPatients, actions);
    
    if (actions.action === 'delete') {
      // Handle patient deletion
      const patientsToDelete = selectedPatients.length;
      const updatedPatients = patients.filter(patient => !selectedPatients.includes(patient.id));
      
      // Clear selection after deletion
      setSelectedPatients([]);
      
      // Notify parent component with updated patient list
      if (onPatientsUpdate) {
        onPatientsUpdate(updatedPatients);
      }
      
      // Show success message
      alert(`Successfully deleted ${patientsToDelete} patient${patientsToDelete !== 1 ? 's' : ''} from the table.`);
      
      // TODO: Implement actual API call to delete patients from database
      // Example: await deletePatients(selectedPatients);
      
    } else {
      // Handle other group actions (update operations)
      // TODO: Implement actual API calls for group actions
      // This would typically:
      // 1. Update patient statuses in the database
      // 2. Update payer information
      // 3. Record fee payments
      // 4. Refresh the patient data
      
      // For now, just log the actions and clear selection
      alert(`Group actions applied to ${selectedPatients.length} patients:\n${JSON.stringify(actions, null, 2)}`);
      setSelectedPatients([]);
      
      // Notify parent component if callback provided
      if (onPatientsUpdate) {
        onPatientsUpdate(patients);
      }
    }
  };

  // Handle canceling group actions
  const handleCancelGroupActions = () => {
    setSelectedPatients([]);
  };

  // Full column definitions for patients table
  const allPatientsColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      minWidth: 50,
      maxWidth: 50,
      pinned: 'left',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
      headerClass: 'flex items-center justify-center',
      headerComponent: () => (
        <div className="flex items-center justify-center h-full w-full absolute inset-0">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(input) => {
              if (input) input.indeterminate = isSomeSelected;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
      ),
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full">
          <input
            type="checkbox"
            checked={selectedPatients.includes(params.data.id)}
            onChange={(e) => handlePatientSelect(params.data.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
      ),
      sortable: false,
      filter: false,
      resizable: false
    },
    { 
      headerName: 'Client Name', 
      field: 'clientName', 
      minWidth: 180,
      flex: 1,
      cellStyle: { fontWeight: '500' }
    },
    { 
      headerName: 'Allow Email?', 
      field: 'allowEmail', 
      minWidth: 100,
      cellRenderer: (params: any) => params.value ? 'Yes' : 'No',
      cellStyle: (params: any) => ({
        color: params.value ? '#059669' : '#DC2626',
        fontWeight: '500'
      })
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      minWidth: 180,
      cellStyle: { color: '#2563EB' }
    },
    { 
      headerName: 'Notes', 
      field: 'notes', 
      minWidth: 120,
      cellStyle: { fontSize: '12px' }
    },
    { 
      headerName: 'Primary Counselor', 
      field: 'primaryCounselor', 
      minWidth: 160,
      cellStyle: { fontWeight: '500' }
    },
    { 
      headerName: 'Insurance', 
      field: 'insurance', 
      minWidth: 100
    },
    { 
      headerName: 'Service Program', 
      field: 'serviceProgram', 
      minWidth: 120,
      cellStyle: { fontWeight: '500' }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      minWidth: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        let colorClass = '';
        
        switch (status) {
          case 'Attended':
            colorClass = 'text-green-600 bg-green-50 border border-green-200';
            break;
          case 'No Show':
            colorClass = 'text-red-600 bg-red-50 border border-red-200';
            break;
          default:
            colorClass = 'text-gray-600 bg-gray-50 border border-gray-200';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      }
    },
    { 
      headerName: 'Encounter', 
      field: 'encounter', 
      minWidth: 140,
      cellStyle: { textAlign: 'left', display: 'flex', alignItems: 'center' },
      cellRenderer: (params: any) => {
        const handleEditTime = () => {
          if (actionHandlers.onEditEncounterTime) {
            actionHandlers.onEditEncounterTime(params.data);
          }
        };
        
        const handleRulesSatisfied = () => {
          if (actionHandlers.onRulesSatisfied) {
            actionHandlers.onRulesSatisfied(params.data);
          }
        };
        
        const handleViewEncounter = () => {
          if (actionHandlers.onViewEncounter) {
            actionHandlers.onViewEncounter(params.data);
          }
        };

        return (
          <div className="flex items-center gap-3 justify-start">
            {/* Edit Encounter Time */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleEditTime}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>Edit Encounter Time</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* Check mark (rules satisfied) */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleRulesSatisfied}
                >
                  <CheckCircleIcon className="w-4 h-4 text-green-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>Rules Satisfied</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* View Encounter */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleViewEncounter}
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>View Encounter</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        );
      }
    },
    { 
      headerName: 'Benefits', 
      field: 'benefits', 
      minWidth: 120,
      cellRenderer: (params: any) => {
        const handleNotInterestedClick = () => {
          if (actionHandlers.onNotInterested) {
            actionHandlers.onNotInterested(params.data);
          }
        };

        return (
          <button
            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:underline text-sm font-medium"
            onClick={handleNotInterestedClick}
          >
            Not Interested
          </button>
        );
      }
    },
    { 
      headerName: 'Actions', 
      field: 'actions', 
      minWidth: 220,
      pinned: 'right',
      cellStyle: { 
        textAlign: 'left', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        paddingLeft: '8px'
      },
      cellRenderer: (params: any) => {
        const isSignedIn = params.data.isSignedIn;
        
        const handleSignInOut = () => {
          if (actionHandlers.onSignInOut) {
            actionHandlers.onSignInOut(params.data);
          }
        };
        
        const handleViewNotes = () => {
          if (actionHandlers.onViewNotes) {
            actionHandlers.onViewNotes(params.data);
          }
        };
        
        const handleGoldenThreat = () => {
          if (actionHandlers.onGoldenThreat) {
            actionHandlers.onGoldenThreat(params.data);
          }
        };
        
        const handlePriorAuth = () => {
          if (actionHandlers.onPriorAuth) {
            actionHandlers.onPriorAuth(params.data);
          }
        };
        
        const handleUndoCheckIn = () => {
          if (actionHandlers.onUndoCheckIn) {
            actionHandlers.onUndoCheckIn(params.data);
          }
        };
        
        return (
          <div className="flex items-center gap-3 justify-start w-full pl-0">
            {/* Sign In/Out Button */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleSignInOut}
                >
                  {isSignedIn ? (
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-600" />
                  ) : (
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-green-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>{isSignedIn ? 'Sign Out' : 'Sign In'}</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* Undo Check-in */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleUndoCheckIn}
                >
                  <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>Undo Check-in</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* View Patient Notes */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleViewNotes}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>View Patient Notes</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* Golden Threat Alerts */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleGoldenThreat}
                >
                  <ExclamationTriangleIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>Golden Threat Alerts</p>
              </TooltipContent>
            </TooltipRoot>
            
            {/* Prior Authorisation */}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center p-1 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handlePriorAuth}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p>Prior Authorisation</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        );
      }
    }
  ];

  // Filter columns based on visibility settings
  const patientsColumnDefs: ColDef[] = allPatientsColumnDefs.filter(col => {
    const config = columnConfigs.find(config => config.id === col.field);
    return config ? config.visible : true;
  });

  return (
    <TooltipProvider>
      <Card className={`shadow-none border-gray-200 ${className}`}>
        <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4" />
              {title} ({patients.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Add More Patients Button */}
              {showAddMoreButton && onAddMorePatients && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddMorePatients}
                  className="text-sm h-8 bg-white hover:bg-gray-50"
                >
                  Add More Patients
                </Button>
              )}
              {/* Column Customizer */}
              <ColumnCustomizer
                columns={columnConfigs}
                onColumnsChange={handleColumnConfigChange}
                className=""
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Group Actions - Show when patients are selected */}
          {showGroupActions && selectedPatients.length > 0 && (
            <div className="mb-4">
              <GroupActions
                selectedCount={selectedPatients.length}
                selectedPatientIds={selectedPatients}
                onApplyActions={handleGroupActions}
                onCancel={handleCancelGroupActions}
              />
            </div>
          )}
          
          <div className={`h-${maxHeight} w-full overflow-auto`}>
            <DataTable
              rowData={patients}
              columnDefs={patientsColumnDefs}
              className="w-full h-full"
              gridOptions={{
                domLayout: 'normal',
                pagination: false,
                overlayNoRowsTemplate: '<span>No patients found.</span>',
                headerHeight: 45,
                rowHeight: 40,
                suppressHorizontalScroll: false,
                alwaysShowHorizontalScroll: true,
                suppressRowClickSelection: true,
                suppressCellFocus: true,
                enableRangeSelection: false,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PatientsTable; 