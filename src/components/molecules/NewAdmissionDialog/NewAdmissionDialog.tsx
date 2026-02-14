"use client"

import { FC, useState } from 'react'
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select'
import { Label } from '@/components/atoms/Label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup'
import { CalendarIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface NewAdmissionFormData {
  admitDate: string
  admitTime: string
  program: string
  legalStatus: 'legal' | 'non-legal' | ''
  tentativeDischargeDate: string
  tentativeDischargeTime: string
  status: string
  comments: string
  provider: string
  providerEffectiveDate: string
  providerEndDate: string
  typeOfCare: string
  referringProvider: string
  referringNpi: string
  bookingNumber: string
  primaryCaseNumber: string
  otherCaseNumber: string
  commitmentDate: string
  admissionType: string
  admissionSource: string
  admissionDiagnosis: string
  addToGroupSessions: 'all' | 'selected' | 'no'
  effectiveFrom: string
}

interface NewAdmissionDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: NewAdmissionFormData) => void
  patientId?: string
  patientName?: string
}

const defaultFormData: NewAdmissionFormData = {
  admitDate: format(new Date(), 'MM/dd/yyyy'),
  admitTime: format(new Date(), 'hh:mm a'),
  tentativeDischargeTime: '',
  tentativeDischargeDate: '',
  program: '',
  legalStatus: '',
  status: '',
  comments: '',
  provider: '',
  providerEffectiveDate: '',
  providerEndDate: '',
  typeOfCare: 'inpatient_part_a',
  referringProvider: '',
  referringNpi: '',
  bookingNumber: '',
  primaryCaseNumber: '',
  otherCaseNumber: '',
  commitmentDate: '',
  admissionType: 'urgent',
  admissionSource: '',
  admissionDiagnosis: '',
  addToGroupSessions: 'no',
  effectiveFrom: format(new Date(), 'MM/dd/yyyy'),
}

const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide'
const fieldSpacing = 'space-y-1.5'

export const NewAdmissionDialog: FC<NewAdmissionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  patientId = '007 007 (1005015)',
  patientName,
}) => {
  const [formData, setFormData] = useState<NewAdmissionFormData>(defaultFormData)
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false)

  const update = <K extends keyof NewAdmissionFormData>(key: K, value: NewAdmissionFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData(defaultFormData)
    onClose()
  }

  const handleClose = () => {
    setFormData(defaultFormData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        aria-describedby="new-admission-dialog-desc"
        className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">New Admission</DialogTitle>
        <DialogDescription id="new-admission-dialog-desc" className="sr-only">
          Enter new admission details and then click on submit
        </DialogDescription>
        {/* Dialog Title - matches New Task */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">New Admission</h2>
        </div>
        {/* Main content - matches New Task layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          {/* Form card - white rounded card like New Task */}
          <div className="min-w-0 flex-1 p-4 sm:p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-y-auto">
            {/* Section: Patient & Room */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Patient & Room</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700">{patientId}</span>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Check Room Availability
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Section: Admission Dates */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Admission Dates</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Admit Date</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      value={formData.admitDate}
                      onChange={(e) => update('admitDate', e.target.value)}
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div className="relative flex-1 min-w-[100px]">
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      value={formData.admitTime}
                      onChange={(e) => update('admitTime', e.target.value)}
                      placeholder="03:40 PM"
                    />
                  </div>
                </div>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Program</Label>
                <Select value={formData.program} onValueChange={(v) => update('program', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ksr">KSR Multispecialty Hospital</SelectItem>
                    <SelectItem value="aado">A-AADO</SelectItem>
                    <SelectItem value="ameth">A-METH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Legal Status</Label>
                <RadioGroup
                  value={formData.legalStatus}
                  onValueChange={(v) => update('legalStatus', v as NewAdmissionFormData['legalStatus'])}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="legal" id="legal" />
                    <Label htmlFor="legal" className="font-normal cursor-pointer">Legal</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="non-legal" id="non-legal" />
                    <Label htmlFor="non-legal" className="font-normal cursor-pointer">Non-Legal</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className={fieldSpacing}>
                <div className="flex justify-between items-center">
                  <Label className={labelClass}>Tentative Discharge Date</Label>
                  <button type="button" className="text-xs text-primary hover:underline">Clear</button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      value={formData.tentativeDischargeDate}
                      onChange={(e) => update('tentativeDischargeDate', e.target.value)}
                      placeholder="-- : -- --"
                    />
                  </div>
                  <div className="relative flex-1 min-w-[80px]">
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      value={formData.tentativeDischargeTime}
                      onChange={(e) => update('tentativeDischargeTime', e.target.value)}
                      placeholder="-- : -- --"
                    />
                  </div>
                </div>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Status</Label>
                <Select value={formData.status} onValueChange={(v) => update('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Section: Comments */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Comments</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
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

            {/* Section: Provider Information */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Provider</Label>
                <Select value={formData.provider} onValueChange={(v) => update('provider', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Unassigned --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin, Ensoftek</SelectItem>
                    <SelectItem value="specialist">Specialist, ENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Provider Effective Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    value={formData.providerEffectiveDate}
                    onChange={(e) => update('providerEffectiveDate', e.target.value)}
                    placeholder="-- : -- --"
                  />
                </div>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Provider End Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    value={formData.providerEndDate}
                    onChange={(e) => update('providerEndDate', e.target.value)}
                    placeholder="-- : -- --"
                  />
                </div>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Section: Care & Referring */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Care & Referring</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Type Of Care</Label>
                <Select value={formData.typeOfCare} onValueChange={(v) => update('typeOfCare', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inpatient_part_a">Inpatient Part A</SelectItem>
                    <SelectItem value="inpatient_part_b">Inpatient Part B</SelectItem>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Referring Provider</Label>
                <Select value={formData.referringProvider} onValueChange={(v) => update('referringProvider', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specialist">Specialist, ENT</SelectItem>
                    <SelectItem value="admin">Admin, Ensoftek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Referring NPI</Label>
                <Input
                  value={formData.referringNpi}
                  onChange={(e) => update('referringNpi', e.target.value)}
                  placeholder="9119111232"
                />
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Section: Case Numbers */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Case Numbers</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Booking#</Label>
                <Input
                  value={formData.bookingNumber}
                  onChange={(e) => update('bookingNumber', e.target.value)}
                />
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Primary Case#</Label>
                <Input
                  value={formData.primaryCaseNumber}
                  onChange={(e) => update('primaryCaseNumber', e.target.value)}
                />
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Other Case#</Label>
                <Input
                  value={formData.otherCaseNumber}
                  onChange={(e) => update('otherCaseNumber', e.target.value)}
                />
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Commitment Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    value={formData.commitmentDate}
                    onChange={(e) => update('commitmentDate', e.target.value)}
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Section: Admission Details */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Admission Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={fieldSpacing}>
                <Label className={labelClass}>Admission Type</Label>
                <Select value={formData.admissionType} onValueChange={(v) => update('admissionType', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Admission Source</Label>
                <Select value={formData.admissionSource} onValueChange={(v) => update('admissionSource', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="readmission">Readmission to the same H</SelectItem>
                    <SelectItem value="transfer">Transfer from hospital</SelectItem>
                    <SelectItem value="er">Emergency room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldSpacing}>
                <Label className={labelClass}>Admission Diagnosis</Label>
                <div className="flex gap-2">
                  <Select value={formData.admissionDiagnosis} onValueChange={(v) => update('admissionDiagnosis', v)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Please Select a Diagnosis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dx1">Diagnosis 1</SelectItem>
                      <SelectItem value="dx2">Diagnosis 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="sm">Add</Button>
                </div>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Section: Additional Details */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <button
                  type="button"
                  onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                  className="w-full flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-primary transition-colors text-left"
                >
                  {showAdditionalDetails ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  Additional Details
                </button>
              </CardHeader>
              {showAdditionalDetails && (
                <CardContent className="p-4 space-y-3">
                  <div className={fieldSpacing}>
                    <Label className={labelClass}>Common Medications</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="med1">Medication 1</SelectItem>
                        <SelectItem value="med2">Medication 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Section: Group Sessions */}
            <Card className="shadow-none border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                <CardTitle className="text-sm font-semibold text-gray-800">Group Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
            <div>
              <Label className={cn(labelClass, 'block mb-3')}>Add Individual</Label>
              <div className="flex flex-wrap items-center gap-4">
                <RadioGroup
                  value={formData.addToGroupSessions}
                  onValueChange={(v) => update('addToGroupSessions', v as NewAdmissionFormData['addToGroupSessions'])}
                  className="flex gap-6 flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="group-all" />
                    <Label htmlFor="group-all" className="font-normal cursor-pointer">To all ongoing group sessions</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="selected" id="group-selected" />
                    <Label htmlFor="group-selected" className="font-normal cursor-pointer">To the selected group sessions</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="group-no" />
                    <Label htmlFor="group-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                <span className="text-sm text-gray-500">With Effective From:</span>
                <div className="relative inline-flex">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 w-[140px]"
                    value={formData.effectiveFrom}
                    onChange={(e) => update('effectiveFrom', e.target.value)}
                  />
                </div>
              </div>
            </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer - matches New Task */}
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={handleClose} className="px-3 h-9 font-normal border border-gray-200 text-sm">
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
