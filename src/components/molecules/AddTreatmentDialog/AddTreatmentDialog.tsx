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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/atoms/Select/select'
import { Label } from '@/components/atoms/Label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup'
import { MultiSelect, type MultiSelectOption } from '@/components/atoms/MultiSelect/multi-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

const labelClass = 'text-sm font-medium text-gray-700'
const fieldSpacing = 'space-y-1.5'

const TREATMENT_OPTIONS = [
  { value: 'sertraline', label: 'Sertraline' },
  { value: 'lorazepam', label: 'Lorazepam' },
  { value: 'metformin', label: 'Metformin' },
  { value: 'lisinopril', label: 'Lisinopril' },
  { value: 'amlodipine', label: 'Amlodipine' },
]

const ORDERED_BY_OPTIONS = [
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
]

const AVAILABLE_GROUPS = [
  'ABABasic',
  'AI Scribe Test',
  'ASAM Subscribers',
  'Accounting',
  'Medical Team',
  'Nursing Staff',
  'Administration',
]

interface AddTreatmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: Record<string, unknown>) => void
}

const AddTreatmentDialog: React.FC<AddTreatmentDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [dateTime, setDateTime] = useState(() =>
    format(new Date(), 'MM/dd/yyyy HH:mm:ss')
  )
  const [treatmentMedication, setTreatmentMedication] = useState('')
  const [orderedBy, setOrderedBy] = useState('internal')
  const [orderedBySelect, setOrderedBySelect] = useState('')
  const [earlyMinutes, setEarlyMinutes] = useState('0')
  const [lateMinutes, setLateMinutes] = useState('0')
  const [notificationReminder, setNotificationReminder] = useState(true)
  const [notificationSms, setNotificationSms] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState(false)
  const [notifyWho, setNotifyWho] = useState<'groups' | 'users'>('groups')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const showOrderSection = !!treatmentMedication

  const groupOptions: MultiSelectOption[] = AVAILABLE_GROUPS.map((g) => ({
    value: g,
    label: g,
  }))

  const handleSave = () => {
    onSave?.({
      dateTime,
      treatmentMedication,
      orderedBy,
      orderedBySelect,
      earlyMinutes,
      lateMinutes,
      notificationReminder,
      notificationSms,
      notificationEmail,
      notifyWho,
      selectedGroups,
    })
    handleClose()
  }

  const handleClose = () => {
    setTreatmentMedication('')
    setOrderedBySelect('')
    setEarlyMinutes('0')
    setLateMinutes('0')
    setNotificationReminder(true)
    setNotificationSms(false)
    setNotificationEmail(false)
    setNotifyWho('groups')
    setSelectedGroups([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        aria-describedby="add-treatment-dialog-desc"
        className="sm:max-w-[600px] p-0 flex flex-col max-h-[85vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        <DialogTitle className="sr-only">Add Treatment</DialogTitle>
        <DialogDescription id="add-treatment-dialog-desc" className="sr-only">
          Add a new treatment or medication.
        </DialogDescription>

        <div className="px-4 py-2 rounded-t-xl flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Add Treatment</h2>
          <Button variant="outline" size="sm" className="text-primary border-primary/50 mr-8">
            RX/Dispense
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="min-w-0 flex-1 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
          <div className="space-y-4">
            <div className={`grid ${showOrderSection ? 'grid-cols-2' : ''} gap-4`}>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Date and Time :</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      className="pl-9"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      placeholder="MM/DD/YYYY HH:mm:ss"
                    />
                  </div>
                </div>
                <div className={fieldSpacing}>
                  <Label className={labelClass}>Treatment/Medication :</Label>
                  <Select
                    value={treatmentMedication}
                    onValueChange={setTreatmentMedication}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-Select-" />
                    </SelectTrigger>
                    <SelectContent>
                      {TREATMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order section - shown when treatment/medication is selected */}
              {showOrderSection && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={fieldSpacing}>
                      <Label className={labelClass}>Ordered By :</Label>
                      <div className="flex gap-2">
                        <Select value={orderedBy} onValueChange={setOrderedBy}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDERED_BY_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={orderedBySelect} onValueChange={setOrderedBySelect}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="-- Select --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                            <SelectItem value="dr-wilson">Dr. Wilson</SelectItem>
                            <SelectItem value="nurse-johnson">Nurse Johnson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className={fieldSpacing}>
                      <Label className={labelClass}>Early if administered</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          className="w-16"
                          value={earlyMinutes}
                          onChange={(e) => setEarlyMinutes(e.target.value)}
                        />
                        <span className="text-sm text-gray-600">minutes before</span>
                      </div>
                    </div>
                    <div className={fieldSpacing}>
                      <Label className={labelClass}>Late if administered</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          className="w-16"
                          value={lateMinutes}
                          onChange={(e) => setLateMinutes(e.target.value)}
                        />
                        <span className="text-sm text-gray-600">minutes after</span>
                      </div>
                    </div>
                  </div>

                  {/* Notification section */}
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Notification method</h4>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="reminder"
                          checked={notificationReminder}
                          onCheckedChange={(c) => setNotificationReminder(!!c)}
                        />
                        <Label htmlFor="reminder" className="font-normal cursor-pointer">
                          Reminder
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sms"
                          checked={notificationSms}
                          onCheckedChange={(c) => setNotificationSms(!!c)}
                        />
                        <Label htmlFor="sms" className="font-normal cursor-pointer">
                          Sms
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="email"
                          checked={notificationEmail}
                          onCheckedChange={(c) => setNotificationEmail(!!c)}
                        />
                        <Label htmlFor="email" className="font-normal cursor-pointer">
                          Email
                        </Label>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-700">Who should be notified?</h4>
                    <RadioGroup
                      value={notifyWho}
                      onValueChange={(v) => setNotifyWho(v as 'groups' | 'users')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="groups" id="groups" />
                        <Label htmlFor="groups" className="font-normal cursor-pointer">
                          Group(s)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="users" id="users" />
                        <Label htmlFor="users" className="font-normal cursor-pointer">
                          User(s)
                        </Label>
                      </div>
                    </RadioGroup>

                    {notifyWho === 'groups' && (
                      <Card className="shadow-none border-gray-200 shrink-0">
                        <CardHeader className="bg-gray-50 border-b border-gray-200 py-2">
                          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-primary" />
                            Select Group(s)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 min-w-0">
                              <MultiSelect
                                options={groupOptions}
                                value={selectedGroups}
                                onChange={setSelectedGroups}
                                placeholder="Search and select groups..."
                                className="w-full"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
          </div>
          </div>
        </div>

        <DialogFooter className="py-2.5 px-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="px-3 h-9 font-normal border border-gray-200 text-sm"
          >
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddTreatmentDialog
