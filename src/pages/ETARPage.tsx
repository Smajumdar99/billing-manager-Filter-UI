import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CalendarIcon, PlusIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { DataTable } from '@/components/organisms/DataTable'
import AddTreatmentDialog from '@/components/molecules/AddTreatmentDialog'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { ColDef } from 'ag-grid-community'
import { format } from 'date-fns'

interface TreatmentRecord {
  id: string
  startDate: string
  endDate: string
  treatmentMedication: string
  drug: string
  strength: string
  dosage: string
  route: string
  frequency: string
  enteredBy: string
  orderedBy: string
  count: string
}

const MOCK_TREATMENTS: TreatmentRecord[] = [
  {
    id: '1',
    startDate: '02/01/2025',
    endDate: '02/14/2025',
    treatmentMedication: 'Sertraline',
    drug: 'Zoloft',
    strength: '50 mg',
    dosage: '1 tablet',
    route: 'Oral',
    frequency: 'Once daily',
    enteredBy: 'Dr. Smith',
    orderedBy: 'Dr. Smith',
    count: '14',
  },
  {
    id: '2',
    startDate: '02/05/2025',
    endDate: '02/12/2025',
    treatmentMedication: 'Lorazepam',
    drug: 'Ativan',
    strength: '0.5 mg',
    dosage: '1 tablet',
    route: 'Oral',
    frequency: 'As needed',
    enteredBy: 'Nurse Johnson',
    orderedBy: 'Dr. Smith',
    count: '7',
  },
  {
    id: '3',
    startDate: '02/08/2025',
    endDate: '02/15/2025',
    treatmentMedication: 'Metformin',
    drug: 'Glucophage',
    strength: '500 mg',
    dosage: '2 tablets',
    route: 'Oral',
    frequency: 'Twice daily',
    enteredBy: 'Dr. Wilson',
    orderedBy: 'Dr. Wilson',
    count: '14',
  },
]

const ETARPage: FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const patientName = patientId?.includes(' (')
    ? patientId.split(' (')[0]
    : patientId || 'Patient'

  const [startDate, setStartDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [endDate, setEndDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [treatments, setTreatments] = useState<TreatmentRecord[]>(MOCK_TREATMENTS)
  const [showAddTreatmentDialog, setShowAddTreatmentDialog] = useState(false)

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Clients', href: '/old-ui' },
    {
      label: patientName,
      href: patientId ? `/admit-pause-discharge/${encodeURIComponent(patientId)}` : undefined,
    },
    { label: 'ETAR', href: undefined },
  ]

  const handleRefresh = () => {
    // TODO: Fetch treatments from API based on startDate, endDate, patientId
    setTreatments(MOCK_TREATMENTS)
  }

  useEffect(() => {
    setTreatments(MOCK_TREATMENTS)
  }, [patientId])

  const handleMainNavigation = (itemName: string) => {
    if (itemName === 'Dashboard') navigate('/old-ui-dashboard')
    else if (itemName === 'Inbox') navigate('/task-hub')
    else if (itemName === 'Settings') navigate('/settings')
    else if (itemName === 'Schedule') navigate('/my-calendar')
    else if (itemName === 'Clients') navigate('/old-ui')
    else if (itemName === 'Staff Dashboard') navigate('/staff-dashboard')
    else if (itemName === 'Billing') navigate('/billing')
    else if (itemName === 'Practice') navigate('/practice')
    else if (itemName === 'Reports') navigate('/reports')
    else if (itemName === 'Administration') navigate('/administration')
    else if (itemName === 'Wait List') navigate('/wait-list')
  }

  const handleSearch = (searchTerm: string) => {
    console.log('Search:', searchTerm)
  }

  const handleAdd = () => {
    setShowAddTreatmentDialog(true)
  }

  const handleAddTreatmentSave = (data: Record<string, unknown>) => {
    console.log('Add treatment save:', data)
    // TODO: Add to treatments and persist
  }

  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    if (patientId) {
      navigate(`/admit-pause-discharge/${encodeURIComponent(patientId)}`)
    } else {
      navigate(-1)
    }
  }

  const columnDefs: ColDef<TreatmentRecord>[] = [
    { field: 'startDate', headerName: 'Start Date', sortable: true, filter: true, width: 110 },
    { field: 'endDate', headerName: 'End Date', sortable: true, filter: true, width: 110 },
    { field: 'treatmentMedication', headerName: 'Treatment/Medication', sortable: true, filter: true, flex: 1 },
    { field: 'drug', headerName: 'Drug', sortable: true, filter: true, width: 120 },
    { field: 'strength', headerName: 'Strength', sortable: true, filter: true, width: 100 },
    { field: 'dosage', headerName: 'Dosage', sortable: true, filter: true, width: 100 },
    { field: 'route', headerName: 'Route', sortable: true, filter: true, width: 90 },
    { field: 'frequency', headerName: 'Frequency', sortable: true, filter: true, width: 100 },
    { field: 'enteredBy', headerName: 'Entered By', sortable: true, filter: true, width: 120 },
    { field: 'orderedBy', headerName: 'Ordered By', sortable: true, filter: true, width: 120 },
    { field: 'count', headerName: 'Count', sortable: true, filter: true, width: 80 },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="no-print">
        <TopNavigationBar
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
          onSearch={handleSearch}
        />
      </div>

      <div className="no-print">
        <MainNavigationBar
          activeItem="Clients"
          onNavigate={handleMainNavigation}
        />
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="bg-white border-b border-gray-200 px-6 py-3 no-print flex items-center justify-between gap-4">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={handleAdd}>
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <PrinterIcon className="h-4 w-4 mr-1.5" />
                Print
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close and go back"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="container mx-auto px-6 py-6 max-w-7xl">
            {/* Date range filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Start Date:</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 w-[140px]"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">End Date:</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 w-[140px]"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Refresh
              </Button>
            </div>

            {/* Treatments table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-[400px] w-full">
                <DataTable
                  rowData={treatments}
                  columnDefs={columnDefs}
                  gridOptions={{
                    overlayNoRowsTemplate:
                      '<span class="ag-overlay-no-rows-center">There are no treatment(s) for this patient.</span>',
                    domLayout: 'normal',
                  }}
                  className="h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddTreatmentDialog
        open={showAddTreatmentDialog}
        onOpenChange={setShowAddTreatmentDialog}
        onSave={handleAddTreatmentSave}
      />
    </div>
  )
}

export default ETARPage
