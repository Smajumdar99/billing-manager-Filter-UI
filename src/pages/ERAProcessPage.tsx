import { FC, useState, useCallback, useEffect } from 'react'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/input'
import { Label } from '@/components/atoms/Label/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Icon } from '@/components/atoms/Icon/Icon'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef } from 'ag-grid-community'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/atoms/Dialog/dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

// Claim Line Item interface
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

// Claim interface
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

// ERA Check interface
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

// ERA interface
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

// Mock ERA data
const mockERAData: ERA[] = [
  {
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
            patientId: 'PT-12345',
            dateOfService: '2024-10-15',
            provider: 'Dr. Sarah Williams',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Paid',
            totalChargedAmount: 850.00,
            totalAllowedAmount: 750.00,
            totalPaidAmount: 600.00,
            totalAdjustmentAmount: 100.00,
            totalPatientResponsibility: 150.00,
            payerNotes: 'Claim processed successfully. Deductible applied.',
            lineItems: [
              {
                id: 'LI-001',
                serviceDate: '2024-10-15',
                procedureCode: '99213',
                procedureDescription: 'Office Visit - Established Patient',
                chargedAmount: 250.00,
                allowedAmount: 200.00,
                paidAmount: 160.00,
                adjustmentAmount: 50.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 20.00,
                coinsurance: 20.00,
                copay: 0.00,
                patientResponsibility: 40.00
              },
              {
                id: 'LI-002',
                serviceDate: '2024-10-15',
                procedureCode: '80053',
                procedureDescription: 'Comprehensive Metabolic Panel',
                chargedAmount: 300.00,
                allowedAmount: 250.00,
                paidAmount: 200.00,
                adjustmentAmount: 50.00,
                adjustmentReason: 'Contractual adjustment',
                deductible: 30.00,
                coinsurance: 20.00,
                copay: 0.00,
                patientResponsibility: 50.00
              },
              {
                id: 'LI-003',
                serviceDate: '2024-10-15',
                procedureCode: '36415',
                procedureDescription: 'Venipuncture',
                chargedAmount: 300.00,
                allowedAmount: 300.00,
                paidAmount: 240.00,
                adjustmentAmount: 0.00,
                deductible: 40.00,
                coinsurance: 20.00,
                copay: 0.00,
                patientResponsibility: 60.00
              }
            ]
          },
          {
            id: 'CLM-002',
            claimNumber: 'CLM2024002',
            patientName: 'Mary Johnson',
            patientId: 'PT-12346',
            dateOfService: '2024-10-16',
            provider: 'Dr. Michael Brown',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Paid',
            totalChargedAmount: 1200.00,
            totalAllowedAmount: 1000.00,
            totalPaidAmount: 800.00,
            totalAdjustmentAmount: 200.00,
            totalPatientResponsibility: 200.00,
            payerNotes: 'Standard processing. Patient copay required.',
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
            patientId: 'PT-12347',
            dateOfService: '2024-10-17',
            provider: 'Dr. Emily Chen',
            insurance: 'Blue Cross Blue Shield',
            claimStatus: 'Partial',
            totalChargedAmount: 2500.00,
            totalAllowedAmount: 2000.00,
            totalPaidAmount: 1500.00,
            totalAdjustmentAmount: 500.00,
            totalPatientResponsibility: 500.00,
            payerNotes: 'Partial payment. Additional documentation required for remaining balance.',
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
        checkAmount: 8420.50,
        checkProcessed: true,
        totalClaimCount: 18,
        processedClaimCount: 15,
        partialProcessedClaimCount: 3,
        unprocessedClaimCount: 0,
        note: 'Partial payments on 3 claims',
        claims: []
      },
      {
        id: 'CHK-003',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-27',
        checkNumber: '00012347',
        checkAmount: 12100.00,
        checkProcessed: false,
        totalClaimCount: 20,
        processedClaimCount: 0,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 20,
        note: 'Pending review'
      }
    ]
  },
  {
    id: 'ERA-002',
    insurance: 'Aetna',
    processedOn: '2024-10-27',
    processedBy: 'Michael Chen',
    notes: 'Requires attention - 2 checks pending',
    totalChecks: 2,
    eraFileName: 'AETNA_835_20241027.txt',
    checks: [
      {
        id: 'CHK-004',
        insurance: 'Aetna',
        checkDate: '2024-10-24',
        checkNumber: 'AET98765',
        checkAmount: 22500.00,
        checkProcessed: true,
        totalClaimCount: 35,
        processedClaimCount: 35,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Completed'
      },
      {
        id: 'CHK-005',
        insurance: 'Aetna',
        checkDate: '2024-10-25',
        checkNumber: 'AET98766',
        checkAmount: 5600.00,
        checkProcessed: false,
        totalClaimCount: 12,
        processedClaimCount: 8,
        partialProcessedClaimCount: 2,
        unprocessedClaimCount: 2,
        note: 'Missing claim details for 2 claims'
      }
    ]
  },
  {
    id: 'ERA-003',
    insurance: 'UnitedHealthcare',
    processedOn: '2024-10-26',
    processedBy: 'Emily Rodriguez',
    notes: 'Large batch - all processed',
    totalChecks: 5,
    eraFileName: 'UHC_835_20241026.txt',
    checks: [
      {
        id: 'CHK-006',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-23',
        checkNumber: 'UHC45678',
        checkAmount: 18900.00,
        checkProcessed: true,
        totalClaimCount: 42,
        processedClaimCount: 42,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Clean batch'
      },
      {
        id: 'CHK-007',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-23',
        checkNumber: 'UHC45679',
        checkAmount: 12300.00,
        checkProcessed: true,
        totalClaimCount: 28,
        processedClaimCount: 28,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Clean batch'
      },
      {
        id: 'CHK-008',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-24',
        checkNumber: 'UHC45680',
        checkAmount: 9800.00,
        checkProcessed: true,
        totalClaimCount: 22,
        processedClaimCount: 20,
        partialProcessedClaimCount: 2,
        unprocessedClaimCount: 0,
        note: 'Minor adjustments'
      },
      {
        id: 'CHK-009',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-24',
        checkNumber: 'UHC45681',
        checkAmount: 15600.00,
        checkProcessed: true,
        totalClaimCount: 31,
        processedClaimCount: 31,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Clean batch'
      },
      {
        id: 'CHK-010',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-25',
        checkNumber: 'UHC45682',
        checkAmount: 7200.00,
        checkProcessed: true,
        totalClaimCount: 16,
        processedClaimCount: 16,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Clean batch'
      }
    ]
  },
  {
    id: 'ERA-004',
    insurance: 'Cigna',
    processedOn: '2024-10-25',
    processedBy: 'David Martinez',
    notes: 'Mixed processing status',
    totalChecks: 4,
    eraFileName: 'CIGNA_835_20241025.txt',
    checks: [
      {
        id: 'CHK-011',
        insurance: 'Cigna',
        checkDate: '2024-10-22',
        checkNumber: 'CIG789012',
        checkAmount: 14500.00,
        checkProcessed: true,
        totalClaimCount: 30,
        processedClaimCount: 28,
        partialProcessedClaimCount: 2,
        unprocessedClaimCount: 0,
        note: 'Two claims with adjustments'
      },
      {
        id: 'CHK-012',
        insurance: 'Cigna',
        checkDate: '2024-10-23',
        checkNumber: 'CIG789013',
        checkAmount: 8900.00,
        checkProcessed: false,
        totalClaimCount: 18,
        processedClaimCount: 10,
        partialProcessedClaimCount: 5,
        unprocessedClaimCount: 3,
        note: 'Pending verification on 3 claims'
      },
      {
        id: 'CHK-013',
        insurance: 'Cigna',
        checkDate: '2024-10-23',
        checkNumber: 'CIG789014',
        checkAmount: 11200.00,
        checkProcessed: true,
        totalClaimCount: 24,
        processedClaimCount: 24,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Completed'
      },
      {
        id: 'CHK-014',
        insurance: 'Cigna',
        checkDate: '2024-10-24',
        checkNumber: 'CIG789015',
        checkAmount: 6750.00,
        checkProcessed: true,
        totalClaimCount: 15,
        processedClaimCount: 15,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Completed'
      }
    ]
  },
  {
    id: 'ERA-005',
    insurance: 'Humana',
    processedOn: '2024-10-24',
    processedBy: 'Lisa Thompson',
    notes: 'Standard processing',
    totalChecks: 2,
    eraFileName: 'HUMANA_835_20241024.txt',
    checks: [
      {
        id: 'CHK-015',
        insurance: 'Humana',
        checkDate: '2024-10-21',
        checkNumber: 'HUM567890',
        checkAmount: 19800.00,
        checkProcessed: true,
        totalClaimCount: 38,
        processedClaimCount: 38,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'All claims approved'
      },
      {
        id: 'CHK-016',
        insurance: 'Humana',
        checkDate: '2024-10-22',
        checkNumber: 'HUM567891',
        checkAmount: 13400.00,
        checkProcessed: true,
        totalClaimCount: 26,
        processedClaimCount: 24,
        partialProcessedClaimCount: 2,
        unprocessedClaimCount: 0,
        note: 'Minor denials on 2 claims'
      }
    ]
  },
  {
    id: 'ERA-006',
    insurance: 'Medicare',
    processedOn: '2024-10-23',
    processedBy: 'Robert Kim',
    notes: 'Government payer - standard turnaround',
    totalChecks: 3,
    eraFileName: 'MEDICARE_835_20241023.txt',
    checks: [
      {
        id: 'CHK-017',
        insurance: 'Medicare',
        checkDate: '2024-10-20',
        checkNumber: 'MED234567',
        checkAmount: 16700.00,
        checkProcessed: true,
        totalClaimCount: 45,
        processedClaimCount: 42,
        partialProcessedClaimCount: 3,
        unprocessedClaimCount: 0,
        note: 'Standard Medicare adjustments'
      },
      {
        id: 'CHK-018',
        insurance: 'Medicare',
        checkDate: '2024-10-21',
        checkNumber: 'MED234568',
        checkAmount: 21300.00,
        checkProcessed: true,
        totalClaimCount: 52,
        processedClaimCount: 52,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'Clean submission'
      },
      {
        id: 'CHK-019',
        insurance: 'Medicare',
        checkDate: '2024-10-22',
        checkNumber: 'MED234569',
        checkAmount: 9500.00,
        checkProcessed: false,
        totalClaimCount: 20,
        processedClaimCount: 15,
        partialProcessedClaimCount: 3,
        unprocessedClaimCount: 2,
        note: 'Awaiting additional documentation'
      }
    ]
  },
  {
    id: 'ERA-007',
    insurance: 'Blue Cross Blue Shield',
    processedOn: '2024-10-29',
    processedBy: 'System',
    notes: 'Automatically processed via EDI integration',
    totalChecks: 2,
    eraFileName: 'BCBS_835_20241029_SYSTEM.txt',
    checks: [
      {
        id: 'CHK-020',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-28',
        checkNumber: '00012348',
        checkAmount: 18200.00,
        checkProcessed: true,
        totalClaimCount: 30,
        processedClaimCount: 30,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      },
      {
        id: 'CHK-021',
        insurance: 'Blue Cross Blue Shield',
        checkDate: '2024-10-29',
        checkNumber: '00012349',
        checkAmount: 15400.00,
        checkProcessed: true,
        totalClaimCount: 22,
        processedClaimCount: 22,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      }
    ]
  },
  {
    id: 'ERA-008',
    insurance: 'UnitedHealthcare',
    processedOn: '2024-10-30',
    processedBy: 'System',
    notes: 'Automated processing completed successfully',
    totalChecks: 3,
    eraFileName: 'UHC_835_20241030_SYSTEM.txt',
    checks: [
      {
        id: 'CHK-022',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-28',
        checkNumber: 'UHC45683',
        checkAmount: 11200.00,
        checkProcessed: true,
        totalClaimCount: 18,
        processedClaimCount: 18,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      },
      {
        id: 'CHK-023',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-29',
        checkNumber: 'UHC45684',
        checkAmount: 9800.00,
        checkProcessed: true,
        totalClaimCount: 15,
        processedClaimCount: 15,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      },
      {
        id: 'CHK-024',
        insurance: 'UnitedHealthcare',
        checkDate: '2024-10-30',
        checkNumber: 'UHC45685',
        checkAmount: 13400.00,
        checkProcessed: true,
        totalClaimCount: 20,
        processedClaimCount: 20,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      }
    ]
  },
  {
    id: 'ERA-009',
    insurance: 'Aetna',
    processedOn: '2024-10-31',
    processedBy: 'System',
    notes: 'EDI auto-processing - all checks validated',
    totalChecks: 1,
    eraFileName: 'AETNA_835_20241031_SYSTEM.txt',
    checks: [
      {
        id: 'CHK-025',
        insurance: 'Aetna',
        checkDate: '2024-10-30',
        checkNumber: 'AET98767',
        checkAmount: 28700.00,
        checkProcessed: true,
        totalClaimCount: 45,
        processedClaimCount: 45,
        partialProcessedClaimCount: 0,
        unprocessedClaimCount: 0,
        note: 'System processed',
        claims: []
      }
    ]
  }
]

/**
 * Get insurance company logo/avatar
 * Uses initials-based avatars for consistent, reliable display
 */
const getInsuranceLogo = (insuranceName: string): string => {
  // Extract initials from insurance name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3)
  }
  
  // Color mapping for different insurance companies
  const colorMap: Record<string, string> = {
    'Blue Cross Blue Shield': '0066CC',
    'Aetna': '7C3AED',
    'UnitedHealthcare': '002677',
    'Cigna': 'FF6B35',
    'Humana': '00A758',
    'Medicare': 'DC2626',
    'Medicaid': '059669'
  }
  
  const initials = getInitials(insuranceName)
  const bgColor = colorMap[insuranceName] || '6B7280'
  
  // Use UI Avatars API - always works and generates professional logos
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=32&bold=true&rounded=true`
}

/**
 * Column definitions for Check Details AG Grid
 */
const getCheckColumnDefs = (onCountClick?: (check: ERACheck, filterType: 'total' | 'processed' | 'partial' | 'unprocessed') => void): ColDef<ERACheck>[] => [
  {
    headerName: 'Insurance',
    field: 'insurance',
    width: 200,
    cellStyle: { fontWeight: '500' }
  },
  {
    headerName: 'Check Date',
    field: 'checkDate',
    width: 130,
    valueFormatter: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : ''
    }
  },
  {
    headerName: 'Check Number',
    field: 'checkNumber',
    width: 150,
    cellStyle: { fontFamily: 'monospace', fontWeight: '500' }
  },
  {
    headerName: 'Check Amount',
    field: 'checkAmount',
    width: 150,
    type: 'rightAligned',
    valueFormatter: (params) => {
      return params.value ? `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : ''
    },
    cellStyle: { fontWeight: '500' }
  },
  {
    headerName: 'Claim Processed',
    field: 'checkProcessed',
    width: 130,
    cellRenderer: (params: any) => {
      return params.value ? 'Yes' : 'No'
    },
    cellStyle: (params: any) => {
      return params.value 
        ? { color: '#15803d', fontWeight: '500' } 
        : { color: '#b91c1c', fontWeight: '500' }
    }
  },
  {
    headerName: 'Total Claims',
    field: 'totalClaimCount',
    width: 120,
    type: 'rightAligned',
    cellRenderer: (params: any) => {
      const count = params.value || 0
      if (count === 0 || !onCountClick) return count
      return (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onCountClick(params.data, 'total')
          }}
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {count}
        </span>
      )
    }
  },
  {
    headerName: 'Processed',
    field: 'processedClaimCount',
    width: 110,
    type: 'rightAligned',
    cellRenderer: (params: any) => {
      const count = params.value || 0
      if (count === 0 || !onCountClick) return <span style={{ color: '#6b7280' }}>{count}</span>
      return (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onCountClick(params.data, 'processed')
          }}
          className="text-green-700 hover:text-green-900 hover:underline cursor-pointer font-medium"
        >
          {count}
        </span>
      )
    }
  },
  {
    headerName: 'Partial',
    field: 'partialProcessedClaimCount',
    width: 100,
    type: 'rightAligned',
    cellRenderer: (params: any) => {
      const count = params.value || 0
      if (count === 0 || !onCountClick) return <span style={{ color: '#6b7280' }}>{count}</span>
      return (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onCountClick(params.data, 'partial')
          }}
          className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer font-medium"
        >
          {count}
        </span>
      )
    }
  },
  {
    headerName: 'Unprocessed',
    field: 'unprocessedClaimCount',
    width: 120,
    type: 'rightAligned',
    cellRenderer: (params: any) => {
      const count = params.value || 0
      if (count === 0 || !onCountClick) return <span style={{ color: '#6b7280' }}>{count}</span>
      return (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onCountClick(params.data, 'unprocessed')
          }}
          className="text-red-700 hover:text-red-900 hover:underline cursor-pointer font-medium"
        >
          {count}
        </span>
      )
    }
  },
  {
    headerName: 'Note',
    field: 'note',
    flex: 1,
    minWidth: 200
  }
]

/**
 * ERA Process Page
 * 
 * Electronic Remittance Advice (ERA) processing page for handling
 * insurance payment remittances and claim reconciliation.
 */
export const ERAProcessPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Set document title for better UX
  useDocumentTitle('ERA Process')

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('ERA Process')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Filter states
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [insurance, setInsurance] = useState('')
  const [checkNumber, setCheckNumber] = useState('')
  const [claimId, setClaimId] = useState('')
  const [processedByType, setProcessedByType] = useState<'All' | 'System' | 'Manual'>('All')

  // Check for initial filter from navigation
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter === 'manual') {
      setProcessedByType('Manual')
    } else if (filter === 'system') {
      setProcessedByType('System')
    }
  }, [searchParams])

  // Expanded ERA cards state
  const [expandedERAIds, setExpandedERAIds] = useState<Set<string>>(new Set())

  // ERA data state
  const [eraData] = useState<ERA[]>(mockERAData)

  // Dialog state for claim details
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<ERACheck | null>(null)
  const [selectedERA, setSelectedERA] = useState<ERA | null>(null)
  const [claimFilterType, setClaimFilterType] = useState<'total' | 'processed' | 'partial' | 'unprocessed'>('total')
  const [expandedClaimIds, setExpandedClaimIds] = useState<Set<string>>(new Set())

  // Toggle ERA expansion
  const toggleERAExpansion = (eraId: string) => {
    setExpandedERAIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eraId)) {
        newSet.delete(eraId)
      } else {
        newSet.add(eraId)
      }
      return newSet
    })
  }

  // Navigate to ERA Details Page
  const handleViewERADetails = (era: ERA) => {
    navigate(`/era-process/${era.id}`)
  }

  // Handle ERA file download
  const handleDownloadERA = (era: ERA) => {
    console.log('Downloading ERA file:', era.eraFileName)
    // Download logic will be implemented here
  }

  // Handle count link click to show claim details dialog
  const handleCountClick = (check: ERACheck, filterType: 'total' | 'processed' | 'partial' | 'unprocessed') => {
    // Find the ERA that contains this check
    const parentERA = eraData.find(era => era.checks.some(c => c.id === check.id))
    setSelectedCheck(check)
    setSelectedERA(parentERA || null)
    setClaimFilterType(filterType)
    setClaimDialogOpen(true)
  }

  // Get filtered claims based on filter type
  const getFilteredClaims = (check: ERACheck, filterType: 'total' | 'processed' | 'partial' | 'unprocessed'): Claim[] => {
    if (!check.claims || check.claims.length === 0) return []
    
    switch (filterType) {
      case 'total':
        return check.claims
      case 'processed':
        return check.claims.filter(claim => claim.claimStatus === 'Paid')
      case 'partial':
        return check.claims.filter(claim => claim.claimStatus === 'Partial')
      case 'unprocessed':
        return check.claims.filter(claim => claim.claimStatus === 'Pending' || claim.claimStatus === 'Denied')
      default:
        return check.claims
    }
  }

  // Toggle claim expansion in dialog
  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaimIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(claimId)) {
        newSet.delete(claimId)
      } else {
        newSet.add(claimId)
      }
      return newSet
    })
  }

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages based on item name
    if (itemName === 'Dashboard') {
      navigate('/old-ui-dashboard')
    } else if (itemName === 'Inbox') {
      navigate('/task-hub')
    } else if (itemName === 'Settings') {
      navigate('/settings')
    } else if (itemName === 'Schedule') {
      navigate('/my-calendar')
    } else if (itemName === 'Clients') {
      navigate('/clients')
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard')
    } else if (itemName === 'Billing') {
      navigate('/billing')
    }
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'Claims & Denials') {
      navigate('/claims-denials')
    } else if (itemLabel === 'ERA Process') {
      // Already on this page, no need to navigate
      return
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    } else if (itemLabel === 'Fee Sheet') {
      navigate('/fee-sheet')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Determine if ERA is System or Manual processed
  const isSystemProcessed = (processedBy: string): boolean => {
    // Only entries containing "System" are considered system-processed
    // Everything else (including Admin, person names) is Manual
    return processedBy.toLowerCase().includes('system')
  }

  // Filter ERAs based on all filter criteria
  const getFilteredERAData = (): ERA[] => {
    let filtered = eraData

    if (processedByType === 'System') {
      filtered = filtered.filter(era => isSystemProcessed(era.processedBy))
    } else if (processedByType === 'Manual') {
      filtered = filtered.filter(era => !isSystemProcessed(era.processedBy))
    }

    // Apply other filters
    if (insurance) {
      filtered = filtered.filter(era => 
        era.insurance.toLowerCase().includes(insurance.toLowerCase())
      )
    }

    if (checkNumber) {
      filtered = filtered.filter(era =>
        era.checks.some(check => 
          check.checkNumber.toLowerCase().includes(checkNumber.toLowerCase())
        )
      )
    }

    if (claimId) {
      filtered = filtered.filter(era =>
        era.checks.some(check =>
          check.claims.some(claim =>
            claim.claimNumber.toLowerCase().includes(claimId.toLowerCase()) ||
            claim.id.toLowerCase().includes(claimId.toLowerCase())
          )
        )
      )
    }

    if (dateFrom) {
      filtered = filtered.filter(era => {
        const eraDate = new Date(era.processedOn)
        const fromDate = new Date(dateFrom)
        return eraDate >= fromDate
      })
    }

    if (dateTo) {
      filtered = filtered.filter(era => {
        const eraDate = new Date(era.processedOn)
        const toDate = new Date(dateTo)
        return eraDate <= toDate
      })
    }

    return filtered
  }

  // Handle search/filter
  const handleSearchFilter = () => {
    console.log('Searching ERA with filters:', {
      dateFrom,
      dateTo,
      insurance,
      checkNumber,
      claimId,
      processedByType
    })
    // Filter logic is handled by getFilteredERAData
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Navigation Bar */}
        <TopNavigationBar 
          hospitalName="DrCloud EHR"
          userAvatarUrl="/avatar.png"
          onSearch={handleSearch}
          userInfo={{
            name: "Sarah Johnson",
            role: "front_desk",
            avatar: "/avatar.png"
          }}
        />

        {/* Main Navigation */}
        <MainNavigationBar 
          activeItem="Billing"
          onNavigate={handleMainNavigation}
        />
        
        {/* Main Content Area with Sidebar */}
        <div className="flex-1 overflow-hidden bg-zinc-200 flex relative">
          {/* Desktop Billing Sidebar */}
          {!isMobile && (
            <Sidebar
              activeItem={activeSidebarItem}
              onMenuSelect={handleSidebarSelect}
              onSearch={handleSidebarSearch}
              onCollapsedChange={setSidebarCollapsed}
              defaultCollapsed={sidebarCollapsed}
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
          <div className="flex-1 overflow-hidden bg-zinc-100">
            <div className="h-full flex flex-col">
              {/* Header Section */}
              <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between">
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
                      <Icon icon="exchange-alt" className="w-5 h-5 text-orange-600" />
                      ERA Process
                    </h1>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Electronic Remittance Advice Processing
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Exporting ERA data...')
                        // Export logic will be implemented
                      }}
                    >
                      <Icon icon="file-export" className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Printing ERA data...')
                        window.print()
                      }}
                    >
                      <Icon icon="print" className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="space-y-4">
                  {/* Filter Row */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label htmlFor="dateFrom" className="text-xs font-medium text-gray-700 mb-1">
                        From:
                      </Label>
                      <div className="relative">
                        <Input
                          id="dateFrom"
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="text-sm pr-8"
                        />
                        <Icon 
                          icon="calendar" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="dateTo" className="text-xs font-medium text-gray-700 mb-1">
                        To:
                      </Label>
                      <div className="relative">
                        <Input
                          id="dateTo"
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="text-sm pr-8"
                        />
                        <Icon 
                          icon="calendar" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="insurance" className="text-xs font-medium text-gray-700 mb-1">
                        Insurance:
                      </Label>
                      <Input
                        id="insurance"
                        type="text"
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                        placeholder="Enter insurance name"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkNumber" className="text-xs font-medium text-gray-700 mb-1">
                        Check Number:
                      </Label>
                      <Input
                        id="checkNumber"
                        type="text"
                        value={checkNumber}
                        onChange={(e) => setCheckNumber(e.target.value)}
                        placeholder="Enter check number"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="claimId" className="text-xs font-medium text-gray-700 mb-1">
                        Claim ID:
                      </Label>
                      <Input
                        id="claimId"
                        type="text"
                        value={claimId}
                        onChange={(e) => setClaimId(e.target.value)}
                        placeholder="Enter claim ID"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="processedByType" className="text-xs font-medium text-gray-700 mb-1">
                        Processed By:
                      </Label>
                      <Select value={processedByType} onValueChange={(value: 'All' | 'System' | 'Manual') => setProcessedByType(value)}>
                        <SelectTrigger className="text-sm h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="System">System</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Search Button Row */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSearchFilter}
                      size="sm"
                    >
                      <Icon icon="search" className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button
                      onClick={() => {
                        setDateFrom('')
                        setDateTo('')
                        setInsurance('')
                        setCheckNumber('')
                        setClaimId('')
                        setProcessedByType('All')
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Icon icon="times" className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-4">
                  {(() => {
                    const filteredData = getFilteredERAData()
                    if (filteredData.length === 0) {
                      return (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                          <Icon icon="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No ERA Records Found</h3>
                          <p className="text-sm text-gray-600">
                            Try adjusting your filters or upload a new ERA file to get started.
                          </p>
                        </div>
                      )
                    }
                    return filteredData.map((era) => {
                      const isExpanded = expandedERAIds.has(era.id)
                      const totalAmount = era.checks.reduce((sum, check) => sum + check.checkAmount, 0)
                      
                      return (
                        <div key={era.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          {/* ERA Card Header */}
                          <div 
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => toggleERAExpansion(era.id)}
                          >
                            <div className="flex items-center gap-4">
                              {/* Left Section - Expand/Collapse Button */}
                              <div className="flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleERAExpansion(era.id)
                                  }}
                                  className="p-2"
                                >
                                  <Icon 
                                    icon={isExpanded ? 'chevron-down' : 'chevron-right'} 
                                    className="w-4 h-4" 
                                  />
                                </Button>
                              </div>
                              
                              {/* Middle Section - Main Info */}
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Insurance */}
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1">Insurance</Label>
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={getInsuranceLogo(era.insurance)} 
                                      alt={era.insurance}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <p className="text-sm font-medium text-gray-900">{era.insurance}</p>
                                  </div>
                                </div>
                                
                                {/* Processed On */}
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1">Processed On</Label>
                                  <p className="text-sm text-gray-900">{new Date(era.processedOn).toLocaleDateString()}</p>
                                </div>
                                
                                {/* Processed By */}
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1">Processed By</Label>
                                  <p className="text-sm text-gray-900">{era.processedBy}</p>
                                </div>
                                
                                {/* Notes */}
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1">Notes</Label>
                                  <p className="text-sm text-gray-700 truncate" title={era.notes}>{era.notes}</p>
                                </div>
                                
                                {/* Total Checks */}
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1">Total Checks</Label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900">{era.totalChecks}</p>
                                    <span className="text-xs text-gray-600">
                                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Right Section - Actions */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <TooltipRoot>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownloadERA(era)
                                      }}
                                    >
                                      <Icon icon="download" className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download ERA File</p>
                                  </TooltipContent>
                                </TooltipRoot>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewERADetails(era)
                                  }}
                                >
                                  <Icon icon="eye" className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded Check Details Table */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50">
                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Icon icon="list" className="w-4 h-4 text-blue-600" />
                                  Check Details ({era.checks.length} checks)
                                </h4>
                                
                                <div className="ag-theme-alpine" style={{ height: `${Math.min(era.checks.length * 40 + 36 + 2, 500)}px` }}>
                                  <AgGridReact
                                    rowData={era.checks}
                                    columnDefs={getCheckColumnDefs(handleCountClick)}
                                    defaultColDef={{
                                      sortable: true,
                                      filter: true,
                                      resizable: true,
                                    }}
                                    domLayout="normal"
                                    suppressCellFocus={true}
                                    suppressRowClickSelection={true}
                                    rowSelection={undefined}
                                    rowHeight={40}
                                    headerHeight={36}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Details Dialog */}
        <Dialog open={claimDialogOpen} onOpenChange={(open) => {
          setClaimDialogOpen(open)
          if (!open) {
            setExpandedClaimIds(new Set())
          }
        }}>
          <DialogContent className="sm:max-w-[1200px] lg:max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Processed Claims
            </DialogTitle>
            <DialogDescription className="sr-only">
              View claim details for selected filter
            </DialogDescription>

            {selectedCheck && (
              <div className="flex-1 overflow-auto">
                {/* Summary Information */}
                <div className="bg-gray-50 p-3 mb-4 rounded border border-gray-200 text-sm">
                  <div className="space-y-2">
                    {/* Check Information */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Insurance:</span>
                        <span className="font-medium text-gray-900">{selectedCheck.insurance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Check Number:</span>
                        <span className="font-medium text-gray-900">{selectedCheck.checkNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Check Date:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedCheck.checkDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Check Amount:</span>
                        <span className="font-medium text-gray-900">${selectedCheck.checkAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    
                    {/* Claim Counts */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2 border-t border-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Total Claim Count:</span>
                        <span className="font-medium text-gray-900">{selectedCheck.totalClaimCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Processed Claim Count:</span>
                        <span className="font-medium text-green-700">{selectedCheck.processedClaimCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Partial Processed Claim Count:</span>
                        <span className="font-medium text-amber-700">{selectedCheck.partialProcessedClaimCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Unprocessed Claim Count:</span>
                        <span className="font-medium text-red-700">{selectedCheck.unprocessedClaimCount}</span>
                      </div>
                    </div>
                    
                    {/* Processing Info */}
                    {selectedERA && (
                      <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2 border-t border-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">ERA Settings Used:</span>
                          <button 
                            onClick={() => {
                              console.log('View ERA settings')
                              // TODO: Open ERA settings dialog
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            Default
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Processed By:</span>
                          <span className="font-medium text-gray-900">{selectedERA.processedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Processed On:</span>
                          <span className="font-medium text-gray-900">
                            {(() => {
                              const date = new Date(selectedERA.processedOn)
                              return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claims Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="font-semibold text-gray-700">Claim</TableHead>
                          <TableHead className="font-semibold text-gray-700">Client Name</TableHead>
                          <TableHead className="font-semibold text-gray-700">Claim Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Crossover</TableHead>
                          <TableHead className="font-semibold text-gray-700">Claim From Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Claim To Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Processed</TableHead>
                          <TableHead className="font-semibold text-gray-700">Processing Errors</TableHead>
                          <TableHead className="font-semibold text-gray-700">Warnings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredClaims(selectedCheck, claimFilterType).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                              No claims found for this filter
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredClaims(selectedCheck, claimFilterType).map((claim) => {
                            const isExpanded = expandedClaimIds.has(claim.id)
                            return (
                              <React.Fragment key={claim.id}>
                                <TableRow className="hover:bg-gray-50">
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleClaimExpansion(claim.id)}
                                      className="p-1 h-6 w-6"
                                    >
                                      <Icon 
                                        icon={isExpanded ? 'chevron-down' : 'chevron-right'} 
                                        className="w-4 h-4" 
                                      />
                                    </Button>
                                  </TableCell>
                                  <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                                  <TableCell>{claim.patientName}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      claim.claimStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                      claim.claimStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                                      claim.claimStatus === 'Denied' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {claim.claimStatus}
                                    </span>
                                  </TableCell>
                                  <TableCell>0</TableCell>
                                  <TableCell>{new Date(claim.dateOfService).toLocaleDateString()}</TableCell>
                                  <TableCell>{new Date(claim.dateOfService).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <span className={claim.claimStatus === 'Paid' ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                      {claim.claimStatus === 'Paid' ? 'Yes' : 'No'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-gray-500">-</TableCell>
                                  <TableCell className="text-gray-500">-</TableCell>
                                </TableRow>
                                {isExpanded && (
                                  <>
                                    {/* Service Details */}
                                    <TableRow className="bg-blue-50">
                                      <TableCell colSpan={10} className="p-0">
                                        <div className="p-4">
                                          <h5 className="text-sm font-semibold text-gray-900 mb-3">Service Details</h5>
                                          <Table>
                                            <TableHeader>
                                              <TableRow className="bg-white">
                                                <TableHead className="font-semibold text-gray-700">Service Code</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Modifier</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Revenue Code</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Date Of Service</TableHead>
                                                <TableHead className="font-semibold text-gray-700">To Date Of Service</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Charges</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Paid</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Allowed Amount</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Service Line ID</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Service Processed</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Process Error</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {claim.lineItems.map((lineItem) => (
                                                <TableRow key={lineItem.id} className="bg-white">
                                                  <TableCell>{lineItem.procedureCode}</TableCell>
                                                  <TableCell>-</TableCell>
                                                  <TableCell>-</TableCell>
                                                  <TableCell>{new Date(lineItem.serviceDate).toLocaleDateString()}</TableCell>
                                                  <TableCell>-</TableCell>
                                                  <TableCell>${lineItem.chargedAmount.toFixed(2)}</TableCell>
                                                  <TableCell>${lineItem.paidAmount.toFixed(2)}</TableCell>
                                                  <TableCell>${lineItem.allowedAmount.toFixed(2)}</TableCell>
                                                  <TableCell className="font-mono text-xs">{lineItem.id}</TableCell>
                                                  <TableCell>
                                                    <span className="text-green-700 font-medium">Yes</span>
                                                  </TableCell>
                                                  <TableCell>-</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                    {/* Adjustments */}
                                    {claim.lineItems.some(li => li.adjustmentAmount > 0) && (
                                      <TableRow className="bg-amber-50">
                                        <TableCell colSpan={10} className="p-0">
                                          <div className="p-4">
                                            <h5 className="text-sm font-semibold text-gray-900 mb-3">Adjustments</h5>
                                            <Table>
                                              <TableHeader>
                                                <TableRow className="bg-white">
                                                  <TableHead className="font-semibold text-gray-700">Adjustment Code</TableHead>
                                                  <TableHead className="font-semibold text-gray-700">Adjustment Reason</TableHead>
                                                  <TableHead className="font-semibold text-gray-700">Adjustment Group Code</TableHead>
                                                  <TableHead className="font-semibold text-gray-700">Adjustment Amount</TableHead>
                                                  <TableHead className="font-semibold text-gray-700">Adjustment Units</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {claim.lineItems
                                                  .filter(li => li.adjustmentAmount > 0)
                                                  .map((lineItem) => (
                                                    <TableRow key={`adj-${lineItem.id}`} className="bg-white">
                                                      <TableCell>45</TableCell>
                                                      <TableCell>{lineItem.adjustmentReason || 'Contractual adjustment'}</TableCell>
                                                      <TableCell>CO</TableCell>
                                                      <TableCell>${lineItem.adjustmentAmount.toFixed(2)}</TableCell>
                                                      <TableCell>-</TableCell>
                                                    </TableRow>
                                                  ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </>
                                )}
                              </React.Fragment>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default ERAProcessPage
