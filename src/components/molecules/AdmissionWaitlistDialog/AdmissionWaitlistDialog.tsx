import React, { useState, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog/dialog'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/atoms/Select/select'
import { DataTable } from '@/components/organisms/DataTable'
import { ColDef } from 'ag-grid-community'
import {
  ClockIcon,
  UserPlusIcon,
  ChevronDownIcon,
  FunnelIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import ColumnCustomizer, { ColumnConfig } from '@/components/molecules/ColumnCustomizer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/atoms/Label'

export interface AdmissionForWaitlist {
  id: string
  program: string
  admitDate: string
}

export interface WaitlistPatient {
  id: string
  name: string
  phone?: string
  ss?: string
  dob?: string
  pid?: string
  externalId?: string
  status?: string
  waitlistDate?: string
  priority?: string
}

interface AdmissionWaitlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForWaitlist
  patientId: string
  patientName: string
  waitlistPatients: WaitlistPatient[]
  onAddPatientToWaitlist: (
    patientId: string,
    admissionId: string,
    formData?: { startDate: string; endDate: string; selectProvider: string }
  ) => void
  onRemoveFromWaitlist?: (patientId: string, admissionId: string) => void
}

/**
 * AdmissionWaitlistDialog - Manage waitlist for an admission.
 * Add current patient to waitlist and view/manage existing waitlist patients.
 */
const AdmissionWaitlistDialog: React.FC<AdmissionWaitlistDialogProps> = ({
  open,
  onOpenChange,
  admission,
  patientId,
  patientName,
  waitlistPatients,
  onAddPatientToWaitlist,
  onRemoveFromWaitlist,
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [addFormData, setAddFormData] = useState({
    startDate: '',
    endDate: '',
    selectProvider: '',
  })
  const [waitlistFilters, setWaitlistFilters] = useState({
    program: '',
    person: '',
    status: '',
    waitListFrom: '',
    waitListTo: '',
  })

  const [waitlistColumnConfigs, setWaitlistColumnConfigs] = useState<ColumnConfig[]>([
    { id: 'person', label: 'Person', visible: true, category: 'basic', required: true },
    { id: 'status', label: 'Status', visible: true, category: 'basic' },
    { id: 'phone', label: 'Phone', visible: true, category: 'basic' },
    { id: 'ss', label: 'SS', visible: true, category: 'basic' },
    { id: 'dob', label: 'DOB', visible: true, category: 'basic' },
    { id: 'pid', label: 'PID', visible: true, category: 'basic' },
    { id: 'externalId', label: 'External ID', visible: true, category: 'basic' },
    { id: 'waitlistDate', label: 'Waitlist Date', visible: true, category: 'dates' },
    { id: 'priority', label: 'Priority', visible: true, category: 'basic' },
    { id: 'actions', label: 'Actions', visible: true, category: 'basic', required: true },
  ])

  const handleAddToWaitlist = useCallback(() => {
    onAddPatientToWaitlist(patientId, admission.id, addFormData)
    setAddFormData({ startDate: '', endDate: '', selectProvider: '' })
  }, [patientId, admission.id, onAddPatientToWaitlist, addFormData])

  const handleWaitlistFilterChange = useCallback((field: string, value: string | boolean) => {
    setWaitlistFilters((prev) => ({ ...prev, [field]: value }))
  }, [])

  const clearWaitlistFilters = useCallback(() => {
    setWaitlistFilters({
      program: '',
      person: '',
      status: '',
      waitListFrom: '',
      waitListTo: '',
    })
  }, [])

  const waitlistRowData = useMemo(() => {
    let filtered = [...waitlistPatients]
    if (waitlistFilters.person) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(waitlistFilters.person.toLowerCase())
      )
    }
    if (waitlistFilters.status) {
      filtered = filtered.filter(
        (p) => p.status?.toLowerCase() === waitlistFilters.status.toLowerCase()
      )
    }
    if (waitlistFilters.waitListFrom) {
      filtered = filtered.filter(
        (p) => (p.waitlistDate || '') >= waitlistFilters.waitListFrom
      )
    }
    if (waitlistFilters.waitListTo) {
      filtered = filtered.filter(
        (p) => (p.waitlistDate || '') <= waitlistFilters.waitListTo
      )
    }
    return filtered
  }, [waitlistPatients, waitlistFilters])

  const handlePrintWaitlist = useCallback(() => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const visibleColumns = waitlistColumnConfigs.filter((col) => col.visible)
    printWindow.document.write(`
      <html><head><title>Waitlist Report</title></head><body>
      <h1>Waitlist Report - ${admission.program}</h1>
      <p><strong>Admission:</strong> ${admission.admitDate}</p>
      <p><strong>Total Patients:</strong> ${waitlistRowData.length}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
      <thead><tr>
        ${visibleColumns.map((c) => `<th>${c.label}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${waitlistRowData
          .map(
            (p) =>
              `<tr><td>${p.name}</td><td>${p.status || '-'}</td><td>${p.phone || '-'}</td><td>${p.ss || '-'}</td><td>${p.dob || '-'}</td><td>${p.pid || '-'}</td><td>${p.externalId || '-'}</td><td>${p.waitlistDate || '-'}</td><td>${p.priority || '-'}</td></tr>`
          )
          .join('')}
      </tbody></table>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }, [waitlistRowData, waitlistColumnConfigs, admission])

  const handleExportCSV = useCallback(() => {
    const visibleColumns = waitlistColumnConfigs.filter((col) => col.visible)
    const headers = visibleColumns.map((c) => c.label).join(',')
    const rows = waitlistRowData.map((p) => {
      const values = [
        p.name,
        p.status || '',
        p.phone || '',
        p.ss || '',
        p.dob || '',
        p.pid || '',
        p.externalId || '',
        p.waitlistDate || '',
        p.priority || '',
      ]
      return values.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    })
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `admission_waitlist_${admission.id}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [waitlistRowData, waitlistColumnConfigs, admission.id])

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: 'Person',
        field: 'name',
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 bg-orange-400 rounded-full"
              title="On waitlist"
            />
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Status',
        field: 'status',
        minWidth: 180,
        cellRenderer: (params: any) => {
          const status = params.value || 'Active'
          let colorClass = 'text-gray-800'
          let bgClass = 'bg-gray-100'
          switch (status) {
            case 'Active':
              colorClass = 'text-green-800'
              bgClass = 'bg-green-100'
              break
            case 'Successfully Placed':
              colorClass = 'text-blue-800'
              bgClass = 'bg-blue-100'
              break
            case 'Ineligible':
              colorClass = 'text-red-800'
              bgClass = 'bg-red-100'
              break
            case 'Removed at Client Request':
              colorClass = 'text-orange-800'
              bgClass = 'bg-orange-100'
              break
            case 'Removed - Ineligible':
              colorClass = 'text-red-800'
              bgClass = 'bg-red-100'
              break
            case 'Removed - Already Taken Care':
              colorClass = 'text-gray-800'
              bgClass = 'bg-gray-100'
              break
            default:
              colorClass = 'text-gray-800'
              bgClass = 'bg-gray-100'
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
            >
              {status}
            </span>
          )
        },
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
        ),
      },
      {
        headerName: 'Priority',
        field: 'priority',
        minWidth: 100,
        cellRenderer: (params: any) => {
          const priority = params.value || 'Standard'
          const colorClass =
            priority === 'High'
              ? 'bg-red-100 text-red-800'
              : priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {priority}
            </span>
          )
        },
      },
      ...(onRemoveFromWaitlist
        ? [
            {
              headerName: 'Actions',
              field: 'actions',
              minWidth: 180,
              maxWidth: 180,
              cellStyle: { textAlign: 'right' },
              headerClass: 'text-right',
              cellRenderer: (params: any) => (
                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      onRemoveFromWaitlist(params.data.id, admission.id)
                    }
                  >
                    Remove
                  </Button>
                </div>
              ),
              suppressMenu: true,
              pinned: 'right' as const,
            },
          ]
        : []),
    ],
    [admission.id, onRemoveFromWaitlist]
  )

  const isPatientOnWaitlist = waitlistPatients.some((p) => p.id === patientId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="waitlist-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">Wait List - {admission.program}</DialogTitle>
        <DialogDescription id="waitlist-dialog-desc" className="sr-only">
          Add the current patient to the waitlist or manage existing waitlist
          patients for this admission.
        </DialogDescription>

        {/* Dialog Title - matches New Admission */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">Wait List - {admission.program}</h2>
        </div>

        {/* Main content - matches New Admission layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          <div className="min-w-0 flex-1 min-h-0 p-4 sm:p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Section: Add Patient to Waitlist */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <UserPlusIcon className="w-4 h-4 text-orange-600" />
                  Add Patient to Waitlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        type="date"
                        value={addFormData.startDate}
                        onChange={(e) =>
                          setAddFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="pr-9"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        type="date"
                        value={addFormData.endDate}
                        onChange={(e) =>
                          setAddFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="pr-9"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Select Provider <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={addFormData.selectProvider}
                    onValueChange={(value) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        selectProvider: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="--- Select ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin, Ensoftek</SelectItem>
                      <SelectItem value="specialist">Specialist, ENT</SelectItem>
                      <SelectItem value="dr-smith">Dr. Sarah Smith</SelectItem>
                      <SelectItem value="dr-wilson">Dr. John Wilson</SelectItem>
                      <SelectItem value="nurse-johnson">Nurse Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      Patient
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {patientName}
                      {patientId && (
                        <span className="text-gray-500 font-normal ml-1">
                          ({patientId})
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      Program
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {admission.program}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleAddToWaitlist}
                    disabled={
                      isPatientOnWaitlist ||
                      !addFormData.startDate ||
                      !addFormData.endDate ||
                      !addFormData.selectProvider
                    }
                    title={
                      isPatientOnWaitlist
                        ? 'Patient is already on waitlist'
                        : !addFormData.startDate || !addFormData.endDate || !addFormData.selectProvider
                          ? 'Please fill all required fields'
                          : 'Add to waitlist'
                    }
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    {isPatientOnWaitlist ? 'Already on Waitlist' : 'Add to Wait List'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section: Waitlist */}
            <Card className="shadow-none border-gray-200 shrink-0">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                  Waitlist ({waitlistRowData.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Waitlist Filters */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  <div
                    className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                  >
                    {filtersExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500 transform -rotate-90" />
                    )}
                    <FunnelIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Waitlist Filters
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      (
                      {Object.values(waitlistFilters).filter(
                        (v) => v && v !== ''
                      ).length}{' '}
                      active)
                    </span>
                    <div className="ml-auto">
                      {Object.values(waitlistFilters).filter(
                        (v) => v && v !== ''
                      ).length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearWaitlistFilters()
                          }}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>
                  {filtersExpanded && (
                    <div className="px-4 pt-4 pb-4 border-t border-gray-200 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Person
                          </label>
                          <Input
                            type="text"
                            placeholder="Search by name"
                            value={waitlistFilters.person}
                            onChange={(e) =>
                              handleWaitlistFilterChange('person', e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Status
                          </label>
                          <Select
                            value={waitlistFilters.status}
                            onValueChange={(value) =>
                              handleWaitlistFilterChange('status', value)
                            }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Successfully Placed">
                                Successfully Placed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Wait List From
                          </label>
                          <Input
                            type="date"
                            value={waitlistFilters.waitListFrom}
                            onChange={(e) =>
                              handleWaitlistFilterChange(
                                'waitListFrom',
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Wait List To
                          </label>
                          <Input
                            type="date"
                            value={waitlistFilters.waitListTo}
                            onChange={(e) =>
                              handleWaitlistFilterChange(
                                'waitListTo',
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shrink-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700">
                        <strong>Filtered Results:</strong> {waitlistRowData.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePrintWaitlist}
                        className="text-xs h-8 px-3"
                        title="Print waitlist report"
                      >
                        <PrinterIcon className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportCSV}
                        className="text-xs h-8 px-3"
                        title="Export to CSV"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Export CSV
                      </Button>
                      <ColumnCustomizer
                        columns={waitlistColumnConfigs}
                        onColumnsChange={setWaitlistColumnConfigs}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Waitlist Table - matches AddPatientsModal - explicit height required for AG Grid */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[400px]">
                  {waitlistPatients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                      <ClockIcon className="w-16 h-16 mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No Waitlist Patients
                      </h3>
                      <p className="text-sm text-center max-w-md">
                        There are currently no patients on the waitlist for this
                        admission. Use &quot;Add to Wait List&quot; above to add the
                        current patient.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full w-full">
                      <DataTable
                        rowData={waitlistRowData}
                        columnDefs={columnDefs}
                        className="h-full"
                        gridOptions={{
                          domLayout: 'normal',
                          getRowId: (data: any) => data.data.id,
                          pagination: true,
                          paginationPageSize: 10,
                          overlayNoRowsTemplate:
                            '<span>No waitlist patients found.</span>',
                          headerHeight: 40,
                          rowHeight: 50,
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdmissionWaitlistDialog
export type { WaitlistPatient }
