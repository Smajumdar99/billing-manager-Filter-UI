"use client"

import { FC, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { BillingEncounter } from '@/types/billing-manager'
import { format as formatDate } from "date-fns"

interface OverrideDialogProps {
  open: boolean
  onClose: () => void
  encounters: BillingEncounter[]
  onConfirm: (reason: string, notes: string) => void
  actionType?: 'override' | 'override_and_generate'
}

const OVERRIDE_REASONS = [
  { value: 'provider_request', label: 'Provider Request' },
  { value: 'authorization_received', label: 'Authorization Received' },
  { value: 'error_correction', label: 'Error Correction' },
  { value: 'billing_exception', label: 'Billing Exception' },
  { value: 'administrative_override', label: 'Administrative Override' },
  { value: 'other', label: 'Other' },
]

export const OverrideDialog: FC<OverrideDialogProps> = ({
  open,
  onClose,
  encounters,
  onConfirm,
  actionType = 'override'
}) => {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!reason) {
      return
    }

    setIsSubmitting(true)
    try {
      await onConfirm(reason, notes)
      handleClose()
    } catch (error) {
      console.error('Error confirming override:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setNotes('')
    setIsSubmitting(false)
    onClose()
  }

  const dialogTitle = actionType === 'override_and_generate' 
    ? 'Override and Generate Claims' 
    : 'Override Billing Blocks'

  const dialogDescription = actionType === 'override_and_generate'
    ? 'Override billing blocks and generate claims for the selected encounters. Please provide a reason for this action.'
    : 'Override billing blocks for the selected encounters. Please provide a reason for this action.'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-blue-100 p-0">
        <div className="p-6">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </div>

        <div className="space-y-6 px-6 pb-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <label htmlFor="override-reason" className="text-sm font-semibold text-gray-900">
              Reason <span className="text-red-500">*</span>
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="override-reason" className="w-full">
                <SelectValue placeholder="Select a reason for override" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {OVERRIDE_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="override-notes" className="text-sm font-semibold text-gray-900">
              Notes
            </label>
            <Textarea
              id="override-notes"
              placeholder="Add any additional notes or details about this override..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500">
              Optional: Provide additional context for this override action
            </p>
          </div>

          {/* Encounters Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Selected Encounters ({encounters.length})
            </h3>
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Encounter ID</TableHead>
                    <TableHead>Encounter Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {encounters.map((encounter) => (
                    <TableRow key={encounter.id}>
                      <TableCell className="font-medium">
                        {encounter.patientName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {encounter.id}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(new Date(encounter.dateOfService), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${encounter.totalCharges.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 px-6 pb-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-3 h-9 font-normal border-gray-200 text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : actionType === 'override_and_generate' ? 'Override & Generate' : 'Confirm Override'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OverrideDialog
