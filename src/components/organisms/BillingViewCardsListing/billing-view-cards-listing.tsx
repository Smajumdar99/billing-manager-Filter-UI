import { FC, useState } from 'react'
import { BillingEncounter } from '@/types/billing-manager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faFileInvoiceDollar, faUserShield } from '@fortawesome/free-solid-svg-icons'
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
  className?: string
}

/**
 * BillingViewCardsListing Component
 * 
 * Card-based view for displaying billing encounters.
 * Provides an alternative visualization to the table view with key-value pairs.
 * Mobile-first responsive design with proper information hierarchy.
 */
// Service line item interface for billing
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
  className = ''
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('');

  const handleEncounterClick = (encounter: BillingEncounter) => {
    setSelectedEncounterId(encounter.id);
    setDialogOpen(true);
    if (onEncounterClick) {
      onEncounterClick(encounter);
    }
  };
  
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
      <div className={`space-y-4 overflow-y-auto pt-0 ${className}`}>
        <style>
          {`
            .ag-header-cell-center .ag-header-cell-label {
              justify-content: center;
            }
            .ag-header-cell-right .ag-header-cell-label {
              justify-content: flex-end;
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
                className={`bg-white rounded border transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-amber-500 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Card Header - Mobile Responsive Design with Horizontal Scroll */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 overflow-x-auto [&:has(.group:hover)]:overflow-visible">
                  <div className="px-3 md:px-4 py-3 min-w-[900px] relative" style={{ zIndex: 10 }}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 lg:justify-between">
                    {/* Mobile: First Row - Checkbox, Icons, Patient Name */}
                    <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        id={`encounter-select-${encounter.id}`}
                        checked={isSelected}
                        onChange={(e) => onEncounterSelect(encounter.id, e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer flex-shrink-0"
                        aria-label={`Select encounter ${encounter.id} for ${encounter.patientName}`}
                      />

                      {/* Status Icons - Compact */}
                      <div className="flex items-center gap-1.5 flex-shrink-0" role="group" aria-label="Status indicators">
                      {encounter.hasErrors && encounter.errorSeverity === 'critical' && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button className="p-1 hover:bg-red-50 rounded transition-colors" aria-label="Critical error">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-600" aria-hidden="true" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent><p className="text-xs">Form completion error</p></TooltipContent>
                        </TooltipRoot>
                      )}
                      
                      {encounter.billingOverrideEnabled && (
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <button className="p-1 hover:bg-green-50 rounded transition-colors" aria-label="Override enabled">
                              <FontAwesomeIcon icon={faUserShield} className="w-4 h-4 text-green-600" aria-hidden="true" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent><p className="text-xs">Billing overridden</p></TooltipContent>
                        </TooltipRoot>
                      )}
                    </div>

                      {/* Patient Name - Always visible on first row */}
                      <div className="flex flex-col flex-shrink-0 relative group z-50">
                        <h3 className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-700 transition-colors">
                          {encounter.patientName}
                        </h3>
                        
                        {/* Hover Overlay Menu - Desktop only */}
                        <div className="hidden lg:block absolute left-0 top-full mt-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
                            {/* Patient Quick Info */}
                            <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                              <p className="text-sm font-semibold text-gray-900">{encounter.patientName}</p>
                              <p className="text-xs text-gray-600">MRN: {encounter.patientId || encounter.patientMrn}</p>
                              <p className="text-xs text-gray-600">DOB: 01/15/1985 • Age: 39</p>
                              <p className="text-xs text-gray-600">Gender: Male</p>
                            </div>
                            
                            {/* Quick Links */}
                            <div className="flex flex-col gap-2 mt-3">
                              <button 
                                className="text-sm text-blue-700 hover:text-blue-900 hover:underline text-left flex items-center gap-2 transition-colors"
                                onClick={() => console.log('View Demographics')}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                View Demographics
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-xs text-gray-500">MRN: {encounter.patientId ? `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 900000) + 100000}` : encounter.patientMrn}</span>
                      </div>
                    </div>

                    {/* Patient Info & Details - Responsive Grid Layout */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:items-start gap-3 lg:gap-6 flex-1 min-w-0">
                      {/* Encounter Details - Vertical Layout */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70">Encounter ID</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEncounterClick(encounter)}
                            className="text-sm text-gray-900 hover:text-gray-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500 rounded text-left"
                            aria-label={`View details for encounter ${encounter.id}`}
                          >
                            {encounter.id} ({new Date(encounter.dateOfService).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                          </button>
                          <span className="text-gray-400">•</span>
                          <button
                            onClick={() => console.log('View Fee Sheet for', encounter.id)}
                            className="text-xs text-gray-900 hover:text-gray-700 hover:underline"
                          >
                            View Fee Sheet
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70">Treatment Time</span>
                        <span className="text-sm text-gray-900">{encounter.treatmentTime || '-'}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70">Provider</span>
                        <span className="text-sm text-gray-900">{encounter.provider}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70">Rend</span>
                        <span className="text-sm text-gray-900">{encounter.provider.replace(/^Dr\.\s*/i, '')}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70">Facility</span>
                        <span className="text-sm text-gray-900">{getFacilityName(encounter.department)}</span>
                      </div>
                      
                      {/* Status - Vertical Layout with Labels on Top */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70" id={`enc-status-label-${encounter.id}`}>Enc. Status</span>
                        <span 
                          className="text-sm text-gray-900"
                          role="status"
                          aria-labelledby={`enc-status-label-${encounter.id}`}
                        >
                          {encounterStatus}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600 font-medium opacity-70" id={`bill-status-label-${encounter.id}`}>Bill Status</span>
                        <span 
                          className="text-sm text-gray-900"
                          role="status"
                          aria-labelledby={`bill-status-label-${encounter.id}`}
                        >
                          {billingStatus}
                        </span>
                      </div>
                      
                      {/* Settings/Actions Icon with Overlay */}
                      <div className="flex items-center justify-center relative group" style={{ zIndex: 100 }}>
                        <button className="p-1 hover:bg-blue-50 rounded transition-colors" aria-label="Settings and actions">
                          <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        
                        {/* View More Overlay */}
                        <div className="absolute right-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto" style={{ zIndex: 9999 }}>
                          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
                            {/* POS Selector */}
                            <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                              <label className="text-xs font-semibold text-gray-700">Place of Service (POS)</label>
                              <Select defaultValue="11">
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select POS" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="11">11 - Office</SelectItem>
                                  <SelectItem value="12">12 - Home</SelectItem>
                                  <SelectItem value="21">21 - Inpatient Hospital</SelectItem>
                                  <SelectItem value="22">22 - Outpatient Hospital</SelectItem>
                                  <SelectItem value="23">23 - Emergency Room</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Additional Info */}
                            <div className="flex flex-col gap-2 py-3">
                              <p className="text-xs font-semibold text-gray-700">Additional Info</p>
                              <p className="text-xs text-gray-600">Treatment Time: 10:00 - 10:30 AM</p>
                              <p className="text-xs text-gray-600">Referring Provider: Dr. Smith</p>
                              <p className="text-xs text-gray-600">Authorization: AUTH123456</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Section - 3-Dot Menu (Grid Actions) */}
                    <div className="relative group z-50 flex-shrink-0">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" aria-label="More actions">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                      
                      {/* Grid Actions Menu */}
                      <div className="absolute right-0 top-full mt-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-xl py-2 w-56">
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-gray-900">Add & Justify</span>
                          </button>
                          
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-600">Generate Claims</span>
                          </button>
                          
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="text-gray-600">Submit Claims</span>
                          </button>
                          
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-gray-600">Override Blocks</span>
                          </button>
                          
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Mark Ready</span>
                          </button>
                          
                          <div className="border-t border-gray-200 my-1"></div>
                          
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-600">Export</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 md:p-4 relative" style={{ zIndex: 1 }}>

                  {/* Services Table - Compact HTML Table with WCAG Font Sizes - Horizontally scrollable on mobile */}
                  <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
                    <table className="w-full min-w-[800px] text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="pl-3 pr-0 py-2.5 text-center font-normal text-gray-700 w-6"></th>
                          <th className="pl-0 pr-1 py-2.5 text-center font-normal text-gray-700">Insurance Levels</th>
                          <th className="px-3 py-2.5 text-left font-normal text-gray-700 w-48">Insurance</th>
                          <th className="px-3 py-2.5 text-left font-normal text-gray-700">Code</th>
                          <th className="px-3 py-2.5 text-center font-normal text-gray-700">Unit</th>
                          <th className="px-3 py-2.5 text-right font-normal text-gray-700">Unit Price</th>
                          <th className="px-3 py-2.5 text-center font-normal text-gray-700">POS</th>
                          <th className="px-3 py-2.5 text-left font-normal text-gray-700">Diagnosis</th>
                          <th className="px-3 py-2.5 text-left font-normal text-gray-700">Rend</th>
                          <th className="px-3 py-2.5 text-center font-normal text-gray-700">Billing Type</th>
                          <th className="px-3 py-2.5 text-center font-normal text-gray-700">X12 Partner</th>
                          <th className="px-3 py-2.5 text-right font-normal text-gray-700">Total</th>
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
                          <tr key={service.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${service.hasError ? 'bg-red-50' : ''}`}>
                            {/* Status Icon */}
                            <td className="pl-3 pr-0 py-2.5 text-center">
                              <TooltipRoot>
                                <TooltipTrigger asChild>
                                  <span className="inline-block cursor-help">
                                    <FontAwesomeIcon 
                                      icon={faFileInvoiceDollar} 
                                      className={`w-4 h-4 ${isServiceBilled ? 'text-green-600' : 'text-gray-400'}`}
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{isServiceBilled ? 'Billed' : 'Unbilled'}</p>
                                </TooltipContent>
                              </TooltipRoot>
                            </td>
                            
                            {/* Insurance Levels */}
                            <td className="pl-0 pr-1 py-2.5 text-center">
                              {service.insuranceLevels ? (
                                <TooltipRoot>
                                  <TooltipTrigger asChild>
                                    <div className="inline-flex items-center border border-gray-300 rounded overflow-hidden cursor-help hover:scale-105 transition-transform">
                                      {/* Primary - 1 */}
                                      <div className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] border-r border-gray-300 ${
                                        service.insuranceLevels.primary.billed 
                                          ? 'bg-emerald-100 text-emerald-700' 
                                          : service.insuranceLevels.primary.status === 'not_applicable'
                                          ? 'bg-gray-100 text-gray-400'
                                          : 'bg-amber-100 text-amber-700'
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
                                      <div className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] border-r border-gray-300 ${
                                        service.insuranceLevels.secondary.billed 
                                          ? 'bg-emerald-100 text-emerald-700' 
                                          : service.insuranceLevels.secondary.status === 'not_applicable'
                                          ? 'bg-gray-100 text-gray-400'
                                          : service.insuranceLevels.primary.billed
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-gray-100 text-gray-400'
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
                                      <div className={`px-2 py-1 text-xs font-medium flex items-center justify-center gap-1 min-w-[28px] ${
                                        service.insuranceLevels.tertiary.billed 
                                          ? 'bg-emerald-100 text-emerald-700' 
                                          : service.insuranceLevels.tertiary.status === 'not_applicable'
                                          ? 'bg-gray-100 text-gray-400'
                                          : service.insuranceLevels.secondary.billed
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-gray-100 text-gray-400'
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
                            <td className="px-3 py-2.5">
                              <Select defaultValue="primary">
                                <SelectTrigger className="h-8 text-xs w-full [&>span]:truncate [&>span]:block [&>span]:overflow-hidden [&>span]:whitespace-nowrap">
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
                            
                            {/* CPT Code */}
                            <td className="px-3 py-2.5">
                              <div className="flex flex-col gap-0.5">
                                <button
                                  className="font-medium text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-left"
                                  onClick={() => {
                                    // Handle CPT code click - can open modal or navigate
                                    console.log('CPT Code clicked:', service.serviceCode)
                                  }}
                                >
                                  {service.serviceCode} {service.diagnosisCodes && service.diagnosisCodes.length > 0 && `(${service.diagnosisCodes.join(', ')})`}
                                </button>
                                <span className="text-[10px] text-gray-500 uppercase">CPT4</span>
                              </div>
                            </td>
                            
                            {/* Quantity */}
                            <td className="px-3 py-2.5 text-center text-gray-900">{service.quantity}</td>
                            
                            {/* Unit Price */}
                            <td className="px-3 py-2.5 text-right text-gray-900">${service.unitPrice.toFixed(2)}</td>
                            
                            {/* POS */}
                            <td className="px-3 py-2.5 text-center text-gray-600">{service.placeOfService || '-'}</td>
                            
                            {/* Diagnosis */}
                            <td className="px-3 py-2.5 text-gray-600">{service.diagnosisCodes?.join(', ') || '-'}</td>
                            
                            {/* Rendering Provider */}
                            <td className="px-3 py-2.5 text-gray-900">{encounter.provider.replace(/^Dr\.\s*/i, '')}</td>
                            
                            {/* Billing Type */}
                            <td className="px-3 py-2.5 text-center text-gray-900">HCFA</td>
                            
                            {/* X12 Partner */}
                            <td className="px-3 py-2.5 text-center text-gray-900">-</td>
                            
                            {/* Total */}
                            <td className="px-3 py-2.5 text-right font-semibold text-gray-900">${service.totalPrice.toFixed(2)}</td>
                          </tr>
                          {service.hasError && service.errorMessage && (
                            <tr className="bg-red-50">
                              <td colSpan={12} className="px-3 py-2 text-left">
                                <div className="flex items-center gap-2 text-red-700">
                                  <span className="text-sm font-medium">{service.errorMessage}</span>
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
              </div>
            )
          })
        )}
      </div>

      {/* Encounter Details Dialog */}
      <EncounterDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        encounters={encounters}
        selectedEncounterId={selectedEncounterId}
      />
    </TooltipProvider>
  )
}

export default BillingViewCardsListing
