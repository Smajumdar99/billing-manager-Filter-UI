import { FC, useMemo, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  ViewColumnsIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { format, parse } from 'date-fns'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

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

  const [searchQuery, setSearchQuery] = useState('')
  const [fromDate, setFromDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [endDate, setEndDate] = useState(format(new Date(), 'MM/dd/yyyy'))
  const [openFromCalendar, setOpenFromCalendar] = useState(false)
  const [openToCalendar, setOpenToCalendar] = useState(false)

  const parseDate = (str: string): Date => {
    try {
      const d = parse(str, 'MM/dd/yyyy', new Date())
      return isNaN(d.getTime()) ? new Date() : d
    } catch {
      return new Date()
    }
  }
  const [records] = useState<StatusSheetRecord[]>(MOCK_RECORDS)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
  const [columnFilters, setColumnFilters] = useState<Partial<Record<SortKey, string>>>({})
  const [openMenuHeader, setOpenMenuHeader] = useState<TableHeader | null>(null)
  const [openFilterHeader, setOpenFilterHeader] = useState<TableHeader | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [filterPosition, setFilterPosition] = useState<{ top: number; left: number } | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const menuRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Clients', href: '/old-ui' },
    { label: patientName, href: '/old-ui' },
    { label: 'Status Sheet' },
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const inMenu = menuRef.current?.contains(target)
      const inFilter = filterRef.current?.contains(target)
      if (!inMenu && !inFilter) {
        setOpenMenuHeader(null)
        setOpenFilterHeader(null)
        setMenuPosition(null)
        setFilterPosition(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredRecords = useMemo(() => {
    const keys = Object.keys(columnFilters) as SortKey[]
    if (keys.every((k) => !columnFilters[k]?.trim())) return records
    return records.filter((row) =>
      keys.every((key) => {
        const q = (columnFilters[key] || '').trim().toLowerCase()
        if (!q) return true
        const val = row[key]
        return String(val ?? '').toLowerCase().includes(q)
      })
    )
  }, [records, columnFilters])

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords
    const { key, direction } = sortConfig
    const multiplier = direction === 'asc' ? 1 : -1

    return [...filteredRecords].sort((a, b) => {
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
  }, [filteredRecords, sortConfig])

  const totalFiltered = sortedRecords.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedRecords = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedRecords.slice(start, start + pageSize)
  }, [sortedRecords, pageSize, safePage])

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
    setOpenMenuHeader(null)
  }

  const handleSortByDirection = (header: TableHeader, direction: 'asc' | 'desc') => {
    const key = HEADER_TO_KEY[header]
    if (!key) return
    setSortConfig({ key, direction })
    setOpenMenuHeader(null)
  }

  const setFilter = (key: SortKey, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
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
            {/* Filter Bar: Search + count left, Date range + Add right (no box, compact height) */}
            <div className="flex items-end justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-56 shrink-0">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search status sheets..."
                    className="h-8 w-full rounded border border-slate-200 bg-white py-1 pl-8 pr-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    aria-label="Search status sheets"
                  />
                </div>
                <span className="text-sm text-slate-600 whitespace-nowrap">
                  {totalFiltered} {totalFiltered === 1 ? 'status sheet' : 'status sheets'}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs font-medium text-slate-700">From</label>
                  <Popover.Root open={openFromCalendar} onOpenChange={setOpenFromCalendar}>
                    <Popover.Trigger asChild>
                      <div className="relative flex h-8 w-[120px] cursor-pointer items-center rounded border border-slate-200 bg-white pl-8 pr-2.5 text-sm text-slate-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                        <CalendarDaysIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <span className={fromDate ? '' : 'text-slate-400'}>{fromDate || 'MM/DD/YYYY'}</span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50 rounded-lg border border-slate-200 bg-white p-2 shadow-lg" sideOffset={4} align="start">
                        <DayPicker
                          mode="single"
                          selected={parseDate(fromDate)}
                          onSelect={(date) => {
                            if (date) {
                              setFromDate(format(date, 'MM/dd/yyyy'))
                              setOpenFromCalendar(false)
                            }
                          }}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs font-medium text-slate-700">To</label>
                  <Popover.Root open={openToCalendar} onOpenChange={setOpenToCalendar}>
                    <Popover.Trigger asChild>
                      <div className="relative flex h-8 w-[120px] cursor-pointer items-center rounded border border-slate-200 bg-white pl-8 pr-2.5 text-sm text-slate-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                        <CalendarDaysIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <span className={endDate ? '' : 'text-slate-400'}>{endDate || 'MM/DD/YYYY'}</span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50 rounded-lg border border-slate-200 bg-white p-2 shadow-lg" sideOffset={4} align="start">
                        <DayPicker
                          mode="single"
                          selected={parseDate(endDate)}
                          onSelect={(date) => {
                            if (date) {
                              setEndDate(format(date, 'MM/dd/yyyy'))
                              setOpenToCalendar(false)
                            }
                          }}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  className="h-8 px-3 text-xs flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
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
                      <th className="w-10 min-w-[2.5rem] px-2 py-2 text-[11px] font-semibold text-slate-500 whitespace-nowrap text-left border-r border-slate-100">
                        #
                      </th>
                      {TABLE_HEADERS.map((header) => (
                        <th
                          key={header}
                          className={`relative px-3 py-2 text-[11px] font-semibold text-slate-500 whitespace-nowrap text-left ${
                            header === 'Actions'
                              ? 'sticky right-0 z-20 w-[120px] min-w-[120px] bg-slate-50 border-l border-slate-200 pl-4 shadow-[-6px_0_10px_-4px_rgba(15,23,42,0.25)]'
                              : ''
                          } ${header !== 'Date' && header !== 'Actions' ? 'border-l border-slate-100' : ''}`}
                        >
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className={`inline-flex items-center gap-0.5 min-w-0 ${
                                HEADER_TO_KEY[header] ? 'cursor-pointer hover:text-slate-700' : 'cursor-default'
                              }`}
                              onClick={() => handleSort(header)}
                              disabled={!HEADER_TO_KEY[header]}
                            >
                              <span className="truncate">{header}</span>
                            </button>
                            {HEADER_TO_KEY[header] && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const rect = (e.target as HTMLElement).closest('button')!.getBoundingClientRect()
                                    if (openFilterHeader === header) {
                                      setOpenFilterHeader(null)
                                      setFilterPosition(null)
                                    } else {
                                      setFilterPosition({ top: rect.bottom + 4, left: rect.left })
                                      setOpenFilterHeader(header)
                                      setOpenMenuHeader(null)
                                      setMenuPosition(null)
                                    }
                                  }}
                                  className={`p-0.5 rounded hover:bg-slate-200 shrink-0 ${
                                    openFilterHeader === header ? 'bg-slate-200' : ''
                                  }`}
                                  title="Filter"
                                >
                                  <FunnelIcon className="h-3.5 w-3.5 text-slate-500" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const rect = (e.target as HTMLElement).closest('button')!.getBoundingClientRect()
                                    if (openMenuHeader === header) {
                                      setOpenMenuHeader(null)
                                      setMenuPosition(null)
                                    } else {
                                      setMenuPosition({ top: rect.bottom + 4, left: rect.left })
                                      setOpenMenuHeader(header)
                                      setOpenFilterHeader(null)
                                      setFilterPosition(null)
                                    }
                                  }}
                                  className="p-0.5 rounded hover:bg-slate-200 shrink-0"
                                  title="Column options"
                                >
                                  <EllipsisVerticalIcon className="h-3.5 w-3.5 text-slate-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((row, index) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="w-10 min-w-[2.5rem] py-2 px-2 text-xs text-slate-600 align-middle border-r border-slate-100">
                          {(safePage - 1) * pageSize + index + 1}
                        </td>
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

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Page size:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setPage(1)
                      }}
                      className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700"
                    >
                      {[10, 20, 50, 100].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs text-slate-600">
                    {(safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, totalFiltered)} of {totalFiltered}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={safePage <= 1}
                    className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="First page"
                  >
                    &laquo;
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="Previous page"
                  >
                    &lsaquo;
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="Next page"
                  >
                    &rsaquo;
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    disabled={safePage >= totalPages}
                    className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="Last page"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter popover - rendered outside table so it is not clipped */}
      {openFilterHeader && filterPosition && HEADER_TO_KEY[openFilterHeader] &&
        createPortal(
          <div
            ref={filterRef}
            className="w-48 rounded-md border border-slate-200 bg-white p-2 shadow-lg"
            style={{
              position: 'fixed',
              top: filterPosition.top,
              left: filterPosition.left,
              zIndex: 9999,
            }}
          >
            <input
              type="text"
              placeholder={`Search ${openFilterHeader}...`}
              value={columnFilters[HEADER_TO_KEY[openFilterHeader]!] ?? ''}
              onChange={(e) => setFilter(HEADER_TO_KEY[openFilterHeader]!, e.target.value)}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setFilter(HEADER_TO_KEY[openFilterHeader]!, '')
                setOpenFilterHeader(null)
                setFilterPosition(null)
              }}
              className="mt-1.5 w-full rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200"
            >
              Clear filter
            </button>
          </div>,
          document.body
        )}

      {/* Column options menu - rendered outside table so it is not clipped */}
      {openMenuHeader && menuPosition && HEADER_TO_KEY[openMenuHeader] &&
        createPortal(
          <div
            ref={menuRef}
            className="w-52 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 9999,
            }}
          >
            <button
              type="button"
              onClick={() => handleSortByDirection(openMenuHeader, 'asc')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ChevronUpIcon className="h-3.5 w-3.5 shrink-0" />
              Sort Ascending
            </button>
            <button
              type="button"
              onClick={() => handleSortByDirection(openMenuHeader, 'desc')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" />
              Sort Descending
            </button>
            <button
              type="button"
              onClick={() => { setOpenMenuHeader(null); setMenuPosition(null) }}
              className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                Pin Column
              </span>
              <ChevronRightIcon className="h-3 w-3 shrink-0 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => { setOpenMenuHeader(null); setMenuPosition(null) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ArrowsRightLeftIcon className="h-3.5 w-3.5 shrink-0" />
              Autosize This Column
            </button>
            <button
              type="button"
              onClick={() => { setOpenMenuHeader(null); setMenuPosition(null) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <Squares2X2Icon className="h-3.5 w-3.5 shrink-0" />
              Autosize All Columns
            </button>
            <button
              type="button"
              onClick={() => { setOpenMenuHeader(null); setMenuPosition(null) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ViewColumnsIcon className="h-3.5 w-3.5 shrink-0" />
              Choose Columns
            </button>
            <button
              type="button"
              onClick={() => { setOpenMenuHeader(null); setMenuPosition(null) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 shrink-0" />
              Reset Columns
            </button>
            {(columnFilters[HEADER_TO_KEY[openMenuHeader]!] ?? '').trim() && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    setFilter(HEADER_TO_KEY[openMenuHeader]!, '')
                    setOpenMenuHeader(null)
                    setMenuPosition(null)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear filter
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

export default StatusSheetPage
