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
import { UsersIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MultiSelect, type MultiSelectOption } from '@/components/atoms/MultiSelect/multi-select'

export interface TeamHistoryEntry {
  id: string
  providerName: string
  providerId: string
  startDate: string
  endDate?: string
}

export interface AdmissionForManageTeam {
  id: string
  admitDate: string
  program: string
}

interface ManageTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForManageTeam
  providerOptions: MultiSelectOption[]
  teamHistory: TeamHistoryEntry[]
  onAddProviders: (providerIds: string[], admissionId: string) => void
  onRemoveFromTeam?: (entryId: string, admissionId: string) => void
}

/**
 * ManageTeamDialog - Add assistant staff (providers) and view team history for an admission.
 */
const ManageTeamDialog: React.FC<ManageTeamDialogProps> = ({
  open,
  onOpenChange,
  admission,
  providerOptions,
  teamHistory,
  onAddProviders,
  onRemoveFromTeam,
}) => {
  const [selectedProviderIds, setSelectedProviderIds] = React.useState<string[]>([])

  const handleAddProviders = () => {
    if (selectedProviderIds.length === 0) return
    onAddProviders(selectedProviderIds, admission.id)
    setSelectedProviderIds([])
  }

  const columnDefs: ColDef[] = [
    { headerName: 'Provider Name', field: 'providerName', minWidth: 200 },
    { headerName: 'Start Date', field: 'startDate', minWidth: 160 },
    {
      headerName: 'End Date',
      field: 'endDate',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <span className="text-gray-600">{params.value || '—'}</span>
      ),
    },
    ...(onRemoveFromTeam
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
                    onRemoveFromTeam(params.data.id, admission.id)
                  }
                  title="Remove from team"
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
        aria-describedby="manage-team-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">
          Manage Team - {admission.program}
        </DialogTitle>
        <DialogDescription
          id="manage-team-dialog-desc"
          className="sr-only"
        >
          Add assistant staff (providers) and manage team history for this admission.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            Manage Team
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

            {/* Add Assistant Staff (Providers) */}
            <Card className="shadow-none border-gray-200 shrink-0">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  Add Assistant Staff (Providers)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0">
                    <MultiSelect
                      options={providerOptions.filter(
                        (p) => !teamHistory.some((t) => t.providerId === p.value))
                      }
                      value={selectedProviderIds}
                      onChange={setSelectedProviderIds}
                      placeholder="Search and select providers..."
                      className="w-full"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleAddProviders}
                    disabled={selectedProviderIds.length === 0}
                    className="shrink-0"
                  >
                    Add to Team
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team History Table */}
            <Card className="shadow-none border-gray-200 flex-1 min-h-0 flex flex-col shrink-0">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2 shrink-0">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  Team History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 min-h-0 flex flex-col">
                {teamHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <UsersIcon className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">
                      No team members for this admission. Add providers above.
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px] w-full">
                    <DataTable
                      rowData={teamHistory}
                      columnDefs={columnDefs}
                      className="h-full"
                      gridOptions={{
                        domLayout: 'normal',
                        getRowId: (data: any) => data.data.id,
                        pagination: false,
                        overlayNoRowsTemplate:
                          '<span>No team history.</span>',
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

export default ManageTeamDialog
