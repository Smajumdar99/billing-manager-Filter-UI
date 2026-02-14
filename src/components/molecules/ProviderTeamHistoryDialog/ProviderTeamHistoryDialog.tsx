import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog/dialog'
import { Button } from '@/components/atoms/Button'
import { DataTable } from '@/components/organisms/DataTable'
import { ColDef } from 'ag-grid-community'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ProviderHistoryEntry {
  id: string
  name: string
  startDate: string
  endDate?: string
  providerType: string
}

export interface AdmissionForProviderHistory {
  id: string
  admitDate: string
  program: string
}

interface ProviderTeamHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForProviderHistory
  providerHistory: ProviderHistoryEntry[]
  onRemoveProvider?: (providerId: string, admissionId: string) => void
}

/**
 * ProviderTeamHistoryDialog - View and manage provider/team history for an admission.
 */
const ProviderTeamHistoryDialog: React.FC<ProviderTeamHistoryDialogProps> = ({
  open,
  onOpenChange,
  admission,
  providerHistory,
  onRemoveProvider,
}) => {
  const columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', minWidth: 180 },
    { headerName: 'Start Date', field: 'startDate', minWidth: 160 },
    {
      headerName: 'End Date',
      field: 'endDate',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <span className="text-gray-600">{params.value || '—'}</span>
      ),
    },
    { headerName: 'Provider Type', field: 'providerType', minWidth: 120 },
    ...(onRemoveProvider
      ? [
          {
            headerName: 'Action',
            field: 'actions',
            minWidth: 80,
            maxWidth: 100,
            cellStyle: { textAlign: 'right' },
            headerClass: 'text-right',
            cellRenderer: (params: any) => (
              <div className="flex items-center justify-end">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                  onClick={() =>
                    onRemoveProvider(params.data.id, admission.id)
                  }
                  title="Remove provider"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </Button>
              </div>
            ),
            suppressMenu: true,
            pinned: 'right' as const,
          },
        ]
      : []),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="provider-team-history-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">
          Provider(s)/Team History - {admission.program}
        </DialogTitle>
        <DialogDescription
          id="provider-team-history-dialog-desc"
          className="sr-only"
        >
          View and manage provider and team history for this admission.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            Provider(s)/Team History
          </h2>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 min-h-0 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Header: Admit Date & Program */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="text-sm text-gray-700">
                <strong>Admit Date:</strong> {admission.admitDate}
              </span>
              <span className="text-sm text-gray-700">
                <strong>Program:</strong> {admission.program}
              </span>
            </div>

            {/* Provider History Table */}
            <Card className="shadow-none border-gray-200 flex-1 min-h-0 flex flex-col">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2 shrink-0">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-primary" />
                  Provider(s)/Team History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 min-h-0 flex flex-col">
                {providerHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <UserGroupIcon className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">
                      No provider history for this admission.
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px] w-full">
                    <DataTable
                      rowData={providerHistory}
                      columnDefs={columnDefs}
                      className="h-full"
                      gridOptions={{
                        domLayout: 'normal',
                        getRowId: (data: any) => data.data.id,
                        pagination: false,
                        overlayNoRowsTemplate:
                          '<span>No provider history.</span>',
                        headerHeight: 40,
                        rowHeight: 44,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProviderTeamHistoryDialog
