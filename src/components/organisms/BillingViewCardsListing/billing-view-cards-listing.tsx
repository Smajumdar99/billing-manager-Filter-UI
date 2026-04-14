import { Dispatch, FC, SetStateAction, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BillingEncounter,
  type BillStatusDisplay,
  type EncounterStatusDisplay,
  getBillStatusDisplay,
  getEncounterStatusDisplay,
} from '@/types/billing-manager'
import {
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import {
  AlertTriangle,
  Edit3,
  Clock,
  FileText,
  Send,
  ShieldAlert,
  RefreshCw,
  Settings,
  Users,
  CheckCircle,
  RotateCcw,
  XCircle,
  Play,
  Download,
  Plus,
} from 'lucide-react'
import { BuildingLightFullIcon } from '@/assets/icons/BuildingLightFullIcon'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import { EncounterDetailsDialog } from '@/components/molecules/EncounterDetailsDialog'

export interface BillingViewCardsListingProps {
  encounters: BillingEncounter[]
  selectedEncounters: string[]
  onEncounterSelect: (encounterId: string, selected: boolean) => void
  onEncounterClick?: (encounter: BillingEncounter) => void
  /** External collapsed-IDs set — when provided, replaces the internal state */
  collapsedEncounterIds?: Set<string>
  onCollapsedEncounterIdsChange?: Dispatch<SetStateAction<Set<string>>>
  className?: string
  /** Encounter IDs with confirmed override — red override indicator per row */
  overriddenEncounterIds?: string[]
}

/**
 * BillingViewCardsListing Component
 * 
 * Card-based view for displaying billing encounters.
 * Provides an alternative visualization to the table view with key-value pairs.
 * Mobile-first responsive design with proper information hierarchy.
 */
// Service line item interface for billing
const formatUsd = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

/** Duration label for Treatment Time row (shown as parenthesized secondary text beside the range). */
function formatTreatmentDurationLabel(encounter: BillingEncounter): string | null {
  if (
    encounter.treatmentDurationMinutes != null &&
    Number.isFinite(encounter.treatmentDurationMinutes)
  ) {
    const m = Math.max(0, Math.round(encounter.treatmentDurationMinutes))
    if (m === 0) return null
    return m === 1 ? '1 min' : `${m} mins`
  }
  const range = encounter.treatmentTime?.trim()
  if (!range || range === '-') return null
  const normalized = range.replace(/[–—]/g, '-')
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
  const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10)
  let diff = end - start
  if (diff <= 0) diff += 24 * 60
  if (diff <= 0) return null
  return diff === 1 ? '1 min' : `${diff} mins`
}

interface ServiceLineItem {
  id: string
  serviceCode: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  modifiers?: string[]
  placeOfService?: string
  diagnosisCodes?: string[]
  hasError?: boolean
  errorMessage?: string
  insuranceLevels?: {
    primary: { billed: boolean; status: 'billed' | 'ready' | 'pending' | 'not_applicable' }
    secondary: { billed: boolean; status: 'billed' | 'ready' | 'pending' | 'not_applicable' }
    tertiary: { billed: boolean; status: 'billed' | 'ready' | 'pending' | 'not_applicable' }
  }
}
export const BillingViewCardsListing: FC<BillingViewCardsListingProps> = ({
  encounters,
  selectedEncounters,
  onEncounterSelect,
  onEncounterClick,
  collapsedEncounterIds: externalCollapsedIds,
  onCollapsedEncounterIdsChange,
  className = '',
  overriddenEncounterIds = []
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [internalCollapsedIds, setInternalCollapsedIds] = useState<Set<string>>(new Set());

  // Use external state when provided, otherwise fall back to internal
  const collapsedDetailsIds = externalCollapsedIds ?? internalCollapsedIds;
  const setCollapsedDetailsIds: Dispatch<SetStateAction<Set<string>>> = useCallback((updater) => {
    if (onCollapsedEncounterIdsChange) {
      onCollapsedEncounterIdsChange(updater);
    } else {
      setInternalCollapsedIds(updater);
    }
  }, [onCollapsedEncounterIdsChange]);

  const toggleDetails = (encounterId: string) => {
    setCollapsedDetailsIds((prev) => {
      const next = new Set(prev);
      if (next.has(encounterId)) next.delete(encounterId);
      else next.add(encounterId);
      return next;
    });
  };

  // Mock activity log — V1 format per row: [Date] [Time] [Status]
  const getActivityLog = (_encounter: BillingEncounter) => [
    { id: 'ch1', date: '03/10/2026', time: '15:23', status: 'Re-opened' },
    { id: 'ch2', date: '03/08/2026', time: '09:41', status: 'Re-opened' },
    { id: 'ch3', date: '03/05/2026', time: '14:02', status: 'Re-opened' },
    { id: 'ch4', date: '03/02/2026', time: '11:17', status: 'Re-opened' },
    { id: 'ch5', date: '02/28/2026', time: '08:55', status: 'Re-opened' },
    { id: 'ch6', date: '02/25/2026', time: '16:40', status: 'Re-opened' },
    { id: 'ch7', date: '02/22/2026', time: '10:12', status: 'Re-opened' },
    { id: 'ch8', date: '02/18/2026', time: '13:05', status: 'Re-opened' },
    { id: 'ch9', date: '02/14/2026', time: '09:22', status: 'Re-opened' },
    { id: 'ch10', date: '02/10/2026', time: '14:51', status: 'Re-opened' },
    { id: 'ch11', date: '02/06/2026', time: '11:08', status: 'Re-opened' },
    { id: 'ch12', date: '02/01/2026', time: '08:33', status: 'Re-opened' },
    { id: 'ch13', date: '01/28/2026', time: '15:17', status: 'Re-opened' },
    { id: 'ch14', date: '01/24/2026', time: '12:44', status: 'Re-opened' },
    { id: 'ch15', date: '01/20/2026', time: '10:29', status: 'Re-opened' },
  ];

  // ── Kebab (more actions) menu state ────────────────────────────────────────
  const [kebabMenuEncounterId, setKebabMenuEncounterId] = useState<string | null>(null);
  const KEBAB_ACTIONS: { id: string; label: string; icon: React.ReactNode; dividerBefore?: boolean }[] = [
    { id: 'add_justify',            label: 'Add & Justify',          icon: <Plus size={16} className="text-slate-400 shrink-0" /> },
    { id: 'generate_claims',        label: 'Generate Claims',        icon: <FileText size={16} className="text-slate-400 shrink-0" />, dividerBefore: true },
    { id: 'generate_submit_claims', label: 'Generate & Submit Claims', icon: <Send size={16} className="text-slate-400 shrink-0" /> },
    { id: 'check_errors',           label: 'Check Errors',           icon: <AlertTriangle size={16} className="text-slate-400 shrink-0" /> },
    { id: 'override',               label: 'Override',               icon: <ShieldAlert size={16} className="text-slate-400 shrink-0" /> },
    { id: 'rebill',                 label: 'Rebill',                 icon: <RefreshCw size={16} className="text-slate-400 shrink-0" /> },
    { id: 'set_bill_type',          label: 'Set Bill Type',          icon: <Settings size={16} className="text-slate-400 shrink-0" /> },
    { id: 'set_bill_to',            label: 'Set Bill-To',            icon: <Users size={16} className="text-slate-400 shrink-0" /> },
    { id: 'mark_as_cleared',        label: 'Mark as Cleared',        icon: <CheckCircle size={16} className="text-slate-400 shrink-0" />, dividerBefore: true },
    { id: 'reopen',                 label: 'Re-Open',                icon: <RotateCcw size={16} className="text-slate-400 shrink-0" /> },
    { id: 'remove_rebill',          label: 'Remove Re-bill',         icon: <XCircle size={16} className="text-slate-400 shrink-0" /> },
    { id: 'apply_post_primary',     label: 'Apply Post Primary Rules', icon: <Play size={16} className="text-slate-400 shrink-0" /> },
    { id: 'set_pos',                label: 'Set POS',                icon: <BuildingLightFullIcon className="h-4 w-4 shrink-0 text-slate-400" />, dividerBefore: true },
    { id: 'export',                 label: 'Export',                 icon: <Download size={16} className="text-slate-400 shrink-0" /> },
  ];

  // Close any open popup when clicking outside
  useEffect(() => {
    const handleDocClick = () => {
      setKebabMenuEncounterId(null);
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const handleEncounterClick = (encounter: BillingEncounter) => {
    setSelectedEncounterId(encounter.id);
    setSelectedPatientId(encounter.patientId);
    setDialogOpen(true);
    if (onEncounterClick) {
      onEncounterClick(encounter);
    }
  };

  // Filter encounters to show only those for the selected patient
  const patientEncounters = selectedPatientId 
    ? encounters.filter(enc => enc.patientId === selectedPatientId)
    : [];
  
  // Helper function to determine if encounter is billed
  const isBilled = (encounter: BillingEncounter) => {
    return encounter.status === 'claim_generated'
  }

  const encounterStatusBadgeClassName = (label: EncounterStatusDisplay): string => {
    switch (label) {
      case 'Open':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border border-gray-200'
      case 'Closed with errors':
        return 'bg-red-50 text-red-700 border border-red-200'
    }
  }

  const billStatusBadgeClassName = (label: BillStatusDisplay): string => {
    switch (label) {
      case 'Unbilled':
        return 'bg-gray-100 text-gray-700'
      case 'Partially Billed':
        return 'bg-blue-50 text-blue-700'
      case 'Billing Complete':
        return 'bg-green-50 text-green-700'
    }
  }

  // Helper function to format amount
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toLocaleString()},000`
    }
    return `$${amount.toLocaleString()}`
  }

  // Mock function to generate services for an encounter
  const getEncounterServices = (encounter: BillingEncounter): ServiceLineItem[] => {
    // Add error to second service for enc_003 (Robert Wilson)
    const shouldAddError = encounter.id === 'enc_003';
    
    // Generate 2-4 services per encounter based on encounter type
    const serviceTemplates: Record<string, ServiceLineItem[]> = {
      'Inpatient Surgery': [
        { 
          id: '1', 
          serviceCode: '99223', 
          description: 'Initial hospital care, high complexity', 
          quantity: 1, 
          unitPrice: 250, 
          totalPrice: 250, 
          placeOfService: '21', 
          diagnosisCodes: ['I10', 'E11.9'],
          insuranceLevels: {
            primary: { billed: true, status: 'billed' },
            secondary: { billed: false, status: 'ready' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        },
        { 
          id: '2', 
          serviceCode: '36415', 
          description: 'Venipuncture', 
          quantity: 2, 
          unitPrice: 15, 
          totalPrice: 30, 
          placeOfService: '21', 
          diagnosisCodes: ['I10'],
          insuranceLevels: {
            primary: { billed: true, status: 'billed' },
            secondary: { billed: true, status: 'billed' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        },
        { 
          id: '3', 
          serviceCode: '80053', 
          description: 'Comprehensive metabolic panel', 
          quantity: 1, 
          unitPrice: 45, 
          totalPrice: 45, 
          placeOfService: '21', 
          diagnosisCodes: ['E11.9'],
          insuranceLevels: {
            primary: { billed: true, status: 'billed' },
            secondary: { billed: false, status: 'pending' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        }
      ],
      'Emergency Visit': [
        { 
          id: '1', 
          serviceCode: '99285', 
          description: 'Emergency dept visit, high severity', 
          quantity: 1, 
          unitPrice: 450, 
          totalPrice: 450, 
          placeOfService: '23', 
          diagnosisCodes: ['R07.9', 'I10'],
          insuranceLevels: {
            primary: { billed: false, status: 'ready' },
            secondary: { billed: false, status: 'not_applicable' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        },
        { 
          id: '2', 
          serviceCode: '71046', 
          description: 'Chest X-ray, 2 views', 
          quantity: 1, 
          unitPrice: 85, 
          totalPrice: 85, 
          placeOfService: '23', 
          diagnosisCodes: ['R07.9'],
          insuranceLevels: {
            primary: { billed: false, status: 'ready' },
            secondary: { billed: false, status: 'not_applicable' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        }
      ],
      'Outpatient Consultation': [
        { 
          id: '1', 
          serviceCode: '99204', 
          description: 'Office visit, new patient, moderate', 
          quantity: 1, 
          unitPrice: 180, 
          totalPrice: 180, 
          placeOfService: '11', 
          diagnosisCodes: ['M79.3', 'M25.561'],
          insuranceLevels: {
            primary: { billed: true, status: 'billed' },
            secondary: { billed: false, status: 'not_applicable' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        },
        { 
          id: '2', 
          serviceCode: '73610', 
          description: 'Ankle X-ray, complete', 
          quantity: 1, 
          unitPrice: 65, 
          totalPrice: 65, 
          placeOfService: '11', 
          diagnosisCodes: ['M25.561'],
          insuranceLevels: {
            primary: { billed: true, status: 'billed' },
            secondary: { billed: false, status: 'not_applicable' },
            tertiary: { billed: false, status: 'not_applicable' }
          }
        }
      ]
    }

    // Return services based on encounter type or default services
    return serviceTemplates[encounter.encounterType] || [
      { 
        id: '1', 
        serviceCode: '99213', 
        description: 'Office visit, established patient', 
        quantity: 1, 
        unitPrice: 120, 
        totalPrice: 120, 
        placeOfService: '11', 
        diagnosisCodes: ['Z00.00'],
        insuranceLevels: {
          primary: { billed: true, status: 'billed' },
          secondary: { billed: false, status: 'ready' },
          tertiary: { billed: false, status: 'not_applicable' }
        }
      },
      { 
        id: '2', 
        serviceCode: '85025', 
        description: 'Complete blood count', 
        quantity: 1, 
        unitPrice: 25, 
        totalPrice: 25, 
        placeOfService: '11', 
        diagnosisCodes: ['Z00.00'],
        hasError: shouldAddError,
        errorMessage: shouldAddError ? 'Not in Service Plan' : undefined,
        insuranceLevels: {
          primary: { billed: false, status: 'ready' },
          secondary: { billed: false, status: 'ready' },
          tertiary: { billed: false, status: 'not_applicable' }
        }
      }
    ]
  }

  return (
    <TooltipProvider>
      <div className={`flex flex-col gap-2.5 overflow-y-auto pt-0 ${className}`}>
        <style>
          {`
            .ag-header-cell-center .ag-header-cell-label {
              justify-content: center;
            }
            .ag-header-cell-right .ag-header-cell-label {
              justify-content: flex-end;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        
        {encounters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No encounters found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          encounters.map((encounter) => {
            const isSelected = selectedEncounters.includes(encounter.id)
            const encounterStatus = getEncounterStatusDisplay(encounter.status)
            const billingStatus = getBillStatusDisplay(encounter.status)
            const dateOfServiceFormatted = new Date(encounter.dateOfService).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
            const treatmentDurationLabel = formatTreatmentDurationLabel(encounter)

            return (
              <div
                key={encounter.id}
                className={`bg-white rounded-md border transition-all duration-150 hover:shadow-sm ${
                  isSelected 
                    ? 'border-blue-500 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Card Header — CSS Grid: thin left status bar + flexible middle + fixed action column */}
                <div className="grid w-full grid-cols-[1.625rem_minmax(0,1fr)_max-content] items-stretch bg-white border-b border-slate-200 rounded-t-md">
                  {/* Far-left vertical status bar — golden thread above override (Schedule-style strip) */}
                  <div className="flex flex-col items-center gap-1 justify-start pt-2 pb-1.5 border-r border-slate-200 bg-slate-50/70 shrink-0 self-stretch">
                    <div className="relative flex items-center justify-center group cursor-help shrink-0">
                      <AlertTriangle size={14} className="text-amber-500" style={{ fill: '#fef3c7' }} />
                      <div className="absolute top-full left-0 mt-2 w-64 max-w-[min(16rem,calc(100vw-2rem))] p-2.5 bg-slate-800 text-white text-[11px] leading-relaxed rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal pointer-events-none">
                        <div className="absolute bottom-full left-3 border-4 border-transparent border-b-slate-800" aria-hidden />
                        <div className="font-semibold text-amber-300 mb-1">[Golden Thread Rule]</div>
                        One or more forms do not meet the golden thread rules: GT
                      </div>
                    </div>
                    {overriddenEncounterIds.some(
                      (oid) => String(oid).trim() === String(encounter.id).trim()
                    ) && (
                      <div className="relative flex items-center justify-center group cursor-help shrink-0">
                        <AlertTriangle size={14} className="text-red-500 fill-red-100" />
                        <div className="absolute top-full left-0 mt-2 w-64 max-w-[min(16rem,calc(100vw-2rem))] p-2.5 bg-slate-800 text-white text-[11px] leading-relaxed rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal pointer-events-none">
                          <div className="absolute bottom-full left-3 border-4 border-transparent border-b-slate-800" aria-hidden />
                          <div className="font-semibold text-red-300 mb-1">Override Applied</div>
                          Overridden by: Admin Ensoftek on 25/03/2026 20:04:35
                          <br />
                          <span className="text-slate-300">CANS Assessment Only</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between min-w-0 py-1.5 px-3">
                  {/* LEFT — Patient identity (fixed width) */}
                  <div className="flex items-center gap-1.5 w-52 shrink-0">
                    <input
                      type="checkbox"
                      id={`encounter-select-${encounter.id}`}
                      checked={isSelected}
                      onChange={(e) => onEncounterSelect(encounter.id, e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
                      aria-label={`Select encounter ${encounter.id} for ${encounter.patientName}`}
                    />

                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] leading-none font-bold shrink-0 select-none">
                      {encounter.patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>

                    <div className="flex flex-col truncate ml-0.5 min-w-0">
                      <Link
                        to={`/chart/${encounter.patientId}`}
                        className="text-[13px] font-bold text-slate-900 leading-tight truncate block min-w-0 hover:text-blue-600 hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 rounded-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {encounter.patientName}
                      </Link>
                      <div className="mt-0.5 flex flex-col gap-px leading-tight">
                        <span className="text-[11px] text-slate-500 truncate">PID: {encounter.patientId}</span>
                        <span className="text-[11px] text-slate-500 truncate">External ID: {encounter.patientMrn}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-200 mx-3 shrink-0"></div>

                  {/* MIDDLE — Data columns (items-start: short columns must not center vertically vs tall Encounter ID cell) */}
                  <div className="flex items-start gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-hide">

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Encounter ID</span>
                      <div className="flex items-center h-8 whitespace-nowrap">
                        <button
                          onClick={() => handleEncounterClick(encounter)}
                          className="text-[12px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                          aria-label={`View details for encounter ${encounter.id}`}
                        >
                          {encounter.id}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0" style={{ width: 80 }}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Fee Sheet</span>
                      <div className="flex items-center h-8">
                        <button
                          type="button"
                          onClick={() => console.log('View Fee Sheet for', encounter.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap"
                        >
                          <FileText size={12} className="shrink-0" aria-hidden />
                          View
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Date of Service</span>
                      <div className="flex items-center h-8">
                        <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{dateOfServiceFormatted}</span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Treatment Time</span>
                      <div className="flex items-center h-8">
                        {encounter.treatmentTime ? (
                          <div className="flex min-w-0 flex-row items-baseline gap-2 whitespace-nowrap">
                            <span className="text-[12px] font-medium text-slate-800 leading-none">{encounter.treatmentTime}</span>
                            {treatmentDurationLabel ? (
                              <span className="text-xs text-gray-500 leading-none">({treatmentDurationLabel})</span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">-</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Provider</span>
                      <div className="flex items-center h-8">
                        <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounter.provider}</span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Rend</span>
                      <div className="flex items-center h-8">
                        <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounter.provider.replace(/^Dr\.\s*/i, '')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Program</span>
                      <div className="flex items-center h-8">
                        <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap" title={encounter.program}>{encounter.program}</span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0 min-w-0 max-w-[11rem]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">ENC. STATUS</span>
                      <div className="flex items-center h-8">
                        <span
                          className={`inline-flex w-fit max-w-full items-center rounded-md px-2 py-1 text-xs font-medium leading-snug text-left ${encounterStatusBadgeClassName(encounterStatus)}`}
                        >
                          {encounterStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Bill Status</span>
                      <div className="flex items-center h-8">
                        <span
                          className={`inline-flex w-fit max-w-full items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap ${billStatusBadgeClassName(billingStatus)}`}
                        >
                          {billingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col shrink-0 min-w-[5rem] min-h-0 items-end text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none whitespace-nowrap">Amount</span>
                      <div className="flex items-center justify-end h-8">
                        <span className="text-[12px] font-bold text-slate-900 leading-none whitespace-nowrap tabular-nums">
                          {formatUsd(encounter.totalCharges ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  </div>
                  {/* end of grid column 2 (patient + data) */}

                  {/* Grid column 3 — Actions (max-content track, never clips) */}
                  <div className="flex items-center gap-1 shrink-0 px-2 border-l border-slate-100 overflow-visible">
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => toggleDetails(encounter.id)}
                          className="p-1 text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50 rounded-md transition-colors"
                          aria-expanded={!collapsedDetailsIds.has(encounter.id)}
                          aria-label={collapsedDetailsIds.has(encounter.id) ? 'Show Edit Forms and Activity' : 'Hide Edit Forms and Activity'}
                        >
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform duration-200 ${collapsedDetailsIds.has(encounter.id) ? '' : 'rotate-180'}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p>{collapsedDetailsIds.has(encounter.id) ? 'Show Edit Forms and Activity' : 'Hide Edit Forms and Activity'}</p>
                      </TooltipContent>
                    </TooltipRoot>

                    {/* ── Kebab / More actions menu ── */}
                    <div className="relative">
                      <button
                        className={`p-1 rounded-md transition-colors ${kebabMenuEncounterId === encounter.id ? 'text-[#1a73e8] bg-blue-50' : 'text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50'}`}
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKebabMenuEncounterId(kebabMenuEncounterId === encounter.id ? null : encounter.id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>

                      {kebabMenuEncounterId === encounter.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] py-1.5 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {KEBAB_ACTIONS.map((action) => (
                            <div key={action.id}>
                              {action.dividerBefore && <div className="my-1.5 border-t border-slate-100 mx-3" />}
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 transition-colors text-left"
                                onClick={() => {
                                  console.log(action.id, encounter.id);
                                  setKebabMenuEncounterId(null);
                                }}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body: insurance table always visible; Edit Forms / Activity toggled by header chevron */}
                <div className="px-2 py-1 relative" style={{ zIndex: 1 }}>

                  {/* Insurance/Billing data table */}
                  <div className="overflow-x-auto -mx-2 md:mx-0 px-2 md:px-0">
                    <table className="w-full min-w-[800px] text-[11px] border-collapse">
                      <thead className="bg-slate-50 border-y border-slate-200">
                        <tr>
                          <th className="pl-2 pr-0 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide w-6"></th>
                          <th className="pl-0 pr-1 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Insurance Levels</th>
                          <th className="px-1.5 py-1 text-left text-[9px] font-semibold text-slate-500 uppercase tracking-wide w-44">Insurance</th>
                          <th className="px-1.5 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Billing Type</th>
                          <th className="px-1.5 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">X12 Partner</th>
                          <th className="px-1.5 py-1 text-left text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Code</th>
                          <th className="px-1.5 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Unit</th>
                          <th className="px-1.5 py-1 text-right text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Unit Price</th>
                          <th className="px-1.5 py-1 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">POS</th>
                          <th className="px-1.5 py-1 text-left text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Diagnosis</th>
                          <th className="px-1.5 py-1 text-left text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Rend</th>
                          <th className="px-1.5 py-1 text-right text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getEncounterServices(encounter).map((service, index) => {
                          // Check if service is billed (has any insurance level billed)
                          const isServiceBilled = service.insuranceLevels?.primary.billed || 
                                                  service.insuranceLevels?.secondary.billed || 
                                                  service.insuranceLevels?.tertiary.billed
                          
                          return (
                          <>
                          <tr
                            key={service.id}
                            className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/20 transition-colors ${service.hasError ? 'bg-red-50' : 'bg-white'}`}
                          >
                            {/* Status Icon */}
                            <td className="pl-2 pr-0 py-0.5 text-center align-middle">
                              <TooltipRoot>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex cursor-help bg-transparent">
                                    <CurrencyDollarIcon
                                      className={`w-3.5 h-3.5 shrink-0 ${isServiceBilled ? 'text-green-600' : 'text-gray-400'}`}
                                      aria-hidden
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{isServiceBilled ? 'Billed' : 'Unbilled'}</p>
                                </TooltipContent>
                              </TooltipRoot>
                            </td>
                            
                            {/* Insurance Levels */}
                            <td className="pl-0 pr-1 py-0.5 text-center align-middle">
                              {service.insuranceLevels ? (
                                <TooltipRoot>
                                  <TooltipTrigger asChild>
                                    <div className="inline-flex items-center border border-slate-200 rounded-md overflow-hidden cursor-help">
                                      {/* Primary - 1 */}
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] border-r border-slate-200 bg-transparent ${
                                        service.insuranceLevels.primary.billed 
                                          ? 'text-emerald-700' 
                                          : service.insuranceLevels.primary.status === 'not_applicable'
                                          ? 'text-slate-400'
                                          : 'text-amber-700'
                                      }`}>
                                        {service.insuranceLevels.primary.billed && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-emerald-600" aria-hidden />
                                        )}
                                        {!service.insuranceLevels.primary.billed && service.insuranceLevels.primary.status !== 'not_applicable' && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-amber-600" aria-hidden />
                                        )}
                                        1
                                      </div>
                                      
                                      {/* Secondary - 2 */}
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] border-r border-slate-200 bg-transparent ${
                                        service.insuranceLevels.secondary.billed 
                                          ? 'text-emerald-700' 
                                          : service.insuranceLevels.secondary.status === 'not_applicable'
                                          ? 'text-slate-400'
                                          : service.insuranceLevels.primary.billed
                                          ? 'text-amber-700'
                                          : 'text-slate-400'
                                      }`}>
                                        {service.insuranceLevels.secondary.billed && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-emerald-600" aria-hidden />
                                        )}
                                        {!service.insuranceLevels.secondary.billed && service.insuranceLevels.secondary.status !== 'not_applicable' && service.insuranceLevels.primary.billed && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-amber-600" aria-hidden />
                                        )}
                                        2
                                      </div>
                                      
                                      {/* Tertiary - 3 */}
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] bg-transparent ${
                                        service.insuranceLevels.tertiary.billed 
                                          ? 'text-emerald-700' 
                                          : service.insuranceLevels.tertiary.status === 'not_applicable'
                                          ? 'text-slate-400'
                                          : service.insuranceLevels.secondary.billed
                                          ? 'text-amber-700'
                                          : 'text-slate-400'
                                      }`}>
                                        {service.insuranceLevels.tertiary.billed && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-emerald-600" aria-hidden />
                                        )}
                                        {!service.insuranceLevels.tertiary.billed && service.insuranceLevels.tertiary.status !== 'not_applicable' && service.insuranceLevels.secondary.billed && (
                                          <CheckIcon className="w-2.5 h-2.5 shrink-0 text-amber-600" aria-hidden />
                                        )}
                                        3
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold">Insurance Billing Status</p>
                                      <p className="text-xs">
                                        Primary: {service.insuranceLevels.primary.billed ? '✅ Billed' : service.insuranceLevels.primary.status === 'not_applicable' ? 'Not Applicable' : '⏳ Ready to bill'}
                                      </p>
                                      <p className="text-xs">
                                        Secondary: {service.insuranceLevels.secondary.billed ? '✅ Billed' : service.insuranceLevels.secondary.status === 'not_applicable' ? 'Not Applicable' : service.insuranceLevels.primary.billed ? '⏳ Ready to bill' : 'Waiting for primary'}
                                      </p>
                                      <p className="text-xs">
                                        Tertiary: {service.insuranceLevels.tertiary.billed ? '✅ Billed' : service.insuranceLevels.tertiary.status === 'not_applicable' ? 'Not Applicable' : service.insuranceLevels.secondary.billed ? '⏳ Ready to bill' : 'Waiting for secondary'}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </TooltipRoot>
                              ) : '-'}
                            </td>
                            
                            {/* Insurance Select */}
                            <td className="px-1.5 py-0.5 align-middle">
                              <Select defaultValue="primary">
                                <SelectTrigger className="h-5 min-h-0 py-0.5 px-1.5 text-[10px] w-full bg-transparent border border-slate-200 text-slate-600 shadow-sm hover:bg-white [&>span]:truncate [&>span]:block [&>span]:overflow-hidden [&>span]:whitespace-nowrap leading-tight">
                                  <SelectValue placeholder="Select insurance" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="primary">Primary: Blue Cross Blue Shield</SelectItem>
                                  <SelectItem value="secondary">Secondary: Aetna</SelectItem>
                                  <SelectItem value="tertiary">Tertiary: United Healthcare</SelectItem>
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            
                            {/* Billing Type */}
                            <td className="px-1.5 py-0.5 text-center text-slate-700 align-middle">HCFA</td>
                            
                            {/* X12 Partner */}
                            <td className="px-1.5 py-0.5 text-center text-slate-700 align-middle">-</td>
                            
                            {/* CPT Code */}
                            <td className="px-1.5 py-0.5 align-middle">
                              <div className="flex flex-col gap-0">
                                <button
                                  className="text-[11px] leading-tight font-medium text-blue-700 hover:text-blue-900 hover:underline focus:outline-none rounded text-left"
                                  onClick={() => {
                                    console.log('CPT Code clicked:', service.serviceCode)
                                  }}
                                >
                                  {service.serviceCode} {service.diagnosisCodes && service.diagnosisCodes.length > 0 && `(${service.diagnosisCodes.join(', ')})`}
                                </button>
                                <span className="text-[9px] text-gray-500 uppercase leading-none">CPT4</span>
                              </div>
                            </td>
                            
                            {/* Quantity */}
                            <td className="px-1.5 py-0.5 text-center text-slate-700 align-middle">{service.quantity}</td>
                            
                            {/* Unit Price */}
                            <td className="px-1.5 py-0.5 text-right text-slate-700 align-middle">${service.unitPrice.toFixed(2)}</td>
                            
                            {/* POS */}
                            <td className="px-1.5 py-0.5 text-center text-slate-600 align-middle">{service.placeOfService || '-'}</td>
                            
                            {/* Diagnosis */}
                            <td className="px-1.5 py-0.5 align-middle">
                              {service.diagnosisCodes && service.diagnosisCodes.length > 0 ? (
                                <button
                                  type="button"
                                  className="text-left bg-transparent border-0 p-0 m-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                                  onClick={() => console.log('Diagnosis edit:', encounter.id, service.id)}
                                >
                                  <span className="text-[11px] text-slate-700 font-medium border-b border-dashed border-gray-400 hover:text-blue-600 hover:border-blue-600 transition-colors cursor-pointer">
                                    {service.diagnosisCodes.join(', ')}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer focus:outline-none"
                                  onClick={() => console.log('Diagnosis add/justify:', encounter.id, service.id)}
                                >
                                  + Add/Justify
                                </button>
                              )}
                            </td>
                            
                            {/* Rendering Provider */}
                            <td className="px-1.5 py-0.5 text-slate-700 align-middle">{encounter.provider.replace(/^Dr\.\s*/i, '')}</td>
                            
                            {/* Total */}
                            <td className="px-1.5 py-0.5 text-right font-semibold text-slate-800 align-middle">${service.totalPrice.toFixed(2)}</td>
                          </tr>
                          {service.hasError && service.errorMessage && (
                            <tr className="bg-red-50">
                              <td colSpan={12} className="px-1.5 py-0.5 text-left">
                                <div className="flex items-center gap-1 text-red-700">
                                  <span className="text-[11px] font-medium">{service.errorMessage}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                          </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {!collapsedDetailsIds.has(encounter.id) && (
                  <div className="px-2 pb-1 relative border-t border-slate-200" style={{ zIndex: 1 }}>
                  {/* ── Split footer: Edit Forms | Activity ── */}
                  <div className="w-full grid grid-cols-2 divide-x divide-slate-200 bg-slate-50/50">

                    <div className="py-1.5 px-3 flex flex-col">
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        <Edit3 size={12} className="opacity-60" />
                        <span>Edit Forms</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <button
                          type="button"
                          className="flex items-center gap-0.5 text-[11px] text-[#0ea5e9] font-medium hover:bg-blue-50 rounded px-0.5 -ml-0.5 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <FileText size={12} className="text-blue-400 shrink-0" />
                          <span>New Patient Encounter</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-0.5 text-[11px] text-[#0ea5e9] font-medium hover:bg-blue-50 rounded px-0.5 -ml-0.5 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <FileText size={12} className="text-blue-400 shrink-0" />
                          <span>Services Conclusion Plan</span>
                        </button>
                      </div>
                    </div>

                    <div className="py-1.5 px-3 flex flex-col pl-4">
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        <Clock size={12} className="opacity-60 shrink-0" />
                        <span>Activity</span>
                      </div>
                      <div className="flex flex-col gap-0 max-h-[120px] overflow-y-auto scroll-smooth pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        {getActivityLog(encounter).map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-start text-[12px] text-slate-600 py-1 px-1 hover:bg-white rounded transition-colors min-w-0"
                          >
                            <span className="truncate">
                              {entry.date} {entry.time} {entry.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Encounter Details Dialog */}
      <EncounterDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        encounters={patientEncounters}
        selectedEncounterId={selectedEncounterId}
      />
    </TooltipProvider>
  )
}

export default BillingViewCardsListing
