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
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface PauseFormData {
  status: string
  pauseFromDate: string
  pauseFromTime: string
  pauseToDate: string
  pauseToTime: string
  comments: string
}

export interface AdmissionForPause {
  id: string
  program: string
  admitDate: string
}

interface PauseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForPause
  patientId?: string
  onSubmit: (admissionId: string, data: PauseFormData) => void
}

const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide'
const fieldSpacing = 'space-y-1.5'

const defaultFormData: PauseFormData = {
  status: 'medical_necessity',
  pauseFromDate: format(new Date(), 'MM/dd/yyyy'),
  pauseFromTime: format(new Date(), 'hh:mm a'),
  pauseToDate: '',
  pauseToTime: '--:-- --',
  comments: '',
}

/**
 * PauseDialog - Define and manage a pause period for an admission.
 */
const PauseDialog: React.FC<PauseDialogProps> = ({
  open,
  onOpenChange,
  admission,
  patientId,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PauseFormData>(defaultFormData)

  const update = <K extends keyof PauseFormData>(key: K, value: PauseFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(admission.id, formData)
    setFormData(defaultFormData)
    onOpenChange(false)
  }

  const handleClose = () => {
    setFormData(defaultFormData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        aria-describedby="pause-dialog-desc"
        className="sm:max-w-[600px] p-0 flex flex-col max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">Pause Dialogue</DialogTitle>
        <DialogDescription id="pause-dialog-desc" className="sr-only">
          Define pause period for this admission.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            Pause Dialogue
          </h2>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Header: Patient ID */}
            {patientId && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">{patientId}</span>
              </div>
            )}

            {/* Program and Status */}
            <Card className="shadow-none border-gray-200">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Program</Label>
                    <div className="text-sm font-medium text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                      {admission.program}
                    </div>
                  </div>
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => update('status', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical_necessity">Medical Necessity</SelectItem>
                        <SelectItem value="patient_request">Patient Request</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pause Date and Time */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Pause Period
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Pause From Date</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          className="pl-9"
                          value={formData.pauseFromDate}
                          onChange={(e) => update('pauseFromDate', e.target.value)}
                          placeholder="MM/DD/YYYY"
                        />
                      </div>
                      <div className="relative flex-1 min-w-[100px]">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9"
                          value={formData.pauseFromTime}
                          onChange={(e) => update('pauseFromTime', e.target.value)}
                          placeholder="--:-- --"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Pause To Date</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          className="pl-9"
                          value={formData.pauseToDate}
                          onChange={(e) => update('pauseToDate', e.target.value)}
                          placeholder="MM/DD/YYYY"
                        />
                      </div>
                      <div className="relative flex-1 min-w-[100px]">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9"
                          value={formData.pauseToTime}
                          onChange={(e) => update('pauseToTime', e.target.value)}
                          placeholder="--:-- --"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Comments</Label>
                  <Textarea
                    value={formData.comments}
                    onChange={(e) => update('comments', e.target.value)}
                    placeholder="Enter comments..."
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

export default PauseDialog
