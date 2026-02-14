import { FC, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Badge } from '@/components/atoms/Badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface FeeSheetDetailsProps {
  isOpen: boolean
  onClose: () => void
  feeSheetId?: string
  patientName?: string
  encounterId?: string
  onSave?: (data: any) => void
}

interface ServiceLine {
  id: string
  codeType: 'CPT' | 'HCPCS'
  code: string
  description: string
  modifier1?: string
  modifier2?: string
  modifier3?: string
  modifier4?: string
  diagnosisPointers: string[]
  units: number
  chargeAmount: number
  allowedAmount?: number
  notes?: string
}

interface DiagnosisCode {
  id: string
  code: string
  description: string
  pointer: string
}

// Mock CPT codes for search
const mockCPTCodes = [
  { code: '90834', description: 'Psychotherapy, 45 minutes' },
  { code: '90837', description: 'Psychotherapy, 60 minutes' },
  { code: '90791', description: 'Psychiatric diagnostic evaluation' },
  { code: '90832', description: 'Psychotherapy, 30 minutes' },
  { code: '99214', description: 'Office visit, established patient, moderate complexity' },
  { code: '99213', description: 'Office visit, established patient, low complexity' },
  { code: '96136', description: 'Psychological testing administration' },
]

// Mock ICD codes
const mockICDCodes = [
  { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
  { code: 'F84.0', description: 'Autistic disorder' },
]

/**
 * FeeSheetDetails Component
 * 
 * Comprehensive fee sheet management interface for healthcare billing
 * Allows users to add/edit services, link diagnoses, and manage charge details
 */
export const FeeSheetDetails: FC<FeeSheetDetailsProps> = ({
  isOpen,
  onClose,
  feeSheetId,
  patientName,
  encounterId,
  onSave,
}) => {
  const [diagnosisCodes, setDiagnosisCodes] = useState<DiagnosisCode[]>([
    { id: '1', code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate', pointer: 'A' },
    { id: '2', code: 'F41.1', description: 'Generalized anxiety disorder', pointer: 'B' },
  ])

  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([
    {
      id: '1',
      codeType: 'CPT',
      code: '90837',
      description: 'Psychotherapy, 60 minutes',
      diagnosisPointers: ['A', 'B'],
      units: 1,
      chargeAmount: 180.00,
      allowedAmount: 180.00,
    },
  ])

  const [showAddService, setShowAddService] = useState(false)
  const [showAddDiagnosis, setShowAddDiagnosis] = useState(false)
  const [searchCPT, setSearchCPT] = useState('')
  const [searchICD, setSearchICD] = useState('')

  // Add new service line
  const handleAddService = (cptCode: { code: string; description: string }) => {
    const newService: ServiceLine = {
      id: Date.now().toString(),
      codeType: 'CPT',
      code: cptCode.code,
      description: cptCode.description,
      diagnosisPointers: [],
      units: 1,
      chargeAmount: 0,
    }
    setServiceLines([...serviceLines, newService])
    setShowAddService(false)
    setSearchCPT('')
  }

  // Add new diagnosis
  const handleAddDiagnosis = (icdCode: { code: string; description: string }) => {
    const nextPointer = String.fromCharCode(65 + diagnosisCodes.length) // A, B, C, D...
    const newDiagnosis: DiagnosisCode = {
      id: Date.now().toString(),
      code: icdCode.code,
      description: icdCode.description,
      pointer: nextPointer,
    }
    setDiagnosisCodes([...diagnosisCodes, newDiagnosis])
    setShowAddDiagnosis(false)
    setSearchICD('')
  }

  // Update service line
  const updateServiceLine = (id: string, field: keyof ServiceLine, value: any) => {
    setServiceLines(serviceLines.map(line =>
      line.id === id ? { ...line, [field]: value } : line
    ))
  }

  // Remove service line
  const removeServiceLine = (id: string) => {
    setServiceLines(serviceLines.filter(line => line.id !== id))
  }

  // Remove diagnosis
  const removeDiagnosis = (id: string) => {
    setDiagnosisCodes(diagnosisCodes.filter(diag => diag.id !== id))
  }

  // Toggle diagnosis pointer for service
  const toggleDiagnosisPointer = (serviceId: string, pointer: string) => {
    setServiceLines(serviceLines.map(line => {
      if (line.id === serviceId) {
        const pointers = line.diagnosisPointers.includes(pointer)
          ? line.diagnosisPointers.filter(p => p !== pointer)
          : [...line.diagnosisPointers, pointer]
        return { ...line, diagnosisPointers: pointers }
      }
      return line
    }))
  }

  // Calculate totals
  const totalCharges = serviceLines.reduce((sum, line) => sum + (line.chargeAmount * line.units), 0)

  const filteredCPTCodes = mockCPTCodes.filter(cpt =>
    cpt.code.toLowerCase().includes(searchCPT.toLowerCase()) ||
    cpt.description.toLowerCase().includes(searchCPT.toLowerCase())
  )

  const filteredICDCodes = mockICDCodes.filter(icd =>
    icd.code.toLowerCase().includes(searchICD.toLowerCase()) ||
    icd.description.toLowerCase().includes(searchICD.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Fee Sheet</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {patientName && `Patient: ${patientName}`}
            {encounterId && ` • Encounter: ${encounterId}`}
            <span className="block mt-1 text-xs">
              Add services and link diagnosis codes for this encounter
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Diagnosis Codes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Diagnosis Codes (ICD-10)</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddDiagnosis(!showAddDiagnosis)}
                className="h-7 text-xs gap-1.5"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add Diagnosis
              </Button>
            </div>

            {/* Add Diagnosis Search */}
            {showAddDiagnosis && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search ICD codes..."
                    value={searchICD}
                    onChange={(e) => setSearchICD(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
                {searchICD && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredICDCodes.map((icd) => (
                      <button
                        key={icd.code}
                        onClick={() => handleAddDiagnosis(icd)}
                        className="w-full text-left px-3 py-2 hover:bg-white rounded text-sm border border-transparent hover:border-gray-200 transition-colors"
                      >
                        <span className="font-mono font-semibold text-gray-900">{icd.code}</span>
                        <span className="text-gray-600 ml-2">{icd.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Diagnosis List */}
            <div className="space-y-2">
              {diagnosisCodes.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded">
                    {diagnosis.pointer}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono font-semibold text-sm text-gray-900">{diagnosis.code}</div>
                    <div className="text-xs text-gray-600">{diagnosis.description}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeDiagnosis(diagnosis.id)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Service Lines Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Service Lines (Procedures)</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddService(!showAddService)}
                className="h-7 text-xs gap-1.5"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add Service
              </Button>
            </div>

            {/* Add Service Search */}
            {showAddService && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search CPT codes..."
                    value={searchCPT}
                    onChange={(e) => setSearchCPT(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
                {searchCPT && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredCPTCodes.map((cpt) => (
                      <button
                        key={cpt.code}
                        onClick={() => handleAddService(cpt)}
                        className="w-full text-left px-3 py-2 hover:bg-white rounded text-sm border border-transparent hover:border-gray-200 transition-colors"
                      >
                        <span className="font-mono font-semibold text-gray-900">{cpt.code}</span>
                        <span className="text-gray-600 ml-2">{cpt.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Service Lines List */}
            <div className="space-y-3">
              {serviceLines.map((service, index) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white space-y-3"
                >
                  {/* Service Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          {service.code}
                        </Badge>
                        <span className="text-xs text-gray-500">Line {index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{service.description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeServiceLine(service.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Service Details Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Units</label>
                      <Input
                        type="number"
                        value={service.units}
                        onChange={(e) => updateServiceLine(service.id, 'units', parseInt(e.target.value) || 1)}
                        className="h-8 text-sm"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Charge Amount</label>
                      <Input
                        type="number"
                        value={service.chargeAmount}
                        onChange={(e) => updateServiceLine(service.id, 'chargeAmount', parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Modifier 1</label>
                      <Input
                        type="text"
                        value={service.modifier1 || ''}
                        onChange={(e) => updateServiceLine(service.id, 'modifier1', e.target.value)}
                        className="h-8 text-sm uppercase"
                        maxLength={2}
                        placeholder="--"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Modifier 2</label>
                      <Input
                        type="text"
                        value={service.modifier2 || ''}
                        onChange={(e) => updateServiceLine(service.id, 'modifier2', e.target.value)}
                        className="h-8 text-sm uppercase"
                        maxLength={2}
                        placeholder="--"
                      />
                    </div>
                  </div>

                  {/* Diagnosis Pointers */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">
                      Link to Diagnosis (Select applicable)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {diagnosisCodes.map((diagnosis) => (
                        <button
                          key={diagnosis.id}
                          onClick={() => toggleDiagnosisPointer(service.id, diagnosis.pointer)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md border-2 transition-all text-xs',
                            service.diagnosisPointers.includes(diagnosis.pointer)
                              ? 'border-blue-600 bg-blue-50 text-blue-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          )}
                        >
                          <span className="font-bold">{diagnosis.pointer}</span>
                          <span className="font-mono">{diagnosis.code}</span>
                          {service.diagnosisPointers.includes(diagnosis.pointer) && (
                            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Notes (Optional)</label>
                    <Input
                      type="text"
                      value={service.notes || ''}
                      onChange={(e) => updateServiceLine(service.id, 'notes', e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
              ))}

              {serviceLines.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No services added yet</p>
                  <p className="text-xs">Click "Add Service" to add procedures</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Summary and Actions */}
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
          {/* Summary */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-600">Total Services:</span>
                <span className="ml-2 font-semibold text-gray-900">{serviceLines.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Units:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {serviceLines.reduce((sum, line) => sum + line.units, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Charges:</span>
                <span className="ml-2 font-semibold text-green-700">
                  ${totalCharges.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave?.({ diagnosisCodes, serviceLines })
                onClose()
              }}
              className="gap-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Save Fee Sheet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeeSheetDetails
