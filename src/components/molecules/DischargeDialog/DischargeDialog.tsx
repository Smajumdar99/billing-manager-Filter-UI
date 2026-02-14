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
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface DischargeFormData {
  dischargeDate: string
  dischargeTime: string
  status: string
  witsDischargeTreatmentType: string
  witsDischargeReason: string
  motsTreatmentStatus: string
  drgCode: string
  comments: string
  removePatient: 'all' | 'selected' | 'no'
  deleteAppointments: 'all' | 'selected' | 'no'
}

export interface AdmissionForDischarge {
  id: string
  program: string
  admitDate: string
}

interface DischargeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admission: AdmissionForDischarge
  patientId?: string
  onSubmit: (admissionId: string, data: DischargeFormData) => void
}

const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide'
const fieldSpacing = 'space-y-1.5'

const defaultFormData: DischargeFormData = {
  dischargeDate: format(new Date(), 'MM/dd/yyyy'),
  dischargeTime: format(new Date(), 'hh:mm a'),
  status: 'treatment_completed',
  witsDischargeTreatmentType: 'discharge_from_sa_tx',
  witsDischargeReason: 'treatment_completed',
  motsTreatmentStatus: '',
  drgCode: '',
  comments: '',
  removePatient: 'all',
  deleteAppointments: 'all',
}

/**
 * DischargeDialog - Record discharge details for an admission.
 */
const DischargeDialog: React.FC<DischargeDialogProps> = ({
  open,
  onOpenChange,
  admission,
  patientId,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DischargeFormData>(defaultFormData)

  const update = <K extends keyof DischargeFormData>(key: K, value: DischargeFormData[K]) => {
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
        aria-describedby="discharge-dialog-desc"
        className="sm:max-w-[700px] p-0 flex flex-col max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">Discharge</DialogTitle>
        <DialogDescription id="discharge-dialog-desc" className="sr-only">
          Record discharge details for this admission.
        </DialogDescription>

        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">
            Discharge
          </h2>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto space-y-4">
            {/* Header: Patient ID & Program */}
            {patientId && (
              <div>
                <span className="text-sm font-medium text-gray-700">{patientId}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-700">
                <strong>Program :</strong> {admission.program}
              </span>
            </div>

            {/* Discharge Details */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Discharge Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Discharge Date</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          className="pl-9"
                          value={formData.dischargeDate}
                          onChange={(e) => update('dischargeDate', e.target.value)}
                          placeholder="MM/DD/YYYY"
                        />
                      </div>
                      <div className="relative flex-1 min-w-[100px]">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9"
                          value={formData.dischargeTime}
                          onChange={(e) => update('dischargeTime', e.target.value)}
                          placeholder="--:-- --"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => update('status', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="treatment_completed">Treatment Completed</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                        <SelectItem value="ama">AMA (Against Medical Advice)</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>WITS Discharge Treatment Type</Label>
                    <Select
                      value={formData.witsDischargeTreatmentType}
                      onValueChange={(v) => update('witsDischargeTreatmentType', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discharge_from_sa_tx">DISCHARGE FROM SA TX</SelectItem>
                        <SelectItem value="transfer">TRANSFER</SelectItem>
                        <SelectItem value="ama">AMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>WITS Discharge Reason</Label>
                    <Select
                      value={formData.witsDischargeReason}
                      onValueChange={(v) => update('witsDischargeReason', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="treatment_completed">Treatment completed</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                        <SelectItem value="ama">AMA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>MOTS Treatment Status</Label>
                  <Select
                    value={formData.motsTreatmentStatus}
                    onValueChange={(v) => update('motsTreatmentStatus', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>DRG Code</Label>
                  <p className="text-xs text-gray-500 mb-1">(For Inpatient Billing Use Only)</p>
                  <Input
                    value={formData.drgCode}
                    onChange={(e) => update('drgCode', e.target.value)}
                    placeholder="Enter DRG code"
                  />
                </div>
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

            {/* Patient and Appointment Management */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Patient and Appointment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Remove Patient</Label>
                  <RadioGroup
                    value={formData.removePatient}
                    onValueChange={(v) => update('removePatient', v as DischargeFormData['removePatient'])}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="remove-all" />
                      <Label htmlFor="remove-all" className="font-normal cursor-pointer">
                        From all future group sessions
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="selected" id="remove-selected" />
                      <Label htmlFor="remove-selected" className="font-normal cursor-pointer">
                        From the selected group sessions
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="remove-no" />
                      <Label htmlFor="remove-no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Delete appointments</Label>
                  <RadioGroup
                    value={formData.deleteAppointments}
                    onValueChange={(v) => update('deleteAppointments', v as DischargeFormData['deleteAppointments'])}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="delete-all" />
                      <Label htmlFor="delete-all" className="font-normal cursor-pointer">
                        From all future individual appointments
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="selected" id="delete-selected" />
                      <Label htmlFor="delete-selected" className="font-normal cursor-pointer">
                        From the selected Individual Appointments
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="delete-no" />
                      <Label htmlFor="delete-no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
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

export default DischargeDialog
