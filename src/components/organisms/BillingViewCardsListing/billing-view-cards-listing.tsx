import { Dispatch, FC, SetStateAction, useState, useCallback, useEffect } from 'react'
import { BillingEncounter } from '@/types/billing-manager'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import { AlertTriangle, Edit3, Clock, FileText } from 'lucide-react'
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

  // Mock claims history — V1 format per row: [Date] [Time] [Status]
  const getClaimsHistory = (_encounter: BillingEncounter) => [
    { id: 'ch1', date: '03/10/2026', time: '15:23', status: 'Re-opened' },
    { id: 'ch2', date: '03/08/2026', time: '09:41', status: 'Re-opened' },
    { id: 'ch3', date: '03/05/2026', time: '14:02', status: 'Re-opened' },
    { id: 'ch4', date: '03/02/2026', time: '11:17', status: 'Re-opened' },
    { id: 'ch5', date: '02/28/2026', time: '08:55', status: 'Re-opened' },
  ];

  // ── Gear (settings) popover state ──────────────────────────────────────────
  const [posPopoverEncounterId, setPosPopoverEncounterId] = useState<string | null>(null);
  const [posValues, setPosValues] = useState<Record<string, string>>({});
  const POS_OPTIONS = [
    { value: '11', label: '11 - Office' },
    { value: '12', label: '12 - Home' },
    { value: '21', label: '21 - Inpatient Hospital' },
    { value: '22', label: '22 - On Campus-Outpatient' },
    { value: '23', label: '23 - Emergency Room' },
    { value: '31', label: '31 - Skilled Nursing Facility' },
    { value: '32', label: '32 - Nursing Facility' },
  ];

  // ── Kebab (more actions) menu state ────────────────────────────────────────
  const [kebabMenuEncounterId, setKebabMenuEncounterId] = useState<string | null>(null);
  const KEBAB_ACTIONS = [
    { id: 'add',      icon: '+',  label: 'Add & Justify',    bold: false },
    { id: 'generate', icon: '📄', label: 'Generate Claims',  bold: false },
    { id: 'submit',   icon: '→',  label: 'Submit Claims',    bold: false },
    { id: 'override', icon: '🛡', label: 'Override Blocks',  bold: false },
    { id: 'ready',    icon: '✓',  label: 'Mark Ready',       bold: true  },
    { id: 'export',   icon: '📄', label: 'Export',           bold: false },
  ];

  // Close any open popup when clicking outside
  useEffect(() => {
    const handleDocClick = () => {
      setPosPopoverEncounterId(null);
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

  // Helper function to get encounter status
  const getEncounterStatus = (encounter: BillingEncounter) => {
    if (encounter.status === 'claim_rejected' || encounter.status === 'unauthorized') {
      return 'Closed on Error'
    }
    if (encounter.status === 'paid' || encounter.status === 'claim_accepted') {
      return 'Closed'
    }
    return 'Open'
  }

  // Helper function to get billing status
  const getBillingStatus = (encounter: BillingEncounter) => {
    const statusMap: Record<string, string> = {
      'unauthorized': 'Unbilled',
      'ready_to_bill': 'No claims generated',
      'in_review': 'No claims generated',
      'claim_generated': 'Claims generated but not submitted',
      'claim_submitted': 'Claims generated but not submitted',
      'claim_accepted': 'Billed',
      'paid': 'Billed',
      'claim_rejected': 'Denied',
      'write_off': 'Denied'
    }
    return statusMap[encounter.status] || 'Unbilled'
  }

  // Helper function to get facility name
  const getFacilityName = (department: string) => {
    const facilityMap: Record<string, string> = {
      'Cardiology': 'Community Health Center',
      'Emergency': 'CMHC Outpatient - 1.0',
      'Neurology': 'Community Health Center',
      'Radiology': 'CMHC Outpatient - 1.0',
      'Orthopedics': 'Community Health Center',
      'Internal Medicine': 'CMHC Outpatient - 1.0',
      'Pathology': 'Community Health Center',
      'Obstetrics': 'CMHC Outpatient - 1.0',
      'Preventive Medicine': 'Community Health Center',
      'Critical Care': 'CMHC Outpatient - 1.0'
    }
    return facilityMap[department] || 'Community Health Center'
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
      <div className={`space-y-0.5 overflow-y-auto pt-0 ${className}`}>
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
            const encounterStatus = getEncounterStatus(encounter)
            const billingStatus = getBillingStatus(encounter)
            
            return (
              <div
                key={encounter.id}
                className={`bg-white rounded-md border transition-all duration-150 hover:shadow-sm ${
                  isSelected 
                    ? 'border-blue-500 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Card Header — high-density row */}
                <div className="flex items-center justify-between w-full py-1.5 px-3 bg-white border-b border-slate-200 rounded-t-md">

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

                    <div className="flex items-center gap-1 ml-0.5">
                      <div className="relative flex items-center justify-center group cursor-help">
                        <AlertTriangle size={14} className="text-amber-500" style={{ fill: '#fef3c7' }} />
                        <div className="absolute top-full left-0 mt-2 w-64 max-w-[min(16rem,calc(100vw-2rem))] p-2.5 bg-slate-800 text-white text-[11px] leading-relaxed rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal pointer-events-none">
                          <div className="absolute bottom-full left-3 border-4 border-transparent border-b-slate-800" aria-hidden />
                          <div className="font-semibold text-amber-300 mb-1">[Golden Thread Rule]</div>
                          One or more forms do not meet the golden thread rules: GT
                        </div>
                      </div>
                      {/* Alert 2: Override Indicator */}
                      {overriddenEncounterIds.some(
                        (oid) => String(oid).trim() === String(encounter.id).trim()
                      ) && (
                        <div className="relative flex items-center justify-center group cursor-help">
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

                    <div className="flex flex-col truncate ml-0.5 min-w-0">
                      <span className="text-[13px] font-bold text-slate-900 leading-tight truncate">{encounter.patientName}</span>
                      <span className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">MRN: {encounter.patientMrn}</span>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-200 mx-3 shrink-0"></div>

                  {/* MIDDLE — Data columns: stretch equal height; justify-between pins values to shared baseline with Encounter ID row */}
                  <div className="flex h-[30px] items-stretch gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-hide">

                    <div className="flex flex-col justify-between self-stretch shrink-0 min-h-0 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Encounter ID</span>
                      <div className="flex items-center whitespace-nowrap">
                        <button
                          onClick={() => handleEncounterClick(encounter)}
                          className="text-[12px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                          aria-label={`View details for encounter ${encounter.id}`}
                        >
                          {encounter.id} ({new Date(encounter.dateOfService).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })})
                        </button>
                        <span className="text-slate-300 mx-1.5">•</span>
                        <button
                          onClick={() => console.log('View Fee Sheet for', encounter.id)}
                          className="text-[12px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                        >
                          View Fee Sheet
                        </button>
                      </div>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Treatment Time</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounter.treatmentTime || '-'}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Provider</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounter.provider}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Rend</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounter.provider.replace(/^Dr\.\s*/i, '')}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Facility</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap" title={getFacilityName(encounter.department)}>{getFacilityName(encounter.department)}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Enc. Status</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{encounterStatus}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-h-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Bill Status</span>
                      <span className="text-[12px] font-medium text-slate-800 leading-none whitespace-nowrap">{billingStatus}</span>
                    </div>

                    <div className="flex h-[28px] flex-col justify-between self-stretch shrink-0 min-w-[5rem] min-h-0 items-end text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none whitespace-nowrap">Amount</span>
                      <span className="text-[12px] font-bold text-slate-900 leading-none whitespace-nowrap tabular-nums">
                        {formatUsd(encounter.totalCharges ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT — Actions */}
                  <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-slate-100">
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => toggleDetails(encounter.id)}
                          className="p-1 text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50 rounded-md transition-colors"
                          aria-expanded={!collapsedDetailsIds.has(encounter.id)}
                          aria-label={collapsedDetailsIds.has(encounter.id) ? 'Show Edit Forms and Claims History' : 'Hide Edit Forms and Claims History'}
                        >
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform duration-200 ${collapsedDetailsIds.has(encounter.id) ? '' : 'rotate-180'}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p>{collapsedDetailsIds.has(encounter.id) ? 'Show Edit Forms and Claims History' : 'Hide Edit Forms and Claims History'}</p>
                      </TooltipContent>
                    </TooltipRoot>
                    {/* ── Gear / Settings popover ── */}
                    <div className="relative">
                      <button
                        className={`p-1 rounded-md transition-colors ${posPopoverEncounterId === encounter.id ? 'text-[#1a73e8] bg-blue-50' : 'text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50'}`}
                        aria-label="Settings"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPosPopoverEncounterId(posPopoverEncounterId === encounter.id ? null : encounter.id);
                          setKebabMenuEncounterId(null);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>

                      {posPopoverEncounterId === encounter.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* POS selector */}
                          <p className="text-xs font-semibold text-slate-700 mb-2">Place of Service (POS)</p>
                          <Select
                            value={posValues[encounter.id] ?? (encounter.serviceLines?.[0]?.placeOfService ?? '11')}
                            onValueChange={(val) => setPosValues(prev => ({ ...prev, [encounter.id]: val }))}
                          >
                            <SelectTrigger className="h-9 text-sm w-full">
                              <SelectValue placeholder="Select POS" />
                            </SelectTrigger>
                            <SelectContent>
                              {POS_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Additional Info */}
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Additional Info</p>
                            <div className="space-y-1 text-xs text-[#1a73e8]">
                              <p>Treatment Time: {encounter.treatmentTime || '10:00 – 10:30 AM'}</p>
                              <p>Referring Provider: Dr. Smith</p>
                              <p>Authorization: AUTH123456</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Kebab / More actions menu ── */}
                    <div className="relative">
                      <button
                        className={`p-1 rounded-md transition-colors ${kebabMenuEncounterId === encounter.id ? 'text-[#1a73e8] bg-blue-50' : 'text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50'}`}
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKebabMenuEncounterId(kebabMenuEncounterId === encounter.id ? null : encounter.id);
                          setPosPopoverEncounterId(null);
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>

                      {kebabMenuEncounterId === encounter.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {KEBAB_ACTIONS.map((action, idx) => (
                            <div key={action.id}>
                              {/* Separator before Export */}
                              {idx === 5 && <div className="my-1 border-t border-slate-100" />}
                              <button
                                type="button"
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors text-left ${action.bold ? 'font-semibold text-slate-900' : 'text-slate-700'}`}
                                onClick={() => {
                                  console.log(action.id, encounter.id);
                                  setKebabMenuEncounterId(null);
                                }}
                              >
                                {/* Icon column */}
                                {action.id === 'add'      && <span className="w-4 text-center font-bold text-slate-500 text-base leading-none">+</span>}
                                {action.id === 'generate' && (
                                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                  </svg>
                                )}
                                {action.id === 'submit'   && (
                                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                  </svg>
                                )}
                                {action.id === 'override' && (
                                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                  </svg>
                                )}
                                {action.id === 'ready'    && (
                                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {action.id === 'export'   && (
                                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                  </svg>
                                )}
                                {action.label}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body: insurance table always visible; Edit Forms / Claims History toggled by header chevron */}
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
                                  <span className="inline-block cursor-help">
                                    <FontAwesomeIcon 
                                      icon={faFileInvoiceDollar} 
                                      className={`w-3.5 h-3.5 ${isServiceBilled ? 'text-green-600' : 'text-gray-400'}`}
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
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] border-r border-slate-200 ${
                                        service.insuranceLevels.primary.billed 
                                          ? 'bg-emerald-50 text-emerald-700' 
                                          : service.insuranceLevels.primary.status === 'not_applicable'
                                          ? 'bg-slate-100 text-slate-400'
                                          : 'bg-amber-50 text-amber-700'
                                      }`}>
                                        {service.insuranceLevels.primary.billed && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                          </svg>
                                        )}
                                        {!service.insuranceLevels.primary.billed && service.insuranceLevels.primary.status !== 'not_applicable' && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                                          </svg>
                                        )}
                                        1
                                      </div>
                                      
                                      {/* Secondary - 2 */}
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] border-r border-slate-200 ${
                                        service.insuranceLevels.secondary.billed 
                                          ? 'bg-emerald-50 text-emerald-700' 
                                          : service.insuranceLevels.secondary.status === 'not_applicable'
                                          ? 'bg-slate-100 text-slate-400'
                                          : service.insuranceLevels.primary.billed
                                          ? 'bg-amber-50 text-amber-700'
                                          : 'bg-slate-100 text-slate-400'
                                      }`}>
                                        {service.insuranceLevels.secondary.billed && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                          </svg>
                                        )}
                                        {!service.insuranceLevels.secondary.billed && service.insuranceLevels.secondary.status !== 'not_applicable' && service.insuranceLevels.primary.billed && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                                          </svg>
                                        )}
                                        2
                                      </div>
                                      
                                      {/* Tertiary - 3 */}
                                      <div className={`py-0 px-1 text-[9px] font-medium flex items-center justify-center gap-0.5 min-w-[20px] ${
                                        service.insuranceLevels.tertiary.billed 
                                          ? 'bg-emerald-50 text-emerald-700' 
                                          : service.insuranceLevels.tertiary.status === 'not_applicable'
                                          ? 'bg-slate-100 text-slate-400'
                                          : service.insuranceLevels.secondary.billed
                                          ? 'bg-amber-50 text-amber-700'
                                          : 'bg-slate-100 text-slate-400'
                                      }`}>
                                        {service.insuranceLevels.tertiary.billed && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                          </svg>
                                        )}
                                        {!service.insuranceLevels.tertiary.billed && service.insuranceLevels.tertiary.status !== 'not_applicable' && service.insuranceLevels.secondary.billed && (
                                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                                          </svg>
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
                            <td className="px-1.5 py-0.5 text-slate-600 align-middle">{service.diagnosisCodes?.join(', ') || '-'}</td>
                            
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
                  {/* ── Split footer: Edit Forms | Claims History ── */}
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
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
                          <Clock size={12} className="opacity-60 shrink-0" />
                          <span>Claims History</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm">
                          Last 30 Days
                        </span>
                      </div>
                      <div className="flex flex-col gap-0 max-h-[72px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                        {getClaimsHistory(encounter).map((entry) => (
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
