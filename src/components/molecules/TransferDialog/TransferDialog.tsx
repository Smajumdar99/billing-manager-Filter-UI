import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/atoms/Dialog/dialog'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/atoms/Select/select'
import { Label } from '@/components/atoms/Label'
import { Card, CardContent } from '@/components/ui/card'

export interface TransferFormData {
  transferToFacility: string
  transferRemarks: string
}

export interface AdmissionForTransfer {
  id: string
  program: string
}

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForTransfer
  patientId?: string
  programOptions: { value: string; label: string }[]
  onSubmit: (admissionId: string, data: TransferFormData) => void
}

const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide'
const fieldSpacing = 'space-y-1.5'

const defaultFormData: TransferFormData = {
  transferToFacility: '',
  transferRemarks: '',
}

/**
 * TransferDialog - Transfer a patient admission to another facility.
 */
const TransferDialog: React.FC<TransferDialogProps> = ({
  open,
  onOpenChange,
  admission,
  patientId,
  programOptions,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TransferFormData>(defaultFormData)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof TransferFormData>(key: K, value: TransferFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const handleSubmit = () => {
    if (!formData.transferToFacility?.trim()) {
      setError('Transfer To Facility is required')
      return
    }
    onSubmit(admission.id, formData)
    setFormData(defaultFormData)
    setError(null)
    onOpenChange(false)
  }

  const handleClose = () => {
    setFormData(defaultFormData)
    setError(null)
    onOpenChange(false)
  }

  const transferOptions = programOptions.filter((p) => p.value !== admission.program && p.label !== admission.program)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        aria-describedby="transfer-dialog-desc"
        className="sm:max-w-[500px] p-0 flex flex-col max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">Transfer</DialogTitle>
        <DialogDescription id="transfer-dialog-desc" className="sr-only">
          Transfer this admission to another facility.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">Transfer</h2>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {patientId && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">{patientId}</span>
              </div>
            )}

            <Card className="shadow-none border-gray-200">
              <CardContent className="p-4 space-y-4">
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Current Facility</Label>
                  <Input
                    readOnly
                    value={admission.program}
                    className="bg-gray-100 border-gray-200 cursor-not-allowed"
                  />
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>
                    Transfer To Facility <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.transferToFacility}
                    onValueChange={(v) => update('transferToFacility', v)}
                  >
                    <SelectTrigger className={error ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Transfer Remarks</Label>
                  <Textarea
                    value={formData.transferRemarks}
                    onChange={(e) => update('transferRemarks', e.target.value)}
                    placeholder="Enter transfer remarks if any"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="px-3 h-9 font-normal border border-gray-200 text-sm"
          >
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TransferDialog
