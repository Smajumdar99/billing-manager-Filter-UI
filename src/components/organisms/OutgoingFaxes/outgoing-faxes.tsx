import React, { useState } from 'react';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faEye, 
  faEdit, 
  faRedo, 
  faTimes, 
  faDownload, 
  faTrash,
  faClock,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip';
import { OutgoingFax, OutgoingFaxesProps, OutgoingFaxStatus, FaxPriority } from '@/types/fax';
import SendFaxDialog, { SendFaxData } from '@/components/molecules/SendFaxDialog/send-fax-dialog';

/**
 * OutgoingFaxes Organism Component
 * 
 * I will use atomic design principles for all components.
 * Comprehensive table for managing outgoing faxes in behavioral health clinics.
 * Displays sent/sending fax queue with recipient info, status, and actions.
 */
const OutgoingFaxes: React.FC<OutgoingFaxesProps> = ({
  faxes,
  isLoading = false,
  actionHandlers = {},
  onFaxUpdate,
  className = ''
}) => {
  const [selectedFaxes, setSelectedFaxes] = useState<OutgoingFax[]>([]);
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
    const selectedFaxData = selectedNodes.map(node => node.data as OutgoingFax);
    setSelectedFaxes(selectedFaxData);
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status: OutgoingFaxStatus) => {
    const statusConfig = {
      draft: { variant: 'secondary', label: 'Draft', class: 'bg-gray-100 text-gray-700' },
      queued: { variant: 'secondary', label: 'Queued', class: 'bg-blue-100 text-blue-700' },
      sending: { variant: 'secondary', label: 'Sending', class: 'bg-yellow-100 text-yellow-700' },
      sent: { variant: 'secondary', label: 'Sent', class: 'bg-green-100 text-green-700' },
      delivered: { variant: 'secondary', label: 'Delivered', class: 'bg-green-100 text-green-800' },
      failed: { variant: 'destructive', label: 'Failed', class: 'bg-red-100 text-red-700' },
      cancelled: { variant: 'secondary', label: 'Cancelled', class: 'bg-gray-100 text-gray-600' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge variant={config.variant as any} className={`text-xs font-medium ${config.class}`}>
        {config.label}
      </Badge>
    );
  };

  // Get priority badge with appropriate styling
  const getPriorityBadge = (priority: FaxPriority) => {
    const priorityConfig = {
      low: { variant: 'secondary', label: 'Low', class: 'bg-gray-100 text-gray-600' },
      normal: { variant: 'secondary', label: 'Normal', class: 'bg-blue-100 text-blue-700' },
      high: { variant: 'secondary', label: 'High', class: 'bg-orange-100 text-orange-700' },
      urgent: { variant: 'destructive', label: 'Urgent', class: 'bg-red-100 text-red-700' }
    };

    const config = priorityConfig[priority] || priorityConfig.normal;
    return (
      <Badge variant={config.variant as any} className={`text-xs font-medium ${config.class}`}>
        {config.label}
      </Badge>
    );
  };

  // Format created/sent date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just sent' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Column definitions for AG Grid
  const columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'select',
      colId: 'select',
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      filter: false,
      sortable: false,
      resizable: false,
      suppressMenu: true
    },
    {
      headerName: 'Status',
      field: 'status',
      colId: 'status',
      width: 100,
      minWidth: 100,
      cellRenderer: (params: any) => getStatusBadge(params.data.status)
    },
    {
      headerName: 'Priority',
      field: 'priority',
      colId: 'priority',
      width: 90,
      minWidth: 90,
      cellRenderer: (params: any) => getPriorityBadge(params.data.priority)
    },
    {
      headerName: 'Subject/Message',
      field: 'subject',
      colId: 'subject',
      minWidth: 250,
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm line-clamp-1">
            {params.data.subject}
          </span>
          {params.data.notes && (
            <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {params.data.notes}
            </span>
          )}
        </div>
      )
    },
    {
      headerName: 'To',
      field: 'recipient',
      colId: 'recipient',
      minWidth: 180,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm">
            {params.data.recipient.name || params.data.recipient.organization || 'Unknown'}
          </span>
          <span className="text-xs text-gray-500">
            {params.data.recipient.faxNumber}
          </span>
          {params.data.recipient.organization && params.data.recipient.name && (
            <span className="text-xs text-gray-500 line-clamp-1">
              {params.data.recipient.organization}
            </span>
          )}
        </div>
      )
    },
    {
      headerName: 'From Fax #',
      field: 'senderFaxNumber',
      colId: 'senderFax',
      width: 120,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span className="text-sm text-gray-600">
          {params.data.senderFaxNumber}
        </span>
      )
    },
    {
      headerName: 'Location',
      field: 'location',
      colId: 'location',
      width: 140,
      minWidth: 140,
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
      colId: 'pages',
      width: 70,
      minWidth: 70,
      cellRenderer: (params: any) => (
        <span className="text-sm text-center text-gray-600">
          {params.data.pageCount}
        </span>
      )
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      colId: 'created',
      width: 120,
      minWidth: 120,
      sort: 'desc',
      sortIndex: 0,
      cellRenderer: (params: any) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">
            {formatDate(params.data.createdAt)}
          </span>
          <span className="text-xs text-gray-500">
            {params.data.createdAt.toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: '2-digit' 
            })}
          </span>
        </div>
      )
    },
    {
      headerName: 'Linked Patient',
      field: 'linkedPatient',
      colId: 'linkedPatient',
      width: 140,
      minWidth: 140,
      cellRenderer: (params: any) => {
        if (!params.data.linkedPatient) {
          return <span className="text-xs text-gray-400 italic">Not assigned</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {params.data.linkedPatient.name}
            </span>
            <span className="text-xs text-gray-500">
              MRN: {params.data.linkedPatient.mrn}
            </span>
            <span className="text-xs text-gray-500">
              DOB: {params.data.linkedPatient.dob}
            </span>
          </div>
        );
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      colId: 'actions',
      width: 160,
      minWidth: 160,
      pinned: 'right',
      filter: false,
      sortable: false,
      resizable: false,
      suppressMenu: true,
      cellRenderer: (params: any) => {
        const fax = params.data;
        return (
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {/* View */}
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => actionHandlers.onView?.(fax)}
                  >
                    <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View fax</TooltipContent>
              </TooltipRoot>

              {/* Edit (only for draft status) */}
              {fax.status === 'draft' && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => actionHandlers.onEdit?.(fax)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit draft</TooltipContent>
                </TooltipRoot>
              )}

              {/* Resend (for failed status) */}
              {fax.status === 'failed' && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => actionHandlers.onResend?.(fax)}
                    >
                      <FontAwesomeIcon icon={faRedo} className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resend fax</TooltipContent>
                </TooltipRoot>
              )}

              {/* Cancel (for queued/sending) */}
              {(fax.status === 'queued' || fax.status === 'sending') && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => actionHandlers.onCancel?.(fax)}
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancel sending</TooltipContent>
                </TooltipRoot>
              )}

              {/* Download */}
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => actionHandlers.onDownload?.(fax)}
                  >
                    <FontAwesomeIcon icon={faDownload} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download fax</TooltipContent>
              </TooltipRoot>

              {/* Delete */}
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => actionHandlers.onDelete?.(fax)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete fax</TooltipContent>
              </TooltipRoot>
            </div>
          </TooltipProvider>
        );
      }
    }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Outgoing Faxes...</CardTitle>
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
              <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5 text-blue-600" />
              Outgoing Faxes
              <Badge variant="secondary" className="ml-2">
                {faxes.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{faxes.filter(f => f.status === 'sending' || f.status === 'queued').length} sending</span>
                <span>•</span>
                <span>{faxes.filter(f => f.status === 'failed').length} failed</span>
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
          <div style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}>
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
                  // Clean uniform styling - status and priority are clearly indicated by badges
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

export default OutgoingFaxes;
