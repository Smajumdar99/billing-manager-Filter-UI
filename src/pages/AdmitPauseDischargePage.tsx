import { FC, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import {
  UserPlusIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  UsersIcon,
  BuildingOffice2Icon,
  PencilIcon,
  TrashIcon,
  PauseIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import { NewAdmissionDialog, type NewAdmissionFormData } from '@/components/molecules/NewAdmissionDialog'
import AdmissionWaitlistDialog, { type WaitlistPatient } from '@/components/molecules/AdmissionWaitlistDialog'
import ProviderTeamHistoryDialog, { type ProviderHistoryEntry } from '@/components/molecules/ProviderTeamHistoryDialog'
import ManageTeamDialog, { type TeamHistoryEntry } from '@/components/molecules/ManageTeamDialog'
import RoomDetailsDialog, { type RoomDetailsEntry } from '@/components/molecules/RoomDetailsDialog'
import PauseDialog, { type PauseFormData } from '@/components/molecules/PauseDialog'
import DischargeDialog, { type DischargeFormData } from '@/components/molecules/DischargeDialog'
import TransferDialog, { type TransferFormData } from '@/components/molecules/TransferDialog'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'

export interface AdmissionRecord {
  id: string
  admitDate: string
  program: string
  currentProviders: string
  referringProvider: string
  referringNpi?: string
  lastUpdatedBy: string
  lastUpdatedOn: string
  dischargeDate?: string
  status: 'admitted' | 'paused' | 'discharged'
}

interface AdmitPauseDischargeData {
  patientId: string
  patientName: string
  admissions: AdmissionRecord[]
}

const btnIconClass = 'h-4 w-4 text-gray-500 shrink-0'

const statusStyles: Record<AdmissionRecord['status'], { badge: string; border: string; label: string }> = {
  admitted: { badge: 'bg-green-100 text-green-800', border: 'border-l-green-500', label: 'Admitted' },
  paused: { badge: 'bg-amber-100 text-amber-800', border: 'border-l-amber-500', label: 'Paused' },
  discharged: { badge: 'bg-gray-100 text-gray-700', border: 'border-l-gray-400', label: 'Discharged' }
}

const AdmissionActionsDropdown: FC<{
  admission: AdmissionRecord
  onAction: (admissionId: string, action: string) => void
}> = ({ admission, onAction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDischarged = admission.status === 'discharged'
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const handleAction = (action: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    onAction(admission.id, action)
    setIsOpen(false)
  }

  const toggle = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right - 208 + window.scrollX })
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fn = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const el = document.getElementById(`admission-dd-${admission.id}`)
        if (el && !el.contains(event.target as Node)) setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [isOpen, admission.id])

  const itemClass = 'w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left'
  const quickBtnClass = 'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors'
  return (
    <>
      {/* Pause and Discharge only for active (admitted/paused) admissions */}
      {!isDischarged && (
        <>
          <button
            type="button"
            onClick={(e) => handleAction('Pause', e)}
            className={`${quickBtnClass} text-amber-700 border-amber-200 hover:bg-amber-50`}
            title="Pause"
          >
            <PauseIcon className="h-4 w-4 shrink-0" />
            Pause
          </button>
          <button
            type="button"
            onClick={(e) => handleAction('Discharge', e)}
            className={quickBtnClass}
            title="Discharge"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0" />
            Discharge
          </button>
        </>
      )}
      <button
        ref={buttonRef}
        onClick={toggle}
        type="button"
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        title="Actions"
      >
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
      </button>
      {isOpen && createPortal(
        <div
          id={`admission-dd-${admission.id}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: '208px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            zIndex: 999999,
            padding: '4px 0',
          }}
        >
          <div className="py-1">
            <button type="button" className={itemClass} onClick={(e) => handleAction('Provider/Team History', e)}>
              <UserGroupIcon className={btnIconClass} /> Provider/Team History
            </button>
            <button type="button" className={itemClass} onClick={(e) => handleAction('Manage Team', e)}>
              <UsersIcon className={btnIconClass} /> Manage Team
            </button>
            <button type="button" className={itemClass} onClick={(e) => handleAction('Rooms', e)}>
              <BuildingOffice2Icon className={btnIconClass} /> Rooms
            </button>
            <button type="button" className={itemClass} onClick={(e) => handleAction('Edit', e)}>
              <PencilIcon className={btnIconClass} /> Edit
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button type="button" className={itemClass} onClick={(e) => handleAction('Transfer', e)}>
              <ArrowPathIcon className={btnIconClass} /> Transfer
            </button>
            <button type="button" className={itemClass} onClick={(e) => handleAction('Wait List', e)}>
              <ClockIcon className={btnIconClass} /> Wait List
            </button>
            <button type="button" className={itemClass} onClick={(e) => handleAction('ETAR', e)}>
              <DocumentTextIcon className={btnIconClass} /> ETAR
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-left"
              onClick={(e) => handleAction('Delete', e)}
            >
              <TrashIcon className="h-4 w-4 text-red-500 shrink-0" /> Delete
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

const AdmitPauseDischargePage: FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<AdmitPauseDischargeData | null>(null)
  const [showNewAdmissionDialog, setShowNewAdmissionDialog] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showDischargeDialog, setShowDischargeDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [selectedAdmissionForPause, setSelectedAdmissionForPause] = useState<AdmissionRecord | null>(null)
  const [selectedAdmissionForDischarge, setSelectedAdmissionForDischarge] = useState<AdmissionRecord | null>(null)
  const [selectedAdmissionForTransfer, setSelectedAdmissionForTransfer] = useState<AdmissionRecord | null>(null)
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false)
  const [showProviderTeamHistoryDialog, setShowProviderTeamHistoryDialog] = useState(false)
  const [showManageTeamDialog, setShowManageTeamDialog] = useState(false)
  const [selectedAdmissionForWaitlist, setSelectedAdmissionForWaitlist] = useState<AdmissionRecord | null>(null)
  const [selectedAdmissionForProviderHistory, setSelectedAdmissionForProviderHistory] = useState<AdmissionRecord | null>(null)
  const [selectedAdmissionForManageTeam, setSelectedAdmissionForManageTeam] = useState<AdmissionRecord | null>(null)
  const [showRoomDetailsDialog, setShowRoomDetailsDialog] = useState(false)
  const [selectedAdmissionForRoomDetails, setSelectedAdmissionForRoomDetails] = useState<AdmissionRecord | null>(null)
  const [roomDetails, setRoomDetails] = useState<RoomDetailsEntry[]>([
    { id: 'rd1', program: 'KSR Multispecialty Hospital', building: 'Main Tower', floor: '3', roomNo: '301', bedNo: 'A', allocatedDate: '06/16/2025 14:37:00', releasedDate: '', tentativeReleaseDate: '06/23/2025' },
    { id: 'rd2', program: 'KSR Multispecialty Hospital', building: 'East Wing', floor: '2', roomNo: '205', bedNo: 'B', allocatedDate: '06/15/2025 09:00:00', releasedDate: '06/16/2025 14:00:00', tentativeReleaseDate: '' },
  ])
  const [teamHistory, setTeamHistory] = useState<TeamHistoryEntry[]>([
    { id: 'th1', providerId: 'admin', providerName: 'Admin, Ensoftek', startDate: '06/16/2025 14:37:00', endDate: '' },
    { id: 'th2', providerId: 'specialist', providerName: 'Specialist, ENT', startDate: '06/15/2025 12:00:00', endDate: '06/16/2025 14:00:00' },
  ])
  const providerOptions = [
    { value: 'admin', label: 'Admin, Ensoftek', description: 'Primary' },
    { value: 'specialist', label: 'Specialist, ENT', description: 'ENT Specialist' },
    { value: 'dr-smith', label: 'Dr. Sarah Smith', description: 'Physician' },
    { value: 'dr-wilson', label: 'Dr. John Wilson', description: 'Physician' },
    { value: 'nurse-johnson', label: 'Nurse Johnson', description: 'RN' },
    { value: 'care-coord', label: 'Care Coordinator', description: 'Care Coordinator' },
  ]
  const [providerHistory, setProviderHistory] = useState<ProviderHistoryEntry[]>([
    { id: 'ph1', name: 'Admin, Ensoftek', startDate: '06/16/2025 14:37:00', endDate: '', providerType: 'Primary' },
    { id: 'ph2', name: 'Specialist, ENT', startDate: '06/15/2025 12:00:00', endDate: '06/16/2025 14:00:00', providerType: 'Secondary' },
  ])
  const [waitlistPatients, setWaitlistPatients] = useState<WaitlistPatient[]>([
    { id: 'wl1', name: 'Sarah Johnson', phone: '(555) 123-4567', ss: '***-**-1234', dob: '1985-03-15', pid: 'PID001', externalId: 'EXT001', status: 'Active', waitlistDate: '2024-08-10', priority: 'Standard' },
    { id: 'wl2', name: 'Michael Chen', phone: '(555) 234-5678', ss: '***-**-2345', dob: '1990-07-22', pid: 'PID002', externalId: 'EXT002', status: 'Active', waitlistDate: '2024-08-12', priority: 'High' },
    { id: 'wl3', name: 'Emily Davis', phone: '(555) 345-6789', ss: '***-**-3456', dob: '1978-11-05', pid: 'PID003', externalId: 'EXT003', status: 'Pending', waitlistDate: '2024-08-14', priority: 'Medium' },
  ])

  const patientName = patientId?.includes(' (')
    ? patientId.split(' (')[0]
    : patientId || 'Patient'

  useEffect(() => {
    const mockData: AdmitPauseDischargeData = {
      patientId: patientId || '',
      patientName,
      admissions: [
        {
          id: '1',
          admitDate: '06/16/2025 14:37:00',
          program: 'KSR Multispecialty Hospital',
          currentProviders: 'Admin, Ensoftek',
          referringProvider: 'Specialist, ENT',
          referringNpi: '9119111232',
          lastUpdatedBy: 'Admin, Ensoftek',
          lastUpdatedOn: '06/16/2025 14:37:30',
          status: 'admitted'
        },
        {
          id: '2',
          admitDate: '06/15/2025 12:06:00',
          program: 'A-AADO',
          currentProviders: 'Admin, Ensoftek',
          referringProvider: 'Specialist, ENT',
          referringNpi: '9119111232',
          lastUpdatedBy: 'Admin, Ensoftek',
          lastUpdatedOn: '06/15/2025 12:06:00',
          status: 'admitted'
        },
        {
          id: '3',
          admitDate: '05/20/2025 09:00:00',
          program: 'A-METH',
          currentProviders: 'Admin, Ensoftek',
          referringProvider: 'Specialist, ENT',
          referringNpi: '9119111232',
          lastUpdatedBy: 'Admin, Ensoftek',
          lastUpdatedOn: '06/01/2025 11:00:00',
          status: 'paused'
        },
        {
          id: '4',
          admitDate: '04/10/2025 08:00:00',
          program: 'KSR Multispecialty Hospital',
          currentProviders: 'Admin, Ensoftek',
          referringProvider: 'Specialist, ENT',
          referringNpi: '9119111232',
          lastUpdatedBy: 'Admin, Ensoftek',
          lastUpdatedOn: '05/30/2025 16:00:00',
          dischargeDate: '05/30/2025 16:00:00',
          status: 'discharged'
        },
        {
          id: '5',
          admitDate: '02/01/2025 10:00:00',
          program: 'A-AADO',
          currentProviders: 'Admin, Ensoftek',
          referringProvider: 'Specialist, ENT',
          referringNpi: '9119111232',
          lastUpdatedBy: 'Admin, Ensoftek',
          lastUpdatedOn: '03/15/2025 14:30:00',
          dischargeDate: '03/15/2025 14:30:00',
          status: 'discharged'
        }
      ]
    }
    setData(mockData)
  }, [patientId, patientName])

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Clients', href: '/clients' },
    { label: patientName, href: undefined },
    { label: 'Admit / Pause / Discharge', href: undefined }
  ]

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

  const handleAdmissionAction = (admissionId: string, action: string) => {
    if (action === 'New Admission') {
      setShowNewAdmissionDialog(true)
      return
    }
    if (action === 'Pause') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForPause(admission)
        setShowPauseDialog(true)
      }
      return
    }
    if (action === 'Discharge') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForDischarge(admission)
        setShowDischargeDialog(true)
      }
      return
    }
    if (action === 'Wait List') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForWaitlist(admission)
        setShowWaitlistDialog(true)
      }
      return
    }
    if (action === 'Provider/Team History') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForProviderHistory(admission)
        setShowProviderTeamHistoryDialog(true)
      }
      return
    }
    if (action === 'Manage Team') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForManageTeam(admission)
        setShowManageTeamDialog(true)
      }
      return
    }
    if (action === 'Rooms') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForRoomDetails(admission)
        setShowRoomDetailsDialog(true)
      }
      return
    }
    if (action === 'Transfer') {
      const admission = data?.admissions.find((a) => a.id === admissionId)
      if (admission) {
        setSelectedAdmissionForTransfer(admission)
        setShowTransferDialog(true)
      }
      return
    }
    if (action === 'ETAR') {
      if (patientId) {
        navigate(`/etar/${encodeURIComponent(patientId)}`)
      }
      return
    }
    console.log('Admission action:', admissionId, action)
  }

  const handleAddPatientToWaitlist = (
    pid: string,
    _admissionId: string,
    formData?: { startDate: string; endDate: string; selectProvider: string }
  ) => {
    if (!data) return
    if (waitlistPatients.some((p) => p.id === pid || p.pid === pid)) return
    const newPatient: WaitlistPatient = {
      id: pid,
      name: data.patientName,
      phone: '',
      ss: '',
      dob: '',
      pid,
      externalId: pid,
      status: 'Active',
      waitlistDate: formData?.startDate ?? new Date().toISOString().split('T')[0],
      priority: 'Standard',
    }
    setWaitlistPatients((prev) => [...prev, newPatient])
  }

  const handleRemoveFromWaitlist = (patientId: string, _admissionId: string) => {
    setWaitlistPatients((prev) => prev.filter((p) => p.id !== patientId && p.pid !== patientId))
  }

  const handleRemoveProvider = (providerId: string, _admissionId: string) => {
    setProviderHistory((prev) => prev.filter((p) => p.id !== providerId))
  }

  const handleAddProvidersToTeam = (providerIds: string[], _admissionId: string) => {
    const d = new Date()
    const now = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    const newEntries: TeamHistoryEntry[] = providerIds.map((id) => {
      const provider = providerOptions.find((p) => p.value === id)
      return {
        id: `th-${id}-${Date.now()}`,
        providerId: id,
        providerName: provider?.label ?? id,
        startDate: now,
        endDate: undefined,
      }
    })
    setTeamHistory((prev) => [...prev, ...newEntries])
  }

  const handleRemoveFromTeam = (entryId: string, _admissionId: string) => {
    setTeamHistory((prev) => prev.filter((t) => t.id !== entryId))
  }

  const handleRemoveRoom = (roomId: string, _admissionId: string) => {
    setRoomDetails((prev) => prev.filter((r) => r.id !== roomId))
  }

  const handleCheckRoomAvailability = (_admissionId: string) => {
    // TODO: Open room availability modal or navigate to room availability view
    console.log('Check room availability for admission:', _admissionId)
  }

  const handlePauseSubmit = (admissionId: string, formData: PauseFormData) => {
    console.log('Pause submitted for admission:', admissionId, formData)
    // TODO: Persist to backend; update admission status to 'paused'
    setData((prev) =>
      prev
        ? {
            ...prev,
            admissions: prev.admissions.map((a) =>
              a.id === admissionId ? { ...a, status: 'paused' as const } : a
            ),
          }
        : null
    )
  }

  const handleDischargeSubmit = (admissionId: string, formData: DischargeFormData) => {
    console.log('Discharge submitted for admission:', admissionId, formData)
    const dischargeDate = `${formData.dischargeDate} ${formData.dischargeTime}`
    setData((prev) =>
      prev
        ? {
            ...prev,
            admissions: prev.admissions.map((a) =>
              a.id === admissionId
                ? { ...a, status: 'discharged' as const, dischargeDate }
                : a
            ),
          }
        : null
    )
  }

  const handleTransferSubmit = (admissionId: string, formData: TransferFormData) => {
    console.log('Transfer submitted for admission:', admissionId, formData)
    const newProgram = transferProgramOptions.find((p) => p.value === formData.transferToFacility)?.label ?? formData.transferToFacility
    setData((prev) =>
      prev
        ? {
            ...prev,
            admissions: prev.admissions.map((a) =>
              a.id === admissionId ? { ...a, program: newProgram } : a
            ),
          }
        : null
    )
  }

  const transferProgramOptions = [
    { value: 'KSR Multispecialty Hospital', label: 'KSR Multispecialty Hospital' },
    { value: 'A-AADO', label: 'A-AADO' },
    { value: 'A-METH', label: 'A-METH' },
  ]

  const programLabels: Record<string, string> = {
    ksr: 'KSR Multispecialty Hospital',
    aado: 'A-AADO',
    ameth: 'A-METH'
  }
  const referringLabels: Record<string, string> = {
    specialist: 'Specialist, ENT',
    admin: 'Admin, Ensoftek'
  }

  const handleNewAdmissionSubmit = (formData: NewAdmissionFormData) => {
    console.log('New admission submitted:', formData)
    // TODO: persist to backend; for now add to mock data
    const newAdmission: AdmissionRecord = {
      id: String(Date.now()),
      admitDate: `${formData.admitDate} ${formData.admitTime}`,
      program: programLabels[formData.program] || formData.program || '—',
      currentProviders: formData.provider ? referringLabels[formData.provider] || formData.provider : 'Unassigned',
      referringProvider: formData.referringProvider ? referringLabels[formData.referringProvider] || formData.referringProvider : '—',
      referringNpi: formData.referringNpi || undefined,
      lastUpdatedBy: 'Current User',
      lastUpdatedOn: new Date().toLocaleString(),
      status: 'admitted'
    }
    setData((prev) =>
      prev ? { ...prev, admissions: [newAdmission, ...prev.admissions] } : null
    )
  }

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
          <div className="bg-white border-b border-gray-200 px-6 py-3 no-print">
            <div className="flex items-center justify-between gap-4">
              <Breadcrumb
                items={breadcrumbItems}
                onNavigate={(href) => {
                  if (href === '/clients') navigate('/old-ui')
                }}
              />
              <div className="flex items-center gap-3 shrink-0">
                {data && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      data.admissions.some((a) => a.status === 'admitted')
                        ? 'bg-green-100 text-green-800'
                        : data.admissions.some((a) => a.status === 'paused')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {data.admissions.some((a) => a.status === 'admitted')
                      ? 'Admitted'
                      : data.admissions.some((a) => a.status === 'paused')
                        ? 'Paused'
                        : data.admissions.length > 0
                          ? 'Discharged'
                          : '—'}
                  </span>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleAdmissionAction('', 'New Admission')}
                >
                  <UserPlusIcon className="h-4 w-4" />
                  New Admission
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {data ? (
              <div className="space-y-6">
                {(() => {
                  const activeAdmissions = data.admissions.filter((a) => a.status !== 'discharged')
                  const dischargedAdmissions = data.admissions.filter((a) => a.status === 'discharged')

                  const renderAdmissionRow = (admission: AdmissionRecord) => {
                    const style = statusStyles[admission.status]
                    return (
                      <div
                        key={admission.id}
                        className={`p-5 border-l-4 ${style.border} bg-white`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                                {style.label}
                              </span>
                            </div>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                              <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admit Date</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900">{admission.admitDate}</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Program</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900">{admission.program}</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Provider(s)</dt>
                                <dd className="mt-1 text-sm text-gray-900">{admission.currentProviders}</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referring Provider</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {admission.referringProvider}
                                  {admission.referringNpi && (
                                    <span className="text-gray-500 font-normal"> · NPI {admission.referringNpi}</span>
                                  )}
                                </dd>
                              </div>
                              {admission.status === 'discharged' && admission.dischargeDate && (
                                <div className="sm:col-span-2">
                                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Discharge Date</dt>
                                  <dd className="mt-1 text-sm font-medium text-gray-900">{admission.dischargeDate}</dd>
                                </div>
                              )}
                            </dl>
                            <p className="mt-3 text-xs text-gray-500">
                              Last updated by {admission.lastUpdatedBy} on {admission.lastUpdatedOn}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <AdmissionActionsDropdown admission={admission} onAction={handleAdmissionAction} />
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <>
                      {/* Active admissions (Admitted + Paused) */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Active admissions</h2>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {activeAdmissions.map(renderAdmissionRow)}
                        </div>
                        {activeAdmissions.length === 0 && (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            No active admissions. Use <strong>New Admission</strong> to add an admission.
                          </div>
                        )}
                      </div>

                      {/* Discharged admissions */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Discharged</h2>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {dischargedAdmissions.map(renderAdmissionRow)}
                        </div>
                        {dischargedAdmissions.length === 0 && (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            No discharged admissions on file.
                          </div>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                Loading…
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedAdmissionForPause && (
        <PauseDialog
          open={showPauseDialog}
          onOpenChange={setShowPauseDialog}
          admission={selectedAdmissionForPause}
          patientId={data?.patientId ? `${data.patientName} (${data.patientId})` : patientName}
          onSubmit={handlePauseSubmit}
        />
      )}

      {selectedAdmissionForDischarge && (
        <DischargeDialog
          open={showDischargeDialog}
          onOpenChange={setShowDischargeDialog}
          admission={selectedAdmissionForDischarge}
          patientId={data?.patientId ? `${data.patientName} (${data.patientId})` : patientName}
          onSubmit={handleDischargeSubmit}
        />
      )}

      {selectedAdmissionForTransfer && (
        <TransferDialog
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          admission={selectedAdmissionForTransfer}
          patientId={data?.patientId ? `${data.patientName} (${data.patientId})` : patientName}
          programOptions={transferProgramOptions}
          onSubmit={handleTransferSubmit}
        />
      )}

      <NewAdmissionDialog
        open={showNewAdmissionDialog}
        onClose={() => setShowNewAdmissionDialog(false)}
        onSubmit={handleNewAdmissionSubmit}
        patientId={data?.patientId ? `${data.patientName} (${data.patientId})` : patientName}
        patientName={patientName}
      />

      {selectedAdmissionForWaitlist && (
        <AdmissionWaitlistDialog
          open={showWaitlistDialog}
          onOpenChange={setShowWaitlistDialog}
          admission={selectedAdmissionForWaitlist}
          patientId={data?.patientId ?? ''}
          patientName={patientName}
          waitlistPatients={waitlistPatients}
          onAddPatientToWaitlist={handleAddPatientToWaitlist}
          onRemoveFromWaitlist={handleRemoveFromWaitlist}
        />
      )}

      {selectedAdmissionForProviderHistory && (
        <ProviderTeamHistoryDialog
          open={showProviderTeamHistoryDialog}
          onOpenChange={setShowProviderTeamHistoryDialog}
          admission={selectedAdmissionForProviderHistory}
          providerHistory={providerHistory}
          onRemoveProvider={handleRemoveProvider}
        />
      )}

      {selectedAdmissionForManageTeam && (
        <ManageTeamDialog
          open={showManageTeamDialog}
          onOpenChange={setShowManageTeamDialog}
          admission={selectedAdmissionForManageTeam}
          providerOptions={providerOptions}
          teamHistory={teamHistory}
          onAddProviders={handleAddProvidersToTeam}
          onRemoveFromTeam={handleRemoveFromTeam}
        />
      )}

      {selectedAdmissionForRoomDetails && (
        <RoomDetailsDialog
          open={showRoomDetailsDialog}
          onOpenChange={setShowRoomDetailsDialog}
          admission={selectedAdmissionForRoomDetails}
          roomDetails={roomDetails}
          onRemoveRoom={handleRemoveRoom}
          onCheckRoomAvailability={handleCheckRoomAvailability}
        />
      )}
    </div>
  )
}

export default AdmitPauseDischargePage
