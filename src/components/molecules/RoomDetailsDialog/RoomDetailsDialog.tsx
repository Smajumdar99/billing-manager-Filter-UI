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
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface RoomDetailsEntry {
  id: string
  program: string
  building: string
  floor: string
  roomNo: string
  bedNo: string
  allocatedDate: string
  releasedDate?: string
  tentativeReleaseDate?: string
}

export interface AdmissionForRoomDetails {
  id: string
  admitDate: string
  program: string
}

interface RoomDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForRoomDetails
  roomDetails: RoomDetailsEntry[]
  onRemoveRoom?: (roomId: string, admissionId: string) => void
  onCheckRoomAvailability?: (admissionId: string) => void
}

/**
 * RoomDetailsDialog - View and manage room assignments for an admission.
 */
const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  open,
  onOpenChange,
  admission,
  roomDetails,
  onRemoveRoom,
  onCheckRoomAvailability,
}) => {
  const columnDefs: ColDef[] = [
    { headerName: 'Program', field: 'program', minWidth: 140 },
    { headerName: 'Building', field: 'building', minWidth: 120 },
    { headerName: 'Floor', field: 'floor', minWidth: 80 },
    { headerName: 'Room No.', field: 'roomNo', minWidth: 100 },
    { headerName: 'Bed No.', field: 'bedNo', minWidth: 90 },
    { headerName: 'Allocated Date', field: 'allocatedDate', minWidth: 140 },
    {
      headerName: 'Released Date',
      field: 'releasedDate',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span className="text-gray-600">{params.value || '—'}</span>
      ),
    },
    {
      headerName: 'Tentative Release Date',
      field: 'tentativeReleaseDate',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <span className="text-gray-600">{params.value || '—'}</span>
      ),
    },
    ...(onRemoveRoom
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
                    onRemoveRoom(params.data.id, admission.id)
                  }
                  title="Remove room"
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
        aria-describedby="room-details-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">
          Room Details - {admission.program}
        </DialogTitle>
        <DialogDescription
          id="room-details-dialog-desc"
          className="sr-only"
        >
          View and manage room assignments for this admission.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            Room Details
          </h2>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 min-h-0 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Header: Admit Date, Program & Check Room Availability */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-700">
                  <strong>Admit Date:</strong> {admission.admitDate}
                </span>
                <span className="text-sm text-gray-700">
                  <strong>Program:</strong> {admission.program}
                </span>
              </div>
              <Button
                variant="link"
                className="text-sm font-medium text-primary hover:underline p-0 h-auto"
                onClick={() => onCheckRoomAvailability?.(admission.id)}
              >
                Check Room Availability
              </Button>
            </div>

            {/* Room Details Table */}
            <Card className="shadow-none border-gray-200 flex-1 min-h-0 flex flex-col">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2 shrink-0">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <BuildingOffice2Icon className="w-4 h-4 text-primary" />
                  Room Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 min-h-0 flex flex-col">
                <div className="h-[300px] w-full border border-gray-200 rounded-lg overflow-hidden">
                  <DataTable
                    rowData={roomDetails}
                    columnDefs={columnDefs}
                    className="h-full"
                    gridOptions={{
                      domLayout: 'normal',
                      getRowId: (data: any) => data.data.id,
                      pagination: false,
                      overlayNoRowsTemplate:
                        '<span>No Room Found</span>',
                      headerHeight: 40,
                      rowHeight: 44,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoomDetailsDialog
