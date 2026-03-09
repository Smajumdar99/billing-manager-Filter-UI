import { FC, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { PencilIcon, TrashIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { format } from 'date-fns'

interface StatusSheetRecord {
  id: string
  date: string
  statusAtBeginning: string
  statusAtEnd: string
  weeklyGoals: string
  dailyExpectation: string
  overnight: boolean
  school: boolean
  milieu: boolean
  expectationMetFilled: boolean
  messAssignmentFilled: boolean
}

const MOCK_RECORDS: StatusSheetRecord[] = [
  {
    id: '1',
    date: '05/03/2026',
    statusAtBeginning: 'ready',
    statusAtEnd: 'nn',
    weeklyGoals: '1 12\n2 122',
    dailyExpectation: 'reee',
    overnight: true,
    school: true,
    milieu: true,
    expectationMetFilled: false,
    messAssignmentFilled: false,
  },
  {
    id: '2',
    date: '04/03/2026',
    statusAtBeginning: 'stable',
    statusAtEnd: 'stable',
    weeklyGoals: '1 12',
    dailyExpectation: 'Complete tasks',
    overnight: true,
    school: false,
    milieu: true,
    expectationMetFilled: true,
    messAssignmentFilled: false,
  },
  {
    id: '3',
    date: '03/03/2026',
    statusAtBeginning: 'anxious',
    statusAtEnd: 'calm',
    weeklyGoals: '2 122\n3 333',
    dailyExpectation: 'Attend therapy',
    overnight: false,
    school: true,
    milieu: true,
    expectationMetFilled: false,
    messAssignmentFilled: true,
  },
]

const TABLE_HEADERS = [
  'Date',
  'Status at Beginning',
  'Status at End',
  'Weekly Goals',
  'Daily Expectation',
  'Overnight',
  'School',
  'Milieu',
  'Expectation Met?',
  'Mess / Assignment',
  'Actions',
] as const

type TableHeader = (typeof TABLE_HEADERS)[number]
type SortKey = keyof Pick<
  StatusSheetRecord,
  | 'date'
  | 'statusAtBeginning'
  | 'statusAtEnd'
  | 'weeklyGoals'
  | 'dailyExpectation'
  | 'overnight'
  | 'school'
  | 'milieu'
  | 'expectationMetFilled'
  | 'messAssignmentFilled'
>

const HEADER_TO_KEY: Record<TableHeader, SortKey | null> = {
  Date: 'date',
  'Status at Beginning': 'statusAtBeginning',
  'Status at End': 'statusAtEnd',
  'Weekly Goals': 'weeklyGoals',
  'Daily Expectation': 'dailyExpectation',
  Overnight: 'overnight',
  School: 'school',
  Milieu: 'milieu',
  'Expectation Met?': 'expectationMetFilled',
  'Mess / Assignment': 'messAssignmentFilled',
  Actions: null,
}

const StatusSheetPage: FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const patientName = patientId?.includes(' (')
    ? patientId.split(' (')[0]
    : patientId || 'Patient'

  const [fromDate, setFromDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [endDate, setEndDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [records] = useState<StatusSheetRecord[]>(MOCK_RECORDS)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Clients', href: '/old-ui' },
    { label: patientName, href: '/old-ui' },
    { label: 'Status Sheet' },
  ]

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return records
    const { key, direction } = sortConfig
    const multiplier = direction === 'asc' ? 1 : -1

    return [...records].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return (Number(aVal) - Number(bVal)) * multiplier
      }

      if (key === 'date') {
        const aDate = new Date(aVal as string).getTime()
        const bDate = new Date(bVal as string).getTime()
        return (aDate - bDate) * multiplier
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      if (aStr < bStr) return -1 * multiplier
      if (aStr > bStr) return 1 * multiplier
      return 0
    })
  }, [records, sortConfig])

  const handleSort = (header: TableHeader) => {
    const key = HEADER_TO_KEY[header]
    if (!key) return

    setSortConfig((current) => {
      if (current?.key === key) {
        const nextDirection = current.direction === 'asc' ? 'desc' : 'asc'
        return { key, direction: nextDirection }
      }
      return { key, direction: 'asc' }
    })
  }

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

  const handleBackToResident = () => {
    navigate('/old-ui')
  }

  const handleAdd = () => {
    console.log('Add status sheet entry')
  }

  const handleRefresh = () => {
    console.log('Refresh status sheet')
  }

  const handleFillExpectation = (id: string) => {
    console.log('Fill expectation met for:', id)
  }

  const handleFillMessAssignment = (id: string) => {
    console.log('Fill mess/assignment for:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete:', id)
  }

  const handlePrint = (id: string) => {
    console.log('Print:', id)
    window.print()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopNavigationBar
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
        onSearch={(term) => console.log('Search:', term)}
      />

      <MainNavigationBar
        activeItem="Clients"
        onNavigate={handleMainNavigation}
      />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="container mx-auto px-6 py-6 max-w-7xl">
            {/* Filter Bar with Actions */}
            <div className="bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">From Date</label>
                  <Input
                    type="text"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="h-8 w-[130px] text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">End Date</label>
                  <Input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="h-8 w-[130px] text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAdd}
                  className="h-8 px-3 text-xs flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add
                </Button>
              </div>
            </div>

            {/* Data Table - compact layout with sticky Actions */}
            <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full min-w-[1000px] border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {TABLE_HEADERS.map((header) => (
                        <th
                          key={header}
                          className={`px-3 py-2 text-[11px] font-semibold text-slate-500 whitespace-nowrap text-left ${
                            header === 'Actions'
                              ? 'sticky right-0 z-20 w-[120px] min-w-[120px] bg-slate-50 border-l border-slate-200 pl-4 shadow-[-6px_0_10px_-4px_rgba(15,23,42,0.25)]'
                              : ''
                          } ${header !== 'Date' && header !== 'Actions' ? 'border-l border-slate-100' : ''}`}
                        >
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 ${
                              HEADER_TO_KEY[header] ? 'cursor-pointer hover:text-slate-700' : 'cursor-default'
                            }`}
                            onClick={() => handleSort(header)}
                            disabled={!HEADER_TO_KEY[header]}
                          >
                            <span>{header}</span>
                            {HEADER_TO_KEY[header] && (
                              <span className="text-[10px] text-slate-300">
                                {sortConfig?.key === HEADER_TO_KEY[header]
                                  ? sortConfig.direction === 'asc'
                                    ? '▲'
                                    : '▼'
                                  : '⇵'}
                              </span>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="py-2 px-3 text-xs text-slate-800 whitespace-nowrap align-middle">
                          {row.date}
                        </td>
                        <td className="py-2 px-3 text-xs text-slate-800 whitespace-nowrap align-middle border-l border-slate-100">
                          {row.statusAtBeginning}
                        </td>
                        <td className="py-2 px-3 text-xs text-slate-800 whitespace-nowrap align-middle border-l border-slate-100">
                          {row.statusAtEnd}
                        </td>
                        <td className="py-2 px-3 text-xs text-slate-800 whitespace-pre-line max-w-[120px] align-middle border-l border-slate-100">
                          {row.weeklyGoals}
                        </td>
                        <td className="py-2 px-3 text-xs text-slate-800 whitespace-nowrap max-w-[140px] align-middle border-l border-slate-100">
                          {row.dailyExpectation}
                        </td>
                        <td className="py-2 px-3 align-middle border-l border-slate-100">
                          {row.overnight ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                              title="Edit this form"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 align-middle border-l border-slate-100">
                          {row.school ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                              title="Edit this form"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 align-middle border-l border-slate-100">
                          {row.milieu ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                              title="Edit this form"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 align-middle border-l border-slate-100">
                          {row.expectationMetFilled ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                              title="Edit this form"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFillExpectation(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
                              title="Fill out this form"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>Fill</span>
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-3 align-middle border-l border-slate-100">
                          {row.messAssignmentFilled ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                              title="Edit this form"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFillMessAssignment(row.id)}
                              className="group inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
                              title="Fill out this form"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>Fill</span>
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-3 sticky right-0 z-10 w-[120px] min-w-[120px] bg-white border-l border-slate-200 pl-3 shadow-[-6px_0_10px_-4px_rgba(15,23,42,0.25)] align-middle h-full">
                          <div className="flex items-center justify-start gap-1.5 items-center h-full">
                            <button
                              type="button"
                              onClick={() => handleEdit(row.id)}
                              className="w-9 h-9 flex items-center justify-center rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                              aria-label="Edit"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id)}
                              className="w-9 h-9 flex items-center justify-center rounded text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                              aria-label="Delete"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrint(row.id)}
                              className="w-9 h-9 flex items-center justify-center rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                              aria-label="Print"
                              title="Print"
                            >
                              <PrinterIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusSheetPage
