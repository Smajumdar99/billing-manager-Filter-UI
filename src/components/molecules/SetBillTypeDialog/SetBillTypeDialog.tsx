"use client"

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface SetBillTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (billType: 'hcfa' | 'ub04') => void;
  selectedEncounters: any[];
}

export const SetBillTypeDialog: FC<SetBillTypeDialogProps> = ({ 
  open, 
  onClose,
  onSubmit,
  selectedEncounters
}) => {
  const [billType, setBillType] = useState<'hcfa' | 'ub04'>('hcfa');

  const handleSubmit = () => {
    onSubmit(billType);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="set-bill-type-dialog-desc"
        className="max-w-[600px] w-full bg-gradient-to-br from-orange-50 to-blue-100 p-0 pt-12"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Set Bill Type</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="set-bill-type-dialog-desc" className="sr-only">
          Set the bill type for selected encounters
        </DialogDescription>
        
        {/* Main Content */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Set Bill Type for the following encounters
            </h2>
            
            {/* Encounters Table */}
            <div className="mb-6 border border-gray-200 rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Client Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Encounter</TableHead>
                    <TableHead className="font-semibold text-gray-700">Encounter Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEncounters.map((encounter) => (
                    <TableRow key={encounter.id}>
                      <TableCell className="font-medium">{encounter.patientName}</TableCell>
                      <TableCell>{encounter.encounterId}</TableCell>
                      <TableCell>{formatDate(encounter.encounterDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Bill Type Selection */}
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-700">
                Bill Type:
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="billType"
                    value="hcfa"
                    checked={billType === 'hcfa'}
                    onChange={(e) => setBillType(e.target.value as 'hcfa' | 'ub04')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700">HCFA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="billType"
                    value="ub04"
                    checked={billType === 'ub04'}
                    onChange={(e) => setBillType(e.target.value as 'hcfa' | 'ub04')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700">UB04</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-4 px-6 bg-white/50 border-t border-gray-200">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button 
              variant="default" 
              onClick={handleSubmit}
              className="min-w-[120px] text-base py-2.5"
            >
              Submit
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="min-w-[120px] text-base py-2.5"
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
