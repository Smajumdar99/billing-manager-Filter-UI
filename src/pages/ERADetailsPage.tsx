import { FC, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Label } from '@/components/atoms/Label/label'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'

// Import types from ERAProcessPage (in production, these would be in a shared types file)
interface ClaimLineItem {
  id: string
  serviceDate: string
  procedureCode: string
  procedureDescription: string
  chargedAmount: number
  allowedAmount: number
  paidAmount: number
  adjustmentAmount: number
  adjustmentReason?: string
  deductible: number
  coinsurance: number
  copay: number
  patientResponsibility: number
}

interface Claim {
  id: string
  claimNumber: string
  patientName: string
  patientId: string
  dateOfService: string
  provider: string
  insurance: string
  claimStatus: 'Paid' | 'Partial' | 'Denied' | 'Pending'
  totalChargedAmount: number
  totalAllowedAmount: number
  totalPaidAmount: number
  totalAdjustmentAmount: number
  totalPatientResponsibility: number
  payerNotes?: string
  lineItems: ClaimLineItem[]
}

interface ERACheck {
  id: string
  insurance: string
  checkDate: string
  checkNumber: string
  checkAmount: number
  checkProcessed: boolean
  totalClaimCount: number
  processedClaimCount: number
  partialProcessedClaimCount: number
  unprocessedClaimCount: number
  note: string
  claims: Claim[]
}

interface ERA {
  id: string
  insurance: string
  processedOn: string
  processedBy: string
  notes: string
  totalChecks: number
  checks: ERACheck[]
  eraFileName: string
}

/**
 * ERA Details Page
 * 
 * Comprehensive view of ERA with claim-level breakdown
 */
export const ERADetailsPage: FC = () => {
  const navigate = useNavigate()
  const { eraId } = useParams<{ eraId: string }>()
  
  // Set document title
  useDocumentTitle('ERA Details')
  
  // Responsive state
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('ERA Process')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Collapsed by default for more space
  
  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Selected check for master-detail view
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null)

  // Force sidebar to be collapsed on ERA Details page
  useEffect(() => {
    localStorage.setItem('billing-sidebar-collapsed', 'true')
    setSidebarCollapsed(true)
  }, [])

  // In production, fetch ERA data based on eraId from API
  // For now, using mock data - TODO: Replace with actual API call
  // This should fetch the complete ERA with all its checks based on the eraId parameter
  const selectedERA: ERA | null = {
    id: 'ERA-001',
    insurance: 'Blue Cross Blue Shield',
    processedOn: '2024-10-28',
    processedBy: 'Sarah Johnson',
    notes: 'All checks processed successfully',
    totalChecks: 3,
    eraFileName: 'BCBS_835_20241028.txt',
    checks: [
      {
        id: 'CHK-001',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-25',
        checkNumber: '00012345',
        checkAmount: 15250.00,
        checkProcessed: true,
        totalClaimCount: 25,
        processedClaimCount: 25,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Fully processed',
        claims: [
          {
            id: 'CLM-001',
            claimNumber: 'CLM2024001',
            patientName: 'John Smith',
            patientId: '9330394.8484834',
            dateOfService: '2024-10-15',
            provider: 'Sarah Williams',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Paid',
            totalChargedAmount: 250.00,
            totalAllowedAmount: 200.00,
            totalPaidAmount: 160.00,
            totalAdjustmentAmount: 60.00,
            totalPatientResponsibility: 30.00,
            payerNotes: "Claim status 1: Processed as Primary\nProcedure 'Claim' is inserted artificially to force claim balancing.\n\nThis is a roll up code 90834 with charge 180",
            lineItems: [
              {
                id: 'LI-001',
                serviceDate: '2024-10-15',
                procedureCode: '99213',
                procedureDescription: 'Office Visit - Established Patient - Service Charge',
                chargedAmount: 250.00,
                allowedAmount: 200.00,
                paidAmount: 0.00,
                adjustmentAmount: 50.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 0.00,
                coinsurance: 0.00,
                copay: 0.00,
                patientResponsibility: 200.00
              },
              {
                id: 'LI-001-PAY',
                serviceDate: '2024-10-15',
                procedureCode: '99213',
                procedureDescription: 'Office Visit - Established Patient - Payer Payment',
                chargedAmount: 0.00,
                allowedAmount: 0.00,
                paidAmount: 160.00,
                adjustmentAmount: 0.00,
                adjustmentReason: '',
                deductible: 0.00,
                coinsurance: 0.00,
                copay: 0.00,
                patientResponsibility: 40.00
              },
              {
                id: 'LI-001-ADJ',
                serviceDate: '2024-10-15',
                procedureCode: '99213',
                procedureDescription: 'Office Visit - Established Patient - Provider Adjustment',
                chargedAmount: 0.00,
                allowedAmount: 0.00,
                paidAmount: 0.00,
                adjustmentAmount: 10.00,
                adjustmentReason: 'Provider write-off adjustment',
                deductible: 0.00,
                coinsurance: 0.00,
                copay: 0.00,
                patientResponsibility: 30.00
              }
            ]
          },
          {
            id: 'CLM-002',
            claimNumber: 'CLM2024002',
            patientName: 'Mary Johnson',
            patientId: '8847562.3392847',
            dateOfService: '2024-10-16',
            provider: 'Michael Brown',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Paid',
            totalChargedAmount: 1200.00,
            totalAllowedAmount: 1000.00,
            totalPaidAmount: 800.00,
            totalAdjustmentAmount: 200.00,
            totalPatientResponsibility: 200.00,
            payerNotes: "Claim status 2: Processed as Secondary\nProcedure code adjusted based on fee schedule. Patient responsibility calculated after primary payment.",
            lineItems: [
              {
                id: 'LI-004',
                serviceDate: '2024-10-16',
                procedureCode: '99214',
                procedureDescription: 'Office Visit - Detailed',
                chargedAmount: 400.00,
                allowedAmount: 350.00,
                paidAmount: 280.00,
                adjustmentAmount: 50.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 0.00,
                coinsurance: 70.00,
                copay: 0.00,
                patientResponsibility: 70.00
              },
              {
                id: 'LI-005',
                serviceDate: '2024-10-16',
                procedureCode: '71020',
                procedureDescription: 'Chest X-Ray - 2 Views',
                chargedAmount: 800.00,
                allowedAmount: 650.00,
                paidAmount: 520.00,
                adjustmentAmount: 150.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 0.00,
                coinsurance: 130.00,
                copay: 0.00,
                patientResponsibility: 130.00
              }
            ]
          },
          {
            id: 'CLM-003',
            claimNumber: 'CLM2024003',
            patientName: 'Robert Davis',
            patientId: '7729384.9283746',
            dateOfService: '2024-10-17',
            provider: 'Emily Chen',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Partial',
            totalChargedAmount: 2500.00,
            totalAllowedAmount: 2000.00,
            totalPaidAmount: 1500.00,
            totalAdjustmentAmount: 500.00,
            totalPatientResponsibility: 500.00,
            payerNotes: "Claim status 3: Partially Processed\nProcedure 'Claim' is inserted artificially to force claim balancing.\n\nAdditional documentation required for remaining balance. Please submit medical records within 30 days.",
            lineItems: [
              {
                id: 'LI-006',
                serviceDate: '2024-10-17',
                procedureCode: '99285',
                procedureDescription: 'Emergency Department Visit - High Complexity',
                chargedAmount: 1500.00,
                allowedAmount: 1200.00,
                paidAmount: 960.00,
                adjustmentAmount: 300.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 100.00,
                coinsurance: 140.00,
                copay: 0.00,
                patientResponsibility: 240.00
              },
              {
                id: 'LI-007',
                serviceDate: '2024-10-17',
                procedureCode: '70450',
                procedureDescription: 'CT Scan Head - Without Contrast',
                chargedAmount: 1000.00,
                allowedAmount: 800.00,
                paidAmount: 540.00,
                adjustmentAmount: 200.00,
                adjustmentReason: 'Pending additional documentation',
                deductible: 100.00,
                coinsurance: 160.00,
                copay: 0.00,
                patientResponsibility: 260.00
              }
            ]
          }
        ]
      },
      {
        id: 'CHK-002',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-26',
        checkNumber: '00012346',
        checkAmount: 8750.50,
        checkProcessed: true,
        totalClaimCount: 15,
        processedClaimCount: 13,
        partialProcessedClaimCount: 2,
        unprocessedClaimCount: 0,
        note: 'Partially processed',
        claims: [
          {
            id: 'CLM-004',
            claimNumber: 'CLM2024004',
            patientName: 'Jennifer Wilson',
            patientId: '6628475.2847563',
            dateOfService: '2024-10-18',
            provider: 'James Anderson',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Paid',
            totalChargedAmount: 650.00,
            totalAllowedAmount: 550.00,
            totalPaidAmount: 440.00,
            totalAdjustmentAmount: 100.00,
            totalPatientResponsibility: 110.00,
            payerNotes: 'Claim processed successfully.',
            lineItems: [
              {
                id: 'LI-008',
                serviceDate: '2024-10-18',
                procedureCode: '99213',
                procedureDescription: 'Office Visit - Established Patient',
                chargedAmount: 650.00,
                allowedAmount: 550.00,
                paidAmount: 440.00,
                adjustmentAmount: 100.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 50.00,
                coinsurance: 60.00,
                copay: 0.00,
                patientResponsibility: 110.00
              }
            ]
          }
        ]
      },
      {
        id: 'CHK-003',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-27',
        checkNumber: '00012347',
        checkAmount: 22100.75,
        checkProcessed: false,
        totalClaimCount: 30,
        processedClaimCount: 18,
        partialProcessedClaimCount: 5,
        unprocessedClaimCount: 7,
        note: 'Processing in progress',
        claims: [
          {
            id: 'CLM-005',
            claimNumber: 'CLM2024005',
            patientName: 'Michael Thompson',
            patientId: '5537284.8374629',
            dateOfService: '2024-10-19',
            provider: 'Lisa Martinez',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Pending',
            totalChargedAmount: 3200.00,
            totalAllowedAmount: 2800.00,
            totalPaidAmount: 0.00,
            totalAdjustmentAmount: 400.00,
            totalPatientResponsibility: 2800.00,
            payerNotes: 'Under review. Additional documentation requested.',
            lineItems: [
              {
                id: 'LI-009',
                serviceDate: '2024-10-19',
                procedureCode: '99215',
                procedureDescription: 'Office Visit - Comprehensive',
                chargedAmount: 500.00,
                allowedAmount: 450.00,
                paidAmount: 0.00,
                adjustmentAmount: 50.00,
                adjustmentReason: 'Under review',
                deductible: 0.00,
                coinsurance: 0.00,
                copay: 0.00,
                patientResponsibility: 450.00
              },
              {
                id: 'LI-010',
                serviceDate: '2024-10-19',
                procedureCode: '93000',
                procedureDescription: 'Electrocardiogram - Complete',
                chargedAmount: 2700.00,
                allowedAmount: 2350.00,
                paidAmount: 0.00,
                adjustmentAmount: 350.00,
                adjustmentReason: 'Pending authorization',
                deductible: 0.00,
                coinsurance: 0.00,
                copay: 0.00,
                patientResponsibility: 2350.00
              }
            ]
          }
        ]
      }
    ]
  }

  // Auto-select first check when ERA data loads
  useEffect(() => {
    if (selectedERA && selectedERA.checks && selectedERA.checks.length > 0 && !selectedCheckId) {
      setSelectedCheckId(selectedERA.checks[0].id)
    }
  }, [selectedERA, selectedCheckId])

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(prev => !prev)
  }

  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Billing', href: '/billing' },
    { label: 'ERA Process', href: '/era-process' },
    { label: selectedERA?.id || 'Details', href: '#', current: true }
  ]

  if (!selectedERA) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon icon="exclamation-triangle" className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ERA Not Found</h2>
          <p className="text-gray-600 mb-4">The requested ERA could not be found.</p>
          <Button onClick={() => navigate('/era-process')}>
            <Icon icon="arrow-left" className="w-4 h-4 mr-2" />
            Back to ERA Process
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar-placeholder.png"
      />
      
      {/* Main Navigation */}
      <MainNavigationBar onNavigate={handleMainNavigation} />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex-1 overflow-hidden bg-zinc-200 flex relative">
        {/* Desktop Billing Sidebar */}
        {!isMobile && (
          <Sidebar
            activeItem={activeSidebarItem}
            onMenuSelect={handleSidebarSelect}
            onSearch={handleSidebarSearch}
            onCollapsedChange={setSidebarCollapsed}
            isCollapsed={sidebarCollapsed}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            
            {/* Sidebar Panel */}
            <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 flex flex-col">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2"
                >
                  <Icon icon="times" className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeItem={activeSidebarItem}
                  onMenuSelect={(item) => {
                    handleSidebarSelect(item)
                    setMobileSidebarOpen(false)
                  }}
                  onSearch={handleSidebarSearch}
                  onCollapsedChange={setSidebarCollapsed}
                  defaultCollapsed={false}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="h-full flex flex-col">
              {/* Header Section */}
              <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  {/* Mobile Menu Button */}
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMobileSidebarToggle}
                      className="mr-2"
                    >
                      <Icon icon="bars" className="w-5 h-5" />
                    </Button>
                  )}
                  
                  {/* Title Section */}
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Icon icon="file-invoice-dollar" className="w-5 h-5 text-blue-600" />
                      ERA Details
                    </h1>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/era-process')}
                    >
                      <Icon icon="arrow-left" className="w-4 h-4 mr-1" />
                      Back to List
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Printing ERA details...')
                        window.print()
                      }}
                    >
                      <Icon icon="print" className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>

                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />
              </div>

              {/* Content Area - 2 Column Layout */}
              <div className="flex-1 overflow-hidden flex">
                {/* Left Column - Checks List */}
                <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                  <div className="p-5 border-b border-gray-200 bg-white">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checks ({selectedERA.checks.length})
                    </h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {selectedERA.checks.map((check) => {
                      const isSelected = selectedCheckId === check.id
                      return (
                        <button
                          key={check.id}
                          onClick={() => setSelectedCheckId(check.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                            isSelected 
                              ? 'bg-white shadow-md ring-2 ring-blue-500 ring-opacity-50' 
                              : 'bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200'
                          }`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-baseline justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-gray-900">{check.checkNumber}</span>
                                {!check.checkProcessed && (
                                  <Icon icon="exclamation-triangle" className="w-4 h-4 text-amber-500" />
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{new Date(check.checkDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                ${(check.checkAmount / 1000).toFixed(1)}k
                              </span>
                              <span className="text-xs text-gray-500">{check.totalClaimCount} claims</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right Column - Claim Details */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/90 via-white to-purple-50/90">
                  {selectedCheckId ? (
                    (() => {
                      const selectedCheck = selectedERA.checks.find(c => c.id === selectedCheckId)
                      if (!selectedCheck) return null
                      
                      return (
                        <div className="p-8 space-y-6">
                          {/* Alert Message - Check Distribution Warning */}
                          {!selectedCheck.checkProcessed && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <Icon icon="exclamation-triangle" className="w-5 h-5 text-amber-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900">
                                  Total Distribution for check number <span className="font-bold">{selectedCheck.checkNumber}</span> is not full
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Claims List */}
                          {selectedCheck.claims && selectedCheck.claims.length > 0 ? (
                            <div className="space-y-6">
                              {selectedCheck.claims.map((claim: Claim) => (
                            <div key={claim.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                              {/* Claim Header - Compact Single Row */}
                              <div className="bg-white px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between gap-6">
                                  {/* Left: Patient & Claim Info */}
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-base font-bold text-gray-900">{claim.patientName}</h3>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-gray-500">{claim.patientId}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            console.log('View patient forms:', claim.patientId)
                                          }}
                                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                                          title="View Patient Forms"
                                        >
                                          <Icon icon="eye" className="w-3.5 h-3.5 text-blue-600" />
                                        </button>
                                      </div>
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        claim.claimStatus === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' :
                                        claim.claimStatus === 'Partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                        claim.claimStatus === 'Denied' ? 'bg-red-50 text-red-700 border border-red-200' :
                                        'bg-gray-50 text-gray-600 border border-gray-200'
                                      }`}>
                                        {claim.claimStatus}
                                      </span>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300" />
                                    <div className="flex items-center gap-4 text-xs">
                                      <div>
                                        <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Claim #</div>
                                        <div className="text-gray-900 font-medium">{claim.claimNumber}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Service Date</div>
                                        <div className="text-gray-900 font-medium">{new Date(claim.dateOfService).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Provider</div>
                                        <div className="text-gray-900 font-medium">{claim.provider}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Right: Financial Summary & Actions */}
                                  <div className="flex items-center gap-6">
                                    {/* Financial Summary */}
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">Charged</div>
                                      <div className="text-sm font-medium text-gray-900">${claim.totalChargedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">Allowed</div>
                                      <div className="text-sm font-medium text-gray-900">${claim.totalAllowedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">Paid</div>
                                      <div className="text-sm font-semibold text-green-700">${claim.totalPaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">Adj.</div>
                                      <div className="text-sm font-medium text-amber-700">${claim.totalAdjustmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">Patient</div>
                                      <div className="text-base font-bold text-red-700">${claim.totalPatientResponsibility.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    
                                    {/* Action Icons */}
                                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          console.log('Make adjustments for claim:', claim.claimNumber)
                                        }}
                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                        title="Make Adjustments"
                                      >
                                        <img 
                                          src="/icons/adjustments.svg" 
                                          alt="Adjustments" 
                                          className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          console.log('Send reminder for claim:', claim.claimNumber)
                                        }}
                                        className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                                        title="Send Reminder"
                                      >
                                        <Icon icon="bell" className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Payer Notes */}
                              {claim.payerNotes && (
                                <div className="mx-6 mt-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                  <div className="flex items-start gap-2">
                                    <Icon icon="comment-alt" className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                      <Label className="text-xs text-blue-700 mb-1">Payer Notes</Label>
                                      <p className="text-sm text-blue-900">{claim.payerNotes}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Line Items Table */}
                              {claim.lineItems && claim.lineItems.length > 0 && (
                                <div className="px-6 pb-6 mt-4">
                                  <Label className="text-sm text-gray-700 mb-3 block font-medium">Service Line Items</Label>
                                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                          <th className="px-3 py-3 text-left font-medium text-gray-700">Service Date</th>
                                          <th className="px-3 py-3 text-left font-medium text-gray-700">CPT Code</th>
                                          <th className="px-3 py-3 text-left font-medium text-gray-700">Description</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Charged</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Contract Amount</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Paid</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Adjustment</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Amount</th>
                                          <th className="px-3 py-3 text-right font-medium text-gray-700">Balance</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200 bg-white">
                                        {claim.lineItems.map((lineItem) => (
                                          <tr key={lineItem.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                                              {new Date(lineItem.serviceDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 py-3 font-mono text-gray-900 font-medium">{lineItem.procedureCode}</td>
                                            <td className="px-3 py-3 text-gray-700">{lineItem.procedureDescription}</td>
                                            <td className="px-3 py-3 text-right text-gray-900">
                                              ${lineItem.chargedAmount.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-blue-700 font-semibold">
                                              ${lineItem.allowedAmount.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-green-700 font-medium">
                                              ${lineItem.paidAmount.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-amber-700">
                                              <div>${lineItem.adjustmentAmount.toFixed(2)}</div>
                                              {lineItem.adjustmentReason && (
                                                <div className="text-xs text-gray-500 mt-0.5">{lineItem.adjustmentReason}</div>
                                              )}
                                            </td>
                                            <td className="px-3 py-3 text-right text-blue-700 font-semibold">
                                              ${lineItem.allowedAmount.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-red-700 font-bold">
                                              ${lineItem.patientResponsibility.toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                              <Icon icon="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                              <p className="text-sm font-medium">No claim details available for this check</p>
                              <p className="text-xs text-gray-400 mt-1">Claims data may still be processing</p>
                            </div>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Icon icon="hand-pointer" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium">Select a check to view details</p>
                        <p className="text-xs text-gray-400 mt-1">Click on a check from the list on the left</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ERADetailsPage
