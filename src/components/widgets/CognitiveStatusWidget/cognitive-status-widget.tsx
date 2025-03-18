import { FC } from 'react';
import { Button } from '@/components/atoms/Button/button';
import { PlusIcon, PencilSquareIcon, PrinterIcon } from '@heroicons/react/24/outline';
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

interface StatusItem {
  code: string;
  description: string;
  beginDate: string;
  endDate: string;
  status: string;
  comments: string;
  encounter: number;
  reportedByClient: boolean;
  score?: string;
  assessmentType?: string;
}

interface CognitiveStatusWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const CognitiveStatusWidget: FC<CognitiveStatusWidgetProps> = ({ patientId, isFullscreen = false }) => {
  const mockCognitiveStatus: StatusItem[] = [
    {
      code: "MMSE-30",
      description: "Mini-Mental State Examination",
      beginDate: "03/17/2025 17:31:31",
      endDate: "03/25/2025 17:31:34",
      status: "Active",
      comments: "Score indicates mild cognitive impairment",
      encounter: 1234,
      reportedByClient: false,
      score: "24/30",
      assessmentType: "Cognitive Screening"
    },
    {
      code: "MoCA-30",
      description: "Montreal Cognitive Assessment",
      beginDate: "03/17/2025 17:34:18",
      endDate: "03/25/2025 17:34:20",
      status: "Active",
      comments: "Follow-up assessment recommended in 6 months",
      encounter: 1235,
      reportedByClient: false,
      score: "26/30",
      assessmentType: "Comprehensive Assessment"
    },
    {
      code: "GDS-15",
      description: "Geriatric Depression Scale (Short Form)",
      beginDate: "03/18/2025 09:15:00",
      endDate: "03/26/2025 09:15:00",
      status: "Active",
      comments: "Indicates mild depression, monitoring recommended",
      encounter: 1236,
      reportedByClient: true,
      score: "7/15",
      assessmentType: "Depression Screening"
    },
    {
      code: "CDT",
      description: "Clock Drawing Test",
      beginDate: "03/19/2025 14:20:00",
      endDate: "03/27/2025 14:20:00",
      status: "Active",
      comments: "Normal clock drawing abilities",
      encounter: 1237,
      reportedByClient: false,
      score: "4/4",
      assessmentType: "Visuospatial Assessment"
    }
  ];

  if (!isFullscreen) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 p-1">
            {mockCognitiveStatus.map((status, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 text-blue-600">
                      {status.code}
                      {status.score && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          Score: {status.score}
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                    {status.assessmentType && (
                      <p className="text-xs text-gray-500 mt-1">Type: {status.assessmentType}</p>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    status.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {status.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <div className="flex flex-col gap-1">
                    {status.comments && (
                      <span className="text-sm font-medium">Comments: {status.comments}</span>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <span>Begin: {status.beginDate}</span>
                      <span>End: {status.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Enc: {status.encounter}</span>
                      <span>Reported by Client: {status.reportedByClient ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-14 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 flex items-center px-4 gap-2">
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Add Assessment')}
          >
            <PlusIcon className="w-4 h-4" />
            Add Assessment
          </Button>
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Edit Assessment')}
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Preview/Print Assessment')}
          >
            <PrinterIcon className="w-4 h-4" />
            Preview / Print
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[40px] pl-4">
                <div className="flex items-center justify-center">
                  <Checkbox />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-left">Assessment</TableHead>
              <TableHead className="font-semibold text-left">Type</TableHead>
              <TableHead className="font-semibold text-left">Score</TableHead>
              <TableHead className="font-semibold text-left">Begin</TableHead>
              <TableHead className="font-semibold text-left">End</TableHead>
              <TableHead className="font-semibold text-left">Status</TableHead>
              <TableHead className="font-semibold text-left">Comments</TableHead>
              <TableHead className="font-semibold text-left">Enc</TableHead>
              <TableHead className="font-semibold text-left">Reported by Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCognitiveStatus.map((status, index) => (
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
                    {status.code}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {status.description}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">{status.assessmentType}</TableCell>
                <TableCell className="py-4 text-sm">{status.score}</TableCell>
                <TableCell className="py-4 text-sm">{status.beginDate}</TableCell>
                <TableCell className="py-4 text-sm">{status.endDate}</TableCell>
                <TableCell className="py-4">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    status.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {status.status}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-sm max-w-[200px] truncate" title={status.comments}>
                  {status.comments}
                </TableCell>
                <TableCell className="py-4 text-sm">{status.encounter}</TableCell>
                <TableCell className="py-4 text-sm">
                  {status.reportedByClient ? "Yes" : "No"}
                </TableCell>
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
          onClick={() => console.log('Add Assessment')}
        >
          <PlusIcon className="w-4 h-4" />
          Add Assessment
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Edit Assessment')}
        >
          <PencilSquareIcon className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Preview/Print Assessment')}
        >
          <PrinterIcon className="w-4 h-4" />
          Preview / Print
        </Button>
      </div>
    </div>
  );
}; 