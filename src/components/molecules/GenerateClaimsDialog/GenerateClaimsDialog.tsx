"use client"

import { FC } from 'react';
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

interface ClaimData {
  claimNo: string;
  billType: string;
  clientName: string;
  encounter: string;
  x12Partner: string;
  status: string;
  errorsWarnings: string;
  serviceCodes: string;
  claimRuleApplied: string;
}

interface GenerateClaimsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEncounters?: any[];
}

// Mock data based on the screenshot
const mockClaimsData: ClaimData[] = [
  {
    claimNo: 'P-1005811-1008022200[TEST]',
    billType: 'HCFA',
    clientName: 'Story, Toi[1004681]',
    encounter: '100206884 Avallity',
    x12Partner: 'Avallity',
    status: 'Created',
    errorsWarnings: 'Missing Claim Service Charge, Missing Rendering Physician Taxonomy, Missing Insurance TPL Code, Missing TPL Status Code',
    serviceCodes: '90296,90375',
    claimRuleApplied: 'DEFAULT'
  },
  {
    claimNo: 'P-1005232-1008032300[TEST]',
    billType: 'HCFA',
    clientName: 'Clouds, Passing[1005232]',
    encounter: '100217896 Office Ally',
    x12Partner: 'Avallity',
    status: 'Created',
    errorsWarnings: 'Missing Rendering Physician Taxonomy, Missing Insurance TPL Code, Missing TPL Status Code',
    serviceCodes: '90834',
    claimRuleApplied: 'DEFAULT'
  }
];

export const GenerateClaimsDialog: FC<GenerateClaimsDialogProps> = ({ 
  open, 
  onClose
}) => {
  
  const handlePrint = () => {
    console.log('Print claims');
  };

  const handleExport = () => {
    console.log('Export claims');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="generate-claims-dialog-desc"
        className="max-w-[95vw] w-full min-h-[600px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100 p-0 flex flex-col items-start"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Generate Claims</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="generate-claims-dialog-desc" className="sr-only">
          View and manage generated claims with details including claim numbers, billing types, and status information
        </DialogDescription>
        
        {/* Dialog Title */}
        <div className="px-6 py-4 rounded-t-xl w-full">
          <h2 className="text-lg font-semibold text-gray-900">Claim(s)</h2>
          <p className="text-sm text-gray-600 mt-1">
            NOTE: Either X12/837 partner should be mapped to insurance company, if not no electronic claim(s) will be generated
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden px-6 pb-4 w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
            {/* Table Container with Scroll */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Claim No</TableHead>
                    <TableHead className="font-semibold text-gray-700">Bill Type</TableHead>
                    <TableHead className="font-semibold text-gray-700">Client Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Encounter</TableHead>
                    <TableHead className="font-semibold text-gray-700">X12/837 Partner</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Errors Warnings</TableHead>
                    <TableHead className="font-semibold text-gray-700">Service Codes</TableHead>
                    <TableHead className="font-semibold text-gray-700">Claim Rule Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClaimsData.map((claim, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <a href="#" className="text-blue-600 hover:underline text-sm">
                          {claim.claimNo}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">{claim.billType}</TableCell>
                      <TableCell className="text-sm">{claim.clientName}</TableCell>
                      <TableCell className="text-sm">{claim.encounter}</TableCell>
                      <TableCell className="text-sm">{claim.x12Partner}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {claim.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-red-600 max-w-xs">
                        <div className="line-clamp-2" title={claim.errorsWarnings}>
                          {claim.errorsWarnings}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{claim.serviceCodes}</TableCell>
                      <TableCell className="text-sm">{claim.claimRuleApplied}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-3 px-6 bg-white/50 border-t border-gray-200 w-full">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="text-sm"
            >
              Print
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="text-sm"
            >
              Export
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
