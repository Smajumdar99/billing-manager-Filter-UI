import { FC, useState, useCallback } from 'react'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from '@/components/atoms/Tooltip/tooltip'
import { BillingEncounter } from '@/types/billing-manager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BanknotesIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export interface BillingQueueTableProps {
  encounters: BillingEncounter[]
  onEncounterSelect: (encounterId: string, selected: boolean) => void
  onEncounterEdit: (encounter: BillingEncounter) => void
  onEncounterClick?: (encounter: BillingEncounter) => void
  onGenerateClaim: (encounter: BillingEncounter) => void
  onViewErrors: (encounter: BillingEncounter) => void
  onBillingOverrideToggle: (encounterId: string, enabled: boolean) => void
  onHcfaBillTypeChange: (encounterId: string, billType: string) => void
  onPrimaryPayerChange: (encounterId: string, primaryPayer: string) => void
  selectedEncounters: string[]
  className?: string
}

// ─── Static lookup maps ───

const timeSlots: Record<string, string> = {
  'Inpatient Surgery': '08:00 – 12:00 (240 m)',
  'Emergency Visit': '10:30 – 19:00 (30 m)',
  'Outpatient Consultation': '08:30 – 09:30 (60 m)',
  'Diagnostic Procedure': '10:00 – 14:00 (240 m)',
  'Surgery': '08:00 – 12:00 (240 m)',
  'Follow-up Visit': '10:00 – 14:00 (240 m)',
  'Laboratory Tests': '09:00 – 16:30 (90 m)',
  'Maternity Care': '00:00 – 23:59 (1440 m)',
  'Corporate Health Check': '09:00 – 16:30 (90 m)',
  'ICU Stay': '00:00 – 23:59 (1440 m)',
}

const facilityMap: Record<string, string> = {
  Cardiology: 'Community Health Center',
  Emergency: 'CMHC Outpatient - 1.0',
  Neurology: 'Community Health Center',
  Radiology: 'CMHC Outpatient - 1.0',
  Orthopedics: 'Community Health Center',
  'Internal Medicine': 'CMHC Outpatient - 1.0',
  Pathology: 'Community Health Center',
  Obstetrics: 'CMHC Outpatient - 1.0',
  'Preventive Medicine': 'Community Health Center',
  'Critical Care': 'CMHC Outpatient - 1.0',
}

const rendNameMap: Record<string, string> = {
  'Dr. Menon': 'Menon',
  'Dr. Iyer': 'Iyer',
  'Dr. Malhotra': 'Malhotra',
  'Dr. Nanda': 'Nanda',
  'Dr. Kapoor': 'Kapoor',
  'Dr. Khanna': 'Khanna',
}

// ─── Helpers ───

function getEncounterStatus(enc: BillingEncounter): string {
  if ((enc as any).encounterStatus) return (enc as any).encounterStatus
  const s = enc.status
  if (s === 'claim_rejected' || s === 'unauthorized') return 'Closed on Error'
  if (s === 'paid' || s === 'claim_accepted') return 'Closed'
  return 'Open'
}

function getBillingStatus(enc: BillingEncounter): string {
  if ((enc as any).billingStatus) return (enc as any).billingStatus
  const map: Record<string, string> = {
    unauthorized: 'Unbilled',
    ready_to_bill: 'No claims generated',
    in_review: 'No claims generated',
    claim_generated: 'Claims generated',
    claim_submitted: 'Claims submitted',
    claim_accepted: 'Billed',
    paid: 'Billed',
    claim_rejected: 'Denied',
    write_off: 'Denied',
  }
  return map[enc.status] || 'Unbilled'
}

const encStatusColor: Record<string, string> = {
  Open: 'text-blue-600',
  Closed: 'text-emerald-600',
  'Closed on Error': 'text-red-600',
}

const billStatusColor: Record<string, string> = {
  Unbilled: 'text-slate-500',
  'No claims generated': 'text-orange-600',
  'Claims generated': 'text-blue-600',
  'Claims submitted': 'text-sky-600',
  Billed: 'text-emerald-600',
  Denied: 'text-red-600',
}

function initials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDos(dateStr: string): string {
  const d = new Date(dateStr)
  const mon = d.toLocaleString('en-US', { month: 'short' })
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return `${mon} ${day}, ${year}`
}

// ─── Stacked data cell ───

function DataCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-medium text-slate-800">{children}</span>
    </div>
  )
}

// ─── Sample expanded-panel data ───

const sampleEditForms = [
  { name: 'Re-opened', detail: 'Initial Assessment form has been re-opened for edits.' },
  { name: 'Progress Note (Draft)', detail: 'Progress note saved as draft — pending clinician signature.' },
  { name: 'Treatment Plan Update', detail: 'Treatment plan has been updated — awaiting supervisor approval.' },
]

const sampleClaimsHistory = [
  { date: '01/20/2026', action: 'Claim Generated', ref: 'CLM-20260120-001' },
  { date: '01/22/2026', action: 'Claim Submitted to Payer', ref: 'CLM-20260120-001' },
  { date: '01/28/2026', action: 'Claim Rejected — Missing modifier', ref: 'CLM-20260120-001' },
  { date: '02/01/2026', action: 'Claim Re-submitted', ref: 'CLM-20260201-002' },
]

// ─── Single encounter row ───

interface EncounterRowProps {
  enc: BillingEncounter
  selected: boolean
  onSelect: (id: string, val: boolean) => void
  onEncounterClick?: (enc: BillingEncounter) => void
  onGenerateClaim: (enc: BillingEncounter) => void
  onViewErrors: (enc: BillingEncounter) => void
}

function EncounterRow({
  enc,
  selected,
  onSelect,
  onEncounterClick,
  onGenerateClaim,
  onViewErrors,
}: EncounterRowProps) {
  const [expanded, setExpanded] = useState(false)

  const isBilled =
    enc.status === 'paid' ||
    enc.status === 'claim_accepted' ||
    enc.status === 'claim_submitted' ||
    enc.status === 'claim_generated'

  const treatmentTime = timeSlots[enc.encounterType] || '08:00 – 12:00 (240 m)'
  const facility = facilityMap[enc.department] || 'Community Health Center'
  const rend = rendNameMap[enc.provider] || enc.provider.replace('Dr. ', '')
  const encStatus = getEncounterStatus(enc)
  const billStatus = getBillingStatus(enc)
  const dos = formatDos(enc.dateOfService)

  return (
    <div>
      {/* ── Main row ── */}
      <div className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">

        {/* LEFT — Patient identity */}
        <div className="flex items-center gap-4 w-[250px] shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(enc.id, e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
          />

          {enc.hasErrors && enc.errorSeverity === 'critical' && (
            <TooltipProvider>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="font-semibold mb-0.5">[Form Completion Rule]</p>
                  <p>Encounter forms do not meet the completion criteria.</p>
                </TooltipContent>
              </TooltipRoot>
            </TooltipProvider>
          )}

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 select-none">
            {initials(enc.patientName)}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 truncate">{enc.patientName}</span>
            <span className="text-xs text-slate-500">MRN: {enc.patientMrn}</span>
          </div>
        </div>

        {/* MIDDLE — Data columns */}
        <div className="flex items-center justify-between flex-1 px-8 border-l border-slate-100">

          {/* Encounter ID */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encounter ID</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEncounterClick?.(enc)}
                className="text-[13px] font-medium text-[#1a73e8] hover:underline cursor-pointer"
              >
                {enc.id} ({dos})
              </button>
              <span className="text-slate-300">&bull;</span>
              <button
                onClick={() => console.log('View Fee Sheet:', enc.id)}
                className="text-[12px] text-[#1a73e8] hover:underline cursor-pointer"
              >
                View Fee Sheet
              </button>
            </div>
          </div>

          <DataCell label="Treatment Time">{treatmentTime}</DataCell>
          <DataCell label="Provider">{enc.provider}</DataCell>
          <DataCell label="Rend">{rend}</DataCell>
          <DataCell label="Facility">{facility}</DataCell>
          <DataCell label="Enc. Status">
            <span className={encStatusColor[encStatus] || 'text-slate-600'}>{encStatus}</span>
          </DataCell>
          <DataCell label="Bill Status">
            <span className={billStatusColor[billStatus] || 'text-slate-600'}>{billStatus}</span>
          </DataCell>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-slate-100">
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="p-1.5 text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50 rounded-md transition-colors"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent><p className="text-xs">Expand details</p></TooltipContent>
            </TooltipRoot>
          </TooltipProvider>

          <button
            onClick={() => console.log('Settings:', enc.id)}
            className="p-1.5 text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50 rounded-md transition-colors"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50 rounded-md transition-colors">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => console.log('Add & Justify:', enc.id)}>
                <PlusCircleIcon className="w-4 h-4 mr-2" /> Add &amp; Justify
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onGenerateClaim(enc)} disabled={!enc.canGenerateClaim}>
                <BanknotesIcon className="w-4 h-4 mr-2" /> Generate Claims
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Submit Claims:', enc.id)} disabled={!enc.canSubmitClaim}>
                <PaperAirplaneIcon className="w-4 h-4 mr-2" /> Submit Claims
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log('Override Blocks:', enc.id)}
                disabled={!enc.canOverride || !enc.hasErrors}
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" /> Override Blocks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Mark Ready:', enc.id)}>
                <CheckCircleIcon className="w-4 h-4 mr-2" /> Mark Ready
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Export:', enc.id)}>
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" /> Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-t-0 border-slate-200 rounded-b-lg shadow-inner -mt-1">
          {/* Edit Forms */}
          <div>
            <h4 className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <PencilSquareIcon className="w-3.5 h-3.5" /> Edit Forms
              </span>
              <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">
                {sampleEditForms.length} items
              </span>
            </h4>
            <div className="space-y-2">
              {sampleEditForms.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 border-l-4 border-l-blue-500 p-3 rounded-md shadow-sm text-sm text-slate-700"
                >
                  <p className="font-semibold text-slate-800 mb-0.5">{f.name}</p>
                  <p className="text-slate-500 text-xs">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Claims History */}
          <div>
            <h4 className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <BanknotesIcon className="w-3.5 h-3.5" /> Claims History
              </span>
              <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">
                {sampleClaimsHistory.length} entries
              </span>
            </h4>
            <div className="space-y-2">
              {sampleClaimsHistory.map((c, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 border-l-4 border-l-blue-500 p-3 rounded-md shadow-sm text-sm text-slate-700"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-slate-800">{c.action}</span>
                    <span className="text-[11px] text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">Ref: {c.ref}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main table component ───

export const BillingQueueTable: FC<BillingQueueTableProps> = ({
  encounters,
  onEncounterSelect,
  onEncounterEdit,
  onEncounterClick,
  onGenerateClaim,
  onViewErrors,
  onBillingOverrideToggle,
  onHcfaBillTypeChange,
  onPrimaryPayerChange,
  selectedEncounters,
  className = '',
}) => {
  const allSelected =
    encounters.length > 0 && encounters.every((e) => selectedEncounters.includes(e.id))

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      encounters.forEach((e) => onEncounterSelect(e.id, checked))
    },
    [encounters, onEncounterSelect],
  )

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Select-all bar */}
      <div className="flex items-center gap-4 px-4 py-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
        />
        <span className="text-xs font-medium text-slate-500">
          {selectedEncounters.length > 0
            ? `${selectedEncounters.length} of ${encounters.length} selected`
            : `${encounters.length} encounters`}
        </span>
      </div>

      {/* Encounter rows */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
        {encounters.map((enc) => (
          <EncounterRow
            key={enc.id}
            enc={enc}
            selected={selectedEncounters.includes(enc.id)}
            onSelect={onEncounterSelect}
            onEncounterClick={onEncounterClick}
            onGenerateClaim={onGenerateClaim}
            onViewErrors={onViewErrors}
          />
        ))}

        {encounters.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            No encounters found.
          </div>
        )}
      </div>
    </div>
  )
}

export default BillingQueueTable
