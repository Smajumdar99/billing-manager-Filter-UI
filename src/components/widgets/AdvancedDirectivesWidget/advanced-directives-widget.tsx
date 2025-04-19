import { FC } from 'react';
import { Button } from '@/components/atoms/Button/button';
import { PlusIcon, PencilSquareIcon, PrinterIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/atoms/Checkbox/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table/table";
import { cn } from '@/lib/utils';

interface DirectiveItem {
  type: string;
  description: string;
  beginDate: string;
  endDate: string;
  status: string;
  comments: string;
  encounter: number;
  verifiedBy: string;
  lastReviewed: string;
  documentLocation: string;
}

interface AdvancedDirectivesWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const AdvancedDirectivesWidget: FC<AdvancedDirectivesWidgetProps> = ({ patientId, isFullscreen = false }) => {
  const mockDirectives: DirectiveItem[] = [
    {
      type: "Living Will",
      description: "Patient's wishes regarding life-sustaining treatment",
      beginDate: "03/15/2025 10:30:00",
      endDate: "No Expiration",
      status: "Active",
      comments: "Patient has specified no artificial life support if in permanent vegetative state",
      encounter: 1234,
      verifiedBy: "Dr. Smith",
      lastReviewed: "03/15/2025",
      documentLocation: "Legal Documents/Advanced Directives"
    },
    {
      type: "Healthcare POA",
      description: "Durable Power of Attorney for Healthcare Decisions",
      beginDate: "03/10/2025 14:45:00",
      endDate: "No Expiration",
      status: "Active",
      comments: "Spouse designated as primary healthcare decision maker",
      encounter: 1235,
      verifiedBy: "Dr. Johnson",
      lastReviewed: "03/10/2025",
      documentLocation: "Legal Documents/Advanced Directives"
    },
    {
      type: "DNR Order",
      description: "Do Not Resuscitate Order",
      beginDate: "03/20/2025 09:15:00",
      endDate: "03/20/2026 09:15:00",
      status: "Active",
      comments: "Patient has requested no resuscitation in case of cardiac or respiratory arrest",
      encounter: 1236,
      verifiedBy: "Dr. Wilson",
      lastReviewed: "03/20/2025",
      documentLocation: "Legal Documents/Advanced Directives"
    }
  ];

  if (!isFullscreen) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Summary Cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 p-1">
            {mockDirectives.map((directive, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  directive.type === "DNR Order" ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {directive.type === "DNR Order" && (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                      )}
                      {directive.type}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{directive.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    directive.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {directive.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Verified by: {directive.verifiedBy}</span>
                    <span>Last reviewed: {directive.lastReviewed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[40px] pl-4">
                <div className="flex items-center justify-center">
                  <Checkbox />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-left">Title</TableHead>
              <TableHead className="font-semibold text-left">Begin</TableHead>
              <TableHead className="font-semibold text-left">End</TableHead>
              <TableHead className="font-semibold text-left">Status</TableHead>
              <TableHead className="font-semibold text-left">Comments</TableHead>
              <TableHead className="font-semibold text-left">Enc</TableHead>
              <TableHead className="font-semibold text-left">Verified By</TableHead>
              <TableHead className="font-semibold text-left">Last Reviewed</TableHead>
              <TableHead className="font-semibold text-left">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDirectives.map((directive, index) => (
              <TableRow 
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <TableCell className="w-[40px] pl-4 py-4">
                  <div className="flex items-center justify-center">
                    <Checkbox />
                  </div>
                </TableCell>
                <TableCell className="font-medium py-4">
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    {directive.type}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {directive.description}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">{directive.beginDate}</TableCell>
                <TableCell className="py-4 text-sm">{directive.endDate}</TableCell>
                <TableCell className="py-4">
                  <span className="text-red-600 text-sm">{directive.status}</span>
                </TableCell>
                <TableCell className="py-4 text-sm max-w-[200px] truncate" title={directive.comments}>
                  {directive.comments}
                </TableCell>
                <TableCell className="py-4 text-sm">{directive.encounter}</TableCell>
                <TableCell className="py-4 text-sm">{directive.verifiedBy}</TableCell>
                <TableCell className="py-4 text-sm">{directive.lastReviewed}</TableCell>
                <TableCell className="py-4 text-sm">{directive.documentLocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="h-14 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 flex items-center px-4 gap-2">
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Add Directive')}
        >
          <PlusIcon className="w-4 h-4" />
          Add Directive
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Edit Directive')}
        >
          <PencilSquareIcon className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Preview/Print Directive')}
        >
          <PrinterIcon className="w-4 h-4" />
          Preview / Print
        </Button>
      </div>
    </div>
  );
}; 