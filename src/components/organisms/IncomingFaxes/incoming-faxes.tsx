import React, { useState } from 'react';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faDownload, 
  faUserPlus, 
  faStickyNote,
  faExclamationTriangle,
  faCheck,
  faArchive,
  faClock,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip';
import { IncomingFax, IncomingFaxesProps, FaxStatus, FaxPriority } from '@/types/fax';
import { FaxBulkActions, FaxBulkActionsData } from '@/components/molecules/FaxBulkActions/fax-bulk-actions';
import SendFaxDialog, { SendFaxData } from '@/components/molecules/SendFaxDialog/send-fax-dialog';

/**
 * IncomingFaxes Organism Component
 * 
 * I will use atomic design principles for all components.
 * Comprehensive table for managing incoming faxes in behavioral health clinics.
 * Displays fax queue with sender info, pages, timestamps, linked patients, and actions.
 */
const IncomingFaxes: React.FC<IncomingFaxesProps> = ({
  faxes,
  isLoading = false,
  actionHandlers = {},
  onFaxUpdate,
  className = ''
}) => {
  const [selectedFaxes, setSelectedFaxes] = useState<IncomingFax[]>([]);
  const [showSendFaxDialog, setShowSendFaxDialog] = useState(false);

  // Handle Send Fax button click
  const handleSendFax = () => {
    setShowSendFaxDialog(true);
  };

  // Handle Send Fax form submission
  const handleSendFaxSubmit = (faxData: SendFaxData) => {
    console.log('Sending fax with data:', faxData);
    // TODO: Implement actual fax sending logic
    alert(`Fax "${faxData.subject}" queued for sending to ${faxData.toFaxNumbers.join(', ')} from ${faxData.fromLocation.name}`);
  };

  // Handle fax selection changes
  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedFaxData = selectedNodes.map(node => node.data as IncomingFax);
    setSelectedFaxes(selectedFaxData);
  };

  // Handle bulk actions
  const handleBulkActions = (actions: FaxBulkActionsData) => {
    console.log('Applying bulk actions to faxes:', selectedFaxes.length, actions);
    
    switch (actions.action) {
      case 'assignToPatient':
        if (actions.patientId) {
          // TODO: Implement bulk patient assignment
          alert(`Assigned ${selectedFaxes.length} fax${selectedFaxes.length !== 1 ? 'es' : ''} to patient ${actions.patientId}`);
          setSelectedFaxes([]); // Clear selection
        }
        break;
        
      case 'download':
        // TODO: Implement bulk download
        const totalPages = selectedFaxes.reduce((sum, fax) => sum + fax.pageCount, 0);
        alert(`Downloading ${selectedFaxes.length} fax${selectedFaxes.length !== 1 ? 'es' : ''} (${totalPages} pages total)`);
        setSelectedFaxes([]); // Clear selection
        break;
        
      case 'delete':
        // TODO: Implement bulk delete
        alert(`Deleted ${selectedFaxes.length} fax${selectedFaxes.length !== 1 ? 'es' : ''}`);
        setSelectedFaxes([]); // Clear selection
        break;
        
      case 'markRead':
        // TODO: Implement bulk mark as read (status = 'reviewed')
        alert(`Marked ${selectedFaxes.length} fax${selectedFaxes.length !== 1 ? 'es' : ''} as read`);
        setSelectedFaxes([]); // Clear selection
        break;
        
      case 'markUnread':
        // TODO: Implement bulk mark as unread (status = 'new')
        alert(`Marked ${selectedFaxes.length} fax${selectedFaxes.length !== 1 ? 'es' : ''} as unread`);
        setSelectedFaxes([]); // Clear selection
        break;
        
      default:
        console.warn('Unknown bulk action:', actions.action);
    }
  };

  // Handle canceling bulk actions
  const handleCancelBulkActions = () => {
    setSelectedFaxes([]);
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status: FaxStatus) => {
    const statusConfig = {
      new: { variant: 'destructive' as const, label: 'New' },
      reviewed: { variant: 'secondary' as const, label: 'Reviewed' },
      assigned: { variant: 'default' as const, label: 'Assigned' },
      archived: { variant: 'outline' as const, label: 'Archived' },
      urgent: { variant: 'destructive' as const, label: 'Urgent' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Helper function to get priority badge styling
  const getPriorityBadge = (priority: FaxPriority) => {
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Low', color: 'text-gray-600' },
      normal: { variant: 'secondary' as const, label: 'Normal', color: 'text-blue-600' },
      high: { variant: 'default' as const, label: 'High', color: 'text-orange-600' },
      urgent: { variant: 'destructive' as const, label: 'Urgent', color: 'text-red-600' }
    };
    
    const config = priorityConfig[priority];
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  // Format received date for display
  const formatReceivedDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just received';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Column definitions for the incoming faxes table
  const columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      pinned: 'left',
      cellRenderer: (params: any) => getStatusBadge(params.value)
    },
    {
      headerName: 'Priority',
      field: 'priority',
      width: 100,
      cellRenderer: (params: any) => getPriorityBadge(params.value)
    },
    {
      headerName: 'Subject/Message',
      field: 'subject',
      minWidth: 200,
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <div className="font-medium text-gray-900 truncate">{params.value}</div>
          {params.data.notes && (
            <div className="text-xs text-gray-500 truncate mt-1">
              <FontAwesomeIcon icon={faStickyNote} className="mr-1" />
              {params.data.notes}
            </div>
          )}
        </div>
      )
    },
    {
      headerName: 'From',
      field: 'sender',
      minWidth: 180,
      flex: 1,
      cellRenderer: (params: any) => {
        const sender = params.value;
        return (
          <div className="py-2">
            <div className="font-medium text-gray-900">
              {sender.name || sender.organization || 'Unknown Sender'}
            </div>
            <div className="text-xs text-gray-500">{sender.faxNumber}</div>
            {sender.phoneNumber && (
              <div className="text-xs text-gray-400">{sender.phoneNumber}</div>
            )}
          </div>
        );
      }
    },
    {
      headerName: 'To Fax #',
      field: 'recipientFaxNumber',
      width: 120,
      cellRenderer: (params: any) => (
        <div className="font-mono text-sm text-gray-700">{params.value}</div>
      )
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{params.data.location.name}</div>
          <div className="text-xs text-gray-500 font-mono">{params.data.location.faxNumber}</div>
        </div>
      )
    },
    {
      headerName: 'Pages',
      field: 'pageCount',
      width: 80,
      cellRenderer: (params: any) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {params.value}
          </span>
        </div>
      )
    },
    {
      headerName: 'Received',
      field: 'receivedAt',
      width: 130,
      sort: 'desc', // Default sort by received date (newest first)
      sortIndex: 0, // Make this the primary sort column
      cellRenderer: (params: any) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatReceivedDate(params.value)}</div>
          <div className="text-xs text-gray-500">
            {params.value.toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      headerName: 'Linked Patient',
      field: 'linkedPatient',
      minWidth: 160,
      flex: 1,
      cellRenderer: (params: any) => {
        const patient = params.value;
        if (!patient) {
          return (
            <span className="text-gray-400 italic text-sm">Not assigned</span>
          );
        }
        return (
          <div className="py-2">
            <div className="font-medium text-gray-900">{patient.name}</div>
            <div className="text-xs text-gray-500">MRN: {patient.mrn}</div>
            <div className="text-xs text-gray-400">DOB: {patient.dob}</div>
          </div>
        );
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      pinned: 'right',
      width: 180,
      cellRenderer: (params: any) => {
        const fax = params.data;
        
        return (
          <TooltipProvider>
            <div className="flex items-center gap-1 py-2">
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actionHandlers.onView?.(fax)}
                    className="h-8 w-8 p-0"
                  >
                    <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Fax</TooltipContent>
              </TooltipRoot>

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actionHandlers.onDownload?.(fax)}
                    className="h-8 w-8 p-0"
                  >
                    <FontAwesomeIcon icon={faDownload} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Fax</TooltipContent>
              </TooltipRoot>

              {!fax.linkedPatient && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => actionHandlers.onAssignToPatient?.(fax)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Assign to Patient</TooltipContent>
                </TooltipRoot>
              )}

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actionHandlers.onAddNotes?.(fax)}
                    className="h-8 w-8 p-0"
                  >
                    <FontAwesomeIcon icon={faStickyNote} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Notes</TooltipContent>
              </TooltipRoot>

              {fax.status === 'new' && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => actionHandlers.onMarkReviewed?.(fax)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                    >
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark as Reviewed</TooltipContent>
                </TooltipRoot>
              )}
            </div>
          </TooltipProvider>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-blue-600" />
            Loading Incoming Faxes...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEye} className="h-5 w-5 text-blue-600" />
              Incoming Faxes
              <Badge variant="secondary" className="ml-2">
                {faxes.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{faxes.filter(f => f.status === 'new').length} new</span>
                <span>•</span>
                <span>{faxes.filter(f => f.status === 'urgent').length} urgent</span>
              </div>
              <Button 
                onClick={handleSendFax}
                className="flex items-center gap-2"
                size="sm"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                Send Fax
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Bulk Actions - Show when faxes are selected */}
          {selectedFaxes.length > 0 && (
            <div className="p-4 border-b">
              <FaxBulkActions
                selectedCount={selectedFaxes.length}
                selectedFaxes={selectedFaxes}
                onApplyActions={handleBulkActions}
                onCancel={handleCancelBulkActions}
              />
            </div>
          )}
          
          <div style={{ height: selectedFaxes.length > 0 ? 'calc(100vh - 400px)' : 'calc(100vh - 300px)', minHeight: '400px' }}>
            <DataTable
              rowData={faxes}
              columnDefs={columnDefs}
              className="w-full h-full fax-table-subtle-selection"
              gridOptions={{
                domLayout: 'normal',
                pagination: true,
                paginationPageSize: 25,
                suppressRowClickSelection: true,
                suppressCellFocus: true,
                enableRangeSelection: false,
                rowHeight: 60,
                headerHeight: 45,
                animateRows: true,
                sortingOrder: ['desc', 'asc'],
                rowSelection: 'multiple',
                onSelectionChanged: handleSelectionChanged,
                defaultColDef: {
                  sortable: true,
                  filter: true,
                  resizable: true
                },
                getRowStyle: (params) => {
                  // Clean uniform styling - status is clearly indicated by badges
                  return {};
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Send Fax Dialog */}
      <SendFaxDialog
        isOpen={showSendFaxDialog}
        onClose={() => setShowSendFaxDialog(false)}
        onSend={handleSendFaxSubmit}
      />
    </TooltipProvider>
  );
};

export default IncomingFaxes;
